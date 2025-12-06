import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
import App from './App'
import './index.css'

// Global error handling for production
window.addEventListener('error', (e) => {
  if (import.meta.env.DEV) {
    console.error('Global error:', e.error)
  }
})

window.addEventListener('unhandledrejection', (e) => {
  if (import.meta.env.DEV) {
    console.error('Unhandled promise rejection:', e.reason)
  }
})

// Mount React app
const rootElement = document.getElementById('root')
if (!rootElement) {
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">ERROR: Root element not found.</div>'
} else {
  try {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
          <SpeedInsights />
        </BrowserRouter>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Error mounting app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial; color: red;">
        <h2>Application Error</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `
  }
}