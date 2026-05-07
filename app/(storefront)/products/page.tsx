import { createClient } from "@/lib/supabase/server"
import { ProductsPageContent } from "@/components/store/products-page-content"

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_active", true)

  // Apply search filter
  if (params.q) {
    query = query.ilike("name", `%${params.q}%`)
  }

  // Apply category filter
  if (params.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", params.category)
      .single()
    
    if (cat) {
      query = query.eq("category_id", cat.id)
    }
  }

  // Apply price filters
  if (params.minPrice) {
    query = query.gte("price", parseFloat(params.minPrice))
  }
  if (params.maxPrice) {
    query = query.lte("price", parseFloat(params.maxPrice))
  }

  // Apply sorting
  switch (params.sort) {
    case "price-asc":
      query = query.order("price", { ascending: true })
      break
    case "price-desc":
      query = query.order("price", { ascending: false })
      break
    case "newest":
      query = query.order("created_at", { ascending: false })
      break
    default:
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false })
  }

  const { data: products } = await query
  const { data: categories } = await supabase.from("categories").select("*").order("name")

  const list = products ?? []
  const title = params.q ? `Search results for "${params.q}"` : "All Products"

  return (
    <ProductsPageContent
      categories={categories || []}
      products={list}
      title={title}
      productCount={list.length}
    />
  )
}
