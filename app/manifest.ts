import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Relaxar hoje com Thalyson',
    short_name: 'Relaxar hoje',
    description: 'Massagem individual na Bela Vista, São Paulo. Reserva rápida pelo WhatsApp.',
    start_url: '/?utm_source=app',
    display: 'standalone',
    background_color: '#121312',
    theme_color: '#121312',
    lang: 'pt-BR',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  }
}
