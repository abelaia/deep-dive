import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/main.scss'
import { applyTheme } from './constants/palette'
import App from './App.tsx'

history.scrollRestoration = 'manual'
window.scrollTo(0, 0)
applyTheme('surface')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
