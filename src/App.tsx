import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronRight, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Instagram, MessageCircle, Bell, Tag, 
  ArrowRight, Share2, Zap, Music, Trash2, CreditCard, 
  Banknote, QrCode, AlertTriangle,  Info, Send, 
  Moon, Sun, Wind, Droplets, Heart, Navigation, Layout
} from 'lucide-react';

// ==================================================================================
// 1. SYSTEM DESIGN & TOKENS (DARK LUXURY THEME)
// ==================================================================================

const THEME = {
  bg: '#050505', // Preto quase absoluto
  surface: 'rgba(30, 30, 35, 0.6)', // Vidro escuro
  surfaceHigh: 'rgba(50, 50, 60, 0.5)', // Vidro mais claro
  accent: '#2563EB', // Azul Royal (Confiança/Profissionalismo)
  accentGlow: 'rgba(37, 99, 235, 0.3)',
  gold: '#D4AF37', // Ouro para VIP/Destaques
  success: '#10B981',
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#52525B'
  }
};

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: ${THEME.bg}; 
    color: ${THEME.text.primary};
    font-family: 'Inter', -apple-system, sans-serif;
    overscroll-behavior-y: none;
  }
  
  /* --- BACKGROUND ANIMADO --- */
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: 
      radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 40%);
  }

  /* --- GLASSMORPHISM CARDS --- */
  .glass-card {
    background: ${THEME.surface};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }
  
  .glass-btn {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  .glass-btn:active { transform: scale(0.96); background: rgba(255,255,255,0.1); }
  
  .primary-btn {
    background: linear-gradient(135deg, ${THEME.accent}, #1d4ed8);
    box-shadow: 0 0 20px ${THEME.accentGlow};
    border: none;
    color: white;
  }

  /* --- ANIMATIONS --- */
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  
  /* --- UTILS --- */
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .safe-bottom { padding-bottom: max(20px, env(safe-area-inset-bottom)); }
`;

// ==================================================================================
// 2. DATA LAYER (CONFIGURAÇÃO SP & SEM MACA)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413",
  PRICES: {
    TOUCH: 55,
    AROMA: 15,
    UPGRADE_TIME: 0.4 // 40% do valor base
  }
};

// Serviços reformulados para "Experiência In-Room"
const services = [
  { 
    id: 'signature', 
    name: 'Signature SP', 
    tag: 'BEST SELLER',
    desc: 'Fusão de Relaxante e Tântrica. Alívio muscular seguido de conexão sensorial intensa.',
    duration: '60 min', 
    price: 180,
    features: ['In-Room (Cama/Sofá)', 'Óleos Aquecidos', 'Finalização Manual', 'Corpo a Corpo'],
    vibe: '🔥 Intenso'
  },
  { 
    id: 'deep-relax', 
    name: 'Deep Relax', 
    tag: 'ZERO STRESS',
    desc: 'Foco total em descompressão muscular. Costas, pescoço e pernas. Ideal pós-trabalho.',
    duration: '50 min', 
    price: 140,
    features: ['Foco em Dores', 'Sem Toque Íntimo', 'Trilha Sonora Alpha', 'Aromaterapia Inclusa'],
    vibe: '🌿 Zen'
  },
  { 
    id: 'tantra-floor', 
    name: 'Tantra Floor', 
    tag: 'NOVIDADE',
    desc: 'Massagem feita no chão (tatame ou tapete). Maior amplitude de movimentos e alongamentos.',
    duration: '70 min', 
    price: 220,
    features: ['Necessário Tapete/Edredom', 'Respiração Guiada', 'Bioenergética', 'Toque Pleno'],
    vibe: '🧘 Espiritual'
  }
];

// Bairros Nobres de SP (Filtro de Segurança)
const spZones = [
  { id: 'itaim', name: 'Itaim Bibi', surcharge: 0, time: '15 min' },
  { id: 'moema', name: 'Moema', surcharge: 0, time: '20 min' },
  { id: 'jardins', name: 'Jardins / Paulista', surcharge: 15, time: '25 min' },
  { id: 'vn', name: 'Vila Nova Conceição', surcharge: 0, time: '10 min' },
  { id: 'morumbi', name: 'Morumbi / Panamby', surcharge: 30, time: '40 min' },
  { id: 'other', name: 'Outra Região (Sob Análise)', surcharge: 0, time: 'Consultar' }
];

const vibes = [
  { id: 'chill', icon: <Wind size={16}/>, label: 'Lounge & Chill' },
  { id: 'nature', icon: <Droplets size={16}/>, label: 'Sons da Chuva' },
  { id: 'deep', icon: <Music size={16}/>, label: 'Deep House' },
  { id: 'silence', icon: <Moon size={16}/>, label: 'Silêncio Total' },
];

// ==================================================================================
// 3. COMPONENTES ATÓMICOS
// ==================================================================================

const Header = ({ step, goBack }) => (
  <div className="fixed top-0 w-full z-50 px-6 pt-6 pb-4 bg-gradient-to-b from-black via-black/80 to-transparent flex justify-between items-center">
    {step > 1 ? (
      <button onClick={goBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform">
        <Navigation className="w-4 h-4 rotate-[-90deg]" />
      </button>
    ) : (
      <div className="flex flex-col">
        <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson Massagens</span>
        <span className="text-sm font-medium text-gray-300">São Paulo, SP</span>
      </div>
    )}
    <div className="flex gap-3">
      <div className="px-3 py-1.5 rounded-full glass-card flex items-center gap-2 border border-green-500/30">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
        <span className="text-[10px] font-bold text-green-400">ONLINE</span>
      </div>
    </div>
  </div>
);

const ProgressBar = ({ step, total }) => (
  <div className="fixed top-0 left-0 h-1 bg-blue-600 transition-all duration-500 z-[60]" style={{ width: `${(step/total)*100}%` }} />
);

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // Estado Simplificado
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    service: null,
    extras: { touch: false, aroma: false, time: false },
    zone: null,
    date: null,
    time: null,
    vibe: null,
    surface: 'bed', // bed | floor
    clientName: '',
    payment: 'pix'
  });

  // Scroll to top on step change
  useEffect(() => { window.scrollTo(0,0); }, [step]);

  // Funções Auxiliares
  const formatMoney = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const toggleExtra = (key) => setData(prev => ({...prev, extras: {...prev.extras, [key]: !prev.extras[key]}}));
  
  const calcTotal = () => {
    if(!data.service) return 0;
    let total = data.service.price;
    if(data.extras.time) total += data.service.price * CONFIG.PRICES.UPGRADE_TIME;
    if(data.extras.touch) total += CONFIG.PRICES.TOUCH;
    if(data.extras.aroma) total += CONFIG.PRICES.AROMA;
    if(data.zone?.surcharge) total += data.zone.surcharge;
    return total;
  };

  const handleWhatsApp = () => {
    const total = calcTotal();
    const isCredit = data.payment === 'card';
    const finalVal = isCredit ? total * 1.1 : total; // Taxa maquininha simulada
    
    const msg = 
`*AGENDAMENTO SP - VIP* 🌃
---------------------------
👤 *Cliente:* ${data.clientName || 'Anônimo'}
💆‍♂️ *Serviço:* ${data.service.name}
📅 *Data:* ${data.date} às ${data.time}
📍 *Região:* ${data.zone.name}
🛏️ *Local:* ${data.surface === 'bed' ? 'Na Cama' : 'No Tapete/Chão'}

*EXTRAS:*
${data.extras.time ? '➕ +Tempo Extra\n' : ''}${data.extras.touch ? '➕ Toque Interativo\n' : ''}${data.extras.aroma ? '➕ Aromaterapia\n' : ''}
🎵 *Vibe:* ${data.vibe?.label || 'Padrão'}

💰 *TOTAL:* ${formatMoney(finalVal)}
(${data.payment === 'pix' ? 'Pix' : 'Cartão Crédito'})
---------------------------
_Solicito confirmação de disponibilidade._`;

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-screen text-white pb-24">
      <style>{styles}</style>
      <div className="ambient-bg" />
      <ProgressBar step={step} total={4} />
      <Header step={step} goBack={() => setStep(s => s - 1)} />

      {/* ================= PASSO 1: VITRINE (SERVIÇOS) ================= */}
      {step === 1 && (
        <div className="px-6 pt-24 animate-enter">
          <h1 className="text-3xl font-bold mb-2">Experiência <br/><span className="text-blue-500">Relax SP</span></h1>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">Terapias exclusivas no conforto da sua suíte ou residência. Sem macas, sem equipamentos invasivos. Apenas relaxamento puro.</p>

          <div className="space-y-6">
            {services.map(s => (
              <div key={s.id} onClick={() => { setData({...data, service: s}); setStep(2); }} className="glass-card rounded-2xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer group">
                {s.tag && <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl text-white shadow-lg z-10">{s.tag}</div>}
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{s.name}</h3>
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-widest">{s.duration} • {s.vibe}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-xl font-bold text-blue-400">{formatMoney(s.price)}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-4 border-l-2 border-white/10 pl-3 leading-snug">{s.desc}</p>
                
                <div className="flex flex-wrap gap-2">
                  {s.features.map((f, i) => (
                    <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-400">{f}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 flex gap-3 items-start">
            <Info className="w-5 h-5 text-blue-500 shrink-0" />
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Atendemos exclusivamente na Zona Sul e Centro Expandido. A massagem é realizada na sua própria cama ou sofá, garantindo máximo conforto e higiene.
            </p>
          </div>
        </div>
      )}

      {/* ================= PASSO 2: CUSTOMIZAÇÃO (O NOVO LUXO) ================= */}
      {step === 2 && (
        <div className="px-6 pt-24 animate-enter">
          <h2 className="text-2xl font-bold mb-6">Personalize</h2>
          
          {/* ONDE SERÁ FEITA */}
          <section className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Superfície (Onde faremos?)</h3>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setData({...data, surface: 'bed'})} className={`p-4 rounded-xl border transition-all ${data.surface === 'bed' ? 'bg-blue-600/20 border-blue-500 text-white' : 'glass-btn border-white/5 text-gray-400'}`}>
                <div className="font-bold text-sm mb-1">Na Cama / Sofá</div>
                <div className="text-[10px] opacity-70">Máximo conforto</div>
              </button>
              <button onClick={() => setData({...data, surface: 'floor'})} className={`p-4 rounded-xl border transition-all ${data.surface === 'floor' ? 'bg-blue-600/20 border-blue-500 text-white' : 'glass-btn border-white/5 text-gray-400'}`}>
                <div className="font-bold text-sm mb-1">No Chão / Tapete</div>
                <div className="text-[10px] opacity-70">Maior firmeza</div>
              </button>
            </div>
          </section>

          {/* EXTRAS */}
          <section className="mb-8 space-y-3">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Upgrades</h3>
             
             {/* TOQUE */}
             <button onClick={() => toggleExtra('touch')} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${data.extras.touch ? 'bg-red-500/10 border-red-500/50' : 'glass-btn border-white/5'}`}>
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.extras.touch ? 'bg-red-500 text-white' : 'bg-white/10 text-gray-400'}`}><Heart size={14}/></div>
                 <div className="text-left"><div className="text-sm font-bold">Toque Interativo</div><div className="text-[10px] text-gray-400">Permite tocar no massagista</div></div>
               </div>
               <span className="text-sm font-bold text-red-400">+ {formatMoney(CONFIG.PRICES.TOUCH)}</span>
             </button>

             {/* TEMPO */}
             <button onClick={() => toggleExtra('time')} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${data.extras.time ? 'bg-blue-500/10 border-blue-500/50' : 'glass-btn border-white/5'}`}>
               <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.extras.time ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-400'}`}><Clock size={14}/></div>
                 <div className="text-left"><div className="text-sm font-bold">Sessão Estendida</div><div className="text-[10px] text-gray-400">+30 Minutos de duração</div></div>
               </div>
               <span className="text-sm font-bold text-blue-400">+ {formatMoney(data.service.price * CONFIG.PRICES.UPGRADE_TIME)}</span>
             </button>
          </section>

          {/* VIBE */}
          <section className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Trilha Sonora</h3>
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {vibes.map(v => (
                <button key={v.id} onClick={() => setData({...data, vibe: v})} className={`flex items-center gap-2 px-4 py-3 rounded-lg border whitespace-nowrap transition-all ${data.vibe?.id === v.id ? 'bg-white text-black border-white' : 'glass-btn border-white/10 text-gray-400'}`}>
                  {v.icon} <span className="text-xs font-bold">{v.label}</span>
                </button>
              ))}
            </div>
          </section>

          <button onClick={() => setStep(3)} className="w-full primary-btn py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mb-8">
            Escolher Local <ArrowRight size={20} />
          </button>
        </div>
      )}

      {/* ================= PASSO 3: LOGÍSTICA & DATA ================= */}
      {step === 3 && (
        <div className="px-6 pt-24 animate-enter">
          <h2 className="text-2xl font-bold mb-6">Logística</h2>

          <section className="mb-6">
            <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Sua Região</h3>
            <div className="space-y-2">
              {spZones.map(z => (
                <button key={z.id} onClick={() => setData({...data, zone: z})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${data.zone?.id === z.id ? 'bg-blue-600/20 border-blue-500' : 'glass-btn border-white/5'}`}>
                   <div className="flex items-center gap-3">
                     <MapPin size={16} className={data.zone?.id === z.id ? 'text-blue-400' : 'text-gray-500'} />
                     <div className="text-left">
                       <div className={`text-sm font-bold ${data.zone?.id === z.id ? 'text-white' : 'text-gray-300'}`}>{z.name}</div>
                       <div className="text-[10px] text-gray-500">Chegada est: {z.time}</div>
                     </div>
                   </div>
                   {z.surcharge > 0 && <span className="text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">+ {formatMoney(z.surcharge)}</span>}
                </button>
              ))}
            </div>
          </section>

          {data.zone && (
            <section className="mb-8 animate-enter">
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Para Quando?</h3>
               <div className="glass-card p-4 rounded-xl mb-4">
                 <input type="date" onChange={(e) => setData({...data, date: e.target.value})} className="w-full bg-transparent text-white border-b border-white/10 py-2 mb-4 outline-none text-lg font-medium" />
                 <div className="grid grid-cols-4 gap-2">
                   {['14:00', '16:00', '19:00', '21:00'].map(t => (
                     <button key={t} onClick={() => setData({...data, time: t})} className={`py-2 rounded-lg text-sm font-bold border transition-all ${data.time === t ? 'bg-blue-500 text-white border-blue-500' : 'border-white/10 text-gray-400 hover:bg-white/5'}`}>{t}</button>
                   ))}
                 </div>
               </div>
               
               <button disabled={!data.date || !data.time} onClick={() => setStep(4)} className="w-full primary-btn py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                 Ir para Pagamento
               </button>
            </section>
          )}
        </div>
      )}

      {/* ================= PASSO 4: CHECKOUT SEM LOGIN ================= */}
      {step === 4 && (
        <div className="px-6 pt-24 animate-enter safe-bottom">
          <h2 className="text-2xl font-bold mb-6">Resumo</h2>
          
          <div className="glass-card p-6 rounded-2xl mb-6 border-t-4 border-t-blue-500">
             <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
               <div>
                 <h3 className="text-lg font-bold text-white">{data.service.name}</h3>
                 <p className="text-xs text-gray-400">{data.date} às {data.time}</p>
                 <p className="text-xs text-gray-400">{data.zone.name}</p>
               </div>
               <span className="text-xl font-bold text-blue-400">{formatMoney(data.service.price)}</span>
             </div>
             
             <div className="space-y-2 mb-4">
               {data.extras.touch && <div className="flex justify-between text-sm text-gray-300"><span>Toque Interativo</span><span>{formatMoney(CONFIG.PRICES.TOUCH)}</span></div>}
               {data.extras.time && <div className="flex justify-between text-sm text-gray-300"><span>Tempo Extra</span><span>{formatMoney(data.service.price * CONFIG.PRICES.UPGRADE_TIME)}</span></div>}
               {data.zone.surcharge > 0 && <div className="flex justify-between text-sm text-yellow-500/80"><span>Taxa Região</span><span>{formatMoney(data.zone.surcharge)}</span></div>}
             </div>

             <div className="flex justify-between items-end pt-4 border-t border-white/10">
               <span className="text-sm text-gray-500 font-bold uppercase">Total Estimado</span>
               <span className="text-2xl font-bold text-white">{formatMoney(calcTotal())}</span>
             </div>
          </div>

          <div className="mb-6">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block tracking-widest">Como prefere ser chamado?</label>
            <input 
              value={data.clientName} 
              onChange={e => setData({...data, clientName: e.target.value})}
              placeholder="Seu nome ou apelido" 
              className="w-full glass-card p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
             <button onClick={() => setData({...data, payment: 'pix'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${data.payment === 'pix' ? 'bg-green-500/10 border-green-500 text-green-400' : 'glass-btn border-white/5 text-gray-500'}`}>
               <QrCode /> <span className="text-xs font-bold">PIX (5% OFF)</span>
             </button>
             <button onClick={() => setData({...data, payment: 'card'})} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${data.payment === 'card' ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'glass-btn border-white/5 text-gray-500'}`}>
               <CreditCard /> <span className="text-xs font-bold">Cartão</span>
             </button>
          </div>

          <button onClick={handleWhatsApp} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.4)] flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
            <MessageCircle size={20} />
            FINALIZAR NO WHATSAPP
          </button>
          <p className="text-[10px] text-center text-gray-500 mt-4 px-4">
            Ao clicar, você será redirecionado para o WhatsApp Business Oficial para confirmação segura e envio da localização exata.
          </p>
        </div>
      )}
    </div>
  );
}
