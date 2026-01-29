import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  ChevronRight, Lock, History, User, Wallet, Share2, Copy, Quote, Smile,
  RotateCcw
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v18.0 - DARK LUXURY GLASSMORPHISM
 * ==================================================================================
 * CONCEITO VISUAL:
 * - Fundo: Zinc 950 (Preto Profundo)
 * - Cards: White/5 com Backdrop Blur (Efeito Vidro Fosco)
 * - Acentos: Amber 500 (Ouro/Calor)
 * - Interação: Soft Scaling e Glow (Brilho suave)
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v18_lux', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 2. DESIGN SYSTEM (LUXURY GLASS)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.96]";
  
  const variants = {
    // Gradiente Dourado com Sombra Colorida (Glow)
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25 border border-amber-400/20 hover:shadow-amber-500/40 hover:brightness-110",
    // Vidro Fosco
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    // Verde WhatsApp
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20bd5a]",
    // Outline Clean
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500",
    // Ícone Vidro
    icon: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10"
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-3", 
    md: "h-12 text-xs px-5", 
    lg: "h-14 text-sm px-6", 
    xl: "h-16 text-sm px-8 uppercase tracking-widest",
    icon: "h-11 w-11 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={18} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={20} className={children ? "mr-2.5" : ""} strokeWidth={2} />}
          {children}
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error }) => (
  <div className="space-y-2 w-full group">
    {label && <label className="text-[10px] font-bold uppercase tracking-widest ml-1 text-zinc-500 group-focus-within:text-amber-500 transition-colors">{label}</label>}
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors z-10">{Icon && <Icon size={18} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-11 pr-4 py-4 rounded-2xl outline-none text-sm font-medium transition-all duration-300 placeholder:text-zinc-600
        ${error ? 'bg-red-500/10 border border-red-500/50 text-red-200' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-100 focus:bg-zinc-900 focus:border-amber-500/50 focus:shadow-[0_0_15px_-3px_rgba(245,158,11,0.15)]'}`} 
      />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 font-medium animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-[1.5rem] transition-all duration-300 overflow-hidden 
    ${onClick ? 'cursor-pointer active:scale-[0.98] hover:bg-white/[0.07]' : ''} 
    ${active 
        ? 'bg-amber-500/10 border border-amber-500/50 shadow-[0_0_30px_-10px_rgba(245,158,11,0.3)]' 
        : 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10'} 
    ${className}`}
  >
    {/* Efeito de brilho sutil no fundo */}
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />}
    {children}
  </div>
);

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 6 + 2,
      h: Math.random() * 6 + 2,
      color: ['#fbbf24', '#f59e0b', '#ffffff', '#4b5563'][Math.floor(Math.random() * 4)], // Gold, Amber, White, Grey
      speed: Math.random() * 4 + 2,
      angle: Math.random() * 360,
      spin: Math.random() * 5 - 2.5
    }));
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
        p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;
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
// 3. DADOS
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor", color: "text-zinc-500" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Bronze" : "Bronze", color: "text-amber-700" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Prata" : "Silver", color: "text-zinc-300" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Ouro VIP" : "Gold VIP", color: "text-amber-400" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: isPT ? "RELAXANTE" : "RELAXING",
              title: isPT ? "Sessão Relaxante (Madeira)" : "Wood Therapy Relax",
              desc: isPT ? "O alívio imediato para o cansaço do dia a dia." : "Immediate relief for daily tiredness.",
              details: isPT ? `A EXPERIÊNCIA:
• TÉCNICA: Rolos de madeira & toques manuais suaves.
• FOCO: Descompressão total e alívio de tensão.
• AMBIENTE: Aromaterapia suave inclusa.` : `THE EXPERIENCE:
• TECHNIQUE: Wood rollers & soft manual touches.
• FOCUS: Total decompression and tension relief.
• AMBIENCE: Soft aromatherapy included.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: isPT ? "SENSORIAL" : "SENSORY",
              title: isPT ? "Sensitiva Tântrica" : "Tantric Sensitive",
              desc: isPT ? "Uma jornada profunda de sensações." : "A deep journey of sensations.",
              details: isPT ? `O DESPERTAR DOS SENTIDOS:
• TOQUE: Plumas e ponta dos dedos (Eletrizante).
• INTIMIDADE: Lingam massagem inclusa.
• CLÍMAX: Focado no seu prazer máximo.` : `AWAKENING SENSES:
• TOUCH: Feathers and fingertips (Electrifying).
• INTIMACY: Lingam massage included.
• CLIMAX: Focused on your maximum pleasure.`
            },
            { 
              id: 'mista', min: 60, price: 205, icon: Zap, tag: isPT ? "PREMIUM" : "PREMIUM",
              title: isPT ? "Experiência Completa" : "Full Experience",
              desc: isPT ? "A fusão perfeita: Relaxamento + Intensidade." : "The perfect fusion: Relaxation + Intensity.",
              details: isPT ? `A ESCOLHA DA MAIORIA:
• FUSÃO: Começa relaxante, evolui para sensitiva.
• CONTATO: Body to Body (Corpo a corpo com óleo).
• FINALIZAÇÃO: Do jeito que você preferir.` : `MOST POPULAR:
• FUSION: Starts relaxing, evolves to sensitive.
• CONTACT: Body to Body (with warm oil).
• FINISH: However you prefer.`
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4 Sessions)", 
              price: 440, fullPrice: 500, savings: 60, 
              details: isPT ? "Para manter o corpo leve o mês todo." : "To keep the body light all month.", tag: isPT ? "2x XP" : "2x XP", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Pack Completo (3 Sessões)" : "Full Pack (3 Sessions)", 
              price: 550, fullPrice: 615, savings: 65, 
              details: isPT ? "O favorito dos clientes VIP." : "The favorite of VIP clients.", tag: isPT ? "BEST SELLER" : "BEST SELLER", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: isPT ? "Clube VIP Mensal" : "VIP Monthly Club", 
              price: 360, fullPrice: 460, savings: 100, 
              details: isPT ? "2 Sessões Completas + Prioridade na agenda." : "2 Full Sessions + Priority booking.", tag: isPT ? "STATUS VIP" : "VIP STATUS", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa para acabar." : "No rush to finish." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Troca (Interativo)" : "Switch (Interactive)", desc: isPT ? "Liberdade para tocar também." : "Freedom to touch too." },
            { id: 'aroma', price: 5, icon: Wind, label: isPT ? "Óleo Premium" : "Premium Oil", desc: isPT ? "Essências importadas." : "Imported essences." }
        ],
        reviews: [
            { n: "Tiago", t: isPT ? "A sensitiva foi uma experiência de outro mundo." : "The sensitive massage was out of this world.", s: 5 },
            { n: "Pedro H.", t: isPT ? "Fui estressado e saí flutuando." : "Went in stressed, came out floating.", s: 5 },
            { n: "Marcos", t: isPT ? "Profissionalismo nota 10." : "Professionalism 10/10.", s: 5 },
            { n: "Anônimo", t: isPT ? "O toque dele vicia. A finalização foi absurda." : "His touch is addictive. The finish was absurd.", s: 5 },
            { n: "Curioso SP", t: isPT ? "Mão firme, pegada de macho. O óleo quente faz toda a diferença." : "Firm hand, manly grip. The warm oil makes all the difference.", s: 5 },
            { n: "Empresário", t: isPT ? "O sigilo foi absoluto. Atendeu no meu escritório." : "Secrecy was absolute. Came to my office.", s: 5 },
            { n: "Roberto", t: isPT ? "O upgrade de 30 minutos vale a pena." : "The 30min upgrade is worth it.", s: 5 },
            { n: "Fã", t: isPT ? "Ele de cueca branca... sem comentários. Visual nota 1000." : "Him in white underwear... no comments. Visuals 10/10.", s: 5 },
            { n: "Gustavo", t: isPT ? "Ambiente que ele cria com a música e o cheiro é relaxante demais." : "The atmosphere he creates with music and scent is too relaxing.", s: 5 },
            { n: "J.P.", t: isPT ? "O corpo a corpo é quente de verdade. Uma experiência única." : "Body to body is truly hot. A unique experience.", s: 5 },
            { n: "André", t: isPT ? "Gostei que ele respeita os limites, mas entrega muito prazer." : "Liked that he respects limits but delivers lots of pleasure.", s: 5 },
            { n: "Ricardo", t: isPT ? "Valeu a pena esperar a agenda liberar." : "Worth waiting for the schedule to open.", s: 5 }
        ],
        text: {
            loading: isPT ? "PREPARANDO AMBIENTE..." : "PREPARING AMBIENCE...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Seu momento de desconexão começa agora." : "Your moment of disconnection starts now.",
            tab_single: isPT ? "Sessões Avulsas" : "Single Sessions",
            tab_packs: isPT ? "Planos VIP" : "VIP Plans",
            reviews_btn: isPT ? "Ver 50+ Experiências Reais" : "See 50+ Real Experiences",
            select_time_title: isPT ? "Agenda" : "Schedule",
            date_sub: isPT ? "Escolha o momento ideal para você:" : "Choose the ideal moment for you:",
            location_title: isPT ? "Localização" : "Location",
            input_name: isPT ? "Como devo te chamar?" : "What should I call you?",
            input_addr: isPT ? "Endereço do atendimento" : "Service address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Unit",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Número do Quarto" : "Room Number",
            motel_note: isPT ? "Motel/Suíte: A taxa do local é por sua conta. O valor da massagem acertamos no WhatsApp." : "Motel/Suite: The venue fee is on you. Massage fee is settled on WhatsApp.",
            pay_title: isPT ? "Pagamento" : "Payment",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Personalize sua Experiência" : "Customize your Experience",
            coupon_title: isPT ? "Possui um convite?" : "Have an invite?",
            coupon_placeholder: isPT ? "Código do convite..." : "Invite code...",
            coupon_btn: isPT ? "Validar" : "Validate",
            remove: isPT ? "Remover" : "Remove",
            total_label: isPT ? "Investimento Total" : "Total Investment",
            book_btn: isPT ? "Agendar Sessão" : "Book Session",
            next_btn: isPT ? "Continuar" : "Continue",
            uber_warning: isPT ? "*Transporte (Uber) calculado no chat" : "*Transport (Uber) calculated in chat",
            success_title: isPT ? "Sessão Pré-Agendada" : "Session Pre-Booked",
            success_sub: isPT ? "Sua solicitação foi gerada. Finalize o contato no WhatsApp para garantir seu horário." : "Request generated. Finalize contact on WhatsApp to secure your slot.",
            whatsapp_btn: isPT ? "Confirmar no WhatsApp" : "Confirm on WhatsApp",
            back_home: isPT ? "Voltar ao Início" : "Back Home",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            empty_date: isPT ? "Selecione uma data para ver a agenda" : "Select a date to see schedule",
            empty_slots: isPT ? "Agenda completa." : "Fully booked.",
            details_label: isPT ? "DETALHES" : "DETAILS",
            security_note: isPT ? "Privacidade total. Seus dados não saem daqui." : "Total privacy. Your data stays here.",
            popup_welcome_title: isPT ? "Presente de Boas-vindas" : "Welcome Gift",
            popup_welcome_msg: isPT ? "Para celebrar nosso primeiro encontro, liberei um benefício exclusivo." : "To celebrate our first meeting, I released an exclusive benefit.",
            popup_level_title: isPT ? "Novo Status VIP" : "New VIP Status",
            popup_level_msg: isPT ? "Sua fidelidade elevou seu nível. Aproveite seus novos privilégios." : "Your loyalty raised your level. Enjoy your new privileges.",
            popup_btn_coupon: isPT ? "Resgatar Benefício" : "Redeem Benefit",
            agree_terms: isPT ? "Li e concordo com o protocolo de atendimento." : "I read and agree with the service protocol.",
            terms_body: isPT ? ["1. HIGIENE: Banho prévio é essencial.", "2. SIGILO: Privacidade absoluta garantida.", "3. RESPEITO: Ambiente de relaxamento mútuo.", "4. PAGAMENTO: Realizado ao final da sessão.", "5. SAÚDE: Estou apto fisicamente."] : ["1. HYGIENE: Shower beforehand is essential.", "2. SECRECY: Absolute privacy guaranteed.", "3. RESPECT: Mutual relaxation environment.", "4. PAYMENT: Done at the end of session.", "5. HEALTH: I am physically fit."],
            terms_title: isPT ? "Protocolo" : "Protocol",
            terms_link: isPT ? "Ler protocolo completo" : "Read full protocol",
            terms_btn: isPT ? "Estou de acordo" : "I agree",
            scarcity_msg: isPT ? "interessados agora" : "interested now",
            xp_label: "Fidelidade",
            level_label: isPT ? "Seu Nível" : "Your Level",
            max_level: isPT ? "Cliente Elite" : "Elite Client",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para R$ ${reward} off` : `${needed} XP to $ ${reward} off`,
            
            // TOAST MESSAGES
            toast_select_item: isPT ? "Selecione uma experiência para continuar." : "Select an experience to continue.",
            toast_select_date: isPT ? "Escolha um dia e horário na agenda." : "Choose a day and time.",
            toast_fill_name: isPT ? "Por favor, informe seu nome." : "Please enter your name.",
            toast_fill_addr: isPT ? "O endereço é necessário para o atendimento." : "Address is required for service.",
            toast_fill_hotel: isPT ? "Informe o nome do hotel." : "Enter hotel name.",
            toast_select_pay: isPT ? "Selecione a forma de pagamento." : "Select payment method.",
            toast_accept_terms: isPT ? "É necessário aceitar o protocolo." : "You must accept the protocol.",
            toast_coupon_success: isPT ? "Benefício aplicado com sucesso." : "Benefit applied successfully.",
            toast_coupon_error: isPT ? "Código inválido ou expirado." : "Invalid or expired code.",

            zap: {
              intro: isPT ? "Olá Thalyson, tudo bem?" : "Hi Thalyson, how are you?",
              order_title: isPT ? "*SOLICITAÇÃO DE AGENDAMENTO*" : "*BOOKING REQUEST*",
              client: isPT ? "👤 *Cliente:*" : "👤 *Client:*",
              service: isPT ? "💆‍♂️ *Experiência:*" : "💆‍♂️ *Experience:*",
              date: isPT ? "🗓️ *Data:*" : "🗓️ *Date:*",
              location: isPT ? "📍 *Local:*" : "📍 *Loc:*",
              payment: isPT ? "💳 *Pagamento:*" : "💳 *Payment:*",
              value: isPT ? "💰 *INVESTIMENTO:*" : "💰 *INVESTMENT:*",
              xp_status: isPT ? "🏆 *FIDELIDADE:*" : "🏆 *LOYALTY:*",
              xp_gain: isPT ? "XP Ganho:" : "XP Earned:",
              xp_level: isPT ? "Nível:" : "Level:",
              xp_next: isPT ? "Próximo:" : "Next:",
              wait: isPT ? "Aguardo sua confirmação." : "Awaiting confirmation.",
              house: isPT ? "Residência" : "Residence",
              hotel: "Hotel",
              motel: isPT ? "Suíte/Motel" : "Suite/Motel",
              extra_title: isPT ? "✨ *Adicionais:*" : "✨ *Extras:*",
              uber_label: isPT ? "🚗 *Deslocamento:*" : "🚗 *Transport:*",
              uber_text: isPT ? "A calcular" : "To calculate"
            }
        }
    };
};

// ==================================================================================
// 4. MAIN APP
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [activeTab, setActiveTab] = useState('single');
  
  const [viewers, setViewers] = useState(0);
  const [showScarcity, setShowScarcity] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  
  const [toasts, setToasts] = useState([]);
  
  const scrollRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  // BROWSER ESCAPE & IN-APP BROWSER DETECTION
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);

    if (isInApp && /android/i.test(ua)) {
      const url = window.location.href;
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      setTimeout(() => { window.location.href = intentUrl; }, 500);
    }
  }, []);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  // CARREGAMENTO SEGURO
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2000);
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({
                ...prev,
                ...parsed,
                coupons: Array.isArray(parsed.coupons) ? parsed.coupons : []
            }));
            if(parsed.savedAddress) {
                setBooking(b => ({...b, address: parsed.savedAddress}));
            }
        } else {
            setUser(p => ({...p, coupons: [] })); 
        }
    } catch (e) {
        console.error("Storage error", e);
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

  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 4) + 3; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 4000);
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({
          ...prev,
          type: type,
          item: item,
          extras: {}, 
          payment: '',
          termsAccepted: false
      }));
  };

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      if (isNaN(selectedDate)) return [];
      
      const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();

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
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const extData = DATA.extras.find(e=>e.id===k);
            if(extData) {
                sub += extData.price; 
            }
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  const estimatedXP = useMemo(() => {
      const baseXP = financials.total;
      const isPack = booking.type === 'pack' || booking.type === 'subscription';
      const percentage = isPack ? 0.30 : 0.15; 
      return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);

  const getNextLevelInfo = (currentXP) => {
      if (currentXP >= 800) {
          const cycleXP = currentXP - 800;
          const nextRewardAt = 500 - (cycleXP % 500); 
          return { needed: nextRewardAt, reward: 50, title: "Prestige Elite" }; 
      }
      
      const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
      return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const xpGain = estimatedXP;
    const currentLevelTitle = DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title;
    const nextInfo = getNextLevelInfo(user.xp + xpGain);
    
    let locTxt = "";
    let mapQuery = "";
    
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${T.zap.house}\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${T.zap.motel}\n⚠️ (Detalhes e valor da suíte a combinar)`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `✅ ${ext.label} (+ R$ ${ext.price})` : '';
    }).filter(Boolean).join('\n');
    
    const xpStatusMsg = nextInfo 
        ? `${T.zap.xp_next} ${nextInfo.needed} XP (R$ ${nextInfo.reward},00)`
        : "Nível Máximo Atingido! ⚜️";

    const msg = `
${T.zap.intro}
${T.zap.order_title}
──────────────────────

${T.zap.client} ${user.name}
${T.zap.service} ${booking.item?.title}
${T.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${T.zap.extra_title}\n${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* http://maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────

${T.zap.value}
Total: R$ ${f.total},00
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

${T.zap.xp_status}
⚜️ ${T.zap.xp_gain} +${xpGain} XP
⚜️ ${T.zap.xp_level} ${currentLevelTitle}
⚜️ ${xpStatusMsg}

${T.zap.wait}
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const validateStep = () => {
      if (step === 0) {
          if(!booking.item) { addToast(T.toast_select_item, "error"); return false; }
          return true;
      }
      if (step === 1) {
          if (!booking.date || !booking.time) { addToast(T.toast_select_date, "error"); return false; }
          return true;
      }
      if (step === 2) {
          if (!user.name || user.name.trim().length < 3) { addToast(T.toast_fill_name, "error"); return false; }
          if (booking.locationType === 'home') {
              if(!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) {
                  addToast(T.toast_fill_addr, "error"); return false;
              }
          }
          if (booking.locationType === 'hotel') {
              if(!booking.address.placeName || !booking.address.city) {
                  addToast(T.toast_fill_hotel, "error"); return false;
              }
          }
          return true;
      }
      if (step === 3) {
          if (!booking.payment) { addToast(T.toast_select_pay, "error"); return false; }
          if (!booking.termsAccepted) { addToast(T.toast_accept_terms, "error"); return false; }
          return true;
      }
      return true;
  };

  const handleNextStep = () => {
      if(validateStep()) {
          if (step === 2) {
              setUser(prev => ({...prev, savedAddress: booking.address}));
          }
          if (step === 3) { finishBooking(); } else { setStep(s => s + 1); }
      }
  };

  const handleApplyCoupon = () => {
      if(!couponInput) return;
      const code = couponInput.toUpperCase();
      if(code === 'THALYSON10' || code === 'VIP20' || code === 'WELCOME10') {
          const val = code === 'VIP20' ? 20 : 10;
          const newCoupon = { id: code, val, title: `🎟️ ${code}`, code };
          setBooking(b => ({...b, appliedCoupon: newCoupon}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_coupon_error, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    
    if (booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code);
    }
    
    const newXP = Math.floor(user.xp + estimatedXP);
    let leveledUp = false;
    
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 REWARD ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });

    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        if (newCycle > oldCycle && newCycle >= 0) {
              leveledUp = true;
              updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 ELITE BONUS`, code: `VIPMASTER` });
        }
    }

    if (leveledUp) setLevelUpPopup(true);
    
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: prev.ordersCount + 1 }));
    setShowConfetti(true);
    
    if (typeof window !== 'undefined') {
        const zapLink = generateWhatsAppLink();
        window.open(zapLink, '_blank');
    }
    setStep(4);
  };

  const getCurrentLevelProgress = () => {
      if (user.xp >= 800) {
          const cycleXP = user.xp - 800;
          const progressInCycle = cycleXP % 500;
          return (progressInCycle / 500) * 100;
      }

      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      const totalNeeded = nextLevel.xpNeeded - currentLevel.xpNeeded;
      const currentProgress = user.xp - currentLevel.xpNeeded;
      return Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));
  };

  const nextLevelInfo = getNextLevelInfo(user.xp);

  if (loading) return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 text-white">
        <div className="relative mb-6">
            <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-2xl text-black shadow-lg shadow-amber-500/20 relative z-10">TM</div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase"><Loader2 size={12} className="animate-spin text-amber-500"/>{T.text?.loading}</div>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className="h-[100dvh] w-full font-sans flex flex-col overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-500">
      
      {/* BACKGROUND AMBIENT GLOW */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl animate-slide-down ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {t.type === 'success' ? <Check size={18} /> : <AlertTriangle size={18} />}
            <span className="text-xs font-medium">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />
      
      {/* SCARCITY PILL */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-500 transform ${showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-white/5 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
               <span className="text-[10px] font-medium tracking-wide text-zinc-300">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <header className="h-20 px-6 flex items-center justify-between z-20 shrink-0 bg-transparent relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-sm text-black shadow-lg shadow-amber-500/10">TM</div>
          <div className="leading-tight">
            <span className="font-bold text-sm tracking-wide block text-white">Thalyson</span>
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Massagens</span>
          </div>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Globe size={18}/></button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 border border-pink-500/20 text-pink-400 hover:text-pink-300 hover:border-pink-500/40 transition-all"><Instagram size={18}/></a>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative z-10">
        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                    <h1 className="text-3xl font-light tracking-tight text-white">{T.welcome} <span className="font-bold text-amber-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                </div>
                <p className="text-sm text-zinc-400 font-light leading-relaxed">{T.subtitle}</p>
                
                {/* XP CARD LUXURY */}
                <div className="relative mt-6 overflow-hidden rounded-[2rem] p-6 border border-white/10 bg-zinc-900/40 backdrop-blur-xl group hover:border-amber-500/30 transition-all duration-500">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all duration-500"></div>
                    
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20">
                                <Trophy size={22} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{T.level_label}</span>
                                <h3 className="font-bold text-xl text-white mt-0.5">
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-white block">{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between text-[10px] font-medium text-zinc-500 mb-2 uppercase tracking-wide">
                            <span>Progresso</span>
                            <span className="text-amber-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_#f59e0b]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                         <p className="text-[10px] text-zinc-500 mt-3 text-center">
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
                </div>
                
                <button onClick={() => setReviewsOpen(true)} className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-zinc-400 text-xs font-medium hover:bg-white/5 hover:text-white transition-all group">
                    <div className="flex text-amber-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                    {T.reviews_btn}
                </button>
              </div>

              {/* TABS GLASS */}
              <div className="grid grid-cols-2 p-1 rounded-2xl bg-zinc-900/50 border border-white/5 mb-8 relative">
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? 'bg-zinc-800 text-white shadow-lg shadow-black/20' : 'text-zinc-500 hover:text-zinc-300'}`}><Package size={14}/> {T.tab_packs}</button>
              </div>

              {activeTab === 'single' && (
                  <div className="space-y-4 animate-slide-in">
                    {DATA.services.map(s => (
                      <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl transition-all duration-300 ${booking.item?.id === s.id ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-400'}`}><s.icon size={24}/></div>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-white tracking-tight">{T.currency || 'R$'} {s.price}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-end gap-1"><Clock size={10}/> {s.min} min</span>
                            </div>
                          </div>
                          <div className="mb-2">
                              {s.tag && <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 mb-2 uppercase tracking-widest">{s.tag}</span>}
                              <h3 className="font-bold text-lg text-white leading-tight">{s.title}</h3>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed font-light">{s.desc}</p>
                          
                          {/* EXPANDED DETAILS */}
                          <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === s.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                              <div className="overflow-hidden">
                                  <div className="p-4 rounded-xl bg-zinc-950/50 border border-white/5 text-xs text-zinc-300 leading-relaxed font-light">
                                      <div className="flex items-center gap-2 font-bold mb-2 text-amber-500 uppercase tracking-wider text-[10px]"><Info size={12}/> {T.details_label}</div>
                                      <p className="whitespace-pre-line">{s.details}</p>
                                  </div>
                              </div>
                          </div>
                      </Card>
                    ))}
                  </div>
              )}

              {activeTab === 'packs' && (
                  <div className="space-y-4 animate-slide-in">
                      {DATA.plans.map(plan => (
                          <Card key={plan.id} active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)}>
                              {plan.tag && (<div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-amber-600 text-black text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg shadow-amber-500/20">{plan.tag}</div>)}
                              <div className="flex items-center gap-4 mb-4">
                                  <div className={`p-4 rounded-2xl transition-all ${booking.item?.id === plan.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}><plan.icon size={28}/></div>
                                  <div><h3 className="font-bold text-lg text-white leading-none mb-1">{plan.title}</h3><p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{plan.type === 'pack' ? 'Pacote' : 'Assinatura'}</p></div>
                              </div>
                              <p className="text-sm text-zinc-400 mb-5 font-light">{plan.details}</p>
                              <div className="flex items-end gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                                  <span className="text-2xl font-bold text-amber-500">{T.currency || 'R$'} {plan.price}</span>
                                  <span className="text-sm line-through text-zinc-600 decoration-zinc-600">{T.currency || 'R$'} {plan.fullPrice}</span>
                                  <span className="text-[10px] text-emerald-400 font-bold mb-1 ml-auto bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Economia {T.currency || 'R$'}{plan.savings}</span>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-light text-white mb-1">{T.select_time_title}</h2>
                 <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-zinc-500">{T.date_sub}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-4">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[72px] h-24 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all flex-shrink-0 active:scale-95 duration-300 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                      <span className="text-2xl font-bold">{d.getDate()}</span>
                      {isSel && <span className="w-1 h-1 rounded-full bg-black mt-1"></span>}
                    </button>
                  )
                })}
              </div>
              {!booking.date && (<div className="text-center py-12 opacity-30 border border-dashed border-zinc-700 rounded-3xl mx-2"><Calendar size={32} className="mx-auto mb-3 text-zinc-500"/><p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{T.empty_date}</p></div>)}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }} className={`py-3.5 rounded-xl text-sm font-medium border transition-all active:scale-95 duration-200 relative overflow-hidden group ${booking.time === t ? 'bg-zinc-100 text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}>
                           {t}
                       </button>
                   ))}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className="text-center py-8 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-sm font-medium text-zinc-400">{T.empty_slots}</p></div>)}
            </div>
          )}

          {/* LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-light text-white text-center mb-8">{T.location_title}</h2>
              <div className="grid grid-cols-3 gap-3 mb-8">
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 rounded-2xl text-[10px] font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                        <x.i size={20} strokeWidth={2}/> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-5">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder={lang === 'pt' ? "Seu Nome" : "Your Name"} />
                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_80px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder={lang === 'pt' ? "Rua" : "Street"} />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder="Nº" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                        <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={lang === 'pt' ? "Comp" : "Unit"} />
                        </div>
                     </div>
                 )}
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} icon={Building} placeholder={lang === 'pt' ? "Nome do Hotel" : "Hotel Name"} />
                        <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                        <InputField label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} icon={Lock} placeholder={lang === 'pt' ? "Quarto" : "Room"} />
                    </div>
                 )}
                 {booking.locationType === 'motel' && (
                    <div className="p-6 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 text-center">
                        <Smartphone size={24} className="mx-auto mb-3 text-zinc-600"/>
                        <p className="text-xs text-zinc-400 leading-relaxed">{T.motel_note}</p>
                    </div>
                 )}
              </div>
              {/* EXTRAS */}
              {booking.type === 'single' && (
                  <div className="pt-8 border-t border-white/5 mt-8">
                     <h3 className="text-[10px] font-bold uppercase mb-4 tracking-widest text-zinc-500">{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-lg transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : 'text-zinc-600'}`}><ex.icon size={20}/></div>
                                 <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : 'text-zinc-300'}`}>{ex.label}</p><p className="text-[10px] text-zinc-500 font-medium">{ex.desc}</p></div>
                             </div>
                             <span className={`text-xs font-bold whitespace-nowrap px-2 py-1 rounded ${booking.extras[ex.id] ? 'bg-amber-500/20 text-amber-500' : 'text-zinc-600 bg-zinc-800'}`}>+ {T.currency || 'R$'} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className="relative">
                   <div className="p-6 rounded-[2rem] border border-white/10 bg-zinc-900/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700 shadow-[0_0_15px_#f59e0b]"></div>
                      <div className="mb-6 pt-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 block">{booking.type === 'pack' ? (lang === 'pt'?'Pacote':'Pack') : (booking.type === 'subscription' ? (lang === 'pt'?'Assinatura':'Subscription') : (lang === 'pt'?'Sessão Individual':'Single Session'))}</span>
                          <h2 className="font-bold text-2xl text-white leading-tight mb-1">{booking.item.title}</h2>
                          <p className="text-xs text-amber-500 font-medium flex items-center gap-1.5"><Calendar size={12}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                      </div>
                      <div className="space-y-3 border-b border-dashed border-white/10 pb-6 mb-6">
                          <div className="flex justify-between text-sm text-zinc-300"><span>Valor Base</span><span className="font-medium text-white">{T.currency || 'R$'} {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                              const extraItem = DATA.extras.find(e=>e.id===k);
                              return extraItem ? (<div key={k} className="flex justify-between text-sm text-zinc-500"><span>+ {extraItem.label}</span><span>{extraItem.price}</span></div>) : null;
                          })}
                          {booking.appliedCoupon && (<div className="flex justify-between text-sm text-emerald-400 bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10"><span>Cupom ({booking.appliedCoupon.code})</span><span>- {T.currency || 'R$'} {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className="text-[10px] font-bold uppercase text-zinc-600 block mb-1">{T.total_label}</span><span className="text-[10px] font-medium text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">{T.uber_warning}</span></div>
                          <div className="text-right">
                              <span className="block text-4xl font-light text-white tracking-tight">{T.currency || 'R$'} {financials.total}</span>
                              <span className="text-[10px] font-bold text-amber-500 flex items-center justify-end gap-1 mt-1"><Sparkles size={10}/> +{estimatedXP} XP</span>
                          </div>
                      </div>
                   </div>
               </div>
               
               <div className="mt-8 flex gap-2">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className="w-full pl-4 pr-10 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold uppercase tracking-widest text-white placeholder:text-zinc-700 outline-none focus:border-amber-500/50 transition-colors"/>
                       <Tag size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>

               <div className="mt-8">
                   <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-3 ml-1 tracking-widest">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub:''}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${booking.payment === p.id ? 'bg-zinc-800 border-amber-500/50 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)]' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}><p.i size={18}/></div>
                               <div className="text-left"><span className={`font-bold text-sm block ${booking.payment === p.id ? 'text-white' : 'text-zinc-400'}`}>{p.l}</span></div>
                               {booking.payment === p.id && <Check size={18} className="ml-auto text-amber-500" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="mt-8 p-4 rounded-xl border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-start gap-3 mb-3">
                         <ShieldCheck className="text-zinc-600 shrink-0 mt-0.5" size={18}/>
                         <div><h4 className="text-xs font-bold text-zinc-400 mb-1">{T.terms_title}</h4><p className="text-[10px] text-zinc-500 cursor-pointer hover:text-amber-500 transition-colors underline" onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-lg bg-zinc-950/50 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors select-none"><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-500 cursor-pointer"/><span className="text-xs text-zinc-300">{T.agree_terms}</span></label>
               </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-10 text-center animate-scale-in">
                 <div className="relative mb-8 group">
                     <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-20 rounded-full animate-pulse"></div>
                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 border border-emerald-400/20">
                         <Check size={40} className="text-white" strokeWidth={3}/>
                     </div>
                 </div>
                 <h1 className="text-2xl font-light text-white mb-3">{T.success_title}</h1>
                 <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto mb-10">{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors py-3">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className="w-full p-4 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="secondary" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    
                    <button 
                      onClick={handleNextStep} 
                      className={`flex-1 h-14 rounded-2xl font-bold text-xs flex items-center justify-between px-6 transition-all duration-300 shadow-lg active:scale-[0.98] ${step < 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20 hover:shadow-amber-500/30' : 'bg-[#25D366] text-white shadow-green-500/20 hover:bg-[#20bd5a]'}`}
                    >
                      <span className="uppercase tracking-widest">{step === 3 ? T.book_btn : T.next_btn}</span>
                      {booking.item && (
                        <div className="flex flex-col items-end leading-none opacity-80">
                          <span className="text-[9px] font-medium uppercase mb-0.5">Total</span>
                          <span className="text-sm font-black">{T.currency || 'R$'} {financials.total}</span>
                        </div>
                      )}
                      {!booking.item && <ArrowRight size={18} strokeWidth={2.5}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-6 max-h-[85vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-zinc-900 z-10 py-2 border-b border-white/5"><h3 className="text-lg font-light text-white">{T.reviews_title || "Avaliações"}</h3><button onClick={()=>setReviewsOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={18}/></button></div>
            <div className="space-y-4">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className="p-5 rounded-2xl bg-zinc-800/30 border border-white/5 relative">
                       <Quote size={20} className="absolute top-4 right-4 text-zinc-700" />
                       <div className="flex justify-between mb-2">
                           <span className="font-bold text-sm text-zinc-200 flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-[10px] text-amber-500 font-bold border border-amber-500/20">{r.n.charAt(0)}</div>
                               {r.n}
                           </span>
                       </div>
                       <div className="flex text-amber-500 gap-0.5 mb-2">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                       <p className="text-xs text-zinc-400 leading-relaxed italic">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-light text-white">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={18}/></button></div>
            <div className="space-y-4">
                {T.terms_body.map((t,i)=>(<div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-950/50 border border-white/5"><span className="font-bold text-amber-500 text-lg opacity-50">{i+1}</span><p className="text-xs text-zinc-400 leading-relaxed pt-1">{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-amber-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500 blur-[80px] opacity-20"></div></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30 animate-bounce-slow"><Trophy size={32} className="text-black" /></div>
                <h2 className="text-2xl font-light text-white mb-2">{T.popup_level_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5"><Gift size={32} className="text-amber-500" /></div>
                <h2 className="text-xl font-light text-white mb-2">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Seu Código:</p><p className="text-xl font-mono font-bold text-amber-500 tracking-widest">WELCOME10</p></div>
                <Button full variant="primary" onClick={()=>{
                    setWelcomePopup(false); 
                    setUser(u=>({...u, hasSeenWelcome: true}));
                    const welcomeCoupon = { id: 'WELCOME10', val: 10, title: '🎁 Welcome', code: 'WELCOME10' };
                    setBooking(b => ({...b, appliedCoupon: welcomeCoupon}));
                    addToast(T.toast_coupon_success, "success");
                }}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.6s ease-out}.animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.3s ease-out}.pb-safe{padding-bottom:env(safe-area-inset-bottom,24px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.95);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
