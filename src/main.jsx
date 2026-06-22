import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import './tailwind-output.css'
// optional: keep legacy styles import if needed
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
