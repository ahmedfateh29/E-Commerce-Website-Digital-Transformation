import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice, formatDateTime } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { OrderStatusSelect } from "@/components/admin/order-status-select"

interface OrderDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: "Order Details | Haven Admin",
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" className="-ml-2 w-fit gap-1 px-2" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="size-4" />
              All orders
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Order #{id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-muted-foreground">
              {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-stretch gap-2 sm:items-end">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Order status
          </p>
          <OrderStatusSelect orderId={id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orderItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/20 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.product_price)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.product_price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>
                  {order.shipping_cost === 0
                    ? "Free"
                    : formatPrice(order.shipping_cost)}
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

        {/* Customer Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">{order.customer_name}</p>
              <p className="text-sm text-muted-foreground">
                {order.customer_email}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="not-italic text-sm">
                {order.shipping_address.line1}
                <br />
                {order.shipping_address.line2 && (
                  <>
                    {order.shipping_address.line2}
                    <br />
                  </>
                )}
                {order.shipping_address.city}, {order.shipping_address.state}{" "}
                {order.shipping_address.postal_code}
                <br />
                {order.shipping_address.country}
              </address>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
