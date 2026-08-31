'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { login } from '@/lib/api/admin'

const DEMO_USERS = [
  { email: 'admin@antarctic.in',     password: 'Admin@1234',    role: 'Admin',          roleColor: 'bg-red-100 text-red-700'      },
  { email: 'operator@antarctic.in',  password: 'Operator@1234', role: 'Operator',       roleColor: 'bg-blue-100 text-blue-700'    },
  { email: 'scientist@antarctic.in', password: 'Scientist@1234',role: 'Scientist',      roleColor: 'bg-emerald-100 text-emerald-700' },
  { email: 'security@antarctic.in',  password: 'Security@1234', role: 'Security',       roleColor: 'bg-amber-100 text-amber-700'  },
  { email: 'hq@ncpor.gov.in',        password: 'NCPOR@1234',    role: 'NCPOR HQ',       roleColor: 'bg-purple-100 text-purple-700' },
]

// High-resolution reliable polar research station & Antarctic landscape image
const ANTARCTIC_BG = 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85'
const ANTARCTIC_BACKUP = 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?auto=format&fit=crop&w=1600&q=85'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const { login: setAuth }      = useAuth()
  const router                  = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await login(email, password)
      setAuth(res.access_token, res.user)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex bg-white overflow-hidden">

      {/* ── Left: Photo Visual ─────────────────────── */}
      <div className="relative w-[46%] min-w-[400px] overflow-hidden bg-[#0c2436] hidden md:block">
        {/* Background photo */}
        <img
          src={ANTARCTIC_BG}
          alt="Antarctic Research Station"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(1.1) contrast(1.05)', transform: 'scale(1.02)' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (target.src !== ANTARCTIC_BACKUP) {
              target.src = ANTARCTIC_BACKUP
            }
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(195deg, rgba(6,16,28,0.30) 0%, rgba(6,16,28,0.45) 45%, rgba(4,10,20,0.85) 100%)',
        }} />
        {/* Aurora effect */}
        <div className="login-aurora" />

        {/* Station window lights */}
        <div className="absolute z-20 left-[9%] bottom-[16%] flex gap-[5px]">
          {[9, 6, 11].map((h, i) => (
            <span key={i} style={{ width: 5, height: h, background: 'rgba(255,196,120,0.85)', boxShadow: '0 0 6px rgba(255,196,120,0.7)', display: 'block' }} />
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-30 h-full flex flex-col justify-between p-11 text-[#F4FBFF]">
          {/* Brand */}
          <div className="flex items-center gap-2.5 font-display font-extrabold text-[15px] tracking-wide">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M2 18l6-9 4 5 3-4 7 8H2z" fill="#fff"/>
            </svg>
            ANTARCTICA — ASIDSS
          </div>

          {/* Headline */}
          <div>
            <h1 className="font-display font-extrabold text-[clamp(22px,2.5vw,30px)] leading-[1.2] max-w-[360px]">
              AI-Powered Research<br />Station Management
            </h1>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-white/80 max-w-[340px]">
              Intelligent resource management and digital twin monitoring for India&apos;s extreme polar environments.
            </p>
          </div>

          {/* Station list */}
          <div className="flex gap-6 text-[12px] text-white/75 font-medium">
            {['Maitri Research Station', 'Bharati Research Station'].map(s => (
              <span key={s} className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full bg-[#17A88E] shadow-[0_0_6px_#17A88E]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Login Form ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white px-10 overflow-y-auto">
        <div className="w-full max-w-[340px] py-8">

          {/* Brand (mobile) */}
          <div className="flex items-center gap-2.5 mb-8">
            <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none">
              <path d="M2 18l6-9 4 5 3-4 7 8H2z" fill="#12233B"/>
            </svg>
            <span className="font-display font-extrabold text-[15px] tracking-wide text-[#12233B]">ANTARCTICA</span>
          </div>

          <h1 className="font-display text-[22px] font-extrabold text-[#12233B] mb-1.5">Welcome back</h1>
          <p className="text-[13.5px] text-[#64748B] mb-7">Sign in to access your station operations</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5 text-[#12233B]">Email / Employee ID</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="user@antarctic.in"
                className="field-input"
                required
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-semibold mb-1.5 text-[#12233B]">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="field-input"
                required
              />
            </div>

            {error && (
              <div className="text-[#DC5B54] text-[13px] font-medium bg-red-50 border border-red-100 rounded-[10px] p-3">
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-2">
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Biometric / Demo access */}
          <div className="mt-7 flex flex-col items-center gap-3">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center gap-2 text-[12px] text-[#64748B] font-medium hover:text-[#12233B] transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#EAF4FC] border border-[#d9ecfb] flex items-center justify-center text-[#2F8FE0]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>
                </svg>
              </div>
            </button>
            <span className="text-[12px] text-[#94A3B8] font-medium">
              {showDemo ? 'Click a credential to auto-fill ↓' : 'Demo Credentials — Click icon above'}
            </span>
          </div>

          {/* Demo credentials */}
          {showDemo && (
            <div className="mt-3 space-y-1.5 border border-[#E4EBF2] rounded-[12px] p-3 bg-[#F5F8FB]">
              {DEMO_USERS.map(u => (
                <button
                  key={u.email}
                  onClick={() => { setEmail(u.email); setPassword(u.password); setError('') }}
                  className="w-full text-left px-3 py-2 rounded-[8px] hover:bg-white border border-transparent hover:border-[#E4EBF2] transition-all duration-150 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-mono text-[#64748B] group-hover:text-[#12233B]">{u.email}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${u.roleColor}`}>{u.role}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-7 flex items-center justify-center gap-1.5 text-[11.5px] text-[#94A3B8]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z"/>
            </svg>
            Secure access · Research Operations Network · MoES · NCPOR
          </div>
        </div>
      </div>
    </div>
  )
}
