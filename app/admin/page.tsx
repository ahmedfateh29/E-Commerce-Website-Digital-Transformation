import Link from "next/link"
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Admin Dashboard | Haven",
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Get statistics
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["pending", "processing", "shipped", "delivered"])

  const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: lowStockProducts } = await supabase
    .from("products")
    .select("id, name, inventory_count")
    .lt("inventory_count", 10)
    .order("inventory_count", { ascending: true })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your store performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPrice(totalRevenue)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Order Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orderCount ? formatPrice(totalRevenue / orderCount) : "$0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Link
                href="/admin/orders"
                className="text-sm text-muted-foreground hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{order.customer_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {order.customer_email}
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
                      <div className="text-left sm:text-right">
                        <p className="text-sm font-medium">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {order.status}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild className="shrink-0">
                        <Link href={`/admin/orders/${order.id}`}>
                          View details
                          <ExternalLink className="ml-1 size-3.5 opacity-70" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Low Stock Alert</CardTitle>
              <Link
                href="/admin/products"
                className="text-sm text-muted-foreground hover:underline"
              >
                Manage inventory
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm font-medium">{product.name}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        product.inventory_count === 0
                          ? "bg-destructive/10 text-destructive"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {product.inventory_count} in stock
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                All products are well stocked
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
