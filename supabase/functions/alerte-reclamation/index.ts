// Alerte email sur réclamation produit (SOT décision 2026-08-17).
//
// Déclenchée par un trigger Postgres sur `public.avis` quand la colonne
// `reclamation` est renseignée. Envoie un mail via l'API Resend à l'adresse
// d'alerte, puis marque la ligne (`alerte_envoyee_at`) pour éviter les doublons.
//
// Historique : la v1 passait par SMTP Zoho — abandonné, le plan gratuit Zoho
// Mail bloque IMAP/POP/SMTP (535 Authentication Failed, confirmé par les logs
// le 2026-09-03). Resend est une API HTTP, aucun protocole SMTP en jeu.
//
// Aucun secret n'est écrit ici : tout vient des variables d'environnement
// (secrets Edge Function, réglés dans le dashboard Supabase).
//
// Conformité : le contenu du mail est purement factuel — aucune allégation
// santé, même implicite (cf. docs/01_adn/conformite.md).

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
// Tant qu'aucun domaine n'est vérifié sur Resend, seul le domaine de test
// onboarding@resend.dev peut envoyer — et uniquement vers l'adresse du compte
// Resend. Une fois ledje.fr vérifié, passer RESEND_FROM à une adresse @ledje.fr.
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'Lédjé <onboarding@resend.dev>'
const ALERT_TO = Deno.env.get('ALERTE_DESTINATAIRE') ?? ''
const ALERTE_SECRET = Deno.env.get('ALERTE_SECRET') ?? ''

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

type AvisRecord = {
  id?: string
  created_at?: string
  reclamation?: string | null
  email?: string | null
  consumption_since?: string | null
  frequency_intent?: string | null
  taste_rating?: number | null
}

function txt(v: unknown, fallback = 'non renseigné') {
  return v === null || v === undefined || v === '' ? fallback : String(v)
}

/* Échappement HTML — le contenu vient d'un formulaire public. */
function esc(v: unknown) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  )
}

async function marquerEnvoyee(id: string) {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !id) return
  await fetch(`${SUPABASE_URL}/rest/v1/avis?id=eq.${id}`, {
    method: 'PATCH',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ alerte_envoyee_at: new Date().toISOString() }),
  })
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  // Authentification : secret partagé avec le trigger Postgres.
  if (!ALERTE_SECRET || req.headers.get('x-alerte-secret') !== ALERTE_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!RESEND_API_KEY || !ALERT_TO) {
    console.error('Secrets Resend manquants (RESEND_API_KEY / ALERTE_DESTINATAIRE)')
    return new Response(JSON.stringify({ error: 'resend_not_configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let record: AvisRecord
  try {
    const body = await req.json()
    record = body?.record ?? body
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  const reclamation = record?.reclamation?.trim()
  if (!reclamation) {
    // Rien à signaler : ce n'est pas une erreur.
    return new Response(JSON.stringify({ skipped: 'pas de réclamation' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const recu = record.created_at ? new Date(record.created_at) : new Date()
  const recuFr = recu.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
  const contact = txt(record.email, 'aucun email laissé')

  const corpsTexte = [
    'Une réclamation a été déposée sur ledje.fr/avis.',
    '',
    `Reçue le : ${recuFr}`,
    `Contact : ${contact}`,
    `Depuis quand : ${txt(record.consumption_since)}`,
    `Fréquence envisagée : ${txt(record.frequency_intent)}`,
    `Note du goût : ${txt(record.taste_rating)}`,
    '',
    'Ce qui est signalé :',
    reclamation,
    '',
    `Référence : ${txt(record.id)}`,
  ].join('\n')

  const corpsHtml = `
    <p>Une réclamation a été déposée sur <strong>ledje.fr/avis</strong>.</p>
    <p>
      <strong>Reçue le :</strong> ${esc(recuFr)}<br>
      <strong>Contact :</strong> ${esc(contact)}<br>
      <strong>Depuis quand :</strong> ${esc(txt(record.consumption_since))}<br>
      <strong>Fréquence envisagée :</strong> ${esc(txt(record.frequency_intent))}<br>
      <strong>Note du goût :</strong> ${esc(txt(record.taste_rating))}
    </p>
    <p><strong>Ce qui est signalé :</strong></p>
    <blockquote style="border-left:3px solid #E8B65C;padding-left:12px;margin-left:0">
      ${esc(reclamation).replace(/\n/g, '<br>')}
    </blockquote>
    <p style="color:#666;font-size:12px">Référence : ${esc(txt(record.id))}</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [ALERT_TO],
        reply_to: record.email || undefined,
        subject: `Lédjé — réclamation reçue (${recuFr})`,
        text: corpsTexte,
        html: corpsHtml,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Echec envoi Resend', res.status, detail)
      return new Response(JSON.stringify({ error: 'resend_failed', status: res.status }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (e) {
    console.error('Echec envoi Resend', e)
    return new Response(JSON.stringify({ error: 'resend_failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (record.id) await marquerEnvoyee(record.id)

  return new Response(JSON.stringify({ sent: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
