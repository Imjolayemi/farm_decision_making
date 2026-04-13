import React from 'react'

export default function LoadingSpinner({ text = 'Analyzing...', size = 40 }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      padding: '2rem',
    }}>
      <div style={{
        width: size,
        height: size,
        border: `3px solid var(--clr-border)`,
        borderTopColor: 'var(--clr-primary-light)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.88rem', fontWeight: 500 }}>{text}</p>
    </div>
  )
}
