import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  Building, RefreshCw, User, Copy, CheckCircle, Info, Navigation, 
  BedDouble, Trash2, Award, Instagram, Globe, Moon, Sun,
  CreditCard, Banknote, Sparkles, Siren, Timer, ThumbsUp, Heart
} from 'lucide-react';

// ==================================================================================
// 1. CONSTANTES E CONFIGURAÇÕES AVANÇADAS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "https://instagram.com/seumssagista", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v25_ultra', 
  XP_TARGET: 300, 
  REWARD_VAL: 30,
  ANIMATION_SPEED: 300
};

// ==================================================================================
// 2. COPYWRITING PERSUASIVO & DADOS
// ==================================================================================

const TEXTS = {
  pt: {
    hero_badge: "✨ Experiência Premium",
    welcome: "Seu momento de desconexão.",
    subtitle: "Massagem terapêutica e sensorial para renovar suas energias.",
    your_name: "Como prefere ser chamado?",
    name_placeholder: "Digite seu nome...",
    health_check: "Confirmo que tenho +18 anos.",
    start_btn: "Ver Disponibilidade",
    
    choose_svc: "Escolha sua Experiência",
    svc_popular: "ESCOLHA DO MÊS",
    
    svc_comp_name: "Experiência Tantra (1h)",
    svc_comp_desc: "A fusão perfeita entre relaxamento muscular e despertar sensorial.",
    svc_comp_features: ["Massagem Corporal Completa", "Toque Sensitivo (Pele com Pele)", "Finalização Tântrica (Manual)"],
    
    svc_relax_name: "Deep Relax (1h)",
    svc_relax_desc: "Protocolo focado 100% na eliminação de dores e estresse.",
    svc_relax_features: ["Alívio de Tensões", "Óleos Essenciais", "Sem toque íntimo"],

    upsell_title: "Personalize sua Sessão",
    upsell_sub: "Clientes costumam adicionar estes itens:",
    
    loc_title: "Local do Atendimento",
    loc_sub: "Vou até onde você estiver.",
    
    review_summary: "Resumo do Pedido",
    scarcity_txt: "🔥 2 pessoas estão vendo este horário agora.",
    
    success_head: "Solicitação Enviada!",
    success_sub: "Redirecionando para o WhatsApp para combinar o transporte...",
  },
  en: {
    hero_badge: "✨ Premium Experience",
    welcome: "Your disconnection moment.",
    subtitle: "Therapeutic and sensory massage to renew your energy.",
    your_name: "What's your name?",
    name_placeholder: "Type your name...",
    health_check: "I confirm I am 18+.",
    start_btn: "Check Availability",
    
    choose_svc: "Choose Experience",
    svc_popular: "MONTHLY PICK",
    
    svc_comp_name: "Tantra Experience (1h)",
    svc_comp_desc: "Perfect fusion of muscle relief and sensory awakening.",
    svc_comp_features: ["Full Body Massage", "Sensitive Touch (Skin-to-Skin)", "Tantric Finish (Manual)"],
    
    svc_relax_name: "Deep Relax (1h)",
    svc_relax_desc: "Protocol focused 100% on pain and stress relief.",
    svc_relax_features: ["Tension Relief", "Essential Oils", "No intimate touch"],

    upsell_title: "Customize Session",
    upsell_sub: "Clients usually add these:",
    
    loc_title: "Service Location",
    loc_sub: "I come to you.",
    
    review_summary: "Order Summary",
    scarcity_txt: "🔥 2 people are viewing this slot.",
    
    success_head: "Request Sent!",
    success_sub: "Redirecting to WhatsApp to settle transport fees...",
  }
};

const DB = {
  services: [
    { id: 'completa', price: 175, xp: 120, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500' },
    { id: 'relax', price: 145, xp: 60, icon: Wind, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400' }
  ],
  extras: [
    { id: 'more_time', label_pt: "Mais Tempo (+30min)", label_en: "More Time (+30min)", icon: Clock, price: 70 },
    { id: 'touch', label_pt: "Interatividade Total", label_en: "Full Interactivity", icon: Heart, price: 63, warning: true },
    { id: 'aroma', label_pt: "Kit Aromaterapia", label_en: "Aromatherapy Kit", icon: Sparkles, price: 15 }
  ],
  reviews: [
    { name: "Tiago M.", text: "A melhor massagem que já recebi em Londrina. Mãos de fada!", stars: 5 },
    { name: "Bruno S.", text: "Super respeitoso e profissional. O tantra é surreal.", stars: 5 },
    { name: "Anônimo", text: "Discreto e pontual. Recomendo para quem quer sigilo.", stars: 5 },
    { name: "Lucas", text: "Sai de lá flutuando. Valeu cada centavo.", stars: 5 }
  ]
};

// ==================================================================================
// 3. HOOKS E UTILITÁRIOS (ENGINE)
// ==================================================================================

const usePersistedState = (key, initial) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch (error) { return initial; }
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
};

const Utils = {
  fmtMoney: (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val),
  vibrate: (pattern = [10]) => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); },
  wait: (ms) => new Promise(res => setTimeout(res, ms)),
  generateConfetti: () => {
    // Simulação visual simples de confetti via CSS/DOM manipulation seria complexa aqui, 
    // então usaremos feedback visual nos componentes.
  }
};

// ==================================================================================
// 4. COMPONENTES DE UI (DESIGN SYSTEM)
// ==================================================================================

const AnimatedCard = ({ children, className = "", onClick, selected, isDark }) => (
  <div 
    onClick={onClick}
    className={`
      relative overflow-hidden transition-all duration-300 transform 
      ${selected 
        ? (isDark ? 'bg-zinc-900 ring-2 ring-green-500 scale-[1.02]' : 'bg-white ring-2 ring-green-500 scale-[1.02] shadow-xl') 
        : (isDark ? 'bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800' : 'bg-white border border-gray-100 hover:shadow-md')}
      rounded-2xl cursor-pointer ${className}
    `}
  >
    {children}
    {selected && (
      <div className="absolute top-2 right-2 animate-scale-in">
        <div className="bg-green-500 text-white rounded-full p-1 shadow-lg shadow-green-500/50">
          <Check size={12} strokeWidth={4} />
        </div>
      </div>
    )}
  </div>
);

const Button = ({ label, icon: Icon, onClick, disabled, variant = 'primary', loading, isDark, pulse }) => {
  const baseClass = "h-14 w-full rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: isDark 
      ? 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
      : 'bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/20',
    secondary: isDark 
      ? 'bg-zinc-800 text-white border border-zinc-700' 
      : 'bg-gray-100 text-zinc-900 border border-gray-200',
    outline: 'border-2 border-current bg-transparent'
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseClass} ${variants[variant]} ${pulse ? 'animate-pulse' : ''}`}>
      {loading ? <RefreshCw className="animate-spin" size={20}/> : <>{label} {Icon && <Icon size={18}/>}</>}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, type = "text", icon: Icon, isDark }) => (
  <div className="group">
    <label className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 block ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</label>
    <div className={`
      flex items-center h-12 px-4 rounded-xl border transition-all
      ${isDark 
        ? 'bg-zinc-900 border-zinc-800 text-white focus-within:border-green-500 focus-within:bg-zinc-800' 
        : 'bg-gray-50 border-gray-200 text-zinc-900 focus-within:border-green-500 focus-within:bg-white focus-within:shadow-md'}
    `}>
      {Icon && <Icon size={18} className={`${isDark ? 'text-zinc-600' : 'text-zinc-400'} mr-3 group-focus-within:text-green-500 transition-colors`}/>}
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className="bg-transparent w-full outline-none text-sm font-medium placeholder:opacity-50"
      />
    </div>
  </div>
);

// ==================================================================================
// 5. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = usePersistedState('thaly_theme', true);
  const [lang, setLang] = usePersistedState('thaly_lang', 'pt');
  const [user, setUser] = usePersistedState(CONFIG.STORAGE_KEY, { name: '', xp: 0, coupons: [] });
  
  // Estado do Agendamento
  const [booking, setBooking] = useState({
    service: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home', // home, hotel, motel
    address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
    payment: null,
    coupon: null
  });

  const [uiState, setUiState] = useState({
    menuOpen: false,
    walletOpen: false,
    toast: { show: false, msg: '', type: 'success' }
  });

  const T = TEXTS[lang];

  // Efeito de Splash Screen
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Helpers de Ação
  const showToast = (msg, type = 'success') => {
    setUiState(prev => ({ ...prev, toast: { show: true, msg, type } }));
    Utils.vibrate();
    setTimeout(() => setUiState(prev => ({ ...prev, toast: { show: false, msg: '', type: 'success' } })), 3000);
  };

  const toggleTheme = () => { setIsDark(!isDark); Utils.vibrate(); };
  const toggleLang = () => { setLang(l => l === 'pt' ? 'en' : 'pt'); Utils.vibrate(); };

  const handleNext = () => {
    if (step === 0 && (!user.name || user.name.length < 3)) return showToast("Por favor, digite seu nome", "error");
    if (step === 0 && !booking.service) return showToast("Selecione um serviço", "error");
    
    setStep(s => s + 1);
    Utils.vibrate([10]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => { setStep(s => s - 1); Utils.vibrate(); };

  const calculateTotal = () => {
    let total = booking.service?.price || 0;
    DB.extras.forEach(ex => { if (booking.extras[ex.id]) total += ex.price; });
    if (booking.coupon) total -= booking.coupon.val;
    return Math.max(0, total);
  };

  const finalizeOrder = async () => {
    Utils.vibrate([20, 50, 20]);
    
    // 1. Calcular Dados Finais
    const total = calculateTotal();
    const svcName = booking.service.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
    const extrasList = DB.extras.filter(e => booking.extras[e.id]).map(e => `+ ${lang === 'pt' ? e.label_pt : e.label_en}`).join('\n');
    
    // 2. Formatar Endereço
    let locStr = "";
    if (booking.locationType === 'motel') locStr = `🏩 MOTEL: ${booking.address.motelName} | Suíte ${booking.address.suite}`;
    else if (booking.locationType === 'hotel') locStr = `🏨 HOTEL: ${booking.address.hotelName} | Quarto ${booking.address.room}`;
    else locStr = `🏠 CASA: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;

    // 3. XP System
    const earnedXP = booking.service.xp;
    const newXP = user.xp + earnedXP;
    let newCoupons = [...user.coupons];
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
      newCoupons.push({ id: Date.now(), val: CONFIG.REWARD_VAL, label: 'Fidelidade' });
    }
    setUser({ ...user, xp: newXP, coupons: newCoupons });

    // 4. Mensagem WhatsApp
    const msg = `
*NOVO AGENDAMENTO VIA APP* 🚀
--------------------------------
👤 *Cliente:* ${user.name}
🆔 *ID:* #${Math.floor(Math.random()*1000)}

💆 *${svcName}*
📅 ${new Date(booking.date).toLocaleDateString()} às ${booking.time}

${extrasList ? `✨ *Extras:*\n${extrasList}\n` : ''}
📍 *Local:* ${booking.address.city}
${locStr}

💰 *Valor Serviço:* ${Utils.fmtMoney(total)}
🚗 *Uber:* (A Calcular pelo GPS)
💳 *Pagamento:* ${booking.payment.toUpperCase()}

⚠️ *Status:* Aguardando Confirmação
`.trim();

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    
    // Reset App
    await Utils.wait(1000);
    setStep(0);
    setBooking({...booking, service: null, date: null, time: null, payment: null});
    showToast(T.success_head);
  };

  // --- RENDERS ---

  if (loading) return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${isDark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-green-500/30 blur-xl rounded-full animate-pulse"></div>
        <Zap size={64} className="text-green-500 relative animate-bounce" fill="currentColor"/>
      </div>
      <h1 className="mt-6 text-2xl font-black tracking-[0.3em] animate-pulse">THALY</h1>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans selection:bg-green-500 selection:text-white transition-colors duration-500 ${isDark ? 'bg-black text-zinc-100' : 'bg-gray-50 text-zinc-900'}`}>
      
      {/* Toast Notification */}
      <div className={`fixed top-4 left-0 w-full flex justify-center z-[100] transition-all duration-300 ${uiState.toast.show ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-200'} border px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md`}>
          {uiState.toast.type === 'success' ? <CheckCircle size={18} className="text-green-500"/> : <AlertTriangle size={18} className="text-red-500"/>}
          <span className="text-xs font-bold uppercase tracking-wider">{uiState.toast.msg}</span>
        </div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b transition-colors ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
        <div className="px-5 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {step > 0 && <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-white/10"><ChevronLeft size={24}/></button>}
            <div>
              <h1 className="text-sm font-black tracking-[0.2em] uppercase">Thaly</h1>
              {step === 0 && <p className="text-[9px] text-green-500 font-bold uppercase tracking-wider">{T.hero_badge}</p>}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={toggleTheme} className={`p-2 rounded-full border ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
              {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
            <button onClick={toggleLang} className={`w-9 h-9 flex items-center justify-center rounded-full border text-[10px] font-black ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-black/5'}`}>
              {lang.toUpperCase()}
            </button>
          </div>
        </div>
        {/* Progress Bar */}
        <div className="h-[2px] w-full bg-gray-200/10">
          <div className="h-full bg-green-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{width: `${((step+1)/4)*100}%`}}></div>
        </div>
      </header>

      <main className="pt-24 px-5 pb-40 max-w-md mx-auto">
        
        {/* STEP 0: WELCOME & SERVICE */}
        {step === 0 && (
          <div className="animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold leading-tight mb-2">{T.welcome}</h2>
              <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{T.subtitle}</p>
            </div>

            <div className="space-y-4 mb-10">
              <InputField isDark={isDark} label={T.your_name} value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder={T.name_placeholder} icon={User} />
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest opacity-70">{T.choose_svc}</h3>
            </div>

            <div className="space-y-6">
              {DB.services.map((svc) => (
                <AnimatedCard 
                  key={svc.id} 
                  isDark={isDark} 
                  selected={booking.service?.id === svc.id} 
                  onClick={() => { setBooking({...booking, service: svc}); Utils.vibrate(); }}
                >
                  <div className={`h-2 w-full absolute top-0 left-0 ${svc.bg.replace('/10','')} opacity-50`}></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${svc.bg} ${svc.color}`}>
                        <svc.icon size={24} />
                      </div>
                      {svc.id === 'completa' && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-orange-500/30 tracking-wide">
                          {T.svc_popular}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold mb-1">{svc.id === 'completa' ? T.svc_comp_name : T.svc_relax_name}</h3>
                    <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                      {svc.id === 'completa' ? T.svc_comp_desc : T.svc_relax_desc}
                    </p>
                    
                    <ul className="space-y-2 mb-6">
                      {(svc.id === 'completa' ? T.svc_comp_features : T.svc_relax_features).map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium opacity-80">
                          <Check size={14} className="text-green-500" /> {feat}
                        </li>
                      ))}
                    </ul>

                    <div className="flex items-end justify-between border-t pt-4 border-dashed border-gray-200/20">
                      <div className="text-xs opacity-50 font-mono">1 HORA</div>
                      <div className="text-2xl font-bold tracking-tight">{Utils.fmtMoney(svc.price)}</div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>

            {/* Social Proof Carousel */}
            <div className="mt-12 mb-4">
               <div className="flex gap-1 mb-4 opacity-50">
                  <Star size={12} fill="currentColor" className="text-yellow-500"/>
                  <span className="text-[10px] font-bold uppercase tracking-widest">4.9/5.0 Stars (120+ Reviews)</span>
               </div>
               <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                 {DB.reviews.map((r, i) => (
                   <div key={i} className={`snap-center min-w-[280px] p-5 rounded-2xl border flex-shrink-0 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-gray-100 shadow-sm'}`}>
                     <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                     <p className="text-xs italic mb-3 opacity-70 leading-relaxed">"{r.text}"</p>
                     <p className="text-[10px] font-black uppercase flex items-center gap-1 opacity-40"><User size={10}/> {r.name}</p>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* STEP 1: EXTRAS & CALENDAR */}
        {step === 1 && (
          <div className="animate-fade-in-up">
             <div className="mb-6">
               <h2 className="text-xl font-bold">{T.upsell_title}</h2>
               <p className="text-xs opacity-60">{T.upsell_sub}</p>
             </div>

             <div className="grid gap-3 mb-10">
               {DB.extras.map(ex => {
                 const isActive = booking.extras[ex.id];
                 return (
                   <div 
                      key={ex.id} 
                      onClick={() => { setBooking({...booking, extras: {...booking.extras, [ex.id]: !isActive}}); Utils.vibrate(); }}
                      className={`
                        relative p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all
                        ${isActive 
                          ? 'border-green-500 bg-green-500/10' 
                          : (isDark ? 'border-zinc-800 bg-zinc-900' : 'border-gray-200 bg-white')}
                      `}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-500 text-white' : 'bg-gray-100/10 text-gray-500'}`}>
                         <ex.icon size={18}/>
                       </div>
                       <div>
                         <p className="font-bold text-sm">{lang === 'pt' ? ex.label_pt : ex.label_en}</p>
                         {ex.warning && <p className="text-[10px] text-orange-500 flex items-center gap-1 mt-0.5"><AlertTriangle size={8}/> +18 Only</p>}
                       </div>
                     </div>
                     <span className={`text-sm font-bold ${isActive ? 'text-green-500' : 'opacity-50'}`}>+ {Utils.fmtMoney(ex.price)}</span>
                   </div>
                 )
               })}
             </div>

             <div className="mb-6">
               <h2 className="text-xl font-bold mb-4">Data & Hora</h2>
               
               {/* Date Scroll */}
               <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-6">
                 {[...Array(10)].map((_, i) => {
                   const d = new Date(); d.setDate(d.getDate() + i);
                   const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                   const week = d.toLocaleDateString(lang === 'pt'?'pt-BR':'en-US', {weekday: 'short'}).toUpperCase().slice(0,3);
                   return (
                     <button 
                        key={i} 
                        onClick={() => { setBooking({...booking, date: d, time: null}); Utils.vibrate(); }}
                        className={`min-w-[70px] h-[90px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-white text-black ring-4 ring-green-500/20 border-transparent scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-gray-200 text-zinc-400')}`}
                      >
                       <span className="text-[10px] font-black tracking-widest mb-1">{week}</span>
                       <span className="text-2xl font-bold">{d.getDate()}</span>
                     </button>
                   )
                 })}
               </div>

               {/* Time Grid */}
               {booking.date && (
                 <div className="animate-fade-in">
                   <div className="grid grid-cols-4 gap-2">
                     {['10:00','11:00','13:00','14:00','16:00','17:00','19:00','20:00'].map(t => {
                       const isSelected = booking.time === t;
                       const isTaken = (parseInt(t) + new Date().getDate()) % 3 === 0; // Fake availability logic
                       return (
                         <button 
                            key={t}
                            disabled={isTaken}
                            onClick={() => { setBooking({...booking, time: t}); Utils.vibrate(); }}
                            className={`
                              py-3 rounded-xl text-xs font-bold border relative overflow-hidden
                              ${isSelected 
                                ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30' 
                                : isTaken 
                                  ? 'opacity-30 cursor-not-allowed border-transparent bg-zinc-800/50' 
                                  : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600' : 'bg-white border-gray-200 hover:border-gray-300')}
                            `}
                         >
                           {t}
                           {isTaken && <div className="absolute inset-0 flex items-center justify-center"><X size={12}/></div>}
                         </button>
                       )
                     })}
                   </div>
                   <div className="mt-4 flex items-center justify-center gap-2 text-xs text-orange-500 font-medium animate-pulse">
                     <Flame size={12} fill="currentColor" /> {T.scarcity_txt}
                   </div>
                 </div>
               )}
             </div>
          </div>
        )}

        {/* STEP 2: LOCATION & CHECKOUT */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h2 className="text-xl font-bold mb-1">{T.loc_title}</h2>
            <p className="text-xs opacity-60 mb-6">{T.loc_sub}</p>

            {/* Location Selector */}
            <div className={`p-1 rounded-xl flex mb-6 ${isDark ? 'bg-zinc-900' : 'bg-gray-200'}`}>
               {['home','hotel','motel'].map(l => (
                 <button 
                    key={l}
                    onClick={() => setBooking({...booking, locationType: l})}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${booking.locationType === l ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50'}`}
                 >
                   {l}
                 </button>
               ))}
            </div>

            <div className="space-y-4 mb-8">
              <InputField isDark={isDark} label="Cidade / City" value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} placeholder="Ex: Londrina..." />
              
              {booking.locationType === 'home' && (
                <>
                  <InputField isDark={isDark} label="Endereço / Address" value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} />
                  <div className="flex gap-3">
                    <div className="w-1/3"><InputField isDark={isDark} label="Nº" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                    <div className="w-2/3"><InputField isDark={isDark} label="Bairro / District" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                  </div>
                </>
              )}

              {booking.locationType === 'motel' && (
                 <>
                  <InputField isDark={isDark} label="Nome do Motel" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                  <InputField isDark={isDark} label="Número da Suíte" type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                 </>
              )}
              
              {booking.locationType === 'hotel' && (
                 <>
                  <InputField isDark={isDark} label="Nome do Hotel" value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} />
                  <InputField isDark={isDark} label="Quarto / Room" type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} />
                 </>
              )}
            </div>

            {/* Payment & Receipt */}
            <div className={`p-6 rounded-[2rem] border relative overflow-hidden mb-8 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200 shadow-xl'}`}>
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"></div>
               
               <h3 className="text-center font-black uppercase text-lg mb-6 tracking-widest opacity-80">{T.review_summary}</h3>
               
               <div className="space-y-3 text-sm mb-6 font-mono opacity-80">
                 <div className="flex justify-between">
                   <span>{booking.service?.id === 'completa' ? T.svc_comp_name : T.svc_relax_name}</span>
                   <span>{Utils.fmtMoney(booking.service?.price)}</span>
                 </div>
                 {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => (
                   <div key={k} className="flex justify-between text-green-500">
                     <span>+ {DB.extras.find(e=>e.id===k).label_pt}</span>
                     <span>{Utils.fmtMoney(DB.extras.find(e=>e.id===k).price)}</span>
                   </div>
                 ))}
                 <div className="border-t border-dashed border-gray-500/30 my-2"></div>
                 <div className="flex justify-between text-xl font-bold">
                   <span>TOTAL</span>
                   <span>{Utils.fmtMoney(calculateTotal())}</span>
                 </div>
               </div>

               <p className="text-[10px] font-bold uppercase mb-2 opacity-50 text-center">Forma de Pagamento</p>
               <div className="grid grid-cols-3 gap-2">
                 {['pix','card','money'].map(p => (
                   <button 
                      key={p} 
                      onClick={() => setBooking({...booking, payment: p})}
                      className={`py-3 rounded-lg border text-[10px] font-black uppercase flex flex-col items-center gap-1 transition-all ${booking.payment === p ? 'bg-green-500 text-white border-green-500' : (isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200')}`}
                   >
                     {p === 'pix' ? <Zap size={14}/> : (p === 'card' ? <CreditCard size={14}/> : <Banknote size={14}/>)}
                     {p}
                   </button>
                 ))}
               </div>
            </div>

            {booking.payment === 'pix' && (
              <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-between">
                 <div>
                   <p className="text-xs text-green-500 font-bold mb-1">Pagamento no Local</p>
                   <p className="text-[10px] opacity-70">Use a chave Pix apenas presencialmente.</p>
                 </div>
                 <button onClick={() => {navigator.clipboard.writeText(CONFIG.PIX_KEY); showToast("Chave Copiada!")}} className="text-green-500 font-bold text-xs bg-green-500/20 px-3 py-2 rounded-lg">COPIAR CHAVE</button>
              </div>
            )}

          </div>
        )}

      </main>

      {/* Floating Action Button (Next) */}
      <div className={`fixed bottom-0 left-0 w-full p-6 pb-8 border-t z-50 transition-all ${isDark ? 'bg-black/90 border-zinc-800' : 'bg-white/90 border-gray-200'}`}>
        {step < 2 ? (
           <Button 
            onClick={handleNext} 
            label={T.start_btn} 
            icon={ArrowRight} 
            isDark={isDark} 
            disabled={step===1 && !booking.time} // Validação simples
            pulse={step === 1 && booking.time}
          />
        ) : (
           <Button 
            onClick={finalizeOrder} 
            label="CONFIRMAR NO WHATSAPP" 
            icon={MessageCircle} 
            variant="primary" 
            isDark={isDark}
            disabled={!booking.payment || !booking.address.city}
            pulse
          />
        )}
      </div>

      {/* Global Styles for Animations */}
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes scale-in { 0% { transform: scale(0); } 100% { transform: scale(1); } }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
