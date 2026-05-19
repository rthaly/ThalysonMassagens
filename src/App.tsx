import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

// =====================================================================================
// THALY MASSAGENS — AGENDAMENTO PROGRESSIVO
// Fluxo Simplificado Passo a Passo com Copy Premium
// =====================================================================================

type Category = 'all' | 'express' | 'relax' | 'final' | 'care';
type LocationType = 'home' | 'hotel' | 'motel';
type PaymentMethod = '' | 'pix' | 'card' | 'cash';
type ChoiceType = 'service' | '';

type IconName =
  | 'check' | 'x' | 'arrow' | 'sun' | 'moon' | 'star' | 'sparkles'
  | 'zap' | 'package' | 'layers' | 'user' | 'home' | 'bed'
  | 'building' | 'map-pin' | 'calendar' | 'message' | 'watch'
  | 'credit-card' | 'banknote' | 'shield' | 'shower' | 'hand'
  | 'scissors' | 'heart' | 'award' | 'gift' | 'tag' | 'send' | 'clock';

type ServiceItem = {
  id: string;
  category: Exclude<Category, 'all'>;
  min: number;
  price: number;
  icon: IconName;
  tag: string;
  title: string;
  desc: string;
  details: string[];
  result: string;
  popular?: boolean;
};

type ExtraItem = {
  id: string;
  price: number;
  icon: IconName;
  title: string;
  desc: string;
};

type Address = {
  cep: string;
  street: string;
  number: string;
  district: string;
  city: string;
  comp: string;
  placeName: string;
};

type Coupon = {
  id: string;
  title: string;
  code: string;
  val: number;
};

type UserData = {
  name: string;
  xp: number;
  coupons: Coupon[];
  usedCoupons: string[];
  ordersCount: number;
};

type BookingData = {
  choiceType: ChoiceType;
  serviceId: string;
  extras: Record<string, boolean>;
  date: string;
  time: string;
  locationType: LocationType;
  address: Address;
  payment: PaymentMethod;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  mediaAllowed: boolean;
  bookingId: string;
  customerName: string;
};

type Toast = {
  id: number;
  type: 'success' | 'error';
  msg: string;
};

const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://instagram.com/thalyson.massagens',
  STORAGE_KEY: '@thaly_app_v30_premium',
  PIX_KEY: '62.922.530/0001-14',
  VERSION: 'v30_progressivo_premium',
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_HOURS: ['12:00', '13:00', '17:00', '18:00'],
  RUSH_FEE: 15,
} as const;

const ICON_PATHS: Record<IconName, string> = {
  check: 'M20 6L9 17l-5-5',
  x: 'M18 6L6 18M6 6l12 12',
  arrow: 'M5 12h14 M13 5l7 7-7 7',
  sun: 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  sparkles: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  package: 'M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  bed: 'M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9',
  building: 'M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01',
  'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  calendar: 'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  message: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  watch: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2',
  'credit-card': 'M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z',
  banknote: 'M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shower: 'M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16',
  hand: 'M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3',
  scissors: 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  award: 'M12 15l-2 5-9-9 9-9 9 9-9 9-2-5',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
  send: 'M22 2L11 13 M22 2L15 22l-4-9-9-4 22-7z',
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
};

const PRICES = {
  depil: 107,
  relax: 157,
  sens: 177,
  naturista: 197,
  titan: 207,
  reversa: 280,
  nuru: 317,
  crossfit: 187,
  pes: 110,
  maos: 110,
  extras: {
    moreTime: 77,
    touch: 77,
    aroma: 17,
    hairTrim: 57,
    painRelief: 17,
    active: 180,
    sensory: 120,
    kisses: 77,
    guided: 120,
  },
};

const SERVICES: ServiceItem[] = [
  {
    id: 'pes',
    category: 'express',
    min: 40,
    price: PRICES.pes,
    icon: 'user',
    tag: 'ALÍVIO RÁPIDO',
    title: 'Massagem nos Pés',
    desc: 'Descanso rápido e direto para quem fica muito tempo em pé. Você vai sentir os pés mais leves na hora.',
    details: ['Massagem focada na sola dos pés e calcanhares.', 'Aperto profundo em pontos de dor acumulada.', 'Liberação total de tensões na base do corpo.'],
    result: 'Pés descansados e corpo menos tenso.',
  },
  {
    id: 'maos',
    category: 'express',
    min: 40,
    price: PRICES.maos,
    icon: 'hand',
    tag: 'ALÍVIO RÁPIDO',
    title: 'Massagem nas Mãos',
    desc: 'Tira a dor e o cansaço dos braços e punhos. Ideal para quem trabalha muito no computador ou celular.',
    details: ['Alongamento profundo dos dedos e punhos.', 'Massagem firme na palma das mãos.', 'Alívio direto nos braços e antebraços cansados.'],
    result: 'Mãos leves e braços sem dores musculares.',
  },
  {
    id: 'relaxante',
    category: 'relax',
    min: 40,
    price: PRICES.relax,
    icon: 'user',
    tag: 'RELAXAMENTO FÍSICO',
    title: 'Massagem Clássica',
    desc: 'Foco total em tirar as dores e os nós das suas costas. Perfeita para quem está com o corpo rígido e travado.',
    details: ['Massagem forte com as mãos e rolos.', 'Foco nas costas, ombros e pescoço.', 'Desmancha todos os nós de tensão e estresse.'],
    result: 'Corpo completamente solto, sem dores e pronto para descansar.',
  },
  {
    id: 'naturista',
    category: 'relax',
    min: 40,
    price: PRICES.naturista,
    icon: 'sun',
    tag: 'LIBERDADE',
    title: 'Massagem Naturista',
    desc: 'Sessão no corpo inteiro, feita completamente sem roupas. Para você se sentir totalmente livre e à vontade.',
    details: ['Sessão realizada com nós dois sem roupas.', 'Técnicas de relaxamento para desmanchar a dor do corpo.', 'Ambiente totalmente sem julgamentos e acolhedor.'],
    result: 'Sensação absoluta de liberdade e relaxamento físico.',
  },
  {
    id: 'crossfit',
    category: 'relax',
    min: 60,
    price: PRICES.crossfit,
    icon: 'zap',
    tag: 'RECUPERAÇÃO',
    title: 'Massagem Desportiva',
    desc: 'Massagem com muita pressão para aliviar músculos doloridos e ajudar na recuperação de quem treina pesado.',
    details: ['Fricção profunda para soltar os músculos cansados.', 'Uso de pomadas que esquentam e tiram a dor.', 'Foco nas pernas, costas e ombros.'],
    result: 'Músculos recuperados e dores aliviadas para o próximo treino.',
  },
  {
    id: 'sensitiva',
    category: 'final',
    min: 60,
    price: PRICES.sens,
    icon: 'sparkles',
    tag: 'RELAXAMENTO MENTAL',
    title: 'Massagem Sensorial',
    desc: 'Todas as sessões sensoriais iniciam com a massagem clássica relaxante para soltar o corpo. Depois, transicionamos para toques extremamente suaves que causam arrepios e despertam o tesão.',
    details: ['Aquecimento com massagem clássica inicial nas costas.', 'Estímulos suaves e instigantes que percorrem o corpo inteiro.', 'A sessão termina com uma finalização manual focada no seu prazer absoluto.'],
    result: 'Estresse zerado e clímax profundamente satisfatório.',
  },
  {
    id: 'mista',
    category: 'final',
    min: 60,
    price: PRICES.titan,
    icon: 'zap',
    tag: 'INTENSA E COMPLETA',
    title: 'Massagem Fusion',
    desc: 'A mais desejada. Iniciamos com a clássica relaxante para tirar todas as dores. Depois, o clima esquenta: eu fico apenas de cueca para um contato corpo a corpo sedutor, elevando o tesão ao máximo.',
    details: ['Massagem relaxante inicial para remover a rigidez muscular.', 'Mudo o traje (apenas cueca) para um contato físico intenso e sedutor.', 'Finalização perfeita e dedicada para você chegar ao clímax e zerar o estresse.'],
    result: 'Corpo sem dores, curiosidade saciada e mente extasiada.',
  },
  {
    id: 'reversa',
    category: 'final',
    min: 60,
    price: PRICES.reversa,
    icon: 'heart',
    tag: 'TROCA DE CARINHO',
    title: 'Massagem Reversa',
    desc: 'Começamos com a massagem clássica. Nos primeiros 30 minutos, o foco é cuidar de você. Depois, você assume o controle e faz a massagem em mim. Tudo termina com uma finalização mútua e envolvente.',
    details: ['Receba 30 minutos de relaxamento absoluto com massagem.', 'Inversão: você assume o controle, me toca e explora.', 'A sessão culmina na finalização (clímax) de ambos, criando uma conexão real.'],
    result: 'Tesão saciado e uma conexão humana profunda e inesquecível.',
  },
  {
    id: 'nuru',
    category: 'final',
    min: 60,
    price: PRICES.nuru,
    icon: 'star',
    tag: 'MÁXIMO CONTATO',
    title: 'Massagem Nuru',
    desc: 'Tudo começa com a massagem clássica para aquecer os músculos. Em seguida, usamos muito gel deslizante para um contato extremo de pele com pele. Uma experiência feita para fazer as pernas tremerem.',
    details: ['Massagem clássica inicial para aquecer o corpo.', 'Uso de gel corporal deslizando meu corpo inteiro sobre o seu.', 'Máxima proximidade física que termina em uma finalização intensa.'],
    result: 'O ápice do prazer físico. Você vai esquecer de todos os problemas.',
    popular: true,
  },
  {
    id: 'depilacao',
    category: 'care',
    min: 60,
    price: PRICES.depil,
    icon: 'scissors',
    tag: 'ESTÉTICA',
    title: 'Aparo de Pelos',
    desc: 'Cuido da sua aparência. Aparo os pelos do seu corpo com máquina de forma confortável, rápida e higiênica.',
    details: ['Uso de máquina profissional.', 'Você escolhe as regiões (peito, costas, pernas).', 'Serviço executado sem dor e no seu conforto.'],
    result: 'Corpo visualmente limpo, fresco e bem cuidado.',
  },
];

const EXTRAS: ExtraItem[] = [
  { id: 'hair_trim', price: PRICES.extras.hairTrim, icon: 'scissors', title: 'Aparo de Pelos', desc: 'Aparo de até 2 áreas do corpo para renovar o visual.' },
  { id: 'more_time', price: PRICES.extras.moreTime, icon: 'clock', title: '+30 Minutos', desc: 'Tempo adicional para prolongar a sua experiência de prazer.' },
  { id: 'touch', price: PRICES.extras.touch, icon: 'hand', title: 'Liberdade para Tocar', desc: 'Sinta-se à vontade para me tocar e retribuir as carícias.' },
  { id: 'aroma', price: PRICES.extras.aroma, icon: 'sparkles', title: 'Aromaterapia', desc: 'Óleos essenciais com aromas que preparam a mente para relaxar.' },
  { id: 'pain_relief', price: PRICES.extras.painRelief, icon: 'shield', title: 'Foco em Dor', desc: 'Uso de pomadas térmicas potentes nas áreas mais travadas.' },
  { id: 'dominador', price: PRICES.extras.active, icon: 'zap', title: 'Postura Dominadora', desc: 'Eu assumo o controle total da sessão com uma postura ativa.' },
  { id: 'oral', price: PRICES.extras.sensory, icon: 'heart', title: 'Estímulo Oral', desc: 'Contato quente e direto para maximizar a sua experiência e clímax.' },
  { id: 'beijos', price: PRICES.extras.kisses, icon: 'heart', title: 'Beijos e Intimidade', desc: 'Beijos na boca e conexão física totalmente liberada durante a sessão.' },
  { id: 'prostatico', price: PRICES.extras.guided, icon: 'star', title: 'Massagem Prostática', desc: 'Estimulação interna focada para um nível de prazer ainda mais profundo.' },
];

const RULES = [
  { icon: 'shower' as IconName, title: 'Banho antes da sessão', desc: 'A água quente relaxa os músculos e mantém a higiene, deixando o contato físico muito mais agradável e focado.' },
  { icon: 'shield' as IconName, title: 'Saúde em dia', desc: 'É fundamental não apresentar lesões abertas ou gripes para mantermos a segurança e o bem-estar de nós dois.' },
  { icon: 'hand' as IconName, title: 'Respeito mútuo', desc: 'Meu objetivo principal é cuidar de você e te dar prazer. O respeito recíproco garante que o clima fique excelente.' },
  { icon: 'heart' as IconName, title: 'Entrega total', desc: 'Deixe as preocupações do trabalho lá fora. O momento aqui é exclusivamente seu. Feche os olhos e sinta.' },
];

const REVIEWS = [
  { name: 'Gustavo', service: 'Massagem Fusion', text: 'O Thalyson chegou na hora certa. A experiência em casa foi incrível. Mãos com técnica sem igual, levantei parecendo 10kg mais leve.' },
  { name: 'Giovana', service: 'Massagem Sensorial', text: 'Você tem mãos abençoadas! Precisava muito desse descanso. Foi super respeitoso a todo tempo e me relaxou demais.' },
  { name: 'Bruno', service: 'Massagem Clássica', text: 'Quero dizer que sua massagem foi muito bem executada. Recomendo muito o trabalho.' },
  { name: 'Lucas', service: 'Massagem Nuru', text: 'A discrição era minha prioridade e fui atendido com total sigilo. A massagem me permitiu redescobrir meu próprio corpo. Sensacional.' },
  { name: 'Marcelo', service: 'Massagem Fusion', text: 'A parte do contato corpo a corpo é indescritível. A finalização me deixou nas nuvens, todo o estresse da semana sumiu na hora.' },
  { name: 'Rafael', service: 'Massagem Reversa', text: 'Poder tocar e ter essa troca foi a melhor experiência. A finalização dos dois juntos cria um clima único e muito gostoso.' },
  { name: 'Thiago', service: 'Massagem Nuru', text: 'Deslizar com o gel e sentir aquele contato pele a pele... O tesão vai a mil. A finalização foi intensa, recomendo de olhos fechados.' },
  { name: 'Rodrigo', service: 'Massagem Sensorial', text: 'O início relaxante prepara o corpo perfeitamente. A finalização foi feita com tanta técnica que saí renovado e leve.' },
  { name: 'Fernando', service: 'Massagem Fusion', text: 'Ver ele atendendo de cueca já muda o clima da sala inteira. A transição da massagem relaxante para o clímax final é absurda de boa.' },
  { name: 'Alexandre', service: 'Massagem Reversa', text: 'Nunca tinha experimentado algo assim. Os 30 minutos finais onde pude tocar e chegarmos lá juntos foi inesquecível. Vale muito.' },
  { name: 'Caio', service: 'Massagem Sensorial', text: 'Toques que arrepiam a alma. O momento da liberação e a finalização tiraram um peso gigantesco das minhas costas.' },
  { name: 'Henrique', service: 'Massagem Nuru', text: 'Intimidade surreal. A clássica no começo tira a dor, e o contato com o gel junto com a finalização te levam pra outro mundo.' },
  { name: 'Felipe', service: 'Massagem Fusion', text: 'Profissionalismo e tesão na medida certa. O toque firme, a proximidade do corpo dele e a finalização impecável. Voltarei.' },
  { name: 'Diego', service: 'Massagem Reversa', text: 'Vale cada centavo investido. Poder trocar carícias sem pressa e ter a finalização mútua me fez sentir extremamente acolhido e satisfeito.' },
];

const CATEGORIES = [
  { id: 'all' as Category, label: 'Todas' },
  { id: 'express' as Category, label: 'Rápidas' },
  { id: 'relax' as Category, label: 'Tira Dor' },
  { id: 'final' as Category, label: 'Relaxar e Finalizar' },
  { id: 'care' as Category, label: 'Estética' },
];

const emptyAddress: Address = { cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' };
const emptyBooking = (): BookingData => ({
  choiceType: '',
  serviceId: '',
  extras: {},
  date: '',
  time: '',
  locationType: 'motel',
  address: emptyAddress,
  payment: '',
  appliedCoupon: null,
  termsAccepted: false,
  mediaAllowed: false,
  bookingId: `THALY-${Date.now().toString(36).toUpperCase()}`,
  customerName: '',
});

const defaultUser: UserData = {
  name: '',
  xp: 0,
  coupons: [{ id: 'WELCOME_V30', title: 'Desconto de Primeira Vez', code: 'BEMVINDO', val: 15 }],
  usedCoupons: [],
  ordersCount: 92,
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function money(value: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number.isFinite(value) ? value : 0);
}

function digits(value: string) {
  return String(value || '').replace(/[^0-9]/g, '');
}

function clean(value: string) {
  return String(value || '').replace(/[<>&"']/g, '').trim();
}

function maskCep(value: string) {
  const raw = digits(value).slice(0, 8);
  return raw.length > 5 ? `${raw.slice(0, 5)}-${raw.slice(5)}` : raw;
}

function dateLabel(iso: string) {
  if (!iso) return '';
  return new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace('.', '');
}

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.85" strokeLinecap="round" strokeLinejoin="round" className={cx('shrink-0', className)} aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

const GlobalStyles = memo(({ dark }: { dark: boolean }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
    :root {
      color-scheme: ${dark ? 'dark' : 'light'};
      --bg: ${dark ? '#11141A' : '#FAF8F5'};
      --surface: ${dark ? '#181C25' : '#FFFFFF'};
      --surface-2: ${dark ? '#202632' : '#F2ECE5'};
      --text: ${dark ? '#F3F0EA' : '#25211D'};
      --muted: ${dark ? '#A7A29B' : '#726960'};
      --line: ${dark ? 'rgba(255,255,255,.09)' : 'rgba(37,33,29,.10)'};
      --soft: ${dark ? 'rgba(255,255,255,.055)' : 'rgba(37,33,29,.045)'};
      --primary: #2563EB;
      --accent: #F59E0B;
      --page: clamp(16px, 4vw, 48px);
      --radius: clamp(18px, 4vw, 30px);
      --h1: clamp(2.15rem, 8vw, 5.2rem);
      --h2: clamp(1.45rem, 4vw, 2.6rem);
      --bottom: 104px;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { margin: 0; min-width: 320px; overflow-x: hidden; background: var(--bg); color: var(--text); font-family: Poppins, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    button, input { font: inherit; }
    input { font-size: 16px; }
    button { -webkit-tap-highlight-color: transparent; }
    summary::-webkit-details-marker { display: none; }
    .hide-scroll::-webkit-scrollbar { display: none; }
    .hide-scroll { scrollbar-width: none; -ms-overflow-style: none; }
    .focus:focus-visible { outline: 3px solid rgba(37,99,235,.35); outline-offset: 3px; }
    .safe-bottom { padding-bottom: max(14px, env(safe-area-inset-bottom)); }
    .bg-page { background: radial-gradient(circle at 12% 0%, rgba(37,99,235,.13), transparent 28rem), radial-gradient(circle at 88% 8%, rgba(245,158,11,.12), transparent 26rem), var(--bg); }
    @media (min-width: 1024px) { :root { --bottom: 0px; } }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  `}</style>
));

function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'premium';
  className?: string;
  icon?: IconName;
  disabled?: boolean;
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-950/20',
    secondary: 'border border-[var(--line)] bg-[var(--surface-2)] text-[var(--text)] hover:border-blue-500/40',
    ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--soft)] border border-transparent',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20BF5B] shadow-lg shadow-green-950/20',
    premium: 'bg-amber-500 text-zinc-950 hover:bg-amber-400 shadow-lg shadow-amber-950/20',
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cx('focus inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-45', variants[variant], className)}>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  icon,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">{label}</span>
      <span className="flex min-h-14 items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 focus-within:border-blue-500/60 focus-within:ring-4 focus-within:ring-blue-500/10">
        {icon && <Icon name={icon} size={18} className="text-blue-500" />}
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} inputMode={inputMode} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-[var(--muted)]" />
      </span>
    </label>
  );
}

function Toasts({ items }: { items: Toast[] }) {
  return (
    <div className="pointer-events-none fixed left-0 right-0 top-4 z-[90] mx-auto grid w-full max-w-md gap-2 px-4">
      {items.map((item) => (
        <div key={item.id} className={cx('pointer-events-auto rounded-2xl border px-4 py-3 text-sm font-bold shadow-xl backdrop-blur', item.type === 'error' ? 'border-red-500/30 bg-red-950 text-red-50' : 'border-blue-500/25 bg-[var(--surface)] text-[var(--text)]')}>
          {item.msg}
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ label, title, hint }: { label: string; title: string; hint?: string }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-blue-500">{label}</p>
      <h2 className="max-w-3xl text-[length:var(--h2)] font-bold leading-[1.04] tracking-[-.055em]">{title}</h2>
      {hint && <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

function Header({ dark, setDark }: { dark: boolean; setDark: (value: boolean) => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg)]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-[68px] w-full max-w-screen-2xl items-center justify-between gap-3 px-[var(--page)]">
        <a href="#top" className="focus flex min-w-0 items-center gap-3 rounded-2xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-lg font-bold text-white">T</span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">Thalyson Massagens</span>
            <span className="block truncate text-xs text-[var(--muted)]">Atendimento e acolhimento</span>
          </span>
        </a>
        <button type="button" onClick={() => setDark(!dark)} className="focus flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)]" aria-label="Alternar tema">
          <Icon name={dark ? 'sun' : 'moon'} size={18} />
        </button>
      </div>
    </header>
  );
}

function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section id="top" className="grid gap-5 py-7 sm:py-10">
      <div className="min-w-0">
        <span className="mb-4 inline-flex rounded-full bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[.16em] text-blue-500">Espaço de Acolhimento</span>
        <h1 className="max-w-5xl text-[length:var(--h1)] font-bold leading-[.9] tracking-[-.075em]">Sinta o prazer do cuidado.</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">Deixe a rotina lá fora. Escolha a experiência que vai aliviar suas dores físicas e proporcionar a melhor finalização para sua mente.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onStart} icon="arrow">Agendar Sessão</Button>
        </div>
      </div>
    </section>
  );
}

function CategoryTabs({ value, onChange }: { value: Category; onChange: (value: Category) => void }) {
  return (
    <div className="hide-scroll -mx-[var(--page)] mb-5 flex gap-2 overflow-x-auto px-[var(--page)] sm:mx-0 sm:flex-wrap sm:px-0">
      {CATEGORIES.map((item) => (
        <button key={item.id} type="button" onClick={() => onChange(item.id)} className={cx('focus flex min-w-fit items-center rounded-full border px-4 py-3 text-sm font-bold transition', value === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--line)] bg-[var(--surface)] hover:border-blue-500/40')}>
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ServiceCard({ item, selected, onSelect }: { item: ServiceItem; selected: boolean; onSelect: () => void }) {
  return (
    <article className={cx('min-w-0 rounded-[var(--radius)] border bg-[var(--surface)] p-4 transition sm:p-5', selected ? 'border-blue-600 shadow-xl shadow-blue-950/10' : 'border-[var(--line)] hover:border-blue-500/40')}>
      <div className="grid min-w-0 gap-4 lg:grid-cols-12 lg:items-start">
        <div className="min-w-0 lg:col-span-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className={cx('flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl', selected ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-500')}>
                <Icon name={item.icon} size={21} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-[.16em] text-blue-500">{item.tag}</p>
                <h3 className="mt-1 text-lg font-bold leading-tight tracking-[-.04em] sm:text-xl">{item.title}</h3>
              </div>
            </div>
            {item.popular && <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-1 text-[10px] font-bold text-amber-500">mais desejada</span>}
          </div>
          <p className="text-sm leading-6 text-[var(--muted)]">{item.desc}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-[var(--soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Valor</p>
              <p className="mt-1 text-lg font-bold">{money(item.price)}</p>
            </div>
            <div className="rounded-2xl bg-[var(--soft)] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">Tempo</p>
              <p className="mt-1 text-lg font-bold">{item.min} min</p>
            </div>
          </div>
          <Button onClick={onSelect} className="mt-4 w-full sm:w-auto" variant={selected ? 'secondary' : 'primary'} icon={selected ? 'check' : undefined}>{selected ? 'Selecionada' : 'Selecionar'}</Button>
        </div>

        <details className="min-w-0 rounded-3xl bg-[var(--soft)] p-4 lg:col-span-7" open={selected}>
          <summary className="focus flex cursor-pointer items-center justify-between gap-3 rounded-2xl text-sm font-bold">
            <span>Como vai funcionar a sua sessão:</span>
            <Icon name="arrow" size={17} />
          </summary>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="min-w-0 space-y-3">
              {item.details.map((step, index) => (
                <p key={index} className="grid grid-cols-[28px_minmax(0,1fr)] gap-3 text-sm leading-6">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">{index + 1}</span>
                  <span>{step}</span>
                </p>
              ))}
            </div>
            <div className="min-w-0 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
              <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--muted)]">O Resultado</p>
              <p className="mt-2 text-sm leading-6 font-medium">{item.result}</p>
            </div>
          </div>
        </details>
      </div>
    </article>
  );
}

function ExtraCard({ item, active, onToggle }: { item: ExtraItem; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} className={cx('focus flex min-w-0 items-start gap-3 rounded-3xl border bg-[var(--surface)] p-4 text-left transition', active ? 'border-blue-600' : 'border-[var(--line)] hover:border-blue-500/40')}>
      <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl', active ? 'bg-blue-600 text-white' : 'bg-blue-500/10 text-blue-500')}>
        <Icon name={item.icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold">{item.title}</span>
        <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">{item.desc}</span>
        <span className="mt-2 block text-sm font-bold text-blue-500">+ {money(item.price)}</span>
      </span>
      {active && <Icon name="check" size={18} className="text-blue-500" />}
    </button>
  );
}

function DateTime({ booking, setBooking }: { booking: BookingData; setBooking: React.Dispatch<React.SetStateAction<BookingData>> }) {
  const days = useMemo(() => Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    const iso = date.toISOString().slice(0, 10);
    const label = index === 0 ? 'Hoje' : index === 1 ? 'Amanhã' : dateLabel(iso);
    return { iso, label };
  }), []);

  const times = useMemo(() => {
    const list: string[] = [];
    const now = new Date();
    const todayIso = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 10);
    const isToday = booking.date === todayIso;
    const currentHour = now.getHours();

    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour += 1) {
      if (isToday && hour <= currentHour) continue;
      list.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return list;
  }, [booking.date]);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:col-span-5">
        <h3 className="text-lg font-bold">Escolha o Dia</h3>
        <div className="hide-scroll mt-4 flex gap-2 overflow-x-auto pb-1 lg:grid lg:grid-cols-2 lg:overflow-visible">
          {days.map((day) => (
            <button key={day.iso} type="button" onClick={() => setBooking((current) => ({ ...current, date: day.iso, time: '' }))} className={cx('focus min-w-[112px] rounded-2xl border px-4 py-4 text-left text-sm font-bold', booking.date === day.iso ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--line)] bg-[var(--surface-2)]')}>
              {day.label}
            </button>
          ))}
        </div>
      </div>
      <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:col-span-7">
        <h3 className="text-lg font-bold">Escolha o Horário</h3>
        {booking.date ? (
          <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-5">
            {times.length > 0 ? times.map((time) => {
              const rush = CONFIG.RUSH_HOURS.includes(time as typeof CONFIG.RUSH_HOURS[number]);
              return (
                <button key={time} type="button" onClick={() => setBooking((current) => ({ ...current, time }))} className={cx('focus min-h-[58px] rounded-2xl border px-2 py-2 text-center', booking.time === time ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--line)] bg-[var(--surface-2)]')}>
                  <span className="block text-sm font-bold">{time}</span>
                  {rush && <span className={cx('mt-1 block text-[10px] font-bold', booking.time === time ? 'text-white/75' : 'text-amber-500')}>pico</span>}
                </button>
              );
            }) : (
              <p className="col-span-full py-4 text-sm text-[var(--muted)]">Horários encerrados para este dia. Escolha outra data.</p>
            )}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--muted)]">Selecione um dia no calendário primeiro.</p>
        )}
      </div>
    </div>
  );
}

function LocationForm({ booking, setBooking, toast }: { booking: BookingData; setBooking: React.Dispatch<React.SetStateAction<BookingData>>; toast: (msg: string, type?: Toast['type']) => void }) {
  const updateAddress = (patch: Partial<Address>) => setBooking((current) => ({ ...current, address: { ...current.address, ...patch } }));

  const findCep = async (value: string) => {
    const next = maskCep(value);
    const raw = digits(next);
    updateAddress({ cep: next });
    if (raw.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
      const data = await response.json();
      if (data.erro) throw new Error('cep');
      updateAddress({ cep: next, street: data.logradouro || '', district: data.bairro || '', city: data.localidade || '' });
      toast('CEP encontrado.');
    } catch {
      toast('CEP não encontrado.', 'error');
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:col-span-4">
        <h3 className="text-lg font-bold">Como devo te chamar?</h3>
        <div className="mt-4 grid gap-4">
          <Field label="Nome ou Apelido" value={booking.customerName} onChange={(value) => setBooking((current) => ({ ...current, customerName: value }))} placeholder="Insira seu nome" icon="user" />
        </div>
      </div>
      <div className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:col-span-8">
        <h3 className="text-lg font-bold">Onde será a sessão?</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { id: 'motel', label: 'Suíte do massagista', icon: 'bed' as IconName },
            { id: 'home', label: 'Na sua casa', icon: 'home' as IconName },
            { id: 'hotel', label: 'Em um Hotel', icon: 'building' as IconName },
          ].map((item) => (
            <button key={item.id} type="button" onClick={() => setBooking((current) => ({ ...current, locationType: item.id as LocationType }))} className={cx('focus flex items-center justify-center gap-2 rounded-2xl border px-3 py-4 text-sm font-bold', booking.locationType === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--line)] bg-[var(--surface-2)]')}>
              <Icon name={item.icon} size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {booking.locationType === 'motel' ? (
          <p className="mt-4 rounded-2xl bg-blue-500/10 p-4 text-sm leading-6">O endereço completo da suíte será disponibilizado assim que você enviar o pedido finalizado.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {booking.locationType === 'hotel' && <div className="sm:col-span-2"><Field label="Hotel" value={booking.address.placeName} onChange={(value) => updateAddress({ placeName: value })} placeholder="Nome do hotel" icon="building" /></div>}
            <Field label="CEP" value={booking.address.cep} onChange={findCep} placeholder="00000-000" icon="map-pin" inputMode="numeric" />
            <Field label={booking.locationType === 'hotel' ? 'Quarto' : 'Número'} value={booking.address.number} onChange={(value) => updateAddress({ number: value })} placeholder="Número" icon="home" />
            <div className="sm:col-span-2"><Field label="Rua" value={booking.address.street} onChange={(value) => updateAddress({ street: value })} placeholder="Nome da rua" icon="map-pin" /></div>
            <Field label="Bairro" value={booking.address.district} onChange={(value) => updateAddress({ district: value })} placeholder="Bairro" icon="map-pin" />
            <Field label="Cidade" value={booking.address.city} onChange={(value) => updateAddress({ city: value })} placeholder="Cidade" icon="map-pin" />
            <div className="sm:col-span-2"><Field label="Complemento" value={booking.address.comp} onChange={(value) => updateAddress({ comp: value })} placeholder="Opcional" icon="map-pin" /></div>
          </div>
        )}
      </div>
    </div>
  );
}

function CouponBox({ user, booking, setBooking }: { user: UserData; booking: BookingData; setBooking: React.Dispatch<React.SetStateAction<BookingData>> }) {
  const availableCoupons = user.coupons.filter((coupon) => !user.usedCoupons.includes(coupon.code));

  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
      <h3 className="text-lg font-bold">Descontos</h3>
      {availableCoupons.length === 0 ? (
        <p className="mt-3 text-sm text-[var(--muted)]">Nenhum cupom disponível no momento.</p>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {availableCoupons.map((coupon) => {
            const active = booking.appliedCoupon?.code === coupon.code;
            return (
              <button key={coupon.id} type="button" onClick={() => setBooking((current) => ({ ...current, appliedCoupon: active ? null : coupon }))} className={cx('focus rounded-2xl border p-4 text-left transition', active ? 'border-amber-500 bg-amber-500 text-zinc-950' : 'border-[var(--line)] bg-[var(--surface-2)]')}>
                <p className="text-sm font-bold">{coupon.title}</p>
                <p className="mt-1 text-xs opacity-75">-{money(coupon.val)}</p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PaymentBox({ booking, setBooking }: { booking: BookingData; setBooking: React.Dispatch<React.SetStateAction<BookingData>> }) {
  const options = [
    { id: 'pix' as PaymentMethod, label: 'Pix', sub: '3% off', icon: 'banknote' as IconName },
    { id: 'card' as PaymentMethod, label: 'Cartão', sub: 'crédito/débito', icon: 'credit-card' as IconName },
    { id: 'cash' as PaymentMethod, label: 'Dinheiro', sub: 'no local', icon: 'banknote' as IconName },
  ];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
      <h3 className="text-lg font-bold">Forma de Pagamento</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {options.map((item) => (
          <button key={item.id} type="button" onClick={() => setBooking((current) => ({ ...current, payment: item.id }))} className={cx('focus rounded-2xl border p-4 text-left', booking.payment === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-[var(--line)] bg-[var(--surface-2)]')}>
            <Icon name={item.icon} size={18} />
            <span className="mt-3 block text-sm font-bold">{item.label}</span>
            <span className={cx('mt-1 block text-xs', booking.payment === item.id ? 'text-white/75' : 'text-[var(--muted)]')}>{item.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Summary({
  title,
  base,
  extras,
  rush,
  discount,
  total,
  booking,
}: {
  title: string;
  base: number;
  extras: number;
  rush: number;
  discount: number;
  total: number;
  booking: BookingData;
}) {
  return (
    <aside className="min-w-0 rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4 lg:sticky lg:top-24">
      <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-500">Valor Final</p>
      <h3 className="mt-2 text-3xl font-bold tracking-[-.06em]">{money(total)}</h3>
      <div className="mt-5 grid gap-3 text-sm">
        <Line label="Sessão" value={title || 'Nenhuma selecionada'} />
        <Line label="Dia/Hora" value={booking.date && booking.time ? `${dateLabel(booking.date)} às ${booking.time}` : 'Ainda não escolhido'} />
        <Line label="Valor Base" value={money(base)} />
        {extras > 0 && <Line label="Extras" value={`+ ${money(extras)}`} />}
        {rush > 0 && <Line label="Horário de Pico" value={`+ ${money(rush)}`} />}
        {discount > 0 && <Line label="Desconto" value={`- ${money(discount)}`} good />}
      </div>
    </aside>
  );
}

function Line({ label, value, good = false }: { label: string; value: string; good?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <strong className={cx('max-w-[190px] text-right', good ? 'text-blue-500' : 'text-[var(--text)]')}>{value}</strong>
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category>('all');
  const [booking, setBooking] = useState<BookingData>(emptyBooking);
  const [user, setUser] = useState<UserData>(defaultUser);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (parsed?.booking) setBooking({ ...emptyBooking(), ...parsed.booking });
      if (parsed?.user) setUser({ ...defaultUser, ...parsed.user });
    } catch {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ version: CONFIG.VERSION, booking, user }));
    } catch {
      // Ignore
    }
  }, [booking, user]);

  const toast = useCallback((msg: string, type: Toast['type'] = 'success') => {
    const id = Date.now();
    setToasts((current) => [...current.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((item) => item.id !== id)), 3000);
  }, []);

  const visibleServices = category === 'all' ? SERVICES : SERVICES.filter((item) => item.category === category);
  const selectedService = SERVICES.find((item) => item.id === booking.serviceId);
  const selectedExtras = EXTRAS.filter((item) => booking.extras[item.id]);

  const selectedTitle = selectedService?.title || '';
  const baseValue = selectedService?.price || 0;
  const baseDuration = selectedService?.min || 0;
  const extrasValue = selectedExtras.reduce((sum, item) => sum + item.price, 0);
  const rushFee = booking.time && CONFIG.RUSH_HOURS.includes(booking.time as typeof CONFIG.RUSH_HOURS[number]) && booking.locationType !== 'motel' ? CONFIG.RUSH_FEE : 0;
  const subtotal = baseValue + extrasValue + rushFee;
  const pixDiscount = booking.payment === 'pix' ? subtotal * 0.03 : 0;
  const mediaDiscount = booking.mediaAllowed ? subtotal * 0.01 : 0;
  const couponDiscount = booking.appliedCoupon?.val || 0;
  const discount = pixDiscount + mediaDiscount + couponDiscount;
  const total = Math.max(0, subtotal - discount);
  const finalDuration = baseDuration + (booking.extras.more_time ? 30 : 0);

  const validateStep = (targetStep: number) => {
    if (targetStep === 2 && !booking.serviceId) return toast('Escolha uma sessão para continuar.', 'error'), false;
    if (targetStep === 3 && (!booking.date || !booking.time)) return toast('Escolha o dia e o horário.', 'error'), false;
    if (targetStep === 4) {
      if (!clean(booking.customerName)) return toast('Por favor, preencha seu nome.', 'error'), false;
      if (booking.locationType === 'home' && (!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city)) return toast('Preencha o endereço completo.', 'error'), false;
      if (booking.locationType === 'hotel' && (!booking.address.placeName || !booking.address.number)) return toast('Preencha o nome do hotel e o quarto.', 'error'), false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step + 1)) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finish = () => {
    if (!booking.payment) return toast('Escolha a forma de pagamento.', 'error');
    if (!booking.termsAccepted) return toast('Você precisa aceitar as regras para finalizar.', 'error');

    const nl = String.fromCharCode(10);
    const address = booking.address;
    const location = booking.locationType === 'motel'
      ? 'Suíte do massagista — endereço será enviado por aqui'
      : booking.locationType === 'hotel'
        ? `${clean(address.placeName)}, quarto ${clean(address.number)}`
        : `${clean(address.street)}, ${clean(address.number)} - ${clean(address.district)}, ${clean(address.city)} ${address.comp ? `(${clean(address.comp)})` : ''}`;
    const extras = selectedExtras.length ? selectedExtras.map((item) => `• ${item.title} (+${money(item.price)})`).join(nl) : 'Nenhum';
    const payment = booking.payment === 'pix' ? 'Pix' : booking.payment === 'card' ? 'Cartão' : 'Dinheiro';

    const msg = [
      '*NOVO AGENDAMENTO*',
      '',
      `Pedido: ${booking.bookingId}`,
      `Nome: ${clean(booking.customerName)}`,
      `Sessão escolhida: ${selectedTitle}`,
      `Data e Hora: ${dateLabel(booking.date)} às ${booking.time}`,
      `Duração estimada: ${finalDuration} minutos`,
      `Local: ${location}`,
      '',
      'Complementos:',
      extras,
      '',
      `Pagamento: ${payment}`,
      `Valor Final: ${money(total)}`,
      booking.appliedCoupon ? `Cupom Usado: ${booking.appliedCoupon.title}` : '',
      '',
      'Confirmo que li e aceito as regras de higiene e entrega da sessão.'
    ].filter(Boolean).join(nl);

    setUser((current) => ({
      ...current,
      ordersCount: current.ordersCount + 1,
      usedCoupons: booking.appliedCoupon ? [...current.usedCoupons, booking.appliedCoupon.code] : current.usedCoupons,
    }));
    
    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-page min-h-[100dvh] pb-[calc(var(--bottom)+32px)] text-[var(--text)] lg:pb-12">
      <GlobalStyles dark={dark} />
      <Toasts items={toasts} />
      <Header dark={dark} setDark={setDark} />

      <main className="mx-auto w-full max-w-screen-2xl px-[var(--page)] pt-6">
        <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4 text-xs font-bold uppercase tracking-[.18em] text-[var(--muted)]">
          <span>Passo {step} de 5</span>
          <span className="text-blue-500">{step === 1 ? 'Sessão' : step === 2 ? 'Agenda' : step === 3 ? 'Local' : step === 4 ? 'Extras' : 'Confirmação'}</span>
        </div>

        {step === 1 && (
          <section className="animate-fade-up">
            <Hero onStart={() => document.getElementById('sessoes')?.scrollIntoView({ behavior: 'smooth' })} />
            <div id="sessoes" className="py-8">
              <SectionTitle label="01" title="Escolha a Massagem" hint="Selecione abaixo a experiência que vai transformar o seu dia." />
              <CategoryTabs value={category} onChange={setCategory} />
              <div className="grid gap-4">
                {visibleServices.map((item) => (
                  <ServiceCard
                    key={item.id}
                    item={item}
                    selected={booking.serviceId === item.id}
                    onSelect={() => {
                      setBooking((current) => ({ ...current, choiceType: 'service', serviceId: item.id }));
                      toast(`${item.title} selecionada.`);
                    }}
                  />
                ))}
              </div>
              <div className="mt-8 flex justify-end">
                <Button onClick={nextStep} icon="arrow" disabled={!booking.serviceId}>Continuar para Data e Hora</Button>
              </div>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-up py-8">
            <SectionTitle label="02" title="Data e Hora" hint="Escolha o melhor momento para o seu atendimento." />
            <DateTime booking={booking} setBooking={setBooking} />
            <div className="mt-8 flex justify-between">
              <Button onClick={prevStep} variant="ghost" icon="arrow" className="rotate-180-icon">Voltar</Button>
              <Button onClick={nextStep} icon="arrow" disabled={!booking.date || !booking.time}>Continuar para Local</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-up py-8">
            <SectionTitle label="03" title="Seu Endereço" hint="Diga seu nome e onde o atendimento será realizado." />
            <LocationForm booking={booking} setBooking={setBooking} toast={toast} />
            <div className="mt-8 flex justify-between">
              <Button onClick={prevStep} variant="ghost">Voltar</Button>
              <Button onClick={nextStep} icon="arrow">Continuar para Extras</Button>
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="animate-fade-up py-8">
            <SectionTitle label="04" title="Detalhes Extras (Opcional)" hint="Adicione complementos para maximizar o seu prazer." />
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {EXTRAS.map((item) => (
                <ExtraCard
                  key={item.id}
                  item={item}
                  active={!!booking.extras[item.id]}
                  onToggle={() => setBooking((current) => ({ ...current, extras: { ...current.extras, [item.id]: !current.extras[item.id] } }))}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-between">
              <Button onClick={prevStep} variant="ghost">Voltar</Button>
              <Button onClick={nextStep} icon="check">Ir para Confirmação</Button>
            </div>
          </section>
        )}

        {step === 5 && (
          <section className="animate-fade-up py-8">
            <SectionTitle label="05" title="Revisão Final" hint="Confirme seus dados e envie o pedido." />
            <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
              <div className="grid gap-5 lg:col-span-8">
                <CouponBox user={user} booking={booking} setBooking={setBooking} />
                <PaymentBox booking={booking} setBooking={setBooking} />
                
                <div className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <h3 className="mb-3 text-lg font-bold">Regras da Sessão</h3>
                  <div className="mb-4 grid gap-3">
                    {RULES.map((rule) => (
                      <p key={rule.title} className="flex gap-3 text-sm leading-6">
                        <Icon name={rule.icon} size={17} className="mt-1 text-blue-500" />
                        <span><strong className="block">{rule.title}</strong><span className="text-[var(--muted)]">{rule.desc}</span></span>
                      </p>
                    ))}
                  </div>
                  <label className="flex cursor-pointer gap-3 rounded-2xl bg-[var(--soft)] p-4 text-sm leading-6 border border-transparent hover:border-[var(--line)] transition">
                    <input type="checkbox" checked={booking.termsAccepted} onChange={(event) => setBooking((current) => ({ ...current, termsAccepted: event.target.checked }))} className="mt-1 h-4 w-4 accent-blue-600" />
                    <span>Estou ciente e aceito as regras de higiene, saúde e a entrega na sessão.</span>
                  </label>
                </div>

                <section className="rounded-[var(--radius)] border border-[var(--line)] bg-[var(--surface)] p-4">
                  <h3 className="mb-4 text-lg font-bold">O que dizem sobre mim</h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {REVIEWS.map((review, index) => (
                      <article key={index} className="rounded-2xl bg-[var(--soft)] p-4">
                        <p className="text-sm leading-6">“{review.text}”</p>
                        <p className="mt-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--muted)]">{review.name} · {review.service}</p>
                      </article>
                    ))}
                  </div>
                </section>
              </div>

              <div className="lg:col-span-4">
                <Summary title={selectedTitle} base={baseValue} extras={extrasValue} rush={rushFee} discount={discount} total={total} booking={booking} />
                <div className="mt-4 flex gap-2">
                  <Button onClick={prevStep} variant="secondary" className="flex-1">Voltar</Button>
                  <Button variant="whatsapp" onClick={finish} icon="message" className="flex-[2]">Enviar Pedido</Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
