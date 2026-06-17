/**
 * Travel-времена. В проде — Google Distance Matrix (источник истины).
 * Пока (каркас) — грубая эвристика по координатам, чтобы движок считал.
 * Реальный Distance Matrix подключим на фазе 5 (нужен VITE_GOOGLE_MAPS_API_KEY).
 */
import type { Point, TravelProvider } from '../domain/scheduling-engine'

const cache = new Map<string, number>()

function haversineKm(a: Point, b: Point): number {
  if (a.lat == null || a.lng == null || b.lat == null || b.lng == null) return 0
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const la1 = (a.lat * Math.PI) / 180
  const la2 = (b.lat * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/** Грубая оценка: ~1.6 мин/км (городской трафик DC/MD/VA). */
export const estimateTravel: TravelProvider = (from, to) => {
  const key = `${from.lat},${from.lng}|${to.lat},${to.lng}`
  const hit = cache.get(key)
  if (hit != null) return hit
  const min = Math.round(haversineKm(from, to) * 1.6)
  cache.set(key, min)
  return min
}

// TODO (фаза 5): реальный Google Distance Matrix через VITE_GOOGLE_MAPS_API_KEY,
// с тем же интерфейсом TravelProvider и кэшированием по парам координат.
export const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined
