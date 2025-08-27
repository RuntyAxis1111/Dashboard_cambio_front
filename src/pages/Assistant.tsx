import AssistantBar from '../components/AssistantBar'
import { ChatOverlayStandalone } from '../components/ChatOverlayStandalone'

export default function Assistant() {
  return (
    <div className="flex flex-col h-screen bg-white">
      <AssistantBar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-3xl mx-auto h-full flex flex-col">
          <ChatOverlayStandalone />
        </div>
      </main>
    </div>
  )
}