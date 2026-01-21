import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, CheckCircle, 
  Info, Navigation, Lock, Smile
} from 'lucide-react';

// ==================================================================================
// 1. DADOS DE NEGÓCIO & PREÇOS EXATOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_ultimate_v7',
  XP_TARGET: 300 
};

// SERVIÇOS CONFIGURADOS COM A DESCRIÇÃO EXATA PEDIDA
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

// EXTRAS COM PREÇOS CORRIGIDOS
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
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
  { t: "Respeitou meu tempo e meus limites. Recomendo.", a: "André", s: 5 }
];

const FAQS = [
    { q: "Onde você atende?", a: "Vou até você: Sua Casa, Apartamento, Hotel ou Motel." },
    { q: "O Uber é incluso?", a: "Não. Calculamos a ida e volta na hora pelo WhatsApp." },
    { q: "Aceita Cartão?", a: "Sim, levo a maquininha (Débito/Crédito)." }
];

// ==================================================================================
// 2. DESIGN SYSTEM (COMPONENTES PREMIUM)
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

// Card de Serviço Avançado
const ServiceCard = ({ service, active, onClick }) => (
    <div onClick={onClick} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer mb-5 group ${active ? 'bg-[#18181b] border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)] scale-[1.02]' : 'bg-[#111] border-[#222] hover:border-[#333]'}`}>
        {/* Badge */}
        <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'}`}>
            {service.label}
        </div>

        <div className="mb-4">
            <h3 className={`text-xl font-black uppercase mb-1 ${active ? 'text-white' : 'text-gray-400'}`}>{service.name}</h3>
            <div className="flex items-center gap-2">
                 <span className={`text-lg font-bold ${active ? 'text-green-400' : 'text-gray-500'}`}>{Utils.fmtMoney(service.price)}</span>
                 <span className="text-[10px] bg-[#222] text-gray-400 px-2 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> {service.time}min</span>
            </div>
        </div>

        {/* Progressão (O Pedido do Usuário) */}
        <div className={`space-y-2 mb-4 p-4 rounded-xl ${active ? 'bg-black/40 border border-white/5' : 'bg-black/20'}`}>
            {service.steps.map((step, i) => (
                <p key={i} className="text-xs text-gray-300 leading-relaxed font-medium">{step}</p>
            ))}
        </div>

        <p className="text-[10px] text-gray-500 flex items-center gap-1 italic"><Info size={10}/> {service.note}</p>
        
        {/* Selecionador Visual */}
        <div className={`absolute bottom-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'bg-green-500 border-green-500' : 'border-[#333]'}`}>
            {active && <Check size={14} className="text-black" strokeWidth={4}/>}
        </div>
    </div>
);

// Toggle de Extra com Aviso
const ExtraToggle = ({ active, onClick, extra }) => (
    <div onClick={onClick} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-[#111] border-[#222]'}`}>
        <div className="flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-600'}`}>
                <extra.icon size={20}/>
            </div>
            <div>
                <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-400'}`}>{extra.label}</p>
                <p className="text-xs text-gray-500">{extra.sub}</p>
                {/* Aviso Condicional */}
                {active && extra.warning && (
                    <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1 animate-pulse"><AlertTriangle size={10}/> {extra.warning}</p>
                )}
            </div>
        </div>
        <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {extra.price}</span>
    </div>
);

// Input Grande e Moderno
const BigInput = ({ label, value, onChange, placeholder, icon: Icon }) => (
  <div className="mb-5 group">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2 block tracking-wider group-focus-within:text-green-500 transition-colors">{label}</label>
    <div className="relative">
        <input 
            value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-14 bg-[#111] border border-[#333] rounded-xl px-4 pl-12 text-white text-base placeholder:text-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500/20 outline-none transition-all"
        />
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={20} />}
    </div>
  </div>
);

// Botão Sticky Principal
const PrimaryButton = ({ onClick, disabled, label, icon: Icon, loading }) => (
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
  // Estado Global
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Persistência de Usuário e Cupons
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          // Começa com cupom de 15 reais (Boas vindas)
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Estado do Agendamento (Sessão)
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, // { touch: true, aroma: false }
      date: null,
      time: null,
      locationType: 'home',
      address: { city: '', details: '', motelName: '', suite: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // --- ACTIONS ---

  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  
  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };
  const handleReset = () => { setSuccess(false); setBooking(initialBooking); setStep(0); };

  const isTimeBlocked = (d, t) => {
      if(!d) return true;
      const now = new Date();
      const sel = new Date(d);
      const [h] = t.split(':').map(Number);
      if(sel.toDateString() === now.toDateString() && h <= now.getHours()) return true;
      if((sel.getDate() + h) % 7 === 0) return 'sold_out';
      return false;
  };

  const calculateTotal = () => {
      let total = booking.service?.price || 0;
      Object.keys(booking.extras).forEach(k => {
          if(booking.extras[k]) total += EXTRAS.find(e => e.id === k).price;
      });
      const disc = booking.appliedCoupon?.val || 0;
      return { total, disc, final: Math.max(0, total - disc) };
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

      // 3. Texto Zap
      const calc = calculateTotal();
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n');
      
      let locStr = "";
      if(booking.locationType === 'motel') locStr = `🏩 MOTEL: ${booking.address.motelName} (Suíte ${booking.address.suite})`;
      else locStr = `${booking.locationType === 'hotel' ? '🏨 HOTEL' : '🏠 RESIDÊNCIA'}: ${booking.address.details}`;

      const text = `
*AGENDAMENTO VIP* 🌿
---------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* +18 Confirmado

💆 *Serviço:* ${booking.service?.name}
📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

✨ *Adicionais:*
${extrasTxt || 'Nenhum'}

📍 *Local:* ${booking.address.city}
${locStr}

💰 *Financeiro:*
Subtotal: ${Utils.fmtMoney(calc.total)}
${booking.appliedCoupon ? `🎟️ Cupom: -${Utils.fmtMoney(calc.disc)}` : ''}
*TOTAL A PAGAR: ${Utils.fmtMoney(calc.final)}*

🚗 *Uber:* Não incluso. Calcular ida/volta.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  const financials = calculateTotal();

  // --- RENDER ---

  if (success) {
      return (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in-up text-white">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                  <Check size={48} className="text-black" strokeWidth={4}/>
              </div>
              <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Solicitação Enviada!</h2>
              <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">Enviei os detalhes para seu WhatsApp. Aguarde minha confirmação do Uber.</p>
              
              <div className="w-full bg-[#111] rounded-2xl border border-[#222] p-6 mb-8 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
                   <h3 className="text-lg font-bold text-white mb-1">{booking.service?.name}</h3>
                   <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm">
                        <CalIcon size={14}/>
                        {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                   </div>
              </div>
              <button onClick={handleReset} className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase hover:text-white transition-colors"><RefreshCw size={12}/> Fazer novo agendamento</button>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32 selection:bg-green-500 selection:text-black">
      <Toast show={toast.show} msg={toast.msg} />

      {/* HEADER STICKY */}
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
         {/* Barra de Progresso */}
         <div className="h-[2px] w-full bg-[#111]"><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MENU LATERAL */}
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

      {/* CARTEIRA */}
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

                <div className="mb-8">
                    <h2 className="text-3xl font-black mb-2 tracking-tight">Bem-vindo.</h2>
                    <p className="text-gray-400 text-sm">Identifique-se para começar.</p>
                </div>

                <div className="space-y-4 mb-10">
                    <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className="text-xs text-gray-400">Tenho +18 anos e estou saudável.</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><SparklesIcon/> Escolha a Experiência</h3>
                
                <div className="space-y-6 pb-20">
                    {SERVICES.map(s => (
                        <ServiceCard 
                            key={s.id} 
                            service={s} 
                            active={booking.service?.id === s.id} 
                            onClick={() => { setBooking({...booking, service: s}); }}
                        />
                    ))}
                </div>

                {/* Footer Fixo */}
                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-40 backdrop-blur-md">
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label="Continuar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 1: PERSONALIZAÇÃO */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Personalize</h2>

                {/* Extras */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Adicionais (Opcional)</p>
                <div className="mb-10">
                    {EXTRAS.map(ex => (
                        <ExtraToggle 
                            key={ex.id} extra={ex} active={booking.extras[ex.id]} 
                            onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !booking.extras[ex.id]}})}
                        />
                    ))}
                </div>

                {/* Data e Hora */}
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
                            const blocked = isTimeBlocked(booking.date, t);
                            return (
                                <button key={t} disabled={blocked} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : blocked ? 'opacity-30 bg-[#111] border-[#222]' : 'bg-[#1C1C1E] border-[#333]'}`}>
                                    {t}{blocked === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}
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

        {/* STEP 2: CHECKOUT */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Finalizar</h2>

                <div className="flex bg-[#1C1C1E] p-1.5 rounded-2xl mb-6 border border-[#333]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {city: booking.address.city, details: '', motelName: '', suite: ''}})} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow-md' : 'text-gray-500'}`}>{t === 'home' ? 'Casa' : t.toUpperCase()}</button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label="Cidade Atual" placeholder="Ex: Londrina, SP..." value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} />
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in-up">
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : (
                        <BigInput label="Endereço Completo" placeholder="Rua, Número, Bairro..." value={booking.address.details} onChange={e => setBooking({...booking, address: {...booking.address, details: e.target.value}})} icon={Navigation} />
                    )}
                </div>

                <div className="bg-[#1C1C1E] border border-[#333] rounded-[2rem] p-6 mb-8 overflow-hidden relative">
                    {/* Ticket Header */}
                    <div className="border-b-2 border-dashed border-[#333] pb-6 mb-6 text-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Resumo do Pedido</p>
                        <h3 className="text-xl font-black text-white">{booking.service?.name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                    </div>
                    {/* Financials */}
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-400"><span>Valor Base</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> (
                            <div key={k} className="flex justify-between text-sm text-white"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>{Utils.fmtMoney(EXTRAS.find(e=>e.id===k).price)}</span></div>
                        ))}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-400 font-bold py-2 border-t border-[#333]"><span>Cupom Aplicado</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>
                        ) : (
                            <button onClick={() => setShowWallet(true)} className="w-full py-3 border border-dashed border-[#444] rounded-xl text-xs text-gray-500 flex items-center justify-center gap-2 mt-2 hover:border-green-500 hover:text-green-500 transition-colors"><Ticket size={14}/> Aplicar Cupom</button>
                        )}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
                        <span className="text-3xl font-black text-white">{Utils.fmtMoney(financials.final)}</span>
                    </div>
                </div>

                {/* Pagamento */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Pagamento (No Local)</p>
                <div className="grid grid-cols-3 gap-3 mb-32">
                    {['pix', 'card', 'esp'].map(p => (
                        <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? 'bg-white text-black scale-105 shadow-lg' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                            {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'esp' && <Banknote size={18}/>}
                            {p === 'esp' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                        </button>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 w-full p-6 bg-black/95 border-t border-white/10 z-40 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-4 px-1">
                         <span className="text-xs text-gray-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> Uber não incluso</span>
                         <button onClick={() => {Utils.copyPix(); showToast("CHAVE PIX COPIADA!")}} className="text-[10px] font-bold text-green-500 flex items-center gap-1"><Copy size={10}/> PIX COPY</button>
                    </div>
                    <PrimaryButton disabled={!booking.address.city || !booking.payment} onClick={finalize} label="Agendar no WhatsApp" icon={MessageCircle} />
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

// Icone extra
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 5H1"/></svg>;
