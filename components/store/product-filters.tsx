"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import type { Category } from "@/lib/types"

interface ProductFiltersProps {
  categories: Category[]
  /** When set, used instead of `router.push` (e.g. wrap in `startTransition` + top progress bar). */
  onNavigate?: (href: string) => void
  /** Disables filter controls while a navigation is in flight */
  disabled?: boolean
}

export function ProductFilters({
  categories,
  onNavigate,
  disabled = false,
}: ProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || ""
  const currentSort = searchParams.get("sort") || "featured"

  const push = (href: string) => {
    if (onNavigate) onNavigate(href)
    else router.push(href)
  }

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    const qs = params.toString()
    push(qs ? `${pathname}?${qs}` : pathname)
  }

  const clearFilters = () => {
    push(pathname)
  }

  const hasFilters = searchParams.toString() !== ""

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <Label className="text-sm font-medium">Sort By</Label>
        <Select
          value={currentSort}
          onValueChange={(value) => updateFilter("sort", value)}
          disabled={disabled}
        >
          <SelectTrigger className="mt-2 w-full" disabled={disabled}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <Label className="text-sm font-medium">Category</Label>
        <RadioGroup
          value={currentCategory}
          onValueChange={(value) => updateFilter("category", value)}
          className="mt-3 space-y-2"
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all" />
            <Label htmlFor="all" className="font-normal cursor-pointer">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <RadioGroupItem value={category.slug} id={category.slug} />
              <Label htmlFor={category.slug} className="font-normal cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {hasFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            className="w-full"
            onClick={clearFilters}
            disabled={disabled}
          >
            Clear Filters
          </Button>
        </>
      )}
    </div>
  )
}
