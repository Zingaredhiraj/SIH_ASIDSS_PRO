'use client'
import { useEffect, useState } from 'react'
import { fetchRoles } from '@/lib/api/admin'
import { Role } from '@/lib/types'
import { Panel } from '@/components/common/Panel'
import { RoleMatrix } from '@/components/admin/RoleMatrix'
import { ErrorFallback } from '@/components/common/ErrorFallback'

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async () => {
    try {
      const res = await fetchRoles()
      setRoles(res.data)
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

  if (error) return <ErrorFallback message="Failed to load roles" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="border-b border-polar-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">Role Permissions</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 10</p>
      </header>

      <Panel title="RBAC Matrix" className="h-[600px]">
        <RoleMatrix roles={roles} loading={loading} />
      </Panel>
    </div>
  )
}
