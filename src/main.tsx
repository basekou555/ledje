import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import Construction from './Construction.tsx'
import Avis from './Avis.tsx'
import Offrir from './Offrir.tsx'
import Prestations from './Prestations.tsx'
import Commander from './Commander.tsx'
import CommandeConfirmee from './CommandeConfirmee.tsx'
import App from './App.tsx'

/* Routage minimal par pathname (SPA — Vercel réécrit déjà tout vers index.html).

   2026-09-24 — LA VITRINE PASSE EN PAGE D'ACCUEIL. Elle vivait sur /apercu
   depuis le 08/09, le temps d'être validée ; cette route est supprimée. Un
   ancien lien vers /apercu ne casse pas pour autant : tout chemin inconnu
   retombe sur la vitrine.

   — /avis         : recueil d'avis, ouverte pendant les dégustations ;
   — /commander    : le pack de 6, livré le lendemain à Lyon. Créée le
                     2026-10-16 : c'est la première réponse à « où est-ce
                     que j'en trouve », identifiée le 14/10 comme la fuite
                     la plus coûteuse du dossier ;
   — /commande-confirmee : la page d'APRÈS paiement. ⚠️ On n'y arrive QUE par
                     la redirection de Stripe, qui ne se déclenche qu'après un
                     paiement réussi — c'est ce qui en fait une preuve.
                     ⛔ Ne JAMAIS la mettre dans un menu ni dans un bouton :
                     ce serait annoncer un paiement qui n'a pas eu lieu.
   — /prestations  : les formules événement (kermesse, fête d'école…).
                     Créée le 2026-10-08 pour une visite précise : un
                     établissement scolaire qui organise une kermesse ;
   — /offrir       : le canal mosquée (un fidèle offre un lot). Page à part
                     depuis le 2026-10-06 : son audience n'est pas celle de
                     l'accueil, on lui envoie le lien directement ;
   — /construction : l'ancienne page « en construction », gardée joignable.
                     C'est le filet de sécurité : si la vitrine devait être
                     retirée en urgence, il suffit d'en refaire le retour par
                     défaut ci-dessous (deux lignes), sans rien réécrire.
                     ⚠️ Délibérément PAS derrière une variable d'environnement :
                     les variables Vercel qui écrasent un repli sont un piège
                     connu du projet (cf. docs/04_operations/site-technique.md).
   — le reste      : la vitrine. */
/* Le chemin, nettoyé de deux façons :
   — la barre finale, pour que `/offrir/` vaille `/offrir` ;
   — le suffixe `.html`, ajouté le 2026-10-27 avec les pages par route.
     En production, Vercel réécrit `/commander` vers `/commander.html` SANS
     changer l'URL, donc ce cas ne se produit pas. Mais une arrivée directe
     sur `/commander.html` — un lien copié à la main, un aperçu local servi
     sans les réécritures — retomberait sinon sur la vitrine, en silence. */
const path = window.location.pathname.replace(/\/+$/, '').replace(/\.html$/, '')

function Page() {
  if (path === '/avis') return <Avis />
  if (path === '/offrir') return <Offrir />
  if (path === '/prestations') return <Prestations />
  if (path === '/commander') return <Commander />
  if (path === '/commande-confirmee') return <CommandeConfirmee />
  if (path === '/construction') return <Construction />
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
    <Analytics />
  </StrictMode>,
)
