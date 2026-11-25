'use client'

import { useMemo, useState } from 'react'
import { REVIEWS } from '@/components/legacy-experience'

export function ReviewsArchive() {
  const [sessionFilter, setSessionFilter] = useState('Todas')
  const sessions = useMemo(() => [...new Set(REVIEWS.pt.map((review) => review.tag))], [])
  const filtered = sessionFilter === 'Todas' ? REVIEWS.pt : REVIEWS.pt.filter((review) => review.tag === sessionFilter)
  return <main id="conteudo" className="section-wrap content-section reviews-page">
    <p className="eyebrow">EXPERIÊNCIAS REAIS · BELA VISTA</p>
    <div className="section-heading"><div><h1>Quem já relaxou comigo</h1><p>Comentários recebidos de quem viveu a experiência. Os nomes aparecem abreviados para preservar a privacidade.</p></div><a href="https://g.page/r/Cd1aEwEt0R1QEAE/review" target="_blank" rel="noreferrer" className="button button-quiet">Avaliar no Google <span aria-hidden="true">↗</span></a></div>
    <div className="review-filters"><label htmlFor="archive-filter">Filtrar por sessão</label><select id="archive-filter" value={sessionFilter} onChange={(event) => setSessionFilter(event.target.value)}><option>Todas</option>{sessions.map((session) => <option key={session}>{session}</option>)}</select></div>
    <div className="review-grid">{filtered.map((review, index) => <article className="review-card" key={`${review.initials}-${index}`}><div className="review-meta"><span className="review-avatar">{review.initials}</span><div><strong>{review.name}</strong><small>{review.tag}</small></div><span className="review-stars" aria-label={`${review.stars} de 5 estrelas`}>{'★'.repeat(review.stars)}<span>{'★'.repeat(5-review.stars)}</span></span></div><p>“{review.text}”</p><small className="review-date">{review.when}</small></article>)}</div>
  </main>
}
