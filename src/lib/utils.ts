import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
/** Centavos → "R$ 12,00" */
export const money = (cents: number) => brl.format(cents / 100).replace(/ /g, ' ')

/** "12,50" | "12.5" | "12" → centavos */
export function parseMoney(input: string): number {
  const clean = input.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')
  const n = Number.parseFloat(clean)
  return Number.isFinite(n) ? Math.round(n * 100) : 0
}

export const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const onlyDigits = (s: string) => s.replace(/\D/g, '')

export function formatPhone(raw: string) {
  const d = onlyDigits(raw).slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
