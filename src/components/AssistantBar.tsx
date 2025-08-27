import { useNavigate } from 'react-router-dom'

export default function AssistantBar() {
  const navigate = useNavigate()

  return (
    <header className="w-full border-b border-neutral-200 flex items-center h-12 px-4 bg-white">
      <button
        className="text-sm text-black hover:underline font-medium"
        onClick={() => navigate('/')}
      >
        ← Dashboard
      </button>
      <span className="mx-auto font-semibold text-black">pinguino Hybe</span>
    </header>
  )
}