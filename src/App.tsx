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

  // Révélation au scroll, désactivée si l'utilisateur préfère moins d'animation.
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obs.unobserve(e.target) }
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
            <h1 id="hero-title" className="v-hero-title v-fade v-fade-3">{ACCROCHE}</h1>
            <div className="v-hero-actions v-fade v-fade-4">
              <a className="btn-ghost" href="#produit">Découvrir</a>
              <span className="v-hero-meta">Miel français · 33 cl</span>
            </div>
          </div>
          <div className="v-hero-cue v-fade v-fade-4" aria-hidden="true" />
        </section>

        {/* ══ 1 bis · CE QUE C'EST — le concret, factuel, rassurant ══ */}
        <section className="v-section" id="produit" aria-labelledby="produit-title">
          <div className="container container--wide reveal">
            <div className="v-split">
              <div className="v-split-main">
                <p className="v-eyebrow">Le produit</p>
                <h2 id="produit-title" className="v-title v-title--lg">
                  De l’eau de source et du miel français. C’est tout.
                </h2>
                <p className="v-text">
                  lédjé, c’est une eau miellée prête à boire. Deux ingrédients,
                  aucun additif, rien d’autre à comprendre.
                </p>
                <p className="v-legal">
                  Le miel est déconseillé aux enfants de moins d’un an.
                </p>
              </div>

              <div className="v-split-side">
                <ul className="v-facts">
                  <li><span className="v-fact-key">Composition</span><span className="v-fact-val">Eau de source, miel</span></li>
                  <li><span className="v-fact-key">Le miel</span><span className="v-fact-val">Français, pur, origine tracée, jamais chauffé</span></li>
                  <li><span className="v-fact-key">Format</span><span className="v-fact-val">Bouteille de 33 cl</span></li>
                  <li><span className="v-fact-key">Le nom</span><span className="v-fact-val">Lé, le miel · djé, l’eau — du diakanké</span></li>
                </ul>
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
        <section className="v-section v-section--green" aria-labelledby="gout-title">
          <div className="container container--wide reveal">
            <div className="v-split v-split--media">
              <figure className="v-figure v-figure--tall">
                <img
                  src="/visuals/origine.jpg"
                  alt="Du miel versé dans un verre d’eau fraîche"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
              <div className="v-split-main">
                <p className="v-eyebrow">À la dégustation</p>
                <h2 id="gout-title" className="v-title v-title--lg">
                  Frais, doux, léger.
                </h2>
                <p className="v-text">
                  Le miel se laisse reconnaître sans s’imposer. On la boit glacée,
                  à la sortie du frigo, quand il fait chaud ou quand on a simplement soif.
                </p>
                <p className="v-text">
                  C’est le genre de boisson qu’on finit sans y penser, et qu’on ressert.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══ 3 · LA MARQUE — pourquoi lédjé existe. Court. ══ */}
        <section className="v-section v-section--soft" id="marque" aria-labelledby="marque-title">
          <div className="container container--prose reveal">
            <p className="v-eyebrow">Pourquoi lédjé</p>
            <h2 id="marque-title" className="v-title v-title--xl">
              Une tradition, remise au goût du jour.
            </h2>
            <p className="v-text">
              L’eau miellée se boit depuis longtemps. Elle n’avait simplement jamais été
              faite proprement, en bouteille, avec du bon miel et sans compromis.
            </p>
            <p className="v-text">
              C’est ce qu’on construit : une boisson qu’on est fier de poser sur une table,
              et une marque transparente sur ce qu’elle met dedans.
            </p>
          </div>
        </section>

        {/* ══ RESTER EN CONTACT — la précommande en second rideau ══ */}
        <section className="v-section" id="contact" aria-labelledby="contact-title">
          <div className="container container--wide reveal">
            <div className="v-split">
            <div className="v-split-main">
            <p className="v-eyebrow">Rester au courant</p>
            <h2 id="contact-title" className="v-title v-title--lg">
              On te préviendra au lancement.
            </h2>
            <p className="v-text">
              Laisse ton email, on t’écrit quand les premières bouteilles sont prêtes.
              Pas plus souvent que nécessaire.
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
                Un cristal de miel à dissoudre dans un verre d’eau fraîche.
                1 cristal = {CRISTAL_UNIT_PRICE} €, {MIN_CRISTAUX} minimum.
                Tu réserves ta place dans la première production.
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
