import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

// =====================================================================================
// THALY MASSAGENS — SITE / APP DE AGENDAMENTO VERTICAL
// Full Stack Senior + UX/UI Senior
// Mobile First | Responsivo Real | Fluxo Vertical | Conteúdo Completo
// =====================================================================================

type Category = "express" | "relax" | "sensorial" | "care";
type LocationType = "home" | "hotel" | "suite";
type PaymentMethod = "" | "pix" | "card" | "cash";

interface ServiceItem {
  id: string;
  category: Category;
  icon: string;
  tag: string;
  title: string;
  subtitle: string;
  short: string;
  price: number;
  duration: number;
  bestFor: string[];
  sessionFlow: string[];
  result: string;
  popular?: boolean;
}

interface PlanItem {
  id: string;
  icon: string;
  title: string;
  tag: string;
  short: string;
  price: number;
  fullPrice: number;
  savings: number;
  includes: string[];
  result: string;
}

interface ExtraItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  price: number;
}

interface Address {
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  comp: string;
  hotelName: string;
}

interface Booking {
  serviceId: string;
  planId: string;
  extras: Record<string, boolean>;
  date: string;
  time: string;
  locationType: LocationType;
  address: Address;
  payment: PaymentMethod;
  name: string;
  phone: string;
  terms: boolean;
  portfolioAuth: boolean;
}

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  PIX_KEY: "62.922.530/0001-14",
  STORAGE_KEY: "@thaly_vertical_booking_v2",
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_HOURS: ["12:00", "13:00", "17:00", "18:00"],
  RUSH_FEE: 15,
  PHOTO_PLACEHOLDERS: [
    "Ambiente limpo e preparado",
    "Óleos, toalhas e cuidado",
    "Atendimento com discrição",
  ],
} as const;

const ICONS: Record<string, string> = {
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  arrow: "M5 12h14 M13 5l7 7-7 7",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3",
  sun: "M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  hand: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  foot: "M8 3c2 1 3 3 3 5 0 2-1 4-2 6-.7 1.4-.4 3 1 4 1.4 1 3.6.8 5-.3 1.8-1.4 3-3.8 3-6.2C18 6.8 14.2 3 9.5 3H8z M6 13c-1.5 1.5-2 3.5-1 5 1.2 1.8 3.7 2 5 1",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shower: "M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  hotel: "M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01",
  bed: "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
  pin: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  card: "M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  money: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  phone: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.63 2.61a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.47-1.2a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.61.63A2 2 0 0 1 22 16.92z",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  scissors: "M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z",
};

const SERVICES: ServiceItem[] = [
  {
    id: "pes",
    category: "express",
    icon: "foot",
    tag: "ALÍVIO RÁPIDO",
    title: "Massagem nos Pés",
    subtitle: "Para pés cansados, tensão acumulada e sensação de peso.",
    short: "Uma sessão objetiva para aliviar a base do corpo e trazer leveza imediata.",
    price: 110,
    duration: 40,
    bestFor: ["Quem trabalha em pé", "Pés pesados no fim do dia", "Cansaço depois de viagem", "Desejo de relaxamento rápido"],
    sessionFlow: [
      "Você se acomoda em uma posição confortável, com os pés apoiados e o corpo relaxado.",
      "A sessão começa com aquecimento leve para diminuir a rigidez e preparar a pele.",
      "Depois entram pressões específicas na sola, calcanhar, arco do pé e dedos.",
      "Finalizo com movimentos mais lentos para deixar a sensação de descanso e circulação ativada.",
    ],
    result: "Você sai com os pés mais leves, menos tensão nas pernas e uma sensação clara de descanso.",
  },
  {
    id: "maos",
    category: "express",
    icon: "hand",
    tag: "MÃOS E PUNHOS",
    title: "Massagem nas Mãos",
    subtitle: "Para quem digita muito, usa ferramentas ou sente rigidez nas mãos.",
    short: "Cuidado direto nas mãos, dedos, punhos e antebraços.",
    price: 110,
    duration: 40,
    bestFor: ["Trabalho no computador", "Mãos cansadas", "Punhos tensos", "Sensação de rigidez nos dedos"],
    sessionFlow: [
      "Começo avaliando onde existe mais tensão: palma, punho, dedos ou antebraço.",
      "Faço alongamentos suaves nos dedos e articulações, sem forçar a região.",
      "A massagem aprofunda nos pontos de tensão da palma e na base do polegar.",
      "Finalizo com movimentos de soltura no punho e antebraço para completar o alívio.",
    ],
    result: "As mãos ficam mais soltas, os punhos menos rígidos e a sensação de fadiga diminui.",
  },
  {
    id: "relaxante",
    category: "relax",
    icon: "sun",
    tag: "CORPO TRAVADO",
    title: "Massagem Clássica",
    subtitle: "Para costas duras, ombros pesados e mente cansada.",
    short: "A sessão mais direta para tirar tensão muscular e devolver conforto ao corpo.",
    price: 157,
    duration: 40,
    bestFor: ["Costas travadas", "Dor muscular leve", "Estresse do trabalho", "Dificuldade para relaxar"],
    sessionFlow: [
      "Você deita confortavelmente e eu preparo o corpo com movimentos lentos de aquecimento.",
      "Trabalho costas, ombros, pescoço e regiões com maior rigidez, sempre ajustando a pressão.",
      "Uso manobras de deslizamento, compressão e soltura muscular para desfazer pontos de tensão.",
      "A sessão termina em ritmo mais calmo, para o corpo entender que pode desacelerar.",
    ],
    result: "Você sente o corpo menos pesado, ombros mais baixos e uma vontade natural de descansar.",
  },
  {
    id: "naturista",
    category: "relax",
    icon: "sparkles",
    tag: "LIBERDADE CORPORAL",
    title: "Clássica Naturista",
    subtitle: "Relaxamento com menos barreiras e mais presença corporal.",
    short: "Uma versão mais livre da massagem clássica, conduzida com respeito e limites claros.",
    price: 197,
    duration: 40,
    bestFor: ["Quem quer relaxar sem vergonha", "Busca de liberdade corporal", "Redução de bloqueios", "Ambiente reservado"],
    sessionFlow: [
      "Antes de começar, alinhamos limites, conforto e qualquer ponto que você queira evitar.",
      "A sessão segue a base da massagem clássica, com foco em soltar músculos e respiração.",
      "Os movimentos são conduzidos com naturalidade, sem pressa e sem julgamento do corpo.",
      "Finalizo retomando o ritmo mais calmo para você se sentir seguro, leve e presente.",
    ],
    result: "A sensação é de liberdade, relaxamento físico e menos tensão emocional no próprio corpo.",
  },
  {
    id: "crossfit",
    category: "relax",
    icon: "zap",
    tag: "RECUPERAÇÃO",
    title: "Massagem para Atletas",
    subtitle: "Para quem treina pesado e sente o corpo pedindo manutenção.",
    short: "Mais firme, técnica e focada em recuperação muscular.",
    price: 187,
    duration: 60,
    bestFor: ["Pós-treino", "Pernas pesadas", "Costas carregadas", "Ombros tensionados"],
    sessionFlow: [
      "Começo entendendo seu treino recente e quais regiões estão mais sobrecarregadas.",
      "Aqueço a musculatura com fricções e pressão progressiva para evitar desconforto excessivo.",
      "Trabalho pontos de tensão com manobras mais firmes em pernas, costas, glúteos, ombros ou braços.",
      "Quando necessário, finalizo com alongamentos leves e pomada térmica em áreas específicas.",
    ],
    result: "O corpo fica mais solto, com melhor mobilidade e sensação de recuperação real.",
  },
  {
    id: "sensitiva",
    category: "sensorial",
    icon: "sparkles",
    tag: "MENTE ACELERADA",
    title: "Massagem Sensorial",
    subtitle: "Para ansiedade, carência de toque e necessidade de desacelerar.",
    short: "Uma experiência mais suave, focada em presença, respiração e sensações do corpo.",
    price: 177,
    duration: 60,
    bestFor: ["Ansiedade", "Insônia", "Vontade de desligar", "Necessidade de acolhimento"],
    sessionFlow: [
      "A sessão começa com conversa rápida para entender seu estado: cansado, ansioso, tenso ou carente de cuidado.",
      "O primeiro momento é de relaxamento corporal, usando movimentos suaves para baixar a defesa do corpo.",
      "Depois entram estímulos sensoriais leves, respiração, pausas e variações de ritmo para você sair da mente e voltar para o corpo.",
      "Tudo é conduzido com comunicação e respeito. A intensidade acompanha sua resposta e seu conforto.",
    ],
    result: "Você termina mais calmo, respirando melhor e com a sensação de ter sido cuidado sem pressa.",
    popular: true,
  },
  {
    id: "fusion",
    category: "sensorial",
    icon: "heart",
    tag: "ALÍVIO + CONEXÃO",
    title: "Experiência Fusion",
    subtitle: "Primeiro o corpo relaxa; depois a experiência fica mais sensorial.",
    short: "Combina massagem clássica, presença e uma condução mais envolvente.",
    price: 207,
    duration: 60,
    bestFor: ["Semana pesada", "Estresse acumulado", "Busca por relaxamento completo", "Quem quer uma experiência equilibrada"],
    sessionFlow: [
      "Começo como uma massagem clássica: costas, ombros e regiões de tensão recebem atenção primeiro.",
      "Quando o corpo já está mais solto, o ritmo muda de forma gradual e mais sensorial.",
      "A experiência passa a trabalhar toque, presença, respiração e conexão, sempre dentro dos limites combinados.",
      "O encerramento é feito de forma calma para você não sair acelerado, mas relaxado e inteiro.",
    ],
    result: "É uma sessão para aliviar o peso físico e também a necessidade emocional de cuidado e presença.",
  },
  {
    id: "reversa",
    category: "sensorial",
    icon: "heart",
    tag: "TROCA GUIADA",
    title: "Massagem Reversa",
    subtitle: "Uma experiência interativa, com troca, presença e limites combinados.",
    short: "Metade cuidado recebido, metade participação guiada, sem clima frio ou automático.",
    price: 260,
    duration: 60,
    bestFor: ["Quem sente falta de contato humano", "Busca de mais participação", "Vontade de troca", "Experiência mais próxima"],
    sessionFlow: [
      "A primeira parte é focada em você: eu conduzo uma massagem relaxante para diminuir tensão e criar confiança.",
      "Depois explico como a parte reversa funciona e o que pode ou não acontecer, de forma simples e respeitosa.",
      "Você participa da experiência de maneira guiada, sem pressão para performar nada.",
      "A sessão termina com acolhimento, pausa e retomada do corpo para você sair tranquilo.",
    ],
    result: "Você sente mais conexão, menos solidão corporal e uma experiência menos mecânica.",
  },
  {
    id: "nuru",
    category: "sensorial",
    icon: "star",
    tag: "ENTREGA TOTAL",
    title: "Massagem Nuru",
    subtitle: "Gel, deslizamento e relaxamento profundo para uma experiência intensa.",
    short: "Uma sessão mais imersiva, com gel e contato sensorial contínuo.",
    price: 317,
    duration: 60,
    bestFor: ["Quem quer uma experiência intensa", "Relaxamento profundo", "Desligar completamente", "Entrega corporal"],
    sessionFlow: [
      "Preparo o ambiente para que tudo fique confortável, limpo e seguro.",
      "A sessão começa com relaxamento inicial para o corpo aceitar melhor a experiência.",
      "Depois entra o gel, criando movimentos deslizantes e uma sensação contínua de contato e fluidez.",
      "A condução é imersiva, respeitando sua respiração, conforto, limites e higiene do início ao fim.",
    ],
    result: "A sensação final é de corpo solto, mente apagada do estresse e relaxamento muito profundo.",
    popular: true,
  },
  {
    id: "depilacao",
    category: "care",
    icon: "scissors",
    tag: "CUIDADO E ESTÉTICA",
    title: "Aparo de Pelos do Corpo",
    subtitle: "Para ficar mais limpo, leve e confortável na rotina.",
    short: "Aparo prático com máquina, em regiões combinadas antes.",
    price: 107,
    duration: 60,
    bestFor: ["Autoestima", "Praticidade", "Sensação de limpeza", "Manutenção do corpo"],
    sessionFlow: [
      "Você escolhe as áreas que deseja aparar: peito, abdômen, costas, pernas ou outras regiões combinadas.",
      "Faço o aparo com máquina e cuidado para manter conforto e segurança.",
      "Durante o processo, ajustamos altura e acabamento de acordo com o resultado que você prefere.",
      "Finalizo deixando a pele limpa, organizada e pronta para você seguir a semana com mais leveza.",
    ],
    result: "Você sai com aparência mais limpa, menos incômodo com suor e mais confiança no próprio corpo.",
  },
];

const PLANS: PlanItem[] = [
  { id: "pack_basic", icon: "clock", title: "Alívio de Rotina (2x)", tag: "RELAX", short: "Para quem quer manter o corpo cuidado sem esperar travar tudo.", price: 247, fullPrice: 284, savings: 37, includes: ["1x Massagem nos Pés", "1x Massagem Clássica", "Bônus: aromaterapia nas sessões"], result: "Duas pausas no mês para aliviar o corpo antes do estresse acumular." },
  { id: "pack_essencial", icon: "sun", title: "Kit Sobrevivência (2x)", tag: "DURMA BEM", short: "Um encontro para dor física e outro para desacelerar a mente.", price: 297, fullPrice: 334, savings: 37, includes: ["1x Massagem Clássica", "1x Massagem Sensorial", "Sessões separadas no mês"], result: "Ideal para quem vive no limite e precisa criar uma rotina mínima de cuidado." },
  { id: "pack_glow", icon: "sparkles", title: "Renovação Completa (2x)", tag: "GLOW UP", short: "Estética, autoestima e relaxamento em dois encontros.", price: 327, fullPrice: 391, savings: 64, includes: ["1x Aparo de Pelos do Corpo", "1x Experiência Fusion", "Bônus: +30 minutos na Fusion"], result: "Para se sentir mais limpo, cuidado e relaxado na mesma jornada." },
  { id: "pack_muscle", icon: "zap", title: "Combo Recuperação (2x)", tag: "MÚSCULOS", short: "Para quem treina forte e precisa de manutenção real.", price: 347, fullPrice: 408, savings: 61, includes: ["2x Massagem para Atletas", "Bônus: foco extra em dores", "Atenção em regiões sobrecarregadas"], result: "Você cuida do corpo como parte do treino, não só quando a dor aparece." },
  { id: "pack_interativo", icon: "heart", title: "Combo Conexão (2x)", tag: "CALOR HUMANO", short: "Para quem sente falta de presença, toque e cuidado sem pressa.", price: 387, fullPrice: 467, savings: 80, includes: ["1x Experiência Fusion", "1x Massagem Reversa", "Dois encontros separados no mês"], result: "Mais acolhimento, menos sensação de solidão corporal e uma pausa verdadeira da rotina." },
  { id: "pack_premium", icon: "shield", title: "Plano Profundo (3x)", tag: "CUIDADO MÁXIMO", short: "Três semanas com cuidado marcado, para não deixar seu bem-estar para depois.", price: 637, fullPrice: 721, savings: 84, includes: ["1x Clássica Naturista", "1x Experiência Fusion", "1x Massagem Nuru"], result: "Uma jornada de relaxamento corporal, sensorial e emocional ao longo do mês." },
  { id: "pack_ultimate", icon: "star", title: "Jornada Completa (3x)", tag: "SOLUÇÃO COMPLETA", short: "Para quem quer uma experiência completa e crescente durante o mês.", price: 657, fullPrice: 778, savings: 121, includes: ["1x Massagem Sensorial", "1x Experiência Fusion", "1x Massagem Nuru", "Bônus combinado antes dos encontros"], result: "A forma mais completa de desligar a mente e criar uma rotina de prazer, cuidado e descanso." },
];

const EXTRAS: ExtraItem[] = [
  { id: "hair_trim", icon: "scissors", title: "Aparo de Pelos", desc: "Manutenção em até 2 áreas do corpo durante o atendimento.", price: 57 },
  { id: "more_time", icon: "clock", title: "+30 minutos", desc: "Mais tempo para conduzir a sessão com calma e sem pressa.", price: 77 },
  { id: "touch", icon: "hand", title: "Interação Guiada", desc: "Mais participação durante a experiência, sempre com limites alinhados antes.", price: 77 },
  { id: "aroma", icon: "sparkles", title: "Aromaterapia", desc: "Uso de aromas e óleos para deixar o ambiente mais relaxante.", price: 17 },
  { id: "pain_relief", icon: "shield", title: "Foco em Dores", desc: "Mais atenção em pontos específicos com maior rigidez ou incômodo.", price: 17 },
  { id: "dominador", icon: "zap", title: "Condução mais ativa", desc: "Uma condução mais firme e presente, combinada com clareza antes da sessão.", price: 180 },
  { id: "oral", icon: "heart", title: "Complemento íntimo", desc: "Complemento sensorial reservado, alinhado com higiene, respeito e consentimento.", price: 120 },
  { id: "beijos", icon: "heart", title: "Beijos e proximidade", desc: "Mais carinho e proximidade quando fizer sentido para os dois.", price: 77 },
  { id: "prostatico", icon: "star", title: "Atenção íntima guiada", desc: "Complemento específico, feito somente com conversa prévia, higiene e consentimento.", price: 120 },
];

const RULES = [
  { icon: "shower", title: "Banho antes da sessão", desc: "O banho quente relaxa os músculos, melhora a experiência e garante um contato mais confortável." },
  { icon: "shield", title: "Saúde e prevenção", desc: "Ao agendar, você confirma que está bem, sem sintomas contagiosos ou lesões abertas." },
  { icon: "hand", title: "Limites combinados", desc: "Tudo é conversado com respeito. Nada acontece no automático ou sem consentimento." },
  { icon: "heart", title: "Sem julgamento", desc: "Idade, corpo, peso e inseguranças não são problema. O atendimento é feito para acolher." },
];

const FAQS = [
  { q: "Onde o atendimento acontece?", a: "Pode ser na sua residência, em hotel ou na minha suíte. Quando houver deslocamento, a taxa de Uber é confirmada no WhatsApp." },
  { q: "Preciso saber exatamente qual sessão escolher?", a: "Não. Você pode escolher a que mais combina com seu momento e, no WhatsApp, ajustamos qualquer detalhe antes de confirmar." },
  { q: "Tenho vergonha do meu corpo. Tudo bem?", a: "Sim. A proposta é acolhimento, não julgamento. O foco é você se sentir cuidado, seguro e confortável." },
  { q: "Como confirmo o horário?", a: "Depois de preencher o fluxo, o site monta uma mensagem pronta para o WhatsApp. Eu confirmo disponibilidade, deslocamento e detalhes finais por lá." },
];

const REVIEWS = [
  { name: "Gustavo", location: "Bela Vista - SP", service: "Experiência Fusion", text: "Chegou no horário, preparou tudo com calma e eu realmente senti alívio nas costas." },
  { name: "Giovana", location: "Hotel Portal da Mata", service: "Massagem Sensorial", text: "Foi respeitoso do início ao fim. Eu precisava desacelerar e saí muito mais leve." },
  { name: "Bruno", location: "SP", service: "Massagem Clássica", text: "A massagem foi bem executada e focada exatamente onde eu estava travado." },
  { name: "Ricardo", location: "Fernandópolis", service: "Massagem Reversa", text: "Me senti à vontade, sem julgamento e com muita discrição." },
];

const emptyAddress: Address = { cep: "", street: "", number: "", district: "", city: "", comp: "", hotelName: "" };
const emptyBooking: Booking = {
  serviceId: "",
  planId: "",
  extras: {},
  date: "",
  time: "",
  locationType: "home",
  address: emptyAddress,
  payment: "",
  name: "",
  phone: "",
  terms: false,
  portfolioAuth: false,
};

const cls = (...classes: Array<string | false | undefined | null>) => classes.filter(Boolean).join(" ");
const formatMoney = (value: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value || 0);
const onlyDigits = (value: string) => value.replace(/\D/g, "");
const maskCep = (value: string) => onlyDigits(value).replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
const maskPhone = (value: string) => onlyDigits(value).replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2").slice(0, 15);
const clean = (value: string) => String(value || "").replace(/[<>&"']/g, "").trim();

const Icon = memo(({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className={cls("shrink-0", className)} aria-hidden="true">
    <path d={ICONS[name] || ICONS.sparkles} />
  </svg>
));

const GlobalStyles = memo(({ dark }: { dark: boolean }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    :root {
      color-scheme: ${dark ? "dark" : "light"};
      --bg: ${dark ? "#181512" : "#FCFAF7"};
      --surface: ${dark ? "#231F1B" : "#FFFFFF"};
      --surface-2: ${dark ? "#2D2823" : "#F5EFE8"};
      --text: ${dark ? "#F8F2EA" : "#2B2520"};
      --muted: ${dark ? "#B9AEA3" : "#756B61"};
      --line: ${dark ? "rgba(255,255,255,.09)" : "rgba(43,37,32,.11)"};
      --soft: ${dark ? "rgba(255,255,255,.055)" : "rgba(43,37,32,.045)"};
      --primary: #10B981;
      --page: clamp(16px, 4vw, 56px);
      --radius: clamp(22px, 4vw, 34px);
      --h1: clamp(2.3rem, 8vw, 6.6rem);
      --h2: clamp(1.55rem, 4vw, 3rem);
      --h3: clamp(1.2rem, 3vw, 1.65rem);
      --bottom: 112px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { margin: 0; min-width: 320px; overflow-x: hidden; background: var(--bg); color: var(--text); font-family: 'Poppins', system-ui, sans-serif; -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
    button, input { font: inherit; }
    input { font-size: 16px !important; }
    button { -webkit-tap-highlight-color: transparent; }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .focus:focus-visible { outline: 3px solid rgba(16,185,129,.35); outline-offset: 3px; }
    .safe-bottom { padding-bottom: max(14px, env(safe-area-inset-bottom)); }
    .page-bg { background: radial-gradient(circle at 15% 0%, rgba(16,185,129,.16), transparent 30rem), radial-gradient(circle at 90% 15%, rgba(234,179,8,.10), transparent 28rem), var(--bg); }
    @media (min-width: 1100px) { :root { --bottom: 0px; } }
  `}</style>
));

const Button = memo(({ children, onClick, variant = "primary", className = "", disabled = false, icon }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "ghost" | "whatsapp"; className?: string; disabled?: boolean; icon?: string }) => {
  const variants = {
    primary: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-[0_16px_36px_rgba(16,185,129,.24)]",
    secondary: "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] hover:border-emerald-500/35",
    ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--soft)]",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20be5c] shadow-[0_16px_36px_rgba(37,211,102,.22)]",
  };
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls("focus inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45", variants[variant], className)}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
});

const SectionHeader = memo(({ eyebrow, title, desc }: { eyebrow: string; title: string; desc: string }) => (
  <div className="mb-5 scroll-mt-28 sm:mb-7">
    <span className="mb-3 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-500">{eyebrow}</span>
    <h2 className="max-w-4xl text-[length:var(--h2)] font-bold leading-[1.02] tracking-[-.06em] text-[var(--text)]">{title}</h2>
    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">{desc}</p>
  </div>
));

const Field = memo(({ label, value, onChange, placeholder, icon, inputMode }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; icon?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] }) => (
  <label className="block min-w-0">
    <span className="mb-2 block text-xs font-bold uppercase tracking-[.14em] text-[var(--muted)]">{label}</span>
    <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 transition focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/10">
      {icon && <Icon name={icon} size={18} className="text-emerald-500" />}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} inputMode={inputMode} className="min-w-0 flex-1 bg-transparent text-base text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none" />
    </span>
  </label>
));

function ToastLayer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-4 z-[100] mx-auto flex w-full max-w-md flex-col gap-2 px-4">
      {toasts.map((toast) => (
        <div key={toast.id} className={cls("pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur", toast.type === "error" ? "border-rose-500/25 bg-rose-950/90 text-rose-50" : "border-emerald-500/25 bg-[var(--surface)] text-[var(--text)]")}>
          <span className={cls("flex h-8 w-8 items-center justify-center rounded-full", toast.type === "error" ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-500")}>
            <Icon name={toast.type === "error" ? "x" : "check"} size={15} />
          </span>
          {toast.message}
        </div>
      ))}
    </div>
  );
}

function Header({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[70px] max-w-screen-2xl items-center justify-between gap-3 px-[var(--page)]">
        <a href="#top" className="focus flex min-w-0 items-center gap-3 rounded-2xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/20">T</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight">Thaly Massagens</span>
            <span className="block truncate text-xs text-[var(--muted)]">acolhimento, cuidado e agendamento rápido</span>
          </span>
        </a>
        <nav className="hidden items-center gap-1 lg:flex">
          {["sessões", "planos", "agenda", "local", "confirmar"].map((item) => (
            <a key={item} href={`#${item}`} className="focus rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)] transition hover:bg-[var(--soft)] hover:text-[var(--text)]">{item}</a>
          ))}
        </nav>
        <button onClick={() => setDark(!dark)} className="focus flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] transition hover:border-emerald-500/35" aria-label="Alternar tema">
          <Icon name={dark ? "sun" : "moon"} size={18} />
        </button>
      </div>
    </header>
  );
}

function Hero({ selectedTitle, scrollToBooking }: { selectedTitle: string; scrollToBooking: () => void }) {
  return (
    <section id="top" className="grid gap-6 py-7 sm:py-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,.9fr)] lg:items-end lg:gap-10">
      <div>
        <span className="mb-4 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-500">fluxo vertical, simples e direto</span>
        <h1 className="max-w-5xl text-[length:var(--h1)] font-bold leading-[.9] tracking-[-.075em] text-[var(--text)]">Seu corpo pede pausa. O agendamento não precisa ser complicado.</h1>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-[var(--muted)] sm:text-base">Desça a página, entenda cada sessão com clareza, escolha o cuidado que combina com você e finalize pelo WhatsApp. Sem telas confusas, sem excesso visual, sem fazer você pensar demais.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => document.getElementById("sessões")?.scrollIntoView({ behavior: "smooth" })} icon="arrow">Ver sessões</Button>
          <Button variant="secondary" onClick={scrollToBooking} icon="calendar">Ir para agendamento</Button>
        </div>
      </div>
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_24px_80px_rgba(0,0,0,.10)] sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {CONFIG.PHOTO_PLACEHOLDERS.map((text, index) => (
            <div key={text} className="flex min-h-[130px] flex-col justify-end rounded-[28px] border border-[var(--line)] bg-[linear-gradient(145deg,rgba(16,185,129,.18),rgba(234,179,8,.08)),var(--surface-2)] p-4">
              <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/12 text-emerald-400"><Icon name={index === 0 ? "home" : index === 1 ? "sparkles" : "shield"} size={17} /></span>
              <span className="text-sm font-bold leading-tight">{text}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-[28px] bg-[var(--soft)] p-4">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Selecionado agora</p>
          <p className="mt-2 text-lg font-bold tracking-[-.03em]">{selectedTitle || "Nenhuma sessão escolhida ainda"}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--muted)]">O resumo acompanha você no final da tela para não perder o ritmo do agendamento.</p>
        </div>
      </div>
    </section>
  );
}

function CategoryPills({ active, setActive }: { active: Category | "all"; setActive: (value: Category | "all") => void }) {
  const items: Array<{ id: Category | "all"; label: string; icon: string }> = [
    { id: "all", label: "Todas", icon: "star" },
    { id: "express", label: "Rápidas", icon: "clock" },
    { id: "relax", label: "Dor e estresse", icon: "sun" },
    { id: "sensorial", label: "Sensorial", icon: "sparkles" },
    { id: "care", label: "Cuidado", icon: "scissors" },
  ];
  return (
    <div className="hide-scroll -mx-[var(--page)] mb-5 flex gap-2 overflow-x-auto px-[var(--page)] sm:mx-0 sm:flex-wrap sm:px-0">
      {items.map((item) => (
        <button key={item.id} onClick={() => setActive(item.id)} className={cls("focus inline-flex min-w-fit items-center gap-2 rounded-full border px-4 py-3 text-sm font-bold transition", active === item.id ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-emerald-500/35") }>
          <Icon name={item.icon} size={17} />
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ServiceCard({ item, selected, onSelect }: { item: ServiceItem; selected: boolean; onSelect: () => void }) {
  return (
    <article className={cls("rounded-[var(--radius)] border bg-[var(--surface)] p-4 transition sm:p-5 lg:p-6", selected ? "border-emerald-500 shadow-[0_24px_70px_rgba(16,185,129,.16)]" : "border-[var(--line)] hover:border-emerald-500/35") }>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,.82fr)_minmax(360px,1fr)] xl:items-start">
        <div className="min-w-0">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className={cls("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", selected ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500")}><Icon name={item.icon} size={21} /></span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-[.16em] text-emerald-500">{item.tag}</p>
                <h3 className="mt-1 text-[length:var(--h3)] font-bold leading-tight tracking-[-.04em]">{item.title}</h3>
              </div>
            </div>
            {item.popular && <span className="rounded-full bg-amber-500/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[.12em] text-amber-500">Mais pedida</span>}
          </div>
          <p className="text-base font-semibold leading-7 text-[var(--text)]">{item.subtitle}</p>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{item.short}</p>
          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <div className="rounded-2xl bg-[var(--soft)] p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Valor</p><p className="mt-1 text-lg font-bold">{formatMoney(item.price)}</p></div>
            <div className="rounded-2xl bg-[var(--soft)] p-3"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Tempo</p><p className="mt-1 text-lg font-bold">{item.duration} min</p></div>
            <div className="col-span-2 rounded-2xl bg-[var(--soft)] p-3 sm:col-span-1"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Foco</p><p className="mt-1 text-sm font-bold">{item.bestFor[0]}</p></div>
          </div>
          <Button onClick={onSelect} className="mt-5 w-full sm:w-auto" variant={selected ? "secondary" : "primary"} icon={selected ? "check" : "arrow"}>{selected ? "Sessão escolhida" : "Escolher essa sessão"}</Button>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] bg-[var(--soft)] p-4 sm:p-5">
            <p className="mb-4 text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">O que acontece na sessão</p>
            <div className="space-y-4">
              {item.sessionFlow.map((step, index) => (
                <div key={step} className="grid grid-cols-[32px_minmax(0,1fr)] gap-3 text-sm leading-7">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">{index + 1}</span>
                  <p className="text-[var(--text)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[.8fr_1fr]">
            <div className="rounded-[24px] border border-[var(--line)] p-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Indicado para</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.bestFor.map((tag) => <span key={tag} className="rounded-full bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-500">{tag}</span>)}
              </div>
            </div>
            <div className="rounded-[24px] border border-[var(--line)] p-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Resultado esperado</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text)]">{item.result}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function PlanCard({ item, selected, onSelect }: { item: PlanItem; selected: boolean; onSelect: () => void }) {
  return (
    <article className={cls("rounded-[var(--radius)] border bg-[var(--surface)] p-4 transition sm:p-5", selected ? "border-emerald-500 shadow-[0_20px_60px_rgba(16,185,129,.15)]" : "border-[var(--line)] hover:border-emerald-500/35") }>
      <div className="mb-4 flex items-start gap-3">
        <span className={cls("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", selected ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500")}><Icon name={item.icon} size={20} /></span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-emerald-500">{item.tag}</p>
          <h3 className="mt-1 text-lg font-bold tracking-[-.04em]">{item.title}</h3>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.short}</p>
        </div>
      </div>
      <div className="rounded-[24px] bg-[var(--soft)] p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Inclui</p>
        <div className="space-y-2">
          {item.includes.map((line) => <p key={line} className="flex gap-2 text-sm leading-6"><Icon name="check" size={15} className="mt-1 text-emerald-500" />{line}</p>)}
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-[var(--text)]">{item.result}</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
        <div>
          <p className="text-xs text-[var(--muted)] line-through">{formatMoney(item.fullPrice)}</p>
          <p className="text-2xl font-bold tracking-[-.05em]">{formatMoney(item.price)}</p>
          <p className="text-xs font-semibold text-emerald-500">economiza {formatMoney(item.savings)}</p>
        </div>
        <Button onClick={onSelect} variant={selected ? "secondary" : "primary"}>{selected ? "Plano escolhido" : "Escolher plano"}</Button>
      </div>
    </article>
  );
}

function ExtraCard({ item, active, onToggle }: { item: ExtraItem; active: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={cls("focus flex min-w-0 items-start gap-3 rounded-[26px] border bg-[var(--surface)] p-4 text-left transition", active ? "border-emerald-500 shadow-[0_14px_40px_rgba(16,185,129,.13)]" : "border-[var(--line)] hover:border-emerald-500/35") }>
      <span className={cls("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", active ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500")}><Icon name={item.icon} size={18} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{item.title}</span>
        <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{item.desc}</span>
        <span className="mt-2 block text-sm font-bold text-emerald-500">+ {formatMoney(item.price)}</span>
      </span>
      {active && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><Icon name="check" size={13} /></span>}
    </button>
  );
}

function DateTimePicker({ booking, setBooking }: { booking: Booking; setBooking: React.Dispatch<React.SetStateAction<Booking>> }) {
  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    const label = index === 0 ? "Hoje" : index === 1 ? "Amanhã" : date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).replace(".", "");
    return { iso, label };
  }), []);

  const times = useMemo(() => {
    const result: string[] = [];
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour++) result.push(`${String(hour).padStart(2, "0")}:00`);
    return result;
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[.78fr_1fr]">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <h3 className="text-xl font-bold tracking-[-.04em]">Escolha o dia</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Mostro 14 dias para o agendamento ficar rápido, sem calendário pesado.</p>
        <div className="hide-scroll mt-5 flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible">
          {days.map((day) => (
            <button key={day.iso} onClick={() => setBooking((current) => ({ ...current, date: day.iso }))} className={cls("focus min-w-[116px] rounded-2xl border px-4 py-4 text-left text-sm font-bold transition", booking.date === day.iso ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-emerald-500/35")}>{day.label}</button>
          ))}
        </div>
      </div>
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <h3 className="text-xl font-bold tracking-[-.04em]">Escolha o horário</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Horários de pico adicionam {formatMoney(CONFIG.RUSH_FEE)} quando houver deslocamento.</p>
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {times.map((time) => {
            const rush = CONFIG.RUSH_HOURS.includes(time as typeof CONFIG.RUSH_HOURS[number]);
            return (
              <button key={time} onClick={() => setBooking((current) => ({ ...current, time }))} className={cls("focus min-h-[62px] rounded-2xl border px-2 py-2 text-center transition", booking.time === time ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-emerald-500/35") }>
                <span className="block text-sm font-bold">{time}</span>
                {rush && <span className={cls("mt-1 block text-[10px] font-bold", booking.time === time ? "text-white/75" : "text-amber-500")}>pico</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function LocationForm({ booking, setBooking, toast }: { booking: Booking; setBooking: React.Dispatch<React.SetStateAction<Booking>>; toast: (message: string, type?: "success" | "error") => void }) {
  const updateAddress = (patch: Partial<Address>) => setBooking((current) => ({ ...current, address: { ...current.address, ...patch } }));
  const searchCep = async (value: string) => {
    const cep = onlyDigits(value);
    updateAddress({ cep: maskCep(value) });
    if (cep.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data?.erro) throw new Error("not-found");
      updateAddress({ cep: maskCep(cep), street: data.logradouro || "", district: data.bairro || "", city: data.localidade || "" });
      toast("Endereço preenchido pelo CEP.");
    } catch {
      toast("Não encontrei esse CEP. Preencha manualmente.", "error");
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[.75fr_1fr]">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <h3 className="text-xl font-bold tracking-[-.04em]">Seus dados</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">O básico para eu saber com quem estou falando e confirmar pelo WhatsApp.</p>
        <div className="mt-5 grid gap-4">
          <Field label="Nome ou apelido" value={booking.name} onChange={(value) => setBooking((current) => ({ ...current, name: value }))} placeholder="Ex: João" icon="user" />
          <Field label="WhatsApp opcional" value={booking.phone} onChange={(value) => setBooking((current) => ({ ...current, phone: maskPhone(value) }))} placeholder="(17) 99999-9999" icon="phone" inputMode="tel" />
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <h3 className="text-xl font-bold tracking-[-.04em]">Onde será a sessão?</h3>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Escolha uma opção. Se tiver deslocamento, a taxa de Uber é confirmada no WhatsApp.</p>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {[
            { id: "home", label: "Residência", icon: "home" },
            { id: "hotel", label: "Hotel", icon: "hotel" },
            { id: "suite", label: "Minha suíte", icon: "bed" },
          ].map((item) => (
            <button key={item.id} onClick={() => setBooking((current) => ({ ...current, locationType: item.id as LocationType }))} className={cls("focus flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-bold transition", booking.locationType === item.id ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-emerald-500/35") }>
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </div>
        {booking.locationType === "suite" ? (
          <div className="mt-5 rounded-[28px] bg-emerald-500/10 p-4 text-sm leading-7 text-[var(--text)]"><strong className="text-emerald-500">Certo.</strong> Ao finalizar, eu envio o endereço da suíte no WhatsApp e confirmamos os detalhes.</div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {booking.locationType === "hotel" && <div className="sm:col-span-2"><Field label="Nome do hotel" value={booking.address.hotelName} onChange={(value) => updateAddress({ hotelName: value })} placeholder="Ex: Hotel Portal" icon="hotel" /></div>}
            <Field label="CEP" value={booking.address.cep} onChange={searchCep} placeholder="00000-000" icon="pin" inputMode="numeric" />
            <Field label={booking.locationType === "hotel" ? "Quarto / suíte" : "Número"} value={booking.address.number} onChange={(value) => updateAddress({ number: value })} placeholder={booking.locationType === "hotel" ? "Ex: 302" : "Ex: 125"} icon="home" />
            <div className="sm:col-span-2"><Field label="Rua ou avenida" value={booking.address.street} onChange={(value) => updateAddress({ street: value })} placeholder="Endereço completo" icon="pin" /></div>
            <Field label="Bairro" value={booking.address.district} onChange={(value) => updateAddress({ district: value })} placeholder="Bairro" icon="pin" />
            <Field label="Cidade" value={booking.address.city} onChange={(value) => updateAddress({ city: value })} placeholder="Cidade" icon="pin" />
            <div className="sm:col-span-2"><Field label="Complemento opcional" value={booking.address.comp} onChange={(value) => updateAddress({ comp: value })} placeholder="Apto, bloco, referência..." icon="pin" /></div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryBox({ mainTitle, total, base, extrasTotal, rushFee, discount, date, time }: { mainTitle: string; total: number; base: number; extrasTotal: number; rushFee: number; discount: number; date: string; time: string }) {
  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Resumo do pedido</p>
      <h3 className="mt-2 text-3xl font-bold tracking-[-.06em]">{formatMoney(total)}</h3>
      <div className="mt-5 space-y-3 text-sm">
        <Line label="Escolha" value={mainTitle || "Não escolhido"} />
        <Line label="Data" value={date && time ? `${new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR")} às ${time}` : "Não escolhida"} />
        <Line label="Serviço/plano" value={formatMoney(base)} />
        {extrasTotal > 0 && <Line label="Complementos" value={`+ ${formatMoney(extrasTotal)}`} />}
        {rushFee > 0 && <Line label="Horário de pico" value={`+ ${formatMoney(rushFee)}`} />}
        {discount > 0 && <Line label="Descontos" value={`- ${formatMoney(discount)}`} good />}
      </div>
    </div>
  );
}

function Line({ label, value, good = false }: { label: string; value: string; good?: boolean }) {
  return <div className="flex items-start justify-between gap-4"><span className="text-[var(--muted)]">{label}</span><strong className={cls("max-w-[210px] text-right", good ? "text-emerald-500" : "text-[var(--text)]")}>{value}</strong></div>;
}

function BottomBar({ total, mainTitle, onFinish, onScrollBooking }: { total: number; mainTitle: string; onFinish: () => void; onScrollBooking: () => void }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-3 shadow-[0_-18px_52px_rgba(0,0,0,.2)] backdrop-blur-xl safe-bottom lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[minmax(0,1fr)_minmax(130px,.8fr)] gap-2">
        <button onClick={onScrollBooking} className="focus min-w-0 rounded-2xl bg-[var(--soft)] px-3 py-2 text-left">
          <p className="truncate text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">{mainTitle || "Escolha uma sessão"}</p>
          <p className="truncate text-lg font-bold tracking-[-.04em]">{formatMoney(total)}</p>
        </button>
        <Button variant="whatsapp" onClick={onFinish} className="h-full px-3" icon="message">Finalizar</Button>
      </div>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [booking, setBooking] = useState<Booking>(emptyBooking);
  const [category, setCategory] = useState<Category | "all">("all");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (saved) setBooking({ ...emptyBooking, ...JSON.parse(saved) });
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(booking)); } catch {}
  }, [booking]);

  const toast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((current) => [...current.slice(-2), { id, type, message }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3400);
  }, []);

  const selectedService = SERVICES.find((item) => item.id === booking.serviceId) || null;
  const selectedPlan = PLANS.find((item) => item.id === booking.planId) || null;
  const selectedExtras = EXTRAS.filter((item) => booking.extras[item.id]);
  const mainTitle = selectedPlan?.title || selectedService?.title || "";
  const mainPrice = selectedPlan?.price || selectedService?.price || 0;
  const mainDuration = selectedService?.duration || (selectedPlan ? 120 : 0);
  const extrasTotal = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const rushFee = booking.time && CONFIG.RUSH_HOURS.includes(booking.time as typeof CONFIG.RUSH_HOURS[number]) && booking.locationType !== "suite" ? CONFIG.RUSH_FEE : 0;
  const subtotal = mainPrice + extrasTotal + rushFee;
  const discount = (booking.payment === "pix" ? subtotal * 0.03 : 0) + (booking.portfolioAuth ? subtotal * 0.01 : 0);
  const total = Math.max(0, subtotal - discount);

  const visibleServices = category === "all" ? SERVICES : SERVICES.filter((item) => item.category === category);

  const validate = () => {
    if (!selectedService && !selectedPlan) return toast("Escolha uma sessão ou plano antes de finalizar.", "error"), false;
    if (!booking.date || !booking.time) return toast("Escolha dia e horário.", "error"), false;
    if (!clean(booking.name)) return toast("Preencha seu nome ou apelido.", "error"), false;
    if (booking.locationType === "home" && (!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city)) return toast("Preencha o endereço completo.", "error"), false;
    if (booking.locationType === "hotel" && (!booking.address.hotelName || !booking.address.number)) return toast("Preencha o nome do hotel e quarto/suíte.", "error"), false;
    if (!booking.payment) return toast("Escolha a forma de pagamento.", "error"), false;
    if (!booking.terms) return toast("Aceite as regras para confirmar.", "error"), false;
    return true;
  };

  const buildMessage = () => {
    const address = booking.address;
    const location = booking.locationType === "suite"
      ? "Minha suíte — endereço enviado após confirmação"
      : booking.locationType === "hotel"
        ? `${clean(address.hotelName)}, quarto/suíte ${clean(address.number)}`
        : `${clean(address.street)}, ${clean(address.number)} - ${clean(address.district)}, ${clean(address.city)}${address.comp ? ` (${clean(address.comp)})` : ""}`;

    const extras = selectedExtras.length ? selectedExtras.map((item) => `• ${item.title} (+${formatMoney(item.price)})`).join("\n") : "Nenhum complemento";
    const date = booking.date ? new Date(`${booking.date}T12:00:00`).toLocaleDateString("pt-BR") : "Não informado";

    return `*AGENDAMENTO THALY MASSAGENS*\n\nOlá, Thalyson. Quero confirmar meu atendimento.\n\n👤 *Nome:* ${clean(booking.name)}\n📱 *WhatsApp:* ${booking.phone || "não informado"}\n💆‍♂️ *Escolha:* ${mainTitle}\n📅 *Data:* ${date} às ${booking.time}\n⏱️ *Duração estimada:* ${mainDuration + (booking.extras.more_time ? 30 : 0)} min\n📍 *Local:* ${location}\n\n➕ *Complementos:*\n${extras}\n\n💳 *Pagamento:* ${booking.payment === "pix" ? "Pix" : booking.payment === "card" ? "Cartão" : "Dinheiro"}\n💰 *Total estimado:* ${formatMoney(total)}\n\nConfirmo que li as regras de higiene, saúde, respeito e limites combinados.\nAguardo sua confirmação.`;
  };

  const finish = () => {
    if (!validate()) return;
    const message = buildMessage();
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const scrollToBooking = () => document.getElementById("agenda")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="page-bg min-h-[100dvh] bg-[var(--bg)] pb-[calc(var(--bottom)+32px)] text-[var(--text)] lg:pb-0">
      <GlobalStyles dark={dark} />
      <ToastLayer toasts={toasts} />
      <Header dark={dark} setDark={setDark} />

      <main className="mx-auto w-full max-w-screen-2xl px-[var(--page)]">
        <Hero selectedTitle={mainTitle} scrollToBooking={scrollToBooking} />

        <section className="py-8 sm:py-12" id="sessões">
          <SectionHeader eyebrow="01 · escolha pela sua necessidade" title="Sessões com explicação completa, sem deixar você perdido." desc="Cada card mostra para quem é, o que acontece durante a sessão e o resultado esperado. A ideia é você entender rápido, mas com segurança." />
          <CategoryPills active={category} setActive={setCategory} />
          <div className="grid gap-5">
            {visibleServices.map((item) => (
              <ServiceCard key={item.id} item={item} selected={booking.serviceId === item.id} onSelect={() => {
                setBooking((current) => ({ ...current, serviceId: item.id, planId: "" }));
                toast(`${item.title} selecionada.`);
              }} />
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12" id="planos">
          <SectionHeader eyebrow="02 · planos mensais" title="Se você quer resolver o mês, escolha um plano." desc="Os planos aparecem depois das sessões para não confundir. Eles são ideais quando você já sabe que quer mais de um encontro." />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map((item) => (
              <PlanCard key={item.id} item={item} selected={booking.planId === item.id} onSelect={() => {
                setBooking((current) => ({ ...current, planId: item.id, serviceId: "" }));
                toast(`${item.title} selecionado.`);
              }} />
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12" id="agenda">
          <SectionHeader eyebrow="03 · dia e horário" title="Agora escolha quando você quer ser atendido." desc="Depois da escolha, o usuário só precisa marcar dia e horário. Nada de calendário pesado ou campos demais antes da decisão." />
          <DateTimePicker booking={booking} setBooking={setBooking} />
        </section>

        <section className="py-8 sm:py-12" id="local">
          <SectionHeader eyebrow="04 · seus dados e local" title="Dados mínimos para confirmar sem atrito." desc="A experiência precisa ser acolhedora, mas o agendamento precisa ser prático. Por isso só entram os campos necessários." />
          <LocationForm booking={booking} setBooking={setBooking} toast={toast} />
        </section>

        <section className="py-8 sm:py-12" id="complementos">
          <SectionHeader eyebrow="05 · complementos opcionais" title="Adicione apenas se fizer sentido para você." desc="Os complementos ficam depois da escolha principal para não sobrecarregar. Eles aumentam a personalização, mas não travam o fluxo." />
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {EXTRAS.map((item) => (
              <ExtraCard key={item.id} item={item} active={!!booking.extras[item.id]} onToggle={() => setBooking((current) => ({ ...current, extras: { ...current.extras, [item.id]: !current.extras[item.id] } }))} />
            ))}
          </div>
        </section>

        <section className="py-8 sm:py-12" id="confirmar">
          <SectionHeader eyebrow="06 · confirmação" title="Revise, escolha o pagamento e envie para o WhatsApp." desc="A etapa final resume tudo em uma mensagem pronta. O WhatsApp confirma disponibilidade, deslocamento e detalhes finais." />
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="grid gap-5">
              <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
                <h3 className="text-xl font-bold tracking-[-.04em]">Forma de pagamento</h3>
                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {[
                    { id: "pix", label: "Pix", desc: "3% de desconto", icon: "money" },
                    { id: "card", label: "Cartão", desc: "Crédito/débito", icon: "card" },
                    { id: "cash", label: "Dinheiro", desc: "No local", icon: "money" },
                  ].map((item) => (
                    <button key={item.id} onClick={() => setBooking((current) => ({ ...current, payment: item.id as PaymentMethod }))} className={cls("focus rounded-2xl border p-4 text-left transition", booking.payment === item.id ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface-2)] hover:border-emerald-500/35") }>
                      <Icon name={item.icon} size={18} />
                      <span className="mt-3 block text-sm font-bold">{item.label}</span>
                      <span className={cls("mt-1 block text-xs", booking.payment === item.id ? "text-white/75" : "text-[var(--muted)]")}>{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <label className="flex cursor-pointer gap-3 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-7">
                  <input type="checkbox" checked={booking.portfolioAuth} onChange={(e) => setBooking((current) => ({ ...current, portfolioAuth: e.target.checked }))} className="mt-1 h-4 w-4 accent-emerald-500" />
                  <span><strong>Desconto portfólio (1%).</strong> Autorizo fotos anônimas e estéticas, sem rosto e sem intimidade, apenas se combinado antes.</span>
                </label>
                <label className="flex cursor-pointer gap-3 rounded-[26px] border border-[var(--line)] bg-[var(--surface)] p-4 text-sm leading-7">
                  <input type="checkbox" checked={booking.terms} onChange={(e) => setBooking((current) => ({ ...current, terms: e.target.checked }))} className="mt-1 h-4 w-4 accent-emerald-500" />
                  <span>Li e aceito as regras de higiene, saúde, respeito, discrição e limites combinados.</span>
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
                  <h3 className="mb-4 text-xl font-bold tracking-[-.04em]">Regras simples</h3>
                  <div className="space-y-4">
                    {RULES.map((item) => (
                      <div key={item.title} className="flex gap-3">
                        <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"><Icon name={item.icon} size={17} /></span>
                        <p className="text-sm leading-6"><strong className="block text-[var(--text)]">{item.title}</strong><span className="text-[var(--muted)]">{item.desc}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
                  <h3 className="mb-4 text-xl font-bold tracking-[-.04em]">Dúvidas frequentes</h3>
                  <div className="space-y-4">
                    {FAQS.map((item) => (
                      <div key={item.q} className="text-sm leading-6"><strong className="block text-[var(--text)]">{item.q}</strong><span className="text-[var(--muted)]">{item.a}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-24 grid gap-4">
              <SummaryBox mainTitle={mainTitle} total={total} base={mainPrice} extrasTotal={extrasTotal} rushFee={rushFee} discount={discount} date={booking.date} time={booking.time} />
              <Button variant="whatsapp" onClick={finish} icon="message" className="hidden w-full lg:inline-flex">Enviar pedido no WhatsApp</Button>
              {sent && <div className="rounded-[26px] border border-emerald-500/25 bg-emerald-500/10 p-4 text-sm font-semibold leading-7 text-emerald-500">Pedido montado. Se o WhatsApp não abriu, toque novamente em finalizar.</div>}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <SectionHeader eyebrow="prova social" title="Quem já se permitiu relaxar." desc="Depoimentos ficam no fim para gerar confiança sem atrapalhar a decisão principal." />
          <div className="hide-scroll -mx-[var(--page)] flex gap-3 overflow-x-auto px-[var(--page)] pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
            {REVIEWS.map((review) => (
              <article key={`${review.name}-${review.service}`} className="min-w-[280px] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:min-w-0">
                <div className="mb-3 flex text-amber-500">{Array.from({ length: 5 }).map((_, index) => <Icon key={index} name="star" size={14} />)}</div>
                <p className="text-sm leading-7 text-[var(--text)]">“{review.text}”</p>
                <p className="mt-4 text-sm font-bold">{review.name}</p>
                <p className="text-xs text-[var(--muted)]">{review.location} · {review.service}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <BottomBar total={total} mainTitle={mainTitle} onFinish={finish} onScrollBooking={scrollToBooking} />
    </div>
  );
}
