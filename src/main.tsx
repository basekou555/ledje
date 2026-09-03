import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Construction from './Construction.tsx'
import Avis from './Avis.tsx'
// La landing complète reste dans le repo, prête à être réactivée :
// remplacer <Construction /> par <App /> (et importer App depuis './App.tsx').
// import App from './App.tsx'

// Routage minimal par pathname (SPA — Vercel réécrit déjà tout vers index.html).
// /avis reste OUVERTE même site en construction : elle sert au recueil d'avis
// pendant les dégustations en cours. Toutes les autres routes → page construction.
const isAvis = window.location.pathname.replace(/\/+$/, '') === '/avis'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAvis ? <Avis /> : <Construction />}
    <Analytics />
  </StrictMode>,
)
