import { ArrowDown, ArrowUp, ImagePlus, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ProductImage } from '@/components/ProductImage'
import { BADGES } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { Input, Select, Textarea } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { fileToDataUrl } from '@/lib/image'
import { repo } from '@/lib/repo'
import { cn, money, parseMoney, uid } from '@/lib/utils'
import { sortByOrder, useMenu } from '@/store/menu'
import type { BadgeId, Product } from '@/types'

const blank = (categoryId: string): Product => ({
  id: '', categoryId, name: '', titleTop: '', titleBottom: '', description: '', longDescription: '', price: 0, ingredients: [],
  image: '', badges: [], available: true, featured: false, order: 0,
})

export function ProductsPanel() {
  const products = useMenu((s) => s.products)
  const categories = useMenu((s) => s.categories)
  const [filter, setFilter] = useState('todos')
  const [editing, setEditing] = useState<Product | null>(null)
  const [error, setError] = useState('')

  const cats = useMemo(() => [...categories].sort(sortByOrder), [categories])
  const sorted = useMemo(() => [...products].sort(sortByOrder), [products])
  const list = sorted.filter((p) => filter === 'todos' || p.categoryId === filter)

  const run = async (fn: () => Promise<void>) => {
    setError('')
    try { await fn() } catch (e) { setError((e as Error).message) }
  }
  const move = (p: Product, dir: -1 | 1) =>
    run(async () => {
      const ids = sorted.filter((x) => x.categoryId === p.categoryId).map((x) => x.id)
      const i = ids.indexOf(p.id), j = i + dir
      if (j < 0 || j >= ids.length) return
      ;[ids[i], ids[j]] = [ids[j], ids[i]]
      // mantém a ordem global: as outras categorias continuam onde estão
      const all = sorted.map((x) => x.id)
      const slots = all.map((_id, k) => (sorted[k].categoryId === p.categoryId ? k : -1)).filter((k) => k >= 0)
      slots.forEach((k, n) => { all[k] = ids[n] })
      await repo.saveProductsOrder(all)
    })
  const quick = (p: Product, patch: Partial<Product>) => run(() => repo.saveProduct({ ...p, ...patch }))

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-4xl font-extrabold uppercase">Produtos</h2>
          <p className="text-sm text-bege/50">{products.length} produtos · as mudanças aparecem na hora no cardápio.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="h-11 w-auto">
            <option value="todos">Todas as categorias</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Button onClick={() => setEditing(blank(filter !== 'todos' ? filter : cats[0]?.id ?? ''))}><Plus /> Novo produto</Button>
        </div>
      </div>
      {error && <p className="mb-4 text-sm text-[#ff9a80]">{error}</p>}

      <ul className="space-y-2">
        {list.map((p) => {
          const cat = categories.find((c) => c.id === p.categoryId)
          return (
            <li key={p.id} className={cn('flex flex-wrap items-center gap-3 rounded-2xl border border-white/[0.07] bg-carvao p-3 sm:flex-nowrap', !p.available && 'opacity-60')}>
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-profundo"><ProductImage image={p.image} alt="" className="h-full w-full" /></div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="text-xs text-bege/50">
                  <span style={{ color: cat?.accent }}>{cat?.name ?? 'Sem categoria'}</span>
                  {!p.image && ' · sem foto'}
                  {p.badges.map((b) => ` · ${BADGES[b].label}`)}
                </p>
              </div>
              <PriceInput value={p.price} onSave={(price) => quick(p, { price })} />
              <label className="flex items-center gap-2 text-xs text-bege/60" title="Disponível">
                <Switch checked={p.available} onCheckedChange={(available) => quick(p, { available })} aria-label="Disponível" />
                <span className="hidden md:inline">Disponível</span>
              </label>
              <button onClick={() => quick(p, { featured: !p.featured })} className={cn('grid h-9 w-9 place-items-center rounded-full', p.featured ? 'text-brasa' : 'text-bege/30 hover:text-bege')} title="Destaque no carrossel" aria-pressed={p.featured} aria-label="Destaque no carrossel">
                <Star className={cn('h-4 w-4', p.featured && 'fill-current')} />
              </button>
              <div className="flex">
                <button onClick={() => move(p, -1)} className="grid h-9 w-9 place-items-center rounded-full text-bege/50 hover:bg-white/10" aria-label="Subir"><ArrowUp className="h-4 w-4" /></button>
                <button onClick={() => move(p, 1)} className="grid h-9 w-9 place-items-center rounded-full text-bege/50 hover:bg-white/10" aria-label="Descer"><ArrowDown className="h-4 w-4" /></button>
              </div>
              <button onClick={() => setEditing(p)} className="grid h-9 w-9 place-items-center rounded-full text-bege/70 hover:bg-white/10" aria-label="Editar"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => confirm(`Excluir "${p.name}"?`) && run(() => repo.deleteProduct(p.id))} className="grid h-9 w-9 place-items-center rounded-full text-bege/40 hover:bg-queimado/20 hover:text-[#ff8a70]" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button>
            </li>
          )
        })}
      </ul>

      <ProductEditor product={editing} onClose={() => setEditing(null)} />
    </div>
  )
}

function PriceInput({ value, onSave }: { value: number; onSave: (cents: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null)
  const commit = () => {
    if (draft === null) return
    const cents = parseMoney(draft)
    if (cents > 0 && cents !== value) onSave(cents)
    setDraft(null)
  }
  return (
    <label className="relative">
      <span className="sr-only">Preço</span>
      <Input
        value={draft ?? money(value)}
        onFocus={() => setDraft((value / 100).toFixed(2).replace('.', ','))}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === 'Enter' && (e.target as HTMLInputElement).blur()}
        inputMode="decimal"
        className="h-10 w-28 text-right font-semibold"
      />
    </label>
  )
}

function ProductEditor({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const categories = useMenu((s) => s.categories)
  const [p, setP] = useState<Product | null>(null)
  const [price, setPrice] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [last, setLast] = useState<Product | null>(null)
  if (product !== last) {
    setLast(product)
    setP(product)
    setPrice(product ? (product.price / 100).toFixed(2).replace('.', ',') : '')
    setError('')
  }
  if (!p) return <Dialog open={false} />

  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((s) => (s ? { ...s, [k]: v } : s))
  const toggleBadge = (b: BadgeId) => set('badges', p.badges.includes(b) ? p.badges.filter((x) => x !== b) : [...p.badges, b])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!p.name.trim()) return setError('Informe o nome.')
    const cents = parseMoney(price)
    if (cents <= 0) return setError('Informe um preço válido.')
    setSaving(true)
    try {
      await repo.saveProduct({ ...p, id: p.id || `${p.name.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')}-${uid().slice(0, 4)}`, price: cents, name: p.name.trim(), titleBottom: p.titleBottom || p.name.trim() })
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const onFile = async (file?: File) => {
    if (!file) return
    try { set('image', await fileToDataUrl(file)) } catch (e) { setError((e as Error).message) }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-0">
        <form onSubmit={save} className="grid gap-0 sm:grid-cols-[280px_1fr]">
          <div className="space-y-3 border-b border-white/10 p-5 sm:border-b-0 sm:border-r">
            <DialogTitle className="font-display text-3xl font-extrabold uppercase">{p.id ? 'Editar' : 'Novo'} produto</DialogTitle>
            <DialogDescription className="sr-only">Formulário do produto</DialogDescription>
            <div className="aspect-square overflow-hidden rounded-2xl bg-profundo">
              <ProductImage image={p.image} alt="" className="h-full w-full" />
            </div>
            <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-full border border-white/15 text-sm font-semibold hover:bg-white/5">
              <ImagePlus className="h-4 w-4" /> {p.image ? 'Trocar foto' : 'Enviar foto'}
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
            <Input placeholder="…ou cole a URL da foto" value={p.image.startsWith('data:') ? '' : p.image} onChange={(e) => set('image', e.target.value)} />
            {p.image && <button type="button" onClick={() => set('image', '')} className="w-full text-xs text-bege/50 hover:text-bege">Remover foto</button>}
            <p className="text-xs text-bege/45">Use apenas fotos reais do produto. Sem foto, o item aparece só com nome e preço, como no cardápio impresso.</p>
          </div>

          <div className="space-y-4 p-5 sm:max-h-[80vh] sm:overflow-y-auto">
            <div className="grid gap-4 sm:grid-cols-[1fr_140px]">
              <div><Label>Nome</Label><Input value={p.name} onChange={(e) => set('name', e.target.value)} required /></div>
              <div><Label>Preço (R$)</Label><Input inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
            </div>
            <div>
              <Label>Categoria</Label>
              <Select value={p.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><Label>Subtítulo na categoria</Label><Input value={p.group ?? ''} onChange={(e) => set('group', e.target.value)} placeholder="Ex.: Long Neck" /></div>
              <div><Label>Detalhe (gramatura, unidades)</Label><Input value={p.detail ?? ''} onChange={(e) => set('detail', e.target.value)} placeholder="Ex.: 500g in natura" /></div>
              <div className="sm:col-span-2"><Label>Nome no pedido (WhatsApp)</Label><Input value={p.orderName ?? ''} onChange={(e) => set('orderName', e.target.value)} placeholder={`Vazio = "${p.name || 'nome do produto'}"`} /></div>
              <div><Label>Escolha obrigatória · rótulo</Label><Input value={p.optionsLabel ?? ''} onChange={(e) => set('optionsLabel', e.target.value)} placeholder="Ex.: Sabor" /></div>
              <div><Label>Opções (separe por vírgula)</Label><Input value={(p.options ?? []).join(', ')} onChange={(e) => set('options', e.target.value.split(',').map((x) => x.trim()).filter(Boolean))} placeholder="Ex.: Coca-Cola, Guaraná" /></div>
              <div><Label>Título no carrossel · linha fina</Label><Input value={p.titleTop} onChange={(e) => set('titleTop', e.target.value)} /></div>
              <div><Label>Título no carrossel · linha forte</Label><Input value={p.titleBottom} onChange={(e) => set('titleBottom', e.target.value)} /></div>
            </div>
            <div><Label>Descrição curta</Label><Textarea value={p.description} onChange={(e) => set('description', e.target.value)} maxLength={160} /></div>
            <div><Label>Descrição completa</Label><Textarea value={p.longDescription} onChange={(e) => set('longDescription', e.target.value)} className="min-h-[110px]" /></div>
            <div><Label>Ingredientes / composição (separe por vírgula)</Label><Input value={p.ingredients.join(', ')} onChange={(e) => set('ingredients', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} /></div>
            {p.comboItems && (
              <div><Label>Itens do combo (um por linha)</Label><Textarea value={(p.comboItems ?? []).join('\n')} onChange={(e) => set('comboItems', e.target.value.split('\n'))} onBlur={() => set('comboItems', (p.comboItems ?? []).map((s) => s.trim()).filter(Boolean))} /></div>
            )}
            <div>
              <Label>Etiquetas</Label>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(BADGES) as BadgeId[]).map((b) => (
                  <button type="button" key={b} onClick={() => toggleBadge(b)} aria-pressed={p.badges.includes(b)} className={cn('h-9 rounded-full border px-3 text-xs font-semibold', p.badges.includes(b) ? 'border-brasa bg-brasa/15' : 'border-white/10 text-bege/60')}>{BADGES[b].label}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3 text-sm"><Switch checked={p.available} onCheckedChange={(v) => set('available', v)} /> Disponível</label>
              <label className="flex items-center gap-3 text-sm"><Switch checked={p.featured} onCheckedChange={(v) => set('featured', v)} /> Destaque no carrossel (precisa de foto)</label>
            </div>
            {error && <p className="text-sm text-[#ff9a80]" role="alert">{error}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
              <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Salvar produto'}</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
