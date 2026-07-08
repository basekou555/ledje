import { useEffect, useRef, useState } from 'react'
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

/* ── Alvéole : symbole de marque (hexagone contour or + cellule centrale) ── */
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
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      style={style}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 4 L52 16 L52 40 L32 52 L12 40 L12 16 Z"
        stroke={stroke}
        strokeWidth="1.6"
        fill="none"
      />
      {filled && (
        <path
          d="M32 19 L42 25 L42 37 L32 43 L22 37 L22 25 Z"
          fill={stroke === 'var(--gold)' ? 'url(#alveole-gold)' : stroke}
        />
      )}
      <defs>
        <linearGradient id="alveole-gold" x1="22" y1="19" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBE9A8" />
          <stop offset="0.5" stopColor="#E8B65C" />
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
            <Alveole size={64} className="hero-seal reveal-child" style={revealDelay(0)} />
            <p className="hero-quote reveal-child" style={revealDelay(1)}>
              « Ce que la tradition nous a laissé de meilleur. »
            </p>
            <h1 id="hero-heading" className="reveal-child" style={revealDelay(2)}>
              Un geste de notre tradition,<br />remis au goût du jour.
            </h1>
            <p className="brand-name reveal-child" style={revealDelay(3)}>Lédjé</p>
            <p className="tagline reveal-child" style={revealDelay(4)}>Parmi les bienfaits de ce bas monde</p>

            <div className="hero-rule reveal-child" style={revealDelay(5)} aria-hidden="true">
              <Alveole size={14} filled={false} />
            </div>

            <a
              href="#formulaire"
              className="btn-primary reveal-child"
              style={revealDelay(6)}
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

        {/* ════ LE GESTE — fond crème (respiration) ════ */}
        <section className="section section-geste bg-cream" aria-labelledby="geste-heading">
          <div className="container reveal">
            <h2 id="geste-heading" className="section-title reveal-child" style={revealDelay(0)}>
              Une portion. Un verre d'eau. C'est tout.
            </h2>
            <p className="section-text reveal-child" style={revealDelay(1)}>
              Un miel pur qui se fond dans l'eau fraîche.
              Le geste se fait en quelques secondes, où que tu sois.
            </p>

            <div className="geste-photos">
              <figure className="geste-photo reveal-child" style={revealDelay(2)}>
                <Photo name="geste-01.jpg" alt="Une main saisit une portion de miel ambré posée sur la pierre" />
                <figcaption>1 · Une portion</figcaption>
              </figure>
              <figure className="geste-photo reveal-child" style={revealDelay(3)}>
                <Photo name="geste-02.jpg" alt="La portion de miel au-dessus d'un verre d'eau fraîche" />
                <figcaption>2 · Un verre d'eau</figcaption>
              </figure>
              <figure className="geste-photo reveal-child" style={revealDelay(4)}>
                <Photo name="geste-03.jpg" alt="Le miel se dissout doucement dans l'eau, en volutes dorées" />
                <figcaption>3 · Elle se fond</figcaption>
              </figure>
            </div>
          </div>
        </section>

        {/* ════ L'ORIGINE — fond émeraude velours (premium) ════ */}
        <section className="section section-origine bg-velvet" aria-labelledby="origine-heading">
          <div className="container reveal">
            <figure className="origine-image reveal-child" style={revealDelay(0)}>
              <Photo name="origine.jpg" alt="Un filet de miel doré, traversé par la lumière, sur fond vert émeraude" />
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
        <section className="section section-bouteille bg-emerald" aria-labelledby="bouteille-heading">
          <div className="container reveal">
            <figure className="bouteille-image reveal-child" style={revealDelay(0)}>
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
