import React, { useState, useEffect, useMemo, useRef } from 'react';
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
 * THALYSON APP v30.0 - THE MONSTER EDITION (FULL FEATURE + CONVERSION)
 * ==================================================================================
 * O MELHOR DOS DOIS MUNDOS:
 * 1. [FULL FEATURE] Todo o sistema de XP, Níveis, Confetes e Reviews restaurado.
 * 2. [CONVERSION] Botões Shimmer, Escassez e Design High-Ticket mantidos.
 * 3. [STABILITY] Proteção contra crash e lógica financeira blindada.
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v30_monster', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 1. DESIGN SYSTEM & UI COMPONENTS
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false, shimmer = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 rounded-2xl overflow-hidden";
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-orange-500 hover:to-amber-400 text-black shadow-lg shadow-amber-500/30 border border-amber-400/50",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
    whatsapp: "bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 border border-green-500/20",
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
  };
  const sizes = { sm: "h-9 text-xs px-3", md: "h-12 text-sm px-6", lg: "h-14 text-base px-8", xl: "h-16 text-lg px-8" };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
       {shimmer && !loading && !disabled && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 animate-[shimmer_3s_infinite]" />
      )}
      {loading ? <Loader2 size={18} className="animate-spin mr-2"/> : (Icon && <Icon size={18} className="mr-2 relative z-20" strokeWidth={2.5} />)}
      <span className="relative z-20">{children}</span>
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2 w-full animate-fade-in">
    {label && <label className={`text-[11px] font-bold uppercase tracking-widest ml-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>{Icon && <Icon size={18} />}</div>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-sm transition-all shadow-sm ${error ? 'border-red-500/50 focus:border-red-500 bg-red-500/5' : (isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-100 focus:border-amber-500/50 focus:bg-zinc-900 focus:shadow-amber-500/10 focus:shadow-lg' : 'bg-white border-slate-200 text-slate-900 focus:border-amber-500')}`} />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 mt-1 animate-slide-in flex items-center gap-1"><AlertTriangle size={10}/> {error}</p>}
  </div>
);

const Card = ({ children, isDark, className = '', onClick, active = false, tag = null }) => (
  <div onClick={onClick} className={`relative p-6 rounded-3xl transition-all duration-500 overflow-hidden group ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''} ${isDark ? `bg-zinc-900/60 backdrop-blur-md ${active ? 'border border-amber-500/50 bg-amber-500/5 shadow-2xl shadow-amber-900/20' : 'border border-zinc-800/60 hover:border-zinc-600'}` : `bg-white ${active ? 'border border-amber-500 ring-1 ring-amber-500/50 shadow-xl shadow-amber-100' : 'border border-slate-200 shadow-sm hover:shadow-md'}`} ${className}`}>
    {tag && <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10 flex items-center gap-1"><Flame size={10} fill="black"/> {tag}</div>}
    {active && <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />}
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
      w: Math.random() * 8 + 4,
      h: Math.random() * 8 + 4,
      color: ['#f59e0b', '#fbbf24', '#ffffff', '#d97706'][Math.floor(Math.random() * 4)],
      speed: Math.random() * 2 + 1,
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
// 2. DADOS COMPLETOS (TEXTOS PERSUASIVOS)
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
• FINALIZAÇÃO: Termino com as mãos para garantir que relaxou tudo.` : `HOW IS THE SESSION?\n• TECHNIQUE: Using wood rollers to release back and legs.\n• PAINLESS: It's for relaxation, not pain.\n• FINISH: I finish with hands to ensure full relaxation.`
            },
            { 
              id: 'sensitiva', min: 60, price: 160, icon: Flame, tag: isPT ? "SENSORIAL" : "SENSORY",
              title: isPT ? "Sensitiva Tântrica (+ Lingam)" : "Tantric Sensitive (+ Lingam)",
              desc: isPT ? "Uma jornada de sensações do início ao fim." : "A journey of sensations from start to finish.",
              details: isPT ? `O QUE ROLA NESSA SESSÃO:
• INÍCIO: Começo tirando a tensão do seu corpo (manual ou rolos).
• SENSORIAL: Depois uso toques bem leves (ponta dos dedos) para te dar arrepios.
• LINGAM: Inclui a massagem na parte íntima (pênis e testículos).
• OBJETIVO: Te dar o máximo de prazer.` : `WHAT HAPPENS:\n• START: Removing tension.\n• SENSORY: Very light touches.\n• LINGAM: Includes intimate massage.\n• GOAL: Give you maximum pleasure.`
            },
            { 
              id: 'mista', min: 60, price: 200, icon: Zap, tag: isPT ? "PREFERIDA" : "FAVORITE",
              title: isPT ? "Experiência Mista Completa" : "Full Mixed Experience",
              desc: isPT ? "A fusão perfeita: Relaxamento profundo + Intensidade." : "The perfect fusion: Deep relaxation + Intensity.",
              details: isPT ? `A MAIS COMPLETA (60min):
• TÉCNICA: Começa com a massagem relaxante para soltar os músculos.
• INTENSIDADE: Aumento para a sensitiva e entro no corpo a corpo (Body to Body).
• LINGAM: Fecho com a tântrica caprichada.
• FINAL: Você goza no final, sem pressa.` : `THE MOST COMPLETE (60min):\n• TECHNIQUE: Starts with relaxing.\n• INTENSITY: Increases to sensitive and Body to Body.\n• LINGAM: Finishes with detailed tantric.`
            }
        ],
        plans: [
            { id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4 Sessões)" : "Relax Pack (4 Sessions)", price: 320, fullPrice: 360, savings: 40, details: isPT ? "Ideal para quem busca bem-estar constante. 4 sessões Relaxantes." : "Ideal for constant wellness.", tag: isPT ? "CUIDADO MENSAL" : "MONTHLY CARE", icon: Package },
            { id: 'pack_mista', type: 'pack', title: isPT ? "Pack Mista (3 Sessões)" : "Full Pack (3 Sessions)", price: 540, fullPrice: 600, savings: 60, details: isPT ? "Garanta suas sessões completas com valor especial." : "Guarantee your full sessions.", tag: isPT ? "MAIS ESCOLHIDO" : "BEST SELLER", icon: Zap },
            { id: 'vip_club', type: 'subscription', title: isPT ? "Clube VIP Mensal" : "VIP Monthly Club", price: 350, fullPrice: 450, savings: 100, details: isPT ? "Acesso exclusivo: 2 Sessões Mistas/mês + Prioridade total." : "Exclusive access: 2 Full Sessions/mo.", tag: isPT ? "MEMBRO VIP" : "VIP MEMBER", icon: Crown }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Para curtir seu momento sem pressa." : "To enjoy your moment without rush." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Troca (Você Toca)" : "Switch (You Touch)", desc: isPT ? "Liberdade para interagir e tocar." : "Freedom to interact and touch." },
            { id: 'aroma', price: 15, icon: Sparkles, label: isPT ? "Aromaterapia Premium" : "Aromatherapy", desc: isPT ? "Óleos essenciais para relaxar a mente." : "Essential oils to relax the mind." }
        ],
        reviews: [
            { n: "Tiago", t: isPT ? "A sensitiva foi uma experiência de outro mundo." : "The sensitive massage was out of this world.", s: 5 },
            { n: "Pedro H.", t: isPT ? "Fui estressado e saí flutuando." : "Went in stressed, came out floating.", s: 5 },
            { n: "Marcos", t: isPT ? "Profissionalismo nota 10." : "Professionalism 10/10.", s: 5 },
            { n: "Tiago (Bela Vista)", t: isPT ? "O Thalyson tem uma energia surreal." : "Thalyson has surreal energy.", s: 5 },
            { n: "Anônimo", t: isPT ? "O toque dele vicia. A finalização foi absurda." : "His touch is addictive.", s: 5 },
            { n: "Curioso SP", t: isPT ? "Mão firme, pegada de macho. O óleo quente faz diferença." : "Firm hand, manly grip.", s: 5 },
            { n: "M. (Jardins)", t: isPT ? "Paguei o extra pra tocar e valeu cada centavo." : "Paid extra to touch and worth it.", s: 5 },
            { n: "Empresário", t: isPT ? "Sou casado, tinha receio. O sigilo foi absoluto." : "Secrecy was absolute.", s: 5 }
        ],
        text: {
            loading: isPT ? "CARREGANDO..." : "LOADING...",
            welcome: isPT ? "Bem-vindo," : "Welcome,",
            subtitle: isPT ? "Relaxe, você está em boas mãos. O que deseja hoje?" : "Relax, you're in good hands.",
            tab_single: isPT ? "Sessão Avulsa" : "Single Session",
            tab_packs: isPT ? "Planos Especiais" : "VIP Plans",
            reviews_btn: isPT ? "Ver relatos reais (+50)" : "Read 50+ Real Reviews",
            select_time_title: isPT ? "Disponibilidade" : "Availability",
            date_sub: isPT ? "Escolha o horário mais confortável para você:" : "Choose the most comfortable time:",
            location_title: isPT ? "Local de Atendimento" : "Service Location",
            input_name: isPT ? "Seu nome ou apelido" : "Your name or nickname",
            input_addr: isPT ? "Endereço onde irei te atender" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento (Apt...)" : "Complement",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Número do Quarto" : "Room Number",
            motel_note: isPT ? "Motel: Pode deixar o pagamento pronto aqui. O nome e a suíte você me passa no WhatsApp." : "Motel: Send details on WhatsApp.",
            pay_title: isPT ? "Preferência de Pagamento" : "Payment Preference",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Personalizar sua experiência" : "Customize your experience",
            coupon_title: isPT ? "Tenho um convite/cupom" : "I have a coupon",
            coupon_placeholder: isPT ? "Código do convite..." : "Invite code...",
            coupon_btn: isPT ? "Validar" : "Validate",
            total_label: isPT ? "Investimento Total" : "Total Investment",
            book_btn: isPT ? "ENVIAR SOLICITAÇÃO" : "SEND REQUEST",
            next_btn: isPT ? "AVANÇAR" : "NEXT",
            uber_warning: isPT ? "Taxa de transporte combinamos no chat" : "Transport fee arranged in chat",
            success_title: isPT ? "Tudo certo!" : "All set!",
            success_sub: isPT ? "Já preparei seu agendamento. É só clicar abaixo para abrir nosso chat e confirmar." : "Click below to open chat.",
            whatsapp_btn: isPT ? "COMBINAR NO WHATSAPP" : "CONFIRM ON WHATSAPP",
            back_home: isPT ? "Voltar ao Início" : "Back Home",
            details_label: isPT ? "DETALHES DA SESSÃO:" : "SESSION DETAILS:",
            popup_welcome_title: isPT ? "Seja bem-vindo!" : "Welcome!",
            popup_welcome_msg: isPT ? "Para sua primeira experiência ser ainda melhor, liberei um presente especial." : "Special gift for you.",
            popup_level_title: isPT ? "NOVO STATUS!" : "NEW STATUS!",
            popup_level_msg: isPT ? "Sua fidelidade é reconhecida. Você alcançou um novo nível." : "You've reached a new level.",
            popup_btn_coupon: isPT ? "USAR MEU PRESENTE" : "USE MY GIFT",
            agree_terms: isPT ? "Estou de acordo com o protocolo de atendimento." : "I agree with the protocol.",
            terms_body: isPT ? ["1. HIGIENE: Um banho antes da sessão é essencial.", "2. SIGILO: Sua privacidade é absoluta.", "3. RESPEITO: O ambiente é de relaxamento.", "4. PAGAMENTO: Realizado ao final, conforme combinado."] : ["1. HYGIENE: Shower before session.", "2. SECRECY: Absolute privacy.", "3. RESPECT: Mutual respect.", "4. PAYMENT: At the end."],
            terms_title: isPT ? "Protocolo de Atendimento" : "Service Protocol",
            terms_link: isPT ? "Ler protocolo" : "Read protocol",
            terms_btn: isPT ? "Combinado" : "Agreed",
            scarcity_msg: isPT ? "pessoas visitando agora" : "people visiting now",
            xp_label: "XP",
            level_label: isPT ? "Seu Nível" : "Your Level",
            max_level: isPT ? "Você é VIP Máximo!" : "You are Max VIP!",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para ganhar R$ ${reward},00` : `${needed} XP needed to win $ ${reward}.00`,
            
            // TOAST MESSAGES
            toast_select_item: isPT ? "Por favor, escolha como quer relaxar hoje." : "Please choose item.",
            toast_select_date: isPT ? "Selecione um dia e horário na agenda." : "Select date and time.",
            toast_fill_name: isPT ? "Preciso saber seu nome." : "Need your name.",
            toast_fill_addr: isPT ? "O endereço completo é importante." : "Address is important.",
            toast_fill_hotel: isPT ? "Qual o nome do hotel e a cidade?" : "Hotel name?",
            toast_select_pay: isPT ? "Escolha uma forma de pagamento." : "Choose payment.",
            toast_accept_terms: isPT ? "Para nossa segurança, aceite o protocolo." : "Accept protocol.",
            toast_coupon_success: isPT ? "Convite aplicado com sucesso!" : "Coupon applied!",
            toast_coupon_error: isPT ? "Este código não é válido." : "Invalid code.",

            zap: {
              intro: isPT ? "Oi Thalyson, tudo bem? 🌿" : "Hi Thalyson, how are you? 🌿",
              section_serv: isPT ? "💆‍♂️ *Experiência:*" : "💆‍♂️ *Experience:*",
              section_plan: isPT ? "🏆 *Plano VIP:*" : "🏆 *VIP Plan:*",
              house: isPT ? "Residência" : "Residence",
              hotel: "Hotel",
              motel: "Motel",
              extra_title: isPT ? "✨ *Personalização:*" : "✨ *Customization:*",
              pay_method: isPT ? "💳 *Pagamento:*" : "💳 *Payment:*",
              uber_label: isPT ? "🚗 *Transporte:*" : "🚗 *Transport:*",
              uber_text: isPT ? "A combinar." : "To be arranged.",
              wait: isPT ? "Podemos confirmar?" : "Can we confirm?"
            }
        }
    };
};

// ==================================================================================
// 3. MAIN APP
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
            setUser(prev => ({ ...prev, ...parsed, coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [], xp: typeof parsed.xp === 'number' ? parsed.xp : 0 }));
            if(parsed.savedAddress) {
                setBooking(b => ({...b, address: parsed.savedAddress}));
            }
        } else {
            setUser(p => ({...p, coupons: [{ id: 'WELCOME10', val: 10, title: '🎁 Presente de Boas-Vindas', code: 'WELCOME10' }]}));
        }
    } catch (e) { console.error(e); }
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

  // SCARCITY TRIGGER
  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 4) + 3; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 4000);
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({ ...prev, type: type, item: item, extras: {}, payment: '', appliedCoupon: null, termsAccepted: false }));
  };

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();
      if (isToday) {
          const currentHour = now.getHours();
          return slots.filter(time => { const [hour] = time.split(':').map(Number); return hour > currentHour + 1; });
      }
      return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    const safeExtras = booking.extras || {};
    Object.keys(safeExtras).forEach(k => { 
        if(safeExtras[k]) {
            const extraItem = DATA.extras.find(e=>e.id===k);
            if(extraItem) sub += extraItem.price; 
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  // GERADOR WHATSAPP - TEXTO ACONCHEGANTE
  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    let locTxt = "";
    let mapQuery = "";
    
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${T.zap.house} \n${fullAddr}\n📝 *Comp:* ${booking.address.comp || 'N/A'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${T.zap.motel} (Combinar detalhes no chat)`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel} \n${fullAddr}\n🚪 *Quarto:* ${booking.address.comp || 'N/A'}`;
        mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras || {}).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `✅ + ${ext.label}` : '';
    }).filter(Boolean).join('\n');
    
    const header = booking.type === 'pack' || booking.type === 'subscription' ? T.zap.section_plan : T.zap.section_serv;
    
    const msg = `
${T.zap.intro}
Gostaria de agendar um momento pra relaxar.

${header} ${booking.item?.title}
📅 *Data:* ${dateStr} às ${booking.time}

${extrasList ? `${T.zap.extra_title} \n${extrasList}\n` : ''}
${locTxt}
${mapQuery ? `\n🗺️ *Map:* http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}

${T.zap.section_fin} R$ ${f.total},00
${T.zap.pay_method} ${booking.payment}
${T.zap.uber_label} ${T.zap.uber_text}

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
          const newCoupon = { id: code, val, title: `🎟️ Convite ${code}`, code };
          setBooking(b => ({...b, appliedCoupon: newCoupon}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_coupon_error, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    if (booking.appliedCoupon && booking.appliedCoupon.id.includes('WELCOME')) {
        updatedCoupons = updatedCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    }
    const xpBase = financials.total;
    const xpMultiplier = booking.type === 'pack' ? 1.5 : 1;
    const xpGain = Math.floor(xpBase * xpMultiplier * 0.1); 
    const currentXp = user.xp || 0;
    const newXP = Math.floor(currentXp + xpGain);
    
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && currentXp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Recompensa Nível ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });

    if (leveledUp) setLevelUpPopup(true);
    
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: (prev.ordersCount || 0) + 1 }));
    setShowConfetti(true);
    
    if (typeof window !== 'undefined') {
        const zapLink = generateWhatsAppLink();
        window.open(zapLink, '_blank');
    }
    setStep(4);
  };

  // LOGICA DA BARRA DE XP
  const getCurrentLevelProgress = () => {
      const currentXp = user.xp || 0;
      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => currentXp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      const totalNeeded = nextLevel.xpNeeded - currentLevel.xpNeeded;
      const currentProgress = currentXp - currentLevel.xpNeeded;
      return Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));
  };

  const getNextLevelInfo = () => {
      const nextLevel = DATA.levels.find(l => l.xpNeeded > (user.xp || 0));
      return nextLevel ? { needed: nextLevel.xpNeeded - (user.xp || 0), reward: nextLevel.reward } : null;
  };

  const nextLevelInfo = getNextLevelInfo();

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative"><div className="w-20 h-20 rounded-full bg-amber-500/80 flex items-center justify-center animate-pulse shadow-2xl shadow-amber-500/30"><span className="text-2xl font-black text-black">TM</span></div></div>
        <h1 className="mt-8 text-xl font-bold tracking-tight animate-pulse text-amber-500">Thalyson Massagens</h1>
        <div className="mt-4 flex items-center gap-2 text-xs opacity-50 font-mono"><Loader2 size={14} className="animate-spin"/>{T.loading}</div>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* TOASTS */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 rounded-2xl shadow-2xl animate-slide-down border backdrop-blur-xl ${t.type === 'success' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-red-500/90 text-white border-red-400'}`}>
            {t.type === 'success' ? <Check size={18} strokeWidth={3}/> : <AlertTriangle size={18} strokeWidth={3}/>}
            <span className="text-xs font-bold">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />
      
      {/* SCARCITY */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-500 transform ${showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-white/20">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-[10px] font-bold tracking-wide uppercase">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800' : 'bg-white/80 border-b border-slate-200'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-lg shadow-amber-500/20">TM</div>
          <div><span className="font-bold text-sm tracking-tight block">Thalyson</span><span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest">Massagens</span></div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${isDark ? 'bg-gradient-to-tr from-purple-500 to-pink-500 text-white' : 'bg-pink-100 text-pink-600'}`}><Instagram size={18}/></a>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        <div className={`fixed top-16 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>
        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                    <h1 className="text-3xl font-black tracking-tight">{T.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                </div>
                <p className={`text-sm mb-6 font-medium leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                {/* XP CARD */}
                <div className={`relative overflow-hidden rounded-3xl p-5 mb-6 border shadow-lg transition-all ${isDark ? 'bg-gradient-to-br from-zinc-900 to-black border-zinc-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-500/20`}>
                                <Trophy className="text-white" size={24} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{T.level_label}</span>
                                <h3 className={`font-black text-lg text-amber-500`}>
                                    {DATA.levels.find(l => (user.xp || 0) >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && (user.xp || 0) >= nl.xpNeeded)))?.title || DATA.levels[0].title}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-black">{user.xp || 0}</span>
                            <span className="text-[10px] font-bold opacity-50 block">{T.xp_label}</span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p className="text-[10px] opacity-60 mb-1">
                            {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : T.max_level}
                        </p>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all duration-1000 ease-out" style={{width: `${getCurrentLevelProgress()}%`}}></div>
                        </div>
                    </div>
                </div>
                
                <Button variant="secondary" full size="sm" onClick={() => setReviewsOpen(true)} icon={Star}>{T.reviews_btn}</Button>
              </div>

              <div className={`grid grid-cols-2 p-1.5 rounded-2xl mb-8 relative ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark?'bg-zinc-800 text-white shadow-lg':'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}><Package size={14}/> {T.tab_packs}</button>
              </div>

              <div className="space-y-4 animate-slide-in">
                  {(activeTab === 'single' ? DATA.services : DATA.plans).map(s => (
                      <Card key={s.id} isDark={isDark} active={booking.item?.id === s.id} onClick={() => handleSelectItem(activeTab === 'single' ? 'single' : s.type, s)} tag={s.tag}>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl transition-colors ${booking.item?.id === s.id ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={26}/></div>
                            <div className="text-right">
                                <span className="block text-2xl font-black tracking-tight">R$ {s.price}</span>
                                {s.fullPrice && <span className="text-xs text-zinc-500 line-through">R$ {s.fullPrice}</span>}
                            </div>
                          </div>
                          <h3 className="font-bold text-lg leading-tight mb-2">{s.title}</h3>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                          {booking.item?.id === s.id && (<div className={`mt-4 p-4 rounded-xl text-xs leading-relaxed animate-fade-in border whitespace-pre-line ${isDark ? 'bg-black/40 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}><div className="flex items-center gap-2 font-bold mb-2 text-amber-500"><Info size={12}/> {T.details_label}</div>{s.details}</div>)}
                      </Card>
                  ))}
              </div>
            </div>
          )}

          {/* DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold mb-1">{T.select_time_title}</h2>
                 <p className={`text-xs uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-4">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[76px] h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 active:scale-95 duration-200 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/30 scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-400')}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider">{lbl}</span><span className="text-2xl font-black">{d.getDate()}</span>{isSel && <span className="w-1.5 h-1.5 rounded-full bg-black mt-1 animate-pulse"></span>}
                    </button>
                  )
                })}
              </div>
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }} className={`py-4 rounded-xl text-sm font-bold border transition-all active:scale-95 duration-200 relative overflow-hidden group ${booking.time === t ? 'bg-white text-black border-white shadow-xl scale-[1.02]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                           <span className="relative z-10">{t}</span>{booking.time === t && <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-white opacity-50"></div>}
                       </button>
                   ))}
                </div>
              )}
            </div>
          )}

          {/* LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl font-bold text-center mb-8">{T.location_title}</h2>
              <div className={`grid grid-cols-3 gap-2 p-1.5 rounded-2xl mb-8 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow-md' : 'bg-white text-black shadow-md') : 'opacity-40 hover:opacity-100'}`}>
                        <x.i size={20} strokeWidth={2.5}/> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-5">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} isDark={isDark} placeholder={isPT ? "Nome" : "Name"} />
                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_90px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} isDark={isDark} icon={MapPin} placeholder={isPT ? "Rua/Av" : "Street"} />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} isDark={isDark} placeholder="123" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} isDark={isDark} placeholder={isPT ? "Bairro" : "District"} />
                        <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder={isPT ? "Cidade" : "City"} />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} placeholder={isPT ? "Apt" : "Unit"} />
                        </div>
                     </div>
                 )}
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} isDark={isDark} icon={Building} placeholder={isPT ? "Nome do Hotel" : "Hotel Name"} />
                        <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder={isPT ? "Cidade" : "City"} />
                        <InputField label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} icon={Lock} placeholder={isPT ? "Quarto" : "Room"} />
                    </div>
                 )}
                 {booking.locationType === 'motel' && (
                    <div className={`p-6 rounded-3xl border text-center text-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3"><Smartphone className="opacity-50" size={20}/></div>
                        {T.motel_note}
                    </div>
                 )}
              </div>
              {/* EXTRAS */}
              {booking.type === 'single' && (
                  <div className="pt-8 border-t border-dashed border-zinc-800/50 mt-8">
                     <h3 className={`text-[10px] font-bold uppercase mb-4 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] duration-200 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/50' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                              <div className="flex items-center gap-4">
                                 <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
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

          {/* CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className="relative">
                   <div className={`p-6 rounded-t-[2rem] rounded-b-xl border-t border-x shadow-2xl relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600"></div>
                      <div className="flex justify-between items-start mb-6 mt-2">
                          <div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded mb-2 inline-block ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>{booking.type === 'pack' ? (isPT?'Pacote':'Pack') : (booking.type === 'subscription' ? (isPT?'Assinatura':'Subscription') : (isPT?'Sessão Individual':'Single Session'))}</span>
                              <h2 className="font-black text-2xl leading-tight text-amber-500">{booking.item.title}</h2>
                              <p className="text-xs opacity-60 mt-1">{booking.date?.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN)} {isPT ? 'às' : 'at'} {booking.time}</p>
                          </div>
                      </div>
                      <div className="space-y-3 border-b border-dashed border-zinc-700/50 pb-6 mb-6">
                          <div className="flex justify-between text-sm"><span>{isPT?'Valor Base':'Base Price'}</span><span>R$ {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                              const extra = DATA.extras.find(e=>e.id===k);
                              return extra ? (<div key={k} className="flex justify-between text-sm opacity-60"><span>+ {extra.label}</span><span>{extra.price}</span></div>) : null;
                          })}
                          {booking.appliedCoupon && (<div className="flex justify-between text-sm text-green-500 font-bold bg-green-500/5 p-2 rounded-lg"><span>{isPT?'Cupom':'Coupon'} ({booking.appliedCoupon.code})</span><span>- R$ {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className="text-[10px] font-bold uppercase opacity-50 block mb-1">{T.total_label}</span><span className="text-[10px] font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">{T.uber_warning}</span></div>
                          <span className="text-4xl font-black tracking-tighter text-white">R$ {financials.total}</span>
                      </div>
                   </div>
                   <div className="h-4 w-full bg-repeat-x bg-[length:20px_20px] opacity-10" style={{backgroundImage: `linear-gradient(45deg, transparent 33.333%, ${isDark?'#fff':'#000'} 33.333%, ${isDark?'#fff':'#000'} 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, ${isDark?'#fff':'#000'} 33.333%, ${isDark?'#fff':'#000'} 66.667%, transparent 66.667%)`, backgroundSize: '20px 40px', backgroundPosition: '0 -20px'}}></div>
               </div>
               <div className="mt-6 flex gap-2">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-4 py-3 rounded-xl border outline-none text-sm font-bold uppercase tracking-widest ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                       <Tag size={16} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>
               <div className="mt-8">
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-1">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub: isPT?'Preferido':'Preferred'}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-5 py-4 rounded-2xl border flex items-center gap-4 transition-all active:scale-[0.98] duration-200 ${booking.payment === p.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-black/20' : 'bg-zinc-800'}`}><p.i size={20}/></div>
                               <div className="text-left"><span className="font-bold text-sm block">{p.l}</span>{p.sub && <span className="text-[10px] opacity-60 block uppercase tracking-widest">{p.sub}</span>}</div>
                               {booking.payment === p.id && <Check size={20} className="ml-auto" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>
               <div className={`mt-8 p-4 rounded-2xl border flex flex-col gap-3 transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                         <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18}/>
                         <div><h4 className="text-sm font-bold text-amber-500 mb-1">{T.terms_title}</h4><p className="text-xs opacity-70 mb-2 cursor-pointer underline hover:text-white transition-colors" onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/20 cursor-pointer select-none"><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 accent-amber-500 rounded cursor-pointer"/><span className="text-xs font-bold">{T.agree_terms}</span></label>
               </div>
            </div>
          )}

          {/* SUCCESS */}
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
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle} shimmer>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-xs font-bold uppercase opacity-40 tracking-widest hover:opacity-100 p-4 transition-opacity">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-50 pointer-events-none">
            <div className="pointer-events-auto max-w-md mx-auto">
                <div className={`p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border transition-colors duration-500 ${isDark ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-zinc-200'}`}>
                    {step > 0 && (<button onClick={()=>setStep(step-1)} className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform border ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-slate-100 border-slate-200'}`}><ChevronLeft size={24}/></button>)}
                    {step < 3 && booking.item && (<div className="flex-1 pl-2 animate-fade-in"><span className="block text-[9px] font-bold uppercase opacity-50 tracking-wider mb-0.5">{T.total_label}</span><span className="block text-2xl font-black tracking-tight text-amber-500">R$ {financials.total}</span></div>)}
                    <button onClick={handleNextStep} className={`h-14 px-8 rounded-full font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${step < 3 ? 'ml-auto' : 'w-full'} bg-amber-500 text-black shadow-amber-500/30 hover:bg-amber-400 hover:scale-[1.02] active:scale-95 group`}>
                        {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18} strokeWidth={3}/>}
                        {step !== 3 && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 animate-[shimmer_3s_infinite]" />}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODAL REVIEWS (RESTAURADO) */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2rem] p-6 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Depoimentos Reais</h3><button onClick={()=>setReviewsOpen(false)} className="p-2 bg-black/10 rounded-full"><X size={20}/></button></div>
            <div className="space-y-4">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className={`p-5 rounded-2xl border relative transition-colors ${isDark ? 'bg-zinc-800/30 border-zinc-800 hover:bg-zinc-800/50' : 'bg-slate-50 border-slate-100'}`}>
                       <Quote size={16} className="absolute top-4 right-4 text-amber-500 opacity-30" />
                       <div className="flex justify-between mb-2">
                           <span className="font-bold text-sm flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-[10px] text-black font-black">{r.n.charAt(0)}</div>{r.n}</span>
                       </div>
                       <div className="flex text-amber-400 gap-0.5 mb-2">{[...Array(r.s)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                       <p className="text-sm opacity-80 leading-relaxed font-medium">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      {/* MODAL TERMOS (RESTAURADO) */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-2 bg-black/10 rounded-full"><X size={20}/></button></div>
            <div className="space-y-4">
                {T.terms_body.map((t,i)=>(<div key={i} className="flex gap-4 p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50"><span className="font-black text-amber-500 text-xl opacity-50">{i+1}</span><p className="text-sm opacity-80 leading-relaxed">{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-500 blur-[80px] opacity-20"></div><div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500 blur-[80px] opacity-20"></div></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce"><Trophy size={48} className="text-white" /></div>
                <h2 className="text-3xl font-black mb-2 italic tracking-tight">{T.popup_level_title}</h2><p className="opacity-70 text-base leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl rotate-6 flex items-center justify-center mx-auto mb-6 shadow-2xl border border-zinc-700"><Gift size={40} className="text-amber-500" /></div>
                <h2 className="text-2xl font-black mb-2">{T.popup_welcome_title}</h2><p className="opacity-70 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-500 mb-1">Seu Código:</p><p className="text-xl font-mono font-black text-amber-500 tracking-widest">WELCOME10</p></div>
                <Button full variant="primary" onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}} shimmer>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.6s ease-out}.animate-slide-up{animation:slideUp 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-slide-in{animation:slideIn 0.5s cubic-bezier(0.16,1,0.3,1)}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.3s ease-out}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(100px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.9) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}@keyframes slideDown{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}} @keyframes shimmer{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}`}</style>
    </div>
  );
}
