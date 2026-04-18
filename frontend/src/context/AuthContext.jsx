import React, { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, loginAnonymously } from '../services/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Safety timeout — if Firebase never calls back (e.g. placeholder keys),
    // unblock the UI after 3s so the router can redirect to /auth.
    const timeout = setTimeout(() => setLoading(false), 3000)

    // Normal firebase listener
    const unsub = onAuthChange(async (firebaseUser) => {
      clearTimeout(timeout)

      // Don't overwrite if we are in demo mode
      if (window.__DEMO_USER__) return;

      if (firebaseUser) {
        setUser(firebaseUser)
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    // Custom listener for demo bypass
    const handleDemo = (e) => {
      clearTimeout(timeout)
      window.__DEMO_USER__ = true;
      setUser(e.detail);
      setLoading(false);
    };
    window.addEventListener('demo-login', handleDemo);

    return () => {
      clearTimeout(timeout)
      unsub();
      window.removeEventListener('demo-login', handleDemo);
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
