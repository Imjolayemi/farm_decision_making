import React, { createContext, useContext, useState, useEffect } from 'react'

const SubscriptionContext = createContext(null)

const PLANS = {
  free:       { label: 'Free Farmer',   scansPerMonth: 3,  price: 0       },
  pro:        { label: 'FarmWise Pro',  scansPerMonth: 999, price: 2500   },
  enterprise: { label: 'AgriPro Elite', scansPerMonth: 999, price: 8000   },
}

export function SubscriptionProvider({ children }) {
  const [plan,      setPlan]      = useState('free')
  const [scansUsed, setScansUsed] = useState(0)

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fw_plan')
    const savedScans = parseInt(localStorage.getItem('fw_scans') || '0', 10)
    if (saved && PLANS[saved]) setPlan(saved)
    setScansUsed(savedScans)
  }, [])

  const upgradePlan = (newPlan) => {
    setPlan(newPlan)
    localStorage.setItem('fw_plan', newPlan)
  }

  const useScan = () => {
    const next = scansUsed + 1
    setScansUsed(next)
    localStorage.setItem('fw_scans', String(next))
  }

  const isPremium    = plan !== 'free'
  const scansLeft    = Math.max(0, PLANS[plan].scansPerMonth - scansUsed)
  const canScan      = isPremium || scansLeft > 0
  const currentPlan  = PLANS[plan]

  return (
    <SubscriptionContext.Provider value={{ plan, upgradePlan, useScan, isPremium, scansLeft, canScan, currentPlan, PLANS }}>
      {children}
    </SubscriptionContext.Provider>
  )
}

export const useSubscription = () => useContext(SubscriptionContext)
