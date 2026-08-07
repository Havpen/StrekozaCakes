import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { stripHashFromUrl } from './lib/scroll'
import './styles/tailwind.css'
import './styles/global.css'

stripHashFromUrl()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
