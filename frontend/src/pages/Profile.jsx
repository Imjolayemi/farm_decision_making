import React, { useState } from 'react'
import { User, CheckCircle, ChevronRight, LogOut, Bell, Shield, CreditCard, BarChart3, Award } from 'lucide-react'
import { useSubscription } from '../context/SubscriptionContext'
import { useAuth }         from '../context/AuthContext'
import { logout }          from '../services/firebase'
import PaystackButton      from '../components/PaystackButton'

const farmStats = [
  { label: 'Scans Done',      value: '7',  icon: '🔬' },
  { label: 'Crops Advised',   value: '12', icon: '🌱' },
  { label: 'Alerts Received', value: '23', icon: '🔔' },
  { label: 'Market Saves',    value: '5',  icon: '📈' },
]

const scoreBreakdown = [
  { label: 'Farm Activity Score', score: 85, color: 'var(--clr-primary-light)' },
  { label: 'Scan Usage',          score: 72, color: 'var(--clr-accent)'        },
  { label: 'Market Engagement',   score: 68, color: 'var(--clr-secondary)'     },
  { label: 'Loan History',        score: 90, color: 'var(--clr-primary-light)' },
]

export default function Profile() {
  const { plan, upgradePlan, PLANS, scansLeft } = useSubscription()
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState('overview')

  const planKeys = Object.keys(PLANS)
  const creditScore = 720
  const circumference = 2 * Math.PI * 54

  const handleLogout = async () => {
    try { await logout() } catch { /* ignore */ }
  }

  return (
    <div className="animate-fade-in">
      {/* Profile card */}
      <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1.2rem', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 0.75rem',
          background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', boxShadow: 'var(--shadow-glow)', border: '3px solid rgba(34,160,94,0.3)' }}>
          👨🏿‍🌾
        </div>
        <h3 style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: 'var(--clr-text)' }}>
          {user?.displayName || 'Olusegun Farmer'}
        </h3>
        <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>
          Ogun State, Nigeria · Member since 2025
        </p>
        <span className={`badge ${plan === 'free' ? 'badge-info' : plan === 'pro' ? 'badge-success' : 'badge-warning'}`}>
          {plan === 'free' ? '🌱 Free Farmer' : plan === 'pro' ? '⭐ FarmWise Pro' : '👑 AgriPro Elite'}
        </span>
        {plan !== 'free' && (
          <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginTop: '0.4rem' }}>
            {scansLeft === 999 ? 'Unlimited scans' : `${scansLeft} scans remaining`}
          </p>
        )}
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.1rem', background: 'var(--clr-bg-card)',
        padding: 4, borderRadius: 'var(--radius-md)', border: '1px solid var(--clr-border)' }}>
        {[{ key: 'overview', label: 'Overview' }, { key: 'subscription', label: 'Plans' }, { key: 'credit', label: 'Credit' }].map(t => (
          <button key={t.key} id={`profile-tab-${t.key}`} onClick={() => setActiveSection(t.key)}
            style={{ flex: 1, padding: '0.55rem', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: activeSection === t.key ? 'var(--grad-primary)' : 'transparent',
              color: activeSection === t.key ? '#fff' : 'var(--clr-text-muted)',
              fontSize: '0.8rem', fontWeight: 700, transition: 'var(--transition)' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeSection === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.1rem' }}>
            {farmStats.map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                <div>
                  <p style={{ fontFamily: 'Outfit', fontSize: '1.2rem', fontWeight: 800, color: 'var(--clr-text)' }}>{s.value}</p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '1rem' }}>
            {[
              { icon: Bell,      label: 'Notifications',      id: 'settings-notif'    },
              { icon: Shield,    label: 'Privacy & Security', id: 'settings-privacy'  },
              { icon: BarChart3, label: 'Farm Analytics',     id: 'settings-analytics'},
              { icon: Award,     label: 'Achievements',       id: 'settings-awards'   },
            ].map(({ icon: Icon, label, id }, i, arr) => (
              <div key={id} id={id} style={{ display: 'flex', alignItems: 'center', padding: '0.9rem 1rem', cursor: 'pointer',
                borderBottom: i < arr.length - 1 ? '1px solid var(--clr-border)' : 'none', transition: 'var(--transition)' }}>
                <Icon size={16} color="var(--clr-primary-light)" style={{ marginRight: '0.75rem' }} />
                <p style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600, color: 'var(--clr-text)' }}>{label}</p>
                <ChevronRight size={14} color="var(--clr-text-dim)" />
              </div>
            ))}
          </div>

          <button id="logout-btn" className="btn-secondary"
            style={{ color: 'var(--clr-danger)', borderColor: 'rgba(239,68,68,0.3)' }}
            onClick={handleLogout}>
            <LogOut size={16} /> Sign Out
          </button>
        </>
      )}

      {/* ── Subscription Plans ── */}
      {activeSection === 'subscription' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {planKeys.map(key => {
            const p = PLANS[key]
            const active = plan === key
            const colors = { free: 'var(--clr-text-muted)', pro: 'var(--clr-primary-light)', enterprise: 'var(--clr-secondary)' }
            const col = colors[key]
            const features = {
              free:       ['3 disease scans/month', 'Basic crop recommendations', 'Market prices (24h delay)', 'Community access'],
              pro:        ['Unlimited disease scans', 'Advanced AI crop advice', 'Live market prices', '30-day price forecasts', 'Priority support'],
              enterprise: ['Everything in Pro', 'Credit scoring & loan readiness', 'USSD farm reports (*123#)', 'Equipment marketplace', 'Dedicated agronomist support'],
            }
            const prices = { free: '₦0', pro: '₦2,500', enterprise: '₦8,000' }
            const badges = { pro: 'Most Popular', enterprise: 'Full Access' }

            return (
              <div key={key} className="glass-card" style={{ padding: '1.1rem',
                border: `1.5px solid ${active ? col : 'var(--clr-border)'}`,
                background: active ? `rgba(${key === 'pro' ? '26,122,74' : key === 'enterprise' ? '245,166,35' : '255,255,255'},0.06)` : 'var(--clr-bg-card)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '0.95rem', color: col }}>{p.label}</p>
                    <p style={{ fontFamily: 'Outfit', fontSize: '1.5rem', fontWeight: 800, color: 'var(--clr-text)' }}>
                      {prices[key]}<span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--clr-text-muted)' }}>/mo</span>
                    </p>
                  </div>
                  {badges[key] && !active && <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{badges[key]}</span>}
                  {active && <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>✓ Active</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {(features[key] || []).map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={13} color="var(--clr-primary-light)" />
                      <p style={{ fontSize: '0.78rem', color: 'var(--clr-text)' }}>{f}</p>
                    </div>
                  ))}
                </div>

                {!active && key !== 'free' && <PaystackButton plan={key} label={`Upgrade to ${p.label}`} />}
                {!active && key === 'free' && (
                  <button id="downgrade-btn" onClick={() => upgradePlan('free')}
                    style={{ width: '100%', padding: '0.7rem', borderRadius: 'var(--radius-md)',
                      border: `1.5px solid ${col}`, background: 'transparent', color: col,
                      fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', transition: 'var(--transition)' }}>
                    Downgrade to Free
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── Credit Score ── */}
      {activeSection === 'credit' && (
        <div>
          <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>Farm Health Credit Score</p>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--clr-bg-surface)" strokeWidth="10" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--clr-primary-light)" strokeWidth="10"
                  strokeDasharray={`${circumference * 0.72} ${circumference * 0.28}`}
                  strokeDashoffset={circumference * 0.25} strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--clr-text)', lineHeight: 1 }}>{creditScore}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--clr-primary-light)', fontWeight: 600 }}>GOOD</p>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
              Eligible for agri-loans up to <strong style={{ color: 'var(--clr-primary-light)' }}>₦500,000</strong> based on your farm activity.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {scoreBreakdown.map(({ label, score, color }) => (
              <div key={label} className="glass-card" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text)', fontWeight: 600 }}>{label}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 700, color }}>{score}/100</p>
                </div>
                <div style={{ height: 6, background: 'var(--clr-bg-surface)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${score}%`, background: color, borderRadius: 3, transition: 'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>

          {plan === 'enterprise' ? (
            <button id="apply-loan-btn" className="btn-primary">
              <CreditCard size={16} /> Apply for Agri-Loan
            </button>
          ) : (
            <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', marginBottom: '0.75rem' }}>
                Upgrade to <strong style={{ color: 'var(--clr-secondary)' }}>AgriPro Elite</strong> to access loan applications.
              </p>
              <PaystackButton plan="enterprise" label="Upgrade to AgriPro Elite" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
