import { notFound } from "next/navigation"
import Link from "next/link"
import { Check, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice, formatDateTime } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface OrderConfirmationPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: "Order Confirmed | Haven",
  description: "Your order has been placed successfully",
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single()

  if (!order) {
    notFound()
  }

  const { data: orderItems } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id)

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
          Thank you for your order!
        </h1>
        <p className="mt-2 text-muted-foreground">
          Your order has been placed successfully. We&apos;ll send you a confirmation
          email shortly.
        </p>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Details
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {formatDateTime(order.created_at)}
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Order Number
              </h4>
              <p className="mt-1 font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Status
              </h4>
              <p className="mt-1 text-sm capitalize">{order.status}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Email
              </h4>
              <p className="mt-1 text-sm">{order.customer_email}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">
                Shipping Address
              </h4>
              <p className="mt-1 text-sm">
                {order.shipping_address.line1}
                {order.shipping_address.line2 && (
                  <>, {order.shipping_address.line2}</>
                )}
                <br />
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
                <br />
                {order.shipping_address.country}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium">Items</h4>
            <div className="mt-3 space-y-3">
              {orderItems?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.product_name} x {item.quantity}
                  </span>
                  <span>{formatPrice(item.product_price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>
                {order.shipping_cost === 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  formatPrice(order.shipping_cost)
                )}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}
