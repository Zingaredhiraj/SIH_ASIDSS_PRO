'use client'
import { AlertTriangle, Clock } from 'lucide-react'
import { useStation } from './StationSelector'
import { useState, useEffect } from 'react'

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-xs font-semibold text-slate-600">{time} UTC</span>
}

export function TopBar() {
  const { stationId } = useStation()

  return (
    <div className="bg-white border-b border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.06)] z-20">
      {/* Simulation banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-1.5 flex items-center justify-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
        <span className="text-[11px] font-semibold text-amber-700 tracking-wide">
          SIMULATION — DEMONSTRATION DATA ONLY · NOT LIVE NCPOR SYSTEMS
        </span>
        <div className="flex items-center gap-1.5 ml-4">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase">
            {stationId === 'STA-001' ? 'Maitri' : 'Bharati'} Online
          </span>
        </div>
      </div>

      {/* Top info bar */}
      <div className="px-5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Antarctic Station Digital Platform
          </span>
          <span className="text-slate-200">·</span>
          <span className="text-[11px] font-mono text-ocean-600 font-semibold">PS-26060</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="live-dot" />
          <span className="text-[11px] font-semibold text-green-600">Live Telemetry</span>
          <span className="text-slate-200">|</span>
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <LiveClock />
        </div>
      </div>
    </div>
  )
}
