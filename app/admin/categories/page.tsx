import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CategoryDialog } from "@/components/admin/category-dialog"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"

export const metadata = {
  title: "Categories | Haven Admin",
}

export default async function AdminCategoriesPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase
    .from("categories")
    .select("*, products:products(count)")
    .order("name")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your products into categories
          </p>
        </div>
        <CategoryDialog />
      </div>

      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={category.image_url || "/placeholder.svg"}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell>{category.products?.[0]?.count || 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CategoryDialog category={category} />
                      <DeleteCategoryButton categoryId={category.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center">
                  <p className="text-muted-foreground">No categories yet</p>
                  <CategoryDialog>
                    <Button className="mt-4" variant="outline">
                      Add your first category
                    </Button>
                  </CategoryDialog>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
