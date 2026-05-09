import { CheckoutForm } from "@/components/store/checkout-form"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Checkout | Haven",
  description: "Complete your purchase",
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?next=%2Fcheckout")
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
