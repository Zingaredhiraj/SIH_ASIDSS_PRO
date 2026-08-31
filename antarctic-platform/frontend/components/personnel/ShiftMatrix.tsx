'use client'
import React from 'react'
import { Panel } from '../common/Panel'
import { ShiftSchedule } from '@/lib/types'
import { Clock, Users, ChevronRight } from 'lucide-react'

const SHIFT_COLORS = [
  { bg: 'bg-ocean-50',   border: 'border-ocean-200',   text: 'text-ocean-700',   badge: 'bg-ocean-100 text-ocean-700',   icon: 'text-ocean-400'   },
  { bg: 'bg-violet-50',  border: 'border-violet-200',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700',  icon: 'text-violet-400'  },
  { bg: 'bg-slate-50',   border: 'border-slate-200',   text: 'text-slate-600',   badge: 'bg-slate-100 text-slate-600',    icon: 'text-slate-400'   },
]

export function ShiftMatrix({ shifts = [], loading }: { shifts?: ShiftSchedule[], loading: boolean }) {
  if (loading) return <Panel title="Shift Matrix" subtitle="Current rotation schedule" isLoading className="h-full" />

  const safeShifts = Array.isArray(shifts) ? shifts : []

  return (
    <Panel title="Shift Matrix" subtitle="Current rotation schedule" accent="violet" className="h-full">
      {safeShifts.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No shift data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeShifts.map((shift, idx) => {
            const key = shift.shift_name || (shift as any)._id || `shift-card-${idx}`
            const name = shift.shift_name || `Shift ${idx + 1}`
            const crewCount = shift.crew_ids?.length || 0
            const colorSet = SHIFT_COLORS[idx % SHIFT_COLORS.length]
            const isCurrent = idx === 0

            return (
              <div
                key={key}
                className={`rounded-xl border-2 p-4 transition-all duration-200 ${colorSet.bg} ${colorSet.border} ${isCurrent ? 'shadow-card-md' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`font-bold text-base ${colorSet.text}`}>{name}</h3>
                  {isCurrent && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse ${colorSet.badge}`}>
                      ACTIVE
                    </span>
                  )}
                </div>

                <div className={`flex items-center gap-1.5 text-xs font-medium mb-4 ${colorSet.icon}`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-mono">{shift.window || '06:00–14:00 UTC'}</span>
                </div>

                <div className="bg-white/70 rounded-lg p-3 mb-3 text-center">
                  <div className={`text-3xl font-bold font-mono ${colorSet.text}`}>{crewCount}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Personnel</div>
                </div>

                <div className="space-y-1.5">
                  {[
                    { label: 'Operations', pct: 0.4 },
                    { label: 'Science',    pct: 0.3 },
                    { label: 'Engineering', pct: 0.3 },
                  ].map(dept => (
                    <div key={dept.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">{dept.label}</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 bg-white/60 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${colorSet.border.replace('border', 'bg')}`} style={{ width: `${dept.pct * 100}%` }} />
                        </div>
                        <span className={`font-mono font-bold text-[11px] ${colorSet.text}`}>{Math.round(crewCount * dept.pct)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}
