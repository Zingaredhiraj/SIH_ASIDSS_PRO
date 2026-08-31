'use client'
import { useStation } from '@/components/common/StationSelector'
import { useIncidentSocket } from '@/lib/ws/useIncidentSocket'
import { LiveIndicator } from '@/components/common/LiveIndicator'
import { IncidentDashboard } from '@/components/emergency/IncidentDashboard'
import { MusterTracker } from '@/components/emergency/MusterTracker'
import { EvacuationRouteViewer } from '@/components/emergency/EvacuationRouteViewer'
import { DemoControlPanel } from '@/components/emergency/DemoControlPanel'
import { AlertTriangle } from 'lucide-react'

export default function EmergencyPage() {
  const { stationId } = useStation()
  const { incidents, status } = useIncidentSocket(stationId)

  const activeCount = incidents.filter(i => i.status === 'ACTIVE').length;
  const isEmergency = activeCount > 0;

  return (
    <div className={`space-y-6 min-h-full transition-colors duration-1000 ${isEmergency ? 'bg-red-900/10' : ''}`}>
      <header className="flex justify-between items-end border-b border-polar-border pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide flex items-center">
            {isEmergency && <AlertTriangle className="w-8 h-8 text-red-500 mr-3 animate-pulse" />}
            Emergency & Incident Response
          </h1>
          <p className="text-gray-400 font-mono text-sm mt-1">MODULE 8 • {stationId}</p>
        </div>
        <LiveIndicator status={status} />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-[400px]">
            <IncidentDashboard stationId={stationId} incidents={incidents} />
          </div>
          <div className="h-[400px]">
            <EvacuationRouteViewer stationId={stationId} incidents={incidents} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="h-[400px]">
            <MusterTracker stationId={stationId} isEmergency={isEmergency} />
          </div>
          <div className="h-[400px]">
            <DemoControlPanel stationId={stationId} incidents={incidents} />
          </div>
        </div>
      </div>
    </div>
  )
}
