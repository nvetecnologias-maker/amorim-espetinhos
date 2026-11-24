import { ImagePlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { fileToDataUrl } from '@/lib/image'
import { WEEKDAYS } from '@/lib/hours'
import { repo } from '@/lib/repo'
import { money, onlyDigits, parseMoney } from '@/lib/utils'
import { useMenu } from '@/store/menu'
import type { Settings } from '@/types'

export function SettingsPanel() {
  const settings = useMenu((s) => s.settings)
  const [s, setS] = useState<Settings>(settings)
  const [fee, setFee] = useState('')
  const [msg, setMsg] = useState('')
  useEffect(() => { setS(settings); setFee((settings.deliveryFee / 100).toFixed(2).replace('.', ',')) }, [settings])

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((x) => ({ ...x, [k]: v }))
  const setDay = (day: number, patch: Partial<Settings['hours'][number]>) => set('hours', s.hours.map((h) => (h.day === day ? { ...h, ...patch } : h)))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsg('')
    try {
      await repo.saveSettings({ ...s, whatsapp: onlyDigits(s.whatsapp), deliveryFee: parseMoney(fee) })
      setMsg('Configurações salvas. O cardápio já foi atualizado.')
    } catch (err) {
      setMsg((err as Error).message)
    }
  }

  return (
    <form onSubmit={save} className="space-y-8">
      <div>
        <h2 className="font-display text-4xl font-extrabold uppercase">Configurações</h2>
        <p className="text-sm text-bege/50">Contato, entrega, horários e status de funcionamento.</p>
      </div>

      <section className="grid gap-4 rounded-3xl border border-white/[0.07] bg-carvao p-5 md:grid-cols-2">
        <h3 className="font-display text-2xl font-bold uppercase text-brasa md:col-span-2">Espetaria</h3>
        <div><Label>Nome</Label><Input value={s.storeName} onChange={(e) => set('storeName', e.target.value)} /></div>
        <div><Label>WhatsApp que recebe os pedidos (com DDI e DDD)</Label><Input value={s.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="5511999999999" inputMode="tel" /></div>
        <div><Label>Telefone exibido</Label><Input value={s.phone} onChange={(e) => set('phone', e.target.value)} /></div>
        <div><Label>Instagram (sem @)</Label><Input value={s.instagram} onChange={(e) => set('instagram', e.target.value)} /></div>
        <div><Label>Endereço</Label><Input value={s.address} onChange={(e) => set('address', e.target.value)} /></div>
        <div><Label>Cidade / UF</Label><Input value={s.city} onChange={(e) => set('city', e.target.value)} /></div>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/[0.07] bg-carvao p-5 md:grid-cols-3">
        <h3 className="font-display text-2xl font-bold uppercase text-brasa md:col-span-3">Entrega</h3>
        <div><Label>Taxa de entrega (R$)</Label><Input value={fee} onChange={(e) => setFee(e.target.value)} inputMode="decimal" /><p className="mt-1 text-xs text-bege/40">Atual: {money(settings.deliveryFee)}</p></div>
        <div><Label>Tempo de entrega</Label><Input value={s.deliveryEstimate} onChange={(e) => set('deliveryEstimate', e.target.value)} /></div>
        <div><Label>Tempo de retirada</Label><Input value={s.pickupEstimate} onChange={(e) => set('pickupEstimate', e.target.value)} /></div>
      </section>

      <section className="rounded-3xl border border-white/[0.07] bg-carvao p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <h3 className="font-display text-2xl font-bold uppercase text-brasa">Horário de funcionamento</h3>
          <div className="w-full sm:w-64">
            <Label>Status no site</Label>
            <Select value={s.statusOverride} onChange={(e) => set('statusOverride', e.target.value as Settings['statusOverride'])}>
              <option value="auto">Automático (pelo horário)</option>
              <option value="open">Forçar “Aberto agora”</option>
              <option value="closed">Forçar “Fechado”</option>
            </Select>
          </div>
        </div>
        <ul className="divide-y divide-white/5">
          {[1, 2, 3, 4, 5, 6, 0].map((d) => {
            const h = s.hours.find((x) => x.day === d) ?? { day: d, open: '18:00', close: '23:00', closed: true }
            return (
              <li key={d} className="flex flex-wrap items-center gap-3 py-3">
                <span className="w-24 font-semibold">{WEEKDAYS[d]}</span>
                <label className="flex items-center gap-2 text-sm text-bege/60"><Switch checked={!h.closed} onCheckedChange={(v) => setDay(d, { closed: !v })} /> {h.closed ? 'Fechado' : 'Aberto'}</label>
                {!h.closed && (
                  <span className="flex items-center gap-2">
                    <Input type="time" value={h.open} onChange={(e) => setDay(d, { open: e.target.value })} className="h-10 w-32" aria-label="Abre" />
                    <span className="text-bege/40">às</span>
                    <Input type="time" value={h.close} onChange={(e) => setDay(d, { close: e.target.value })} className="h-10 w-32" aria-label="Fecha" />
                  </span>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="grid gap-4 rounded-3xl border border-white/[0.07] bg-carvao p-5 md:grid-cols-[200px_1fr] md:items-center">
        <h3 className="font-display text-2xl font-bold uppercase text-brasa md:col-span-2">Foto do destaque (hero)</h3>
        <div className="aspect-square overflow-hidden rounded-2xl bg-profundo">
          {s.heroImage ? <img src={s.heroImage} alt="" className="h-full w-full object-cover" /> : <p className="grid h-full place-items-center p-4 text-center text-xs text-bege/40">Usando a ilustração do espeto de carne</p>}
        </div>
        <div className="space-y-3">
          <p className="text-sm text-bege/60">Envie uma foto real do espetinho de carne (fundo escuro, luz quente). Ela aparece em destaque na primeira tela.</p>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-white/15 px-5 text-sm font-semibold hover:bg-white/5">
            <ImagePlus className="h-4 w-4" /> Enviar foto
            <input type="file" accept="image/*" className="sr-only" onChange={async (e) => { const f = e.target.files?.[0]; if (f) set('heroImage', await fileToDataUrl(f, 1400)) }} />
          </label>
          {s.heroImage && <Button type="button" variant="ghost" size="sm" onClick={() => set('heroImage', '')}>Remover foto</Button>}
        </div>
      </section>

      <div className="sticky bottom-4 flex flex-wrap items-center justify-end gap-3 rounded-full border border-white/10 bg-carvao/90 p-2 pl-5 backdrop-blur">
        {msg && <p className="mr-auto text-sm text-bege/70" role="status">{msg}</p>}
        {repo.resetDemo && (
          <Button type="button" variant="ghost" size="sm" onClick={async () => { if (confirm('Restaurar o cardápio demonstrativo? Isso substitui produtos e categorias.')) { await repo.resetDemo!(); setMsg('Cardápio demonstrativo restaurado.') } }}>
            Restaurar demonstração
          </Button>
        )}
        <Button type="submit">Salvar configurações</Button>
      </div>
    </form>
  )
}
