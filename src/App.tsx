import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/thalyson.massagens',
  PROFILE_PHOTO_URL: 'https://i.ibb.co/gZxp3Dwz/Screenshot-1.png',
  STORAGE_KEY: '@thaly_app_v28_responsive',
  PIX_KEY: '62.922.530/0001-14',
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5,
  SECRET_TOKEN: 'THALY_SECURE_V8',
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE: 5000,
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

type Lang = 'pt' | 'en';
type Category = 'relax' | 'express' | 'final' | 'care';
type LocationType = 'home' | 'motel' | 'hotel';

interface ServiceItem {
  id: string;
  min: number;
  price: number;
  icon: string;
  tag: string;
  title: string;
  desc: string;
  details: string;
  fullPrice?: number;
  savings?: number;
  type?: 'pack';
  popular?: boolean;
  category?: Category;
}

interface Coupon {
  id: string;
  val: number;
  title: string;
  code: string;
}

interface Review {
  n: string;
  loc: string;
  t: string;
  s: number;
  serv: string;
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
  payment: string;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  bookingId: string;
  mediaAllowed: boolean;
}

interface Rule {
  icon: string;
  title: string;
  description: string;
}

const ICON_PATHS: Record<string, string> = {
  menu: 'M4 12h16 M4 6h16 M4 18h16',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  'chevron-down': 'M6 9l6 6 6-6',
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  'alert-circle': 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01',
  share: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13',
  globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  sun: 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check': 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4',
  sparkles: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  package: 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  bed: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  building: 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  car: 'M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  smartphone: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  message: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  watch: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  banknote: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shower: 'M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16',
  hand: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  award: 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  trophy: 'M8 21h8M12 17v4m9-13.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 0 5 0v-3zM3 7.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0v-3zM9 4.5h6',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  camera: 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  scissors: 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  copy: 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1 M16 3H10a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
  'file-text': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  plus: 'M12 5v14 M5 12h14',
  'refresh-cw': 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  ticket: 'M15 5v2 M15 11v2 M15 17v2 M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z',
  sunrise: 'M17 18a5 5 0 0 0-10 0 M12 2v7 M4.22 10.22l1.42 1.42 M1 18h2 M21 18h2 M18.36 11.64l1.42-1.42 M23 22H1 M8 6l4-4 4 4',
  sunset: 'M17 18a5 5 0 0 0-10 0 M12 9v7 M4.22 15.22l1.42-1.42 M1 18h2 M21 18h2 M18.36 16.64l1.42 1.42 M23 22H1',
};

const sanitizeInput = (value: string): string => String(value || '').replace(/[<>&"']/g, '').slice(0, 120);
const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const validateAddress = (address: Address) => Boolean(address.street && address.number && address.district && address.city);

const vibrate = (pattern: number | number[] = 40) => {
  try {
    const nav = navigator as Navigator & { vibrate?: (value: number | number[]) => boolean };
    nav.vibrate?.(pattern);
  } catch {
    // Haptics are optional.
  }
};

const formatMoney = (value: number | undefined, lang: Lang) => {
  const amount = Number.isFinite(value) ? Number(value) : 0;
  const converted = lang === 'pt' ? amount : amount / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
  }).format(converted);
};

const createInitialBooking = (): BookingData => ({
  type: 'single',
  cart: [],
  extras: {},
  date: null,
  time: null,
  locationType: 'home',
  address: { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' },
  payment: '',
  appliedCoupon: null,
  termsAccepted: false,
  bookingId: `BOOK_${Date.now()}`,
  mediaAllowed: false,
});

const getFullReviews = (): Review[] => [
  {
    n: 'Gustavo',
    loc: 'Bela Vista - SP',
    t: 'Chegou no horario certo e a experiencia em casa foi muito tranquila. O alivio foi imediato.',
    serv: 'Experiencia Fusion',
    s: 5,
  },
  {
    n: 'Giovana',
    loc: 'Hotel Portal da Mata',
    t: 'Precisava muito desse descanso. Foi respeitoso o tempo todo e relaxei demais.',
    serv: 'Massagem Sensorial',
    s: 5,
  },
  {
    n: 'Bruno',
    loc: 'SP - Bela Vista',
    t: 'Massagem muito bem executada, com cuidado nos detalhes e total discricao.',
    serv: 'Massagem Classica',
    s: 5,
  },
  {
    n: 'Lucas',
    loc: 'Londrina',
    t: 'A discricao era minha prioridade e fui atendido com muito profissionalismo.',
    serv: 'Massagem Nuru',
    s: 5,
  },
  {
    n: 'Ricardo',
    loc: 'Fernandopolis',
    t: 'Me senti acolhido e sai mais leve fisica e emocionalmente.',
    serv: 'Massagem Reversa',
    s: 5,
  },
];

const getData = (lang: Lang) => {
  const isEn = lang === 'en';
  const p = {
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
    packBasic: { v: 247, full: 284, save: 37 },
    pack1: { v: 297, full: 334, save: 37 },
    packGlow: { v: 327, full: 391, save: 64 },
    packMuscle: { v: 347, full: 408, save: 61 },
    pack2: { v: 387, full: 467, save: 80 },
    pack3: { v: 637, full: 721, save: 84 },
    packUltimate: { v: 657, full: 778, save: 121 },
    extras: {
      moreTime: 77,
      touch: 77,
      aroma: 17,
      hairTrim: 57,
      painRelief: 17,
      dominador: 180,
      oral: 120,
      beijos: 77,
      prostatico: 120,
    },
  };

  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isEn ? 'Care Beginner' : 'Iniciante no Cuidado' },
      { level: 2, xpNeeded: 100, reward: 15, title: isEn ? 'Right Priority' : 'Prioridade Certa' },
      { level: 3, xpNeeded: 350, reward: 30, title: isEn ? 'Conscious Body' : 'Corpo Consciente' },
      { level: 4, xpNeeded: 800, reward: 50, title: isEn ? 'Plenitude Reached' : 'Plenitude Alcancada' },
    ],
    services: [
      {
        id: 'pes',
        category: 'express',
        min: 40,
        price: p.pes,
        icon: 'user-check',
        tag: isEn ? 'FOOT RELIEF' : 'ALIVIO NOS PES',
        title: isEn ? 'Foot Massage' : 'Massagem nos Pes',
        desc: isEn ? 'Focused relief for tired feet after a long day.' : 'Alivio direto para pes cansados depois de um dia longo.',
        details: isEn ? 'Foot reflexology\nDeep pressure points\nLight finish' : 'Reflexologia focada na sola dos pes\nPressao profunda em pontos de tensao\nFinalizacao leve para voce pisar melhor',
      },
      {
        id: 'maos',
        category: 'express',
        min: 40,
        price: p.maos,
        icon: 'hand',
        tag: isEn ? 'HAND RELIEF' : 'ALIVIO NAS MAOS',
        title: isEn ? 'Hand Massage' : 'Massagem nas Maos',
        desc: isEn ? 'Release tension from typing and manual work.' : 'Libere a tensao acumulada de digitar ou trabalhar com as maos.',
        details: isEn ? 'Finger and wrist mobility\nDeep palm massage\nForearm relief' : 'Alongamento das articulacoes\nMassagem profunda na palma\nAlivio de punhos e antebraco',
      },
      {
        id: 'relaxante',
        category: 'relax',
        min: 40,
        price: p.relax,
        icon: 'user-check',
        tag: isEn ? 'MUSCLE RELIEF' : 'ALIVIO MUSCULAR',
        title: isEn ? 'Classic Massage' : 'Massagem Classica',
        desc: isEn ? 'For stiff backs, heavy shoulders and better sleep.' : 'Ideal para costas travadas, ombros pesados e sono melhor.',
        details: isEn ? 'Wooden rollers when needed\nManual deep relief\nTherapeutic and relaxing focus' : 'Uso de rolos de madeira quando necessario\nMassagem manual para soltar tensoes\nFoco terapeutico, relaxante e respeitoso',
      },
      {
        id: 'naturista',
        category: 'relax',
        min: 40,
        price: p.naturista,
        icon: 'sun',
        tag: isEn ? 'ZERO TIES' : 'ZERO ROUPAS',
        title: isEn ? 'Naturist Classic' : 'Classica Naturista',
        desc: isEn ? 'A lighter, freer version of the classic session.' : 'Uma versao mais livre e leve da massagem classica.',
        details: isEn ? 'Full body classic massage\nDeep physical relief\nTherapeutic and relaxing focus' : 'Massagem classica de corpo inteiro\nPressao exata para aliviar rigidez\nFoco terapeutico e relaxante',
      },
      {
        id: 'crossfit',
        category: 'relax',
        min: 60,
        price: p.crossfit,
        icon: 'zap',
        tag: isEn ? 'DEEP RECOVERY' : 'RECUPERACAO',
        title: isEn ? 'Sports Massage' : 'Massagem para Atletas',
        desc: isEn ? 'Firm sports massage for people who train hard.' : 'Pegada forte para quem treina pesado e sente dores pos-treino.',
        details: isEn ? 'Vigorous friction\nMyofascial release\nMobility stretches' : 'Friccao forte para aquecer a musculatura\nLiberacao miofascial em pontos travados\nAlongamentos para devolver mobilidade',
      },
      {
        id: 'sensitiva',
        category: 'final',
        min: 60,
        price: p.sens,
        icon: 'sparkles',
        tag: isEn ? 'SENSORY' : 'SENSORIAL',
        title: isEn ? 'Sensory Massage' : 'Massagem Sensorial',
        desc: isEn ? 'Soft, immersive touch to reduce anxiety and body tension.' : 'Toques suaves e imersivos para reduzir ansiedade e tensao corporal.',
        details: isEn ? 'Classic warm-up\nSubtle sensory stimuli\nCalm and private rhythm' : 'Inicio com massagem classica para aquecer\nEstimulos suaves pelo corpo\nRitmo calmo, privado e respeitoso',
      },
      {
        id: 'mista',
        category: 'final',
        min: 60,
        price: p.titan,
        icon: 'zap',
        tag: isEn ? 'FULL EXPERIENCE' : 'EXPERIENCIA COMPLETA',
        title: isEn ? 'Fusion Experience' : 'Experiencia Fusion',
        desc: isEn ? 'A complete session that blends muscle relief and sensory care.' : 'Sessao completa que une alivio muscular e cuidado sensorial.',
        details: isEn ? 'Classic massage first\nRhythm changes gradually\nComplete relaxing experience' : 'Comeca com massagem classica\nO ritmo muda aos poucos\nExperiencia completa para aliviar corpo e mente',
      },
      {
        id: 'reversa',
        category: 'final',
        min: 60,
        price: p.reversa,
        icon: 'refresh-cw',
        tag: isEn ? 'REAL CONTACT' : 'CONTATO REAL',
        title: isEn ? 'Reverse Massage' : 'Massagem Reversa',
        desc: isEn ? 'A more interactive experience with human warmth and attention.' : 'Uma experiencia mais interativa, com acolhimento e atencao exclusiva.',
        details: isEn ? 'Relaxing full massage\nInteractive second half\nPrivate and respectful flow' : 'Massagem relaxante completa\nSegunda etapa mais interativa\nFluxo privado, discreto e respeitoso',
      },
      {
        id: 'nuru',
        category: 'final',
        min: 60,
        price: p.nuru,
        icon: 'star',
        popular: true,
        tag: isEn ? 'TOTAL SURRENDER' : 'ENTREGA TOTAL',
        title: isEn ? 'Nuru Massage' : 'Massagem Nuru',
        desc: isEn ? 'Gel-based session with a more immersive body experience.' : 'Sessao com gel e experiencia corporal mais imersiva.',
        details: isEn ? 'Short warm-up massage\nGel application\nDeep relaxation and sensory focus' : 'Massagem inicial para aquecer\nAplicacao de gel\nFoco em relaxamento profundo e sensorial',
      },
      {
        id: 'depilacao',
        category: 'care',
        min: 60,
        price: p.depil,
        icon: 'scissors',
        tag: isEn ? 'PRACTICALITY' : 'ESTETICA',
        title: isEn ? 'Full Body Trim' : 'Aparo de Pelos do Corpo',
        desc: isEn ? 'A clean and practical aesthetic care session.' : 'Cuidado estetico pratico para deixar o corpo mais limpo e leve.',
        details: isEn ? 'Careful clipper trim\nChosen body areas\nPrivate home or hotel session' : 'Aparo cuidadoso com maquina\nFoco nas areas que voce escolher\nFeito com privacidade em casa ou hotel',
      },
    ] as ServiceItem[],
    plans: [
      {
        id: 'pack_basic',
        type: 'pack',
        min: 60,
        title: isEn ? 'Routine Relief (2x)' : 'Alivio de Rotina (2x)',
        price: p.packBasic.v,
        fullPrice: p.packBasic.full,
        savings: p.packBasic.save,
        desc: isEn ? 'For tired feet and a relaxing bonus.' : 'Para quem trabalha de pe ou digitando. Inclui bonus relaxante.',
        details: isEn ? '1x Foot Massage\n1x Classic Massage\nBonus aromatherapy' : '1x Massagem nos Pes\n1x Massagem Classica\nBonus de aromaterapia',
        tag: 'RELAX',
        icon: 'watch',
      },
      {
        id: 'pack_essencial',
        type: 'pack',
        min: 60,
        title: isEn ? 'Survival Kit (2x)' : 'Kit Sobrevivencia (2x)',
        price: p.pack1.v,
        fullPrice: p.pack1.full,
        savings: p.pack1.save,
        desc: isEn ? 'Two sessions for body pain and mental relief.' : 'Duas sessoes no mes: um dia para tirar dores, outro para aliviar a mente.',
        details: isEn ? '1x Classic\n1x Sensory\nSeparate appointments' : '1x Massagem Classica\n1x Massagem Sensorial\nSessoes agendadas separadamente',
        tag: isEn ? 'SLEEP WELL' : 'DURMA BEM',
        icon: 'layers',
      },
      {
        id: 'pack_glow',
        type: 'pack',
        min: 60,
        title: isEn ? 'Full Renewal (2x)' : 'Renovacao Completa (2x)',
        price: p.packGlow.v,
        fullPrice: p.packGlow.full,
        savings: p.packGlow.save,
        desc: isEn ? 'Aesthetic care plus a complete relaxing session.' : 'Cuidado estetico e uma sessao completa para elevar a autoestima.',
        details: isEn ? '1x Body Trim\n1x Fusion\nBonus extra time' : '1x Aparo de Pelos\n1x Experiencia Fusion\nBonus de tempo extra',
        tag: 'GLOW UP',
        icon: 'sparkles',
      },
      {
        id: 'pack_muscle',
        type: 'pack',
        min: 60,
        title: isEn ? 'Recovery Combo (2x)' : 'Combo Recuperacao (2x)',
        price: p.packMuscle.v,
        fullPrice: p.packMuscle.full,
        savings: p.packMuscle.save,
        desc: isEn ? 'For intense training and muscle pain.' : 'Focado em quem treina pesado e sofre com dores musculares.',
        details: isEn ? '2x Sports Massage\nBonus pain focus' : '2x Massagem para Atletas\nBonus de foco extra em dores',
        tag: isEn ? 'MUSCLE' : 'MUSCULOS',
        icon: 'zap',
      },
      {
        id: 'pack_interativo',
        type: 'pack',
        min: 60,
        title: isEn ? 'Real Connection (2x)' : 'Combo Conexao (2x)',
        price: p.pack2.v,
        fullPrice: p.pack2.full,
        savings: p.pack2.save,
        desc: isEn ? 'Two private sessions with a warmer experience.' : 'Dois encontros separados no mes com mais acolhimento e contato humano.',
        details: isEn ? '1x Fusion\n1x Reverse\nSeparate appointments' : '1x Experiencia Fusion\n1x Massagem Reversa\nSessoes em dias diferentes',
        tag: isEn ? 'WARMTH' : 'CALOR HUMANO',
        icon: 'heart',
      },
      {
        id: 'pack_premium',
        type: 'pack',
        min: 60,
        title: isEn ? 'Boss Plan (3x)' : 'Mensalidade do Chefe (3x)',
        price: p.pack3.v,
        fullPrice: p.pack3.full,
        savings: p.pack3.save,
        desc: isEn ? 'Three premium weeks with the most requested sessions.' : 'Tres semanas com as experiencias mais intensas e procuradas.',
        details: isEn ? '1x Naturist\n1x Fusion\n1x Nuru' : '1x Naturista\n1x Fusion\n1x Nuru',
        tag: isEn ? 'VIP MONTH' : 'TRATAMENTO VIP',
        icon: 'award',
      },
      {
        id: 'pack_ultimate',
        type: 'pack',
        min: 60,
        title: isEn ? 'Pleasure Journey (3x)' : 'Jornada do Prazer (3x)',
        price: p.packUltimate.v,
        fullPrice: p.packUltimate.full,
        savings: p.packUltimate.save,
        desc: isEn ? 'Total immersion with three progressive sessions.' : 'Imersao total com tres sessoes progressivas.',
        details: isEn ? '1x Sensory\n1x Fusion\n1x Nuru\nBonus organic interaction' : '1x Sensorial\n1x Fusion\n1x Nuru\nBonus de interacao organica',
        tag: 'PREMIUM',
        icon: 'heart',
      },
    ] as ServiceItem[],
    extras: [
      { id: 'hair_trim', price: p.extras.hairTrim, icon: 'scissors', label: isEn ? 'Trim (Extra)' : 'Aparo de Pelos', desc: isEn ? 'Maintenance in up to 2 body areas.' : 'Aparo com maquina em ate 2 areas do corpo.' },
      { id: 'more_time', price: p.extras.moreTime, icon: 'clock', label: isEn ? 'Extended Time (+30m)' : 'Mais 30 Minutos', desc: isEn ? 'More time to enjoy the session calmly.' : 'Mais tempo para curtir a sessao sem pressa.' },
      { id: 'touch', price: p.extras.touch, icon: 'hand', label: isEn ? 'Organic Interaction' : 'Liberdade para Tocar', desc: isEn ? 'A more participative and natural experience.' : 'Uma experiencia mais participativa e natural.' },
      { id: 'aroma', price: p.extras.aroma, icon: 'sparkles', label: isEn ? 'Deep Aromatherapy' : 'Aromaterapia', desc: isEn ? 'Relaxing oils for body and room.' : 'Oleos essenciais relaxantes no ambiente e no corpo.' },
      { id: 'pain_relief', price: p.extras.painRelief, icon: 'shield', label: isEn ? 'Extra Pain Focus' : 'Alivio de Dores Fortes', desc: isEn ? 'Thermal ointments and attention to locked areas.' : 'Pomadas termicas e atencao extra nas areas travadas.' },
      { id: 'dominador', price: p.extras.dominador, icon: 'zap', label: isEn ? 'Active Posture' : 'Postura Dominadora', desc: isEn ? 'A more active and confident final rhythm.' : 'Ritmo final mais ativo, confiante e conduzido.' },
      { id: 'oral', price: p.extras.oral, icon: 'heart', label: isEn ? 'Oral Included' : 'Estimulo Oral', desc: isEn ? 'Additional intimacy in the experience.' : 'Intimidade adicional para complementar a experiencia.' },
      { id: 'beijos', price: p.extras.beijos, icon: 'heart', label: isEn ? 'Kisses Included' : 'Beijos e Intimidade', desc: isEn ? 'Kisses and affection allowed during the mood.' : 'Beijos e carinho liberados durante o clima da sessao.' },
      { id: 'prostatico', price: p.extras.prostatico, icon: 'star', label: isEn ? 'Prostatic Massage' : 'Massagem Prostatica', desc: isEn ? 'Focused internal stimulation with care.' : 'Estimulo interno focado, com cuidado e lubrificante.' },
    ],
    rules: [
      { icon: 'shower', title: isEn ? 'Preparation Shower' : 'Ducha Preparatória', description: isEn ? 'A prior shower keeps the experience comfortable and clean.' : 'O banho previo garante conforto, higiene e um contato mais leve.' },
      { icon: 'hand', title: isEn ? 'Mutual Respect' : 'Respeito Mutuo', description: isEn ? 'The session only works with clarity, respect and consent.' : 'A sessao so funciona com clareza, respeito e consentimento.' },
      { icon: 'heart', title: isEn ? 'Presence' : 'Entrega ao Momento', description: isEn ? 'Turn off distractions and allow the body to relax.' : 'Desligue as distracoes e permita que o corpo relaxe.' },
      { icon: 'shield', title: isEn ? 'Health' : 'Saude e Prevencao', description: isEn ? 'Confirm that you are healthy and without contagious conditions.' : 'Confirme que esta saudavel, sem lesoes abertas ou condicoes contagiosas.' },
    ] as Rule[],
    text: {
      welcome: isEn ? 'Welcome,' : 'Bem-vindo,',
      welcomeAnon: isEn ? 'allow yourself.' : 'permita-se relaxar.',
      chooseSub: isEn ? 'Choose how you want to be cared for today. The photo helps you recognize who will arrive.' : 'Escolha abaixo como voce quer relaxar hoje. A foto ajuda voce a reconhecer quem vai chegar.',
      levelLabel: isEn ? 'Your Care Journey' : 'Sua Jornada de Cuidado',
      tabPacks: isEn ? 'Monthly Plans' : 'Planos Mensais',
      tabSingle: isEn ? 'Single Sessions' : 'Sessoes Avulsas',
      nextBtn: isEn ? 'Continue' : 'Continuar',
      finishBtn: isEn ? 'Complete Booking' : 'Finalizar Agendamento',
      loading: isEn ? 'Preparing your space...' : 'Preparando o seu ambiente...',
      toastSelectItem: isEn ? 'Add at least one service to continue.' : 'Escolha pelo menos um servico para continuar.',
      toastSelectDate: isEn ? 'Choose a date and time.' : 'Selecione uma data e horario validos.',
      toastFillName: isEn ? 'Fill in your name.' : 'Preencha seu nome corretamente.',
      toastFillAddr: isEn ? 'Fill in the full location.' : 'Preencha o local completo.',
      toastAcceptTerms: isEn ? 'Read and accept the rules.' : 'Leia e aceite as regras para confirmar.',
      toastCouponSuccess: isEn ? 'Gift applied.' : 'Beneficio ativado com sucesso.',
      toastCepFound: isEn ? 'Address loaded.' : 'Endereco encontrado pelo CEP.',
      toastCepError: isEn ? 'ZIP code not found.' : 'CEP nao encontrado.',
      toastPixCopied: isEn ? 'PIX key copied.' : 'Chave PIX copiada.',
      toastCart: isEn ? 'Cart updated.' : 'Servico alterado.',
      detailsLabel: isEn ? 'What happens in the session' : 'O que acontece na sessao',
      selectTimeTitle: isEn ? 'Choose the perfect moment' : 'Escolha a data do encontro',
      locationTitle: isEn ? 'Where will the session be?' : 'Onde vamos nos ver?',
      extrasTitle: isEn ? 'Add something special' : 'Adicione complementos opcionais',
      paymentTitle: isEn ? 'Payment at the meeting' : 'Forma de pagamento no local',
      termsTitle: isEn ? 'Session Agreement' : 'Regras e Acordos',
      successTitle: isEn ? 'Almost there!' : 'Tudo certo! Falta pouco',
      successSub: isEn ? 'WhatsApp will open with your booking message.' : 'O WhatsApp sera aberto com a mensagem do seu pedido.',
      whatsappBtn: isEn ? 'Open WhatsApp' : 'Enviar no WhatsApp',
      backHome: isEn ? 'Start over' : 'Voltar para o inicio',
      inputName: isEn ? 'Your name or nickname' : 'Seu nome ou apelido',
      inputCep: isEn ? 'ZIP Code (CEP)' : 'Digite o CEP do local',
      inputAddr: isEn ? 'Street or Avenue' : 'Rua ou Avenida completa',
      inputNum: isEn ? 'Number' : 'Numero',
      inputDistrict: isEn ? 'Neighborhood' : 'Bairro',
      inputCity: isEn ? 'City' : 'Cidade',
      inputComp: isEn ? 'Apt, block, etc. (optional)' : 'Complemento opcional',
      inputHotel: isEn ? 'Hotel name' : 'Nome do hotel',
      inputRoom: isEn ? 'Room / Suite number' : 'Quarto / Suite',
      agreeTerms: isEn ? 'I read and agree' : 'Li e aceito as regras',
      faqTitle: isEn ? 'Frequently Asked Questions' : 'Tire suas duvidas',
      reviewsTitle: isEn ? 'Those who allowed themselves' : 'O que os clientes dizem',
      emptyDate: isEn ? 'Tap a day to see times.' : 'Toque em um dia para ver horarios.',
      emptySlots: isEn ? 'No times left today.' : 'Nao ha horarios restantes nesse dia.',
      totalLabel: isEn ? 'Total' : 'Total a pagar',
      subtotal: isEn ? 'Subtotal' : 'Valor inicial',
      discount: isEn ? 'Discount' : 'Desconto',
      pixDiscount: isEn ? 'Pix discount' : 'Desconto Pix',
      mediaDiscount: isEn ? 'Portfolio discount' : 'Desconto Portfolio',
      mediaTitle: isEn ? 'Support my work (optional)' : 'Quer apoiar meu trabalho? (opcional)',
      mediaDesc: isEn ? 'Allow anonymous aesthetic photos, never face or intimacy, and get 1% off.' : 'Permita fotos esteticas anonimas, nunca rosto ou intimidade, e ganhe 1% OFF.',
      mediaBonus: isEn ? 'Allow for 1% off' : 'Permitir e ganhar 1% OFF',
      uberNotice: isEn ? 'Travel fee is confirmed on WhatsApp.' : 'A taxa de deslocamento sera confirmada pelo WhatsApp.',
      motelNote: isEn ? 'My private suite address will be sent on WhatsApp.' : 'O endereco da minha suite privada sera enviado pelo WhatsApp.',
      menuTitle: isEn ? 'Menu' : 'Configuracoes',
      themeTitle: isEn ? 'Appearance' : 'Tema do app',
      themeDark: isEn ? 'Dark' : 'Escuro',
      themeLight: isEn ? 'Light' : 'Claro',
      referBtn: isEn ? 'Refer Someone' : 'Indicar para um amigo',
      shareText: isEn ? 'I found a massage booking app.' : 'Encontrei um aplicativo de agendamento de massagens.',
      headerTensions: isEn ? 'care moments' : 'homens ja atendidos',
      stepWhen: isEn ? 'When' : 'Quando',
      stepWhere: isEn ? 'Where' : 'Onde',
      stepSummary: isEn ? 'Summary' : 'Resumo',
      cartTitle: isEn ? 'Cart' : 'Voce escolheu',
      cartEdit: isEn ? 'Edit' : 'Trocar',
      locHome: isEn ? 'Residence' : 'Residencia',
      locMotel: isEn ? 'My Suite' : 'Minha Suite',
      locHotel: isEn ? 'Hotel' : 'Hotel',
      summaryTitle: isEn ? 'Order Summary' : 'Resumo do pedido',
      summaryItems: isEn ? 'Services' : 'O que vamos fazer',
      summaryExtras: isEn ? 'Extras' : 'Adicionais',
      summaryInfo: isEn ? 'Session details' : 'Dados do encontro',
      summaryLocHome: isEn ? 'At your residence' : 'Na sua residencia',
      summaryLocMotel: isEn ? 'At my private suite' : 'Na minha suite privada',
      summaryLocHotel: isEn ? 'At a hotel' : 'No hotel',
      xpGuaranteed: isEn ? 'XP today' : 'XP ganhos hoje',
      mediaGranted: isEn ? 'Authorization granted' : 'Fotos autorizadas',
      mediaSupport: isEn ? 'Authorize photos' : 'Autorizar fotos',
      payPix: isEn ? 'Pix (3% off)' : 'Pix (3% OFF)',
      payCard: isEn ? 'Card' : 'Cartao',
      payCash: isEn ? 'Cash' : 'Dinheiro',
      rulesRead: isEn ? 'Tap to read' : 'Toque para ler',
      today: isEn ? 'TODAY' : 'HOJE',
      tomorrow: isEn ? 'TOMORROW' : 'AMANHA',
      popularBadge: isEn ? 'Most desired' : 'Mais pedida',
      from: isEn ? 'From' : 'De',
      savings: isEn ? 'You save' : 'Voce economiza',
      selectedItems: isEn ? 'selected' : 'selecionado(s)',
      finishShort: isEn ? 'Finish' : 'Finalizar',
      nextShort: isEn ? 'Next' : 'Proximo',
      levelKeep1: isEn ? 'Only' : 'Faltam apenas',
      levelKeep2: isEn ? 'XP to unlock' : 'XP para desbloquear',
      rushFee: isEn ? 'Rush fee' : 'Taxa de pico',
      morning: isEn ? 'Morning' : 'Manha',
      afternoon: isEn ? 'Afternoon' : 'Tarde',
      evening: isEn ? 'Evening' : 'Noite',
      chooseService: isEn ? 'Choose service' : 'Selecionar servico',
      removeService: isEn ? 'Remove selection' : 'Remover selecao',
      profileBadge: isEn ? 'Professional massage therapist' : 'Massoterapeuta profissional',
      profileNote: isEn ? 'Photo for recognition and safer arrival.' : 'Foto para reconhecimento e chegada mais segura.',
      couponSection: isEn ? 'Available Benefits' : 'Beneficios disponiveis',
      couponEmpty: isEn ? 'No benefits available now.' : 'Nenhum beneficio disponivel agora.',
    },
    faq: [
      { q: isEn ? 'Where does the session happen?' : 'Onde a sessao acontece?', a: isEn ? 'I can go to your home, hotel, or confirm my private suite through WhatsApp.' : 'Posso ir ate sua casa, hotel ou confirmar minha suite privada pelo WhatsApp.' },
      { q: isEn ? 'How should I prepare?' : 'Como devo me preparar?', a: isEn ? 'Take a warm shower close to the appointment and keep a comfortable space ready.' : 'Tome um banho morno perto do horario e deixe um espaco confortavel preparado.' },
      { q: isEn ? 'Is the booking private?' : 'O agendamento e discreto?', a: isEn ? 'Yes. The confirmation goes directly to WhatsApp and the app keeps only local browser progress.' : 'Sim. A confirmacao vai direto para o WhatsApp e o app salva apenas o progresso local do navegador.' },
      { q: isEn ? 'How are points saved?' : 'Como os pontos sao salvos?', a: isEn ? 'They are saved in this browser. Clearing cache can reset them.' : 'Os pontos ficam salvos neste navegador. Limpar o cache pode zerar o progresso.' },
    ],
    reviews: getFullReviews(),
  };
};

const CATEGORY_CONFIG: Record<Category, { color: string; label: string; icon: string }> = {
  relax: { color: '#3b82f6', label: 'Relax', icon: 'sun' },
  express: { color: '#10b981', label: 'Express', icon: 'watch' },
  final: { color: '#f59e0b', label: 'Finalizacao', icon: 'sparkles' },
  care: { color: '#ec4899', label: 'Cuidados', icon: 'scissors' },
};

const Icon = memo(
  ({ name, size = 20, className = '', style }: { name: string; size?: number; className?: string; style?: CSSProperties }) => (
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
      className={`shrink-0 ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d={ICON_PATHS[name] || ''} />
    </svg>
  ),
);

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after {
          box-sizing: border-box;
          min-width: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        :root {
          --font-sans: 'Poppins', sans-serif;
          --c-bg: ${isDark ? '#11141a' : '#f9f8f6'};
          --c-surface: ${isDark ? '#181c25' : '#ffffff'};
          --c-border: ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.12)'};
          --c-text: ${isDark ? '#e8e5df' : '#172033'};
          --c-muted: ${isDark ? '#a1a09d' : '#64748b'};
          --c-blue: #3b82f6;
          --c-amber: #f59e0b;
        }

        html, body {
          width: 100%;
          overflow-x: hidden;
          background-color: var(--c-bg);
          color: var(--c-text);
          font-family: var(--font-sans);
          -webkit-tap-highlight-color: transparent;
          overscroll-behavior-y: none;
          line-height: 1.55;
        }

        body {
          min-width: 320px;
        }

        img, video, canvas, svg {
          max-width: 100%;
        }

        button, input, textarea, select {
          font: inherit;
        }

        button {
          position: relative;
          overflow: hidden;
          outline: none;
        }

        h1, h2, h3, h4, h5, h6 {
          letter-spacing: 0;
          overflow-wrap: anywhere;
        }

        p, span, a, label, li, button, input {
          overflow-wrap: anywhere;
        }

        .font-display {
          font-family: var(--font-sans);
          font-weight: 600;
        }

        .safe-text {
          overflow-wrap: anywhere;
          word-break: normal;
          hyphens: auto;
        }

        .price-text {
          max-width: 100%;
          overflow-wrap: anywhere;
          line-height: 1.05;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .responsive-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 282px), 1fr));
          gap: 1rem;
        }

        .responsive-plan-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 248px), 1fr));
          gap: 1rem;
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
          gap: .75rem;
        }

        .input-field:focus {
          outline: none;
          border-color: var(--c-blue);
          box-shadow: 0 0 0 3px rgba(59,130,246,0.16);
        }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--c-border); border-radius: 999px; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.14); } 100% { transform: scale(1); } }
        @keyframes toastIn { from { transform: translateY(-16px) scale(.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes loadingBar { 0% { transform: translateX(-100%); } 100% { transform: translateX(210%); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }

        .animate-fade-up { animation: fadeUp .42s cubic-bezier(.16, 1, .3, 1) both; }
        .animate-fade-in { animation: fadeIn .28s ease both; }
        .animate-scale-in { animation: scaleIn .28s cubic-bezier(.34, 1.56, .64, 1) both; }
        .animate-check-pop { animation: checkPop .28s cubic-bezier(.34, 1.56, .64, 1) both; }
        .animate-toast-in { animation: toastIn .28s cubic-bezier(.34, 1.56, .64, 1) both; }
        .animate-slide-right { animation: slideRight .34s cubic-bezier(.16, 1, .3, 1) both; }
        .animate-slide-up { animation: slideUp .34s cubic-bezier(.16, 1, .3, 1) both; }
        .loading-bar-anim { animation: loadingBar 1.45s infinite linear; }
        .animate-spin { animation: spin .7s linear infinite; }
        .animate-shake { animation: shake .3s cubic-bezier(.36,.07,.19,.97) both; }

        .text-gradient-blue {
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-hover {
          transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease, background-color .22s ease;
        }

        .card-hover:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 640px) {
          .mobile-soft-card {
            border-radius: 1.35rem !important;
          }

          .sticky-safe {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }

        @media (max-width: 420px) {
          .micro-stack {
            flex-direction: column;
            align-items: stretch;
          }

          .micro-center {
            text-align: center;
            justify-content: center;
          }

          .price-text {
            font-size: clamp(1.3rem, 8vw, 2rem);
          }
        }
      `,
    }}
  />
));

const ToastContainer = memo(({ toasts, isDark }: { toasts: { id: number; msg: string; type: 'success' | 'error' }[]; isDark: boolean }) => (
  <div className="fixed top-4 left-1/2 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 px-4 pointer-events-none">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role="alert"
        className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
          toast.type === 'error'
            ? 'border-red-500/50 bg-red-950 text-red-100'
            : isDark
              ? 'border-white/10 bg-[#181c25] text-white'
              : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toast.type === 'error' ? 'bg-red-800 text-red-100' : 'bg-emerald-500/20 text-emerald-400'}`}>
          <Icon name={toast.type === 'error' ? 'alert-circle' : 'check'} size={16} />
        </span>
        <span className="safe-text text-sm font-semibold leading-snug">{toast.msg}</span>
      </div>
    ))}
  </div>
));

const Button = memo(
  ({
    children,
    onClick,
    variant = 'primary',
    size = 'md',
    disabled = false,
    full = false,
    icon,
    className = '',
    loading = false,
    ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'whatsapp' | 'outline' | 'ghost' | 'amber';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
    full?: boolean;
    icon?: string;
    className?: string;
    loading?: boolean;
    ariaLabel?: string;
  }) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25',
      secondary: 'bg-white/10 border border-white/10 text-white hover:bg-white/15',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/25',
      outline: 'border border-current text-current hover:bg-white/10',
      ghost: 'text-current hover:bg-white/10',
      amber: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-900/25',
    };
    const sizes = {
      sm: 'min-h-10 text-xs px-4 py-2 rounded-xl',
      md: 'min-h-12 text-sm px-5 py-3 rounded-2xl',
      lg: 'min-h-14 text-sm sm:text-base px-6 py-4 rounded-2xl',
      xl: 'min-h-16 text-sm sm:text-base px-7 py-4 rounded-2xl',
    };

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        className={`inline-flex items-center justify-center gap-2 text-center font-semibold leading-tight tracking-wide transition-all duration-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
      >
        {loading ? <span className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <>{icon && <Icon name={icon} size={19} />}{children}</>}
      </button>
    );
  },
);

const InputField = memo(
  ({
    label,
    value,
    onChange,
    placeholder,
    icon,
    type = 'text',
    isDark,
    hasError = false,
    disabled = false,
    maxLength,
  }: {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    icon?: string;
    type?: string;
    isDark: boolean;
    hasError?: boolean;
    disabled?: boolean;
    maxLength?: number;
  }) => (
    <div className={`w-full space-y-2 ${hasError ? 'animate-shake' : ''}`}>
      <label className={`safe-text block pl-1 text-xs font-semibold uppercase tracking-widest ${hasError ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>
      <div className="relative">
        {icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasError ? 'text-red-400' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            <Icon name={icon} size={20} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`input-field h-14 w-full rounded-2xl border text-base font-medium transition-all disabled:cursor-not-allowed disabled:opacity-55 ${icon ? 'pl-12 pr-4' : 'px-5'} ${
            hasError
              ? 'border-red-500/60 bg-red-950/20 text-red-200 placeholder:text-red-300/50'
              : isDark
                ? 'border-white/10 bg-white/5 text-white placeholder:text-zinc-600 focus:bg-white/10'
                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:bg-blue-50/40'
          }`}
        />
      </div>
    </div>
  ),
);

const SideMenu = memo(({ isOpen, onClose, isDark, toggleTheme, user, T }: { isOpen: boolean; onClose: () => void; isDark: boolean; toggleTheme: () => void; user: UserData; T: ReturnType<typeof getData>['text'] }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <aside className={`fixed right-0 top-0 z-[70] flex h-full w-80 max-w-[88vw] flex-col p-6 shadow-2xl animate-slide-right ${isDark ? 'border-l border-white/10 bg-[#11141a]' : 'border-l border-slate-200 bg-[#f9f8f6]'}`}>
        <div className="mb-7 flex items-center justify-between gap-3">
          <h2 className="safe-text font-display text-2xl">{T.menuTitle}</h2>
          <button type="button" onClick={onClose} className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`} aria-label="Fechar menu">
            <Icon name="x" size={22} />
          </button>
        </div>

        <div className={`mb-5 rounded-3xl border p-5 ${isDark ? 'border-blue-500/20 bg-blue-950/30' : 'border-blue-200 bg-blue-50'}`}>
          <p className={`text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>XP</p>
          <p className="price-text mt-2 font-display text-5xl">{user.xp}</p>
          <p className={`safe-text mt-4 border-t pt-4 text-xs font-medium leading-relaxed ${isDark ? 'border-white/10 text-zinc-500' : 'border-blue-200 text-slate-500'}`}>Seu progresso fica salvo neste navegador.</p>
        </div>

        <nav className="flex-1 space-y-3">
          <button type="button" onClick={toggleTheme} className={`flex w-full items-center justify-between gap-4 rounded-2xl p-4 text-left transition-colors ${isDark ? 'text-zinc-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}>
            <span className="flex min-w-0 items-center gap-3">
              <Icon name={isDark ? 'moon' : 'sun'} size={20} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
              <span className="safe-text font-medium">{T.themeTitle}</span>
            </span>
            <span className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-200 text-slate-600'}`}>{isDark ? T.themeDark : T.themeLight}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const nav = navigator as Navigator & { share?: (data: { title?: string; text?: string; url?: string }) => Promise<void> };
              if (nav.share) {
                void nav.share({ title: 'Thalyson Massagens', text: T.shareText, url: window.location.href });
              }
            }}
            className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left transition-colors ${isDark ? 'text-zinc-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100'}`}
          >
            <Icon name="share" size={20} className="text-emerald-400" />
            <span className="safe-text font-medium">{T.referBtn}</span>
          </button>
        </nav>
      </aside>
    </>
  );
});

const ProfileHero = memo(({ isDark, T, ordersCount }: { isDark: boolean; T: ReturnType<typeof getData>['text']; ordersCount: number }) => (
  <div className={`mobile-soft-card relative overflow-hidden rounded-[2rem] border shadow-2xl ${isDark ? 'border-white/10 bg-white/5 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
    <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
      <img
        src={CONFIG.PROFILE_PHOTO_URL}
        alt="Foto de Thalyson"
        className="h-full w-full object-cover"
        style={{ objectPosition: 'center top' }}
        loading="eager"
      />
    </div>
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 text-white">
      <div className="flex items-end justify-between gap-4 micro-stack">
        <div>
          <p className="safe-text text-xs font-semibold uppercase tracking-widest text-blue-200">{T.profileBadge}</p>
          <h3 className="safe-text mt-1 font-display text-2xl">Thalyson</h3>
          <p className="safe-text mt-1 text-xs text-zinc-200">{T.profileNote}</p>
        </div>
        <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right backdrop-blur micro-center">
          <p className="text-2xl font-display">+{ordersCount}</p>
          <p className="safe-text text-[10px] font-bold uppercase tracking-widest text-zinc-300">{T.headerTensions}</p>
        </div>
      </div>
    </div>
  </div>
));

const ReviewCard = memo(({ review, isDark }: { review: Review; isDark: boolean }) => (
  <article className={`flex h-full min-w-0 flex-col rounded-[1.65rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-base font-bold ${isDark ? 'bg-blue-500/15 text-blue-300' : 'bg-blue-50 text-blue-700'}`}>{review.n.charAt(0)}</div>
        <div className="min-w-0">
          <p className="safe-text font-semibold">{review.n}</p>
          <p className={`safe-text text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{review.loc}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} name="star" size={14} className={i < review.s ? 'fill-amber-400 text-amber-400' : isDark ? 'text-zinc-700' : 'text-slate-200'} />
        ))}
      </div>
    </div>
    <div className={`mb-4 inline-flex max-w-full self-start items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${isDark ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : 'border-amber-200 bg-amber-50 text-amber-700'}`}>
      <Icon name="award" size={12} />
      <span className="safe-text">{review.serv}</span>
    </div>
    <p className={`safe-text flex-1 text-sm italic leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{review.t}"</p>
  </article>
));

const FAQItem = memo(({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between gap-4 py-5 text-left">
        <span className="safe-text text-base font-semibold">{q}</span>
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-transform ${open ? 'rotate-180 bg-blue-600 text-white' : isDark ? 'border-white/10 text-zinc-400' : 'border-slate-200 text-slate-400'}`}>
          <Icon name="chevron-down" size={16} />
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-72 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className={`safe-text text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
});

const ServiceModal = memo(
  ({
    service,
    isOpen,
    onClose,
    onSelect,
    isInCart,
    isDark,
    T,
    lang,
    isPremium,
  }: {
    service: ServiceItem | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (service: ServiceItem) => void;
    isInCart: boolean;
    isDark: boolean;
    T: ReturnType<typeof getData>['text'];
    lang: Lang;
    isPremium: boolean;
  }) => {
    if (!isOpen || !service) return null;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
        <div className={`mobile-soft-card flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[2.25rem] border shadow-2xl animate-scale-in ${isDark ? 'border-white/10 bg-[#11141a]' : 'border-slate-200 bg-white'}`}>
          <div className={`relative shrink-0 p-6 ${isPremium ? (isDark ? 'bg-amber-950/20' : 'bg-amber-50') : isDark ? 'bg-blue-950/20' : 'bg-blue-50'}`}>
            <button type="button" onClick={onClose} className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-black/25 text-white hover:bg-black/45' : 'bg-white/80 text-slate-700 hover:bg-white'}`} aria-label="Fechar detalhes">
              <Icon name="x" size={20} />
            </button>
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border ${isPremium ? 'border-amber-500/30 bg-amber-500/15 text-amber-400' : isDark ? 'border-white/15 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>
              <Icon name={service.icon} size={30} />
            </div>
            <div className="mb-3 flex flex-wrap gap-2">
              <span className={`safe-text rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'border-amber-500/30 bg-amber-500/15 text-amber-400' : isDark ? 'border-white/15 bg-white/10 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                {service.tag}
              </span>
              {service.popular && <span className="safe-text rounded-full bg-blue-600 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">{T.popularBadge}</span>}
            </div>
            <h3 className="safe-text font-display text-2xl leading-tight">{service.title}</h3>
            <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              {service.fullPrice && <span className={`safe-text text-sm line-through ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.from} {formatMoney(service.fullPrice, lang)}</span>}
              <span className="price-text font-display text-2xl">{formatMoney(service.price, lang)}</span>
            </div>
          </div>

          <div className={`flex-1 overflow-y-auto p-6 scrollbar-hide ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
            <p className="safe-text text-sm font-medium leading-relaxed">{service.desc}</p>
            <h4 className={`safe-text mt-6 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.detailsLabel}</h4>
            <div className="mt-4 space-y-3">
              {service.details.split('\n').map((line) => (
                <div key={line} className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${isPremium ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                    <Icon name="check" size={12} />
                  </span>
                  <span className="safe-text text-sm leading-relaxed">{line}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`shrink-0 border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <Button full size="lg" variant={isInCart ? 'outline' : isPremium ? 'amber' : 'primary'} onClick={() => { onSelect(service); onClose(); }}>
              {isInCart ? T.removeService : T.chooseService}
            </Button>
          </div>
        </div>
      </div>
    );
  },
);

const ServiceCard = memo(
  ({ service, isInCart, onOpenModal, isDark, T, lang, isPremium = false }: { service: ServiceItem; isInCart: boolean; onOpenModal: (service: ServiceItem) => void; isDark: boolean; T: ReturnType<typeof getData>['text']; lang: Lang; isPremium?: boolean }) => (
    <button
      type="button"
      onClick={() => onOpenModal(service)}
      className={`card-hover flex h-full min-w-0 flex-col rounded-[1.65rem] border p-5 text-left mobile-soft-card ${
        isInCart
          ? isPremium
            ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/10'
            : 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-900/10'
          : isDark
            ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:shadow-md'
      }`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className={`flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl border ${isPremium ? 'border-amber-500/25 bg-amber-500/12 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
          <Icon name={service.icon} size={25} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="safe-text font-display text-lg leading-tight">{service.title}</h3>
            {isInCart && (
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full animate-check-pop ${isPremium ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
                <Icon name="check" size={15} />
              </span>
            )}
          </div>
          <p className={`safe-text mt-2 text-sm leading-relaxed line-clamp-3 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{service.desc}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <span className={`safe-text max-w-full rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${isPremium ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
          {service.tag}
        </span>
        <div className="min-w-0 text-right">
          {service.fullPrice && <p className={`safe-text text-xs font-medium line-through ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{formatMoney(service.fullPrice, lang)}</p>}
          <p className="price-text font-display text-xl">{formatMoney(service.price, lang)}</p>
          {service.savings && <p className="safe-text mt-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400">{T.savings} {formatMoney(service.savings, lang)}</p>}
        </div>
      </div>
    </button>
  ),
);

const RuleItem = memo(({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
      <Icon name={rule.icon} size={22} />
    </span>
    <div className="min-w-0">
      <h4 className="safe-text font-display text-base">{rule.title}</h4>
      <p className={`safe-text mt-1 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{rule.description}</p>
    </div>
  </div>
));

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [activeTab, setActiveTab] = useState<'single' | 'packs'>('single');
  const [toasts, setToasts] = useState<{ id: number; msg: string; type: 'success' | 'error' }[]>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState<ServiceItem | null>(null);

  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 92,
    lastActivity: new Date().toISOString(),
  });

  const [booking, setBooking] = useState<BookingData>(() => createInitialBooking());

  const dateScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3800);
  }, []);

  const openExternal = useCallback((platform: 'whatsapp' | 'instagram', text?: string) => {
    const url = platform === 'whatsapp' ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text || '')}` : CONFIG.INSTAGRAM_URL;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => anchor.remove(), 100);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      Object.keys(localStorage).forEach((key) => {
        if (!key.startsWith('@thaly_app')) return;
        try {
          JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          localStorage.removeItem(key);
        }
      });

      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { user?: Partial<UserData>; bookingDraft?: Partial<BookingData>; step?: number; isDark?: boolean; lang?: Lang };
        if (parsed.user) {
          setUser((prev) => ({
            ...prev,
            ...parsed.user,
            name: sanitizeInput(parsed.user?.name || ''),
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            ordersCount: typeof parsed.user.ordersCount === 'number' ? Math.max(parsed.user.ordersCount, 92) : 92,
            xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
          }));
        }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            setBooking((prev) => ({
              ...prev,
              ...parsed.bookingDraft,
              cart: parsed.bookingDraft?.cart || [],
              extras: typeof parsed.bookingDraft.extras === 'object' && parsed.bookingDraft.extras ? parsed.bookingDraft.extras : {},
              address: {
                cep: sanitizeInput(parsed.bookingDraft?.address?.cep || ''),
                street: sanitizeInput(parsed.bookingDraft?.address?.street || ''),
                number: sanitizeInput(parsed.bookingDraft?.address?.number || ''),
                district: sanitizeInput(parsed.bookingDraft?.address?.district || ''),
                city: sanitizeInput(parsed.bookingDraft?.address?.city || ''),
                comp: sanitizeInput(parsed.bookingDraft?.address?.comp || ''),
                placeName: sanitizeInput(parsed.bookingDraft?.address?.placeName || ''),
              },
            }));
          }
        }
        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
        if (typeof parsed.isDark === 'boolean') setIsDark(parsed.isDark);
        if (parsed.lang === 'pt' || parsed.lang === 'en') setLang(parsed.lang);
      }
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } finally {
      setDataLoaded(true);
      window.setTimeout(() => setLoading(false), 650);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !dataLoaded) return;
    try {
      const save = {
        user: { ...user, lastActivity: new Date().toISOString() },
        bookingDraft: booking,
        step,
        isDark,
        lang,
      };
      const payload = JSON.stringify(save);
      if (payload.length < CONFIG.MAX_STORAGE_SIZE * 1024) localStorage.setItem(CONFIG.STORAGE_KEY, payload);
    } catch {
      // localStorage can be unavailable in private browsers.
    }
  }, [booking, dataLoaded, isClient, isDark, lang, step, user]);

  useEffect(() => {
    if (isClient) {
      document.title = step === 0 ? 'Thalyson Massagens' : lang === 'en' ? 'Your Booking - Thalyson' : 'Seu Agendamento - Thalyson';
    }
  }, [isClient, lang, step]);

  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome) {
      const timer = window.setTimeout(() => setWelcomePopup(true), 1200);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [dataLoaded, isClient, loading, user.hasSeenWelcome]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const handleToggleCartItem = useCallback(
    (item: ServiceItem) => {
      vibrate(35);
      setBooking((prev) => {
        const exists = prev.cart.some((service) => service.id === item.id);
        const nextCart = exists ? prev.cart.filter((service) => service.id !== item.id) : [...prev.cart, item];
        return {
          ...prev,
          type: nextCart.some((service) => service.type === 'pack') ? 'pack' : 'single',
          cart: nextCart,
          payment: '',
          termsAccepted: false,
        };
      });
      addToast(T.toastCart);
    },
    [T.toastCart, addToast],
  );

  const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(event.target.value);
    setBooking((prev) => ({ ...prev, address: { ...prev.address, cep: masked } }));

    if (masked.length !== 9) return;
    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setBooking((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            cep: masked,
            street: sanitizeInput(data.logradouro || prev.address.street),
            district: sanitizeInput(data.bairro || prev.address.district),
            city: sanitizeInput(data.localidade || prev.address.city),
          },
        }));
        addToast(T.toastCepFound);
      } else {
        addToast(T.toastCepError, 'error');
      }
    } catch {
      addToast(T.toastCepError, 'error');
    } finally {
      setIsFetchingCep(false);
    }
  };

  const daysArray = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
  }, []);

  const getDayLabel = useCallback(
    (date: Date) => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      if (date.toDateString() === today.toDateString()) return T.today;
      if (date.toDateString() === tomorrow.toDateString()) return T.tomorrow;
      return date.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: 'short' }).slice(0, 3).toUpperCase();
    },
    [T.today, T.tomorrow, lang],
  );

  const timeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }, (_, index) => `${String(CONFIG.START_HOUR + index).padStart(2, '0')}:00`);
    const now = new Date();
    const selected = new Date(booking.date);
    if (Number.isNaN(selected.getTime())) return [];
    if (selected.toDateString() === now.toDateString()) {
      return slots.filter((time) => Number(time.split(':')[0]) > now.getHours());
    }
    return slots;
  }, [booking.date]);

  const groupedTimeSlots = useMemo(
    () => ({
      morning: timeSlots.filter((time) => Number(time.split(':')[0]) < 12),
      afternoon: timeSlots.filter((time) => {
        const hour = Number(time.split(':')[0]);
        return hour >= 12 && hour < 17;
      }),
      evening: timeSlots.filter((time) => Number(time.split(':')[0]) >= 17),
    }),
    [timeSlots],
  );

  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
    const isPack = booking.cart.some((item) => item.type === 'pack');
    let sub = 0;
    let baseDuration = 0;

    booking.cart.forEach((item) => {
      sub += item.price;
      if (!isPack) baseDuration += item.min || 60;
    });

    if (isPack) baseDuration = 60;
    let addedTime = 0;

    Object.keys(booking.extras).forEach((key) => {
      if (!booking.extras[key]) return;
      const extra = DATA.extras.find((item) => item.id === key);
      if (!extra) return;
      sub += isPack ? Math.floor(extra.price * 0.8) : extra.price;
      if (extra.id === 'more_time') addedTime += 30;
    });

    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let running = Math.max(0, sub - disc);
    let mediaDisc = 0;
    if (booking.mediaAllowed) {
      mediaDisc = Math.ceil(running * 0.01);
      running = Math.max(0, running - mediaDisc);
    }
    const pixDisc = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    const rushFee = RUSH_HOURS.includes(booking.time || '') && booking.locationType !== 'motel' ? RUSH_FEE : 0;
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: Math.max(0, running - pixDisc) + rushFee, duration: baseDuration + addedTime };
  }, [DATA.extras, booking.appliedCoupon, booking.cart, booking.extras, booking.locationType, booking.mediaAllowed, booking.payment, booking.time]);

  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.cart.some((item) => item.type === 'pack') ? 0.3 : 0.15)), [booking.cart, financials.total]);

  const nextLevel = useMemo(() => {
    if (user.xp >= 800) {
      const need = 500 - ((user.xp - 800) % 500);
      return { needed: need, reward: DATA.levels[3].reward };
    }
    const next = DATA.levels.find((level) => level.xpNeeded > user.xp);
    return next ? { needed: next.xpNeeded - user.xp, reward: next.reward } : null;
  }, [DATA.levels, user.xp]);

  const currentLevelTitle = useMemo(() => {
    if (user.xp >= 800) return 'Plenitude Plus';
    return DATA.levels.slice().reverse().find((level) => user.xp >= level.xpNeeded)?.title || DATA.levels[0].title;
  }, [DATA.levels, user.xp]);

  const currentLevelProgress = useMemo(() => {
    if (user.xp >= 800) return (((user.xp - 800) % 500) / 500) * 100;
    const currentIndex = (() => {
      for (let index = DATA.levels.length - 1; index >= 0; index -= 1) {
        if (user.xp >= DATA.levels[index].xpNeeded) return index;
      }
      return 0;
    })();
    const current = DATA.levels[Math.max(0, currentIndex)];
    const next = DATA.levels[Math.max(0, currentIndex) + 1];
    if (!next) return 100;
    return Math.min(100, Math.max(0, ((user.xp - current.xpNeeded) / (next.xpNeeded - current.xpNeeded)) * 100));
  }, [DATA.levels, user.xp]);

  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) {
      if (!user.name || user.name.trim().length < 3) return false;
      if (booking.locationType === 'home') return validateAddress(booking.address);
      if (booking.locationType === 'hotel') return Boolean(booking.address.placeName && booking.address.city);
      return true;
    }
    if (step === 2) return Boolean(booking.date && booking.time);
    if (step === 3) return Boolean(booking.payment && booking.termsAccepted);
    return true;
  }, [booking, step, user.name]);

  const createBookingHash = useCallback(() => {
    const raw = `${financials.total}-${booking.date}-${booking.cart[0]?.id || ''}-${CONFIG.SECRET_TOKEN}`;
    const hash = raw.split('').reduce((acc, char) => ((acc * 31 + char.charCodeAt(0)) | 0), 7);
    return Math.abs(hash).toString(36).toUpperCase().padStart(8, '0').slice(0, 8);
  }, [booking.cart, booking.date, financials.total]);

  const generateWhatsAppMsg = useCallback(() => {
    const isEn = lang === 'en';
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(isEn ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const servicesText = booking.cart
      .map((item) => {
        const lines = item.details.split('\n').map((line) => `  - ${line}`).join('\n');
        return `✅ *${item.title}*\n_${item.desc}_\n${lines}`;
      })
      .join('\n\n');

    const extrasList = Object.keys(booking.extras)
      .filter((key) => booking.extras[key])
      .map((key) => DATA.extras.find((extra) => extra.id === key)?.label)
      .filter(Boolean)
      .map((label) => `+ ${label}`)
      .join('\n');

    let locTxt = '';
    let mapQ = '';
    if (booking.locationType === 'home') {
      const address = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      locTxt = `🏠 *${isEn ? 'Residence' : 'Residencia'}*\n📍 ${address}\n📝 ${booking.address.comp || '-'}`;
      mapQ = address;
    } else if (booking.locationType === 'motel') {
      locTxt = `🏩 *${isEn ? 'My Suite' : 'Minha Suite'}*\n⚠️ ${isEn ? 'Address confirmed on WhatsApp' : 'Endereco confirmado pelo WhatsApp'}`;
    } else {
      const address = `${booking.address.placeName}, ${booking.address.city}`;
      locTxt = `🏨 *Hotel: ${booking.address.placeName}*\n📍 ${booking.address.city}\n🚪 ${isEn ? 'Room' : 'Quarto'}: ${booking.address.comp || '-'}`;
      mapQ = address;
    }

    const mapLink = mapQ ? `\n🔗 GPS: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQ)}` : '';
    let prices = `${isEn ? 'Subtotal' : 'Subtotal'}: ${formatMoney(financials.sub, lang)}`;
    if (financials.disc > 0) prices += `\n${booking.appliedCoupon?.code}: -${formatMoney(financials.disc, lang)}`;
    if (financials.mediaDisc > 0) prices += `\nPortfolio: -${formatMoney(financials.mediaDisc, lang)}`;
    if (financials.pixDisc > 0) prices += `\nPIX: -${formatMoney(financials.pixDisc, lang)}`;
    if (financials.rushFee > 0) prices += `\n${isEn ? 'Rush fee' : 'Taxa de pico'}: +${formatMoney(financials.rushFee, lang)}`;
    prices += `\n\n*TOTAL: ${formatMoney(financials.total, lang)}*`;

    return `${isEn ? '*CARE RESERVATION*' : '*PEDIDO DE ENCONTRO*'} | #${createBookingHash()}
──────────────────
${isEn ? "Hello Thalyson! I'd like to schedule my moment." : 'Ola Thalyson! Gostaria de agendar meu momento.'}

👤 *${isEn ? 'Name' : 'Nome'}:* ${sanitizeInput(user.name)}
📅 *${isEn ? 'Date' : 'Data'}:* ${dateStr} ${isEn ? 'at' : 'as'} ${booking.time}
⏱️ *${isEn ? 'Duration' : 'Tempo estimado'}:* ${financials.duration} min

💆 *${isEn ? 'What I chose' : 'O que eu escolhi'}:*
${servicesText}

${extrasList ? `*Extras:*\n${extrasList}\n\n` : ''}📍 *${isEn ? 'Where' : 'Onde vamos nos ver'}:*
${locTxt}${mapLink}

${booking.locationType !== 'motel' ? `⚠️ ${isEn ? 'Travel fee confirmed in chat.' : 'Taxa de deslocamento confirmada no chat.'}\n` : ''}
💰 *${isEn ? 'Investment' : 'Valor final'}:*
${prices}

💳 *${isEn ? 'Payment' : 'Pagamento'}:* ${booking.payment.toUpperCase()}
──────────────────
_${isEn ? 'I accept the terms and await confirmation.' : 'Li e aceito as regras. Aguardo sua confirmacao.'}_`.trim();
  }, [DATA.extras, booking, createBookingHash, financials, lang, user.name]);

  const finishBooking = useCallback(() => {
    vibrate([80, 40, 80]);
    let updatedCoupons = [...user.coupons];
    const updatedHistory = [...user.usedCoupons];

    if (booking.appliedCoupon && booking.appliedCoupon.id !== 'manual') {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) updatedHistory.push(booking.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter((coupon) => coupon.code !== booking.appliedCoupon?.code);
    }

    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    DATA.levels.forEach((level) => {
      if (newXP >= level.xpNeeded && user.xp < level.xpNeeded && level.level > 1) {
        leveledUp = true;
        updatedCoupons.push({ id: `LVL${level.level}_${Date.now()}`, val: level.reward, title: `🏆 ${level.title}`, code: `LVLUP${level.level}` });
      }
    });

    if (newXP > 800) {
      const oldLoop = Math.floor(Math.max(0, user.xp - 800) / 500);
      const newLoop = Math.floor(Math.max(0, newXP - 800) / 500);
      if (newLoop > oldLoop) {
        leveledUp = true;
        updatedCoupons.push({ id: `PLUS_${Date.now()}`, val: DATA.levels[3].reward, title: '🏆 Plenitude Plus', code: `PLUS${newLoop}` });
      }
    }

    setUser((prev) => ({
      ...prev,
      xp: newXP,
      coupons: updatedCoupons,
      usedCoupons: updatedHistory,
      ordersCount: Math.max(prev.ordersCount || 92, 92) + 1,
      lastActivity: new Date().toISOString(),
    }));

    if (leveledUp) {
      setLevelUpPopup(true);
      window.setTimeout(() => addToast(lang === 'en' ? 'Level up!' : 'Voce subiu de nivel!'), 500);
    }

    openExternal('whatsapp', generateWhatsAppMsg());
    setStep(4);
  }, [DATA.levels, addToast, booking.appliedCoupon, estimatedXP, generateWhatsAppMsg, lang, openExternal, user.coupons, user.usedCoupons, user.xp]);

  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      vibrate([45, 45]);
      setHasErrorGlobal(true);
      window.setTimeout(() => setHasErrorGlobal(false), 520);
      const msgs: Record<number, string> = {
        0: T.toastSelectItem,
        1: !user.name || user.name.trim().length < 3 ? T.toastFillName : T.toastFillAddr,
        2: T.toastSelectDate,
        3: T.toastAcceptTerms,
      };
      addToast(msgs[step] || T.toastSelectItem, 'error');
      return;
    }

    vibrate(25);
    if (step === 3) finishBooking();
    else setStep((prev) => prev + 1);
  }, [T, addToast, finishBooking, isStepValid, step, user.name]);

  const categoryCards = useMemo(
    () => [
      { id: 'relax' as Category, title: lang === 'en' ? 'Just Relax' : 'Apenas Relaxar', desc: lang === 'en' ? 'Therapeutic body work to relieve stress.' : 'Tire a dor muscular e o peso das costas.' },
      { id: 'express' as Category, title: lang === 'en' ? 'Express Care' : 'Cuidados Rapidos', desc: lang === 'en' ? 'Quick localized relief for hands and feet.' : 'Alivio rapido para maos e pes cansados.' },
      { id: 'final' as Category, title: lang === 'en' ? 'With Ending' : 'Massagens com Finalizacao', desc: lang === 'en' ? 'A complete sensory journey.' : 'Jornada completa com experiencia sensorial.' },
      { id: 'care' as Category, title: lang === 'en' ? 'Personal Care' : 'Cuidados Pessoais', desc: lang === 'en' ? 'Aesthetic body maintenance.' : 'Manutencao estetica para seu corpo.' },
    ],
    [lang],
  );

  if (!isClient) return <div className="min-h-screen w-full bg-[#11141a]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDark ? 'bg-[#11141a]' : 'bg-[#f9f8f6]'}`}>
        <div className="w-full max-w-xs px-8 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-blue-400/20 bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl">
            <span className="font-display text-5xl text-white">T</span>
          </div>
          <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 loading-bar-anim" />
          </div>
          <p className={`safe-text text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />

      {isDark && (
        <div className="pointer-events-none fixed inset-0 z-[-1] overflow-hidden">
          <div className="absolute left-1/4 top-0 h-[420px] w-[420px] rounded-full bg-blue-600/5 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-indigo-600/5 blur-[100px]" />
        </div>
      )}

      <ToastContainer toasts={toasts} isDark={isDark} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark((prev) => !prev)} user={user} T={T} />
      <ServiceModal
        service={selectedServiceForModal}
        isOpen={Boolean(selectedServiceForModal)}
        onClose={() => setSelectedServiceForModal(null)}
        onSelect={handleToggleCartItem}
        isInCart={selectedServiceForModal ? booking.cart.some((item) => item.id === selectedServiceForModal.id) : false}
        isDark={isDark}
        T={T}
        lang={lang}
        isPremium={selectedServiceForModal?.type === 'pack'}
      />

      <main className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 pb-44 sm:px-6 lg:px-8">
        {step !== 4 && (
          <header className="pb-8 pt-8 sm:pb-10 sm:pt-12">
            <div className="flex items-start justify-between gap-4">
              <button type="button" onClick={() => setStep(0)} className="min-w-0 text-left">
                <h1 className={`safe-text font-display text-3xl leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson Massagens</h1>
                <div className={`mt-2 flex min-w-0 items-center gap-3 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
                  </span>
                  <span className="safe-text">{lang === 'en' ? `${user.ordersCount}+ ${T.headerTensions}` : `+${user.ordersCount} ${T.headerTensions}`}</span>
                </div>
              </button>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button type="button" onClick={() => setLang((prev) => (prev === 'pt' ? 'en' : 'pt'))} className={`relative flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`} aria-label="Trocar idioma">
                  <Icon name="globe" size={20} />
                  <span className="absolute -bottom-2 -right-2 rounded-md bg-blue-600 px-1.5 py-0.5 text-[8px] font-bold leading-none text-white">{lang.toUpperCase()}</span>
                </button>
                <button type="button" onClick={() => openExternal('instagram')} className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-pink-400 hover:bg-white/10' : 'border-slate-200 bg-white text-pink-600 hover:text-pink-700'}`} aria-label="Abrir Instagram">
                  <Icon name="instagram" size={20} />
                </button>
                <button type="button" onClick={() => setMenuOpen(true)} className={`flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'}`} aria-label="Abrir menu">
                  <Icon name="menu" size={20} />
                </button>
              </div>
            </div>

            {step > 0 && step < 4 && (
              <div className="mt-8 flex items-start gap-3">
                {[1, 2, 3].map((item) => (
                  <button key={item} type="button" onClick={() => item < step && setStep(item)} className="flex flex-1 flex-col items-center gap-2">
                    <span className={`h-1.5 w-full rounded-full transition-all ${step > item ? 'bg-blue-600' : step === item ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,.55)]' : isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`safe-text text-center text-[10px] font-semibold uppercase tracking-widest ${step >= item ? (isDark ? 'text-white/80' : 'text-slate-700') : isDark ? 'text-white/25' : 'text-slate-300'}`}>
                      {item === 1 ? T.stepWhere : item === 2 ? T.stepWhen : T.stepSummary}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </header>
        )}

        {step === 0 && (
          <section className="space-y-14 animate-fade-up">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_.82fr]">
              <div className="min-w-0">
                <h2 className={`safe-text mb-5 font-display text-4xl leading-[1.12] sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.welcome} <span className="italic text-gradient-blue">{user.name ? user.name.trim().split(' ')[0] : T.welcomeAnon}</span>
                </h2>
                <p className={`safe-text max-w-xl text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.chooseSub}</p>
              </div>
              <ProfileHero isDark={isDark} T={T} ordersCount={user.ordersCount} />
            </div>

            <div className={`mobile-soft-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex min-w-0 items-center gap-4">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isDark ? 'border border-amber-500/20 bg-amber-500/15 text-amber-400' : 'border border-amber-200 bg-amber-50 text-amber-600'}`}>
                    <Icon name="award" size={24} />
                  </span>
                  <div className="min-w-0">
                    <p className={`safe-text text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.levelLabel}</p>
                    <h3 className="safe-text mt-1 font-semibold">{currentLevelTitle}</h3>
                  </div>
                </div>
                <div className="min-w-0 text-right">
                  <span className="price-text font-display text-4xl text-gradient-blue">{user.xp}</span>
                  <span className={`safe-text block text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>XP</span>
                </div>
              </div>

              <div className="mt-7">
                <div className={`mb-3 flex justify-between gap-4 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                  <span>Evolucao</span>
                  <span>{Math.floor(currentLevelProgress)}%</span>
                </div>
                <div className={`h-2 overflow-hidden rounded-full ${isDark ? 'bg-white/10' : 'bg-slate-100'}`}>
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000" style={{ width: `${currentLevelProgress}%` }} />
                </div>
                {nextLevel && (
                  <p className={`safe-text mt-4 text-center text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {T.levelKeep1} <strong className={isDark ? 'text-white' : 'text-slate-800'}>{nextLevel.needed} XP</strong> {T.levelKeep2} <span className="text-blue-400">{formatMoney(nextLevel.reward, lang)}</span>
                  </p>
                )}
              </div>
            </div>

            <div className={`mx-auto flex w-full max-w-xl flex-col rounded-2xl border p-2 shadow-sm sm:flex-row ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              {[
                { id: 'single' as const, label: T.tabSingle, icon: 'user' },
                { id: 'packs' as const, label: T.tabPacks, icon: 'package' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === tab.id ? (tab.id === 'packs' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-blue-600 text-white shadow-lg') : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="safe-text">{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'single' ? (
              <div className="space-y-8">
                {categoryCards.map((category) => {
                  const cfg = CATEGORY_CONFIG[category.id];
                  const services = DATA.services.filter((service) => service.category === category.id);
                  if (!services.length) return null;
                  const selectedCount = booking.cart.filter((item) => item.category === category.id).length;
                  return (
                    <section key={category.id} className="mobile-soft-card overflow-hidden rounded-[2rem] border" style={{ borderColor: `${cfg.color}36`, background: isDark ? `${cfg.color}0d` : `${cfg.color}08` }}>
                      <div className="flex flex-wrap items-center gap-4 border-b px-5 py-5 sm:px-6" style={{ borderColor: `${cfg.color}30` }}>
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border" style={{ background: `${cfg.color}18`, borderColor: `${cfg.color}35`, color: cfg.color }}>
                          <Icon name={cfg.icon} size={26} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="safe-text font-display text-2xl">{category.title}</h3>
                          <p className={`safe-text mt-1 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{category.desc}</p>
                        </div>
                        {selectedCount > 0 && <span className="flex h-8 min-w-[2rem] shrink-0 items-center justify-center rounded-full px-2 text-sm font-bold text-white" style={{ background: cfg.color }}>{selectedCount}</span>}
                      </div>
                      <div className="responsive-card-grid p-4 sm:p-5">
                        {services.map((service) => (
                          <ServiceCard key={service.id} service={service} isInCart={booking.cart.some((item) => item.id === service.id)} onOpenModal={setSelectedServiceForModal} isDark={isDark} T={T} lang={lang} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="responsive-plan-grid">
                {DATA.plans.map((plan) => (
                  <ServiceCard key={plan.id} service={plan} isInCart={booking.cart.some((item) => item.id === plan.id)} onOpenModal={setSelectedServiceForModal} isDark={isDark} T={T} lang={lang} isPremium />
                ))}
              </div>
            )}

            <section className="border-y py-10" style={{ borderColor: isDark ? 'rgba(255,255,255,.08)' : 'rgba(15,23,42,.10)' }}>
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="safe-text font-display text-3xl">{T.reviewsTitle}</h3>
                <div className="hidden gap-3 sm:flex">
                  {(['chevron-left', 'chevron-right'] as const).map((icon, index) => (
                    <button key={icon} type="button" onClick={() => reviewScrollRef.current?.scrollBy({ left: index === 0 ? -360 : 360, behavior: 'smooth' })} className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900'}`} aria-label="Rolar avaliacoes">
                      <Icon name={icon} size={20} />
                    </button>
                  ))}
                </div>
              </div>
              <div ref={reviewScrollRef} className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-4 scrollbar-hide">
                {DATA.reviews.map((review) => (
                  <div key={`${review.n}-${review.serv}`} className="w-[86vw] max-w-sm shrink-0 snap-center sm:w-80 md:w-96">
                    <ReviewCard review={review} isDark={isDark} />
                  </div>
                ))}
              </div>
            </section>

            <section className="mx-auto max-w-3xl pb-8">
              <h3 className="safe-text mb-8 text-center font-display text-3xl">{T.faqTitle}</h3>
              <div className={`mobile-soft-card rounded-[2rem] border px-5 sm:px-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                {DATA.faq.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} isDark={isDark} />
                ))}
              </div>
            </section>
          </section>
        )}

        {step === 1 && (
          <section className="mx-auto max-w-2xl space-y-8 animate-fade-up">
            <div className="text-center">
              <h2 className="safe-text font-display text-4xl sm:text-5xl">{T.locationTitle}</h2>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'home' as LocationType, label: T.locHome, icon: 'home', desc: lang === 'en' ? 'I come to you' : 'Vou ate voce' },
                { id: 'motel' as LocationType, label: T.locMotel, icon: 'bed', desc: lang === 'en' ? 'Discreet space' : 'Local discreto' },
                { id: 'hotel' as LocationType, label: T.locHotel, icon: 'building', desc: lang === 'en' ? 'Your room' : 'Seu quarto' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBooking((prev) => ({ ...prev, locationType: item.id }))}
                  className={`flex min-h-[116px] min-w-0 flex-col items-center justify-center gap-2 rounded-3xl border px-4 py-5 text-center transition-all ${
                    booking.locationType === item.id ? 'scale-[1.02] border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <Icon name={item.icon} size={28} />
                  <span className="safe-text text-xs font-semibold uppercase tracking-widest">{item.label}</span>
                  <span className={`safe-text text-xs ${booking.locationType === item.id ? 'text-blue-100' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{item.desc}</span>
                </button>
              ))}
            </div>

            <div className={`mobile-soft-card space-y-5 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <InputField
                isDark={isDark}
                label={T.inputName}
                value={user.name}
                onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))}
                icon="user"
                placeholder={lang === 'en' ? 'Your name' : 'Como quer ser chamado?'}
                hasError={hasErrorGlobal && (!user.name || user.name.trim().length < 3)}
              />

              {booking.locationType === 'home' && (
                <div className="grid grid-cols-1 gap-5 animate-fade-up sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.inputCep} value={booking.address.cep} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                  </div>
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.inputAddr} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'Street / Avenue' : 'Rua / Avenida completa'} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.street} />
                  </div>
                  <InputField isDark={isDark} label={T.inputNum} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value) } }))} placeholder="Numero" type="tel" hasError={hasErrorGlobal && !booking.address.number} />
                  <InputField isDark={isDark} label={T.inputDistrict} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'Neighborhood' : 'Nome do bairro'} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.district} />
                  <InputField isDark={isDark} label={T.inputCity} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'City' : 'Cidade'} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.city} />
                  <InputField isDark={isDark} label={T.inputComp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'Apt, block' : 'Apto, bloco'} />
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="grid grid-cols-1 gap-5 animate-fade-up sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.inputHotel} value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} icon="building" placeholder={lang === 'en' ? 'Hotel name' : 'Nome completo do hotel'} hasError={hasErrorGlobal && !booking.address.placeName} />
                  </div>
                  <InputField isDark={isDark} label={T.inputCity} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'City' : 'Cidade do hotel'} hasError={hasErrorGlobal && !booking.address.city} />
                  <InputField isDark={isDark} label={T.inputRoom} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder={lang === 'en' ? 'Room number' : 'Numero do quarto'} />
                </div>
              )}

              {booking.locationType === 'motel' && (
                <div className={`flex items-start gap-4 rounded-2xl border p-5 animate-fade-up ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-pink-500/15 text-pink-400' : 'bg-pink-50 text-pink-600'}`}>
                    <Icon name="heart" size={22} />
                  </span>
                  <p className="safe-text text-base font-medium leading-relaxed">{T.motelNote}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mx-auto max-w-3xl space-y-8 animate-fade-up">
            <div className="text-center">
              <h2 className="safe-text font-display text-4xl sm:text-5xl">{T.selectTimeTitle}</h2>
            </div>

            <div className={`mobile-soft-card rounded-3xl border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <span className={`safe-text text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.cartTitle}</span>
                <button type="button" onClick={() => setStep(0)} className={`rounded-lg border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${isDark ? 'border-white/10 text-zinc-300 hover:bg-white/10' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{T.cartEdit}</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {booking.cart.map((item) => (
                  <span key={item.id} className={`safe-text inline-flex min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium ${isDark ? 'border-blue-500/25 bg-blue-500/10 text-blue-300' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                    <Icon name={item.icon} size={16} />
                    {item.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <button type="button" onClick={() => dateScrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' })} className={`absolute -left-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border md:flex ${isDark ? 'border-white/10 bg-[#181c25] text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900'}`} aria-label="Datas anteriores">
                <Icon name="chevron-left" size={20} />
              </button>
              <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto px-1 py-4 scrollbar-hide">
                {daysArray.map((date) => {
                  const isSelected = booking.date && new Date(booking.date).toDateString() === date.toDateString();
                  const month = date.toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: 'short' }).replace('.', '');
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      onClick={() => {
                        setBooking((prev) => ({ ...prev, date: date.toISOString(), time: null }));
                        vibrate(25);
                      }}
                      className={`flex h-[100px] w-[74px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border text-center transition-all ${
                        isSelected ? 'scale-[1.05] border-blue-400 bg-blue-600 text-white shadow-xl shadow-blue-900/30' : isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white' : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:border-slate-300'
                      }`}
                    >
                      <span className="safe-text text-[9px] font-semibold uppercase tracking-wider">{month}</span>
                      <span className="font-display text-3xl leading-none">{date.getDate()}</span>
                      <span className="safe-text text-[9px] font-semibold uppercase tracking-wider">{getDayLabel(date)}</span>
                    </button>
                  );
                })}
              </div>
              <button type="button" onClick={() => dateScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' })} className={`absolute -right-4 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl border md:flex ${isDark ? 'border-white/10 bg-[#181c25] text-zinc-400 hover:text-white' : 'border-slate-200 bg-white text-slate-500 shadow-sm hover:text-slate-900'}`} aria-label="Proximas datas">
                <Icon name="chevron-right" size={20} />
              </button>
            </div>

            {!booking.date && (
              <div className={`mobile-soft-card flex flex-col items-center gap-4 rounded-[2rem] border border-dashed py-16 text-center ${hasErrorGlobal ? 'animate-shake' : ''} ${isDark ? 'border-white/10 text-zinc-600' : 'border-slate-300 text-slate-400'}`}>
                <Icon name="calendar" size={40} className="opacity-50" />
                <p className="safe-text px-5 text-sm font-semibold uppercase tracking-widest">{T.emptyDate}</p>
              </div>
            )}

            {booking.date && timeSlots.length > 0 && (
              <div className={`space-y-6 ${hasErrorGlobal && !booking.time ? 'animate-shake' : ''}`}>
                {[
                  { key: 'morning', label: T.morning, icon: 'sunrise', slots: groupedTimeSlots.morning },
                  { key: 'afternoon', label: T.afternoon, icon: 'sun', slots: groupedTimeSlots.afternoon },
                  { key: 'evening', label: T.evening, icon: 'sunset', slots: groupedTimeSlots.evening },
                ]
                  .filter((group) => group.slots.length > 0)
                  .map((group) => (
                    <div key={group.key}>
                      <div className={`mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        <Icon name={group.icon} size={15} />
                        <span className="safe-text">{group.label}</span>
                      </div>
                      <div className="time-grid">
                        {group.slots.map((time) => {
                          const isRush = RUSH_HOURS.includes(time) && booking.locationType !== 'motel';
                          const isSelected = booking.time === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => {
                                setBooking((prev) => ({ ...prev, time }));
                                vibrate(25);
                              }}
                              className={`flex min-h-[58px] flex-col items-center justify-center rounded-xl border px-2 py-2 text-center text-sm font-semibold transition-all ${
                                isSelected
                                  ? isRush
                                    ? 'scale-[1.03] border-amber-400 bg-amber-500 text-zinc-950 shadow-lg'
                                    : 'scale-[1.03] border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                                  : isDark
                                    ? isRush
                                      ? 'border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15'
                                      : 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10'
                                    : isRush
                                      ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                                      : 'border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300'
                              }`}
                            >
                              <span>{time}</span>
                              {isRush && <span className="safe-text mt-1 text-[9px] uppercase tracking-wide">+{formatMoney(RUSH_FEE, lang)}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {booking.date && timeSlots.length === 0 && (
              <div className={`mobile-soft-card rounded-[2rem] border py-16 text-center ${isDark ? 'border-white/10 text-zinc-500' : 'border-slate-200 text-slate-400'}`}>
                <p className="safe-text px-5 text-base font-medium">{T.emptySlots}</p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-7 animate-fade-up">
            <div className={`mobile-soft-card flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border p-5 ${isDark ? 'border-blue-500/20 bg-blue-950/30' : 'border-blue-200 bg-blue-50'}`}>
              <div className="flex min-w-0 items-center gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                  <Icon name="clock" size={22} />
                </span>
                <div className="min-w-0">
                  <p className={`safe-text text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Reserva em andamento</p>
                  <p className="safe-text font-display text-xl">Finalize para enviar no WhatsApp</p>
                </div>
              </div>
              <span className={`safe-text rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-white text-slate-600'}`}>+{estimatedXP} {T.xpGuaranteed}</span>
            </div>

            <div className={`mobile-soft-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <h3 className="safe-text font-display text-2xl">{T.extrasTitle}</h3>
              <p className={`safe-text mb-5 mt-2 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{lang === 'en' ? 'Optional add-ons for your experience.' : 'Deseja deixar a experiencia mais completa?'}</p>
              <div className="responsive-card-grid">
                {DATA.extras.map((extra) => {
                  const isActive = booking.extras[extra.id];
                  const price = booking.cart.some((item) => item.type === 'pack') ? Math.floor(extra.price * 0.8) : extra.price;
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => {
                        setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }));
                        vibrate(25);
                      }}
                      className={`flex min-h-[132px] min-w-0 items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${
                        isActive ? 'border-blue-500/50 bg-blue-600/15' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex min-w-0 gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-400' : 'bg-white text-slate-500'}`}>
                          <Icon name={extra.icon} size={20} />
                        </span>
                        <div className="min-w-0">
                          <p className="safe-text font-semibold">{extra.label}</p>
                          <p className={`safe-text mt-1.5 text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{extra.desc}</p>
                        </div>
                      </div>
                      <span className={`safe-text shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] font-bold ${isActive ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-200 text-slate-700'}`}>+{formatMoney(price, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,.8fr)]">
              <div className={`mobile-soft-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h3 className="safe-text mb-6 flex items-center gap-3 font-display text-2xl">
                  <Icon name="file-text" size={24} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                  {T.summaryTitle}
                </h3>

                <div className="space-y-6">
                  <div>
                    <p className={`safe-text mb-3 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summaryItems}</p>
                    <div className="space-y-3">
                      {booking.cart.map((item) => (
                        <div key={item.id} className={`flex flex-wrap items-center justify-between gap-3 border-b pb-3 text-base font-medium last:border-0 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                          <span className="safe-text min-w-0 flex-1">{item.title}</span>
                          <span className={`price-text shrink-0 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{formatMoney(item.price, lang)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {Object.keys(booking.extras).some((key) => booking.extras[key]) && (
                    <div className={`border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                      <p className={`safe-text mb-3 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summaryExtras}</p>
                      <div className="space-y-2">
                        {Object.keys(booking.extras)
                          .filter((key) => booking.extras[key])
                          .map((key) => {
                            const extra = DATA.extras.find((item) => item.id === key);
                            if (!extra) return null;
                            const price = booking.cart.some((item) => item.type === 'pack') ? Math.floor(extra.price * 0.8) : extra.price;
                            return (
                              <div key={key} className={`flex flex-wrap justify-between gap-3 text-sm font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                                <span className="safe-text min-w-0 flex-1">{extra.label}</span>
                                <span className="price-text shrink-0">+{formatMoney(price, lang)}</span>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  <div className={`border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <p className={`safe-text mb-3 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.summaryInfo}</p>
                    <div className="space-y-3 text-base font-medium">
                      <div className={`flex min-w-0 items-start gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <Icon name="calendar" size={18} className="mt-0.5 text-blue-500" />
                        <span className="safe-text">{booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'as'} {booking.time}</span>
                      </div>
                      <div className={`flex min-w-0 items-start gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <Icon name="map-pin" size={18} className="mt-0.5 text-blue-500" />
                        <span className="safe-text">{booking.locationType === 'home' ? T.summaryLocHome : booking.locationType === 'motel' ? T.summaryLocMotel : T.summaryLocHotel}</span>
                      </div>
                      <div className={`flex min-w-0 items-start gap-3 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <Icon name="clock" size={18} className="mt-0.5 text-blue-500" />
                        <span className="safe-text">Tempo estimado: {financials.duration} min</span>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-3 border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className={`flex justify-between gap-4 text-base font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      <span className="safe-text">{T.subtotal}</span>
                      <span className="price-text shrink-0">{formatMoney(financials.sub, lang)}</span>
                    </div>
                    {booking.appliedCoupon && (
                      <div className="flex justify-between gap-4 text-base font-medium text-emerald-400">
                        <span className="safe-text flex min-w-0 items-center gap-2"><Icon name="gift" size={16} />{booking.appliedCoupon.title}</span>
                        <span className="price-text shrink-0">-{formatMoney(financials.disc, lang)}</span>
                      </div>
                    )}
                    {financials.mediaDisc > 0 && (
                      <div className="flex justify-between gap-4 text-base font-medium text-blue-400">
                        <span className="safe-text">{T.mediaDiscount}</span>
                        <span className="price-text shrink-0">-{formatMoney(financials.mediaDisc, lang)}</span>
                      </div>
                    )}
                    {financials.pixDisc > 0 && (
                      <div className={`flex justify-between gap-4 text-base font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <span className="safe-text">{T.pixDiscount}</span>
                        <span className="price-text shrink-0">-{formatMoney(financials.pixDisc, lang)}</span>
                      </div>
                    )}
                    {financials.rushFee > 0 && (
                      <div className="flex justify-between gap-4 text-base font-medium text-amber-400">
                        <span className="safe-text flex min-w-0 items-center gap-2"><Icon name="car" size={16} />{T.rushFee}</span>
                        <span className="price-text shrink-0">+{formatMoney(financials.rushFee, lang)}</span>
                      </div>
                    )}
                    <div className={`flex flex-wrap items-end justify-between gap-4 border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                      <span className={`safe-text text-sm font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.totalLabel}</span>
                      <div className="min-w-0 text-right">
                        <p className="price-text font-display text-4xl text-gradient-blue">{formatMoney(financials.total, lang)}</p>
                        <p className="safe-text mt-1 flex items-center justify-end gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-400"><Icon name="sparkles" size={12} /> +{estimatedXP} {T.xpGuaranteed}</p>
                      </div>
                    </div>
                  </div>

                  {booking.locationType !== 'motel' && (
                    <div className={`flex items-start gap-3 rounded-xl border p-4 text-sm font-medium leading-relaxed ${isDark ? 'border-white/10 bg-white/5 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                      <Icon name="car" size={18} className="mt-0.5" />
                      <span className="safe-text">{T.uberNotice}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className={`mobile-soft-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <h4 className="safe-text mb-4 flex items-center gap-3 font-semibold">
                    <Icon name="ticket" size={20} className={isDark ? 'text-zinc-500' : 'text-slate-400'} />
                    {T.couponSection}
                  </h4>
                  {user.coupons.length > 0 ? (
                    <div className="space-y-3">
                      {user.coupons.map((coupon) => (
                        <button key={coupon.id} type="button" onClick={() => setBooking((prev) => ({ ...prev, appliedCoupon: prev.appliedCoupon?.id === coupon.id ? null : coupon }))} className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left ${booking.appliedCoupon?.id === coupon.id ? 'border-emerald-500 bg-emerald-600/10 text-emerald-400' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}>
                          <span className="safe-text flex min-w-0 items-center gap-3 text-sm font-bold"><Icon name="gift" size={16} />{coupon.title}</span>
                          <span className="price-text shrink-0 text-sm">-{formatMoney(coupon.val, lang)}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`rounded-2xl border border-dashed p-5 text-center text-sm font-medium ${isDark ? 'border-white/10 text-zinc-500' : 'border-slate-300 text-slate-400'}`}>{T.couponEmpty}</div>
                  )}
                </div>

                <div className={`mobile-soft-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <div className="mb-4 flex items-start gap-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-white/10 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon name="camera" size={22} />
                    </span>
                    <div className="min-w-0">
                      <h4 className="safe-text font-semibold">{T.mediaTitle}</h4>
                      <p className={`safe-text mt-1 text-xs leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.mediaDesc}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))} className={`flex w-full flex-wrap items-center justify-between gap-3 rounded-xl border p-4 text-left text-xs font-bold uppercase tracking-widest ${booking.mediaAllowed ? 'border-blue-500/50 bg-blue-600/15 text-blue-400' : isDark ? 'border-white/10 bg-white/5 text-zinc-500 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300'}`}>
                    <span className="safe-text">{booking.mediaAllowed ? T.mediaGranted : T.mediaSupport}</span>
                    <span className={`safe-text rounded-lg px-3 py-1 ${booking.mediaAllowed ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>{T.mediaBonus}</span>
                  </button>
                </div>

                <div className={`mobile-soft-card rounded-[2rem] border p-5 ${hasErrorGlobal && !booking.payment ? 'animate-shake' : ''} ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <h4 className="safe-text mb-4 font-semibold">{T.paymentTitle}</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'pix', label: T.payPix, icon: 'smartphone' },
                      { id: 'card', label: T.payCard, icon: 'credit-card' },
                      { id: 'money', label: T.payCash, icon: 'banknote' },
                    ].map((payment) => (
                      <button
                        key={payment.id}
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, payment: payment.id }));
                          vibrate(25);
                          if (payment.id === 'pix') {
                            navigator.clipboard?.writeText(CONFIG.PIX_KEY).then(() => addToast(T.toastPixCopied)).catch(() => undefined);
                          }
                        }}
                        className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${booking.payment === payment.id ? 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/20' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'}`}
                      >
                        <Icon name={payment.icon} size={22} />
                        <span className="safe-text flex-1 text-sm font-semibold">{payment.label}</span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${booking.payment === payment.id ? 'border-white' : isDark ? 'border-white/25' : 'border-slate-300'}`}>
                          {booking.payment === payment.id && <span className="h-2.5 w-2.5 rounded-full bg-white" />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={hasErrorGlobal && !booking.termsAccepted ? 'animate-shake' : ''}>
                  <button
                    type="button"
                    onClick={() => setTermsOpen(true)}
                    className={`mobile-soft-card flex w-full items-center justify-between gap-4 rounded-[2rem] border p-5 text-left transition-all ${
                      booking.termsAccepted ? (isDark ? 'border-emerald-500/50 bg-emerald-600/15' : 'border-emerald-300 bg-emerald-50') : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${booking.termsAccepted ? 'bg-emerald-600 text-white' : isDark ? 'bg-white/10 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                        <Icon name="heart" size={22} />
                      </span>
                      <span className="min-w-0">
                        <span className="safe-text block font-semibold">{T.termsTitle}</span>
                        <span className={`safe-text mt-1 block text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.rulesRead}</span>
                      </span>
                    </span>
                    <span
                      onClick={(event) => {
                        event.stopPropagation();
                        setBooking((prev) => ({ ...prev, termsAccepted: !prev.termsAccepted }));
                      }}
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${booking.termsAccepted ? 'border-emerald-500 bg-emerald-600 text-white' : isDark ? 'border-white/25' : 'border-slate-300'}`}
                    >
                      {booking.termsAccepted && <Icon name="check" size={16} />}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-2 pt-12 text-center animate-scale-in">
            <div className="relative mb-9">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl" />
              <div className={`relative flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-emerald-500/50 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
                <Icon name="check" size={48} className="text-emerald-400" />
              </div>
            </div>
            <h2 className="safe-text font-display text-4xl">{T.successTitle}</h2>
            <p className={`safe-text mb-8 mt-3 max-w-sm text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.successSub}</p>

            <div className={`mobile-soft-card mb-8 w-full space-y-3 rounded-[2rem] border p-5 text-left ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <div className={`flex items-start gap-3 text-base font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                <Icon name="user" size={18} className="mt-1 text-blue-400" />
                <span className="safe-text">{user.name}</span>
              </div>
              <div className={`flex items-start gap-3 text-base font-medium ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                <Icon name="calendar" size={18} className="mt-1 text-blue-400" />
                <span className="safe-text">{booking.date ? new Date(booking.date).toLocaleDateString(lang === 'en' ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ''} {lang === 'en' ? 'at' : 'as'} {booking.time}</span>
              </div>
              <div className={`flex flex-wrap items-center justify-between gap-3 border-t pt-3 text-base ${isDark ? 'border-white/10 text-white' : 'border-slate-100 text-slate-900'}`}>
                <span className="safe-text text-xs font-semibold uppercase tracking-widest">{T.totalLabel}</span>
                <span className="price-text font-display text-2xl text-gradient-blue">{formatMoney(financials.total, lang)}</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <Button variant="whatsapp" size="xl" full icon="message" onClick={() => openExternal('whatsapp', generateWhatsAppMsg())}>
                {T.whatsappBtn}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setBooking((prev) => ({ ...createInitialBooking(), address: prev.address }));
                }}
                className={`safe-text w-full py-4 text-sm font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {T.backHome}
              </button>
            </div>
          </section>
        )}
      </main>

      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 pointer-events-none sticky-safe">
          <div className={`mx-auto max-w-6xl rounded-[1.65rem] border shadow-[0_-10px_40px_rgba(0,0,0,.22)] pointer-events-auto ${isDark ? 'border-zinc-700 bg-[#181c25]' : 'border-slate-300 bg-white'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-5">
              {step > 0 && (
                <button type="button" onClick={() => { setStep((prev) => prev - 1); vibrate(25); }} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white' : 'border-slate-300 bg-slate-100 text-slate-600 hover:text-slate-900'}`} aria-label="Voltar">
                  <Icon name="chevron-left" size={22} />
                </button>
              )}

              <div className="min-w-0 flex-1">
                <p className={`safe-text text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {step === 0 ? `${booking.cart.length} ${T.selectedItems}` : step === 3 ? T.totalLabel : T.subtotal}
                </p>
                <p className="price-text font-display text-lg sm:text-xl">{step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}</p>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className={`flex min-h-12 min-w-[132px] shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all sm:min-h-14 sm:px-7 sm:text-sm ${
                  isStepValid()
                    ? step === 3
                      ? 'bg-[#25D366] text-white shadow-lg shadow-green-900/40 hover:bg-[#22c55e]'
                      : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500'
                    : isDark
                      ? 'border border-zinc-700 bg-zinc-800 text-zinc-500'
                      : 'border border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                {step === 3 ? (
                  <>
                    <Icon name="message" size={18} />
                    <span className="safe-text hidden sm:inline">{T.finishBtn}</span>
                    <span className="safe-text sm:hidden">{T.finishShort}</span>
                  </>
                ) : (
                  <>
                    <span className="safe-text hidden sm:inline">{T.nextBtn}</span>
                    <span className="safe-text sm:hidden">{T.nextShort}</span>
                    <Icon name="chevron-right" size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </nav>
      )}

      {termsOpen && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/90 p-4 backdrop-blur-md animate-fade-in sm:items-center">
          <div className={`mobile-soft-card flex max-h-[85vh] w-full max-w-xl flex-col rounded-[2.25rem] border shadow-2xl animate-slide-up ${isDark ? 'border-zinc-700 bg-[#11141a]' : 'border-slate-300 bg-white'}`}>
            <div className={`flex shrink-0 items-center justify-between gap-4 border-b p-5 sm:p-7 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className="safe-text font-display text-2xl">{T.termsTitle}</h3>
              <button type="button" onClick={() => setTermsOpen(false)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`} aria-label="Fechar regras">
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-7">
              {DATA.rules.map((rule) => (
                <RuleItem key={rule.title} rule={rule} isDark={isDark} />
              ))}
            </div>
            <div className={`shrink-0 border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Button full size="xl" onClick={() => { setBooking((prev) => ({ ...prev, termsAccepted: true })); setTermsOpen(false); vibrate(25); }}>
                {T.agreeTerms}
              </Button>
            </div>
          </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/90 p-5 backdrop-blur-md animate-fade-in sm:items-center">
          <div className={`mobile-soft-card w-full max-w-md rounded-[2.25rem] border p-7 shadow-2xl animate-scale-in sm:p-9 ${isDark ? 'border-zinc-700 bg-[#11141a]' : 'border-slate-300 bg-white'}`}>
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400' : 'border border-blue-200 bg-blue-50 text-blue-600'}`}>
              <Icon name="gift" size={30} />
            </div>
            <h3 className="safe-text font-display text-3xl">{lang === 'en' ? 'Welcome!' : 'Que bom ter voce aqui!'}</h3>
            <p className={`safe-text mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{lang === 'en' ? 'Take this first gift for your care journey.' : 'Pegue este presente inaugural para sua jornada de cuidado.'}</p>
            <div className={`my-6 rounded-2xl border border-dashed p-5 text-center ${isDark ? 'border-blue-500/40 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
              <p className={`safe-text text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{lang === 'en' ? 'Your first gift' : 'Seu presente'}</p>
              <p className="safe-text mt-2 font-display text-3xl tracking-widest">BEMVINDO10</p>
            </div>
            <Button
              full
              size="xl"
              onClick={() => {
                const coupon: Coupon = { id: 'welcome', val: 10, title: 'BEMVINDO10', code: 'BEMVINDO10' };
                setWelcomePopup(false);
                setUser((prev) => ({ ...prev, hasSeenWelcome: true, coupons: prev.coupons.some((item) => item.id === coupon.id) ? prev.coupons : [...prev.coupons, coupon] }));
                setBooking((prev) => ({ ...prev, appliedCoupon: coupon }));
                addToast(T.toastCouponSuccess);
              }}
            >
              {lang === 'en' ? 'Claim Gift' : 'Pegar presente'}
            </Button>
          </div>
        </div>
      )}

      {levelUpPopup && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md animate-fade-in">
          <div className={`mobile-soft-card w-full max-w-md rounded-[2.25rem] border p-8 text-center shadow-2xl animate-scale-in ${isDark ? 'border-amber-700/50 bg-[#11141a]' : 'border-amber-300 bg-white'}`}>
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 text-zinc-950 shadow-xl shadow-amber-500/30">
              <Icon name="trophy" size={36} />
            </div>
            <h3 className="safe-text font-display text-4xl">{lang === 'en' ? 'Level Up!' : 'Voce subiu de nivel!'}</h3>
            <p className={`safe-text mb-7 mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{lang === 'en' ? 'A new benefit was unlocked.' : 'Um novo beneficio foi desbloqueado.'}</p>
            <Button full size="xl" variant="amber" onClick={() => setLevelUpPopup(false)}>
              {lang === 'en' ? 'See Reward' : 'Ver recompensa'}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
