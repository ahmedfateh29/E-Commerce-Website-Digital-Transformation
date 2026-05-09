import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ensureCustomerProfile } from "@/lib/auth/ensure-profile"

export async function POST() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  await ensureCustomerProfile(user.id)
  return NextResponse.json({ ok: true })
}
