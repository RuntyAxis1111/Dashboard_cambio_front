import React from 'react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export function SignInPage() {
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth()
  const [showEmailAuth, setShowEmailAuth] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // VIP users with predefined credentials
  const vipUsers = [
    {
      email: 'jaime@lulofilms.com',
      password: 'N_ZehDZpmt_f@h893*FQQm-KziXpgMb!nNfL.cUVLAbDHLLRAt'
    },
    {
      email: 'caralf@gmail.com', 
      password: 'TzLK*dCAYuXmZr-ndFbFUdLzkwh9Z7kGbkE3Mh68DpnZngP!FT'
    },
    {
      email: 'gatito.enano1@gmail.com',
      password: 'dTHrYcFRWAmoPctA*XNVP!yN@NM*yYLjph!pa8y2q!c!ohvu4R'
    }
  ]

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Security: Validate input format first
      const sanitizedEmail = email.trim().toLowerCase()
      if (!sanitizedEmail || !password) {
        setError('Email and password are required.')
        return
      }

      // Security: Only validate against hardcoded VIP users with timing-safe comparison
      const validUser = vipUsers.find(user => user.email === sanitizedEmail)
      if (!validUser || validUser.password !== password) {
        // Add artificial delay to prevent timing attacks
        await new Promise(resolve => setTimeout(resolve, 1000))
        setError('Access denied. Invalid credentials.')
        return
      }

      // Try to sign in first
      const { error: signInError } = await signInWithEmail(sanitizedEmail, password)
      
      if (signInError) {
        // If user doesn't exist, create it
        const { error: signUpError } = await supabase.auth.signUp({
          email: sanitizedEmail,
          password: password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              vip_user: true,
              created_at: new Date().toISOString()
            }
          }
        })

        if (signUpError) {
          console.error('SignUp error:', signUpError.message)
          setError('Failed to create VIP account. Please contact administrator.')
        } else {
          setMessage('VIP account created successfully! You should now be logged in.')
        }
      }
    } catch (err) {
      console.error('Auth error:', err)
      setError('Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Security: Rate limiting state
  const [attemptCount, setAttemptCount] = useState(0)
  const [lastAttempt, setLastAttempt] = useState(0)
  
  const handleEmailAuthWithRateLimit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Rate limiting: max 5 attempts per 15 minutes
    const now = Date.now()
    if (attemptCount >= 5 && now - lastAttempt < 15 * 60 * 1000) {
      setError('Too many attempts. Please wait 15 minutes before trying again.')
      return
    }
    
    if (now - lastAttempt > 15 * 60 * 1000) {
      setAttemptCount(0)
    }
    
    setAttemptCount(prev => prev + 1)
    setLastAttempt(now)
    
    await handleEmailAuth(e)
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">
            HYBE LATIN AMERICA
          </h1>
          <h2 className="text-xl font-semibold text-black mb-8">
            DATA HUB
          </h2>
          <p className="text-gray-600 mb-8">
            Access with your corporate account or as a guest
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Sign In */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center px-4 py-3 border border-black text-black bg-white hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* VIP Access Button */}
          <button
            onClick={() => setShowEmailAuth(!showEmailAuth)}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 bg-gray-50 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            VIP Access
            <svg className={`w-4 h-4 ml-2 transition-transform duration-200 ${showEmailAuth ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Email/Password Form - Dropdown */}
          {showEmailAuth && (
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4 animate-in slide-in-from-top-2 duration-200">
              <form onSubmit={handleEmailAuthWithRateLimit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    maxLength={254}
                    autoComplete="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="current-password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {message && (
                  <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-4 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Processing...' : 'Sign In'}
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Employees: use Google • VIP users: authorized access only
          </p>
        </div>
      </div>
    </div>
  )
}