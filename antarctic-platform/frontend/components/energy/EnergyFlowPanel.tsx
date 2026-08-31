'use client'
import { useEffect, useState } from 'react'
import { ComposedChart, Area, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { TelemetryData } from '@/lib/types'
import { formatPower } from '@/lib/utils/formatters'

const METRIC_CARDS = [
  { key: 'solar_kw',  label: 'SOLAR PV',     color: '#D9A441', bg: 'rgba(217,164,65,0.10)'  },
  { key: 'wind_kw',   label: 'WIND TURBINE', color: '#2F8FE0', bg: 'rgba(47,143,224,0.10)'  },
  { key: 'diesel_kw', label: 'DIESEL GEN',   color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  { key: 'load_kw',   label: 'TOTAL LOAD',   color: '#17A88E', bg: 'rgba(23,168,142,0.10)'  },
]

export function EnergyFlowPanel({ data }: { data: TelemetryData }) {
  const [history, setHistory] = useState<TelemetryData[]>([])

  useEffect(() => {
    setHistory(prev => {
      const next = [...prev, data]
      return next.length > 30 ? next.slice(next.length - 30) : next
    })
  }, [data])

  const totalGen = (data.solar_kw || 0) + (data.wind_kw || 0) + (data.diesel_kw || 0)
  const balance  = totalGen - (data.load_kw || 0)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Source metrics */}
      <div className="grid grid-cols-4 gap-3">
        {METRIC_CARDS.map(m => (
          <div key={m.key} className="rounded-[12px] p-3 border border-[#E4EBF2]" style={{ background: m.bg }}>
            <div className="text-[10.5px] font-bold tracking-wider mb-1" style={{ color: m.color }}>{m.label}</div>
            <div className="text-[16px] font-mono font-bold text-[#12233B]">{formatPower((data as any)[m.key] || 0)}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-[140px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={history} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <XAxis dataKey="timestamp" tick={false} axisLine={false} />
            <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#FFFFFF', border: '1px solid #E4EBF2', borderRadius: 10, fontSize: 12 }}
              itemStyle={{ fontFamily: 'JetBrains Mono, monospace', color: '#12233B' }}
            />
            <Area type="monotone" dataKey="solar_kw"  stackId="1" stroke="#D9A441" fill="#D9A441" fillOpacity={0.15} name="Solar"   />
            <Area type="monotone" dataKey="wind_kw"   stackId="1" stroke="#2F8FE0" fill="#2F8FE0" fillOpacity={0.15} name="Wind"    />
            <Area type="monotone" dataKey="diesel_kw" stackId="1" stroke="#64748B" fill="#64748B" fillOpacity={0.10} name="Diesel"  />
            <Line type="stepAfter" dataKey="load_kw" stroke="#17A88E" strokeWidth={2} dot={false} name="Load" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-right text-[11.5px] font-mono font-semibold text-[#94A3B8]">
        NET BALANCE: <span style={{ color: balance >= 0 ? '#17A88E' : '#DC5B54' }}>{balance > 0 ? '+' : ''}{formatPower(balance)}</span>
      </div>
    </div>
  )
}
