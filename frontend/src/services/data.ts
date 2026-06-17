/**
 * Data-layer: единый доступ к задачам/справочникам. Если Supabase не настроен —
 * отдаёт mock-данные (каркас работает офлайн). Реальные запросы добавляются
 * позже без изменения UI (фаза 2).
 */
import { supabase } from '../lib/supabase'
import { USE_MOCKS } from '../lib/utils'
import * as mock from './mockData'
import type { Project, ScheduleRun, Skill, Task, Team, TeamAvailability } from '../domain/types'

export async function fetchTasks(status?: Task['status']): Promise<Task[]> {
  if (USE_MOCKS || !supabase) {
    return status ? mock.mockTasks.filter((t) => t.status === status) : mock.mockTasks
  }
  let q = supabase
    .from('tasks')
    .select('*, projects(name,address,project_manager,latitude,longitude), teams(name)')
    .order('stop_number', { ascending: true })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) throw error
  // если RLS не пустил строки (не залогинен) — показываем демо, чтобы был виден дизайн
  if (!data || data.length === 0) {
    return status ? mock.mockTasks.filter((t) => t.status === status) : mock.mockTasks
  }
  return data.map(mapDbTask)
}

/** Маппинг реальной строки tasks → доменный Task (по подтверждённой схеме БД). */
function mapDbTask(r: Record<string, any>): Task {
  const st = r.scheduled_time ?? null // jsonb {start,end,anchor,anchor_time}
  const isAnchor = st?.anchor === true || st?.type === 'exact'
  const proj = r.projects ?? null
  const stop = r.additional_stop
    ? { ...r.additional_stop, duration_min: r.additional_stop.duration_min ?? r.additional_stop_duration ?? 30 }
    : null
  return {
    id: r.id,
    status: r.status ?? 'requested',
    task_type: r.task_type ?? 'Project task',
    project_id: r.project_id ?? null,
    project_name: proj?.name,
    title: r.title,
    description: r.description ?? r.title ?? '',
    scheduled_date: r.scheduled_date ?? '',
    time_type: isAnchor ? 'exact' : st?.start ? 'timeframe' : null,
    exact_time: isAnchor ? st?.anchor_time || st?.start || null : null,
    timeframe_start: !isAnchor ? st?.start ?? null : null,
    timeframe_end: !isAnchor ? st?.end ?? null : null,
    estimated_duration_min: Math.round((Number(r.estimated_duration) || 0) * 60), // часы → минуты
    task_address: r.address ?? proj?.address ?? '',
    lat: proj?.latitude ?? null,
    lng: proj?.longitude ?? null,
    project_manager: r.project_manager ?? proj?.project_manager ?? '',
    assigned_team_id: r.team_id ?? null,
    assigned_team_name: r.teams?.name,
    priority: r.priority ?? 5,
    required_skill_ids: r.skill_requirements ?? r.required_skills ?? [],
    schedule_prompt: r.schedule_prompt ?? null,
    additional_stop: stop,
    stop_number: r.stop_number ?? null,
    request_task_id: r.request_task_id ?? null,
    sched_start: st?.start ?? null,
    sched_end: st?.end ?? null,
    travel_time: r.travel_time ?? null,
    anchor: isAnchor,
    anchor_time: st?.anchor_time || (isAnchor ? st?.start : '') || '',
  }
}

export async function fetchTeams(): Promise<Team[]> {
  if (USE_MOCKS || !supabase) return mock.mockTeams
  const { data, error } = await supabase.from('teams').select('*')
  if (error) throw error
  // реальные колонки: address, slack_id; skills связаны отдельно (см. skills.description)
  return (data ?? []).map((r): Team => ({
    id: r.id, airtable_id: r.airtable_id, name: r.name,
    home_address: r.address ?? '', lat: r.latitude, lng: r.longitude,
    slack_user_id: r.slack_id, skills: [],
  }))
}

export async function fetchProjects(): Promise<Project[]> {
  if (USE_MOCKS || !supabase) return mock.mockProjects
  const { data, error } = await supabase.from('projects').select('*')
  if (error) throw error
  return (data ?? []).map((r): Project => ({
    id: r.id, airtable_id: r.airtable_id, name: r.name, address: r.address ?? '',
    lat: r.latitude, lng: r.longitude, project_manager: r.project_manager ?? '',
  }))
}

/** "Available teams: recAAA, recBBB" в skills.description → airtable_id команд. */
function parseAvailableTeams(description: string | null): string[] {
  if (!description) return []
  const m = /Available teams:\s*(.+)/i.exec(description)
  if (!m) return []
  return m[1].split(',').map((s) => s.trim()).filter(Boolean)
}

export async function fetchSkills(): Promise<Skill[]> {
  if (USE_MOCKS || !supabase) return mock.mockSkills
  const { data, error } = await supabase.from('skills').select('*')
  if (error) throw error
  return (data ?? []).map((r): Skill => ({
    id: r.id, name: r.name, category: r.category ?? 'Uncategorized',
    description: r.description ?? undefined,
    available_team_ids: parseAvailableTeams(r.description),
  }))
}

export async function fetchAvailability(): Promise<TeamAvailability[]> {
  if (USE_MOCKS || !supabase) return mock.mockAvailability
  // team_availability ссылается на team_id; имя команды подтянем join'ом
  const { data, error } = await supabase
    .from('team_availability')
    .select('id, team_id, start_date, end_date, teams(name)')
  if (error) throw error
  return (data ?? []).map((r: Record<string, unknown>): TeamAvailability => ({
    id: r.id as string, team_id: r.team_id as string,
    team_name: (r.teams as { name?: string } | null)?.name ?? '',
    start_date: r.start_date as string, end_date: r.end_date as string,
  }))
}

export async function fetchScheduleRun(requestId?: string): Promise<ScheduleRun | null> {
  if (USE_MOCKS || !supabase) return mock.mockScheduleRun
  // реальная таблица — AI_teams_schedule; comments лежат внутри output_data
  let q = supabase
    .from('AI_teams_schedule')
    .select('id, created_at, request_ID, output_data')
    .order('created_at', { ascending: false })
    .limit(1)
  if (requestId) q = supabase
    .from('AI_teams_schedule')
    .select('id, created_at, request_ID, output_data')
    .eq('request_ID', requestId)
    .limit(1)
  const { data, error } = await q
  if (error) throw error
  const row = data?.[0] as Record<string, unknown> | undefined
  if (!row) return null
  const out = (row.output_data ?? {}) as Record<string, unknown>
  return {
    request_id: row.request_ID as string,
    status: out.schedule ? 'done' : 'processing',
    output_data: out.schedule ? { schedule: out.schedule as never } : null,
    comments_ai_1: out['commentsAI-1'] ?? {},
    comments_ai_2: out['commentsAI-2'] ?? {},
    created_at: row.created_at as string,
  }
}
