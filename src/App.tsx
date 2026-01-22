import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (CONSTANTES GLOBAIS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Formato internacional sem +
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v15_platinum', 
  XP_TARGET: 500, 
};

const TEXTS = {
  pt: {
    welcome: "Bem-vindo",
    subtitle: "Seu momento de paz e prazer começa agora.",
    reviews_btn: "Ler todas as avaliações",
    reviews_title: "O que dizem sobre mim",
    choose_service: "Escolha sua Experiência",
    duration: "de sessão",
    investment: "Valor",
    date_title: "Agendamento",
    date_sub: "Qual o melhor dia para você?",
    time_title: "Horários Disponíveis",
    location_title: "Local de Atendimento",
    location_sub: "Onde você se sente mais à vontade?",
    name_placeholder: "Como prefere ser chamado?",
    extras_title: "Turbine sua sessão",
    resume_title: "Resumo do Pedido",
    payment_title: "Como prefere pagar?",
    terms_agree: "Li e concordo com os",
    terms_link: "Termos de Serviço",
    btn_continue: "CONTINUAR",
    btn_finish: "FINALIZAR AGENDAMENTO",
    success_title: "Agendado!",
    success_msg: "Seu horário está pré-reservado. Envie a mensagem gerada no WhatsApp para confirmar.",
    btn_zap: "ENVIAR CONFIRMAÇÃO",
    motel_warn: "Combinamos o Motel pelo WhatsApp. (A entrada é por conta do cliente).",
    coupon_label: "Carteira de Cupons",
    coupon_select: "Selecionar cupom...",
    coupon_none: "Nenhum cupom ativo",
    remove: "Remover",
    hotel_name: "Nome do Hotel",
    room: "Quarto",
    comp_placeholder: "Complemento / Ponto de Referência (Obrigatório)",
    address_warn: "Preencha todo o endereço para eu chegar até você.",
    uber_warn: "Taxa de deslocamento (Uber ida/volta) será calculada no WhatsApp.",
    viewing_now: "pessoas vendo este horário agora",
    
    services: {
      relaxante: { title: "Massagem Relaxante", desc: "Movimentos leves, contínuos e envolventes. Foco total em tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Massagem Sensitiva", desc: "Experiência de pele com pele. Toques sutis que despertam a sensibilidade de cada centímetro do corpo." },
      mista: { title: "Massagem Completa", desc: "O melhor dos dois mundos: Relaxamento muscular profundo seguido da experiência sensitiva (finalização opcional)." }
    },
    
    extras: {
      more_time: { label: "+30 Minutos", desc: "Estender a sessão" },
      touch: { label: "Toque Interativo", desc: "Troca de toques permitida" },
      aroma: { label: "Aromaterapia", desc: "Óleos essenciais premium" }
    },

    terms_body: [
      "1. Respeito Mútuo: O atendimento é estritamente profissional. Qualquer conduta agressiva encerrará a sessão imediatamente.",
      "2. Higiene: Prezo pela máxima higiene e exijo o mesmo do cliente.",
      "3. Sigilo Absoluto: Sua privacidade é garantida. O que acontece na sessão, fica na sessão.",
      "4. Taxas Externas: Em caso de atendimento em Motel, a taxa de entrada/período é de responsabilidade do cliente.",
      "5. Pagamento: O pagamento deve ser realizado integralmente logo após a prestação do serviço."
    ],
    terms_btn: "Entendi e Concordo",

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Gostaria de confirmar o seguinte agendamento:",
      client: "Cliente",
      service: "Serviço",
      extras: "Extras",
      location: "Local",
      home_title: "Em Casa",
      motel_title: "Motel",
      motel_desc: "A decidir juntos (Entrada por conta do cliente)",
      hotel_title: "Hotel",
      room: "Quarto",
      subtotal: "Subtotal",
      uber: "Uber (Ida/Volta)",
      uber_calc: "A calcular",
      total_msg: "Total a Pagar",
      payment: "Forma de Pagamento",
      wait: "Aguardo confirmação!"
    }
  },
  en: {
    welcome: "Welcome",
    subtitle: "Your moment of peace and pleasure starts now.",
    reviews_btn: "Read all reviews",
    reviews_title: "Testimonials",
    choose_service: "Choose your Experience",
    duration: "session",
    investment: "Value",
    date_title: "Scheduling",
    date_sub: "Best day for you?",
    time_title: "Available Slots",
    location_title: "Location",
    location_sub: "Where do you feel most comfortable?",
    name_placeholder: "Your Name",
    extras_title: "Boost your session",
    resume_title: "Order Summary",
    payment_title: "Payment Method",
    terms_agree: "I agree to the",
    terms_link: "Terms of Service",
    btn_continue: "CONTINUE",
    btn_finish: "FINISH BOOKING",
    success_title: "Booked!",
    success_msg: "Slot pre-reserved. Send the message below on WhatsApp to confirm.",
    btn_zap: "SEND CONFIRMATION",
    motel_warn: "We decide the Motel on WhatsApp. (Entrance fee is on you).",
    coupon_label: "Coupon Wallet",
    coupon_select: "Select...",
    coupon_none: "No active coupons",
    remove: "Remove",
    hotel_name: "Hotel Name",
    room: "Room Number",
    comp_placeholder: "Complement / Reference (Required)",
    address_warn: "Please fill full address.",
    uber_warn: "Transport fee (Uber round trip) calculated on WhatsApp.",
    viewing_now: "people viewing this slot",

    services: {
      relaxante: { title: "Relaxing Massage", desc: "Light, continuous, and enveloping movements. Total focus on removing back weight and calming the mind." },
      sensitiva: { title: "Sensitive Massage", desc: "Skin-to-skin experience. Subtle touches that awaken the sensitivity of every inch of the body." },
      mista: { title: "Complete Massage", desc: "Full body relaxation massage, followed by sensitive body-to-body with finishing (optional)." }
    },

    extras: {
      more_time: { label: "+30 Minutes", desc: "Extend the session" },
      touch: { label: "Interactive Touch", desc: "Touch exchange allowed" },
      aroma: { label: "Aromatherapy", desc: "Essential oils" }
    },

    terms_body: [
      "1. Mutual Respect: The service is professional. Any aggressive conduct will end the session immediately.",
      "2. Hygiene: I value maximum hygiene.",
      "3. Absolute Secrecy: Your privacy is guaranteed.",
      "4. External Fees: In case of Motel service, the entrance fee is the client's responsibility.",
      "5. Payment: Payment must be made in full immediately after the service."
    ],
    terms_btn: "I Understand and Agree",

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "I would like to confirm:",
      client: "Client",
      service: "Service",
      extras: "Extras",
      location: "Location",
      home_title: "Home Visit",
      motel_title: "Motel",
      motel_desc: "We decide together. (Fee on you)",
      hotel_title: "Hotel",
      room: "Room",
      subtotal: "Subtotal",
      uber: "Uber (Round Trip)",
      uber_calc: "To calculate",
      total_msg: "Total to Pay",
      payment: "Payment Method",
      wait: "Waiting for reply!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', time: '1h', price: 150, xp: 150, icon: Wind, badge: null },
    { id: 'sensitiva', time: '1h', price: 180, xp: 180, icon: Flame, badge: '🔥 Popular' },
    { id: 'mista', time: '1h', price: 210, xp: 210, icon: Zap, badge: '✨ VIP' }
  ],
  extras: [
    { id: 'more_time', price: 80, icon: Clock },
    { id: 'touch', price: 60, icon: Heart },
    { id: 'aroma', price: 10, icon: Smile }
  ],
  reviews: [
    { name: "Tiago (Bela Vista)", text: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", stars: 5 },
    { name: "Anônimo", text: "O toque dele vicia. A finalização foi absurda, experiência intensa.", stars: 5 },
    { name: "Pedro H.", text: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", stars: 5 },
    { name: "Curioso SP", text: "Mão firme, pegada excelente. O óleo quente faz toda a diferença.", stars: 5 },
    { name: "M. (Jardins)", text: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", stars: 5 },
    { name: "Empresário", text: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", stars: 5 },
    { name: "M. (Casado)", text: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", stars: 5 },
    { name: "Roberto", text: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", stars: 5 },
    { name: "Fã", text: "Visual nota 1000. Extremamente profissional.", stars: 5 },
    { name: "Carlos A.", text: "Profissionalismo raro hoje em dia. Pontual e educado.", stars: 5 }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS (MODULARIZADOS)
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
    <div className="bg-emerald-600/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm border border-emerald-400/30 whitespace-nowrap animate-pulse-slow">
      <CheckCircle2 size={18} />
      <span>{msg}</span>
    </div>
  </div>
);

// MODAL DE TERMOS
const TermsModal = ({ isOpen, onClose, isDark, T }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-md p-8 rounded-3xl max-h-[85vh] flex flex-col animate-scale-in shadow-2xl ${isDark ? 'bg-zinc-900 text-zinc-100 border border-zinc-800' : 'bg-white text-zinc-900'}`}>
         <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2 text-blue-500"><ShieldCheck /> {T.terms_link}</h2>
            <button onClick={onClose} className="p-2 hover:bg-black/10 rounded-full transition-colors"><X/></button>
         </div>
         <div className="space-y-4 text-sm opacity-80 leading-relaxed text-justify font-light overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {T.terms_body.map((term, i) => <p key={i} className="pb-2 border-b border-dashed border-gray-500/20 last:border-0">{term}</p>)}
         </div>
         <button onClick={onClose} className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-500 transition-all flex-shrink-0 shadow-lg shadow-blue-500/20 active:scale-95">{T.terms_btn}</button>
      </div>
    </div>
  );
};

// MODAL DE AVALIAÇÕES
const ReviewsModal = ({ isOpen, onClose, isDark, reviews, T }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
       <div className={`relative w-full h-[85%] md:max-w-lg rounded-[2.5rem] flex flex-col animate-slide-up overflow-hidden shadow-2xl ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
          <div className={`flex justify-between items-center p-6 border-b flex-shrink-0 ${isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-slate-200 bg-white/50'} backdrop-blur-sm`}>
             <h2 className="text-xl font-bold flex items-center gap-2"><Star className="text-amber-400 fill-amber-400"/> {T.reviews_title}</h2>
             <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/10 rounded-full hover:scale-110 transition-transform"><X/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
             {reviews.map((r, i) => (
                <div key={i} className={`p-6 rounded-3xl border transition-all hover:scale-[1.01] ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-blue-50 shadow-sm'}`}>
                   <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-base text-blue-500">{r.name}</span>
                      <div className="flex text-amber-400 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={14} fill="currentColor"/>)}</div>
                   </div>
                   <p className="text-sm opacity-70 leading-relaxed italic">"{r.text}"</p>
                </div>
             ))}
             <div className="text-center py-8 opacity-40 text-xs uppercase font-bold tracking-widest pb-20">--- Fim das avaliações ---</div>
          </div>
       </div>
    </div>
  );
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [isDark, setIsDark] = useState(true); // Padrão Dark Mode para mais elegância
  const [lang, setLang] = useState('pt');
  
  // Modais & UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  
  // Escassez (Marketing)
  const [viewingCount, setViewingCount] = useState(0);

  const scrollRef = useRef(null);
  const T = TEXTS[lang]; 

  // USER STATE (Gamification)
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       // Cupom inicial de boas-vindas
       const initialCoupons = [{ id: 'welcome15', val: 15, title: 'Cupom Boas Vindas' }];
       if (!s) return { name: '', xp: 0, level: 1, coupons: initialCoupons };
       return JSON.parse(s);
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // BOOKING STATE
  const [booking, setBooking] = useState({
    service: null, 
    extras: {}, 
    date: null, 
    time: null,
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null, 
    termsAccepted: false
  });

  // Efeitos
  useEffect(() => { 
      // Simula carregamento inicial para dar peso ao app
      const timer = setTimeout(() => setLoading(false), 1200); 
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  
  // Auto-scroll para o topo a cada mudança de passo
  useEffect(() => {
    if(scrollRef.current) {
        scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thalyson Massagens', text: 'Agende seu momento de paz.', url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado para a área de transferência!");
    }
  };

  // Lógica de Escassez (Aleatória)
  const generateViewingCount = () => {
      // Gera entre 2 e 6 pessoas vendo
      setViewingCount(Math.floor(Math.random() * (6 - 2 + 1)) + 2);
  };

  // Lógica Determinística para "Esgotado"
  const isTimeSoldOut = useCallback((dateStr, time) => {
      if(!dateStr) return false;
      const today = new Date();
      const checkDate = new Date(dateStr);
      const diffTime = Math.abs(checkDate - today);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (diffDays > 5) return false; // Aberto se for longe

      const dayHash = checkDate.getDate() + checkDate.getMonth(); 
      // Algoritmo simples para bloquear horários aleatórios mas fixos por dia
      if (dayHash % 2 === 0) {
          const hour = parseInt(time.split(':')[0]);
          if ((hour + dayHash) % 3 === 0) return true; 
      }
      return false;
  }, []);

  // Cálculos Financeiros
  const getFinancials = useMemo(() => {
    if (!booking.service) return { sub: 0, total: 0 };
    const sPrice = booking.service.price;
    const ePrice = Object.keys(booking.extras).reduce((acc, key) => 
      booking.extras[key] ? acc + DB.extras.find(e => e.id === key).price : acc, 0
    );
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const sub = sPrice + ePrice;
    const total = Math.max(0, sub - disc);
    return { service: sPrice, extras: ePrice, sub, disc, total };
  }, [booking.service, booking.extras, booking.appliedCoupon]);

  // Geração do Link do WhatsApp
  const generateZap = () => {
    const f = getFinancials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const h = new Date().getHours();
    
    let greeting = h < 12 ? T.zap.greeting[0] : h < 18 ? T.zap.greeting[1] : T.zap.greeting[2];
    
    let localMsg = "";
    let mapsLink = "";
    
    const serviceName = booking.service ? T.services[booking.service.id].title : "";

    if (booking.locationType === 'home') {
      localMsg = `🏠 *${T.zap.home_title}*\n${booking.address.street}, ${booking.address.number}\n${booking.address.district} - ${booking.address.city}\n_(Ref: ${booking.address.comp})_`;
      // Link universal do Google Maps (correção da versão anterior)
      const query = encodeURIComponent(`${booking.address.street}, ${booking.address.number}, ${booking.address.city}`);
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;
    } else if (booking.locationType === 'motel') {
      localMsg = `🏩 *${T.zap.motel_title}*\n${T.zap.motel_desc}`;
    } else {
      localMsg = `🏨 *${T.zap.hotel_title}*\n${booking.address.placeName}\n${booking.address.city}\n_(${T.zap.room}: ${booking.address.comp || '?'})_`;
      const query = encodeURIComponent(`${booking.address.placeName}, ${booking.address.city}`);
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => `+ ${T.extras[k].label}`).join('\n');

    const msg = `
${greeting}, Thalyson!
${T.zap.intro}

👤 *${T.zap.client}:* ${user.name}

💆‍♂️ *${T.zap.service}:* ${serviceName}
📅 ${dateStr} às ${booking.time}

${extrasTxt ? `✨ *${T.zap.extras}:*\n${extrasTxt}\n` : ''}
📍 *${T.zap.location}:*
${localMsg}
${mapsLink ? `🔗 Maps: ${mapsLink}` : ''}

💰 *${T.zap.subtotal}:* R$ ${f.sub}
${f.disc > 0 ? `🎟️ Desc: - R$ ${f.disc}` : ''}
🚗 *${T.zap.uber}:* ${T.zap.uber_calc}

✅ *${T.zap.total_msg}:* R$ ${f.total} + Uber
💳 *${T.zap.payment}:* ${booking.payment === 'pix' ? 'PIX' : booking.payment === 'card' ? 'Cartão/Card' : 'Dinheiro/Cash'}

*${T.zap.wait}*
`.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  // Validação dos Passos
  const isStepValid = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { city, street, placeName, number } = booking.address;
      if (!user.name || user.name.length < 3) return false;
      if (booking.locationType === 'home' && (!city || !street || !number)) return false;
      if (booking.locationType === 'hotel' && (!city || !placeName)) return false;
      return true;
    }
    return true; 
  };

  const handleFinish = () => {
    if (!booking.payment) return showToast(T.payment_title);
    if (!booking.termsAccepted) return showToast("Aceite os termos para continuar");

    // Gamification: Adiciona XP
    const earnedXP = getFinancials.total;
    const newTotalXP = user.xp + earnedXP;
    
    let updatedCoupons = [...user.coupons];
    // Remove cupom usado
    if(booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }

    // Ganha cupom se subir de nível
    if (Math.floor(newTotalXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), title: 'Recompensa VIP', val: 25, isNew: true });
    }

    setUser({ ...user, xp: newTotalXP, coupons: updatedCoupons });
    setStep(4);
  };

  const handleReset = () => {
      setStep(0);
      setBooking({
        service: null, extras: {}, date: null, time: null,
        locationType: 'home', 
        address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
        payment: '', appliedCoupon: null, termsAccepted: false
      });
  };

  // LOADING SCREEN
  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
       <div className="relative">
         <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white font-black text-5xl animate-pulse shadow-[0_0_60px_rgba(37,99,235,0.6)] z-10 relative">T.</div>
         <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-50 animate-ping"></div>
       </div>
       <p className="mt-8 font-medium text-sm tracking-[0.3em] uppercase opacity-50 animate-pulse text-blue-500">Carregando experiência...</p>
    </div>
  );

  return (
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col font-sans transition-colors duration-700 ${isDark ? 'bg-zinc-950 text-blue-50' : 'bg-slate-50 text-slate-900'}`}>
      
      <Toast show={toast.show} msg={toast.msg} />
      <TermsModal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} isDark={isDark} T={T} />
      <ReviewsModal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} isDark={isDark} reviews={DB.reviews} T={T} />
      
      {/* MENU LATERAL */}
      {menuOpen && (
          <div className="fixed inset-0 z-[60] flex justify-start">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={()=>setMenuOpen(false)}></div>
             <div className={`relative w-[85%] max-w-xs h-full p-8 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-10">
                   <h2 className="font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"><X size={24}/></button>
                </div>
                
                {/* Cartão de XP */}
                <div className="mb-8 p-6 rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-xl shadow-blue-900/40 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Trophy size={80} /></div>
                    <p className="text-xs font-bold uppercase opacity-80 mb-1 tracking-wider">Seu Nível VIP</p>
                    <h3 className="text-5xl font-black mb-4 flex items-baseline gap-1">{user.xp}<span className="text-sm font-medium opacity-60">xp</span></h3>
                    <div className="w-full h-1.5 bg-black/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-white shadow-[0_0_10px_white] transition-all duration-1000" style={{ width: `${(user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] text-center opacity-70">Faltam {CONFIG.XP_TARGET - (user.xp % CONFIG.XP_TARGET)} XP para o próximo nível</p>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto">
                   <button onClick={()=>setLang(lang==='pt'?'en':'pt')} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                      <Globe size={20} className="text-blue-500"/> <span>{lang === 'pt' ? 'Mudar para Inglês' : 'Switch to Portuguese'}</span>
                   </button>
                   <button onClick={()=>setIsDark(!isDark)} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700">
                      {isDark ? <Sun size={20} className="text-amber-400"/> : <Moon size={20} className="text-blue-600"/>} <span>{isDark ? 'Modo Claro' : 'Modo Escuro'}</span>
                   </button>
                </div>

                <div className="pt-8">
                   <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold justify-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all active:scale-95">
                      <Instagram size={20}/> @seumssagista
                   </a>
                </div>
             </div>
          </div>
      )}

      {/* HEADER FIXO */}
      <header className={`h-20 flex-shrink-0 flex items-center justify-between px-6 border-b backdrop-blur-xl transition-colors duration-500 z-40 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-blue-100'}`}>
        <div className="flex items-center gap-4">
          <button onClick={()=>setMenuOpen(true)} className={`p-3 rounded-full transition-colors active:scale-90 ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-blue-50 text-blue-900'}`}><Menu size={24}/></button>
          <div className="flex flex-col cursor-default">
            <span className="font-bold text-base tracking-wide">Thalyson Massagens</span>
            <span className="text-[10px] opacity-60 flex items-center gap-1.5 font-medium"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"/> Online agora</span>
          </div>
        </div>
        <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-3 rounded-full border transition-all hover:scale-110 active:scale-90 ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white' : 'border-blue-100 bg-white text-blue-600'}`}><Instagram size={20}/></a>
      </header>

      {/* PROGRESS BAR */}
      {step < 4 && (
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-900 flex-shrink-0 relative overflow-hidden">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.6)] relative z-10" style={{ width: `${((step+1)/4)*100}%` }} />
          {/* Partículas de brilho na barra */}
          <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-white/50 to-transparent z-20" style={{ left: `${((step+1)/4)*100}%`, transform: 'translateX(-100%)' }}></div>
        </div>
      )}

      {/* CONTEÚDO COM SCROLL */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth custom-scrollbar">
        <div className="max-w-md mx-auto animate-fade-in">
        
        {/* STEP 0: SERVIÇOS & AVALIAÇÕES */}
        {step === 0 && (
          <div className="space-y-10">
            <div className="space-y-3 pt-4">
              <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 leading-tight">
                {T.welcome},<br/>{user.name.split(' ')[0] || T.zap.client}
              </h1>
              <p className="text-base opacity-70 font-light max-w-[280px] leading-relaxed">{T.subtitle}</p>
            </div>
            
            <div className="space-y-6">
              {DB.services.map((s, idx) => (
                <div key={s.id} onClick={() => setBooking({ ...booking, service: s })}
                  style={{ animationDelay: `${idx * 100}ms` }}
                  className={`relative p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 active:scale-[0.98] group overflow-hidden animate-slide-up
                    ${booking.service?.id === s.id 
                      ? 'border-blue-500 bg-blue-600/10 shadow-2xl shadow-blue-500/20' 
                      : `border-transparent ${isDark ? 'bg-zinc-900 hover:bg-zinc-800/80' : 'bg-white shadow-xl shadow-slate-200/50 hover:shadow-2xl'}`
                    }`}
                >
                   {/* Badge de Destaque */}
                   {s.badge && <span className="absolute top-0 right-0 bg-gradient-to-bl from-blue-600 to-indigo-600 text-white text-[10px] font-black px-5 py-2.5 rounded-bl-3xl uppercase tracking-widest shadow-lg z-10">{s.badge}</span>}
                   
                   <div className="flex justify-between items-start mb-6 mt-2 relative z-10">
                      <div className={`p-4 rounded-3xl transition-colors ${booking.service?.id === s.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40' : 'bg-blue-500/10 text-blue-500'}`}>
                          <s.icon size={28} strokeWidth={1.5} />
                      </div>
                      <div className="text-right pr-2">
                        <span className={`block text-3xl font-black tracking-tight ${booking.service?.id === s.id ? 'text-blue-500' : ''}`}>R$ {s.price}</span>
                        <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">{T.investment}</span>
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-2xl mb-3">{T.services[s.id].title}</h3>
                   <p className="text-sm opacity-70 leading-relaxed font-light">{T.services[s.id].desc}</p>
                   
                   <div className="mt-6 pt-4 border-t border-dashed border-gray-500/20 flex items-center gap-2 text-xs opacity-50 font-bold uppercase tracking-wider">
                      <Clock size={14}/> {s.time} {T.duration}
                   </div>
                </div>
              ))}
            </div>
            
            <div className="pt-6 pb-4">
                <div className="flex items-center justify-between mb-6 px-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 flex items-center gap-2"><Star size={14}/> {T.reviews_title}</h3>
                    <div className="flex text-amber-400 gap-1 drop-shadow-lg"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                </div>

                {/* Mini carrossel de reviews */}
                <div className="space-y-4 mb-8">
                    {DB.reviews.slice(0, 3).map((r, i) => (
                        <div key={i} className={`p-5 rounded-3xl border transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-blue-50 shadow-sm'}`}>
                             <p className="text-sm italic opacity-70 mb-3 line-clamp-2 leading-relaxed">"{r.text}"</p>
                             <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">{r.name}</span>
                                 <div className="flex text-amber-400 gap-0.5 opacity-80">{[...Array(r.stars)].map((_,k)=><Star key={k} size={8} fill="currentColor"/>)}</div>
                             </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => setReviewsOpen(true)} className={`w-full py-5 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-3 active:scale-95 ${isDark ? 'border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700' : 'border-blue-100 hover:bg-blue-50 text-blue-600 bg-white shadow-sm'}`}>
                    <MessageCircle size={18}/> {T.reviews_btn}
                </button>
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="space-y-10 animate-slide-in">
             <button onClick={()=>setStep(0)} className="group flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity pl-1"><div className="p-1 rounded-full border border-current group-hover:-translate-x-1 transition-transform"><ChevronLeft size={12}/></div> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-black text-blue-500 mb-2">{T.date_title}</h2>
                <p className="text-sm opacity-60 font-light">{T.date_sub}</p>
             </div>

             <div className="space-y-4">
                <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-6 px-6 snap-x">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date(); d.setDate(d.getDate() + offset);
                    const isSelected = booking.date?.toDateString() === d.toDateString();
                    return (
                      <button key={offset} onClick={() => setBooking({ ...booking, date: d, time: null })}
                        className={`min-w-[5.5rem] h-[7.5rem] rounded-[2rem] flex flex-col items-center justify-center gap-3 transition-all border-2 flex-shrink-0 snap-center
                          ${isSelected 
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-600/40 scale-110 z-10' 
                              : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-zinc-100 text-zinc-400 shadow-sm'}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3)}</span>
                        <span className="text-3xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className={`transition-all duration-700 ${booking.date ? 'opacity-100 translate-y-0' : 'opacity-10 translate-y-8 pointer-events-none blur-sm'}`}>
                <h3 className="text-xs font-bold uppercase opacity-40 mb-6 text-center tracking-[0.2em]">{T.time_title}</h3>
                
                <div className="grid grid-cols-4 gap-3">
                  {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '18:00', '19:00', '20:00', '21:00'].map((time, idx) => {
                     let disabled = false;
                     let soldOut = false;
                     
                     if (booking.date) {
                        const now = new Date();
                        const [h] = time.split(':');
                        const selectedDate = new Date(booking.date);
                        // Passado
                        if (selectedDate.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) {
                            disabled = true;
                        } else {
                            // Sold Out logic
                            soldOut = isTimeSoldOut(booking.date, time);
                        }
                     }

                     return (
                        <button key={time} disabled={disabled || soldOut} 
                          onClick={() => {
                              setBooking({ ...booking, time });
                              generateViewingCount(); 
                          }}
                          style={{ animationDelay: `${idx * 50}ms` }}
                          className={`relative py-4 rounded-2xl text-xs font-bold border transition-all overflow-hidden animate-scale-in
                            ${soldOut 
                                ? 'opacity-30 cursor-not-allowed bg-red-500/5 border-red-500/10 text-red-500' 
                                : booking.time === time 
                                    ? 'bg-white text-blue-900 border-white shadow-lg shadow-blue-500/20 scale-105 z-10 ring-4 ring-blue-500/20' 
                                    : disabled 
                                        ? 'opacity-10 cursor-not-allowed border-transparent' 
                                        : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600 hover:border-blue-300'}`}
                        >
                          {time}
                          {soldOut && <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/90 text-[7px] uppercase tracking-widest text-red-500 font-black -rotate-12">Esgotado</div>}
                        </button>
                     );
                  })}
                </div>
                
                {/* MENSAGEM DE ESCASSEZ */}
                {booking.time && (
                    <div className="mt-8 flex justify-center animate-fade-in">
                        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/10">
                            <Eye size={14} className="animate-pulse"/> {viewingCount} {T.viewing_now}
                        </div>
                    </div>
                )}
             </div>
          </div>
        )}

        {/* STEP 2: DADOS E LOCAL */}
        {step === 2 && (
          <div className="space-y-8 animate-slide-in">
             <button onClick={()=>setStep(1)} className="group flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity pl-1"><div className="p-1 rounded-full border border-current group-hover:-translate-x-1 transition-transform"><ChevronLeft size={12}/></div> Voltar</button>
             
             <div className="text-center mb-4">
                <h2 className="text-3xl font-black text-blue-500 mb-2">{T.location_title}</h2>
                <p className="text-sm opacity-60 font-light">{T.location_sub}</p>
             </div>

             <div className={`p-1.5 rounded-[2rem] flex ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                {[{ id: 'home', label: 'Home', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-4 rounded-[1.7rem] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === type.id ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}
                  >
                    <type.icon size={16} /> {type.label}
                  </button>
                ))}
             </div>

             <div className="space-y-4">
                <div className={`flex items-center px-6 rounded-[2rem] border transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                   <User size={20} className="opacity-30 mr-4 text-blue-500"/>
                   <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder={T.name_placeholder} className="w-full py-6 bg-transparent outline-none text-sm font-bold placeholder:font-normal placeholder:opacity-40"/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-xs font-bold text-blue-500 flex items-center gap-2 pl-4 py-2"><Info size={14}/> {T.address_warn}</p>
                    <div className="grid grid-cols-[1fr_90px] gap-4">
                       <input placeholder="Rua / Avenida" className={`p-6 rounded-[2rem] border text-sm outline-none font-medium focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                       <input type="tel" placeholder="Nº" className={`p-6 rounded-[2rem] border text-sm outline-none font-medium focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input placeholder="Bairro" className={`p-6 rounded-[2rem] border text-sm outline-none font-medium focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       <input placeholder="Cidade" className={`p-6 rounded-[2rem] border text-sm outline-none font-medium focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>
                    <input 
                        placeholder={T.comp_placeholder} 
                        className={`w-full p-6 rounded-[2rem] border text-sm outline-none border-blue-500/30 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all ${isDark ? 'bg-zinc-900' : 'bg-white'}`} 
                        value={booking.address.comp} 
                        onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} 
                    />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 text-blue-500 animate-fade-in flex flex-col items-center text-center gap-4">
                        <div className="p-4 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/40"><BedDouble size={32}/></div>
                        <p className="text-sm font-medium leading-relaxed max-w-[250px]">{T.motel_warn}</p>
                    </div>
                )}

                {booking.locationType === 'hotel' && (
                   <div className="space-y-4 animate-fade-in">
                      <input placeholder={T.hotel_name} className={`w-full p-6 rounded-[2rem] border text-sm outline-none focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                       <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Cidade" className={`p-6 rounded-[2rem] border text-sm outline-none focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          <input placeholder={T.room} className={`p-6 rounded-[2rem] border text-sm outline-none focus:border-blue-500 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-8">
               <h3 className="text-xs font-bold uppercase opacity-40 mb-6 ml-4 tracking-[0.2em]">{T.extras_title}</h3>
               <div className="space-y-4">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-5 rounded-[2.5rem] border cursor-pointer transition-all active:scale-[0.98] ${booking.extras[extra.id] ? 'border-blue-500 bg-blue-500/5 shadow-lg shadow-blue-500/10' : isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 shadow-sm hover:shadow-md'}`}
                   >
                     <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-2xl transition-colors ${booking.extras[extra.id] ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400'}`}><extra.icon size={20}/></div>
                       <div><p className="text-sm font-bold">{T.extras[extra.id].label}</p><p className="text-[11px] opacity-60 mt-0.5">{T.extras[extra.id].desc}</p></div>
                     </div>
                     <span className={`text-sm font-bold mr-2 ${booking.extras[extra.id] ? 'text-blue-500' : 'opacity-30'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="space-y-10 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="group flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity pl-1"><div className="p-1 rounded-full border border-current group-hover:-translate-x-1 transition-transform"><ChevronLeft size={12}/></div> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-black text-blue-500">{T.resume_title}</h2>
             </div>

             <div className={`rounded-[2.5rem] border overflow-hidden relative ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-100 shadow-2xl'}`}>
                {/* Efeito decorativo */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none"></div>

                <div className="p-8 space-y-5 relative z-10">
                   <div className="flex justify-between items-center text-lg font-bold"><span>{T.services[booking.service.id].title}</span><span>R$ {booking.service.price}</span></div>
                   
                   {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                     <div key={k} className="flex justify-between items-center text-sm opacity-60 pl-2 border-l-2 border-blue-500/20"><span>{T.extras[k].label}</span><span>+ R$ {DB.extras.find(e => e.id === k).price}</span></div>
                   ))}
                   
                   {booking.appliedCoupon && (
                     <div className="flex justify-between items-center text-sm font-bold text-emerald-500 bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <span className="flex items-center gap-2"><Ticket size={16}/> {booking.appliedCoupon.title}</span>
                        <span>- R$ {booking.appliedCoupon.val}</span>
                     </div>
                   )}
                   
                   <div className="border-t border-dashed border-zinc-500/20 my-2 pt-6 flex justify-between items-center">
                      <span className="text-lg font-black opacity-80">Total</span>
                      <span className="text-5xl font-black text-blue-500 tracking-tighter">R$ {getFinancials.total}</span>
                   </div>
                   
                   {/* AVISO DE UBER NO CHECKOUT */}
                   <div className="flex items-center gap-3 text-[10px] uppercase font-bold text-amber-500 bg-amber-500/5 p-4 rounded-2xl border border-amber-500/20">
                       <Car size={16} className="shrink-0"/> <span className="leading-tight">{T.uber_warn}</span>
                   </div>
                </div>
                
                {/* SELECTOR DE CUPOM */}
                <div className="bg-black/5 dark:bg-black/20 p-6 flex items-center justify-between border-t border-zinc-500/10">
                   <div className="flex items-center gap-3 text-xs font-bold opacity-60"><Ticket size={18} /> <span>{T.coupon_label}:</span></div>
                   {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg transition-colors hover:bg-red-500/20"><Trash2 size={14}/> {T.remove}</button>
                      ) : (
                        <select 
                            onChange={(e) => {
                                const c = user.coupons.find(coup => String(coup.id) === e.target.value);
                                setBooking({...booking, appliedCoupon: c});
                            }} 
                            className="bg-transparent text-sm font-bold text-blue-500 outline-none cursor-pointer uppercase tracking-wider text-right w-40 hover:opacity-80 transition-opacity"
                        >
                           <option value="">{T.coupon_select}</option>
                           {user.coupons.map(c => <option key={c.id} value={c.id}>R$ {c.val} - {c.title}</option>)}
                        </select>
                      )
                   ) : <span className="text-xs opacity-40">{T.coupon_none}</span>}
                </div>
             </div>

             <div className="space-y-6 pt-4">
                <h3 className="text-xs font-bold uppercase opacity-40 ml-4 tracking-[0.2em]">{T.payment_title}</h3>
                <div className="grid grid-cols-3 gap-4">
                   {[{ id: 'pix', label: 'PIX', icon: QrCode }, { id: 'card', label: 'Cartão', icon: CreditCard }, { id: 'money', label: 'Cash', icon: Banknote }].map((p) => (
                     <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                       className={`flex flex-col items-center justify-center gap-3 py-8 rounded-[2rem] border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 scale-105' : isDark ? 'bg-zinc-900 border-zinc-800 opacity-50 hover:opacity-100 hover:bg-zinc-800' : 'bg-white border-zinc-200 opacity-60 hover:opacity-100 hover:shadow-lg'}`}
                     >
                       <p.icon size={26} strokeWidth={1.5} /> <span className="text-[10px] font-black uppercase tracking-wider">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className={`flex items-center gap-4 p-5 rounded-3xl border transition-colors cursor-pointer ${booking.termsAccepted ? 'border-blue-500 bg-blue-500/5' : 'border-transparent hover:bg-black/5 dark:hover:bg-white/5'}`} onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})}>
                <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-400 opacity-50'}`}>
                   {booking.termsAccepted && <Check size={16} strokeWidth={4} />}
                </div>
                <p className="text-xs opacity-60 leading-relaxed select-none">
                   {T.terms_agree} <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="font-bold underline text-blue-500 cursor-pointer hover:text-blue-400">{T.terms_link}</span>.
                </p>
             </div>
          </div>
        )}

        {/* STEP 4: SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-20 animate-scale-in text-center h-full">
                <div className="relative mb-12 group cursor-pointer" onClick={handleShare}>
                     <div className="absolute inset-0 bg-emerald-500 blur-[60px] opacity-40 rounded-full animate-pulse-slow"></div>
                     <div className="w-40 h-40 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 transition-transform group-hover:scale-105">
                        <Check size={80} className="text-white drop-shadow-lg" strokeWidth={5}/>
                     </div>
                     <div className="absolute bottom-0 right-0 bg-white text-emerald-600 p-3 rounded-full shadow-lg z-20"><Share2 size={20}/></div>
                </div>
                
                <h1 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 tracking-tight">{T.success_title}</h1>
                <p className="text-lg opacity-60 max-w-[320px] mx-auto mb-16 font-light leading-relaxed">
                    {T.success_msg}
                </p>

                <a href={generateZap()} target="_blank" rel="noreferrer" 
                   className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-[2rem] text-xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-3 animate-bounce-slow transition-transform active:scale-95 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    <MessageCircle size={28} fill="currentColor" className="relative z-10"/> <span className="relative z-10">{T.btn_zap}</span>
                </a>
                
                <button onClick={handleReset} className="mt-12 text-xs font-bold opacity-30 hover:opacity-100 uppercase tracking-[0.2em] transition-opacity">
                    Voltar ao início
                </button>
            </div>
        )}
        </div>
      </main>

      {/* FOOTER FIXO (NEXT BUTTON) */}
      {step < 4 && (
          <div className={`fixed bottom-0 left-0 right-0 h-28 flex items-center justify-center px-6 backdrop-blur-xl transition-all duration-500 z-50 ${isDark ? 'bg-zinc-950/80 border-t border-white/5' : 'bg-white/80 border-t border-zinc-200'}`}>
             <div className="w-full max-w-md flex items-center gap-6 pb-4">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in pl-2">
                      <span className="block text-[9px] font-bold uppercase opacity-40 tracking-wider mb-0.5">Total Estimado</span>
                      <span className="block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!isStepValid()}
                   onClick={() => step === 3 ? handleFinish() : setStep(step + 1)}
                   className={`h-16 rounded-[2rem] font-black flex items-center justify-center gap-3 px-8 transition-all active:scale-95 shadow-lg
                     ${step < 3 ? 'flex-1 ml-auto' : 'w-full'} 
                     ${!isStepValid() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 shadow-none' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/40 hover:shadow-blue-500/60'}`}
                >
                   <span className="text-sm uppercase tracking-wide">{step === 3 ? T.btn_finish : T.btn_continue}</span>
                   {step === 3 ? <CheckCircle2 size={20}/> : <ArrowRight size={20} />}
                </button>
             </div>
          </div>
      )}

      {/* CSS GLOBAL & ANIMAÇÕES */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 4px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; } 
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } } 
        
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } } 
        .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); } 
        
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; } 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        
        .animate-slide-in { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; } 
        @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        
        .animate-slide-up { animation: slideUpModal 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }
        
        .animate-bounce-slow { animation: bounce 3s infinite; }
        .animate-pulse-slow { animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}
