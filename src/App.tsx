import { useState, useEffect } from 'react';
import { 
  MapPin, Calendar, Clock, Check, Star, 
  Sparkles, ArrowRight, Shield, Zap, 
  Trophy, Lock, Flame, Navigation
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS & CONFIGURAÇÕES (PREMIUM DARK)
// ==================================================================================
const styles = `
  :root { --primary: #0A84FF; --gold: #FFD60A; --bg: #000000; --card: #121212; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  
  body { 
    background-color: var(--bg); color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    overscroll-behavior-y: none;
    margin: 0; padding: 0;
  }

  /* Animação de Carregamento */
  .loader-ring {
    display: inline-block; position: relative; width: 64px; height: 64px;
  }
  .loader-ring div {
    box-sizing: border-box; display: block; position: absolute;
    width: 51px; height: 51px; margin: 6px; border: 3px solid #fff;
    border-radius: 50%; animation: loader-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #0A84FF transparent transparent transparent;
  }
  .loader-ring div:nth-child(1) { animation-delay: -0.45s; }
  .loader-ring div:nth-child(2) { animation-delay: -0.3s; }
  .loader-ring div:nth-child(3) { animation-delay: -0.15s; }
  @keyframes loader-ring { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

  /* UI Elements */
  .glass-card {
    background: #121212; border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 10px 40px rgba(0,0,0,0.6);
  }
  
  .btn-primary {
    background: var(--primary); color: white; border: none; font-weight: 700;
    box-shadow: 0 0 20px rgba(10, 132, 255, 0.3); transition: all 0.2s ease;
  }
  .btn-primary:active { transform: scale(0.97); opacity: 0.9; }

  .fade-in { animation: fadeIn 0.6s ease forwards; opacity: 0; transform: translateY(10px); }
  @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
  
  .progress-bar { transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
`;

// ==================================================================================
// 2. BANCO DE DADOS (TEXTOS REAIS & REGRAS)
// ==================================================================================

const SERVICES = [
  { 
    id: 'masculina', title: 'Massagem Masculina', price: 155, duration: '60 min', 
    tag: 'EXPERIÊNCIA COMPLETA 🔥',
    desc: 'O protocolo mais procurado. Relaxamento muscular seguido de toques íntimos e finalização manual intensa.',
    features: ['Sigilo Total', 'Toque Íntimo Liberado', 'Finalização (Pode gozar)', 'Sem tabus']
  },
  { 
    id: 'relaxante', title: 'Relaxante Corporal', price: 125, duration: '50 min', 
    tag: 'TIRE O STRESS',
    desc: 'Foco em dores e cansaço. Massagem no corpo todo para zerar o stress de São Paulo.',
    features: ['Corpo Todo', 'Mãos Leves', 'Sem Toque Íntimo', 'Apenas Relaxamento']
  }
];

const REVIEWS = [
  { text: "Sou casado, o sigilo foi 100%. A finalização foi absurda, gozei gostoso demais.", author: "Anônimo (Zona Sul)", stars: 5 },
  { text: "Empresário, vivo na correria. Foi direto ao ponto, sem enrolação. Recomendo.", author: "R. M.", stars: 5 },
  { text: "Tava carente há meses. O toque dela me resgatou. Voltarei semana que vem.", author: "M. (Vila Madalena)", stars: 5 },
  { text: "Ambiente discreto. A massagem relaxante tira o peso das costas mesmo.", author: "Felipe T.", stars: 5 }
];

const LEVELS = [
  { name: 'Novato', min: 0, icon: '🛡️' },
  { name: 'Cliente VIP', min: 300, icon: '🥈' },
  { name: 'Elite SP', min: 800, icon: '👑' },
];

// ==================================================================================
// 3. APP LÓGICA
// ==================================================================================

export default function SPMassageApp() {
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('home'); 
  
  // Gamificação Persistente
  const [userStats, setUserStats] = useState({ spent: 0, level: 'Novato' });

  // Carrinho
  const [selection, setSelection] = useState({
    service: null,
    date: null,
    time: null,
    addressType: 'apt', // 'apt' ou 'casa'
    address: '',
    neighborhood: '',
    aroma: false,
    coupon: false
  });

  // Init
  useEffect(() => {
    // Simula carregamento de segurança
    setTimeout(() => setLoading(false), 2500);

    // Carrega dados do usuário
    const saved = localStorage.getItem('sp_massage_user');
    if (saved) setUserStats(JSON.parse(saved));
  }, []);

  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

  // Cálculos
  const currentLevelIdx = LEVELS.findIndex(l => userStats.spent < l.min) === -1 ? LEVELS.length - 1 : LEVELS.findIndex(l => userStats.spent < l.min) - 1;
  const currentLevel = LEVELS[currentLevelIdx];
  const nextLevel = LEVELS[currentLevelIdx + 1];
  const progressPercent = nextLevel ? ((userStats.spent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

  const total = (selection.service?.price || 0) + 
                (selection.aroma ? 10 : 0) - 
                (selection.coupon ? 10 : 0);

  // --- COMPONENTES ---

  const LoadingScreen = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="loader-ring"><div></div><div></div><div></div><div></div></div>
      <h2 className="mt-8 text-xl font-bold text-white tracking-widest uppercase">Thalyson SP</h2>
      <p className="text-[#0A84FF] text-xs font-mono mt-2 animate-pulse">Estabelecendo conexão segura...</p>
      <div className="absolute bottom-10 flex items-center gap-2 text-gray-600 text-[10px] uppercase">
        <Lock className="w-3 h-3" /> Ambienta Seguro & Discreto
      </div>
    </div>
  );

  const GamificationBar = () => (
    <div className="mx-6 mt-4 mb-6 p-4 rounded-2xl bg-[#121212] border border-white/10 relative overflow-hidden">
      <div className="flex justify-between items-center mb-2 relative z-10">
        <div className="flex items-center gap-2">
           <span className="text-xl">{currentLevel.icon}</span>
           <div>
             <p className="text-[10px] text-gray-500 font-bold uppercase">Seu Status</p>
             <h3 className="text-white font-bold text-sm">{currentLevel.name}</h3>
           </div>
        </div>
        <div className="text-right">
           <p className="text-[10px] text-gray-500 font-bold uppercase">Investido</p>
           <p className="text-[#0A84FF] font-mono font-bold">R$ {userStats.spent}</p>
        </div>
      </div>
      
      {/* Barra */}
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
         <div className="h-full bg-[#0A84FF] progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      {nextLevel && (
        <p className="text-[10px] text-gray-600 mt-2 text-center relative z-10">
          Faltam R$ {nextLevel.min - userStats.spent} para subir de nível
        </p>
      )}
    </div>
  );

  const ReviewsCarousel = () => {
    const [idx, setIdx] = useState(0);
    useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS.length), 4000); return () => clearInterval(t); }, []);
    return (
      <div className="px-6 mb-8">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Avaliações Reais</h3>
        <div className="bg-[#121212] border border-white/5 p-4 rounded-xl min-h-[100px] flex flex-col justify-center relative">
           <div className="flex gap-1 mb-2">
             {[...Array(5)].map((_,i) => <Star key={i} className="w-3 h-3 text-[#FFD60A] fill-[#FFD60A]" />)}
           </div>
           <p className="text-sm text-gray-300 italic leading-relaxed">"{REVIEWS[idx].text}"</p>
           <p className="text-[10px] text-gray-500 font-bold mt-2 text-right uppercase">- {REVIEWS[idx].author}</p>
        </div>
      </div>
    );
  }

  // --- FLUXO DE TELAS ---

  if (loading) return <>
    <style>{styles}</style>
    <LoadingScreen />
  </>;

  if (view === 'home') return (
    <div className="min-h-screen pb-32">
      <style>{styles}</style>
      
      {/* Header */}
      <div className="pt-12 px-6 pb-4 bg-gradient-to-b from-black via-black to-transparent sticky top-0 z-20">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Massagem<span className="text-[#0A84FF]">SP</span></h1>
            <div className="px-3 py-1 bg-white/10 rounded-full flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#0A84FF]" />
                <span className="text-[10px] font-bold text-gray-300">São Paulo</span>
            </div>
        </div>
        <p className="text-gray-500 text-xs mt-1">Discrição total para homens exigentes.</p>
      </div>

      <GamificationBar />

      {/* Serviços */}
      <div className="px-6 space-y-4 fade-in">
        {SERVICES.map(s => (
          <div key={s.id} onClick={() => { triggerHaptic(); setSelection({...selection, service: s}); setView('booking'); }} 
               className={`glass-card p-5 rounded-2xl relative overflow-hidden active:scale-[0.98] transition-all border-l-4 ${s.id === 'masculina' ? 'border-l-[#0A84FF]' : 'border-l-gray-600'}`}>
             
             {s.tag && <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl">{s.tag}</div>}
             
             <div className="flex justify-between items-start mb-2">
               <h3 className="text-lg font-bold text-white">{s.title}</h3>
               <span className="text-lg font-bold text-[#0A84FF]">R$ {s.price}</span>
             </div>
             
             <p className="text-sm text-gray-400 mb-4 leading-relaxed">{s.desc}</p>
             
             <div className="grid grid-cols-2 gap-2">
                {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-gray-300 uppercase font-bold">{f}</span>
                    </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      <div className="mt-8"><ReviewsCarousel /></div>
    </div>
  );

  if (view === 'booking') return (
    <div className="min-h-screen pb-40">
      <style>{styles}</style>
      
      {/* Nav Back */}
      <div className="pt-12 px-6 mb-6">
        <button onClick={() => setView('home')} className="text-gray-500 text-sm flex items-center gap-1 hover:text-white"><ArrowRight className="w-4 h-4 rotate-180"/> Voltar</button>
        <h2 className="text-2xl font-bold text-white mt-2">Personalizar</h2>
      </div>

      <div className="px-6 space-y-8 fade-in">
        
        {/* Endereço */}
        <section>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><MapPin className="w-3 h-3 text-[#0A84FF]"/> Onde Atender?</h3>
           
           {/* Tipo de Local */}
           <div className="grid grid-cols-2 gap-3 mb-4">
              <button onClick={() => setSelection({...selection, addressType: 'apt'})} className={`p-3 rounded-xl border text-sm font-bold transition-all ${selection.addressType === 'apt' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>🏢 Apartamento</button>
              <button onClick={() => setSelection({...selection, addressType: 'casa'})} className={`p-3 rounded-xl border text-sm font-bold transition-all ${selection.addressType === 'casa' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>🏠 Casa</button>
           </div>

           <input value={selection.address} onChange={e => setSelection({...selection, address: e.target.value})} placeholder="Rua e Número" className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none mb-3" />
           <input value={selection.neighborhood} onChange={e => setSelection({...selection, neighborhood: e.target.value})} placeholder="Bairro (Para cálculo do Uber)" className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none" />
           
           {/* Alerta Uber */}
           <div className="mt-3 p-3 bg-[#0A84FF]/10 border border-[#0A84FF]/20 rounded-xl flex gap-3">
              <Navigation className="w-4 h-4 text-[#0A84FF] flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-300 leading-tight">
                 <span className="text-white font-bold">Política Uber:</span> Até 500m do meu local é <span className="text-green-400">Grátis</span>. Acima de 1km, calculamos a taxa exata no WhatsApp.
              </p>
           </div>
        </section>

        {/* Data e Hora */}
        <section>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Calendar className="w-3 h-3 text-[#0A84FF]"/> Horário</h3>
           <div className="flex gap-2 overflow-x-auto pb-2">
              {['Hoje', 'Amanhã', 'Sexta'].map(d => (
                 <button key={d} onClick={() => setSelection({...selection, date: d})} className={`px-4 py-2 rounded-lg text-xs font-bold border whitespace-nowrap ${selection.date === d ? 'bg-white text-black' : 'bg-[#121212] border-white/10 text-gray-400'}`}>{d}</button>
              ))}
           </div>
           {selection.date && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                 {['14:00', '16:00', '19:00', '21:00'].map(t => (
                    <button key={t} onClick={() => setSelection({...selection, time: t})} className={`py-2 rounded-lg text-xs font-bold border ${selection.time === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>{t}</button>
                 ))}
              </div>
           )}
        </section>

        {/* Extras */}
        <section>
           <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles className="w-3 h-3 text-[#0A84FF]"/> Adicionais</h3>
           
           <button onClick={() => setSelection({...selection, aroma: !selection.aroma})} className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${selection.aroma ? 'bg-green-500/10 border-green-500/50' : 'bg-[#121212] border-white/10'}`}>
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selection.aroma ? 'bg-green-500 text-black' : 'bg-gray-800 text-gray-500'}`}><Zap className="w-4 h-4"/></div>
                 <div className="text-left"><p className="text-white font-bold text-sm">Aromaterapia</p><p className="text-[10px] text-gray-400">Ambiente perfumado e imersivo</p></div>
              </div>
              <span className="text-green-400 font-bold text-sm">+ R$ 10,00</span>
           </button>

           {/* Cupom */}
           {!selection.coupon ? (
             <div onClick={() => { triggerHaptic(); setSelection({...selection, coupon: true}); }} className="mt-4 p-4 border border-dashed border-[#FFD60A]/30 bg-[#FFD60A]/5 rounded-xl text-center cursor-pointer active:scale-95 transition-transform">
                <p className="text-[#FFD60A] text-xs font-bold uppercase tracking-widest animate-pulse">Toque para ativar Cupom R$ 10</p>
             </div>
           ) : (
             <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-green-500" /> <span className="text-green-400 text-xs font-bold">Desconto Aplicado!</span>
             </div>
           )}
        </section>

      </div>

      {/* FOOTER CHECKOUT */}
      <div className="fixed bottom-0 w-full z-30">
        <div className="h-10 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        <div className="bg-[#121212] border-t border-white/10 p-5 rounded-t-[25px] shadow-[0_-10px_50px_rgba(0,0,0,0.9)]">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <p className="text-xs text-gray-500 uppercase font-bold">Total Estimado</p>
                  {selection.aroma && <span className="text-[10px] text-gray-400 block">+ Aroma Incluso</span>}
                  {selection.coupon && <span className="text-[10px] text-green-400 block">- Desconto R$ 10</span>}
               </div>
               <div className="text-right">
                  <h2 className="text-3xl font-bold text-white tracking-tighter">R$ {total}</h2>
                  <p className="text-[10px] text-[#0A84FF] font-bold">+ Taxa Uber (A calcular)</p>
               </div>
            </div>

            <button 
               disabled={!selection.address || !selection.time}
               onClick={() => {
                   // Salva gamificação
                   const newStats = { ...userStats, spent: userStats.spent + total };
                   localStorage.setItem('sp_massage_user', JSON.stringify(newStats));
                   
                   // Gera Link Zap
                   const msg = `*NOVO AGENDAMENTO SP* 🏢
--------------------------------
👤 *Cliente:* Anônimo
💆 *Serviço:* ${selection.service.title}
💰 *Valor Base:* R$ ${selection.service.price}

📍 *Local:* ${selection.addressType === 'apt' ? 'Apartamento' : 'Casa'}
🏠 *Endereço:* ${selection.address}
🏘 *Bairro:* ${selection.neighborhood}
_(Verificar taxa Uber: <500m Free / >1km Calcular)_

📅 *Data:* ${selection.date} às ${selection.time}

*ADICIONAIS:*
${selection.aroma ? '✅ Aromaterapia (+R$ 10)' : '❌ Sem Aroma'}
${selection.coupon ? '🎟 CUPOM ATIVO (-R$ 10)' : ''}

*TOTAL PENDENTE: R$ ${total},00* (+ Uber)
--------------------------------`;
                   window.open(`https://wa.me/5511999999999?text=${encodeURIComponent(msg)}`, '_blank');
               }}
               className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:shadow-none">
               <span className="font-bold">Agendar no WhatsApp</span> <ArrowRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
}
