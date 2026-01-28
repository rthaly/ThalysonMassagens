import React, { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  ChevronRight, Lock, History, User, Wallet, Share2, Copy
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v7.1 - AUTOMATION & VALIDATION EDITION
 * ==================================================================================
 * Changelog v7.1:
 * - [NEW] Auto-Open WhatsApp on Finish
 * - [NEW] Validation Toasts (Botão nunca bloqueia, avisa o erro)
 * - [FIX] Fluxo de navegação mais fluido
 */

// ==================================================================================
// 1. CONFIGURAÇÕES GLOBAIS & CONSTANTES DE NEGÓCIO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_ultimate_v7_1_db',
  APP_VERSION: '7.1.0-release',
  CURRENCY: 'BRL',
  LOCALE: 'pt-BR'
};

const THEME = {
  colors: {
    primary: 'amber', 
    bg_dark: 'bg-zinc-950',
    bg_light: 'bg-slate-50',
    card_dark: 'bg-zinc-900',
    card_light: 'bg-white',
    border_dark: 'border-zinc-800',
    border_light: 'border-slate-200'
  }
};

// ==================================================================================
// 2. DESIGN SYSTEM (COMPONENTES REUTILIZÁVEIS UI/UX)
// ==================================================================================

// 2.1 Botão Universal com Variantes
const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-2xl";
  
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 border border-amber-400",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",
    outline: "bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    whatsapp: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 border border-green-500/20",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
  };

  const sizes = {
    sm: "h-9 text-xs px-3",
    md: "h-12 text-sm px-6",
    lg: "h-14 text-base px-8",
    xl: "h-16 text-lg px-8"
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading} 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}
    >
      {loading ? <Loader2 size={18} className="animate-spin mr-2"/> : (Icon && <Icon size={18} className="mr-2" strokeWidth={2.5} />)}
      {children}
    </button>
  );
};

// 2.2 Input Field com Validação Visual
const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-600 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>
        {Icon && <Icon size={18} />}
      </div>
      <input 
        type={type}
        value={value} 
        onChange={onChange} 
        placeholder={placeholder}
        className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-sm font-medium transition-all
        ${error 
          ? 'border-red-500 focus:border-red-500 bg-red-500/5' 
          : (isDark 
              ? 'bg-zinc-900 border-zinc-800 text-white focus:border-amber-500 focus:bg-zinc-900' 
              : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500')}`} 
      />
    </div>
    {error && <p className="text-red-500 text-[10px] font-bold ml-1 animate-slide-in">{error}</p>}
  </div>
);

// 2.3 Card Component (Glassmorphism)
const Card = ({ children, isDark, className = '', onClick, active = false, border = false }) => (
  <div onClick={onClick} className={`
    relative p-5 rounded-3xl transition-all duration-300
    ${onClick ? 'cursor-pointer active:scale-[0.98] hover:translate-y-[-2px]' : ''}
    ${isDark 
      ? `bg-zinc-900/80 backdrop-blur-md ${border ? 'border border-zinc-800' : ''} ${active ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500/50' : ''}` 
      : `bg-white ${border ? 'border border-slate-200 shadow-sm' : ''} ${active ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-500/50' : ''}`}
    ${className}
  `}>
    {children}
  </div>
);

// 2.4 Toast Notification System (Context)
const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl animate-slide-down border backdrop-blur-xl
            ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 
              t.type === 'error' ? 'bg-red-500/90 text-white border-red-400' : 
              'bg-zinc-800/90 text-white border-zinc-700'}`}>
            {t.type === 'success' ? <Check size={18} strokeWidth={3}/> : <AlertTriangle size={18} strokeWidth={3}/>}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// 2.5 Confetti Engine
const Confetti = ({ active }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#fbbf24', '#ffffff', '#3b82f6'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        w: Math.random() * 10 + 5,
        h: Math.random() * 5 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 3 + 2,
        angle: Math.random() * 360
      });
    }

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += 2;
        if (p.y > canvas.height) p.y = -10;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [active]);

  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
};

// ==================================================================================
// 3. DATA LAYER
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 12, title: isPT ? "Visitante" : "Beginner", color: "text-zinc-400", bg: "bg-zinc-500" },
            { level: 2, xpNeeded: 400, reward: 20, title: isPT ? "Cliente Bronze" : "Bronze", color: "text-orange-400", bg: "bg-orange-500" },
            { level: 3, xpNeeded: 1000, reward: 30, title: isPT ? "Cliente Prata" : "Silver", color: "text-slate-300", bg: "bg-slate-300" },
            { level: 4, xpNeeded: 2000, reward: 50, title: isPT ? "Membro VIP" : "Gold VIP", color: "text-amber-400", bg: "bg-amber-500" }
        ],

        services: [
            { 
              id: 'relaxante', 
              min: 60, 
              price: 90, 
              icon: Wind, 
              tag: "CLÁSSICA",
              title: isPT ? "Relaxante (Rolos de Madeira)" : "Wood Relax",
              desc: isPT ? "Para soltar as costas e tirar o cansaço." : "Pain relief with wood rollers.",
              details: isPT ? `COMO É A SESSÃO?
• TÉCNICA: Uso meus rolos de madeira para soltar suas costas e pernas.
• SEM DOR: É para relaxar, não para machucar. Deslizo a madeira para tirar o peso do corpo.
• FINALIZAÇÃO: Termino com as mãos para garantir que relaxou tudo.
⚠️ Obs: Massagem focada em tirar dor e cansaço.` : "Wood therapy focused on relaxation."
            },
            { 
              id: 'sensitiva', 
              min: 60, 
              price: 160, 
              icon: Flame, 
              tag: "INTENSA",
              title: isPT ? "Sensitiva Tântrica (+ Lingam)" : "Tantric Sensitive",
              desc: isPT ? "Começa Relaxante e termina com Lingam." : "Relax + Sensitive + Happy Ending.",
              details: isPT ? `O QUE ROLA NESSA SESSÃO:
• INÍCIO: Começo tirando a tensão do seu corpo (manual ou rolos).
• SENSORIAL: Depois uso toques bem leves (ponta dos dedos) para te dar arrepios.
• LINGAM: Inclui a massagem na parte íntima (pênis e testículos).
• OBJETIVO: Te dar o máximo de prazer.
• FINALIZAÇÃO: Manual inclusa (com bastante óleo).` : "Starts with relaxing, moves to sensory touches and includes Lingam Massage."
            },
            { 
              id: 'mista', 
              min: 60, 
              price: 200, 
              icon: Zap, 
              tag: "PREMIUM",
              title: isPT ? "Experiência Mista Completa" : "Full Experience",
              desc: isPT ? "O combo total (Relax + Corpo a Corpo + Finalização)." : "The perfect balance.",
              details: isPT ? `A MAIS COMPLETA (60min):
• TÉCNICA: Começa com a massagem relaxante para soltar os músculos.
• INTENSIDADE: Aumento para a sensitiva e entro no corpo a corpo (Body to Body).
• LINGAM: Fecho com a tântrica caprichada.
• FINAL: Você goza no final, sem pressa.` : "Complete experience: Relaxing + Body to Body + Lingam."
            }
        ],

        plans: [
            {
                id: 'pack_relax',
                type: 'pack',
                title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4x)",
                price: 320, 
                fullPrice: 360,
                savings: 40,
                details: isPT ? "Ideal para tratamento de dores. 4 sessões de Relaxante com Rolos." : "4 Relax Sessions.",
                tag: "ECONOMIA",
                icon: Package,
                color: 'blue'
            },
            {
                id: 'pack_mista',
                type: 'pack',
                title: isPT ? "Pack Mista (3 Sessões)" : "Full Pack (3x)",
                price: 540, 
                fullPrice: 600,
                savings: 60,
                details: isPT ? "O melhor custo benefício pra quem gosta da completa. 3 sessões Mistas." : "3 Full Experience Sessions.",
                tag: "POPULAR",
                icon: Zap,
                color: 'amber'
            },
            {
                id: 'vip_club',
                type: 'subscription',
                title: isPT ? "Clube VIP Mensal" : "VIP Monthly",
                price: 350, 
                fullPrice: 450, 
                savings: 100,
                details: isPT ? "2 Sessões Mistas/mês + Prioridade na Agenda + Desconto em Extras." : "2 Sessions + Priority.",
                tag: "ASSINATURA",
                icon: Crown,
                color: 'purple'
            }
        ],

        extras: [
            { 
              id: 'more_time', 
              price: 55, 
              icon: Clock, 
              label: isPT ? "+30 Minutos" : "+30 Minutes",
              desc: isPT ? "Pra curtir sem pressa." : "More time."
            },
            { 
              id: 'touch', 
              price: 55, 
              icon: Heart, 
              label: isPT ? "Troca (Você Toca)" : "You Touch",
              desc: isPT ? "Liberado tocar no massagista." : "You can touch."
            },
            { 
              id: 'aroma', 
              price: 5, 
              icon: Wind,
              label: isPT ? "Aromaterapia" : "Aromatherapy",
              desc: isPT ? "Essência pra relaxar." : "Scents."
            }
        ],

        reviews: [
            { n: "Eduardo (Londrina)", t: "Tava no hotel perto do shopping Catuaí, ele veio rápido. Discreto, curti.", s: 5, d: "2 dias atrás" },
            { n: "Júnior (Bela Vista SP)", t: "Subiu aqui no meu apê sem frescura. O moleque tem pegada.", s: 5, d: "1 semana atrás" },
            { n: "Anônimo (Santa Fé)", t: "Conheço ele de vista da cidade, não sabia que fazia massagem assim. Surpreendeu.", s: 5, d: "3 semanas atrás" },
            { n: "M. (Jales)", t: "Marquei num motel na saída pra Santa Fé. Foi intenso, tremi tudo.", s: 5, d: "1 mês atrás" },
            { n: "Ricardo (SP)", t: "Tava na paulista a trabalho, foi a melhor coisa pra relaxar.", s: 5, d: "1 mês atrás" },
            { n: "Gustavo", t: "Sem frescura de clínica. É massagem de verdade, direto ao ponto.", s: 5, d: "2 meses atrás" },
            { n: "Felipe (Londrina)", t: "Levou a maca no hotel, montou rapidinho. O óleo que ele usa é bom.", s: 5, d: "2 meses atrás" },
            { n: "André (Santa Fé)", t: "Os rolos de madeira são top, tirou a dor das costas. E o final... pqp.", s: 5, d: "3 meses atrás" },
            { n: "Lucas (Jardins)", t: "Paguei pra tocar nele e valeu a pena. Pele lisinha.", s: 5, d: "3 meses atrás" },
            { n: "Beto (Rio Preto)", t: "Vim pra região e marquei. Jorrei longe, fazia tempo que não gozava assim.", s: 5, d: "4 meses atrás" },
            { n: "Carlos (Casado)", t: "Discreto demais. Ninguém percebeu nada. Recomendo pra quem quer sigilo.", s: 5, d: "5 meses atrás" },
            { n: "Bruno", t: "De cueca branca... visual nota 1000. Fiquei doido.", s: 5, d: "6 meses atrás" },
            { n: "Rafa (Centro SP)", t: "Moro em kitnet pequena e deu certo. Ele se vira nos 30.", s: 5, d: "6 meses atrás" },
            { n: "M. (Sigilo)", t: "Gostei que ele respeita, mas provoca na medida certa.", s: 5, d: "7 meses atrás" },
            { n: "Paulo (Votuporanga)", t: "A mão dele é quente, macia mas firme. Sabe o que faz.", s: 5, d: "8 meses atrás" },
            { n: "Sérgio", t: "Simples e objetivo. Do jeito que homem gosta.", s: 5, d: "9 meses atrás" },
            { n: "Curioso", t: "Primeira vez que fiz com homem. Me deixou super a vontade.", s: 5, d: "10 meses atrás" },
            { n: "Fernando (Londrina)", t: "Veio no Ibis. Salvou minha noite.", s: 5, d: "11 meses atrás" },
            { n: "G. (Jales)", t: "Massagem top, valeu a vinda.", s: 5, d: "1 ano atrás" },
            { n: "Pedro", t: "O corpo a corpo é sacanagem de bom. Recomendo a mista.", s: 5, d: "1 ano atrás" }
        ],
        
        text: {
            // UI Strings
            loading: isPT ? "INICIANDO SISTEMA..." : "LOADING...",
            welcome: isPT ? "Bem-vindo," : "Welcome,",
            subtitle: isPT ? "Sua experiência começa aqui." : "Your experience starts here.",
            tab_single: isPT ? "Sessão Avulsa" : "Single",
            tab_packs: isPT ? "Planos VIP" : "VIP Plans",
            
            // Buttons & Labels
            reviews_btn: isPT ? "Ver relatos reais (+20)" : "Real Reviews",
            select_time_title: isPT ? "Agendamento" : "Scheduling",
            date_sub: isPT ? "Selecione o melhor horário:" : "Select time:",
            location_title: isPT ? "Definir Local" : "Set Location",
            
            // Forms
            input_name: isPT ? "Como te chamo?" : "Your Name",
            input_addr: isPT ? "Endereço Completo" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Comp. (Apt, Bloco)" : "Unit/Apt",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Quarto" : "Room",
            motel_note: isPT ? "Motel: Envie o nome e a suíte pelo WhatsApp após confirmar." : "Motel: Send details on WhatsApp.",
            
            // Payment
            pay_title: isPT ? "Pagamento" : "Payment",
            pay_pix: "Pix (Instantâneo)",
            pay_card: isPT ? "Cartão (Crédito/Débito)" : "Card",
            pay_cash: isPT ? "Dinheiro (Presencial)" : "Cash",
            
            // Extras & Checkout
            extras_title: isPT ? "Turbinar Sessão?" : "Add-ons",
            coupon_title: isPT ? "Aplicar Cupom" : "Coupons",
            coupon_placeholder: isPT ? "Digite o código..." : "Enter code...",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            remove: isPT ? "Remover" : "Remove",
            total_label: "Total Estimado",
            book_btn: isPT ? "Gerar Pedido" : "Generate Order",
            next_btn: isPT ? "Continuar" : "Continue",
            uber_note: isPT ? "Inclui Taxa de Deslocamento (Uber)" : "Includes Uber Fee",
            
            // Success
            success_title: isPT ? "Pedido Gerado!" : "Done!",
            success_sub: isPT ? "O app abriu seu WhatsApp para confirmar. Se não abriu, clique no botão abaixo." : "Send msg on WhatsApp.",
            whatsapp_btn: isPT ? "Abrir WhatsApp" : "Send Now ➔",
            back_home: isPT ? "Voltar ao Início" : "Back Home",
            
            // Misc
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            level_next: isPT ? "Próximo Nível:" : "Next Level:",
            level_label: isPT ? "Status" : "Status",
            empty_date: isPT ? "Selecione uma data no calendário acima" : "Select a date",
            empty_slots: isPT ? "Agenda lotada neste dia." : "Full booked.",
            details_label: isPT ? "O QUE ESTÁ INCLUSO:" : "INCLUDED:",
            security_note: isPT ? "Seus dados ficam salvos apenas no seu celular." : "Data saved locally.",
            
            // Popups
            popup_welcome_title: isPT ? "PRESENTAÇO!" : "Welcome Gift!",
            popup_welcome_msg: isPT ? "Para começarmos bem, liberei um cupom de desconto de primeira vez para você." : "You got a coupon.",
            popup_level_title: isPT ? "LEVEL UP!" : "LEVEL UP!",
            popup_level_msg: isPT ? "Sua fidelidade compensa. Você subiu de nível e desbloqueou benefícios." : "Congrats! You got a NEW COUPON.",
            popup_btn_coupon: isPT ? "RESGATAR AGORA" : "REDEEM NOW",
            
            // Terms
            agree_terms: isPT ? "Li e concordo com as regras de higiene e respeito." : "I agree.",
            terms_body: isPT ? [
              "1. HIGIENE ESSENCIAL: Por favor, tome banho antes da sessão.",
              "2. SIGILO TOTAL: O que acontece na sessão, fica na sessão.",
              "3. RESPEITO MÚTUO: Sem agressividade ou exigências fora do combinado.",
              "4. PAGAMENTO: Deve ser realizado ao final do atendimento."
            ] : ["1. Hygiene.", "2. Secrecy.", "3. Respect.", "4. Payment."],
            terms_title: isPT ? "Protocolo de Atendimento" : "Rules",
            terms_link: isPT ? "Ler Regras" : "Rules",
            terms_btn: isPT ? "Entendido" : "Ok",
        
            // WhatsApp Message Builder
            zap: {
              intro: isPT ? "E aí Thalyson! Vim pelo App." : "Hi Thalyson!",
              section_serv: isPT ? "🔥 *QUERO AGENDAR:*" : "🔥 *SERVICE*",
              section_plan: isPT ? "🏆 *QUERO O PLANO:*" : "🏆 *I WANT PACK:*",
              section_det: isPT ? "📝 *RESUMO:*" : "📝 *DETAILS*",
              section_loc: isPT ? "📍 *LOCALIZAÇÃO:*" : "📍 *LOCATION*",
              section_fin: isPT ? "💰 *INVESTIMENTO:*" : "💰 *VALUES*",
              map_link: isPT ? "🗺️ *Abrir Mapa:*" : "🗺️ *Map:*",
              wait: isPT ? "Aguardo sua confirmação!" : "Waiting confirm.",
              house: isPT ? "Residência" : "Home",
              hotel: "Hotel",
              motel: "Motel"
            },
            
            scarcity_msg: isPT ? "pessoas vendo a agenda agora" : "people booking"
        }
    };
};

// ==================================================================================
// 4. MAIN APPLICATION ORCHESTRATOR
// ==================================================================================

export default function App() {
  // --- STATE MANAGEMENT ---
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  
  // Marketing & UX States
  const [viewers, setViewers] = useState(0);
  const [showScarcity, setShowScarcity] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  
  const scrollRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  // Data Loading
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;
  const { addToast } = useToast();

  // User Persisted Data
  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  // Current Session Booking Data
  const [booking, setBooking] = useState({
    type: 'single', // 'single' | 'pack' | 'subscription'
    item: null, 
    extras: {}, 
    date: null, 
    time: null, 
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null,
    termsAccepted: false
  });

  // --- ENGINE: LIFECYCLE & LOGIC ---

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2500);

    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            setUser(JSON.parse(s));
        } else {
            setUser(p => ({...p, coupons: [{ id: 'WELCOME10', val: 10, title: '🎁 Boas Vindas', code: 'WELCOME10' }]}));
        }
    } catch (e) {
        console.warn("Storage access denied");
    }
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 1500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  useEffect(() => { 
      if(isClient && !loading) {
          try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch(e) {}
      }
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // Marketing: Escassez Artificial (Randomizada)
  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 4) + 3; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 4000);
  };

  // Engine: Geração de Horários Dinâmicos
  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'];
      
      const now = new Date();
      const selectedDate = new Date(booking.date);
      const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();

      if (isToday) {
          const currentHour = now.getHours();
          return slots.filter(time => {
              const [hour] = time.split(':').map(Number);
              return hour > currentHour + 1; // Mínimo 1h de antecedência
          });
      }
      return slots;
  }, [booking.date]);

  // Engine: Calculadora Financeira
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, extrasTotal: 0 };
    
    let sub = booking.item.price;
    let extrasTotal = 0;
    
    if (booking.type === 'single') {
        Object.keys(booking.extras).forEach(k => { 
            if(booking.extras[k]) {
                const exPrice = DATA.extras.find(e=>e.id===k).price;
                sub += exPrice; 
                extrasTotal += exPrice;
            }
        });
    }
    
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    
    return { sub, disc, total, extrasTotal };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras, booking.type]);

  // --- ACTION: WHATSAPP GENERATOR (Separado para poder chamar no finish) ---
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date.toLocaleDateString('pt-BR');
    
    // Endereço Formatado
    let locTxt = "";
    let mapQuery = "";
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `🏠 *${T.zap.house}:* \n${fullAddr}\n📝 *Comp:* ${booking.address.comp || 'N/A'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 *${T.zap.motel}:* Definirei no chat.`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `🏨 *${T.zap.hotel}:* \n${fullAddr}\n🚪 *Quarto:* ${booking.address.comp || 'N/A'}`;
        mapQuery = fullAddr;
    }
    
    // Extras List
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return `✅ + ${ext.label}`;
    }).join('\n');

    // Header Dinâmico
    const header = booking.type === 'pack' || booking.type === 'subscription' ? T.zap.section_plan : T.zap.section_serv;

    const msg = `
${T.zap.intro} *${user.name}*

${header}
💆‍♂️ *${booking.item.title.toUpperCase()}*
📅 *${dateStr}* às *${booking.time}*

${extrasList ? `${T.zap.section_det}\n${extrasList}\n` : ''}
${T.zap.section_loc}
${locTxt}
${mapQuery ? `\n${T.zap.map_link} https://maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}

${T.zap.section_fin}
💰 Total: ${T.currency} ${f.total},00
💳 Forma: *${booking.payment.toUpperCase()}*
${f.disc > 0 ? `🎟️ Cupom aplicado: -R$${f.disc}` : ''}
🚗 *${T.uber_note}*

🔐 *Termos:* Li e Aceito.

${T.zap.wait}
`.trim();

    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  // --- ACTION: VALIDATION & NAVIGATION ---
  
  const validateStep = () => {
      // Step 0: Service
      if (step === 0) {
          if(!booking.item) {
              addToast("Selecione um serviço ou plano para continuar!", "error");
              return false;
          }
          return true;
      }

      // Step 1: Date & Time
      if (step === 1) {
          if (!booking.date) {
              addToast("Por favor, selecione um dia na agenda.", "error");
              return false;
          }
          if (!booking.time) {
              addToast("Selecione um horário disponível.", "error");
              return false;
          }
          return true;
      }

      // Step 2: Location & Details
      if (step === 2) {
          if (!user.name || user.name.trim().length < 3) { 
              addToast("Como devo te chamar? Preencha seu nome.", "error");
              return false; 
          }
          
          if (booking.locationType === 'home') {
              if(!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) {
                  addToast("Preencha o endereço completo (Rua, Nº, Bairro, Cidade).", "error");
                  return false;
              }
          }
          
          if (booking.locationType === 'hotel') {
              if(!booking.address.placeName || !booking.address.city) {
                  addToast("Informe o nome do Hotel e a Cidade.", "error");
                  return false;
              }
          }
          return true;
      }

      // Step 3: Checkout
      if (step === 3) {
          if (!booking.payment) { 
              addToast("Selecione como deseja pagar.", "error");
              return false; 
          }
          if (!booking.termsAccepted) { 
              addToast("Você precisa aceitar os termos de atendimento.", "error");
              return false; 
          }
          return true;
      }
      
      return true;
  };

  const handleNextStep = () => {
      if(validateStep()) {
          if (step === 3) {
              finishBooking();
          } else {
              setStep(s => s + 1);
          }
      }
  };

  // Action: Aplicar Cupom
  const handleApplyCoupon = () => {
      if(!couponInput) return;
      const code = couponInput.toUpperCase();
      if(code === 'THALYSON10' || code === 'VIP20' || code === 'WELCOME10') {
          const val = code === 'VIP20' ? 20 : 10;
          const newCoupon = { id: code, val, title: `🎟️ Código ${code}`, code };
          setBooking(b => ({...b, appliedCoupon: newCoupon}));
          addToast("Cupom aplicado com sucesso!", "success");
          setCouponInput('');
      } else {
          addToast("Cupom inválido ou expirado.", "error");
      }
  };

  // Action: Finalizar Pedido
  const finishBooking = () => {
    // 1. Atualizar XP e Níveis
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon && booking.appliedCoupon.id.includes('WELCOME')) {
        updatedCoupons = updatedCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    }
    
    // XP Logic
    const xpBase = financials.total;
    const xpMultiplier = booking.type === 'pack' ? 1.5 : 1;
    const xpGain = Math.floor(xpBase * xpMultiplier * 0.1); 
    
    const oldXP = user.xp;
    const newXP = Math.floor(oldXP + xpGain);
    
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && oldXP < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ 
                id: `LVL${lvl.level}_${Date.now()}`, 
                val: lvl.reward, 
                title: `🏆 Recompensa Nível ${lvl.title}`,
                code: `LVLUP${lvl.level}`
            });
        }
    });

    if (leveledUp) setLevelUpPopup(true);
    
    setUser(prev => ({ 
        ...prev, 
        xp: newXP, 
        coupons: updatedCoupons,
        ordersCount: prev.ordersCount + 1
    }));
    
    setShowConfetti(true);
    
    // AUTO OPEN WHATSAPP (FEATURE NOVA)
    const zapLink = generateWhatsAppLink();
    window.open(zapLink, '_blank');
    
    setStep(4);
  };

  // --- RENDERING ---

  if (loading) return <LoadingScreen isDark={isDark} text={T.loading} />;
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <ToastProvider>
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <Confetti active={showConfetti} />

      {/* COMPONENT: SCARCITY POPUP */}
      <div className={`fixed top-24 right-4 z-[90] pointer-events-none transition-all duration-500 transform ${showScarcity ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
           <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 backdrop-blur-md">
               <Eye size={16} className="animate-pulse" />
               <span className="text-xs font-bold tracking-wide">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      {/* COMPONENT: HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/20">TM</div>
          <div>
              <span className="font-bold text-sm tracking-tight block">Thalyson</span>
              <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Massagens</span>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white' : 'bg-pink-100 text-pink-600'}`}><Instagram size={18}/></a>
        </div>
      </header>

      {/* COMPONENT: MAIN CONTENT AREA */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        <div className={`fixed top-16 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>

        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* === STEP 0: CATALOG (SERVICES & PLANS) === */}
          {step === 0 && (
            <div className="animate-fade-in">
              {/* Profile Header */}
              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                    <h1 className="text-3xl font-black tracking-tight">{T.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h1>
                </div>
                <p className={`text-sm mb-6 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                <LevelCard xp={user.xp} isDark={isDark} levels={DATA.levels} text={T} />
                
                <Button variant="secondary" full size="sm" onClick={() => setReviewsOpen(true)} icon={Star}>
                   {T.reviews_btn}
                </Button>
              </div>

              {/* Tabs Switcher */}
              <div className={`grid grid-cols-2 p-1.5 rounded-2xl mb-8 relative ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}>
                      <LayoutList size={14}/> {T.tab_single}
                  </button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}>
                      <Package size={14}/> {T.tab_packs}
                  </button>
              </div>

              {/* List: Single Services */}
              {activeTab === 'single' && (
                  <div className="space-y-4 animate-slide-in">
                    {DATA.services.map(s => (
                      <Card key={s.id} isDark={isDark} active={booking.item?.id === s.id} onClick={() => setBooking(b => ({ ...b, type: 'single', item: s }))}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl transition-colors ${booking.item?.id === s.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={26}/></div>
                            <div className="text-right">
                               <span className="block text-2xl font-black tracking-tight">{T.currency} {s.price}</span>
                               <span className="text-[10px] uppercase font-bold opacity-50 flex items-center justify-end gap-1"><Clock size={10}/> {s.min} min</span>
                            </div>
                          </div>
                          
                          <div className="mb-2">
                              {s.tag && <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-300 mb-2 uppercase tracking-wider">{s.tag}</span>}
                              <h3 className="font-bold text-lg leading-tight">{s.title}</h3>
                          </div>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                          
                          {booking.item?.id === s.id && (
                              <div className={`mt-4 p-4 rounded-xl text-xs leading-relaxed animate-fade-in border ${isDark ? 'bg-black/40 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                 <div className="flex items-center gap-2 font-bold mb-2 text-amber-500"><Info size={12}/> {T.details_label}</div>
                                 <p className="whitespace-pre-line">{s.details}</p>
                              </div>
                          )}
                      </Card>
                    ))}
                  </div>
              )}

              {/* List: Packs & Plans */}
              {activeTab === 'packs' && (
                  <div className="space-y-4 animate-slide-in">
                      {DATA.plans.map(plan => (
                          <Card key={plan.id} isDark={isDark} active={booking.item?.id === plan.id} onClick={() => setBooking(b => ({ ...b, type: plan.type, item: plan }))} className="overflow-hidden">
                              {plan.tag && (
                                  <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10">
                                      {plan.tag}
                                  </div>
                              )}
                              
                              <div className="flex items-center gap-4 mb-4 relative z-0">
                                  <div className={`p-4 rounded-2xl ${booking.item?.id === plan.id ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}>
                                      <plan.icon size={28}/>
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-xl leading-none mb-1">{plan.title}</h3>
                                      <p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{plan.type === 'pack' ? 'Pacote' : 'Mensal'}</p>
                                  </div>
                              </div>
                              
                              <p className={`text-sm mb-5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{plan.details}</p>

                              <div className="flex items-end gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                  <span className="text-2xl font-black text-amber-500">{T.currency} {plan.price}</span>
                                  <span className="text-sm line-through opacity-40 mb-1 decoration-red-500">{T.currency} {plan.fullPrice}</span>
                                  <span className="text-xs text-green-500 font-bold mb-1 ml-auto bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Economia {T.currency}{plan.savings}</span>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* === STEP 1: DATE & TIME === */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold mb-1">{T.select_time_title}</h2>
                 <p className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>

              {/* Date Scroller */}
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-4">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); 
                  d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  
                  let lbl = d.toLocaleDateString(CONFIG.LOCALE, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; 
                  if(i===1) lbl=T.tomorrow;

                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                      className={`min-w-[76px] h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 active:scale-95 duration-200
                      ${isSel 
                        ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105' 
                        : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-400')}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{lbl}</span>
                      <span className="text-2xl font-black">{d.getDate()}</span>
                      {isSel && <span className="w-1.5 h-1.5 rounded-full bg-black mt-1 animate-pulse"></span>}
                    </button>
                  )
                })}
              </div>
              
              {/* Empty State */}
              {!booking.date && (
                   <div className="text-center py-12 opacity-30 border-2 border-dashed border-zinc-700 rounded-3xl mx-2">
                       <Calendar size={40} className="mx-auto mb-4 opacity-50"/>
                       <p className="text-sm font-bold">{T.empty_date}</p>
                   </div>
              )}

              {/* Slots Grid */}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }}
                           className={`py-4 rounded-xl text-sm font-bold border transition-all active:scale-95 duration-200 relative overflow-hidden group
                           ${booking.time === t 
                               ? 'bg-white text-black border-white shadow-xl scale-[1.02]' 
                               : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:bg-slate-50')}`}
                       >
                           <span className="relative z-10">{t}</span>
                           {booking.time === t && <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white opacity-50"></div>}
                       </button>
                   ))}
                </div>
              )}
              
              {booking.date && generateTimeSlots.length === 0 && (
                   <div className="text-center py-10 opacity-50 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                       <p className="text-sm font-bold">{T.empty_slots}</p>
                       <p className="text-xs mt-1">{T.try_tomorrow}</p>
                   </div>
              )}
            </div>
          )}

          {/* === STEP 2: LOCATION & DETAILS === */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-bold text-center mb-8">{T.location_title}</h2>
              
              {/* Location Type Switcher */}
              <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-2xl mb-8 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} 
                        className={`py-4 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300
                        ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow-md' : 'bg-white text-black shadow-md') : 'opacity-40 hover:opacity-100'}`}>
                        <x.i size={20} strokeWidth={2.5}/> {x.l}
                    </button>
                 ))}
              </div>

              <div className="space-y-5">
                 <InputField 
                    label={T.input_name} 
                    value={user.name} 
                    onChange={e=>setUser(u=>({...u, name: e.target.value}))} 
                    icon={User} 
                    isDark={isDark}
                    placeholder="Seu Nome"
                 />

                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_90px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} isDark={isDark} icon={MapPin} placeholder="Rua/Av" />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} isDark={isDark} placeholder="123" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} isDark={isDark} placeholder="Bairro" />
                        <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder="Cidade" />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} placeholder="Apt 101" />
                        </div>
                     </div>
                 )}
                 
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} isDark={isDark} icon={Building} placeholder="Nome do Hotel" />
                        <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder="Cidade" />
                        <InputField label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} icon={Lock} placeholder="Número do Quarto" />
                    </div>
                 )}

                 {booking.locationType === 'motel' && (
                    <div className={`p-6 rounded-3xl border text-center text-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Smartphone className="opacity-50" size={20}/>
                        </div>
                        {T.motel_note}
                    </div>
                 )}
              </div>

              {/* Extras Selector (Only for Single) */}
              {booking.type === 'single' && (
                  <div className="pt-8 border-t border-dashed border-zinc-800/50 mt-8">
                     <h3 className={`text-[10px] font-bold uppercase mb-4 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} 
                                className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] duration-200
                                ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/50' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                              <div className="flex items-center gap-4">
                                 <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
                                 <div>
                                     <p className="text-sm font-bold">{ex.label}</p>
                                     <p className="text-[10px] opacity-60">{ex.desc}</p>
                                 </div>
                              </div>
                              <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-amber-500' : 'opacity-30'}`}>+ {T.currency} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* === STEP 3: CHECKOUT === */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               {/* Receipt Card */}
               <div className="relative">
                   {/* Receipt jagged edge (CSS trick simulation) */}
                   <div className={`p-6 rounded-t-[2rem] rounded-b-xl border-t border-x shadow-2xl relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                      {/* Decorative Gold Bar */}
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600"></div>

                      <div className="flex justify-between items-start mb-6 mt-2">
                          <div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded mb-2 inline-block ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
                                  {booking.type === 'pack' ? 'Pacote' : (booking.type === 'subscription' ? 'Assinatura' : 'Sessão Individual')}
                              </span>
                              <h2 className="font-black text-2xl leading-tight text-amber-500">{booking.item.title}</h2>
                              <p className="text-xs opacity-60 mt-1">{booking.date?.toLocaleDateString()} às {booking.time}</p>
                          </div>
                      </div>
                      
                      {/* Line Items */}
                      <div className="space-y-3 border-b border-dashed border-zinc-700/50 pb-6 mb-6">
                          <div className="flex justify-between text-sm">
                              <span>Valor Base</span>
                              <span>{T.currency} {booking.item.price}</span>
                          </div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                              <div key={k} className="flex justify-between text-sm opacity-60">
                                  <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                                  <span>{DATA.extras.find(e=>e.id===k).price}</span>
                              </div>
                          ))}
                          {booking.appliedCoupon && (
                              <div className="flex justify-between text-sm text-green-500 font-bold bg-green-500/5 p-2 rounded-lg">
                                  <span>Cupom ({booking.appliedCoupon.code})</span>
                                  <span>- {T.currency} {booking.appliedCoupon.val}</span>
                              </div>
                          )}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-end">
                          <div>
                              <span className="text-[10px] font-bold uppercase opacity-50 block mb-1">{T.total_label}</span>
                              <span className="text-[10px] font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{T.uber_note}</span>
                          </div>
                          <span className="text-4xl font-black tracking-tighter text-white">{T.currency} {financials.total}</span>
                      </div>
                   </div>
                   
                   {/* Jagged Bottom */}
                   <div className="h-4 w-full bg-repeat-x bg-[length:20px_20px] opacity-10" 
                        style={{
                            backgroundImage: `linear-gradient(45deg, transparent 33.333%, ${isDark?'#fff':'#000'} 33.333%, ${isDark?'#fff':'#000'} 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, ${isDark?'#fff':'#000'} 33.333%, ${isDark?'#fff':'#000'} 66.667%, transparent 66.667%)`,
                            backgroundSize: '20px 40px',
                            backgroundPosition: '0 -20px'
                        }}>
                   </div>
               </div>

               {/* Coupon Input */}
               <div className="mt-6 flex gap-2">
                   <div className="relative flex-1">
                       <input 
                         value={couponInput}
                         onChange={e=>setCouponInput(e.target.value)}
                         placeholder={T.coupon_placeholder}
                         className={`w-full pl-4 pr-4 py-3 rounded-xl border outline-none text-sm font-bold uppercase tracking-widest ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}
                       />
                       <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">
                       {T.coupon_btn}
                   </Button>
               </div>
               
               {/* Available Coupons Horizontal Scroll */}
               {user.coupons.length > 0 && (
                   <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       {user.coupons.map(c => {
                           const isApplied = booking.appliedCoupon?.id === c.id;
                           return (
                               <button key={c.id} onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                   className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-bold transition-all whitespace-nowrap
                                   ${isApplied 
                                       ? 'border-green-500 bg-green-500/10 text-green-500' 
                                       : (isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-700' : 'border-slate-200 bg-slate-50 text-slate-500')}`}>
                                   {c.title}
                               </button>
                           )
                       })}
                   </div>
               )}

               {/* Payment Methods */}
               <div className="mt-8">
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-1">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub:'Preferido'}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} 
                               className={`px-5 py-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] duration-200
                               ${booking.payment === p.id 
                                   ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' 
                                   : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-black/20' : 'bg-zinc-800'}`}>
                                   <p.i size={20}/> 
                               </div>
                               <div className="text-left">
                                   <span className="font-bold text-sm block">{p.l}</span>
                                   {p.sub && <span className="text-[10px] opacity-60 block uppercase tracking-widest">{p.sub}</span>}
                               </div>
                               {booking.payment === p.id && <Check size={20} className="ml-auto" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>
               
               {/* Terms Checkbox */}
               <div className={`mt-8 p-4 rounded-2xl border flex flex-col gap-3 transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                         <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18}/>
                         <div>
                             <h4 className="text-sm font-bold text-amber-500 mb-1">{T.terms_title}</h4>
                             <p className="text-xs opacity-70 mb-2 cursor-pointer underline hover:text-white transition-colors" onClick={() => setTermsOpen(true)}>{T.terms_link}</p>
                         </div>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 cursor-pointer select-none">
                        <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 accent-amber-500 rounded cursor-pointer"/>
                        <span className="text-xs font-bold">{T.agree_terms}</span>
                    </label>
               </div>

            </div>
          )}

          {/* === STEP 4: SUCCESS === */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-8 text-center animate-scale-in">
                 <div className="relative mb-8">
                     <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                     <div className="w-28 h-28 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 relative z-10 animate-bounce-slow">
                         <Check size={56} className="text-white" strokeWidth={4}/>
                     </div>
                 </div>
                 
                 <h1 className="text-3xl font-black mb-3">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10 text-sm leading-relaxed">{T.success_sub}</p>
                 
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>
                     {T.whatsapp_btn}
                 </Button>
                 
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-xs font-bold uppercase opacity-40 tracking-widest hover:opacity-100 p-4 transition-opacity">
                    {T.back_home}
                 </button>
             </div>
          )}

        </div>
      </main>

      {/* COMPONENT: FOOTER ACTIONS */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none">
            <div className="pointer-events-auto max-w-md mx-auto">
                <div className={`p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border transition-colors duration-500
                    ${isDark ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-zinc-200'}`}>
                    
                    {step > 0 && (
                        <button onClick={()=>setStep(step-1)} className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-200'}`}>
                            <ChevronLeft size={24}/>
                        </button>
                    )}
                    
                    {step < 3 && booking.item && (
                        <div className="flex-1 pl-2 animate-fade-in">
                            <span className="block text-[9px] font-bold uppercase opacity-50 tracking-wider mb-0.5">{T.total_label}</span>
                            <span className="block text-2xl font-black tracking-tight text-amber-500">{T.currency} {financials.total}</span>
                        </div>
                    )}
                    
                    <button 
                        onClick={handleNextStep}
                        className={`h-14 px-8 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg 
                        ${step < 3 ? 'ml-auto' : 'w-full'} 
                        bg-amber-500 text-black shadow-amber-500/30 hover:bg-amber-400 hover:scale-[1.02] active:scale-95`}
                    >
                        {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18} strokeWidth={3}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* COMPONENT: MODALS & DRAWERS */}
      
      {/* Reviews Drawer */}
      <Modal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} title={T.reviews_title} isDark={isDark}>
         <div className="space-y-4">
            <div className="flex gap-2 pb-2">
                <span className="bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded">HOT</span>
                <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded">RECENTES</span>
            </div>
            {DATA.reviews.map((r,i)=>(
               <div key={i} className={`p-5 rounded-2xl border relative ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex justify-between mb-2">
                       <span className="font-bold text-sm text-white flex items-center gap-2">
                           <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] text-black">
                               {r.n.charAt(0)}
                           </div>
                           {r.n}
                       </span>
                       <span className="text-[10px] opacity-40 font-mono">{r.d}</span>
                   </div>
                   <div className="flex text-amber-400 gap-0.5 mb-2">
                       {[...Array(r.s)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}
                   </div>
                   <p className="text-sm opacity-80 leading-relaxed">"{r.t}"</p>
               </div>
            ))}
         </div>
      </Modal>

      {/* Terms Drawer */}
      <Modal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} title={T.terms_title} isDark={isDark}>
         <div className="space-y-4">
            {T.terms_body.map((t,i)=>(
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
                    <span className="font-black text-amber-500 text-xl opacity-50">{i+1}</span>
                    <p className="text-sm opacity-80 leading-relaxed">{t.substring(3)}</p>
                </div>
            ))}
            <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
         </div>
      </Modal>

      {/* Level Up Popup */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                {/* Visual Effects */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none">
                    <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500 blur-[80px] opacity-20"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500 blur-[80px] opacity-20"></div>
                </div>

                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce">
                    <Trophy size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2 italic tracking-tight">{T.popup_level_title}</h2>
                <p className="opacity-70 text-base leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>
                    {T.popup_btn_coupon}
                </Button>
            </div>
        </div>
      )}

      {/* Welcome Popup */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl rotate-6 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-700">
                    <Gift size={40} className="text-amber-500" />
                </div>
                <h2 className="text-2xl font-black mb-2">{T.popup_welcome_title}</h2>
                <p className="opacity-70 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                
                <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6">
                    <p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Seu Código:</p>
                    <p className="text-xl font-mono font-black text-amber-500 tracking-widest">WELCOME10</p>
                </div>

                <Button full variant="primary" onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}}>
                    {T.popup_btn_coupon}
                </Button>
            </div>
        </div>
      )}

      {/* CSS Animations Global Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .animate-fade-in { animation: fadeIn 0.6s ease-out; } 
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); } 
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-slide-down { animation: slideDown 0.3s ease-out; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
    </ToastProvider>
  );
}
