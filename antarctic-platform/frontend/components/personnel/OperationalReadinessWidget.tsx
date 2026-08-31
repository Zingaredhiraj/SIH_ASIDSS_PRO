import React from 'react'
import { Panel } from '../common/Panel'
import { OperationalReadiness } from '@/lib/types'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { StatusBadge } from '../common/StatusBadge'

export function OperationalReadinessWidget({ data, loading }: { data: OperationalReadiness | null, loading: boolean }) {
  if (loading || !data) return <Panel title="Operational Readiness" isLoading />

  const chartData = [
    { name: 'On Duty', value: data.on_duty_count, color: '#10b981' },
    { name: 'In Field', value: data.in_field_count, color: '#f59e0b' },
    { name: 'Off Duty', value: data.off_duty_count, color: '#6b7280' }
  ];

  return (
    <Panel title="Operational Readiness" className="h-full">
      <div className="flex flex-col items-center mb-6">
        <div className="text-5xl font-mono text-ice-400 font-bold mb-2">
          {data.readiness_pct}%
        </div>
        <StatusBadge status={data.risk_level === 'LOW' ? 'OK' : data.risk_level === 'MEDIUM' ? 'WARNING' : 'CRITICAL'} />
      </div>

      <div className="h-40 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value" stroke="none">
              {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#0d1b2a', borderColor: '#1a3a5c' }} itemStyle={{ color: '#fff' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        <div className="text-xs text-gray-500 font-mono uppercase mb-2">By Department</div>
        {Object.entries(data.by_department).map(([dept, count]) => (
          <div key={dept} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{dept}</span>
            <span className="text-sm font-mono text-white bg-navy-900 px-2 py-0.5 rounded border border-polar-border">
              {count}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  )
}
