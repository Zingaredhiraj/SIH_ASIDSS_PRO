import React, { useState } from 'react'
import { Panel } from '../common/Panel'
import { PersonnelMember } from '@/lib/types'
import { StatusBadge } from '../common/StatusBadge'
import { Search, Users } from 'lucide-react'

const FILTERS = ['ALL', 'ON_DUTY', 'OFF_DUTY', 'IN_FIELD_OPS']

const STATUS_COLORS: Record<string, string> = {
  ALL:         'bg-slate-100 text-slate-600',
  ON_DUTY:     'bg-emerald-100 text-emerald-700',
  OFF_DUTY:    'bg-slate-100 text-slate-500',
  IN_FIELD_OPS:'bg-amber-100 text-amber-700',
}

export function CrewRoster({ crew = [], loading }: { crew?: PersonnelMember[], loading: boolean }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('ALL')

  const safeCrew = Array.isArray(crew) ? crew : []

  const filtered = safeCrew.filter(c => {
    const q = search.toLowerCase()
    const matchesSearch = (c.name || '').toLowerCase().includes(q) || (c.role || '').toLowerCase().includes(q)
    const matchesFilter = filter === 'ALL' || c.status === filter
    return matchesSearch && matchesFilter
  })

  const counts: Record<string, number> = {
    ALL: safeCrew.length,
    ON_DUTY: safeCrew.filter(c => c.status === 'ON_DUTY').length,
    OFF_DUTY: safeCrew.filter(c => c.status === 'OFF_DUTY').length,
    IN_FIELD_OPS: safeCrew.filter(c => c.status === 'IN_FIELD_OPS').length,
  }

  return (
    <Panel title="Active Roster" subtitle={`${filtered.length} of ${safeCrew.length} personnel`} accent="violet" className="h-full" noPadding>
      {/* Filter bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[160px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name or role..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="field-input pl-9 py-2 text-sm"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
                  filter === f ? STATUS_COLORS[f] + ' ring-1 ring-current ring-offset-1' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {f.replace(/_/g, ' ')}
                <span className="ml-1 opacity-60">({counts[f] ?? 0})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Crew ID</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Shift</th>
              <th className="px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Sector</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr key="row-loading">
                <td colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-slate-200 animate-pulse" />
                    <span className="text-slate-400 text-sm font-medium">Loading roster...</span>
                  </div>
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr key="row-empty">
                <td colSpan={6} className="text-center py-10">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-8 h-8 text-slate-200" />
                    <span className="text-slate-400 text-sm font-medium">No personnel found</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => {
                const key = c.crew_id || (c as any)._id || `${c.name}-${idx}`
                return (
                  <tr key={key} className="hover:bg-arctic-50 transition-colors duration-100 group">
                    <td className="px-5 py-3 font-mono text-xs text-ocean-600 font-semibold">{c.crew_id || `ID-${idx}`}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-ocean-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {(c.name || 'C')[0].toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-600 text-sm">{c.role}</td>
                    <td className="px-5 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-5 py-3">
                      <span className="text-xs font-semibold text-ocean-700 bg-arctic-100 px-2 py-0.5 rounded-full">{c.shift || 'Alpha'}</span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-slate-500">{c.sector || 'Main'}</td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
