import React from 'react'

interface PanelProps {
  children?: React.ReactNode
  title?: string
  subtitle?: string
  className?: string
  isLoading?: boolean
  action?: React.ReactNode
  accent?: 'cyan' | 'teal' | 'navy' | 'orange' | 'amber' | 'red' | 'purple' | string
  noPadding?: boolean
}

const ACCENT_COLORS: Record<string, string> = {
  cyan:   'bg-[#2F8FE0]',
  teal:   'bg-[#17A88E]',
  navy:   'bg-[#12233B]',
  orange: 'bg-[#E08A3C]',
  amber:  'bg-[#D9A441]',
  red:    'bg-[#DC5B54]',
  purple: 'bg-[#8B6FE0]',
  // Legacy compat
  ocean:   'bg-[#2F8FE0]',
  ice:     'bg-[#17A88E]',
  success: 'bg-[#17A88E]',
  warning: 'bg-[#D9A441]',
  danger:  'bg-[#DC5B54]',
  violet:  'bg-[#8B6FE0]',
  slate:   'bg-[#64748B]',
}

export function Panel({
  children,
  title,
  subtitle,
  className = '',
  isLoading = false,
  action,
  accent = 'cyan',
  noPadding = false,
}: PanelProps) {
  const accentClass = ACCENT_COLORS[accent] || ACCENT_COLORS.cyan

  return (
    <div className={`bg-white border border-[#E4EBF2] rounded-[20px] shadow-card flex flex-col overflow-hidden ${className}`}
      style={{ animation: 'fadeIn 0.25s ease-out' }}>
      {(title || subtitle) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E4EBF2] bg-white rounded-t-[20px]">
          <div className="flex items-center gap-3">
            <div className={`w-[3px] h-6 rounded-full flex-shrink-0 ${accentClass}`} />
            <div>
              {title && <h3 className="font-display font-extrabold text-[14px] text-[#12233B] leading-tight">{title}</h3>}
              {subtitle && <p className="text-[11.5px] text-[#94A3B8] mt-0.5 leading-tight">{subtitle}</p>}
            </div>
          </div>
          {action && <div className="ml-auto">{action}</div>}
        </div>
      )}
      <div className={`flex-1 flex flex-col min-h-0 overflow-y-auto ${noPadding ? '' : 'p-5'}`}>
        {isLoading ? (
          <div className="space-y-3 p-5">
            <div className="h-8 skeleton w-3/4" />
            <div className="h-8 skeleton w-full" />
            <div className="h-8 skeleton w-5/6" />
            <div className="h-8 skeleton w-full" />
          </div>
        ) : children}
      </div>
    </div>
  )
}
