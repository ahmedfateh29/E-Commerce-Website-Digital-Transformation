"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export const STOREFRONT_NAV_START = "storefront-navigation-start"

/** Call when using `router.push` / `router.replace` so the top bar appears (e.g. filter changes). */
export function dispatchStorefrontNavigationStart() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(STOREFRONT_NAV_START))
  }
}

/**
 * Top loading bar for client navigations (links, GET forms, router.push).
 * Pairs with route `loading.tsx` skeletons for full perceived-performance coverage.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)
  const [width, setWidth] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isFirstNavigation = useRef(true)

  const clearRamp = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startRamp = () => {
    clearRamp()
    intervalRef.current = setInterval(() => {
      setWidth((prev) => {
        if (prev >= 88) return prev
        return prev + Math.random() * 14 + 4
      })
    }, 120)
  }

  // Route finished: complete bar then hide (skip initial mount — no flash on first paint)
  useEffect(() => {
    if (isFirstNavigation.current) {
      isFirstNavigation.current = false
      return
    }
    clearRamp()
    setWidth(100)
    const hide = setTimeout(() => {
      setVisible(false)
      setWidth(0)
    }, 280)
    return () => {
      clearTimeout(hide)
      clearRamp()
    }
  }, [pathname, searchParams])

  useEffect(() => {
    const begin = () => {
      setVisible(true)
      setWidth(12)
      startRamp()
    }

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const target = e.target as HTMLElement | null
      const anchor = target?.closest("a")
      if (!anchor?.href) return
      if (anchor.target && anchor.target !== "" && anchor.target !== "_self") return
      if (anchor.hasAttribute("download")) return

      const url = new URL(anchor.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      begin()
    }

    const onSubmit = (e: Event) => {
      const form = e.target as HTMLFormElement | null
      if (!form || form.tagName !== "FORM") return
      const method = (form.getAttribute("method") || "get").toLowerCase()
      if (method !== "get") return

      const actionAttr = form.getAttribute("action")
      const actionUrl = actionAttr
        ? new URL(actionAttr, window.location.href)
        : new URL(window.location.href)
      if (actionUrl.origin !== window.location.origin) return

      begin()
    }

    document.addEventListener("click", onClick, true)
    document.addEventListener("submit", onSubmit, true)
    window.addEventListener(STOREFRONT_NAV_START, begin)
    return () => {
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("submit", onSubmit, true)
      window.removeEventListener(STOREFRONT_NAV_START, begin)
      clearRamp()
    }
  }, [])

  if (!visible && width === 0) return null

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden bg-transparent"
      aria-hidden
    >
      <div
        className="h-full rounded-r-full bg-gradient-to-r from-primary via-primary to-primary/80 shadow-sm transition-[width,opacity] duration-300 ease-out"
        style={{
          width: `${Math.min(width, 100)}%`,
          opacity: width >= 100 ? 0 : 1,
          transitionDuration: width >= 100 ? "400ms" : "220ms",
        }}
      />
    </div>
  )
}
