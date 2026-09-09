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

/* La précommande de cristaux (compteur + lien de paiement Stripe) a été
   retirée de la vitrine le 2026-09-09, remplacée par l'appel à donner son
   avis. Le lien de paiement lui-même n'est pas supprimé côté Stripe : il
   reste valide et repartageable à la main. Pour le remettre dans la page,
   voir l'historique du fichier. */

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

  /* Révélation au scroll.
     Chaque élément animé est observé pour lui-même, et non le bloc `.reveal`
     qui le contient : ces blocs font la hauteur d'une section entière, si bien
     que leur seuil d'entrée était franchi — et l'animation jouée — bien avant
     que le texte soit à l'écran. Seul le premier texte semblait donc s'animer.
     On n'arrête pas d'observer : la classe se retire quand l'élément ressort,
     et le mouvement se rejoue à l'envers quand on remonte la page. */
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      [
        '.reveal .v-eyebrow',
        /* On observe le MASQUE, pas la ligne : la ligne est translatée de 105 %
           vers le bas, donc entièrement découpée par l'overflow du masque —
           l'observateur la voyait comme jamais visible et ne la révélait
           jamais. Le masque, lui, est bien à sa place dans la page. */
        '.reveal .v-line',
        '.reveal .v-text',
        '.reveal .v-legal',
        '.reveal .v-success',
        '.reveal .v-spec',
        '.reveal .v-figure',
        '.reveal .v-contact-form > *',
        '.reveal .v-aside',
      ].join(','),
    )
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        e.target.classList.toggle('is-visible', e.isIntersecting)
      }),
      { threshold: 0, rootMargin: '0px 0px -12% 0px' },
    )
    targets.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [formState])

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

  const reduced = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <>
      <header className="v-header">
        <a className="v-wordmark" href="#top">lédjé</a>
        <a className="v-header-cta" href="/avis">Donner ton avis</a>
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
            {/* L'accroche se dévoile ligne par ligne, chaque ligne montant
                de derrière un masque — plus habité qu'un simple fondu. */}
            <h1 id="hero-title" className="v-hero-title">
              <span className="v-line"><span className="v-line-in v-line-1">De l’eau et du miel.</span></span>
              <span className="v-line"><span className="v-line-in v-line-2">Rien de plus.</span></span>
            </h1>
            <div className="v-hero-actions v-fade v-fade-4">
              <a
                className="btn-ghost"
                href="/avis"
                onClick={() => trackEvent('avis_click')}
              >
                Donner ton avis
              </a>
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
                    d'œil et donnent la clarté sans imposer de lecture.
                    Traités en plaque de spécimen — intitulé discret, valeur en
                    serif, filets fins — et non en pastilles : la pastille
                    arrondie est le motif par défaut de tous les sites générés,
                    c'est ce qui donnait l'impression de gabarit. */}
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
                {/* La mention « miel déconseillé aux enfants de moins d'un an »
                    n'est pas répétée ici : elle figure en pied de page, et une
                    seule fois suffit. */}
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
            <div className="v-split">
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
            </div>
          </div>
        </section>

        {/* ══ RESTER EN CONTACT — l'avis en second rideau ══ */}
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

            {/* Avis — prend la place de la précommande cristaux, retirée le
                2026-09-09 (décision Basekou). Ce qu'on attend d'un visiteur
                aujourd'hui, ce n'est pas qu'il achète : c'est qu'il dise ce
                qu'il a goûté. */}
            <aside className="v-aside v-split-side">
              <p className="v-aside-title">Tu l’as goûtée ?</p>
              <p>
                Dis-nous ce que tu en as pensé. Quelques questions, deux
                minutes. C’est ce qui fait avancer la recette.
              </p>
              <a
                className="btn-ghost"
                href="/avis"
                onClick={() => trackEvent('avis_click')}
              >
                Donner ton avis
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
