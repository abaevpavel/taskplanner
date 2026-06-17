import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { RefreshCw } from 'lucide-react'
import { Button, Card, PageTitle, Badge } from '../components/ui'
import { cn } from '../lib/utils'
import { fetchProjects, fetchSkills, fetchTeams } from '../services/data'

type Tab = 'projects' | 'team' | 'skills' | 'task_types'
const TABS: { key: Tab; label: string }[] = [
  { key: 'projects', label: 'Projects' },
  { key: 'team', label: 'Team' },
  { key: 'skills', label: 'Skills' },
  { key: 'task_types', label: 'Task Types' },
]

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('skills')
  const projects = useQuery({ queryKey: ['projects'], queryFn: fetchProjects })
  const teams = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })
  const skills = useQuery({ queryKey: ['skills'], queryFn: fetchSkills })

  return (
    <div>
      <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn('flex-1 rounded-md py-2 text-sm font-medium', tab === t.key ? 'bg-white shadow' : 'text-gray-500')}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <PageTitle title={TABS.find((t) => t.key === tab)!.label} />
        <Button variant="amber"><RefreshCw size={16} /> Sync from Airtable</Button>
      </div>

      {tab === 'projects' && (
        <Card className="divide-y">
          {projects.data?.map((p) => (
            <div key={p.id} className="flex items-center justify-between p-4">
              <div><div className="font-medium">{p.name}</div><div className="text-sm text-gray-500">{p.address}</div></div>
              <Badge className="bg-gray-100">PM: {p.project_manager}</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'team' && (
        <Card className="divide-y">
          {teams.data?.map((t) => (
            <div key={t.id} className="flex items-center justify-between p-4">
              <div><div className="font-medium">{t.name}</div><div className="text-sm text-gray-500">{t.home_address}</div></div>
              <Badge className="bg-gray-100">{t.skills.length} skills</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'skills' && (
        <Card className="divide-y">
          {skills.data?.map((s, i) => (
            <div key={s.id} className="flex items-start gap-4 p-4">
              <span className="text-gray-400">{i + 1}</span>
              <div className="flex-1">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-500">{s.description ?? '-'}</div>
              </div>
              <Badge className="bg-gray-100">{s.category}</Badge>
            </div>
          ))}
        </Card>
      )}

      {tab === 'task_types' && (
        <Card className="p-4 text-sm text-gray-500">Project task · Other task</Card>
      )}
    </div>
  )
}
