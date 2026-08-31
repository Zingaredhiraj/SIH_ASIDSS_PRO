'use client'
import React from 'react'
import { Panel } from '../common/Panel'
import { Incident } from '@/lib/types'
import { Flame, Wind, PlusSquare, AlertOctagon, CheckCircle2 } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { escalateIncident, resolveIncident } from '@/lib/api/emergency'
import { useAuth } from '@/lib/auth/AuthContext'

export function IncidentDashboard({ stationId, incidents = [] }: { stationId: string, incidents?: Incident[] }) {
  const { hasPermission } = useAuth()
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'FIRE': return <Flame className="w-6 h-6 text-red-500" />;
      case 'STORM': return <Wind className="w-6 h-6 text-amber-500" />;
      case 'MEDICAL': return <PlusSquare className="w-6 h-6 text-red-400" />;
      default: return <AlertOctagon className="w-6 h-6 text-red-500" />;
    }
  }

  const safeIncidents = Array.isArray(incidents) ? incidents : []
  const activeIncidents = safeIncidents.filter(i => i.status === 'ACTIVE' || i.status === 'MONITORING')

  const handleEscalate = async (id: string) => {
    try { await escalateIncident(id) } catch (e) { console.error(e) }
  }

  const handleResolve = async (id: string) => {
    try { await resolveIncident(id) } catch (e) { console.error(e) }
  }

  return (
    <Panel title="Active Incident Dashboard" className="h-full relative overflow-hidden">
      {activeIncidents.length === 0 ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-900/50">
          <CheckCircle2 className="w-16 h-16 text-green-500/50 mb-4" />
          <h3 className="text-xl font-bold text-green-500 mb-2">STATION STATUS: NOMINAL</h3>
          <p className="text-gray-400 font-mono text-sm">No active emergency incidents</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeIncidents.map((inc, idx) => {
            const incId = inc.incident_id || (inc as any)._id || `inc-${idx}`
            return (
              <div key={incId} className={`p-4 rounded-lg border relative ${inc.status === 'ACTIVE' ? 'bg-red-900/20 border-red-500/50' : 'bg-amber-900/20 border-amber-500/50'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    {getIcon(inc.type)}
                    <div className="ml-3">
                      <h3 className="text-white font-bold">{inc.type} ALERT</h3>
                      <p className="text-xs text-gray-400 font-mono">{incId} • {inc.triggered_at ? `Started ${formatRelativeTime(inc.triggered_at)}` : 'Active'}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold border ${
                    inc.escalation_level === 3 ? 'bg-red-600 border-red-500 text-white animate-pulse' :
                    inc.escalation_level === 2 ? 'bg-orange-500/20 border-orange-500 text-orange-500' :
                    'bg-amber-500/20 border-amber-500 text-amber-500'
                  }`}>
                    LVL {inc.escalation_level || 1}
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-4">{inc.description}</p>
                
                <div className="flex space-x-2 border-t border-polar-border pt-3">
                  {hasPermission('ACK_INCIDENT') && (
                    <>
                      <button 
                        onClick={() => handleResolve(incId)}
                        className="flex-1 bg-navy-800 hover:bg-green-900/50 border border-polar-border hover:border-green-500 text-gray-300 hover:text-green-500 text-xs font-bold py-2 rounded transition-colors"
                      >
                        RESOLVE
                      </button>
                      {(inc.escalation_level || 1) < 3 && (
                        <button 
                          onClick={() => handleEscalate(incId)}
                          className="flex-1 bg-red-900/30 hover:bg-red-600 border border-red-500/50 text-red-500 hover:text-white text-xs font-bold py-2 rounded transition-colors"
                        >
                          ESCALATE
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}
