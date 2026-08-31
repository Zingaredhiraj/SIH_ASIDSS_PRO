import React from 'react'

const CONFIGS: Record<string, { bg: string; dot: string; text: string; label: string }> = {
  OK:           { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'OK'          },
  SECURE:       { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Secure'      },
  SAFE:         { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Safe'        },
  ON_DUTY:      { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'On Duty'     },
  DELIVERED:    { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Delivered'   },
  OPERATIONAL:  { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Operational' },
  RESOLVED:     { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Resolved'    },
  AVAILABLE:    { bg: 'rgba(23,168,142,0.12)', dot: '#17A88E', text: '#17A88E', label: 'Available'   },
  AT_MUSTER:    { bg: 'rgba(47,143,224,0.12)',  dot: '#2F8FE0', text: '#2F8FE0', label: 'At Muster'  },
  EN_ROUTE:     { bg: 'rgba(47,143,224,0.12)',  dot: '#2F8FE0', text: '#2F8FE0', label: 'En Route'   },
  PLANNED:      { bg: 'rgba(47,143,224,0.12)',  dot: '#2F8FE0', text: '#2F8FE0', label: 'Planned'    },
  WARNING:      { bg: 'rgba(217,164,65,0.14)',  dot: '#D9A441', text: '#D9A441', label: 'Warning'    },
  ALERT:        { bg: 'rgba(217,164,65,0.14)',  dot: '#D9A441', text: '#D9A441', label: 'Alert'      },
  IN_FIELD_OPS: { bg: 'rgba(224,138,60,0.14)',  dot: '#E08A3C', text: '#E08A3C', label: 'Field Ops'  },
  MONITORING:   { bg: 'rgba(217,164,65,0.14)',  dot: '#D9A441', text: '#D9A441', label: 'Monitoring' },
  OPEN:         { bg: 'rgba(217,164,65,0.14)',  dot: '#D9A441', text: '#D9A441', label: 'Open'       },
  OFF_DUTY:     { bg: 'rgba(100,116,139,0.10)', dot: '#94A3B8', text: '#64748B', label: 'Off Duty'   },
  CRITICAL:     { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Critical'   },
  DENIED:       { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Denied'     },
  ACTIVE:       { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Active'     },
  MISSING:      { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Missing'    },
  UNAVAILABLE:  { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Unavailable'},
  LOW:          { bg: 'rgba(220,91,84,0.12)',   dot: '#DC5B54', text: '#DC5B54', label: 'Low'        },
}

export function StatusBadge({ status, className = '' }: { status?: string; className?: string }) {
  if (!status) return null
  const key = status.toUpperCase().replace(/ /g, '_')
  const cfg = CONFIGS[key] || { bg: 'rgba(100,116,139,0.10)', dot: '#94A3B8', text: '#64748B', label: status }
  const isPulse = ['CRITICAL', 'ACTIVE', 'ALERT', 'MISSING'].includes(key)

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${className}`}
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${isPulse ? 'animate-pulse' : ''}`}
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  )
}
