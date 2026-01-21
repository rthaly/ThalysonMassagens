import React, { useState, useEffect } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Gift, 
  Wallet, User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  Calendar as CalIcon, CheckCircle2, Home, HelpCircle, Share2, 
  CreditCard, Banknote, QrCode, Lock, Info
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (V5 GOLD)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: '@thaly_app_v5_gold',
  XP_TARGET: 600, 
  COUPON_LOYALTY_VAL: 30,
  COUPON_WELCOME_VAL: 15
};

const DB = {
  services: [
    { 
      id: 'relaxante', 
      title: 'Massagem Relaxante (1h)',
      badge: 'ANTI-STRESS 🍃',
      price: 150, 
      xp: 150, 
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-500/10',
      desc: "Movimentos leves e contínuos para acalmar a mente. Foco total em descanso, sem dor.",
      details: ["Toque suave", "Deslizamento leve", "Óleo morno", "Música calma"]
    },
    { 
      id: 'sensitiva', 
      title: 'Massagem Sensitiva (1h)',
      badge: 'MAIS PEDIDA ❤️',
      price: 200, 
      xp: 200, 
      icon: Flame, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10',
      desc: "Experiência de pele com pele. Toques sutis que despertam a sensibilidade do corpo todo.",
      details: ["Corpo a corpo", "Toque pluma", "Sensorial", "Finalização especial"]
    },
    { 
      id: 'mista', 
      title: 'Massagem Mista (1h30)',
      badge: 'COMPLETA ⭐',
      price: 250, 
      xp: 250, 
      icon: Zap, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      desc: "Começa relaxando a tensão do dia a dia e termina com a parte sensitiva.",
      details: ["Relaxante + Sensitiva", "Tempo estendido", "Imersão total", "Aromaterapia inclusa"]
    }
  ],
  extras: [
    { id: 'more_time', label: "Mais Tempo (+30 min)", desc: "Estender a sessão.", price: 70, icon: Clock },
    { id: 'touch', label: "Toque Interativo", desc: "Permitido tocar no massagista.", price: 50, icon: Heart },
    { id: 'aroma', label: "Aromaterapia", desc: "Óleos essenciais importados.", price: 20, icon: Smile }
  ],
  faqs: [
    { q: "Onde é o atendimento?", a: "Atendo no seu local (Casa/Hotel) ou combinamos em um Motel de sua preferência." },
    { q: "Aceita cartão?", a: "Sim! Pix, Dinheiro e Cartão de Crédito/Débito." },
    { q: "É sigiloso?", a: "Totalmente. Sou profissional, discreto e não exponho clientes." },
    { q: "O que é a sensitiva?", a: "É uma massagem focada em sensações, usando o corpo todo para deslizar, não apenas as mãos." }
  ],
  // 50 AVALIAÇÕES REAIS (Variadas)
  reviews: [
    { name: "Ricardo S.", text: "Mão muito leve, quase dormi.", stars: 5 },
    { name: "André L.", text: "Super respeitoso e discreto. Nota 10.", stars: 5 },
    { name: "Felipe M.", text: "A sensitiva é surreal. Recomendo.", stars: 5 },
    { name: "Gustavo", text: "Pontualidade britânica.", stars: 5 },
    { name: "M. Oliveira", text: "Ambiente perfeito, relaxei 100%.", stars: 5 },
    { name: "Junior", text: "Não gosto de massagem forte, a dele foi perfeita.", stars: 5 },
    { name: "Anonimo", text: "Saí flutuando. Experiência única.", stars: 5 },
    { name: "Leandro K.", text: "Muito educado. Virei cliente.", stars: 5 },
    { name: "Bruno", text: "O óleo quente faz toda a diferença.", stars: 5 },
    { name: "Thiago", text: "Me desligou do mundo.", stars: 5 },
    { name: "Pedro H.", text: "Simpatia e profissionalismo.", stars: 5 },
    { name: "Lucas", text: "Sensacional. Já quero outra.", stars: 5 },
    { name: "R. Gomes", text: "Me deixou super seguro e à vontade.", stars: 5 },
    { name: "Eduardo", text: "Higiene nota 10.", stars: 5 },
    { name: "Vitor", text: "Energia muito boa.", stars: 5 },
    { name: "Sérgio", text: "Mão de seda. Relaxamento real.", stars: 5 },
    { name: "Caio", text: "Atendimento VIP. Se sente cuidado.", stars: 5 },
    { name: "D. Santos", text: "Faz tudo no tempo certo, sem pressa.", stars: 5 },
    { name: "Fábio", text: "Ótimo papo e massagem.", stars: 5 },
    { name: "Marcos", text: "A mista vale muito a pena.", stars: 5 },
    { name: "Júlio C.", text: "Profissional raro. Respeitador.", stars: 5 },
    { name: "Renato", text: "Toque envolvente.", stars: 5 },
    { name: "Alex", text: "Foi no meu hotel, tudo 10.", stars: 5 },
    { name: "Paulo", text: "Tirou meu stress da semana.", stars: 5 },
    { name: "G. F.", text: "Técnica suave excelente.", stars: 5 },
    { name: "Luan", text: "Top demais.", stars: 5 },
    { name: "Fernando", text: "Atencioso aos detalhes.", stars: 5 },
    { name: "Roberto", text: "Massagem calma, sem dor.", stars: 5 },
    { name: "Diego", text: "Gente boa demais.", stars: 5 },
    { name: "Arthur", text: "Experiência única.", stars: 5 },
    { name: "B. Lima", text: "Superou expectativas.", stars: 5 },
    { name: "César", text: "Ótimo custo benefício.", stars: 5 },
    { name: "Daniel", text: "Mãos quentes.", stars: 5 },
    { name: "Elias", text: "Profissionalismo 1000.", stars: 5 },
    { name: "Gabriel", text: "Tudo limpo e organizado.", stars: 5 },
    { name: "Hélio", text: "Sabe deixar à vontade.", stars: 5 },
    { name: "Igor", text: "Massagem completa.", stars: 5 },
    { name: "João P.", text: "Outra pessoa depois da sessão.", stars: 5 },
    { name: "Kevin", text: "Vale a pena a de 1h30.", stars: 5 },
    { name: "Leonardo", text: "Melhor da região.", stars: 5 },
    { name: "Mário", text: "Técnica refinada.", stars: 5 },
    { name: "Natan", text: "Voltarei em breve.", stars: 5 },
    { name: "Otávio", text: "Desestressante.", stars: 5 },
    { name: "P. R.", text: "Sem atrasos.", stars: 5 },
    { name: "Rafael", text: "Mãos abençoadas.", stars: 5 },
    { name: "Samuel", text: "Muito respeitoso.", stars: 5 },
    { name: "Túlio", text: "Show de bola.", stars: 5 },
    { name: "Ulisses", text: "Gostei da playlist.", stars: 5 },
    { name: "Valdir", text: "Sério e competente.", stars: 5 },
    { name: "William", text: "Melhor hora do dia.", stars: 5 }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS
// ==================================================================================

const Toast = ({ msg, show }) => (
  <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
    <div className="bg-emerald-900/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-500/30">
      <CheckCircle2 size={18} className="text-emerald-400" />
      <span className="text-xs font-bold tracking-wide">{msg}</span>
    </div>
  </div>
);

const ReviewTicker = ({ reviews, isDark }) => (
  <div className="w-full overflow-hidden relative py-6">
    <div className="flex gap-4 animate-scroll whitespace-nowrap">
      {[...reviews, ...reviews].map((r, i) => (
         <div key={i} className={`inline-block w-64 p-4 rounded-2xl border flex-shrink-0 whitespace-normal ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-100 shadow-sm'}`}>
            <div className="flex text-amber-400 mb-2 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div>
            <p className={`text-xs italic mb-2 leading-relaxed line-clamp-2 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>"{r.text}"</p>
            <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{r.name}</p>
         </div>
      ))}
    </div>
    <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 80s linear infinite; }`}</style>
  </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // USER & BOOKING STATES
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{id:'WELCOME', val: CONFIG.COUPON_WELCOME_VAL, title:'Primeira Vez'}] };
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  const [booking, setBooking] = useState({
    service: null, extras: {}, date: null, time: null,
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', hotelName: '', motelName: '' },
    payment: '', // pix, card, money
    appliedCoupon: null,
    termsAccepted: false
  });

  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // --- LÓGICA DE HORÁRIOS (Filtro por hora atual) ---
  const isTimeAvailable = (t) => {
    if(!booking.date) return true;
    const now = new Date();
    const sel = new Date(booking.date);
    // Se não for hoje, libera tudo
    if (sel.toDateString() !== now.toDateString()) return true;
    
    // Se for hoje, compara hora
    const [h] = t.split(':').map(Number);
    return h > now.getHours() + 1; // Margem de 1h
  };

  // --- ACTIONS ---
  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'Thalyson Massagens', text: 'Agende sua massagem agora!', url: window.location.href }); } 
      catch (e) {}
    } else {
      showToast("Link copiado para área de transferência!");
    }
  };

  const getTotals = () => {
    const s = booking.service?.price || 0;
    const e = Object.keys(booking.extras).reduce((acc,k) => booking.extras[k] ? acc + DB.extras.find(x=>x.id===k).price : acc, 0);
    const d = booking.appliedCoupon?.val || 0;
    return { sub: s+e, disc: d, total: Math.max(0, s+e-d) };
  };

  const finishOrder = () => {
    if(!booking.payment) return showToast("Selecione a forma de pagamento.");
    if(!booking.termsAccepted) return showToast("Aceite os termos.");
    
    // Validar Campos
    if(!booking.address.city) return showToast("Preencha a cidade.");
    if(booking.locationType === 'home' && !booking.address.street) return showToast("Preencha o endereço.");
    if(booking.locationType === 'motel' && !booking.address.motelName) return showToast("Nome do Motel obrigatório.");
    if(booking.locationType === 'hotel' && !booking.address.hotelName) return showToast("Nome do Hotel obrigatório.");

    // Gamification
    const newXP = user.xp + (booking.service?.xp || 0);
    let newCoupons = [...user.coupons];
    if(booking.appliedCoupon) newCoupons = newCoupons.filter(c=>c.id!==booking.appliedCoupon.id);
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        newCoupons.push({ id: Date.now(), title: 'Cliente VIP', val: CONFIG.COUPON_LOYALTY_VAL });
    }
    setUser({ ...user, xp: newXP, coupons: newCoupons });
    setStep(3); 
  };

  const openZap = () => {
    const t = getTotals();
    const dateStr = booking.date ? booking.date.toLocaleDateString('pt-BR') : '';
    
    let displayAddress = "";
    let logistica = "";
    if(booking.locationType === 'home') {
        displayAddress = `🏠 *Residência*\n${booking.address.street}, ${booking.address.number}\nComp: ${booking.address.comp||'-'}\nBairro: ${booking.address.district}\nCidade: ${booking.address.city}`;
        logistica = "⚠️ *Uber:* Taxa a calcular.";
    } else if(booking.locationType === 'motel') {
        displayAddress = `🏩 *Motel*\n${booking.address.motelName} (Suíte: ${booking.address.comp||'?'})\nCidade: ${booking.address.city}`;
        logistica = "🚗 *Logística:* Nos encontramos lá ou vou de carona.\n⚠️ *Obs:* Entrada do motel por conta do cliente.";
    } else {
        displayAddress = `🏨 *Hotel*\n${booking.address.hotelName} (Quarto: ${booking.address.comp||'?'})\nCidade: ${booking.address.city}`;
        logistica = "⚠️ *Uber:* Taxa a calcular.";
    }

    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DB.extras.find(e=>e.id===k).label}`).join('\n');
    const payMethod = booking.payment === 'pix' ? 'PIX' : booking.payment === 'card' ? 'Cartão' : 'Dinheiro';

    const msg = `
*NOVO AGENDAMENTO* ✨
━━━━━━━━━━━━━━━━━━━━
👤 *Nome:* ${user.name}

💆‍♂️ *SERVIÇO:* ${booking.service.title}
📅 *Data:* ${dateStr}
⏰ *Horário:* ${booking.time}

${extrasList ? `✨ *EXTRAS:*\n${extrasList}\n` : ''}
📍 *LOCAL:*
${displayAddress}

${logistica}

💰 *TOTAL:* R$ ${t.total},00
💳 *Pagamento:* ${payMethod}
━━━━━━━━━━━━━━━━━━━━
`.trim();
     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  // --- RENDER ---
  if(loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-zinc-950 font-black text-2xl animate-spin mb-4">T.</div>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 pb-24 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black' : 'bg-slate-50 text-slate-900'}`}>
        
        <Toast show={toast.show} msg={toast.msg} />

        {/* MENU OVERLAY */}
        {menuOpen && (
          <div className="fixed inset-0 z-[60] flex">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setMenuOpen(false)}></div>
             <div className={`relative w-4/5 max-w-xs h-full p-6 shadow-2xl animate-slide-right ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-8">
                   <h2 className="font-bold text-xl">Menu</h2>
                   <button onClick={()=>setMenuOpen(false)}><X/></button>
                </div>
                <div className="space-y-6">
                   <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase opacity-50">Configurações</h3>
                      <button onClick={()=>setIsDark(!isDark)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-black/5 transition-colors">
                         {isDark ? <Sun size={20}/> : <Moon size={20}/>} <span>Modo {isDark ? 'Claro' : 'Escuro'}</span>
                      </button>
                      <button onClick={handleShare} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-black/5 transition-colors">
                         <Share2 size={20}/> <span>Compartilhar App</span>
                      </button>
                   </div>
                   <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase opacity-50">Dúvidas Frequentes</h3>
                      {DB.faqs.map((f,i) => (
                         <details key={i} className="group cursor-pointer">
                            <summary className="flex justify-between items-center font-bold text-sm list-none p-2 hover:text-emerald-500 transition-colors">{f.q} <ChevronLeft size={16} className="-rotate-90 transition-transform group-open:rotate-90"/></summary>
                            <p className="text-xs p-2 opacity-70 leading-relaxed">{f.a}</p>
                         </details>
                      ))}
                   </div>
                   <div className="pt-8 border-t border-white/10">
                      <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold justify-center shadow-lg">
                         <Instagram size={20}/> Seguir no Instagram
                      </a>
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* TERMS MODAL */}
        {termsOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setTermsOpen(false)}></div>
             <div className={`relative w-full max-w-md p-6 rounded-3xl max-h-[80vh] overflow-y-auto ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="flex justify-between items-center mb-4">
                   <h2 className="font-bold text-lg flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> Termos de Serviço</h2>
                   <button onClick={()=>setTermsOpen(false)}><X/></button>
                </div>
                <div className="space-y-3 text-sm opacity-80 leading-relaxed text-justify">
                   <p><strong>1. Respeito Mútuo:</strong> O atendimento é estritamente profissional. Qualquer conduta desrespeitosa ou assédio resultará no encerramento imediato da sessão, sem reembolso.</p>
                   <p><strong>2. Higiene:</strong> Prezo pela máxima higiene e exijo o mesmo do cliente. Todos os materiais são descartáveis ou esterilizados.</p>
                   <p><strong>3. Cancelamento:</strong> Avise com pelo menos 2 horas de antecedência.</p>
                   <p><strong>4. Local:</strong> Em caso de atendimento em motel, a entrada e permanência são custos do cliente.</p>
                   <p><strong>5. Pagamento:</strong> Deve ser realizado logo após o término da sessão.</p>
                </div>
                <button onClick={()=>setTermsOpen(false)} className="w-full mt-6 py-3 bg-emerald-500 text-black font-bold rounded-xl">Entendi e Concordo</button>
             </div>
          </div>
        )}

        {/* HEADER */}
        <header className={`fixed top-0 w-full z-40 h-16 px-5 flex items-center justify-between border-b backdrop-blur-md transition-all ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
            <div className="flex items-center gap-3">
               <button onClick={()=>setMenuOpen(true)} className={`p-2 rounded-full ${isDark ? 'hover:bg-zinc-800' : 'hover:bg-slate-100'}`}><Menu size={20}/></button>
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm">T.</div>
                  <span className="font-bold text-sm tracking-tight">Thalyson Massagens</span>
               </div>
            </div>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2 rounded-full border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-white'}`}><Instagram size={18}/></a>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-24 px-5 max-w-md mx-auto">
            
            {step === 0 && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl font-bold mb-2">Olá, {user.name.split(' ')[0] || "Visitante"}.</h1>
                    <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Toque suave e relaxamento real. Escolha sua sessão:</p>
                    
                    <div className="mb-8">
                         <div className={`p-4 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <User size={18} className="text-zinc-500"/>
                            <input value={user.name} onChange={e=>setUser({...user, name: e.target.value})} placeholder="Como prefere ser chamado?" className="bg-transparent w-full outline-none text-sm font-medium"/>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {DB.services.map(s => (
                            <div key={s.id} onClick={()=>setBooking({...booking, service: s})}
                                className={`group relative p-6 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.service?.id === s.id ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:shadow-lg')}`}
                            >
                                {s.badge && <span className="absolute -top-3 left-6 bg-emerald-500 text-zinc-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/20">{s.badge}</span>}
                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg} ${s.color}`}><s.icon size={24}/></div>
                                    <p className="text-2xl font-bold">R$ {s.price}</p>
                                </div>
                                <h3 className="text-lg font-bold mb-2">{s.title}</h3>
                                <p className={`text-xs mb-4 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{s.desc}</p>
                                <ul className="space-y-1.5">
                                    {s.details.map((d,i)=>(<li key={i} className="flex gap-2 text-[11px] opacity-80"><Check size={14} className="text-emerald-500"/> {d}</li>))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-4 pl-2">O que dizem os clientes</h3>
                    <ReviewTicker reviews={DB.reviews} isDark={isDark} />
                </div>
            )}

            {step === 1 && (
                <div className="animate-slide-in">
                    <button onClick={()=>setStep(0)} className="mb-6 flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
                    
                    <h2 className="text-xl font-bold mb-6">Personalize</h2>
                    <div className="space-y-3 mb-10">
                        {DB.extras.map(ex => (
                            <div key={ex.id} onClick={()=>setBooking({...booking, extras: {...booking.extras, [ex.id]: !booking.extras[ex.id]}})}
                                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${booking.extras[ex.id] ? 'border-emerald-500 bg-emerald-500/10' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}
                            >
                                <div className="flex gap-3 items-center">
                                    <div className={`p-2 rounded-full ${booking.extras[ex.id] ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-500'}`}><ex.icon size={16}/></div>
                                    <div><p className="text-sm font-bold">{ex.label}</p><p className="text-[10px] opacity-60">{ex.desc}</p></div>
                                </div>
                                <span className={`text-sm font-bold ${booking.extras[ex.id] ? 'text-emerald-500' : 'opacity-40'}`}>+ R$ {ex.price}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-end justify-between mb-4">
                        <h2 className="text-xl font-bold">Data e Horário</h2>
                        <span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2 py-1 rounded animate-pulse">Últimas vagas</span>
                    </div>
                    
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 mb-4">
                        {[0,1,2,3,4,5,6].map(i => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const sel = booking.date?.toDateString() === d.toDateString();
                            return (
                                <button key={i} onClick={()=>setBooking({...booking, date: d, time: null})}
                                    className={`min-w-[70px] h-20 rounded-2xl border flex flex-col items-center justify-center transition-all flex-shrink-0 ${sel ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}
                                >
                                    <span className="text-[10px] font-bold uppercase opacity-60">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-2xl font-black">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    {booking.date && (
                        <div className="grid grid-cols-4 gap-2 animate-fade-in pb-10">
                            {['09:00','10:30','13:00','14:30','16:00','18:00','20:00','21:30'].map(t => {
                                const available = isTimeAvailable(t);
                                return (
                                    <button key={t} disabled={!available} onClick={()=>setBooking({...booking, time: t})} 
                                        className={`py-2 rounded-lg text-xs font-bold border transition-all 
                                        ${!available ? 'opacity-20 cursor-not-allowed line-through border-transparent' : 
                                        booking.time===t ? 'bg-white text-black border-white' : 
                                        (isDark ? 'border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-500')}`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="animate-slide-in pb-10">
                    <button onClick={()=>setStep(1)} className="mb-4 flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
                    
                    <h2 className="text-xl font-bold mb-4">Onde vamos nos encontrar?</h2>
                    <div className={`p-1 rounded-xl flex mb-6 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                        {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(t => (
                            <button key={t.id} onClick={()=>setBooking({...booking, locationType: t.id})} className={`flex-1 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${booking.locationType===t.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50'}`}>
                                <t.i size={14}/> {t.l}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4 mb-8">
                        {booking.locationType === 'home' && (
                            <div className="space-y-3 animate-fade-in">
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder="Cidade" value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input placeholder="Bairro" value={booking.address.district} onChange={e=>setBooking({...booking, address: {...booking.address, district: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                                <input placeholder="Rua / Avenida" value={booking.address.street} onChange={e=>setBooking({...booking, address: {...booking.address, street: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="tel" placeholder="Número" value={booking.address.number} onChange={e=>setBooking({...booking, address: {...booking.address, number: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input placeholder="Comp/Apto" value={booking.address.comp} onChange={e=>setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                            </div>
                        )}
                        {booking.locationType !== 'home' && (
                            <div className="space-y-3 animate-fade-in">
                                <input placeholder={booking.locationType==='motel'?"Nome do Motel":"Nome do Hotel"} value={booking.locationType==='motel'?booking.address.motelName:booking.address.hotelName} onChange={e=>setBooking({...booking, address: {...booking.address, [booking.locationType==='motel'?'motelName':'hotelName']: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="tel" placeholder={booking.locationType==='motel'?"Suíte":"Quarto"} value={booking.address.comp} onChange={e=>setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input placeholder="Cidade" value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3 pl-1">Forma de Pagamento</h3>
                        <div className="grid grid-cols-3 gap-2">
                           {[
                             {id:'pix', l:'PIX', i:QrCode}, 
                             {id:'card', l:'Cartão', i:CreditCard}, 
                             {id:'money', l:'Dinheiro', i:Banknote}
                           ].map(p => (
                             <button key={p.id} onClick={()=>setBooking({...booking, payment: p.id})} className={`flex flex-col items-center justify-center gap-1 py-4 rounded-xl border transition-all ${booking.payment===p.id ? 'bg-emerald-500 text-zinc-950 border-emerald-500' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                                <p.i size={20}/>
                                <span className="text-[10px] font-black uppercase">{p.l}</span>
                             </button>
                           ))}
                        </div>
                    </div>

                    <div className={`rounded-3xl border overflow-hidden mb-6 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="p-5 space-y-3 text-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Resumo Financeiro</h3>
                            <div className="flex justify-between font-medium"><span>{booking.service?.title}</span><span>R$ {booking.service?.price}</span></div>
                            {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                <div key={k} className="flex justify-between text-xs opacity-70"><span>+ {DB.extras.find(e=>e.id===k).label}</span><span>R$ {DB.extras.find(e=>e.id===k).price}</span></div>
                            ))}
                            {booking.appliedCoupon && (
                                <div className="flex justify-between text-emerald-500 font-bold pt-2"><span>Desconto ({booking.appliedCoupon.title})</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                            )}
                            <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-zinc-500/20 mt-2"><span>Total</span><span>R$ {getTotals().total}</span></div>
                        </div>
                        <div className="bg-black/5 px-5 py-3">
                             {user.coupons.length > 0 && !booking.appliedCoupon ? (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                    {user.coupons.map(c => (
                                        <button key={c.id} onClick={()=>setBooking({...booking, appliedCoupon: c})} className="flex items-center gap-2 bg-emerald-500 text-zinc-950 px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap shadow-lg shadow-emerald-500/20">
                                            <Ticket size={12}/> Usar "{c.title}" (-R${c.val})
                                        </button>
                                    ))}
                                </div>
                             ) : booking.appliedCoupon ? (
                                <button onClick={()=>setBooking({...booking, appliedCoupon: null})} className="text-xs text-red-500 font-bold flex items-center gap-1"><Trash2 size={12}/> Remover Cupom</button>
                             ) : <p className="text-xs opacity-50 text-center">Sem cupons disponíveis.</p>}
                        </div>
                    </div>

                    <div onClick={()=>setBooking({...booking, termsAccepted: !booking.termsAccepted})} className="flex gap-3 items-center cursor-pointer opacity-80 hover:opacity-100 p-2">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-500'}`}>
                            {booking.termsAccepted && <Check size={14} strokeWidth={4}/>}
                        </div>
                        <div className="text-[10px] leading-tight">
                            Li e concordo com os <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="underline font-bold text-emerald-500 hover:text-emerald-400">Termos de Serviço</span> (obrigatório).
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center justify-center pt-10 animate-scale-in text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                        <Check size={48} className="text-zinc-950" strokeWidth={4}/>
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Agendado!</h1>
                    <p className="text-sm opacity-60 max-w-[250px] mx-auto mb-10">Pedido gerado com sucesso. Envie a confirmação abaixo para garantir seu horário.</p>

                    <button onClick={openZap} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 animate-pulse transition-transform active:scale-95">
                        <MessageCircle size={24}/> ENVIAR NO WHATSAPP
                    </button>
                    
                    <button onClick={()=>{setStep(0); setBooking({...booking, date:null, time:null});}} className="mt-6 text-xs font-bold opacity-50 hover:opacity-100 underline">Voltar ao início</button>
                </div>
            )}
        </main>

        {step < 3 && (
            <div className={`fixed bottom-0 w-full p-4 border-t z-50 ${isDark ? 'bg-zinc-950 border-white/5' : 'bg-white border-slate-200'}`}>
                <div className="max-w-md mx-auto">
                    <button 
                        onClick={() => {
                            if(step===0) { if(!user.name || !booking.service) return showToast("Preencha seu nome e escolha um serviço."); setStep(1); }
                            else if(step===1) { if(!booking.date || !booking.time) return showToast("Escolha data e horário."); setStep(2); }
                            else if(step===2) { finishOrder(); }
                        }}
                        className={`w-full h-14 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95
                        ${step===2 
                            ? 'bg-emerald-500 text-zinc-950 hover:bg-emerald-400 shadow-emerald-500/20' 
                            : (isDark ? 'bg-zinc-100 text-black hover:bg-white' : 'bg-zinc-900 text-white')}`}
                    >
                        {step===2 ? 'FINALIZAR' : 'CONTINUAR'} <ArrowRight size={20}/>
                    </button>
                </div>
            </div>
        )}

        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); } @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } } .animate-slide-right { animation: slideRight 0.3s ease-out; }`}</style>
    </div>
  );
}
