import React from 'react'
import { AuditLog } from '@/lib/types'
import { formatTimestamp } from '@/lib/utils/formatters'

export function AuditTimeline({ logs = [], loading }: { logs?: AuditLog[], loading: boolean }) {
  if (loading) return <div className="text-center py-8 text-gray-500 font-mono">Loading audit log...</div>

  const safeLogs = Array.isArray(logs) ? logs : []

  return (
    <div className="overflow-x-auto h-full">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-400 bg-navy-900/50 uppercase font-mono sticky top-0">
          <tr>
            <th className="px-4 py-3 font-medium">Timestamp</th>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Resource</th>
            <th className="px-4 py-3 font-medium">Result</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-polar-border">
          {safeLogs.length === 0 ? (
            <tr key="empty-logs"><td colSpan={5} className="text-center py-8 text-gray-500 font-mono text-xs">No audit records available</td></tr>
          ) : (
            safeLogs.map((log, idx) => {
              const key = log.log_id || (log as any)._id || `${log.timestamp}-${idx}`
              return (
                <tr key={key} className="hover:bg-navy-700/30">
                  <td className="px-4 py-2 font-mono text-gray-400 text-xs">{formatTimestamp(log.timestamp)}</td>
                  <td className="px-4 py-2">
                    <span className="text-white">{log.user_id || 'System'}</span>
                    <span className="ml-2 text-[10px] bg-navy-900 border border-polar-border px-1.5 py-0.5 rounded text-gray-500 font-mono">
                      {log.role || 'USER'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-ice-400 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-2 text-gray-300 font-mono text-xs truncate max-w-[200px]">{log.resource}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.result === 'SUCCESS' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {log.result || 'SUCCESS'}
                    </span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
