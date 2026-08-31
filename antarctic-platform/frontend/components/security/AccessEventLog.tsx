import React from 'react'
import { Panel } from '../common/Panel'
import { AccessEvent } from '@/lib/types'
import { formatTimestamp } from '@/lib/utils/formatters'
import { LogIn, LogOut, XCircle, List } from 'lucide-react'

const EVENT_CONFIG: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
  ENTRY:  { icon: <LogIn  className="w-3.5 h-3.5" />, cls: 'bg-emerald-50 text-emerald-700', label: 'Entry'  },
  EXIT:   { icon: <LogOut className="w-3.5 h-3.5" />, cls: 'bg-slate-50 text-slate-500',      label: 'Exit'   },
  DENIED: { icon: <XCircle className="w-3.5 h-3.5"/>, cls: 'bg-red-50 text-red-700',          label: 'Denied' },
}

export function AccessEventLog({ events = [], loading }: { events?: AccessEvent[], loading: boolean }) {
  if (loading) return <Panel title="Access Event Log" subtitle="Recent security events" isLoading className="h-full" />

  const safeEvents = Array.isArray(events) ? events : []

  return (
    <Panel title="Access Event Log" subtitle="Recent security events" accent="slate" className="h-full" noPadding>
      {safeEvents.length === 0 ? (
        <div className="p-5 text-center py-8">
          <List className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm font-medium">No recent security events</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Timestamp</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Personnel</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Location</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Event</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {safeEvents.map((ev, idx) => {
                const key = ev.event_id || (ev as any)._id || `${ev.crew_id}-${idx}`
                const eventKey = (ev.event_type || 'ENTRY').toUpperCase()
                const cfg = EVENT_CONFIG[eventKey] || EVENT_CONFIG.ENTRY
                return (
                  <tr key={key} className="hover:bg-arctic-50 transition-colors duration-100">
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{formatTimestamp(ev.timestamp)}</td>
                    <td className="px-5 py-3">
                      <span className="font-semibold text-slate-800 text-sm">{ev.crew_name || 'Crew Member'}</span>
                      <span className="ml-2 font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{ev.crew_id || '--'}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-600 text-sm">{ev.point_id || 'Access Point'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.cls}`}>
                        {cfg.icon}{cfg.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}
