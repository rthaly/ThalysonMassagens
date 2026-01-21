import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  Navigation, CreditCard, Banknote, Building, BedDouble, RefreshCw, 
  User, Copy, Info, CheckCircle
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144", // Chave PIX adicionada
  CITY_NAME: "Londrina - PR",
  STORAGE_KEY: 'thaly_app_master_v6',
  XP_TARGET: 300 
};

const SERVICES = [
  { 
    id: 'completa', name: 'Experiência Completa', 
    desc: 'O carro-chefe. Relaxamento muscular profundo seguido de finalização manual intensa e explosiva.', 
    time: 60, price: 175, xp: 60, popular: true 
  },
  { 
    id: 'relax', name: 'Massagem Relaxante', 
    desc: 'Foco terapêutico para alívio de dores e tensão. Sem toques nas partes íntimas.', 
    time: 60, price: 145, xp: 30, popular: false 
  }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Sessão estendida', icon: Clock, price: 50 },
  { id: 'touch', label: 'Interação', desc: 'Troca de energia', icon: Flame, price: 63 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "Profissionalismo raro. O Thalyson é pontual e educado.", a: "Roberto", s: 5 },
  { t: "A massagem completa salvou minha semana.", a: "André", s: 5 },
  { t: "Discreto e higiênico. Me senti seguro.", a: "M. Viajante", s: 5 },
  { t: "Mão firme e técnica excelente.", a: "Carlos", s: 5 },
  { t: "A melhor de Londrina, sem dúvidas.", a: "Gustavo", s: 5 }
];

const FAQS = [
    { q: "Onde é o atendimento?", a: "Vou até você: Residência, Hotel ou Motel." },
    { q: "O Uber está incluso?", a: "Não. A taxa de deslocamento é calculada a parte." },
    { q: "Aceita Cartão?", a: "Sim, levo a maquininha." }
];

// ==================================================================================
// 2. COMPONENTES VISUAIS (ATOMIC & UTILS)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(15); },
    copyPix: () => {
        navigator.clipboard.writeText(CONFIG.PIX_KEY);
        return true;
    }
};

// Toast Notification (Substitui Alert)
const Toast = ({ msg, show }) => (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="bg-[#222] border border-green-500/30 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-sm font-bold">{msg}</span>
        </div>
    </div>
);

// Input Gigante
const BigInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="mb-5">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2 block tracking-wider">{label}</label>
    <div className="relative group">
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-14 bg-[#111] border border-[#333] rounded-xl px-4 pl-12 text-white text-lg placeholder:text-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
        />
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-green-500 transition-colors" size={20} />}
    </div>
  </div>
);

// Botão Primário
const PrimaryButton = ({ onClick, disabled, children, icon: Icon, pulse, variant = 'primary' }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`w-full h-16 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-3 transition-all active:scale-[0.97]
            ${variant === 'primary' 
                ? (disabled ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]') 
                : 'bg-[#1C1C1E] border border-[#333] text-white hover:bg-[#222]'}
            ${pulse ? 'animate-pulse' : ''}
        `}
    >
        {children}
        {Icon && <Icon size={20} strokeWidth={2.5} />}
    </button>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [successMode, setSuccessMode] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Data Persistence
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Booking Session
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: { upgrade: false, touch: false, aroma: false },
      date: null,
      time: null,
      locationType: 'home',
      address: { street: '', number: '', district: '', comp: '', motelName: '', suite: '' },
      payment: null, // Bug fix: Inicia nulo
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // --- ACTIONS & HELPERS ---

  const triggerToast = (msg) => {
      setToast({ show: true, msg });
      setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const handleNext = () => { 
    Utils.vibrate();
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setStep(s => s + 1); 
  };
  
  const handleBack = () => { setStep(s => s - 1); };

  const handleReset = () => {
      setSuccessMode(false);
      setBooking(initialBooking);
      setStep(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      
      // Bloqueio Real de Horário Passado
      if (sel.toDateString() === now.toDateString()) {
          if (h <= now.getHours()) return true;
      }
      
      // Simulação de Agenda Cheia (Mock Inteligente)
      const seed = sel.getDate() + h;
      if (seed % 7 === 0) return 'sold_out';
      
      return false;
  };

  const calculateTotal = () => {
      let sub = booking.service?.price || 0;
      if (booking.extras.upgrade) sub += 50;
      if (booking.extras.touch) sub += 63;
      if (booking.extras.aroma) sub += 10;
      const disc = booking.appliedCoupon?.val || 0;
      return { sub, disc, final: Math.max(0, sub - disc) };
  };

  const finalize = () => {
      // 1. Queimar Cupom
      let newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      
      // 2. XP & Level Up
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 3. Gerar Link
      const total = calculateTotal();
      let locStr = "";
      if (booking.locationType === 'motel') {
          locStr = `🏩 MOTEL: ${booking.address.motelName} (Suíte ${booking.address.suite})`;
      } else {
          const t = booking.locationType === 'hotel' ? '🏨 HOTEL' : '🏠 CASA';
          locStr = `${t}: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
          if(booking.address.comp) locStr += ` (${booking.address.comp})`;
      }

      const text = `
*AGENDAMENTO - THALYSON* 🌿
-------------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* Confirmado (+18)

📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
💆 *Serviço:* ${booking.service?.name}

✨ *Adicionais:*
${Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=> `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}

📍 *Local:* ${locStr}

💰 *FINANCEIRO*
Serviço: ${Utils.fmtMoney(total.sub)}
${booking.appliedCoupon ? `🎟️ Cupom: -${Utils.fmtMoney(total.disc)}` : ''}
*TOTAL: ${Utils.fmtMoney(total.final)}*

🚗 *Uber:* A calcular.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccessMode(true);
  };

  const totalData = calculateTotal();

  // --- RENDER ---

  if (successMode) {
      return (
          <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                  <Check size={48} className="text-black" strokeWidth={4} />
              </div>
              <h2 className="text-3xl font-black text-white mb-2">AGENDADO!</h2>
              <p className="text-gray-400 mb-8 max-w-xs leading-relaxed">
                  Enviei os detalhes para seu WhatsApp. Aguarde minha resposta para confirmarmos o valor do Uber.
              </p>
              
              <div className="w-full max-w-sm bg-[#111] rounded-2xl border border-[#222] p-6 mb-8 relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
                   <h3 className="text-lg font-bold text-white mb-1">{booking.service?.name}</h3>
                   <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-sm">
                        <CalIcon size={14}/>
                        {new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}
                   </div>
              </div>

              <PrimaryButton onClick={handleReset} icon={RefreshCw} variant="secondary">Voltar ao Início</PrimaryButton>
          </div>
      )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-40 selection:bg-green-500 selection:text-black">
      
      <Toast msg={toast.msg} show={toast.show} />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-xl border-b border-white/5 transition-all">
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-4">
                 {step > 0 && (
                    <button onClick={handleBack} className="p-2 -ml-3 text-gray-400 active:text-white transition-colors">
                        <ChevronLeft size={28}/>
                    </button>
                 )}
                 <div>
                     <h1 className="text-sm font-black tracking-widest uppercase text-white">Thalymassagens</h1>
                     <p className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-0.5">
                        <MapPin size={10}/> {CONFIG.CITY_NAME}
                     </p>
                 </div>
             </div>
             <button onClick={() => setMenuOpen(true)} className="p-3 bg-[#111] rounded-full border border-[#222] active:scale-95 transition-transform">
                <Menu size={20}/>
             </button>
         </div>
         <div className="h-[2px] w-full bg-[#111]">
            <div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${(step/5)*100}%`}}></div>
         </div>
      </header>

      {/* MENU DRAWER */}
      {menuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
              <div className="relative w-72 h-full bg-[#111] border-l border-[#222] p-6 shadow-2xl flex flex-col animate-slide-in">
                  <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-xl">Menu</span>
                      <button onClick={()=>setMenuOpen(false)} className="p-2 bg-[#222] rounded-full"><X size={20} className="text-gray-400"/></button>
                  </div>
                  
                  <div className="bg-[#1C1C1E] p-4 rounded-2xl mb-4 border border-[#333]">
                      <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wider text-gray-400">
                          <span>Nível Fidelidade</span>
                          <span className="text-green-500 text-sm">{Math.floor(user.xp/300)+1}</span>
                      </div>
                      <div className="h-2 bg-[#333] rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-green-500 transition-all duration-1000" style={{width:`${(user.xp%300)/300*100}%`}}></div>
                      </div>
                      <p className="text-[10px] text-gray-500">Ganhe {300 - (user.xp%300)} XP para o próximo prêmio.</p>
                  </div>

                  <button className="w-full py-4 bg-[#1C1C1E] rounded-xl font-bold text-sm mb-3 flex items-center gap-3 px-4 hover:bg-[#222]" onClick={() => { setHelpOpen(true); setMenuOpen(false); }}>
                    <HelpCircle size={18} className="text-gray-400"/> Dúvidas
                  </button>
                  
                  <button className="w-full py-4 bg-[#1C1C1E] rounded-xl font-bold text-sm mb-3 flex items-center gap-3 px-4 hover:bg-[#222]" onClick={() => {if(navigator.share) navigator.share({url: window.location.href});}}>
                    <Share2 size={18} className="text-gray-400"/> Compartilhar
                  </button>
              </div>
          </div>
      )}

      {/* AJUDA MODAL */}
      {helpOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 animate-fade-in">
                  <h3 className="font-bold text-xl mb-4">Dúvidas</h3>
                  <div className="space-y-3">
                      {FAQS.map((f, i) => (
                          <div key={i} className="bg-[#111] p-4 rounded-xl border border-[#222]">
                              <p className="text-green-500 font-bold text-xs mb-1">{f.q}</p>
                              <p className="text-gray-300 text-sm">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-4 py-3 bg-[#333] rounded-xl font-bold text-sm">Fechar</button>
              </div>
          </div>
      )}

      {/* WALLET MODAL */}
      {walletOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={()=>setWalletOpen(false)}></div>
              <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 animate-fade-in shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Wallet className="text-green-500"/> Carteira</h3>
                      <button onClick={()=>setWalletOpen(false)} className="p-2 bg-[#111] rounded-full"><X size={20}/></button>
                  </div>
                  {user.coupons.length === 0 ? (
                      <p className="text-center text-gray-500 py-6">Nenhum cupom disponível.</p>
                  ) : (
                      <div className="space-y-3">
                          {user.coupons.map(c => (
                              <button key={c.id} onClick={() => { setBooking({...booking, appliedCoupon: c}); setWalletOpen(false); triggerToast('Cupom Aplicado!'); }} 
                                  className="w-full p-4 bg-black border border-green-900/50 rounded-xl flex justify-between items-center hover:border-green-500 transition-colors group">
                                  <div className="text-left">
                                      <span className="block font-black text-green-500">{c.label}</span>
                                      <span className="text-xs text-gray-500">Valor: R$ {c.val},00</span>
                                  </div>
                                  <span className="text-[10px] bg-green-900/20 text-green-400 px-3 py-1 rounded font-bold group-hover:bg-green-500 group-hover:text-black transition-colors">USAR</span>
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* MAIN CONTENT */}
      <main className="pt-24 px-6 max-w-md mx-auto">

        {/* STEP 0: HOME */}
        {step === 0 && (
            <div className="animate-fade-in space-y-8">
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className="p-5 rounded-3xl bg-gradient-to-r from-[#1C1C1E] to-[#111] border border-green-500/20 flex items-center gap-4 cursor-pointer hover:border-green-500/50 transition-colors shadow-lg">
                        <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-black animate-pulse"><Gift size={24}/></div>
                        <div><p className="font-black text-green-400 text-sm uppercase">Presente Disponível</p><p className="text-xs text-gray-400">Toque para resgatar seu cupom.</p></div>
                    </div>
                )}

                <div>
                    <h2 className="text-4xl font-black mb-2 tracking-tight">Bem-vindo.</h2>
                    <p className="text-gray-400 text-base">Experiências exclusivas e profissionais.</p>
                </div>

                <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />

                <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-6 rounded-3xl border flex gap-4 cursor-pointer transition-all items-center duration-300 ${booking.healthChecked ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#0A0A0A] border-[#222]'}`}>
                    <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-colors ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                    <div><p className="font-bold text-sm text-white mb-1">Confirmação Obrigatória</p><p className="text-xs text-gray-500 leading-tight">Declaro ser maior de 18 anos e estar saudável.</p></div>
                </div>

                <div className="bg-[#111] rounded-3xl border border-[#222] p-5">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                         {REVIEWS_DB.map((r, i) => (
                             <div key={i} className="min-w-[240px] bg-[#1C1C1E] p-4 rounded-2xl border border-[#2A2A2A]">
                                 <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                                 <p className="text-gray-300 text-xs italic mb-2">"{r.t}"</p>
                                 <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1 uppercase"><Shield size={10} className="text-green-500"/> {r.a}</p>
                             </div>
                         ))}
                    </div>
                </div>

                <div className="pb-8"><PrimaryButton disabled={!booking.healthChecked || user.name.length < 3} onClick={handleNext} icon={ArrowRight}>Começar</PrimaryButton></div>
            </div>
        )}

        {/* STEP 1: SERVICES */}
        {step === 1 && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Escolha a Experiência</h2>
                <div className="space-y-5">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => { setBooking({...booking, service: s}); handleNext(); }} className={`relative p-6 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.service?.id === s.id ? 'bg-[#1C1C1E] border-green-500 shadow-lg' : 'bg-[#111] border-[#222]'}`}>
                            {s.popular && <span className="absolute top-5 right-5 bg-white text-black text-[10px] font-black px-2 py-1 rounded shadow-lg">MAIS PEDIDO</span>}
                            <h3 className={`text-xl font-bold mb-2 ${booking.service?.id === s.id ? 'text-white' : 'text-gray-200'}`}>{s.name}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[90%] border-l-2 border-[#333] pl-3">{s.desc}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-[#333]/50">
                                <span className="text-lg font-bold text-white bg-[#222] px-3 py-1 rounded-lg">R$ {s.price}</span>
                                <span className="text-[10px] font-bold text-green-500 bg-green-900/10 px-2 py-1 rounded flex items-center gap-1"><Zap size={12}/> Ganhe {s.xp} XP</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* STEP 2: DATE */}
        {step === 2 && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Data e Hora</h2>
                <div className="flex gap-3 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[80px] h-[90px] rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 flex-shrink-0 ${isSel ? 'bg-white text-black border-white scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                <span className="text-[10px] font-black uppercase tracking-wider mb-1 opacity-80">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-3xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`mt-4 transition-opacity duration-500 ${!booking.date ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <h3 className="text-[10px] font-bold text-gray-500 uppercase mb-4 ml-1 tracking-widest">Horários</h3>
                    <div className="grid grid-cols-4 gap-3">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return (
                                <button key={t} disabled={!!status} onClick={() => setBooking({...booking, time: t})} className={`py-4 rounded-2xl text-xs font-bold border relative transition-all duration-200 ${booking.time === t ? 'bg-white text-black border-white shadow-lg' : status ? 'bg-[#050505] border-[#222] opacity-30 cursor-not-allowed' : 'bg-[#1C1C1E] border-[#333]'}`}>
                                    {t}
                                    {status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-2xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className="mt-10"><PrimaryButton disabled={!booking.time} onClick={handleNext}>Confirmar Horário</PrimaryButton></div>
            </div>
        )}

        {/* STEP 3: EXTRAS */}
        {step === 3 && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Turbine sua Sessão</h2>
                <div className="space-y-4">
                    {EXTRAS.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`p-6 rounded-3xl border flex items-center justify-between cursor-pointer transition-all duration-200 active:scale-[0.98] ${active ? 'bg-[#1C1C1E] border-green-500 shadow-md' : 'bg-[#0A0A0A] border-[#222]'}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${active ? 'bg-green-500 border-green-500 text-black' : 'border-[#333] bg-[#111] text-gray-600'}`}>{active ? <Check size={24}/> : <ex.icon size={22}/>}</div>
                                    <div><p className={`font-bold text-base mb-0.5 ${active ? 'text-white' : 'text-gray-300'}`}>{ex.label}</p><p className="text-xs text-gray-500">{ex.desc}</p></div>
                                </div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-10"><PrimaryButton onClick={handleNext}>Continuar</PrimaryButton></div>
            </div>
        )}

        {/* STEP 4: LOCALIZAÇÃO */}
        {step === 4 && (
            <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Localização</h2>
                <div className="flex bg-[#161616] p-1.5 rounded-2xl mb-8 border border-[#222]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {street:'', number:'', district:'', comp:'', motelName:'', suite:''}})} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all duration-300 ${booking.locationType === t ? 'bg-[#333] text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}>
                            {t === 'home' ? 'Residência' : t.toUpperCase()}
                        </button>
                    ))}
                </div>
                <div className="space-y-6">
                    {booking.locationType === 'motel' ? (
                        <>
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </>
                    ) : (
                        <>
                            <BigInput label={booking.locationType === 'hotel' ? 'Nome do Hotel' : 'Rua / Avenida'} placeholder={booking.locationType === 'hotel' ? 'Ex: Hotel Bourbon' : 'Ex: Rua Piauí'} value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={MapPin} />
                            <div className="flex gap-4">
                                <div className="w-1/3"><BigInput label={booking.locationType === 'hotel' ? 'Quarto' : 'Número'} placeholder="123" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                                <div className="w-2/3"><BigInput label="Bairro" placeholder="Ex: Centro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                            </div>
                            <BigInput label="Complemento (Opcional)" placeholder="Ex: Bloco A" value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                        </>
                    )}
                </div>
                <div className="mt-8 p-6 bg-[#181510] border border-yellow-900/30 rounded-3xl flex gap-4 items-start">
                    <AlertTriangle size={24} className="text-yellow-500 flex-shrink-0 mt-1"/>
                    <p className="text-sm text-yellow-100/70 leading-relaxed"><strong className="text-yellow-500 block mb-1">Taxa de Deslocamento (Uber)</strong>Este valor <strong>não está incluso</strong> no total abaixo. Combinaremos o valor exato da ida e volta pelo WhatsApp.</p>
                </div>
                <div className="mt-10">
                    <PrimaryButton disabled={booking.locationType === 'motel' ? (!booking.address.motelName || !booking.address.suite) : (!booking.address.street || !booking.address.number || !booking.address.district)} onClick={handleNext}>Revisar Pedido</PrimaryButton>
                </div>
            </div>
        )}

        {/* STEP 5: REVISÃO & PAGAMENTO (BUG CORRIGIDO) */}
        {step === 5 && (
            <div className="animate-fade-in pb-10">
                <h2 className="text-2xl font-bold mb-8 tracking-tight">Revisão Final</h2>
                
                {/* TICKET VISUAL */}
                <div className="relative bg-[#1C1C1E] border border-[#333] rounded-[32px] p-8 mb-8 shadow-2xl overflow-hidden">
                    <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-8 h-8 bg-[#050505] rounded-full"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-8 h-8 bg-[#050505] rounded-full"></div>
                    
                    <div className="border-b-2 border-dashed border-[#2A2A2A] pb-8 mb-8 text-center">
                        <h3 className="text-2xl font-black text-white mb-2">{booking.service?.name}</h3>
                        <p className="text-gray-500 text-sm font-medium bg-[#111] inline-block px-4 py-1 rounded-full">{new Date(booking.date).toLocaleDateString('pt-BR')} • {booking.time}</p>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-sm text-gray-300"><span>Valor Base</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.entries(booking.extras).filter(([_,v])=>v).map(([k]) => (
                            <div key={k} className="flex justify-between text-sm text-green-500 font-medium"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>{Utils.fmtMoney(EXTRAS.find(e=>e.id===k).price)}</span></div>
                        ))}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-400 font-bold bg-green-900/10 p-3 rounded-lg border border-green-900/30 mt-4"><span>Cupom ({booking.appliedCoupon.label})</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div>
                        ) : (
                            <button onClick={() => setWalletOpen(true)} className="w-full py-3 border-2 border-dashed border-[#333] rounded-xl text-xs font-bold text-gray-500 hover:text-green-500 hover:border-green-500 transition-colors flex items-center justify-center gap-2 mt-4 uppercase tracking-widest"><Ticket size={16}/> Adicionar Cupom</button>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-6 border-t border-[#333]">
                        <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Total a Pagar</span>
                        <span className="text-3xl font-black text-white">{Utils.fmtMoney(totalData.final)}</span>
                    </div>
                </div>

                {/* PAGAMENTO (LAYOUT NOVO) */}
                <div className="mb-32">
                    <div className="flex justify-between items-center mb-4">
                         <p className="text-[11px] font-bold text-gray-400 uppercase ml-1 tracking-wider">Forma de Pagamento (No Local)</p>
                         <button onClick={() => { Utils.copyPix(); triggerToast("Chave PIX Copiada!"); }} className="text-[10px] text-green-500 font-bold flex items-center gap-1 hover:text-green-400"><Copy size={12}/> COPIAR CHAVE PIX</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'dinheiro', 'cartao'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-wider transition-all duration-300 flex flex-col items-center gap-2 ${booking.payment === p ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-500 hover:bg-[#222]'}`}>
                                {p === 'pix' && <Zap size={18}/>}
                                {p === 'dinheiro' && <Banknote size={18}/>}
                                {p === 'cartao' && <CreditCard size={18}/>}
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* FIX FOOTER COM Z-INDEX ALTO E PADDING CORRETO */}
                <div className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-6 z-[60] pb-safe">
                    <PrimaryButton onClick={finalize} pulse icon={MessageCircle} disabled={!booking.payment}>Confirmar Agendamento</PrimaryButton>
                </div>
            </div>
        )}

      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 24px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-in { animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}
