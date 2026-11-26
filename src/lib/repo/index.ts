import { localRepository } from './local'
import type { Repository } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * 1. Supabase, quando as variáveis existem.
 * 2. Servidor do próprio site (/api/data na Vercel), quando responde.
 * 3. Armazenamento local do navegador (ex.: `vite dev` sem servidor).
 */
async function pick(): Promise<Repository> {
  if (url && key) return (await import('./supabase')).createSupabaseRepository(url, key)
  const { probeApi, createApiRepository } = await import('./api')
  const first = await probeApi()
  return first === false ? localRepository : createApiRepository(first)
}

export const repo: Repository = await pick()
export type { Repository }
