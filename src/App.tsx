import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Gift, 
  Wallet, User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  Calendar as CalIcon, CheckCircle2, Home, HelpCircle, Share2, 
  CreditCard, Banknote, QrCode, Lock, Info, ExternalLink
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v7_final',
  XP_TARGET: 600,
  COUPON_LOYALTY_VAL: 30
};

const DB = {
  services: [
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante',
      time: '1h de duração',
      price: 145, 
      xp: 145, 
      icon: Wind, 
      color: 'text-teal-400', 
      bg: 'bg-teal-400/10',
      desc: "Ideal para tirar o stress e dormir melhor. Movimentos leves e contínuos.",
    },
    { 
      id: 'sensitiva', 
      title: 'Massagem Sensitiva',
      time: '1h de duração',
      badge: 'MAIS PEDIDA 🔥',
      price: 175, 
      xp: 175, 
      icon: Flame, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10',
      desc: "Experiência tântrica. Toques sutis de pele com pele e finalização especial.",
    },
    { 
      id: 'mista', 
      title: 'Massagem Mista',
      time: '1h30 de duração',
      badge: 'PREMIUM ⭐',
      price: 255, 
      xp: 255, 
      icon: Zap, 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10',
      desc: "O melhor dos dois mundos: relaxamento muscular profundo + finalização sensitiva.",
    }
  ],
  extras: [
    { id: 'more_time', label: "+30 Minutos", desc: "Estender a sessão", price: 77, icon: Clock },
    { id: 'touch', label: "Toque Interativo", desc: "Você pode tocar também", price: 63, icon: Heart },
    { id: 'aroma', label: "Aromaterapia", desc: "Óleos essenciais", price: 5, icon: Smile }
  ],
  faqs: [
    { q: "Onde é o atendimento?", a: "Atendo no seu local (Casa/Hotel) ou combinamos em um Motel de sua preferência." },
    { q: "Aceita cartão?", a: "Sim! Pix, Dinheiro e Cartão de Crédito/Débito." },
    { q: "É sigiloso?", a: "Totalmente. Sou profissional, discreto e não exponho clientes." },
    { q: "O que é a sensitiva?", a: "É uma massagem focada em sensações, usando o corpo todo para deslizar, não apenas as mãos." }
  ],
  reviews: [
    { name: "Ricardo S.", text: "Mão muito leve, quase dormi.", stars: 5 },
    { name: "André L.", text: "Super respeitoso e discreto. Nota 10.", stars: 5 },
    { name: "Felipe M.", text: "A sensitiva é surreal. Recomendo.", stars: 5 },
    { name: "Gustavo", text: "Pontualidade britânica.", stars: 5 },
    { name: "M. Oliveira", text: "Ambiente perfeito, relaxei 100%.", stars: 5 },
    { name: "Pedro H.", text: "Simpatia e profissionalismo.", stars: 5 },
    { name: "Lucas", text: "Sensacional. Já quero outra.", stars: 5 },
    { name: "R. Gomes", text: "Me deixou super seguro e à vontade.", stars: 5 },
    { name: "Eduardo", text: "Higiene nota 10.", stars: 5 },
    { name: "Vitor", text: "Energia muito boa.", stars: 5 }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
    <div className="bg-emerald-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-semibold text-sm border border-emerald-400/30 backdrop-blur-md">
      <CheckCircle2 size={18} />
      <span>{msg}</span>
    </div>
  </div>
);

const ReviewTicker = ({ reviews, isDark }) => (
  <div className="w-full overflow-hidden relative py-6">
    <div className="flex gap-4 animate-scroll whitespace-nowrap">
      {[...reviews, ...reviews].map((r, i) => (
         <div key={i} className={`inline-block w-64 p-4 rounded-2xl border flex-shrink-0 whitespace-normal ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
            <div className="flex text-amber-400 mb-2 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
            <p className={`text-xs italic mb-2 leading-relaxed line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>"{r.text}"</p>
            <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{r.name}</p>
         </div>
      ))}
    </div>
    <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 80s linear infinite; }`}</style>
  </div>
);

const StepProgress = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 fixed top-[64px] z-30 left-0">
      <div className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${Math.min(progress, 100)}%` }} />
    </div>
  );
};

// ==================================================================================
// 3. LÓGICA & APP
// ==================================================================================

export default function App() {
  // Estados
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Dados do Usuário
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [] };
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // Dados do Agendamento
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
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Helpers
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thalyson Massagens', text: 'Agende sua massagem agora!', url: window.location.href }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado!");
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
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
    const dateStr = booking.date ? booking.date.toLocaleDateString('pt-BR') : '';
    const greeting = getGreeting();
    
    // Gerar Link do Maps
    let addressQuery = "";
    if(booking.locationType === 'home') addressQuery = `${booking.address.street}, ${booking.address.number}, ${booking.address.city}`;
    else addressQuery = `${booking.address.placeName}, ${booking.address.city}`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;

    let localMsg = "";
    if (booking.locationType === 'home') {
      localMsg = `🏠 *Em Domicílio*\nEnd: ${booking.address.street}, ${booking.address.number}\nBairro: ${booking.address.district} - ${booking.address.city}\n_(Comp: ${booking.address.comp || '-'})_`;
    } else {
      const type = booking.locationType === 'motel' ? '🏩 Motel' : '🏨 Hotel';
      localMsg = `${type} *${booking.address.placeName}*\n${booking.address.city}\n_(Quarto: ${booking.address.comp || 'A informar'})_`;
    }

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => `+ ${DB.extras.find(e => e.id === k).label}`).join('\n');

    const msg = `
${greeting}, Thalyson! Tudo bem?
Gostaria de confirmar o seguinte agendamento:

👤 *Cliente:* ${user.name}

💆‍♂️ *SERVIÇO:* ${booking.service?.title}
📅 *Data:* ${dateStr}
⏰ *Horário:* ${booking.time}

${extrasTxt ? `✨ *EXTRAS:*\n${extrasTxt}\n` : ''}
📍 *LOCAL:*
${localMsg}
🔗 *Maps:* ${mapsLink}

💰 *TOTAL FINAL:* R$ ${total},00
💳 *Pagamento:* ${booking.payment === 'pix' ? 'PIX' : booking.payment === 'card' ? 'Cartão' : 'Dinheiro'}

*Aguardo a confirmação!* 🙌
`.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const isStepValid = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { city, street, placeName, number } = booking.address;
      if (!user.name) return false;
      if (!city) return false;
      if (booking.locationType === 'home' && (!street || !number)) return false;
      if (booking.locationType !== 'home' && !placeName) return false;
      return true;
    }
    return true; 
  };

  const handleFinish = () => {
    if (!booking.payment) return showToast("Selecione a forma de pagamento.");
    if (!booking.termsAccepted) return showToast("Aceite os termos.");

    // Salvar XP
    const newXP = user.xp + (booking.service?.xp || 0);
    let newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        newCoupons.push({ id: Date.now(), title: 'Cliente VIP', val: CONFIG.COUPON_LOYALTY_VAL });
    }
    setUser({ ...user, xp: newXP, coupons: newCoupons });
    
    // Ir para tela de sucesso
    setStep(4);
  };

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
       <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 font-black text-2xl animate-spin mb-4">T.</div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 pb-28 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      <Toast show={toast.show} msg={toast.msg} />
      
      {/* MENU LATERAL */}
      {menuOpen && (
          <div className="fixed inset-0 z-[60] flex justify-start">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
             <div className={`relative w-4/5 max-w-xs h-full p-6 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-bold text-xl">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)}><X/></button>
                </div>
                
                <div className="flex-1 space-y-6 overflow-y-auto">
                   <div className="space-y-3">
                      <button onClick={()=>setIsDark(!isDark)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-black/5 transition-colors">
                         {isDark ? <Sun size={20}/> : <Moon size={20}/>} <span>Modo {isDark ? 'Claro' : 'Escuro'}</span>
                      </button>
                      <button onClick={handleShare} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-black/5 transition-colors">
                         <Share2 size={20}/> <span>Compartilhar App</span>
                      </button>
                   </div>

                   <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase opacity-50">Dúvidas</h3>
                      {DB.faqs.map((f,i) => (
                         <details key={i} className="group cursor-pointer border-b border-white/5 pb-2">
                            <summary className="flex justify-between items-center font-bold text-sm list-none p-2 hover:text-emerald-500">{f.q} <ChevronLeft size={16} className="-rotate-90 transition-transform group-open:rotate-90"/></summary>
                            <p className="text-xs p-2 opacity-70 leading-relaxed">{f.a}</p>
                         </details>
                      ))}
                   </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                   <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold justify-center shadow-lg">
                      <Instagram size={20}/> Seguir no Instagram
                   </a>
                </div>
             </div>
          </div>
      )}

      {/* HEADER */}
      <header className={`fixed top-0 w-full h-16 z-40 flex items-center justify-between px-5 border-b backdrop-blur-md transition-colors ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <button onClick={()=>setMenuOpen(true)} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}><Menu size={20}/></button>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">Thalyson Massagens</span>
            <span className="text-[10px] opacity-60 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Online agora</span>
          </div>
        </div>
        <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2 rounded-full border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-white'}`}><Instagram size={18}/></a>
      </header>

      {/* PROGRESSO */}
      {step < 4 && <StepProgress current={step} total={4} />}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">
        
        {/* STEP 0: SERVIÇOS */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Olá, {user.name.split(' ')[0] || 'Visitante'}.</h1>
              <p className="text-sm opacity-60">Escolha a experiência ideal para hoje.</p>
            </div>
            
            <div className="space-y-4">
              {DB.services.map((s) => (
                <div key={s.id} onClick={() => setBooking({ ...booking, service: s })}
                  className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all active:scale-95
                    ${booking.service?.id === s.id 
                      ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500 shadow-xl shadow-emerald-900/20' 
                      : `border-transparent ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white shadow-sm hover:shadow-md'}`
                    }`}
                >
                   {s.badge && <span className="absolute -top-3 right-4 bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider">{s.badge}</span>}
                   <div className="flex justify-between items-start mb-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}><s.icon size={20} /></div>
                      <div className="text-right">
                        <span className="block text-xl font-bold">R$ {s.price}</span>
                        <span className="text-[10px] opacity-60">{s.time}</span>
                      </div>
                   </div>
                   <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                   <p className="text-xs opacity-60 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 pl-2">O que dizem os clientes</h3>
                <ReviewTicker reviews={DB.reviews} isDark={isDark} />
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="space-y-6 animate-slide-in">
             <button onClick={()=>setStep(0)} className="flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
             <div className="text-center">
                <h2 className="text-xl font-bold">Agendamento</h2>
                <p className="text-sm opacity-60">{booking.service?.title}</p>
             </div>

             <div>
                <h3 className="text-xs font-bold uppercase opacity-40 mb-3 ml-1">Data</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date(); d.setDate(d.getDate() + offset);
                    const isSelected = booking.date?.toDateString() === d.toDateString();
                    return (
                      <button key={offset} onClick={() => setBooking({ ...booking, date: d, time: null })}
                        className={`min-w-[4.5rem] h-[5.5rem] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2
                          ${isSelected ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-zinc-100 text-zinc-600'}`}
                      >
                        <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                        <span className="text-2xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             <div className={`transition-opacity duration-500 ${booking.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                <h3 className="text-xs font-bold uppercase opacity-40 mb-3 ml-1">Horários</h3>
                <div className="grid grid-cols-4 gap-2">
                  {['09:00', '10:30', '13:00', '14:30', '16:00', '18:00', '20:00', '21:30'].map((time) => {
                     let disabled = false;
                     if (booking.date) {
                        const now = new Date();
                        const [h] = time.split(':');
                        if (booking.date.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) disabled = true;
                     }
                     return (
                        <button key={time} disabled={disabled} onClick={() => setBooking({ ...booking, time })}
                          className={`py-2.5 rounded-lg text-sm font-bold border transition-all
                            ${booking.time === time ? 'bg-white text-black border-white shadow' : disabled ? 'opacity-20 line-through cursor-not-allowed border-transparent' : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-zinc-200'}`}
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
          <div className="space-y-6 animate-slide-in">
             <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
             <div className="text-center mb-6">
                <h2 className="text-xl font-bold">Local e Dados</h2>
                <p className="text-sm opacity-60">Para onde eu devo ir?</p>
             </div>

             <div className={`p-1 rounded-xl flex ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                {[{ id: 'home', label: 'Em Casa', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${booking.locationType === type.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50 hover:opacity-100'}`}
                  >
                    <type.icon size={14} /> {type.label}
                  </button>
                ))}
             </div>

             <div className="space-y-3">
                <div className={`flex items-center px-4 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                   <User size={16} className="opacity-50 mr-3"/>
                   <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder="Seu Nome" className="w-full py-4 bg-transparent outline-none text-sm font-medium"/>
                </div>

                {booking.locationType === 'home' && (
                  <>
                    <div className="grid grid-cols-[1fr_80px] gap-3">
                       <input placeholder="Rua / Avenida" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                       <input type="tel" placeholder="Nº" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                       <input placeholder="Bairro" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       <input placeholder="Cidade" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>
                    <input placeholder="Complemento (Apto, Bloco...)" className={`w-full p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                  </>
                )}

                {booking.locationType !== 'home' && (
                   <div className="space-y-3">
                      <input placeholder={booking.locationType === 'motel' ? "Nome do Motel" : "Nome do Hotel"} className={`w-full p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                       <div className="grid grid-cols-2 gap-3">
                          <input placeholder="Cidade" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          <input placeholder="Quarto/Suíte" className={`p-4 rounded-xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-4">
               <h3 className="text-xs font-bold uppercase opacity-40 mb-3 ml-1">Extras</h3>
               <div className="space-y-2">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${booking.extras[extra.id] ? 'border-emerald-500 bg-emerald-500/10' : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                   >
                     <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-full ${booking.extras[extra.id] ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}><extra.icon size={14}/></div>
                       <div><p className="text-sm font-bold">{extra.label}</p><p className="text-[10px] opacity-60">{extra.desc}</p></div>
                     </div>
                     <span className={`text-sm font-bold ${booking.extras[extra.id] ? 'text-emerald-500' : 'opacity-40'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="space-y-6 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
             <div className="text-center">
                <h2 className="text-xl font-bold">Resumo</h2>
             </div>

             <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="p-5 space-y-3">
                   <div className="flex justify-between items-center text-sm font-medium"><span>{booking.service.title}</span><span>R$ {booking.service.price}</span></div>
                   {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                     <div key={k} className="flex justify-between items-center text-xs opacity-60"><span>+ {DB.extras.find(e => e.id === k).label}</span><span>R$ {DB.extras.find(e => e.id === k).price}</span></div>
                   ))}
                   {booking.appliedCoupon && (
                     <div className="flex justify-between items-center text-sm font-bold text-emerald-500"><span>Cupom ({booking.appliedCoupon.title})</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                   )}
                   <div className="border-t border-dashed border-zinc-500/30 my-2 pt-3 flex justify-between items-center">
                      <span className="text-lg font-black">Total</span>
                      <span className="text-2xl font-black text-emerald-500">R$ {getFinancials.total}</span>
                   </div>
                </div>
                
                <div className="bg-black/5 p-4 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-xs font-bold opacity-60"><Ticket size={14} /> <span>Cupons:</span></div>
                   {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-500 font-bold hover:underline">Remover</button>
                      ) : (
                        <select onChange={(e) => setBooking({...booking, appliedCoupon: user.coupons.find(c => c.id.toString() === e.target.value)})} className="bg-transparent text-xs font-bold text-emerald-500 outline-none">
                           <option value="">Selecionar</option>
                           {user.coupons.map(c => <option key={c.id} value={c.id}>{c.title} (-R${c.val})</option>)}
                        </select>
                      )
                   ) : <span className="text-xs opacity-40">Nenhum disponível</span>}
                </div>
             </div>

             <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase opacity-40 ml-1">Pagamento</h3>
                <div className="grid grid-cols-3 gap-3">
                   {[{ id: 'pix', label: 'PIX', icon: QrCode }, { id: 'card', label: 'Cartão', icon: CreditCard }, { id: 'money', label: 'Dinheiro', icon: Banknote }].map((p) => (
                     <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                       className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl border transition-all ${booking.payment === p.id ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg' : isDark ? 'bg-zinc-900 border-zinc-800 opacity-60 hover:opacity-100' : 'bg-white border-zinc-200 opacity-60 hover:opacity-100'}`}
                     >
                       <p.icon size={20} /> <span className="text-[10px] font-black uppercase">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-black/5 cursor-pointer transition-colors">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-500'}`}>
                   {booking.termsAccepted && <Check size={16} strokeWidth={3} />}
                </div>
                <p className="text-xs opacity-70 leading-tight">Concordo com os <span className="font-bold underline">Termos de Serviço</span> (cancelamento e conduta).</p>
             </div>
          </div>
        )}

        {/* STEP 4: TELA DE SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-10 animate-scale-in text-center h-full">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                    <Check size={48} className="text-zinc-950" strokeWidth={4}/>
                </div>
                <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Agendado!</h1>
                <p className="text-sm opacity-60 max-w-[250px] mx-auto mb-10">Pedido gerado. Envie a confirmação no WhatsApp para garantir o horário.</p>

                <a href={generateZap()} target="_blank" rel="noreferrer" 
                   className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 animate-pulse transition-transform active:scale-95">
                    <MessageCircle size={24}/> ENVIAR NO WHATSAPP
                </a>
                
                <button onClick={()=>{setStep(0); setBooking({...booking, date:null, time:null, termsAccepted:false});}} className="mt-8 text-xs font-bold opacity-50 hover:opacity-100 underline">Voltar ao início</button>
            </div>
        )}

      </main>

      {/* FOOTER NAVEGAÇÃO */}
      {step < 4 && (
          <div className={`fixed bottom-0 w-full p-4 border-t z-50 backdrop-blur-md ${isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-zinc-200'}`}>
             <div className="max-w-md mx-auto flex items-center gap-4">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in">
                      <span className="block text-[10px] font-bold uppercase opacity-50">Total Estimado</span>
                      <span className="block text-xl font-black text-emerald-500">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!isStepValid()}
                   onClick={() => step === 3 ? handleFinish() : setStep(step + 1)}
                   className={`h-14 rounded-xl font-bold flex items-center justify-center gap-2 px-8 transition-all active:scale-95 shadow-lg ${step < 3 ? 'flex-1 ml-auto' : 'w-full'} ${!isStepValid() ? 'bg-zinc-700 text-zinc-500 cursor-not-allowed opacity-50' : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/20'}`}
                >
                   {step === 3 ? 'FINALIZAR AGORA' : 'CONTINUAR'}
                   {step === 3 ? <CheckCircle2 size={20}/> : <ArrowRight size={20} />}
                </button>
             </div>
          </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); } @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } } .animate-slide-right { animation: slideRight 0.3s ease-out; } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-slide-in { animation: slideUp 0.4s ease-out; } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
