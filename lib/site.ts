// Endereço público do site. Defina NEXT_PUBLIC_SITE_URL na Vercel (ex.: https://relaxarhoje.com.br).
// Sem ela, usa o domínio de produção que a própria Vercel informa; fora da Vercel, cai no domínio oficial
// (antes caía num endereço antigo, o que deixava canonical e sitemap apontando para o lugar errado).
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, '')
  const vercelProd = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercelProd) return `https://${vercelProd}`
  return 'https://relaxarhoje.com.br'
}

export const SITE_URL = resolveSiteUrl()
export const SITE_NAME = 'Relaxar hoje com Thalyson'

// Nomes públicos (seguem a regra do marketing: nada explícito em canais indexados pelo Google).
export const PUBLIC_SERVICES = [
  { name: 'Massagem Clássica', description: 'Massagem terapêutica do corpo todo, com pressão firme e pistola massageadora nos pontos mais tensos.', minutes: '40 a 60', price: 180 },
  { name: 'Massagem Sensitiva', description: 'Começa com a massagem terapêutica e segue com toques leves pelo corpo todo.', minutes: '60 a 80', price: 220 },
  { name: 'Sessão Sensações', description: 'Sessão de relaxamento profundo, com massagem terapêutica e toques variados, no seu ritmo.', minutes: '60 a 80', price: 290 },
  { name: 'Sessão Completa', description: 'A sessão mais completa, com massagem terapêutica e atenção ao corpo todo, no seu ritmo.', minutes: '60 a 80', price: 390 },
  { name: 'Aparo masculino', description: 'Aparo na máquina com pentes higienizados, sem lâmina, em até 3 regiões.', minutes: '40 a 60', price: 130 },
]

export const PUBLIC_FAQ = [
  { q: 'Onde fica o atendimento?', a: 'Na Bela Vista, em São Paulo, perto do Metrô Anhangabaú. O endereço exato vai pelo WhatsApp depois da reserva. Também atendo no seu endereço em SP.' },
  { q: 'Como faço para reservar?', a: 'Escolha a sessão e o horário no site, envie o pedido pelo WhatsApp e faça o Pix do sinal de R$ 40, que é descontado do valor total.' },
  { q: 'E se eu precisar remarcar?', a: 'Avisando até 12 horas antes, devolvo o sinal no Pix ou troco o dia sem custo.' },
  { q: 'É minha primeira vez, tudo bem?', a: 'Sim. Antes de começar a gente alinha pressão, música e o que você prefere. Tudo acontece no seu ritmo.' },
  { q: 'Preciso levar alguma coisa?', a: 'Só venha de banho tomado.' },
]

// Nome e texto públicos de cada página de sessão (títulos, meta descrições e H1 indexáveis).
// O texto detalhado de lib/content.ts só aparece depois que a pessoa clica em "Ver como funciona".
export const PUBLIC_BY_SLUG: Record<string, { name: string; description: string }> = {
  'massagem-classica': { name: PUBLIC_SERVICES[0].name, description: PUBLIC_SERVICES[0].description },
  'massagem-sensitiva': { name: PUBLIC_SERVICES[1].name, description: PUBLIC_SERVICES[1].description },
  'sessao-sensacoes': { name: PUBLIC_SERVICES[2].name, description: PUBLIC_SERVICES[2].description },
  'sessao-completa': { name: PUBLIC_SERVICES[3].name, description: PUBLIC_SERVICES[3].description },
  'aparo-masculino': { name: PUBLIC_SERVICES[4].name, description: PUBLIC_SERVICES[4].description },
}
