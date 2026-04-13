import React from 'react'
import { useSubscription } from '../context/SubscriptionContext'

/**
 * PaystackButton — triggers Paystack inline checkout.
 * Requires VITE_PAYSTACK_PUBLIC_KEY in your .env file.
 *
 * @param {string}  plan   - 'pro' | 'enterprise'
 * @param {string}  label  - Button label text
 * @param {boolean} small  - Render as a compact button
 */
export default function PaystackButton({ plan = 'pro', label = 'Upgrade', small = false }) {
  const { upgradePlan, PLANS } = useSubscription()
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_YOUR_KEY_HERE'

  const prices = { pro: 250000, enterprise: 800000 } // Kobo (₦2500 / ₦8000)

  const handlePay = () => {
    // If Paystack script is loaded use it; else just upgrade locally (dev mode)
    if (typeof window.PaystackPop !== 'undefined') {
      const handler = window.PaystackPop.setup({
        key:       publicKey,
        email:     'farmer@farmwise.ai',        // Replace with auth user email
        amount:    prices[plan] || 250000,
        currency:  'NGN',
        ref:       `fw-${plan}-${Date.now()}`,
        metadata:  { plan },
        callback: (response) => {
          if (response.status === 'success') {
            upgradePlan(plan)
            alert(`✅ Payment successful! You are now on ${PLANS[plan]?.label}.`)
          }
        },
        onClose: () => {},
      })
      handler.openIframe()
    } else {
      // Dev fallback — upgrade immediately without payment
      upgradePlan(plan)
      alert(`🎉 [Dev mode] Upgraded to ${PLANS[plan]?.label}!`)
    }
  }

  if (small) {
    return (
      <button id={`paystack-small-${plan}`} onClick={handlePay}
        style={{ padding: '0.5rem 0.9rem', borderRadius: 999, border: 'none', cursor: 'pointer',
          background: 'var(--grad-primary)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition)', whiteSpace: 'nowrap' }}>
        {label}
      </button>
    )
  }

  return (
    <button id={`paystack-${plan}`} onClick={handlePay} className="btn-primary">
      💳 {label}
    </button>
  )
}
