import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Mark browser-mode (vs Electron transparent window) so we show a solid bg
const inElectron = Boolean((window as any).context?.isElectron);
if (!inElectron) {
  document.documentElement.classList.add('browser-mode');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
