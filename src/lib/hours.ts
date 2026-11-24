import type { DayHours, Settings } from '@/types'

export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

/** Considera expedientes que passam da meia-noite (ex.: 18:00 → 01:00). */
export function isOpenNow(settings: Settings, now = new Date()): boolean {
  if (settings.statusOverride === 'open') return true
  if (settings.statusOverride === 'closed') return false
  const minutes = now.getHours() * 60 + now.getMinutes()
  const today = settings.hours.find((h) => h.day === now.getDay())
  const yesterday = settings.hours.find((h) => h.day === (now.getDay() + 6) % 7)
  const inside = (h: DayHours | undefined, from: number) => {
    if (!h || h.closed) return false
    const o = toMin(h.open), c = toMin(h.close)
    if (c > o) return from === 0 && minutes >= o && minutes < c
    return from === 0 ? minutes >= o : minutes < c
  }
  return inside(today, 0) || inside(yesterday, 1)
}

export function todayLabel(settings: Settings, now = new Date()) {
  const h = settings.hours.find((x) => x.day === now.getDay())
  if (!h || h.closed) return 'Fechado hoje'
  return `Hoje, ${h.open} às ${h.close}`
}

/** Agrupa dias consecutivos com o mesmo horário: "Ter a Dom · 18:00 às 23:30". */
export function hoursSummary(hours: DayHours[]) {
  const order = [1, 2, 3, 4, 5, 6, 0]
  const short = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const groups: { days: number[]; label: string }[] = []
  for (const d of order) {
    const h = hours.find((x) => x.day === d)
    const label = !h || h.closed ? 'Fechado' : `${h.open} às ${h.close}`
    const last = groups[groups.length - 1]
    if (last && last.label === label) last.days.push(d)
    else groups.push({ days: [d], label })
  }
  return groups.map((g) => ({
    days: g.days.length > 1 ? `${short[g.days[0]]} a ${short[g.days[g.days.length - 1]]}` : short[g.days[0]],
    label: g.label,
  }))
}
