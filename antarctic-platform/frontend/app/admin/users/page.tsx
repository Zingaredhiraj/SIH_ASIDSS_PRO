'use client'
import { useEffect, useState } from 'react'
import { fetchUsers } from '@/lib/api/admin'
import { User } from '@/lib/types'
import { Panel } from '@/components/common/Panel'
import { UserTable } from '@/components/admin/UserTable'
import { ErrorFallback } from '@/components/common/ErrorFallback'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async () => {
    try {
      const res = await fetchUsers()
      setUsers(res.data)
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (error) return <ErrorFallback message="Failed to load users" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="border-b border-polar-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">User Management</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 10</p>
      </header>

      <Panel title="System Users" className="h-[600px]">
        <UserTable users={users} loading={loading} />
      </Panel>
    </div>
  )
}
