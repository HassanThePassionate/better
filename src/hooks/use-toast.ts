"use client"
import { useState, useCallback } from "react"
import type { ToastProps } from "@/components/ui/toast"

type Toast = ToastProps & {
  id: string
}

// const DEFAULT_DURATION = 3000
let count = 0

function genId() {
  return String(count++)
}

type Toaster = {
  toasts: Toast[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (toastId?: string) => void
  update: (toast: Toast) => void
}

function useToaster(): Toaster {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((props: Omit<ToastProps, "id">) => {
    const id = genId()

    setToasts((prev) => [...prev, { id, open: true, ...props }])
  }, [])

  const dismiss = useCallback((toastId?: string) => {
    setToasts((prev) =>
      prev.map((toast) => (toastId === toast.id || toastId === undefined ? { ...toast, open: false } : toast)),
    )

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.open))
    }, 200)
  }, [])

  const update = useCallback((toast: Toast) => {
    setToasts((prev) => prev.map((t) => (t.id === toast.id ? { ...t, ...toast } : t)))
  }, [])

  return {
    toasts,
    toast,
    dismiss,
    update,
  }
}

export { useToaster }
