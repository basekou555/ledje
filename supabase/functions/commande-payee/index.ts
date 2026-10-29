// Mail à Basekou quand un paiement Stripe aboutit (demande du 2026-10-22 :
// « un mail pour moi une fois le paiement effectué, avec le contenu du
// formulaire »).
//
// Déclenchée par un WEBHOOK STRIPE sur `checkout.session.completed`, et pas
// par le site : un client qui ferme l'onglet après avoir payé ne déclenche
// rien côté navigateur. C'est précisément ce que le navigateur ne peut pas
// garantir qui justifie cette fonction.
//
// Le contenu du formulaire n'est PAS dans l'événement Stripe : il est en base.
// Stripe ne transporte que `client_reference_id`, l'identifiant de la ligne
// `commandes` posé par le site. On relit donc la ligne avec la clé de service.
//
// Envoi par l'API HTTP de Resend, comme `alerte-reclamation` — même compte,
// mêmes secrets. Historique à ne pas refaire : SMTP Zoho a été abandonné, le
// plan gratuit bloque SMTP (535 Authentication Failed, logs du 2026-09-03).
//
// Aucun secret n'est écrit ici : tout vient des variables d'environnement.
//
// Conformité : le mail est factuel et interne — aucune allégation santé, même
// implicite (cf. docs/01_adn/conformite.md).

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
const RESEND_FROM = Deno.env.get('RESEND_FROM') ?? 'Lédjé <onboarding@resend.dev>'
const ALERT_TO = Deno.env.get('ALERTE_DESTINATAIRE') ?? ''

// Secrets de signature des webhooks, donnés par Stripe à la création de
// chaque endpoint. Sans aucun des deux la fonction refuse tout : un endpoint
// public qui croit n'importe quel corps JSON, c'est un faux « paiement reçu »
// à la demande.
//
// DEUX secrets, parce que LE MODE TEST DE STRIPE A LE SIEN. Mode réel et mode
// test sont deux mondes séparés : produits, prix, liens, cartes et webhooks y
// sont distincts, et un secret ne vaut pas dans l'autre. Ajouté le 2026-10-23,
// quand Basekou a demandé à tester sans vrai paiement.
//
// ✅ On essaie les deux à la vérification : ça permet d'éprouver toute la
// chaîne — paiement, webhook, lecture en base, mail — avec une carte fictive,
// sans qu'un euro bouge et sans toucher au réglage du mode réel.
// ⚠️ Garde-fou à connaître : un événement de TEST produit donc un VRAI mail.
// `livemode`, porté par l'événement, sert à le dire dans l'objet du message.
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
const STRIPE_WEBHOOK_SECRET_TEST = Deno.env.get('STRIPE_WEBHOOK_SECRET_TEST') ?? ''
const SECRETS = [STRIPE_WEBHOOK_SECRET, STRIPE_WEBHOOK_SECRET_TEST].filter(Boolean)

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

type Commande = {
  id?: string
  created_at?: string
  packs?: number | null
  ville?: string | null
  hors_zone?: boolean | null
  quand?: string | null
  nom?: string | null
  contact?: string | null
  canal?: string | null
  message?: string | null
  utm_source?: string | null
}

function txt(v: unknown, fallback = 'non renseigné') {
  return v === null || v === undefined || v === '' ? fallback : String(v)
}

/* Échappement HTML — tout ce qui suit vient d'un formulaire public. */
function esc(v: unknown) {
  return String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  )
}

/* Vérification de la signature Stripe, à la main.
   Pas de SDK : l'algorithme est court et documenté — l'en-tête `Stripe-
   Signature` porte un horodatage `t=` et une ou plusieurs signatures `v1=`,
   chacune étant un HMAC-SHA256 de `<t>.<corps brut>` avec le secret.

   ⚠️ LE CORPS DOIT ÊTRE LE TEXTE BRUT, jamais un JSON re-sérialisé : un
   `JSON.parse` suivi d'un `JSON.stringify` change les espaces et invalide la
   signature. C'est le piège classique de cette vérification.

   On refuse aussi un horodatage trop vieux (tolérance 5 min), sinon une
   requête valide capturée une fois pourrait être rejouée indéfiniment. */
async function signatureValide(brut: string, entete: string | null): Promise<boolean> {
  if (!entete || SECRETS.length === 0) return false

  const parts = new Map<string, string[]>()
  for (const morceau of entete.split(',')) {
    const [cle, valeur] = morceau.split('=', 2)
    if (!cle || !valeur) continue
    const liste = parts.get(cle.trim()) ?? []
    liste.push(valeur.trim())
    parts.set(cle.trim(), liste)
  }

  const t = parts.get('t')?.[0]
  const signatures = parts.get('v1') ?? []
  if (!t || signatures.length === 0) return false

  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(t))
  if (!Number.isFinite(age) || age > 300) return false

  // Comparaison à temps constant : une comparaison qui s'arrête au premier
  // octet différent laisse mesurer la signature attendue.
  const egal = (a: string, b: string) => {
    if (a.length !== b.length) return false
    let diff = 0
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
    return diff === 0
  }

  // Un secret par mode : l'événement vient de l'un ou de l'autre, jamais des
  // deux. On essaie chacun, et il suffit qu'UN corresponde.
  for (const secret of SECRETS) {
    const cle = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const brutSigne = await crypto.subtle.sign('HMAC', cle, new TextEncoder().encode(`${t}.${brut}`))
    const attendue = Array.from(new Uint8Array(brutSigne))
      .map(o => o.toString(16).padStart(2, '0'))
      .join('')
    if (signatures.some(sig => egal(sig, attendue))) return true
  }
  return false
}

async function lireCommande(id: string): Promise<Commande | null> {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !id) return null
  // La table est INSERT-only pour `anon` et n'a AUCUNE policy SELECT : seule
  // la clé de service peut relire, et elle ne quitte jamais ce serveur.
  const res = await fetch(`${SUPABASE_URL}/rest/v1/commandes?id=eq.${encodeURIComponent(id)}&select=*`, {
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
  })
  if (!res.ok) {
    console.error('Lecture commande impossible', res.status, await res.text())
    return null
  }
  const lignes = (await res.json()) as Commande[]
  return lignes?.[0] ?? null
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 })

  if (SECRETS.length === 0) {
    console.error('Aucun secret de webhook (STRIPE_WEBHOOK_SECRET / _TEST) — la fonction refuse tout')
    return new Response(JSON.stringify({ error: 'webhook_not_configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const brut = await req.text()
  if (!(await signatureValide(brut, req.headers.get('Stripe-Signature')))) {
    return new Response('Unauthorized', { status: 401 })
  }

  let evenement: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    evenement = JSON.parse(brut)
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  // On ne traite qu'un paiement abouti. Tout le reste répond 200 : un webhook
  // qui renvoie une erreur sur un événement qu'il ne veut pas voir est
  // réessayé en boucle par Stripe.
  if (evenement.type !== 'checkout.session.completed') {
    return new Response(JSON.stringify({ skipped: evenement.type ?? 'inconnu' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // `livemode` est porté par l'événement lui-même : c'est Stripe qui dit de
  // quel monde il vient. On ne le déduit PAS du secret qui a validé.
  const reel = (evenement as { livemode?: boolean }).livemode !== false
  const session = evenement.data?.object ?? {}
  const ref = typeof session.client_reference_id === 'string' ? session.client_reference_id : ''
  const montant = typeof session.amount_total === 'number' ? session.amount_total / 100 : null
  const emailPayeur =
    typeof session.customer_details === 'object' && session.customer_details !== null
      ? String((session.customer_details as Record<string, unknown>).email ?? '')
      : ''

  if (!RESEND_API_KEY || !ALERT_TO) {
    console.error('Secrets Resend manquants (RESEND_API_KEY / ALERTE_DESTINATAIRE)')
    return new Response(JSON.stringify({ error: 'resend_not_configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // La commande peut manquer : un paiement lancé depuis un lien partagé à la
  // main n'a pas de `client_reference_id`. Le mail part quand même — mieux
  // vaut « paiement reçu, commande inconnue » que pas de mail du tout.
  const c = ref ? await lireCommande(ref) : null

  const paye = new Date()
  const payeFr = paye.toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })
  const bouteilles = c?.packs ? c.packs * 6 : null

  const lignes: Array<[string, string]> = [
    ['Payé le', payeFr],
    ['Montant', montant !== null ? `${montant.toFixed(2)} €` : 'non communiqué'],
    ['Packs', c?.packs ? `${c.packs} (${bouteilles} bouteilles)` : 'commande non retrouvée'],
    ['Ville', txt(c?.ville)],
    ['Quand', txt(c?.quand)],
    ['Prénom', txt(c?.nom)],
    ['Contact', txt(c?.contact)],
    ['Canal choisi', txt(c?.canal)],
    ['Hors zone', c?.hors_zone ? 'OUI — ville hors Lyon' : 'non'],
    ['Venu de', txt(c?.utm_source, 'direct')],
    ['Email du paiement', txt(emailPayeur, 'non communiqué')],
  ]

  const corpsTexte = [
    reel ? '' : "⚠️ CECI EST UN PAIEMENT DE TEST — aucun argent n'a changé de main.",
    c?.hors_zone
      ? 'Paiement reçu sur ledje.fr/commander — ATTENTION : ville hors zone de livraison.'
      : 'Paiement reçu sur ledje.fr/commander.',
    '',
    ...lignes.map(([k, v]) => `${k} : ${v}`),
    '',
    c?.message?.trim() ? `Son message :\n${c.message.trim()}` : 'Aucun message laissé.',
    '',
    `Référence commande : ${txt(c?.id ?? ref, 'aucune')}`,
    `Session Stripe : ${txt(session.id, 'inconnue')}`,
  ].join('\n')

  const corpsHtml = `
    ${reel ? '' : '<p style="background:#FFF3CD;padding:8px;border-radius:4px"><strong>⚠️ Paiement de TEST</strong> — aucun argent n&rsquo;a changé de main.</p>'}
    <p>${
      c?.hors_zone
        ? '<strong>Paiement reçu</strong> sur <strong>ledje.fr/commander</strong> — ⚠️ ville <strong>hors zone</strong> de livraison.'
        : '<strong>Paiement reçu</strong> sur <strong>ledje.fr/commander</strong>.'
    }</p>
    <table cellpadding="4" style="border-collapse:collapse;font-size:14px">
      ${lignes
        .map(
          ([k, v]) =>
            `<tr><td style="color:#666">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`,
        )
        .join('')}
    </table>
    ${
      c?.message?.trim()
        ? `<p><strong>Son message :</strong></p>
           <blockquote style="border-left:3px solid #E8B65C;padding-left:12px;margin-left:0">
             ${esc(c.message.trim()).replace(/\n/g, '<br>')}
           </blockquote>`
        : '<p style="color:#666">Aucun message laissé.</p>'
    }
    <p style="color:#666;font-size:12px">
      Référence commande : ${esc(txt(c?.id ?? ref, 'aucune'))}<br>
      Session Stripe : ${esc(txt(session.id, 'inconnue'))}
    </p>
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
        reply_to: emailPayeur || undefined,
        subject: `${reel ? '' : '[TEST] '}${
          c?.packs
            ? `Lédjé — ${c.packs} pack${c.packs > 1 ? 's' : ''} payé${c.packs > 1 ? 's' : ''}${
                c.ville ? ` · ${c.ville}` : ''
              }`
            : 'Lédjé — paiement reçu'
        }`,
        text: corpsTexte,
        html: corpsHtml,
      }),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('Echec envoi Resend', res.status, detail)
      // 500 volontaire : Stripe réessaie, et on veut ce mail.
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

  return new Response(JSON.stringify({ sent: true, commande: c?.id ?? null, test: !reel }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
