import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/store/product-card"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(8)

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name")
    .limit(4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=80"
          alt="Modern living room with elegant furniture"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/20" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Transform Your Space
              </h1>
              <p className="mt-4 text-lg text-muted-foreground text-pretty">
                Discover curated home essentials designed for modern living.
                Quality craftsmanship meets timeless style.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button asChild size="lg">
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/category/living-room">Explore Collections</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Shop by Category
            </h2>
            <Link
              href="/products"
              className="hidden text-sm font-medium hover:underline sm:block"
            >
              View all categories
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-lg bg-muted"
              >
                <Image
                  src={category.image_url || "/placeholder.svg"}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute inset-0 flex items-end p-4 sm:p-6">
                  <div>
                    <h3 className="font-semibold text-background">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-sm text-background/80">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Featured Products
            </h2>
            <Link
              href="/products"
              className="hidden text-sm font-medium hover:underline sm:block"
            >
              View all products
              <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 flex justify-center sm:hidden">
            <Button asChild variant="outline">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">Free Shipping</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Free shipping on orders over $100. No hidden fees or surprises.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">Secure Checkout</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your payment information is always secure and protected.
              </p>
            </div>
            <div className="text-center sm:col-span-2 lg:col-span-1">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold">Easy Returns</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                30-day hassle-free returns. No questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
