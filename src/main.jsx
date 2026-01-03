import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PrivacyPolicy from './legal/PrivacyPolicy'
import TermsOfService from './legal/TermsOfService'
import AcceptableUsePolicy from './legal/AcceptableUsePolicy'
import CookiePolicy from './legal/CookiePolicy'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/acceptable-use" element={<AcceptableUsePolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)