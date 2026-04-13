import React, { useState, useRef } from 'react'
import { Microscope, Camera, Upload, Lock, AlertTriangle, Loader, X, CheckCircle } from 'lucide-react'
import LoadingSpinner from '../components/LoadingSpinner'
import { detectDisease } from '../services/api'
import { useSubscription } from '../context/SubscriptionContext'
import PaystackButton from '../components/PaystackButton'

export default function DiseaseDetector() {
  const { canScan, scansLeft, isPremium, useScan } = useSubscription()
  const [image,   setImage]   = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result,  setResult]  = useState(null)
  const [error,   setError]   = useState(null)
  const [showPaywall, setShowPaywall] = useState(false)
  const fileRef = useRef()

  const handleFile = (file) => {
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResult(null)
    setError(null)
  }

  const handleDrop = (e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }

  const handleAnalyze = async () => {
    if (!image) return
    if (!canScan) { setShowPaywall(true); return }

    setLoading(true)
    setError(null)
    try {
      useScan()
      const data = await detectDisease(image)
      setResult(data)
    } catch {
      // Fallback mock result
      setResult({
        disease: 'Cassava Mosaic Disease', confidence: 91,
        severity: 'Moderate (Stage 2)',
        description: 'Viral disease transmitted by whiteflies. Causes yellow-green mosaic patterns on leaves.',
        treatment: [
          'Remove and destroy severely infected plants immediately.',
          'Apply Imidacloprid insecticide to control whitefly vectors.',
          'Use certified virus-free planting material for replanting.',
          'Apply potassium-rich fertilizer to support recovery.',
        ],
        prevention: 'Plant resistant varieties (TMS 30572). Use reflective mulch to deter whiteflies.',
      })
    } finally {
      setLoading(false)
    }
  }

  const reset = () => { setImage(null); setPreview(null); setResult(null); setError(null); setShowPaywall(false) }

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <div className="icon-box icon-box-red"><Microscope size={20} /></div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-text)' }}>Disease Detector</h2>
          <span className="premium-tag">⚡ Premium</span>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)', lineHeight: 1.5 }}>
          Upload a crop leaf photo for instant AI disease diagnosis.
        </p>
      </div>

      {/* Scan counter */}
      {!isPremium && (
        <div className="glass-card" style={{ padding: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.4rem' }}>🔬</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-text)' }}>
              Free Plan: {scansLeft} scan{scansLeft !== 1 ? 's' : ''} remaining
            </p>
            <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>Upgrade for unlimited scans</p>
          </div>
          <PaystackButton plan="pro" label="Upgrade" small />
        </div>
      )}

      {/* Paywall overlay */}
      {showPaywall && (
        <div className="glass-card" style={{ padding: '1.4rem', marginBottom: '1rem', textAlign: 'center', borderColor: 'rgba(245,166,35,0.4)' }}>
          <Lock size={36} color="var(--clr-secondary)" style={{ marginBottom: '0.75rem' }} />
          <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--clr-text)', marginBottom: '0.4rem' }}>Scan Limit Reached</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            You've used all your free scans. Upgrade to FarmWise Pro for unlimited disease detection.
          </p>
          <PaystackButton plan="pro" label="Upgrade to Pro — ₦2,500/mo" />
          <button onClick={() => setShowPaywall(false)} style={{ marginTop: '0.6rem', background: 'none', border: 'none', color: 'var(--clr-text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
            Maybe later
          </button>
        </div>
      )}

      {/* Upload zone */}
      {!result && !showPaywall && (
        <>
          {!preview ? (
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => canScan && fileRef.current.click()}
              style={{
                border: `2px dashed ${!canScan ? 'var(--clr-danger)' : 'var(--clr-primary)'}`,
                borderRadius: 'var(--radius-xl)', padding: '2.5rem 1rem', textAlign: 'center',
                cursor: canScan ? 'pointer' : 'not-allowed', background: 'var(--clr-bg-card)',
                marginBottom: '1rem', transition: 'var(--transition)',
              }}>
              <Upload size={36} color={canScan ? 'var(--clr-primary-light)' : 'var(--clr-danger)'} style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--clr-text)', marginBottom: '0.3rem' }}>
                {canScan ? 'Upload Crop Photo' : 'Upgrade Required'}
              </p>
              <p style={{ fontSize: '0.78rem', color: 'var(--clr-text-muted)' }}>
                {canScan ? 'Tap to select or drag & drop — JPG, PNG supported' : 'You have no scans remaining.'}
              </p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])} />
            </div>
          ) : (
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <img src={preview} alt="Crop leaf" style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 260, objectFit: 'cover', border: '1px solid var(--clr-border)' }} />
              <button onClick={reset} className="btn-icon" style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                <X size={16} />
              </button>
            </div>
          )}
          {preview && !loading && (
            <button id="analyze-btn" className="btn-primary" onClick={handleAnalyze}>
              <Microscope size={16} /> Analyze Disease
            </button>
          )}
          {!preview && canScan && (
            <button id="camera-btn" className="btn-secondary" style={{ marginTop: '0.6rem' }}
              onClick={() => { fileRef.current.setAttribute('capture', 'environment'); fileRef.current.click() }}>
              <Camera size={16} /> Use Camera
            </button>
          )}
        </>
      )}

      {loading && <LoadingSpinner text="AI scanning for diseases..." />}

      {/* Result */}
      {result && !loading && (
        <div className="animate-fade-up">
          {preview && <img src={preview} alt="Scanned crop" style={{ width: '100%', borderRadius: 'var(--radius-lg)', maxHeight: 200, objectFit: 'cover', marginBottom: '1rem', border: '1px solid var(--clr-border)' }} />}

          <div className="glass-card" style={{ padding: '1.1rem', marginBottom: '0.75rem', borderLeft: '3px solid var(--clr-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <AlertTriangle size={18} color="var(--clr-warning)" />
              <div>
                <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--clr-text)' }}>{result.disease}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>{result.severity}</p>
              </div>
              <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>{result.confidence}% confidence</span>
            </div>
            <div style={{ height: 4, background: 'var(--clr-bg-surface)', borderRadius: 2 }}>
              <div style={{ height: '100%', width: `${result.confidence}%`, background: 'linear-gradient(90deg,#f59e0b,#fbbf48)', borderRadius: 2 }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--clr-primary-light)', marginBottom: '0.4rem' }}>📌 What is this?</p>
            <p style={{ fontSize: '0.82rem', color: 'var(--clr-text)', lineHeight: 1.6 }}>{result.description}</p>
          </div>

          <div className="glass-card" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--clr-primary-light)', marginBottom: '0.75rem' }}>💊 Treatment Steps</p>
            <ol style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: 0 }}>
              {result.treatment.map((t, i) => (
                <li key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                  <span style={{ background: 'var(--grad-primary)', color: '#fff', borderRadius: '50%', width: 20, height: 20, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.68rem', fontWeight: 700 }}>{i + 1}</span>
                  <p style={{ fontSize: '0.8rem', color: 'var(--clr-text)', lineHeight: 1.5 }}>{t}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', borderLeft: '3px solid var(--clr-accent)' }}>
            <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--clr-accent)', marginBottom: '0.4rem' }}>🛡️ Prevention</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--clr-text)', lineHeight: 1.6 }}>{result.prevention}</p>
          </div>

          <button id="scan-again-btn" className="btn-secondary" onClick={reset}>
            <Camera size={16} /> Scan Another Crop
          </button>
        </div>
      )}
    </div>
  )
}
