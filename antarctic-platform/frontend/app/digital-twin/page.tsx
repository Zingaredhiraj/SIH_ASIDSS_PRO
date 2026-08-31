'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import { useStation } from '@/components/common/StationSelector'
import { IoTOverlay } from '@/components/digital-twin/IoTOverlay'
import { AssetDrilldownPanel } from '@/components/digital-twin/AssetDrilldownPanel'
import { Asset3D } from '@/lib/types'

// Dynamically import Three.js scene so it doesn't SSR
const StationScene = dynamic(() => import('@/components/digital-twin/StationScene'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-navy-900 text-ice-500 font-mono animate-pulse">Initializing WebGL Scene...</div>
})

export default function DigitalTwinPage() {
  const { stationId } = useStation()
  const [selectedAsset, setSelectedAsset] = useState<Asset3D | null>(null)

  return (
    <div className="absolute inset-0 top-10 flex overflow-hidden">
      {/* 3D Canvas Area */}
      <div className="flex-1 relative">
        <StationScene stationId={stationId} onSelectAsset={setSelectedAsset} />
        <IoTOverlay stationId={stationId} />
      </div>

      {/* Slide-in Panel */}
      <AssetDrilldownPanel 
        asset={selectedAsset} 
        onClose={() => setSelectedAsset(null)} 
      />
    </div>
  )
}
