import React from 'react'
import { User } from '@/lib/types'
import { formatRelativeTime } from '@/lib/utils/formatters'
import { Shield } from 'lucide-react'

export function UserTable({ users = [], loading }: { users?: User[], loading: boolean }) {
  if (loading) return <div className="text-center py-8 text-gray-500 font-mono">Loading users...</div>

  const safeUsers = Array.isArray(users) ? users : []

  return (
    <div className="overflow-x-auto h-full">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-400 bg-navy-900/50 uppercase font-mono sticky top-0">
          <tr>
            <th className="px-4 py-3 font-medium">User</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Station</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Last Login</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-polar-border">
          {safeUsers.length === 0 ? (
            <tr key="empty-users"><td colSpan={5} className="text-center py-8 text-gray-500 font-mono text-xs">No registered users</td></tr>
          ) : (
            safeUsers.map((u, idx) => {
              const key = u.user_id || (u as any)._id || u.email || `user-${idx}`
              return (
                <tr key={key} className="hover:bg-navy-700/30">
                  <td className="px-4 py-3">
                    <div className="text-white font-medium">{u.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center text-xs font-mono bg-navy-900 border border-polar-border px-2 py-1 rounded w-fit text-ice-400">
                      <Shield className="w-3 h-3 mr-1 text-ice-500" />
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-300">{u.station_id || 'GLOBAL'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                      {u.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs font-mono">{u.last_login ? formatRelativeTime(u.last_login) : 'Recent'}</td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
