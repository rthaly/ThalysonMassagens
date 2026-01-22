import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v14_final', // Chave atualizada
  XP_TARGET: 500, 
};

const TEXTS = {
  pt: {
    welcome: "Bem-vindo",
    subtitle: "Seu momento de paz e prazer começa agora.",
    reviews_btn: "Ler todas as 50+ avaliações",
    reviews_title: "O que dizem sobre mim",
    choose_service: "Escolha sua Experiência",
    duration: "de sessão",
    investment: "Valor",
    date_title: "Agendamento",
    date_sub: "Qual o melhor dia para você?",
    time_title: "Horários Livres",
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
    success_msg: "Seu horário está pré-reservado. Envie a mensagem abaixo no WhatsApp para confirmar.",
    btn_zap: "ENVIAR CONFIRMAÇÃO",
    motel_warn: "Combinamos o Motel pelo WhatsApp. (A entrada é por conta do cliente).",
    coupon_label: "Carteira de Cupons",
    coupon_select: "Selecionar...",
    coupon_none: "Nenhum cupom ativo",
    remove: "Remover",
    hotel_name: "Nome do Hotel",
    room: "Quarto",
    comp_placeholder: "Complemento / Ponto de Referência (Obrigatório)",
    address_warn: "Preencha todo o endereço para eu chegar até você.",
    
    services: {
      relaxante: { title: "Massagem Relaxante", desc: "Movimentos leves, contínuos e envolventes. Foco total em tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Massagem Sensitiva", desc: "Experiência de pele com pele. Toques sutis que despertam a sensibilidade de cada centímetro do corpo." },
      mista: { title: "Massagem Completa", desc: "A união perfeita: começa relaxando a tensão muscular e termina com a parte sensitiva intensa e finalização profunda." }
    },
    
    extras: {
      more_time: { label: "+30 Minutos", desc: "Estender a sessão" },
      touch: { label: "Toque Interativo", desc: "Troca de toques permitida" },
      aroma: { label: "Aromaterapia", desc: "Óleos essenciais" }
    },

    terms_body: [
      "1. Respeito Mútuo: O atendimento é profissional. Qualquer conduta agressiva ou desrespeitosa encerrará a sessão imediatamente.",
      "2. Higiene : Prezo pela higiene",
      "3. Sigilo Absoluto: Sua privacidade é garantida. O que acontece na sessão, fica na sessão.",
      "4. Taxas Externas: Em caso de atendimento em Motel, a taxa de entrada/período é de responsabilidade do cliente.",
      "5. Pagamento: O pagamento deve ser realizado integralmente logo após a prestação do serviço."
    ],
    terms_btn: "Entendi e Concordo",

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Gostaria de confirmar:",
      client: "Cliente",
      service: "Serviço",
      extras: "Extras",
      location: "Local",
      home_title: "Em Casa",
      motel_title: "Motel",
      motel_desc: "Vamos decidir juntos. (Entrada por minha conta)",
      hotel_title: "Hotel",
      room: "Quarto",
      total: "Total",
      payment: "Pag",
      wait: "Aguardo retorno!"
    }
  },
  en: {
    welcome: "Welcome",
    subtitle: "Your moment of peace and pleasure starts now.",
    reviews_btn: "Read all 50+ reviews",
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

    services: {
      relaxante: { title: "Relaxing Massage", desc: "Light, continuous, and enveloping movements. Total focus on removing back weight and calming the mind." },
      sensitiva: { title: "Sensitive Massage", desc: "Skin-to-skin experience. Subtle touches that awaken the sensitivity of every inch of the body." },
      mista: { title: "Complete Massage", desc: "The perfect union: starts by relaxing muscle tension and ends with intense sensitive part." }
    },

    extras: {
      more_time: { label: "+30 Minutes", desc: "Extend the session" },
      touch: { label: "Interactive Touch", desc: "Touch exchange allowed" },
      aroma: { label: "Aromatherapy", desc: "Essential oils" }
    },

    terms_body: [
      "1. Mutual Respect: The service is professional. Any aggressive or disrespectful conduct will end the session immediately.",
      "2. Hygiene: I value maximum hygiene.",
      "3. Absolute Secrecy: Your privacy is guaranteed. What happens in the session, stays in the session.",
      "4. External Fees: In case of Motel service, the entrance/period fee is the client's responsibility.",
      "5. Payment: Payment must be made in full immediately after the service is provided."
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
      motel_desc: "We decide together. (Fee on me)",
      hotel_title: "Hotel",
      room: "Room",
      total: "Total",
      payment: "Pay",
      wait: "Waiting for reply!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', time: '1h', price: 145, xp: 145, icon: Wind, badge: null },
    { id: 'sensitiva', time: '1h', price: 175, xp: 175, icon: Flame, badge: '🔥' },
    { id: 'mista', time: '1h', price: 210, xp: 210, icon: Zap, badge: '✨' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ],
  reviews: [
    { name: "Lucas (Londrina)", text: "Mano, que sensação. Jorrei muito no final, foi insano. O cara sabe o que faz.", stars: 5 },
    { name: "Ricardo (SP)", text: "A sensitiva dele é outro patamar. Gozei horrores e relaxei demais.", stars: 5 },
    { name: "Felipe (Jales)", text: "Relaxou até minha alma. Mão pesada na medida certa, tirou toda dor.", stars: 5 },
    { name: "Gustavo (Santa Fé)", text: "O toque é elétrico. Fiquei tremendo depois.", stars: 5 },
    { name: "André (Londrina)", text: "Curti a massagem, técnica boa, mas o ar tava meio gelado no dia.", stars: 4 },
    { name: "M. Oliveira (SP)", text: "Simpático e discreto. A finalização foi top, recomendo.", stars: 5 },
    { name: "Bruno (Jales)", text: "Nunca tinha sentido isso. Recomendo a mista pra quem quer tudo.", stars: 5 },
    { name: "Carlos (Londrina)", text: "Bom profissional, mas atrasou 5 minutinhos. De resto, ok.", stars: 4 },
    { name: "Júnior (SP)", text: "Cara, sai flutuando. O óleo quente é vida.", stars: 5 },
    { name: "Anônimo (Santa Fé)", text: "Me deixou muito à vontade. Gozei rápido demais kkk vergonha.", stars: 5 },
    { name: "Pedro (Londrina)", text: "Experiência única. Vale cada centavo investido.", stars: 5 },
    { name: "Thiago (SP)", text: "Achei 1h pouco, devia ter pego 1h30 direto.", stars: 3 },
    { name: "Vitor (Jales)", text: "Energia surreal. O cara é brabo na técnica.", stars: 5 },
    { name: "Leandro (Santa Fé)", text: "Gostei da playlist e da massagem. Tudo 100%.", stars: 5 },
    { name: "R. Gomes (Londrina)", text: "Profissional raro. Respeitador e safado na medida certa.", stars: 5 },
    { name: "Eduardo (SP)", text: "Tudo higienizado e cheiroso. Voltarei com certeza.", stars: 5 },
    { name: "Sérgio (Jales)", text: "Mão de seda. Relaxamento real, quase dormi.", stars: 5 },
    { name: "Caio (Santa Fé)", text: "Me senti um rei. Atendimento VIP do começo ao fim.", stars: 5 },
    { name: "D. Santos (Londrina)", text: "Faz tudo no tempo certo, sem pressa. Gostei.", stars: 5 },
    { name: "Fábio (SP)", text: "Ótimo papo e massagem melhor ainda. Virei cliente.", stars: 5 },
    { name: "Marcos (Jales)", text: "A mista vale muito a pena. Sai renovado.", stars: 5 },
    { name: "Júlio C. (Santa Fé)", text: "Toque envolvente demais. Recomendo.", stars: 5 },
    { name: "Renato (Londrina)", text: "Foi no meu hotel, levou a maca, tudo 10.", stars: 5 },
    { name: "Alex (SP)", text: "Tirou meu stress da semana toda. Mãos mágicas.", stars: 5 },
    { name: "Paulo (Jales)", text: "Técnica suave excelente para quem tem dor.", stars: 5 },
    { name: "G. F. (Santa Fé)", text: "Top demais. O final é explosivo.", stars: 5 },
    { name: "Luan (Londrina)", text: "Atencioso aos detalhes. Percebeu onde eu tinha dor.", stars: 5 },
    { name: "Fernando (SP)", text: "Massagem calma, sem dor. Dormi na metade.", stars: 5 },
    { name: "Roberto (Jales)", text: "Gente boa demais, super educado.", stars: 5 },
    { name: "Diego (Santa Fé)", text: "Experiência tântrica de verdade. Conexão total.", stars: 5 },
    { name: "Arthur (Londrina)", text: "Superou expectativas. Gozei litros no final.", stars: 5 },
    { name: "B. Lima (SP)", text: "Ótimo custo benefício pela qualidade.", stars: 5 },
    { name: "César (Jales)", text: "Mãos quentes, óleo top.", stars: 5 },
    { name: "Daniel (Santa Fé)", text: "Profissionalismo 1000. Confio de olhos fechados.", stars: 5 },
    { name: "Elias (Londrina)", text: "Tudo organizado. Gostei.", stars: 5 },
    { name: "Gabriel (SP)", text: "Sabe deixar à vontade. Amei a experiência.", stars: 5 },
    { name: "Hélio (Jales)", text: "Massagem completa mesmo. Corpo todo.", stars: 5 },
    { name: "Igor (Santa Fé)", text: "Outra pessoa depois da sessão. Leve.", stars: 5 },
    { name: "João P. (Londrina)", text: "Vale a pena a de 1h30. Passa rápido.", stars: 5 },
    { name: "Kevin (SP)", text: "Melhor da região. Sem dúvidas.", stars: 5 },
    { name: "Leonardo (Jales)", text: "Técnica refinada, estudada.", stars: 5 },
    { name: "Mário (Santa Fé)", text: "Voltarei em breve. Viciei.", stars: 5 },
    { name: "Natan (Londrina)", text: "Desestressante total.", stars: 5 },
    { name: "Otávio (SP)", text: "Sem atrasos. Pontual.", stars: 5 },
    { name: "P. R. (Jales)", text: "Mãos abençoadas.", stars: 5 },
    { name: "Rafael (Santa Fé)", text: "Muito respeitoso.", stars: 5 },
    { name: "Samuel (Londrina)", text: "Show de bola.", stars: 5 },
    { name: "Túlio (SP)", text: "Gostei da música e do clima.", stars: 5 },
    { name: "Ulisses (Jales)", text: "Sério e competente.", stars: 5 },
    { name: "Valdir (Santa Fé)", text: "Melhor hora do dia.", stars: 5 },
    { name: "William (Londrina)", text: "Preço justo pelo serviço.", stars: 4 }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS (MODAIS E UI)
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative w-full max-w-md p-8 rounded-3xl max-h-[80vh] flex flex-col animate-scale-in ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}`}>
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
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
       <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
       <div className={`relative w-full h-[90%] md:max-w-lg rounded-[2rem] flex flex-col animate-slide-up overflow-hidden ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
          <div className={`flex justify-between items-center p-6 border-b flex-shrink-0 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
             <h2 className="text-xl font-bold flex items-center gap-2"><Star className="text-amber-400" fill="currentColor"/> {T.reviews_title}</h2>
             <button onClick={onClose} className="p-2 bg-black/5 rounded-full"><X/></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
             {reviews.map((r, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-blue-100 shadow-sm'}`}>
                   <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-blue-500">{r.name}</span>
                      <div className="flex text-amber-400 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                   </div>
                   <p className="text-sm opacity-70 leading-relaxed italic">"{r.text}"</p>
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
  
  // Reset Scroll
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
    if (!booking.service) return { sub: 0, total: 0 };
    const sPrice = booking.service.price;
    const ePrice = Object.keys(booking.extras).reduce((acc, key) => 
      booking.extras[key] ? acc + DB.extras.find(e => e.id === key).price : acc, 0
    );
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sPrice + ePrice - disc);
    return { sub: sPrice + ePrice, disc, total };
  }, [booking.service, booking.extras, booking.appliedCoupon]);

  const generateZap = () => {
    const { total } = getFinancials;
    const dateStr = booking.date ? booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const h = new Date().getHours();
    
    let greeting = "";
    if (h < 12) greeting = T.zap.greeting[0];
    else if (h < 18) greeting = T.zap.greeting[1];
    else greeting = T.zap.greeting[2];
    
    let localMsg = "";
    let mapsLink = "";
    
    // Serviço Traduzido
    const serviceName = booking.service ? T.services[booking.service.id].title : "";

    if (booking.locationType === 'home') {
      localMsg = `🏠 *${T.zap.home_title}*\n${booking.address.street}, ${booking.address.number}\n${booking.address.district} - ${booking.address.city}\n_(Ref: ${booking.address.comp})_`;
      const query = `${booking.address.street}, ${booking.address.number}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    } else if (booking.locationType === 'motel') {
      localMsg = `🏩 *${T.zap.motel_title}*\n${T.zap.motel_desc}`;
      mapsLink = "";
    } else {
      localMsg = `🏨 *${T.zap.hotel_title}*\n${booking.address.placeName}\n${booking.address.city}\n_(${T.zap.room}: ${booking.address.comp || '?'})_`;
      const query = `${booking.address.placeName}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => `+ ${T.extras[k].label}`).join('\n');

    const msg = `
${greeting}, Thalyson!
${T.zap.intro}

👤 *${T.zap.client}:* ${user.name}

💆‍♂️ *${T.zap.service}:* ${serviceName}
📅 ${dateStr} @ ${booking.time}

${extrasTxt ? `✨ *${T.zap.extras}:*\n${extrasTxt}\n` : ''}
📍 *${T.zap.location}:*
${localMsg}
${mapsLink ? `🔗 Maps: ${mapsLink}` : ''}

💰 *${T.zap.total}:* R$ ${total},00
💳 *${T.zap.payment}:* ${booking.payment === 'pix' ? 'PIX' : booking.payment === 'card' ? 'Cartão/Card' : 'Dinheiro/Cash'}

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
      if (booking.locationType === 'home' && (!city || !street || !number || !comp)) return false;
      if (booking.locationType === 'hotel' && (!city || !placeName)) return false;
      return true;
    }
    return true; 
  };

  const handleFinish = () => {
    if (!booking.payment) return showToast(T.payment_title);
    if (!booking.termsAccepted) return showToast("Terms / Termos");

    const earnedXP = getFinancials.total;
    const newTotalXP = user.xp + earnedXP;
    
    // REMOVE CUPOM USADO
    let updatedCoupons = [...user.coupons];
    if(booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }

    // GAMIFICACAO
    if (Math.floor(newTotalXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), title: 'Recompensa VIP', val: 20, isNew: true });
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
        appliedCoupon: null, // GARANTE QUE VOLTA ZERADO
        termsAccepted: false
      });
  };

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
       <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.6)]">T.</div>
    </div>
  );

  return (
    <div className={`h-[100dvh] w-full overflow-hidden flex flex-col font-sans transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-blue-50' : 'bg-slate-50 text-slate-900'}`}>
      
      <Toast show={toast.show} msg={toast.msg} />
      <TermsModal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} isDark={isDark} T={T} />
      <ReviewsModal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} isDark={isDark} reviews={DB.reviews} T={T} />
      
      {/* MENU LATERAL */}
      {menuOpen && (
          <div className="fixed inset-0 z-[60] flex justify-start">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
             <div className={`relative w-4/5 max-w-xs h-full p-8 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-10">
                   <h2 className="font-bold text-2xl text-blue-500">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)} className="p-2 rounded-full hover:bg-white/10"><X size={24}/></button>
                </div>
                
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl relative overflow-hidden">
                    <Trophy className="absolute -right-4 -bottom-4 text-white/20" size={100} />
                    <p className="text-xs font-bold uppercase opacity-80 mb-1">XP Level</p>
                    <h3 className="text-4xl font-black mb-4">{user.xp}</h3>
                    <div className="w-full h-2 bg-black/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: `${(user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET * 100}%` }}></div>
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                   <button onClick={()=>setLang(lang==='pt'?'en':'pt')} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      <Globe size={20}/> <span>{lang === 'pt' ? 'English' : 'Português'}</span>
                   </button>
                   <button onClick={()=>setIsDark(!isDark)} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      {isDark ? <Sun size={20}/> : <Moon size={20}/>} <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                   </button>
                   <button onClick={handleShare} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      <Share2 size={20}/> <span>Share App</span>
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
      <header className={`h-20 flex-shrink-0 flex items-center justify-between px-6 border-b backdrop-blur-md transition-colors duration-500 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-blue-100'}`}>
        <div className="flex items-center gap-4">
          <button onClick={()=>setMenuOpen(true)} className={`p-3 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-blue-50 text-blue-900'}`}><Menu size={24}/></button>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-wide">Thalyson Massagens</span>
            <span className="text-[10px] opacity-60 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"/> Online</span>
          </div>
        </div>
        <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-3 rounded-full border transition-all hover:scale-105 ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-blue-100 bg-white text-blue-600'}`}><Instagram size={20}/></a>
      </header>

      {/* PROGRESS BAR */}
      {step < 4 && (
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-900 flex-shrink-0">
          <div className="h-full bg-blue-600 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(37,99,235,0.4)]" style={{ width: `${((step+1)/4)*100}%` }} />
        </div>
      )}

      {/* CONTEÚDO COM SCROLL */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 scroll-smooth">
        <div className="max-w-md mx-auto animate-fade-in">
        
        {/* STEP 0: SERVIÇOS & AVALIAÇÕES */}
        {step === 0 && (
          <div className="space-y-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">{T.welcome}, {user.name.split(' ')[0] || ''}</h1>
              <p className="text-base opacity-70 font-light max-w-[280px] leading-relaxed">{T.subtitle}</p>
            </div>
            
            <div className="space-y-6">
              {DB.services.map((s) => (
                <div key={s.id} onClick={() => setBooking({ ...booking, service: s })}
                  className={`relative p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 active:scale-95 group overflow-hidden
                    ${booking.service?.id === s.id 
                      ? 'border-blue-500 bg-blue-500/5 shadow-2xl shadow-blue-500/10' 
                      : `border-transparent ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white shadow-lg hover:shadow-xl'}`
                    }`}
                >
                   {s.badge && <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-wider shadow-lg">{s.badge}</span>}
                   
                   <div className="flex justify-between items-start mb-6 mt-2">
                      <div className="p-4 rounded-2xl bg-blue-100/10 text-blue-500 ring-1 ring-blue-500/20"><s.icon size={28} /></div>
                      <div className="text-right pr-2">
                        <span className="block text-3xl font-bold tracking-tight">R$ {s.price}</span>
                        <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">{T.investment}</span>
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-2xl mb-3">{T.services[s.id].title}</h3>
                   <p className="text-sm opacity-70 leading-relaxed font-light">{T.services[s.id].desc}</p>
                   
                   <div className="mt-6 pt-4 border-t border-dashed border-zinc-500/10 flex items-center gap-2 text-xs opacity-50 font-medium">
                      <Clock size={14}/> {s.time} {T.duration}
                   </div>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
                <div className="flex items-center justify-between mb-4 px-2">
                    <h3 className="text-sm font-bold uppercase tracking-widest opacity-50">{T.reviews_title}</h3>
                    <div className="flex text-amber-400 gap-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                </div>

                <div className="space-y-3 mb-6">
                    {DB.reviews.slice(0, 3).map((r, i) => (
                        <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-blue-50'}`}>
                             <p className="text-xs italic opacity-70 mb-2 line-clamp-2">"{r.text}"</p>
                             <div className="flex justify-between items-center">
                                 <span className="text-[10px] font-bold uppercase text-blue-500">{r.name}</span>
                                 <div className="flex text-amber-400 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={8} fill="currentColor"/>)}</div>
                             </div>
                        </div>
                    ))}
                </div>

                <button onClick={() => setReviewsOpen(true)} className={`w-full py-4 rounded-2xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${isDark ? 'border-zinc-800 hover:bg-zinc-800' : 'border-blue-100 hover:bg-blue-50 text-blue-600'}`}>
                    <MessageCircle size={18}/> {T.reviews_btn}
                </button>
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="space-y-10 animate-slide-in">
             <button onClick={()=>setStep(0)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-500 mb-2">{T.date_title}</h2>
                <p className="text-sm opacity-60">{T.date_sub}</p>
             </div>

             <div className="space-y-4">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date(); d.setDate(d.getDate() + offset);
                    const isSelected = booking.date?.toDateString() === d.toDateString();
                    return (
                      <button key={offset} onClick={() => setBooking({ ...booking, date: d, time: null })}
                        className={`min-w-[5.5rem] h-[7rem] rounded-[24px] flex flex-col items-center justify-center gap-2 transition-all border-2 flex-shrink-0
                          ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 scale-105' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-100 text-zinc-400'}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3)}</span>
                        <span className="text-3xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className={`transition-all duration-500 ${booking.date ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
                <h3 className="text-xs font-bold uppercase opacity-40 mb-6 text-center">{T.time_title}</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['09:00', '10:00', '11:00', '13:00', '15:00', '18:00', '19:00', '20:00'].map((time) => {
                     let disabled = false;
                     if (booking.date) {
                        const now = new Date();
                        const [h] = time.split(':');
                        if (booking.date.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) disabled = true;
                     }
                     return (
                        <button key={time} disabled={disabled} onClick={() => setBooking({ ...booking, time })}
                          className={`py-4 rounded-2xl text-xs font-bold border transition-all
                            ${booking.time === time 
                                ? 'bg-white text-blue-900 border-white shadow-lg scale-110 z-10' 
                                : disabled ? 'opacity-20 line-through cursor-not-allowed border-transparent' : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}
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
             <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Voltar</button>
             
             <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-500 mb-2">{T.location_title}</h2>
                <p className="text-sm opacity-60">{T.location_sub}</p>
             </div>

             <div className={`p-1.5 rounded-[24px] flex ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                {[{ id: 'home', label: 'Home', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-4 rounded-[20px] text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === type.id ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}
                  >
                    <type.icon size={16} /> {type.label}
                  </button>
                ))}
             </div>

             <div className="space-y-4">
                <div className={`flex items-center px-6 rounded-[24px] border transition-colors focus-within:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                   <User size={18} className="opacity-40 mr-4"/>
                   <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder={T.name_placeholder} className="w-full py-6 bg-transparent outline-none text-sm font-medium"/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-xs font-bold text-amber-500 flex items-center gap-1 pl-2"><Info size={12}/> {T.address_warn}</p>
                    <div className="grid grid-cols-[1fr_80px] gap-4">
                       <input placeholder="Rua / Avenida" className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                       <input type="tel" placeholder="Nº" className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input placeholder="Bairro" className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       <input placeholder="Cidade" className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>
                    <input 
                        placeholder={T.comp_placeholder} 
                        className={`w-full p-6 rounded-[24px] border text-sm outline-none border-blue-500/30 focus:border-blue-500 ${isDark ? 'bg-zinc-900' : 'bg-white'}`} 
                        value={booking.address.comp} 
                        onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} 
                    />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                    <div className="p-6 rounded-[24px] bg-blue-500/10 border border-blue-500/20 text-blue-500 animate-fade-in flex gap-4 items-center">
                        <Info size={24} className="shrink-0"/>
                        <p className="text-xs font-medium leading-relaxed">{T.motel_warn}</p>
                    </div>
                )}

                {booking.locationType === 'hotel' && (
                   <div className="space-y-4 animate-fade-in">
                      <input placeholder={T.hotel_name} className={`w-full p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                       <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Cidade" className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          <input placeholder={T.room} className={`p-6 rounded-[24px] border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-8">
               <h3 className="text-xs font-bold uppercase opacity-40 mb-6 ml-1">{T.extras_title}</h3>
               <div className="space-y-3">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-5 rounded-[24px] border cursor-pointer transition-all ${booking.extras[extra.id] ? 'border-blue-500 bg-blue-500/5' : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-3 rounded-full ${booking.extras[extra.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}><extra.icon size={18}/></div>
                       <div><p className="text-sm font-bold">{T.extras[extra.id].label}</p><p className="text-[11px] opacity-60">{T.extras[extra.id].desc}</p></div>
                     </div>
                     <span className={`text-sm font-bold ${booking.extras[extra.id] ? 'text-blue-500' : 'opacity-30'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="space-y-10 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Voltar</button>
             
             <div className="text-center">
                <h2 className="text-3xl font-bold text-blue-500">{T.resume_title}</h2>
             </div>

             <div className={`rounded-[2rem] border overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="p-8 space-y-4">
                   <div className="flex justify-between items-center text-lg font-bold"><span>{T.services[booking.service.id].title}</span><span>R$ {booking.service.price}</span></div>
                   
                   {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                     <div key={k} className="flex justify-between items-center text-sm opacity-60"><span>+ {T.extras[k].label}</span><span>R$ {DB.extras.find(e => e.id === k).price}</span></div>
                   ))}
                   
                   {booking.appliedCoupon && (
                     <div className="flex justify-between items-center text-sm font-bold text-blue-500 bg-blue-500/10 p-3 rounded-xl">
                        <span>{booking.appliedCoupon.title}</span>
                        <span>- R$ {booking.appliedCoupon.val}</span>
                     </div>
                   )}
                   
                   <div className="border-t border-dashed border-zinc-500/20 my-2 pt-6 flex justify-between items-center">
                      <span className="text-lg font-black opacity-80">Total</span>
                      <span className="text-4xl font-black text-blue-500">R$ {getFinancials.total}</span>
                   </div>
                </div>
                
                {/* SELECTOR DE CUPOM CORRIGIDO */}
                <div className="bg-black/5 p-6 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-xs font-bold opacity-60"><Ticket size={18} /> <span>{T.coupon_label}:</span></div>
                   {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-lg"><Trash2 size={14}/> {T.remove}</button>
                      ) : (
                        <select 
                            onChange={(e) => {
                                const c = user.coupons.find(coup => String(coup.id) === e.target.value);
                                setBooking({...booking, appliedCoupon: c});
                            }} 
                            className="bg-transparent text-sm font-bold text-blue-500 outline-none cursor-pointer uppercase tracking-wider text-right w-40"
                        >
                           <option value="">{T.coupon_select}</option>
                           {user.coupons.map(c => <option key={c.id} value={c.id}>R$ {c.val} - {c.title}</option>)}
                        </select>
                      )
                   ) : <span className="text-xs opacity-40">{T.coupon_none}</span>}
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase opacity-40 ml-1">{T.payment_title}</h3>
                <div className="grid grid-cols-3 gap-3">
                   {[{ id: 'pix', label: 'PIX', icon: QrCode }, { id: 'card', label: 'Cartão', icon: CreditCard }, { id: 'money', label: 'Cash', icon: Banknote }].map((p) => (
                     <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                       className={`flex flex-col items-center justify-center gap-2 py-6 rounded-[24px] border transition-all duration-300 ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 scale-105' : isDark ? 'bg-zinc-900 border-zinc-800 opacity-60 hover:opacity-100' : 'bg-white border-zinc-200 opacity-60 hover:opacity-100'}`}
                     >
                       <p.icon size={24} /> <span className="text-[10px] font-black uppercase tracking-wider">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <div onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})} className={`cursor-pointer w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : 'border-zinc-500'}`}>
                   {booking.termsAccepted && <Check size={16} strokeWidth={4} />}
                </div>
                <p className="text-xs opacity-60 leading-relaxed">
                   {T.terms_agree} <span onClick={()=>setTermsOpen(true)} className="font-bold underline text-blue-500 cursor-pointer hover:text-blue-400">{T.terms_link}</span>.
                </p>
             </div>
          </div>
        )}

        {/* STEP 4: SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-16 animate-scale-in text-center h-full">
                <div className="relative mb-10">
                     <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-30 rounded-full animate-pulse"></div>
                     <div className="w-32 h-32 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                        <Check size={64} className="text-white" strokeWidth={5}/>
                     </div>
                </div>
                
                <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">{T.success_title}</h1>
                <p className="text-lg opacity-60 max-w-[300px] mx-auto mb-16 font-light leading-relaxed">
                    {T.success_msg}
                </p>

                <a href={generateZap()} target="_blank" rel="noreferrer" 
                   className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl text-xl shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 animate-bounce-slow transition-transform active:scale-95">
                    <MessageCircle size={28} fill="currentColor"/> {T.btn_zap}
                </a>
                
                <button onClick={handleReset} className="mt-12 text-xs font-bold opacity-40 hover:opacity-100 uppercase tracking-widest">
                    Voltar ao início
                </button>
            </div>
        )}
        </div>
      </main>

      {/* FOOTER FIXO */}
      {step < 4 && (
          <div className={`h-24 flex-shrink-0 flex items-center justify-center px-6 border-t backdrop-blur-xl transition-all duration-500 ${isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-zinc-200'}`}>
             <div className="w-full max-w-md flex items-center gap-6">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in">
                      <span className="block text-[10px] font-bold uppercase opacity-40 tracking-wider mb-1">Total</span>
                      <span className="block text-3xl font-black text-blue-500">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!isStepValid()}
                   onClick={() => step === 3 ? handleFinish() : setStep(step + 1)}
                   className={`h-16 rounded-[24px] font-bold flex items-center justify-center gap-3 px-10 transition-all active:scale-95 shadow-lg
                     ${step < 3 ? 'flex-1 ml-auto' : 'w-full'} 
                     ${!isStepValid() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 shadow-none' 
                        : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'}`}
                >
                   {step === 3 ? T.btn_finish : T.btn_continue}
                   {step === 3 ? <CheckCircle2 size={24}/> : <ArrowRight size={24} />}
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
