import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Instagram, MessageCircle, Bell, Tag, 
  ArrowRight, Share2, Zap, Crown, Music, Trash2, CreditCard, 
  Banknote, QrCode, Info, Send, Moon, Wind, Droplets, Heart, 
  Navigation, Eye, EyeOff, Sparkles, Flame
} from 'lucide-react';

// ==================================================================================
// 1. SYSTEM DESIGN & TOKENS (DARK LUXURY THEME)
// ==================================================================================

const THEME = {
  bg: '#050505',
  surface: 'rgba(30, 30, 35, 0.6)', 
  surfaceHighlight: 'rgba(255, 255, 255, 0.05)',
  accent: '#2563EB', // Azul Royal
  gold: '#D4AF37',   // Ouro VIP
  success: '#10B981',
  text: { primary: '#FFFFFF', secondary: '#A1A1AA' }
};

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: ${THEME.bg}; 
    color: ${THEME.text.primary};
    font-family: 'Inter', -apple-system, sans-serif;
    overscroll-behavior-y: none;
  }
  
  /* --- AMBIENT BACKGROUND --- */
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: 
      radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 40%);
  }

  /* --- GLASSMORPHISM --- */
  .glass-card {
    background: ${THEME.surface};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  
  .glass-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.2s ease;
  }
  .glass-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.08); }
  
  .primary-btn {
    background: linear-gradient(135deg, ${THEME.accent}, #1d4ed8);
    box-shadow: 0 0 20px rgba(37, 99, 235, 0.3);
    border: none; color: white;
  }

  /* --- ANIMATIONS --- */
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  .animate-pulse-slow { animation: pulse 3s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
`;

// ==================================================================================
// 2. DADOS & LÓGICA (MISTURA DO ANTIGO COM O NOVO)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413",
  PRICES: { TOUCH: 55, AROMA: 15, UPGRADE_TIME_PCT: 0.4 }
};

const LEVELS = [
  { name: 'Bronze', min: 0, icon: '🥉', perk: "Acesso ao App" },
  { name: 'Prata', min: 400, icon: '🥈', perk: "Aroma 50% OFF" },
  { name: 'Ouro', min: 900, icon: '🥇', perk: "Aroma GRÁTIS" },
  { name: 'Diamante', min: 1800, icon: '💎', perk: "Prioridade Total" },
];

const SERVICES = [
  { id: 'signature', name: 'Signature SP', tag: 'BEST SELLER', desc: 'Relaxante + Tântrica. Alívio muscular e conexão sensorial.', duration: '60 min', price: 180, vibe: '🔥 Intenso' },
  { id: 'deep', name: 'Deep Relax', tag: 'ZERO STRESS', desc: 'Foco em dores musculares. Costas e pernas.', duration: '50 min', price: 140, vibe: '🌿 Zen' },
  { id: 'tantra', name: 'Tantra Floor', tag: 'NOVIDADE', desc: 'Feita no chão/tatame. Amplitude e respiração.', duration: '70 min', price: 220, vibe: '🧘 Espiritual' }
];

const REVIEWS = [
  { t: "O sigilo foi total. A experiência In-Room é muito melhor.", a: "Executivo (Itaim)", r: 5 },
  { t: "A vibe Dark Luxury do atendimento é real. Iluminação, som, tudo.", a: "Cliente (Jardins)", r: 5 },
  { t: "A técnica tântrica me renovou. Vale cada centavo.", a: "Anônimo", r: 5 }
];

const LIVE_STATUS = ["Atendimento em Moema agora 💆‍♂️", "Horário das 19h acabou de sair 🌙", "Cliente Ouro agendou Signature 🔥"];

// ==================================================================================
// 3. COMPONENTES REUTILIZÁVEIS (HÍBRIDOS)
// ==================================================================================

const Header = ({ step, goBack, notifCount, onOpenNotif }) => (
  <div className="fixed top-0 w-full z-50 px-6 pt-6 pb-4 bg-gradient-to-b from-black via-black/90 to-transparent flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto">
      {step > 1 ? (
        <button onClick={goBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex flex-col animate-enter">
          <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson SP</span>
          <span className="text-sm font-medium text-gray-300">São Paulo, Zona Sul</span>
        </div>
      )}
    </div>
    <div className="flex gap-3 pointer-events-auto">
      <button onClick={onOpenNotif} className="relative w-10 h-10 rounded-full glass-card flex items-center justify-center text-gray-300 border border-white/5 active:scale-95">
        <Bell className="w-5 h-5"/>
        {notifCount > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></span>}
      </button>
    </div>
  </div>
);

// --- O SELETOR DE DATA ANTIGO (REFATORADO PARA VISUAL NOVO) ---
const SmartDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const days = Array.from({length: 14}, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i); return d;
  });
  
  const getLabel = (d) => {
    const now = new Date();
    if(d.getDate() === now.getDate()) return 'HOJE';
    if(d.getDate() === now.getDate()+1) return 'AMANHÃ';
    return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  const slots = ['09:00', '11:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  return (
    <div className="animate-enter">
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Escolha a Data</h3>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {days.map((d, i) => {
          const isSel = selectedDate === d.toDateString();
          return (
            <button key={i} onClick={() => onSelect(d.toDateString(), '')} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105' : 'glass-btn border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-blue-500'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-2 animate-enter">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Horário</h3>
          <div className="grid grid-cols-4 gap-2">
            {slots.map(t => (
              <button key={t} onClick={() => onSelect(selectedDate, t)} className={`py-2 rounded-lg text-sm font-bold border transition-all ${selectedTime === t ? 'bg-white text-black border-white' : 'glass-btn border-white/5 text-gray-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
};

// --- GAMIFICATION CARD (MISTURA DO NOVO COM ANTIGO) ---
const LoyaltyHUD = ({ stats }) => {
  const [privacy, setPrivacy] = useState(true);
  const currentLevel = [...LEVELS].reverse().find(l => stats.totalSpent >= l.min) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.min > stats.totalSpent);
  const progress = nextLevel ? ((stats.totalSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  return (
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden mb-6 border-t border-white/10">
       <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
       
       <div className="flex justify-between items-end mb-2 relative z-10">
         <div>
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Status VIP</p>
           <h3 className="text-xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
         </div>
         <div className="text-right">
            <button onClick={() => setPrivacy(!privacy)} className="text-gray-500 hover:text-white mb-1 ml-auto block"><Eye size={12}/></button>
            <span className={`font-mono text-sm font-bold ${privacy ? 'blur-sm opacity-50' : ''}`}>R$ {stats.totalSpent}</span>
         </div>
       </div>

       <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
         <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000" style={{width: `${progress}%`}} />
       </div>
       
       <div className="flex justify-between text-[9px] text-gray-500 font-bold tracking-wide">
          <span className="text-blue-400">{currentLevel.perk}</span>
          {nextLevel && <span>Faltam R$ {nextLevel.min - stats.totalSpent}</span>}
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
  
  // Persistência "Silenciosa" (Mistura do código antigo)
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('thaly_stats_v1');
    return saved ? JSON.parse(saved) : { totalSpent: 0, bookings: 0 };
  });

  const [booking, setBooking] = useState({
    service: null, date: null, time: null, location: null,
    extras: { touch: false, time: false, aroma: false }
  });

  // Efeito de Live Status
  const [liveMsg, setLiveMsg] = useState(LIVE_STATUS[0]);
  useEffect(() => {
    const i = setInterval(() => setLiveMsg(LIVE_STATUS[Math.floor(Math.random()*LIVE_STATUS.length)]), 4000);
    setTimeout(() => setLoading(false), 1500);
    return () => clearInterval(i);
  }, []);

  const formatMoney = (v) => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});

  const calcTotal = () => {
    if(!booking.service) return 0;
    let t = booking.service.price;
    if(booking.extras.time) t += booking.service.price * CONFIG.PRICES.UPGRADE_TIME_PCT;
    if(booking.extras.touch) t += CONFIG.PRICES.TOUCH;
    // Lógica do Nível: Aroma é grátis se for nível Ouro+
    const isGold = userStats.totalSpent >= 900;
    if(booking.extras.aroma && !isGold) t += CONFIG.PRICES.AROMA;
    return t;
  };

  const handleFinish = () => {
     // Atualiza stats localmente (simulando backend)
     const newTotal = userStats.totalSpent + calcTotal();
     const newStats = { totalSpent: newTotal, bookings: userStats.bookings + 1 };
     setUserStats(newStats);
     localStorage.setItem('thaly_stats_v1', JSON.stringify(newStats));
     
     // Redireciona WhatsApp
     const msg = `*RESERVA NOVO APP* 💎\nServiço: ${booking.service.name}\nData: ${booking.date} - ${booking.time}\nTotal: ${formatMoney(calcTotal())}`;
     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if(loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-4"/>
      <span className="text-[10px] tracking-[0.3em] font-bold text-blue-500 animate-pulse">CARREGANDO</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      <style>{styles}</style>
      <div className="ambient-bg" />
      <Header step={step} goBack={() => setStep(s => s-1)} notifCount={1} />

      {/* --- HOME (MISTURA: CONTEÚDO RICO DO ANTIGO + DESIGN NOVO) --- */}
      {step === 1 && (
        <div className="px-6 pt-24 animate-enter">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white leading-tight">Bem-vindo ao <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Nível Superior</span></h1>
          </div>

          <LoyaltyHUD stats={userStats} />

          {/* Live Ticker (Do código antigo) */}
          <div className="flex justify-center mb-6">
            <div className="glass-card px-4 py-1.5 rounded-full flex items-center gap-2 border border-green-500/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-slow"/>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{liveMsg}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest pl-1">Experiências</h3>
          <div className="space-y-4 mb-8">
            {SERVICES.map(s => (
              <div key={s.id} onClick={() => { setBooking({...booking, service: s}); setStep(2); }} className="glass-card p-5 rounded-2xl active:scale-[0.98] transition-all relative overflow-hidden group">
                 {s.tag && <div className="absolute top-0 right-0 bg-blue-600 text-[9px] font-bold px-3 py-1 rounded-bl-xl">{s.tag}</div>}
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{s.name}</h3>
                     <span className="text-[10px] text-gray-400 font-bold uppercase">{s.duration} • {s.vibe}</span>
                   </div>
                   <span className="text-lg font-bold text-blue-400">{formatMoney(s.price)}</span>
                 </div>
                 <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-white/10 pl-3">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Social Proof (Do código antigo) */}
          <div className="overflow-x-auto flex gap-4 pb-4 hide-scrollbar">
            {REVIEWS.map((r, i) => (
              <div key={i} className="glass-card min-w-[240px] p-4 rounded-xl border border-white/5">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_,k) => <Star key={k} size={10} className="text-yellow-500 fill-yellow-500"/>)}
                </div>
                <p className="text-xs text-gray-300 italic mb-2">"{r.t}"</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase">{r.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- AGENDAMENTO (DATA INTELIGENTE) --- */}
      {step === 2 && (
        <div className="px-6 pt-24 animate-enter">
           <h2 className="text-2xl font-bold mb-6">Quando?</h2>
           
           <SmartDateSelector 
             selectedDate={booking.date} 
             selectedTime={booking.time}
             onSelect={(d, t) => setBooking({...booking, date: d, time: t})} 
           />

           {booking.date && booking.time && (
             <div className="mt-8 animate-enter">
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Personalize</h3>
               <div className="space-y-3">
                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, touch: !p.extras.touch}}))} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.touch ? 'bg-red-500/10 border-red-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3"><Heart size={16} className={booking.extras.touch ? 'text-red-500' : 'text-gray-500'} /><span className="text-sm font-bold text-gray-200">Toque Interativo</span></div>
                    <span className="text-xs font-bold text-red-400">+ {formatMoney(CONFIG.PRICES.TOUCH)}</span>
                  </button>

                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, aroma: !p.extras.aroma}}))} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.aroma ? 'bg-green-500/10 border-green-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3"><Wind size={16} className={booking.extras.aroma ? 'text-green-500' : 'text-gray-500'} /><span className="text-sm font-bold text-gray-200">Aromaterapia</span></div>
                    {userStats.totalSpent >= 900 ? (
                        <span className="text-xs font-bold text-green-400">GRÁTIS (OURO)</span>
                    ) : (
                        <span className="text-xs font-bold text-green-400">+ {formatMoney(CONFIG.PRICES.AROMA)}</span>
                    )}
                  </button>
               </div>

               <button onClick={() => setStep(3)} className="w-full mt-8 primary-btn py-4 rounded-xl font-bold flex justify-center items-center gap-2">
                 Revisar Pedido <ArrowRight size={18}/>
               </button>
             </div>
           )}
        </div>
      )}

      {/* --- CHECKOUT (RESUMO) --- */}
      {step === 3 && (
        <div className="px-6 pt-24 animate-enter">
          <div className="glass-card p-6 rounded-2xl border-t-4 border-blue-600 mb-6">
            <h3 className="text-lg font-bold text-white mb-1">{booking.service.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{booking.date} às {booking.time}</p>
            
            <div className="space-y-2 border-t border-white/10 pt-4 mb-4">
               {booking.extras.touch && <div className="flex justify-between text-sm text-gray-300"><span>Toque</span><span>{formatMoney(CONFIG.PRICES.TOUCH)}</span></div>}
               {booking.extras.aroma && <div className="flex justify-between text-sm text-gray-300"><span>Aroma</span><span>{userStats.totalSpent >= 900 ? 'R$ 0,00' : formatMoney(CONFIG.PRICES.AROMA)}</span></div>}
            </div>
            
            <div className="flex justify-between items-end">
               <span className="text-xs font-bold text-gray-500 uppercase">Total Estimado</span>
               <span className="text-3xl font-bold text-white">{formatMoney(calcTotal())}</span>
            </div>
          </div>

          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3">
             <Sparkles className="text-blue-400 w-5 h-5 shrink-0" />
             <p className="text-xs text-blue-200 leading-relaxed">
               Ao confirmar, você ganha <strong>{Math.floor(calcTotal())} pontos XP</strong> para subir de nível e desbloquear descontos.
             </p>
          </div>

          <button onClick={handleFinish} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-lg flex justify-center items-center gap-2">
             <MessageCircle size={20}/> Confirmar no WhatsApp
          </button>
          <button onClick={() => setStep(1)} className="w-full py-4 text-xs text-gray-500 mt-2">Cancelar</button>
        </div>
      )}

    </div>
  );
}
