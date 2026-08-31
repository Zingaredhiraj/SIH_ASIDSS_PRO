'use client'
import { useEffect, useState } from 'react'
import { fetchAuditLog } from '@/lib/api/admin'
import { AuditLog } from '@/lib/types'
import { Panel } from '@/components/common/Panel'
import { AuditTimeline } from '@/components/admin/AuditTimeline'
import { ErrorFallback } from '@/components/common/ErrorFallback'

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async () => {
    try {
      const res = await fetchAuditLog({ limit: 100 })
      setLogs(res.data)
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const int = setInterval(loadData, 5000)
    return () => clearInterval(int)
  }, [])

  if (error) return <ErrorFallback message="Failed to load audit logs" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="border-b border-polar-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">Audit & Compliance</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 10</p>
      </header>

      <Panel title="System Activity Timeline" className="h-[600px]">
        <AuditTimeline logs={logs} loading={loading} />
      </Panel>
    </div>
  )
}
