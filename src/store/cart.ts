import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { uid } from '@/lib/utils'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  open: boolean
  favorites: string[]
  setOpen: (open: boolean) => void
  add: (p: Product, qty?: number, notes?: string[], customNote?: string) => void
  setQty: (lineId: string, qty: number) => void
  remove: (lineId: string) => void
  updateNote: (lineId: string, customNote: string) => void
  toggleNote: (lineId: string, note: string) => void
  clear: () => void
  toggleFavorite: (productId: string) => void
}

const sameLine = (a: CartItem, productId: string, notes: string[], customNote: string) =>
  a.productId === productId && a.customNote.trim() === customNote.trim() && [...a.notes].sort().join('|') === [...notes].sort().join('|')

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      favorites: [],
      setOpen: (open) => set({ open }),
      add: (p, qty = 1, notes = [], customNote = '') =>
        set((s) => {
          const existing = s.items.find((i) => sameLine(i, p.id, notes, customNote))
          if (existing) return { items: s.items.map((i) => (i === existing ? { ...i, qty: i.qty + qty } : i)) }
          return {
            items: [...s.items, { lineId: uid(), productId: p.id, name: p.orderName || p.name, categoryId: p.categoryId, unitPrice: p.price, qty, notes, customNote }],
          }
        }),
      setQty: (lineId, qty) =>
        set((s) => ({ items: qty <= 0 ? s.items.filter((i) => i.lineId !== lineId) : s.items.map((i) => (i.lineId === lineId ? { ...i, qty } : i)) })),
      remove: (lineId) => set((s) => ({ items: s.items.filter((i) => i.lineId !== lineId) })),
      updateNote: (lineId, customNote) => set((s) => ({ items: s.items.map((i) => (i.lineId === lineId ? { ...i, customNote } : i)) })),
      toggleNote: (lineId, note) =>
        set((s) => ({
          items: s.items.map((i) => (i.lineId === lineId ? { ...i, notes: i.notes.includes(note) ? i.notes.filter((n) => n !== note) : [...i.notes, note] } : i)),
        })),
      clear: () => set({ items: [] }),
      toggleFavorite: (id) => set((s) => ({ favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id] })),
    }),
    { name: 'pontodacostela:cart:v1', partialize: (s) => ({ items: s.items, favorites: s.favorites }) },
  ),
)

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0)
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.unitPrice, 0)
