import { seedMenu } from '@/data/seed'
import type { MenuData, Order } from '@/types'
import type { Repository } from './types'

/**
 * Servidor do próprio site (função /api/data na Vercel + Vercel Blob).
 * Pedidos e alterações do painel ficam guardados no servidor, então o pedido
 * feito no celular do cliente aparece no painel do dono em qualquer aparelho.
 */
const API = '/api/data'
const PIN_KEY = 'pontodacostela:admin-pin'
const ORDERS_POLL_MS = 5000
const MENU_POLL_MS = 30000

const pin = () => {
  try { return sessionStorage.getItem(PIN_KEY) || '' } catch { return '' }
}

async function call<T>(route: string, init: RequestInit = {}, admin = false): Promise<T> {
  const headers: Record<string, string> = { 'content-type': 'application/json' }
  if (admin) headers['x-admin-pin'] = pin()
  const res = await fetch(`${API}?r=${route}`, { ...init, headers, cache: 'no-store' })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw Object.assign(new Error(data.error || `Erro ${res.status}`), { status: res.status })
  return data
}

/** Confere se a função do servidor existe (na Vercel, sim; no `vite dev`, não). */
export async function probeApi(): Promise<MenuData | null | false> {
  try {
    const res = await fetch(`${API}?r=menu`, { cache: 'no-store' })
    if (!res.ok || !res.headers.get('content-type')?.includes('application/json')) return false
    const { menu } = (await res.json()) as { menu: MenuData | null }
    return menu
  } catch {
    return false
  }
}

const withSeedSettings = (m: MenuData): MenuData => ({ ...m, settings: { ...seedMenu.settings, ...m.settings } })

export function createApiRepository(first: MenuData | null): Repository {
  let initial: MenuData | null | undefined = first
  let hasMenu = !!first

  const menuOp = async (op: string, payload: unknown) => {
    if (!hasMenu) {
      await call('menu', { method: 'POST', body: JSON.stringify({ op: 'init', payload: seedMenu }) }, true)
      hasMenu = true
    }
    await call('menu', { method: 'POST', body: JSON.stringify({ op, payload }) }, true)
    menuListeners.forEach((cb) => cb())
  }

  const menuListeners = new Set<() => void>()
  const poll = (cb: () => void, ms: number) => {
    const t = setInterval(() => { if (document.visibilityState === 'visible') cb() }, ms)
    const onVis = () => document.visibilityState === 'visible' && cb()
    document.addEventListener('visibilitychange', onVis)
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', onVis) }
  }

  return {
    kind: 'api',
    loginMode: 'pin',
    loginHint: 'Digite o PIN do painel. Os pedidos ficam guardados no servidor e aparecem em qualquer aparelho.',

    async loadMenu() {
      let m: MenuData | null
      if (initial !== undefined) { m = initial; initial = undefined } else m = (await call<{ menu: MenuData | null }>('menu')).menu
      hasMenu = !!m
      return m ? withSeedSettings(m) : structuredClone(seedMenu)
    },
    onMenuChange(cb) {
      menuListeners.add(cb)
      const stop = poll(cb, MENU_POLL_MS)
      return () => { menuListeners.delete(cb); stop() }
    },
    saveProduct: (product) => menuOp('saveProduct', product),
    deleteProduct: (id) => menuOp('deleteProduct', { id }),
    saveProductsOrder: (ids) => menuOp('saveProductsOrder', { ids }),
    saveCategory: (category) => menuOp('saveCategory', category),
    deleteCategory: (id) => menuOp('deleteCategory', { id }),
    saveSettings: (settings) => menuOp('saveSettings', settings),
    async resetDemo() {
      await call('menu', { method: 'POST', body: JSON.stringify({ op: 'reset', payload: seedMenu }) }, true)
      hasMenu = true
      menuListeners.forEach((cb) => cb())
    },

    async createOrder(order) {
      await call('orders', { method: 'POST', body: JSON.stringify(order) })
      return order
    },
    async listOrders() {
      return (await call<{ orders: Order[] }>('orders', {}, true)).orders
    },
    async updateOrderStatus(id, status) {
      await call('orders', { method: 'PATCH', body: JSON.stringify({ id, status }) }, true)
    },
    onOrdersChange(cb) {
      return poll(cb, ORDERS_POLL_MS)
    },

    async getSession() {
      return !!pin()
    },
    async signIn(_identifier, secret) {
      await call('login', { method: 'POST', body: JSON.stringify({ pin: secret }) })
      sessionStorage.setItem(PIN_KEY, secret)
    },
    async signOut() {
      sessionStorage.removeItem(PIN_KEY)
    },
  }
}
