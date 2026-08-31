'use client'
import React, { useEffect, useState } from 'react'
import { Panel } from '../common/Panel'
import { fetchMuster, markCrewSafe } from '@/lib/api/emergency'
import { MusterEntry } from '@/lib/types'
import { StatusBadge } from '../common/StatusBadge'

export function MusterTracker({ stationId, isEmergency }: { stationId: string, isEmergency: boolean }) {
  const [muster, setMuster] = useState<MusterEntry[]>([])
  const [loading, setLoading] = useState(false)

  const loadMuster = async () => {
    try {
      const res = await fetchMuster(stationId)
      setMuster(res.data || [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadMuster()
    if (isEmergency) {
      const int = setInterval(loadMuster, 5000)
      return () => clearInterval(int)
    }
  }, [stationId, isEmergency])

  const safeMuster = Array.isArray(muster) ? muster : []

  const handleMarkSafe = async (crewId: string) => {
    setMuster(prev => prev.map(m => m.crew_id === crewId ? { ...m, status: 'SAFE' } : m))
    try {
      await markCrewSafe(crewId)
    } catch (e) {
      loadMuster()
    }
  }

  const safeCount = safeMuster.filter(m => m.status === 'SAFE').length
  const missingCount = safeMuster.filter(m => m.status === 'MISSING').length
  const atMusterCount = safeMuster.filter(m => m.status === 'AT_MUSTER').length
  const totalCount = safeMuster.length

  return (
    <Panel title="Muster & Accountability" className="h-full">
      <div className="grid grid-cols-3 gap-2 mb-4 text-center border-b border-polar-border pb-4">
        <div>
          <div className="text-2xl font-mono text-green-500 font-bold">{safeCount}</div>
          <div className="text-[10px] text-gray-400 uppercase">Safe</div>
        </div>
        <div>
          <div className="text-2xl font-mono text-ice-500 font-bold">{atMusterCount}</div>
          <div className="text-[10px] text-gray-400 uppercase">At Muster</div>
        </div>
        <div>
          <div className={`text-2xl font-mono font-bold ${missingCount > 0 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`}>{missingCount}</div>
          <div className="text-[10px] text-gray-400 uppercase">Missing</div>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 space-y-1">
        {safeMuster.length === 0 ? (
          <div className="text-center py-6 text-gray-500 font-mono text-xs">No crew muster records</div>
        ) : (
          safeMuster.map((m, idx) => {
            const key = m.crew_id || (m as any)._id || (m as any).personnel_id || `muster-${idx}`
            const cId = m.crew_id || (m as any).personnel_id || `ID-${idx}`
            return (
              <div key={key} className={`flex justify-between items-center p-2 rounded text-sm ${m.status === 'MISSING' && isEmergency ? 'bg-red-900/20 border border-red-500/30' : 'hover:bg-navy-800'}`}>
                <div>
                  <div className="text-white font-medium">{m.name || 'Crew Member'}</div>
                  <div className="text-xs text-gray-500 font-mono">{cId}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <StatusBadge status={m.status || 'SAFE'} />
                  {isEmergency && m.status === 'MISSING' && (
                    <button 
                      onClick={() => handleMarkSafe(cId)}
                      className="bg-green-600 hover:bg-green-500 text-white text-[10px] px-2 py-1 rounded font-bold"
                    >
                      MARK SAFE
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </Panel>
  )
}
