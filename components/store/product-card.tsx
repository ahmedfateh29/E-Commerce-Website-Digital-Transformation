"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAdding) return
    setIsAdding(true)
    window.setTimeout(() => {
      addItem(product)
      setIsAdding(false)
    }, 280)
  }

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : null

  return (
    <div className="group relative flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square overflow-hidden rounded-lg bg-muted"
      >
        <Image
          src={product.images[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discount && (
          <span className="absolute top-2 left-2 rounded-full bg-foreground px-2 py-1 text-xs font-medium text-background">
            -{discount}%
          </span>
        )}
      </Link>
      <div className="mt-3 flex flex-col gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-sm font-medium leading-tight hover:underline line-clamp-2"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="mt-3 w-full"
        onClick={handleAddToCart}
        disabled={isAdding}
        aria-busy={isAdding}
      >
        {isAdding ? (
          <>
            <Spinner className="size-4" />
            Adding…
          </>
        ) : (
          <>
            <ShoppingBag className="mr-2 h-4 w-4" />
            Add to Cart
          </>
        )}
      </Button>
    </div>
  )
}
