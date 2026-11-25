import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SiteShell } from '@/components/site'
import { LOCAIS, getLocal } from '@/lib/locais'
import { PUBLIC_BY_SLUG } from '@/lib/site'
import { SITE_URL } from '@/lib/site'
import { sessions } from '@/lib/content'

export function generateStaticParams() { return LOCAIS.map((l) => ({ local: l.slug })) }

export async function generateMetadata({ params }: { params: Promise<{ local: string }> }): Promise<Metadata> {
  const { local } = await params
  const l = getLocal(local)
  if (!l) return {}
  return { title: { absolute: `${l.title} | Thalyson` }, description: l.description, alternates: { canonical: `/massagem/${l.slug}` }, openGraph: { title: l.h1, description: l.description, url: `${SITE_URL}/massagem/${l.slug}` } }
}

export default async function Page({ params }: { params: Promise<{ local: string }> }) {
  const { local } = await params
  const l = getLocal(local)
  if (!l) notFound()
  const faq = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: l.faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  const crumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: l.h1, item: `${SITE_URL}/massagem/${l.slug}` }] }
  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([faq, crumbs]) }} />
      <main id="conteudo" className="section-wrap detail-page">
        <Link href="/" className="back-link">← Início</Link>
        <article className="detail-card">
          <h1>{l.h1}</h1>
          <p className="detail-description">{l.intro}</p>
          {l.blocos.map((b) => (
            <section key={b.h2} style={{ marginTop: 34 }}>
              <h2 style={{ fontSize: 26, margin: '0 0 8px' }}>{b.h2}</h2>
              <p className="detail-description" style={{ marginTop: 0 }}>{b.p}</p>
            </section>
          ))}
          <section style={{ marginTop: 34 }}>
            <h2 style={{ fontSize: 26, margin: '0 0 12px' }}>Sessões</h2>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 10 }}>
              {sessions.map((s) => (
                <li key={s.slug}><Link href={`/sessoes/${s.slug}`} style={{ fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }}>{PUBLIC_BY_SLUG[s.slug].name}</Link><span style={{ color: 'var(--muted)' }}> · {s.durationLabel} min · a partir de R$ {s.price}</span></li>
              ))}
            </ul>
          </section>
          <section style={{ marginTop: 34 }}>
            <h2 style={{ fontSize: 26, margin: '0 0 12px' }}>Perguntas frequentes</h2>
            <dl style={{ margin: 0, display: 'grid', gap: 16 }}>
              {l.faq.map(({ q, a }) => (<div key={q}><dt style={{ fontWeight: 700 }}>{q}</dt><dd style={{ margin: '4px 0 0', color: 'var(--muted)' }}>{a}</dd></div>))}
            </dl>
          </section>
          <p style={{ marginTop: 34 }}><a className="button" href="/?agendar=1">Escolher sessão e horário</a></p>
          <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 20 }}>Atendimento exclusivo para maiores de 18 anos.</p>
        </article>
        <nav aria-label="Outras regiões" style={{ marginTop: 28, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {LOCAIS.filter((x) => x.slug !== l.slug).map((x) => (<Link key={x.slug} className="text-link" href={`/massagem/${x.slug}`}>{x.h1}</Link>))}
        </nav>
      </main>
    </SiteShell>
  )
}
