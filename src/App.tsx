
 * Arquivo único, sem dependências além do React. Funciona em Vite (React + TS)
 * e em Next.js (App Router) por causa da diretiva "use client".
 *
 * ANTES DE PUBLICAR, ajuste o bloco CONFIG abaixo:
 *   1. whatsapp      → número com DDI e DDD, só dígitos (ex.: 5511987654321)
 *   2. packages      → nomes, durações e preços reais
 *   3. homeFee / peakFee / depositPct / discountPct
 *   4. street / district / city / state
 *   5. razao / cnpj / email / dpo / dpoEmail
 *   6. daysAhead
 * Dados reais já configurados: WhatsApp, chave Pix, pacotes, adicionais,
 * cupons, taxas, endereço e documentos. Para mudar preço ou duração, edite
 * apenas o bloco CONFIG abaixo.
 *
 * Os horários das janelas ficam em WINDOWS (abaixo) e o texto exibido fica em
 * plaque.hoursValue / hoursNote, em PT e EN.
const CONFIG = {
  brand: 'relaxe',

  /** TROQUE AQUI: 55 + DDD + número, apenas dígitos. */
  whatsapp: '5511999999999',
  /** WhatsApp: 55 + DDD + número, apenas dígitos. */
  whatsapp: '5517991360413',

  /** Chave Pix (CNPJ) para o sinal. */
  pixKey: '62.922.530/0001-44',
  instagram: 'https://www.instagram.com/relaxarhojesp',
  reviews: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  avatar: '/thalyson.jpg',

  email: 'relaxecomthalyson@gmail.com',
  razao: 'Thalyson Rodrigo dos Santos',
  cnpj: '62.922.530/0001-44',
  district: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  studioNote: { pt: 'Bela Vista · próximo ao Metrô Anhangabaú', en: 'Bela Vista · near Anhangabaú station' },

  daysAhead: 14,

  /** Taxas e regras, em reais. */
  homeFee: 60,
  peakFee: 30,
  depositPct: 30,
  discountPct: 10,
  peakFee: 18,
  deposit: 40,
  firstDiscount: 15,
  specialFee: 140,
  pixDiscountPct: 3,
  cancelFreeHours: 12,
  coupons: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,

  addons: [
    {
      id: 'time',
      minutes: 30,
      price: 75,
      name: { pt: '30 minutos extras', en: '30 extra minutes' },
    },
    {
      id: 'groom',
      minutes: 0,
      price: 130,
      name: {
        pt: 'Aparar pelos até 3 regiões (máquina)',
        en: 'Grooming up to 3 areas (clippers)',
      },
    },
  ],

  packages: [
    {
      id: 'essential',
      minutes: 60,
      id: 'classica',
      minutes: 40,
      price: 180,
      popular: false,
      name: { pt: 'Essencial', en: 'Essential' },
      name: { pt: 'Massagem clássica', en: 'Classic massage' },
      blurb: {
        pt: 'Uma hora para desacelerar. Costas, ombros e cabeça, com pressão combinada antes de começar.',
        en: 'One hour to slow down. Back, shoulders and head, with pressure agreed before we start.',
        pt: 'O essencial para quem está com o corpo cansado da rotina. Mãos firmes para soltar a musculatura, com foco em relaxamento.',
        en: 'The essentials for a body worn down by routine. Firm hands to release muscle tension, focused on relaxation.',
      },
      tags: {
        pt: ['Relaxamento completo', 'Pistola relaxante', 'Sem toque íntimo'],
        en: ['Full relaxation', 'Massage gun', 'No intimate touch'],
      },
    },
    {
      id: 'deep',
      minutes: 90,
      price: 240,
      popular: true,
      name: { pt: 'Profunda', en: 'Deep' },
      id: 'sensitiva',
      minutes: 60,
      price: 220,
      name: { pt: 'Sensitiva & prazer', en: 'Sensitive & pleasure' },
      blurb: {
        pt: 'Tempo para o corpo inteiro e para os pontos que pedem mais atenção. A mais pedida.',
        en: 'Time for the whole body and for the places that need more attention. The most requested.',
        pt: 'Começa com a massagem clássica para relaxar o corpo. Quando você estiver à vontade, os toques ficam mais leves e a sessão encerra com a massagem lingam.',
        en: 'It starts with the classic massage to relax the body. Once you are comfortable the touch becomes lighter, and the session ends with a lingam massage.',
      },
      tags: {
        pt: ['Tântrica', 'Pistola relaxante', 'Finalização lingam'],
        en: ['Tantric', 'Massage gun', 'Lingam finish'],
      },
    },
    {
      id: 'long',
      minutes: 120,
      price: 300,
      popular: false,
      name: { pt: 'Longa', en: 'Long' },
      id: 'barba',
      minutes: 60,
      price: 290,
      name: { pt: 'Sensações com a barba', en: 'Beard sensations' },
      blurb: {
        pt: 'Duas horas sem relógio. Ritmo lento, silêncio e espaço para terminar sem pressa.',
        en: 'Two hours without a clock. Slow rhythm, quiet, and room to finish unhurried.',
        pt: 'Ficamos totalmente à vontade. Primeiro a massagem clássica, depois o uso da barba em algumas partes do corpo, e o encerramento com a massagem lingam.',
        en: 'We take our time. Classic massage first, then beard contact on parts of the body, closing with a lingam massage.',
      },
      tags: {
        pt: ['Tântrica', 'Naturista', 'Pistola relaxante', 'Uso de barba'],
        en: ['Tantric', 'Natural', 'Massage gun', 'Beard work'],
      },
    },
    {
      id: 'completa',
      minutes: 60,
      price: 390,
      name: { pt: 'Corpo a corpo & interação', en: 'Body to body & interaction' },
      blurb: {
        pt: 'O pacote sem barreiras. Massagem clássica, proximidade corpo a corpo com gel e liberdade para você massagear também, com encerramento lingam.',
        en: 'The package without barriers. Classic massage, body-to-body contact with gel and freedom for you to massage me too, closing with lingam.',
      },
      tags: {
        pt: ['Tântrica', 'Pistola relaxante', 'Naturista', 'Interação'],
        en: ['Tantric', 'Massage gun', 'Natural', 'Interaction'],
      },
    },
    {
      id: 'aparo',
      minutes: 40,
      price: 130,
      name: { pt: 'Apenas depilação (máquina)', en: 'Grooming only (clippers)' },
      blurb: {
        pt: 'Serviço isolado de estética: aparo de pelos com máquina em até três regiões, pente 1 e 3. Não inclui massagem.',
        en: 'Grooming only: hair trimmed with clippers in up to three areas, guards 1 and 3. No massage included.',
      },
      tags: {
        pt: ['Estética', 'Sem massagem'],
        en: ['Grooming', 'No massage'],
      },
    },
  ],
} as const;

type Lang = 'pt' | 'en';
type Theme = 'light' | 'dark';
type Place = 'studio' | 'home';
type Payment = 'pix' | 'card';
type Payment = 'pix' | 'card' | 'cash';
type AddonId = (typeof CONFIG.addons)[number]['id'];
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';

// Janelas de chegada: ajuste aqui e no texto de horários da placa e do FAQ.
const WINDOWS = [
  { id: 'morning', start: 9, end: 12 },
  { id: 'afternoon', start: 13, end: 17 },
  { id: 'evening', start: 18, end: 22 },
  { id: 'evening', start: 18, end: 23 },
] as const;

type WindowId = (typeof WINDOWS)[number]['id'];
  district?: string;
};

type Errors = Partial<Record<'name' | 'cep' | 'street' | 'number' | 'district' | 'consent', string>>;
type Errors = Partial<
  Record<'name' | 'cep' | 'street' | 'number' | 'district' | 'consent' | 'age', string>
>;

const UPDATED = { pt: '29/10/2026', en: '29 October 2026' };

    tomorrow: 'Amanhã',
    windows: { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite' },
    whoLegend: 'Quem vai chegar',
    addons: 'Adicionais',
    addonsHint: 'Somam tempo e valor à sessão.',
    coupon: {
      label: 'Cupom',
      placeholder: 'Código',
      apply: 'Aplicar',
      applied: 'Cupom aplicado',
      remove: 'Remover',
      invalid: 'Cupom inválido ou expirado.',
    },
    name: 'Como você quer ser chamado',
    namePlaceholder: 'Seu nome',
    payment: 'Pagamento',
    pix: 'Pix',
    card: 'Cartão',
    cardNote: 'Parcelamento pode ter taxa, informada antes.',
    note: 'Preferências',
    pix: 'Pix −3%',
    card: 'Cartão 12x',
    cash: 'Dinheiro',
    cardNote: 'No cartão, o parcelamento tem taxa, informada antes do pagamento.',
    prefs: 'Preferências',
    prefsOptional: 'opcional',
    prefsPlaceholder: 'Ex.: mais pressão nos ombros, ambiente silencioso.',
    note: 'Pedido específico',
    noteOptional: 'opcional',
    notePlaceholder: 'Ex.: mais pressão nos ombros, ambiente silencioso.',
    notePlaceholder: 'Algum detalhe ou vontade para a sessão.',
    consent:
      'Autorizo o uso destas preferências — que podem revelar dado sensível — apenas para avaliar este pedido. Elas não ficam salvas no aparelho.',
      'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp e não é salvo neste aparelho.',
    noteHint: 'Se não for possível atender, o valor não é cobrado.',
    age: 'Confirmo ter 18 anos ou mais e li a Política de Privacidade e os Termos.',
    gift: 'Cupom SESSAO2 reservado para o próximo agendamento.',
    remember: 'Lembrar meu nome e endereço neste aparelho',
    rememberHint: 'Você apaga quando quiser em Privacidade.',
    required: 'obrigatório',
    pixKey: 'Chave Pix (CNPJ)',
    copyPix: 'Copiar chave Pix',
    pixCopied: 'Chave Pix copiada',
    summary: {
      session: 'Sessão',
      addons: 'Adicionais',
      home: 'Deslocamento',
      peak: 'Horário de pico',
      special: 'Pedido específico',
      discount: 'Primeira sessão',
      coupon: 'Cupom',
      pix: 'Desconto Pix',
      total: 'Total',
      deposit: 'Sinal de 30% para confirmar',
      deposit: 'Sinal para confirmar',
      rest: 'Restante após a sessão',
      note: 'O sinal é abatido do total. O restante é pago após a sessão.',
    },
    cta: 'Enviar pedido no WhatsApp',
      street: 'Informe a rua.',
      number: 'Informe o número.',
      district: 'Informe o bairro.',
      consent: 'Marque a autorização para usar as preferências.',
      consent: 'Marque a autorização para usar o pedido específico.',
      age: 'Confirme que você tem 18 anos ou mais.',
      summary: 'Confira os campos destacados antes de enviar.',
    },
    sent: {
  },
  sessions: {
    title: 'Sessões',
    lead: 'Três durações, o mesmo cuidado. Valores no estúdio; no seu endereço, some o deslocamento.',
    lead: 'Cinco sessões, do relaxamento à estética. Valores no estúdio; no seu endereço, some o deslocamento.',
    choose: 'Escolher',
    popular: 'mais pedida',
    minutes: 'min',
      },
      {
        title: 'Confirme no WhatsApp',
        text: `O resumo chega pronto. Respondo com o horário exato e o sinal de ${CONFIG.depositPct}% via Pix.`,
        text: `O resumo chega pronto. Respondo com o horário exato e o sinal de ${money(CONFIG.deposit, 'pt')} via Pix.`,
      },
      {
        title: 'Chegue e relaxe',
  about: {
    title: 'Quem atende',
    p1: 'Sou Thalyson, massoterapeuta em São Paulo. Trabalho com massagem masculina em sessões longas, com pressão ajustada ao seu corpo e um ambiente reservado.',
    p2: 'Atendo no estúdio na Bela Vista e, com agendamento, no seu endereço. Sem fila, sem espera, sem barulho.',
    p2: 'Atendo em uma suíte no Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú), e, com agendamento, no seu endereço. Sem fila, sem espera, sem barulho.',
    quote: 'Sem fila, sem espera, sem barulho.',
    quoteBy: 'Thalyson, massoterapeuta',
    plaque: {
      label: 'Estúdio particular',
      hoursValue: '9h — 22h',
      hoursValue: '9h — 23h',
      hoursNote: 'todos os dias, com hora marcada',
      address: 'Bela Vista · São Paulo',
      age: 'Atendimento 18+',
      'Toalhas, óleos e chuveiro no estúdio',
      'Endereço completo só depois da confirmação',
    ],
  },
  faq: {
  },    faq: {
    title: 'Perguntas',
    items: [
      {
        q: 'Preciso pagar agora?',
        a: `Não. Montar o pedido é gratuito. O sinal de ${CONFIG.depositPct}% confirma a reserva e é abatido do total; o restante é pago após a sessão.`,
        a: `Não. Montar o pedido é gratuito. O sinal de ${money(CONFIG.deposit, 'pt')} confirma a reserva e é abatido do total; o restante é pago após a sessão.`,
      },
      {
        q: 'Como funciona a janela de chegada?',
      },
      {
        q: 'O endereço do estúdio é público?',
        a: 'O bairro é. A rua e o número vão na conversa depois da confirmação, para manter a discrição.',
        a: 'O bairro é. A suíte fica no Centro Histórico, na Bela Vista, perto do Metrô Anhangabaú; a rua e o número vão na conversa depois da confirmação.',
      },
      {
        q: 'Posso remarcar ou cancelar?',
      },
      {
        q: 'Você atende no meu endereço?',
        a: 'Sim, com taxa de deslocamento de R$ 60. Sessões entre 18h e 22h têm acréscimo de R$ 30, no estúdio ou no seu endereço. O endereço é confirmado na conversa.',
        a: `Sim, com taxa de deslocamento de ${money(CONFIG.homeFee, 'pt')}. No seu endereço, sessões na janela da noite têm acréscimo de ${money(CONFIG.peakFee, 'pt')}. O endereço é confirmado na conversa.`,
      },
      {
        q: 'Quais formas de pagamento?',
        a: 'Pix ou cartão. Parcelamento pode ter taxa, sempre informada antes do pagamento.',
        a: `Pix com ${CONFIG.pixDiscountPct}% de desconto, dinheiro ou cartão em até 12x com taxa, sempre informada antes do pagamento.`,
      },
      {
        q: 'É minha primeira sessão. Muda algo?',
        a: `A primeira sessão tem ${CONFIG.discountPct}% de desconto, já aplicado no bilhete. Se preferir mais tempo, comece pela de 90 minutos.`,
        a: `A primeira sessão tem ${money(CONFIG.firstDiscount, 'pt')} de desconto, já aplicado no bilhete. Se preferir mais tempo, comece pela sensitiva de 60 minutos.`,
      },
      {
        q: 'O que é o pedido específico?',
        a: `É um espaço opcional para dizer o que você procura, com acréscimo de ${money(CONFIG.specialFee, 'pt')} quando o pedido é aceito. Se não for possível atender, o valor não é cobrado.`,
      },
      {
        q: 'Tem como adicionar tempo ou depilação?',
        a: `Sim. ${money(CONFIG.addons[0].price, 'pt')} por 30 minutos extras e ${money(CONFIG.addons[1].price, 'pt')} para aparar pelos com máquina em até três regiões.`,
      },
    ],
  },
  footer: {
    contact: 'Contato',
    legal: 'Legal',
    privacy: 'Privacidade e dados',
    reviews: 'Avaliações',
    age: 'Conteúdo e atendimento exclusivos para maiores de 18 anos.',
    rights: 'Todos os direitos reservados.',
    cnpj: 'CNPJ',
        {
          h: '2. Dados que coletamos e por quê',
          p: [
            'Nome (como quer ser chamado), data, janela de horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se você escolher atendimento no seu endereço, para o deslocamento.',
            'Nome (como quer ser chamado), data, janela de horário, sessão e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se você escolher atendimento no seu endereço, para o deslocamento.',
            'Também registramos, quando houver, adicionais, pedido específico e cupom aplicado, apenas para montar o valor da sessão.',
            'Não pedimos CPF, e-mail, telefone nem data de nascimento no formulário. Seu número aparece apenas na conversa de WhatsApp que você mesmo inicia.',
          ],
        },
        {
          h: '3. Dado sensível (vida sexual)',
          p: [
            'O campo opcional de preferências pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos esse conteúdo se você marcar o consentimento ao lado do campo, e apenas para avaliar o pedido. Ele não é salvo neste aparelho nem registrado em banco de dados. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.',
            'O campo opcional de pedido específico pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos esse conteúdo se você marcar o consentimento ao lado do campo, e apenas para avaliar o pedido. Ele não é salvo neste aparelho nem registrado em banco de dados. O acréscimo correspondente só é cobrado se o pedido for aceito. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.',
          ],
        },
        {
        {
          h: '4. Preços e pagamento',
          p: [
            'Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. Deslocamento, acréscimo noturno e preferências aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.',
            'Os valores são exibidos em reais. O sinal de R$ 40 confirma a reserva e é abatido do total; o restante é pago após a sessão. Deslocamento, acréscimo noturno no seu endereço, adicionais, pedido específico, cupom e desconto Pix de 3% aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.',
          ],
        },
        {
    tomorrow: 'Tomorrow',
    windows: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
    whoLegend: 'Who is coming',
    addons: 'Extras',
    addonsHint: 'They add time and cost to the session.',
    coupon: {
      label: 'Coupon',
      placeholder: 'Code',
      apply: 'Apply',
      applied: 'Coupon applied',
      remove: 'Remove',
      invalid: 'Invalid or expired coupon.',
    },
    name: 'What should I call you',
    namePlaceholder: 'Your name',
    payment: 'Payment',
    pix: 'Pix',
    card: 'Card',
    cardNote: 'Installments may carry a fee, always quoted first.',
    note: 'Preferences',
    pix: 'Pix −3%',
    card: 'Card in 12x',
    cash: 'Cash',
    cardNote: 'Card installments carry a fee, quoted before payment.',
    prefs: 'Preferences',
    prefsOptional: 'optional',
    prefsPlaceholder: 'E.g. more pressure on the shoulders, quiet room.',
    note: 'Specific request',
    noteOptional: 'optional',
    notePlaceholder: 'E.g. more pressure on the shoulders, quiet room.',
    notePlaceholder: 'Something specific you would like in the session.',
    consent:
      'I authorize the use of these preferences — which may reveal sensitive data — only to review this request. They are not saved on this device.',
      'I consent to sharing a request that may reveal data about my sexual life (sensitive data), only so it can be reviewed. It travels only through WhatsApp and is not saved on this device.',
    noteHint: 'If it cannot be accommodated, the fee is not charged.',
    age: 'I confirm I am 18 or older and have read the Privacy Policy and the Terms.',
    gift: 'SESSAO2 coupon reserved for your next booking.',
    remember: 'Remember my name and address on this device',
    rememberHint: 'You can erase it any time under Privacy.',
    required: 'required',
    pixKey: 'Pix key (CNPJ)',
    copyPix: 'Copy Pix key',
    pixCopied: 'Pix key copied',
    summary: {
      session: 'Session',
      addons: 'Extras',
      home: 'Travel',
      peak: 'Evening rate',
      special: 'Specific request',
      discount: 'First session',
      coupon: 'Coupon',
      pix: 'Pix discount',
      total: 'Total',
      deposit: '30% deposit to confirm',
      deposit: 'Deposit to confirm',
      rest: 'Rest after the session',
      note: 'The deposit comes off the total. The rest is paid after the session.',
    },
    cta: 'Send request on WhatsApp',
      street: 'Enter the street.',
      number: 'Enter the number.',
      district: 'Enter the neighborhood.',
      consent: 'Check the authorization to use your preferences.',
      consent: 'Check the authorization to use your specific request.',
      age: 'Confirm that you are 18 or older.',
      summary: 'Check the highlighted fields before sending.',
    },
    sent: {
  },
  sessions: {
    title: 'Sessions',
    lead: 'Three lengths, the same care. Prices at the studio; at your place, add the travel fee.',
    lead: 'Five sessions, from relaxation to grooming. Prices at the studio; at your place, add the travel fee.',
    choose: 'Choose',
    popular: 'most requested',
    minutes: 'min',
      },
      {
        title: 'Confirm on WhatsApp',
        text: `The summary arrives ready. I reply with the exact time and a ${CONFIG.depositPct}% deposit via Pix.`,
        text: `The summary arrives ready. I reply with the exact time and the ${money(CONFIG.deposit, 'en')} deposit via Pix.`,
      },
      {
        title: 'Arrive and unwind',
  about: {
    title: 'Who you meet',
    p1: 'I am Thalyson, a massage therapist in São Paulo. I work with men’s massage in long sessions, with pressure adjusted to your body and a private room.',
    p2: 'I see clients at the studio in Bela Vista and, by appointment, at your address. No queue, no waiting, no noise.',
    p2: 'I see clients in a private suite in Centro Histórico, Bela Vista (near Anhangabaú station), and, by appointment, at your address. No queue, no waiting, no noise.',
    quote: 'No queue, no waiting, no noise.',
    quoteBy: 'Thalyson, massage therapist',
    plaque: {
      label: 'Private studio',
      hoursValue: '9:00 — 22:00',
      hoursValue: '9:00 — 23:00',
      hoursNote: 'every day, by appointment',
      address: 'Bela Vista · São Paulo',
      age: '18+ only',
    items: [
      {
        q: 'Do I pay now?',
        a: `No. Building the request is free. A ${CONFIG.depositPct}% deposit confirms the booking and comes off the total; the rest is paid after the session.`,
        a: `No. Building the request is free. A ${money(CONFIG.deposit, 'en')} deposit confirms the booking and comes off the total; the rest is paid after the session.`,
      },
      {
        q: 'How does the arrival window work?',
      },
      {
        q: 'Is the studio address public?',
        a: 'The neighborhood is. The street and number come in the chat after confirmation, to keep things discreet.',
        a: 'The neighborhood is. The suite is in Centro Histórico, Bela Vista, near Anhangabaú station; street and number come in the chat after confirmation.',
      },
      {
        q: 'Can I reschedule or cancel?',
      },
      {
        q: 'Do you come to my place?',
        a: 'Yes, with a R$ 60 travel fee. Sessions between 6 and 10 pm carry a R$ 30 evening rate, at the studio or at your place. The address is confirmed in the chat.',
        a: `Yes, with a ${money(CONFIG.homeFee, 'en')} travel fee. At your address, evening sessions carry a ${money(CONFIG.peakFee, 'en')} evening rate. The address is confirmed in the chat.`,
      },
      {
        q: 'How do I pay?',
        a: 'Pix or card. Installments may carry a fee, always quoted before payment.',
        a: `Pix with ${CONFIG.pixDiscountPct}% off, cash, or card in up to 12 installments with a fee, always quoted before payment.`,
      },
      {
        q: 'It is my first session. Anything different?',
        a: `Your first session is ${CONFIG.discountPct}% off, already applied on the slip. If you want more time, start with the 90-minute session.`,
        a: `Your first session is ${money(CONFIG.firstDiscount, 'en')} off, already applied on the slip. If you want more time, start with the 60-minute sensitive session.`,
      },
      {
        q: 'What is the specific request?',
        a: `An optional space to say what you are looking for, with a ${money(CONFIG.specialFee, 'en')} fee when the request is accepted. If it cannot be accommodated, the fee is not charged.`,
      },
      {
        q: 'Can I add time or grooming?',
        a: `Yes. ${money(CONFIG.addons[0].price, 'en')} for 30 extra minutes and ${money(CONFIG.addons[1].price, 'en')} to trim hair with clippers in up to three areas.`,
      },
    ],
  },
  footer: {
    contact: 'Contact',
    legal: 'Legal',
    privacy: 'Privacy and data',
    reviews: 'Reviews',
    age: 'Content and service intended for adults 18 and over.',
    rights: 'All rights reserved.',
    cnpj: 'CNPJ',
        {
          h: '2. What we collect and why',
          p: [
            'Name (what you want to be called), date, time window, package and payment method: to prepare and perform the booking (Art. 7, V, performance of contract). Address (street, number, complement, neighborhood and postal code): only if you choose service at your address, for travel.',
            'Name (what you want to be called), date, time window, session and payment method: to prepare and perform the booking (Art. 7, V, performance of contract). Address (street, number, complement, neighborhood and postal code): only if you choose service at your address, for travel.',
            'We also record extras, a specific request and an applied coupon, when present, only to calculate the session price.',
            'We do not ask for CPF, email, phone or date of birth in the form. Your number appears only in the WhatsApp conversation you start yourself.',
          ],
        },
        {
          h: '3. Sensitive data (sexual life)',
          p: [
            'The optional preferences field may reveal data about sexual life, which is sensitive data (Art. 5, II). We only process it if you check the consent box beside the field, and only to review the request. It is not saved on this device or stored in a database. You may withdraw consent at any time by asking for the conversation to be deleted.',
            'The optional specific request field may reveal data about sexual life, which is sensitive data (Art. 5, II). We only process it if you check the consent box beside the field, and only to review the request. It is not saved on this device or stored in a database. The corresponding fee is charged only if the request is accepted. You may withdraw consent at any time by asking for the conversation to be deleted.',
          ],
        },
        {
        {
          h: '4. Prices and payment',
          p: [
            'Prices are shown in Brazilian reais. The deposit confirms the booking and comes off the total; the rest is paid after the session. Travel, evening rate and preferences appear in the summary before sending. Card installments may carry fees, quoted before payment.',
            'Prices are shown in Brazilian reais. A R$ 40 deposit confirms the booking and comes off the total; the rest is paid after the session. Travel, the evening rate at your address, extras, specific request, coupon and the 3% Pix discount appear in the summary before sending. Card installments may carry fees, quoted before payment.',
          ],
        },
        {
  );
}

/** Foto com plano B: se o arquivo não estiver em public/, mostra a inicial. */
function Portrait({ alt }: { alt: string }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Alguns servidores devolvem HTML no lugar da imagem sem disparar onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <span className="rx-portrait rx-portrait--fallback" role="img" aria-label={alt}>
        T
      </span>
    );
  }
  return (
    <img
      ref={ref}
      className="rx-portrait"
      src={CONFIG.avatar}
      alt={alt}
      onError={() => setFailed(true)}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth === 0) setFailed(true);
      }}
    />
  );
}

/* ==========================================================================
   Moldura de diálogo
   ========================================================================== */
  });
  const [name, setName] = useState(profile?.name ?? '');
  const [payment, setPayment] = useState<Payment>('pix');
  const [note, setNote] = useState('');
  const [prefs, setPrefs] = useState('');
  const [special, setSpecial] = useState('');
  const [noteConsent, setNoteConsent] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [addons, setAddons] = useState<Record<AddonId, boolean>>({ time: false, groom: false });
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<{ code: string; pct: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [cep, setCep] = useState(profile?.cep ?? '');
  const [street, setStreet] = useState(profile?.street ?? '');
  const [number, setNumber] = useState(profile?.number ?? '');
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'notfound' | 'error'>('idle');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [frozen, setFrozen] = useState<{
    base: number;
    addons: number;
    special: number;
    home: number;
    peak: number;
    discount: number;
    pix: number;
    total: number;
    deposit: number;
    rest: number;
  } | null>(null);
  const [refId] = useState(makeRef);
  const [barVisible, setBarVisible] = useState(false);
  const day = days[dayIndex];
  const openWindows = windowsFor(day.date);

  const base = pkg.price;
  // A depilação isolada não aceita o adicional de depilação.
  const availableAddons = CONFIG.addons.filter((item) => !(pkgId === 'aparo' && item.id === 'groom'));
  const activeAddons = availableAddons.filter((item) => addons[item.id]);
  const extraMinutes = activeAddons.reduce((sum, item) => sum + item.minutes, 0);
  const addonsTotal = activeAddons.reduce((sum, item) => sum + item.price, 0);
  const duration = pkg.minutes + extraMinutes;
  const hasSpecial = noteConsent && special.trim().length > 2;
  const specialFee = hasSpecial ? CONFIG.specialFee : 0;

  const base = pkg.price + addonsTotal + specialFee;
  const home = place === 'home' ? CONFIG.homeFee : 0;
  const peak = win === 'evening' ? CONFIG.peakFee : 0;
  const discount = eligible ? Math.round((base * CONFIG.discountPct) / 100) : 0;
  const total = base + home + peak - discount;
  const deposit = Math.round((total * CONFIG.depositPct) / 100);
  const peak = place === 'home' && win === 'evening' ? CONFIG.peakFee : 0;
  const couponDiscount = coupon ? Math.floor(base * coupon.pct) : 0;
  const rawDiscount = couponDiscount > 0 ? couponDiscount : eligible ? CONFIG.firstDiscount : 0;
  const discount = Math.min(rawDiscount, base);
  const afterDiscount = base - discount;
  const pix = payment === 'pix' ? Math.ceil((afterDiscount * CONFIG.pixDiscountPct) / 100) : 0;
  const total = afterDiscount - pix + home + peak;
  const deposit = Math.min(CONFIG.deposit, total);
  const rest = Math.max(0, total - deposit);
  const placeLabel = place === 'studio' ? c.studio : c.home;
  const paymentLabel = payment === 'pix' ? c.pix : payment === 'card' ? c.card : c.cash;
  const addressLine = [street, number, complement, district, cep].filter(Boolean).join(', ');
  const quote = frozen ?? { base, home, peak, discount, total, deposit };
  const quote = frozen ?? {
    base,
    addons: addonsTotal,
    special: specialFee,
    home,
    peak,
    discount,
    pix,
    total,
    deposit,
    rest,
  };

  const waMessage = useMemo(() => {
    const lines = [
      `*${c.title} — ${CONFIG.brand}*`,
      `${c.ref} ${refId}`,
      '',
      `${c.steps.time}: ${pkg.name[lang]} · ${pkg.minutes} min`,
      `${c.steps.time}: ${pkg.name[lang]} · ${duration} min`,
      ...activeAddons.map((item) => `• ${item.name[lang]} (${money(item.price, lang)})`),
      `${c.steps.place}: ${placeLabel}${place === 'home' ? ` — ${addressLine}` : ''}`,
      `${c.steps.when}: ${longDay(day.date, lang)} · ${c.windows[win]} (${windowRange(win, lang)})`,
      `${c.steps.who}: ${name.trim()}`,
      `${c.payment}: ${payment === 'pix' ? c.pix : c.card}`,
      `${c.payment}: ${paymentLabel}`,
    ];
    if (note.trim()) lines.push(`${c.note}: ${note.trim()}`);
    if (prefs.trim()) lines.push(`${c.prefs}: ${prefs.trim()}`);
    if (hasSpecial) {
      lines.push(`${c.note} (${money(CONFIG.specialFee, lang)}): ${special.trim()}`);
    }
    lines.push('', `${c.summary.session}: ${money(pkg.price, lang)}`);
    if (quote.addons > 0) lines.push(`${c.summary.addons}: +${money(quote.addons, lang)}`);
    if (quote.special > 0) lines.push(`${c.summary.special}: +${money(quote.special, lang)}`);
    if (quote.home > 0) lines.push(`${c.summary.home}: ${money(quote.home, lang)}`);
    if (quote.peak > 0) lines.push(`${c.summary.peak}: ${money(quote.peak, lang)}`);
    if (quote.discount > 0) {
      lines.push(`${c.summary.discount} (−${CONFIG.discountPct}%): −${money(quote.discount, lang)}`);
      const label = coupon ? `${c.summary.coupon} ${coupon.code}` : c.summary.discount;
      lines.push(`${label}: −${money(quote.discount, lang)}`);
    }
    if (quote.pix > 0) lines.push(`${c.summary.pix}: −${money(quote.pix, lang)}`);
    lines.push(
      '',
      `${c.summary.total}: ${money(quote.total, lang)}`,
      `${c.summary.deposit.replace('30%', `${CONFIG.depositPct}%`)}: ${money(quote.deposit, lang)}`,
      `${c.summary.deposit}: ${money(quote.deposit, lang)}`,
      `${c.summary.rest}: ${money(quote.rest, lang)}`,
      '',
      `✅ ${c.age}`,
      `🎁 ${c.gift}`,
    );
    return lines.join('\n');
  }, [
    activeAddons,
    addressLine,
    c,
    coupon,
    day.date,
    duration,
    hasSpecial,
    lang,
    name,
    note,
    payment,
    paymentLabel,
    pkg,
    place,
    placeLabel,
    prefs,
    quote.addons,
    quote.deposit,
    quote.discount,
    quote.home,
    quote.peak,
    quote.pix,
    quote.rest,
    quote.special,
    quote.total,
    refId,
    special,
    win,
  ]);

      if (!number.trim()) next.number = c.errors.number;
      if (district.trim().length < 2) next.district = c.errors.district;
    }
    if (note.trim() && !noteConsent) next.consent = c.errors.consent;
    if (special.trim() && !noteConsent) next.consent = c.errors.consent;
    if (!ageOk) next.age = c.errors.age;
    return next;
  }

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    const pct = CONFIG.coupons[code];
    if (!pct) {
      setCoupon(null);
      setCouponError(c.coupon.invalid);
      return;
    }
    setCoupon({ code, pct });
    setCouponError('');
    setCouponInput('');
    onToast(`${c.coupon.applied}: ${code}`);
  }

  async function copyPix() {
    try {
      await navigator.clipboard.writeText(CONFIG.pixKey);
      setPixCopied(true);
      onToast(c.pixCopied);
      window.setTimeout(() => setPixCopied(false), 2400);
    } catch {
      onToast(`${c.pixKey}: ${CONFIG.pixKey}`);
    }
  }

  function handleSend(event: MouseEvent<HTMLAnchorElement>) {
    const next = validate();
    if (Object.keys(next).length > 0) {
      event.preventDefault();
      setErrors(next);
      const order: (keyof Errors)[] = ['name', 'cep', 'street', 'number', 'district', 'consent'];
      const order: (keyof Errors)[] = [
        'name',
        'cep',
        'street',
        'number',
        'district',
        'consent',
        'age',
      ];
      const first = order.find((key) => next[key]);
      requestAnimationFrame(() => {
        if (!first) return;
    } else {
      onProfile(null);
    }
    setFrozen({ base, home, peak, discount, total, deposit });
    setFrozen({ base, addons: addonsTotal, special: specialFee, home, peak, discount, pix, total, deposit, rest });
    onBooked();
    setSent(true);
  }
    setWin(id);
  }

  const depositLabel = c.summary.deposit.replace('30%', `${CONFIG.depositPct}%`);
  const depositLabel = c.summary.deposit;

  return (
    <>
          >
            {c.sent.again}
          </button>
          <div className="rx-pixbox">
            <span>
              {c.pixKey}: <strong>{CONFIG.pixKey}</strong>
            </span>
            <button type="button" className="rx-btn rx-btn--ghost rx-btn--small" onClick={copyPix}>
              {pixCopied ? c.pixCopied : c.copyPix}
            </button>
          </div>
          <p className="rx-fineprint">{c.sent.note}</p>
        </div>
      ) : (
                1
              </span>
              <span className="rx-step__name">{c.steps.time}</span>
              <span className="rx-step__val">{pkg.minutes} min</span>
              <span className="rx-step__val">{duration} min</span>
            </legend>
            <div className="rx-options rx-options--packages">
              {CONFIG.packages.map((item) => (
                </label>
              ))}
            </div>

            <p className="rx-addons__title">{c.addons}</p>
            <div className="rx-addons">
              {availableAddons.map((item) => {
                const on = Boolean(addons[item.id]);
                return (
                  <label key={item.id} className={on ? 'rx-addon rx-addon--on' : 'rx-addon'}>
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setAddons((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                    />
                    <span className="rx-addon__box" aria-hidden="true">
                      {on ? '✓' : ''}
                    </span>
                    <span className="rx-addon__name">{item.name[lang]}</span>
                    <span className="rx-addon__price">+{money(item.price, lang)}</span>
                  </label>
                );
              })}
            </div>
            <p className="rx-hint">{c.addonsHint}</p>
          </fieldset>

          <fieldset className="rx-step">
              <span className="rx-label" id="rx-payment-label">
                {c.payment}
              </span>
              <div className="rx-options rx-options--two" role="radiogroup" aria-labelledby="rx-payment-label">
                <label className="rx-opt rx-opt--compact">
                  <input
                    type="radio"
                    name="rx-payment"
                    value="pix"
                    checked={payment === 'pix'}
                    onChange={() => setPayment('pix')}
                  />
                  <span className="rx-opt__body">
                    <span className="rx-opt__title">{c.pix}</span>
                  </span>
                </label>
                <label className="rx-opt rx-opt--compact">
                  <input
                    type="radio"
                    name="rx-payment"
                    value="card"
                    checked={payment === 'card'}
                    onChange={() => setPayment('card')}
                  />
                  <span className="rx-opt__body">
                    <span className="rx-opt__title">{c.card}</span>
                  </span>
                </label>
              <div
                className="rx-options rx-options--three"
                role="radiogroup"
                aria-labelledby="rx-payment-label"
              >
                {([
                  ['pix', c.pix],
                  ['card', c.card],
                  ['cash', c.cash],
                ] as [Payment, string][]).map(([id, label]) => (
                  <label className="rx-opt rx-opt--compact" key={id}>
                    <input
                      type="radio"
                      name="rx-payment"
                      value={id}
                      checked={payment === id}
                      onChange={() => setPayment(id)}
                    />
                    <span className="rx-opt__body">
                      <span className="rx-opt__title">{label}</span>
                    </span>
                  </label>
                ))}
              </div>
              <p className="rx-hint">{c.cardNote}</p>
            </div>

            <div className="rx-field">
              <label className="rx-label" htmlFor="rx-prefs">
                {c.prefs} <span className="rx-optional">{c.prefsOptional}</span>
              </label>
              <textarea
                id="rx-prefs"
                className="rx-input rx-input--area"
                rows={2}
                placeholder={c.prefsPlaceholder}
                value={prefs}
                onChange={(event) => setPrefs(event.target.value)}
              />
            </div>

            <div className="rx-field">
              <label className="rx-label" htmlFor="rx-note">
                {c.note} <span className="rx-optional">{c.noteOptional}</span>
                {c.note} <span className="rx-optional">{c.noteOptional}</span>{' '}
                <span className="rx-fee">+{money(CONFIG.specialFee, lang)}</span>
              </label>
              <textarea
                id="rx-note"
                className="rx-input rx-input--area"
                rows={2}
                placeholder={c.notePlaceholder}
                value={note}
                value={special}
                aria-describedby="rx-note-hint"
                onChange={(event) => {
                  setNote(event.target.value);
                  setSpecial(event.target.value);
                  if (!event.target.value.trim()) clearError('consent');
                }}
              />
              <p className="rx-hint" id="rx-note-hint">
                {c.noteHint}
              </p>
            </div>

            {note.trim().length > 0 && (
            {special.trim().length > 0 && (
              <div className="rx-consent">
                <label className="rx-check">
                  <input

            <label className="rx-check rx-check--saved">
              <input
                id="rx-age"
                type="checkbox"
                checked={ageOk}
                aria-invalid={Boolean(errors.age)}
                aria-describedby={errors.age ? 'rx-age-err' : undefined}
                onChange={(event) => {
                  setAgeOk(event.target.checked);
                  clearError('age');
                }}
              />
              <span>
                {c.age}
                {errors.age && (
                  <span className="rx-err" id="rx-age-err">
                    {errors.age}
                  </span>
                )}
              </span>
            </label>

            <label className="rx-check rx-check--saved">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => {
                  onRemember(event.target.checked);
      <div className="rx-perf" aria-hidden="true">
        <span className="rx-perf__cut rx-perf__cut--left" />
        <span className="rx-perf__cut rx-perf__cut--right" />
      </div>        <div className="rx-ledger">
      </div>

      {!sent && (
        <div className="rx-coupon">
          <label className="rx-label" htmlFor="rx-coupon">
            {c.coupon.label}
          </label>
          {coupon ? (
            <div className="rx-coupon__applied">
              <span>
                {coupon.code} · −{Math.round(coupon.pct * 100)}%
              </span>
              <button
                type="button"
                className="rx-linkbtn"
                onClick={() => {
                  setCoupon(null);
                  setCouponError('');
                }}
              >
                {c.coupon.remove}
              </button>
            </div>
          ) : (
            <div className="rx-coupon__row">
              <input
                id="rx-coupon"
                className="rx-input"
                placeholder={c.coupon.placeholder}
                value={couponInput}
                autoCapitalize="characters"
                aria-invalid={Boolean(couponError)}
                aria-describedby={couponError ? 'rx-coupon-err' : undefined}
                onChange={(event) => {
                  setCouponInput(event.target.value);
                  setCouponError('');
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    applyCoupon();
                  }
                }}
              />
              <button type="button" className="rx-btn rx-btn--ghost rx-btn--small" onClick={applyCoupon}>
                {c.coupon.apply}
              </button>
            </div>
          )}
          {couponError && (
            <p className="rx-err" id="rx-coupon-err" role="alert">
              {couponError}
            </p>
          )}
        </div>
      )}

      <div className="rx-ledger">
        <div className="rx-ledger__row">
          <span>
            {c.summary.session} · {pkg.name[lang]} ({pkg.minutes} min)
          </span>
          <span className="rx-leader" aria-hidden="true" />
          <span>{money(quote.base, lang)}</span>
          <span>{money(pkg.price, lang)}</span>
        </div>
        {quote.addons > 0 && (
          <div className="rx-ledger__row">
            <span>{c.summary.addons}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>+{money(quote.addons, lang)}</span>
          </div>
        )}
        {quote.special > 0 && (
          <div className="rx-ledger__row">
            <span>{c.summary.special}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>+{money(quote.special, lang)}</span>
          </div>
        )}
        {quote.home > 0 && (
          <div className="rx-ledger__row">
            <span>{c.summary.home}</span>
        )}
        {quote.discount > 0 && (
          <div className="rx-ledger__row rx-ledger__row--discount">
            <span>
              {c.summary.discount} (−{CONFIG.discountPct}%)
            </span>
            <span>{coupon ? `${c.summary.coupon} ${coupon.code}` : c.summary.discount}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>−{money(quote.discount, lang)}</span>
          </div>
        )}
        {quote.pix > 0 && (
          <div className="rx-ledger__row rx-ledger__row--discount">
            <span>{c.summary.pix}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>−{money(quote.pix, lang)}</span>
          </div>
        )}
        <div className="rx-ledger__row rx-ledger__row--total">
          <span>{c.summary.total}</span>
          <span className="rx-leader" aria-hidden="true" />
        </div>
        <p className="rx-deposit">
          {depositLabel}: <strong>{money(quote.deposit, lang)}</strong>
          {' · '}
          {c.summary.rest}: {money(quote.rest, lang)}
          <br />
          {c.summary.note}
        </p>
          {CONFIG.packages.map((item) => (
            <article className="rx-session" key={item.id}>
              <div className="rx-session__main">
                <h3 className="rx-session__name">
                  {item.name[lang]}
                  {item.popular && <span className="rx-popular">{t.sessions.popular}</span>}
                </h3>
                <h3 className="rx-session__name">{item.name[lang]}</h3>
                <p className="rx-session__blurb">{item.blurb[lang]}</p>
                <ul className="rx-session__tags" aria-label={item.name[lang]}>
                  {item.tags[lang].map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="rx-session__meta">
                <span className="rx-session__min">
          </ul>
        </div>
        <figure className="rx-about__quote">
          <Portrait alt={t.about.quoteBy} />
          <blockquote>{t.about.quote}</blockquote>
          <figcaption>{t.about.quoteBy}</figcaption>
        </figure>
          <div>
            <h3>{t.footer.contact}</h3>
            <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
            <a href={CONFIG.reviews} target="_blank" rel="noopener noreferrer">
              {t.footer.reviews}
            </a>
            <a href={`https://wa.me/${CONFIG.whatsapp}`} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            <p className="rx-foot__cnpj">
              {t.footer.cnpj} {CONFIG.cnpj}
            </p>
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [remember, setRemember] = useState(false);
  const [booked, setBooked] = useState(false);
  const [pkgId, setPkgId] = useState<PackageId>('deep');
  const [pkgId, setPkgId] = useState<PackageId>('classica');
  const [doc, setDoc] = useState<DocId | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(30px, 5vw, 72px);
  align-items: stretch;
  align-items: start;
}

@media (min-width: 861px) {
  /* O bilhete é mais alto que a coluna de texto: mantém a apresentação
     visível enquanto o formulário rola. */
  .rx-hero__copy {
    position: sticky;
    top: 92px;
  }
}

.rx-hero__copy {
  display: flex;
  flex-direction: column;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.rx-options--three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.rx-options--three .rx-opt--compact {
  padding: 8px 7px;
}

.rx-options--three .rx-opt__title {
  font-size: 11.5px;
  text-align: center;
  width: 100%;
}

.rx-addons__title {
  margin-top: 13px;
  margin-bottom: 6px;
  font-size: 11px;
  color: var(--ink-soft);
}

.rx-addons {
  display: grid;
  gap: 6px;
}

.rx-addon {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 9px;
  font-size: 11.5px;
  color: var(--ink-soft);
  cursor: pointer;
  transition: border-color 0.16s ease, background 0.16s ease;
}

.rx-addon:hover {
  border-color: var(--line-strong);
}

.rx-addon input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.rx-addon:has(input:focus-visible) {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.rx-addon--on {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.rx-addon__box {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  border: 1px solid var(--line-strong);
  border-radius: 4px;
  font-size: 10px;
  line-height: 1;
  color: var(--surface);
}

.rx-addon--on .rx-addon__box {
  border-color: var(--accent);
  background: var(--accent);
}

.rx-addon__name {
  min-width: 0;
}

.rx-addon__note {
  color: var(--muted);
}

.rx-addon__price {
  margin-left: auto;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.rx-coupon {
  margin-top: 12px;
}

.rx-coupon__row {
  display: flex;
  gap: 6px;
}

.rx-coupon__row .rx-input {
  flex: 1;
  min-width: 0;
  text-transform: uppercase;
}

.rx-coupon__applied {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 2px;
  padding: 8px 10px;
  border: 1px dashed var(--sage);
  border-radius: 8px;
  font-size: 11.5px;
  color: var(--sage);
}

@media (min-width: 561px) {
  .rx-options--packages {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 44px;
  padding: 8px 11px;
  border: 1px solid var(--line);
  border-radius: 10px;
  box-shadow: inset 0 0 0 1px var(--accent);
}

.rx-opt:has(input:checked) .rx-opt__title::after {
  content: ' \2713';
  color: var(--accent);
  font-size: 10px;
}

.rx-opt:has(input:focus-visible) {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
  color: var(--muted);
}

.rx-check .rx-err {
  display: block;
  margin-top: 3px;
}

.rx-fee {
  padding: 1px 5px;
  border: 1px solid var(--line);
  border-radius: 4px;
  font-size: 10px;
  color: var(--ink-soft);
  white-space: nowrap;
}

.rx-pixbox {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 12px;
  padding: 10px 11px;
  border: 1px dashed var(--line-strong);
  border-radius: 9px;
  font-size: 11px;
  color: var(--muted);
}

.rx-pixbox strong {
  font-weight: 500;
  color: var(--ink-soft);
  font-variant-numeric: tabular-nums;
}

.rx-consent {
  margin-top: 8px;
  padding: 9px 10px;
  color: var(--muted);
}

.rx-session__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 9px;
  list-style: none;
}

.rx-session__tags li {
  padding: 2px 7px;
  border: 1px solid var(--line);
  border-radius: 999px;
  font-size: 9.5px;
  line-height: 1.6;
  color: var(--muted);
  white-space: nowrap;
}

.rx-session__meta {
  display: flex;
  align-items: baseline;
  color: var(--muted);
}

.rx-portrait {
  display: block;
  width: 84px;
  height: 84px;
  margin-bottom: 18px;
  object-fit: cover;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface-2);
}

.rx-portrait--fallback {
  display: grid;
  place-items: center;
  font-family: var(--f-display);
  font-size: 32px;
  color: var(--ink-soft);
}

.rx-about__text > p {
  max-width: 56ch;
  margin-top: 12px;
  text-underline-offset: 3px;
}

.rx-foot__grid div > a {
  display: block;
  width: fit-content;
}

.rx-foot__cnpj {
  margin-top: 7px;
  font-size: 10.5px;
  }
}

@media (max-width: 380px) {
  .rx-options--two {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 560px) {
  .rx-hero {
    padding-top: 26px;
