import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="mt-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-[75%] max-w-full" />
        <Skeleton className="h-4 w-1/2 max-w-full" />
      </div>
      <Skeleton className="mt-3 h-9 w-full rounded-md" />
    </div>
  )
}

export function ProductGridSkeleton({
  count = 8,
  className,
  columns = "md:grid-cols-3 lg:grid-cols-4",
}: {
  count?: number
  className?: string
  /** Tailwind grid column classes, e.g. `md:grid-cols-3` for the products listing page */
  columns?: string
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6",
        columns,
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function ProductFiltersSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2 h-9 w-full rounded-md" />
      </div>
      <Skeleton className="h-px w-full" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1 max-w-[10rem]" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductsListingSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48 max-w-full sm:w-64" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <ProductFiltersSkeleton />
        </div>
        <div className="lg:col-span-3">
          <ProductGridSkeleton count={9} columns="md:grid-cols-3" />
        </div>
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex gap-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="flex gap-2">
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
            <Skeleton className="h-20 w-20 rounded-lg" />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-[75%] max-w-full" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="my-4 h-px w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="mt-2 h-4 w-28" />
          <Skeleton className="my-4 h-px w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 flex-1 max-w-xs" />
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-16 border-t border-border pt-16">
        <Skeleton className="h-8 w-48" />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <Skeleton className="aspect-[4/5] w-full rounded-lg" />
  )
}

export function CategoryGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Skeleton className="h-9 w-56 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
        <Skeleton className="h-4 w-2/3 max-w-lg" />
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      {/* Hero Skeleton */}
      <Skeleton className="h-[70vh] min-h-[500px] w-full" />

      {/* Categories Section */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="hidden h-4 w-32 sm:block" />
          </div>
          <div className="mt-8">
            <CategoryGridSkeleton />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="border-t border-border bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="hidden h-4 w-32 sm:block" />
          </div>
          <div className="mt-8">
            <ProductGridSkeleton />
          </div>
        </div>
      </section>
    </div>
  )
}
