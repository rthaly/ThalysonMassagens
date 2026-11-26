// Fonte única do texto das sessões em português (o inglês e o espanhol ficam em PACKAGES, no componente da Home).
// summary = uma linha do que é. steps = o que acontece, em ordem. note = uma observação curta (roupa, limites).
export type Session = {
  slug: string; pkgId: string; name: string; summary: string; steps: string[]; note: string
  duration: number; durationLabel: string; price: number; accent: string
}

export const sessions: Session[] = [
  { slug: 'massagem-classica', pkgId: 'classica', name: 'Massagem Clássica', summary: 'Massagem terapêutica do corpo todo. Sem toques íntimos.',
    steps: ['Você me diz onde está mais travado', 'Corpo todo com pressão firme: pés, pernas, bumbum, costas, pescoço, braços e mãos', 'Pistola massageadora nos nós mais duros'],
    note: 'Sem finalização. Você pode ficar sem roupa.', duration: 40, durationLabel: '40 a 60', price: 180, accent: 'sage' },
  { slug: 'massagem-sensitiva', pkgId: 'sensitiva', name: 'Sensitiva + Lingam', summary: 'Terapêutica, toques leves e lingam no final.',
    steps: ['Massagem terapêutica no corpo todo', 'Toques tão leves que parecem plumas, da cabeça aos pés', 'Lingam: massagem lenta no pênis, com gel, até você relaxar por completo'],
    note: 'Só você fica sem roupa, se quiser.', duration: 60, durationLabel: '60 a 80', price: 220, accent: 'amber' },
  { slug: 'sessao-sensacoes', pkgId: 'fusion', name: 'Sensações com a Barba + Lingam', summary: 'Nós dois nus, com o toque da barba e lingam no final.',
    steps: ['Massagem terapêutica', 'Toques leves e a minha barba em alguns pontos do corpo', 'Lingam no final, com gel e sem pressa'],
    note: 'Sessão naturista: nós dois sem roupa.', duration: 60, durationLabel: '60 a 80', price: 290, accent: 'clay' },
  { slug: 'sessao-completa', pkgId: 'completa', name: 'Corpo a Corpo + Lingam', summary: 'Nós dois nus, pele com pele, você também me massageia e lingam no final.',
    steps: ['Massagem terapêutica', 'Toques leves, barba e contato corpo a corpo', 'Você também pode me tocar e massagear', 'Lingam no final'],
    note: 'Nós dois sem roupa.', duration: 60, durationLabel: '60 a 80', price: 390, accent: 'blue' },
  { slug: 'aparo-masculino', pkgId: 'aparo_solo', name: 'Apenas Aparo de Pelos', summary: 'Aparo na máquina em até 3 regiões, sem lâmina.',
    steps: ['Você escolhe as áreas e a altura do pente', 'Máquina com pentes higienizados', 'Acabamento limpo'],
    note: '', duration: 40, durationLabel: '40 a 60', price: 130, accent: 'slate' },
]

export const whatsapp = '5517991360413'
// Perfil no Google (mostra as avaliações). Sem parâmetros de sessão, que expiram.
export const reviewReadUrl = 'https://www.google.com/search?q=Massagens+com+Thalyson&hl=pt-BR'
export const reviewUrl = 'https://g.page/r/Cd1aEwEt0R1QEAE/review'
