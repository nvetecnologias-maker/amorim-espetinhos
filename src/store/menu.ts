import { create } from 'zustand'
import { seedMenu } from '@/data/seed'
import { repo } from '@/lib/repo'
import type { MenuData } from '@/types'

interface MenuState extends MenuData {
  ready: boolean
  error: string | null
  reload: () => Promise<void>
}

export const useMenu = create<MenuState>((set) => ({
  ...seedMenu,
  ready: false,
  error: null,
  reload: async () => {
    try {
      const data = await repo.loadMenu()
      set({ ...data, ready: true, error: null })
    } catch (e) {
      set({ ready: true, error: (e as Error).message })
    }
  },
}))

let started = false
/** Carrega o cardápio e passa a ouvir mudanças (painel → cardápio público). */
export function startMenuSync() {
  if (started) return
  started = true
  void useMenu.getState().reload()
  repo.onMenuChange(() => void useMenu.getState().reload())
}

export const sortByOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order
