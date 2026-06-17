/** n8n-клиент: отправка задач планировщику и расписания в Slack. */
import { USE_MOCKS } from '../lib/utils'
import type { Task, Team, TeamAvailability, Skill } from '../domain/types'

const PLANNER = import.meta.env.VITE_N8N_PLANNER_WEBHOOK as string | undefined
const PLANNER_TEST = import.meta.env.VITE_N8N_PLANNER_TEST_WEBHOOK as string | undefined
const SLACK = import.meta.env.VITE_N8N_SLACK_WEBHOOK as string | undefined

export interface SendToAiParams {
  requestId: string
  date: string | null
  tasks: Task[]
  teams: Team[]
  unavailableTeams: TeamAvailability[]
  skills: Skill[]
  persistentPrompt?: string
  oneTimePrompt?: string
  test?: boolean
}

/** Send to AI → вебхук планировщика. Возвращает ack. */
export async function sendToAi(p: SendToAiParams): Promise<{ request_ID: string }> {
  const url = p.test ? PLANNER_TEST || PLANNER : PLANNER
  const payload = {
    request_ID: p.requestId,
    date: p.date,
    source: 'requested',
    'Persistent Prompt': p.persistentPrompt ?? null,
    'One-time Prompt': p.oneTimePrompt ?? null,
    tasks: p.tasks,
    Teams: p.teams.map((t) => ({
      team_name: t.name, team_address: t.home_address,
      team_latitude: t.lat, team_longitude: t.lng, skills: t.skills,
    })),
    'Unavailable teams': p.unavailableTeams.map((u) => ({ team_name: u.team_name })),
    Skills: p.skills.map((s) => s.name),
    total: p.tasks.length,
  }

  if (USE_MOCKS || !url) {
    console.info('[mock] sendToAi payload:', payload)
    return { request_ID: p.requestId }
  }
  const res = await fetch(url, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`n8n planner ${res.status}`)
  return res.json().catch(() => ({ request_ID: p.requestId }))
}

/** Send tasks → вебхук Slack-рассыльщика. */
export async function sendToSlack(schedule: unknown): Promise<void> {
  if (USE_MOCKS || !SLACK) {
    console.info('[mock] sendToSlack:', schedule)
    return
  }
  const res = await fetch(SLACK, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(schedule),
  })
  if (!res.ok) throw new Error(`n8n slack ${res.status}`)
}
