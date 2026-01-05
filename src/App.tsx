import { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, Check, MapPin, Calendar, Clock,
  Shield, Star, Bell, ArrowRight,
  Zap, Crown, Trash2, CreditCard, Banknote, QrCode, 
  CheckCircle2, Send, Menu, User, Sparkles, Heart
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS & ANIMAÇÕES (CSS-IN-JS)
// ==================================================================================

const globalStyles = `
/* Reset & Base */
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; scroll-behavior: smooth; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif; 
  letter-spacing: -0.01em;
  color: #fff;
  background: #000;
  -webkit-font-smoothing: antialiased;
  padding-bottom: 40px;
}

/* Scrollbar Hide */
::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* --- BACKGROUNDS LUXO --- */
.sp-luxury-bg {
  background: 
    radial-gradient(circle at 50% 0%, rgba(20, 20, 30, 1) 0%, #000000 70%),
    radial-gradient(circle at 85% 30%, rgba(10, 132, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 15% 80%, rgba(50, 215, 75, 0.05) 0%, transparent 50%);
  min-height: 100vh;
  background-attachment: fixed;
}

/* --- CARDS & GLASSMORPHISM --- */
.glass-panel { 
  background: rgba(22, 22, 24, 0.75); 
  backdrop-filter: blur(40px) saturate(180%); 
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.08); 
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.service-card {
  background: linear-gradient(180deg, rgba(30, 30, 35, 0.8) 0%, rgba(20, 20, 22, 0.9) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  transition: transform 0.2s ease, border-color 0.2s ease;
}
.service-card:active { transform: scale(0.98); }
.service-card.selected { border-color: #0A84FF; background: rgba(10, 132, 255, 0.05); }

/* --- BOTÕES --- */
.cta-btn {
  background: #0A84FF;
  color: white;
  border: none;
  font-weight: 600;
  box-shadow: 0 0 20px rgba(10, 132, 255, 0.4);
  transition: all 0.2s ease;
}
.cta-btn:active { transform: scale(0.96); box-shadow: 0 0 10px rgba(10, 132, 255, 0.2); }
.cta-btn:disabled { opacity: 0.5; filter: grayscale(1); }

/* --- INPUTS --- */
.lux-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255,255,255,0.1);
  color: white;
  transition: all 0.3s ease;
  font-size: 16px;
}
.lux-input:focus { border-color: #0A84FF; background: rgba(255, 255, 255, 0.08); outline: none; }

/* --- ANIMATIONS --- */
.reveal-up { animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(40px); }
@keyframes revealUp { to { opacity: 1; transform: translateY(0); } }

.pulse-slow { animation: pulseSlow 3s infinite; }
@keyframes pulseSlow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
`;

// ==================================================================================
// 2. DADOS E CONFIGURAÇÃO
// ==================================================================================

const CONFIG = {
  PRICES: {
    AROMA: 15,
    TOUCH: 50,
    UPGRADE_30MIN_PCT: 0.4 // 40% do valor base
  }
};

const services = [
  { 
    id: 'masculina', name: 'Massagem Masculina', 
    description: 'A experiência definitiva. Relaxamento muscular profundo, óleos aquecidos e finalização intensa.', 
    labelDuration: '60 min', basePrice: 180, 
    highlight: "SÃO PAULO FAVORITE 🔥", 
    tags: ["Tântrica", "Nuru Gel", "Corpo a Corpo"] 
  },
  { 
    id: 'relaxante', name: 'Deep Tissue Relax', 
    description: 'Foco total em descompressão muscular. Ideal para executivos e pós-treino.', 
    labelDuration: '60 min', basePrice: 150, 
    highlight: null, 
    tags: ["Terapêutica", "Zero Stress", "Óleos Essenciais"] 
  },
  { 
    id: 'duo', name: 'Experiência Four Hands', 
    description: 'Intensidade dobrada. Sensação única de imersão total.', 
    labelDuration: '50 min', basePrice: 300, 
    highlight: "PREMIUM ✨", 
    tags: ["Dupla Estimulação", "Intenso", "Exclusivo"] 
  },
];

// Gerador de Reviews (Fake DB)
const generateReviews = () => {
  const names = ["Ricardo M.", "André S.", "Bruno K.", "Felipe A.", "Eduardo", "Cliente SP", "M.V.", "João Pedro", "Anonymous", "L.G.", "Gustavo", "R.C."];
  const comments = [
    "Profissionalismo impecável. O local é discreto e a técnica é surreal.",
    "Melhor massagem de SP. Vale cada centavo. Sai renovado.",
    "A conexão é incrível. Não é algo mecânico, tem feeling.",
    "Gostei muito da pontualidade e da higiene. Recomendo.",
    "O toque final faz toda a diferença. Experiência 10/10.",
    "Já fiz com vários, mas esse atendimento é diferenciado. Virei cliente fixo.",
    "Sensacional. A mão é pesada na medida certa para tirar a tensão.",
    "Muito educado e respeitoso. O sigilo foi total.",
    "A maca não fez falta nenhuma, na cama foi até mais confortável.",
    "Experiência premium. Óleos de qualidade, cheiro bom.",
    "Fui meio tenso, mas ele me deixou super a vontade.",
    "Pagamento facilitado no Pix, sem enrolação. Curti."
  ];
  let reviews = [];
  for(let i=0; i<40; i++) {
     reviews.push({
       id: i,
       name: names[Math.floor(Math.random() * names.length)],
       text: comments[Math.floor(Math.random() * comments.length)],
       rating: 5
     });
  }
  return reviews;
};
const REVIEWS_DB = generateReviews();

const TIME_SLOTS = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '19:00', '20:30', '22:00'];

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const SectionHeader = ({ number, title, subtitle }) => (
  <div className="mb-6 mt-8 reveal-up">
    <div className="flex items-center gap-3 mb-1">
      <div className="w-6 h-6 rounded-full bg-[#0A84FF] text-white flex items-center justify-center text-[12px] font-bold shadow-[0_0_15px_rgba(10,132,255,0.5)]">
        {number}
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm ml-9 leading-relaxed">{subtitle}</p>
  </div>
);

const ReviewTicker = () => {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(i => (i+1)%REVIEWS_DB.length), 4000); return () => clearInterval(t); }, []);
  
  return (
    <div className="w-full bg-white/5 border-y border-white/5 py-3 mb-8 backdrop-blur-sm">
      <div className="max-w-[440px] mx-auto px-6 flex items-center justify-between gap-4">
        <div className="flex gap-1 text-[#FFD60A]">
           <Star className="w-3 h-3 fill-current"/>
           <span className="text-xs font-bold text-white ml-1">5.0</span>
        </div>
        <div className="flex-1 text-right overflow-hidden relative h-5">
           <p key={idx} className="text-[11px] text-gray-300 italic animate-fade-in absolute right-0 w-full truncate">
             "{REVIEWS_DB[idx].text}" <span className="text-gray-500 not-italic ml-1">- {REVIEWS_DB[idx].name}</span>
           </p>
        </div>
      </div>
    </div>
  );
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  
  // STATE PRINCIPAL
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [flow, setFlow] = useState({
    nameConfirmed: false,
    serviceSelected: false,
    dateSelected: false,
    locationSelected: false,
  });

  const [data, setData] = useState({
    service: null,
    date: null,
    time: null,
    address: '',
    district: '',
    complement: '',
    extras: { aroma: false, touch: false, upgrade: false },
    payment: 'pix'
  });

  // Refs para Scroll Automático
  const serviceRef = useRef(null);
  const calendarRef = useRef(null);
  const locationRef = useRef(null);
  const paymentRef = useRef(null);
  const endRef = useRef(null);

  const triggerScroll = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  };

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);

  // --- HANDLERS ---
  
  const handleNameConfirm = () => {
    if(!user.name || user.name.length < 3) return alert("Por favor, digite seu nome.");
    setFlow({ ...flow, nameConfirmed: true });
    triggerScroll(serviceRef);
  };

  const handleServiceSelect = (srv) => {
    setData({ ...data, service: srv });
    setFlow({ ...flow, serviceSelected: true });
    triggerScroll(calendarRef);
  };

  const handleDateSelect = (d, t) => {
    setData({ ...data, date: d, time: t });
    // Só avança se ambos estiverem preenchidos
    if(d && t) {
      setFlow({ ...flow, dateSelected: true });
      triggerScroll(locationRef);
    }
  };

  const handleLocationBlur = () => {
    if(data.address.length > 3 && data.district.length > 2) {
      setFlow({ ...flow, locationSelected: true });
      // triggerScroll(paymentRef); // Opcional: scrollar apenas quando ele terminar de digitar
    }
  };

  const calculateTotal = () => {
    if(!data.service) return 0;
    let total = data.service.basePrice;
    if(data.extras.upgrade) total += (data.service.basePrice * CONFIG.PRICES.UPGRADE_30MIN_PCT);
    if(data.extras.touch) total += CONFIG.PRICES.TOUCH;
    if(data.extras.aroma) total += CONFIG.PRICES.AROMA;
    return total;
  };

  const formatBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleWhatsApp = () => {
    const total = calculateTotal();
    const dateStr = data.date.toLocaleDateString('pt-BR');
    
    let extrasTxt = [];
    if(data.extras.upgrade) extrasTxt.push("⏰ +30 Minutos");
    if(data.extras.touch) extrasTxt.push("💆‍♂️ Interação/Toque");
    if(data.extras.aroma) extrasTxt.push("🌸 Aromaterapia");

    const msg = `*NOVO AGENDAMENTO VIP - SP*
👤 *Cliente:* ${user.name}
📅 *Data:* ${dateStr} às ${data.time}
💆 *Serviço:* ${data.service.name}

📍 *Local:* ${data.address} - ${data.district} ${data.complement ? `(${data.complement})` : ''}

*EXTRAS:*
${extrasTxt.length ? extrasTxt.join('\n') : 'Nenhum extra selecionado'}

💰 *VALOR TOTAL: ${formatBRL(total)}*
💳 *Pagamento:* ${data.payment.toUpperCase()}

_Aguardo confirmação._`;

    window.open(`https://api.whatsapp.com/send?phone=5511999999999&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-2 border-[#0A84FF] border-r-2 border-r-[#0A84FF]/30 rounded-full animate-spin mb-4"></div>
            <p className="text-[#0A84FF] text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Carregando Experiência</p>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-luxury-bg min-h-screen text-gray-200 selection:bg-[#0A84FF] selection:text-white pb-32">
      <style>{globalStyles}</style>

      {/* HEADER FIXO SIMPLES */}
      <div className="fixed top-0 w-full z-40 px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0A84FF]" />
            <span className="font-bold text-white text-sm tracking-wide">THALYSON<span className="font-normal text-gray-500">.SP</span></span>
        </div>
        <div className="flex gap-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <Menu className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div className="pt-24 px-4 sm:px-0 max-w-[460px] mx-auto">
        
        {/* INTRODUÇÃO */}
        <div className="text-center mb-8 reveal-up">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Relaxamento <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A84FF] to-[#00C7BE]">Premium</span></h1>
            <p className="text-gray-400 text-sm">Design de experiência focado no seu bem-estar.</p>
        </div>

        <ReviewTicker />

        {/* 1. IDENTIFICAÇÃO (SEMPRE VISÍVEL INICIALMENTE) */}
        <div className="glass-panel p-6 rounded-3xl mb-4 reveal-up">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <User className="w-5 h-5 text-[#0A84FF]"/>
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white">Boas-vindas</h3>
                    <p className="text-xs text-gray-400">Identifique-se para iniciar</p>
                </div>
            </div>
            
            <input 
                disabled={flow.nameConfirmed}
                value={user.name}
                onChange={e => setUser({...user, name: e.target.value})}
                placeholder="Como prefere ser chamado?"
                className="w-full lux-input p-4 rounded-xl mb-4 text-lg font-medium"
            />

            {!flow.nameConfirmed && (
                <button onClick={handleNameConfirm} className="w-full cta-btn py-4 rounded-xl text-sm uppercase tracking-widest hover:brightness-110">
                    Começar Experiência
                </button>
            )}
        </div>

        {/* 2. SERVIÇOS (REVEAL) */}
        {flow.nameConfirmed && (
            <div ref={serviceRef} className="reveal-up pt-4">
                <SectionHeader number="01" title="Escolha sua Sessão" subtitle="Técnicas exclusivas para renovar suas energias." />
                
                <div className="space-y-4">
                    {services.map((srv) => (
                        <div key={srv.id} className={`service-card p-6 rounded-[24px] relative overflow-hidden group ${data.service?.id === srv.id ? 'selected' : ''}`}>
                            {srv.highlight && (
                                <div className="absolute top-0 right-0 bg-[#0A84FF] text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl shadow-lg z-10">
                                    {srv.highlight}
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-white max-w-[70%] leading-tight">{srv.name}</h3>
                                <div className="text-right">
                                    <span className="block text-xl font-bold text-[#0A84FF]">{formatBRL(srv.basePrice)}</span>
                                    <span className="text-[11px] text-gray-500">{srv.labelDuration}</span>
                                </div>
                            </div>
                            
                            <p className="text-gray-400 text-sm mb-5 leading-relaxed">{srv.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-5">
                                {srv.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-300 border border-white/5">{tag}</span>
                                ))}
                            </div>

                            <button 
                                onClick={() => handleServiceSelect(srv)}
                                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                                ${data.service?.id === srv.id 
                                    ? 'bg-[#0A84FF] text-white shadow-[0_0_20px_rgba(10,132,255,0.4)]' 
                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}`}>
                                {data.service?.id === srv.id ? <><CheckCircle2 className="w-4 h-4"/> Selecionado</> : 'Selecionar Experiência'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* 3. DATA E HORA (REVEAL) */}
        {flow.serviceSelected && (
            <div ref={calendarRef} className="reveal-up pt-4">
                <SectionHeader number="02" title="Data e Horário" subtitle="Nossa agenda é concorrida. Garanta seu slot." />
                
                <div className="glass-panel p-6 rounded-[24px]">
                    {/* Seletor de Dias (Horizontal) */}
                    <div className="flex gap-3 overflow-x-auto pb-4 mb-2 scrollbar-hide snap-x">
                        {[...Array(10)].map((_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() + i);
                            const isSelected = data.date?.getDate() === d.getDate();
                            const isToday = i === 0;
                            
                            return (
                                <button key={i} onClick={() => setData({...data, date: d, time: null})} 
                                    className={`snap-start min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all
                                    ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider mb-1">{isToday ? 'Hoje' : d.toLocaleDateString('pt-BR', {weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-2xl font-bold font-mono">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Seletor de Horas (Grid) */}
                    {data.date && (
                        <div className="grid grid-cols-3 gap-3 animate-fade-in mt-2 border-t border-white/5 pt-4">
                            {TIME_SLOTS.map(t => (
                                <button key={t} onClick={() => handleDateSelect(data.date, t)}
                                    className={`py-3 rounded-xl text-sm font-bold border transition-all relative overflow-hidden
                                    ${data.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-300 border-white/5 hover:bg-[#2C2C2E]'}`}>
                                    {t}
                                    {data.time === t && <div className="absolute inset-0 bg-white mix-blend-overlay opacity-20"></div>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* 4. EXTRAS & LOCAL (REVEAL) */}
        {flow.dateSelected && (
            <div ref={locationRef} className="reveal-up pt-4">
                 
                 {/* UPSELL / EXTRAS */}
                <SectionHeader number="03" title="Personalize" subtitle="Adicione toques especiais." />
                <div className="grid grid-cols-1 gap-3 mb-8">
                     <div onClick={() => setData(p => ({...p, extras: {...p.extras, upgrade: !p.extras.upgrade}}))} 
                          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${data.extras.upgrade ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center"><Clock className="w-5 h-5 text-[#0A84FF]"/></div>
                             <div><p className="font-bold text-sm text-white">+30 Minutos</p><p className="text-xs text-gray-500">Estenda o prazer</p></div>
                         </div>
                         <span className="text-[#0A84FF] font-bold text-sm">+ R$ {(data.service.basePrice * CONFIG.PRICES.UPGRADE_30MIN_PCT).toFixed(0)}</span>
                     </div>

                     <div onClick={() => setData(p => ({...p, extras: {...p.extras, touch: !p.extras.touch}}))} 
                          className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${data.extras.touch ? 'bg-[#FF375F]/20 border-[#FF375F]' : 'bg-[#1C1C1E] border-white/5'}`}>
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center"><Heart className="w-5 h-5 text-[#FF375F]"/></div>
                             <div><p className="font-bold text-sm text-white">Interação / Toque</p><p className="text-xs text-gray-500">Liberdade total</p></div>
                         </div>
                         <span className="text-[#FF375F] font-bold text-sm">+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                     </div>
                </div>

                <SectionHeader number="04" title="Localização" subtitle="Atendimento exclusivo Domiciliar ou Hotel." />
                <div className="glass-panel p-6 rounded-[24px] space-y-4">
                     <div className="flex items-center gap-2 text-gray-400 mb-2">
                         <MapPin className="w-4 h-4 text-[#0A84FF]" />
                         <span className="text-xs uppercase font-bold tracking-widest">Endereço SP</span>
                     </div>
                     <input 
                        value={data.address} 
                        onChange={e => setData({...data, address: e.target.value})} 
                        onBlur={handleLocationBlur}
                        placeholder="Rua / Avenida e Número" 
                        className="w-full lux-input p-4 rounded-xl text-sm"
                    />
                    <div className="flex gap-3">
                        <input 
                            value={data.district} 
                            onChange={e => setData({...data, district: e.target.value})} 
                            onBlur={handleLocationBlur}
                            placeholder="Bairro" 
                            className="flex-1 lux-input p-4 rounded-xl text-sm"
                        />
                         <input 
                            value={data.complement} 
                            onChange={e => setData({...data, complement: e.target.value})} 
                            placeholder="Apto/Bloco (Opcional)" 
                            className="w-1/3 lux-input p-4 rounded-xl text-sm"
                        />
                    </div>
                </div>
            </div>
        )}

        {/* 5. PAGAMENTO & CONFIRMAÇÃO (REVEAL FINAL) */}
        {flow.locationSelected && (
            <div ref={paymentRef} className="reveal-up pt-4 pb-12">
                <SectionHeader number="05" title="Finalização" subtitle="Escolha como prefere pagar." />
                
                <div className="grid grid-cols-2 gap-3 mb-8">
                    {['pix', 'credit', 'debit', 'cash'].map(method => (
                        <button key={method} onClick={() => { setData({...data, payment: method}); triggerScroll(endRef); }}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all
                            ${data.payment === method ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/5'}`}>
                            {method === 'pix' && <QrCode className="w-6 h-6"/>}
                            {method === 'credit' && <CreditCard className="w-6 h-6"/>}
                            {method === 'debit' && <CreditCard className="w-6 h-6"/>}
                            {method === 'cash' && <Banknote className="w-6 h-6"/>}
                            <span className="text-xs font-bold uppercase">{method === 'credit' ? 'Crédito' : method === 'debit' ? 'Débito' : method === 'cash' ? 'Dinheiro' : 'Pix'}</span>
                        </button>
                    ))}
                </div>

                <div className="bg-[#1C1C1E] p-6 rounded-[24px] border border-white/10 relative overflow-hidden" ref={endRef}>
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[#0A84FF]/20 blur-[60px] rounded-full"></div>
                     <h3 className="text-lg font-bold text-white mb-6">Resumo do Pedido</h3>
                     
                     <div className="space-y-3 mb-6 border-b border-dashed border-gray-700 pb-6">
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-400">{data.service.name}</span>
                             <span className="font-bold">{formatBRL(data.service.basePrice)}</span>
                         </div>
                         {data.extras.upgrade && (
                            <div className="flex justify-between text-sm text-[#0A84FF]">
                                <span>+30 Minutos</span>
                                <span>+ {formatBRL(data.service.basePrice * CONFIG.PRICES.UPGRADE_30MIN_PCT)}</span>
                            </div>
                         )}
                         {data.extras.touch && (
                            <div className="flex justify-between text-sm text-[#FF375F]">
                                <span>Interação/Toque</span>
                                <span>+ {formatBRL(CONFIG.PRICES.TOUCH)}</span>
                            </div>
                         )}
                     </div>

                     <div className="flex justify-between items-end mb-6">
                         <span className="text-gray-400 text-sm font-bold uppercase">Total Final</span>
                         <span className="text-3xl font-bold text-white tracking-tight">{formatBRL(calculateTotal())}</span>
                     </div>

                     <button onClick={handleWhatsApp} className="w-full cta-btn py-4 rounded-xl text-base flex items-center justify-center gap-3 animate-pulse">
                         <Send className="w-5 h-5" />
                         Confirmar no WhatsApp
                     </button>
                     <p className="text-center text-[10px] text-gray-600 mt-3">Ao confirmar, você concorda com nossos termos de conduta e sigilo.</p>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}
