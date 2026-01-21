import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, Lock, Smile, Map
} from 'lucide-react';

// ==================================================================================
// 1. DADOS DE NEGÓCIO & CONFIGURAÇÃO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v8_fixed',
  XP_TARGET: 300 
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    label: '🔥 MAIS PEDIDA',
    price: 175, 
    xp: 60,
    steps: [
        '1️⃣ Relaxante no corpo todo (Tira tensão)',
        '2️⃣ Corpo a Corpo (Pele com pele, sensitivo)',
        '3️⃣ Tântrica (Finalização manual inclusa)'
    ],
    note: 'Focado no prazer. Sem penetração/oral.'
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    label: '🍃 TERAPÊUTICA',
    price: 145, 
    xp: 30,
    steps: [
        '1️⃣ Foco muscular e alívio de dores',
        '2️⃣ Movimentos firmes e técnicos',
        '3️⃣ Apenas relaxamento físico'
    ],
    note: 'Nesta modalidade não há toques íntimos.'
  }
];

const EXTRAS = [
  { id: 'more_time', label: 'Duração 1h30', sub: '+30 minutos de sessão', icon: Clock, price: 70 },
  { id: 'touch', label: 'Interatividade', sub: 'Toque recíproco permitido', icon: Flame, price: 63, warning: 'Massagista fica de cueca.' },
  { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais premium', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "A progressão da massagem é perfeita. Começa relaxando e termina intenso.", a: "Tiago", s: 5 },
  { t: "Profissionalismo raro. Explicou tudo antes, sem surpresas.", a: "Roberto", s: 5 },
  { t: "Fui travado e saí leve. A finalização vale cada centavo.", a: "Pedro H.", s: 5 },
  { t: "Discreto e higiênico. Me senti seguro no hotel.", a: "M. Viajante", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 }
];

const FAQS = [
    { q: "Onde você atende?", a: "Vou até você: Sua Casa, Apartamento, Hotel ou Motel." },
    { q: "O Uber é incluso?", a: "Não. Calculamos a ida e volta na hora pelo WhatsApp." },
    { q: "Aceita Cartão?", a: "Sim, levo a maquininha (Débito/Crédito)." }
];

// ==================================================================================
// 2. DESIGN SYSTEM (COMPONENTES)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

// Toast Notification
const Toast = ({ msg, show }) => (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#1C1C1E] border border-green-500/50 text-green-400 px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md">
            <CheckCircle size={18} fill="currentColor" className="text-black"/>
            <span className="text-xs font-bold uppercase tracking-wider">{msg}</span>
        </div>
    </div>
);

// Input Grande
const BigInput = ({ label, value, onChange, placeholder, icon: Icon, type="text" }) => (
  <div className="mb-4 w-full">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1.5 block tracking-wider">{label}</label>
    <div className="relative group">
        <input 
            type={type}
            value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-12 bg-[#111] border border-[#333] rounded-xl px-4 pl-11 text-white text-base placeholder:text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
        />
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={18} />}
    </div>
  </div>
);

// Botão Sticky Principal
const PrimaryButton = ({ onClick, disabled, label, icon: Icon }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-[0.98]
            ${disabled ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_25px_rgba(255,255,255,0.15)]'}
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

// ==================================================================================
// 3. APP LÓGICA & FLUXO
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Persistência
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Agendamento
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, 
      date: null,
      time: null,
      locationType: 'home',
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // --- ACTIONS ---

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };
  const handleReset = () => { setSuccess(false); setBooking(initialBooking); setStep(0); };

  // Lógica de "Esgotado" Realista (Apenas Sex/Sab a noite)
  const checkAvailability = (date, timeStr) => {
      if (!date) return 'blocked';
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      
      // Bloquear passado
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return 'past';
      
      // Regra de Ouro: Esgotado apenas Sexta(5) e Sabado(6) as 19h e 20h
      const day = sel.getDay();
      if ((day === 5 || day === 6) && (h === 19 || h === 20)) return 'sold_out';
      
      return 'available';
  };

  const calculateTotal = () => {
      let servicePrice = booking.service?.price || 0;
      let extrasPrice = 0;
      Object.keys(booking.extras).forEach(k => {
          if(booking.extras[k]) extrasPrice += EXTRAS.find(e => e.id === k).price;
      });
      const disc = booking.appliedCoupon?.val || 0;
      return { service: servicePrice, extras: extrasPrice, disc, final: Math.max(0, servicePrice + extrasPrice - disc) };
  };

  const isAddressValid = () => {
      const { city, street, number, district, motelName, suite } = booking.address;
      if (!city) return false;
      if (booking.locationType === 'motel') return motelName && suite;
      return street && number && district; // Casa/Hotel precisa disso
  };

  const finalize = () => {
      // 1. Queima Cupom
      let newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      
      // 2. XP (Gamificação)
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 3. Monta Endereço & Maps
      let locStr = "";
      let mapsQuery = "";

      if(booking.locationType === 'motel') {
          locStr = `🏩 MOTEL: ${booking.address.motelName} (Suíte ${booking.address.suite})`;
          mapsQuery = `${booking.address.motelName}, ${booking.address.city}`;
      } else {
          const t = booking.locationType === 'hotel' ? '🏨 HOTEL' : '🏠 RESIDÊNCIA';
          locStr = `${t}: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
          if(booking.address.comp) locStr += ` (${booking.address.comp})`;
          mapsQuery = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
      }

      const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;

      // 4. Texto Zap
      const fin = calculateTotal();
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> `• ${EXTRAS.find(e=>e.id===k).label} (${Utils.fmtMoney(EXTRAS.find(e=>e.id===k).price)})`).join('\n');
      
      const text = `
*AGENDAMENTO VIP* 🌿
---------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* Confirmado (+18)

💆 *Serviço:* ${booking.service?.name}
📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

✨ *Adicionais:*
${extrasTxt || 'Nenhum'}

📍 *Localização:*
${locStr}
Cidade: ${booking.address.city}
🗺️ *Maps:* ${mapsLink}

💰 *RESUMO FINANCEIRO:*
Serviço Base: ${Utils.fmtMoney(fin.service)}
Extras: + ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `🎟️ Cupom: - ${Utils.fmtMoney(fin.disc)}` : ''}
---------------------------
*TOTAL A PAGAR: ${Utils.fmtMoney(fin.final)}*
---------------------------

🚗 *Uber (Deslocamento):*
Vou calcular a ida e volta agora e te passo o valor total.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  const financials = calculateTotal();

  // --- RENDER ---

  if (success) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in-up text-white">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <Check size={48} className="text-black" strokeWidth={4}/>
          </div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Solicitação Enviada!</h2>
          <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">Enviei os detalhes e a localização para seu WhatsApp.</p>
          <button onClick={handleReset} className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase hover:text-white transition-colors"><RefreshCw size={12}/> Fazer novo agendamento</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32 selection:bg-green-500 selection:text-black">
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

      {/* MENU & WALLET (Omitted for brevity, same as V7 but functional) */}
      {menuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
              <div className="relative w-72 h-full bg-[#111] border-l border-[#222] p-6 shadow-2xl animate-fade-in-up">
                  <div className="flex justify-between items-center mb-8"><span className="font-bold text-xl">Menu</span><button onClick={()=>setMenuOpen(false)}><X className="text-gray-400"/></button></div>
                  <div className="bg-[#1C1C1E] p-4 rounded-2xl mb-6 border border-[#333]">
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-400"><span>Fidelidade</span><span className="text-green-500 text-sm">{Math.floor(user.xp/300)+1}</span></div>
                      <div className="h-2 bg-[#333] rounded-full overflow-hidden mb-2"><div className="h-full bg-green-500" style={{width:`${(user.xp%300)/300*100}%`}}></div></div>
                      <p className="text-[10px] text-gray-500">Ganhe {300 - (user.xp%300)} XP para novo prêmio.</p>
                  </div>
                  <button onClick={() => {if(navigator.share) navigator.share({url: window.location.href})}} className="w-full py-4 bg-[#1C1C1E] rounded-xl font-bold text-sm mb-3 flex items-center gap-3 px-4"><Share2 size={18} className="text-gray-400"/> Compartilhar</button>
              </div>
          </div>
      )}
      {walletOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 animate-fade-in-up">
                  <div className="flex justify-between mb-6"><h3 className="font-bold text-white text-xl flex gap-2"><Wallet className="text-green-500"/> Carteira</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>
                  {user.coupons.length === 0 ? <p className="text-center text-gray-500 py-6">Vazia.</p> : (
                      <div className="space-y-3">{user.coupons.map(c => (<button key={c.id} onClick={() => { setBooking({...booking, appliedCoupon: c}); setWalletOpen(false); showToast('CUPOM APLICADO!'); }} className="w-full p-4 bg-black border border-green-900/50 rounded-xl flex justify-between items-center text-green-500 font-bold hover:border-green-500 transition-colors"><span>{c.label}</span><span>R$ {c.val} OFF</span></button>))}</div>
                  )}
              </div>
          </div>
      )}

      {/* MAIN CONTENT */}
      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in-up">

        {/* STEP 0: IDENTIFICAÇÃO & SERVIÇOS */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className="p-4 rounded-2xl bg-gradient-to-r from-green-900/20 to-black border border-green-500/20 flex items-center gap-4 cursor-pointer mb-8 hover:border-green-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black animate-pulse"><Gift size={20}/></div>
                        <div><p className="font-black text-green-400 text-sm uppercase">Cupom Disponível</p><p className="text-xs text-gray-400">Toque para usar seu desconto.</p></div>
                    </div>
                )}

                <h2 className="text-3xl font-black mb-2 tracking-tight">Bem-vindo.</h2>
                <div className="space-y-4 mb-10">
                    <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className="text-xs text-gray-400">Tenho +18 anos e estou saudável.</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Escolha a Experiência</h3>
                
                <div className="space-y-6 pb-24">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer mb-5 ${booking.service?.id === s.id ? 'bg-[#18181b] border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'bg-[#111] border-[#222]'}`}>
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'}`}>{s.label}</div>
                            <h3 className={`text-xl font-black uppercase mb-1 ${booking.service?.id === s.id ? 'text-white' : 'text-gray-400'}`}>{s.name}</h3>
                            <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-400' : 'text-gray-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                            <div className={`space-y-2 mb-4 p-4 rounded-xl ${booking.service?.id === s.id ? 'bg-black/40 border border-white/5' : 'bg-black/20'}`}>{s.steps.map((step, i) => (<p key={i} className="text-xs text-gray-300 font-medium">{step}</p>))}</div>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 italic"><Info size={10}/> {s.note}</p>
                        </div>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-40 backdrop-blur-md">
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label="Continuar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 1: PERSONALIZAÇÃO */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Personalize</h2>
                <div className="mb-10">
                    {EXTRAS.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-[#111] border-[#222]'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-600'}`}><ex.icon size={20}/></div>
                                    <div>
                                        <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{ex.label}</p>
                                        <p className="text-xs text-gray-500">{ex.sub}</p>
                                        {active && ex.warning && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {ex.warning}</p>}
                                    </div>
                                </div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>

                <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Data e Hora</p>
                <div className="flex gap-3 overflow-x-auto pb-6 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? 'bg-white text-black border-white scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                <span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in-up pb-24">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = checkAvailability(booking.date, t);
                            return (
                                <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : status === 'sold_out' ? 'opacity-50 bg-[#111] border-[#222]' : status === 'past' ? 'opacity-30 bg-[#111] border-[#222]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                                    {t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}
                                </button>
                            )
                        })}
                    </div>
                )}

                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-40 backdrop-blur-md">
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label="Avançar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 2: ENDEREÇO & FINALIZAR */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Onde será?</h2>

                <div className="flex bg-[#1C1C1E] p-1.5 rounded-2xl mb-6 border border-[#333]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: ''}})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow-md' : 'text-gray-500'}`}>{t === 'home' ? 'Casa/Apto' : t.toUpperCase()}</button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label="Cidade" placeholder="Ex: Londrina..." value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} />
                    
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in-up space-y-4">
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : (
                        <div className="animate-fade-in-up space-y-4">
                            <BigInput label="Endereço (Rua)" placeholder="Ex: Rua Piauí" value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} />
                            <div className="flex gap-3">
                                <div className="w-1/3"><BigInput label="Número" placeholder="123" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                                <div className="w-2/3"><BigInput label="Bairro" placeholder="Centro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                            </div>
                            <BigInput label="Complemento (Opcional)" placeholder="Ex: Apto 101" value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                        </div>
                    )}
                </div>

                {/* Resumo Financeiro */}
                <div className="bg-[#1C1C1E] border border-[#333] rounded-[2rem] p-6 mb-8">
                    <div className="border-b border-[#333] pb-4 mb-4 text-center">
                        <h3 className="text-xl font-black text-white">{booking.service?.name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                    </div>
                    <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm text-gray-400"><span>Valor Base</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> (
                            <div key={k} className="flex justify-between text-sm text-white"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>{Utils.fmtMoney(EXTRAS.find(e=>e.id===k).price)}</span></div>
                        ))}
                        {booking.appliedCoupon && <div className="flex justify-between text-sm text-green-400 font-bold py-2 border-t border-[#333]"><span>Cupom Aplicado</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
                        <span className="text-3xl font-black text-white">{Utils.fmtMoney(financials.final)}</span>
                    </div>
                </div>

                <div className="mb-32">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Pagamento (No Local)</p>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'esp'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? 'bg-white text-black scale-105 shadow-lg' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'esp' && <Banknote size={18}/>}
                                {p === 'esp' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-40 backdrop-blur-md">
                    <PrimaryButton disabled={!isAddressValid() || !booking.payment} onClick={finalize} label="Confirmar Agendamento" icon={MessageCircle} />
                </div>
            </>
        )}

      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
