import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, BedDouble, Map, Lock,
  Globe, Moon, Sun
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES GERAIS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v15_stable',
  XP_TARGET: 300 
};

// ==================================================================================
// 2. BANCO DE DADOS DE TEXTOS (I18N)
// ==================================================================================

const TEXTS = {
  pt: {
    // Geral
    welcome: "Bem-vindo.",
    subtitle: "Massagem exclusiva e profissional.",
    your_name: "Seu Nome",
    name_placeholder: "Como prefere ser chamado?",
    health_check: "Tenho +18 anos e estou saudável.",
    start_btn: "Ver Serviços",
    
    // Serviços
    choose_svc: "Escolha a Experiência",
    svc_comp_name: "🔥 Completa (1h)",
    svc_comp_desc: "Corpo a corpo + finalização.",
    svc_comp_note: "Sem penetração/oral.",
    svc_comp_steps: ['1️⃣ Relaxante (Tira tensão)', '2️⃣ Corpo a Corpo (Sensitivo)', '3️⃣ Tântrica (Finalização inclusa)'],
    svc_comp_tag: "MAIS PEDIDA",
    
    svc_relax_name: "🍃 Relaxante (1h)",
    svc_relax_desc: "Apenas muscular.",
    svc_relax_note: "Sem toques íntimos.",
    svc_relax_steps: ['1️⃣ Foco muscular', '2️⃣ Alívio de dores', '3️⃣ Apenas relaxamento físico'],
    svc_relax_tag: "TERAPÊUTICA",

    // Extras
    personalize: "Personalize",
    ext_title: "Adicionais (Opcional)",
    ext_time: "Duração 1h30",
    ext_time_sub: "+30 minutos",
    ext_touch: "Interatividade",
    ext_touch_sub: "Toque recíproco",
    ext_touch_warn: "Fico de cueca",
    ext_aroma: "Aromaterapia",
    ext_aroma_sub: "Óleos essenciais",

    // Data/Hora
    date_title: "Data e Hora",
    schedules: "Horários",
    sold_out: "ESGOTADO",
    continue: "Continuar",

    // Local
    loc_title: "Onde será?",
    btn_home: "Casa/Apto",
    city_lbl: "Cidade Atual",
    city_ph: "Ex: Londrina, SP...",
    
    lbl_motel: "Nome do Motel",
    lbl_suite: "Número da Suíte",
    ph_motel: "Ex: Motel London",
    
    lbl_hotel: "Nome do Hotel",
    lbl_room: "Número do Quarto",
    ph_hotel: "Ex: Hotel Bourbon",
    
    lbl_addr: "Endereço (Rua)",
    lbl_num: "Número",
    lbl_dist: "Bairro",
    lbl_comp: "Complemento",
    
    uber_warn: "Uber não incluso. Calculo no WhatsApp.",
    
    // Resumo
    review_title: "Resumo do Pedido",
    base_val: "Valor Base",
    coupon_lbl: "Cupom Aplicado",
    add_coupon: "Tenho Cupom",
    total_lbl: "Total Final",
    loc_lbl: "Localização",
    pay_lbl: "Pagamento",
    pay_method_title: "Pagamento (No Local)",
    confirm_btn: "Agendar no WhatsApp",
    
    // Diversos
    wallet: "Carteira",
    empty_wallet: "Vazia.",
    use: "USAR",
    gift_title: "Cupom Disponível",
    gift_sub: "Toque para resgatar.",
    copy_pix: "COPIAR CHAVE PIX",
    pix_copied: "PIX COPIADO!",
    
    money: "Dinheiro",
    card: "Cartão",
    menu_fid: "Fidelidade",
    menu_share: "Compartilhar",
    menu_doubts: "Dúvidas",
    success_title: "Solicitação Enviada!",
    success_msg: "Aguarde a confirmação do Uber no WhatsApp.",
    new_book: "Novo Agendamento"
  },
  en: {
    welcome: "Welcome.",
    subtitle: "Exclusive professional massage.",
    your_name: "Your Name",
    name_placeholder: "How should I call you?",
    health_check: "I am 18+ and healthy.",
    start_btn: "See Services",
    
    choose_svc: "Choose Experience",
    svc_comp_name: "🔥 Complete (1h)",
    svc_comp_desc: "Body-to-body + finish.",
    svc_comp_note: "No penetration/oral.",
    svc_comp_steps: ['1️⃣ Relax (Tension relief)', '2️⃣ Body-to-Body (Sensitive)', '3️⃣ Tantra (Finish included)'],
    svc_comp_tag: "BEST SELLER",
    
    svc_relax_name: "🍃 Relaxing (1h)",
    svc_relax_desc: "Muscular only.",
    svc_relax_note: "No intimate touching.",
    svc_relax_steps: ['1️⃣ Muscle Focus', '2️⃣ Pain Relief', '3️⃣ Physical Only'],
    svc_relax_tag: "THERAPEUTIC",

    personalize: "Customize",
    ext_title: "Add-ons (Optional)",
    ext_time: "Duration 1h30",
    ext_time_sub: "+30 minutes",
    ext_touch: "Interactivity",
    ext_touch_sub: "Reciprocal touch",
    ext_touch_warn: "Underwear on",
    ext_aroma: "Aromatherapy",
    ext_aroma_sub: "Essential oils",

    date_title: "Date & Time",
    schedules: "Available Times",
    sold_out: "SOLD OUT",
    continue: "Continue",

    loc_title: "Location",
    btn_home: "Home/Apt",
    city_lbl: "Current City",
    city_ph: "Ex: Londrina, SP...",
    
    lbl_motel: "Motel Name",
    lbl_suite: "Suite Number",
    ph_motel: "Ex: Motel London",
    
    lbl_hotel: "Hotel Name",
    lbl_room: "Room Number",
    ph_hotel: "Ex: Bourbon Hotel",
    
    lbl_addr: "Street Address",
    lbl_num: "Number",
    lbl_dist: "District",
    lbl_comp: "Complement",
    
    uber_warn: "Uber fee not included. Calculated via WhatsApp.",
    
    review_title: "Order Summary",
    base_val: "Base Value",
    coupon_lbl: "Coupon Applied",
    add_coupon: "I have a Coupon",
    total_lbl: "Final Total",
    loc_lbl: "Location",
    pay_lbl: "Payment",
    pay_method_title: "Payment (On Site)",
    confirm_btn: "Book on WhatsApp",
    
    wallet: "Wallet",
    empty_wallet: "Empty.",
    use: "USE",
    gift_title: "Gift Available",
    gift_sub: "Tap to redeem.",
    copy_pix: "COPY PIX KEY",
    pix_copied: "PIX COPIED!",
    
    money: "Cash",
    card: "Card",
    menu_fid: "Loyalty",
    menu_share: "Share App",
    menu_doubts: "FAQ",
    success_title: "Request Sent!",
    success_msg: "Wait for Uber confirmation on WhatsApp.",
    new_book: "New Booking"
  }
};

// Dados Estruturais (Preços Fixos)
const SERVICES_DB = [
  { id: 'completa', price: 175, xp: 100 },
  { id: 'relax', price: 145, xp: 50 }
];

const EXTRAS_DB = [
  { id: 'more_time', icon: Clock, price: 70 },
  { id: 'touch', icon: Flame, price: 63 },
  { id: 'aroma', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Profissionalismo raro. Pontual e educado.", a: "Carlos", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba.", a: "Pedro", s: 5 },
  { t: "Ambiente que ele cria é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois.", a: "Alan", s: 5 },
  { t: "O corpo a corpo é quente de verdade.", a: "J.P.", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista", s: 5 },
  { t: "A técnica dele é diferente de tudo.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total.", a: "Caio", s: 5 },
  { t: "Extremamente educado e com papo bom.", a: "Renan", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "Sigilo", s: 5 }
];

const FAQS = [
    { q: "Location / Local?", a: "Home, Hotel, Motel." },
    { q: "Uber?", a: "Not included / Não incluso." },
    { q: "Card / Cartão?", a: "Yes / Sim." }
];

// ==================================================================================
// 3. UTILS & COMPONENTS
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

const Toast = ({ msg, show, isDark }) => (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
        <div className={`${isDark ? 'bg-[#1C1C1E] border-green-500/40 text-white' : 'bg-white border-green-500 text-gray-900 shadow-xl'} border px-6 py-3 rounded-full flex items-center gap-3 backdrop-blur-xl`}>
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-xs font-bold uppercase tracking-wider">{msg}</span>
        </div>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder, type="text", icon: Icon, isDark }) => (
  <div className="mb-5 w-full group">
    <label className={`text-[10px] font-bold uppercase ml-1 mb-2 block tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</label>
    <div className="relative">
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full h-14 rounded-2xl px-4 pl-12 text-base outline-none transition-all duration-300 border focus:ring-1 
            ${isDark 
                ? 'bg-[#111] border-[#333] text-white placeholder:text-gray-700 focus:border-green-500 focus:ring-green-500/30' 
                : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500/20 shadow-sm'}`}
        />
        {Icon && <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'text-gray-600 group-focus-within:text-green-500' : 'text-gray-400 group-focus-within:text-green-600'}`} size={20} />}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon, pulse, variant="primary", isDark }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]
            ${variant === 'primary' 
                ? (disabled 
                    ? (isDark ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-gray-200 text-gray-400') 
                    : (isDark ? 'bg-white text-black hover:bg-gray-200 shadow-white/10' : 'bg-black text-white hover:bg-gray-800 shadow-xl'))
                : (isDark ? 'bg-[#1C1C1E] border border-[#333] text-white' : 'bg-white border border-gray-200 text-black shadow-sm')
            }
            ${pulse ? 'animate-pulse' : ''} cursor-pointer
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

const SplashScreen = ({ onFinish, isDark }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { 
        const t1 = setTimeout(() => setFade(true), 2000); 
        const t2 = setTimeout(onFinish, 2500); 
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onFinish]);
    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-700 ${isDark ? 'bg-black' : 'bg-white'} ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative animate-bounce text-green-500"><Zap size={64} fill="currentColor"/></div>
            </div>
            <h1 className={`text-3xl font-black tracking-[0.4em] ${isDark ? 'text-white' : 'text-black'}`}>THALY</h1>
        </div>
    );
};

const ReviewCarousel = ({ isDark }) => (
    <div className="w-full overflow-hidden relative py-4">
        <div className="flex gap-4 animate-scroll w-max">
             {[...REVIEWS_DB, ...REVIEWS_DB].map((r, i) => (
                 <div key={i} className={`w-[280px] p-6 rounded-3xl border flex-shrink-0 relative overflow-hidden ${isDark ? 'bg-[#161616] border-[#2A2A2A]' : 'bg-white border-gray-200 shadow-sm'}`}>
                     <div className="flex text-yellow-500 mb-3 gap-1">{[...Array(5)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                     <p className={`text-xs italic mb-4 leading-relaxed line-clamp-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"{r.t}"</p>
                     <div className={`flex items-center gap-2 border-t pt-3 ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <Shield size={12} className="text-green-500"/>
                        <p className={`text-[9px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{r.a}</p>
                     </div>
                 </div>
             ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 120s linear infinite; }`}</style>
    </div>
);

// ==================================================================================
// 3. APP LOGIC
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // THEME & LANG
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  const T = TEXTS[lang];

  // DATA PERSISTENCE
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch (e) { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => {
      const savedTheme = localStorage.getItem('thaly_theme');
      if (savedTheme) setIsDark(savedTheme === 'dark');
      const savedLang = localStorage.getItem('thaly_lang');
      if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch (e) {} }, [user]);

  const toggleTheme = () => { setIsDark(!isDark); localStorage.setItem('thaly_theme', !isDark ? 'dark' : 'light'); };
  const toggleLang = () => { const newLang = lang === 'pt' ? 'en' : 'pt'; setLang(newLang); localStorage.setItem('thaly_lang', newLang); };

  // SESSION STATE
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, 
      date: null,
      time: null,
      locationType: 'home', 
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // HELPERS
  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };
  const handleReset = () => { setSuccess(false); setBooking(initialBooking); setStep(0); };

  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return 'past';
      if ((sel.getDate() + h) % 5 === 0) return 'sold_out'; 
      return 'available';
  };

  const calculateTotal = () => {
      let s = booking.service?.price || 0;
      let e = 0;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += EXTRAS_DB.find(x => x.id === k).price; });
      const d = booking.appliedCoupon?.val || 0;
      return { service: s, extras: e, disc: d, final: Math.max(0, s + e - d) };
  };

  const isAddressValid = () => {
      const { city, street, number, district, motelName, suite, hotelName, room } = booking.address;
      if (!city || city.length < 3) return false;
      if (booking.locationType === 'motel') return motelName && suite;
      if (booking.locationType === 'hotel') return hotelName && room;
      return street && number && district;
  };

  const finalize = () => {
      const newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      let locStr = "";
      let mapLink = "";
      const addr = booking.address;
      
      if(booking.locationType === 'motel') {
          locStr = `🏩 MOTEL: ${addr.motelName}\n🚪 SUÍTE: ${addr.suite}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.motelName + ' ' + addr.city)}`;
      } else if(booking.locationType === 'hotel') {
          locStr = `🏨 HOTEL: ${addr.hotelName}\n🚪 QUARTO: ${addr.room}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.hotelName + ' ' + addr.city)}`;
      } else {
          locStr = `🏠 CASA: ${addr.street}, ${addr.number}\n🏘️ BAIRRO: ${addr.district} ${addr.comp ? `(${addr.comp})` : ''}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.street + ', ' + addr.number + ' - ' + addr.district + ', ' + addr.city)}`;
      }

      const fin = calculateTotal();
      const svcName = booking.service.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
      
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
          let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
          return `• ${l} (+${Utils.fmtMoney(EXTRAS_DB.find(x=>x.id===k).price)})`;
      }).join('\n');

      const text = `
*AGENDAMENTO (${lang.toUpperCase()})* 🌿
---------------------------
👤 *${user.name}*
✅ (+18 OK)

💆 ${svcName}
📅 ${new Date(booking.date).toLocaleDateString('pt-BR')} @ ${booking.time}

✨ ${extrasTxt ? 'Extras:\n' + extrasTxt : 'No Extras'}

📍 ${addr.city}
${locStr}
🔗 ${mapLink}

💰 *FINANCEIRO:*
Svc: ${Utils.fmtMoney(fin.service)}
Ext: ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `🎟️ Cupom: - ${Utils.fmtMoney(fin.disc)}` : ''}
*TOTAL: ${Utils.fmtMoney(fin.final)}*

🚗 Uber: ???

💳 ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  const financials = calculateTotal();

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} isDark={isDark} />;

  if (success) return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl"><Check size={48} className="text-white" strokeWidth={4}/></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{T.success_title}</h2>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-xs`}>{T.success_msg}</p>
          <PrimaryButton onClick={handleReset} label={T.new_book} icon={RefreshCw} variant="secondary" isDark={isDark}/>
      </div>
  );

  return (
    <div className={`min-h-screen font-sans pb-48 transition-colors duration-300 ${isDark ? 'bg-black text-white selection:bg-green-500 selection:text-black' : 'bg-gray-50 text-gray-900 selection:bg-black selection:text-white'}`}>
      <Toast show={toast.show} msg={toast.msg} isDark={isDark} />

      {/* HEADER */}
      <header className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className={`p-2 -ml-2 active:scale-90 transition-transform ${isDark ? 'text-gray-400' : 'text-gray-600'}`}><ChevronLeft size={28}/></button>}
                 <h1 className="text-sm font-black tracking-[0.2em] uppercase">Thaly</h1>
             </div>
             <div className="flex gap-2">
                 <button onClick={toggleLang} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><span className="text-[10px] font-bold">{lang.toUpperCase()}</span></button>
                 <button onClick={toggleTheme} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}>{isDark ? <Sun size={20}/> : <Moon size={20}/>}</button>
                 <button onClick={() => setMenuOpen(true)} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Menu size={20}/></button>
             </div>
         </div>
         <div className={`h-[2px] w-full ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`}><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MODALS */}
      {menuOpen && <div className="fixed inset-0 z-50 flex justify-end"><div className="absolute inset-0 bg-black/80" onClick={()=>setMenuOpen(false)}></div><div className={`relative w-72 h-full border-l p-6 shadow-2xl animate-slide-in ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><button onClick={()=>setMenuOpen(false)} className="mb-8"><X/></button><div className={`${isDark ? 'bg-[#222]' : 'bg-gray-100'} p-4 rounded-xl mb-4 text-center`}><p className="text-xs text-gray-500 uppercase">{T.menu_fid}</p><p className="text-green-500 font-bold text-xl">{user.xp} XP</p></div><button className={`w-full py-4 rounded-xl font-bold text-sm mb-2 ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`} onClick={() => { setHelpOpen(true); setMenuOpen(false); }}>{T.menu_doubts}</button><button className={`w-full py-4 rounded-xl font-bold text-sm ${isDark ? 'bg-[#222]' : 'bg-gray-100'}`} onClick={()=>{if(navigator.share)navigator.share({url:window.location.href})}}>{T.menu_share}</button></div></div>}
      {helpOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"><div className={`w-full max-w-sm border rounded-3xl p-6 ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><h3 className="font-bold text-xl mb-4">{T.menu_doubts}</h3><div className="space-y-3">{FAQS.map((f,i)=>(<div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}><p className="text-green-500 text-xs font-bold mb-1">{f.q}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{f.a}</p></div>))}</div><button onClick={()=>setHelpOpen(false)} className={`w-full mt-4 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-[#333]' : 'bg-gray-200'}`}>Close</button></div></div>}
      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"><div className={`w-full max-w-sm border rounded-3xl p-6 ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><div className="flex justify-between mb-6"><h3 className="font-bold text-xl flex gap-2"><Wallet className="text-green-500"/> {T.wallet}</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>{user.coupons.length===0?<p className="text-center text-gray-500">{T.wallet_empty}</p>:user.coupons.map(c=>(<button key={c.id} onClick={()=>{setBooking({...booking, appliedCoupon:c});setWalletOpen(false);showToast(T.coupon_lbl);}} className={`w-full p-4 border border-green-900 rounded-xl flex justify-between mb-2 text-green-500 font-bold ${isDark ? 'bg-black' : 'bg-green-50'}`}><span>{c.label}</span><span>R$ {c.val}</span></button>))}</div></div>}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">

        {/* STEP 0: INTRO & SERVICES */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer mb-8 transition-colors ${isDark ? 'bg-gradient-to-r from-green-900/20 to-black border-green-500/20 hover:border-green-500/50' : 'bg-green-50 border-green-200'}`}>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white animate-pulse"><Gift size={20}/></div>
                        <div><p className={`font-black text-sm uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}>{T.gift_title}</p><p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{T.gift_sub}</p></div>
                    </div>
                )}
                <h2 className="text-3xl font-black mb-2 tracking-tight">{T.welcome}</h2>
                <div className="space-y-4 mb-10">
                    <BigInput label={T.your_name} placeholder={T.name_placeholder} value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} isDark={isDark} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'border-green-500' : (isDark ? 'bg-[#0A0A0A] border-[#222]' : 'bg-white border-gray-200')}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{T.health_check}</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">{T.choose_svc}</h3>
                
                <div className="space-y-6 pb-10">
                    {SERVICES_DB.map(s => {
                        const name = s.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
                        const desc = s.id === 'completa' ? T.svc_comp_desc : T.svc_relax_desc;
                        const note = s.id === 'completa' ? T.svc_comp_note : T.svc_relax_note;
                        const tag = s.id === 'completa' ? T.svc_comp_tag : T.svc_relax_tag;
                        const steps = s.id === 'completa' ? T.svc_comp_steps : T.svc_relax_steps;

                        return (
                            <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${booking.service?.id === s.id ? (isDark ? 'bg-[#18181b] border-green-500' : 'bg-green-50 border-green-500') : (isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200')}`}>
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-gray-500' : 'bg-gray-200 text-gray-500')}`}>{tag}</div>
                                <h3 className={`text-xl font-black uppercase mb-1 ${booking.service?.id === s.id ? (isDark ? 'text-white' : 'text-gray-900') : 'text-gray-400'}`}>{name}</h3>
                                <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-500' : 'text-gray-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                                <div className={`space-y-2 mb-4 p-4 rounded-xl ${booking.service?.id === s.id ? (isDark ? 'bg-black/40' : 'bg-white/60') : (isDark ? 'bg-black/20' : 'bg-gray-50')}`}>{steps.map((st, i) => (<p key={i} className={`text-xs font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{st}</p>))}</div>
                                <p className="text-[10px] text-gray-500 flex items-center gap-1 italic"><Info size={10}/> {note}</p>
                            </div>
                        )
                    })}
                </div>

                <div className="mb-20">
                    <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{T.review_title}</p>
                    <ReviewCarousel isDark={isDark} />
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label={T.continue} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* STEP 1: EXTRAS & DATA */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">{T.personalize}</h2>
                <div className="mb-10">
                    {EXTRAS_DB.map(ex => {
                        const active = booking.extras[ex.id];
                        let label = ex.id === 'more_time' ? T.ext_time : ex.id === 'touch' ? T.ext_touch : T.ext_aroma;
                        let sub = ex.id === 'more_time' ? T.ext_time_sub : ex.id === 'touch' ? T.ext_touch_sub : T.ext_aroma_sub;
                        let warn = ex.id === 'touch' ? T.ext_touch_warn : null;

                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? (isDark ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-green-50 border-green-500') : (isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200')}`}>
                                <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-gray-600' : 'bg-gray-100 text-gray-400')}`}><ex.icon size={20}/></div><div><p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{label}</p><p className="text-xs text-gray-500">{sub}</p>{active && warn && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {warn}</p>}</div></div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-400'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{T.date_title}</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-gray-500' : 'bg-white border-gray-200 text-gray-400')}`}><span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span></button>
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in pb-24">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : status === 'sold_out' ? 'opacity-50 cursor-not-allowed' : status === 'past' ? 'opacity-30' : (isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-white border-gray-200')}`}>{t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">{T.sold_out}</span></div>}</button>
                        })}
                    </div>
                )}
                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label={T.continue} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* STEP 2: LOCAL, RESUMO & PAGAMENTO */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">{T.loc_title}</h2>
                
                <div className={`flex p-1.5 rounded-2xl mb-6 border ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-gray-100 border-gray-200'}`}>
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: '', hotelName: '', room: '', street: '', number: '', district: ''}})} 
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? (isDark ? 'bg-[#333] text-white shadow-md' : 'bg-white text-black shadow-sm') : 'text-gray-500'}`}>
                            {t === 'home' ? T.btn_home : t.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label={T.city_lbl} placeholder={T.city_ph} value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} isDark={isDark} />
                    
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_motel} value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} isDark={isDark} placeholder={T.ph_motel} />
                            <BigInput label={T.lbl_suite} type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} isDark={isDark} />
                        </div>
                    ) : booking.locationType === 'hotel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_hotel} value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} isDark={isDark} placeholder={T.ph_hotel} />
                            <BigInput label={T.lbl_room} type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} isDark={isDark} />
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label={T.lbl_addr} value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} isDark={isDark} />
                            <div className="flex gap-3">
                                <div className="w-1/3"><BigInput label={T.lbl_num} type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} isDark={isDark} /></div>
                                <div className="w-2/3"><BigInput label={T.lbl_dist} value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} isDark={isDark} /></div>
                            </div>
                            <BigInput label={T.lbl_comp} value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} isDark={isDark} />
                        </div>
                    )}
                </div>

                {/* TICKET */}
                <div className={`border rounded-[2rem] p-6 mb-8 relative overflow-hidden ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-white border-gray-200 shadow-xl'}`}>
                    <div className={`border-b pb-4 mb-4 text-center ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{T.review_title}</p>
                        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{booking.service?.id==='completa' ? T.svc_comp_name : T.svc_relax_name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} @ {booking.time}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-400"><span>{T.base_val}</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
                             let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
                             return <div key={k} className={`flex justify-between text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}><span>+ {l}</span><span>{Utils.fmtMoney(EXTRAS_DB.find(e=>e.id===k).price)}</span></div>
                        })}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-500 font-bold py-2 border-t border-dashed border-gray-700"><span>{T.coupon_lbl}</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>
                        ) : (
                            <button onClick={() => setShowWallet(true)} className={`w-full py-2 border border-dashed rounded-lg text-xs flex items-center justify-center gap-2 mt-2 ${isDark ? 'border-[#444] text-gray-500' : 'border-gray-300 text-gray-500'}`}><Ticket size={12}/> {T.add_coupon}</button>
                        )}
                    </div>
                    <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <span className="text-xs font-bold text-gray-500 uppercase">{T.total_lbl}</span>
                        <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{Utils.fmtMoney(financials.final)}</span>
                    </div>
                </div>

                <div className="mb-32">
                    <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{T.pay_method_title}</p>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'money'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-gray-500' : 'bg-white border-gray-200 text-gray-500')}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'money' && <Banknote size={18}/>}
                                {T[p]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-6 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 px-1"><span className="text-xs text-gray-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> {T.uber_warn}</span><button onClick={() => {Utils.copyPix(); showToast(T.pix_copied)}} className="text-[10px] font-bold text-green-500 flex items-center gap-1"><Copy size={10}/> {T.copy_pix}</button></div>
                    <PrimaryButton disabled={!isAddressValid() || !booking.payment} onClick={finalize} label={T.confirm_btn} icon={MessageCircle} pulse isDark={isDark} />
                </div>
            </>
        )}
      </main>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scroll { animation: scroll 120s linear infinite; } @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
