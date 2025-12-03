import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function IntercomChat() {
  const location = useLocation()
  const { user } = useAuth()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    const checkIntercom = setInterval(() => {
      if (window.Intercom) {
        clearInterval(checkIntercom)

        if (isHomePage) {
          window.Intercom('hide')
        } else {
          window.Intercom('boot', {
            app_id: 'aeot3qeo',
            user_id: user?.id,
            email: user?.email,
            name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
          })
          window.Intercom('show')
        }
      }
    }, 100)

    return () => {
      clearInterval(checkIntercom)
    }
  }, [isHomePage, user])

  return null
}
