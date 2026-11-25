import Link from 'next/link'
import { PUBLIC_BY_SLUG, PUBLIC_FAQ, PUBLIC_SERVICES } from '@/lib/site'
import { sessions } from '@/lib/content'
import { LOCAIS } from '@/lib/locais'

// Texto de servidor, legível pelos buscadores mesmo antes da tela de maioridade. Só nomes públicos.
// Fica curto na tela: sessões, valores e perguntas ficam num bloco recolhível para não repetir o que a página já mostra.
export function SeoIntro() {
  const link = { color: 'var(--ink)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', minHeight: 44 } as const
  return (
    <section aria-labelledby="seo-intro" style={{ background: 'var(--panel)', color: 'var(--ink)', borderTop: '1px solid var(--line)', padding: '48px 20px 64px', fontFamily: 'var(--sans)', lineHeight: 1.6 }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <h2 id="seo-intro" style={{ fontSize: 26, margin: '0 0 10px', fontWeight: 500 }}>Massagem na Bela Vista, São Paulo</h2>
        <p style={{ color: 'var(--muted)', margin: '0 0 18px' }}>
          Atendo com hora marcada, só uma pessoa por horário, na Bela Vista, perto do Metrô Anhangabaú, ou no seu endereço. Você vê os valores antes de marcar e confirma direto comigo pelo WhatsApp.
        </p>
        <nav aria-label="Onde atendo" style={{ display: 'flex', flexWrap: 'wrap', columnGap: 22, margin: '0 0 12px' }}>
          {LOCAIS.map((l) => (<Link key={l.slug} href={`/massagem/${l.slug}`} style={link}>{l.h1}</Link>))}
        </nav>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 600, minHeight: 44, display: 'flex', alignItems: 'center' }}>Sessões, valores e perguntas frequentes</summary>
          <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 24px', display: 'grid', gap: 4 }}>
            {sessions.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/sessoes/${s.slug}`} style={link}>{PUBLIC_BY_SLUG[s.slug].name}</Link>
                <span style={{ color: 'var(--muted)' }}> · {PUBLIC_SERVICES[i].minutes} min · a partir de R$ {PUBLIC_SERVICES[i].price}</span>
              </li>
            ))}
          </ul>
          <dl style={{ margin: 0, display: 'grid', gap: 14 }}>
            {PUBLIC_FAQ.map(({ q, a }) => (
              <div key={q}>
                <dt style={{ fontWeight: 600 }}>{q}</dt>
                <dd style={{ margin: '2px 0 0', color: 'var(--muted)' }}>{a}</dd>
              </div>
            ))}
          </dl>
        </details>
        <p style={{ color: 'var(--muted)', fontSize: 13, margin: '24px 0 0' }}>Atendimento exclusivo para maiores de 18 anos.</p>
      </div>
    </section>
  )
}
