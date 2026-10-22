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

   ⚠️⚠️ CE QUE LE PRIX EST, ET SURTOUT CE QU'ON N'ÉCRIT PAS À L'ÉCRAN.
   Lecture de Basekou, le 19/10 : « je le vois comme 5 bouteilles vendues
   à 10 € et une offerte ». Soit 2 € la bouteille PAYÉE — le tarif B2C
   événementiel, et le gros volume du barème mosquée. Le pack ne crée donc
   aucun étage de prix nouveau : il reprend un prix pratiqué et y ajoute
   une concession EN BOUTEILLE, comme on le fait déjà en B2B.

   ⛔⛔ ET C'EST UNE LECTURE INTERNE, PAS UN ARGUMENT DE VENTE. Basekou,
   le 19/10 : « je ne suis pas en train de dire que sur le site il faut
   mettre 5 achetées une offerte ». ⇒ LA PAGE ANNONCE « 10 € — le pack de
   6 bouteilles », ET RIEN D'AUTRE. Pas de « 5 + 1 », pas de « une
   offerte », pas de prix à la bouteille : un pack c'est 6 dans les
   habitudes des gens (« comme les canettes »), et c'est ce qu'on vend.
   Le détail du calcul vit en fiche (`02_produit/prix.md`), pas à l'écran.

   ⚠️ Ne pas « corriger » ce prix sans Basekou.

   ✅ LE PAIEMENT EST EN LIGNE DEPUIS LE 21/10 (Basekou, « option 1 »).
   Produit et prix créés sur le compte Stripe Lédjé, en MODE RÉEL — c'est le
   seul compte, il n'y a pas de sandbox.

   ══ LE PARCOURS, REFAIT LE 22/10 SUR TROIS DÉFAUTS VUS PAR BASEKOU ══

   ① « LA PAGE "C'EST NOTÉ" N'A RIEN À FAIRE À CE MOMENT-LÀ ». Elle
   s'affichait dès l'envoi du formulaire, AVANT le paiement — or c'est une
   page d'APRÈS paiement. ✅ Elle est sortie d'ici : elle vit dans
   `CommandeConfirmee.tsx`, sur `/commande-confirmee`, et c'est Stripe qui y
   envoie (`after_completion: redirect`). Ce qui reste ici, c'est l'étape
   intermédiaire : prévenir, puis payer.

   ② « LA QUANTITÉ CHOISIE N'EST PAS CELLE DU LIEN DE PAIEMENT ». Exact, et
   la cause est une limite de Stripe : AUCUN paramètre d'URL ne porte la
   quantité d'un Payment Link. ✅ Parade : UN LIEN PAR QUANTITÉ, de 1 à 6
   packs (`LIENS` ci-dessous), donc le bon montant d'emblée et plus rien à
   ressaisir. ⚠️ Le sélecteur du formulaire s'arrête à 4 packs : les six
   liens couvrent donc tout, et 5-6 sont d'avance.
   ⛔ Ajouter un choix au-delà de 6 sans créer le lien correspondant ferait
   disparaître le bouton de paiement (`lienPaiement` retombe sur null) : la
   commande partirait sans moyen de payer.

   ③ « LE FORMULAIRE DOIT PRÉVENIR BASEKOU PAR LE CANAL CHOISI », puis
   envoyer au paiement. ✅ Fait, avec une limite à connaître : UN SITE NE PEUT
   PAS ENVOYER UN MESSAGE À LA PLACE DU CLIENT. On pré-remplit, il appuie.
   — WhatsApp et Mail : message pré-rempli, il n'a plus qu'à envoyer ;
   — Instagram : AUCUNE API ne permet de pré-remplir un DM. On ouvre la
     conversation et on COPIE le message dans le presse-papier ;
   — Téléphone : rien à pré-remplir, on compose le numéro.
   ⚠️ Le mail automatique vers Basekou APRÈS paiement est la seconde moitié
   de sa demande, et il ne peut pas vivre ici : un client qui ferme l'onglet
   n'envoie rien. Il est côté serveur — `supabase/functions/commande-payee`.

   ⚠️ Et un point que Basekou a tranché en connaissance de cause : le
   réglementaire de la vente artisanale est `en_cours`, pas clos
   (`04_operations/demarches-admin.md`). Signalé, pas corrigé.
   ════════════════════════════════════════════════════════════════ */

const PRIX_PACK = 10
const BOUTEILLES_PAR_PACK = 6

/* Un Payment Link PAR QUANTITÉ — compte Lédjé, mode réel, créés le
   2026-10-22 sur `price_1UT53HBmuJiv7YKNEEwfFuYq` (10 € le pack).
   Tous redirigent vers /commande-confirmee après paiement RÉUSSI — Stripe
   ne redirige pas autrement, c'est ce qui fait de cette page une preuve.
   ⚠️ La redirection est écrite en dur sur ledje.fr côté Stripe : depuis un
   aperçu de PR, le paiement ramène donc en PRODUCTION, pas sur l'aperçu.
   ✅ Vider cet objet referme le paiement direct : le bouton disparaît et la
   commande repart par le seul canal de contact. */
const LIENS: Record<number, string> = {
  1: 'https://buy.stripe.com/5kQdR8fCXbRp7oBfiogQE06',
  2: 'https://buy.stripe.com/8x27sK9ez7B9fV75HOgQE07',
  3: 'https://buy.stripe.com/fZu14m2Qb5t17oBgmsgQE08',
  4: 'https://buy.stripe.com/bJecN40I3aNlbER3zGgQE09',
  5: 'https://buy.stripe.com/14AeVc8av8Fd24h7PWgQE0a',
  6: 'https://buy.stripe.com/dRmfZg62n6x58sF5HOgQE0b',
}

/* Où le client prévient Basekou.
   ⚠️ LE NUMÉRO PART DANS LE BUNDLE PUBLIC — un lien `wa.me` ne peut pas
   faire autrement, il porte le numéro en clair dans l'URL. Assumé parce que
   Basekou a nommé WhatsApp comme canal pour le joindre (22/10) ; le vider
   suffit à le retirer, le canal WhatsApp basculant alors sur le mail. */
const WHATSAPP = '33652036548'
const MAIL_BASEKOU = 'basekou@ledje.fr'
const INSTA_DM = 'https://ig.me/m/its.ledje'

const CANAUX = ['WhatsApp', 'Instagram', 'Email', 'Téléphone'] as const

/* Reconnaissance de la zone de livraison.
   ⚠️ Elle AVERTIT, elle ne BLOQUE PAS. Un test de chaîne naïf sur un nom de
   ville refuserait de vrais clients de l'agglomération pour une faute de
   frappe ou une commune qu'on n'a pas listée. On préfère une commande de
   trop, qu'on filtre au contact, à un client perdu en silence. */
const ZONE = /(^|\D)69\d{3}|lyon|villeurbanne|bron|venissieux|vénissieux|caluire|oullins|vaulx|decines|décines|meyzieu|saint-?fons|tassin|ecully|écully|rillieux|genas|chassieu/i

/* 'relance' remplace l'ancien 'done' : ce qui suit l'envoi du formulaire
   n'est plus une confirmation mais une ÉTAPE — prévenir, puis payer. La
   confirmation, elle, est une page à part où Stripe renvoie après paiement. */
type Etat = 'idle' | 'loading' | 'relance' | 'invalid' | 'network'

/* Le récapitulatif déposé avant de partir vers Stripe, relu par
   /commande-confirmee au retour. localStorage et pas un état React : le
   retour de paiement est un CHARGEMENT NEUF de la page, tout état mémoire
   est perdu entre les deux.
   ⚠️ Lecture et écriture sous try/catch : en navigation privée l'accès peut
   lever, et la page doit s'afficher quand même. */
export const CLE_COMMANDE = 'ledje_commande'

export type CommandeMemo = {
  packs: number
  total: number
  canal: string
  prenom: string
  prevenu: boolean
}

export function lireMemo(): CommandeMemo | null {
  try {
    const brut = localStorage.getItem(CLE_COMMANDE)
    return brut ? (JSON.parse(brut) as CommandeMemo) : null
  } catch {
    return null
  }
}

function ecrireMemo(m: CommandeMemo) {
  try {
    localStorage.setItem(CLE_COMMANDE, JSON.stringify(m))
  } catch {
    /* Pas de mémoire disponible : la page de confirmation sera générique. */
  }
}

export default function Commander() {
  const [packs, setPacks] = useState(1)
  const [ville, setVille] = useState('')
  const [quand, setQuand] = useState('')
  const [nom, setNom] = useState('')
  const [contact, setContact] = useState('')
  const [canal, setCanal] = useState<string>('WhatsApp')
  const [message, setMessage] = useState('')
  const [etat, setEtat] = useState<Etat>('idle')
  // Référence de la commande écrite, passée à Stripe pour rapprocher le
  // paiement de la ligne. Nulle si l'insert n'a pas abouti.
  const [ref, setRef] = useState<string | null>(null)
  // Le message a-t-il été copié ? Sert au libellé, pas à la logique.
  const [copie, setCopie] = useState(false)

  useEffect(() => {
    document.title = 'Commander — lédjé'
    trackEvent('commander_view')
  }, [])

  // Hors zone seulement si la ville est renseignée ET ne matche pas : un
  // champ vide n'est pas un refus.
  const horsZone = ville.trim().length > 2 && !ZONE.test(ville)
  const total = packs * PRIX_PACK
  /* null si aucun lien n'existe pour cette quantité : le bouton disparaît
     plutôt que d'ouvrir un paiement au mauvais montant. */
  const lienPaiement = LIENS[packs] ?? null

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!contact.trim() || !ville.trim()) {
      setEtat('invalid')
      return
    }
    setEtat('loading')
    const { error, id } = await submitCommande({
      packs, ville, horsZone, quand, nom, contact, canal, message,
    })
    if (error) {
      setEtat('network')
      return
    }
    setRef(id)
    trackEvent(horsZone ? 'commande_hors_zone' : 'commande')
    setRef(id)
    ecrireMemo({ packs, total, canal, prenom: nom.trim(), prevenu: false })
    setEtat('relance')
  }

  /* Le message que le client envoie à Basekou. Court exprès : il doit tenir
     dans une notification, et tout le détail est déjà en base. */
  const messagePret = [
    `Bonjour, je viens de commander ${packs} pack${packs > 1 ? 's' : ''}`,
    ` (${packs * BOUTEILLES_PAR_PACK} bouteilles) sur ledje.fr`,
    ville.trim() ? ` pour ${ville.trim()}` : '',
    nom.trim() ? `. Je m'appelle ${nom.trim()}` : '',
    '.',
  ].join('')

  /* Où prévenir, selon le canal choisi au formulaire — et ce qu'on en dit.
     Chaque canal porte SA note : ce qui est pré-rempli n'est pas le même d'un
     canal à l'autre, et une note générique mentirait sur l'un des quatre.
     `montrer` n'est vrai que là où le client doit RECOPIER le message. */
  type Canal = { href: string; libelle: string; note: string; copier: boolean; montrer: boolean }

  function lienCanal(): Canal {
    const t = encodeURIComponent(messagePret)
    if (canal === 'WhatsApp' && WHATSAPP) {
      return {
        href: `https://wa.me/${WHATSAPP}?text=${t}`,
        libelle: 'Prévenir sur WhatsApp',
        note: 'Le message est déjà écrit, tu n’as plus qu’à l’envoyer.',
        copier: false,
        montrer: false,
      }
    }
    if (canal === 'Instagram') {
      // Aucune API ne pré-remplit un DM Instagram : on ouvre la conversation
      // et on copie le texte, que le client colle.
      return {
        href: INSTA_DM,
        libelle: 'Prévenir sur Instagram',
        note: copie
          ? 'Ton message est copié : colle-le dans la conversation.'
          : 'Instagram ne permet pas de pré-remplir un message — recopie celui-ci :',
        copier: true,
        montrer: true,
      }
    }
    if (canal === 'Téléphone' && WHATSAPP) {
      // Un appel ne transporte pas de texte : rien à copier, rien à montrer.
      return {
        href: `tel:+${WHATSAPP}`,
        libelle: 'Appeler',
        note: 'Si ça ne décroche pas, laisse un message — on rappelle.',
        copier: false,
        montrer: false,
      }
    }
    return {
      href: `mailto:${MAIL_BASEKOU}?subject=${encodeURIComponent('Commande lédjé')}&body=${t}`,
      libelle: 'Prévenir par mail',
      note: 'Le message est déjà écrit, tu n’as plus qu’à l’envoyer.',
      copier: false,
      montrer: false,
    }
  }

  async function onPrevenir() {
    const { copier } = lienCanal()
    // Le presse-papier peut être refusé (permission, contexte non sécurisé) :
    // ce n'est pas bloquant, le client a le message sous les yeux.
    if (copier) {
      try {
        await navigator.clipboard.writeText(messagePret)
        setCopie(true)
      } catch {
        setCopie(false)
      }
    }
    trackEvent(`commande_prevenir_${canal.toLowerCase()}`)
    const memo = lireMemo()
    if (memo) ecrireMemo({ ...memo, prevenu: true })
  }

  /* ══ L'ÉTAPE INTERMÉDIAIRE — prévenir, puis payer ══

     Hors zone, il n'y a rien à payer : l'écran reste une fin de parcours.
     En zone, c'est une ÉTAPE à deux gestes numérotés, et l'ordre compte :
     prévenir d'abord — c'est ce qui ouvre la discussion, et ça marche même
     si le paiement est abandonné. */
  if (etat === 'relance') {
    const { href, libelle, note, montrer } = lienCanal()
    return (
      <>
        <SiteHeader />
        <main className="v-page" id="top">
          <section className="v-section v-page-head">
            <div className="container container--wide">
              <p className="v-eyebrow">Commander</p>
              <h1 className="v-title v-title--huge">
                {horsZone ? 'On te prévient.' : 'Plus qu’un geste.'}
              </h1>
              <p className="v-text v-text--lead">
                {horsZone
                  ? 'On ne livre pas encore chez toi, mais ta demande est enregistrée. Dès qu’on ouvre ta ville, tu es prévenu — par le canal que tu as choisi.'
                  : `Ta commande est enregistrée : ${packs * BOUTEILLES_PAR_PACK} bouteilles pour ${total} €. Préviens-nous, et on cale l’heure de livraison.`}
              </p>

              {!horsZone && (
                <ol className="v-relance">
                  <li>
                    <a
                      className="btn-primary"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onPrevenir}
                    >
                      {libelle}
                    </a>
                    <span className="v-note">{note}</span>
                    {montrer && <blockquote className="v-message">{messagePret}</blockquote>}
                  </li>

                  {lienPaiement && (
                    <li>
                      <a
                        className="btn-ghost"
                        href={ref ? `${lienPaiement}?client_reference_id=${encodeURIComponent(ref)}` : lienPaiement}
                        onClick={() => trackEvent('commande_paiement_stripe')}
                      >
                        Payer {total} €
                      </a>
                      <span className="v-note">
                        {packs} pack{packs > 1 ? 's' : ''} de {BOUTEILLES_PAR_PACK} bouteilles. Tu peux
                        aussi régler à la livraison.
                      </span>
                    </li>
                  )}
                </ol>
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

        {/* ══ LA BANDE — ce qu'on achète, entre le prix et le formulaire ══

            Ajoutée le 2026-10-16 au second retour de Basekou : « la page est
            ennuyeuse ». Elle l'était, et le diagnostic est structurel plutôt
            que rédactionnel : la page n'avait que DEUX blocs, posés sur deux
            beiges presque identiques, et elle passait d'un prix à un
            formulaire sans rien donner envie entre les deux.

            La force de ce site est l'ALTERNANCE — des bandes pleine largeur,
            sombres, entre les sections claires. Cette page n'en avait aucune.
            Celle-ci reprend le composant de l'accueil tel quel : même image,
            même traitement. On ne réinvente pas un motif qui marche. ══ */}
        <section className="v-band" aria-labelledby="gout-title">
          <div className="v-band-media">
            <img
              src="/visuals/degustation.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="v-band-content container container--wide">
            <p className="v-eyebrow">Ce que tu commandes</p>
            <h2 id="gout-title" className="v-title v-title--huge">
              Glacée, à la sortie du frigo.
            </h2>
            <p className="v-text v-text--lead">
              De l’eau de source et du miel français. C’est tout, et c’est au
              froid que ça se joue.
            </p>
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
