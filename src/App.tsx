import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  ChevronRight, Lock, History, User, Wallet, Share2, Copy, Quote, Smile
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v17.0 - ULTIMATE UX & XP
 * ==================================================================================
 * NOVIDADES:
 * 1. [VISUAL] Interface "Clean Glass": Menos bordas, mais profundidade, fontes refinadas.
 * 2. [XP LOGIC] Cálculo dinâmico de XP visível no Checkout. Packs dão Multiplicador 2x.
 * 3. [PERFORMANCE] Otimização de renderização e áreas de toque maiores.
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v17_data', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 2. DESIGN SYSTEM (REFINED)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  // Mais tátil, sombra suave, feedback de clique rápido
  const baseStyle = "relative flex items-center justify-center font-bold tracking-wide transition-all duration-200 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-2xl overflow-hidden";
  
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/25 border border-amber-400/50",
    secondary: "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-100 border border-zinc-700 backdrop-blur-md",
    whatsapp: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/30 border border-green-500/20",
    outline: "bg-transparent border-2 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
  };
  
  const sizes = { sm: "h-10 text-xs px-4", md: "h-14 text-sm px-6", lg: "h-16 text-base px-8", xl: "h-20 text-lg px-8" };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={20} className="animate-spin mr-2"/> : (Icon && <Icon size={20} className="mr-2" strokeWidth={2.5} />)}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 opacity-70 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${isDark ? 'text-zinc-600 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>{Icon && <Icon size={20} />}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none text-sm font-medium transition-all duration-300 ${error ? 'border-red-500/50 focus:border-red-500 bg-red-500/5' : (isDark ? 'bg-zinc-900/40 border-zinc-800/60 text-zinc-100 focus:border-amber-500 focus:bg-zinc-900' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500')}`} />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 font-bold animate-slide-in">{error}</p>}
  </div>
);

const Card = ({ children, isDark, className = '', onClick, active = false }) => (
  <div onClick={onClick} className={`relative p-6 rounded-[1.5rem] transition-all duration-300 ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''} ${isDark ? `bg-zinc-900/60 backdrop-blur-md ${active ? 'border-2 border-amber-500/80 bg-zinc-800/80 shadow-xl shadow-amber-900/10' : 'border border-zinc-800/60 hover:border-zinc-700 hover:bg-zinc-800/40'}` : `bg-white ${active ? 'border-2 border-amber-500 shadow-lg' : 'border border-slate-100 shadow-sm hover:shadow-md'}`} ${className}`}>
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
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 3 + 2,
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
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor", color: "text-zinc-400" },
            { level: 2, xpNeeded: 150, reward: 15, title: isPT ? "Cliente Bronze" : "Bronze Client", color: "text-orange-400" },
            { level: 3, xpNeeded: 450, reward: 30, title: isPT ? "Cliente Prata" : "Silver Client", color: "text-slate-300" },
            { level: 4, xpNeeded: 900, reward: 50, title: isPT ? "Membro VIP" : "VIP Member", color: "text-amber-400" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 90, icon: Wind, tag: isPT ? "PARA RELAXAR" : "RELAXING",
              title: isPT ? "Relaxante (Rolos de Madeira)" : "Wood Therapy Relax",
              desc: isPT ? "O alívio imediato para o cansaço do dia a dia." : "Immediate relief for daily tiredness.",
              details: isPT ? `COMO É A SESSÃO?
• TÉCNICA: Uso meus rolos de madeira para soltar suas costas e pernas.
• SEM DOR: É para relaxar, não para machucar. Deslizo a madeira para tirar o peso do corpo.
• FINALIZAÇÃO: Termino com as mãos para garantir que relaxou tudo.` : `HOW IS THE SESSION?
• TECHNIQUE: Using wood rollers to release back and legs.
• PAINLESS: Focused on pain relief and tiredness.`
            },
            { 
              id: 'sensitiva', min: 60, price: 160, icon: Flame, tag: isPT ? "SENSORIAL" : "SENSORY",
              title: isPT ? "Sensitiva Tântrica (+ Lingam)" : "Tantric Sensitive (+ Lingam)",
              desc: isPT ? "Uma jornada de sensações do início ao fim." : "A journey of sensations from start to finish.",
              details: isPT ? `O QUE ROLA NESSA SESSÃO:
• SENSORIAL: Toques bem leves (ponta dos dedos) para te dar arrepios.
• LINGAM: Inclui a massagem na parte íntima (pênis e testículos).
• OBJETIVO: Te dar o máximo de prazer.` : `WHAT HAPPENS:
• SENSORY: Very light touches to give you chills.
• LINGAM: Includes intimate massage.
• GOAL: Give you maximum pleasure.`
            },
            { 
              id: 'mista', min: 60, price: 200, icon: Zap, tag: isPT ? "PREFERIDA" : "FAVORITE",
              title: isPT ? "Experiência Mista Completa" : "Full Mixed Experience",
              desc: isPT ? "A fusão perfeita: Relaxamento profundo + Intensidade." : "The perfect fusion: Deep relaxation + Intensity.",
              details: isPT ? `A MAIS COMPLETA (60min):
• INTENSIDADE: Aumento para a sensitiva e entro no corpo a corpo (Body to Body).
• LINGAM: Fecho com a tântrica caprichada.
• FINAL: Você goza no final, sem pressa.` : `THE MOST COMPLETE (60min):
• INTENSITY: Increases to sensitive and Body to Body.
• LINGAM: Finishes with detailed tantric massage.
• FINISH: You cum at the end, no rush.`
            }
        ],
        plans: [
            { id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4 Sessions)", price: 320, fullPrice: 360, savings: 40, details: isPT ? "4 sessões Relaxantes para usar em 45 dias." : "4 Relax sessions valid for 45 days.", tag: isPT ? "MAIS XP (+Bônus)" : "MORE XP", icon: Package },
            { id: 'pack_mista', type: 'pack', title: isPT ? "Pack Mista (3 Sessões)" : "Full Pack (3 Sessions)", price: 540, fullPrice: 600, savings: 60, details: isPT ? "3 sessões Completas. O melhor custo-benefício." : "3 Full sessions. Best value.", tag: isPT ? "MAIS VENDIDO" : "BEST SELLER", icon: Zap },
            { id: 'vip_club', type: 'subscription', title: isPT ? "Clube VIP Mensal" : "VIP Monthly Club", price: 350, fullPrice: 450, savings: 100, details: isPT ? "2 Sessões Mistas/mês + Prioridade na agenda." : "2 Full Sessions/mo + Priority.", tag: isPT ? "STATUS VIP" : "VIP STATUS", icon: Crown }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Para curtir sem pressa." : "Enjoy without rush." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Troca (Você Toca)" : "Switch (You Touch)", desc: isPT ? "Liberdade para tocar." : "Freedom to touch." },
            { id: 'aroma', price: 5, icon: Wind, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Óleos essenciais." : "Essential oils." }
        ],
        reviews: [
            { n: "Tiago", t: isPT ? "A sensitiva foi uma experiência de outro mundo." : "Amazing experience.", s: 5 },
            { n: "Pedro H.", t: isPT ? "Fui estressado e saí flutuando." : "Came out floating.", s: 5 },
            { n: "M. (Sigilo)", t: isPT ? "O sigilo é garantido mesmo. Pode confiar." : "Secrecy guaranteed.", s: 5 },
            { n: "Cliente", t: isPT ? "Vale cada centavo. Atendimento premium." : "Worth every penny.", s: 5 },
        ],
        text: {
            loading: isPT ? "INICIANDO..." : "STARTING...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Seu momento de relaxamento começa aqui." : "Your relaxation moment starts here.",
            tab_single: isPT ? "Sessão Avulsa" : "Single Session",
            tab_packs: isPT ? "Planos & Packs" : "Plans & Packs",
            reviews_btn: isPT ? "Ver avaliações (+50)" : "See reviews (+50)",
            select_time_title: isPT ? "Escolha o Horário" : "Select Time",
            date_sub: isPT ? "Agenda atualizada em tempo real" : "Schedule updated in real time",
            location_title: isPT ? "Onde será o atendimento?" : "Where will it be?",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Unit/Apt",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Quarto" : "Room",
            motel_note: isPT ? "Suíte (Motel): Você paga a taxa da suíte direto no local. O valor da massagem + extras combinamos no WhatsApp." : "Suite (Motel): You pay the suite fee at the location. Massage + extras fees are arranged on WhatsApp.",
            pay_title: isPT ? "Forma de Pagamento" : "Payment Method",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Turbinar Sessão" : "Boost Session",
            coupon_placeholder: isPT ? "Cupom..." : "Coupon...",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            total_label: isPT ? "Total Estimado" : "Estimated Total",
            book_btn: isPT ? "Finalizar Agendamento" : "Finish Booking",
            next_btn: isPT ? "Continuar" : "Continue",
            uber_warning: isPT ? "Uber (Se houver) calculado no WhatsApp" : "Uber fee calculated on WhatsApp",
            success_title: isPT ? "Agendamento Criado!" : "Booking Created!",
            success_sub: isPT ? "Tudo pronto. Vamos confirmar os detalhes finais no WhatsApp agora." : "All set. Let's confirm final details on WhatsApp.",
            whatsapp_btn: isPT ? "Abrir WhatsApp" : "Open WhatsApp",
            back_home: isPT ? "Início" : "Home",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            empty_date: isPT ? "Escolha uma data acima" : "Select a date above",
            empty_slots: isPT ? "Sem horários livres" : "No slots free",
            details_label: isPT ? "INFO:" : "INFO:",
            popup_welcome_title: isPT ? "Presente pra você!" : "A gift for you!",
            popup_welcome_msg: isPT ? "Ganhe R$ 10,00 de desconto na sua primeira sessão." : "Get $10 off your first session.",
            popup_level_title: isPT ? "LEVEL UP!" : "LEVEL UP!",
            popup_level_msg: isPT ? "Você subiu de nível! Novos benefícios desbloqueados." : "You leveled up! New benefits unlocked.",
            popup_btn_coupon: isPT ? "RESGATAR" : "REDEEM",
            agree_terms: isPT ? "Concordo com os protocolos de higiene e segurança." : "I agree with hygiene and safety protocols.",
            terms_title: isPT ? "Protocolos" : "Protocols",
            terms_link: isPT ? "Ler termos" : "Read terms",
            terms_btn: isPT ? "Entendi" : "Understood",
            scarcity_msg: isPT ? "pessoas vendo agora" : "people viewing now",
            xp_label: "XP",
            level_label: isPT ? "Nível" : "Level",
            max_level: isPT ? "Nível Máximo" : "Max Level",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para prêmio de R$ ${reward}` : `${needed} XP to $ ${reward} reward`,
            toast_select_item: isPT ? "Selecione um serviço para continuar." : "Select a service to continue.",
            toast_select_date: isPT ? "Escolha data e horário." : "Choose date and time.",
            toast_fill_name: isPT ? "Preencha seu nome." : "Fill your name.",
            toast_fill_addr: isPT ? "Endereço incompleto." : "Incomplete address.",
            toast_fill_hotel: isPT ? "Preencha dados do hotel." : "Fill hotel details.",
            toast_select_pay: isPT ? "Selecione pagamento." : "Select payment.",
            toast_accept_terms: isPT ? "Aceite os termos." : "Accept terms.",
            toast_coupon_success: isPT ? "Desconto aplicado!" : "Discount applied!",
            toast_coupon_error: isPT ? "Cupom inválido." : "Invalid coupon.",

            zap: {
              intro: isPT ? "Olá Thalyson! 👋" : "Hi Thalyson! 👋",
              section_serv: isPT ? "💆‍♂️ *PEDIDO:*" : "💆‍♂️ *ORDER:*"
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
  const [isDark, setIsDark] = useState(true);
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

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
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

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 1500);
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({...prev, ...parsed, coupons: Array.isArray(parsed.coupons) ? parsed.coupons : []}));
            if(parsed.savedAddress) setBooking(b => ({...b, address: parsed.savedAddress}));
        } else {
            setUser(p => ({...p, coupons: [{ id: 'WELCOME10', val: 10, title: '🎁 Cupom Welcome', code: 'WELCOME10' }]}));
        }
    } catch (e) {}
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2000);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  useEffect(() => { 
      if(isClient && !loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 5) + 2; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 3500);
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({
          ...prev, type: type, item: item, extras: {}, payment: '', appliedCoupon: null, termsAccepted: false
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
          return slots.filter(time => parseInt(time.split(':')[0]) > currentHour + 1);
      }
      return slots;
  }, [booking.date]);

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
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  // LOGICA XP DINAMICA - PACKS GANHAM MAIS
  const xpEarned = useMemo(() => {
      if(!financials.total) return 0;
      // Multiplicador base de 10% do valor
      const baseXP = financials.total * 0.1;
      // Packs e Assinaturas ganham 2x XP para incentivar
      const multiplier = (booking.type === 'pack' || booking.type === 'subscription') ? 2 : 1;
      return Math.floor(baseXP * multiplier);
  }, [financials.total, booking.type]);

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    let locTxt = "";
    
    if(booking.locationType === 'home') {
        locTxt = `🏠 *Local:* Residência\n📍 ${booking.address.street}, ${booking.address.number} - ${booking.address.district}\n📝 *Comp:* ${booking.address.comp || '-'}`;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 *Local:* Suíte (Motel)\n⚠️ (Taxa da suíte paga no local)\n⚠️ (Combinar valor total da massagem no chat)`;
    } else {
        locTxt = `🏨 *Local:* Hotel ${booking.address.placeName}\n📍 Cidade: ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `✅ + ${ext.label}` : '';
    }).join('\n');
    
    const msg = `
${T.zap.intro}
Quero agendar:

⚡ *${booking.item?.title}*
📅 ${dateStr} às ${booking.time}

${extrasList ? `*Extras:*\n${extrasList}\n` : ''}
${locTxt}

💰 *Valor:* R$ ${f.total},00
💳 *Pagamento:* ${booking.payment}
🚗 *Uber:* A calcular
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const validateStep = () => {
      if (step === 0) return booking.item ? true : (addToast(T.toast_select_item, "error"), false);
      if (step === 1) return (booking.date && booking.time) ? true : (addToast(T.toast_select_date, "error"), false);
      if (step === 2) {
          if (!user.name || user.name.length < 3) return (addToast(T.toast_fill_name, "error"), false);
          if (booking.locationType === 'home' && (!booking.address.street || !booking.address.number)) return (addToast(T.toast_fill_addr, "error"), false);
          if (booking.locationType === 'hotel' && !booking.address.placeName) return (addToast(T.toast_fill_hotel, "error"), false);
          return true;
      }
      if (step === 3) {
          if (!booking.payment) return (addToast(T.toast_select_pay, "error"), false);
          if (!booking.termsAccepted) return (addToast(T.toast_accept_terms, "error"), false);
          return true;
      }
      return true;
  };

  const handleNextStep = () => {
      if(validateStep()) {
          if (step === 2) setUser(prev => ({...prev, savedAddress: booking.address}));
          if (step === 3) finishBooking(); else setStep(s => s + 1);
      }
  };

  const handleApplyCoupon = () => {
      if(!couponInput) return;
      const code = couponInput.toUpperCase();
      if(['THALYSON10', 'VIP20', 'WELCOME10'].includes(code)) {
          const val = code === 'VIP20' ? 20 : 10;
          setBooking(b => ({...b, appliedCoupon: { id: code, val, title: `🎟️ ${code}`, code }}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_coupon_error, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    if (booking.appliedCoupon?.id.includes('WELCOME')) updatedCoupons = updatedCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    
    // XP CALCULADO DINAMICAMENTE
    const newXP = Math.floor(user.xp + xpEarned);
    
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Prêmio Nível ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });

    if (leveledUp) setLevelUpPopup(true);
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: prev.ordersCount + 1 }));
    setShowConfetti(true);
    if (typeof window !== 'undefined') window.open(generateWhatsAppLink(), '_blank');
    setStep(4);
  };

  const getCurrentLevelProgress = () => {
      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };

  const nextLevelInfo = DATA.levels.find(l => l.xpNeeded > user.xp);

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative"><div className="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center animate-pulse shadow-2xl shadow-amber-500/50"><span className="text-3xl font-black text-black tracking-tighter">TM</span></div></div>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl animate-slide-down border backdrop-blur-xl ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400/50' : 'bg-red-500/90 text-white border-red-400/50'}`}>
            {t.type === 'success' ? <Check size={18} strokeWidth={3}/> : <AlertTriangle size={18} strokeWidth={3}/>}
            <span className="text-xs font-bold tracking-wide">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />
      
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-500 transform ${showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-white/10 backdrop-blur-xl text-white px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20">
               <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.8)]"></span>
               <span className="text-[10px] font-bold tracking-wider uppercase">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <header className={`h-20 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80' : 'bg-white/80'} backdrop-blur-md`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-sm shadow-lg shadow-amber-500/20">TM</div>
          <div className="flex flex-col"><span className="font-bold text-sm tracking-tight leading-none">Thalyson</span><span className="text-[9px] uppercase font-bold text-amber-500 tracking-[0.2em] leading-none mt-1">Massagens</span></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full transition-all bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-lg`}><Instagram size={18}/></a>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-44 scroll-smooth relative">
        <div className="max-w-md mx-auto space-y-8">

          {/* STEP 0: CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8 mt-2">
                <h1 className="text-3xl font-black tracking-tight mb-2">{T.welcome} <span className="text-amber-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                <p className={`text-sm font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                {/* XP CARD REFINED */}
                <div className="relative mt-6 rounded-[2rem] p-6 overflow-hidden border border-amber-500/20 shadow-2xl bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/30"></div>
                    <div className="relative z-10 flex justify-between items-center mb-4">
                        <div>
                             <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500">{T.level_label}</span>
                             <h3 className="text-xl font-black text-white mt-0.5">{DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title}</h3>
                        </div>
                        <div className="text-right">
                             <span className="block text-3xl font-black text-amber-500">{user.xp}</span>
                             <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">XP Total</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                         <div className="flex justify-between text-[9px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">
                             <span>Progress</span>
                             <span>{nextLevelInfo ? `${nextLevelInfo.xpNeeded} XP` : 'MAX'}</span>
                         </div>
                         <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                             <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000" style={{width: `${getCurrentLevelProgress()}%`}}></div>
                         </div>
                    </div>
                </div>
                
                <div className="flex justify-end mt-4">
                    <button onClick={() => setReviewsOpen(true)} className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"><div className="flex text-amber-500"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>{T.reviews_btn}</button>
                </div>
              </div>

              <div className={`grid grid-cols-2 p-1.5 rounded-2xl mb-8 relative ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark?'bg-zinc-800 text-white shadow-lg ring-1 ring-white/5':'bg-white text-black shadow-lg') : 'opacity-40 hover:opacity-100'}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark?'bg-zinc-800 text-white shadow-lg ring-1 ring-white/5':'bg-white text-black shadow-lg') : 'opacity-40 hover:opacity-100'}`}><Package size={14}/> {T.tab_packs}</button>
              </div>

              <div className="space-y-4 animate-slide-in">
                {(activeTab === 'single' ? DATA.services : DATA.plans).map(item => (
                   <Card key={item.id} isDark={isDark} active={booking.item?.id === item.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : item.type, item)}>
                       {item.tag && (<div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10 tracking-widest uppercase">{item.tag}</div>)}
                       <div className="flex items-start justify-between mb-4">
                           <div className={`p-4 rounded-2xl ${booking.item?.id === item.id ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500')}`}><item.icon size={28}/></div>
                           <div className="text-right">
                               <span className="block text-2xl font-black tracking-tight">{T.currency || 'R$'} {item.price}</span>
                               {activeTab === 'packs' && <span className="text-xs line-through opacity-40 font-medium decoration-red-500">{T.currency || 'R$'} {item.fullPrice}</span>}
                               {activeTab === 'single' && <span className="text-[10px] font-bold opacity-50 uppercase">{item.min} min</span>}
                           </div>
                       </div>
                       <h3 className="font-bold text-lg leading-tight mb-2">{item.title}</h3>
                       <p className={`text-sm leading-relaxed mb-4 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{item.desc}</p>
                       {booking.item?.id === item.id && (<div className={`p-4 rounded-xl text-xs leading-relaxed animate-fade-in border ${isDark ? 'bg-black/20 border-zinc-700/50 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><div className="flex items-center gap-2 font-bold mb-2 text-amber-500"><Info size={12}/> {T.details_label}</div><p className="whitespace-pre-line opacity-90">{item.details}</p></div>)}
                   </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-10">
                 <h2 className="text-2xl font-black mb-2">{T.select_time_title}</h2>
                 <p className={`text-xs uppercase tracking-widest font-bold opacity-50`}>{T.date_sub}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 mb-6">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[80px] h-24 rounded-[1.2rem] flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 active:scale-95 duration-200 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-400')}`}>
                      <span className="text-[10px] font-black uppercase tracking-wider opacity-70">{lbl}</span><span className="text-2xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              
              {booking.date ? (
                  generateTimeSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                       {generateTimeSlots.map(t => (
                           <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }} className={`py-4 rounded-xl text-sm font-bold border-2 transition-all active:scale-95 duration-200 ${booking.time === t ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                               {t}
                           </button>
                       ))}
                    </div>
                  ) : (<div className="text-center py-12 opacity-50 bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed"><p className="font-bold">{T.empty_slots}</p></div>)
              ) : (<div className="text-center py-16 opacity-30 border-2 border-dashed border-zinc-800 rounded-3xl"><Calendar size={48} className="mx-auto mb-4"/><p className="font-bold text-sm uppercase tracking-widest">{T.empty_date}</p></div>)}
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-black text-center mb-8">{T.location_title}</h2>
              <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-2xl mb-8 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 rounded-xl text-[10px] uppercase font-black tracking-wider flex flex-col items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow-md ring-1 ring-white/10' : 'bg-white text-black shadow-md') : 'opacity-40 hover:opacity-100'}`}>
                        <x.i size={20}/> {x.l.split(' ')[0]}
                    </button>
                 ))}
              </div>
              <div className="space-y-6">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} isDark={isDark} placeholder={lang === 'pt' ? "Nome Completo" : "Full Name"} />
                 
                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_90px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} isDark={isDark} icon={MapPin} placeholder="Rua / Avenida" />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} isDark={isDark} placeholder="Nº" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} isDark={isDark} placeholder="Bairro" />
                        <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder="Cidade" />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} placeholder="Apt / Bloco" />
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
                    <div className={`p-6 rounded-3xl border text-center text-sm leading-relaxed ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <Smartphone className="mx-auto mb-3 opacity-50" size={24}/>
                        {T.motel_note}
                    </div>
                 )}
              </div>

              {booking.type === 'single' && (
                  <div className="mt-10">
                     <h3 className={`text-[10px] font-black uppercase mb-4 tracking-widest opacity-60 ml-1`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all active:scale-[0.98] duration-200 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={20}/></div>
                                 <div><p className="text-sm font-bold">{ex.label}</p><p className="text-[10px] opacity-60 font-medium">{ex.desc}</p></div>
                             </div>
                             <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-amber-500' : 'opacity-30'}`}>+ {T.currency || 'R$'} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className="relative overflow-hidden rounded-[2rem] shadow-2xl bg-zinc-900 border border-zinc-800">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600"></div>
                   <div className="p-8">
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded mb-3 inline-block bg-zinc-800 text-zinc-400 tracking-widest`}>{booking.type === 'pack' ? (lang === 'pt'?'Pacote':'Pack') : (booking.type === 'subscription' ? (lang === 'pt'?'Assinatura':'Subscription') : (lang === 'pt'?'Sessão Avulsa':'Single Session'))}</span>
                       <h2 className="font-black text-3xl leading-none text-white mb-1">{booking.item.title}</h2>
                       <p className="text-xs font-medium text-zinc-500 mb-6">{booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                       
                       <div className="space-y-3 pb-6 border-b border-dashed border-zinc-800">
                           <div className="flex justify-between text-sm font-medium text-zinc-300"><span>Valor Base</span><span>{T.currency || 'R$'} {booking.item.price}</span></div>
                           {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                               const extraItem = DATA.extras.find(e=>e.id===k);
                               return extraItem ? (<div key={k} className="flex justify-between text-sm text-zinc-500"><span>+ {extraItem.label}</span><span>{extraItem.price}</span></div>) : null;
                           })}
                           {booking.appliedCoupon && (<div className="flex justify-between text-sm text-green-400 font-bold bg-green-900/20 p-2 rounded-lg border border-green-500/20"><span>Cupom ({booking.appliedCoupon.code})</span><span>- {T.currency || 'R$'} {booking.appliedCoupon.val}</span></div>)}
                       </div>

                       <div className="flex justify-between items-end mt-6">
                           <div>
                               <span className="text-[9px] font-bold uppercase text-zinc-600 block mb-1">{T.total_label}</span>
                               <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-1 rounded border border-amber-500/20 inline-block">{T.uber_warning}</span>
                           </div>
                           <div className="text-right">
                               <span className="block text-4xl font-black text-white tracking-tighter">{T.currency || 'R$'} {financials.total}</span>
                               {/* XP EARNED BADGE */}
                               <span className="text-xs font-bold text-amber-500 flex items-center justify-end gap-1 mt-1 opacity-80"><Sparkles size={12}/> +{xpEarned} XP</span>
                           </div>
                       </div>
                   </div>
               </div>

               <div className="mt-8">
                   <div className="relative">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-5 pr-20 py-4 rounded-2xl border-2 outline-none text-sm font-bold uppercase tracking-widest transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 focus:border-amber-500' : 'bg-white border-slate-200'}`}/>
                       <button onClick={handleApplyCoupon} className="absolute right-2 top-2 bottom-2 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors">{T.coupon_btn}</button>
                   </div>
                   {user.coupons.length > 0 && (
                       <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                           {user.coupons.map(c => {
                               const isApplied = booking.appliedCoupon?.id === c.id;
                               return (<button key={c.id} onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} className={`flex-shrink-0 px-3 py-2 rounded-lg border text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${isApplied ? 'border-green-500 bg-green-500/10 text-green-500' : 'border-zinc-800 bg-zinc-900 text-zinc-500'}`}>{c.title}</button>)
                           })}
                       </div>
                   )}
               </div>

               <div className="mt-10">
                   <h3 className="text-[10px] font-black uppercase opacity-50 mb-4 ml-1 tracking-widest">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-5 py-4 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] duration-200 ${booking.payment === p.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-black/20' : 'bg-zinc-800'}`}><p.i size={20}/></div>
                               <span className="font-bold text-sm block">{p.l}</span>
                               {booking.payment === p.id && <Check size={20} className="ml-auto" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>

               <div className={`mt-8 p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                         <ShieldCheck className="text-amber-500" size={20}/>
                         <p className="text-xs font-medium opacity-80 cursor-pointer underline" onClick={() => setTermsOpen(true)}>{T.agree_terms}</p>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 cursor-pointer select-none border border-white/5"><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 accent-amber-500 rounded cursor-pointer"/><span className="text-xs font-bold text-white">Confirmar leitura</span></label>
               </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-16 text-center animate-scale-in">
                 <div className="relative mb-8">
                     <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                     <div className="w-32 h-32 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/40 relative z-10 animate-bounce-slow border-4 border-black">
                         <Check size={64} className="text-white" strokeWidth={4}/>
                     </div>
                 </div>
                 <h1 className="text-4xl font-black mb-4 tracking-tight">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-12 text-sm leading-relaxed">{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-[10px] font-black uppercase opacity-40 tracking-[0.2em] hover:opacity-100 p-4 transition-opacity">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER NAV */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/90 to-transparent z-50 pointer-events-none">
            <div className="pointer-events-auto max-w-md mx-auto">
                <div className={`p-2.5 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border transition-colors duration-500 ${isDark ? 'bg-zinc-900/90 border-zinc-700/50' : 'bg-white/90 border-zinc-200'}`}>
                    {step > 0 && (<button onClick={()=>setStep(step-1)} className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-200'}`}><ChevronLeft size={24}/></button>)}
                    {step < 3 && booking.item && (<div className="flex-1 pl-2 animate-fade-in"><span className="block text-[9px] font-bold uppercase opacity-50 tracking-wider mb-0.5">{T.total_label}</span><span className="block text-2xl font-black tracking-tight text-amber-500">{T.currency || 'R$'} {financials.total}</span></div>)}
                    <button onClick={handleNextStep} className={`h-14 px-8 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 ${step < 3 ? 'ml-auto' : 'w-full'} bg-amber-500 text-black hover:bg-amber-400 hover:scale-[1.02] active:scale-95 ${validateStep() && step !== 3 ? 'animate-pulse' : ''}`}>
                        {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18} strokeWidth={3}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODAL: REVIEWS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2.5rem] p-6 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black">{T.reviews_btn}</h3><button onClick={()=>setReviewsOpen(false)} className="p-3 bg-zinc-800 rounded-full"><X size={18}/></button></div>
            <div className="space-y-4">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className={`p-5 rounded-3xl border relative ${isDark ? 'bg-zinc-800/30 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex justify-between mb-2">
                           <span className="font-bold text-sm text-white flex items-center gap-2">
                               <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-black font-black">{r.n.charAt(0)}</div>
                               {r.n}
                           </span>
                       </div>
                       <div className="flex text-amber-500 gap-0.5 mb-2">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                       <p className="text-sm opacity-80 font-medium italic">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      {/* MODAL: TERMS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2.5rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-3 bg-zinc-800 rounded-full"><X size={18}/></button></div>
            <div className="space-y-3">
                <p className="text-sm opacity-60 leading-relaxed mb-4">Ao agendar, você confirma que leu e concorda com:</p>
                {["Higiene Obrigatória", "Sigilo Total", "Respeito Mútuo", "Pagamento no Local"].map((t,i)=>(<div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-700/50"><Check className="text-amber-500 shrink-0" size={18} strokeWidth={3}/><p className="text-sm font-bold">{t}</p></div>))}
                <div className="mt-4"><Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button></div>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className={`relative p-8 rounded-[3rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem] pointer-events-none"><div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500 blur-[90px] opacity-20"></div></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce"><Trophy size={48} className="text-black" /></div>
                <h2 className="text-3xl font-black mb-2 italic tracking-tight text-amber-500">{T.popup_level_title}</h2><p className="opacity-80 text-sm font-medium leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 rounded-[3rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl rotate-6 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-700"><Gift size={40} className="text-amber-500" /></div>
                <h2 className="text-2xl font-black mb-2">{T.popup_welcome_title}</h2><p className="opacity-70 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-black/40 p-4 rounded-2xl border border-dashed border-zinc-700 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Seu Código:</p><p className="text-2xl font-mono font-black text-white tracking-widest">WELCOME10</p></div>
                <Button full variant="primary" onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.6s ease-out}.animate-slide-up{animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-scale-in{animation:scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1)}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.3s ease-out}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
