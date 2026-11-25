// Mapa entre as páginas de sessão (slug) e os ids de sessão usados no fluxo de reserva.
export const SLUG_TO_PKG: Record<string, string> = {
  'massagem-classica': 'classica',
  'sensitiva-lingam': 'sensitiva',
  'sensacoes-barba-lingam': 'fusion',
  'corpo-a-corpo-lingam': 'completa',
  'apenas-aparo': 'aparo_solo',
}
export const PKG_IDS = Object.values(SLUG_TO_PKG)
// Tempo máximo de cada sessão (a agenda bloqueia o máximo, porque a sessão pode ir até lá)
export const PKG_MINUTES: Record<string, number> = { classica: 60, sensitiva: 80, fusion: 80, completa: 80, aparo_solo: 40 }
