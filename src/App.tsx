import React, { useState, useEffect } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, AlertTriangle, Zap, Menu, X, Gift, 
  Wallet, User, Copy, Navigation, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, Globe, Languages
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (CRUCIAIS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "https://instagram.com/seumssagista", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: '@thaly_app_ultimate_v5',
  XP_TARGET: 300, 
  COUPON_LOYALTY_VAL: 30,
  COUPON_WELCOME_VAL: 12 // Seu pedido: 12 reais de desconto inicial
};

const DB = {
  services: [
    { 
      id: 'completa', 
      price: 175, 
      xp: 175, 
      icon: Flame, 
      color: 'text-red-500', 
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    },
    { 
      id: 'relax', 
      price: 145, 
      xp: 145, 
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    }
  ],
  extras: [
    { id: 'more_time', price: 70, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ],
  reviews: [
    { name: "Tiago M.", text: "Mãos firmes e técnica com os rolos é diferenciada.", stars: 5 },
    { name: "Bruno S.", text: "O ambiente que ele cria é surreal. Relaxamento total.", stars: 5 },
    { name: "Anônimo", text: "Muito discreto e profissional. Virei cliente fiel.", stars: 5 },
    { name: "Lucas", text: "A massagem tântrica foi a melhor experiência que já tive.", stars: 5 }
  ]
};

const TEXTS = {
  pt: {
    app_name: "Thalyson Massagens",
    welcome: "Seu corpo pede essa pausa.",
    subtitle: "Técnicas manuais e uso de rolos de massagem para liberação profunda.",
    
    label_name: "Seu Nome",
    ph_name: "Como prefere ser chamado...",
    
    cat_title: "Escolha sua Experiência",
    
    svc_comp_name: "Experiência Tantra (1h)",
    svc_comp_badge: "PREMIUM ❤️",
    svc_comp_desc: "Fusão de relaxamento muscular com despertar sensorial.",
    svc_comp_list: [
        "Liberação miofascial com rolos e ventosas (se necessário).",
        "Toque sensitivo pele com pele.",
        "Finalização tântrica manual com óleo aquecido."
    ],
    
    svc_relax_name: "Deep Relax (1h)",
    svc_relax_badge: "ANTI-STRESS 🍃",
    svc_relax_desc: "Foco total em eliminar dores e cansaço físico.",
    svc_relax_list: [
        "Uso intensivo de rolos para soltar a musculatura.",
        "Manobras de deslizamento profundo.",
        "Sem interação íntima, apenas descanso."
    ],

    upsell_title: "Turbine sua Sessão",
    ext_time: "Mais Tempo (+30min)",
    ext_time_sub: "Sem pressa para acabar.",
    ext_touch: "Interatividade",
    ext_touch_sub: "Toques no massagista permitidos.",
    ext_aroma: "Aromaterapia",
    ext_aroma_sub: "Óleos essenciais relaxantes.",

    cal_title: "Data e Horário",
    
    loc_title: "Onde será o atendimento?",
    loc_sub: "Levo a maca e os equipamentos até você.",
    btn_home: "Minha Casa",
    btn_motel: "Motel",
    btn_hotel: "Hotel",
    
    addr_city: "Cidade",
    addr_street: "Rua",
    addr_num: "Número",
    addr_dist: "Bairro",
    addr_motel: "Nome do Motel",
    addr_suite: "Nº Suíte",
    addr_hotel: "Nome do Hotel",
    addr_room: "Nº Quarto",
    
    review_title: "Resumo do Pedido",
    lbl_svc: "Serviço",
    lbl_disc: "Desconto",
    lbl_total: "Total a Pagar",
    lbl_pay: "Pagamento",
    
    btn_coupon: "VER MEUS CUPONS",
    coupon_apply: "Aplicar",
    coupon_remove: "Remover",
    coupon_empty: "Sem cupons novos.",
    
    btn_start: "Iniciar Agendamento",
    btn_next: "Continuar",
    btn_finish: "Confirmar no WhatsApp",
    
    toast_copied: "Chave Pix Copiada!",
    toast_welcome: "🎁 Cupom de R$ 12 ativado!",
  },
  en: {
    app_name: "Thalyson Massage",
    welcome: "Your body needs this break.",
    subtitle: "Manual techniques and massage rollers for deep release.",
    
    label_name: "Your Name",
    ph_name: "Preferred name...",
    
    cat_title: "Choose Experience",
    
    svc_comp_name: "Tantra Experience (1h)",
    svc_comp_badge: "PREMIUM ❤️",
    svc_comp_desc: "Fusion of muscle relaxation and sensory awakening.",
    svc_comp_list: [
        "Myofascial release with rollers.",
        "Sensitive skin-to-skin touch.",
        "Manual tantric finish with warm oil."
    ],
    
    svc_relax_name: "Deep Relax (1h)",
    svc_relax_badge: "ANTI-STRESS 🍃",
    svc_relax_desc: "Total focus on eliminating pain and fatigue.",
    svc_relax_list: [
        "Intensive use of rollers for muscles.",
        "Deep gliding maneuvers.",
        "No intimate interaction, just rest."
    ],

    upsell_title: "Boost Session",
    ext_time: "More Time (+30min)",
    ext_time_sub: "No rush.",
    ext_touch: "Interactivity",
    ext_touch_sub: "Touching the masseur allowed.",
    ext_aroma: "Aromatherapy",
    ext_aroma_sub: "Relaxing essential oils.",

    cal_title: "Date & Time",
    
    loc_title: "Where is the location?",
    loc_sub: "I bring the table and equipment to you.",
    btn_home: "Home",
    btn_motel: "Motel",
    btn_hotel: "Hotel",
    
    addr_city: "City",
    addr_street: "Street",
    addr_num: "Number",
    addr_dist: "District",
    addr_motel: "Motel Name",
    addr_suite: "Suite #",
    addr_hotel: "Hotel Name",
    addr_room: "Room #",
    
    review_title: "Order Summary",
    lbl_svc: "Service",
    lbl_disc: "Discount",
    lbl_total: "Total to Pay",
    lbl_pay: "Payment",
    
    btn_coupon: "SEE COUPONS",
    coupon_apply: "Apply",
    coupon_remove: "Remove",
    coupon_empty: "No coupons.",
    
    btn_start: "Start Booking",
    btn_next: "Next Step",
    btn_finish: "Confirm on WhatsApp",
    
    toast_copied: "Pix Key Copied!",
    toast_welcome: "🎁 R$ 12 Coupon active!",
  }
};

// ==================================================================================
// 2. COMPONENTES DE UI (VISUAL RICO)
// ==================================================================================

const SplashScreen = ({ onFinish, isDark }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { 
        setTimeout(() => setFade(true), 2000); 
        setTimeout(onFinish, 2500); 
    }, [onFinish]);
    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'} ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                <Zap size={64} className="text-green-500 relative z-10 animate-bounce" fill="currentColor"/>
            </div>
            <h1 className={`text-3xl font-black tracking-[0.2em] uppercase ${isDark ? 'text-white' : 'text-zinc-900'}`}>THALYSON</h1>
            <p className="text-xs tracking-widest text-green-500 mt-2 font-bold uppercase">Massagens</p>
        </div>
    );
};

const Header = ({ isDark, toggleTheme, lang, toggleLang, xp, setWalletOpen, hasCoupons }) => (
    <div className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b transition-colors duration-300 px-5 h-16 flex justify-between items-center ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-zinc-200'}`}>
        <div className="flex items-center gap-2">
            <h1 className="font-black uppercase tracking-wider text-sm">Thaly<span className="text-green-500">.</span></h1>
            {xp > 0 && <span className="text-[10px] font-bold bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full border border-green-500/20">{xp} XP</span>}
        </div>
        <div className="flex gap-2">
            <button onClick={() => window.open(CONFIG.INSTAGRAM, '_blank')} className={`p-2 rounded-full border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}><Instagram size={16}/></button>
            <button onClick={toggleLang} className={`p-2 rounded-full border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}><Languages size={16}/></button>
            <button onClick={toggleTheme} className={`p-2 rounded-full border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}>{isDark ? <Sun size={16}/> : <Moon size={16}/>}</button>
            <button onClick={() => setWalletOpen(true)} className={`relative p-2 rounded-full border transition-all ${isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 hover:bg-zinc-50'}`}>
                <Gift size={16}/>
                {hasCoupons && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse border border-black"></span>}
            </button>
        </div>
    </div>
);

const ReviewCarousel = ({ reviews, isDark }) => (
    <div className="w-full overflow-hidden relative py-4">
        <div className="flex gap-3 overflow-x-auto pb-4 px-1 scrollbar-hide snap-x">
             {reviews.map((r, i) => (
                 <div key={i} className={`snap-center min-w-[260px] p-4 rounded-2xl border flex-shrink-0 relative ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
                     <div className="flex text-yellow-500 mb-2 gap-1">{[...Array(r.stars)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                     <p className={`text-xs italic mb-2 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>"{r.text}"</p>
                     <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{r.name}</p>
                 </div>
             ))}
        </div>
    </div>
);

const Input = ({ label, value, onChange, placeholder, type="text", isDark, icon: Icon }) => (
    <div className="mb-3 w-full">
        <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</label>
        <div className="relative">
            <input 
                type={type} value={value} onChange={onChange} placeholder={placeholder}
                className={`w-full h-12 rounded-xl px-4 pl-10 text-sm outline-none transition-all border 
                ${isDark 
                    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-green-500 placeholder:text-zinc-700' 
                    : 'bg-white border-zinc-200 text-zinc-900 focus:border-green-500 placeholder:text-zinc-300'}`}
            />
            {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />}
        </div>
    </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');

  // ESTADO DO USUÁRIO (Persistência)
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          // Se não existir, cria com cupom de boas-vindas
          if (!s) return { name: '', xp: 0, coupons: [{ id: 'WELCOME', val: CONFIG.COUPON_WELCOME_VAL, title: '1ª Vez' }] };
          return JSON.parse(s);
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // ESTADO DO PEDIDO
  const [booking, setBooking] = useState({
      service: null,
      extras: {},
      date: null,
      time: null,
      locationType: 'home',
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
      payment: 'pix',
      appliedCoupon: null
  });

  const T = TEXTS[lang];

  // APLICA CUPOM AUTOMATICAMENTE SE FOR A 1ª VEZ (UX)
  useEffect(() => {
      if (user.coupons.find(c => c.id === 'WELCOME') && !booking.appliedCoupon && step === 0) {
          // Opcional: auto aplicar ou apenas deixar na carteira. Vou deixar na carteira.
      }
  }, [user.coupons]);

  // UTILS
  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => setLang(l => l === 'pt' ? 'en' : 'pt');
  
  const calculateTotal = () => {
      let s = booking.service?.price || 0;
      let e = 0;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += DB.extras.find(x => x.id === k).price; });
      const d = booking.appliedCoupon?.val || 0;
      return { service: s, extras: e, disc: d, final: Math.max(0, s + e - d) };
  };

  const handleNext = () => { window.scrollTo({top:0, behavior:'smooth'}); setStep(s => s + 1); };
  const handleBack = () => { setStep(s => s - 1); };

  // --- GERAÇÃO DO WHATSAPP (RICO E COMPLETO) ---
  const finishOrder = () => {
      // 1. XP Logic
      const newXP = user.xp + (booking.service?.xp || 0);
      let newCoupons = [...user.coupons];
      if (booking.appliedCoupon) newCoupons = newCoupons.filter(c => c.id !== booking.appliedCoupon.id);
      
      // Se bater meta, ganha cupom 30
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: Date.now(), title: 'Fidelidade VIP', val: CONFIG.COUPON_LOYALTY_VAL });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 2. Montar Texto Rico
      const totals = calculateTotal();
      const svcName = booking.service.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
      
      const extrasText = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
          const item = DB.extras.find(x => x.id === k);
          const label = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
          return `✅ ${label} (+R$ ${item.price})`;
      }).join('\n');

      let addrText = "";
      let mapHint = "";
      if (booking.locationType === 'home') {
          addrText = `🏠 *Casa:* ${booking.address.street}, ${booking.address.number}\n📍 *Bairro:* ${booking.address.district}\n🏙️ *Cidade:* ${booking.address.city}`;
          mapHint = `${booking.address.street}, ${booking.address.number} - ${booking.address.city}`;
      } else if (booking.locationType === 'motel') {
          addrText = `🏩 *Motel:* ${booking.address.motelName}\n🚪 *Suíte:* ${booking.address.suite}\n🏙️ *Cidade:* ${booking.address.city}`;
          mapHint = `${booking.address.motelName} - ${booking.address.city}`;
      } else {
          addrText = `🏨 *Hotel:* ${booking.address.hotelName}\n🚪 *Quarto:* ${booking.address.room}\n🏙️ *Cidade:* ${booking.address.city}`;
      }

      const msg = `
*AGENDAMENTO REALIZADO* 🌿
_Via App Thalyson Massagens_
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${user.name}
🆔 *Ref:* #${Math.floor(Math.random() * 9999)}

💆‍♂️ *SERVIÇO ESCOLHIDO*
*${svcName}*
📅 Data: ${new Date(booking.date).toLocaleDateString('pt-BR')}
⏰ Horário: ${booking.time}

✨ *ADICIONAIS*
${extrasText || "Nenhum adicional selecionado."}

📍 *LOCALIZAÇÃO*
${addrText}
🔗 _Google Maps:_ https://maps.google.com/?q=${encodeURIComponent(mapHint)}

💰 *FINANCEIRO*
Serviço Base: R$ ${totals.service.toFixed(2)}
Extras: R$ ${totals.extras.toFixed(2)}
${booking.appliedCoupon ? `🎟️ Cupom (${booking.appliedCoupon.title}): -R$ ${totals.disc.toFixed(2)}` : ''}
━━━━━━━━━━━━━━━━━━━━
💵 *TOTAL A PAGAR: R$ ${totals.final.toFixed(2)}*
━━━━━━━━━━━━━━━━━━━━

💳 *Pagamento:* ${booking.payment.toUpperCase()}
🚗 *Uber:* (A calcular pelo GPS)

*Aguardo confirmação!* 🙌
      `.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // UI RENDER
  if (loading) return <SplashScreen onFinish={() => setLoading(false)} isDark={isDark}/>;

  return (
    <div className={`min-h-screen font-sans pb-32 transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-green-500 selection:text-black' : 'bg-gray-50 text-zinc-900 selection:bg-black selection:text-white'}`}>
      
      <Header isDark={isDark} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang} xp={user.xp} setWalletOpen={setWalletOpen} hasCoupons={user.coupons.length > 0} />

      {/* MODAL CARTEIRA */}
      {walletOpen && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <div className={`w-full max-w-sm rounded-3xl p-6 animate-slide-up ${isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-lg flex items-center gap-2"><Wallet className="text-green-500"/> Meus Cupons</h3>
                      <button onClick={() => setWalletOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-gray-100'}`}><X size={18}/></button>
                  </div>
                  {user.coupons.length === 0 ? <p className="text-center opacity-50 py-4">{T.coupon_empty}</p> : (
                      user.coupons.map(c => (
                          <div key={c.id} className="mb-3 p-4 rounded-xl border border-dashed border-green-500/50 bg-green-500/5 flex justify-between items-center">
                              <div><p className="font-bold text-green-500">{c.title}</p><p className="text-xs opacity-70">Valor: R$ {c.val},00</p></div>
                              {booking.appliedCoupon?.id === c.id ? <span className="text-xs font-bold text-green-500 flex gap-1"><Check size={12}/> Ativo</span> : 
                              <button onClick={() => { setBooking({...booking, appliedCoupon: c}); setWalletOpen(false); }} className="text-xs font-bold bg-green-500 text-white px-3 py-2 rounded-lg">{T.coupon_apply}</button>}
                          </div>
                      ))
                  )}
              </div>
          </div>
      )}

      <main className="pt-24 px-5 max-w-md mx-auto">
        
        {/* PASSO 0: HOME */}
        {step === 0 && (
            <div className="animate-fade-in">
                <h2 className="text-3xl font-black mb-2 tracking-tight">{T.welcome}</h2>
                <p className={`text-sm mb-8 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.subtitle}</p>

                <Input isDark={isDark} label={T.label_name} placeholder={T.ph_name} value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />

                <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mt-8 mb-4">{T.cat_title}</h3>
                
                <div className="space-y-6">
                    {DB.services.map(s => {
                        const isComp = s.id === 'completa';
                        const name = isComp ? T.svc_comp_name : T.svc_relax_name;
                        const desc = isComp ? T.svc_comp_desc : T.svc_relax_desc;
                        const list = isComp ? T.svc_comp_list : T.svc_relax_list;
                        const badge = isComp ? T.svc_comp_badge : T.svc_relax_badge;

                        return (
                            <div key={s.id} onClick={() => setBooking({...booking, service: s})} 
                                className={`relative p-6 rounded-[2rem] border transition-all cursor-pointer group 
                                ${booking.service?.id === s.id 
                                    ? (isDark ? 'bg-zinc-900 border-green-500 ring-1 ring-green-500' : 'bg-white border-green-500 ring-1 ring-green-500 shadow-xl') 
                                    : (isDark ? 'bg-zinc-900/40 border-zinc-800 hover:bg-zinc-900' : 'bg-white border-zinc-200 hover:shadow-lg')}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${s.bg} ${s.color}`}><s.icon size={24}/></div>
                                    <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${isComp ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-teal-500 text-white shadow-lg shadow-teal-500/20'}`}>{badge}</span>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{name}</h3>
                                <p className={`text-xs mb-4 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>{desc}</p>
                                <ul className="space-y-2 mb-6">
                                    {list.map((item, i) => (
                                        <li key={i} className="flex gap-2 text-xs opacity-80"><Check size={14} className="text-green-500 shrink-0"/> {item}</li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-between border-t border-dashed pt-4 border-white/10">
                                    <span className="text-xs opacity-50 font-bold">1 HORA</span>
                                    <span className="text-2xl font-black">R$ {s.price}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className="mt-12">
                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 pl-1">Avaliações</h3>
                    <ReviewCarousel reviews={DB.reviews} isDark={isDark} />
                </div>
            </div>
        )}

        {/* PASSO 1: EXTRAS & CALENDARIO */}
        {step === 1 && (
            <div className="animate-slide-in">
                <h2 className="text-xl font-bold mb-6">{T.upsell_title}</h2>
                <div className="space-y-3 mb-10">
                    {DB.extras.map(ex => {
                         const isActive = booking.extras[ex.id];
                         const label = ex.id === 'more_time' ? T.ext_time : ex.id === 'touch' ? T.ext_touch : T.ext_aroma;
                         const sub = ex.id === 'more_time' ? T.ext_time_sub : ex.id === 'touch' ? T.ext_touch_sub : T.ext_aroma_sub;
                         return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !isActive}})} 
                                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${isActive ? 'border-green-500 bg-green-500/10' : (isDark ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-200 bg-white')}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-green-500 text-white' : (isDark ? 'bg-zinc-800' : 'bg-zinc-100')}`}><ex.icon size={18}/></div>
                                    <div><p className="font-bold text-sm">{label}</p><p className="text-xs opacity-60">{sub}</p></div>
                                </div>
                                <span className={`text-sm font-bold ${isActive ? 'text-green-500' : 'opacity-50'}`}>+R$ {ex.price}</span>
                            </div>
                         )
                    })}
                </div>

                <h2 className="text-xl font-bold mb-4">{T.cal_title}</h2>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} 
                                className={`min-w-[70px] h-[84px] rounded-2xl border flex flex-col items-center justify-center flex-shrink-0 transition-all ${isSel ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-zinc-200 text-zinc-400')}`}
                            >
                                <span className="text-[10px] font-black uppercase">{d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                                <span className="text-xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in pb-10">
                        {['10:00','11:00','13:00','14:00','16:00','17:00','19:00','20:00'].map(t => (
                            <button key={t} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border ${booking.time === t ? 'border-green-500 bg-green-500 text-white' : (isDark ? 'border-zinc-800 bg-zinc-900 text-zinc-400' : 'border-zinc-200 bg-white text-zinc-600')}`}>{t}</button>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* PASSO 2: LOCAL, CHECKOUT & CUPOM */}
        {step === 2 && (
            <div className="animate-slide-in pb-10">
                <h2 className="text-xl font-bold mb-1">{T.loc_title}</h2>
                <p className="text-xs opacity-50 mb-6">{T.loc_sub}</p>
                
                <div className={`p-1 rounded-xl flex mb-6 ${isDark ? 'bg-zinc-900' : 'bg-zinc-100'}`}>
                    {[
                        {id: 'home', l: T.btn_home}, {id: 'motel', l: T.btn_motel}, {id: 'hotel', l: T.btn_hotel}
                    ].map(x => (
                        <button key={x.id} onClick={() => setBooking({...booking, locationType: x.id})} className={`flex-1 py-3 text-[10px] font-black uppercase rounded-lg transition-all ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50'}`}>{x.l}</button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                     <Input isDark={isDark} label={T.addr_city} value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} />
                     {booking.locationType === 'home' && (
                        <>
                            <Input isDark={isDark} label={T.addr_street} value={booking.address.street} onChange={e=>setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} />
                            <div className="flex gap-2"><div className="w-1/3"><Input isDark={isDark} label={T.addr_num} type="tel" value={booking.address.number} onChange={e=>setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div><div className="w-2/3"><Input isDark={isDark} label={T.addr_dist} value={booking.address.district} onChange={e=>setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div></div>
                        </>
                     )}
                     {booking.locationType === 'motel' && (
                        <>
                            <Input isDark={isDark} label={T.addr_motel} value={booking.address.motelName} onChange={e=>setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <Input isDark={isDark} label={T.addr_suite} type="tel" value={booking.address.suite} onChange={e=>setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </>
                     )}
                     {booking.locationType === 'hotel' && (
                        <>
                            <Input isDark={isDark} label={T.addr_hotel} value={booking.address.hotelName} onChange={e=>setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} />
                            <Input isDark={isDark} label={T.addr_room} type="tel" value={booking.address.room} onChange={e=>setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} />
                        </>
                     )}
                </div>

                <div className={`p-6 rounded-[2rem] border relative overflow-hidden mb-6 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-400 to-green-500"></div>
                    <h3 className="text-center text-xs font-black uppercase tracking-widest opacity-50 mb-4">{T.review_title}</h3>
                    <div className="space-y-2 text-sm opacity-80 mb-6 font-mono">
                        <div className="flex justify-between"><span>{T.lbl_svc}</span><span>R$ {booking.service?.price}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                             <div key={k} className="flex justify-between text-green-500"><span>+ {k==='more_time'?T.ext_time:k==='touch'?T.ext_touch:T.ext_aroma}</span><span>R$ {DB.extras.find(e=>e.id===k).price}</span></div>
                        ))}
                        {booking.appliedCoupon && (
                            <div className="flex justify-between text-green-500 border-t border-dashed border-zinc-500/30 pt-2"><span>{T.lbl_disc} ({booking.appliedCoupon.title})</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                        )}
                    </div>
                    <div className="flex justify-between items-center text-xl font-black border-t border-zinc-500/10 pt-4"><span>{T.lbl_total}</span><span>R$ {calculateTotal().final}</span></div>
                    
                    {!booking.appliedCoupon ? (
                        <button onClick={() => setWalletOpen(true)} className={`w-full mt-4 py-3 rounded-xl text-xs font-bold border border-dashed flex items-center justify-center gap-2 ${isDark ? 'border-zinc-700 text-zinc-500 hover:text-green-500 hover:border-green-500' : 'border-zinc-300 text-zinc-500 hover:text-green-600'}`}><Ticket size={14}/> {T.btn_coupon}</button>
                    ) : (
                        <button onClick={() => setBooking({...booking, appliedCoupon: null})} className="w-full mt-4 py-2 text-xs font-bold text-red-500 flex items-center justify-center gap-1 hover:bg-red-500/10 rounded-lg"><Trash2 size={12}/> {T.coupon_remove}</button>
                    )}
                </div>

                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2 pl-1">{T.lbl_pay}</p>
                <div className="flex gap-2">
                    {['pix','card','money'].map(p => (
                        <button key={p} onClick={()=>setBooking({...booking, payment: p})} className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase ${booking.payment === p ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200')}`}>{p}</button>
                    ))}
                </div>
            </div>
        )}
      </main>

      {/* FOOTER ACTION */}
      <div className={`fixed bottom-0 w-full p-5 border-t z-50 ${isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-zinc-200'}`}>
         {step === 0 && <button onClick={handleNext} disabled={!user.name || !booking.service} className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide transition-all active:scale-95 animate-pulse">{T.btn_start} <ArrowRight size={18}/></button>}
         {step === 1 && <button onClick={handleNext} disabled={!booking.date || !booking.time} className="w-full h-14 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide transition-all active:scale-95">{T.btn_next} <ArrowRight size={18}/></button>}
         {step === 2 && <button onClick={finishOrder} disabled={!booking.address.city} className="w-full h-14 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wide transition-all active:scale-95 animate-pulse">{T.btn_finish} <MessageCircle size={18}/></button>}
         {step > 0 && <button onClick={handleBack} className={`absolute top-5 left-5 p-3 rounded-full ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}><ChevronLeft/></button>}
      </div>

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
    </div>
  );
}
