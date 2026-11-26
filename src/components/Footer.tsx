import gsap from 'gsap'
import { Camera as Instagram, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { hoursSummary } from '@/lib/hours'
import { useMenu } from '@/store/menu'
import { NAV } from './Header'
import { Wordmark } from './Logo'

export function Footer() {
  const s = useMenu((st) => st.settings)
  const root = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-foot="cta"] > span', { yPercent: 100, duration: 1, stagger: 0.1, ease: 'power4.out', scrollTrigger: { trigger: root.current, start: 'top 80%' } })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`
  const ig = s.instagram.replace('@', '').trim()
  const hasAddress = !!(s.address.trim() || s.city.trim())
  const hasHours = s.statusOverride !== 'none'
  return (
    <footer id="contato" ref={root} className="grain relative overflow-hidden border-t border-white/5 bg-[#080808] pb-32 pt-20 lg:pb-12">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[80vw] -translate-x-1/2 -translate-y-1/2 ember-glow opacity-70" aria-hidden />
      <div className="container relative">
        <p data-foot="cta" className="font-display text-[clamp(2.6rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.85] tracking-tight">
          <span className="block overflow-hidden"><span className="block text-bege">Bateu a fome?</span></span>
          <span className="block overflow-hidden"><span className="block bg-gradient-to-r from-[#ffa560] via-brasa to-queimado bg-clip-text font-light text-transparent">Peça pelo WhatsApp.</span></span>
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Wordmark className="text-[3.2rem]" />
            <p className="mt-5 max-w-xs text-sm text-bege/55">Prato feito, costela assada, combos, porções, lanches e bebidas.</p>
            {s.notice && <p className="mt-3 max-w-xs text-sm font-bold text-brasa">{s.notice}</p>}
          </div>
          {(hasAddress || hasHours) && (
            <div>
              {hasAddress && (
                <>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Onde estamos</h3>
                  <p className="mb-7 flex gap-2 text-sm text-bege/75"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bege/40" /><span>{s.address}{s.address && s.city && <br />}{s.city}</span></p>
                </>
              )}
              {hasHours && (
                <>
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Horário</h3>
                  <ul className="space-y-1 text-sm text-bege/75">
                    {hoursSummary(s.hours).map((h) => (
                      <li key={h.days} className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-bege/40" /><span><strong className="font-semibold text-bege">{h.days}</strong> · {h.label}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Delivery e contato</h3>
            <ul className="space-y-3 text-sm">
              <li><a href={`tel:${s.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><Phone className="h-4 w-4 text-bege/40" /> {s.phone}</a></li>
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><MessageCircle className="h-4 w-4 text-bege/40" /> WhatsApp</a></li>
              {ig && <li><a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><Instagram className="h-4 w-4 text-bege/40" /> @{ig}</a></li>}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Navegue</h3>
            <ul className="space-y-2 text-sm">
              {NAV.map((n) => <li key={n.href}><a href={n.href} className="text-bege/75 transition hover:text-bege">{n.label}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-bege/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.storeName}. Todos os direitos reservados.</p>
          <a href="#/admin" className="transition hover:text-bege/70">Área do proprietário</a>
        </div>
      </div>
    </footer>
  )
}
