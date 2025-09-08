import { ReactNode } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { SignInPage } from './signin-page'
import { AccessDenied } from './access-denied'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAuthorized } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SignInPage />
  }

  if (!isAuthorized) {
    return <AccessDenied />
  }

  return <>{children}</>
}