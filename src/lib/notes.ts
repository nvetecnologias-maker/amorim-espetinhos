import type { NotesPreset } from '@/types'

export const NOTE_PRESETS: Record<NotesPreset, string[]> = {
  carne: ['Bem passada', 'Ao ponto', 'Pouco sal'],
  lanche: ['Sem molho especial', 'Molho à parte', 'Sem mussarela'],
  porcao: ['Pouco sal', 'Bem sequinha'],
  bebida: ['Bem gelada', 'Com gelo e limão'],
  nenhum: [],
}
/** Opções que se excluem (ponto da carne). */
export const EXCLUSIVE = [['Bem passada', 'Ao ponto'], ['Sem molho especial', 'Molho à parte']]

/** Presets antigos/desconhecidos caem em "nenhum". */
export const presetFor = (id: string | undefined): string[] => NOTE_PRESETS[(id ?? 'nenhum') as NotesPreset] ?? []

export function toggleNote(list: string[], note: string) {
  if (list.includes(note)) return list.filter((n) => n !== note)
  const group = EXCLUSIVE.find((g) => g.includes(note))
  return [...list.filter((n) => !group?.includes(n)), note]
}
