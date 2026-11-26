import { Camera as Instagram, Clock, MapPin, MessageCircle, Phone } from 'lucide-react'
import { hoursSummary } from '@/lib/hours'
import { useMenu } from '@/store/menu'
import { NAV } from './Header'
import { Wordmark } from './Logo'

export function Footer() {
  const s = useMenu((st) => st.settings)
  const wa = `https://wa.me/${s.whatsapp.replace(/\D/g, '')}`
  const ig = s.instagram.replace('@', '').trim()
  const hasHours = s.statusOverride !== 'none'
  const hasAddress = !!(s.address.trim() || s.city.trim())

  return (
    <footer id="contato" className="relative border-t-2 border-brasa bg-black pb-32 pt-16 lg:pb-12">
      <div className="container">
        <div className="flex flex-col items-center text-center">
          <Wordmark className="text-[clamp(2.6rem,10vw,4.2rem)]" />
          {s.notice && <p className="mt-8 max-w-lg text-2xl font-extrabold leading-snug text-brasa">{s.notice}</p>}
        </div>

        <div className="mt-14 grid gap-10 border-t border-brasa/40 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-brasa">Delivery</h3>
            <ul className="space-y-3 text-[15px] font-semibold">
              {s.phone && <li><a href={`tel:${s.phone.replace(/\D/g, '')}`} className="flex items-center gap-2 text-white/85 transition hover:text-white"><Phone className="h-4 w-4 text-brasa" /> {s.phone}</a></li>}
              <li><a href={wa} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/85 transition hover:text-white"><MessageCircle className="h-4 w-4 text-brasa" /> Pedir pelo WhatsApp</a></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-brasa">Instagram</h3>
            {ig && <a href={`https://instagram.com/${ig}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[15px] font-semibold text-white/85 transition hover:text-white"><Instagram className="h-4 w-4 text-brasa" /> @{ig}</a>}
            <p className="mt-2 text-sm text-white/50">Siga nossa página no Instagram.</p>
          </div>
          {(hasAddress || hasHours) && (
            <div>
              {hasAddress && (
                <>
                  <h3 className="mb-4 text-lg font-extrabold text-brasa">Onde estamos</h3>
                  <p className="flex gap-2 text-[15px] font-semibold text-white/85"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brasa" /><span>{s.address}{s.address && s.city && <br />}{s.city}</span></p>
                </>
              )}
              {hasHours && (
                <>
                  <h3 className="mb-3 mt-7 text-lg font-extrabold text-brasa first:mt-0">Horário</h3>
                  <ul className="space-y-1 text-sm text-white/80">
                    {hoursSummary(s.hours).map((h) => (
                      <li key={h.days} className="flex gap-2"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-brasa" /><span><strong className="font-bold text-white">{h.days}</strong> · {h.label}</span></li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
          <div>
            <h3 className="mb-4 text-lg font-extrabold text-brasa">Navegue</h3>
            <ul className="space-y-2 text-[15px] font-semibold">
              {NAV.map((n) => <li key={n.href}><a href={n.href} className="text-white/80 transition hover:text-brasa">{n.label}</a></li>)}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} {s.storeName}. Todos os direitos reservados.</p>
          <a href="#/admin" className="transition hover:text-white/70">Área do proprietário</a>
        </div>
      </div>
    </footer>
  )
}
