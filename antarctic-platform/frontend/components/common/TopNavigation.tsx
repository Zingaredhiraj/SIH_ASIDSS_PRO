'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { useStation } from './StationSelector'
import { LogOut } from 'lucide-react'
import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    perm: 'VIEW_DASHBOARD'   },
  { href: '/sectors',      label: 'Sectors',      perm: 'VIEW_DASHBOARD'   },
  { href: '/environment',  label: 'Environment',  perm: 'VIEW_ENVIRONMENT' },
  { href: '/logistics',    label: 'Logistics',    perm: 'VIEW_LOGISTICS'   },
  { href: '/personnel',    label: 'Personnel',    perm: 'VIEW_PERSONNEL'   },
  { href: '/security',     label: 'Security',     perm: 'VIEW_SECURITY'    },
  { href: '/polar-ai',     label: 'Polar AI',     perm: 'USE_POLAR_AI'     },
  { href: '/emergency',    label: 'Emergency',    perm: 'VIEW_EMERGENCY'   },
  { href: '/digital-twin', label: 'Digital Twin', perm: 'VIEW_DIGITAL_TWIN'},
]

const ROLE_LABELS: Record<string, string> = {
  admin: 'Station Admin', operator: 'Operator', scientist: 'Research Scientist',
  security_officer: 'Security Officer', ncpor_hq: 'NCPOR HQ'
}

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-IN', { hour12: false, timeZone: 'UTC', hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <span className="font-mono text-[11px] text-[#94A3B8] font-medium">{time} UTC</span>
}

export function TopNavigation() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()
  const { stationId, setStationId } = useStation()
  const [menuOpen, setMenuOpen] = useState(false)

  if (pathname === '/login') return null

  const initials = (user?.name || 'U').split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <header className="topbar">
      {/* Brand */}
      <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          <path d="M2 18l6-9 4 5 3-4 7 8H2z" fill="#12233B"/>
        </svg>
        <span className="font-display font-extrabold text-[14px] tracking-wide text-[#12233B]">ANTARCTICA</span>
      </Link>

      {/* Navigation links */}
      <nav className="hidden lg:flex items-center gap-0.5 relative">
        {NAV_ITEMS.map(item => {
          if (!hasPermission(item.perm)) return null
          const isActive = pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} className={`topbar-nav-link ${isActive ? 'active' : ''}`}>
              {item.label}
            </Link>
          )
        })}
        {hasPermission('MANAGE_USERS') && (
          <Link href="/admin/users" className={`topbar-nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}>
            Admin
          </Link>
        )}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right section */}
      <div className="flex items-center gap-3">

        {/* Station filter */}
        <div className="flex items-center gap-[2px] bg-white border border-[#E4EBF2] p-[3px] rounded-[11px]">
          {[
            { id: 'maitri',   label: 'Maitri'   },
            { id: 'bharati',  label: 'Bharati'  },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStationId(s.id)}
              className={`station-filter-btn ${stationId === s.id || stationId === (s.id === 'maitri' ? 'STA-001' : 'STA-002') ? 'active' : ''}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Status indicator */}
        <div className="status-pill-online hidden sm:flex">
          <div className="live-dot-white" />
          <span className="hidden md:inline">Both Online</span>
        </div>

        {/* Clock */}
        <div className="hidden lg:block"><LiveClock /></div>

        {/* User */}
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-[#E4EBF2]">
            <div className="user-avatar text-[11px]">{initials}</div>
            <div className="hidden md:block leading-tight">
              <div className="text-[12.5px] font-bold text-[#12233B]">{user.name}</div>
              <div className="text-[11px] text-[#64748B]">{ROLE_LABELS[user.role] || user.role}</div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-[#94A3B8] hover:text-[#DC5B54] hover:bg-red-50 rounded-lg transition-all duration-150 ml-1"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
