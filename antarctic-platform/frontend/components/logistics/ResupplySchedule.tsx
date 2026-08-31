import React, { useState } from 'react'
import { Panel } from '../common/Panel'
import { ResupplyShipment } from '@/lib/types'
import { Plane, Ship, ChevronDown, ChevronUp } from 'lucide-react'
import { StatusBadge } from '../common/StatusBadge'
import { formatTimestamp } from '@/lib/utils/formatters'

export function ResupplySchedule({ shipments = [], loading }: { shipments?: ResupplyShipment[], loading: boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (loading) return <Panel title="Resupply Schedule" isLoading className="h-full" />

  const safeShipments = Array.isArray(shipments) ? shipments : []

  return (
    <Panel title="Resupply Schedule" className="h-full">
      {safeShipments.length === 0 ? (
        <div className="text-gray-400 font-mono text-sm p-4 text-center">No scheduled shipments found</div>
      ) : (
        <div className="relative border-l-2 border-polar-border ml-3 pl-6 space-y-8 py-4">
          {safeShipments.map((s) => {
            const manifest = Array.isArray(s.cargo_manifest) ? s.cargo_manifest : []
            return (
              <div key={s.shipment_id || Math.random()} className="relative">
                <div className={`absolute -left-[35px] bg-navy-900 border-2 rounded-full p-1.5 ${s.status === 'DELIVERED' ? 'border-green-500 text-green-500' : s.status === 'EN_ROUTE' ? 'border-ice-500 text-ice-500' : 'border-gray-500 text-gray-500'}`}>
                  {s.type === 'air' ? <Plane className="w-4 h-4" /> : <Ship className="w-4 h-4" />}
                </div>
                
                <div className="bg-navy-900/80 border border-polar-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-white font-medium text-sm">{s.shipment_id || 'Shipment'}</h4>
                      <p className="text-xs text-gray-400 font-mono mt-1">ETA: {s.eta ? formatTimestamp(s.eta) : 'TBD'}</p>
                    </div>
                    <StatusBadge status={s.status || 'PLANNED'} />
                  </div>

                  {s.weather_dependency_flag && s.status !== 'DELIVERED' && (
                    <div className="mb-3 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded inline-block">
                      ⚠ Weather dependent window
                    </div>
                  )}

                  <div className="border-t border-polar-border mt-3 pt-2">
                    <button 
                      onClick={() => setExpanded(expanded === s.shipment_id ? null : s.shipment_id)}
                      className="flex items-center text-xs text-ice-400 hover:text-ice-300 w-full"
                    >
                      {expanded === s.shipment_id ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
                      {manifest.length} Cargo Items
                    </button>
                    
                    {expanded === s.shipment_id && (
                      <ul className="mt-2 space-y-1 bg-navy-800 p-2 rounded max-h-32 overflow-y-auto">
                        {manifest.length === 0 ? (
                          <li className="text-xs text-gray-500 italic">Standard station provisions</li>
                        ) : (
                          manifest.map((item, i) => (
                            <li key={i} className="flex justify-between text-xs font-mono">
                              <span className="text-gray-300">{item.item}</span>
                              <span className="text-gray-400">{item.quantity} {item.unit}</span>
                            </li>
                          ))
                        )}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Panel>
  )
}
