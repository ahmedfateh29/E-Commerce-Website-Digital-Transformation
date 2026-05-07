import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/store/product-card"

interface CategoryPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: category } = await supabase
    .from("categories")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!category) {
    return { title: "Category Not Found" }
  }

  return {
    title: `${category.name} | Haven`,
    description: category.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single()

  if (!category) {
    notFound()
  }

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-2 text-muted-foreground">{category.description}</p>
        )}
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-lg font-medium">No products in this category</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back soon for new arrivals
          </p>
        </div>
      )}
    </div>
  )
}
