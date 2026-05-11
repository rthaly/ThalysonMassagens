import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

// ==================================================================================
// THALYSON MASSAGENS — V27 REINVENTADO
// Site de agendamento com UX/UI, acessibilidade, autosave e fluxo inteligente.
// IMPORTANTE: a STORAGE_KEY foi preservada para não perder dados salvos da versão 27.
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


const PHOTO_CONFIG = [
  { src: '/fotos/thalyson-hero.jpg', alt: 'Thalyson preparando o ambiente de massagem', label: 'Ambiente preparado' },
  { src: '/fotos/thalyson-detalhe.jpg', alt: 'Detalhe estético do atendimento', label: 'Cuidado nos detalhes' },
  { src: '/fotos/thalyson-ambiente.jpg', alt: 'Espaço limpo e aconchegante para atendimento', label: 'Privacidade e conforto' },
] as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  menu: 'M4 12h16 M4 6h16 M4 18h16',
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
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  alert: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4'
};

type Lang = 'pt' | 'en';
type LocationType = 'home' | 'studio' | 'hotel';
type PaymentType = '' | 'pix' | 'card' | 'cash';
type ServiceCategory = 'relax' | 'recovery' | 'premium' | 'care';

interface ServiceItem {
  id: string;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details: string;
  category?: ServiceCategory;
  type?: 'single' | 'pack';
  popular?: boolean;
  fullPrice?: number;
  savings?: number;
}

interface ExtraItem {
  id: string;
  price: number;
  icon: string;
  label: string;
  desc: string;
  recommendedFor?: string[];
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
  type: 'single' | 'pack';
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
}

interface ToastItem {
  id: number;
  msg: string;
  type: 'success' | 'error' | 'info';
}

const sanitizeInput = (v: unknown): string => String(v ?? '').replace(/[<>&"']/g, '').slice(0, 140);
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const onlyDigits = (v: string) => v.replace(/\D/g, '');
const validateAddress = (a: Address) => Boolean(a.street && a.number && a.district && a.city);

const formatMoney = (value: number, lang: Lang) => {
  const converted = lang === 'pt' ? value : value / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
  }).format(converted || 0);
};

const safeVibrate = (pattern: number | number[] = 35) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {
    // Navegadores sem suporte simplesmente ignoram.
  }
};

const isToday = (date: Date) => date.toDateString() === new Date().toDateString();
const toISODate = (date: Date) => date.toISOString().split('T')[0];

const getData = (lang: Lang) => {
  const en = lang === 'en';

  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317, crossfit: 187,
    pes: 110, maos: 110, combo_pm: 190,
    pack_basic: { v: 247, full: 284, save: 37 },
    pack1: { v: 297, full: 334, save: 37 },
    pack_glow: { v: 327, full: 391, save: 64 },
    pack_muscle: { v: 347, full: 408, save: 61 },
    pack2: { v: 387, full: 467, save: 80 },
    pack3: { v: 637, full: 721, save: 84 },
    pack_ultimate: { v: 657, full: 778, save: 121 },
    extras: { more_time: 77, touch: 77, aroma: 17, hair_trim: 57, pain_relief: 17, dominador: 180, oral: 120, beijos: 77, prostatico: 120 }
  };

  const services: ServiceItem[] = [
    { id: 'pes', category: 'care', type: 'single', min: 40, price: p.pes, icon: "user", tag: en ? "FOOT RELIEF" : "ALÍVIO NOS PÉS", title: en ? "Foot Massage" : "Massagem nos Pés", desc: en ? "Complete relief for tired feet after a long day." : "Alívio completo e direto para pés cansados após um dia longo de trabalho.", details: en ? "Step 1: Foot reflexology\nStep 2: Deep pressure points" : "1. Reflexologia focada na sola dos pés.\n2. Pressão profunda em pontos de tensão.\n3. Liberação completa para você pisar mais leve." },
    { id: 'maos', category: 'care', type: 'single', min: 40, price: p.maos, icon: "sparkles", tag: en ? "HAND RELIEF" : "ALÍVIO NAS MÃOS", title: en ? "Hand Massage" : "Massagem nas Mãos", desc: en ? "Release tension from typing and working with your hands." : "Libere a tensão acumulada de digitar ou usar muito as mãos no trabalho.", details: en ? "Step 1: Joint stretching\nStep 2: Deep palm massage" : "1. Alongamento das articulações dos dedos.\n2. Massagem profunda na palma da mão.\n3. Alívio de dores nos punhos e antebraço." },
    { id: 'relaxante', category: 'relax', type: 'single', min: 40, price: p.relax, icon: "user-check", tag: en ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: en ? "Classic Massage" : "Massagem Clássica", desc: en ? "Stiff back? This takes that giant weight off your shoulders." : "Ideal para quem está com as costas travadas e o corpo rígido. Foco total em soltar os músculos para você voltar a dormir bem.", details: en ? "Step 1: Use of wooden rollers\nStep 2: Soft touch manually\nStep 3: No intimate touch" : "1. Uso de rolos de madeira para quebrar os nós musculares.\n2. Massagem manual profunda para soltar tensões fortes.\n3. Foco em relaxamento e saúde (Sem toques íntimos).\n4. Você sai da sessão parecendo que tirou 10kg das costas." },
    { id: 'naturista', category: 'relax', type: 'single', min: 40, price: p.naturista, icon: "sun", tag: en ? "ZERO TIES" : "ZERO ROUPAS", title: en ? "Naturist Classic" : "Clássica Naturista", desc: en ? "Total freedom, no clothes, light touches to loosen every muscle." : "Massagem de corpo inteiro, completamente sem roupas (nós dois). Perfeita para quem busca liberdade total e quebra de estresse.", details: en ? "Step 1: Full classic massage (undressed)\nStep 2: Deep body relief\nStep 3: No intimate touches" : "1. Massagem feita com ambos completamente nus.\n2. Pressão exata para desmanchar a rigidez do corpo.\n3. Alívio profundo sem bloqueios ou amarras de roupas.\n4. Atenção: Foco terapêutico e relaxante (Sem toques íntimos)." },
    { id: 'crossfit', category: 'recovery', type: 'single', min: 60, price: p.crossfit, icon: "zap", tag: en ? "DEEP RECOVERY" : "RECUPERAÇÃO", title: en ? "Crossfit Lovers" : "Massagem para Atletas", desc: en ? "Sports massage with a firm grip for stiff muscles." : "Massagem com pegada forte, feita especialmente para quem treina pesado e precisa aliviar as dores musculares pós-treino.", details: en ? "Step 1: Vigorous friction\nStep 2: Myofascial release" : "1. Fricção forte para aquecer os músculos cansados.\n2. Liberação miofascial com foco em pernas, costas e ombros.\n3. Uso de pomadas que esquentam e aliviam a dor na hora.\n4. Alongamentos para destravar e devolver a mobilidade.", popular: true },
    { id: 'sensitiva', category: 'premium', type: 'single', min: 60, price: p.sens, icon: "sparkles", tag: en ? "REDUCES ANXIETY" : "TIRA A ANSIEDADE", title: en ? "Sensory Massage" : "Massagem Sensorial", desc: en ? "Subtle touches that give you full-body shivers." : "Toques muito suaves pelo corpo todo que causam arrepios e desligam a sua mente acelerada. Termina com muito prazer.", details: en ? "Step 1: Classic massage\nStep 2: Subtle stimuli\nStep 3: Climax" : "1. Início com massagem clássica para aquecer a pele.\n2. Estímulos super leves usando as mãos e a respiração que arrepiam o corpo.\n3. Construção do prazer aos poucos, focada em esvaziar sua mente.\n4. Finalização manual focada numa liberação intensa de tensão (gozo)." },
    { id: 'mista', category: 'premium', type: 'single', min: 60, price: p.titan, icon: "refresh", tag: en ? "BEST OF BOTH WORLDS" : "O MELHOR DOS 2", title: en ? "Fusion Experience" : "Experiência Fusion", desc: en ? "First I take the pain from your back, then I take you to a climax." : "A mais completa: primeiro eu tiro toda a dor das suas costas, depois eu mudo o ritmo e te levo a um prazer que zera o seu estresse da semana.", details: en ? "Step 1: Classic massage\nStep 2: Intimate contact\nStep 3: Release" : "1. Começa como massagem clássica para soltar todos os músculos travados.\n2. Muda o ritmo: contato corpo a corpo íntimo (eu atendo apenas de cueca).\n3. O calor aumenta, envolvendo todos os seus sentidos.\n4. Termina com uma estimulação e gozo intenso para recarregar as baterias.", popular: true },
    { id: 'reversa', category: 'premium', type: 'single', min: 60, price: p.reversa, icon: "refresh", tag: en ? "REAL CONTACT" : "CONTATO REAL", title: en ? "Reverse Massage" : "Massagem Reversa", desc: en ? "I do a massage on you, then you take control and do it on me." : "Sente falta de intimidade de verdade? Metade do tempo eu cuido de você, depois você assume o controle, toca em mim e nós dois aproveitamos.", details: en ? "Step 1: Relaxing classic massage\nStep 2: You take control" : "1. Eu faço uma massagem relaxante completa em você (aprox. 30 minutos).\n2. O controle passa para você: sinta-se à vontade para me tocar e explorar.\n3. Quebra da frieza cliente-profissional: é pura conexão humana.\n4. Finalização mútua e troca de carinho que realiza qualquer vontade." },
    { id: 'nuru', category: 'premium', type: 'single', min: 60, price: p.nuru, icon: "star", popular: true, tag: en ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: en ? "Nuru Massage" : "Massagem Nuru", desc: en ? "Gliding gel, parts of my body sliding over yours." : "Para quando você está no limite. Muito gel deslizando, contato extremo pele com pele e uma experiência que vai fazer suas pernas tremerem.", details: en ? "Step 1: Full massage\nStep 2: Warm gel\nStep 3: Skin on skin" : "1. Massagem inicial rápida para aquecer e soltar o corpo.\n2. Aplicação de bastante gel e especial em nós dois.\n3. Contato total pele na pele: uso partes do meu corpo deslizando sobre o seu.\n4. A viagem final mais prazerosa e intensa para você relaxar e apagar." },
    { id: 'depilacao', category: 'care', type: 'single', min: 60, price: p.depil, icon: "shield", tag: en ? "PRACTICALITY" : "ESTÉTICA", title: en ? "Full Body Trim" : "Aparo de Pelos do Corpo", desc: en ? "Leave with a clean, light body ready for the week." : "Sem tempo para se cuidar? Eu aparo os pelos do seu corpo com máquina profissional para você ficar impecável e limpo para a semana.", details: en ? "Step 1: Trim with clippers\nStep 2: Focus on body parts" : "1. Aparo com máquina (pente zero ou três) feito de forma cuidadosa.\n2. Foco nas regiões que você escolher (peito, costas, abdômen ou pernas).\n3. Feito no conforto da sua casa ou hotel, sem a frieza de salões.\n4. Resultado: Corpo mais limpo, menos suor e visual muito mais agradável." }
  ];

  const plans: ServiceItem[] = [
    { id: 'pack_basic', category: 'premium', type: 'pack', min: 60, price: p.pack_basic.v, fullPrice: p.pack_basic.full, savings: p.pack_basic.save, title: en ? "Routine Relief (2x)" : "Alívio de Rotina (2x)", desc: en ? "For those who stand or type a lot. Includes a relaxing bonus." : "Para quem trabalha de pé ou digitando. Inclui um bônus relaxante grátis.", details: en ? "1x Foot Massage\n1x Classic\n🎁 Bonus: Free Aromatherapy" : "1x Massagem nos Pés\n1x Massagem Clássica\n🎁 Bônus: Aromaterapia grátis em ambas as sessões\nDuas semanas garantidas de alívio rápido e aromático.", tag: en ? "RELAX" : "RELAX", icon: "clock" },
    { id: 'pack_essencial', category: 'premium', type: 'pack', min: 60, price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, title: en ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", desc: en ? "Two sessions to cure pain and mind." : "O básico essencial. Duas sessões agendadas no mês: um dia para tirar dores, outro para aliviar a mente.", details: en ? "1x Classic\n1x Sensory" : "1x Massagem Clássica (para tirar as dores e nós musculares)\n1x Massagem Sensorial (para esvaziar a cabeça com toques e prazer)\nSessões agendadas separadamente no mês\nIdeal para garantir que você não surte com a rotina.", tag: en ? "PERFECT SLEEP" : "DURMA BEM", icon: "layers" },
    { id: 'pack_glow', category: 'premium', type: 'pack', min: 60, price: p.pack_glow.v, fullPrice: p.pack_glow.full, savings: p.pack_glow.save, title: en ? "Full Renewal (2x)" : "Renovação Completa (2x)", desc: en ? "A day for aesthetics and a day for pleasure. With a time bonus." : "Dia de cuidar da estética e dia de ter muito prazer. Com bônus de tempo.", details: en ? "1x Trim\n1x Fusion\n🎁 Bonus: +30 min free on Fusion" : "1x Aparo de Pelos do Corpo\n1x Experiência Fusion\n🎁 Bônus: +30 minutos extras grátis na sessão Fusion\nIdeal para elevar a autoestima, ficar limpo e aliviar o estresse.", tag: en ? "GLOW UP" : "GLOW UP", icon: "sparkles" },
    { id: 'pack_muscle', category: 'premium', type: 'pack', min: 60, price: p.pack_muscle.v, fullPrice: p.pack_muscle.full, savings: p.pack_muscle.save, title: en ? "Recovery Combo (2x)" : "Combo Recuperação (2x)", desc: en ? "Focused on those who train hard and suffer from intense muscle pain." : "Focado em quem treina pesado e sofre com dores musculares intensas.", details: en ? "2x Crossfit\n🎁 Bonus: Extra Pain Focus free" : "2x Massagem para Atletas (Crossfit)\n🎁 Bônus: Foco Extra em Dores (Pomadas potentes) grátis\nDuas sessões totalmente dedicadas à sua recuperação física pesada.", tag: en ? "MUSCLE" : "MÚSCULOS", icon: "zap" },
    { id: 'pack_interativo', category: 'premium', type: 'pack', min: 60, price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, title: en ? "Real Connection (2x)" : "Combo Conexão (2x)", desc: en ? "Missing human contact? Two encounters to forget loneliness." : "Para quem precisa de contato humano real e intimidade. Dois encontros separados no mês para você não se sentir sozinho.", details: en ? "1x Fusion\n1x Reverse" : "1x Experiência Fusion (relaxamento que termina de forma completa)\n1x Massagem Reversa (o dia para você matar a vontade de tocar e explorar)\nSessões marcadas em dias diferentes para você ter o que esperar no mês\nFoco 100% em te dar calor humano e atenção exclusiva.", tag: en ? "END OF LONELINESS" : "MAIS CALOR HUMANO", icon: "heart", popular: true },
    { id: 'pack_premium', category: 'premium', type: 'pack', min: 60, price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, title: en ? "Boss Plan (3x)" : "Mensalidade do Chefe (3x)", desc: en ? "You deserve to be treated like a king. Three weeks guaranteed." : "Você trabalha demais, merece um tratamento VIP. Três semanas do mês garantidas com as minhas melhores e mais intensas massagens.", details: en ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista (liberdade sem roupas para soltar as amarras)\n1x Fusion (equilíbrio perfeito entre massagem forte e clímax quente)\n1x Nuru (contato extremo com gel para o maior relaxamento possível)\nTrês encontros VIP para garantir que seu mês seja um sucesso sem estresse.", tag: en ? "MONTH'S REWARD" : "TRATAMENTO DE REI", icon: "award" },
    { id: 'pack_ultimate', category: 'premium', type: 'pack', min: 60, price: p.pack_ultimate.v, fullPrice: p.pack_ultimate.full, savings: p.pack_ultimate.save, title: en ? "Pleasure Journey (3x)" : "Jornada do Prazer (3x)", desc: en ? "Total immersion. Three weeks escalating the level of intimacy." : "A imersão total. Três semanas escalando o nível de intimidade e calor.", details: en ? "1x Sensory\n1x Fusion\n1x Nuru\n🎁 Bonus: Touch allowed free" : "1x Massagem Sensorial\n1x Experiência Fusion\n1x Massagem Nuru\n🎁 Bônus: Liberdade para Tocar grátis liberada nos 3 encontros\nA forma definitiva de desligar a mente e explorar sensações.", tag: en ? "PREMIUM" : "PREMIUM", icon: "heart" }
  ];

  const extras: ExtraItem[] = [
    { id: 'hair_trim', price: p.extras.hair_trim, icon: "shield", label: en ? "Trim (Extra)" : "Aparo de Pelos", desc: en ? "Maintenance in 2 body parts to look flawless." : "Aparo de pelos com máquina em até 2 áreas do corpo. Fique limpo e com o visual em dia.", recommendedFor: ['depilacao'] },
    { id: 'more_time', price: p.extras.more_time, icon: "clock", label: en ? "Extended Time (+30m)" : "Mais 30 Minutos", desc: en ? "Because when it's good, we don't want it to end." : "Adicione mais 30 minutos na sua sessão. Ideal para curtir sem pressa e relaxar muito mais." },
    { id: 'touch', price: p.extras.touch, icon: "heart", label: en ? "Organic Interaction" : "Liberdade para Tocar", desc: en ? "Feel free to participate and touch as well." : "Você terá liberdade total para me tocar, acariciar e participar ativamente durante a massagem.", recommendedFor: ['sensitiva', 'mista', 'reversa', 'nuru'] },
    { id: 'aroma', price: p.extras.aroma, icon: "sparkles", label: en ? "Deep Aromatherapy" : "Aromaterapia", desc: en ? "Essential oils that lower your mental frequency." : "Uso de óleos essenciais relaxantes no ambiente e corpo para acalmar a mente.", recommendedFor: ['relaxante', 'sensitiva', 'mista'] },
    { id: 'pain_relief', price: p.extras.pain_relief, icon: "award", label: en ? "Extra Focus on Pain" : "Alívio de Dores Fortes", desc: en ? "Use of technical ointment to treat strong pain." : "Atenção extra nas áreas travadas usando pomadas térmicas potentes para tirar dores.", recommendedFor: ['crossfit', 'relaxante'] },
    { id: 'dominador', price: p.extras.dominador, icon: "zap", label: en ? "Active & Dominant" : "Postura Dominadora", desc: en ? "I take full control at the end of the session." : "Eu assumo uma postura mais ativa e dominadora durante a parte final do encontro, com penetração.", recommendedFor: ['mista', 'reversa', 'nuru'] },
    { id: 'oral', price: p.extras.oral, icon: "heart", label: en ? "Oral Included" : "Estímulo Oral", desc: en ? "Oral intimacy included in the experience." : "Inclusão de contato quente e direto para maximizar a sua experiência final.", recommendedFor: ['mista', 'nuru'] },
    { id: 'beijos', price: p.extras.beijos, icon: "heart", label: en ? "Kisses Included" : "Beijos e Intimidade", desc: en ? "Kisses and affection allowed during the session." : "Beijos na boca e conexão física liberada durante o clima da sessão.", recommendedFor: ['mista', 'reversa', 'nuru'] },
    { id: 'prostatico', price: p.extras.prostatico, icon: "star", label: en ? "Prostatic Massage" : "Massagem Prostática", desc: en ? "Manual prostatic stimulation with lube." : "Estimulação interna focada, feita com os dedos e lubrificante para um clímax diferente.", recommendedFor: ['mista', 'nuru'] }
  ];

  return {
    services,
    plans,
    extras,
    rules: [
      {
        icon: 'shield',
        title: en ? 'Consent and boundaries' : 'Consentimento e limites',
        description: en ? 'Everything is aligned before starting. The appointment remains respectful, private and professional.' : 'Tudo é combinado antes de começar. O atendimento permanece respeitoso, reservado e profissional.',
      },
      {
        icon: 'home',
        title: en ? 'Prepared environment' : 'Ambiente preparado',
        description: en ? 'A clean, ventilated space and a prior shower improve comfort and hygiene.' : 'Ambiente limpo, ventilado e banho prévio melhoram conforto, higiene e resultado.',
      },
      {
        icon: 'message',
        title: en ? 'Confirmation by WhatsApp' : 'Confirmação pelo WhatsApp',
        description: en ? 'The website organizes the request and sends the summary to WhatsApp for final confirmation.' : 'O site organiza o pedido e envia o resumo pelo WhatsApp para confirmação final.',
      },
    ],
    faq: [
      {
        q: en ? 'Is my information saved?' : 'Meus dados ficam salvos?',
        a: en ? 'Only in your browser, using the same V27 storage key. If you clear cache, local progress can reset.' : 'Ficam salvos apenas no seu navegador, usando a mesma chave da V27. Se limpar o cache, o progresso local pode zerar.',
      },
      {
        q: en ? 'Can I schedule at home or hotel?' : 'Posso agendar em casa ou hotel?',
        a: en ? 'Yes. Choose home, private studio or hotel. For home/hotel, travel cost is confirmed on WhatsApp.' : 'Sim. Escolha casa, studio privativo ou hotel. Para casa/hotel, o deslocamento é confirmado no WhatsApp.',
      },
      {
        q: en ? 'Why do some times have a rush fee?' : 'Por que alguns horários têm taxa de pico?',
        a: en ? 'Noon and late afternoon usually have higher demand and higher travel cost.' : 'Horários de almoço e fim de tarde costumam ter mais demanda e deslocamento mais caro.',
      },
    ],
    text: {
      appName: en ? 'Thalyson Massage Booking' : 'Thalyson Massagens',
      heroTitle: en ? 'Book your care with clarity, comfort and privacy.' : 'Agende seu momento de cuidado com clareza, conforto e privacidade.',
      heroSub: en ? 'Choose the service, location, time and payment method. The final confirmation happens on WhatsApp.' : 'Escolha o serviço, local, horário e pagamento. A confirmação final acontece pelo WhatsApp.',
      socialProof: en ? 'clients served' : 'clientes atendidos',
      start: en ? 'Start booking' : 'Começar agendamento',
      services: en ? 'Services' : 'Serviços',
      plans: en ? 'Monthly plans' : 'Planos mensais',
      single: en ? 'Single sessions' : 'Sessões avulsas',
      continue: en ? 'Continue' : 'Continuar',
      back: en ? 'Back' : 'Voltar',
      finish: en ? 'Send to WhatsApp' : 'Enviar para WhatsApp',
      chooseService: en ? 'Choose your service' : 'Escolha seu atendimento',
      chooseServiceSub: en ? 'The cards are grouped by need, not by confusion. Pick what fits today.' : 'Os cards estão agrupados por necessidade, não por confusão. Escolha o que combina com hoje.',
      profileLocation: en ? 'Your name and location' : 'Seu nome e local',
      dateTime: en ? 'Date and time' : 'Data e horário',
      extrasPayment: en ? 'Extras and payment' : 'Extras e pagamento',
      summary: en ? 'Summary' : 'Resumo',
      name: en ? 'Name or nickname' : 'Nome ou apelido',
      cep: en ? 'ZIP/CEP' : 'CEP',
      street: en ? 'Street' : 'Rua ou avenida completa',
      number: en ? 'Number' : 'Número do local',
      district: en ? 'Neighborhood' : 'Nome do Bairro',
      city: en ? 'City' : 'Nome da Cidade',
      comp: en ? 'Complement / room' : 'Complemento, Bloco, Apto (Opcional)',
      hotelName: en ? 'Hotel name' : 'Nome completo do hotel',
      home: en ? 'My home' : 'Residência',
      studio: en ? 'Private studio' : 'Minha Suíte',
      hotel: en ? 'Hotel' : 'Hotel',
      studioHint: en ? 'The private studio address is sent after WhatsApp confirmation.' : 'O endereço do studio privativo é enviado após confirmação pelo WhatsApp.',
      travelHint: en ? 'Travel fee is calculated and confirmed on WhatsApp.' : 'A taxa de deslocamento para residência/hotel é calculada e confirmada pelo WhatsApp.',
      chooseDate: en ? 'Choose a day' : 'Escolha a data do nosso encontro',
      chooseTime: en ? 'Choose a time' : 'Selecione a hora',
      smartSuggestion: en ? 'Smart suggestion' : 'Sugestão inteligente',
      recommended: en ? 'Recommended' : 'Recomendado',
      rush: en ? 'Rush time' : 'Horário de pico',
      subtotal: en ? 'Subtotal' : 'Subtotal',
      discount: en ? 'Discount' : 'Desconto',
      pixDiscount: en ? 'Pix discount' : 'Desconto Pix (3%)',
      mediaDiscount: en ? 'Portfolio support' : 'Apoio ao portfólio',
      rushFee: en ? 'Rush fee' : 'Taxa de Pico (+R$15)',
      total: en ? 'Total' : 'Total',
      duration: en ? 'Duration' : 'Duração',
      coupon: en ? 'Coupon' : 'Seus Benefícios Disponíveis',
      couponPlaceholder: en ? 'Type your code' : 'Digite seu código',
      apply: en ? 'Apply' : 'Aplicar',
      pix: en ? 'Pix - 3% off' : 'Pix - 3% off',
      card: en ? 'Card' : 'Cartão',
      cash: en ? 'Cash' : 'Dinheiro',
      terms: en ? 'Read and accept the agreement' : 'Regras e Acordos',
      termsModalTitle: en ? 'Care agreement' : 'Acordo de atendimento',
      accept: en ? 'I read and accept' : 'Li e aceito',
      welcomeTitle: en ? 'Welcome. Your care starts here.' : 'Que bom ter você aqui!',
      welcomeMsg: en ? 'I prepared a calmer booking flow and a first-visit gift. You can claim it or close this window.' : 'A maioria dos homens esquece de cuidar de si mesmos na correria do dia a dia. Para comemorar nossa primeira vez, pegue esse presente.',
      claimGift: en ? 'Claim first gift' : 'Pegar Presente Agora',
      skip: en ? 'Not now' : 'Agora não',
      successTitle: en ? 'Your request is ready.' : 'Tudo Certo! Falta Pouco.',
      successSub: en ? 'The WhatsApp message has been prepared with all details. Send it to confirm the schedule.' : 'A mensagem do WhatsApp foi preparada com todos os detalhes. Envie para confirmar o horário do nosso encontro.',
      openWhatsapp: en ? 'Open WhatsApp again' : 'Enviar Pedido no WhatsApp',
      restart: en ? 'New booking' : 'Novo agendamento',
      emptyCart: en ? 'Choose at least one service.' : 'Escolha pelo menos um serviço.',
      invalidName: en ? 'Enter your name with at least 3 characters.' : 'Digite seu nome com pelo menos 3 caracteres.',
      invalidAddress: en ? 'Complete the location fields.' : 'Complete os dados do local onde vamos nos ver.',
      invalidTime: en ? 'Choose a date and time.' : 'Escolha uma data e horário válidos.',
      invalidPayment: en ? 'Choose a payment method and accept the agreement.' : 'Escolha o pagamento e aceite as regras do atendimento.',
      saved: en ? 'Progress saved automatically.' : 'Progresso salvo automaticamente na V27.',
      cepFound: en ? 'Address found.' : 'Endereço carregado.',
      cepError: en ? 'CEP not found. Fill manually.' : 'CEP não encontrado. Preencha manualmente.',
      couponOk: en ? 'Coupon applied.' : 'Presente ativado com sucesso!',
      couponBad: en ? 'Invalid or already used coupon.' : 'Código inválido ou já expirado.',
      copied: en ? 'Copied.' : 'Chave PIX copiada!',
      readableMode: en ? 'Readable mode' : 'Modo de leitura fácil',
      menu: en ? 'Menu' : 'Configurações',
      theme: en ? 'Theme' : 'Tema do Aplicativo',
      dark: en ? 'Dark' : 'Escuro',
      light: en ? 'Light' : 'Claro',
      faq: en ? 'Questions' : 'Tire as Suas Dúvidas',
      safety: en ? 'Safety and comfort' : 'Segurança e conforto',
      xp: en ? 'Care XP' : 'XP de cuidado',
      giftSaved: en ? 'Gift saved in your benefits.' : 'Presente salvo com sucesso.',
      portfolio: en ? 'Allow anonymous portfolio photo and get 1% off' : 'Quer apoiar meu trabalho? (Opcional)',
      portfolioDesc: en ? 'Only aesthetic details, never face, documents or private exposure.' : 'Deixe eu tirar fotos profissionais e anônimas de detalhes do seu corpo (mãos/costas) para portfólio e ganhe 1% OFF.',
      remove: en ? 'Remove' : 'Remover',
      selected: en ? 'Selected' : 'Selecionado',
      from: en ? 'From' : 'A partir de',
      save: en ? 'Save' : 'Economize',
      today: en ? 'Today' : 'HOJE',
      tomorrow: en ? 'Tomorrow' : 'AMANHÃ',
      noSlots: en ? 'No available times for this day.' : 'Infelizmente minha agenda está cheia nesse dia. Tente o próximo.',
      lowDemand: en ? 'Lower demand and calmer arrival.' : 'Menor demanda e chegada mais tranquila.',
    },
  };
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

const GlobalStyles = memo(({ isDark, readable }: { isDark: boolean; readable: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

    :root {
      --font-ui: 'Poppins', Arial, sans-serif;
      --bg: ${isDark ? '#07090d' : '#f7f3ec'};
      --surface: ${isDark ? '#10141c' : '#ffffff'};
      --surface-2: ${isDark ? '#151b25' : '#fbf8f2'};
      --surface-3: ${isDark ? '#1d2532' : '#f1ebe2'};
      --text: ${isDark ? '#f8f4ee' : '#181512'};
      --muted: ${isDark ? '#b8afa5' : '#62584f'};
      --soft: ${isDark ? '#82776d' : '#887d73'};
      --border: ${isDark ? 'rgba(255,255,255,.12)' : 'rgba(39,31,25,.13)'};
      --strong-border: ${isDark ? 'rgba(255,255,255,.22)' : 'rgba(39,31,25,.22)'};
      --blue: #3b82f6;
      --blue-2: #60a5fa;
      --amber: #f59e0b;
      --green: #10b981;
      --rose: #f43f5e;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-ui);
      font-size: ${readable ? '17px' : '16px'};
      font-weight: 400;
      line-height: ${readable ? '1.72' : '1.58'};
      letter-spacing: ${readable ? '0.004em' : '0'};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      -webkit-tap-highlight-color: transparent;
    }
    button, input, select, textarea { font: inherit; }
    button { cursor: pointer; }
    p { max-width: 68ch; }
    strong, b, h1, h2, h3, h4, h5, h6 { font-weight: 700; }
    ::selection { background: rgba(59,130,246,.28); }
    :focus-visible { outline: 3px solid rgba(96,165,250,.85); outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
    }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: translate(-50%, -46%) scale(.94); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
    @keyframes slideRight { from { opacity: 0; transform: translateX(110%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes toastIn { from { opacity: 0; transform: translateY(-16px) scale(.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .45; transform: scale(1.35); } }

    .animate-fade-up { animation: fadeUp .42s cubic-bezier(.16,1,.3,1) both; }
    .animate-fade-in { animation: fadeIn .25s ease both; }
    .animate-scale-in { animation: scaleIn .32s cubic-bezier(.34,1.56,.64,1) both; }
    .animate-slide-right { animation: slideRight .34s cubic-bezier(.16,1,.3,1) both; }
    .animate-toast-in { animation: toastIn .28s cubic-bezier(.34,1.56,.64,1) both; }
    .pulse-dot { animation: pulseDot 1.8s ease-in-out infinite; }

    .glass {
      background: ${isDark ? 'rgba(16,20,28,.82)' : 'rgba(255,255,255,.82)'};
      border: 1px solid var(--border);
      backdrop-filter: blur(22px) saturate(150%);
      -webkit-backdrop-filter: blur(22px) saturate(150%);
    }

    .readable-copy {
      font-family: var(--font-ui);
      font-size: ${readable ? '1rem' : '.96rem'};
      line-height: ${readable ? '1.72' : '1.6'};
      letter-spacing: ${readable ? '.004em' : '0'};
      font-weight: 400;
    }

    .text-gradient {
      background: linear-gradient(135deg, var(--text), var(--blue-2));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }

    @media (max-width: 640px) {
      .mobile-card-width { width: min(84vw, 360px); flex: 0 0 auto; scroll-snap-align: start; }
      .mobile-wide-card { width: min(88vw, 390px); flex: 0 0 auto; scroll-snap-align: start; }
      .mobile-control-card { min-width: min(72vw, 310px); scroll-snap-align: start; }
    }
  `}} />
));

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const Button = memo(({ children, onClick, variant = 'primary', size = 'md', full, disabled, icon, className = '', type = 'button', ariaLabel }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'whatsapp' | 'danger' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  full?: boolean;
  disabled?: boolean;
  icon?: string;
  className?: string;
  type?: 'button' | 'submit';
  ariaLabel?: string;
}) => {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-950/25',
    secondary: 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--strong-border)]',
    ghost: 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]',
    outline: 'border border-[var(--strong-border)] text-[var(--text)] hover:bg-[var(--surface-2)]',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20bd5a] shadow-lg shadow-green-950/25',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    amber: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-950/20',
  } as const;

  const sizes = {
    sm: 'min-h-10 px-4 py-2 text-sm rounded-xl',
    md: 'min-h-12 px-5 py-3 text-[15px] rounded-2xl',
    lg: 'min-h-14 px-7 py-4 text-base rounded-2xl',
  } as const;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:scale-[.98] disabled:opacity-45 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, icon, type = 'text', disabled, maxLength, error, inputMode }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: string;
  type?: string;
  disabled?: boolean;
  maxLength?: number;
  error?: boolean;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) => (
  <label className="block w-full">
    <span className={cx('mb-2 block text-[12px] font-bold uppercase tracking-[.14em]', error ? 'text-rose-500' : 'text-[var(--muted)]')}>{label}</span>
    <span className="relative block">
      {icon && <Icon name={icon} size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--soft)]" />}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
        className={cx(
          'h-14 min-h-14 w-full rounded-2xl border bg-[var(--surface)] py-3 text-base font-normal text-[var(--text)] placeholder:text-[var(--soft)] transition-all',
          icon ? 'pl-12 pr-4' : 'px-4',
          error ? 'border-rose-500/70 shadow-[0_0_0_4px_rgba(244,63,94,.12)]' : 'border-[var(--border)] focus:border-blue-500',
          disabled && 'opacity-60',
        )}
      />
    </span>
  </label>
));

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
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120]" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fade-in" onClick={onClose} />
      <section className="animate-scale-in fixed left-1/2 top-1/2 w-[min(92vw,560px)] max-h-[86vh] overflow-hidden rounded-[2rem] border border-[var(--strong-border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] p-5 md:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-950/20">
              <Icon name={icon} size={21} />
            </div>
            <h2 id="modal-title" className="text-xl font-bold leading-tight text-[var(--text)]">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label={closeLabel}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            <Icon name="x" size={21} />
          </button>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-5 md:p-6 readable-copy text-[var(--muted)]">{children}</div>
        {footer && <div className="border-t border-[var(--border)] p-4 md:p-5">{footer}</div>}
      </section>
    </div>
  );
});

const ToastContainer = memo(({ toasts }: { toasts: ToastItem[] }) => (
  <div className="pointer-events-none fixed left-1/2 top-4 z-[180] flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role="status"
        className={cx(
          'animate-toast-in pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl',
          toast.type === 'error'
            ? 'border-rose-400/30 bg-rose-950/90 text-rose-50'
            : toast.type === 'info'
              ? 'border-blue-400/30 bg-blue-950/90 text-blue-50'
              : 'border-emerald-400/30 bg-emerald-950/90 text-emerald-50',
        )}
      >
        <Icon name={toast.type === 'error' ? 'alert' : 'check'} size={18} />
        <span className="text-sm font-bold leading-snug">{toast.msg}</span>
      </div>
    ))}
  </div>
));

const SectionTitle = memo(({ kicker, title, desc }: { kicker?: string; title: string; desc?: string }) => (
  <div className="mb-6">
    {kicker && <p className="mb-2 text-[12px] font-bold uppercase tracking-[.18em] text-blue-500">{kicker}</p>}
    <h2 className="text-2xl font-bold leading-tight md:text-4xl">{title}</h2>
    {desc && <p className="readable-copy mt-3 text-[var(--muted)]">{desc}</p>}
  </div>
));

const PhotoShowcase = memo(({ lang }: { lang: Lang }) => {
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  return (
    <section className="mb-8 rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-3 shadow-xl md:p-4" aria-label={lang === 'pt' ? 'Fotos do atendimento' : 'Appointment photos'}>
      <div className="scrollbar-hide flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible">
        {PHOTO_CONFIG.map((photo, index) => (
          <article key={photo.src} className="mobile-wide-card relative h-52 overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-2)] md:h-64 md:w-auto">
            {!failed[photo.src] ? (
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                onError={() => setFailed((prev) => ({ ...prev, [photo.src]: true }))}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-600/15 via-[var(--surface-2)] to-amber-500/15 p-6 text-center">
                <Icon name={index === 0 ? 'camera' : index === 1 ? 'sparkles' : 'home'} size={30} className="text-blue-500" />
                <p className="text-sm font-bold text-[var(--muted)]">
                  {lang === 'pt' ? 'Adicione sua foto em' : 'Add your photo at'}<br />
                  <span className="text-[var(--text)]">{photo.src}</span>
                </p>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
              <p className="text-sm font-bold text-white">{photo.label}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
});


const ServiceCard = memo(({ item, selected, onToggle, lang, isPlan }: {
  item: ServiceItem;
  selected: boolean;
  onToggle: (item: ServiceItem) => void;
  lang: Lang;
  isPlan?: boolean;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={cx(
        'group mobile-card-width relative overflow-hidden rounded-[1.75rem] border bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400/50 hover:shadow-xl md:w-auto md:max-w-none md:shrink',
        selected ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,.16)]' : 'border-[var(--border)]',
      )}
    >
      {item.popular && (
        <div className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-bold uppercase tracking-[.1em] text-zinc-950">
          {lang === 'pt' ? 'Mais escolhido' : 'Popular'}
        </div>
      )}
      <div className="mb-5 flex items-center gap-3 pr-28">
        <div className={cx('flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg', isPlan ? 'bg-amber-500 shadow-amber-950/20' : 'bg-blue-600 shadow-blue-950/20')}>
          <Icon name={item.icon} size={23} />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{item.tag}</p>
          <h3 className="mt-1 text-lg font-bold leading-tight text-[var(--text)]">{item.title}</h3>
        </div>
      </div>

      <p className="readable-copy mb-5 text-[var(--muted)]">{item.desc}</p>

      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--soft)]">{lang === 'pt' ? 'Duração' : 'Duration'}</p>
          <p className="mt-1 text-lg font-bold">{item.min} min</p>
        </div>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--soft)]">{lang === 'pt' ? 'Valor' : 'Price'}</p>
          <p className="mt-1 text-lg font-bold">{formatMoney(item.price, lang)}</p>
          {item.savings ? <p className="text-xs font-bold text-emerald-500">-{formatMoney(item.savings, lang)}</p> : null}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mb-4 flex w-full items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 text-left text-sm font-bold text-[var(--muted)] transition hover:text-[var(--text)]"
      >
        {lang === 'pt' ? 'Ver como funciona' : 'How it works'}
        <Icon name="chevronDown" size={17} className={cx('transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="mb-4 rounded-2xl bg-[var(--surface-2)] p-4 animate-fade-up">
          <ul className="space-y-2">
            {item.details.split('\n').map((detail, index) => (
              <li key={detail} className="flex items-start gap-2 text-sm font-normal leading-relaxed text-[var(--muted)]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">{index + 1}</span>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={() => onToggle(item)} variant={selected ? 'secondary' : isPlan ? 'amber' : 'primary'} full icon={selected ? 'check' : 'plus'}>
        {selected ? (lang === 'pt' ? 'Selecionado' : 'Selected') : (lang === 'pt' ? 'Escolher atendimento' : 'Choose')}
      </Button>
    </article>
  );
});

const PriceLine = memo(({ label, value, muted, negative, positive }: { label: string; value: string; muted?: boolean; negative?: boolean; positive?: boolean }) => (
  <div className={cx('flex items-center justify-between gap-3 text-sm', muted ? 'text-[var(--muted)]' : 'text-[var(--text)]')}>
    <span className="font-bold">{label}</span>
    <span className={cx('font-bold', negative && 'text-emerald-500', positive && 'text-amber-500')}>{value}</span>
  </div>
));

const SideMenu = memo(({ open, onClose, isDark, toggleTheme, lang, setLang, readable, setReadable, user, T, clearDraft }: {
  open: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  lang: Lang;
  setLang: (lang: Lang) => void;
  readable: boolean;
  setReadable: (value: boolean) => void;
  user: UserData;
  T: ReturnType<typeof getData>['text'];
  clearDraft: () => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110]">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <aside className="animate-slide-right absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[.18em] text-blue-500">{T.menu}</p>
            <h2 className="text-2xl font-bold">{T.appName}</h2>
          </div>
          <button onClick={onClose} aria-label="Fechar menu" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)]">
            <Icon name="x" size={21} />
          </button>
        </div>

        <div className="mb-5 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-2)] p-5">
          <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{T.xp}</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-4xl font-bold">{user.xp}</span>
            <span className="pb-1 text-sm font-bold text-blue-500">XP</span>
          </div>
          <p className="readable-copy mt-3 text-sm text-[var(--muted)]">{T.saved}</p>
        </div>

        <div className="space-y-3">
          <Button variant="secondary" full icon={isDark ? 'moon' : 'sun'} onClick={toggleTheme}>{T.theme}: {isDark ? T.dark : T.light}</Button>
          <Button variant="secondary" full icon="eye" onClick={() => setReadable(!readable)}>{T.readableMode}: {readable ? 'ON' : 'OFF'}</Button>
          <Button variant="secondary" full icon="globe" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>{lang === 'pt' ? 'English' : 'Português'}</Button>
          <Button variant="outline" full icon="instagram" onClick={() => window.open(CONFIG.INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}>Instagram</Button>
          <Button variant="danger" full icon="trash" onClick={clearDraft}>{lang === 'pt' ? 'Limpar rascunho' : 'Clear draft'}</Button>
        </div>

        <div className="mt-auto rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm font-normal leading-relaxed text-[var(--muted)]">
          V27 • Storage preservado: <span className="font-bold text-[var(--text)]">{CONFIG.STORAGE_KEY}</span>
        </div>
      </aside>
    </div>
  );
});

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [readable, setReadable] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [activeTab, setActiveTab] = useState<'single' | 'plans'>('single');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 92,
    lastActivity: new Date().toISOString(),
  });

  const emptyAddress: Address = useMemo(() => ({ cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' }), []);

  const [booking, setBooking] = useState<BookingData>({
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
  });

  const dateRowRef = useRef<HTMLDivElement | null>(null);

  const addToast = useCallback((msg: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-3), { id, msg, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600);
  }, []);

  useEffect(() => {
    setIsClient(true);
    document.title = 'Thalyson Massagens • Agendamento V27';
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && typeof parsed.user === 'object') {
          setUser({
            name: sanitizeInput(parsed.user.name || ''),
            xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            hasSeenWelcome: Boolean(parsed.user.hasSeenWelcome),
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(92, parsed.user.ordersCount) : 92,
            lastActivity: parsed.user.lastActivity || new Date().toISOString(),
          });
        }
        if (parsed.bookingDraft && typeof parsed.bookingDraft === 'object') {
          const draft = parsed.bookingDraft;
          setBooking((current) => ({
            ...current,
            ...draft,
            type: draft.type === 'pack' ? 'pack' : 'single',
            cart: Array.isArray(draft.cart) ? draft.cart : [],
            extras: draft.extras && typeof draft.extras === 'object' ? draft.extras : {},
            date: draft.date || null,
            time: draft.time || null,
            locationType: ['home', 'studio', 'hotel', 'motel'].includes(draft.locationType)
              ? (draft.locationType === 'motel' ? 'studio' : draft.locationType)
              : 'home',
            address: {
              cep: sanitizeInput(draft.address?.cep || ''),
              street: sanitizeInput(draft.address?.street || ''),
              number: sanitizeInput(draft.address?.number || ''),
              district: sanitizeInput(draft.address?.district || ''),
              city: sanitizeInput(draft.address?.city || ''),
              comp: sanitizeInput(draft.address?.comp || ''),
              placeName: sanitizeInput(draft.address?.placeName || ''),
            },
            payment: ['pix', 'card', 'cash'].includes(draft.payment) ? draft.payment : '',
            termsAccepted: Boolean(draft.termsAccepted),
            mediaAllowed: Boolean(draft.mediaAllowed),
            bookingId: draft.bookingId || `BOOK_${Date.now()}`,
          }));
        }
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
      }
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } finally {
      window.setTimeout(() => setLoading(false), 550);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || loading) return;
    try {
      const payload = {
        user: { ...user, lastActivity: new Date().toISOString() },
        bookingDraft: booking,
        step,
        preferences: { isDark, readable, lang },
      };
      const raw = JSON.stringify(payload);
      if (raw.length < CONFIG.MAX_STORAGE_SIZE * 1024) localStorage.setItem(CONFIG.STORAGE_KEY, raw);
    } catch {
      // Evita quebra em modo privado ou storage cheio.
    }
  }, [booking, isClient, isDark, lang, loading, readable, step, user]);

  useEffect(() => {
    if (!isClient || loading) return;
    if (!user.hasSeenWelcome) {
      const timer = window.setTimeout(() => setWelcomeOpen(true), 700);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isClient, loading, user.hasSeenWelcome]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const selectedIds = useMemo(() => new Set(booking.cart.map((item) => item.id)), [booking.cart]);
  const isPack = useMemo(() => booking.cart.some((item) => item.type === 'pack'), [booking.cart]);

  const selectedExtras = useMemo(() => DATA.extras.filter((extra) => booking.extras[extra.id]), [DATA.extras, booking.extras]);

  const financials = useMemo(() => {
    const subtotalServices = booking.cart.reduce((sum, item) => sum + item.price, 0);
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + (isPack ? Math.floor(extra.price * 0.8) : extra.price), 0);
    const subtotal = subtotalServices + extrasTotal;
    const couponDiscount = booking.appliedCoupon?.val || 0;
    let running = Math.max(0, subtotal - couponDiscount);
    const mediaDiscount = booking.mediaAllowed ? Math.ceil(running * 0.01) : 0;
    running = Math.max(0, running - mediaDiscount);
    const pixDiscount = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    const rushFee = booking.time && RUSH_HOURS.includes(booking.time) && booking.locationType !== 'studio' ? RUSH_FEE : 0;
    const durationBase = isPack ? Math.max(...booking.cart.map((item) => item.min || 60), 60) : booking.cart.reduce((sum, item) => sum + (item.min || 60), 0);
    const duration = durationBase + (booking.extras.more_time ? 30 : 0);
    const total = Math.max(0, running - pixDiscount) + rushFee;
    return { subtotal, couponDiscount, mediaDiscount, pixDiscount, rushFee, total, duration };
  }, [booking.appliedCoupon?.val, booking.cart, booking.extras.more_time, booking.locationType, booking.mediaAllowed, booking.payment, booking.time, isPack, selectedExtras]);

  const days = useMemo(() => {
    const list: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 21; i += 1) {
      const day = new Date(today.getTime());
      day.setDate(today.getDate() + i);
      list.push(day);
    }
    return list;
  }, []);

  const slots = useMemo(() => {
    if (!booking.date) return [];
    const selectedDate = new Date(`${booking.date}T00:00:00`);
    const now = new Date();
    const generated: string[] = [];
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour += 1) {
      generated.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return generated.filter((time) => {
      const [hour] = time.split(':').map(Number);
      if (isToday(selectedDate)) return hour > now.getHours() + 1;
      return true;
    });
  }, [booking.date]);

  const smartSlot = useMemo(() => {
    const calmSlots = slots.filter((slot) => !RUSH_HOURS.includes(slot));
    const evening = calmSlots.find((slot) => Number(slot.slice(0, 2)) >= 19);
    const afternoon = calmSlots.find((slot) => Number(slot.slice(0, 2)) >= 14 && Number(slot.slice(0, 2)) < 17);
    return evening || afternoon || calmSlots[0] || slots[0] || null;
  }, [slots]);

  const groupedSlots = useMemo(() => ({
    morning: slots.filter((slot) => Number(slot.slice(0, 2)) < 12),
    afternoon: slots.filter((slot) => Number(slot.slice(0, 2)) >= 12 && Number(slot.slice(0, 2)) < 18),
    evening: slots.filter((slot) => Number(slot.slice(0, 2)) >= 18),
  }), [slots]);

  const toggleCartItem = useCallback((item: ServiceItem) => {
    safeVibrate(25);
    setBooking((prev) => {
      const exists = prev.cart.some((cartItem) => cartItem.id === item.id);
      const nextCart = exists ? prev.cart.filter((cartItem) => cartItem.id !== item.id) : [...prev.cart, item];
      return {
        ...prev,
        type: item.type === 'pack' && !exists ? 'pack' : nextCart.some((cartItem) => cartItem.type === 'pack') ? 'pack' : 'single',
        cart: nextCart,
        appliedCoupon: nextCart.length ? prev.appliedCoupon : null,
      };
    });
  }, []);

  const updateAddress = useCallback((patch: Partial<Address>) => {
    setBooking((prev) => ({ ...prev, address: { ...prev.address, ...patch } }));
  }, []);

  const fetchCep = useCallback(async (value: string) => {
    const masked = maskCEP(value);
    updateAddress({ cep: masked });
    if (masked.length !== 9) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${onlyDigits(masked)}/json/`);
      const result = await response.json();
      if (!result.erro) {
        updateAddress({ street: result.logradouro || '', district: result.bairro || '', city: result.localidade || '', cep: masked });
        addToast(T.cepFound, 'success');
      } else {
        addToast(T.cepError, 'error');
      }
    } catch {
      addToast(T.cepError, 'error');
    } finally {
      setCepLoading(false);
    }
  }, [T.cepError, T.cepFound, addToast, updateAddress]);

  const applyCoupon = useCallback(() => {
    const code = couponInput.trim().toUpperCase();
    const found = user.coupons.find((coupon) => coupon.code.toUpperCase() === code && !user.usedCoupons.includes(coupon.code));
    if (!found) {
      addToast(T.couponBad, 'error');
      safeVibrate([30, 70, 30]);
      return;
    }
    setBooking((prev) => ({ ...prev, appliedCoupon: found }));
    setCouponInput('');
    addToast(T.couponOk, 'success');
  }, [T.couponBad, T.couponOk, addToast, couponInput, user.coupons, user.usedCoupons]);

  const claimWelcomeGift = useCallback(() => {
    const gift: Coupon = { id: `WELCOME_${Date.now()}`, val: 10, title: 'Primeira visita', code: 'PRIMEIRO10' };
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

  const isStepValid = useCallback((currentStep = step) => {
    if (currentStep === 0) return booking.cart.length > 0;
    if (currentStep === 1) {
      if (user.name.trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return Boolean(booking.address.placeName && booking.address.city);
      return true;
    }
    if (currentStep === 2) return Boolean(booking.date && booking.time);
    if (currentStep === 3) return Boolean(booking.payment && booking.termsAccepted);
    return true;
  }, [booking.address, booking.cart.length, booking.date, booking.locationType, booking.payment, booking.termsAccepted, booking.time, step, user.name]);

  const validationMessage = useCallback(() => {
    if (step === 0) return T.emptyCart;
    if (step === 1) return user.name.trim().length < 3 ? T.invalidName : T.invalidAddress;
    if (step === 2) return T.invalidTime;
    if (step === 3) return T.invalidPayment;
    return '';
  }, [T.emptyCart, T.invalidAddress, T.invalidName, T.invalidPayment, T.invalidTime, step, user.name]);

  const generateWhatsAppMessage = useCallback(() => {
    const dateLabel = booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'long', day: '2-digit', month: 'long' }) : '-';
    const hashPayload = `${financials.total}-${booking.date}-${booking.time}-${booking.cart.map((item) => item.id).join(',')}-${CONFIG.SECRET_TOKEN}`;
    const hash = btoa(unescape(encodeURIComponent(hashPayload))).slice(0, 8).toUpperCase();

    const servicesText = booking.cart.map((item) => `• ${item.title} (${item.min}min) — ${formatMoney(item.price, lang)}`).join('\n');
    const extrasText = selectedExtras.length ? selectedExtras.map((extra) => `• ${extra.label}`).join('\n') : lang === 'pt' ? 'Nenhum extra selecionado' : 'No extras selected';

    let locationText = '';
    if (booking.locationType === 'home') {
      locationText = `Casa: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}. ${booking.address.comp ? `Complemento: ${booking.address.comp}` : ''}`;
    } else if (booking.locationType === 'hotel') {
      locationText = `Hotel: ${booking.address.placeName}, ${booking.address.city}. ${booking.address.comp ? `Quarto/comp.: ${booking.address.comp}` : ''}`;
    } else {
      locationText = lang === 'pt' ? 'Studio privativo — endereço a confirmar pelo WhatsApp.' : 'Private studio — address confirmed on WhatsApp.';
    }

    const paymentLabel = booking.payment === 'pix' ? 'Pix' : booking.payment === 'card' ? (lang === 'pt' ? 'Cartão' : 'Card') : (lang === 'pt' ? 'Dinheiro' : 'Cash');

    return lang === 'pt'
      ? `*AGENDAMENTO THALYSON MASSAGENS* #${hash}\n\nOlá, Thalyson! Quero confirmar meu agendamento.\n\n*Nome:* ${sanitizeInput(user.name)}\n*Data:* ${dateLabel}\n*Horário:* ${booking.time}\n*Duração estimada:* ${financials.duration} min\n\n*Serviços:*\n${servicesText}\n\n*Extras:*\n${extrasText}\n\n*Local:*\n${locationText}\n\n*Pagamento:* ${paymentLabel}\n\n*Resumo financeiro:*\nSubtotal: ${formatMoney(financials.subtotal, lang)}\n${financials.couponDiscount ? `Cupom: -${formatMoney(financials.couponDiscount, lang)}\n` : ''}${financials.mediaDiscount ? `Portfólio: -${formatMoney(financials.mediaDiscount, lang)}\n` : ''}${financials.pixDiscount ? `Pix 3%: -${formatMoney(financials.pixDiscount, lang)}\n` : ''}${financials.rushFee ? `Taxa de pico: +${formatMoney(financials.rushFee, lang)}\n` : ''}*Total:* ${formatMoney(financials.total, lang)}\n\nLi e aceitei o acordo de atendimento. A taxa de deslocamento, se houver, pode ser confirmada por aqui.`
      : `*THALYSON MASSAGE BOOKING* #${hash}\n\nHello, Thalyson! I want to confirm my booking.\n\n*Name:* ${sanitizeInput(user.name)}\n*Date:* ${dateLabel}\n*Time:* ${booking.time}\n*Estimated duration:* ${financials.duration} min\n\n*Services:*\n${servicesText}\n\n*Extras:*\n${extrasText}\n\n*Location:*\n${locationText}\n\n*Payment:* ${paymentLabel}\n\n*Financial summary:*\nSubtotal: ${formatMoney(financials.subtotal, lang)}\n${financials.couponDiscount ? `Coupon: -${formatMoney(financials.couponDiscount, lang)}\n` : ''}${financials.mediaDiscount ? `Portfolio: -${formatMoney(financials.mediaDiscount, lang)}\n` : ''}${financials.pixDiscount ? `Pix 3%: -${formatMoney(financials.pixDiscount, lang)}\n` : ''}${financials.rushFee ? `Rush fee: +${formatMoney(financials.rushFee, lang)}\n` : ''}*Total:* ${formatMoney(financials.total, lang)}\n\nI read and accepted the care agreement. Travel fee, if needed, can be confirmed here.`;
  }, [booking.address.city, booking.address.comp, booking.address.district, booking.address.number, booking.address.placeName, booking.address.street, booking.cart, booking.date, booking.locationType, booking.payment, booking.time, financials.couponDiscount, financials.duration, financials.mediaDiscount, financials.pixDiscount, financials.rushFee, financials.subtotal, financials.total, lang, selectedExtras, user.name]);

  const openWhatsApp = useCallback(() => {
    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [generateWhatsAppMessage]);

  const finishBooking = useCallback(() => {
    const earnedXP = Math.max(10, Math.floor(financials.total * (isPack ? 0.28 : 0.14)));
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + earnedXP,
      ordersCount: Math.max(92, prev.ordersCount + 1),
      usedCoupons: booking.appliedCoupon ? [...new Set([...prev.usedCoupons, booking.appliedCoupon.code])] : prev.usedCoupons,
      lastActivity: new Date().toISOString(),
    }));
    openWhatsApp();
    setStep(4);
  }, [booking.appliedCoupon, financials.total, isPack, openWhatsApp]);

  const nextStep = useCallback(() => {
    if (!isStepValid()) {
      addToast(validationMessage(), 'error');
      safeVibrate([30, 70, 30]);
      return;
    }
    if (step === 3) finishBooking();
    else setStep((prev) => Math.min(prev + 1, 4));
  }, [addToast, finishBooking, isStepValid, step, validationMessage]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    setBooking({
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
    });
    setStep(0);
    setMenuOpen(false);
    addToast(lang === 'pt' ? 'Rascunho limpo.' : 'Draft cleared.', 'info');
  }, [addToast, emptyAddress, lang]);

  const dayLabel = useCallback((date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (date.toDateString() === new Date().toDateString()) return T.today;
    if (date.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).replace('.', '');
  }, [T.today, T.tomorrow, lang]);

  const serviceGroups = useMemo(() => {
    const groups: Record<ServiceCategory, ServiceItem[]> = { relax: [], recovery: [], premium: [], care: [] };
    DATA.services.forEach((service) => groups[service.category || 'relax'].push(service));
    return groups;
  }, [DATA.services]);

  const categoryCopy = useMemo(() => ({
    relax: { title: lang === 'pt' ? 'Relaxamento e ansiedade' : 'Relaxation and anxiety', desc: lang === 'pt' ? 'Para desacelerar, dormir melhor e aliviar sobrecarga mental.' : 'For slowing down, sleeping better and relieving mental overload.' },
    recovery: { title: lang === 'pt' ? 'Dores e recuperação' : 'Pain and recovery', desc: lang === 'pt' ? 'Para treino, postura, rigidez e esforço físico.' : 'For training, posture, stiffness and physical effort.' },
    premium: { title: lang === 'pt' ? 'Experiências premium' : 'Premium experiences', desc: lang === 'pt' ? 'Atendimentos mais completos, com ritual e preparo de ambiente.' : 'More complete appointments, with ritual and room preparation.' },
    care: { title: lang === 'pt' ? 'Cuidados rápidos' : 'Quick care', desc: lang === 'pt' ? 'Soluções localizadas e objetivas para o dia a dia.' : 'Localized and objective solutions for your routine.' },
  }), [lang]);

  if (!isClient) return <div className="min-h-screen bg-[#07090d]" />;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-white">
        <div className="mx-auto max-w-sm px-6 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-blue-600 text-4xl font-bold shadow-2xl shadow-blue-950/40">T</div>
          <p className="text-sm font-bold uppercase tracking-[.22em] text-blue-200">Carregando V27</p>
          <p className="mt-3 text-sm font-normal text-zinc-400">Preservando seus dados salvos...</p>
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
        <div className="mt-5 rounded-2xl border border-blue-400/25 bg-blue-500/10 p-4 text-blue-100 dark:text-blue-100">
          <p className="font-bold text-[var(--text)]">PRIMEIRO10</p>
          <p className="mt-1 text-sm font-normal text-[var(--muted)]">{lang === 'pt' ? 'R$10 de desconto salvo no navegador, usando a mesma base V27.' : 'R$10 discount saved in the browser using the same V27 base.'}</p>
        </div>
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
              <div className="mb-2 flex items-center gap-2 font-bold text-[var(--text)]"><Icon name={rule.icon} size={18} /> {rule.title}</div>
              <p>{rule.description}</p>
            </div>
          ))}
          <p className="text-sm font-bold text-[var(--soft)]">
            {lang === 'pt'
              ? 'Este agendamento é uma solicitação. O horário só fica confirmado depois da resposta pelo WhatsApp.'
              : 'This booking is a request. The time is only confirmed after WhatsApp confirmation.'}
          </p>
        </div>
      </CenterModal>

      <div className="fixed inset-0 -z-10 bg-[var(--bg)]" />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[110px]" />
        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/82 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
          <button onClick={() => setStep(0)} className="text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-950/20">T</div>
              <div>
                <h1 className="text-base font-bold leading-none min-[380px]:text-lg md:text-xl">{T.appName}</h1>
                <p className="mt-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--soft)] min-[380px]:text-[11px] md:text-[12px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" /> +{user.ordersCount} {T.socialProof}
                </p>
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-2 md:flex">
            {[0, 1, 2, 3].map((itemStep) => (
              <button
                key={itemStep}
                onClick={() => itemStep < step && setStep(itemStep)}
                className={cx(
                  'rounded-full px-4 py-2 text-sm font-bold transition',
                  step === itemStep ? 'bg-blue-600 text-white' : itemStep < step ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'text-[var(--soft)]',
                )}
              >
                {itemStep === 0 ? T.services : itemStep === 1 ? T.profileLocation : itemStep === 2 ? T.dateTime : T.summary}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="hidden h-11 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-bold text-[var(--muted)] transition hover:text-[var(--text)] sm:flex sm:items-center sm:gap-2">
              <Icon name="globe" size={17} /> {lang.toUpperCase()}
            </button>
            <button onClick={() => setMenuOpen(true)} aria-label="Abrir menu" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--muted)] transition hover:text-[var(--text)]">
              <Icon name="menu" size={21} />
            </button>
          </div>
        </div>

        <nav className="scrollbar-hide mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Etapas do agendamento">
          {[0, 1, 2, 3].map((itemStep) => (
            <button
              key={itemStep}
              onClick={() => itemStep < step && setStep(itemStep)}
              className={cx(
                'min-w-max rounded-full px-3 py-2 text-[11px] font-bold transition',
                step === itemStep ? 'bg-blue-600 text-white' : itemStep < step ? 'bg-[var(--surface-2)] text-[var(--text)]' : 'border border-[var(--border)] text-[var(--soft)]',
              )}
            >
              {itemStep === 0 ? `1. ${T.services}` : itemStep === 1 ? `2. ${T.profileLocation}` : itemStep === 2 ? `3. ${T.dateTime}` : `4. ${T.summary}`}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-28 pt-5 md:px-6 md:pb-32 md:pt-10">
        {step === 0 && (
          <section className="animate-fade-up">
            <div className="mb-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr] lg:items-end">
              <div>
                <p className="mb-3 inline-flex rounded-full border border-blue-400/25 bg-blue-500/10 px-4 py-2 text-[12px] font-bold uppercase tracking-[.18em] text-blue-500">
                  V27 • UX/UI Premium
                </p>
                <h2 className="max-w-3xl text-[2.15rem] font-bold leading-[1.04] tracking-[-.035em] min-[380px]:text-4xl md:text-6xl">
                  <span className="text-gradient">{T.heroTitle}</span>
                </h2>
                <p className="readable-copy mt-5 text-[var(--muted)] md:text-lg">{T.heroSub}</p>
              </div>
              <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-xl md:rounded-[2rem] md:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{T.xp}</p>
                    <p className="mt-1 text-3xl font-bold">{user.xp} XP</p>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-zinc-950">
                    <Icon name="award" size={25} />
                  </div>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-[var(--surface-3)]">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-amber-500" style={{ width: `${Math.min(100, (user.xp % 350) / 3.5)}%` }} />
                </div>
                <p className="mt-3 text-sm font-bold text-[var(--muted)]">{lang === 'pt' ? 'Quanto mais você agenda, mais benefícios desbloqueia.' : 'The more you book, the more benefits you unlock.'}</p>
              </div>
            </div>

            <PhotoShowcase lang={lang} />

            <div className="mb-7 grid grid-cols-2 gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-2">
              <button
                onClick={() => setActiveTab('single')}
                className={cx('min-h-12 rounded-2xl px-4 py-3 text-sm font-bold transition', activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]')}
              >
                {T.single}
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={cx('min-h-12 rounded-2xl px-4 py-3 text-sm font-bold transition', activeTab === 'plans' ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-950/20' : 'text-[var(--muted)] hover:bg-[var(--surface-2)]')}
              >
                {T.plans}
              </button>
            </div>

            {activeTab === 'single' ? (
              <div>
                <SectionTitle title={T.chooseService} desc={T.chooseServiceSub} />
                <div className="space-y-10">
                  {(Object.keys(serviceGroups) as ServiceCategory[]).map((category) => (
                    <section key={category}>
                      <div className="mb-4">
                        <h3 className="text-xl font-bold">{categoryCopy[category].title}</h3>
                        <p className="readable-copy mt-1 text-sm text-[var(--muted)]">{categoryCopy[category].desc}</p>
                      </div>
                      <div className="scrollbar-hide -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-2 md:px-0 xl:grid-cols-3">
                        {serviceGroups[category].map((item) => (
                          <ServiceCard key={item.id} item={item} selected={selectedIds.has(item.id)} onToggle={toggleCartItem} lang={lang} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <SectionTitle title={T.plans} desc={lang === 'pt' ? 'Pacotes para quem quer cuidado recorrente e economia sem perder a experiência premium.' : 'Packages for recurring care and better value without losing premium experience.'} />
                <div className="scrollbar-hide -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3 md:mx-0 md:grid md:grid-cols-3 md:px-0">
                  {DATA.plans.map((plan) => (
                    <ServiceCard key={plan.id} item={plan} selected={selectedIds.has(plan.id)} onToggle={toggleCartItem} lang={lang} isPlan />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="animate-fade-up">
            <SectionTitle kicker="02" title={T.profileLocation} desc={lang === 'pt' ? 'Poucos campos, todos importantes. Isso evita erro de deslocamento e deixa a confirmação mais rápida.' : 'Few fields, all important. This avoids location mistakes and makes confirmation faster.'} />

            <div className="grid gap-6 lg:grid-cols-[1fr_.85fr]">
              <div className="space-y-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                <InputField label={T.name} icon="user" value={user.name} onChange={(value) => setUser((prev) => ({ ...prev, name: sanitizeInput(value) }))} placeholder="Ex.: Thalyson" error={user.name.length > 0 && user.name.trim().length < 3} />

                <div>
                  <p className="mb-3 text-[12px] font-bold uppercase tracking-[.16em] text-[var(--muted)]">{lang === 'pt' ? 'Onde será o atendimento?' : 'Where will it happen?'}</p>
                  <div className="scrollbar-hide -mx-1 flex snap-x gap-3 overflow-x-auto pb-2 md:mx-0 md:grid md:grid-cols-3">
                    {([
                      ['home', T.home, 'home'],
                      ['studio', T.studio, 'building'],
                      ['hotel', T.hotel, 'hotel'],
                    ] as const).map(([value, label, icon]) => (
                      <button
                        key={value}
                        onClick={() => setBooking((prev) => ({ ...prev, locationType: value }))}
                        className={cx(
                          'mobile-control-card min-h-24 rounded-2xl border p-4 text-left transition md:min-w-0',
                          booking.locationType === value ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,.12)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                        )}
                      >
                        <Icon name={icon} size={22} className="mb-3 text-blue-500" />
                        <span className="block font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {booking.locationType === 'home' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label={T.cep} icon="mapPin" value={booking.address.cep} onChange={fetchCep} placeholder="00000-000" maxLength={9} inputMode="numeric" />
                    <InputField label={T.city} value={booking.address.city} onChange={(value) => updateAddress({ city: sanitizeInput(value) })} disabled={cepLoading} />
                    <InputField label={T.street} value={booking.address.street} onChange={(value) => updateAddress({ street: sanitizeInput(value) })} />
                    <InputField label={T.number} value={booking.address.number} onChange={(value) => updateAddress({ number: sanitizeInput(value) })} inputMode="numeric" />
                    <InputField label={T.district} value={booking.address.district} onChange={(value) => updateAddress({ district: sanitizeInput(value) })} />
                    <InputField label={T.comp} value={booking.address.comp} onChange={(value) => updateAddress({ comp: sanitizeInput(value) })} />
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField label={T.hotelName} icon="hotel" value={booking.address.placeName} onChange={(value) => updateAddress({ placeName: sanitizeInput(value) })} placeholder="Ex.: Hotel Central" />
                    <InputField label={T.city} value={booking.address.city} onChange={(value) => updateAddress({ city: sanitizeInput(value) })} />
                    <InputField label={T.comp} value={booking.address.comp} onChange={(value) => updateAddress({ comp: sanitizeInput(value) })} placeholder="Ex.: quarto 120" />
                  </div>
                )}

                {booking.locationType === 'studio' && (
                  <div className="rounded-2xl border border-blue-400/25 bg-blue-500/10 p-5">
                    <div className="mb-2 flex items-center gap-2 font-bold text-[var(--text)]"><Icon name="shield" size={18} /> {T.studio}</div>
                    <p className="readable-copy text-[var(--muted)]">{T.studioHint}</p>
                  </div>
                )}
              </div>

              <aside className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6 lg:sticky lg:top-28 lg:self-start">
                <h3 className="mb-4 text-xl font-bold">{T.safety}</h3>
                <div className="space-y-4">
                  {DATA.rules.map((rule) => (
                    <div key={rule.title} className="flex gap-3 rounded-2xl bg-[var(--surface-2)] p-4">
                      <Icon name={rule.icon} size={20} className="mt-1 shrink-0 text-blue-500" />
                      <div>
                        <p className="font-bold">{rule.title}</p>
                        <p className="readable-copy mt-1 text-sm text-[var(--muted)]">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {booking.locationType !== 'studio' && <p className="readable-copy mt-5 rounded-2xl bg-amber-500/10 p-4 text-sm text-[var(--muted)]">{T.travelHint}</p>}
              </aside>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-up">
            <SectionTitle kicker="03" title={T.dateTime} desc={lang === 'pt' ? 'A agenda evita horários passados, destaca horários de pico e sugere o momento mais confortável.' : 'The schedule avoids past times, highlights rush hours and suggests the most comfortable moment.'} />

            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl font-bold">{T.chooseDate}</h3>
                <div className="flex gap-2">
                  <button onClick={() => dateRowRef.current?.scrollBy({ left: -260, behavior: 'smooth' })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)]"><Icon name="chevronLeft" size={18} /></button>
                  <button onClick={() => dateRowRef.current?.scrollBy({ left: 260, behavior: 'smooth' })} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface-2)]"><Icon name="chevronRight" size={18} /></button>
                </div>
              </div>
              <div ref={dateRowRef} className="scrollbar-hide mb-8 flex gap-3 overflow-x-auto pb-2">
                {days.map((day) => {
                  const iso = toISODate(day);
                  const active = booking.date === iso;
                  return (
                    <button
                      key={iso}
                      onClick={() => setBooking((prev) => ({ ...prev, date: iso, time: null }))}
                      className={cx(
                        'min-w-[104px] rounded-2xl border p-4 text-center transition',
                        active ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] hover:border-[var(--strong-border)]',
                      )}
                    >
                      <span className="block text-[12px] font-bold uppercase tracking-[.14em] opacity-75">{dayLabel(day)}</span>
                      <span className="mt-1 block text-3xl font-bold">{day.getDate()}</span>
                      <span className="block text-xs font-bold opacity-70">{day.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>

              {smartSlot && (
                <button
                  onClick={() => setBooking((prev) => ({ ...prev, time: smartSlot }))}
                  className="mb-6 flex w-full items-center justify-between gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-left transition hover:border-emerald-400/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white"><Icon name="sparkles" size={20} /></div>
                    <div>
                      <p className="font-bold text-[var(--text)]">{T.smartSuggestion}: {smartSlot}</p>
                      <p className="text-sm font-normal text-[var(--muted)]">{T.lowDemand}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase text-white">{T.recommended}</span>
                </button>
              )}

              <h3 className="mb-4 text-xl font-bold">{T.chooseTime}</h3>
              {slots.length === 0 ? (
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 text-center font-bold text-[var(--muted)]">{T.noSlots}</div>
              ) : (
                <div className="space-y-6">
                  {([
                    ['morning', lang === 'pt' ? 'Manhã' : 'Morning'],
                    ['afternoon', lang === 'pt' ? 'Tarde' : 'Afternoon'],
                    ['evening', lang === 'pt' ? 'Noite' : 'Evening'],
                  ] as const).map(([period, label]) => groupedSlots[period].length > 0 && (
                    <div key={period}>
                      <p className="mb-3 text-[12px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{label}</p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {groupedSlots[period].map((slot) => {
                          const active = booking.time === slot;
                          const rush = RUSH_HOURS.includes(slot);
                          return (
                            <button
                              key={slot}
                              onClick={() => setBooking((prev) => ({ ...prev, time: slot }))}
                              className={cx(
                                'min-h-16 rounded-2xl border p-3 text-center transition',
                                active ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-950/20' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                              )}
                            >
                              <span className="block text-lg font-bold">{slot}</span>
                              {rush && <span className={cx('mt-1 block text-[10px] font-bold uppercase tracking-[.08em]', active ? 'text-blue-100' : 'text-amber-500')}>{T.rush}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-up">
            <SectionTitle kicker="04" title={T.extrasPayment} desc={lang === 'pt' ? 'Agora você revisa, escolhe complementos opcionais e confirma as regras antes de enviar.' : 'Now review, choose optional add-ons and accept the agreement before sending.'} />

            <div className="grid gap-6 lg:grid-cols-[1fr_.9fr]">
              <div className="space-y-6">
                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                  <h3 className="mb-4 text-xl font-bold">{lang === 'pt' ? 'Complementos inteligentes' : 'Smart add-ons'}</h3>
                  <div className="scrollbar-hide -mx-1 flex snap-x gap-3 overflow-x-auto pb-2 md:mx-0 md:grid md:grid-cols-2">
                    {DATA.extras.map((extra) => {
                      const active = Boolean(booking.extras[extra.id]);
                      const recommended = extra.recommendedFor?.some((id) => selectedIds.has(id));
                      return (
                        <button
                          key={extra.id}
                          onClick={() => setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }))}
                          className={cx(
                            'mobile-wide-card relative rounded-2xl border p-4 text-left transition md:w-auto md:max-w-none',
                            active ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,.10)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                          )}
                        >
                          {recommended && <span className="absolute right-3 top-3 rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-bold uppercase text-white">{T.recommended}</span>}
                          <div className="mb-2 flex items-center gap-2 font-bold"><Icon name={extra.icon} size={18} className="text-blue-500" /> {extra.label}</div>
                          <p className="readable-copy text-sm text-[var(--muted)]">{extra.desc}</p>
                          <p className="mt-3 text-sm font-bold text-[var(--text)]">+ {formatMoney(isPack ? Math.floor(extra.price * 0.8) : extra.price, lang)}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                  <h3 className="mb-4 text-xl font-bold">{T.coupon}</h3>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                      placeholder={T.couponPlaceholder}
                      className="min-h-12 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] px-4 py-3 font-bold text-[var(--text)] placeholder:text-[var(--soft)]"
                    />
                    <Button onClick={applyCoupon} icon="tag">{T.apply}</Button>
                  </div>
                  {user.coupons.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {user.coupons.map((coupon) => (
                        <button
                          key={coupon.id}
                          onClick={() => setCouponInput(coupon.code)}
                          className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm font-bold text-[var(--muted)] transition hover:text-[var(--text)]"
                        >
                          {coupon.code} • -{formatMoney(coupon.val, lang)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                  <h3 className="mb-4 text-xl font-bold">{lang === 'pt' ? 'Pagamento no local' : 'Payment at appointment'}</h3>
                  <div className="scrollbar-hide -mx-1 flex snap-x gap-3 overflow-x-auto pb-2 md:mx-0 md:grid md:grid-cols-3">
                    {([
                      ['pix', T.pix, 'copy'],
                      ['card', T.card, 'tag'],
                      ['cash', T.cash, 'gift'],
                    ] as const).map(([value, label, icon]) => (
                      <button
                        key={value}
                        onClick={() => setBooking((prev) => ({ ...prev, payment: value }))}
                        className={cx(
                          'mobile-control-card min-h-20 rounded-2xl border p-4 text-left transition md:min-w-0',
                          booking.payment === value ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_0_4px_rgba(59,130,246,.10)]' : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--strong-border)]',
                        )}
                      >
                        <Icon name={icon} size={20} className="mb-2 text-blue-500" />
                        <span className="font-bold">{label}</span>
                      </button>
                    ))}
                  </div>
                  {booking.payment === 'pix' && (
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(CONFIG.PIX_KEY);
                        addToast(T.copied, 'success');
                      }}
                      className="mt-4 flex w-full items-center justify-between rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4 text-left"
                    >
                      <span className="font-bold">PIX: {CONFIG.PIX_KEY}</span>
                      <Icon name="copy" size={18} />
                    </button>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                  <input
                    type="checkbox"
                    checked={booking.mediaAllowed}
                    onChange={(event) => setBooking((prev) => ({ ...prev, mediaAllowed: event.target.checked }))}
                    className="mt-1 h-5 w-5 accent-blue-600"
                  />
                  <span>
                    <span className="block font-bold">{T.portfolio}</span>
                    <span className="readable-copy mt-1 block text-sm text-[var(--muted)]">{T.portfolioDesc}</span>
                  </span>
                </label>

                <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-xl font-bold">{T.terms}</h3>
                      <p className="readable-copy mt-1 text-sm text-[var(--muted)]">{lang === 'pt' ? 'Abra o pop-up central, leia e aceite.' : 'Open the centered pop-up, read and accept.'}</p>
                    </div>
                    <Button variant={booking.termsAccepted ? 'secondary' : 'primary'} icon={booking.termsAccepted ? 'check' : 'shield'} onClick={() => setTermsOpen(true)}>
                      {booking.termsAccepted ? T.accept : T.terms}
                    </Button>
                  </div>
                </div>
              </div>

              <aside className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-4 md:rounded-[2rem] md:p-6 lg:sticky lg:top-28 lg:self-start">
                <h3 className="mb-5 text-2xl font-bold">{T.summary}</h3>
                <SummaryContent booking={booking} financials={financials} extras={selectedExtras} lang={lang} T={T} />
              </aside>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto max-w-2xl py-16 text-center animate-fade-up">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-950/20">
              <Icon name="check" size={44} />
            </div>
            <h2 className="text-4xl font-bold leading-tight md:text-5xl">{T.successTitle}</h2>
            <p className="readable-copy mx-auto mt-4 text-[var(--muted)]">{T.successSub}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <Button variant="whatsapp" size="lg" full icon="message" onClick={openWhatsApp}>{T.openWhatsapp}</Button>
              <Button variant="secondary" size="lg" full icon="refresh" onClick={clearDraft}>{T.restart}</Button>
            </div>
          </section>
        )}
      </main>

      {step < 4 && (
        <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg)]/94 p-2 pb-[calc(.5rem+env(safe-area-inset-bottom))] backdrop-blur-2xl md:p-3">
          <div className="mx-auto flex max-w-6xl items-center gap-2">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              aria-label={T.back}
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] transition active:scale-[.98] disabled:opacity-35"
            >
              <Icon name="chevronLeft" size={22} />
            </button>

            <div className="min-w-0 flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-center shadow-xl">
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{T.total}</p>
              <p className="truncate text-2xl font-bold leading-tight text-blue-500">{formatMoney(financials.total, lang)}</p>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="flex h-14 shrink-0 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 font-bold text-white shadow-lg shadow-blue-950/25 transition active:scale-[.98] min-[380px]:px-5"
            >
              <span>{step === 3 ? T.finish : T.continue}</span>
              <Icon name={step === 3 ? 'message' : 'chevronRight'} size={20} />
            </button>
          </div>
        </footer>
      )}
    </>
  );
}

function SummaryContent({ booking, financials, extras, lang, T }: {
  booking: BookingData;
  financials: Financials;
  extras: ExtraItem[];
  lang: Lang;
  T: ReturnType<typeof getData>['text'];
}) {
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-[12px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">{T.services}</p>
        <div className="space-y-2">
          {booking.cart.map((item) => (
            <div key={item.id} className="rounded-2xl bg-[var(--surface-2)] p-3">
              <p className="font-bold">{item.title}</p>
              <p className="text-sm font-normal text-[var(--muted)]">{item.min} min • {formatMoney(item.price, lang)}</p>
            </div>
          ))}
        </div>
      </div>

      {extras.length > 0 && (
        <div>
          <p className="mb-2 text-[12px] font-bold uppercase tracking-[.16em] text-[var(--soft)]">Extras</p>
          <div className="space-y-2">
            {extras.map((extra) => (
              <div key={extra.id} className="flex items-center justify-between rounded-2xl bg-[var(--surface-2)] p-3">
                <span className="font-bold">{extra.label}</span>
                <span className="font-bold">+ {formatMoney(extra.price, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-4">
        <div className="space-y-3">
          <PriceLine label={T.subtotal} value={formatMoney(financials.subtotal, lang)} muted />
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
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--soft)]">{T.dateTime}</p>
          <p className="mt-1 font-bold">{booking.date || '-'} às {booking.time || '-'}</p>
        </div>
        <div className="rounded-2xl bg-[var(--surface-2)] p-3">
          <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--soft)]">{T.duration}</p>
          <p className="mt-1 font-bold">{financials.duration || 0} min</p>
        </div>
      </div>
    </div>
  );
}

interface Financials {
  subtotal: number;
  couponDiscount: number;
  mediaDiscount: number;
  pixDiscount: number;
  rushFee: number;
  total: number;
  duration: number;
}
