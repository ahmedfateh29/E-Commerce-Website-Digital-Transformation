"use server"

import { revalidatePath } from "next/cache"
import { createServiceRoleClient } from "@/lib/supabase/service-role"

const ALLOWED_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const

export type UpdateOrderStatusResult =
  | { ok: true }
  | { ok: false; message: string }

export async function updateOrderStatus(
  orderId: string,
  status: string,
): Promise<UpdateOrderStatusResult> {
  if (!orderId) {
    return { ok: false, message: "Missing order id" }
  }

  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return { ok: false, message: "Invalid status" }
  }

  const supabase = createServiceRoleClient()
  if (!supabase) {
    return {
      ok: false,
      message:
        "Missing SUPABASE_SERVICE_ROLE_KEY on the server. Add it in .env (see Supabase Dashboard → Settings → API → service_role).",
    }
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select("id")

  if (error) {
    return { ok: false, message: error.message }
  }

  if (!data?.length) {
    return { ok: false, message: "No order was updated (check order id)" }
  }

  revalidatePath("/admin")
  revalidatePath("/admin/orders")
  revalidatePath(`/admin/orders/${orderId}`)

  return { ok: true }
}
