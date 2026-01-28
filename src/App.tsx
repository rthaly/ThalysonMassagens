import React, { useState, useEffect, useMemo, useRef, useCallback, useReducer } from 'react';
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
 * CONFIGURAÇÕES GERAIS & CONSTANTES
 * ==================================================================================
 */
const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v18_senior', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// Dados estáticos movidos para fora do ciclo de renderização para performance
const DATA_SOURCE = {
  pt: {
    levels: [
      { level: 1, xpNeeded: 0, reward: 0, title: "Visitante", color: "text-zinc-400" },
      { level: 2, xpNeeded: 100, reward: 15, title: "Cliente Bronze", color: "text-orange-400" },
      { level: 3, xpNeeded: 350, reward: 30, title: "Cliente Prata", color: "text-slate-300" },
      { level: 4, xpNeeded: 800, reward: 50, title: "Membro VIP", color: "text-amber-400" }
    ],
    services: [
      { 
        id: 'relaxante', min: 60, price: 125, icon: Wind, tag: "PARA RELAXAR",
        title: "Relaxante (Rolos de Madeira)",
        desc: "O alívio imediato para o cansaço do dia a dia.",
        details: `COMO É A SESSÃO?\n• TÉCNICA: Uso meus rolos de madeira para soltar suas costas e pernas.\n• SEM DOR: É para relaxar, não para machucar. Deslizo a madeira para tirar o peso do corpo.\n• FINALIZAÇÃO: Termino com as mãos para garantir que relaxou tudo.\n⚠️ Obs: Massagem focada em tirar dor e cansaço.`
      },
      { 
        id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: "SENSORIAL",
        title: "Sensitiva Tântrica (+ Lingam)",
        desc: "Uma jornada de sensações do início ao fim.",
        details: `O QUE ROLA NESSA SESSÃO:\n• INÍCIO: Começo tirando a tensão do seu corpo (manual ou rolos).\n• SENSORIAL: Depois uso toques bem leves (ponta dos dedos) para te dar arrepios.\n• LINGAM: Inclui a massagem na parte íntima (pênis e testículos).\n• OBJETIVO: Te dar o máximo de prazer.\n• FINALIZAÇÃO: Manual inclusa (com bastante óleo).`
      },
      { 
        id: 'mista', min: 60, price: 205, icon: Zap, tag: "PREFERIDA",
        title: "Experiência Mista Completa",
        desc: "A fusão perfeita: Relaxamento profundo + Intensidade.",
        details: `A MAIS COMPLETA (60min):\n• TÉCNICA: Começa com a massagem relaxante para soltar os músculos.\n• INTENSIDADE: Aumento para a sensitiva e entro no corpo a corpo (Body to Body).\n• LINGAM: Fecho com a tântrica caprichada.\n• FINAL: Você goza no final, sem pressa.`
      }
    ],
    plans: [
      { id: 'pack_relax', type: 'pack', title: "Pack Relax (4 Sessões)", price: 440, fullPrice: 500, savings: 60, details: "4 sessões Relaxantes. Economize e garanta mais XP.", tag: "GANHE XP DOBRADO", icon: Package },
      { id: 'pack_mista', type: 'pack', title: "Pack Mista (3 Sessões)", price: 550, fullPrice: 615, savings: 65, details: "3 sessões Completas. O atalho para subir de nível VIP.", tag: "MAIS ESCOLHIDO", icon: Zap },
      { id: 'vip_club', type: 'subscription', title: "Clube VIP Mensal", price: 360, fullPrice: 460, savings: 100, details: "2 Sessões Mistas/mês + Prioridade total na minha agenda.", tag: "STATUS VIP", icon: Crown }
    ],
    extras: [
      { id: 'more_time', price: 55, icon: Clock, label: "+30 Minutos", desc: "Para curtir seu momento sem pressa." },
      { id: 'touch', price: 55, icon: Heart, label: "Troca (Você Toca)", desc: "Liberdade para interagir e tocar." },
      { id: 'aroma', price: 5, icon: Wind, label: "Aromaterapia", desc: "Óleos essenciais para relaxar a mente." }
    ],
    text: {
      loading: "CARREGANDO...", welcome: "Bem-vindo,", subtitle: "Relaxe, você está em boas mãos. O que deseja hoje?",
      tab_single: "Sessão Avulsa", tab_packs: "Planos Especiais", reviews_btn: "Ver relatos reais (+50)",
      select_time_title: "Disponibilidade", date_sub: "Escolha o horário mais confortável para você:",
      location_title: "Local de Atendimento", input_name: "Seu nome ou apelido", input_addr: "Endereço onde irei te atender",
      input_num: "Número", input_bairro: "Bairro", input_city: "Cidade", input_comp: "Complemento",
      input_hotel: "Nome do Hotel", input_room: "Número do Quarto",
      motel_note: "Suíte (Motel): Você paga a taxa da suíte direto no local. O valor da massagem + extras combinamos no WhatsApp.",
      pay_title: "Preferência de Pagamento", pay_pix: "Pix", pay_card: "Cartão", pay_cash: "Dinheiro",
      extras_title: "Personalizar sua experiência", coupon_title: "Tenho um convite/cupom",
      coupon_placeholder: "Código do convite...", coupon_btn: "Validar", remove: "Remover", total_label: "Total",
      book_btn: "Confirmar Agendamento", next_btn: "Continuar", uber_warning: "Taxa de transporte (Uber) combinamos no chat",
      success_title: "Tudo certo!", success_sub: "Já preparei seu agendamento. É só clicar abaixo para abrir nosso chat e confirmar.",
      whatsapp_btn: "Combinar no WhatsApp", back_home: "Voltar ao Início", today: "Hoje", tomorrow: "Amanhã",
      empty_date: "Selecione uma data acima para ver os horários", empty_slots: "Agenda completa neste dia.",
      details_label: "DETALHES DA SESSÃO:", security_note: "Seus dados ficam salvos apenas no seu celular. Sigilo total.",
      popup_welcome_title: "Seja bem-vindo!", popup_welcome_msg: "Para sua primeira experiência ser ainda melhor, liberei um presente especial.",
      popup_level_title: "NOVO STATUS!", popup_level_msg: "Sua fidelidade é reconhecida. Você alcançou um novo nível de benefícios.",
      popup_btn_coupon: "USAR MEU PRESENTE", agree_terms: "Estou de acordo com o protocolo de atendimento.",
      terms_body: ["1. HIGIENE: Um banho antes da sessão é essencial.", "2. SIGILO: Sua privacidade é absoluta.", "3. RESPEITO: O ambiente é de relaxamento.", "4. PAGAMENTO: Realizado ao final."],
      terms_title: "Protocolo de Atendimento", terms_link: "Ler protocolo", terms_btn: "Combinado",
      scarcity_msg: "pessoas visitando agora", xp_label: "XP", level_label: "Seu Nível",
      zap: {
        intro: "Oi Thalyson, tudo bem? 🌿", order_title: "*PEDIDO CONFIRMADO*", client: "👤 *Cliente:*",
        service: "💆‍♂️ *Serviço:*", date: "🗓️ *Data:*", location: "📍 *Localização:*", payment: "💳 *Pagamento:*",
        value: "💰 *RESUMO FINANCEIRO:*", xp_status: "🏆 *FIDELIDADE:*", xp_gain: "XP Ganho:",
        xp_level: "Nível Atual:", xp_next: "Próximo Prêmio:", wait: "Podemos confirmar os detalhes?",
        house: "Residência", hotel: "Hotel", motel: "Suíte (Motel)", extra_title: "✨ *Extras:*",
        uber_label: "🚗 *Transporte:*", uber_text: "A combinar."
      }
    }
  },
  en: {
    // English mapping omitted for brevity but logic is prepared
    levels: [], services: [], plans: [], extras: [], text: {} 
  }
};

// ==================================================================================
// UTILS & HELPERS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const getNextLevelInfo = (currentXP, levels) => {
  if (currentXP >= 800) {
    const cycleXP = currentXP - 800;
    const nextRewardAt = 500 - (cycleXP % 500);
    return { needed: nextRewardAt, reward: 50, title: "Prestige" };
  }
  const nextLevel = levels.find(l => l.xpNeeded > currentXP);
  return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
};

const buildWhatsAppUrl = (state, user, financials, estimatedXP, levelInfo, texts) => {
    const { booking } = state;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
    
    let locTxt = "";
    let mapQuery = "";

    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${texts.zap.house}\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${texts.zap.motel}\n⚠️ (Combinar detalhes e valor total da suíte no chat)`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${texts.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }

    const extrasList = Object.keys(booking.extras)
        .filter(k => booking.extras[k])
        .map(k => {
            const ext = DATA_SOURCE.pt.extras.find(e => e.id === k);
            return ext ? `✅ ${ext.label} (+ R$ ${ext.price})` : '';
        }).filter(Boolean).join('\n');

    const xpStatusMsg = levelInfo 
        ? `${texts.zap.xp_next} ${levelInfo.needed} XP (R$ ${levelInfo.reward},00)`
        : "Nível Máximo Atingido! 🚀";

    const msg = `
${texts.zap.intro}
${texts.zap.order_title}
_____________________________

${texts.zap.client} ${user.name}
${texts.zap.service} ${booking.item?.title}
${texts.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${texts.zap.extra_title}\n${extrasList}\n` : ''}
${texts.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}
_____________________________

${texts.zap.value}
Total: R$ ${financials.total},00
${texts.zap.payment} ${booking.payment.toUpperCase()}
${texts.zap.uber_label} ${texts.zap.uber_text}

${texts.zap.xp_status}
🔹 ${texts.zap.xp_gain} +${estimatedXP} XP
🔹 ${texts.zap.xp_level} ${DATA_SOURCE.pt.levels.find(l => user.xp >= l.xpNeeded)?.title || "Visitante"}
🔹 ${xpStatusMsg}

${texts.zap.wait}
`.trim();

    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
};

// ==================================================================================
// DESIGN SYSTEM (ATOMIC COMPONENTS)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, loading = false, className = '' }) => {
  const baseStyle = "relative flex items-center justify-center font-bold transition-all duration-200 active:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden";
  const variants = {
    primary: "bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 border border-amber-400",
    secondary: "bg-zinc-800 text-zinc-200 border border-zinc-700 active:bg-zinc-700",
    whatsapp: "bg-[#25D366] active:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 border border-green-500/20",
    icon: "bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-white hover:bg-zinc-700"
  };
  const sizes = { sm: "h-10 text-[10px] px-3", md: "h-12 text-xs px-4", lg: "h-14 text-sm px-6", xl: "h-14 text-sm px-6", icon: "h-12 w-12 p-0 flex-shrink-0" };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={18} className="animate-spin"/> : <>{Icon && <Icon size={18} className={children ? "mr-2" : ""} strokeWidth={2.5} />}{children}</>}
    </button>
  );
};

const InputField = React.memo(({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark, ...props }) => (
  <div className="space-y-1.5 w-full">
    {label && <label className={`text-[9px] font-black uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>{Icon && <Icon size={18} />}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full pl-11 pr-4 py-3.5 rounded-2xl border outline-none text-base font-medium transition-all ${error ? 'border-red-500/50 bg-red-500/5' : (isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-amber-500/50 focus:bg-zinc-900' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500')}`} {...props}/>
    </div>
    {error && <p className="text-red-400 text-[9px] ml-2 mt-1 font-bold">{error}</p>}
  </div>
));

const Card = ({ children, isDark, className = '', onClick, active = false }) => (
  <div onClick={onClick} className={`relative p-5 rounded-[1.2rem] transition-all duration-200 overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.98] touch-manipulation' : ''} ${isDark ? `bg-zinc-900/60 backdrop-blur-md ${active ? 'border border-amber-500/50 bg-amber-500/5' : 'border border-zinc-800/60'}` : `bg-white ${active ? 'border border-amber-500 ring-1 ring-amber-500/50' : 'border border-slate-200 shadow-sm'}`} ${className}`}>
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
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 6 + 3, h: Math.random() * 6 + 3,
      color: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 3 + 2, angle: Math.random() * 360, spin: Math.random() * 5 - 2.5
    }));
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        p.y += p.speed; p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
});

// ==================================================================================
// MAIN LOGIC HOOK (SEPARATION OF CONCERNS)
// ==================================================================================

const initialState = {
  step: 0,
  loading: true,
  booking: {
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  },
  user: { name: '', xp: 0, coupons: [], savedAddress: null, hasSeenWelcome: false, ordersCount: 0 },
  ui: { isDark: true, showScarcity: false, showConfetti: false, viewers: 0, lang: 'pt' }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'INIT_USER': return { ...state, user: { ...state.user, ...action.payload }, loading: false };
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'UPDATE_BOOKING': return { ...state, booking: { ...state.booking, ...action.payload } };
    case 'SELECT_ITEM': return { ...state, booking: { ...state.booking, type: action.payload.type, item: action.payload.item, extras: {}, payment: '', termsAccepted: false } };
    case 'TOGGLE_DARK': return { ...state, ui: { ...state.ui, isDark: !state.ui.isDark } };
    case 'TOGGLE_LANG': return { ...state, ui: { ...state.ui, lang: state.ui.lang === 'pt' ? 'en' : 'pt' } };
    case 'SHOW_SCARCITY': return { ...state, ui: { ...state.ui, showScarcity: true, viewers: action.payload } };
    case 'HIDE_SCARCITY': return { ...state, ui: { ...state.ui, showScarcity: false } };
    case 'APPLY_COUPON': return { ...state, booking: { ...state.booking, appliedCoupon: action.payload } };
    case 'COMPLETE_ORDER': return { ...state, step: 4, ui: { ...state.ui, showConfetti: true }, user: { ...state.user, ...action.payload } };
    case 'RESET_BOOKING': return { ...state, step: 0, booking: initialState.booking, ui: { ...state.ui, showConfetti: false } };
    case 'UPDATE_USER_DATA': return { ...state, user: { ...state.user, ...action.payload }};
    default: return state;
  }
}

// ==================================================================================
// COMPONENT: APP
// ==================================================================================

export default function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('single');
  const [couponInput, setCouponInput] = useState('');
  
  const scrollRef = useRef(null);
  
  // Shortcuts
  const { booking, user, ui, step } = state;
  const DATA = DATA_SOURCE[ui.lang] || DATA_SOURCE.pt;
  const T = DATA.text;

  // Persistence & Init
  useEffect(() => {
    try {
      const s = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (s) {
        const parsed = JSON.parse(s);
        dispatch({ type: 'INIT_USER', payload: parsed });
        if(parsed.savedAddress) {
          dispatch({ type: 'UPDATE_BOOKING', payload: { address: parsed.savedAddress } });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (e) {
      console.error("Storage Error", e);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    if (!state.loading) {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));
    }
  }, [user, state.loading]);

  useEffect(() => { if(!state.loading && !user.hasSeenWelcome) setTimeout(() => setWelcomePopup(true), 2000); }, [state.loading, user.hasSeenWelcome]);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // Toast System
  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Scarcity Logic
  const triggerScarcity = useCallback(() => {
    const v = Math.floor(Math.random() * 4) + 3;
    dispatch({ type: 'SHOW_SCARCITY', payload: v });
    setTimeout(() => dispatch({ type: 'HIDE_SCARCITY' }), 4000);
  }, []);

  // Financials Calculation
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

  // XP Calculation
  const estimatedXP = useMemo(() => {
    const baseXP = financials.total;
    const isPack = booking.type === 'pack' || booking.type === 'subscription';
    return Math.floor(baseXP * (isPack ? 0.30 : 0.15));
  }, [financials.total, booking.type]);

  // Validators
  const validateStep = () => {
     if (step === 0 && !booking.item) return addToast(T.toast_select_item, "error");
     if (step === 1 && (!booking.date || !booking.time)) return addToast(T.toast_select_date, "error");
     if (step === 2) {
         if (!user.name || user.name.length < 3) return addToast(T.toast_fill_name, "error");
         if (booking.locationType === 'home' && (!booking.address.street || !booking.address.number)) return addToast(T.toast_fill_addr, "error");
         if (booking.locationType === 'hotel' && (!booking.address.placeName)) return addToast(T.toast_fill_hotel, "error");
     }
     if (step === 3) {
         if (!booking.payment) return addToast(T.toast_select_pay, "error");
         if (!booking.termsAccepted) return addToast(T.toast_accept_terms, "error");
     }
     return true;
  };

  const handleNext = () => {
      if(validateStep()) {
          if (step === 2) dispatch({ type: 'UPDATE_USER_DATA', payload: { savedAddress: booking.address }});
          if (step === 3) finishBooking();
          else dispatch({ type: 'SET_STEP', payload: step + 1 });
      }
  };

  const handleApplyCoupon = () => {
    if(!couponInput) return;
    const code = couponInput.toUpperCase().trim();
    if(['THALYSON10', 'VIP20', 'WELCOME10'].includes(code)) {
        const val = code === 'VIP20' ? 20 : 10;
        dispatch({ type: 'APPLY_COUPON', payload: { id: code, val, title: `🎟️ ${code}`, code } });
        addToast(T.toast_coupon_success, "success");
        setCouponInput('');
    } else {
        addToast(T.toast_coupon_error, "error");
    }
  };

  const finishBooking = () => {
    let updatedCoupons = (user.coupons || []).filter(c => c.code !== booking.appliedCoupon?.code);
    const newXP = Math.floor(user.xp + estimatedXP);
    
    // Level Up Logic
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Recompensa ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });
    // Prestige Logic
    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        if (newCycle > oldCycle && newCycle >= 0) {
             leveledUp = true;
             updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 Prestige Bonus`, code: `VIPMASTER` });
        }
    }

    if(leveledUp) setLevelUpPopup(true);
    
    dispatch({ type: 'COMPLETE_ORDER', payload: { xp: newXP, coupons: updatedCoupons, ordersCount: user.ordersCount + 1 } });
    
    const zapLink = buildWhatsAppUrl(state, user, financials, estimatedXP, getNextLevelInfo(newXP, DATA.levels), T);
    window.open(zapLink, '_blank');
  };

  // Render Helpers
  const nextLevelInfo = getNextLevelInfo(user.xp, DATA.levels);
  const progressPercent = (() => {
      if (user.xp >= 800) {
          const cycleXP = user.xp - 800;
          return ((cycleXP % 500) / 500) * 100;
      }
      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const curLvl = DATA.levels[realIndex];
      const nxtLvl = DATA.levels[realIndex + 1];
      if (!nxtLvl) return 100;
      return Math.min(100, Math.max(0, ((user.xp - curLvl.xpNeeded) / (nxtLvl.xpNeeded - curLvl.xpNeeded)) * 100));
  })();

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();
      if (isToday) {
          const currentHour = now.getHours();
          return slots.filter(time => parseInt(time.split(':')[0]) > currentHour);
      }
      return slots;
  }, [booking.date]);

  // ==================================================================================
  // VIEW RENDER
  // ==================================================================================
  if (state.loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${ui.isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="w-20 h-20 rounded-full bg-amber-500/80 flex items-center justify-center animate-pulse shadow-2xl"><span className="text-2xl font-black text-black">TM</span></div>
        <h1 className="mt-8 text-xl font-bold tracking-tight animate-pulse text-amber-500">Thalyson Massagens</h1>
      </div>
  );

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${ui.isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* GLOBAL OVERLAYS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl animate-slide-down border backdrop-blur-xl ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
            {t.type === 'success' ? <Check size={18}/> : <AlertTriangle size={18}/>}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>
      <Confetti active={ui.showConfetti} />
      
      {/* HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${ui.isDark ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-lg">TM</div>
          <div><span className="font-bold text-sm block">Thalyson</span><span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Massagens</span></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => dispatch({type:'TOGGLE_LANG'})} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${ui.isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => dispatch({type:'TOGGLE_DARK'})} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${ui.isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{ui.isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </header>

      {/* SCARCITY POPUP */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-500 ${ui.showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] font-bold tracking-wide uppercase">{ui.viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        <div className="max-w-md mx-auto space-y-8 pt-2">
          
          {/* STEP 0: CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight">{T.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{user.name ? user.name.split(' ')[0] : (ui.lang==='pt'?'Visitante':'Visitor')}</span></h1>
                <p className={`text-sm mb-6 font-medium leading-relaxed ${ui.isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                {/* XP DASHBOARD */}
                <div className={`relative overflow-hidden rounded-3xl p-5 mb-6 border shadow-lg transition-all ${ui.isDark ? 'bg-gradient-to-br from-zinc-900 to-black border-zinc-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg`}><Trophy className="text-white" size={24} /></div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{T.level_label}</span>
                                <h3 className={`font-black text-lg text-amber-500`}>
                                    {user.xp >= 800 ? "VIP Master" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || "Visitante")}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black">{user.xp}</span>
                            <span className="text-[10px] font-bold opacity-50 block">{T.xp_label}</span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-[10px] opacity-60 mb-1">{nextLevelInfo ? `Faltam ${nextLevelInfo.needed} XP para R$ ${nextLevelInfo.reward},00` : "Ciclo Infinito: Ganhe R$ 50 a cada 500 XP"}</p>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{width: `${progressPercent}%`}}></div>
                        </div>
                    </div>
                </div>

                <Button variant="secondary" full size="sm" onClick={() => setReviewsOpen(true)} icon={Star}>{T.reviews_btn}</Button>
              </div>

              {/* TABS */}
              <div className={`grid grid-cols-2 p-1.5 rounded-2xl mb-8 relative ${ui.isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab==='single' ? (ui.isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50'}`}><LayoutList size={14} className="inline mr-2"/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${activeTab==='packs' ? (ui.isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50'}`}><Package size={14} className="inline mr-2"/> {T.tab_packs}</button>
              </div>

              <div className="space-y-4 animate-slide-in">
                {activeTab === 'single' ? DATA.services.map(s => (
                   <Card key={s.id} isDark={ui.isDark} active={booking.item?.id === s.id} onClick={() => dispatch({ type: 'SELECT_ITEM', payload: { type: 'single', item: s }})}>
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3.5 rounded-2xl transition-colors ${booking.item?.id === s.id ? 'bg-amber-500 text-black shadow-lg' : (ui.isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={26}/></div>
                        <div className="text-right"><span className="block text-2xl font-black tracking-tight">R$ {s.price}</span><span className="text-[10px] uppercase font-bold opacity-50"><Clock size={10} className="inline mr-1"/>{s.min} min</span></div>
                      </div>
                      <div className="mb-2">{s.tag && <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-300 mb-2 uppercase tracking-wider">{s.tag}</span>}<h3 className="font-bold text-lg leading-tight">{s.title}</h3></div>
                      <p className={`text-sm leading-relaxed ${ui.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                      {booking.item?.id === s.id && (<div className={`mt-4 p-4 rounded-xl text-xs leading-relaxed animate-fade-in border ${ui.isDark ? 'bg-black/40 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><div className="flex items-center gap-2 font-bold mb-2 text-amber-500"><Info size={12}/> {T.details_label}</div><p className="whitespace-pre-line">{s.details}</p></div>)}
                   </Card>
                )) : DATA.plans.map(p => (
                   <Card key={p.id} isDark={ui.isDark} active={booking.item?.id === p.id} onClick={() => dispatch({ type: 'SELECT_ITEM', payload: { type: p.type, item: p }})}>
                      {p.tag && (<div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10">{p.tag}</div>)}
                      <div className="flex items-center gap-4 mb-4">
                          <div className={`p-4 rounded-2xl ${booking.item?.id === p.id ? 'bg-amber-500 text-black' : (ui.isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><p.icon size={28}/></div>
                          <div><h3 className="font-bold text-xl leading-none mb-1">{p.title}</h3><p className="text-[10px] opacity-60 uppercase tracking-widest font-bold">{p.type === 'pack' ? 'Pacote' : 'Assinatura'}</p></div>
                      </div>
                      <p className={`text-sm mb-5 ${ui.isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{p.details}</p>
                      <div className="flex items-end gap-3 p-3 rounded-xl bg-black/20 border border-white/5">
                          <span className="text-2xl font-black text-amber-500">R$ {p.price}</span>
                          <span className="text-sm line-through opacity-40 mb-1 decoration-red-500">R$ {p.fullPrice}</span>
                          <span className="text-xs text-green-500 font-bold mb-1 ml-auto bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Economia R${p.savings}</span>
                      </div>
                   </Card>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
                <div className="text-center mb-8">
                   <h2 className="text-2xl font-bold mb-1">{T.select_time_title}</h2>
                   <p className={`text-xs uppercase tracking-widest font-bold ${ui.isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.date_sub}</p>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-4">
                  {[...Array(14)].map((_, i) => { 
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                    return (
                      <button key={i} onClick={() => dispatch({ type: 'UPDATE_BOOKING', payload: { date: d, time: null }})} className={`min-w-[76px] h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 active:scale-95 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg scale-105' : (ui.isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-400')}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{i===0 ? T.today : (i===1 ? T.tomorrow : d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3))}</span>
                        <span className="text-2xl font-black">{d.getDate()}</span>
                      </button>
                    )
                  })}
                </div>
                {booking.date ? (
                    <div className="grid grid-cols-3 gap-3 animate-fade-in">
                       {generateTimeSlots.map(t => (
                           <button key={t} onClick={() => { dispatch({ type: 'UPDATE_BOOKING', payload: { time: t }}); triggerScarcity(); }} className={`py-4 rounded-xl text-sm font-bold border transition-all active:scale-95 relative overflow-hidden ${booking.time === t ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : (ui.isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                               {t}
                           </button>
                       ))}
                       {generateTimeSlots.length === 0 && <div className="col-span-3 text-center py-10 opacity-50 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-sm font-bold">{T.empty_slots}</p></div>}
                    </div>
                ) : <div className="text-center py-12 opacity-30 border-2 border-dashed border-zinc-700 rounded-3xl"><Calendar size={40} className="mx-auto mb-4 opacity-50"/><p className="text-sm font-bold">{T.empty_date}</p></div>}
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-bold text-center mb-8">{T.location_title}</h2>
              <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-2xl mb-8 ${ui.isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>dispatch({ type: 'UPDATE_BOOKING', payload: { locationType: x.id }})} className={`py-4 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all ${booking.locationType === x.id ? (ui.isDark ? 'bg-zinc-800 text-white shadow-md' : 'bg-white text-black shadow-md') : 'opacity-40 hover:opacity-100'}`}>
                        <x.i size={20} /> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-5">
                  <InputField label={T.input_name} value={user.name} onChange={e=>dispatch({type:'UPDATE_USER_DATA', payload:{name:e.target.value}})} icon={User} isDark={ui.isDark} placeholder="Nome" />
                  {booking.locationType === 'home' && (
                      <div className="space-y-4 animate-fade-in">
                         <div className="grid grid-cols-[1fr_90px] gap-3">
                            <InputField label={T.input_addr} value={booking.address.street} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, street:e.target.value}}})} isDark={ui.isDark} icon={MapPin} placeholder="Rua/Av" />
                            <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, number:e.target.value}}})} isDark={ui.isDark} placeholder="123" />
                         </div>
                         <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, district:e.target.value}}})} isDark={ui.isDark} placeholder="Bairro" />
                         <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, city:e.target.value}}})} isDark={ui.isDark} placeholder="Cidade" />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, comp:e.target.value}}})} isDark={ui.isDark} placeholder="Apt" />
                         </div>
                      </div>
                  )}
                  {booking.locationType === 'hotel' && (
                      <div className="space-y-4 animate-fade-in">
                          <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, placeName:e.target.value}}})} isDark={ui.isDark} icon={Building} placeholder="Nome Hotel" />
                          <InputField label={T.input_city} value={booking.address.city} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, city:e.target.value}}})} isDark={ui.isDark} placeholder="Cidade" />
                          <InputField label={T.input_room} value={booking.address.comp} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{address:{...booking.address, comp:e.target.value}}})} isDark={ui.isDark} icon={Lock} placeholder="Quarto" />
                      </div>
                  )}
                  {booking.locationType === 'motel' && <div className={`p-6 rounded-3xl border text-center text-sm ${ui.isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>{T.motel_note}</div>}
              </div>
              
              {/* EXTRAS */}
              {booking.type === 'single' && (
                  <div className="pt-8 border-t border-dashed border-zinc-800/50 mt-8">
                     <h3 className={`text-[10px] font-bold uppercase mb-4 tracking-widest ${ui.isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>dispatch({type:'UPDATE_BOOKING', payload:{extras:{...booking.extras, [ex.id]: !booking.extras[ex.id]}}})} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/50' : (ui.isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`p-2.5 rounded-xl ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : (ui.isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
                                 <div><p className="text-sm font-bold">{ex.label}</p><p className="text-[10px] opacity-60">{ex.desc}</p></div>
                             </div>
                             <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-amber-500' : 'opacity-30'}`}>+ R$ {ex.price}</span>
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
               <div className="relative">
                   <div className={`p-6 rounded-t-[2rem] rounded-b-xl border-t border-x shadow-2xl relative overflow-hidden ${ui.isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600"></div>
                      <h2 className="font-black text-2xl leading-tight text-amber-500 mb-6 mt-2">{booking.item.title}</h2>
                      <div className="space-y-3 border-b border-dashed border-zinc-700/50 pb-6 mb-6">
                          <div className="flex justify-between text-sm"><span>Valor Base</span><span>R$ {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                             <div key={k} className="flex justify-between text-sm opacity-60"><span>+ {DATA.extras.find(e=>e.id===k)?.label}</span><span>{DATA.extras.find(e=>e.id===k)?.price}</span></div>
                          ))}
                          {booking.appliedCoupon && (<div className="flex justify-between text-sm text-green-500 font-bold bg-green-500/5 p-2 rounded-lg"><span>Cupom ({booking.appliedCoupon.code})</span><span>- R$ {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className="text-[10px] font-bold uppercase opacity-50 block mb-1">{T.total_label}</span><span className="text-[10px] font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{T.uber_warning}</span></div>
                          <div className="text-right">
                              <span className="block text-4xl font-black tracking-tighter text-white">R$ {financials.total}</span>
                              <span className="text-[10px] font-bold text-amber-500 flex items-center justify-end gap-1 mt-1 opacity-80"><Sparkles size={10}/> +{estimatedXP} XP</span>
                          </div>
                      </div>
                   </div>
                   <div className="h-4 w-full bg-repeat-x bg-[length:20px_20px] opacity-10" style={{backgroundImage: `linear-gradient(45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #fff 33.333%, #fff 66.667%, transparent 66.667%)`, backgroundSize: '20px 40px', backgroundPosition: '0 -20px'}}></div>
               </div>

               {/* COUPON */}
               <div className="mt-6 flex gap-2">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-4 py-3 rounded-xl border outline-none text-sm font-bold uppercase tracking-widest ${ui.isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                       <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>
               
               {/* PAYMENT */}
               <div className="mt-8">
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-1">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                           <button key={p.id} onClick={()=>dispatch({type:'UPDATE_BOOKING', payload:{payment:p.id}})} className={`px-5 py-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] ${booking.payment === p.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : (ui.isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-black/20' : 'bg-zinc-800'}`}><p.i size={20}/></div>
                               <span className="font-bold text-sm block">{p.l}</span>
                               {booking.payment === p.id && <Check size={20} className="ml-auto" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>
               
               {/* TERMS */}
               <div className={`mt-8 p-4 rounded-2xl border flex flex-col gap-3 transition-colors ${ui.isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-amber-50 border-amber-200'}`}>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 cursor-pointer select-none">
                        <input type="checkbox" checked={booking.termsAccepted} onChange={e=>dispatch({type:'UPDATE_BOOKING', payload:{termsAccepted:e.target.checked}})} className="w-5 h-5 accent-amber-500 rounded cursor-pointer"/>
                        <span className="text-xs font-bold">{T.agree_terms}</span>
                    </label>
               </div>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-8 text-center animate-scale-in">
                 <div className="relative mb-8">
                     <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                     <div className="w-28 h-28 bg-gradient-to-tr from-green-500 to-emerald-700 rounded-full flex items-center justify-center shadow-2xl relative z-10 animate-bounce-slow"><Check size={56} className="text-white" strokeWidth={4}/></div>
                 </div>
                 <h1 className="text-3xl font-black mb-3">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10 text-sm leading-relaxed">{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(buildWhatsAppUrl(state, user, financials, estimatedXP, nextLevelInfo, T), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>dispatch({type:'RESET_BOOKING'})} className="mt-8 text-xs font-bold uppercase opacity-40 tracking-widest hover:opacity-100 p-4 transition-opacity">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FIXED FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className={`w-full p-4 backdrop-blur-xl border-t transition-all duration-300 ${ui.isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="icon" size="icon" onClick={() => dispatch({type:'RESET_BOOKING'})} icon={Home} />
                        <Button variant="icon" size="icon" onClick={() => dispatch({type:'SET_STEP', payload: step - 1})} icon={ChevronLeft} />
                      </div>
                    )}
                    <button onClick={handleNext} className={`flex-1 h-12 rounded-2xl font-bold text-xs flex items-center justify-between px-6 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] ${step < 3 ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-amber-500 text-black'}`}>
                      <span className="uppercase tracking-widest">{step === 3 ? T.book_btn : T.next_btn}</span>
                      {booking.item && (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[10px] opacity-60 font-medium">TOTAL</span>
                          <span className="text-sm font-black">R$ {financials.total}</span>
                        </div>
                      )}
                      {!booking.item && <ArrowRight size={18} strokeWidth={2.5}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* POPUPS (WELCOME, LEVEL UP) */}
      {[welcomePopup, levelUpPopup].some(Boolean) && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>{setWelcomePopup(false); setLevelUpPopup(false);}}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${ui.isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                {welcomePopup ? (
                    <>
                       <div className="w-20 h-20 bg-zinc-800 rounded-3xl rotate-6 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-700"><Gift size={40} className="text-amber-500" /></div>
                       <h2 className="text-2xl font-black mb-2">{T.popup_welcome_title}</h2><p className="opacity-70 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                       <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Seu Código:</p><p className="text-xl font-mono font-black text-amber-500 tracking-widest">WELCOME10</p></div>
                       <Button full variant="primary" onClick={()=>{ setWelcomePopup(false); dispatch({type:'UPDATE_USER_DATA', payload:{hasSeenWelcome:true}}); dispatch({type:'APPLY_COUPON', payload:{id:'WELCOME10', val:10, title:'🎁 Welcome', code:'WELCOME10'}}); addToast(T.toast_coupon_success, "success"); }}>{T.popup_btn_coupon}</Button>
                    </>
                ) : (
                    <>
                       <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce"><Trophy size={48} className="text-white" /></div>
                       <h2 className="text-3xl font-black mb-2 italic tracking-tight">{T.popup_level_title}</h2><p className="opacity-70 text-base leading-relaxed mb-8">{T.popup_level_msg}</p>
                       <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
                    </>
                )}
            </div>
        </div>
      )}

      {/* REVIEWS MODAL */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2rem] p-6 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${ui.isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Avaliações</h3><button onClick={()=>setReviewsOpen(false)} className="p-2 bg-black/10 rounded-full"><X size={20}/></button></div>
            <div className="space-y-4">
                {[{n:"Tiago",t:"A sensitiva foi uma experiência de outro mundo.",s:5},{n:"Pedro H.",t:"Fui estressado e saí flutuando.",s:5}].map((r,i)=>( 
                    <div key={i} className={`p-5 rounded-2xl border relative ${ui.isDark ? 'bg-zinc-800/30 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>
                        <div className="flex justify-between mb-2"><span className="font-bold text-sm flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-black font-black">{r.n.charAt(0)}</div>{r.n}</span></div>
                        <div className="flex text-amber-400 gap-0.5 mb-2"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                        <p className="text-sm opacity-80 leading-relaxed font-medium">"{r.t}"</p>
                    </div>
                ))}
            </div>
         </div>
      </div>
      
      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.6s ease-out}.animate-slide-up{animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.3s ease-out}.pb-safe{padding-bottom:env(safe-area-inset-bottom,24px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
