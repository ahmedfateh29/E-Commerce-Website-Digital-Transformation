import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export const metadata = {
  title: "Add Product | Haven Admin",
}

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Product</h1>
        <p className="text-muted-foreground">
          Create a new product for your store
        </p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
