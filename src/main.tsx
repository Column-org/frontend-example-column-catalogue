import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { CatalogueProvider } from 'column-catalogue'
import { COLUMN_CONFIG } from './config/column'
import { AlertProvider } from './components/alert/AlertProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CatalogueProvider
      network={COLUMN_CONFIG.network}
      rpcUrl={COLUMN_CONFIG.rpcUrl}
    >
      <AlertProvider>
        <App />
      </AlertProvider>
    </CatalogueProvider>
  </StrictMode>,
)
