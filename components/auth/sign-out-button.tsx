"use client"

import { useTransition } from "react"
import { signOutAction } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"

type SignOutButtonProps = Omit<React.ComponentProps<typeof Button>, "onClick">

export function SignOutButton({
  className,
  variant = "ghost",
  size = "sm",
  children = "Sign out",
  disabled,
  ...props
}: SignOutButtonProps) {
  const [pending, startTransition] = useTransition()

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      disabled={pending || disabled}
      onClick={() => startTransition(() => void signOutAction())}
      {...props}
    >
      {children}
    </Button>
  )
}
