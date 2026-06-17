import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button, Card, Input } from '../components/ui'
import { cn } from '../lib/utils'
import { fetchProjects, fetchSkills, fetchTeams } from '../services/data'
import type { TimeType } from '../domain/types'

export function CreateTaskPage() {
  const [mode, setMode] = useState<'project' | 'other'>('project')
  const [timeType, setTimeType] = useState<TimeType | null>(null)
  const [stopWhen, setStopWhen] = useState<'before' | 'after'>('after')
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const teams = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const skills = useQuery({ queryKey: ['skills'], queryFn: fetchSkills })

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        <button onClick={() => setMode('project')} className={cn('flex-1 rounded-md py-2 text-sm font-medium', mode === 'project' ? 'bg-white shadow' : 'text-gray-500')}>📁 New Project Task</button>
        <button onClick={() => setMode('other')} className={cn('flex-1 rounded-md py-2 text-sm font-medium', mode === 'other' ? 'bg-white shadow' : 'text-gray-500')}>＋ New Other Task</button>
      </div>

      <Card className="space-y-5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {mode === 'project' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Select Project *</label>
              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
                <option>Choose a project…</option>
                {projects.data?.map((p) => <option key={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Task Type *</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>Project task</option><option>Other task</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Description *</label>
          <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" rows={4} placeholder="Please be very specific…" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Date *</label>
            <Input type="date" />
          </div>
          <div>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-medium">Time</label>
              <div className="flex gap-1 text-xs">
                <button onClick={() => setTimeType('exact')} className={cn('rounded px-2 py-0.5', timeType === 'exact' ? 'bg-gray-900 text-white' : 'bg-gray-100')}>EXACT TIME</button>
                <button onClick={() => setTimeType('timeframe')} className={cn('rounded px-2 py-0.5', timeType === 'timeframe' ? 'bg-gray-900 text-white' : 'bg-gray-100')}>TIMEFRAME</button>
              </div>
            </div>
            {timeType === 'exact' && <Input type="time" />}
            {timeType === 'timeframe' && <div className="flex gap-2"><Input type="time" /><Input type="time" /></div>}
            {!timeType && <Input disabled placeholder="Select time type above" />}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Duration * (hours)</label>
            <Input placeholder="e.g. 8, 4.5" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Assigned Team</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>No preference</option>
              {teams.data?.map((t) => <option key={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Priority</label>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option>5 - Normal</option><option>1 - Highest</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Required Skills (optional)</label>
          <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Add Required Skill</option>
            {skills.data?.map((s) => <option key={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between">
            <label className="text-sm font-medium">Additional Stop</label>
            <div className="flex gap-1 text-xs">
              <button onClick={() => setStopWhen('before')} className={cn('rounded px-2 py-0.5', stopWhen === 'before' ? 'bg-gray-900 text-white' : 'bg-gray-100')}>BEFORE</button>
              <button onClick={() => setStopWhen('after')} className={cn('rounded px-2 py-0.5', stopWhen === 'after' ? 'bg-gray-900 text-white' : 'bg-gray-100')}>AFTER</button>
            </div>
          </div>
          <Input placeholder="Search for any address or place (e.g., Home Depot Beltsville)" />
          <div className="mt-2 flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Additional Stop Address</label>
              <Input disabled placeholder="Will be populated when location is selected above" />
            </div>
            <div className="w-24">
              <label className="mb-1 block text-xs text-gray-500">Duration (min)</label>
              <Input defaultValue={30} />
            </div>
          </div>
        </div>

        <Button variant="amber" className="w-full">Create Task</Button>
        <p className="text-center text-xs text-gray-400">MOCK: task creation will be wired to Supabase in phase 2</p>
      </Card>
    </div>
  )
}
