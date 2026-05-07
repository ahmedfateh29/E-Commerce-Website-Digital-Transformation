import { Header } from "./header"
import { Footer } from "./footer"
import { createClient } from "@/lib/supabase/server"
import type { ReactNode } from "react"

interface StoreLayoutProps {
  children: ReactNode
}

export async function StoreLayout({ children }: StoreLayoutProps) {
  const supabase = await createClient()
  
  const { data: categories } = await supabase
    .from("categories")
    .select("name, slug")
    .order("name")

  return (
    <div className="flex min-h-screen flex-col">
      <Header categories={categories || []} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
