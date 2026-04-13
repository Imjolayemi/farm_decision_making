import React, { useState, useEffect } from 'react'
import { CloudSun, Droplets, Wind, Eye, Thermometer, CloudRain, Sun, Cloud, Umbrella, Loader } from 'lucide-react'
import { fetchWeather } from '../services/api'

const growingZones = [
  'Northern Guinea Savanna', 'Southern Guinea Savanna',
  'Derived Savanna', 'Rain Forest Zone', 'Mangrove/Swamp Zone',
]

const weekForecastStatic = [
  { day: 'Today', icon: CloudRain, temp: 32, rain: 80, desc: 'Heavy Rain'    },
  { day: 'Tue',   icon: CloudRain, temp: 29, rain: 65, desc: 'Showers'       },
  { day: 'Wed',   icon: Cloud,     temp: 31, rain: 30, desc: 'Partly Cloudy' },
  { day: 'Thu',   icon: Sun,       temp: 34, rain: 10, desc: 'Sunny'         },
  { day: 'Fri',   icon: Sun,       temp: 35, rain: 5,  desc: 'Clear'         },
  { day: 'Sat',   icon: CloudSun,  temp: 33, rain: 25, desc: 'Partly Sunny'  },
  { day: 'Sun',   icon: CloudRain, temp: 30, rain: 70, desc: 'Rainy'         },
]

export default function Weather() {
  const [zone,    setZone]    = useState('Southern Guinea Savanna')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchWeather(zone)
      .then(setWeather)
      .catch(() => setWeather(null))
      .finally(() => setLoading(false))
  }, [zone])

  const cond = weather?.current
  const advice = weather?.irrigation_advice || []

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
          <div className="icon-box icon-box-teal"><CloudSun size={20} /></div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', fontWeight: 800, color: 'var(--clr-text)' }}>Weather & Irrigation</h2>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>Hyper-local weather intelligence for your farming zone.</p>
      </div>

      {/* Zone selector */}
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <label className="form-label">Growing Zone</label>
        <select id="growing-zone" className="form-select" style={{ width: '100%' }}
          value={zone} onChange={e => setZone(e.target.value)}>
          {growingZones.map(z => <option key={z}>{z}</option>)}
        </select>
      </div>

      {/* Current conditions */}
      <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1rem', background: 'linear-gradient(135deg,#0d2b1e 0%,#1a3a28 100%)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.5rem' }}>📍 {zone}</p>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 0' }}>
            <Loader size={20} color="var(--clr-accent)" style={{ animation: 'spin 0.8s linear infinite' }} />
            <p style={{ color: 'var(--clr-text-muted)', fontSize: '0.85rem' }}>Fetching weather data...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <p style={{ fontFamily: 'Outfit', fontSize: '3.5rem', fontWeight: 800, color: 'var(--clr-text)', lineHeight: 1 }}>
                  {cond ? `${cond.temperature_c}°` : '32°'}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--clr-text-muted)' }}>
                  {cond ? cond.description : 'Heavy Rain expected'}
                </p>
              </div>
              <CloudRain size={52} color="var(--clr-accent)" strokeWidth={1.5} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
              {[
                { icon: Droplets,    label: 'Humidity',    value: cond ? `${cond.humidity_pct}%` : '78%' },
                { icon: Wind,        label: 'Wind',         value: cond ? `${cond.wind_kmh} km/h` : '14 km/h' },
                { icon: Eye,         label: 'Visibility',   value: '8 km' },
                { icon: Umbrella,    label: 'Rain Chance',  value: cond ? `${cond.rain_chance_pct}%` : '80%' },
                { icon: Thermometer, label: 'Feels Like',   value: cond ? `${Math.round(cond.temperature_c + 3)}°` : '35°' },
                { icon: Sun,         label: 'UV Index',     value: cond ? `${cond.uv_index}` : '8' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: '0.6rem', textAlign: 'center' }}>
                  <Icon size={16} color="var(--clr-accent)" style={{ marginBottom: 4 }} />
                  <p style={{ fontSize: '0.72rem', color: 'var(--clr-text-muted)', marginBottom: 2 }}>{label}</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clr-text)' }}>{value}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 7-day forecast */}
      <div style={{ marginBottom: '1rem' }}>
        <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>7-Day Forecast</h3>
        <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.3rem' }}>
          {weekForecastStatic.map(({ day, icon: Icon, temp, rain }, i) => (
            <div key={day} className="glass-card"
              style={{ minWidth: 72, padding: '0.75rem 0.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', flexShrink: 0,
                background: i === 0 ? 'rgba(26,122,74,0.15)' : undefined, borderColor: i === 0 ? 'rgba(34,160,94,0.35)' : undefined }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: i === 0 ? 'var(--clr-primary-light)' : 'var(--clr-text-muted)' }}>{day}</p>
              <Icon size={22} color={rain > 50 ? 'var(--clr-accent)' : 'var(--clr-secondary)'} strokeWidth={1.5} />
              <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--clr-text)' }}>
                {i === 0 && cond ? `${cond.temperature_c}°` : `${temp}°`}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Droplets size={10} color="var(--clr-accent)" />
                <p style={{ fontSize: '0.68rem', color: 'var(--clr-accent)', fontWeight: 600 }}>
                  {i === 0 && cond ? `${cond.rain_chance_pct}%` : `${rain}%`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation intelligence */}
      <div>
        <h3 className="section-title" style={{ marginBottom: '0.75rem' }}>💧 Irrigation Intelligence</h3>
        {(advice.length > 0 ? advice : [
          { condition: 'Rain expected today (80%)', action: 'Skip irrigation — save water & costs.', urgent: true },
          { condition: 'Soil moisture: Adequate', action: 'No supplemental irrigation needed.', urgent: false },
        ]).map((a, i) => (
          <div key={i} className="glass-card" style={{ padding: '0.9rem 1rem', marginBottom: '0.6rem', borderLeft: `3px solid ${a.urgent ? 'var(--clr-warning)' : 'var(--clr-primary)'}` }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--clr-text-muted)', marginBottom: '0.3rem' }}>{a.condition}</p>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--clr-text)' }}>→ {a.action}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
