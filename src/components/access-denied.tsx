import { useAuth } from '../contexts/AuthContext'
import { Shield, LogOut } from 'lucide-react'

export function AccessDenied() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-black mb-4">Access Denied</h1>
        
        <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 mb-6">
          <p className="text-gray-600 mb-4">
            Your account <strong>{user?.email}</strong> is not authorized to access HYBE LATAM Data & AI Lab.
          </p>
          
          <div className="text-sm text-gray-500 mb-4">
            <p className="mb-2">Access is restricted to:</p>
            <ul className="text-left space-y-1">
              <li>• HYBE Corporation employees (@hybecorp.com)</li>
              <li>• Authorized partners and collaborators</li>
            </ul>
          </div>
          
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact your administrator.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 border border-gray-300 rounded-xl font-medium transition-colors text-black mx-auto"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        <div className="mt-8">
          <p className="text-xs text-gray-500">
            HYBE LATAM Data & AI Lab • Restricted Access
          </p>
        </div>
      </div>
    </div>
  )
}