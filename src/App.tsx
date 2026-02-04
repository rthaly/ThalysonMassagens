import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy, ChevronDown, CheckCircle2, Navigation
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v50.0 - VISION PRO LUXURY EDITION (2026)
 * ==================================================================================
 * Desenvolvido por: Seu Parceiro de Programação
 * Conceito: "Cozy Luxury & High-End Tech"
 * * MELHORIAS IMPLEMENTADAS:
 * 1. UI System: "Deep Glass" com sombras coloridas e bordas de luz.
 * 2. Feedback: Animações de clique estilo iOS (scale down).
 * 3. Dynamic Island: Sistema de notificações no topo.
 * 4. Smart Calendar: Lógica avançada de horários e datas.
 * 5. Persistent State: LocalStorage criptografado (simulado).
 */

// --- 1. CONFIGURAÇÕES AVANÇADAS & DADOS ---

const CONFIG = {
  APP_NAME: "Thalyson",
  APP_SUB: "Terapêutica & Sensorial",
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_platinum_v50',
  PIX_KEY: "62922530000144",
  PIX_DISPLAY: "62.922.530/0001-44",
  SECRET_TOKEN: 'LUXURY_2026_SECURE',
  START_HOUR: 9,
  END_HOUR: 21,
  ANIMATION_SPEED: 'duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]'
};

const DATA_STORE = {
  services: [
    { 
      id: 'relaxante', min: 60, price: 125, icon: Wind, tag: "ESSENCIAL", color: "from-teal-400 to-emerald-500",
      title: "Sessão Relaxante", desc: "Descompressão muscular absoluta.",
      details: "A porta de entrada para o bem-estar. \n\n• Foco: Alívio de tensões, dores musculares e estresse.\n• Toque: Firme e envolvente, sem conotação sexual.\n• Ideal para: Executivos, atletas e quem busca silêncio mental." 
    },
    { 
      id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: "SENSORIAL", color: "from-rose-400 to-orange-500",
      title: "Terapia Sensitiva", desc: "Um despertar suave dos sentidos.",
      details: "Uma jornada de reconexão com o próprio corpo.\n\n• Início: Massagem relaxante para soltar a musculatura.\n• Evolução: Toques sutis (ponta dos dedos/plumas) ativando terminações nervosas.\n• Finalização: A massagem tântrica/íntima faz parte do processo de liberação."
    },
    { 
      id: 'mista', min: 90, price: 195, icon: Zap, tag: "SIGNATURE", color: "from-indigo-400 to-purple-600",
      title: "Experiência Signature", desc: "A fusão perfeita (Relax + Tantra).",
      details: "A experiência definitiva e mais completa.\n\n• O Melhor dos Mundos: Une a pressão da relaxante com a sensibilidade da tântrica.\n• Body-to-Body: Contato corpo a corpo para troca energética intensa.\n• Clímax: Liberdade total para o alívio final (Happy Ending)."
    }
  ],
  plans: [
    { 
      id: 'pack_relax', type: 'pack', title: "Ciclo Wellness (4x)", 
      price: 397, fullPrice: 500, savings: 103, 
      desc: "4 Sessões Relaxantes.",
      details: "Protocolo de tratamento para dor crônica. 4 sessões focadas puramente na recuperação muscular.", 
      tag: "SMART CHOICE", icon: Package, color: "text-emerald-400"
    },
    { 
      id: 'pack_mista', type: 'pack', title: "Ciclo Platinum (3x)", 
      price: 487, fullPrice: 585, savings: 98, 
      desc: "3 Sessões Signature.",
      details: "Para quem não abre mão do melhor. 3 encontros da Experiência Signature (Mista) com prioridade de agenda.", 
      tag: "BEST SELLER", icon: Crown, color: "text-amber-400"
    }
  ],
  extras: [
    { id: 'more_time', price: 60, icon: Clock, label: "Extended Time", sub: "+30 Minutos", desc: "Sem pressa para terminar." },
    { id: 'touch', price: 50, icon: Heart, label: "Interatividade", sub: "Troca de Toques", desc: "Você participa ativamente." },
    { id: 'shower', price: 30, icon: Sparkles, label: "Banho Premium", sub: "Pré/Pós Sessão", desc: "Sais de banho e toalhas egípcias." }
  ],
  reviews: [
    { n: "Bruno S.", loc: "Jardins", t: "Impecável. O ambiente, a música, o toque. Uma experiência de luxo.", s: 5 },
    { n: "Tiago M.", loc: "Bela Vista", t: "A melhor sensitiva que já fiz. O Thalyson é extremamente profissional.", s: 5 },
    { n: "Ricardo", loc: "Rio Preto", t: "Mãos firmes e energia incrível. Saí flutuando.", s: 5 },
    { n: "André L.", loc: "Paulista", t: "Gostei muito do respeito e da condução da sessão. Recomendo.", s: 5 },
    { n: "Gustavo", loc: "Sta. Fé", t: "A massagem mista é surreal. Vale cada centavo.", s: 5 }
  ],
  faq: [
    { q: "Onde é o atendimento?", a: "Atendo no meu espaço (Home Boutique) ou vou até você (Hotel/Residência)." },
    { q: "Aceita cartão?", a: "Sim, Pix, Dinheiro e Cartão de Crédito (com pequena taxa)." },
    { q: "O sigilo é garantido?", a: "Absolutamente. Discrição é o pilar do meu atendimento." }
  ]
};

// ==================================================================================
// 2. SISTEMA DE DESIGN (STYLES & ANIMATIONS)
// ==================================================================================

const DesignSystem = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');
    
    :root {
      --bg-depth: #0f172a;
      --glass-surface: rgba(30, 41, 59, 0.4);
      --glass-border: rgba(255, 255, 255, 0.08);
      --primary-glow: rgba(56, 189, 248, 0.5);
      --gold-glow: rgba(251, 191, 36, 0.3);
    }

    body { 
      font-family: 'Inter', sans-serif; 
      background-color: #020617;
      color: #f8fafc;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    /* Scrollbar Premium */
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
    
    .font-serif { font-family: 'Playfair Display', serif; }
    
    /* Utility: Glassmorphism */
    .glass-base {
      background: var(--glass-surface);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }
    
    .glass-high {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }

    /* Animation: Soft Spring Scale */
    .tap-effect { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .tap-effect:active { transform: scale(0.96); }

    /* Animation: Fade Up */
    .animate-enter { animation: enter 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
    @keyframes enter { to { opacity: 1; transform: translateY(0); } }

    /* Animation: Shimmer */
    .shimmer {
      position: relative;
      overflow: hidden;
    }
    .shimmer::after {
      content: '';
      position: absolute;
      top: 0; right: 0; bottom: 0; left: 0;
      transform: translateX(-100%);
      background-image: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0,
        rgba(255, 255, 255, 0.05) 20%,
        rgba(255, 255, 255, 0.1) 60%,
        rgba(255, 255, 255, 0)
      );
      animation: shimmer 3s infinite;
    }
    @keyframes shimmer { 100% { transform: translateX(100%); } }

    /* Hide standard checkboxes */
    .custom-check { appearance: none; -webkit-appearance: none; }
  `}</style>
);

// ==================================================================================
// 3. UI COMPONENTS (ATOMIC DESIGN)
// ==================================================================================

// --- Dynamic Island Notification ---
const ToastSystem = ({ toasts, removeToast }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center w-full max-w-sm pointer-events-none gap-2">
    {toasts.map((t) => (
      <div 
        key={t.id} 
        className={`pointer-events-auto flex items-center gap-3 px-6 py-3.5 rounded-full shadow-2xl backdrop-blur-xl border animate-enter
        ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-100' : 'bg-red-500/10 border-red-500/20 text-red-100'}`}
      >
        <div className={`w-2 h-2 rounded-full ${t.type === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]'}`} />
        <span className="text-sm font-medium tracking-wide">{t.msg}</span>
      </div>
    ))}
  </div>
);

// --- Inputs & Controls ---
const PrimaryButton = ({ children, onClick, disabled, loading, icon: Icon, full, variant = 'primary' }) => {
  const styles = {
    primary: "bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_30px_-10px_rgba(255,255,255,0.3)]",
    whatsapp: "bg-[#25D366] text-white hover:brightness-110 shadow-[0_0_30px_-10px_rgba(37,211,102,0.4)]",
    gold: "bg-gradient-to-r from-amber-200 to-amber-400 text-amber-950 hover:brightness-110 shadow-[0_0_30px_-10px_rgba(251,191,36,0.4)]"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative h-14 rounded-2xl font-bold text-sm tracking-wide transition-all tap-effect disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 overflow-hidden
      ${styles[variant]} ${full ? 'w-full' : 'px-8'}`}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : (
        <>
          {Icon && <Icon size={20} strokeWidth={2.5} />}
          {children}
        </>
      )}
    </button>
  );
};

const LuxuryInput = ({ label, value, onChange, icon: Icon, placeholder, type = "text", mask }) => {
  const handleChange = (e) => {
    let val = e.target.value;
    if (mask) val = mask(val);
    onChange(val);
  };

  return (
    <div className="space-y-1.5 group">
      <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-sky-400 transition-colors">{label}</label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors">
          {Icon && <Icon size={18} />}
        </div>
        <input 
          type={type} 
          value={value} 
          onChange={handleChange} 
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-sm font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500/50 focus:bg-slate-900/90 focus:shadow-[0_0_20px_-5px_rgba(14,165,233,0.15)] transition-all"
        />
      </div>
    </div>
  );
};

// ==================================================================================
// 4. LÓGICA & APP PRINCIPAL
// ==================================================================================

export default function App() {
  // --- Estados ---
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [view, setView] = useState('home'); // home, booking
  const [activeTab, setActiveTab] = useState('services'); // services, packs
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Refs para Scroll
  const scrollRef = useRef({});
  const scrollTo = (key) => scrollRef.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // User & Booking State
  const [user, setUser] = useState({ name: '', xp: 0 });
  const [booking, setBooking] = useState({
    item: null,
    extras: {},
    date: null,
    time: null,
    location: 'home', // home, hotel, motel
    address: { street: '', number: '', obs: '' },
    payment: 'pix',
    acceptedTerms: false
  });

  // --- Inicialização ---
  useEffect(() => {
    // Simula carregamento de dados e recuperação de sessão
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.user) setUser(p.user);
      } catch (e) { console.error(e); }
    }
    
    // Animação de entrada
    setTimeout(() => setLoading(false), 2000);
  }, []);

  // Persistência
  useEffect(() => {
    if (!loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user }));
  }, [user, loading]);

  // --- Helpers ---
  const addToast = (msg, type = 'error') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const handleSelectService = (item) => {
    if (navigator.vibrate) navigator.vibrate(10);
    setBooking(prev => ({ ...prev, item, type: item.type === 'pack' ? 'pack' : 'single' }));
    setTimeout(() => scrollTo('calendar'), 100);
  };

  // --- Cálculos Financeiros ---
  const financials = useMemo(() => {
    if (!booking.item) return { total: 0 };
    let total = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
      if (booking.extras[k]) {
        const ex = DATA_STORE.extras.find(e => e.id === k);
        if (ex) total += ex.price;
      }
    });
    return { total };
  }, [booking]);

  // --- WhatsApp Generator ---
  const finishBooking = () => {
    if (!booking.date || !booking.time) return addToast("Selecione data e hora");
    if (!user.name) return addToast("Informe seu nome", "error");
    if (!booking.acceptedTerms) return addToast("Aceite os termos para continuar");

    const text = `
*✨ NOVO AGENDAMENTO VIP*
--------------------------
👤 *Cliente:* ${user.name}
💆‍♂️ *Serviço:* ${booking.item.title}
🗓 *Data:* ${booking.date.toLocaleDateString('pt-BR')} às ${booking.time}
📍 *Local:* ${booking.location.toUpperCase()} 
${booking.location !== 'motel' ? `📝 *End:* ${booking.address.street}, ${booking.address.number}` : ''}

➕ *Extras:* ${Object.keys(booking.extras).filter(k=>booking.extras[k]).length ? Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>DATA_STORE.extras.find(e=>e.id===k).label).join(', ') : 'Nenhum'}

💰 *Total:* R$ ${financials.total},00
💳 *Pagamento:* ${booking.payment.toUpperCase()}
--------------------------
_Aguardando confirmação..._
    `.trim();

    const url = `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    
    setShowConfetti(true);
    setUser(u => ({ ...u, xp: u.xp + (booking.item.price > 200 ? 100 : 50) }));
    addToast("Solicitação enviada!", "success");
  };

  // --- Loading Screen ---
  if (loading) return (
    <div className="fixed inset-0 bg-[#020617] flex items-center justify-center z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-sky-500 blur-3xl opacity-20 animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-sky-900/50">
            <span className="text-3xl font-bold text-white font-serif">T</span>
          </div>
          <div className="flex gap-1.5">
            {[1,2,3].map(i => <div key={i} className={`w-2 h-2 rounded-full bg-slate-600 animate-bounce delay-${i*100}`} />)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-sky-500/30 pb-24 lg:pb-0">
      <DesignSystem />
      <ToastSystem toasts={toasts} removeToast={() => {}} />

      {/* BACKGROUND AMBIENCE */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-sky-900/10 rounded-full blur-[100px]" />
      </div>

      {/* HEADER GLASS */}
      <header className="fixed top-0 left-0 right-0 h-20 glass-base z-40 flex items-center justify-between px-6 lg:px-12 border-b-0 border-white/5">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white font-serif tracking-tight">Thalyson</h1>
          <span className="text-[10px] font-bold text-sky-500 tracking-[0.3em] uppercase opacity-80">Therapist</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">{user.xp} XP</span>
          </div>
          <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <Instagram size={18} className="text-white" />
          </a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="pt-28 px-4 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 relative z-10">
        
        {/* LEFT COL: FLOW */}
        <div className="space-y-12 pb-12">
          
          {/* HERO */}
          <section className="animate-enter">
            <h2 className="text-3xl lg:text-5xl font-bold text-white font-serif leading-tight mb-4">
              O seu momento de <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">reconexão plena.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
              Terapia manual avançada, ambiente controlado e técnicas que unem o alívio muscular ao despertar sensorial.
            </p>
          </section>

          {/* SERVICE TOGGLE */}
          <section className="animate-enter" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex p-1.5 bg-slate-900/80 rounded-2xl border border-slate-800 mb-6">
              {[
                { id: 'services', label: 'Terapias', icon: Sparkles },
                { id: 'packs', label: 'Ciclos VIP', icon: Package }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wide transition-all ${
                    activeTab === tab.id 
                    ? 'bg-slate-800 text-sky-400 shadow-lg' 
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <tab.icon size={16} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="grid gap-5">
              {(activeTab === 'services' ? DATA_STORE.services : DATA_STORE.plans).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => handleSelectService(item)}
                  className={`group relative p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer overflow-hidden
                  ${booking.item?.id === item.id 
                    ? 'bg-slate-800/40 border-sky-500/50 shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)]' 
                    : 'glass-base border-slate-800 hover:border-slate-600 hover:bg-slate-800/30'}`}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-5">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color || 'from-sky-500 to-blue-600'} flex items-center justify-center text-white shadow-lg shrink-0`}>
                        <item.icon size={28} />
                      </div>
                      <div>
                        {item.tag && <span className={`text-[10px] font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10 ${item.id === 'mista' ? 'text-amber-400 border-amber-500/30' : 'text-slate-400'}`}>{item.tag}</span>}
                        <h3 className="text-xl font-bold text-white mt-1">{item.title}</h3>
                        <p className="text-sm text-slate-400 mt-1 max-w-sm">{item.desc}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.fullPrice && <p className="text-xs text-slate-600 line-through decoration-red-500/50">R$ {item.fullPrice}</p>}
                      <p className="text-2xl font-bold text-white">R$ {item.price}</p>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{item.min ? `${item.min} MIN` : 'PACOTE'}</span>
                    </div>
                  </div>

                  {/* Detalhes Expansíveis */}
                  <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === item.id ? 'grid-rows-[1fr] opacity-100 mt-6 pt-6 border-t border-white/5' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                        {item.details}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <span className="flex items-center gap-2 text-xs font-bold text-sky-400 animate-pulse">
                          Selecionado <CheckCircle2 size={14} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* MARQUEE REVIEWS */}
          <section className="overflow-hidden -mx-4 lg:mx-0 py-8 relative">
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#020617] to-transparent z-10"/>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#020617] to-transparent z-10"/>
            <div className="flex gap-4 w-max animate-[scroll_40s_linear_infinite]">
              {[...DATA_STORE.reviews, ...DATA_STORE.reviews].map((r, i) => (
                <div key={i} className="w-80 bg-slate-900/40 border border-slate-800 p-5 rounded-2xl backdrop-blur-sm">
                  <div className="flex gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_,k) => <Star key={k} size={12} fill="currentColor" className={k>=r.s?'text-slate-800':''} />)}
                  </div>
                  <p className="text-xs text-slate-300 italic mb-3 line-clamp-3">"{r.t}"</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">{r.n} • {r.loc}</p>
                </div>
              ))}
            </div>
            <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
          </section>

          {/* CALENDAR & TIME */}
          {booking.item && (
            <section ref={el => scrollRef.current['calendar'] = el} className="animate-enter space-y-8 border-t border-slate-800/50 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-500">
                  <Calendar size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Disponibilidade</h3>
                  <p className="text-sm text-slate-400">Selecione o melhor dia.</p>
                </div>
              </div>

              {/* Day Picker */}
              <div className="flex gap-3 overflow-x-auto pb-4 snap-x hide-scrollbar">
                {Array.from({ length: 14 }).map((_, i) => {
                  const d = new Date();
                  d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  return (
                    <button
                      key={i}
                      onClick={() => setBooking(b => ({ ...b, date: d, time: null }))}
                      className={`min-w-[5rem] h-20 rounded-2xl border flex flex-col items-center justify-center gap-1 transition-all snap-start
                      ${isSel ? 'bg-white text-black border-white scale-105 shadow-xl' : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                    >
                      <span className="text-[10px] font-bold uppercase">{i === 0 ? 'Hoje' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}</span>
                      <span className="text-xl font-bold">{d.getDate()}</span>
                    </button>
                  );
                })}
              </div>

              {/* Time Picker */}
              {booking.date && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 animate-enter">
                  {Array.from({ length: CONFIG.END_HOUR - CONFIG.START_HOUR + 1 }).map((_, i) => {
                    const hour = CONFIG.START_HOUR + i;
                    const timeStr = `${hour}:00`;
                    // Simple logic to block past hours if today
                    const isPast = booking.date.toDateString() === new Date().toDateString() && hour <= new Date().getHours();
                    
                    if (isPast) return null;

                    return (
                      <button
                        key={timeStr}
                        onClick={() => { setBooking(b => ({ ...b, time: timeStr })); setTimeout(() => scrollTo('location'), 100); }}
                        className={`py-2.5 rounded-xl border text-sm font-semibold transition-all
                        ${booking.time === timeStr 
                          ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20' 
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-600'}`}
                      >
                        {timeStr}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>
          )}

          {/* LOCATION & DATA */}
          {booking.date && booking.time && (
            <section ref={el => scrollRef.current['location'] = el} className="animate-enter space-y-8 border-t border-slate-800/50 pt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Localização</h3>
                  <p className="text-sm text-slate-400">Onde será nosso encontro?</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'home', l: 'Casa', i: Home },
                  { id: 'hotel', l: 'Hotel', i: Building },
                  { id: 'motel', l: 'Motel', i: BedDouble }
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setBooking(b => ({ ...b, location: opt.id }))}
                    className={`h-24 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all
                    ${booking.location === opt.id 
                      ? 'bg-sky-500/10 border-sky-500 text-sky-400' 
                      : 'bg-slate-900/50 border-slate-800 text-slate-500 hover:bg-slate-800'}`}
                  >
                    <opt.i size={24} />
                    <span className="text-xs font-bold uppercase">{opt.l}</span>
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                <LuxuryInput 
                  label="Seu Nome" 
                  icon={User} 
                  placeholder="Como prefere ser chamado?" 
                  value={user.name} 
                  onChange={v => setUser({ ...user, name: v })} 
                />
                
                {booking.location !== 'motel' && (
                  <div className="grid grid-cols-[1fr_100px] gap-4 animate-enter">
                    <LuxuryInput 
                      label="Endereço" 
                      icon={MapPin} 
                      placeholder="Rua, Avenida..." 
                      value={booking.address.street} 
                      onChange={v => setBooking(b => ({ ...b, address: { ...b.address, street: v } }))} 
                    />
                    <LuxuryInput 
                      label="Número" 
                      placeholder="123" 
                      value={booking.address.number} 
                      onChange={v => setBooking(b => ({ ...b, address: { ...b.address, number: v } }))} 
                    />
                  </div>
                )}
                
                {booking.location === 'motel' && (
                   <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs flex gap-3 items-center">
                     <AlertTriangle size={16} className="shrink-0" />
                     <span>No caso de Motel, o valor da suíte/hospedagem é responsabilidade do cliente.</span>
                   </div>
                )}
              </div>
            </section>
          )}

          {/* EXTRAS */}
          {booking.date && booking.time && (
             <section className="animate-enter border-t border-slate-800/50 pt-8">
               <h3 className="text-sm font-bold text-slate-500 uppercase mb-4">Upgrade your session</h3>
               <div className="space-y-3">
                 {DATA_STORE.extras.map(ex => (
                   <div 
                    key={ex.id}
                    onClick={() => setBooking(b => ({ ...b, extras: { ...b.extras, [ex.id]: !b.extras[ex.id] } }))}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all
                    ${booking.extras[ex.id] ? 'bg-sky-500/10 border-sky-500/50' : 'bg-slate-900/30 border-slate-800 hover:border-slate-700'}`}
                   >
                     <div className="flex items-center gap-4">
                       <div className={`p-2.5 rounded-xl ${booking.extras[ex.id] ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                         <ex.icon size={20} />
                       </div>
                       <div>
                         <p className={`font-semibold ${booking.extras[ex.id] ? 'text-white' : 'text-slate-400'}`}>{ex.label}</p>
                         <p className="text-xs text-slate-500">{ex.sub}</p>
                       </div>
                     </div>
                     <span className="text-xs font-bold bg-slate-950 px-3 py-1.5 rounded-lg text-slate-300">+ R$ {ex.price}</span>
                   </div>
                 ))}
               </div>
             </section>
          )}

          {/* SPACE FILLER FOR MOBILE */}
          <div className="h-24 lg:hidden"></div>
        </div>

        {/* RIGHT COL: STICKY SUMMARY */}
        <div className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <div className="glass-high rounded-[2rem] p-8 relative overflow-hidden">
               {/* Decorative Gradient Line */}
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500" />
               
               <h3 className="text-2xl font-serif text-white mb-6">Resumo</h3>
               
               {booking.item ? (
                 <div className="space-y-6 animate-enter">
                   <div className="flex justify-between items-start pb-6 border-b border-white/10">
                      <div>
                        <p className="font-bold text-lg text-white">{booking.item.title}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                          <Clock size={12}/> {booking.item.min} min • {booking.item.tag}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-sky-400">R$ {booking.item.price}</p>
                   </div>
                   
                   {/* Selected Extras */}
                   {Object.keys(booking.extras).some(k => booking.extras[k]) && (
                     <div className="space-y-2 pb-6 border-b border-white/10">
                       {Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
                         const ex = DATA_STORE.extras.find(e => e.id === k);
                         return (
                           <div key={k} className="flex justify-between text-sm text-slate-300">
                             <span>+ {ex.label}</span>
                             <span>R$ {ex.price}</span>
                           </div>
                         )
                       })}
                     </div>
                   )}

                   {/* Date & Location Preview */}
                   <div className="bg-slate-950/50 p-4 rounded-xl space-y-2">
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <Calendar size={16} className="text-sky-500"/>
                        {booking.date ? `${booking.date.toLocaleDateString()} às ${booking.time || '--:--'}` : 'Selecione a data'}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-300">
                        <MapPin size={16} className="text-sky-500"/>
                        {booking.location.toUpperCase()}
                      </div>
                   </div>

                   {/* Total */}
                   <div className="flex justify-between items-end pt-2">
                      <span className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Estimado</span>
                      <span className="text-4xl font-bold text-white tracking-tighter">R$ {financials.total}</span>
                   </div>

                   {/* Actions */}
                   <div className="pt-4 space-y-4">
                     {/* Terms Checkbox */}
                     <label className="flex items-start gap-3 cursor-pointer group">
                       <div className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${booking.acceptedTerms ? 'bg-sky-500 border-sky-500' : 'border-slate-600 bg-slate-800'}`}>
                         {booking.acceptedTerms && <Check size={14} className="text-white"/>}
                       </div>
                       <input type="checkbox" className="hidden" checked={booking.acceptedTerms} onChange={e => setBooking(b => ({...b, acceptedTerms: e.target.checked}))} />
                       <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                         Concordo com a política de higiene, segurança e cancelamento (24h).
                       </span>
                     </label>

                     <PrimaryButton full variant="whatsapp" icon={MessageCircle} onClick={finishBooking}>
                       Confirmar via WhatsApp
                     </PrimaryButton>
                     
                     <div className="flex justify-center gap-4 text-slate-600">
                        <ShieldCheck size={18} />
                        <Lock size={18} />
                     </div>
                   </div>

                 </div>
               ) : (
                 <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600">
                   <p>Selecione uma terapia para visualizar o resumo.</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM SHEET / DOCK */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-high border-t border-white/10 pb-safe pt-4 px-6 rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {booking.item ? (
           <div className="flex items-center justify-between gap-4 pb-4">
             <div>
               <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total</p>
               <p className="text-2xl font-bold text-white">R$ {financials.total}</p>
             </div>
             <PrimaryButton onClick={() => {
                if(!booking.date) scrollTo('calendar');
                else if(!booking.time) scrollTo('calendar');
                else if(!user.name) scrollTo('location');
                else finishBooking();
             }} variant="whatsapp">
               {booking.date && booking.time && user.name ? 'Finalizar' : 'Continuar'} <ArrowRight size={18}/>
             </PrimaryButton>
           </div>
        ) : (
           <div className="text-center pb-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
             Escolha sua experiência
           </div>
        )}
      </div>

      {/* CONFETTI OVERLAY */}
      {showConfetti && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center animate-enter">
          <div className="text-center p-8">
            <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-bounce">
              <Check size={48} className="text-white" strokeWidth={4} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Perfeito!</h2>
            <p className="text-slate-400">Redirecionando para o WhatsApp...</p>
          </div>
        </div>
      )}

    </div>
  );
}
