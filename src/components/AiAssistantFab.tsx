import { useNavigate, useLocation } from 'react-router-dom'

export function AiAssistantFab() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    const path = location.pathname
    if (path.startsWith("/assistant")) {
      navigate(-1) // Go back to previous dashboard
    } else {
      navigate("/assistant")
    }
  }

  return (
    <button
      aria-label="Abrir asistente"
      onClick={handleClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-black text-white flex items-center justify-center shadow-xl hover:bg-neutral-800 transition-colors z-50"
    >
      <svg 
        className="h-6 w-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      </svg>
    </button>
  )
}