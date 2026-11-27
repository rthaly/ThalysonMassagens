import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { Fraunces, Poppins } from 'next/font/google'
import { PUBLIC_FAQ, PUBLIC_SERVICES, SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

// Fontes servidas pelo próprio site: sem pedir ao Google na hora de abrir a página
const fraunces = Fraunces({ subsets: ['latin'], axes: ['opsz'], display: 'swap', variable: '--f-serif' })
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap', variable: '--f-sans' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Relaxar hoje com Thalyson | Massagem na Bela Vista, SP', template: '%s | Relaxar hoje com Thalyson' },
  description: 'Atendimento individual de massagem na Bela Vista, São Paulo, perto do Metrô Anhangabaú. Veja horários livres, escolha sua sessão e confirme direto com Thalyson pelo WhatsApp.',
  applicationName: SITE_NAME,
  keywords: ['massagem Bela Vista', 'massagem Anhangabaú', 'massagem centro SP', 'massagem masculina São Paulo', 'massagem relaxante SP', 'massagem perto da Paulista'],
  openGraph: { type: 'website', locale: 'pt_BR', url: SITE_URL, siteName: SITE_NAME, title: 'Tire o peso do corpo. Desligue a cabeça.', description: 'Sessões individuais na Bela Vista ou no seu endereço em São Paulo. Direto com Thalyson, sem intermediários.' },
  twitter: { card: 'summary_large_image', title: SITE_NAME, description: 'Massagem individual na Bela Vista, São Paulo.' },
  icons: { icon: '/icon.svg', apple: '/apple-icon.png' },
  manifest: '/manifest.webmanifest',
  formatDetection: { telephone: false },
}

export const viewport: Viewport = { colorScheme: 'dark light', themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#121312' }, { media: '(prefers-color-scheme: light)', color: '#f2f0eb' }] }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const business = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${SITE_URL}/#negocio`,
    name: SITE_NAME,
    description: 'Atendimento individual de massagem na Bela Vista, São Paulo, perto do Metrô Anhangabaú.',
    url: SITE_URL,
    telephone: '+55 17 99136-0413',
    priceRange: 'R$ 130–390',
    image: `${SITE_URL}/apple-icon.png`,
    address: { '@type': 'PostalAddress', streetAddress: 'Avenida 9 de Julho', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR', postalCode: '01313-000' },
    geo: { '@type': 'GeoCoordinates', latitude: -23.55, longitude: -46.64 },
    areaServed: ['Bela Vista', 'Bixiga', 'Centro', 'República', 'Consolação', 'Liberdade', 'Av. Paulista'].map((name) => ({ '@type': 'Place', name: `${name}, São Paulo` })),
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '23:30' }],
    paymentAccepted: 'Pix, Cartão de crédito, Dinheiro',
    currenciesAccepted: 'BRL',
    sameAs: ['https://www.instagram.com/relaxecomthalyson'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Sessões',
      itemListElement: PUBLIC_SERVICES.map((s) => ({ '@type': 'Offer', price: s.price, priceCurrency: 'BRL', itemOffered: { '@type': 'Service', name: s.name, description: `${s.description} ${s.minutes} minutos.` } })),
    },
  }
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: PUBLIC_FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  return <html lang="pt-BR" data-theme="light" className={`${fraunces.variable} ${poppins.variable}`}><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([business, faq]) }}/>{children}{process.env.NODE_ENV === 'production' && <Analytics/>}</body></html>
}
