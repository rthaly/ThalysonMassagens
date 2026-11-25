import type { Metadata } from 'next'
import { ReviewsArchive } from '@/components/reviews-archive'
import { SiteShell } from '@/components/site'

export const metadata: Metadata = { robots: { index: false, follow: false }, alternates: { canonical: '/avaliacoes' }, title: 'Avaliações', description: 'Leia avaliações de quem já esteve nas sessões individuais com Thalyson, na Bela Vista em São Paulo.' }

export default function Page() {
  return <SiteShell><ReviewsArchive/></SiteShell>
}
