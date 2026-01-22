import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car, Gift
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES (GLOBAL)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v24_deploy_ready', 
  XP_TARGET: 500, 
};

// --- DADOS DE AVALIAÇÕES ---
const REVIEWS_DATA = [
  { n: "Tiago", t: "Energia surreal. A massagem foi perfeita.", s: 5 },
  { n: "Pedro H.", t: "Fui pra relaxar e saí renovado. Recomendo.", s: 5 },
  { n: "Curioso SP", t: "Mão firme, pegada excelente.", s: 5 },
  { n: "Marcos", t: "Paguei o extra pra tocar e valeu cada centavo.", s: 5 },
  { n: "Empresário", t: "O sigilo foi absoluto. Profissional.", s: 5 },
  { n: "Roberto", t: "O upgrade de 30 minutos vale a pena.", s: 5 },
  { n: "Carlos A.", t: "Pontual e educado. Gostei muito.", s: 5 },
  { n: "Lucas", t: "A mistura de força e suavidade é incrível.", s: 5 },
  { n: "Gustavo", t: "Ambiente, música e cheiro relaxantes.", s: 5 },
  { n: "Felipe", t: "Resolveu minha dor na lombar em uma sessão.", s: 5 },
  { n: "J.P.", t: "Corpo a corpo de verdade. Experiência única.", s: 5 },
  { n: "André", t: "Respeita os limites mas entrega prazer.", s: 5 },
  { n: "Breno", t: "Dormi na maca de tão bom.", s: 5 },
  { n: "Caio", t: "Sensação de liberdade total.", s: 5 },
  { n: "Vitor", t: "Me senti renovado.", s: 5 },
  { n: "Renan", t: "Extremamente educado e com papo bom.", s: 5 },
  { n: "Paulo", t: "O óleo morno faz toda diferença.", s: 5 },
  { n: "Ricardo", t: "Vale a pena esperar a agenda liberar.", s: 5 },
  { n: "Sérgio", t: "Nota 10. Nada a reclamar.", s: 5 },
  { n: "Fernando", t: "Paz de espírito e corpo relaxado.", s: 5 }
];

// --- TEXTOS ---
const TEXTS = {
  pt: {
    welcome: "Olá,",
    subtitle: "Vamos agendar seu momento de paz?",
    reviews_count: "Ver opiniões de clientes",
    reviews_title: "O que dizem sobre mim",
    choose_service: "1. Qual massagem você prefere?",
    duration: "minutos",
    currency: "R$",
    select_time_title: "2. Escolha o dia e horário",
    date_sub: "Toque no dia e depois no horário:",
    time_title: "Horários (09:00 às 20:00)",
    location_title: "3. Onde devo ir?",
    input_name: "Seu Nome",
    input_name_placeholder: "Digite seu nome",
    input_addr: "Endereço (Rua)",
    input_num: "Número",
    input_bairro: "Bairro",
    input_city: "Cidade",
    input_comp: "Complemento / Referência",
    input_hotel: "Nome do Hotel",
    input_room: "Número do Quarto",
    motel_note: "Para Motéis: Combinamos o local exato pelo WhatsApp.",
    pay_title: "4. Como prefere pagar?",
    pay_pix: "PIX",
    pay_card: "Cartão",
    pay_cash: "Dinheiro",
    extras_title: "Gostaria de incluir algo?",
    coupon_title: "Descontos Disponíveis",
    coupon_select: "Toque para usar cupom",
    coupon_none: "Sem cupons no momento",
    remove: "Remover",
    total_label: "Valor Total",
    book_btn: "ENVIAR PEDIDO NO ZAP",
    next_btn: "AVANÇAR",
    uber_note: "+ Taxa de deslocamento (Uber)",
    success_title: "Tudo pronto!",
    success_sub: "Seu pedido foi gerado. Envie a mensagem no WhatsApp para eu confirmar.",
    whatsapp_btn: "ENVIAR CONFIRMAÇÃO",
    back_home: "Voltar para o início",
    address_warn: "Preciso do endereço completo para chegar até você.",
    today: "Hoje",
    tomorrow: "Amanhã",
    popup_welcome_title: "Presente de Boas-Vindas!",
    popup_welcome_msg: "Você ganhou R$ 12,00 de desconto na sua primeira sessão.",
    popup_level_title: "Parabéns!",
    popup_level_msg: "Você atingiu um novo nível e ganhou um Cupom de R$ 20,00!",
    sold_out: "Esgotado",
    viewing_now: "pessoas vendo agora",
    
    services: {
      relaxante: { title: "Relaxante", subtitle: "Leve e Tranquila", desc: "Movimentos suaves para tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Sensitiva", subtitle: "Toque Pele com Pele", desc: "Uma massagem focada em sensações sutis e despertar o corpo." },
      mista: { title: "Completa", subtitle: "A Mais Pedida", desc: "Começa tirando a tensão muscular e termina com a parte sensitiva. Inclui finalização." }
    },
    
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo de massagem" },
      touch: { label: "Toque Interativo", sub: "Você pode tocar também" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais relaxantes" }
    },

    terms_body: [
      "1. Respeito: O atendimento é profissional. Qualquer conduta agressiva encerra a sessão.",
      "2. Higiene: Levo tudo higienizado. Prezo pela limpeza e segurança.",
      "3. Sigilo: Sua privacidade é total.",
      "4. Motel: A entrada do motel é por conta do cliente.",
      "5. Pagamento: É feito logo após o término da massagem."
    ],
    terms_title: "Importante Saber",
    terms_agree: "Li e concordo com as regras",
    terms_link: "Ler Regras",
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
    subtitle: "Let's book your moment of peace?",
    reviews_count: "See reviews",
    reviews_title: "Client Testimonials",
    choose_service: "1. Choose Session",
    duration: "min",
    currency: "R$",
    select_time_title: "2. Date & Time",
    date_sub: "Tap on the desired day:",
    time_title: "Available Hours",
    location_title: "3. Location",
    input_name: "Your Name",
    input_name_placeholder: "Type your name",
    input_addr: "Address (Street)",
    input_num: "Number",
    input_bairro: "District",
    input_city: "City",
    input_comp: "Unit/Apt",
    input_hotel: "Hotel Name",
    input_room: "Room Number",
    motel_note: "For Motels: We decide the place on WhatsApp.",
    pay_title: "4. Payment Method",
    pay_pix: "PIX",
    pay_card: "Card",
    pay_cash: "Cash",
    extras_title: "Include extras?",
    coupon_title: "Your Coupons",
    coupon_select: "Tap to select",
    coupon_none: "No coupons available",
    remove: "Remove",
    total_label: "Total Value",
    book_btn: "SEND REQUEST",
    next_btn: "NEXT STEP",
    uber_note: "+ Uber Fee (Round trip)",
    success_title: "All set!",
    success_sub: "Now just send the confirmation on WhatsApp.",
    whatsapp_btn: "SEND ON WHATSAPP",
    back_home: "Back to home",
    address_warn: "Please fill in the full address.",
    today: "Today",
    tomorrow: "Tomorrow",
    popup_welcome_title: "Welcome Gift!",
    popup_welcome_msg: "You got R$ 12.00 off your first session.",
    popup_level_title: "Congratulations!",
    popup_level_msg: "You reached a new level and earned a R$ 20.00 Coupon!",
    sold_out: "Sold Out",
    viewing_now: "viewing now",

    services: {
      relaxante: { title: "Relaxing", subtitle: "Light & Peaceful", desc: "Gentle movements to remove back weight and calm the mind." },
      sensitiva: { title: "Sensitive", subtitle: "Skin-to-Skin", desc: "A massage focused on subtle sensations and body awakening." },
      mista: { title: "Complete", subtitle: "Best Seller", desc: "Starts with muscle relaxation and ends with the sensitive part. Finishing included." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More massage time" },
      touch: { label: "Interactive Touch", sub: "You can touch too" },
      aroma: { label: "Aromaterapia", sub: "Relaxing essential oils" }
    },

    terms_body: [
      "1. Respect: Professional service.",
      "2. Hygiene: I value hygiene.",
      "3. Privacy: Guaranteed secrecy.",
      "4. Motel: Entrance fee is on the client.",
      "5. Payment: Done immediately after service."
    ],
    terms_title: "Good to Know",
    terms_agree: "I agree to the rules",
    terms_link: "Read Rules",
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
    { id: 'mista', min: 90, price: 205, icon: Zap, color: 'text-amber-400' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ]
};

// ==================================================================================
// 2. COMPONENTES DE UI (MODAIS E CARDS)
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-12 left-1/2 -translate-x-1/2 z-[130] transition-all duration-500 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
    <div className="bg-blue-600/95 backdrop-blur-md text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-lg border border-blue-400/30 whitespace-nowrap">
      <CheckCircle2 size={24} />
      <span>{msg}</span>
    </div>
  </div>
);

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-3 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={24}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide px-1">{children}</div>
      </div>
    </div>
  );
};

const RewardPopup = ({ isOpen, onClose, title, msg }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
            <div className="relative bg-gradient-to-br from-blue-900 to-zinc-900 border border-blue-500/50 p-8 rounded-[2rem] text-center max-w-sm w-full animate-scale-in shadow-[0_0_50px_rgba(37,99,235,0.3)]">
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce-slow">
                    <Gift size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4">{title}</h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-8">{msg}</p>
                <button onClick={onClose} className="w-full py-5 bg-white text-blue-900 font-bold rounded-xl text-xl hover:bg-blue-50 transition-colors">
                    Resgatar Agora
                </button>
            </div>
        </div>
    );
};

const ServiceCard = ({ s, selected, onClick, T }) => (
  <div onClick={onClick} className={`relative p-6 rounded-[24px] border-2 transition-all duration-200 cursor-pointer ${selected ? 'bg-blue-900/20 border-blue-500 shadow-xl' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-4 rounded-2xl ${selected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
        <s.icon size={32} />
      </div>
      {selected && <div className="bg-blue-500 text-white p-2 rounded-full"><Check size={20} strokeWidth={4}/></div>}
    </div>
    <div className="mb-4">
      <h3 className="text-2xl font-bold text-white mb-1">{T.services[s.id].title}</h3>
      <p className="text-base font-medium text-blue-400">{T.services[s.id].subtitle}</p>
    </div>
    <p className="text-base text-zinc-300 leading-relaxed mb-4 font-light">{T.services[s.id].desc}</p>
    <div className="flex items-center justify-between border-t border-white/10 pt-4">
      <span className="text-3xl font-bold text-white">{T.currency} {s.price}</span>
      <span className="text-sm text-zinc-500 font-bold uppercase">{s.min} {T.duration}</span>
    </div>
  </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  
  // Modais
  const [termsOpen, setTermsOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  
  const scrollRef = useRef(null);
  const T = TEXTS[lang]; // Atalho para Textos

  // --- 1. USUÁRIO (Load/Save) ---
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       const defaultState = { 
           name: '', 
           xp: 0, 
           coupons: [{ id: 'welcome', val: 12, title: 'Cupom Boas Vindas' }],
           savedAddress: { street: '', number: '', district: '', city: '', comp: '' }, 
           hasSeenWelcome: false 
       };
       return s ? { ...defaultState, ...JSON.parse(s) } : defaultState;
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // --- 2. AGENDAMENTO ---
  const [booking, setBooking] = useState({
    service: null, 
    extras: {}, 
    date: null, 
    time: null,
    locationType: 'home', 
    address: user.savedAddress || { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null, 
    termsAccepted: false
  });

  // Efeitos
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  
  useEffect(() => {
      // Abre popup de boas vindas se for novo
      if (!user.hasSeenWelcome && user.coupons.find(c => c.id === 'welcome')) {
          setTimeout(() => setWelcomePopup(true), 1500);
      }
  }, []);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // --- HELPER FUNCTIONS ---

  const closeWelcome = () => {
      setWelcomePopup(false);
      setUser(u => ({...u, hasSeenWelcome: true}));
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    let extrasTotal = 0;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            // Safe find
            const extraItem = DB.extras.find(e=>e.id===k);
            if(extraItem) {
                sub += extraItem.price;
                extrasTotal += extraItem.price;
            }
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { 
        service: booking.service.price,
        extras: extrasTotal,
        sub: sub, 
        disc: disc, 
        total: Math.max(0, sub - disc) 
    };
  }, [booking.service, booking.extras, booking.appliedCoupon]);

  const canProceed = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { street, number, comp, placeName, city } = booking.address;
      if (!user.name) return false;
      if (booking.locationType === 'home') return street && number && comp && city;
      if (booking.locationType === 'hotel') return placeName && city;
      return true; 
    }
    return !!booking.payment && booking.termsAccepted;
  };

  const nextStep = () => {
      if (step === 2 && booking.locationType === 'home') {
          // Auto-Save Address
          setUser(u => ({ ...u, name: user.name, savedAddress: booking.address }));
      }
      setStep(step + 1);
  };

  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) {
      updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }
    
    const newXP = user.xp + getFinancials.total;
    let leveledUp = false;
    
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), val: 20, title: 'Cupom de Retorno' });
        leveledUp = true;
    }
    
    setUser({ ...user, xp: newXP, coupons: updatedCoupons });
    if(leveledUp) setLevelUpPopup(true);
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setBooking({ 
        service: null, extras: {}, date: null, time: null, locationType: 'home', 
        address: user.savedAddress || { city: '', district: '', street: '', number: '', comp: '', placeName: '' }, 
        payment: '', appliedCoupon: null, termsAccepted: false 
    });
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    
    let locTxt = "";
    if(booking.locationType === 'home') locTxt = `🏠 *${T.zap.section_loc} (Casa)*\nEnd: ${booking.address.street}, ${booking.address.number}\nRef: ${booking.address.comp}\nBairro: ${booking.address.district} - ${booking.address.city}`;
    else if(booking.locationType === 'motel') locTxt = `🏩 *${T.zap.section_loc} (Motel)*\nVamos combinar o local.`;
    else locTxt = `🏨 *${T.zap.section_loc} (Hotel)*\nHotel: ${booking.address.placeName}\nQuarto: ${booking.address.comp}\nCidade: ${booking.address.city}`;

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => {
          const item = DB.extras.find(e => e.id === k);
          return item ? `+ ${T.extras_list[k].label} (R$ ${item.price})` : '';
      }).join('\n');

    const msg = `
${T.zap.greeting[1]}, Thalyson!
${T.zap.intro}

👤 *${user.name}*

${T.zap.section_serv}
• ${T.services[booking.service.id].title} (R$ ${f.service})
📅 ${dateStr} às ${booking.time}
${extrasTxt ? `${T.zap.item_extra}\n${extrasTxt}` : ''}

${locTxt}

${T.zap.section_fin}
${T.zap.subtotal} ${T.currency} ${f.sub},00
${f.disc > 0 ? `${T.zap.discount} - ${T.currency} ${f.disc},00` : ''}
${T.zap.uber_label} ${T.zap.uber_val}

✅ *${T.zap.total_pay} ${T.currency} ${f.total},00 + Uber*
${T.zap.payment} ${booking.payment.toUpperCase()}

*${T.zap.wait}*
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ==================================================================================
  // RENDER
  // ==================================================================================

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      <Toast show={toast.show} msg={toast.msg} />
      
      {/* Modais Globais */}
      <Modal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} title={T.terms_title}>
         <div className="space-y-6 text-lg text-zinc-300 leading-relaxed font-light">
            {T.terms_body.map((t,i)=><p key={i} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">{t}</p>)}
         </div>
         <button onClick={()=>setTermsOpen(false)} className="w-full mt-8 py-5 bg-blue-600 text-white font-bold rounded-2xl text-xl">{T.terms_btn}</button>
      </Modal>

      <Modal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} title={T.reviews_title}>
         <div className="space-y-4">
            {REVIEWS_DATA.map((r, i) => (
               <div key={i} className="p-5 rounded-2xl bg-white/5 border border-zinc-800">
                  <div className="flex justify-between mb-3">
                     <span className="font-bold text-blue-400 text-base">{r.n}</span>
                     <div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={14} fill="currentColor"/>)}</div>
                  </div>
                  <p className="text-base text-zinc-300 italic leading-relaxed">"{r.t}"</p>
               </div>
            ))}
         </div>
      </Modal>
      
      <RewardPopup isOpen={welcomePopup} onClose={closeWelcome} title={T.popup_welcome_title} msg={T.popup_welcome_msg} />
      <RewardPopup isOpen={levelUpPopup} onClose={()=>setLevelUpPopup(false)} title={T.popup_level_title} msg={T.popup_level_msg} />

      {/* HEADER */}
      <header className="h-24 px-8 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-blue-600/30">T.</div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-wide text-white">Thalyson</span>
            <span className="text-xs opacity-60 text-zinc-400 font-medium">Massoterapeuta</span>
          </div>
        </div>
        <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <Globe size={24} className="text-zinc-400"/>
        </button>
      </header>

      {/* PROGRESSO */}
      {step < 4 && (
        <div className="w-full h-1.5 bg-zinc-900 flex-shrink-0">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${((step+1)/4)*100}%` }} />
        </div>
      )}

      {/* AREA DE ROLAGEM */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-8 pb-40 scroll-smooth">
        <div className="max-w-md mx-auto space-y-12 animate-fade-in">

          {/* PASSO 0: SERVIÇOS */}
          {step === 0 && (
            <>
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-white leading-tight">{T.welcome} <br/><span className="text-blue-500">{user.name.split(' ')[0] || ''}</span></h1>
                <p className="text-xl text-zinc-400 font-light leading-relaxed">{T.subtitle}</p>
                <button onClick={() => setReviewsOpen(true)} className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-5 py-3 rounded-2xl w-full hover:bg-zinc-800 transition-colors">
                  <div className="flex text-amber-400 gap-1"><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/><Star size={16} fill="currentColor"/></div>
                  <span className="text-sm font-bold text-zinc-300">{T.reviews_count}</span>
                  <ArrowRight size={16} className="ml-auto text-zinc-600"/>
                </button>
              </div>

              <div className="space-y-6">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest pl-1">{T.choose_service}</h2>
                <div className="grid gap-6">
                  {DB.services.map(s => (
                    <ServiceCard key={s.id} s={s} T={T} selected={booking.service?.id === s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* PASSO 1: DATA E HORA */}
          {step === 1 && (
            <>
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-3">{T.select_time_title}</h2>
                <p className="text-lg text-zinc-400 font-light">{T.date_sub}</p>
              </div>

              <div className="space-y-8">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-8 px-8">
                  {[...Array(7)].map((_, i) => {
                    const d = new Date(); d.setDate(d.getDate() + i);
                    const isSel = booking.date?.toDateString() === d.toDateString();
                    let lbl = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3);
                    if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;

                    return (
                      <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                        className={`min-w-[90px] h-28 rounded-[28px] flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0
                          ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-xl scale-105' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                      >
                        <span className="text-xs uppercase font-bold tracking-widest mb-1">{lbl}</span>
                        <span className="text-4xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>

                <div className={`transition-all duration-500 ${booking.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                  <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center mb-6">{T.time_title}</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => {
                       let disabled = false;
                       if (booking.date) {
                          const now = new Date();
                          const [h] = time.split(':');
                          // Bloqueia se já passou da hora hoje
                          if (booking.date.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) disabled = true;
                       }
                       return (
                          <button key={time} disabled={disabled} onClick={() => setBooking({ ...booking, time })}
                            className={`py-5 rounded-2xl text-base font-bold border-2 transition-all
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
            </>
          )}

          {/* PASSO 2: LOCAL */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">{T.location_title}</h2>
              </div>

              <div className="flex bg-zinc-900 p-2 rounded-[24px] border border-zinc-800">
                {[{ id: 'home', label: 'Home', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-5 rounded-[20px] text-sm font-bold flex flex-col items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === type.id ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}
                  >
                    <type.icon size={24} /> {type.label}
                  </button>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                   <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_name}</label>
                   <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder={T.input_name_placeholder} className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700"/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-2xl flex gap-4 items-center">
                        <Info className="text-blue-400 shrink-0" size={24}/>
                        <p className="text-sm text-blue-100 font-medium">{T.address_warn}</p>
                    </div>
                    
                    <div>
                        <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_addr}</label>
                        <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div>
                           <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_num}</label>
                           <input type="tel" className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                       </div>
                       <div>
                           <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_bairro}</label>
                           <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       </div>
                    </div>
                    
                    <div>
                        <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_city}</label>
                        <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>

                    <div>
                        <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_comp}</label>
                        <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                    </div>
                  </div>
                )}

                {booking.locationType === 'motel' && (
                    <div className="p-8 rounded-[24px] bg-blue-900/20 border border-blue-500/30 text-blue-100 animate-fade-in text-center">
                        <MessageCircle size={40} className="mx-auto mb-4 text-blue-400"/>
                        <p className="text-lg font-medium leading-relaxed">{T.motel_note}</p>
                    </div>
                )}

                {booking.locationType === 'hotel' && (
                   <div className="space-y-6 animate-fade-in">
                      <div>
                          <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_hotel}</label>
                          <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_city}</label>
                              <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          </div>
                          <div>
                              <label className="text-sm font-bold text-zinc-400 ml-2 mb-2 block">{T.input_room}</label>
                              <input className="w-full p-6 rounded-[24px] bg-zinc-900 border border-zinc-800 text-lg text-white outline-none focus:border-blue-500 placeholder-zinc-700" value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                          </div>
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-10 border-t border-zinc-800 mt-10">
               <h3 className="text-sm font-bold uppercase text-zinc-500 mb-6">{T.extras_title}</h3>
               <div className="space-y-4">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-6 rounded-[24px] border-2 cursor-pointer transition-all ${booking.extras[extra.id] ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-900 border-zinc-800'}`}
                   >
                     <div className="flex items-center gap-5">
                       <div className={`p-4 rounded-2xl ${booking.extras[extra.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}><extra.icon size={24}/></div>
                       <div><p className="text-lg font-bold text-white">{T.extras_list[extra.id].label}</p><p className="text-sm text-zinc-400">{T.extras_list[extra.id].sub}</p></div>
                     </div>
                     <span className={`text-base font-bold ${booking.extras[extra.id] ? 'text-blue-400' : 'text-zinc-600'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* PASSO 3: RESUMO */}
        {step === 3 && (
          <div className="space-y-12 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-base font-bold text-zinc-500 hover:text-white transition-colors"><ChevronLeft size={24}/> Voltar</button>
             
             <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 relative overflow-hidden shadow-2xl">
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-center pb-6 border-b border-zinc-800">
                    <span className="font-bold text-2xl text-white">{T.services[booking.service.id].title}</span>
                    <span className="font-bold text-2xl text-white">{T.currency} {booking.service.price}</span>
                  </div>
                  
                  {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                    <div key={k} className="flex justify-between text-lg text-zinc-400">
                      <span>+ {T.extras_list[k].label}</span>
                      {/* Safety Check para evitar crash se o extra não existir no DB */}
                      <span>{T.currency} {DB.extras.find(e => e.id === k)?.price || 0}</span>
                    </div>
                  ))}

                  {/* CUPOM */}
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
                    <div className="flex items-center gap-3 text-base font-bold text-zinc-300 mb-4">
                        <Ticket size={24} className="text-blue-500"/> {T.coupon_title}
                    </div>
                    {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <div className="flex justify-between items-center bg-green-900/20 p-4 rounded-xl border border-green-500/30">
                            <span className="text-green-400 font-bold">{booking.appliedCoupon.title}</span>
                            <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-sm text-red-400 font-bold underline">{T.remove}</button>
                        </div>
                      ) : (
                        <select 
                            onChange={(e) => {
                                const c = user.coupons.find(coup => String(coup.id) === e.target.value);
                                setBooking({...booking, appliedCoupon: c});
                            }} 
                            className="w-full bg-zinc-800 text-white p-4 rounded-xl outline-none text-base"
                        >
                           <option value="">{T.coupon_select}</option>
                           {user.coupons.map(c => <option key={c.id} value={c.id}>R$ {c.val} OFF - {c.title}</option>)}
                        </select>
                      )
                    ) : <p className="text-zinc-600 text-sm">{T.coupon_none}</p>}
                  </div>

                  {booking.appliedCoupon && (
                    <div className="flex justify-between text-lg text-green-400 font-bold">
                      <span>Desconto</span>
                      <span>- {T.currency} {booking.appliedCoupon.val}</span>
                    </div>
                  )}

                  <div className="pt-6 border-t border-zinc-800 flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-zinc-500 uppercase">{T.total_label}</span>
                      <span className="text-5xl font-black text-white">{T.currency} {getFinancials.total}</span>
                    </div>
                    <p className="text-amber-500 text-sm font-bold flex items-center gap-2 justify-end"><Car size={16}/> {T.uber_note}</p>
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                <h3 className="text-lg font-bold text-zinc-400 ml-2">{T.pay_title}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                    <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                      className={`flex flex-col items-center justify-center gap-3 py-8 rounded-[24px] border-2 transition-all duration-200 ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white shadow-xl' : 'bg-zinc-900 border-zinc-800 text-zinc-400'}`}
                    >
                      <p.i size={32}/> <span className="text-sm font-bold uppercase">{p.l}</span>
                    </button>
                  ))}
                </div>
             </div>

             <div className="flex items-start gap-5 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 cursor-pointer" onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})}>
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 mt-1 ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-600'}`}>
                   {booking.termsAccepted && <Check size={20} strokeWidth={4} />}
                </div>
                <p className="text-base text-zinc-300 leading-relaxed">
                   {T.terms_agree} <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="font-bold underline text-blue-400 cursor-pointer">{T.terms_link}</span>.
                </p>
             </div>
          </div>
        )}

        {/* PASSO 4: SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-24 animate-scale-in text-center h-full">
                <div className="w-32 h-32 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.4)] mb-10 animate-bounce-slow">
                   <Check size={64} className="text-zinc-950" strokeWidth={4}/>
                </div>
                
                <h1 className="text-5xl font-black text-white mb-6">{T.success_title}</h1>
                <p className="text-xl text-zinc-400 max-w-[320px] mx-auto leading-relaxed mb-16">{T.success_sub}</p>
                
                <button onClick={openZap} className="w-full py-6 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-3xl text-xl shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all">
                  <MessageCircle size={32} fill="white"/> {T.whatsapp_btn}
                </button>
                
                <button onClick={reset} className="mt-12 text-sm font-bold text-zinc-500 hover:text-white uppercase tracking-widest p-4">
                    {T.back_home}
                </button>
            </div>
        )}
        </div>
      </main>

      {/* FOOTER FIXO (AÇÃO) */}
      {step < 4 && (
          <div className="h-32 flex-shrink-0 flex items-center justify-center px-8 border-t border-zinc-800 bg-zinc-950/90 backdrop-blur-xl pb-6">
             <div className="w-full max-w-md flex items-center gap-6">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in">
                      <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{T.total_label}</span>
                      <span className="block text-4xl font-black text-white">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!canProceed()}
                   onClick={() => step === 3 ? finishBooking() : nextStep()}
                   className={`h-20 rounded-[24px] font-bold flex items-center justify-center gap-4 px-8 transition-all active:scale-95 shadow-lg flex-1 text-lg
                     ${!canProceed() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
                >
                   {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={28}/>}
                </button>
             </div>
          </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .animate-fade-in { animation: fadeIn 0.8s ease-out; } 
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); } 
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); } 
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } 
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
