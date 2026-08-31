import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth/AuthContext'
import { AppShell } from '@/components/common/AppShell'

export const viewport: Viewport = {
  themeColor: '#0369A1',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'ASIDSS — Antarctic Station Integrated Digital Support System',
  description: 'Digital Twin Platform for Maitri & Bharati Antarctic Research Stations — MoES · NCPOR · SIH PS-26060',
  keywords: ['Antarctic', 'NCPOR', 'Digital Twin', 'Maitri', 'Bharati', 'MoES', 'ASIDSS'],
  authors: [{ name: 'SIH Team' }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐻‍❄️</text></svg>",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-[#F0F6FF] text-slate-900 min-h-screen">
        <AuthProvider>
          <AppShell>
            {children}
          </AppShell>
        </AuthProvider>
      </body>
    </html>
  )
}
