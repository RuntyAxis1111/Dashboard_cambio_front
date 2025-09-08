import { createClient } from '@supabase/supabase-js'
import { SUPABASE_CONFIG } from './config'

// Usar configuración hardcodeada como fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_CONFIG.url
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_CONFIG.anonKey

// Crear cliente de Supabase con configuración hardcodeada
console.log('🔧 Supabase URL:', supabaseUrl)
console.log('🔑 Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
