'use client';

/**
 * relaxe — App.tsx
 *
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
 *
 * Os horários das janelas ficam em WINDOWS (abaixo) e o texto exibido fica em
 * plaque.hoursValue / hoursNote, em PT e EN.
 *
 * Nada mais precisa ser tocado: preços, resumo, mensagem do WhatsApp,
 * português, inglês, tema claro/escuro e documentos legais se atualizam sozinhos.
 */

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';

/* ==========================================================================
   CONFIG — dados do estúdio
   ========================================================================== */

const CONFIG = {
  brand: 'relaxe',

  /** TROQUE AQUI: 55 + DDD + número, apenas dígitos. */
  whatsapp: '5511999999999',

  email: 'relaxecomthalyson@gmail.com',
  razao: 'Thalyson Rodrigo dos Santos',
  cnpj: '62.922.530/0001-44',
  dpo: 'Thalyson Rodrigo dos Santos',
  dpoEmail: 'relaxecomthalyson@gmail.com',

  street: 'Avenida 9 de Julho',
  district: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',

  daysAhead: 14,

  /** Taxas e regras, em reais. */
  homeFee: 60,
  peakFee: 30,
  depositPct: 30,
  discountPct: 10,
  cancelFreeHours: 12,

  packages: [
    {
      id: 'essential',
      minutes: 60,
      price: 180,
      popular: false,
      name: { pt: 'Essencial', en: 'Essential' },
      blurb: {
        pt: 'Uma hora para desacelerar. Costas, ombros e cabeça, com pressão combinada antes de começar.',
        en: 'One hour to slow down. Back, shoulders and head, with pressure agreed before we start.',
      },
    },
    {
      id: 'deep',
      minutes: 90,
      price: 240,
      popular: true,
      name: { pt: 'Profunda', en: 'Deep' },
      blurb: {
        pt: 'Tempo para o corpo inteiro e para os pontos que pedem mais atenção. A mais pedida.',
        en: 'Time for the whole body and for the places that need more attention. The most requested.',
      },
    },
    {
      id: 'long',
      minutes: 120,
      price: 300,
      popular: false,
      name: { pt: 'Longa', en: 'Long' },
      blurb: {
        pt: 'Duas horas sem relógio. Ritmo lento, silêncio e espaço para terminar sem pressa.',
        en: 'Two hours without a clock. Slow rhythm, quiet, and room to finish unhurried.',
      },
    },
  ],
} as const;

type PackageId = (typeof CONFIG.packages)[number]['id'];
type Lang = 'pt' | 'en';
type Theme = 'light' | 'dark';
type Place = 'studio' | 'home';
type Payment = 'pix' | 'card';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';

// Janelas de chegada: ajuste aqui e no texto de horários da placa e do FAQ.
const WINDOWS = [
  { id: 'morning', start: 9, end: 12 },
  { id: 'afternoon', start: 13, end: 17 },
  { id: 'evening', start: 18, end: 22 },
] as const;

type WindowId = (typeof WINDOWS)[number]['id'];

type StoredProfile = {
  name?: string;
  place?: Place;
  cep?: string;
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
};

type Errors = Partial<Record<'name' | 'cep' | 'street' | 'number' | 'district' | 'consent', string>>;

const UPDATED = { pt: '29/10/2026', en: '29 October 2026' };

const STORE = {
  theme: 'relaxe.theme',
  lang: 'relaxe.lang',
  profile: 'relaxe.profile',
  booked: 'relaxe.booked',
};

const LOCALE = { pt: 'pt-BR', en: 'en-US' } as const;

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/* ==========================================================================
   Helpers
   ========================================================================== */

function readStore(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStore(key: string, value: string | null) {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* modo privado: segue sem persistir */
  }
}

function readProfile(): StoredProfile | null {
  const raw = readStore(STORE.profile);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredProfile;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function money(value: number, lang: Lang) {
  const formatted = new Intl.NumberFormat(LOCALE[lang], {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
  return formatted.replace(/^R\$\s*/, 'R$\u00a0');
}

function maskCep(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

function makeRef() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 4; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${out.slice(0, 2)}-${out.slice(2)}`;
}

function buildDays(count: number) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(base);
    date.setDate(base.getDate() + index);
    return { date, offset: index };
  });
}

/** Janelas que ainda fazem sentido hoje (margem de 90 min até o fim). */
function windowsFor(date: Date) {
  const now = Date.now();
  return WINDOWS.filter((w) => {
    const end = new Date(date);
    end.setHours(w.end, 0, 0, 0);
    return end.getTime() - now > 90 * 60 * 1000;
  }).map((w) => w.id);
}

function firstOpenDay(days: { date: Date }[]) {
  const index = days.findIndex((day) => windowsFor(day.date).length > 0);
  return index === -1 ? 0 : index;
}

function windowRange(id: WindowId, lang: Lang) {
  const w = WINDOWS.find((item) => item.id === id) ?? WINDOWS[0];
  return lang === 'pt' ? `${w.start}h–${w.end}h` : `${w.start}:00–${w.end}:00`;
}

function longDay(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  })
    .format(date)
    .replace(/\./g, '');
}

function shortWeekday(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { weekday: 'short' })
    .format(date)
    .replace(/\./g, '');
}

function monthLabel(date: Date, lang: Lang) {
  return new Intl.DateTimeFormat(LOCALE[lang], { month: 'long', year: 'numeric' }).format(date);
}

/* ==========================================================================
   Textos — português
   ========================================================================== */

const PT = {
  code: 'pt-BR',
  nav: {
    sessions: 'Sessões',
    how: 'Como funciona',
    about: 'Quem atende',
    faq: 'Perguntas',
  },
  controls: {
    lang: 'Idioma',
    toDark: 'Usar tema escuro',
    toLight: 'Usar tema claro',
    close: 'Fechar',
    skip: 'Ir para o agendamento',
  },
  hero: {
    title: ['Massagem masculina,', 'sem pressa.'],
    lead: 'Escolha o tempo, o lugar e uma janela de chegada. São quatro escolhas — o horário exato a gente acerta no WhatsApp.',
    primary: 'Montar minha sessão',
    secondary: 'Ver sessões',
    micro: 'Sem cadastro. Sem pagamento no site. Resposta no mesmo dia.',
  },
  ticket: {
    title: 'Bilhete de sessão',
    ref: 'Ref.',
    steps: { time: 'Tempo', place: 'Onde', when: 'Quando', who: 'Quem' },
    timeLegend: 'Quanto tempo você quer',
    placeLegend: 'Onde você prefere',
    studio: 'No estúdio',
    studioNote: 'Bela Vista · rua na conversa',
    home: 'No seu endereço',
    homeNote: 'Taxa de deslocamento',
    address: {
      cep: 'CEP',
      street: 'Rua',
      number: 'Número',
      complement: 'Complemento',
      district: 'Bairro',
      optional: 'opcional',
      loading: 'Buscando endereço…',
      notFound: 'Não encontramos esse CEP. Preencha o endereço à mão.',
      error: 'Não foi possível buscar o CEP. Preencha à mão.',
      hint: 'Rua e bairro são preenchidos pelo CEP.',
    },
    whenLegend: 'Quando você quer chegar',
    whenHelp: 'Você escolhe a janela; o minuto exato é confirmado no WhatsApp.',
    today: 'Hoje',
    tomorrow: 'Amanhã',
    windows: { morning: 'Manhã', afternoon: 'Tarde', evening: 'Noite' },
    whoLegend: 'Quem vai chegar',
    name: 'Como você quer ser chamado',
    namePlaceholder: 'Seu nome',
    payment: 'Pagamento',
    pix: 'Pix',
    card: 'Cartão',
    cardNote: 'Parcelamento pode ter taxa, informada antes.',
    note: 'Preferências',
    noteOptional: 'opcional',
    notePlaceholder: 'Ex.: mais pressão nos ombros, ambiente silencioso.',
    consent:
      'Autorizo o uso destas preferências — que podem revelar dado sensível — apenas para avaliar este pedido. Elas não ficam salvas no aparelho.',
    remember: 'Lembrar meu nome e endereço neste aparelho',
    rememberHint: 'Você apaga quando quiser em Privacidade.',
    required: 'obrigatório',
    summary: {
      session: 'Sessão',
      home: 'Deslocamento',
      peak: 'Horário de pico',
      discount: 'Primeira sessão',
      total: 'Total',
      deposit: 'Sinal de 30% para confirmar',
      note: 'O sinal é abatido do total. O restante é pago após a sessão.',
    },
    cta: 'Enviar pedido no WhatsApp',
    ctaNote: 'Nada é cobrado aqui. A confirmação e o sinal são combinados na conversa.',
    errors: {
      name: 'Escreva como você quer ser chamado.',
      cep: 'Informe um CEP com 8 números.',
      street: 'Informe a rua.',
      number: 'Informe o número.',
      district: 'Informe o bairro.',
      consent: 'Marque a autorização para usar as preferências.',
      summary: 'Confira os campos destacados antes de enviar.',
    },
    sent: {
      stamp: 'Pedido aberto',
      title: 'Falta só enviar',
      body: 'O resumo abriu no WhatsApp, pronto para enviar. Se a janela não abriu, use o botão abaixo e toque em enviar.',
      reopen: 'Abrir WhatsApp novamente',
      copy: 'Copiar pedido',
      copied: 'Pedido copiado',
      again: 'Montar outro pedido',
      note: 'A reserva só existe depois da minha confirmação e do sinal.',
    },
    bar: { cta: 'Enviar' },
  },
  sessions: {
    title: 'Sessões',
    lead: 'Três durações, o mesmo cuidado. Valores no estúdio; no seu endereço, some o deslocamento.',
    choose: 'Escolher',
    popular: 'mais pedida',
    minutes: 'min',
  },
  how: {
    title: 'Como funciona',
    lead: 'Do bilhete à sessão, sem ligação e sem cadastro.',
    steps: [
      {
        title: 'Monte o bilhete',
        text: 'Tempo, lugar e janela de chegada. Leva menos de um minuto.',
      },
      {
        title: 'Confirme no WhatsApp',
        text: `O resumo chega pronto. Respondo com o horário exato e o sinal de ${CONFIG.depositPct}% via Pix.`,
      },
      {
        title: 'Chegue e relaxe',
        text: 'O endereço completo vai na conversa. Cancelamento gratuito até 12h antes.',
      },
    ],
  },
  about: {
    title: 'Quem atende',
    p1: 'Sou Thalyson, massoterapeuta em São Paulo. Trabalho com massagem masculina em sessões longas, com pressão ajustada ao seu corpo e um ambiente reservado.',
    p2: 'Atendo no estúdio na Bela Vista e, com agendamento, no seu endereço. Sem fila, sem espera, sem barulho.',
    quote: 'Sem fila, sem espera, sem barulho.',
    quoteBy: 'Thalyson, massoterapeuta',
    plaque: {
      label: 'Estúdio particular',
      hoursValue: '9h — 22h',
      hoursNote: 'todos os dias, com hora marcada',
      address: 'Bela Vista · São Paulo',
      age: 'Atendimento 18+',
    },
    points: [
      'Atendimento individual e discreto',
      'Pressão combinada antes de começar',
      'Toalhas, óleos e chuveiro no estúdio',
      'Endereço completo só depois da confirmação',
    ],
  },
  faq: {
    title: 'Perguntas',
    items: [
      {
        q: 'Preciso pagar agora?',
        a: `Não. Montar o pedido é gratuito. O sinal de ${CONFIG.depositPct}% confirma a reserva e é abatido do total; o restante é pago após a sessão.`,
      },
      {
        q: 'Como funciona a janela de chegada?',
        a: 'Você escolhe manhã, tarde ou noite. Eu confirmo o minuto exato no WhatsApp, considerando o deslocamento até o estúdio ou o seu endereço.',
      },
      {
        q: 'O endereço do estúdio é público?',
        a: 'O bairro é. A rua e o número vão na conversa depois da confirmação, para manter a discrição.',
      },
      {
        q: 'Posso remarcar ou cancelar?',
        a: 'Sim. Até 12 horas antes, o sinal volta integralmente ou vira crédito. Com menos antecedência, vale a política de cancelamento.',
      },
      {
        q: 'Você atende no meu endereço?',
        a: 'Sim, com taxa de deslocamento de R$ 60. Sessões entre 18h e 22h têm acréscimo de R$ 30, no estúdio ou no seu endereço. O endereço é confirmado na conversa.',
      },
      {
        q: 'Quais formas de pagamento?',
        a: 'Pix ou cartão. Parcelamento pode ter taxa, sempre informada antes do pagamento.',
      },
      {
        q: 'É minha primeira sessão. Muda algo?',
        a: `A primeira sessão tem ${CONFIG.discountPct}% de desconto, já aplicado no bilhete. Se preferir mais tempo, comece pela de 90 minutos.`,
      },
    ],
  },
  footer: {
    tagline: 'Massagem masculina com hora marcada, na Bela Vista e no seu endereço.',
    studio: 'Estúdio',
    contact: 'Contato',
    legal: 'Legal',
    privacy: 'Privacidade e dados',
    age: 'Conteúdo e atendimento exclusivos para maiores de 18 anos.',
    rights: 'Todos os direitos reservados.',
    cnpj: 'CNPJ',
    docs: {
      privacy: 'Privacidade',
      terms: 'Termos',
      refund: 'Cancelamento',
      cookies: 'Cookies',
    },
  },
  privacyPanel: {
    title: 'Privacidade e dados',
    intro:
      'Este site não usa cookies de publicidade, análise ou rastreamento. Só guardamos o que você escolhe guardar.',
    rememberLabel: 'Lembrar meu nome e endereço',
    rememberHint: 'Salvo apenas neste navegador.',
    erase: 'Apagar meus dados',
    eraseConfirm: 'Confirmar exclusão',
    eraseHint: 'Remove nome, endereço e a marcação de primeira sessão deste aparelho.',
    erased: 'Dados apagados deste aparelho.',
    keepTheme: 'Tema e idioma continuam salvos como preferência.',
    docsLabel: 'Documentos',
  },
  legal: {
    updated: 'Última atualização',
    privacy: {
      title: 'Política de Privacidade',
      sections: [
        {
          h: '1. Controlador',
          p: [
            `Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD). Controlador: ${CONFIG.razao}, CNPJ ${CONFIG.cnpj}, ${CONFIG.street}, ${CONFIG.district}, ${CONFIG.city} - ${CONFIG.state}. Contato: ${CONFIG.email}. Encarregado (DPO): ${CONFIG.dpo}, ${CONFIG.dpoEmail}.`,
          ],
        },
        {
          h: '2. Dados que coletamos e por quê',
          p: [
            'Nome (como quer ser chamado), data, janela de horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se você escolher atendimento no seu endereço, para o deslocamento.',
            'Não pedimos CPF, e-mail, telefone nem data de nascimento no formulário. Seu número aparece apenas na conversa de WhatsApp que você mesmo inicia.',
          ],
        },
        {
          h: '3. Dado sensível (vida sexual)',
          p: [
            'O campo opcional de preferências pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos esse conteúdo se você marcar o consentimento ao lado do campo, e apenas para avaliar o pedido. Ele não é salvo neste aparelho nem registrado em banco de dados. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.',
          ],
        },
        {
          h: '4. Com quem os dados são compartilhados',
          p: [
            'WhatsApp (Meta Platforms), para onde sua solicitação é enviada por você. ViaCEP, que recebe o CEP digitado para preencher o endereço. Se um sistema de agenda estiver ativo, o provedor de banco de dados que o hospeda. Não vendemos dados.',
          ],
        },
        {
          h: '5. Armazenamento no seu aparelho',
          p: [
            'Seus dados só ficam salvos no aparelho se você marcar “Lembrar meus dados”. Nesse caso guardamos nome, tipo de local e endereço no armazenamento local do navegador. Você pode apagar tudo em Privacidade, no rodapé.',
          ],
        },
        {
          h: '6. Retenção',
          p: [
            'Conversas de WhatsApp e registros de agendamento são mantidos pelo tempo necessário para a sessão, para o acerto financeiro e para cumprir obrigações legais, e depois eliminados. Dados fiscais seguem os prazos da lei.',
          ],
        },
        {
          h: '7. Seus direitos (art. 18)',
          p: [
            'Confirmação do tratamento, acesso, correção, anonimização ou eliminação, portabilidade, informação sobre compartilhamento, revogação do consentimento e oposição. Peça pelo e-mail do encarregado; respondemos em prazo razoável. Você também pode reclamar à ANPD (gov.br/anpd).',
          ],
        },
        {
          h: '8. Menores',
          p: ['O serviço é exclusivo para maiores de 18 anos. Não coletamos dados de menores intencionalmente.'],
        },
        {
          h: '9. Segurança',
          p: [
            'Usamos conexão HTTPS e limitamos os dados ao necessário. Nenhum sistema é totalmente invulnerável; em caso de incidente relevante, comunicaremos você e a ANPD conforme a lei.',
          ],
        },
      ],
    },
    terms: {
      title: 'Termos de Serviço',
      sections: [
        {
          h: '1. Prestador',
          p: [
            `Ao usar este site você declara que leu e concorda com estes termos. Prestador: ${CONFIG.razao}, CNPJ ${CONFIG.cnpj}, ${CONFIG.street}, ${CONFIG.district}, ${CONFIG.city} - ${CONFIG.state}, ${CONFIG.email}.`,
          ],
        },
        {
          h: '2. Serviço',
          p: [
            'Massagem e serviços de estética masculina, exclusivos para maiores de 18 anos, conforme o pacote escolhido. As descrições são informativas; massagem não substitui tratamento médico e não promete resultado de saúde.',
          ],
        },
        {
          h: '3. Solicitação e confirmação',
          p: [
            'O site apenas registra uma solicitação. O horário só está garantido após a confirmação pelo WhatsApp e o pagamento do sinal. A disponibilidade mostrada pode ser demonstrativa.',
          ],
        },
        {
          h: '4. Preços e pagamento',
          p: [
            'Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. Deslocamento, acréscimo noturno e preferências aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.',
          ],
        },
        {
          h: '5. Conduta',
          p: [
            'Exige-se respeito mútuo. O terapeuta pode encerrar a sessão, sem devolução do valor dos serviços já prestados, em caso de desrespeito, assédio, uso de drogas, embriaguez evidente ou risco à segurança. Informe previamente condições de saúde, alergias e lesões.',
          ],
        },
        {
          h: '6. Lei aplicável',
          p: ['Lei brasileira, incluindo o Código de Defesa do Consumidor. Foro do domicílio do consumidor.'],
        },
      ],
    },
    refund: {
      title: 'Política de Cancelamento e Reembolso',
      sections: [
        {
          h: '1. Cancelamento pelo cliente',
          p: [
            `Com pelo menos ${CONFIG.cancelFreeHours} horas de antecedência: devolução integral do sinal via Pix ou remarcação sem custo. Com menos antecedência ou falta sem aviso: o sinal pode ser retido para cobrir o horário reservado, ou convertido em crédito, a critério do prestador.`,
          ],
        },
        {
          h: '2. Arrependimento (art. 49 do CDC)',
          p: [
            'Se a contratação for feita à distância, você pode se arrepender em até 7 dias da contratação e receber de volta o sinal, desde que a sessão ainda não tenha sido realizada. Para sessões agendadas dentro desse prazo, o direito vale até o momento da sessão.',
          ],
        },
        {
          h: '3. Cancelamento pelo prestador',
          p: [
            'Se não puder atender, o sinal é devolvido integralmente ou a sessão é remarcada, conforme sua escolha.',
          ],
        },
        {
          h: '4. Como pedir',
          p: [
            `Responda a conversa do WhatsApp ou escreva para ${CONFIG.email}. O reembolso é feito pelo mesmo meio de pagamento em até 7 dias úteis.`,
          ],
        },
        {
          h: '5. Preferências inviáveis',
          p: ['Se o pedido for considerado inviável, a taxa correspondente não é cobrada.'],
        },
      ],
    },
    cookies: {
      title: 'Cookies e armazenamento local',
      sections: [
        {
          h: 'O que este site guarda',
          p: [
            'Este site não usa cookies de publicidade nem ferramentas de análise ou rastreamento (como Google Analytics ou Meta Pixel). No armazenamento local do navegador ficam apenas: o tema escolhido, o idioma, a marcação de que você já agendou (para não repetir o desconto de primeira sessão) e, se você autorizar, nome e endereço.',
          ],
        },
        {
          h: 'Opcional, com seu consentimento',
          p: [
            '“Lembrar meus dados” salva nome, tipo de local e endereço neste aparelho para agilizar um próximo agendamento. Você pode apagar tudo em Privacidade, no rodapé, ou desmarcar a opção no próprio bilhete.',
          ],
        },
        {
          h: 'Ferramentas futuras',
          p: [
            'Se qualquer ferramenta de análise ou marketing for ativada, ela só carregará depois do seu consentimento explícito.',
          ],
        },
      ],
    },
  },
  toast: {
    copied: 'Pedido copiado.',
    copyError: 'Não foi possível copiar. Selecione o texto do bilhete.',
  },
};

type Copy = typeof PT;

/* ==========================================================================
   Textos — inglês
   ========================================================================== */

const EN: Copy = {
  code: 'en',
  nav: {
    sessions: 'Sessions',
    how: 'How it works',
    about: 'Who you meet',
    faq: 'Questions',
  },
  controls: {
    lang: 'Language',
    toDark: 'Use dark theme',
    toLight: 'Use light theme',
    close: 'Close',
    skip: 'Skip to booking',
  },
  hero: {
    title: ['Men’s massage,', 'unhurried.'],
    lead: 'Pick the length, the place and an arrival window. Four choices — we set the exact time on WhatsApp.',
    primary: 'Build my session',
    secondary: 'See sessions',
    micro: 'No account. No payment on the site. Same-day reply.',
  },
  ticket: {
    title: 'Session slip',
    ref: 'Ref.',
    steps: { time: 'Length', place: 'Place', when: 'When', who: 'Who' },
    timeLegend: 'How long would you like',
    placeLegend: 'Where you prefer',
    studio: 'At the studio',
    studioNote: 'Bela Vista · street shared in chat',
    home: 'At your place',
    homeNote: 'Travel fee',
    address: {
      cep: 'Postal code',
      street: 'Street',
      number: 'Number',
      complement: 'Complement',
      district: 'Neighborhood',
      optional: 'optional',
      loading: 'Looking up the address…',
      notFound: 'We could not find that postal code. Fill in the address manually.',
      error: 'Postal code lookup failed. Fill in the address manually.',
      hint: 'Street and neighborhood fill in from the postal code.',
    },
    whenLegend: 'When you want to arrive',
    whenHelp: 'Pick a window; the exact minute is confirmed on WhatsApp.',
    today: 'Today',
    tomorrow: 'Tomorrow',
    windows: { morning: 'Morning', afternoon: 'Afternoon', evening: 'Evening' },
    whoLegend: 'Who is coming',
    name: 'What should I call you',
    namePlaceholder: 'Your name',
    payment: 'Payment',
    pix: 'Pix',
    card: 'Card',
    cardNote: 'Installments may carry a fee, always quoted first.',
    note: 'Preferences',
    noteOptional: 'optional',
    notePlaceholder: 'E.g. more pressure on the shoulders, quiet room.',
    consent:
      'I authorize the use of these preferences — which may reveal sensitive data — only to review this request. They are not saved on this device.',
    remember: 'Remember my name and address on this device',
    rememberHint: 'You can erase it any time under Privacy.',
    required: 'required',
    summary: {
      session: 'Session',
      home: 'Travel',
      peak: 'Evening rate',
      discount: 'First session',
      total: 'Total',
      deposit: '30% deposit to confirm',
      note: 'The deposit comes off the total. The rest is paid after the session.',
    },
    cta: 'Send request on WhatsApp',
    ctaNote: 'Nothing is charged here. Confirmation and the deposit are arranged in the chat.',
    errors: {
      name: 'Tell me what to call you.',
      cep: 'Enter an 8-digit postal code.',
      street: 'Enter the street.',
      number: 'Enter the number.',
      district: 'Enter the neighborhood.',
      consent: 'Check the authorization to use your preferences.',
      summary: 'Check the highlighted fields before sending.',
    },
    sent: {
      stamp: 'Request opened',
      title: 'One step left',
      body: 'Your summary opened in WhatsApp, ready to send. If the window did not open, use the button below and tap send.',
      reopen: 'Open WhatsApp again',
      copy: 'Copy request',
      copied: 'Request copied',
      again: 'Start another request',
      note: 'The booking exists only after my confirmation and the deposit.',
    },
    bar: { cta: 'Send' },
  },
  sessions: {
    title: 'Sessions',
    lead: 'Three lengths, the same care. Prices at the studio; at your place, add the travel fee.',
    choose: 'Choose',
    popular: 'most requested',
    minutes: 'min',
  },
  how: {
    title: 'How it works',
    lead: 'From slip to session, with no calls and no account.',
    steps: [
      {
        title: 'Build the slip',
        text: 'Length, place and arrival window. Takes less than a minute.',
      },
      {
        title: 'Confirm on WhatsApp',
        text: `The summary arrives ready. I reply with the exact time and a ${CONFIG.depositPct}% deposit via Pix.`,
      },
      {
        title: 'Arrive and unwind',
        text: 'The full address comes in the chat. Free cancellation up to 12 hours before.',
      },
    ],
  },
  about: {
    title: 'Who you meet',
    p1: 'I am Thalyson, a massage therapist in São Paulo. I work with men’s massage in long sessions, with pressure adjusted to your body and a private room.',
    p2: 'I see clients at the studio in Bela Vista and, by appointment, at your address. No queue, no waiting, no noise.',
    quote: 'No queue, no waiting, no noise.',
    quoteBy: 'Thalyson, massage therapist',
    plaque: {
      label: 'Private studio',
      hoursValue: '9:00 — 22:00',
      hoursNote: 'every day, by appointment',
      address: 'Bela Vista · São Paulo',
      age: '18+ only',
    },
    points: [
      'One client at a time, discreetly',
      'Pressure agreed before we start',
      'Towels, oils and a shower at the studio',
      'Full address only after confirmation',
    ],
  },
  faq: {
    title: 'Questions',
    items: [
      {
        q: 'Do I pay now?',
        a: `No. Building the request is free. A ${CONFIG.depositPct}% deposit confirms the booking and comes off the total; the rest is paid after the session.`,
      },
      {
        q: 'How does the arrival window work?',
        a: 'You pick morning, afternoon or evening. I confirm the exact minute on WhatsApp, accounting for travel to the studio or your address.',
      },
      {
        q: 'Is the studio address public?',
        a: 'The neighborhood is. The street and number come in the chat after confirmation, to keep things discreet.',
      },
      {
        q: 'Can I reschedule or cancel?',
        a: 'Yes. Up to 12 hours before, the deposit is fully refunded or turned into credit. Closer to the time, the cancellation policy applies.',
      },
      {
        q: 'Do you come to my place?',
        a: 'Yes, with a R$ 60 travel fee. Sessions between 6 and 10 pm carry a R$ 30 evening rate, at the studio or at your place. The address is confirmed in the chat.',
      },
      {
        q: 'How do I pay?',
        a: 'Pix or card. Installments may carry a fee, always quoted before payment.',
      },
      {
        q: 'It is my first session. Anything different?',
        a: `Your first session is ${CONFIG.discountPct}% off, already applied on the slip. If you want more time, start with the 90-minute session.`,
      },
    ],
  },
  footer: {
    tagline: 'Men’s massage by appointment, in Bela Vista and at your address.',
    studio: 'Studio',
    contact: 'Contact',
    legal: 'Legal',
    privacy: 'Privacy and data',
    age: 'Content and service intended for adults 18 and over.',
    rights: 'All rights reserved.',
    cnpj: 'CNPJ',
    docs: {
      privacy: 'Privacy',
      terms: 'Terms',
      refund: 'Cancellation',
      cookies: 'Cookies',
    },
  },
  privacyPanel: {
    title: 'Privacy and data',
    intro:
      'This site uses no advertising, analytics or tracking cookies. We only keep what you choose to keep.',
    rememberLabel: 'Remember my name and address',
    rememberHint: 'Saved in this browser only.',
    erase: 'Erase my data',
    eraseConfirm: 'Confirm erase',
    eraseHint: 'Removes name, address and the first-session flag from this device.',
    erased: 'Data erased from this device.',
    keepTheme: 'Theme and language remain saved as preferences.',
    docsLabel: 'Documents',
  },
  legal: {
    updated: 'Last updated',
    privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          h: '1. Controller',
          p: [
            `This policy follows Brazil’s General Data Protection Law (Law 13.709/2018, LGPD). Controller: ${CONFIG.razao}, CNPJ ${CONFIG.cnpj}, ${CONFIG.street}, ${CONFIG.district}, ${CONFIG.city} - ${CONFIG.state}. Contact: ${CONFIG.email}. Data protection officer (DPO): ${CONFIG.dpo}, ${CONFIG.dpoEmail}.`,
          ],
        },
        {
          h: '2. What we collect and why',
          p: [
            'Name (what you want to be called), date, time window, package and payment method: to prepare and perform the booking (Art. 7, V, performance of contract). Address (street, number, complement, neighborhood and postal code): only if you choose service at your address, for travel.',
            'We do not ask for CPF, email, phone or date of birth in the form. Your number appears only in the WhatsApp conversation you start yourself.',
          ],
        },
        {
          h: '3. Sensitive data (sexual life)',
          p: [
            'The optional preferences field may reveal data about sexual life, which is sensitive data (Art. 5, II). We only process it if you check the consent box beside the field, and only to review the request. It is not saved on this device or stored in a database. You may withdraw consent at any time by asking for the conversation to be deleted.',
          ],
        },
        {
          h: '4. Who we share data with',
          p: [
            'WhatsApp (Meta Platforms), where you send your request yourself. ViaCEP, which receives the postal code you type in order to fill the address. If a scheduling system is active, the database provider hosting it. We do not sell data.',
          ],
        },
        {
          h: '5. Storage on your device',
          p: [
            'Your data is only saved on the device if you check “Remember my data”. In that case we keep name, place type and address in the browser’s local storage. You can erase everything under Privacy in the footer.',
          ],
        },
        {
          h: '6. Retention',
          p: [
            'WhatsApp conversations and booking records are kept for as long as needed for the session, financial settlement and legal obligations, then deleted. Tax records follow the periods set by law.',
          ],
        },
        {
          h: '7. Your rights (Art. 18)',
          p: [
            'Confirmation of processing, access, correction, anonymization or deletion, portability, information about sharing, withdrawal of consent and objection. Ask via the DPO email; we reply within a reasonable period. You may also complain to the ANPD (gov.br/anpd).',
          ],
        },
        {
          h: '8. Minors',
          p: ['The service is for adults 18 and over only. We do not intentionally collect data from minors.'],
        },
        {
          h: '9. Security',
          p: [
            'We use HTTPS and limit data to what is necessary. No system is entirely invulnerable; in the event of a relevant incident, we will notify you and the ANPD as required by law.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms of Service',
      sections: [
        {
          h: '1. Provider',
          p: [
            `By using this site you state that you have read and agree to these terms. Provider: ${CONFIG.razao}, CNPJ ${CONFIG.cnpj}, ${CONFIG.street}, ${CONFIG.district}, ${CONFIG.city} - ${CONFIG.state}, ${CONFIG.email}.`,
          ],
        },
        {
          h: '2. Service',
          p: [
            'Men’s massage and bodywork, for adults 18 and over only, according to the chosen package. Descriptions are informative; massage does not replace medical treatment and does not promise health outcomes.',
          ],
        },
        {
          h: '3. Request and confirmation',
          p: [
            'The site only records a request. The time is guaranteed only after confirmation on WhatsApp and payment of the deposit. Availability shown may be demonstrative.',
          ],
        },
        {
          h: '4. Prices and payment',
          p: [
            'Prices are shown in Brazilian reais. The deposit confirms the booking and comes off the total; the rest is paid after the session. Travel, evening rate and preferences appear in the summary before sending. Card installments may carry fees, quoted before payment.',
          ],
        },
        {
          h: '5. Conduct',
          p: [
            'Mutual respect is required. The therapist may end the session, without refund for services already performed, in case of disrespect, harassment, drug use, evident intoxication or risk to safety. Please disclose health conditions, allergies and injuries in advance.',
          ],
        },
        {
          h: '6. Governing law',
          p: ['Brazilian law, including the Consumer Protection Code. Venue: the consumer’s domicile.'],
        },
      ],
    },
    refund: {
      title: 'Cancellation and Refund Policy',
      sections: [
        {
          h: '1. Cancellation by the client',
          p: [
            `At least ${CONFIG.cancelFreeHours} hours in advance: full refund of the deposit via Pix or free rescheduling. With less notice or a no-show: the deposit may be retained to cover the reserved time, or converted into credit, at the provider’s discretion.`,
          ],
        },
        {
          h: '2. Right of withdrawal (Art. 49, CDC)',
          p: [
            'If the contract is made remotely, you may withdraw within 7 days of contracting and receive the deposit back, provided the session has not yet taken place. For sessions scheduled within that period, the right applies until the session begins.',
          ],
        },
        {
          h: '3. Cancellation by the provider',
          p: ['If I cannot attend, the deposit is fully refunded or the session rescheduled, as you choose.'],
        },
        {
          h: '4. How to request',
          p: [
            `Reply to the WhatsApp conversation or write to ${CONFIG.email}. Refunds are made via the same payment method within 7 business days.`,
          ],
        },
        {
          h: '5. Preferences we cannot accommodate',
          p: ['If the request cannot be accommodated, the corresponding fee is not charged.'],
        },
      ],
    },
    cookies: {
      title: 'Cookies and local storage',
      sections: [
        {
          h: 'What this site keeps',
          p: [
            'This site uses no advertising cookies and no analytics or tracking tools (such as Google Analytics or Meta Pixel). Browser local storage holds only: your chosen theme, language, a flag that you have booked before (so the first-session discount is not repeated) and, if you allow it, name and address.',
          ],
        },
        {
          h: 'Optional, with your consent',
          p: [
            '“Remember my data” saves name, place type and address on this device to speed up a future booking. You can erase everything under Privacy in the footer, or uncheck the option on the slip itself.',
          ],
        },
        {
          h: 'Future tools',
          p: ['If any analytics or marketing tool is enabled, it will only load after your explicit consent.'],
        },
      ],
    },
  },
  toast: {
    copied: 'Request copied.',
    copyError: 'Could not copy. Select the slip text manually.',
  },
};

/* ==========================================================================
   Ícones
   ========================================================================== */

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/* ==========================================================================
   Moldura de diálogo
   ========================================================================== */

function Sheet({
  open,
  label,
  onClose,
  children,
  narrow = false,
}: {
  open: boolean;
  label: string;
  onClose: () => void;
  children: ReactNode;
  narrow?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={narrow ? 'rx-dialog rx-dialog--narrow' : 'rx-dialog'}
      aria-label={label}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className="rx-dialog__card">
        <div className="rx-dialog__cardhead">
          <span className="rx-dialog__rule" aria-hidden="true" />
          <button type="button" className="rx-iconbtn" onClick={onClose} aria-label={label}>
            <CloseIcon />
          </button>
        </div>
        <div className="rx-dialog__body">{children}</div>
      </div>
    </dialog>
  );
}

/* ==========================================================================
   Bilhete de agendamento
   ========================================================================== */

type TicketProps = {
  t: Copy;
  lang: Lang;
  profile: StoredProfile | null;
  remember: boolean;
  onRemember: (value: boolean) => void;
  onProfile: (value: StoredProfile | null) => void;
  eligible: boolean;
  pkgId: PackageId;
  onPkg: (id: PackageId) => void;
  onBooked: () => void;
  onToast: (message: string) => void;
};

function Ticket({
  t,
  lang,
  profile,
  remember,
  onRemember,
  onProfile,
  eligible,
  pkgId,
  onPkg,
  onBooked,
  onToast,
}: TicketProps) {
  const c = t.ticket;
  const [days] = useState(() => buildDays(CONFIG.daysAhead));
  const [place, setPlace] = useState<Place>(profile?.place ?? 'studio');
  const [dayIndex, setDayIndex] = useState(() => firstOpenDay(days));
  const [win, setWin] = useState<WindowId>(() => {
    const day = days[firstOpenDay(days)];
    return windowsFor(day.date)[0] ?? 'afternoon';
  });
  const [name, setName] = useState(profile?.name ?? '');
  const [payment, setPayment] = useState<Payment>('pix');
  const [note, setNote] = useState('');
  const [noteConsent, setNoteConsent] = useState(false);
  const [cep, setCep] = useState(profile?.cep ?? '');
  const [street, setStreet] = useState(profile?.street ?? '');
  const [number, setNumber] = useState(profile?.number ?? '');
  const [complement, setComplement] = useState(profile?.complement ?? '');
  const [district, setDistrict] = useState(profile?.district ?? '');
  const [errors, setErrors] = useState<Errors>({});
  const [cepState, setCepState] = useState<'idle' | 'loading' | 'notfound' | 'error'>('idle');
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [frozen, setFrozen] = useState<{
    base: number;
    home: number;
    peak: number;
    discount: number;
    total: number;
    deposit: number;
  } | null>(null);
  const [refId] = useState(makeRef);
  const [barVisible, setBarVisible] = useState(false);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  const pkg = CONFIG.packages.find((item) => item.id === pkgId) ?? CONFIG.packages[0];
  const day = days[dayIndex];
  const openWindows = windowsFor(day.date);

  const base = pkg.price;
  const home = place === 'home' ? CONFIG.homeFee : 0;
  const peak = win === 'evening' ? CONFIG.peakFee : 0;
  const discount = eligible ? Math.round((base * CONFIG.discountPct) / 100) : 0;
  const total = base + home + peak - discount;
  const deposit = Math.round((total * CONFIG.depositPct) / 100);
  const placeLabel = place === 'studio' ? c.studio : c.home;
  const addressLine = [street, number, complement, district, cep].filter(Boolean).join(', ');
  const quote = frozen ?? { base, home, peak, discount, total, deposit };

  const waMessage = useMemo(() => {
    const lines = [
      `*${c.title} — ${CONFIG.brand}*`,
      `${c.ref} ${refId}`,
      '',
      `${c.steps.time}: ${pkg.name[lang]} · ${pkg.minutes} min`,
      `${c.steps.place}: ${placeLabel}${place === 'home' ? ` — ${addressLine}` : ''}`,
      `${c.steps.when}: ${longDay(day.date, lang)} · ${c.windows[win]} (${windowRange(win, lang)})`,
      `${c.steps.who}: ${name.trim()}`,
      `${c.payment}: ${payment === 'pix' ? c.pix : c.card}`,
    ];
    if (note.trim()) lines.push(`${c.note}: ${note.trim()}`);
    if (quote.home > 0) lines.push(`${c.summary.home}: ${money(quote.home, lang)}`);
    if (quote.peak > 0) lines.push(`${c.summary.peak}: ${money(quote.peak, lang)}`);
    if (quote.discount > 0) {
      lines.push(`${c.summary.discount} (−${CONFIG.discountPct}%): −${money(quote.discount, lang)}`);
    }
    lines.push(
      '',
      `${c.summary.total}: ${money(quote.total, lang)}`,
      `${c.summary.deposit.replace('30%', `${CONFIG.depositPct}%`)}: ${money(quote.deposit, lang)}`,
    );
    return lines.join('\n');
  }, [
    addressLine,
    c,
    day.date,
    lang,
    name,
    note,
    payment,
    pkg,
    place,
    placeLabel,
    quote.deposit,
    quote.discount,
    quote.home,
    quote.peak,
    quote.total,
    refId,
    win,
  ]);

  const waHref = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  useEffect(() => {
    const digits = cep.replace(/\D/g, '');
    if (place !== 'home' || digits.length !== 8) {
      setCepState('idle');
      return;
    }
    const controller = new AbortController();
    setCepState('loading');
    fetch(`https://viacep.com.br/ws/${digits}/json/`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('http');
        return response.json() as Promise<{ erro?: boolean; logradouro?: string; bairro?: string }>;
      })
      .then((data) => {
        if (data.erro) {
          setCepState('notfound');
          return;
        }
        setStreet(data.logradouro ?? '');
        setDistrict(data.bairro ?? '');
        setCepState('idle');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setCepState('error');
      });
    return () => controller.abort();
  }, [cep, place]);

  useEffect(() => {
    const target = ctaRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => setBarVisible(!entry.isIntersecting), {
      rootMargin: '-12px 0px 0px 0px',
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [sent]);

  function clearError(key: keyof Errors) {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  function validate(): Errors {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = c.errors.name;
    if (place === 'home') {
      if (cep.replace(/\D/g, '').length !== 8) next.cep = c.errors.cep;
      if (street.trim().length < 3) next.street = c.errors.street;
      if (!number.trim()) next.number = c.errors.number;
      if (district.trim().length < 2) next.district = c.errors.district;
    }
    if (note.trim() && !noteConsent) next.consent = c.errors.consent;
    return next;
  }

  function handleSend(event: MouseEvent<HTMLAnchorElement>) {
    const next = validate();
    if (Object.keys(next).length > 0) {
      event.preventDefault();
      setErrors(next);
      const order: (keyof Errors)[] = ['name', 'cep', 'street', 'number', 'district', 'consent'];
      const first = order.find((key) => next[key]);
      requestAnimationFrame(() => {
        if (!first) return;
        const field = document.getElementById(`rx-${first}`);
        field?.focus({ preventScroll: true });
        field?.scrollIntoView({
          block: 'center',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      });
      return;
    }
    setErrors({});
    if (remember) {
      onProfile({ name: name.trim(), place, cep, street, number, complement, district });
    } else {
      onProfile(null);
    }
    setFrozen({ base, home, peak, discount, total, deposit });
    onBooked();
    setSent(true);
  }

  async function copyRequest() {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      onToast(c.sent.copied);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      onToast(t.toast.copyError);
    }
  }

  function pickDay(index: number) {
    setDayIndex(index);
    const available = windowsFor(days[index].date);
    if (!available.includes(win)) setWin(available[0] ?? 'afternoon');
  }

  function pickWin(id: WindowId) {
    setWin(id);
  }

  const depositLabel = c.summary.deposit.replace('30%', `${CONFIG.depositPct}%`);

  return (
    <>
      <div className="rx-ticket" aria-labelledby="rx-ticket-title">
      <div className="rx-ticket__head">
        <h2 id="rx-ticket-title" className="rx-ticket__title">
          {c.title}
        </h2>
        <span className="rx-ticket__ref">
          {c.ref} {refId}
        </span>
      </div>

      {sent ? (
        <div className="rx-sent">
          <span className="rx-stamp">{c.sent.stamp}</span>
          <h3 className="rx-sent__title">{c.sent.title}</h3>
          <p className="rx-sent__body">{c.sent.body}</p>
          <div className="rx-sent__actions">
            <a
              className="rx-btn rx-btn--primary"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              {c.sent.reopen}
            </a>
            <button type="button" className="rx-btn rx-btn--ghost" onClick={copyRequest}>
              {copied ? c.sent.copied : c.sent.copy}
            </button>
          </div>
          <button
            type="button"
            className="rx-linkbtn"
            onClick={() => {
              setSent(false);
              setFrozen(null);
            }}
          >
            {c.sent.again}
          </button>
          <p className="rx-fineprint">{c.sent.note}</p>
        </div>
      ) : (
        <div className="rx-form">
          <fieldset className="rx-step">
            <legend className="rx-step__legend">
              <span className="rx-num" aria-hidden="true">
                1
              </span>
              <span className="rx-step__name">{c.steps.time}</span>
              <span className="rx-step__val">{pkg.minutes} min</span>
            </legend>
            <div className="rx-options rx-options--packages">
              {CONFIG.packages.map((item) => (
                <label key={item.id} className="rx-opt rx-opt--row rx-opt--package">
                  <input
                    type="radio"
                    name="rx-package"
                    value={item.id}
                    checked={pkgId === item.id}
                    onChange={() => onPkg(item.id)}
                  />
                  <span className="rx-opt__body">
                    <span className="rx-opt__main">
                      <span className="rx-opt__title">{item.name[lang]}</span>
                      <span className="rx-opt__note">{item.minutes} min</span>
                    </span>
                    <span className="rx-opt__price">{money(item.price, lang)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="rx-step">
            <legend className="rx-step__legend">
              <span className="rx-num" aria-hidden="true">
                2
              </span>
              <span className="rx-step__name">{c.steps.place}</span>
              <span className="rx-step__val">{place === 'studio' ? c.studio : c.home}</span>
            </legend>
            <div className="rx-options rx-options--two">
              <label className="rx-opt rx-opt--place">
                <input
                  type="radio"
                  name="rx-place"
                  value="studio"
                  checked={place === 'studio'}
                  onChange={() => setPlace('studio')}
                />
                <span className="rx-opt__body">
                  <span className="rx-opt__title">{c.studio}</span>
                  <span className="rx-opt__note">{c.studioNote}</span>
                </span>
              </label>
              <label className="rx-opt rx-opt--place">
                <input
                  type="radio"
                  name="rx-place"
                  value="home"
                  checked={place === 'home'}
                  onChange={() => setPlace('home')}
                />
                <span className="rx-opt__body">
                  <span className="rx-opt__title">{c.home}</span>
                  <span className="rx-opt__note">
                    {c.homeNote} · +{money(CONFIG.homeFee, lang)}
                  </span>
                </span>
              </label>
            </div>

            {place === 'home' && (
              <div className="rx-addr">
                <div className="rx-field rx-field--cep">
                  <label className="rx-label" htmlFor="rx-cep">
                    {c.address.cep}
                  </label>
                  <input
                    id="rx-cep"
                    className={errors.cep ? 'rx-input rx-input--error' : 'rx-input'}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="00000-000"
                    value={cep}
                    aria-invalid={Boolean(errors.cep)}
                    aria-describedby={errors.cep ? 'rx-cep-err' : 'rx-cep-hint'}
                    onChange={(event) => {
                      setCep(maskCep(event.target.value));
                      clearError('cep');
                    }}
                  />
                  {errors.cep ? (
                    <p className="rx-err" id="rx-cep-err">
                      {errors.cep}
                    </p>
                  ) : (
                    <p className="rx-hint" id="rx-cep-hint" role="status">
                      {cepState === 'loading'
                        ? c.address.loading
                        : cepState === 'notfound'
                          ? c.address.notFound
                          : cepState === 'error'
                            ? c.address.error
                            : c.address.hint}
                    </p>
                  )}
                </div>
                <div className="rx-field rx-field--street">
                  <label className="rx-label" htmlFor="rx-street">
                    {c.address.street}
                  </label>
                  <input
                    id="rx-street"
                    className={errors.street ? 'rx-input rx-input--error' : 'rx-input'}
                    autoComplete="address-line1"
                    value={street}
                    aria-invalid={Boolean(errors.street)}
                    aria-describedby={errors.street ? 'rx-street-err' : undefined}
                    onChange={(event) => {
                      setStreet(event.target.value);
                      clearError('street');
                    }}
                  />
                  {errors.street && (
                    <p className="rx-err" id="rx-street-err">
                      {errors.street}
                    </p>
                  )}
                </div>
                <div className="rx-field">
                  <label className="rx-label" htmlFor="rx-number">
                    {c.address.number}
                  </label>
                  <input
                    id="rx-number"
                    className={errors.number ? 'rx-input rx-input--error' : 'rx-input'}
                    inputMode="numeric"
                    autoComplete="address-line2"
                    value={number}
                    aria-invalid={Boolean(errors.number)}
                    aria-describedby={errors.number ? 'rx-number-err' : undefined}
                    onChange={(event) => {
                      setNumber(event.target.value);
                      clearError('number');
                    }}
                  />
                  {errors.number && (
                    <p className="rx-err" id="rx-number-err">
                      {errors.number}
                    </p>
                  )}
                </div>
                <div className="rx-field">
                  <label className="rx-label" htmlFor="rx-complement">
                    {c.address.complement}{' '}
                    <span className="rx-optional">{c.address.optional}</span>
                  </label>
                  <input
                    id="rx-complement"
                    className="rx-input"
                    value={complement}
                    onChange={(event) => setComplement(event.target.value)}
                  />
                </div>
                <div className="rx-field">
                  <label className="rx-label" htmlFor="rx-district">
                    {c.address.district}
                  </label>
                  <input
                    id="rx-district"
                    className={errors.district ? 'rx-input rx-input--error' : 'rx-input'}
                    autoComplete="address-line3"
                    value={district}
                    aria-invalid={Boolean(errors.district)}
                    aria-describedby={errors.district ? 'rx-district-err' : undefined}
                    onChange={(event) => {
                      setDistrict(event.target.value);
                      clearError('district');
                    }}
                  />
                  {errors.district && (
                    <p className="rx-err" id="rx-district-err">
                      {errors.district}
                    </p>
                  )}
                </div>
              </div>
            )}
          </fieldset>

          <fieldset className="rx-step">
            <legend className="rx-step__legend">
              <span className="rx-num" aria-hidden="true">
                3
              </span>
              <span className="rx-step__name">{c.steps.when}</span>
              <span className="rx-step__val">{longDay(day.date, lang)}</span>
            </legend>
            <p className="rx-step__help">{c.whenHelp}</p>
            <p className="rx-month">{monthLabel(day.date, lang)}</p>
            <div className="rx-days" role="group" aria-label={c.whenLegend}>
              {days.map((item, index) => {
                const disabled = windowsFor(item.date).length === 0;
                const label =
                  index === 0 ? c.today : index === 1 ? c.tomorrow : shortWeekday(item.date, lang);
                return (
                  <button
                    key={item.offset}
                    type="button"
                    className="rx-day"
                    aria-pressed={dayIndex === index}
                    disabled={disabled}
                    onClick={() => pickDay(index)}
                  >
                    <span className="rx-day__dow">{label}</span>
                    <span className="rx-day__num">{item.date.getDate()}</span>
                  </button>
                );
              })}
            </div>
            <div className="rx-windows">
              {WINDOWS.map((item) => {
                const disabled = !openWindows.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className={disabled ? 'rx-win rx-win--disabled' : 'rx-win'}
                  >
                    <input
                      type="radio"
                      name="rx-window"
                      value={item.id}
                      checked={win === item.id}
                      disabled={disabled}
                      onChange={() => pickWin(item.id)}
                    />
                    <span className="rx-win__body">
                      <span className="rx-win__name">{c.windows[item.id]}</span>
                      <span className="rx-win__range">{windowRange(item.id, lang)}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="rx-step">
            <legend className="rx-step__legend">
              <span className="rx-num" aria-hidden="true">
                4
              </span>
              <span className="rx-step__name">{c.steps.who}</span>
            </legend>
            <div className="rx-field">
              <label className="rx-label" htmlFor="rx-name">
                {c.name} <span className="rx-req">*</span>
              </label>
              <input
                id="rx-name"
                className={errors.name ? 'rx-input rx-input--error' : 'rx-input'}
                autoComplete="given-name"
                placeholder={c.namePlaceholder}
                value={name}
                aria-required="true"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'rx-name-err' : undefined}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError('name');
                }}
              />
              {errors.name && (
                <p className="rx-err" id="rx-name-err">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="rx-field">
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
              </div>
              <p className="rx-hint">{c.cardNote}</p>
            </div>

            <div className="rx-field">
              <label className="rx-label" htmlFor="rx-note">
                {c.note} <span className="rx-optional">{c.noteOptional}</span>
              </label>
              <textarea
                id="rx-note"
                className="rx-input rx-input--area"
                rows={2}
                placeholder={c.notePlaceholder}
                value={note}
                onChange={(event) => {
                  setNote(event.target.value);
                  if (!event.target.value.trim()) clearError('consent');
                }}
              />
            </div>

            {note.trim().length > 0 && (
              <div className="rx-consent">
                <label className="rx-check">
                  <input
                    id="rx-consent"
                    type="checkbox"
                    checked={noteConsent}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'rx-consent-err' : undefined}
                    onChange={(event) => {
                      setNoteConsent(event.target.checked);
                      clearError('consent');
                    }}
                  />
                  <span>{c.consent}</span>
                </label>
                {errors.consent && (
                  <p className="rx-err" id="rx-consent-err">
                    {errors.consent}
                  </p>
                )}
              </div>
            )}

            <label className="rx-check rx-check--saved">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => {
                  onRemember(event.target.checked);
                  if (!event.target.checked) onProfile(null);
                }}
              />
              <span>
                {c.remember}
                <span className="rx-check__hint">{c.rememberHint}</span>
              </span>
            </label>
          </fieldset>

          {Object.keys(errors).length > 0 && (
            <p className="rx-err rx-err--summary" role="alert">
              {c.errors.summary}
            </p>
          )}
        </div>
      )}

      <div className="rx-perf" aria-hidden="true">
        <span className="rx-perf__cut rx-perf__cut--left" />
        <span className="rx-perf__cut rx-perf__cut--right" />
      </div>        <div className="rx-ledger">
        <div className="rx-ledger__row">
          <span>
            {c.summary.session} · {pkg.name[lang]} ({pkg.minutes} min)
          </span>
          <span className="rx-leader" aria-hidden="true" />
          <span>{money(quote.base, lang)}</span>
        </div>
        {quote.home > 0 && (
          <div className="rx-ledger__row">
            <span>{c.summary.home}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>{money(quote.home, lang)}</span>
          </div>
        )}
        {quote.peak > 0 && (
          <div className="rx-ledger__row">
            <span>{c.summary.peak}</span>
            <span className="rx-leader" aria-hidden="true" />
            <span>{money(quote.peak, lang)}</span>
          </div>
        )}
        {quote.discount > 0 && (
          <div className="rx-ledger__row rx-ledger__row--discount">
            <span>
              {c.summary.discount} (−{CONFIG.discountPct}%)
            </span>
            <span className="rx-leader" aria-hidden="true" />
            <span>−{money(quote.discount, lang)}</span>
          </div>
        )}
        <div className="rx-ledger__row rx-ledger__row--total">
          <span>{c.summary.total}</span>
          <span className="rx-leader" aria-hidden="true" />
          <span className="rx-total" aria-live="polite">
            {money(quote.total, lang)}
          </span>
        </div>
        <p className="rx-deposit">
          {depositLabel}: <strong>{money(quote.deposit, lang)}</strong>
          <br />
          {c.summary.note}
        </p>
      </div>

      {!sent && (
        <div className="rx-ticket__foot">
          <a
            ref={ctaRef}
            className="rx-btn rx-btn--primary rx-btn--wide"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleSend}
            aria-describedby="rx-cta-note"
          >
            {c.cta}
          </a>
          <p className="rx-fineprint" id="rx-cta-note">
            {c.ctaNote}
          </p>
        </div>
      )}

      </div>

      {!sent && barVisible && (
        <div className="rx-mobilebar">
          <div className="rx-mobilebar__total">
            <span>{c.summary.total}</span>
            <strong>{money(quote.total, lang)}</strong>
          </div>
          <a
            className="rx-btn rx-btn--primary rx-btn--bar"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={c.cta}
            onClick={handleSend}
          >
            {c.bar.cta}
          </a>
        </div>
      )}
    </>
  );
}

/* ==========================================================================
   Cabeçalho
   ========================================================================== */

function TopBar({
  t,
  lang,
  onLang,
  theme,
  onTheme,
}: {
  t: Copy;
  lang: Lang;
  onLang: (lang: Lang) => void;
  theme: Theme;
  onTheme: () => void;
}) {
  return (
    <header className="rx-top">
      <div className="rx-wrap rx-top__inner">
        <a className="rx-brand" href="#top">
          {CONFIG.brand}
        </a>
        <nav className="rx-nav">
          <a href="#sessoes">{t.nav.sessions}</a>
          <a href="#como">{t.nav.how}</a>
          <a href="#sobre">{t.nav.about}</a>
          <a href="#perguntas">{t.nav.faq}</a>
        </nav>
        <div className="rx-controls">
          <div className="rx-seg" role="group" aria-label={t.controls.lang}>
            {(['pt', 'en'] as Lang[]).map((code) => (
              <button
                key={code}
                type="button"
                className="rx-seg__btn"
                aria-pressed={lang === code}
                onClick={() => onLang(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="rx-iconbtn"
            onClick={onTheme}
            aria-label={theme === 'dark' ? t.controls.toLight : t.controls.toDark}
            title={theme === 'dark' ? t.controls.toLight : t.controls.toDark}
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>
    </header>
  );
}

/* ==========================================================================
   Seções
   ========================================================================== */

function Hero({
  t,
  onStart,
  children,
}: {
  t: Copy;
  onStart: () => void;
  children: ReactNode;
}) {
  return (
    <section className="rx-hero" id="top">
      <div className="rx-wrap rx-hero__grid">
        <div className="rx-hero__copy">
          <h1 className="rx-h1">
            {t.hero.title[0]}
            <br />
            {t.hero.title[1]}
          </h1>
          <p className="rx-lead">{t.hero.lead}</p>
          <div className="rx-actions">
            <button type="button" className="rx-btn rx-btn--primary" onClick={onStart}>
              {t.hero.primary}
            </button>
            <a className="rx-btn rx-btn--ghost" href="#sessoes">
              {t.hero.secondary}
            </a>
          </div>
          <p className="rx-micro">{t.hero.micro}</p>
          <div className="rx-hero__bottom">
            <div className="rx-plaque">
              <p className="rx-plaque__label">{t.about.plaque.label}</p>
              <p className="rx-plaque__hours">{t.about.plaque.hoursValue}</p>
              <p className="rx-plaque__note">{t.about.plaque.hoursNote}</p>
              <div className="rx-plaque__foot">
                <span>{t.about.plaque.address}</span>
                <span>{t.about.plaque.age}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="rx-book" id="agendar" tabIndex={-1}>
          {children}
        </div>
      </div>
    </section>
  );
}

function Sessions({
  t,
  lang,
  onChoose,
}: {
  t: Copy;
  lang: Lang;
  onChoose: (id: PackageId) => void;
}) {
  return (
    <section className="rx-section" id="sessoes">
      <div className="rx-wrap">
        <div className="rx-section__head">
          <h2 className="rx-h2">{t.sessions.title}</h2>
          <p className="rx-section__lead">{t.sessions.lead}</p>
        </div>
        <div className="rx-sessions">
          {CONFIG.packages.map((item) => (
            <article className="rx-session" key={item.id}>
              <div className="rx-session__main">
                <h3 className="rx-session__name">
                  {item.name[lang]}
                  {item.popular && <span className="rx-popular">{t.sessions.popular}</span>}
                </h3>
                <p className="rx-session__blurb">{item.blurb[lang]}</p>
              </div>
              <div className="rx-session__meta">
                <span className="rx-session__min">
                  {item.minutes} {t.sessions.minutes}
                </span>
                <span className="rx-session__price">{money(item.price, lang)}</span>
              </div>
              <button
                type="button"
                className="rx-btn rx-btn--ghost rx-btn--small"
                aria-label={`${t.sessions.choose}: ${item.name[lang]}`}
                onClick={() => onChoose(item.id)}
              >
                {t.sessions.choose}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function How({ t }: { t: Copy }) {
  return (
    <section className="rx-section rx-section--rule" id="como">
      <div className="rx-wrap">
        <div className="rx-section__head">
          <h2 className="rx-h2">{t.how.title}</h2>
          <p className="rx-section__lead">{t.how.lead}</p>
        </div>
        <ol className="rx-how">
          {t.how.steps.map((step, index) => (
            <li className="rx-how__step" key={step.title}>
              <span className="rx-how__num">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function About({ t }: { t: Copy }) {
  return (
    <section className="rx-section rx-section--rule" id="sobre">
      <div className="rx-wrap rx-about">
        <div className="rx-about__text">
          <h2 className="rx-h2">{t.about.title}</h2>
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <ul className="rx-points">
            {t.about.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </div>
        <figure className="rx-about__quote">
          <blockquote>{t.about.quote}</blockquote>
          <figcaption>{t.about.quoteBy}</figcaption>
        </figure>
      </div>
    </section>
  );
}

function Faq({ t }: { t: Copy }) {
  return (
    <section className="rx-section rx-section--rule" id="perguntas">
      <div className="rx-wrap rx-faq">
        <h2 className="rx-h2">{t.faq.title}</h2>
        <div className="rx-faq__list">
          {t.faq.items.map((item) => (
            <details className="rx-faq__item" key={item.q}>
              <summary>
                <span>{item.q}</span>
                <PlusIcon />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({
  t,
  onDoc,
  onPrivacy,
}: {
  t: Copy;
  onDoc: (doc: DocId) => void;
  onPrivacy: () => void;
}) {
  const docs: DocId[] = ['privacy', 'terms', 'refund', 'cookies'];
  return (
    <footer className="rx-foot">
      <div className="rx-wrap">
        <div className="rx-foot__grid">
          <div className="rx-foot__brandcol">
            <p className="rx-foot__brand">{CONFIG.brand}</p>
            <p className="rx-foot__tagline">{t.footer.tagline}</p>
            <button type="button" className="rx-linkbtn" onClick={onPrivacy}>
              {t.footer.privacy}
            </button>
          </div>
          <div>
            <h3>{t.footer.studio}</h3>
            <p>
              {CONFIG.street}
              <br />
              {CONFIG.district}, {CONFIG.city} — {CONFIG.state}
            </p>
            <p>
              {t.about.plaque.hoursValue}
              <br />
              {t.about.plaque.hoursNote}
            </p>
          </div>
          <div>
            <h3>{t.footer.contact}</h3>
            <a href={`mailto:${CONFIG.email}`}>{CONFIG.email}</a>
            <p className="rx-foot__cnpj">
              {t.footer.cnpj} {CONFIG.cnpj}
            </p>
          </div>
          <div>
            <h3>{t.footer.legal}</h3>
            <ul className="rx-legal-links">
              {docs.map((id) => (
                <li key={id}>
                  <button type="button" className="rx-linkbtn" onClick={() => onDoc(id)}>
                    {t.footer.docs[id]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="rx-foot__bottom">
          <p>
            © {new Date().getFullYear()} {CONFIG.brand}. {t.footer.rights}
          </p>
          <p>{t.footer.age}</p>
        </div>
      </div>
    </footer>
  );
}

/* ==========================================================================
   Documentos e privacidade
   ========================================================================== */

function LegalSheet({
  doc,
  t,
  lang,
  onClose,
}: {
  doc: DocId | null;
  t: Copy;
  lang: Lang;
  onClose: () => void;
}) {
  const data = doc ? t.legal[doc] : null;
  return (
    <Sheet open={Boolean(doc)} label={data ? data.title : t.controls.close} onClose={onClose}>
      {data && (
        <article className="rx-doc">
          <h2>{data.title}</h2>
          <p className="rx-doc__updated">
            {t.legal.updated}: {UPDATED[lang]}
          </p>
          {data.sections.map((section) => (
            <section key={section.h}>
              <h3>{section.h}</h3>
              {section.p.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      )}
    </Sheet>
  );
}

function PrivacySheet({
  open,
  t,
  remember,
  onRemember,
  onErase,
  onDoc,
  onClose,
}: {
  open: boolean;
  t: Copy;
  remember: boolean;
  onRemember: (value: boolean) => void;
  onErase: () => void;
  onDoc: (doc: DocId) => void;
  onClose: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const docs: DocId[] = ['privacy', 'terms', 'refund', 'cookies'];

  useEffect(() => {
    if (open) setConfirming(false);
  }, [open]);

  return (
    <Sheet open={open} label={t.privacyPanel.title} onClose={onClose} narrow>
      <div className="rx-doc">
        <h2>{t.privacyPanel.title}</h2>
        <p>{t.privacyPanel.intro}</p>
        <label className="rx-check rx-check--panel">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => onRemember(event.target.checked)}
          />
          <span>
            {t.privacyPanel.rememberLabel}
            <span className="rx-check__hint">{t.privacyPanel.rememberHint}</span>
          </span>
        </label>
        <p className="rx-hint">{t.privacyPanel.keepTheme}</p>
        <div className="rx-erase">
          <button
            type="button"
            className={confirming ? 'rx-btn rx-btn--danger' : 'rx-btn rx-btn--ghost'}
            onClick={() => {
              if (confirming) {
                onErase();
                setConfirming(false);
              } else {
                setConfirming(true);
              }
            }}
          >
            {confirming ? t.privacyPanel.eraseConfirm : t.privacyPanel.erase}
          </button>
          <p className="rx-hint">{t.privacyPanel.eraseHint}</p>
        </div>
        <h3>{t.privacyPanel.docsLabel}</h3>
        <div className="rx-doclinks">
          {docs.map((id) => (
            <button key={id} type="button" className="rx-linkbtn" onClick={() => onDoc(id)}>
              {t.footer.docs[id]}
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

/* ==========================================================================
   App
   ========================================================================== */

export default function App() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [lang, setLang] = useState<Lang>('pt');
  const [profile, setProfile] = useState<StoredProfile | null>(null);
  const [remember, setRemember] = useState(false);
  const [booked, setBooked] = useState(false);
  const [pkgId, setPkgId] = useState<PackageId>('deep');
  const [doc, setDoc] = useState<DocId | null>(null);
  const [privacy, setPrivacy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ticketKey, setTicketKey] = useState(0);

  const t = lang === 'pt' ? PT : EN;
  const activeTheme: Theme = theme ?? 'light';

  useIsomorphicLayoutEffect(() => {
    const storedTheme = readStore(STORE.theme);
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : systemDark ? 'dark' : 'light');

    const storedLang = readStore(STORE.lang);
    setLang(
      storedLang === 'pt' || storedLang === 'en'
        ? storedLang
        : navigator.language.toLowerCase().startsWith('pt')
          ? 'pt'
          : 'en',
    );

    const saved = readProfile();
    if (saved) {
      setProfile(saved);
      setRemember(true);
    }
    setBooked(readStore(STORE.booked) === '1');
    setTicketKey((key) => key + 1);
  }, []);

  useEffect(() => {
    if (document.getElementById('relaxe-fonts')) return;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    const preconnectStatic = document.createElement('link');
    preconnectStatic.rel = 'preconnect';
    preconnectStatic.href = 'https://fonts.gstatic.com';
    preconnectStatic.crossOrigin = 'anonymous';
    const stylesheet = document.createElement('link');
    stylesheet.id = 'relaxe-fonts';
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Newsreader:opsz,wght@6..72,300;6..72,400;6..72,500&display=swap';
    document.head.append(preconnect, preconnectStatic, stylesheet);
  }, []);

  useEffect(() => {
    document.documentElement.lang = t.code;
  }, [t.code]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function toggleTheme() {
    const current: Theme =
      theme ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next: Theme = current === 'dark' ? 'light' : 'dark';
    setTheme(next);
    writeStore(STORE.theme, next);
  }

  function changeLang(next: Lang) {
    setLang(next);
    writeStore(STORE.lang, next);
  }

  function handleRemember(value: boolean) {
    setRemember(value);
    if (!value) {
      writeStore(STORE.profile, null);
      setProfile(null);
    }
  }

  function handleProfile(value: StoredProfile | null) {
    setProfile(value);
    writeStore(STORE.profile, value ? JSON.stringify(value) : null);
  }

  function handleBooked() {
    writeStore(STORE.booked, '1');
    setBooked(true);
  }

  function eraseData() {
    writeStore(STORE.profile, null);
    writeStore(STORE.booked, null);
    setProfile(null);
    setRemember(false);
    setBooked(false);
    setTicketKey((key) => key + 1);
    setPrivacy(false);
    setToast(t.privacyPanel.erased);
  }

  function scrollToBooking() {
    const target = document.getElementById('agendar');
    if (!target) return;
    target.scrollIntoView({
      block: 'start',
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
    target.focus({ preventScroll: true });
  }

  function choosePackage(id: PackageId) {
    setPkgId(id);
    scrollToBooking();
  }

  function openDoc(id: DocId) {
    setPrivacy(false);
    setDoc(id);
  }

  return (
    <div className="rx" data-theme={theme ?? undefined}>
      <a className="rx-skip" href="#agendar">
        {t.controls.skip}
      </a>

      <TopBar t={t} lang={lang} onLang={changeLang} theme={activeTheme} onTheme={toggleTheme} />

      <main>
        <Hero t={t} onStart={scrollToBooking}>
          <Ticket
            key={ticketKey}
            t={t}
            lang={lang}
            profile={profile}
            remember={remember}
            onRemember={handleRemember}
            onProfile={handleProfile}
            eligible={!booked}
            pkgId={pkgId}
            onPkg={setPkgId}
            onBooked={handleBooked}
            onToast={setToast}
          />
        </Hero>

        <Sessions t={t} lang={lang} onChoose={choosePackage} />
        <How t={t} />
        <About t={t} />
        <Faq t={t} />
      </main>

      <Footer t={t} onDoc={openDoc} onPrivacy={() => setPrivacy(true)} />

      <LegalSheet doc={doc} t={t} lang={lang} onClose={() => setDoc(null)} />
      <PrivacySheet
        open={privacy}
        t={t}
        remember={remember}
        onRemember={handleRemember}
        onErase={eraseData}
        onDoc={openDoc}
        onClose={() => setPrivacy(false)}
      />
      <Toast message={toast} />
      <style>{CSS}</style>
    </div>
  );
}

function Toast({ message }: { message: string | null }) {
  return (
    <div className="rx-toast" role="status" aria-live="polite" data-visible={Boolean(message)}>
      {message ?? ''}
    </div>
  );
}

/* ==========================================================================
   Estilos — escopados em .rx
   ========================================================================== */

const CSS = String.raw`
.rx {
  --bg: #eceae3;
  --surface: #f8f5ee;
  --surface-2: #e3e0d7;
  --ink: #1c1618;
  --ink-soft: #3d3438;
  --muted: #6c6165;
  --line: rgba(28, 22, 24, 0.15);
  --line-strong: rgba(28, 22, 24, 0.28);
  --accent: #6d3a4c;
  --accent-soft: rgba(109, 58, 76, 0.08);
  --on-accent: #f8f3eb;
  --sage: #4f6b58;
  --danger: #8e2f3c;
  --ring: rgba(109, 58, 76, 0.5);
  --shadow: 0 30px 70px -40px rgba(28, 22, 24, 0.55);
  --f-ui: 'Instrument Sans', 'Helvetica Neue', Arial, sans-serif;
  --f-display: 'Newsreader', Georgia, 'Times New Roman', serif;
  font-family: var(--f-ui);
  font-size: 16px;
  line-height: 1.55;
  color-scheme: light;
  background: var(--bg);
  color: var(--ink);
  min-height: 100dvh;
  position: relative;
  isolation: isolate;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

@media (prefers-color-scheme: dark) {
  .rx:not([data-theme='light']) {
    --bg: #120f10;
    --surface: #1d1819;
    --surface-2: #282123;
    color-scheme: dark;
    --ink: #f2ebe3;
    --ink-soft: #d8cec9;
    --muted: #a99c9a;
    --line: rgba(242, 235, 227, 0.14);
    --line-strong: rgba(242, 235, 227, 0.26);
    --accent: #c88fa2;
    --accent-soft: rgba(200, 143, 162, 0.1);
    --on-accent: #1a1114;
    --sage: #9bb6a1;
    --danger: #e8a0a5;
    --ring: rgba(200, 143, 162, 0.6);
    --shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
  }
}

.rx[data-theme='dark'] {
  --bg: #120f10;
  --surface: #1d1819;
  --surface-2: #282123;
  color-scheme: dark;
  --ink: #f2ebe3;
  --ink-soft: #d8cec9;
  --muted: #a99c9a;
  --line: rgba(242, 235, 227, 0.14);
  --line-strong: rgba(242, 235, 227, 0.26);
  --accent: #c88fa2;
  --accent-soft: rgba(200, 143, 162, 0.1);
  --on-accent: #1a1114;
  --sage: #9bb6a1;
  --danger: #e8a0a5;
  --ring: rgba(200, 143, 162, 0.6);
  --shadow: 0 30px 80px -30px rgba(0, 0, 0, 0.8);
}

.rx,
.rx *,
.rx *::before,
.rx *::after {
  box-sizing: border-box;
}

.rx :where(h1, h2, h3, h4, p, ul, ol, figure, blockquote) {
  margin: 0;
  padding: 0;
}

.rx :where(ul, ol) {
  list-style: none;
}

.rx :where(button, input, textarea, select) {
  font: inherit;
  color: inherit;
}

.rx :where(button) {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

.rx :where(a) {
  color: inherit;
  text-decoration: none;
}

.rx ::selection {
  background: var(--accent);
  color: var(--on-accent);
}

.rx :where(a, button, summary):focus-visible {
  outline: 2px solid var(--ring);
  outline-offset: 3px;
  border-radius: 6px;
}

.rx-wrap {
  width: 100%;
  max-width: 1180px;
  margin-inline: auto;
  padding-inline: clamp(20px, 5vw, 56px);
}

.rx-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

.rx-skip {
  position: absolute;
  left: 16px;
  top: -64px;
  z-index: 80;
  background: var(--ink);
  color: var(--bg);
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 12px;
  transition: top 0.18s ease;
}

.rx-skip:focus {
  top: 12px;
}

/* Cabeçalho ------------------------------------------------------------- */

.rx-top {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}

.rx-top__inner {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
}

.rx-brand {
  font-family: var(--f-display);
  font-size: 27px;
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1;
  padding-top: 4px;
}

.rx-nav {
  display: flex;
  gap: 22px;
  margin-left: 26px;
}

.rx-nav a {
  font-size: 13px;
  color: var(--muted);
  transition: color 0.16s ease;
}

.rx-nav a:hover {
  color: var(--ink);
}

.rx-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

.rx-seg {
  display: flex;
  padding: 2px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
}

.rx-seg__btn {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  line-height: 1;
  padding: 6px 8px;
  border-radius: 6px;
  color: var(--muted);
  transition: background 0.16s ease, color 0.16s ease;
}

.rx-seg__btn:hover {
  color: var(--ink);
}

.rx-seg__btn[aria-pressed='true'] {
  background: var(--ink);
  color: var(--bg);
}

.rx-iconbtn {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--ink-soft);
  background: var(--surface);
  transition: background 0.16s ease, border-color 0.16s ease;
}

.rx-iconbtn:hover {
  border-color: var(--line-strong);
  background: var(--surface-2);
}

.rx-iconbtn svg {
  width: 16px;
  height: 16px;
}

/* Hero ------------------------------------------------------------------ */

.rx-hero {
  padding-block: clamp(34px, 5vw, 64px) clamp(46px, 7vw, 88px);
  background: radial-gradient(55% 55% at 78% 0%, var(--accent-soft), transparent 72%);
}

.rx-hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
  gap: clamp(30px, 5vw, 72px);
  align-items: stretch;
}

.rx-hero__copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.rx-hero__bottom {
  padding-top: clamp(24px, 4vw, 44px);
}

.rx-h1 {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(2.4rem, 5.4vw, 3.6rem);
  line-height: 1;
  letter-spacing: -0.035em;
  margin-bottom: 22px;
  text-wrap: balance;
}

.rx-lead {
  font-size: clamp(14.5px, 1.5vw, 16.5px);
  line-height: 1.62;
  color: var(--ink-soft);
  max-width: 46ch;
  text-wrap: pretty;
}

.rx-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 28px;
}

.rx-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 20px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease,
    transform 0.18s ease;
}

.rx-btn:active {
  transform: translateY(1px);
}

.rx-btn--primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}

.rx-btn--primary:hover {
  background: color-mix(in srgb, var(--accent) 88%, var(--ink));
  border-color: transparent;
}

.rx-btn--ghost {
  border-color: var(--line-strong);
  color: var(--ink);
  background: transparent;
}

.rx-btn--ghost:hover {
  background: var(--surface-2);
}

.rx-btn--danger {
  background: var(--danger);
  color: var(--bg);
}

.rx-btn--wide {
  width: 100%;
  min-height: 52px;
}

.rx-btn--small {
  min-height: 38px;
  padding: 0 14px;
  font-size: 12.5px;
}

.rx-micro {
  margin-top: 16px;
  font-size: 11.5px;
  color: var(--muted);
  line-height: 1.5;
}

.rx-book {
  position: sticky;
  top: 88px;
  min-width: 0;
}

.rx-book:focus {
  outline: none;
}

/* Bilhete --------------------------------------------------------------- */

.rx-ticket {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: var(--shadow);
  padding: 20px clamp(16px, 2vw, 24px) 18px;
  animation: rx-print 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.rx-ticket__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 14px;
}

.rx-ticket__title {
  font-family: var(--f-display);
  font-size: 23px;
  font-weight: 400;
  letter-spacing: -0.012em;
  line-height: 1.1;
  color: var(--ink);
}

.rx-ticket__ref {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.rx-step {
  border: 0;
  border-top: 1px dashed var(--line);
  margin: 0;
  padding: 13px 0 2px;
  min-width: 0;
}

.rx-step:first-of-type {
  border-top: 0;
  padding-top: 2px;
}

.rx-step__legend {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 0;
  margin-bottom: 9px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--ink);
}

.rx-num {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: 19px;
  height: 19px;
  border: 1px solid var(--line-strong);
  border-radius: 50%;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--muted);
}

.rx-step__name {
  min-width: 0;
}

.rx-step__val {
  margin-left: auto;
  max-width: 52%;
  overflow: hidden;
  font-size: 11px;
  font-weight: 400;
  color: var(--muted);
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rx-step__help {
  margin: -2px 0 8px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--muted);
}

.rx-month {
  margin-bottom: 5px;
  font-size: 10px;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.rx-options {
  display: grid;
  gap: 6px;
}

.rx-options--two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 561px) {
  .rx-options--packages {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .rx-opt--package {
    align-items: flex-start;
    padding: 9px 10px;
  }

  .rx-opt--package .rx-opt__body {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .rx-opt--package .rx-opt__price {
    margin-left: 0;
    font-size: 12px;
  }
}

.rx-opt {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 11px;
  border: 1px solid var(--line);
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  transition: border-color 0.16s ease, background 0.16s ease, box-shadow 0.16s ease;
}

.rx-opt:hover {
  border-color: var(--line-strong);
  background: var(--bg);
}

.rx-opt input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.rx-opt:has(input:checked) {
  border-color: var(--accent);
  background: var(--accent-soft);
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
}

.rx-opt__body {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 0;
}

.rx-opt__main {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.rx-opt__title {
  font-size: 13px;
  font-weight: 500;
  line-height: 1.35;
}

.rx-opt__note {
  font-size: 10.5px;
  line-height: 1.4;
  color: var(--muted);
}

.rx-opt__price {
  margin-left: auto;
  font-size: 12.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.rx-opt--place {
  align-items: flex-start;
  min-height: 64px;
  padding: 11px;
}

.rx-opt--place .rx-opt__body {
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.rx-opt--compact {
  padding: 8px 11px;
}

.rx-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 9px;
  min-width: 0;
}

.rx-label {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-size: 11px;
  color: var(--ink-soft);
}

.rx-req {
  color: var(--accent);
}

.rx-optional {
  font-size: 10px;
  color: var(--muted);
}

.rx-input {
  width: 100%;
  min-height: 40px;
  padding: 0 11px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--ink);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
  appearance: none;
}

.rx-input::placeholder {
  color: color-mix(in srgb, var(--muted) 78%, transparent);
}

.rx-input:hover {
  border-color: var(--line-strong);
}

.rx-input:focus,
.rx-input:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-soft);
}

.rx-input--error {
  border-color: var(--danger);
}

.rx-input--area {
  min-height: 64px;
  padding: 9px 11px;
  line-height: 1.5;
  resize: vertical;
}

.rx-hint {
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--muted);
}

.rx-err {
  font-size: 11px;
  line-height: 1.45;
  font-weight: 500;
  color: var(--danger);
}

.rx-err--summary {
  margin-top: 14px;
  padding: 8px 10px;
  border: 1px solid color-mix(in srgb, var(--danger) 40%, transparent);
  border-radius: 8px;
  background: color-mix(in srgb, var(--danger) 8%, transparent);
}

.rx-addr {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 8px;
  animation: rx-in 0.22s ease-out both;
}

.rx-field--cep {
  grid-column: 1;
}

.rx-field--street {
  grid-column: 2 / 4;
}

.rx-days {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  padding: 2px 2px 8px;
  scroll-snap-type: x proximity;
  scrollbar-width: thin;
  scrollbar-color: var(--line-strong) transparent;
}

.rx-day {
  flex: 0 0 auto;
  width: 51px;
  padding: 7px 0 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  border: 1px solid var(--line);
  border-radius: 9px;
  color: var(--ink);
  scroll-snap-align: start;
  transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
}

.rx-day:hover {
  border-color: var(--line-strong);
}

.rx-day[aria-pressed='true'] {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}

.rx-day[aria-pressed='true'] .rx-day__dow {
  opacity: 0.82;
}

.rx-day__dow {
  max-width: 47px;
  overflow: hidden;
  font-size: 9px;
  letter-spacing: 0.02em;
  opacity: 0.7;
  text-overflow: ellipsis;
  text-transform: capitalize;
  white-space: nowrap;
}

.rx-day__num {
  font-family: var(--f-display);
  font-size: 17px;
  line-height: 1.1;
}

.rx-day:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.rx-windows {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
  margin-top: 3px;
}

.rx-win {
  position: relative;
  display: block;
  padding: 7px 6px;
  border: 1px solid var(--line);
  border-radius: 9px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.rx-win:hover {
  border-color: var(--line-strong);
}

.rx-win input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}

.rx-win__body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.rx-win__name {
  font-size: 12px;
  font-weight: 500;
}

.rx-win__range {
  font-size: 10px;
  color: var(--muted);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.rx-win:has(input:checked) {
  border-color: var(--accent);
  background: var(--accent-soft);
  box-shadow: inset 0 0 0 1px var(--accent);
}

.rx-win:has(input:checked) .rx-win__name {
  color: var(--accent);
}

.rx-win:has(input:focus-visible) {
  outline: 2px solid var(--ring);
  outline-offset: 2px;
}

.rx-win--disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.rx-check {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  font-size: 11px;
  line-height: 1.5;
  color: var(--ink-soft);
  cursor: pointer;
}

.rx-check input {
  flex: none;
  width: 16px;
  height: 16px;
  margin: 1px 0 0;
  accent-color: var(--accent);
  cursor: pointer;
}

.rx-check__hint {
  display: block;
  margin-top: 1px;
  font-size: 10px;
  color: var(--muted);
}

.rx-consent {
  margin-top: 8px;
  padding: 9px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--bg);
}

.rx-check--saved {
  margin-top: 11px;
}

.rx-perf {
  position: relative;
  margin: 15px calc(-1 * clamp(16px, 2vw, 24px)) 0;
  border-top: 1px dashed var(--line-strong);
}

.rx-perf__cut {
  position: absolute;
  top: -8px;
  width: 16px;
  height: 16px;
  border: 1px solid var(--line);
  border-radius: 50%;
  background: var(--bg);
}

.rx-perf__cut--left {
  left: -9px;
}

.rx-perf__cut--right {
  right: -9px;
}

.rx-ledger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 12px;
  font-size: 11.5px;
}

.rx-ledger__row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: var(--ink-soft);
}

.rx-leader {
  flex: 1;
  min-width: 10px;
  border-bottom: 1px dotted var(--line-strong);
  transform: translateY(-3px);
}

.rx-ledger__row > span:last-child {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.rx-ledger__row--discount > span:last-child {
  color: var(--sage);
}

.rx-ledger__row--total {
  align-items: center;
  margin-top: 7px;
  padding-top: 9px;
  border-top: 1px solid var(--line);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink);
}

.rx-total {
  font-family: var(--f-display);
  font-size: 25px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.01em;
}

.rx-deposit {
  margin-top: 3px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--muted);
}

.rx-deposit strong {
  font-weight: 500;
  color: var(--ink-soft);
}

.rx-ticket__foot {
  padding-top: 14px;
}

.rx-fineprint {
  margin-top: 9px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--muted);
  text-align: center;
  text-wrap: pretty;
}

.rx-sent {
  padding: 6px 0 2px;
  animation: rx-in 0.24s ease-out both;
}

.rx-stamp {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 9px;
  border: 1px solid var(--sage);
  border-radius: 4px;
  color: var(--sage);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.13em;
  text-transform: uppercase;
  transform: rotate(-2deg);
}

.rx-sent__title {
  font-family: var(--f-display);
  font-size: 26px;
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 6px;
}

.rx-sent__body {
  max-width: 42ch;
  font-size: 12px;
  line-height: 1.58;
  color: var(--ink-soft);
}

.rx-sent__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.rx-sent__actions .rx-btn {
  flex: 1 1 160px;
  min-height: 44px;
}

.rx-linkbtn {
  font-size: 11px;
  color: var(--muted);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
  text-align: left;
}

.rx-linkbtn:hover {
  color: var(--ink);
}

.rx-sent .rx-linkbtn {
  margin-top: 13px;
}

.rx-mobilebar {
  display: none;
}

/* Seções ---------------------------------------------------------------- */

.rx-section {
  padding-block: clamp(52px, 7vw, 86px);
}

.rx-section--rule {
  border-top: 1px solid var(--line);
}

.rx-section__head {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 12px 48px;
  align-items: end;
  margin-bottom: clamp(22px, 3.5vw, 38px);
}

.rx-h2 {
  font-family: var(--f-display);
  font-weight: 400;
  font-size: clamp(1.9rem, 3.4vw, 2.6rem);
  line-height: 1.06;
  letter-spacing: -0.025em;
}

.rx-section__lead {
  justify-self: end;
  max-width: 44ch;
  font-size: 13px;
  line-height: 1.55;
  color: var(--muted);
  text-wrap: pretty;
}

.rx-sessions {
  border-top: 1px solid var(--line);
}

.rx-session {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 24px;
  align-items: center;
  padding: 19px 8px;
  border-bottom: 1px solid var(--line);
  transition: background 0.18s ease;
}

.rx-session:hover {
  background: color-mix(in srgb, var(--surface) 72%, transparent);
}

.rx-session__name {
  display: flex;
  align-items: baseline;
  gap: 9px;
  font-family: var(--f-display);
  font-size: 22px;
  font-weight: 400;
  line-height: 1.2;
}

.rx-popular {
  font-family: var(--f-ui);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--sage);
}

.rx-session__blurb {
  max-width: 52ch;
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--muted);
}

.rx-session__meta {
  display: flex;
  align-items: baseline;
  gap: 18px;
}

.rx-session__min {
  font-size: 10.5px;
  color: var(--muted);
  white-space: nowrap;
}

.rx-session__price {
  min-width: 76px;
  font-family: var(--f-display);
  font-size: 22px;
  text-align: right;
}

.rx-how {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 36px);
}

.rx-how__step {
  padding-top: 14px;
  border-top: 1px solid var(--line-strong);
}

.rx-how__num {
  display: block;
  margin-bottom: 18px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.rx-how__step h3 {
  margin-bottom: 5px;
  font-family: var(--f-display);
  font-size: 20px;
  font-weight: 400;
  line-height: 1.2;
}

.rx-how__step p {
  max-width: 34ch;
  font-size: 12px;
  line-height: 1.55;
  color: var(--muted);
}

.rx-about {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(28px, 5vw, 64px);
  align-items: start;
}

.rx-plaque {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 22px 16px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.rx-plaque::before {
  content: '';
  position: absolute;
  inset: 7px;
  border: 1px solid var(--line);
  border-radius: 9px;
  opacity: 0.7;
  pointer-events: none;
}

.rx-plaque > * {
  position: relative;
}

.rx-plaque__label {
  margin-bottom: 12px;
  font-size: 10px;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.rx-plaque__hours {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(30px, 3.4vw, 38px);
  line-height: 1;
  letter-spacing: -0.025em;
}

.rx-plaque__note {
  margin-top: 4px;
  font-size: 11.5px;
  color: var(--muted);
}

.rx-plaque__foot {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 14px;
  margin-top: 18px;
  padding-top: 11px;
  border-top: 1px solid var(--line);
  font-size: 10.5px;
  color: var(--ink-soft);
}

.rx-about__quote {
  grid-column: 1;
  grid-row: 1;
  max-width: 22ch;
  padding-top: 18px;
  border-top: 1px solid var(--line-strong);
}

.rx-about__text {
  grid-column: 2;
  grid-row: 1;
}

.rx-about__quote blockquote {
  font-family: var(--f-display);
  font-weight: 300;
  font-size: clamp(1.9rem, 3.6vw, 2.9rem);
  line-height: 1.06;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.rx-about__quote figcaption {
  margin-top: 16px;
  font-size: 10.5px;
  color: var(--muted);
}

.rx-about__text > p {
  max-width: 56ch;
  margin-top: 12px;
  font-size: 13.5px;
  line-height: 1.65;
  color: var(--ink-soft);
  text-wrap: pretty;
}

.rx-about__text .rx-h2 {
  margin-bottom: 2px;
}

.rx-points {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 18px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.rx-points li {
  position: relative;
  padding-left: 16px;
  font-size: 11.5px;
  line-height: 1.45;
  color: var(--ink-soft);
}

.rx-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 5px;
  border: 1px solid var(--sage);
  border-radius: 50%;
}

.rx-faq {
  display: grid;
  grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr);
  gap: clamp(24px, 5vw, 64px);
  align-items: start;
}

.rx-faq__list {
  border-top: 1px solid var(--line);
}

.rx-faq__item {
  border-bottom: 1px solid var(--line);
}

.rx-faq__item summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 15px 2px;
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.4;
  list-style: none;
  cursor: pointer;
}

.rx-faq__item summary::-webkit-details-marker {
  display: none;
}

.rx-faq__item summary svg {
  flex: none;
  width: 16px;
  height: 16px;
  color: var(--muted);
  transition: transform 0.2s ease;
}

.rx-faq__item[open] summary svg {
  transform: rotate(45deg);
}

.rx-faq__item p {
  max-width: 62ch;
  padding: 0 24px 16px 2px;
  font-size: 12px;
  line-height: 1.62;
  color: var(--muted);
  animation: rx-in 0.2s ease-out both;
}

/* Rodapé ---------------------------------------------------------------- */

.rx-foot {
  padding-block: clamp(34px, 5vw, 54px) 26px;
  border-top: 1px solid var(--line);
  background: var(--surface);
}

.rx-foot__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 32px;
}

.rx-foot h3 {
  margin-bottom: 9px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.rx-foot p,
.rx-foot a,
.rx-foot .rx-linkbtn {
  font-size: 11.5px;
  line-height: 1.65;
  color: var(--ink-soft);
}

.rx-foot__brand {
  margin-bottom: 8px;
  font-family: var(--f-display);
  font-size: 24px;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--ink);
}

.rx-foot__tagline {
  max-width: 30ch;
  margin-bottom: 12px;
  color: var(--muted);
}

.rx-foot a:hover {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.rx-foot__cnpj {
  margin-top: 7px;
  font-size: 10.5px;
  color: var(--muted);
}

.rx-legal-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.rx-foot__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid var(--line);
}

.rx-foot__bottom p {
  font-size: 10px;
  color: var(--muted);
}

/* Diálogos -------------------------------------------------------------- */

.rx-dialog {
  width: min(660px, calc(100vw - 24px));
  max-width: none;
  max-height: 88dvh;
  margin: auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-family: var(--f-ui);
}

.rx-dialog--narrow {
  width: min(460px, calc(100vw - 24px));
}

.rx-dialog::backdrop {
  background: rgba(12, 9, 10, 0.58);
  -webkit-backdrop-filter: blur(3px);
  backdrop-filter: blur(3px);
}

.rx-dialog__card {
  display: flex;
  flex-direction: column;
  max-height: 88dvh;
  overflow: hidden;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 14px;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.6);
}

.rx-dialog__cardhead {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: space-between;
  padding: 10px 10px 0 20px;
}

.rx-dialog__rule {
  flex: 1;
  height: 1px;
  margin-right: 12px;
  background: var(--line);
}

.rx-dialog__body {
  overflow-y: auto;
  padding: 8px 24px 28px;
}

.rx-dialog__body .rx-iconbtn {
  width: 32px;
  height: 32px;
}

.rx-doc h2 {
  font-family: var(--f-display);
  font-size: 26px;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.015em;
}

.rx-doc__updated {
  margin-top: 6px;
  font-size: 10px;
  color: var(--muted);
}

.rx-doc section {
  margin-top: 20px;
}

.rx-doc h3 {
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 600;
}

.rx-doc p {
  max-width: 74ch;
  margin-top: 6px;
  font-size: 12.5px;
  line-height: 1.68;
  color: var(--ink-soft);
  text-wrap: pretty;
}

.rx-doc .rx-check {
  margin-top: 14px;
}

.rx-doc .rx-check--panel {
  padding: 12px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--bg);
}

.rx-doc .rx-hint {
  margin-top: 6px;
}

.rx-erase {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  margin-top: 14px;
}

.rx-erase .rx-btn {
  min-height: 38px;
  font-size: 12px;
}

.rx-doc > h3 {
  margin-top: 22px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--muted);
}

.rx-doclinks {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-top: 8px;
}

/* Toast ----------------------------------------------------------------- */

.rx-toast {
  position: fixed;
  left: 50%;
  bottom: 24px;
  z-index: 70;
  max-width: calc(100vw - 32px);
  padding: 10px 16px;
  border-radius: 10px;
  background: var(--ink);
  color: var(--bg);
  font-size: 11.5px;
  text-align: center;
  box-shadow: 0 20px 40px -20px rgba(0, 0, 0, 0.5);
  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 12px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.rx-toast[data-visible='true'] {
  opacity: 1;
  transform: translate(-50%, 0);
}

/* Movimento ------------------------------------------------------------- */

@keyframes rx-print {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.997);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes rx-in {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rx *,
  .rx *::before,
  .rx *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Responsivo ------------------------------------------------------------ */

@media (max-width: 1020px) {
  .rx-nav {
    display: none;
  }
}

@media (max-width: 960px) {
  .rx-hero__grid {
    grid-template-columns: minmax(0, 1fr);
  }

  .rx-h1 {
    font-size: clamp(2.5rem, 9vw, 3.5rem);
  }

  .rx-hero__copy,
  .rx-book {
    width: 100%;
    max-width: 620px;
    margin-inline: auto;
  }

  .rx-book {
    position: static;
  }

  .rx-section__head {
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
  }

  .rx-section__lead {
    justify-self: start;
  }

  .rx-about,
  .rx-faq {
    grid-template-columns: minmax(0, 1fr);
  }

  .rx-about__text,
  .rx-about__quote {
    grid-column: 1;
    grid-row: auto;
  }

  .rx-about__quote {
    margin-top: 6px;
  }

  .rx-how {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }

  .rx-how__step {
    display: grid;
    grid-template-columns: 32px minmax(0, 1fr);
    column-gap: 4px;
  }

  .rx-how__num {
    grid-row: 1 / 3;
    margin: 0;
    padding-top: 3px;
  }

  .rx-session {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 8px 14px;
    align-items: end;
    padding: 16px 4px;
  }

  .rx-session__main {
    grid-column: 1 / -1;
  }

  .rx-session__meta {
    justify-content: flex-start;
    gap: 12px;
  }

  .rx-session__price {
    min-width: 0;
    margin-left: auto;
    text-align: left;
  }

  .rx-session .rx-btn {
    justify-self: end;
    margin: 0;
  }

  .rx-foot__grid {
    grid-template-columns: 1fr 1fr;
    gap: 26px;
  }

}

@media (max-width: 640px) {
  .rx-mobilebar {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    z-index: 40;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 9px 8px 14px;
    border: 1px solid var(--line);
    border-radius: 14px;
    background: var(--surface);
    box-shadow: 0 18px 40px -16px rgba(0, 0, 0, 0.45);
    animation: rx-in 0.2s ease-out both;
  }

  .rx-mobilebar__total {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
  }

  .rx-mobilebar__total span {
    font-size: 9px;
    color: var(--muted);
  }

  .rx-mobilebar__total strong {
    font-family: var(--f-display);
    font-size: 20px;
    font-weight: 400;
  }

  .rx-mobilebar .rx-btn {
    margin-left: auto;
    min-height: 44px;
  }

  .rx-toast {
    bottom: calc(84px + env(safe-area-inset-bottom));
  }
}

@media (max-width: 560px) {
  .rx-hero {
    padding-top: 26px;
  }

  .rx-h1 {
    letter-spacing: -0.03em;
  }

  .rx-actions .rx-btn {
    flex: 1 1 100%;
  }

  .rx-ticket {
    padding: 18px 15px 16px;
    border-radius: 14px;
  }

  .rx-perf {
    margin-inline: -15px;
  }

  .rx-addr {
    grid-template-columns: 1fr 1fr;
  }

  .rx-field--cep {
    grid-column: 1;
  }

  .rx-field--street {
    grid-column: 2 / 3;
  }

  .rx-opt--place .rx-opt__note {
    font-size: 10px;
  }

  .rx-windows {
    gap: 4px;
  }

  .rx-win {
    padding: 7px 3px;
  }

  .rx-win__name {
    font-size: 11px;
  }

  .rx-win__range {
    font-size: 9.5px;
  }

  .rx-day {
    width: 48px;
  }

  .rx-sent__actions {
    flex-direction: column;
  }

  .rx-sent__actions .rx-btn {
    flex: none;
    width: 100%;
  }

  .rx-foot__grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }

  .rx-points {
    grid-template-columns: minmax(0, 1fr);
  }

  .rx-dialog__body {
    padding: 4px 18px 22px;
  }
}
`;
