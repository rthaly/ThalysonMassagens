import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Lang = "pt" | "en";
type Step = 0 | 1 | 2 | 3 | 4;
type LocationType = "home" | "motel" | "hotel";
type ToastType = "success" | "error";
type PaymentMethod = "" | "pix" | "card" | "money";

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: "@thaly_app_v28_responsive_accessible",
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: "pt-BR",
  LOCALE_EN: "en-US",
  EXCHANGE_RATE: 5,
  SECRET_TOKEN: "THALY_SECURE_V8",
  START_HOUR: 9,
  END_HOUR: 22,
  MAX_STORAGE_SIZE_KB: 5000,
  PROFILE_PHOTO_PAGE: "https://ibb.co/YBxM3t8p",
  PROFILE_PHOTO: "https://i.ibb.co/gZxp3Dwz/Screenshot-1.png",
} as const;

const RUSH_HOURS = ["12:00", "13:00", "17:00", "18:00"];
const RUSH_FEE = 15;

const ICON_PATHS: Record<string, string> = {
  menu: "M4 12h16 M4 6h16 M4 18h16",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  "chevron-down": "M6 9l6 6 6-6",
  x: "M18 6L6 18M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  "alert-circle": "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 8v4 M12 16h.01",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  sun: "M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  "user-check": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M17 11l2 2 4-4",
  sparkles: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  package: "M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  bed: "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
  building: "M4 22v-17a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01",
  "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  car: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  smartphone: "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z",
  watch: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  "credit-card": "M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  banknote: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shower: "M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16",
  hand: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2",
  award: "M12 15l-2 5-9-9 9-9 9 9-9 9-2-5",
  trophy: "M8 21h8M12 17v4m9-13.5a2.5 2.5 0 0 0-5 0v3a2.5 2.5 0 0 0 5 0v-3zM3 7.5a2.5 2.5 0 0 1 5 0v3a2.5 2.5 0 0 1-5 0v-3zM9 4.5h6",
  gift: "M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  scissors: "M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z",
  "file-text": "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  heart: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z",
  "refresh-cw": "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
  ticket: "M15 5v2 M15 11v2 M15 17v2 M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z",
  sunrise: "M17 18a5 5 0 0 0-10 0 M12 2v7 M4.22 10.22l1.42 1.42 M1 18h2 M21 18h2 M18.36 11.64l1.42-1.42 M23 22H1 M8 6l4-4 4 4",
  sunset: "M17 18a5 5 0 0 0-10 0 M12 9v7 M4.22 15.22l1.42-1.42 M1 18h2 M21 18h2 M18.36 16.64l1.42 1.42 M23 22H1",
};

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
  type?: "pack";
  popular?: boolean;
  category?: "relax" | "express" | "final" | "care";
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
  type: "single" | "pack";
  cart: ServiceItem[];
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: LocationType;
  address: Address;
  payment: PaymentMethod;
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

interface ExtraItem {
  id: string;
  price: number;
  icon: string;
  label: string;
  desc: string;
}

const sanitizeInput = (value: string): string => String(value || "").replace(/[<>&"']/g, "");
const validateAddress = (address: Address): boolean => Boolean(address.street && address.number && address.district && address.city);
const maskCEP = (value: string) => value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);

const vibrate = (pattern: number | number[] = 40) => {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
};

const formatMoney = (value: number | undefined, lang: Lang) => {
  if (value === undefined || Number.isNaN(value)) return lang === "pt" ? "R$ 0,00" : "$ 0.00";
  const converted = lang === "pt" ? value : value / CONFIG.EXCHANGE_RATE;
  return lang === "pt" ? `R$ ${converted.toFixed(2).replace(".", ",")}` : `$ ${converted.toFixed(2)}`;
};

const isWebViewUserAgent = () => {
  if (typeof window === "undefined") return false;
  const opera = (window as Window & { opera?: string }).opera || "";
  const ua = navigator.userAgent || navigator.vendor || opera;
  return ["FBAN", "FBAV", "Instagram", "Line", "TikTok"].some((key) => ua.includes(key));
};

const cleanupStorage = () => {
  try {
    Object.keys(localStorage).forEach((key) => {
      if (!key.startsWith("@thaly_app")) return;
      try {
        JSON.parse(localStorage.getItem(key) || "{}");
      } catch {
        localStorage.removeItem(key);
      }
    });
  } catch {}
};

const getFullReviews = (): Review[] => [
  { n: "Gustavo", loc: "Bela Vista - SP", t: "O Thalyson chegou na hora certa. A experiência em casa foi incrível. Mãos com técnica sem igual, o alívio foi imediato. Levantei parecendo 10kg mais leve.", serv: "Experiência Fusion", s: 5 },
  { n: "Giovana", loc: "Hotel Portal da Mata, Santa Fé", t: "Você tem mãos abençoadas! Precisava muito desse descanso. Foi super respeitoso a todo tempo e me relaxou demais. Obrigada!", serv: "Massagem Sensorial", s: 5 },
  { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", serv: "Massagem Clássica", s: 5 },
  { n: "Lucas", loc: "Londrina", t: "Sendo casado, a discrição era minha prioridade e fui atendido com total sigilo. A massagem me permitiu redescobrir meu próprio corpo. Sensacional.", serv: "Massagem Nuru", s: 5 },
  { n: "Ricardo", loc: "Fernandópolis", t: "Encontrei um profissionalismo raro. Me senti à vontade para soltar minhas travas. Saí de lá me sentindo 10kg mais leve, física e emocionalmente.", serv: "Massagem Reversa", s: 5 },
];

const getData = (lang: Lang) => {
  const isEn = lang === "en";
  const p = {
    depil: 107, relax: 157, sens: 177, naturista: 197, titan: 207, reversa: 260, nuru: 317, crossfit: 187,
    pes: 110, maos: 110,
    packBasic: { v: 247, full: 284, save: 37 },
    pack1: { v: 297, full: 334, save: 37 },
    packGlow: { v: 327, full: 391, save: 64 },
    packMuscle: { v: 347, full: 408, save: 61 },
    pack2: { v: 387, full: 467, save: 80 },
    pack3: { v: 637, full: 721, save: 84 },
    packUltimate: { v: 657, full: 778, save: 121 },
    extras: { moreTime: 77, touch: 77, aroma: 17, hairTrim: 57, painRelief: 17, dominador: 180, oral: 120, beijos: 77, prostatico: 120 },
  };

  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isEn ? "Care Beginner" : "Iniciante no Cuidado" },
      { level: 2, xpNeeded: 100, reward: 15, title: isEn ? "Right Priority" : "Prioridade Certa" },
      { level: 3, xpNeeded: 350, reward: 30, title: isEn ? "Conscious Body" : "Corpo Consciente" },
      { level: 4, xpNeeded: 800, reward: 50, title: isEn ? "Plenitude Reached" : "Plenitude Alcançada" },
    ],
    services: [
      { id: "pes", category: "express", min: 40, price: p.pes, icon: "user-check", tag: isEn ? "FOOT RELIEF" : "ALÍVIO NOS PÉS", title: isEn ? "Foot Massage" : "Massagem nos Pés", desc: isEn ? "Complete relief for tired feet after a long day." : "Alívio completo e direto para pés cansados após um dia longo de trabalho.", details: isEn ? "Foot reflexology\nDeep pressure points\nLightness for the whole body" : "Reflexologia focada na sola dos pés.\nPressão profunda em pontos de tensão.\nLiberação completa para você pisar mais leve." },
      { id: "maos", category: "express", min: 40, price: p.maos, icon: "hand", tag: isEn ? "HAND RELIEF" : "ALÍVIO NAS MÃOS", title: isEn ? "Hand Massage" : "Massagem nas Mãos", desc: isEn ? "Release tension from typing and working with your hands." : "Libere a tensão acumulada de digitar ou usar muito as mãos no trabalho.", details: isEn ? "Joint stretching\nDeep palm massage\nRelief for wrists and forearms" : "Alongamento das articulações dos dedos.\nMassagem profunda na palma da mão.\nAlívio de dores nos punhos e antebraço." },
      { id: "relaxante", category: "relax", min: 40, price: p.relax, icon: "user-check", tag: isEn ? "MUSCLE RELIEF" : "ALÍVIO MUSCULAR", title: isEn ? "Classic Massage" : "Massagem Clássica", desc: isEn ? "Firm therapeutic work for back tension and stiff shoulders." : "Ideal para quem está com as costas travadas e o corpo rígido. Foco total em soltar os músculos para você voltar a dormir bem.", details: isEn ? "Wooden rollers to soften knots\nDeep manual massage\nTherapeutic focus without intimate touch" : "Uso de rolos de madeira para quebrar os nós musculares.\nMassagem manual profunda para soltar tensões fortes.\nFoco em relaxamento e saúde, sem toques íntimos." },
      { id: "naturista", category: "relax", min: 40, price: p.naturista, icon: "sun", tag: isEn ? "ZERO TIES" : "ZERO ROUPAS", title: isEn ? "Naturist Classic" : "Clássica Naturista", desc: isEn ? "Total freedom, no clothes, light touches to loosen every muscle." : "Massagem de corpo inteiro, completamente sem roupas. Perfeita para quem busca liberdade total e quebra de estresse.", details: isEn ? "Full classic massage\nDeep body relief\nTherapeutic and relaxing focus" : "Massagem feita com liberdade total.\nPressão exata para desmanchar a rigidez do corpo.\nFoco terapêutico e relaxante." },
      { id: "crossfit", category: "relax", min: 60, price: p.crossfit, icon: "zap", tag: isEn ? "DEEP RECOVERY" : "RECUPERAÇÃO", title: isEn ? "Sports Recovery" : "Massagem para Atletas", desc: isEn ? "Sports massage with a firm grip for stiff muscles." : "Massagem com pegada forte, feita especialmente para quem treina pesado e precisa aliviar dores pós-treino.", details: isEn ? "Vigorous friction\nMyofascial release\nStretching for mobility" : "Fricção forte para aquecer músculos cansados.\nLiberação miofascial com foco em pernas, costas e ombros.\nAlongamentos para destravar e devolver mobilidade." },
      { id: "sensitiva", category: "final", min: 60, price: p.sens, icon: "sparkles", tag: isEn ? "REDUCES ANXIETY" : "TIRA A ANSIEDADE", title: isEn ? "Sensory Massage" : "Massagem Sensorial", desc: isEn ? "Subtle touches for a full-body sensory experience." : "Toques muito suaves pelo corpo todo que causam arrepios e desligam a sua mente acelerada.", details: isEn ? "Classic warm-up\nSubtle sensory stimuli\nRelaxing manual ending" : "Início com massagem clássica para aquecer a pele.\nEstímulos leves usando mãos e respiração.\nFinalização manual focada na liberação de tensão." },
      { id: "mista", category: "final", min: 60, price: p.titan, icon: "zap", tag: isEn ? "BEST OF BOTH WORLDS" : "O MELHOR DOS 2", title: isEn ? "Fusion Experience" : "Experiência Fusion", desc: isEn ? "A complete session that starts therapeutic and ends with deep relaxation." : "A mais completa: primeiro tira a dor das costas, depois muda o ritmo e leva a um relaxamento profundo.", details: isEn ? "Classic massage for stiffness\nBody-to-body warmth\nManual ending for stress release" : "Começa como massagem clássica para soltar músculos travados.\nContato mais próximo e sensorial.\nFinalização manual para recarregar as baterias." },
      { id: "reversa", category: "final", min: 60, price: p.reversa, icon: "refresh-cw", tag: isEn ? "REAL CONTACT" : "CONTATO REAL", title: isEn ? "Reverse Massage" : "Massagem Reversa", desc: isEn ? "A warmer, interactive experience focused on human connection." : "Experiência interativa com mais proximidade, calor humano e atenção exclusiva.", details: isEn ? "Complete relaxing massage\nInteractive second moment\nMutual respect and connection" : "Massagem relaxante completa.\nMomento mais interativo, com respeito e conexão.\nFoco em calor humano e acolhimento." },
      { id: "nuru", category: "final", min: 60, price: p.nuru, icon: "star", popular: true, tag: isEn ? "TOTAL SURRENDER" : "ENTREGA TOTAL", title: isEn ? "Nuru Massage" : "Massagem Nuru", desc: isEn ? "Gel, glide and intense skin-to-skin relaxation." : "Muito gel deslizando, contato pele com pele e uma experiência intensa para relaxar por completo.", details: isEn ? "Warm-up massage\nWarm gel application\nFull sensory glide" : "Massagem inicial para aquecer e soltar o corpo.\nAplicação de bastante gel.\nExperiência sensorial com deslizamento e relaxamento profundo." },
      { id: "depilacao", category: "care", min: 60, price: p.depil, icon: "scissors", tag: isEn ? "PRACTICALITY" : "ESTÉTICA", title: isEn ? "Full Body Trim" : "Aparo de Pelos do Corpo", desc: isEn ? "Leave with a clean, light body ready for the week." : "Aparo dos pelos do corpo com máquina profissional para você ficar impecável e limpo para a semana.", details: isEn ? "Careful clipper trim\nFocus on selected areas\nClean and practical finish" : "Aparo com máquina feito de forma cuidadosa.\nFoco nas regiões que você escolher.\nResultado mais limpo, leve e prático." },
    ] as ServiceItem[],
    plans: [
      { id: "pack_basic", type: "pack", min: 60, title: isEn ? "Routine Relief (2x)" : "Alívio de Rotina (2x)", price: p.packBasic.v, fullPrice: p.packBasic.full, savings: p.packBasic.save, desc: isEn ? "For those who stand or type a lot. Includes a relaxing bonus." : "Para quem trabalha de pé ou digitando. Inclui bônus relaxante.", details: isEn ? "1x Foot Massage\n1x Classic\nBonus: free aromatherapy" : "1x Massagem nos Pés\n1x Massagem Clássica\nBônus: aromaterapia grátis nas sessões.", tag: "RELAX", icon: "watch" },
      { id: "pack_essencial", type: "pack", min: 60, title: isEn ? "Survival Kit (2x)" : "Kit Sobrevivência (2x)", price: p.pack1.v, fullPrice: p.pack1.full, savings: p.pack1.save, desc: isEn ? "Two sessions to relieve pain and clear your mind." : "Duas sessões no mês: um dia para tirar dores, outro para aliviar a mente.", details: isEn ? "1x Classic\n1x Sensory\nScheduled separately during the month" : "1x Massagem Clássica\n1x Massagem Sensorial\nSessões agendadas separadamente no mês.", tag: isEn ? "PERFECT SLEEP" : "DURMA BEM", icon: "layers" },
      { id: "pack_glow", type: "pack", min: 60, title: isEn ? "Full Renewal (2x)" : "Renovação Completa (2x)", price: p.packGlow.v, fullPrice: p.packGlow.full, savings: p.packGlow.save, desc: isEn ? "A day for aesthetics and a day for deep relaxation." : "Dia de cuidar da estética e dia de relaxar muito. Com bônus de tempo.", details: isEn ? "1x Trim\n1x Fusion\nBonus: +30 minutes on Fusion" : "1x Aparo de Pelos do Corpo\n1x Experiência Fusion\nBônus: +30 minutos na sessão Fusion.", tag: "GLOW UP", icon: "sparkles" },
      { id: "pack_muscle", type: "pack", min: 60, title: isEn ? "Recovery Combo (2x)" : "Combo Recuperação (2x)", price: p.packMuscle.v, fullPrice: p.packMuscle.full, savings: p.packMuscle.save, desc: isEn ? "For those who train hard and need strong recovery." : "Focado em quem treina pesado e sofre com dores musculares intensas.", details: isEn ? "2x Sports Recovery\nBonus: extra pain focus" : "2x Massagem para Atletas\nBônus: foco extra em dores.", tag: isEn ? "MUSCLE" : "MÚSCULOS", icon: "zap" },
      { id: "pack_interativo", type: "pack", min: 60, title: isEn ? "Real Connection (2x)" : "Combo Conexão (2x)", price: p.pack2.v, fullPrice: p.pack2.full, savings: p.pack2.save, desc: isEn ? "Two warmer encounters focused on presence." : "Dois encontros separados no mês com mais proximidade e atenção exclusiva.", details: isEn ? "1x Fusion\n1x Reverse\nTwo moments to look forward to" : "1x Experiência Fusion\n1x Massagem Reversa\nSessões marcadas em dias diferentes.", tag: isEn ? "CONNECTION" : "CONEXÃO", icon: "heart" },
      { id: "pack_premium", type: "pack", min: 60, title: isEn ? "Boss Plan (3x)" : "Mensalidade do Chefe (3x)", price: p.pack3.v, fullPrice: p.pack3.full, savings: p.pack3.save, desc: isEn ? "Three VIP weeks with the most complete massages." : "Três semanas garantidas com as melhores e mais intensas massagens.", details: isEn ? "1x Naturist\n1x Fusion\n1x Nuru" : "1x Naturista\n1x Fusion\n1x Nuru\nTrês encontros VIP para reduzir o estresse do mês.", tag: isEn ? "MONTH REWARD" : "TRATAMENTO VIP", icon: "award" },
      { id: "pack_ultimate", type: "pack", min: 60, title: isEn ? "Pleasure Journey (3x)" : "Jornada do Prazer (3x)", price: p.packUltimate.v, fullPrice: p.packUltimate.full, savings: p.packUltimate.save, desc: isEn ? "Total immersion with escalating relaxation." : "A imersão total, escalando o nível de intimidade e relaxamento.", details: isEn ? "1x Sensory\n1x Fusion\n1x Nuru\nBonus: touch freedom" : "1x Massagem Sensorial\n1x Experiência Fusion\n1x Massagem Nuru\nBônus: liberdade para tocar.", tag: "PREMIUM", icon: "heart" },
    ] as ServiceItem[],
    extras: [
      { id: "hair_trim", price: p.extras.hairTrim, icon: "scissors", label: isEn ? "Trim Extra" : "Aparo de Pelos", desc: isEn ? "Maintenance in up to 2 areas." : "Aparo de pelos em até 2 áreas do corpo." },
      { id: "more_time", price: p.extras.moreTime, icon: "clock", label: isEn ? "Extra 30 Min" : "Mais 30 Minutos", desc: isEn ? "More time to relax with no rush." : "Mais tempo para relaxar sem pressa." },
      { id: "touch", price: p.extras.touch, icon: "hand", label: isEn ? "Organic Interaction" : "Liberdade para Tocar", desc: isEn ? "Participate more actively during the experience." : "Mais liberdade para participar da experiência." },
      { id: "aroma", price: p.extras.aroma, icon: "sparkles", label: isEn ? "Aromatherapy" : "Aromaterapia", desc: isEn ? "Essential oils for a calmer environment." : "Óleos essenciais para acalmar o ambiente." },
      { id: "pain_relief", price: p.extras.painRelief, icon: "shield", label: isEn ? "Extra Pain Focus" : "Alívio de Dores Fortes", desc: isEn ? "Extra care on tense areas." : "Atenção extra nas áreas mais travadas." },
      { id: "dominador", price: p.extras.dominador, icon: "zap", label: isEn ? "Dominant Posture" : "Postura Dominadora", desc: isEn ? "A more active posture in the final part." : "Postura mais ativa na parte final do encontro." },
      { id: "oral", price: p.extras.oral, icon: "heart", label: isEn ? "Oral Included" : "Estímulo Oral", desc: isEn ? "Extra intimate stimulation." : "Contato extra para intensificar a experiência." },
      { id: "beijos", price: p.extras.beijos, icon: "heart", label: isEn ? "Kisses Included" : "Beijos e Intimidade", desc: isEn ? "More affection during the session." : "Mais carinho e conexão durante a sessão." },
      { id: "prostatico", price: p.extras.prostatico, icon: "star", label: isEn ? "Prostatic Massage" : "Massagem Prostática", desc: isEn ? "Manual prostatic stimulation." : "Estimulação interna focada, feita manualmente." },
    ] as ExtraItem[],
    faq: [
      { q: isEn ? "How does the final part work?" : "Como a finalização funciona na prática?", a: isEn ? "Everything is conducted with respect, consent and attention to your rhythm." : "Tudo é conduzido com respeito ao seu tempo e ao seu corpo, sempre com consentimento e atenção ao seu ritmo." },
      { q: isEn ? "Where does the meeting happen?" : "Onde nós vamos nos encontrar?", a: isEn ? "I can go to your home, hotel, or confirm my private suite by WhatsApp." : "Eu posso ir até sua casa, hotel, ou confirmar a minha suíte privada pelo WhatsApp." },
      { q: isEn ? "How should I prepare?" : "O que eu preciso fazer antes da sessão?", a: isEn ? "A warm shower near the scheduled time is enough to start relaxed." : "Um banho quente perto do horário já ajuda a relaxar os músculos e preparar a pele." },
      { q: isEn ? "Are my points saved?" : "Como o aplicativo salva meu progresso?", a: isEn ? "Your progress is saved in this browser. Avoid clearing cache." : "Seu progresso fica salvo neste navegador. Evite limpar o cache para não perder seu nível." },
    ],
    rules: [
      { icon: "shower", title: isEn ? "Preparation Shower" : "Ducha Preparatória", description: isEn ? "A prior shower keeps the experience comfortable and hygienic." : "O banho prévio garante higiene, conforto e uma experiência melhor." },
      { icon: "hand", title: isEn ? "Respect" : "Respeito Mútuo", description: isEn ? "A calm, respectful environment is essential." : "O respeito mútuo mantém o ambiente leve, livre e focado em bem-estar." },
      { icon: "heart", title: isEn ? "Presence" : "Entrega e Presença", description: isEn ? "This moment is yours. Relax and let the outside noise wait." : "Esse momento é seu. Relaxe, desligue a mente e aproveite." },
      { icon: "shield", title: isEn ? "Health" : "Saúde e Prevenção", description: isEn ? "Confirm you are healthy and without contagious conditions." : "Ao agendar, confirme que está com a saúde em dia e sem condições contagiosas." },
    ] as Rule[],
    text: {
      welcome: isEn ? "Welcome," : "Bem-vindo,",
      welcomeAnon: isEn ? "allow yourself." : "permita-se relaxar.",
      chooseSub: isEn ? "Choose how you want to be cared for today." : "Escolha abaixo como você quer relaxar e aproveitar o nosso encontro hoje.",
      profileTitle: isEn ? "Your Care Journey" : "Sua Jornada de Cuidado",
      profileHint: isEn ? "Photo card with progress saved in this browser." : "Card com sua foto e progresso salvo neste navegador.",
      tabPacks: isEn ? "Monthly Plans" : "Planos Mensais",
      tabSingle: isEn ? "Single Sessions" : "Sessões Avulsas",
      nextBtn: isEn ? "Continue" : "Continuar",
      finishBtn: isEn ? "Complete Booking" : "Finalizar Agendamento",
      loading: isEn ? "Preparing your space..." : "Preparando o seu ambiente...",
      toastSelectItem: isEn ? "Add at least one service to continue." : "Escolha pelo menos um serviço para continuar.",
      toastSelectDate: isEn ? "Choose a date and time." : "Selecione uma data e horário válidos.",
      toastFillName: isEn ? "Fill in your name to continue." : "Preencha seu nome corretamente.",
      toastFillAddr: isEn ? "Fill in the location." : "Preencha o endereço completo.",
      toastAcceptTerms: isEn ? "Read and accept the agreement." : "Leia e aceite as regras para confirmar.",
      toastCouponSuccess: isEn ? "Gift applied." : "Benefício ativado com sucesso.",
      toastCepFound: isEn ? "Address loaded." : "Localização encontrada pelo CEP.",
      toastCepError: isEn ? "ZIP code not found." : "Não consegui encontrar este CEP.",
      detailsLabel: isEn ? "What you will experience" : "O que vai acontecer",
      selectTimeTitle: isEn ? "Choose the perfect moment" : "Escolha a data do nosso encontro",
      locationTitle: isEn ? "Where will our encounter be?" : "Onde nós vamos nos ver?",
      extrasTitle: isEn ? "Add something special" : "Adicione complementos opcionais",
      couponSection: isEn ? "Your Benefits" : "Seus Benefícios Disponíveis",
      couponEmpty: isEn ? "No benefits available now." : "Nenhum benefício disponível no momento.",
      paymentTitle: isEn ? "Payment method" : "Forma de pagamento",
      termsTitle: isEn ? "Agreement" : "Regras e Acordos",
      successTitle: isEn ? "Almost there!" : "Tudo Certo! Falta Pouco",
      successSub: isEn ? "WhatsApp will open with your request. If it does not, tap the button below." : "Vou abrir o WhatsApp com seu pedido. Se não abrir, toque no botão abaixo.",
      whatsappBtn: isEn ? "Open WhatsApp" : "Enviar Pedido no WhatsApp",
      backHome: isEn ? "Start over" : "Voltar para o início",
      timerText: isEn ? "Cart saved for" : "Sua reserva salva por",
      inputName: isEn ? "Your name or nickname" : "Qual o seu nome ou apelido?",
      inputCep: isEn ? "ZIP Code" : "Digite o CEP do local",
      inputAddr: isEn ? "Street or Avenue" : "Rua ou Avenida completa",
      inputNum: isEn ? "Number" : "Número",
      inputDistrict: isEn ? "Neighborhood" : "Bairro",
      inputCity: isEn ? "City" : "Cidade",
      inputComp: isEn ? "Complement" : "Complemento",
      inputHotel: isEn ? "Hotel name" : "Nome do Hotel",
      inputRoom: isEn ? "Room or suite number" : "Número do Quarto ou Suíte",
      agreeTerms: isEn ? "I read and agree" : "Eu li e aceito todas as regras",
      faqTitle: isEn ? "Frequently Asked Questions" : "Tire as Suas Dúvidas",
      reviewsTitle: isEn ? "Those who allowed themselves:" : "O que os clientes estão dizendo:",
      emptyDate: isEn ? "Tap a day above to see times." : "Toque em um dia acima para ver os horários.",
      emptySlots: isEn ? "Schedule full for this day." : "Agenda cheia nesse dia. Tente o próximo.",
      totalLabel: isEn ? "Total" : "Total a Pagar",
      subtotal: isEn ? "Subtotal" : "Valor Inicial",
      pixDiscount: isEn ? "Pix 3% OFF" : "Desconto Pix 3%",
      mediaDiscount: isEn ? "Portfolio Discount 1%" : "Desconto do Portfólio 1%",
      welcomePopupTitle: isEn ? "Welcome!" : "Que bom ter você aqui!",
      welcomePopupMsg: isEn ? "Here is a first gift for your care journey." : "Para comemorar nossa primeira vez, pegue esse presente.",
      welcomePopupWarning: isEn ? "Progress is saved in this browser. Avoid clearing cache." : "Seus pontos são salvos neste navegador. Evite limpar o cache.",
      levelupPopupTitle: isEn ? "Level Up!" : "Parabéns, você subiu de nível!",
      levelupPopupMsg: isEn ? "A new benefit has been unlocked." : "Um novo benefício acabou de ser liberado.",
      getCoupon: isEn ? "Claim Gift" : "Pegar Meu Presente",
      rulesComplete: isEn ? "Mutual Agreement" : "Leia para Confirmarmos",
      mediaTitle: isEn ? "Support my work" : "Quer apoiar meu trabalho?",
      mediaDesc: isEn ? "Allow anonymous aesthetic photos without face or intimacy and get 1% OFF." : "Permita fotos anônimas, sem rosto ou intimidade, para meu portfólio e ganhe 1% OFF.",
      mediaBonus: isEn ? "Allow 1% OFF" : "Permitir 1% OFF",
      uberNotice: isEn ? "Travel fee will be confirmed via WhatsApp." : "A taxa do Uber será calculada e avisada no WhatsApp.",
      motelNote: isEn ? "My private suite address will be sent by WhatsApp after booking." : "Assim que finalizar, eu te mando o endereço da minha suíte privada pelo WhatsApp.",
      menuTitle: isEn ? "Menu" : "Configurações",
      levelYours: isEn ? "Your XP" : "Seu XP",
      levelCurrent: isEn ? "XP" : "Pontos",
      levelJourney: isEn ? "Progress" : "Evolução",
      menuWarning: isEn ? "Saved in this browser." : "Seu progresso fica salvo neste navegador.",
      themeTitle: isEn ? "Appearance" : "Tema do Aplicativo",
      themeDark: isEn ? "Dark" : "Escuro",
      themeLight: isEn ? "Light" : "Claro",
      referBtn: isEn ? "Refer Someone" : "Indicar para um amigo",
      shareText: isEn ? "I found the best massage to relieve stress." : "Encontrei o lugar perfeito para uma massagem que tira o estresse.",
      headerTensions: isEn ? "moments of relief" : "homens já atendidos",
      stepWhen: isEn ? "When" : "Quando",
      stepWhere: isEn ? "Where" : "Onde",
      stepSummary: isEn ? "Summary" : "Resumo",
      cartTitle: isEn ? "Cart" : "Você escolheu",
      cartEdit: isEn ? "Edit" : "Trocar",
      locHome: isEn ? "Residence" : "Residência",
      locMotel: isEn ? "My Suite" : "Minha Suíte",
      locHotel: isEn ? "Hotel" : "Hotel",
      summaryTitle: isEn ? "Order Summary" : "Resumo do Pedido",
      summaryItems: isEn ? "Services" : "O que vamos fazer",
      summaryExtras: isEn ? "Extras" : "Adicionais",
      summaryInfo: isEn ? "Session Details" : "Dados do encontro",
      summaryLocHome: isEn ? "At your residence" : "Na sua residência",
      summaryLocMotel: isEn ? "At my private suite" : "Na minha suíte privada",
      summaryLocHotel: isEn ? "At a hotel" : "No hotel",
      xpGuaranteed: isEn ? "XP guaranteed" : "XP ganhos hoje",
      mediaGranted: isEn ? "Authorization granted" : "Fotos autorizadas",
      mediaSupport: isEn ? "Authorize photos" : "Autorizar fotos",
      payPix: isEn ? "Pix (3% OFF)" : "Pix (3% OFF)",
      payCard: isEn ? "Card" : "Cartão",
      payCash: isEn ? "Cash" : "Dinheiro",
      termsRead: isEn ? "Read the rules" : "Toque aqui para ler",
      levelRedeem: isEn ? "Claim Reward" : "Resgatar Recompensa",
      today: isEn ? "TODAY" : "HOJE",
      tomorrow: isEn ? "TOMORROW" : "AMANHÃ",
      popularBadge: isEn ? "Most Desired" : "A Mais Pedida",
      from: isEn ? "From" : "De",
      savings: isEn ? "You save" : "Você economiza",
      itemsSelected: isEn ? "selected" : "selecionado(s)",
      btnFinishShort: isEn ? "Finish" : "Finalizar",
      btnNextShort: isEn ? "Next" : "Próximo",
      msgLevelKeep1: isEn ? "Only" : "Faltam apenas",
      msgLevelKeep2: isEn ? "XP to unlock" : "XP para desbloquear",
      msgRushFee: isEn ? "Rush Fee" : "Taxa de Pico",
      toastLoaded: isEn ? "Progress loaded." : "Seus pontos foram carregados.",
      toastCartToggle: isEn ? "Cart updated." : "Serviço alterado.",
      toastPixCopied: isEn ? "PIX key copied." : "Chave PIX copiada.",
      morning: isEn ? "Morning" : "Manhã",
      afternoon: isEn ? "Afternoon" : "Tarde",
      evening: isEn ? "Evening" : "Noite",
      estimatedTime: isEn ? "Estimated time" : "Tempo estimado",
    },
    reviews: getFullReviews(),
  };
};

const Icon = memo(({ name, size = 20, className = "" }: { name: string; size?: number; className?: string }) => (
  <svg className={`icon ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name] || ""} />
  </svg>
));

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    :root {
      --font-sans: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      --bg: ${isDark ? "#11141a" : "#f9f8f6"};
      --surface: ${isDark ? "#181c25" : "#ffffff"};
      --surface-soft: ${isDark ? "rgba(255,255,255,.055)" : "rgba(15,23,42,.045)"};
      --surface-strong: ${isDark ? "#202636" : "#f1f5f9"};
      --border: ${isDark ? "rgba(255,255,255,.105)" : "rgba(15,23,42,.12)"};
      --border-strong: ${isDark ? "rgba(255,255,255,.18)" : "rgba(15,23,42,.22)"};
      --text: ${isDark ? "#f5f3ef" : "#111827"};
      --muted: ${isDark ? "#aca9a4" : "#5f676f"};
      --faint: ${isDark ? "#777b84" : "#7f8792"};
      --blue: #3b82f6;
      --blue-2: #60a5fa;
      --amber: #f59e0b;
      --green: #10b981;
      --pink: #ec4899;
      --danger: #ef4444;
      --radius: 24px;
      --shadow: ${isDark ? "0 24px 70px rgba(0,0,0,.42)" : "0 24px 70px rgba(15,23,42,.12)"};
      color-scheme: ${isDark ? "dark" : "light"};
    }

    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-width: 320px;
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
      overflow-wrap: anywhere;
    }
    body.modal-open { overflow: hidden; }
    button, input { font: inherit; }
    button {
      border: 0;
      cursor: pointer;
      color: inherit;
      background: transparent;
      -webkit-appearance: none;
      appearance: none;
      touch-action: manipulation;
    }
    button:disabled { cursor: not-allowed; }
    img { display: block; max-width: 100%; }
    .app {
      min-height: 100vh;
      position: relative;
      overflow-x: clip;
      padding: clamp(18px, 4vw, 44px) clamp(14px, 4vw, 36px) 164px;
    }
    .app::before {
      content: "";
      position: fixed;
      inset: -30% -20% auto -20%;
      height: 620px;
      pointer-events: none;
      background:
        radial-gradient(circle at 20% 20%, rgba(59,130,246,.15), transparent 35%),
        radial-gradient(circle at 75% 40%, rgba(16,185,129,.08), transparent 34%);
      filter: blur(24px);
      z-index: -1;
    }
    .shell { width: min(100%, 1120px); margin: 0 auto; }
    .skip-link {
      position: fixed;
      left: 16px;
      top: 12px;
      transform: translateY(-140%);
      z-index: 500;
      padding: 12px 16px;
      border-radius: 12px;
      background: var(--blue);
      color: white;
      font-weight: 700;
      text-decoration: none;
    }
    .skip-link:focus { transform: translateY(0); outline: 3px solid rgba(96,165,250,.55); }
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0,0,0,0);
      white-space: nowrap;
      border: 0;
    }
    .icon { flex: 0 0 auto; }
    .focus-ring:focus-visible,
    button:focus-visible,
    input:focus-visible {
      outline: 3px solid rgba(96,165,250,.72);
      outline-offset: 3px;
    }
    .text-gradient {
      background: linear-gradient(135deg, var(--blue-2), #818cf8);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      padding: 8px 0 clamp(24px, 5vw, 42px);
    }
    .brand-button {
      min-width: 0;
      text-align: left;
      border-radius: 18px;
      padding: 4px;
      margin: -4px;
    }
    .brand-title {
      margin: 0 0 8px;
      font-size: clamp(1.65rem, 7vw, 2.65rem);
      line-height: 1.05;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .brand-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--faint);
      font-size: clamp(.66rem, 2.7vw, .74rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .08em;
      max-width: 100%;
    }
    .status-dot { position: relative; width: 9px; height: 9px; flex: 0 0 auto; border-radius: 999px; background: var(--blue); }
    .status-dot::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: var(--blue);
      animation: ping 1.8s infinite;
    }
    .icon-row { display: flex; gap: 9px; flex: 0 0 auto; }
    .icon-button {
      width: 44px;
      height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      border-radius: 15px;
      background: var(--surface-soft);
      color: var(--muted);
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }
    .icon-button:hover { transform: translateY(-1px); background: var(--surface-strong); border-color: var(--border-strong); color: var(--text); }
    .lang-chip {
      position: absolute;
      right: -6px;
      bottom: -7px;
      padding: 2px 5px;
      border-radius: 6px;
      background: var(--blue);
      color: white;
      font-size: 8px;
      font-weight: 800;
      line-height: 1.1;
    }
    .stepper {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 26px;
    }
    .stepper-button { min-width: 0; border-radius: 12px; }
    .step-line { height: 6px; border-radius: 999px; background: var(--surface-strong); overflow: hidden; }
    .step-line.active { background: var(--blue); box-shadow: 0 0 16px rgba(59,130,246,.42); }
    .step-label {
      display: block;
      margin-top: 8px;
      color: var(--faint);
      font-size: clamp(.58rem, 2.4vw, .68rem);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .07em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(280px, 420px);
      gap: clamp(22px, 4vw, 42px);
      align-items: stretch;
    }
    .hero-copy { align-self: center; min-width: 0; }
    .hero-title {
      margin: 0 0 16px;
      font-size: clamp(2rem, 8vw, 4rem);
      line-height: 1.08;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .hero-title .name { font-style: italic; }
    .hero-sub {
      margin: 0;
      width: min(100%, 560px);
      color: var(--muted);
      font-size: clamp(.98rem, 3.4vw, 1.14rem);
      line-height: 1.72;
    }
    .profile-card {
      position: relative;
      min-width: 0;
      min-height: 100%;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: clamp(22px, 6vw, 34px);
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .profile-photo-wrap {
      position: relative;
      aspect-ratio: 16 / 11;
      min-height: 210px;
      overflow: hidden;
      background: var(--surface-strong);
    }
    .profile-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
    .profile-photo-wrap::after {
      content: "";
      position: absolute;
      inset: auto 0 0;
      height: 55%;
      background: linear-gradient(to top, rgba(0,0,0,.78), transparent);
      pointer-events: none;
    }
    .profile-overlay {
      position: absolute;
      left: clamp(16px, 4vw, 24px);
      right: clamp(16px, 4vw, 24px);
      bottom: clamp(16px, 4vw, 24px);
      z-index: 1;
      color: white;
      display: flex;
      justify-content: space-between;
      gap: 14px;
      align-items: flex-end;
    }
    .profile-kicker,
    .eyebrow {
      margin: 0 0 6px;
      font-size: .68rem;
      line-height: 1.35;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: rgba(255,255,255,.72);
    }
    .profile-level {
      margin: 0;
      font-size: clamp(1.05rem, 4.6vw, 1.45rem);
      line-height: 1.12;
      overflow-wrap: anywhere;
    }
    .xp-pill {
      flex: 0 0 auto;
      min-width: 82px;
      padding: 10px 12px;
      border: 1px solid rgba(255,255,255,.25);
      border-radius: 16px;
      text-align: right;
      background: rgba(17,20,26,.56);
      backdrop-filter: blur(10px);
    }
    .xp-number {
      display: block;
      font-size: clamp(1.4rem, 7vw, 2.25rem);
      font-weight: 700;
      line-height: 1;
      white-space: nowrap;
    }
    .xp-label {
      display: block;
      margin-top: 3px;
      font-size: .64rem;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: rgba(255,255,255,.75);
    }
    .profile-body {
      padding: clamp(18px, 4vw, 24px);
      display: grid;
      gap: 12px;
    }
    .progress-meta {
      display: flex;
      justify-content: space-between;
      gap: 14px;
      color: var(--faint);
      font-size: .68rem;
      font-weight: 800;
      letter-spacing: .08em;
      text-transform: uppercase;
    }
    .progress-track {
      height: 9px;
      overflow: hidden;
      border-radius: 999px;
      background: var(--surface-strong);
    }
    .progress-fill {
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(90deg, var(--blue), var(--blue-2));
      transition: width .5s ease;
    }
    .profile-note {
      margin: 0;
      color: var(--muted);
      font-size: clamp(.78rem, 3vw, .86rem);
      line-height: 1.6;
    }
    .profile-note strong { color: var(--text); }
    .tabs {
      width: fit-content;
      max-width: 100%;
      margin: clamp(28px, 6vw, 48px) auto;
      display: flex;
      gap: 6px;
      padding: 6px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--surface-soft);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tabs::-webkit-scrollbar { display: none; }
    .tab {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      padding: 10px 16px;
      border-radius: 13px;
      color: var(--muted);
      font-size: .75rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .06em;
      white-space: nowrap;
      flex: 0 0 auto;
    }
    .tab[aria-selected="true"] {
      color: white;
      background: var(--blue);
      box-shadow: 0 14px 28px rgba(59,130,246,.25);
    }
    .tab.pack[aria-selected="true"] { color: #18120a; background: var(--amber); }
    .section-list { display: grid; gap: clamp(26px, 5vw, 44px); }
    .category {
      overflow: hidden;
      border: 1px solid var(--cat-border);
      border-radius: clamp(22px, 6vw, 34px);
      background: var(--cat-bg);
    }
    .category-head {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 14px;
      padding: clamp(16px, 4vw, 24px);
      border-bottom: 1px solid var(--cat-border);
    }
    .category-icon {
      width: clamp(44px, 12vw, 56px);
      height: clamp(44px, 12vw, 56px);
      display: grid;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--cat-color) 35%, transparent);
      border-radius: 17px;
      background: color-mix(in srgb, var(--cat-color) 14%, transparent);
      color: var(--cat-color);
    }
    .category-title {
      margin: 0 0 3px;
      font-size: clamp(1.15rem, 5vw, 1.55rem);
      line-height: 1.12;
      overflow-wrap: anywhere;
    }
    .category-desc {
      margin: 0;
      color: var(--muted);
      font-size: clamp(.78rem, 3.2vw, .9rem);
      line-height: 1.5;
    }
    .count-badge {
      width: 32px;
      height: 32px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--cat-color);
      color: white;
      font-size: .76rem;
      font-weight: 800;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 285px), 1fr));
      gap: clamp(12px, 3vw, 20px);
      padding: clamp(14px, 4vw, 24px);
    }
    .plan-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 285px), 1fr));
      gap: clamp(14px, 3vw, 22px);
    }
    .service-card {
      min-width: 0;
      min-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: clamp(18px, 4vw, 26px);
      border: 1px solid var(--border);
      border-radius: clamp(20px, 5vw, 30px);
      background: var(--surface);
      text-align: left;
      transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease, background .18s ease;
    }
    .service-card:hover { transform: translateY(-2px); box-shadow: var(--shadow); border-color: var(--border-strong); }
    .service-card.selected { border-color: var(--blue); box-shadow: 0 0 0 2px color-mix(in srgb, var(--blue) 45%, transparent), var(--shadow); }
    .service-card.premium.selected { border-color: var(--amber); box-shadow: 0 0 0 2px color-mix(in srgb, var(--amber) 45%, transparent), var(--shadow); }
    .service-top {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      gap: 13px;
      align-items: flex-start;
    }
    .service-icon {
      width: 48px;
      height: 48px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface-soft);
      color: var(--text);
    }
    .service-title {
      margin: 0 0 7px;
      font-size: clamp(1rem, 3.8vw, 1.16rem);
      line-height: 1.18;
      letter-spacing: 0;
      overflow-wrap: anywhere;
      hyphens: auto;
    }
    .service-desc {
      margin: 0;
      color: var(--muted);
      font-size: clamp(.8rem, 3.25vw, .9rem);
      line-height: 1.55;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
    .selected-dot {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--blue);
      color: white;
    }
    .premium .selected-dot { background: var(--amber); color: #18120a; }
    .service-foot {
      margin-top: auto;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      min-width: 0;
    }
    .tag {
      min-width: 0;
      max-width: 100%;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 9px;
      border: 1px solid var(--border);
      border-radius: 999px;
      color: var(--muted);
      background: var(--surface-soft);
      font-size: clamp(.6rem, 2.8vw, .68rem);
      line-height: 1.15;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
      overflow-wrap: anywhere;
    }
    .price-box {
      flex: 0 0 auto;
      text-align: right;
      min-width: max-content;
    }
    .old-price {
      margin: 0 0 2px;
      color: var(--faint);
      text-decoration: line-through;
      font-size: .72rem;
      white-space: nowrap;
    }
    .price {
      margin: 0;
      font-size: clamp(1.08rem, 4.4vw, 1.32rem);
      font-weight: 700;
      line-height: 1.05;
      white-space: nowrap;
    }
    .reviews-section,
    .faq-wrap {
      margin-top: clamp(36px, 7vw, 58px);
      padding: clamp(26px, 5vw, 42px) 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
    }
    .section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 20px;
    }
    .section-title {
      margin: 0;
      min-width: 0;
      font-size: clamp(1.45rem, 6vw, 2rem);
      line-height: 1.16;
      overflow-wrap: anywhere;
    }
    .scroll-actions { display: flex; gap: 8px; }
    .review-track {
      display: flex;
      gap: 16px;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      padding: 2px 2px 14px;
      scrollbar-width: thin;
    }
    .review-card {
      flex: 0 0 min(88vw, 385px);
      min-width: 0;
      scroll-snap-align: start;
      display: flex;
      flex-direction: column;
      gap: 14px;
      padding: clamp(18px, 4vw, 26px);
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
    }
    .review-top {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      min-width: 0;
    }
    .avatar {
      width: 44px;
      height: 44px;
      display: grid;
      place-items: center;
      border: 1px solid color-mix(in srgb, var(--blue) 26%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--blue) 14%, transparent);
      color: var(--blue-2);
      font-weight: 800;
      flex: 0 0 auto;
    }
    .person { display: flex; gap: 12px; min-width: 0; }
    .person-name,
    .person-loc {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .person-name { font-weight: 700; }
    .person-loc { color: var(--faint); font-size: .78rem; }
    .stars { display: flex; gap: 2px; color: var(--amber); flex: 0 0 auto; }
    .quote {
      margin: 0;
      color: var(--muted);
      font-size: .9rem;
      line-height: 1.65;
      font-style: italic;
    }
    .faq-card {
      width: min(100%, 780px);
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
    }
    .faq-item + .faq-item { border-top: 1px solid var(--border); }
    .faq-question {
      width: 100%;
      min-height: 66px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 18px clamp(18px, 4vw, 26px);
      text-align: left;
      font-weight: 700;
      line-height: 1.35;
    }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      padding: 0 clamp(18px, 4vw, 26px);
      color: var(--muted);
      transition: max-height .22s ease, padding .22s ease;
    }
    .faq-answer.open { max-height: 260px; padding-bottom: 20px; }
    .form-panel,
    .summary-card,
    .side-card,
    .notice-card,
    .timer {
      border: 1px solid var(--border);
      border-radius: clamp(22px, 5vw, 30px);
      background: var(--surface);
      box-shadow: ${isDark ? "none" : "0 10px 30px rgba(15,23,42,.07)"};
    }
    .form-panel { width: min(100%, 660px); margin: 0 auto; padding: clamp(18px, 4vw, 28px); }
    .page-title {
      margin: 0 0 clamp(22px, 5vw, 34px);
      text-align: center;
      font-size: clamp(1.7rem, 7vw, 3rem);
      line-height: 1.08;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .location-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: clamp(9px, 3vw, 16px);
      margin-bottom: clamp(18px, 4vw, 28px);
    }
    .location-option {
      min-width: 0;
      min-height: 112px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 8px;
      border: 1px solid var(--border);
      border-radius: 22px;
      background: var(--surface-soft);
      color: var(--muted);
      text-align: center;
    }
    .location-option[aria-pressed="true"] { background: var(--blue); border-color: var(--blue-2); color: white; box-shadow: 0 12px 30px rgba(59,130,246,.22); }
    .location-option span {
      max-width: 100%;
      font-size: clamp(.62rem, 2.8vw, .76rem);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
      line-height: 1.2;
      overflow-wrap: anywhere;
    }
    .location-option small {
      max-width: 100%;
      color: currentColor;
      opacity: .76;
      font-size: clamp(.62rem, 2.6vw, .7rem);
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .field-stack { display: grid; gap: 18px; }
    .input-group { display: grid; gap: 7px; min-width: 0; }
    .input-label {
      color: var(--faint);
      font-size: .72rem;
      line-height: 1.35;
      font-weight: 800;
      letter-spacing: .07em;
      text-transform: uppercase;
    }
    .input-shell { position: relative; min-width: 0; }
    .input-shell .icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--faint);
      pointer-events: none;
    }
    .input {
      width: 100%;
      min-width: 0;
      min-height: 54px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface-soft);
      color: var(--text);
      padding: 13px 15px;
      font-size: 1rem;
      line-height: 1.3;
      transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
    }
    .input.with-icon { padding-left: 46px; }
    .input::placeholder { color: color-mix(in srgb, var(--muted) 65%, transparent); }
    .input.error { border-color: color-mix(in srgb, var(--danger) 80%, transparent); box-shadow: 0 0 0 3px rgba(239,68,68,.13); }
    .dates-wrap { position: relative; width: min(100%, 780px); margin: 0 auto; }
    .date-track {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      padding: 8px 2px 16px;
      scrollbar-width: thin;
    }
    .date-button {
      flex: 0 0 76px;
      height: 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--surface);
      color: var(--muted);
      scroll-snap-align: start;
    }
    .date-button[aria-pressed="true"] { color: white; background: var(--blue); border-color: var(--blue-2); box-shadow: 0 16px 36px rgba(59,130,246,.26); }
    .date-button small {
      max-width: 68px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: .62rem;
      font-weight: 800;
      letter-spacing: .05em;
      text-transform: uppercase;
    }
    .date-button strong {
      color: inherit;
      font-size: 1.85rem;
      line-height: 1;
    }
    .cart-box {
      width: min(100%, 780px);
      margin: 0 auto;
      padding: clamp(16px, 4vw, 22px);
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
    }
    .cart-head {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 12px;
      color: var(--faint);
      font-size: .72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .07em;
    }
    .cart-edit { color: var(--blue-2); font-weight: 800; border-radius: 10px; padding: 2px 5px; }
    .chip-row { display: flex; flex-wrap: wrap; gap: 8px; min-width: 0; }
    .choice-chip {
      min-width: 0;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      max-width: 100%;
      padding: 8px 10px;
      border: 1px solid color-mix(in srgb, var(--blue) 28%, transparent);
      border-radius: 13px;
      color: var(--blue-2);
      background: color-mix(in srgb, var(--blue) 10%, transparent);
      font-size: .82rem;
      font-weight: 700;
      line-height: 1.25;
    }
    .choice-chip span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .time-groups {
      width: min(100%, 780px);
      margin: 0 auto;
      display: grid;
      gap: 24px;
    }
    .time-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      color: var(--faint);
      font-size: .72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .07em;
    }
    .time-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
      gap: 10px;
    }
    .time-button {
      min-width: 0;
      min-height: 56px;
      display: grid;
      place-items: center;
      gap: 2px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface);
      color: var(--text);
      font-weight: 800;
    }
    .time-button.rush { color: var(--amber); border-color: color-mix(in srgb, var(--amber) 28%, transparent); background: color-mix(in srgb, var(--amber) 8%, transparent); }
    .time-button[aria-pressed="true"] { color: white; background: var(--blue); border-color: var(--blue-2); }
    .time-button.rush[aria-pressed="true"] { color: #1f1604; background: var(--amber); border-color: #fbbf24; }
    .time-button small { font-size: .62rem; line-height: 1; font-weight: 800; text-transform: uppercase; }
    .empty-state {
      width: min(100%, 780px);
      margin: 0 auto;
      min-height: 180px;
      display: grid;
      place-items: center;
      gap: 10px;
      text-align: center;
      border: 1px dashed var(--border-strong);
      border-radius: 24px;
      color: var(--faint);
      padding: 24px;
    }
    .summary-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(280px, .8fr);
      gap: clamp(18px, 4vw, 28px);
      align-items: start;
    }
    .timer {
      width: min(100%, 780px);
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      margin: 0 auto clamp(20px, 4vw, 30px);
      background: color-mix(in srgb, var(--blue) 12%, var(--surface));
    }
    .timer-ring {
      position: relative;
      width: 56px;
      height: 56px;
      flex: 0 0 auto;
    }
    .timer-ring svg { width: 56px; height: 56px; transform: rotate(-90deg); }
    .timer-ring .icon { position: absolute; inset: 18px; color: var(--blue-2); }
    .timer-label {
      margin: 0 0 2px;
      color: var(--blue-2);
      font-size: .68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .timer-time { margin: 0; font-size: 1.55rem; font-weight: 700; line-height: 1; }
    .extras-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
      gap: 12px;
    }
    .check-card {
      min-width: 0;
      min-height: 100%;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 15px;
      border: 1px solid var(--border);
      border-radius: 18px;
      background: var(--surface-soft);
      text-align: left;
    }
    .check-card[aria-checked="true"] { border-color: var(--blue); background: color-mix(in srgb, var(--blue) 12%, var(--surface)); }
    .check-main { display: flex; gap: 12px; min-width: 0; }
    .check-icon {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      border-radius: 13px;
      background: var(--surface-strong);
      color: var(--muted);
      flex: 0 0 auto;
    }
    .check-card[aria-checked="true"] .check-icon { background: var(--blue); color: white; }
    .check-title {
      margin: 0 0 4px;
      font-size: .95rem;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .check-desc {
      margin: 0;
      color: var(--muted);
      font-size: .78rem;
      line-height: 1.45;
    }
    .mini-price {
      align-self: flex-start;
      flex: 0 0 auto;
      padding: 6px 8px;
      border-radius: 10px;
      color: var(--text);
      background: var(--surface-strong);
      font-size: .72rem;
      font-weight: 800;
      white-space: nowrap;
    }
    .panel-title {
      margin: 0 0 18px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: clamp(1.25rem, 5vw, 1.6rem);
      line-height: 1.2;
      overflow-wrap: anywhere;
    }
    .summary-card,
    .side-card { padding: clamp(18px, 4vw, 26px); min-width: 0; }
    .line-list { display: grid; gap: 12px; min-width: 0; }
    .line {
      min-width: 0;
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
      color: var(--muted);
      font-size: .95rem;
      line-height: 1.35;
    }
    .line:last-child { border-bottom: 0; padding-bottom: 0; }
    .line strong,
    .line span:first-child {
      min-width: 0;
      overflow-wrap: anywhere;
    }
    .line span:last-child { flex: 0 0 auto; white-space: nowrap; color: var(--text); font-weight: 700; }
    .subhead {
      margin: 24px 0 12px;
      color: var(--faint);
      font-size: .72rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .08em;
    }
    .info-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      min-width: 0;
      margin-bottom: 10px;
      color: var(--muted);
      font-weight: 600;
      line-height: 1.45;
    }
    .info-row span { min-width: 0; overflow-wrap: anywhere; }
    .total-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: flex-end;
      margin-top: 18px;
      padding-top: 16px;
      border-top: 1px solid var(--border-strong);
    }
    .total-label {
      color: var(--muted);
      font-size: .78rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .07em;
    }
    .total-price {
      margin: 0;
      text-align: right;
      font-size: clamp(1.75rem, 8vw, 2.45rem);
      line-height: 1.05;
      font-weight: 700;
      white-space: nowrap;
    }
    .xp-today {
      margin: 4px 0 0;
      color: var(--blue-2);
      text-align: right;
      font-size: .68rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .side-stack { display: grid; gap: 16px; min-width: 0; }
    .option-button {
      width: 100%;
      min-width: 0;
      min-height: 58px;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 16px;
      background: var(--surface-soft);
      text-align: left;
    }
    .option-button[aria-pressed="true"] { color: white; background: var(--blue); border-color: var(--blue-2); }
    .option-button span { min-width: 0; overflow-wrap: anywhere; font-size: .9rem; font-weight: 700; }
    .radio-dot {
      margin-left: auto;
      width: 20px;
      height: 20px;
      border: 2px solid currentColor;
      border-radius: 999px;
      flex: 0 0 auto;
      opacity: .7;
    }
    .option-button[aria-pressed="true"] .radio-dot { border: 6px solid white; opacity: 1; }
    .photo-permission {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--surface-soft);
      color: var(--muted);
      text-align: left;
      font-size: .76rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .photo-permission[aria-pressed="true"] { color: var(--blue-2); border-color: color-mix(in srgb, var(--blue) 45%, transparent); background: color-mix(in srgb, var(--blue) 10%, transparent); }
    .terms-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 22px;
      background: var(--surface);
      text-align: left;
    }
    .terms-button.accepted { border-color: color-mix(in srgb, var(--green) 45%, transparent); background: color-mix(in srgb, var(--green) 10%, var(--surface)); }
    .success {
      width: min(100%, 520px);
      min-height: 70vh;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 22px;
    }
    .success-mark {
      width: 116px;
      height: 116px;
      display: grid;
      place-items: center;
      border: 3px solid color-mix(in srgb, var(--green) 45%, transparent);
      border-radius: 999px;
      color: var(--green);
      background: color-mix(in srgb, var(--green) 10%, var(--surface));
      box-shadow: 0 0 70px color-mix(in srgb, var(--green) 20%, transparent);
    }
    .success h2 {
      margin: 0;
      font-size: clamp(2rem, 8vw, 3rem);
      line-height: 1.08;
    }
    .success p {
      margin: 0;
      color: var(--muted);
      line-height: 1.7;
    }
    .success-box {
      width: 100%;
      display: grid;
      gap: 12px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 24px;
      background: var(--surface);
      text-align: left;
    }
    .bottom-nav {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 60;
      padding: 10px max(12px, env(safe-area-inset-left)) max(14px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-right));
      pointer-events: none;
    }
    .bottom-inner {
      width: min(100%, 1120px);
      margin: 0 auto;
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border-strong);
      border-radius: 24px;
      background: color-mix(in srgb, var(--surface) 94%, transparent);
      box-shadow: 0 -18px 55px rgba(0,0,0,.24);
      backdrop-filter: blur(14px);
    }
    .bottom-copy { min-width: 0; flex: 1 1 auto; }
    .bottom-label {
      margin: 0 0 3px;
      color: var(--faint);
      font-size: clamp(.62rem, 2.7vw, .72rem);
      line-height: 1.1;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: .07em;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bottom-price {
      margin: 0;
      font-size: clamp(1rem, 4.6vw, 1.25rem);
      line-height: 1;
      font-weight: 700;
      white-space: nowrap;
    }
    .primary-btn,
    .secondary-btn {
      min-height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 15px;
      padding: 12px 18px;
      font-weight: 800;
      line-height: 1.15;
      text-align: center;
      transition: transform .18s ease, background .18s ease, opacity .18s ease;
    }
    .primary-btn { color: white; background: var(--blue); box-shadow: 0 12px 28px rgba(59,130,246,.25); }
    .primary-btn.whatsapp { background: #25d366; box-shadow: 0 12px 28px rgba(37,211,102,.22); }
    .primary-btn.amber { color: #18120a; background: var(--amber); box-shadow: 0 12px 28px rgba(245,158,11,.22); }
    .primary-btn:disabled { opacity: .45; box-shadow: none; }
    .primary-btn:hover:not(:disabled) { transform: translateY(-1px); }
    .secondary-btn { border: 1px solid var(--border); background: var(--surface-soft); color: var(--text); }
    .full { width: 100%; }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 120;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
      background: rgba(0,0,0,.82);
      backdrop-filter: blur(10px);
      animation: fadeIn .18s ease;
    }
    .modal-card {
      width: min(100%, 520px);
      max-height: min(92vh, 760px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid var(--border-strong);
      border-radius: clamp(22px, 6vw, 34px);
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .modal-head {
      position: relative;
      padding: clamp(20px, 5vw, 30px);
      border-bottom: 1px solid var(--border);
      background: var(--surface-soft);
    }
    .modal-close { position: absolute; top: 16px; right: 16px; }
    .modal-title {
      margin: 12px 0 8px;
      padding-right: 48px;
      font-size: clamp(1.45rem, 6vw, 2rem);
      line-height: 1.12;
      overflow-wrap: anywhere;
    }
    .modal-price-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: baseline;
    }
    .modal-body {
      overflow-y: auto;
      padding: clamp(20px, 5vw, 30px);
      color: var(--muted);
    }
    .details-list { display: grid; gap: 13px; margin-top: 16px; }
    .details-list div {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      line-height: 1.55;
      overflow-wrap: anywhere;
    }
    .modal-foot { padding: 16px; border-top: 1px solid var(--border); }
    .toast-region {
      position: fixed;
      z-index: 200;
      top: max(12px, env(safe-area-inset-top));
      left: 50%;
      transform: translateX(-50%);
      width: min(100% - 24px, 420px);
      display: grid;
      gap: 10px;
      pointer-events: none;
    }
    .toast {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--border-strong);
      border-radius: 18px;
      background: var(--surface);
      box-shadow: var(--shadow);
      color: var(--text);
      animation: slideDown .22s ease;
    }
    .toast.error { border-color: color-mix(in srgb, var(--danger) 50%, transparent); background: color-mix(in srgb, var(--danger) 15%, var(--surface)); }
    .toast p {
      min-width: 0;
      margin: 0;
      font-size: .9rem;
      line-height: 1.4;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    .side-backdrop {
      position: fixed;
      inset: 0;
      z-index: 100;
      background: rgba(0,0,0,.68);
      backdrop-filter: blur(6px);
    }
    .side-menu {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 110;
      width: min(88vw, 360px);
      display: flex;
      flex-direction: column;
      gap: 18px;
      padding: 24px;
      border-left: 1px solid var(--border);
      background: var(--bg);
      box-shadow: var(--shadow);
      animation: slideRight .22s ease;
    }
    .menu-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .menu-head h2 { margin: 0; font-size: 1.5rem; }
    .menu-xp {
      padding: 18px;
      border: 1px solid color-mix(in srgb, var(--blue) 24%, transparent);
      border-radius: 22px;
      background: color-mix(in srgb, var(--blue) 10%, var(--surface));
    }
    .menu-xp strong { display: block; font-size: clamp(2rem, 10vw, 3rem); line-height: 1; }
    .menu-xp p { margin: 10px 0 0; color: var(--muted); font-size: .8rem; line-height: 1.55; }
    .menu-actions { display: grid; gap: 10px; }
    .menu-action {
      width: 100%;
      min-height: 58px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
      border-radius: 16px;
      background: var(--surface-soft);
      text-align: left;
    }
    .rule-list { display: grid; gap: 12px; }
    .rule-item { display: flex; gap: 12px; padding: 14px; border-radius: 18px; background: var(--surface-soft); }
    .rule-item h4 { margin: 0 0 4px; line-height: 1.25; }
    .rule-item p { margin: 0; color: var(--muted); font-size: .86rem; line-height: 1.55; }
    .warning { border-color: color-mix(in srgb, var(--amber) 35%, transparent); background: color-mix(in srgb, var(--amber) 10%, var(--surface)); color: var(--amber); }
    .shake { animation: shake .28s ease; }
    @keyframes ping { 0% { transform: scale(1); opacity: .75; } 100% { transform: scale(2.3); opacity: 0; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideDown { from { transform: translateY(-12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes shake { 0%,100%{ transform: translateX(0); } 30%{ transform: translateX(-5px); } 70%{ transform: translateX(5px); } }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: .001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: .001ms !important;
      }
    }
    @media (max-width: 860px) {
      .hero-grid,
      .summary-layout { grid-template-columns: 1fr; }
      .hero-sub { width: 100%; }
      .scroll-actions { display: none; }
    }
    @media (max-width: 640px) {
      .app { padding-left: 12px; padding-right: 12px; padding-bottom: 150px; }
      .topbar { gap: 10px; }
      .icon-row { gap: 7px; }
      .icon-button { width: 41px; height: 41px; border-radius: 14px; }
      .hero-grid { gap: 20px; }
      .profile-overlay { align-items: flex-start; flex-direction: column; }
      .xp-pill { align-self: flex-end; }
      .tabs { width: 100%; }
      .tab { flex: 1 0 max-content; padding-inline: 12px; }
      .category-head { grid-template-columns: auto minmax(0, 1fr); }
      .count-badge { grid-column: 2; justify-self: start; }
      .service-card { gap: 14px; }
      .service-top { grid-template-columns: auto minmax(0, 1fr); }
      .selected-dot { grid-column: 1 / -1; justify-self: start; }
      .service-foot { align-items: stretch; flex-direction: column; }
      .price-box { text-align: left; }
      .review-card { flex-basis: 86vw; }
      .location-grid { grid-template-columns: 1fr; }
      .location-option { min-height: 82px; flex-direction: row; justify-content: flex-start; text-align: left; padding-inline: 16px; }
      .time-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .line { align-items: flex-start; flex-direction: column; gap: 4px; }
      .total-row { align-items: flex-start; flex-direction: column; }
      .total-price, .xp-today { text-align: left; }
      .bottom-inner { border-radius: 20px; }
      .bottom-back { width: 48px; padding: 0; }
      .bottom-next { padding-inline: 14px; min-width: 106px; }
      .bottom-next .wide-label { display: none; }
      .check-card { flex-direction: column; }
      .mini-price { align-self: flex-start; }
    }
    @media (max-width: 380px) {
      .brand-meta { letter-spacing: .04em; }
      .hero-title { font-size: 1.85rem; }
      .profile-photo-wrap { min-height: 190px; }
      .category-icon, .service-icon { width: 42px; height: 42px; }
      .cards-grid, .plan-grid { grid-template-columns: 1fr; }
      .time-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .date-button { flex-basis: 68px; }
      .bottom-inner { gap: 8px; padding: 10px; }
      .primary-btn, .secondary-btn { min-height: 46px; padding-inline: 12px; }
    }
  `}</style>
));

const ToastContainer = memo(({ toasts }: { toasts: Array<{ id: number; msg: string; type: ToastType }> }) => (
  <div className="toast-region" aria-live="polite" aria-atomic="true">
    {toasts.map((toast) => (
      <div key={toast.id} className={`toast ${toast.type === "error" ? "error" : ""}`} role="status">
        <Icon name={toast.type === "error" ? "alert-circle" : "check"} size={20} />
        <p>{toast.msg}</p>
      </div>
    ))}
  </div>
));

const Button = memo(({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  full = false,
  icon,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "whatsapp" | "amber";
  disabled?: boolean;
  full?: boolean;
  icon?: string;
  className?: string;
  ariaLabel?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className={`${variant === "secondary" ? "secondary-btn" : "primary-btn"} ${variant === "whatsapp" ? "whatsapp" : ""} ${variant === "amber" ? "amber" : ""} ${full ? "full" : ""} ${className}`}
  >
    {icon ? <Icon name={icon} size={19} /> : null}
    {children}
  </button>
));

const InputField = memo(({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  hasError = false,
  disabled = false,
  maxLength,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string;
  type?: React.HTMLInputTypeAttribute;
  hasError?: boolean;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) => (
  <div className="input-group">
    <label htmlFor={id} className="input-label">{label}</label>
    <div className="input-shell">
      {icon ? <Icon name={icon} size={19} /> : null}
      <input
        id={id}
        className={`input ${icon ? "with-icon" : ""} ${hasError ? "error" : ""}`}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={hasError || undefined}
      />
    </div>
  </div>
));

const ProfileCard = memo(({
  user,
  T,
  progress,
  levelTitle,
  nextLevel,
  lang,
}: {
  user: UserData;
  T: ReturnType<typeof getData>["text"];
  progress: number;
  levelTitle: string;
  nextLevel: { needed: number; reward: number } | null;
  lang: Lang;
}) => (
  <aside className="profile-card" aria-label={T.profileTitle}>
    <div className="profile-photo-wrap">
      <img
        className="profile-photo"
        src={CONFIG.PROFILE_PHOTO}
        alt="Thalyson"
        loading="eager"
        decoding="async"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src =
            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 440'%3E%3Crect width='640' height='440' fill='%23181c25'/%3E%3Ccircle cx='320' cy='176' r='72' fill='%233b82f6'/%3E%3Cpath d='M176 390c22-86 90-132 144-132s122 46 144 132' fill='%2360a5fa'/%3E%3C/svg%3E";
        }}
      />
      <div className="profile-overlay">
        <div>
          <p className="profile-kicker">{T.profileTitle}</p>
          <h3 className="profile-level">{levelTitle}</h3>
        </div>
        <div className="xp-pill" aria-label={`${user.xp} XP`}>
          <span className="xp-number">{user.xp}</span>
          <span className="xp-label">XP</span>
        </div>
      </div>
    </div>
    <div className="profile-body">
      <div className="progress-meta">
        <span>{T.levelJourney}</span>
        <span>{Math.floor(progress)}%</span>
      </div>
      <div className="progress-track" role="progressbar" aria-label={T.levelJourney} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="profile-note">
        {nextLevel ? (
          <>
            {T.msgLevelKeep1} <strong>{nextLevel.needed} XP</strong> {T.msgLevelKeep2} <strong>{formatMoney(nextLevel.reward, lang)}</strong>.
          </>
        ) : T.profileHint}
      </p>
    </div>
  </aside>
));

const ServiceCard = memo(({
  service,
  isInCart,
  isPremium,
  onOpen,
  lang,
  T,
}: {
  service: ServiceItem;
  isInCart: boolean;
  isPremium?: boolean;
  onOpen: (service: ServiceItem) => void;
  lang: Lang;
  T: ReturnType<typeof getData>["text"];
}) => (
  <button
    type="button"
    className={`service-card ${isPremium ? "premium" : ""} ${isInCart ? "selected" : ""}`}
    onClick={() => onOpen(service)}
    aria-pressed={isInCart}
    aria-label={`${service.title}, ${formatMoney(service.price, lang)}. ${isInCart ? "Selecionado" : "Abrir detalhes"}`}
  >
    <div className="service-top">
      <div className="service-icon">
        <Icon name={service.icon} size={24} />
      </div>
      <div>
        <h3 className="service-title">{service.title}</h3>
        <p className="service-desc">{service.desc}</p>
      </div>
      {isInCart ? (
        <div className="selected-dot" aria-hidden="true">
          <Icon name="check" size={16} />
        </div>
      ) : null}
    </div>
    <div className="service-foot">
      <span className="tag">
        {service.popular ? <Icon name="star" size={13} /> : null}
        {service.popular ? T.popularBadge : service.tag}
      </span>
      <span className="price-box">
        {service.fullPrice ? <span className="old-price">{T.from} {formatMoney(service.fullPrice, lang)}</span> : null}
        <span className="price">{formatMoney(service.price, lang)}</span>
      </span>
    </div>
  </button>
));

const ServiceModal = memo(({
  service,
  onClose,
  onSelect,
  isInCart,
  lang,
  T,
}: {
  service: ServiceItem | null;
  onClose: () => void;
  onSelect: (service: ServiceItem) => void;
  isInCart: boolean;
  lang: Lang;
  T: ReturnType<typeof getData>["text"];
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!service) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.classList.add("modal-open");
    setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
        <div className="modal-head">
          <button ref={closeRef} type="button" className="icon-button modal-close" onClick={onClose} aria-label="Fechar detalhes">
            <Icon name="x" size={20} />
          </button>
          <div className="service-icon">
            <Icon name={service.icon} size={26} />
          </div>
          <span className="tag" style={{ marginTop: 16 }}>{service.tag}</span>
          <h2 id="service-modal-title" className="modal-title">{service.title}</h2>
          <div className="modal-price-row">
            {service.fullPrice ? <span className="old-price">{T.from} {formatMoney(service.fullPrice, lang)}</span> : null}
            <strong className="price">{formatMoney(service.price, lang)}</strong>
          </div>
        </div>
        <div className="modal-body">
          <p>{service.desc}</p>
          <h3 className="subhead">{T.detailsLabel}</h3>
          <div className="details-list">
            {service.details.split("\n").filter(Boolean).map((line, index) => (
              <div key={`${line}-${index}`}>
                <Icon name="check" size={17} />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <Button full variant={service.type === "pack" && !isInCart ? "amber" : isInCart ? "secondary" : "primary"} onClick={() => { onSelect(service); onClose(); }}>
            {isInCart ? "Remover Seleção" : "Selecionar Serviço"}
          </Button>
        </div>
      </section>
    </div>
  );
});

const FAQItem = memo(({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  const id = useMemo(() => `faq-${q.replace(/\W+/g, "-").slice(0, 24)}`, [q]);

  return (
    <div className="faq-item">
      <button className="faq-question" type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((value) => !value)}>
        <span>{q}</span>
        <Icon name="chevron-down" size={18} />
      </button>
      <div id={id} className={`faq-answer ${open ? "open" : ""}`}>
        <p>{a}</p>
      </div>
    </div>
  );
});

const ReviewCard = memo(({ review }: { review: Review }) => (
  <article className="review-card">
    <div className="review-top">
      <div className="person">
        <div className="avatar" aria-hidden="true">{review.n.charAt(0)}</div>
        <div>
          <span className="person-name">{review.n}</span>
          <span className="person-loc">{review.loc}</span>
        </div>
      </div>
      <div className="stars" aria-label={`${review.s} de 5 estrelas`}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} name="star" size={14} />
        ))}
      </div>
    </div>
    <span className="tag"><Icon name="award" size={13} />{review.serv}</span>
    <p className="quote">"{review.t}"</p>
  </article>
));

const SmartTimer = memo(({ text }: { text: string }) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const interval = window.setInterval(() => setTime((prev) => (prev <= 0 ? 600 : prev - 1)), 1000);
    return () => window.clearInterval(interval);
  }, []);
  const pct = (time / 600) * 100;
  const formatted = `${Math.floor(time / 60)}:${String(time % 60).padStart(2, "0")}`;
  return (
    <div className="timer" role="timer" aria-live="polite">
      <div className="timer-ring" aria-hidden="true">
        <svg viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(59,130,246,.18)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={`${pct * 0.942} 100`} />
        </svg>
        <Icon name="clock" size={20} />
      </div>
      <div>
        <p className="timer-label">{text}</p>
        <p className="timer-time">{formatted}</p>
      </div>
    </div>
  );
});

const SideMenu = memo(({
  isOpen,
  onClose,
  toggleTheme,
  isDark,
  user,
  T,
}: {
  isOpen: boolean;
  onClose: () => void;
  toggleTheme: () => void;
  isDark: boolean;
  user: UserData;
  T: ReturnType<typeof getData>["text"];
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    document.body.classList.add("modal-open");
    setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="side-backdrop" onClick={onClose} />
      <aside className="side-menu" role="dialog" aria-modal="true" aria-labelledby="menu-title">
        <div className="menu-head">
          <h2 id="menu-title">{T.menuTitle}</h2>
          <button ref={closeRef} type="button" className="icon-button" onClick={onClose} aria-label="Fechar menu">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="menu-xp">
          <span className="eyebrow" style={{ color: "var(--blue-2)" }}>{T.levelYours}</span>
          <strong>{user.xp} XP</strong>
          <p>{T.menuWarning}</p>
        </div>
        <div className="menu-actions">
          <button type="button" className="menu-action" onClick={toggleTheme}>
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name={isDark ? "moon" : "sun"} size={19} />
              {T.themeTitle}
            </span>
            <strong>{isDark ? T.themeDark : T.themeLight}</strong>
          </button>
          <button
            type="button"
            className="menu-action"
            onClick={() => {
              if (navigator.share) navigator.share({ title: "Thalyson Massagens", text: T.shareText, url: window.location.href }).catch(() => undefined);
            }}
          >
            <span style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon name="share" size={19} />
              {T.referBtn}
            </span>
          </button>
        </div>
      </aside>
    </>
  );
});

const RuleItem = memo(({ rule }: { rule: Rule }) => (
  <div className="rule-item">
    <div className="check-icon"><Icon name={rule.icon} size={21} /></div>
    <div>
      <h4>{rule.title}</h4>
      <p>{rule.description}</p>
    </div>
  </div>
));

const categoryMeta = [
  { id: "relax", color: "#3b82f6", titlePt: "Apenas Relaxar", titleEn: "Just Relax", icon: "sun", descPt: "Tire a dor muscular e todo o estresse das costas.", descEn: "Therapeutic body work to relieve stress." },
  { id: "express", color: "#10b981", titlePt: "Cuidados Rápidos", titleEn: "Express Care", icon: "watch", descPt: "Alívio rápido e localizado nas mãos e pés cansados.", descEn: "Quick localized relief for hands and feet." },
  { id: "final", color: "#f59e0b", titlePt: "Massagens com Finalização", titleEn: "With Ending", icon: "sparkles", descPt: "Jornada completa, sensorial e mais intensa.", descEn: "A complete and intense sensory journey." },
  { id: "care", color: "#ec4899", titlePt: "Cuidados Pessoais", titleEn: "Personal Care", icon: "scissors", descPt: "Manutenção estética para deixar seu corpo impecável.", descEn: "Aesthetic body maintenance." },
] as const;

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>("pt");
  const [activeTab, setActiveTab] = useState<"single" | "packs">("single");
  const [toasts, setToasts] = useState<Array<{ id: number; msg: string; type: ToastType }>>([]);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [hasErrorGlobal, setHasErrorGlobal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState<UserData>({
    name: "",
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 92,
    lastActivity: new Date().toISOString(),
  });

  const [booking, setBooking] = useState<BookingData>({
    type: "single",
    cart: [],
    extras: {},
    date: null,
    time: null,
    locationType: "home",
    address: { cep: "", street: "", number: "", district: "", city: "", comp: "", placeName: "" },
    payment: "",
    appliedCoupon: null,
    termsAccepted: false,
    bookingId: `BOOK_${Date.now()}`,
    mediaAllowed: false,
  });

  const dateScrollRef = useRef<HTMLDivElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);

  const addToast = useCallback((msg: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, msg, type }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3800);
  }, []);

  const openExternal = useCallback((platform: "whatsapp" | "instagram", text?: string) => {
    const url = platform === "whatsapp"
      ? `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text || "")}`
      : CONFIG.INSTAGRAM_URL;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => document.body.removeChild(anchor), 100);
  }, []);

  useEffect(() => {
    setIsClient(true);
    cleanupStorage();
    if (isWebViewUserAgent() && /android/i.test(navigator.userAgent)) {
      window.location.href = `intent://${window.location.href.replace(/^https?:\/\//i, "")}#Intent;scheme=https;package=com.android.chrome;end`;
    }
  }, []);

  useEffect(() => {
    if (isClient) document.title = step === 0 ? "Thalyson Massagens" : lang === "en" ? "Your Booking - Thalyson" : "Seu Agendamento - Thalyson";
  }, [step, isClient, lang]);

  useEffect(() => {
    if (!isClient) return;
    let loadedUser: UserData | null = null;
    let loadedBooking: Partial<BookingData> | null = null;
    let loadedStep: Step = 0;
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && typeof parsed.user === "object") {
          loadedUser = {
            name: parsed.user.name || "",
            xp: typeof parsed.user.xp === "number" ? parsed.user.xp : 0,
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            hasSeenWelcome: Boolean(parsed.user.hasSeenWelcome),
            ordersCount: typeof parsed.user.ordersCount === "number" ? Math.max(parsed.user.ordersCount, 92) : 92,
            lastActivity: parsed.user.lastActivity || new Date().toISOString(),
          };
        }
        if (parsed.bookingDraft && Array.isArray(parsed.bookingDraft.cart)) {
          const draftDate = parsed.bookingDraft.date ? new Date(parsed.bookingDraft.date) : null;
          if (!draftDate || draftDate > new Date()) {
            loadedBooking = {
              ...parsed.bookingDraft,
              cart: parsed.bookingDraft.cart || [],
              extras: typeof parsed.bookingDraft.extras === "object" ? parsed.bookingDraft.extras : {},
              mediaAllowed: Boolean(parsed.bookingDraft.mediaAllowed),
              address: {
                cep: sanitizeInput(parsed.bookingDraft.address?.cep || ""),
                street: sanitizeInput(parsed.bookingDraft.address?.street || ""),
                number: sanitizeInput(parsed.bookingDraft.address?.number || ""),
                district: sanitizeInput(parsed.bookingDraft.address?.district || ""),
                city: sanitizeInput(parsed.bookingDraft.address?.city || ""),
                comp: sanitizeInput(parsed.bookingDraft.address?.comp || ""),
                placeName: sanitizeInput(parsed.bookingDraft.address?.placeName || ""),
              },
            };
            if (typeof parsed.step === "number" && parsed.step >= 0 && parsed.step <= 4) loadedStep = parsed.step;
          }
        }
      }
    } catch {}
    if (loadedUser) setUser(loadedUser);
    if (loadedBooking) setBooking((prev) => ({ ...prev, ...loadedBooking }));
    setStep(loadedStep);
    setDataLoaded(true);
    window.setTimeout(() => setLoading(false), 700);
  }, [isClient]);

  useEffect(() => {
    if (!isClient || !dataLoaded) return;
    try {
      const payload = JSON.stringify({
        user: { ...user, lastActivity: new Date().toISOString() },
        bookingDraft: { ...booking, appliedCoupon: booking.appliedCoupon ? { ...booking.appliedCoupon } : null },
        step,
      });
      if (payload.length < CONFIG.MAX_STORAGE_SIZE_KB * 1024) localStorage.setItem(CONFIG.STORAGE_KEY, payload);
    } catch {}
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
    if (!loading && isClient && dataLoaded) {
      if (!user.hasSeenWelcome) {
        const timer = window.setTimeout(() => setWelcomePopup(true), 1400);
        return () => window.clearTimeout(timer);
      }
      addToast(T.toastLoaded, "success");
    }
  }, [loading, isClient, dataLoaded, user.hasSeenWelcome, addToast, T.toastLoaded]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    const hasOpenModal = termsOpen || welcomePopup || levelUpPopup;
    if (!hasOpenModal) return;
    document.body.classList.add("modal-open");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (termsOpen) setTermsOpen(false);
      else if (welcomePopup) {
        setWelcomePopup(false);
        setUser((prev) => ({ ...prev, hasSeenWelcome: true }));
      }
      else if (levelUpPopup) setLevelUpPopup(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [termsOpen, welcomePopup, levelUpPopup]);

  const handleToggleCartItem = useCallback((item: ServiceItem) => {
    vibrate(35);
    setBooking((prev) => {
      const exists = prev.cart.some((cartItem) => cartItem.id === item.id);
      return {
        ...prev,
        cart: exists ? prev.cart.filter((cartItem) => cartItem.id !== item.id) : [...prev.cart, item],
        payment: "",
        termsAccepted: false,
      };
    });
    addToast(T.toastCartToggle);
  }, [addToast, T.toastCartToggle]);

  const handleCepChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskCEP(event.target.value);
    setBooking((prev) => ({ ...prev, address: { ...prev.address, cep: masked } }));
    if (masked.length !== 9) return;
    setIsFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${masked.replace("-", "")}/json/`);
      const json = await response.json();
      if (!json.erro) {
        setBooking((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            cep: masked,
            street: json.logradouro || prev.address.street,
            district: json.bairro || prev.address.district,
            city: json.localidade || prev.address.city,
          },
        }));
        addToast(T.toastCepFound);
      } else {
        addToast(T.toastCepError, "error");
      }
    } catch {
      addToast(T.toastCepError, "error");
    } finally {
      setIsFetchingCep(false);
    }
  };

  const daysArray = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 30 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      return day;
    });
  }, []);

  const getDayLabel = useCallback((date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === today.toDateString()) return T.today;
    if (date.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return date.toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: "short" }).replace(".", "").slice(0, 3).toUpperCase();
  }, [T.today, T.tomorrow, lang]);

  const timeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }, (_, index) => {
      const hour = CONFIG.START_HOUR + index;
      return `${hour < 10 ? "0" : ""}${hour}:00`;
    });
    const now = new Date();
    const selected = new Date(booking.date);
    if (Number.isNaN(selected.getTime())) return [];
    if (selected.toDateString() === now.toDateString()) {
      return slots.filter((slot) => Number(slot.split(":")[0]) > now.getHours());
    }
    return slots;
  }, [booking.date]);

  const groupedTimeSlots = useMemo(() => ({
    morning: timeSlots.filter((slot) => Number(slot.split(":")[0]) < 12),
    afternoon: timeSlots.filter((slot) => {
      const hour = Number(slot.split(":")[0]);
      return hour >= 12 && hour < 17;
    }),
    evening: timeSlots.filter((slot) => Number(slot.split(":")[0]) >= 17),
  }), [timeSlots]);

  const financials = useMemo(() => {
    if (booking.cart.length === 0) return { total: 0, sub: 0, disc: 0, pixDisc: 0, mediaDisc: 0, rushFee: 0, duration: 0 };
    const isPack = booking.cart.some((item) => item.type === "pack");
    let sub = booking.cart.reduce((total, item) => total + item.price, 0);
    let baseDuration = isPack ? 60 : booking.cart.reduce((total, item) => total + (item.min || 60), 0);
    Object.keys(booking.extras || {}).forEach((key) => {
      if (!booking.extras[key]) return;
      const extra = DATA.extras.find((item) => item.id === key);
      if (!extra) return;
      sub += isPack ? Math.floor(extra.price * 0.8) : extra.price;
      if (extra.id === "more_time") baseDuration += 30;
    });
    const rushFee = RUSH_HOURS.includes(booking.time || "") && booking.locationType !== "motel" ? RUSH_FEE : 0;
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let running = Math.max(0, sub - disc);
    const mediaDisc = booking.mediaAllowed ? Math.ceil(running * 0.01) : 0;
    running = Math.max(0, running - mediaDisc);
    const pixDisc = booking.payment === "pix" ? Math.ceil(running * 0.03) : 0;
    return { sub, disc, pixDisc, mediaDisc, rushFee, total: Math.max(0, running - pixDisc) + rushFee, duration: baseDuration };
  }, [booking.cart, booking.extras, booking.appliedCoupon, booking.mediaAllowed, booking.payment, booking.time, booking.locationType, DATA.extras]);

  const estimatedXP = useMemo(() => {
    const isPack = booking.cart.some((item) => item.type === "pack");
    return Math.floor(financials.total * (isPack ? 0.3 : 0.15));
  }, [booking.cart, financials.total]);

  const nextLevel = useMemo(() => {
    if (user.xp >= 800) {
      const needed = 500 - ((user.xp - 800) % 500);
      return { needed, reward: DATA.levels[3].reward };
    }
    const next = DATA.levels.find((level) => level.xpNeeded > user.xp);
    return next ? { needed: next.xpNeeded - user.xp, reward: next.reward } : null;
  }, [user.xp, DATA.levels]);

  const currentLevelProgress = useMemo(() => {
    if (user.xp >= 800) return (((user.xp - 800) % 500) / 500) * 100;
    const currentIndex = DATA.levels.reduce((acc, level, index) => (user.xp >= level.xpNeeded ? index : acc), 0);
    const current = DATA.levels[currentIndex];
    const next = DATA.levels[currentIndex + 1];
    if (!next) return 100;
    return Math.min(100, Math.max(0, ((user.xp - current.xpNeeded) / (next.xpNeeded - current.xpNeeded)) * 100));
  }, [user.xp, DATA.levels]);

  const currentLevelTitle = useMemo(() => {
    if (user.xp >= 800) return "Plenitude Plus";
    return [...DATA.levels].reverse().find((level) => user.xp >= level.xpNeeded)?.title || DATA.levels[0].title;
  }, [user.xp, DATA.levels]);

  const isStepValid = useCallback(() => {
    if (step === 0) return booking.cart.length > 0;
    if (step === 1) {
      if (!user.name || user.name.trim().length < 3) return false;
      if (booking.locationType === "home") return validateAddress(booking.address);
      if (booking.locationType === "hotel") return Boolean(booking.address.placeName && booking.address.city);
      return true;
    }
    if (step === 2) return Boolean(booking.date && booking.time);
    if (step === 3) return Boolean(booking.payment && booking.termsAccepted);
    return true;
  }, [step, booking, user.name]);

  const generateWhatsAppMsg = useCallback(() => {
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : "";
    const hash = btoa(encodeURIComponent(`${financials.total}-${dateStr}-${booking.cart[0]?.id || ""}-${CONFIG.SECRET_TOKEN}`)).substring(0, 8).toUpperCase();
    const isEn = lang === "en";
    const serviceText = booking.cart.map((item) => {
      const lines = item.details.split("\n").map((line) => `  - ${line}`).join("\n");
      return `*${item.title}*\n_${item.desc}_\n${lines}`;
    }).join("\n\n");
    let location = "";
    let mapQ = "";
    if (booking.locationType === "home") {
      const address = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      location = `Residência\n${address}\nComplemento: ${booking.address.comp || "-"}`;
      mapQ = address;
    } else if (booking.locationType === "motel") {
      location = isEn ? "My private suite, address confirmed on WhatsApp" : "Minha suíte privada, endereço confirmado no WhatsApp";
    } else {
      location = `Hotel: ${booking.address.placeName}\nCidade: ${booking.address.city}\nQuarto: ${booking.address.comp || "-"}`;
      mapQ = `${booking.address.placeName}, ${booking.address.city}`;
    }
    const extras = Object.keys(booking.extras).filter((key) => booking.extras[key]).map((key) => DATA.extras.find((extra) => extra.id === key)?.label).filter(Boolean).join("\n- ");
    const priceLines = [
      `Subtotal: ${formatMoney(financials.sub, lang)}`,
      financials.disc > 0 ? `${booking.appliedCoupon?.code}: -${formatMoney(financials.disc, lang)}` : "",
      financials.mediaDisc > 0 ? `Portfólio: -${formatMoney(financials.mediaDisc, lang)}` : "",
      financials.pixDisc > 0 ? `PIX 3%: -${formatMoney(financials.pixDisc, lang)}` : "",
      financials.rushFee > 0 ? `Taxa de Pico: +${formatMoney(financials.rushFee, lang)}` : "",
      `TOTAL: ${formatMoney(financials.total, lang)}`,
    ].filter(Boolean).join("\n");
    const mapLink = mapQ ? `\nGPS: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQ)}` : "";
    return `${isEn ? "*CARE RESERVATION*" : "*PEDIDO DE ENCONTRO*"} | #${hash}

${isEn ? "Hello Thalyson! I'd like to schedule my moment." : "Olá Thalyson! Gostaria de agendar meu momento."}

Nome: ${sanitizeInput(user.name)}
Data: ${dateStr} ${isEn ? "at" : "às"} ${booking.time}
Tempo estimado: ${financials.duration} min

${isEn ? "WHAT I CHOSE" : "O QUE EU ESCOLHI"}:
${serviceText}

${extras ? `${isEn ? "Extras" : "Extras selecionados"}:\n- ${extras}\n` : ""}
${isEn ? "WHERE" : "ONDE VAMOS NOS VER"}:
${location}${mapLink}

${booking.locationType !== "motel" ? `${isEn ? "Travel fee will be confirmed in chat." : "Taxa do Uber será confirmada no chat."}\n` : ""}
${isEn ? "FINAL VALUE" : "VALOR FINAL"}:
${priceLines}

Pagamento: ${booking.payment.toUpperCase()}

${isEn ? "I read and accept the rules. I await confirmation." : "Eu li e aceito as regras. Aguardo sua confirmação."}`.trim();
  }, [booking, financials, lang, user.name, DATA.extras]);

  const finishBooking = useCallback(() => {
    vibrate([80, 40, 80]);
    let updatedCoupons = [...user.coupons];
    const updatedHistory = [...user.usedCoupons];
    if (booking.appliedCoupon && booking.appliedCoupon.id !== "manual") {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) updatedHistory.push(booking.appliedCoupon.code);
      updatedCoupons = updatedCoupons.filter((coupon) => coupon.code !== booking.appliedCoupon?.code);
    }
    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    DATA.levels.forEach((level) => {
      if (newXP >= level.xpNeeded && user.xp < level.xpNeeded && level.level > 1) {
        leveledUp = true;
        updatedCoupons.push({ id: `LVL${level.level}_${Date.now()}`, val: level.reward, title: level.title, code: `LVLUP${level.level}` });
      }
    });
    if (newXP > 800) {
      const oldLoop = Math.floor(Math.max(0, user.xp - 800) / 500);
      const newLoop = Math.floor(Math.max(0, newXP - 800) / 500);
      if (newLoop > oldLoop) {
        leveledUp = true;
        updatedCoupons.push({ id: `PLUS_${Date.now()}`, val: DATA.levels[3].reward, title: "Plenitude Plus", code: `PLUS${newLoop}` });
      }
    }
    setUser((prev) => ({
      ...prev,
      xp: newXP,
      coupons: updatedCoupons,
      usedCoupons: updatedHistory,
      ordersCount: (prev.ordersCount || 92) + 1,
      lastActivity: new Date().toISOString(),
    }));
    if (leveledUp) setLevelUpPopup(true);
    openExternal("whatsapp", generateWhatsAppMsg());
    setStep(4);
  }, [DATA.levels, booking.appliedCoupon, estimatedXP, generateWhatsAppMsg, openExternal, user.coupons, user.usedCoupons, user.xp]);

  const handleNextStep = useCallback(() => {
    if (!isStepValid()) {
      vibrate([35, 35]);
      setHasErrorGlobal(true);
      window.setTimeout(() => setHasErrorGlobal(false), 500);
      const messages: Record<number, string> = {
        0: T.toastSelectItem,
        1: !user.name || user.name.trim().length < 3 ? T.toastFillName : T.toastFillAddr,
        2: T.toastSelectDate,
        3: T.toastAcceptTerms,
      };
      addToast(messages[step], "error");
      return;
    }
    vibrate(25);
    if (step === 3) finishBooking();
    else setStep((prev) => Math.min(4, prev + 1) as Step);
  }, [addToast, finishBooking, isStepValid, step, T, user.name]);

  const categoryStyles = (color: string) => ({
    "--cat-color": color,
    "--cat-border": `${color}33`,
    "--cat-bg": `${color}10`,
  } as React.CSSProperties);

  if (!isClient) return <div style={{ minHeight: "100vh", background: "#11141a" }} />;

  if (loading) {
    return (
      <>
        <GlobalStyles isDark={isDark} />
        <div className="app" style={{ display: "grid", placeItems: "center", paddingBottom: 40 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 86, height: 86, display: "grid", placeItems: "center", margin: "0 auto 22px", borderRadius: 26, background: "#2563eb", color: "white", fontSize: 46, fontWeight: 700 }}>T</div>
            <p className="eyebrow" style={{ color: "var(--faint)" }}>{T.loading}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles isDark={isDark} />
      <a className="skip-link" href="#main-content">Pular para o conteúdo</a>
      <ToastContainer toasts={toasts} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} toggleTheme={() => setIsDark((prev) => !prev)} isDark={isDark} user={user} T={T} />
      <ServiceModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSelect={handleToggleCartItem}
        isInCart={selectedService ? booking.cart.some((item) => item.id === selectedService.id) : false}
        lang={lang}
        T={T}
      />

      <div className="app">
        <div className="shell">
          {step !== 4 && (
            <header className="topbar">
              <button type="button" className="brand-button" onClick={() => setStep(0)} aria-label="Voltar ao início">
                <h1 className="brand-title">Thalyson Massagens</h1>
                <div className="brand-meta">
                  <span className="status-dot" />
                  <span>{lang === "en" ? `${user.ordersCount}+ ${T.headerTensions}` : `+${user.ordersCount} ${T.headerTensions}`}</span>
                </div>
              </button>
              <div className="icon-row" aria-label="Ações rápidas">
                <button type="button" className="icon-button" onClick={() => setLang((prev) => prev === "pt" ? "en" : "pt")} aria-label={lang === "pt" ? "Mudar para inglês" : "Change to Portuguese"}>
                  <Icon name="globe" size={20} />
                  <span className="lang-chip">{lang.toUpperCase()}</span>
                </button>
                <button type="button" className="icon-button" onClick={() => openExternal("instagram")} aria-label="Abrir Instagram">
                  <Icon name="instagram" size={20} />
                </button>
                <button type="button" className="icon-button" onClick={() => setMenuOpen(true)} aria-label="Abrir configurações">
                  <Icon name="menu" size={20} />
                </button>
              </div>
            </header>
          )}

          {step > 0 && step < 4 && (
            <nav className="stepper" aria-label="Etapas do agendamento">
              {[1, 2, 3].map((index) => (
                <button
                  key={index}
                  type="button"
                  className="stepper-button"
                  onClick={() => index < step && setStep(index as Step)}
                  aria-current={step === index ? "step" : undefined}
                  disabled={index > step}
                >
                  <span className={`step-line ${step >= index ? "active" : ""}`} />
                  <span className="step-label">{index === 1 ? T.stepWhere : index === 2 ? T.stepWhen : T.stepSummary}</span>
                </button>
              ))}
            </nav>
          )}

          <main id="main-content" tabIndex={-1}>
            {step === 0 && (
              <section className="section-list" aria-labelledby="home-title">
                <div className="hero-grid">
                  <div className="hero-copy">
                    <h2 id="home-title" className="hero-title">
                      {T.welcome} <span className="name text-gradient">{user.name ? user.name.trim().split(" ")[0] : T.welcomeAnon}</span>
                    </h2>
                    <p className="hero-sub">{T.chooseSub}</p>
                  </div>
                  <ProfileCard user={user} T={T} progress={currentLevelProgress} levelTitle={currentLevelTitle} nextLevel={nextLevel} lang={lang} />
                </div>

                <div className="tabs" role="tablist" aria-label="Tipo de serviço">
                  <button className="tab" role="tab" type="button" aria-selected={activeTab === "single"} onClick={() => setActiveTab("single")}>
                    <Icon name="user" size={17} />
                    {T.tabSingle}
                  </button>
                  <button className="tab pack" role="tab" type="button" aria-selected={activeTab === "packs"} onClick={() => setActiveTab("packs")}>
                    <Icon name="package" size={17} />
                    {T.tabPacks}
                  </button>
                </div>

                {activeTab === "single" ? (
                  <div className="section-list" role="tabpanel">
                    {categoryMeta.map((category) => {
                      const services = DATA.services.filter((service) => service.category === category.id);
                      if (!services.length) return null;
                      const selectedCount = booking.cart.filter((item) => item.category === category.id).length;
                      return (
                        <section key={category.id} className="category" style={categoryStyles(category.color)} aria-labelledby={`cat-${category.id}`}>
                          <div className="category-head">
                            <div className="category-icon"><Icon name={category.icon} size={26} /></div>
                            <div>
                              <h3 id={`cat-${category.id}`} className="category-title">{lang === "en" ? category.titleEn : category.titlePt}</h3>
                              <p className="category-desc">{lang === "en" ? category.descEn : category.descPt}</p>
                            </div>
                            {selectedCount > 0 ? <span className="count-badge" aria-label={`${selectedCount} selecionado(s)`}>{selectedCount}</span> : null}
                          </div>
                          <div className="cards-grid">
                            {services.map((service) => (
                              <ServiceCard key={service.id} service={service} isInCart={booking.cart.some((item) => item.id === service.id)} onOpen={setSelectedService} lang={lang} T={T} />
                            ))}
                          </div>
                        </section>
                      );
                    })}
                  </div>
                ) : (
                  <div className="plan-grid" role="tabpanel">
                    {DATA.plans.map((service) => (
                      <ServiceCard key={service.id} service={service} isPremium isInCart={booking.cart.some((item) => item.id === service.id)} onOpen={setSelectedService} lang={lang} T={T} />
                    ))}
                  </div>
                )}

                <section className="reviews-section" aria-labelledby="reviews-title">
                  <div className="section-head">
                    <h3 id="reviews-title" className="section-title">{T.reviewsTitle}</h3>
                    <div className="scroll-actions">
                      <button type="button" className="icon-button" onClick={() => reviewScrollRef.current?.scrollBy({ left: -380, behavior: "smooth" })} aria-label="Avaliações anteriores">
                        <Icon name="chevron-left" size={20} />
                      </button>
                      <button type="button" className="icon-button" onClick={() => reviewScrollRef.current?.scrollBy({ left: 380, behavior: "smooth" })} aria-label="Próximas avaliações">
                        <Icon name="chevron-right" size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="review-track" ref={reviewScrollRef}>
                    {DATA.reviews.map((review, index) => <ReviewCard key={`${review.n}-${index}`} review={review} />)}
                  </div>
                </section>

                <section className="faq-wrap" aria-labelledby="faq-title">
                  <h3 id="faq-title" className="section-title" style={{ textAlign: "center", marginBottom: 22 }}>{T.faqTitle}</h3>
                  <div className="faq-card">
                    {DATA.faq.map((item, index) => <FAQItem key={`${item.q}-${index}`} q={item.q} a={item.a} />)}
                  </div>
                </section>
              </section>
            )}

            {step === 1 && (
              <section aria-labelledby="location-title">
                <h2 id="location-title" className="page-title">{T.locationTitle}</h2>
                <div className={`form-panel ${hasErrorGlobal ? "shake" : ""}`}>
                  <div className="location-grid" role="group" aria-label={T.locationTitle}>
                    {[
                      { id: "home" as LocationType, label: T.locHome, icon: "home", desc: lang === "en" ? "I come to you" : "Vou até você" },
                      { id: "motel" as LocationType, label: T.locMotel, icon: "bed", desc: lang === "en" ? "Discreet space" : "Local discreto" },
                      { id: "hotel" as LocationType, label: T.locHotel, icon: "building", desc: lang === "en" ? "Your room" : "Seu quarto" },
                    ].map((location) => (
                      <button key={location.id} type="button" className="location-option" aria-pressed={booking.locationType === location.id} onClick={() => setBooking((prev) => ({ ...prev, locationType: location.id }))}>
                        <Icon name={location.icon} size={25} />
                        <span>{location.label}</span>
                        <small>{location.desc}</small>
                      </button>
                    ))}
                  </div>

                  <div className="field-stack">
                    <InputField
                      id="name"
                      label={T.inputName}
                      value={user.name}
                      onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))}
                      icon="user"
                      placeholder={lang === "en" ? "Your name" : "Como quer ser chamado?"}
                      autoComplete="name"
                      hasError={hasErrorGlobal && (!user.name || user.name.trim().length < 3)}
                    />

                    {booking.locationType === "home" && (
                      <>
                        <InputField id="cep" label={T.inputCep} value={booking.address.cep} onChange={handleCepChange} icon="map-pin" placeholder="00000-000" type="tel" maxLength={9} disabled={isFetchingCep} autoComplete="postal-code" hasError={hasErrorGlobal && !booking.address.street} />
                        <InputField id="street" label={T.inputAddr} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} placeholder={T.inputAddr} disabled={isFetchingCep} autoComplete="street-address" hasError={hasErrorGlobal && !booking.address.street} />
                        <InputField id="number" label={T.inputNum} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value) } }))} placeholder={T.inputNum} type="tel" autoComplete="address-line2" hasError={hasErrorGlobal && !booking.address.number} />
                        <InputField id="district" label={T.inputDistrict} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} placeholder={T.inputDistrict} disabled={isFetchingCep} hasError={hasErrorGlobal && !booking.address.district} />
                        <InputField id="city" label={T.inputCity} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder={T.inputCity} disabled={isFetchingCep} autoComplete="address-level2" hasError={hasErrorGlobal && !booking.address.city} />
                        <InputField id="comp" label={T.inputComp} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder="Apto, bloco, referência" autoComplete="address-line3" />
                      </>
                    )}

                    {booking.locationType === "hotel" && (
                      <>
                        <InputField id="hotel" label={T.inputHotel} value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} icon="building" placeholder={T.inputHotel} hasError={hasErrorGlobal && !booking.address.placeName} />
                        <InputField id="hotel-city" label={T.inputCity} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder={T.inputCity} hasError={hasErrorGlobal && !booking.address.city} />
                        <InputField id="room" label={T.inputRoom} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder={T.inputRoom} />
                      </>
                    )}

                    {booking.locationType === "motel" && (
                      <div className="notice-card" style={{ padding: 18, display: "flex", gap: 13, alignItems: "flex-start" }}>
                        <div className="check-icon"><Icon name="heart" size={21} /></div>
                        <p style={{ margin: 0, color: "var(--muted)" }}>{T.motelNote}</p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {step === 2 && (
              <section aria-labelledby="time-title">
                <h2 id="time-title" className="page-title">{T.selectTimeTitle}</h2>
                <div className="cart-box">
                  <div className="cart-head">
                    <span>{T.cartTitle}</span>
                    <button type="button" className="cart-edit" onClick={() => setStep(0)}>{T.cartEdit}</button>
                  </div>
                  <div className="chip-row">
                    {booking.cart.map((item) => (
                      <span className="choice-chip" key={item.id}>
                        <Icon name={item.icon} size={15} />
                        <span>{item.title}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="dates-wrap">
                  <div className="date-track" ref={dateScrollRef} aria-label="Escolha uma data">
                    {daysArray.map((day) => {
                      const selected = Boolean(booking.date && new Date(booking.date).toDateString() === day.toDateString());
                      const month = day.toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { month: "short" }).replace(".", "");
                      return (
                        <button
                          key={day.toISOString()}
                          type="button"
                          className="date-button"
                          aria-pressed={selected}
                          onClick={() => {
                            setBooking((prev) => ({ ...prev, date: day.toISOString(), time: null }));
                            vibrate(25);
                          }}
                        >
                          <small>{month}</small>
                          <strong>{day.getDate()}</strong>
                          <small>{getDayLabel(day)}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!booking.date ? (
                  <div className={`empty-state ${hasErrorGlobal ? "shake" : ""}`}>
                    <Icon name="calendar" size={36} />
                    <strong>{T.emptyDate}</strong>
                  </div>
                ) : timeSlots.length > 0 ? (
                  <div className={`time-groups ${hasErrorGlobal && !booking.time ? "shake" : ""}`}>
                    {[
                      { key: "morning", label: T.morning, icon: "sunrise", slots: groupedTimeSlots.morning },
                      { key: "afternoon", label: T.afternoon, icon: "sun", slots: groupedTimeSlots.afternoon },
                      { key: "evening", label: T.evening, icon: "sunset", slots: groupedTimeSlots.evening },
                    ].filter((group) => group.slots.length).map((group) => (
                      <div key={group.key}>
                        <div className="time-title"><Icon name={group.icon} size={16} />{group.label}</div>
                        <div className="time-grid">
                          {group.slots.map((slot) => {
                            const rush = RUSH_HOURS.includes(slot) && booking.locationType !== "motel";
                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`time-button ${rush ? "rush" : ""}`}
                                aria-pressed={booking.time === slot}
                                onClick={() => {
                                  setBooking((prev) => ({ ...prev, time: slot }));
                                  vibrate(25);
                                }}
                              >
                                <span>{slot}</span>
                                {rush ? <small>+{formatMoney(RUSH_FEE, lang)}</small> : null}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {timeSlots.some((slot) => RUSH_HOURS.includes(slot)) && booking.locationType !== "motel" ? (
                      <div className="notice-card warning" style={{ padding: 16, display: "flex", gap: 12 }}>
                        <Icon name="alert-circle" size={20} />
                        <span>{lang === "en" ? "Rush hour slots include a small R$ 15 displacement fee." : "Horários de pico incluem uma pequena taxa de R$ 15 de deslocamento."}</span>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="empty-state"><strong>{T.emptySlots}</strong></div>
                )}
              </section>
            )}

            {step === 3 && (
              <section aria-labelledby="summary-title">
                <SmartTimer text={T.timerText} />
                <div className="summary-card" style={{ marginBottom: 24 }}>
                  <h2 className="panel-title">{T.extrasTitle}</h2>
                  <div className="extras-grid">
                    {DATA.extras.map((extra) => {
                      const price = booking.cart.some((item) => item.type === "pack") ? Math.floor(extra.price * 0.8) : extra.price;
                      const checked = Boolean(booking.extras[extra.id]);
                      return (
                        <button
                          key={extra.id}
                          type="button"
                          className="check-card"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={() => {
                            setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }));
                            vibrate(25);
                          }}
                        >
                          <span className="check-main">
                            <span className="check-icon"><Icon name={extra.icon} size={20} /></span>
                            <span>
                              <strong className="check-title">{extra.label}</strong>
                              <span className="check-desc">{extra.desc}</span>
                            </span>
                          </span>
                          <span className="mini-price">+{formatMoney(price, lang)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="summary-layout">
                  <div className="summary-card">
                    <h2 id="summary-title" className="panel-title"><Icon name="file-text" size={23} />{T.summaryTitle}</h2>
                    <h3 className="subhead">{T.summaryItems}</h3>
                    <div className="line-list">
                      {booking.cart.map((item) => (
                        <div key={item.id} className="line"><span>{item.title}</span><span>{formatMoney(item.price, lang)}</span></div>
                      ))}
                    </div>
                    {Object.keys(booking.extras).some((key) => booking.extras[key]) ? (
                      <>
                        <h3 className="subhead">{T.summaryExtras}</h3>
                        <div className="line-list">
                          {Object.keys(booking.extras).filter((key) => booking.extras[key]).map((key) => {
                            const extra = DATA.extras.find((item) => item.id === key);
                            if (!extra) return null;
                            const price = booking.cart.some((item) => item.type === "pack") ? Math.floor(extra.price * 0.8) : extra.price;
                            return <div key={key} className="line"><span>{extra.label}</span><span>+{formatMoney(price, lang)}</span></div>;
                          })}
                        </div>
                      </>
                    ) : null}
                    <h3 className="subhead">{T.summaryInfo}</h3>
                    <div className="info-row"><Icon name="calendar" size={18} /><span>{booking.date ? new Date(booking.date).toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ""} {lang === "en" ? "at" : "às"} {booking.time}</span></div>
                    <div className="info-row"><Icon name="map-pin" size={18} /><span>{booking.locationType === "home" ? T.summaryLocHome : booking.locationType === "motel" ? T.summaryLocMotel : T.summaryLocHotel}</span></div>
                    <div className="info-row"><Icon name="clock" size={18} /><span>{T.estimatedTime}: {financials.duration} min</span></div>

                    <h3 className="subhead">{T.totalLabel}</h3>
                    <div className="line-list">
                      <div className="line"><span>{T.subtotal}</span><span>{formatMoney(financials.sub, lang)}</span></div>
                      {financials.disc > 0 ? <div className="line"><span>{booking.appliedCoupon?.title}</span><span>-{formatMoney(financials.disc, lang)}</span></div> : null}
                      {financials.mediaDisc > 0 ? <div className="line"><span>{T.mediaDiscount}</span><span>-{formatMoney(financials.mediaDisc, lang)}</span></div> : null}
                      {financials.pixDisc > 0 ? <div className="line"><span>{T.pixDiscount}</span><span>-{formatMoney(financials.pixDisc, lang)}</span></div> : null}
                      {financials.rushFee > 0 ? <div className="line"><span>{T.msgRushFee}</span><span>+{formatMoney(financials.rushFee, lang)}</span></div> : null}
                    </div>
                    <div className="total-row">
                      <span className="total-label">{T.totalLabel}</span>
                      <div>
                        <p className="total-price text-gradient">{formatMoney(financials.total, lang)}</p>
                        <p className="xp-today">+{estimatedXP} {T.xpGuaranteed}</p>
                      </div>
                    </div>
                    {booking.locationType !== "motel" ? (
                      <div className="notice-card" style={{ marginTop: 18, padding: 14, display: "flex", gap: 12 }}>
                        <Icon name="car" size={18} />
                        <span style={{ color: "var(--muted)", fontSize: ".86rem" }}>{T.uberNotice}</span>
                      </div>
                    ) : null}
                  </div>

                  <aside className="side-stack">
                    <div className="side-card">
                      <h3 className="panel-title"><Icon name="ticket" size={21} />{T.couponSection}</h3>
                      {user.coupons.length > 0 ? (
                        <div className="line-list">
                          {user.coupons.map((coupon) => (
                            <button key={coupon.id} type="button" className="option-button" aria-pressed={booking.appliedCoupon?.id === coupon.id} onClick={() => setBooking((prev) => ({ ...prev, appliedCoupon: prev.appliedCoupon?.id === coupon.id ? null : coupon }))}>
                              <Icon name="gift" size={18} />
                              <span>{coupon.title}</span>
                              <span className="radio-dot" />
                            </button>
                          ))}
                        </div>
                      ) : (
                        <p className="check-desc">{T.couponEmpty}</p>
                      )}
                    </div>
                    <div className="side-card">
                      <h3 className="panel-title"><Icon name="camera" size={21} />{T.mediaTitle}</h3>
                      <p className="check-desc" style={{ marginBottom: 14 }}>{T.mediaDesc}</p>
                      <button type="button" className="photo-permission" aria-pressed={booking.mediaAllowed} onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))}>
                        <span>{booking.mediaAllowed ? T.mediaGranted : T.mediaSupport}</span>
                        <span>{T.mediaBonus}</span>
                      </button>
                    </div>
                    <div className={`side-card ${hasErrorGlobal && !booking.payment ? "shake" : ""}`}>
                      <h3 className="panel-title">{T.paymentTitle}</h3>
                      <div className="line-list">
                        {[
                          { id: "pix" as PaymentMethod, label: T.payPix, icon: "smartphone" },
                          { id: "card" as PaymentMethod, label: T.payCard, icon: "credit-card" },
                          { id: "money" as PaymentMethod, label: T.payCash, icon: "banknote" },
                        ].map((payment) => (
                          <button
                            key={payment.id}
                            type="button"
                            className="option-button"
                            aria-pressed={booking.payment === payment.id}
                            onClick={() => {
                              setBooking((prev) => ({ ...prev, payment: payment.id }));
                              if (payment.id === "pix" && navigator.clipboard) {
                                navigator.clipboard.writeText(CONFIG.PIX_KEY).catch(() => undefined);
                                addToast(T.toastPixCopied);
                              }
                            }}
                          >
                            <Icon name={payment.icon} size={20} />
                            <span>{payment.label}</span>
                            <span className="radio-dot" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className={hasErrorGlobal && !booking.termsAccepted ? "shake" : ""}>
                      <button type="button" className={`terms-button ${booking.termsAccepted ? "accepted" : ""}`} onClick={() => setTermsOpen(true)}>
                        <span style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                          <span className="check-icon"><Icon name="heart" size={21} /></span>
                          <span style={{ minWidth: 0 }}>
                            <strong style={{ display: "block" }}>{T.termsTitle}</strong>
                            <small style={{ color: "var(--muted)" }}>{T.termsRead}</small>
                          </span>
                        </span>
                        {booking.termsAccepted ? <Icon name="check" size={21} /> : <Icon name="chevron-right" size={21} />}
                      </button>
                    </div>
                  </aside>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className="success" aria-labelledby="success-title">
                <div className="success-mark"><Icon name="check" size={52} /></div>
                <h2 id="success-title">{T.successTitle}</h2>
                <p>{T.successSub}</p>
                <div className="success-box">
                  <div className="info-row"><Icon name="user" size={18} /><span>{user.name}</span></div>
                  <div className="info-row"><Icon name="calendar" size={18} /><span>{booking.date ? new Date(booking.date).toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : ""} {lang === "en" ? "at" : "às"} {booking.time}</span></div>
                  <div className="total-row" style={{ marginTop: 4 }}>
                    <span className="total-label">{T.totalLabel}</span>
                    <p className="total-price text-gradient">{formatMoney(financials.total, lang)}</p>
                  </div>
                </div>
                <Button full variant="whatsapp" icon="message" onClick={() => openExternal("whatsapp", generateWhatsAppMsg())}>{T.whatsappBtn}</Button>
                <button
                  type="button"
                  className="secondary-btn full"
                  onClick={() => {
                    setStep(0);
                    setBooking((prev) => ({ ...prev, cart: [], extras: {}, payment: "", termsAccepted: false, appliedCoupon: null, bookingId: `BOOK_${Date.now()}`, mediaAllowed: false }));
                  }}
                >
                  {T.backHome}
                </button>
              </section>
            )}
          </main>
        </div>
      </div>

      {step >= 0 && step < 4 && booking.cart.length > 0 && (
        <nav className="bottom-nav" aria-label="Resumo e navegação">
          <div className="bottom-inner">
            {step > 0 ? (
              <button type="button" className="secondary-btn bottom-back" onClick={() => setStep((prev) => Math.max(0, prev - 1) as Step)} aria-label="Voltar etapa">
                <Icon name="chevron-left" size={22} />
              </button>
            ) : null}
            <div className="bottom-copy">
              <p className="bottom-label">{step === 0 ? `${booking.cart.length} ${T.itemsSelected}` : step === 3 ? T.totalLabel : T.subtotal}</p>
              <p className="bottom-price">{step === 3 ? formatMoney(financials.total, lang) : formatMoney(financials.sub, lang)}</p>
            </div>
            <button type="button" className={`primary-btn bottom-next ${step === 3 ? "whatsapp" : ""}`} onClick={handleNextStep} disabled={!isStepValid()}>
              {step === 3 ? <Icon name="message" size={18} /> : null}
              <span className="wide-label">{step === 3 ? T.finishBtn : T.nextBtn}</span>
              <span className="sr-only">{step === 3 ? T.finishBtn : T.nextBtn}</span>
              {step !== 3 ? <Icon name="chevron-right" size={18} /> : null}
            </button>
          </div>
        </nav>
      )}

      {termsOpen && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="terms-title">
            <div className="modal-head">
              <button type="button" className="icon-button modal-close" onClick={() => setTermsOpen(false)} aria-label="Fechar regras">
                <Icon name="x" size={20} />
              </button>
              <h2 id="terms-title" className="modal-title">{T.rulesComplete}</h2>
            </div>
            <div className="modal-body">
              <div className="rule-list">
                {DATA.rules.map((rule) => <RuleItem key={rule.title} rule={rule} />)}
              </div>
            </div>
            <div className="modal-foot">
              <Button full onClick={() => { setBooking((prev) => ({ ...prev, termsAccepted: true })); setTermsOpen(false); vibrate(30); }}>{T.agreeTerms}</Button>
            </div>
          </section>
        </div>
      )}

      {welcomePopup && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <div className="modal-head">
              <button type="button" className="icon-button modal-close" onClick={() => { setWelcomePopup(false); setUser((prev) => ({ ...prev, hasSeenWelcome: true })); }} aria-label="Fechar presente">
                <Icon name="x" size={20} />
              </button>
              <h2 id="welcome-title" className="modal-title">{T.welcomePopupTitle}</h2>
            </div>
            <div className="modal-body">
              <p>{T.welcomePopupMsg}</p>
              <div className="notice-card warning" style={{ padding: 14, margin: "16px 0" }}>{T.welcomePopupWarning}</div>
              <div className="notice-card" style={{ padding: 18, textAlign: "center" }}>
                <span className="eyebrow" style={{ color: "var(--faint)" }}>{lang === "en" ? "Your first gift" : "Seu presente inaugural"}</span>
                <strong style={{ display: "block", fontSize: "clamp(1.8rem, 8vw, 2.45rem)", overflowWrap: "anywhere" }}>BEMVINDO10</strong>
              </div>
            </div>
            <div className="modal-foot">
              <Button full onClick={() => {
                const coupon: Coupon = { id: "welcome", val: 10, title: "BEMVINDO10", code: "BEMVINDO10" };
                setWelcomePopup(false);
                setUser((prev) => ({ ...prev, hasSeenWelcome: true, coupons: prev.coupons.some((item) => item.code === coupon.code) ? prev.coupons : [...prev.coupons, coupon] }));
                setBooking((prev) => ({ ...prev, appliedCoupon: coupon }));
                addToast(T.toastCouponSuccess);
              }}>{T.getCoupon}</Button>
            </div>
          </section>
        </div>
      )}

      {levelUpPopup && (
        <div className="modal-backdrop" role="presentation">
          <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="level-title">
            <div className="modal-head" style={{ textAlign: "center" }}>
              <div className="service-icon" style={{ margin: "0 auto", background: "var(--amber)", color: "#1f1604" }}><Icon name="trophy" size={30} /></div>
              <h2 id="level-title" className="modal-title" style={{ paddingRight: 0 }}>{T.levelupPopupTitle}</h2>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <p>{T.levelupPopupMsg}</p>
            </div>
            <div className="modal-foot">
              <Button full variant="amber" onClick={() => setLevelUpPopup(false)}>{T.levelRedeem}</Button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
