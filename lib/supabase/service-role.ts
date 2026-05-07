import { createClient } from "@supabase/supabase-js"

/**
 * Server-only client with elevated privileges. Never import this from client components.
 * Used for admin mutations when RLS blocks the anon key.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return null
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
