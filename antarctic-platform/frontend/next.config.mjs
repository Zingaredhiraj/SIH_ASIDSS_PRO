/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do NOT set output: 'standalone' for Vercel — Vercel handles deployment natively
  // Remove @react-three/fiber since we replaced it with pure three.js
  images: {
    unoptimized: false,
  },
}

export default nextConfig
