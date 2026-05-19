import React, { memo, useCallback, useEffect, useMemo, useState } from "react";

// ==================================================================================
// THALY MASSAGENS — APP COMPLETO REESTRUTURADO
// Mobile first | Responsivo real | Fluxo curto | Conteúdo preservado e organizado
// ==================================================================================

type LocationType = "home" | "hotel" | "motel";
type PaymentMethod = "" | "pix" | "card" | "cash";
type BookingMode = "single" | "pack";
type Category = "express" | "relax" | "final" | "care";

interface ServiceItem {
  id: string;
  category?: Category;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details: string;
  fullPrice?: number;
  savings?: number;
  type?: "single" | "pack";
  popular?: boolean;
}

interface ExtraItem {
  id: string;
  price: number;
  icon: string;
  label: string;
  desc: string;
}

interface Address {
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  comp: string;
  placeName: string;
}

interface BookingData {
  mode: BookingMode;
  service: ServiceItem | null;
  plan: ServiceItem | null;
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: LocationType;
  address: Address;
  payment: PaymentMethod;
  termsAccepted: boolean;
  mediaAllowed: boolean;
  bookingId: string;
}

interface UserData {
  name: string;
  xp: number;
  hasSeenWelcome: boolean;
  ordersCount: number;
}

interface Review {
  n: string;
  loc: string;
  t: string;
  serv: string;
  s: number;
}

interface Rule {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  q: string;
  a: string;
}

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: "@thaly_app_responsive_v1",
  PIX_KEY: "62.922.530/0001-14",
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_HOURS: ["12:00", "13:00", "17:00", "18:00"],
  RUSH_FEE: 15,
  // Troque por fotos reais quando publicar: /images/thalyson-01.jpg, etc.
  PHOTOS: [] as string[],
} as const;

const ICON_PATHS: Record<string, string> = {
  menu: "M4 12h16 M4 6h16 M4 18h16",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "chevron-down": "M6 9l6 6 6-6",
  sun: "M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  package: "M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "user-check": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  bed: "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
  building: "M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01",
  "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  watch: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  "credit-card": "M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  banknote: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shower: "M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16",
  hand: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  scissors: "M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01",
  ticket: "M15 5v2 M15 11v2 M15 17v2 M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z",
  send: "M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z",
  plus: "M12 5v14 M5 12h14",
  trash: "M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2",
};

const prices = {
  depil: 107,
  relax: 157,
  sens: 177,
  naturista: 197,
  titan: 207,
  reversa: 260,
  nuru: 317,
  crossfit: 187,
  pes: 110,
  maos: 110,
  pack_basic: { v: 247, full: 284, save: 37 },
  pack1: { v: 297, full: 334, save: 37 },
  pack_glow: { v: 327, full: 391, save: 64 },
  pack_muscle: { v: 347, full: 408, save: 61 },
  pack2: { v: 387, full: 467, save: 80 },
  pack3: { v: 637, full: 721, save: 84 },
  pack_ultimate: { v: 657, full: 778, save: 121 },
};

const SERVICES: ServiceItem[] = [
  {
    id: "pes",
    category: "express",
    min: 40,
    price: prices.pes,
    icon: "user-check",
    tag: "ALÍVIO NOS PÉS",
    title: "Massagem nos Pés",
    desc: "Alívio direto para pés cansados depois de um dia longo.",
    details: "1. Reflexologia focada na sola dos pés.\n2. Pressão em pontos de tensão.\n3. Liberação para você pisar mais leve.",
  },
  {
    id: "maos",
    category: "express",
    min: 40,
    price: prices.maos,
    icon: "hand",
    tag: "ALÍVIO NAS MÃOS",
    title: "Massagem nas Mãos",
    desc: "Para quem digita muito, trabalha com as mãos ou sente rigidez.",
    details: "1. Alongamento das articulações.\n2. Massagem profunda na palma.\n3. Alívio nos punhos e antebraços.",
  },
  {
    id: "relaxante",
    category: "relax",
    min: 40,
    price: prices.relax,
    icon: "sun",
    tag: "ALÍVIO MUSCULAR",
    title: "Massagem Clássica",
    desc: "Para costas travadas, corpo rígido e mente cansada.",
    details: "1. Rolos e manobras para soltar nós musculares.\n2. Pressão manual confortável.\n3. Foco em relaxamento, sono e bem-estar.",
  },
  {
    id: "naturista",
    category: "relax",
    min: 40,
    price: prices.naturista,
    icon: "sparkles",
    tag: "LIBERDADE CORPORAL",
    title: "Clássica Naturista",
    desc: "Uma sessão com menos barreiras, mais presença e muito respeito.",
    details: "1. Ambiente reservado e acolhedor.\n2. Massagem corporal completa.\n3. Limites combinados antes da sessão, sem pressa e sem julgamento.",
  },
  {
    id: "crossfit",
    category: "relax",
    min: 60,
    price: prices.crossfit,
    icon: "zap",
    tag: "RECUPERAÇÃO",
    title: "Massagem para Atletas",
    desc: "Pegada firme para quem treina pesado e precisa recuperar o corpo.",
    details: "1. Fricção para aquecer músculos cansados.\n2. Liberação miofascial em pernas, costas e ombros.\n3. Pomadas e alongamentos quando fizer sentido.",
  },
  {
    id: "sensitiva",
    category: "final",
    min: 60,
    price: prices.sens,
    icon: "sparkles",
    tag: "TIRA A ANSIEDADE",
    title: "Massagem Sensorial",
    desc: "Toques suaves, respiração e presença para desligar a mente acelerada.",
    details: "1. Começa com relaxamento corporal.\n2. Evolui para estímulos leves e sensoriais.\n3. Finalização focada em aliviar tensão e ansiedade, sempre respeitando limites.",
  },
  {
    id: "mista",
    category: "final",
    min: 60,
    price: prices.titan,
    icon: "layers",
    tag: "O MELHOR DOS 2",
    title: "Experiência Fusion",
    desc: "Primeiro alívio físico, depois uma experiência sensorial mais envolvente.",
    details: "1. Início com massagem clássica para destravar o corpo.\n2. Mudança gradual de ritmo.\n3. Experiência completa de relaxamento e conexão, combinada com respeito.",
  },
  {
    id: "reversa",
    category: "final",
    min: 60,
    price: prices.reversa,
    icon: "heart",
    tag: "CONTATO REAL",
    title: "Massagem Reversa",
    desc: "Uma troca guiada para quem sente falta de contato humano e acolhimento.",
    details: "1. Eu começo cuidando de você.\n2. Depois a experiência fica mais interativa.\n3. Tudo acontece com comunicação, consentimento e limites claros.",
  },
  {
    id: "nuru",
    category: "final",
    min: 60,
    price: prices.nuru,
    icon: "star",
    tag: "ENTREGA TOTAL",
    title: "Massagem Nuru",
    desc: "Gel, deslizamento e sensação de entrega para relaxar profundamente.",
    details: "1. Preparação do corpo e do ambiente.\n2. Uso de gel para manobras deslizantes.\n3. Experiência intensa, acolhedora e sempre acordada antes.",
    popular: true,
  },
  {
    id: "depilacao",
    category: "care",
    min: 60,
    price: prices.depil,
    icon: "scissors",
    tag: "ESTÉTICA",
    title: "Aparo de Pelos do Corpo",
    desc: "Para você se sentir mais limpo, leve e confortável na semana.",
    details: "1. Aparo com máquina profissional.\n2. Foco nas regiões escolhidas.\n3. Resultado limpo, prático e sem clima de salão.",
  },
];

const PLANS: ServiceItem[] = [
  {
    id: "pack_basic",
    type: "pack",
    min: 80,
    title: "Alívio de Rotina (2x)",
    price: prices.pack_basic.v,
    fullPrice: prices.pack_basic.full,
    savings: prices.pack_basic.save,
    desc: "Para quem trabalha em pé ou digitando. Duas sessões simples de alívio.",
    details: "1x Massagem nos Pés\n1x Massagem Clássica\nBônus: aromaterapia nas sessões.",
    tag: "RELAX",
    icon: "watch",
  },
  {
    id: "pack_essencial",
    type: "pack",
    min: 100,
    title: "Kit Sobrevivência (2x)",
    price: prices.pack1.v,
    fullPrice: prices.pack1.full,
    savings: prices.pack1.save,
    desc: "Um dia para tirar dores, outro para aliviar a mente.",
    details: "1x Massagem Clássica\n1x Massagem Sensorial\nSessões separadas no mês.",
    tag: "DURMA BEM",
    icon: "layers",
  },
  {
    id: "pack_glow",
    type: "pack",
    min: 120,
    title: "Renovação Completa (2x)",
    price: prices.pack_glow.v,
    fullPrice: prices.pack_glow.full,
    savings: prices.pack_glow.save,
    desc: "Estética, autoestima e relaxamento em dois encontros.",
    details: "1x Aparo de Pelos\n1x Experiência Fusion\nBônus: +30 minutos na Fusion.",
    tag: "GLOW UP",
    icon: "sparkles",
  },
  {
    id: "pack_muscle",
    type: "pack",
    min: 120,
    title: "Combo Recuperação (2x)",
    price: prices.pack_muscle.v,
    fullPrice: prices.pack_muscle.full,
    savings: prices.pack_muscle.save,
    desc: "Para quem treina pesado e precisa cuidar do corpo de verdade.",
    details: "2x Massagem para Atletas\nBônus: foco extra em dores.",
    tag: "MÚSCULOS",
    icon: "zap",
  },
  {
    id: "pack_interativo",
    type: "pack",
    min: 120,
    title: "Combo Conexão (2x)",
    price: prices.pack2.v,
    fullPrice: prices.pack2.full,
    savings: prices.pack2.save,
    desc: "Dois encontros para relaxar e se sentir cuidado com mais presença.",
    details: "1x Experiência Fusion\n1x Massagem Reversa\nFoco em acolhimento, contato humano e tranquilidade.",
    tag: "CALOR HUMANO",
    icon: "heart",
  },
  {
    id: "pack_premium",
    type: "pack",
    min: 180,
    title: "Plano Profundo (3x)",
    price: prices.pack3.v,
    fullPrice: prices.pack3.full,
    savings: prices.pack3.save,
    desc: "Três semanas do mês com cuidado agendado e sem enrolação.",
    details: "1x Naturista\n1x Fusion\n1x Nuru\nTrês encontros para relaxar o corpo e esvaziar a mente.",
    tag: "CUIDADO MÁXIMO",
    icon: "shield",
  },
  {
    id: "pack_ultimate",
    type: "pack",
    min: 180,
    title: "Jornada Completa (3x)",
    price: prices.pack_ultimate.v,
    fullPrice: prices.pack_ultimate.full,
    savings: prices.pack_ultimate.save,
    desc: "Uma sequência completa para quem quer resolver o mês inteiro.",
    details: "1x Sensorial\n1x Fusion\n1x Nuru\nBônus: participação mais livre, combinada com limites antes.",
    tag: "SOLUÇÃO COMPLETA",
    icon: "heart",
  },
];

const EXTRAS: ExtraItem[] = [
  { id: "hair_trim", price: 57, icon: "scissors", label: "Aparo de Pelos", desc: "Manutenção em até 2 áreas do corpo." },
  { id: "more_time", price: 77, icon: "watch", label: "+30 Minutos", desc: "Mais tempo para fazer tudo com calma." },
  { id: "touch", price: 77, icon: "hand", label: "Interação Guiada", desc: "Mais liberdade para participar da experiência, com limites combinados." },
  { id: "aroma", price: 17, icon: "sparkles", label: "Aromaterapia", desc: "Óleos e aroma para acalmar o corpo e a mente." },
  { id: "pain_relief", price: 17, icon: "shield", label: "Foco em Dor", desc: "Atenção extra nas regiões mais travadas." },
  { id: "dominador", price: 180, icon: "zap", label: "Condução Ativa", desc: "Ritmo mais conduzido por mim, sempre com consentimento." },
  { id: "oral", price: 120, icon: "heart", label: "Estímulo Sensorial", desc: "Complemento sensorial combinado com discrição e respeito." },
  { id: "beijos", price: 77, icon: "heart", label: "Beijos e Intimidade", desc: "Mais carinho e proximidade durante a sessão." },
  { id: "prostatico", price: 120, icon: "star", label: "Atenção Íntima Guiada", desc: "Complemento íntimo feito somente com conversa, higiene e consentimento." },
];

const FAQS: FAQ[] = [
  {
    q: "Como a finalização funciona na prática?",
    a: "Tudo é conduzido com respeito ao seu tempo e ao seu corpo. Antes de qualquer coisa, os limites são combinados. A ideia é criar um espaço onde você possa relaxar sem julgamento.",
  },
  {
    q: "Onde nós vamos nos encontrar?",
    a: "Eu posso ir até sua casa, apartamento ou hotel. Também existe a opção da minha suíte. Quando o local exige deslocamento, a taxa de Uber é combinada no WhatsApp.",
  },
  {
    q: "O que eu preciso fazer antes da sessão?",
    a: "Tome um banho quente próximo ao horário. Isso relaxa os músculos, melhora a experiência e deixa tudo mais confortável.",
  },
  {
    q: "Tenho vergonha do meu corpo, idade ou peso. E agora?",
    a: "O atendimento é sem julgamento. O foco é cuidado, respeito, presença e acolhimento. Você não precisa performar nada.",
  },
  {
    q: "O progresso e benefícios ficam salvos?",
    a: "Sim. O app salva suas escolhas e seu progresso no navegador. Se limpar o cache, os dados podem zerar.",
  },
];

const RULES: Rule[] = [
  { icon: "shower", title: "Banho antes da sessão", description: "A higiene prepara o corpo, relaxa os músculos e deixa o contato mais confortável." },
  { icon: "hand", title: "Respeito mútuo", description: "Tudo acontece com comunicação, consentimento e limites claros." },
  { icon: "heart", title: "Momento só seu", description: "Desligue a mente. A sessão é pensada para você respirar, relaxar e sair mais leve." },
  { icon: "shield", title: "Saúde e prevenção", description: "Ao agendar, você declara estar bem, sem lesões abertas ou sintomas contagiosos." },
];

const REVIEWS: Review[] = [
  { n: "Gustavo", loc: "Bela Vista - SP", t: "Chegou na hora certa. A experiência em casa foi incrível e o alívio foi imediato.", serv: "Experiência Fusion", s: 5 },
  { n: "Giovana", loc: "Hotel Portal da Mata", t: "Foi super respeitoso o tempo todo. Eu precisava desse descanso e relaxei demais.", serv: "Massagem Sensorial", s: 5 },
  { n: "Bruno", loc: "Bela Vista - SP", t: "Massagem muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
  { n: "Lucas", loc: "Londrina", t: "A discrição era minha prioridade e fui atendido com total cuidado.", serv: "Nuru", s: 5 },
  { n: "Ricardo", loc: "Fernandópolis", t: "Me senti à vontade para soltar minhas travas. Saí física e emocionalmente mais leve.", serv: "Massagem Reversa", s: 5 },
];

const CATEGORIES: Array<{ id: Category | "all"; title: string; desc: string; icon: string }> = [
  { id: "all", title: "Tudo", desc: "Ver opções", icon: "layers" },
  { id: "express", title: "Rápido", desc: "Mãos e pés", icon: "watch" },
  { id: "relax", title: "Dor e estresse", desc: "Corpo travado", icon: "sun" },
  { id: "final", title: "Sensorial", desc: "Mais envolvente", icon: "sparkles" },
  { id: "care", title: "Cuidado", desc: "Estética", icon: "scissors" },
];

const STEPS = ["Escolha", "Data", "Local", "Confirmar"];

const initialAddress: Address = {
  cep: "",
  street: "",
  number: "",
  district: "",
  city: "",
  comp: "",
  placeName: "",
};

const makeInitialBooking = (): BookingData => ({
  mode: "single",
  service: null,
  plan: null,
  extras: {},
  date: null,
  time: null,
  locationType: "home",
  address: initialAddress,
  payment: "",
  termsAccepted: false,
  mediaAllowed: false,
  bookingId: `THALY-${Date.now().toString(36).toUpperCase()}`,
});

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(" ");

const sanitizeInput = (value: string) => String(value || "").replace(/[<>&"']/g, "").trim();

const maskCEP = (value: string) => value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);

const formatMoney = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(value) ? value : 0);

const formatDateLabel = (iso: string) => {
  const date = new Date(`${iso}T12:00:00`);
  return date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" }).replace(".", "");
};

const Icon = memo(({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cx("shrink-0", className)}
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name] || ICON_PATHS.sparkles} />
  </svg>
));

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

    :root {
      color-scheme: ${isDark ? "dark" : "light"};
      --bg: ${isDark ? "#171412" : "#FCFAF8"};
      --surface: ${isDark ? "#211D1A" : "#FFFFFF"};
      --surface-2: ${isDark ? "#2A2520" : "#F6F0EA"};
      --line: ${isDark ? "rgba(255,255,255,.09)" : "rgba(41,37,36,.10)"};
      --text: ${isDark ? "#F5F0EA" : "#2A2520"};
      --muted: ${isDark ? "#B8AEA5" : "#776B61"};
      --soft: ${isDark ? "rgba(255,255,255,.055)" : "rgba(41,37,36,.045)"};
      --primary: #10B981;
      --primary-2: #059669;
      --warm: #EAB308;
      --rose: #F43F5E;
      --radius: clamp(18px, 4vw, 30px);
      --page-x: clamp(16px, 4vw, 48px);
      --h1: clamp(2rem, 7vw, 5.2rem);
      --h2: clamp(1.35rem, 4vw, 2.5rem);
      --bottom-bar: 98px;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body {
      margin: 0;
      min-width: 320px;
      overflow-x: hidden;
      background: var(--bg);
      color: var(--text);
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: geometricPrecision;
    }

    button, input, textarea, select { font: inherit; }
    button { -webkit-tap-highlight-color: transparent; }
    input, textarea, select { font-size: 16px !important; }

    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }

    .soft-grid {
      background-image:
        radial-gradient(circle at 20% 20%, rgba(16,185,129,.16), transparent 28rem),
        radial-gradient(circle at 80% 0%, rgba(234,179,8,.10), transparent 24rem),
        linear-gradient(var(--bg), var(--bg));
    }

    .focus-ring:focus-visible {
      outline: 3px solid rgba(16,185,129,.35);
      outline-offset: 3px;
    }

    .safe-bottom { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
    .text-balance { text-wrap: balance; }

    @media (min-width: 1024px) {
      :root { --bottom-bar: 0px; }
    }
  `}</style>
));

const Button = memo(
  ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled = false,
    type = "button",
    icon,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost" | "danger" | "whatsapp";
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit";
    icon?: string;
  }) => {
    const variants = {
      primary: "bg-emerald-500 text-white shadow-[0_14px_34px_rgba(16,185,129,.22)] hover:bg-emerald-600",
      secondary: "bg-[var(--surface-2)] text-[var(--text)] border border-[var(--line)] hover:border-emerald-500/40",
      ghost: "bg-transparent text-[var(--text)] hover:bg-[var(--soft)]",
      danger: "bg-rose-500 text-white hover:bg-rose-600",
      whatsapp: "bg-[#25D366] text-white shadow-[0_14px_34px_rgba(37,211,102,.20)] hover:bg-[#20bf5b]",
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={cx(
          "focus-ring inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45",
          variants[variant],
          className
        )}
      >
        {icon && <Icon name={icon} size={18} />}
        {children}
      </button>
    );
  }
);

const Field = memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    icon,
    inputMode,
    maxLength,
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
    maxLength?: number;
  }) => (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted)]">{label}</span>
      <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 transition focus-within:border-emerald-500/60 focus-within:ring-4 focus-within:ring-emerald-500/10">
        {icon && <Icon name={icon} size={18} className="text-emerald-500" />}
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          maxLength={maxLength}
          className="min-w-0 flex-1 bg-transparent text-base text-[var(--text)] placeholder:text-[var(--muted)] focus:outline-none"
        />
      </div>
    </label>
  )
);

const Toasts = memo(({ items }: { items: Array<{ id: number; msg: string; type: "success" | "error" }> }) => (
  <div className="pointer-events-none fixed left-0 right-0 top-4 z-[100] mx-auto flex w-full max-w-md flex-col gap-2 px-4">
    {items.map((toast) => (
      <div
        key={toast.id}
        className={cx(
          "pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold shadow-2xl backdrop-blur-xl",
          toast.type === "error"
            ? "border-rose-500/30 bg-rose-950/90 text-rose-50"
            : "border-emerald-500/25 bg-[var(--surface)] text-[var(--text)]"
        )}
      >
        <span className={cx("flex h-8 w-8 items-center justify-center rounded-full", toast.type === "error" ? "bg-rose-500/15 text-rose-300" : "bg-emerald-500/15 text-emerald-500")}>
          <Icon name={toast.type === "error" ? "x" : "check"} size={16} />
        </span>
        <span>{toast.msg}</span>
      </div>
    ))}
  </div>
));

const Header = memo(
  ({ isDark, toggleTheme, menuOpen, setMenuOpen }: { isDark: boolean; toggleTheme: () => void; menuOpen: boolean; setMenuOpen: (open: boolean) => void }) => (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--bg)_88%,transparent)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-full max-w-screen-2xl items-center justify-between gap-3 px-[var(--page-x)]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-bold text-white shadow-lg shadow-emerald-500/20">T</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold leading-tight">Thaly Massagens</p>
            <p className="truncate text-xs text-[var(--muted)]">Agendamento rápido e acolhedor</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:border-emerald-500/40"
            aria-label="Alternar tema"
          >
            <Icon name={isDark ? "sun" : "moon"} size={18} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition hover:border-emerald-500/40"
            aria-label="Abrir menu"
          >
            <Icon name={menuOpen ? "x" : "menu"} size={20} />
          </button>
        </div>
      </div>
    </header>
  )
);

const Stepper = memo(({ step }: { step: number }) => (
  <nav className="scrollbar-none -mx-[var(--page-x)] mb-6 flex gap-2 overflow-x-auto px-[var(--page-x)] sm:mx-0 sm:px-0" aria-label="Etapas do agendamento">
    {STEPS.map((item, index) => {
      const active = step === index;
      const done = step > index;
      return (
        <div
          key={item}
          className={cx(
            "flex min-w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition sm:px-4",
            active && "border-emerald-500 bg-emerald-500 text-white",
            done && !active && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
            !active && !done && "border-[var(--line)] bg-[var(--surface)] text-[var(--muted)]"
          )}
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-[11px]">{done ? <Icon name="check" size={12} /> : index + 1}</span>
          {item}
        </div>
      );
    })}
  </nav>
));

const Hero = memo(({ selectedName }: { selectedName?: string }) => (
  <section className="grid gap-5 py-6 sm:py-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,.9fr)] lg:items-end lg:gap-8">
    <div className="min-w-0">
      <span className="mb-4 inline-flex rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-emerald-500">
        Resolva em poucos toques
      </span>
      <h1 className="text-balance text-[length:var(--h1)] font-bold leading-[.95] tracking-[-.06em] text-[var(--text)]">
        Escolha, agende e relaxe.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
        Sem fluxo confuso: primeiro você escolhe o cuidado, depois data, local e confirmação. Os detalhes ficam disponíveis quando você quiser ler.
      </p>
    </div>

    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 shadow-[0_18px_60px_rgba(0,0,0,.08)] sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-emerald-500/12 text-emerald-500">
          <Icon name="heart" size={24} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold">Agora selecionado</p>
          <p className="mt-1 line-clamp-2 text-sm text-[var(--muted)]">{selectedName || "Toque em uma sessão ou plano para começar."}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {["Escolha", "Data", "WhatsApp"].map((item) => (
          <div key={item} className="rounded-2xl bg-[var(--soft)] px-2 py-3">
            <p className="text-[11px] font-semibold text-[var(--muted)]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
));

const ServiceCard = memo(
  ({ item, selected, onSelect, onDetails }: { item: ServiceItem; selected: boolean; onSelect: () => void; onDetails: () => void }) => (
    <article
      className={cx(
        "group flex min-w-0 flex-col rounded-[var(--radius)] border bg-[var(--surface)] p-4 transition sm:p-5",
        selected ? "border-emerald-500 shadow-[0_16px_44px_rgba(16,185,129,.16)]" : "border-[var(--line)] hover:border-emerald-500/35"
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className={cx("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", selected ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500")}>
            <Icon name={item.icon} size={20} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-bold uppercase tracking-[.16em] text-emerald-500">{item.tag}</p>
            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-tight text-[var(--text)]">{item.title}</h3>
          </div>
        </div>
        {item.popular && <span className="rounded-full bg-amber-500/12 px-2 py-1 text-[10px] font-bold text-amber-500">Mais pedida</span>}
      </div>

      <p className="line-clamp-3 min-h-[62px] text-sm leading-6 text-[var(--muted)]">{item.desc}</p>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
        <div>
          {item.fullPrice && <p className="text-xs text-[var(--muted)] line-through">{formatMoney(item.fullPrice)}</p>}
          <p className="text-xl font-bold tracking-[-.04em] text-[var(--text)]">{formatMoney(item.price)}</p>
          <p className="text-xs text-[var(--muted)]">{item.min} min {item.savings ? `• economiza ${formatMoney(item.savings)}` : ""}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="min-h-11 px-4 py-2" onClick={onDetails}>Detalhes</Button>
          <Button variant={selected ? "secondary" : "primary"} className="min-h-11 px-4 py-2" onClick={onSelect}>
            {selected ? "Escolhido" : "Escolher"}
          </Button>
        </div>
      </div>
    </article>
  )
);

const DetailModal = memo(
  ({ item, onClose, onSelect, selected }: { item: ServiceItem | null; onClose: () => void; onSelect: () => void; selected: boolean }) => {
    if (!item) return null;
    return (
      <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/55 p-0 backdrop-blur-sm sm:items-center sm:p-5" role="dialog" aria-modal="true">
        <div className="safe-bottom max-h-[92dvh] w-full overflow-auto rounded-t-[32px] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl sm:max-w-xl sm:rounded-[32px] sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">{item.tag}</p>
              <h2 className="mt-1 text-2xl font-bold tracking-[-.04em]">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.desc}</p>
            </div>
            <button className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--soft)]" onClick={onClose} aria-label="Fechar">
              <Icon name="x" size={18} />
            </button>
          </div>

          <div className="rounded-3xl bg-[var(--soft)] p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Como funciona</p>
            <div className="space-y-3">
              {item.details.split("\n").map((line) => (
                <div key={line} className="flex gap-3 text-sm leading-6 text-[var(--text)]">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"><Icon name="check" size={12} /></span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button variant={selected ? "secondary" : "primary"} className="w-full" onClick={onSelect}>
              {selected ? "Já está escolhido" : `Escolher por ${formatMoney(item.price)}`}
            </Button>
            <Button variant="ghost" className="w-full sm:w-auto" onClick={onClose}>Voltar</Button>
          </div>
        </div>
      </div>
    );
  }
);

const Accordion = memo(({ title, icon, children, defaultOpen = false }: { title: string; icon?: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-[24px] border border-[var(--line)] bg-[var(--surface)]">
      <button type="button" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between gap-3 p-4 text-left">
        <span className="flex min-w-0 items-center gap-3 text-sm font-bold">
          {icon && <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"><Icon name={icon} size={17} /></span>}
          {title}
        </span>
        <Icon name="chevron-down" size={18} className={cx("transition", open && "rotate-180")} />
      </button>
      {open && <div className="border-t border-[var(--line)] p-4 pt-3 text-sm leading-7 text-[var(--muted)]">{children}</div>}
    </div>
  );
});

const ExtraCard = memo(({ extra, active, onToggle }: { extra: ExtraItem; active: boolean; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    className={cx(
      "focus-ring flex min-w-0 items-start gap-3 rounded-[24px] border bg-[var(--surface)] p-4 text-left transition",
      active ? "border-emerald-500 shadow-[0_12px_36px_rgba(16,185,129,.13)]" : "border-[var(--line)] hover:border-emerald-500/35"
    )}
  >
    <span className={cx("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", active ? "bg-emerald-500 text-white" : "bg-emerald-500/10 text-emerald-500")}>
      <Icon name={extra.icon} size={18} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="block text-sm font-bold text-[var(--text)]">{extra.label}</span>
      <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{extra.desc}</span>
      <span className="mt-2 block text-sm font-bold text-emerald-500">+ {formatMoney(extra.price)}</span>
    </span>
    {active && <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"><Icon name="check" size={13} /></span>}
  </button>
));

const SummaryPanel = memo(
  ({ booking, total, subtotal, discounts, selectedMain, extrasSelected, rushFee }: { booking: BookingData; total: number; subtotal: number; discounts: number; selectedMain: ServiceItem | null; extrasSelected: ExtraItem[]; rushFee: number }) => {
    const locationText = booking.locationType === "motel" ? "Minha suíte" : booking.locationType === "hotel" ? "Hotel" : "Residência";
    return (
      <aside className="sticky top-24 hidden h-fit min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5 shadow-[0_20px_70px_rgba(0,0,0,.08)] lg:block">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">Resumo</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">{formatMoney(total)}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">Preço atualizado conforme suas escolhas.</p>

        <div className="mt-5 space-y-3 border-t border-[var(--line)] pt-5">
          <SummaryLine label="Escolha" value={selectedMain?.title || "Ainda não escolhido"} />
          <SummaryLine label="Quando" value={booking.date && booking.time ? `${formatDateLabel(booking.date)} às ${booking.time}` : "Falta escolher"} />
          <SummaryLine label="Onde" value={locationText} />
          {extrasSelected.length > 0 && <SummaryLine label="Extras" value={`${extrasSelected.length} selecionado(s)`} />}
          <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
          {rushFee > 0 && <SummaryLine label="Horário de pico" value={`+ ${formatMoney(rushFee)}`} />}
          {discounts > 0 && <SummaryLine label="Descontos" value={`- ${formatMoney(discounts)}`} success />}
        </div>
      </aside>
    );
  }
);

const SummaryLine = memo(({ label, value, success = false }: { label: string; value: string; success?: boolean }) => (
  <div className="flex items-start justify-between gap-4 text-sm">
    <span className="text-[var(--muted)]">{label}</span>
    <span className={cx("max-w-[180px] text-right font-semibold", success ? "text-emerald-500" : "text-[var(--text)]")}>{value}</span>
  </div>
));

const BottomBar = memo(
  ({ total, step, canGoBack, onBack, onNext, isLast }: { total: number; step: number; canGoBack: boolean; onBack: () => void; onNext: () => void; isLast: boolean }) => (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] px-3 py-3 shadow-[0_-14px_44px_rgba(0,0,0,.18)] backdrop-blur-xl safe-bottom lg:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[minmax(0,1fr)_52px_minmax(128px,.95fr)] items-center gap-2">
        <div className="min-w-0 rounded-2xl bg-[var(--soft)] px-3 py-2">
          <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">Total</p>
          <p className="truncate text-lg font-bold tracking-[-.04em]">{formatMoney(total)}</p>
        </div>
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="focus-ring flex h-[52px] items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] disabled:opacity-35"
          aria-label="Voltar"
        >
          <Icon name="chevron-left" size={20} />
        </button>
        <Button className="h-[52px] w-full px-3" variant={isLast ? "whatsapp" : "primary"} onClick={onNext} icon={isLast ? "send" : undefined}>
          {isLast ? "Enviar" : step === 0 ? "Agendar" : "Próximo"}
        </Button>
      </div>
    </div>
  )
);

const MenuSheet = memo(
  ({ open, onClose, user, isDark, toggleTheme }: { open: boolean; onClose: () => void; user: UserData; isDark: boolean; toggleTheme: () => void }) => {
    if (!open) return null;
    const xpProgress = Math.min(100, Math.round((user.xp / 350) * 100));
    return (
      <div className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm" onClick={onClose}>
        <aside
          className="safe-bottom ml-auto flex h-full w-full max-w-sm flex-col overflow-auto border-l border-[var(--line)] bg-[var(--surface)] p-5 shadow-2xl"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Configurações</p>
              <h2 className="text-2xl font-bold tracking-[-.05em]">Seu cuidado</h2>
            </div>
            <button className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--soft)]" onClick={onClose} aria-label="Fechar menu"><Icon name="x" size={18} /></button>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-[var(--soft)] p-4">
            <p className="text-sm font-bold">Progresso de XP</p>
            <p className="mt-1 text-xs text-[var(--muted)]">Seus dados ficam salvos neste navegador.</p>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-black/10">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="mt-2 text-xs font-semibold text-[var(--muted)]">{user.xp} XP acumulados</p>
          </div>

          <div className="mt-4 grid gap-3">
            <Button variant="secondary" onClick={toggleTheme} icon={isDark ? "sun" : "moon"}>{isDark ? "Usar tema claro" : "Usar tema escuro"}</Button>
            <Button variant="secondary" icon="instagram" onClick={() => window.open(CONFIG.INSTAGRAM_URL, "_blank", "noopener,noreferrer")}>Abrir Instagram</Button>
            <Button variant="whatsapp" icon="message" onClick={() => window.open(`https://wa.me/${CONFIG.PHONE}`, "_blank", "noopener,noreferrer")}>Chamar no WhatsApp</Button>
          </div>

          <div className="mt-auto pt-6 text-xs leading-6 text-[var(--muted)]">
            O fluxo foi desenhado para agendamento rápido: escolha, data, local e confirmação.
          </div>
        </aside>
      </div>
    );
  }
);

function SelectionStep({
  booking,
  setBooking,
  category,
  setCategory,
  openDetails,
}: {
  booking: BookingData;
  setBooking: React.Dispatch<React.SetStateAction<BookingData>>;
  category: Category | "all";
  setCategory: (category: Category | "all") => void;
  openDetails: (item: ServiceItem) => void;
}) {
  const visibleServices = useMemo(() => (category === "all" ? SERVICES : SERVICES.filter((service) => service.category === category)), [category]);
  const items = booking.mode === "single" ? visibleServices : PLANS;

  const selectItem = (item: ServiceItem) => {
    setBooking((current) => ({ ...current, service: current.mode === "single" ? item : current.service, plan: current.mode === "pack" ? item : current.plan }));
  };

  return (
    <section className="space-y-5">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "single", label: "Sessão avulsa", desc: "Escolher uma sessão" },
            { id: "pack", label: "Plano mensal", desc: "Mais de um encontro" },
          ].map((tab) => {
            const active = booking.mode === tab.id;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setBooking((current) => ({ ...current, mode: tab.id as BookingMode }))}
                className={cx(
                  "focus-ring rounded-3xl px-3 py-4 text-left transition",
                  active ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-transparent text-[var(--text)] hover:bg-[var(--soft)]"
                )}
              >
                <span className="block text-sm font-bold">{tab.label}</span>
                <span className={cx("mt-1 block text-xs", active ? "text-white/75" : "text-[var(--muted)]")}>{tab.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {booking.mode === "single" && (
        <div className="scrollbar-none -mx-[var(--page-x)] flex gap-2 overflow-x-auto px-[var(--page-x)] sm:mx-0 sm:px-0">
          {CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setCategory(item.id)}
                className={cx(
                  "focus-ring flex min-w-[138px] items-center gap-3 rounded-3xl border px-4 py-3 text-left transition",
                  active ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--surface)] text-[var(--text)]"
                )}
              >
                <Icon name={item.icon} size={18} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold leading-tight">{item.title}</span>
                  <span className={cx("block text-[11px]", active ? "text-white/70" : "text-[var(--muted)]")}>{item.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const selected = booking.mode === "single" ? booking.service?.id === item.id : booking.plan?.id === item.id;
          return <ServiceCard key={item.id} item={item} selected={selected} onSelect={() => selectItem(item)} onDetails={() => openDetails(item)} />;
        })}
      </div>
    </section>
  );
}

function DateStep({ booking, setBooking }: { booking: BookingData; setBooking: React.Dispatch<React.SetStateAction<BookingData>> }) {
  const days = useMemo(() => {
    return Array.from({ length: 14 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);
      const iso = date.toISOString().slice(0, 10);
      return { iso, label: index === 0 ? "Hoje" : index === 1 ? "Amanhã" : formatDateLabel(iso), day: date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "") };
    });
  }, []);

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour += 1) {
      slots.push(`${String(hour).padStart(2, "0")}:00`);
    }
    return slots;
  }, []);

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Quando</p>
        <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Escolha o dia</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Toque no melhor dia. Depois escolha o horário disponível.</p>

        <div className="scrollbar-none mt-5 flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible">
          {days.map((day) => {
            const active = booking.date === day.iso;
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => setBooking((current) => ({ ...current, date: day.iso }))}
                className={cx(
                  "focus-ring min-w-[124px] rounded-3xl border px-4 py-4 text-left transition",
                  active ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--soft)] text-[var(--text)] hover:border-emerald-500/35"
                )}
              >
                <span className="block text-xs font-bold uppercase tracking-[.14em] opacity-75">{day.day}</span>
                <span className="mt-1 block text-lg font-bold">{day.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Horário</p>
        <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Selecione a hora</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Horários de pico somam {formatMoney(CONFIG.RUSH_FEE)} quando houver deslocamento.</p>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
          {timeSlots.map((time) => {
            const active = booking.time === time;
            const rush = CONFIG.RUSH_HOURS.includes(time as typeof CONFIG.RUSH_HOURS[number]);
            return (
              <button
                key={time}
                type="button"
                onClick={() => setBooking((current) => ({ ...current, time }))}
                className={cx(
                  "focus-ring min-h-[62px] rounded-2xl border px-2 py-2 text-center transition",
                  active ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--soft)] text-[var(--text)] hover:border-emerald-500/35"
                )}
              >
                <span className="block text-sm font-bold">{time}</span>
                {rush && <span className={cx("mt-1 block text-[10px] font-semibold", active ? "text-white/75" : "text-amber-500")}>pico</span>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function LocationStep({
  user,
  setUser,
  booking,
  setBooking,
  addToast,
}: {
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData>>;
  booking: BookingData;
  setBooking: React.Dispatch<React.SetStateAction<BookingData>>;
  addToast: (msg: string, type?: "success" | "error") => void;
}) {
  const [loadingCep, setLoadingCep] = useState(false);
  const address = booking.address;

  const updateAddress = (patch: Partial<Address>) => setBooking((current) => ({ ...current, address: { ...current.address, ...patch } }));

  const fetchCep = async (raw: string) => {
    const cep = raw.replace(/\D/g, "");
    updateAddress({ cep: maskCEP(raw) });
    if (cep.length !== 8) return;

    try {
      setLoadingCep(true);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (data?.erro) throw new Error("CEP não encontrado");
      updateAddress({
        cep: maskCEP(cep),
        street: data.logradouro || "",
        district: data.bairro || "",
        city: data.localidade || "",
      });
      addToast("Endereço encontrado pelo CEP.");
    } catch {
      addToast("Não encontrei esse CEP. Preencha manualmente.", "error");
    } finally {
      setLoadingCep(false);
    }
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,.78fr)_minmax(0,1fr)]">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Quem e onde</p>
        <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Dados rápidos</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Só o essencial para eu saber com quem falar e para onde ir.</p>

        <div className="mt-5">
          <Field label="Nome ou apelido" value={user.name} onChange={(value) => setUser((current) => ({ ...current, name: value }))} placeholder="Ex: João" icon="user" />
        </div>
      </div>

      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Local</p>
        <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Onde será?</h2>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { id: "home", label: "Residência", icon: "home" },
            { id: "hotel", label: "Hotel", icon: "building" },
            { id: "motel", label: "Minha suíte", icon: "bed" },
          ].map((item) => {
            const active = booking.locationType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setBooking((current) => ({ ...current, locationType: item.id as LocationType }))}
                className={cx(
                  "focus-ring flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-bold transition",
                  active ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--soft)] text-[var(--text)]"
                )}
              >
                <Icon name={item.icon} size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        {booking.locationType === "motel" ? (
          <div className="mt-5 rounded-3xl bg-emerald-500/10 p-4 text-sm leading-7 text-[var(--text)]">
            <strong className="text-emerald-500">Perfeito.</strong> Após enviar o pedido no WhatsApp, eu te mando o endereço da minha suíte e confirmamos o horário.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {booking.locationType === "hotel" && (
              <Field label="Nome do hotel" value={address.placeName} onChange={(value) => updateAddress({ placeName: value })} placeholder="Ex: Hotel Portal" icon="building" />
            )}
            <Field label="CEP" value={address.cep} onChange={fetchCep} placeholder="00000-000" icon="map-pin" inputMode="numeric" maxLength={9} />
            <Field label={booking.locationType === "hotel" ? "Quarto / suíte" : "Número"} value={address.number} onChange={(value) => updateAddress({ number: value })} placeholder={booking.locationType === "hotel" ? "Ex: 302" : "Ex: 125"} icon="home" />
            <div className="sm:col-span-2">
              <Field label="Rua ou avenida" value={address.street} onChange={(value) => updateAddress({ street: value })} placeholder="Endereço completo" icon="map-pin" />
            </div>
            <Field label="Bairro" value={address.district} onChange={(value) => updateAddress({ district: value })} placeholder="Seu bairro" icon="map-pin" />
            <Field label="Cidade" value={address.city} onChange={(value) => updateAddress({ city: value })} placeholder="Sua cidade" icon="map-pin" />
            <div className="sm:col-span-2">
              <Field label="Complemento opcional" value={address.comp} onChange={(value) => updateAddress({ comp: value })} placeholder="Apto, bloco, referência..." icon="plus" />
            </div>
            {loadingCep && <p className="sm:col-span-2 text-xs font-semibold text-emerald-500">Buscando CEP...</p>}
          </div>
        )}
      </div>
    </section>
  );
}

function ConfirmStep({
  booking,
  setBooking,
  total,
  subtotal,
  discounts,
  extrasSelected,
  selectedMain,
  rushFee,
}: {
  booking: BookingData;
  setBooking: React.Dispatch<React.SetStateAction<BookingData>>;
  total: number;
  subtotal: number;
  discounts: number;
  extrasSelected: ExtraItem[];
  selectedMain: ServiceItem | null;
  rushFee: number;
}) {
  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,.82fr)]">
      <div className="space-y-5">
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Complementos</p>
          <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Quer adicionar algo?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">Tudo é opcional. Deixe vazio se quiser só finalizar rápido.</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {EXTRAS.map((extra) => (
              <ExtraCard
                key={extra.id}
                extra={extra}
                active={!!booking.extras[extra.id]}
                onToggle={() => setBooking((current) => ({ ...current, extras: { ...current.extras, [extra.id]: !current.extras[extra.id] } }))}
              />
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Pagamento</p>
          <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Como prefere pagar?</h2>
          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {[
              { id: "pix", label: "Pix", desc: "3% OFF", icon: "banknote" },
              { id: "card", label: "Cartão", desc: "Crédito/débito", icon: "credit-card" },
              { id: "cash", label: "Dinheiro", desc: "No local", icon: "banknote" },
            ].map((item) => {
              const active = booking.payment === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBooking((current) => ({ ...current, payment: item.id as PaymentMethod }))}
                  className={cx(
                    "focus-ring rounded-3xl border px-4 py-4 text-left transition",
                    active ? "border-emerald-500 bg-emerald-500 text-white" : "border-[var(--line)] bg-[var(--soft)] text-[var(--text)]"
                  )}
                >
                  <Icon name={item.icon} size={18} />
                  <span className="mt-3 block text-sm font-bold">{item.label}</span>
                  <span className={cx("mt-1 block text-xs", active ? "text-white/75" : "text-[var(--muted)]")}>{item.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Resumo final</p>
          <h2 className="mt-2 text-[length:var(--h2)] font-bold tracking-[-.05em]">Confira antes de enviar</h2>

          <div className="mt-5 space-y-3">
            <SummaryLine label="Escolha" value={selectedMain?.title || "Não escolhido"} />
            <SummaryLine label="Data" value={booking.date && booking.time ? `${formatDateLabel(booking.date)} às ${booking.time}` : "Não escolhido"} />
            <SummaryLine label="Extras" value={extrasSelected.length ? `${extrasSelected.length} extra(s)` : "Nenhum"} />
            <SummaryLine label="Subtotal" value={formatMoney(subtotal)} />
            {rushFee > 0 && <SummaryLine label="Horário de pico" value={`+ ${formatMoney(rushFee)}`} />}
            {discounts > 0 && <SummaryLine label="Descontos" value={`- ${formatMoney(discounts)}`} success />}
            <div className="border-t border-[var(--line)] pt-3">
              <SummaryLine label="Total" value={formatMoney(total)} />
            </div>
          </div>

          <label className="mt-5 flex cursor-pointer gap-3 rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-4 text-sm leading-6">
            <input
              type="checkbox"
              checked={booking.mediaAllowed}
              onChange={(event) => setBooking((current) => ({ ...current, mediaAllowed: event.target.checked }))}
              className="mt-1 h-4 w-4 accent-emerald-500"
            />
            <span>
              <strong>Desconto portfólio (1%).</strong> Autorizo fotos anônimas e estéticas, sem rosto e sem intimidade, para portfólio.
            </span>
          </label>

          <label className="mt-3 flex cursor-pointer gap-3 rounded-3xl border border-[var(--line)] bg-[var(--soft)] p-4 text-sm leading-6">
            <input
              type="checkbox"
              checked={booking.termsAccepted}
              onChange={(event) => setBooking((current) => ({ ...current, termsAccepted: event.target.checked }))}
              className="mt-1 h-4 w-4 accent-emerald-500"
            />
            <span>Li e aceito as regras de respeito, higiene, saúde e limites combinados.</span>
          </label>
        </div>

        <div className="grid gap-3">
          <Accordion title="Regras rápidas" icon="shield" defaultOpen>
            <div className="space-y-4">
              {RULES.map((rule) => (
                <div key={rule.title} className="flex gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500"><Icon name={rule.icon} size={16} /></span>
                  <span><strong className="block text-[var(--text)]">{rule.title}</strong>{rule.description}</span>
                </div>
              ))}
            </div>
          </Accordion>

          <Accordion title="Dúvidas frequentes" icon="message">
            <div className="space-y-5">
              {FAQS.map((faq) => (
                <div key={faq.q}>
                  <strong className="block text-[var(--text)]">{faq.q}</strong>
                  <span>{faq.a}</span>
                </div>
              ))}
            </div>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="mt-8 grid gap-4 lg:grid-cols-[.75fr_1fr] lg:items-start">
      <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-xs font-bold uppercase tracking-[.16em] text-emerald-500">Confiança</p>
        <h2 className="mt-2 text-2xl font-bold tracking-[-.05em]">O que clientes dizem</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">Prova social sem ocupar o fluxo principal. Quem quer agendar rápido não precisa passar por tudo.</p>
      </div>
      <div className="scrollbar-none -mx-[var(--page-x)] flex gap-3 overflow-x-auto px-[var(--page-x)] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 xl:grid-cols-3">
        {REVIEWS.map((review) => (
          <article key={`${review.n}-${review.serv}`} className="min-w-[280px] rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:min-w-0">
            <div className="mb-3 flex text-amber-500">{Array.from({ length: review.s }).map((_, i) => <Icon key={i} name="star" size={14} />)}</div>
            <p className="text-sm leading-6 text-[var(--text)]">“{review.t}”</p>
            <p className="mt-4 text-sm font-bold">{review.n}</p>
            <p className="text-xs text-[var(--muted)]">{review.loc} • {review.serv}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<Category | "all">("all");
  const [booking, setBooking] = useState<BookingData>(makeInitialBooking);
  const [user, setUser] = useState<UserData>({ name: "", xp: 0, hasSeenWelcome: false, ordersCount: 92 });
  const [modalItem, setModalItem] = useState<ServiceItem | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: "success" | "error" }>>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.booking) setBooking({ ...makeInitialBooking(), ...parsed.booking, bookingId: parsed.booking.bookingId || `THALY-${Date.now().toString(36).toUpperCase()}` });
        if (parsed?.user) setUser({ name: "", xp: 0, hasSeenWelcome: false, ordersCount: 92, ...parsed.user });
        if (typeof parsed?.step === "number") setStep(Math.min(3, Math.max(0, parsed.step)));
      }
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ booking, user, step }));
    } catch {
      // armazenamento indisponível; o app continua funcionando
    }
  }, [booking, user, step, isClient]);

  const addToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts((current) => [...current.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3600);
  }, []);

  const selectedMain = booking.mode === "single" ? booking.service : booking.plan;
  const extrasSelected = useMemo(() => EXTRAS.filter((extra) => booking.extras[extra.id]), [booking.extras]);

  const financials = useMemo(() => {
    const base = selectedMain?.price || 0;
    const extras = extrasSelected.reduce((sum, item) => sum + item.price, 0);
    const rushFee = booking.time && CONFIG.RUSH_HOURS.includes(booking.time as typeof CONFIG.RUSH_HOURS[number]) && booking.locationType !== "motel" ? CONFIG.RUSH_FEE : 0;
    const subtotal = base + extras + rushFee;
    const pixDiscount = booking.payment === "pix" ? subtotal * 0.03 : 0;
    const mediaDiscount = booking.mediaAllowed ? subtotal * 0.01 : 0;
    const discounts = pixDiscount + mediaDiscount;
    const total = Math.max(0, subtotal - discounts);
    const duration = (selectedMain?.min || 0) + (booking.extras.more_time ? 30 : 0);
    return { base, extras, rushFee, subtotal, discounts, total, duration };
  }, [selectedMain, extrasSelected, booking.time, booking.locationType, booking.payment, booking.mediaAllowed, booking.extras.more_time]);

  const validateStep = useCallback(() => {
    if (step === 0 && !selectedMain) {
      addToast("Escolha uma sessão ou plano para continuar.", "error");
      return false;
    }
    if (step === 1 && (!booking.date || !booking.time)) {
      addToast("Escolha a data e o horário.", "error");
      return false;
    }
    if (step === 2) {
      if (!sanitizeInput(user.name)) {
        addToast("Preencha seu nome ou apelido.", "error");
        return false;
      }
      if (booking.locationType === "home") {
        const ok = booking.address.street && booking.address.number && booking.address.district && booking.address.city;
        if (!ok) {
          addToast("Preencha o endereço da residência.", "error");
          return false;
        }
      }
      if (booking.locationType === "hotel") {
        const ok = booking.address.placeName && booking.address.number;
        if (!ok) {
          addToast("Preencha o nome do hotel e quarto/suíte.", "error");
          return false;
        }
      }
    }
    if (step === 3) {
      if (!booking.payment) {
        addToast("Escolha a forma de pagamento.", "error");
        return false;
      }
      if (!booking.termsAccepted) {
        addToast("Aceite as regras para confirmar.", "error");
        return false;
      }
    }
    return true;
  }, [step, selectedMain, booking, user.name, addToast]);

  const generateWhatsAppMessage = useCallback(() => {
    const address = booking.address;
    const locationText =
      booking.locationType === "motel"
        ? "Minha suíte privada — endereço enviado após confirmação"
        : booking.locationType === "hotel"
          ? `${sanitizeInput(address.placeName)}, quarto/suíte ${sanitizeInput(address.number)}`
          : `${sanitizeInput(address.street)}, ${sanitizeInput(address.number)} - ${sanitizeInput(address.district)}, ${sanitizeInput(address.city)} ${address.comp ? `(${sanitizeInput(address.comp)})` : ""}`;

    const extrasText = extrasSelected.length ? extrasSelected.map((extra) => `• ${extra.label} (+${formatMoney(extra.price)})`).join("\n") : "Nenhum extra";
    const dateText = booking.date ? formatDateLabel(booking.date) : "Data não escolhida";

    return `*PEDIDO DE AGENDAMENTO* | #${booking.bookingId}\n──────────────────\nOlá Thalyson! Quero confirmar meu atendimento.\n\n👤 *Nome:* ${sanitizeInput(user.name)}\n💆‍♂️ *Escolha:* ${selectedMain?.title || "Não informado"}\n📅 *Data:* ${dateText} às ${booking.time || "--:--"}\n⏱️ *Duração estimada:* ${financials.duration} min\n\n📍 *Local:*\n${locationText}\n${booking.locationType !== "motel" ? "\n⚠️ Taxa de deslocamento/Uber a confirmar no chat.\n" : ""}\n➕ *Extras:*\n${extrasText}\n\n💳 *Pagamento:* ${booking.payment || "A combinar"}\n💰 *Total:* ${formatMoney(financials.total)}\n\n🛡️ Li e aceito as regras de higiene, saúde, respeito e limites combinados.\nAguardo sua confirmação.`.trim();
  }, [booking, extrasSelected, financials.duration, financials.total, selectedMain, user.name]);

  const finishBooking = useCallback(() => {
    const message = generateWhatsAppMessage();
    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setUser((current) => ({ ...current, xp: current.xp + Math.max(20, Math.round(financials.total / 5)), ordersCount: current.ordersCount + 1 }));
    setSuccess(true);
  }, [generateWhatsAppMessage, financials.total]);

  const handleNext = useCallback(() => {
    if (!validateStep()) return;
    if (step < 3) {
      setStep((current) => current + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    finishBooking();
  }, [validateStep, step, finishBooking]);

  const resetFlow = () => {
    setBooking(makeInitialBooking());
    setStep(0);
    setSuccess(false);
    addToast("Fluxo reiniciado.");
  };

  if (!isClient) return <div className="min-h-screen bg-[#171412]" />;

  const selectedName = selectedMain?.title;

  return (
    <div className="soft-grid min-h-[100dvh] bg-[var(--bg)] text-[var(--text)]">
      <GlobalStyles isDark={isDark} />
      <Toasts items={toasts} />
      <Header isDark={isDark} toggleTheme={() => setIsDark((current) => !current)} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <MenuSheet open={menuOpen} onClose={() => setMenuOpen(false)} user={user} isDark={isDark} toggleTheme={() => setIsDark((current) => !current)} />

      <main className="mx-auto w-full max-w-screen-2xl px-[var(--page-x)] pb-[calc(var(--bottom-bar)+36px)] lg:pb-12">
        {success ? (
          <section className="mx-auto flex min-h-[calc(100dvh-70px)] max-w-2xl flex-col items-center justify-center py-12 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-[28px] bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20">
              <Icon name="check" size={34} />
            </div>
            <h1 className="text-balance text-[length:var(--h1)] font-bold leading-[.95] tracking-[-.06em]">Tudo pronto.</h1>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)] sm:text-base">
              O WhatsApp foi aberto com o pedido montado. Se não abriu, toque no botão abaixo para enviar novamente.
            </p>
            <div className="mt-7 grid w-full gap-3 sm:grid-cols-2">
              <Button variant="whatsapp" icon="message" onClick={finishBooking}>Abrir WhatsApp</Button>
              <Button variant="secondary" onClick={resetFlow}>Novo agendamento</Button>
            </div>
          </section>
        ) : (
          <>
            <Hero selectedName={selectedName} />
            <Stepper step={step} />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
              <div className="min-w-0">
                {step === 0 && <SelectionStep booking={booking} setBooking={setBooking} category={category} setCategory={setCategory} openDetails={setModalItem} />}
                {step === 1 && <DateStep booking={booking} setBooking={setBooking} />}
                {step === 2 && <LocationStep user={user} setUser={setUser} booking={booking} setBooking={setBooking} addToast={addToast} />}
                {step === 3 && (
                  <ConfirmStep
                    booking={booking}
                    setBooking={setBooking}
                    total={financials.total}
                    subtotal={financials.subtotal}
                    discounts={financials.discounts}
                    extrasSelected={extrasSelected}
                    selectedMain={selectedMain}
                    rushFee={financials.rushFee}
                  />
                )}

                {step === 0 && <SocialProof />}
              </div>

              <SummaryPanel
                booking={booking}
                total={financials.total}
                subtotal={financials.subtotal}
                discounts={financials.discounts}
                selectedMain={selectedMain}
                extrasSelected={extrasSelected}
                rushFee={financials.rushFee}
              />
            </div>

            <div className="mt-6 hidden justify-end gap-3 lg:flex">
              <Button variant="secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))} icon="chevron-left">Voltar</Button>
              <Button variant={step === 3 ? "whatsapp" : "primary"} onClick={handleNext} icon={step === 3 ? "send" : "chevron-right"}>{step === 3 ? "Enviar para WhatsApp" : "Próximo"}</Button>
            </div>
          </>
        )}
      </main>

      {!success && <BottomBar total={financials.total} step={step} canGoBack={step > 0} onBack={() => setStep((current) => Math.max(0, current - 1))} onNext={handleNext} isLast={step === 3} />}

      <DetailModal
        item={modalItem}
        selected={!!modalItem && (booking.mode === "single" ? booking.service?.id === modalItem.id : booking.plan?.id === modalItem.id)}
        onClose={() => setModalItem(null)}
        onSelect={() => {
          if (!modalItem) return;
          setBooking((current) => ({ ...current, service: current.mode === "single" ? modalItem : current.service, plan: current.mode === "pack" ? modalItem : current.plan }));
          setModalItem(null);
        }}
      />
    </div>
  );
}
