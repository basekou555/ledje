import { trackEvent } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   lédjé — l'en-tête et le pied de page, partagés par les pages vitrine.

   Extraits de App.tsx le 2026-10-06, quand « Offrir » est devenu une page
   à part entière : deux pages qui portent la même barre, c'est une barre
   qui doit vivre à un seul endroit. Sans ça, le lien de l'en-tête aurait
   dérivé entre l'accueil et la page dès la première retouche.

   Ce fichier ne contient AUCUNE logique de page : il ne fait que rendre
   le cadre. Les constantes de marque (signature, réseaux) le suivent,
   puisque c'est le pied de page qui les affiche.
   ════════════════════════════════════════════════════════════════ */

// ⚠️ Signature PROVISOIRE (identite-verbale.md §7.1).
export const SIGNATURE = 'Parmi les bienfaits de ce bas monde'

/* ── Réseaux sociaux (ajoutés le 2026-10-02, activés le soir même) ────────
   Handle donné par Basekou le 2026-10-02 : `its.ledje`, le même sur les deux
   plateformes. (La première transcription orale donnait « It's Legit » — c'était
   une erreur de transcription, corrigée par Basekou.)

   ⚠️ NON VÉRIFIÉ DEPUIS CES SESSIONS : instagram.com et tiktok.com sont
   bloqués par le proxy réseau, les deux URL n'ont donc pas pu être testées.
   Elles reposent sur la parole de Basekou, à qui la vérification d'un clic
   revient.

   Garde-fou conservé : une entrée dont `url` est vide n'est pas rendue, et la
   rangée entière disparaît si les deux le sont. Vider une URL suffit à retirer
   une icône, sans toucher au reste. */
export const SOCIALS = [
  { name: 'Instagram', url: 'https://www.instagram.com/its.ledje/', icon: 'instagram' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@its.ledje', icon: 'tiktok' },
] as const

export function SocialIcon({ name }: { name: string }) {
  // Icônes inline : aucune dépendance, aucun appel réseau, teinte héritée
  // du texte via currentColor.
  if (name === 'instagram') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M14.3 3h2.5c.2 1.6 1.1 3 2.4 3.7.7.4 1.5.6 2.3.6v2.6a8 8 0 0 1-4.3-1.3v5.9a6 6 0 1 1-6-6c.3 0 .6 0 .9.1v2.7a3.3 3.3 0 1 0 2.4 3.2V3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── L'en-tête ────────────────────────────────────────────────────────────
   Trois éléments là où il y en avait deux : le wordmark, le lien « Offrir »
   et le bouton d'avis.

   « Offrir » est traité en LIEN CERCLÉ D'OR, pas en second bouton plein :
   deux pastilles vertes côte à côte se seraient disputé l'attention et on
   n'aurait plus su laquelle est l'action principale. L'or le distingue du
   texte courant sans le hisser au rang du bouton — c'est le « lien spécial »
   demandé par Basekou le 2026-10-06.

   `home` : sur l'accueil le wordmark remonte en haut de page (ancre interne),
   ailleurs il ramène à l'accueil. */
export function SiteHeader({ home = false }: { home?: boolean }) {
  return (
    <header className="v-header">
      <a className="v-wordmark" href={home ? '#top' : '/'}>
        <img src="/brand/wordmark-green.svg" alt="lédjé" width={2208} height={1040} />
      </a>
      <nav className="v-header-nav" aria-label="Principal">
        {/* Deux liens cerclés d'or, pas trois boutons : « Événements » est
            ajouté le 2026-10-08, et c'est la DERNIÈRE entrée que la barre
            peut porter — mesuré à 390 px, au-delà elle déborde. Une
            troisième demanderait un vrai menu. */}
        <a
          className="v-header-link"
          href="/prestations"
          onClick={() => trackEvent('header_prestations_click')}
        >
          Événements
        </a>
        <a
          className="v-header-link"
          href="/offrir"
          onClick={() => trackEvent('header_offrir_click')}
        >
          Offrir
        </a>
        {/* Le libellé se raccourcit sur petit écran : avec deux entrées de
            navigation à sa gauche, « Donner ton avis » passait sur deux
            lignes à 390 px et la barre doublait de hauteur. On coupe le mot
            porteur de politesse, pas le sens. */}
        <a className="v-header-cta" href="/avis">
          <span className="v-cta-long">Donner t</span>
          <span className="v-cta-short">T</span>on avis
        </a>
      </nav>
    </header>
  )
}

/* ── Le pied de page ─────────────────────────────────────────────────────
   `reveal` n'est posé que sur l'accueil : l'observateur d'apparition vit
   dans App.tsx. Sur une page qui ne l'instancie pas, la classe laisserait
   le contenu invisible pour toujours — c'est exactement le piège qui avait
   fait disparaître les titres le 2026-09-08. */
export function SiteFooter({ reveal = false }: { reveal?: boolean }) {
  return (
    <footer className="v-footer" role="contentinfo">
      <div className={reveal ? 'container reveal' : 'container'}>
        <p className="v-footer-brand">
          <img src="/brand/wordmark-cream.svg" alt="lédjé" width={2208} height={1040} loading="lazy" />
        </p>
        <p className="v-footer-tagline">{SIGNATURE}</p>
        {SOCIALS.some((s) => s.url) && (
          <nav className="v-footer-social" aria-label="Nos réseaux">
            {SOCIALS.filter((s) => s.url).map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                onClick={() => trackEvent(`social_click_${s.icon}`)}
              >
                <SocialIcon name={s.icon} />
              </a>
            ))}
          </nav>
        )}
        <p className="v-footer-mail">
          <a href="mailto:basekou@ledje.fr">basekou@ledje.fr</a>
        </p>
        <p className="v-footer-legal">
          Le miel est déconseillé aux enfants de moins d’un an.<br />
          © {new Date().getFullYear()} lédjé
        </p>
      </div>
    </footer>
  )
}
