import Link from 'next/link'
import { PUBLIC_BY_SLUG, PUBLIC_FAQ, PUBLIC_SERVICES } from '@/lib/site'
import { sessions } from '@/lib/content'
import { LOCAIS } from '@/lib/locais'

// Texto de servidor, visível para qualquer pessoa que role a página e legível pelos buscadores
// mesmo antes da tela de maioridade. Usa só os nomes públicos (sem termos adultos).
export function SeoIntro() {
  const money = (v: number) => `R$ ${v}`
  return (
    <section aria-labelledby="seo-intro" style={{ background: 'var(--panel)', color: 'var(--ink)', borderTop: '1px solid var(--line)', padding: '56px 20px 72px', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 id="seo-intro" style={{ fontSize: 28, margin: '0 0 12px', fontWeight: 500 }}>Massagem na Bela Vista, São Paulo, perto do Metrô Anhangabaú</h2>
        <p style={{ color: 'var(--muted)', margin: '0 0 28px' }}>
          Atendo com hora marcada, só uma pessoa por horário, na Bela Vista, perto do Bixiga, da República, da Consolação e da Av. Paulista, ou no seu endereço.
          Você vê os valores antes de marcar e confirma direto comigo pelo WhatsApp.
        </p>
        <h3 style={{ fontSize: 18, margin: '0 0 10px', fontWeight: 600 }}>Sessões e valores</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gap: 10 }}>
          {sessions.map((s, i) => (
            <li key={s.slug}>
              <Link href={`/sessoes/${s.slug}`} style={{ color: 'var(--ink)', fontWeight: 600, display: 'inline-block', padding: '10px 0' }}>{PUBLIC_BY_SLUG[s.slug].name}</Link>
              <span style={{ color: 'var(--muted)' }}> · {PUBLIC_SERVICES[i].minutes} min · a partir de {money(PUBLIC_SERVICES[i].price)}. {PUBLIC_SERVICES[i].description}</span>
            </li>
          ))}
        </ul>
        <h3 style={{ fontSize: 18, margin: '0 0 10px', fontWeight: 600 }}>Onde atendo</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'grid', gap: 8 }}>
          {LOCAIS.map((l) => (<li key={l.slug}><Link href={`/massagem/${l.slug}`} style={{ color: 'var(--ink)', fontWeight: 600, display: 'inline-block', padding: '10px 0' }}>{l.h1}</Link></li>))}
        </ul>
        <h3 style={{ fontSize: 18, margin: '0 0 10px', fontWeight: 600 }}>Perguntas frequentes</h3>
        <dl style={{ margin: 0, display: 'grid', gap: 14 }}>
          {PUBLIC_FAQ.map(({ q, a }) => (
            <div key={q}>
              <dt style={{ fontWeight: 600 }}>{q}</dt>
              <dd style={{ margin: '2px 0 0', color: 'var(--muted)' }}>{a}</dd>
            </div>
          ))}
        </dl>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '28px 0 0' }}>Atendimento exclusivo para maiores de 18 anos.</p>
      </div>
    </section>
  )
}
