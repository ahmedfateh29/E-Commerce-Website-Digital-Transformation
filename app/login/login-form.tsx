"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { sanitizeNextParam } from "@/lib/auth/safe-redirect"
import { isAdminRole } from "@/lib/auth/roles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface LoginFormProps {
  nextPath: string
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signError) {
      setError(signError.message)
      setLoading(false)
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError("Signed in but session was not created. Try again.")
      setLoading(false)
      return
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    const safeNext = sanitizeNextParam(nextPath, "/")
    const target =
      profile && isAdminRole(profile.role)
        ? safeNext.startsWith("/admin")
          ? safeNext
          : "/admin"
        : safeNext.startsWith("/admin")
          ? "/"
          : safeNext

    router.replace(target)
    router.refresh()
    setLoading(false)
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl">Sign in</CardTitle>
        <CardDescription>
          Customers continue to the store. Admins sign in here to reach the dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          New customer account?{" "}
          <Link href="/register" className="font-medium text-foreground underline">
            Create account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link href="/" className="text-muted-foreground hover:underline">
            ← Back to store
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
