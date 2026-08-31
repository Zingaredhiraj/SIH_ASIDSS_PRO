import React from 'react'
import { Panel } from '../common/Panel'
import { Wind, Anchor } from 'lucide-react'

export function TransportWindowWidget({ data, loading }: { data?: any, loading: boolean }) {
  if (loading) return <Panel title="Transport Windows" subtitle="Weather Go/No-Go" isLoading className="h-full" />

  // Guard: handle null/undefined/empty data gracefully
  const safeData = data || {}

  const airStatus  = safeData?.air?.status  ?? (safeData?.air_available  === false ? 'UNAVAILABLE' : 'AVAILABLE')
  const airReason  = safeData?.air?.reason  ?? safeData?.reason ?? 'Runway conditions nominal'
  const airWindow  = safeData?.air?.next_window ?? (airStatus === 'AVAILABLE' ? 'Current (Nominal)' : 'Next 48h assessment')

  const seaStatus  = safeData?.sea?.status  ?? (safeData?.sea_available  === false ? 'UNAVAILABLE' : 'AVAILABLE')
  const seaReason  = safeData?.sea?.reason  ?? 'Ice clearance acceptable for heavy transport'
  const seaWindow  = safeData?.sea?.next_window ?? (seaStatus === 'AVAILABLE' ? 'Current' : 'Spring season')

  const isAirOk = airStatus === 'AVAILABLE'
  const isSeaOk = seaStatus === 'AVAILABLE'

  return (
    <Panel title="Transport Windows" subtitle="Weather & Environment Go/No-Go" className="h-full" accent="ice">
      <div className="space-y-4">
        {/* Air Operations */}
        <div className={`p-4 rounded-xl border-2 transition-all ${
          isAirOk
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
              <Wind className={`w-4 h-4 ${isAirOk ? 'text-emerald-600' : 'text-red-500'}`} />
              Air Operations
              <span className="text-xs text-slate-500 font-normal">(C-17 / Twin Otter)</span>
            </h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isAirOk ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isAirOk ? '✓ GO' : '✗ NO-GO'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mb-1">{airReason}</p>
          <p className="text-xs text-slate-400 font-mono">
            Window: <span className={`font-semibold ${isAirOk ? 'text-emerald-700' : 'text-red-600'}`}>{airWindow}</span>
          </p>
        </div>

        {/* Sea / Icebreaker Operations */}
        <div className={`p-4 rounded-xl border-2 transition-all ${
          isSeaOk
            ? 'bg-emerald-50 border-emerald-200'
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex justify-between items-center mb-2.5">
            <h4 className="font-semibold text-slate-800 flex items-center gap-2 text-sm">
              <Anchor className={`w-4 h-4 ${isSeaOk ? 'text-emerald-600' : 'text-red-500'}`} />
              Sea / Icebreaker Ops
            </h4>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isSeaOk ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
            }`}>
              {isSeaOk ? '✓ GO' : '✗ NO-GO'}
            </span>
          </div>
          <p className="text-xs text-slate-600 font-medium mb-1">{seaReason}</p>
          <p className="text-xs text-slate-400 font-mono">
            Window: <span className={`font-semibold ${isSeaOk ? 'text-emerald-700' : 'text-red-600'}`}>{seaWindow}</span>
          </p>
        </div>
      </div>
    </Panel>
  )
}
