import React from 'react'
import { Panel } from '../common/Panel'
import { AccessPoint } from '@/lib/types'
import { ShieldCheck, ShieldAlert, DoorOpen, AlertTriangle } from 'lucide-react'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { StatusBadge } from '../common/StatusBadge'

const RISK_COLORS = { LOW: 'text-emerald-600 bg-emerald-50', MEDIUM: 'text-amber-600 bg-amber-50', HIGH: 'text-red-600 bg-red-50' }

export function AccessPointGrid({ points = [], loading }: { points?: AccessPoint[], loading: boolean }) {
  if (loading) return <Panel title="Access Points" subtitle="Station perimeter monitoring" isLoading className="h-full" />

  const safePoints = Array.isArray(points) ? points : []

  return (
    <Panel title="Access Points" subtitle="Station perimeter monitoring" accent="warning" className="h-full">
      {safePoints.length === 0 ? (
        <div className="text-center py-8">
          <ShieldCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No access point data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safePoints.map((pt, idx) => {
            const isAlert = pt.status === 'ALERT'
            const isOpen  = pt.status === 'OPEN'
            const key = pt.point_id || (pt as any)._id || pt.point_name || `pt-${idx}`
            const riskKey = (pt.risk_level || 'LOW').toUpperCase() as keyof typeof RISK_COLORS
            const riskClass = RISK_COLORS[riskKey] || RISK_COLORS.LOW

            return (
              <div
                key={key}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  isAlert
                    ? 'bg-red-50 border-red-300 shadow-sm'
                    : isOpen
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-card'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    {isAlert
                      ? <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                      : isOpen
                      ? <DoorOpen className="w-5 h-5 text-amber-500" />
                      : <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    }
                    <span className="font-semibold text-slate-800 text-sm">{pt.point_name || 'Access Point'}</span>
                  </div>
                  <StatusBadge status={pt.status || 'SECURE'} />
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Security Level</span>
                    <span className="font-mono font-bold text-ocean-700">Lvl {pt.access_level ?? 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Risk</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${riskClass}`}>{pt.risk_level || 'LOW'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Last Access</span>
                    <span className="text-slate-600 font-medium">{pt.last_event_time ? formatRelativeTime(pt.last_event_time) : 'Recent'}</span>
                  </div>
                  {pt.last_crew && (
                    <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                      <span className="text-slate-400 font-medium">Personnel</span>
                      <span className="text-slate-700 font-medium truncate max-w-[120px] text-right">{pt.last_crew}</span>
                    </div>
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
