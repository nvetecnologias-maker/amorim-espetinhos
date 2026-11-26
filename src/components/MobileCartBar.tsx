import { ShoppingBag } from 'lucide-react'
import { money } from '@/lib/utils'
import { cartCount, cartSubtotal, useCart } from '@/store/cart'

/** Botão fixo no celular: "VER MEU PEDIDO — R$ XX,XX". No desktop, botão flutuante. */
export function MobileCartBar() {
  const items = useCart((s) => s.items)
  const setOpen = useCart((s) => s.setOpen)
  const count = cartCount(items)
  if (!count) return null
  return (
    <>
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-profundo via-profundo/90 to-transparent px-4 pt-6 lg:hidden">
        <button
          data-cart-target
          onClick={() => setOpen(true)}
          className="flex h-16 w-full items-center justify-between gap-3 rounded-full bg-gradient-to-r from-queimado to-brasa pl-2 pr-6 text-white shadow-ember transition active:scale-[0.98] animate-in slide-in-from-bottom-6 fade-in"
        >
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-black/25">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bege px-1 text-[11px] font-bold text-profundo">{count}</span>
          </span>
          <span className="text-sm font-bold uppercase tracking-[0.1em]">Ver meu pedido — {money(cartSubtotal(items))}</span>
        </button>
      </div>
      <button
        data-cart-target
        onClick={() => setOpen(true)}
        className="fixed bottom-8 right-8 z-40 hidden h-16 items-center gap-3 rounded-full bg-gradient-to-r from-queimado to-brasa pl-2 pr-6 text-white shadow-ember transition hover:-translate-y-1 lg:flex animate-in slide-in-from-bottom-6 fade-in"
        aria-label="Ver meu pedido"
      >
        <span className="relative grid h-12 w-12 place-items-center rounded-full bg-black/25">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bege px-1 text-[11px] font-bold text-profundo">{count}</span>
        </span>
        <span className="text-sm font-bold uppercase tracking-[0.1em]">{money(cartSubtotal(items))}</span>
      </button>
    </>
  )
}
