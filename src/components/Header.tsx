import { Menu, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { cartCount, useCart } from '@/store/cart'
import { Logo } from './Logo'
import { OpenBadge } from './OpenBadge'

export const NAV = [
  { href: '#destaques', label: 'Destaques' },
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#combos', label: 'Combos' },
  { href: '#bebidas', label: 'Bebidas' },
  { href: '#contato', label: 'Contato' },
]

export function Header() {
  const count = useCart((s) => cartCount(s.items))
  const setOpen = useCart((s) => s.setOpen)
  const [scrolled, setScrolled] = useState(false)
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={cn('fixed inset-x-0 top-0 z-40 transition-all duration-500', scrolled ? 'border-b border-white/5 bg-profundo/85 backdrop-blur-xl' : 'bg-gradient-to-b from-black/70 to-transparent')}>
      <div className="container flex h-16 items-center justify-between gap-3 sm:h-20">
        <a href="#topo" className="flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa" aria-label="Amorim Espetinhos — início">
          <Logo className={cn('transition-all duration-500', scrolled ? 'h-10 w-auto sm:h-12' : 'h-11 w-auto sm:h-14')} />
          <span className="flex flex-col font-display uppercase leading-[0.85]">
            <span className="text-[1.45rem] font-extrabold tracking-[0.02em] text-bege sm:text-[1.75rem]">Amorim</span>
            <span className="bg-gradient-to-r from-[#ffb070] via-brasa to-queimado bg-clip-text text-[0.78rem] font-semibold tracking-[0.34em] text-transparent sm:text-[0.92rem]">Espetinhos</span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="group relative rounded-full px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-bege/70 transition hover:text-bege">
              {n.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-px origin-left scale-x-0 bg-brasa transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <OpenBadge className="hidden sm:inline-flex" />
          <button
            onClick={() => setOpen(true)}
            data-cart-target
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-bege backdrop-blur transition hover:border-brasa/60 hover:bg-brasa/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa"
            aria-label={`Abrir carrinho (${count} ${count === 1 ? 'item' : 'itens'})`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gradient-to-br from-brasa to-queimado px-1 text-[11px] font-bold text-white shadow-ember">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMenu((m) => !m)} className="grid h-11 w-11 place-items-center rounded-full text-bege lg:hidden" aria-label="Menu" aria-expanded={menu}>
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="border-t border-white/5 bg-profundo/95 backdrop-blur-xl lg:hidden">
          <nav className="container grid gap-1 py-3" aria-label="Navegação">
            <OpenBadge withHours className="mb-2 w-fit sm:hidden" />
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="rounded-xl px-3 py-3 font-display text-2xl font-bold uppercase tracking-wide text-bege/90 hover:bg-white/5">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
