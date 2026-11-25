// Páginas de SEO local. Cada uma tem texto próprio (não é o mesmo texto trocando o bairro).
// Só vocabulário público: nada de termos adultos. Sem distâncias ou tempos de caminhada inventados.
export type Local = {
  slug: string
  title: string // até 60 caracteres, antes do " | Relaxar hoje com Thalyson"
  description: string // até 155 caracteres
  h1: string
  intro: string
  blocos: { h2: string; p: string }[]
  faq: { q: string; a: string }[]
}

export const LOCAIS: Local[] = [
  {
    slug: 'bela-vista',
    title: 'Massagem na Bela Vista, São Paulo',
    description: 'Massagem individual na Bela Vista, SP, com hora marcada e valores claros antes de ir. Atendimento direto com Thalyson. Reserve pelo WhatsApp.',
    h1: 'Massagem na Bela Vista, em São Paulo',
    intro: 'Atendo na Bela Vista, numa suíte residencial simples e reservada, perto do Metrô Anhangabaú. Cada horário é de uma pessoa só: você chega, a gente alinha pressão e música, e o tempo todo é seu.',
    blocos: [
      { h2: 'Para quem é este atendimento', p: 'Para quem trabalha sentado o dia inteiro, treina pesado ou chega ao fim da semana com o corpo travado e a cabeça ligada. Muita gente que passa por aqui nunca fez uma sessão assim, e tudo bem: antes de começar eu pergunto o que você prefere e o que não quer.' },
      { h2: 'Como funciona a reserva', p: 'Você escolhe a sessão e o horário no site, manda o pedido pelo WhatsApp e faz o Pix do sinal de R$ 40, que entra como desconto no valor total. Eu confirmo pessoalmente. O endereço exato da suíte vai pelo WhatsApp depois da reserva.' },
      { h2: 'Sessões e valores', p: 'A Massagem Clássica (40 a 60 minutos) custa a partir de R$ 180 e é a mais indicada para costas, ombros e pescoço travados. A Massagem Sensitiva (60 a 80 minutos), a partir de R$ 220, é a mais pedida por quem quer desligar da rotina. O aparo masculino na máquina custa R$ 130.' },
    ],
    faq: [
      { q: 'A suíte fica em qual região da Bela Vista?', a: 'Na região da Avenida 9 de Julho, perto do Metrô Anhangabaú. O endereço exato eu mando pelo WhatsApp depois da reserva.' },
      { q: 'Posso remarcar se algo mudar?', a: 'Pode. Avisando até 12 horas antes, devolvo o sinal no Pix ou troco o dia sem custo.' },
      { q: 'Preciso levar alguma coisa?', a: 'Só venha de banho tomado.' },
    ],
  },
  {
    slug: 'avenida-paulista',
    title: 'Massagem perto da Avenida Paulista, SP',
    description: 'Massagem individual perto da Av. Paulista e da Consolação, em São Paulo. Hora marcada, valores claros e atendimento direto com Thalyson.',
    h1: 'Massagem perto da Avenida Paulista',
    intro: 'Se você trabalha na Paulista ou na Consolação, dá para marcar uma sessão depois do expediente. Atendo na Bela Vista, vizinha da Paulista, com horário marcado e só uma pessoa por vez.',
    blocos: [
      { h2: 'Depois do expediente na Paulista', p: 'Se você sai do escritório com o pescoço duro e os ombros sobrecarregados, a Massagem Clássica foi feita para isso. Ela dura de 40 a 60 minutos, cabe numa saída do trabalho e trabalha o corpo todo com pressão firme, de pés e panturrilhas a costas, pescoço, braços e mãos.' },
      { h2: 'Horários', p: 'Atendo todos os dias, das 9h às 23h30. O site mostra os horários livres e o próximo disponível. Se preferir, também vou até o seu endereço em São Paulo; nos horários de trânsito pesado há uma taxa de deslocamento de R$ 18.' },
      { h2: 'Como reservar', p: 'Escolha a sessão no site e envie o pedido pelo WhatsApp. O sinal de R$ 40 no Pix segura o horário e é descontado do total. Na primeira sessão há R$ 15 de desconto automático.' },
    ],
    faq: [
      { q: 'Você atende em hotel ou escritório perto da Paulista?', a: 'Atendo no endereço do cliente em São Paulo. Combinamos os detalhes pelo WhatsApp antes de confirmar.' },
      { q: 'Quanto custa a primeira sessão?', a: 'A Massagem Clássica começa em R$ 180 e a primeira sessão tem R$ 15 de desconto automático. Os valores de cada sessão aparecem antes de você enviar o pedido.' },
      { q: 'Dá para fazer uma sessão curta?', a: 'A Massagem Clássica dura de 40 a 60 minutos e o aparo masculino, de 40 a 60. As demais sessões duram de 60 a 80 minutos, e o tempo exato varia de acordo com o ritmo da sessão.' },
    ],
  },
  {
    slug: 'anhangabau-centro',
    title: 'Massagem no Centro de SP, perto do Anhangabaú',
    description: 'Massagem individual no Centro de São Paulo, perto do Metrô Anhangabaú, República e Liberdade. Hora marcada e atendimento direto com Thalyson.',
    h1: 'Massagem no Centro de São Paulo, perto do Metrô Anhangabaú',
    intro: 'A suíte fica perto do Metrô Anhangabaú. Atendo quem vem do Centro, de República, da Liberdade ou de outras regiões da cidade.',
    blocos: [
      { h2: 'Chegando de metrô', p: 'A suíte fica perto do Metrô Anhangabaú. Depois da reserva eu mando o endereço exato e a orientação de como chegar pelo WhatsApp, para você não se perder na região.' },
      { h2: 'Um horário só seu', p: 'Atendo uma pessoa por vez, sem sala de espera e sem cruzar com ninguém na entrada ou na saída. O espaço é simples e reservado, com maca de madeira, música e incenso se você quiser. Se preferir sem incenso, é só pedir.' },
      { h2: 'Valores sem surpresa', p: 'Você vê o valor total, o sinal de R$ 40 e o que sobra para pagar depois da sessão antes de enviar o pedido. O restante pode ser no Pix, com 3% de desconto (exceto no aparo avulso), no cartão em até 12 vezes ou em dinheiro.' },
    ],
    faq: [
      { q: 'Qual estação de metrô fica mais perto?', a: 'O Metrô Anhangabaú. Passo o endereço exato pelo WhatsApp depois da reserva.' },
      { q: 'Posso pagar no cartão?', a: 'Pode, em até 12 vezes. As taxas do parcelamento eu informo antes, pelo WhatsApp.' },
      { q: 'Tem plano para quem vem com frequência?', a: 'Tem. O plano 2x no mês dá 10% de desconto nas duas sessões, e no pacote de 5 sessões você paga 4.' },
    ],
  },
  {
    slug: 'domicilio-sao-paulo',
    title: 'Massagem em domicílio em São Paulo',
    description: 'Massagem individual no seu endereço em São Paulo. Eu levo tudo, com hora marcada e valores claros. Atendimento direto com Thalyson.',
    h1: 'Massagem em domicílio em São Paulo',
    intro: 'Se você prefere ficar em casa, eu vou até você. Levo os cremes; só peço que você já esteja de banho tomado na hora combinada.',
    blocos: [
      { h2: 'Como funciona em casa', p: 'Você informa o CEP, o número e o bairro no pedido, e o site já preenche a rua. Eu chego no horário combinado, a gente conversa dois minutos para alinhar pressão e música, e começamos.' },
      { h2: 'Horários e deslocamento', p: 'Para atendimento no endereço, deixo uma folga de 30 minutos antes e depois do horário para o deslocamento. Nos horários de trânsito pesado, às 12h, 13h, 17h, 18h e 19h, há uma taxa de deslocamento de R$ 18.' },
      { h2: 'Reserva e pagamento', p: 'O sinal de R$ 40 no Pix segura o horário e é descontado do total. O restante você paga depois da sessão, no Pix, no cartão ou em dinheiro. Avisando até 12 horas antes, você remarca ou recebe o sinal de volta.' },
    ],
    faq: [
      { q: 'Quais regiões de São Paulo você atende?', a: 'Atendo no endereço do cliente em São Paulo. Combinamos pelo WhatsApp para confirmar se o horário e o local funcionam.' },
      { q: 'O que eu preciso preparar em casa?', a: 'Estar de banho tomado na hora combinada. Os demais detalhes combinamos pelo WhatsApp antes de confirmar o atendimento.' },
      { q: 'Tem taxa para ir até o endereço?', a: 'Só nos horários de trânsito pesado, e o valor é de R$ 18. Fora desses horários não há taxa.' },
    ],
  },
]

export const getLocal = (slug: string) => LOCAIS.find((l) => l.slug === slug)
