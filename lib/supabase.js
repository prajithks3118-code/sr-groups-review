import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
let projectUrl = null

try {
  projectUrl = supabaseUrl ? new URL(supabaseUrl).origin : null
} catch {
  projectUrl = null
}

const globalForSupabase = globalThis

export const supabase =
  projectUrl && supabasePublishableKey
    ? (globalForSupabase.supabaseClient ??= createClient(
        projectUrl,
        supabasePublishableKey
      ))
    : null