import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car, Gift, Bell,
  Volume2, VolumeX, Map
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v50_final_pro',
  // Som de natureza premium (Pássaros + Água + Ambiente Relaxante)
  AUDIO_URL: "https://cdn.pixabay.com/download/audio/2022/02/07/audio_142b93e62d.mp3?filename=forest-lullaby-110624.mp3"
};

// Sistema de Níveis e Prêmios
const LEVEL_SYSTEM = [
  { level: 1, xpNeeded: 0, reward: 12, title: "Iniciante" },
  { level: 2, xpNeeded: 400, reward: 20, title: "Bronze" },
  { level: 3, xpNeeded: 1000, reward: 30, title: "Prata" },
  { level: 4, xpNeeded: 2000, reward: 50, title: "Ouro" }
];

const REVIEWS_DATA = [
  { n: "Tiago", t: "A sensitiva foi uma experiência de outro mundo.", s: 5 },
  { n: "Pedro H.", t: "Fui estressado e saí flutuando. A relaxante é séria e funciona.", s: 5 },
  { n: "Curioso SP", t: "Mão firme. O adicional de troca de energia vale muito.", s: 5 },
  { n: "Marcos", t: "Profissionalismo nota 10. O ambiente com aroma faz toda diferença.", s: 5 },
  { n: "Roberto", t: "A Mista é perfeita. Começa leve e termina intenso.", s: 5 }
];

const DB = {
  services: [
    { 
      id: 'relaxante', 
      min: 60, 
      price: 125, 
      icon: Wind, 
      color: 'text-teal-400',
      title: "Relaxante Terapêutica",
      desc: "Foco total em saúde mental e física.",
      details: "Técnica focada 100% em tirar dores, stress e ansiedade. Massagista profissional. **Nota: Nesta modalidade não há toques íntimos.**"
    },
    { 
      id: 'sensitiva', 
      min: 60, 
      price: 155, 
      icon: Flame, 
      color: 'text-rose-400',
      title: "Sensitiva Tântrica",
      desc: "Conexão, desejo e sensações à flor da pele.",
      details: "Uma experiência de bioletricidade. **Massagista atende de cueca.** Foco total em despertar sensações intensas e prazerosas pelo corpo todo."
    },
    { 
      id: 'mista', 
      min: 90, 
      price: 205, 
      icon: Zap, 
      color: 'text-amber-400',
      title: "Experiência Completa (Mista)",
      desc: "O melhor dos dois mundos. A mais pedida.",
      details: "Começa com a massagem relaxante para soltar a musculatura e termina com a intensidade da sensitiva. **Massagista de cueca.** Perfeito para quem quer tudo."
    }
  ],
  extras: [
    { 
      id: 'more_time', 
      price: 77, 
      icon: Clock,
      label: "+30 Minutos",
      desc: "Estenda seu prazer e relaxamento."
    },
    { 
      id: 'touch', 
      price: 63, 
      icon: Heart,
      label: "Troca de Energia",
      desc: "Liberdade para tocar no massagista (interativo)."
    },
    { 
      id: 'aroma', 
      price: 15, 
      icon: Wind,
      label: "Aromaterapia Premium",
      desc: "Essências afrodisíacas e relaxantes no ar."
    }
  ]
};

const TEXTS = {
  pt: {
    welcome: "Olá,",
    subtitle: "Seu momento de prazer e paz começa agora.",
    level_label: "Nível",
    next_reward: "Próximo prêmio:",
    reviews_count: "Ver depoimentos",
    reviews_title: "O que dizem...",
    select_time_title: "Quando será?",
    date_sub: "Agenda atualizada:",
    location_title: "Onde atendo você?",
    input_name: "Seu Nome",
    input_name_placeholder: "Como quer ser chamado?",
    input_addr: "Endereço",
    input_num: "Número",
    input_bairro: "Bairro",
    input_city: "Cidade",
    input_comp: "Complemento",
    input_hotel: "Nome do Hotel",
    input_room: "Número do Quarto",
    motel_note: "Motel: Combinamos a entrada pelo WhatsApp.",
    pay_title: "Forma de Pagamento",
    pay_pix: "Pix",
    pay_card: "Cartão",
    pay_cash: "Dinheiro",
    extras_title: "Turbine sua Sessão",
    coupon_title: "Seus Cupons",
    coupon_select: "Escolher desconto",
    coupon_none: "Sem cupons disponíveis",
    remove: "Remover",
    total_label: "Investimento Total",
    book_btn: "Finalizar no WhatsApp",
    next_btn: "Avançar",
    uber_note: "+ Taxa Uber (Ida/Volta)",
    success_title: "Tudo Pronto!",
    success_sub: "O texto já está pronto. Basta enviar no WhatsApp para confirmar.",
    whatsapp_btn: "Enviar Pedido",
    back_home: "Voltar ao Início",
    today: "Hoje",
    tomorrow: "Amanhã",
    
    popup_welcome_title: "Presente de Boas-Vindas!",
    popup_welcome_msg: "Ganhe R$ 12,00 de desconto na sua primeira experiência.",
    popup_level_title: "Subiu de Nível!",
    popup_level_msg: "Sua fidelidade gerou um desconto maior.",
    notif_title: "Thalyson Massagens",
    notif_body: "Novo desconto desbloqueado!",
    btn_notif: "Ativar Avisos",
    btn_close: "Fechar",

    terms_body: [
      "1. Higiene: Todo material é descartável ou esterilizado.",
      "2. Sigilo: Sua privacidade é absoluta.",
      "3. Segurança: Atendimento em local seguro.",
      "4. Pagamento: Realizado ao final do atendimento."
    ],
    terms_title: "Regras de Ouro",
    terms_link: "Ler regras",
    terms_btn: "Entendi",

    zap: {
      intro: "Oi Thalyson! Vim pelo App e quero agendar:",
      section_serv: "🔥 *SERVIÇO ESCOLHIDO*",
      section_det: "📝 *DETALHES*",
      section_loc: "📍 *LOCALIZAÇÃO*",
      section_fin: "💰 *VALORES*",
      map_link: "🗺️ *Abrir no Mapa:*",
      wait: "Aguardo sua confirmação!"
    }
  },
  en: {
    // Mantendo fallback simples em inglês
    welcome: "Hello,",
    subtitle: "Your moment of peace.",
    level_label: "Level",
    next_reward: "Next reward:",
    reviews_count: "Reviews",
    reviews_title: "Reviews",
    select_time_title: "Date & Time",
    date_sub: "Availability:",
    location_title: "Location",
    input_name: "Name",
    input_name_placeholder: "Your name...",
    input_addr: "Address",
    input_num: "Number",
    input_bairro: "District",
    input_city: "City",
    input_comp: "Unit",
    input_hotel: "Hotel Name",
    input_room: "Room Number",
    motel_note: "Motel: Discuss on Zap.",
    pay_title: "Payment",
    pay_pix: "Pix",
    pay_card: "Card",
    pay_cash: "Cash",
    extras_title: "Add-ons",
    coupon_title: "Coupons",
    coupon_select: "Select",
    coupon_none: "None",
    remove: "Remove",
    total_label: "Total",
    book_btn: "Finish on WhatsApp",
    next_btn: "Next",
    uber_note: "+ Uber Fee",
    success_title: "Ready!",
    success_sub: "Send on WhatsApp.",
    whatsapp_btn: "Send Now",
    back_home: "Home",
    today: "Today",
    tomorrow: "Tomorrow",
    popup_welcome_title: "Welcome!",
    popup_welcome_msg: "R$ 12.00 OFF.",
    popup_level_title: "Level Up!",
    popup_level_msg: "New discount unlocked.",
    notif_title: "Thalyson",
    notif_body: "New coupon!",
    btn_notif: "Enable",
    btn_close: "Close",
    terms_body: ["Professional service only."],
    terms_title: "Rules",
    terms_link: "Rules",
    terms_btn: "Ok",
    zap: { intro: "Hi! Booking:", section_serv: "SERVICE", section_det: "DETAILS", section_loc: "LOCATION", section_fin: "TOTAL", map_link: "Map:", wait: "Waiting!" }
  }
};

// ==================================================================================
// 2. COMPONENTES AUXILIARES
// ==================================================================================

const Modal = ({ isOpen, onClose, children, title, isDark }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-md rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col ${isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white text-zinc-900'}`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}><X size={20}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
};

const XPBar = ({ xp, isDark, texts }) => {
    let currentLevel = LEVEL_SYSTEM[0];
    let nextLevel = LEVEL_SYSTEM[1];

    for (let i = 0; i < LEVEL_SYSTEM.length; i++) {
        if (xp >= LEVEL_SYSTEM[i].xpNeeded) {
            currentLevel = LEVEL_SYSTEM[i];
            nextLevel = LEVEL_SYSTEM[i+1] || null;
        }
    }

    if (!nextLevel) return (
        <div className={`mt-4 p-4 rounded-2xl ${isDark ? 'bg-gradient-to-r from-yellow-600/20 to-amber-600/20 border border-amber-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
             <div className="flex items-center gap-3">
                 <Trophy className="text-amber-500" size={24} />
                 <div>
                     <p className="font-bold text-sm text-amber-500">Cliente VIP Ouro</p>
                     <p className="text-xs opacity-70">Você tem acesso aos melhores descontos.</p>
                 </div>
             </div>
        </div>
    );

    const progress = Math.min(100, Math.max(0, ((xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));

    return (
        <div className={`mt-4 p-4 rounded-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-end mb-2">
                <div>
                    <span className="text-[10px] font-bold uppercase opacity-50 tracking-wider">{texts.level_label} {currentLevel.level}</span>
                    <h3 className="font-bold text-sm text-blue-500">{currentLevel.title}</h3>
                </div>
                <div className="text-right">
                    <span className="text-[10px] opacity-60 block">{texts.next_reward}</span>
                    <span className="font-bold text-green-500 text-xs">R$ {nextLevel.reward} OFF</span>
                </div>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="mt-1 flex justify-between text-[10px] opacity-40 font-mono">
                <span>{xp} XP</span>
                <span>{nextLevel.xpNeeded} XP</span>
            </div>
        </div>
    );
};

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  
  // Audio State
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  // Modais
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  
  const scrollRef = useRef(null);
  const T = TEXTS[lang]; 
  const [isClient, setIsClient] = useState(false);
  
  // User Data
  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false 
  });

  // Booking Data
  const [booking, setBooking] = useState({
    service: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null
  });

  // --- INIT & LOGIC ---
  useEffect(() => {
    setIsClient(true);
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        const d = JSON.parse(s);
        setUser(d);
        if(d.savedAddress) setBooking(p => ({...p, address: d.savedAddress}));
    } else {
        // Primeira vez: Cupom de 12 reais
        setUser(p => ({...p, coupons: [{ id: 'lvl1', val: 12, title: '🎁 Boas Vindas' }]}));
    }
  }, []);

  // --- CORREÇÃO DE ÁUDIO ---
  useEffect(() => {
    if (!isClient) return;
    
    // Tenta tocar no load
    const tryPlay = async () => {
        if(audioRef.current) {
            audioRef.current.volume = 0.3; 
            try {
                if(!isMuted) await audioRef.current.play();
            } catch (e) {
                // Se falhar (bloqueio), marca como mutado
                setIsMuted(true); 
            }
        }
    };
    tryPlay();

    // Listener MÁGICO: No primeiro clique em QUALQUER lugar, desbloqueia o som
    const unlockAudio = () => {
        if(audioRef.current) {
            audioRef.current.play().then(() => setIsMuted(false)).catch(()=>{});
        }
        // Remove listener após primeira interação
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    };
    
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    
    return () => {
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('touchstart', unlockAudio);
    }
  }, [isClient]);

  // Controle Manual do Mute
  useEffect(() => {
    if(isClient && audioRef.current) {
        if(isMuted) audioRef.current.pause();
        else audioRef.current.play().catch(()=>{});
    }
  }, [isMuted, isClient]);

  // Popup Welcome
  useEffect(() => {
     if(isClient && !user.hasSeenWelcome) {
         setTimeout(() => setWelcomePopup(true), 2000);
     }
  }, [isClient, user.hasSeenWelcome]);

  useEffect(() => { if(isClient) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user, isClient]);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DB.extras.find(e=>e.id===k).price; });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking.service, booking.extras, booking.appliedCoupon]);

  const canProceed = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      if (!user.name) return false;
      if (booking.locationType === 'home') return booking.address.street && booking.address.number;
      if (booking.locationType === 'hotel') return booking.address.placeName;
      return true; 
    }
    return !!booking.payment;
  };

  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    
    const earnedXP = getFinancials.total;
    const oldXP = user.xp;
    const newXP = oldXP + earnedXP;

    let leveledUp = false;
    for (let i = 0; i < LEVEL_SYSTEM.length; i++) {
        const lvl = LEVEL_SYSTEM[i];
        if (newXP >= lvl.xpNeeded && oldXP < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `lvl${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Nível ${lvl.title}` });
        }
    }

    if (leveledUp) setLevelUpPopup(true);
    setUser({ ...user, xp: newXP, coupons: updatedCoupons });
    setStep(4);
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    
    // Constrói Endereço e Link do Mapa
    let locTxt = "";
    let mapLink = "";
    
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.city}, ${booking.address.district}`;
        locTxt = `🏠 *Casa:* ${fullAddr}\n📝 *Comp:* ${booking.address.comp || 'N/A'}`;
        mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddr)}`;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 *Motel:* Combinar local exato pelo chat.`;
    } else {
        const fullAddr = `${booking.address.placeName} - ${booking.address.city}`;
        locTxt = `🏨 *Hotel:* ${fullAddr}\n🚪 *Quarto:* ${booking.address.comp}`;
        mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddr)}`;
    }

    // Detalhes dos Extras
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DB.extras.find(e=>e.id===k);
        return `✅ + ${ext.label} (${ext.desc})`;
    }).join('\n');

    const msg = `
${T.zap.intro} *${user.name}*

${T.zap.section_serv}
💆‍♂️ *${booking.service.title}*
📅 ${dateStr} às ${booking.time}
⏳ Duração: ${booking.service.min} min

${extrasList ? `${T.zap.section_det}\n${extrasList}\n` : ''}
${T.zap.section_loc}
${locTxt}
${mapLink ? `\n${T.zap.map_link} ${mapLink}` : ''}

${T.zap.section_fin}
💵 Subtotal: R$ ${f.sub}
🎟️ Desconto: - R$ ${f.disc}
🚕 *Nota:* ${T.uber_note}

💎 *TOTAL A PAGAR: R$ ${f.total}*
💳 Pagamento via: *${booking.payment.toUpperCase()}*

${T.zap.wait}
`.trim();

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isClient) return <div className="bg-zinc-950 h-screen w-full"/>;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* ÁUDIO */}
      <audio ref={audioRef} loop preload="auto">
          <source src={CONFIG.AUDIO_URL} type="audio/mp3" />
      </audio>

      {/* HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950 border-b border-zinc-800' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-500/30">T.</div>
          <span className="font-bold text-sm tracking-tight">Thalyson</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setIsMuted(!isMuted)} className={`p-2 rounded-full transition-all ${isMuted ? (isDark ? 'bg-red-500/10 text-red-500' : 'bg-red-100 text-red-500') : (isDark ? 'bg-emerald-500/10 text-emerald-500' : 'bg-emerald-100 text-emerald-600')}`}>
                {isMuted ? <VolumeX size={18}/> : <Volume2 size={18}/>}
            </button>
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-pink-500' : 'bg-slate-100 text-pink-600'}`}><Instagram size={18}/></a>
        </div>
      </header>

      {/* CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 scroll-smooth relative">
        <div className={`fixed top-16 left-0 w-full h-6 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>

        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* 0. SERVIÇOS */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">{T.welcome} <span className="text-blue-500">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h1>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                <XPBar xp={user.xp} isDark={isDark} texts={T} />

                <div onClick={() => setReviewsOpen(true)} className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold cursor-pointer hover:bg-blue-500/20 transition-colors">
                   <Star size={12} fill="currentColor"/> {T.reviews_count}
                </div>
              </div>

              <div className="space-y-4">
                {DB.services.map(s => (
                  <div key={s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} 
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all active:scale-[0.98] ${booking.service?.id === s.id ? 'border-blue-500 bg-blue-500/5' : (isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-white')}`}
                  >
                     <div className="flex justify-between items-center mb-3">
                        <div className={`p-3 rounded-2xl ${booking.service?.id === s.id ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={24}/></div>
                        <div className="text-right">
                           <span className="block text-xl font-bold">{T.currency} {s.price}</span>
                           <span className="text-[10px] uppercase font-bold opacity-60">{s.min} {T.duration}</span>
                        </div>
                     </div>
                     <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                     <p className={`text-sm mb-3 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{s.desc}</p>
                     
                     {/* DETALHES COMPLETOS PARA GERAR DESEJO */}
                     {booking.service?.id === s.id && (
                        <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed animate-fade-in ${isDark ? 'bg-black/20 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}>
                            <div className="flex items-center gap-2 font-bold mb-1 opacity-100"><Info size={12}/> Detalhes:</div>
                            <p>{s.details}</p>
                        </div>
                     )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1. DATA */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-6">
                 <h2 className="text-xl font-bold">{T.select_time_title}</h2>
                 <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 mb-6">
                {[...Array(7)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US', {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;

                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                      className={`min-w-[70px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 ${isSel ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400')}`}
                    >
                      <span className="text-[10px] font-bold uppercase">{lbl}</span>
                      <span className="text-xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              <div className={`grid grid-cols-4 gap-3 ${!booking.date ? 'opacity-30 pointer-events-none' : ''}`}>
                 {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                     let disabled = false;
                     if(booking.date) {
                         const now = new Date();
                         if(booking.date.toDateString() === now.toDateString() && parseInt(t) <= now.getHours()) disabled = true;
                     }
                     if(disabled) return null; 

                     return (
                         <button key={t} onClick={() => setBooking(b => ({...b, time: t}))}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${booking.time === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300')}`}
                         >
                            {t}
                         </button>
                     )
                 })}
              </div>
            </div>
          )}

          {/* 2. LOCAL E EXTRAS */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-xl font-bold text-center mb-6">{T.location_title}</h2>
              
              <div className={`flex p-1 rounded-xl mb-6 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:'Casa/Apt', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`flex-1 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50'}`}>
                        <x.i size={14}/> {x.l}
                    </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <div>
                    <label className={`text-xs font-bold ml-1 mb-1 block uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.input_name}</label>
                    <input value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} className={`w-full p-4 rounded-2xl border outline-none text-base ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} placeholder={T.input_name_placeholder} />
                 </div>

                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_80px] gap-3">
                           <input value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} placeholder={T.input_addr} className={`p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                           <input type="tel" value={booking.address.number} onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder="Nº" className={`p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        </div>
                        <input value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={T.input_bairro} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={T.input_city} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={T.input_comp} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                     </div>
                 )}
                 
                 {booking.locationType === 'motel' && (
                     <div className={`p-6 rounded-2xl text-center text-sm ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                         <p>{T.motel_note}</p>
                     </div>
                 )}

                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <input value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} placeholder={T.input_hotel} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={T.input_city} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={T.input_room} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-dashed border-zinc-700/50 mt-6">
                 <h3 className={`text-xs font-bold uppercase mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                 <div className="space-y-3">
                    {DB.extras.map(ex => (
                       <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer ${booking.extras[ex.id] ? 'bg-blue-500/10 border-blue-500' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${booking.extras[ex.id] ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
                             <div>
                                 <p className="text-sm font-bold">{ex.label}</p>
                                 <p className="text-[10px] opacity-60">{ex.desc}</p>
                             </div>
                          </div>
                          <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-blue-500' : 'opacity-50'}`}>+ R$ {ex.price}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </div>
          )}

          {/* 3. CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className={`p-6 rounded-3xl border shadow-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-500/20">
                     <span className="font-bold text-lg">{booking.service.title}</span>
                     <span className="font-bold text-lg">{T.currency} {booking.service.price}</span>
                  </div>
                  {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                      <div key={k} className="flex justify-between text-sm opacity-60 mb-2">
                          <span>+ {DB.extras.find(e=>e.id===k).label}</span>
                          <span>{DB.extras.find(e=>e.id===k).price}</span>
                      </div>
                  ))}
                  
                  {/* Cupom */}
                  <div className={`mt-4 p-3 rounded-xl flex justify-between items-center ${isDark ? 'bg-black/20' : 'bg-slate-100'}`}>
                      <div className="flex items-center gap-2 text-xs font-bold opacity-60"><Ticket size={14}/> {T.coupon_title}</div>
                      {user.coupons.length > 0 ? (
                        booking.appliedCoupon ? (
                            <button onClick={()=>setBooking(b=>({...b, appliedCoupon: null}))} className="text-xs text-red-500 font-bold">{T.remove}</button>
                        ) : (
                            <select onChange={(e)=>{
                                const c = user.coupons.find(x=>String(x.id)===e.target.value);
                                setBooking(b=>({...b, appliedCoupon: c}));
                            }} className="bg-transparent text-xs font-bold text-blue-500 outline-none text-right">
                                <option value="">{T.coupon_select}</option>
                                {user.coupons.map(c=><option key={c.id} value={c.id}>R$ {c.val} OFF</option>)}
                            </select>
                        )
                      ) : <span className="text-xs opacity-50">{T.coupon_none}</span>}
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-gray-500/20 flex justify-between items-end">
                      <div>
                          <span className="text-[10px] font-bold uppercase opacity-50">{T.total_label}</span>
                          <p className="text-xs text-amber-500 font-medium mt-1">{T.uber_note}</p>
                      </div>
                      <span className="text-3xl font-black">{T.currency} {getFinancials.total}</span>
                  </div>
               </div>

               <div className="mt-6">
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-2">{T.pay_title}</h3>
                   <div className="grid grid-cols-3 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                               <p.i size={20}/> <span className="text-[10px] font-bold uppercase">{p.l}</span>
                           </button>
                       ))}
                   </div>
               </div>
               
               <div onClick={() => setTermsOpen(true)} className="flex items-center justify-center gap-2 mt-6 opacity-50 text-xs cursor-pointer hover:underline">
                   <Info size={12}/> {T.terms_link}
               </div>
            </div>
          )}

          {/* 4. SUCESSO */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-10 text-center animate-scale-in">
                 <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6">
                     <Check size={48} className="text-white" strokeWidth={4}/>
                 </div>
                 <h1 className="text-3xl font-black mb-2">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10">{T.success_sub}</p>
                 <button onClick={openZap} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-lg shadow-xl flex items-center justify-center gap-3">
                     <MessageCircle size={24} fill="white"/> {T.whatsapp_btn}
                 </button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, service: null, payment: '', appliedCoupon: null});}} className="mt-8 text-xs font-bold uppercase opacity-50 tracking-widest">{T.back_home}</button>
             </div>
          )}

        </div>
      </main>

      {/* FOOTER NAV */}
      {step < 4 && (
         <div className="fixed bottom-6 left-6 right-6 z-50">
            <div className={`p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border ${isDark ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-zinc-200'}`}>
                {step > 0 && <button onClick={()=>setStep(step-1)} className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}><ChevronLeft size={20}/></button>}
                
                {step < 3 && booking.service && (
                    <div className="flex-1 pl-2">
                        <span className="block text-[9px] font-bold uppercase opacity-50">{T.total_label}</span>
                        <span className="block text-xl font-black">R$ {getFinancials.total}</span>
                    </div>
                )}
                
                <button 
                    disabled={!canProceed()} 
                    onClick={() => step === 3 ? finishBooking() : setStep(s => s + 1)}
                    className={`h-12 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${step < 3 ? 'ml-auto' : 'w-full'} ${!canProceed() ? 'bg-zinc-500 opacity-50 cursor-not-allowed text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'}`}
                >
                    {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18}/>}
                </button>
            </div>
         </div>
      )}

      {/* MODALS */}
      <Modal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} title={T.reviews_title} isDark={isDark}>
         <div className="space-y-3">
            {REVIEWS_DATA.map((r,i)=>(
               <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex justify-between mb-1"><span className="font-bold text-sm text-blue-500">{r.n}</span><div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div></div>
                   <p className="text-sm italic opacity-70">"{r.t}"</p>
               </div>
            ))}
         </div>
      </Modal>

      <Modal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} title={T.terms_title} isDark={isDark}>
         <div className="space-y-4">
            {T.terms_body.map((t,i)=><p key={i} className="text-sm opacity-80">{t}</p>)}
            <button onClick={()=>setTermsOpen(false)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">{T.terms_btn}</button>
         </div>
      </Modal>

      <RewardPopup 
        isOpen={welcomePopup} 
        onClose={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}} 
        title={T.popup_welcome_title} 
        msg={T.popup_welcome_msg} 
        btnText={T.btn_close} 
        closeText={T.btn_close}
        onAllowNotif={()=>setWelcomePopup(false)}
        isDark={isDark} 
      />

      <RewardPopup 
        isOpen={levelUpPopup} 
        onClose={()=>setLevelUpPopup(false)} 
        title={T.popup_level_title} 
        msg={T.popup_level_msg} 
        btnText={T.btn_close} 
        closeText={T.btn_close}
        onAllowNotif={()=>setLevelUpPopup(false)}
        isDark={isDark} 
      />
      
      <div className={`fixed top-0 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>
      <div className={`fixed bottom-0 left-0 w-full h-24 z-10 pointer-events-none bg-gradient-to-t ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .animate-fade-in { animation: fadeIn 0.6s ease-out; } .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); } .animate-bounce-slow { animation: bounce 3s infinite; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
