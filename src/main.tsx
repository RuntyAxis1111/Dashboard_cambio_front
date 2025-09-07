import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Enhanced debug logging
console.log('🚀 HYBE App starting...')
console.log('Environment:', import.meta.env.MODE)
console.log('Base URL:', import.meta.env.BASE_URL)
console.log('Vite env vars:', import.meta.env)
console.log('Window location:', window.location.href)
console.log('User agent:', navigator.userAgent)

// Enhanced error handling
window.addEventListener('error', (e) => {
  console.error('❌ Global JavaScript error:', e.error)
  console.error('Error details:', {
    message: e.message,
    filename: e.filename,
    lineno: e.lineno,
    colno: e.colno,
    stack: e.error?.stack
  })
})

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled promise rejection:', e.reason)
  console.error('Promise rejection details:', e)
})

// Check if root element exists
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;">ERROR: Root element not found. Check HTML structure.</div>'
} else {
  console.log('✅ Root element found, mounting React app...')
  
  try {
    const root = ReactDOM.createRoot(rootElement)
    console.log('✅ React root created successfully')
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    )
    console.log('✅ React app rendered successfully')
  } catch (error) {
    console.error('❌ Error mounting React app:', error)
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial; color: red;">
        <h2>React Mount Error</h2>
        <p>Error: ${error.message}</p>
        <pre>${error.stack}</pre>
      </div>
    `
  }
}