'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { StationSelector } from './StationSelector'
import {
  LayoutDashboard, Users, ShieldCheck, Package, CloudSun,
  Bot, Siren, Layers3, SlidersHorizontal, LogOut, Snowflake
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, module: 'M1', perm: 'VIEW_DASHBOARD',   color: 'text-ocean-600' },
  { href: '/personnel',    label: 'Personnel',    icon: Users,           module: 'M2', perm: 'VIEW_PERSONNEL',   color: 'text-violet-600' },
  { href: '/security',     label: 'Security',     icon: ShieldCheck,     module: 'M3', perm: 'VIEW_SECURITY',    color: 'text-amber-600'  },
  { href: '/logistics',    label: 'Logistics',    icon: Package,         module: 'M4', perm: 'VIEW_LOGISTICS',   color: 'text-emerald-600' },
  { href: '/environment',  label: 'Environment',  icon: CloudSun,        module: 'M5', perm: 'VIEW_ENVIRONMENT', color: 'text-sky-600'     },
  { href: '/polar-ai',     label: 'Polar AI',     icon: Bot,             module: 'M7', perm: 'USE_POLAR_AI',     color: 'text-purple-600'  },
  { href: '/emergency',    label: 'Emergency',    icon: Siren,           module: 'M8', perm: 'VIEW_EMERGENCY',   color: 'text-red-600'     },
  { href: '/digital-twin', label: 'Digital Twin', icon: Layers3,         module: 'M9', perm: 'VIEW_DIGITAL_TWIN',color: 'text-indigo-600'  },
  { href: '/admin/users',  label: 'Admin',        icon: SlidersHorizontal, module: 'M10',perm: 'MANAGE_USERS',  color: 'text-slate-600'   },
]

const ROLE_COLORS: Record<string, string> = {
  admin:            'bg-red-100 text-red-700',
  operator:         'bg-ocean-100 text-ocean-700',
  scientist:        'bg-emerald-100 text-emerald-700',
  security_officer: 'bg-amber-100 text-amber-700',
  ncpor_hq:         'bg-purple-100 text-purple-700',
}

export function NavigationSidebar() {
  const pathname = usePathname()
  const { user, logout, hasPermission } = useAuth()

  if (pathname === '/login') return null

  const roleColor = ROLE_COLORS[user?.role || ''] || 'bg-slate-100 text-slate-700'

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col h-full z-30 shadow-[1px_0_12px_rgba(15,23,42,0.06)]">

      {/* Brand header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-ocean-gradient flex items-center justify-center shadow-glow-ocean flex-shrink-0">
            <Snowflake className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-slate-900 leading-tight tracking-tight">ASIDSS</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">MoES · NCPOR</p>
          </div>
        </div>
        <StationSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          if (!hasPermission(item.perm)) return null
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item group relative ${isActive ? 'nav-item-active' : ''}`}
            >
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-ocean-600 rounded-r-full" />
              )}
              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-ocean-600' : item.color} transition-colors`} />
              <span className="flex-1 text-[13px]">{item.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono font-semibold 
                ${isActive ? 'bg-ocean-100 text-ocean-600' : 'bg-slate-100 text-slate-400'}`}>
                {item.module}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      {user && (
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-ocean-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {(user.name || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-800 truncate">{user.name}</div>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wide ${roleColor}`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
