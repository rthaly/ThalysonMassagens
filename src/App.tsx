import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v20_stable', // Chave nova para limpar erros antigos
  XP_TARGET: 500, 
};

// --- LISTA DE AVALIAÇÕES (COMPLETA) ---
const REVIEWS_DATA = [
  { n: "Tiago", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", s: 5 },
  { n: "Anônimo", t: "O toque dele vicia. A finalização foi absurda, adorei.", s: 5 },
  { n: "Pedro H.", t: "Fui pra relaxar e saí renovado. A massagem é real mesmo.", s: 5 },
  { n: "Curioso SP", t: "Mão firme, pegada excelente. O óleo quente faz diferença.", s: 5 },
  { n: "Marcos", t: "Paguei o extra pra tocar e valeu cada centavo. Muito cheiroso.", s: 5 },
  { n: "Empresário", t: "Sou casado, tinha receio. O sigilo foi absoluto.", s: 5 },
  { n: "Roberto", t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", s: 5 },
  { n: "Fã", t: "Visual nota 1000. Super educado.", s: 5 },
  { n: "Carlos A.", t: "Profissionalismo raro hoje em dia. Pontual.", s: 5 },
  { n: "Lucas", t: "A mistura de força e suavidade é incrível. Recomendo.", s: 5 },
  { n: "Gustavo", t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", s: 5 },
  { n: "Felipe", t: "Tinha muita dor na lombar, ele resolveu em uma sessão.", s: 5 },
  { n: "J.P.", t: "O corpo a corpo é quente de verdade. Uma experiência única.", s: 5 },
  { n: "André", t: "Gostei que ele respeita os limites, mas entrega muito prazer.", s: 5 },
  { n: "Turista RJ", t: "Atendimento no hotel foi super rápido e discreto.", s: 5 },
  { n: "Breno", t: "Fiz a relaxante e dormi na maca de tão bom.", s: 5 },
  { n: "Dr. Marcelo", t: "A técnica dele é diferente de tudo. Vale cada real.", s: 5 },
  { n: "Caio", t: "Sensação de liberdade total. O toque extra é obrigatório.", s: 5 },
  { n: "Vitor", t: "Me senti renovado. Energia lá em cima depois da sessão.", s: 5 },
  { n: "Renan", t: "Extremamente educado e com papo bom.", s: 5 },
  { n: "Paulo", t: "O óleo morno é um detalhe que faz toda diferença.", s: 5 },
  { n: "Cliente Antigo", t: "Já fiz com vários, o Thalyson é o melhor da região.", s: 5 },
  { n: "Advogado SP", t: "Pontualidade britânica. Chegou na hora marcada.", s: 5 },
  { n: "Anônimo", t: "A finalização é intensa mesmo, cumpriu o que prometeu.", s: 5 },
  { n: "Motorista", t: "Massagem terapêutica de verdade, tirou todos os nós.", s: 5 },
  { n: "Designer", t: "Experiência sensorial incrível. O cheiro, o toque, a música.", s: 5 },
  { n: "Matheus", t: "Muito gente fina. O tempo passou voando.", s: 5 },
  { n: "Bruno", t: "Melhor investimento da semana. Relaxamento total.", s: 5 },
  { n: "Rafa", t: "Toque firme, mas sensível. Sabe onde tocar.", s: 5 },
  { n: "Tech Guy", t: "Gostei da facilidade de agendar pelo app.", s: 5 },
  { n: "Pedro", t: "Me ajudou muito com a ansiedade. Gratidão.", s: 5 },
  { n: "Ricardo", t: "Valeu a pena esperar a agenda liberar.", s: 5 },
  { n: "Sérgio", t: "Nota 10. Nada a reclamar.", s: 5 },
  { n: "Médico", t: "Muito higiênico e cuidadoso.", s: 5 },
  { n: "Fernando", t: "Paz de espírito e corpo relaxado. Obrigado.", s: 5 }
];

const TEXTS = {
  pt: {
    welcome: "Olá,",
    subtitle: "Escolha como deseja relaxar hoje.",
    reviews_count: "Ver avaliações de clientes",
    reviews_title: "O que dizem sobre mim",
    choose_service: "1. Escolha sua Sessão",
    duration: "min",
    currency: "R$",
    select_time_title: "2. Data e Horário",
    date_sub: "Selecione o melhor dia para você",
    time_title: "Horários Disponíveis",
    location_title: "3. Onde será o atendimento?",
    input_name: "Seu Nome (Como prefere ser chamado)",
    input_addr: "Endereço (Rua e Bairro)",
    input_comp: "Complemento ou Ponto de Referência",
    input_hotel: "Nome do Hotel",
    input_room: "Número do Quarto",
    motel_note: "Para Motéis: Combinamos o local exato pelo WhatsApp.",
    pay_title: "4. Forma de Pagamento",
    pay_pix: "PIX",
    pay_card: "Cartão",
    pay_cash: "Dinheiro",
    extras_title: "Deseja incluir algo a mais?",
    coupon_title: "Seus Cupons",
    coupon_select: "Toque para selecionar",
    coupon_none: "Sem cupons no momento",
    remove: "Remover",
    total_label: "Valor Total",
    book_btn: "ENVIAR PEDIDO",
    next_btn: "AVANÇAR",
    uber_note: "+ Taxa de deslocamento (Uber)",
    success_title: "Tudo pronto!",
    success_sub: "Agora basta enviar a confirmação no WhatsApp para garantir seu horário.",
    whatsapp_btn: "ENVIAR NO WHATSAPP",
    back_home: "Voltar para o início",
    address_warn: "Por favor, preencha o endereço para eu chegar até você.",
    today: "Hoje",
    tomorrow: "Amanhã",
    
    services: {
      relaxante: { title: "Relaxante", subtitle: "Leve e Tranquila", desc: "Movimentos suaves para tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Sensitiva", subtitle: "Toque Pele com Pele", desc: "Uma massagem focada em sensações sutis e despertar o corpo." },
      mista: { title: "Completa", subtitle: "Relaxante + Sensitiva", desc: "Começa tirando a tensão muscular e termina com a parte sensitiva. Inclui finalização (Lingam)." }
    },
    
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo de massagem" },
      touch: { label: "Toque Interativo", sub: "Você pode tocar também" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais relaxantes" }
    },

    terms_body: [
      "1. Respeito: O atendimento é profissional. Qualquer conduta agressiva encerra a sessão.",
      "2. Higiene: Levo tudo higienizado. Prezo pela máxima limpeza.",
      "3. Sigilo: Sua privacidade é total. O que acontece na sessão, fica na sessão.",
      "4. Motel: A entrada do motel é por conta do cliente.",
      "5. Pagamento: É feito logo após o término da massagem."
    ],
    terms_title: "Importante Saber",
    terms_agree: "Li e concordo com as",
    terms_link: "Regras de Atendimento",
    terms_btn: "Entendi e Concordo",

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Oi Thalyson! Gostaria de agendar:",
      section_serv: "💆‍♂️ SESSÃO",
      section_loc: "📍 LOCAL",
      section_fin: "💰 VALORES",
      item_serv: "Serviço:",
      item_extra: "Adicionais:",
      subtotal: "Subtotal:",
      discount: "Desconto:",
      uber_label: "🚗 Uber (Ida/Volta):",
      uber_val: "A calcular",
      total_pay: "Total a Pagar:",
      payment: "Pagamento:",
      wait: "Aguardo sua confirmação!"
    }
  },
  en: {
    welcome: "Hello,",
    subtitle: "Choose how you want to relax today.",
    reviews_count: "See client reviews",
    reviews_title: "Client Testimonials",
    choose_service: "1. Choose Session",
    duration: "min",
    currency: "R$",
    select_time_title: "2. Date & Time",
    date_sub: "Select the best day for you",
    time_title: "Available Hours",
    location_title: "3. Location",
    input_name: "Your Name",
    input_addr: "Address (Street & District)",
    input_comp: "Unit/Apt or Reference",
    input_hotel: "Hotel Name",
    input_room: "Room Number",
    motel_note: "For Motels: We decide the place on WhatsApp.",
    pay_title: "4. Payment Method",
    pay_pix: "PIX",
    pay_card: "Card",
    pay_cash: "Cash",
    extras_title: "Want to include extras?",
    coupon_title: "Your Coupons",
    coupon_select: "Tap to select",
    coupon_none: "No coupons available",
    remove: "Remove",
    total_label: "Total Value",
    book_btn: "SEND REQUEST",
    next_btn: "NEXT STEP",
    uber_note: "+ Uber Fee (Round trip)",
    success_title: "All set!",
    success_sub: "Now just send the confirmation on WhatsApp to secure your slot.",
    whatsapp_btn: "SEND ON WHATSAPP",
    back_home: "Back to home",
    address_warn: "Please fill in the location.",
    today: "Today",
    tomorrow: "Tomorrow",

    services: {
      relaxante: { title: "Relaxing", subtitle: "Light & Peaceful", desc: "Gentle movements to remove back weight and calm the mind." },
      sensitiva: { title: "Sensitive", subtitle: "Skin-to-Skin", desc: "A massage focused on subtle sensations and body awakening." },
      mista: { title: "Complete", subtitle: "Relaxing + Sensitive", desc: "Starts with muscle relaxation and ends with the sensitive part. Finishing included." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More massage time" },
      touch: { label: "Interactive Touch", sub: "You can touch too" },
      aroma: { label: "Aromatherapy", sub: "Relaxing essential oils" }
    },

    terms_body: [
      "1. Respect: Professional service. Aggression ends the session.",
      "2. Hygiene: I value hygiene. Everything is sterilized.",
      "3. Privacy: Guaranteed secrecy.",
      "4. Motel: Entrance fee is on the client.",
      "5. Payment: Done immediately after service."
    ],
    terms_title: "Good to Know",
    terms_agree: "I agree to the",
    terms_link: "Service Rules",
    terms_btn: "I Understand",

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "Hi Thalyson! I'd like to book:",
      section_serv: "💆‍♂️ SESSION",
      section_loc: "📍 LOCATION",
      section_fin: "💰 VALUES",
      item_serv: "Service:",
      item_extra: "Extras:",
      subtotal: "Subtotal:",
      discount: "Discount:",
      uber_label: "🚗 Uber (Round Trip):",
      uber_val: "To calculate",
      total_pay: "Total to Pay:",
      payment: "Payment:",
      wait: "Waiting for confirmation!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', min: 60, price: 145, icon: Wind, color: 'text-teal-400' },
    { id: 'sensitiva', min: 60, price: 175, icon: Flame, color: 'text-rose-400' },
    { id: 'mista', min: 90, price: 255, icon: Zap, color: 'text-amber-400' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS (MODAIS E UI)
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[120] transition-all duration-500 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
    <div className="bg-blue-600/95 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm border border-blue-400/30 whitespace-nowrap">
      <CheckCircle2 size={18} />
      <span>{msg}</span>
    </div>
  </div>
);

// MODAL DE TERMOS
const TermsModal = ({ isOpen, onClose, isDark, T }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-full max-w-md p-8 rounded-3xl max-h-[80vh] flex flex-col animate-scale-in bg-zinc-900 text-zinc-100 shadow-2xl border border-white/10">
         <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-xl font-bold flex items-center gap-2"><ShieldCheck className="text-blue-500"/> {T.terms_link}</h2>
            <button onClick={onClose}><X/></button>
         </div>
         <div className="space-y-4 text-sm opacity-80 leading-relaxed text-justify font-light overflow-y-auto flex-1 pr-2">
            {T.terms_body.map((term, i) => <p key={i}>{term}</p>)}
         </div>
         <button onClick={onClose} className="w-full mt-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-colors flex-shrink-0">{T.terms_btn}</button>
      </div>
    </div>
  );
};

// MODAL DE AVALIAÇÕES
const ReviewsModal = ({ isOpen, onClose, isDark, reviews, T }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
       <div className="relative w-full h-[85%] md:max-w-lg rounded-[2rem] flex flex-col animate-slide-up overflow-hidden bg-zinc-950 text-white border border-white/10 shadow-2xl">
          <div className="flex justify-between items-center p-6 border-b flex-shrink-0 border-zinc-800">
             <h2 className="text-xl font-bold flex items-center gap-2"><Star className="text-amber-400" fill="currentColor"/> {T.reviews_title}</h2>
             <button onClick={onClose} className="p-2 bg-black/20 rounded-full hover:bg-white/10"><X/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
             {reviews.map((r, i) => (
                <div key={i} className="p-5 rounded-2xl border bg-zinc-900 border-zinc-800 shadow-sm">
                   <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-blue-400">{r.n}</span>
                      <div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                   </div>
                   <p className="text-sm opacity-80 leading-relaxed italic text-zinc-300">"{r.t}"</p>
                </div>
             ))}
             <div className="text-center py-6 opacity-40 text-xs uppercase font-bold tracking-widest pb-20">---</div>
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
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  
  // Modais
  const [menuOpen, setMenuOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  const scrollRef = useRef(null);
  const T = TEXTS[lang]; 

  // USER STATE
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       // INICIA COM CUPOM DE BOAS VINDAS
       const initialCoupons = [{ id: 'welcome12', val: 12, title: 'Cupom Boas Vindas' }];
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

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  
  useEffect(() => {
    if(scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [step]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thalyson Massagens', text: 'Agende seu momento.', url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado!");
    }
  };

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    let extrasTotal = 0;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const price = DB.extras.find(e=>e.id===k).price;
            sub += price;
            extrasTotal += price;
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { 
        service: booking.service.price,
        extras: extrasTotal,
        sub: sub, // Service + Extras
        disc: disc, 
        total: Math.max(0, sub - disc) 
    };
  }, [booking.service, booking.extras, booking.appliedCoupon]);

  const generateZap = () => {
    const f = getFinancials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const h = new Date().getHours();
    
    let greeting = "";
    if (h < 12) greeting = T.zap.greeting[0];
    else if (h < 18) greeting = T.zap.greeting[1];
    else greeting = T.zap.greeting[2];
    
    let locTxt = "";
    let mapsLink = "";
    
    const serviceName = booking.service ? T.services[booking.service.id].title : "";

    if (booking.locationType === 'home') {
      locTxt = `🏠 *${T.zap.section_loc} (Casa)*\nEnd: ${booking.address.street}, ${booking.address.number}\nRef: ${booking.address.comp}\nBairro: ${booking.address.district} - ${booking.address.city}`;
      const query = `${booking.address.street}, ${booking.address.number}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    } else if (booking.locationType === 'motel') {
      locTxt = `🏩 *${T.zap.section_loc} (Motel)*\nVamos decidir juntos.`;
      mapsLink = "";
    } else {
      locTxt = `🏨 *${T.zap.section_loc} (Hotel)*\nHotel: ${booking.address.placeName}\nQuarto: ${booking.address.comp}\nCidade: ${booking.address.city}`;
      const query = `${booking.address.placeName}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => `+ ${T.extras_list[k].label} (R$ ${DB.extras.find(e => e.id === k).price})`).join('\n');

    const msg = `
${greeting}, Thalyson!
${T.zap.intro}

👤 *${user.name}*

${T.zap.section_serv}
• ${serviceName} (R$ ${f.service})
📅 ${dateStr} às ${booking.time}
${extrasTxt ? `${T.zap.item_extra}\n${extrasTxt}` : ''}

${locTxt}
${mapsLink ? `🔗 Maps: ${mapsLink}` : ''}

${T.zap.section_fin}
${T.zap.subtotal} ${T.currency} ${f.sub},00
${f.disc > 0 ? `${T.zap.discount} - ${T.currency} ${f.disc},00` : ''}
${T.zap.uber_label} ${T.zap.uber_val}

✅ *${T.zap.total_pay} ${T.currency} ${f.total},00 + Uber*
${T.zap.payment} ${booking.payment.toUpperCase()}

*${T.zap.wait}*
`.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const isStepValid = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { city, street, placeName, number, comp } = booking.address;
      if (!user.name) return false;
      // Validação: COMPLEMENTO OBRIGATÓRIO PARA CASA
      if (booking.locationType === 'home' && (!city || !street || !number || !comp)) return false;
      if (booking.locationType === 'hotel' && (!city || !placeName)) return false;
      return true;
    }
    return true; 
  };

  const handleFinish = () => {
    if (!booking.payment) return showToast(T.payment_title);
    if (!booking.termsAccepted) return showToast("Aceite os termos.");

    const earnedXP = getFinancials.total;
    const newTotalXP = user.xp + earnedXP;
    
    let updatedCoupons = [...user.coupons];
    
    // 1. Remove cupom usado (Comparação segura de String)
    if(booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }

    // 2. Gamificação: Ganha cupom a cada 500xp
    if (Math.floor(newTotalXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), title: 'Cupom de Retorno', val: 20 });
    }

    setUser({ ...user, xp: newTotalXP, coupons: updatedCoupons });
    setStep(4);
  };

  const handleReset = () => {
      setStep(0);
      setBooking({
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
  };

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950">
       <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl animate-pulse">T.</div>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      <Toast show={toast.show} msg={toast.msg} />
      <TermsModal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} isDark={isDark} T={T} />
      <ReviewsModal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} isDark={isDark} reviews={REVIEWS_DATA} T={T} />
      
      {/* MENU LATERAL */}
      {menuOpen && (
          <div className="fixed inset-0 z-[120] flex justify-start">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
             <div className="relative w-4/5 max-w-xs h-full bg-zinc-900 border-r border-white/10 p-6 shadow-2xl flex flex-col animate-slide-right">
                <div className="flex justify-between items-center mb-10">
                   <h2 className="font-bold text-2xl text-blue-500">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)} className="p-2 rounded-full hover:bg-white/10"><X size={24}/></button>
                </div>
                
                {/* CARD DE XP */}
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
                    <Trophy className="absolute -right-4 -bottom-4 text-white/20" size={100} />
                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Seus Pontos (XP)</p>
                    <h3 className="text-4xl font-black mb-4">{user.xp}</h3>
                    <div className="w-full h-2 bg-black/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET * 100}%` }}></div>
                    </div>
                    <p className="text-[10px] opacity-70">Junte pontos para ganhar descontos!</p>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                   <button onClick={()=>setLang(lang==='pt'?'en':'pt')} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      <Globe size={20}/> <span>{lang === 'pt' ? 'English' : 'Português'}</span>
                   </button>
                   <button onClick={handleShare} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      <Share2 size={20}/> <span>Compartilhar App</span>
                   </button>
                </div>

                <div className="pt-8">
                   <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold justify-center shadow-lg hover:shadow-purple-500/20 transition-all">
                      <Instagram size={20}/> @seumssagista
                   </a>
                </div>
             </div>
          </div>
      )}

      {/* HEADER FIXO */}
      <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/5 bg-zinc-950/90 backdrop-blur-md z-20">
        <div className="flex items-center gap-4">
          <button onClick={()=>setMenuOpen(true)} className="p-3 rounded-full hover:bg-white/10 transition-colors"><Menu size={24} className="text-white"/></button>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide text-white">Thalyson</span>
            <span className="text-[10px] opacity-60 text-zinc-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/> Online</span>
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-600/20">T.</div>
      </header>

      {/* PROGRESS BAR */}
      {step < 4 && (
        <div className="w-full h-1 bg-zinc-900 flex-shrink-0">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${((step+1)/4)*100}%` }} />
        </div>
      )}

      {/* CONTEÚDO COM SCROLL */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth">
        <div className="max-w-md mx-auto animate-fade-in">
        
        {/* STEP 0: SERVIÇOS & AVALIAÇÕES */}
        {step === 0 && (
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white">{T.welcome} {user.name.split(' ')[0] || ''}</h1>
              <p className="text-lg text-zinc-400 font-light leading-relaxed">{T.subtitle}</p>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">{T.choose_service}</h2>
              {DB.services.map((s) => (
                <div key={s.id} onClick={() => setBooking({ ...booking, service: s })}
                  className={`relative p-6 rounded-[24px] border-2 cursor-pointer transition-all duration-300 active:scale-95 group
                    ${booking.service?.id === s.id 
                      ? 'bg-blue-600/10 border-blue-500 shadow-xl shadow-blue-900/20' 
                      : 'border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900'}`}
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className={`p-4 rounded-2xl ${booking.service?.id === s.id ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                        <s.icon size={28} />
                      </div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold text-white tracking-tight">R$ {s.price}</span>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{s.min} {T.duration}</span>
                      </div>
                   </div>
                   <h3 className="font-bold text-xl text-white mb-2">{T.services[s.id].title}</h3>
                   <p className="text-sm text-zinc-400 leading-relaxed">{T.services[s.id].desc}</p>
                </div>
              ))}
            </div>
            
            <div className="pt-6 border-t border-white/5">
                <button onClick={() => setReviewsOpen(true)} className="w-full py-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-colors group">
                    <div className="flex text-amber-400 gap-1"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white">{T.reviews_btn}</span>
                </button>
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="space-y-10 animate-slide-in">
             <button onClick={()=>setStep(0)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={18}/> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">{T.select_time_title}</h2>
                <p className="text-base text-zinc-400">{T.date_sub}</p>
             </div>

             <div className="space-y-6">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date(); d.setDate(d.getDate() + offset);
                    const isSelected = booking.date?.toDateString() === d.toDateString();
                    let lbl = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3);
                    if(offset===0) lbl=T.today; if(offset===1) lbl=T.tomorrow;

                    return (
                      <button key={offset} onClick={() => setBooking({ ...booking, date: d, time: null })}
                        className={`min-w-[85px] h-24 rounded-[24px] flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0
                          ${isSelected ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                      >
                        <span className="text-[10px] uppercase font-bold tracking-widest">{lbl}</span>
                        <span className="text-3xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={`grid grid-cols-3 gap-4 transition-all duration-500 ${booking.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  {['09:00', '10:00', '11:00', '13:00', '15:00', '17:00', '19:00', '20:30'].map((time) => {
                     let disabled = false;
                     if (booking.date) {
                        const now = new Date();
                        const [h] = time.split(':');
                        if (booking.date.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) disabled = true;
                     }
                     return (
                        <button key={time} disabled={disabled} onClick={() => setBooking({ ...booking, time })}
                          className={`py-5 rounded-2xl text-sm font-bold border-2 transition-all
                            ${booking.time === time 
                                ? 'bg-white text-blue-900 border-white shadow-xl scale-105 z-10' 
                                : disabled ? 'opacity-30 bg-zinc-900 border-transparent text-zinc-600 cursor-not-allowed' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}
                        >
                          {time}
                        </button>
                     );
                  })}
                </div>
             </div>
          </div>
        )}

        {/* STEP 2: DADOS E LOCAL */}
        {step === 2 && (
          <div className="space-y-8 animate-slide-in">
             <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={18}/> Voltar</button>
             
             <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">{T.location_title}</h2>
             </div>

             <div className="flex bg-zinc-900 p-1.5 rounded-[20px] border border-zinc-800">
                {[{ id: 'home', label: 'Home', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-4 rounded-[16px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === type.id ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500'}`}
                  >
                    <type.icon size={18} /> {type.label}
                  </button>
                ))}
             </div>

             <div className="space-y-5">
                <div>
                   <label className="text-xs font-bold text-zinc-500 uppercase ml-2 mb-1 block">{T.input_name}</label>
                   <div className="flex items-center px-6 rounded-[24px] bg-zinc-900 border border-zinc-800 focus-within:border-blue-500 transition-colors">
                      <User size={20} className="text-zinc-600 mr-4"/>
                      <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder="Ex: João" className="w-full py-5 bg-transparent outline-none text-base text-white placeholder-zinc-600"/>
                   </div>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-xs font-bold text-amber-500 flex items-center gap-2 pl-2 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20"><Info size={16}/> {T.address_warn}</p>
                    
                    <div className="grid grid-cols-[1fr_90px] gap-4">
                       <input placeholder="Rua / Av" className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                       <input type="tel" placeholder="Nº" className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <input placeholder="Bairro" className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       <input placeholder="Cidade" className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-zinc-500 uppercase ml-2 mb-1 block">Obrigatório</label>
                        <input placeholder={T.comp_placeholder} className="w-full p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                    </div>
                  </div>
                )}

                {booking.locationType === 'motel' && (
                    <div className="p-6 rounded-[24px] bg-blue-900/20 border border-blue-500/30 text-blue-200 animate-fade-in flex gap-4 items-start">
                        <MessageCircle size={24} className="shrink-0 mt-1"/>
                        <p className="text-sm font-medium leading-relaxed">{T.motel_note}</p>
                    </div>
                )}

                {booking.locationType === 'hotel' && (
                   <div className="space-y-4 animate-fade-in">
                      <input placeholder={T.input_hotel} className="w-full p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                       <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Cidade" className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          <input placeholder={T.input_room} className="p-5 rounded-[24px] bg-zinc-900 border border-zinc-800 text-base text-white outline-none focus:border-blue-500" value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-8 border-t border-white/5 mt-8">
               <h3 className="text-sm font-bold uppercase text-zinc-500 mb-6">{T.extras_title}</h3>
               <div className="space-y-4">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-5 rounded-[20px] border-2 cursor-pointer transition-all ${booking.extras[extra.id] ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-900 border-zinc-800'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-full ${booking.extras[extra.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}><extra.icon size={20}/></div>
                       <div><p className="text-base font-bold text-white">{T.extras_list[extra.id].label}</p><p className="text-xs text-zinc-400">{T.extras_list[extra.id].sub}</p></div>
                     </div>
                     <span className={`text-sm font-bold ${booking.extras[extra.id] ? 'text-blue-400' : 'text-zinc-600'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="space-y-10 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={18}/> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-bold text-white">{T.resume_title}</h2>
             </div>

             <div className="rounded-[30px] border border-white/10 bg-zinc-900 overflow-hidden shadow-2xl">
                <div className="p-8 space-y-6">
                   <div className="flex justify-between items-center text-xl font-bold text-white border-b border-zinc-800 pb-4"><span>{T.services[booking.service.id].title}</span><span>R$ {booking.service.price}</span></div>
                   
                   {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                     <div key={k} className="flex justify-between items-center text-sm text-zinc-400"><span>+ {T.extras_list[k].label}</span><span>R$ {DB.extras.find(e => e.id === k).price}</span></div>
                   ))}
                   
                   {/* SELETOR DE CUPOM CLARO */}
                   <div className="bg-black/30 p-4 rounded-xl flex items-center justify-between border border-zinc-800">
                       <div className="flex items-center gap-3 text-sm font-bold text-zinc-300">
                           <Ticket size={18} className="text-blue-500"/> {T.coupon_title}
                       </div>
                       {user.coupons.length > 0 ? (
                          booking.appliedCoupon ? (
                            <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-400 font-bold hover:underline">{T.remove}</button>
                          ) : (
                            <select 
                                onChange={(e) => {
                                    const c = user.coupons.find(coup => String(coup.id) === e.target.value);
                                    setBooking({...booking, appliedCoupon: c});
                                }} 
                                className="bg-transparent text-sm font-bold text-blue-400 outline-none cursor-pointer uppercase tracking-wider text-right w-40"
                            >
                               <option value="">{T.coupon_select}</option>
                               {user.coupons.map(c => <option key={c.id} value={c.id}>R$ {c.val} OFF</option>)}
                            </select>
                          )
                       ) : <span className="text-xs text-zinc-600">{T.coupon_none}</span>}
                   </div>

                   {booking.appliedCoupon && (
                     <div className="flex justify-between items-center text-sm font-bold text-green-400">
                        <span>Desconto Aplicado</span>
                        <span>- R$ {booking.appliedCoupon.val}</span>
                     </div>
                   )}
                   
                   <div className="border-t border-dashed border-zinc-700 pt-6 flex justify-between items-end">
                      <div>
                          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{T.total_label}</span>
                          <div className="flex items-center gap-2 mt-2 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg w-fit"><Car size={12}/> {T.uber_note}</div>
                      </div>
                      <span className="text-4xl font-black text-white">R$ {getFinancials.total}</span>
                   </div>
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase text-zinc-500 ml-1">{T.pay_title}</h3>
                <div className="grid grid-cols-3 gap-3">
                   {[{ id: 'pix', label: 'PIX', icon: QrCode }, { id: 'card', label: 'Cartão', icon: CreditCard }, { id: 'money', label: 'Dinheiro', icon: Banknote }].map((p) => (
                     <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                       className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[24px] border-2 transition-all duration-200 ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                     >
                       <p.icon size={24} /> <span className="text-[10px] font-black uppercase tracking-wider">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900 border border-zinc-800 cursor-pointer" onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})}>
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 mt-0.5 ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-600'}`}>
                   {booking.termsAccepted && <Check size={16} strokeWidth={4} />}
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed">
                   {T.terms_agree} <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="font-bold underline text-blue-400 cursor-pointer">{T.terms_link}</span>.
                </p>
             </div>
          </div>
        )}

        {/* STEP 4: SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-20 animate-scale-in text-center h-full">
                <div className="relative mb-10">
                     <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                     <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                        <Check size={64} className="text-white" strokeWidth={5}/>
                     </div>
                </div>
                
                <h1 className="text-4xl font-black text-white mb-4">{T.success_title}</h1>
                <p className="text-lg text-zinc-400 max-w-[300px] mx-auto mb-16 leading-relaxed">
                    {T.success_sub}
                </p>

                <a href={generateZap()} target="_blank" rel="noreferrer" 
                   className="w-full py-6 bg-green-600 hover:bg-green-500 text-white font-black rounded-2xl text-xl shadow-xl flex items-center justify-center gap-3 animate-bounce-slow transition-transform active:scale-95">
                    <MessageCircle size={28} fill="white"/> {T.whatsapp_btn}
                </a>
                
                <button onClick={handleReset} className="mt-12 text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-widest">
                    {T.back_home}
                </button>
            </div>
        )}
        </div>
      </main>

      {/* FOOTER FIXO (Navegação) */}
      {step < 4 && (
          <div className="h-28 flex-shrink-0 flex items-center justify-center px-6 border-t border-white/5 bg-zinc-950/90 backdrop-blur-xl pb-4">
             <div className="w-full max-w-md flex items-center gap-4">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in">
                      <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{T.total_label}</span>
                      <span className="block text-3xl font-black text-white">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!isStepValid()}
                   onClick={() => step === 3 ? handleFinish() : setStep(step + 1)}
                   className={`h-16 rounded-[20px] font-bold flex items-center justify-center gap-3 px-8 transition-all active:scale-95 shadow-lg flex-1
                     ${!isStepValid() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 shadow-none' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
                >
                   {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={24}/>}
                </button>
             </div>
          </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); } 
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } } 
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } } 
        .animate-slide-right { animation: slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); } 
        .animate-fade-in { animation: fadeIn 0.8s ease-out; } 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-slide-in { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); } 
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUpModal 0.4s ease-out; }
        @keyframes slideUpModal { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
}
