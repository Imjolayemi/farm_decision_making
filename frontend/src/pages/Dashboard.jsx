import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Leaf, Microscope, TrendingUp, CloudSun,
  Users, ArrowRight, Droplets, Thermometer,
  AlertCircle, CheckCircle, Sprout
} from 'lucide-react'

const quickActions = [
  { label: 'Crop Advisor', icon: Leaf,       to: '/crop-advisor',     color: 'icon-box-green',  desc: 'AI recommendations' },
  { label: 'Scan Disease', icon: Microscope, to: '/disease-detector', color: 'icon-box-red',    desc: 'Camera detection'   },
  { label: 'Market Hub',   icon: TrendingUp, to: '/market',           color: 'icon-box-amber',  desc: 'Live prices'        },
  { label: 'Weather',      icon: CloudSun,   to: '/weather',          color: 'icon-box-teal',   desc: 'Farm forecast'      },
]

const alerts = [
  { type: 'warning', icon: AlertCircle, msg: 'Rain expected in Ogun State — delay irrigation by 2 days.' },
  { type: 'success', icon: CheckCircle, msg: 'Maize prices up 8% in Lagos market this week.' },
]

const tips = [
  'Apply nitrogen fertilizer after rainfall for best absorption.',
  'Scout fields weekly for fall armyworm egg masses on lower leaf surfaces.',
  'Cassava stems stored in shade retain viability for up to 72 hours.',
]

export default function Dashboard() {
  const [tip, setTip] = useState(tips[0])
  const [greeting, setGreeting] = useState('Good morning')

  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 12 && h < 17) setGreeting('Good afternoon')
    else if (h >= 17) setGreeting('Good evening')
    const i = Math.floor(Math.random() * tips.length)
    setTip(tips[i])
  }, [])

  return (
    <div className="animate-fade-in">

      {/* Hero Greeting */}
      <div style={{
        background: 'var(--grad-hero)',
        borderRadius: 'var(--radius-xl)',
        padding: '1.4rem',
        marginBottom: '1.2rem',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--clr-border)',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: 'var(--grad-glow)',
        }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--clr-primary-light)', fontWeight: 600, marginBottom: 4 }}>
          {greeting}, Farmer 👋
        </p>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', fontWeight: 800, color: 'var(--clr-text)', marginBottom: '0.6rem' }}>
          Your Farm Intelligence Dashboard
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,122,74,0.18)', borderRadius: 8, padding: '0.3rem 0.6rem' }}>
            <Thermometer size={14} color="var(--clr-secondary)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--clr-text)', fontWeight: 600 }}>32°C</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,122,74,0.18)', borderRadius: 8, padding: '0.3rem 0.6rem' }}>
            <Droplets size={14} color="var(--clr-accent)" />
            <span style={{ fontSize: '0.75rem', color: 'var(--clr-text)', fontWeight: 600 }}>68% Humidity</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.2rem' }} className="stagger">
        {[
          { label: 'Crop Score', value: '87/100', sub: '↑ 5 this week', color: 'var(--clr-primary-light)' },
          { label: 'Market Alert', value: '3 New', sub: 'Price updates', color: 'var(--clr-secondary)' },
          { label: 'Disease Risk', value: 'Low', sub: 'All crops clear', color: 'var(--clr-accent)' },
          { label: 'Rain Forecast', value: '2 days', sub: 'Light rainfall', color: 'var(--clr-primary-light)' },
        ].map((s, i) => (
          <div key={i} className="glass-card stat-card animate-fade-up">
            <span className="stat-label">{s.label}</span>
            <span className="stat-value" style={{ fontSize: '1.3rem', color: s.color }}>{s.value}</span>
            <span className="stat-sub">{s.sub}</span>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div className="section-header">
          <h3 className="section-title">Quick Actions</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="stagger">
          {quickActions.map(({ label, icon: Icon, to, color, desc }) => (
            <Link key={to} to={to} id={`quick-${label.toLowerCase().replace(/\s/g,'-')}`}
              style={{ textDecoration: 'none' }}>
              <div className="glass-card animate-fade-up" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className={`icon-box ${color}`}>
                  <Icon size={20} />
                </div>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--clr-text)' }}>{label}</p>
                <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Farm Alerts */}
      <div style={{ marginBottom: '1.2rem' }}>
        <div className="section-header">
          <h3 className="section-title">Farm Alerts</h3>
          <span className="badge badge-warning">2 Active</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {alerts.map((a, i) => (
            <div key={i} className="glass-card"
              style={{ padding: '0.9rem 1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <a.icon size={18} color={a.type === 'warning' ? 'var(--clr-warning)' : 'var(--clr-primary-light)'} style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.83rem', color: 'var(--clr-text)', lineHeight: 1.45 }}>{a.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Farm Tip */}
      <div style={{ marginBottom: '1rem' }}>
        <div className="section-header">
          <h3 className="section-title">Daily Farm Tip</h3>
          <span className="badge badge-info"><Sprout size={10} /> AI</span>
        </div>
        <div className="glass-card" style={{ padding: '1rem', borderLeft: '3px solid var(--clr-primary-light)' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--clr-text)', lineHeight: 1.6, fontStyle: 'italic' }}>
            "{tip}"
          </p>
        </div>
      </div>

      {/* Community Preview */}
      <div>
        <div className="section-header">
          <h3 className="section-title">Community</h3>
          <Link to="/community" className="section-link" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            See all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="glass-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="icon-box icon-box-teal"><Users size={20} /></div>
          <div>
            <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--clr-text)' }}>2,148 farmers online</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>Join discussions, share insights, rent equipment</p>
          </div>
          <ArrowRight size={16} color="var(--clr-text-dim)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      </div>

    </div>
  )
}
