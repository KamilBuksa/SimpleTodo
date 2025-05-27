declare module 'sonner' {
  import type React from 'react'
  export const Toaster: React.FC<{ position?: string; richColors?: boolean }>
  export const toast: {
    (message: string, options?: Record<string, unknown>): void
    success: (message: string) => void
    error: (message: string) => void
  }
} 