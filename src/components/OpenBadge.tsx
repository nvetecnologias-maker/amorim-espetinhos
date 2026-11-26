import { useEffect, useState } from 'react'
import { isOpenNow, todayLabel } from '@/lib/hours'
import { cn } from '@/lib/utils'
import { useMenu } from '@/store/menu'

export function useOpenStatus() {
  const settings = useMenu((s) => s.settings)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])
  return { hidden: settings.statusOverride === 'none', open: isOpenNow(settings, now), label: todayLabel(settings, now) }
}

/** Selo aberto/fechado. Fica oculto enquanto o horário não for cadastrado (status "none"). */
export function OpenBadge({ className, withHours }: { className?: string; withHours?: boolean }) {
  const { hidden, open, label } = useOpenStatus()
  if (hidden) return null
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]',
        open ? 'border-[#7be08a]/40 bg-[#7be08a]/10 text-[#9cf0a8]' : 'border-white/20 bg-white/5 text-white/70',
        className,
      )}
    >
      <span className={cn('inline-flex h-2 w-2 rounded-full', open ? 'bg-[#7be08a]' : 'bg-white/40')} />
      {open ? 'Aberto agora' : 'Fechado'}
      {withHours && <span className="hidden font-semibold normal-case tracking-normal text-white/60 sm:inline">· {label}</span>}
    </span>
  )
}
