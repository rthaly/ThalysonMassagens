import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/relaxarhojesp',
  PROFILE_PHOTO_URL: 'https://i.ibb.co/gZxp3Dwz/Screenshot-1.png',
  STORAGE_KEY: '@thaly_app_v27_premium_plans',
  PIX_KEY: '62.922.530/0001-14',
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5,
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_FEE: 15,
  MAX_STORAGE_KB: 4500,
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];

type Lang = 'pt' | 'en';
type Category = 'express' | 'relax' | 'premium' | 'care';
type LocationType = 'home' | 'motel' | 'hotel';
type PaymentMethod = '' | 'pix' | 'card' | 'cash';
type Step = 0 | 1 | 2 | 3 | 4;

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  details: string[];
  tag: string;
  icon: string;
  min: number;
  price: number;
  category?: Category;
  type?: 'pack';
  fullPrice?: number;
  savings?: number;
  highlight?: boolean;
}

interface ExtraItem {
  id: string;
  label: string;
  desc: string;
  icon: string;
  price: number;
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
  payment: PaymentMethod;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  mediaAllowed: boolean;
}

interface Toast {
  id: number;
  msg: string;
  type: 'success' | 'error';
}

const ICON_PATHS: Record<string, string> = {
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2zm8 13V8m0 0V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2c0 2 2 3 6 3zm0 0V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2c0 2-2 3-6 3z',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z',
  bed: 'M3 5v14M3 13h18M21 19v-6a4 4 0 0 0-4-4H9v4M7 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  building: 'M4 22V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M4 22h16M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  map: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  card: 'M3 10h18M7 15h.01M11 15h2M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  cash: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  ticket: 'M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z',
  package: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96 12 12l8.73-5.04M12 22V12',
  sparkles: 'M12 2l1.6 5.1a2 2 0 0 0 1.3 1.3L20 10l-5.1 1.6a2 2 0 0 0-1.3 1.3L12 18l-1.6-5.1a2 2 0 0 0-1.3-1.3L4 10l5.1-1.6a2 2 0 0 0 1.3-1.3L12 2zM19 3v4M21 5h-4M5 17v3M6.5 18.5h-3',
  scissors: 'M6 9l6 6 6-6M6 20a3 3 0 0 1-3-3v-6l6 6v3zM18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8z',
  sun: 'M12 3v1M12 20v1M3 12h1M20 12h1M18.4 5.6l-.8.8M6.4 17.6l-.8.8M5.6 5.6l.8.8M17.6 17.6l.8.8M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  star: 'M12 2l3.1 6.3 6.9 1-5 4.8 1.2 6.9-6.2-3.3L5.8 21 7 14.1 2 9.3l6.9-1L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  message: 'M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z',
  left: 'M15 18l-6-6 6-6',
  right: 'M9 18l6-6-6-6',
  instagram: 'M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  hand: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  zap: 'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
  watch: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  refresh: 'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15',
  award: 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
};

const sanitizeInput = (value: string, max = 120) => String(value || '').replace(/[<>&"']/g, '').slice(0, max);
const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const emptyAddress = (): Address => ({ cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' });
const validateAddress = (address: Address) => Boolean(address.street && address.number && address.district && address.city);

const createInitialBooking = (): BookingData => ({
  type: 'single',
  cart: [],
  extras: {},
  date: null,
  time: null,
  locationType: 'home',
  address: emptyAddress(),
  payment: '',
  appliedCoupon: null,
  termsAccepted: false,
  mediaAllowed: false,
});

const createInitialUser = (): UserData => ({
  name: '',
  xp: 0,
  coupons: [],
  usedCoupons: [],
  hasSeenWelcome: false,
  ordersCount: 92,
  lastActivity: new Date().toISOString(),
});

const vibrate = (pattern: number | number[] = 24) => {
  try {
    const nav = navigator as Navigator & { vibrate?: (value: number | number[]) => boolean };
    nav.vibrate?.(pattern);
  } catch {
    // Browser may not support vibration.
  }
};

const unlockPageScroll = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.overflow = '';
  document.documentElement.style.touchAction = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
};

const formatMoney = (value: number, lang: Lang) => {
  const amount = Number.isFinite(value) ? value : 0;
  const converted = lang === 'pt' ? amount : amount / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
    maximumFractionDigits: 2,
  }).format(converted);
};

const dateToInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getData = (lang: Lang) => {
  const isEn = lang === 'en';
  const welcomeCoupon: Coupon = { id: 'welcome', val: 10, title: 'BEMVINDO10', code: 'BEMVINDO10' };

  const services: ServiceItem[] = [
    {
      id: 'pes',
      category: 'express',
      min: 40,
      price: 110,
      icon: 'user',
      tag: isEn ? 'FOOT RELIEF' : 'ALÍVIO NOS PÉS',
      title: isEn ? 'Foot Massage' : 'Massagem nos Pés',
      desc: isEn ? 'Focused relief for tired feet, swelling and end-of-day heaviness.' : 'Alívio direto para pés cansados, inchados ou pesados depois de um dia longo.',
      details: isEn ? ['Foot reflexology on the sole', 'Pressure points for accumulated tension', 'Ankles and instep mobility', 'Light finish to leave the body lighter'] : ['Reflexologia focada na sola dos pés', 'Pressão em pontos de tensão acumulada', 'Mobilidade nos tornozelos e peito do pé', 'Finalização leve para deixar o corpo mais solto'],
    },
    {
      id: 'maos',
      category: 'express',
      min: 40,
      price: 110,
      icon: 'hand',
      tag: isEn ? 'HAND RELIEF' : 'ALÍVIO NAS MÃOS',
      title: isEn ? 'Hand Massage' : 'Massagem nas Mãos',
      desc: isEn ? 'Relief for hands, wrists and forearms after typing, driving or repetitive work.' : 'Alívio para mãos, punhos e antebraços depois de digitar, dirigir ou trabalhar usando força.',
      details: isEn ? ['Finger mobility', 'Palm and wrist pressure', 'Forearm release', 'Calm finish for joint comfort'] : ['Mobilidade dos dedos', 'Pressão na palma e nos punhos', 'Liberação dos antebraços', 'Finalização calma para conforto das articulações'],
    },
    {
      id: 'relaxante',
      category: 'relax',
      min: 40,
      price: 157,
      icon: 'sun',
      tag: isEn ? 'FULL BODY' : 'CORPO TODO',
      title: isEn ? 'Classic Massage' : 'Massagem Clássica',
      desc: isEn ? 'A full-body relaxing massage for muscle tension, stress and heavy shoulders, without intimate touch.' : 'Massagem relaxante no corpo todo para aliviar tensão, estresse, costas pesadas e cansaço físico, sem toques íntimos.',
      details: isEn ? ['Full-body relaxing massage', 'Back, shoulders, neck, legs, arms and feet', 'Slow therapeutic rhythm with pressure adjusted to your body', 'No intimate touch: the focus is relaxation, relief and well-being'] : ['Massagem relaxante no corpo todo', 'Costas, ombros, pescoço, pernas, braços e pés', 'Ritmo terapêutico calmo, com pressão ajustada ao seu corpo', 'Sem toques íntimos: o foco é relaxamento, alívio e bem-estar'],
      highlight: true,
    },
    {
      id: 'crossfit',
      category: 'relax',
      min: 60,
      price: 187,
      icon: 'shield',
      tag: isEn ? 'RECOVERY' : 'RECUPERAÇÃO',
      title: isEn ? 'Sports Massage' : 'Massagem para Atletas',
      desc: isEn ? 'Starts with a classic relaxing base and evolves into firmer work for overloaded muscles.' : 'Começa com a base da clássica relaxante e evolui para uma pegada mais firme em músculos sobrecarregados.',
      details: isEn ? ['Classic full-body relaxing start', 'Firmer work on locked areas', 'Back, legs, glutes, shoulders and arms according to your tension', 'Mobility and muscle relief for people who train hard'] : ['Início com massagem clássica relaxante no corpo todo', 'Trabalho mais firme nas áreas travadas', 'Costas, pernas, glúteos, ombros e braços conforme sua tensão', 'Mobilidade e alívio muscular para quem treina pesado'],
    },
    {
      id: 'sensitiva',
      category: 'premium',
      min: 60,
      price: 177,
      icon: 'sparkles',
      tag: isEn ? 'SENSORY' : 'SENSORIAL',
      title: isEn ? 'Sensory Massage' : 'Massagem Sensorial',
      desc: isEn ? 'A gradual sensory session: first the body relaxes, then the touch becomes softer, slower and more stimulating.' : 'Sessão sensorial gradual: primeiro o corpo relaxa, depois o toque fica mais leve, lento e estimulante.',
      details: isEn ? ['Begins with classic full-body relaxing massage', 'Soft sensory touch designed to create shivers and reduce anxiety', 'The rhythm builds slowly, with clarity, consent and respect for your limits', 'Manual lingam finish to release accumulated tension'] : ['Começa com massagem clássica relaxante no corpo todo', 'Depois entram toques sensoriais leves, pensados para arrepiar e diminuir a ansiedade', 'O ritmo cresce aos poucos, com clareza, consentimento e respeito aos seus limites', 'Finalização lingam manual para liberar a tensão acumulada'],
    },
    {
      id: 'mista',
      category: 'premium',
      min: 60,
      price: 207,
      icon: 'heart',
      tag: isEn ? 'FUSION' : 'FUSION',
      title: isEn ? 'Fusion Experience' : 'Experiência Fusion',
      desc: isEn ? 'A complete session that blends full-body relaxation, sensory presence and intimate warmth with the therapist in underwear.' : 'Sessão completa que une massagem relaxante no corpo todo, presença sensorial e clima mais íntimo com atendimento de cueca.',
      details: isEn ? ['Starts with classic relaxing massage to release the body', 'Front and back body care, with gradual sensory rhythm', 'Beard glide across the body, both back and front, according to comfort and consent', 'Manual lingam finish at the end of the experience'] : ['Começa com massagem clássica relaxante para soltar o corpo', 'Cuida da parte de trás e da frente do corpo, com ritmo sensorial gradual', 'Deslizamento da barba pelo corpo, de costas e de frente, conforme conforto e consentimento', 'Finalização lingam manual no encerramento da experiência'],
      highlight: true,
    },
    {
      id: 'nuru',
      category: 'premium',
      min: 60,
      price: 317,
      icon: 'star',
      tag: isEn ? 'PREMIUM' : 'PREMIUM',
      title: isEn ? 'Nuru Massage' : 'Massagem Nuru',
      desc: isEn ? 'Premium body-to-body experience with glide gel, both nude, designed for deep surrender and complete sensory release.' : 'Experiência premium corpo a corpo com gel de deslizamento, ambos nus, pensada para entrega profunda e liberação sensorial completa.',
      details: isEn ? ['Starts with classic relaxing massage to prepare the body', 'Application of glide gel, not heated gel', 'Body-to-body sliding contact, front and back, with both nude', 'Includes beard glide and manual lingam finish'] : ['Começa com massagem clássica relaxante para preparar o corpo', 'Aplicação de gel de deslizamento, não gel aquecido', 'Contato corpo a corpo com deslizamento, de frente e de costas, ambos nus', 'Inclui deslizamento da barba e finalização lingam manual'],
    },
    {
      id: 'depilacao',
      category: 'care',
      min: 60,
      price: 107,
      icon: 'scissors',
      tag: isEn ? 'CARE' : 'ESTÉTICA',
      title: isEn ? 'Full Body Trim' : 'Aparo de Pelos do Corpo',
      desc: isEn ? 'Practical body care for a cleaner, lighter and more comfortable feel before or after the session.' : 'Cuidado corporal prático para uma sensação mais limpa, leve e confortável antes ou depois da sessão.',
      details: isEn ? ['Clipper trim in selected areas', 'Chest, abdomen, back, legs or other agreed areas', 'Careful finish with privacy', 'Ideal for comfort, aesthetics and a cleaner body feel'] : ['Aparo com máquina em áreas escolhidas', 'Peito, abdômen, costas, pernas ou outras áreas combinadas', 'Acabamento cuidadoso com privacidade', 'Ideal para conforto, estética e sensação de corpo mais limpo'],
    },
  ];

  const plans: ServiceItem[] = [
    {
      id: 'pack_basic',
      type: 'pack',
      min: 60,
      title: isEn ? 'Routine Relief (2x)' : 'Alívio de Rotina (2x)',
      price: 247,
      fullPrice: 284,
      savings: 37,
      desc: isEn ? 'For those who stand or type a lot. Includes a relaxing bonus.' : 'Para quem trabalha de pé ou digitando. Inclui um bônus relaxante grátis.',
      details: isEn ? ['1x Foot Massage', '1x Classic Massage', 'Bonus: free aromatherapy in both sessions', 'Two separate appointments for quick, aromatic relief'] : ['1x Massagem nos Pés', '1x Massagem Clássica', 'Bônus: aromaterapia grátis nas duas sessões', 'Duas semanas garantidas de alívio rápido e aromático'],
      tag: 'RELAX',
      icon: 'watch',
    },
    {
      id: 'pack_essencial',
      type: 'pack',
      min: 60,
      title: isEn ? 'Survival Kit (2x)' : 'Kit Sobrevivência (2x)',
      price: 297,
      fullPrice: 334,
      savings: 37,
      desc: isEn ? 'Two sessions in the month: one to remove body pain and one to calm the mind.' : 'O básico essencial. Duas sessões no mês: um dia para tirar dores, outro para aliviar a mente.',
      details: isEn ? ['1x Classic Massage for muscle relief', '1x Sensory Massage for mental decompression', 'Separate appointments during the month', 'Ideal for keeping your routine from overwhelming you'] : ['1x Massagem Clássica para tirar dores e nós musculares', '1x Massagem Sensorial para esvaziar a cabeça com toques e prazer', 'Sessões agendadas separadamente no mês', 'Ideal para garantir que você não surte com a rotina'],
      tag: isEn ? 'PERFECT SLEEP' : 'DURMA BEM',
      icon: 'layers',
      highlight: true,
    },
    {
      id: 'pack_glow',
      type: 'pack',
      min: 60,
      title: isEn ? 'Full Renewal (2x)' : 'Renovação Completa (2x)',
      price: 327,
      fullPrice: 391,
      savings: 64,
      desc: isEn ? 'A day for aesthetics and a day for pleasure. With a time bonus.' : 'Dia de cuidar da estética e dia de ter muito prazer. Com bônus de tempo.',
      details: isEn ? ['1x Full Body Trim', '1x Fusion Experience', 'Bonus: +30 free minutes in the Fusion session', 'Ideal for confidence, body care and stress relief'] : ['1x Aparo de Pelos do Corpo', '1x Experiência Fusion', 'Bônus: +30 minutos extras grátis na sessão Fusion', 'Ideal para elevar a autoestima, ficar limpo e aliviar o estresse'],
      tag: 'GLOW UP',
      icon: 'sparkles',
    },
    {
      id: 'pack_muscle',
      type: 'pack',
      min: 60,
      title: isEn ? 'Recovery Combo (2x)' : 'Combo Recuperação (2x)',
      price: 347,
      fullPrice: 408,
      savings: 61,
      desc: isEn ? 'Focused on people who train hard and deal with intense muscle pain.' : 'Focado em quem treina pesado e sofre com dores musculares intensas.',
      details: isEn ? ['2x Sports Massage', 'Bonus: extra pain focus included', 'Two appointments dedicated to heavy physical recovery', 'Ideal for back, legs, shoulders and post-training tension'] : ['2x Massagem para Atletas', 'Bônus: foco extra em dores incluso', 'Duas sessões totalmente dedicadas à recuperação física pesada', 'Ideal para costas, pernas, ombros e tensão pós-treino'],
      tag: isEn ? 'MUSCLE' : 'MÚSCULOS',
      icon: 'zap',
    },
    {
      id: 'pack_interativo',
      type: 'pack',
      min: 60,
      title: isEn ? 'Real Connection (2x)' : 'Combo Conexão (2x)',
      price: 387,
      fullPrice: 467,
      savings: 80,
      desc: isEn ? 'For those who need human warmth, presence and a more intimate monthly experience.' : 'Para quem precisa de contato humano real, presença e intimidade em dois encontros no mês.',
      details: isEn ? ['1x Fusion Experience', '1x Reverse Massage', 'Separate appointments so you have something to look forward to', 'Focus on warmth, attention and human connection'] : ['1x Experiência Fusion', '1x Massagem Reversa', 'Sessões marcadas em dias diferentes para você ter o que esperar no mês', 'Foco em calor humano, atenção exclusiva e conexão'],
      tag: isEn ? 'HUMAN WARMTH' : 'MAIS CALOR HUMANO',
      icon: 'heart',
    },
    {
      id: 'pack_premium',
      type: 'pack',
      min: 60,
      title: isEn ? 'Boss Plan (3x)' : 'Mensalidade do Chefe (3x)',
      price: 637,
      fullPrice: 721,
      savings: 84,
      desc: isEn ? 'Three premium weeks with the most intense and requested sessions.' : 'Você trabalha demais, merece um tratamento VIP. Três semanas do mês com minhas experiências mais intensas.',
      details: isEn ? ['1x Naturist/Classic style session', '1x Fusion Experience', '1x Nuru Massage', 'Three VIP appointments to keep the month lighter and less stressful'] : ['1x sessão estilo Naturista/Clássica', '1x Experiência Fusion', '1x Massagem Nuru', 'Três encontros VIP para garantir um mês mais leve e sem tanto estresse'],
      tag: isEn ? 'VIP MONTH' : 'TRATAMENTO DE REI',
      icon: 'award',
    },
    {
      id: 'pack_ultimate',
      type: 'pack',
      min: 60,
      title: isEn ? 'Pleasure Journey (3x)' : 'Jornada do Prazer (3x)',
      price: 657,
      fullPrice: 778,
      savings: 121,
      desc: isEn ? 'Total immersion: three weeks escalating the level of intimacy and sensory surrender.' : 'A imersão total: três semanas escalando o nível de intimidade, prazer e entrega sensorial.',
      details: isEn ? ['1x Sensory Massage', '1x Fusion Experience', '1x Nuru Massage', 'Bonus: Organic Interaction included in the three appointments'] : ['1x Massagem Sensorial', '1x Experiência Fusion', '1x Massagem Nuru', 'Bônus: Liberdade para Tocar inclusa nos 3 encontros'],
      tag: 'PREMIUM',
      icon: 'heart',
    },
  ];

  const extras: ExtraItem[] = [
    { id: 'hair_trim', price: 57, icon: 'scissors', label: isEn ? 'Trim Extra' : 'Aparo de Pelos', desc: isEn ? 'Body hair trim in up to two selected areas, with privacy and a cleaner finish.' : 'Aparo de pelos com máquina em até 2 áreas do corpo, com privacidade e acabamento mais limpo.' },
    { id: 'more_time', price: 77, icon: 'clock', label: isEn ? 'Extended Time (+30m)' : 'Mais 30 Minutos', desc: isEn ? 'Adds 30 minutes so the session can breathe, slow down and finish without rush.' : 'Adiciona 30 minutos para a sessão respirar, desacelerar e terminar sem pressa.' },
    { id: 'touch', price: 77, icon: 'hand', label: isEn ? 'Organic Interaction' : 'Liberdade para Tocar', desc: isEn ? 'Allows more active participation and reciprocal touch during the experience, always with consent.' : 'Permite participação mais ativa e toques recíprocos durante a experiência, sempre com consentimento.' },
    { id: 'aroma', price: 17, icon: 'sparkles', label: isEn ? 'Deep Aromatherapy' : 'Aromaterapia', desc: isEn ? 'Essential oils in the environment and body to lower the rhythm and deepen relaxation.' : 'Óleos essenciais no ambiente e no corpo para baixar o ritmo e aprofundar o relaxamento.' },
    { id: 'pain_relief', price: 17, icon: 'shield', label: isEn ? 'Extra Pain Focus' : 'Alívio de Dores Fortes', desc: isEn ? 'Extra attention to locked areas with stronger, slower pressure according to your comfort.' : 'Atenção extra nas áreas travadas com pressão mais firme e lenta, conforme seu conforto.' },
    { id: 'dominador', price: 180, icon: 'zap', label: isEn ? 'Active & Dominant' : 'Postura Dominadora', desc: isEn ? 'A more active, commanding and intense posture in the final part of the session.' : 'Uma postura mais ativa, dominante e intensa na parte final do encontro.' },
    { id: 'oral', price: 120, icon: 'heart', label: isEn ? 'Oral Included' : 'Estímulo Oral', desc: isEn ? 'Adds oral stimulation to the final part of the experience, with consent and hygiene.' : 'Inclui estímulo oral na parte final da experiência, com consentimento e higiene.' },
    { id: 'beijos', price: 77, icon: 'heart', label: isEn ? 'Kisses Included' : 'Beijos e Intimidade', desc: isEn ? 'Kisses and more affectionate physical connection during the sensory part of the session.' : 'Beijos e conexão física mais afetuosa durante a parte sensorial da sessão.' },
    { id: 'prostatico', price: 120, icon: 'star', label: isEn ? 'Prostatic Massage' : 'Massagem Prostática', desc: isEn ? 'Internal prostatic stimulation with lubricant, only with explicit consent and clear limits.' : 'Estimulação prostática interna com lubrificante, somente com consentimento explícito e limites claros.' },
  ];

  return {
    welcomeCoupon,
    services,
    plans,
    extras,
    categories: [
      { id: 'express' as Category, title: isEn ? 'Quick relief' : 'Alívio rápido', desc: isEn ? 'Short, objective sessions.' : 'Sessões curtas e objetivas.' },
      { id: 'relax' as Category, title: isEn ? 'Relax and recover' : 'Relaxar e recuperar', desc: isEn ? 'Full-body relaxing base, muscle relief and recovery.' : 'Base relaxante no corpo todo, alívio muscular e recuperação.' },
      { id: 'premium' as Category, title: isEn ? 'Premium experiences' : 'Experiências premium', desc: isEn ? 'Sensory sessions with clear flow, consent and complete finish.' : 'Sessões sensoriais com fluxo claro, consentimento e finalização completa.' },
      { id: 'care' as Category, title: isEn ? 'Personal care' : 'Cuidados pessoais', desc: isEn ? 'Simple body care add-ons.' : 'Cuidados simples para o corpo.' },
    ],
    rules: [
      isEn ? 'Take a shower before the appointment.' : 'Tome uma ducha antes do atendimento.',
      isEn ? 'Respect, clarity and consent are required.' : 'Respeito, clareza e consentimento são obrigatórios.',
      isEn ? 'Confirm you are healthy and without contagious conditions.' : 'Confirme que está saudável e sem condições contagiosas.',
      isEn ? 'Travel fee is confirmed on WhatsApp.' : 'A taxa de deslocamento é confirmada no WhatsApp.',
    ],
    text: {
      brand: 'Thalyson Massagens',
      professional: isEn ? 'Massage Technician' : 'Técnico em Massagens',
      attended: isEn ? 'men already served' : 'homens já atendidos',
      welcome: isEn ? 'Welcome,' : 'Bem-vindo,',
      welcomeAnon: isEn ? 'allow yourself to slow down.' : 'permita-se relaxar.',
      chooseSub: isEn ? 'Choose the service, location and best time. The final confirmation happens on WhatsApp.' : 'Escolha o serviço, local e horário. A confirmação final acontece pelo WhatsApp.',
      tabSingle: isEn ? 'Single sessions' : 'Sessões avulsas',
      tabPacks: isEn ? 'Monthly plans' : 'Planos mensais',
      continue: isEn ? 'Continue' : 'Continuar',
      finish: isEn ? 'Complete booking' : 'Finalizar agendamento',
      back: isEn ? 'Back' : 'Voltar',
      remove: isEn ? 'Remove' : 'Remover',
      select: isEn ? 'Select' : 'Selecionar',
      selected: isEn ? 'Selected' : 'Selecionado',
      name: isEn ? 'Your name or nickname' : 'Seu nome ou apelido',
      locationTitle: isEn ? 'Where will the session happen?' : 'Onde será o atendimento?',
      locationSub: isEn ? 'A simple flow: identify yourself and choose the place.' : 'Fluxo simples: informe seu nome e escolha o local.',
      whenTitle: isEn ? 'Choose date and time' : 'Escolha data e horário',
      whenSub: isEn ? 'Only available future times appear for today.' : 'Hoje aparecem apenas horários futuros.',
      summaryTitle: isEn ? 'Review your booking' : 'Revise seu agendamento',
      summarySub: isEn ? 'Add extras, apply benefits and choose payment.' : 'Adicione extras, aplique benefícios e escolha o pagamento.',
      extrasTitle: isEn ? 'Optional add-ons' : 'Complementos opcionais',
      couponTitle: isEn ? 'Available benefit' : 'Benefício disponível',
      couponEmpty: isEn ? 'No benefit available now.' : 'Nenhum benefício disponível agora.',
      paymentTitle: isEn ? 'Payment method' : 'Forma de pagamento',
      termsTitle: isEn ? 'Session agreement' : 'Regras do atendimento',
      acceptTerms: isEn ? 'I read and agree' : 'Li e aceito as regras',
      total: isEn ? 'Total' : 'Total',
      subtotal: isEn ? 'Subtotal' : 'Subtotal',
      discount: isEn ? 'Coupon' : 'Cupom',
      pixDiscount: isEn ? 'Pix discount' : 'Desconto Pix',
      mediaDiscount: isEn ? 'Portfolio discount' : 'Desconto Portfólio',
      rushFee: isEn ? 'Rush fee' : 'Taxa de pico',
      duration: isEn ? 'Duration' : 'Duração',
      home: isEn ? 'Residence' : 'Residência',
      motel: isEn ? 'Private suite' : 'Minha suíte',
      hotel: isEn ? 'Hotel' : 'Hotel',
      cep: isEn ? 'ZIP Code / CEP' : 'CEP do local',
      street: isEn ? 'Street or avenue' : 'Rua ou avenida',
      number: isEn ? 'Number' : 'Número',
      district: isEn ? 'Neighborhood' : 'Bairro',
      city: isEn ? 'City' : 'Cidade',
      comp: isEn ? 'Apt, block, room' : 'Complemento ou quarto',
      hotelName: isEn ? 'Hotel name' : 'Nome do hotel',
      pix: isEn ? 'Pix — 3% off' : 'Pix — 3% OFF',
      card: isEn ? 'Card' : 'Cartão',
      cash: isEn ? 'Cash' : 'Dinheiro',
      mediaTitle: isEn ? 'Support my portfolio' : 'Apoiar meu portfólio',
      mediaDesc: isEn ? 'Allow anonymous aesthetic photos and get 1% off.' : 'Permitir fotos estéticas anônimas e ganhar 1% OFF.',
      toastCart: isEn ? 'Selection updated.' : 'Seleção atualizada.',
      toastCoupon: isEn ? 'Benefit applied.' : 'Benefício aplicado.',
      toastCouponRemoved: isEn ? 'Benefit removed.' : 'Benefício removido.',
      toastName: isEn ? 'Fill in your name.' : 'Preencha seu nome corretamente.',
      toastAddr: isEn ? 'Fill in the full location.' : 'Preencha o local completo.',
      toastDate: isEn ? 'Choose date and time.' : 'Selecione data e horário.',
      toastPayment: isEn ? 'Choose payment and accept the rules.' : 'Escolha pagamento e aceite as regras.',
      toastCepFound: isEn ? 'Address loaded.' : 'Endereço encontrado pelo CEP.',
      toastCepError: isEn ? 'ZIP code not found.' : 'CEP não encontrado.',
      toastPix: isEn ? 'PIX key copied.' : 'Chave PIX copiada.',
      toastNeedService: isEn ? 'Select at least one service.' : 'Selecione pelo menos um serviço.',
      successTitle: isEn ? 'Almost there!' : 'Tudo certo! Falta pouco',
      successSub: isEn ? 'WhatsApp opened with your booking message.' : 'O WhatsApp abriu com a mensagem do pedido.',
      whatsapp: isEn ? 'Open WhatsApp again' : 'Abrir WhatsApp novamente',
      startOver: isEn ? 'Start over' : 'Voltar ao início',
      today: isEn ? 'TODAY' : 'HOJE',
      tomorrow: isEn ? 'TOMORROW' : 'AMANHÃ',
      claimGift: isEn ? 'Get benefit' : 'Pegar benefício',
      giftText: isEn ? 'First visit benefit available for you.' : 'Benefício de primeira visita disponível para você.',
      serviceDetails: isEn ? 'What is included' : 'O que está incluso',
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
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d={ICON_PATHS[name] || ICON_PATHS.star} />
  </svg>
));
Icon.displayName = 'Icon';

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; min-width: 0; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        :root {
          --font-sans: 'Poppins', sans-serif;
          --c-bg: ${isDark ? '#0e1117' : '#f7f3ee'};
          --c-surface: ${isDark ? '#161b24' : '#ffffff'};
          --c-soft: ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(15,23,42,0.04)'};
          --c-border: ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(15,23,42,0.12)'};
          --c-text: ${isDark ? '#f4f1ea' : '#172033'};
          --c-muted: ${isDark ? '#a6a29a' : '#64748b'};
          --c-blue: #3b82f6;
        }
        html, body, #root { min-height: 100%; }
        html, body { width: 100%; overflow-x: hidden; overflow-y: auto; touch-action: pan-y; background: var(--c-bg); color: var(--c-text); font-family: var(--font-sans); line-height: 1.5; -webkit-tap-highlight-color: transparent; }
        body { min-width: 320px; margin: 0; }
        button, input { font: inherit; }
        button { cursor: pointer; }
        button:disabled { cursor: not-allowed; }
        img, svg { max-width: 100%; }
        .safe-text { overflow-wrap: anywhere; word-break: normal; }
        .price-text { max-width: 100%; overflow-wrap: anywhere; line-height: 1.05; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(.96); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes toastIn { from { transform: translateY(-14px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-fade-up { animation: fadeUp .35s cubic-bezier(.16, 1, .3, 1) both; }
        .animate-fade-in { animation: fadeIn .22s ease both; }
        .animate-scale-in { animation: scaleIn .24s cubic-bezier(.34, 1.56, .64, 1) both; }
        .animate-toast-in { animation: toastIn .24s cubic-bezier(.34, 1.56, .64, 1) both; }
        .animate-spin { animation: spin .7s linear infinite; }
        .text-gradient-blue { background: linear-gradient(135deg, #60a5fa, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .app-grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: 1rem; }
        .responsive-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr)); gap: .9rem; }
        .time-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(76px, 1fr)); gap: .65rem; }
        @media (min-width: 1024px) { .app-grid { grid-template-columns: minmax(0, 1fr) 360px; align-items: start; } }
        @media (max-width: 640px) { .mobile-card { border-radius: 1.35rem !important; } .sticky-safe { padding-bottom: max(1rem, env(safe-area-inset-bottom)); } }
      `,
    }}
  />
));
GlobalStyles.displayName = 'GlobalStyles';

const Button = memo(
  ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    full = false,
    icon,
    loading = false,
    className = '',
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'whatsapp' | 'outline' | 'amber' | 'ghost';
    disabled?: boolean;
    full?: boolean;
    icon?: string;
    loading?: boolean;
    className?: string;
  }) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/25',
      outline: 'border border-current text-current hover:bg-white/10',
      amber: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-900/25',
      ghost: 'text-current hover:bg-white/10',
    };

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-center text-sm font-semibold leading-tight transition-all active:scale-[.98] disabled:opacity-45 ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}
      >
        {loading ? <span className="h-5 w-5 rounded-full border-2 border-current border-t-transparent animate-spin" /> : <>{icon && <Icon name={icon} size={18} />}{children}</>}
      </button>
    );
  },
);
Button.displayName = 'Button';

const ToastStack = memo(({ toasts, isDark }: { toasts: Toast[]; isDark: boolean }) => (
  <div className="pointer-events-none fixed left-1/2 top-4 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-3 px-4">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        role="alert"
        className={`animate-toast-in pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl ${
          toast.type === 'error'
            ? 'border-red-500/50 bg-red-950 text-red-100'
            : isDark
              ? 'border-white/10 bg-[#161b24] text-white'
              : 'border-slate-200 bg-white text-slate-900'
        }`}
      >
        <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${toast.type === 'error' ? 'bg-red-800' : 'bg-emerald-500/20 text-emerald-400'}`}>
          <Icon name={toast.type === 'error' ? 'x' : 'check'} size={16} />
        </span>
        <span className="safe-text text-sm font-semibold leading-snug">{toast.msg}</span>
      </div>
    ))}
  </div>
));
ToastStack.displayName = 'ToastStack';

const InputField = memo(
  ({
    label,
    value,
    onChange,
    isDark,
    placeholder,
    type = 'text',
    icon,
    disabled = false,
    maxLength,
    error = false,
  }: {
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isDark: boolean;
    placeholder?: string;
    type?: string;
    icon?: string;
    disabled?: boolean;
    maxLength?: number;
    error?: boolean;
  }) => (
    <label className="block space-y-2">
      <span className={`safe-text block pl-1 text-[11px] font-bold uppercase tracking-widest ${error ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</span>
      <span className="relative block">
        {icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
            <Icon name={icon} size={19} />
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          autoComplete="off"
          className={`h-14 w-full rounded-2xl border text-base font-medium transition-all outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 disabled:opacity-55 ${icon ? 'pl-12 pr-4' : 'px-5'} ${
            error
              ? 'border-red-500/60 bg-red-950/20 text-red-200'
              : isDark
                ? 'border-white/10 bg-white/5 text-white placeholder:text-zinc-600'
                : 'border-slate-200 bg-white text-slate-900 placeholder:text-slate-400'
          }`}
        />
      </span>
    </label>
  ),
);
InputField.displayName = 'InputField';

const SectionHeader = memo(({ eyebrow, title, desc, isDark }: { eyebrow?: string; title: string; desc?: string; isDark: boolean }) => (
  <div className="space-y-2">
    {eyebrow && <p className="safe-text text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">{eyebrow}</p>}
    <h2 className={`safe-text text-3xl font-semibold leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h2>
    {desc && <p className={`safe-text max-w-2xl text-sm leading-relaxed sm:text-base ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{desc}</p>}
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const ServiceCard = memo(
  ({ item, selected, onOpen, isDark }: { item: ServiceItem; selected: boolean; onOpen: () => void; isDark: boolean }) => (
    <button
      type="button"
      onClick={onOpen}
      className={`mobile-card relative flex h-full min-h-[188px] min-w-0 flex-col rounded-[1.65rem] border p-4 text-left sm:p-5 transition-all hover:-translate-y-0.5 ${
        selected
          ? item.type === 'pack'
            ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/10'
            : 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-900/10'
          : isDark
            ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
      }`}
    >
      {item.highlight && !selected && <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">Popular</span>}
      <div className="flex min-w-0 items-start gap-3 pr-9 sm:gap-4 sm:pr-12">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.type === 'pack' ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
          <Icon name={item.icon} size={23} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="safe-text block text-base font-semibold leading-tight">{item.title}</span>
          <span className={`safe-text mt-2 block text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{item.desc}</span>
        </span>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        <span className={`safe-text rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${item.type === 'pack' ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>{item.tag}</span>
        <span className={`safe-text rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{item.min} min</span>
      </div>
      {selected && <span className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full ${item.type === 'pack' ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}><Icon name="check" size={16} /></span>}
    </button>
  ),
);
ServiceCard.displayName = 'ServiceCard';

const SummaryLine = memo(({ label, value, tone = 'normal' }: { label: React.ReactNode; value: React.ReactNode; tone?: 'normal' | 'success' | 'warning' }) => {
  const color = tone === 'success' ? 'text-emerald-400' : tone === 'warning' ? 'text-amber-400' : '';
  return (
    <div className={`flex justify-between gap-4 text-sm font-medium ${color}`}>
      <span className="safe-text min-w-0">{label}</span>
      <span className="price-text shrink-0 text-right">{value}</span>
    </div>
  );
});
SummaryLine.displayName = 'SummaryLine';

const ModalShell = memo(
  ({ children, onClose, isDark, max = 'max-w-xl' }: { children: React.ReactNode; onClose: () => void; isDark: boolean; max?: string }) => (
    <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md animate-fade-in sm:items-center" onMouseDown={onClose}>
      <div
        className={`mobile-card flex max-h-[90vh] w-full ${max} flex-col overflow-hidden rounded-[2rem] border shadow-2xl animate-scale-in ${isDark ? 'border-white/10 bg-[#11141a] text-white' : 'border-slate-200 bg-white text-slate-900'}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  ),
);
ModalShell.displayName = 'ModalShell';

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [activeTab, setActiveTab] = useState<'single' | 'packs'>('single');
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [user, setUser] = useState<UserData>(() => createInitialUser());
  const [booking, setBooking] = useState<BookingData>(() => createInitialBooking());

  const data = useMemo(() => getData(lang), [lang]);
  const T = data.text;
  const modalOpen = welcomeOpen || termsOpen || Boolean(selectedService);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3200);
  }, []);

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored) as Partial<{ user: Partial<UserData>; booking: Partial<BookingData>; step: Step; isDark: boolean; lang: Lang }>;

      if (parsed.user) {
        setUser((prev) => ({
          ...prev,
          ...parsed.user,
          name: sanitizeInput(parsed.user?.name || ''),
          coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
          usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
          ordersCount: Math.max(typeof parsed.user.ordersCount === 'number' ? parsed.user.ordersCount : 92, 92),
          xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
          hasSeenWelcome: Boolean(parsed.user.hasSeenWelcome),
        }));
      }

      if (parsed.booking) {
        const parsedBooking = parsed.booking;
        setBooking((prev) => ({
          ...prev,
          ...parsedBooking,
          cart: Array.isArray(parsedBooking.cart) ? parsedBooking.cart.filter((item) => item && item.id && item.title) : [],
          extras: parsedBooking.extras && typeof parsedBooking.extras === 'object' ? parsedBooking.extras : {},
          locationType: parsedBooking.locationType === 'motel' || parsedBooking.locationType === 'hotel' || parsedBooking.locationType === 'home' ? parsedBooking.locationType : 'home',
          payment: parsedBooking.payment === 'pix' || parsedBooking.payment === 'card' || parsedBooking.payment === 'cash' ? parsedBooking.payment : '',
          address: {
            ...emptyAddress(),
            ...parsedBooking.address,
            cep: sanitizeInput(parsedBooking.address?.cep || '', 9),
            street: sanitizeInput(parsedBooking.address?.street || ''),
            number: sanitizeInput(parsedBooking.address?.number || '', 20),
            district: sanitizeInput(parsedBooking.address?.district || ''),
            city: sanitizeInput(parsedBooking.address?.city || ''),
            comp: sanitizeInput(parsedBooking.address?.comp || ''),
            placeName: sanitizeInput(parsedBooking.address?.placeName || ''),
          },
        }));
      }

      if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
      if (typeof parsed.isDark === 'boolean') setIsDark(parsed.isDark);
      if (parsed.lang === 'pt' || parsed.lang === 'en') setLang(parsed.lang);
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } finally {
      window.setTimeout(() => setLoading(false), 250);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || loading) return;
    const payload = JSON.stringify({ user: { ...user, lastActivity: new Date().toISOString() }, booking, step, isDark, lang });
    if (payload.length < CONFIG.MAX_STORAGE_KB * 1024) {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, payload);
      } catch {
        // Storage can fail in private mode.
      }
    }
  }, [booking, isClient, isDark, lang, loading, step, user]);

  useEffect(() => {
    if (!isClient || loading || user.hasSeenWelcome) return;
    const timer = window.setTimeout(() => setWelcomeOpen(true), 700);
    return () => window.clearTimeout(timer);
  }, [isClient, loading, user.hasSeenWelcome]);

  useEffect(() => {
    if (!isClient) return;
    if (!modalOpen) {
      unlockPageScroll();
      return undefined;
    }
    const previous = {
      htmlOverflow: document.documentElement.style.overflow,
      htmlTouchAction: document.documentElement.style.touchAction,
      bodyOverflow: document.body.style.overflow,
      bodyTouchAction: document.body.style.touchAction,
    };
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    return () => {
      document.documentElement.style.overflow = previous.htmlOverflow;
      document.documentElement.style.touchAction = previous.htmlTouchAction;
      document.body.style.overflow = previous.bodyOverflow;
      document.body.style.touchAction = previous.bodyTouchAction;
    };
  }, [isClient, modalOpen]);

  useEffect(() => {
    if (!isClient) return;
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [isClient, step]);

  const closeAllModals = useCallback(() => {
    setWelcomeOpen(false);
    setTermsOpen(false);
    setSelectedService(null);
    window.requestAnimationFrame(unlockPageScroll);
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

  const toggleCartItem = useCallback((item: ServiceItem) => {
    vibrate();
    setBooking((prev) => {
      const exists = prev.cart.some((service) => service.id === item.id);
      let nextCart = exists ? prev.cart.filter((service) => service.id !== item.id) : [...prev.cart, item];

      if (item.type === 'pack' && !exists) {
        nextCart = nextCart.filter((service) => service.type !== 'pack' || service.id === item.id);
      }

      return {
        ...prev,
        type: nextCart.some((service) => service.type === 'pack') ? 'pack' : 'single',
        cart: nextCart,
        payment: '',
        termsAccepted: false,
      };
    });
    setSelectedService(null);
    addToast(T.toastCart);
    window.requestAnimationFrame(unlockPageScroll);
  }, [T.toastCart, addToast]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    setBooking((prev) => {
      const removing = prev.appliedCoupon?.id === coupon.id;
      window.setTimeout(() => addToast(removing ? T.toastCouponRemoved : T.toastCoupon), 0);
      return { ...prev, appliedCoupon: removing ? null : coupon };
    });
    window.requestAnimationFrame(unlockPageScroll);
  }, [T.toastCoupon, T.toastCouponRemoved, addToast]);

  const claimWelcomeCoupon = useCallback(() => {
    const coupon = data.welcomeCoupon;
    setWelcomeOpen(false);
    setUser((prev) => ({
      ...prev,
      hasSeenWelcome: true,
      coupons: prev.coupons.some((item) => item.id === coupon.id) ? prev.coupons : [...prev.coupons, coupon],
    }));
    setBooking((prev) => ({ ...prev, appliedCoupon: coupon }));
    addToast(T.toastCoupon);
    vibrate([45, 80]);
    window.requestAnimationFrame(unlockPageScroll);
  }, [T.toastCoupon, addToast, data.welcomeCoupon]);

  const handleCepChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(event.target.value);
    setBooking((prev) => ({ ...prev, address: { ...prev.address, cep: masked } }));
    if (masked.length !== 9) return;

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
      const result = await response.json();
      if (result.erro) {
        addToast(T.toastCepError, 'error');
        return;
      }
      setBooking((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          cep: masked,
          street: sanitizeInput(result.logradouro || prev.address.street),
          district: sanitizeInput(result.bairro || prev.address.district),
          city: sanitizeInput(result.localidade || prev.address.city),
        },
      }));
      addToast(T.toastCepFound);
    } catch {
      addToast(T.toastCepError, 'error');
    } finally {
      setIsFetchingCep(false);
    }
  }, [T.toastCepError, T.toastCepFound, addToast]);

  const daysArray = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      return date;
    });
  }, []);

  const getDayLabel = useCallback((date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return T.today;
    if (date.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3).toUpperCase();
  }, [T.today, T.tomorrow, lang]);

  const timeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }, (_, index) => `${String(CONFIG.START_HOUR + index).padStart(2, '0')}:00`);
    const now = new Date();
    const selectedDate = new Date(`${booking.date}T00:00:00`);
    if (Number.isNaN(selectedDate.getTime())) return [];
    if (selectedDate.toDateString() === now.toDateString()) {
      return slots.filter((time) => Number(time.split(':')[0]) > now.getHours());
    }
    return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    let subtotal = booking.cart.reduce((sum, item) => sum + item.price, 0);
    let duration = booking.cart.some((item) => item.type === 'pack') ? 60 : booking.cart.reduce((sum, item) => sum + item.min, 0);

    Object.entries(booking.extras).forEach(([id, selected]) => {
      if (!selected) return;
      const extra = data.extras.find((item) => item.id === id);
      if (!extra) return;
      const price = booking.type === 'pack' ? Math.floor(extra.price * 0.8) : extra.price;
      subtotal += price;
      if (id === 'more_time') duration += 30;
    });

    const couponDiscount = booking.appliedCoupon ? Math.min(booking.appliedCoupon.val, subtotal) : 0;
    let running = Math.max(0, subtotal - couponDiscount);
    const mediaDiscount = booking.mediaAllowed ? Math.ceil(running * 0.01) : 0;
    running = Math.max(0, running - mediaDiscount);
    const pixDiscount = booking.payment === 'pix' ? Math.ceil(running * 0.03) : 0;
    const rushFee = RUSH_HOURS.includes(booking.time || '') && booking.locationType !== 'motel' ? CONFIG.RUSH_FEE : 0;
    const total = Math.max(0, running - pixDiscount) + rushFee;

    return { subtotal, couponDiscount, mediaDiscount, pixDiscount, rushFee, total, duration };
  }, [booking, data.extras]);

  const estimatedXP = useMemo(() => Math.floor(financials.total * (booking.type === 'pack' ? 0.3 : 0.15)), [booking.type, financials.total]);

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

  const bookingMessage = useMemo(() => {
    const isEn = lang === 'en';
    const date = booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(isEn ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const items = booking.cart.map((item) => `- ${item.title} (${formatMoney(item.price, lang)})`).join('\n');
    const extras = Object.entries(booking.extras)
      .filter(([, selected]) => selected)
      .map(([id]) => data.extras.find((extra) => extra.id === id)?.label)
      .filter(Boolean)
      .map((label) => `+ ${label}`)
      .join('\n');

    const location = booking.locationType === 'home'
      ? `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}${booking.address.comp ? ` - ${booking.address.comp}` : ''}`
      : booking.locationType === 'hotel'
        ? `${booking.address.placeName}, ${booking.address.city}${booking.address.comp ? ` - ${booking.address.comp}` : ''}`
        : isEn
          ? 'Private suite, address confirmed on WhatsApp'
          : 'Suíte privada, endereço confirmado pelo WhatsApp';

    return `${isEn ? '*CARE BOOKING*' : '*PEDIDO DE AGENDAMENTO*'}\n\n${isEn ? 'Name' : 'Nome'}: ${sanitizeInput(user.name)}\n${isEn ? 'Date' : 'Data'}: ${date} ${isEn ? 'at' : 'às'} ${booking.time}\n${isEn ? 'Duration' : 'Tempo estimado'}: ${financials.duration} min\n\n${isEn ? 'Services' : 'Serviços'}:\n${items}\n\n${extras ? `${isEn ? 'Extras' : 'Adicionais'}:\n${extras}\n\n` : ''}${isEn ? 'Location' : 'Local'}:\n${location}\n\n${isEn ? 'Payment' : 'Pagamento'}: ${booking.payment.toUpperCase()}\n${isEn ? 'Total' : 'Total'}: ${formatMoney(financials.total, lang)}\n\n${isEn ? 'I read and agree with the rules. I await confirmation.' : 'Li e aceito as regras. Aguardo sua confirmação.'}`.trim();
  }, [booking, data.extras, financials.duration, financials.total, lang, user.name]);

  const finishBooking = useCallback(() => {
    const applied = booking.appliedCoupon;
    setUser((prev) => ({
      ...prev,
      xp: prev.xp + estimatedXP,
      coupons: applied ? prev.coupons.filter((coupon) => coupon.id !== applied.id) : prev.coupons,
      usedCoupons: applied && !prev.usedCoupons.includes(applied.code) ? [...prev.usedCoupons, applied.code] : prev.usedCoupons,
      ordersCount: Math.max(prev.ordersCount, 92) + 1,
      lastActivity: new Date().toISOString(),
    }));
    vibrate([80, 40, 80]);
    openExternal('whatsapp', bookingMessage);
    setStep(4);
  }, [booking.appliedCoupon, bookingMessage, estimatedXP, openExternal]);

  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      setHasError(true);
      window.setTimeout(() => setHasError(false), 550);
      const message = step === 0 ? T.toastNeedService : step === 1 ? (!user.name || user.name.trim().length < 3 ? T.toastName : T.toastAddr) : step === 2 ? T.toastDate : T.toastPayment;
      addToast(message, 'error');
      vibrate([45, 45]);
      return;
    }
    if (step === 3) {
      finishBooking();
      return;
    }
    vibrate();
    setStep((prev) => Math.min((prev + 1) as Step, 4));
  }, [T, addToast, finishBooking, isStepValid, step, user.name]);

  const handleBackStep = useCallback(() => {
    if (step <= 0) return;
    setStep((prev) => Math.max((prev - 1) as Step, 0));
  }, [step]);

  const resetApp = useCallback(() => {
    setBooking(createInitialBooking());
    setStep(0);
    setActiveTab('single');
    closeAllModals();
  }, [closeAllModals]);

  const copyPix = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CONFIG.PIX_KEY);
      addToast(T.toastPix);
    } catch {
      addToast(CONFIG.PIX_KEY);
    }
  }, [T.toastPix, addToast]);

  if (!isClient) return <div className="min-h-screen bg-[#0e1117]" />;

  if (loading) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDark ? 'bg-[#0e1117]' : 'bg-[#f7f3ee]'}`}>
        <GlobalStyles isDark={isDark} />
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-blue-600 text-4xl font-semibold text-white shadow-2xl">T</div>
          <p className={`safe-text text-xs font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Carregando</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <ToastStack toasts={toasts} isDark={isDark} />

      <main className="mx-auto min-h-screen max-w-7xl px-4 pb-40 sm:px-6 lg:px-8">
        {step !== 4 && (
          <header className="pb-8 pt-6 sm:pb-10 sm:pt-10">
            <div className="flex items-start justify-between gap-4">
              <button type="button" onClick={() => setStep(0)} className="min-w-0 text-left">
                <h1 className={`safe-text text-2xl font-semibold leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.brand}</h1>
                <p className={`safe-text mt-2 text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>+{user.ordersCount} {T.attended}</p>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => setLang((prev) => (prev === 'pt' ? 'en' : 'pt'))} className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-bold ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`} aria-label="Trocar idioma">
                  {lang.toUpperCase()}
                </button>
                <button type="button" onClick={() => setIsDark((prev) => !prev)} className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`} aria-label="Trocar tema">
                  <Icon name="sun" size={20} />
                </button>
                <button type="button" onClick={() => openExternal('instagram')} className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5 text-pink-400' : 'border-slate-200 bg-white text-pink-600'}`} aria-label="Abrir Instagram">
                  <Icon name="instagram" size={20} />
                </button>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-3">
              {[
                lang === 'en' ? 'Service' : 'Serviço',
                lang === 'en' ? 'Place' : 'Local',
                lang === 'en' ? 'Time' : 'Horário',
                lang === 'en' ? 'Review' : 'Resumo',
              ].map((label, index) => (
                <button key={label} type="button" onClick={() => index < step && setStep(index as Step)} className="text-left" disabled={index > step}>
                  <span className={`block h-1.5 rounded-full ${step >= index ? 'bg-blue-600' : isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                  <span className={`safe-text mt-2 block text-center text-[9px] font-bold uppercase tracking-widest ${step >= index ? (isDark ? 'text-white/80' : 'text-slate-700') : isDark ? 'text-white/25' : 'text-slate-300'}`}>{label}</span>
                </button>
              ))}
            </div>
          </header>
        )}

        {step === 0 && (
          <section className="space-y-8 animate-fade-up">
            <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_380px]">
              <div className={`mobile-card rounded-[2rem] border p-6 sm:p-8 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h2 className={`safe-text text-4xl font-semibold leading-[1.05] sm:text-6xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.welcome} <span className="italic text-gradient-blue">{user.name ? user.name.trim().split(' ')[0] : T.welcomeAnon}</span>
                </h2>
                <p className={`safe-text mt-5 max-w-2xl text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.chooseSub}</p>
              </div>

              <div className={`mobile-card relative overflow-hidden rounded-[2rem] border shadow-2xl ${isDark ? 'border-white/10 bg-white/5 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
                <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                  <img src={CONFIG.PROFILE_PHOTO_URL} alt="Foto de Thalyson" className="h-full w-full object-cover" style={{ objectPosition: 'center top' }} />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 text-white">
                  <p className="safe-text text-sm font-semibold uppercase tracking-[0.18em] text-blue-100">{T.professional}</p>
                </div>
              </div>
            </div>

            <div className={`mx-auto flex max-w-xl flex-col rounded-2xl border p-2 sm:flex-row ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'}`}>
              {[
                { id: 'single' as const, label: T.tabSingle, icon: 'user' },
                { id: 'packs' as const, label: T.tabPacks, icon: 'package' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex min-h-12 flex-1 items-center justify-center gap-3 rounded-xl px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all ${
                    activeTab === tab.id ? (tab.id === 'packs' ? 'bg-amber-500 text-zinc-950 shadow-lg' : 'bg-blue-600 text-white shadow-lg') : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Icon name={tab.icon} size={18} />
                  <span className="safe-text">{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'single' ? (
              <div className="space-y-5">
                {data.categories.map((category) => {
                  const items = data.services.filter((service) => service.category === category.id);
                  if (!items.length) return null;
                  return (
                    <section key={category.id} className={`mobile-card rounded-[2rem] border p-5 sm:p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                        <div>
                          <h3 className="safe-text text-2xl font-semibold">{category.title}</h3>
                          <p className={`safe-text mt-1 text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{category.desc}</p>
                        </div>
                      </div>
                      <div className="responsive-grid">
                        {items.map((service) => (
                          <ServiceCard key={service.id} item={service} selected={booking.cart.some((item) => item.id === service.id)} onOpen={() => setSelectedService(service)} isDark={isDark} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <section className={`mobile-card rounded-[2rem] border p-5 sm:p-6 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="mb-5">
                  <h3 className="safe-text text-2xl font-semibold">{T.tabPacks}</h3>
                  <p className={`safe-text mt-1 text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'One plan at a time, with cleaner hierarchy.' : 'Um plano por vez, com hierarquia mais clara.'}</p>
                </div>
                <div className="responsive-grid">
                  {data.plans.map((plan) => (
                    <ServiceCard key={plan.id} item={plan} selected={booking.cart.some((item) => item.id === plan.id)} onOpen={() => setSelectedService(plan)} isDark={isDark} />
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="app-grid animate-fade-up">
            <div className="space-y-6">
              <SectionHeader title={T.locationTitle} desc={T.locationSub} isDark={isDark} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { id: 'home' as LocationType, label: T.home, icon: 'home' },
                  { id: 'motel' as LocationType, label: T.motel, icon: 'bed' },
                  { id: 'hotel' as LocationType, label: T.hotel, icon: 'building' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, locationType: item.id, address: item.id === prev.locationType ? prev.address : { ...prev.address } }))}
                    className={`flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-3xl border px-4 py-5 text-center transition-all ${
                      booking.locationType === item.id ? 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
                    }`}
                  >
                    <Icon name={item.icon} size={27} />
                    <span className="safe-text text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className={`mobile-card space-y-5 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <InputField isDark={isDark} label={T.name} value={user.name} onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))} icon="user" error={hasError && user.name.trim().length < 3} />

                {booking.locationType === 'home' && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><InputField isDark={isDark} label={T.cep} value={booking.address.cep} onChange={handleCepChange} icon="map" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} /></div>
                    <div className="sm:col-span-2"><InputField isDark={isDark} label={T.street} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.street} /></div>
                    <InputField isDark={isDark} label={T.number} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value, 20) } }))} type="tel" error={hasError && !booking.address.number} />
                    <InputField isDark={isDark} label={T.district} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.district} />
                    <InputField isDark={isDark} label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                    <InputField isDark={isDark} label={T.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2"><InputField isDark={isDark} label={T.hotelName} value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} icon="building" error={hasError && !booking.address.placeName} /></div>
                    <InputField isDark={isDark} label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                    <InputField isDark={isDark} label={T.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className={`rounded-2xl border p-4 text-sm leading-relaxed ${isDark ? 'border-blue-500/20 bg-blue-500/10 text-blue-100' : 'border-blue-200 bg-blue-50 text-blue-900'}`}>
                    {lang === 'en' ? 'The private suite address is confirmed on WhatsApp after the booking request.' : 'O endereço da suíte é confirmado pelo WhatsApp depois do pedido de agendamento.'}
                  </div>
                )}
              </div>
            </div>
            <aside className="hidden lg:block"><SummaryPanel isDark={isDark} lang={lang} T={T} booking={booking} financials={financials} extras={data.extras} step={step} onCopyPix={copyPix} /></aside>
          </section>
        )}

        {step === 2 && (
          <section className="app-grid animate-fade-up">
            <div className="space-y-6">
              <SectionHeader title={T.whenTitle} desc={T.whenSub} isDark={isDark} />
              <div className={`mobile-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <div className="scrollbar-hide -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {daysArray.map((date) => {
                    const value = dateToInputValue(date);
                    const selected = booking.date === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setBooking((prev) => ({ ...prev, date: value, time: null }))}
                        className={`min-w-[94px] rounded-2xl border px-3 py-4 text-center transition-all ${selected ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-900/25' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 shadow-sm'}`}
                      >
                        <span className="safe-text block text-[10px] font-bold uppercase tracking-widest opacity-70">{getDayLabel(date)}</span>
                        <span className="mt-2 block text-2xl font-semibold">{date.getDate()}</span>
                        <span className="safe-text mt-1 block text-[10px] font-bold uppercase tracking-widest opacity-70">{date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' })}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <div className="time-grid">
                    {(timeSlots.length ? timeSlots : []).map((time) => {
                      const selected = booking.time === time;
                      const rush = RUSH_HOURS.includes(time);
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBooking((prev) => ({ ...prev, time }))}
                          className={`min-h-14 rounded-2xl border px-3 py-3 text-center text-sm font-semibold transition-all ${selected ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-900/25' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-700 shadow-sm'}`}
                        >
                          {time}
                          {rush && <span className={`safe-text mt-1 block text-[9px] font-bold uppercase tracking-widest ${selected ? 'text-blue-100' : 'text-amber-400'}`}>+{formatMoney(CONFIG.RUSH_FEE, lang)}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {booking.date && !timeSlots.length && <p className={`safe-text mt-4 text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{lang === 'en' ? 'No available time left for this date.' : 'Não há horários disponíveis para esta data.'}</p>}
                </div>
              </div>
            </div>
            <aside className="hidden lg:block"><SummaryPanel isDark={isDark} lang={lang} T={T} booking={booking} financials={financials} extras={data.extras} step={step} onCopyPix={copyPix} /></aside>
          </section>
        )}

        {step === 3 && (
          <section className="app-grid animate-fade-up">
            <div className="space-y-6">
              <SectionHeader title={T.summaryTitle} desc={T.summarySub} isDark={isDark} />

              <div className={`mobile-card space-y-4 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h3 className="safe-text text-xl font-semibold">{T.extrasTitle}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {data.extras.map((extra) => {
                    const selected = Boolean(booking.extras[extra.id]);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }))}
                        className={`flex items-start gap-4 rounded-2xl border p-4 text-left transition-all ${selected ? 'border-blue-500 bg-blue-500/10' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                      >
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${selected ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-white text-slate-600'}`}><Icon name={extra.icon} size={20} /></span>
                        <span className="min-w-0 flex-1">
                          <span className="safe-text block text-sm font-semibold">{extra.label}</span>
                          <span className={`safe-text mt-1 block text-xs leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{extra.desc}</span>
                        </span>
                        {selected && <Icon name="check" size={18} className="text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={`mobile-card space-y-4 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h3 className="safe-text text-xl font-semibold">{T.couponTitle}</h3>
                {user.coupons.length ? (
                  user.coupons.map((coupon) => {
                    const selected = booking.appliedCoupon?.id === coupon.id;
                    return (
                      <button
                        key={coupon.id}
                        type="button"
                        onClick={() => applyCoupon(coupon)}
                        className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${selected ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selected ? 'bg-emerald-500 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-white text-slate-600'}`}><Icon name="ticket" size={20} /></span>
                          <span>
                            <span className="safe-text block text-sm font-bold uppercase tracking-widest">{coupon.code}</span>
                            <span className={`safe-text mt-1 block text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'Applied in final review' : 'Aplicado no resumo final'}</span>
                          </span>
                        </span>
                        {selected && <Icon name="check" size={18} className="text-emerald-400" />}
                      </button>
                    );
                  })
                ) : (
                  <p className={`safe-text text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.couponEmpty}</p>
                )}
              </div>

              <div className={`mobile-card space-y-4 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h3 className="safe-text text-xl font-semibold">{T.paymentTitle}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { id: 'pix' as PaymentMethod, label: T.pix, icon: 'cash' },
                    { id: 'card' as PaymentMethod, label: T.card, icon: 'card' },
                    { id: 'cash' as PaymentMethod, label: T.cash, icon: 'cash' },
                  ].map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setBooking((prev) => ({ ...prev, payment: method.id }))}
                      className={`flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border p-4 text-center transition-all ${booking.payment === method.id ? 'border-blue-500 bg-blue-600 text-white shadow-lg shadow-blue-900/25' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`}
                    >
                      <Icon name={method.icon} size={22} />
                      <span className="safe-text text-xs font-bold uppercase tracking-widest">{method.label}</span>
                    </button>
                  ))}
                </div>
                {booking.payment === 'pix' && <Button variant="outline" full onClick={copyPix} icon="cash">{CONFIG.PIX_KEY}</Button>}
              </div>

              <div className={`mobile-card space-y-4 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <button
                  type="button"
                  onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))}
                  className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${booking.mediaAllowed ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                >
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${booking.mediaAllowed ? 'bg-emerald-500 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-white text-slate-600'}`}><Icon name="sparkles" size={20} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="safe-text block text-sm font-semibold">{T.mediaTitle}</span>
                    <span className={`safe-text mt-1 block text-xs leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.mediaDesc}</span>
                  </span>
                  {booking.mediaAllowed && <Icon name="check" size={18} className="text-emerald-400" />}
                </button>

                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className={`flex w-full items-center justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${booking.termsAccepted ? 'border-blue-500 bg-blue-500/10' : hasError ? 'border-red-500/60 bg-red-950/10' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                >
                  <span className="flex items-center gap-3"><Icon name="shield" size={20} /><span className="safe-text text-sm font-semibold">{T.termsTitle}</span></span>
                  {booking.termsAccepted ? <Icon name="check" size={18} className="text-blue-400" /> : <Icon name="right" size={18} />}
                </button>
              </div>
            </div>
            <aside className="hidden lg:block"><SummaryPanel isDark={isDark} lang={lang} T={T} booking={booking} financials={financials} extras={data.extras} step={step} onCopyPix={copyPix} /></aside>
          </section>
        )}

        {step === 4 && (
          <section className="flex min-h-screen items-center justify-center py-10 animate-fade-up">
            <div className={`mobile-card w-full max-w-xl rounded-[2rem] border p-6 text-center shadow-2xl sm:p-10 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-emerald-500 text-white"><Icon name="check" size={34} /></div>
              <h2 className="safe-text text-4xl font-semibold">{T.successTitle}</h2>
              <p className={`safe-text mx-auto mt-3 max-w-md text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.successSub}</p>
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button full variant="whatsapp" icon="message" onClick={() => openExternal('whatsapp', bookingMessage)}>{T.whatsapp}</Button>
                <Button full variant="outline" onClick={resetApp}>{T.startOver}</Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {step !== 4 && (
        <div className={`fixed inset-x-0 bottom-0 z-40 border-t p-4 sticky-safe backdrop-blur-xl ${isDark ? 'border-white/10 bg-[#0e1117]/92' : 'border-slate-200 bg-white/92'}`}>
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
            {step > 0 ? (
              <Button variant="outline" onClick={handleBackStep} icon="left" className="shrink-0 px-4">{T.back}</Button>
            ) : (
              <span className="hidden sm:block" />
            )}
            <Button variant={step === 3 ? 'whatsapp' : 'primary'} onClick={handleNextStep} icon={step === 3 ? 'message' : 'right'} className="min-w-[148px]">
              {step === 3 ? T.finish : T.continue}
            </Button>
          </div>
        </div>
      )}

      {selectedService && (
        <ModalShell isDark={isDark} onClose={closeAllModals}>
          <div className={`flex items-start justify-between gap-4 border-b p-5 sm:p-7 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="min-w-0">
              <p className="safe-text text-[11px] font-bold uppercase tracking-[0.2em] text-blue-400">{selectedService.tag}</p>
              <h3 className="safe-text mt-2 text-2xl font-semibold">{selectedService.title}</h3>
            </div>
            <button type="button" onClick={closeAllModals} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon name="x" size={22} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            <div className={`rounded-2xl border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`safe-text text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{selectedService.desc}</p>
              <div className="mt-5 grid grid-cols-1 gap-3">
                <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-white'}`}><span className="safe-text block text-[10px] font-bold uppercase tracking-widest opacity-60">{T.duration}</span><strong className="mt-1 block text-xl">{selectedService.min} min</strong></div>
              </div>
            </div>
            <div className="mt-5">
              <h4 className="safe-text mb-3 text-sm font-bold uppercase tracking-widest opacity-60">{T.serviceDetails}</h4>
              <div className="space-y-2">
                {selectedService.details.map((detail) => <div key={detail} className={`flex items-center gap-3 rounded-2xl p-3 text-sm ${isDark ? 'bg-white/5 text-zinc-300' : 'bg-slate-50 text-slate-700'}`}><Icon name="check" size={16} className="text-emerald-400" /><span className="safe-text">{detail}</span></div>)}
              </div>
            </div>
          </div>
          <div className={`border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <Button full variant={booking.cart.some((item) => item.id === selectedService.id) ? 'outline' : selectedService.type === 'pack' ? 'amber' : 'primary'} onClick={() => toggleCartItem(selectedService)}>
              {booking.cart.some((item) => item.id === selectedService.id) ? T.remove : T.select}
            </Button>
          </div>
        </ModalShell>
      )}

      {termsOpen && (
        <ModalShell isDark={isDark} onClose={() => setTermsOpen(false)}>
          <div className={`flex items-center justify-between gap-4 border-b p-5 sm:p-7 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <h3 className="safe-text text-2xl font-semibold">{T.termsTitle}</h3>
            <button type="button" onClick={() => setTermsOpen(false)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100'}`}><Icon name="x" size={22} /></button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-7">
            {data.rules.map((rule) => (
              <div key={rule} className={`flex gap-4 rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}><Icon name="shield" size={20} /></span>
                <p className={`safe-text text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{rule}</p>
              </div>
            ))}
          </div>
          <div className={`border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <Button full onClick={() => { setBooking((prev) => ({ ...prev, termsAccepted: true })); setTermsOpen(false); vibrate(); window.requestAnimationFrame(unlockPageScroll); }}>{T.acceptTerms}</Button>
          </div>
        </ModalShell>
      )}

      {welcomeOpen && (
        <ModalShell isDark={isDark} onClose={() => { setWelcomeOpen(false); setUser((prev) => ({ ...prev, hasSeenWelcome: true })); }} max="max-w-md">
          <div className="p-7 text-center sm:p-9">
            <div className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'border border-blue-500/30 bg-blue-500/20 text-blue-300' : 'border border-blue-200 bg-blue-50 text-blue-600'}`}><Icon name="gift" size={30} /></div>
            <h3 className="safe-text text-3xl font-semibold">{T.giftText}</h3>
            <p className={`safe-text mt-3 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{lang === 'en' ? 'Use it now or keep it for the summary step.' : 'Use agora ou mantenha para a etapa de resumo.'}</p>
            <div className={`my-7 rounded-2xl border border-dashed p-5 text-center ${isDark ? 'border-blue-500/40 bg-blue-500/10' : 'border-blue-300 bg-blue-50/50'}`}>
              <p className={`safe-text text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Cupom</p>
              <p className="safe-text mt-2 text-3xl font-semibold tracking-widest">BEMVINDO10</p>
            </div>
            <Button full onClick={claimWelcomeCoupon} icon="gift">{T.claimGift}</Button>
          </div>
        </ModalShell>
      )}
    </>
  );
}

function SummaryPanel({
  isDark,
  lang,
  T,
  booking,
  financials,
  extras,
  step,
  onCopyPix,
}: {
  isDark: boolean;
  lang: Lang;
  T: ReturnType<typeof getData>['text'];
  booking: BookingData;
  financials: { subtotal: number; couponDiscount: number; mediaDiscount: number; pixDiscount: number; rushFee: number; total: number; duration: number };
  extras: ExtraItem[];
  step: Step;
  onCopyPix: () => void;
}) {
  const selectedExtras = extras.filter((extra) => booking.extras[extra.id]);
  const dateLabel = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : lang === 'en' ? 'Not chosen yet' : 'Ainda não escolhido';
  const timeLabel = booking.time || (lang === 'en' ? 'Not chosen yet' : 'Ainda não escolhido');
  const locationLabel =
    booking.locationType === 'home'
      ? booking.address.street
        ? `${booking.address.street}${booking.address.number ? `, ${booking.address.number}` : ''}${booking.address.district ? ` - ${booking.address.district}` : ''}${booking.address.city ? `, ${booking.address.city}` : ''}`
        : T.home
      : booking.locationType === 'hotel'
        ? booking.address.placeName || T.hotel
        : T.motel;

  return (
    <div className={`sticky top-6 rounded-[2rem] border p-5 shadow-xl ${isDark ? 'border-white/10 bg-white/5 shadow-black/20' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="safe-text text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">{lang === 'en' ? 'Booking flow' : 'Fluxo do agendamento'}</p>
          <h3 className="safe-text mt-1 text-xl font-semibold">{T.summaryTitle}</h3>
        </div>
        <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{financials.duration} min</span>
      </div>

      <div className="mt-5 space-y-3">
        <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <p className={`safe-text text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'Selected sessions' : 'Sessões escolhidas'}</p>
          <div className="mt-3 space-y-2">
            {booking.cart.length ? booking.cart.map((item) => (
              <div key={item.id} className="flex items-start gap-2 text-sm">
                <Icon name="check" size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                <span className="safe-text font-medium">{item.title}</span>
              </div>
            )) : <p className={`safe-text text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.toastNeedService}</p>}
          </div>
        </div>

        <div className={`rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <p className={`safe-text text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.extrasTitle}</p>
          <div className="mt-3 space-y-2">
            {selectedExtras.length ? selectedExtras.map((extra) => (
              <div key={extra.id} className="flex items-start gap-2 text-sm">
                <Icon name={extra.icon} size={15} className="mt-0.5 shrink-0 text-blue-400" />
                <span className="safe-text font-medium">{extra.label}</span>
              </div>
            )) : <p className={`safe-text text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'No add-ons selected.' : 'Nenhum complemento selecionado.'}</p>}
          </div>
        </div>

        <div className={`grid grid-cols-1 gap-3 rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
          <div>
            <p className={`safe-text text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'Date and time' : 'Data e horário'}</p>
            <p className="safe-text mt-1 text-sm font-semibold">{dateLabel} • {timeLabel}</p>
          </div>
          <div>
            <p className={`safe-text text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{lang === 'en' ? 'Place' : 'Local'}</p>
            <p className="safe-text mt-1 text-sm font-semibold">{locationLabel}</p>
          </div>
        </div>
      </div>

      <div className={`my-5 h-px ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />

      {step === 3 ? (
        <>
          <div className="space-y-3">
            <SummaryLine label={T.subtotal} value={formatMoney(financials.subtotal, lang)} />
            {financials.couponDiscount > 0 && <SummaryLine label={T.discount} value={`- ${formatMoney(financials.couponDiscount, lang)}`} tone="success" />}
            {financials.mediaDiscount > 0 && <SummaryLine label={T.mediaDiscount} value={`- ${formatMoney(financials.mediaDiscount, lang)}`} tone="success" />}
            {financials.pixDiscount > 0 && <SummaryLine label={T.pixDiscount} value={`- ${formatMoney(financials.pixDiscount, lang)}`} tone="success" />}
            {financials.rushFee > 0 && <SummaryLine label={T.rushFee} value={`+ ${formatMoney(financials.rushFee, lang)}`} tone="warning" />}
          </div>

          <div className={`mt-5 rounded-2xl p-4 ${isDark ? 'bg-blue-600/15' : 'bg-blue-50'}`}>
            <div className="flex items-end justify-between gap-4">
              <span className="safe-text text-sm font-bold uppercase tracking-widest text-blue-400">{T.total}</span>
              <strong className="price-text text-3xl font-semibold">{formatMoney(financials.total, lang)}</strong>
            </div>
          </div>

          {booking.payment === 'pix' && (
            <button type="button" onClick={onCopyPix} className={`mt-3 w-full rounded-2xl border px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>{CONFIG.PIX_KEY}</button>
          )}
        </>
      ) : (
        <div className={`rounded-2xl p-4 ${isDark ? 'bg-blue-600/10 text-blue-100' : 'bg-blue-50 text-blue-900'}`}>
          <p className="safe-text text-sm font-semibold">{lang === 'en' ? 'Follow the steps and keep the flow simple.' : 'Siga as etapas e mantenha o fluxo simples.'}</p>
          <p className={`safe-text mt-1 text-xs leading-relaxed ${isDark ? 'text-blue-100/70' : 'text-blue-900/65'}`}>{lang === 'en' ? 'Session, place, date and final review before sending on WhatsApp.' : 'Sessão, local, data e revisão final antes de enviar pelo WhatsApp.'}</p>
        </div>
      )}
    </div>
  );
}
