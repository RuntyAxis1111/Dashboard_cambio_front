import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { DashboardsIndex } from './pages/DashboardsIndex'
import { DashboardDetail } from './pages/DashboardDetail'
import { AIStudio } from './pages/AIStudio'
import { MMM } from './pages/MMM'
import { HybeLLM } from './pages/HybeLLM'
import { Experiments } from './pages/Experiments'
import { Subscriptions } from './pages/Subscriptions'
import { DataExplorer } from './pages/DataExplorer'
import { About } from './pages/About'
import { AuthCallback } from './pages/AuthCallback'
import { Reports } from './pages/Reports'
import { Weeklies } from './pages/Weeklies'
import { WeeklyDetail } from './pages/WeeklyDetail'

export default function App() {
  console.log('🎯 App component rendering...')
  
  try {
    return (
      <AuthProvider>
        <Routes>
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/dashboards" element={<DashboardsIndex />} />
                  <Route path="/dashboard/:project/:source" element={<DashboardDetail />} />
                  <Route path="/dashboard/:project/band/:band" element={<DashboardDetail />} />
                  <Route path="/ai" element={<AIStudio />} />
                  <Route path="/ai/mmm" element={<MMM />} />
                  <Route path="/ai/llm" element={<HybeLLM />} />
                  <Route path="/ai/emotion-detection" element={<Experiments />} />
                  <Route path="/subscriptions" element={<Subscriptions />} />
                  <Route path="/data" element={<DataExplorer />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/reports/weeklies" element={<Weeklies />} />
                  <Route path="/reports/weeklies/:artistId" element={<WeeklyDetail />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    )
  } catch (error) {
    console.error('❌ Error in App component:', error)
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial', color: 'red' }}>
        <h2>App Component Error</h2>
        <p>Error: {error instanceof Error ? error.message : String(error)}</p>
        <pre>{error instanceof Error ? error.stack : String(error)}</pre>
      </div>
    )
  }
}