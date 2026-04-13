import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Wifi } from 'lucide-react'

const pageTitles = {
  '/': 'FarmWise AI',
  '/crop-advisor': 'Crop Advisor',
  '/disease-detector': 'Disease Detector',
  '/market': 'Market Hub',
  '/weather': 'Weather',
  '/community': 'Community',
  '/profile': 'My Profile',
}

export default function TopBar() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] || 'FarmWise AI'
  const isHome = pathname === '/'

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '0.85rem 1rem',
      background: 'rgba(11,26,19,0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--clr-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {isHome && (
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: 'var(--grad-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: 'var(--shadow-btn)',
          }}>🌱</div>
        )}
        <div>
          <h1 style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: isHome ? '1.15rem' : '1rem',
            fontWeight: 800,
            color: 'var(--clr-text)',
            lineHeight: 1,
          }}>{title}</h1>
          {isHome && (
            <p style={{ fontSize: '0.7rem', color: 'var(--clr-primary-light)', marginTop: 2, fontWeight: 500 }}>
              AI-Powered Farm Intelligence
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-primary-light)', fontSize: '0.68rem', fontWeight: 600 }}>
          <Wifi size={12} />
          <span>Online</span>
        </div>
        <button className="btn-icon" id="notification-btn" aria-label="Notifications" style={{ width: 36, height: 36 }}>
          <Bell size={16} />
        </button>
      </div>
    </header>
  )
}
