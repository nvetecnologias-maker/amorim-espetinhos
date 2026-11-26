import { AlertTriangle, ArrowLeft, Banknote, Bike, CheckCircle2, CreditCard, MessageCircle, QrCode, Store, Wallet } from 'lucide-react'
import { useState } from 'react'
import { repo } from '@/lib/repo'
import { isOpenNow } from '@/lib/hours'
import { orderMessage, PAYMENT_LABEL, whatsappLink } from '@/lib/whatsapp'
import { cn, formatPhone, money, onlyDigits, parseMoney, uid } from '@/lib/utils'
import { cartSubtotal, useCart } from '@/store/cart'
import { useMenu } from '@/store/menu'
import type { Address, Order, OrderType, PaymentMethod } from '@/types'
import { Button } from './ui/button'
import { DialogDescription, DialogTitle } from './ui/dialog'
import { Input, Textarea } from './ui/input'
import { Label } from './ui/label'

const SAVED = 'pontodacostela:customer:v1'
interface Form {
  name: string
  phone: string
  type: OrderType
  address: Address
  payment: PaymentMethod
  needChange: boolean
  changeFor: string
  notes: string
}

function loadSaved(): Partial<Form> {
  try { return JSON.parse(localStorage.getItem(SAVED) || '{}') } catch { return {} }
}

const PAYMENTS: { id: PaymentMethod; icon: typeof QrCode }[] = [
  { id: 'pix', icon: QrCode },
  { id: 'dinheiro', icon: Banknote },
  { id: 'credito', icon: CreditCard },
  { id: 'debito', icon: Wallet },
]

export function Checkout({ onBack, onFinished }: { onBack: () => void; onFinished: () => void }) {
  const { items, clear } = useCart()
  const settings = useMenu((s) => s.settings)
  const saved = loadSaved()
  const [step, setStep] = useState<'form' | 'review' | 'done'>('form')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [placed, setPlaced] = useState<{ order: Order; link: string } | null>(null)
  const [f, setF] = useState<Form>({
    name: saved.name ?? '',
    phone: saved.phone ?? '',
    type: saved.type ?? 'entrega',
    address: saved.address ?? { street: '', number: '', complement: '', district: '', reference: '' },
    payment: 'pix',
    needChange: false,
    changeFor: '',
    notes: '',
  })

  const subtotal = cartSubtotal(items)
  const feePending = f.type === 'entrega' && settings.deliveryFee === null
  const fee = f.type === 'entrega' ? settings.deliveryFee ?? 0 : 0
  const total = subtotal + fee
  const open = isOpenNow(settings)

  const set = <K extends keyof Form>(k: K, v: Form[K]) => setF((s) => ({ ...s, [k]: v }))
  const setAddr = (k: keyof Address, v: string) => setF((s) => ({ ...s, address: { ...s.address, [k]: v } }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (f.name.trim().length < 2) e.name = 'Informe seu nome.'
    if (onlyDigits(f.phone).length < 10) e.phone = 'Informe um telefone com DDD.'
    if (f.type === 'entrega') {
      if (!f.address.street.trim()) e.street = 'Informe a rua.'
      if (!f.address.number.trim()) e.number = 'Informe o número.'
      if (!f.address.district.trim()) e.district = 'Informe o bairro.'
    }
    if (f.payment === 'dinheiro' && f.needChange && parseMoney(f.changeFor) < total) e.changeFor = `O troco deve ser para ${money(total)} ou mais.`
    setErrors(e)
    return !Object.keys(e).length
  }

  const toReview = () => {
    if (!validate()) {
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    try { localStorage.setItem(SAVED, JSON.stringify({ name: f.name, phone: f.phone, type: f.type, address: f.address })) } catch { /* sem armazenamento */ }
    setStep('review')
  }

  const confirm = async () => {
    const order: Order = {
      id: uid(),
      code: Date.now().toString(36).slice(-5).toUpperCase(),
      createdAt: new Date().toISOString(),
      customerName: f.name.trim(),
      customerPhone: f.phone,
      type: f.type,
      address: f.type === 'entrega' ? f.address : null,
      payment: f.payment,
      changeFor: f.payment === 'dinheiro' && f.needChange ? parseMoney(f.changeFor) : null,
      notes: f.notes,
      items,
      subtotal,
      deliveryFee: fee,
      deliveryFeePending: feePending,
      total,
      status: 'novo',
    }
    const link = whatsappLink(settings.whatsapp, orderMessage(order, settings))
    // Abre o WhatsApp ainda dentro do clique (evita bloqueio de pop-up).
    window.open(link, '_blank', 'noopener')
    setSending(true)
    setSendError('')
    try {
      await repo.createOrder(order)
    } catch (e) {
      // O pedido segue pelo WhatsApp mesmo se o registro no painel falhar.
      setSendError((e as Error).message)
    }
    setSending(false)
    setPlaced({ order, link })
    clear()
    setStep('done')
  }

  if (step === 'done' && placed) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-[#7be08a]" />
        <DialogTitle className="mt-5 font-display text-4xl font-extrabold uppercase">Pedido gerado!</DialogTitle>
        <DialogDescription className="mt-2 max-w-xs text-bege/65">
          Pedido <strong className="text-bege">#{placed.order.code}</strong> · {money(placed.order.total)}. Envie a mensagem no WhatsApp para o Ponto da Costela confirmar.
        </DialogDescription>
        {sendError && <p className="mt-3 text-xs text-[#ff9a80]">Não foi possível registrar no painel ({sendError}), mas o pedido segue pelo WhatsApp.</p>}
        <Button size="lg" className="mt-7 w-full max-w-xs bg-none bg-[#25D366] text-profundo hover:bg-[#2fe076]" asChild>
          <a href={placed.link} target="_blank" rel="noopener noreferrer"><MessageCircle /> Enviar pelo WhatsApp</a>
        </Button>
        <Button variant="ghost" className="mt-3" onClick={onFinished}>Voltar ao cardápio</Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/10 px-3 py-4">
        <button onClick={step === 'review' ? () => setStep('form') : onBack} className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10" aria-label="Voltar">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <DialogTitle className="font-display text-3xl font-extrabold uppercase tracking-tight">{step === 'form' ? 'Finalizar pedido' : 'Confira seu pedido'}</DialogTitle>
      </div>
      <DialogDescription className="sr-only">Preencha seus dados para enviar o pedido.</DialogDescription>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {!open && (
          <p className="mb-5 flex gap-2 rounded-2xl border border-queimado/40 bg-queimado/10 p-3 text-sm text-[#ffb09a]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> Estamos fechados agora. Você pode enviar o pedido, e ele será confirmado quando abrirmos.
          </p>
        )}

        {step === 'form' ? (
          <div className="space-y-6">
            <fieldset className="space-y-4">
              <legend className="mb-3 font-display text-xl font-bold uppercase text-brasa">Seus dados</legend>
              <Field label="Nome" error={errors.name}>
                <Input autoComplete="name" value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="Como podemos te chamar?" aria-invalid={!!errors.name} />
              </Field>
              <Field label="Telefone / WhatsApp" error={errors.phone}>
                <Input type="tel" inputMode="tel" autoComplete="tel" value={f.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} placeholder="(00) 00000-0000" aria-invalid={!!errors.phone} />
              </Field>
            </fieldset>

            <fieldset>
              <legend className="mb-3 font-display text-xl font-bold uppercase text-brasa">Entrega ou retirada?</legend>
              <div className="grid grid-cols-2 gap-2">
                {([['entrega', Bike, settings.deliveryEstimate ? `Entrega · ${settings.deliveryEstimate}` : 'Entrega'], ['retirada', Store, settings.pickupEstimate ? `Retirada · ${settings.pickupEstimate}` : 'Retirada no local']] as const).map(([id, Icon, sub]) => (
                  <button key={id} type="button" onClick={() => set('type', id)} aria-pressed={f.type === id}
                    className={cn('flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition', f.type === id ? 'border-brasa bg-brasa/10' : 'border-white/10 hover:border-white/25')}>
                    <Icon className={cn('h-5 w-5', f.type === id ? 'text-brasa' : 'text-bege/50')} />
                    <span className="font-semibold capitalize">{id}</span>
                    <span className="text-[11px] text-bege/50">{sub}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            {f.type === 'entrega' && (
              <fieldset className="space-y-4">
                <legend className="mb-3 font-display text-xl font-bold uppercase text-brasa">Endereço</legend>
                <Field label="Rua / Avenida" error={errors.street}>
                  <Input autoComplete="address-line1" value={f.address.street} onChange={(e) => setAddr('street', e.target.value)} aria-invalid={!!errors.street} />
                </Field>
                <div className="grid grid-cols-[110px_1fr] gap-3">
                  <Field label="Número" error={errors.number}>
                    <Input inputMode="numeric" value={f.address.number} onChange={(e) => setAddr('number', e.target.value)} aria-invalid={!!errors.number} />
                  </Field>
                  <Field label="Complemento">
                    <Input autoComplete="address-line2" value={f.address.complement} onChange={(e) => setAddr('complement', e.target.value)} placeholder="Apto, bloco…" />
                  </Field>
                </div>
                <Field label="Bairro" error={errors.district}>
                  <Input value={f.address.district} onChange={(e) => setAddr('district', e.target.value)} aria-invalid={!!errors.district} />
                </Field>
                <Field label="Ponto de referência">
                  <Input value={f.address.reference} onChange={(e) => setAddr('reference', e.target.value)} placeholder="Opcional" />
                </Field>
              </fieldset>
            )}

            <fieldset>
              <legend className="mb-3 font-display text-xl font-bold uppercase text-brasa">Pagamento</legend>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENTS.map(({ id, icon: Icon }) => (
                  <button key={id} type="button" onClick={() => set('payment', id)} aria-pressed={f.payment === id}
                    className={cn('flex h-14 items-center gap-2 rounded-2xl border px-4 text-sm font-semibold transition', f.payment === id ? 'border-brasa bg-brasa/10' : 'border-white/10 hover:border-white/25')}>
                    <Icon className={cn('h-5 w-5', f.payment === id ? 'text-brasa' : 'text-bege/50')} /> {PAYMENT_LABEL[id]}
                  </button>
                ))}
              </div>
              {f.payment === 'dinheiro' && (
                <div className="mt-4 space-y-3 rounded-2xl border border-white/10 p-4">
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" className="h-5 w-5 accent-[#F47A20]" checked={f.needChange} onChange={(e) => set('needChange', e.target.checked)} />
                    Preciso de troco
                  </label>
                  {f.needChange && (
                    <Field label="Troco para quanto?" error={errors.changeFor}>
                      <Input inputMode="decimal" value={f.changeFor} onChange={(e) => set('changeFor', e.target.value)} placeholder="Ex.: 100,00" aria-invalid={!!errors.changeFor} />
                    </Field>
                  )}
                </div>
              )}
              {f.payment === 'pix' && <p className="mt-2 text-xs text-bege/50">A chave Pix é enviada pelo Ponto da Costela no WhatsApp ao confirmar o pedido.</p>}
            </fieldset>

            <Field label="Observações gerais">
              <Textarea value={f.notes} onChange={(e) => set('notes', e.target.value)} maxLength={300} placeholder="Ex.: interfone com defeito, ligar ao chegar" />
            </Field>
          </div>
        ) : (
          <Review f={f} subtotal={subtotal} fee={fee} feePending={feePending} total={total} />
        )}
      </div>

      <div className="pb-safe border-t border-white/10 px-5 pt-4">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm text-bege/60">Total {f.type === 'retirada' ? '(sem taxa)' : feePending ? '+ entrega (a combinar)' : ''}</span>
          <span className="font-display text-3xl font-bold tabular-nums">{money(total)}</span>
        </div>
        {step === 'form' ? (
          <Button size="lg" className="w-full" onClick={toReview}>Revisar pedido</Button>
        ) : (
          <Button size="lg" className="w-full" onClick={confirm} disabled={sending || !items.length}>
            <MessageCircle /> {sending ? 'Enviando…' : 'Confirmar e enviar'}
          </Button>
        )}
      </div>
    </>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {error && <p className="mt-1 text-xs text-[#ff9a80]" role="alert">{error}</p>}
    </div>
  )
}

function Review({ f, subtotal, fee, feePending, total }: { f: Form; subtotal: number; fee: number; feePending: boolean; total: number }) {
  const items = useCart((s) => s.items)
  const a = f.address
  return (
    <div className="space-y-5 text-sm">
      <section className="rounded-2xl border border-white/10 p-4">
        <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-brasa">Itens</h4>
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.lineId} className="flex justify-between gap-3">
              <span>
                <strong>{i.qty}x</strong> {i.name}
                {(i.notes.length > 0 || i.customNote) && <span className="block text-xs text-bege/50">{[...i.notes, i.customNote].filter(Boolean).join(' · ')}</span>}
              </span>
              <span className="tabular-nums">{money(i.qty * i.unitPrice)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 border-t border-white/10 pt-3 text-bege/70">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>Taxa de entrega</dt><dd>{f.type === 'entrega' ? (feePending ? 'A combinar' : money(fee)) : 'Grátis (retirada)'}</dd></div>
          <div className="flex justify-between text-base font-bold text-bege"><dt>Total{feePending && ' + entrega'}</dt><dd>{money(total)}</dd></div>
        </dl>
      </section>
      <section className="rounded-2xl border border-white/10 p-4">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brasa">Cliente</h4>
        <p>{f.name} · {f.phone}</p>
      </section>
      <section className="rounded-2xl border border-white/10 p-4">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brasa">{f.type === 'entrega' ? 'Entrega' : 'Retirada no local'}</h4>
        {f.type === 'entrega' ? (
          <p>{a.street}, {a.number}{a.complement && ` — ${a.complement}`}<br />{a.district}{a.reference && <><br /><span className="text-bege/55">Ref.: {a.reference}</span></>}</p>
        ) : (
          <p className="text-bege/70">Retire no balcão do Ponto da Costela.</p>
        )}
      </section>
      <section className="rounded-2xl border border-white/10 p-4">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brasa">Pagamento</h4>
        <p>{PAYMENT_LABEL[f.payment]}{f.payment === 'dinheiro' && (f.needChange ? ` · troco para ${money(parseMoney(f.changeFor))}` : ' · sem troco')}</p>
        {f.notes && <p className="mt-2 text-bege/60">Obs.: {f.notes}</p>}
      </section>
      <p className="text-xs text-bege/45">Ao confirmar, o pedido é registrado e o WhatsApp abre com a mensagem pronta para o Ponto da Costela.</p>
    </div>
  )
}
