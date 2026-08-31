import React from 'react'
import { Panel } from '../common/Panel'
import { InventoryItem } from '@/lib/types'
import { StatusBadge } from '../common/StatusBadge'

export function CargoTracker({ inventory = [], loading }: { inventory?: InventoryItem[], loading: boolean }) {
  const safeInventory = Array.isArray(inventory) ? inventory : []

  return (
    <Panel title="Critical Inventory Tracker" className="h-full">
      <div className="overflow-x-auto h-full">
        <table className="w-full text-left text-sm">
          <thead className="text-xs text-gray-400 bg-navy-900/50 uppercase font-mono sticky top-0">
            <tr>
              <th className="px-4 py-2 font-medium">Item</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Threshold</th>
              <th className="px-4 py-2 font-medium">Days Left</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-polar-border">
            {loading ? (
              <tr key="row-loading"><td colSpan={6} className="text-center py-8 text-gray-500 font-mono text-xs">Loading inventory data...</td></tr>
            ) : safeInventory.length === 0 ? (
              <tr key="row-empty"><td colSpan={6} className="text-center py-8 text-gray-500 font-mono text-xs">No inventory items tracked</td></tr>
            ) : (
              safeInventory.map((item, idx) => {
                const key = item.item_id || (item as any)._id || `${item.item}-${idx}`
                return (
                  <tr key={key} className={`hover:bg-navy-700/30 ${item.status === 'CRITICAL' ? 'bg-red-900/10' : ''}`}>
                    <td className="px-4 py-2 text-white font-medium">{item.item}</td>
                    <td className="px-4 py-2 text-gray-400 text-xs">{item.category}</td>
                    <td className="px-4 py-2 font-mono text-gray-300">{item.current_stock} {item.unit}</td>
                    <td className="px-4 py-2 font-mono text-gray-500">{item.reorder_threshold}</td>
                    <td className={`px-4 py-2 font-mono ${item.days_remaining && item.days_remaining < 15 ? 'text-amber-500 font-bold' : 'text-gray-300'}`}>
                      {item.days_remaining || 'N/A'}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge status={item.status || 'OK'} />
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
