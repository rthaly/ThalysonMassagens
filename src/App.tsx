import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car, Map
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (CORE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v17_ultimate', 
  XP_TARGET: 500, 
};

// Algoritmo de Escassez (Simulado mas consistente)
const getSoldOutSlots = (dateObj) => {
  if (!dateObj) return [];
  const today = new Date();
  const target = new Date(dateObj);
  const diffDays = Math.ceil(Math.abs(target - today) / (1000 * 60 * 60 * 24)); 
  if (diffDays > 4) return []; // Futuro distante tudo livre
  const day = target.getDate();
  // Bloqueia horários baseado na paridade do dia para parecer real
  return day % 2 === 0 ? ['19:00', '20:00'] : ['10:00', '18:00'];
};

const TEXTS = {
  pt: {
    welcome: "Olá,",
    subtitle: "Seu momento de desconexão.",
    reviews_count: "50+ avaliações 5 estrelas",
    duration: "min",
    currency: "R$",
    select_time_title: "Escolha o Horário",
    scarcity_msg: "pessoas de olho nesse horário",
    location_title: "Onde será?",
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
    coupon_apply: "Aplicar",
    total_label: "Total Previsto",
    book_btn: "AGENDAR AGORA",
    next_btn: "PRÓXIMO",
    uber_note: "+ Taxa de Uber (Ida/Volta)",
    success_title: "Pré-agendado!",
    success_sub: "Envie a mensagem no WhatsApp para confirmar seu horário.",
    whatsapp_btn: "CONFIRMAR NO WHATSAPP",
    back_home: "Voltar ao início",
    
    services: {
      relaxante: { title: "Relaxante", subtitle: "Alívio de tensão & Paz mental", desc: "Movimentos leves e contínuos para zerar o stress." },
      sensitiva: { title: "Sensitiva", subtitle: "Toque sutil & Conexão", desc: "Pele com pele. Desperta cada centímetro do corpo." },
      mista: { title: "Completa (Premium)", subtitle: "Relaxante + Sensitiva + Lingam", desc: "A fusão perfeita. Relaxamento muscular seguido de finalização intensa." }
    },
    
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo de prazer" },
      touch: { label: "Interativo", sub: "Troca de toques liberada" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais importados" }
    },

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Olá Thalyson, quero confirmar meu horário:",
      service: "💆‍♂️",
      date: "📅",
      loc: "📍",
      pay: "💳",
      total: "💰",
      uber: "🚗 Uber: A calcular",
      wait: "Aguardo confirmação!"
    }
  },
  en: {
    welcome: "Hello,",
    subtitle: "Your moment of disconnection.",
    reviews_count: "50+ 5-star reviews",
    duration: "min",
    currency: "R$",
    select_time_title: "Select Time",
    scarcity_msg: "people viewing this slot",
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
    coupon_apply: "Apply",
    total_label: "Est. Total",
    book_btn: "BOOK NOW",
    next_btn: "NEXT",
    uber_note: "+ Uber Fee (Round trip)",
    success_title: "Pre-booked!",
    success_sub: "Send the message on WhatsApp to confirm.",
    whatsapp_btn: "CONFIRM ON WHATSAPP",
    back_home: "Back to home",

    services: {
      relaxante: { title: "Relaxing", subtitle: "Stress Relief & Peace", desc: "Light movements to reset your mind." },
      sensitiva: { title: "Sensitive", subtitle: "Subtle Touch & Connection", desc: "Skin-to-skin. Awakening every inch of your body." },
      mista: { title: "Complete (Premium)", subtitle: "Relax + Sensitive + Lingam", desc: "The perfect fusion. Muscle relaxation followed by intense finishing." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More time to enjoy" },
      touch: { label: "Interactive", sub: "Touch exchange allowed" },
      aroma: { label: "Aromatherapy", sub: "Imported essential oils" }
    },

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "Hi Thalyson, I want to confirm:",
      service: "💆‍♂️",
      date: "📅",
      loc: "📍",
      pay: "💳",
      total: "💰",
      uber: "🚗 Uber: To calculate",
      wait: "Waiting for reply!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', min: 60, price: 145, icon: Wind, color: 'from-teal-400 to-emerald-500' },
    { id: 'sensitiva', min: 60, price: 175, icon: Flame, color: 'from-rose-400 to-red-500' },
    { id: 'mista', min: 90, price: 255, icon: Zap, color: 'from-amber-400 to-orange-500' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ],
  reviews: [
    { name: "Lucas (Londrina)", text: "Mano, que sensação. Jorrei muito no final, foi insano. O cara sabe o que faz." },
    { name: "Ricardo (SP)", text: "A sensitiva dele é outro patamar. Gozei horrores e relaxei demais." },
    { name: "Felipe (Jales)", text: "Relaxou até minha alma. Mão pesada na medida certa, tirou toda dor." },
    { name: "Pedro H.", text: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo." },
    { name: "Gustavo", text: "Ambiente que ele cria com a música e o cheiro é relaxante demais." }
  ]
};

// ==================================================================================
// 2. MICRO-COMPONENTES (UI KIT)
// ==================================================================================

// Bottom Sheet / Modal com Animação Slide Up
const BottomSheet = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-900 border-t border-white/10 sm:border sm:rounded-3xl p-6 pb-10 animate-slide-up shadow-2xl h-[85vh] flex flex-col">
        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-6 flex-shrink-0"/>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
           <h3 className="text-xl font-bold text-white">{title}</h3>
           <button onClick={onClose} className="p-2 bg-white/5 rounded-full"><X size={20} className="text-white"/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
};

// Card de Serviço "Vivo"
const ServiceCard = ({ s, selected, onClick, T }) => (
  <div onClick={onClick} className={`relative group p-5 rounded-3xl border transition-all duration-300 cursor-pointer overflow-hidden ${selected ? 'bg-white/5 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
    <div className={`absolute inset-0 bg-gradient-to-br ${s.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}/>
    <div className="flex justify-between items-start mb-3 relative z-10">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-lg`}>
        <s.icon size={24} />
      </div>
      {selected && <div className="bg-blue-500 text-white p-1 rounded-full"><Check size={14} strokeWidth={4}/></div>}
    </div>
    <h3 className="text-lg font-bold text-white mb-1">{T.services[s.id].title}</h3>
    <p className="text-xs text-blue-200/60 mb-3">{T.services[s.id].subtitle}</p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-2xl font-bold text-white">{T.currency} {s.price}</span>
      <span className="text-xs font-medium bg-white/10 px-2 py-1 rounded-lg text-white/60">{s.min} {T.duration}</span>
    </div>
  </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  
  // Estado de Dados
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

  // Escassez
  const [viewing, setViewing] = useState(0);
  const scrollRef = useRef(null);
  const T = TEXTS[lang];

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // --- LÓGICA ---

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DB.extras.find(e=>e.id===k).price });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking]);

  const toggleExtra = (id) => {
    setBooking(prev => ({ ...prev, extras: { ...prev.extras, [id]: !prev.extras[id] } }));
  };

  const handleDateSelect = (d) => {
    setBooking(prev => ({ ...prev, date: d, time: null }));
  };

  const handleTimeSelect = (t) => {
    setBooking(prev => ({ ...prev, time: t }));
    setViewing(Math.floor(Math.random() * 4) + 2); // 2 a 5 pessoas
  };

  const isSoldOut = (d, t) => {
    const slots = getSoldOutSlots(d);
    return slots.includes(t);
  };

  const canProceed = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { street, number, comp, placeName, city } = booking.address;
      if (!user.name) return false;
      if (booking.locationType === 'home') return street && number && comp && city;
      if (booking.locationType === 'hotel') return placeName && city;
      return true; // Motel is ok
    }
    return !!booking.payment;
  };

  const finishBooking = () => {
    // 1. Remove cupom
    if (booking.appliedCoupon) {
      setUser(u => ({ ...u, coupons: u.coupons.filter(c => c.id !== booking.appliedCoupon.id) }));
    }
    // 2. Add XP
    setUser(u => ({ ...u, xp: u.xp + getFinancials.total }));
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setBooking({ service: null, extras: {}, date: null, time: null, locationType: 'home', address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' }, payment: '', appliedCoupon: null });
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    
    let locTxt = "";
    if(booking.locationType === 'home') locTxt = `${booking.address.street}, ${booking.address.number} (${booking.address.comp}) - ${booking.address.city}`;
    else if(booking.locationType === 'motel') locTxt = "Motel (A combinar)";
    else locTxt = `Hotel ${booking.address.placeName} - ${booking.address.city}`;

    const extras = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>`+ ${T.extras_list[k].label}`).join('\n');

    const msg = `
${T.zap.greeting[1]}, Thalyson!
${T.zap.intro}

👤 ${user.name}
${T.zap.service} ${T.services[booking.service.id].title}
${T.zap.date} ${dateStr} às ${booking.time}

${extras}

${T.zap.loc} ${locTxt}

${T.zap.total} ${T.currency} ${f.total},00
${T.zap.uber}
${T.zap.pay} ${booking.payment.toUpperCase()}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // ==================================================================================
  // RENDER
  // ==================================================================================

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* --- HEADER --- */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-black text-zinc-950 text-xs">T.</div>
          <span className="font-bold text-sm tracking-wide">Thalyson</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setLang(lang === 'pt' ? 'en' : 'pt')} className="opacity-60 hover:opacity-100 transition-opacity"><Globe size={20}/></button>
          <button onClick={() => setMenuOpen(true)} className="opacity-60 hover:opacity-100 transition-opacity"><Menu size={20}/></button>
        </div>
      </header>

      {/* --- SCROLLABLE CONTENT --- */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32">
        <div className="max-w-md mx-auto space-y-8 animate-fade-in">

          {/* STEP 0: SERVIÇOS */}
          {step === 0 && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">{T.welcome} {user.name.split(' ')[0]}</h1>
                <p className="text-zinc-400 text-sm">{T.subtitle}</p>
                <div onClick={() => setReviewsOpen(true)} className="flex items-center gap-2 mt-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  <div className="flex text-amber-400"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <span className="text-[10px] underline">{T.reviews_count}</span>
                </div>
              </div>

              <div className="grid gap-4">
                {DB.services.map(s => (
                  <ServiceCard key={s.id} s={s} T={T} selected={booking.service?.id === s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} />
                ))}
              </div>
            </>
          )}

          {/* STEP 1: DATA E HORÁRIO */}
          {step === 1 && (
            <>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white">{T.select_time_title}</h2>
                <p className="text-zinc-500 text-xs">{T.date_sub}</p>
              </div>

              {/* Date Scroll */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
                {[...Array(7)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  return (
                    <button key={i} onClick={() => handleDateSelect(d)} 
                      className={`min-w-[70px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-105' : 'bg-zinc-900 border-white/5 text-zinc-500'}`}>
                      <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3)}</span>
                      <span className="text-2xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              {/* Time Grid */}
              <div className={`grid grid-cols-4 gap-3 transition-opacity duration-500 ${booking.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                {['09:00','10:00','11:00','13:00','14:00','16:00','18:00','19:00','20:00','21:00'].map(time => {
                  const sold = isSoldOut(booking.date, time);
                  const isSel = booking.time === time;
                  
                  // Disable past hours if today
                  let past = false;
                  if(booking.date) {
                     const now = new Date();
                     if(booking.date.toDateString() === now.toDateString()) {
                        if(parseInt(time) <= now.getHours()) past = true;
                     }
                  }

                  return (
                    <button key={time} disabled={sold || past} onClick={() => handleTimeSelect(time)}
                      className={`relative py-3 rounded-xl text-xs font-bold border transition-all overflow-hidden
                        ${sold || past ? 'bg-zinc-900/50 border-transparent text-zinc-700 decoration-zinc-700 line-through cursor-not-allowed' : 
                          isSel ? 'bg-white text-black border-white shadow-xl scale-105 z-10' : 'bg-zinc-900 border-white/10 text-zinc-400 hover:border-white/30'}`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
              
              {/* Scarcity Badge */}
              {booking.time && (
                <div className="flex justify-center animate-bounce-slow">
                  <div className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2">
                    <Eye size={12} className="animate-pulse"/> {viewing} {T.scarcity_msg}
                  </div>
                </div>
              )}
            </>
          )}

          {/* STEP 2: LOCAL E DADOS */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">{T.location_title}</h2>
              </div>

              <div className="flex bg-zinc-900 p-1 rounded-2xl">
                {[{id:'home', l:'Home', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(opt => (
                  <button key={opt.id} onClick={() => setBooking(b => ({ ...b, locationType: opt.id }))} 
                    className={`flex-1 py-3 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all ${booking.locationType === opt.id ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500'}`}>
                    <opt.i size={14}/> {opt.l}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <div className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-2 focus-within:border-blue-500/50 transition-colors">
                  <label className="text-[10px] uppercase font-bold text-zinc-500">{T.input_name}</label>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-transparent outline-none text-sm py-2 font-medium" placeholder="..."/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-[1fr_80px] gap-3">
                      <input value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Rua / Av" />
                      <input type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Nº" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Bairro" />
                      <input value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} className="bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none" placeholder="Cidade" />
                    </div>
                    <input value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className="w-full bg-zinc-900/50 border border-white/5 rounded-2xl px-4 py-4 text-sm outline-none focus:border-blue-500" placeholder={T.input_comp} />
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
                    <div key={ex.id} onClick={() => toggleExtra(ex.id)} 
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

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">{T.resume_title}</h2>
              
              <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Ticket size={100}/></div>
                
                <div className="relative z-10 space-y-4">
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
                    <span className="text-4xl font-black text-white">{T.currency} {getFinancials.total}</span>
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
            </>
          )}

          {/* STEP 4: SUCESSO */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-20 text-center animate-scale-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                  <Check size={48} className="text-white" strokeWidth={4}/>
                </div>
              </div>
              <h1 className="text-4xl font-black text-white mb-2">{T.success_title}</h1>
              <p className="text-zinc-400 text-sm max-w-[250px] mx-auto leading-relaxed mb-10">{T.success_msg}</p>
              
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
          <div className="w-full max-w-md mx-auto flex items-center gap-6">
            {(step === 0 || step === 1 || step === 2) && (
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase text-zinc-500 tracking-wider mb-0.5">{T.total_label}</p>
                <div className="text-2xl font-black text-white flex items-baseline gap-1">
                  <span className="text-sm font-normal text-zinc-500">{T.currency}</span>
                  {getFinancials.total}
                </div>
              </div>
            )}
            
            {step === 3 && (
               <div className="flex-1 text-xs text-zinc-500 leading-tight">
                  {T.terms_agree} <span className="text-blue-400 underline cursor-pointer">{T.terms_link}</span>.
               </div>
            )}

            {step > 0 && (
               <button onClick={() => setStep(step - 1)} className="w-14 h-14 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                 <ChevronLeft size={24}/>
               </button>
            )}

            <button 
              disabled={!canProceed()} 
              onClick={() => step === 3 ? finishBooking() : setStep(step + 1)}
              className={`h-14 rounded-2xl font-bold flex items-center justify-center gap-2 px-6 transition-all shadow-lg active:scale-95 flex-1
                ${!canProceed() ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-blue-500/25'}`}
            >
              {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={20}/>}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAIS --- */}
      <BottomSheet isOpen={reviewsOpen} onClose={() => setReviewsOpen(false)} title={T.reviews_title}>
         <div className="space-y-4">
            {DB.reviews.map((r, i) => (
               <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex justify-between mb-2">
                     <span className="font-bold text-blue-400 text-xs">{r.name}</span>
                     <div className="flex text-amber-400 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                  </div>
                  <p className="text-sm text-zinc-300 italic">"{r.text}"</p>
               </div>
            ))}
         </div>
      </BottomSheet>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
