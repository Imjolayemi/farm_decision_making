import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import TopBar from './components/TopBar'
import Dashboard from './pages/Dashboard'
import CropAdvisor from './pages/CropAdvisor'
import DiseaseDetector from './pages/DiseaseDetector'
import MarketHub from './pages/MarketHub'
import Weather from './pages/Weather'
import Community from './pages/Community'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import { useAuth } from './context/AuthContext'
import './index.css'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <TopBar />
        <main className="page-content">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/crop-advisor" element={<ProtectedRoute><CropAdvisor /></ProtectedRoute>} />
            <Route path="/disease-detector" element={<ProtectedRoute><DiseaseDetector /></ProtectedRoute>} />
            <Route path="/market" element={<ProtectedRoute><MarketHub /></ProtectedRoute>} />
            <Route path="/weather" element={<ProtectedRoute><Weather /></ProtectedRoute>} />
            <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
