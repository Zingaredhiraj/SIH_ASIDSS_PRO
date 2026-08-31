'use client'
import { useEffect, useState } from 'react'
import { useStation } from '@/components/common/StationSelector'
import { fetchPersonnel, fetchPersonnelSummary, fetchShifts } from '@/lib/api/personnel'
import { PersonnelMember, OperationalReadiness, ShiftSchedule } from '@/lib/types'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { CrewRoster } from '@/components/personnel/CrewRoster'
import { OperationalReadinessWidget } from '@/components/personnel/OperationalReadinessWidget'
import { ShiftMatrix } from '@/components/personnel/ShiftMatrix'

export default function PersonnelPage() {
  const { stationId } = useStation()
  const [crew, setCrew] = useState<PersonnelMember[]>([])
  const [summary, setSummary] = useState<OperationalReadiness | null>(null)
  const [shifts, setShifts] = useState<ShiftSchedule[]>([])
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      setLoading(true)
      const [c, sum, sh] = await Promise.all([
        fetchPersonnel(stationId),
        fetchPersonnelSummary(stationId),
        fetchShifts(stationId)
      ])
      setCrew(c.data)
      setSummary(sum.data)
      setShifts(sh.data)
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 30000)
    return () => clearInterval(interval)
  }, [stationId])

  if (error) return <ErrorFallback message="Failed to load personnel data" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="border-b border-polar-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">Personnel & Operations</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 2 • {stationId}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <OperationalReadinessWidget data={summary} loading={loading} />
        </div>
        <div className="lg:col-span-3">
          <ShiftMatrix shifts={shifts} loading={loading} />
        </div>
      </div>

      <div className="h-[500px]">
        <CrewRoster crew={crew} loading={loading} />
      </div>
    </div>
  )
}
