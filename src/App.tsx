import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ==================================================================================
// THALYSON MASSAGENS — V27 UX PESADO
// Fluxo de agendamento redesenhado com foco em clareza, leitura confortável,
// carrosséis horizontais, autosave e WhatsApp. A STORAGE_KEY foi preservada.
// ==================================================================================

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/thalyson.massagens',
  STORAGE_KEY: '@thaly_app_v27_premium_plans',
  PIX_KEY: '62.922.530/0001-14',
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5.0,
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000,
} as const;

// Coloque suas fotos reais na pasta /public/fotos/ com estes nomes
// ou troque os caminhos abaixo pelas URLs das imagens hospedadas.
const PHOTO_CONFIG = [
  {
    id: 'hero',
    src: '/fotos/thalyson-hero.jpg',
    label: 'Quem vai te atender',
    title: 'Thalyson, seu atendimento sem clima estranho',
    desc: 'Use aqui uma foto sua natural, com luz bonita, olhar acolhedor e fundo limpo.',
  },
  {
    id: 'setup',
    src: '/fotos/thalyson-ambiente.jpg',
    label: 'Ambiente',
    title: 'Toalha, óleo, calma e privacidade',
    desc: 'Foto do kit, maca, toalhas ou um detalhe elegante do preparo.',
  },
  {
    id: 'details',
    src: '/fotos/thalyson-detalhe.jpg',
    label: 'Detalhes',
    title: 'Cuidado nos pequenos sinais',
    desc: 'Foto de mãos, óleo, vela, textura ou produto. Não precisa mostrar demais.',
  },
  {
    id: 'aftercare',
    src: '/fotos/thalyson-pos.jpg',
    label: 'Pós-cuidado',
    title: 'Você sai mais leve do que chegou',
    desc: 'Foto conceitual para fechar a experiência: água, chá, toalha ou luz baixa.',
  },
] as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

type Lang = 'pt' | 'en';
type BookingKind = 'single' | 'pack';
type LocationType = 'home' | 'studio' | 'hotel';
type PaymentType = '' | 'pix' | 'card' | 'cash';
type IntentKey = 'all' | 'relax' | 'pain' | 'premium' | 'quick';
type StepKey = 0 | 1 | 2 | 3 | 4;

interface ServiceItem {
  id: string;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details: string[];
  intent: IntentKey;
  type: BookingKind;
  popular?: boolean;
  vibe?: string;
  fullPrice?: number;
  savings?: number;
}

interface ExtraItem {
  id: string;
  price: number;
  icon: string;
  label: string;
  desc: string;
  goodFor?: string[];
}

interface Coupon {
  id: string;
  val: number;
  title: string;
  code: string;
}

interface UserData {
  name: string;
  xp: number;
  coupons: Coupon[];
  usedCoupons: string[];
  hasSeenWelcome: boolean;
  ordersCount: number;
  lastActivity: string;
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
  type: BookingKind;
  cart: ServiceItem[];
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: LocationType;
  address: Address;
  payment: PaymentType;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  bookingId: string;
  mediaAllowed: boolean;
  note: string;
}

interface ToastItem {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info';
}

interface Financials {
  subtotal: number;
  extrasTotal: number;
  couponDiscount: number;
  mediaDiscount: number;
  pixDiscount: number;
  rushFee: number;
  total: number;
  duration: number;
}

const ICON_PATHS: Record<string, string> = {
  menu: 'M4 12h16M4 6h16M4 18h16',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  chevronLeft: 'M15 18l-6-6 6-6',
  chevronRight: 'M9 18l6-6-6-6',
  chevronDown: 'M6 9l6 6 6-6',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  mapPin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z',
  building: 'M4 22V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M4 22h16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1',
  hotel: 'M3 21V7a2 2 0 0 1 2-2h7v16M12 9h7a2 2 0 0 1 2 2v10M7 10h1M7 14h1M16 14h1',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3.09 5.18 2 2 0 0 1 5.11 3h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L9 10.6a16 16 0 0 0 4.4 4.4l1.27-1.23a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z',
  message: 'M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  sparkles: 'M12 2l1.55 5.95L19.5 9.5l-5.95 1.55L12 17l-1.55-5.95L4.5 9.5l5.95-1.55L12 2zM19 15v4M21 17h-4M5 16v3M6.5 17.5h-3',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.5 14 7 22l5-3 5 3-1.5-8',
  gift: 'M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z',
  tag: 'M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
  copy: 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2M16 3h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
  trash: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2',
  sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M18.36 5.64l-1.41 1.41M7.05 16.95l-1.41 1.41M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  globe: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  alert: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  sliders: 'M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4',
};

const emptyAddress: Address = {
  cep: '',
  street: '',
  number: '',
  district: '',
  city: '',
  comp: '',
  placeName: '',
};

const defaultUser: UserData = {
  name: '',
  xp: 0,
  coupons: [],
  usedCoupons: [],
  hasSeenWelcome: false,
  ordersCount: 92,
  lastActivity: '',
};

const defaultBooking: BookingData = {
  type: 'single',
  cart: [],
  extras: {},
  date: null,
  time: null,
  locationType: 'home',
  address: emptyAddress,
  payment: '',
  appliedCoupon: null,
  termsAccepted: false,
  bookingId: `BOOK_${Date.now()}`,
  mediaAllowed: false,
  note: '',
};

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
const sanitizeInput = (v: unknown): string => String(v ?? '').replace(/[<>&"']/g, '').slice(0, 180);
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const onlyDigits = (v: string) => v.replace(/\D/g, '');
const validateAddress = (a: Address) => Boolean(a.street && a.number && a.district && a.city);
const toISODate = (date: Date) => date.toISOString().split('T')[0];
const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
const isBrowser = () => typeof window !== 'undefined';

const formatMoney = (value: number, lang: Lang) => {
  const converted = lang === 'pt' ? value : value / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
  }).format(converted || 0);
};

const safeVibrate = (pattern: number | number[] = 28) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    // Sem suporte.
  }
};

const getData = (lang: Lang) => {
  const en = lang === 'en';

  const services: ServiceItem[] = [
    {
      id: 'relaxante',
      intent: 'relax',
      type: 'single',
      min: 50,
      price: 157,
      icon: 'sun',
      tag: en ? 'BODY PAUSE' : 'PAUSA DO CORPO',
      title: en ? 'Classic Relax' : 'Relaxante Clássica',
      vibe: en ? 'When the body asks for silence.' : 'Quando o corpo pede silêncio.',
      desc: en
        ? 'For that day when the shoulders are up, the jaw is tight and the mind will not shut up.'
        : 'Para aquele dia em que o ombro está lá em cima, a mandíbula travou e a cabeça não cala.',
      details: en
        ? ['Quick body check before starting', 'Pressure adjusted to your limit', 'Slow rhythm to make your body surrender', 'A calmer finish so you do not leave dizzy']
        : ['Leitura rápida do corpo antes de começar', 'Pressão ajustada ao seu limite', 'Ritmo lento para o corpo ir soltando', 'Finalização calma para você não sair “tonto”'],
    },
    {
      id: 'sensitiva',
      intent: 'relax',
      type: 'single',
      min: 60,
      price: 177,
      icon: 'sparkles',
      tag: en ? 'HEAD OFF' : 'DESLIGA A CABEÇA',
      title: en ? 'Sensory Ritual' : 'Ritual Sensorial',
      vibe: en ? 'Light touch, deep reset.' : 'Toque leve, reset profundo.',
      desc: en
        ? 'For anxiety, emotional overload and that feeling of being tired even after sleeping.'
        : 'Para ansiedade, sobrecarga emocional e aquela sensação de estar cansado mesmo depois de dormir.',
      details: en
        ? ['Soft light, oil and slower rhythm', 'Gentle sensory stimulation', 'Breathing pauses during the session', 'Best for mental exhaustion']
        : ['Luz mais baixa, óleo e ritmo mais lento', 'Estímulos sensoriais suaves', 'Pausas de respiração durante a sessão', 'Melhor para exaustão mental'],
      popular: true,
    },
    {
      id: 'crossfit',
      intent: 'pain',
      type: 'single',
      min: 60,
      price: 187,
      icon: 'award',
      tag: en ? 'UNLOCK' : 'DESTRAVA',
      title: en ? 'Athlete Recovery' : 'Recuperação para Atletas',
      vibe: en ? 'For training, posture and pain points.' : 'Para treino, postura e pontos de dor.',
      desc: en
        ? 'A firmer session for people who train, work standing, drive a lot or feel the back complaining.'
        : 'Uma sessão mais firme para quem treina, trabalha em pé, dirige muito ou sente as costas reclamando.',
      details: en
        ? ['Firm pressure without forcing pain', 'Back, shoulders, hips or legs focus', 'Stretching support', 'Thermal cream when needed']
        : ['Pressão firme sem forçar dor', 'Foco em costas, ombros, quadril ou pernas', 'Apoio com alongamentos', 'Creme térmico quando fizer sentido'],
    },
    {
      id: 'mista',
      intent: 'premium',
      type: 'single',
      min: 75,
      price: 207,
      icon: 'refresh',
      tag: en ? 'COMPLETE' : 'A MAIS COMPLETA',
      title: en ? 'Fusion Experience' : 'Experiência Fusion',
      vibe: en ? 'The safest choice when you want everything.' : 'A escolha segura quando você quer tudo.',
      desc: en
        ? 'It starts by taking the weight off the body and turns into a fuller, slower and more memorable ritual.'
        : 'Começa tirando o peso do corpo e vira um ritual mais completo, lento e marcante.',
      details: en
        ? ['Muscular relief first', 'Ambience and aromatherapy', 'More time for the body to settle', 'Aftercare orientation']
        : ['Primeiro alívio muscular', 'Ambiente e aromaterapia', 'Mais tempo para o corpo entrar no clima', 'Orientação pós-cuidado'],
      popular: true,
    },
    {
      id: 'nuru',
      intent: 'premium',
      type: 'single',
      min: 75,
      price: 317,
      icon: 'star',
      tag: en ? 'SPA GEL' : 'SPA COM GEL',
      title: en ? 'Nuru Spa Ritual' : 'Ritual Nuru Spa',
      vibe: en ? 'Premium, slow, glossy and immersive.' : 'Premium, lento, brilhoso e imersivo.',
      desc: en
        ? 'A special gel-based spa ritual. More ambience, more preparation, more presence.'
        : 'Um ritual spa especial com gel. Mais ambiente, mais preparo, mais presença.',
      details: en
        ? ['Prepared towels and gel', 'Slow gliding technique', 'Warm shower recommendation', 'Hydrating finish']
        : ['Toalhas e gel preparados', 'Técnica de deslizamento lenta', 'Recomendação de banho morno', 'Finalização hidratante'],
    },
    {
      id: 'pes',
      intent: 'quick',
      type: 'single',
      min: 35,
      price: 110,
      icon: 'clock',
      tag: en ? 'QUICK' : 'RÁPIDA',
      title: en ? 'Foot Relief' : 'Alívio para os Pés',
      vibe: en ? 'Small session. Big relief.' : 'Sessão pequena. Alívio grande.',
      desc: en
        ? 'Perfect after a standing day, walking a lot or feeling your legs heavy.'
        : 'Perfeita depois de um dia em pé, caminhando muito ou sentindo as pernas pesadas.',
      details: en
        ? ['Foot hygiene protocol', 'Pressure points', 'Cooling finish', 'Fast and objective']
        : ['Protocolo de higiene dos pés', 'Pontos de pressão', 'Finalização refrescante', 'Rápida e objetiva'],
    },
    {
      id: 'maos',
      intent: 'quick',
      type: 'single',
      min: 35,
      price: 110,
      icon: 'sparkles',
      tag: en ? 'HANDS' : 'MÃOS',
      title: en ? 'Hands and Wrists' : 'Mãos e Punhos',
      vibe: en ? 'For those who type, create and work with hands.' : 'Para quem digita, cria e trabalha com as mãos.',
      desc: en
        ? 'Relief for hands, wrists and forearms after repetitive effort.'
        : 'Alívio para mãos, punhos e antebraços depois de esforço repetitivo.',
      details: en
        ? ['Palm release', 'Wrist mobility', 'Forearm massage', 'Hydrating finish']
        : ['Liberação da palma', 'Mobilidade de punhos', 'Massagem em antebraço', 'Finalização hidratante'],
    },
    {
      id: 'depilacao',
      intent: 'quick',
      type: 'single',
      min: 50,
      price: 107,
      icon: 'shield',
      tag: en ? 'BODY CARE' : 'CUIDADO',
      title: en ? 'Body Hair Trim' : 'Aparo Corporal',
      vibe: en ? 'Clean look without salon drama.' : 'Visual limpo sem novela de salão.',
      desc: en
        ? 'A practical body grooming session with discretion and a clean finish.'
        : 'Um cuidado prático para deixar o corpo mais limpo, leve e alinhado.',
      details: en
        ? ['Machine trim with chosen guard', 'Up to two regions', 'Discreet appointment', 'Aftercare guidance']
        : ['Aparo com máquina e pente escolhido', 'Até duas regiões', 'Atendimento discreto', 'Orientação de cuidado depois'],
    },
  ];

  const plans: ServiceItem[] = [
    {
      id: 'pack_essencial',
      intent: 'premium',
      type: 'pack',
      min: 60,
      price: 297,
      fullPrice: 334,
      savings: 37,
      icon: 'gift',
      tag: en ? '2X MONTH' : '2X NO MÊS',
      title: en ? 'Do Not Let It Accumulate' : 'Não Deixa Acumular',
      vibe: en ? 'The minimum to stay well.' : 'O mínimo para ficar bem.',
      desc: en
        ? 'Two sessions in the month: one to loosen the body, another to calm the mind.'
        : 'Duas sessões no mês: uma para soltar o corpo, outra para acalmar a mente.',
      details: en
        ? ['1 Classic Relax', '1 Sensory Ritual', 'Reminder on WhatsApp', 'Good for first month']
        : ['1 Relaxante Clássica', '1 Ritual Sensorial', 'Lembrete pelo WhatsApp', 'Bom para primeiro mês'],
    },
    {
      id: 'pack_interativo',
      intent: 'premium',
      type: 'pack',
      min: 75,
      price: 387,
      fullPrice: 467,
      savings: 80,
      icon: 'heart',
      tag: en ? 'BEST CHOICE' : 'MELHOR ESCOLHA',
      title: en ? 'Month With Breath' : 'Mês Com Respiro',
      vibe: en ? 'For people who carry too much.' : 'Para quem carrega coisa demais.',
      desc: en
        ? 'A stronger month plan with relief, ritual and priority scheduling.'
        : 'Um plano mensal mais forte com alívio, ritual e prioridade na agenda.',
      details: en
        ? ['1 Recovery or Classic', '1 Fusion Experience', 'Priority schedule window', 'More value than booking separately']
        : ['1 Recuperação ou Clássica', '1 Experiência Fusion', 'Janela de prioridade na agenda', 'Mais vantagem que avulso'],
      popular: true,
    },
    {
      id: 'pack_premium',
      intent: 'premium',
      type: 'pack',
      min: 75,
      price: 637,
      fullPrice: 721,
      savings: 84,
      icon: 'award',
      tag: en ? '3X MONTH' : '3X NO MÊS',
      title: en ? 'Body on Maintenance' : 'Corpo em Manutenção',
      vibe: en ? 'For those who want to feel cared for all month.' : 'Para sentir cuidado o mês inteiro.',
      desc: en
        ? 'Three appointments for a full month of care, recovery and premium ritual.'
        : 'Três encontros para um mês inteiro de cuidado, recuperação e ritual premium.',
      details: en
        ? ['1 Body Freedom Ritual', '1 Fusion Experience', '1 Nuru Spa Ritual', 'Best for routine care']
        : ['1 Ritual Corpo Livre', '1 Experiência Fusion', '1 Ritual Nuru Spa', 'Melhor para rotina de cuidado'],
    },
  ];

  const extras: ExtraItem[] = [
    { id: 'aroma', price: 17, icon: 'sparkles', label: en ? 'Aromatherapy' : 'Aromaterapia', desc: en ? 'A softer smell in the room. Helps the body understand it can slow down.' : 'Um cheiro mais gostoso no ambiente. Ajuda o corpo a entender que pode desacelerar.', goodFor: ['relaxante', 'sensitiva', 'mista'] },
    { id: 'pain_relief', price: 17, icon: 'award', label: en ? 'Pain Focus' : 'Foco em Dor', desc: en ? 'One pain point receives more attention, with pressure and thermal cream when needed.' : 'Um ponto de dor recebe mais atenção, com pressão e creme térmico quando precisar.', goodFor: ['crossfit', 'relaxante'] },
    { id: 'more_time', price: 77, icon: 'clock', label: en ? '+30 Minutes' : '+30 Minutos', desc: en ? 'For people who hate rushing. More time, more calm, better ending.' : 'Para quem odeia pressa. Mais tempo, mais calma, melhor fechamento.' },
    { id: 'hair_trim', price: 57, icon: 'shield', label: en ? 'Body Trim Add-on' : 'Aparo Corporal Extra', desc: en ? 'Add grooming in up to two body areas.' : 'Inclui aparo em até duas áreas do corpo.' },
    { id: 'hot_towel', price: 27, icon: 'sun', label: en ? 'Hot Towel' : 'Toalha Quente', desc: en ? 'Warm towel on neck, shoulders or feet. Small thing, big difference.' : 'Toalha quente no pescoço, ombros ou pés. Pequeno detalhe, muda tudo.' },
    { id: 'silence', price: 0, icon: 'moon', label: en ? 'Quiet Session' : 'Sessão em Silêncio', desc: en ? 'Less talking. Just guidance when needed.' : 'Menos conversa. Só orientação quando precisar.' },
    { id: 'aftercare', price: 17, icon: 'gift', label: en ? 'Aftercare Pause' : 'Pausa Pós-Cuidado', desc: en ? 'Five minutes to drink water, breathe and come back calmly.' : 'Cinco minutos para beber água, respirar e voltar com calma.' },
  ];

  const text = {
    appName: en ? 'Thalyson Massagens' : 'Thalyson Massagens',
    appSub: en ? 'booking without confusion' : 'agendamento sem confusão',
    heroKicker: en ? 'V27 preserved · new flow' : 'V27 preservada · fluxo novo',
    heroTitle: en ? 'Your body asks for pause before your agenda allows it.' : 'Seu corpo pede pausa antes da sua agenda deixar.',
    heroSub: en
      ? 'Choose what you need, slide through the options, pick the time and send everything ready to WhatsApp. No heavy form. No guessing.'
      : 'Escolha o que você precisa, arraste as opções, marque o horário e mande tudo pronto no WhatsApp. Sem formulário pesado. Sem ficar perdido.',
    heroCta: en ? 'Choose my session' : 'Escolher minha sessão',
    photoTip: en ? 'Add your real photos here' : 'Adicione suas fotos reais aqui',
    photosTitle: en ? 'The page needs your face, but with taste.' : 'A página precisa do seu rosto, mas com bom gosto.',
    photosDesc: en
      ? 'Use photos as trust points: who serves, ambience, details and aftercare. Too many photos before the booking can distract.'
      : 'Use fotos como pontos de confiança: quem atende, ambiente, detalhes e pós-cuidado. Foto demais antes do agendamento pode distrair.',
    socialProof: en ? 'clients already felt lighter' : 'clientes já saíram mais leves',
    xp: en ? 'Care XP' : 'XP de cuidado',
    step0: en ? 'Choose' : 'Escolher',
    step1: en ? 'Place' : 'Local',
    step2: en ? 'Time' : 'Horário',
    step3: en ? 'Finish' : 'Fechar',
    services: en ? 'Sessions' : 'Sessões',
    plans: en ? 'Monthly packs' : 'Pacotes mensais',
    single: en ? 'Single session' : 'Sessão avulsa',
    continue: en ? 'Continue' : 'Continuar',
    back: en ? 'Back' : 'Voltar',
    finish: en ? 'Send to WhatsApp' : 'Enviar no WhatsApp',
    edit: en ? 'Edit' : 'Editar',
    selected: en ? 'selected' : 'selecionado',
    popular: en ? 'Most chosen' : 'Mais escolhida',
    from: en ? 'from' : 'a partir de',
    save: en ? 'save' : 'economize',
    details: en ? 'See what happens' : 'Ver como funciona',
    addThis: en ? 'I want this' : 'Quero essa',
    selectedThis: en ? 'Chosen' : 'Escolhida',
    chooseByNeed: en ? 'First, tell me what your body is asking for.' : 'Primeiro, me diz o que seu corpo está pedindo.',
    chooseByNeedSub: en
      ? 'This filter exists so you do not have to read everything. Tap a need and the list becomes smaller.'
      : 'Esse filtro existe para você não precisar ler tudo. Toque numa necessidade e a lista fica menor.',
    all: en ? 'Show all' : 'Ver tudo',
    relax: en ? 'I want to relax' : 'Quero relaxar',
    pain: en ? 'I need to unlock pain' : 'Preciso destravar dor',
    premium: en ? 'I want something complete' : 'Quero algo completo',
    quick: en ? 'I need quick care' : 'Preciso de algo rápido',
    horizontalHint: en ? 'Swipe sideways to compare.' : 'Arraste para o lado para comparar.',
    whyThisFlow: en ? 'Why this flow works' : 'Por que esse fluxo funciona',
    flow1: en ? 'First intention' : 'Primeiro intenção',
    flow1Desc: en ? 'The user chooses by how they feel, not by technical service names.' : 'A pessoa escolhe pelo que sente, não por nomes técnicos de serviço.',
    flow2: en ? 'Then one clear choice' : 'Depois uma escolha clara',
    flow2Desc: en ? 'Cards slide sideways and avoid a giant vertical catalog.' : 'Cards rolam para o lado e evitam aquele catálogo gigante vertical.',
    flow3: en ? 'Only then details' : 'Detalhes só depois',
    flow3Desc: en ? 'Location, date, extras and payment appear when needed.' : 'Local, data, extras e pagamento aparecem só quando fazem sentido.',
    nameLocationTitle: en ? 'Now I need the boring part, but I made it light.' : 'Agora a parte chata, mas deixei leve.',
    nameLocationSub: en
      ? 'Tell me your name and where the session will happen. The final address can still be confirmed on WhatsApp.'
      : 'Me diga seu nome e onde vai ser. O endereço final ainda pode ser confirmado no WhatsApp.',
    name: en ? 'Name or nickname' : 'Nome ou apelido',
    cep: en ? 'ZIP/CEP' : 'CEP',
    street: en ? 'Street' : 'Rua ou avenida',
    number: en ? 'Number' : 'Número',
    district: en ? 'Neighborhood' : 'Bairro',
    city: en ? 'City' : 'Cidade',
    comp: en ? 'Complement / room' : 'Complemento / quarto',
    hotelName: en ? 'Hotel name' : 'Nome do hotel',
    note: en ? 'Anything I should know?' : 'Algo que eu preciso saber?',
    notePlaceholder: en ? 'Example: neck pain, prefer silence, building entrance...' : 'Ex: dor no pescoço, prefiro silêncio, entrada do prédio...',
    home: en ? 'My place' : 'Minha casa',
    studio: en ? 'Your studio' : 'Seu studio',
    hotel: en ? 'Hotel' : 'Hotel',
    studioHint: en ? 'Studio address is sent after WhatsApp confirmation.' : 'O endereço do studio é enviado após confirmar pelo WhatsApp.',
    travelHint: en ? 'Travel fee is confirmed on WhatsApp.' : 'Deslocamento é confirmado pelo WhatsApp.',
    timeTitle: en ? 'Pick the day without fighting the calendar.' : 'Escolha o dia sem brigar com calendário.',
    timeSub: en
      ? 'Days and times also slide sideways on mobile. The calmest option is marked for you.'
      : 'Dias e horários também rolam para o lado no celular. O horário mais tranquilo fica marcado para você.',
    chooseDate: en ? 'Choose a day' : 'Escolha o dia',
    chooseTime: en ? 'Choose a time' : 'Escolha o horário',
    smartSuggestion: en ? 'Best flow' : 'Melhor fluxo',
    lowDemand: en ? 'lower demand' : 'menor demanda',
    rush: en ? 'rush' : 'pico',
    today: en ? 'Today' : 'Hoje',
    tomorrow: en ? 'Tomorrow' : 'Amanhã',
    noSlots: en ? 'No times left today.' : 'Sem horários livres nesse dia.',
    finishTitle: en ? 'Last screen: make it easy to say yes.' : 'Última tela: facilite o sim.',
    finishSub: en
      ? 'Extras are optional. Summary stays visible so the user never feels lost.'
      : 'Extras são opcionais. O resumo fica visível para ninguém se perder no final.',
    extrasTitle: en ? 'Want to make it better?' : 'Quer deixar melhor?',
    extrasSub: en ? 'Optional additions. Skip everything if you want.' : 'Adicionais opcionais. Pode pular tudo se quiser.',
    coupon: en ? 'Coupon' : 'Cupom',
    couponPlaceholder: en ? 'Type code' : 'Digite o código',
    apply: en ? 'Apply' : 'Aplicar',
    payment: en ? 'Payment at the session' : 'Pagamento no atendimento',
    pix: en ? 'Pix - 3% off' : 'Pix - 3% off',
    card: en ? 'Card' : 'Cartão',
    cash: en ? 'Cash' : 'Dinheiro',
    portfolio: en ? 'Use anonymous aesthetic photo and get 1% off' : 'Usar foto estética anônima e ganhar 1% off',
    portfolioDesc: en
      ? 'Only hands, oil, towel, silhouette or ambience. Never face, documents or exposure.'
      : 'Só mãos, óleo, toalha, silhueta ou ambiente. Nunca rosto, documento ou exposição.',
    terms: en ? 'Read and accept the agreement' : 'Ler e aceitar o combinado',
    termsModalTitle: en ? 'Quick agreement' : 'Combinado rápido',
    accept: en ? 'I read and accept' : 'Li e aceito',
    summary: en ? 'Your booking' : 'Seu agendamento',
    subtotal: en ? 'Subtotal' : 'Subtotal',
    extrasTotal: en ? 'Extras' : 'Extras',
    discount: en ? 'Discount' : 'Desconto',
    pixDiscount: en ? 'Pix discount' : 'Desconto Pix',
    mediaDiscount: en ? 'Photo support' : 'Apoio foto',
    rushFee: en ? 'Rush fee' : 'Taxa de pico',
    total: en ? 'Total' : 'Total',
    duration: en ? 'Duration' : 'Duração',
    successTitle: en ? 'Ready. Now just send it.' : 'Pronto. Agora é só enviar.',
    successSub: en
      ? 'WhatsApp opens with the complete request. Send the message and I confirm availability there.'
      : 'O WhatsApp abre com o pedido completo. Envie a mensagem e eu confirmo a disponibilidade por lá.',
    openWhatsapp: en ? 'Open WhatsApp again' : 'Abrir WhatsApp de novo',
    restart: en ? 'Start another booking' : 'Fazer outro agendamento',
    emptyCart: en ? 'Choose one session to continue.' : 'Escolha uma sessão para continuar.',
    invalidName: en ? 'Type a name with at least 3 characters.' : 'Digite um nome com pelo menos 3 caracteres.',
    invalidAddress: en ? 'Complete the location fields.' : 'Complete os dados do local.',
    invalidTime: en ? 'Choose a day and time.' : 'Escolha um dia e horário.',
    invalidPayment: en ? 'Choose payment and accept the agreement.' : 'Escolha o pagamento e aceite o combinado.',
    saved: en ? 'Saved automatically.' : 'Salvo automaticamente.',
    cepFound: en ? 'Address found.' : 'Endereço encontrado.',
    cepError: en ? 'CEP not found. Fill manually.' : 'CEP não encontrado. Preencha manualmente.',
    couponOk: en ? 'Coupon applied.' : 'Cupom aplicado.',
    couponBad: en ? 'Invalid or already used coupon.' : 'Cupom inválido ou já usado.',
    copied: en ? 'Copied.' : 'Copiado.',
    readableMode: en ? 'Readable mode' : 'Modo legível',
    menu: en ? 'Menu' : 'Menu',
    theme: en ? 'Theme' : 'Tema',
    dark: en ? 'Dark' : 'Escuro',
    light: en ? 'Light' : 'Claro',
    faq: en ? 'Questions' : 'Dúvidas',
    safety: en ? 'Comfort rules' : 'Regras de conforto',
    giftSaved: en ? 'Gift saved.' : 'Presente salvo.',
    welcomeTitle: en ? 'I made the booking easier for you.' : 'Deixei o agendamento mais fácil para você.',
    welcomeMsg: en
      ? 'Here the idea is simple: choose the feeling, choose the session, choose the time. To start well, I left a first-visit gift.'
      : 'A ideia aqui é simples: escolha a sensação, escolha a sessão, escolha o horário. Para começar bem, deixei um presente de primeira visita.',
    claimGift: en ? 'Get first gift' : 'Pegar presente',
    skip: en ? 'Close' : 'Fechar',
    remove: en ? 'Remove' : 'Remover',
    copiedPix: en ? 'Pix key copied.' : 'Chave Pix copiada.',
  };

  const rules = [
    {
      icon: 'shield',
      title: en ? 'Respect first' : 'Respeito primeiro',
      description: en
        ? 'The session starts with a quick alignment of comfort, pressure and boundaries.'
        : 'A sessão começa com um alinhamento rápido de conforto, pressão e limites.',
    },
    {
      icon: 'home',
      title: en ? 'Clean space, calm body' : 'Espaço limpo, corpo calmo',
      description: en
        ? 'A clean room, towel, shower and water nearby make the experience better.'
        : 'Ambiente limpo, toalha, banho e água por perto deixam a experiência melhor.',
    },
    {
      icon: 'message',
      title: en ? 'WhatsApp confirms' : 'WhatsApp confirma',
      description: en
        ? 'The website prepares the request. The exact confirmation happens in WhatsApp.'
        : 'O site prepara o pedido. A confirmação exata acontece pelo WhatsApp.',
    },
  ];

  const faq = [
    {
      q: en ? 'Why horizontal sections?' : 'Por que as sessões rolam para o lado?',
      a: en
        ? 'Because booking is a comparison task. Horizontal cards make it easier to compare options without scrolling forever.'
        : 'Porque agendamento é uma tarefa de comparação. Cards horizontais ajudam a comparar sem virar uma lista infinita.',
    },
    {
      q: en ? 'Where are my data saved?' : 'Onde meus dados ficam salvos?',
      a: en
        ? 'Only in your browser, with the same V27 storage key. If the cache is cleared, local progress can reset.'
        : 'Apenas no seu navegador, com a mesma chave da V27. Se limpar cache, o progresso local pode zerar.',
    },
    {
      q: en ? 'Can I send my real photos later?' : 'Posso colocar minhas fotos reais depois?',
      a: en
        ? 'Yes. Replace the paths in PHOTO_CONFIG or put images in /public/fotos with the suggested names.'
        : 'Sim. Troque os caminhos em PHOTO_CONFIG ou coloque imagens em /public/fotos com os nomes sugeridos.',
    },
  ];

  return { services, plans, extras, rules, faq, text };
};

const Icon = memo(({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name] || ICON_PATHS.sparkles} />
  </svg>
));
Icon.displayName = 'Icon';

const GlobalStyles = memo(({ isDark, readable }: { isDark: boolean; readable: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Inter:wght@400;500;600;700;800;900&display=swap');

    :root {
      --font-readable: 'Atkinson Hyperlegible', Inter, Arial, sans-serif;
      --font-ui: ${readable ? "'Atkinson Hyperlegible', Inter, Arial, sans-serif" : "Inter, 'Atkinson Hyperlegible', Arial, sans-serif"};
      --bg: ${isDark ? '#07090d' : '#f7f1e8'};
      --surface: ${isDark ? '#10141c' : '#fffdf8'};
      --surface-2: ${isDark ? '#151b25' : '#fbf6ed'};
      --surface-3: ${isDark ? '#1d2532' : '#f0e6d8'};
      --text: ${isDark ? '#fbf7ef' : '#17130f'};
      --muted: ${isDark ? '#b5aa9c' : '#675b4d'};
      --soft: ${isDark ? '#80776b' : '#978a7d'};
      --border: ${isDark ? 'rgba(255,255,255,.09)' : 'rgba(42,29,18,.12)'};
      --strong-border: ${isDark ? 'rgba(255,255,255,.18)' : 'rgba(42,29,18,.22)'};
      --blue: #3b82f6;
      --amber: #f3b23d;
      --emerald: #10b981;
      --rose: #f43f5e;
      --shadow: ${isDark ? '0 24px 90px rgba(0,0,0,.40)' : '0 24px 90px rgba(80,52,20,.12)'};
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    html, body { margin: 0; min-height: 100%; background: var(--bg); color: var(--text); font-family: var(--font-ui); -webkit-font-smoothing: antialiased; text-rendering: geometricPrecision; }
    body { overscroll-behavior-y: none; }
    button, input, textarea { font-family: inherit; }
    button { -webkit-tap-highlight-color: transparent; }
    a { color: inherit; }

    .readable-copy { font-family: var(--font-readable); font-size: ${readable ? '1.075rem' : '1rem'}; line-height: ${readable ? '1.9' : '1.7'}; letter-spacing: ${readable ? '.015em' : '0'}; }
    .readable-small { font-family: var(--font-readable); line-height: ${readable ? '1.75' : '1.55'}; letter-spacing: ${readable ? '.01em' : '0'}; }
    .text-balance { text-wrap: balance; }
    .scrollbar-none::-webkit-scrollbar { display: none; }
    .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

    ::selection { background: rgba(59,130,246,.22); }
    ::-webkit-scrollbar { width: 10px; height: 10px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--strong-border); border-radius: 999px; border: 3px solid transparent; background-clip: padding-box; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes scaleIn { from { opacity: 0; transform: scale(.94); } to { opacity: 1; transform: scale(1); } }
    @keyframes slideToast { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulseDot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(.82); } }
    @keyframes shimmer { 0% { background-position: -160% center; } 100% { background-position: 160% center; } }

    .animate-fade-up { animation: fadeUp .45s cubic-bezier(.16, 1, .3, 1) both; }
    .animate-scale-in { animation: scaleIn .28s cubic-bezier(.34, 1.56, .64, 1) both; }
    .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }
    .text-gradient { background: linear-gradient(135deg, var(--text), ${isDark ? '#a7c7ff' : '#5b371f'}, ${isDark ? '#f7c56f' : '#b77420'}); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .shimmer { background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,.26) 45%, transparent 75%); background-size: 220% 100%; animation: shimmer 2.8s linear infinite; }

    .snap-x { scroll-snap-type: x mandatory; }
    .snap-card { scroll-snap-align: start; }

    .focus-ring:focus-visible { outline: 3px solid rgba(59,130,246,.45); outline-offset: 3px; }
    .safe-bottom { padding-bottom: env(safe-area-inset-bottom); }
  ` }} />
));
GlobalStyles.displayName = 'GlobalStyles';

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', full, disabled, icon, className = '', type = 'button', ariaLabel }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'danger' | 'warm';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  icon?: string;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) => {
  const variantClass = {
    primary: 'bg-blue-600 text-white shadow-lg shadow-blue-950/20 hover:bg-blue-500',
    secondary: 'border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--strong-border)] hover:bg-[var(--surface-3)]',
    ghost: 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]',
    whatsapp: 'bg-emerald-500 text-white shadow-lg shadow-emerald-950/20 hover:bg-emerald-400',
    danger: 'bg-rose-500 text-white shadow-lg shadow-rose-950/20 hover:bg-rose-400',
    warm: 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-950/20 hover:bg-amber-300',
  }[variant];

  const sizeClass = {
    sm: 'min-h-10 px-4 py-2 text-sm',
    md: 'min-h-12 px-5 py-3 text-[15px]',
    lg: 'min-h-14 px-6 py-4 text-base',
  }[size];

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'focus-ring inline-flex items-center justify-center gap-2 rounded-2xl font-black transition active:scale-[.98] disabled:pointer-events-none disabled:opacity-45',
        full && 'w-full',
        variantClass,
        sizeClass,
        className,
      )}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 20 : 18} />}
      {children}
    </button>
  );
});
Button.displayName = 'Button';

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', disabled, maxLength, error, inputMode }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  icon?: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  error?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-black text-[var(--text)]">{label}</span>
    <span className={cx(
      'flex min-h-14 items-center gap-3 rounded-2xl border bg-[var(--surface-2)] px-4 transition',
      error ? 'border-rose-500/70' : 'border-[var(--border)] focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10',
      disabled && 'opacity-60',
    )}>
      {icon && <Icon name={icon} size={18} className="text-[var(--soft)]" />}
      <input
        value={value}
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full bg-transparent text-base font-bold text-[var(--text)] outline-none placeholder:text-[var(--soft)]"
      />
    </span>
    {error && <span className="mt-2 block text-sm font-bold text-rose-500">{error}</span>}
  </label>
));
InputField.displayName = 'InputField';

const TextAreaField = memo(({ label, value, onChange, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-black text-[var(--text)]">{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      maxLength={240}
      className="min-h-[112px] w-full resize-none rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-base font-bold leading-relaxed text-[var(--text)] outline-none transition placeholder:text-[var(--soft)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
    />
  </label>
));
TextAreaField.displayName = 'TextAreaField';

const CenterModal = memo(({ open, onClose, title, children, footer, icon = 'sparkles', closeLabel = 'Fechar' }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  icon?: string;
  closeLabel?: string;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-black/62 backdrop-blur-md" onClick={onClose} aria-label={closeLabel} />
      <div className="relative max-h-[88vh] w-full max-w-xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-2xl animate-scale-in">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/20">
              <Icon name={icon} size={22} />
            </div>
            <h2 className="text-balance text-xl font-black leading-tight md:text-2xl">{title}</h2>
          </div>
          <button onClick={onClose} aria-label={closeLabel} className="focus-ring flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--text)]">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-5 md:p-6">
          <div className="readable-copy text-[var(--muted)]">{children}</div>
        </div>
        {footer && <div className="border-t border-[var(--border)] p-5 md:p-6">{footer}</div>}
      </div>
    </div>
  );
});
CenterModal.displayName = 'CenterModal';

const ToastContainer = memo(({ toasts }: { toasts: ToastItem[] }) => (
  <div className="fixed left-1/2 top-4 z-[120] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={cx(
          'rounded-2xl border px-4 py-3 text-sm font-black shadow-2xl backdrop-blur-xl',
          toast.type === 'success' && 'border-emerald-400/30 bg-emerald-500/15 text-emerald-200',
          toast.type === 'error' && 'border-rose-400/30 bg-rose-500/15 text-rose-100',
          toast.type === 'info' && 'border-blue-400/30 bg-blue-500/15 text-blue-100',
        )}
        style={{ animation: 'slideToast .28s ease both' }}
      >
        {toast.msg}
      </div>
    ))}
  </div>
));
ToastContainer.displayName = 'ToastContainer';

const SectionHeader = memo(({ eyebrow, title, desc, right }: { eyebrow?: string; title: string; desc?: string; right?: React.ReactNode }) => (
  <div className="mb-5 flex flex-col gap-4 md:mb-7 md:flex-row md:items-end md:justify-between">
    <div>
      {eyebrow && <p className="mb-2 text-[12px] font-black uppercase tracking-[.18em] text-blue-500">{eyebrow}</p>}
      <h2 className="text-balance text-2xl font-black leading-tight tracking-[-.03em] md:text-4xl">{title}</h2>
      {desc && <p className="readable-copy mt-3 max-w-3xl text-[var(--muted)]">{desc}</p>}
    </div>
    {right}
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const HorizontalRail = memo(({ children, label }: { children: React.ReactNode; label?: string }) => {
  const railRef = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: 'left' | 'right') => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        {label && <p className="text-sm font-black text-[var(--soft)]">{label}</p>}
        <div className="ml-auto hidden gap-2 md:flex">
          <button onClick={() => scroll('left')} className="focus-ring flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"><Icon name="chevronLeft" size={18} /></button>
          <button onClick={() => scroll('right')} className="focus-ring flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:text-[var(--text)]"><Icon name="chevronRight" size={18} /></button>
        </div>
      </div>
      <div ref={railRef} className="scrollbar-none snap-x -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
        {children}
      </div>
    </div>
  );
});
HorizontalRail.displayName = 'HorizontalRail';

const PhotoFrame = memo(({ photo, large = false }: { photo: typeof PHOTO_CONFIG[number]; large?: boolean }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cx(
      'snap-card group relative shrink-0 overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]',
      large ? 'h-[420px] w-full' : 'h-[330px] w-[82vw] sm:w-[360px]',
    )}>
      {!failed ? (
        <img src={photo.src} alt={photo.title} onError={() => setFailed(true)} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
      ) : (
        <div className="relative flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600/20 via-amber-400/20 to-[var(--surface-3)] p-8 text-center">
          <div className="absolute inset-0 shimmer opacity-50" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white">
              <Icon name="user" size={28} />
            </div>
            <p className="text-sm font-black uppercase tracking-[.16em] text-blue-500">Foto sua aqui</p>
            <h3 className="mt-2 text-2xl font-black">{photo.title}</h3>
            <p className="readable-small mt-3 text-sm font-bold text-[var(--muted)]">Troque <code className="rounded bg-[var(--surface)] px-1">{photo.src}</code> por uma foto real.</p>
          </div>
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-white">
        <p className="text-[11px] font-black uppercase tracking-[.18em] text-blue-200">{photo.label}</p>
        <h3 className="mt-1 text-xl font-black leading-tight">{photo.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm font-bold leading-relaxed text-white/75">{photo.desc}</p>
      </div>
    </div>
  );
});
PhotoFrame.displayName = 'PhotoFrame';

const IntentPicker = memo(({ active, onChange, T }: { active: IntentKey; onChange: (intent: IntentKey) => void; T: ReturnType<typeof getData>['text'] }) => {
  const items: Array<{ id: IntentKey; label: string; icon: string }> = [
    { id: 'all', label: T.all, icon: 'sliders' },
    { id: 'relax', label: T.relax, icon: 'sun' },
    { id: 'pain', label: T.pain, icon: 'award' },
    { id: 'premium', label: T.premium, icon: 'star' },
    { id: 'quick', label: T.quick, icon: 'clock' },
  ];

  return (
    <div className="scrollbar-none -mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onChange(item.id)}
          className={cx(
            'focus-ring flex min-h-12 shrink-0 items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-black transition',
            active === item.id ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] hover:border-[var(--strong-border)] hover:text-[var(--text)]',
          )}
        >
          <Icon name={item.icon} size={18} />
          {item.label}
        </button>
      ))}
    </div>
  );
});
IntentPicker.displayName = 'IntentPicker';

const ServiceCard = memo(({ item, selected, onSelect, onDetails, lang, T }: {
  item: ServiceItem;
  selected: boolean;
  onSelect: (item: ServiceItem) => void;
  onDetails: (item: ServiceItem) => void;
  lang: Lang;
  T: ReturnType<typeof getData>['text'];
}) => (
  <article className={cx(
    'snap-card flex min-h-[440px] w-[86vw] max-w-[390px] shrink-0 flex-col rounded-[2rem] border bg-[var(--surface)] p-5 shadow-[var(--shadow)] transition md:w-[360px]',
    selected ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-[var(--border)] hover:border-[var(--strong-border)]',
  )}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className={cx('flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg', selected ? 'bg-blue-600 shadow-blue-950/20' : 'bg-[var(--surface-3)] text-[var(--text)]')}>
        <Icon name={item.icon} size={25} />
      </div>
      <div className="flex flex-col items-end gap-2">
        {item.popular && <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-black uppercase tracking-[.12em] text-zinc-950">{T.popular}</span>}
        {selected && <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-black uppercase tracking-[.12em] text-white">{T.selected}</span>}
      </div>
    </div>

    <p className="text-[11px] font-black uppercase tracking-[.18em] text-blue-500">{item.tag}</p>
    <h3 className="mt-2 text-2xl font-black leading-tight tracking-[-.02em]">{item.title}</h3>
    {item.vibe && <p className="mt-2 text-sm font-black text-[var(--soft)]">{item.vibe}</p>}
    <p className="readable-small mt-4 text-sm font-bold text-[var(--muted)]">{item.desc}</p>

    <div className="mt-5 space-y-2">
      {item.details.slice(0, 3).map((detail) => (
        <div key={detail} className="flex gap-2 rounded-2xl bg-[var(--surface-2)] p-3 text-sm font-bold text-[var(--muted)]">
          <Icon name="check" size={16} className="mt-0.5 text-emerald-500" />
          <span>{detail}</span>
        </div>
      ))}
    </div>

    <div className="mt-auto pt-5">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[.16em] text-[var(--soft)]">{item.type === 'pack' ? T.plans : T.from}</p>
          <p className="text-2xl font-black text-blue-500">{formatMoney(item.price, lang)}</p>
          {item.fullPrice && <p className="text-sm font-bold text-[var(--soft)] line-through">{formatMoney(item.fullPrice, lang)}</p>}
        </div>
        <div className="rounded-2xl bg-[var(--surface-2)] px-3 py-2 text-right">
          <p className="text-lg font-black">{item.min}min</p>
          {item.savings ? <p className="text-[11px] font-black uppercase text-emerald-500">{T.save} {formatMoney(item.savings, lang)}</p> : null}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <Button full variant={selected ? 'secondary' : 'primary'} icon={selected ? 'check' : 'plus'} onClick={() => onSelect(item)}>{selected ? T.selectedThis : T.addThis}</Button>
        <Button variant="secondary" ariaLabel={T.details} icon="eye" onClick={() => onDetails(item)}>{''}</Button>
      </div>
    </div>
  </article>
));
ServiceCard.displayName = 'ServiceCard';

const StepPills = memo(({ step, setStep, T, canGo }: { step: StepKey; setStep: (s: StepKey) => void; T: ReturnType<typeof getData>['text']; canGo: (s: StepKey) => boolean }) => {
  const steps: Array<{ id: StepKey; label: string; icon: string }> = [
    { id: 0, label: T.step0, icon: 'sparkles' },
    { id: 1, label: T.step1, icon: 'mapPin' },
    { id: 2, label: T.step2, icon: 'calendar' },
    { id: 3, label: T.step3, icon: 'message' },
  ];

  return (
    <div className="scrollbar-none flex gap-2 overflow-x-auto rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface)] p-2">
      {steps.map((item) => {
        const active = step === item.id;
        const done = item.id < step;
        const enabled = canGo(item.id);
        return (
          <button
            key={item.id}
            onClick={() => enabled && setStep(item.id)}
            className={cx(
              'focus-ring flex min-h-11 shrink-0 items-center gap-2 rounded-2xl px-4 py-2 text-sm font-black transition',
              active ? 'bg-blue-600 text-white' : done ? 'bg-[var(--surface-3)] text-[var(--text)]' : 'text-[var(--soft)]',
              !enabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Icon name={done ? 'check' : item.icon} size={17} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
});
StepPills.displayName = 'StepPills';

const PriceLine = memo(({ label, value, negative, positive, muted }: { label: string; value: string; negative?: boolean; positive?: boolean; muted?: boolean }) => (
  <div className={cx('flex items-center justify-between gap-4 text-sm', muted ? 'text-[var(--muted)]' : 'text-[var(--text)]')}>
    <span className="font-bold">{label}</span>
    <span className={cx('font-black', negative && 'text-emerald-500', positive && 'text-amber-500')}>{value}</span>
  </div>
));
PriceLine.displayName = 'PriceLine';

const SummaryCard = memo(({ booking, selectedExtras, financials, lang, T, compact = false }: {
  booking: BookingData;
  selectedExtras: ExtraItem[];
  financials: Financials;
  lang: Lang;
  T: ReturnType<typeof getData>['text'];
  compact?: boolean;
}) => {
  const main = booking.cart[0];
  return (
    <aside className={cx('rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]', !compact && 'lg:sticky lg:top-28')}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-black uppercase tracking-[.16em] text-[var(--soft)]">{T.summary}</p>
          <h3 className="mt-1 text-2xl font-black leading-tight">{main ? main.title : T.emptyCart}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Icon name="sparkles" size={22} />
        </div>
      </div>

      {main ? (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[var(--surface-2)] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-black">{main.title}</p>
                <p className="mt-1 text-sm font-bold text-[var(--muted)]">{main.min} min • {formatMoney(main.price, lang)}</p>
              </div>
              <Icon name={main.icon} size={20} className="text-blue-500" />
            </div>
          </div>

          {selectedExtras.length > 0 && (
            <div className="space-y-2">
              {selectedExtras.map((extra) => (
                <div key={extra.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-2)] px-4 py-3 text-sm">
                  <span className="font-bold text-[var(--muted)]">{extra.label}</span>
                  <span className="font-black">+ {formatMoney(extra.price, lang)}</span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
            <div className="space-y-3">
              <PriceLine label={T.subtotal} value={formatMoney(financials.subtotal, lang)} muted />
              {financials.extrasTotal > 0 && <PriceLine label={T.extrasTotal} value={`+${formatMoney(financials.extrasTotal, lang)}`} positive />}
              {financials.couponDiscount > 0 && <PriceLine label={T.discount} value={`-${formatMoney(financials.couponDiscount, lang)}`} negative />}
              {financials.mediaDiscount > 0 && <PriceLine label={T.mediaDiscount} value={`-${formatMoney(financials.mediaDiscount, lang)}`} negative />}
              {financials.pixDiscount > 0 && <PriceLine label={T.pixDiscount} value={`-${formatMoney(financials.pixDiscount, lang)}`} negative />}
              {financials.rushFee > 0 && <PriceLine label={T.rushFee} value={`+${formatMoney(financials.rushFee, lang)}`} positive />}
              <div className="border-t border-[var(--border)] pt-3">
                <PriceLine label={T.total} value={formatMoney(financials.total, lang)} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-[var(--surface-2)] p-3">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[var(--soft)]">{T.duration}</p>
              <p className="mt-1 font-black">{financials.duration} min</p>
            </div>
            <div className="rounded-2xl bg-[var(--surface-2)] p-3">
              <p className="text-[11px] font-black uppercase tracking-[.14em] text-[var(--soft)]">{T.step2}</p>
              <p className="mt-1 font-black">{booking.time || '--:--'}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="readable-small text-sm font-bold text-[var(--muted)]">{T.emptyCart}</p>
      )}
    </aside>
  );
});
SummaryCard.displayName = 'SummaryCard';

const SideMenu = memo(({ open, onClose, isDark, toggleTheme, lang, setLang, readable, setReadable, user, T, clearDraft }: {
  open: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  readable: boolean;
  setReadable: (v: boolean) => void;
  user: UserData;
  T: ReturnType<typeof getData>['text'];
  clearDraft: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[95]">
      <button className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onClose} aria-label="Fechar menu" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-sm overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl animate-fade-up">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-black">{T.menu}</h2>
          <button onClick={onClose} className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)]"><Icon name="x" /></button>
        </div>

        <div className="mb-5 rounded-[2rem] border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <p className="text-[12px] font-black uppercase tracking-[.16em] text-[var(--soft)]">{T.xp}</p>
          <p className="mt-1 text-4xl font-black">{user.xp}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-[var(--surface-3)]">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-amber-400" style={{ width: `${Math.min(100, (user.xp % 350) / 3.5)}%` }} />
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={toggleTheme} className="focus-ring flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left font-black">
            <span className="flex items-center gap-3"><Icon name={isDark ? 'moon' : 'sun'} /> {T.theme}</span>
            <span className="text-[var(--muted)]">{isDark ? T.dark : T.light}</span>
          </button>
          <button onClick={() => setReadable(!readable)} className="focus-ring flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left font-black">
            <span className="flex items-center gap-3"><Icon name="eye" /> {T.readableMode}</span>
            <span className="text-[var(--muted)]">{readable ? 'ON' : 'OFF'}</span>
          </button>
          <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="focus-ring flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-left font-black">
            <span className="flex items-center gap-3"><Icon name="globe" /> Idioma</span>
            <span className="text-[var(--muted)]">{lang.toUpperCase()}</span>
          </button>
          <button onClick={clearDraft} className="focus-ring flex w-full items-center justify-between rounded-2xl border border-rose-400/25 bg-rose-500/10 p-4 text-left font-black text-rose-500">
            <span className="flex items-center gap-3"><Icon name="trash" /> Limpar rascunho</span>
          </button>
        </div>
      </aside>
    </div>
  );
});
SideMenu.displayName = 'SideMenu';

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [readable, setReadable] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [step, setStep] = useState<StepKey>(0);
  const [activeIntent, setActiveIntent] = useState<IntentKey>('all');
  const [activeTab, setActiveTab] = useState<BookingKind>('single');
  const [user, setUser] = useState<UserData>(defaultUser);
  const [booking, setBooking] = useState<BookingData>(defaultBooking);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<ServiceItem | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const addToast = useCallback((msg: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, msg, type }].slice(-4));
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3300);
  }, []);

  useEffect(() => {
    setIsClient(true);
    const timer = window.setTimeout(() => setLoading(false), 450);
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.user) setUser({ ...defaultUser, ...parsed.user });
        if (parsed?.booking) {
          const restored = { ...defaultBooking, ...parsed.booking } as BookingData;
          restored.address = { ...emptyAddress, ...(parsed.booking.address || {}) };
          restored.note = parsed.booking.note || '';
          setBooking(restored);
          setActiveTab(restored.type || 'single');
        }
        if (typeof parsed?.isDark === 'boolean') setIsDark(parsed.isDark);
        if (typeof parsed?.readable === 'boolean') setReadable(parsed.readable);
        if (parsed?.lang === 'pt' || parsed?.lang === 'en') setLang(parsed.lang);
      }
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isClient || loading) return;
    const payload = JSON.stringify({
      v: '27-ux-heavy',
      user: { ...user, lastActivity: new Date().toISOString() },
      booking,
      isDark,
      readable,
      lang,
      updatedAt: new Date().toISOString(),
    });
    if (payload.length <= CONFIG.MAX_STORAGE_SIZE * 2) {
      localStorage.setItem(CONFIG.STORAGE_KEY, payload);
    }
  }, [booking, isClient, isDark, lang, loading, readable, user]);

  useEffect(() => {
    if (loading || user.hasSeenWelcome) return;
    const timer = window.setTimeout(() => setWelcomeOpen(true), 650);
    return () => window.clearTimeout(timer);
  }, [loading, user.hasSeenWelcome]);

  const selectedExtras = useMemo(() => DATA.extras.filter((extra) => booking.extras[extra.id]), [DATA.extras, booking.extras]);
  const mainItem = booking.cart[0];

  const filteredItems = useMemo(() => {
    const base = activeTab === 'single' ? DATA.services : DATA.plans;
    if (activeTab === 'pack') return base;
    if (activeIntent === 'all') return base;
    return base.filter((item) => item.intent === activeIntent);
  }, [DATA.plans, DATA.services, activeIntent, activeTab]);

  const visibleExtras = useMemo(() => {
    if (!mainItem) return DATA.extras;
    const recommended = DATA.extras.filter((extra) => extra.goodFor?.includes(mainItem.id));
    const others = DATA.extras.filter((extra) => !extra.goodFor?.includes(mainItem.id));
    return [...recommended, ...others];
  }, [DATA.extras, mainItem]);

  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  }), []);

  const slots = useMemo(() => {
    if (!booking.date) return [] as string[];
    const selected = new Date(`${booking.date}T00:00:00`);
    const now = new Date();
    const out: string[] = [];
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour += 1) {
      const slot = `${String(hour).padStart(2, '0')}:00`;
      if (selected.toDateString() === now.toDateString() && hour <= now.getHours() + 1) continue;
      out.push(slot);
    }
    return out;
  }, [booking.date]);

  const bestSlot = useMemo(() => {
    const calm = slots.find((slot) => !RUSH_HOURS.includes(slot) && Number(slot.slice(0, 2)) >= 10 && Number(slot.slice(0, 2)) <= 16);
    return calm || slots[0] || null;
  }, [slots]);

  const financials = useMemo<Financials>(() => {
    const mainSubtotal = booking.cart.reduce((sum, item) => sum + item.price, 0);
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const subtotal = mainSubtotal + extrasTotal;
    const couponDiscount = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const mediaDiscount = booking.mediaAllowed ? Math.floor(subtotal * 0.01) : 0;
    const pixDiscount = booking.payment === 'pix' ? Math.floor((subtotal - couponDiscount - mediaDiscount) * 0.03) : 0;
    const rushFee = booking.time && RUSH_HOURS.includes(booking.time) ? RUSH_FEE : 0;
    const total = Math.max(0, subtotal - couponDiscount - mediaDiscount - pixDiscount + rushFee);
    const duration = booking.cart.reduce((sum, item) => sum + item.min, 0) + (booking.extras.more_time ? 30 : 0);
    return { subtotal, extrasTotal, couponDiscount, mediaDiscount, pixDiscount, rushFee, total, duration };
  }, [booking.appliedCoupon, booking.cart, booking.extras.more_time, booking.mediaAllowed, booking.payment, booking.time, selectedExtras]);

  const dayLabel = useCallback((date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === new Date().toDateString()) return T.today;
    if (date.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).replace('.', '');
  }, [T.today, T.tomorrow, lang]);

  const selectMainItem = useCallback((item: ServiceItem) => {
    setBooking((prev) => ({
      ...prev,
      type: item.type,
      cart: [item],
      appliedCoupon: item.type !== prev.type ? null : prev.appliedCoupon,
    }));
    setActiveTab(item.type);
    safeVibrate(20);
  }, []);

  const updateAddress = useCallback((patch: Partial<Address>) => {
    setBooking((prev) => ({ ...prev, address: { ...prev.address, ...patch } }));
  }, []);

  const fetchCep = useCallback(async (cepValue: string) => {
    const digits = onlyDigits(cepValue);
    updateAddress({ cep: maskCEP(digits) });
    if (digits.length !== 8) return;

    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data?.erro) throw new Error('CEP not found');
      updateAddress({
        cep: maskCEP(digits),
        street: data.logradouro || '',
        district: data.bairro || '',
        city: data.localidade || '',
      });
      addToast(T.cepFound, 'success');
    } catch {
      addToast(T.cepError, 'error');
    } finally {
      setCepLoading(false);
    }
  }, [T.cepError, T.cepFound, addToast, updateAddress]);

  const toggleExtra = useCallback((id: string) => {
    setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [id]: !prev.extras[id] } }));
    safeVibrate(15);
  }, []);

  const applyCoupon = useCallback(() => {
    const code = couponInput.trim().toUpperCase();
    const found = user.coupons.find((coupon) => coupon.code.toUpperCase() === code && !user.usedCoupons.includes(coupon.code));
    if (!found) {
      addToast(T.couponBad, 'error');
      safeVibrate([25, 50, 25]);
      return;
    }
    setBooking((prev) => ({ ...prev, appliedCoupon: found }));
    setCouponInput('');
    addToast(T.couponOk, 'success');
  }, [T.couponBad, T.couponOk, addToast, couponInput, user.coupons, user.usedCoupons]);

  const claimWelcomeGift = useCallback(() => {
    const gift: Coupon = { id: 'WELCOME_V27', val: 10, title: 'Primeira visita', code: 'PRIMEIRO10' };
    setUser((prev) => {
      const already = prev.coupons.some((coupon) => coupon.code === gift.code);
      return { ...prev, hasSeenWelcome: true, coupons: already ? prev.coupons : [...prev.coupons, gift] };
    });
    setWelcomeOpen(false);
    addToast(T.giftSaved, 'success');
  }, [T.giftSaved, addToast]);

  const closeWelcome = useCallback(() => {
    setUser((prev) => ({ ...prev, hasSeenWelcome: true }));
    setWelcomeOpen(false);
  }, []);

  const canGoToStep = useCallback((target: StepKey) => {
    if (target === 0) return true;
    if (target === 1) return booking.cart.length > 0;
    if (target === 2) {
      if (booking.cart.length === 0 || user.name.trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return Boolean(booking.address.placeName && booking.address.city);
      return true;
    }
    if (target === 3) return canGoToStep(2) && Boolean(booking.date && booking.time);
    if (target === 4) return canGoToStep(3) && Boolean(booking.payment && booking.termsAccepted);
    return false;
  }, [booking.address, booking.cart.length, booking.date, booking.locationType, booking.payment, booking.termsAccepted, booking.time, user.name]);

  const validationMessage = useCallback(() => {
    if (step === 0) return T.emptyCart;
    if (step === 1) return user.name.trim().length < 3 ? T.invalidName : T.invalidAddress;
    if (step === 2) return T.invalidTime;
    if (step === 3) return T.invalidPayment;
    return '';
  }, [T.emptyCart, T.invalidAddress, T.invalidName, T.invalidPayment, T.invalidTime, step, user.name]);

  const generateWhatsAppMessage = useCallback(() => {
    const dateLabel = booking.date
      ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'long', day: '2-digit', month: 'long' })
      : '-';
    const hashPayload = `${financials.total}-${booking.date}-${booking.time}-${booking.cart.map((item) => item.id).join(',')}-${CONFIG.SECRET_TOKEN}`;
    const hash = btoa(unescape(encodeURIComponent(hashPayload))).slice(0, 8).toUpperCase();
    const servicesText = booking.cart.map((item) => `• ${item.title} (${item.min}min) — ${formatMoney(item.price, lang)}`).join('\n');
    const extrasText = selectedExtras.length ? selectedExtras.map((extra) => `• ${extra.label} — ${formatMoney(extra.price, lang)}`).join('\n') : lang === 'pt' ? 'Nenhum extra' : 'No extras';

    let locationText = '';
    if (booking.locationType === 'home') {
      locationText = `Casa: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}. ${booking.address.comp ? `Complemento: ${booking.address.comp}` : ''}`;
    } else if (booking.locationType === 'hotel') {
      locationText = `Hotel: ${booking.address.placeName}, ${booking.address.city}. ${booking.address.comp ? `Quarto/comp.: ${booking.address.comp}` : ''}`;
    } else {
      locationText = lang === 'pt' ? 'Seu studio — endereço a confirmar pelo WhatsApp.' : 'Your studio — address to be confirmed on WhatsApp.';
    }

    const paymentLabel = booking.payment === 'pix' ? 'Pix' : booking.payment === 'card' ? (lang === 'pt' ? 'Cartão' : 'Card') : (lang === 'pt' ? 'Dinheiro' : 'Cash');
    const noteText = booking.note ? `\n*Observação:* ${sanitizeInput(booking.note)}\n` : '\n';

    return lang === 'pt'
      ? `*AGENDAMENTO THALYSON MASSAGENS* #${hash}\n\nOi, Thalyson! Quero confirmar esse horário.\n\n*Nome:* ${sanitizeInput(user.name)}\n*Data:* ${dateLabel}\n*Horário:* ${booking.time}\n*Duração estimada:* ${financials.duration} min\n${noteText}\n*Sessão escolhida:*\n${servicesText}\n\n*Extras:*\n${extrasText}\n\n*Local:*\n${locationText}\n\n*Pagamento:* ${paymentLabel}\n\n*Resumo:*\nSubtotal: ${formatMoney(financials.subtotal, lang)}\n${financials.extrasTotal ? `Extras: +${formatMoney(financials.extrasTotal, lang)}\n` : ''}${financials.couponDiscount ? `Cupom: -${formatMoney(financials.couponDiscount, lang)}\n` : ''}${financials.mediaDiscount ? `Foto anônima: -${formatMoney(financials.mediaDiscount, lang)}\n` : ''}${financials.pixDiscount ? `Pix 3%: -${formatMoney(financials.pixDiscount, lang)}\n` : ''}${financials.rushFee ? `Horário de pico: +${formatMoney(financials.rushFee, lang)}\n` : ''}*Total:* ${formatMoney(financials.total, lang)}\n\nLi e aceitei o combinado. Me confirma se esse horário está livre?`
      : `*THALYSON MASSAGE BOOKING* #${hash}\n\nHi, Thalyson! I want to confirm this time.\n\n*Name:* ${sanitizeInput(user.name)}\n*Date:* ${dateLabel}\n*Time:* ${booking.time}\n*Estimated duration:* ${financials.duration} min\n${noteText}\n*Chosen session:*\n${servicesText}\n\n*Extras:*\n${extrasText}\n\n*Location:*\n${locationText}\n\n*Payment:* ${paymentLabel}\n\n*Summary:*\nSubtotal: ${formatMoney(financials.subtotal, lang)}\n${financials.extrasTotal ? `Extras: +${formatMoney(financials.extrasTotal, lang)}\n` : ''}${financials.couponDiscount ? `Coupon: -${formatMoney(financials.couponDiscount, lang)}\n` : ''}${financials.mediaDiscount ? `Anonymous photo: -${formatMoney(financials.mediaDiscount, lang)}\n` : ''}${financials.pixDiscount ? `Pix 3%: -${formatMoney(financials.pixDiscount, lang)}\n` : ''}${financials.rushFee ? `Rush time: +${formatMoney(financials.rushFee, lang)}\n` : ''}*Total:* ${formatMoney(financials.total, lang)}\n\nI read and accepted the agreement. Can you confirm if this time is available?`;
  }, [booking.address.city, booking.address.comp, booking.address.district, booking.address.number, booking.address.placeName, booking.address.street, booking.cart, booking.date, booking.locationType, booking.note, booking.payment, booking.time, financials.couponDiscount, financials.duration, financials.extrasTotal, financials.mediaDiscount, financials.pixDiscount, financials.rushFee, financials.subtotal, financials.total, lang, selectedExtras, user.name]);

  const openWhatsApp = useCallback(() => {
    if (!isBrowser()) return;
    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [generateWhatsAppMessage]);

  const finishBooking = useCallback(() => {
    const earnedXP = Math.max(10, Math.floor(financials.total * (booking.type === 'pack' ? 0.26 : 0.14)));
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + earnedXP,
      ordersCount: Math.max(92, prev.ordersCount + 1),
      usedCoupons: booking.appliedCoupon ? [...new Set([...prev.usedCoupons, booking.appliedCoupon.code])] : prev.usedCoupons,
      lastActivity: new Date().toISOString(),
    }));
    openWhatsApp();
    setStep(4);
  }, [booking.appliedCoupon, booking.type, financials.total, openWhatsApp]);

  const nextStep = useCallback(() => {
    if (step === 0 && !canGoToStep(1)) {
      addToast(validationMessage(), 'error');
      safeVibrate([25, 60, 25]);
      return;
    }
    if (step === 1 && !canGoToStep(2)) {
      addToast(validationMessage(), 'error');
      safeVibrate([25, 60, 25]);
      return;
    }
    if (step === 2 && !canGoToStep(3)) {
      addToast(validationMessage(), 'error');
      safeVibrate([25, 60, 25]);
      return;
    }
    if (step === 3) {
      if (!canGoToStep(4)) {
        addToast(validationMessage(), 'error');
        safeVibrate([25, 60, 25]);
        return;
      }
      finishBooking();
      return;
    }
    setStep((prev) => Math.min(4, (prev + 1) as StepKey) as StepKey);
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  }, [addToast, canGoToStep, finishBooking, step, validationMessage]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    setBooking({ ...defaultBooking, bookingId: `BOOK_${Date.now()}` });
    setStep(0);
    setMenuOpen(false);
    addToast(lang === 'pt' ? 'Rascunho limpo.' : 'Draft cleared.', 'info');
  }, [addToast, lang]);

  const chooseBestSlot = useCallback(() => {
    if (!booking.date && days[0]) {
      setBooking((prev) => ({ ...prev, date: toISODate(days[0]), time: bestSlot || '10:00' }));
      return;
    }
    if (bestSlot) setBooking((prev) => ({ ...prev, time: bestSlot }));
  }, [bestSlot, booking.date, days]);

  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-white">
        <div className="mx-auto max-w-sm px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-600 text-4xl font-black shadow-2xl shadow-blue-950/40">T</div>
          <p className="text-sm font-black uppercase tracking-[.22em] text-blue-200">V27 UX pesado</p>
          <p className="mt-3 text-sm font-semibold text-zinc-400">Mantendo seus dados e organizando o fluxo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} readable={readable} />
      <ToastContainer toasts={toasts} />
      <SideMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        isDark={isDark}
        toggleTheme={() => setIsDark((v) => !v)}
        lang={lang}
        setLang={setLang}
        readable={readable}
        setReadable={setReadable}
        user={user}
        T={T}
        clearDraft={clearDraft}
      />

      <CenterModal
        open={welcomeOpen}
        onClose={closeWelcome}
        title={T.welcomeTitle}
        icon="gift"
        footer={(
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button variant="primary" full icon="gift" onClick={claimWelcomeGift}>{T.claimGift}</Button>
            <Button variant="secondary" full icon="x" onClick={closeWelcome}>{T.skip}</Button>
          </div>
        )}
      >
        <p>{T.welcomeMsg}</p>
        <div className="mt-5 rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4">
          <p className="text-xl font-black text-[var(--text)]">PRIMEIRO10</p>
          <p className="mt-1 text-sm font-bold text-[var(--muted)]">R$10 de desconto salvo na mesma base da V27.</p>
        </div>
      </CenterModal>

      <CenterModal
        open={Boolean(detailsItem)}
        onClose={() => setDetailsItem(null)}
        title={detailsItem?.title || ''}
        icon={detailsItem?.icon || 'sparkles'}
        footer={detailsItem ? (
          <Button
            full
            icon={mainItem?.id === detailsItem.id ? 'check' : 'plus'}
            onClick={() => {
              selectMainItem(detailsItem);
              setDetailsItem(null);
            }}
          >
            {mainItem?.id === detailsItem.id ? T.selectedThis : T.addThis}
          </Button>
        ) : null}
      >
        {detailsItem && (
          <div>
            <p className="font-bold">{detailsItem.desc}</p>
            <div className="mt-5 space-y-3">
              {detailsItem.details.map((detail, index) => (
                <div key={detail} className="flex gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white">{index + 1}</span>
                  <p className="font-bold text-[var(--muted)]">{detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CenterModal>

      <CenterModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title={T.termsModalTitle}
        icon="shield"
        footer={(
          <Button
            full
            icon="check"
            onClick={() => {
              setBooking((prev) => ({ ...prev, termsAccepted: true }));
              setTermsOpen(false);
            }}
          >
            {T.accept}
          </Button>
        )}
      >
        <div className="space-y-4">
          {DATA.rules.map((rule) => (
            <div key={rule.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
              <div className="mb-2 flex items-center gap-2 font-black text-[var(--text)]"><Icon name={rule.icon} size={18} /> {rule.title}</div>
              <p>{rule.description}</p>
            </div>
          ))}
          <p className="text-sm font-bold text-[var(--soft)]">
            {lang === 'pt'
              ? 'Este envio é uma solicitação. O horário só fica fechado depois da confirmação pelo WhatsApp.'
              : 'This is a request. The time is only locked after WhatsApp confirmation.'}
          </p>
        </div>
      </CenterModal>

      <div className="fixed inset-0 -z-10 bg-[var(--bg)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-140px] h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-blue-500/12 blur-[120px]" />
        <div className="absolute bottom-[-120px] right-[-90px] h-[460px] w-[460px] rounded-full bg-amber-400/12 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/88 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <button onClick={() => setStep(0)} className="focus-ring rounded-2xl text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-950/20">T</div>
              <div>
                <h1 className="text-lg font-black leading-none md:text-xl">{T.appName}</h1>
                <p className="mt-1 flex items-center gap-2 text-[12px] font-black uppercase tracking-[.14em] text-[var(--soft)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" /> {T.appSub}
                </p>
              </div>
            </div>
          </button>

          <div className="hidden min-w-[420px] max-w-xl flex-1 md:block">
            <StepPills step={step} setStep={setStep} T={T} canGo={canGoToStep} />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="focus-ring hidden h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--muted)] transition hover:text-[var(--text)] sm:flex sm:items-center sm:gap-2">
              <Icon name="globe" size={17} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="focus-ring flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]">
              <Icon name="menu" size={21} />
            </button>
          </div>
        </div>
        <div className="px-4 pb-3 md:hidden">
          <StepPills step={step} setStep={setStep} T={T} canGo={canGoToStep} />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-40 pt-8 md:px-6 md:pt-12">
        {step === 0 && (
          <section className="animate-fade-up">
            <div className="mb-12 grid gap-6 lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
              <div className="flex flex-col justify-between rounded-[2.4rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] md:p-8">
                <div>
                  <p className="mb-4 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[12px] font-black uppercase tracking-[.18em] text-blue-500">{T.heroKicker}</p>
                  <h2 className="max-w-3xl text-balance text-4xl font-black leading-[1.02] tracking-[-.05em] md:text-6xl">
                    <span className="text-gradient">{T.heroTitle}</span>
                  </h2>
                  <p className="readable-copy mt-5 max-w-2xl text-[var(--muted)] md:text-lg">{T.heroSub}</p>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-[auto_1fr] sm:items-center">
                  <Button size="lg" icon="chevronDown" onClick={() => document.getElementById('choose-session')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>{T.heroCta}</Button>
                  <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
                    <p className="text-[12px] font-black uppercase tracking-[.16em] text-[var(--soft)]">+{user.ordersCount} {T.socialProof}</p>
                    <p className="mt-1 text-sm font-bold text-[var(--muted)]">{T.xp}: <span className="font-black text-blue-500">{user.xp}</span></p>
                  </div>
                </div>
              </div>
              <PhotoFrame photo={PHOTO_CONFIG[0]} large />
            </div>

            <section className="mb-12 rounded-[2.4rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-7">
              <SectionHeader eyebrow={T.photoTip} title={T.photosTitle} desc={T.photosDesc} />
              <HorizontalRail label={T.horizontalHint}>
                {PHOTO_CONFIG.map((photo) => <PhotoFrame key={photo.id} photo={photo} />)}
              </HorizontalRail>
            </section>

            <section className="mb-12 grid gap-4 md:grid-cols-3">
              {[
                { icon: 'sliders', title: T.flow1, desc: T.flow1Desc },
                { icon: 'chevronRight', title: T.flow2, desc: T.flow2Desc },
                { icon: 'check', title: T.flow3, desc: T.flow3Desc },
              ].map((item) => (
                <div key={item.title} className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white"><Icon name={item.icon} /></div>
                  <h3 className="text-xl font-black">{item.title}</h3>
                  <p className="readable-small mt-2 text-sm font-bold text-[var(--muted)]">{item.desc}</p>
                </div>
              ))}
            </section>

            <section id="choose-session" className="scroll-mt-32">
              <SectionHeader eyebrow={T.services} title={T.chooseByNeed} desc={T.chooseByNeedSub} />
              <div className="mb-7">
                <IntentPicker active={activeIntent} onChange={setActiveIntent} T={T} />
              </div>

              <div className="mb-7 grid grid-cols-2 gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-2">
                <button
                  onClick={() => setActiveTab('single')}
                  className={cx('focus-ring min-h-12 rounded-2xl px-4 py-3 text-sm font-black transition', activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]')}
                >
                  {T.single}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('pack');
                    setActiveIntent('premium');
                  }}
                  className={cx('focus-ring min-h-12 rounded-2xl px-4 py-3 text-sm font-black transition', activeTab === 'pack' ? 'bg-amber-400 text-zinc-950 shadow-lg shadow-amber-950/20' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]')}
                >
                  {T.plans}
                </button>
              </div>

              <HorizontalRail label={T.horizontalHint}>
                {filteredItems.map((item) => (
                  <ServiceCard
                    key={item.id}
                    item={item}
                    selected={mainItem?.id === item.id}
                    onSelect={selectMainItem}
                    onDetails={setDetailsItem}
                    lang={lang}
                    T={T}
                  />
                ))}
              </HorizontalRail>
            </section>
          </section>
        )}

        {step === 1 && (
          <section className="animate-fade-up">
            <SectionHeader eyebrow={T.step1} title={T.nameLocationTitle} desc={T.nameLocationSub} />
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <InputField label={T.name} value={user.name} icon="user" placeholder="Ex: Thalyson" onChange={(value) => setUser((prev) => ({ ...prev, name: sanitizeInput(value) }))} error={user.name && user.name.trim().length < 3 ? T.invalidName : undefined} />
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <div className="mb-5 grid gap-3 md:grid-cols-3">
                    {([
                      { id: 'home', label: T.home, icon: 'home', hint: T.travelHint },
                      { id: 'studio', label: T.studio, icon: 'building', hint: T.studioHint },
                      { id: 'hotel', label: T.hotel, icon: 'hotel', hint: T.travelHint },
                    ] as Array<{ id: LocationType; label: string; icon: string; hint: string }>).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setBooking((prev) => ({ ...prev, locationType: item.id }))}
                        className={cx(
                          'focus-ring min-h-32 rounded-2xl border p-4 text-left transition',
                          booking.locationType === item.id ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,.10)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                        )}
                      >
                        <Icon name={item.icon} size={22} className="mb-3 text-blue-500" />
                        <p className="font-black">{item.label}</p>
                        <p className="readable-small mt-2 text-xs font-bold text-[var(--muted)]">{item.hint}</p>
                      </button>
                    ))}
                  </div>

                  {booking.locationType === 'home' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label={T.cep} value={booking.address.cep} onChange={fetchCep} icon="mapPin" placeholder="00000-000" inputMode="numeric" maxLength={9} disabled={cepLoading} />
                      <InputField label={T.street} value={booking.address.street} onChange={(street) => updateAddress({ street: sanitizeInput(street) })} icon="home" />
                      <InputField label={T.number} value={booking.address.number} onChange={(number) => updateAddress({ number: sanitizeInput(number) })} icon="tag" inputMode="numeric" />
                      <InputField label={T.district} value={booking.address.district} onChange={(district) => updateAddress({ district: sanitizeInput(district) })} icon="mapPin" />
                      <InputField label={T.city} value={booking.address.city} onChange={(city) => updateAddress({ city: sanitizeInput(city) })} icon="building" />
                      <InputField label={T.comp} value={booking.address.comp} onChange={(comp) => updateAddress({ comp: sanitizeInput(comp) })} icon="plus" />
                    </div>
                  )}

                  {booking.locationType === 'hotel' && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <InputField label={T.hotelName} value={booking.address.placeName} onChange={(placeName) => updateAddress({ placeName: sanitizeInput(placeName) })} icon="hotel" placeholder="Ex: Hotel Bela Vista" />
                      <InputField label={T.city} value={booking.address.city} onChange={(city) => updateAddress({ city: sanitizeInput(city) })} icon="building" />
                      <div className="md:col-span-2">
                        <InputField label={T.comp} value={booking.address.comp} onChange={(comp) => updateAddress({ comp: sanitizeInput(comp) })} icon="tag" placeholder="Quarto, suíte, bloco, referência" />
                      </div>
                    </div>
                  )}

                  {booking.locationType === 'studio' && (
                    <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-5">
                      <div className="flex gap-3">
                        <Icon name="building" className="mt-1 text-blue-500" />
                        <div>
                          <p className="font-black">{T.studio}</p>
                          <p className="readable-copy mt-1 text-sm text-[var(--muted)]">{T.studioHint}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <TextAreaField label={T.note} value={booking.note} onChange={(note) => setBooking((prev) => ({ ...prev, note: sanitizeInput(note) }))} placeholder={T.notePlaceholder} />
                </div>
              </div>
              <SummaryCard booking={booking} selectedExtras={selectedExtras} financials={financials} lang={lang} T={T} />
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-up">
            <SectionHeader
              eyebrow={T.step2}
              title={T.timeTitle}
              desc={T.timeSub}
              right={<Button variant="warm" icon="sparkles" onClick={chooseBestSlot}>{T.smartSuggestion}</Button>}
            />
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <h3 className="mb-4 text-xl font-black">{T.chooseDate}</h3>
                  <div className="scrollbar-none snap-x -mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
                    {days.map((date) => {
                      const iso = toISODate(date);
                      const selected = booking.date === iso;
                      return (
                        <button
                          key={iso}
                          onClick={() => setBooking((prev) => ({ ...prev, date: iso, time: null }))}
                          className={cx(
                            'focus-ring snap-card min-h-28 min-w-[112px] rounded-2xl border p-4 text-left transition',
                            selected ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--strong-border)]',
                          )}
                        >
                          <p className="text-[11px] font-black uppercase tracking-[.14em] opacity-70">{dayLabel(date)}</p>
                          <p className="mt-2 text-3xl font-black">{date.getDate()}</p>
                          <p className="mt-1 text-sm font-black opacity-70">{date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '')}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-xl font-black">{T.chooseTime}</h3>
                    {bestSlot && <span className="rounded-full bg-emerald-500/12 px-3 py-1 text-xs font-black uppercase tracking-[.14em] text-emerald-500">{bestSlot} • {T.lowDemand}</span>}
                  </div>
                  {slots.length ? (
                    <div className="scrollbar-none snap-x -mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
                      {slots.map((slot) => {
                        const selected = booking.time === slot;
                        const rush = RUSH_HOURS.includes(slot);
                        return (
                          <button
                            key={slot}
                            onClick={() => setBooking((prev) => ({ ...prev, time: slot }))}
                            className={cx(
                              'focus-ring snap-card min-h-24 min-w-[118px] rounded-2xl border p-4 text-left transition',
                              selected ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--strong-border)]',
                            )}
                          >
                            <p className="text-2xl font-black">{slot}</p>
                            <p className={cx('mt-2 text-xs font-black uppercase tracking-[.12em]', rush ? 'text-amber-500' : selected ? 'text-blue-100' : 'text-emerald-500')}>
                              {slot === bestSlot ? T.smartSuggestion : rush ? T.rush : T.lowDemand}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center font-bold text-[var(--muted)]">{T.noSlots}</div>
                  )}
                </div>
              </div>
              <SummaryCard booking={booking} selectedExtras={selectedExtras} financials={financials} lang={lang} T={T} />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-up">
            <SectionHeader eyebrow={T.step3} title={T.finishTitle} desc={T.finishSub} />
            <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
              <div className="space-y-6">
                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <SectionHeader title={T.extrasTitle} desc={T.extrasSub} />
                  <HorizontalRail label={T.horizontalHint}>
                    {visibleExtras.map((extra) => {
                      const selected = Boolean(booking.extras[extra.id]);
                      const recommended = mainItem && extra.goodFor?.includes(mainItem.id);
                      return (
                        <button
                          key={extra.id}
                          onClick={() => toggleExtra(extra.id)}
                          className={cx(
                            'focus-ring snap-card flex min-h-[230px] w-[78vw] max-w-[310px] shrink-0 flex-col rounded-[2rem] border p-5 text-left transition sm:w-[300px]',
                            selected ? 'border-blue-500 bg-blue-500/10 ring-4 ring-blue-500/10' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                          )}
                        >
                          <div className="mb-4 flex items-start justify-between gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white"><Icon name={extra.icon} /></div>
                            {recommended && <span className="rounded-full bg-amber-400 px-2 py-1 text-[10px] font-black uppercase tracking-[.12em] text-zinc-950">{T.smartSuggestion}</span>}
                          </div>
                          <h3 className="text-xl font-black">{extra.label}</h3>
                          <p className="readable-small mt-2 flex-1 text-sm font-bold text-[var(--muted)]">{extra.desc}</p>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="font-black text-blue-500">{extra.price ? `+ ${formatMoney(extra.price, lang)}` : 'Free'}</span>
                            <span className={cx('flex h-8 w-8 items-center justify-center rounded-xl border', selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[var(--border)] text-[var(--soft)]')}><Icon name={selected ? 'check' : 'plus'} size={16} /></span>
                          </div>
                        </button>
                      );
                    })}
                  </HorizontalRail>
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <h3 className="mb-4 text-xl font-black">{T.coupon}</h3>
                  <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                    <InputField label={T.coupon} value={couponInput} onChange={(value) => setCouponInput(value.toUpperCase())} placeholder={T.couponPlaceholder} icon="gift" />
                    <div className="sm:pt-7"><Button full icon="check" onClick={applyCoupon}>{T.apply}</Button></div>
                  </div>
                  {user.coupons.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {user.coupons.map((coupon) => (
                        <button key={coupon.id} onClick={() => setCouponInput(coupon.code)} className="focus-ring rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-black text-[var(--muted)] transition hover:text-[var(--text)]">
                          {coupon.code} • -{formatMoney(coupon.val, lang)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <h3 className="mb-4 text-xl font-black">{T.payment}</h3>
                  <div className="grid gap-3 md:grid-cols-3">
                    {([
                      ['pix', T.pix, 'copy'],
                      ['card', T.card, 'tag'],
                      ['cash', T.cash, 'gift'],
                    ] as const).map(([value, label, icon]) => (
                      <button
                        key={value}
                        onClick={() => setBooking((prev) => ({ ...prev, payment: value }))}
                        className={cx(
                          'focus-ring min-h-24 rounded-2xl border p-4 text-left transition',
                          booking.payment === value ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,.10)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                        )}
                      >
                        <Icon name={icon} size={20} className="mb-2 text-blue-500" />
                        <span className="font-black">{label}</span>
                      </button>
                    ))}
                  </div>
                  {booking.payment === 'pix' && (
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(CONFIG.PIX_KEY);
                        addToast(T.copiedPix, 'success');
                      }}
                      className="focus-ring mt-4 flex w-full items-center justify-between rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-left"
                    >
                      <span className="font-black">PIX: {CONFIG.PIX_KEY}</span>
                      <Icon name="copy" size={18} />
                    </button>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <input
                    type="checkbox"
                    checked={booking.mediaAllowed}
                    onChange={(event) => setBooking((prev) => ({ ...prev, mediaAllowed: event.target.checked }))}
                    className="mt-1 h-5 w-5 accent-blue-600"
                  />
                  <span>
                    <span className="block font-black">{T.portfolio}</span>
                    <span className="readable-small mt-1 block text-sm font-bold text-[var(--muted)]">{T.portfolioDesc}</span>
                  </span>
                </label>

                <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-black">{T.terms}</h3>
                      <p className="readable-small mt-1 text-sm font-bold text-[var(--muted)]">Pop-up central, com botão certo e X para fechar.</p>
                    </div>
                    <Button variant={booking.termsAccepted ? 'secondary' : 'primary'} icon={booking.termsAccepted ? 'check' : 'shield'} onClick={() => setTermsOpen(true)}>
                      {booking.termsAccepted ? T.accept : T.terms}
                    </Button>
                  </div>
                </div>
              </div>
              <SummaryCard booking={booking} selectedExtras={selectedExtras} financials={financials} lang={lang} T={T} />
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto max-w-2xl py-16 text-center animate-fade-up">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-950/20">
              <Icon name="check" size={44} />
            </div>
            <h2 className="text-balance text-4xl font-black leading-tight tracking-[-.04em] md:text-5xl">{T.successTitle}</h2>
            <p className="readable-copy mx-auto mt-4 text-[var(--muted)]">{T.successSub}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button variant="whatsapp" size="lg" full icon="message" onClick={openWhatsApp}>{T.openWhatsapp}</Button>
              <Button variant="secondary" size="lg" full icon="refresh" onClick={clearDraft}>{T.restart}</Button>
            </div>
          </section>
        )}

        {step === 0 && (
          <section className="mt-14 grid gap-6 lg:grid-cols-[1fr_.8fr]">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
              <h2 className="mb-4 text-2xl font-black">{T.safety}</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {DATA.rules.map((rule) => (
                  <div key={rule.title} className="rounded-2xl bg-[var(--surface-2)] p-4">
                    <Icon name={rule.icon} className="mb-3 text-blue-500" />
                    <h3 className="font-black">{rule.title}</h3>
                    <p className="readable-small mt-2 text-sm font-bold text-[var(--muted)]">{rule.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:p-6">
              <h2 className="mb-4 text-2xl font-black">{T.faq}</h2>
              <div className="space-y-3">
                {DATA.faq.map((item) => (
                  <details key={item.q} className="rounded-2xl bg-[var(--surface-2)] p-4">
                    <summary className="cursor-pointer font-black">{item.q}</summary>
                    <p className="readable-small mt-3 text-sm font-bold text-[var(--muted)]">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {step < 4 && (
        <footer className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/90 p-3 backdrop-blur-2xl md:p-4">
          <div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <SummaryCard booking={booking} selectedExtras={selectedExtras} financials={financials} lang={lang} T={T} compact />
            <div className="grid grid-cols-2 gap-3 md:flex">
              <Button variant="secondary" size="lg" disabled={step === 0} onClick={() => setStep((prev) => Math.max(0, prev - 1) as StepKey)} icon="chevronLeft">{T.back}</Button>
              <Button size="lg" onClick={nextStep} icon={step === 3 ? 'message' : 'chevronRight'}>{step === 3 ? T.finish : T.continue}</Button>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}
