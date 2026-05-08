import { NextResponse, type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"
import { sanitizeNextParam } from "@/lib/auth/safe-redirect"
import { isAdminRole } from "@/lib/auth/roles"

function isAdminPath(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = updateSession(request)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  let profileFetch:
    | { role: string | null }
    | null = null

  const needsProfile =
    !!user &&
    (pathname === "/login" ||
      pathname === "/register" ||
      isAdminPath(pathname))

  if (needsProfile && user) {
    const { data } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()
    profileFetch = data ?? { role: null }
  }

  if (user) {
    const role = profileFetch?.role ?? null
    const admin = isAdminRole(role)

    if (pathname === "/login" || pathname === "/register") {
      const redirectPath = admin ? "/admin" : "/"
      return NextResponse.redirect(new URL(redirectPath, request.url))
    }

    if (isAdminPath(pathname) && !admin) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  } else {
    if (isAdminPath(pathname)) {
      const next = sanitizeNextParam(pathname)
      const login = new URL("/login", request.url)
      login.searchParams.set("next", next === "/" ? "/admin" : next)
      return NextResponse.redirect(login)
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
