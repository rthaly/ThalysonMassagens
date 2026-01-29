import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  ChevronRight, Lock, History, User, Wallet, Share2, Copy, Quote, Smile,
  RotateCcw, Activity
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP - VERSÃO ÚNICA (FINAL)
 * ARQUIVO: App.tsx / App.jsx
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_final_v1'
};

// ==================================================================================
// 1. COMPONENTES VISUAIS (Botoes, Cards, Inputs)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-400 hover:to-amber-300 text-black shadow-lg shadow-amber-500/25 border border-amber-400/50",
    secondary: "bg-zinc-800 text-zinc-200 border border-zinc-700 active:bg-zinc-700 hover:border-zinc-500",
    whatsapp: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/30 border border-green-400/20",
    icon: "bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-white hover:bg-zinc-700 active:bg-zinc-600"
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-3", 
    md: "h-12 text-xs px-4", 
    lg: "h-14 text-sm px-6", 
    xl: "h-16 text-base px-8",
    icon: "h-12 w-12 p-0 flex-shrink-0"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={20} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={20} className={children ? "mr-2.5" : ""} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark, ...props }) => (
  <div className="space-y-1.5 w-full relative">
    <div className={`relative group transition-all duration-300`}>
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-zinc-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>
        {Icon && <Icon size={20} strokeWidth={2} />}
      </div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder=" " 
        className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-base font-medium transition-all duration-300 
          ${error 
            ? 'border-red-500/50 focus:border-red-500 bg-red-500/5 text-red-100 placeholder-red-300' 
            : (isDark 
                ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-amber-500/50 focus:bg-zinc-900 focus:shadow-[0_0_20px_rgba(245,158,11,0.1)]' 
                : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500 focus:shadow-md')}`} 
        {...props}
      />
      {!value && <span className={`absolute left-12 top-1/2 -translate-y-1/2 text-sm pointer-events-none transition-all ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{placeholder}</span>}
    </div>
    {(label || error) && (
      <div className="flex justify-between px-1">
        {label && <label className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</label>}
        {error && <p className="text-red-400 text-[10px] font-bold flex items-center gap-1"><AlertTriangle size={10}/> {error}</p>}
      </div>
    )}
  </div>
);

const Card = ({ children, isDark, className = '', onClick, active = false }) => (
  <div onClick={onClick} className={`relative p-5 rounded-[1.5rem] transition-all duration-300 overflow-hidden 
    ${onClick ? 'cursor-pointer active:scale-[0.98] touch-manipulation' : ''} 
    ${isDark 
      ? `bg-zinc-900/60 backdrop-blur-xl ${active ? 'border-2 border-amber-500 bg-zinc-900 shadow-[0_0_30px_rgba(245,158,11,0.15)]' : 'border border-zinc-800/60 hover:bg-zinc-800/80 hover:border-zinc-700'}` 
      : `bg-white ${active ? 'border-2 border-amber-500 shadow-xl ring-2 ring-amber-500/10' : 'border border-slate-200 shadow-sm hover:shadow-md'}`} 
    ${className}`}>
    {active && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-bl-full pointer-events-none"></div>}
    {children}
  </div>
);

const Confetti = React.memo(({ active }) => {
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
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706', '#10b981'][Math.floor(Math.random() * 5)],
      speed: Math.random() * 5 + 3,
      angle: Math.random() * 360,
      spin: Math.random() * 8 - 4
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
  return <canvas ref={canvasRef} className="fixed inset-0 z-[100] pointer-events-none" />;
});

// ==================================================================================
// 2. DADOS E TEXTOS
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor", color: "text-zinc-400" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Cliente Bronze" : "Bronze Client", color: "text-orange-400" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Cliente Prata" : "Silver Client", color: "text-slate-300" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Membro VIP" : "VIP Member", color: "text-amber-400" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: isPT ? "CLÁSSICA" : "CLASSIC",
              title: isPT ? "Deep Release (Relaxante)" : "Deep Release",
              desc: isPT ? "Alívio profundo. O reset que seu corpo implora." : "Deep relief. The reset your body craves.",
              details: isPT ? `DETALHES DA SESSÃO:\n• TÉCNICA: Fusão de manobras manuais e Bamboo/Wood Therapy.\n• FOCO: Dissolver nódulos de tensão, stress e cansaço físico.\n• SENSAGEM: Leveza imediata e reequilíbrio energético.` : `SESSION DETAILS:\n• TECHNIQUE: Fusion of manual moves and Bamboo/Wood Therapy.\n• FOCUS: Dissolve tension knots, stress, and physical fatigue.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: isPT ? "SENSORIAL HOT" : "SENSORY HOT",
              title: isPT ? "Tântrica Sensitive (+ Lingam)" : "Tantric Sensitive (+ Lingam)",
              desc: isPT ? "Conexão total. Toques sutis que despertam cada nervo." : "Total connection. Subtle touches that wake up every nerve.",
              details: isPT ? `A EXPERIÊNCIA SENSORIAL:\n• O TOQUE: Plumagem e toques sutis que causam arrepios.\n• O CLÍMAX: Massagem Lingam (íntima) dedicada e respeitosa.\n• O OBJETIVO: Maximizar sua energia vital e prazer.` : `THE SENSORY EXPERIENCE:\n• THE TOUCH: Feathering and subtle touches causing chills.\n• THE CLIMAX: Dedicated and respectful Lingam (intimate) massage.`
            },
            { 
              id: 'mista', min: 60, price: 205, icon: Zap, tag: isPT ? "A MAIS VENDIDA" : "BEST SELLER",
              title: isPT ? "Fusion Premium (Mista)" : "Premium Fusion",
              desc: isPT ? "O melhor dos dois mundos. Relaxamento + Prazer Intenso." : "Best of both worlds. Relaxation + Intense Pleasure.",
              details: isPT ? `PROTOCOLO COMPLETO (60 MIN):\n• 1ª PARTE: Relaxamento muscular profundo para te "desarmar".\n• 2ª PARTE: Transição para a sensitiva com Body-to-Body (Nuru).\n• FINALIZAÇÃO: Tântrica completa com finalização garantida.` : `FULL PROTOCOL (60 MIN):\n• PART 1: Deep muscle relaxation to "disarm" you.\n• PART 2: Transition to sensitive with Body-to-Body (Nuru).\n• FINISH: Full tantric with guaranteed finish.`
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4 Sessions)", 
              price: 440, fullPrice: 500, savings: 60, 
              details: isPT ? "Garanta sua manutenção semanal de paz." : "Guarantee your weekly peace maintenance.", tag: isPT ? "2x XP (FIDELIDADE)" : "2x XP (LOYALTY)", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Pack Fusion (3 Sessões)" : "Fusion Pack (3 Sessions)", 
              price: 550, fullPrice: 615, savings: 65, 
              details: isPT ? "O atalho vip para o prazer frequente." : "The VIP shortcut to frequent pleasure.", tag: isPT ? "CAMPEÃO DE VENDAS" : "BEST SELLER", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: isPT ? "Assinatura VIP Alpha" : "Alpha VIP Sub", 
              price: 360, fullPrice: 460, savings: 100, 
              details: isPT ? "2 Sessões Completas/mês + Agenda Prioritária." : "2 Full Sessions/mo + Priority Booking.", tag: isPT ? "STATUS ELITE" : "ELITE STATUS", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa. Estenda o prazer." : "No rush. Extend the pleasure." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Inversão (Você Toca)" : "Switch (You Touch)", desc: isPT ? "Interação total permitida." : "Total interaction allowed." },
            { id: 'aroma', price: 15, icon: Wind, label: isPT ? "Aromaterapia Premium" : "Premium Aromatherapy", desc: isPT ? "Óleos importados p/ imersão." : "Imported oils for immersion." }
        ],
        reviews: [
            { n: "André S.", t: isPT ? "Cara, surreal. A 'Fusion' realmente entrega tudo. O Thalyson é muito pro." : "Dude, surreal. 'Fusion' really delivers. Thalyson is a pro.", s: 5 },
            { n: "Dr. Paulo", t: isPT ? "Higiene impecável e técnica apurada. Virei cliente fixo." : "Impeccable hygiene and refined technique. Became a regular.", s: 5 },
            { n: "M. (Sigilo)", t: isPT ? "O sigilo foi total. Atendeu no meu flat e foi super discreto. Recomendo." : "Total secrecy. Came to my flat, super discreet. Recommend.", s: 5 },
            { n: "Lucas G.", t: isPT ? "O toque dele é diferente, tem pressão e suavidade. Saí renovado." : "His touch is different, pressure and softness. Left renewed.", s: 5 },
            { n: "Roberto", t: isPT ? "Vale cada centavo. A melhor de SP/Londrina sem dúvidas." : "Worth every penny. Best in SP/Londrina undoubtedly.", s: 5 }
        ],
        text: {
            loading: isPT ? "INICIANDO SISTEMA..." : "STARTING SYSTEM...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Seu momento de desconexão começa agora." : "Your disconnection moment starts now.",
            tab_single: isPT ? "Sessão Avulsa" : "Single Session",
            tab_packs: isPT ? "Planos VIP" : "VIP Plans",
            reviews_btn: isPT ? "Ver 50+ Experiências Reais" : "See 50+ Real Experiences",
            select_time_title: isPT ? "Sua Reserva" : "Your Booking",
            date_sub: isPT ? "A agenda costuma lotar rápido." : "Schedule fills up fast.",
            location_title: isPT ? "Localização" : "Location",
            input_name: isPT ? "Como devo te chamar?" : "How should I call you?",
            input_addr: isPT ? "Endereço do Atendimento" : "Service Address",
            input_num: "Nº",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Complement",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Quarto" : "Room",
            motel_note: isPT ? "📍 Motel: Taxa da suíte por sua conta. Pagamento da massagem via Pix ou Espécie no local." : "📍 Motel: Suite fee on you. Massage payment via Pix or Cash on site.",
            pay_title: isPT ? "Forma de Pagamento" : "Payment Method",
            pay_pix: "Pix (Instantâneo)",
            pay_card: isPT ? "Cartão (Crédito/Débito)" : "Card",
            pay_cash: isPT ? "Espécie (Dinheiro)" : "Cash",
            extras_title: isPT ? "Turbinar Experiência" : "Boost Experience",
            coupon_title: isPT ? "Possui Convite?" : "Have an Invite?",
            coupon_placeholder: isPT ? "CÓDIGO..." : "CODE...",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            total_label: isPT ? "Investimento Total" : "Total Investment",
            book_btn: isPT ? "Confirmar Agendamento" : "Confirm Booking",
            next_btn: isPT ? "Continuar" : "Continue",
            uber_warning: isPT ? "*Uber calculado no WhatsApp" : "*Uber calculated on WhatsApp",
            success_title: isPT ? "Tudo Pronto!" : "All Set!",
            success_sub: isPT ? "Sua solicitação foi gerada. Finalize o envio no WhatsApp para garantir seu horário." : "Request generated. Finish sending on WhatsApp to secure your slot.",
            whatsapp_btn: isPT ? "Enviar Confirmação" : "Send Confirmation",
            back_home: isPT ? "Voltar" : "Back",
            today: isPT ? "HOJE" : "TODAY",
            tomorrow: isPT ? "AMANHÃ" : "TOMORROW",
            empty_date: isPT ? "Selecione uma data" : "Select a date",
            empty_slots: isPT ? "Agenda lotada neste dia." : "Fully booked.",
            details_label: isPT ? "O QUE ESPERAR:" : "WHAT TO EXPECT:",
            popup_welcome_title: isPT ? "Presente de Boas-vindas" : "Welcome Gift",
            popup_welcome_msg: isPT ? "Para começarmos bem, liberei um desconto exclusivo para sua primeira sessão." : "To start off well, I unlocked an exclusive discount for your first session.",
            popup_level_title: isPT ? "LEVEL UP!" : "LEVEL UP!",
            popup_level_msg: isPT ? "Você desbloqueou novos privilégios." : "You unlocked new privileges.",
            popup_btn_coupon: isPT ? "RESGATAR AGORA" : "REDEEM NOW",
            agree_terms: isPT ? "Li e aceito os termos e protocolo de saúde." : "I accept terms and health protocol.",
            terms_title: isPT ? "Protocolo de Segurança" : "Safety Protocol",
            terms_link: isPT ? "Ler termos completos" : "Read full terms",
            terms_btn: isPT ? "Entendido e De Acordo" : "Understood and Agreed",
            scarcity_msg: isPT ? "pessoas interessadas agora" : "people interested now",
            xp_label: "XP (Fidelidade)",
            level_label: isPT ? "Status" : "Status",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para ganhar R$ ${reward},00` : `${needed} XP to win $ ${reward}.00`,
            
            toast_error_item: isPT ? "Escolha uma experiência primeiro." : "Choose an experience first.",
            toast_error_date: isPT ? "Defina o dia e a hora." : "Set day and time.",
            toast_error_name: isPT ? "Preciso do seu nome." : "I need your name.",
            toast_error_addr: isPT ? "Preencha o endereço corretamente." : "Fill address correctly.",
            toast_error_terms: isPT ? "Aceite os termos de saúde." : "Accept health terms.",
            toast_success_coupon: isPT ? "Desconto aplicado!" : "Discount applied!",
            toast_error_coupon: isPT ? "Cupom inválido." : "Invalid coupon.",

            terms_body: [
                "1. HIGIENE: Banho prévio é indispensável. O atendimento preza pela limpeza extrema.",
                "2. SIGILO: Tudo que acontece na sessão, fica na sessão. Discrição absoluta garantida.",
                "3. RESPEITO: O ambiente é de relaxamento e prazer seguro. Respeito mútuo é a base.",
                "4. PAGAMENTO: Realizado conforme combinado (Pix antecipado ou no ato).",
                "5. SAÚDE (IMPORTANTE): Declaro estar em plenas condições físicas e mentais, não portando doenças infectocontagiosas ou condições que impeçam a massagem. Assumo total responsabilidade pelo meu bem-estar."
            ],

            zap: {
              intro: isPT ? "Oi Thalyson! 👋" : "Hi Thalyson! 👋",
              order_title: isPT ? "*SOLICITAÇÃO DE AGENDAMENTO*" : "*BOOKING REQUEST*",
              client: isPT ? "👤 *Cliente:*" : "👤 *Client:*",
              service: isPT ? "🔥 *Experiência:*" : "🔥 *Experience:*",
              date: isPT ? "📅 *Data:*" : "📅 *Date:*",
              location: isPT ? "📍 *Local:*" : "📍 *Location:*",
              payment: isPT ? "💸 *Pagamento:*" : "💸 *Payment:*",
              value: isPT ? "💰 *VALOR TOTAL:*" : "💰 *TOTAL VALUE:*",
              xp_status: isPT ? "🏆 *STATUS VIP:*" : "🏆 *VIP STATUS:*",
              health_check: isPT ? "✅ *Declaração de Saúde Aceita*" : "✅ *Health Declaration Accepted*",
              wait: isPT ? "Aguardo sua confirmação!" : "Waiting for confirmation!"
            }
        }
    };
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('single');
  
  // Marketing & Gamification
  const [viewers, setViewers] = useState(3);
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

  // Estado do Usuário e Agendamento
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

  // Inicialização (Simula carregamento e recupera dados)
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 1500); 
    
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({ ...prev, ...parsed, coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [] }));
            if(parsed.savedAddress) setBooking(b => ({...b, address: parsed.savedAddress}));
        }
    } catch (e) { console.error("Storage error", e); }
  }, []);

  // Persistência Automática
  useEffect(() => { 
      if(isClient && !loading) {
          try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch(e) {}
      }
  }, [user, isClient, loading]);

  // Popup de Boas Vindas
  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  // Reset do Scroll ao mudar de passo
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo({top: 0, behavior: 'smooth'}); }, [step]);

  // Gatilho de Escassez (Fake)
  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 5) + 2; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 4000);
  };

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  // Lógica Financeira
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const extData = DATA.extras.find(e=>e.id===k);
            if(extData) sub += extData.price; 
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  // Cálculo de XP
  const estimatedXP = useMemo(() => {
      const baseXP = financials.total;
      const isPack = booking.type === 'pack' || booking.type === 'subscription';
      const multiplier = isPack ? 1.5 : 1.0; 
      return Math.floor(baseXP * 0.2 * multiplier); 
  }, [financials.total, booking.type]);

  // Próximo Nível
  const getNextLevelInfo = (currentXP) => {
      if (currentXP >= 800) {
          const cycleXP = currentXP - 800;
          const nextRewardAt = 500 - (cycleXP % 500); 
          return { needed: nextRewardAt, reward: 50, title: "Prestige Master" }; 
      }
      const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
      return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };

  // Gerador de Link WhatsApp
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    
    let locTxt = "";
    if(booking.locationType === 'home') {
        locTxt = `🏡 ${booking.address.street}, ${booking.address.number}\n${booking.address.district} - ${booking.address.city}\n(Comp: ${booking.address.comp || '-'})`;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 ${T.zap.motel} (Combinar)`;
    } else {
        locTxt = `🏨 ${booking.address.placeName} (${booking.address.city})\nQuarto: ${booking.address.comp || '-'}`;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `➕ ${ext.label}` : '';
    }).join('\n');
    
    const msg = `
${T.zap.intro}
${T.zap.order_title}
────────────────
${T.zap.client} ${user.name}
${T.zap.service} ${booking.item?.title}
${T.zap.date} ${dateStr} às ${booking.time}

${extrasList ? `${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
────────────────
${T.zap.value} *R$ ${f.total},00*
${T.zap.payment} ${booking.payment.toUpperCase()}

${T.zap.health_check}
${T.zap.xp_status} +${estimatedXP} XP

${T.zap.wait}
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  // Validação
  const validateStep = () => {
      if (step === 0) {
          if(!booking.item) { addToast(T.toast_error_item, "error"); return false; }
          return true;
      }
      if (step === 1) {
          if (!booking.date || !booking.time) { addToast(T.toast_error_date, "error"); return false; }
          return true;
      }
      if (step === 2) {
          if (!user.name || user.name.trim().length < 3) { addToast(T.toast_error_name, "error"); return false; }
          if (booking.locationType === 'home' && (!booking.address.street || !booking.address.number)) {
              addToast(T.toast_error_addr, "error"); return false;
          }
          if (booking.locationType === 'hotel' && !booking.address.placeName) {
              addToast(T.toast_error_addr, "error"); return false;
          }
          return true;
      }
      if (step === 3) {
          if (!booking.termsAccepted) { addToast(T.toast_error_terms, "error"); return false; }
          return true;
      }
      return true;
  };

  const handleNext = () => {
      if(validateStep()) {
          if (step === 2) setUser(prev => ({...prev, savedAddress: booking.address}));
          if (step === 3) finishBooking(); 
          else setStep(s => s + 1);
      }
  };

  const handleApplyCoupon = () => {
      const code = couponInput.toUpperCase().trim();
      const validCodes = { 'THALYSON10': 10, 'VIP20': 20, 'WELCOME10': 10 };
      
      if(validCodes[code]) {
          const val = validCodes[code];
          setBooking(b => ({...b, appliedCoupon: { id: code, val, title: `🎟️ ${code}`, code }}));
          addToast(T.toast_success_coupon, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_error_coupon, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code);
    
    const newXP = Math.floor(user.xp + estimatedXP);
    let leveledUp = false;
    
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `L${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Nível ${lvl.title}`, code: `LVL${lvl.level}` });
        }
    });

    if (newXP >= 800 && Math.floor((newXP - 800) / 500) > Math.floor((user.xp - 800) / 500)) {
         leveledUp = true;
         updatedCoupons.push({ id: `P_${Date.now()}`, val: 50, title: `🏆 Prestige Bonus`, code: `PRESTIGE` });
    }

    if (leveledUp) setLevelUpPopup(true);
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: prev.ordersCount + 1 }));
    setShowConfetti(true);
    
    if (typeof window !== 'undefined') window.open(generateWhatsAppLink(), '_blank');
    setStep(4);
  };

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'];
      const d = new Date(booking.date);
      const now = new Date();
      if (d.getDate() === now.getDate() && d.getMonth() === now.getMonth()) {
          return slots.filter(t => parseInt(t.split(':')[0]) > now.getHours());
      }
      return slots;
  }, [booking.date]);

  // Tela de Carregamento
  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
        <div className="relative">
            <div className="absolute inset-0 bg-amber-500 blur-xl opacity-20 animate-pulse"></div>
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center relative z-10">
                <span className="text-3xl font-black text-amber-500 tracking-tighter">TM</span>
            </div>
        </div>
        <div className="mt-8 flex items-center gap-3">
            <Loader2 className="animate-spin text-amber-500" size={18}/>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">{T.text.loading}</span>
        </div>
      </div>
  );

  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-amber-500/30' : 'bg-slate-50 text-slate-900 selection:bg-amber-200'}`}>
      
      <Confetti active={showConfetti} />
      
      {/* TOASTS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-[90%] pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl animate-slide-down border backdrop-blur-xl ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
            {t.type === 'success' ? <Check size={18} strokeWidth={3}/> : <AlertTriangle size={18} strokeWidth={3}/>}
            <span className="text-xs font-bold shadow-black/10 drop-shadow-md">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl transition-all`}>
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setStep(0)}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-transform">TM</div>
          <div><span className="font-bold text-sm tracking-tight block">Thalyson</span><span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest">Personal</span></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}><Globe size={16}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={16}/> : <Moon size={16}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-full transition-all active:scale-90 ${isDark ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white' : 'bg-pink-100 text-pink-600'}`}><Instagram size={16}/></a>
        </div>
      </header>

      {/* CONTEÚDO */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        <div className={`fixed top-16 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>
        <div className="max-w-md mx-auto space-y-6 pt-2">

          {/* CATALOGO */}
          {step === 0 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight mb-2">{T.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                <p className={`text-sm font-medium leading-relaxed opacity-80 max-w-[80%]`}>{T.subtitle}</p>
              </div>

              {/* XP CARD */}
              <div className={`relative overflow-hidden rounded-[2rem] p-6 border shadow-2xl group ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-100'}`}>
                   <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                   <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 shadow-inner">
                                    <Trophy className={user.xp > 0 ? "text-amber-500" : "text-zinc-600"} size={24} strokeWidth={2.5} />
                                </div>
                                {user.xp > 800 && <div className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white">PRO</div>}
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 block mb-0.5">{T.level_label}</span>
                                <h3 className={`font-black text-xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-amber-600`}>
                                    {user.xp >= 800 ? "PRESTIGE VIP" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black block leading-none">{user.xp}</span>
                            <span className="text-[9px] font-bold opacity-40 uppercase">{T.xp_label}</span>
                        </div>
                   </div>
                   
                   {/* XP Progress Bar */}
                   <div className="mt-2 relative z-10">
                        <div className="flex justify-between text-[9px] font-bold opacity-50 mb-1.5 uppercase tracking-wide">
                            <span>Progress</span>
                            <span>{getNextLevelInfo(user.xp) ? T.missing_xp_msg(getNextLevelInfo(user.xp).needed, getNextLevelInfo(user.xp).reward) : "MAX LEVEL"}</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-950/50 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-1000 ease-out" 
                                 style={{width: `${user.xp >= 800 ? ((user.xp - 800) % 500 / 500 * 100) : (Math.min(100, (user.xp / (DATA.levels.find(l=>l.xpNeeded>user.xp)?.xpNeeded || 800)) * 100))}%`}}>
                            </div>
                        </div>
                   </div>
                   
                   <div className="mt-5 pt-4 border-t border-dashed border-zinc-800">
                        <button onClick={() => setReviewsOpen(true)} className="w-full flex items-center justify-between text-xs font-bold opacity-60 hover:opacity-100 transition-opacity">
                            <span className="flex items-center gap-1"><Star size={12} className="text-amber-500 fill-amber-500"/> 5.0 (50+ Reviews)</span>
                            <span className="flex items-center gap-1 text-amber-500">{lang==='pt'?'Ler relatos':'Read reviews'} <ChevronRight size={12}/></span>
                        </button>
                   </div>
              </div>

              {/* TABS */}
              <div className={`grid grid-cols-2 p-1.5 rounded-2xl relative ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark?'bg-zinc-800 text-white shadow-lg ring-1 ring-white/5':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark?'bg-zinc-800 text-white shadow-lg ring-1 ring-white/5':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><Package size={14}/> {T.tab_packs}</button>
              </div>

              {/* LISTA DE SERVIÇOS */}
              <div className="space-y-4 min-h-[300px]">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map(item => (
                   <Card key={item.id} isDark={isDark} active={booking.item?.id === item.id} onClick={() => { handleNext(); setBooking(b => ({...b, type: activeTab === 'single' ? 'single' : item.type, item, extras: {}})); }} className="group">
                       {item.tag && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10 tracking-widest uppercase">{item.tag}</div>}
                       
                       <div className="flex items-start gap-5">
                           <div className={`p-4 rounded-2xl transition-colors shrink-0 ${booking.item?.id === item.id ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-400 group-hover:text-amber-500' : 'bg-slate-100 text-slate-500')}`}>
                               <item.icon size={26} strokeWidth={1.5} />
                           </div>
                           <div className="flex-1 min-w-0">
                               <h3 className="font-bold text-lg leading-tight mb-1 truncate pr-16">{item.title}</h3>
                               <p className="text-xs opacity-60 leading-relaxed line-clamp-2">{item.desc}</p>
                           </div>
                       </div>

                       <div className="mt-5 flex items-end justify-between border-t border-dashed border-zinc-700/50 pt-4">
                           <div className="flex flex-col">
                               {item.fullPrice && <span className="text-xs line-through opacity-40 decoration-red-500/50">R$ {item.fullPrice}</span>}
                               <div className="flex items-baseline gap-1">
                                   <span className="text-sm font-medium opacity-60">R$</span>
                                   <span className={`text-2xl font-black tracking-tight ${booking.item?.id === item.id ? 'text-amber-500' : ''}`}>{item.price}</span>
                               </div>
                           </div>
                           <Button size="sm" variant={booking.item?.id === item.id ? 'primary' : 'secondary'} className="rounded-xl">
                               {booking.item?.id === item.id ? <Check size={14} /> : <ArrowRight size={14} />}
                           </Button>
                       </div>
                       
                       {booking.item?.id === item.id && (
                           <div className="mt-4 pt-4 border-t border-zinc-800 animate-slide-down">
                               <div className="p-4 rounded-xl bg-black/20 text-xs leading-relaxed opacity-90 font-medium whitespace-pre-line border border-white/5">
                                   <div className="flex items-center gap-2 mb-2 text-amber-500 font-bold uppercase tracking-widest text-[10px]"><Info size={12}/> {T.details_label}</div>
                                   {item.details}
                               </div>
                           </div>
                       )}
                   </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: DATA */}
          {step === 1 && (
            <div className="animate-slide-in">
                 <div className="text-center mb-8">
                     <h2 className="text-2xl font-black mb-1">{T.select_time_title}</h2>
                     <p className="text-xs font-bold uppercase tracking-widest opacity-50">{T.date_sub}</p>
                 </div>
                 
                 <div className="flex gap-2.5 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-2 snap-x">
                    {[...Array(14)].map((_, i) => { 
                         const d = new Date(); d.setDate(d.getDate() + i);
                         const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                         let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).replace('.','').toUpperCase();
                         if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                         return (
                            <button key={i} onClick={() => { setBooking(b => ({ ...b, date: d, time: null })); }} className={`snap-center min-w-[72px] h-20 rounded-2xl flex flex-col items-center justify-center gap-0.5 border-2 transition-all active:scale-95 duration-200 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-400')}`}>
                                <span className="text-[9px] font-black uppercase tracking-wider opacity-80">{lbl}</span>
                                <span className="text-xl font-bold">{d.getDate()}</span>
                            </button>
                         )
                    })}
                 </div>

                 {!booking.date ? (
                     <div className="flex flex-col items-center justify-center py-16 opacity-30 border-2 border-dashed border-zinc-700 rounded-3xl">
                         <Calendar size={48} className="mb-4 text-zinc-500"/>
                         <p className="font-bold text-sm">{T.empty_date}</p>
                     </div>
                 ) : (
                     <div className="animate-fade-in">
                         {generateTimeSlots.length > 0 ? (
                             <div className="grid grid-cols-3 gap-3">
                                 {generateTimeSlots.map(t => (
                                     <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }} className={`py-3.5 rounded-xl text-sm font-bold border transition-all active:scale-95 duration-200 relative overflow-hidden ${booking.time === t ? 'bg-zinc-100 text-black border-white shadow-xl scale-[1.02]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                                         {t}
                                     </button>
                                 ))}
                             </div>
                         ) : (
                             <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                                 <p className="text-sm font-bold opacity-60">{T.empty_slots}</p>
                             </div>
                         )}
                     </div>
                 )}
            </div>
          )}

          {/* STEP 2: LOCAL E EXTRAS */}
          {step === 2 && (
            <div className="animate-slide-in space-y-8">
                 <h2 className="text-2xl font-black text-center">{T.location_title}</h2>
                 
                 <div className={`grid grid-cols-3 gap-3 p-2 rounded-2xl ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                      {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                          <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 rounded-xl text-[10px] font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-40 hover:opacity-100'}`}>
                              <x.i size={20} strokeWidth={2}/> {x.l}
                          </button>
                      ))}
                 </div>

                 <div className="space-y-5">
                      <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} isDark={isDark} placeholder={lang === 'pt' ? "Seu Nome" : "Your Name"} />
                      
                      {booking.locationType === 'home' && (
                          <div className="space-y-4 animate-fade-in">
                              <div className="grid grid-cols-[1fr_80px] gap-3">
                                  <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} isDark={isDark} icon={MapPin} placeholder={lang === 'pt' ? "Rua / Av" : "Street"} />
                                  <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} isDark={isDark} placeholder="123" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                  <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} isDark={isDark} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                                  <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder="Londrina" />
                              </div>
                          </div>
                      )}
                 </div>

                 {booking.type === 'single' && (
                    <div className="pt-8 border-t border-dashed border-zinc-800/50">
                        <h3 className={`text-[10px] font-black uppercase mb-4 tracking-widest flex items-center gap-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Sparkles size={12}/> {T.extras_title}</h3>
                        <div className="space-y-3">
                           {DATA.extras.map(ex => (
                              <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] duration-200 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/50 ring-1 ring-amber-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200')}`}>
                                   <div className="flex items-center gap-4">
                                       <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}><ex.icon size={18}/></div>
                                       <div><p className="text-sm font-bold">{ex.label}</p><p className="text-[10px] opacity-60">{ex.desc}</p></div>
                                   </div>
                                   <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-amber-500' : 'opacity-30'}`}>+ R${ex.price}</span>
                              </div>
                           ))}
                        </div>
                    </div>
                 )}
            </div>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-8">
                 <div className="relative mb-8 group">
                      <div className={`p-8 rounded-[2rem] border relative overflow-hidden shadow-2xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-amber-500/50 rounded-b-full"></div>
                           <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                           <div className="text-center mb-6">
                               <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-3 inline-block border ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200'}`}>{booking.type === 'pack' ? 'Pacote' : 'Sessão Individual'}</span>
                               <h2 className="font-black text-2xl leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 mb-1">{booking.item.title}</h2>
                               <p className="text-xs opacity-60 font-mono">{new Date(booking.date).toLocaleDateString()} • {booking.time}</p>
                           </div>

                           <div className="space-y-3 border-y border-dashed border-zinc-800 py-6 mb-6 text-sm">
                               <div className="flex justify-between opacity-80"><span>Subtotal</span><span>R$ {booking.item.price}</span></div>
                               {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(<div key={k} className="flex justify-between text-amber-500/80 text-xs"><span>+ {DATA.extras.find(e=>e.id===k).label}</span><span>{DATA.extras.find(e=>e.id===k).price}</span></div>))}
                               {booking.appliedCoupon && (<div className="flex justify-between text-green-500 font-bold"><span>Desconto ({booking.appliedCoupon.code})</span><span>- R$ {booking.appliedCoupon.val}</span></div>)}
                           </div>

                           <div className="flex justify-between items-end">
                               <div className="flex flex-col"><span className="text-[10px] uppercase font-bold opacity-40">{T.total_label}</span><span className="text-[9px] text-amber-500/80">{T.uber_warning}</span></div>
                               <div className="text-right">
                                   <span className="block text-4xl font-black tracking-tighter text-amber-500">R$ {financials.total}</span>
                                   <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 mt-1"><Sparkles size={8}/> +{estimatedXP} XP</div>
                               </div>
                           </div>
                      </div>
                 </div>

                 <div className="flex gap-2 mb-6">
                      <div className="relative flex-1">
                          <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-10 py-3 rounded-xl border outline-none text-xs font-bold uppercase tracking-widest ${isDark ? 'bg-zinc-900 border-zinc-800 focus:border-amber-500' : 'bg-white border-slate-200'}`}/>
                          <Tag size={14} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"/>
                      </div>
                      <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
                 </div>

                 <div className="mb-8">
                     <h3 className="text-xs font-bold uppercase opacity-50 mb-3">{T.pay_title}</h3>
                     <div className="grid grid-cols-1 gap-2">
                         {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                             <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-5 py-4 rounded-xl border flex items-center gap-4 transition-all active:scale-[0.98] duration-200 ${booking.payment === p.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200')}`}>
                                 <p.i size={20}/>
                                 <span className="font-bold text-sm">{p.l}</span>
                                 {booking.payment === p.id && <Check size={18} className="ml-auto" strokeWidth={3}/>}
                             </button>
                         ))}
                     </div>
                 </div>

                 <div className={`p-4 rounded-2xl border transition-colors duration-300 ${booking.termsAccepted ? 'border-green-500/30 bg-green-500/5' : (isDark ? 'bg-zinc-900/50 border-red-500/30' : 'bg-amber-50 border-amber-200')}`}>
                      <div className="flex items-start gap-3 mb-3">
                           <Activity className={booking.termsAccepted ? "text-green-500" : "text-red-500"} size={20} />
                           <div>
                               <h4 className={`text-xs font-bold ${booking.termsAccepted ? 'text-green-500' : 'text-red-500'}`}>{T.terms_title}</h4>
                               <button onClick={() => setTermsOpen(true)} className="text-[10px] opacity-70 underline hover:text-white transition-colors">{T.terms_link}</button>
                           </div>
                      </div>
                      <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 cursor-pointer select-none group">
                          <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 accent-green-500 rounded cursor-pointer transition-transform group-active:scale-90"/>
                          <span className="text-xs font-bold leading-tight opacity-80 group-hover:opacity-100 transition-opacity">{T.agree_terms}</span>
                      </label>
                 </div>
            </div>
          )}

          {/* STEP 4: SUCESSO */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-10 text-center animate-scale-in">
                 <div className="relative mb-8">
                     <div className="absolute inset-0 bg-green-500 blur-3xl opacity-30 animate-pulse"></div>
                     <div className="w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 relative z-10 animate-bounce-slow">
                         <Check size={64} className="text-white drop-shadow-lg" strokeWidth={4}/>
                     </div>
                 </div>
                 <h1 className="text-4xl font-black mb-4 tracking-tight">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10 text-sm leading-relaxed">{T.success_sub}</p>
                 
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle} className="animate-pulse-slow">
                     {T.whatsapp_btn}
                 </Button>
                 
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-[10px] font-black uppercase opacity-30 tracking-[0.2em] hover:opacity-100 p-4 transition-all hover:tracking-[0.3em]">
                     {T.back_home}
                 </button>
            </div>
          )}
        </div>
      </main>

      {/* FIXED FOOTER NAVIGATION */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className={`w-full p-4 backdrop-blur-xl border-t transition-all duration-300 ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="icon" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="icon" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    <button 
                      onClick={handleNext} 
                      className={`flex-1 h-14 rounded-2xl font-black text-xs flex items-center justify-between px-6 transition-all shadow-xl active:scale-[0.98] group ${step < 3 ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-black shadow-amber-500/20' : 'bg-green-500 text-white shadow-green-500/30'}`}
                    >
                      <span className="uppercase tracking-widest">{step === 3 ? T.book_btn : T.next_btn}</span>
                      {booking.item && (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[9px] opacity-60 font-medium mb-0.5">TOTAL</span>
                          <span className="text-base font-black whitespace-nowrap">R$ {financials.total}</span>
                        </div>
                      )}
                      {!booking.item && <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform"/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODAL: REVIEWS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black">Feedback Real</h3><button onClick={()=>setReviewsOpen(false)} className="p-2 bg-zinc-800 rounded-full hover:bg-zinc-700 transition-colors"><X size={20}/></button></div>
            <div className="space-y-4">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className="p-6 rounded-3xl border border-zinc-800 bg-zinc-800/30 relative">
                       <Quote size={20} className="absolute top-6 right-6 text-amber-500 opacity-20" />
                       <div className="flex items-center gap-3 mb-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center font-black text-black">{r.n.charAt(0)}</div>
                           <div><p className="font-bold text-sm">{r.n}</p><div className="flex text-amber-500 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div></div>
                       </div>
                       <p className="text-sm opacity-80 leading-relaxed italic">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      {/* MODAL: TERMS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-black text-amber-500">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-2 bg-zinc-800 rounded-full"><X size={20}/></button></div>
            <div className="space-y-4">
                {T.terms_body.map((t,i)=>(
                    <div key={i} className={`flex gap-4 p-5 rounded-2xl border ${i === 4 ? 'bg-red-500/10 border-red-500/30' : 'bg-zinc-800/50 border-zinc-700/50'}`}>
                        <span className={`font-black text-xl opacity-50 ${i === 4 ? 'text-red-500' : 'text-zinc-500'}`}>{i+1}</span>
                        <p className={`text-sm leading-relaxed ${i === 4 ? 'text-red-200 font-bold' : 'opacity-80'}`}>{t.substring(3)}</p>
                    </div>
                ))}
                <Button full onClick={()=>{setTermsOpen(false); setBooking(b=>({...b, termsAccepted: true}));}} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {/* POPUP: LEVEL UP */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-10 rounded-[3rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-amber-500/20 bg-zinc-900 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-60 h-60 bg-amber-500 blur-[100px] opacity-30 animate-pulse-slow"></div>
                
                <div className="w-28 h-28 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(245,158,11,0.6)] animate-bounce"><Trophy size={56} className="text-white drop-shadow-lg" /></div>
                
                <h2 className="text-4xl font-black mb-2 italic tracking-tighter text-white">{T.popup_level_title}</h2>
                <p className="opacity-70 text-base leading-relaxed mb-10 text-zinc-300">{T.popup_level_msg}</p>
                <Button full size="xl" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {/* POPUP: WELCOME */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-zinc-800 bg-zinc-900">
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-700"><Gift size={40} className="text-amber-500" /></div>
                <h2 className="text-2xl font-black mb-2 text-white">{T.popup_welcome_title}</h2>
                <p className="opacity-60 text-sm leading-relaxed mb-8 text-zinc-300">{T.popup_welcome_msg}</p>
                
                <div className="bg-black/50 p-4 rounded-2xl border border-dashed border-zinc-700 mb-6 relative group cursor-pointer" onClick={() => { navigator.clipboard.writeText('WELCOME10'); addToast('Copiado!', 'success'); }}>
                    <p className="text-[9px] uppercase font-bold text-zinc-500 mb-1">Seu Código Exclusivo:</p>
                    <p className="text-xl font-mono font-black text-amber-500 tracking-[0.2em]">WELCOME10</p>
                    <Copy size={12} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-white transition-colors"/>
                </div>
                
                <Button full variant="primary" onClick={()=>{
                    setWelcomePopup(false); 
                    setUser(u=>({...u, hasSeenWelcome: true}));
                    const welcomeCoupon = { id: 'WELCOME10', val: 10, title: '🎁 Welcome', code: 'WELCOME10' };
                    setBooking(b => ({...b, appliedCoupon: welcomeCoupon}));
                    addToast(T.toast_success_coupon, "success");
                }}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar{display:none}
        .animate-fade-in{animation:fadeIn 0.6s ease-out}
        .animate-slide-up{animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1)}
        .animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)}
        .animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)}
        .animate-bounce-slow{animation:bounce 3s infinite}
        .animate-pulse-slow{animation:pulse 3s infinite}
        .animate-slide-down{animation:slideDown 0.3s ease-out}
        .animate-shake{animation:shake 0.5s cubic-bezier(.36,.07,.19,.97) both}
        .pb-safe{padding-bottom:env(safe-area-inset-bottom,24px)}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes scaleIn{from{transform:scale(0.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes shake{10%,90%{transform:translate3d(-1px,0,0)}20%,80%{transform:translate3d(2px,0,0)}30%,50%,70%{transform:translate3d(-4px,0,0)}40%,60%{transform:translate3d(4px,0,0)}}
      `}</style>
    </div>
  );
}
