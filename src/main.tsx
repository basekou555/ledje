import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Pour réafficher la page « en construction » : remplacer <App /> par <Construction />
// (et importer Construction depuis './Construction.tsx').
// import Construction from './Construction.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
