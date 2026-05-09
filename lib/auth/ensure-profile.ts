import { createServiceRoleClient } from "@/lib/supabase/service-role"

export async function ensureCustomerProfile(userId: string) {
  if (!userId) return

  const service = createServiceRoleClient()
  if (!service) return

  await service.from("profiles").upsert(
    {
      id: userId,
      role: "customer",
    },
    {
      onConflict: "id",
      ignoreDuplicates: true,
    },
  )
}
