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
  'Le geste de la tradition',
  'La qualité du miel local',
  'Le rituel au quotidien',
  "L'idée d'en offrir",
]

const INTENT_OPTIONS = [
  'Pour toi',
  'Pour offrir',
  'Les deux',
]

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function App() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [waitlistId, setWaitlistId] = useState<string | null>(null)
  const [surveyDone, setSurveyDone] = useState(false)

  // Survey state
  const [frequency, setFrequency] = useState('')
  const [attraction, setAttraction] = useState<string[]>([])
  const [intent, setIntent] = useState('')
  const [surveySubmitting, setSurveySubmitting] = useState(false)

  const surveyRef = useRef<HTMLDivElement>(null)
  const pageStartRef = useRef(Date.now())
  const scroll50Sent = useRef(false)
  const scroll100Sent = useRef(false)

  // Page view
  useEffect(() => {
    trackEvent('page_view')

    const handleScroll = () => {
      const scrollPct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      if (!scroll50Sent.current && scrollPct >= 50) {
        scroll50Sent.current = true
        trackEvent('scroll_50')
      }
      if (!scroll100Sent.current && scrollPct >= 95) {
        scroll100Sent.current = true
        trackEvent('scroll_100')
      }
    }

    const handleBeforeUnload = () => {
      const secs = Math.round((Date.now() - pageStartRef.current) / 1000)
      trackEvent('page_exit', secs)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  // Focus survey after success
  useEffect(() => {
    if (formState === 'success' && surveyRef.current) {
      setTimeout(() => {
        surveyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        surveyRef.current?.focus()
      }, 300)
    }
  }, [formState])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidEmail(email)) {
      setFormState('invalid')
      return
    }
    setFormState('loading')
    trackEvent('cta_click')
    const result = await submitEmail(email)
    if (result.error === 'duplicate') {
      setFormState('duplicate')
    } else if (result.error === 'network') {
      setFormState('network')
    } else {
      setWaitlistId(result.waitlistId)
      setFormState('success')
    }
  }

  async function handleSurveySubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!waitlistId) return
    setSurveySubmitting(true)
    await submitSurvey(waitlistId, frequency, attraction, intent)
    setSurveyDone(true)
  }

  function toggleAttraction(option: string) {
    setAttraction(prev =>
      prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option],
    )
  }

  return (
    <>
      <header role="banner">
        <span className="logo" aria-label="Lédjé">Lédjé</span>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-inner">
            <div className="hero-image" role="img" aria-label="Un verre d'eau dorée avec du miel qui se fond — le geste de Lédjé">
              <svg viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <ellipse cx="140" cy="295" rx="65" ry="12" fill="#c8a84b" opacity="0.18"/>
                <path d="M80 80 Q75 200 85 290 Q140 310 195 290 Q205 200 200 80 Z" fill="#f9f3e8" stroke="#c8a84b" strokeWidth="1.5"/>
                <ellipse cx="140" cy="80" rx="60" ry="18" fill="#f0e6cc" stroke="#c8a84b" strokeWidth="1.5"/>
                <ellipse cx="140" cy="140" rx="38" ry="14" fill="#c8a84b" opacity="0.35"/>
                <path d="M120 125 Q140 145 160 125" stroke="#c8a84b" strokeWidth="1" fill="none" opacity="0.6"/>
                <path d="M110 150 Q140 175 170 150" stroke="#c8a84b" strokeWidth="0.8" fill="none" opacity="0.4"/>
                <circle cx="130" cy="105" r="3" fill="#c8a84b" opacity="0.7"/>
                <circle cx="150" cy="98" r="2" fill="#c8a84b" opacity="0.5"/>
                <circle cx="143" cy="112" r="1.5" fill="#c8a84b" opacity="0.6"/>
              </svg>
            </div>
            <p className="hero-quote">
              « Le Prophète ﷺ buvait le miel mêlé à l'eau fraîche. »
            </p>
            <h1 id="hero-heading">
              Un geste de notre tradition,<br />remis au goût du jour.
            </h1>
            <p className="brand-name" aria-label="Lédjé">Lédjé</p>
            <a href="#formulaire" className="btn-primary" onClick={() => trackEvent('cta_click')}>
              Rejoindre les premiers
            </a>
          </div>
        </section>

        {/* ── LE GESTE ── */}
        <section className="section-geste" aria-labelledby="geste-heading">
          <div className="container">
            <div className="geste-visual" aria-hidden="true">
              <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="15" width="30" height="38" rx="4" fill="#f0e6cc" stroke="#c8a84b" strokeWidth="1.2"/>
                <text x="17" y="36" textAnchor="middle" fontSize="14" fill="#c8a84b">🍯</text>
                <path d="M38 34 L55 34" stroke="#c8a84b" strokeWidth="1.5" strokeLinecap="round" markerEnd="url(#arrow)"/>
                <defs>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
                    <path d="M0,0 L6,3 L0,6 Z" fill="#c8a84b"/>
                  </marker>
                </defs>
                <rect x="60" y="8" width="24" height="45" rx="8" fill="#f9f3e8" stroke="#c8a84b" strokeWidth="1.2"/>
                <ellipse cx="72" cy="30" rx="8" ry="4" fill="#c8a84b" opacity="0.4"/>
                <circle cx="88" cy="20" r="6" fill="#c8a84b" opacity="0.15" stroke="#c8a84b" strokeWidth="1"/>
                <text x="88" y="24" textAnchor="middle" fontSize="9" fill="#c8a84b">✓</text>
              </svg>
            </div>
            <h2 id="geste-heading">Une portion. Un verre d'eau. C'est tout.</h2>
            <p>
              Un miel pur qui se fond dans l'eau fraîche.
              Le geste se fait en quelques secondes, où que tu sois.
            </p>
          </div>
        </section>

        {/* ── L'ORIGINE ── */}
        <section className="section-origine" aria-labelledby="origine-heading">
          <div className="container">
            <div className="origine-badge" aria-hidden="true">
              <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="40" cy="40" r="38" stroke="#c8a84b" strokeWidth="1.5" fill="none"/>
                <path d="M40 15 L44 30 L60 30 L47 39 L51 54 L40 45 L29 54 L33 39 L20 30 L36 30 Z" fill="#c8a84b" opacity="0.25" stroke="#c8a84b" strokeWidth="1"/>
                <text x="40" y="68" textAnchor="middle" fontSize="8" fill="#c8a84b" fontFamily="serif">FRANCE</text>
              </svg>
            </div>
            <h2 id="origine-heading">Du vrai miel. Rien d'autre.</h2>
            <p>
              Un miel pur, français, d'origine tracée, jamais chauffé.
              Choisi avec soin, parce que ce geste mérite mieux que du frelaté.
            </p>
            <ul className="origine-points" role="list">
              <li>
                <span className="point-icon" aria-hidden="true">◈</span>
                <span>Origine tracée</span>
              </li>
              <li>
                <span className="point-icon" aria-hidden="true">◈</span>
                <span>Jamais chauffé</span>
              </li>
              <li>
                <span className="point-icon" aria-hidden="true">◈</span>
                <span>Producteurs français</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── FORMULAIRE ── */}
        <section className="section-form" id="formulaire" aria-labelledby="form-heading">
          <div className="container">
            {formState !== 'success' ? (
              <>
                <h2 id="form-heading">Sois prévenu au lancement.</h2>
                <form onSubmit={handleSubmit} noValidate aria-describedby="consent-text">
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
                        formState === 'invalid'
                          ? 'email-error'
                          : formState === 'duplicate'
                          ? 'email-duplicate'
                          : formState === 'network'
                          ? 'email-network'
                          : undefined
                      }
                      required
                    />
                    {formState === 'invalid' && (
                      <p id="email-error" role="alert" className="field-error">
                        Cet email semble incorrect. Vérifie l'adresse et réessaie.
                      </p>
                    )}
                    {formState === 'duplicate' && (
                      <p id="email-duplicate" role="alert" className="field-info">
                        Tu es déjà sur la liste — on ne t'oublie pas.
                      </p>
                    )}
                    {formState === 'network' && (
                      <p id="email-network" role="alert" className="field-error">
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
              <div className="form-success" role="status">
                <span className="success-icon" aria-hidden="true">◈</span>
                <p>C'est noté. On te prévient au lancement.</p>
              </div>
            )}
          </div>
        </section>

        {/* ── QUESTIONNAIRE ── */}
        {formState === 'success' && !surveyDone && (
          <section
            className="section-survey"
            aria-labelledby="survey-heading"
            ref={surveyRef}
            tabIndex={-1}
          >
            <div className="container">
              <h2 id="survey-heading">Une dernière chose ?</h2>
              <p className="survey-sub">30 secondes pour nous aider à faire mieux.</p>

              <form onSubmit={handleSurveySubmit}>
                {/* Q1 */}
                <fieldset>
                  <legend>À quelle fréquence en boirais-tu ?</legend>
                  <div className="radio-group" role="radiogroup">
                    {FREQUENCY_OPTIONS.map(opt => (
                      <label key={opt} className="radio-option">
                        <input
                          type="radio"
                          name="frequency"
                          value={opt}
                          checked={frequency === opt}
                          onChange={() => setFrequency(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Q2 */}
                <fieldset>
                  <legend>Qu'est-ce qui t'attire le plus ? <span className="legend-hint">(plusieurs choix possibles)</span></legend>
                  <div className="checkbox-group">
                    {ATTRACTION_OPTIONS.map(opt => (
                      <label key={opt} className="checkbox-option">
                        <input
                          type="checkbox"
                          value={opt}
                          checked={attraction.includes(opt)}
                          onChange={() => toggleAttraction(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                {/* Q3 */}
                <fieldset>
                  <legend>Tu en prendrais plutôt…</legend>
                  <div className="radio-group" role="radiogroup">
                    {INTENT_OPTIONS.map(opt => (
                      <label key={opt} className="radio-option">
                        <input
                          type="radio"
                          name="intent"
                          value={opt}
                          checked={intent === opt}
                          onChange={() => setIntent(opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div className="survey-actions">
                  <button type="submit" className="btn-primary" disabled={surveySubmitting}>
                    {surveySubmitting ? 'Un instant…' : 'Envoyer'}
                  </button>
                  <button
                    type="button"
                    className="btn-skip"
                    onClick={() => setSurveyDone(true)}
                  >
                    Passer
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {surveyDone && (
          <section className="section-survey-done" aria-live="polite">
            <div className="container">
              <p className="survey-thanks">Merci. À très vite.</p>
            </div>
          </section>
        )}
      </main>

      <footer role="contentinfo">
        <div className="container">
          <p className="legal">
            Le miel est déconseillé aux enfants de moins d'un an.
          </p>
          <p className="footer-name">Lédjé © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
