import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Dashboard } from "./components/dashboard"
import Assistant from './pages/Assistant'
import RobynResults from './pages/RobynResults'
import { DirectDashboard } from "./components/direct-dashboard"

export default function App() {
  const location = useLocation()

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