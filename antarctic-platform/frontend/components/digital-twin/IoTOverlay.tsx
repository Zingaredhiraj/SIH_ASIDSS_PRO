'use client'
import React, { useEffect, useState } from 'react'
import { fetchTelemetry } from '@/lib/api/energy'
import { useIncidentSocket } from '@/lib/ws/useIncidentSocket'
import { TelemetryData } from '@/lib/types'

export function IoTOverlay({ stationId }: { stationId: string }) {
  const [telemetry, setTelemetry] = useState<TelemetryData | null>(null)
  const { incidents } = useIncidentSocket(stationId)

  useEffect(() => {
    fetchTelemetry(stationId).then(res => setTelemetry(res.data)).catch(() => {})
    const int = setInterval(() => {
      fetchTelemetry(stationId).then(res => setTelemetry(res.data)).catch(() => {})
    }, 10000)
    return () => clearInterval(int)
  }, [stationId])

  const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length

  return (
    <div className="absolute top-4 left-4 pointer-events-none space-y-4">
      <div className="bg-navy-900/80 backdrop-blur border border-polar-border rounded p-3 shadow-lg pointer-events-auto">
        <div className="text-xs text-ice-500 font-mono mb-1">STATION DIGITAL TWIN</div>
        <div className="text-lg font-bold text-white tracking-widest">{stationId}</div>
        <div className="text-[10px] text-gray-400 font-mono mt-1">LAT -70.76 • LNG 11.73</div>
      </div>

      {telemetry && (
        <div className="bg-navy-900/80 backdrop-blur border border-polar-border rounded p-3 shadow-lg pointer-events-auto w-48 space-y-3">
          <div>
            <div className="text-xs text-gray-400 mb-1 flex justify-between">
              <span>Grid Load</span>
              <span className="text-green-500 font-mono">{telemetry.load_kw} kW</span>
            </div>
            <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '60%' }} />
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-400 mb-1 flex justify-between">
              <span>Fuel Reserves</span>
              <span className="text-amber-500 font-mono">{telemetry.fuel_pct}%</span>
            </div>
            <div className="w-full bg-navy-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full" style={{ width: `${telemetry.fuel_pct}%` }} />
            </div>
          </div>
          
          {activeIncidents > 0 && (
            <div className="mt-2 p-2 bg-red-900/30 border border-red-500/50 rounded flex items-center justify-between">
              <span className="text-xs text-red-500 font-bold uppercase">Active Alerts</span>
              <span className="text-xs font-mono text-white bg-red-500 px-1.5 py-0.5 rounded animate-pulse">{activeIncidents}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
