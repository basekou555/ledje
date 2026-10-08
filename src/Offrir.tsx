import { useEffect } from 'react'
import { SiteHeader, SiteFooter, SOCIALS } from './Chrome'
import { trackEvent } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   lédjé — « Offrir un lot à sa mosquée »

   D'abord une section de l'accueil (2026-10-06), devenue une page sur
   demande de Basekou le même jour : le canal a sa propre audience — un
   fidèle à qui on envoie le lien — et il méritait mieux qu'un bloc entre
   deux arguments produit.

   Le modèle est celui de docs/03_marche/canal-mosquee.md depuis le 21/07 :
   C2B2C. Une mosquée n'achète pas ses consommables, c'est un fidèle qui
   finance ; la mosquée donne un lieu et un accord, pas un bon de commande.

   ⚠️ DEUX RÈGLES DE MARQUE TIENNENT TOUTE LA PAGE, et elles expliquent ce
   qui n'y est pas :

   ① AUCUN SYMBOLE, AUCUNE IMAGE DE MOSQUÉE. docs/01_adn/conformite.md
     interdit le symbole religieux explicite, et docs/01_adn/combats.md
     pose que la marque ne se sert pas de la religion comme argument. On
     décrit UN GESTE LOGISTIQUE, jamais un acte de piété : pas un mot de
     mérite, de récompense ou de bénédiction. Le registre est l'évocation,
     jamais la proclamation.

   ② AUCUN PRIX. Le barème existe (2,50 € l'unité, 2 € dès 50, sans
     négociation) mais le canal est en attente volontaire depuis le 31/07
     — les restaurants d'abord — et le site n'a aucun commerce. Afficher
     un tarif public engagerait sur un canal qu'on ne sert pas encore.

   Et aucune allégation santé, ici comme partout (conformite.md).
   ════════════════════════════════════════════════════════════════ */

const MAIL = `mailto:basekou@ledje.fr?subject=${encodeURIComponent('Offrir un lot à ma mosquée')}`

// Une seule source pour le handle : l'entrée de SOCIALS, déjà en production
// depuis le 02/10. On vise le profil et non ig.me (lien de message direct),
// jamais vérifié depuis ces sessions.
const INSTA = SOCIALS.find(s => s.icon === 'instagram')?.url ?? ''

const ETAPES = [
  {
    titre: 'Tu nous écris',
    texte:
      'Tu dis quelle mosquée, combien de bouteilles, et pour quand. On répond avec ce que ça donne concrètement.',
  },
  {
    titre: 'La mosquée dit oui',
    texte:
      'Elle n’achète rien et n’avance rien. Elle donne un accord et un endroit où poser les bouteilles.',
  },
  {
    titre: 'On livre',
    texte:
      'Les bouteilles arrivent fraîches, sur place, le jour convenu. Elles sont offertes aux fidèles.',
  },
]

export default function Offrir() {
  useEffect(() => {
    document.title = 'Offrir un lot — lédjé'
  }, [])

  return (
    <>
      <SiteHeader />

      <main className="v-page" id="top">
        <section className="v-section v-page-head" aria-labelledby="offrir-title">
          <div className="container container--wide">
            <p className="v-eyebrow">Offrir</p>
            <h1 id="offrir-title" className="v-title v-title--huge">
              Un lot pour ta mosquée.
            </h1>
            <p className="v-text v-text--lead">
              Une mosquée n’achète pas ses boissons. Ce sont les fidèles qui les
              offrent. Alors on a fait simple : tu offres un lot, on l’apporte.
            </p>
          </div>
        </section>

        <section className="v-section v-section--soft" aria-labelledby="comment-title">
          <div className="container container--wide">
            <h2 id="comment-title" className="v-title v-title--xl">Comment ça marche</h2>
            <ol className="v-steps">
              {ETAPES.map((e, i) => (
                <li className="v-step" key={e.titre}>
                  <span className="v-step-num" aria-hidden="true">{i + 1}</span>
                  <div>
                    <h3 className="v-step-title">{e.titre}</h3>
                    <p className="v-text">{e.texte}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="v-section" aria-labelledby="produit-title">
          <div className="container container--wide">
            <h2 id="produit-title" className="v-title v-title--xl">Ce qu’il y a dans la bouteille</h2>
            <p className="v-text v-text--lead">
              De l’eau de source et du miel français. Rien d’autre.
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
            <h2 id="contact-title" className="v-title v-title--xl">On en parle ?</h2>
            <p className="v-text v-text--lead">
              Il n’y a pas encore de commande en ligne pour ça, et c’est très bien
              comme ça : on cale la quantité et la date ensemble, en deux
              messages.
            </p>
            <p className="v-page-actions">
              <a
                className="btn-primary"
                href={MAIL}
                onClick={() => trackEvent('offrir_page_mail_click')}
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
                  onClick={() => trackEvent('offrir_page_instagram_click')}
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
