import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

type Lang = "pt" | "en";
type Step = 0 | 1 | 2 | 3 | 4;
type LocationType = "home" | "motel" | "hotel";
type PaymentMethod = "" | "pix" | "card" | "money";
type ToastKind = "success" | "error";
type Category = "relax" | "express" | "sensory" | "care";

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_HANDLE: "@relaxarhojesp",
  INSTAGRAM_URL: "https://instagram.com/relaxarhojesp",
  STORAGE_KEY: "@thaly_app_v30_relaxarhojesp_booking",
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: "pt-BR",
  LOCALE_EN: "en-US",
  EXCHANGE_RATE: 5,
  SECRET_TOKEN: "THALY_SECURE_V10",
  START_HOUR: 9,
  END_HOUR: 22,
  RUSH_FEE: 15,
  PROFILE_PHOTO_PRIMARY: "https://i.ibb.co/gZxp3Dwz/Screenshot-1.png",
  PROFILE_PHOTO_FALLBACK: "https://i.ibb.co/YBxM3t8p/Screenshot-1.png",
} as const;

const RUSH_HOURS = ["12:00", "13:00", "17:00", "18:00"];

const ICON_PATHS: Record<string, string> = {
  menu: "M4 12h16 M4 6h16 M4 18h16",
  x: "M18 6L6 18 M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  "chevron-left": "M15 18l-6-6 6-6",
  "chevron-right": "M9 18l6-6-6-6",
  globe: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M2 12h20 M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z",
  instagram: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8 M16 6l-4-4-4 4 M12 2v13",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  bed: "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9",
  building: "M4 22V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17 M4 22h16 M10 22V10h4v12 M14 6h.01 M10 6h.01",
  "map-pin": "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  calendar: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",
  clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2",
  smartphone: "M5 2h14a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01",
  "credit-card": "M3 10h18 M7 15h.01 M11 15h2 M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z",
  banknote: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M5 8h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z",
  message: "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 8-8h.5a8.48 8.48 0 0 1 8 8v.5z",
  gift: "M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  sparkles: "M9.94 15.5A2 2 0 0 0 8.5 14.06L2.37 12.48a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3",
  hand: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  sun: "M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.36 5.64l-.7.7 M6.34 17.66l-.7.7 M5.64 5.64l.7.7 M17.66 17.66l.7.7 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  scissors: "M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z",
  package: "M16.5 9.4L7.5 4.21 M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shower: "M12 4v4 M12 8l-2 2 M12 8l2 2 M7.5 12.5L5 15 M14 12.5L21.5 15 M10 15l-1 4 M16 15l1 4 M4 8h16",
  car: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2 M7 17v4h2v-4 M15 17v4h2v-4",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  alert: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 8v4 M12 16h.01",
};

interface ServiceItem {
  id: string;
  category: Category;
  type: "single" | "pack";
  title: string;
  short: string;
  ideal: string;
  steps: string[];
  duration: number;
  price: number;
  fullPrice?: number;
  icon: string;
  tag: string;
  popular?: boolean;
}

interface ExtraItem {
  id: string;
  title: string;
  desc: string;
  price: number;
  icon: string;
}

interface Coupon {
  id: string;
  title: string;
  code: string;
  val: number;
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
  item: ServiceItem | null;
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: LocationType;
  address: Address;
  payment: PaymentMethod;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
  mediaAllowed: boolean;
  bookingId: string;
}

const emptyAddress: Address = {
  cep: "",
  street: "",
  number: "",
  district: "",
  city: "",
  comp: "",
  placeName: "",
};

const fallbackSvg =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' rx='80' fill='%23202a3a'/%3E%3Ccircle cx='80' cy='60' r='30' fill='%2360a5fa'/%3E%3Cpath d='M30 145c12-38 41-58 50-58s38 20 50 58' fill='%233b82f6'/%3E%3C/svg%3E";

const getData = (lang: Lang) => {
  const en = lang === "en";

  return {
    levels: [
      { xp: 0, reward: 0, title: en ? "Starting Care" : "Começando o Cuidado" },
      { xp: 100, reward: 15, title: en ? "Returning Client" : "Cliente de Retorno" },
      { xp: 350, reward: 30, title: en ? "Body in Balance" : "Corpo em Equilíbrio" },
      { xp: 800, reward: 50, title: en ? "Priority Care" : "Cuidado Prioritário" },
    ],
    services: [
      {
        id: "pes",
        category: "express",
        type: "single",
        title: en ? "Foot Massage" : "Massagem nos Pés",
        short: en ? "Quick relief for tired feet." : "Alívio rápido para pés cansados.",
        ideal: en ? "For those who work standing, walk a lot, or feel heavy legs." : "Para quem trabalha em pé, anda muito ou sente as pernas pesadas.",
        steps: en ? ["I clean and warm up the area.", "I use pressure points on the sole and instep.", "We finish with light stretching."] : ["Faço uma preparação rápida da região.", "Trabalho pontos de pressão na sola e no peito do pé.", "Finalizo com alongamento leve para você pisar melhor."],
        duration: 40,
        price: 110,
        icon: "hand",
        tag: en ? "Fast relief" : "Alívio rápido",
      },
      {
        id: "maos",
        category: "express",
        type: "single",
        title: en ? "Hand Massage" : "Massagem nas Mãos",
        short: en ? "Relief for hands, wrists and forearms." : "Alívio para mãos, punhos e antebraços.",
        ideal: en ? "For typing, manual work, gaming, driving, or daily tension." : "Para quem digita, trabalha com as mãos, dirige ou sente tensão acumulada.",
        steps: en ? ["Finger and wrist mobility.", "Deep work on palms and forearms.", "Calm finish to reduce stiffness."] : ["Mobilidade dos dedos e punhos.", "Massagem profunda nas palmas e antebraços.", "Finalização calma para reduzir rigidez."],
        duration: 40,
        price: 110,
        icon: "hand",
        tag: en ? "Hands" : "Mãos",
      },
      {
        id: "classica",
        category: "relax",
        type: "single",
        title: en ? "Classic Therapeutic Massage" : "Massagem Clássica Terapêutica",
        short: en ? "Back, shoulders and neck relief, without intimate touch." : "Costas, ombros e pescoço, sem toque íntimo.",
        ideal: en ? "For stress, stiff back, poor sleep and body fatigue." : "Para estresse, costas travadas, sono ruim e corpo cansado.",
        steps: en ? ["I map where you feel pain.", "I loosen the back, shoulders and neck.", "We end with a calmer rhythm so the body settles."] : ["Entendo onde você está sentindo dor.", "Solto costas, ombros e pescoço com pressão progressiva.", "Finalizo em ritmo calmo para o corpo desacelerar."],
        duration: 50,
        price: 157,
        icon: "sun",
        tag: en ? "Therapeutic" : "Terapêutica",
      },
      {
        id: "naturista",
        category: "relax",
        type: "single",
        title: en ? "Naturist Classic" : "Clássica Naturista",
        short: en ? "More body freedom, with a calm and respectful pace." : "Mais liberdade corporal, com ritmo calmo e respeitoso.",
        ideal: en ? "For those who want less tension from clothes and more body comfort." : "Para quem quer menos tensão de roupa e mais conforto corporal.",
        steps: en ? ["We agree on limits before starting.", "I do a complete relaxing massage.", "The focus stays on relaxation, safety and respect."] : ["Combinamos limites antes de começar.", "Faço uma massagem relaxante completa.", "O foco é relaxamento, segurança e respeito."],
        duration: 50,
        price: 197,
        icon: "sun",
        tag: en ? "Body freedom" : "Liberdade",
      },
      {
        id: "atletas",
        category: "relax",
        type: "single",
        title: en ? "Sports Recovery" : "Massagem para Atletas",
        short: en ? "Firm work for post-training recovery." : "Pegada firme para recuperação pós-treino.",
        ideal: en ? "For legs, back and shoulders after heavy workouts." : "Para pernas, costas e ombros depois de treino pesado.",
        steps: en ? ["I warm up the muscles.", "I work deeper tension points.", "We finish with stretching and mobility."] : ["Aqueço os músculos cansados.", "Trabalho pontos de tensão mais profundos.", "Finalizo com alongamentos e mobilidade."],
        duration: 60,
        price: 187,
        icon: "zap",
        tag: en ? "Recovery" : "Recuperação",
      },
      {
        id: "sensorial",
        category: "sensory",
        type: "single",
        title: en ? "Sensory Massage" : "Massagem Sensorial",
        short: en ? "Light touch, slow breathing and a relaxing finish." : "Toques leves, respiração calma e finalização relaxante.",
        ideal: en ? "For anxiety, mental overload and the need for calmer body care." : "Para ansiedade, mente acelerada e necessidade de acolhimento corporal.",
        steps: en ? ["I start with a calm body warm-up.", "I use light, slow and continuous touch.", "We align comfort and limits before the session begins."] : ["Começo com aquecimento calmo do corpo.", "Uso toques leves, lentos e contínuos.", "Alinhamos conforto e limites antes da sessão começar."],
        duration: 60,
        price: 177,
        icon: "sparkles",
        tag: en ? "Sensory" : "Sensorial",
      },
      {
        id: "fusion",
        category: "sensory",
        type: "single",
        title: en ? "Fusion Experience" : "Experiência Fusion",
        short: en ? "Therapeutic relief first, sensory care after." : "Primeiro alívio muscular, depois cuidado sensorial.",
        ideal: en ? "For those who want one complete session without choosing between body pain and stress." : "Para quem quer uma sessão completa sem escolher entre dor no corpo e estresse.",
        steps: en ? ["We begin with classic massage on tense areas.", "Then the rhythm becomes more sensory.", "The whole session follows the limits agreed before starting."] : ["Começamos com massagem clássica nas áreas tensas.", "Depois o ritmo fica mais sensorial.", "Toda a sessão segue os limites combinados antes de começar."],
        duration: 70,
        price: 207,
        icon: "sparkles",
        tag: en ? "Complete" : "Completa",
        popular: true,
      },
      {
        id: "reversa",
        category: "sensory",
        type: "single",
        title: en ? "Reverse Massage" : "Massagem Reversa",
        short: en ? "A more interactive session, always with consent." : "Sessão mais interativa, sempre com consentimento.",
        ideal: en ? "For those who want a warmer, more participative experience." : "Para quem quer uma experiência mais próxima e participativa.",
        steps: en ? ["I take care of you first.", "Then participation can be more active within agreed limits.", "We keep the rhythm comfortable, clear and respectful."] : ["Primeiro eu cuido de você.", "Depois a participação pode ser mais ativa, dentro dos limites combinados.", "Mantemos tudo confortável, claro e respeitoso."],
        duration: 70,
        price: 260,
        icon: "hand",
        tag: en ? "Interactive" : "Interativa",
      },
      {
        id: "nuru",
        category: "sensory",
        type: "single",
        title: en ? "Nuru Massage" : "Massagem Nuru",
        short: en ? "Warm gel, body glide and deep relaxation." : "Gel aquecido, deslizamento corporal e relaxamento profundo.",
        ideal: en ? "For those who want an immersive sensory experience with clear agreement first." : "Para quem quer uma experiência sensorial imersiva, com tudo combinado antes.",
        steps: en ? ["We align limits and comfort.", "I apply proper gel for glide.", "The session follows a slow, immersive rhythm."] : ["Alinhamos limites e conforto.", "Aplico gel próprio para deslizamento.", "A sessão segue um ritmo lento e imersivo."],
        duration: 70,
        price: 317,
        icon: "star",
        tag: en ? "Intense" : "Intensa",
      },
      {
        id: "aparos",
        category: "care",
        type: "single",
        title: en ? "Body Hair Trim" : "Aparo de Pelos do Corpo",
        short: en ? "Careful trim with a professional clipper." : "Aparo cuidadoso com máquina profissional.",
        ideal: en ? "For practical body care without salon coldness." : "Para cuidado corporal prático, sem frieza de salão.",
        steps: en ? ["You choose the body areas.", "I trim with care and hygiene.", "We finish with a clean, comfortable look."] : ["Você escolhe as regiões do corpo.", "Faço o aparo com cuidado e higiene.", "Finalizamos com visual limpo e confortável."],
        duration: 60,
        price: 107,
        icon: "scissors",
        tag: en ? "Body care" : "Estética",
      },
      {
        id: "pack_rotina",
        category: "care",
        type: "pack",
        title: en ? "Routine Relief Plan" : "Plano Alívio de Rotina",
        short: en ? "Two sessions in the month for body maintenance." : "Duas sessões no mês para manutenção do corpo.",
        ideal: en ? "For those who want care scheduled before pain gets worse." : "Para quem quer se cuidar antes da dor acumular.",
        steps: en ? ["1 foot or hand massage.", "1 classic therapeutic massage.", "The second date is aligned by WhatsApp."] : ["1 massagem nos pés ou mãos.", "1 massagem clássica terapêutica.", "A segunda data é combinada pelo WhatsApp."],
        duration: 60,
        price: 247,
        fullPrice: 284,
        icon: "package",
        tag: en ? "2 sessions" : "2 sessões",
      },
      {
        id: "pack_completo",
        category: "care",
        type: "pack",
        title: en ? "Complete Month Plan" : "Plano Mês Completo",
        short: en ? "Three sessions to keep body and mind lighter." : "Três sessões para manter corpo e mente mais leves.",
        ideal: en ? "For those who want a real monthly care routine." : "Para quem quer uma rotina mensal de cuidado de verdade.",
        steps: en ? ["1 therapeutic session.", "1 sensory session.", "1 premium session chosen with you by WhatsApp."] : ["1 sessão terapêutica.", "1 sessão sensorial.", "1 sessão premium escolhida com você pelo WhatsApp."],
        duration: 70,
        price: 637,
        fullPrice: 721,
        icon: "package",
        tag: en ? "3 sessions" : "3 sessões",
        popular: true,
      },
    ] as ServiceItem[],
    extras: [
      { id: "more_time", title: en ? "Add 30 minutes" : "Mais 30 minutos", desc: en ? "Useful if you want a slower session." : "Bom para fazer tudo com mais calma.", price: 77, icon: "clock" },
      { id: "aroma", title: en ? "Aromatherapy" : "Aromaterapia", desc: en ? "Essential oils to calm the room." : "Óleos essenciais para deixar o ambiente mais calmo.", price: 17, icon: "sparkles" },
      { id: "pain_relief", title: en ? "Extra pain focus" : "Foco extra em dores", desc: en ? "More time on the tightest area." : "Mais atenção na região mais travada.", price: 17, icon: "shield" },
      { id: "hair_trim", title: en ? "Body trim extra" : "Aparo extra", desc: en ? "Trim up to two body areas." : "Aparo em até duas regiões do corpo.", price: 57, icon: "scissors" },
      { id: "touch", title: en ? "More interaction" : "Mais interação", desc: en ? "More participation, within agreed limits." : "Mais participação, dentro dos limites combinados.", price: 77, icon: "hand" },
    ] as ExtraItem[],
    rules: [
      { icon: "shower", title: en ? "Shower before the session" : "Banho antes da sessão", desc: en ? "A warm shower keeps everything more comfortable and hygienic." : "Um banho quente deixa tudo mais confortável, higiênico e relaxante." },
      { icon: "shield", title: en ? "Health and safety" : "Saúde e segurança", desc: en ? "Only schedule if you are healthy and without contagious symptoms." : "Agende apenas se estiver saudável e sem sintomas contagiosos." },
      { icon: "hand", title: en ? "Clear consent" : "Consentimento claro", desc: en ? "Anything sensory or interactive is agreed before it happens." : "Tudo que for sensorial ou interativo é combinado antes de acontecer." },
      { icon: "message", title: en ? "Confirmation by WhatsApp" : "Confirmação pelo WhatsApp", desc: en ? "The app prepares the request. The final confirmation happens in chat." : "O app prepara o pedido. A confirmação final acontece na conversa." },
    ],
    reviews: [
      { name: "Gustavo", place: "Bela Vista - SP", service: "Fusion", text: "Chegou no horário, explicou tudo com calma e a massagem tirou a tensão das minhas costas. Saí mais leve." },
      { name: "Giovana", place: "Santa Fé do Sul", service: "Sensorial", text: "Foi respeitoso do começo ao fim. Eu estava muito tensa e consegui relaxar de verdade." },
      { name: "Bruno", place: "São Paulo", service: "Clássica", text: "Massagem bem feita, pressão certa e atendimento discreto. Recomendo para quem quer aliviar dor." },
      { name: "Ricardo", place: "Fernandópolis", service: "Reversa", text: "Me senti à vontade porque tudo foi explicado antes. A experiência foi tranquila e muito cuidadosa." },
    ],
    text: {
      brand: "Thalyson Massagens",
      tagline: en ? "mobile massage and body care" : "massagem e cuidado corporal com atendimento móvel",
      heroTitle: en ? "Choose your session with calm and clarity." : "Escolha sua sessão com calma e clareza.",
      heroText: en ? "First choose what you need. Then add the place, date and time. At the end, the request goes ready to WhatsApp for confirmation." : "Primeiro escolha o tipo de cuidado. Depois informe local, data e horário. No fim, o pedido vai pronto para o WhatsApp para confirmarmos.",
      flowTitle: en ? "Booking flow" : "Fluxo do agendamento",
      flowCopy: en ? "Follow the steps and review everything before sending. Nothing is confirmed until WhatsApp." : "Siga as etapas e confira tudo antes de enviar. Nada fica confirmado sem a conversa no WhatsApp.",
      flowSession: en ? "Choose the session" : "Escolha a sessão",
      flowPlace: en ? "Tell the place" : "Informe o local",
      flowTime: en ? "Pick date and time" : "Escolha data e horário",
      flowReview: en ? "Review and send" : "Revise e envie",
      footerTitle: en ? "Need to check before booking?" : "Precisa conferir antes de agendar?",
      footerText: en ? "See the Instagram for updates and send the booking only when everything is clear to you." : "Veja o Instagram para acompanhar novidades e envie o pedido só quando estiver tudo claro para você.",
      footerPrivacy: en ? "Your address is only used to prepare the WhatsApp request." : "Seu endereço é usado apenas para montar o pedido no WhatsApp.",
      footerInstagram: en ? "Open Instagram" : "Abrir Instagram",
      footerCta: en ? "Start by choosing a session" : "Comece escolhendo uma sessão",
      photoAlt: "Thalyson",
      xpTitle: en ? "Your care progress" : "Seu progresso de cuidado",
      xpSaved: en ? "Saved on this device" : "Salvo neste aparelho",
      nextReward: en ? "to unlock a benefit" : "para liberar um benefício",
      singleTab: en ? "Single sessions" : "Sessões avulsas",
      packTab: en ? "Monthly plans" : "Planos mensais",
      chooseOne: en ? "Choose one session to continue." : "Escolha uma sessão para continuar.",
      select: en ? "Choose this" : "Escolher",
      selected: en ? "Selected" : "Escolhido",
      change: en ? "Change" : "Trocar",
      idealFor: en ? "Best for" : "Ideal para",
      whatHappens: en ? "What happens" : "O que acontece",
      minutes: en ? "min" : "min",
      from: en ? "From" : "De",
      reviews: en ? "What clients say" : "O que clientes dizem",
      next: en ? "Continue" : "Continuar",
      back: en ? "Back" : "Voltar",
      finish: en ? "Send request" : "Enviar pedido",
      whereTitle: en ? "Where will the session happen?" : "Onde a sessão vai acontecer?",
      whereHelp: en ? "The address is only used to prepare the WhatsApp request." : "O endereço é usado apenas para montar o pedido no WhatsApp.",
      name: en ? "Your name or nickname" : "Seu nome ou apelido",
      cep: en ? "ZIP code" : "CEP",
      street: en ? "Street or avenue" : "Rua ou avenida",
      number: en ? "Number" : "Número",
      district: en ? "Neighborhood" : "Bairro",
      city: en ? "City" : "Cidade",
      complement: en ? "Complement or reference" : "Complemento ou referência",
      hotel: en ? "Hotel name" : "Nome do hotel",
      room: en ? "Room or suite" : "Quarto ou suíte",
      home: en ? "Your address" : "Seu endereço",
      motel: en ? "My private suite" : "Minha suíte privada",
      hotelLoc: en ? "Hotel" : "Hotel",
      motelNote: en ? "I send the private suite address by WhatsApp after the request." : "Eu envio o endereço da suíte privada pelo WhatsApp depois do pedido.",
      whenTitle: en ? "Choose date and time" : "Escolha data e horário",
      chosenSession: en ? "Chosen session" : "Sessão escolhida",
      today: en ? "Today" : "Hoje",
      tomorrow: en ? "Tomorrow" : "Amanhã",
      morning: en ? "Morning" : "Manhã",
      afternoon: en ? "Afternoon" : "Tarde",
      evening: en ? "Evening" : "Noite",
      emptyDate: en ? "Choose a day to see available times." : "Escolha um dia para ver os horários disponíveis.",
      emptySlots: en ? "No times left for this day." : "Não há horários restantes para esse dia.",
      rushFee: en ? "Rush hour fee" : "Taxa de horário de pico",
      rushNote: en ? "Noon and late afternoon include a small travel fee." : "Meio-dia e fim de tarde têm uma pequena taxa de deslocamento.",
      summaryTitle: en ? "Review your request" : "Confira seu pedido",
      extrasTitle: en ? "Optional extras" : "Complementos opcionais",
      paymentTitle: en ? "Payment at the session" : "Pagamento na sessão",
      termsTitle: en ? "Before sending" : "Antes de enviar",
      termsRead: en ? "Read and accept the simple rules." : "Leia e aceite as regras simples.",
      accept: en ? "I read and agree" : "Li e aceito",
      subtotal: en ? "Subtotal" : "Subtotal",
      discount: en ? "Discount" : "Desconto",
      total: en ? "Total" : "Total",
      duration: en ? "Estimated duration" : "Duração estimada",
      pix: en ? "Pix, 3% off" : "Pix, 3% de desconto",
      card: en ? "Card" : "Cartão",
      cash: en ? "Cash" : "Dinheiro",
      photoPermission: en ? "Portfolio photos" : "Fotos para portfólio",
      photoCopy: en ? "Optional anonymous photos without face or intimacy. Gives 1% off." : "Opcional: fotos anônimas, sem rosto ou intimidade. Ganha 1% de desconto.",
      allowPhoto: en ? "Allow and apply discount" : "Permitir e aplicar desconto",
      allowedPhoto: en ? "Discount applied" : "Desconto aplicado",
      uber: en ? "Travel cost is confirmed in WhatsApp before the session." : "O deslocamento é confirmado no WhatsApp antes da sessão.",
      successTitle: en ? "Request ready." : "Pedido pronto.",
      successText: en ? "WhatsApp opened with your request. If it did not open, tap the button below." : "O WhatsApp abriu com seu pedido. Se não abriu, toque no botão abaixo.",
      openWhats: en ? "Open WhatsApp" : "Abrir WhatsApp",
      startAgain: en ? "Start again" : "Começar de novo",
      menu: en ? "Menu" : "Menu",
      theme: en ? "Theme" : "Tema",
      dark: en ? "Dark" : "Escuro",
      light: en ? "Light" : "Claro",
      refer: en ? "Share" : "Compartilhar",
      loaded: en ? "Progress loaded." : "Progresso carregado.",
      selectToast: en ? "Choose a session to continue." : "Escolha uma sessão para continuar.",
      nameToast: en ? "Fill in your name." : "Preencha seu nome.",
      addressToast: en ? "Fill in the location." : "Preencha o local.",
      timeToast: en ? "Choose date and time." : "Escolha data e horário.",
      paymentToast: en ? "Choose a payment method." : "Escolha uma forma de pagamento.",
      termsToast: en ? "Accept the rules before sending." : "Aceite as regras antes de enviar.",
      cepOk: en ? "Address found." : "Endereço encontrado.",
      cepError: en ? "ZIP code not found." : "CEP não encontrado.",
      pixCopied: en ? "Pix key copied." : "Chave Pix copiada.",
      welcomeTitle: en ? "Welcome." : "Boas-vindas.",
      welcomeText: en ? "You got a first visit benefit." : "Você ganhou um benefício de primeira visita.",
      welcomeWarn: en ? "Your XP is saved in this browser." : "Seu XP fica salvo neste navegador.",
      getGift: en ? "Apply benefit" : "Aplicar benefício",
      levelTitle: en ? "New benefit unlocked." : "Novo benefício liberado.",
      levelText: en ? "Your care routine generated a new discount." : "Sua rotina de cuidado gerou um novo desconto.",
    },
  };
};

const sanitizeInput = (value: string) => String(value || "").replace(/[<>&"']/g, "");
const maskCep = (value: string) => value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
const compactDate = (date: Date, lang: Lang) => date.toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { day: "2-digit", month: "2-digit" });

const money = (value: number, lang: Lang) => {
  const finalValue = lang === "pt" ? value : value / CONFIG.EXCHANGE_RATE;
  return lang === "pt" ? `R$ ${finalValue.toFixed(2).replace(".", ",")}` : `$ ${finalValue.toFixed(2)}`;
};

const vibrate = (pattern: number | number[] = 30) => {
  try {
    navigator.vibrate?.(pattern);
  } catch {}
};

const Icon = memo(({ name, size = 20 }: { name: string; size?: number }) => (
  <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name] || ""} />
  </svg>
));

const Styles = memo(({ isDark }: { isDark: boolean }) => (
  <style>{`
    :root {
      --bg: ${isDark ? "#101318" : "#f7f8fa"};
      --surface: ${isDark ? "#171b22" : "#ffffff"};
      --surface-2: ${isDark ? "#202631" : "#eef2f7"};
      --surface-3: ${isDark ? "#121720" : "#f9fafb"};
      --text: ${isDark ? "#f5f7fb" : "#101828"};
      --muted: ${isDark ? "#b2bac7" : "#596579"};
      --faint: ${isDark ? "#818b9b" : "#7a8494"};
      --border: ${isDark ? "rgba(255,255,255,.12)" : "rgba(16,24,40,.13)"};
      --border-strong: ${isDark ? "rgba(255,255,255,.22)" : "rgba(16,24,40,.24)"};
      --blue: #2563eb;
      --blue-soft: ${isDark ? "rgba(37,99,235,.18)" : "rgba(37,99,235,.08)"};
      --green: #16a34a;
      --amber: #f59e0b;
      --red: #ef4444;
      --shadow: ${isDark ? "0 18px 45px rgba(0,0,0,.35)" : "0 18px 45px rgba(16,24,40,.10)"};
      color-scheme: ${isDark ? "dark" : "light"};
    }

    * { box-sizing: border-box; min-width: 0; }
    :where(h1, h2, h3, h4, p, span, strong, small, label, button, a, li) {
      overflow-wrap: anywhere;
      word-break: normal;
    }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      min-width: 320px;
      background: var(--bg);
      color: var(--text);
      font-family: Poppins, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    button, input { font: inherit; }
    button { border: 0; color: inherit; background: none; cursor: pointer; }
    button:disabled { cursor: not-allowed; opacity: .55; }
    img { display: block; max-width: 100%; }
    a { color: inherit; }
    .no-scroll { overflow: hidden; }
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
    .skip-link {
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 500;
      transform: translateY(-140%);
      padding: 10px 12px;
      border-radius: 8px;
      color: #fff;
      background: var(--blue);
      font-weight: 700;
      text-decoration: none;
    }
    .skip-link:focus { transform: translateY(0); outline: 3px solid rgba(96,165,250,.7); }
    button:focus-visible, input:focus-visible, a:focus-visible {
      outline: 3px solid rgba(96,165,250,.75);
      outline-offset: 3px;
    }
    .icon { flex: 0 0 auto; }
    .app {
      min-height: 100vh;
      padding: 24px 18px 136px;
    }
    .shell {
      width: min(100%, 1120px);
      margin: 0 auto;
    }
    .topbar {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      padding-bottom: 24px;
    }
    .brand {
      flex: 1 1 auto;
      min-width: 0;
      max-width: 720px;
      text-align: left;
      border-radius: 8px;
      padding: 2px;
      margin: -2px;
    }
    .brand-title {
      margin: 0;
      font-size: clamp(1.35rem, 4.4vw, 2rem);
      line-height: 1.1;
      letter-spacing: 0;
      overflow-wrap: anywhere;
      hyphens: auto;
    }
    .brand-sub {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: .86rem;
      overflow-wrap: anywhere;
    }
    .top-actions {
      display: flex;
      gap: 8px;
      flex: 0 0 auto;
    }
    .icon-btn {
      position: relative;
      width: 42px;
      height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      transition: background .18s ease, border-color .18s ease, transform .18s ease;
    }
    .icon-btn:hover { background: var(--surface-2); border-color: var(--border-strong); transform: translateY(-1px); }
    .lang-chip {
      position: absolute;
      right: -5px;
      bottom: -6px;
      padding: 1px 4px;
      border-radius: 5px;
      background: var(--blue);
      color: white;
      font-size: .58rem;
      font-weight: 700;
    }
    .stepper {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      margin-bottom: 24px;
    }
    .step-pill {
      min-height: 42px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      font-size: .82rem;
      font-weight: 700;
      line-height: 1.2;
      text-align: center;
      overflow-wrap: anywhere;
    }
    .step-pill.active { color: white; border-color: var(--blue); background: var(--blue); }
    .step-pill.done { color: var(--text); border-color: var(--border-strong); }
    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
      gap: 22px;
      align-items: stretch;
      margin-bottom: 24px;
    }
    .hero-main {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(190px, 240px);
      gap: 18px;
      align-items: stretch;
    }
    .hero-copy {
      display: grid;
      align-content: center;
    }
    .portrait-card {
      min-height: 100%;
      display: grid;
      align-content: end;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
    }
    .portrait-card .profile-photo {
      width: 100%;
      height: auto;
      aspect-ratio: 4 / 5;
      border-radius: 8px;
      object-fit: cover;
    }
    .portrait-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      color: var(--muted);
      font-size: .78rem;
      font-weight: 700;
    }
    .hero-card,
    .panel,
    .service-card,
    .review-card,
    .choice-card,
    .extra-btn,
    .payment-btn,
    .toggle-btn,
    .rule,
    .success-card,
    .home-footer {
      overflow-wrap: anywhere;
      word-break: break-word;
      hyphens: auto;
    }
    .hero-card {
      padding: clamp(16px, 2.4vw, 22px);
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .hero-title {
      margin: 0;
      font-size: clamp(1.7rem, 6vw, 2.55rem);
      line-height: 1.12;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .hero-text {
      margin: 14px 0 0;
      color: var(--muted);
      font-size: 1rem;
      max-width: 760px;
      overflow-wrap: anywhere;
    }
    .flow-strip {
      display: grid;
      grid-template-columns: minmax(0, .86fr) minmax(0, 1.14fr);
      gap: 16px;
      align-items: stretch;
      margin-bottom: 24px;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
    }
    .flow-copy h2 {
      margin: 0;
      font-size: 1.1rem;
      line-height: 1.25;
    }
    .flow-copy p {
      margin: 6px 0 0;
      color: var(--muted);
      font-size: .9rem;
    }
    .flow-list {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .flow-item {
      display: grid;
      align-content: start;
      gap: 6px;
      min-height: 86px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-3);
    }
    .flow-num {
      width: 28px;
      height: 28px;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background: var(--blue);
      color: #fff;
      font-size: .78rem;
      font-weight: 800;
    }
    .flow-item span:last-child {
      color: var(--muted);
      font-size: .8rem;
      font-weight: 700;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .profile {
      display: grid;
      gap: 14px;
      align-content: start;
    }
    .profile-head {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 14px;
      align-items: center;
    }
    .profile-photo {
      width: 88px;
      height: 88px;
      border: 1px solid var(--border-strong);
      border-radius: 50%;
      object-fit: cover;
      object-position: center;
      background: var(--surface-2);
    }
    .profile-title {
      margin: 0 0 4px;
      font-size: 1.1rem;
      line-height: 1.25;
      overflow-wrap: anywhere;
    }
    .profile-copy {
      margin: 0;
      color: var(--muted);
      font-size: .86rem;
      overflow-wrap: anywhere;
    }
    .xp-row {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
    }
    .xp-number {
      font-size: clamp(1.55rem, 6vw, 2rem);
      line-height: 1;
      font-weight: 700;
      white-space: nowrap;
    }
    .xp-label,
    .info-label {
      color: var(--faint);
      font-size: .76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .progress {
      width: 100%;
      height: 9px;
      overflow: hidden;
      border-radius: 999px;
      background: var(--surface-2);
    }
    .progress > span {
      display: block;
      height: 100%;
      border-radius: inherit;
      background: var(--blue);
    }
    .tabs {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px 0 6px;
      margin-bottom: 18px;
      scrollbar-width: thin;
    }
    .tab {
      flex: 0 0 auto;
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
    }
    .tab[aria-selected="true"] {
      color: white;
      border-color: var(--blue);
      background: var(--blue);
    }
    .section { margin-top: 26px; }
    .section-head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 14px;
    }
    .section-title {
      margin: 0;
      font-size: clamp(1.2rem, 4.4vw, 1.45rem);
      line-height: 1.25;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .section-desc {
      margin: 4px 0 0;
      color: var(--muted);
      overflow-wrap: anywhere;
    }
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 292px), 1fr));
      gap: 14px;
      align-items: stretch;
    }
    .service-card {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 100%;
      padding: 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: ${isDark ? "none" : "0 10px 24px rgba(16,24,40,.06)"};
    }
    .service-card.selected {
      border-color: var(--blue);
      box-shadow: 0 0 0 2px rgba(37,99,235,.22), var(--shadow);
    }
    .service-top {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 12px;
      align-items: start;
    }
    .service-icon {
      width: 42px;
      height: 42px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
      color: var(--blue);
    }
    .service-title {
      margin: 0;
      font-size: 1.08rem;
      line-height: 1.28;
      letter-spacing: 0;
      overflow-wrap: anywhere;
      hyphens: auto;
    }
    .service-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .tag {
      max-width: 100%;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 7px;
      border: 1px solid var(--border);
      border-radius: 999px;
      background: var(--surface-2);
      color: var(--muted);
      font-size: .7rem;
      line-height: 1.2;
      font-weight: 700;
      white-space: normal;
      overflow-wrap: anywhere;
    }
    .service-short {
      margin: 0;
      color: var(--muted);
      font-size: .92rem;
      overflow-wrap: anywhere;
    }
    .info-block {
      display: grid;
      gap: 6px;
    }
    .info-text {
      margin: 0;
      color: var(--text);
      font-size: .9rem;
      overflow-wrap: anywhere;
    }
    .steps {
      margin: 0;
      padding: 0;
      list-style: none;
      display: grid;
      gap: 7px;
    }
    .steps li {
      display: grid;
      grid-template-columns: 18px minmax(0, 1fr);
      gap: 8px;
      color: var(--muted);
      font-size: .88rem;
      overflow-wrap: anywhere;
    }
    .steps li::before {
      content: "";
      width: 7px;
      height: 7px;
      margin-top: .55em;
      border-radius: 50%;
      background: var(--blue);
      justify-self: center;
    }
    .service-footer {
      margin-top: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding-top: 10px;
      border-top: 1px solid var(--border);
    }
    .price-stack {
      display: grid;
      gap: 2px;
    }
    .old-price {
      color: var(--faint);
      font-size: .78rem;
      text-decoration: line-through;
      white-space: nowrap;
    }
    .price {
      font-size: clamp(1.05rem, 4vw, 1.18rem);
      line-height: 1.1;
      font-weight: 700;
      white-space: nowrap;
    }
    .price,
    .old-price,
    .total,
    .xp-number {
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn {
      min-height: 44px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 0;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid transparent;
      background: var(--blue);
      color: white;
      font-weight: 700;
      line-height: 1.2;
      text-align: center;
      white-space: normal;
      max-width: 100%;
      transition: transform .18s ease, background .18s ease, border-color .18s ease;
    }
    .btn:hover:not(:disabled) { transform: translateY(-1px); }
    .btn.secondary {
      color: var(--text);
      border-color: var(--border);
      background: var(--surface-2);
    }
    .btn.success { background: #25d366; }
    .btn.full { width: 100%; }
    .review-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
      gap: 12px;
    }
    .review-card {
      padding: 14px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
    }
    .review-name {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 700;
    }
    .review-name > span:first-child { overflow-wrap: anywhere; }
    .review-text {
      margin: 0;
      color: var(--muted);
      font-size: .9rem;
      overflow-wrap: anywhere;
    }
    .home-footer {
      margin-top: 34px;
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: ${isDark ? "none" : "0 10px 24px rgba(16,24,40,.06)"};
    }
    .home-footer-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(260px, .9fr);
      gap: 16px;
      align-items: stretch;
    }
    .footer-title {
      margin: 0;
      font-size: clamp(1.16rem, 4vw, 1.45rem);
      line-height: 1.22;
    }
    .footer-copy {
      margin: 8px 0 0;
      color: var(--muted);
    }
    .footer-actions {
      display: grid;
      gap: 10px;
      align-content: center;
    }
    .footer-note {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
      color: var(--muted);
      font-size: .9rem;
    }
    .page-title {
      margin: 0 0 8px;
      font-size: clamp(1.45rem, 5.8vw, 1.9rem);
      line-height: 1.15;
      letter-spacing: 0;
      overflow-wrap: anywhere;
    }
    .page-copy {
      margin: 0 0 20px;
      color: var(--muted);
      max-width: 680px;
      overflow-wrap: anywhere;
    }
    .panel {
      padding: 18px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: ${isDark ? "none" : "0 10px 24px rgba(16,24,40,.06)"};
    }
    .location-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-bottom: 18px;
    }
    .choice-card {
      min-height: 88px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      text-align: center;
      font-weight: 700;
      line-height: 1.2;
    }
    .choice-card[aria-pressed="true"] {
      color: white;
      border-color: var(--blue);
      background: var(--blue);
    }
    .field-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }
    .field-grid .wide { grid-column: 1 / -1; }
    .field {
      display: grid;
      gap: 6px;
    }
    .field label {
      color: var(--faint);
      font-size: .76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      overflow-wrap: anywhere;
    }
    .input-wrap { position: relative; }
    .input-wrap .icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--faint);
      pointer-events: none;
    }
    .input {
      width: 100%;
      min-height: 46px;
      padding: 10px 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
      color: var(--text);
      outline: none;
      overflow-wrap: anywhere;
    }
    .input.with-icon { padding-left: 40px; }
    .input.error {
      border-color: var(--red);
      box-shadow: 0 0 0 3px rgba(239,68,68,.14);
    }
    .notice {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
      color: var(--muted);
      overflow-wrap: anywhere;
    }
    .cart-summary {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      margin-bottom: 18px;
    }
    .cart-summary strong { overflow-wrap: anywhere; }
    .date-row {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px 0 12px;
      margin-bottom: 18px;
      scrollbar-width: thin;
    }
    .date-btn {
      flex: 0 0 72px;
      min-height: 82px;
      display: grid;
      place-items: center;
      gap: 2px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      font-weight: 700;
      line-height: 1.1;
      text-align: center;
    }
    .date-btn[aria-pressed="true"] {
      color: white;
      border-color: var(--blue);
      background: var(--blue);
    }
    .date-btn small {
      max-width: 64px;
      font-size: .68rem;
      text-transform: uppercase;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .date-btn span {
      color: inherit;
      font-size: 1.4rem;
      line-height: 1;
    }
    .time-section { margin-top: 16px; }
    .time-section:first-child { margin-top: 0; }
    .time-title {
      margin: 0 0 8px;
      color: var(--faint);
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .time-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(82px, 1fr));
      gap: 8px;
    }
    .time-btn {
      min-height: 50px;
      display: grid;
      place-items: center;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--text);
      font-weight: 700;
    }
    .time-btn.rush {
      color: ${isDark ? "#ffd88a" : "#8a5a00"};
      border-color: rgba(245,158,11,.45);
      background: rgba(245,158,11,.12);
    }
    .time-btn[aria-pressed="true"] {
      color: white;
      border-color: var(--blue);
      background: var(--blue);
    }
    .time-btn.rush[aria-pressed="true"] {
      color: #1f1604;
      border-color: #f59e0b;
      background: #f59e0b;
    }
    .empty-state {
      min-height: 140px;
      display: grid;
      place-items: center;
      padding: 18px;
      border: 1px dashed var(--border-strong);
      border-radius: 8px;
      color: var(--muted);
      text-align: center;
    }
    .summary-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.45fr) minmax(280px, .75fr);
      gap: 16px;
      align-items: start;
    }
    .extras-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
      gap: 10px;
      margin-top: 12px;
    }
    .extra-btn {
      min-height: 100%;
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(max-content, auto);
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      text-align: left;
      align-items: start;
    }
    .extra-btn[aria-pressed="true"] {
      border-color: var(--blue);
      background: var(--blue-soft);
    }
    .extra-btn strong,
    .extra-btn span {
      display: block;
      overflow-wrap: anywhere;
    }
    .extra-btn > strong { white-space: nowrap; }
    .extra-btn span { color: var(--muted); font-size: .84rem; }
    .line-list {
      display: grid;
      gap: 10px;
    }
    .line {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--border);
    }
    .line:last-child { border-bottom: 0; padding-bottom: 0; }
    .line span:first-child {
      color: var(--muted);
      overflow-wrap: anywhere;
    }
    .line span:last-child {
      flex: 0 1 auto;
      max-width: 55%;
      text-align: right;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    .summary-title {
      margin: 0 0 14px;
      font-size: 1.25rem;
      overflow-wrap: anywhere;
    }
    .subhead {
      margin: 18px 0 8px;
      color: var(--faint);
      font-size: .78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .payment-grid {
      display: grid;
      gap: 8px;
    }
    .payment-btn {
      min-height: 48px;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      text-align: left;
      font-weight: 700;
      line-height: 1.2;
    }
    .payment-btn[aria-pressed="true"] {
      color: white;
      border-color: var(--blue);
      background: var(--blue);
    }
    .payment-btn span { overflow-wrap: anywhere; }
    .toggle-btn {
      width: 100%;
      min-height: 46px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      color: var(--muted);
      text-align: left;
      font-weight: 700;
      line-height: 1.25;
    }
    .toggle-btn[aria-pressed="true"] {
      color: var(--text);
      border-color: var(--blue);
      background: var(--blue-soft);
    }
    .total-box {
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--border-strong);
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
    }
    .total {
      font-size: clamp(1.42rem, 8vw, 1.75rem);
      line-height: 1;
      font-weight: 700;
      white-space: nowrap;
    }
    .bottom-bar {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 70;
      padding: 10px max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-right));
      pointer-events: none;
    }
    .bottom-inner {
      width: min(100%, 1120px);
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: var(--surface);
      background: color-mix(in srgb, var(--surface) 92%, transparent);
      box-shadow: var(--shadow);
      backdrop-filter: blur(12px);
      pointer-events: auto;
    }
    .bottom-copy {
      flex: 1 1 auto;
      overflow: hidden;
    }
    .bottom-label {
      margin: 0;
      color: var(--faint);
      font-size: .72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .04em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .bottom-title {
      margin: 2px 0 0;
      font-weight: 700;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: grid;
      place-items: center;
      padding: 14px;
      background: rgba(0,0,0,.72);
    }
    .modal {
      width: min(100%, 540px);
      max-height: min(88vh, 720px);
      overflow: auto;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      border-bottom: 1px solid var(--border);
    }
    .modal-title {
      margin: 0;
      font-size: 1.3rem;
      overflow-wrap: anywhere;
    }
    .modal-body { padding: 16px; }
    .rule-list { display: grid; gap: 10px; }
    .rule {
      display: grid;
      grid-template-columns: 42px minmax(0, 1fr);
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface-2);
    }
    .rule h3 { margin: 0 0 4px; font-size: .98rem; overflow-wrap: anywhere; }
    .rule p { margin: 0; color: var(--muted); font-size: .88rem; overflow-wrap: anywhere; }
    .toast-wrap {
      position: fixed;
      z-index: 260;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      width: min(100% - 24px, 420px);
      display: grid;
      gap: 8px;
      pointer-events: none;
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px;
      border: 1px solid var(--border-strong);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
      color: var(--text);
      pointer-events: auto;
    }
    .toast.error {
      border-color: rgba(239,68,68,.55);
      background: ${isDark ? "#2a171a" : "#fff1f2"};
    }
    .toast p {
      margin: 0;
      font-weight: 700;
      overflow-wrap: anywhere;
    }
    .side-backdrop {
      position: fixed;
      inset: 0;
      z-index: 180;
      background: rgba(0,0,0,.65);
    }
    .side-menu {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 190;
      width: min(90vw, 360px);
      display: grid;
      align-content: start;
      gap: 14px;
      padding: 18px;
      border-left: 1px solid var(--border);
      background: var(--bg);
      box-shadow: var(--shadow);
      overflow-y: auto;
    }
    .side-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .side-head h2 { margin: 0; overflow-wrap: anywhere; }
    .success {
      min-height: 68vh;
      display: grid;
      place-items: center;
      text-align: center;
    }
    .success-card {
      width: min(100%, 520px);
      display: grid;
      gap: 16px;
      padding: 22px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: var(--surface);
      box-shadow: var(--shadow);
    }
    .success-icon {
      width: 74px;
      height: 74px;
      display: grid;
      place-items: center;
      margin: 0 auto;
      border-radius: 50%;
      color: white;
      background: var(--green);
    }
    .success-card h2 { margin: 0; font-size: 1.8rem; }
    .success-card p { margin: 0; color: var(--muted); overflow-wrap: anywhere; }
    .shake { animation: shake .28s ease; }
    @keyframes shake { 0%,100% { transform: translateX(0); } 35% { transform: translateX(-5px); } 70% { transform: translateX(5px); } }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; scroll-behavior: auto !important; }
    }
    @media (max-width: 940px) {
      .hero,
      .hero-main,
      .summary-layout,
      .flow-strip,
      .home-footer-grid {
        grid-template-columns: 1fr;
      }
      .hero-card.profile { order: 0; }
      .flow-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 720px) {
      .stepper { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .location-grid { grid-template-columns: 1fr; }
      .choice-card { min-height: 64px; flex-direction: row; justify-content: flex-start; text-align: left; }
      .field-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 620px) {
      .app { padding: 16px 12px 126px; }
      .topbar { gap: 10px; }
      .brand-sub { font-size: .8rem; }
      .top-actions { gap: 6px; }
      .icon-btn { width: 39px; height: 39px; }
      .hero-card, .panel, .home-footer { padding: 14px; }
      .profile-head { grid-template-columns: 72px minmax(0, 1fr); }
      .profile-photo { width: 72px; height: 72px; }
      .cards-grid { grid-template-columns: 1fr; }
      .service-footer { align-items: stretch; flex-direction: column; }
      .service-footer .btn { width: 100%; }
      .date-btn { flex-basis: 66px; min-height: 76px; }
      .time-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .cart-summary { align-items: stretch; flex-direction: column; }
      .cart-summary .btn { width: 100%; }
      .bottom-inner { gap: 8px; }
      .bottom-inner .btn { min-width: 104px; padding-left: 10px; padding-right: 10px; }
      .bottom-inner .btn.back { min-width: 44px; width: 44px; padding: 0; }
      .bottom-title { max-width: min(48vw, 220px); }
      .line { flex-direction: column; gap: 4px; }
      .line span:last-child { max-width: 100%; text-align: left; }
    }
    @media (max-width: 430px) {
      .flow-list { grid-template-columns: 1fr; }
      .tab { width: max-content; max-width: 86vw; white-space: normal; }
      .topbar { align-items: flex-start; }
      .time-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .extra-btn { grid-template-columns: 1fr; }
      .extra-btn > strong { white-space: normal; }
      .portrait-card .profile-photo { aspect-ratio: 1 / 1; }
    }
    @media (max-width: 380px) {
      .profile-head { grid-template-columns: 62px minmax(0, 1fr); }
      .profile-photo { width: 62px; height: 62px; }
      .bottom-label { font-size: .66rem; }
      .bottom-title { max-width: 118px; }
    }
    @media (max-width: 350px) {
      .bottom-inner {
        flex-wrap: wrap;
      }
      .bottom-copy {
        flex: 1 0 100%;
        order: -1;
      }
      .bottom-title {
        max-width: 100%;
      }
      .bottom-inner .btn:not(.back) {
        flex: 1 1 0;
      }
    }
  `}</style>
));

const InputField = memo(({
  id,
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
  error = false,
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
  error?: boolean;
  disabled?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <div className="input-wrap">
      {icon ? <Icon name={icon} size={18} /> : null}
      <input
        id={id}
        className={`input ${icon ? "with-icon" : ""} ${error ? "error" : ""}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error || undefined}
      />
    </div>
  </div>
));

const ProfilePhoto = memo(({ alt }: { alt: string }) => {
  const sources = [CONFIG.PROFILE_PHOTO_PRIMARY, CONFIG.PROFILE_PHOTO_FALLBACK, fallbackSvg];
  const [index, setIndex] = useState(0);

  return (
    <img
      className="profile-photo"
      src={sources[index]}
      alt={alt}
      loading="eager"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setIndex((current) => Math.min(current + 1, sources.length - 1))}
    />
  );
});

const Toasts = memo(({ toasts }: { toasts: Array<{ id: number; kind: ToastKind; msg: string }> }) => (
  <div className="toast-wrap" aria-live="polite" aria-atomic="true">
    {toasts.map((toast) => (
      <div key={toast.id} className={`toast ${toast.kind === "error" ? "error" : ""}`} role="status">
        <Icon name={toast.kind === "error" ? "alert" : "check"} size={20} />
        <p>{toast.msg}</p>
      </div>
    ))}
  </div>
));

const Button = memo(({
  children,
  onClick,
  variant = "primary",
  disabled,
  full,
  icon,
  className = "",
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "success";
  disabled?: boolean;
  full?: boolean;
  icon?: string;
  className?: string;
  ariaLabel?: string;
}) => (
  <button
    type="button"
    className={`btn ${variant === "secondary" ? "secondary" : ""} ${variant === "success" ? "success" : ""} ${full ? "full" : ""} ${className}`}
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    {icon ? <Icon name={icon} size={18} /> : null}
    {children}
  </button>
));

const FlowGuide = memo(({ T }: { T: ReturnType<typeof getData>["text"] }) => (
  <section className="flow-strip" aria-labelledby="flow-title">
    <div className="flow-copy">
      <h2 id="flow-title">{T.flowTitle}</h2>
      <p>{T.flowCopy}</p>
    </div>
    <ol className="flow-list">
      {[T.flowSession, T.flowPlace, T.flowTime, T.flowReview].map((label, index) => (
        <li className="flow-item" key={label}>
          <span className="flow-num">{index + 1}</span>
          <span>{label}</span>
        </li>
      ))}
    </ol>
  </section>
));

const ServiceCard = memo(({
  item,
  selected,
  lang,
  T,
  onSelect,
}: {
  item: ServiceItem;
  selected: boolean;
  lang: Lang;
  T: ReturnType<typeof getData>["text"];
  onSelect: (item: ServiceItem) => void;
}) => (
  <article className={`service-card ${selected ? "selected" : ""}`}>
    <div className="service-top">
      <div className="service-icon"><Icon name={item.icon} size={22} /></div>
      <div>
        <h3 className="service-title">{item.title}</h3>
        <div className="service-tags">
          <span className="tag">{item.tag}</span>
          {item.popular ? <span className="tag"><Icon name="star" size={13} />{lang === "en" ? "Popular" : "Mais pedido"}</span> : null}
          <span className="tag">{item.duration} {T.minutes}</span>
        </div>
      </div>
    </div>
    <p className="service-short">{item.short}</p>
    <div className="info-block">
      <p className="info-label">{T.idealFor}</p>
      <p className="info-text">{item.ideal}</p>
    </div>
    <div className="info-block">
      <p className="info-label">{T.whatHappens}</p>
      <ul className="steps">
        {item.steps.map((step) => <li key={step}>{step}</li>)}
      </ul>
    </div>
    <div className="service-footer">
      <div className="price-stack">
        {item.fullPrice ? <span className="old-price">{T.from} {money(item.fullPrice, lang)}</span> : null}
        <span className="price">{money(item.price, lang)}</span>
      </div>
      <Button variant={selected ? "secondary" : "primary"} onClick={() => onSelect(item)} icon={selected ? "check" : undefined}>
        {selected ? T.selected : T.select}
      </Button>
    </div>
  </article>
));

const HomeFooter = memo(({
  T,
  selected,
  onStart,
  onInstagram,
}: {
  T: ReturnType<typeof getData>["text"];
  selected: boolean;
  onStart: () => void;
  onInstagram: () => void;
}) => (
  <footer className="home-footer" aria-labelledby="home-footer-title">
    <div className="home-footer-grid">
      <div>
        <h2 id="home-footer-title" className="footer-title">{T.footerTitle}</h2>
        <p className="footer-copy">{T.footerText}</p>
        <div className="footer-note" style={{ marginTop: 14 }}>
          <Icon name="shield" />
          <span>{T.footerPrivacy}</span>
        </div>
      </div>
      <div className="footer-actions">
        <Button variant="secondary" full icon="instagram" onClick={onInstagram}>
          {T.footerInstagram} {CONFIG.INSTAGRAM_HANDLE}
        </Button>
        <Button full icon={selected ? "chevron-right" : "sparkles"} onClick={onStart}>
          {selected ? T.next : T.footerCta}
        </Button>
      </div>
    </div>
  </footer>
));

const SideMenu = memo(({
  open,
  onClose,
  isDark,
  toggleTheme,
  user,
  T,
}: {
  open: boolean;
  onClose: () => void;
  isDark: boolean;
  toggleTheme: () => void;
  user: UserData;
  T: ReturnType<typeof getData>["text"];
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const previous = document.activeElement as HTMLElement | null;
    window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div className="side-backdrop" onClick={onClose} />
      <aside className="side-menu" role="dialog" aria-modal="true" aria-labelledby="menu-title">
        <div className="side-head">
          <h2 id="menu-title">{T.menu}</h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Fechar menu">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="panel">
          <p className="info-label">{T.xpTitle}</p>
          <div className="xp-number" style={{ marginTop: 6 }}>{user.xp} XP</div>
          <p className="profile-copy" style={{ marginTop: 8 }}>{T.xpSaved}</p>
        </div>
        <Button variant="secondary" full onClick={toggleTheme} icon={isDark ? "sun" : "moon"}>
          {T.theme}: {isDark ? T.dark : T.light}
        </Button>
        <Button
          variant="secondary"
          full
          icon="share"
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Thalyson Massagens", text: "Encontrei um atendimento de massagem.", url: window.location.href }).catch(() => undefined);
            }
          }}
        >
          {T.refer}
        </Button>
      </aside>
    </>
  );
});

const RulesModal = memo(({
  open,
  onClose,
  onAccept,
  rules,
  T,
}: {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  rules: ReturnType<typeof getData>["rules"];
  T: ReturnType<typeof getData>["text"];
}) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add("no-scroll");
    const previous = document.activeElement as HTMLElement | null;
    window.setTimeout(() => closeRef.current?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="rules-title">
        <div className="modal-head">
          <h2 id="rules-title" className="modal-title">{T.termsTitle}</h2>
          <button ref={closeRef} type="button" className="icon-btn" onClick={onClose} aria-label="Fechar regras">
            <Icon name="x" size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="rule-list">
            {rules.map((rule) => (
              <div className="rule" key={rule.title}>
                <div className="service-icon"><Icon name={rule.icon} size={20} /></div>
                <div>
                  <h3>{rule.title}</h3>
                  <p>{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16 }}>
            <Button full onClick={onAccept} icon="check">{T.accept}</Button>
          </div>
        </div>
      </section>
    </div>
  );
});

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>("pt");
  const [step, setStep] = useState<Step>(0);
  const [tab, setTab] = useState<"single" | "pack">("single");
  const [menuOpen, setMenuOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);
  const [toasts, setToasts] = useState<Array<{ id: number; kind: ToastKind; msg: string }>>([]);
  const [fetchingCep, setFetchingCep] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const loadedToastShown = useRef(false);

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
    item: null,
    extras: {},
    date: null,
    time: null,
    locationType: "home",
    address: emptyAddress,
    payment: "",
    appliedCoupon: null,
    termsAccepted: false,
    mediaAllowed: false,
    bookingId: `BOOK_${Date.now()}`,
  });

  const addToast = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev.slice(-2), { id, kind, msg }]);
    window.setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3800);
  }, []);

  const openInstagram = useCallback(() => {
    window.open(CONFIG.INSTAGRAM_URL, "_blank", "noopener,noreferrer");
  }, []);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          setUser({
            name: sanitizeInput(parsed.user.name || ""),
            xp: typeof parsed.user.xp === "number" ? parsed.user.xp : 0,
            coupons: Array.isArray(parsed.user.coupons) ? parsed.user.coupons : [],
            usedCoupons: Array.isArray(parsed.user.usedCoupons) ? parsed.user.usedCoupons : [],
            hasSeenWelcome: Boolean(parsed.user.hasSeenWelcome),
            ordersCount: Math.max(92, Number(parsed.user.ordersCount || 92)),
            lastActivity: parsed.user.lastActivity || new Date().toISOString(),
          });
        }
        if (parsed.booking?.item) {
          setBooking((prev) => ({
            ...prev,
            ...parsed.booking,
            address: { ...emptyAddress, ...(parsed.booking.address || {}) },
            extras: parsed.booking.extras || {},
          }));
        }
        if (typeof parsed.step === "number" && parsed.step >= 0 && parsed.step <= 4) setStep(parsed.step);
      }
    } catch {}
    window.setTimeout(() => setLoading(false), 350);
  }, []);

  useEffect(() => {
    if (!isClient || loading) return;
    try {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user: { ...user, lastActivity: new Date().toISOString() }, booking, step }));
    } catch {}
  }, [user, booking, step, isClient, loading]);

  useEffect(() => {
    if (loading) return;
    if (!user.hasSeenWelcome) {
      const timer = window.setTimeout(() => setWelcomeOpen(true), 800);
      return () => window.clearTimeout(timer);
    }
    if (!loadedToastShown.current) {
      loadedToastShown.current = true;
      addToast(T.loaded);
    }
  }, [loading, user.hasSeenWelcome, addToast, T.loaded]);

  useEffect(() => {
    if (!booking.item) return;
    const localized = DATA.services.find((item) => item.id === booking.item?.id);
    if (localized && localized.title !== booking.item.title) {
      setBooking((prev) => ({ ...prev, item: localized }));
    }
  }, [DATA.services, booking.item]);

  useEffect(() => {
    document.title = step === 0 ? "Thalyson Massagens" : "Agendamento - Thalyson Massagens";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  useEffect(() => {
    if (!welcomeOpen && !levelOpen) return;
    document.body.classList.add("no-scroll");
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (welcomeOpen) {
        setWelcomeOpen(false);
        setUser((prev) => ({ ...prev, hasSeenWelcome: true }));
      }
      if (levelOpen) setLevelOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [welcomeOpen, levelOpen]);

  const nextLevel = useMemo(() => {
    const levels = DATA.levels;
    if (user.xp >= 800) return { needed: 500 - ((user.xp - 800) % 500), reward: 50, title: "Plus" };
    const next = levels.find((level) => level.xp > user.xp);
    return next ? { needed: next.xp - user.xp, reward: next.reward, title: next.title } : null;
  }, [DATA.levels, user.xp]);

  const currentProgress = useMemo(() => {
    if (user.xp >= 800) return (((user.xp - 800) % 500) / 500) * 100;
    const levels = DATA.levels;
    const currentIndex = levels.reduce((found, level, index) => user.xp >= level.xp ? index : found, 0);
    const current = levels[currentIndex];
    const next = levels[currentIndex + 1];
    if (!next) return 100;
    return Math.max(0, Math.min(100, ((user.xp - current.xp) / (next.xp - current.xp)) * 100));
  }, [DATA.levels, user.xp]);

  const currentLevelTitle = useMemo(() => {
    if (user.xp >= 800) return lang === "en" ? "Care Plus" : "Cuidado Plus";
    return [...DATA.levels].reverse().find((level) => user.xp >= level.xp)?.title || DATA.levels[0].title;
  }, [DATA.levels, user.xp, lang]);

  const days = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 21 }, (_, index) => {
      const day = new Date(today);
      day.setDate(today.getDate() + index);
      return day;
    });
  }, []);

  const dayLabel = useCallback((day: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    if (day.toDateString() === today.toDateString()) return T.today;
    if (day.toDateString() === tomorrow.toDateString()) return T.tomorrow;
    return day.toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT, { weekday: "short" }).replace(".", "");
  }, [T.today, T.tomorrow, lang]);

  const slots = useMemo(() => {
    if (!booking.date) return [];
    const all = Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }, (_, index) => {
      const hour = CONFIG.START_HOUR + index;
      return `${hour.toString().padStart(2, "0")}:00`;
    });
    const now = new Date();
    const selected = new Date(booking.date);
    if (selected.toDateString() === now.toDateString()) return all.filter((slot) => Number(slot.slice(0, 2)) > now.getHours());
    return all;
  }, [booking.date]);

  const groupedSlots = useMemo(() => ({
    morning: slots.filter((slot) => Number(slot.slice(0, 2)) < 12),
    afternoon: slots.filter((slot) => Number(slot.slice(0, 2)) >= 12 && Number(slot.slice(0, 2)) < 17),
    evening: slots.filter((slot) => Number(slot.slice(0, 2)) >= 17),
  }), [slots]);

  const financials = useMemo(() => {
    const item = booking.item;
    if (!item) return { subtotal: 0, discount: 0, pixDiscount: 0, mediaDiscount: 0, rushFee: 0, total: 0, duration: 0 };
    let subtotal = item.price;
    let duration = item.duration;
    Object.keys(booking.extras).forEach((key) => {
      if (!booking.extras[key]) return;
      const extra = DATA.extras.find((candidate) => candidate.id === key);
      if (!extra) return;
      subtotal += item.type === "pack" ? Math.floor(extra.price * 0.8) : extra.price;
      if (extra.id === "more_time") duration += 30;
    });
    const discount = booking.appliedCoupon?.val || 0;
    let running = Math.max(0, subtotal - discount);
    const mediaDiscount = booking.mediaAllowed ? Math.ceil(running * 0.01) : 0;
    running = Math.max(0, running - mediaDiscount);
    const pixDiscount = booking.payment === "pix" ? Math.ceil(running * 0.03) : 0;
    const rushFee = booking.time && RUSH_HOURS.includes(booking.time) && booking.locationType !== "motel" ? CONFIG.RUSH_FEE : 0;
    return { subtotal, discount, pixDiscount, mediaDiscount, rushFee, total: Math.max(0, running - pixDiscount) + rushFee, duration };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.mediaAllowed, booking.payment, booking.time, booking.locationType, DATA.extras]);

  const estimatedXp = useMemo(() => Math.floor(financials.total * (booking.item?.type === "pack" ? 0.3 : 0.15)), [financials.total, booking.item]);

  const locationValid = useMemo(() => {
    if (!user.name.trim() || user.name.trim().length < 3) return false;
    if (booking.locationType === "motel") return true;
    if (booking.locationType === "hotel") return Boolean(booking.address.placeName && booking.address.city);
    return Boolean(booking.address.street && booking.address.number && booking.address.district && booking.address.city);
  }, [user.name, booking.locationType, booking.address]);

  const isStepValid = useCallback(() => {
    if (step === 0) return Boolean(booking.item);
    if (step === 1) return locationValid;
    if (step === 2) return Boolean(booking.date && booking.time);
    if (step === 3) return Boolean(booking.payment && booking.termsAccepted);
    return true;
  }, [step, booking.item, booking.date, booking.time, booking.payment, booking.termsAccepted, locationValid]);

  const handleCep = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = maskCep(event.target.value);
    setBooking((prev) => ({ ...prev, address: { ...prev.address, cep: value } }));
    if (value.length !== 9) return;
    setFetchingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${value.replace("-", "")}/json/`);
      const result = await response.json();
      if (result.erro) {
        addToast(T.cepError, "error");
        return;
      }
      setBooking((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          cep: value,
          street: result.logradouro || prev.address.street,
          district: result.bairro || prev.address.district,
          city: result.localidade || prev.address.city,
        },
      }));
      addToast(T.cepOk);
    } catch {
      addToast(T.cepError, "error");
    } finally {
      setFetchingCep(false);
    }
  };

  const generateWhatsAppMsg = useCallback(() => {
    const item = booking.item;
    if (!item) return "";
    const dateText = booking.date ? new Date(booking.date).toLocaleDateString(lang === "en" ? CONFIG.LOCALE_EN : CONFIG.LOCALE_PT) : "";
    const hash = btoa(encodeURIComponent(`${item.id}-${financials.total}-${dateText}-${CONFIG.SECRET_TOKEN}`)).slice(0, 8).toUpperCase();
    const extras = Object.keys(booking.extras)
      .filter((key) => booking.extras[key])
      .map((key) => DATA.extras.find((extra) => extra.id === key)?.title)
      .filter(Boolean);
    const location = (() => {
      if (booking.locationType === "motel") return T.motel;
      if (booking.locationType === "hotel") return `${T.hotelLoc}: ${booking.address.placeName}, ${booking.address.city}. ${T.room}: ${booking.address.comp || "-"}`;
      return `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}. ${T.complement}: ${booking.address.comp || "-"}`;
    })();

    return `*PEDIDO DE AGENDAMENTO* #${hash}

Nome: ${sanitizeInput(user.name)}
Sessao: ${item.title}
Data: ${dateText} as ${booking.time}
Duracao estimada: ${financials.duration} min

O que vai acontecer:
${item.steps.map((line) => `- ${line}`).join("\n")}

Local:
${location}

${extras.length ? `Complementos:\n${extras.map((extra) => `- ${extra}`).join("\n")}\n\n` : ""}Pagamento: ${booking.payment.toUpperCase()}
Subtotal: ${money(financials.subtotal, lang)}
${financials.discount ? `Desconto: -${money(financials.discount, lang)}\n` : ""}${financials.mediaDiscount ? `Desconto portfolio: -${money(financials.mediaDiscount, lang)}\n` : ""}${financials.pixDiscount ? `Desconto Pix: -${money(financials.pixDiscount, lang)}\n` : ""}${financials.rushFee ? `Taxa horario de pico: +${money(financials.rushFee, lang)}\n` : ""}Total: ${money(financials.total, lang)}

Li e aceito as regras. Aguardo sua confirmacao.`;
  }, [booking, DATA.extras, financials, lang, user.name, T]);

  const openWhatsApp = useCallback(() => {
    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(generateWhatsAppMsg())}`;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => anchor.remove(), 100);
  }, [generateWhatsAppMsg]);

  const finishBooking = useCallback(() => {
    if (!booking.item) return;
    const newXp = user.xp + estimatedXp;
    const coupons = [...user.coupons];
    const usedCoupons = [...user.usedCoupons];
    if (booking.appliedCoupon && !usedCoupons.includes(booking.appliedCoupon.code)) {
      usedCoupons.push(booking.appliedCoupon.code);
    }
    DATA.levels.forEach((level) => {
      if (newXp >= level.xp && user.xp < level.xp && level.reward > 0) {
        coupons.push({ id: `level-${level.xp}-${Date.now()}`, title: `${money(level.reward, lang)} de desconto`, code: `XP${level.xp}`, val: level.reward });
        setLevelOpen(true);
      }
    });
    setUser((prev) => ({ ...prev, xp: newXp, coupons, usedCoupons, ordersCount: prev.ordersCount + 1 }));
    openWhatsApp();
    setStep(4);
  }, [DATA.levels, booking.appliedCoupon, booking.item, estimatedXp, lang, openWhatsApp, user.coupons, user.usedCoupons, user.xp]);

  const nextStep = useCallback(() => {
    if (!isStepValid()) {
      setShowErrors(true);
      window.setTimeout(() => setShowErrors(false), 500);
      if (step === 0) addToast(T.selectToast, "error");
      if (step === 1) addToast(!user.name.trim() ? T.nameToast : T.addressToast, "error");
      if (step === 2) addToast(T.timeToast, "error");
      if (step === 3) addToast(!booking.payment ? T.paymentToast : T.termsToast, "error");
      vibrate([30, 30]);
      return;
    }
    vibrate(25);
    if (step === 3) finishBooking();
    else setStep((prev) => Math.min(4, prev + 1) as Step);
  }, [addToast, finishBooking, isStepValid, step, T, user.name, booking.payment]);

  if (!isClient || loading) {
    return (
      <>
        <Styles isDark={isDark} />
        <div className="app">
          <div className="shell">
            <div className="hero-card" style={{ maxWidth: 360, margin: "20vh auto 0", textAlign: "center" }}>
              <strong style={{ fontSize: "2rem" }}>T</strong>
              <p className="brand-sub">{T.brand}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const visibleServices = DATA.services.filter((item) => tab === "pack" ? item.type === "pack" : item.type === "single");
  const groupedServices = [
    { id: "express", title: lang === "en" ? "Quick relief" : "Alívio rápido", desc: lang === "en" ? "Short sessions for specific areas." : "Sessões curtas para regiões específicas." },
    { id: "relax", title: lang === "en" ? "Therapeutic relaxation" : "Relaxamento terapêutico", desc: lang === "en" ? "For pain, stiffness and heavy routine." : "Para dor, rigidez e rotina pesada." },
    { id: "sensory", title: lang === "en" ? "Sensory experiences" : "Experiências sensoriais", desc: lang === "en" ? "Clear agreement, more presence and body comfort." : "Combinado claro, mais presença e conforto corporal." },
    { id: "care", title: lang === "en" ? "Plans and care" : "Planos e cuidado pessoal", desc: lang === "en" ? "Monthly plans and body maintenance." : "Planos mensais e manutenção corporal." },
  ].map((group) => ({ ...group, services: visibleServices.filter((item) => item.category === group.id) })).filter((group) => group.services.length > 0);

  return (
    <>
      <Styles isDark={isDark} />
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Toasts toasts={toasts} />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} isDark={isDark} toggleTheme={() => setIsDark((value) => !value)} user={user} T={T} />
      <RulesModal
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        rules={DATA.rules}
        T={T}
        onAccept={() => {
          setBooking((prev) => ({ ...prev, termsAccepted: true }));
          setRulesOpen(false);
        }}
      />

      <div className="app">
        <div className="shell">
          <header className="topbar">
            <button className="brand" type="button" onClick={() => setStep(0)} aria-label="Voltar para o início">
              <h1 className="brand-title">{T.brand}</h1>
              <p className="brand-sub">{T.tagline}</p>
            </button>
            <div className="top-actions">
              <button className="icon-btn" type="button" onClick={() => setLang((value) => value === "pt" ? "en" : "pt")} aria-label="Trocar idioma">
                <Icon name="globe" />
                <span className="lang-chip">{lang.toUpperCase()}</span>
              </button>
              <button className="icon-btn" type="button" onClick={openInstagram} aria-label={`Abrir Instagram ${CONFIG.INSTAGRAM_HANDLE}`}>
                <Icon name="instagram" />
              </button>
              <button className="icon-btn" type="button" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
                <Icon name="menu" />
              </button>
            </div>
          </header>

          {step < 4 ? (
            <nav className="stepper" aria-label="Etapas do agendamento">
              {[
                { n: 0, label: lang === "en" ? "Session" : "Sessão" },
                { n: 1, label: lang === "en" ? "Place" : "Local" },
                { n: 2, label: lang === "en" ? "Time" : "Horário" },
                { n: 3, label: lang === "en" ? "Review" : "Resumo" },
              ].map((item) => (
                <button
                  key={item.n}
                  type="button"
                  className={`step-pill ${step === item.n ? "active" : ""} ${step > item.n ? "done" : ""}`}
                  onClick={() => item.n < step && setStep(item.n as Step)}
                  disabled={item.n > step}
                  aria-current={step === item.n ? "step" : undefined}
                >
                  {item.n + 1}. {item.label}
                </button>
              ))}
            </nav>
          ) : null}

          <main id="main" tabIndex={-1}>
            {step === 0 ? (
              <>
                <section className="hero" aria-labelledby="hero-title">
                  <div className="hero-card hero-main">
                    <div className="hero-copy">
                      <h2 id="hero-title" className="hero-title">{T.heroTitle}</h2>
                      <p className="hero-text">{T.heroText}</p>
                    </div>
                    <div className="portrait-card">
                      <ProfilePhoto alt={T.photoAlt} />
                      <div className="portrait-meta">
                        <span>{CONFIG.INSTAGRAM_HANDLE}</span>
                        <Icon name="instagram" size={16} />
                      </div>
                    </div>
                  </div>
                  <aside className="hero-card profile" aria-label={T.xpTitle}>
                    <div className="profile-head">
                      <ProfilePhoto alt={T.photoAlt} />
                      <div>
                        <h2 className="profile-title">{currentLevelTitle}</h2>
                        <p className="profile-copy">{T.xpSaved}</p>
                      </div>
                    </div>
                    <div className="xp-row" style={{ marginTop: 10 }}>
                      <span className="xp-label">{T.xpTitle}</span>
                      <span className="xp-number">{user.xp} XP</span>
                    </div>
                    <div className="progress" aria-label={T.xpTitle} role="progressbar" aria-valuenow={Math.round(currentProgress)} aria-valuemin={0} aria-valuemax={100}>
                      <span style={{ width: `${currentProgress}%` }} />
                    </div>
                    {nextLevel ? <p className="profile-copy">{nextLevel.needed} XP {T.nextReward} de {money(nextLevel.reward, lang)}.</p> : null}
                  </aside>
                </section>

                <FlowGuide T={T} />

                <div className="tabs" role="tablist" aria-label="Tipo de sessão">
                  <button className="tab" role="tab" type="button" aria-selected={tab === "single"} onClick={() => setTab("single")}>
                    <Icon name="user" size={18} /> {T.singleTab}
                  </button>
                  <button className="tab" role="tab" type="button" aria-selected={tab === "pack"} onClick={() => setTab("pack")}>
                    <Icon name="package" size={18} /> {T.packTab}
                  </button>
                </div>

                <p className="page-copy">{T.chooseOne}</p>
                {groupedServices.map((group) => (
                  <section className="section" key={group.id} aria-labelledby={`group-${group.id}`}>
                    <div className="section-head">
                      <div>
                        <h2 id={`group-${group.id}`} className="section-title">{group.title}</h2>
                        <p className="section-desc">{group.desc}</p>
                      </div>
                    </div>
                    <div className="cards-grid">
                      {group.services.map((item) => (
                        <ServiceCard
                          key={item.id}
                          item={item}
                          selected={booking.item?.id === item.id}
                          lang={lang}
                          T={T}
                          onSelect={(selected) => {
                            setBooking((prev) => ({ ...prev, item: selected, extras: {}, payment: "", termsAccepted: false }));
                            vibrate();
                          }}
                        />
                      ))}
                    </div>
                  </section>
                ))}

                <section className="section" aria-labelledby="reviews-title">
                  <h2 id="reviews-title" className="section-title">{T.reviews}</h2>
                  <div className="review-row" style={{ marginTop: 14 }}>
                    {DATA.reviews.map((review) => (
                      <article className="review-card" key={`${review.name}-${review.service}`}>
                        <div className="review-name">
                          <span>{review.name}</span>
                          <span className="tag">{review.service}</span>
                        </div>
                        <p className="review-text">"{review.text}"</p>
                      </article>
                    ))}
                  </div>
                </section>

                <HomeFooter
                  T={T}
                  selected={Boolean(booking.item)}
                  onInstagram={openInstagram}
                  onStart={() => {
                    if (booking.item) {
                      nextStep();
                    } else {
                      document.querySelector(".tabs")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      addToast(T.selectToast, "error");
                    }
                  }}
                />
              </>
            ) : null}

            {step === 1 ? (
              <section aria-labelledby="where-title">
                <h2 id="where-title" className="page-title">{T.whereTitle}</h2>
                <p className="page-copy">{T.whereHelp}</p>
                <div className={`panel ${showErrors ? "shake" : ""}`}>
                  <div className="location-grid" role="group" aria-label={T.whereTitle}>
                    {[
                      { id: "home" as LocationType, icon: "home", label: T.home },
                      { id: "motel" as LocationType, icon: "bed", label: T.motel },
                      { id: "hotel" as LocationType, icon: "building", label: T.hotelLoc },
                    ].map((option) => (
                      <button key={option.id} type="button" className="choice-card" aria-pressed={booking.locationType === option.id} onClick={() => setBooking((prev) => ({ ...prev, locationType: option.id }))}>
                        <Icon name={option.icon} />
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="field-grid">
                    <div className="wide">
                      <InputField
                        id="name"
                        label={T.name}
                        icon="user"
                        value={user.name}
                        onChange={(event) => setUser((prev) => ({ ...prev, name: sanitizeInput(event.target.value) }))}
                        placeholder="Ex: Thalyson"
                        autoComplete="name"
                        error={showErrors && user.name.trim().length < 3}
                      />
                    </div>

                    {booking.locationType === "home" ? (
                      <>
                        <InputField id="cep" label={T.cep} icon="map-pin" value={booking.address.cep} onChange={handleCep} placeholder="00000-000" maxLength={9} disabled={fetchingCep} autoComplete="postal-code" />
                        <InputField id="number" label={T.number} value={booking.address.number} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, number: sanitizeInput(event.target.value) } }))} placeholder="123" error={showErrors && !booking.address.number} />
                        <div className="wide">
                          <InputField id="street" label={T.street} value={booking.address.street} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, street: sanitizeInput(event.target.value) } }))} placeholder="Rua ou avenida" disabled={fetchingCep} autoComplete="street-address" error={showErrors && !booking.address.street} />
                        </div>
                        <InputField id="district" label={T.district} value={booking.address.district} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, district: sanitizeInput(event.target.value) } }))} placeholder="Bairro" disabled={fetchingCep} error={showErrors && !booking.address.district} />
                        <InputField id="city" label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder="Cidade" disabled={fetchingCep} error={showErrors && !booking.address.city} />
                        <div className="wide">
                          <InputField id="comp" label={T.complement} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder="Apto, bloco, referência" />
                        </div>
                      </>
                    ) : null}

                    {booking.locationType === "hotel" ? (
                      <>
                        <div className="wide">
                          <InputField id="hotel" label={T.hotel} icon="building" value={booking.address.placeName} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, placeName: sanitizeInput(event.target.value) } }))} placeholder="Nome completo do hotel" error={showErrors && !booking.address.placeName} />
                        </div>
                        <InputField id="hotel-city" label={T.city} value={booking.address.city} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, city: sanitizeInput(event.target.value) } }))} placeholder="Cidade" error={showErrors && !booking.address.city} />
                        <InputField id="room" label={T.room} value={booking.address.comp} onChange={(event) => setBooking((prev) => ({ ...prev, address: { ...prev.address, comp: sanitizeInput(event.target.value) } }))} placeholder="Quarto ou suíte" />
                      </>
                    ) : null}

                    {booking.locationType === "motel" ? (
                      <div className="wide notice">
                        <Icon name="message" />
                        <span>{T.motelNote}</span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            ) : null}

            {step === 2 ? (
              <section aria-labelledby="when-title">
                <h2 id="when-title" className="page-title">{T.whenTitle}</h2>
                <div className="panel cart-summary">
                  <div>
                    <p className="info-label">{T.chosenSession}</p>
                    <strong>{booking.item?.title}</strong>
                  </div>
                  <Button variant="secondary" onClick={() => setStep(0)}>{T.change}</Button>
                </div>

                <div className="date-row" aria-label="Datas disponíveis">
                  {days.map((day) => {
                    const selected = booking.date && new Date(booking.date).toDateString() === day.toDateString();
                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        className="date-btn"
                        aria-pressed={Boolean(selected)}
                        onClick={() => setBooking((prev) => ({ ...prev, date: day.toISOString(), time: null }))}
                      >
                        <small>{dayLabel(day)}</small>
                        <span>{day.getDate()}</span>
                        <small>{compactDate(day, lang)}</small>
                      </button>
                    );
                  })}
                </div>

                {!booking.date ? (
                  <div className={`empty-state ${showErrors ? "shake" : ""}`}>{T.emptyDate}</div>
                ) : slots.length === 0 ? (
                  <div className="empty-state">{T.emptySlots}</div>
                ) : (
                  <div className={`panel ${showErrors && !booking.time ? "shake" : ""}`}>
                    {[
                      { id: "morning", label: T.morning, data: groupedSlots.morning },
                      { id: "afternoon", label: T.afternoon, data: groupedSlots.afternoon },
                      { id: "evening", label: T.evening, data: groupedSlots.evening },
                    ].filter((group) => group.data.length > 0).map((group) => (
                      <div className="time-section" key={group.id}>
                        <h3 className="time-title">{group.label}</h3>
                        <div className="time-grid">
                          {group.data.map((slot) => {
                            const rush = RUSH_HOURS.includes(slot) && booking.locationType !== "motel";
                            return (
                              <button
                                key={slot}
                                type="button"
                                className={`time-btn ${rush ? "rush" : ""}`}
                                aria-pressed={booking.time === slot}
                                onClick={() => setBooking((prev) => ({ ...prev, time: slot }))}
                              >
                                {slot}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    {booking.locationType !== "motel" ? (
                      <div className="notice" style={{ marginTop: 16 }}>
                        <Icon name="car" />
                        <span>{T.rushNote} ({T.rushFee}: {money(CONFIG.RUSH_FEE, lang)}).</span>
                      </div>
                    ) : null}
                  </div>
                )}
              </section>
            ) : null}

            {step === 3 ? (
              <section aria-labelledby="summary-title-page">
                <h2 id="summary-title-page" className="page-title">{T.summaryTitle}</h2>
                <div className="summary-layout">
                  <div className="panel">
                    <h3 className="summary-title">{T.extrasTitle}</h3>
                    <div className="extras-grid">
                      {DATA.extras.map((extra) => {
                        const price = booking.item?.type === "pack" ? Math.floor(extra.price * 0.8) : extra.price;
                        const checked = Boolean(booking.extras[extra.id]);
                        return (
                          <button
                            key={extra.id}
                            type="button"
                            className="extra-btn"
                            aria-pressed={checked}
                            onClick={() => setBooking((prev) => ({ ...prev, extras: { ...prev.extras, [extra.id]: !prev.extras[extra.id] } }))}
                          >
                            <span>
                              <strong>{extra.title}</strong>
                              <span>{extra.desc}</span>
                            </span>
                            <strong>{money(price, lang)}</strong>
                          </button>
                        );
                      })}
                    </div>

                    <h3 className="subhead">{T.summaryTitle}</h3>
                    <div className="line-list">
                      <div className="line"><span>{booking.item?.title}</span><span>{booking.item ? money(booking.item.price, lang) : "-"}</span></div>
                      <div className="line"><span>{T.duration}</span><span>{financials.duration} {T.minutes}</span></div>
                      <div className="line"><span>{T.whenTitle}</span><span>{booking.date ? `${compactDate(new Date(booking.date), lang)} ${booking.time}` : "-"}</span></div>
                      <div className="line"><span>{T.whereTitle}</span><span>{booking.locationType === "home" ? T.home : booking.locationType === "motel" ? T.motel : T.hotelLoc}</span></div>
                    </div>

                    <h3 className="subhead">{T.total}</h3>
                    <div className="line-list">
                      <div className="line"><span>{T.subtotal}</span><span>{money(financials.subtotal, lang)}</span></div>
                      {financials.discount ? <div className="line"><span>{T.discount}</span><span>-{money(financials.discount, lang)}</span></div> : null}
                      {financials.mediaDiscount ? <div className="line"><span>{T.photoPermission}</span><span>-{money(financials.mediaDiscount, lang)}</span></div> : null}
                      {financials.pixDiscount ? <div className="line"><span>Pix</span><span>-{money(financials.pixDiscount, lang)}</span></div> : null}
                      {financials.rushFee ? <div className="line"><span>{T.rushFee}</span><span>+{money(financials.rushFee, lang)}</span></div> : null}
                    </div>
                    <div className="total-box">
                      <span className="info-label">{T.total}</span>
                      <span className="total">{money(financials.total, lang)}</span>
                    </div>
                    <p className="profile-copy" style={{ textAlign: "right", marginTop: 6 }}>+{estimatedXp} XP</p>
                    {booking.locationType !== "motel" ? <div className="notice" style={{ marginTop: 14 }}><Icon name="car" /><span>{T.uber}</span></div> : null}
                  </div>

                  <aside className="panel">
                    <h3 className="summary-title">{T.paymentTitle}</h3>
                    <div className={`payment-grid ${showErrors && !booking.payment ? "shake" : ""}`}>
                      {[
                        { id: "pix" as PaymentMethod, label: T.pix, icon: "smartphone" },
                        { id: "card" as PaymentMethod, label: T.card, icon: "credit-card" },
                        { id: "money" as PaymentMethod, label: T.cash, icon: "banknote" },
                      ].map((payment) => (
                        <button
                          key={payment.id}
                          type="button"
                          className="payment-btn"
                          aria-pressed={booking.payment === payment.id}
                          onClick={() => {
                            setBooking((prev) => ({ ...prev, payment: payment.id }));
                            if (payment.id === "pix") {
                              if (navigator.clipboard) navigator.clipboard.writeText(CONFIG.PIX_KEY).catch(() => undefined);
                              addToast(T.pixCopied);
                            }
                          }}
                        >
                          <Icon name={payment.icon} />
                          <span>{payment.label}</span>
                        </button>
                      ))}
                    </div>

                    <h3 className="subhead">{T.photoPermission}</h3>
                    <p className="page-copy" style={{ marginBottom: 10 }}>{T.photoCopy}</p>
                    <button type="button" className="toggle-btn" aria-pressed={booking.mediaAllowed} onClick={() => setBooking((prev) => ({ ...prev, mediaAllowed: !prev.mediaAllowed }))}>
                      <span>{booking.mediaAllowed ? T.allowedPhoto : T.allowPhoto}</span>
                      {booking.mediaAllowed ? <Icon name="check" /> : <Icon name="camera" />}
                    </button>

                    <h3 className="subhead">{T.termsTitle}</h3>
                    <button type="button" className={`toggle-btn ${showErrors && !booking.termsAccepted ? "shake" : ""}`} aria-pressed={booking.termsAccepted} onClick={() => setRulesOpen(true)}>
                      <span>{booking.termsAccepted ? T.accept : T.termsRead}</span>
                      {booking.termsAccepted ? <Icon name="check" /> : <Icon name="file" />}
                    </button>
                  </aside>
                </div>
              </section>
            ) : null}

            {step === 4 ? (
              <section className="success" aria-labelledby="success-title">
                <div className="success-card">
                  <div className="success-icon"><Icon name="check" size={34} /></div>
                  <h2 id="success-title">{T.successTitle}</h2>
                  <p>{T.successText}</p>
                  <div className="line-list">
                    <div className="line"><span>{T.chosenSession}</span><span>{booking.item?.title}</span></div>
                    <div className="line"><span>{T.total}</span><span>{money(financials.total, lang)}</span></div>
                  </div>
                  <Button full variant="success" icon="message" onClick={openWhatsApp}>{T.openWhats}</Button>
                  <Button full variant="secondary" onClick={() => {
                    setStep(0);
                    setBooking({ item: null, extras: {}, date: null, time: null, locationType: "home", address: emptyAddress, payment: "", appliedCoupon: null, termsAccepted: false, mediaAllowed: false, bookingId: `BOOK_${Date.now()}` });
                  }}>{T.startAgain}</Button>
                </div>
              </section>
            ) : null}
          </main>
        </div>
      </div>

      {step < 4 && booking.item ? (
        <nav className="bottom-bar" aria-label="Navegação do agendamento">
          <div className="bottom-inner">
            {step > 0 ? (
              <Button variant="secondary" className="back" ariaLabel={T.back} onClick={() => setStep((prev) => Math.max(0, prev - 1) as Step)}>
                <Icon name="chevron-left" />
              </Button>
            ) : null}
            <div className="bottom-copy">
              <p className="bottom-label">{step === 3 ? T.total : T.chosenSession}</p>
              <p className="bottom-title">{step === 3 ? money(financials.total, lang) : booking.item.title}</p>
            </div>
            <Button variant={step === 3 ? "success" : "primary"} onClick={nextStep}>
              {step === 3 ? T.finish : T.next}
              {step !== 3 ? <Icon name="chevron-right" /> : <Icon name="message" />}
            </Button>
          </div>
        </nav>
      ) : null}

      {welcomeOpen ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
            <div className="modal-head">
              <h2 id="welcome-title" className="modal-title">{T.welcomeTitle}</h2>
              <button className="icon-btn" type="button" onClick={() => {
                setWelcomeOpen(false);
                setUser((prev) => ({ ...prev, hasSeenWelcome: true }));
              }} aria-label="Fechar">
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <p className="page-copy">{T.welcomeText}</p>
              <div className="notice"><Icon name="shield" /><span>{T.welcomeWarn}</span></div>
              <div style={{ marginTop: 14 }}>
                <Button full onClick={() => {
                  const coupon = { id: "welcome", title: "BEMVINDO10", code: "BEMVINDO10", val: 10 };
                  setBooking((prev) => ({ ...prev, appliedCoupon: coupon }));
                  setUser((prev) => ({ ...prev, hasSeenWelcome: true, coupons: prev.coupons.some((item) => item.code === coupon.code) ? prev.coupons : [...prev.coupons, coupon] }));
                  setWelcomeOpen(false);
                }}>{T.getGift}</Button>
              </div>
            </div>
          </section>
        </div>
      ) : null}

      {levelOpen ? (
        <div className="modal-backdrop" role="presentation">
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="level-title">
            <div className="modal-head">
              <h2 id="level-title" className="modal-title">{T.levelTitle}</h2>
              <button className="icon-btn" type="button" onClick={() => setLevelOpen(false)} aria-label="Fechar">
                <Icon name="x" />
              </button>
            </div>
            <div className="modal-body">
              <p className="page-copy">{T.levelText}</p>
              <Button full onClick={() => setLevelOpen(false)}>{T.accept}</Button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
