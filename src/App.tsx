import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Flower, MessageCircle,
  Bell, Tag, AlertCircle, Gift, ArrowRight, Lock, Eye, EyeOff, Share2, 
  LogOut, Copy, RefreshCw, Zap, Crown, Music, Trash2, CreditCard, Banknote, QrCode, AlertTriangle, Edit3, Plus, Info, Receipt, CheckCircle2, ThumbsUp
} from 'lucide-react';

// --- TABELA DE JUROS (ATÉ 12X) ---
// Índices: 0 (não existe), 1x, 2x, 3x... até 12x
const CARD_RATES = [
  0,        // 0x (Placeholder)
  0,        // 1x (Sem juros ou taxa da máquina à vista)
  0.0499,   // 2x
  0.0600,   // 3x
  0.0700,   // 4x
  0.0800,   // 5x
  0.0900,   // 6x
  0.1000,   // 7x
  0.1050,   // 8x
  0.1100,   // 9x
  0.1150,   // 10x
  0.1190,   // 11x
  0.1238    // 12x
];

// --- ESTILOS GLOBAIS ---
const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", sans-serif; 
  color: #E0E0E0;
  background: #000000;
  overflow-x: hidden;
}
input, select { font-size: 16px !important; } /* Evita zoom no iPhone */

/* Scroll Oculto mas funcional */
.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Classes Utilitárias Customizadas */
.glass-panel {
  background: rgba(20, 20, 20, 0.6);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.btn-press { transition: transform 0.1s; }
.btn-press:active { transform: scale(0.96); opacity: 0.8; }

.text-gold { color: #FFD700; }
.bg-gold-gradient { background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); }
.text-gold-gradient { background: linear-gradient(135deg, #FFD700 0%, #B8860B 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

.input-dark {
  background: #111;
  border: 1px solid #333;
  color: white;
  transition: all 0.3s;
}
.input-dark:focus { border-color: #0A84FF; box-shadow: 0 0 0 2px rgba(10,132,255,0.2); }

/* Animações */
@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.anim-enter { animation: slideUp 0.4s ease-out forwards; }
`;

// --- COMPONENTES AUXILIARES ---

const ReviewCard = ({ name, text, stars }) => (
  <div className="min-w-[280px] bg-[#111] p-4 rounded-2xl border border-white/5 snap-center mx-2">
    <div className="flex gap-1 mb-2">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < stars ? 'fill-[#FFD700] text-[#FFD700]' : 'text-gray-700'}`} />
      ))}
    </div>
    <p className="text-gray-300 text-sm italic mb-3">"{text}"</p>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest text-right">- {name}</p>
  </div>
);

const ServiceCard = ({ service, onClick }) => (
  <button onClick={onClick} className="w-full text-left glass-panel p-5 rounded-[24px] mb-4 btn-press relative overflow-hidden group">
    {service.highlight && (
      <div className="absolute top-0 right-0 bg-gold-gradient text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl z-10">
        {service.highlight}
      </div>
    )}
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-white group-hover:text-[#0A84FF] transition-colors">{service.name}</h3>
    </div>
    <p className="text-sm text-gray-400 leading-relaxed mb-4 w-[90%]">{service.description}</p>
    <div className="flex justify-between items-end border-t border-white/5 pt-3">
      <div className="flex flex-col">
        <span className="text-[10px] text-gray-500 uppercase font-bold">Valor Base</span>
        <span className="text-lg font-bold text-[#0A84FF]">R$ {service.basePrice},00</span>
      </div>
      <div className="bg-[#222] px-3 py-1.5 rounded-lg text-xs text-gray-300 font-medium flex items-center gap-1">
        <Clock className="w-3.5 h-3.5"/> {service.labelDuration}
      </div>
    </div>
  </button>
);

const InstallmentOption = ({ total, setSelection, selection }) => {
  return (
    <div className="mt-4 bg-[#1A1A1A] p-4 rounded-xl border border-white/10 anim-enter">
      <label className="text-xs text-gray-400 font-bold uppercase mb-2 block">Parcelamento (Simulação)</label>
      <select 
        value={selection.installments} 
        onChange={(e) => setSelection({...selection, installments: parseInt(e.target.value)})}
        className="w-full bg-[#000] text-white p-3 rounded-lg border border-white/20 outline-none appearance-none"
      >
        {CARD_RATES.map((rate, idx) => {
          if (idx === 0) return null; // Pula o index 0
          const totalWithRate = total / (1 - rate);
          const parcelValue = totalWithRate / idx;
          return (
            <option key={idx} value={idx}>
              {idx}x de {parcelValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})} {rate > 0 ? '(c/ juros)' : '(s/ juros)'}
            </option>
          );
        })}
      </select>
      <p className="text-[10px] text-gray-500 mt-2 flex items-center gap-1">
        <Info className="w-3 h-3"/> Taxas da maquininha repassadas automaticamente.
      </p>
    </div>
  );
};

// --- APLICAÇÃO ---

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showFaq, setShowFaq] = useState(false);
  
  // Dados do Usuário & App
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [loyalty, setLoyalty] = useState({ totalSpent: 0, level: 'Bronze' });
  
  // Seleção do Pedido
  const [selection, setSelection] = useState({
    service: null,
    date: null,
    time: null,
    location: null,
    useTable: null,
    city: '',
    music: null,
    upgrade: false,
    aroma: false,
    paymentMethod: null,
    installments: 1
  });

  // Refs para Scroll Automático
  const locationRef = useRef(null);
  const extrasRef = useRef(null);
  const paymentRef = useRef(null);
  const topRef = useRef(null);

  // Inicialização
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    // Tenta recuperar dados
    const saved = localStorage.getItem('thaly_user_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(prev => ({...prev, name: parsed.name, isAdult: true}));
      setLoyalty(parsed.loyalty || { totalSpent: 0, level: 'Bronze' });
    }
  }, []);

  // Scroll to Top on Step Change
  useEffect(() => {
    topRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Função Auxiliar de Scroll
  const scrollSmooth = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  // --- LÓGICA DE PREÇO (CRÍTICA) ---
  const calculateTotal = (returnDetails = false) => {
    if (!selection.service) return 0;
    
    let base = selection.service.basePrice;
    let extras = 0;
    
    // Adicionais
    if (selection.location?.fee) extras += selection.location.fee;
    if (selection.useTable) extras += 20;
    if (selection.upgrade) extras += (selection.service.basePrice * 0.5); // +50%
    if (selection.aroma) extras += 10;
    
    let subtotal = base + extras;
    let finalTotal = subtotal;
    let cardFee = 0;

    // Cálculo Cartão
    if (selection.paymentMethod === 'credit_card' && selection.installments > 1) {
      const rate = CARD_RATES[selection.installments] || 0;
      finalTotal = subtotal / (1 - rate);
      cardFee = finalTotal - subtotal;
    }

    if (returnDetails) {
      return { base, extras, subtotal, cardFee, finalTotal };
    }
    return finalTotal;
  };

  // --- HANDLERS ---
  const handleStart = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setStep(user.name ? 'services' : 'identity');
  };

  const handleIdentitySubmit = () => {
    if (user.name.length < 3 || !user.isAdult) return alert("Preencha corretamente.");
    localStorage.setItem('thaly_user_v1', JSON.stringify({ name: user.name, loyalty }));
    setStep('services');
  };

  const handleWhatsApp = () => {
    const { finalTotal, cardFee } = calculateTotal(true);
    const dateStr = selection.date ? `${selection.date.getDate()}/${selection.date.getMonth()+1}` : '';
    
    const msg = `*NOVO AGENDAMENTO VIA APP* 📱
    
👤 *Cliente:* ${user.name}
📅 *Data:* ${dateStr} às ${selection.time}
💆‍♂️ *Serviço:* ${selection.service.name}
📍 *Local:* ${selection.location.label} ${selection.city ? `(${selection.city})` : ''}

*DETALHES:*
${selection.upgrade ? '✅ +30 Minutos (Upgrade)' : '⏱️ Duração Padrão'}
${selection.useTable ? '✅ Levar Maca (+R$20)' : '🛏️ Na Cama/Sofá'}
${selection.aroma ? '✅ Aromaterapia (+R$10)' : ''}
🎵 *Vibe:* ${selection.music || 'Silêncio'}

💰 *FINANCEIRO:*
Forma: ${selection.paymentMethod === 'credit_card' ? `Cartão (${selection.installments}x)` : selection.paymentMethod}
${selection.paymentMethod === 'credit_card' ? `Taxa Maquininha: R$ ${cardFee.toFixed(2)}` : ''}
*TOTAL A PAGAR: R$ ${finalTotal.toFixed(2)}*

${selection.location.id === 'motel' ? '⚠️ *Obs:* Taxa do Motel (R$75) paga na saída pelo cliente.' : ''}

Aguardo confirmação!`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?phone=5517991360413&text=${encoded}`, '_blank');
  };

  // --- DADOS DO SISTEMA ---
  const servicesList = [
    { id: 1, name: "Massagem Masculina VIP", description: "A mais pedida. Relaxamento muscular profundo + Toque tântrico (sem tabus). Alívio total de stress.", basePrice: 115, labelDuration: "60 min", highlight: "🔥 MAIS VENDIDA" },
    { id: 2, name: "Relaxante Clássica", description: "Foco total em dores musculares, costas e pernas. Sem toques íntimos. Apenas terapêutica.", basePrice: 80, labelDuration: "50 min", highlight: null }
  ];

  const locationsList = [
    { id: 'santa-fe', label: 'Santa Fé do Sul (Domicílio)', fee: 40, hasTable: true },
    { id: 'motel', label: 'Motel (Suíte)', fee: 0, hasTable: false, alert: "Taxa da suíte paga no local" },
    { id: 'outras-cidades', label: 'Cidades Vizinhas', fee: null, hasTable: false, input: true }
  ];

  const getDays = () => {
    const days = [];
    const today = new Date();
    for(let i=0; i<7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const times = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];

  // --- RENDERIZAÇÃO ---

  return (
    <div className="h-screen w-full flex justify-center bg-black text-gray-200">
      <style>{globalStyles}</style>
      
      {/* Container Mobile */}
      <div ref={topRef} className="w-full max-w-[450px] bg-black h-full flex flex-col relative overflow-y-auto hide-scroll sm:border-x border-white/10">
        
        {/* HEADER FIXO */}
        <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-white/5">
          {step !== 'home' ? (
             <button onClick={() => setStep(step === 'configure' ? 'services' : 'home')} className="p-2 -ml-2 text-[#0A84FF] flex items-center gap-1 font-medium">
               <ChevronLeft className="w-5 h-5"/> Voltar
             </button>
          ) : (
            <div className="flex items-center gap-2">
               <Crown className="w-5 h-5 text-gold" />
               <span className="font-bold text-white tracking-wide">THALY <span className="text-[#0A84FF]">VIP</span></span>
            </div>
          )}
          <div className="flex gap-3">
             <button onClick={() => setPrivacyMode(!privacyMode)} className="p-2 text-gray-500 hover:text-white">
                {privacyMode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
             </button>
             <button onClick={() => setShowFaq(true)} className="p-2 text-gray-500 hover:text-white">
                <HelpCircle className="w-5 h-5"/>
             </button>
          </div>
        </div>

        {/* LOADING SCREEN */}
        {loading && (
          <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center">
             <div className="w-16 h-16 border-4 border-[#0A84FF] border-t-transparent rounded-full animate-spin mb-4"/>
             <p className="text-xs font-bold tracking-[0.3em] text-gray-500">CARREGANDO...</p>
          </div>
        )}

        {/* --- STEP: HOME --- */}
        {step === 'home' && (
          <div className="p-6 pb-24 anim-enter">
            {/* Status Card */}
            <div className="glass-panel p-6 rounded-[30px] mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-20"><Crown className="w-24 h-24 text-white"/></div>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Bem-vindo, {user.name || 'Visitante'}</p>
               <h1 className="text-3xl font-bold text-white mb-4">Seu Momento <br/><span className="text-gold-gradient">Relax</span></h1>
               
               <div className="flex items-center gap-4 mt-6">
                 <div>
                    <p className="text-[10px] text-gray-500 uppercase">Investido</p>
                    <p className={`text-xl font-mono text-white ${privacyMode ? 'blur-md' : ''}`}>
                       R$ {loyalty.totalSpent},00
                    </p>
                 </div>
                 <div className="h-8 w-[1px] bg-white/10"/>
                 <div>
                    <p className="text-[10px] text-gray-500 uppercase">Nível</p>
                    <p className="text-xl font-bold text-[#CD7F32] flex items-center gap-1">{loyalty.level}</p>
                 </div>
               </div>
            </div>

            {/* Live Ticker */}
            <div className="flex justify-center mb-8">
               <div className="bg-[#111] border border-white/10 rounded-full px-4 py-1.5 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/>
                  <span className="text-[10px] uppercase font-bold text-gray-400">Agenda de hoje quase cheia</span>
               </div>
            </div>

            {/* Avaliações (Horizontal Scroll Snap) */}
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 ml-2">Últimas Experiências</h3>
            <div className="flex overflow-x-auto snap-x hide-scroll pb-4 -mx-6 px-6 mb-8">
               <ReviewCard name="Carlos, 45" text="O sigilo e a qualidade da massagem são impecáveis. Virei cliente fixo." stars={5}/>
               <ReviewCard name="Anônimo" text="Tirou todo o peso das minhas costas. Mão muito firme e técnica." stars={5}/>
               <ReviewCard name="Ricardo M." text="Ótimo atendimento. A maca portátil é muito confortável." stars={5}/>
            </div>

            {/* CTA */}
            <button onClick={handleStart} className="w-full bg-[#0A84FF] hover:bg-[#007AFF] text-white font-bold h-16 rounded-2xl text-lg shadow-[0_4px_20px_rgba(10,132,255,0.3)] btn-press flex items-center justify-center gap-2">
               AGENDAR AGORA <ArrowRight className="w-5 h-5"/>
            </button>
          </div>
        )}

        {/* --- STEP: IDENTITY --- */}
        {step === 'identity' && (
           <div className="p-8 pt-12 anim-enter h-full flex flex-col">
              <h2 className="text-2xl font-bold text-white mb-2">Identificação</h2>
              <p className="text-gray-400 text-sm mb-8">Para manter o ambiente seguro e exclusivo.</p>
              
              <div className="flex-1 space-y-6">
                 <div>
                    <label className="text-xs text-[#0A84FF] font-bold uppercase mb-2 block">Seu Nome / Apelido</label>
                    <input 
                      value={user.name} 
                      onChange={e => setUser({...user, name: e.target.value})}
                      className="w-full input-dark p-4 rounded-xl text-lg outline-none"
                      placeholder="Como quer ser chamado?"
                      autoFocus
                    />
                 </div>
                 
                 <button onClick={() => setUser({...user, isAdult: !user.isAdult})} className={`w-full p-4 rounded-xl border flex items-center gap-3 transition-all ${user.isAdult ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-white/10 bg-[#111]'}`}>
                    <div className={`w-6 h-6 rounded border flex items-center justify-center ${user.isAdult ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
                       {user.isAdult && <Check className="w-4 h-4 text-white"/>}
                    </div>
                    <span className="text-sm text-gray-300">Declaro ser maior de 18 anos.</span>
                 </button>
              </div>

              <button onClick={handleIdentitySubmit} className="w-full bg-white text-black font-bold h-14 rounded-xl mt-auto mb-4 btn-press">
                 Continuar
              </button>
           </div>
        )}

        {/* --- STEP: SERVICES --- */}
        {step === 'services' && (
           <div className="p-6 anim-enter">
              <h2 className="text-2xl font-bold text-white mb-6">Escolha a Experiência</h2>
              {servicesList.map(s => (
                 <ServiceCard key={s.id} service={s} onClick={() => { setSelection({...selection, service: s}); setStep('configure'); }} />
              ))}
           </div>
        )}

        {/* --- STEP: CONFIGURE --- */}
        {step === 'configure' && selection.service && (
           <div className="p-6 pb-40 anim-enter">
              
              {/* Resumo Topo */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <h2 className="text-xl font-bold text-white">{selection.service.name}</h2>
                 <span className="text-[#0A84FF] font-bold">R$ {selection.service.basePrice}</span>
              </div>

              {/* 1. Data */}
              <section className="mb-8">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Calendar className="w-4 h-4"/> 1. Data e Hora</h3>
                 <div className="flex gap-2 overflow-x-auto hide-scroll pb-2 mb-4">
                    {getDays().map((d, i) => {
                       const isSelected = selection.date?.toDateString() === d.toDateString();
                       const label = i === 0 ? 'HOJE' : i === 1 ? 'AMANHÃ' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).toUpperCase();
                       return (
                          <button key={i} onClick={() => setSelection({...selection, date: d, time: null})} className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${isSelected ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                             <span className="text-[10px] font-black">{label}</span>
                             <span className="text-2xl font-bold">{d.getDate()}</span>
                          </button>
                       )
                    })}
                 </div>
                 {selection.date && (
                    <div className="grid grid-cols-4 gap-2 anim-enter">
                       {times.map(t => {
                          const isBlocked = selection.date.getDate() === new Date().getDate() && parseInt(t) <= new Date().getHours();
                          return (
                             <button key={t} disabled={isBlocked} onClick={() => { setSelection({...selection, time: t}); scrollSmooth(locationRef); }} className={`py-2 rounded-lg text-sm font-bold border ${selection.time === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : isBlocked ? 'opacity-20 cursor-not-allowed border-transparent' : 'border-white/10 text-gray-400'}`}>
                                {t}
                             </button>
                          )
                       })}
                    </div>
                 )}
              </section>

              {/* 2. Local */}
              <section className="mb-8" ref={locationRef}>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><MapPin className="w-4 h-4"/> 2. Local</h3>
                 <div className="space-y-3">
                    {locationsList.map(l => (
                       <div key={l.id} onClick={() => { setSelection({...selection, location: l, useTable: null}); if(!l.input) scrollSmooth(extrasRef); }}
                          className={`p-4 rounded-xl border cursor-pointer transition-all ${selection.location?.id === l.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#111] border-white/10 hover:border-white/30'}`}>
                          <div className="flex justify-between items-center">
                             <span className={`font-bold ${selection.location?.id === l.id ? 'text-white' : 'text-gray-400'}`}>{l.label}</span>
                             {l.fee !== null && l.fee > 0 && <span className="text-xs bg-white/10 px-2 py-1 rounded text-white">+R$ {l.fee}</span>}
                          </div>
                          {l.alert && <p className="text-[10px] text-[#FFD700] mt-1 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> {l.alert}</p>}
                          
                          {/* Input Cidade */}
                          {l.input && selection.location?.id === l.id && (
                             <input 
                               value={selection.city} 
                               onChange={(e) => setSelection({...selection, city: e.target.value})} 
                               placeholder="Qual cidade?" 
                               className="w-full mt-3 bg-black border border-white/20 p-3 rounded-lg text-white outline-none focus:border-[#0A84FF]"
                               autoFocus
                             />
                          )}

                          {/* Opção Maca */}
                          {l.hasTable && selection.location?.id === l.id && (
                             <div className="mt-4 grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                                <button onClick={(e) => { e.stopPropagation(); setSelection({...selection, useTable: false}); scrollSmooth(extrasRef); }} className={`p-3 rounded-lg text-xs font-bold border ${selection.useTable === false ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500'}`}>NA CAMA</button>
                                <button onClick={(e) => { e.stopPropagation(); setSelection({...selection, useTable: true}); scrollSmooth(extrasRef); }} className={`p-3 rounded-lg text-xs font-bold border ${selection.useTable === true ? 'bg-white text-black border-white' : 'border-white/10 text-gray-500'}`}>LEVAR MACA (+20)</button>
                             </div>
                          )}
                       </div>
                    ))}
                 </div>
              </section>

              {/* 3. Extras */}
              <section className="mb-8" ref={extrasRef}>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Plus className="w-4 h-4"/> 3. Turbine a Sessão</h3>
                 <div className="space-y-3">
                    <button onClick={() => setSelection({...selection, upgrade: !selection.upgrade})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.upgrade ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#111] border-white/10'}`}>
                       <div className="text-left">
                          <p className="font-bold text-white text-sm">Extensão (+30 min)</p>
                          <p className="text-[11px] text-gray-500">Massagem mais longa e detalhada.</p>
                       </div>
                       <span className="text-[#0A84FF] font-bold text-sm">+R$ {(selection.service.basePrice * 0.5).toFixed(0)}</span>
                    </button>
                    
                    <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex justify-between items-center ${selection.aroma ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#111] border-white/10'}`}>
                       <div className="text-left">
                          <p className="font-bold text-white text-sm">Aromaterapia</p>
                          <p className="text-[11px] text-gray-500">Óleos essenciais para imersão.</p>
                       </div>
                       <span className="text-[#0A84FF] font-bold text-sm">+R$ 10</span>
                    </button>

                    <div className="pt-2">
                       <p className="text-[11px] text-gray-400 mb-2">Vibe Sonora:</p>
                       <div className="flex gap-2">
                          {['Silêncio', 'Lounge', 'Natureza'].map(m => (
                             <button key={m} onClick={() => { setSelection({...selection, music: m}); scrollSmooth(paymentRef); }} className={`px-4 py-2 rounded-lg text-xs font-bold border ${selection.music === m ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                                {m}
                             </button>
                          ))}
                       </div>
                    </div>
                 </div>
              </section>

              {/* 4. Pagamento */}
              <section className="mb-8" ref={paymentRef}>
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Banknote className="w-4 h-4"/> 4. Pagamento</h3>
                 <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => setSelection({...selection, paymentMethod: 'pix'})} className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod === 'pix' ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                       <QrCode className="w-6 h-6"/>
                       <span className="text-[10px] font-black">PIX</span>
                    </button>
                    <button onClick={() => setSelection({...selection, paymentMethod: 'cash'})} className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod === 'cash' ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                       <Banknote className="w-6 h-6"/>
                       <span className="text-[10px] font-black">DINHEIRO</span>
                    </button>
                    <button onClick={() => setSelection({...selection, paymentMethod: 'credit_card'})} className={`h-20 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod === 'credit_card' ? 'bg-white text-black border-white' : 'bg-[#111] border-white/10 text-gray-500'}`}>
                       <CreditCard className="w-6 h-6"/>
                       <span className="text-[10px] font-black">CARTÃO</span>
                    </button>
                 </div>
                 
                 {/* Parcelamento Lógica 12x */}
                 {selection.paymentMethod === 'credit_card' && (
                    <InstallmentOption 
                      total={calculateTotal(true).subtotal} 
                      selection={selection} 
                      setSelection={setSelection}
                    />
                 )}
              </section>

           </div>
        )}

        {/* --- FOOTER FLUTUANTE --- */}
        {step === 'configure' && (
           <div className="fixed bottom-0 w-full max-w-[450px] z-40">
              <div className="h-10 bg-gradient-to-t from-black to-transparent pointer-events-none"/>
              <div className="bg-[#111] border-t border-white/10 p-5 rounded-t-[30px] shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">
                 <div className="flex justify-between items-end mb-4">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Total Previsto</span>
                       <span className="text-3xl font-bold text-white tracking-tighter">
                          R$ {calculateTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                       </span>
                    </div>
                    {selection.location?.id === 'motel' && <span className="text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded font-bold">+ Motel à parte</span>}
                 </div>
                 
                 <button 
                    disabled={!selection.date || !selection.time || !selection.location || !selection.paymentMethod}
                    onClick={handleWhatsApp}
                    className="w-full h-14 bg-[#0A84FF] hover:bg-[#007AFF] disabled:bg-[#333] disabled:text-gray-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 btn-press transition-all"
                 >
                    {(!selection.date || !selection.time) ? 'Escolha Data/Hora' : 'CONFIRMAR AGENDAMENTO'} 
                    {selection.date && selection.time && <MessageCircle className="w-5 h-5"/>}
                 </button>
              </div>
           </div>
        )}

        {/* --- MODAL AJUDA --- */}
        {showFaq && (
           <div className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-xl p-8 flex flex-col justify-center anim-enter">
              <h3 className="text-2xl font-bold text-white mb-6">Ajuda & Termos</h3>
              <ul className="space-y-4 text-sm text-gray-300 list-disc pl-5 mb-8">
                 <li>Pagamentos via Pix, Dinheiro ou Cartão (até 12x).</li>
                 <li>Atendimento em Domicílio ou Motéis (taxa da suíte por conta do cliente).</li>
                 <li>Sigilo absoluto garantido.</li>
                 <li>Não realizamos atos sexuais. Massagem terapêutica e tântrica profissional.</li>
              </ul>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="p-4 rounded-xl border border-red-500/30 text-red-500 flex items-center gap-2 justify-center mb-4">
                 <Trash2 className="w-4 h-4"/> Reiniciar Aplicativo (Reset)
              </button>
              <button onClick={() => setShowFaq(false)} className="bg-white text-black font-bold h-12 rounded-xl">Voltar</button>
           </div>
        )}

      </div>
    </div>
  );
}
