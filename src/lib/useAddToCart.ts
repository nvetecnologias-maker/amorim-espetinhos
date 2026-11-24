import { useCallback } from 'react'
import { useCart } from '@/store/cart'
import { useToast } from '@/store/toast'
import type { Product } from '@/types'
import { flyToCart } from './fx'

export function useAddToCart() {
  const add = useCart((s) => s.add)
  const push = useToast((s) => s.push)
  return useCallback(
    (p: Product, trigger?: HTMLElement | null, qty = 1, notes: string[] = [], customNote = '') => {
      if (!p.available) return
      add(p, qty, notes, customNote)
      flyToCart(trigger ?? null)
      push(`${qty}x ${p.name} adicionado ao pedido`)
    },
    [add, push],
  )
}
