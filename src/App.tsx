import { Routes, Route } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Dashboard } from "./components/dashboard"
import { About } from "./pages/About"
import { DirectDashboard } from "./components/direct-dashboard"

export default function App() {
  const location = useLocation()

  return (
    <Routes>
      <Route 
        path="/" 
        element={<Dashboard key={location.state?.activeTab || 'default'} />} 
      />
      <Route path="/about" element={<About />} />
      <Route path="/:section/:platform" element={<DirectDashboard />} />
    </Routes>
  )
}