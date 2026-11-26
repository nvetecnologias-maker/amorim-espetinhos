import { Flame, Sparkles, Heart, Trophy, PiggyBank } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BadgeId } from '@/types'

export const BADGES: Record<BadgeId, { label: string; icon: typeof Flame; cls: string }> = {
  'mais-vendido': { label: 'Mais vendido', icon: Flame, cls: 'bg-brasa text-black' },
  novidade: { label: 'Novidade', icon: Sparkles, cls: 'bg-bege text-profundo' },
  favorito: { label: 'Favorito da casa', icon: Heart, cls: 'bg-white/10 text-bege border border-white/20 backdrop-blur' },
  'mais-pedido': { label: 'Mais pedido', icon: Trophy, cls: 'bg-brasa text-black' },
  economize: { label: 'Economize', icon: PiggyBank, cls: 'bg-[#1f3a1a] text-[#b9f09a] border border-[#b9f09a]/30' },
}

export function ProductBadge({ id, className }: { id: BadgeId; className?: string }) {
  const b = BADGES[id]
  if (!b) return null
  const Icon = b.icon
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] shadow-lg', b.cls, className)}>
      <Icon className="h-3 w-3" />
      {b.label}
    </span>
  )
}
