import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { ArtKind } from '@/types'
import { FoodArt } from './art/FoodArt'

/** Foto real quando houver; senão, a ilustração do produto. */
export function ProductImage({ image, art, alt, className, imgClassName, eager }: { image?: string; art: ArtKind; alt: string; className?: string; imgClassName?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = !!image && !failed
  return (
    <div className={cn('relative', className)}>
      {showPhoto ? (
        <img src={image} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} className={cn('h-full w-full object-cover', imgClassName)} draggable={false} />
      ) : (
        <FoodArt kind={art} className={cn('h-full w-full', imgClassName)} />
      )}
    </div>
  )
}
