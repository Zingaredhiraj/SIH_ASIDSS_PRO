'use client'
import { useEffect, useState } from 'react'
import { useStation } from '@/components/common/StationSelector'
import { fetchAccessPoints, fetchAccessEvents, fetchSecurityRisk } from '@/lib/api/security'
import { AccessPoint, AccessEvent, SecurityRisk } from '@/lib/types'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { AccessPointGrid } from '@/components/security/AccessPointGrid'
import { AccessEventLog } from '@/components/security/AccessEventLog'
import { FieldTeamCorrelation } from '@/components/security/FieldTeamCorrelation'

export default function SecurityPage() {
  const { stationId } = useStation()
  const [points, setPoints] = useState<AccessPoint[]>([])
  const [events, setEvents] = useState<AccessEvent[]>([])
  const [risk, setRisk] = useState<SecurityRisk | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      const [p, e, r] = await Promise.all([
        fetchAccessPoints(stationId),
        fetchAccessEvents(stationId),
        fetchSecurityRisk(stationId)
      ])
      setPoints(p.data)
      setEvents(e.data)
      setRisk(r.data)
      setError(false)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 15000)
    return () => clearInterval(interval)
  }, [stationId])

  if (error) return <ErrorFallback message="Failed to load security data" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end border-b border-polar-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Security & Access Control</h1>
          <p className="text-gray-400 font-mono text-sm mt-1">MODULE 3 • {stationId}</p>
        </div>
        {risk && (
          <div className="flex items-center space-x-3 bg-navy-900 p-2 rounded border border-polar-border">
            <span className="text-xs font-mono text-gray-400 uppercase">Risk Level</span>
            <span className={`px-2 py-1 rounded text-sm font-bold ${risk.overall_risk === 'LOW' ? 'bg-green-500/20 text-green-500' : risk.overall_risk === 'MEDIUM' ? 'bg-amber-500/20 text-amber-500' : 'bg-red-500/20 text-red-500'}`}>
              {risk.overall_risk} ({risk.risk_score})
            </span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AccessPointGrid points={points} loading={loading} />
        </div>
        <div>
          <FieldTeamCorrelation loading={loading} />
        </div>
      </div>

      <div className="h-96">
        <AccessEventLog events={events} loading={loading} />
      </div>
    </div>
  )
}
