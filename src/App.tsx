import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/layout/layout'
import { Home } from './pages/home'
import { DashboardsIndex } from './pages/dashboards'
import { DashboardView } from './pages/dashboard-view'
import { AIStudio } from './pages/ai-studio'
import { MMM } from './pages/mmm'
import { HybeLLM } from './pages/hybe-llm'
import { Experiments } from './pages/experiments'
import { Subscriptions } from './pages/subscriptions'
import { DataExplorer } from './pages/data-explorer'
import { Projects } from './pages/projects'
import { About } from './pages/about'
import { NotFound } from './pages/not-found'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        {/* Dashboards */}
        <Route path="dashboards" element={<DashboardsIndex />} />
        <Route path="dashboard/:project/:source" element={<DashboardView />} />
        <Route path="dashboard/:project/band/:band" element={<DashboardView />} />
        
        {/* AI Studio */}
        <Route path="ai" element={<AIStudio />} />
        <Route path="ai/mmm" element={<MMM />} />
        <Route path="ai/llm" element={<HybeLLM />} />
        <Route path="ai/experiments/:appId?" element={<Experiments />} />
        
        {/* Other sections */}
        <Route path="subscriptions" element={<Subscriptions />} />
        <Route path="data" element={<DataExplorer />} />
        <Route path="data/:dataset" element={<DataExplorer />} />
        <Route path="projects" element={<Projects />} />
        <Route path="project/:project" element={<Projects />} />
        <Route path="about" element={<About />} />
        
        {/* Legacy redirects */}
        <Route path=":section/:platform" element={<DashboardView />} />
        
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}