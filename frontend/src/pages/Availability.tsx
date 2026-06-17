import { useQuery } from '@tanstack/react-query'
import { Trash2 } from 'lucide-react'
import { Button, Card, Input, PageTitle, Badge } from '../components/ui'
import { fetchAvailability, fetchTeams } from '../services/data'

export function AvailabilityPage() {
  const { data: periods } = useQuery({ queryKey: ['availability'], queryFn: fetchAvailability })
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams })

  return (
    <div>
      <PageTitle title="Teams Availability" subtitle="Manage team unavailable dates and periods" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">+ Add Unavailable Period</h2>
          <p className="mb-4 text-sm text-gray-500">Select a team and specify when they will be unavailable</p>
          <label className="mb-1 block text-sm font-medium">Team</label>
          <select className="mb-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option>Select a team</option>
            {teams?.map((t) => <option key={t.id}>{t.name}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Start Date</label>
              <Input type="date" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Date</label>
              <Input type="date" />
            </div>
          </div>
          <Button variant="amber" className="mt-4 w-full">Add Unavailable Period</Button>
        </Card>

        <Card className="p-6">
          <h2 className="mb-1 text-lg font-semibold">Current Unavailable Periods</h2>
          <p className="mb-4 text-sm text-gray-500">View and manage existing team unavailability</p>
          <div className="space-y-3">
            {periods?.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-gray-100">{p.team_name}</Badge>
                  <span className="text-sm text-gray-600">{p.start_date} — {p.end_date}</span>
                </div>
                <button className="text-red-500 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
