import React from 'react'
import { HazardThreshold, WeatherReading } from '@/lib/types'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function HazardThresholdBanner({ hazards, currentWeather }: { hazards: HazardThreshold[], currentWeather: WeatherReading }) {
  return (
    <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between">
      <div className="flex items-start mb-4 md:mb-0">
        <AlertTriangle className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 animate-pulse" />
        <div>
          <h3 className="text-red-500 font-bold uppercase tracking-wider text-sm">Active Environmental Hazards Detected</h3>
          <ul className="mt-1 space-y-1">
            {hazards.map(h => {
              const val = (currentWeather as any)[h.metric];
              return (
                <li key={h.threshold_id} className="text-gray-300 text-xs font-mono">
                  {h.metric.replace('_', ' ')} is {val} (Threshold: {h.comparison === 'gt' ? '>' : '<'} {h.threshold_value})
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      
      <Link href="/emergency" className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors whitespace-nowrap">
        View Emergency Protocols
        <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  )
}
