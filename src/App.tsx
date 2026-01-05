import { useState, useEffect, useRef } from 'react';
import { 
  MapPin, Calendar, Clock, Check, Star, 
  Sparkles, ArrowRight, Shield, Zap, 
  Trophy, Eye, EyeOff, X, CreditCard, Banknote, QrCode
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & AURORA BOREAL
// ==================================================================================
const styles = `
  :root { --primary: #0A84FF; --gold: #FFD60A; --bg: #000000; }
  
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; user-select: none; }
  
  body { 
    background-color: var(--bg); color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif;
    margin: 0; padding: 0; overscroll-behavior-y: none;
  }

  /* --- AURORA BOREAL ANIMATION --- */
  .aurora-bg {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1;
    background: #000;
    overflow: hidden;
  }
  .aurora-blob {
    position: absolute; filter: blur(80px); opacity: 0.4;
    animation: drift 10s infinite alternate ease-in-out;
  }
  .blob-1 { top: -10%; left: -10%; width: 50vw; height: 50vw; background: #0A84FF; animation-delay: 0s; }
  .blob-2 { bottom: -10%; right: -10%; width: 60vw; height: 60vw; background: #059669; animation-delay: -2s; }
  .blob-3 { top: 40%; left: 40%; width: 40vw; height: 40vw; background: #4f46e5; opacity: 0.2; animation-delay: -4s; }

  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(20px, 40px) scale(1.1); }
  }

  /* --- COMPONENTES UI --- */
  .glass-card {
    background: rgba(20, 20, 20, 0.65);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  }

  .btn-primary {
    background: linear-gradient(135deg, #0A84FF 0%, #0056b3 100%);
    color: white; border: none; font-weight: 700; letter-spacing: 0.5px;
    box-shadow: 0 4px 20px rgba(10, 132, 255, 0.3); transition: transform 0.2s ease;
  }
  .btn-primary:active { transform: scale(0.97); opacity: 0.95; }

  /* Animações */
  .fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  .pop-in { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; transform: scale(0.9); opacity: 0; }
  
  @keyframes fadeIn { to { opacity: 1; transform: translateY(0); } }
  @keyframes popIn { to { opacity: 1; transform: scale(1); } }
`;

// ==================================================================================
// 2. DADOS E CONTEÚDO (MASCULINO/REAL)
// ==================================================================================

const SERVICES = [
  { 
    id: 'masculina', title: 'Massagem Masculina', price: 155, duration: '60 min', 
    tag: 'MAIS PEDIDA 🔥',
    desc: 'Experiência completa. Relaxamento muscular seguido de toques sensitivos e finalização manual.',
    features: ['Massagista Homem', 'Finalização (Gozo)', 'Sigilo Total', 'Toque Íntimo']
  },
  { 
    id: 'relaxante', title: 'Relaxante Clássica', price: 125, duration: '50 min', 
    tag: 'RELAX PURO',
    desc: 'Foco total em tirar dores e tensão muscular. Ideal para quem treina ou trabalha muito.',
    features: ['Corpo Todo', 'Sem Toque Íntimo', 'Tira Dores', 'Óleos Essenciais']
  }
];

const REVIEWS = [
  { t: "Cara, o Thalyson tem a mão firme. A finalização foi absurda.", a: "Carlos (Moema)", s: 5 },
  { t: "Fui meio desconfiado, mas o cara é super profissional. Sigilo 100%.", a: "Anônimo", s: 5 },
  { t: "A massagem relaxante dele tira qualquer stress. Sai leve.", a: "Pedro H.", s: 5 },
  { t: "Gostei que ele vai direto ao ponto. Sem frescura. Recomendo.", a: "Marcos (Empresário)", s: 5 },
  { t: "Ambiente top, o cara é gente boa demais. Virei cliente fixo.", a: "J.L.", s: 5 },
  { t: "Toque sensitivo de verdade. Me fez gozar gostoso no final.", a: "Sigiloso", s: 5 },
  { t: "Melhor investimento da semana. O cara entende do assunto.", a: "Felipe", s: 5 },
  { t: "Sou casado, preciso de discrição e lá encontrei. Nota 10.", a: "R.S.", s: 5 },
  { t: "Preço justo pelo serviço. A massagem tântrica é real.", a: "Gustavo", s: 4 },
  { t: "O óleo que ele usa é muito bom. Relaxamento total.", a: "Beto", s: 5 },
  { t: "Primeira vez com homem e curti muito. Respeitoso e intenso.", a: "Curioso", s: 5 },
  { t: "Cheguei travado do treino, saí zerado. Mãos de ouro.", a: "Vitor (Crossfit)", s: 5 },
  { t: "Massagem top, finalização explosiva. Voltarei.", a: "André", s: 5 },
  { t: "Acomodação simples mas limpa. O serviço compensa tudo.", a: "M.", s: 4 },
  { t: "O cara é gato e tem pegada. Recomendo a masculina.", a: "T.", s: 5 },
  { t: "Fiz a relaxante. Dormi na maca de tão bom.", a: "Lucas", s: 5 },
  { t: "Atendimento no meu apto foi pontual. Sem stress.", a: "Fernando", s: 5 },
  { t: "Sabe aqueles pontos de tensão? Ele acha todos.", a: "Ricardo", s: 5 },
  { t: "Gozada inesquecível. Técnica apurada.", a: "Anon", s: 5 },
  { t: "Muito educado e discreto. Pode ir sem medo.", a: "Sérgio", s: 5 },
  { t: "Achei que ia ficar tímido, mas ele deixa a gente a vontade.", a: "P.J.", s: 5 },
  { t: "Vale cada centavo. Serviço premium mesmo.", a: "Eduardo", s: 5 },
  { t: "Massagem forte, do jeito que homem gosta.", a: "Bruno", s: 5 },
  { t: "O toque dele arrepia. Sensação única.", a: "M.C.", s: 5 },
  { t: "Rápido no zap, agendamento fácil. Gostei.", a: "Leandro", s: 4 },
  { t: "Fiz no motel, ele foi super discreto na portaria.", a: "Casado SP", s: 5 },
  { t: "Tira toda a zica do corpo. Recomendo aromaterapia junto.", a: "Daniel", s: 5 },
  { t: "Experiência foda. O mlk é brabo.", a: "Guilherme", s: 5 },
  { t: "Satisfeito demais. Gozei litros.", a: "R.", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Parabéns.", a: "Dr. Paulo", s: 5 }
];

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [view, setView] = useState('home'); // home, booking
  const [balanceVisible, setBalanceVisible] = useState(false);
  
  // Estado do Usuário (Persistente)
  const [userStats, setUserStats] = useState({ spent: 0, saved: 0 });

  // Estado do Carrinho
  const [form, setForm] = useState({
    service: null,
    date: '',
    time: '',
    locType: 'apt', // 'apt' | 'casa'
    address: '',
    neighborhood: '',
    number: '',
    aptDetails: '', // bloco, apto
    payment: 'pix', // 'pix' | 'card' | 'cash'
    aroma: false,
    coupon: false
  });

  useEffect(() => {
    // Simula carregamento
    setTimeout(() => {
        setLoading(false);
        // Popup de desconto aparece logo após o loading
        setTimeout(() => setShowDiscount(true), 500);
    }, 2000);

    const saved = localStorage.getItem('thaly_stats_v2');
    if (saved) setUserStats(JSON.parse(saved));
  }, []);

  const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };
  
  const toggleBalance = () => setBalanceVisible(!balanceVisible);
  
  const applyCoupon = () => {
      triggerHaptic();
      setForm(prev => ({...prev, coupon: true}));
      setShowDiscount(false);
  };

  // Cálculos
  const total = (form.service?.price || 0) + (form.aroma ? 10 : 0) - (form.coupon ? 10 : 0);

  // --- COMPONENTES INTERNOS ---

  const Loading = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-t-2 border-[#0A84FF] animate-spin"></div>
        </div>
        <div className="mt-8 text-center space-y-2">
            <h2 className="text-xl font-bold tracking-[0.2em] text-white">THALYSON</h2>
            <p className="text-[10px] text-gray-500 uppercase font-mono">Massoterapia SP</p>
        </div>
    </div>
  );

  const DiscountModal = () => {
    if (!showDiscount) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#1a1a1a] border border-[#FFD60A]/30 w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden pop-in">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD60A] to-[#0A84FF]"></div>
                <button onClick={() => setShowDiscount(false)} className="absolute top-4 right-4 text-gray-500"><X className="w-5 h-5"/></button>
                
                <div className="w-16 h-16 bg-[#FFD60A]/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <Sparkles className="w-8 h-8 text-[#FFD60A]" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">Ganhe R$ 10,00 OFF</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                    Sua primeira vez aqui? Use o desconto agora e relaxe pagando menos.
                </p>
                
                <button onClick={applyCoupon} className="w-full py-4 rounded-xl bg-[#FFD60A] hover:bg-[#ffe033] text-black font-bold text-lg shadow-lg transition-transform active:scale-95">
                    QUERO MEU DESCONTO
                </button>
            </div>
        </div>
    );
  };

  const Reviews = () => {
    // Auto-scroll logic simplificada para mobile
    return (
        <div className="space-y-4 mb-8">
            <div className="flex justify-between items-end px-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">O que eles dizem</h3>
                <div className="flex text-[#FFD60A]"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/></div>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-6 px-2 snap-x hide-scrollbar" style={{scrollbarWidth: 'none'}}>
                {REVIEWS.map((r, i) => (
                    <div key={i} className="min-w-[260px] glass-card p-5 rounded-2xl snap-center flex flex-col justify-between border-l-2 border-l-[#0A84FF]/50">
                        <p className="text-[13px] text-gray-300 italic leading-relaxed mb-3">"{r.t}"</p>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{r.a}</span>
                            <div className="flex gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} className="w-2 h-2 text-[#FFD60A] fill-current"/>)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  // --- RENDER ---

  if (loading) return <>
    <style>{styles}</style>
    <Loading />
  </>;

  return (
    <div className="min-h-screen pb-40 relative">
      <style>{styles}</style>
      <div className="aurora-bg"><div className="aurora-blob blob-1"></div><div className="aurora-blob blob-2"></div><div className="aurora-blob blob-3"></div></div>
      
      <DiscountModal />

      {/* HEADER */}
      <div className="pt-12 px-6 pb-6 flex justify-between items-center sticky top-0 z-40 bg-gradient-to-b from-black via-black/90 to-transparent">
        <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Thalyson<span className="text-[#0A84FF]">Massagens</span></h1>
            <p className="text-[11px] text-gray-400 font-medium mt-0.5 flex items-center gap-1"><Shield className="w-3 h-3"/> Profissional Masculino • SP</p>
        </div>
        <div className="text-right">
            <button onClick={toggleBalance} className="flex items-center justify-end gap-1.5 text-xs text-gray-500 font-bold uppercase mb-1 outline-none">
                Investido {balanceVisible ? <EyeOff className="w-3 h-3"/> : <Eye className="w-3 h-3"/>}
            </button>
            <div className="font-mono font-bold text-[#0A84FF] text-lg transition-all">
                {balanceVisible ? `R$ ${userStats.spent}` : '****'}
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-6 fade-in space-y-10">
        
        {/* SERVIÇOS */}
        <section>
            <div className="space-y-6">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { triggerHaptic(); setForm({...form, service: s}); setView('booking'); }}
                        className={`glass-card p-6 rounded-3xl relative overflow-hidden group active:scale-[0.98] transition-all cursor-pointer border hover:border-[#0A84FF]/50 ${form.service?.id === s.id ? 'border-[#0A84FF]' : 'border-white/5'}`}>
                        
                        {s.tag && <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl shadow-lg z-10">{s.tag}</div>}
                        
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-bold text-white">{s.title}</h3>
                            <div className="text-right">
                                <span className="block text-xl font-bold text-[#0A84FF]">R$ {s.price}</span>
                                <span className="text-[10px] text-gray-400">{s.duration}</span>
                            </div>
                        </div>
                        
                        <p className="text-sm text-gray-300 leading-relaxed mb-5 opacity-90">{s.desc}</p>
                        
                        <div className="flex flex-wrap gap-2">
                            {s.features.map((f, i) => (
                                <span key={i} className="text-[10px] font-semibold bg-white/5 text-gray-300 px-2.5 py-1 rounded-lg border border-white/5 flex items-center gap-1">
                                    <Check className="w-3 h-3 text-[#0A84FF]" /> {f}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        <Reviews />

        {/* BOOKING SECTION (Visível apenas se selecionar serviço ou rolar) */}
        {form.service && (
            <div id="booking-area" className="fade-in space-y-8 pb-10">
                <div className="flex items-center gap-4 py-4 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full bg-[#0A84FF] animate-pulse"></div>
                    <h3 className="text-lg font-bold text-white">Finalizar Agendamento</h3>
                </div>

                {/* LOCAL */}
                <section className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><MapPin className="w-4 h-4 text-[#0A84FF]"/> Endereço</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setForm({...form, locType: 'apt'})} className={`p-4 rounded-2xl border text-sm font-bold transition-all ${form.locType === 'apt' ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#121212]/50 border-white/10 text-gray-500'}`}>🏢 Apartamento</button>
                        <button onClick={() => setForm({...form, locType: 'casa'})} className={`p-4 rounded-2xl border text-sm font-bold transition-all ${form.locType === 'casa' ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#121212]/50 border-white/10 text-gray-500'}`}>🏠 Casa</button>
                    </div>

                    <div className="space-y-3">
                        <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="Rua / Avenida" className="w-full bg-[#121212]/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none transition-colors placeholder:text-gray-600" />
                        <div className="flex gap-3">
                            <input value={form.number} onChange={e => setForm({...form, number: e.target.value})} placeholder="Número" type="tel" className="w-1/3 bg-[#121212]/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none placeholder:text-gray-600" />
                            <input value={form.neighborhood} onChange={e => setForm({...form, neighborhood: e.target.value})} placeholder="Bairro" className="flex-1 bg-[#121212]/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none placeholder:text-gray-600" />
                        </div>
                        {form.locType === 'apt' && (
                            <input value={form.aptDetails} onChange={e => setForm({...form, aptDetails: e.target.value})} placeholder="Bloco / Apto / Complemento" className="w-full bg-[#121212]/50 border border-white/10 p-4 rounded-xl text-white text-sm focus:border-[#0A84FF] outline-none transition-colors placeholder:text-gray-600 animate-fade-in" />
                        )}
                    </div>
                    
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                        <p className="text-[11px] text-blue-200 leading-tight">
                            <strong className="text-white">Uber:</strong> Até 500m do meu local é <span className="text-green-400">FREE</span>. Acima disso, calculamos juntos no WhatsApp.
                        </p>
                    </div>
                </section>

                {/* DATA/HORA */}
                <section className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4 text-[#0A84FF]"/> Data e Hora</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                        {['Hoje', 'Amanhã', 'Sáb', 'Dom'].map(d => (
                            <button key={d} onClick={() => setForm({...form, date: d})} className={`px-6 py-3 rounded-xl text-sm font-bold border whitespace-nowrap transition-all ${form.date === d ? 'bg-white text-black border-white' : 'bg-[#121212]/50 border-white/10 text-gray-400'}`}>{d}</button>
                        ))}
                    </div>
                    {form.date && (
                        <div className="grid grid-cols-4 gap-3 animate-fade-in">
                            {['10:00', '14:00', '16:00', '19:00', '21:00'].map(t => (
                                <button key={t} onClick={() => setForm({...form, time: t})} className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${form.time === t ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#121212]/50 border-white/10 text-gray-400'}`}>{t}</button>
                            ))}
                        </div>
                    )}
                </section>

                {/* PAGAMENTO */}
                <section className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-4 h-4 text-[#0A84FF]"/> Pagamento</h4>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => setForm({...form, payment: 'pix'})} className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${form.payment === 'pix' ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#121212]/50 border-white/10'}`}>
                            <QrCode className={`w-5 h-5 ${form.payment === 'pix' ? 'text-[#0A84FF]' : 'text-gray-500'}`} />
                            <span className={`text-[10px] font-bold ${form.payment === 'pix' ? 'text-white' : 'text-gray-500'}`}>Pix</span>
                        </button>
                        <button onClick={() => setForm({...form, payment: 'card'})} className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${form.payment === 'card' ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#121212]/50 border-white/10'}`}>
                            <CreditCard className={`w-5 h-5 ${form.payment === 'card' ? 'text-[#0A84FF]' : 'text-gray-500'}`} />
                            <span className={`text-[10px] font-bold ${form.payment === 'card' ? 'text-white' : 'text-gray-500'}`}>Cartão</span>
                        </button>
                        <button onClick={() => setForm({...form, payment: 'cash'})} className={`h-20 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all ${form.payment === 'cash' ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#121212]/50 border-white/10'}`}>
                            <Banknote className={`w-5 h-5 ${form.payment === 'cash' ? 'text-[#0A84FF]' : 'text-gray-500'}`} />
                            <span className={`text-[10px] font-bold ${form.payment === 'cash' ? 'text-white' : 'text-gray-500'}`}>Dinheiro</span>
                        </button>
                    </div>
                </section>

                {/* EXTRAS */}
                <section>
                    <div onClick={() => setForm({...form, aroma: !form.aroma})} className={`w-full p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${form.aroma ? 'bg-green-500/10 border-green-500/50' : 'bg-[#121212]/50 border-white/10'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${form.aroma ? 'bg-green-500 text-black' : 'bg-[#2a2a2a] text-gray-500'}`}><Zap className="w-5 h-5"/></div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Aromaterapia</h4>
                                <p className="text-[10px] text-gray-400">Ambiente perfumado e relaxante</p>
                            </div>
                        </div>
                        <span className="text-green-400 font-bold text-sm">+ R$ 10,00</span>
                    </div>

                    {!form.coupon ? (
                        <div onClick={applyCoupon} className="mt-4 p-4 border border-dashed border-[#FFD60A]/30 bg-[#FFD60A]/5 rounded-2xl text-center cursor-pointer active:scale-95 transition-transform">
                             <p className="text-[#FFD60A] text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"><Sparkles className="w-3 h-3"/> Aplicar Cupom R$ 10 OFF</p>
                        </div>
                    ) : (
                        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center gap-2">
                             <Check className="w-4 h-4 text-green-500" /> <span className="text-green-400 text-xs font-bold">Desconto Aplicado!</span>
                        </div>
                    )}
                </section>
            </div>
        )}
      </div>

      {/* FOOTER FIXO */}
      {form.service && (
        <div className="fixed bottom-0 w-full z-50">
            <div className="h-12 bg-gradient-to-t from-black to-transparent pointer-events-none" />
            <div className="bg-[#121212] border-t border-white/10 p-6 rounded-t-[32px] shadow-[0_-10px_50px_rgba(0,0,0,0.9)]">
                <div className="flex justify-between items-end mb-5">
                    <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Estimado</p>
                        {form.aroma && <span className="text-[10px] text-gray-400 block">+ Aroma Incluso</span>}
                        {form.coupon && <span className="text-[10px] text-green-400 block">- Desconto R$ 10</span>}
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-white tracking-tighter">R$ {total}</h2>
                        <p className="text-[10px] text-[#0A84FF] font-bold">+ Taxa Uber (Se > 500m)</p>
                    </div>
                </div>

                <button 
                    disabled={!form.date || !form.time || !form.address}
                    onClick={() => {
                        // Salva stats
                        const newStats = { spent: userStats.spent + total, saved: userStats.saved + (form.coupon ? 10 : 0) };
                        localStorage.setItem('thaly_stats_v2', JSON.stringify(newStats));
                        setUserStats(newStats);

                        // Monta mensagem
                        const payTxt = form.payment === 'pix' ? 'Pix' : form.payment === 'card' ? 'Cartão' : 'Dinheiro';
                        const locTxt = form.locType === 'apt' 
                            ? `🏢 *Apto:* ${form.address}, ${form.number}\n📍 *Bairro:* ${form.neighborhood}\n🔢 *Comp:* ${form.aptDetails}`
                            : `🏠 *Casa:* ${form.address}, ${form.number}\n📍 *Bairro:* ${form.neighborhood}`;

                        const msg = `*NOVO AGENDAMENTO VIP* 🔥
--------------------------------
💆 *Serviço:* ${form.service.title}
💰 *Valor Base:* R$ ${form.service.price}

${locTxt}

📅 *Data:* ${form.date} às ${form.time}
💳 *Pagamento:* ${payTxt}

*ADICIONAIS:*
${form.aroma ? '✅ Aromaterapia (+R$ 10)' : '❌ Sem Aroma'}
${form.coupon ? '🎟 CUPOM APLICADO (-R$ 10)' : ''}

*TOTAL PENDENTE: R$ ${total},00* (+ Uber se houver)
--------------------------------`;
                        window.open(`https://wa.me/5517991360413?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="w-full btn-primary py-4 rounded-2xl flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:shadow-none font-bold">
                    <span className="uppercase tracking-wide">Confirmar no Zap</span> <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </div>
      )}

    </div>
  );
}
