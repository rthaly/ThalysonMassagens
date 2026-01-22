'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Eye, Car, Gift, Menu, Calendar
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v27_refined', 
  XP_TARGET: 500, 
};

// --- DADOS ---
const REVIEWS_DATA = [
  { n: "Tiago", t: "Melhor massagem da vida. Energia surreal.", s: 5 },
  { n: "Pedro H.", t: "Saí renovado. Recomendo muito.", s: 5 },
  { n: "Curioso SP", t: "Mão firme e pegada excelente.", s: 5 },
  { n: "Marcos", t: "Vale cada centavo. Muito cheiroso.", s: 5 },
  { n: "Roberto", t: "30min a mais faz toda diferença.", s: 5 },
  { n: "Lucas", t: "Mistura de força e suavidade incrível.", s: 5 },
  { n: "Gustavo", t: "Ambiente e música relaxantes.", s: 5 },
  { n: "Felipe", t: "Resolveu minha dor lombar.", s: 5 },
  { n: "André", t: "Respeita limites e entrega prazer.", s: 5 },
  { n: "Ricardo", t: "Agenda disputada, mas vale a pena.", s: 5 }
];

const DB = {
  services: [
    { id: 'relaxante', min: 60, price: 125, icon: Wind, color: 'text-teal-500' },
    { id: 'sensitiva', min: 60, price: 155, icon: Flame, color: 'text-rose-500' },
    { id: 'mista', min: 90, price: 205, icon: Zap, color: 'text-amber-500' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ]
};

const TEXTS = {
  pt: {
    welcome: "Bem-vindo,",
    subtitle: "Seu momento de desconexão.",
    reviews_btn: "Ver avaliações",
    choose_service: "Escolha a Sessão",
    duration: "min",
    currency: "R$",
    select_time_title: "Data e Horário",
    date_sub: "Disponibilidade atualizada:",
    time_title: "Horários (09h - 20h)",
    location_title: "Localização",
    input_name: "Seu Nome",
    input_addr: "Endereço",
    input_num: "Número",
    input_bairro: "Bairro",
    input_city: "Cidade",
    input_comp: "Complemento",
    input_hotel: "Hotel",
    input_room: "Quarto",
    motel_note: "Motel: Combinamos no WhatsApp.",
    pay_title: "Pagamento",
    extras_title: "Adicionais",
    coupon_title: "Cupons",
    coupon_select: "Selecionar",
    total_label: "Total",
    book_btn: "Confirmar no Zap",
    next_btn: "Continuar",
    uber_note: "+ Uber (Ida/Volta)",
    success_title: "Pedido Gerado!",
    success_sub: "Envie a mensagem no WhatsApp para confirmar.",
    whatsapp_btn: "Enviar Agora",
    back_home: "Início",
    today: "Hoje",
    tomorrow: "Amanhã",
    
    services: {
      relaxante: { title: "Relaxante", subtitle: "Leve & Tranquila", desc: "Movimentos suaves para zerar o stress." },
      sensitiva: { title: "Sensitiva", subtitle: "Pele com Pele", desc: "Focada em sensações e despertar o corpo." },
      mista: { title: "Completa", subtitle: "A Mais Pedida", desc: "Relaxante + Sensitiva + Finalização." }
    },
    
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo" },
      touch: { label: "Interativo", sub: "Troca de toques" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais" }
    },

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Oi Thalyson! Quero agendar:",
      section_serv: "💆‍♂️",
      section_loc: "📍",
      section_fin: "💰",
      total_pay: "Total:",
      wait: "Aguardo retorno!"
    }
  },
  en: {
    welcome: "Welcome,",
    subtitle: "Your disconnection moment.",
    reviews_btn: "See reviews",
    choose_service: "Select Session",
    duration: "min",
    currency: "R$",
    select_time_title: "Date & Time",
    date_sub: "Current availability:",
    time_title: "Hours (09am - 08pm)",
    location_title: "Location",
    input_name: "Your Name",
    input_addr: "Address",
    input_num: "Number",
    input_bairro: "District",
    input_city: "City",
    input_comp: "Unit/Apt",
    input_hotel: "Hotel",
    input_room: "Room",
    motel_note: "Motel: Discuss on WhatsApp.",
    pay_title: "Payment",
    extras_title: "Add-ons",
    coupon_title: "Coupons",
    coupon_select: "Select",
    total_label: "Total",
    book_btn: "Confirm on Zap",
    next_btn: "Continue",
    uber_note: "+ Uber Fee",
    success_title: "Order Generated!",
    success_sub: "Send message on WhatsApp to confirm.",
    whatsapp_btn: "Send Now",
    back_home: "Home",
    today: "Today",
    tomorrow: "Tomorrow",

    services: {
      relaxante: { title: "Relaxing", subtitle: "Light & Peaceful", desc: "Gentle movements to reset mind." },
      sensitiva: { title: "Sensitive", subtitle: "Skin-to-Skin", desc: "Focused on sensations and awakening." },
      mista: { title: "Complete", subtitle: "Best Seller", desc: "Relaxing + Sensitive + Finishing." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More time" },
      touch: { label: "Interactive", sub: "Touch allowed" },
      aroma: { label: "Aromatherapy", sub: "Essential oils" }
    },

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "Hi Thalyson! Booking request:",
      section_serv: "💆‍♂️",
      section_loc: "📍",
      section_fin: "💰",
      total_pay: "Total:",
      wait: "Waiting reply!"
    }
  }
};

// ==================================================================================
// 2. COMPONENTES UI (Refinados)
// ==================================================================================

const Modal = ({ isOpen, onClose, children, title, isDark }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-md rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl max-h-[80vh] flex flex-col ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            {title && <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>{title}</h3>}
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'}`}><X size={20}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
};

// ==================================================================================
// 3. APP
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  
  // Modais
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  
  const scrollRef = useRef(null);
  const T = TEXTS[lang]; 
  const [isClient, setIsClient] = useState(false);
  
  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false 
  });

  const [booking, setBooking] = useState({
    service: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null
  });

  // --- INIT ---
  useEffect(() => {
    setIsClient(true);
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        const d = JSON.parse(s);
        setUser(d);
        if(d.savedAddress) setBooking(p => ({...p, address: d.savedAddress}));
    } else {
        setUser(p => ({...p, coupons: [{ id: 'welcome', val: 12, title: '🎁 Boas Vindas' }]}));
        setTimeout(() => setWelcomePopup(true), 1000);
    }
  }, []);

  useEffect(() => { if(isClient) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user, isClient]);
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // --- LOGIC ---
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
    
    const newXP = user.xp + getFinancials.total;
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), val: 20, title: '🏆 Nível Prata' });
        setLevelUpPopup(true);
    }
    setUser({ ...user, xp: newXP, coupons: updatedCoupons });
    setStep(4);
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    let locTxt = "";
    if(booking.locationType === 'home') locTxt = `Casa: ${booking.address.street}, ${booking.address.number} - ${booking.address.city}`;
    else if(booking.locationType === 'motel') locTxt = `Motel (Combinar)`;
    else locTxt = `Hotel: ${booking.address.placeName} - Quarto ${booking.address.comp}`;

    const extras = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>`+ ${T.extras_list[k].label}`).join('\n');

    const msg = `${T.zap.intro}
${T.zap.section_serv} ${T.services[booking.service.id].title}
📅 ${dateStr} às ${booking.time}
${extras}

${T.zap.section_loc} ${locTxt}

${T.zap.section_fin}
Sub: ${T.currency} ${f.sub}
Desc: -${T.currency} ${f.disc}
${T.uber_note}

✅ ${T.zap.total_pay} ${T.currency} ${f.total} + Uber
${T.zap.payment} ${booking.payment}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (!isClient) return <div className="bg-zinc-950 h-screen w-full"/>;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-300 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* HEADER SIMPLIFICADO */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950 border-b border-zinc-800' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">T.</div>
          <span className="font-bold text-sm tracking-tight">Thalyson</span>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </header>

      {/* CONTENT - COM BLUR SCROLL */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        {/* Máscara de Blur para scroll suave visualmente */}
        <div className={`fixed top-16 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>

        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* STEP 0: SERVIÇOS */}
          {step === 0 && (
            <>
              <div>
                <h1 className="text-2xl font-bold mb-1">{T.welcome} <span className="text-blue-500">{user.name.split(' ')[0]}</span></h1>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                <div onClick={() => setReviewsOpen(true)} className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold cursor-pointer">
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
                     <h3 className="font-bold text-lg mb-1">{T.services[s.id].title}</h3>
                     <p className={`text-xs leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.services[s.id].desc}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* STEP 1: DATA */}
          {step === 1 && (
            <>
              <div className="text-center">
                 <h2 className="text-xl font-bold">{T.select_time_title}</h2>
                 <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>

              {/* Datas Horizontal */}
              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
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

              <div className={`grid grid-cols-4 gap-3 ${!booking.date && 'opacity-30 pointer-events-none'}`}>
                 {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                     let disabled = false;
                     if(booking.date) {
                         const now = new Date();
                         // Desabilita passado
                         if(booking.date.toDateString() === now.toDateString() && parseInt(t) <= now.getHours()) disabled = true;
                     }
                     // Se estiver desabilitado, nem renderiza ou renderiza transparente
                     if(disabled) return <div key={t} className="py-3 rounded-xl border border-transparent text-center text-xs opacity-20 pointer-events-none">{t}</div>;

                     return (
                         <button key={t} onClick={() => setBooking(b => ({...b, time: t}))}
                            className={`py-3 rounded-xl text-xs font-bold border transition-all ${booking.time === t ? 'bg-blue-600 text-white border-blue-600 shadow-md' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-slate-200 hover:border-slate-300')}`}
                         >
                            {t}
                         </button>
                     )
                 })}
              </div>
            </>
          )}

          {/* STEP 2: LOCAL */}
          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-center">{T.location_title}</h2>
              
              {/* Tabs */}
              <div className={`flex p-1 rounded-xl ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
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
                        <input value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={T.input_comp} className={`w-full p-4 rounded-2xl border outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                     </div>
                 )}
                 
                 {booking.locationType === 'motel' && (
                     <div className={`p-6 rounded-2xl text-center text-sm ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                         <p>{T.motel_note}</p>
                     </div>
                 )}
              </div>

              <div className="pt-6 border-t border-dashed border-zinc-700/50">
                 <h3 className={`text-xs font-bold uppercase mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                 <div className="space-y-3">
                    {DB.extras.map(ex => (
                       <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer ${booking.extras[ex.id] ? 'bg-blue-500/10 border-blue-500' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${booking.extras[ex.id] ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
                             <div><p className="text-sm font-bold">{T.extras_list[ex.id].label}</p></div>
                          </div>
                          <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-blue-500' : 'opacity-50'}`}>+ R$ {ex.price}</span>
                       </div>
                    ))}
                 </div>
              </div>
            </>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <>
               <div className={`p-6 rounded-3xl border shadow-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-500/20">
                     <span className="font-bold text-lg">{T.services[booking.service.id].title}</span>
                     <span className="font-bold text-lg">{T.currency} {booking.service.price}</span>
                  </div>
                  {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                      <div key={k} className="flex justify-between text-sm opacity-60 mb-2">
                          <span>+ {T.extras_list[k].label}</span>
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

               <div>
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-2">{T.pay_title}</h3>
                   <div className="grid grid-cols-3 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                               <p.i size={20}/> <span className="text-[10px] font-bold uppercase">{p.l}</span>
                           </button>
                       ))}
                   </div>
               </div>
            </>
          )}

          {/* STEP 4: SUCESSO */}
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
                 <button onClick={reset} className="mt-8 text-xs font-bold uppercase opacity-50 tracking-widest">{T.back_home}</button>
             </div>
          )}

        </div>
      </main>

      {/* --- FLOATING ACTION BUTTON --- */}
      {step < 4 && (
         <div className={`fixed bottom-6 left-6 right-6 z-50`}>
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
                    onClick={() => step === 3 ? finishBooking() : nextStep()}
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

      <Modal isOpen={welcomePopup} onClose={closeWelcome} title={T.popup_welcome_title} isDark={isDark}>
         <div className="text-center py-4">
             <Gift size={60} className="mx-auto text-blue-500 mb-4"/>
             <p className="text-lg mb-6">{T.popup_welcome_msg}</p>
             <button onClick={closeWelcome} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl">{T.next_btn}</button>
         </div>
      </Modal>

      <Modal isOpen={levelUpPopup} onClose={()=>setLevelUpPopup(false)} title={T.popup_level_title} isDark={isDark}>
         <div className="text-center py-4">
             <Trophy size={60} className="mx-auto text-yellow-500 mb-4"/>
             <p className="text-lg mb-6">{T.popup_level_msg}</p>
             <button onClick={()=>setLevelUpPopup(false)} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl">{T.close}</button>
         </div>
      </Modal>
      
      <div className={`fixed top-0 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>
      <div className={`fixed bottom-0 left-0 w-full h-24 z-10 pointer-events-none bg-gradient-to-t ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .animate-fade-in { animation: fadeIn 0.6s ease-out; } .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); } .animate-bounce-slow { animation: bounce 3s infinite; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
