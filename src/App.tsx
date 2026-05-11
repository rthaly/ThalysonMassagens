import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

// ==================================================================================
// THALYSON MASSAGENS — V27 SIMPLES / MOBILE FIRST
// Fluxo reduzido: Escolher serviço → Local → Horário → Confirmar.
// IMPORTANTE: STORAGE_KEY preservada para não perder dados da versão 27.
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

const PHOTO_CONFIG = {
  hero: '/fotos/thalyson-hero.jpg',
};

const RUSH_HOURS = ['12:00', '13:00', '17:00', '18:00'];
const RUSH_FEE = 15;

type Lang = 'pt' | 'en';
type LocationType = 'home' | 'studio' | 'hotel';
type PaymentType = '' | 'pix' | 'card' | 'cash';
type Step = 0 | 1 | 2 | 3;

type IconName =
  | 'arrowLeft' | 'arrowRight' | 'x' | 'check' | 'menu' | 'sparkles' | 'clock'
  | 'mapPin' | 'home' | 'building' | 'hotel' | 'user' | 'message' | 'shield'
  | 'star' | 'heart' | 'plus' | 'calendar' | 'info' | 'sun' | 'moon' | 'instagram'
  | 'copy' | 'gift';

interface ServiceItem {
  id: string;
  type: 'single' | 'pack';
  title: string;
  tag: string;
  desc: string;
  details: string;
  min: number;
  price: number;
  oldPrice?: number;
  popular?: boolean;
  icon: IconName;
}

interface ExtraItem {
  id: string;
  label: string;
  desc: string;
  price: number;
  icon: IconName;
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

const ICON_PATHS: Record<IconName, string> = {
  arrowLeft: 'M15 18l-6-6 6-6',
  arrowRight: 'M9 18l6-6-6-6',
  x: 'M18 6 6 18M6 6l12 12',
  check: 'M20 6 9 17l-5-5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  sparkles: 'M12 2l1.6 5.9L19.5 9.5l-5.9 1.6L12 17l-1.6-5.9L4.5 9.5l5.9-1.6L12 2zM19 15v4M21 17h-4',
  clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2',
  mapPin: 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  home: 'M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10.5z',
  building: 'M4 22V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17M4 22h16M9 8h1M14 8h1M9 12h1M14 12h1',
  hotel: 'M3 21V7a2 2 0 0 1 2-2h7v16M12 9h7a2 2 0 0 1 2 2v10M7 10h1M16 14h1',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  message: 'M21 11.5a8.5 8.5 0 0 1-12.3 7.6L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  star: 'M12 2l3.1 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8 5.8 21 7 14.2 2 9.3l6.9-1L12 2z',
  heart: 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z',
  plus: 'M12 5v14M5 12h14',
  calendar: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  sun: 'M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z',
  instagram: 'M16 11.4A4 4 0 1 1 12.6 8 4 4 0 0 1 16 11.4zM17.5 6.5h.01M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  copy: 'M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2M16 3h-6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z',
  gift: 'M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z',
};

const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
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
    <path d={ICON_PATHS[name]} />
  </svg>
));

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');
const sanitizeInput = (value: unknown): string => String(value ?? '').replace(/[<>&"']/g, '').slice(0, 140);
const maskCEP = (value: string) => value.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const toISODate = (date: Date) => date.toISOString().split('T')[0];
const validateAddress = (address: Address) => Boolean(address.street && address.number && address.district && address.city);

const formatMoney = (value: number, lang: Lang = 'pt') => {
  const converted = lang === 'pt' ? value : value / CONFIG.EXCHANGE_RATE;
  return new Intl.NumberFormat(lang === 'pt' ? CONFIG.LOCALE_PT : CONFIG.LOCALE_EN, {
    style: 'currency',
    currency: lang === 'pt' ? 'BRL' : 'USD',
  }).format(converted || 0);
};

const safeVibrate = (pattern: number | number[] = 35) => {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(pattern);
  } catch {}
};

const getData = (lang: Lang) => {
  const en = lang === 'en';

  const services: ServiceItem[] = [
    {
      id: 'relaxante', type: 'single', min: 40, price: 157, icon: 'sparkles', tag: en ? 'RELAX' : 'RELAX',
      title: en ? 'Classic Massage' : 'Massagem Clássica',
      desc: en ? 'For a heavy body and a full mind.' : 'Para corpo pesado, costas travadas e mente cheia.',
      details: en ? 'A direct session to loosen muscles, calm the body and help you sleep better.' : 'Uma sessão direta para soltar músculos, aliviar o peso do corpo e te ajudar a dormir melhor.',
    },
    {
      id: 'crossfit', type: 'single', min: 60, price: 187, icon: 'clock', tag: en ? 'RECOVERY' : 'RECUPERAÇÃO', popular: true,
      title: en ? 'Athlete Recovery' : 'Massagem para Atletas',
      desc: en ? 'Firm pressure for post-workout tension.' : 'Pegada firme para quem treina pesado ou vive com dor muscular.',
      details: en ? 'Focused on back, legs and shoulders with stronger pressure and mobility work.' : 'Foco em costas, pernas e ombros, com pressão mais forte e alívio de tensão muscular.',
    },
    {
      id: 'sensitiva', type: 'single', min: 60, price: 177, icon: 'heart', tag: en ? 'SENSORY' : 'SENSORIAL',
      title: en ? 'Sensory Massage' : 'Massagem Sensorial',
      desc: en ? 'A calmer session to disconnect from the rush.' : 'Uma sessão mais calma para desligar da correria e sentir o corpo relaxar.',
      details: en ? 'Soft rhythm, attention to breathing and a slower atmosphere from start to finish.' : 'Ritmo leve, atenção à respiração e um clima mais lento do começo ao fim.',
    },
    {
      id: 'mista', type: 'single', min: 60, price: 207, icon: 'star', tag: en ? 'COMPLETE' : 'COMPLETA', popular: true,
      title: en ? 'Fusion Experience' : 'Experiência Fusion',
      desc: en ? 'For those who want relief and a more immersive experience.' : 'Para quem quer alívio físico e uma experiência mais envolvente.',
      details: en ? 'Starts with muscular relief and evolves into a more sensory, complete experience.' : 'Começa com alívio muscular e evolui para uma experiência mais sensorial e completa.',
    },
    {
      id: 'pes', type: 'single', min: 40, price: 110, icon: 'user', tag: en ? 'QUICK' : 'RÁPIDA',
      title: en ? 'Foot Massage' : 'Massagem nos Pés',
      desc: en ? 'Fast relief after a long day.' : 'Alívio rápido para pés cansados depois de um dia longo.',
      details: en ? 'Focused pressure points for tired feet and lower legs.' : 'Pressão em pontos de tensão dos pés e pernas para você pisar mais leve.',
    },
    {
      id: 'depilacao', type: 'single', min: 60, price: 107, icon: 'shield', tag: en ? 'CARE' : 'CUIDADO',
      title: en ? 'Body Trim' : 'Aparo de Pelos',
      desc: en ? 'Simple body care without complication.' : 'Cuidado simples para deixar o corpo mais limpo e leve.',
      details: en ? 'Body hair trim in selected areas with calm and privacy.' : 'Aparo dos pelos em áreas escolhidas, com privacidade e cuidado.',
    },
  ];

  const plans: ServiceItem[] = [
    {
      id: 'pack_essencial', type: 'pack', min: 60, price: 297, oldPrice: 334, icon: 'gift', tag: en ? '2 SESSIONS' : '2 SESSÕES', popular: true,
      title: en ? 'Survival Kit' : 'Kit Sobrevivência',
      desc: en ? 'Two appointments in the month.' : 'Duas sessões no mês para manter o corpo menos pesado.',
      details: en ? 'One session for body relief and another for a calmer, more sensory reset.' : 'Uma sessão para tirar o peso do corpo e outra para desacelerar a mente.',
    },
    {
      id: 'pack_muscle', type: 'pack', min: 60, price: 347, oldPrice: 408, icon: 'clock', tag: en ? 'RECOVERY' : 'RECUPERAÇÃO',
      title: en ? 'Recovery Combo' : 'Combo Recuperação',
      desc: en ? 'For those who train or work hard.' : 'Para quem treina, trabalha muito ou sente dores frequentes.',
      details: en ? 'Two stronger recovery sessions focused on muscle tension.' : 'Duas sessões mais fortes focadas em tensão muscular e recuperação.',
    },
    {
      id: 'pack_premium', type: 'pack', min: 60, price: 637, oldPrice: 721, icon: 'star', tag: en ? '3 SESSIONS' : '3 SESSÕES',
      title: en ? 'Boss Plan' : 'Mensalidade do Chefe',
      desc: en ? 'Three weeks of care reserved.' : 'Três semanas do mês com seu cuidado reservado.',
      details: en ? 'A complete monthly path with three different experiences.' : 'Um caminho mensal completo com três experiências diferentes.',
    },
  ];

  const extras: ExtraItem[] = [
    { id: 'aroma', price: 17, icon: 'sparkles', label: en ? 'Aromatherapy' : 'Aromaterapia', desc: en ? 'A calmer atmosphere.' : 'Ambiente mais calmo.' },
    { id: 'pain_relief', price: 17, icon: 'shield', label: en ? 'Pain focus' : 'Foco em dores', desc: en ? 'More attention to tense areas.' : 'Mais atenção nas áreas travadas.' },
    { id: 'more_time', price: 77, icon: 'clock', label: en ? '+30 min' : '+30 minutos', desc: en ? 'More time without rushing.' : 'Mais tempo sem pressa.' },
    { id: 'hair_trim', price: 57, icon: 'user', label: en ? 'Body trim' : 'Aparo extra', desc: en ? 'Extra body care.' : 'Cuidado extra no corpo.' },
  ];

  return {
    services,
    plans,
    extras,
    text: {
      appName: en ? 'Thalyson Massages' : 'Thalyson Massagens',
      heroTitle: en ? 'Book your massage without complication.' : 'Agende sua massagem sem complicação.',
      heroSub: en ? 'Choose what you want, the place, the time and send everything on WhatsApp.' : 'Escolha o atendimento, local, horário e envie tudo pelo WhatsApp.',
      start: en ? 'Start' : 'Começar',
      single: en ? 'Sessions' : 'Sessões',
      plans: en ? 'Plans' : 'Planos',
      choose: en ? 'Choose' : 'Escolher',
      selected: en ? 'Selected' : 'Selecionado',
      stepService: en ? 'What do you want today?' : 'O que você quer hoje?',
      stepServiceSub: en ? 'Pick only one option to keep it simple.' : 'Escolha uma opção. Sem carrinho confuso.',
      stepPlace: en ? 'Where will it be?' : 'Onde vai ser?',
      stepPlaceSub: en ? 'Fill only what is needed to confirm.' : 'Preencha só o necessário para confirmar.',
      stepTime: en ? 'Choose the day and time' : 'Escolha o dia e horário',
      stepTimeSub: en ? 'Times with +R$15 are peak hours.' : 'Horários com +R$15 são horários de pico.',
      stepFinish: en ? 'Finish' : 'Finalizar',
      stepFinishSub: en ? 'Add extras only if you want.' : 'Adicione extras só se fizer sentido.',
      name: en ? 'Name or nickname' : 'Nome ou apelido',
      cep: en ? 'CEP' : 'CEP',
      street: en ? 'Street' : 'Rua',
      number: en ? 'Number' : 'Número',
      district: en ? 'Neighborhood' : 'Bairro',
      city: en ? 'City' : 'Cidade',
      comp: en ? 'Complement' : 'Complemento',
      home: en ? 'At your place' : 'Na sua casa',
      studio: en ? 'Private suite' : 'Minha suíte',
      hotel: en ? 'Hotel' : 'Hotel',
      studioHint: en ? 'Address sent on WhatsApp.' : 'Endereço enviado pelo WhatsApp.',
      travelHint: en ? 'Travel fee confirmed on WhatsApp.' : 'Deslocamento confirmado no WhatsApp.',
      payment: en ? 'Payment' : 'Pagamento',
      pix: en ? 'Pix - 3% off' : 'Pix - 3% off',
      card: en ? 'Card' : 'Cartão',
      cash: en ? 'Cash' : 'Dinheiro',
      terms: en ? 'I agree with the booking rules.' : 'Li e aceito as regras do atendimento.',
      rulesTitle: en ? 'Simple rules' : 'Regras simples',
      rulesText: en
        ? 'Keep the place clean, respect the agreed time and confirm final details on WhatsApp. The appointment only happens after confirmation.'
        : 'Ambiente limpo, respeito ao horário combinado e confirmação final pelo WhatsApp. O atendimento só acontece depois da confirmação.',
      details: en ? 'Details' : 'Detalhes',
      extras: en ? 'Extras' : 'Extras',
      summary: en ? 'Summary' : 'Resumo',
      total: en ? 'Total' : 'Total',
      back: en ? 'Back' : 'Voltar',
      next: en ? 'Next' : 'Próximo',
      send: en ? 'Send' : 'Enviar',
      openWhatsapp: en ? 'Open WhatsApp' : 'Abrir WhatsApp',
      missingService: en ? 'Choose one service.' : 'Escolha um atendimento.',
      missingName: en ? 'Enter your name.' : 'Digite seu nome.',
      missingPlace: en ? 'Complete the place.' : 'Complete o local.',
      missingTime: en ? 'Choose day and time.' : 'Escolha dia e horário.',
      missingPayment: en ? 'Choose payment and accept rules.' : 'Escolha pagamento e aceite as regras.',
      cepFound: en ? 'Address found.' : 'Endereço carregado.',
      cepError: en ? 'CEP not found.' : 'CEP não encontrado.',
      saved: en ? 'Saved.' : 'Salvo na V27.',
      welcomeTitle: en ? 'Welcome!' : 'Que bom ter você aqui!',
      welcomeText: en ? 'I made booking simple: choose, confirm and send on WhatsApp.' : 'Deixei o agendamento simples: escolha, confirme e envie no WhatsApp.',
      gift: en ? 'Save gift' : 'Pegar presente',
      notNow: en ? 'Not now' : 'Agora não',
      menu: en ? 'Menu' : 'Menu',
      theme: en ? 'Theme' : 'Tema',
      language: en ? 'Português' : 'English',
      restart: en ? 'Restart' : 'Recomeçar',
      copied: en ? 'Copied.' : 'Copiado.',
      successTitle: en ? 'Request ready.' : 'Pedido pronto.',
      successText: en ? 'Send the message on WhatsApp to confirm.' : 'Envie a mensagem no WhatsApp para confirmar.',
    },
  };
};

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');

    :root {
      --bg: ${isDark ? '#090a0d' : '#f7f2ea'};
      --surface: ${isDark ? '#11141a' : '#ffffff'};
      --surface-2: ${isDark ? '#191e27' : '#f2ebe1'};
      --text: ${isDark ? '#fff8ef' : '#1c1712'};
      --muted: ${isDark ? '#b9aea2' : '#6b5f55'};
      --soft: ${isDark ? '#81766c' : '#998b7e'};
      --border: ${isDark ? 'rgba(255,255,255,.12)' : 'rgba(34,24,16,.13)'};
      --border-2: ${isDark ? 'rgba(255,255,255,.22)' : 'rgba(34,24,16,.22)'};
      --blue: #3b82f6;
      --green: #16a34a;
      --amber: #f59e0b;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      font-weight: 400;
      line-height: 1.55;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      -webkit-tap-highlight-color: transparent;
    }

    button, input { font-family: 'Poppins', sans-serif; }
    button { cursor: pointer; }
    :focus-visible { outline: 3px solid rgba(59,130,246,.75); outline-offset: 3px; }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
    }

    @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { opacity: 0; transform: translate(-50%, -46%) scale(.96); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

    .animate-fade-up { animation: fadeUp .28s ease both; }
    .animate-fade-in { animation: fadeIn .22s ease both; }
    .animate-scale-in { animation: scaleIn .24s ease both; }

    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
  `}} />
));

const Button = memo(({ children, onClick, variant = 'primary', disabled, className = '', ariaLabel }: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'whatsapp';
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}) => {
  const styles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-[var(--surface-2)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--border-2)]',
    ghost: 'bg-transparent text-[var(--muted)] hover:text-[var(--text)]',
    whatsapp: 'bg-[#25D366] text-white hover:bg-[#20bd5a]',
  } as const;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cx('inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-40', styles[variant], className)}
    >
      {children}
    </button>
  );
});

const InputField = memo(({ label, value, onChange, placeholder, inputMode }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
}) => (
  <label className="block">
    <span className="mb-2 block text-[12px] font-bold uppercase tracking-[.12em] text-[var(--muted)]">{label}</span>
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      inputMode={inputMode}
      className="h-14 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-base font-bold text-[var(--text)] placeholder:font-normal placeholder:text-[var(--soft)] focus:border-blue-500"
    />
  </label>
));

const ToastContainer = memo(({ toasts }: { toasts: ToastItem[] }) => (
  <div className="pointer-events-none fixed left-0 right-0 top-3 z-[120] mx-auto flex max-w-md flex-col gap-2 px-4">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={cx(
          'animate-fade-up rounded-2xl px-4 py-3 text-sm font-bold shadow-2xl',
          toast.type === 'error' ? 'bg-rose-600 text-white' : toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white',
        )}
      >
        {toast.msg}
      </div>
    ))}
  </div>
));

const CenterModal = memo(({ open, title, children, onClose, footer }: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/70 animate-fade-in" onClick={onClose} />
      <section className="animate-scale-in fixed left-1/2 top-1/2 w-[min(92vw,430px)] overflow-hidden rounded-[28px] border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <header className="flex items-center justify-between gap-4 border-b border-[var(--border)] p-5">
          <h2 className="text-xl font-bold leading-tight">{title}</h2>
          <button onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted)]" aria-label="Fechar">
            <Icon name="x" />
          </button>
        </header>
        <div className="max-h-[58vh] overflow-y-auto p-5 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
        {footer && <footer className="border-t border-[var(--border)] p-4">{footer}</footer>}
      </section>
    </div>
  );
});

const StepHeader = memo(({ step, title, subtitle }: { step: Step; title: string; subtitle: string }) => (
  <div className="mb-5 px-5 pt-4">
    <div className="mb-4 flex gap-2" aria-label={`Etapa ${step + 1} de 4`}>
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className={cx('h-1.5 flex-1 rounded-full', index <= step ? 'bg-blue-600' : 'bg-[var(--surface-2)]')} />
      ))}
    </div>
    <p className="mb-1 text-[12px] font-bold uppercase tracking-[.16em] text-blue-500">Etapa {step + 1} de 4</p>
    <h1 className="text-[28px] font-bold leading-tight">{title}</h1>
    <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
  </div>
));

const ServiceCard = memo(({ item, selected, lang, onSelect, onDetails }: {
  item: ServiceItem;
  selected: boolean;
  lang: Lang;
  onSelect: (item: ServiceItem) => void;
  onDetails: (item: ServiceItem) => void;
}) => (
  <article className={cx('relative flex min-h-[250px] w-[82vw] max-w-[330px] shrink-0 snap-center flex-col rounded-[28px] border bg-[var(--surface)] p-5 transition md:w-[320px]', selected ? 'border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,.16)]' : 'border-[var(--border)]')}>
    {item.popular && <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-bold uppercase tracking-[.1em] text-zinc-950">Popular</span>}
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
      <Icon name={item.icon} />
    </div>
    <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[var(--soft)]">{item.tag}</p>
    <h3 className="mt-1 text-xl font-bold leading-tight">{item.title}</h3>
    <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{item.desc}</p>
    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
      <div>
        <p className="text-xs text-[var(--soft)]">{item.min} min</p>
        <p className="text-lg font-bold">{formatMoney(item.price, lang)}</p>
        {item.oldPrice && <p className="text-xs text-[var(--soft)] line-through">{formatMoney(item.oldPrice, lang)}</p>}
      </div>
      <div className="flex gap-2">
        <button onClick={() => onDetails(item)} className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--muted)]" aria-label="Detalhes">
          <Icon name="info" size={19} />
        </button>
        <button onClick={() => onSelect(item)} className={cx('flex h-11 min-w-11 items-center justify-center rounded-2xl px-4 text-sm font-bold', selected ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white')}>
          {selected ? <Icon name="check" size={18} /> : lang === 'pt' ? 'Escolher' : 'Choose'}
        </button>
      </div>
    </div>
  </article>
));

const ChoiceButton = memo(({ selected, title, desc, icon, onClick }: { selected: boolean; title: string; desc?: string; icon: IconName; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cx('flex w-full items-center gap-3 rounded-[22px] border p-4 text-left transition', selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]')}
  >
    <span className={cx('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', selected ? 'bg-white/18' : 'bg-[var(--surface-2)] text-blue-500')}>
      <Icon name={icon} />
    </span>
    <span>
      <strong className="block font-bold">{title}</strong>
      {desc && <small className={cx('mt-1 block text-xs leading-relaxed', selected ? 'text-white/80' : 'text-[var(--muted)]')}>{desc}</small>}
    </span>
  </button>
));

export default function App() {
  const [isClient, setIsClient] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState<Lang>('pt');
  const [step, setStep] = useState<Step>(0);
  const [activeType, setActiveType] = useState<'single' | 'pack'>('single');
  const [menuOpen, setMenuOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [detailsItem, setDetailsItem] = useState<ServiceItem | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [cepLoading, setCepLoading] = useState(false);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const emptyAddress: Address = useMemo(() => ({ cep: '', street: '', number: '', district: '', city: '', comp: '', placeName: '' }), []);

  const [user, setUser] = useState<UserData>({
    name: '',
    xp: 0,
    coupons: [],
    usedCoupons: [],
    hasSeenWelcome: false,
    ordersCount: 92,
    lastActivity: new Date().toISOString(),
  });

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

  const showToast = useCallback((msg: string, type: ToastItem['type'] = 'info') => {
    const id = Date.now();
    setToasts((current) => [...current, { id, msg, type }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 2300);
  }, []);

  useEffect(() => {
    setIsClient(true);
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.user) setUser((current) => ({ ...current, ...saved.user }));
        if (saved?.booking) setBooking((current) => ({ ...current, ...saved.booking, bookingId: saved.booking.bookingId || current.bookingId }));
        if (typeof saved?.step === 'number') setStep(Math.max(0, Math.min(3, saved.step)) as Step);
        if (typeof saved?.isDark === 'boolean') setIsDark(saved.isDark);
        if (saved?.lang === 'pt' || saved?.lang === 'en') setLang(saved.lang);
      } else {
        setWelcomeOpen(true);
      }
    } catch {
      setWelcomeOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
      const payload = JSON.stringify({ user, booking, step, isDark, lang, updatedAt: new Date().toISOString() });
      if (payload.length < CONFIG.MAX_STORAGE_SIZE * 20) localStorage.setItem(CONFIG.STORAGE_KEY, payload);
    } catch {}
  }, [isClient, user, booking, step, isDark, lang]);

  const availableDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 10; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
  }, []);

  const availableTimes = useMemo(() => {
    const times: string[] = [];
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour += 1) {
      times.push(`${String(hour).padStart(2, '0')}:00`);
      if (hour < CONFIG.END_HOUR) times.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return times;
  }, []);

  const selectedItem = booking.cart[0];
  const selectedExtras = DATA.extras.filter((extra) => booking.extras[extra.id]);

  const subtotal = useMemo(() => {
    const serviceTotal = booking.cart.reduce((sum, item) => sum + item.price, 0);
    const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.price, 0);
    const rushTotal = booking.time && RUSH_HOURS.includes(booking.time) ? RUSH_FEE : 0;
    return serviceTotal + extrasTotal + rushTotal;
  }, [booking.cart, booking.time, selectedExtras]);

  const total = useMemo(() => {
    let value = subtotal;
    if (booking.payment === 'pix') value *= 0.97;
    if (booking.appliedCoupon) value -= booking.appliedCoupon.val;
    return Math.max(0, Math.round(value));
  }, [subtotal, booking.payment, booking.appliedCoupon]);

  const updateAddress = useCallback((key: keyof Address, value: string) => {
    setBooking((current) => ({ ...current, address: { ...current.address, [key]: sanitizeInput(value) } }));
  }, []);

  const fetchCEP = useCallback(async (cep: string) => {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) return;
    setCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await response.json();
      if (data?.erro) throw new Error('CEP');
      setBooking((current) => ({
        ...current,
        address: {
          ...current.address,
          cep: maskCEP(clean),
          street: sanitizeInput(data.logradouro),
          district: sanitizeInput(data.bairro),
          city: sanitizeInput(data.localidade),
        },
      }));
      showToast(T.cepFound, 'success');
    } catch {
      showToast(T.cepError, 'error');
    } finally {
      setCepLoading(false);
    }
  }, [T.cepError, T.cepFound, showToast]);

  const selectItem = useCallback((item: ServiceItem) => {
    safeVibrate(25);
    setBooking((current) => ({ ...current, type: item.type, cart: [item] }));
  }, []);

  const toggleExtra = useCallback((extra: ExtraItem) => {
    safeVibrate(20);
    setBooking((current) => ({ ...current, extras: { ...current.extras, [extra.id]: !current.extras[extra.id] } }));
  }, []);

  const validateStep = useCallback((targetStep: Step) => {
    if (targetStep === 0 && booking.cart.length === 0) {
      showToast(T.missingService, 'error');
      return false;
    }
    if (targetStep === 1) {
      if (user.name.trim().length < 2) {
        showToast(T.missingName, 'error');
        return false;
      }
      if (booking.locationType !== 'studio' && !validateAddress(booking.address)) {
        showToast(T.missingPlace, 'error');
        return false;
      }
    }
    if (targetStep === 2 && (!booking.date || !booking.time)) {
      showToast(T.missingTime, 'error');
      return false;
    }
    if (targetStep === 3 && (!booking.payment || !booking.termsAccepted)) {
      showToast(T.missingPayment, 'error');
      return false;
    }
    return true;
  }, [T.missingName, T.missingPayment, T.missingPlace, T.missingService, T.missingTime, booking, showToast, user.name]);

  const goNext = useCallback(() => {
    if (!validateStep(step)) return;
    if (step < 3) {
      setStep((current) => (current + 1) as Step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setSuccessOpen(true);
    safeVibrate([30, 40, 30]);
    window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    setStep((current) => (current - 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const claimGift = useCallback(() => {
    const coupon: Coupon = { id: 'WELCOME_SIMPLE', code: 'PRIMEIRAVEZ', title: 'Presente de primeira visita', val: 15 };
    setUser((current) => {
      const exists = current.coupons.some((item) => item.id === coupon.id);
      return { ...current, hasSeenWelcome: true, coupons: exists ? current.coupons : [...current.coupons, coupon] };
    });
    setBooking((current) => ({ ...current, appliedCoupon: coupon }));
    setWelcomeOpen(false);
    showToast(T.saved, 'success');
  }, [T.saved, showToast]);

  function buildMessage() {
    const placeLabel = booking.locationType === 'home' ? T.home : booking.locationType === 'studio' ? T.studio : T.hotel;
    const address = booking.locationType === 'studio'
      ? T.studioHint
      : `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}${booking.address.comp ? ` (${booking.address.comp})` : ''}`;
    const extras = selectedExtras.length ? selectedExtras.map((extra) => `- ${extra.label}: ${formatMoney(extra.price, lang)}`).join('\n') : 'Nenhum';

    return [
      `Olá, quero confirmar meu agendamento.`,
      ``,
      `Nome: ${user.name || 'Não informado'}`,
      `Atendimento: ${selectedItem?.title || 'Não selecionado'}`,
      `Duração: ${selectedItem?.min || 0} min`,
      `Data: ${booking.date || 'Não escolhida'}`,
      `Horário: ${booking.time || 'Não escolhido'}`,
      `Local: ${placeLabel}`,
      `Endereço: ${address}`,
      ``,
      `Extras:\n${extras}`,
      ``,
      `Pagamento: ${booking.payment || 'Não escolhido'}`,
      `Total estimado: ${formatMoney(total, lang)}`,
      `Código: ${booking.bookingId}`,
    ].join('\n');
  }

  function buildWhatsAppUrl() {
    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(buildMessage())}`;
  }

  const clearDraft = useCallback(() => {
    localStorage.removeItem(CONFIG.STORAGE_KEY);
    window.location.reload();
  }, []);

  const stepTitles = [
    [T.stepService, T.stepServiceSub],
    [T.stepPlace, T.stepPlaceSub],
    [T.stepTime, T.stepTimeSub],
    [T.stepFinish, T.stepFinishSub],
  ];

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] pb-28 text-[var(--text)]">
      <GlobalStyles isDark={isDark} />
      <ToastContainer toasts={toasts} />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/88 px-5 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <button className="flex items-center gap-2" onClick={() => setStep(0)}>
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white"><Icon name="sparkles" size={19} /></span>
            <span className="text-sm font-bold leading-tight">{T.appName}</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="hidden rounded-2xl bg-[var(--surface-2)] px-4 py-2 text-xs font-bold text-[var(--muted)] sm:block">{T.language}</button>
            <button onClick={() => setMenuOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-2)] text-[var(--text)]" aria-label="Menu"><Icon name="menu" size={20} /></button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl">
        {step === 0 && (
          <section className="px-5 pb-4 pt-5 md:grid md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-8 md:py-10">
            <div>
              <p className="mb-2 text-[12px] font-bold uppercase tracking-[.16em] text-blue-500">Agendamento simples</p>
              <h1 className="text-[34px] font-bold leading-[1.08] md:text-5xl">{T.heroTitle}</h1>
              <p className="mt-3 max-w-md text-base text-[var(--muted)]">{T.heroSub}</p>
            </div>
            <div className="mt-5 overflow-hidden rounded-[32px] border border-[var(--border)] bg-[var(--surface)] md:mt-0">
              <img
                src={PHOTO_CONFIG.hero}
                alt="Thalyson Massagens"
                className="h-56 w-full object-cover md:h-80"
                onError={(event) => { event.currentTarget.style.display = 'none'; }}
              />
              <div className="p-5">
                <p className="text-sm font-bold">{user.ordersCount}+ clientes atendidos</p>
                <p className="mt-1 text-sm text-[var(--muted)]">Escolha em poucos toques. O resto eu confirmo com você no WhatsApp.</p>
              </div>
            </div>
          </section>
        )}

        <StepHeader step={step} title={stepTitles[step][0]} subtitle={stepTitles[step][1]} />

        {step === 0 && (
          <section className="animate-fade-up">
            <div className="px-5">
              <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--surface-2)] p-1">
                <button onClick={() => setActiveType('single')} className={cx('rounded-xl px-4 py-3 text-sm font-bold transition', activeType === 'single' ? 'bg-blue-600 text-white' : 'text-[var(--muted)]')}>{T.single}</button>
                <button onClick={() => setActiveType('pack')} className={cx('rounded-xl px-4 py-3 text-sm font-bold transition', activeType === 'pack' ? 'bg-blue-600 text-white' : 'text-[var(--muted)]')}>{T.plans}</button>
              </div>
            </div>
            <div className="scrollbar-hide flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:grid md:grid-cols-3 md:overflow-visible">
              {(activeType === 'single' ? DATA.services : DATA.plans).map((item) => (
                <ServiceCard
                  key={item.id}
                  item={item}
                  selected={selectedItem?.id === item.id}
                  lang={lang}
                  onSelect={selectItem}
                  onDetails={setDetailsItem}
                />
              ))}
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="animate-fade-up space-y-5 px-5">
            <InputField label={T.name} value={user.name} onChange={(value) => setUser((current) => ({ ...current, name: sanitizeInput(value) }))} placeholder="Ex: Thalyson" />

            <div className="grid gap-3 md:grid-cols-3">
              <ChoiceButton selected={booking.locationType === 'home'} title={T.home} desc={T.travelHint} icon="home" onClick={() => setBooking((current) => ({ ...current, locationType: 'home' }))} />
              <ChoiceButton selected={booking.locationType === 'studio'} title={T.studio} desc={T.studioHint} icon="building" onClick={() => setBooking((current) => ({ ...current, locationType: 'studio' }))} />
              <ChoiceButton selected={booking.locationType === 'hotel'} title={T.hotel} desc={T.travelHint} icon="hotel" onClick={() => setBooking((current) => ({ ...current, locationType: 'hotel' }))} />
            </div>

            {booking.locationType !== 'studio' && (
              <div className="grid gap-3 rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-4 md:grid-cols-2">
                <InputField label={T.cep} value={booking.address.cep} onChange={(value) => {
                  const masked = maskCEP(value);
                  updateAddress('cep', masked);
                  if (masked.replace(/\D/g, '').length === 8) fetchCEP(masked);
                }} placeholder={cepLoading ? 'Buscando...' : '00000-000'} inputMode="numeric" />
                <InputField label={T.street} value={booking.address.street} onChange={(value) => updateAddress('street', value)} />
                <InputField label={T.number} value={booking.address.number} onChange={(value) => updateAddress('number', value)} inputMode="numeric" />
                <InputField label={T.district} value={booking.address.district} onChange={(value) => updateAddress('district', value)} />
                <InputField label={T.city} value={booking.address.city} onChange={(value) => updateAddress('city', value)} />
                <InputField label={T.comp} value={booking.address.comp} onChange={(value) => updateAddress('comp', value)} />
              </div>
            )}
          </section>
        )}

        {step === 2 && (
          <section className="animate-fade-up space-y-6 px-5">
            <div>
              <p className="mb-3 text-sm font-bold text-[var(--muted)]">Dia</p>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
                {availableDays.map((date) => {
                  const value = toISODate(date);
                  const selected = booking.date === value;
                  const label = date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short', day: '2-digit', month: '2-digit' });
                  return (
                    <button key={value} onClick={() => setBooking((current) => ({ ...current, date: value }))} className={cx('min-w-[94px] rounded-2xl border px-4 py-3 text-center transition', selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]')}>
                      <span className="block text-sm font-bold capitalize">{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-[var(--muted)]">Horário</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {availableTimes.map((time) => {
                  const selected = booking.time === time;
                  const rush = RUSH_HOURS.includes(time);
                  return (
                    <button key={time} onClick={() => setBooking((current) => ({ ...current, time }))} className={cx('rounded-2xl border px-3 py-3 text-center text-sm font-bold transition', selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]')}>
                      {time}
                      {rush && <span className={cx('mt-1 block text-[10px]', selected ? 'text-white/80' : 'text-amber-500')}>+R$15</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="animate-fade-up space-y-5 px-5">
            <div className="rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-5">
              <h2 className="mb-4 text-xl font-bold">{T.summary}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Atendimento</span><strong className="text-right">{selectedItem?.title || '-'}</strong></div>
                <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Quando</span><strong className="text-right">{booking.date || '-'} às {booking.time || '-'}</strong></div>
                <div className="flex justify-between gap-4"><span className="text-[var(--muted)]">Local</span><strong className="text-right">{booking.locationType === 'home' ? T.home : booking.locationType === 'studio' ? T.studio : T.hotel}</strong></div>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-[var(--muted)]">{T.extras}</p>
              <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-1">
                {DATA.extras.map((extra) => {
                  const selected = Boolean(booking.extras[extra.id]);
                  return (
                    <button key={extra.id} onClick={() => toggleExtra(extra)} className={cx('min-w-[170px] rounded-[22px] border p-4 text-left transition', selected ? 'border-blue-500 bg-blue-600 text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]')}>
                      <Icon name={extra.icon} size={20} />
                      <strong className="mt-2 block text-sm font-bold">{extra.label}</strong>
                      <span className={cx('mt-1 block text-xs', selected ? 'text-white/80' : 'text-[var(--muted)]')}>{formatMoney(extra.price, lang)}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-bold text-[var(--muted)]">{T.payment}</p>
              <div className="grid gap-3">
                <ChoiceButton selected={booking.payment === 'pix'} title={T.pix} icon="copy" onClick={() => setBooking((current) => ({ ...current, payment: 'pix' }))} />
                <ChoiceButton selected={booking.payment === 'card'} title={T.card} icon="shield" onClick={() => setBooking((current) => ({ ...current, payment: 'card' }))} />
                <ChoiceButton selected={booking.payment === 'cash'} title={T.cash} icon="message" onClick={() => setBooking((current) => ({ ...current, payment: 'cash' }))} />
              </div>
            </div>

            <button onClick={() => setBooking((current) => ({ ...current, termsAccepted: !current.termsAccepted }))} className={cx('flex w-full items-center gap-3 rounded-[22px] border p-4 text-left', booking.termsAccepted ? 'border-emerald-500 bg-emerald-600 text-white' : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]')}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15"><Icon name={booking.termsAccepted ? 'check' : 'shield'} size={18} /></span>
              <span className="text-sm font-bold">{T.terms}</span>
            </button>

            <button onClick={() => setDetailsItem({ id: 'rules', type: 'single', title: T.rulesTitle, tag: '', desc: T.rulesText, details: T.rulesText, min: 0, price: 0, icon: 'shield' })} className="text-sm font-bold text-blue-500">Ver regras simples</button>
          </section>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/94 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <button onClick={goBack} disabled={step === 0} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] disabled:opacity-35" aria-label={T.back}>
            <Icon name="arrowLeft" />
          </button>
          <div className="min-w-0 flex-1 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[.12em] text-[var(--soft)]">{T.total}</p>
            <p className="truncate text-lg font-bold leading-tight">{formatMoney(total, lang)}</p>
          </div>
          <button onClick={goNext} className="flex h-14 shrink-0 items-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white active:scale-[.98]">
            {step === 3 ? T.send : T.next}
            <Icon name={step === 3 ? 'message' : 'arrowRight'} size={18} />
          </button>
        </div>
      </footer>

      {menuOpen && (
        <div className="fixed inset-0 z-[90]">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-[min(88vw,360px)] border-l border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{T.menu}</h2>
              <button onClick={() => setMenuOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-2)]"><Icon name="x" /></button>
            </div>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={() => setIsDark((current) => !current)}><Icon name={isDark ? 'moon' : 'sun'} size={18} /> {T.theme}</Button>
              <Button variant="secondary" className="w-full" onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')}>{T.language}</Button>
              <Button variant="secondary" className="w-full" onClick={() => window.open(CONFIG.INSTAGRAM_URL, '_blank', 'noopener,noreferrer')}><Icon name="instagram" size={18} /> Instagram</Button>
              <Button variant="secondary" className="w-full" onClick={clearDraft}>{T.restart}</Button>
            </div>
            <div className="mt-6 rounded-2xl bg-[var(--surface-2)] p-4 text-xs leading-relaxed text-[var(--muted)]">
              V27 preservada: <strong>{CONFIG.STORAGE_KEY}</strong>
            </div>
          </aside>
        </div>
      )}

      <CenterModal
        open={welcomeOpen}
        title={T.welcomeTitle}
        onClose={() => {
          setWelcomeOpen(false);
          setUser((current) => ({ ...current, hasSeenWelcome: true }));
        }}
        footer={
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => setWelcomeOpen(false)}>{T.notNow}</Button>
            <Button onClick={claimGift}><Icon name="gift" size={18} /> {T.gift}</Button>
          </div>
        }
      >
        <p>{T.welcomeText}</p>
      </CenterModal>

      <CenterModal open={Boolean(detailsItem)} title={detailsItem?.title || T.details} onClose={() => setDetailsItem(null)} footer={<Button className="w-full" onClick={() => setDetailsItem(null)}>Entendi</Button>}>
        <p>{detailsItem?.details}</p>
      </CenterModal>

      <CenterModal open={successOpen} title={T.successTitle} onClose={() => setSuccessOpen(false)} footer={<Button variant="whatsapp" className="w-full" onClick={() => window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer')}><Icon name="message" size={18} /> {T.openWhatsapp}</Button>}>
        <p>{T.successText}</p>
      </CenterModal>
    </div>
  );
}
