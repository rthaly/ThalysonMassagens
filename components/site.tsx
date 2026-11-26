'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowDown, ArrowRight, ArrowUpRight, Clock3, MapPin, Menu, Moon, Sun, X } from 'lucide-react'
import { reviewUrl, sessions, whatsapp } from '@/lib/content'
import { PUBLIC_BY_SLUG } from '@/lib/site'

type Lang = 'pt' | 'en' | 'es'

// Textos do cabeçalho e do rodapé das páginas de sessão, região e avaliações.
const NAV = {
  pt: { sessions: 'Sessões', reviews: 'Avaliações', about: 'Sobre mim', book: 'Marcar horário', theme: 'Alternar tema', foot: 'Atendimento exclusivo para maiores de 18 anos.', skip: 'Ir para o conteúdo', wa: 'Pode me chamar no WhatsApp', waMsg: 'Oi Thalyson! Vim pelo site e queria tirar uma dúvida sobre as sessões.', lang: 'Idioma', menuOpen: 'Abrir menu', menuClose: 'Fechar menu' },
  en: { sessions: 'Sessions', reviews: 'Reviews', about: 'About me', book: 'Book a time', theme: 'Toggle theme', foot: 'Service exclusively for adults 18 and older.', skip: 'Skip to content', wa: 'You can message me on WhatsApp', waMsg: 'Hi Thalyson! I came from the site and have a question about the sessions.', lang: 'Language', menuOpen: 'Open menu', menuClose: 'Close menu' },
  es: { sessions: 'Sesiones', reviews: 'Reseñas', about: 'Sobre mí', book: 'Reservar horario', theme: 'Cambiar tema', foot: 'Atención exclusiva para mayores de 18 años.', skip: 'Ir al contenido', wa: 'Puedes escribirme por WhatsApp', waMsg: '¡Hola Thalyson! Vengo del sitio y tengo una duda sobre las sesiones.', lang: 'Idioma', menuOpen: 'Abrir menú', menuClose: 'Cerrar menú' },
} as const

function money(value: number) { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(value) }

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)
  const t = NAV[lang]
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('thaly_lang') as Lang | null
      const savedTheme = (localStorage.getItem('thaly_theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')) as 'dark' | 'light'
      if (savedLang && savedLang in NAV) setLang(savedLang)
      setTheme(savedTheme)
    } catch { /* o armazenamento pode estar bloqueado em aba privada */ }
  }, [])
  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])
  function changeLang(value: Lang) { setLang(value); try { localStorage.setItem('thaly_lang', value) } catch {} }
  function toggleTheme() { const next = theme === 'dark' ? 'light' : 'dark'; setTheme(next); try { localStorage.setItem('thaly_theme', next) } catch {} }
  const link = `https://wa.me/${whatsapp}?text=${encodeURIComponent(t.waMsg)}`
  const close = () => setMenuOpen(false)
  return <div className="site-shell">
    <a className="skip-link" href="#conteudo">{t.skip}</a>
    <header className="topbar"><div className="topbar-inner">
      <Link href="/" className="brand" aria-label="Relaxar hoje com Thalyson"><span className="brand-mark">T</span><span><strong>Relaxar hoje</strong><small>com Thalyson · Bela Vista, SP</small></span></Link>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Principal">
        <Link href="/#sessoes" onClick={close}>{t.sessions}</Link>
        <a href={reviewUrl} target="_blank" rel="noopener noreferrer" onClick={close}>{t.reviews}</a>
        <Link href="/#sobre" onClick={close}>{t.about}</Link>
      </nav>
      <div className="tools">
        <label className="sr-only" htmlFor="language">{t.lang}</label>
        <select id="language" value={lang} onChange={(e) => changeLang(e.target.value as Lang)}><option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option></select>
        <button className="icon-button" onClick={toggleTheme} aria-label={t.theme}>{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</button>
        <Link className="button button-small header-cta" href="/?agendar=1" onClick={close}>{t.book}<ArrowRight size={15}/></Link>
        <button className="icon-button mobile-menu" aria-label={menuOpen ? t.menuClose : t.menuOpen} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
      </div>
    </div></header>
    {children}
    <footer className="footer"><div className="footer-top"><Link className="brand" href="/"><span className="brand-mark">T</span><span><strong>Relaxar hoje</strong><small>com Thalyson · Bela Vista, SP</small></span></Link><a href={link} target="_blank" rel="noreferrer" className="text-link">{t.wa} <ArrowUpRight size={15}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Thalyson Rodrigo dos Santos</span><span>{t.foot}</span></div></footer>
    <a className="whatsapp-float" href={link} target="_blank" rel="noreferrer" aria-label="WhatsApp"><span className="wa-dot"/>WhatsApp</a>
  </div>
}

// Página de uma sessão. Antes do clique mostra só o texto público; o passo a passo aparece depois.
export function SessionDetail({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false)
  const session = sessions.find((item) => item.slug === slug)
  const pub = PUBLIC_BY_SLUG[slug]
  if (!session || !pub) return null
  return <main id="conteudo" className="section-wrap detail-page">
    <Link href="/#sessoes" className="back-link">← Todas as sessões</Link>
    <article className={`detail-card ${session.accent}`}>
      <p className="eyebrow"><MapPin size={14}/> Bela Vista · perto do Metrô Anhangabaú</p>
      <span className="session-time"><Clock3 size={15}/>{session.durationLabel} min</span>
      <h1>{pub.name}</h1>
      <p className="detail-description">{pub.description}</p>
      {open
        ? <><h2 className="detail-sub">{session.summary}</h2><ol className="how-list">{session.steps.map((item) => <li key={item}>{item}</li>)}</ol>{session.note && <p className="detail-description">{session.note}</p>}</>
        : <button type="button" className="button button-quiet" aria-expanded="false" onClick={() => setOpen(true)}>Ver o que acontece <ArrowDown size={16}/></button>}
      <div className="detail-price"><span>Valor da sessão</span><strong>{money(session.price)}</strong></div>
      <Link className="button" href={`/?sessao=${session.slug}`}>Escolher horário <ArrowRight size={17}/></Link>
    </article>
  </main>
}
