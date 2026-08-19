// Alerte email sur réclamation produit (SOT décision 2026-08-17).
//
// Déclenchée par un trigger Postgres sur `public.avis` quand la colonne
// `reclamation` est renseignée. Envoie un mail via SMTP Zoho à l'adresse
// d'alerte, puis marque la ligne (`alerte_envoyee_at`) pour éviter les doublons.
//
// Aucun secret n'est écrit ici : tout vient des variables d'environnement
// (secrets Edge Function, réglés dans le dashboard Supabase).
//
// Conformité : le contenu du mail est purement factuel — aucune allégation
// santé, même implicite (cf. docs/01_adn/conformite.md).

import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

const SMTP_HOST = Deno.env.get('ZOHO_SMTP_HOST') ?? 'smtp.zoho.eu'
const SMTP_PORT = Number(Deno.env.get('ZOHO_SMTP_PORT') ?? '465')
const SMTP_USER = Deno.env.get('ZOHO_USER') ?? ''
const SMTP_PASSWORD = Deno.env.get('ZOHO_APP_PASSWORD') ?? ''
const ALERT_TO = Deno.env.get('ALERTE_DESTINATAIRE') ?? SMTP_USER
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

  if (!SMTP_USER || !SMTP_PASSWORD) {
    console.error('Secrets SMTP manquants (ZOHO_USER / ZOHO_APP_PASSWORD)')
    return new Response(JSON.stringify({ error: 'smtp_not_configured' }), {
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

  const client = new SMTPClient({
    connection: {
      hostname: SMTP_HOST,
      port: SMTP_PORT,
      tls: true,
      auth: { username: SMTP_USER, password: SMTP_PASSWORD },
    },
  })

  try {
    await client.send({
      from: SMTP_USER,
      to: ALERT_TO,
      replyTo: record.email ?? undefined,
      subject: `Lédjé — réclamation reçue (${recuFr})`,
      content: corpsTexte,
      html: corpsHtml,
    })
    await client.close()
  } catch (e) {
    console.error('Echec envoi SMTP', e)
    try { await client.close() } catch { /* déjà fermé */ }
    return new Response(JSON.stringify({ error: 'smtp_failed' }), {
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
