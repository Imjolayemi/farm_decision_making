import axios from 'axios'
import { auth } from './firebase'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase ID token to every request when available
client.interceptors.request.use(async (config) => {
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken()
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (_) { /* no auth yet */ }
  return config
})

// ── Crop Advisor ─────────────────────────────────────────────────────────────
export const fetchCropRecommendations = (payload) =>
  client.post('/crop-advisor/', payload).then((r) => r.data)

// Payload shape:
// { soil_type, soil_ph, nitrogen?, phosphorus?, potassium?, state, season }

// ── Disease Detector ─────────────────────────────────────────────────────────
export const detectDisease = (imageFile) => {
  const form = new FormData()
  form.append('file', imageFile)
  return client.post('/disease-detect/', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  }).then((r) => r.data)
}

// ── Market Prices ────────────────────────────────────────────────────────────
export const fetchMarketPrices = (market = 'Lagos') =>
  client.get('/market/prices', { params: { market } }).then((r) => r.data)

// ── Weather ───────────────────────────────────────────────────────────────────
export const fetchWeather = (zone = 'Southern Guinea Savanna') =>
  client.get('/weather/', { params: { zone } }).then((r) => r.data)

// ── Credit Score (placeholder) ────────────────────────────────────────────────
export const fetchCreditScore = (userId) =>
  client.get(`/credit/${userId}`).then((r) => r.data)

export default client
