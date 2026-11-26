import { get, list, put } from '@vercel/blob'

/**
 * Armazenamento compartilhado do cardápio e dos pedidos (Vercel Blob, privado).
 * Uma única função com rotas por `?r=`:
 *   GET  ?r=menu            cardápio salvo (ou null → o site usa o cardápio original)
 *   POST ?r=menu            alteração do painel (precisa do PIN)
 *   POST ?r=login           confere o PIN do painel
 *   POST ?r=orders          cliente registra um pedido (público)
 *   GET  ?r=orders          lista de pedidos (precisa do PIN)
 *   PATCH ?r=orders         muda o status de um pedido (precisa do PIN)
 *   GET  ?r=img&p=images/…  foto enviada pelo painel
 */

const PIN = process.env.ADMIN_PIN || '1234'
const MENU = 'menu.json'
const MAX_ORDERS = 200

type Json = Record<string, unknown>
type Item = Json & { id: string; order?: number }
type Menu = { categories: Item[]; products: Item[]; settings: Json }

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } })
const fail = (message: string, status = 400) => json({ error: message }, status)
const route = (req: Request) => new URL(req.url).searchParams.get('r')
const authed = (req: Request) => req.headers.get('x-admin-pin') === PIN

async function readJson<T>(pathname: string): Promise<T | null> {
  const r = await get(pathname, { access: 'private', useCache: false })
  if (!r || !r.stream) return null
  return (await new Response(r.stream).json()) as T
}
const writeJson = (pathname: string, data: unknown) =>
  put(pathname, JSON.stringify(data), { access: 'private', contentType: 'application/json', allowOverwrite: true, addRandomSuffix: false, cacheControlMaxAge: 60 })

async function body<T>(req: Request, limit = 6_000_000): Promise<T> {
  const text = await req.text()
  if (text.length > limit) throw new Error('Dados grandes demais.')
  return JSON.parse(text) as T
}

/** Fotos enviadas pelo painel (data URL) viram arquivos; o cardápio guarda só o endereço. */
async function storeImage(value: unknown): Promise<unknown> {
  if (typeof value !== 'string' || !value.startsWith('data:image/')) return value
  const m = value.match(/^data:(image\/[\w.+-]+);base64,(.+)$/)
  if (!m) return value
  const ext = m[1].split('/')[1].replace('jpeg', 'jpg').replace(/\W/g, '')
  const name = `images/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  await put(name, Buffer.from(m[2], 'base64'), { access: 'private', contentType: m[1], addRandomSuffix: false })
  return `/api/data?r=img&p=${encodeURIComponent(name)}`
}

const upsert = (list: Item[], item: Item) => {
  const i = list.findIndex((x) => x.id === item.id)
  if (i >= 0) list[i] = item
  else list.push(item)
}

async function applyMenuOp(op: string, payload: Json): Promise<void> {
  if (op === 'init') {
    if (!(await readJson<Menu>(MENU))) await writeJson(MENU, payload)
    return
  }
  if (op === 'reset') {
    await writeJson(MENU, payload)
    return
  }
  const m = await readJson<Menu>(MENU)
  if (!m) throw new Error('no-menu')
  switch (op) {
    case 'saveProduct': {
      const p = { ...(payload as Item) }
      p.image = await storeImage(p.image)
      if (!m.products.some((x) => x.id === p.id)) p.order = Math.max(0, ...m.products.map((x) => x.order ?? 0)) + 1
      upsert(m.products, p)
      break
    }
    case 'deleteProduct':
      m.products = m.products.filter((x) => x.id !== payload.id)
      break
    case 'saveProductsOrder': {
      const ids = payload.ids as string[]
      ids.forEach((id, idx) => { const p = m.products.find((x) => x.id === id); if (p) p.order = idx + 1 })
      break
    }
    case 'saveCategory':
      upsert(m.categories, payload as Item)
      break
    case 'deleteCategory':
      if (m.products.some((p) => p.categoryId === payload.id)) throw new Error('Mova ou exclua os produtos desta categoria antes de excluí-la.')
      m.categories = m.categories.filter((c) => c.id !== payload.id)
      break
    case 'saveSettings': {
      const s = { ...payload }
      s.heroImage = await storeImage(s.heroImage)
      m.settings = s
      break
    }
    default:
      throw new Error('Operação desconhecida.')
  }
  await writeJson(MENU, m)
}

export async function GET(req: Request): Promise<Response> {
  try {
    const r = route(req)
    if (r === 'menu') return json({ menu: await readJson<Menu>(MENU) })
    if (r === 'img') {
      const p = new URL(req.url).searchParams.get('p') || ''
      if (!/^images\/[\w.-]+$/.test(p)) return fail('Foto inválida.', 404)
      const img = await get(p, { access: 'private' })
      if (!img || !img.stream) return fail('Foto não encontrada.', 404)
      return new Response(img.stream, { headers: { 'content-type': img.blob.contentType || 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } })
    }
    if (r === 'orders') {
      if (!authed(req)) return fail('PIN inválido.', 401)
      const { blobs } = await list({ prefix: 'orders/', limit: 1000 })
      const recent = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt)).slice(0, MAX_ORDERS)
      const orders = (await Promise.all(recent.map((b) => readJson<Json>(b.pathname).catch(() => null)))).filter(Boolean) as Json[]
      orders.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
      return json({ orders })
    }
    return fail('Rota inválida.', 404)
  } catch (e) {
    return fail((e as Error).message, 500)
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const r = route(req)
    if (r === 'login') {
      const { pin } = await body<{ pin: string }>(req, 1000)
      return pin === PIN ? json({ ok: true }) : fail('PIN incorreto.', 401)
    }
    if (r === 'orders') {
      const order = await body<Json>(req, 200_000)
      const id = String(order.id || '')
      if (!/^[\w-]{4,64}$/.test(id) || !Array.isArray(order.items) || !order.items.length) return fail('Pedido inválido.')
      await put(`orders/${id}.json`, JSON.stringify({ ...order, status: 'novo' }), { access: 'private', contentType: 'application/json', addRandomSuffix: false, allowOverwrite: true })
      return json({ ok: true })
    }
    if (r === 'menu') {
      if (!authed(req)) return fail('PIN inválido.', 401)
      const { op, payload } = await body<{ op: string; payload: Json }>(req)
      await applyMenuOp(op, payload)
      return json({ ok: true })
    }
    return fail('Rota inválida.', 404)
  } catch (e) {
    const msg = (e as Error).message
    return fail(msg, msg === 'no-menu' ? 409 : 500)
  }
}

export async function PATCH(req: Request): Promise<Response> {
  try {
    if (route(req) !== 'orders') return fail('Rota inválida.', 404)
    if (!authed(req)) return fail('PIN inválido.', 401)
    const { id, status } = await body<{ id: string; status: string }>(req, 1000)
    if (!/^[\w-]{4,64}$/.test(id)) return fail('Pedido inválido.')
    const path = `orders/${id}.json`
    const order = await readJson<Json>(path)
    if (!order) return fail('Pedido não encontrado.', 404)
    await writeJson(path, { ...order, status })
    return json({ ok: true })
  } catch (e) {
    return fail((e as Error).message, 500)
  }
}
