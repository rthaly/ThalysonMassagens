import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, BedDouble, Globe, Moon, Sun, 
  Instagram, Heart, Sparkles
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "https://instagram.com/seumassagista",
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v18_final',
  XP_TARGET: 300, // Pontos para ganhar o prêmio
  REWARD_VAL: 30  // Valor do prêmio
};

// ==================================================================================
// 2. TEXTOS ACOLHEDORES & DETALHADOS (i18n)
// ==================================================================================

const TEXTS = {
  pt: {
    // Intro
    welcome: "Oi, vamos relaxar?",
    subtitle: "Seu momento de paz e prazer, no conforto do seu espaço.",
    your_name: "Como posso te chamar?",
    name_placeholder: "Seu nome...",
    health_check: "Sou maior de 18 anos e estou saudável.",
    start_btn: "Ver as Experiências",
    
    // Serviços (Copy Realista)
    choose_svc: "O que você busca hoje?",
    
    svc_comp_name: "🔥 Experiência Completa (1h)",
    svc_comp_badge: "A MAIS PEDIDA ❤️",
    svc_comp_steps: [
        '1️⃣ Começo tirando toda tensão muscular.',
        '2️⃣ O clima esquenta: contato pele com pele (sensitivo).',
        '3️⃣ Finalizo com massagem íntima manual (Tântrica).'
    ],
    svc_comp_note: "Focado no seu prazer. Sem penetração/oral.",
    
    svc_relax_name: "🍃 Apenas Relaxar (1h)",
    svc_relax_badge: "TIRE O STRESS",
    svc_relax_steps: [
        '1️⃣ Foco total em tirar dores e nós.',
        '2️⃣ Movimentos firmes nas costas e pernas.',
        '3️⃣ Você sai leve e renovado.'
    ],
    svc_relax_note: "Atenção: Nessa não tem toques íntimos.",

    // Extras
    personalize: "Quer turbinar a sessão?",
    ext_time: "Quero mais tempo (+30min)",
    ext_time_sub: "Pra curtir sem pressa",
    ext_touch: "Interatividade Total",
    ext_touch_sub: "Pode tocar e trocar energia",
    ext_touch_warn: "Fico de cueca na interação",
    ext_aroma: "Aromaterapia",
    ext_aroma_sub: "Óleos e cheiros especiais",

    // Fluxo
    date_title: "Quando fica bom pra você?",
    sold_out: "OCUPADO",
    continue: "Continuar",
    
    loc_title: "Onde eu te encontro?",
    btn_home: "Minha Casa",
    btn_hotel: "Hotel",
    btn_motel: "Motel",
    
    city_lbl: "Qual Cidade?",
    city_ph: "Ex: Londrina, SP...",
    
    lbl_motel: "Nome do Motel",
    lbl_suite: "Número da Suíte",
    lbl_hotel: "Nome do Hotel",
    lbl_room: "Número do Quarto",
    lbl_addr: "Endereço (Rua)",
    lbl_num: "Número",
    lbl_dist: "Bairro",
    lbl_comp: "Complemento",
    
    uber_warn: "O Uber não está incluso, tá? Calculo certinho no WhatsApp.",
    
    // Finalização
    review_title: "Tudo certo?",
    base_val: "Serviço",
    coupon_lbl: "Desconto",
    add_coupon: "Usar Cupom",
    total_lbl: "Total a Pagar",
    
    pay_title: "Como prefere pagar?",
    money: "Dinheiro",
    card: "Cartão",
    pix: "Pix",
    
    confirm_btn: "Confirmar no WhatsApp",
    copy_pix: "COPIAR CHAVE PIX",
    
    // Gamificação & Menu
    menu_fid: "Seu Cartão Fidelidade",
    xp_desc: "A cada visita você junta pontos.",
    xp_missing: "Faltam",
    xp_goal: "pontos para ganhar R$ 30 OFF!",
    gift_title: "Presente pra você!",
    gift_sub: "Toque para pegar seu desconto de 1ª vez.",
    
    wallet_title: "Meus Prêmios",
    wallet_empty: "Sua carteira está vazia por enquanto.",
    
    menu_doubts: "Dúvidas Comuns",
    menu_share: "Indicar Amigo",
    
    success_title: "Tudo Pronto!",
    success_msg: "Já recebi seu pedido no WhatsApp. Vou calcular o Uber e te respondo rapidinho!",
    new_book: "Voltar ao Início"
  },
  en: {
    welcome: "Hi, let's relax?",
    subtitle: "Your moment of peace and pleasure, at your place.",
    your_name: "How should I call you?",
    name_placeholder: "Your name...",
    health_check: "I am 18+ and healthy.",
    start_btn: "See Experiences",
    
    choose_svc: "What do you need today?",
    
    svc_comp_name: "🔥 Complete Experience (1h)",
    svc_comp_badge: "MOST LOVED ❤️",
    svc_comp_steps: [
        '1️⃣ I start by removing all muscle tension.',
        '2️⃣ It gets hotter: skin-to-skin contact (sensitive).',
        '3️⃣ Finish with intimate manual massage (Tantra).'
    ],
    svc_comp_note: "Pleasure focused. No penetration/oral.",
    
    svc_relax_name: "🍃 Just Relax (1h)",
    svc_relax_badge: "STRESS RELIEF",
    svc_relax_steps: [
        '1️⃣ Focus on knots and pain relief.',
        '2️⃣ Firm movements on back and legs.',
        '3️⃣ You leave feeling light and renewed.'
    ],
    svc_relax_note: "Note: No intimate touching here.",

    personalize: "Want to boost it?",
    ext_time: "More Time (+30min)",
    ext_time_sub: "No rush",
    ext_touch: "Full Interactivity",
    ext_touch_sub: "Touch & energy exchange",
    ext_touch_warn: "Underwear stays on",
    ext_aroma: "Aromatherapy",
    ext_aroma_sub: "Special oils and scents",

    date_title: "When works for you?",
    sold_out: "BUSY",
    continue: "Next",
    
    loc_title: "Where should I go?",
    btn_home: "Home",
    btn_hotel: "Hotel",
    btn_motel: "Motel",
    
    city_lbl: "City",
    city_ph: "Ex: Londrina...",
    
    lbl_motel: "Motel Name",
    lbl_suite: "Suite #",
    lbl_hotel: "Hotel Name",
    lbl_room: "Room #",
    lbl_addr: "Address",
    lbl_num: "Number",
    lbl_dist: "District",
    lbl_comp: "Complement",
    
    uber_warn: "Uber fee not included. I'll calc on WhatsApp.",
    
    review_title: "All good?",
    base_val: "Service",
    coupon_lbl: "Discount",
    add_coupon: "Use Coupon",
    total_lbl: "Total to Pay",
    
    pay_title: "Payment Method",
    money: "Cash",
    card: "Card",
    pix: "Pix",
    
    confirm_btn: "Confirm on WhatsApp",
    copy_pix: "COPY PIX KEY",
    
    menu_fid: "Loyalty Card",
    xp_desc: "Earn points every visit.",
    xp_missing: "Need",
    xp_goal: "points to get R$ 30 OFF!",
    gift_title: "A Gift for You!",
    gift_sub: "Tap to redeem your 1st time discount.",
    
    wallet_title: "My Rewards",
    wallet_empty: "Your wallet is empty yet.",
    
    menu_doubts: "Common Questions",
    menu_share: "Share with Friend",
    
    success_title: "All Set!",
    success_msg: "Received your request on WhatsApp. I'll calculate the Uber and reply asap!",
    new_book: "Back to Start"
  }
};

const SERVICES_DB = [
  { id: 'completa', price: 175, xp: 100 },
  { id: 'relax', price: 145, xp: 50 }
];

const EXTRAS_DB = [
  { id: 'more_time', icon: Clock, price: 70 },
  { id: 'touch', icon: Flame, price: 63 },
  { id: 'aroma', icon: Wind, price: 10 }
];

// REVIEWS TRADUZIDAS
const REVIEWS_DATA = {
  pt: [
    { t: "A progressão da massagem é perfeita. Começa relaxando e termina intenso.", a: "Tiago", s: 5 },
    { t: "Thalyson é muito gente boa. Me deixou super à vontade.", a: "Roberto", s: 5 },
    { t: "Fui travado e saí leve. A finalização vale cada centavo.", a: "Pedro H.", s: 5 },
    { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
    { t: "Atendimento no hotel foi rápido e discreto. Salvou minha viagem.", a: "Viajante", s: 5 }
  ],
  en: [
    { t: "The progression is perfect. Starts relaxing, ends intense.", a: "Tiago", s: 5 },
    { t: "Thalyson is a great guy. Made me feel very comfortable.", a: "Robert", s: 5 },
    { t: "Went in stiff, left light. The finish is worth every penny.", a: "Peter H.", s: 5 },
    { t: "Firm hand, strong grip. The cream makes a difference.", a: "Curious", s: 5 },
    { t: "Hotel service was fast and discreet. Saved my trip.", a: "Traveler", s: 5 }
  ]
};

const FAQS_DATA = {
  pt: [
    { q: "É seguro e sigiloso?", a: "Totalmente. Sou profissional e respeito sua privacidade." },
    { q: "Onde você atende?", a: "Vou até você (Casa, Hotel ou Motel)." },
    { q: "Como funciona a higiene?", a: "Levo tudo limpo e descartável. Higiene é prioridade." },
    { q: "Aceita Cartão?", a: "Sim, levo a maquininha." }
  ],
  en: [
    { q: "Is it safe and discreet?", a: "Totally. I am professional and respect privacy." },
    { q: "Where do you serve?", a: "I come to you (Home, Hotel, Motel)." },
    { q: "How about hygiene?", a: "I bring everything clean/disposable." },
    { q: "Do you accept cards?", a: "Yes, I bring the machine." }
  ]
};

// ==================================================================================
// 3. COMPONENTES DE UI (DESIGN ATUALIZADO)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

const Toast = ({ msg, show, isDark }) => (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 transform ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
        <div className={`${isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-900 border-zinc-200'} border px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}>
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-xs font-bold uppercase">{msg}</span>
        </div>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder, type="text", icon: Icon, isDark }) => (
  <div className="mb-4 w-full">
    <label className={`text-[10px] font-bold uppercase ml-1 mb-1.5 block tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</label>
    <div className="relative group">
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full h-12 rounded-xl px-4 pl-11 text-base outline-none transition-all border 
            ${isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-green-500 placeholder:text-zinc-700' 
                : 'bg-white border-zinc-200 text-zinc-900 focus:border-green-500 placeholder:text-zinc-300'}`}
        />
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon, pulse, isDark }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
            ${disabled 
                ? (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400') 
                : (isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800')
            }
            ${pulse ? 'animate-pulse' : ''}
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

const SplashScreen = ({ onFinish, isDark }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { 
        const t1 = setTimeout(() => setFade(true), 1500); 
        const t2 = setTimeout(onFinish, 2000); 
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onFinish]);
    return (
        <div className={`fixed inset-0 z-[120] flex flex-col items-center justify-center transition-opacity duration-700 ${isDark ? 'bg-black' : 'bg-white'} ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
                <Zap size={56} className="text-green-500 relative z-10 animate-bounce" fill="currentColor"/>
            </div>
            <h1 className={`text-2xl font-black tracking-[0.3em] ${isDark ? 'text-white' : 'text-black'}`}>THALY</h1>
        </div>
    );
};

// ==================================================================================
// 4. APP LÓGICA PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // THEME & LANG
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  const T = TEXTS[lang];

  // PERSISTENCE
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch (e) { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => {
      const t = localStorage.getItem('thaly_theme');
      if (t) setIsDark(t === 'dark');
      const l = localStorage.getItem('thaly_lang');
      if (l) setLang(l);
  }, []);

  useEffect(() => { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch (e) {} }, [user]);

  const toggleTheme = () => { setIsDark(!isDark); localStorage.setItem('thaly_theme', !isDark ? 'dark' : 'light'); };
  const toggleLang = () => { const n = lang === 'pt' ? 'en' : 'pt'; setLang(n); localStorage.setItem('thaly_lang', n); };

  // BOOKING STATE
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, 
      date: null,
      time: null,
      locationType: 'home', 
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // ACTIONS
  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };
  const handleReset = () => { setSuccess(false); setBooking(initialBooking); setStep(0); };

  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return 'past';
      if ((sel.getDate() + h) % 5 === 0) return 'sold_out'; 
      return 'available';
  };

  const calculateTotal = () => {
      let s = booking.service?.price || 0;
      let e = 0;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += EXTRAS_DB.find(x => x.id === k).price; });
      const d = booking.appliedCoupon?.val || 0;
      return { service: s, extras: e, disc: d, final: Math.max(0, s + e - d) };
  };

  // Lógica de Validação Robusta
  const isAddressValid = () => {
      const { city, street, number, district, motelName, suite, hotelName, room } = booking.address;
      if (!city || city.length < 3) return false;
      if (booking.locationType === 'motel') return motelName && suite;
      if (booking.locationType === 'hotel') return hotelName && room;
      return street && number && district;
  };

  const finalize = () => {
      // 1. Queima Cupom / Adiciona XP
      const newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: CONFIG.REWARD_VAL });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 2. Monta Link
      let locStr = "";
      let mapLink = "";
      const addr = booking.address;
      
      if(booking.locationType === 'motel') {
          locStr = `🏩 ${T.lbl_motel}: ${addr.motelName}\n🚪 ${T.lbl_suite}: ${addr.suite}`;
          mapLink = `${addr.motelName}, ${addr.city}`;
      } else if(booking.locationType === 'hotel') {
          locStr = `🏨 ${T.lbl_hotel}: ${addr.hotelName}\n🚪 ${T.lbl_room}: ${addr.room}`;
          mapLink = `${addr.hotelName}, ${addr.city}`;
      } else {
          locStr = `🏠 ${T.lbl_addr}: ${addr.street}, ${addr.number}\n🏘️ ${T.lbl_dist}: ${addr.district}`;
          mapLink = `${addr.street}, ${addr.number}, ${addr.city}`;
      }

      const fin = calculateTotal();
      const svcName = booking.service.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
      
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
          let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
          return `• ${l} (+${Utils.fmtMoney(EXTRAS_DB.find(x=>x.id===k).price)})`;
      }).join('\n');

      const text = `
*${T.zap_header}* 🌿
---------------------------
👤 *${user.name}*
✅ (+18 OK)

💆 ${svcName}
📅 ${new Date(booking.date).toLocaleDateString('pt-BR')} @ ${booking.time}

✨ ${extrasTxt ? 'Extras:\n'+extrasTxt : 'No Extras'}

📍 ${T.city_lbl}: ${addr.city}
${locStr}
🔗 ${encodeURIComponent(mapLink)}

💰 *${T.review_title}:*
${T.base_val}: ${Utils.fmtMoney(fin.service)}
Extras: ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `${T.coupon_lbl}: - ${Utils.fmtMoney(fin.disc)}` : ''}
*${T.total_lbl}: ${Utils.fmtMoney(fin.final)}*

🚗 ${T.zap_uber}

💳 ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  // GAMIFICATION VARS
  const level = Math.floor(user.xp / CONFIG.XP_TARGET) + 1;
  const nextXp = (level * CONFIG.XP_TARGET) - user.xp;
  const progress = ((user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET) * 100;

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} isDark={isDark} />;

  // --- TELA DE SUCESSO ---
  if (success) return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce"><Check size={48} className="text-white" strokeWidth={4}/></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{T.success_title}</h2>
          <p className={`${isDark ? 'text-zinc-400' : 'text-zinc-600'} mb-8 max-w-xs`}>{T.success_msg}</p>
          <PrimaryButton onClick={handleReset} label={T.new_book} icon={RefreshCw} variant="secondary" isDark={isDark}/>
      </div>
  );

  return (
    <div className={`min-h-screen font-sans pb-40 transition-colors duration-300 ${isDark ? 'bg-black text-white selection:bg-green-500 selection:text-black' : 'bg-gray-50 text-zinc-900 selection:bg-black selection:text-white'}`}>
      <Toast show={toast.show} msg={toast.msg} isDark={isDark} />

      {/* HEADER FIXO */}
      <header className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className={`p-2 -ml-2 active:scale-90 transition-transform ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}><ChevronLeft size={24}/></button>}
                 <h1 className="text-sm font-black tracking-[0.2em] uppercase">Thaly</h1>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => window.open(CONFIG.INSTAGRAM, '_blank')} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Instagram size={18}/></button>
                 <button onClick={toggleLang} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><span className="text-[10px] font-bold">{lang.toUpperCase()}</span></button>
                 <button onClick={toggleTheme} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
                 <button onClick={() => setMenuOpen(true)} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Menu size={18}/></button>
             </div>
         </div>
         <div className={`h-[2px] w-full ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`}><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MENU DRAWER */}
      {menuOpen && <div className="fixed inset-0 z-50 flex justify-end"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div><div className={`relative w-72 h-full border-l p-6 shadow-2xl animate-slide-in ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><button onClick={()=>setMenuOpen(false)} className="mb-8"><X/></button><div className={`p-4 rounded-xl mb-4 border ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-gray-100 border-gray-200'}`}><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold uppercase flex items-center gap-2"><Award size={14} className="text-green-500"/> {T.menu_fid}</span><span className="text-green-500 font-bold text-xl">{level}</span></div><div className="h-2 bg-zinc-600 rounded-full overflow-hidden mb-2"><div className="h-full bg-green-500" style={{width:`${progress}%`}}></div></div><p className="text-[10px] opacity-70">{T.xp_missing} <span className="font-bold text-green-500">{nextXp}</span> {T.xp_goal}</p></div><button className={`w-full py-4 rounded-xl font-bold text-sm mb-2 text-left px-4 flex items-center gap-3 ${isDark ? 'bg-[#1C1C1E] hover:bg-[#222]' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => { setWalletOpen(true); setMenuOpen(false); }}><Wallet size={16}/> {T.wallet_title}</button><button className={`w-full py-4 rounded-xl font-bold text-sm mb-2 text-left px-4 flex items-center gap-3 ${isDark ? 'bg-[#1C1C1E] hover:bg-[#222]' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={() => { setHelpOpen(true); setMenuOpen(false); }}><HelpCircle size={16}/> {T.menu_doubts}</button><button className={`w-full py-4 rounded-xl font-bold text-sm text-left px-4 flex items-center gap-3 ${isDark ? 'bg-[#1C1C1E] hover:bg-[#222]' : 'bg-gray-100 hover:bg-gray-200'}`} onClick={()=>{if(navigator.share)navigator.share({url:window.location.href})}}><Share2 size={16}/> {T.menu_share}</button></div></div>}
      
      {/* WALLET */}
      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"><div className={`w-full max-w-sm border rounded-3xl p-6 animate-fade-in ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><div className="flex justify-between mb-6"><h3 className="font-bold text-xl flex gap-2"><Wallet className="text-green-500"/> {T.wallet_title}</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>{user.coupons.length===0?<p className="text-center opacity-50">{T.wallet_empty}</p>:user.coupons.map(c=>(<button key={c.id} onClick={()=>{setBooking({...booking, appliedCoupon:c});setWalletOpen(false);showToast(T.coupon_lbl);}} className={`w-full p-4 border border-green-900 rounded-xl flex justify-between mb-2 text-green-500 font-bold ${isDark ? 'bg-black' : 'bg-green-50'}`}><span>{c.label}</span><span>R$ {c.val}</span></button>))}</div></div>}

      {/* HELP */}
      {helpOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"><div className={`w-full max-w-sm border rounded-3xl p-6 ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><h3 className="font-bold text-xl mb-4">{T.menu_doubts}</h3><div className="space-y-3">{FAQS_DATA[lang].map((f,i)=>(<div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}><p className="text-green-500 text-xs font-bold mb-1">{f.q}</p><p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{f.a}</p></div>))}</div><button onClick={()=>setHelpOpen(false)} className={`w-full mt-4 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-[#333]' : 'bg-gray-200'}`}>Close</button></div></div>}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">

        {/* --- PASSO 0 --- */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer mb-8 transition-colors ${isDark ? 'bg-gradient-to-r from-green-900/20 to-black border-green-500/20 hover:border-green-500/50' : 'bg-green-50 border-green-200 hover:border-green-300'}`}>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white animate-pulse"><Gift size={20}/></div>
                        <div><p className={`font-black text-sm uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}>{T.gift_title}</p><p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.gift_sub}</p></div>
                    </div>
                )}
                
                <h2 className="text-3xl font-black mb-1 tracking-tight">{T.welcome}</h2>
                <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.subtitle}</p>
                
                <div className="space-y-4 mb-10">
                    <BigInput label={T.your_name} placeholder={T.name_placeholder} value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} isDark={isDark} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'border-green-500 bg-green-500/10' : (isDark ? 'bg-[#0A0A0A] border-[#222]' : 'bg-white border-gray-200')}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-400'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.health_check}</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">{T.choose_svc}</h3>
                
                <div className="space-y-6 pb-10">
                    {SERVICES_DB.map(s => {
                        const name = s.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
                        const badge = s.id === 'completa' ? T.svc_comp_badge : T.svc_relax_badge;
                        const steps = s.id === 'completa' ? T.svc_comp_steps : T.svc_relax_steps;
                        const note = s.id === 'completa' ? T.svc_comp_note : T.svc_relax_note;
                        
                        return (
                            <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${booking.service?.id === s.id ? (isDark ? 'bg-[#18181b] border-green-500' : 'bg-green-50 border-green-500') : (isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200')}`}>
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-zinc-500' : 'bg-gray-200 text-zinc-500')}`}>{badge}</div>
                                <h3 className={`text-xl font-black uppercase mb-1 ${booking.service?.id === s.id ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-400'}`}>{name}</h3>
                                <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-500' : 'text-zinc-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                                <div className={`space-y-2 mb-4 p-4 rounded-xl ${booking.service?.id === s.id ? (isDark ? 'bg-black/40' : 'bg-white/60') : (isDark ? 'bg-black/20' : 'bg-gray-50')}`}>{steps.map((st, i) => (<p key={i} className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{st}</p>))}</div>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-1 italic"><Info size={10}/> {note}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="mb-20">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {REVIEWS_DATA[lang].map((r, i) => (
                            <div key={i} className={`min-w-[260px] p-5 rounded-2xl border flex-shrink-0 ${isDark ? 'bg-[#161616] border-[#2A2A2A]' : 'bg-white border-gray-200'}`}>
                                <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                                <p className={`text-xs italic mb-2 line-clamp-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>"{r.t}"</p>
                                <p className="text-[9px] font-black uppercase flex items-center gap-1 opacity-50"><Shield size={10}/> {r.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label={T.start_btn} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* --- PASSO 1 --- */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">{T.personalize}</h2>
                <div className="mb-10">
                    {EXTRAS_DB.map(ex => {
                        const active = booking.extras[ex.id];
                        let label = ex.id === 'more_time' ? T.ext_time : ex.id === 'touch' ? T.ext_touch : T.ext_aroma;
                        let sub = ex.id === 'more_time' ? T.ext_time_sub : ex.id === 'touch' ? T.ext_touch_sub : T.ext_aroma_sub;
                        let warn = ex.id === 'touch' ? T.ext_touch_warn : null;

                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? (isDark ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-green-50 border-green-500') : (isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200')}`}>
                                <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-zinc-600' : 'bg-gray-100 text-zinc-400')}`}><ex.icon size={20}/></div><div><p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{label}</p><p className="text-xs text-zinc-500">{sub}</p>{active && warn && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {warn}</p>}</div></div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-zinc-400'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{T.date_title}</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-zinc-500' : 'bg-white border-gray-200 text-zinc-400')}`}><span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span></button>
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in pb-24">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : status === 'sold_out' ? 'opacity-50 cursor-not-allowed' : status === 'past' ? 'opacity-30' : (isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-white border-gray-200')}`}>{t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">{T.sold_out}</span></div>}</button>
                        })}
                    </div>
                )}
                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label={T.continue} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* --- PASSO 2 --- */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">{T.loc_title}</h2>
                <div className={`flex p-1.5 rounded-2xl mb-6 border ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-gray-100 border-gray-200'}`}>
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: '', hotelName: '', room: '', street: '', number: '', district: ''}})} 
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? (isDark ? 'bg-[#333] text-white shadow-md' : 'bg-white text-black shadow-sm') : 'text-zinc-500'}`}>
                            {t === 'home' ? T.btn_home : (t === 'hotel' ? T.btn_hotel : T.btn_motel)}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label={T.city_lbl} placeholder={T.city_ph} value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} isDark={isDark} />
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_motel} value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} isDark={isDark} />
                            <BigInput label={T.lbl_suite} type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} isDark={isDark} />
                        </div>
                    ) : booking.locationType === 'hotel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_hotel} value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} isDark={isDark} />
                            <BigInput label={T.lbl_room} type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} isDark={isDark} />
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_addr} value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} isDark={isDark} />
                            <div className="flex gap-3">
                                <div className="w-1/3"><BigInput label={T.lbl_num} type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} isDark={isDark} /></div>
                                <div className="w-2/3"><BigInput label={T.lbl_dist} value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} isDark={isDark} /></div>
                            </div>
                            <BigInput label={T.lbl_comp} value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} isDark={isDark} />
                        </div>
                    )}
                </div>

                <div className={`border rounded-[2rem] p-6 mb-8 relative overflow-hidden ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-white border-gray-200 shadow-xl'}`}>
                    <div className={`border-b pb-4 mb-4 text-center ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{T.review_title}</p>
                        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{booking.service?.id==='completa' ? T.svc_comp_name : T.svc_relax_name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} @ {booking.time}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-zinc-400"><span>{T.base_val}</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
                             let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
                             return <div key={k} className={`flex justify-between text-sm ${isDark ? 'text-white' : 'text-zinc-800'}`}><span>+ {l}</span><span>{Utils.fmtMoney(EXTRAS_DB.find(e=>e.id===k).price)}</span></div>
                        })}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-500 font-bold py-2 border-t border-dashed border-gray-700"><span>{T.coupon_lbl}</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>
                        ) : (
                            <button onClick={() => setShowWallet(true)} className={`w-full py-2 border border-dashed rounded-lg text-xs flex items-center justify-center gap-2 mt-2 ${isDark ? 'border-[#444] text-zinc-500' : 'border-gray-300 text-zinc-500'}`}><Ticket size={12}/> {T.add_coupon}</button>
                        )}
                    </div>
                    <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <span className="text-xs font-bold text-zinc-500 uppercase">{T.total_lbl}</span>
                        <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{Utils.fmtMoney(calculateTotal().final)}</span>
                    </div>
                </div>

                <div className="mb-32">
                    <div className="flex justify-between items-center mb-2 px-1">
                        <p className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{T.pay_title}</p>
                        <button onClick={() => {Utils.copyPix(); showToast(T.pix_copied)}} className="text-[10px] font-bold text-green-500 flex items-center gap-1 hover:text-green-400"><Copy size={10}/> {T.copy_pix}</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'money'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-zinc-500' : 'bg-white border-gray-200 text-zinc-500')}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'money' && <Banknote size={18}/>}
                                {T[p]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-6 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 px-1"><span className="text-xs text-zinc-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> {T.uber_warn}</span></div>
                    <PrimaryButton disabled={!isAddressValid() || !booking.payment} onClick={finalize} label={T.confirm_btn} icon={MessageCircle} pulse isDark={isDark} />
                </div>
            </>
        )}
      </main>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scroll { animation: scroll 120s linear infinite; } @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
