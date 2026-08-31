'use client'
import React from 'react'
import { Panel } from '../common/Panel'
import { Incident } from '@/lib/types'

export function EvacuationRouteViewer({ stationId, incidents }: { stationId: string, incidents: Incident[] }) {
  const isEmergency = incidents.filter(i => i.status === 'ACTIVE').length > 0;

  return (
    <Panel title="Evacuation Route Mapping" subtitle="Dynamic Pathfinding" className="h-full">
      <div className="w-full h-full relative bg-navy-900 border border-polar-border rounded-lg overflow-hidden flex items-center justify-center">
        
        {/* Simple SVG schematic representing the station */}
        <svg viewBox="0 0 400 300" className="w-full h-full opacity-80">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a3a5c" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill="url(#grid)" />
          
          {/* Rooms */}
          <rect x="50" y="50" width="120" height="80" fill="#0d1b2a" stroke="#4b5563" strokeWidth="2" />
          <text x="110" y="95" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">LIVING QTRS</text>
          
          <rect x="200" y="50" width="150" height="100" fill="#0d1b2a" stroke="#4b5563" strokeWidth="2" />
          <text x="275" y="105" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">SCIENCE LAB</text>
          
          <rect x="50" y="160" width="100" height="90" fill="#0d1b2a" stroke="#4b5563" strokeWidth="2" />
          <text x="100" y="210" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">GENERATOR</text>
          
          <rect x="180" y="180" width="80" height="70" fill="#0d1b2a" stroke="#4b5563" strokeWidth="2" />
          <text x="220" y="220" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">COMMS</text>
          
          {/* Assembly Point */}
          <circle cx="350" cy="250" r="15" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
          <circle cx="350" cy="250" r="3" fill="#10b981" />
          <text x="350" y="280" fill="#10b981" fontSize="10" textAnchor="middle" fontFamily="monospace">ASSEMBLY</text>
          
          {/* Evacuation Paths (Only show if emergency) */}
          {isEmergency && (
            <>
              {/* Path 1 */}
              <path d="M 110 130 L 110 150 L 275 150 L 275 180" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
              {/* Path 2 */}
              <path d="M 150 210 L 180 210 L 275 210 L 275 250 L 335 250" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
            </>
          )}
        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes dash {
            to { stroke-dashoffset: -10; }
          }
        `}} />
      </div>
    </Panel>
  )
}
