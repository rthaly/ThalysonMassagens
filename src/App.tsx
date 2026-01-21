import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  Navigation, CreditCard, Banknote, Building, BedDouble
} from 'lucide-react';

// ==================================================================================
// 1. DADOS & CONFIGURAÇÃO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  CITY_NAME: "Londrina - PR",
  STORAGE_KEY: 'thaly_app_pro_v4',
  XP_TARGET: 300 
};

const SERVICES = [
  { 
    id: 'completa', name: 'Experiência Completa', 
    desc: 'O serviço mais pedido. Relaxamento muscular profundo + finalização manual intensa.', 
    time: 60, price: 180, xp: 50, popular: true 
  },
  { 
    id: 'relax', name: 'Massagem Relaxante', 
    desc: 'Foco terapêutico para tirar dores e cansaço. Apenas relaxamento físico.', 
    time: 60, price: 150, xp: 30, popular: false 
  },
  { 
    id: 'tantra', name: 'Tântrica Sensitive', 
    desc: 'Uma experiência sensorial. Toques sutis, conexão e bioeletricidade.', 
    time: 90, price: 250, xp: 80, popular: false 
  }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Mais tempo de sessão', icon: Clock, price: 50 },
  { id: 'touch', label: 'Interação', desc: 'Troca de energia', icon: Flame, price: 60 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais', icon: Wind, price: 20 }
];

const REVIEWS = [
  { t: "Profissionalismo raro. O Thalyson é pontual e muito educado.", a: "Roberto (Advogado)", s: 5 },
  { t: "A massagem completa salvou minha semana. Recomendo.", a: "André L.", s: 5 },
  { t: "Discreto e higiênico. Me senti seguro no hotel.", a: "M. Viajante", s: 5 },
  { t: "Mão firme e técnica excelente.", a: "Carlos", s: 5 },
];

// ==================================================================================
// 2. COMPONENTES DE UI (ATOMIC DESIGN)
// ==================================================================================

// Input Gigante (Fácil de tocar)
const BigInput = ({ label, value, onChange, placeholder, type = "text", icon: Icon }) => (
  <div className="mb-4">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-1 block">{label}</label>
    <div className="relative">
        <input 
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full h-14 bg-[#1C1C1E] border border-[#333] rounded-xl px-4 pl-12 text-white text-lg placeholder:text-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-all"
        />
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />}
    </div>
  </div>
);

// Botão Principal
const PrimaryButton = ({ onClick, disabled, children, icon: Icon, pulse }) => (
    <button 
        onClick={onClick} 
        disabled={disabled}
        className={`w-full h-16 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98]
            ${disabled ? 'bg-[#222] text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100 shadow-lg'}
            ${pulse ? 'animate-pulse shadow-green-500/30' : ''}
        `}
    >
        {children}
        {Icon && <Icon size={20} />}
    </button>
);

// Card de Seleção
const SelectCard = ({ active, onClick, title, subtitle, price, badge }) => (
    <div onClick={onClick} 
        className={`relative p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] mb-3
        ${active ? 'bg-[#1C1C1E] border-green-500 shadow-lg shadow-green-900/10' : 'bg-[#111] border-[#222]'}
    `}>
        {badge && <span className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded">{badge}</span>}
        <div className="flex justify-between items-center mb-1">
            <h3 className={`text-lg font-bold ${active ? 'text-white' : 'text-gray-300'}`}>{title}</h3>
            {price && <span className="text-sm font-bold text-white bg-[#2A2A2A] px-2 py-1 rounded">{price}</span>}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed max-w-[90%]">{subtitle}</p>
    </div>
);

// ==================================================================================
// 3. LOGIC & APP
// ==================================================================================

export default function App() {
  // --- STATE ---
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);

  // User Data (Persistente)
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Booking Data (Sessão)
  const [booking, setBooking] = useState({
      healthChecked: false,
      service: null,
      extras: { upgrade: false, touch: false, aroma: false },
      date: null,
      time: null,
      locationType: 'home', // home, hotel, motel
      address: { street: '', number: '', district: '', comp: '', motelName: '', suite: '' },
      payment: 'pix',
      appliedCoupon: null
  });

  // --- ACTIONS ---

  const handleNext = () => { 
    if (navigator.vibrate) navigator.vibrate(10);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
    setStep(s => s + 1); 
  };
  
  const handleBack = () => { setStep(s => s - 1); };

  // Verifica disponibilidade de horário (Lógica simples para UX)
  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      
      // Bloqueia passado
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return true;
      
      // Simula aleatoriamente alguns "Esgotados" para prova social
      if ((sel.getDate() + h) % 7 === 0) return 'sold_out';
      
      return false;
  };

  // Finalização
  const finalize = () => {
      // 1. Lógica Cupom e XP
      let newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      const newXP = user.xp + (booking.service?.xp || 0);
      
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 2. Montar Endereço
      let addressStr = "";
      if (booking.locationType === 'motel') {
          addressStr = `🏩 MOTEL: ${booking.address.motelName}\n🚪 SUÍTE: ${booking.address.suite}`;
      } else {
          const type = booking.locationType === 'hotel' ? '🏨 HOTEL' : '🏠 RESIDÊNCIA';
          addressStr = `${type}\n📍 ${booking.address.street}, ${booking.address.number}\n🏘️ Bairro: ${booking.address.district}`;
          if (booking.address.comp) addressStr += `\n📝 Compl: ${booking.address.comp}`;
      }
      addressStr += `\n🗺️ Cidade: ${CONFIG.CITY_NAME}`;

      // 3. Montar Texto Zap
      const total = calculateTotal();
      const text = `
*AGENDAMENTO - THALYSON* 🌿
-------------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* +18 Confirmado

📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
💆 *Serviço:* ${booking.service?.name}

✨ *Adicionais:*
${Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=> `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}

-------------------------------
${addressStr}
-------------------------------

💰 *FINANCEIRO*
Serviço: ${total.sub.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}
${booking.appliedCoupon ? `🎟️ Cupom: -${total.disc.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}` : ''}
*TOTAL A PAGAR: ${total.final.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}*

🚗 *Deslocamento (Uber):* A calcular/combinar.

💳 *Pagamento:* ${booking.payment.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const calculateTotal = () => {
      let sub = booking.service?.price || 0;
      if (booking.extras.upgrade) sub += 50;
      if (booking.extras.touch) sub += 60;
      if (booking.extras.aroma) sub += 20;
      const disc = booking.appliedCoupon?.val || 0;
      return { sub, disc, final: Math.max(0, sub - disc) };
  };

  const totalData = calculateTotal();

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-32">
      
      {/* HEADER LIMPO */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 active:scale-90 transition-transform"><ChevronLeft/></button>}
                 <div>
                     <h1 className="text-sm font-black tracking-widest uppercase">Thalymassagens</h1>
                     <p className="text-[10px] text-green-500 font-bold flex items-center gap-1"><MapPin size={10}/> {CONFIG.CITY_NAME}</p>
                 </div>
             </div>
             <button onClick={() => setMenuOpen(true)} className="p-2 bg-[#222] rounded-full border border-[#333]"><Menu size={18}/></button>
         </div>
         {/* Barra de Progresso Sutil */}
         <div className="h-[2px] w-full bg-[#111]"><div className="h-full bg-green-500 transition-all duration-500" style={{width: `${(step/5)*100}%`}}></div></div>
      </header>

      {/* MENU LATERAL */}
      {menuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
              <div className="relative w-72 h-full bg-[#161616] border-l border-[#222] p-6 shadow-2xl flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-lg">Menu</span>
                      <button onClick={()=>setMenuOpen(false)}><X className="text-gray-400"/></button>
                  </div>
                  <div className="bg-[#1C1C1E] p-4 rounded-2xl mb-6 border border-[#333]">
                      <div className="flex justify-between text-xs font-bold mb-2"><span>Nível Fidelidade</span><span className="text-green-500">{Math.floor(user.xp/300)+1}</span></div>
                      <div className="h-1.5 bg-[#333] rounded-full overflow-hidden"><div className="h-full bg-green-500" style={{width:`${(user.xp%300)/300*100}%`}}></div></div>
                  </div>
                  <button className="w-full py-4 bg-[#222] rounded-xl font-bold text-sm mb-3 flex items-center gap-3 px-4" onClick={() => {if(navigator.share) navigator.share({url: window.location.href})}}><Share2 size={18}/> Compartilhar</button>
                  <div className="mt-auto text-center text-xs text-gray-600">Versão 4.0 Senior</div>
              </div>
          </div>
      )}

      {/* MODAL CARTEIRA */}
      {walletOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setWalletOpen(false)}></div>
              <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-xl flex items-center gap-2"><Wallet className="text-green-500"/> Cupons</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>
                  {user.coupons.length === 0 ? <p className="text-center text-gray-500 py-4">Carteira vazia.</p> : (
                      <div className="space-y-3">
                          {user.coupons.map(c => (
                              <button key={c.id} onClick={() => { setBooking({...booking, appliedCoupon: c}); setWalletOpen(false); }} className="w-full p-4 bg-black border border-green-900 rounded-xl flex justify-between items-center">
                                  <span className="font-bold text-green-500">{c.label}</span>
                                  <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">USAR</span>
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* ÁREA PRINCIPAL */}
      <main className="pt-24 px-5 max-w-md mx-auto">

        {/* --- STEP 0: IDENTIFICAÇÃO --- */}
        {step === 0 && (
            <div className="animate-fade-in">
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-green-900/20 to-black border border-green-500/30 flex items-center gap-4 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black"><Gift size={20}/></div>
                        <div><p className="font-bold text-green-400 text-sm">Presente Disponível</p><p className="text-xs text-gray-400">Toque para ver seu cupom.</p></div>
                    </div>
                )}

                <h2 className="text-3xl font-black mb-2">Vamos começar.</h2>
                <p className="text-gray-500 text-sm mb-8">Para sua segurança, precisamos de alguns dados.</p>

                <BigInput 
                    label="Como prefere ser chamado?" 
                    placeholder="Seu Nome" 
                    value={user.name} 
                    onChange={e => setUser({...user, name: e.target.value})} 
                />

                <div 
                    onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})}
                    className={`p-5 rounded-2xl border flex gap-4 cursor-pointer transition-all items-center ${booking.healthChecked ? 'bg-green-500/10 border-green-500' : 'bg-[#1C1C1E] border-[#333]'}`}
                >
                    <div className={`w-6 h-6 rounded border flex-shrink-0 flex items-center justify-center ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#555]'}`}>
                        {booking.healthChecked && <Check size={16}/>}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-white">Confirmação Obrigatória</p>
                        <p className="text-xs text-gray-400 mt-1">Declaro ser maior de 18 anos e estar saudável.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <PrimaryButton 
                        disabled={!booking.healthChecked || user.name.length < 3} 
                        onClick={handleNext}
                        icon={ArrowRight}
                    >
                        Continuar
                    </PrimaryButton>
                </div>
            </div>
        )}

        {/* --- STEP 1: SERVIÇOS --- */}
        {step === 1 && (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Escolha a Experiência</h2>
                <div className="space-y-4">
                    {SERVICES.map(s => (
                        <SelectCard 
                            key={s.id}
                            active={booking.service?.id === s.id}
                            onClick={() => { setBooking({...booking, service: s}); handleNext(); }}
                            title={s.name}
                            subtitle={s.desc}
                            price={(s.price).toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}
                            badge={s.popular ? 'MAIS PEDIDO' : null}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* --- STEP 2: DATA E HORA --- */}
        {step === 2 && (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Quando será?</h2>
                
                {/* Scroll Horizontal */}
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})}
                                className={`min-w-[72px] h-20 rounded-2xl flex flex-col items-center justify-center border transition-all flex-shrink-0
                                    ${isSel ? 'bg-green-500 text-black border-green-500' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}
                                `}>
                                <span className="text-[10px] font-black uppercase">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>

                <div className={`mt-6 transition-opacity ${!booking.date ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Horários</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return (
                                <button key={t} disabled={!!status} onClick={() => setBooking({...booking, time: t})}
                                    className={`py-3 rounded-xl text-xs font-bold border relative
                                        ${booking.time === t ? 'bg-white text-black border-white' : 
                                          status === 'sold_out' ? 'bg-[#111] border-[#222] opacity-50 cursor-not-allowed' :
                                          status ? 'bg-[#111] border-[#222] opacity-30 cursor-not-allowed' : 'bg-[#1C1C1E] border-[#333]'}
                                    `}>
                                    {t}
                                    {status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="mt-8">
                    <PrimaryButton disabled={!booking.time} onClick={handleNext}>Confirmar Horário</PrimaryButton>
                </div>
            </div>
        )}

        {/* --- STEP 3: EXTRAS --- */}
        {step === 3 && (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Adicionais</h2>
                {EXTRAS.map(ex => {
                    const active = booking.extras[ex.id];
                    return (
                        <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})}
                            className={`p-5 mb-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.98]
                            ${active ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#111] border-[#222]'}
                        `}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-green-500 border-green-500 text-black' : 'border-[#333] bg-[#050505]'}`}>
                                    {active ? <Check size={18}/> : <ex.icon size={18} className="text-gray-500"/>}
                                </div>
                                <div><p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{ex.label}</p><p className="text-xs text-gray-500">{ex.desc}</p></div>
                            </div>
                            <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {ex.price}</span>
                        </div>
                    )
                })}
                <div className="mt-8"><PrimaryButton onClick={handleNext}>Continuar</PrimaryButton></div>
            </div>
        )}

        {/* --- STEP 4: ENDEREÇO (UX ATÔMICA) --- */}
        {step === 4 && (
            <div className="animate-fade-in">
                <h2 className="text-xl font-bold mb-6">Onde será?</h2>
                
                {/* Seletor Tipo */}
                <div className="flex bg-[#1C1C1E] p-1 rounded-xl mb-6 border border-[#333]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {street:'', number:'', district:'', comp:'', motelName:'', suite:''}})}
                            className={`flex-1 py-3 text-xs font-bold uppercase rounded-lg transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow' : 'text-gray-500'}`}>
                            {t === 'home' ? 'Residência' : t.toUpperCase()}
                        </button>
                    ))}
                </div>

                {/* Formulário Condicional */}
                <div className="space-y-4">
                    {booking.locationType === 'motel' ? (
                        <>
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </>
                    ) : (
                        <>
                            <BigInput label={booking.locationType === 'hotel' ? 'Nome do Hotel' : 'Rua / Avenida'} placeholder={booking.locationType === 'hotel' ? 'Ex: Hotel Bourbon' : 'Ex: Rua Piauí'} value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={MapPin} />
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <BigInput label={booking.locationType === 'hotel' ? 'Quarto' : 'Número'} placeholder="123" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} />
                                </div>
                                <div className="w-2/3">
                                    <BigInput label="Bairro" placeholder="Ex: Centro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} />
                                </div>
                            </div>
                            <BigInput label="Complemento (Opcional)" placeholder="Ex: Bloco A, Apto 12" value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                        </>
                    )}
                </div>

                {/* Aviso Uber */}
                <div className="mt-4 p-4 bg-yellow-900/10 border border-yellow-600/20 rounded-xl flex gap-3">
                    <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-1"/>
                    <p className="text-xs text-yellow-100/70 leading-relaxed">
                        <strong className="text-yellow-500 block">Taxa de Deslocamento (Uber)</strong>
                        Este valor <strong>não está incluso</strong>. Calcularemos o valor exato da ida e volta pelo WhatsApp após você enviar o endereço.
                    </p>
                </div>

                <div className="mt-8">
                    <PrimaryButton 
                        disabled={booking.locationType === 'motel' ? (!booking.address.motelName || !booking.address.suite) : (!booking.address.street || !booking.address.number || !booking.address.district)} 
                        onClick={handleNext}
                    >
                        Revisar Pedido
                    </PrimaryButton>
                </div>
            </div>
        )}

        {/* --- STEP 5: RESUMO E PAGAMENTO --- */}
        {step === 5 && (
            <div className="animate-fade-in pb-8">
                <h2 className="text-xl font-bold mb-6">Resumo</h2>
                
                {/* TICKET VISUAL */}
                <div className="relative bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 mb-6">
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#050505] rounded-full"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#050505] rounded-full"></div>
                    
                    <div className="border-b border-dashed border-[#333] pb-6 mb-6 text-center">
                        <h3 className="text-xl font-black text-white">{booking.service?.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} • {booking.time}</p>
                    </div>

                    <div className="space-y-3 mb-6">
                        {Object.entries(booking.extras).filter(([_,v])=>v).map(([k]) => (
                            <div key={k} className="flex justify-between text-xs text-green-500"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>{EXTRAS.find(e=>e.id===k).price},00</span></div>
                        ))}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-sm text-green-400 font-bold"><span>Cupom ({booking.appliedCoupon.label})</span><span>- R$ {booking.appliedCoupon.val},00</span></div>
                        ) : (
                            <button onClick={() => setWalletOpen(true)} className="w-full py-2 border border-dashed border-[#444] rounded-lg text-xs text-gray-500 hover:text-green-500 hover:border-green-500 transition-colors flex items-center justify-center gap-2"><Ticket size={14}/> Adicionar Cupom</button>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                        <span className="text-gray-400 font-bold text-sm">TOTAL ESTIMADO</span>
                        <span className="text-2xl font-black text-white">R$ {totalData.final},00</span>
                    </div>
                </div>

                <div className="mb-8">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Forma de Pagamento</p>
                    <div className="grid grid-cols-3 gap-2">
                        {['pix', 'dinheiro', 'cartao'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all ${booking.payment === p ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-5 z-40">
                    <PrimaryButton onClick={finalize} pulse icon={MessageCircle}>Agendar Agora</PrimaryButton>
                </div>
            </div>
        )}

      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
