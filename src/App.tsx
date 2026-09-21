import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  memo,
  useCallback,
} from 'react';

// ==================================================================================
// CONFIG & CONSTANTS
// ==================================================================================
const CONFIG = {
  PHONE: '5517991360413',
  INSTAGRAM_URL: 'https://www.instagram.com/relaxarhojesp',
  START_HOUR: 9,
  END_HOUR: 22,
  STORAGE_KEYS: {
    ADULT: 'thaly_adult',
    GIFT: 'thaly_gift_v3',
  },
  PRICING: {
    RUSH_FEE: 15,
    FETISH_FEE: 130,
    PIX_DISCOUNT: 0.03,
    PACK_DURATION_MIN: 60,
    MORE_TIME_MIN: 30,
  },
} as const;

const RUSH_HOURS = new Set(['12:00', '13:00', '17:00', '18:00', '19:00']);

const ICON_PATHS = {
  check: 'M20 6L9 17l-5-5',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  'user-check':
    'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  sparkles:
    'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z M20 3v4 M22 5h-4 M4 17v2 M5 18H3',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  gift: 'M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7 M16 8h-4 M4 8h16a2 2 0 0 1 2 2v2H2v-2a2 2 0 0 1 2-2z M12 8V4 M12 8V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4 M12 8V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4',
  scissors: 'M6 9L12 15 18 9 M6 20a3 3 0 0 1-3-3v-6l6 6v3z M18 20a3 3 0 0 0 3-3v-6l-6 6v3z',
  heart:
    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  'arrow-down': 'M12 5v14 M19 12l-7 7-7-7',
  message:
    'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  'map-pin':
    'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  instagram:
    'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  calendar:
    'M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M7 11V7a5 5 0 0 1 10 0v4',
} as const;

type IconName = keyof typeof ICON_PATHS;

// ==================================================================================
// TYPES
// ==================================================================================
type LocationType = '' | 'motel' | 'home' | 'hotel';
type PaymentMethod = '' | 'pix' | 'card' | 'cash';
type ActiveTab = 'single' | 'packs';

interface ServiceItem {
  id: string;
  min: number;
  price: number;
  icon: IconName;
  tag: string;
  title: string;
  desc: string;
  details?: string[];
  popular?: boolean;
  fullPrice?: number;
}

interface ExtraItem {
  id: string;
  price: number;
  label: string;
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

interface BookingState {
  cart: ServiceItem[];
  extras: Record<string, boolean>;
  locationType: LocationType;
  name: string;
  age: string;
  fetishRequest: string;
  payment: PaymentMethod;
  discount: number;
  address: Address;
  date: Date | null;
  time: string;
  manualCoupon: string;
  manualCouponValue: number;
  finished?: boolean;
}

// ==================================================================================
// DATA SOURCE
// ==================================================================================
const DATA: {
  services: ServiceItem[];
  packs: ServiceItem[];
  extras: ExtraItem[];
  reviews: { n: string; loc: string; t: string }[];
  coupons: Record<string, { value: number; label: string }>;
} = {
  services: [
    {
      id: 'depilacao',
      min: 60,
      price: 107,
      icon: 'scissors',
      tag: 'ESTÉTICA',
      title: 'Aparo de Pelos',
      desc: 'Higiene e estética corporal.',
      details: [
        'Aparo feito com máquina (pentes 0 e 3)',
        'Cuidado completo para deixar o corpo limpo e preparado.',
      ],
    },
    {
      id: 'pes',
      min: 40,
      price: 110,
      icon: 'user-check',
      tag: 'ALÍVIO RÁPIDO',
      title: 'Reflexologia Podal',
      desc: 'Foco total em tirar o cansaço dos pés.',
      details: [
        'Pressão profunda em pontos de tensão na sola dos pés',
        'Alívio imediato para quem passa muito tempo em pé.',
      ],
    },
    {
      id: 'relaxante',
      min: 60,
      price: 180,
      icon: 'user-check',
      tag: 'ALÍVIO MUSCULAR',
      title: 'Massagem Clássica',
      desc: 'Corpo todo, focada em desfazer nós e dores.',
      details: [
        'Pressão firme nas costas, braços e pernas',
        'Foco em tirar travas e estresse muscular',
        'Estritamente terapêutica, sem toques íntimos.',
      ],
    },
    {
      id: 'sensitiva',
      min: 60,
      price: 200,
      icon: 'sparkles',
      tag: 'DESPERTAR',
      title: 'Massagem Sensitiva',
      desc: 'Inicia clássica e termina sensorial.',
      details: [
        'Massagem inicial profunda para tirar tensão',
        'Toques sutis com as mãos despertando a pele',
        'Finalização tântrica manual focada no alívio mental.',
      ],
    },
    {
      id: 'mista',
      min: 60,
      price: 250,
      icon: 'zap',
      tag: 'CUECA E BARBA',
      title: 'Experiência Fusion',
      desc: 'Contato físico intenso, corpo a corpo.',
      details: [
        'Atendo apenas de cueca, garantindo sensações próximas',
        'Após relaxar seu corpo, passo minha barba em você (frente e costas)',
        'Nível alto de intimidade, com massagem íntima manual (Lingam).',
      ],
    },
    {
      id: 'nuru',
      min: 60,
      price: 350,
      icon: 'star',
      popular: true,
      tag: 'DESLIZAMENTO',
      title: 'Massagem Nuru (Gel)',
      desc: 'A mais pedida. Deslizamento total de corpos.',
      details: [
        'Nós dois sem roupas do início ao fim',
        'Muito gel especial ultra deslizante sobre a pele',
        'Contato fluido e intenso de corpo todo (frente e costas)',
        'Estímulo terminando em uma liberação prazerosa e intensa.',
      ],
    },
    {
      id: 'reversa',
      min: 60,
      price: 400,
      icon: 'zap',
      tag: 'SEU CONTROLE',
      title: 'Massagem Reversa',
      desc: 'Você assume o comando da sessão.',
      details: [
        'Eu começo a massagem relaxando o seu corpo',
        'Depois, o controle passa para você',
        'Você dita o ritmo, os toques e a intensidade pelo meu corpo',
        'Finalização mútua e libertadora.',
      ],
    },
  ],
  packs: [
    {
      id: 'pack_classic4',
      min: 60,
      price: 576,
      fullPrice: 720,
      icon: 'calendar',
      tag: 'MENSAL',
      title: 'Mês Sem Dor (4x)',
      desc: '4 sessões clássicas no mês (1x por semana) focadas na saúde muscular e alívio de tensões.',
    },
    {
      id: 'pack_tantric',
      min: 60,
      price: 640,
      fullPrice: 800,
      icon: 'heart',
      tag: 'IMERSÃO',
      title: 'Jornada Tântrica (3x)',
      desc: '3 encontros escalando a intimidade: 1 Sensitiva, 1 Fusion e 1 Nuru com gel.',
    },
  ],
  extras: [
    { id: 'more_time', price: 75, label: 'Estender tempo (+30 Minutos)' },
    { id: 'aroma', price: 20, label: 'Aromaterapia Relaxante' },
  ],
  reviews: [
    {
      n: 'Marcos A.',
      loc: 'Bela Vista - SP',
      t: 'Atendimento sensacional. O Thalyson é super atencioso e me deixou muito à vontade desde o primeiro minuto. Recomendo a Fusion, valeu cada centavo!',
    },
    {
      n: 'Leandro S.',
      loc: 'Jardins - SP',
      t: 'Lugar discreto, limpo e bem localizado. A massagem Nuru é indescritível, me desliguei total dos problemas.',
    },
    {
      n: 'João Paulo',
      loc: 'Hotel - SP',
      t: 'Estava de passagem por SP e pedi atendimento no hotel. Pontual, muito profissional e com uma energia maravilhosa. Voltarei com certeza.',
    },
    {
      n: 'Rafael (Sigiloso)',
      loc: 'Consolação - SP',
      t: 'Para quem é casado e precisa de discrição, não tem lugar melhor. Respeito do início ao fim e a massagem tirou todas as minhas dores.',
    },
  ],
  coupons: {
    RELAX10: { value: 10, label: 'Desconto Especial (R$ 10)' },
    PRIMEIRA15: { value: 15, label: 'Primeira Sessão (R$ 15)' },
  },
};

// ==================================================================================
// UTILS
// ==================================================================================
const formatMoney = (val: number) =>
  `R$ ${val.toFixed(2).replace('.', ',')}`;

const vibrate = (pattern: number | number[] = 50) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  } catch {
    /* noop */
  }
};

const maskCEP = (v: string) =>
  v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);

const pad = (n: number) => String(n).padStart(2, '0');

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const safeLocalStorage = {
  get(key: string): string | null {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    } catch {
      /* noop */
    }
  },
};

// ==================================================================================
// GLOBAL STYLES
// ==================================================================================
const GlobalStyles = memo(() => (
  <style
    dangerouslySetInnerHTML={{
      __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

    :root {
      --font-main: 'Plus Jakarta Sans', sans-serif;
      --c-bg: #09090b;
      --c-surface: #121214;
      --c-border: rgba(255,255,255,0.08);
      --c-text: #f4f4f5;
      --c-text-muted: #a1a1aa;
      --c-accent: #fbbf24;
    }

    html, body {
      background-color: var(--c-bg); color: var(--c-text); font-family: var(--font-main);
      overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; scroll-behavior: smooth;
      margin: 0;
    }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

    .animate-fade-up { animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
    .animate-pulse-soft { animation: pulseSoft 2s infinite ease-in-out; }

    .glass-panel { background: rgba(18, 18, 20, 0.6); backdrop-filter: blur(16px); border: 1px solid var(--c-border); }

    .input-premium {
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.2s;
    }
    .input-premium:focus { border-color: var(--c-accent); background: rgba(255,255,255,0.05); outline: none; }
    .input-premium:disabled { opacity: 0.5; cursor: not-allowed; }

    .preserve-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  `,
    }}
  />
));

// ==================================================================================
// BASE UI COMPONENTS
// ==================================================================================
interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
}

const Icon = memo(({ name, size = 24, className = '', label }: IconProps) => (
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
    aria-hidden={!label}
    aria-label={label}
    role={label ? 'img' : undefined}
  >
    <path d={ICON_PATHS[name]} />
  </svg>
));
Icon.displayName = 'Icon';

const SectionHeader = memo(
  ({ title, subtitle, step }: { title: string; subtitle?: string; step: number }) => (
    <div className="mb-6 flex items-start gap-4">
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-zinc-300 font-bold shrink-0">
        {step}
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        {subtitle && <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>}
      </div>
    </div>
  )
);
SectionHeader.displayName = 'SectionHeader';

// ==================================================================================
// MODAIS
// ==================================================================================
const AgeGateModal = memo(({ onConfirm }: { onConfirm: (valid: boolean) => void }) => (
  <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 bg-[#09090b]/95 backdrop-blur-md animate-fade-in text-center">
    <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
      <Icon name="shield" size={32} />
    </div>
    <h2 className="text-3xl font-bold text-white mb-3">Conteúdo Adulto</h2>
    <p className="text-zinc-400 text-sm mb-10 max-w-sm leading-relaxed">
      Meus serviços de terapia e relaxamento são exclusivos para maiores de 18 anos. Você
      confirma que tem mais de 18 anos?
    </p>
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <button
        onClick={() => onConfirm(true)}
        className="w-full bg-amber-500 text-black font-bold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
      >
        Sim, sou maior de 18 anos
      </button>
      <button
        onClick={() => onConfirm(false)}
        className="w-full bg-white/5 border border-white/10 text-zinc-300 font-bold h-14 rounded-2xl flex items-center justify-center transition-transform active:scale-95"
      >
        Não sou
      </button>
    </div>
  </div>
));
AgeGateModal.displayName = 'AgeGateModal';

const PRIZE_CHANCES = [20, 20, 20, 20, 15, 10] as const;

const PremiumGiftReveal = memo(({ onWin }: { onWin: (val: number) => void }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealedVal, setRevealedVal] = useState<number | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  const handleSelect = useCallback(
    (idx: number) => {
      if (selected !== null) return;
      vibrate([50, 50]);
      setSelected(idx);
      const prize = PRIZE_CHANCES[Math.floor(Math.random() * PRIZE_CHANCES.length)];

      const t1 = window.setTimeout(() => {
        setRevealedVal(prize);
        vibrate([100, 50, 200]);
        const t2 = window.setTimeout(() => onWin(prize), 2500);
        timeoutsRef.current.push(t2);
      }, 600);
      timeoutsRef.current.push(t1);
    },
    [selected, onWin]
  );

  return (
    <div className="fixed inset-0 z-[90] flex flex-col items-center justify-center p-6 bg-[#09090b]/95 backdrop-blur-md animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Cortesias</h2>
        <p className="text-zinc-400 text-sm">
          Escolha um dos cartões para descobrir seu benefício de boas-vindas na primeira sessão.
        </p>
      </div>
      <div className="flex gap-4">
        {[0, 1, 2].map((idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            disabled={selected !== null}
            aria-label={`Cartão ${idx + 1}`}
            className={`relative w-24 h-36 rounded-2xl border transition-all duration-700 preserve-3d ${
              selected === idx ? 'scale-110' : selected !== null ? 'opacity-30 scale-95' : 'hover:scale-105'
            } ${revealedVal && selected === idx ? '[transform:rotateY(180deg)_scale(1.1)]' : ''}`}
          >
            <div className="absolute inset-0 backface-hidden rounded-2xl border flex items-center justify-center bg-[#121214] border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.1)]">
              <Icon name="gift" className="text-amber-500/50" />
            </div>
            <div className="absolute inset-0 backface-hidden rounded-2xl border flex flex-col items-center justify-center bg-amber-500 border-amber-400 [transform:rotateY(180deg)]">
              <span className="text-xs font-bold text-amber-950 uppercase tracking-widest">
                Bônus
              </span>
              <span className="text-2xl font-bold text-amber-950 mt-1">
                R$ {revealedVal}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
PremiumGiftReveal.displayName = 'PremiumGiftReveal';

// ==================================================================================
// HOOKS CUSTOMIZADOS
// ==================================================================================
function useDebouncedCepLookup(
  setBooking: React.Dispatch<React.SetStateAction<BookingState>>
) {
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const handleCep = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const masked = maskCEP(e.target.value);
      setBooking((b) => ({ ...b, address: { ...b.address, cep: masked } }));

      if (masked.length !== 9) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoadingCep(true);
      try {
        const res = await fetch(
          `https://viacep.com.br/ws/${masked.replace('-', '')}/json/`,
          { signal: controller.signal }
        );
        const data = await res.json();
        if (!data.erro && !controller.signal.aborted) {
          setBooking((b) => ({
            ...b,
            address: {
              ...b.address,
              street: data.logradouro,
              district: data.bairro,
              city: data.localidade,
            },
          }));
          vibrate([50, 50]);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // silencioso
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingCep(false);
      }
    },
    [setBooking]
  );

  return { isLoadingCep, handleCep };
}

function useFinancials(booking: BookingState) {
  return useMemo(() => {
    let sub = 0;
    let duration = 0;
    const isPack = booking.cart.some((i) => i.id.startsWith('pack'));

    booking.cart.forEach((item) => {
      sub += item.price;
      if (!isPack) duration += item.min || 60;
    });

    if (isPack) duration = CONFIG.PRICING.PACK_DURATION_MIN;

    Object.keys(booking.extras).forEach((k) => {
      if (booking.extras[k]) {
        const ex = DATA.extras.find((e) => e.id === k);
        if (ex) {
          sub += ex.price;
          if (k === 'more_time') duration += CONFIG.PRICING.MORE_TIME_MIN;
        }
      }
    });

    const fetishFee = booking.fetishRequest.trim().length > 0 ? CONFIG.PRICING.FETISH_FEE : 0;
    sub += fetishFee;

    const rushFee =
      RUSH_HOURS.has(booking.time) && booking.locationType !== 'motel'
        ? CONFIG.PRICING.RUSH_FEE
        : 0;

    const totalDiscounts = booking.discount + booking.manualCouponValue;
    const running = Math.max(0, sub - totalDiscounts);
    const pixDisc =
      booking.payment === 'pix' ? Math.ceil(running * CONFIG.PRICING.PIX_DISCOUNT) : 0;

    return {
      sub,
      rushFee,
      pixDisc,
      totalDiscounts,
      fetishFee,
      total: Math.max(0, running - pixDisc) + rushFee,
      duration,
    };
  }, [booking]);
}

// ==================================================================================
// UTILS DE CALENDÁRIO
// ==================================================================================
function buildICS(params: {
  start: Date;
  end: Date;
  location: string;
  summary?: string;
  description?: string;
}) {
  const fmt = (d: Date) =>
    d.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Thalyson Massagens//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(params.start)}`,
    `DTEND:${fmt(params.end)}`,
    `SUMMARY:${params.summary ?? 'Sessão - Thalyson Massagens'}`,
    `DESCRIPTION:${params.description ?? 'Momento reservado e sigiloso.'}`,
    `LOCATION:${params.location}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\n');
}

function downloadICS(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ==================================================================================
// APP
// ==================================================================================
export default function App() {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [giftDone, setGiftDone] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('single');

  const [booking, setBooking] = useState<BookingState>({
    cart: [],
    extras: {},
    locationType: '',
    name: '',
    age: '',
    fetishRequest: '',
    payment: '',
    discount: 0,
    address: {
      cep: '',
      street: '',
      number: '',
      district: '',
      city: '',
      comp: '',
      placeName: '',
    },
    date: null,
    time: '',
    manualCoupon: '',
    manualCouponValue: 0,
  });

  const servicesRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const checkoutRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  // ---- Bootstrap: adult + gift -----------------------------------------------
  useEffect(() => {
    const adult = safeLocalStorage.get(CONFIG.STORAGE_KEYS.ADULT);
    setIsAdult(adult === 'yes');

    const gift = safeLocalStorage.get(CONFIG.STORAGE_KEYS.GIFT);
    if (gift) {
      const parsed = parseInt(gift, 10);
      setGiftDone(true);
      if (!Number.isNaN(parsed)) {
        setBooking((b) => ({ ...b, discount: parsed }));
      }
    }
  }, []);

  // ---- Handlers ---------------------------------------------------------------
  const handleAdultConfirm = useCallback((valid: boolean) => {
    if (valid) {
      safeLocalStorage.set(CONFIG.STORAGE_KEYS.ADULT, 'yes');
      setIsAdult(true);
    } else {
      window.location.href = 'https://google.com';
    }
  }, []);

  const handleWinGift = useCallback((val: number) => {
    safeLocalStorage.set(CONFIG.STORAGE_KEYS.GIFT, String(val));
    setBooking((b) => ({ ...b, discount: val }));
    setGiftDone(true);
  }, []);

  const handleToggleItem = useCallback((item: ServiceItem) => {
    vibrate(30);
    setBooking((p) => {
      const exists = p.cart.find((c) => c.id === item.id);
      return {
        ...p,
        cart: exists ? p.cart.filter((c) => c.id !== item.id) : [...p.cart, item],
      };
    });
  }, []);

  const handleToggleExtra = useCallback((id: string) => {
    setBooking((b) => ({
      ...b,
      extras: { ...b.extras, [id]: !b.extras[id] },
    }));
  }, []);

  const handleApplyCoupon = useCallback(() => {
    setBooking((b) => {
      const code = b.manualCoupon.trim().toUpperCase();
      const couponData = DATA.coupons[code];
      if (couponData) {
        vibrate(50);
        return { ...b, manualCoupon: code, manualCouponValue: couponData.value };
      }
      alert('Cupom inválido ou expirado.');
      return { ...b, manualCouponValue: 0 };
    });
  }, []);

  const handleRemoveCoupon = useCallback(() => {
    setBooking((b) => ({ ...b, manualCouponValue: 0, manualCoupon: '' }));
  }, []);

  const { isLoadingCep, handleCep } = useDebouncedCepLookup(setBooking
