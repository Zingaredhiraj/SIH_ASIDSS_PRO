import React from 'react'
import { Panel } from '../common/Panel'
import { WeatherReading } from '@/lib/types'
import { Thermometer, Wind, Eye, Gauge, Snowflake, Compass, CloudSun } from 'lucide-react'
import { formatTimestamp } from '@/lib/utils/formatters'

function safeNum(v: any, fallback = 0): number {
  const n = Number(v)
  return isNaN(n) ? fallback : n
}

function MetricCard({ icon, label, value, unit, color = 'text-ocean-700' }: {
  icon: React.ReactNode; label: string; value: string | number; unit?: string; color?: string
}) {
  return (
    <div className="bg-arctic-50 rounded-xl p-3.5 border border-slate-100">
      <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-semibold uppercase tracking-wider mb-2">
        {icon} {label}
      </div>
      <div className={`text-xl font-bold font-mono ${color}`}>
        {value}{unit && <span className="text-sm font-medium text-slate-400 ml-0.5">{unit}</span>}
      </div>
    </div>
  )
}

export function CurrentWeatherPanel({ data, loading }: { data?: WeatherReading | null, loading: boolean }) {
  if (loading || !data) return <Panel title="Current Conditions" isLoading className="h-full" />

  const temp = safeNum(data.temperature, -25)
  const wind = safeNum(data.wind_speed, 20)
  const vis  = safeNum(data.visibility, 5000)

  let condition = 'NOMINAL'
  let condBg = 'bg-emerald-50 border-emerald-300 text-emerald-800'
  if (wind > 60 || temp < -40) {
    condition = 'SEVERE'
    condBg = 'bg-red-50 border-red-300 text-red-800'
  } else if (wind > 40 || vis < 1000) {
    condition = 'ADVERSE'
    condBg = 'bg-amber-50 border-amber-300 text-amber-800'
  }

  return (
    <Panel title="Current Conditions" subtitle="Live environmental sensors" className="h-full" accent="ice">
      {/* Condition banner */}
      <div className={`mb-5 flex items-center justify-between px-4 py-3 rounded-xl border-2 ${condBg}`}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">Station Condition</div>
          <div className="text-xl font-bold tracking-wider">{condition}</div>
        </div>
        <CloudSun className="w-8 h-8 opacity-30" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          icon={<Thermometer className="w-3.5 h-3.5 text-sky-500" />}
          label="Temperature"
          value={temp.toFixed(1)}
          unit="°C"
          color={temp < -35 ? 'text-red-600' : 'text-ocean-700'}
        />
        <MetricCard
          icon={<Wind className="w-3.5 h-3.5 text-amber-500" />}
          label="Wind Speed"
          value={wind.toFixed(1)}
          unit=" km/h"
          color={wind > 60 ? 'text-red-600' : wind > 40 ? 'text-amber-600' : 'text-ocean-700'}
        />
        <MetricCard
          icon={<Compass className="w-3.5 h-3.5 text-purple-500" />}
          label="Direction"
          value={safeNum(data.wind_direction, 180).toFixed(0)}
          unit="°"
        />
        <MetricCard
          icon={<Eye className="w-3.5 h-3.5 text-emerald-500" />}
          label="Visibility"
          value={vis >= 1000 ? `${(vis / 1000).toFixed(1)}` : `${vis}`}
          unit={vis >= 1000 ? ' km' : ' m'}
          color={vis < 500 ? 'text-red-600' : 'text-ocean-700'}
        />
        <MetricCard
          icon={<Gauge className="w-3.5 h-3.5 text-indigo-500" />}
          label="Pressure"
          value={safeNum(data.pressure, 980).toFixed(0)}
          unit=" hPa"
        />
        <MetricCard
          icon={<Snowflake className="w-3.5 h-3.5 text-cyan-500" />}
          label="Snowfall"
          value={safeNum(data.snowfall, 0).toFixed(1)}
          unit=" cm"
        />
      </div>

      <p className="mt-4 text-[11px] text-slate-400 font-mono text-right">
        Stamp: {formatTimestamp(data.timestamp)}
      </p>
    </Panel>
  )
}
