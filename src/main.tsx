import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.tsx'
import Avis from './Avis.tsx'
// Pour réafficher la page « en construction » : remplacer <App /> par <Construction />
// (et importer Construction depuis './Construction.tsx').
// import Construction from './Construction.tsx'

// Routage minimal par pathname (SPA — Vercel réécrit déjà tout vers index.html).
// /avis → page de recueil d'avis ; sinon → landing.
const isAvis = window.location.pathname.replace(/\/+$/, '') === '/avis'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAvis ? <Avis /> : <App />}
    <Analytics />
  </StrictMode>,
)
