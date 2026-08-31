import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  module?: string
  stationId?: string
  action?: React.ReactNode
  accent?: string
  icon?: React.ReactNode
}

export function PageHeader({ title, subtitle, module, stationId, action, accent = 'bg-ocean-gradient', icon }: PageHeaderProps) {
  return (
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-start gap-4">
        {icon && (
          <div className={`w-12 h-12 rounded-xl ${accent} flex items-center justify-center shadow-card flex-shrink-0 mt-0.5`}>
            <div className="text-white">{icon}</div>
          </div>
        )}
        <div>
          <div className="flex items-center gap-3 mb-0.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
            {module && (
              <span className="text-[10px] font-mono font-bold text-ocean-600 bg-arctic-100 px-2 py-0.5 rounded-full border border-ocean-200">
                {module}
              </span>
            )}
          </div>
          {(subtitle || stationId) && (
            <p className="text-sm text-slate-500 font-medium">
              {subtitle}{subtitle && stationId && ' · '}{stationId && <span className="font-mono text-ocean-600 font-semibold">{stationId}</span>}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex items-center gap-2 flex-shrink-0">{action}</div>}
    </div>
  )
}
