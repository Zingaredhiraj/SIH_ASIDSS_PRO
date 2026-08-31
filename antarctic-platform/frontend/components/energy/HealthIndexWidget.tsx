import React from 'react'
import { Panel } from '../common/Panel'
import { HealthIndex } from '@/lib/types'

export function HealthIndexWidget({ data }: { data?: HealthIndex }) {
  if (!data) return <Panel title="Station Health Index" isLoading />

  const score = data.score ?? 85
  const grade = data.grade ?? 'B+'
  const isGood = score >= 80
  const isWarn = score >= 60 && score < 80

  const gradeColor = isGood ? '#17A88E' : isWarn ? '#D9A441' : '#DC5B54'
  const gradeBg = isGood ? 'rgba(23,168,142,0.12)' : isWarn ? 'rgba(217,164,65,0.14)' : 'rgba(220,91,84,0.12)'

  return (
    <Panel title="Station Health Index" subtitle="Operational Readiness Score" className="h-full" accent="teal">
      <div className="flex flex-col items-center justify-center py-5 border-b border-[#E4EBF2]">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center font-display font-extrabold text-3xl mb-2"
          style={{ background: gradeBg, color: gradeColor }}
        >
          {score}
        </div>
        <div className="text-base font-bold text-[#12233B]">
          Health Grade: <span style={{ color: gradeColor }}>{grade}</span>
        </div>
        <p className="mt-1 text-xs text-[#64748B] text-center max-w-[280px]">{data.reason || 'All critical station systems operating within normal parameters.'}</p>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 space-y-2.5">
        <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">Impact Factors</div>
        {(data.factors || []).map(f => (
          <div key={f.name} className="flex items-center justify-between text-xs py-1 border-b border-[#F5F8FB] last:border-0">
            <span className="font-medium text-[#64748B]">{f.name.replace(/_/g, ' ')}</span>
            <span
              className="font-mono font-bold px-2 py-0.5 rounded text-[11px]"
              style={{
                background: f.score < 0 ? 'rgba(220,91,84,0.1)' : 'rgba(23,168,142,0.1)',
                color: f.score < 0 ? '#DC5B54' : '#17A88E'
              }}
            >
              {f.score > 0 ? '+' : ''}{f.score}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
