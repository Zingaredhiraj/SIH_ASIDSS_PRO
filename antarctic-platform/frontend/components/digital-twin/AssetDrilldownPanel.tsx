import React from 'react'
import { Asset3D } from '@/lib/types'
import { X, Activity, Thermometer, Clock } from 'lucide-react'

export function AssetDrilldownPanel({ asset, onClose }: { asset: Asset3D | null, onClose: () => void }) {
  if (!asset) return null;

  return (
    <div className="absolute top-0 right-0 bottom-0 w-80 bg-navy-900/95 border-l border-ice-500/30 backdrop-blur-md shadow-2xl transform transition-transform duration-300 flex flex-col z-20">
      <div className="p-4 border-b border-polar-border flex justify-between items-start">
        <div>
          <div className="text-[10px] text-ice-500 font-mono mb-1">{asset.type} • {asset.parent_area}</div>
          <h3 className="text-lg font-bold text-white">{asset.name}</h3>
        </div>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="text-xs text-gray-500 font-mono mb-2 uppercase">Status</div>
          <div className="flex items-center text-green-500 text-sm font-bold bg-green-900/20 px-3 py-1.5 rounded border border-green-500/30 w-fit">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            OPERATIONAL
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 font-mono mb-3 uppercase">Live Telemetry</div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-navy-800 p-3 rounded">
              <Activity className="w-4 h-4 text-ice-400 mb-1" />
              <div className="text-xs text-gray-400">Power Draw</div>
              <div className="text-lg font-mono text-white">42.5 kW</div>
            </div>
            <div className="bg-navy-800 p-3 rounded">
              <Thermometer className="w-4 h-4 text-amber-500 mb-1" />
              <div className="text-xs text-gray-400">Internal Temp</div>
              <div className="text-lg font-mono text-white">18.2 °C</div>
            </div>
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 font-mono mb-3 uppercase">Maintenance</div>
          <div className="space-y-2 text-sm text-gray-300">
            <div className="flex justify-between">
              <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-500" /> Uptime</span>
              <span className="font-mono">1,402 hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-gray-500" /> Last Service</span>
              <span className="font-mono">12 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
