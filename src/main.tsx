import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Construction from './Construction.tsx'
import Avis from './Avis.tsx'
import App from './App.tsx'

/* Routage minimal par pathname (SPA — Vercel réécrit déjà tout vers index.html).

   2026-09-24 — LA VITRINE PASSE EN PAGE D'ACCUEIL. Elle vivait sur /apercu
   depuis le 08/09, le temps d'être validée ; cette route est supprimée. Un
   ancien lien vers /apercu ne casse pas pour autant : tout chemin inconnu
   retombe sur la vitrine.

   — /avis         : recueil d'avis, ouverte pendant les dégustations ;
   — /construction : l'ancienne page « en construction », gardée joignable.
                     C'est le filet de sécurité : si la vitrine devait être
                     retirée en urgence, il suffit d'en refaire le retour par
                     défaut ci-dessous (deux lignes), sans rien réécrire.
                     ⚠️ Délibérément PAS derrière une variable d'environnement :
                     les variables Vercel qui écrasent un repli sont un piège
                     connu du projet (cf. docs/04_operations/site-technique.md).
   — le reste      : la vitrine. */
const path = window.location.pathname.replace(/\/+$/, '')

function Page() {
  if (path === '/avis') return <Avis />
  if (path === '/construction') return <Construction />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
    <Analytics />
  </StrictMode>,
)
