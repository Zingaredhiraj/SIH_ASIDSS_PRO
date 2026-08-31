'use client'
import React, { useState } from 'react'
import { Panel } from '../common/Panel'
import { WeatherReading } from '@/lib/types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts'

export function WeatherTrendChart({ data, loading }: { data: WeatherReading[], loading: boolean }) {
  const [metric, setMetric] = useState<'temperature' | 'wind_speed' | 'pressure'>('wind_speed')

  if (loading) return <Panel title="48h Trend Analysis" isLoading className="h-full" />

  const getMetricConfig = () => {
    switch (metric) {
      case 'temperature': return { color: '#00d4ff', unit: '°C', threshold: -40, type: 'lt' };
      case 'wind_speed': return { color: '#f59e0b', unit: 'km/h', threshold: 60, type: 'gt' };
      case 'pressure': return { color: '#a78bfa', unit: 'hPa', threshold: null, type: null };
    }
  }
  const config = getMetricConfig();

  return (
    <Panel 
      title="48h Trend Analysis" 
      action={
        <div className="flex bg-navy-900 rounded border border-polar-border overflow-hidden text-xs">
          <button onClick={() => setMetric('wind_speed')} className={`px-3 py-1 ${metric === 'wind_speed' ? 'bg-ice-600 text-white' : 'text-gray-400 hover:text-white'}`}>Wind</button>
          <button onClick={() => setMetric('temperature')} className={`px-3 py-1 border-l border-r border-polar-border ${metric === 'temperature' ? 'bg-ice-600 text-white' : 'text-gray-400 hover:text-white'}`}>Temp</button>
          <button onClick={() => setMetric('pressure')} className={`px-3 py-1 ${metric === 'pressure' ? 'bg-ice-600 text-white' : 'text-gray-400 hover:text-white'}`}>Pressure</button>
        </div>
      }
      className="h-full"
    >
      <div className="w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" vertical={false} />
            <XAxis dataKey="timestamp" tick={false} axisLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0d1b2a', borderColor: '#1a3a5c' }}
              itemStyle={{ color: config.color, fontFamily: 'monospace' }}
              labelStyle={{ display: 'none' }}
              formatter={(val) => {
                const num = typeof val === 'number' ? val : Number(val ?? 0);
                return [`${num} ${config.unit}`, metric.replace('_', ' ')];
              }}

            />
            {config.threshold && (
              <ReferenceLine y={config.threshold} stroke="#dc2626" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'ALERT THRESHOLD', fill: '#dc2626', fontSize: 10 }} />
            )}
            <Line type="monotone" dataKey={metric} stroke={config.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  )
}
