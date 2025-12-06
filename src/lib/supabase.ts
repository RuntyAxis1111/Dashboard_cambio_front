import { createClient } from '@supabase/supabase-js'
import { getSupabaseConfig } from './config'

// Get configuration from environment variables only
const { url, anonKey } = getSupabaseConfig()

// Create Supabase client
export const supabase = createClient(url, anonKey)
