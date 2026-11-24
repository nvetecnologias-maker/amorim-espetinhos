import type { Order, Settings } from '@/types'
import { money } from './utils'

export const PAYMENT_LABEL = { pix: 'Pix', dinheiro: 'Dinheiro', credito: 'Cartão de crédito', debito: 'Cartão de débito' } as const

export function orderMessage(order: Order, settings: Settings) {
  const L: string[] = []
  L.push(`🔥 *NOVO PEDIDO — ${settings.storeName.toUpperCase()}*`)
  L.push(`Pedido *#${order.code}*`)
  L.push('')
  L.push('*ITENS*')
  for (const i of order.items) {
    L.push(`• ${i.qty}x ${i.name} — ${money(i.qty * i.unitPrice)}`)
    const obs = [...i.notes, i.customNote.trim()].filter(Boolean)
    if (obs.length) L.push(`   _Obs.: ${obs.join('; ')}_`)
  }
  L.push('')
  L.push(`Subtotal: ${money(order.subtotal)}`)
  L.push(`Taxa de entrega: ${order.type === 'entrega' ? money(order.deliveryFee) : 'Retirada (sem taxa)'}`)
  L.push(`*TOTAL: ${money(order.total)}*`)
  L.push('')
  L.push('*CLIENTE*')
  L.push(`${order.customerName} — ${order.customerPhone}`)
  L.push('')
  if (order.type === 'entrega' && order.address) {
    const a = order.address
    L.push('*ENTREGA*')
    L.push(`${a.street}, ${a.number}${a.complement ? ` — ${a.complement}` : ''}`)
    if (a.district) L.push(`Bairro: ${a.district}`)
    if (a.reference) L.push(`Referência: ${a.reference}`)
  } else {
    L.push('*RETIRADA NO LOCAL*')
  }
  L.push('')
  L.push(`*PAGAMENTO:* ${PAYMENT_LABEL[order.payment]}`)
  if (order.payment === 'dinheiro') L.push(order.changeFor ? `Troco para ${money(order.changeFor)} (troco: ${money(order.changeFor - order.total)})` : 'Não precisa de troco')
  if (order.notes.trim()) {
    L.push('')
    L.push(`*OBSERVAÇÕES:* ${order.notes.trim()}`)
  }
  return L.join('\n')
}

export function whatsappLink(phoneDigits: string, text: string) {
  return `https://wa.me/${phoneDigits.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
}
