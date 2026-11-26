import gsap from 'gsap'
import { ArrowDown, Bike, Camera as Instagram, ShoppingBag } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { useMenu } from '@/store/menu'
import { cartCount, useCart } from '@/store/cart'
import { Button } from './ui/button'
import { Wordmark } from './Logo'
import { OpenBadge } from './OpenBadge'

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const settings = useMenu((s) => s.settings)
  const count = useCart((s) => cartCount(s.items))
  const setOpen = useCart((s) => s.setOpen)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const show = { y: 0, opacity: 1, clearProps: 'transform,opacity' }
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .fromTo('[data-hero="mark"]', { y: 24, opacity: 0 }, { ...show, duration: 0.8 })
          .fromTo('[data-hero="item"]', { y: 16, opacity: 0 }, { ...show, duration: 0.6, stagger: 0.08 }, '-=0.45')
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const orderNow = () => {
    if (count > 0) setOpen(true)
    else document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' })
  }
  const ig = settings.instagram.replace('@', '').trim()
  const phone = settings.phone.trim()

  return (
    <section id="topo" ref={root} className="relative isolate overflow-hidden bg-black pb-14 pt-28 sm:pb-20 sm:pt-36">
      {settings.heroImage && (
        <>
          <img src={settings.heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-black" aria-hidden />
        </>
      )}

      <div className="container flex flex-col items-center text-center">
        <div data-hero="mark">
          <Wordmark className="text-[clamp(3.6rem,16vw,8.5rem)]" />
        </div>
        <p data-hero="item" className="mt-4 text-[clamp(2.4rem,9vw,4.5rem)] font-extrabold leading-none text-white">Cardápio</p>

        {settings.slogan && (
          <p data-hero="item" className="mt-5 max-w-md text-base font-semibold leading-relaxed text-white/75 sm:text-lg">{settings.slogan}</p>
        )}

        <div data-hero="item" className="mt-5 flex justify-center"><OpenBadge withHours /></div>

        <div data-hero="item" className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" asChild>
            <a href="#cardapio">Ver cardápio <ArrowDown /></a>
          </Button>
          <Button size="lg" variant="outline" onClick={orderNow}>
            <ShoppingBag /> Fazer pedido
          </Button>
        </div>

        {settings.notice && (
          <p data-hero="item" className="mt-10 max-w-xl text-xl font-extrabold leading-snug text-brasa sm:text-2xl">{settings.notice}</p>
        )}

        <ul data-hero="item" className="mt-8 flex flex-wrap justify-center gap-x-7 gap-y-3 border-t border-brasa/50 pt-6 text-sm font-semibold text-white/80">
          {phone && <li className="flex items-center gap-2"><Bike className="h-4 w-4 text-brasa" /> Delivery {phone}</li>}
          {ig && (
            <li>
              <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 transition hover:text-white">
                <Instagram className="h-4 w-4 text-brasa" /> @{ig}
              </a>
            </li>
          )}
        </ul>
      </div>
    </section>
  )
}
