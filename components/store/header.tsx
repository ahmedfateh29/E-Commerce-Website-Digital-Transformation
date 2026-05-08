"use client"

import Link from "next/link"
import { ShoppingBag, Menu, X, Search, LayoutDashboard } from "lucide-react"
import { useState } from "react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { CartSheet } from "./cart-sheet"
import { SignOutButton } from "@/components/auth/sign-out-button"

interface HeaderProps {
  categories: { name: string; slug: string }[]
  userEmail: string | null
  isAdmin: boolean
}

export function Header({ categories, userEmail, isAdmin }: HeaderProps) {
  const { itemCount } = useCart()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-xl font-semibold tracking-tight">Haven</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              All Products
            </Link>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="hidden sm:flex items-center">
              <form action="/products" className="relative">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  name="q"
                  placeholder="Search products..."
                  className="w-48 pl-8 lg:w-64"
                />
              </form>
            </div>

            {/* Account */}
            <div className="hidden items-center gap-1 sm:flex">
              {userEmail ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" size="sm" className="h-9 gap-1" asChild>
                      <Link href="/admin">
                        <LayoutDashboard className="size-3.5" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <span className="max-w-[140px] truncate px-2 text-xs text-muted-foreground">
                    {userEmail}
                  </span>
                  <SignOutButton className="h-9 shrink-0" />
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="h-9" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-9 px-3" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Cart */}
            <CartSheet>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
                <span className="sr-only">Open cart</span>
              </Button>
            </CartSheet>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <form action="/products" className="relative">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      name="q"
                      placeholder="Search products..."
                      className="pl-8"
                    />
                  </form>
                  <nav className="flex flex-col gap-2">
                    <Link
                      href="/products"
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                    >
                      All Products
                    </Link>
                    {categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/category/${category.slug}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t border-border pt-4">
                    <p className="mb-3 px-1 text-xs font-medium text-muted-foreground">
                      Account
                    </p>
                    {userEmail ? (
                      <div className="flex flex-col gap-2">
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                          >
                            Admin dashboard
                          </Link>
                        )}
                        <SignOutButton className="justify-start px-3" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/login"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileMenuOpen(false)}
                          className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
                        >
                          Register
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
