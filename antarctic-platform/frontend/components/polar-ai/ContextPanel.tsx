'use client'
import React, { useEffect, useState } from 'react'
import { Panel } from '../common/Panel'
import { fetchTelemetry } from '@/lib/api/energy'
import { fetchWeather } from '@/lib/api/environment'
import { fetchIncidents } from '@/lib/api/emergency'
import { TelemetryData, WeatherReading, Incident } from '@/lib/types'

export function ContextPanel({ stationId }: { stationId: string }) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const [weather, setWeather] = useState<WeatherReading | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    fetchTelemetry(stationId).then(res => setTelemetry(res.data)).catch(() => {})
    fetchWeather(stationId).then(res => setWeather(res.data)).catch(() => {})
    fetchIncidents(stationId).then(res => setIncidents(res.data || [])).catch(() => {})
  }, [stationId])

  const safeIncidents = Array.isArray(incidents) ? incidents : []
  const activeIncidents = safeIncidents.filter(i => i.status === 'ACTIVE')

  return (
    <Panel title="AI Context Window" subtitle="Real-time data fed to LLM" className="h-full">
      <div className="space-y-4">
        <div className="bg-navy-900 border border-polar-border rounded p-3">
          <h4 className="text-xs text-ice-400 font-mono uppercase mb-2 border-b border-polar-border pb-1">Active Incidents</h4>
          {activeIncidents.length === 0 ? (
            <div className="text-xs text-green-500 font-mono">None (NOMINAL)</div>
          ) : (
            <ul className="space-y-1">
              {activeIncidents.map((i, idx) => {
                const key = i.incident_id || (i as any)._id || `${i.type}-${idx}`
                return (
                  <li key={key} className="text-xs text-red-400 truncate">⚠ {i.type} - {i.description}</li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="bg-navy-900 border border-polar-border rounded p-3">
          <h4 className="text-xs text-ice-400 font-mono uppercase mb-2 border-b border-polar-border pb-1">Environment</h4>
          {weather ? (
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="text-gray-400">Temp: <span className="text-white">{weather.temperature ?? '--'}°C</span></div>
              <div className="text-gray-400">Wind: <span className="text-white">{weather.wind_speed ?? '--'}km/h</span></div>
              <div className="text-gray-400">Vis: <span className="text-white">{weather.visibility ?? '--'}m</span></div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Loading live sensors...</div>
          )}
        </div>

        <div className="bg-navy-900 border border-polar-border rounded p-3">
          <h4 className="text-xs text-ice-400 font-mono uppercase mb-2 border-b border-polar-border pb-1">Resources</h4>
          {telemetry ? (
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between text-gray-400"><span>Fuel</span><span className={(telemetry.fuel_pct ?? 100) < 20 ? 'text-red-400' : 'text-white'}>{telemetry.fuel_pct ?? '--'}%</span></div>
              <div className="flex justify-between text-gray-400"><span>Water</span><span className={(telemetry.water_pct ?? 100) < 20 ? 'text-red-400' : 'text-white'}>{telemetry.water_pct ?? '--'}%</span></div>
              <div className="flex justify-between text-gray-400"><span>Power Load</span><span className="text-white">{telemetry.load_kw ?? '--'}kW</span></div>
            </div>
          ) : (
            <div className="text-xs text-gray-500">Loading telemetry...</div>
          )}
        </div>
      </div>
    </Panel>
  )
}
