import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Intercom from '@intercom/messenger-js-sdk'
import { useAuth } from '../contexts/AuthContext'

export function IntercomChat() {
  const location = useLocation()
  const { user } = useAuth()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    if (isHomePage) {
      if (window.Intercom) {
        window.Intercom('shutdown')
      }
      return
    }

    Intercom({
      app_id: 'aeot3qeo',
      user_id: user?.id,
      email: user?.email,
      name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
    })

    return () => {
      if (window.Intercom) {
        window.Intercom('shutdown')
      }
    }
  }, [isHomePage, user])

  return null
}
