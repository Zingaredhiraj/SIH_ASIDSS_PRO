'use client'
import { useState } from 'react'
import { useStation } from '@/components/common/StationSelector'
import { ChatWindow } from '@/components/polar-ai/ChatWindow'
import { ContextPanel } from '@/components/polar-ai/ContextPanel'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'

export default function PolarAIPage() {
  const { stationId } = useStation()
  const [contextOpen, setContextOpen] = useState(true)

  return (
    <div className="h-full flex flex-col space-y-4">
      <header className="flex justify-between items-end border-b border-polar-border pb-2 flex-shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-wide">Polar AI Assistant</h1>
          <p className="text-gray-400 font-mono text-sm mt-1">MODULE 7 • {stationId}</p>
        </div>
        <button 
          onClick={() => setContextOpen(!contextOpen)}
          className="flex items-center text-sm text-ice-400 hover:text-ice-300 transition-colors"
        >
          {contextOpen ? <><PanelLeftClose className="w-4 h-4 mr-1" /> Hide Context</> : <><PanelLeftOpen className="w-4 h-4 mr-1" /> Show Context</>}
        </button>
      </header>

      <div className="flex-1 flex gap-4 min-h-0">
        <div className={`flex-1 transition-all ${contextOpen ? 'lg:w-3/5' : 'w-full'}`}>
          <ChatWindow stationId={stationId} />
        </div>
        {contextOpen && (
          <div className="hidden lg:block w-2/5 shrink-0 transition-all">
            <ContextPanel stationId={stationId} />
          </div>
        )}
      </div>
    </div>
  )
}
