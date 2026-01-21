import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, 
  User, Copy, CheckCircle, Info
} from 'lucide-react';

// ==================================================================================
// 1. DADOS ATUALIZADOS & CONFIGURAÇÃO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_final_simple',
};

// SERVIÇOS (Preços e Textos Atualizados)
const SERVICES = [
  { 
    id: 'completa', name: '🔥 Completa (1h)', 
    price: 175, 
    desc: 'Corpo a corpo + Finalização manual inclusa.',
    popular: true 
  },
  { 
    id: 'relax', name: '🍃 Relaxante (1h)', 
    price: 145, 
    desc: 'Apenas muscular. Foco em tirar dores e tensão.',
    popular: false 
  }
];

// EXTRAS (Preços Atualizados)
const EXTRAS = [
  { id: 'more_time', label: 'Duração 1h30', sub: '+30 minutos', icon: Clock, price: 70 },
  { id: 'touch', label: 'Interatividade', sub: 'Troca de energia', icon: Flame, price: 63 },
  { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "A progressão da massagem é perfeita. Começa relaxando e termina intenso.", a: "Tiago", s: 5 },
  { t: "O Thalyson é super profissional. Explicou tudo antes, sem surpresas.", a: "Roberto", s: 5 },
  { t: "Fui travado e saí leve. A finalização vale cada centavo.", a: "Pedro H.", s: 5 },
  { t: "Discreto e higiênico. Me senti seguro no hotel.", a: "M. Viajante", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso", s: 5 },
  { t: "Respeitou meu tempo e meus limites. Recomendo.", a: "André", s: 5 }
];

// ==================================================================================
// 2. COMPONENTES VISUAIS (SIMPLES E GRANDES)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

// Card de Explicação (O texto que você pediu)
const InfoCard = () => (
    <div className="bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 mb-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="text-green-500"/> Como Funciona
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Vou até seu local (casa/hotel/motel), faço na cama e a sessão dura 60min.
        </p>
        <div className="space-y-3 bg-[#111] p-4 rounded-xl border border-[#222]">
            <p className="text-sm text-gray-300"><strong className="text-green-500">1️⃣</strong> Começo com a <strong>Relaxante</strong> no corpo todo pra tirar a tensão.</p>
            <p className="text-sm text-gray-300"><strong className="text-green-500">2️⃣</strong> Passo para o <strong>Corpo a Corpo</strong> (contato pele com pele, mais sensitivo).</p>
            <p className="text-sm text-gray-300"><strong className="text-green-500">3️⃣</strong> Finalizo com a <strong>Tântrica</strong> (massagem íntima com finalização manual inclusa).</p>
        </div>
        <p className="text-xs text-gray-500 mt-4 italic text-center">
            🚫 Focado no seu prazer. Não tem penetração nem oral.
        </p>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder }) => (
  <div className="mb-4">
    <label className="text-[11px] font-bold text-gray-500 uppercase ml-1 mb-1 block">{label}</label>
    <input 
        value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-14 bg-[#1C1C1E] border border-[#333] rounded-xl px-4 text-white text-lg placeholder:text-gray-600 focus:border-green-500 outline-none transition-all"
    />
  </div>
);

const SelectCard = ({ active, onClick, title, price, desc, badge }) => (
    <div onClick={onClick} className={`relative p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] mb-3 ${active ? 'bg-[#1C1C1E] border-green-500 shadow-lg' : 'bg-[#111] border-[#222]'}`}>
        {badge && <span className="absolute top-4 right-4 bg-white text-black text-[10px] font-black px-2 py-0.5 rounded">{badge}</span>}
        <div className="flex justify-between items-center mb-1">
            <h3 className={`text-lg font-bold ${active ? 'text-white' : 'text-gray-200'}`}>{title}</h3>
            <span className="text-sm font-bold text-green-500 bg-green-900/20 px-2 py-1 rounded">R$ {price}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

const ExtraToggle = ({ active, onClick, icon: Icon, label, sub, price }) => (
    <div onClick={onClick} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer mb-2 transition-all ${active ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#111] border-[#222]'}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'}`}><Icon size={20}/></div>
            <div>
                <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{label}</p>
                <p className="text-[10px] text-gray-500">{sub}</p>
            </div>
        </div>
        <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {price}</span>
    </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon }) => (
    <button onClick={onClick} disabled={disabled} className={`w-full h-16 rounded-xl font-black text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${disabled ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-lg animate-pulse'}`}>
        {label} {Icon && <Icon size={20}/>}
    </button>
);

const ReviewCarousel = () => (
    <div className="w-full overflow-hidden relative py-2 mb-6">
        <div className="flex gap-4 animate-scroll w-max">
             {[...REVIEWS_DB, ...REVIEWS_DB].map((r, i) => (
                 <div key={i} className="w-[260px] bg-[#1C1C1E] p-4 rounded-2xl border border-[#333] flex-shrink-0">
                     <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                     <p className="text-gray-300 text-xs italic mb-2 line-clamp-3">"{r.t}"</p>
                     <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                 </div>
             ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 40s linear infinite; }`}</style>
    </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0);
  const [success, setSuccess] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  // User & Booking State
  const [user, setUser] = useState({ name: '', coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] });
  const [booking, setBooking] = useState({
      healthChecked: false,
      service: null,
      extras: { more_time: false, touch: false, aroma: false },
      date: null,
      time: null,
      address: { city: '', details: '' },
      payment: null,
      appliedCoupon: null
  });

  // Actions
  const handleNext = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => setStep(s => s - 1);
  const isTimeBlocked = (d, t) => {
      if(!d) return true;
      const now = new Date();
      const sel = new Date(d);
      const [h] = t.split(':').map(Number);
      if(sel.toDateString()===now.toDateString() && h<=now.getHours()) return true;
      return false;
  };

  const calculateTotal = () => {
      let total = booking.service?.price || 0;
      if(booking.extras.more_time) total += 70;
      if(booking.extras.touch) total += 63;
      if(booking.extras.aroma) total += 10;
      const disc = booking.appliedCoupon?.val || 0;
      return { total, disc, final: Math.max(0, total - disc) };
  };

  const finalize = () => {
      const calc = calculateTotal();
      const extrasTxt = Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=> `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n');
      
      const text = `
*NOVO AGENDAMENTO* 🌿
---------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* +18 Confirmado

💆 *Serviço:* ${booking.service?.name}
📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

✨ *Adicionais:*
${extrasTxt || 'Nenhum'}

📍 *Localização:*
Cidade: ${booking.address.city}
Endereço: ${booking.address.details}

💰 *Financeiro:*
Total Serviço: ${Utils.fmtMoney(calc.total)}
${booking.appliedCoupon ? `🎟️ Cupom: -${Utils.fmtMoney(calc.disc)}` : ''}
*A PAGAR: ${Utils.fmtMoney(calc.final)}*

🚗 *Locomoção:* Envie a localização exata para calcular o Uber.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();
      
      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  if(success) return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6"><Check size={48} className="text-black"/></div>
          <h2 className="text-3xl font-black mb-4">Solicitação Enviada!</h2>
          <p className="text-gray-400 mb-8">Agora é só aguardar. Vou confirmar o valor do Uber e te aviso no WhatsApp.</p>
          <button onClick={() => window.location.reload()} className="px-8 py-3 bg-[#222] rounded-xl font-bold text-sm">Voltar ao Início</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-40">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/95 backdrop-blur border-b border-white/5 px-5 py-4 flex justify-between items-center">
         <div className="flex items-center gap-3">
             {step > 0 && <button onClick={handleBack} className="text-gray-400"><ChevronLeft/></button>}
             <h1 className="text-sm font-black uppercase tracking-widest">Thalymassagens</h1>
         </div>
         <div className="h-1.5 w-16 bg-[#222] rounded-full overflow-hidden"><div className="h-full bg-green-500 transition-all" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">
        
        {/* === PASSO 1: IDENTIFICAÇÃO & EXPLICAÇÃO === */}
        {step === 0 && (
            <>
                <h2 className="text-3xl font-black mb-2">Bem-vindo.</h2>
                <p className="text-gray-500 text-sm mb-6">Massagem profissional e exclusiva.</p>
                
                {/* O TEXTO EXPLICATIVO PEDIDO */}
                <InfoCard />

                <div className="space-y-4">
                    <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} />
                    
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-colors ${booking.healthChecked ? 'bg-green-900/10 border-green-500' : 'bg-[#111] border-[#222]'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16}/>}</div>
                        <p className="text-xs text-gray-400">Tenho +18 anos e estou saudável.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Avaliações Reais</p>
                    <ReviewCarousel />
                </div>

                <div className="fixed bottom-0 left-0 w-full p-5 bg-[#050505]/95 border-t border-white/10 z-40">
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3} onClick={handleNext} label="Ver Serviços" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* === PASSO 2: MONTE SEU PEDIDO (SERVIÇO + EXTRAS + DATA) === */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-6">Monte seu Pedido</h2>
                
                {/* 1. SERVIÇOS */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Escolha a Base</p>
                {SERVICES.map(s => (
                    <SelectCard 
                        key={s.id} 
                        active={booking.service?.id === s.id} 
                        onClick={() => setBooking({...booking, service: s})}
                        title={s.name} price={s.price} desc={s.desc} badge={s.popular ? 'MAIS PEDIDO' : null}
                    />
                ))}

                {/* 2. EXTRAS (UPS) */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 mt-6">Turbine (Opcional)</p>
                {EXTRAS.map(ex => (
                    <ExtraToggle 
                        key={ex.id} active={booking.extras[ex.id]} 
                        onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !booking.extras[ex.id]}})}
                        icon={ex.icon} label={ex.label} sub={ex.sub} price={ex.price}
                    />
                ))}

                {/* 3. DATA E HORA */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 mt-6">Quando?</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                    {[...Array(10)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[70px] h-20 rounded-xl flex flex-col items-center justify-center border flex-shrink-0 transition-colors ${isSel ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                <span className="text-[10px] font-black uppercase">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 mt-2 animate-fade-in">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const blocked = isTimeBlocked(booking.date, t);
                            return (
                                <button key={t} disabled={blocked} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-lg text-xs font-bold border ${booking.time === t ? 'bg-white text-black' : blocked ? 'opacity-20' : 'bg-[#1C1C1E] border-[#333]'}`}>{t}</button>
                            )
                        })}
                    </div>
                )}

                <div className="fixed bottom-0 left-0 w-full p-5 bg-[#050505]/95 border-t border-white/10 z-40">
                    <PrimaryButton disabled={!booking.service || !booking.time} onClick={handleNext} label="Continuar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* === PASSO 3: LOCAL & PAGAMENTO === */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-6">Finalizar</h2>

                {/* Endereço */}
                <BigInput label="Cidade" placeholder="Ex: São Paulo, Londrina..." value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} />
                <BigInput label="Endereço Completo" placeholder="Rua, Número, Apto ou Hotel..." value={booking.address.details} onChange={e => setBooking({...booking, address: {...booking.address, details: e.target.value}})} />
                
                <div className="bg-yellow-900/10 border border-yellow-600/30 p-4 rounded-xl flex gap-3 mb-6">
                    <AlertTriangle className="text-yellow-500 shrink-0" size={20}/>
                    <p className="text-xs text-yellow-100/70"><strong>Locomoção (Uber):</strong> Envie a localização exata no WhatsApp para eu calcular a taxa de ida e volta.</p>
                </div>

                {/* Resumo */}
                <div className="bg-[#1C1C1E] border border-[#333] rounded-2xl p-6 mb-6">
                    <h3 className="text-white font-bold text-lg mb-1">{booking.service?.name}</h3>
                    <p className="text-gray-500 text-sm mb-4">{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                    <div className="space-y-2 mb-4 pt-4 border-t border-[#333]">
                        {Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=> (
                            <div key={k} className="flex justify-between text-xs text-green-500"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>R$ {EXTRAS.find(e=>e.id===k).price}</span></div>
                        ))}
                    </div>
                    {/* Cupom (Escondido se nao tiver) */}
                    {!booking.appliedCoupon && (
                        <button onClick={() => setShowWallet(true)} className="w-full py-2 border border-dashed border-[#444] rounded-lg text-xs text-gray-500 mb-4 flex items-center justify-center gap-2"><Ticket size={14}/> Tenho Cupom</button>
                    )}
                    {booking.appliedCoupon && (
                        <div className="flex justify-between text-sm text-green-400 font-bold mb-4"><span>Cupom Aplicado</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                        <span className="text-gray-400 font-bold text-xs uppercase">Total Serviço</span>
                        <span className="text-2xl font-black text-white">{Utils.fmtMoney(calculateTotal().final)}</span>
                    </div>
                </div>

                {/* Pagamento */}
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-2 ml-1">Pagamento (No Local)</p>
                <div className="grid grid-cols-3 gap-2 mb-32">
                    {['pix', 'card', 'esp'].map(p => (
                        <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 ${booking.payment === p ? 'bg-white text-black' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                            {p === 'pix' && <Zap size={16}/>}
                            {p === 'card' && <CreditCard size={16}/>}
                            {p === 'esp' && <Banknote size={16}/>}
                            {p === 'esp' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                        </button>
                    ))}
                </div>

                <div className="fixed bottom-0 left-0 w-full p-5 bg-[#050505]/95 border-t border-white/10 z-40">
                    <PrimaryButton disabled={!booking.address.city || !booking.payment} onClick={finalize} label="Confirmar no WhatsApp" icon={MessageCircle} />
                </div>
            </>
        )}

      </main>

      {/* Modal Carteira */}
      {showWallet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm">
              <div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-2xl p-6">
                  <div className="flex justify-between mb-4"><h3 className="font-bold text-white">Cupons</h3><button onClick={()=>setShowWallet(false)}><X className="text-gray-500"/></button></div>
                  {user.coupons.map(c => (
                      <button key={c.id} onClick={() => { setBooking({...booking, appliedCoupon: c}); setShowWallet(false); }} className="w-full p-4 bg-black border border-green-900 rounded-xl flex justify-between items-center text-green-500 font-bold mb-2">
                          <span>{c.label}</span><span>R$ {c.val} OFF</span>
                      </button>
                  ))}
              </div>
          </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; }`}</style>
    </div>
  );
}
