import { BRAND_LOGO_SRC, BRAND_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

/**
 * Letreiro do Ponto da Costela, como nas artes oficiais do cardápio:
 * linha dupla laranja, "★ PONTO DA ★", "COSTELA" e linha dupla laranja.
 * Tamanho controlado pelo font-size do container (use classes text-*).
 */
export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (BRAND_LOGO_SRC) return <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} className={cn('object-contain', className)} draggable={false} />
  return (
    <span role="img" aria-label={BRAND_NAME} className={cn('inline-flex flex-col items-stretch font-brand uppercase leading-none text-white', className)}>
      {!compact && <span className="rule-double mb-[0.16em] block" style={{ height: '0.2em', backgroundSize: '100% 100%' }} aria-hidden />}
      <span className="flex items-center justify-center gap-[0.22em] text-[0.62em] tracking-[0.01em]">
        <Star /> Ponto da <Star />
      </span>
      <span className="-mt-[0.02em] block text-center text-[1em] tracking-[0.005em]">Costela</span>
      {!compact && <span className="rule-double mt-[0.12em] block" style={{ height: '0.2em' }} aria-hidden />}
    </span>
  )
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-[0.55em] w-[0.55em] fill-current" aria-hidden>
      <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6l-6 3.3 1.3-6.7-5-4.7 6.8-.8z" />
    </svg>
  )
}
