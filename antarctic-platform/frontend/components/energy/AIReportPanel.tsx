'use client'
import React, { useEffect, useState } from 'react'
import { Panel } from '../common/Panel'
import { fetchEnergyReport, EnergyReport } from '@/lib/api/energy'
import { RefreshCcw, Sparkles } from 'lucide-react'

export function AIReportPanel({ stationId }: { stationId: string }) {
  const [report, setReport] = useState<EnergyReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const loadReport = async () => {
    setLoading(true)
    setError(false)
    try {
      const res = await fetchEnergyReport(stationId)
      setReport(res.data)
    } catch (e) {
      setError(true)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadReport()
  }, [stationId])

  return (
    <Panel 
      title="AI Optimization Insights" 
      subtitle="Autonomous microgrid & operational recommendations"
      accent="purple"
      action={
        <button onClick={loadReport} disabled={loading} className="p-1 text-[#94A3B8] hover:text-[#2F8FE0] disabled:opacity-50 transition-colors">
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      {error && <div className="text-[#DC5B54] text-xs font-semibold">Failed to generate AI report</div>}
      
      {report ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3 bg-[#EFF4F9] p-3.5 rounded-[12px] border border-[#E4EBF2]">
            <Sparkles className="w-5 h-5 text-[#8B6FE0] flex-shrink-0 mt-0.5" />
            <p className="text-xs text-[#12233B] leading-relaxed font-medium">{report.summary}</p>
          </div>

          {report.priority_alerts && report.priority_alerts.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-[#DC5B54] mb-2 uppercase tracking-wider">Priority Alerts</h4>
              <ul className="space-y-1.5">
                {report.priority_alerts.map((a, i) => (
                  <li key={i} className="text-xs text-[#DC5B54] bg-[rgba(220,91,84,0.08)] p-2 rounded-[8px] flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC5B54] flex-shrink-0" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="text-[11px] font-bold text-[#2F8FE0] mb-2 uppercase tracking-wider">Recommendations</h4>
            <ul className="space-y-1.5">
              {report.recommendations && report.recommendations.map((r, i) => (
                <li key={i} className="text-xs text-[#64748B] bg-white border border-[#E4EBF2] p-2 rounded-[8px] flex items-center gap-2 font-medium">
                  <span className="text-[#17A88E] font-bold">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        loading ? (
          <div className="space-y-3">
            <div className="h-14 skeleton w-full" />
            <div className="h-10 skeleton w-full" />
          </div>
        ) : null
      )}
    </Panel>
  )
}
