import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'

import Layout from './components/Layout'
import BackgroundAudio from './components/BackgroundAudio'
import FloatingChat from './components/FloatingChat'

import LandingPage from './pages/Landing'
import LoginPage from './pages/Login'
import MapPage from './pages/Map'
import QuestPage from './pages/Quest'
import ProfilePage from './pages/Profile'
import ChatPage from './pages/Chat'

export default function App() {
  return (
    <AuthProvider>
      <Router>

        <BackgroundAudio />
        <FloatingChat />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/app" element={<Layout><Outlet /></Layout>}>
            <Route index element={<MapPage />} />
            <Route path="quest" element={<QuestPage />} />
            <Route path="verse" element={<ChatPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </Router>
    </AuthProvider>
  )
}