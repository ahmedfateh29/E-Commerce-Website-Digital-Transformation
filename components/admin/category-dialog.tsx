"use client"

import { useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Category } from "@/lib/types"

interface CategoryDialogProps {
  category?: Category
  children?: ReactNode
}

export function CategoryDialog({ category, children }: CategoryDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(e.currentTarget)
    const supabase = createClient()

    const name = formData.get("name") as string
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    const categoryData = {
      name,
      slug: category?.slug || slug,
      description: formData.get("description") as string,
      image_url: formData.get("imageUrl") as string,
    }

    try {
      if (category) {
        await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", category.id)
      } else {
        await supabase.from("categories").insert(categoryData)
      }

      setOpen(false)
      router.refresh()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          category ? (
            <Button variant="ghost" size="sm">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          ) : (
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={category?.name}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={category?.description || ""}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              defaultValue={category?.image_url || ""}
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : category
                ? "Update"
                : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
