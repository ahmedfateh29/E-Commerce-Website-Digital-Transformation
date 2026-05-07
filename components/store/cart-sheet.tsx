"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { ReactNode } from "react"

interface CartSheetProps {
  children: ReactNode
}

export function CartSheet({ children }: CartSheetProps) {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({itemCount})</SheetTitle>
          <SheetDescription>Review your items before checkout</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground">Your cart is empty</p>
            <SheetTrigger asChild>
              <Button asChild>
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </SheetTrigger>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="flex flex-col gap-3 py-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-4 rounded-xl border border-border bg-muted/30 p-4 shadow-xs"
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link
                          href={`/product/${item.product.slug}`}
                          className="text-sm font-medium hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 -mt-1"
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="mt-auto flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <Separator />
              <div className="flex justify-between text-base font-medium">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Shipping and taxes calculated at checkout.
              </p>
              <SheetTrigger asChild>
                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">Checkout</Link>
                </Button>
              </SheetTrigger>
              <SheetTrigger asChild>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetTrigger>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
