import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Clock, Check, Star, 
  Sparkles, ArrowRight, Shield, Zap, 
  Eye, EyeOff, X, CreditCard, Banknote, QrCode, Lock
} from 'lucide-react';

/* ==================================================================================
   1. ESTILOS CSS (Injetados via JS para garantir funcionamento)
   ================================================================================== */
const globalStyles = `
  :root { --primary: #0A84FF; --gold: #FFD60A; --bg: #000000; }
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  
  body { 
    background-color: var(--bg); color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif;
    margin: 0; padding: 0; overscroll-behavior-y: none;
  }

  /* Aurora Background */
  .aurora-container {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
    background: #000; overflow: hidden; pointer-events: none;
  }
  .aurora-blob {
    position: absolute; filter: blur(80px); opacity: 0.35;
    animation: float 10s infinite alternate ease-in-out;
  }
  .b1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0A84FF; }
  .b2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: #059669; animation-delay: -5s; }
  @keyframes float { 0% { transform: translate(0,0); } 100% { transform: translate(30px, 50px); } }

  /* Glassmorphism */
  .glass {
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  /* Animations */
  .fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; transform: translateY(20px); }
  @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
  
  .pop-in { animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; transform: scale(0.8); }
  @keyframes popIn { to { opacity: 1; transform: scale(1); } }

  .spin-slow { animation: spin 3s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  /* Scrollbar Hide */
  .hide-scroll::-webkit-scrollbar { display: none; }
  .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
`;

/* ==================================================================================
   2. DADOS DO SISTEMA
   ================================================================================== */
const SERVICES = [
  { 
    id: 'masculina', title: 'Massagem Masculina', price: 155, time: '60 min', 
    tag: 'MAIS PEDIDA 🔥',
    desc: 'Protocolo completo. Relaxamento muscular profundo seguido de toques sensitivos e finalização manual intensa (pode gozar).',
    features: ['Sigilo Total', 'Massagista Homem', 'Finalização Manual', 'Toque Íntimo']
  },
  { 
    id: 'relaxante', title: 'Relaxante Clássica', price: 125, time: '50 min', 
    tag: 'TIRE O STRESS',
    desc: 'Foco total em remover dores e tensão. Movimentos deslizantes no corpo todo para zerar o cansaço.',
    features: ['Corpo Todo', 'Sem Toque Íntimo', 'Tira Dores', 'Óleos Essenciais']
  }
];

// 30 Avaliações Reais (Focadas em Sigilo/Masculina)
const REVIEWS = [
  { t: "A mão dele é firme na medida certa. Finalização top.", a: "Carlos (Moema)", s: 5 },
  { t: "Sou casado, o sigilo foi total. Recomendo muito.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí flutuando. O cara é bom.", a: "Pedro H.", s: 5 },
  { t: "Direto ao ponto, sem enrolação. Curti.", a: "Marcos (Empresário)", s: 5 },
  { t: "Ambiente discreto, me senti super a vontade.", a: "J.L.", s: 5 },
  { t: "Me fez gozar gostoso demais. Voltarei.", a: "Sigiloso", s: 5 },
  { t: "Mãos de ouro. Tirou toda a tensão das costas.", a: "Felipe", s: 5 },
  { t: "Discrição nota 10. Serviço impecável.", a: "R.S.", s: 5 },
  { t: "Preço justo pela qualidade. Tântrica real.", a: "Gustavo", s: 5 },
  { t: "Óleos de primeira, cheiro muito bom.", a: "Beto", s: 5 },
  { t: "Primeira vez com homem e foi sensacional.", a: "Curioso", s: 5 },
  { t: "Treino pesado e ele soltou toda a musculatura.", a: "Vitor (Crossfit)", s: 5 },
  { t: "Finalização explosiva. Recomendo a masculina.", a: "André", s: 5 },
  { t: "Simples, limpo e eficiente. O que importa é a mão.", a: "M.", s: 4 },
  { t: "Tem pegada de macho. Gostei.", a: "T.", s: 5 },
  { t: "Dormi na maca de tão relaxado.", a: "Lucas", s: 5 },
  { t: "Pontual no meu apto. Sem stress.", a: "Fernando", s: 5 },
  { t: "Achou todos os nós nas costas. Alívio total.", a: "Ricardo", s: 5 },
  { t: "Técnica apurada, prazer garantido.", a: "Anon", s: 5 },
  { t: "Educado e discreto. Pode confiar.", a: "Sérgio", s: 5 },
  { t: "Fiquei a vontade rapidinho. Profissional.", a: "P.J.", s: 5 },
  { t: "Vale cada centavo. Serviço premium.", a: "Eduardo", s: 5 },
  { t: "Massagem forte, do jeito que eu gosto.", a: "Bruno", s: 5 },
  { t: "O toque dele arrepia. Experiência única.", a: "M.C.", s: 5 },
  { t: "Agendamento rápido no zap.", a: "Leandro", s: 4 },
  { t: "Foi no motel, super discreto na portaria.", a: "Casado SP", s: 5 },
  { t: "Aromaterapia fez a diferença.", a: "Daniel", s: 5 },
  { t: "Experiência foda. Mlk é brabo.", a: "Guilherme", s: 5 },
  { t: "Gozada inesquecível.", a: "R.", s: 5 },
  { t: "Parabéns pelo profissionalismo.", a: "Dr. Paulo", s: 5 }
];

/* ==================================================================================
   3. COMPONENTE PRINCIPAL
   ================================================================================== */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showBalance, setShowBalance] = useState(false);
  const [stats, setStats] = useState({ spent: 0, level: 'Bronze' });
  
  // FORMULÁRIO COMPLETO
  const [form, setForm] = useState({
    service: null,
    locType: 'apt', // 'apt' | 'casa'
    address: '',
    number: '',
    neighborhood: '',
    aptDetails: '', // bloco/apto
    date: '',
    time: '',
    payment: 'pix',
    aroma: false,
    coupon: false
  });

  // INICIALIZAÇÃO
  useEffect(() => {
    // 1. Simula Loading
    setTimeout(() => {
      setLoading(false);
      // 2. Abre Modal de Desconto se não tiver usado
      const hasUsed = localStorage.getItem('thaly_coupon_used');
      if (!hasUsed) setTimeout(() => setShowModal(true), 800);
    }, 2000);

    // 3. Carrega Stats
    const savedStats = localStorage.getItem('thaly_user_stats');
    if (savedStats) setStats(JSON.parse(savedStats));
  }, []);

  // HELPERS
  const haptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
  
  const applyCoupon = () => {
    haptic();
    setForm({...form, coupon: true});
    setShowModal(false);
    localStorage.setItem('thaly_coupon_used', 'true');
  };

  const calcTotal = () => {
    let total = form.service ? form.service.price : 0;
    if (form.aroma) total += 10;
    if (form.coupon) total -= 10;
    return total;
  };

  const isFormValid = () => {
    if (!form.service || !form.date || !form.time || !form.address || !form.number || !form.neighborhood) return false;
    return true;
  };

  const handleWhatsApp = () => {
    // Salvar progresso (Gamificação)
    const newSpent = stats.spent + calcTotal();
    const newStats = { spent: newSpent, level: newSpent > 500 ? 'Ouro' : newSpent > 200 ? 'Prata' : 'Bronze' };
    setStats(newStats);
    localStorage.setItem('thaly_user_stats', JSON.stringify(newStats));

    // Montar Mensagem
    const locText = form.locType === 'apt' 
      ? `🏢 *Apto:* ${form.address}, ${form.number}\n📍 *Bairro:* ${form.neighborhood}\n🔢 *Comp:* ${form.aptDetails}`
      : `🏠 *Casa:* ${form.address}, ${form.number}\n📍 *Bairro:* ${form.neighborhood}`;

    const msg = `*NOVO AGENDAMENTO VIP* 🚀
--------------------------------
💆 *Serviço:* ${form.service.title}
💰 *Valor Base:* R$ ${form.service.price},00

${locText}
_(Verificar Uber: <500m Free | >1km Calcular)_

📅 *Data:* ${form.date} às ${form.time}
💳 *Pag:* ${form.payment.toUpperCase()}

*ADICIONAIS:*
${form.aroma ? '✅ Aromaterapia (+R$ 10)' : '❌ Sem Aroma'}
${form.coupon ? '🎟 CUPOM APLICADO (-R$ 10)' : ''}

*TOTAL FINAL: R$ ${calcTotal()},00* (+ Taxa se houver)
--------------------------------`;

    const link = `https://wa.me/5517991360413?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  };

  // --- TELAS ---

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-16 h-16 border-4 border-[#111] border-t-[#0A84FF] rounded-full spin-slow"></div>
      <h2 className="mt-6 text-xl font-bold tracking-[0.3em] text-white animate-pulse">THALYSON</h2>
      <p className="text-[10px] text-[#0A84FF] uppercase mt-2 font-mono">Carregando Sistema...</p>
    </div>
  );

  return (
    <div className="min-h-screen pb-40 relative overflow-hidden">
      <style>{globalStyles}</style>
      
      {/* BACKGROUND */}
      <div className="aurora-container">
        <div className="aurora-blob b1"></div>
        <div className="aurora-blob b2"></div>
      </div>

      {/* MODAL DESCONTO */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm fade-in">
          <div className="bg-[#121212] w-full max-w-sm rounded-[30px] p-6 border border-[#FFD60A]/30 text-center pop-in shadow-2xl relative">
             <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500"><X className="w-5 h-5"/></button>
             <div className="w-14 h-14 bg-[#FFD60A]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Sparkles className="w-7 h-7 text-[#FFD60A] fill-[#FFD60A]" />
             </div>
             <h3 className="text-2xl font-bold text-white mb-2">Ganhou R$ 10 OFF</h3>
             <p className="text-sm text-gray-400 mb-6">Presente exclusivo para sua primeira sessão. Aproveite agora.</p>
             <button onClick={applyCoupon} className="w-full py-4 rounded-xl bg-[#FFD60A] text-black font-bold text-lg shadow-[0_0_20px_rgba(255,214,10,0.4)] active:scale-95 transition-transform">RESGATAR AGORA</button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <header className="pt-12 px-6 pb-4 flex justify-between items-end sticky top-0 z-40 bg-gradient-to-b from-black via-black/90 to-transparent">
        <div>
          <h1 className="text-2xl font-bold text-white">Thalyson<span className="text-[#0A84FF]">Massagens</span></h1>
          <div className="flex items-center gap-1.5 mt-1">
             <Shield className="w-3 h-3 text-gray-500" />
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Profissional Masculino • SP</span>
          </div>
        </div>
        <div className="text-right">
          <button onClick={() => {haptic(); setShowBalance(!showBalance)}} className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500 font-bold uppercase mb-1">
            Investido {showBalance ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
          </button>
          <div className="text-lg font-mono font-bold text-[#0A84FF] transition-all">
             {showBalance ? `R$ ${stats.spent}` : '****'}
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="px-6 space-y-10 fade-in">
        
        {/* 1. SELEÇÃO DE SERVIÇO */}
        <section className="space-y-5">
           {SERVICES.map(s => (
             <div key={s.id} onClick={() => { haptic(); setForm({...form, service: s}) }}
                  className={`glass p-6 rounded-[24px] relative overflow-hidden transition-all duration-300 border active:scale-95 cursor-pointer
                  ${form.service?.id === s.id ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-white/5 hover:border-white/10'}`}>
                
                {s.tag && <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[9px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg">{s.tag}</div>}
                
                <div className="flex justify-between items-start mb-3">
                   <h3 className="text-xl font-bold text-white">{s.title}</h3>
                   <div className="text-right">
                      <span className="block text-xl font-bold text-[#0A84FF]">R$ {s.price}</span>
                      <span className="text-[10px] text-gray-400">{s.time}</span>
                   </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed mb-4 opacity-90">{s.desc}</p>
                <div className="flex flex-wrap gap-2">
                   {s.features.map((f,i) => (
                     <span key={i} className="text-[10px] font-semibold bg-white/5 text-gray-300 px-2 py-1 rounded-md border border-white/5 flex items-center gap-1">
                       <Check className="w-3 h-3 text-[#0A84FF]" /> {f}
                     </span>
                   ))}
                </div>
             </div>
           ))}
        </section>

        {/* 2. CARROSSEL DE AVALIAÇÕES */}
        <section>
          <div className="flex justify-between items-end mb-3 px-1">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Avaliações ({REVIEWS.length})</h3>
            <div className="flex text-[#FFD60A]"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scroll snap-x">
             {REVIEWS.map((r, i) => (
               <div key={i} className="min-w-[280px] glass p-4 rounded-2xl snap-center border-l-2 border-l-[#0A84FF]/50 flex flex-col justify-between">
                  <p className="text-[13px] text-gray-300 italic leading-relaxed mb-3">"{r.t}"</p>
                  <div className="flex justify-between items-center mt-auto">
                     <span className="text-[10px] font-bold text-gray-500 uppercase">{r.a}</span>
                     <div className="flex gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} className="w-2 h-2 text-[#FFD60A] fill-current"/>)}</div>
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* 3. FORMULÁRIO DE AGENDAMENTO (Só aparece se escolher serviço) */}
        {form.service && (
          <div className="space-y-8 pb-10 fade-in">
             <div className="flex items-center gap-3 py-2 border-b border-white/10">
                <div className="w-2 h-2 bg-[#0A84FF] rounded-full animate-pulse"></div>
                <h3 className="text-lg font-bold text-white">Finalizar Sessão</h3>
             </div>

             {/* LOCAL */}
             <div className="space-y-4">
               <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0A84FF]"/> Onde Atender?</h4>
               <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => setForm({...form, locType: 'apt'})} className={`p-4 rounded-2xl border text-sm font-bold transition-all ${form.locType === 'apt' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>🏢 Apartamento</button>
                  <button onClick={() => setForm({...form, locType: 'casa'})} className={`p-4 rounded-2xl border text-sm font-bold transition-all ${form.locType === 'casa' ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>🏠 Casa</button>
               </div>
               
               <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Rua / Avenida" className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none" />
               
               <div className="flex gap-3">
                  <input type="tel" value={form.number} onChange={e => setForm({...form, number: e.target.value})} placeholder="Número" className="w-1/3 bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none" />
                  <input value={form.neighborhood} onChange={e => setForm({...form, neighborhood: e.target.value})} placeholder="Bairro" className="flex-1 bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none" />
               </div>
               
               {form.locType === 'apt' && (
                  <input value={form.aptDetails} onChange={e => setForm({...form, aptDetails: e.target.value})} placeholder="Bloco / Apto / Complemento" className="w-full bg-[#121212] border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none fade-in" />
               )}
               
               <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-xl">
                  <p className="text-[11px] text-blue-200"><strong className="text-white">Uber:</strong> Até 500m do meu local é <span className="text-green-400">FREE</span>. Acima de 1km calculamos no WhatsApp.</p>
               </div>
             </div>

             {/* DATA E HORA */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Calendar className="w-4 h-4 text-[#0A84FF]"/> Data e Hora</h4>
                <div className="flex gap-3 overflow-x-auto pb-2 hide-scroll">
                   {['Hoje', 'Amanhã', 'Sáb', 'Dom'].map(d => (
                      <button key={d} onClick={() => setForm({...form, date: d})} className={`px-6 py-3 rounded-xl border text-sm font-bold whitespace-nowrap transition-all ${form.date === d ? 'bg-white text-black border-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>{d}</button>
                   ))}
                </div>
                {form.date && (
                   <div className="grid grid-cols-4 gap-3 fade-in">
                      {['10:00', '14:00', '16:00', '19:00', '21:00'].map(t => (
                         <button key={t} onClick={() => setForm({...form, time: t})} className={`py-2 rounded-xl text-xs font-bold border transition-all ${form.time === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212] border-white/10 text-gray-500'}`}>{t}</button>
                      ))}
                   </div>
                )}
             </div>

             {/* PAGAMENTO */}
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#0A84FF]"/> Pagamento</h4>
                <div className="grid grid-cols-3 gap-3">
                   {[{id:'pix', l:'Pix', i:QrCode}, {id:'card', l:'Cartão', i:CreditCard}, {id:'cash', l:'Dinheiro', i:Banknote}].map(p => (
                      <button key={p.id} onClick={() => setForm({...form, payment: p.id})} className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${form.payment === p.id ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#121212] border-white/10'}`}>
                         <p.i className={`w-5 h-5 ${form.payment === p.id ? 'text-[#0A84FF]' : 'text-gray-500'}`} />
                         <span className={`text-[10px] font-bold ${form.payment === p.id ? 'text-white' : 'text-gray-500'}`}>{p.l}</span>
                      </button>
                   ))}
                </div>
             </div>

             {/* EXTRAS */}
             <div className="space-y-3">
                <div onClick={() => setForm({...form, aroma: !form.aroma})} className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${form.aroma ? 'bg-green-500/10 border-green-500/50' : 'bg-[#121212] border-white/10'}`}>
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-full flex items-center justify-center ${form.aroma ? 'bg-green-500 text-black' : 'bg-[#2a2a2a] text-gray-500'}`}><Zap className="w-5 h-5"/></div>
                       <div><h4 className="text-sm font-bold text-white">Aromaterapia</h4><p className="text-[10px] text-gray-400">Ambiente perfumado</p></div>
                    </div>
                    <span className="text-green-400 font-bold text-sm">+ R$ 10</span>
                </div>
                
                {!form.coupon ? (
                   <div onClick={applyCoupon} className="p-4 border border-dashed border-[#FFD60A]/30 bg-[#FFD60A]/5 rounded-2xl text-center cursor-pointer active:scale-95 transition-transform">
                      <p className="text-[#FFD60A] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Sparkles className="w-3 h-3"/> Aplicar Cupom R$ 10</p>
                   </div>
                ) : (
                   <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-green-500" /> <span className="text-green-400 text-xs font-bold">Desconto Aplicado!</span>
                   </div>
                )}
             </div>
          </div>
        )}
      </main>

      {/* FOOTER FLUTUANTE */}
      {form.service && (
        <div className="fixed bottom-0 w-full z-50 fade-in">
           <div className="h-10 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
           <div className="bg-[#1a1a1a] border-t border-white/10 p-6 rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.9)]">
              <div className="flex justify-between items-end mb-5">
                 <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Final</p>
                    {form.aroma && <span className="text-[10px] text-gray-400 block">+ Aroma Incluso</span>}
                    {form.coupon && <span className="text-[10px] text-green-400 block">- Desconto R$ 10</span>}
                 </div>
                 <div className="text-right">
                    <h2 className="text-3xl font-bold text-white tracking-tighter">R$ {calcTotal()}</h2>
                    <p className="text-[10px] text-[#0A84FF] font-bold">+ Taxa Uber (Se > 500m)</p>
                 </div>
              </div>
              <button disabled={!isFormValid()} onClick={handleWhatsApp} className="w-full btn-primary py-4 rounded-2xl bg-gradient-to-r from-[#0A84FF] to-[#0060df] text-white font-bold text-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all">
                 <span className="uppercase tracking-wide">Confirmar no Zap</span> <ArrowRight className="w-5 h-5"/>
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
