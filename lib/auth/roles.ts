export type UserRole = "customer" | "admin"

export function isAdminRole(role: string | null | undefined): role is UserRole {
  return role === "admin"
}
