import { useEffect } from 'react'
import { SiteHeader, SiteFooter, SOCIALS } from './Chrome'
import { trackEvent } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   lédjé — « Prestations événement »

   Créée le 2026-10-08 à la demande de Basekou, pour une visite précise :
   un établissement scolaire qui organise une kermesse ce week-end et qui
   va regarder le site avant de décider.

   ⚠️ CE QUI PÈSE SUR CETTE PAGE, ET IL FAUT LE SAVOIR AVANT D'Y TOUCHER :
   le 2026-09-30, Basekou a fait RETIRER d'un script de vente la promesse
   d'« un outil événementiel » faite à un prospect — *« c'est du bullshit,
   j'ai pipoté, on en fera rien »* (docs/03_marche/canal-restaurant.md).
   Aucune offre événement n'existait au dépôt, et `architecture-offre.md`
   n'en décrit toujours aucune.

   ➡️ Les quatre prestations ci-dessous ne sont donc PAS inventées ici :
   elles ont été confirmées une à une par Basekou le 08/10, et chacune
   s'appuie sur un fait du dépôt :

   — la DÉGUSTATION SUR STAND a déjà eu lieu (événement du 29/09, ≈ 30
     bouteilles payées, cf. production-artisanale.md) ;
   — la FOURNITURE EN LOTS est le cadre même de la phase artisanale
     (« vente en LOTS, jamais du détail individuel sur stand ») ;
   — la BOUTEILLE PERSONNALISÉE est la demande d'une mosquée du 02/10
     (canal-mosquee.md) ;
   — la CARAFE ET LES VERRES LOGOTÉS sont l'option « branding léger »
     déjà notée dans cette même fiche.

   ⚠️ AUCUN PRIX. Le 1 €/bouteille de la demande du 02/10 est une DEMANDE
   du client, pas un tarif accepté ; rien n'est tranché côté prix sur ce
   canal. Afficher un chiffre l'engagerait. Même réserve que /offrir.

   ⚠️ AUCUNE ALLÉGATION SANTÉ, même implicite (conformite.md). Et aucun
   registre religieux : cette page s'adresse à tout organisateur — école,
   association, entreprise — pas à un public dont on connaîtrait la
   confession (identite-verbale.md, règle du 06/10).
   ════════════════════════════════════════════════════════════════ */

const MAIL = `mailto:basekou@ledje.fr?subject=${encodeURIComponent('Une prestation lédjé pour notre événement')}`

const INSTA = SOCIALS.find(s => s.icon === 'instagram')?.url ?? ''

const PRESTATIONS = [
  {
    titre: 'On vient faire goûter',
    texte:
      'On tient un stand, on sert frais, on explique le produit à qui pose la question. C’est la formule qu’on a déjà menée sur un événement fin septembre.',
  },
  {
    titre: 'On fournit les bouteilles',
    texte:
      'Vous servez vous-mêmes. On livre des lots, frais, le jour convenu. La formule la plus simple, et la plus souple sur les quantités.',
  },
  {
    titre: 'Une étiquette à votre nom',
    texte:
      'La bouteille porte le nom de votre événement. Il faut s’y prendre à l’avance — une étiquette se fabrique, elle ne s’improvise pas la veille.',
  },
  {
    titre: 'Carafes et verres',
    texte:
      'Si vous préférez le service au verre, on apporte carafes et verres aux couleurs de la marque. Moins de déchets, et ça tient mieux sur une longue journée.',
  },
]

export default function Prestations() {
  useEffect(() => {
    document.title = 'Prestations événement — lédjé'
  }, [])

  return (
    <>
      <SiteHeader />

      <main className="v-page" id="top">
        <section className="v-section v-page-head" aria-labelledby="presta-title">
          <div className="container container--wide">
            <p className="v-eyebrow">Événements</p>
            <h1 id="presta-title" className="v-title v-title--huge">
              Une boisson pour votre journée.
            </h1>
            <p className="v-text v-text--lead">
              Kermesse, fête d’école, journée portes ouvertes, événement
              d’association : on apporte de l’eau miellée fraîche, et on
              s’adapte à votre organisation.
            </p>
          </div>
        </section>

        <section className="v-section v-section--soft" aria-labelledby="formules-title">
          <div className="container container--wide">
            <h2 id="formules-title" className="v-title v-title--xl">Quatre façons de faire</h2>
            <p className="v-text v-text--lead">
              Elles se combinent. On en parle, et on retient ce qui colle à votre
              journée.
            </p>
            <ol className="v-steps">
              {PRESTATIONS.map((p, i) => (
                <li className="v-step" key={p.titre}>
                  <span className="v-step-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="v-step-title">{p.titre}</h3>
                    <p className="v-text">{p.texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="v-section" aria-labelledby="produit-title">
          <div className="container container--wide">
            <h2 id="produit-title" className="v-title v-title--xl">Ce qu’on sert</h2>
            <p className="v-text v-text--lead">
              De l’eau de source et du miel français. Rien d’autre. Ça se boit
              glacé, et c’est ce qui fait la différence sur une journée dehors.
            </p>
            <dl className="v-specs">
              <div className="v-spec">
                <dt>Composition</dt>
                <dd>Deux ingrédients</dd>
              </div>
              <div className="v-spec">
                <dt>Miel</dt>
                <dd>Pur, jamais chauffé</dd>
              </div>
              <div className="v-spec">
                <dt>Contenance</dt>
                <dd>33 cl</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="v-section v-section--soft" aria-labelledby="contact-title">
          <div className="container container--wide">
            <h2 id="contact-title" className="v-title v-title--xl">Parlons de votre date</h2>
            <p className="v-text v-text--lead">
              Dites-nous le jour, le lieu et le monde attendu. On revient vers
              vous avec une proposition et un prix, rapidement — c’est encore
              nous qui préparons chaque bouteille, donc on répond vite.
            </p>
            <p className="v-page-actions">
              <a
                className="btn-primary"
                href={MAIL}
                onClick={() => trackEvent('presta_mail_click')}
              >
                Nous écrire
              </a>
            </p>
            {INSTA && (
              <p className="v-note">
                ou en message sur{' '}
                <a
                  href={INSTA}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('presta_instagram_click')}
                >
                  Instagram
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
