import { useEffect, useState } from 'react'
import { SiteHeader, SiteFooter } from './Chrome'
import { submitCommande, trackEvent } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   lédjé — « Commander »

   Créée le 2026-10-16. C'est la première réponse à une question posée au
   journal le 14/10 comme la fuite la plus coûteuse du dossier :

     « Il n'existe aucun chemin d'achat, nulle part. 15 à 20 % des visiteurs
       ont demandé où retrouver la boisson, et la réponse n'existait pas.
       117 bouteilles sorties, et un client qui a aimé ne peut pas en
       racheter. »

   RÈGLES DE VENTE, dictées par Basekou le 16/10 :
   — par PACK DE 6, jamais à l'unité ;
   — 10 € le pack, et AUCUN DÉGRESSIF (tranché le même jour, après avoir
     été évoqué : le prix est le même quel que soit le nombre de packs) ;
   — livraison à LYON seulement, le LENDEMAIN ; produite le soir même ;
   — hors Lyon : on le dit, et on propose de prévenir quand ça s'ouvre.

   ⚠️ LE PRIX EST UNE BASCULE ASSUMÉE, consignée au journal : 10 € le pack
   fait 1,67 € la bouteille, alors que `02_produit/prix.md` fixe le B2C à
   2,50 € et le tarif gros volume à 2 €. Décision de Basekou, prise en
   connaissance de l'écart. Ne pas « corriger » ce prix sans lui.

   ⚠️ LE PAIEMENT N'EST PAS EN LIGNE. Le connecteur Stripe n'était pas
   autorisé le jour de la création. La commande est donc PRISE ici, et le
   lien de paiement part par le canal que le client choisit. Dès qu'un
   Payment Link existe, il se renseigne dans STRIPE_LINK ci-dessous et le
   bouton de confirmation s'y branche — le reste ne bouge pas.

   ⚠️ Et un point que Basekou a tranché en connaissance de cause : le
   réglementaire de la vente artisanale est `en_cours`, pas clos
   (`04_operations/demarches-admin.md`). Signalé, pas corrigé.
   ════════════════════════════════════════════════════════════════ */

const PRIX_PACK = 10
const BOUTEILLES_PAR_PACK = 6

/** Vide tant qu'aucun Payment Link n'existe : on prend la commande et on
 *  envoie le lien à la main. Le remplir suffit à ouvrir le paiement direct. */
const STRIPE_LINK = ''

const CANAUX = ['WhatsApp', 'Instagram', 'Email', 'Téléphone'] as const

/* Reconnaissance de la zone de livraison.
   ⚠️ Elle AVERTIT, elle ne BLOQUE PAS. Un test de chaîne naïf sur un nom de
   ville refuserait de vrais clients de l'agglomération pour une faute de
   frappe ou une commune qu'on n'a pas listée. On préfère une commande de
   trop, qu'on filtre au contact, à un client perdu en silence. */
const ZONE = /(^|\D)69\d{3}|lyon|villeurbanne|bron|venissieux|vénissieux|caluire|oullins|vaulx|decines|décines|meyzieu|saint-?fons|tassin|ecully|écully|rillieux|genas|chassieu/i

type Etat = 'idle' | 'loading' | 'done' | 'invalid' | 'network'

export default function Commander() {
  const [packs, setPacks] = useState(1)
  const [ville, setVille] = useState('')
  const [quand, setQuand] = useState('')
  const [nom, setNom] = useState('')
  const [contact, setContact] = useState('')
  const [canal, setCanal] = useState<string>('WhatsApp')
  const [message, setMessage] = useState('')
  const [etat, setEtat] = useState<Etat>('idle')

  useEffect(() => {
    document.title = 'Commander — lédjé'
    trackEvent('commander_view')
  }, [])

  // Hors zone seulement si la ville est renseignée ET ne matche pas : un
  // champ vide n'est pas un refus.
  const horsZone = ville.trim().length > 2 && !ZONE.test(ville)
  const total = packs * PRIX_PACK

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim() || !ville.trim()) {
      setEtat('invalid')
      return
    }
    setEtat('loading')
    const { error } = await submitCommande({
      packs, ville, horsZone, quand, nom, contact, canal, message,
    })
    if (error) {
      setEtat('network')
      return
    }
    trackEvent(horsZone ? 'commande_hors_zone' : 'commande')
    setEtat('done')
  }

  if (etat === 'done') {
    return (
      <>
        <SiteHeader />
        <main className="v-page" id="top">
          <section className="v-section v-page-head">
            <div className="container container--wide">
              <p className="v-eyebrow">Commander</p>
              <h1 className="v-title v-title--huge">
                {horsZone ? 'On te prévient.' : 'C’est noté.'}
              </h1>
              <p className="v-text v-text--lead">
                {horsZone
                  ? 'On ne livre pas encore chez toi, mais ta demande est enregistrée. Dès qu’on ouvre ta ville, tu es prévenu — par le canal que tu as choisi.'
                  : `On te recontacte sur ${canal} pour le paiement et l’heure de livraison. Les bouteilles sont préparées le soir même et livrées le lendemain.`}
              </p>
              {!horsZone && STRIPE_LINK && (
                <p className="v-page-actions">
                  <a className="btn-primary" href={STRIPE_LINK} target="_blank" rel="noopener noreferrer">
                    Payer maintenant — {total} €
                  </a>
                </p>
              )}
            </div>
          </section>
        </main>
        <SiteFooter />
      </>
    )
  }

  return (
    <>
      <SiteHeader />

      <main className="v-page" id="top">
        {/* ══ LE HAUT DE PAGE — l'image, le prix, et c'est tout ══

            Première version (16/10) : un titre, un paragraphe et une plaque
            de specs. Basekou, le même jour : « la voix est ennuyeuse, il
            manque une image, il manque comment le prix est mis en avant,
            c'est pas joli comme ça ». Il avait raison — c'était une page de
            formulaire, pas une page de vente.

            Donc : la bouteille à droite, le PRIX en chiffre de titre à
            gauche, et trois faits courts. Le prix ne se range plus dans une
            ligne de tableau au même rang que la contenance : c'est
            l'argument, il a la taille d'un argument. */}
        <section className="v-section v-page-head" aria-labelledby="cmd-title">
          <div className="container container--wide">
            <div className="v-split">
              <div className="v-split-main">
                <p className="v-eyebrow">Commander</p>
                <h1 id="cmd-title" className="v-title v-title--huge">
                  Fraîches, chez toi demain.
                </h1>

                <p className="v-prix">
                  <strong>{PRIX_PACK} €</strong>
                  <span>le pack de {BOUTEILLES_PAR_PACK} bouteilles</span>
                </p>

                <p className="v-text v-text--lead">
                  On prépare ta commande le soir même, tu es livré le
                  lendemain. À Lyon et dans l’agglomération, pour l’instant.
                </p>

                <ul className="v-cmd-faits">
                  <li>Préparée le soir même</li>
                  <li>Livrée le lendemain</li>
                  <li>De l’eau et du miel, rien d’autre</li>
                </ul>
              </div>

              <div className="v-split-side">
                <figure className="v-figure">
                  <img
                    src="/visuals/produit.jpg"
                    alt="Une bouteille d’eau miellée lédjé, fraîche, posée au soleil."
                    width={1100}
                    height={1375}
                    fetchPriority="high"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <section className="v-section v-section--soft" aria-labelledby="form-title">
          <div className="container container--wide">
            <h2 id="form-title" className="v-title v-title--xl">Ta commande</h2>

            <form className="v-demande" onSubmit={onSubmit} noValidate>
              <fieldset className="v-field">
                <legend>Combien de packs</legend>
                <div className="v-packs">
                  {[1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      type="button"
                      className={n === packs ? 'v-pack is-on' : 'v-pack'}
                      onClick={() => setPacks(n)}
                      aria-pressed={n === packs}
                    >
                      {n}
                      <span>{n * BOUTEILLES_PAR_PACK} bt</span>
                    </button>
                  ))}
                </div>
                <p className="v-total">
                  {packs * BOUTEILLES_PAR_PACK} bouteilles — <strong>{total} €</strong>
                </p>
              </fieldset>

              <label className="v-field">
                <span>Tu es où <em>*</em></span>
                <input
                  type="text"
                  value={ville}
                  onChange={e => { setVille(e.target.value); if (etat !== 'idle') setEtat('idle') }}
                  placeholder="Ta ville ou ton code postal"
                  autoComplete="address-level2"
                />
              </label>

              {horsZone && (
                <p className="v-horszone" role="status">
                  On ne livre pas encore là-bas — pour l’instant c’est Lyon et
                  l’agglomération. Laisse-nous quand même tes coordonnées :
                  <strong> on te prévient dès qu’on ouvre ta ville.</strong>
                </p>
              )}

              <div className="v-demande-row">
                <label className="v-field">
                  <span>Ton nom</span>
                  <input
                    type="text"
                    value={nom}
                    onChange={e => setNom(e.target.value)}
                    autoComplete="name"
                    placeholder="Facultatif"
                  />
                </label>
                <label className="v-field">
                  <span>Pour quand</span>
                  <input
                    type="text"
                    value={quand}
                    onChange={e => setQuand(e.target.value)}
                    placeholder="« demain », « samedi »…"
                  />
                </label>
              </div>

              <fieldset className="v-field">
                <legend>On te répond où <em>*</em></legend>
                <div className="v-canaux">
                  {CANAUX.map(c => (
                    <button
                      key={c}
                      type="button"
                      className={c === canal ? 'v-canal is-on' : 'v-canal'}
                      onClick={() => setCanal(c)}
                      aria-pressed={c === canal}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={contact}
                  onChange={e => { setContact(e.target.value); if (etat !== 'idle') setEtat('idle') }}
                  aria-invalid={etat === 'invalid' && !contact.trim()}
                  placeholder={canal === 'Email' ? 'ton@email.com' : 'Ton numéro ou ton pseudo'}
                />
              </fieldset>

              <label className="v-field">
                <span>Autre chose à dire</span>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Facultatif"
                />
              </label>

              {etat === 'invalid' && (
                <p className="v-error" role="alert">
                  Il nous faut ta ville et un moyen de te répondre.
                </p>
              )}
              {etat === 'network' && (
                <p className="v-error" role="alert">
                  L’envoi a échoué. Réessaie, ou écris-nous à{' '}
                  <a href="mailto:basekou@ledje.fr">basekou@ledje.fr</a>.
                </p>
              )}

              <button type="submit" className="btn-primary" disabled={etat === 'loading'}>
                {etat === 'loading' ? 'Un instant…' : `Commander — ${total} €`}
              </button>
              <p className="v-note">
                On confirme avant de préparer. Le paiement se fait au moment
                où on te recontacte.
              </p>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
