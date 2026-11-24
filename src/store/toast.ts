import { create } from 'zustand'

interface Toast { id: number; text: string }
export const useToast = create<{ toasts: Toast[]; push: (text: string) => void }>((set) => ({
  toasts: [],
  push: (text) => {
    const id = Date.now() + Math.random()
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, text }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 2400)
  },
}))
