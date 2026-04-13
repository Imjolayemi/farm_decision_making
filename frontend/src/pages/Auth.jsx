import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginWithEmail, registerWithEmail } from '../services/firebase';
import { Loader, Lock, Mail, User } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';

export default function Auth() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', name: '' });
  const [showDemoBtn, setShowDemoBtn] = useState(false);

  // If already logged in naturally, go to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleDemoLogin = () => {
    // Force a mock user into window for demo bypass (requires AuthContext modification)
    window.dispatchEvent(new CustomEvent('demo-login', { detail: { uid: 'demo123', email: 'demo@farmwise.ai', displayName: 'Demo Farmer' } }));
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await loginWithEmail(form.email, form.password);
      } else {
        if (!form.name) throw new Error('Name is required for registration.');
        await registerWithEmail(form.email, form.password, form.name);
      }
      navigate('/');
    } catch (err) {
      const errMsg = err.message || '';
      if (errMsg.includes('api-key-not-valid')) {
        setError('Firebase API Key missing in frontend/.env file. Please paste your real Firebase keys into the .env file.');
        setShowDemoBtn(true);
      } else {
        setError(errMsg.replace('Firebase:', '').trim() || 'Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: '2rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', margin: '0 auto 1rem', boxShadow: 'var(--shadow-glow)' }}>
          🌱
        </div>
        <h2 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--clr-text)' }}>
          Welcome to FarmWise
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)' }}>AI-Powered Farm Intelligence</p>
      </div>

      <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--clr-text)' }}>
          {isLogin ? 'Sign In' : 'Create Account'}
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!isLogin && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: '0.7rem' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)' }} />
                <input required type="text" className="form-input" placeholder="e.g. Olusegun Farmer" style={{ paddingLeft: '2.5rem' }}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)' }} />
              <input required type="email" className="form-input" placeholder="mail@example.com" style={{ paddingLeft: '2.5rem' }}
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--clr-text-muted)' }} />
              <input required type="password" minLength={6} className="form-input" placeholder="••••••••" style={{ paddingLeft: '2.5rem' }}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', padding: '0.75rem', borderRadius: 8 }}>
              <p style={{ color: 'var(--clr-danger)', fontSize: '0.75rem', marginBottom: showDemoBtn ? '0.5rem' : 0 }}>
                {error}
              </p>
              {showDemoBtn && (
                <button type="button" onClick={handleDemoLogin} style={{ width: '100%', padding: '0.5rem', background: 'var(--clr-primary-dark)', color: '#fff', border: 'none', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
                  Enter Demo Mode Without Firebase
                </button>
              )}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" onClick={() => setIsLogin(!isLogin)} style={{ background: 'none', border: 'none', color: 'var(--clr-primary-light)', fontWeight: 600, cursor: 'pointer' }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
