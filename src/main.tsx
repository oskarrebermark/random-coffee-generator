import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

import PillNav from './components/PillNav';
import logo from './assets/react.svg';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PillNav
        logoAlt="Random Coffee"
        logo={logo}
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
        ]}
        activeHref="/"
        ease="power2.easeOut"
        baseColor="#1c1917"
        pillColor="#f59e0b"
        hoveredPillTextColor="#f59e0b"
        pillTextColor="#1c1917"
        initialLoadAnimation={false}
      />

      <App />
    </BrowserRouter>
  </StrictMode>,
)
