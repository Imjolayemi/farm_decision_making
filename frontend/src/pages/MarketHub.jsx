import React, { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Bell, RefreshCw, Loader } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fetchMarketPrices } from '../services/api'

const markets = ['Lagos', 'Kano', 'Onitsha', 'Ibadan', 'Port Harcourt']

const STATIC_HISTORY = {
  Maize:     [5200,5400,5100,5600,5800,5500,5900,6100,5950,6200,6400,6300,6500,6800],
  Cassava:   [2800,2900,2750,3000,3100,2950,3200,3050,3300,3400,3250,3500,3600,3700],
  Yam:       [12000,12500,11800,13000,13500,12800,14000,13200,14500,15000,14200,15500,16000,15800],
  Rice:      [42000,43000,41500,44000,45000,43500,46000,44500,47000,48000,46500,49000,50000,49500],
  Tomatoes:  [3500,4000,3200,4500,5000,3800,4200,3600,4800,5200,4100,4600,5500,4900],
  Cowpea:    [7000,7500,7200,7800,8000,8200,8500,8300,8600,8800,8700,8900,9000,8500],
  Groundnut: [10000,10500,10200,11000,11500,11200,12000,11800,12200,12500,12300,12700,13000,12800],
  Sorghum:   [5000,5200,5100,5300,5500,5400,5600,5800,5700,5900,6000,5850,6100,6200],
}

const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(); d.setDate(d.getDate() - (13 - i))
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })
})

const fmt = v => `₦${Number(v).toLocaleString()}`

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--clr-bg-card2)', border: '1px solid var(--clr-border)', borderRadius: 10, padding: '0.6rem 0.8rem' }}>
      <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginBottom: 4 }}>{label}</p>
      <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-primary-light)' }}>{fmt(payload[0].value)}</p>
    </div>
  )
}

export default function MarketHub() {
  const [selectedMarket, setSelectedMarket] = useState('Lagos')
  const [selectedCrop,   setSelectedCrop]   = useState('Maize')
  const [livePrices,     setLivePrices]     = useState(null)
  const [refreshing,     setRefreshing]     = useState(false)
  const [alertSet,       setAlertSet]       = useState(false)
  const [lastUpdated,    setLastUpdated]    = useState(null)

  const loadPrices = async (market) => {
    setRefreshing(true)
    try {
      const data = await fetchMarketPrices(market)
      setLivePrices(data.prices)
      setLastUpdated(data.last_updated)
    } catch {
      setLivePrices(null) // fall back to static data
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => { loadPrices(selectedMarket) }, [selectedMarket])

  // Build current price map from live data or static fallback
  const priceMap = {}
  if (livePrices) {
    livePrices.forEach(p => { priceMap[p.crop] = p })
  }

  const history   = STATIC_HISTORY[selectedCrop] || []
  const liveEntry = priceMap[selectedCrop]
  const latest    = liveEntry ? liveEntry.price_per_100kg : history[history.length - 1]
  const prev      = history[history.length - 2]
  const change    = latest - prev
  const pct       = ((change / prev) * 100).toFixed(1)
  const trending  = change > 0 ? 'up' : change < 0 ? 'down' : 'flat'
  const trendColor = trending === 'up' ? 'var(--clr-primary-light)' : trending === 'down' ? 'var(--clr-danger)' : 'var(--clr-text-muted)'
  const TIcon = trending === 'up' ? TrendingUp : trending === 'down' ? TrendingDown : Minus

  // Build chart — replace last point with live price if available
  const chartData = days.map((d, i) => ({
    day: d,
    price: i === 13 && liveEntry ? liveEntry.price_per_100kg : history[i],
  }))

  const allCrops = Object.keys(STATIC_HISTORY)

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <div className="icon-box icon-box-amber"><TrendingUp size={20} /></div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-text)' }}>Market Hub</h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
          Live commodity prices across major Nigerian markets.
          {lastUpdated && <span style={{ color: 'var(--clr-text-dim)' }}> · Updated {lastUpdated}</span>}
        </p>
      </div>

      {/* Market & crop selectors */}
      {[
        { items: markets, selected: selectedMarket, set: setSelectedMarket, activeColor: 'var(--clr-secondary)', activeBg: 'rgba(245,166,35,0.15)', id: 'market' },
        { items: allCrops, selected: selectedCrop, set: setSelectedCrop, activeColor: 'var(--clr-primary-light)', activeBg: 'rgba(26,122,74,0.18)', id: 'crop' },
      ].map(({ items, selected, set, activeColor, activeBg, id }) => (
        <div key={id} style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem', marginBottom: '0.85rem' }}>
          {items.map(item => (
            <button key={item} id={`${id}-${item.toLowerCase().replace(/\s/g, '-')}`}
              onClick={() => set(item)}
              style={{
                padding: '0.4rem 0.85rem', borderRadius: 999,
                border: `1.5px solid ${selected === item ? activeColor : 'var(--clr-border)'}`,
                background: selected === item ? activeBg : 'var(--clr-bg-card)',
                color: selected === item ? activeColor : 'var(--clr-text-muted)',
                fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'var(--transition)',
              }}>
              {item}
            </button>
          ))}
        </div>
      ))}

      {/* Price card */}
      <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: 4 }}>{selectedCrop} — {selectedMarket}</p>
            <p style={{ fontFamily: 'Outfit', fontSize: '2rem', fontWeight: 800, color: 'var(--clr-text)' }}>{fmt(latest)}</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)' }}>per 100 kg bag</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: trendColor }}>
              <TIcon size={16} /><span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{pct}%</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--clr-text-muted)' }}>vs yesterday</span>
            {refreshing && <Loader size={14} color="var(--clr-text-muted)" style={{ animation: 'spin 0.8s linear infinite' }} />}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#22a05e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22a05e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: '#4d7a5e', fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#4d7a5e', fontSize: 9 }} tickLine={false} axisLine={false} tickFormatter={v => `₦${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke="#22a05e" strokeWidth={2} fill="url(#priceGrad)" dot={false} activeDot={{ r: 4, fill: '#22a05e' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Price alert */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Bell size={18} color={alertSet ? 'var(--clr-secondary)' : 'var(--clr-text-dim)'} />
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--clr-text)' }}>Price Alert</p>
          <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)' }}>
            {alertSet ? `Alert set for ${selectedCrop} in ${selectedMarket}` : 'Get notified when prices shift significantly'}
          </p>
        </div>
        <button id="set-alert-btn" onClick={() => setAlertSet(a => !a)}
          style={{
            padding: '0.5rem 0.9rem', borderRadius: 999, border: 'none', cursor: 'pointer',
            background: alertSet ? 'rgba(245,166,35,0.2)' : 'var(--grad-primary)',
            color: alertSet ? 'var(--clr-secondary)' : '#fff', fontSize: '0.75rem', fontWeight: 700, transition: 'var(--transition)',
          }}>
          {alertSet ? 'Remove' : 'Set Alert'}
        </button>
      </div>

      {/* All crops table */}
      <div>
        <div className="section-header">
          <h3 className="section-title">All Crops — {selectedMarket}</h3>
          <button id="refresh-prices" className="btn-icon" style={{ width: 32, height: 32 }}
            onClick={() => loadPrices(selectedMarket)}>
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {allCrops.map((c, i) => {
            const liveRow = priceMap[c]
            const hist    = STATIC_HISTORY[c] || []
            const lp      = liveRow ? liveRow.price_per_100kg : hist[hist.length - 1]
            const pp      = hist[hist.length - 2]
            const ch      = lp - pp
            const p2      = ((ch / pp) * 100).toFixed(1)
            const up      = ch >= 0
            return (
              <div key={c} onClick={() => setSelectedCrop(c)}
                style={{
                  display: 'flex', alignItems: 'center', padding: '0.85rem 1rem', cursor: 'pointer',
                  borderBottom: i < allCrops.length - 1 ? '1px solid var(--clr-border)' : 'none',
                  background: selectedCrop === c ? 'rgba(26,122,74,0.08)' : 'transparent', transition: 'var(--transition)',
                }}>
                <p style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem', color: 'var(--clr-text)' }}>{c}</p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clr-text)', marginRight: '0.75rem' }}>{fmt(lp)}</p>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: up ? 'var(--clr-primary-light)' : 'var(--clr-danger)', display: 'flex', alignItems: 'center', gap: 2 }}>
                  {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {p2}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
