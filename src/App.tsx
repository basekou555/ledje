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

const INTENT_OPTIONS = ['Pour toi', 'Pour offrir', 'Les deux']

const VIDEO_URL = import.meta.env.VITE_HERO_VIDEO_URL as string | undefined

function isValidEmail(e: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
}

export default function App() {
  const [email, setEmail] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [waitlistId, setWaitlistId] = useState<string | null>(null)
  const [surveyDone, setSurveyDone] = useState(false)
  const [frequency, setFrequency] = useState('')
  const [attraction, setAttraction] = useState<string[]>([])
  const [intent, setIntent] = useState('')
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
    await submitSurvey(waitlistId, frequency, attraction, intent)
    setSurveyDone(true)
  }

  function toggleAttraction(opt: string) {
    setAttraction(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])
  }

  return (
    <>
      <header role="banner">
        <span className="logo" aria-label="Lédjé">Lédjé</span>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-bg" aria-hidden="true" />

          {VIDEO_URL ? (
            <div className="hero-video-wrap" aria-hidden="true">
              <video
                src={VIDEO_URL}
                autoPlay
                loop
                muted
                playsInline
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="hero-placeholder" aria-hidden="true">
              <svg viewBox="0 0 280 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glass */}
                <path d="M85 90 Q80 230 88 360 Q140 385 192 360 Q200 230 195 90 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(200,168,75,0.3)" strokeWidth="1.5"/>
                <ellipse cx="140" cy="90" rx="55" ry="16" fill="rgba(255,255,255,0.04)" stroke="rgba(200,168,75,0.3)" strokeWidth="1.5"/>
                {/* Honey swirl */}
                <ellipse cx="140" cy="180" rx="40" ry="12" fill="rgba(200,168,75,0.2)"/>
                <path d="M108 165 Q140 195 172 165" stroke="rgba(200,168,75,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                <path d="M115 178 Q140 205 165 178" stroke="rgba(200,168,75,0.35)" strokeWidth="1" fill="none" strokeLinecap="round"/>
                <path d="M122 192 Q140 215 158 192" stroke="rgba(200,168,75,0.2)" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
                {/* Honey drop */}
                <path d="M140 55 Q145 70 148 80 Q148 90 140 92 Q132 90 132 80 Q135 70 140 55 Z" fill="rgba(200,168,75,0.7)"/>
                {/* Particles */}
                <circle cx="122" cy="145" r="2.5" fill="rgba(200,168,75,0.6)"/>
                <circle cx="158" cy="138" r="2" fill="rgba(200,168,75,0.45)"/>
                <circle cx="135" cy="132" r="1.5" fill="rgba(200,168,75,0.5)"/>
                <circle cx="150" cy="155" r="1.8" fill="rgba(200,168,75,0.4)"/>
              </svg>
            </div>
          )}

          <div className="hero-content">
            <p className="hero-eyebrow">
              « Le Prophète ﷺ buvait le miel mêlé à l'eau fraîche. »
            </p>
            <div className="hero-divider" aria-hidden="true" />
            <h1 id="hero-heading">
              Un geste de notre tradition,<br />remis au goût du jour.
            </h1>
            <p className="brand-name" aria-label="Lédjé">Lédjé</p>
            <a
              href="#formulaire"
              className="btn-primary"
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

        {/* ── LE GESTE ── */}
        <section className="section-geste" aria-labelledby="geste-heading">
          <div className="container">
            <div className="geste-steps" aria-hidden="true">
              <div className="geste-step">
                <div className="geste-step-icon">🍯</div>
                <span className="geste-step-label">Une portion</span>
              </div>
              <span className="geste-arrow" aria-hidden="true">→</span>
              <div className="geste-step">
                <div className="geste-step-icon">💧</div>
                <span className="geste-step-label">Un verre d'eau</span>
              </div>
              <span className="geste-arrow" aria-hidden="true">→</span>
              <div className="geste-step">
                <div className="geste-step-icon">✓</div>
                <span className="geste-step-label">C'est tout</span>
              </div>
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
            <div className="origine-seal" aria-hidden="true">
              <div className="seal-inner">Miel<br/>pur<br/>France</div>
            </div>
            <h2 id="origine-heading">Du vrai miel. Rien d'autre.</h2>
            <p>
              Un miel pur, français, d'origine tracée, jamais chauffé.
              Choisi avec soin, parce que ce geste mérite mieux que du frelaté.
            </p>
            <ul className="origine-points" role="list">
              <li><span className="point-icon" aria-hidden="true">◆</span>Origine tracée</li>
              <li><span className="point-icon" aria-hidden="true">◆</span>Jamais chauffé</li>
              <li><span className="point-icon" aria-hidden="true">◆</span>Producteurs français</li>
              <li><span className="point-icon" aria-hidden="true">◆</span>Pur miel</li>
            </ul>
          </div>
        </section>

        {/* ── FORMULAIRE ── */}
        <section className="section-form" id="formulaire" aria-labelledby="form-heading">
          <div className="container">
            {formState !== 'success' ? (
              <>
                <div className="form-header">
                  <p className="form-eyebrow">Lancement bientôt</p>
                  <h2 id="form-heading">Sois prévenu en premier.</h2>
                </div>

                <form onSubmit={handleSubmit} noValidate aria-describedby="consent-text" style={{ width: '100%' }}>
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
              <div className="form-success" role="status">
                <div className="success-mark" aria-hidden="true">◈</div>
                <div>
                  <h3>C'est noté.</h3>
                  <p>On te prévient au lancement. À très vite.</p>
                </div>
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
                  <legend>Tu en prendrais plutôt…</legend>
                  <div className="radio-group">
                    {INTENT_OPTIONS.map(opt => (
                      <label key={opt} className="radio-option">
                        <input type="radio" name="intent" value={opt} checked={intent === opt} onChange={() => setIntent(opt)} />
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
          <section className="section-survey-done" aria-live="polite">
            <div className="container">
              <p className="survey-thanks">Merci. À très vite.</p>
            </div>
          </section>
        )}
      </main>

      <footer role="contentinfo">
        <div className="container">
          <p className="footer-logo" aria-label="Lédjé">Lédjé</p>
          <p className="legal">Le miel est déconseillé aux enfants de moins d'un an.</p>
          <p className="footer-copy">© {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
