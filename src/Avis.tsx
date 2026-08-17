import { useEffect, useRef, useState } from 'react'
import { submitAvis, trackEvent } from './lib/supabase'

/* Page ledje.fr/avis — recueil d'avis après dégustation.
   L'ordre des questions est volontaire (le fait avant l'intention, la
   satisfaction avant la raison) : NE PAS réordonner. Rien ici ne doit
   évoquer un bénéfice santé (textes comme mots proposés). */

const Q1_OPTIONS = [
  'C’est ma première fois',
  'J’en ai bu une ou deux fois',
  'J’en bois de temps en temps',
  'J’en bois souvent',
]

const Q2_OPTIONS = [
  'Tous les jours ou presque',
  'Plusieurs fois par semaine',
  'Plusieurs fois par mois',
  'De temps en temps',
  'Je ne pense pas en reprendre',
]

// Mots de goût — descriptifs purs, aucun bénéfice santé. « Autre » ouvre un champ libre.
const TASTE_WORDS = ['Frais', 'Subtil', 'Sucré', 'Léger', 'Intense', 'Goût de miel', 'Goût de bonbon']
const OTHER = 'Autre'
const MAX_WORDS = 3

type AvisState = 'idle' | 'loading' | 'error'

export default function Avis() {
  const [consumptionSince, setConsumptionSince] = useState('')
  const [frequencyIntent, setFrequencyIntent] = useState('')
  const [tasteRating, setTasteRating] = useState<number | null>(null)
  const [tasteWords, setTasteWords] = useState<string[]>([])
  const [tasteWordOther, setTasteWordOther] = useState('')
  const [chooseReason, setChooseReason] = useState('')
  const [improvement, setImprovement] = useState('')
  const [reclamation, setReclamation] = useState('')
  const [email, setEmail] = useState('')

  const [state, setState] = useState<AvisState>('idle')
  const [done, setDone] = useState(false)
  const doneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    trackEvent('avis_view')
  }, [])

  useEffect(() => {
    if (done && doneRef.current) {
      doneRef.current.focus()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [done])

  const otherSelected = tasteWords.includes(OTHER)
  const wordsAtMax = tasteWords.length >= MAX_WORDS

  function toggleWord(word: string) {
    setTasteWords(prev =>
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : prev.length < MAX_WORDS
          ? [...prev, word]
          : prev,
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (state === 'loading') return
    setState('loading')
    const { error } = await submitAvis({
      consumptionSince,
      frequencyIntent,
      tasteRating,
      tasteWords,
      tasteWordOther: otherSelected ? tasteWordOther : '',
      chooseReason,
      improvement,
      reclamation,
      email,
    })
    if (error) {
      setState('error')
      return
    }
    trackEvent('avis_submit')
    setDone(true)
  }

  if (done) {
    return (
      <main className="avis-page">
        <section className="section section-survey bg-velvet">
          <div
            className="container avis-done"
            ref={doneRef}
            tabIndex={-1}
            aria-live="polite"
          >
            <h1 className="avis-done-title serif">Merci, c&rsquo;est noté.</h1>
            <p className="avis-done-sub">Ça nous aide vraiment.</p>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="avis-page">
      <section className="section section-survey bg-velvet">
        <div className="container">
          <header className="avis-header">
            <h1 className="avis-title serif">Tu viens de goûter Lédjé.</h1>
            <p className="avis-lede">Dis-nous ce que tu en penses !</p>
          </header>

          <form onSubmit={handleSubmit} className="avis-form">
            {/* Q1 — le fait (depuis quand) */}
            <fieldset>
              <legend>1. Tu bois du Lédjé depuis quand&nbsp;?</legend>
              <div className="radio-group">
                {Q1_OPTIONS.map(opt => (
                  <label key={opt} className="radio-option">
                    <input
                      type="radio"
                      name="consumption_since"
                      value={opt}
                      checked={consumptionSince === opt}
                      onChange={() => setConsumptionSince(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q2 — l'intention (fréquence envisagée) */}
            <fieldset>
              <legend>2. À quelle fréquence penses-tu en boire&nbsp;?</legend>
              <div className="radio-group">
                {Q2_OPTIONS.map(opt => (
                  <label key={opt} className="radio-option">
                    <input
                      type="radio"
                      name="frequency_intent"
                      value={opt}
                      checked={frequencyIntent === opt}
                      onChange={() => setFrequencyIntent(opt)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Q3 — le goût (note + mots) */}
            <fieldset>
              <legend>3. Le goût</legend>

              <p className="avis-sublabel">Tu lui mets combien&nbsp;?</p>
              <div className="avis-stars" role="radiogroup" aria-label="Note du goût, de 1 à 5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    className={`avis-star${tasteRating !== null && n <= tasteRating ? ' is-on' : ''}`}
                    role="radio"
                    aria-checked={tasteRating === n}
                    aria-label={`${n} sur 5`}
                    onClick={() => setTasteRating(n)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <p className="avis-sublabel">
                Et quels mots lui vont le mieux&nbsp;?{' '}
                <span className="legend-hint">(3 maximum)</span>
              </p>
              <div className="checkbox-group">
                {TASTE_WORDS.map(word => {
                  const checked = tasteWords.includes(word)
                  return (
                    <label
                      key={word}
                      className={`checkbox-option${!checked && wordsAtMax ? ' is-disabled' : ''}`}
                    >
                      <input
                        type="checkbox"
                        value={word}
                        checked={checked}
                        disabled={!checked && wordsAtMax}
                        onChange={() => toggleWord(word)}
                      />
                      <span>{word}</span>
                    </label>
                  )
                })}
                <label className={`checkbox-option${!otherSelected && wordsAtMax ? ' is-disabled' : ''}`}>
                  <input
                    type="checkbox"
                    value={OTHER}
                    checked={otherSelected}
                    disabled={!otherSelected && wordsAtMax}
                    onChange={() => toggleWord(OTHER)}
                  />
                  <span>Autre</span>
                </label>
                {otherSelected && (
                  <input
                    type="text"
                    className="avis-input"
                    placeholder="Le mot qui te vient"
                    value={tasteWordOther}
                    maxLength={40}
                    onChange={e => setTasteWordOther(e.target.value)}
                    aria-label="Autre mot pour le goût"
                  />
                )}
              </div>
            </fieldset>

            {/* Q4 — la raison (libre, volontairement SANS exemple ni placeholder suggestif) */}
            <fieldset>
              <legend>4. Pourquoi tu choisirais Lédjé plutôt qu&rsquo;une autre boisson&nbsp;?</legend>
              <textarea
                className="avis-textarea"
                rows={3}
                value={chooseReason}
                maxLength={600}
                onChange={e => setChooseReason(e.target.value)}
                aria-label="Pourquoi tu choisirais Lédjé"
              />
            </fieldset>

            {/* Q5 — remarque / idée libre */}
            <fieldset>
              <legend>5. Une remarque, une idée, quelque chose à améliorer&nbsp;?</legend>
              <textarea
                className="avis-textarea"
                rows={3}
                value={improvement}
                maxLength={600}
                onChange={e => setImprovement(e.target.value)}
                aria-label="Une remarque, une idée, quelque chose à améliorer"
              />
            </fieldset>

            {/* Réclamation produit — section distincte de Q5, dépliable, repliée par défaut.
                Libellé exact validé par Basekou. Aucune allégation santé. */}
            <details className="avis-reclamation">
              <summary className="avis-reclamation-summary">
                J&rsquo;ai un problème avec ma bouteille
              </summary>
              <div className="avis-reclamation-body">
                <textarea
                  className="avis-textarea"
                  rows={3}
                  value={reclamation}
                  maxLength={800}
                  onChange={e => setReclamation(e.target.value)}
                  placeholder="Décris ce que tu as remarqué (aspect, odeur, goût inhabituel…)"
                  aria-label="Décris le problème avec ta bouteille"
                />
              </div>
            </details>

            {/* Email facultatif */}
            <fieldset>
              <legend>
                Ton email, si tu veux qu&rsquo;on te tienne au courant{' '}
                <span className="legend-hint">(facultatif)</span>
              </legend>
              <input
                type="email"
                className="avis-input"
                placeholder="ton@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                aria-label="Ton email (facultatif)"
              />
              <p className="avis-consent">
                On s&rsquo;en sert uniquement pour te donner des nouvelles de Lédjé.
                Tu peux te désinscrire quand tu veux.
              </p>
            </fieldset>

            {state === 'error' && (
              <p className="avis-error" role="alert">
                Un souci de connexion — réessaie dans un instant.
              </p>
            )}

            <div className="survey-actions">
              <button type="submit" className="btn-primary" disabled={state === 'loading'}>
                {state === 'loading' ? 'Un instant…' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
