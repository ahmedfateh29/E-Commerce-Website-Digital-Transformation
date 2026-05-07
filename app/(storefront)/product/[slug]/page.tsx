import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductDetail } from "@/components/store/product-detail"

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!product) {
    return { title: "Product Not Found" }
  }

  return {
    title: `${product.name} | Haven`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  // Get related products from same category
  const { data: relatedProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(4)

  return <ProductDetail product={product} relatedProducts={relatedProducts || []} />
}
