import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, Copy, Lock,
  Navigation, CreditCard, Banknote
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  CITY_NAME: "Londrina - PR",
  THEME_COLOR: '#22C55E', // Verde
  STORAGE_KEY: 'thaly_app_master_v1',
  XP_LEVEL_UP: 300 // XP necessário para ganhar prêmio
};

const SERVICES = [
  { 
    id: 'completa', name: 'Experiência Completa', 
    desc: 'Relaxamento muscular profundo seguido de finalização manual intensa e explosiva. O serviço mais completo.', 
    time: 60, price: 180, xp: 50, popular: true 
  },
  { 
    id: 'relax', name: 'Massagem Relaxante', 
    desc: 'Foco 100% terapêutico para alívio de dores e tensão muscular. Sem toques nas partes íntimas.', 
    time: 60, price: 150, xp: 30, popular: false 
  },
  { 
    id: 'tantra', name: 'Tântrica Sensitive', 
    desc: 'Uma jornada sensorial. Toques sutis, respiração guiada e conexão energética intensa.', 
    time: 90, price: 250, xp: 80, popular: false 
  }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Estenda o tempo', icon: Clock, price: 50 },
  { id: 'touch', label: 'Interação Recíproca', desc: 'Toque e troca', icon: Flame, price: 60 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais', icon: Wind, price: 20 }
];

const REVIEWS = [
  { t: "O melhor de Londrina! O Thalyson é super educado e a massagem é surreal.", a: "Carlos (Gleba)", s: 5 },
  { t: "Ambiente do hotel foi respeitado, muito discreto. Recomendo.", a: "M. Viajante", s: 5 },
  { t: "Mão firme na medida certa. O cara é bom mesmo.", a: "Gustavo", s: 5 },
  { t: "A experiência completa vale cada centavo. Saí renovado.", a: "André L.", s: 5 },
];

const FAQS = [
    { q: "Onde é o atendimento?", a: "Atendo no seu local: Residência, Hotel ou Motel em Londrina." },
    { q: "O deslocamento é incluso?", a: "Não. A taxa de Uber (Ida/Volta) é calculada e combinada no WhatsApp." },
    { q: "Aceita Cartão?", a: "Sim. Pix, Dinheiro e Cartão de Crédito/Débito." },
    { q: "É seguro e sigiloso?", a: "Totalmente. Profissionalismo e discrição são prioridade." }
];

// ==================================================================================
// 2. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
  
  // Lógica Avançada de Horários
  checkTimeAvailability: (selectedDate, timeString) => {
    if (!selectedDate) return 'blocked';
    
    const now = new Date();
    const sel = new Date(selectedDate);
    const [h] = timeString.split(':').map(Number);
    
    // 1. Bloquear passado (Hoje)
    if (sel.toDateString() === now.toDateString()) {
      if (h <= now.getHours()) return 'past';
    }

    // 2. Simular Esgotado (Determinístico para não piscar)
    // Se a soma do dia + hora for múltiplo de 7, marca como esgotado
    const seed = sel.getDate() + h; 
    if (seed % 7 === 0) return 'sold_out';

    return 'available';
  }
};

// ==================================================================================
// 3. COMPONENTES VISUAIS (SENIOR UI)
// ==================================================================================

// Ticket Visual (Resumo do Pedido)
const TicketCard = ({ booking, total, discount, onOpenWallet, hasCoupon }) => (
    <div className="relative bg-[#1C1C1E] rounded-3xl overflow-hidden border border-[#333] shadow-2xl mb-6">
        {/* Recorte do Ticket (Círculos laterais) */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 bg-[#050505] rounded-full z-10"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-[#050505] rounded-full z-10"></div>

        {/* Header do Ticket */}
        <div className="bg-[#22C55E]/10 p-6 border-b border-dashed border-[#444] text-center">
            <h3 className="text-[10px] font-black tracking-[0.2em] text-green-500 uppercase mb-2">Resumo do Pedido</h3>
            <h2 className="text-xl font-bold text-white leading-none mb-1">{booking.service?.name || 'Selecione...'}</h2>
            <p className="text-xs text-gray-400">
                {booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '--/--'} • {booking.time || '--:--'}
            </p>
        </div>

        {/* Body do Ticket */}
        <div className="p-6 space-y-3">
             <div className="flex justify-between text-sm text-gray-300">
                 <span>Serviço Base</span>
                 <span>{Utils.formatBRL(booking.service?.price || 0)}</span>
             </div>
             {Object.entries(booking.extras).filter(([_,v])=>v).map(([k]) => {
                 const ex = EXTRAS.find(e => e.id === k);
                 return (
                     <div key={k} className="flex justify-between text-xs text-green-400">
                         <span>+ {ex.label}</span>
                         <span>{Utils.formatBRL(ex.price)}</span>
                     </div>
                 )
             })}
             
             {/* Área do Cupom */}
             {hasCoupon ? (
                 <div className="flex justify-between text-sm text-green-500 font-bold py-2 border-t border-[#333] border-dashed mt-2">
                     <span className="flex items-center gap-1"><Ticket size={14}/> Cupom Aplicado</span>
                     <span>- {Utils.formatBRL(discount)}</span>
                 </div>
             ) : (
                 <button onClick={onOpenWallet} className="w-full py-3 border border-dashed border-[#444] rounded-xl text-xs font-bold text-gray-500 hover:text-green-500 hover:border-green-500 transition-colors flex items-center justify-center gap-2 mt-2">
                     <Ticket size={14}/> Adicionar Cupom de Desconto
                 </button>
             )}
        </div>

        {/* Footer Total */}
        <div className="bg-[#111] p-4 flex justify-between items-center">
             <span className="text-xs font-bold text-gray-500 uppercase">Total a Pagar</span>
             <span className="text-2xl font-black text-white">{Utils.formatBRL(total)}</span>
        </div>
    </div>
);

// Review Carousel (Infinito)
const ReviewCarousel = () => (
    <div className="w-full overflow-hidden relative">
        <div className="flex gap-4 animate-scroll w-max py-4">
             {[...REVIEWS, ...REVIEWS].map((r, i) => (
                 <div key={i} className="w-[280px] bg-[#161616] p-4 rounded-2xl border border-[#222]">
                     <div className="flex text-yellow-500 mb-2 gap-0.5">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
                     <p className="text-gray-300 text-xs italic mb-2 line-clamp-2">"{r.t}"</p>
                     <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                 </div>
             ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 30s linear infinite; }`}</style>
    </div>
);

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  // User Persistence (Name, XP, Coupons)
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { 
              name: '', xp: 0, 
              coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15, desc: 'Desconto de boas-vindas' }] 
          };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // Booking Session State
  const [booking, setBooking] = useState({
      healthChecked: false,
      service: null,
      extras: { upgrade: false, touch: false, aroma: false },
      date: null,
      time: null,
      locationType: 'home', // home, hotel, motel
      address: '',
      payment: 'pix',
      appliedCoupon: null
  });

  // Save user data on change
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // --- ACTIONS & LOGIC ---

  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };

  const toggleExtra = (id) => {
      Utils.vibrate();
      setBooking(prev => ({ ...prev, extras: { ...prev.extras, [id]: !prev.extras[id] } }));
  };

  const applyCoupon = (coupon) => {
      setBooking(prev => ({ ...prev, appliedCoupon: coupon }));
      setWalletOpen(false);
      Utils.vibrate();
  };

  const handleShare = async () => {
      if (navigator.share) {
          try { await navigator.share({ title: 'Thalymassagens', url: window.location.href }); } catch {}
      } else {
          navigator.clipboard.writeText(window.location.href);
          alert('Link copiado para a área de transferência!');
      }
      setMenuOpen(false);
  };

  // CÁLCULO TOTAL
  const financials = useMemo(() => {
      let sub = 0;
      if (booking.service) sub += booking.service.price;
      if (booking.extras.upgrade) sub += 50;
      if (booking.extras.touch) sub += 60;
      if (booking.extras.aroma) sub += 20;
      
      const discount = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
      return { sub, discount, total: Math.max(0, sub - discount) };
  }, [booking]);

  // FINALIZAR PEDIDO (The "Burn" Logic)
  const finalize = () => {
      // 1. Remove cupom usado (Queima)
      let newCoupons = [...user.coupons];
      if (booking.appliedCoupon) {
          newCoupons = newCoupons.filter(c => c.id !== booking.appliedCoupon.id);
      }

      // 2. Adiciona XP e verifica Level Up (Gamificação)
      const earnedXP = (booking.service?.xp || 0);
      const newXP = user.xp + earnedXP;
      
      // Se passou de um múltiplo de 300, ganha cupom
      if (Math.floor(newXP / CONFIG.XP_LEVEL_UP) > Math.floor(user.xp / CONFIG.XP_LEVEL_UP)) {
          newCoupons.push({ 
              id: `REWARD_${Date.now()}`, 
              label: 'Prêmio Fidelidade', 
              val: 30, 
              desc: 'Desbloqueado por subir de nível!' 
          });
      }

      // 3. Salva estado
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      // 4. Gera WhatsApp Detalhado
      const extrasList = Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=>EXTRAS.find(e=>e.id===k).label);
      const locLabel = booking.locationType === 'motel' ? '🏩 Motel' : booking.locationType === 'hotel' ? '🏨 Hotel' : '🏠 Residência';
      const mapsLink = booking.address.length > 5 ? `\n🗺️ Maps: https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address + ' Londrina')}` : '';

      const text = `
*AGENDAMENTO - THALYSON* 🌿
--------------------------------
👤 *Cliente:* ${user.name}
✅ *Check:* +18 e Saúde confirmados.

📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
💆 *Serviço:* ${booking.service?.name}

✨ *Adicionais:*
${extrasList.length ? extrasList.map(e => `• ${e}`).join('\n') : 'Nenhum'}

📍 *Local:* ${locLabel}
📝 *End:* ${booking.address} ${mapsLink}

💰 *FINANCEIRO*
--------------------------------
Serviço: ${Utils.formatBRL(financials.sub)}
${booking.appliedCoupon ? `🎟️ Cupom: -${Utils.formatBRL(financials.discount)}` : ''}
*TOTAL A PAGAR: ${Utils.formatBRL(financials.total)}*

⚠️ *IMPORTANTE:*
A taxa de deslocamento (Uber) NÃO está inclusa e será calculada agora.

💳 *Pagamento:* ${booking.payment.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // --- RENDER ---

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-green-500 selection:text-black pb-32">
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
        .pt-safe { padding-top: env(safe-area-inset-top, 20px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-enter { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-[#050505]/80 backdrop-blur-xl border-b border-white/5">
         <div className="pt-safe px-4 py-3 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className="p-1 -ml-2 text-gray-400"><ChevronLeft/></button>}
                 <div>
                     <h1 className="text-sm font-black tracking-widest text-white uppercase">Thalymassagens</h1>
                     <div className="flex items-center gap-1 text-[10px] text-green-500 font-bold">
                         <MapPin size={10}/> {CONFIG.CITY_NAME}
                     </div>
                 </div>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => setWalletOpen(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] text-green-500 relative">
                     <Wallet size={18}/>
                     {user.coupons.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1C1C1E]"></span>}
                 </button>
                 <button onClick={() => setMenuOpen(true)} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><Menu size={18}/></button>
             </div>
         </div>
         {/* Progress Bar */}
         <div className="h-[2px] w-full bg-[#111]">
             <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${(step/5)*100}%`}}></div>
         </div>
      </header>

      {/* MODAL MENU */}
      {menuOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
              <div className="relative w-72 h-full bg-[#111] border-l border-[#222] p-6 shadow-2xl flex flex-col animate-enter">
                  <div className="flex justify-between items-center mb-8">
                      <span className="font-bold text-lg">Menu</span>
                      <button onClick={()=>setMenuOpen(false)}><X className="text-gray-400"/></button>
                  </div>
                  
                  {/* Gamification Widget */}
                  <div className="bg-gradient-to-br from-[#1C1C1E] to-[#111] border border-[#333] p-4 rounded-2xl mb-6">
                      <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-bold text-gray-400 uppercase">Nível Fidelidade</span>
                          <span className="text-xs font-black text-green-500">{Math.floor(user.xp / 300) + 1}</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#333] rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-green-500" style={{width: `${(user.xp % 300) / 300 * 100}%`}}></div>
                      </div>
                      <p className="text-[10px] text-gray-500">Ganhe {300 - (user.xp % 300)} XP para o próximo prêmio.</p>
                  </div>

                  <div className="space-y-3">
                      <button onClick={() => { setHelpOpen(true); setMenuOpen(false); }} className="w-full p-4 rounded-xl bg-[#1C1C1E] font-bold text-sm flex gap-3 items-center"><HelpCircle size={18} className="text-gray-400"/> Dúvidas</button>
                      <button onClick={handleShare} className="w-full p-4 rounded-xl bg-[#1C1C1E] font-bold text-sm flex gap-3 items-center"><Share2 size={18} className="text-gray-400"/> Compartilhar</button>
                  </div>
              </div>
          </div>
      )}

      {/* MODAL WALLET */}
      {walletOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setWalletOpen(false)}></div>
              <div className="relative w-full max-w-sm bg-[#1C1C1E] border-t sm:border border-[#333] rounded-t-3xl sm:rounded-3xl p-6 animate-enter">
                  <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6 sm:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Wallet className="text-green-500"/> Carteira</h3>
                      <button onClick={()=>setWalletOpen(false)}><X className="text-gray-400"/></button>
                  </div>
                  {user.coupons.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                          <Ticket size={48} className="mx-auto mb-2 opacity-20"/>
                          <p className="text-sm">Nenhum cupom disponível.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {user.coupons.map(c => (
                              <button key={c.id} onClick={() => applyCoupon(c)} className="w-full bg-[#111] border border-green-900/40 p-4 rounded-xl flex justify-between items-center group hover:border-green-500 transition-all">
                                  <div className="text-left">
                                      <p className="font-black text-green-500 uppercase">{c.label}</p>
                                      <p className="text-xs text-gray-400">{c.desc}</p>
                                  </div>
                                  <div className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded group-hover:bg-green-500 group-hover:text-black">USAR</div>
                              </button>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* MODAL AJUDA */}
      {helpOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-2xl p-6">
                   <h3 className="font-bold text-lg mb-4">Dúvidas Frequentes</h3>
                   <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                       {FAQS.map((f, i) => (
                           <div key={i} className="bg-[#111] p-3 rounded-xl border border-[#222]">
                               <p className="text-green-500 font-bold text-xs mb-1">{f.q}</p>
                               <p className="text-gray-300 text-xs">{f.a}</p>
                           </div>
                       ))}
                   </div>
                   <button onClick={()=>setHelpOpen(false)} className="w-full mt-4 bg-[#333] py-3 rounded-xl font-bold text-sm">Fechar</button>
              </div>
          </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="pt-24 max-w-md mx-auto px-5 animate-enter">
          
          {/* STEP 0: INTRODUÇÃO */}
          {step === 0 && (
              <div>
                  {user.coupons.some(c => c.id === 'WELCOME') && (
                      <div className="mb-6 p-4 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 animate-pulse cursor-pointer" onClick={() => setWalletOpen(true)}>
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black"><Gift size={20}/></div>
                          <div>
                              <p className="font-bold text-green-500 text-sm">Você tem um presente!</p>
                              <p className="text-xs text-green-200/70">Toque para ver seu cupom de 1ª Vez.</p>
                          </div>
                      </div>
                  )}

                  <h2 className="text-3xl font-black text-white mb-2">Agende seu<br/>relaxamento.</h2>
                  <p className="text-gray-400 text-sm mb-8">Experiências exclusivas em Londrina.</p>

                  <div className="space-y-4 mb-8">
                      <div className="relative">
                          <span className="absolute left-4 top-3 text-[10px] font-bold text-gray-500 uppercase">Seu Nome</span>
                          <input 
                              value={user.name} 
                              onChange={e => setUser({...user, name: e.target.value})}
                              className="w-full bg-[#1C1C1E] border border-[#333] rounded-xl pt-7 pb-3 px-4 text-white font-medium outline-none focus:border-green-500 transition-colors"
                              placeholder="Digite seu nome..."
                          />
                      </div>
                      
                      {/* TRAVA DE SAÚDE */}
                      <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-4 rounded-xl border flex gap-3 cursor-pointer transition-all ${booking.healthChecked ? 'bg-green-500/10 border-green-500' : 'bg-[#1C1C1E] border-[#333]'}`}>
                          <div className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center ${booking.healthChecked ? 'bg-green-500 border-green-500' : 'border-[#555]'}`}>
                              {booking.healthChecked && <Check size={14} className="text-black"/>}
                          </div>
                          <p className="text-xs text-gray-400 select-none">
                              Declaro que sou maior de 18 anos e estou em plenas condições de saúde.
                          </p>
                      </div>
                  </div>

                  <div className="bg-[#1C1C1E] rounded-2xl border border-[#333] p-4 mb-6">
                      <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 flex items-center gap-1"><HeartIcon/> Experiências Reais</p>
                      <ReviewCarousel />
                  </div>

                  <button 
                      disabled={!booking.healthChecked || user.name.length < 3}
                      onClick={handleNext} 
                      className="w-full py-4 bg-white text-black font-black uppercase rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                      Começar <ArrowRight size={18}/>
                  </button>
              </div>
          )}

          {/* STEP 1: SERVIÇOS */}
          {step === 1 && (
              <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-6">Escolha a Experiência</h2>
                  {SERVICES.map(s => (
                      <div key={s.id} onClick={() => { setBooking({...booking, service: s}); handleNext(); }}
                          className={`relative p-5 rounded-3xl border cursor-pointer group active:scale-[0.98] transition-all
                              ${booking.service?.id === s.id ? 'bg-[#1C1C1E] border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'bg-[#111] border-[#222]'}
                          `}>
                          {s.popular && <span className="absolute top-4 right-4 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded">POPULAR</span>}
                          
                          <div className="flex justify-between items-end mb-2">
                              <h3 className="text-lg font-bold text-white">{s.name}</h3>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed mb-4 max-w-[90%]">{s.desc}</p>
                          
                          <div className="flex justify-between items-center border-t border-[#222] pt-3">
                              <span className="text-sm font-bold text-white">{Utils.formatBRL(s.price)}</span>
                              <div className="flex gap-2">
                                  <span className="text-[10px] bg-[#222] px-2 py-1 rounded text-gray-400 flex items-center gap-1"><Clock size={10}/> {s.time}m</span>
                                  <span className="text-[10px] bg-green-900/20 px-2 py-1 rounded text-green-500 font-bold flex items-center gap-1"><Zap size={10}/> +{s.xp} XP</span>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {/* STEP 2: DATA E HORA */}
          {step === 2 && (
              <div>
                  <h2 className="text-xl font-bold mb-6">Data e Hora</h2>
                  
                  {/* Scroll Horizontal Datas */}
                  <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 hide-scroll">
                      {[...Array(14)].map((_, i) => {
                          const d = new Date(); d.setDate(d.getDate() + i);
                          const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                          return (
                              <button key={i} onClick={() => setBooking({...booking, date: d, time: null})}
                                  className={`min-w-[70px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all
                                      ${isSel ? 'bg-green-600 border-green-600 text-black shadow-lg shadow-green-900/50' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}
                                  `}>
                                  <span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                  <span className="text-2xl font-bold">{d.getDate()}</span>
                              </button>
                          )
                      })}
                  </div>

                  {/* Grid Horas */}
                  <div className={`mt-6 transition-opacity ${!booking.date ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Horários Disponíveis</h3>
                      <div className="grid grid-cols-4 gap-2">
                          {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                              const status = Utils.checkTimeAvailability(booking.date, t);
                              return (
                                  <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})}
                                      className={`py-3 rounded-xl border text-xs font-bold relative transition-all
                                          ${booking.time === t ? 'bg-white text-black border-white' : 
                                            status === 'available' ? 'bg-[#1C1C1E] border-[#333] hover:border-green-500' : 
                                            'bg-[#111] border-[#222] opacity-40 cursor-not-allowed'}
                                      `}>
                                      {t}
                                      {status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl"><span className="text-[8px] font-black text-red-500 -rotate-12 bg-black px-1 border border-red-900">ESGOTADO</span></div>}
                                  </button>
                              )
                          })}
                      </div>
                  </div>

                  <div className="mt-8">
                      <button disabled={!booking.time} onClick={handleNext} className="w-full py-4 bg-white text-black font-bold rounded-xl disabled:opacity-50">Confirmar Horário</button>
                  </div>
              </div>
          )}

          {/* STEP 3: EXTRAS */}
          {step === 3 && (
              <div>
                  <h2 className="text-xl font-bold mb-6">Turbine sua Sessão</h2>
                  <div className="space-y-3">
                      {EXTRAS.map(ex => {
                          const active = booking.extras[ex.id];
                          return (
                              <div key={ex.id} onClick={() => toggleExtra(ex.id)}
                                  className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]
                                      ${active ? 'bg-green-900/20 border-green-500' : 'bg-[#1C1C1E] border-[#333]'}
                                  `}>
                                  <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-green-500 border-green-500 text-black' : 'border-[#333] bg-[#111] text-gray-500'}`}>
                                          {active ? <Check size={18}/> : <ex.icon size={18}/>}
                                      </div>
                                      <div>
                                          <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{ex.label}</p>
                                          <p className="text-[10px] text-gray-500">{ex.desc}</p>
                                      </div>
                                  </div>
                                  <span className={`font-bold text-xs ${active ? 'text-green-500' : 'text-gray-500'}`}>+ {Utils.formatBRL(ex.price)}</span>
                              </div>
                          )
                      })}
                  </div>
                  <button onClick={handleNext} className="w-full mt-8 py-4 bg-white text-black font-bold rounded-xl">Continuar</button>
              </div>
          )}

          {/* STEP 4: LOCALIZAÇÃO */}
          {step === 4 && (
              <div>
                  <h2 className="text-xl font-bold mb-6">Onde será?</h2>
                  
                  <div className="flex bg-[#1C1C1E] p-1 rounded-xl mb-4 border border-[#333]">
                      {['home', 'motel', 'hotel'].map(t => (
                          <button key={t} onClick={() => setBooking({...booking, locationType: t})}
                              className={`flex-1 py-3 text-xs font-bold uppercase rounded-lg transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow' : 'text-gray-500'}`}>
                              {t === 'home' ? 'Casa' : t}
                          </button>
                      ))}
                  </div>

                  <textarea 
                      value={booking.address} 
                      onChange={e => setBooking({...booking, address: e.target.value})}
                      placeholder={booking.locationType === 'motel' ? "Nome do Motel e Número da Suíte..." : "Endereço completo (Rua, Número, Bairro, Compl)..."}
                      className="w-full h-32 bg-[#1C1C1E] border border-[#333] rounded-xl p-4 text-white placeholder:text-gray-600 focus:border-green-500 outline-none resize-none mb-4"
                  />

                  <div className="bg-yellow-900/10 border border-yellow-600/30 p-4 rounded-xl flex gap-3 mb-8">
                      <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0 mt-0.5"/>
                      <p className="text-xs text-yellow-100/80 leading-relaxed">
                          <strong className="text-yellow-500 block mb-1">Taxa de Deslocamento (Uber)</strong>
                          Este valor não está incluso no total e será calculado/cobrado separadamente no WhatsApp.
                      </p>
                  </div>
                  
                  <button disabled={booking.address.length < 5} onClick={handleNext} className="w-full py-4 bg-white text-black font-bold rounded-xl disabled:opacity-50">Revisar Pedido</button>
              </div>
          )}

          {/* STEP 5: REVISÃO E PAGAMENTO */}
          {step === 5 && (
              <div className="pb-32">
                  <h2 className="text-xl font-bold mb-6">Finalizar</h2>
                  
                  <TicketCard 
                      booking={booking} 
                      total={financials.total} 
                      discount={financials.discount}
                      hasCoupon={!!booking.appliedCoupon}
                      onOpenWallet={() => setWalletOpen(true)}
                  />

                  <div className="mb-6">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-3 ml-1">Forma de Pagamento</p>
                      <div className="grid grid-cols-3 gap-3">
                          {['pix', 'dinheiro', 'cartao'].map(p => (
                              <button key={p} onClick={() => setBooking({...booking, payment: p})}
                                  className={`py-3 rounded-xl border text-[10px] font-bold uppercase transition-all flex flex-col items-center gap-1
                                      ${booking.payment === p ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}
                                  `}>
                                  {p === 'pix' && <Zap size={14}/>}
                                  {p === 'dinheiro' && <Banknote size={14}/>}
                                  {p === 'cartao' && <CreditCard size={14}/>}
                                  {p}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>
          )}
      </main>

      {/* FOOTER CTA (STEP 5) */}
      {step === 5 && (
          <div className="fixed bottom-0 left-0 w-full bg-[#050505]/90 backdrop-blur-xl border-t border-white/10 p-5 z-40 pb-safe">
              <button onClick={finalize} className="w-full py-4 bg-green-500 text-black font-black uppercase rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] animate-pulse flex items-center justify-center gap-2">
                  Confirmar Agendamento <MessageCircle size={20}/>
              </button>
          </div>
      )}

    </div>
  );
}

// Pequeno ícone auxiliar
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-red-500"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
