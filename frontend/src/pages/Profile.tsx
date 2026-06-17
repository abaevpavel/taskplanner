import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { Button, Card, Input, PageTitle } from '../components/ui'

export function ProfilePage() {
  const { user } = useAuth()
  const [first, setFirst] = useState(user?.firstName ?? '')
  const [last, setLast] = useState(user?.lastName ?? '')

  return (
    <div>
      <PageTitle title="Profile" subtitle="Manage your personal information and preferences." />
      <Card className="mb-6 p-6">
        <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">First Name *</label>
            <Input value={first} onChange={(e) => setFirst(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last Name *</label>
            <Input value={last} onChange={(e) => setLast(e.target.value)} />
          </div>
        </div>
        <div className="mt-4">
          <label className="mb-1 block text-sm font-medium">Email Address</label>
          <Input value={user?.email ?? ''} disabled />
        </div>
        <div className="mt-4 flex justify-end">
          <Button variant="amber">Save Profile</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Change Password</h2>
        <label className="mb-1 block text-sm font-medium">New Password *</label>
        <Input type="password" placeholder="Enter new password" />
        <div className="mt-4 flex justify-end">
          <Button variant="amber">Update Password</Button>
        </div>
      </Card>
    </div>
  )
}
