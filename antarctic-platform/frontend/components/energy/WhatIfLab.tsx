'use client'
import React, { useState, useEffect } from 'react'
import { Panel } from '../common/Panel'
import { fetchWhatIf, WhatIfResult } from '@/lib/api/energy'
import { TelemetryData } from '@/lib/types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { getHealthGradeColor } from '@/lib/utils/formatters'

export function WhatIfLab({ stationId, currentData }: { stationId: string, currentData: TelemetryData }) {
  const [solarMult, setSolarMult] = useState(1.0)
  const [windMult, setWindMult] = useState(1.0)
  const [loadRed, setLoadRed] = useState(0)
  const [result, setResult] = useState<WhatIfResult | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true)
      fetchWhatIf(stationId, { 
        solar_multiplier: solarMult, 
        wind_multiplier: windMult, 
        load_reduction_pct: loadRed 
      })
      .then(res => setResult(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
    }, 500)
    return () => clearTimeout(timer)
  }, [stationId, solarMult, windMult, loadRed])

  const chartData = [
    { name: 'Health', current: currentData.health_index?.score || 80, projected: result?.new_health_index.score || 85 },
    { name: 'Fuel Save %', current: 0, projected: result?.fuel_saved_pct || 12 }
  ]

  return (
    <Panel title="What-If Simulation Lab" subtitle="Adjust microgrid parameters to project outcomes" accent="cyan">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        <div className="space-y-4 border-b md:border-b-0 md:border-r border-[#E4EBF2] pb-4 md:pb-0 md:pr-6">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-[#12233B]">
              <span className="text-[#64748B]">Solar Multiplier</span>
              <span className="font-mono text-[#2F8FE0] font-bold">{solarMult.toFixed(1)}x</span>
            </div>
            <input type="range" min="0" max="3" step="0.1" value={solarMult} onChange={e => setSolarMult(parseFloat(e.target.value))} className="w-full accent-[#2F8FE0]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-[#12233B]">
              <span className="text-[#64748B]">Wind Multiplier</span>
              <span className="font-mono text-[#17A88E] font-bold">{windMult.toFixed(1)}x</span>
            </div>
            <input type="range" min="0" max="3" step="0.1" value={windMult} onChange={e => setWindMult(parseFloat(e.target.value))} className="w-full accent-[#17A88E]" />
          </div>
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1 text-[#12233B]">
              <span className="text-[#64748B]">Load Reduction</span>
              <span className="font-mono text-[#DC5B54] font-bold">-{loadRed}%</span>
            </div>
            <input type="range" min="0" max="50" step="5" value={loadRed} onChange={e => setLoadRed(parseFloat(e.target.value))} className="w-full accent-[#DC5B54]" />
          </div>
        </div>

        <div className="relative flex flex-col justify-between">
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10">
              <span className="text-xs font-bold text-[#2F8FE0] animate-pulse">Recalculating...</span>
            </div>
          )}
          {result && (
            <div className="h-full flex flex-col justify-between">
              <div className="flex justify-around mb-3">
                <div className="text-center">
                  <div className="text-[10.5px] text-[#94A3B8] uppercase font-bold tracking-wider">Proj. Health</div>
                  <div className="text-2xl font-display font-extrabold text-[#17A88E]">
                    {result.new_health_index.score}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-[10.5px] text-[#94A3B8] uppercase font-bold tracking-wider">Autonomy Delta</div>
                  <div className="text-2xl font-display font-extrabold text-[#2F8FE0]">
                    {result.autonomy_days_change > 0 ? '+' : ''}{result.autonomy_days_change}d
                  </div>
                </div>
              </div>
              
              <div className="flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#EEF4F9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} />
                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E4EBF2', borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="current" fill="#94A3B8" radius={[4, 4, 0, 0]} name="Current" />
                    <Bar dataKey="projected" fill="#2F8FE0" radius={[4, 4, 0, 0]} name="Projected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {result.warnings.length > 0 && (
                <div className="mt-2 text-[11px] text-[#D9A441] bg-[rgba(217,164,65,0.14)] p-2 rounded-[8px] font-medium">
                  ⚠ {result.warnings[0]}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Panel>
  )
}
