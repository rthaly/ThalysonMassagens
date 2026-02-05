import * as React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';

/**
* ==================================================================================
* THALYSON MASSAGENS - SISTEMA COMPLETO DE AGENDAMENTO
* ==================================================================================
* Stack: React + TypeScript + Tailwind CSS
* Fontes: Playfair Display (Títulos) + Inter (Corpo)
* Ícones: Emojis e Unicode (100% compatível com todos navegadores)
* ==================================================================================
*/
const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v16_complete',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE_V4',
  START_HOUR: 9,
  END_HOUR: 20
} as const;

// ==================================================================================
// TYPES
// ==================================================================================
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
  type?: string;
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
}

interface UserData {
  name: string;
  xp: number;
  coupons: Coupon[];
  usedCoupons: string[];
  hasSeenWelcome: boolean;
  ordersCount: number;
}

interface Address {
  street: string;
  number: string;
  district: string;
  city: string;
  comp: string;
  placeName: string;
}

interface BookingData {
  type: 'single' | 'pack';
  item: ServiceItem | null;
  extras: Record<string, boolean>;
  date: string | null;
  time: string | null;
  locationType: 'home' | 'motel' | 'hotel';
  address: Address;
  payment: string;
  appliedCoupon: Coupon | null;
  termsAccepted: boolean;
}

interface Rule {
  icon: string;
  title: string;
  description: string;
}

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  full = false,
  icon,
  className = '',
  loading = false
}: any) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none active:scale-[0.97] font-inter";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
    secondary: "bg-zinc-800 border-2 border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A] shadow-lg shadow-green-500/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:border-zinc-400",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5"
  };
  const sizes = {
    sm: "h-10 text-sm px-4",
    md: "h-12 text-sm px-6",
    lg: "h-14 text-base px-8",
    xl: "h-16 text-base px-10"
  };
  
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${variants[variant as keyof typeof variants] || variants.primary}
        ${sizes[size as keyof typeof sizes]}
        ${full ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        // SPINNER CSS PERFEITO - CENTRALIZADO E RESPONSIVO
        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : (
        <>
          {icon && <span className={`text-lg ${children ? 'mr-2' : ''}`}>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

const Card = ({ children, className = '', onClick, active = false, isDark = true }: any) => (
  <div
    onClick={onClick}
    className={`
      relative p-8 rounded-3xl transition-all duration-300 flex flex-col h-full font-inter
      ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''}
      ${active
        ? 'bg-blue-900/10 border-2 border-blue-500 shadow-lg shadow-blue-500/20'
        : isDark
        ? 'bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 hover:border-zinc-700'
        : 'bg-white border border-slate-200 shadow-lg hover:border-slate-300'
      }
      ${className}
    `}
  >
    {children}
  </div>
);

const InputField = ({ label, value, onChange, placeholder, icon, type = "text", isDark = true }: any) => (
  <div className="space-y-2 w-full">
    {label && (
      <label className={`text-xs font-bold uppercase tracking-wider font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-xl ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 rounded-xl outline-none text-sm font-medium transition-all font-inter
          ${icon ? 'pl-12 pr-4' : 'px-4'}
          ${isDark
            ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:border-blue-500'
            : 'bg-white border-2 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600'
          }
        `}
      />
    </div>
  </div>
);

const ReviewCard = ({ review, isDark }: { review: Review; isDark: boolean }) => (
  <div
    className={`
      flex-shrink-0 w-80 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 border font-inter
      ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-slate-200 shadow-md'}
    `}
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
          {review.n.charAt(0)}
        </div>
        <div>
          <span className={`text-sm font-semibold block font-inter ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{review.n}</span>
          <span className="text-xs text-zinc-500 font-inter">{review.loc}</span>
        </div>
      </div>
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-lg ${i < review.s ? 'text-yellow-400' : 'text-zinc-700'}`}>★</span>
        ))}
      </div>
    </div>
    <p className={`text-sm leading-relaxed font-inter ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{review.t}</p>
  </div>
);

const SmartTimer = ({ isDark, text }: any) => {
  const [time, setTime] = useState(600);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev <= 0 ? 600 : prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const format = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  
  const isUrgent = time < 60;
  
  return (
    <div
      className={`
        flex items-center justify-center gap-3 p-4 rounded-xl border-2 transition-all font-inter
        ${isUrgent
          ? 'bg-red-500/10 border-red-500/30 text-red-400'
          : isDark
          ? 'bg-blue-500/5 border-blue-500/20 text-blue-400'
          : 'bg-blue-50 border-blue-200 text-blue-700'
        }
      `}
    >
      <span className={`text-xl ${isUrgent ? 'animate-pulse' : ''}`}>⏳</span>
      <span className="text-sm font-semibold">
        {text}: <span className="font-mono">{format(time)}</span>
      </span>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }: { q: string; a: string; isDark: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group font-inter"
      >
        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{q}</span>
        <span className={`text-xl transition-transform ${isOpen ? 'rotate-180 text-blue-500' : isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
          {isOpen ? '▲' : '▼'}
        </span>
      </button>
      <div className={`overflow-hidden transition-all ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
      </div>
    </div>
  );
};

const RuleItem = ({ rule, isDark }: { rule: Rule; isDark: boolean }) => (
  <div className={`flex gap-4 p-5 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
    <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
      {rule.icon}
    </div>
    <div>
      <h4 className={`text-base font-bold mb-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
        {rule.title}
      </h4>
      <p className={`text-sm leading-relaxed font-inter ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>
        {rule.description}
      </p>
    </div>
  </div>
);

// ==================================================================================
// DATA GENERATION COM EMOJIS
// ==================================================================================
const generateReviews = (isPT: boolean): Review[] => {
  const reviews = [
    { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito." },
    { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida." },
    { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz." },
    { n: "Marcos", loc: "Londrina", t: "Foi incrível, recomendo demais." },
    { n: "Lucas", loc: "Rio Preto", t: "Curti o sigilo e o local ser no meu hotel. Muito prático." },
    { n: "Felipe", loc: "Santa Fé", t: "Nunca tinha feito tântrica. Foi uma descoberta, recomendo." },
    { n: "André", loc: "Jales", t: "Massagem completa de verdade. O corpo todo agradece." },
    { n: "Rafa", loc: "SP - Centro", t: "O final foi explosivo. Voltarei em breve." },
    { n: "Gustavo", loc: "Londrina", t: "Cheiro bom, música boa e mão de anjo." },
    { n: "Pedro", loc: "Rio Preto", t: "Profissional, educado e gato. Combo perfeito." },
    { n: "João", loc: "Jales", t: "A troca foi intensa. Senti cada toque." },
    { n: "Matheus", loc: "SP - Jardins", t: "Relaxei tanto que quase dormi." },
    { n: "Daniel", loc: "Santa Fé", t: "Muito atencioso com o que eu pedi. Nota 10." },
    { n: "Eduardo", loc: "Londrina", t: "Serviço de primeira. Vale cada centavo." },
    { n: "Vitor", loc: "Rio Preto", t: "Me deixou super a vontade." },
    { n: "Caio", loc: "SP - Augusta", t: "Curti a vibe do cara. Muito gente boa." },
    { n: "Renan", loc: "Votuporanga", t: "Massagem forte na medida certa." },
    { n: "Diego", loc: "Fernandópolis", t: "Saí renovado. O estresse foi embora." },
    { n: "Gabriel", loc: "SP - Paulista", t: "Excelente. Não vejo a hora de repetir." },
    { n: "Leo", loc: "Rio Preto", t: "Mão quente e pegada firme." },
    { n: "Ricardo", loc: "Jales", t: "Top demais. Super indico." },
    { n: "Marcelo", loc: "Londrina", t: "Atendimento impecável do começo ao fim." },
    { n: "Fernando", loc: "Santa Fé", t: "Uma experiência que todo homem deveria ter." },
    { n: "Igor", loc: "SP - Consolação", t: "Discreto e pontual. Gostei." },
    { n: "Paulo", loc: "Rio Preto", t: "Sensação única de liberdade." }
  ];
  return reviews.map(r => ({ ...r, s: 5 }));
};

const getData = (lang: string) => {
  const isPT = lang === 'pt';
  const currency = isPT ? 'R$' : '$';
  const p = {
    relax: isPT ? 125 : 25,
    sens: isPT ? 155 : 30,
    titan: isPT ? 195 : 40,
    packRelax: { v: isPT ? 390 : 80, full: isPT ? 500 : 100, save: isPT ? 110 : 20 },
    packTri: { v: isPT ? 480 : 95, full: isPT ? 585 : 120, save: isPT ? 105 : 25 },
    packMix: { v: isPT ? 600 : 130, full: isPT ? 700 : 140, save: isPT ? 100 : 10 }
  };
  
  // Regras de atendimento completas com emojis contextuais
  const rules: Rule[] = isPT ? [
    {
      icon: "🚿",
      title: "Higiene",
      description: "Tome um banho antes da sessão para garantir o máximo de conforto e bem-estar para ambos."
    },
    {
      icon: "🙏",
      title: "Respeito",
      description: "Não insista em algo que não está no menu. Respeito é essencial para uma experiência positiva."
    },
    {
      icon: "💰",
      title: "Pagamento",
      description: "Pode ser realizado antes ou após o serviço, conforme sua preferência e combinação prévia."
    },
    {
      icon: "⏰",
      title: "Cancelamento",
      description: "Avise com pelo menos 2h de antecedência para remarcar sem custos adicionais."
    },
    {
      icon: "💆‍♂️",
      title: "Pontualidade",
      description: "Chegarei no horário combinado. Peço a mesma consideração caso você precise remarcar."
    },
    {
      icon: "🛡️",
      title: "Sigilo",
      description: "Total discrição e profissionalismo. Sua privacidade é minha prioridade absoluta."
    }
  ] : [
    {
      icon: "🚿",
      title: "Hygiene",
      description: "Please take a shower before the session to ensure maximum comfort and well-being for both."
    },
    {
      icon: "🙏",
      title: "Respect",
      description: "Do not insist on anything not on the menu. Respect is essential for a positive experience."
    },
    {
      icon: "💰",
      title: "Payment",
      description: "Can be made before or after the service, according to your preference and prior arrangement."
    },
    {
      icon: "⏰",
      title: "Cancellation",
      description: "Please notify at least 2h in advance to reschedule without additional costs."
    },
    {
      icon: "💆‍♂️",
      title: "Punctuality",
      description: "I will arrive at the agreed time. I ask for the same consideration if you need to reschedule."
    },
    {
      icon: "🛡️",
      title: "Privacy",
      description: "Total discretion and professionalism. Your privacy is my absolute priority."
    }
  ];
  
  return {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
      { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Conhecido" : "Acquaintance" },
      { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Próximo" : "Closer" },
      { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Íntimo" : "Intimate" }
    ],
    services: [
      {
        id: 'relaxante',
        min: 60,
        price: p.relax,
        icon: "💆‍♂️",
        tag: isPT ? "100% FÍSICO" : "PHYSICAL",
        title: isPT ? "Massagem Clássica" : "Classic Relax",
        desc: isPT ? "Corpo todo (Costas, Mãos e Pés). Pressão Baixa/Média para relaxar." : "Full body. Low/Mid pressure to relax.",
        details: isPT
          ? `Foco: Costas, pernas, mãos e pés
Pressão: Baixa a média
Objetivo: Tirar o cansaço do dia
Sem toque íntimo nesta modalidade`
          : `Focus: Back, legs, hands, feet
Pressure: Low to Medium
Goal: Daily stress relief
No intimate touch`
      },
      {
        id: 'sensitiva',
        min: 60,
        price: p.sens,
        icon: "✨",
        tag: isPT ? "SENSORIAL + LINGAM" : "SENSORY + LINGAM",
        title: isPT ? "Tântrica Sensorial" : "Tantric Sensory",
        desc: isPT ? "Toque sutil, arrepios pelo corpo e finalização (Lingam)." : "Subtle touch, shivers and Lingam finish.",
        details: isPT
          ? `Toques sutis pelo corpo todo
Objetivo: Arrepios e sensibilidade
Finaliza com Massagem Lingam
Você recebe e sente`
          : `Subtle touches all over
Goal: Shivers and sensitivity
Ends with Lingam Massage
You receive and feel`
      },
      {
        id: 'mista',
        min: 60,
        price: p.titan,
        icon: "🔥",
        tag: isPT ? "A MAIS COMPLETA" : "FULL FUSION",
        title: isPT ? "Experiência Fusion" : "Fusion Experience",
        desc: isPT ? "Massagem relaxante + Corpo a Corpo + Lingam." : "Relaxing + Body-to-Body + Lingam.",
        details: isPT
          ? `Começamos soltando a musculatura
Corpo a Corpo (troca de energia)
Finalização Lingam intensa
A experiência definitiva`
          : `Relaxing muscle start
Body-to-Body energy
Intense Lingam finish
The definitive experience`
      }
    ] as ServiceItem[],
    extras: [
      {
        id: 'more_time',
        price: isPT ? 55 : 15,
        icon: "⏱️",
        label: isPT ? "+30 Minutos" : "+30 Minutes",
        desc: isPT ? "Estender a sessão" : "Extend session"
      },
      {
        id: 'touch',
        price: isPT ? 55 : 15,
        icon: "💫",
        label: isPT ? "Troca Interativa" : "Interactive Touch",
        desc: isPT ? "Você pode tocar" : "You can touch"
      },
      {
        id: 'aroma',
        price: isPT ? 5 : 5,
        icon: "🌸",
        label: isPT ? "Aromaterapia" : "Aromatherapy",
        desc: isPT ? "Cheiro bom" : "Good scent"
      }
    ],
    plans: [
      {
        id: 'pack_relax',
        type: 'pack',
        title: isPT ? "Ciclo Anti-Stress" : "Anti-Stress Cycle",
        price: p.packRelax.v,
        fullPrice: p.packRelax.full,
        savings: p.packRelax.save,
        desc: isPT ? "4 Sessões Relaxantes" : "4 Relax Sessions",
        details: isPT ? "4 sessões de Massagem Relaxante\nIdeal para usar 1x por semana\nManutenção corporal regular" : "4 Relaxing sessions\nIdeal for once a week\nRegular body maintenance",
        tag: isPT ? "BÁSICO" : "BASIC",
        icon: "📦"
      },
      {
        id: 'pack_mista',
        type: 'pack',
        title: isPT ? "Trilogia Fusion" : "Fusion Trilogy",
        price: p.packTri.v,
        fullPrice: p.packTri.full,
        savings: p.packTri.save,
        desc: isPT ? "3 Sessões Fusion" : "3 Fusion Sessions",
        details: isPT ? "3 encontros da massagem completa\nGaranta sua satisfação\nExperiência premium total" : "3 full massage meetings\nSatisfaction guaranteed\nTotal premium experience",
        tag: isPT ? "MAIS VENDIDO" : "BEST SELLER",
        icon: "💫"
      },
      {
        id: 'pack_mix_4',
        type: 'pack',
        title: isPT ? "Ciclo Misto" : "Mixed Cycle",
        price: p.packMix.v,
        fullPrice: p.packMix.full,
        savings: p.packMix.save,
        desc: isPT ? "2 Sensoriais + 2 Fusion" : "2 Sensory + 2 Fusion",
        details: isPT ? "2 Sessões Tântrica Sensorial\n2 Sessões Experiência Fusion\nIdeal para intercalar semanalmente" : "2 Sensory Sessions\n2 Fusion Sessions\nIdeal for weekly alternating",
        tag: isPT ? "EXPERIÊNCIA TOTAL" : "FULL EXPERIENCE",
        icon: "✨"
      }
    ] as ServiceItem[],
    faq: [
      {
        q: isPT ? "Como agendar?" : "How to book?",
        a: isPT ? "Escolha a sessão aqui no app e finalize no WhatsApp para confirmar data e horário." : "Choose session here and finalize on WhatsApp."
      },
      {
        q: isPT ? "Aceita cartão?" : "Accept cards?",
        a: isPT ? "Sim. Aceito Pix (3% desconto), Dinheiro e Cartão de Crédito." : "Yes. Pix (3% OFF), Cash and Credit Card."
      },
      {
        q: isPT ? "Tem local?" : "Do you have a place?",
        a: isPT ? "Atendo em hotéis e a domicílio. Não tenho espaço fixo no momento." : "I attend at hotels and homes."
      },
      {
        q: isPT ? "É sigiloso?" : "Is it discreet?",
        a: isPT ? "Totalmente. Chego como visitante comum, sem uniformes ou identificação." : "Totally. I arrive as a regular visitor."
      }
    ],
    reviews: generateReviews(isPT),
    rules,
    currency,
    text: {
      welcome: isPT ? "Olá," : "Hello,",
      choose_sub: isPT ? "Escolha seu momento de relaxamento" : "Choose your relaxation moment",
      level_label: isPT ? "Nível Fidelidade" : "Loyalty Level",
      tab_packs: isPT ? "Pacotes" : "Packages",
      tab_single: isPT ? "Sessão Avulsa" : "Single Session",
      book_btn: isPT ? "Agendar" : "Book Now",
      next_btn: isPT ? "Próximo" : "Next",
      finish_btn: isPT ? "Finalizar" : "Finish",
      loading: isPT ? "Carregando..." : "Loading...",
      toast_select_item: isPT ? "Selecione um serviço" : "Select a service",
      toast_select_date: isPT ? "Escolha data e hora" : "Select date and time",
      toast_fill_name: isPT ? "Preencha seu nome" : "Fill your name",
      toast_fill_addr: isPT ? "Preencha o endereço completo" : "Fill complete address",
      toast_fill_hotel: isPT ? "Preencha dados do hotel" : "Fill hotel details",
      toast_select_pay: isPT ? "Selecione forma de pagamento" : "Select payment method",
      toast_accept_terms: isPT ? "Aceite as regras" : "Accept terms",
      toast_coupon_success: isPT ? "Cupom aplicado!" : "Coupon applied!",
      details_label: isPT ? "Detalhes" : "Details",
      select_time_title: isPT ? "Data e Hora" : "Date & Time",
      location_title: isPT ? "Local do Atendimento" : "Service Location",
      extras_title: isPT ? "Turbine sua sessão:" : "Boost your session:",
      coupon_section: isPT ? "Seus Cupons" : "Your Coupons",
      no_coupons: isPT ? "Nenhum cupom disponível" : "No coupons available",
      payment_title: isPT ? "Forma de Pagamento" : "Payment Method",
      terms_title: isPT ? "Regras de Atendimento" : "Service Rules",
      success_title: isPT ? "Pré-Agendamento Feito!" : "Pre-Booking Done!",
      success_sub: isPT ? "Envie o resumo no WhatsApp para confirmar" : "Send summary on WhatsApp to confirm",
      whatsapp_btn: isPT ? "Finalizar no WhatsApp" : "Finalize on WhatsApp",
      back_home: isPT ? "Voltar ao Início" : "Back Home",
      timer_text: isPT ? "Segurando vaga" : "Holding spot",
      motel_note: isPT ? "Em motéis, o valor da suíte é pago por você diretamente ao local." : "In motels, suite fee is paid by you.",
      upgrade_msg: isPT ? "💡 Dica: A Massagem Relaxante NÃO inclui toque íntimo. Por apenas +R$30, você leva a Tântrica completa." : "💡 Tip: Relax Massage does NOT include intimate touch.",
      input_name: isPT ? "Como devo te chamar?" : "Your name",
      input_addr: isPT ? "Endereço (Rua)" : "Address (Street)",
      input_num: isPT ? "Número" : "Number",
      input_district: isPT ? "Bairro" : "District",
      input_city: isPT ? "Cidade" : "City",
      input_comp: isPT ? "Complemento" : "Unit/Apt",
      input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
      input_room: isPT ? "Número do Quarto" : "Room Number",
      agree_terms: isPT ? "Li e concordo com as regras" : "I agree to terms",
      install_app: isPT ? "Instalar App" : "Install App",
      install_desc: isPT ? "Adicione à tela inicial para acesso rápido" : "Add to home screen for quick access",
      faq_title: isPT ? "Perguntas Frequentes" : "FAQ",
      reviews_title: isPT ? "O que dizem sobre as sessões" : "What they say about sessions",
      empty_date: isPT ? "Selecione uma data acima" : "Select a date above",
      empty_slots: isPT ? "Sem horários para este dia" : "No slots for this day",
      total_label: isPT ? "Total" : "Total",
      subtotal: isPT ? "Subtotal" : "Subtotal",
      discount: isPT ? "Desconto" : "Discount",
      pix_discount: isPT ? "Desconto Pix (3%)" : "Pix Discount (3%)",
      welcome_popup_title: isPT ? "Bem-vindo!" : "Welcome!",
      welcome_popup_msg: isPT ? "Para começar nossa conexão, aqui está um presente especial." : "To start our connection, here's a special gift.",
      levelup_popup_title: isPT ? "Subiu de Nível!" : "Level Up!",
      levelup_popup_msg: isPT ? "Você está mais próximo. Aproveite seu prêmio." : "You're closer now. Enjoy your reward.",
      get_coupon: isPT ? "Pegar Cupom" : "Get Coupon",
      rules_complete: isPT ? "Regras Completas de Atendimento" : "Complete Service Rules"
    }
  };
};

// ==================================================================================
// MAIN APP
// ==================================================================================
export default function App() {
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs');
  const [toasts, setToasts] = useState<any[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  
  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 0
  });
  
  const [booking, setBooking] = useState<BookingData>({
    type: 'single',
    item: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home',
    address: {
      street: '',
      number: '',
      district: '',
      city: '',
      comp: '',
      placeName: ''
    },
    payment: '',
    appliedCoupon: null,
    termsAccepted: false
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const dateScrollRef = useRef<HTMLDivElement>(null);
  
  // Initialize
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Load from storage
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const stored = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user) {
          setUser(prev => ({ ...prev, ...parsed.user }));
        }
        if (parsed.bookingDraft?.item) {
          const draftDate = new Date(parsed.bookingDraft.date);
          if (draftDate > new Date()) {
            setBooking(parsed.bookingDraft);
            if (parsed.step) setStep(parsed.step);
          }
        }
      }
    } catch (e) {
      localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1200);
  }, [isClient]);
  
  // Save to storage
  useEffect(() => {
    if (isClient && dataLoaded) {
      const saveData = { user, bookingDraft: booking, step };
      try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(saveData));
      } catch (e) {
        console.error('Storage error:', e);
      }
    }
  }, [user, booking, step, isClient, dataLoaded]);
  
  // Show welcome popup
  useEffect(() => {
    if (!loading && isClient && dataLoaded && !user.hasSeenWelcome) {
      const timer = setTimeout(() => setWelcomePopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded]);
  
  // Scroll to top on step change
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [step]);
  
  const addToast = (msg: string, type: "success" | "error" = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Thalyson Massagens', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast("Link copiado!", "success");
    }
  };
  
  const handleSelectItem = (type: 'single' | 'pack', item: ServiceItem) => {
    setBooking(prev => ({ ...prev, type, item, extras: {}, payment: '', termsAccepted: false }));
    if (item.id === 'relaxante') {
      addToast(T.upgrade_msg, "error");
    } else {
      addToast(item.title, "success");
    }
  };
  
  const daysArray = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  }, []);
  
  const generateTimeSlots = useMemo(() => {
    if (!booking.date) return [];
    const slots = [];
    for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
      slots.push(`${i < 10 ? '0' : ''}${i}:00`);
    }
    const now = new Date();
    const selectedDate = new Date(booking.date);
    if (isNaN(selectedDate.getTime())) return [];
    
    const isToday = selectedDate.toDateString() === now.toDateString();
    if (isToday) {
      const currentHour = now.getHours();
      return slots.filter(time => {
        const [hour] = time.split(':').map(Number);
        return hour > currentHour;
      });
    }
    return slots;
  }, [booking.date]);
  
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0 };
    
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) {
        const extData = DATA.extras.find(e => e.id === k);
        if (extData) {
          const extraPrice = booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
          sub += extraPrice;
        }
      }
    });
    
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let totalAfterCoupon = Math.max(0, sub - disc);
    let pixDisc = 0;
    
    if (booking.payment === 'pix') {
      pixDisc = Math.ceil(totalAfterCoupon * 0.03);
    }
    
    const finalTotal = Math.max(0, totalAfterCoupon - pixDisc);
    return { sub, disc, pixDisc, total: finalTotal };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras, booking.payment]);
  
  const estimatedXP = useMemo(() => {
    const baseXP = financials.total;
    const isPack = booking.type === 'pack';
    const percentage = isPack ? 0.30 : 0.15;
    return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);
  
  const getNextLevelInfo = (currentXP: number) => {
    if (currentXP >= 800) {
      const cycleXP = currentXP - 800;
      const nextRewardAt = 500 - (cycleXP % 500);
      return { needed: nextRewardAt, reward: 50, title: "Íntimo Plus" };
    }
    const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
    return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };
  
  const getCurrentLevelProgress = () => {
    if (user.xp >= 800) {
      return ((user.xp - 800) % 500 / 500) * 100;
    }
    const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
    const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
    const currentLevel = DATA.levels[realIndex];
    const nextLevel = DATA.levels[realIndex + 1];
    if (!nextLevel) return 100;
    return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };
  
  const generateSecurityHash = (price: number, date: string, itemName: string) => {
    const raw = `${price}-${date}-${itemName}-${CONFIG.SECRET_TOKEN}`;
    return btoa(raw).substring(0, 8).toUpperCase();
  };
  
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : '';
    const securityHash = generateSecurityHash(f.total, dateStr, booking.item?.id || '');
    const greeting = lang === 'pt' ? "Olá! Gostaria de agendar:" : "Hello! I'd like to book:";
    
    let serviceTitle = booking.item?.title || '';
    if (booking.type !== 'single' && booking.item?.desc) {
      const descClean = booking.item.desc.replace(/^(Contém:|Contains:)\s*/i, '');
      serviceTitle += `\n📦 ${lang === 'pt' ? 'Inclui' : 'Includes'}: ${descClean}`;
    }
    
    let locTxt = "";
    let mapQuery = "";
    if (booking.locationType === 'home') {
      const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      locTxt = `Residência\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    } else if (booking.locationType === 'motel') {
      locTxt = `Motel\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`;
    } else {
      const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
      locTxt = `Hotel: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`;
      mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
      const ex = DATA.extras.find(e => e.id === k);
      if (!ex) return '';
      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
      return `✅ ${ex.label} (+ ${DATA.currency} ${price})`;
    }).filter(Boolean).join('\n');
    
    let priceDisplay = `💵 Preço Base: ${DATA.currency} ${f.sub}`;
    if (f.disc > 0) priceDisplay += `\n📉 Desconto Cupom: -${DATA.currency} ${f.disc}`;
    if (f.pixDisc > 0) priceDisplay += `\n📉 Desconto Pix (3%): -${DATA.currency} ${f.pixDisc}`;
    priceDisplay += `\n💰 TOTAL: ${DATA.currency} ${f.total},00`;
    
    const msg = `
${greeting}
🔥 NOVO PEDIDO #${securityHash}
──────────────────────
👤 Cliente: ${user.name}
💆‍♂️ Sessão: ${serviceTitle}
📅 Quando: ${dateStr} - ${booking.time}
${extrasList ? `➕ Adicionais:\n${extrasList}\n` : ''}
📍 Local:\n${locTxt}
${mapQuery ? `\n🔗 Mapa: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────
💲 Valor:\n${priceDisplay}
💳 Pagamento: ${booking.payment.toUpperCase()}
🚗 Uber: Calcular Ida/Volta
📸 Instagram: ${CONFIG.INSTAGRAM_URL}
Aguardo confirmação, obrigado!
`.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };
  
  const validateStep = () => {
    if (step === 0 && !booking.item) {
      addToast(T.toast_select_item, "error");
      return false;
    }
    if (step === 1 && (!booking.date || !booking.time)) {
      addToast(T.toast_select_date, "error");
      return false;
    }
    if (step === 2) {
      if (!user.name || user.name.trim().length < 3) {
        addToast(T.toast_fill_name, "error");
        return false;
      }
      if (booking.locationType === 'home') {
        if (!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) {
          addToast(T.toast_fill_addr, "error");
          return false;
        }
      }
      if (booking.locationType === 'hotel') {
        if (!booking.address.placeName || !booking.address.city) {
          addToast(T.toast_fill_hotel, "error");
          return false;
        }
      }
      return true;
    }
    if (step === 3) {
      if (!booking.payment) {
        addToast(T.toast_select_pay, "error");
        return false;
      }
      if (!booking.termsAccepted) {
        addToast(T.toast_accept_terms, "error");
        return false;
      }
      return true;
    }
    return true;
  };
  
  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    let updatedHistory = [...user.usedCoupons];
    
    if (booking.appliedCoupon) {
      if (!updatedHistory.includes(booking.appliedCoupon.code)) {
        updatedHistory.push(booking.appliedCoupon.code);
      }
      updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon?.code);
    }
    
    const newXP = user.xp + estimatedXP;
    let leveledUp = false;
    
    DATA.levels.forEach(lvl => {
      if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
        leveledUp = true;
        updatedCoupons.push({
          id: `LVL${lvl.level}_${Date.now()}`,
          val: lvl.reward,
          title: `🏆 ${lvl.title}`,
          code: `LVLUP${lvl.level}`
        });
      }
    });
    
    if (newXP >= 800) {
      const oldCycle = Math.floor((user.xp - 800) / 500);
      const newCycle = Math.floor((newXP - 800) / 500);
      if (newCycle > oldCycle && newCycle >= 0) {
        leveledUp = true;
        updatedCoupons.push({
          id: `PRESTIGE_${Date.now()}`,
          val: 50,
          title: `🏆 Íntimo Plus`,
          code: `VIPMASTER`
        });
      }
    }
    
    if (leveledUp) setLevelUpPopup(true);
    
    setUser(prev => ({
      ...prev,
      xp: newXP,
      coupons: updatedCoupons,
      usedCoupons: updatedHistory,
      ordersCount: prev.ordersCount + 1
    }));
    
    window.open(generateWhatsAppLink(), '_blank');
    
    setBooking({
      type: 'single',
      item: null,
      extras: {},
      date: null,
      time: null,
      locationType: 'home',
      address: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
      payment: '',
      appliedCoupon: null,
      termsAccepted: false
    });
    
    setStep(4);
  };
  
  const handleNextStep = () => {
    if (validateStep()) {
      if (step === 3) {
        finishBooking();
      } else {
        setStep(s => s + 1);
      }
    }
  };
  
  const scrollDates = (dir: 'left' | 'right') => {
    if (dateScrollRef.current) {
      const amt = dir === 'left' ? -200 : 200;
      dateScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
    }
  };
  
  const nextLevelInfo = getNextLevelInfo(user.xp);
  
  if (!isClient) {
    return <div className="min-h-screen w-full bg-zinc-950" />;
  }
  
  if (loading) {
    return (
      <div className={`fixed inset-0 flex items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-slate-50'} font-inter`}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-3xl font-bold mb-6 shadow-xl shadow-blue-500/30 animate-pulse font-playfair">
            T
          </div>
          <div className="w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 animate-pulse" style={{ width: '70%' }}></div>
          </div>
          <p className="text-xs text-zinc-500 mt-4 font-semibold uppercase tracking-widest font-inter">{T.loading}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`min-h-screen font-inter ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-300`}>
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-0 left-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-blue-600' : 'bg-blue-400'}`} />
        <div className={`absolute bottom-0 right-0 w-96 h-96 blur-3xl rounded-full opacity-20 ${isDark ? 'bg-indigo-600' : 'bg-indigo-400'}`} />
      </div>
      
      {/* Toast Notifications */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 pointer-events-none px-4 w-full max-w-md">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg animate-in slide-in-from-top font-inter
              ${t.type === 'success'
                ? isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                : isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-100 border-amber-200 text-amber-700'
              }
            `}
          >
            <span className="text-xl">{t.type === 'success' ? '✓' : '⚠️'}</span>
            <span className="text-sm font-medium">{t.msg}</span>
          </div>
        ))}
      </div>
      
      {/* Header */}
      {step !== 4 && (
        <header className="h-20 px-6 md:px-12 flex items-center justify-between relative z-20 max-w-6xl mx-auto">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Thalyson Massagens
            </h1>
            <div className="flex items-center gap-1 text-xs text-blue-500 font-semibold mt-1 font-inter">
              <span className="text-lg"></span>
              +69 Sessões Realizadas
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSettingsOpen(true)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-xl ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}
            >
              ⚙️
            </button>
            <button
              onClick={handleShare}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-xl ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}
            >
              📤
            </button>
            <button
              onClick={() => setLang(l => l === 'pt' ? 'en' : 'pt')}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-xl ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-sm'}`}
            >
              🌐
            </button>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors text-xl ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-blue-500 hover:text-blue-600 shadow-sm'}`}
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main ref={scrollRef} className="overflow-y-auto pb-32 px-6 md:px-12 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* STEP 0: Service Selection */}
          {step === 0 && (
            <div className="space-y-12 animate-in fade-in duration-700">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-8">
                <div>
                  <h2 className={`text-4xl md:text-5xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {T.welcome} <span className="text-blue-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span>
                  </h2>
                  <p className={`text-lg mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    {T.choose_sub}
                  </p>
                </div>
                {/* Level Card */}
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${isDark ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                        🏆
                      </div>
                      <div>
                        <span className={`text-xs uppercase font-bold tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          {T.level_label}
                        </span>
                        <h3 className={`text-2xl font-bold mt-1 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {user.xp >= 800 ? "Íntimo Plus" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                        </h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-4xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                      <span className="text-xs font-bold text-blue-500 block font-inter">XP</span>
                    </div>
                  </div>
                  <div>
                    <div className={`flex justify-between text-xs font-semibold mb-2 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                      <span>Progresso</span>
                      <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                        style={{ width: `${getCurrentLevelProgress()}%`, transition: 'width 1s ease' }}
                      />
                    </div>
                    {nextLevelInfo && (
                      <p className={`text-xs mt-3 text-center font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        Faltam {nextLevelInfo.needed} XP para +R${nextLevelInfo.reward}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tabs */}
              <div className={`flex p-1 rounded-2xl border max-w-md mx-auto ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-100 border-slate-200'}`}>
                <button
                  onClick={() => setActiveTab('packs')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                >
                  <span className="text-xl">📦</span> {T.tab_packs}
                </button>
                <button
                  onClick={() => setActiveTab('single')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all font-inter ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg' : isDark ? 'text-zinc-500' : 'text-slate-600'}`}
                >
                  <span className="text-xl">💆‍♂️</span> {T.tab_single}
                </button>
              </div>
              
              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map((s: ServiceItem) => (
                  <Card
                    key={s.id}
                    active={booking.item?.id === s.id}
                    onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : 'pack', s)}
                    isDark={isDark}
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl text-3xl ${isDark ? 'bg-zinc-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                          {s.icon}
                        </div>
                        <div className="text-right">
                          {s.fullPrice && (
                            <span className={`text-xs line-through block mb-1 font-inter ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                              {DATA.currency} {s.fullPrice}
                            </span>
                          )}
                          <span className="text-3xl font-bold text-blue-500 font-playfair">
                            {DATA.currency} {s.price}
                          </span>
                          {s.savings && (
                            <span className="text-xs font-bold text-emerald-500 block mt-1 font-inter">
                              Economize {DATA.currency} {s.savings}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-6">
                        <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-500/20 font-inter">
                          {s.tag}
                        </span>
                        <h3 className={`text-xl font-bold mt-4 mb-2 font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {s.title}
                        </h3>
                        <p className={`text-sm font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {s.desc}
                        </p>
                      </div>
                    </div>
                    <div className={`pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex items-center gap-2 text-blue-500 text-xs font-bold mb-2 uppercase tracking-wider font-inter">
                        <span className="text-lg">ℹ️</span> {T.details_label}
                      </div>
                      <div className={`text-xs space-y-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                        {s.details.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Reviews */}
              <div className="py-12">
                <h3 className={`text-3xl font-playfair font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.reviews_title}
                </h3>
                <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">
                  {DATA.reviews.map((r, i) => (
                    <div key={i} className="snap-center">
                      <ReviewCard review={r} isDark={isDark} />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* FAQ */}
              <div className="max-w-3xl mx-auto py-12">
                <h3 className={`text-3xl font-playfair font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.faq_title}
                </h3>
                <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                  {DATA.faq.map((item, idx) => (
                    <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* STEP 1: Date & Time Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="text-center">
                <h2 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {T.select_time_title}
                </h2>
                <p className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                  Selecione o melhor momento para seu relaxamento
                </p>
              </div>
              
              {/* Date Selector */}
              <div className="relative">
                <button
                  onClick={() => scrollDates('left')}
                  className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all text-xl ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                >
                  ←
                </button>
                <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-4 snap-x">
                  {daysArray.map((d, idx) => {
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    const monthName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { month: 'short' }).replace('.', '');
                    const dayName = d.toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, { weekday: 'short' }).slice(0, 3);
                    return (
                      <div key={idx} className="snap-center">
                        <button
                          onClick={() => setBooking(b => ({ ...b, date: d.toISOString(), time: null }))}
                          className={`
                            w-20 h-28 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 font-inter
                            ${isSel
                              ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-110'
                              : isDark
                              ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                              : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                            }
                          `}
                        >
                          <span className="text-xs uppercase opacity-60">{monthName}</span>
                          <span className="text-xs uppercase opacity-80">{dayName}</span>
                          <span className="text-2xl font-bold">{d.getDate()}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={() => scrollDates('right')}
                  className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full transition-all text-xl ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-white text-slate-500 hover:text-slate-800 shadow-md'}`}
                >
                  →
                </button>
              </div>
              
              {/* Time Slots */}
              {!booking.date && (
                <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${isDark ? 'border-zinc-800 text-zinc-600' : 'border-slate-300 text-slate-400'} font-inter`}>
                  <span className="text-4xl mb-4 block">📅</span>
                  <p className="text-sm font-semibold uppercase tracking-wider">{T.empty_date}</p>
                </div>
              )}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {generateTimeSlots.map((t, idx) => (
                    <button
                      key={t}
                      onClick={() => setBooking(b => ({ ...b, time: t }))}
                      className={`
                        py-4 rounded-xl text-sm font-semibold border-2 transition-all font-inter
                        ${booking.time === t
                          ? isDark
                            ? 'bg-white text-black border-white shadow-lg'
                            : 'bg-slate-900 text-white border-slate-900 shadow-lg'
                          : isDark
                            ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                        }
                      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                <div className={`text-center py-16 rounded-2xl ${isDark ? 'bg-zinc-900/50 border border-zinc-800 text-zinc-400' : 'bg-slate-100 border border-slate-200 text-slate-500'} font-inter`}>
                  <p className="text-sm font-medium">{T.empty_slots}</p>
                </div>
              )}
            </div>
          )}
          
          {/* STEP 2: Location & Extras */}
          {step === 2 && (
            <div className="space-y-12 animate-in fade-in duration-700">
              <h2 className={`text-3xl font-playfair font-bold text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.location_title}
              </h2>
              
              {/* Location Type */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { id: 'home', label: lang === 'pt' ? 'Residência' : 'Home', icon: '🏠' },
                  { id: 'motel', label: 'Motel', icon: '🛏️' },
                  { id: 'hotel', label: 'Hotel', icon: '🏨' }
                ].map(x => (
                  <button
                    key={x.id}
                    onClick={() => setBooking(b => ({ ...b, locationType: x.id as any }))}
                    className={`
                      py-6 rounded-2xl flex flex-col items-center gap-3 transition-all border-2 font-inter
                      ${booking.locationType === x.id
                        ? 'bg-blue-600/10 border-blue-500 text-blue-500 shadow-lg'
                        : isDark
                        ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                      }
                    `}
                  >
                    <span className="text-3xl">{x.icon}</span>
                    <span className="text-xs font-bold uppercase">{x.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
                {/* Address Form */}
                <div className="space-y-6">
                  <InputField
                    isDark={isDark}
                    label={T.input_name}
                    value={user.name}
                    onChange={(e: any) => setUser(u => ({ ...u, name: e.target.value }))}
                    icon="👤"
                    placeholder={lang === 'pt' ? "Seu nome" : "Your name"}
                  />
                  
                  {booking.locationType === 'home' && (
                    <>
                      <div className="grid grid-cols-[1fr_100px] gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_addr}
                          value={booking.address.street}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, street: e.target.value } }))}
                          icon="📍"
                          placeholder={lang === 'pt' ? "Rua" : "Street"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_num}
                          value={booking.address.number}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, number: e.target.value } }))}
                          placeholder="123"
                          type="tel"
                        />
                      </div>
                      <InputField
                        isDark={isDark}
                        label={T.input_district}
                        value={booking.address.district}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, district: e.target.value } }))}
                        placeholder={lang === 'pt' ? "Bairro" : "District"}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          isDark={isDark}
                          label={T.input_city}
                          value={booking.address.city}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: e.target.value } }))}
                          placeholder={lang === 'pt' ? "Cidade" : "City"}
                        />
                        <InputField
                          isDark={isDark}
                          label={T.input_comp}
                          value={booking.address.comp}
                          onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: e.target.value } }))}
                          placeholder={lang === 'pt' ? "Apto 10" : "Apt 10"}
                        />
                      </div>
                    </>
                  )}
                  
                  {booking.locationType === 'hotel' && (
                    <>
                      <InputField
                        isDark={isDark}
                        label={T.input_hotel}
                        value={booking.address.placeName}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, placeName: e.target.value } }))}
                        icon="🏨"
                        placeholder={lang === 'pt' ? "Nome do hotel" : "Hotel name"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_city}
                        value={booking.address.city}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, city: e.target.value } }))}
                        placeholder={lang === 'pt' ? "Cidade" : "City"}
                      />
                      <InputField
                        isDark={isDark}
                        label={T.input_room}
                        value={booking.address.comp}
                        onChange={(e: any) => setBooking(b => ({ ...b, address: { ...b.address, comp: e.target.value } }))}
                        placeholder="305"
                      />
                    </>
                  )}
                  
                  {booking.locationType === 'motel' && (
                    <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'} font-inter`}>
                      <span className={`text-4xl mx-auto mb-4 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>📱</span>
                      <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        {T.motel_note}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Extras */}
                <div>
                  <h3 className={`text-sm font-bold uppercase mb-6 tracking-wider font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                    {T.extras_title}
                  </h3>
                  <div className="space-y-3">
                    {DATA.extras.map((ex, idx) => {
                      const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                      const isActive = booking.extras[ex.id];
                      return (
                        <div
                          key={ex.id}
                          onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                          className={`
                            flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                            ${isActive
                              ? 'bg-blue-600/10 border-blue-500/40 shadow-md'
                              : isDark
                              ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`text-xl ${isActive ? 'text-blue-500' : isDark ? 'text-zinc-600' : 'text-slate-500'}`}>
                              {ex.icon}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${isActive ? 'text-blue-500' : isDark ? 'text-zinc-200' : 'text-slate-700'} font-inter`}>
                                {ex.label}
                              </p>
                              <p className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'} font-inter`}>{ex.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {booking.type !== 'single' && (
                              <span className={`text-xs line-through block ${isDark ? 'text-zinc-600' : 'text-slate-400'} font-inter`}>
                                {DATA.currency} {ex.price}
                              </span>
                            )}
                            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-500' : isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500'} font-inter`}>
                              + {DATA.currency} {price}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* STEP 3: Payment & Summary */}
          {step === 3 && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <SmartTimer isDark={isDark} text={T.timer_text} />
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                {/* Summary */}
                <div className={`p-8 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                  <h3 className={`text-2xl font-playfair font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Resumo da Reserva
                  </h3>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-xs uppercase font-bold mb-1 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Serviço Selecionado
                        </p>
                        <h4 className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {booking.item?.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-blue-500 font-medium mt-2 bg-blue-500/10 px-3 py-1.5 rounded-full w-fit border border-blue-500/20 font-inter">
                          <span className="text-lg">📅</span>
                          {booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN) : ''} • {booking.time}
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-blue-500 font-playfair">
                        {DATA.currency} {booking.item?.price}
                      </span>
                    </div>
                    
                    {Object.keys(booking.extras).filter(k => booking.extras[k]).length > 0 && (
                      <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                        <p className={`text-xs uppercase font-bold mb-3 font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Adicionais
                        </p>
                        <div className="space-y-2">
                          {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                            const ex = DATA.extras.find(e => e.id === k);
                            const price = booking.type !== 'single' ? Math.floor(ex!.price * 0.8) : ex!.price;
                            return (
                              <div key={k} className="flex justify-between text-sm font-inter">
                                <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>{ex!.label}</span>
                                <span className="font-semibold text-blue-500">+ {DATA.currency} {price}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    <div className={`pt-6 border-t ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
                      <div className="flex justify-between mb-2">
                        <span className={`text-sm font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.subtotal}</span>
                        <span className={`text-sm font-semibold font-inter ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                          {DATA.currency} {financials.sub}
                        </span>
                      </div>
                      {financials.disc > 0 && (
                        <div className="flex justify-between mb-2 text-emerald-500 font-inter">
                          <span className="text-sm">{T.discount} ({booking.appliedCoupon?.title})</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.disc}</span>
                        </div>
                      )}
                      {financials.pixDisc > 0 && (
                        <div className="flex justify-between mb-2 text-blue-400 font-inter">
                          <span className="text-sm">{T.pix_discount}</span>
                          <span className="text-sm font-semibold">- {DATA.currency} {financials.pixDisc}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center pt-4">
                        <span className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.total_label}</span>
                        <div className="text-right">
                          <span className="text-4xl font-black text-blue-500 font-playfair">
                            {DATA.currency} {financials.total}
                          </span>
                          <div className="flex items-center gap-1 text-xs font-semibold text-blue-500 mt-1 font-inter">
                            <span className="text-lg">✨</span> +{estimatedXP} XP
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Payment & Actions */}
                <div className="space-y-6">
                  {/* Coupons */}
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.coupon_section}
                    </h3>
                    {user.coupons.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {user.coupons.map(c => (
                          <button
                            key={c.id}
                            onClick={() => setBooking(b => ({ ...b, appliedCoupon: b.appliedCoupon?.id === c.id ? null : c }))}
                            className={`
                              px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all border font-inter
                              ${booking.appliedCoupon?.id === c.id
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg'
                                : isDark
                                ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                              }
                            `}
                          >
                            {c.title}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm italic font-inter ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                        {T.no_coupons}
                      </p>
                    )}
                  </div>
                  
                  {/* Payment */}
                  <div className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold font-playfair mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {T.payment_title}
                    </h3>
                    <div className="space-y-3">
                      {[
                        { id: 'pix', label: 'Pix (3% OFF)', icon: '📱' },
                        { id: 'card', label: lang === 'pt' ? 'Cartão' : 'Card', icon: '💳' },
                        { id: 'money', label: lang === 'pt' ? 'Dinheiro' : 'Cash', icon: '💵' }
                      ].map(p => (
                        <button
                          key={p.id}
                          onClick={() => setBooking(b => ({ ...b, payment: p.id }))}
                          className={`
                            w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all font-inter
                            ${booking.payment === p.id
                              ? 'bg-blue-600/10 border-blue-500 text-blue-500'
                              : isDark
                              ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                            }
                          `}
                        >
                          <span className="text-2xl">{p.icon}</span>
                          <span className="text-sm font-bold uppercase flex-1 text-left">{p.label}</span>
                          {booking.payment === p.id && <span className="text-xl">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Terms */}
                  <div
                    onClick={() => setTermsOpen(true)}
                    className={`
                      flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all font-inter
                      ${booking.termsAccepted
                        ? 'bg-blue-500/10 border-blue-500/40'
                        : isDark
                        ? 'border-zinc-800 hover:border-zinc-700'
                        : 'border-slate-200 hover:border-slate-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-2xl ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>🛡️</span>
                      <div>
                        <span className={`text-sm font-semibold block font-playfair ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>
                          {T.terms_title}
                        </span>
                        <span className={`text-xs font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                          Toque para ler todas as regras
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setBooking(b => ({ ...b, termsAccepted: !b.termsAccepted }));
                      }}
                      className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                        ${booking.termsAccepted
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : isDark ? 'border-zinc-700' : 'border-slate-300'
                        }
                      `}
                    >
                      {booking.termsAccepted && <span className="text-sm">✓</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
              <div className="relative mb-8">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-bounce">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-20 rounded-full animate-pulse" />
              </div>
              <h2 className={`text-4xl font-playfair font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {T.success_title}
              </h2>
              <p className={`text-lg mb-8 max-w-md font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                {T.success_sub}
              </p>
              <div className="flex flex-col gap-4 w-full max-w-sm">
                <Button
                  variant="whatsapp"
                  size="xl"
                  full
                  icon="💬"
                  onClick={() => window.open(generateWhatsAppLink(), '_blank')}
                >
                  {T.whatsapp_btn}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setStep(0);
                    setBooking({ ...booking, item: null, type: 'single', termsAccepted: false, appliedCoupon: null });
                  }}
                >
                  {T.back_home}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* FOOTER NAVIGATION (Floating) */}
      {step < 4 && booking.item && (
        <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 z-40 pointer-events-none">
          <div className={`
            max-w-2xl mx-auto rounded-3xl p-4 shadow-2xl border backdrop-blur-xl pointer-events-auto flex justify-between items-center transition-all font-inter
            ${isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-white/90 border-slate-200'}
          `}>
            {step > 0 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className={`p-3 rounded-full transition-colors text-xl ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'}`}
              >
                ←
              </button>
            ) : (
              <div className="w-12" /> /* Spacer */
            )}
            <div className="text-center">
              <p className={`text-[10px] font-bold uppercase tracking-widest font-inter ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                {step === 3 ? T.total_label : T.subtotal}
              </p>
              <p className={`text-xl font-bold font-playfair ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {step === 3 ? `${DATA.currency} ${financials.total}` : `${DATA.currency} ${financials.sub}`}
              </p>
            </div>
            <Button
              onClick={handleNextStep}
              className="rounded-full !px-6"
            >
              {step === 3 ? T.finish_btn : T.next_btn} <span className="text-xl ml-2">→</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* MODALS & POPUPS */}
      {/* Terms Modal - COMPLETO COM TODAS AS REGRAS */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <button onClick={() => setTermsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/10 text-2xl">
              ✖
            </button>
            <h3 className={`text-2xl font-playfair font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.rules_complete}</h3>
            <div className="space-y-4">
              {DATA.rules.map((rule, i) => (
                <RuleItem key={i} rule={rule} isDark={isDark} />
              ))}
            </div>
            <div className="mt-8">
              <Button full onClick={() => { setBooking(b => ({ ...b, termsAccepted: true })); setTermsOpen(false); }}>
                {T.agree_terms}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings/Install Modal */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className={`relative w-full max-w-sm rounded-3xl p-8 text-center shadow-2xl ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
            <button onClick={() => setSettingsOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-500/10 text-2xl">
              ✖
            </button>
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500 text-4xl">
              📲
            </div>
            <h3 className={`text-xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.install_app}</h3>
            <p className={`text-sm mb-6 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.install_desc}</p>
            <Button full variant="secondary" onClick={() => setSettingsOpen(false)}>
              Ok
            </Button>
          </div>
        </div>
      )}
      
      {/* Welcome Popup (Gamification) */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white'}`}>
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl rotate-12 flex items-center justify-center shadow-xl mb-4 text-5xl">
              🎁
            </div>
            <h3 className={`text-2xl font-playfair font-bold mt-10 mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome_popup_title}</h3>
            <p className={`text-sm mb-8 leading-relaxed font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.welcome_popup_msg}</p>
            <div className={`p-4 rounded-2xl border-2 border-dashed mb-8 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
              <p className="text-xs font-bold uppercase text-zinc-500 mb-1 font-inter">CUPOM</p>
              <p className="text-2xl font-mono font-bold text-blue-500 tracking-wider font-playfair">BEMVINDO10</p>
            </div>
            <Button full onClick={() => {
              setWelcomePopup(false);
              setUser(u => ({ ...u, hasSeenWelcome: true }));
              const welcomeCoupon = { id: 'welcome', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' };
              setBooking(b => ({ ...b, appliedCoupon: welcomeCoupon }));
              setUser(prev => ({ ...prev, coupons: [...prev.coupons, welcomeCoupon] }));
              addToast(T.toast_coupon_success, "success");
            }}>
              {T.get_coupon}
            </Button>
          </div>
        </div>
      )}
      
      {/* Level Up Popup */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in zoom-in">
          <div className={`relative w-full max-w-sm rounded-[2.5rem] p-10 text-center shadow-2xl border ${isDark ? 'bg-zinc-900 border-amber-500/20' : 'bg-white'}`}>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/20 blur-3xl rounded-full" />
            </div>
            <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/40 animate-bounce text-4xl">
              🏆
            </div>
            <h3 className={`text-3xl font-playfair font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.levelup_popup_title}</h3>
            <p className={`text-sm mb-8 font-inter ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.levelup_popup_msg}</p>
            <Button full variant="primary" className="!bg-amber-600 hover:!bg-amber-700 shadow-amber-600/20" onClick={() => setLevelUpPopup(false)}>
              Uhuul!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
