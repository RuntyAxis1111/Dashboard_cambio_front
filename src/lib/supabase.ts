import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create a mock client if environment variables are missing
let supabase: any

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables not found, using mock client')
  
  // Mock Supabase client for when env vars are missing
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      select: () => Promise.resolve({ data: [], error: null }),
      update: () => Promise.resolve({ error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ error: new Error('Supabase not configured') })
    })
  }
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }