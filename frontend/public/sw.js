// FarmWise AI — Service Worker (PWA Offline Support)
const CACHE_NAME = 'farmwise-v1'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
]

// Install — cache static shell
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch strategy:
//   - API calls          → Network first, fall through on error
//   - Static assets      → Cache first, network fallback
//   - Navigation (HTML)  → Network first, cache fallback (for offline)
self.addEventListener('fetch', (e) => {
  const { request } = e
  const url = new URL(request.url)

  // Don't cache cross-origin requests (Firebase, Paystack, etc.)
  if (url.origin !== self.location.origin) return

  // API calls — always try network first
  if (url.pathname.startsWith('/api') || url.pathname.startsWith('/crop-advisor') ||
      url.pathname.startsWith('/disease-detect') || url.pathname.startsWith('/market') ||
      url.pathname.startsWith('/weather')) {
    e.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'Offline — please reconnect.' }), {
          headers: { 'Content-Type': 'application/json' },
        })
      )
    )
    return
  }

  // Navigation — network first, stale page fallback
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() => caches.match('/index.html'))
    )
    return
  }

  // Static assets — cache first
  e.respondWith(
    caches.match(request).then((cached) =>
      cached || fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then((c) => c.put(request, clone))
        }
        return response
      })
    )
  )
})
