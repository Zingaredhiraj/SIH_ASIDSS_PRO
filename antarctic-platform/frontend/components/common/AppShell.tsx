'use client'
import { usePathname } from 'next/navigation'
import { TopNavigation } from '@/components/common/TopNavigation'
import { StationProvider } from '@/components/common/StationSelector'

const AUTH_ROUTES = ['/login']

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthRoute = AUTH_ROUTES.some(r => pathname?.startsWith(r))

  if (isAuthRoute) return <>{children}</>

  return (
    <StationProvider>
      <div className="flex flex-col min-h-screen">
        {/* Sticky top navigation bar (matches HTML reference) */}
        <TopNavigation />
        {/* Background wallpaper */}
        <div className="app-wallpaper" />
        {/* Page content */}
        <main className="flex-1 py-7 px-8 page-enter">
          <div className="max-w-[1320px] w-full mx-auto">
            {children}
          </div>
        </main>
      </div>
    </StationProvider>
  )
}
