import { Skeleton } from "@/components/ui/skeleton"

/** Neutral full-width placeholder for routes without a dedicated layout (checkout, home, etc.). */
export function StorefrontFallbackSkeleton() {
  return (
    <div className="flex min-h-[50vh] flex-col">
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
        <Skeleton className="absolute inset-0 size-full rounded-none" />
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl space-y-4">
            <Skeleton className="h-12 w-full max-w-lg" />
            <Skeleton className="h-6 w-full max-w-md" />
            <div className="flex gap-3 pt-4">
              <Skeleton className="h-10 w-32 rounded-md" />
              <Skeleton className="h-10 w-36 rounded-md" />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-3 border-t border-border pt-10">
          <Skeleton className="h-8 w-56" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
