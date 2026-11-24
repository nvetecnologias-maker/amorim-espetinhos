import { localRepository } from './local'
import type { Repository } from './types'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Usa Supabase quando as variáveis existem; senão, armazenamento local.
 * O cliente do Supabase só é baixado quando configurado (site mais leve).
 */
export const repo: Repository = url && key ? (await import('./supabase')).createSupabaseRepository(url, key) : localRepository
export type { Repository }
