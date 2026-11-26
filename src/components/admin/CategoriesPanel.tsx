import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { repo } from '@/lib/repo'
import { sortByOrder, useMenu } from '@/store/menu'
import type { Category } from '@/types'

const LAYOUTS: { value: Category['layout']; label: string }[] = [
  { value: 'grid', label: 'Grade de cards' }, { value: 'large', label: 'Cards grandes' }, { value: 'compact', label: 'Lista compacta' },
  { value: 'drinks', label: 'Bebidas' }, { value: 'combo', label: 'Combos em destaque' },
]
const SECTIONS: { value: Category['section']; label: string }[] = [
  { value: 'cardapio', label: 'Página Cardápio' }, { value: 'bebidas', label: 'Página Bebidas' },
]
const NOTES: { value: Category['notesPreset']; label: string }[] = [
  { value: 'carne', label: 'Obs. de carne (ponto…)' }, { value: 'lanche', label: 'Obs. de lanche (molho…)' }, { value: 'porcao', label: 'Obs. de porção' },
  { value: 'bebida', label: 'Obs. de bebida' }, { value: 'nenhum', label: 'Sem obs. rápidas' },
]

export function CategoriesPanel() {
  const categories = useMenu((s) => s.categories)
  const products = useMenu((s) => s.products)
  const cats = useMemo(() => [...categories].sort(sortByOrder), [categories])
  const [error, setError] = useState('')
  const run = async (fn: () => Promise<void>) => { setError(''); try { await fn() } catch (e) { setError((e as Error).message) } }

  const save = (c: Category, patch: Partial<Category>) => run(() => repo.saveCategory({ ...c, ...patch }))
  const move = (i: number, dir: -1 | 1) => run(async () => {
    const a = cats[i], b = cats[i + dir]
    if (!b) return
    await repo.saveCategory({ ...a, order: b.order })
    await repo.saveCategory({ ...b, order: a.order })
  })
  const add = () => run(() => repo.saveCategory({
    id: `cat-${Date.now().toString(36)}`, name: 'Nova categoria', tagline: '', accent: '#F47A20', layout: 'grid', notesPreset: 'nenhum', section: 'cardapio',
    order: Math.max(0, ...cats.map((c) => c.order)) + 1,
  }))

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-4xl font-extrabold uppercase">Categorias</h2>
          <p className="text-sm text-bege/50">Nome, frase, estilo da seção, página (Cardápio ou Bebidas), observações rápidas e ordem. Categorias vazias ficam ocultas.</p>
        </div>
        <Button onClick={add}><Plus /> Nova categoria</Button>
      </div>
      {error && <p className="mb-4 text-sm text-[#ff9a80]">{error}</p>}
      <ul className="space-y-3">
        {cats.map((c, i) => (
          <li key={c.id} className="grid gap-3 rounded-2xl border border-white/[0.07] bg-carvao p-4 md:grid-cols-[1fr_1.2fr_150px_150px_190px_auto] md:items-center">
            <Input defaultValue={c.name} onBlur={(e) => e.target.value.trim() && e.target.value !== c.name && save(c, { name: e.target.value.trim() })} aria-label="Nome" />
            <Input defaultValue={c.tagline} onBlur={(e) => e.target.value !== c.tagline && save(c, { tagline: e.target.value })} placeholder="Frase da seção" aria-label="Frase" />
            <Select value={c.layout} onChange={(e) => save(c, { layout: e.target.value as Category['layout'] })} aria-label="Estilo">
              {LAYOUTS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
            <Select value={c.section ?? 'cardapio'} onChange={(e) => save(c, { section: e.target.value as Category['section'] })} aria-label="Página">
              {SECTIONS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
            <Select value={c.notesPreset} onChange={(e) => save(c, { notesPreset: e.target.value as Category['notesPreset'] })} aria-label="Observações">
              {NOTES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
            </Select>
            <div className="flex items-center justify-end gap-1">
              <span className="mr-2 text-xs text-bege/40">{products.filter((p) => p.categoryId === c.id).length} itens</span>
              <button onClick={() => move(i, -1)} className="grid h-9 w-9 place-items-center rounded-full text-bege/50 hover:bg-white/10" aria-label="Subir"><ArrowUp className="h-4 w-4" /></button>
              <button onClick={() => move(i, 1)} className="grid h-9 w-9 place-items-center rounded-full text-bege/50 hover:bg-white/10" aria-label="Descer"><ArrowDown className="h-4 w-4" /></button>
              <button onClick={() => confirm(`Excluir a categoria "${c.name}"?`) && run(() => repo.deleteCategory(c.id))} className="grid h-9 w-9 place-items-center rounded-full text-bege/40 hover:bg-queimado/20 hover:text-[#ff8a70]" aria-label="Excluir"><Trash2 className="h-4 w-4" /></button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
