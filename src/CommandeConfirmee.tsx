import { useEffect } from 'react'
import { SiteHeader, SiteFooter, INSTAGRAM_URL } from './Chrome'
import { trackEvent } from './lib/supabase'
import { lireMemo } from './Commander'

/* ════════════════════════════════════════════════════════════════
   lédjé — « C'est noté » : la page d'APRÈS paiement.

   Créée le 2026-10-22 sur un constat de Basekou, et il est juste :
   « lorsqu'on passe la commande, la page "c'est noté" n'a rien à faire à
   ce moment-là, elle n'apporte rien. Pour moi c'est les pages qu'on voit
   généralement après le paiement. »

   Elle s'affichait en effet dès l'envoi du formulaire — donc avant le
   paiement, et avant même que le client ait prévenu qui que ce soit. Elle
   annonçait une fin de parcours au milieu du parcours.

   ⚠️ CE QUI FAIT DE CETTE PAGE UNE PREUVE, ET IL NE FAUT PAS LE CASSER :
   on n'arrive ici QUE par la redirection de Stripe, et Stripe ne redirige
   QU'APRÈS un paiement réussi (`after_completion: redirect`, posé sur les
   six Payment Links). L'URL porte `?s=<id de session>`.
   ⛔ Donc ne jamais pointer un lien du site vers cette page : ce serait
   annoncer un paiement qui n'a pas eu lieu. Elle n'est dans aucun menu,
   dans aucun bouton, et c'est volontaire.

   📌 Ce qu'on ne prétend PAS savoir : si le client a réellement ENVOYÉ son
   message. Un site voit qu'on a ouvert WhatsApp ou copié un texte, jamais
   qu'un message est parti. La page dit donc ce qui est vrai — la
   conversation est ouverte — et repropose le geste si besoin, sans affirmer
   qu'il a été fait.
   ════════════════════════════════════════════════════════════════ */

export default function CommandeConfirmee() {
  const memo = lireMemo()

  // La session Stripe, seulement pour l'afficher au client : c'est la
  // référence qu'il cite si quelque chose cloche. Aucune vérification n'est
  // faite dessus ici — elle ne pourrait pas l'être sans clé secrète, et
  // c'est la fonction serveur `commande-payee` qui la contrôle.
  const session = new URLSearchParams(location.search).get('s') ?? ''

  useEffect(() => {
    document.title = 'Commande confirmée — lédjé'
    trackEvent('commande_payee_retour')
  }, [])

  return (
    <>
      <SiteHeader />

      <main className="v-page" id="top">
        <section className="v-section v-page-head" aria-labelledby="ok-title">
          <div className="container container--wide">
            <p className="v-eyebrow">Commande confirmée</p>
            <h1 id="ok-title" className="v-title v-title--huge">
              C’est noté{memo?.prenom ? `, ${memo.prenom}` : ''}.
            </h1>

            <p className="v-text v-text--lead">
              {memo
                ? `Ton paiement est passé — ${memo.total} €, ${memo.packs * 6} bouteilles. On prépare ta commande ce soir, tu es livré demain.`
                : 'Ton paiement est passé. On prépare ta commande ce soir, tu es livré demain.'}
            </p>

            {/* La suite, en trois temps : ce qui est fait, ce qui vient, et
                comment nous joindre. Pas de félicitations creuses — ce qu'un
                client veut à cet instant, c'est savoir quand ça arrive. */}
            <ol className="v-steps">
              <li className="v-step">
                <span className="v-step-num" aria-hidden="true">1</span>
                <div>
                  <h2 className="v-step-title">Ta commande est payée</h2>
                  <p className="v-text">
                    Rien d’autre à faire de ton côté.
                    {session && (
                      <>
                        {' '}Ta référence, si tu as besoin de nous écrire&nbsp;:{' '}
                        <code className="v-ref">{session.slice(-12)}</code>
                      </>
                    )}
                  </p>
                </div>
              </li>

              <li className="v-step">
                <span className="v-step-num" aria-hidden="true">2</span>
                <div>
                  <h2 className="v-step-title">On te répond pour l’heure</h2>
                  <p className="v-text">
                    {memo?.canal
                      ? `On revient vers toi sur ${memo.canal} pour convenir du créneau de livraison.`
                      : 'On revient vers toi pour convenir du créneau de livraison.'}
                    {' '}Les bouteilles sont préparées le soir même.
                  </p>
                </div>
              </li>

              <li className="v-step">
                <span className="v-step-num" aria-hidden="true">3</span>
                <div>
                  <h2 className="v-step-title">
                    {memo?.prevenu ? 'La discussion est ouverte' : 'Dis-nous un mot'}
                  </h2>
                  <p className="v-text">
                    {memo?.prevenu
                      ? 'Tu as ouvert la conversation avant de payer — si tu n’as pas encore envoyé ton message, c’est le moment : c’est là qu’on cale tout.'
                      : 'Une précision sur l’adresse, un horaire qui t’arrange mieux ? Écris-nous, on répond vite.'}
                  </p>
                  {INSTAGRAM_URL && (
                    <p className="v-note">
                      <a
                        href={INSTAGRAM_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('confirmee_instagram_click')}
                      >
                        Nous suivre sur Instagram
                      </a>{' '}
                      — c’est là qu’on montre les productions.
                    </p>
                  )}
                </div>
              </li>
            </ol>

            <p className="v-page-actions">
              <a className="btn-ghost" href="/">Retour à l’accueil</a>
            </p>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  )
}
