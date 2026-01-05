import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ArrowRight, Check, MapPin, Calendar, Clock,
  Star, Bell, Zap, Crown, CreditCard, Banknote, QrCode, 
  Info, MessageCircle, Heart, Wind, Sparkles, Eye, EyeOff
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO E DADOS (CORRIGIDOS)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413", // Seu número
  PRICES: { 
    TOUCH: 55, 
    AROMA: 15, 
    UPGRADE_TIME_PCT: 0.4 // 40% do valor base
  }
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

const LIVE_STATUS_MSGS = [
  "Atendimento em Moema agora 💆‍♂️", 
  "Horário das 19h acabou de sair 🌙", 
  "Cliente Ouro agendou Signature 🔥",
  "Agenda de Sexta quase cheia 📅"
];

// ==================================================================================
// 2. ESTILOS CSS INJETADOS (PARA GARANTIR O VISUAL)
// ==================================================================================

const styles = `
  :root {
    --bg-color: #050505;
    --text-primary: #FFFFFF;
    --text-secondary: #A1A1AA;
    --accent: #2563EB;
    --surface: rgba(30, 30, 35, 0.7);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  
  body { 
    background-color: var(--bg-color); 
    color: var(--text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    overscroll-behavior-y: none;
    overflow-x: hidden;
  }

  /* Fundo Animado */
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: 
      radial-gradient(circle at 15% 25%, rgba(37, 99, 235, 0.1) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(212, 175, 55, 0.08) 0%, transparent 40%);
  }

  /* Utilitários de Vidro (Glassmorphism) */
  .glass-card {
    background: var(--surface);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  }

  .glass-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .glass-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.1); }

  .primary-btn {
    background: linear-gradient(135deg, #2563EB, #1d4ed8);
    box-shadow: 0 4px 20px rgba(37, 99, 235, 0.4);
    border: none; color: white; cursor: pointer;
    transition: transform 0.2s;
  }
  .primary-btn:active { transform: scale(0.98); }

  /* Animações */
  .animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  
  .animate-pulse-slow { animation: pulse 3s infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }

  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
        <div className="flex flex-col animate-enter" style={{animationDelay: '0.1s'}}>
          <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson SP</span>
          <span className="text-sm font-medium text-gray-300">Zona Sul & Jardins</span>
        </div>
      )}
    </div>
    <div className="pointer-events-auto">
      <div className="px-3 py-1.5 rounded-full glass-card flex items-center gap-2 border border-green-500/30">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse-slow"/>
        <span className="text-[10px] font-bold text-green-400">ONLINE</span>
      </div>
    </div>
  </div>
);

const DateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  // Gera 14 dias a partir de hoje
  const [dates, setDates] = useState([]);

  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      arr.push(d);
    }
    setDates(arr);
  }, []);

  const getLabel = (d) => {
    const now = new Date();
    // Resetar horas para comparar apenas datas
    const dStr = d.toDateString();
    const nowStr = now.toDateString();
    const tomorrow = new Date(now); tomorrow.setDate(tomorrow.getDate() + 1);
    
    if(dStr === nowStr) return 'HOJE';
    if(dStr === tomorrow.toDateString()) return 'AMANHÃ';
    return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  const slots = ['09:00', '11:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  return (
    <div className="animate-enter" style={{animationDelay: '0.1s'}}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Escolha a Data</h3>
      
      {/* Scroll Horizontal de Dias */}
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {dates.map((d, i) => {
          const dString = d.toDateString();
          const isSel = selectedDate === dString;
          return (
            <button key={i} onClick={() => onSelect(dString, '')} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-blue-600 text-white border-blue-500 shadow-lg scale-105' : 'glass-btn border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-blue-500'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      
      {/* Grid de Horários */}
      {selectedDate && (
        <div className="mt-4 animate-enter" style={{animationDelay: '0.2s'}}>
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

const LoyaltyHUD = ({ stats }) => {
  const [privacy, setPrivacy] = useState(true);
  
  // Calcula nível atual e próximo
  const currentLevelIdx = [...LEVELS].reverse().findIndex(l => stats.totalSpent >= l.min);
  const currentLevel = currentLevelIdx !== -1 ? LEVELS[LEVELS.length - 1 - currentLevelIdx] : LEVELS[0];
  const nextLevel = LEVELS.find(l => l.min > stats.totalSpent);
  
  // Calcula porcentagem da barra
  let progress = 100;
  if (nextLevel) {
    const range = nextLevel.min - currentLevel.min;
    const current = stats.totalSpent - currentLevel.min;
    progress = (current / range) * 100;
  }

  return (
    <div className="glass-card p-5 rounded-2xl relative overflow-hidden mb-6 border-t border-white/10 animate-enter">
       <div className="absolute top-[-50%] right-[-20%] w-40 h-40 bg-blue-600/20 blur-[60px] rounded-full pointer-events-none"></div>
       
       <div className="flex justify-between items-end mb-2 relative z-10">
         <div>
           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Seu Nível VIP</p>
           <h3 className="text-xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
         </div>
         <div className="text-right">
            <button onClick={() => setPrivacy(!privacy)} className="text-gray-500 hover:text-white mb-1 ml-auto block p-1">
                {privacy ? <Eye size={14}/> : <EyeOff size={14}/>}
            </button>
            <span className={`font-mono text-sm font-bold block ${privacy ? 'blur-[4px] opacity-60' : ''}`}>
                R$ {stats.totalSpent.toFixed(2)}
            </span>
         </div>
       </div>

       <div className="h-1.5 bg-white/10 rounded-full mb-2 overflow-hidden">
         <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000" style={{width: `${Math.max(5, progress)}%`}} />
       </div>
       
       <div className="flex justify-between text-[9px] text-gray-500 font-bold tracking-wide">
          <span className="text-blue-400">{currentLevel.perk}</span>
          {nextLevel ? (
              <span>Faltam R$ {nextLevel.min - stats.totalSpent}</span>
          ) : (
              <span className="text-yellow-500">Nível Máximo</span>
          )}
       </div>
    </div>
  );
};

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  
  // Estado do Usuário (Carregado do LocalStorage)
  const [userStats, setUserStats] = useState({ totalSpent: 0, bookings: 0 });

  // Estado do Agendamento Atual
  const [booking, setBooking] = useState({
    service: null,
    date: null,
    time: null,
    extras: { touch: false, aroma: false }
  });

  // Carrega dados salvos apenas no cliente (evita erro de hidratação)
  useEffect(() => {
    const saved = localStorage.getItem('thaly_stats_v2');
    if (saved) {
        setUserStats(JSON.parse(saved));
    }
    // Simula carregamento inicial
    setTimeout(() => setLoading(false), 1500);
  }, []);

  // Ticker de Status Ao Vivo
  const [liveMsg, setLiveMsg] = useState(LIVE_STATUS_MSGS[0]);
  useEffect(() => {
    const interval = setInterval(() => {
        setLiveMsg(LIVE_STATUS_MSGS[Math.floor(Math.random() * LIVE_STATUS_MSGS.length)]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Helpers
  const formatMoney = (v) => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  
  const calcTotal = () => {
    if(!booking.service) return 0;
    let total = booking.service.price;
    
    // Lógica de Extras
    if(booking.extras.touch) total += CONFIG.PRICES.TOUCH;
    
    // Aroma é cobrado a não ser que seja Ouro+
    const isGoldOrDiamond = userStats.totalSpent >= 900;
    if(booking.extras.aroma && !isGoldOrDiamond) total += CONFIG.PRICES.AROMA;
    
    return total;
  };

  const handleFinish = () => {
     // Salva progresso
     const newTotal = userStats.totalSpent + calcTotal();
     const newStats = { totalSpent: newTotal, bookings: userStats.bookings + 1 };
     
     setUserStats(newStats);
     localStorage.setItem('thaly_stats_v2', JSON.stringify(newStats));
     
     // Monta mensagem WhatsApp
     const aromaStatus = booking.extras.aroma ? (userStats.totalSpent >= 900 ? 'Incluso (VIP)' : 'Sim') : 'Não';
     
     const msg = `*NOVA RESERVA APP* 💎
---------------------------
💆‍♂️ *Serviço:* ${booking.service.name}
📅 *Data:* ${booking.date}
⏰ *Horário:* ${booking.time}
---------------------------
*EXTRAS:*
Toque Interativo: ${booking.extras.touch ? 'SIM' : 'Não'}
Aromaterapia: ${aromaStatus}
---------------------------
💰 *TOTAL:* ${formatMoney(calcTotal())}
---------------------------
_Aguardo confirmação do endereço._`;

     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // --- TELA DE LOADING ---
  if(loading) return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center fixed inset-0 z-[100]">
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

      {/* ================= PASSO 1: HOME & VITRINE ================= */}
      {step === 1 && (
        <div className="px-6 pt-24 pb-10">
          <div className="mb-6 animate-enter" style={{animationDelay: '0.1s'}}>
            <h1 className="text-3xl font-bold text-white leading-tight">Bem-vindo ao <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">Nível Superior</span></h1>
          </div>

          <LoyaltyHUD stats={userStats} />

          {/* Status Ticker */}
          <div className="flex justify-center mb-8 animate-enter" style={{animationDelay: '0.2s'}}>
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 border border-blue-500/20 shadow-lg">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse-slow"/>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{liveMsg}</span>
            </div>
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest pl-1 animate-enter" style={{animationDelay: '0.3s'}}>Experiências SP</h3>
          <div className="space-y-4 mb-8">
            {SERVICES.map((s, idx) => (
              <div key={s.id} onClick={() => { setBooking({...booking, service: s}); setStep(2); }} 
                className="glass-card p-5 rounded-2xl active:scale-[0.98] transition-all relative overflow-hidden group cursor-pointer animate-enter"
                style={{animationDelay: `${0.4 + (idx * 0.1)}s`}}
              >
                 {s.tag && <div className="absolute top-0 right-0 bg-blue-600 text-[9px] font-bold px-3 py-1 rounded-bl-xl shadow-md z-10">{s.tag}</div>}
                 
                 <div className="flex justify-between items-start mb-2">
                   <div>
                     <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{s.name}</h3>
                     <span className="text-[10px] text-gray-400 font-bold uppercase">{s.duration} • {s.vibe}</span>
                   </div>
                   <span className="text-lg font-bold text-blue-400">{formatMoney(s.price)}</span>
                 </div>
                 
                 <p className="text-xs text-gray-400 leading-relaxed border-l-2 border-white/10 pl-3 group-hover:border-blue-500/50 transition-colors">
                    {s.desc}
                 </p>
              </div>
            ))}
          </div>

          {/* Reviews Scroll */}
          <div className="overflow-x-auto flex gap-4 pb-4 hide-scrollbar animate-enter" style={{animationDelay: '0.8s'}}>
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

      {/* ================= PASSO 2: DATA & EXTRAS ================= */}
      {step === 2 && (
        <div className="px-6 pt-24 pb-10">
           <h2 className="text-2xl font-bold mb-6 animate-enter">Quando?</h2>
           
           <DateSelector 
             selectedDate={booking.date} 
             selectedTime={booking.time}
             onSelect={(d, t) => setBooking(prev => ({...prev, date: d, time: t}))} 
           />

           {booking.date && booking.time && (
             <div className="mt-8 animate-enter" style={{animationDelay: '0.3s'}}>
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Personalize</h3>
               <div className="space-y-3">
                  {/* Extra: Toque */}
                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, touch: !p.extras.touch}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.touch ? 'bg-red-500/10 border-red-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.touch ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}><Heart size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Toque Interativo</span><span className="text-[10px] text-gray-500">Permite interação</span></div>
                    </div>
                    <span className="text-xs font-bold text-red-400">+ {formatMoney(CONFIG.PRICES.TOUCH)}</span>
                  </button>

                  {/* Extra: Aroma */}
                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, aroma: !p.extras.aroma}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.aroma ? 'bg-green-500/10 border-green-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.aroma ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400'}`}><Wind size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Aromaterapia</span><span className="text-[10px] text-gray-500">Óleos essenciais</span></div>
                    </div>
                    {userStats.totalSpent >= 900 ? (
                        <span className="text-xs font-bold text-green-400 bg-green-900/30 px-2 py-1 rounded">GRÁTIS (VIP)</span>
                    ) : (
                        <span className="text-xs font-bold text-green-400">+ {formatMoney(CONFIG.PRICES.AROMA)}</span>
                    )}
                  </button>
               </div>

               <button onClick={() => setStep(3)} className="w-full mt-8 primary-btn py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-lg shadow-xl">
                 Revisar Pedido <ArrowRight size={20}/>
               </button>
             </div>
           )}
        </div>
      )}

      {/* ================= PASSO 3: CHECKOUT ================= */}
      {step === 3 && (
        <div className="px-6 pt-24 pb-10">
          <h2 className="text-2xl font-bold mb-6 animate-enter">Resumo</h2>

          <div className="glass-card p-6 rounded-2xl border-t-4 border-blue-600 mb-6 animate-enter" style={{animationDelay: '0.1s'}}>
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

          <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-xl mb-6 flex gap-3 animate-enter" style={{animationDelay: '0.2s'}}>
             <Sparkles className="text-blue-400 w-5 h-5 shrink-0 mt-0.5" />
             <p className="text-xs text-blue-200 leading-relaxed">
               Ao confirmar, você acumula <strong>XP</strong> para subir de nível e desbloquear descontos vitalícios.
             </p>
          </div>

          <button onClick={handleFinish} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-3 transition-transform active:scale-95 animate-enter" style={{animationDelay: '0.3s'}}>
             <MessageCircle size={22}/> CONFIRMAR NO WHATSAPP
          </button>
          
          <button onClick={() => setStep(1)} className="w-full py-4 text-xs text-gray-500 mt-2 hover:text-white transition-colors animate-enter" style={{animationDelay: '0.4s'}}>
            Cancelar e Voltar
          </button>
        </div>
      )}

    </div>
  );
}
