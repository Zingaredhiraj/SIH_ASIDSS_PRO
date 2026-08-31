'use client'
import { useEffect, useState } from 'react'
import { useStation } from '@/components/common/StationSelector'
import { fetchShipments, fetchInventory, fetchTransportWindows } from '@/lib/api/logistics'
import { ResupplyShipment, InventoryItem } from '@/lib/types'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { ResupplySchedule } from '@/components/logistics/ResupplySchedule'
import { CargoTracker } from '@/components/logistics/CargoTracker'
import { TransportWindowWidget } from '@/components/logistics/TransportWindowWidget'

export default function LogisticsPage() {
  const { stationId } = useStation()
  const [shipments, setShipments] = useState<ResupplyShipment[]>([])
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [windows, setWindows] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async () => {
    try {
      const [s, i, w] = await Promise.all([
        fetchShipments(stationId),
        fetchInventory(stationId),
        fetchTransportWindows(stationId)
      ])
      setShipments(s.data)
      setInventory(i.data)
      setWindows(w.data)
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [stationId])

  if (error) return <ErrorFallback message="Failed to load logistics data" onRetry={loadData} />

  return (
    <div className="space-y-6">
      <header className="border-b border-polar-border pb-4">
        <h1 className="text-3xl font-bold text-white tracking-wide">Supply Chain & Logistics</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 4 • {stationId}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ResupplySchedule shipments={shipments} loading={loading} />
        </div>
        <div>
          <TransportWindowWidget data={windows} loading={loading} />
        </div>
      </div>

      <div className="h-[500px]">
        <CargoTracker inventory={inventory} loading={loading} />
      </div>
    </div>
  )
}
