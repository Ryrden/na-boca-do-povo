import { createClient } from '@supabase/supabase-js'
import { useAuthUser } from 'src/composables/useAuthUser'

const supabaseUrl = process.env.SUPABASE_URL ?? ''
const supabaseKey = process.env.SUPABASE_KEY ?? ''
const supabase = createClient(supabaseUrl, supabaseKey)

supabase.auth.onAuthStateChange((event, session) => {
    const { user } = useAuthUser()
  
    user.value = session?.user || null
})

export default function useSupabase () {
  return { supabase }
}
// TODO: Usar replicate para replicar os dados do supabase par o pinia quanto houver alterações
// Isso deve permitr o sincronismo dos dados entre os clientes (offline first)