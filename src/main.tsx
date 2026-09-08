import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Construction from './Construction.tsx'
import Avis from './Avis.tsx'
import App from './App.tsx'

/* Routage minimal par pathname (SPA — Vercel réécrit déjà tout vers index.html).
   — /avis    : recueil d'avis, ouverte pendant les dégustations ;
   — /apercu  : aperçu de la vitrine refondue, le temps de la valider.
                À supprimer quand la vitrine passera en page d'accueil ;
   — le reste : page « en construction ». */
const path = window.location.pathname.replace(/\/+$/, '')

function Page() {
  if (path === '/avis') return <Avis />
  if (path === '/apercu') return <App />
  return <Construction />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
    <Analytics />
  </StrictMode>,
)
