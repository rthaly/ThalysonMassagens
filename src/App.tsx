import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ArrowRight, Check, MapPin, Calendar, Clock,
  Star, Bell, Zap, Crown, CreditCard, Banknote, QrCode, 
  Info, MessageCircle, Heart, Wind, Sparkles, Eye, EyeOff, Flame, Droplets
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO (APENAS 2 SERVIÇOS DETALHADOS)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413", 
  PRICES: { 
    TOUCH: 55, 
    AROMA: 15, 
    UPGRADE_TIME_PCT: 0.4 
  }
};

// SIMPLIFICADO: APENAS AS DUAS PRINCIPAIS
const SERVICES = [
  { 
    id: 'relax', 
    name: 'Relaxante Premium', 
    tag: 'TIRA DORES', 
    desc: 'Protocolo focado 100% em alívio muscular e tensão. Ideal para quem treina pesado ou trabalha muito sentado.', 
    duration: '60 min', 
    price: 130, 
    vibe: '🌿 Zen',
    features: ['Corpo Todo', 'Óleos Neutros', 'Foco nas Costas', 'Zero Sensual']
  },
  { 
    id: 'tantra', 
    name: 'Experiência Tântrica', 
    tag: 'A MAIS PEDIDA 🔥', 
    desc: 'A fusão perfeita. Começa com relaxamento profundo e evolui para uma conexão sensorial intensa e vibrante.', 
    duration: '60 min', 
    price: 180, 
    vibe: '🔥 Intensa',
    features: ['Relaxante + Tântrica', 'Toque Sensitivo', 'Finalização', 'Conexão Total']
  }
];

const LEVELS = [
  { name: 'Bronze', min: 0, icon: '🥉', perk: "Acesso ao App" },
  { name: 'Prata', min: 400, icon: '🥈', perk: "Aroma 50% OFF" },
  { name: 'Ouro', min: 900, icon: '🥇', perk: "Aroma GRÁTIS" },
  { name: 'Diamante', min: 1800, icon: '💎', perk: "Prioridade Total" },
];

const REVIEWS = [
  { t: "A Tântrica é outro nível. Saí renovado.", a: "M. (Santa Fé)", r: 5 },
  { t: "Gostei que a Relaxante realmente tira a dor. Profissional.", a: "Pedro", r: 5 },
  { t: "O ambiente que ele cria é surreal. Muito bom.", a: "Cliente VIP", r: 5 }
];

const LIVE_STATUS_MSGS = [
  "Experiência Tântrica agendada agora 🔥", 
  "Horário das 19h acabou de sair 🌙", 
  "Cliente Prata renovou pacote 🥈"
];

// ==================================================================================
// 2. ESTILOS CSS
// ==================================================================================

const styles = `
  :root {
    --bg-color: #050505;
    --surface: rgba(30, 30, 35, 0.7);
    --accent: #2563EB;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: var(--bg-color); color: #FFF;
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overscroll-behavior-y: none;
  }
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.15) 0%, transparent 50%);
  }
  .glass-card {
    background: var(--surface); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }
  .glass-btn {
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); transition: 0.2s;
  }
  .glass-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.1); }
  .primary-btn {
    background: linear-gradient(135deg, #2563EB, #1d4ed8); border: none; color: white;
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
  }
  .primary-btn:active { transform: scale(0.98); }
  .animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
`;

// ==================================================================================
// 3. COMPONENTES
// ==================================================================================

const Header = ({ step, goBack }) => (
  <div className="fixed top-0 w-full z-50 px-6 pt-6 pb-4 bg-gradient-to-b from-black via-black/95 to-transparent flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto">
      {step > 1 ? (
        <button onClick={goBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex flex-col animate-enter">
          <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson Massagens</span>
          <span className="text-sm font-medium text-gray-300">Santa Fé do Sul & Região</span>
        </div>
      )}
    </div>
    <div className="pointer-events-auto px-3 py-1.5 rounded-full glass-card flex items-center gap-2 border border-green-500/30">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
        <span className="text-[10px] font-bold text-green-400">ONLINE</span>
    </div>
  </div>
);

const DateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const [dates, setDates] = useState([]);
  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today); d.setDate(today.getDate() + i); arr.push(d);
    }
    setDates(arr);
  }, []);

  const getLabel = (d) => {
    const now = new Date();
    if(d.toDateString() === now.toDateString()) return 'HOJE';
    const tmr = new Date(now); tmr.setDate(tmr.getDate() + 1);
    if(d.toDateString() === tmr.toDateString()) return 'AMANHÃ';
    return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  return (
    <div className="animate-enter" style={{animationDelay: '0.1s'}}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Escolha a Data</h3>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {dates.map((d, i) => {
          const isSel = selectedDate === d.toDateString();
          return (
            <button key={i} onClick={() => onSelect(d.toDateString(), '')} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-blue-600 text-white border-blue-500 scale-105' : 'glass-btn border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-blue-500'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      {selectedDate && (
        <div className="mt-4 animate-enter">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Horário</h3>
          <div className="grid grid-cols-4 gap-2">
            {['09:00', '11:00', '14:00', '16:00', '18:00', '20:00', '22:00'].map(t => (
              <button key={t} onClick={() => onSelect(selectedDate, t)} className={`py-2 rounded-lg text-sm font-bold border transition-all ${selectedTime === t ? 'bg-white text-black border-white' : 'glass-btn border-white/5 text-gray-300'}`}>{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
};

const LoyaltyHUD = ({ stats }) => {
  const [privacy, setPrivacy] = useState(true);
  const currentLevel = [...LEVELS].reverse().find(l => stats.totalSpent >= l.min) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.min > stats.totalSpent);
  const progress = nextLevel ? ((stats.totalSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden mb-6 border-t border-white/10 animate-enter">
       <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
       <div className="flex justify-between items-end mb-2 relative z-10">
         <div>
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Seu Nível</p>
           <h3 className="text-xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
         </div>
         <div className="text-right">
            <button onClick={() => setPrivacy(!privacy)} className="text-gray-500 hover:text-white mb-1 ml-auto block p-1">{privacy ? <Eye size={14}/> : <EyeOff size={14}/>}</button>
            <span className={`font-mono text-sm font-bold block ${privacy ? 'blur-[4px] opacity-60' : ''}`}>R$ {stats.totalSpent.toFixed(2)}</span>
         </div>
       </div>
       <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
         <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400" style={{width: `${Math.max(5, progress)}%`}} />
       </div>
       <div className="flex justify-between text-[9px] text-gray-500 font-bold tracking-wide">
          <span className="text-blue-400">{currentLevel.perk}</span>
          {nextLevel ? <span>Faltam R$ {nextLevel.min - stats.totalSpent}</span> : <span className="text-yellow-500">Máximo</span>}
       </div>
    </div>
  );
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState({ totalSpent: 0, bookings: 0 });
  const [booking, setBooking] = useState({ service: null, date: null, time: null, extras: { touch: false, aroma: false } });
  const [liveMsg, setLiveMsg] = useState(LIVE_STATUS_MSGS[0]);

  useEffect(() => {
    const saved = localStorage.getItem('thaly_stats_v3');
    if (saved) setUserStats(JSON.parse(saved));
    setTimeout(() => setLoading(false), 1500);
    const interval = setInterval(() => setLiveMsg(LIVE_STATUS_MSGS[Math.floor(Math.random() * LIVE_STATUS_MSGS.length)]), 4000);
    return () => clearInterval(interval);
  }, []);

  const formatMoney = (v) => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  
  const calcTotal = () => {
    if(!booking.service) return 0;
    let total = booking.service.price;
    if(booking.extras.touch) total += CONFIG.PRICES.TOUCH;
    if(booking.extras.aroma && userStats.totalSpent < 900) total += CONFIG.PRICES.AROMA;
    return total;
  };

  const handleFinish = () => {
     const newStats = { totalSpent: userStats.totalSpent + calcTotal(), bookings: userStats.bookings + 1 };
     setUserStats(newStats);
     localStorage.setItem('thaly_stats_v3', JSON.stringify(newStats));
     
     const aromaStatus = booking.extras.aroma ? (userStats.totalSpent >= 900 ? 'Incluso (VIP)' : 'Sim') : 'Não';
     const msg = `*PEDIDO APP* 💎\n\n💆‍♂️ *${booking.service.name}*\n📅 ${booking.date} às ${booking.time}\n\n*EXTRAS:*\nToque: ${booking.extras.touch ? 'SIM' : 'Não'}\nAroma: ${aromaStatus}\n\n💰 *TOTAL: ${formatMoney(calcTotal())}*`;
     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if(loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center fixed inset-0 z-[100]">
      <style>{styles}</style>
      <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-6"/>
      <span className="text-[12px] tracking-[0.3em] font-bold text-blue-500 animate-pulse">CARREGANDO...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 w-full max-w-md mx-auto relative">
      <style>{styles}</style>
      <div className="ambient-bg" />
      <Header step={step} goBack={() => setStep(s => s-1)} />

      {/* --- PASSO 1: HOME --- */}
      {step === 1 && (
        <div className="px-6 pt-24 pb-10">
          <div className="mb-6 animate-enter" style={{animationDelay: '0.1s'}}>
            <h1 className="text-3xl font-bold text-white leading-tight">Escolha sua <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Experiência</span></h1>
          </div>
          <LoyaltyHUD stats={userStats} />

          <div className="flex justify-center mb-8 animate-enter" style={{animationDelay: '0.2s'}}>
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 border border-blue-500/20 shadow-lg">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{liveMsg}</span>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            {SERVICES.map((s, idx) => (
              <div key={s.id} onClick={() => { setBooking({...booking, service: s}); setStep(2); }} 
                className="glass-card p-6 rounded-3xl active:scale-[0.98] transition-all relative overflow-hidden group cursor-pointer animate-enter"
                style={{animationDelay: `${0.3 + (idx * 0.1)}s`}}
              >
                 {s.tag && <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg z-10">{s.tag}</div>}
                 
                 <div className="mb-4">
                     <h3 className="text-2xl font-bold text-white mb-1">{s.name}</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-xl">{formatMoney(s.price)}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">• {s.duration}</span>
                     </div>
                 </div>
                 
                 <p className="text-sm text-gray-400 leading-relaxed mb-4">{s.desc}</p>

                 {/* DETALHES "FALTANDO" AGORA INCLUSOS */}
                 <div className="flex flex-wrap gap-2">
                    {s.features.map((f, i) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-400 font-medium">
                            {f}
                        </span>
                    ))}
                 </div>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto flex gap-4 pb-4 hide-scrollbar animate-enter" style={{animationDelay: '0.6s'}}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="glass-card min-w-[240px] p-4 rounded-xl border border-white/5 flex-shrink-0">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_,k) => <Star key={k} size={10} className="text-yellow-500 fill-yellow-500"/>)}
                </div>
                <p className="text-xs text-gray-300 italic mb-2">"{r.t}"</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase text-right">- {r.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PASSO 2: DATA & EXTRAS --- */}
      {step === 2 && (
        <div className="px-6 pt-24 pb-10">
           <h2 className="text-2xl font-bold mb-6 animate-enter">Agendamento</h2>
           <DateSelector selectedDate={booking.date} selectedTime={booking.time} onSelect={(d, t) => setBooking(prev => ({...prev, date: d, time: t}))} />

           {booking.date && booking.time && (
             <div className="mt-8 animate-enter" style={{animationDelay: '0.2s'}}>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Adicionais</h3>
               <div className="space-y-3">
                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, touch: !p.extras.touch}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.touch ? 'bg-red-500/10 border-red-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.touch ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}><Heart size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Toque Interativo</span><span className="text-[10px] text-gray-500">Permite interação</span></div>
                    </div>
                    <span className="text-xs font-bold text-red-400">+ {formatMoney(CONFIG.PRICES.TOUCH)}</span>
                  </button>

                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, aroma: !p.extras.aroma}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.aroma ? 'bg-green-500/10 border-green-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.aroma ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400'}`}><Wind size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Aromaterapia</span><span className="text-[10px] text-gray-500">Óleos essenciais</span></div>
                    </div>
                    {userStats.totalSpent >= 900 ? <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded">GRÁTIS (VIP)</span> : <span className="text-xs font-bold text-green-400">+ {formatMoney(CONFIG.PRICES.AROMA)}</span>}
                  </button>
               </div>
               <button onClick={() => setStep(3)} className="w-full mt-8 primary-btn py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-lg shadow-xl">Revisar <ArrowRight size={20}/></button>
             </div>
           )}
        </div>
      )}

      {/* --- PASSO 3: CHECKOUT --- */}
      {step === 3 && (
        <div className="px-6 pt-24 pb-10">
          <h2 className="text-2xl font-bold mb-6 animate-enter">Resumo</h2>
          <div className="glass-card p-6 rounded-2xl border-t-4 border-blue-600 mb-6 animate-enter">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{booking.service.name}</h3>
                <span className="text-blue-400 font-bold">{formatMoney(booking.service.price)}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2"><Calendar size={14}/> {booking.date} às {booking.time}</p>
            <div className="space-y-2 border-t border-white/10 pt-4 mb-4">
               {booking.extras.touch && <div className="flex justify-between text-sm text-gray-300"><span>Toque Interativo</span><span>{formatMoney(CONFIG.PRICES.TOUCH)}</span></div>}
               {booking.extras.aroma && <div className="flex justify-between text-sm text-gray-300"><span>Aromaterapia</span><span>{userStats.totalSpent >= 900 ? 'R$ 0,00' : formatMoney(CONFIG.PRICES.AROMA)}</span></div>}
            </div>
            <div className="flex justify-between items-end pt-2 border-t border-white/10">
               <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
               <span className="text-3xl font-bold text-white">{formatMoney(calcTotal())}</span>
            </div>
          </div>
          <button onClick={handleFinish} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-3 animate-enter" style={{animationDelay: '0.2s'}}>
             <MessageCircle size={22}/> CONFIRMAR AGORA
          </button>
          <button onClick={() => setStep(1)} className="w-full py-4 text-xs text-gray-500 mt-2 hover:text-white transition-colors animate-enter" style={{animationDelay: '0.3s'}}>Voltar</button>
        </div>
      )}
    </div>
  );
}
