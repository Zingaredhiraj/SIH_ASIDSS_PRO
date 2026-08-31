import React from 'react'
import { Role } from '@/lib/types'
import { Check, X } from 'lucide-react'

export function RoleMatrix({ roles, loading }: { roles: Role[], loading: boolean }) {
  if (loading) return <div className="text-center py-8 text-gray-500">Loading matrix...</div>

  // Extract all unique permissions
  const allPerms = Array.from(new Set(roles.flatMap(r => r.permissions))).sort();

  return (
    <div className="overflow-x-auto overflow-y-auto h-full">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-gray-400 bg-navy-900/90 uppercase font-mono sticky top-0 z-10 shadow">
          <tr>
            <th className="px-4 py-3 font-medium bg-navy-900 border-b border-polar-border">Permission</th>
            {roles.map(r => (
              <th key={r.role_name} className="px-4 py-3 font-medium text-center bg-navy-900 border-b border-polar-border border-l">
                {r.role_name.replace('_', ' ')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-polar-border">
          {allPerms.map(perm => (
            <tr key={perm} className="hover:bg-navy-700/30">
              <td className="px-4 py-2 font-mono text-gray-300 text-xs">{perm}</td>
              {roles.map(r => {
                const hasPerm = r.permissions.includes(perm);
                return (
                  <td key={r.role_name} className="px-4 py-2 text-center border-l border-polar-border">
                    {hasPerm ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-gray-600 mx-auto" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
