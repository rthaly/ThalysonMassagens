import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Gift, 
  Wallet, User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  Calendar as CalIcon, CheckCircle2, Home, HelpCircle, Share2, 
  CreditCard, Banknote, QrCode, Lock, Info, ExternalLink, Trophy
} from 'lucide-react';

// ==================================================================================
// 1. REGRAS DO NEGÓCIO & GAMIFICAÇÃO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v8_final',
};

// Sistema de Níveis (Gamificação)
const LEVELS = [
  { level: 1, name: "Visitante", minXp: 0, reward: null },
  { level: 2, name: "Amigo", minXp: 400, reward: { val: 20, title: "Desconto Amigo" } },
  { level: 3, name: "Cliente Especial", minXp: 1000, reward: { val: 40, title: "Presente Especial" } }
];

const DB = {
  services: [
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante',
      time: '1h de pura calma',
      price: 145, 
      xp: 145, // R$ 1 = 1 XP
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-500/10',
      desc: "Um momento de pausa. Movimentos suaves para acalmar a mente e o corpo.",
    },
    { 
      id: 'sensitiva', 
      title: 'Massagem Sensitiva',
      time: '1h de sensações',
      badge: 'A FAVORITA ❤️',
      price: 175, 
      xp: 175, 
      icon: Flame, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10',
      desc: "Toques sutis de pele com pele. Uma experiência feita para despertar seus sentidos.",
    },
    { 
      id: 'mista', 
      title: 'Massagem Completa',
      time: '1h30 (Tempo estendido)',
      badge: 'EXPERIÊNCIA TOTAL ✨',
      price: 255, 
      xp: 255, 
      icon: Zap, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      desc: "Começamos tirando a tensão muscular e terminamos com a parte sensitiva.",
    }
  ],
  extras: [
    { id: 'more_time', label: "+30 Minutos", desc: "Para não ter pressa", price: 77, icon: Clock },
    { id: 'touch', label: "Toque Interativo", desc: "Sinta-se livre para tocar", price: 63, icon: Heart },
    { id: 'aroma', label: "Aromaterapia", desc: "Óleos essenciais", price: 5, icon: Smile }
  ],
  faqs: [
    { q: "Onde é o atendimento?", a: "Vou até você (Casa/Hotel) ou podemos combinar em um Motel (escolhemos juntos no Zap)." },
    { q: "Formas de pagamento?", a: "Pix, Dinheiro ou Cartão de Crédito/Débito." },
    { q: "É discreto?", a: "Totalmente. Sua privacidade é minha prioridade absoluta." },
  ],
  reviews: [
    { name: "Ricardo S.", text: "Mão muito leve, me senti renovado.", stars: 5 },
    { name: "André L.", text: "Super respeitoso e gente boa.", stars: 5 },
    { name: "Felipe M.", text: "A sensitiva é incrível. Recomendo.", stars: 5 },
    { name: "Gustavo", text: "Pontual e muito educado.", stars: 5 },
    { name: "M. Oliveira", text: "Me deixou super à vontade.", stars: 5 },
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 pointer-events-none ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
    <div className="bg-emerald-600/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-medium text-sm border border-emerald-400/30">
      <CheckCircle2 size={18} />
      <span>{msg}</span>
    </div>
  </div>
);

const ReviewTicker = ({ reviews, isDark }) => (
  <div className="w-full overflow-hidden relative py-8">
    <div className="flex gap-4 animate-scroll whitespace-nowrap">
      {[...reviews, ...reviews].map((r, i) => (
         <div key={i} className={`inline-block w-64 p-5 rounded-3xl border flex-shrink-0 whitespace-normal ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
            <div className="flex text-amber-400 mb-2 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
            <p className={`text-sm italic mb-3 leading-relaxed line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>"{r.text}"</p>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{r.name}</p>
         </div>
      ))}
    </div>
    <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 80s linear infinite; }`}</style>
  </div>
);

const StepProgress = ({ current, total }) => {
  const progress = ((current + 1) / total) * 100;
  return (
    <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 fixed top-[64px] z-30 left-0">
      <div className="h-full bg-emerald-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ width: `${Math.min(progress, 100)}%` }} />
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // --- ESTADO DO USUÁRIO & GAMIFICAÇÃO ---
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       // Estrutura inicial robusta
       return s ? JSON.parse(s) : { name: '', xp: 0, level: 1, coupons: [] };
    } catch { return { name: '', xp: 0, level: 1, coupons: [] }; }
  });

  const getCurrentLevel = (xp) => {
    // Retorna o objeto do nível atual baseado no XP
    return LEVELS.reduce((prev, curr) => (xp >= curr.minXp ? curr : prev), LEVELS[0]);
  };

  const nextLevel = LEVELS.find(l => l.minXp > user.xp);
  const currentLevelObj = getCurrentLevel(user.xp);

  // --- ESTADO DO AGENDAMENTO ---
  const [booking, setBooking] = useState({
    service: null, 
    extras: {}, 
    date: null, 
    time: null,
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' }, // placeName p/ Hotel
    payment: '', 
    appliedCoupon: null,
    termsAccepted: false
  });

  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thalyson Massagens', text: 'Agende seu momento de paz.', url: window.location.href }); } catch (e) {}
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
    const dateStr = booking.date ? booking.date.toLocaleDateString('pt-BR') : '';
    const h = new Date().getHours();
    const greeting = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    
    // Lógica de Endereço no Zap
    let localMsg = "";
    let mapsLink = "";
    
    if (booking.locationType === 'home') {
      localMsg = `🏠 *Em Domicílio*\n${booking.address.street}, ${booking.address.number}\n${booking.address.district} - ${booking.address.city}\n_(Comp: ${booking.address.comp || '-'})_`;
      const query = `${booking.address.street}, ${booking.address.number}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    } else if (booking.locationType === 'motel') {
      localMsg = `🏩 *Motel*\nVamos decidir juntos qual o melhor.\n⚠️ _Lembrando: Entrada por minha conta (cliente)._`;
      mapsLink = ""; // Sem link pois decidem juntos
    } else {
      localMsg = `🏨 *Hotel*\n${booking.address.placeName}\n${booking.address.city}\n_(Quarto: ${booking.address.comp || 'Vou informar na portaria'})_`;
      const query = `${booking.address.placeName}, ${booking.address.city}`;
      mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    }

    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k])
      .map(k => `+ ${DB.extras.find(e => e.id === k).label}`).join('\n');

    const msg = `
${greeting}, Thalyson! ✨
Quero confirmar meu horário:

👤 *Cliente:* ${user.name}

💆‍♂️ *EXPERIÊNCIA:* ${booking.service?.title}
📅 *Quando:* ${dateStr} às ${booking.time}

${extrasTxt ? `✨ *EXTRAS:*\n${extrasTxt}\n` : ''}
📍 *LOCAL:*
${localMsg}
${mapsLink ? `🔗 *Ver no Mapa:* ${mapsLink}` : ''}

💰 *INVESTIMENTO:* R$ ${total},00
💳 *Pagamento:* ${booking.payment === 'pix' ? 'PIX' : booking.payment === 'card' ? 'Cartão' : 'Dinheiro'}

*Podemos confirmar?* 🙌
`.trim();
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const isStepValid = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { city, street, placeName, number } = booking.address;
      if (!user.name) return false;
      if (booking.locationType === 'home' && (!city || !street || !number)) return false;
      if (booking.locationType === 'hotel' && (!city || !placeName)) return false;
      if (booking.locationType === 'motel') return true; // Motel não precisa de endereço agora
      return true;
    }
    return true; 
  };

  const handleFinish = () => {
    if (!booking.payment) return showToast("Selecione como prefere pagar.");
    if (!booking.termsAccepted) return showToast("Por favor, aceite os termos.");

    // --- LÓGICA DE GAMIFICAÇÃO COMPLETA ---
    const earnedXP = getFinancials.total; // 1 Real = 1 XP
    const newTotalXP = user.xp + earnedXP;
    
    // Verifica se subiu de nível
    const oldLevelObj = getCurrentLevel(user.xp);
    const newLevelObj = getCurrentLevel(newTotalXP);
    
    let updatedCoupons = [...user.coupons];
    
    // Se usou cupom, remove ele
    if(booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    }

    // Se subiu de nível, dá recompensa
    if (newLevelObj.level > oldLevelObj.level && newLevelObj.reward) {
        updatedCoupons.push({
            id: Date.now(),
            title: newLevelObj.reward.title,
            val: newLevelObj.reward.val,
            isNew: true
        });
    }

    setUser({ 
        ...user, 
        xp: newTotalXP, 
        level: newLevelObj.level,
        coupons: updatedCoupons 
    });
    
    setStep(4); // Sucesso
  };

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
       <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center text-zinc-950 font-black text-3xl animate-pulse shadow-[0_0_40px_rgba(16,185,129,0.4)]">T.</div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 pb-32 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      <Toast show={toast.show} msg={toast.msg} />
      
      {/* MENU LATERAL (GAMIFICADO) */}
      {menuOpen && (
          <div className="fixed inset-0 z-[60] flex justify-start">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={()=>setMenuOpen(false)}></div>
             <div className={`relative w-4/5 max-w-xs h-full p-8 shadow-2xl animate-slide-right flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-10">
                   <h2 className="font-bold text-2xl">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)} className="p-2 rounded-full hover:bg-white/10"><X size={24}/></button>
                </div>
                
                {/* Card de Nível */}
                <div className="mb-8 p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg relative overflow-hidden">
                    <Trophy className="absolute -right-4 -bottom-4 text-white/20" size={100} />
                    <p className="text-xs font-bold uppercase opacity-80 mb-1">Seu Nível</p>
                    <h3 className="text-2xl font-black mb-4">{currentLevelObj.name}</h3>
                    
                    <div className="w-full h-2 bg-black/20 rounded-full mb-2 overflow-hidden">
                        <div className="h-full bg-white transition-all duration-1000" style={{ width: nextLevel ? `${(user.xp / nextLevel.minXp) * 100}%` : '100%' }}></div>
                    </div>
                    <div className="flex justify-between text-xs font-medium opacity-90">
                        <span>{user.xp} XP</span>
                        <span>{nextLevel ? `Próx: ${nextLevel.minXp}` : 'Máximo!'}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-4 overflow-y-auto">
                   <button onClick={()=>setIsDark(!isDark)} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      {isDark ? <Sun size={20}/> : <Moon size={20}/>} <span>Modo {isDark ? 'Claro' : 'Escuro'}</span>
                   </button>
                   <button onClick={handleShare} className="flex items-center gap-4 w-full p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                      <Share2 size={20}/> <span>Compartilhar</span>
                   </button>

                   <div className="pt-4 space-y-4">
                      <h3 className="text-xs font-bold uppercase opacity-40 px-2">Dúvidas Frequentes</h3>
                      {DB.faqs.map((f,i) => (
                         <details key={i} className="group cursor-pointer border-b border-white/5 pb-2 px-2">
                            <summary className="flex justify-between items-center font-bold text-sm list-none py-2 hover:text-emerald-500 transition-colors">{f.q} <ChevronLeft size={16} className="-rotate-90 transition-transform group-open:rotate-90 opacity-50"/></summary>
                            <p className="text-sm py-2 opacity-60 leading-relaxed font-light">{f.a}</p>
                         </details>
                      ))}
                   </div>
                </div>

                <div className="pt-8">
                   <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold justify-center shadow-lg hover:shadow-purple-500/20 transition-all">
                      <Instagram size={20}/> @seumssagista
                   </a>
                </div>
             </div>
          </div>
      )}

      {/* HEADER */}
      <header className={`fixed top-0 w-full h-16 z-40 flex items-center justify-between px-6 border-b backdrop-blur-md transition-colors duration-500 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <button onClick={()=>setMenuOpen(true)} className={`p-2.5 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}><Menu size={22}/></button>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wide">Thalyson Massagens</span>
            <span className="text-[10px] opacity-60 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"/> Online agora</span>
          </div>
        </div>
        <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2.5 rounded-full border transition-all hover:scale-105 ${isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-slate-200 bg-white text-slate-600'}`}><Instagram size={20}/></a>
      </header>

      {/* PROGRESSO */}
      {step < 4 && <StepProgress current={step} total={4} />}

      <main className="pt-28 px-6 max-w-md mx-auto animate-fade-in">
        
        {/* STEP 0: SERVIÇOS */}
        {step === 0 && (
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Olá, {user.name.split(' ')[0] || 'Visitante'}.</h1>
              <p className="text-base opacity-60 font-light">Vamos relaxar? Escolha como quer se sentir hoje.</p>
            </div>
            
            <div className="space-y-6">
              {DB.services.map((s) => (
                <div key={s.id} onClick={() => setBooking({ ...booking, service: s })}
                  className={`relative p-6 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 active:scale-95 group
                    ${booking.service?.id === s.id 
                      ? 'border-emerald-500 bg-emerald-500/5 shadow-2xl shadow-emerald-500/10' 
                      : `border-transparent ${isDark ? 'bg-zinc-900 hover:bg-zinc-800' : 'bg-white shadow-md hover:shadow-lg'}`
                    }`}
                >
                   {s.badge && <span className="absolute -top-3 right-6 bg-emerald-500 text-zinc-950 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/30">{s.badge}</span>}
                   
                   <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${s.bg} ${s.color}`}><s.icon size={24} /></div>
                      <div className="text-right">
                        <span className="block text-2xl font-bold tracking-tight">R$ {s.price}</span>
                        <span className="text-[10px] font-bold uppercase opacity-40 tracking-wider">Investimento</span>
                      </div>
                   </div>
                   
                   <h3 className="font-bold text-xl mb-2">{s.title}</h3>
                   <p className="text-sm opacity-60 leading-relaxed font-light">{s.desc}</p>
                   
                   <div className="mt-4 pt-4 border-t border-dashed border-zinc-500/10 flex items-center gap-2 text-xs opacity-50 font-medium">
                      <Clock size={12}/> {s.time}
                   </div>
                </div>
              ))}
            </div>
            
            <div>
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-40 mb-4 pl-2">Clientes Felizes</h3>
                <ReviewTicker reviews={DB.reviews} isDark={isDark} />
            </div>
          </div>
        )}

        {/* STEP 1: DATA E HORA */}
        {step === 1 && (
          <div className="space-y-8 animate-slide-in">
             <button onClick={()=>setStep(0)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Escolher outro serviço</button>
             
             <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">Quando você vem?</h2>
                <p className="text-sm opacity-60 font-light">Reserve seu horário de paz.</p>
             </div>

             {/* Calendário */}
             <div className="space-y-3">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                  {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                    const d = new Date(); d.setDate(d.getDate() + offset);
                    const isSelected = booking.date?.toDateString() === d.toDateString();
                    return (
                      <button key={offset} onClick={() => setBooking({ ...booking, date: d, time: null })}
                        className={`min-w-[5rem] h-[6rem] rounded-3xl flex flex-col items-center justify-center gap-1 transition-all border-2
                          ${isSelected ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg shadow-emerald-500/20 scale-105' : isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-100 text-zinc-400'}`}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}</span>
                        <span className="text-3xl font-black">{d.getDate()}</span>
                      </button>
                    );
                  })}
                </div>
             </div>

             {/* Horários */}
             <div className={`transition-all duration-500 ${booking.date ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
                <h3 className="text-xs font-bold uppercase opacity-40 mb-4 ml-1">Horários Disponíveis</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['09:00', '10:30', '13:00', '14:30', '16:00', '18:00', '20:00', '21:30'].map((time) => {
                     let disabled = false;
                     if (booking.date) {
                        const now = new Date();
                        const [h] = time.split(':');
                        if (booking.date.toDateString() === now.toDateString() && parseInt(h) <= now.getHours()) disabled = true;
                     }
                     return (
                        <button key={time} disabled={disabled} onClick={() => setBooking({ ...booking, time })}
                          className={`py-3 rounded-xl text-xs font-bold border transition-all
                            ${booking.time === time 
                                ? 'bg-white text-black border-white shadow-lg scale-105' 
                                : disabled ? 'opacity-20 line-through cursor-not-allowed border-transparent' : isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 text-zinc-400' : 'bg-white border-zinc-200 text-zinc-600'}`}
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
             <button onClick={()=>setStep(1)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Alterar horário</button>
             
             <div className="text-center space-y-1 mb-8">
                <h2 className="text-2xl font-bold">Onde te encontro?</h2>
                <p className="text-sm opacity-60 font-light">Fique tranquilo, sou totalmente discreto.</p>
             </div>

             <div className={`p-1.5 rounded-2xl flex ${isDark ? 'bg-zinc-900' : 'bg-zinc-200'}`}>
                {[{ id: 'home', label: 'Em Casa', icon: Home }, { id: 'motel', label: 'Motel', icon: BedDouble }, { id: 'hotel', label: 'Hotel', icon: Building }].map((type) => (
                  <button key={type.id} onClick={() => setBooking({ ...booking, locationType: type.id })}
                    className={`flex-1 py-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-300 ${booking.locationType === type.id ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}
                  >
                    <type.icon size={16} /> {type.label}
                  </button>
                ))}
             </div>

             <div className="space-y-4">
                <div className={`flex items-center px-5 rounded-2xl border transition-colors focus-within:border-emerald-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                   <User size={18} className="opacity-40 mr-4"/>
                   <input value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} placeholder="Seu Nome" className="w-full py-5 bg-transparent outline-none text-sm font-medium"/>
                </div>

                {booking.locationType === 'home' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-[1fr_80px] gap-4">
                       <input placeholder="Rua / Avenida" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.street} onChange={(e) => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                       <input type="tel" placeholder="Nº" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.number} onChange={(e) => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <input placeholder="Bairro" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.district} onChange={(e) => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                       <input placeholder="Cidade" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                    </div>
                    <input placeholder="Complemento (Apto, Bloco...)" className={`w-full p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                  </div>
                )}

                {booking.locationType === 'motel' && (
                    <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-500 animate-fade-in">
                        <div className="flex gap-3 mb-2">
                            <Info size={20} className="shrink-0"/>
                            <p className="font-bold text-sm">Combinamos no Zap!</p>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed pl-8">
                            Para sua comodidade, escolhemos o motel juntos no WhatsApp. <br/>
                            <span className="font-bold block mt-2">⚠️ Importante: O valor do período (entrada) é pago diretamente ao motel por você.</span>
                        </p>
                    </div>
                )}

                {booking.locationType === 'hotel' && (
                   <div className="space-y-4 animate-fade-in">
                      <input placeholder="Nome do Hotel" className={`w-full p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.placeName} onChange={(e) => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} />
                       <div className="grid grid-cols-2 gap-4">
                          <input placeholder="Cidade" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.city} onChange={(e) => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                          <input placeholder="Quarto" className={`p-5 rounded-2xl border text-sm outline-none ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} value={booking.address.comp} onChange={(e) => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                       </div>
                   </div>
                )}
             </div>

             <div className="pt-6">
               <h3 className="text-xs font-bold uppercase opacity-40 mb-4 ml-1">Deseja adicionar algo?</h3>
               <div className="space-y-3">
                 {DB.extras.map(extra => (
                   <div key={extra.id} onClick={() => setBooking({ ...booking, extras: { ...booking.extras, [extra.id]: !booking.extras[extra.id] } })}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${booking.extras[extra.id] ? 'border-emerald-500 bg-emerald-500/5' : isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-2.5 rounded-full ${booking.extras[extra.id] ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}><extra.icon size={16}/></div>
                       <div><p className="text-sm font-bold">{extra.label}</p><p className="text-[11px] opacity-60">{extra.desc}</p></div>
                     </div>
                     <span className={`text-sm font-bold ${booking.extras[extra.id] ? 'text-emerald-500' : 'opacity-30'}`}>+ R$ {extra.price}</span>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* STEP 3: RESUMO E PAGAMENTO */}
        {step === 3 && (
          <div className="space-y-8 animate-slide-in pb-10">
             <button onClick={()=>setStep(2)} className="flex items-center gap-2 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity"><ChevronLeft size={16}/> Voltar</button>
             
             <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold">Resumo do Pedido</h2>
                <p className="text-sm opacity-60 font-light">Quase lá! Confira os detalhes.</p>
             </div>

             <div className={`rounded-3xl border overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                <div className="p-6 space-y-4">
                   <div className="flex justify-between items-center text-base font-medium"><span>{booking.service.title}</span><span>R$ {booking.service.price}</span></div>
                   
                   {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                     <div key={k} className="flex justify-between items-center text-sm opacity-60"><span>+ {DB.extras.find(e => e.id === k).label}</span><span>R$ {DB.extras.find(e => e.id === k).price}</span></div>
                   ))}
                   
                   {booking.appliedCoupon && (
                     <div className="flex justify-between items-center text-sm font-bold text-emerald-500 bg-emerald-500/10 p-2 rounded-lg">
                        <span>Cupom ({booking.appliedCoupon.title})</span>
                        <span>- R$ {booking.appliedCoupon.val}</span>
                     </div>
                   )}
                   
                   <div className="border-t border-dashed border-zinc-500/20 my-2 pt-4 flex justify-between items-center">
                      <span className="text-lg font-black opacity-80">Total Final</span>
                      <span className="text-3xl font-black text-emerald-500">R$ {getFinancials.total}</span>
                   </div>
                </div>
                
                {/* Seletor de Cupom Funcional */}
                <div className="bg-black/5 p-5 flex items-center justify-between">
                   <div className="flex items-center gap-3 text-xs font-bold opacity-60"><Ticket size={16} /> <span>Seus Cupons:</span></div>
                   {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"><Trash2 size={12}/> Remover</button>
                      ) : (
                        <select 
                            onChange={(e) => {
                                const c = user.coupons.find(coup => coup.id.toString() === e.target.value);
                                setBooking({...booking, appliedCoupon: c});
                            }} 
                            className="bg-transparent text-xs font-bold text-emerald-500 outline-none cursor-pointer uppercase tracking-wider text-right w-32"
                        >
                           <option value="">Selecionar...</option>
                           {user.coupons.map(c => <option key={c.id} value={c.id}>{c.title} (-R${c.val})</option>)}
                        </select>
                      )
                   ) : <span className="text-xs opacity-40">Nenhum disponível</span>}
                </div>
             </div>

             <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase opacity-40 ml-1">Forma de Pagamento</h3>
                <div className="grid grid-cols-3 gap-3">
                   {[{ id: 'pix', label: 'PIX', icon: QrCode }, { id: 'card', label: 'Cartão', icon: CreditCard }, { id: 'money', label: 'Dinheiro', icon: Banknote }].map((p) => (
                     <button key={p.id} onClick={() => setBooking({ ...booking, payment: p.id })}
                       className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border transition-all duration-300 ${booking.payment === p.id ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg scale-105' : isDark ? 'bg-zinc-900 border-zinc-800 opacity-60 hover:opacity-100' : 'bg-white border-zinc-200 opacity-60 hover:opacity-100'}`}
                     >
                       <p.icon size={22} /> <span className="text-[10px] font-black uppercase tracking-wider">{p.label}</span>
                     </button>
                   ))}
                </div>
             </div>

             <div onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})} className="flex items-center gap-4 p-4 rounded-2xl border border-transparent hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all shrink-0 ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-500'}`}>
                   {booking.termsAccepted && <Check size={16} strokeWidth={4} />}
                </div>
                <p className="text-xs opacity-60 leading-relaxed">
                   Li e concordo com a política de cancelamento e garanto respeito mútuo durante o atendimento.
                </p>
             </div>
          </div>
        )}

        {/* STEP 4: TELA DE SUCESSO */}
        {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-10 animate-scale-in text-center h-full">
                <div className="relative mb-8">
                     <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                     <div className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-teal-600 rounded-full flex items-center justify-center shadow-2xl relative z-10">
                        <Check size={56} className="text-white" strokeWidth={4}/>
                     </div>
                </div>
                
                <h1 className="text-4xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Tudo Certo!</h1>
                <p className="text-base opacity-60 max-w-[280px] mx-auto mb-12 font-light leading-relaxed">
                    Seu pedido foi gerado. Agora é só enviar a mensagem no WhatsApp para eu confirmar o horário na agenda.
                </p>

                <a href={generateZap()} target="_blank" rel="noreferrer" 
                   className="w-full py-5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-2xl text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 animate-bounce-slow transition-transform active:scale-95">
                    <MessageCircle size={26} fill="black"/> CONFIRMAR NO ZAP
                </a>
                
                <button onClick={()=>{setStep(0); setBooking({...booking, date:null, time:null, termsAccepted:false});}} className="mt-10 text-xs font-bold opacity-40 hover:opacity-100 hover:tracking-widest transition-all">
                    VOLTAR AO INÍCIO
                </button>
            </div>
        )}

      </main>

      {/* FOOTER NAVEGAÇÃO */}
      {step < 4 && (
          <div className={`fixed bottom-0 w-full p-5 border-t z-50 backdrop-blur-xl transition-all duration-500 ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-zinc-200'}`}>
             <div className="max-w-md mx-auto flex items-center gap-5">
                {step < 3 && booking.service && (
                   <div className="flex-1 animate-fade-in">
                      <span className="block text-[10px] font-bold uppercase opacity-40 tracking-wider mb-0.5">Total Estimado</span>
                      <span className="block text-2xl font-black text-emerald-500">R$ {getFinancials.total}</span>
                   </div>
                )}
                
                <button
                   disabled={!isStepValid()}
                   onClick={() => step === 3 ? handleFinish() : setStep(step + 1)}
                   className={`h-16 rounded-2xl font-bold flex items-center justify-center gap-3 px-8 transition-all active:scale-95 shadow-lg
                     ${step < 3 ? 'flex-1 ml-auto' : 'w-full'} 
                     ${!isStepValid() 
                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50 shadow-none' 
                        : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/25'}`}
                >
                   {step === 3 ? 'CONCLUIR PEDIDO' : 'CONTINUAR'}
                   {step === 3 ? <CheckCircle2 size={22}/> : <ArrowRight size={22} />}
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
        .animate-fade-in { animation: fadeIn 0.6s ease-out; } 
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } 
        .animate-slide-in { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); } 
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-bounce-slow { animation: bounce 3s infinite; }
      `}</style>
    </div>
  );
}
