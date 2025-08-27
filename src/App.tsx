import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useAuth } from "./contexts/AuthContext"
import { SignInPage } from "./components/signin-page"
import { AccessDenied } from "./components/access-denied"
import { Dashboard } from "./components/dashboard"
import Assistant from './pages/Assistant'
import RobynResults from './pages/RobynResults'
import { DirectDashboard } from "./components/direct-dashboard"

export default function App() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-black">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SignInPage />
  }

  // Check if user email is from @hybecorp.com
  const authorizedEmails = [
    'jaime@lulofilms.com',
    'caralf@gmail.com', 
    'gatito.enano1@gmail.com'
  ]
  
  const isAuthorized = user.email?.endsWith('@hybecorp.com') || 
                      authorizedEmails.includes(user.email || '')

  if (!isAuthorized) {
    return <AccessDenied />
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Dashboard key={location.state?.activeTab || 'default'} />} 
      />
      <Route path="/assistant" element={<Assistant />} />
      <Route path="/mmm/results" element={<RobynResults />} />
      <Route path="/:section/:platform" element={<DirectDashboard />} />
    </Routes>
  )
}