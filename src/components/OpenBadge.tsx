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
  return { open: isOpenNow(settings, now), label: todayLabel(settings, now) }
}

export function OpenBadge({ className, withHours }: { className?: string; withHours?: boolean }) {
  const { open, label } = useOpenStatus()
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] backdrop-blur',
        open ? 'border-[#7be08a]/30 bg-[#7be08a]/10 text-[#9cf0a8]' : 'border-queimado/40 bg-queimado/15 text-[#ff9a80]',
        className,
      )}
    >
      <span className="relative flex h-2 w-2">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#7be08a] opacity-70" />}
        <span className={cn('relative inline-flex h-2 w-2 rounded-full', open ? 'bg-[#7be08a]' : 'bg-queimado')} />
      </span>
      {open ? 'Aberto agora' : 'Fechado'}
      {withHours && <span className="hidden font-medium normal-case tracking-normal text-bege/60 sm:inline">· {label}</span>}
    </span>
  )
}
