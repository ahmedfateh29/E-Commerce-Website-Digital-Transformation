import Link from "next/link"
import { redirect } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderOpen,
  ArrowLeft,
} from "lucide-react"
import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/server"
import { SignOutButton } from "@/components/auth/sign-out-button"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/categories", label: "Categories", icon: FolderOpen },
]

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=%2Fadmin")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  if (profile?.role !== "admin") {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-muted/30 lg:block">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/admin" className="text-lg font-semibold">
            Haven Admin
          </Link>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
          <div className="mt-4 border-t border-border pt-4">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Store
            </Link>
          </div>
          <SignOutButton className="mt-3 w-full justify-start gap-3 rounded-lg px-3 py-2 font-medium text-muted-foreground hover:bg-accent hover:text-foreground hover:no-underline" />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <Link href="/admin" className="text-lg font-semibold">
            Haven Admin
          </Link>
          <div className="flex items-center gap-2">
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="sr-only">{item.label}</span>
                </Link>
              ))}
            </nav>
            <SignOutButton variant="outline" size="sm" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
