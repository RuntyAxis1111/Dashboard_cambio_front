import { Routes, Route } from 'react-router-dom'
import { Dashboard } from './components/dashboard'
import { DirectDashboard } from './components/direct-dashboard'
import { About } from './pages/About'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/about" element={<About />} />
      <Route path="/:section/:platform" element={<DirectDashboard />} />
      <Route path="/:section/band/:band" element={<DirectDashboard />} />
    </Routes>
  )
}