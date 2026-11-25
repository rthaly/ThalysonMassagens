import type { Metadata } from 'next'
import App from '@/components/legacy-experience'
import { SeoIntro } from '@/components/seo-intro'

export const metadata: Metadata = { alternates: { canonical: '/' } }

export default function Page() {
  return <><App /><SeoIntro /></>
}
