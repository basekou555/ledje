import { useEffect, useId, useRef, useState } from 'react'
import { submitEmail, submitSurvey, trackEvent } from './lib/supabase'

type FormState = 'idle' | 'loading' | 'success' | 'invalid' | 'duplicate' | 'network'

const FREQUENCY_OPTIONS = [
  'Tous les jours',
  'Plusieurs fois par semaine',
  'De temps en temps',
  'Surtout pendant le Ramadan',
]

const ATTRACTION_OPTIONS = [
  'La tradition musulmane',
  'Le goût de la boisson',
  "L'accessibilité",
  'Une marque qui partage mes valeurs',
  'La composition simple et pure',
]

const ENTRY_FORMAT_OPTIONS = [
  'Un pack découverte, sans engagement',
  'Un abonnement, pour ne plus y penser',
  'Un coffret à offrir',
]

// Lien de réservation Stripe (acompte 5 € remboursable — « Lédjé, Réservation première production »)
const STRIPE_RESERVE_URL = 'https://buy.stripe.com/3cIcN4gH19JhcIVb28gQE01'

// Vidéo hero provisoire (génération Higgsfield hébergée CloudFront) —
// à remplacer par l'asset final auto-hébergé quand la production visuelle sera validée.
const VIDEO_URL =
  (import.meta.env.VITE_HERO_VIDEO_URL as string | undefined) ??
  'https://d8j0ntlcm91z4.cloudfront.net/user_3F7O8wGWXNEbyg1pRrys5kwKg5V/hf_20260629_045823_8c34005b-a94a-44ce-b1ba-7eae3bfcd8e8.mp4'

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

/* Délai de révélation en cascade — chaque enfant d'un bloc .reveal s'anime avec un léger décalage */
function revealDelay(i: number): React.CSSProperties {
  return { transitionDelay: `${i * 90}ms` }
}

/* Délai propre au hero — on laisse la vidéo respirer ~1,5 s, puis le texte apparaît en fondu, en cascade */
function heroRevealDelay(i: number): React.CSSProperties {
  return { transitionDelay: `${5000 + i * 110}ms` }
}

/* ── Symbole de marque Lédjé (design system, handoff validé) :
   rosace de 8 pétales entrelacés + couche interne, cœur émeraude à point d'or,
   goutte d'eau en pendentif. Contour or dégradé. Drop-in de la géométrie
   de référence (handoff/Alveole.jsx.txt) — API inchangée (size, filled, stroke). ── */
const ALVEOLE_MAIN = [0, 45, 90, 135, 180, 225, 270, 315]
const ALVEOLE_INNER = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
const ALVEOLE_MAIN_D = 'M100 96 C72 72 72 46 100 26 C128 46 128 72 100 96 Z'
const ALVEOLE_INNER_D = 'M100 96 C92 82 92 70 100 58 C108 70 108 82 100 96 Z'
const ALVEOLE_DROP_D = 'M100 166 C107 179 114 189 114 200 A14 14 0 0 1 86 200 C86 189 93 179 100 166 Z'
function Alveole({
  size = 64,
  filled = true,
  stroke = 'var(--gold)',
  className = '',
  style,
}: {
  size?: number
  filled?: boolean
  stroke?: string
  className?: string
  style?: React.CSSProperties
}) {
  const gradId = useId()
  const line = stroke === 'var(--gold)' ? `url(#${gradId})` : stroke
  return (
    <svg
      width={size}
      height={size}
      viewBox="-10 18 220 220"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" stroke={line} strokeWidth="2.4" strokeLinejoin="round">
        <g>
          {ALVEOLE_MAIN.map(a => (
            <path key={`m${a}`} d={ALVEOLE_MAIN_D} transform={`rotate(${a} 100 96)`} />
          ))}
        </g>
        <g>
          {ALVEOLE_INNER.map(a => (
            <path key={`i${a}`} d={ALVEOLE_INNER_D} transform={`rotate(${a} 100 96)`} />
          ))}
        </g>
        {filled && (
          <>
            <circle cx="100" cy="96" r="14" fill="#1F4736" />
            <circle cx="100" cy="96" r="14" />
            <circle cx="100" cy="96" r="5.5" fill={line} stroke="none" />
          </>
        )}
        <path d={ALVEOLE_DROP_D} strokeLinecap="butt" />
      </g>
      <defs>
        <linearGradient id={gradId} x1="100" y1="26" x2="100" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBE9A8" />
          <stop offset="0.55" stopColor="#E8B65C" />
          <stop offset="1" stopColor="#A9740F" />
        </linearGradient>
      </defs>
    </svg>
  )
}

/* Photo de production — repli propre (bloc coloré) si le fichier n'est pas encore déposé */
function Photo({ name, alt, className = '' }: { name: string; alt: string; className?: string }) {
  return (
    <img
      src={`/visuals/${name}`}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={e => { e.currentTarget.style.visibility = 'hidden' }}
    />
  )
}

/* Petit hexagone-puce pour les listes */
function HexBullet() {
  return (
    <svg className="pt-hex" viewBox="0 0 14 16" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 1 L13 4.5 L13 11.5 L7 15 L1 11.5 L1 4.5 Z" fill="var(--gold)" opacity="0.9" />
    </svg>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [waitlistId, setWaitlistId] = useState<string | null>(null)
  const [surveyDone, setSurveyDone] = useState(false)
  const [frequency, setFrequency] = useState('')
  const [attraction, setAttraction] = useState<string[]>([])
  const [entryFormat, setEntryFormat] = useState('')
  const [surveySubmitting, setSurveySubmitting] = useState(false)

  const surveyRef = useRef<HTMLDivElement>(null)
  const gesteTrackRef = useRef<HTMLDivElement>(null)
  const origineVideoRef = useRef<HTMLVideoElement>(null)
  const pageStartRef = useRef(Date.now())
  const scroll50Sent = useRef(false)
  const scroll100Sent = useRef(false)

  useEffect(() => {
    trackEvent('page_view')

    const handleScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (!scroll50Sent.current && pct >= 50) { scroll50Sent.current = true; trackEvent('scroll_50') }
      if (!scroll100Sent.current && pct >= 95) { scroll100Sent.current = true; trackEvent('scroll_100') }
    }
    const handleUnload = () => {
      trackEvent('page_exit', Math.round((Date.now() - pageStartRef.current) / 1000))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  useEffect(() => {
    if (formState === 'success' && surveyRef.current) {
      setTimeout(() => {
        surveyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        surveyRef.current?.focus()
      }, 300)
    }
  }, [formState])

  // Révélation au scroll (fondu + léger glissement) — désactivée si l'utilisateur préfère moins d'animation
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = document.querySelectorAll('.reveal')

    if (prefersReduced) {
      targets.forEach(el => el.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' },
    )
    targets.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  // Carrousel « Le Geste » : la section reste figée, les 3 images défilent
  // horizontalement au rythme du scroll vertical (façon Red Bull, en natif).
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const track = gesteTrackRef.current
    const section = document.querySelector<HTMLElement>('.geste-carousel')
    const viewport = document.querySelector<HTMLElement>('.geste-carousel-viewport')
    if (prefersReduced || !track || !section || !viewport) return

    // La translation se termine à HOLD_RATIO du scroll ; le reste = temps de
    // « pause » où la dernière image reste affichée plein écran avant de libérer.
    const HOLD_RATIO = 0.78
    let ticking = false
    const update = () => {
      const scrollable = section.offsetHeight - viewport.offsetHeight
      const raw = scrollable > 0
        ? Math.min(Math.max(-section.getBoundingClientRect().top / scrollable, 0), 1)
        : 0
      const progress = Math.min(raw / HOLD_RATIO, 1)
      const maxTranslate = track.scrollWidth - viewport.clientWidth
      track.style.transform = `translate3d(${-progress * maxTranslate}px, 0, 0)`
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Parallax discret sur la trame d'alvéoles du hero
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const honeycomb = document.querySelector<HTMLElement>('.hero-honeycomb')
    if (prefersReduced || !honeycomb) return

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        honeycomb.style.transform = `translate3d(0, ${window.scrollY * 0.12}px, 0)`
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) { setFormState('invalid'); return }
    setFormState('loading')
    trackEvent('cta_click')
    const result = await submitEmail(email)
    if (result.error === 'duplicate') setFormState('duplicate')
    else if (result.error === 'network') setFormState('network')
    else { setWaitlistId(result.waitlistId); setFormState('success') }
  }

  async function handleSurveySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!waitlistId) return
    setSurveySubmitting(true)
    await submitSurvey(waitlistId, frequency, attraction, entryFormat)
    setSurveyDone(true)
  }

  // Vidéo « le miel qui coule ».
  // Desktop (souris) : au survol → lecture, au départ → figée.
  // Mobile (tactile) : un tap lance, un tap arrête (pas besoin de maintenir le doigt).
  function playOrigineVideo(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    const v = origineVideoRef.current
    if (!v) return
    e.currentTarget.classList.add('is-playing')
    v.play().catch(() => {})
  }
  function stopOrigineVideo(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    const v = origineVideoRef.current
    if (!v) return
    e.currentTarget.classList.remove('is-playing')
    v.pause()
  }
  function toggleOrigineVideo(e: React.MouseEvent) {
    // uniquement sur appareils sans survol (tactile) : tap pour lancer / arrêter
    if (!window.matchMedia('(hover: none)').matches) return
    const v = origineVideoRef.current
    if (!v) return
    const fig = e.currentTarget as HTMLElement
    if (v.paused) {
      fig.classList.add('is-playing')
      v.play().catch(() => {})
    } else {
      fig.classList.remove('is-playing')
      v.pause()
    }
  }

  function toggleAttraction(opt: string) {
    setAttraction(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])
  }

  return (
    <>
      <header role="banner">
        <Alveole size={22} className="header-mark" />
        <span className="logo">Lédjé</span>
      </header>

      <main>
        {/* ════ HERO ════ */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-honeycomb" aria-hidden="true" />

          {VIDEO_URL && !window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
            <div className="hero-video-wrap">
              <video
                src={VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="Une portion de miel pur se dissolvant lentement dans un verre d'eau fraîche"
              />
            </div>
          )}

          <div className="hero-content reveal">
            <Alveole size={64} className="hero-seal reveal-child" style={heroRevealDelay(0)} />
            <p className="hero-quote reveal-child" style={heroRevealDelay(1)}>
              « Ce que la tradition nous a laissé de meilleur. »
            </p>
            <h1 id="hero-heading" className="reveal-child" style={heroRevealDelay(2)}>
              Un geste de notre tradition,<br />remis au goût du jour.
            </h1>
            <p className="brand-name reveal-child" style={heroRevealDelay(3)}>Lédjé</p>
            <p className="tagline reveal-child" style={heroRevealDelay(4)}>Parmi les bienfaits de ce bas monde</p>

            <div className="hero-rule reveal-child" style={heroRevealDelay(5)} aria-hidden="true">
              <Alveole size={14} filled={false} />
            </div>

            <a
              href="#formulaire"
              className="btn-primary reveal-child"
              style={heroRevealDelay(6)}
              onClick={() => trackEvent('cta_click')}
            >
              Rejoindre les premiers
            </a>
          </div>

          <div className="scroll-hint" aria-hidden="true">
            <span>Découvrir</span>
            <div className="scroll-hint-arrow" />
          </div>
        </section>

        {/* ════ LE GESTE — carrousel horizontal piloté par le scroll vertical (section figée) ════ */}
        <section className="section-geste bg-cream" aria-labelledby="geste-heading">
          <div className="geste-intro container reveal">
            <h2 id="geste-heading" className="section-title reveal-child" style={revealDelay(0)}>
              Une portion. Un verre d'eau. C'est tout.
            </h2>
            <p className="section-text reveal-child" style={revealDelay(1)}>
              Un miel pur qui se fond dans l'eau fraîche.
              Le geste se fait en quelques secondes, où que tu sois.
            </p>
          </div>

          <div className="geste-carousel">
            <div className="geste-carousel-viewport">
              <div className="geste-carousel-track" ref={gesteTrackRef}>
                <figure className="geste-slide">
                  <Photo name="geste-01.jpg" alt="Une main saisit une portion de miel ambré posée sur la pierre" />
                  <figcaption><span className="geste-slide-num">01</span>Une portion</figcaption>
                </figure>
                <figure className="geste-slide">
                  <Photo name="geste-02.jpg" alt="La portion de miel au-dessus d'un verre d'eau fraîche" />
                  <figcaption><span className="geste-slide-num">02</span>Un verre d'eau</figcaption>
                </figure>
                <figure className="geste-slide">
                  <Photo name="geste-03.jpg" alt="Le miel se dissout doucement dans l'eau, en volutes dorées" />
                  <figcaption><span className="geste-slide-num">03</span>C'est tout</figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ════ L'ORIGINE — fond émeraude velours (premium) ════ */}
        <section className="section section-origine bg-amber" aria-labelledby="origine-heading">
          <div className="container reveal">
            <figure
              className="origine-image fullbleed reveal-child hovervideo"
              style={revealDelay(0)}
              onPointerEnter={playOrigineVideo}
              onPointerLeave={stopOrigineVideo}
              onClick={toggleOrigineVideo}
            >
              <Photo name="origine.jpg" alt="Un filet de miel doré, traversé par la lumière, sur fond vert émeraude" />
              <video
                ref={origineVideoRef}
                className="origine-video"
                src="/visuals/origine.mp4"
                muted
                loop
                playsInline
                preload="none"
                aria-hidden="true"
              />
            </figure>
            <p className="section-eyebrow reveal-child" style={revealDelay(1)}>L'origine</p>
            <h2 id="origine-heading" className="section-title reveal-child" style={revealDelay(2)}>
              Du vrai miel. Rien d'autre.
            </h2>
            <p className="section-text reveal-child" style={revealDelay(3)}>
              Un miel pur, français, d'origine tracée, jamais chauffé.
              Choisi avec soin, parce que ce geste mérite mieux que du frelaté.
            </p>
            <ul className="origine-points reveal-child" role="list" style={revealDelay(4)}>
              <li><HexBullet />Origine tracée</li>
              <li><HexBullet />Jamais chauffé</li>
              <li><HexBullet />Producteurs français</li>
              <li><HexBullet />Pur miel</li>
            </ul>
          </div>
        </section>

        {/* ════ BOUTEILLE — teaser (communication anticipée, pas d'achat) ════ */}
        <section className="section section-bouteille bg-deep" aria-labelledby="bouteille-heading">
          <div className="container reveal">
            <figure className="bouteille-image bouteille-showcase reveal-child" style={revealDelay(0)}>
              <Photo name="bouteille.jpg" alt="La bouteille Lédjé, étiquette émeraude et or, perlée de fraîcheur" />
            </figure>
            <p className="section-eyebrow reveal-child" style={revealDelay(1)}>Bientôt</p>
            <h2 id="bouteille-heading" className="section-title reveal-child" style={revealDelay(2)}>
              Et un jour, prête à emporter.
            </h2>
            <p className="section-text reveal-child" style={revealDelay(3)}>
              Le même geste, partout avec toi. On y travaille — sois là quand elle arrive.
            </p>
          </div>
        </section>

        {/* ════ FAQ — fond crème (lever les freins avant conversion) ════ */}
        <section className="section section-faq bg-cream" aria-labelledby="faq-heading">
          <div className="container reveal">
            <p className="section-eyebrow reveal-child" style={revealDelay(0)}>Les questions qu'on nous pose</p>
            <h2 id="faq-heading" className="section-title reveal-child" style={revealDelay(1)}>
              Ce qu'il faut savoir.
            </h2>

            <div className="faq-list reveal-child" style={revealDelay(2)}>
              <details className="faq-item">
                <summary>C'est quoi, Lédjé, exactement ?</summary>
                <p>Une portion de miel pur à dissoudre dans un verre d'eau. Le même geste que la tradition nous a laissé, remis au goût du jour.</p>
              </details>
              <details className="faq-item">
                <summary>C'est vraiment que du miel ?</summary>
                <p>Oui. Un miel pur, français, d'origine tracée, jamais chauffé. Rien d'ajouté, rien de frelaté.</p>
              </details>
              <details className="faq-item">
                <summary>Quand est-ce que ça sort ?</summary>
                <p>On prépare la première production. Laisse ton email : les inscrits sont prévenus en premier, avant tout le monde.</p>
              </details>
              <details className="faq-item">
                <summary>Combien ça va coûter ?</summary>
                <p>Le prix sera annoncé au lancement. Les premiers inscrits bénéficient d'un tarif préférentiel garanti.</p>
              </details>
              <details className="faq-item">
                <summary>Pourquoi réserver avec un acompte ?</summary>
                <p>L'acompte de 5 € nous aide à lancer la première production et te garantit ta place. Il est intégralement remboursé si la production n'est pas lancée.</p>
              </details>
              <details className="faq-item">
                <summary>Est-ce que ça convient à tout le monde ?</summary>
                <p>Lédjé, c'est du miel. Comme tout miel, il est déconseillé aux enfants de moins d'un an.</p>
              </details>
            </div>
          </div>
        </section>

        {/* ════ FORMULAIRE — fond crème (conversion) ════ */}
        <section className="section section-form bg-cream" id="formulaire" aria-labelledby="form-heading">
          <div className="container reveal">
            {formState !== 'success' ? (
              <>
                <div className="form-header reveal-child" style={revealDelay(0)}>
                  <p className="section-eyebrow">Lancement bientôt</p>
                  <h2 id="form-heading" className="section-title">Sois prévenu au lancement.</h2>
                </div>

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-describedby="consent-text"
                  className="reveal-child"
                  style={revealDelay(1)}
                >
                  <div className="field-group">
                    <label htmlFor="email-input">Ton email</label>
                    <input
                      id="email-input"
                      type="email"
                      autoComplete="email"
                      placeholder="ton@email.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                        if (formState === 'invalid') setFormState('idle')
                      }}
                      aria-invalid={formState === 'invalid'}
                      aria-describedby={
                        formState === 'invalid' ? 'email-error' :
                        formState === 'duplicate' ? 'email-dup' :
                        formState === 'network' ? 'email-net' : undefined
                      }
                      required
                    />
                    {formState === 'invalid' && (
                      <p id="email-error" role="alert" className="field-error">
                        Cet email semble incorrect. Vérifie l'adresse et réessaie.
                      </p>
                    )}
                    {formState === 'duplicate' && (
                      <p id="email-dup" role="alert" className="field-info">
                        Tu es déjà sur la liste — on ne t'oublie pas.
                      </p>
                    )}
                    {formState === 'network' && (
                      <p id="email-net" role="alert" className="field-error">
                        La connexion a échoué. Réessaie dans un instant.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={formState === 'loading'}
                    aria-busy={formState === 'loading'}
                  >
                    {formState === 'loading' ? 'Un instant…' : 'Je veux être prévenu'}
                  </button>

                  <p id="consent-text" className="consent">
                    En t'inscrivant, tu acceptes de recevoir nos nouvelles.
                    Pas de spam, désinscription en un clic.
                  </p>
                </form>
              </>
            ) : (
              <div className="form-success fade-in-up" role="status">
                <Alveole size={64} className="success-seal" />
                <div>
                  <h3>C'est noté.</h3>
                  <p>On te prévient au lancement. À très vite.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ════ QUESTIONNAIRE — fond émeraude ════ */}
        {formState === 'success' && !surveyDone && (
          <section
            className="section section-survey bg-emerald"
            aria-labelledby="survey-heading"
            ref={surveyRef}
            tabIndex={-1}
          >
            <div className="container fade-in-up">
              <h2 id="survey-heading" className="section-title" style={{ color: 'var(--cream)' }}>
                Une dernière chose ?
              </h2>
              <p className="survey-sub">30 secondes pour nous aider à faire mieux.</p>

              <form onSubmit={handleSurveySubmit}>
                <fieldset>
                  <legend>À quelle fréquence en boirais-tu ?</legend>
                  <div className="radio-group">
                    {FREQUENCY_OPTIONS.map(opt => (
                      <label key={opt} className="radio-option">
                        <input type="radio" name="frequency" value={opt} checked={frequency === opt} onChange={() => setFrequency(opt)} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>
                    Qu'est-ce qui t'attire le plus ?{' '}
                    <span className="legend-hint">(plusieurs choix)</span>
                  </legend>
                  <div className="checkbox-group">
                    {ATTRACTION_OPTIONS.map(opt => (
                      <label key={opt} className="checkbox-option">
                        <input type="checkbox" value={opt} checked={attraction.includes(opt)} onChange={() => toggleAttraction(opt)} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset>
                  <legend>Pour commencer, tu préférerais…</legend>
                  <div className="radio-group">
                    {ENTRY_FORMAT_OPTIONS.map(opt => (
                      <label key={opt} className="radio-option">
                        <input type="radio" name="entry_format" value={opt} checked={entryFormat === opt} onChange={() => setEntryFormat(opt)} />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="survey-actions">
                  <button type="submit" className="btn-primary" disabled={surveySubmitting}>
                    {surveySubmitting ? 'Un instant…' : 'Envoyer'}
                  </button>
                  <button type="button" className="btn-skip" onClick={() => setSurveyDone(true)}>
                    Passer
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {surveyDone && (
          <section className="section-survey-done bg-emerald" aria-live="polite" aria-labelledby="reserve-heading">
            <div className="container fade-in-up">
              <p className="survey-thanks">Merci. À très vite.</p>

              <div className="reserve-block">
                <Alveole size={40} className="reserve-seal" />
                <h3 id="reserve-heading" className="reserve-title">
                  Tu veux une place dans la première production ?
                </h3>
                <p className="reserve-text">
                  Réserve-la dès maintenant avec un acompte de 5 € —
                  intégralement remboursé si la production n'est pas lancée.
                </p>
                <a
                  href={STRIPE_RESERVE_URL}
                  className="btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('stripe_click')}
                >
                  Je réserve ma place — 5 €
                </a>
                <p className="reserve-note">
                  Paiement sécurisé par Stripe. Prix préférentiel de lancement garanti.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer role="contentinfo">
        <div className="container reveal">
          <Alveole size={40} className="footer-seal reveal-child" style={revealDelay(0)} />
          <p className="footer-name reveal-child" style={revealDelay(1)}>Lédjé</p>
          <p className="footer-tagline reveal-child" style={revealDelay(2)}>Parmi les bienfaits de ce bas monde</p>
          <p className="legal reveal-child" style={revealDelay(3)}>Le miel est déconseillé aux enfants de moins d'un an.</p>
          <p className="footer-copy reveal-child" style={revealDelay(4)}>© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
