import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
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
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  )
}