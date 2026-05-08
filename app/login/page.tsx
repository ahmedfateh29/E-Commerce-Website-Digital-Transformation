import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { sanitizeNextParam } from "@/lib/auth/safe-redirect"
import { isAdminRole } from "@/lib/auth/roles"
import { LoginForm } from "./login-form"

export const metadata = {
  title: "Sign in | Haven",
}

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next } = await searchParams
  const nextPath = sanitizeNextParam(next ?? null, "/")

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    redirect(
      profile && isAdminRole(profile.role) ? "/admin" : "/",
    )
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <LoginForm nextPath={nextPath} />
    </div>
  )
}
