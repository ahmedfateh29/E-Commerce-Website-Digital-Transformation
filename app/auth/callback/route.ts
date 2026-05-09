import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sanitizeNextParam } from "@/lib/auth/safe-redirect"
import { ensureCustomerProfile } from "@/lib/auth/ensure-profile"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")
  const nextRaw = requestUrl.searchParams.get("next")
  const nextPath = sanitizeNextParam(nextRaw)

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      await ensureCustomerProfile(user.id)
    }
  }

  return NextResponse.redirect(new URL(nextPath, requestUrl.origin))
}
