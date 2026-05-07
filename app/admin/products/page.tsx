import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export const metadata = {
  title: "Products | Haven Admin",
}

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-medium hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {product.category?.name || "—"}
                  </TableCell>
                  <TableCell>{formatPrice(product.price)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.inventory_count < 10
                          ? "text-destructive"
                          : ""
                      }
                    >
                      {product.inventory_count}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={product.is_active ? "default" : "secondary"}
                    >
                      {product.is_active ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/products/${product.id}`}>
                          Edit
                        </Link>
                      </Button>
                      <DeleteProductButton productId={product.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="py-8 text-center">
                  <p className="text-muted-foreground">No products yet</p>
                  <Button asChild className="mt-4" variant="outline">
                    <Link href="/admin/products/new">Add your first product</Link>
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
