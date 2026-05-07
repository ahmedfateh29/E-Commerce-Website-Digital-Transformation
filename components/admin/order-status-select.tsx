"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { updateOrderStatus } from "@/app/admin/orders/actions"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
}

const statuses = [
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
] as const

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: OrderStatusSelectProps) {
  const router = useRouter()
  const [value, setValue] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const [lastError, setLastError] = useState<string | null>(null)

  useEffect(() => {
    setValue(currentStatus)
  }, [currentStatus])

  const handleStatusChange = async (newStatus: string) => {
    const previous = value
    setValue(newStatus)
    setSaving(true)
    setLastError(null)

    const result = await updateOrderStatus(orderId, newStatus)

    setSaving(false)

    if (!result.ok) {
      setValue(previous)
      setLastError(result.message)
      return
    }

    router.refresh()
  }

  return (
    <div className="flex flex-col items-stretch gap-1 sm:items-end">
      <Select
        value={value}
        onValueChange={handleStatusChange}
        disabled={saving}
      >
        <SelectTrigger className="w-[200px]" aria-label="Change order status">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {lastError ? (
        <p className="max-w-[260px] text-xs text-destructive" role="alert">
          {lastError}
        </p>
      ) : null}
    </div>
  )
}
