import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Объединяет classnames с разрешением конфликтов Tailwind. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Флаг работы на mock-данных (нет Supabase-ключей или явный VITE_USE_MOCKS). */
export const USE_MOCKS =
  import.meta.env.VITE_USE_MOCKS === 'true' ||
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
