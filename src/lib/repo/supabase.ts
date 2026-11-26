import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { seedMenu } from '@/data/seed'
import type { Category, Order, Product, Settings } from '@/types'
import type { Repository } from './types'

/**
 * Supabase: banco + autenticação + realtime.
 * Tabelas e políticas em `supabase/schema.sql`. Leitura do cardápio é pública;
 * escrita só para usuários autenticados (o proprietário). Clientes anônimos
 * podem apenas INSERIR pedidos.
 */
type Row<T> = { id: string; data: T; position?: number }

export function createSupabaseRepository(url: string, anonKey: string): Repository {
  const sb: SupabaseClient = createClient(url, anonKey)

  const fail = (error: { message: string } | null) => {
    if (error) throw new Error(error.message)
  }

  const sub = (table: string, cb: () => void) => {
    const ch = sb
      .channel(`rt-${table}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => cb())
      .subscribe()
    return () => {
      void sb.removeChannel(ch)
    }
  }

  return {
    kind: 'supabase',
    loginMode: 'email',
    loginHint: 'Entre com o e-mail e a senha do proprietário (cadastrado no Supabase Auth).',

    async loadMenu() {
      const [cats, prods, sets] = await Promise.all([
        sb.from('categories').select('id,data,position').order('position'),
        sb.from('products').select('id,data,position').order('position'),
        sb.from('settings').select('id,data').eq('id', 'store').maybeSingle(),
      ])
      fail(cats.error); fail(prods.error); fail(sets.error)
      const categories = (cats.data as Row<Category>[]).map((r) => ({ ...r.data, id: r.id }))
      const products = (prods.data as Row<Product>[]).map((r) => ({ ...r.data, id: r.id, order: r.position ?? r.data.order }))
      const settings = { ...seedMenu.settings, ...((sets.data as Row<Settings> | null)?.data ?? {}) }
      // Banco vazio: mostra o cardápio original (seed) até o dono cadastrar.
      if (!categories.length && !products.length) return structuredClone({ ...seedMenu, settings })
      return { categories, products, settings }
    },
    onMenuChange(cb) {
      const a = sub('products', cb), b = sub('categories', cb), c = sub('settings', cb)
      return () => { a(); b(); c() }
    },
    async saveProduct(product) {
      fail((await sb.from('products').upsert({ id: product.id, data: product, position: product.order })).error)
    },
    async deleteProduct(id) {
      fail((await sb.from('products').delete().eq('id', id)).error)
    },
    async saveProductsOrder(ids) {
      const { data, error } = await sb.from('products').select('id,data').in('id', ids)
      fail(error)
      const rows = (data as Row<Product>[]).map((r) => {
        const position = ids.indexOf(r.id) + 1
        return { id: r.id, position, data: { ...r.data, order: position } }
      })
      fail((await sb.from('products').upsert(rows)).error)
    },
    async saveCategory(category) {
      fail((await sb.from('categories').upsert({ id: category.id, data: category, position: category.order })).error)
    },
    async deleteCategory(id) {
      fail((await sb.from('categories').delete().eq('id', id)).error)
    },
    async saveSettings(settings) {
      fail((await sb.from('settings').upsert({ id: 'store', data: settings })).error)
    },
    async resetDemo() {
      fail((await sb.from('categories').upsert(seedMenu.categories.map((c) => ({ id: c.id, data: c, position: c.order })))).error)
      fail((await sb.from('products').upsert(seedMenu.products.map((p) => ({ id: p.id, data: p, position: p.order })))).error)
    },

    async createOrder(order) {
      fail((await sb.from('orders').insert({ id: order.id, code: order.code, status: order.status, data: order })).error)
      return order
    },
    async listOrders() {
      const { data, error } = await sb.from('orders').select('id,status,data').order('created_at', { ascending: false }).limit(300)
      fail(error)
      return (data as { id: string; status: Order['status']; data: Order }[]).map((r) => ({ ...r.data, status: r.status }))
    },
    async updateOrderStatus(id, status) {
      fail((await sb.from('orders').update({ status }).eq('id', id)).error)
    },
    onOrdersChange(cb) {
      return sub('orders', cb)
    },

    async getSession() {
      const { data } = await sb.auth.getSession()
      return !!data.session
    },
    async signIn(email, password) {
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new Error('E-mail ou senha inválidos.')
    },
    async signOut() {
      await sb.auth.signOut()
    },
  }
}
