import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { RegisterForm } from "./register-form"

export const metadata = {
  title: "Register | Haven",
}

export default async function RegisterPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/")
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  )
}
