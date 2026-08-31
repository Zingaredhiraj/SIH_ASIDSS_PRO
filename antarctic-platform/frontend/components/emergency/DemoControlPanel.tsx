'use client'
import React, { useState } from 'react'
import { Panel } from '../common/Panel'
import { triggerIncident } from '@/lib/api/emergency'
import { Incident } from '@/lib/types'
import { useAuth } from '@/lib/auth/AuthContext'
import { Flame, Wind, PlusSquare } from 'lucide-react'

export function DemoControlPanel({ stationId, incidents }: { stationId: string, incidents: Incident[] }) {
  const { hasPermission } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleTrigger = async (type: string, desc: string, severity: number) => {
    setLoading(true)
    try {
      await triggerIncident({ station_id: stationId, type, description: desc, severity })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (!hasPermission('TRIGGER_INCIDENT')) {
    return <Panel title="Demo Controls" className="h-full"><div className="text-sm text-gray-500">Access Restricted</div></Panel>
  }

  const hasFire = incidents.some(i => i.status === 'ACTIVE' && i.type === 'FIRE')
  const hasStorm = incidents.some(i => i.status === 'ACTIVE' && i.type === 'STORM')
  const hasMed = incidents.some(i => i.status === 'ACTIVE' && i.type === 'MEDICAL')

  return (
    <Panel title="Demo Control Panel" subtitle="Simulate Incidents" className="h-full">
      <div className="space-y-3">
        <button 
          onClick={() => handleTrigger('FIRE', 'Simulated structural fire in Generator Room A', 3)}
          disabled={loading || hasFire}
          className="w-full flex items-center justify-between p-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/50 rounded transition-colors disabled:opacity-50"
        >
          <span className="flex items-center text-red-500 font-bold text-sm">
            <Flame className="w-5 h-5 mr-2" /> TRIGGER FIRE ALERT
          </span>
        </button>

        <button 
          onClick={() => handleTrigger('MEDICAL', 'Severe trauma injury in Science Lab', 2)}
          disabled={loading || hasMed}
          className="w-full flex items-center justify-between p-3 bg-amber-900/20 hover:bg-amber-900/40 border border-amber-500/50 rounded transition-colors disabled:opacity-50"
        >
          <span className="flex items-center text-amber-500 font-bold text-sm">
            <PlusSquare className="w-5 h-5 mr-2" /> TRIGGER MEDICAL
          </span>
        </button>

        <button 
          onClick={() => handleTrigger('STORM', 'Category 3 Blizzard approaching', 2)}
          disabled={loading || hasStorm}
          className="w-full flex items-center justify-between p-3 bg-ice-900/20 hover:bg-ice-900/40 border border-ice-500/50 rounded transition-colors disabled:opacity-50"
        >
          <span className="flex items-center text-ice-400 font-bold text-sm">
            <Wind className="w-5 h-5 mr-2" /> TRIGGER STORM
          </span>
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-navy-900 border border-polar-border rounded text-xs text-gray-400">
        Note: Triggering an incident will simulate IoT alarms, trigger auto-escalation based on SOPs, and ping the Polar AI context.
      </div>
    </Panel>
  )
}
