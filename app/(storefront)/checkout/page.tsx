import { CheckoutForm } from "@/components/store/checkout-form"

export const metadata = {
  title: "Checkout | Haven",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
      <CheckoutForm />
    </div>
  )
}
