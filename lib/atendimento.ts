// Avisos recentes que o assistente do site repete quando alguém pergunta sobre horário ou reserva.
// Para usar: adicione uma linha, salve e publique. Exemplo:
//
//   { texto: 'Dia 28/11 não atendo. Volto a atender dia 29.', ate: '2026-11-28' },
//
// "ate" é opcional (AAAA-MM-DD, horário de São Paulo): depois dessa data o aviso some sozinho.
export const AVISOS: { texto: string; ate?: string }[] = []
