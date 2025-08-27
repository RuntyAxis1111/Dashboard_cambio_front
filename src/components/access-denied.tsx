import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export function AccessDenied() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-black">
            Access Denied
          </h1>
          
          <p className="text-gray-600">
            Access allowed for @hybecorp.com employees or confirmed guest accounts
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full px-4 py-3 border border-black text-black bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
        >
          Try with another account
        </button>
      </div>
    </div>
  )
}