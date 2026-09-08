import { useEffect, useRef, useState } from 'react'
import { submitEmail, trackEvent } from './lib/supabase'

/* ════════════════════════════════════════════════════════════════
   lédjé — vitrine
   Refonte du 2026-09-08. Le site n'est plus un tunnel de conversion :
   c'est une vitrine. Le visiteur arrive parce qu'on lui a parlé du projet,
   il vient vérifier que c'est sérieux. Objectif : comprendre en dix secondes.

   Ordre imposé par l'architecture des messages (identite-verbale.md §6) :
   1 le produit → 2 l'expérience → 3 la marque → 4 l'univers.
   Le concret d'abord, l'histoire après.

   Règles appliquées :
   — « eau miellée » est la dénomination de vente, reprise telle quelle ;
   — « lédjé » toujours en minuscules avec accents (sauf ledje.fr, technique) ;
   — aucun registre communautaire en façade (identite-verbale, 2026-07-29) ;
   — aucune allégation santé, même implicite (conformite.md) ;
   — pas d'alvéole, pas de « geste » ni de « rituel » (décisions 2026-09-08).
   ════════════════════════════════════════════════════════════════ */

type FormState = 'idle' | 'loading' | 'success' | 'invalid' | 'duplicate' | 'network'

// ⚠️ Accroche PROVISOIRE. Aucune des trois options n'est tranchée
// (identite-verbale.md §7.2). Celle-ci est celle de l'étiquette V1.8,
// retenue par défaut sur consigne du brief — ce n'est pas une décision.
const ACCROCHE = 'De l’eau et du miel. Rien de plus.'

// ⚠️ Signature PROVISOIRE elle aussi (identite-verbale.md §7.1).
const SIGNATURE = 'Parmi les bienfaits de ce bas monde'

// Précommande cristal — présente, jamais dominante.
const CRISTAL_UNIT_PRICE = 1
const MIN_CRISTAUX = 5
const MAX_CRISTAUX = 50
const STRIPE_PRECOMMANDE_URL =
  (import.meta.env.VITE_STRIPE_PRECOMMANDE_URL as string | undefined) ??
  'https://buy.stripe.com/9B66oG0I3dZx10ddaggQE04'

// Vidéo d'ouverture. ⚠️ Asset provisoire (génération Higgsfield) — à remplacer
// dès qu'on a une captation du produit réel.
const VIDEO_URL =
  (import.meta.env.VITE_HERO_VIDEO_URL as string | undefined) ??
  'https://d8j0ntlcm91z4.cloudfront.net/user_3F7O8wGWXNEbyg1pRrys5kwKg5V/hf_20260629_045823_8c34005b-a94a-44ce-b1ba-7eae3bfcd8e8.mp4'

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/* Scène animée « eau + miel ».
   Trois gouttes de miel tombent dans un verre d'eau claire ; à chaque impact
   l'eau se teinte d'un palier, jusqu'à devenir de l'eau miellée — puis le
   cycle repart. C'est le produit lui-même qui se fabrique sous les yeux.
   Purement décorative (aria-hidden), figée sous prefers-reduced-motion. */
function EauMiellee() {
  return (
    <svg
      className="hd"
      viewBox="0 0 220 260"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hd-honey" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F8DA97" />
          <stop offset="0.42" stopColor="#E2A733" />
          <stop offset="1" stopColor="#B0731A" />
        </linearGradient>
        {/* La nappe une fois miellée */}
        <radialGradient id="hd-tinted" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#F2CE86" />
          <stop offset="0.6" stopColor="#DCA23A" />
          <stop offset="1" stopColor="#C1861F" />
        </radialGradient>
        {/* La nappe d'eau claire */}
        <radialGradient id="hd-clear" cx="0.5" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="1" stopColor="#BFD4D8" stopOpacity="0.5" />
        </radialGradient>
      </defs>

      {/* La nappe : eau claire, puis la teinte miel par-dessus */}
      <ellipse className="hd-pool-clear" cx="110" cy="196" rx="86" ry="26" />
      <ellipse className="hd-pool-tint"  cx="110" cy="196" rx="86" ry="26" />
      <ellipse className="hd-pool-edge"  cx="110" cy="196" rx="86" ry="26" />

      {/* Ondes concentriques à chaque impact */}
      <ellipse className="hd-ripple hd-r1" cx="110" cy="196" rx="20" ry="6" />
      <ellipse className="hd-ripple hd-r2" cx="110" cy="196" rx="20" ry="6" />
      <ellipse className="hd-ripple hd-r3" cx="110" cy="196" rx="20" ry="6" />

      {/* Les gouttes */}
      <g className="hd-drop hd-d1">
        <path d="M110 8 c5.5 11.5 9.5 18 9.5 23.5 a9.5 9.5 0 0 1 -19 0 C100.5 26 104.5 19.5 110 8 Z" fill="url(#hd-honey)" />
        <ellipse cx="106" cy="27" rx="2.4" ry="3.8" fill="#FDF1CE" opacity="0.8" />
      </g>
      <g className="hd-drop hd-d2">
        <path d="M110 8 c5.5 11.5 9.5 18 9.5 23.5 a9.5 9.5 0 0 1 -19 0 C100.5 26 104.5 19.5 110 8 Z" fill="url(#hd-honey)" />
        <ellipse cx="106" cy="27" rx="2.4" ry="3.8" fill="#FDF1CE" opacity="0.8" />
      </g>
      <g className="hd-drop hd-d3">
        <path d="M110 8 c5.5 11.5 9.5 18 9.5 23.5 a9.5 9.5 0 0 1 -19 0 C100.5 26 104.5 19.5 110 8 Z" fill="url(#hd-honey)" />
        <ellipse cx="106" cy="27" rx="2.4" ry="3.8" fill="#FDF1CE" opacity="0.8" />
      </g>
    </svg>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [cristaux, setCristaux] = useState(MIN_CRISTAUX)

  const pageStart = useRef(Date.now())
  const scroll50 = useRef(false)
  const scroll100 = useRef(false)

  useEffect(() => {
    trackEvent('page_view')
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (!scroll50.current && pct >= 50) { scroll50.current = true; trackEvent('scroll_50') }
      if (!scroll100.current && pct >= 95) { scroll100.current = true; trackEvent('scroll_100') }
    }
    const onUnload = () => trackEvent('page_exit', Math.round((Date.now() - pageStart.current) / 1000))
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('beforeunload', onUnload)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('beforeunload', onUnload)
    }
  }, [])

  // Parallaxe du hero : la vidéo défile moins vite que le texte, ce qui crée
  // de la profondeur. Calculé en rAF et seulement tant que le hero est visible.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const media = document.querySelector<HTMLElement>('.v-hero-media')
    const content = document.querySelector<HTMLElement>('.v-hero-content')
    if (!media) return

    let ticking = false
    const apply = () => {
      const y = window.scrollY
      const h = window.innerHeight
      if (y < h) {
        media.style.transform = `translate3d(0, ${y * 0.28}px, 0)`
        if (content) {
          content.style.transform = `translate3d(0, ${y * -0.06}px, 0)`
          content.style.opacity = String(Math.max(0, 1 - (y / h) * 1.35))
        }
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(apply) }
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Révélation au scroll, désactivée si l'utilisateur préfère moins d'animation.
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }
    // Réversible : on n'arrête pas d'observer après la première apparition,
    // et la classe se retire quand la section ressort — l'animation se rejoue
    // donc à l'envers quand on remonte la page.
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        e.target.classList.toggle('is-visible', e.isIntersecting)
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )
    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) { setFormState('invalid'); return }
    setFormState('loading')
    const { error } = await submitEmail(email)
    if (error === 'duplicate') { setFormState('duplicate'); return }
    if (error) { setFormState('network'); return }
    trackEvent('email_submit')
    setFormState('success')
  }

  const precommandeHref = `${STRIPE_PRECOMMANDE_URL}?quantity=${cristaux}`
  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <header className="v-header">
        <a className="v-wordmark" href="#top">lédjé</a>
        <a className="v-header-cta" href="#contact">Être prévenu</a>
      </header>

      {/* Grain : une trame très fine posée sur toute la page. Sans elle, le crème
          reste un aplat numérique ; avec, il prend la matière d'un papier teinté.
          Purement décoratif, ne capte jamais le pointeur. */}
      <div className="v-grain" aria-hidden="true" />

      <main id="top">
        {/* ══ 1 · LE PRODUIT — ce que c'est, tout de suite ══ */}
        <section className="v-hero" aria-labelledby="hero-title">
          <div className="v-hero-media" aria-hidden="true">
            {VIDEO_URL && !reduced && (
              <video src={VIDEO_URL} autoPlay muted loop playsInline preload="metadata" />
            )}
          </div>
          <div className="v-hero-content">
            <p className="v-hero-kicker v-fade v-fade-1">Eau miellée</p>
            <p className="v-hero-brand v-fade v-fade-2">lédjé</p>
            {/* L'accroche se dévoile ligne par ligne, chaque ligne montant
                de derrière un masque — plus habité qu'un simple fondu. */}
            <h1 id="hero-title" className="v-hero-title">
              <span className="v-line"><span className="v-line-in v-line-1">De l’eau et du miel.</span></span>
              <span className="v-line"><span className="v-line-in v-line-2">Rien de plus.</span></span>
            </h1>
            <div className="v-hero-actions v-fade v-fade-4">
              <a className="btn-ghost" href="#produit">Découvrir</a>
              <span className="v-hero-meta">Miel français · 33 cl</span>
            </div>
          </div>
          <div className="v-hero-cue v-fade v-fade-4" aria-hidden="true" />
        </section>

        {/* ══ 1 bis · CE QUE C'EST — le concret, factuel, rassurant ══ */}
        <section className="v-section" id="produit" aria-labelledby="produit-title">
          <div className="container container--wide reveal reveal--left">
            <div className="v-split">
              <div className="v-split-main">
                <p className="v-eyebrow">Le produit</p>
                <h2 id="produit-title" className="v-title v-title--xl">
                  <span className="v-line"><span className="v-line-in v-line-1">De l’eau de source.</span></span>
                  <span className="v-line"><span className="v-line-in v-line-2">Du miel français.</span></span>
                </h2>
                {/* Les faits remplacent le paragraphe : ils se lisent d'un coup
                    d'œil et donnent la clarté sans imposer de lecture. */}
                <ul className="v-strip">
                  <li>Deux ingrédients</li>
                  <li>Miel pur, jamais chauffé</li>
                  <li>33 cl</li>
                </ul>
                <p className="v-legal">
                  Miel déconseillé aux enfants de moins d’un an.
                </p>
              </div>

              <div className="v-split-side">
                <figure className="v-figure">
                  <div className="v-placeholder">
                    <strong>Photo du produit à venir</strong>
                    <span>Le premier lot n’est pas encore étiqueté.</span>
                  </div>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 2 · L'EXPÉRIENCE — la sensation, pas l'argument ══ */}
        {/* Bande en plein cadre : même traitement que le hero — l'image porte
            le texte au lieu de le côtoyer. */}
        <section className="v-band" aria-labelledby="gout-title">
          <div className="v-band-media">
            <img
              src="/visuals/origine.jpg"
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="v-band-content container container--wide reveal reveal--up">
            <p className="v-eyebrow">À la dégustation</p>
            <h2 id="gout-title" className="v-title v-title--huge">
              <span className="v-line"><span className="v-line-in v-line-1">Frais.</span></span>
              <span className="v-line"><span className="v-line-in v-line-2">Doux.</span></span>
              <span className="v-line"><span className="v-line-in v-line-3">Léger.</span></span>
            </h2>
            <p className="v-text v-text--lead">
              On la boit glacée, à la sortie du frigo.
            </p>
          </div>
        </section>

        {/* ══ 3 · LA MARQUE — pourquoi lédjé existe. Court. ══ */}
        <section className="v-section v-section--soft" id="marque" aria-labelledby="marque-title">
          <div className="container container--wide reveal reveal--right">
            <div className="v-split v-split--marque">
              <div className="v-split-main">
                <p className="v-eyebrow">Pourquoi lédjé</p>
                <h2 id="marque-title" className="v-title v-title--huge">
                  <span className="v-line"><span className="v-line-in v-line-1">Une tradition,</span></span>
                  <span className="v-line"><span className="v-line-in v-line-2">remise au goût du jour.</span></span>
                </h2>
                <p className="v-text v-text--lead">
                  L’eau miellée se boit depuis longtemps. Elle n’avait jamais été
                  faite proprement.
                </p>
              </div>
              <EauMiellee />
            </div>
          </div>
        </section>

        {/* ══ RESTER EN CONTACT — la précommande en second rideau ══ */}
        <section className="v-section" id="contact" aria-labelledby="contact-title">
          <div className="container container--wide reveal reveal--left">
            <div className="v-split">
            <div className="v-split-main">
            <p className="v-eyebrow">Rester au courant</p>
            <h2 id="contact-title" className="v-title v-title--xl">
              On te préviendra.
            </h2>
            <p className="v-text">
              Ton email, et rien d’autre. On écrit quand les bouteilles sont prêtes.
            </p>

            {formState === 'success' ? (
              <p className="v-success" role="status">
                C’est noté — on te tient au courant. À bientôt.
              </p>
            ) : (
              <form className="v-contact-form" onSubmit={handleEmailSubmit} noValidate>
                <input
                  type="email"
                  className="v-input"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); if (formState !== 'idle') setFormState('idle') }}
                  aria-label="Ton adresse email"
                  aria-invalid={formState === 'invalid'}
                  autoComplete="email"
                />
                {formState === 'invalid' && (
                  <p className="v-error" role="alert">Cette adresse semble incorrecte.</p>
                )}
                {formState === 'duplicate' && (
                  <p className="v-error" role="alert">Tu es déjà sur la liste — on ne t’oublie pas.</p>
                )}
                {formState === 'network' && (
                  <p className="v-error" role="alert">La connexion a échoué. Réessaie dans un instant.</p>
                )}
                <button type="submit" className="btn-primary" disabled={formState === 'loading'}>
                  {formState === 'loading' ? 'Un instant…' : 'Être prévenu'}
                </button>
                <p className="v-note">Pas de spam, désinscription en un clic.</p>
              </form>
            )}
            </div>

            {/* Précommande — disponible, volontairement en retrait */}
            <aside className="v-aside v-split-side">
              <p className="v-aside-title">Réserver des cristaux de miel</p>
              <p>
                À dissoudre dans un verre d’eau fraîche.
                1 cristal = {CRISTAL_UNIT_PRICE} €, {MIN_CRISTAUX} minimum.
              </p>
              <div className="v-qty">
                <button
                  type="button"
                  onClick={() => setCristaux(c => Math.max(MIN_CRISTAUX, c - 1))}
                  disabled={cristaux <= MIN_CRISTAUX}
                  aria-label="Retirer un cristal"
                >−</button>
                <span className="v-qty-val">{cristaux} × {CRISTAL_UNIT_PRICE} €</span>
                <button
                  type="button"
                  onClick={() => setCristaux(c => Math.min(MAX_CRISTAUX, c + 1))}
                  disabled={cristaux >= MAX_CRISTAUX}
                  aria-label="Ajouter un cristal"
                >+</button>
              </div>
              <a
                className="btn-ghost"
                href={precommandeHref}
                onClick={() => trackEvent('precommande_click')}
                target="_blank"
                rel="noopener noreferrer"
              >
                Réserver {cristaux} cristaux — {cristaux * CRISTAL_UNIT_PRICE} €
              </a>
            </aside>
            </div>
          </div>
        </section>
      </main>

      {/* ══ 4 · L'UNIVERS — par évocation, discret ══ */}
      <footer className="v-footer" role="contentinfo">
        <div className="container reveal">
          <p className="v-footer-brand">lédjé</p>
          <p className="v-footer-tagline">{SIGNATURE}</p>
          <p className="v-footer-mail">
            <a href="mailto:basekou@ledje.fr">basekou@ledje.fr</a>
          </p>
          <p className="v-footer-legal">
            Le miel est déconseillé aux enfants de moins d’un an.<br />
            © {new Date().getFullYear()} lédjé
          </p>
        </div>
      </footer>
    </>
  )
}
