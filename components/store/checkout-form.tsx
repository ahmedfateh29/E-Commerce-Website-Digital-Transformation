"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shipping = subtotal >= 100 ? 0 : 9.99
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (items.length === 0) return

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_email: formData.get("email") as string,
          customer_name: `${formData.get("firstName")} ${formData.get("lastName")}`,
          shipping_address: {
            line1: formData.get("address") as string,
            line2: formData.get("apartment") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            postal_code: formData.get("postalCode") as string,
            country: formData.get("country") as string,
          },
          subtotal,
          shipping_cost: shipping,
          tax,
          total,
          status: "pending",
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        product_price: item.product.price,
        quantity: item.quantity,
      }))

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems)

      if (itemsError) throw itemsError

      // Clear the cart and redirect to confirmation
      clearCart()
      router.push(`/order-confirmation/${order.id}`)
    } catch (err) {
      console.error("Checkout error:", err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add some items to your cart to checkout
        </p>
        <Button asChild className="mt-4">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Checkout Form */}
        <div className="space-y-8">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                <Input
                  id="apartment"
                  name="apartment"
                  className="mt-1"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">ZIP Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue="United States"
                  required
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment (Mock) */}
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed border-border bg-muted/50 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  This is a demo store. No real payment will be processed.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click &quot;Place Order&quot; to complete your mock purchase.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.images[0] || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-xs text-background">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatPrice(item.product.price)} each
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              {subtotal < 100 && (
                <p className="text-xs text-muted-foreground">
                  Add {formatPrice(100 - subtotal)} more for free shipping!
                </p>
              )}

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
