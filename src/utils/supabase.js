import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

if (!supabaseUrl) {
  throw new Error(
    'Variável de ambiente VITE_SUPABASE_URL não está definida. Por favor, adicione no arquivo .env',
  )
}

if (!supabaseKey) {
  throw new Error(
    'Variável de ambiente VITE_SUPABASE_KEY não está definida. Por favor, adicione no arquivo .env',
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)
