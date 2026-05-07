"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { ProductCard } from "@/components/store/product-card"
import { ProductFilters } from "@/components/store/product-filters"
import {
  ProductGridSkeleton,
} from "@/components/store/product-skeletons"
import { dispatchStorefrontNavigationStart } from "@/components/navigation-progress"
import { cn } from "@/lib/utils"
import type { Category, Product } from "@/lib/types"

interface ProductsPageContentProps {
  categories: Category[]
  products: Product[]
  title: string
  productCount: number
}

export function ProductsPageContent({
  categories,
  products,
  title,
  productCount,
}: ProductsPageContentProps) {
  const router = useRouter()
  const [isFilterPending, startTransition] = useTransition()

  const navigate = (href: string) => {
    dispatchStorefrontNavigationStart()
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {productCount} products
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductFilters
            categories={categories}
            onNavigate={navigate}
            disabled={isFilterPending}
          />
        </div>

        <div className="relative min-h-[280px] lg:col-span-3">
          {isFilterPending && (
            <div
              className="absolute inset-0 z-10 flex flex-col rounded-lg bg-background/75 p-1 backdrop-blur-[2px] animate-in fade-in-0 duration-200"
              aria-busy
              aria-label="Updating product list"
            >
              <ProductGridSkeleton
                count={9}
                columns="md:grid-cols-3"
                className="flex-1"
              />
            </div>
          )}

          <div
            className={cn(
              "transition-opacity duration-200",
              isFilterPending && "pointer-events-none opacity-45",
            )}
          >
            {products.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-lg font-medium">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
