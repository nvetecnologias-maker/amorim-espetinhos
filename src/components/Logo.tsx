import { useState } from 'react'
import { BRAND_LOGO_SRC, BRAND_NAME } from '@/lib/brand'
import { cn } from '@/lib/utils'

/**
 * Exibe a logo OFICIAL (arquivo original em public/brand/logo.png) sem cortar
 * nem esticar (object-contain). Enquanto o arquivo não existir, mostra um
 * espaço reservado claramente identificado — não é uma logo.
 */
export function Logo({ className, showName = false }: { className?: string; showName?: boolean }) {
  const [missing, setMissing] = useState(false)
  return (
    <span className="inline-flex items-center gap-3">
      {missing ? (
        <span
          className={cn('grid aspect-square shrink-0 place-items-center rounded-full border border-dashed border-bege/40 bg-white/[0.03] text-center font-sans text-[9px] font-semibold uppercase leading-tight tracking-wider text-bege/50', className)}
          title="Espaço reservado: envie a logo oficial (public/brand/logo.png)"
        >
          logo
        </span>
      ) : (
        <img src={BRAND_LOGO_SRC} alt={BRAND_NAME} onError={() => setMissing(true)} className={cn('shrink-0 object-contain', className)} draggable={false} />
      )}
      {showName && (
        <span className="font-display text-lg font-bold uppercase leading-none tracking-[0.08em] text-bege">
          Amorim <span className="block text-[0.7em] font-medium tracking-[0.32em] text-brasa">Espetinhos</span>
        </span>
      )}
    </span>
  )
}
