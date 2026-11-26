import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { presetFor } from '@/lib/notes'
import { cn, money } from '@/lib/utils'
import { cartCount, cartSubtotal, useCart } from '@/store/cart'
import { useMenu } from '@/store/menu'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './ui/dialog'
import { Input } from './ui/input'
import { Checkout } from './Checkout'
import { ProductImage } from './ProductImage'

type Step = 'cart' | 'checkout'

export function CartDrawer() {
  const { items, open, setOpen, setQty, remove, updateNote, toggleNote } = useCart()
  const products = useMenu((s) => s.products)
  const categories = useMenu((s) => s.categories)
  const settings = useMenu((s) => s.settings)
  const [step, setStep] = useState<Step>('cart')
  const [editing, setEditing] = useState<string | null>(null)

  const subtotal = cartSubtotal(items)
  const count = cartCount(items)

  const close = (o: boolean) => {
    setOpen(o)
    if (!o) setTimeout(() => setStep('cart'), 300)
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent side="right" className="p-0" hideClose={step !== 'cart'} aria-describedby={undefined}>
        {step === 'checkout' ? (
          <Checkout onBack={() => setStep('cart')} onFinished={() => close(false)} />
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5 pr-16">
              <ShoppingBag className="h-5 w-5 text-brasa" />
              <DialogTitle className="font-display text-3xl font-extrabold uppercase tracking-tight">Meu pedido</DialogTitle>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs font-bold">{count}</span>
            </div>

            {items.length === 0 ? (
              <div className="grid flex-1 place-items-center p-8 text-center">
                <div>
                  <div className="mx-auto mb-5 h-36 w-36 opacity-80"><ProductImage categoryId="assados" alt="" className="h-full w-full" /></div>
                  <p className="font-display text-2xl font-bold uppercase">Seu pedido está vazio</p>
                  <DialogDescription className="mt-2 text-sm text-bege/55">Escolha seus pratos, porções e bebidas no cardápio.</DialogDescription>
                  <Button className="mt-6" onClick={() => { close(false); document.getElementById('cardapio')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    <ArrowLeft /> Ver cardápio
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <ul className="flex-1 divide-y divide-white/5 overflow-y-auto px-5">
                  {items.map((i) => {
                    const p = products.find((x) => x.id === i.productId)
                    const cat = categories.find((c) => c.id === i.categoryId)
                    const presets = presetFor(cat?.notesPreset)
                    return (
                      <li key={i.lineId} className="py-4">
                        <div className="flex gap-3">
                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-profundo">
                            <ProductImage image={p?.image} categoryId={i.categoryId} alt={i.name} className="h-full w-full" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-semibold leading-tight text-bege">{i.name}</p>
                              <button onClick={() => remove(i.lineId)} className="-mr-2 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full text-bege/40 transition hover:bg-queimado/20 hover:text-[#ff8a70]" aria-label={`Remover ${i.name}`}>
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            {(i.notes.length > 0 || i.customNote) && (
                              <p className="mt-0.5 text-xs text-brasa/90">{[...i.notes, i.customNote].filter(Boolean).join(' · ')}</p>
                            )}
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center rounded-full border border-white/10">
                                <button onClick={() => setQty(i.lineId, i.qty - 1)} className="grid h-9 w-9 place-items-center" aria-label="Diminuir"><Minus className="h-3.5 w-3.5" /></button>
                                <span className="w-6 text-center text-sm font-bold tabular-nums">{i.qty}</span>
                                <button onClick={() => setQty(i.lineId, i.qty + 1)} className="grid h-9 w-9 place-items-center" aria-label="Aumentar"><Plus className="h-3.5 w-3.5" /></button>
                              </div>
                              <span className="font-display text-xl font-bold">{money(i.qty * i.unitPrice)}</span>
                            </div>
                            <button onClick={() => setEditing(editing === i.lineId ? null : i.lineId)} className="mt-2 text-xs font-semibold text-bege/50 underline-offset-4 hover:text-bege hover:underline">
                              {editing === i.lineId ? 'Fechar observações' : 'Adicionar observação'}
                            </button>
                            {editing === i.lineId && (
                              <div className="mt-2 space-y-2">
                                <div className="flex flex-wrap gap-1.5">
                                  {presets.map((n) => (
                                    <button key={n} onClick={() => toggleNote(i.lineId, n)} aria-pressed={i.notes.includes(n)}
                                      className={cn('h-8 rounded-full border px-3 text-xs transition', i.notes.includes(n) ? 'border-brasa bg-brasa/15' : 'border-white/10 text-bege/60')}>{n}</button>
                                  ))}
                                </div>
                                <Input value={i.customNote} onChange={(e) => updateNote(i.lineId, e.target.value)} maxLength={140} placeholder="Observação deste item" className="h-10" />
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>

                <div className="pb-safe border-t border-white/10 bg-profundo/60 px-5 pt-4">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-bege/70"><dt>Subtotal</dt><dd className="tabular-nums">{money(subtotal)}</dd></div>
                    <div className="flex justify-between text-bege/70"><dt>Taxa de entrega</dt><dd className="tabular-nums">{settings.deliveryFee === null ? 'A combinar' : money(settings.deliveryFee)}</dd></div>
                    <div className="flex justify-between pt-1 font-display text-2xl font-bold text-bege"><dt className="uppercase">Total</dt><dd className="tabular-nums">{money(subtotal + (settings.deliveryFee ?? 0))}</dd></div>
                  </dl>
                  <p className="mt-1 text-[11px] text-bege/40">{settings.deliveryFee === null ? 'A taxa de entrega é informada pelo WhatsApp. Na retirada no local não há taxa.' : 'Na retirada no local não há taxa de entrega.'}</p>
                  <Button size="lg" className="mt-4 w-full" onClick={() => setStep('checkout')}>
                    Finalizar pedido
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
