// Root route — middleware handles redirect to /login or /dashboard.
// This file exists as a Next.js fallback in case middleware doesn't fire (e.g. static export).
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/dashboard')
}
