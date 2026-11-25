import type { MetadataRoute } from 'next'
import { sessions } from '@/lib/content'
import { SITE_URL } from '@/lib/site'
import { LOCAIS } from '@/lib/locais'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    ...LOCAIS.map(({ slug }) => ({ url: `${SITE_URL}/massagem/${slug}`, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...sessions.map(({ slug }) => ({ url: `${SITE_URL}/sessoes/${slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
