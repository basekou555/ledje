import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Construction from './Construction.tsx'
// La landing complète reste dans le repo, prête à être réactivée :
// remplacer <Construction /> par <App /> (et importer App depuis './App.tsx').
// import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Construction />
  </StrictMode>,
)
