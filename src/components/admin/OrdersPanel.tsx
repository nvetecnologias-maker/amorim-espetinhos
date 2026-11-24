import { MessageCircle, RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { repo } from '@/lib/repo'
import { PAYMENT_LABEL } from '@/lib/whatsapp'
import { cn, money, onlyDigits } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

export const STATUS: Record<OrderStatus, { label: string; cls: string }> = {
  novo: { label: 'Novo', cls: 'bg-brasa text-profundo' },
  preparando: { label: 'Na brasa', cls: 'bg-[#E8952F]/20 text-[#ffc07a]' },
  saiu: { label: 'Saiu p/ entrega', cls: 'bg-[#7FB3C4]/20 text-[#a9dcec]' },
  pronto: { label: 'Pronto p/ retirar', cls: 'bg-[#7FB3C4]/20 text-[#a9dcec]' },
  concluido: { label: 'Concluído', cls: 'bg-[#7be08a]/15 text-[#9cf0a8]' },
  cancelado: { label: 'Cancelado', cls: 'bg-white/10 text-bege/50' },
}
const FLOW: OrderStatus[] = ['novo', 'preparando', 'saiu', 'pronto', 'concluido', 'cancelado']

export function OrdersPanel() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'abertos' | 'todos'>('abertos')
  const [error, setError] = useState('')
  const load = useCallback(() => repo.listOrders().then(setOrders).catch((e) => setError(e.message)), [])
  useEffect(() => {
    load()
    return repo.onOrdersChange(load)
  }, [load])

  const shown = orders.filter((o) => filter === 'todos' || !['concluido', 'cancelado'].includes(o.status))
  const update = async (id: string, status: OrderStatus) => {
    setOrders((l) => l.map((o) => (o.id === id ? { ...o, status } : o)))
    try { await repo.updateOrderStatus(id, status) } catch (e) { setError((e as Error).message); load() }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-4xl font-extrabold uppercase">Pedidos</h2>
          <p className="text-sm text-bege/50">Atualiza sozinho quando chega pedido novo.{repo.kind === 'local' && ' No modo demonstração, só aparecem pedidos feitos neste navegador.'}</p>
        </div>
        <div className="flex gap-2">
          {(['abertos', 'todos'] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? 'light' : 'outline'} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
          <Button size="sm" variant="ghost" onClick={load} aria-label="Atualizar"><RefreshCw /></Button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-[#ff9a80]">{error}</p>}
      {!shown.length && <p className="rounded-3xl border border-dashed border-white/10 py-16 text-center text-bege/45">Nenhum pedido {filter === 'abertos' ? 'em aberto' : 'ainda'}.</p>}

      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((o) => (
          <article key={o.id} className={cn('rounded-3xl border bg-carvao p-5', o.status === 'novo' ? 'border-brasa/60 shadow-ember' : 'border-white/10')}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-display text-2xl font-bold uppercase">#{o.code} · {o.customerName}</p>
                <p className="text-xs text-bege/50">{new Date(o.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })} · {o.type === 'entrega' ? 'Entrega' : 'Retirada'} · {PAYMENT_LABEL[o.payment]}</p>
              </div>
              <span className={cn('rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider', STATUS[o.status].cls)}>{STATUS[o.status].label}</span>
            </div>
            <ul className="mt-4 space-y-1 text-sm">
              {o.items.map((i) => (
                <li key={i.lineId} className="flex justify-between gap-3">
                  <span><strong>{i.qty}x</strong> {i.name}{(i.notes.length > 0 || i.customNote) && <span className="block text-xs text-brasa/90">{[...i.notes, i.customNote].filter(Boolean).join(' · ')}</span>}</span>
                  <span className="tabular-nums text-bege/70">{money(i.qty * i.unitPrice)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm text-bege/70">
              {o.address && <p>{o.address.street}, {o.address.number}{o.address.complement && ` — ${o.address.complement}`} · {o.address.district}{o.address.reference && ` · Ref.: ${o.address.reference}`}</p>}
              {o.changeFor && <p>Troco para {money(o.changeFor)}</p>}
              {o.notes && <p>Obs.: {o.notes}</p>}
              <p className="font-display text-2xl font-bold text-bege">Total {money(o.total)}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {FLOW.filter((s) => s !== o.status && !(o.type === 'entrega' && s === 'pronto') && !(o.type === 'retirada' && s === 'saiu')).map((s) => (
                <button key={s} onClick={() => update(o.id, s)} className="h-9 rounded-full border border-white/10 px-3 text-xs font-semibold text-bege/70 transition hover:border-brasa hover:text-bege">{STATUS[s].label}</button>
              ))}
              <a href={`https://wa.me/55${onlyDigits(o.customerPhone)}`} target="_blank" rel="noopener noreferrer" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#25D366]/15 px-3 text-xs font-semibold text-[#7cf0a8]"><MessageCircle className="h-3.5 w-3.5" /> Cliente</a>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
