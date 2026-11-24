import { CheckCircle2 } from 'lucide-react'
import { useToast } from '@/store/toast'

export function Toaster() {
  const toasts = useToast((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-28 z-[60] flex flex-col items-center gap-2 px-4 lg:bottom-auto lg:top-24" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-carvao/95 px-4 py-2.5 text-sm font-medium text-bege shadow-deep backdrop-blur animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-[#7be08a]" /> {t.text}
        </div>
      ))}
    </div>
  )
}
