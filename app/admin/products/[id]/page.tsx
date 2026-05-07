import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

interface EditProductPageProps {
  params: Promise<{
    id: string
  }>
}

export const metadata = {
  title: "Edit Product | Haven Admin",
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground">{product.name}</p>
      </div>

      <ProductForm product={product} categories={categories || []} />
    </div>
  )
}
