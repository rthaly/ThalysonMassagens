import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, Copy, Lock
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  THEME: '#22C55E', // Verde Londrina
  STORAGE_KEY: 'thaly_londrina_data_v2', // Chave para salvar carteira/histórico
};

const SERVICES = [
  { id: 'completa', name: 'Experiência Completa', desc: 'Relaxamento profundo + Finalização manual intensa.', time: 60, price: 180, xp: 50 },
  { id: 'relax', name: 'Massagem Relaxante', desc: 'Terapêutica focada em dores. Sem toques íntimos.', time: 60, price: 150, xp: 30 },
  { id: 'tantra', name: 'Tântrica Sensitive', desc: 'Jornada sensorial com conexão energética.', time: 90, price: 250, xp: 80 }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Mais tempo', icon: Clock, price: 50 },
  { id: 'touch', label: 'Interação', desc: 'Troca de energia', icon: Flame, price: 60 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais', icon: Wind, price: 20 }
];

// FAQS para o Menu Ajuda
const FAQS = [
    { q: "Onde é o atendimento?", a: "Vou até sua casa, hotel ou motel em Londrina." },
    { q: "Aceita Cartão?", a: "Sim, Pix, Dinheiro e Cartão (Taxas podem aplicar)." },
    { q: "É seguro?", a: "Totalmente. Sigilo absoluto e respeito." }
];

// ==================================================================================
// 2. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
  
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const sel = new Date(selectedDate);
    const [h] = timeString.split(':').map(Number);
    
    // Bloqueia passado
    if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return true; 

    // Simula Esgotado (Lógica determinística baseada na data para não mudar ao recarregar)
    const seed = sel.getDate() + h; 
    if (seed % 6 === 0) return 'sold_out'; 

    return false;
  }
};

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // --- ESTADOS ---
  const [step, setStep] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  
  // Persistência (Carteira e Histórico)
  const [userData, setUserData] = useState(() => {
      try {
          const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
          return saved ? JSON.parse(saved) : { 
              name: '', 
              xp: 0, // Pontos de fidelidade
              coupons: [{ id: 'WELCOME', label: '1ª Massagem', value: 15, desc: 'Desconto de boas-vindas' }] 
          };
      } catch {
          return { name: '', xp: 0, coupons: [] };
      }
  });

  // Salvar sempre que mudar userData
  useEffect(() => {
      localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(userData));
  }, [userData]);

  // Booking Session (Resetável)
  const [booking, setBooking] = useState({
    confirmedHealth: false, // Checkbox saúde
    service: null,
    extras: { upgrade: false, touch: false, aroma: false },
    date: null,
    time: null,
    locationType: 'home',
    address: '',
    payment: 'pix',
    appliedCoupon: null // Cupom aplicado nesta sessão
  });

  // --- CÁLCULOS ---
  const { total, nextRewardProgress } = useMemo(() => {
    let t = 0;
    if (booking.service) t += booking.service.price;
    if (booking.extras.upgrade) t += 50;
    if (booking.extras.touch) t += 60;
    if (booking.extras.aroma) t += 20;

    const discount = booking.appliedCoupon ? booking.appliedCoupon.value : 0;
    
    // Gamificação: A cada 300 XP ganha um prêmio
    const progress = (userData.xp % 300) / 300 * 100;

    return { 
        subtotal: t,
        discount,
        total: Math.max(0, t - discount),
        nextRewardProgress: progress
    };
  }, [booking, userData.xp]);

  // --- AÇÕES ---

  const handleNext = () => {
    Utils.vibrate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const handleBack = () => {
    Utils.vibrate();
    setStep(s => s - 1);
  };

  const applyCoupon = (coupon) => {
      setBooking({ ...booking, appliedCoupon: coupon });
      setShowWallet(false);
      Utils.vibrate();
  };

  const handleShare = async () => {
      const data = { title: 'Thalymassagens', text: 'Agende sua massagem em Londrina!', url: window.location.href };
      try {
          if (navigator.share) await navigator.share(data);
          else {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copiado!');
          }
      } catch (e) { console.log('Share dismissed'); }
  };

  const finalizeBooking = () => {
    // 1. Queimar Cupom (Se usou)
    let newCoupons = [...userData.coupons];
    if (booking.appliedCoupon) {
        newCoupons = newCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    }

    // 2. Adicionar XP (Fidelidade)
    const newXp = userData.xp + (booking.service?.xp || 0);
    
    // 3. Drop de Prêmio (Lógica Gamificação: Ganha cupom a cada 300xp)
    if (Math.floor(newXp / 300) > Math.floor(userData.xp / 300)) {
        newCoupons.push({ id: `REWARD_${Date.now()}`, label: 'Prêmio Fidelidade', value: 30, desc: 'Você desbloqueou pelo seu nível!' });
    }

    // 4. Salvar tudo
    setUserData({ ...userData, xp: newXp, coupons: newCoupons });
    
    // 5. Gerar Zap
    const text = `
*AGENDAMENTO - THALYSON (Londrina)* 🌿
------------------------------
👤 *Cliente:* ${userData.name}
✅ *Confirmou:* +18 e Saúde em dia.

📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}
💆 *Serviço:* ${booking.service?.name}

✨ *Adicionais:*
${Object.entries(booking.extras).filter(([_,v])=>v).map(([k]) => `• ${EXTRAS.find(e=>e.id===k).label}`).join('\n') || 'Nenhum'}

📍 *Local:* ${booking.locationType === 'motel' ? 'Motel' : booking.locationType === 'hotel' ? 'Hotel' : 'Residência'}
📝 *Endereço:* ${booking.address}

💰 *FINANCEIRO:*
Subtotal: ${Utils.formatBRL(total.subtotal)}
${booking.appliedCoupon ? `🎟️ Cupom (${booking.appliedCoupon.label}): -${Utils.formatBRL(booking.appliedCoupon.value)}` : ''}
*TOTAL SERVIÇO: ${Utils.formatBRL(total.total)}*
(Taxa de Deslocamento a combinar)

💳 Pagamento: ${booking.payment.toUpperCase()}
------------------------------
`.trim();

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black pb-32">
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                {step > 0 && <button onClick={handleBack} className="p-1 -ml-2 text-gray-400"><ChevronLeft size={24} /></button>}
                <div>
                    <h1 className="text-sm font-black tracking-tighter text-white">THALY<span className="text-green-500">MASSAGENS</span></h1>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400"><MapPin size={10} className="text-green-500"/> LONDRINA - PR</div>
                </div>
            </div>
            <button onClick={() => setShowMenu(true)} className="p-2 bg-[#222] rounded-full border border-[#333]"><Menu size={16} /></button>
        </div>
        {/* Progress Bar */}
        <div className="h-0.5 w-full bg-[#111]"><div className="h-full bg-green-500 transition-all duration-300" style={{width: `${(step/4)*100}%`}}></div></div>
      </header>

      {/* MENU LATERAL */}
      {showMenu && (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setShowMenu(false)}></div>
            <div className="relative w-72 bg-[#111] h-full border-l border-[#222] p-6 shadow-xl animate-enter-right flex flex-col">
                <div className="flex justify-between mb-8 items-center">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={()=>setShowMenu(false)}><X className="text-gray-400"/></button>
                </div>
                
                {/* Carteira no Menu */}
                <div className="bg-gradient-to-br from-green-900/40 to-[#111] p-4 rounded-xl border border-green-500/30 mb-6">
                    <p className="text-xs text-green-400 font-bold uppercase mb-1">Programa Fidelidade</p>
                    <div className="flex justify-between text-white font-bold text-sm mb-2">
                        <span>Nível Atual</span>
                        <span>{Math.floor(userData.xp / 300) + 1}</span>
                    </div>
                    <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full" style={{width: `${nextRewardProgress}%`}}></div>
                    </div>
                    <p className="text-[10px] text-gray-400">Junte pontos para ganhar cupons na sua carteira.</p>
                </div>

                <div className="space-y-3">
                    <button onClick={() => { setShowHelp(true); setShowMenu(false); }} className="w-full text-left p-4 rounded-xl bg-[#222] text-sm font-bold flex gap-3 items-center"><HelpCircle size={18} className="text-gray-400"/> Dúvidas Frequentes</button>
                    <button onClick={handleShare} className="w-full text-left p-4 rounded-xl bg-[#222] text-sm font-bold flex gap-3 items-center"><Share2 size={18} className="text-gray-400"/> Compartilhar App</button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL AJUDA */}
      {showHelp && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-black/90" onClick={()=>setShowHelp(false)}></div>
              <div className="relative bg-[#1A1A1A] w-full max-w-sm rounded-2xl border border-[#333] p-6">
                  <h3 className="font-bold text-xl mb-4">Dúvidas</h3>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                      {FAQS.map((f,i) => (
                          <div key={i} className="bg-[#111] p-3 rounded-xl">
                              <p className="font-bold text-green-500 text-sm mb-1">{f.q}</p>
                              <p className="text-xs text-gray-300">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={()=>setShowHelp(false)} className="w-full mt-4 bg-[#333] py-3 rounded-xl font-bold">Fechar</button>
              </div>
          </div>
      )}

      {/* MODAL CARTEIRA (WALLET) */}
      {showWallet && (
          <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setShowWallet(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-t-3xl sm:rounded-3xl border-t sm:border border-[#333] p-6 animate-slide-up">
                  <div className="w-12 h-1 bg-[#333] rounded-full mx-auto mb-6 sm:hidden"></div>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl flex items-center gap-2"><Wallet className="text-green-500"/> Sua Carteira</h3>
                      <button onClick={()=>setShowWallet(false)}><X className="text-gray-400"/></button>
                  </div>
                  
                  {userData.coupons.length === 0 ? (
                      <div className="text-center py-10 text-gray-500">
                          <Ticket size={40} className="mx-auto mb-3 opacity-20"/>
                          <p className="text-sm">Carteira vazia.</p>
                          <p className="text-xs">Faça agendamentos para ganhar recompensas.</p>
                      </div>
                  ) : (
                      <div className="space-y-3">
                          {userData.coupons.map(c => (
                              <button key={c.id} onClick={() => applyCoupon(c)} 
                                  className="w-full bg-[#111] border border-green-900/50 p-4 rounded-xl flex justify-between items-center group hover:border-green-500 transition-colors text-left">
                                  <div>
                                      <p className="font-black text-green-500">{c.label}</p>
                                      <p className="text-xs text-gray-400">{c.desc}</p>
                                  </div>
                                  <div className="bg-green-500/10 px-3 py-1 rounded text-green-500 font-bold text-xs group-hover:bg-green-500 group-hover:text-black transition-colors">
                                      Usar
                                  </div>
                              </button>
                          ))}
                      </div>
                  )}
                  <p className="text-[10px] text-gray-500 text-center mt-6">Ao usar um cupom, ele será removido da carteira.</p>
              </div>
          </div>
      )}

      {/* CONTEÚDO */}
      <main className="pt-20 max-w-md mx-auto animate-fade-in px-5">
        
        {/* ETAPA 0: DADOS E SAÚDE */}
        {step === 0 && (
            <div>
                {userData.coupons.some(c => c.id === 'WELCOME') && (
                    <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl flex items-center gap-3 mb-6 animate-pulse">
                        <Gift size={20} className="text-green-500"/>
                        <div>
                            <p className="text-green-500 font-bold text-xs">Presente na Carteira!</p>
                            <p className="text-[10px] text-green-200">Você tem um cupom de 1ª Vez esperando.</p>
                        </div>
                    </div>
                )}

                <h2 className="text-3xl font-bold mb-6">Vamos agendar seu<br/>relaxamento.</h2>
                
                <div className="space-y-4 mb-6">
                    <input 
                        value={userData.name}
                        onChange={e => setUserData({...userData, name: e.target.value})}
                        placeholder="Seu Nome Completo"
                        className="w-full bg-[#1A1A1A] border border-[#333] text-white p-4 rounded-xl focus:border-green-500 outline-none placeholder:text-gray-600"
                    />
                    
                    {/* CHECKBOX DE SAÚDE OBRIGATÓRIO */}
                    <div 
                        onClick={() => setBooking({...booking, confirmedHealth: !booking.confirmedHealth})}
                        className={`p-4 rounded-xl border flex gap-4 cursor-pointer transition-all ${booking.confirmedHealth ? 'bg-green-900/10 border-green-500' : 'bg-[#111] border-[#222]'}`}
                    >
                        <div className={`w-6 h-6 rounded border flex-shrink-0 flex items-center justify-center ${booking.confirmedHealth ? 'bg-green-500 border-green-500' : 'border-[#444]'}`}>
                            {booking.confirmedHealth && <Check size={16} className="text-black"/>}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed select-none">
                            Declaro ser maior de 18 anos e estar em boas condições de saúde física e mental para receber a massagem.
                        </p>
                    </div>
                </div>

                <button 
                    disabled={!booking.confirmedHealth || userData.name.length < 3}
                    onClick={handleNext}
                    className="w-full py-4 bg-white text-black font-black uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                    Continuar <ArrowRight size={18}/>
                </button>
            </div>
        )}

        {/* ETAPA 1: SERVIÇOS */}
        {step === 1 && (
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Qual o serviço de hoje?</h2>
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { setBooking({...booking, service: s}); handleNext(); }}
                        className={`relative p-5 rounded-2xl border cursor-pointer active:scale-[0.98] transition-all
                            ${booking.service?.id === s.id ? 'bg-[#1A1A1A] border-green-500' : 'bg-[#111] border-[#222]'}
                        `}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-white">{s.name}</h3>
                            <span className="bg-[#222] px-2 py-1 rounded text-xs font-bold">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                        <span className="text-[10px] text-green-600 font-bold mt-2 block">+ {s.xp} Pontos Fidelidade</span>
                    </div>
                ))}
            </div>
        )}

        {/* ETAPA 2: DATA */}
        {step === 2 && (
            <div>
                <h2 className="text-xl font-bold mb-4">Escolha o horário</h2>
                <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                    {[...Array(10)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && booking.date.toDateString() === d.toDateString();
                        return (
                            <button key={i} onClick={() => setBooking({...booking, date: d, time: null})}
                                className={`min-w-[70px] h-[80px] rounded-xl flex flex-col items-center justify-center border flex-shrink-0 ${isSel ? 'bg-green-600 border-green-600 text-black' : 'bg-[#1A1A1A] border-[#333] text-gray-400'}`}>
                                <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                
                <div className={`grid grid-cols-4 gap-2 mt-4 ${!booking.date ? 'opacity-30 pointer-events-none' : ''}`}>
                    {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => {
                        const status = Utils.isTimeBlocked(booking.date, t);
                        return (
                            <button key={t} disabled={!!status} onClick={() => setBooking({...booking, time: t})}
                                className={`py-2 rounded-lg border text-xs font-bold relative ${booking.time === t ? 'bg-white text-black' : status ? 'opacity-30 bg-[#111]' : 'bg-[#1A1A1A] border-[#333]'}`}>
                                {t}
                                {status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}
                            </button>
                        )
                    })}
                </div>
                <button disabled={!booking.time} onClick={handleNext} className="w-full mt-8 py-3 bg-white text-black font-bold rounded-xl disabled:opacity-50">Confirmar Horário</button>
            </div>
        )}

        {/* ETAPA 3: EXTRAS */}
        {step === 3 && (
            <div>
                 <h2 className="text-xl font-bold mb-4">Turbine sua sessão</h2>
                 <div className="space-y-3 mb-8">
                     {EXTRAS.map(ex => {
                         const active = booking.extras[ex.id];
                         return (
                             <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})}
                                className={`p-4 rounded-xl border flex justify-between items-center cursor-pointer ${active ? 'bg-green-900/20 border-green-500' : 'bg-[#1A1A1A] border-[#333]'}`}>
                                <div className="flex gap-3 items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${active ? 'bg-green-500 border-green-500 text-black' : 'border-[#333] text-gray-500'}`}>{active ? <Check size={14}/> : <ex.icon size={14}/>}</div>
                                    <div><p className="font-bold text-sm text-white">{ex.label}</p><p className="text-[10px] text-gray-500">{ex.desc}</p></div>
                                </div>
                                <span className="font-bold text-xs text-green-500">+ {Utils.formatBRL(ex.price)}</span>
                             </div>
                         )
                     })}
                 </div>
                 <button onClick={handleNext} className="w-full py-3 bg-white text-black font-bold rounded-xl">Continuar</button>
            </div>
        )}

        {/* ETAPA 4: LOCAL E FINALIZAÇÃO */}
        {step === 4 && (
            <div>
                <h2 className="text-xl font-bold mb-4">Finalizando...</h2>
                
                {/* Localização */}
                <div className="flex bg-[#1A1A1A] p-1 rounded-xl mb-4">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t})} className={`flex-1 py-2 text-xs font-bold uppercase rounded-lg ${booking.locationType === t ? 'bg-[#333] text-white' : 'text-gray-500'}`}>{t}</button>
                    ))}
                </div>
                <textarea 
                    value={booking.address} onChange={e => setBooking({...booking, address: e.target.value})} 
                    placeholder={booking.locationType === 'motel' ? "Qual Motel e Suíte?" : "Endereço completo..."}
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-xl p-3 text-sm text-white h-20 resize-none focus:border-green-500 outline-none mb-4"
                />

                {/* Resumo Financeiro */}
                <div className="bg-[#1C1C1E] border border-[#333] rounded-xl p-4 mb-4">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Resumo do Pedido</p>
                    <div className="space-y-2 text-sm text-gray-300">
                        <div className="flex justify-between"><span>{booking.service?.name}</span><span>{Utils.formatBRL(booking.service?.price)}</span></div>
                        {Object.entries(booking.extras).filter(([_,v])=>v).map(([k]) => {
                             const ex = EXTRAS.find(e => e.id === k);
                             return <div key={k} className="flex justify-between text-xs text-green-500"><span>+ {ex.label}</span><span>{Utils.formatBRL(ex.price)}</span></div>
                        })}
                        
                        {/* Linha do Cupom */}
                        {booking.appliedCoupon ? (
                            <div className="flex justify-between text-green-400 font-bold py-2 border-t border-[#333] border-dashed mt-2">
                                <span className="flex items-center gap-1"><Ticket size={12}/> Cupom ({booking.appliedCoupon.label})</span>
                                <span>- {Utils.formatBRL(booking.appliedCoupon.value)}</span>
                            </div>
                        ) : (
                            <button onClick={() => setShowWallet(true)} className="w-full py-2 border border-dashed border-green-500/50 rounded-lg text-green-500 text-xs font-bold mt-2 hover:bg-green-500/10 flex items-center justify-center gap-2">
                                <Wallet size={12}/> Abrir Carteira de Cupons
                            </button>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-end mt-4 pt-4 border-t border-[#333]">
                        <span className="text-gray-400 font-bold text-sm">Total Final</span>
                        <span className="text-2xl font-black text-white">{Utils.formatBRL(total.total)}</span>
                    </div>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-500/30 p-3 rounded-xl flex gap-3 items-start mb-24">
                    <AlertTriangle size={16} className="text-yellow-500 flex-shrink-0 mt-0.5"/>
                    <p className="text-[10px] text-yellow-100">Taxa de deslocamento (Uber) <strong>não inclusa</strong>. Valor calculado e confirmado via WhatsApp.</p>
                </div>
            </div>
        )}

      </main>

      {/* FOOTER CTA */}
      {step === 4 && (
          <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 p-5 z-40 pb-safe">
              <button 
                disabled={booking.address.length < 5}
                onClick={finalizeBooking}
                className="w-full py-4 bg-green-500 text-black font-black uppercase rounded-xl disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse"
              >
                  Agendar no WhatsApp <MessageCircle size={20}/>
              </button>
          </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); } @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } } .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }`}</style>
    </div>
  );
}
