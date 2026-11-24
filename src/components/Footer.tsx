import gsap from 'gsap'
import { Camera as Instagram, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { useLayoutEffect, useRef } from 'react'
import { PHOTO_CREDITS } from '@/data/photoCredits'
import { hoursSummary } from '@/lib/hours'
import { useMenu } from '@/store/menu'
import { NAV } from './Header'
import { Logo } from './Logo'

export function Footer() {
  const s = useMenu((st) => st.settings)
  const products = useMenu((st) => st.products)
  // Só lista créditos das fotos de banco que ainda estão em uso no cardápio.
  const credits = PHOTO_CREDITS.flatMap((c) => {
    const used = products.filter((pr) => pr.image === c.file)
    const hero = s.heroImage === c.file || (c.file.endsWith('/carne-bovina.webp') && s.heroImage.endsWith('/hero.webp'))
    return used.length || hero ? [{ ...c, label: used.map((u) => u.name).join(', ') || 'Destaque' }] : []
  })
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
  return (
    <footer id="contato" ref={root} className="grain relative overflow-hidden border-t border-white/5 bg-[#080808] pb-32 pt-20 lg:pb-12">
      <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-[80vw] -translate-x-1/2 -translate-y-1/2 ember-glow opacity-70" aria-hidden />
      <div className="container relative">
        <p data-foot="cta" className="font-display text-[clamp(2.6rem,9vw,7.5rem)] font-extrabold uppercase leading-[0.85] tracking-tight">
          <span className="block overflow-hidden"><span className="block text-bege">Acenda a fome.</span></span>
          <span className="block overflow-hidden"><span className="block bg-gradient-to-r from-[#ffb070] via-brasa to-queimado bg-clip-text font-light text-transparent">A gente cuida da brasa.</span></span>
        </p>

        <div className="mt-16 grid gap-12 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <Logo className="h-28 w-auto sm:h-32" />
            <p className="mt-5 font-display text-2xl font-bold uppercase tracking-wide">{s.storeName}</p>
            <p className="mt-1 max-w-xs text-sm text-bege/55">Espetinhos na brasa, acompanhamentos, porções e combos.</p>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Onde estamos</h3>
            <p className="flex gap-2 text-sm text-bege/75"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bege/40" /><span>{s.address}<br />{s.city}</span></p>
            <h3 className="mb-3 mt-7 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Horário</h3>
            <ul className="space-y-1 text-sm text-bege/75">
              {hoursSummary(s.hours).map((h) => (
                <li key={h.days} className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-bege/40" /><span><strong className="font-semibold text-bege">{h.days}</strong> · {h.label}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brasa">Contato</h3>
            <ul className="space-y-3 text-sm">
              <li><a href={`tel:${s.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><Phone className="h-4 w-4 text-bege/40" /> {s.phone}</a></li>
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><MessageCircle className="h-4 w-4 text-bege/40" /> WhatsApp</a></li>
              <li><a href={`https://instagram.com/${s.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-bege/75 transition hover:text-bege"><Instagram className="h-4 w-4 text-bege/40" /> @{s.instagram.replace('@', '')}</a></li>
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
        {credits.length > 0 && (
          <details className="mt-6 text-[11px] leading-relaxed text-bege/35">
            <summary className="cursor-pointer select-none transition hover:text-bege/60">Créditos das fotos</summary>
            <p className="mt-3">Fotos ilustrativas de banco de imagens (Unsplash e Wikimedia Commons). Podem ser trocadas por fotos próprias no painel.</p>
            <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {credits.map((c) => (
                <li key={c.file} className="min-w-0 truncate">
                  {c.label}:{' '}
                  <a href={c.page} target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-bege/70">
                    {c.artist ? `${c.artist}, ${c.source}` : c.source}
                  </a>
                  {c.license && <> · <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.pt-br" target="_blank" rel="noopener noreferrer" className="underline decoration-white/20 underline-offset-2 hover:text-bege/70">{c.license}</a></>}
                </li>
              ))}
            </ul>
          </details>
        )}
      </div>
    </footer>
  )
}
