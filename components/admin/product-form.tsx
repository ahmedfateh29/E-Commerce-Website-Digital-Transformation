"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product, Category } from "@/lib/types"

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const slug = (formData.get("name") as string)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const productData = {
      name: formData.get("name") as string,
      slug: product?.slug || slug,
      description: formData.get("description") as string,
      price: parseFloat(formData.get("price") as string),
      compare_at_price: formData.get("compareAtPrice")
        ? parseFloat(formData.get("compareAtPrice") as string)
        : null,
      category_id: formData.get("category") || null,
      images: (formData.get("images") as string)
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean),
      inventory_count: parseInt(formData.get("inventory") as string) || 0,
      is_featured: formData.get("isFeatured") === "on",
      is_active: formData.get("isActive") === "on",
    }

    try {
      if (product) {
        const { error: updateError } = await supabase
          .from("products")
          .update(productData)
          .eq("id", product.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from("products")
          .insert(productData)

        if (insertError) throw insertError
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err) {
      console.error("Error saving product:", err)
      setError("Failed to save product. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={product?.name}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={product?.description || ""}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="images">
                  Image URLs (one per line)
                </Label>
                <Textarea
                  id="images"
                  name="images"
                  rows={3}
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                  defaultValue={product?.images?.join("\n") || ""}
                  className="mt-1 font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={product?.price}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="compareAtPrice">Compare at Price</Label>
                  <Input
                    id="compareAtPrice"
                    name="compareAtPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={product?.compare_at_price || ""}
                    className="mt-1"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Original price for showing discounts
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="inventory">Stock Quantity</Label>
                <Input
                  id="inventory"
                  name="inventory"
                  type="number"
                  min="0"
                  defaultValue={product?.inventory_count || 0}
                  className="mt-1 max-w-[200px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="isActive">Active</Label>
                <Switch
                  id="isActive"
                  name="isActive"
                  defaultChecked={product?.is_active ?? true}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isFeatured">Featured</Label>
                <Switch
                  id="isFeatured"
                  name="isFeatured"
                  defaultChecked={product?.is_featured ?? false}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  defaultValue={product?.category_id || ""}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : product
            ? "Update Product"
            : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
