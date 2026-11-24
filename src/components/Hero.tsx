import gsap from 'gsap'
import { ArrowDown, Bike, Clock, CreditCard, ShoppingBag } from 'lucide-react'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useMenu } from '@/store/menu'
import { cartCount, useCart } from '@/store/cart'
import { Button } from './ui/button'
import { Logo } from './Logo'
import { OpenBadge } from './OpenBadge'
import { ProductImage } from './ProductImage'

function Embers({ count = 18 }: { count?: number }) {
  const embers = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: `${(i * 53) % 100}%`,
        delay: `${(i * 0.73) % 8}s`,
        duration: `${7 + ((i * 1.7) % 6)}s`,
        dx: `${((i % 5) - 2) * 30}px`,
        size: 2 + (i % 3),
      })),
    [count],
  )
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {embers.map((e, i) => (
        <span key={i} className="ember" style={{ left: e.left, animationDelay: e.delay, animationDuration: e.duration, width: e.size, height: e.size, ['--dx' as string]: e.dx }} />
      ))}
    </div>
  )
}

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const visual = useRef<HTMLDivElement>(null)
  const settings = useMenu((s) => s.settings)
  const count = useCart((s) => cartCount(s.items))
  const setOpen = useCart((s) => s.setOpen)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        const show = { y: 0, opacity: 1, clearProps: 'transform,opacity' }
        tl.fromTo('[data-hero="logo"]', { y: 20, opacity: 0 }, { ...show, duration: 0.7 })
          .fromTo('[data-hero="badge"]', { y: 16, opacity: 0 }, { ...show, duration: 0.6 }, '-=0.4')
          .fromTo('[data-hero="line"]', { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.09, ease: 'power4.out' }, '-=0.35')
          .fromTo('[data-hero="sub"]', { y: 18, opacity: 0 }, { ...show, duration: 0.7 }, '-=0.5')
          .fromTo('[data-hero="cta"] > *', { y: 18, opacity: 0 }, { ...show, duration: 0.6, stagger: 0.08 }, '-=0.45')
          .fromTo('[data-hero="info"] > *', { y: 10, opacity: 0 }, { ...show, duration: 0.5, stagger: 0.06 }, '-=0.3')
          .fromTo('[data-hero="skewer"]', { x: 160, y: -60, rotate: 18, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0.15)
          .fromTo('[data-hero="ring"]', { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0.1)

        gsap.to('[data-hero="float"]', { y: -14, rotate: 1.5, duration: 3.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
        gsap.to('[data-hero="ring"]', { rotate: 360, duration: 60, ease: 'none', repeat: -1 })
        gsap.to('[data-hero="visual"]', {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        })

        const el = visual.current
        if (!el || !window.matchMedia('(pointer: fine)').matches) return
        const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3' })
        const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3' })
        const onMove = (e: PointerEvent) => {
          xTo((e.clientX / window.innerWidth - 0.5) * 24)
          yTo((e.clientY / window.innerHeight - 0.5) * 18)
        }
        window.addEventListener('pointermove', onMove)
        return () => window.removeEventListener('pointermove', onMove)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const orderNow = () => {
    if (count > 0) setOpen(true)
    else document.getElementById('destaques')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="topo" ref={root} className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-profundo pb-10 pt-20 sm:pt-24">
      {/* luz quente de brasa */}
      <div className="pointer-events-none absolute -right-[20%] top-[5%] -z-10 h-[90vmin] w-[90vmin] ember-glow lg:right-[-6%] lg:top-[8%]" aria-hidden />
      <div className="pointer-events-none absolute -left-40 bottom-[-20%] -z-10 h-[60vmin] w-[60vmin] rounded-full bg-queimado/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-profundo to-transparent" aria-hidden />
      <Embers />

      <div className="container grid items-center gap-2 lg:grid-cols-[1.05fr_1fr] lg:gap-4">
        {/* Espetinho em destaque */}
        <div data-hero="visual" className="relative order-1 mx-auto aspect-square w-[min(76vw,34svh)] lg:order-2 lg:w-full lg:max-w-[640px]">
          <div ref={visual} className="absolute inset-0">
            <div data-hero="ring" className="absolute inset-[4%] rounded-full border border-dashed border-brasa/25" aria-hidden />
            <div className="absolute inset-[14%] rounded-full border border-white/5 bg-[radial-gradient(circle_at_50%_40%,rgba(240,120,50,.22),rgba(20,20,20,.0)_65%)]" aria-hidden />
            <div className="smoke left-[30%] top-[30%] h-24 w-24" style={{ animationDelay: '0s' }} aria-hidden />
            <div className="smoke left-[52%] top-[24%] h-20 w-20" style={{ animationDelay: '2.4s' }} aria-hidden />
            <div className="smoke left-[42%] top-[36%] h-28 w-28" style={{ animationDelay: '4.6s' }} aria-hidden />
            <div data-hero="skewer" className="absolute inset-0">
              <div data-hero="float" className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,.8)]">
                <ProductImage
                  image={settings.heroImage}
                  art="beef"
                  alt="Espetinho de carne bovina dourado na brasa"
                  eager
                  className="h-full w-full"
                  imgClassName={settings.heroImage ? 'rounded-full object-cover' : 'scale-[1.12]'}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="relative order-2 text-center lg:order-1 lg:text-left">
          <div data-hero="logo" className="mb-5 hidden lg:block">
            <Logo className="h-24 w-auto" />
          </div>
          <div data-hero="badge" className="mb-4 flex justify-center lg:justify-start">
            <OpenBadge withHours />
          </div>
          <h1 className="font-display text-[clamp(2.9rem,9.5vw,7.2rem)] font-extrabold uppercase leading-[0.86] tracking-tight text-bege">
            <span className="block overflow-hidden pb-1"><span data-hero="line" className="block">O sabor da</span></span>
            <span className="block overflow-hidden pb-1">
              <span data-hero="line" className="block bg-gradient-to-r from-[#ffb070] via-brasa to-queimado bg-clip-text text-transparent">brasa</span>
            </span>
            <span className="block overflow-hidden pb-1"><span data-hero="line" className="block font-light">em cada espetinho.</span></span>
          </h1>
          <p data-hero="sub" className="mx-auto mt-5 max-w-md text-base leading-relaxed text-bege/70 sm:text-lg lg:mx-0">
            Carnes selecionadas, tempero especial e aquele sabor irresistível de churrasco.
          </p>
          <div data-hero="cta" className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" asChild>
              <a href="#cardapio">
                Ver cardápio <ArrowDown />
              </a>
            </Button>
            <Button size="lg" variant="outline" onClick={orderNow}>
              <ShoppingBag /> Fazer pedido
            </Button>
          </div>
          <ul data-hero="info" className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-bege/55 lg:justify-start">
            <li className="flex items-center gap-2"><Bike className="h-4 w-4 text-brasa" /> Entrega {settings.deliveryEstimate}</li>
            <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-brasa" /> Retirada {settings.pickupEstimate}</li>
            <li className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-brasa" /> Pix, cartão ou dinheiro</li>
          </ul>
        </div>
      </div>
    </section>
  )
}
