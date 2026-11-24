import type { NotesPreset } from '@/types'

export const NOTE_PRESETS: Record<NotesPreset, string[]> = {
  espeto: ['Sem cebola', 'Bem passado', 'Ao ponto', 'Pouco tempero'],
  porcao: ['Sem cebola', 'Pouco sal', 'Molho à parte'],
  bebida: ['Bem gelada', 'Com gelo e limão'],
  nenhum: [],
}
/** Opções que se excluem (ponto da carne). */
export const EXCLUSIVE = [['Bem passado', 'Ao ponto']]

export function toggleNote(list: string[], note: string) {
  if (list.includes(note)) return list.filter((n) => n !== note)
  const group = EXCLUSIVE.find((g) => g.includes(note))
  return [...list.filter((n) => !group?.includes(n)), note]
}
