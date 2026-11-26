import { Check, Minus, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { presetFor, toggleNote } from '@/lib/notes'
import { useAddToCart } from '@/lib/useAddToCart'
import { cn, money } from '@/lib/utils'
import { useMenu } from '@/store/menu'
import type { Product } from '@/types'
import { ProductBadge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Textarea } from './ui/input'

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const category = useMenu((s) => s.categories.find((c) => c.id === product?.categoryId))
  const addToCart = useAddToCart()
  const [qty, setQty] = useState(1)
  const [notes, setNotes] = useState<string[]>([])
  const [custom, setCustom] = useState('')
  const [choice, setChoice] = useState('')
  const [missingChoice, setMissingChoice] = useState(false)

  useEffect(() => {
    if (product) { setQty(1); setNotes([]); setCustom(''); setChoice(product.options?.length === 1 ? product.options[0] : ''); setMissingChoice(false) }
  }, [product])

  const presets = presetFor(category?.notesPreset)
  const options = product?.options ?? []
  const optionsLabel = product?.optionsLabel || 'Opção'

  const add = (el: HTMLElement) => {
    if (!product) return
    if (options.length && !choice) { setMissingChoice(true); return }
    const chosen = options.length ? [options.length > 1 ? `${optionsLabel}: ${choice}` : choice] : []
    addToCart(product, el, qty, [...chosen, ...notes], custom.trim())
    onClose()
  }

  return (
    <Dialog open={!!product} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn('p-0 sm:max-h-[90vh] sm:overflow-hidden', product?.image ? '' : 'sm:max-w-lg')}>
        {product && (
          <div className={cn('grid grid-cols-[minmax(0,1fr)]', product.image && 'sm:grid-cols-2')}>
            {product.image && (
              <div className="relative aspect-[4/3] overflow-hidden bg-black sm:aspect-auto sm:h-full sm:min-h-[480px]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="flex min-w-0 flex-col sm:max-h-[90vh] sm:overflow-y-auto">
              <div className="flex-1 p-6 sm:p-8">
                <span className="text-sm font-extrabold text-brasa">{category?.name}{product.group ? ` · ${product.group}` : ''}</span>
                <DialogTitle className="mt-1 pr-10 text-3xl font-extrabold leading-tight text-white sm:text-4xl">{product.name}</DialogTitle>
                {product.detail && <p className="mt-1 text-sm font-bold text-white/70">({product.detail})</p>}
                <div className="mt-4 h-px bg-brasa/70" aria-hidden />
                <DialogDescription className={cn('mt-4 text-[15px] font-semibold leading-relaxed text-white/75', !(product.longDescription || product.description) && 'sr-only')}>
                  {product.longDescription || product.description || product.name}
                </DialogDescription>
                {product.badges.length > 0 && <div className="mt-3 flex flex-wrap gap-1.5">{product.badges.map((b) => <ProductBadge key={b} id={b} />)}</div>}

                {product.comboItems && product.comboItems.length > 0 && (
                  <ul className="mt-5 space-y-2">
                    {product.comboItems.map((i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/85"><Check className="h-4 w-4 text-brasa" /> {i}</li>
                    ))}
                  </ul>
                )}

                <p className="mt-5 text-4xl font-extrabold text-white">{money(product.price)}</p>

                {options.length > 1 && (
                  <fieldset className="mt-6">
                    <legend className={cn('mb-2 text-xs font-bold uppercase tracking-[0.12em]', missingChoice ? 'text-red-300' : 'text-white/60')}>
                      {optionsLabel} <span className="normal-case tracking-normal">(obrigatório)</span>
                    </legend>
                    <div className="flex flex-wrap gap-2" role="radiogroup">
                      {options.map((o) => {
                        const on = choice === o
                        return (
                          <button key={o} type="button" role="radio" aria-checked={on} onClick={() => { setChoice(o); setMissingChoice(false) }}
                            className={cn('inline-flex h-10 items-center gap-1.5 rounded-full border-2 px-4 text-sm font-bold transition active:scale-95', on ? 'border-brasa bg-brasa text-black' : 'border-white/15 text-white/80 hover:border-white/40')}>
                            {on && <Check className="h-4 w-4" />}{o}
                          </button>
                        )
                      })}
                    </div>
                    {missingChoice && <p className="mt-2 text-sm font-semibold text-red-300">Escolha {optionsLabel.toLowerCase()} para adicionar.</p>}
                  </fieldset>
                )}

                {presets.length > 0 && (
                  <fieldset className="mt-6">
                    <legend className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-white/60">Observações</legend>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((n) => {
                        const on = notes.includes(n)
                        return (
                          <button key={n} type="button" aria-pressed={on} onClick={() => setNotes((l) => toggleNote(l, n))}
                            className={cn('inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition active:scale-95', on ? 'border-brasa bg-brasa/15 text-white' : 'border-white/15 text-white/75 hover:border-white/35')}>
                            {on && <Check className="h-4 w-4 text-brasa" />}{n}
                          </button>
                        )
                      })}
                    </div>
                  </fieldset>
                )}
                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-white/60">Observação personalizada</span>
                  <Textarea value={custom} onChange={(e) => setCustom(e.target.value)} maxLength={140} placeholder={category?.notesPreset === 'bebida' ? 'Ex.: marca ou sabor' : 'Ex.: sem vinagrete'} />
                </label>
              </div>

              <div className="pb-safe sticky bottom-0 flex items-center gap-3 border-t border-white/10 bg-carvao/95 p-4 backdrop-blur sm:p-6">
                <div className="flex items-center rounded-full border border-white/20">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-white disabled:opacity-30" disabled={qty <= 1} aria-label="Diminuir quantidade"><Minus className="h-4 w-4" /></button>
                  <span className="w-8 text-center text-lg font-bold tabular-nums" aria-live="polite">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-12 w-12 place-items-center text-white" aria-label="Aumentar quantidade"><Plus className="h-4 w-4" /></button>
                </div>
                <Button className="h-12 min-w-0 flex-1 text-xs uppercase tracking-[0.08em] sm:text-sm" disabled={!product.available} onClick={(e) => add(e.currentTarget)}>
                  {product.available ? <><span className="hidden min-[400px]:inline">Adicionar ·</span><span className="min-[400px]:hidden">Adicionar</span> {money(product.price * qty)}</> : 'Indisponível'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
