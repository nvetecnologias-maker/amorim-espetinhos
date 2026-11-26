import { Menu, ShoppingBag, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { cartCount, useCart } from '@/store/cart'
import { Wordmark } from './Logo'
import { OpenBadge } from './OpenBadge'

export const NAV = [
  { href: '#cardapio', label: 'Cardápio' },
  { href: '#combos', label: 'Combos' },
  { href: '#assados', label: 'Assados' },
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
    <header className={cn('fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300', scrolled || menu ? 'border-brasa/40 bg-black/95 backdrop-blur' : 'border-transparent bg-black/60')}>
      <div className="container flex h-16 items-center justify-between gap-3 sm:h-20">
        <a href="#topo" className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa" aria-label="Ponto da Costela — início">
          <Wordmark compact className="text-[1.45rem] sm:text-[1.75rem]" />
        </a>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegação principal">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="group relative px-4 py-2 text-[13px] font-bold uppercase tracking-[0.12em] text-white/75 transition hover:text-white">
              {n.label}
              <span className="absolute inset-x-4 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-brasa transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <OpenBadge className="hidden sm:inline-flex" />
          <button
            onClick={() => setOpen(true)}
            data-cart-target
            className="relative grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition hover:border-brasa hover:bg-brasa hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brasa"
            aria-label={`Abrir carrinho (${count} ${count === 1 ? 'item' : 'itens'})`}
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brasa px-1 text-[11px] font-extrabold text-black">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMenu((m) => !m)} className="grid h-11 w-11 place-items-center rounded-full text-white lg:hidden" aria-label="Menu" aria-expanded={menu}>
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <div className="border-t border-white/10 bg-black lg:hidden">
          <nav className="container grid gap-1 py-3" aria-label="Navegação">
            <OpenBadge withHours className="mb-2 w-fit sm:hidden" />
            {NAV.map((n) => (
              <a key={n.href} href={n.href} onClick={() => setMenu(false)} className="border-b border-white/5 px-1 py-3 text-xl font-extrabold text-white hover:text-brasa">
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
