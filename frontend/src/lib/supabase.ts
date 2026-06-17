import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { USE_MOCKS } from './utils'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * Supabase-клиент. Null, если ключей нет (mock-режим) — сервисы тогда отдают
 * mock-данные, чтобы каркас запускался без подключения к БД.
 */
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null

export function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(
      'Supabase не сконфигурирован. Заполните VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в .env',
    )
  }
  return supabase
}

export { USE_MOCKS }
