import { Flame } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Foto REAL do produto quando houver. Sem foto, mostra um bloco neutro da
 * marca (nunca uma imagem genérica que não represente o produto).
 */
export function ProductImage({ image, alt, className, imgClassName, eager }: { image?: string; alt: string; className?: string; imgClassName?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = !!image && !failed
  return (
    <div className={cn('relative', className)}>
      {showPhoto ? (
        <img src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={cn('h-full w-full object-cover', imgClassName)} draggable={false} />
      ) : (
        <div className="grid h-full w-full place-items-center bg-[#111]" aria-hidden>
          <Flame className="h-1/3 w-1/3 max-h-16 max-w-16 text-brasa/70" />
        </div>
      )}
    </div>
  )
}
