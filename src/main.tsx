import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import App from './App'
import './index.css'

gsap.registerPlugin(ScrollTrigger)
// Recalcula posições quando as fontes terminam de carregar
document.fonts?.ready.then(() => ScrollTrigger.refresh())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
