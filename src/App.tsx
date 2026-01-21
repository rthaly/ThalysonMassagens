import React, { useState, useEffect, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, AlertTriangle, Zap, Menu, X, Gift, 
  Wallet, User, Copy, Navigation, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, Globe, Languages, History,
  ShieldCheck, Loader2, Award, Calendar as CalIcon
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & CONSTANTES (CORE)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "https://instagram.com/seumssagista", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: '@thaly_app_v2_ultimate', // Chave nova para limpar cache antigo
  XP_TARGET: 500, 
  COUPON_LOYALTY_VAL: 35, // Aumentei o valor para fidelizar
  COUPON_WELCOME_VAL: 15, // Aumentei para conversão
  LEVELS: [
    { name: "Iniciante", min: 0, color: "text-zinc-500" },
    { name: "Cliente VIP", min: 500, color: "text-green-500" },
    { name: "Embaixador", min: 1500, color: "text-yellow-500" }
  ]
};

const DB = {
  services: [
    { 
      id: 'completa', 
      title: 'Tantra Experience',
      badge: 'MAIS VENDIDO 🔥',
      price: 180, 
      xp: 200, 
      icon: Flame, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      desc: "A experiência sensorial definitiva. Conexão total.",
      details: ["Massagem Tântrica", "Corpo a corpo", "Finalização Especial"]
    },
    { 
      id: 'relax', 
      title: 'Deep Tissue Relax',
      badge: 'TERAPÊUTICO 🌿',
      price: 150, 
      xp: 150, 
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-500/10',
      desc: "Remoção de nódulos de tensão e dores musculares.",
      details: ["Liberação Miofascial", "Ventosaterapia", "Óleos Medicinais"]
    }
  ],
  extras: [
    { id: 'more_time', label: "Sessão Estendida (+30m)", price: 70, icon: Clock },
    { id: 'touch', label: "Interatividade Total", price: 65, icon: Heart },
    { id: 'aroma', label: "Kit Aromaterapia Premium", price: 15, icon: Smile }
  ],
  reviews: [
    { name: "Tiago M.", text: "Mãos firmes e técnica com os rolos é diferenciada.", stars: 5 },
    { name: "Bruno S.", text: "O ambiente que ele cria é surreal. Relaxamento total.", stars: 5 },
    { name: "Anônimo", text: "Muito discreto e profissional. Virei cliente fiel.", stars: 5 }
  ]
};

const TEXTS = {
  pt: {
    welcome_back: "Bem-vindo de volta,",
    loyalty_prog: "Faltam {xp} XP para sua próxima recompensa!",
    level: "Nível Atual:",
    history_btn: "Meus Pedidos",
    history_empty: "Nenhum agendamento anterior.",
    rebook: "Pedir Novamente",
    geo_btn: "Usar minha localização atual",
    geo_error: "Permissão de local negada.",
    terms: "Li e concordo com os Termos de Serviço e Política de Privacidade.",
    fill_all: "Por favor, preencha todos os campos obrigatórios.",
    scarcity: "Restam poucos horários hoje!",
    next_level: "Próximo Nível"
  },
  en: {
    welcome_back: "Welcome back,",
    loyalty_prog: "{xp} XP left until your next reward!",
    level: "Current Level:",
    history_btn: "My Orders",
    history_empty: "No previous bookings.",
    rebook: "Book Again",
    geo_btn: "Use my current location",
    geo_error: "Location permission denied.",
    terms: "I agree to the Terms of Service and Privacy Policy.",
    fill_all: "Please fill in all required fields.",
    scarcity: "Few slots left today!",
    next_level: "Next Level"
  }
};

// ==================================================================================
// 2. UTILS & HOOKS
// ==================================================================================

const formatPhone = (v) => {
  v = v.replace(/\D/g, "");
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");
  return v;
};

const getLevel = (xp) => {
  return CONFIG.LEVELS.slice().reverse().find(l => xp >= l.min) || CONFIG.LEVELS[0];
};

const getNextLevelXP = (xp) => {
  const next = CONFIG.LEVELS.find(l => l.min > xp);
  return next ? next.min : xp; // Se for max, retorna atual
};

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const ProgressBar = ({ current, max, color }) => (
  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2 dark:bg-zinc-800">
    <div 
      className={`h-full transition-all duration-1000 ease-out ${color || 'bg-green-500'}`} 
      style={{ width: `${Math.min((current / max) * 100, 100)}%` }}
    ></div>
  </div>
);

const Toast = ({ msg, show }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <div className="bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-zinc-800">
      <Check size={16} className="text-green-500" />
      <span className="text-xs font-bold">{msg}</span>
    </div>
  </div>
);

// ==================================================================================
// 4. APP ENGINE
// ==================================================================================

export default function App() {
  // --- STATES ---
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  const [walletOpen, setWalletOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // USER DATA
  const [user, setUser] = useState({ 
    name: '', 
    phone: '', 
    xp: 0, 
    coupons: [{ id: 'WELCOME', val: CONFIG.COUPON_WELCOME_VAL, title: 'Bem-vindo' }],
    history: [] 
  });

  // BOOKING DATA
  const [booking, setBooking] = useState({
    service: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home',
    address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
    payment: 'pix',
    appliedCoupon: null,
    termsAccepted: false
  });

  // --- EFFECTS ---
  
  useEffect(() => {
    // Load Data
    setTimeout(() => setLoading(false), 2000);
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    // Save Data
    if (!loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user));
  }, [user, loading]);

  // --- ACTIONS ---

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleGeoLocation = () => {
    if (!navigator.geolocation) return showToast(TEXTS[lang].geo_error);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      // Simulação de Reverse Geocoding (num app real usaria Google Maps API)
      setBooking(prev => ({
        ...prev,
        address: { ...prev.address, city: 'Local Detectado (GPS)', street: 'Preenchimento Automático', district: 'Centro' }
      }));
      showToast("Localização encontrada!");
    }, () => showToast(TEXTS[lang].geo_error));
  };

  const calculateTotal = () => {
    let s = booking.service?.price || 0;
    let e = Object.keys(booking.extras).reduce((acc, k) => booking.extras[k] ? acc + DB.extras.find(x => x.id === k).price : acc, 0);
    let d = booking.appliedCoupon?.val || 0;
    return { sub: s + e, disc: d, total: Math.max(0, s + e - d) };
  };

  const validateStep = () => {
    if (step === 0) {
       if (!user.name || !booking.service) return showToast("Informe seu nome e escolha um serviço.");
    }
    if (step === 1) {
       if (!booking.date || !booking.time) return showToast("Escolha data e horário.");
    }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishOrder = () => {
    if (!booking.termsAccepted) return showToast("Aceite os termos para continuar.");
    if (booking.locationType === 'home' && !booking.address.street) return showToast("Preencha o endereço.");

    // 1. Update User Stats & History
    const totals = calculateTotal();
    const newXP = user.xp + (booking.service.xp);
    const newHistory = [{
      id: Date.now(),
      date: new Date().toISOString(),
      serviceId: booking.service.id,
      total: totals.total
    }, ...user.history];

    // Loyalty Check
    let newCoupons = [...user.coupons];
    if (booking.appliedCoupon) newCoupons = newCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
      newCoupons.push({ id: Date.now(), title: 'Fidelidade VIP', val: CONFIG.COUPON_LOYALTY_VAL });
    }

    setUser({ ...user, xp: newXP, history: newHistory, coupons: newCoupons });

    // 2. Generate WhatsApp
    const msg = generateWhatsAppMessage(totals);
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  const generateWhatsAppMessage = (totals) => {
    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => `+ ${DB.extras.find(e => e.id === k).label}`).join('\n');
    let locTxt = "";
    if (booking.locationType === 'home') locTxt = `🏠 *Casa:* ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
    else if (booking.locationType === 'motel') locTxt = `🏩 *Motel:* ${booking.address.motelName} (Ste: ${booking.address.suite})`;
    else locTxt = `🏨 *Hotel:* ${booking.address.hotelName} (Qto: ${booking.address.room})`;

    return `
*NOVO AGENDAMENTO VIP* 🚀
----------------------------
👤 *Cliente:* ${user.name}
📱 *Tel:* ${user.phone || 'N/A'}
🏆 *Nível:* ${getLevel(user.xp).name}

💆 *SERVIÇO:* ${booking.service.title}
📅 *DATA:* ${booking.date?.toLocaleDateString()} às ${booking.time}

✨ *EXTRAS:*
${extrasTxt || "Padrão"}

📍 *LOCAL:*
${locTxt}
🏙️ *Cidade:* ${booking.address.city}

💰 *RESUMO:*
Serviço: R$ ${booking.service.price}
Total Extras: R$ ${(totals.sub - booking.service.price)}
Desconto: -R$ ${totals.disc}
*TOTAL FINAL: R$ ${totals.total},00*
----------------------------
Pagamento via: ${booking.payment.toUpperCase()}
    `.trim();
  };

  // --- RENDER HELPERS ---
  const T = TEXTS[lang];
  const currentLevel = getLevel(user.xp);
  const nextLevelXP = getNextLevelXP(user.xp);

  if (loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-black'}`}>
      <Loader2 size={48} className="animate-spin text-green-500 mb-4"/>
      <p className="text-xs uppercase tracking-widest animate-pulse">Carregando Experiência...</p>
    </div>
  );

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 font-sans ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-gray-50 text-zinc-900'}`}>
      
      <Toast show={toast.show} msg={toast.msg} />

      {/* HEADER */}
      <div className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b px-5 h-16 flex justify-between items-center ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-zinc-200'}`}>
        <div className="flex items-center gap-2" onClick={() => setStep(0)}>
           <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center font-black text-black">T.</div>
           <div>
             <p className="text-[10px] opacity-50 uppercase tracking-widest leading-none">App Oficial</p>
             <p className="font-bold leading-none">Thalyson</p>
           </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setHistoryOpen(true)} className={`p-2 rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}><History size={18}/></button>
            <button onClick={() => setWalletOpen(true)} className={`relative p-2 rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                <Gift size={18} className={user.coupons.length > 0 ? "text-green-500" : ""}/>
                {user.coupons.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-zinc-900"></span>}
            </button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
        </div>
      </div>

      {/* MODALS (History & Wallet) */}
      {(walletOpen || historyOpen) && (
         <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className={`w-full max-w-sm rounded-3xl p-6 animate-slide-up ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {walletOpen ? <><Wallet className="text-green-500"/> Carteira</> : <><History className="text-blue-500"/> Histórico</>}
                    </h3>
                    <button onClick={() => {setWalletOpen(false); setHistoryOpen(false)}} className="p-2 bg-zinc-800 rounded-full"><X size={16}/></button>
                </div>
                
                {walletOpen && (
                   <div className="space-y-3">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-700 rounded-2xl p-4 text-black mb-4">
                         <div className="flex justify-between items-start mb-2">
                            <span className="bg-black/20 px-2 py-1 rounded text-[10px] font-bold uppercase text-white backdrop-blur-md">{currentLevel.name}</span>
                            <Award className="text-white/50" />
                         </div>
                         <p className="text-3xl font-black text-white">{user.xp} XP</p>
                         <p className="text-xs text-white/80 mt-1">{T.loyalty_prog.replace('{xp}', nextLevelXP - user.xp)}</p>
                         <div className="w-full h-1 bg-black/20 rounded-full mt-3 overflow-hidden">
                            <div className="h-full bg-white transition-all" style={{ width: `${(user.xp / nextLevelXP)*100}%` }}></div>
                         </div>
                      </div>
                      <h4 className="text-xs font-bold uppercase opacity-50">Seus Cupons</h4>
                      {user.coupons.length === 0 ? <p className="text-sm opacity-50">Nenhum cupom disponível.</p> : user.coupons.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-3 border border-green-500/30 bg-green-500/5 rounded-xl">
                           <div><p className="font-bold text-green-500">{c.title}</p><p className="text-xs">R$ {c.val},00 OFF</p></div>
                           <button onClick={() => { setBooking({...booking, appliedCoupon: c}); setWalletOpen(false); }} className="text-xs bg-green-500 text-black font-bold px-3 py-1.5 rounded-lg">Usar</button>
                        </div>
                      ))}
                   </div>
                )}

                {historyOpen && (
                  <div className="max-h-[60vh] overflow-y-auto space-y-3">
                     {user.history.length === 0 ? <p className="text-center opacity-50 py-10">{T.history_empty}</p> : user.history.map(h => {
                       const s = DB.services.find(x => x.id === h.serviceId) || DB.services[0];
                       return (
                         <div key={h.id} className={`p-4 rounded-xl border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                            <div className="flex justify-between mb-2">
                              <span className="font-bold">{s.title}</span>
                              <span className="text-xs opacity-50">{new Date(h.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center mt-3">
                               <span className="font-mono text-sm">R$ {h.total},00</span>
                               <button onClick={() => { setBooking({...booking, service: s}); setHistoryOpen(false); setStep(0); }} className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline">{T.rebook} <ArrowRight size={12}/></button>
                            </div>
                         </div>
                       )
                     })}
                  </div>
                )}
            </div>
         </div>
      )}

      {/* MAIN CONTENT */}
      <main className="pt-24 px-5 max-w-md mx-auto">
        
        {/* STEP 0: SELECTION */}
        {step === 0 && (
          <div className="animate-fade-in space-y-8">
            <div>
              <h1 className="text-2xl font-black mb-1">{T.welcome_back} {user.name.split(' ')[0] || "Visitante"}</h1>
              <p className="text-sm opacity-60">Vamos agendar seu momento de paz?</p>
            </div>

            <div className="space-y-4">
               <div className="relative">
                  <User className="absolute left-4 top-3.5 opacity-50" size={18}/>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Seu Nome Completo" className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 focus:border-green-500' : 'bg-white border-zinc-200'}`} />
               </div>
               <div className="relative">
                  <MessageCircle className="absolute left-4 top-3.5 opacity-50" size={18}/>
                  <input type="tel" maxLength={15} value={user.phone} onChange={e => setUser({...user, phone: formatPhone(e.target.value)})} placeholder="(00) 00000-0000" className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 focus:border-green-500' : 'bg-white border-zinc-200'}`} />
               </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-4">
                 <h3 className="text-xs font-bold uppercase tracking-widest opacity-50">Serviços Disponíveis</h3>
                 <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded animate-pulse">{T.scarcity}</span>
              </div>
              <div className="space-y-4">
                {DB.services.map(s => (
                  <div key={s.id} onClick={() => setBooking({...booking, service: s})} 
                    className={`relative p-5 rounded-2xl border cursor-pointer transition-all group overflow-hidden
                    ${booking.service?.id === s.id 
                      ? 'border-green-500 bg-green-500/5 ring-1 ring-green-500' 
                      : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-zinc-200 shadow-sm')}`}
                  >
                    {s.badge && <div className="absolute top-0 right-0 bg-green-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                    <div className="flex gap-4">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${s.bg} ${s.color}`}><s.icon size={24}/></div>
                       <div className="flex-1">
                          <h3 className="font-bold text-lg leading-tight mb-1">{s.title}</h3>
                          <p className="text-xs opacity-60 mb-3">{s.desc}</p>
                          <ul className="grid grid-cols-1 gap-1 mb-3">
                             {s.details.map((d,i) => <li key={i} className="text-[10px] flex items-center gap-1 opacity-80"><Check size={10} className="text-green-500"/> {d}</li>)}
                          </ul>
                          <div className="flex items-center justify-between border-t border-dashed border-white/10 pt-3">
                             <div className="text-xs font-bold opacity-50 flex items-center gap-1"><Zap size={12}/> {s.xp} XP</div>
                             <div className="text-xl font-black">R$ {s.price}</div>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: EXTRAS & TIME */}
        {step === 1 && (
           <div className="animate-slide-in space-y-8">
              <div>
                 <h2 className="font-bold text-xl mb-4">Personalize sua Sessão</h2>
                 <div className="space-y-3">
                    {DB.extras.map(ex => (
                       <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !booking.extras[ex.id]}})}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'border-green-500 bg-green-500/10' : (isDark ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-white')}`}
                       >
                          <div className="flex items-center gap-3">
                             <ex.icon size={18} className={booking.extras[ex.id] ? "text-green-500" : "opacity-50"}/>
                             <span className="font-medium text-sm">{ex.label}</span>
                          </div>
                          <span className="text-sm font-bold opacity-70">+ R$ {ex.price}</span>
                       </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h2 className="font-bold text-xl mb-4">Escolha o Horário</h2>
                 <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
                    {[0,1,2,3,4,5,6].map(offset => {
                       const d = new Date(); d.setDate(d.getDate() + offset);
                       const isSelected = booking.date?.toDateString() === d.toDateString();
                       const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                       return (
                          <button key={offset} onClick={() => setBooking({...booking, date: d, time: null})}
                             className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'bg-green-500 text-black border-green-500' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200')}`}
                          >
                             <span className="text-[10px] uppercase font-bold opacity-70">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                             <span className="text-2xl font-black">{d.getDate()}</span>
                             {isWeekend && <span className="text-[8px] bg-red-500 text-white px-1 rounded absolute top-1 right-1">fimdes</span>}
                          </button>
                       )
                    })}
                 </div>
                 
                 {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in">
                       {['09:00','10:30','13:00','15:00','17:00','19:00','21:00'].map(t => (
                          <button key={t} onClick={() => setBooking({...booking, time: t})} className={`py-2 rounded-lg text-xs font-bold border ${booking.time === t ? 'bg-white text-black border-white' : 'border-zinc-700 hover:border-zinc-500 text-zinc-400'}`}>{t}</button>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* STEP 2: DETAILS & CHECKOUT */}
        {step === 2 && (
           <div className="animate-slide-in space-y-8 pb-10">
              {/* Location Switcher */}
              <div className={`p-1 rounded-xl flex ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                 {[{id:'home', l:'Em Casa'}, {id:'motel', l:'Motel'}, {id:'hotel', l:'Hotel'}].map(x => (
                    <button key={x.id} onClick={() => setBooking({...booking, locationType: x.id})} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white shadow text-black') : 'opacity-50'}`}>{x.l}</button>
                 ))}
              </div>

              {/* Dynamic Form */}
              <div className="space-y-3">
                 <button onClick={handleGeoLocation} className="w-full py-3 border border-dashed border-green-500/50 text-green-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-500/10 mb-4">
                    <MapPin size={14}/> {T.geo_btn}
                 </button>
                 <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2"><input placeholder="Cidade" value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} /></div>
                    <div className="col-span-1"><input placeholder="UF" className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} /></div>
                 </div>
                 {booking.locationType === 'home' && (
                    <>
                       <input placeholder="Rua / Avenida" value={booking.address.street} onChange={e=>setBooking({...booking, address: {...booking.address, street: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
                       <div className="grid grid-cols-2 gap-3">
                          <input placeholder="Número" type="tel" value={booking.address.number} onChange={e=>setBooking({...booking, address: {...booking.address, number: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
                          <input placeholder="Bairro" value={booking.address.district} onChange={e=>setBooking({...booking, address: {...booking.address, district: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
                       </div>
                    </>
                 )}
                 {booking.locationType !== 'home' && (
                    <div className="grid grid-cols-2 gap-3">
                       <input placeholder={booking.locationType === 'motel' ? "Nome do Motel" : "Nome do Hotel"} value={booking.locationType === 'motel' ? booking.address.motelName : booking.address.hotelName} onChange={e=>setBooking({...booking, address: {...booking.address, [booking.locationType === 'motel' ? 'motelName' : 'hotelName']: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
                       <input placeholder={booking.locationType === 'motel' ? "Nº Suíte" : "Nº Quarto"} type="tel" value={booking.locationType === 'motel' ? booking.address.suite : booking.address.room} onChange={e=>setBooking({...booking, address: {...booking.address, [booking.locationType === 'motel' ? 'suite' : 'room']: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`} />
                    </div>
                 )}
              </div>

              {/* Receipt */}
              <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                  <div className="bg-zinc-950 p-4 border-b border-white/10 flex justify-between items-center">
                     <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recibo</span>
                     <span className="text-[10px] bg-green-500 text-black px-2 py-0.5 rounded font-bold">AGUARDANDO</span>
                  </div>
                  <div className="p-5 space-y-3 text-sm">
                     <div className="flex justify-between font-medium"><span>{booking.service?.title}</span><span>R$ {booking.service?.price}</span></div>
                     {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                        <div key={k} className="flex justify-between text-xs opacity-70"><span>+ {DB.extras.find(e=>e.id===k).label}</span><span>R$ {DB.extras.find(e=>e.id===k).price}</span></div>
                     ))}
                     {booking.appliedCoupon && (
                        <div className="flex justify-between text-green-500 text-xs font-bold py-2 border-t border-dashed border-white/10"><span>Desconto ({booking.appliedCoupon.title})</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                     )}
                     <div className="flex justify-between text-xl font-black pt-2 border-t border-white/10 mt-2"><span>Total</span><span>R$ {calculateTotal().total}</span></div>
                  </div>
                  <button onClick={() => booking.appliedCoupon ? setBooking({...booking, appliedCoupon: null}) : setWalletOpen(true)} className="w-full bg-zinc-950/50 py-3 text-xs font-bold border-t border-white/5 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                     {booking.appliedCoupon ? <><Trash2 size={12} className="text-red-500"/> Remover Cupom</> : <><Ticket size={14} className="text-green-500"/> Adicionar Cupom</>}
                  </button>
              </div>
              
              {/* Terms */}
              <div onClick={() => setBooking({...booking, termsAccepted: !booking.termsAccepted})} className="flex gap-3 items-center cursor-pointer opacity-80 hover:opacity-100">
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${booking.termsAccepted ? 'bg-green-500 border-green-500 text-black' : 'border-zinc-500'}`}>
                    {booking.termsAccepted && <Check size={14} strokeWidth={4}/>}
                 </div>
                 <p className="text-[10px] leading-tight">{T.terms}</p>
              </div>

           </div>
        )}

      </main>

      {/* FOOTER NAV */}
      <div className={`fixed bottom-0 left-0 w-full p-4 z-40 border-t ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-zinc-200'}`}>
         <div className="max-w-md mx-auto flex gap-3">
            {step > 0 && <button onClick={() => setStep(s => s - 1)} className={`w-14 rounded-xl flex items-center justify-center border ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-zinc-100 border-zinc-200'}`}><ChevronLeft/></button>}
            
            <button onClick={step === 2 ? finishOrder : validateStep} className="flex-1 h-14 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 uppercase tracking-wide shadow-lg shadow-green-500/20 active:scale-95 transition-all">
               {step === 2 ? <><MessageCircle size={20}/> Confirmar no WhatsApp</> : <>{T.next_level} <ArrowRight size={20}/></>}
            </button>
         </div>
      </div>

    </div>
  );
}
