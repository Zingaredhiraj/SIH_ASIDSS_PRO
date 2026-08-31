import React from 'react'
import { Panel } from '../common/Panel'
import { Users } from 'lucide-react'

// Note: In a real app, this would receive data from an API endpoint correlating personnel status with access logs.
// For the demo, we'll mock the field team based on the UI requirements.
export function FieldTeamCorrelation({ loading }: { loading: boolean }) {
  if (loading) return <Panel title="Field Team Correlation" isLoading className="h-full" />

  const mockFieldTeam = [
    { name: 'Dr. Sarah Chen', lastPoint: 'EXT-01 (Main Airbag)', timeOut: '2h 15m', overdue: false },
    { name: 'Raj Patel', lastPoint: 'EXT-02 (Vehicle Bay)', timeOut: '4h 30m', overdue: true },
    { name: 'Elena Rostova', lastPoint: 'EXT-02 (Vehicle Bay)', timeOut: '4h 30m', overdue: true },
  ];

  return (
    <Panel title="Field Team Correlation" subtitle="Personnel currently outside main structure" className="h-full">
      <div className="space-y-4">
        {mockFieldTeam.map((member, i) => (
          <div key={i} className={`p-3 rounded border ${member.overdue ? 'bg-amber-900/20 border-amber-500/50' : 'bg-navy-900 border-polar-border'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-sm font-medium text-white">
                <Users className="w-4 h-4 mr-2 text-gray-400" />
                {member.name}
              </div>
              {member.overdue && (
                <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-bold animate-pulse">
                  OVERDUE
                </span>
              )}
            </div>
            <div className="text-xs font-mono text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>Exited via:</span>
                <span className="text-gray-300">{member.lastPoint}</span>
              </div>
              <div className="flex justify-between">
                <span>Time out:</span>
                <span className={member.overdue ? 'text-amber-500 font-bold' : 'text-ice-400'}>{member.timeOut}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
