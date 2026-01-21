import React, { useState, useEffect, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, BedDouble, Map, Lock,
  Globe, Moon, Sun, Instagram
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (FIXOS E SEGUROS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "https://instagram.com/seumassagista",
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v17_bulletproof', // Chave nova para limpar cache antigo
  XP_TARGET: 300,
  REWARD_VAL: 30
};

// TEXTOS (i18n)
const TEXTS = {
  pt: {
    welcome: "Renove suas energias.",
    subtitle: "Massagem profissional de alto nível.",
    your_name: "Como devo te chamar?",
    name_placeholder: "Digite seu nome...",
    health_check: "Tenho +18 anos e estou saudável.",
    start_btn: "Ver Experiências",
    
    choose_svc: "Escolha sua Jornada",
    svc_comp_name: "🔥 Experiência Completa",
    svc_comp_desc: "O ápice do relaxamento. Conexão total.",
    svc_comp_note: "Focado no prazer. Sem penetração/oral.",
    svc_comp_steps: ['1️⃣ Relaxante Muscular', '2️⃣ Corpo a Corpo (Sensitivo)', '3️⃣ Tântrica (Finalização)'],
    svc_comp_tag: "PREMIUM",
    
    svc_relax_name: "🍃 Massagem Relaxante",
    svc_relax_desc: "Alívio imediato de dores.",
    svc_relax_note: "Protocolo terapêutico. Sem toques íntimos.",
    svc_relax_steps: ['1️⃣ Foco em Nódulos', '2️⃣ Movimentos Firmes', '3️⃣ Revitalização'],
    svc_relax_tag: "TERAPÊUTICA",

    personalize: "Turbine sua Sessão",
    ext_time: "Duração 1h30",
    ext_time_sub: "+30 minutos",
    ext_touch: "Interatividade",
    ext_touch_sub: "Troca de energia",
    ext_touch_warn: "Fico de cueca",
    ext_aroma: "Aromaterapia",
    ext_aroma_sub: "Óleos essenciais",

    date_title: "Data e Hora",
    sold_out: "ESGOTADO",
    continue: "Avançar",

    loc_title: "Localização",
    btn_home: "Casa / Apto",
    btn_hotel: "Hotel",
    btn_motel: "Motel",
    
    city_lbl: "Cidade",
    city_ph: "Ex: Londrina, SP...",
    
    lbl_motel: "Nome do Motel",
    lbl_suite: "Suíte",
    lbl_hotel: "Nome do Hotel",
    lbl_room: "Quarto",
    lbl_addr: "Endereço",
    lbl_num: "Número",
    lbl_dist: "Bairro",
    lbl_comp: "Complemento",
    
    uber_warn: "Uber não incluso. Calculado no Zap.",
    
    review_title: "Revisão",
    base_val: "Base",
    coupon_lbl: "Cupom",
    add_coupon: "Add Cupom",
    total_lbl: "Total",
    
    pay_title: "Pagamento (No Local)",
    money: "Dinheiro",
    card: "Cartão",
    pix: "Pix",
    
    copy_pix: "COPIAR PIX",
    confirm_btn: "Confirmar Agendamento",
    
    wallet_title: "Carteira",
    wallet_empty: "Vazia.",
    use: "USAR",
    gift_title: "Presente!",
    gift_sub: "Resgatar cupom.",

    success_title: "Enviado!",
    success_msg: "Aguarde a confirmação do Uber no WhatsApp.",
    new_book: "Novo Pedido",
    
    zap_header: "OLÁ, QUERO AGENDAR",
    zap_uber: "Uber (A Calcular)",
    menu_fid: "Fidelidade",
    menu_share: "Compartilhar",
    menu_doubts: "Dúvidas"
  },
  en: {
    welcome: "Renew Your Energy.",
    subtitle: "High-level professional massage.",
    your_name: "Your Name",
    name_placeholder: "Type your name...",
    health_check: "I am 18+ and healthy.",
    start_btn: "View Experiences",
    
    choose_svc: "Choose Journey",
    svc_comp_name: "🔥 Complete Experience",
    svc_comp_desc: "Total relaxation. Body & mind.",
    svc_comp_note: "Pleasure focus. No penetration/oral.",
    svc_comp_steps: ['1️⃣ Muscle Relax', '2️⃣ Body-to-Body', '3️⃣ Tantra (Finish)'],
    svc_comp_tag: "PREMIUM",
    
    svc_relax_name: "🍃 Relaxing Massage",
    svc_relax_desc: "Pain relief.",
    svc_relax_note: "Therapeutic only. No intimate touch.",
    svc_relax_steps: ['1️⃣ Pain Focus', '2️⃣ Firm Movements', '3️⃣ Revitalization'],
    svc_relax_tag: "THERAPEUTIC",

    personalize: "Add-ons",
    ext_time: "Time 1h30",
    ext_time_sub: "+30 minutes",
    ext_touch: "Interactivity",
    ext_touch_sub: "Energy exchange",
    ext_touch_warn: "Underwear on",
    ext_aroma: "Aromatherapy",
    ext_aroma_sub: "Essential oils",

    date_title: "Date & Time",
    sold_out: "SOLD OUT",
    continue: "Next",

    loc_title: "Location",
    btn_home: "Home / Apt",
    btn_hotel: "Hotel",
    btn_motel: "Motel",
    
    city_lbl: "City",
    city_ph: "Ex: Londrina...",
    
    lbl_motel: "Motel Name",
    lbl_suite: "Suite",
    lbl_hotel: "Hotel Name",
    lbl_room: "Room",
    lbl_addr: "Address",
    lbl_num: "Number",
    lbl_dist: "District",
    lbl_comp: "Complement",
    
    uber_warn: "Uber fee not included.",
    
    review_title: "Review",
    base_val: "Base",
    coupon_lbl: "Coupon",
    add_coupon: "Add Coupon",
    total_lbl: "Total",
    
    pay_title: "Payment",
    money: "Cash",
    card: "Card",
    pix: "Pix",
    
    copy_pix: "COPY PIX",
    confirm_btn: "Confirm Booking",
    
    wallet_title: "Wallet",
    wallet_empty: "Empty.",
    use: "USE",
    gift_title: "Gift!",
    gift_sub: "Redeem coupon.",

    success_title: "Sent!",
    success_msg: "Wait for Uber confirmation on WhatsApp.",
    new_book: "New Booking",

    zap_header: "HELLO, I WANT TO BOOK",
    zap_uber: "Uber (To Calc)",
    menu_fid: "Loyalty",
    menu_share: "Share",
    menu_doubts: "FAQ"
  }
};

const SERVICES_DB = [
  { id: 'completa', price: 175, xp: 100 },
  { id: 'relax', price: 145, xp: 50 }
];

const EXTRAS_DB = [
  { id: 'more_time', icon: Clock, price: 70 },
  { id: 'touch', icon: Flame, price: 63 },
  { id: 'aroma', icon: Wind, price: 10 }
];

// REVIEWS (COMPLETAS)
const REVIEWS_DB = [
  { t: "A melhor massagem que já fiz. A progressão é perfeita.", a: "Tiago", s: 5 },
  { t: "Profissionalismo raro. Explicou tudo antes.", a: "Roberto", s: 5 },
  { t: "Fui travado e saí leve. Vale cada centavo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Sensação de liberdade total. Recomendo muito.", a: "Caio", s: 5 },
  { t: "Atendimento no hotel foi rápido e discreto.", a: "Viajante", s: 5 },
  { t: "A massagem tântrica é real mesmo.", a: "Pedro", s: 5 }
];

const FAQS = [
    { q: "Local?", a: "Home, Hotel, Motel." },
    { q: "Uber?", a: "Extra fee / Taxa extra." },
    { q: "Card?", a: "Yes / Sim." }
];

// ==================================================================================
// 3. UTILS & HELPERS
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

// ==================================================================================
// 4. COMPONENTES VISUAIS
// ==================================================================================

const Toast = ({ msg, show, isDark }) => (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 transform ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
        <div className={`${isDark ? 'bg-zinc-800 text-white border-zinc-700' : 'bg-white text-zinc-900 border-zinc-200'} border px-6 py-3 rounded-full shadow-2xl flex items-center gap-3`}>
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-xs font-bold uppercase">{msg}</span>
        </div>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder, type="text", icon: Icon, isDark }) => (
  <div className="mb-4 w-full">
    <label className={`text-[10px] font-bold uppercase ml-1 mb-1 block tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{label}</label>
    <div className="relative group">
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className={`w-full h-12 rounded-xl px-4 pl-11 text-sm outline-none transition-all border 
            ${isDark 
                ? 'bg-zinc-900 border-zinc-800 text-white focus:border-green-500' 
                : 'bg-white border-zinc-200 text-zinc-900 focus:border-green-500'}`}
        />
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon, pulse, variant="primary", isDark }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95
            ${variant === 'primary' 
                ? (disabled 
                    ? (isDark ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-zinc-200 text-zinc-400') 
                    : (isDark ? 'bg-white text-black hover:bg-zinc-200' : 'bg-black text-white hover:bg-zinc-800'))
                : (isDark ? 'bg-zinc-800 text-white' : 'bg-white border border-zinc-200 text-black')
            }
            ${pulse ? 'animate-pulse' : ''}
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

const SplashScreen = ({ onFinish, isDark }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { 
        const t1 = setTimeout(() => setFade(true), 1500); 
        const t2 = setTimeout(onFinish, 2000); 
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onFinish]);
    return (
        <div className={`fixed inset-0 z-[120] flex flex-col items-center justify-center transition-opacity duration-700 ${isDark ? 'bg-black' : 'bg-white'} ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative mb-4">
                <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
                <Zap size={56} className="text-green-500 relative z-10 animate-bounce" fill="currentColor"/>
            </div>
            <h1 className={`text-2xl font-black tracking-[0.3em] ${isDark ? 'text-white' : 'text-black'}`}>THALY</h1>
        </div>
    );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // --- THEME & LANG ---
  const [isDark, setIsDark] = useState(true);
  const [lang, setLang] = useState('pt');
  const T = TEXTS[lang];

  // --- PERSISTENCE ---
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch (e) { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => {
      const t = localStorage.getItem('thaly_theme');
      if (t) setIsDark(t === 'dark');
      const l = localStorage.getItem('thaly_lang');
      if (l) setLang(l);
  }, []);

  useEffect(() => { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch (e) {} }, [user]);

  const toggleTheme = () => { setIsDark(!isDark); localStorage.setItem('thaly_theme', !isDark ? 'dark' : 'light'); };
  const toggleLang = () => { const n = lang === 'pt' ? 'en' : 'pt'; setLang(n); localStorage.setItem('thaly_lang', n); };

  // --- BOOKING STATE ---
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

  // --- LOGIC ---
  const triggerToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  
  const handleNext = () => { 
      Utils.vibrate(); 
      window.scrollTo({ top: 0, behavior: 'smooth' }); 
      setStep(s => s + 1); 
  };
  
  const handleBack = () => { 
      Utils.vibrate(); 
      setStep(s => s - 1); 
  };

  const handleReset = () => { 
      setSuccess(false); 
      setBooking(initialBooking); 
      setStep(0); 
  };

  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return true;
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

  // VALIDAÇÃO DE ENDEREÇO
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
      
      // Level Up Logic
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: CONFIG.REWARD_VAL });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      let locStr = "";
      let mapLink = "";
      const addr = booking.address;
      
      // Formata endereço baseado no tipo
      if(booking.locationType === 'motel') {
          locStr = `🏩 ${T.lbl_motel}: ${addr.motelName}\n🚪 ${T.lbl_suite}: ${addr.suite}`;
          mapLink = `${addr.motelName}, ${addr.city}`;
      } else if(booking.locationType === 'hotel') {
          locStr = `🏨 ${T.lbl_hotel}: ${addr.hotelName}\n🚪 ${T.lbl_room}: ${addr.room}`;
          mapLink = `${addr.hotelName}, ${addr.city}`;
      } else {
          locStr = `🏠 ${T.lbl_addr}: ${addr.street}, ${addr.number}\n🏘️ ${T.lbl_dist}: ${addr.district}`;
          mapLink = `${addr.street}, ${addr.number}, ${addr.city}`;
      }

      const fin = calculateTotal();
      
      // Traduz nomes para o ZAP
      const svcName = booking.service.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
      
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
          let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
          return `• ${l} (+${Utils.fmtMoney(EXTRAS_DB.find(x=>x.id===k).price)})`;
      }).join('\n');

      const text = `
*${T.zap_header}* 🌿
---------------------------
👤 *${user.name}*
✅ (+18 OK)

💆 ${svcName}
📅 ${new Date(booking.date).toLocaleDateString('pt-BR')} @ ${booking.time}

✨ ${extrasTxt ? 'Extras:\n'+extrasTxt : 'No Extras'}

📍 ${T.city_lbl}: ${addr.city}
${locStr}
🔗 ${encodeURIComponent(mapLink)}

💰 *FINANCEIRO:*
${T.base_val}: ${Utils.fmtMoney(fin.service)}
Extras: ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `${T.coupon_lbl}: - ${Utils.fmtMoney(fin.disc)}` : ''}
*${T.total_lbl}: ${Utils.fmtMoney(fin.final)}*

🚗 ${T.zap_uber}

💳 ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  const financials = calculateTotal();
  const level = Math.floor(user.xp / CONFIG.XP_TARGET) + 1;
  const nextXp = (level * CONFIG.XP_TARGET) - user.xp;
  const progress = ((user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET) * 100;

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} isDark={isDark} />;

  // --- TELA DE SUCESSO ---
  if (success) return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-8 text-center animate-fade-in ${isDark ? 'bg-black text-white' : 'bg-gray-50 text-gray-900'}`}>
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl"><Check size={48} className="text-white" strokeWidth={4}/></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">{T.success_title}</h2>
          <p className={`mb-8 max-w-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.success_msg}</p>
          <PrimaryButton onClick={handleReset} label={T.new_book} icon={RefreshCw} variant="secondary" isDark={isDark}/>
      </div>
  );

  return (
    <div className={`min-h-screen font-sans pb-40 transition-colors duration-300 ${isDark ? 'bg-black text-white selection:bg-green-500 selection:text-black' : 'bg-gray-50 text-zinc-900 selection:bg-black selection:text-white'}`}>
      <Toast show={toast.show} msg={toast.msg} isDark={isDark} />

      {/* HEADER FIXO */}
      <header className={`fixed top-0 w-full z-40 backdrop-blur-xl border-b transition-colors duration-300 ${isDark ? 'bg-black/80 border-white/5' : 'bg-white/80 border-gray-200'}`}>
         <div className="px-5 py-3 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className={`p-2 -ml-2 active:scale-90 transition-transform ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}><ChevronLeft size={24}/></button>}
                 <h1 className="text-sm font-black tracking-[0.2em] uppercase">Thaly</h1>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => window.open(CONFIG.INSTAGRAM, '_blank')} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Instagram size={18}/></button>
                 <button onClick={toggleLang} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Globe size={18}/></button>
                 <button onClick={toggleTheme} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
                 <button onClick={() => setMenuOpen(true)} className={`p-2 rounded-full border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><Menu size={18}/></button>
             </div>
         </div>
         {/* Barra de Progresso */}
         <div className={`h-[2px] w-full ${isDark ? 'bg-[#111]' : 'bg-gray-200'}`}><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MENU DRAWER */}
      {menuOpen && <div className="fixed inset-0 z-50 flex justify-end"><div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div><div className={`relative w-72 h-full border-l p-6 shadow-2xl ${isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200'}`}><button onClick={()=>setMenuOpen(false)} className="mb-8"><X/></button><div className={`p-4 rounded-xl mb-4 ${isDark ? 'bg-[#1C1C1E]' : 'bg-gray-100'}`}><div className="flex justify-between items-center mb-2"><span className="text-xs font-bold uppercase">{T.level_title}</span><span className="text-green-500 font-bold text-xl">{level}</span></div><div className="h-2 bg-zinc-600 rounded-full overflow-hidden mb-2"><div className="h-full bg-green-500" style={{width:`${progress}%`}}></div></div><p className="text-[10px] opacity-70">{T.next_reward} <span className="font-bold text-green-500">{nextXp}</span> {T.next_reward_suf}</p></div><button className={`w-full py-4 rounded-xl font-bold text-sm mb-2 ${isDark ? 'bg-[#1C1C1E]' : 'bg-gray-100'}`} onClick={() => { setWalletOpen(true); setMenuOpen(false); }}>{T.wallet_title}</button><button className={`w-full py-4 rounded-xl font-bold text-sm mb-2 ${isDark ? 'bg-[#1C1C1E]' : 'bg-gray-100'}`} onClick={() => { setHelpOpen(true); setMenuOpen(false); }}>{T.menu_doubts}</button></div></div>}
      
      {/* WALLET MODAL */}
      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"><div className={`w-full max-w-sm border rounded-3xl p-6 ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><div className="flex justify-between mb-6"><h3 className="font-bold text-xl flex gap-2"><Wallet className="text-green-500"/> {T.wallet_title}</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>{user.coupons.length===0?<p className="text-center opacity-50">{T.wallet_empty}</p>:user.coupons.map(c=>(<button key={c.id} onClick={()=>{setBooking({...booking, appliedCoupon:c});setWalletOpen(false);triggerToast(T.coupon_lbl);}} className={`w-full p-4 border border-green-900 rounded-xl flex justify-between mb-2 text-green-500 font-bold ${isDark ? 'bg-black' : 'bg-green-50'}`}><span>{c.label}</span><span>R$ {c.val}</span></button>))}</div></div>}

      {/* HELP MODAL */}
      {helpOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm"><div className={`w-full max-w-sm border rounded-3xl p-6 ${isDark ? 'bg-[#1C1C1E] border-[#333] text-white' : 'bg-white border-gray-200 text-black'}`}><h3 className="font-bold text-xl mb-4">{T.menu_doubts}</h3><div className="space-y-3">{FAQS.map((f,i)=>(<div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-[#111] border-[#222]' : 'bg-gray-50 border-gray-200'}`}><p className="text-green-500 text-xs font-bold mb-1">{f.q}</p><p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{f.a}</p></div>))}</div><button onClick={()=>setHelpOpen(false)} className={`w-full mt-4 py-3 rounded-xl font-bold text-sm ${isDark ? 'bg-[#333]' : 'bg-gray-200'}`}>Close</button></div></div>}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">

        {/* --- PASSO 0: INTRODUÇÃO & SERVIÇOS --- */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer mb-8 transition-colors ${isDark ? 'bg-gradient-to-r from-green-900/20 to-black border-green-500/20 hover:border-green-500/50' : 'bg-green-50 border-green-200 hover:border-green-300'}`}>
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white animate-pulse"><Gift size={20}/></div>
                        <div><p className={`font-black text-sm uppercase ${isDark ? 'text-green-400' : 'text-green-700'}`}>{T.gift_title}</p><p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.gift_sub}</p></div>
                    </div>
                )}
                
                <h2 className="text-3xl font-black mb-1 tracking-tight">{T.welcome}</h2>
                <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.subtitle}</p>
                
                <div className="space-y-4 mb-10">
                    <BigInput label={T.your_name} placeholder={T.name_placeholder} value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} isDark={isDark} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'border-green-500' : (isDark ? 'bg-[#0A0A0A] border-[#222]' : 'bg-white border-gray-200')}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-white' : 'border-zinc-400'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.health_check}</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">{T.choose_svc}</h3>
                
                <div className="space-y-6 pb-24">
                    {SERVICES_DB.map(s => {
                        const name = s.id === 'completa' ? T.svc_comp_name : T.svc_relax_name;
                        const desc = s.id === 'completa' ? T.svc_comp_desc : T.svc_relax_desc;
                        const note = s.id === 'completa' ? T.svc_comp_note : T.svc_relax_note;
                        const tag = s.id === 'completa' ? T.svc_comp_tag : T.svc_relax_tag;
                        const steps = s.id === 'completa' ? T.svc_comp_steps : T.svc_relax_steps;

                        return (
                            <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${booking.service?.id === s.id ? (isDark ? 'bg-[#18181b] border-green-500' : 'bg-green-50 border-green-500') : (isDark ? 'bg-[#111] border-[#222]' : 'bg-white border-gray-200')}`}>
                                <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-zinc-500' : 'bg-gray-200 text-zinc-500')}`}>{tag}</div>
                                <h3 className={`text-xl font-black uppercase mb-1 ${booking.service?.id === s.id ? (isDark ? 'text-white' : 'text-zinc-900') : 'text-zinc-400'}`}>{name}</h3>
                                <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-500' : 'text-zinc-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                                <div className={`space-y-2 mb-4 p-4 rounded-xl ${booking.service?.id === s.id ? (isDark ? 'bg-black/40' : 'bg-white/60') : (isDark ? 'bg-black/20' : 'bg-gray-50')}`}>{steps.map((st, i) => (<p key={i} className={`text-xs font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{st}</p>))}</div>
                                <p className="text-[10px] text-zinc-500 flex items-center gap-1 italic"><Info size={10}/> {note}</p>
                            </div>
                        )
                    })}
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label={T.start_btn} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* --- PASSO 1: EXTRAS & DATA --- */}
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
                                <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-white' : (isDark ? 'bg-[#222] text-zinc-600' : 'bg-gray-100 text-zinc-400')}`}><ex.icon size={20}/></div><div><p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-zinc-900'}`}>{label}</p><p className="text-xs text-zinc-500">{sub}</p>{active && warn && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {warn}</p>}</div></div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-zinc-400'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{T.date_title}</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-zinc-500' : 'bg-white border-gray-200 text-zinc-400')}`}><span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span></button>
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in pb-24">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const now = new Date(); const sel = new Date(booking.date); const [h] = t.split(':').map(Number);
                            let status = 'available';
                            if (sel.toDateString() === now.toDateString() && h <= now.getHours()) status = 'past';
                            else if ((sel.getDate() + h) % 5 === 0) status = 'sold_out';

                            return <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? (isDark ? 'bg-white text-black' : 'bg-black text-white') : status === 'sold_out' ? 'opacity-50 cursor-not-allowed' : status === 'past' ? 'opacity-30' : (isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-white border-gray-200')}`}>{t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">{T.sold_out}</span></div>}</button>
                        })}
                    </div>
                )}
                <div className={`fixed bottom-0 left-0 w-full p-5 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label={T.continue} icon={ArrowRight} isDark={isDark} />
                </div>
            </>
        )}

        {/* --- PASSO 2: LOCAL, RESUMO & PAGAMENTO --- */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">{T.loc_title}</h2>
                <div className={`flex p-1.5 rounded-2xl mb-6 border ${isDark ? 'bg-[#1C1C1E] border-[#333]' : 'bg-gray-100 border-gray-200'}`}>
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: '', hotelName: '', room: '', street: '', number: '', district: ''}})} 
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? (isDark ? 'bg-[#333] text-white shadow-md' : 'bg-white text-black shadow-sm') : 'text-zinc-500'}`}>
                            {t === 'home' ? T.btn_home : (t === 'hotel' ? T.btn_hotel : T.btn_motel)}
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
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">{T.review_title}</p>
                        <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{booking.service?.id==='completa' ? T.svc_comp_name : T.svc_relax_name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} @ {booking.time}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-zinc-400"><span>{T.base_val}</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> {
                             let l = k === 'more_time' ? T.ext_time : k === 'touch' ? T.ext_touch : T.ext_aroma;
                             return <div key={k} className={`flex justify-between text-sm ${isDark ? 'text-white' : 'text-zinc-800'}`}><span>+ {l}</span><span>{Utils.fmtMoney(EXTRAS_DB.find(e=>e.id===k).price)}</span></div>
                        })}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-500 font-bold py-2 border-t border-dashed border-gray-700"><span>{T.coupon_lbl}</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>
                        ) : (
                            <button onClick={() => setWalletOpen(true)} className={`w-full py-2 border border-dashed rounded-lg text-xs flex items-center justify-center gap-2 mt-2 ${isDark ? 'border-[#444] text-zinc-500' : 'border-gray-300 text-zinc-500'}`}><Ticket size={12}/> {T.add_coupon}</button>
                        )}
                    </div>
                    <div className={`flex justify-between items-center pt-4 border-t ${isDark ? 'border-[#333]' : 'border-gray-100'}`}>
                        <span className="text-xs font-bold text-zinc-500 uppercase">{T.total_lbl}</span>
                        <span className={`text-3xl font-black ${isDark ? 'text-white' : 'text-black'}`}>{Utils.fmtMoney((() => {
                            let s = booking.service?.price || 0;
                            let e = 0;
                            Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += EXTRAS_DB.find(x => x.id === k).price; });
                            const d = booking.appliedCoupon?.val || 0;
                            return Math.max(0, s + e - d);
                        })())}</span>
                    </div>
                </div>

                <div className="mb-32">
                    <p className={`text-[10px] font-bold uppercase mb-3 ml-1 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{T.pay_method_title}</p>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'money'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? (isDark ? 'bg-white text-black shadow-lg' : 'bg-black text-white shadow-lg') : (isDark ? 'bg-[#1C1C1E] border-[#333] text-zinc-500' : 'bg-white border-gray-200 text-zinc-500')}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'money' && <Banknote size={18}/>}
                                {T[p]}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`fixed bottom-0 left-0 w-full p-6 border-t z-[60] ${isDark ? 'bg-black/95 border-white/10' : 'bg-white/95 border-gray-200'}`}>
                    <div className="flex justify-between items-center mb-4 px-1"><span className="text-xs text-zinc-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> {T.uber_warn}</span><button onClick={() => {Utils.copyPix(); triggerToast(T.pix_copied)}} className="text-[10px] font-bold text-green-500 flex items-center gap-1"><Copy size={10}/> {T.copy_pix}</button></div>
                    <PrimaryButton 
                        disabled={(() => {
                            const { city, street, number, district, motelName, suite, hotelName, room } = booking.address;
                            if (!city || city.length < 3) return true;
                            if (booking.locationType === 'motel') return !motelName || !suite;
                            if (booking.locationType === 'hotel') return !hotelName || !room;
                            return !street || !number || !district;
                        })() || !booking.payment} 
                        onClick={finalize} label={T.confirm_btn} icon={MessageCircle} pulse isDark={isDark} 
                    />
                </div>
            </>
        )}
      </main>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scroll { animation: scroll 120s linear infinite; } @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
