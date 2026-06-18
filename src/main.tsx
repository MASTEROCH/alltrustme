import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './theme.css'
import App from './App.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'
import { RatesProvider } from './contexts/RatesContext.tsx'
import { ToastProvider } from './contexts/ToastContext.tsx'
import { initTelegram } from './utils/telegram.ts'

initTelegram()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <LanguageProvider>
        <RatesProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </RatesProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
