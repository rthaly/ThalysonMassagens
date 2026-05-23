import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/thalyson.massagens',
  PROFILE_PHOTO_URL: 'https://i.ibb.co/gZxp3Dwz/Screenshot-1.png',
  STORAGE_KEY: '@thaly_app_v29_scroll_fix',
  PIX_KEY: '62.922.530/0001-14',
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  EXCHANGE_RATE: 5,
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_KB: 5000,
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

type Lang = 'pt' | 'en';
type Category = 'relax' | 'express' | 'final' | 'care';
type LocationType = 'home' | 'motel' | 'hotel';

interface ServiceItem {
  id: string;
  title: string;
  desc: string;
  details: string;
  tag: string;
  icon: string;
  min: number;
  price: number;
  category?: Category;
  type?: 'pack';
  fullPrice?: number;
  savings?: number;
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
  payment: string;
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
  x: 'M18 6L6 18M6 6l12 12',
  check: 'M20 6L9 17l-5-5',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  bed: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  building: 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  smartphone: 'M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  banknote: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  ticket: 'M15 5v2 M15 11v2 M15 17v2 M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z',
  package: 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  sparkles: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  scissors: 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  sun: 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  message: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'chevron-left': 'M15 18l-6-6 6-6',
  'chevron-right': 'M9 18l6-6-6-6',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
};

const sanitizeInput = (value: string) => String(value || '').replace(/[<>&"']/g, '').slice(0, 120);
const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const validateAddress = (address: Address) => Boolean(address.street && address.number && address.district && address.city);

const emptyAddress = (): Address => ({ cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' });

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

const unlockPageScroll = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.overflow = '';
  document.documentElement.style.touchAction = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
};

const vibrate = (pattern: number | number[] = 35) => {
  try {
    const nav = navigator as Navigator & { vibrate?: (value: number | number[]) => boolean };
    nav.vibrate?.(pattern);
  } catch {
    // Optional browser feature.
  }
};

const formatMoney = (value: number, lang: Lang) => {
  const amount = Number.isFinite(value) ? value : 0;
  const converted = lang === 'pt' ? amount : amount / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
  }).format(converted);
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
      tag: isEn ? 'FOOT RELIEF' : 'ALIVIO NOS PES',
      title: isEn ? 'Foot Massage' : 'Massagem nos Pes',
      desc: isEn ? 'Focused relief for tired feet after a long day.' : 'Alivio direto para pes cansados depois de um dia longo.',
      details: isEn ? 'Foot reflexology\nDeep pressure points\nLight finish' : 'Reflexologia nos pes\nPressao em pontos de tensao\nFinalizacao leve',
    },
    {
      id: 'maos',
      category: 'express',
      min: 40,
      price: 110,
      icon: 'user',
      tag: isEn ? 'HAND RELIEF' : 'ALIVIO NAS MAOS',
      title: isEn ? 'Hand Massage' : 'Massagem nas Maos',
      desc: isEn ? 'Release tension from typing and manual work.' : 'Libere a tensao acumulada nas maos e punhos.',
      details: isEn ? 'Finger mobility\nPalm massage\nForearm relief' : 'Mobilidade dos dedos\nMassagem na palma\nAlivio de punhos',
    },
    {
      id: 'relaxante',
      category: 'relax',
      min: 40,
      price: 157,
      icon: 'sun',
      tag: isEn ? 'MUSCLE RELIEF' : 'ALIVIO MUSCULAR',
      title: isEn ? 'Classic Massage' : 'Massagem Classica',
      desc: isEn ? 'For stiff backs, heavy shoulders and better sleep.' : 'Ideal para costas travadas, ombros pesados e sono melhor.',
      details: isEn ? 'Manual relief\nRelaxing rhythm\nTherapeutic focus' : 'Massagem manual\nRitmo relaxante\nFoco terapeutico',
    },
    {
      id: 'crossfit',
      category: 'relax',
      min: 60,
      price: 187,
      icon: 'shield',
      tag: isEn ? 'RECOVERY' : 'RECUPERACAO',
      title: isEn ? 'Sports Massage' : 'Massagem para Atletas',
      desc: isEn ? 'Firm sports massage for people who train hard.' : 'Pegada firme para quem treina pesado e sente dores.',
      details: isEn ? 'Vigorous friction\nMyofascial release\nMobility stretches' : 'Friccao forte\nLiberacao miofascial\nAlongamentos',
    },
    {
      id: 'sensitiva',
      category: 'final',
      min: 60,
      price: 177,
      icon: 'sparkles',
      tag: isEn ? 'SENSORY' : 'SENSORIAL',
      title: isEn ? 'Sensory Massage' : 'Massagem Sensorial',
      desc: isEn ? 'Soft, immersive touch to reduce anxiety and body tension.' : 'Toques suaves e imersivos para reduzir ansiedade e tensao corporal.',
      details: isEn ? 'Classic warm-up\nSoft stimuli\nPrivate rhythm' : 'Aquecimento classico\nEstimulos suaves\nRitmo privado',
    },
    {
      id: 'mista',
      category: 'final',
      min: 60,
      price: 207,
      icon: 'heart',
      tag: isEn ? 'FULL EXPERIENCE' : 'EXPERIENCIA COMPLETA',
      title: isEn ? 'Fusion Experience' : 'Experiencia Fusion',
      desc: isEn ? 'A complete session that blends relief and sensory care.' : 'Sessao completa que une alivio muscular e cuidado sensorial.',
      details: isEn ? 'Classic massage\nGradual rhythm\nFull relaxation' : 'Massagem classica\nRitmo gradual\nRelaxamento completo',
    },
    {
      id: 'nuru',
      category: 'final',
      min: 60,
      price: 317,
      icon: 'star',
      tag: isEn ? 'PREMIUM' : 'PREMIUM',
      title: isEn ? 'Nuru Massage' : 'Massagem Nuru',
      desc: isEn ? 'Gel-based session with a more immersive body experience.' : 'Sessao com gel e experiencia corporal mais imersiva.',
      details: isEn ? 'Warm-up massage\nGel application\nDeep relaxation' : 'Massagem inicial\nAplicacao de gel\nRelaxamento profundo',
    },
    {
      id: 'depilacao',
      category: 'care',
      min: 60,
      price: 107,
      icon: 'scissors',
      tag: isEn ? 'CARE' : 'ESTETICA',
      title: isEn ? 'Full Body Trim' : 'Aparo de Pelos do Corpo',
      desc: isEn ? 'A clean and practical aesthetic care session.' : 'Cuidado estetico pratico para deixar o corpo mais limpo e leve.',
      details: isEn ? 'Careful clipper trim\nChosen body areas\nPrivate session' : 'Aparo com maquina\nAreas escolhidas\nSessao privada',
    },
  ];

  const plans: ServiceItem[] = [
    {
      id: 'pack_basic',
      type: 'pack',
      min: 60,
      title: isEn ? 'Routine Relief (2x)' : 'Alivio de Rotina (2x)',
      price: 247,
      fullPrice: 284,
      savings: 37,
      desc: isEn ? 'Two care sessions with a relaxing bonus.' : 'Duas sessoes de cuidado com bonus relaxante.',
      details: isEn ? '1x Foot Massage\n1x Classic Massage\nBonus aromatherapy' : '1x Massagem nos Pes\n1x Massagem Classica\nBonus aromaterapia',
      tag: 'RELAX',
      icon: 'package',
    },
    {
      id: 'pack_essencial',
      type: 'pack',
      min: 60,
      title: isEn ? 'Survival Kit (2x)' : 'Kit Sobrevivencia (2x)',
      price: 297,
      fullPrice: 334,
      savings: 37,
      desc: isEn ? 'Body pain relief and mental rest.' : 'Um dia para tirar dores, outro para aliviar a mente.',
      details: isEn ? '1x Classic\n1x Sensory\nSeparate appointments' : '1x Classica\n1x Sensorial\nAgendamentos separados',
      tag: isEn ? 'SLEEP WELL' : 'DURMA BEM',
      icon: 'package',
    },
    {
      id: 'pack_premium',
      type: 'pack',
      min: 60,
      title: isEn ? 'Boss Plan (3x)' : 'Mensalidade do Chefe (3x)',
      price: 637,
      fullPrice: 721,
      savings: 84,
      desc: isEn ? 'Three premium weeks with the most requested sessions.' : 'Tres semanas com as experiencias mais procuradas.',
      details: isEn ? '1x Classic\n1x Fusion\n1x Nuru' : '1x Classica\n1x Fusion\n1x Nuru',
      tag: isEn ? 'VIP MONTH' : 'TRATAMENTO VIP',
      icon: 'star',
    },
  ];

  const extras: ExtraItem[] = [
    { id: 'more_time', price: 77, icon: 'clock', label: isEn ? 'Extended Time (+30m)' : 'Mais 30 Minutos', desc: isEn ? 'More time to enjoy calmly.' : 'Mais tempo para curtir sem pressa.' },
    { id: 'aroma', price: 17, icon: 'sparkles', label: isEn ? 'Aromatherapy' : 'Aromaterapia', desc: isEn ? 'Relaxing oils for body and room.' : 'Oleos relaxantes no ambiente e no corpo.' },
    { id: 'pain_relief', price: 17, icon: 'shield', label: isEn ? 'Extra Pain Focus' : 'Alivio de Dores Fortes', desc: isEn ? 'More attention to locked areas.' : 'Atencao extra nas areas travadas.' },
    { id: 'hair_trim', price: 57, icon: 'scissors', label: isEn ? 'Trim Extra' : 'Aparo de Pelos', desc: isEn ? 'Maintenance in up to two areas.' : 'Aparo em ate duas areas do corpo.' },
  ];

  return {
    welcomeCoupon,
    services,
    plans,
    extras,
    rules: [
      isEn ? 'Take a shower before the appointment.' : 'Tome uma ducha antes do atendimento.',
      isEn ? 'Respect, clarity and consent are required.' : 'Respeito, clareza e consentimento sao obrigatorios.',
      isEn ? 'Confirm you are healthy and without contagious conditions.' : 'Confirme que esta saudavel e sem condicoes contagiosas.',
      isEn ? 'Travel fee is confirmed on WhatsApp.' : 'A taxa de deslocamento e confirmada no WhatsApp.',
    ],
    text: {
      welcome: isEn ? 'Welcome,' : 'Bem-vindo,',
      welcomeAnon: isEn ? 'allow yourself.' : 'permita-se relaxar.',
      chooseSub: isEn ? 'Choose how you want to be cared for today.' : 'Escolha abaixo como voce quer relaxar hoje.',
      tabSingle: isEn ? 'Single Sessions' : 'Sessoes Avulsas',
      tabPacks: isEn ? 'Monthly Plans' : 'Planos Mensais',
      continue: isEn ? 'Continue' : 'Continuar',
      finish: isEn ? 'Complete Booking' : 'Finalizar Agendamento',
      back: isEn ? 'Back' : 'Voltar',
      name: isEn ? 'Your name or nickname' : 'Seu nome ou apelido',
      locationTitle: isEn ? 'Where will the session be?' : 'Onde vamos nos ver?',
      whenTitle: isEn ? 'Choose the perfect moment' : 'Escolha a data do encontro',
      summaryTitle: isEn ? 'Order Summary' : 'Resumo do pedido',
      extrasTitle: isEn ? 'Optional add-ons' : 'Complementos opcionais',
      couponTitle: isEn ? 'Available Benefits' : 'Beneficios disponiveis',
      couponEmpty: isEn ? 'No benefits available now.' : 'Nenhum beneficio disponivel agora.',
      paymentTitle: isEn ? 'Payment at the meeting' : 'Forma de pagamento no local',
      termsTitle: isEn ? 'Session Agreement' : 'Regras e Acordos',
      acceptTerms: isEn ? 'I read and agree' : 'Li e aceito as regras',
      total: isEn ? 'Total' : 'Total a pagar',
      subtotal: isEn ? 'Subtotal' : 'Valor inicial',
      discount: isEn ? 'Discount' : 'Desconto',
      pixDiscount: isEn ? 'Pix discount' : 'Desconto Pix',
      mediaDiscount: isEn ? 'Portfolio discount' : 'Desconto Portfolio',
      rushFee: isEn ? 'Rush fee' : 'Taxa de pico',
      home: isEn ? 'Residence' : 'Residencia',
      motel: isEn ? 'My Suite' : 'Minha Suite',
      hotel: isEn ? 'Hotel' : 'Hotel',
      cep: isEn ? 'ZIP Code (CEP)' : 'Digite o CEP do local',
      street: isEn ? 'Street or Avenue' : 'Rua ou Avenida completa',
      number: isEn ? 'Number' : 'Numero',
      district: isEn ? 'Neighborhood' : 'Bairro',
      city: isEn ? 'City' : 'Cidade',
      comp: isEn ? 'Apt, block, room' : 'Complemento ou quarto',
      hotelName: isEn ? 'Hotel name' : 'Nome do hotel',
      pix: isEn ? 'Pix (3% off)' : 'Pix (3% OFF)',
      card: isEn ? 'Card' : 'Cartao',
      cash: isEn ? 'Cash' : 'Dinheiro',
      mediaTitle: isEn ? 'Support my work' : 'Quer apoiar meu trabalho?',
      mediaDesc: isEn ? 'Allow anonymous aesthetic photos and get 1% off.' : 'Permita fotos esteticas anonimas e ganhe 1% OFF.',
      toastCart: isEn ? 'Cart updated.' : 'Servico alterado.',
      toastCoupon: isEn ? 'Benefit applied.' : 'Beneficio ativado com sucesso.',
      toastCouponRemoved: isEn ? 'Benefit removed.' : 'Beneficio removido.',
      toastName: isEn ? 'Fill in your name.' : 'Preencha seu nome corretamente.',
      toastAddr: isEn ? 'Fill in the full location.' : 'Preencha o local completo.',
      toastDate: isEn ? 'Choose date and time.' : 'Selecione data e horario.',
      toastPayment: isEn ? 'Choose payment and accept the rules.' : 'Escolha pagamento e aceite as regras.',
      toastCepFound: isEn ? 'Address loaded.' : 'Endereco encontrado pelo CEP.',
      toastCepError: isEn ? 'ZIP code not found.' : 'CEP nao encontrado.',
      toastPix: isEn ? 'PIX key copied.' : 'Chave PIX copiada.',
      successTitle: isEn ? 'Almost there!' : 'Tudo certo! Falta pouco',
      successSub: isEn ? 'WhatsApp will open with your booking message.' : 'O WhatsApp sera aberto com a mensagem do pedido.',
      whatsapp: isEn ? 'Open WhatsApp' : 'Enviar no WhatsApp',
      startOver: isEn ? 'Start over' : 'Voltar para o inicio',
      today: isEn ? 'TODAY' : 'HOJE',
      tomorrow: isEn ? 'TOMORROW' : 'AMANHA',
      claimGift: isEn ? 'Claim Gift' : 'Pegar presente',
      giftText: isEn ? 'Take this first gift for your care journey.' : 'Pegue este presente inaugural para sua jornada de cuidado.',
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
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

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
        }

        html, body, #root {
          min-height: 100%;
        }

        html, body {
          width: 100%;
          overflow-x: hidden;
          overflow-y: auto;
          touch-action: pan-y;
          background: var(--c-bg);
          color: var(--c-text);
          font-family: var(--font-sans);
          line-height: 1.55;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          min-width: 320px;
          margin: 0;
        }

        button, input {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        button:disabled {
          cursor: not-allowed;
        }

        img, svg {
          max-width: 100%;
        }

        .safe-text {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        .price-text {
          max-width: 100%;
          overflow-wrap: anywhere;
          line-height: 1.05;
        }

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

        .text-gradient-blue {
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
          gap: 1rem;
        }

        .time-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
          gap: .75rem;
        }

        @media (max-width: 640px) {
          .mobile-card {
            border-radius: 1.35rem !important;
          }

          .sticky-safe {
            padding-bottom: max(1rem, env(safe-area-inset-bottom));
          }
        }
      `,
    }}
  />
));

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
              ? 'border-white/10 bg-[#181c25] text-white'
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

const Button = memo(
  ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    full = false,
    icon,
    loading = false,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'whatsapp' | 'outline' | 'amber';
    disabled?: boolean;
    full?: boolean;
    icon?: string;
    loading?: boolean;
  }) => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/25',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#22c55e] shadow-lg shadow-green-900/25',
      outline: 'border border-current text-current hover:bg-white/10',
      amber: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-900/25',
    };

    return (
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-6 py-4 text-center text-sm font-semibold leading-tight transition-all active:scale-[.98] disabled:opacity-45 ${variants[variant]} ${full ? 'w-full' : ''}`}
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
      <span className={`safe-text block pl-1 text-xs font-semibold uppercase tracking-widest ${error ? 'text-red-400' : isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</span>
      <span className="relative block">
        {icon && (
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-400' : isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
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

const ServiceCard = memo(
  ({ item, selected, onClick, isDark, lang }: { item: ServiceItem; selected: boolean; onClick: () => void; isDark: boolean; lang: Lang }) => (
    <button
      type="button"
      onClick={onClick}
      className={`mobile-card flex h-full min-w-0 flex-col rounded-[1.65rem] border p-5 text-left transition-all hover:-translate-y-0.5 ${
        selected
          ? item.type === 'pack'
            ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-900/10'
            : 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-900/10'
          : isDark
            ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
            : 'border-slate-200 bg-white shadow-sm hover:border-slate-300'
      }`}
    >
      <div className="flex min-w-0 items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${item.type === 'pack' ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
          <Icon name={item.icon} size={24} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="safe-text block font-semibold leading-tight">{item.title}</span>
          <span className={`safe-text mt-2 block text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{item.desc}</span>
        </span>
        {selected && (
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.type === 'pack' ? 'bg-amber-500 text-zinc-950' : 'bg-blue-600 text-white'}`}>
            <Icon name="check" size={15} />
          </span>
        )}
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-6">
        <span className={`safe-text rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${item.type === 'pack' ? 'border-amber-500/25 bg-amber-500/10 text-amber-400' : isDark ? 'border-white/10 bg-white/10 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
          {item.tag}
        </span>
        <span className="min-w-0 text-right">
          {item.fullPrice && <span className={`safe-text block text-xs line-through ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{formatMoney(item.fullPrice, lang)}</span>}
          <span className="price-text block font-semibold text-xl">{formatMoney(item.price, lang)}</span>
          {item.savings && <span className="safe-text mt-1 block text-[10px] font-bold uppercase tracking-widest text-emerald-400">-{formatMoney(item.savings, lang)}</span>}
        </span>
      </div>
    </button>
  ),
);

const SummaryLine = memo(({ label, value, tone = 'normal' }: { label: React.ReactNode; value: React.ReactNode; tone?: 'normal' | 'success' | 'warning' }) => {
  const color = tone === 'success' ? 'text-emerald-400' : tone === 'warning' ? 'text-amber-400' : '';
  return (
    <div className={`flex justify-between gap-4 text-base font-medium ${color}`}>
      <span className="safe-text min-w-0">{label}</span>
      <span className="price-text shrink-0">{value}</span>
    </div>
  );
});

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [activeTab, setActiveTab] = useState<'single' | 'packs'>('single');
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
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

  const data = useMemo(() => getData(lang), [lang]);
  const T = data.text;
  const modalOpen = welcomeOpen || termsOpen || Boolean(selectedService);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3200);
  }, []);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<{
          user: Partial<UserData>;
          booking: Partial<BookingData>;
          step: number;
          isDark: boolean;
          lang: Lang;
        }>;

        if (parsed.user) {
          setUser((prev) => ({
            ...prev,
            ...parsed.user,
            name: sanitizeInput(parsed.user?.name || ''),
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            ordersCount: Math.max(typeof parsed.user.ordersCount === 'number' ? parsed.user.ordersCount : 92, 92),
            xp: typeof parsed.user.xp === 'number' ? parsed.user.xp : 0,
          }));
        }

        if (parsed.booking && Array.isArray(parsed.booking.cart)) {
          setBooking((prev) => ({
            ...prev,
            ...parsed.booking,
            cart: parsed.booking?.cart || [],
            extras: typeof parsed.booking.extras === 'object' && parsed.booking.extras ? parsed.booking.extras : {},
            address: {
              ...emptyAddress(),
              ...parsed.booking.address,
              cep: sanitizeInput(parsed.booking.address?.cep || ''),
              street: sanitizeInput(parsed.booking.address?.street || ''),
              number: sanitizeInput(parsed.booking.address?.number || ''),
              district: sanitizeInput(parsed.booking.address?.district || ''),
              city: sanitizeInput(parsed.booking.address?.city || ''),
              comp: sanitizeInput(parsed.booking.address?.comp || ''),
              placeName: sanitizeInput(parsed.booking.address?.placeName || ''),
            },
          }));
        }

        if (typeof parsed.step === 'number' && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
        if (typeof parsed.isDark === 'boolean') setIsDark(parsed.isDark);
        if (parsed.lang === 'pt' || parsed.lang === 'en') setLang(parsed.lang);
      }
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } finally {
      window.setTimeout(() => setLoading(false), 350);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || loading) return;

    const payload = JSON.stringify({
      user: { ...user, lastActivity: new Date().toISOString() },
      booking,
      step,
      isDark,
      lang,
    });

    if (payload.length < CONFIG.MAX_STORAGE_KB * 1024) {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, payload);
      } catch {
        // Private browsers can block storage.
      }
    }
  }, [booking, isClient, isDark, lang, loading, step, user]);

  useEffect(() => {
    if (!loading && isClient && !user.hasSeenWelcome) {
      const timer = window.setTimeout(() => setWelcomeOpen(true), 900);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isClient, loading, user.hasSeenWelcome]);

  useEffect(() => {
    if (!isClient) return;

    if (!modalOpen) {
      unlockPageScroll();
      return undefined;
    }

    const htmlOverflow = document.documentElement.style.overflow;
    const htmlTouchAction = document.documentElement.style.touchAction;
    const bodyOverflow = document.body.style.overflow;
    const bodyTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';

    return () => {
      document.documentElement.style.overflow = htmlOverflow;
      document.documentElement.style.touchAction = htmlTouchAction;
      document.body.style.overflow = bodyOverflow;
      document.body.style.touchAction = bodyTouchAction;
    };
  }, [isClient, modalOpen]);

  useEffect(() => {
    if (!isClient) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [isClient, step]);

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

  const toggleCartItem = useCallback(
    (item: ServiceItem) => {
      vibrate();
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
      setSelectedService(null);
      addToast(T.toastCart);
    },
    [T.toastCart, addToast],
  );

  const applyCoupon = useCallback(
    (coupon: Coupon) => {
      setBooking((prev) => {
        const removing = prev.appliedCoupon?.id === coupon.id;
        return { ...prev, appliedCoupon: removing ? null : coupon };
      });

      unlockPageScroll();
      window.requestAnimationFrame(unlockPageScroll);
      addToast(booking.appliedCoupon?.id === coupon.id ? T.toastCouponRemoved : T.toastCoupon);
    },
    [T.toastCoupon, T.toastCouponRemoved, addToast, booking.appliedCoupon?.id],
  );

  const claimWelcomeCoupon = useCallback(() => {
    const coupon = data.welcomeCoupon;

    setWelcomeOpen(false);
    setUser((prev) => ({
      ...prev,
      hasSeenWelcome: true,
      coupons: prev.coupons.some((item) => item.id === coupon.id) ? prev.coupons : [...prev.coupons, coupon],
    }));
    setBooking((prev) => ({ ...prev, appliedCoupon: coupon }));

    unlockPageScroll();
    window.requestAnimationFrame(unlockPageScroll);
    addToast(T.toastCoupon);
  }, [T.toastCoupon, addToast, data.welcomeCoupon]);

  const handleCepChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    [T.toastCepError, T.toastCepFound, addToast],
  );

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
      return date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3).toUpperCase();
    },
    [T.today, T.tomorrow, lang],
  );

  const timeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }, (_, index) => `${String(CONFIG.START_HOUR + index).padStart(2, '0')}:00`);
    const now = new Date();
    const selectedDate = new Date(booking.date);
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
    const rushFee = RUSH_HOURS.includes(booking.time || '') && booking.locationType !== 'motel' ? RUSH_FEE : 0;
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
    const date = booking.date ? new Date(booking.date).toLocaleDateString(isEn ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : '';
    const items = booking.cart.map((item) => `- ${item.title} (${formatMoney(item.price, lang)})`).join('\n');
    const extras = Object.entries(booking.extras)
      .filter(([, selected]) => selected)
      .map(([id]) => data.extras.find((extra) => extra.id === id)?.label)
      .filter(Boolean)
      .map((label) => `+ ${label}`)
      .join('\n');

    const location =
      booking.locationType === 'home'
        ? `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city} ${booking.address.comp || ''}`
        : booking.locationType === 'hotel'
          ? `${booking.address.placeName}, ${booking.address.city} - ${booking.address.comp || ''}`
          : isEn
            ? 'Private suite, address confirmed on WhatsApp'
            : 'Suite privada, endereco confirmado pelo WhatsApp';

    return `${isEn ? '*CARE RESERVATION*' : '*PEDIDO DE ENCONTRO*'}

${isEn ? 'Name' : 'Nome'}: ${sanitizeInput(user.name)}
${isEn ? 'Date' : 'Data'}: ${date} ${isEn ? 'at' : 'as'} ${booking.time}
${isEn ? 'Duration' : 'Tempo estimado'}: ${financials.duration} min

${isEn ? 'Services' : 'Servicos'}:
${items}

${extras ? `${isEn ? 'Extras' : 'Adicionais'}:\n${extras}\n` : ''}
${isEn ? 'Location' : 'Local'}:
${location}

${isEn ? 'Payment' : 'Pagamento'}: ${booking.payment.toUpperCase()}
${isEn ? 'Total' : 'Total'}: ${formatMoney(financials.total, lang)}

${isEn ? 'I accept the terms and await confirmation.' : 'Li e aceito as regras. Aguardo sua confirmacao.'}`.trim();
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
      window.setTimeout(() => setHasError(false), 500);

      const message = step === 1 ? (!user.name || user.name.trim().length < 3 ? T.toastName : T.toastAddr) : step === 2 ? T.toastDate : step === 3 ? T.toastPayment : T.toastCart;
      addToast(message, 'error');
      vibrate([45, 45]);
      return;
    }

    if (step === 3) {
      finishBooking();
      return;
    }

    vibrate();
    setStep((prev) => prev + 1);
  }, [T, addToast, finishBooking, isStepValid, step, user.name]);

  if (!isClient) {
    return <div className="min-h-screen bg-[#11141a]" />;
  }

  if (loading) {
    return (
      <div className={`fixed inset-0 z-[100] flex items-center justify-center ${isDark ? 'bg-[#11141a]' : 'bg-[#f9f8f6]'}`}>
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

      <main className="mx-auto min-h-screen max-w-6xl px-4 pb-44 sm:px-6 lg:px-8">
        {step !== 4 && (
          <header className="pb-8 pt-8 sm:pb-10 sm:pt-12">
            <div className="flex items-start justify-between gap-4">
              <button type="button" onClick={() => setStep(0)} className="min-w-0 text-left">
                <h1 className={`safe-text text-3xl font-semibold leading-tight sm:text-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson Massagens</h1>
                <p className={`safe-text mt-2 text-xs font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>+{user.ordersCount} homens ja atendidos</p>
              </button>

              <div className="flex shrink-0 items-center gap-2">
                <button type="button" onClick={() => setLang((prev) => (prev === 'pt' ? 'en' : 'pt'))} className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xs font-bold ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  {lang.toUpperCase()}
                </button>
                <button type="button" onClick={() => setIsDark((prev) => !prev)} className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                  <Icon name="sun" size={20} />
                </button>
                <button type="button" onClick={() => openExternal('instagram')} className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${isDark ? 'border-white/10 bg-white/5 text-pink-400' : 'border-slate-200 bg-white text-pink-600'}`}>
                  <Icon name="instagram" size={20} />
                </button>
              </div>
            </div>

            {step > 0 && step < 4 && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {['Onde', 'Quando', 'Resumo'].map((label, index) => (
                  <button key={label} type="button" onClick={() => index + 1 < step && setStep(index + 1)} className="text-left">
                    <span className={`block h-1.5 rounded-full ${step >= index + 1 ? 'bg-blue-600' : isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
                    <span className={`safe-text mt-2 block text-center text-[10px] font-bold uppercase tracking-widest ${step >= index + 1 ? (isDark ? 'text-white/80' : 'text-slate-700') : isDark ? 'text-white/25' : 'text-slate-300'}`}>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </header>
        )}

        {step === 0 && (
          <section className="space-y-12 animate-fade-up">
            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_.78fr]">
              <div>
                <h2 className={`safe-text mb-5 text-4xl font-semibold leading-[1.12] sm:text-5xl ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.welcome} <span className="italic text-gradient-blue">{user.name ? user.name.trim().split(' ')[0] : T.welcomeAnon}</span>
                </h2>
                <p className={`safe-text max-w-xl text-base leading-relaxed sm:text-lg ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.chooseSub}</p>
              </div>
              <div className={`mobile-card relative overflow-hidden rounded-[2rem] border shadow-2xl ${isDark ? 'border-white/10 bg-white/5 shadow-black/30' : 'border-slate-200 bg-white shadow-slate-200/70'}`}>
                <div className="aspect-[4/5] w-full overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5]">
                  <img src={CONFIG.PROFILE_PHOTO_URL} alt="Foto de Thalyson" className="h-full w-full object-cover" style={{ objectPosition: 'center top' }} />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5 text-white">
                  <p className="safe-text text-xs font-semibold uppercase tracking-widest text-blue-200">Massoterapeuta profissional</p>
                  <h3 className="safe-text mt-1 text-2xl font-semibold">Thalyson</h3>
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
              <div className="space-y-8">
                {[
                  { id: 'express' as Category, title: lang === 'en' ? 'Express Care' : 'Cuidados Rapidos' },
                  { id: 'relax' as Category, title: lang === 'en' ? 'Just Relax' : 'Apenas Relaxar' },
                  { id: 'final' as Category, title: lang === 'en' ? 'Complete Experiences' : 'Experiencias Completas' },
                  { id: 'care' as Category, title: lang === 'en' ? 'Personal Care' : 'Cuidados Pessoais' },
                ].map((category) => {
                  const items = data.services.filter((service) => service.category === category.id);
                  if (!items.length) return null;

                  return (
                    <section key={category.id} className={`mobile-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                      <h3 className="safe-text mb-5 text-2xl font-semibold">{category.title}</h3>
                      <div className="responsive-grid">
                        {items.map((service) => (
                          <ServiceCard key={service.id} item={service} selected={booking.cart.some((item) => item.id === service.id)} onClick={() => setSelectedService(service)} isDark={isDark} lang={lang} />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <div className="responsive-grid">
                {data.plans.map((plan) => (
                  <ServiceCard key={plan.id} item={plan} selected={booking.cart.some((item) => item.id === plan.id)} onClick={() => setSelectedService(plan)} isDark={isDark} lang={lang} />
                ))}
              </div>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="mx-auto max-w-2xl space-y-8 animate-fade-up">
            <h2 className="safe-text text-center text-4xl font-semibold sm:text-5xl">{T.locationTitle}</h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'home' as LocationType, label: T.home, icon: 'home' },
                { id: 'motel' as LocationType, label: T.motel, icon: 'bed' },
                { id: 'hotel' as LocationType, label: T.hotel, icon: 'building' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setBooking((prev) => ({ ...prev, locationType: item.id }))}
                  className={`flex min-h-[108px] flex-col items-center justify-center gap-2 rounded-3xl border px-4 py-5 text-center transition-all ${
                    booking.locationType === item.id ? 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30' : isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
                  }`}
                >
                  <Icon name={item.icon} size={28} />
                  <span className="safe-text text-xs font-semibold uppercase tracking-widest">{item.label}</span>
                </button>
              ))}
            </div>

            <div className={`mobile-card space-y-5 rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <InputField isDark={isDark} label={T.name} value={user.name} onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))} icon="user" error={hasError && user.name.trim().length < 3} />

              {booking.locationType === 'home' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.cep} value={booking.address.cep} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} />
                  </div>
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.street} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.street} />
                  </div>
                  <InputField isDark={isDark} label={T.number} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value) } }))} type="tel" error={hasError && !booking.address.number} />
                  <InputField isDark={isDark} label={T.district} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.district} />
                  <InputField isDark={isDark} label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                  <InputField isDark={isDark} label={T.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                </div>
              )}

              {booking.locationType === 'hotel' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InputField isDark={isDark} label={T.hotelName} value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} icon="building" error={hasError && !booking.address.placeName} />
                  </div>
                  <InputField isDark={isDark} label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                  <InputField isDark={isDark} label={T.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                </div>
              )}

              {booking.locationType === 'motel' && (
                <div className={`rounded-2xl border p-5 text-sm font-medium leading-relaxed ${isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}>
                  O endereco da suite privada sera enviado pelo WhatsApp.
                </div>
              )}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="mx-auto max-w-3xl space-y-8 animate-fade-up">
            <h2 className="safe-text text-center text-4xl font-semibold sm:text-5xl">{T.whenTitle}</h2>

            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 py-3 scrollbar-hide">
              {daysArray.map((date) => {
                const selected = booking.date && new Date(booking.date).toDateString() === date.toDateString();
                const month = date.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => {
                      setBooking((prev) => ({ ...prev, date: date.toISOString(), time: null }));
                      vibrate();
                    }}
                    className={`flex h-[100px] w-[74px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-2xl border text-center transition-all ${
                      selected ? 'border-blue-400 bg-blue-600 text-white shadow-xl shadow-blue-900/30' : isDark ? 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10' : 'border-slate-200 bg-white text-slate-500 shadow-sm'
                    }`}
                  >
                    <span className="safe-text text-[9px] font-semibold uppercase tracking-wider">{month}</span>
                    <span className="text-3xl font-semibold leading-none">{date.getDate()}</span>
                    <span className="safe-text text-[9px] font-semibold uppercase tracking-wider">{getDayLabel(date)}</span>
                  </button>
                );
              })}
            </div>

            {booking.date && timeSlots.length > 0 ? (
              <div className={`time-grid ${hasError && !booking.time ? 'animate-pulse' : ''}`}>
                {timeSlots.map((time) => {
                  const selected = booking.time === time;
                  const rush = RUSH_HOURS.includes(time) && booking.locationType !== 'motel';
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        setBooking((prev) => ({ ...prev, time }));
                        vibrate();
                      }}
                      className={`flex min-h-[58px] flex-col items-center justify-center rounded-xl border px-2 py-2 text-center text-sm font-semibold transition-all ${
                        selected
                          ? rush
                            ? 'border-amber-400 bg-amber-500 text-zinc-950 shadow-lg'
                            : 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                          : isDark
                            ? rush
                              ? 'border-amber-500/20 bg-amber-500/10 text-amber-400'
                              : 'border-white/10 bg-white/5 text-zinc-300'
                            : rush
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-slate-200 bg-white text-slate-700 shadow-sm'
                      }`}
                    >
                      <span>{time}</span>
                      {rush && <span className="safe-text mt-1 text-[9px] uppercase tracking-wide">+{formatMoney(RUSH_FEE, lang)}</span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className={`mobile-card rounded-[2rem] border border-dashed py-14 text-center ${isDark ? 'border-white/10 text-zinc-500' : 'border-slate-300 text-slate-400'}`}>
                <Icon name="calendar" size={38} className="mx-auto mb-3 opacity-50" />
                <p className="safe-text px-5 text-sm font-semibold uppercase tracking-widest">{booking.date ? 'Nao ha horarios restantes nesse dia.' : 'Toque em um dia para ver horarios.'}</p>
              </div>
            )}
          </section>
        )}

        {step === 3 && (
          <section className="space-y-7 animate-fade-up">
            <div className={`mobile-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
              <h3 className="safe-text text-2xl font-semibold">{T.extrasTitle}</h3>
              <div className="responsive-grid mt-5">
                {data.extras.map((extra) => {
                  const active = Boolean(booking.extras[extra.id]);
                  const price = booking.type === 'pack' ? Math.floor(extra.price * 0.8) : extra.price;
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => {
                        setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }));
                        vibrate();
                      }}
                      className={`flex min-h-[120px] items-start justify-between gap-4 rounded-2xl border p-4 text-left transition-all ${active ? 'border-blue-500/50 bg-blue-600/15' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-slate-50'}`}
                    >
                      <span className="flex min-w-0 gap-3">
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-400' : 'bg-white text-slate-500'}`}>
                          <Icon name={extra.icon} size={20} />
                        </span>
                        <span>
                          <span className="safe-text block font-semibold">{extra.label}</span>
                          <span className={`safe-text mt-1.5 block text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{extra.desc}</span>
                        </span>
                      </span>
                      <span className={`safe-text shrink-0 rounded-xl px-2.5 py-1.5 text-[11px] font-bold ${active ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10 text-zinc-300' : 'bg-slate-200 text-slate-700'}`}>+{formatMoney(price, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-7 lg:grid-cols-[minmax(0,1.45fr)_minmax(300px,.8fr)]">
              <div className={`mobile-card rounded-[2rem] border p-5 sm:p-7 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                <h3 className="safe-text mb-6 text-2xl font-semibold">{T.summaryTitle}</h3>
                <div className="space-y-4">
                  {booking.cart.map((item) => (
                    <SummaryLine key={item.id} label={item.title} value={formatMoney(item.price, lang)} />
                  ))}

                  <div className={`space-y-3 border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <SummaryLine label={T.subtotal} value={formatMoney(financials.subtotal, lang)} />
                    {booking.appliedCoupon && <SummaryLine label={booking.appliedCoupon.title} value={`-${formatMoney(financials.couponDiscount, lang)}`} tone="success" />}
                    {financials.mediaDiscount > 0 && <SummaryLine label={T.mediaDiscount} value={`-${formatMoney(financials.mediaDiscount, lang)}`} tone="success" />}
                    {financials.pixDiscount > 0 && <SummaryLine label={T.pixDiscount} value={`-${formatMoney(financials.pixDiscount, lang)}`} tone="success" />}
                    {financials.rushFee > 0 && <SummaryLine label={T.rushFee} value={`+${formatMoney(financials.rushFee, lang)}`} tone="warning" />}
                  </div>

                  <div className={`flex flex-wrap items-end justify-between gap-4 border-t pt-5 ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                    <span className={`safe-text text-sm font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.total}</span>
                    <span className="price-text text-right text-4xl font-semibold text-gradient-blue">{formatMoney(financials.total, lang)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className={`mobile-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <h4 className="safe-text mb-4 flex items-center gap-3 font-semibold">
                    <Icon name="ticket" size={20} />
                    {T.couponTitle}
                  </h4>
                  {user.coupons.length > 0 ? (
                    <div className="space-y-3">
                      {user.coupons.map((coupon) => (
                        <button
                          key={coupon.id}
                          type="button"
                          onClick={() => applyCoupon(coupon)}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-4 text-left ${booking.appliedCoupon?.id === coupon.id ? 'border-emerald-500 bg-emerald-600/10 text-emerald-400' : isDark ? 'border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                        >
                          <span className="safe-text flex min-w-0 items-center gap-3 text-sm font-bold"><Icon name="gift" size={16} />{coupon.title}</span>
                          <span className="price-text shrink-0 text-sm">-{formatMoney(coupon.val, lang)}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className={`rounded-2xl border border-dashed p-5 text-center text-sm font-medium ${isDark ? 'border-white/10 text-zinc-500' : 'border-slate-300 text-slate-400'}`}>{T.couponEmpty}</div>
                  )}
                </div>

                <div className={`mobile-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <h4 className="safe-text font-semibold">{T.mediaTitle}</h4>
                  <p className={`safe-text mt-1 text-xs leading-relaxed ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.mediaDesc}</p>
                  <button type="button" onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))} className={`mt-4 flex w-full items-center justify-between gap-3 rounded-xl border p-4 text-left text-xs font-bold uppercase tracking-widest ${booking.mediaAllowed ? 'border-blue-500/50 bg-blue-600/15 text-blue-400' : isDark ? 'border-white/10 bg-white/5 text-zinc-500' : 'border-slate-200 bg-slate-50 text-slate-500'}`}>
                    <span>{booking.mediaAllowed ? 'Fotos autorizadas' : 'Autorizar fotos'}</span>
                    <span className={`rounded-lg px-3 py-1 ${booking.mediaAllowed ? 'bg-blue-600 text-white' : isDark ? 'bg-white/10' : 'bg-slate-200'}`}>1% OFF</span>
                  </button>
                </div>

                <div className={`mobile-card rounded-[2rem] border p-5 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white shadow-sm'}`}>
                  <h4 className="safe-text mb-4 font-semibold">{T.paymentTitle}</h4>
                  <div className="space-y-3">
                    {[
                      { id: 'pix', label: T.pix, icon: 'smartphone' },
                      { id: 'card', label: T.card, icon: 'credit-card' },
                      { id: 'money', label: T.cash, icon: 'banknote' },
                    ].map((payment) => (
                      <button
                        key={payment.id}
                        type="button"
                        onClick={() => {
                          setBooking((prev) => ({ ...prev, payment: payment.id }));
                          vibrate();
                          if (payment.id === 'pix') {
                            navigator.clipboard?.writeText(CONFIG.PIX_KEY).then(() => addToast(T.toastPix)).catch(() => undefined);
                          }
                        }}
                        className={`flex min-h-16 w-full items-center gap-3 rounded-2xl border p-4 text-left transition-all ${booking.payment === payment.id ? 'border-blue-400 bg-blue-600 text-white shadow-lg shadow-blue-900/20' : isDark ? 'border-white/10 bg-white/5 text-zinc-300' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
                      >
                        <Icon name={payment.icon} size={22} />
                        <span className="safe-text flex-1 text-sm font-semibold">{payment.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className={`mobile-card flex w-full items-center justify-between gap-4 rounded-[2rem] border p-5 text-left transition-all ${
                    booking.termsAccepted ? 'border-emerald-500/50 bg-emerald-600/15' : isDark ? 'border-white/10 bg-white/5 hover:bg-white/10' : 'border-slate-200 bg-white shadow-sm'
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${booking.termsAccepted ? 'bg-emerald-600 text-white' : isDark ? 'bg-white/10 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon name="heart" size={22} />
                    </span>
                    <span>
                      <span className="safe-text block font-semibold">{T.termsTitle}</span>
                      <span className={`safe-text mt-1 block text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{booking.termsAccepted ? T.acceptTerms : 'Toque para ler'}</span>
                    </span>
                  </span>
                  {booking.termsAccepted && <Icon name="check" size={22} className="text-emerald-400" />}
                </button>
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="mx-auto flex min-h-[80vh] max-w-md flex-col items-center justify-center px-2 pt-12 text-center animate-scale-in">
            <div className={`mb-8 flex h-28 w-28 items-center justify-center rounded-full border-[3px] border-emerald-500/50 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-50'}`}>
              <Icon name="check" size={48} className="text-emerald-400" />
            </div>
            <h2 className="safe-text text-4xl font-semibold">{T.successTitle}</h2>
            <p className={`safe-text mb-8 mt-3 max-w-sm text-base leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.successSub}</p>
            <div className="w-full space-y-3">
              <Button variant="whatsapp" full icon="message" onClick={() => openExternal('whatsapp', bookingMessage)}>
                {T.whatsapp}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep(0);
                  setBooking((prev) => ({ ...createInitialBooking(), address: prev.address }));
                }}
                className={`safe-text w-full py-4 text-sm font-semibold uppercase tracking-widest ${isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {T.startOver}
              </button>
            </div>
          </section>
        )}
      </main>

      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-4 pt-3 sticky-safe">
          <div className={`pointer-events-auto mx-auto max-w-6xl rounded-[1.65rem] border shadow-[0_-10px_40px_rgba(0,0,0,.22)] ${isDark ? 'border-zinc-700 bg-[#181c25]' : 'border-slate-300 bg-white'}`}>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:px-5">
              {step > 0 && (
                <button type="button" onClick={() => { setStep((prev) => prev - 1); vibrate(); }} className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${isDark ? 'border-zinc-700 bg-zinc-800 text-zinc-300' : 'border-slate-300 bg-slate-100 text-slate-600'}`}>
                  <Icon name="chevron-left" size={22} />
                </button>
              )}
              <div className="min-w-0 flex-1">
                <p className={`safe-text text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{step === 3 ? T.total : T.subtotal}</p>
                <p className="price-text text-lg font-semibold sm:text-xl">{formatMoney(step === 3 ? financials.total : financials.subtotal, lang)}</p>
              </div>
              <button
                type="button"
                onClick={handleNextStep}
                className={`flex min-h-12 min-w-[132px] shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-center text-xs font-bold uppercase tracking-wider transition-all sm:min-h-14 sm:px-7 sm:text-sm ${
                  isStepValid() ? (step === 3 ? 'bg-[#25D366] text-white shadow-lg shadow-green-900/40' : 'bg-blue-600 text-white shadow-lg shadow-blue-900/40') : isDark ? 'border border-zinc-700 bg-zinc-800 text-zinc-500' : 'border border-slate-200 bg-slate-100 text-slate-400'
                }`}
              >
                {step === 3 ? <Icon name="message" size={18} /> : null}
                <span className="safe-text">{step === 3 ? T.finish : T.continue}</span>
                {step !== 3 ? <Icon name="chevron-right" size={18} /> : null}
              </button>
            </div>
          </div>
        </nav>
      )}

      {selectedService && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md animate-fade-in sm:items-center">
          <div className={`mobile-card flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-[2.25rem] border shadow-2xl animate-scale-in ${isDark ? 'border-white/10 bg-[#11141a]' : 'border-slate-200 bg-white'}`}>
            <div className={`shrink-0 p-6 ${selectedService.type === 'pack' ? (isDark ? 'bg-amber-950/20' : 'bg-amber-50') : isDark ? 'bg-blue-950/20' : 'bg-blue-50'}`}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${selectedService.type === 'pack' ? 'border-amber-500/30 bg-amber-500/15 text-amber-400' : isDark ? 'border-white/15 bg-white/10 text-white' : 'border-slate-200 bg-white text-slate-800'}`}>
                  <Icon name={selectedService.icon} size={30} />
                </span>
                <button type="button" onClick={() => setSelectedService(null)} className={`flex h-10 w-10 items-center justify-center rounded-full ${isDark ? 'bg-black/25 text-white' : 'bg-white/80 text-slate-700'}`}>
                  <Icon name="x" size={20} />
                </button>
              </div>
              <span className={`safe-text rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${selectedService.type === 'pack' ? 'border-amber-500/30 bg-amber-500/15 text-amber-400' : isDark ? 'border-white/15 bg-white/10 text-zinc-300' : 'border-slate-200 bg-white text-slate-600'}`}>
                {selectedService.tag}
              </span>
              <h3 className="safe-text mt-3 text-2xl font-semibold leading-tight">{selectedService.title}</h3>
              <p className="price-text mt-4 text-2xl font-semibold">{formatMoney(selectedService.price, lang)}</p>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 scrollbar-hide ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              <p className="safe-text text-sm font-medium leading-relaxed">{selectedService.desc}</p>
              <div className="mt-5 space-y-3">
                {selectedService.details.split('\n').map((line) => (
                  <div key={line} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                      <Icon name="check" size={12} />
                    </span>
                    <span className="safe-text text-sm leading-relaxed">{line}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`shrink-0 border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Button full variant={booking.cart.some((item) => item.id === selectedService.id) ? 'outline' : selectedService.type === 'pack' ? 'amber' : 'primary'} onClick={() => toggleCartItem(selectedService)}>
                {booking.cart.some((item) => item.id === selectedService.id) ? 'Remover selecao' : 'Selecionar servico'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {termsOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-md animate-fade-in sm:items-center">
          <div className={`mobile-card flex max-h-[85vh] w-full max-w-xl flex-col rounded-[2.25rem] border shadow-2xl animate-scale-in ${isDark ? 'border-zinc-700 bg-[#11141a]' : 'border-slate-300 bg-white'}`}>
            <div className={`flex shrink-0 items-center justify-between gap-4 border-b p-5 sm:p-7 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <h3 className="safe-text text-2xl font-semibold">{T.termsTitle}</h3>
              <button type="button" onClick={() => setTermsOpen(false)} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'text-zinc-400 hover:bg-white/10 hover:text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto p-5 sm:p-7">
              {data.rules.map((rule) => (
                <div key={rule} className={`flex gap-4 rounded-2xl p-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isDark ? 'bg-blue-500/15 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Icon name="shield" size={20} />
                  </span>
                  <p className={`safe-text text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{rule}</p>
                </div>
              ))}
            </div>
            <div className={`shrink-0 border-t p-5 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <Button full onClick={() => { setBooking((prev) => ({ ...prev, termsAccepted: true })); setTermsOpen(false); unlockPageScroll(); vibrate(); }}>
                {T.acceptTerms}
              </Button>
            </div>
          </div>
        </div>
      )}

      {welcomeOpen && (
        <div className="fixed inset-0 z-[90] flex items-end justify-center overflow-y-auto bg-black/90 p-5 backdrop-blur-md animate-fade-in sm:items-center">
          <div className={`mobile-card w-full max-w-md rounded-[2.25rem] border p-7 shadow-2xl animate-scale-in sm:p-9 ${isDark ? 'border-zinc-700 bg-[#11141a]' : 'border-slate-300 bg-white'}`}>
            <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl ${isDark ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400' : 'border border-blue-200 bg-blue-50 text-blue-600'}`}>
              <Icon name="gift" size={30} />
            </div>
            <h3 className="safe-text text-3xl font-semibold">{lang === 'en' ? 'Welcome!' : 'Que bom ter voce aqui!'}</h3>
            <p className={`safe-text mt-3 text-base leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.giftText}</p>
            <div className={`my-6 rounded-2xl border border-dashed p-5 text-center ${isDark ? 'border-blue-500/40 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
              <p className={`safe-text text-xs font-bold uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Seu presente</p>
              <p className="safe-text mt-2 text-3xl font-semibold tracking-widest">BEMVINDO10</p>
            </div>
            <Button full onClick={claimWelcomeCoupon}>
              {T.claimGift}
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
