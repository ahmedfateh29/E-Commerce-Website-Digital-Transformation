"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Check, Minus, Plus, ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Separator } from "@/components/ui/separator"
import { ProductCard } from "./product-card"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
  relatedProducts: Product[]
}

export function ProductDetail({ product, relatedProducts }: ProductDetailProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [cartAction, setCartAction] = useState<"idle" | "adding" | "added">(
    "idle",
  )

  const discount = product.compare_at_price
    ? Math.round(
        ((product.compare_at_price - product.price) / product.compare_at_price) * 100
      )
    : null

  const handleAddToCart = () => {
    if (product.inventory_count === 0 || cartAction !== "idle") return
    setCartAction("adding")
    window.setTimeout(() => {
      addItem(product, quantity)
      setCartAction("added")
      window.setTimeout(() => setCartAction("idle"), 2000)
    }, 320)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-foreground">
          Products
        </Link>
        {product.category && (
          <>
            <span className="mx-2">/</span>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-foreground"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {discount && (
              <span className="absolute top-4 left-4 rounded-full bg-foreground px-3 py-1 text-sm font-medium text-background">
                -{discount}%
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    selectedImage === index
                      ? "border-foreground"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <Link
              href={`/category/${product.category.slug}`}
              className="text-sm text-muted-foreground hover:underline"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <Separator className="my-6" />

          {product.description && (
            <div className="prose prose-sm text-muted-foreground">
              <p>{product.description}</p>
            </div>
          )}

          <div className="mt-6 flex items-center gap-2 text-sm">
            {product.inventory_count > 0 ? (
              <>
                <Check className="h-4 w-4 text-green-600" />
                <span className="text-green-600">In stock</span>
                <span className="text-muted-foreground">
                  ({product.inventory_count} available)
                </span>
              </>
            ) : (
              <span className="text-destructive">Out of stock</span>
            )}
          </div>

          <Separator className="my-6" />

          {/* Quantity and Add to Cart */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center rounded-md border border-input">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-none"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || cartAction !== "idle"}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-sm">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-none"
                  onClick={() =>
                    setQuantity(Math.min(product.inventory_count, quantity + 1))
                  }
                  disabled={
                    quantity >= product.inventory_count || cartAction !== "idle"
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="flex-1 sm:max-w-xs"
              onClick={handleAddToCart}
              disabled={
                product.inventory_count === 0 ||
                cartAction === "adding" ||
                cartAction === "added"
              }
              aria-busy={cartAction === "adding"}
            >
              {cartAction === "adding" ? (
                <>
                  <Spinner className="size-5" />
                  Adding…
                </>
              ) : cartAction === "added" ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 border-t border-border pt-16">
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            You May Also Like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
