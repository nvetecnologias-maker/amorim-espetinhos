import { ArrowLeft, ClipboardList, Cog, Layers, Lock, LogOut, UtensilsCrossed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { repo } from '@/lib/repo'
import { CategoriesPanel } from './CategoriesPanel'
import { OrdersPanel } from './OrdersPanel'
import { ProductsPanel } from './ProductsPanel'
import { SettingsPanel } from './SettingsPanel'

/**
 * Painel do proprietário (#/admin).
 * - Modo Supabase: login por e-mail/senha + políticas RLS no banco (seguro).
 * - Modo local: PIN de demonstração, dados no próprio navegador.
 * Toda alteração salva aqui aparece automaticamente no cardápio público.
 */
export default function AdminDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  useEffect(() => {
    repo.getSession().then(setAuthed)
    document.title = 'Painel — Amorim Espetinhos'
    return () => { document.title = 'Amorim Espetinhos — Cardápio Digital' }
  }, [])

  if (authed === null) return null
  if (!authed) return <Login onDone={() => setAuthed(true)} />

  return (
    <div className="min-h-dvh bg-profundo">
      <header className="sticky top-0 z-30 border-b border-white/5 bg-profundo/90 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-auto" />
            <div>
              <p className="font-display text-xl font-bold uppercase leading-none">Painel</p>
              <p className="text-[11px] text-bege/45">{repo.kind === 'supabase' ? 'Conectado ao Supabase' : 'Modo demonstração · dados neste navegador'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild><a href="#"><ArrowLeft /> <span className="hidden sm:inline">Ver cardápio</span></a></Button>
            <Button variant="ghost" size="sm" onClick={async () => { await repo.signOut(); setAuthed(false) }}><LogOut /> <span className="hidden sm:inline">Sair</span></Button>
          </div>
        </div>
      </header>

      <main className="container py-6 sm:py-10">
        <Tabs defaultValue="pedidos">
          <TabsList className="mb-6">
            <TabsTrigger value="pedidos"><ClipboardList className="h-4 w-4" /> Pedidos</TabsTrigger>
            <TabsTrigger value="produtos"><UtensilsCrossed className="h-4 w-4" /> Produtos</TabsTrigger>
            <TabsTrigger value="categorias"><Layers className="h-4 w-4" /> Categorias</TabsTrigger>
            <TabsTrigger value="config"><Cog className="h-4 w-4" /> Configurações</TabsTrigger>
          </TabsList>
          <TabsContent value="pedidos"><OrdersPanel /></TabsContent>
          <TabsContent value="produtos"><ProductsPanel /></TabsContent>
          <TabsContent value="categorias"><CategoriesPanel /></TabsContent>
          <TabsContent value="config"><SettingsPanel /></TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function Login({ onDone }: { onDone: () => void }) {
  const [id, setId] = useState('')
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError('')
    try { await repo.signIn(id, secret); onDone() } catch (err) { setError((err as Error).message) } finally { setBusy(false) }
  }
  return (
    <div className="grain relative grid min-h-dvh place-items-center overflow-hidden bg-profundo p-4">
      <div className="pointer-events-none absolute h-[70vmin] w-[70vmin] ember-glow" aria-hidden />
      <form onSubmit={submit} className="relative w-full max-w-sm rounded-[28px] border border-white/10 bg-carvao/90 p-7 shadow-deep backdrop-blur">
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo className="h-20 w-auto" />
          <h1 className="mt-4 flex items-center gap-2 font-display text-3xl font-extrabold uppercase"><Lock className="h-5 w-5 text-brasa" /> Área do proprietário</h1>
        </div>
        {repo.loginMode === 'email' && (
          <div className="mb-4">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" autoComplete="username" value={id} onChange={(e) => setId(e.target.value)} required />
          </div>
        )}
        <div>
          <Label htmlFor="secret">{repo.loginMode === 'email' ? 'Senha' : 'PIN'}</Label>
          <Input id="secret" type="password" inputMode={repo.loginMode === 'pin' ? 'numeric' : undefined} autoComplete="current-password" value={secret} onChange={(e) => setSecret(e.target.value)} required autoFocus />
        </div>
        {error && <p className="mt-3 text-sm text-[#ff9a80]" role="alert">{error}</p>}
        <Button type="submit" size="lg" className="mt-6 w-full" disabled={busy}>{busy ? 'Entrando…' : 'Entrar'}</Button>
        <p className="mt-4 text-center text-xs leading-relaxed text-bege/45">{repo.loginHint}</p>
        <a href="#" className="mt-4 block text-center text-xs text-bege/50 hover:text-bege">← Voltar ao cardápio</a>
      </form>
    </div>
  )
}
