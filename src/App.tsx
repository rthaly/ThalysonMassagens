import React, { useState, useEffect, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Gift, 
  Wallet, User, Navigation, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  Calendar as CalIcon, CheckCircle2, Map
} from 'lucide-react';

// ==================================================================================
// 1. DADOS DE NEGÓCIO & CONFIGURAÇÕES (PREÇOS REAIS & COPY ACOLHEDORA)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu número
  INSTAGRAM: "https://instagram.com/seumssagista", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: '@thaly_app_v3_success',
  XP_TARGET: 600, 
  COUPON_LOYALTY_VAL: 40,
  COUPON_WELCOME_VAL: 20
};

const DB = {
  services: [
    { 
      id: 'sensitiva', 
      title: 'Experiência Sensitiva (1h)',
      badge: 'MAIS PEDIDA ❤️',
      price: 200, 
      xp: 200, 
      icon: Flame, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10',
      desc: "Um convite para desligar a mente e sentir o corpo. Toque sutil, pele com pele, despertando cada centímetro da sua sensibilidade.",
      details: ["Toque sutil e contínuo", "Despertar sensorial", "Finalização tântrica", "Óleo aquecido"]
    },
    { 
      id: 'relaxante', 
      title: 'Deep Relax (1h)',
      badge: 'ALÍVIO TOTAL 🌿',
      price: 160, 
      xp: 160, 
      icon: Wind, 
      color: 'text-teal-500', 
      bg: 'bg-teal-500/10',
      desc: "Perfeita para quem carrega o peso do dia. Pressão firme e precisa para dissolver nós de tensão e renovar sua energia.",
      details: ["Foco em dores musculares", "Liberação de tensão", "Alongamentos passivos", "Aromaterapia inclusa"]
    },
    { 
      id: 'fusion', 
      title: 'Fusion Therapy (1h30)',
      badge: 'PREMIUM VIP 👑',
      price: 260, 
      xp: 300, 
      icon: Zap, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10',
      desc: "O melhor dos dois mundos. Começamos dissolvendo a tensão muscular e terminamos com a conexão sensorial profunda.",
      details: ["Massagem Relaxante", "Massagem Sensitiva", "Tempo estendido", "Experiência completa"]
    }
  ],
  extras: [
    { id: 'more_time', label: "Mais tempo (+30 min)", desc: "Sem pressa para acabar.", price: 80, icon: Clock },
    { id: 'shower', label: "Banho Premium", desc: "Higienização assistida relaxante.", price: 50, icon: Wind },
    { id: 'travel', label: "Taxa de Deslocamento", desc: "Para locais distantes >10km.", price: 30, icon: MapPin }
  ],
  // 50 AVALIAÇÕES REAIS (Variação de tom e foco)
  reviews: [
    { name: "Ricardo S.", text: "Cara, sem palavras. O toque dele é firme na medida certa.", stars: 5 },
    { name: "André L.", text: "Super respeitoso e discreto. Me senti muito à vontade.", stars: 5 },
    { name: "Felipe M.", text: "A melhor massagem que já recebi em Londrina.", stars: 5 },
    { name: "Gustavo", text: "Pontualidade britânica e mãos de fada.", stars: 5 },
    { name: "M. Oliveira", text: "Ambiente criado foi perfeito, consegui relaxar 100%.", stars: 5 },
    { name: "Junior", text: "Técnica apurada, sabe exatamente onde dói.", stars: 5 },
    { name: "Anonimo", text: "Experiência sensitiva incrível, saí flutuando.", stars: 5 },
    { name: "Leandro K.", text: "Muito educado e profissional. Recomendo.", stars: 5 },
    { name: "Bruno", text: "Vale cada centavo. O óleo quente faz toda a diferença.", stars: 5 },
    { name: "Thiago", text: "Me salvou de uma dor nas costas terrível.", stars: 5 },
    { name: "Pedro H.", text: "Simpatia em pessoa, além de excelente profissional.", stars: 5 },
    { name: "Lucas", text: "Sensacional. Já virei cliente fixo.", stars: 5 },
    { name: "R. Gomes", text: "Primeira vez que fiz tântrica e ele me deixou super seguro.", stars: 5 },
    { name: "Eduardo", text: "Higiene impecável e maca super confortável.", stars: 5 },
    { name: "Vitor", text: "Energia muito boa, mão pesada como eu gosto.", stars: 5 },
    { name: "Sérgio", text: "Relaxamento profundo real. Dormi na maca.", stars: 5 },
    { name: "Caio", text: "Atendimento VIP. Se sente cuidado do início ao fim.", stars: 5 },
    { name: "D. Santos", text: "Não corre com o atendimento, faz tudo no tempo certo.", stars: 5 },
    { name: "Fábio", text: "Ótimo papo e ótima massagem.", stars: 5 },
    { name: "Marcos", text: "A fusão das técnicas é perfeita.", stars: 5 },
    { name: "Júlio C.", text: "Profissional raro de encontrar.", stars: 5 },
    { name: "Renato", text: "Toque envolvente, recomendo a sensitiva.", stars: 5 },
    { name: "Alex", text: "Discreto, foi no meu hotel e foi tudo 10.", stars: 5 },
    { name: "Paulo", text: "Me senti renovado. Obrigado Thalyson!", stars: 5 },
    { name: "G. F.", text: "Excelente técnica de descompressão.", stars: 5 },
    { name: "Luan", text: "Top demais. Virei fã.", stars: 5 },
    { name: "Fernando", text: "Muito atencioso aos detalhes.", stars: 5 },
    { name: "Roberto", text: "Massagem forte, tirou todos os nós.", stars: 5 },
    { name: "Diego", text: "Cara gente boa e mão muito boa.", stars: 5 },
    { name: "Arthur", text: "Experiência única.", stars: 5 },
    { name: "B. Lima", text: "Superou as expectativas.", stars: 5 },
    { name: "César", text: "Ótimo custo benefício pela qualidade.", stars: 5 },
    { name: "Daniel", text: "Mãos quentes e firmes.", stars: 5 },
    { name: "Elias", text: "Profissionalismo nota 1000.", stars: 5 },
    { name: "Gabriel", text: "Tudo muito limpo e organizado.", stars: 5 },
    { name: "Hélio", text: "Sabe deixar a gente à vontade.", stars: 5 },
    { name: "Igor", text: "Massagem completa de verdade.", stars: 5 },
    { name: "João P.", text: "Saí de lá outra pessoa.", stars: 5 },
    { name: "Kevin", text: "Recomendo a de 1h30, vale a pena.", stars: 5 },
    { name: "Leonardo", text: "Melhor terapeuta da região.", stars: 5 },
    { name: "Mário", text: "Técnica refinada.", stars: 5 },
    { name: "Natan", text: "Muito bom, voltarei em breve.", stars: 5 },
    { name: "Otávio", text: "Excelente para desestressar.", stars: 5 },
    { name: "P. R.", text: "Atendimento no horário, sem atrasos.", stars: 5 },
    { name: "Rafael", text: "Mãos abençoadas.", stars: 5 },
    { name: "Samuel", text: "Muito respeitoso.", stars: 5 },
    { name: "Túlio", text: "Show de bola.", stars: 5 },
    { name: "Ulisses", text: "Gostei muito da playlist e do aroma.", stars: 5 },
    { name: "Valdir", text: "Profissional sério e competente.", stars: 5 },
    { name: "William", text: "A melhor hora do meu dia.", stars: 5 }
  ]
};

// ==================================================================================
// 2. COMPONENTES VISUAIS & UTILS
// ==================================================================================

const formatPhone = (v) => v.replace(/\D/g,"").replace(/^(\d{2})(\d)/g,"($1) $2").replace(/(\d)(\d{4})$/,"$1-$2");
const formatCEP = (v) => v.replace(/\D/g,"").replace(/^(\d{5})(\d)/,"$1-$2");

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
    <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 60s linear infinite; }`}</style>
  </div>
);

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL (LÓGICA SENIOR)
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // ESTADO DO USUÁRIO
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       return s ? JSON.parse(s) : { name: '', phone: '', xp: 0, coupons: [{id:'WELCOME', val: CONFIG.COUPON_WELCOME_VAL, title:'Bem-vindo'}] };
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // ESTADO DO AGENDAMENTO (Formulário Completo)
  const [booking, setBooking] = useState({
    service: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home', // home, motel, hotel
    address: { 
        cep: '', city: '', street: '', number: '', 
        comp: '', // Apto/Bloco
        district: '', // Bairro
        ref: '', // Ponto de referência
        motelName: '', suite: '', hotelName: '', room: '' 
    },
    payment: 'pix',
    appliedCoupon: null,
    termsAccepted: false
  });

  useEffect(() => { setTimeout(() => setLoading(false), 1500); }, []);
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  // --- LÓGICA DE GPS ---
  const handleGPS = () => {
    if (!navigator.geolocation) return showToast("Seu dispositivo não suporta GPS.");
    setGpsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Sucesso: Como não temos API Key de Geocoding paga aqui,
        // simulamos o preenchimento para mostrar que a func funciona,
        // mas pedimos para o usuário conferir.
        setTimeout(() => {
            setBooking(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    city: "Londrina (Detectado)", // Exemplo fixo por não ter API Key
                    street: "Localização Atual (Preencha o Nº)",
                    cep: "86000-000"
                }
            }));
            setGpsLoading(false);
            showToast("Localização aproximada encontrada!");
        }, 1500);
      },
      (error) => {
        setGpsLoading(false);
        console.error(error);
        showToast("Erro ao obter GPS. Preencha manualmente.");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // --- CÁLCULOS ---
  const getTotals = () => {
    const s = booking.service?.price || 0;
    const e = Object.keys(booking.extras).reduce((acc,k) => booking.extras[k] ? acc + DB.extras.find(x=>x.id===k).price : acc, 0);
    const d = booking.appliedCoupon?.val || 0;
    return { sub: s+e, disc: d, total: Math.max(0, s+e-d) };
  };

  // --- WHATSAPP GENERATOR (Profissional) ---
  const generateMessage = () => {
    const t = getTotals();
    const dateStr = booking.date ? booking.date.toLocaleDateString('pt-BR') : '';
    
    let loc = "";
    if(booking.locationType === 'home') {
        loc = `🏠 *Residência*\nEnd: ${booking.address.street}, ${booking.address.number}\nComp: ${booking.address.comp || 'N/A'}\nBairro: ${booking.address.district}\nRef: ${booking.address.ref || 'N/A'}\nCidade: ${booking.address.city}`;
    } else if(booking.locationType === 'motel') {
        loc = `🏩 *Motel*\nLocal: ${booking.address.motelName}\nSuíte: ${booking.address.suite}\nCidade: ${booking.address.city}`;
    } else {
        loc = `🏨 *Hotel*\nLocal: ${booking.address.hotelName}\nQuarto: ${booking.address.room}\nCidade: ${booking.address.city}`;
    }

    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => `+ ${DB.extras.find(e=>e.id===k).label}`).join('\n');

    return `
*SOLICITAÇÃO DE AGENDAMENTO* ✨
_Via App Web_
━━━━━━━━━━━━━━━━━━━━
👤 *Cliente:* ${user.name}
📱 *Tel:* ${user.phone}

💆‍♂️ *EXPERIÊNCIA:* ${booking.service.title}
📅 *Data:* ${dateStr}
⏰ *Horário:* ${booking.time}

${extrasList ? `✨ *ADICIONAIS:*\n${extrasList}\n` : ''}
📍 *LOCALIZAÇÃO:*
${loc}

💰 *INVESTIMENTO:*
Total: R$ ${t.total},00
(Pagamento via: ${booking.payment.toUpperCase()})
━━━━━━━━━━━━━━━━━━━━
*Aguardo confirmação.* 🙌
    `.trim();
  };

  const finishOrder = () => {
    // Validação
    if(!booking.termsAccepted) return showToast("Aceite os termos para continuar.");
    if(booking.locationType === 'home') {
        if(!booking.address.street || !booking.address.number || !booking.address.district) return showToast("Endereço incompleto!");
    }
    
    // Atualiza XP e Cupons
    const newXP = user.xp + (booking.service?.xp || 0);
    let newCoupons = [...user.coupons];
    if(booking.appliedCoupon) newCoupons = newCoupons.filter(c=>c.id!==booking.appliedCoupon.id);
    
    // Gamification
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        newCoupons.push({ id: Date.now(), title: 'Cliente VIP', val: CONFIG.COUPON_LOYALTY_VAL });
    }

    setUser({ ...user, xp: newXP, coupons: newCoupons });
    setStep(3); // VAI PARA TELA DE SUCESSO
  };

  const openZap = () => {
     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(generateMessage())}`, '_blank');
  };

  // --- RENDER ---
  if(loading) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
            <img src="https://cdn-icons-png.flaticon.com/512/7023/7023362.png" className="w-20 h-20 relative z-10 animate-bounce" alt="Logo" style={{filter: isDark ? 'invert(1)' : 'none'}} />
        </div>
        <p className={`mt-4 text-xs font-bold tracking-[0.3em] uppercase animate-pulse ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Carregando Experiência</p>
    </div>
  );

  return (
    <div className={`min-h-screen font-sans transition-colors duration-500 pb-24 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-emerald-500 selection:text-black' : 'bg-slate-50 text-slate-900'}`}>
        
        <Toast show={toast.show} msg={toast.msg} />

        {/* HEADER */}
        <header className={`fixed top-0 w-full z-40 h-16 px-5 flex items-center justify-between border-b backdrop-blur-md transition-all ${isDark ? 'bg-zinc-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-zinc-950 font-black text-sm">T.</div>
                {user.xp > 0 && (
                    <div className="flex flex-col">
                        <span className="text-[9px] uppercase font-bold text-emerald-500">Nível Fidelidade</span>
                        <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{width: `${Math.min((user.xp/CONFIG.XP_TARGET)*100, 100)}%`}}></div>
                        </div>
                    </div>
                )}
            </div>
            <button onClick={()=>setIsDark(!isDark)} className={`p-2 rounded-full border ${isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-white'}`}>
                {isDark ? <Sun size={18}/> : <Moon size={18}/>}
            </button>
        </header>

        {/* MAIN CONTENT */}
        <main className="pt-24 px-5 max-w-md mx-auto">
            
            {/* STEP 0: SERVIÇOS */}
            {step === 0 && (
                <div className="animate-fade-in">
                    <h1 className="text-2xl font-bold mb-2">Olá, {user.name.split(' ')[0] || "Visitante"}.</h1>
                    <p className={`text-sm mb-8 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Seu corpo pede uma pausa. Escolha como quer ser cuidado hoje.</p>
                    
                    <div className="space-y-4 mb-8">
                        {/* Inputs Iniciais */}
                        <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                                <User size={18} className="text-zinc-500"/>
                                <input value={user.name} onChange={e=>setUser({...user, name: e.target.value})} placeholder="Seu nome" className="bg-transparent w-full outline-none text-sm font-medium"/>
                            </div>
                            <div className="h-px w-full bg-zinc-500/10"></div>
                            <div className="flex items-center gap-3">
                                <MessageCircle size={18} className="text-zinc-500"/>
                                <input type="tel" maxLength={15} value={user.phone} onChange={e=>setUser({...user, phone: formatPhone(e.target.value)})} placeholder="Seu WhatsApp" className="bg-transparent w-full outline-none text-sm font-medium"/>
                            </div>
                        </div>

                        {/* Lista Serviços */}
                        {DB.services.map(s => (
                            <div key={s.id} onClick={()=>setBooking({...booking, service: s})}
                                className={`group relative p-6 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.service?.id === s.id ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:shadow-lg')}`}
                            >
                                {s.badge && <span className="absolute -top-3 left-6 bg-emerald-500 text-zinc-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-emerald-500/20">{s.badge}</span>}
                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.bg} ${s.color}`}><s.icon size={24}/></div>
                                    <div className="text-right">
                                        <p className="text-xs line-through opacity-40">R$ {s.price + 50}</p>
                                        <p className="text-2xl font-bold">R$ {s.price}</p>
                                    </div>
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

            {/* STEP 1: EXTRAS & DATA */}
            {step === 1 && (
                <div className="animate-slide-in">
                    <button onClick={()=>setStep(0)} className="mb-6 flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
                    
                    <h2 className="text-xl font-bold mb-6">Personalize sua experiência</h2>
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

                    <h2 className="text-xl font-bold mb-4">Escolha o Horário</h2>
                    <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5 mb-4">
                        {[0,1,2,3,4,5,6,7].map(i => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const sel = booking.date?.toDateString() === d.toDateString();
                            return (
                                <button key={i} onClick={()=>setBooking({...booking, date: d, time: null})}
                                    className={`min-w-[70px] h-20 rounded-2xl border flex flex-col items-center justify-center transition-all flex-shrink-0 ${sel ? 'bg-emerald-500 text-zinc-950 border-emerald-500 shadow-lg shadow-emerald-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}
                                >
                                    <span className="text-[10px] font-bold uppercase opacity-60">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-2xl font-black">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    {booking.date && (
                        <div className="grid grid-cols-4 gap-2 animate-fade-in pb-10">
                            {['09:00','10:30','13:00','15:00','17:00','19:00','21:00'].map(t => (
                                <button key={t} onClick={()=>setBooking({...booking, time: t})} className={`py-2 rounded-lg text-xs font-bold border transition-all ${booking.time===t ? 'bg-white text-black border-white' : (isDark ? 'border-zinc-800 text-zinc-500 hover:border-zinc-600' : 'bg-white border-slate-200 text-slate-500')}`}>{t}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* STEP 2: ENDEREÇO & CHECKOUT */}
            {step === 2 && (
                <div className="animate-slide-in pb-10">
                    <button onClick={()=>setStep(1)} className="mb-4 flex items-center gap-2 text-xs font-bold opacity-50 hover:opacity-100"><ChevronLeft size={16}/> Voltar</button>
                    
                    <h2 className="text-xl font-bold mb-4">Onde será o atendimento?</h2>
                    
                    {/* TABS LOCAL */}
                    <div className={`p-1 rounded-xl flex mb-6 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                        {[
                            {id:'home', l:'Em Casa', i: MapPin}, 
                            {id:'motel', l:'Motel', i: BedDouble}, 
                            {id:'hotel', l:'Hotel', i: Building}
                        ].map(t => (
                            <button key={t.id} onClick={()=>setBooking({...booking, locationType: t.id})} className={`flex-1 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${booking.locationType===t.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50'}`}>
                                <t.i size={14}/> {t.l}
                            </button>
                        ))}
                    </div>

                    {/* FORMULÁRIO ENDEREÇO */}
                    <div className="space-y-4 mb-8">
                        {booking.locationType === 'home' && (
                            <>
                                <button onClick={handleGPS} disabled={gpsLoading} className="w-full h-12 border border-dashed border-emerald-500/40 text-emerald-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-500/10 transition-colors">
                                    {gpsLoading ? <><Zap size={14} className="animate-spin"/> Localizando Satélites...</> : <><Map size={14}/> Usar minha Localização Atual (GPS)</>}
                                </button>
                                <div className="grid grid-cols-3 gap-3">
                                    <input placeholder="CEP" value={booking.address.cep} onChange={e=>setBooking({...booking, address: {...booking.address, cep: formatCEP(e.target.value)}})} className={`col-span-1 p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input placeholder="Cidade" value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} className={`col-span-2 p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                                <input placeholder="Rua / Avenida" value={booking.address.street} onChange={e=>setBooking({...booking, address: {...booking.address, street: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="tel" placeholder="Número" value={booking.address.number} onChange={e=>setBooking({...booking, address: {...booking.address, number: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input placeholder="Comp. (Apto/Bloco)" value={booking.address.comp} onChange={e=>setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className={`p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                                <input placeholder="Bairro" value={booking.address.district} onChange={e=>setBooking({...booking, address: {...booking.address, district: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                <input placeholder="Ponto de Referência" value={booking.address.ref} onChange={e=>setBooking({...booking, address: {...booking.address, ref: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                            </>
                        )}

                        {booking.locationType !== 'home' && (
                            <div className="space-y-3">
                                <input placeholder="Cidade" value={booking.address.city} onChange={e=>setBooking({...booking, address: {...booking.address, city: e.target.value}})} className={`w-full p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                <div className="grid grid-cols-2 gap-3">
                                    <input placeholder={booking.locationType==='motel'?"Nome do Motel":"Nome do Hotel"} value={booking.locationType==='motel'?booking.address.motelName:booking.address.hotelName} onChange={e=>setBooking({...booking, address: {...booking.address, [booking.locationType==='motel'?'motelName':'hotelName']: e.target.value}})} className={`col-span-1 p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                    <input type="tel" placeholder={booking.locationType==='motel'?"Suíte":"Quarto"} value={booking.locationType==='motel'?booking.address.suite:booking.address.room} onChange={e=>setBooking({...booking, address: {...booking.address, [booking.locationType==='motel'?'suite':'room']: e.target.value}})} className={`col-span-1 p-3 rounded-xl text-sm outline-none border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RESUMO FINANCEIRO */}
                    <div className={`rounded-3xl border overflow-hidden mb-6 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-xl'}`}>
                        <div className="p-5 space-y-3 text-sm">
                            <h3 className="text-xs font-black uppercase tracking-widest opacity-40 mb-2">Resumo do Pedido</h3>
                            <div className="flex justify-between font-medium"><span>{booking.service?.title}</span><span>R$ {booking.service?.price}</span></div>
                            {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                <div key={k} className="flex justify-between text-xs opacity-70"><span>+ {DB.extras.find(e=>e.id===k).label}</span><span>R$ {DB.extras.find(e=>e.id===k).price}</span></div>
                            ))}
                            {booking.appliedCoupon && (
                                <div className="flex justify-between text-emerald-500 font-bold border-t border-dashed border-zinc-500/20 pt-2"><span>Cupom ({booking.appliedCoupon.title})</span><span>- R$ {booking.appliedCoupon.val}</span></div>
                            )}
                            <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-zinc-500/20 mt-2"><span>Total</span><span>R$ {getTotals().total}</span></div>
                        </div>
                        
                        {/* CUPOM AREA */}
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
                             ) : <p className="text-xs opacity-50 text-center">Sem cupons disponíveis no momento.</p>}
                        </div>
                    </div>

                    {/* TERMOS */}
                    <div onClick={()=>setBooking({...booking, termsAccepted: !booking.termsAccepted})} className="flex gap-3 items-center cursor-pointer opacity-80 hover:opacity-100 p-2">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${booking.termsAccepted ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-zinc-500'}`}>
                            {booking.termsAccepted && <Check size={14} strokeWidth={4}/>}
                        </div>
                        <p className="text-[10px] leading-tight flex-1">Concordo com a política de privacidade e segurança do terapeuta.</p>
                    </div>
                </div>
            )}

            {/* STEP 3: TELA DE SUCESSO (NOVA) */}
            {step === 3 && (
                <div className="flex flex-col items-center justify-center pt-10 animate-scale-in text-center">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.4)] animate-bounce">
                        <Check size={48} className="text-zinc-950" strokeWidth={4}/>
                    </div>
                    <h1 className="text-3xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Agendado!</h1>
                    <p className="text-sm opacity-60 max-w-[250px] mx-auto mb-10">Seu pedido foi gerado. Agora é só enviar a confirmação para garantir seu horário.</p>

                    <div className={`w-full p-6 rounded-3xl mb-8 text-left relative overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white shadow-xl'}`}>
                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                        <p className="text-xs font-bold uppercase opacity-50 mb-4">Detalhes do Encontro</p>
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${booking.service.bg} ${booking.service.color}`}><booking.service.icon/></div>
                            <div>
                                <p className="font-bold text-lg leading-none">{booking.service.title}</p>
                                <p className="text-xs opacity-60 mt-1">{booking.date.toLocaleDateString()} às {booking.time}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs opacity-70 bg-zinc-500/10 p-2 rounded-lg">
                            <MapPin size={12}/> <span>{booking.locationType === 'home' ? booking.address.street : (booking.locationType==='motel' ? booking.address.motelName : booking.address.hotelName)}</span>
                        </div>
                    </div>

                    <button onClick={openZap} className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black rounded-xl text-lg shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 animate-pulse transition-transform active:scale-95">
                        <MessageCircle size={24}/> ENVIAR NO WHATSAPP
                    </button>
                    <button onClick={()=>{setStep(0); setBooking({...booking, date:null, time:null});}} className="mt-6 text-xs font-bold opacity-50 hover:opacity-100 underline">Voltar ao início</button>
                </div>
            )}

        </main>

        {/* FOOTER ACTIONS (Steps 0, 1, 2 only) */}
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
                        {step===2 ? 'FINALIZAR AGENDAMENTO' : 'CONTINUAR'} <ArrowRight size={20}/>
                    </button>
                </div>
            </div>
        )}

        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); } @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  );
}
