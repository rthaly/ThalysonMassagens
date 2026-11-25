import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SessionDetail, SiteShell } from '@/components/site'
import { sessions } from '@/lib/content'
import { PUBLIC_BY_SLUG } from '@/lib/site'

export function generateStaticParams() { return sessions.map((session) => ({ slug: session.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const session = sessions.find((item) => item.slug === slug)
  const pub = PUBLIC_BY_SLUG[slug]
  return session && pub ? { alternates: { canonical: `/sessoes/${slug}` }, title: pub.name, description: `${pub.description} Atendimento individual com Thalyson na Bela Vista, São Paulo. ${session.durationLabel} minutos, a partir de R$ ${session.price}.` } : {}
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!sessions.some((session) => session.slug === slug)) notFound()
  return <SiteShell><SessionDetail slug={slug}/></SiteShell>
}
