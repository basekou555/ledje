import { useId } from 'react'

/* Symbole de marque Lédjé (rosace + goutte) — copie autonome pour la page en construction. */
const MAIN = [0, 45, 90, 135, 180, 225, 270, 315]
const INNER = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]
const MAIN_D = 'M100 96 C72 72 72 46 100 26 C128 46 128 72 100 96 Z'
const INNER_D = 'M100 96 C92 82 92 70 100 58 C108 70 108 82 100 96 Z'
const DROP_D = 'M100 166 C107 179 114 189 114 200 A14 14 0 0 1 86 200 C86 189 93 179 100 166 Z'

function Seal({ size = 84 }: { size?: number }) {
  const g = useId()
  return (
    <svg width={size} height={size} viewBox="-10 18 220 220" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <g fill="none" stroke={`url(#${g})`} strokeWidth="2.4" strokeLinejoin="round">
        <g>{MAIN.map(a => <path key={`m${a}`} d={MAIN_D} transform={`rotate(${a} 100 96)`} />)}</g>
        <g>{INNER.map(a => <path key={`i${a}`} d={INNER_D} transform={`rotate(${a} 100 96)`} />)}</g>
        <circle cx="100" cy="96" r="14" fill="#1F4736" />
        <circle cx="100" cy="96" r="14" />
        <circle cx="100" cy="96" r="5.5" fill={`url(#${g})`} stroke="none" />
        <path d={DROP_D} strokeLinecap="butt" />
      </g>
      <defs>
        <linearGradient id={g} x1="100" y1="26" x2="100" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBE9A8" />
          <stop offset="0.55" stopColor="#E8B65C" />
          <stop offset="1" stopColor="#A9740F" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function Construction() {
  return (
    <main className="construction">
      <div className="construction-honeycomb" aria-hidden="true" />
      <div className="construction-inner">
        <Seal size={84} />
        <p className="construction-brand">Lédjé</p>
        <div className="construction-rule" aria-hidden="true" />
        <h1 className="construction-title">Le site est en construction.</h1>
        <p className="construction-text">
          On prépare quelque chose de beau et de simple.<br />
          Reviens bientôt — ou écris-nous en attendant.
        </p>
        <a className="construction-cta" href="mailto:basekou@ledje.fr">
          Nous écrire
        </a>
        <p className="construction-mail">
          <a href="mailto:basekou@ledje.fr">basekou@ledje.fr</a>
        </p>
        <p className="construction-tagline">Parmi les bienfaits de ce bas monde</p>
      </div>
    </main>
  )
}
