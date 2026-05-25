import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { ChangeEvent, Dispatch, ReactNode, SetStateAction } from 'react';

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/relaxarhojesp',
  PROFILE_PHOTO_URL: 'https://i.ibb.co/gZxp3Dwz/Screenshot-1.png',
  STORAGE_KEY: '@thalyson_booking_mobile_first_v1',
  PIX_KEY: '62.922.530/0001-14',
  LOCALE: 'pt-BR',
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_FEE: 15,
  MAX_STORAGE_KB: 4500,
} as const;

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];

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
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
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

const vibrate = (pattern: number | number[] = 20) => {
  try {
    const nav = navigator as Navigator & { vibrate?: (value: number | number[]) => boolean };
    nav.vibrate?.(pattern);
  } catch {
    // Dispositivos sem vibração seguem normalmente.
  }
};

const unlockPageScroll = () => {
  if (typeof document === 'undefined') return;
  document.documentElement.style.overflow = '';
  document.documentElement.style.touchAction = '';
  document.body.style.overflow = '';
  document.body.style.touchAction = '';
};

const formatMoney = (value: number) => {
  const amount = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(CONFIG.LOCALE, {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2,
  }).format(amount);
};

const dateToInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const welcomeCoupon: Coupon = { id: 'welcome', val: 10, title: 'Primeira visita', code: 'BEMVINDO10' };

const categories = [
  { id: 'express' as Category, title: 'Alívio rápido', desc: 'Sessões objetivas para aliviar pontos específicos e sair mais leve.' },
  { id: 'relax' as Category, title: 'Relaxar e recuperar', desc: 'Ritual completo para soltar o corpo, baixar a tensão e recuperar energia.' },
  { id: 'premium' as Category, title: 'Experiências premium', desc: 'Atendimentos sensoriais com fluxo claro, privacidade, consentimento e cuidado.' },
  { id: 'care' as Category, title: 'Cuidado corporal', desc: 'Complementos de estética e preparo para uma experiência mais confortável.' },
];

const services: ServiceItem[] = [
  {
    id: 'pes',
    category: 'express',
    min: 40,
    price: 110,
    icon: 'user',
    tag: 'ALÍVIO NOS PÉS',
    title: 'Massagem nos Pés',
    desc: 'Foco em pés cansados, inchaço, pressão acumulada e aquela sensação de peso no fim do dia.',
    details: ['Reflexologia na sola dos pés', 'Pressão em pontos de tensão', 'Mobilidade nos tornozelos', 'Finalização leve para relaxamento geral'],
  },
  {
    id: 'maos',
    category: 'express',
    min: 40,
    price: 110,
    icon: 'hand',
    tag: 'ALÍVIO NAS MÃOS',
    title: 'Massagem nas Mãos',
    desc: 'Solta mãos, punhos e antebraços depois de digitar, dirigir ou repetir movimentos por horas.',
    details: ['Mobilidade dos dedos', 'Pressão em palma e punhos', 'Liberação de antebraços', 'Finalização calma para conforto articular'],
  },
  {
    id: 'relaxante',
    category: 'relax',
    min: 40,
    price: 157,
    icon: 'sun',
    tag: 'CORPO TODO',
    title: 'Massagem Clássica',
    desc: 'Sessão relaxante para costas, ombros, pescoço, pernas, braços e pés, com pressão ajustada ao seu corpo.',
    details: ['Massagem relaxante de corpo todo', 'Ritmo terapêutico e sem pressa', 'Pressão combinada no início', 'Foco em alívio, presença e bem-estar'],
    highlight: true,
  },
  {
    id: 'crossfit',
    category: 'relax',
    min: 60,
    price: 187,
    icon: 'shield',
    tag: 'RECUPERAÇÃO',
    title: 'Massagem para Atletas',
    desc: 'Para quem treina pesado ou vive com músculos sobrecarregados. Começa relaxante e avança para uma pegada mais firme.',
    details: ['Aquecimento com base relaxante', 'Trabalho firme nas áreas travadas', 'Costas, pernas, ombros e braços conforme necessidade', 'Ideal para recuperação e mobilidade'],
  },
  {
    id: 'sensitiva',
    category: 'premium',
    min: 60,
    price: 177,
    icon: 'sparkles',
    tag: 'SENSORIAL',
    title: 'Massagem Sensorial',
    desc: 'Um cuidado gradual: primeiro o corpo desacelera, depois o toque fica mais lento, suave e imersivo.',
    details: ['Início com relaxamento de corpo todo', 'Toque sensorial leve e progressivo', 'Limites alinhados com clareza', 'Encerramento combinado com privacidade e respeito'],
  },
  {
    id: 'mista',
    category: 'premium',
    min: 60,
    price: 207,
    icon: 'heart',
    tag: 'FUSION',
    title: 'Experiência Fusion',
    desc: 'Combina relaxamento, presença sensorial e um clima mais próximo, sempre com consentimento e comunicação clara.',
    details: ['Base relaxante no corpo todo', 'Ritmo sensorial gradual', 'Atenção à parte posterior e anterior do corpo', 'Finalização combinada no atendimento'],
    highlight: true,
  },
  {
    id: 'nuru',
    category: 'premium',
    min: 60,
    price: 317,
    icon: 'star',
    tag: 'PREMIUM',
    title: 'Massagem Nuru',
    desc: 'Experiência premium com gel de deslizamento, pensada para entrega, conforto e uma conexão corporal mais intensa.',
    details: ['Preparação relaxante do corpo', 'Uso de gel próprio para deslizamento', 'Movimentos contínuos e envolventes', 'Limites e preferências alinhados antes da sessão'],
  },
  {
    id: 'depilacao',
    category: 'care',
    min: 60,
    price: 107,
    icon: 'scissors',
    tag: 'ESTÉTICA',
    title: 'Aparo de Pelos do Corpo',
    desc: 'Cuidado prático para sensação de pele mais limpa, leve e confortável antes ou depois da sessão.',
    details: ['Aparo com máquina em áreas escolhidas', 'Peito, abdômen, costas ou pernas', 'Acabamento cuidadoso e discreto', 'Indicado para conforto e estética'],
  },
];

const plans: ServiceItem[] = [
  {
    id: 'pack_basic',
    type: 'pack',
    min: 60,
    title: 'Alívio de Rotina (2x)',
    price: 247,
    fullPrice: 284,
    savings: 37,
    desc: 'Duas sessões no mês para manter o corpo em dia, com bônus de aromaterapia.',
    details: ['1x Massagem nos Pés', '1x Massagem Clássica', 'Aromaterapia nas duas sessões', 'Agendamentos separados durante o mês'],
    tag: 'RELAX',
    icon: 'layers',
  },
  {
    id: 'pack_essencial',
    type: 'pack',
    min: 60,
    title: 'Kit Sobrevivência (2x)',
    price: 297,
    fullPrice: 334,
    savings: 37,
    desc: 'Um encontro para tirar dores do corpo e outro para desacelerar a mente.',
    details: ['1x Massagem Clássica', '1x Massagem Sensorial', 'Ideal para rotina intensa', 'Melhor custo-benefício para voltar ao eixo'],
    tag: 'DURMA BEM',
    icon: 'sun',
    highlight: true,
  },
  {
    id: 'pack_glow',
    type: 'pack',
    min: 60,
    title: 'Renovação Completa (2x)',
    price: 327,
    fullPrice: 391,
    savings: 64,
    desc: 'Dia de cuidado estético e dia de experiência sensorial com tempo extra.',
    details: ['1x Aparo de Pelos do Corpo', '1x Experiência Fusion', 'Bônus de +30 minutos na Fusion', 'Para autoestima, conforto e presença corporal'],
    tag: 'GLOW UP',
    icon: 'sparkles',
  },
  {
    id: 'pack_muscle',
    type: 'pack',
    min: 60,
    title: 'Combo Recuperação (2x)',
    price: 347,
    fullPrice: 408,
    savings: 61,
    desc: 'Duas sessões focadas em recuperação física para quem treina ou sente dores recorrentes.',
    details: ['2x Massagem para Atletas', 'Foco extra em pontos de dor', 'Atendimentos separados', 'Ideal para costas, pernas e ombros'],
    tag: 'MÚSCULOS',
    icon: 'zap',
  },
  {
    id: 'pack_premium',
    type: 'pack',
    min: 60,
    title: 'Mensalidade do Chefe (3x)',
    price: 637,
    fullPrice: 721,
    savings: 84,
    desc: 'Três semanas de cuidado premium para transformar o mês em uma rotina mais leve.',
    details: ['1x sessão relaxante premium', '1x Experiência Fusion', '1x Massagem Nuru', 'Três encontros para manter relaxamento e presença'],
    tag: 'VIP',
    icon: 'award',
  },
];

const extras: ExtraItem[] = [
  { id: 'hair_trim', price: 57, icon: 'scissors', label: 'Aparo de Pelos', desc: 'Aparo com máquina em até duas áreas do corpo, com privacidade e acabamento limpo.' },
  { id: 'more_time', price: 77, icon: 'clock', label: '+30 Minutos', desc: 'Mais tempo para a sessão respirar, desacelerar e terminar sem pressa.' },
  { id: 'touch', price: 77, icon: 'hand', label: 'Interação Orgânica', desc: 'Participação mais ativa e toques recíprocos, sempre com consentimento.' },
  { id: 'aroma', price: 17, icon: 'sparkles', label: 'Aromaterapia', desc: 'Óleos essenciais no ambiente e no corpo para aprofundar o relaxamento.' },
  { id: 'pain_relief', price: 17, icon: 'shield', label: 'Foco em Dor', desc: 'Atenção extra em áreas travadas com pressão firme e confortável.' },
  { id: 'dominador', price: 180, icon: 'zap', label: 'Condução Intensa', desc: 'Postura mais ativa e comandada na parte final da experiência.' },
  { id: 'oral', price: 120, icon: 'heart', label: 'Estímulo Oral', desc: 'Adicional combinado com consentimento, higiene e limites claros.' },
  { id: 'beijos', price: 77, icon: 'heart', label: 'Beijos e Intimidade', desc: 'Mais conexão física e afetuosa durante a etapa sensorial.' },
  { id: 'prostatico', price: 120, icon: 'star', label: 'Massagem Prostática', desc: 'Estimulação interna somente com consentimento explícito e lubrificação adequada.' },
];

const rules = [
  'Atendimento exclusivo para maiores de 18 anos.',
  'Tome uma ducha antes do atendimento e avise qualquer condição de saúde relevante.',
  'Respeito, consentimento e comunicação clara são obrigatórios durante toda a sessão.',
  'Taxa de deslocamento, endereço final e detalhes de segurança são confirmados pelo WhatsApp.',
];

const copy = {
  brand: 'Thalyson Massagens',
  professional: 'Técnico em Massagens',
  attended: 'homens já atendidos',
  welcome: 'Agendamento premium, direto e sem enrolação.',
  welcomeSub: 'Escolha o atendimento, defina local e horário, revise tudo e envie a mensagem pronta no WhatsApp.',
  chooseSub: 'Um fluxo enxuto para você comparar sessões, montar sua experiência e confirmar com clareza.',
  tabSingle: 'Sessões avulsas',
  tabPacks: 'Planos mensais',
  continue: 'Continuar',
  finish: 'Enviar no WhatsApp',
  back: 'Voltar',
  remove: 'Remover',
  select: 'Selecionar',
  selected: 'Selecionado',
  name: 'Seu nome ou apelido',
  locationTitle: 'Onde será o atendimento?',
  locationSub: 'Informe seu nome e escolha o tipo de local. Só pedimos endereço completo quando ele for necessário.',
  whenTitle: 'Escolha data e horário',
  whenSub: 'Horários de hoje aparecem apenas quando ainda estão disponíveis.',
  summaryTitle: 'Revise seu agendamento',
  summarySub: 'Adicione complementos, aplique benefícios e escolha a forma de pagamento.',
  extrasTitle: 'Complementos opcionais',
  couponTitle: 'Benefício disponível',
  couponEmpty: 'Nenhum benefício disponível agora.',
  paymentTitle: 'Forma de pagamento',
  termsTitle: 'Regras do atendimento',
  acceptTerms: 'Li e aceito as regras',
  total: 'Total',
  subtotal: 'Subtotal',
  discount: 'Cupom',
  pixDiscount: 'Desconto Pix',
  mediaDiscount: 'Desconto Portfólio',
  rushFee: 'Taxa de pico',
  duration: 'Duração',
  home: 'Residência',
  motel: 'Minha suíte',
  hotel: 'Hotel',
  cep: 'CEP do local',
  street: 'Rua ou avenida',
  number: 'Número',
  district: 'Bairro',
  city: 'Cidade',
  comp: 'Complemento ou quarto',
  hotelName: 'Nome do hotel',
  pix: 'Pix — 3% OFF',
  card: 'Cartão',
  cash: 'Dinheiro',
  mediaTitle: 'Apoiar meu portfólio',
  mediaDesc: 'Permitir fotos estéticas anônimas e ganhar 1% OFF.',
  toastCart: 'Seleção atualizada.',
  toastCoupon: 'Benefício aplicado.',
  toastCouponRemoved: 'Benefício removido.',
  toastName: 'Preencha seu nome corretamente.',
  toastAddr: 'Preencha o local completo.',
  toastDate: 'Selecione data e horário.',
  toastPayment: 'Escolha pagamento e aceite as regras.',
  toastCepFound: 'Endereço encontrado pelo CEP.',
  toastCepError: 'CEP não encontrado.',
  toastPix: 'Chave PIX copiada.',
  toastNeedService: 'Selecione pelo menos um serviço.',
  successTitle: 'Tudo certo. Falta só confirmar.',
  successSub: 'O WhatsApp abriu com a mensagem pronta. Revise e envie para confirmar o atendimento.',
  whatsapp: 'Abrir WhatsApp novamente',
  startOver: 'Novo agendamento',
  today: 'HOJE',
  tomorrow: 'AMANHÃ',
  claimGift: 'Pegar benefício',
  giftText: 'Primeira visita com benefício liberado.',
  serviceDetails: 'O que está incluso',
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

const Button = memo(
  ({
    children,
    onClick,
    variant = 'primary',
    disabled = false,
    full = false,
    icon,
    className = '',
  }: {
    children: ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'whatsapp' | 'outline' | 'accent' | 'ghost';
    disabled?: boolean;
    full?: boolean;
    icon?: string;
    className?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`button button--${variant} ${full ? 'button--full' : ''} ${className}`}
    >
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  ),
);
Button.displayName = 'Button';

const ToastStack = memo(({ toasts }: { toasts: Toast[] }) => (
  <div className="toast-stack" aria-live="polite">
    {toasts.map((toast) => (
      <div key={toast.id} role="alert" className={`toast toast--${toast.type}`}>
        <span className="toast__icon">
          <Icon name={toast.type === 'error' ? 'x' : 'check'} size={16} />
        </span>
        <span>{toast.msg}</span>
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
    placeholder,
    type = 'text',
    icon,
    disabled = false,
    maxLength,
    error = false,
  }: {
    label: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    icon?: string;
    disabled?: boolean;
    maxLength?: number;
    error?: boolean;
  }) => (
    <label className={`field ${error ? 'field--error' : ''}`}>
      <span className="field__label">{label}</span>
      <span className="field__control">
        {icon && (
          <span className="field__icon">
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
        />
      </span>
    </label>
  ),
);
InputField.displayName = 'InputField';

const SectionHeader = memo(({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) => (
  <div className="section-header">
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {desc && <p>{desc}</p>}
  </div>
));
SectionHeader.displayName = 'SectionHeader';

const ServiceCard = memo(
  ({ item, selected, onOpen }: { item: ServiceItem; selected: boolean; onOpen: () => void }) => (
    <button type="button" onClick={onOpen} className={`service-card ${selected ? 'is-selected' : ''} ${item.type === 'pack' ? 'is-pack' : ''}`}>
      <span className="service-card__topline">
        <span className="service-card__icon">
          <Icon name={item.icon} size={23} />
        </span>
        {item.highlight && !selected && <span className="badge badge--blue">Popular</span>}
        {selected && (
          <span className="service-card__check">
            <Icon name="check" size={16} />
          </span>
        )}
      </span>

      <span className="service-card__body">
        <span className="service-card__tag">{item.tag}</span>
        <strong>{item.title}</strong>
        <span>{item.desc}</span>
      </span>

      <span className="service-card__meta">
        <span>{item.min} min</span>
        <span>{formatMoney(item.price)}</span>
      </span>
    </button>
  ),
);
ServiceCard.displayName = 'ServiceCard';

const ModalShell = memo(
  ({ children, onClose, max = 'modal--md' }: { children: ReactNode; onClose: () => void; max?: 'modal--sm' | 'modal--md' }) => (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${max}`} onMouseDown={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  ),
);
ModalShell.displayName = 'ModalShell';

const SummaryLine = memo(({ label, value, tone = 'normal' }: { label: ReactNode; value: ReactNode; tone?: 'normal' | 'success' | 'warning' }) => (
  <div className={`summary-line summary-line--${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
));
SummaryLine.displayName = 'SummaryLine';

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<Step>(0);
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState<'single' | 'packs'>('single');
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hasError, setHasError] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [user, setUser] = useState<UserData>(() => createInitialUser());
  const [booking, setBooking] = useState<BookingData>(() => createInitialBooking());

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
      const parsed = JSON.parse(stored) as Partial<{ user: Partial<UserData>; booking: Partial<BookingData>; step: Step; isDark: boolean }>;

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
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    } finally {
      window.setTimeout(() => setLoading(false), 200);
    }
  }, [isClient]);

  useEffect(() => {
    if (!isClient || loading) return;
    const payload = JSON.stringify({ user: { ...user, lastActivity: new Date().toISOString() }, booking, step, isDark });
    if (payload.length < CONFIG.MAX_STORAGE_KB * 1024) {
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, payload);
      } catch {
        // Storage pode falhar em modo privado.
      }
    }
  }, [booking, isClient, isDark, loading, step, user]);

  useEffect(() => {
    if (!isClient || loading || user.hasSeenWelcome) return;
    const timer = window.setTimeout(() => setWelcomeOpen(true), 600);
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
    addToast(copy.toastCart);
    window.requestAnimationFrame(unlockPageScroll);
  }, [addToast]);

  const applyCoupon = useCallback((coupon: Coupon) => {
    setBooking((prev) => {
      const removing = prev.appliedCoupon?.id === coupon.id;
      window.setTimeout(() => addToast(removing ? copy.toastCouponRemoved : copy.toastCoupon), 0);
      return { ...prev, appliedCoupon: removing ? null : coupon };
    });
  }, [addToast]);

  const claimWelcomeCoupon = useCallback(() => {
    setWelcomeOpen(false);
    setUser((prev) => ({
      ...prev,
      hasSeenWelcome: true,
      coupons: prev.coupons.some((item) => item.id === welcomeCoupon.id) ? prev.coupons : [...prev.coupons, welcomeCoupon],
    }));
    setBooking((prev) => ({ ...prev, appliedCoupon: welcomeCoupon }));
    addToast(copy.toastCoupon);
    vibrate([45, 80]);
    window.requestAnimationFrame(unlockPageScroll);
  }, [addToast]);

  const handleCepChange = useCallback(async (event: ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(event.target.value);
    setBooking((prev) => ({ ...prev, address: { ...prev.address, cep: masked } }));
    if (masked.length !== 9) return;

    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
      const result = await response.json();
      if (result.erro) {
        addToast(copy.toastCepError, 'error');
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
      addToast(copy.toastCepFound);
    } catch {
      addToast(copy.toastCepError, 'error');
    } finally {
      setIsFetchingCep(false);
    }
  }, [addToast]);

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
    if (date.toDateString() === today.toDateString()) return copy.today;
    if (date.toDateString() === tomorrow.toDateString()) return copy.tomorrow;
    return date.toLocaleDateString(CONFIG.LOCALE, { weekday: 'short' }).slice(0, 3).toUpperCase();
  }, []);

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
      const extra = extras.find((item) => item.id === id);
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
  }, [booking]);

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
    const date = booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(CONFIG.LOCALE) : '';
    const items = booking.cart.map((item) => `- ${item.title} (${formatMoney(item.price)})`).join('\n');
    const selectedExtras = Object.entries(booking.extras)
      .filter(([, selected]) => selected)
      .map(([id]) => extras.find((extra) => extra.id === id)?.label)
      .filter(Boolean)
      .map((label) => `+ ${label}`)
      .join('\n');

    const location = booking.locationType === 'home'
      ? `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}${booking.address.comp ? ` - ${booking.address.comp}` : ''}`
      : booking.locationType === 'hotel'
        ? `${booking.address.placeName}, ${booking.address.city}${booking.address.comp ? ` - ${booking.address.comp}` : ''}`
        : 'Suíte privada, endereço confirmado pelo WhatsApp';

    return `*PEDIDO DE AGENDAMENTO*

Nome: ${sanitizeInput(user.name)}
Data: ${date} às ${booking.time}
Duração estimada: ${financials.duration} min

Serviços:
${items}

${selectedExtras ? `Complementos:\n${selectedExtras}\n\n` : ''}Local:
${location}

Pagamento: ${booking.payment.toUpperCase()}
Total: ${formatMoney(financials.total)}

Li e aceito as regras. Aguardo sua confirmação.`.trim();
  }, [booking, financials.duration, financials.total, user.name]);

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
      const message = step === 0 ? copy.toastNeedService : step === 1 ? (!user.name || user.name.trim().length < 3 ? copy.toastName : copy.toastAddr) : step === 2 ? copy.toastDate : copy.toastPayment;
      addToast(message, 'error');
      vibrate([45, 45]);
      return;
    }
    if (step === 3) {
      finishBooking();
      return;
    }
    vibrate();
    setStep((prev) => Math.min(prev + 1, 4) as Step);
  }, [addToast, finishBooking, isStepValid, step, user.name]);

  const handleBackStep = useCallback(() => {
    if (step <= 0) return;
    setStep((prev) => Math.max(prev - 1, 0) as Step);
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
      addToast(copy.toastPix);
    } catch {
      addToast(CONFIG.PIX_KEY);
    }
  }, [addToast]);

  if (!isClient) return <div className="app-boot theme-dark" />;

  if (loading) {
    return (
      <div className={`app-boot ${isDark ? 'theme-dark' : 'theme-light'}`}>
        <div className="loader-card">
          <div className="logo-mark">T</div>
          <p>Carregando</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`app ${isDark ? 'theme-dark' : 'theme-light'}`}>
      <ToastStack toasts={toasts} />

      <main className="page-shell">
        {step !== 4 && (
          <header className="site-header">
            <div className="site-header__top">
              <button type="button" onClick={() => setStep(0)} className="brand-lockup">
                <span>{copy.brand}</span>
                <small>+{user.ordersCount} {copy.attended}</small>
              </button>

              <div className="header-actions">
                <button type="button" onClick={() => setIsDark((prev) => !prev)} className="icon-button" aria-label="Trocar tema">
                  <Icon name="sun" size={20} />
                </button>
                <button type="button" onClick={() => openExternal('instagram')} className="icon-button icon-button--pink" aria-label="Abrir Instagram">
                  <Icon name="instagram" size={20} />
                </button>
              </div>
            </div>

            <Stepper step={step} setStep={setStep} />
          </header>
        )}

        {step === 0 && (
          <section className="step-flow animate-in">
            <div className="hero-grid">
              <div className="hero-copy">
                <p className="eyebrow">Agendamento mobile-first</p>
                <h1>
                  {copy.welcome}
                  <span>{user.name ? user.name.trim().split(' ')[0] : 'Seu momento começa aqui.'}</span>
                </h1>
                <p>{copy.welcomeSub}</p>
                <div className="hero-metrics" aria-label="Resumo do atendimento">
                  <span><strong>{services.length}</strong> sessões</span>
                  <span><strong>{plans.length}</strong> planos</span>
                  <span><strong>WhatsApp</strong> confirmação</span>
                </div>
              </div>

              <figure className="profile-card">
                <img src={CONFIG.PROFILE_PHOTO_URL} alt="Foto de Thalyson" />
                <figcaption>
                  <span>{copy.professional}</span>
                  <strong>{copy.brand}</strong>
                </figcaption>
              </figure>
            </div>

            <div className="tab-switch" role="tablist" aria-label="Tipo de atendimento">
              {[
                { id: 'single' as const, label: copy.tabSingle, icon: 'user' },
                { id: 'packs' as const, label: copy.tabPacks, icon: 'package' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={activeTab === tab.id ? 'is-active' : ''}
                >
                  <Icon name={tab.icon} size={18} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'single' ? (
              <div className="catalog-stack">
                {categories.map((category) => {
                  const items = services.filter((service) => service.category === category.id);
                  if (!items.length) return null;
                  return (
                    <section key={category.id} className="catalog-section">
                      <SectionHeader title={category.title} desc={category.desc} />
                      <div className="service-grid">
                        {items.map((service) => (
                          <ServiceCard
                            key={service.id}
                            item={service}
                            selected={booking.cart.some((item) => item.id === service.id)}
                            onOpen={() => setSelectedService(service)}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            ) : (
              <section className="catalog-section">
                <SectionHeader title={copy.tabPacks} desc="Escolha um plano por vez, compare economia e mantenha sua rotina de cuidado no mês." />
                <div className="service-grid">
                  {plans.map((plan) => (
                    <ServiceCard key={plan.id} item={plan} selected={booking.cart.some((item) => item.id === plan.id)} onOpen={() => setSelectedService(plan)} />
                  ))}
                </div>
              </section>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="flow-layout animate-in">
            <div className="flow-main">
              <SectionHeader title={copy.locationTitle} desc={copy.locationSub} />

              <div className="choice-grid choice-grid--location">
                {[
                  { id: 'home' as LocationType, label: copy.home, icon: 'home' },
                  { id: 'motel' as LocationType, label: copy.motel, icon: 'bed' },
                  { id: 'hotel' as LocationType, label: copy.hotel, icon: 'building' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setBooking((prev) => ({ ...prev, locationType: item.id, address: item.id === prev.locationType ? prev.address : { ...prev.address } }))}
                    className={booking.locationType === item.id ? 'choice-card is-selected' : 'choice-card'}
                  >
                    <Icon name={item.icon} size={26} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="form-panel">
                <InputField label={copy.name} value={user.name} onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))} icon="user" error={hasError && user.name.trim().length < 3} />

                {booking.locationType === 'home' && (
                  <div className="form-grid">
                    <div className="span-2">
                      <InputField label={copy.cep} value={booking.address.cep} onChange={handleCepChange} icon="map" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} />
                    </div>
                    <div className="span-2">
                      <InputField label={copy.street} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.street} />
                    </div>
                    <InputField label={copy.number} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value, 20) } }))} type="tel" error={hasError && !booking.address.number} />
                    <InputField label={copy.district} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.district} />
                    <InputField label={copy.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                    <InputField label={copy.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="form-grid">
                    <div className="span-2">
                      <InputField label={copy.hotelName} value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} icon="building" error={hasError && !booking.address.placeName} />
                    </div>
                    <InputField label={copy.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} error={hasError && !booking.address.city} />
                    <InputField label={copy.comp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className="info-callout">
                    <Icon name="shield" size={20} />
                    <p>O endereço da suíte é confirmado pelo WhatsApp depois do pedido de agendamento.</p>
                  </div>
                )}
              </div>
            </div>
            <SummaryPanel booking={booking} financials={financials} step={step} onCopyPix={copyPix} />
          </section>
        )}

        {step === 2 && (
          <section className="flow-layout animate-in">
            <div className="flow-main">
              <SectionHeader title={copy.whenTitle} desc={copy.whenSub} />
              <div className="calendar-panel">
                <div className="date-strip" aria-label="Escolha a data">
                  {daysArray.map((date) => {
                    const value = dateToInputValue(date);
                    const selected = booking.date === value;
                    return (
                      <button key={value} type="button" onClick={() => setBooking((prev) => ({ ...prev, date: value, time: null }))} className={selected ? 'date-card is-selected' : 'date-card'}>
                        <span>{getDayLabel(date)}</span>
                        <strong>{date.getDate()}</strong>
                        <small>{date.toLocaleDateString(CONFIG.LOCALE, { month: 'short' })}</small>
                      </button>
                    );
                  })}
                </div>

                <div className="time-grid" aria-label="Escolha o horário">
                  {timeSlots.map((time) => {
                    const selected = booking.time === time;
                    const rush = RUSH_HOURS.includes(time);
                    return (
                      <button key={time} type="button" onClick={() => setBooking((prev) => ({ ...prev, time }))} className={selected ? 'time-card is-selected' : 'time-card'}>
                        <span>{time}</span>
                        {rush && <small>+{formatMoney(CONFIG.RUSH_FEE)}</small>}
                      </button>
                    );
                  })}
                </div>
                {booking.date && !timeSlots.length && <p className="empty-hint">Não há horários disponíveis para esta data.</p>}
              </div>
            </div>
            <SummaryPanel booking={booking} financials={financials} step={step} onCopyPix={copyPix} />
          </section>
        )}

        {step === 3 && (
          <section className="flow-layout animate-in">
            <div className="flow-main">
              <SectionHeader title={copy.summaryTitle} desc={copy.summarySub} />

              <section className="review-section">
                <h3>{copy.extrasTitle}</h3>
                <div className="extras-grid">
                  {extras.map((extra) => {
                    const selected = Boolean(booking.extras[extra.id]);
                    return (
                      <button
                        key={extra.id}
                        type="button"
                        onClick={() => setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }))}
                        className={selected ? 'extra-card is-selected' : 'extra-card'}
                      >
                        <span className="extra-card__icon"><Icon name={extra.icon} size={20} /></span>
                        <span className="extra-card__copy">
                          <strong>{extra.label}</strong>
                          <small>{extra.desc}</small>
                        </span>
                        {selected && <Icon name="check" size={18} className="extra-card__check" />}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="review-section">
                <h3>{copy.couponTitle}</h3>
                {user.coupons.length ? (
                  <div className="coupon-list">
                    {user.coupons.map((coupon) => {
                      const selected = booking.appliedCoupon?.id === coupon.id;
                      return (
                        <button key={coupon.id} type="button" onClick={() => applyCoupon(coupon)} className={selected ? 'coupon-card is-selected' : 'coupon-card'}>
                          <span className="coupon-card__icon"><Icon name="ticket" size={20} /></span>
                          <span>
                            <strong>{coupon.code}</strong>
                            <small>{coupon.title} · {formatMoney(coupon.val)} OFF</small>
                          </span>
                          {selected && <Icon name="check" size={18} />}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="empty-hint">{copy.couponEmpty}</p>
                )}
              </section>

              <section className="review-section">
                <h3>{copy.paymentTitle}</h3>
                <div className="choice-grid">
                  {[
                    { id: 'pix' as PaymentMethod, label: copy.pix, icon: 'cash' },
                    { id: 'card' as PaymentMethod, label: copy.card, icon: 'card' },
                    { id: 'cash' as PaymentMethod, label: copy.cash, icon: 'cash' },
                  ].map((method) => (
                    <button key={method.id} type="button" onClick={() => setBooking((prev) => ({ ...prev, payment: method.id }))} className={booking.payment === method.id ? 'choice-card is-selected' : 'choice-card'}>
                      <Icon name={method.icon} size={22} />
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>
                {booking.payment === 'pix' && <Button variant="outline" full onClick={copyPix} icon="cash">{CONFIG.PIX_KEY}</Button>}
              </section>

              <section className="review-section">
                <button
                  type="button"
                  onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))}
                  className={booking.mediaAllowed ? 'consent-card is-selected' : 'consent-card'}
                >
                  <span className="consent-card__icon"><Icon name="sparkles" size={20} /></span>
                  <span>
                    <strong>{copy.mediaTitle}</strong>
                    <small>{copy.mediaDesc}</small>
                  </span>
                  {booking.mediaAllowed && <Icon name="check" size={18} />}
                </button>

                <button type="button" onClick={() => setTermsOpen(true)} className={`consent-card ${booking.termsAccepted ? 'is-selected' : ''} ${hasError && !booking.termsAccepted ? 'has-error' : ''}`}>
                  <span className="consent-card__icon"><Icon name="shield" size={20} /></span>
                  <span>
                    <strong>{copy.termsTitle}</strong>
                    <small>{booking.termsAccepted ? 'Regras aceitas para continuar.' : 'Leia e confirme antes de enviar.'}</small>
                  </span>
                  {booking.termsAccepted ? <Icon name="check" size={18} /> : <Icon name="right" size={18} />}
                </button>
              </section>
            </div>
            <SummaryPanel booking={booking} financials={financials} step={step} onCopyPix={copyPix} />
          </section>
        )}

        {step === 4 && (
          <section className="success-screen animate-in">
            <div className="success-card">
              <div className="success-card__icon"><Icon name="check" size={34} /></div>
              <h1>{copy.successTitle}</h1>
              <p>{copy.successSub}</p>
              <div className="success-actions">
                <Button full variant="whatsapp" icon="message" onClick={() => openExternal('whatsapp', bookingMessage)}>{copy.whatsapp}</Button>
                <Button full variant="outline" onClick={resetApp}>{copy.startOver}</Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {step !== 4 && (
        <div className="mobile-action-bar">
          <div className="mobile-action-bar__inner">
            {step > 0 ? (
              <Button variant="outline" onClick={handleBackStep} icon="left" className="button--compact">{copy.back}</Button>
            ) : (
              <div className="mobile-total">
                <span>Total</span>
                <strong>{formatMoney(financials.total)}</strong>
              </div>
            )}
            <Button variant={step === 3 ? 'whatsapp' : 'primary'} onClick={handleNextStep} icon={step === 3 ? 'message' : 'right'} className="button--next">
              {step === 3 ? copy.finish : copy.continue}
            </Button>
          </div>
        </div>
      )}

      {selectedService && (
        <ModalShell onClose={closeAllModals}>
          <div className="modal__header">
            <div>
              <p className="eyebrow">{selectedService.tag}</p>
              <h3>{selectedService.title}</h3>
            </div>
            <button type="button" onClick={closeAllModals} className="icon-button" aria-label="Fechar">
              <Icon name="x" size={22} />
            </button>
          </div>

          <div className="modal__body">
            <div className="service-detail">
              <p>{selectedService.desc}</p>
              <div className="service-detail__facts">
                <span>
                  <small>{copy.duration}</small>
                  <strong>{selectedService.min} min</strong>
                </span>
                <span>
                  <small>Investimento</small>
                  <strong>{formatMoney(selectedService.price)}</strong>
                </span>
                {selectedService.savings && (
                  <span>
                    <small>Economia</small>
                    <strong>{formatMoney(selectedService.savings)}</strong>
                  </span>
                )}
              </div>
            </div>

            <div className="included-list">
              <h4>{copy.serviceDetails}</h4>
              {selectedService.details.map((detail) => (
                <div key={detail} className="included-list__item">
                  <Icon name="check" size={16} />
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="modal__footer">
            <Button full variant={booking.cart.some((item) => item.id === selectedService.id) ? 'outline' : selectedService.type === 'pack' ? 'accent' : 'primary'} onClick={() => toggleCartItem(selectedService)}>
              {booking.cart.some((item) => item.id === selectedService.id) ? copy.remove : copy.select}
            </Button>
          </div>
        </ModalShell>
      )}

      {termsOpen && (
        <ModalShell onClose={() => setTermsOpen(false)}>
          <div className="modal__header">
            <h3>{copy.termsTitle}</h3>
            <button type="button" onClick={() => setTermsOpen(false)} className="icon-button" aria-label="Fechar">
              <Icon name="x" size={22} />
            </button>
          </div>
          <div className="modal__body">
            <div className="rule-list">
              {rules.map((rule) => (
                <div key={rule} className="rule-item">
                  <Icon name="shield" size={20} />
                  <p>{rule}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="modal__footer">
            <Button full onClick={() => { setBooking((prev) => ({ ...prev, termsAccepted: true })); setTermsOpen(false); vibrate(); window.requestAnimationFrame(unlockPageScroll); }}>{copy.acceptTerms}</Button>
          </div>
        </ModalShell>
      )}

      {welcomeOpen && (
        <ModalShell onClose={() => { setWelcomeOpen(false); setUser((prev) => ({ ...prev, hasSeenWelcome: true })); }} max="modal--sm">
          <div className="welcome-modal">
            <div className="welcome-modal__icon"><Icon name="gift" size={30} /></div>
            <h3>{copy.giftText}</h3>
            <p>Use agora ou deixe aplicado para a etapa de revisão.</p>
            <div className="coupon-stamp">
              <span>Cupom</span>
              <strong>BEMVINDO10</strong>
            </div>
            <Button full onClick={claimWelcomeCoupon} icon="gift">{copy.claimGift}</Button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

function Stepper({ step, setStep }: { step: Step; setStep: Dispatch<SetStateAction<Step>> }) {
  const steps = ['Serviço', 'Local', 'Horário', 'Resumo'];
  return (
    <nav className="stepper" aria-label="Etapas do agendamento">
      {steps.map((label, index) => (
        <button
          key={label}
          type="button"
          onClick={() => index < step && setStep(index as Step)}
          disabled={index > step}
          className={step >= index ? 'is-active' : ''}
          aria-current={step === index ? 'step' : undefined}
        >
          <span />
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

function SummaryPanel({
  booking,
  financials,
  step,
  onCopyPix,
}: {
  booking: BookingData;
  financials: { subtotal: number; couponDiscount: number; mediaDiscount: number; pixDiscount: number; rushFee: number; total: number; duration: number };
  step: Step;
  onCopyPix: () => void;
}) {
  const selectedExtras = extras.filter((extra) => booking.extras[extra.id]);
  const dateLabel = booking.date ? new Date(`${booking.date}T00:00:00`).toLocaleDateString(CONFIG.LOCALE) : 'Ainda não escolhido';
  const timeLabel = booking.time || 'Ainda não escolhido';
  const locationLabel =
    booking.locationType === 'home'
      ? booking.address.street
        ? `${booking.address.street}${booking.address.number ? `, ${booking.address.number}` : ''}${booking.address.district ? ` - ${booking.address.district}` : ''}${booking.address.city ? `, ${booking.address.city}` : ''}`
        : copy.home
      : booking.locationType === 'hotel'
        ? booking.address.placeName || copy.hotel
        : copy.motel;

  return (
    <aside className="summary-panel" aria-label="Resumo do agendamento">
      <div className="summary-panel__header">
        <div>
          <p className="eyebrow">Fluxo do agendamento</p>
          <h3>{copy.summaryTitle}</h3>
        </div>
        <span>{financials.duration} min</span>
      </div>

      <div className="summary-block">
        <p>Sessões escolhidas</p>
        <div className="summary-list">
          {booking.cart.length ? booking.cart.map((item) => (
            <div key={item.id}>
              <Icon name="check" size={15} />
              <span>{item.title}</span>
            </div>
          )) : <small>{copy.toastNeedService}</small>}
        </div>
      </div>

      <div className="summary-block">
        <p>{copy.extrasTitle}</p>
        <div className="summary-list">
          {selectedExtras.length ? selectedExtras.map((extra) => (
            <div key={extra.id}>
              <Icon name={extra.icon} size={15} />
              <span>{extra.label}</span>
            </div>
          )) : <small>Nenhum complemento selecionado.</small>}
        </div>
      </div>

      <div className="summary-block summary-block--grid">
        <div>
          <p>Data e horário</p>
          <strong>{dateLabel} · {timeLabel}</strong>
        </div>
        <div>
          <p>Local</p>
          <strong>{locationLabel}</strong>
        </div>
      </div>

      <div className="summary-divider" />

      {step === 3 ? (
        <>
          <div className="summary-lines">
            <SummaryLine label={copy.subtotal} value={formatMoney(financials.subtotal)} />
            {financials.couponDiscount > 0 && <SummaryLine label={copy.discount} value={`- ${formatMoney(financials.couponDiscount)}`} tone="success" />}
            {financials.mediaDiscount > 0 && <SummaryLine label={copy.mediaDiscount} value={`- ${formatMoney(financials.mediaDiscount)}`} tone="success" />}
            {financials.pixDiscount > 0 && <SummaryLine label={copy.pixDiscount} value={`- ${formatMoney(financials.pixDiscount)}`} tone="success" />}
            {financials.rushFee > 0 && <SummaryLine label={copy.rushFee} value={`+ ${formatMoney(financials.rushFee)}`} tone="warning" />}
          </div>

          <div className="total-box">
            <span>{copy.total}</span>
            <strong>{formatMoney(financials.total)}</strong>
          </div>

          {booking.payment === 'pix' && (
            <button type="button" onClick={onCopyPix} className="pix-copy">{CONFIG.PIX_KEY}</button>
          )}
        </>
      ) : (
        <div className="summary-tip">
          <strong>Próximo passo claro.</strong>
          <span>Sessão, local, data e revisão antes do envio no WhatsApp.</span>
        </div>
      )}
    </aside>
  );
}
