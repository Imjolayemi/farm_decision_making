import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Leaf, Microscope, TrendingUp, CloudSun, Users, User } from 'lucide-react'

const navItems = [
  { to: '/',                icon: Home,         label: 'Home'    },
  { to: '/crop-advisor',    icon: Leaf,         label: 'Crops'   },
  { to: '/disease-detector',icon: Microscope,   label: 'Scan'    },
  { to: '/market',          icon: TrendingUp,   label: 'Market'  },
  { to: '/weather',         icon: CloudSun,     label: 'Weather' },
  { to: '/community',       icon: Users,        label: 'Community'},
  { to: '/profile',         icon: User,         label: 'Me'      },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 480,
      background: 'rgba(11,26,19,0.96)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--clr-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '0.5rem 0.25rem',
      zIndex: 200,
    }}>
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          id={`nav-${label.toLowerCase()}`}
          end={to === '/'}
          style={({ isActive }) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            textDecoration: 'none',
            padding: '0.3rem 0.5rem',
            borderRadius: 12,
            minWidth: 44,
            transition: 'var(--transition)',
            color: isActive ? 'var(--clr-primary-light)' : 'var(--clr-text-dim)',
            background: isActive ? 'rgba(26,122,74,0.12)' : 'transparent',
          })}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{
                  transition: 'var(--transition)',
                  filter: isActive ? 'drop-shadow(0 0 4px rgba(34,160,94,0.5))' : 'none',
                }}
              />
              <span style={{
                fontSize: '0.6rem',
                fontWeight: isActive ? 700 : 500,
                letterSpacing: '0.02em',
              }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
