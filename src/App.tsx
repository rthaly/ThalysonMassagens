import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, BedDouble, Map
} from 'lucide-react';

// ==================================================================================
// 1. DADOS DE NEGÓCIO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v10_platinum',
  XP_TARGET: 300 
};

const SERVICES = [
  { 
    id: 'completa', name: '🔥 Completa (1h)', 
    label: 'MAIS PEDIDA',
    price: 175, xp: 60,
    steps: ['1️⃣ Relaxante (Tira tensão)', '2️⃣ Corpo a Corpo (Sensitivo)', '3️⃣ Tântrica (Finalização inclusa)'],
    note: 'Focado no prazer. Sem penetração/oral.'
  },
  { 
    id: 'relax', name: '🍃 Relaxante (1h)', 
    label: 'TERAPÊUTICA',
    price: 145, xp: 30,
    steps: ['1️⃣ Foco muscular', '2️⃣ Alívio de dores', '3️⃣ Apenas relaxamento físico'],
    note: 'Sem toques íntimos.'
  }
];

const EXTRAS = [
  { id: 'more_time', label: 'Duração 1h30', sub: '+30 minutos', icon: Clock, price: 70 },
  { id: 'touch', label: 'Interatividade', sub: 'Toque recíproco', icon: Flame, price: 63, warn: 'Fico de cueca' },
  { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "Melhor massagem da vida. A progressão é incrível.", a: "Tiago", s: 5 },
  { t: "Profissionalismo raro. O lugar é discreto e ele é educado.", a: "Roberto", s: 5 },
  { t: "Fui travado e saí leve. Vale cada centavo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
  { t: "Atendimento no hotel foi rápido e seguro.", a: "Viajante SP", s: 5 },
  { t: "A finalização manual é intensa mesmo. Recomendo.", a: "Anônimo", s: 5 },
  { t: "Gostei da facilidade de agendar. Sem enrolação.", a: "Carlos", s: 5 },
  { t: "O toque dele vicia. Já virei cliente fiel.", a: "Lucas", s: 5 }
];

const FAQS = [
    { q: "Onde você atende?", a: "Vou até você: Sua Casa, Apartamento, Hotel ou Motel." },
    { q: "O Uber é incluso?", a: "Não. Calculo a ida e volta na hora pelo WhatsApp." },
    { q: "Aceita Cartão?", a: "Sim, levo a maquininha (Débito/Crédito)." }
];

// ==================================================================================
// 2. COMPONENTES VISUAIS (DESIGN SYSTEM)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

const Toast = ({ msg, show }) => (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#111] border border-green-500/40 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-xl">
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-xs font-bold uppercase tracking-wider">{msg}</span>
        </div>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder, type="text", icon: Icon }) => (
  <div className="mb-4 w-full">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block tracking-wider">{label}</label>
    <div className="relative group">
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-14 bg-[#111] border border-[#333] rounded-xl px-4 pl-12 text-white text-base placeholder:text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500/30 outline-none transition-all"
        />
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={20} />}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon, pulse }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg
            ${disabled ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-white/10'}
            ${pulse ? 'animate-pulse' : ''}
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

const ReviewCarousel = () => (
    <div className="w-full overflow-hidden relative py-2">
        <div className="flex gap-4 animate-scroll w-max">
             {[...REVIEWS_DB, ...REVIEWS_DB].map((r, i) => (
                 <div key={i} className="w-[260px] bg-[#161616] p-5 rounded-2xl border border-[#2A2A2A] flex-shrink-0">
                     <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                     <p className="text-gray-300 text-xs italic mb-3 line-clamp-3">"{r.t}"</p>
                     <p className="text-[9px] font-black text-gray-500 uppercase flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                 </div>
             ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 60s linear infinite; }`}</style>
    </div>
);

const SplashScreen = ({ onFinish }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { setTimeout(() => setFade(true), 2000); setTimeout(onFinish, 2500); }, []);
    return (
        <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-500 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="animate-bounce mb-4 text-green-500"><Zap size={48} fill="currentColor"/></div>
            <h1 className="text-2xl font-black tracking-[0.3em] text-white animate-pulse">THALYMASSAGENS</h1>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">Carregando App...</p>
        </div>
    );
};

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Persistence
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', coupons: [] }; }
  });
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Booking State
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, 
      date: null,
      time: null,
      locationType: 'home', // home, hotel, motel
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // Actions
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
      if ((sel.getDate() + h) % 5 === 0) return 'sold_out'; // Escassez distribuida
      return 'available';
  };

  const calculateTotal = () => {
      let s = booking.service?.price || 0;
      let e = 0;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += EXTRAS.find(x => x.id === k).price; });
      const d = booking.appliedCoupon?.val || 0;
      return { service: s, extras: e, disc: d, final: Math.max(0, s + e - d) };
  };

  // VALIDAÇÃO DE ENDEREÇO CORRIGIDA
  const isAddressValid = () => {
      const { city, street, number, district, motelName, suite, hotelName, room } = booking.address;
      if (!city || city.length < 3) return false;
      
      if (booking.locationType === 'motel') return motelName && suite;
      if (booking.locationType === 'hotel') return hotelName && room;
      return street && number && district; // Casa
  };

  const finalize = () => {
      const newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // Generate Address String
      let locStr = "";
      const addr = booking.address;
      if(booking.locationType === 'motel') locStr = `🏩 MOTEL: ${addr.motelName}\n🚪 SUÍTE: ${addr.suite}`;
      else if(booking.locationType === 'hotel') locStr = `🏨 HOTEL: ${addr.hotelName}\n🚪 QUARTO: ${addr.room}`;
      else locStr = `🏠 CASA: ${addr.street}, ${addr.number}\n🏘️ BAIRRO: ${addr.district} ${addr.comp ? `(${addr.comp})` : ''}`;

      const fin = calculateTotal();
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> `• ${EXTRAS.find(x=>x.id===k).label} (+${Utils.fmtMoney(EXTRAS.find(x=>x.id===k).price)})`).join('\n');

      const text = `
*AGENDAMENTO VIP* 🌿
---------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* +18 Confirmado

💆 *Serviço:* ${booking.service?.name}
📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

✨ *Adicionais:*
${extrasTxt || 'Nenhum'}

📍 *Localização:*
${locStr}
🗺️ Cidade: ${addr.city}

💰 *RESUMO FINANCEIRO:*
Serviço: ${Utils.fmtMoney(fin.service)}
Extras: ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `🎟️ Cupom: - ${Utils.fmtMoney(fin.disc)}` : ''}
*TOTAL SERVIÇO: ${Utils.fmtMoney(fin.final)}*

🚗 *Uber (Ida/Volta):* A calcular no Zap.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  if (success) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]"><Check size={48} className="text-black" strokeWidth={4}/></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Sucesso!</h2>
          <p className="text-gray-400 mb-8 max-w-xs">Pedido enviado. Aguarde a confirmação do Uber no WhatsApp.</p>
          <button onClick={handleReset} className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase hover:text-white transition-colors"><RefreshCw size={12}/> Novo Agendamento</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-48 selection:bg-green-500 selection:text-black">
      <Toast show={toast.show} msg={toast.msg} />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 active:text-white"><ChevronLeft/></button>}
                 <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Thalymassagens</h1>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => setWalletOpen(true)} className="p-2 bg-[#111] rounded-full border border-[#222] text-green-500 relative">
                    <Gift size={20}/>
                    {user.coupons.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>}
                 </button>
                 <button onClick={() => setMenuOpen(true)} className="p-2 bg-[#111] rounded-full border border-[#222]"><Menu size={20}/></button>
             </div>
         </div>
         <div className="h-[2px] w-full bg-[#111]"><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MENU & WALLET (Modais Ocultos para brevidade - Mesma lógica V9) */}
      {menuOpen && <div className="fixed inset-0 z-50 flex justify-end"><div className="absolute inset-0 bg-black/80" onClick={()=>setMenuOpen(false)}></div><div className="relative w-72 h-full bg-[#111] border-l border-[#222] p-6 shadow-2xl animate-slide-in"><button onClick={()=>setMenuOpen(false)} className="mb-8"><X/></button><div className="bg-[#222] p-4 rounded-xl mb-4 text-center"><p className="text-xs text-gray-400 uppercase">Fidelidade</p><p className="text-green-500 font-bold text-xl">{user.xp} XP</p></div><button className="w-full py-4 bg-[#222] rounded-xl font-bold text-sm" onClick={()=>{if(navigator.share)navigator.share({url:window.location.href})}}>Compartilhar</button></div></div>}
      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"><div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6"><div className="flex justify-between mb-6"><h3 className="font-bold text-white">Carteira</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>{user.coupons.length===0?<p className="text-center text-gray-500">Vazia.</p>:user.coupons.map(c=>(<button key={c.id} onClick={()=>{setBooking({...booking, appliedCoupon:c});setWalletOpen(false);showToast('CUPOM APLICADO!');}} className="w-full p-4 bg-black border border-green-900 rounded-xl flex justify-between mb-2 text-green-500 font-bold"><span>{c.label}</span><span>R$ {c.val}</span></button>))}</div></div>}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">

        {/* STEP 0: HOME */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className="p-4 rounded-2xl bg-gradient-to-r from-green-900/20 to-black border border-green-500/20 flex items-center gap-4 cursor-pointer mb-8 hover:border-green-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black animate-pulse"><Gift size={20}/></div>
                        <div><p className="font-black text-green-400 text-sm uppercase">Cupom Disponível</p><p className="text-xs text-gray-400">Toque para usar seu desconto.</p></div>
                    </div>
                )}
                <h2 className="text-3xl font-black mb-2 tracking-tight">Bem-vindo.</h2>
                <div className="space-y-4 mb-8">
                    <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className="text-xs text-gray-400">Tenho +18 anos e estou saudável.</p>
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-6">Escolha a Experiência</h3>
                <div className="space-y-6">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${booking.service?.id === s.id ? 'bg-[#18181b] border-green-500' : 'bg-[#111] border-[#222]'}`}>
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'}`}>{s.label}</div>
                            <h3 className="text-xl font-black uppercase mb-1">{s.name}</h3>
                            <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-400' : 'text-gray-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                            <div className="space-y-2 mb-4 p-4 rounded-xl bg-black/20">{s.steps.map((step, i) => (<p key={i} className="text-xs text-gray-300 font-medium">{step}</p>))}</div>
                            <p className="text-[10px] text-gray-500 italic"><Info size={10} className="inline mr-1"/> {s.note}</p>
                        </div>
                    ))}
                </div>
                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-[60]">
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label="Continuar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 1: PERSONALIZAÇÃO */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Personalize</h2>
                <div className="mb-8">
                    {EXTRAS.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-[#111] border-[#222]'}`}>
                                <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-600'}`}><ex.icon size={20}/></div><div><p className="font-bold text-sm text-white">{ex.label}</p><p className="text-xs text-gray-500">{ex.sub}</p>{active && ex.warn && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {ex.warn}</p>}</div></div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Data e Hora</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}><span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span></button>
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? 'bg-white text-black border-white' : status === 'sold_out' ? 'opacity-50 bg-[#111] border-[#222]' : status === 'past' ? 'opacity-30 bg-[#111] border-[#222]' : 'bg-[#1C1C1E] border-[#333]'}`}>{t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}</button>
                        })}
                    </div>
                )}
                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-[60]">
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label="Avançar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 2: ENDEREÇO & FINALIZAR (CORREÇÃO DE CAMPOS) */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Localização</h2>
                
                {/* Seletor Tipo */}
                <div className="flex bg-[#1C1C1E] p-1.5 rounded-2xl mb-6 border border-[#333]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: '', hotelName: '', room: '', street: '', number: '', district: ''}})} 
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow-md' : 'text-gray-500'}`}>
                            {t === 'home' ? 'Casa' : t.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label="Cidade Atual" placeholder="Ex: Londrina..." value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} />
                    
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : booking.locationType === 'hotel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Nome do Hotel" placeholder="Ex: Hotel Bourbon" value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número do Quarto" placeholder="Ex: 104" type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Endereço (Rua)" placeholder="Ex: Rua Piauí" value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} />
                            <div className="flex gap-3">
                                <div className="w-1/3"><BigInput label="Número" placeholder="123" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                                <div className="w-2/3"><BigInput label="Bairro" placeholder="Centro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                            </div>
                            <BigInput label="Complemento (Opcional)" placeholder="Ex: Apto 101" value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                        </div>
                    )}
                </div>

                <div className="mb-32">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Pagamento (No Local)</p>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'esp'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? 'bg-white text-black shadow-lg' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'esp' && <Banknote size={18}/>}
                                {p === 'esp' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full p-6 bg-black/95 border-t border-white/10 z-[60]">
                    <div className="flex justify-between items-center mb-4 px-1"><span className="text-xs text-gray-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> Uber não incluso</span><button onClick={() => {Utils.copyPix(); showToast("CHAVE PIX COPIADA!")}} className="text-[10px] font-bold text-green-500 flex items-center gap-1"><Copy size={10}/> PIX COPY</button></div>
                    <PrimaryButton disabled={!isAddressValid() || !booking.payment} onClick={finalize} label="Confirmar Agendamento" icon={MessageCircle} pulse />
                </div>
            </>
        )}
      </main>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
    </div>
  );
}
