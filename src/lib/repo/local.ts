import { seedMenu } from '@/data/seed'
import type { MenuData, Order } from '@/types'
import type { Repository } from './types'

/**
 * Armazenamento local (navegador). Serve para demonstração e testes sem
 * credenciais: as alterações do painel aparecem na hora em todas as abas
 * abertas no MESMO navegador. Para uso real (cliente pedindo do celular e
 * pedido chegando no painel do dono), configure o Supabase — veja README.
 */
const MENU_KEY = 'pontodacostela:menu:v1'
const ORDERS_KEY = 'pontodacostela:orders:v1'
const SESSION_KEY = 'pontodacostela:admin-session'
// PIN de demonstração. Não é segurança real: no modo local tudo roda no navegador.
const DEMO_PIN = import.meta.env.VITE_ADMIN_PIN || '1234'

const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('pontodacostela') : null

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function write(key: string, value: unknown, topic: 'menu' | 'orders') {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    throw new Error('Não foi possível salvar (armazenamento cheio?). Use fotos menores ou configure o Supabase.', { cause: e })
  }
  listeners[topic].forEach((cb) => cb())
  channel?.postMessage(topic)
}

const listeners = { menu: new Set<() => void>(), orders: new Set<() => void>() }
channel?.addEventListener('message', (e) => listeners[e.data as 'menu' | 'orders']?.forEach((cb) => cb()))
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === MENU_KEY) listeners.menu.forEach((cb) => cb())
    if (e.key === ORDERS_KEY) listeners.orders.forEach((cb) => cb())
  })
}

const getMenu = (): MenuData => {
  const m = read<MenuData | null>(MENU_KEY, null)
  if (!m) return structuredClone(seedMenu)
  return { ...m, settings: { ...seedMenu.settings, ...m.settings } }
}
const setMenu = (m: MenuData) => write(MENU_KEY, m, 'menu')

export const localRepository: Repository = {
  kind: 'local',
  loginMode: 'pin',
  loginHint: `Modo demonstração (sem servidor). PIN padrão: ${DEMO_PIN}. Configure o Supabase para um acesso realmente protegido.`,

  async loadMenu() {
    return getMenu()
  },
  onMenuChange(cb) {
    listeners.menu.add(cb)
    return () => listeners.menu.delete(cb)
  },
  async saveProduct(product) {
    const m = getMenu()
    const i = m.products.findIndex((p) => p.id === product.id)
    if (i >= 0) m.products[i] = product
    else m.products.push({ ...product, order: Math.max(0, ...m.products.map((p) => p.order)) + 1 })
    setMenu(m)
  },
  async deleteProduct(id) {
    const m = getMenu()
    m.products = m.products.filter((p) => p.id !== id)
    setMenu(m)
  },
  async saveProductsOrder(ids) {
    const m = getMenu()
    ids.forEach((id, idx) => {
      const p = m.products.find((x) => x.id === id)
      if (p) p.order = idx + 1
    })
    setMenu(m)
  },
  async saveCategory(category) {
    const m = getMenu()
    const i = m.categories.findIndex((c) => c.id === category.id)
    if (i >= 0) m.categories[i] = category
    else m.categories.push(category)
    setMenu(m)
  },
  async deleteCategory(id) {
    const m = getMenu()
    if (m.products.some((p) => p.categoryId === id)) throw new Error('Mova ou exclua os produtos desta categoria antes de excluí-la.')
    m.categories = m.categories.filter((c) => c.id !== id)
    setMenu(m)
  },
  async saveSettings(settings) {
    const m = getMenu()
    m.settings = settings
    setMenu(m)
  },
  async resetDemo() {
    setMenu(structuredClone(seedMenu))
  },

  async createOrder(order) {
    const orders = read<Order[]>(ORDERS_KEY, [])
    orders.unshift(order)
    write(ORDERS_KEY, orders.slice(0, 300), 'orders')
    return order
  },
  async listOrders() {
    return read<Order[]>(ORDERS_KEY, [])
  },
  async updateOrderStatus(id, status) {
    const orders = read<Order[]>(ORDERS_KEY, [])
    const o = orders.find((x) => x.id === id)
    if (o) o.status = status
    write(ORDERS_KEY, orders, 'orders')
  },
  onOrdersChange(cb) {
    listeners.orders.add(cb)
    return () => listeners.orders.delete(cb)
  },

  async getSession() {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  },
  async signIn(_identifier, secret) {
    if (secret !== DEMO_PIN) throw new Error('PIN incorreto.')
    sessionStorage.setItem(SESSION_KEY, '1')
  },
  async signOut() {
    sessionStorage.removeItem(SESSION_KEY)
  },
}
