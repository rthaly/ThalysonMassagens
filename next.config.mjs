/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      { source: '/sessoes/sensitiva-lingam', destination: '/sessoes/massagem-sensitiva', permanent: true },
      { source: '/sessoes/sensacoes-barba-lingam', destination: '/sessoes/sessao-sensacoes', permanent: true },
      { source: '/sessoes/corpo-a-corpo-lingam', destination: '/sessoes/sessao-completa', permanent: true },
      { source: '/sessoes/apenas-aparo', destination: '/sessoes/aparo-masculino', permanent: true },
    ]
  },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
        { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }]
  },
}

export default nextConfig
