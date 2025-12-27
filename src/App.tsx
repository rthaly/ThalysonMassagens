import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, MessageCircle,
  Bell, ArrowRight, Eye, EyeOff, Share2, Crown, Music, Trash2, 
  CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, CheckCircle2
} from 'lucide-react';

// --- CONFIGURAÇÕES GERAIS ---
const CARD_RATES = [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238];

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Masculina', 
    description: 'Relaxamento profundo + Toque tântrico terapêutico. Alívio de tensão e energização.', 
    basePrice: 115, duration: '60 min', highlight: '🔥 MAIS PEDIDA' 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', 
    description: 'Terapêutica clássica. Foco em dores musculares, costas e pernas (Sem toques íntimos).', 
    basePrice: 80, duration: '60 min', highlight: null 
  }
];

const LOCATIONS_DB = [
  { id: 'santa-fe', label: 'Santa Fé do Sul (Domicílio)', fee: 40, type: 'home' },
  { id: 'motel', label: 'Suíte Privada (Motel)', fee: 75, type: 'motel' }, // Taxa de 75 inclusa na soma
  { id: 'outras', label: 'Cidades Vizinhas', fee: 0, type: 'other' }
];

const REVIEWS_DATA = [
  { name: "Anônimo", text: "Profissionalismo raro. Sigilo total.", stars: 5 },
  { name: "Ricardo, 42", text: "Mão firme, tirou todo o stress.", stars: 5 },
  { name: "Cliente VIP", text: "A melhor massagem da região.", stars: 5 },
  { name: "M.S.", text: "Ambiente do motel foi perfeito.", stars: 5 }
];

// --- ESTILOS CSS (Injetados) ---
const styles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; }
.hide-scroll::-webkit-scrollbar { display: none; }
.glass { background: rgba(20, 20, 20, 0.7); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08); }
.gold-text { background: linear-gradient(135deg, #FFD700 0%, #FDB931 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.input-dark { background: #111; border: 1px solid #333; color: white; outline: none; transition: 0.3s; }
.input-dark:focus { border-color: #0A84FF; }
.btn-primary { background: linear-gradient(180deg, #0A84FF 0%, #0056B3 100%); box-shadow: 0 4px 15px rgba(10, 132, 255, 0.3); }
.btn-primary:active { transform: scale(0.98); }
.anim-fade { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
`;

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(true); // Começa oculto
  const [showFaq, setShowFaq] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);

  // Estado do Usuário (Persistente na sessão)
  const [user, setUser] = useState({ name: '', isAdult: false, isLiberado: false });
  const [loyalty, setLoyalty] = useState({ spent: 0, level: 'Bronze' });
  
  // Estado do Pedido Atual
  const [selection, setSelection] = useState({
    service: null, date: null, time: '', location: null, 
    useTable: false, city: '', music: 'Silêncio', upgrade: false, aroma: false, 
    paymentMethod: null, installments: 1, coupon: null
  });

  // Refs
  const scrollRef = useRef(null);

  // Inicialização
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    // Timer das avaliações
    const timer = setInterval(() => {
      setReviewIdx(prev => (prev + 1) % REVIEWS_DATA.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scrollToTop = () => scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  // --- LÓGICA FINANCEIRA ---
  const calculateTotal = () => {
    if (!selection.service) return 0;

    let base = selection.service.basePrice; // Valor do serviço
    let extras = 0;
    let motelFee = 0;

    // Adicionais
    if (selection.upgrade) extras += (selection.service.basePrice * 0.5);
    if (selection.aroma) extras += 10;
    if (selection.location?.type === 'home' && selection.location.fee) extras += selection.location.fee;
    if (selection.useTable) extras += 20;
    
    // Taxa Motel (Separada para lógica visual, mas somada no total)
    if (selection.location?.type === 'motel') {
       motelFee = 75; 
    }

    let subtotal = base + extras + motelFee;
    let discount = 0;

    // Cupom (Exemplo simples)
    if (selection.coupon === 'VIP') discount = subtotal * 0.10;

    let finalTotal = subtotal - discount;
    let cardFee = 0;

    // Taxa Cartão
    if (selection.paymentMethod === 'credit_card' && selection.installments > 1) {
       const rate = CARD_RATES[selection.installments] || 0;
       const totalWithRate = finalTotal / (1 - rate);
       cardFee = totalWithRate - finalTotal;
       finalTotal = totalWithRate;
    }

    return { 
      baseService: base, 
      extras, 
      motelFee, 
      subtotal, 
      discount, 
      finalTotal, 
      cardFee 
    };
  };

  // --- ENVIAR WHATSAPP ---
  const handleWhatsApp = () => {
    const totals = calculateTotal();
    const bookingId = Math.random().toString(36).substr(2, 4).toUpperCase();
    const isToday = selection.date?.getDate() === new Date().getDate();
    const dateStr = selection.date ? selection.date.toLocaleDateString('pt-BR') : '';
    
    let durationText = selection.service.duration;
    if (selection.upgrade) durationText += " + 30 min (90 min total)";

    let locationText = selection.location.label;
    if (selection.city) locationText += ` (${selection.city})`;

    let paymentText = selection.paymentMethod === 'pix' ? 'Pix' : 
                      selection.paymentMethod === 'cash' ? 'Dinheiro' : 
                      `Cartão (${selection.installments}x)`;

    // Construção da Mensagem Exata
    const msg = `✨ NOVO PEDIDO: #${bookingId}
👤 Cliente: ${user.name}
✅ Maior de 18 | ✅ Liberado p/ Massagem
📅 ${dateStr} ${isToday ? '(HOJE)' : ''} às ${selection.time}
💆 ${selection.service.name}
⏱ Duração: ${durationText}
📍 Local: ${locationText}
${selection.aroma ? '🌸 Com Aromaterapia' : ''}
${selection.useTable ? '🛏️ Com Maca Portátil (+R$20)' : ''}
${selection.upgrade ? '⏳ Tempo Extra (+30min)' : ''}

💰 RESUMO FINANCEIRO:
➡️ Serviço Massagista: ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totals.baseService + totals.extras)}
${totals.motelFee > 0 ? `⚠️ Taxa da Suíte: R$ 75,00 (Pagar na SAÍDA)` : ''}
${totals.discount > 0 ? `🎫 Desconto Cupom: -${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totals.discount)}` : ''}
${totals.cardFee > 0 ? `💳 Taxa Máquina: ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totals.cardFee)}` : ''}

💰 TOTAL PREVISTO: ${new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totals.finalTotal)} (${paymentText})
⏱️ Chegada estimada: 10-15 min
------------------------------
Olá, aguardo confirmação para relaxar. (Via App Beta)`;

    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`, '_blank');
    
    // Atualizar Loyalty simulado e ir para sucesso
    setLoyalty(prev => ({...prev, spent: prev.spent + totals.finalTotal}));
    setStep('success');
  };

  const resetBooking = () => {
    setSelection({
      service: null, date: null, time: '', location: null, 
      useTable: false, city: '', music: 'Silêncio', upgrade: false, aroma: false, 
      paymentMethod: null, installments: 1, coupon: null
    });
    setStep('home');
  };

  // --- RENDERIZAÇÃO ---
  return (
    <div className="h-screen w-full flex justify-center bg-black text-gray-100">
      <style>{styles}</style>
      
      {/* Container Mobile */}
      <div ref={scrollRef} className="w-full max-w-[430px] bg-black h-full flex flex-col relative overflow-y-auto hide-scroll sm:border-x border-white/10">
        
        {/* HEADER */}
        <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-md px-5 py-4 flex justify-between items-center border-b border-white/10">
          {step === 'home' || step === 'success' ? (
             <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#FFD700]" />
                <span className="font-bold text-lg tracking-tight">Thalyson <span className="gold-text">Massagens</span></span>
             </div>
          ) : (
             <button onClick={() => { setStep(step === 'configure' ? 'services' : 'home'); scrollToTop(); }} className="flex items-center text-[#0A84FF] font-medium">
               <ChevronLeft className="w-5 h-5"/> Voltar
             </button>
          )}
          
          <div className="flex items-center gap-3">
             <button onClick={() => setPrivacyMode(!privacyMode)} className="text-gray-400 hover:text-white">
                {privacyMode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
             </button>
             <button onClick={() => setShowFaq(true)} className="text-gray-400 hover:text-white">
                <HelpCircle className="w-5 h-5"/>
             </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center">
             <div className="w-12 h-12 border-4 border-[#0A84FF] border-t-transparent rounded-full animate-spin mb-4"/>
             <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Carregando App...</span>
          </div>
        )}

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="p-6 pb-24 anim-fade">
             {/* Loyalty Card */}
             <div className="glass p-6 rounded-[24px] mb-6 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Investido</p>
                      <p className={`text-2xl font-bold text-white mt-1 ${privacyMode ? 'blur-md' : ''}`}>
                         R$ {loyalty.spent},00
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nível</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                         <span className="text-[#FFD700] font-bold text-lg">{loyalty.level}</span>
                         <Crown className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                      </div>
                   </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#0056B3]" style={{ width: '35%' }}></div>
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right">Faltam R$ 200 para Prata</p>
             </div>

             {/* Links Rápidos */}
             <div className="flex gap-3 mb-8">
                <button onClick={() => setShowFaq(true)} className="flex-1 bg-[#111] border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                   <Shield className="w-4 h-4"/> Conduta
                </button>
                <a href="https://instagram.com/thalymassagens" target="_blank" className="flex-1 bg-[#111] border border-white/10 p-3 rounded-xl flex items-center justify-center gap-2 text-sm font-medium text-[#E1306C]">
                   <Instagram className="w-4 h-4"/> Instagram
                </a>
             </div>

             {/* Avaliações Dinâmicas */}
             <div className="mb-8 min-h-[100px]">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">O que dizem</h3>
                <div className="glass p-4 rounded-xl border-l-4 border-[#0A84FF] anim-fade key={reviewIdx}">
                   <div className="flex gap-1 mb-2 text-[#FFD700]">
                      {[...Array(REVIEWS_DATA[reviewIdx].stars)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current"/>)}
                   </div>
                   <p className="text-sm text-gray-300 italic mb-2">"{REVIEWS_DATA[reviewIdx].text}"</p>
                   <p className="text-xs font-bold text-gray-500 uppercase text-right">- {REVIEWS_DATA[reviewIdx].name}</p>
                </div>
             </div>

             <button onClick={() => { setStep(user.name ? 'services' : 'identity'); scrollToTop(); }} className="w-full btn-primary h-14 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center gap-2">
                AGENDAR AGORA <ArrowRight className="w-5 h-5"/>
             </button>
          </div>
        )}

        {/* --- IDENTITY --- */}
        {step === 'identity' && (
          <div className="p-8 pt-12 anim-fade h-full flex flex-col">
             <h2 className="text-2xl font-bold text-white mb-2">Identificação</h2>
             <p className="text-gray-400 text-sm mb-6">Para sua segurança e confirmação.</p>

             <div className="space-y-4">
                <div>
                   <label className="text-xs text-[#0A84FF] font-bold uppercase mb-2 block">Seu Nome</label>
                   <input 
                      value={user.name} 
                      onChange={e => setUser({...user, name: e.target.value})}
                      className="w-full input-dark p-4 rounded-xl text-lg"
                      placeholder="Ex: Ricardo"
                      autoFocus
                   />
                </div>

                <div className="bg-[#111] p-4 rounded-xl border border-white/10 space-y-3">
                   <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className="flex items-center gap-3 w-full text-left">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                         {user.isAdult && <Check className="w-3 h-3 text-white"/>}
                      </div>
                      <span className="text-sm text-gray-300">Sou maior de 18 anos</span>
                   </button>

                   <button onClick={() => setUser({...user, isLiberado: !user.isLiberado})} className="flex items-center gap-3 w-full text-left">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${user.isLiberado ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                         {user.isLiberado && <Check className="w-3 h-3 text-white"/>}
                      </div>
                      <span className="text-sm text-gray-300">Liberado p/ Massagem</span>
                   </button>
                </div>

                {/* Botão Próximo aos Inputs */}
                <button 
                  disabled={!user.name || !user.isAdult || !user.isLiberado}
                  onClick={() => { setStep('services'); scrollToTop(); }} 
                  className="w-full btn-primary h-12 rounded-xl text-white font-bold mt-2 disabled:opacity-50 disabled:grayscale"
                >
                   Continuar
                </button>
             </div>
          </div>
        )}

        {/* --- SERVICES --- */}
        {step === 'services' && (
           <div className="p-6 anim-fade">
              <h2 className="text-2xl font-bold text-white mb-6">Escolha o Serviço</h2>
              <div className="space-y-4">
                 {SERVICES_DB.map(s => (
                    <div key={s.id} onClick={() => { setSelection({...selection, service: s}); setStep('configure'); scrollToTop(); }} 
                         className="glass p-5 rounded-[20px] relative overflow-hidden active:scale-[0.98] transition-all">
                       {s.highlight && <div className="absolute top-0 right-0 bg-[#FFD700] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{s.highlight}</div>}
                       <h3 className="text-xl font-bold text-white mb-1">{s.name}</h3>
                       <p className="text-sm text-gray-400 mb-4 pr-2">{s.description}</p>
                       <div className="flex justify-between items-end border-t border-white/10 pt-3">
                          <span className="text-lg font-bold text-[#0A84FF]">R$ {s.basePrice},00</span>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300 flex items-center gap-1"><Clock className="w-3 h-3"/> {s.duration}</span>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* --- CONFIGURE --- */}
        {step === 'configure' && selection.service && (
           <div className="p-6 pb-44 anim-fade">
              <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">{selection.service.name}</h2>

              {/* 1. DATA */}
              <section className="mb-8">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Data e Hora</h3>
                 <div className="flex gap-2 overflow-x-auto hide-scroll mb-3">
                    {[0,1,2,3,4].map(i => {
                       const d = new Date(); d.setDate(d.getDate() + i);
                       const isSel = selection.date?.toDateString() === d.toDateString();
                       return (
                          <button key={i} onClick={() => setSelection({...selection, date: d, time: ''})} 
                             className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                             <span className="text-[10px] font-black">{i === 0 ? 'HOJE' : i === 1 ? 'AMANHÃ' : d.getDate()}</span>
                             <span className="text-xl font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).toUpperCase().slice(0,3)}</span>
                          </button>
                       )
                    })}
                 </div>
                 {selection.date && (
                    <div className="grid grid-cols-4 gap-2 anim-fade">
                       {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                          const blocked = selection.date.getDate() === new Date().getDate() && parseInt(t) <= new Date().getHours();
                          return (
                             <button key={t} disabled={blocked} onClick={() => setSelection({...selection, time: t})} 
                                className={`py-2 rounded-lg text-sm font-bold border ${selection.time === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : blocked ? 'opacity-20 cursor-not-allowed border-transparent' : 'border-white/10 text-gray-400'}`}>
                                {t}
                             </button>
                          )
                       })}
                    </div>
                 )}
              </section>

              {/* 2. LOCAL */}
              <section className="mb-8">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Local</h3>
                 <div className="space-y-3">
                    {LOCATIONS_DB.map(l => (
                       <div key={l.id} onClick={() => setSelection({...selection, location: l, useTable: false})} 
                          className={`p-4 rounded-xl border cursor-pointer ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#111] border-white/10'}`}>
                          <div className="flex justify-between">
                             <span className={`font-bold ${selection.location?.id === l.id ? 'text-white' : 'text-gray-400'}`}>{l.label}</span>
                             {l.fee > 0 && <span className="text-xs font-bold text-[#FFD700]">+R$ {l.fee}</span>}
                          </div>
                          
                          {/* Opções Específicas */}
                          {selection.location?.id === l.id && l.id === 'motel' && (
                             <p className="text-[10px] text-[#FFD700] mt-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Taxa paga na saída do motel.</p>
                          )}
                          {selection.location?.id === l.id && l.id === 'outras' && (
                             <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="w-full mt-2 input-dark p-2 rounded-lg text-sm"/>
                          )}
                          {selection.location?.id === l.id && l.type === 'home' && (
                             <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-white/5">
                                <button onClick={(e) => {e.stopPropagation(); setSelection({...selection, useTable: false})}} className={`p-2 rounded text-xs border ${!selection.useTable ? 'bg-white text-black border-white' : 'border-white/10'}`}>Na Cama</button>
                                <button onClick={(e) => {e.stopPropagation(); setSelection({...selection, useTable: true})}} className={`p-2 rounded text-xs border ${selection.useTable ? 'bg-white text-black border-white' : 'border-white/10'}`}>Levar Maca (+20)</button>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </section>

              {/* 3. EXTRAS */}
              <section className="mb-8">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Plus className="w-4 h-4"/> Extras</h3>
                 <div className="space-y-3">
                    <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.upgrade ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#111] border-white/10'}`}>
                       <span className="font-bold text-sm text-white">Mais Tempo (+30 min)</span>
                       <span className="text-[#0A84FF] font-bold text-sm">+R$ {(selection.service.basePrice * 0.5).toFixed(0)}</span>
                    </button>
                    <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.aroma ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#111] border-white/10'}`}>
                       <span className="font-bold text-sm text-white">Aromaterapia</span>
                       <span className="text-[#0A84FF] font-bold text-sm">+R$ 10</span>
                    </button>
                 </div>
              </section>

              {/* 4. PAGAMENTO */}
              <section>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Banknote className="w-4 h-4"/> Pagamento</h3>
                 <div className="grid grid-cols-3 gap-2">
                    {['pix', 'cash', 'credit_card'].map(m => (
                       <button key={m} onClick={() => setSelection({...selection, paymentMethod: m})} className={`h-16 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod === m ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                          <span className="text-[10px] font-black uppercase">{m === 'credit_card' ? 'Cartão' : m === 'cash' ? 'Dinheiro' : 'Pix'}</span>
                       </button>
                    ))}
                 </div>
                 {selection.paymentMethod === 'credit_card' && (
                    <select onChange={(e) => setSelection({...selection, installments: Number(e.target.value)})} className="w-full mt-3 bg-[#111] text-white p-3 rounded-xl border border-white/10 outline-none">
                       {CARD_RATES.map((r, i) => i > 0 && (
                          <option key={i} value={i} className="text-black">{i}x de {((calculateTotal().finalTotal / (1-r)) / i).toLocaleString('pt-BR', {style:'currency', currency:'BRL'})}</option>
                       ))}
                    </select>
                 )}
              </section>

           </div>
        )}

        {/* --- FOOTER FLUTUANTE --- */}
        {step === 'configure' && (
           <div className="fixed bottom-0 w-full max-w-[430px] z-40 bg-[#111] border-t border-white/10 p-5 rounded-t-[24px] shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
              <div className="flex justify-between items-end mb-4">
                 <div className="flex flex-col">
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Previsto</span>
                    <span className="text-3xl font-bold text-white tracking-tighter">
                       R$ {new Intl.NumberFormat('pt-BR', {minimumFractionDigits: 2}).format(calculateTotal().finalTotal)}
                    </span>
                 </div>
                 {selection.location?.id === 'motel' && <span className="text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded font-bold">Inc. Taxa Motel</span>}
              </div>
              <button 
                 disabled={!selection.date || !selection.time || !selection.location || !selection.paymentMethod}
                 onClick={handleWhatsApp}
                 className="w-full h-14 bg-[#0A84FF] hover:bg-[#007AFF] disabled:bg-[#333] disabled:text-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                 {(!selection.date || !selection.time) ? 'Selecione Data' : 'CONFIRMAR NO WHATSAPP'}
                 <MessageCircle className="w-5 h-5"/>
              </button>
           </div>
        )}

        {/* --- TELA DE SUCESSO --- */}
        {step === 'success' && (
           <div className="h-full flex flex-col items-center justify-center p-8 text-center anim-fade">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                 <CheckCircle2 className="w-12 h-12 text-white"/>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Pedido Gerado!</h2>
              <p className="text-gray-400 mb-8 max-w-[250px]">Você foi redirecionado para o WhatsApp. Aguarde a confirmação do Thalyson.</p>
              
              <div className="bg-[#111] p-4 rounded-xl border border-white/10 w-full mb-8">
                 <p className="text-xs text-gray-500 uppercase mb-1">Seu Status VIP</p>
                 <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                    <div className="h-full bg-[#0A84FF]" style={{width: '40%'}}></div>
                 </div>
                 <p className="text-sm font-bold text-white">Subiu de nível!</p>
              </div>

              <button onClick={resetBooking} className="w-full btn-primary h-14 rounded-xl text-white font-bold">
                 Voltar ao Início
              </button>
           </div>
        )}

        {/* --- FAQ --- */}
        {showFaq && (
           <div className="absolute inset-0 z-[60] bg-black/95 p-8 flex flex-col justify-center anim-fade">
              <h3 className="text-2xl font-bold text-white mb-6">Conduta & Termos</h3>
              <ul className="space-y-4 text-sm text-gray-300 list-disc pl-5 mb-8">
                 <li>Sigilo total garantido.</li>
                 <li>Apenas massagem terapêutica/tântrica.</li>
                 <li>Respeito é obrigatório.</li>
                 <li>Pagamento via Pix, Dinheiro ou Cartão.</li>
              </ul>
              <button onClick={() => setShowFaq(false)} className="bg-white text-black font-bold h-12 rounded-xl">Fechar</button>
           </div>
        )}

      </div>
    </div>
  );
}
