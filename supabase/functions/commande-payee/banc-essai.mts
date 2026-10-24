/* ══ BANC D'ESSAI DE `commande-payee` — à lancer depuis la racine du dépôt :
   node --experimental-strip-types supabase/functions/commande-payee/banc-essai.mts

   POURQUOI IL EXISTE : la fonction ne peut pas être appelée depuis une session
   Claude Code — `supabase.co` est bloqué par le proxy réseau. Or elle porte
   la pièce la plus délicate du dispositif, la vérification de signature
   Stripe, et une signature mal vérifiée ne se voit qu'en production : soit
   tout est refusé (401 silencieux, aucun mail), soit tout est accepté (un
   faux « paiement reçu » à la demande).

   CE QU'IL FAIT : il simule Stripe et Resend. `Deno` et `fetch` sont
   remplacés, aucun réseau n'est touché, aucun mail ne part. Les secrets ici
   sont des faux, écrits en clair exprès — ce ne sont pas les vrais.

   CE QU'IL COUVRE : les deux secrets (mode réel et mode test), le mauvais
   secret, l'absence de signature, le rejeu d'un horodatage périmé, un
   paiement sans référence de commande, et un événement d'un autre type.
   ═════════════════════════════════════════════════════════════ */
const SECRET_REEL = 'whsec_secret_du_mode_reel_pour_le_test'
const SECRET_TEST = 'whsec_secret_du_mode_test_pour_le_test'

const env: Record<string, string> = {
  RESEND_API_KEY: 're_faux',
  ALERTE_DESTINATAIRE: 'basekou@example.test',
  RESEND_FROM: 'Lédjé <faux@resend.dev>',
  STRIPE_WEBHOOK_SECRET: SECRET_REEL,
  STRIPE_WEBHOOK_SECRET_TEST: SECRET_TEST,
  SUPABASE_URL: 'https://projet.supabase.test',
  SUPABASE_SERVICE_ROLE_KEY: 'service_role_faux',
}

let handler: (r: Request) => Promise<Response>
;(globalThis as any).Deno = {
  env: { get: (k: string) => env[k] },
  serve: (h: any) => { handler = h },
}

const LIGNE = {
  id: '11111111-2222-3333-4444-555555555555',
  packs: 3, ville: 'Villeurbanne', hors_zone: false, quand: 'samedi matin',
  nom: 'Moussa', contact: '06 12 34 56 78', canal: 'WhatsApp',
  message: 'Je suis au 3e étage, sans ascenseur.', utm_source: 'instagram',
}

let mailEnvoye: any = null
;(globalThis as any).fetch = async (url: string, init: any) => {
  if (String(url).includes('/rest/v1/commandes')) {
    return new Response(JSON.stringify([LIGNE]), { status: 200 })
  }
  if (String(url).includes('api.resend.com')) {
    mailEnvoye = JSON.parse(init.body)
    return new Response('{"id":"faux"}', { status: 200 })
  }
  throw new Error('appel réseau inattendu : ' + url)
}

await import('./index.ts')

async function signer(corps: string, secret: string, t: number) {
  const cle = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const sig = await crypto.subtle.sign('HMAC', cle, new TextEncoder().encode(`${t}.${corps}`))
  return Array.from(new Uint8Array(sig)).map(o => o.toString(16).padStart(2, '0')).join('')
}

function evenement(livemode: boolean, ref: string | null = LIGNE.id) {
  return JSON.stringify({
    type: 'checkout.session.completed', livemode,
    data: { object: { id: 'cs_x_ABC', client_reference_id: ref, amount_total: 3000,
                      customer_details: { email: 'client@example.test' } } },
  })
}

async function appel(corps: string, secret: string | null, decalage = 0) {
  mailEnvoye = null
  const t = Math.floor(Date.now() / 1000) + decalage
  const entete = secret ? `t=${t},v1=${await signer(corps, secret, t)}` : null
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  if (entete) h['Stripe-Signature'] = entete
  const res = await handler(new Request('https://x.test/', { method: 'POST', headers: h, body: corps }))
  return { status: res.status, corps: await res.text(), mail: mailEnvoye }
}

const cas: Array<[string, any]> = []
cas.push(['secret du mode RÉEL', await appel(evenement(true), SECRET_REEL)])
cas.push(['secret du mode TEST', await appel(evenement(false), SECRET_TEST)])
cas.push(['mauvais secret', await appel(evenement(true), 'whsec_nimporte_quoi')])
cas.push(['aucune signature', await appel(evenement(true), null)])
cas.push(['horodatage vieux de 10 min (rejeu)', await appel(evenement(true), SECRET_REEL, -600)])
cas.push(['sans client_reference_id', await appel(evenement(true, null), SECRET_REEL)])
cas.push(['autre type d\'événement', await appel(JSON.stringify({ type: 'invoice.paid', livemode: true }), SECRET_REEL)])

for (const [nom, r] of cas) {
  console.log(`\n── ${nom}`)
  console.log(`   HTTP ${r.status} · ${r.corps.slice(0, 70)}`)
  if (r.mail) {
    console.log(`   objet : ${r.mail.subject}`)
    console.log(`   vers  : ${r.mail.to} · reply_to : ${r.mail.reply_to}`)
    const lignes = r.mail.text.split('\n').filter((l: string) => l.trim()).slice(0, 14)
    lignes.forEach((l: string) => console.log(`   | ${l}`))
  } else {
    console.log('   (aucun mail)')
  }
}
