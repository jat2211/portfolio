import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RedLightProvider } from './context/RedLightProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RedLightProvider>
      <App />
    </RedLightProvider>
  </StrictMode>,
)
