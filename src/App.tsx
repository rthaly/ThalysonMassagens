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
// 1. CONSTANTES E DADOS ESTÁTICOS (OUTSIDE COMPONENT FOR PERFORMANCE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v18_production', 
  XP_TARGET: 500, 
};

// Algoritmo de "Esgotado" Determinístico (Baseado na data, não aleatório)
const getSoldOutSlots = (dateObj) => {
  if (!dateObj) return [];
  const today = new Date();
  today.setHours(0,0,0,0);
  const target = new Date(dateObj);
  target.setHours(0,0,0,0);
  
  const diffTime = Math.abs(target - today);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

  // Só mostra esgotado nos próximos 3 dias
  if (diffDays > 3) return [];

  const day = target.getDate();
  // Se dia par: esgota noite. Se dia ímpar: esgota manhã.
  if (day % 2 === 0) return ['19:00', '20:00'];
  return ['09:00', '10:00'];
};

// LISTA COMPLETA DE AVALIAÇÕES (50+)
const REVIEWS_DATA = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O óleo quente faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Ele de cueca branca... sem comentários. Visual nota 1000.", a: "Fã", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Tinha muita dor na lombar, ele resolveu em uma sessão. Mão milagrosa.", a: "Felipe Personal", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Fiz a relaxante e dormi na maca de tão bom. Recomendo.", a: "Breno", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O óleo de coco morno é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", a: "Anônimo", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós das costas.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Agradeço pela paciência e pelo serviço impecável.", a: "Sr. João", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque, a música.", a: "Designer", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "O Thalyson é muito gente fina. O tempo passou voando.", a: "Matheus", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total.", a: "Bruno", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
  { t: "Gostei da facilidade de agendar pelo app. Sem enrolação.", a: "Tech Guy", s: 5 },
  { t: "Massagem nos pés foi um bônus que eu não esperava. Ótimo.", a: "Corredor", s: 5 },
  { t: "Simpático e bonito. O serviço é completo mesmo.", a: "Fã #2", s: 5 },
  { t: "Me ajudou muito com a ansiedade. Gratidão.", a: "Pedro", s: 5 },
  { t: "Fiz no meu apto e ele levou tudo, maca, toalhas. Prático.", a: "Morador Centro", s: 5 },
  { t: "A massagem tântrica dele desbloqueou sensações novas.", a: "Curioso", s: 5 },
  { t: "Valeu a pena esperar a agenda liberar.", a: "Ricardo", s: 5 },
  { t: "Nota 10. Nada a reclamar.", a: "Sérgio", s: 5 },
  { t: "O final foi explosivo. Recomendo.", a: "Anônimo", s: 5 },
  { t: "Muito higiênico e cuidadoso.", a: "Médico", s: 5 },
  { t: "Voltarei com certeza na próxima semana.", a: "Cliente Fiel", s: 5 },
  { t: "Paz de espírito e corpo relaxado. Obrigado.", a: "Fernando", s: 5 }
];

const TEXTS = {
  pt: {
    // UI GERAL
    welcome: "Bem-vindo",
    subtitle: "Seu momento de desconexão.",
    reviews_btn: "Ver todas avaliações",
    reviews_title: "Experiências",
    choose_service: "Escolha sua Experiência",
    duration: "min",
    currency: "R$",
    select_time_title: "Escolha o Horário",
    scarcity_msg: "pessoas vendo agora",
    location_title: "Local de Atendimento",
    input_name: "Seu nome",
    input_addr: "Endereço completo",
    input_comp: "Complemento (Obrigatório)",
    input_hotel: "Nome do Hotel",
    input_room: "Nº Quarto",
    motel_note: "Motel: Escolhemos juntos no Zap. (Entrada por sua conta)",
    pay_title: "Pagamento",
    pay_pix: "PIX",
    pay_card: "Cartão",
    pay_cash: "Dinheiro",
    extras_title: "Adicionar Extras",
    coupon_title: "Cupons",
    coupon_select: "Selecionar...",
    coupon_none: "Sem cupons",
    remove: "Remover",
    total_label: "Total Previsto",
    book_btn: "AGENDAR AGORA",
    next_btn: "PRÓXIMO",
    uber_note: "+ Taxa de Uber (Ida/Volta)",
    success_title: "Pré-agendado!",
    success_sub: "Envie a mensagem no WhatsApp para confirmar seu horário.",
    whatsapp_btn: "CONFIRMAR NO WHATSAPP",
    back_home: "Voltar ao início",
    address_warn: "Endereço completo é obrigatório.",
    sold_out: "Esgotado",
    today: "Hoje",
    tomorrow: "Amanhã",
    
    // SERVIÇOS
    services: {
      relaxante: { title: "Relaxante", desc: "Movimentos leves, contínuos e envolventes. Foco total em tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Sensitiva", desc: "Experiência de pele com pele. Toques sutis que despertam a sensibilidade de cada centímetro do corpo." },
      mista: { title: "Completa (Premium)", desc: "Massagem no corpo inteiro para relaxar, depois corpo a corpo sensitiva. Finalização com Lingam inclusa (opcional)." }
    },
    
    // EXTRAS
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo de prazer" },
      touch: { label: "Interativo", sub: "Troca de toques liberada" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais importados" }
    },

    // TERMOS
    terms_body: [
      "1. Respeito Mútuo: O atendimento é profissional. Qualquer conduta agressiva encerrará a sessão.",
      "2. Higiene: Prezo pela máxima higiene e exijo o mesmo.",
      "3. Sigilo: Sua privacidade é garantida. O que acontece na sessão, fica na sessão.",
      "4. Motel: A taxa de entrada/período é de responsabilidade do cliente.",
      "5. Pagamento: Deve ser realizado logo após o serviço."
    ],
    terms_title: "Termos de Serviço",
    terms_agree: "Li e concordo com os",
    terms_link: "Termos",
    terms_btn: "Concordar e Fechar",

    // WHATSAPP
    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Olá Thalyson, gostaria de confirmar o agendamento:",
      section_serv: "💆‍♂️ SERVIÇO",
      section_loc: "📍 LOCALIZAÇÃO",
      section_fin: "💰 FINANCEIRO",
      uber_label: "🚗 Uber (Ida/Volta):",
      uber_val: "A calcular",
      total_pay: "Total a Pagar:",
      payment: "Forma de Pagamento:",
      wait: "Fico no aguardo da confirmação!"
    }
  },
  en: {
    welcome: "Welcome",
    subtitle: "Your moment of disconnection.",
    reviews_btn: "Read all reviews",
    reviews_title: "Experiences",
    choose_service: "Choose Experience",
    duration: "min",
    currency: "R$",
    select_time_title: "Select Time",
    scarcity_msg: "viewing now",
    location_title: "Location",
    input_name: "Your Name",
    input_addr: "Full Address",
    input_comp: "Unit/Apt (Required)",
    input_hotel: "Hotel Name",
    input_room: "Room #",
    motel_note: "Motel: We pick on WhatsApp. (Fee on you)",
    pay_title: "Payment",
    pay_pix: "PIX",
    pay_card: "Card",
    pay_cash: "Cash",
    extras_title: "Add Extras",
    coupon_title: "Coupons",
    coupon_select: "Select...",
    coupon_none: "No coupons",
    remove: "Remove",
    total_label: "Estimated Total",
    book_btn: "BOOK NOW",
    next_btn: "NEXT",
    uber_note: "+ Uber Fee (Round trip)",
    success_title: "Pre-booked!",
    success_sub: "Send the message on WhatsApp to confirm.",
    whatsapp_btn: "CONFIRM ON WHATSAPP",
    back_home: "Back to home",
    address_warn: "Full address is required.",
    sold_out: "Sold Out",
    today: "Today",
    tomorrow: "Tomorrow",

    services: {
      relaxante: { title: "Relaxing", desc: "Light movements to reset your mind." },
      sensitiva: { title: "Sensitive", desc: "Skin-to-skin. Awakening every inch of your body." },
      mista: { title: "Complete (Premium)", desc: "Full body relaxation massage, followed by sensitive body-to-body. Lingam finishing included (optional)." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More time to enjoy" },
      touch: { label: "Interactive", sub: "Touch exchange allowed" },
      aroma: { label: "Aromatherapy", sub: "Imported essential oils" }
    },

    terms_body: [
      "1. Mutual Respect: The service is professional. Aggression ends the session.",
      "2. Hygiene: I value maximum hygiene.",
      "3. Secrecy: Your privacy is guaranteed.",
      "4. Motel: Entrance fee is on the client.",
      "5. Payment: Must be made immediately after service."
    ],
    terms_title: "Terms of Service",
    terms_agree: "I agree to the",
    terms_link: "Terms",
    terms_btn: "Agree & Close",

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "Hi Thalyson, confirming my slot:",
      section_serv: "💆‍♂️ SERVICE",
      section_loc: "📍 LOCATION",
      section_fin: "💰 FINANCIAL",
      uber_label: "🚗 Uber (Round Trip):",
      uber_val: "To calculate",
      total_pay: "Total to Pay:",
      payment: "Payment Method:",
      wait: "Waiting for confirmation!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', min: 60, price: 145, icon: Wind },
    { id: 'sensitiva', min: 60, price: 175, icon: Flame },
    { id: 'mista', min: 90, price: 255, icon: Zap }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ]
};

// ==================================================================================
// 2. MICRO-COMPONENTES (UI KIT)
// ==================================================================================

// Bottom Sheet / Modal Otimizado
const BottomSheet = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-950 border-t border-white/10 sm:border sm:rounded-3xl p-6 pb-10 animate-slide-up shadow-2xl h-[85vh] flex flex-col">
        <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6 flex-shrink-0"/>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
           <h3 className="text-xl font-bold text-white">{title}</h3>
           <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={20}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
};

// Card de Serviço "Glass"
const ServiceCard = ({ s, selected, onClick, T }) => (
  <div onClick={onClick} className={`relative p-6 rounded-3xl border transition-all duration-300 cursor-pointer ${selected ? 'bg-blue-600/10 border-blue-500/50 shadow-[0_0_20px_rgba(37,99,235,0.15)]' : 'bg-zinc-900/50 border-white/5 hover:bg-zinc-900'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
        <s.icon size={24} />
      </div>
      {selected && <div className="bg-blue-500 text-white p-1 rounded-full"><Check size={14} strokeWidth={4}/></div>}
      <div className="text-right">
        <span className="block text-2xl font-bold text-white">{T.currency} {s.price}</span>
        <span className="text-xs text-zinc-500">{s.min} {T.duration}</span>
      </div>
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{T.services[s.id].title}</h3>
    <p className="text-xs text-zinc-400 leading-relaxed">{T.services[s.id].desc}</p>
  </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  
  // Modais UI
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  
  // Dados
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{id: 'welcome', val: 12, title: 'Welcome Gift'}] };
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  const [booking, setBooking] = useState({
    service: null, 
    extras: {}, 
    date: null, 
    time: null,
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null
  });

  const [viewing, setViewing] = useState(0);
  const scrollRef = useRef(null);
  const T = TEXTS[lang];

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // --- HANDLERS ---

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleDateSelect = (d) => {
    setBooking(prev => ({ ...prev, date: d, time: null }));
  };

  const handleTimeSelect = (t) => {
    setBooking(prev => ({ ...prev, time: t }));
    setViewing(Math.floor(Math.random() * 4) + 2);
  };

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DB.extras.find(e=>e.id===k).price });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking]);

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

  const finishBooking = () => {
    if (booking.appliedCoupon) {
      // Remove o cupom usado da lista comparando ID convertido para string
      setUser(u => ({ ...u, coupons: u.coupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id)) }));
    }
    // Adiciona XP
    setUser(u => ({ ...u, xp: u.xp + getFinancials.total }));
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setBooking({ 
        service: null, extras: {}, date: null, time: null, 
        locationType: 'home', 
        address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' }, 
        payment: '', appliedCoupon: null, termsAccepted: false 
    });
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    
    let locTxt = "";
    if(booking.locationType === 'home') locTxt = `🏠 Casa:\n${booking.address.street}, ${booking.address.number}\nComp: ${booking.address.comp}\n${booking.address.district} - ${booking.address.city}`;
    else if(booking.locationType === 'motel') locTxt = "🏩 Motel (A combinar no chat)";
    else locTxt = `🏨 Hotel: ${booking.address.placeName}\nQuarto: ${booking.address.comp}\n${booking.address.city}`;

    const extras = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>`+ ${T.extras_list[k].label}`).join('\n');

    const msg = `
${T.zap.greeting[1]}, Thalyson!
${T.zap.intro}

👤 ${user.name}

${T.zap.section_serv}
• ${T.services[booking.service.id].title}
📅 ${dateStr} às ${booking.time}
${extras ? `\nExtras:\n${extras}` : ''}

${T.zap.section_loc}
${locTxt}

${T.zap.section_fin}
• Subtotal: ${T.currency} ${f.sub},00
${f.disc > 0 ? `• Desconto: - ${T.currency} ${f.disc},00` : ''}
${T.zap.uber_label} ${T.zap.uber_val}

✅ *${T.zap.total_pay}* ${T.currency} ${f.total},00 + Uber
${T.zap.payment} ${booking.payment.toUpperCase()}

${T.zap.wait}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ==================================================================================
  // RENDER
  // ==================================================================================

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-blue-600 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 size={16}/> {toast.msg}
        </div>
      </div>

      {/* --- MENU OVERLAY --- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)}/>
           <div className="relative w-4/5 max-w-xs h-full bg-zinc-900 border-r border-white/5 p-6 shadow-2xl flex flex-col animate-slide-right">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="font-bold text-xl text-white">Menu</h2>
                 <button onClick={() => setMenuOpen(false)}><X/></button>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mb-6 relative overflow-hidden">
                 <Trophy className="absolute -right-2 -bottom-2 text-white/20" size={80}/>
                 <p className="text-xs uppercase font-bold opacity-70">Nível XP</p>
                 <p className="text-3xl font-black">{user.xp}</p>
                 <div className="w-full h-1.5 bg-black/20 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-white" style={{width: `${(user.xp % 500)/5}%`}}/>
                 </div>
              </div>
              <div className="space-y-2">
                 <button onClick={()=>setLang(l => l==='pt'?'en':'pt')} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5"><Globe size={18}/> {lang==='pt'?'Mudar para Inglês':'Switch to Portuguese'}</button>
                 <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-white/5 text-blue-400"><Instagram size={18}/> Instagram</a>
              </div>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-xs">T.</div>
          <span className="font-bold text-sm tracking-wide">Thalyson Massagens</span>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2 -mr-2 opacity-80 hover:opacity-100"><Menu size={20}/></button>
      </header>

      {/* --- CONTENT --- */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">

          {/* STEP 0: SERVIÇOS */}
          {step === 0 && (
            <>
              <div className="space-y-1">
                <h1 className="text-2xl font-bold text-white">{T.welcome} {user.name.split(' ')[0]}</h1>
                <p className="text-zinc-400 text-sm">{T.subtitle}</p>
                <button onClick={() => setReviewsOpen(true)} className="flex items-center gap-2 mt-2 text-amber-400 text-xs font-medium hover:underline">
                  <div className="flex"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                  {TEXTS[lang].reviews_count}
                </button>
              </div>

              <div className="grid gap-4">
                {DB.services.map(s => (
                  <ServiceCard key={s.id} s={s} T={T} selected={booking.service?.id === s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} />
                ))}
              </div>
            </>
          )}

          {/* STEP 1: DATA */}
          {step === 1 && (
            <>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{T.select_time_title}</h2>
                <p className="text-zinc-500 text-xs">{T.date_sub}</p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                {[...Array(7)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  
                  return (
                    <button key={i} onClick={() => handleDateSelect(d)} 
                      className={`min-w-[75px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
                      <span className="text-[10px] uppercase font-bold">{lbl}</span>
                      <span className="text-2xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              <div className={`grid grid-cols-4 gap-3 transition-opacity duration-500 ${booking.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                {['09:00','10:00','11:00','13:00','14:00','16:00','18:00','19:00','20:00'].map(time => {
                  const sold = getSoldOutSlots(booking.date).includes(time);
                  const isSel = booking.time === time;
                  let past = false;
                  if(booking.date) {
                     const now = new Date();
                     if(booking.date.toDateString() === now.toDateString() && parseInt(time) <= now.getHours()) past = true;
                  }

                  return (
                    <button key={time} disabled={sold || past} onClick={() => handleTimeSelect(time)}
                      className={`relative py-3 rounded-xl text-xs font-bold border transition-all overflow-hidden ${sold || past ? 'opacity-30 line-through border-transparent' : isSel ? 'bg-white text-black border-white' : 'bg-zinc-900 border-white/10 text-zinc-400'}`}>
                      {time}
                    </button>
                  )
                })}
              </div>
              
              {booking.time && (
                <div className="flex justify-center animate-fade-in">
                  <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-2">
                    <Eye size={12} className="animate-pulse"/> {viewing} {T.scarcity_msg}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: LOCAL */}
          {step === 2 && (
            <>
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold">{T.location_title}</h2>
              </div>

              <div className="flex bg-zinc-900 p-1 rounded-2xl mb-6">
                {[{id:'home', l:'Home', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(opt => (
                  <button key={opt.id} onClick={() => setBooking(b => ({ ...b, locationType: opt.id }))} 
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${booking.locationType === opt.id ? 'bg-zinc-800 text-white' : 'text-zinc-500'}`}>
                    <opt.i size={14}/> {opt.l}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">{T.input_name}</label>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent outline-none text-sm py-1 font-medium" placeholder="..."/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs flex gap-2"><Info size={14} className="shrink-0"/> {T.address_warn}</div>
                    <div className="grid grid-cols-[1fr_80px] gap-3">
                      <input value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Rua / Av" />
                      <input type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Nº" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Bairro" />
                      <input value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Cidade" />
                    </div>
                    <input value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder={T.input_comp} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                  <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-start gap-3">
                    <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-blue-200 leading-relaxed">{T.motel_warn}</p>
                  </div>
                )}

                {booking.locationType === 'hotel' && (
                  <div className="space-y-4 animate-fade-in">
                    <input value={booking.address.placeName} onChange={e => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder={T.input_hotel} />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Cidade" />
                      <input value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder={T.input_room} />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6">
                <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4">{T.extras_title}</h3>
                <div className="space-y-3">
                  {DB.extras.map(ex => (
                    <div key={ex.id} onClick={() => setBooking(prev => ({ ...prev, extras: { ...prev.extras, [ex.id]: !prev.extras[ex.id] } }))} 
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-blue-600/10 border-blue-500/50' : 'bg-zinc-900/30 border-white/5'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${booking.extras[ex.id] ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}><ex.icon size={16}/></div>
                        <div>
                          <p className="text-sm font-bold">{T.extras_list[ex.id].label}</p>
                          <p className="text-[10px] text-zinc-500">{T.extras_list[ex.id].sub}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-blue-400' : 'text-zinc-600'}`}>+ {T.currency} {ex.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* STEP 3: RESUMO */}
          {step === 3 && (
            <>
              <h2 className="text-xl font-bold text-center mb-6">{T.resume_title}</h2>
              
              <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center pb-4 border-b border-dashed border-white/10">
                    <span className="font-bold text-lg">{T.services[booking.service.id].title}</span>
                    <span className="font-bold">{T.currency} {booking.service.price}</span>
                  </div>
                  
                  {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                    <div key={k} className="flex justify-between text-sm text-zinc-400">
                      <span>+ {T.extras_list[k].label}</span>
                      <span>{T.currency} {DB.extras.find(e=>e.id===k).price}</span>
                    </div>
                  ))}

                  {/* CUPOM */}
                  <div className="bg-black/20 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400"><Ticket size={14}/> {T.coupon_title}</div>
                    {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking(b => ({...b, appliedCoupon: null}))} className="text-xs text-red-400 font-bold hover:underline">{T.remove}</button>
                      ) : (
                        <select onChange={(e) => {
                          const c = user.coupons.find(cup => String(cup.id) === e.target.value);
                          setBooking(b => ({...b, appliedCoupon: c}));
                        }} className="bg-transparent text-xs font-bold text-blue-400 outline-none text-right">
                          <option value="">{T.coupon_select}</option>
                          {user.coupons.map(c => <option key={c.id} value={c.id}>- {T.currency}{c.val}</option>)}
                        </select>
                      )
                    ) : <span className="text-xs text-zinc-600">{T.coupon_none}</span>}
                  </div>

                  {booking.appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-400 font-bold">
                      <span>Desconto</span>
                      <span>- {T.currency} {booking.appliedCoupon.val}</span>
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-end border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-xs text-zinc-500 uppercase font-bold tracking-widest">{T.total_label}</span>
                      <span className="text-[10px] text-amber-500 font-bold mt-1 flex items-center gap-1"><Car size={10}/> {T.uber_note}</span>
                    </div>
                    <span className="text-3xl font-black text-white">{T.currency} {getFinancials.total}</span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 ml-1">{T.pay_title}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'cash', l:T.pay_cash, i:Banknote}].map(p => (
                    <button key={p.id} onClick={() => setBooking(b => ({...b, payment: p.id}))}
                      className={`flex flex-col items-center gap-2 py-4 rounded-2xl border transition-all ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                      <p.i size={20}/> <span className="text-[10px] font-black uppercase">{p.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div onClick={() => setBooking(b => ({...b, termsAccepted: !b.termsAccepted}))} className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-900/30 border border-white/5 mt-4 cursor-pointer">
                 <div className={`w-5 h-5 rounded border flex items-center justify-center ${booking.termsAccepted ? 'bg-blue-500 border-blue-500' : 'border-zinc-600'}`}>
                    {booking.termsAccepted && <Check size={12} className="text-white"/>}
                 </div>
                 <p className="text-xs text-zinc-400">{T.terms_agree} <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="text-blue-400 underline">{T.terms_link}</span>.</p>
              </div>
            </>
          )}

          {/* STEP 4: SUCESSO */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center animate-scale-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                  <Check size={48} className="text-white" strokeWidth={4}/>
                </div>
              </div>
              <h1 className="text-3xl font-black text-white mb-2">{T.success_title}</h1>
              <p className="text-zinc-400 text-sm max-w-[250px] mx-auto leading-relaxed mb-10">{T.success_sub}</p>
              
              <button onClick={openZap} className="w-full py-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl shadow-lg shadow-green-900/20 flex items-center justify-center gap-3 active:scale-95 transition-all">
                <MessageCircle size={24} fill="white"/> {T.whatsapp_btn}
              </button>
              
              <button onClick={reset} className="mt-8 text-xs text-zinc-500 hover:text-white uppercase font-bold tracking-widest">{T.back_home}</button>
            </div>
          )}

        </div>
      </main>

      {/* --- STICKY FOOTER --- */}
      {step < 4 && (
        <div className="h-24 px-6 border-t border-white/5 bg-zinc-950/80 backdrop-blur-xl flex items-center shrink-0 z-30">
          <div className="w-full max-w-md mx-auto flex items-center gap-4">
            {step > 0 && (
               <button onClick={() => setStep(step - 1)} className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white">
                 <ChevronLeft size={24}/>
               </button>
            )}

            <button 
              disabled={!canProceed()} 
              onClick={() => step === 3 ? finishBooking() : setStep(step + 1)}
              className={`h-14 rounded-2xl font-bold flex items-center justify-center gap-2 px-6 transition-all shadow-lg active:scale-95 flex-1
                ${!canProceed() ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/20'}`}
            >
              {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={20}/>}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAIS --- */}
      <BottomSheet isOpen={reviewsOpen} onClose={() => setReviewsOpen(false)} title={T.reviews_title}>
         <div className="space-y-4">
            {REVIEWS_DATA.map((r, i) => (
               <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex justify-between mb-2">
                     <span className="font-bold text-blue-400 text-xs">{r.a}</span>
                     <div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                  </div>
                  <p className="text-sm text-zinc-300 italic">"{r.t}"</p>
               </div>
            ))}
         </div>
      </BottomSheet>

      <BottomSheet isOpen={termsOpen} onClose={() => setTermsOpen(false)} title={T.terms_title}>
         <div className="space-y-4 text-sm text-zinc-300 leading-relaxed font-light">
            {T.terms_body.map((t,i)=><p key={i}>{t}</p>)}
         </div>
         <button onClick={()=>setTermsOpen(false)} className="w-full mt-8 py-4 bg-zinc-100 text-black font-bold rounded-xl">{T.terms_btn}</button>
      </BottomSheet>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-right { animation: slideRight 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
