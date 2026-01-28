import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, MapPin, Calendar, Smartphone,
  Crown, Gem, Infinity, Percent, Shield
} from 'lucide-react';

// ==================================================================================
// 1. DADOS, CONFIGURAÇÕES E ESTRATÉGIA DE PRODUTO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_ecosystem_v5', 
};

const TIME_SLOTS = [
  '09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'
];

const getData = (lang) => {
    const isPT = lang === 'pt';
    
    return {
        // GAMIFICATION & FIDELIDADE
        levels: [
            { level: 1, xpNeeded: 0, reward: 12, title: isPT ? "Iniciante" : "Beginner", color: "text-blue-400", gradient: "from-blue-400 to-blue-600" },
            { level: 2, xpNeeded: 500, reward: 25, title: isPT ? "Bronze VIP" : "Bronze VIP", color: "text-orange-400", gradient: "from-orange-400 to-red-500" },
            { level: 3, xpNeeded: 1200, reward: 40, title: isPT ? "Prata Elite" : "Silver Elite", color: "text-slate-300", gradient: "from-slate-300 to-slate-500" },
            { level: 4, xpNeeded: 2500, reward: 60, title: isPT ? "Ouro Master" : "Gold Master", color: "text-yellow-400", gradient: "from-yellow-300 to-amber-500" }
        ],

        // 1. PLANOS E PACOTES (NOVA VERTICAL DE RECEITA)
        plans: [
            {
                id: 'pack_starter',
                type: 'pack', // Pacote de sessões
                sessions: 4,
                title: isPT ? "Pack Start (4 Sessões)" : "Starter Pack (4x)",
                price: 360, // 90 * 4 = 360 (Preço cheio seria maior, aqui já é com desconto implícito)
                fullPrice: 500, // Preço âncora
                savings: 140,
                tag: isPT ? "ENTRADA" : "ENTRY",
                icon: Check,
                color: "blue",
                desc: isPT ? "O ideal para começar. Garanta sua agenda." : "Best to start.",
                features: isPT ? ["4 Sessões Relaxantes", "Validade de 45 dias", "Prioridade na agenda"] : ["4 Relax Sessions", "45 days valid", "Priority booking"]
            },
            {
                id: 'club_vip',
                type: 'subscription', // Assinatura/Recorrência
                sessions: '∞',
                title: isPT ? "Clube VIP Mensal" : "VIP Club Monthly",
                price: 250, 
                fullPrice: 480,
                savings: 230,
                recommended: true,
                tag: isPT ? "MAIS VENDIDO" : "BEST SELLER",
                icon: Crown,
                color: "amber",
                desc: isPT ? "Acesso total. O favorito dos executivos." : "Full access. Client favorite.",
                features: isPT ? ["2 Sessões Mistas/Mês", "Desconto de 50% em extras", "Grupo VIP no WhatsApp", "Brindes Exclusivos"] : ["2 Full Sessions/mo", "50% OFF extras", "VIP Group", "Gifts"]
            },
            {
                id: 'experience_black',
                type: 'experience', // High Ticket
                sessions: 1,
                title: isPT ? "Day Spa Black" : "Day Spa Black",
                price: 450,
                fullPrice: 600,
                savings: 150,
                tag: isPT ? "EXPERIÊNCIA" : "EXPERIENCE",
                icon: Gem,
                color: "purple",
                desc: isPT ? "3 Horas de imersão total." : "3 Hours full immersion.",
                features: isPT ? ["3 Horas de Duração", "Todas as técnicas inclusas", "Champanhe/Vinho", "Local Premium Incluso"] : ["3 Hours", "All techniques", "Drinks included", "Premium Location"]
            }
        ],

        // 2. SERVIÇOS AVULSOS (MANTIDOS E OTIMIZADOS)
        services: [
            { 
              id: 'relaxante', 
              min: 60, 
              price: 125, // Ajuste de preço para valorizar o plano
              icon: Wind, 
              title: isPT ? "Relaxante (Rolos)" : "Wood Relax",
              desc: isPT ? "Alívio de tensão e dores." : "Pain relief.",
              details: isPT ? "Foco total em tirar dores das costas e pernas com rolos de madeira e mãos firmes." : "Focus on pain relief."
            },
            { 
              id: 'sensitiva', 
              min: 60, 
              price: 180, 
              icon: Flame, 
              title: isPT ? "Sensitiva (+ Lingam)" : "Tantric Sensitive",
              desc: isPT ? "Toques sutis e finalização." : "Sensitive + Happy Ending.",
              details: isPT ? "Mix de relaxante muscular com toques sensitivos (pena, ponta dos dedos) e massagem tântrica." : "Mix of relax and tantra."
            },
            { 
              id: 'mista', 
              min: 60, 
              price: 220, 
              icon: Zap, 
              title: isPT ? "Experiência Completa" : "Full Experience",
              desc: isPT ? "O combo total (Relax + Body + Final)." : "The perfect balance.",
              details: isPT ? "A mais pedida. Começa forte na muscular, entra no corpo a corpo (Nuru) e finaliza tântrico." : "The best seller. Strong massage + Nuru + Tantra."
            }
        ],

        extras: [
            { 
              id: 'more_time', 
              price: 60, 
              icon: Clock, 
              label: isPT ? "+30 Minutos" : "+30 Minutes",
              desc: isPT ? "Pra curtir sem pressa." : "More time."
            },
            { 
              id: 'touch', 
              price: 60, 
              icon: Heart,
              label: isPT ? "Troca (Inversão)" : "You Touch",
              desc: isPT ? "Você assume o comando." : "You can touch."
            },
            { 
              id: 'shower', 
              price: 30, 
              icon:  Wind, // Usando Wind como substituto visual para banho se não tiver Shower
              label: isPT ? "Banho Tomado (Ducha)" : "Shower",
              desc: isPT ? "Banho premium antes/depois." : "Premium shower."
            }
        ],

        reviews: [
            { n: "Eduardo (Club VIP)", t: "Assinei o VIP e não largo mais. Vale cada centavo pela prioridade.", s: 5 },
            { n: "Tiago", t: "A sensitiva foi uma experiência de outro mundo.", s: 5 },
            { n: "Pedro H.", t: "Fui estressado e saí flutuando.", s: 5 },
            { n: "Ricardo (Pack Start)", t: "Comprei o pacote de 4, sai muito mais em conta. Recomendo.", s: 5 },
            { n: "Anônimo", t: "Conheço ele de vista da cidade, profissional impecável.", s: 5 },
            { n: "M. (Jales)", t: "Marquei num motel na saída pra Santa Fé. Foi intenso.", s: 5 },
            { n: "Gustavo", t: "Sem frescura. É massagem de verdade, direto ao ponto.", s: 5 },
            { n: "Lucas (VIP)", t: "O grupo VIP tem uns conteúdos diferenciados. Curti.", s: 5 }
        ],

        text: {
            loading: isPT ? "CARREGANDO EXPERIÊNCIA..." : "LOADING EXPERIENCE...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "O que deseja fazer hoje?" : "What creates your desire?",
            tab_services: isPT ? "Sessão Avulsa" : "Single Session",
            tab_plans: isPT ? "Planos & Packs" : "Plans & Packs",
            
            // Textos de Venda
            save_badge: isPT ? "ECONOMIZE" : "SAVE",
            best_value: isPT ? "MELHOR ESCOLHA" : "BEST VALUE",
            
            reviews_count: isPT ? "Ver clientes reais" : "Reviews",
            reviews_title: isPT ? "O que falam no sigilo" : "Reviews",
            
            select_time_title: isPT ? "Agendar Sessão" : "Schedule",
            select_time_plan_title: isPT ? "Agendar 1ª Sessão" : "Schedule 1st Session",
            date_sub: isPT ? "Horários disponíveis:" : "Available slots:",
            
            location_title: isPT ? "Onde será?" : "Location",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            
            pay_title: isPT ? "Forma de Pagamento" : "Payment",
            total_label: "Total",
            
            book_btn: isPT ? "Confirmar no WhatsApp" : "Confirm on WhatsApp",
            next_btn: isPT ? "Continuar" : "Continue",
            
            success_title: isPT ? "Tudo Certo!" : "Done!",
            success_sub: isPT ? "Seu pedido foi gerado. Envie a mensagem para confirmar." : "Send msg on WhatsApp.",
            whatsapp_btn: isPT ? "Enviar Confirmação" : "Send Now",
            
            currency: isPT ? "R$" : "$",
            
            security_note: isPT ? "App seguro e discreto. Dados locais." : "Secure app. Local data.",
            
            zap: {
              intro: isPT ? "E aí Thalyson!" : "Hi Thalyson!",
              intent_plan: isPT ? "🏆 *QUERO O PLANO:*" : "🏆 *I WANT PLAN:*",
              intent_service: isPT ? "🔥 *QUERO SESSÃO:*" : "🔥 *I WANT SESSION:*",
            }
        }
    };
};

// ==================================================================================
// 2. COMPONENTES VISUAIS (DESIGN SYSTEM)
// ==================================================================================

const LoadingScreen = ({ isDark, text }) => (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center animate-pulse shadow-[0_0_40px_rgba(37,99,235,0.5)]">
                <span className="text-3xl font-black text-white tracking-tighter">TM</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 animate-bounce border-4 border-zinc-950">
                <Check size={20} className="text-white" strokeWidth={3}/>
            </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight animate-pulse bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Thalyson Massagens</h1>
        <div className="mt-4 flex items-center gap-2 text-xs opacity-50 font-mono tracking-widest uppercase">
            <Loader2 size={12} className="animate-spin"/>
            {text}
        </div>
    </div>
);

const Badge = ({ text, color = "blue" }) => {
    const colors = {
        blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    };
    return (
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${colors[color] || colors.blue}`}>
            {text}
        </span>
    );
};

const PlanCard = ({ plan, isDark, selected, onClick, T }) => {
    // Cores dinâmicas baseadas no tipo do plano
    const styles = {
        blue: { bg: 'from-blue-600 to-blue-800', border: 'border-blue-500', shadow: 'shadow-blue-500/20' },
        amber: { bg: 'from-amber-500 to-yellow-600', border: 'border-amber-400', shadow: 'shadow-amber-500/30' },
        purple: { bg: 'from-purple-600 to-pink-600', border: 'border-purple-500', shadow: 'shadow-purple-500/20' },
    }[plan.color] || { bg: 'from-zinc-700 to-zinc-800', border: 'border-zinc-600', shadow: 'shadow-zinc-500/10' };

    return (
        <div onClick={onClick} className={`relative overflow-hidden rounded-3xl transition-all duration-300 cursor-pointer group
            ${selected ? 'ring-4 ring-offset-4 ring-offset-zinc-950 ring-blue-500 scale-[1.02]' : 'hover:scale-[1.01]'}
            ${isDark ? 'bg-zinc-900' : 'bg-white'} border ${selected ? 'border-transparent' : (isDark ? 'border-zinc-800' : 'border-slate-200')}
        `}>
            {/* Header com Gradiente */}
            <div className={`p-5 bg-gradient-to-br ${styles.bg} text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
                    <plan.icon size={80} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                         <span className="inline-block px-2 py-1 rounded bg-black/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                            {plan.tag}
                         </span>
                         {plan.recommended && (
                             <div className="flex items-center gap-1 bg-white text-black px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse">
                                 <Star size={10} fill="black" /> {T.best_value}
                             </div>
                         )}
                    </div>
                    <h3 className="text-xl font-black italic tracking-wide mb-1">{plan.title}</h3>
                    <p className="text-xs opacity-90 font-medium max-w-[80%]">{plan.desc}</p>
                </div>
            </div>

            {/* Conteúdo do Preço e Features */}
            <div className="p-5">
                <div className="flex items-end gap-2 mb-4">
                    <span className="text-3xl font-black">{T.currency} {plan.price}</span>
                    <span className="text-sm opacity-50 line-through mb-1.5">{T.currency} {plan.fullPrice}</span>
                    <span className={`ml-auto text-xs font-bold px-2 py-1 rounded-lg ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        {T.save_badge} {T.currency}{plan.savings}
                    </span>
                </div>

                <ul className="space-y-2 mb-4">
                    {plan.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs opacity-80">
                            <Check size={14} className={isDark ? 'text-blue-400' : 'text-blue-600'} /> {feat}
                        </li>
                    ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2
                    ${selected 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : (isDark ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}
                `}>
                    {selected ? <Check size={18}/> : (plan.type === 'subscription' ? <Infinity size={18}/> : <Ticket size={18}/>)}
                    {selected ? 'SELECIONADO' : (plan.type === 'subscription' ? 'ASSINAR AGORA' : 'QUERO ESSE')}
                </button>
            </div>
        </div>
    );
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [tab, setTab] = useState('services'); // 'services' ou 'plans'
  
  const [viewers, setViewers] = useState(0);
  const [showScarcity, setShowScarcity] = useState(false);
  const scarcityTimeout = useRef(null);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  
  const scrollRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false 
  });

  const [booking, setBooking] = useState({
    type: 'service', // 'service' ou 'plan'
    item: null, // Objeto do serviço ou plano
    extras: {}, 
    date: null, 
    time: null, 
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null,
    termsAccepted: false
  });

  // --- EFEITOS E INICIALIZAÇÃO ---

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2000); // Carregamento mais rápido

    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            setUser(JSON.parse(s));
        } else {
            setUser(p => ({...p, coupons: [{ id: 'welcome', val: 15, title: '🎁 Welcome Gift' }]}));
        }
    } catch (e) {}
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2000);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  useEffect(() => { 
      if(isClient && !loading) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); 
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  // --- LÓGICA DE NEGÓCIO ---

  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 5) + 3; 
      setViewers(randomViewers);
      setShowScarcity(true);
      if(scarcityTimeout.current) clearTimeout(scarcityTimeout.current);
      scarcityTimeout.current = setTimeout(() => setShowScarcity(false), 4000);
  };

  const selectItem = (item, type) => {
      setBooking(prev => ({
          ...prev,
          type: type,
          item: item,
          extras: {}, // Reseta extras ao trocar serviço
          payment: '',
          termsAccepted: false
      }));
  };

  const availableTimes = useMemo(() => {
      if (!booking.date) return [];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      const isToday = selectedDate.getDate() === now.getDate() && 
                      selectedDate.getMonth() === now.getMonth();

      if (isToday) {
          const currentHour = now.getHours();
          return TIME_SLOTS.filter(time => {
              const [hour] = time.split(':').map(Number);
              return hour > currentHour + 1; 
          });
      }
      return TIME_SLOTS;
  }, [booking.date]);

  const getFinancials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    
    let sub = booking.item.price;
    
    // Extras só contam se for serviço avulso ou se o plano permitir (simplificado aqui para permitir)
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) sub += DATA.extras.find(e=>e.id===k).price; 
    });
    
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  const canProceed = useCallback(() => {
    if (step === 0) return !!booking.item;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      if (!user.name || user.name.trim().length < 2) return false;
      if (booking.locationType === 'home') return booking.address.street && booking.address.number;
      if (booking.locationType === 'hotel') return booking.address.placeName;
      return true; 
    }
    return !!booking.payment && booking.termsAccepted;
  }, [step, booking, user.name]);

  const finishBooking = () => {
    // Lógica de Level Up
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }
    
    // XP calculation: Planos dão mais XP (bônus de 1.5x)
    const multiplier = booking.type === 'plan' ? 1.5 : 1;
    const earnedXP = Math.floor(getFinancials.total * multiplier * 0.1); // 10% do valor em XP
    const oldXP = user.xp;
    const newXP = oldXP + earnedXP;

    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && oldXP < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `lvl${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 Nível ${lvl.title}` });
        }
    });

    if (leveledUp) setLevelUpPopup(true);
    setUser({ ...user, xp: newXP, coupons: updatedCoupons });
    setStep(4);
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    let locTxt = "";
    let mapQuery = "";
    
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `🏠 *${T.zap.house}:* ${fullAddr}\n📝 *Obs:* ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 *${T.zap.motel}:* Definir no chat.`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `🏨 *${T.zap.hotel}:* ${fullAddr}\n🚪 *Quarto:* ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return `✅ + ${ext.label}`;
    }).join('\n');

    // MENSAGEM DINÂMICA (PLANO VS SERVIÇO)
    const header = booking.type === 'plan' ? T.zap.intent_plan : T.zap.intent_service;
    const itemName = booking.item.title;

    const msg = `
${T.zap.intro} *${user.name}*

${header}
🚀 *${itemName}*
${booking.type === 'plan' ? `📦 *Tipo:* ${booking.item.type.toUpperCase()}` : ''}
📅 1ª Sessão: ${dateStr} às ${booking.time}

${extrasList ? `📝 *ADICIONAIS:*\n${extrasList}\n` : ''}
📍 *LOCAL:*
${locTxt}

💰 *RESUMO:*
Valor Tabela: ${T.currency} ${f.sub}
Desconto: - ${T.currency} ${f.disc}
${T.uber_note}

💎 *TOTAL A PAGAR: ${T.currency} ${f.total}*
Forma: *${booking.payment.toUpperCase()}*

🔐 *Termos:* Li e Aceito.
`.trim();

    const zapUrl = `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
    window.open(zapUrl, '_blank');
  };

  // --- RENDER ---

  if (loading) return <LoadingScreen isDark={isDark} text={T.loading} />;
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SCARCITY POPUP */}
      <div className={`fixed top-24 right-4 z-[90] pointer-events-none transition-all duration-500 ${showScarcity ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
           <div className="bg-red-500 text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 text-xs font-bold border border-white/20">
               <Eye size={14} className="animate-pulse" />
               <span>{viewers} pessoas vendo isso</span>
           </div>
      </div>

      {/* HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950/80 border-b border-zinc-800 backdrop-blur-md' : 'bg-white/80 border-b border-slate-200 backdrop-blur-md'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-blue-500/30">TM</div>
          <div>
            <span className="font-bold text-sm tracking-tight block leading-none">Thalyson</span>
            <span className="text-[10px] opacity-50 uppercase tracking-widest font-bold">Massagens</span>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full transition-colors ${isDark ? 'hover:bg-zinc-800 text-amber-400' : 'hover:bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2 rounded-full transition-colors ${isDark ? 'bg-zinc-900 text-pink-500' : 'bg-pink-50 text-pink-600'}`}><Instagram size={18}/></a>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-36 scroll-smooth relative">
        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* === STEP 0: SELECTION (SERVICES & PLANS) === */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8 text-center relative">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-3 border border-blue-500/20">
                    <Sparkles size={10} /> {user.name ? `Welcome Back` : `Bem-vindo`}
                </div>
                <h1 className="text-3xl font-black mb-2 tracking-tight">{T.welcome} <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h1>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                {/* XP Bar Mini */}
                <div onClick={() => setReviewsOpen(true)} className="absolute top-0 right-0 cursor-pointer">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-lg">
                        <Trophy size={10} /> {user.xp} XP
                    </div>
                </div>
              </div>

              {/* TABS SWITCHER */}
              <div className={`grid grid-cols-2 p-1.5 rounded-2xl mb-8 relative ${isDark ? 'bg-zinc-900' : 'bg-slate-200'}`}>
                  <button onClick={() => setTab('services')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${tab === 'services' ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}>
                      {T.tab_services}
                  </button>
                  <button onClick={() => setTab('plans')} className={`relative z-10 py-3 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${tab === 'plans' ? (isDark ? 'bg-zinc-800 text-white shadow-lg' : 'bg-white text-black shadow-lg') : 'opacity-50 hover:opacity-100'}`}>
                      {T.tab_plans}
                      {/* Badge "NEW" */}
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[8px] px-1.5 py-0.5 rounded-full animate-bounce">NOVO</span>
                  </button>
              </div>

              {/* LISTA: SERVIÇOS */}
              {tab === 'services' && (
                  <div className="space-y-4 animate-slide-in">
                    {DATA.services.map(s => (
                      <div key={s.id} onClick={() => selectItem(s, 'service')} 
                        className={`group relative p-5 rounded-3xl border-2 cursor-pointer transition-all duration-300 active:scale-[0.98] 
                        ${booking.item?.id === s.id 
                            ? 'border-blue-500 bg-blue-500/5' 
                            : (isDark ? 'border-zinc-800 bg-zinc-900 hover:border-zinc-700' : 'border-slate-200 bg-white hover:border-slate-300')}`}
                      >
                          <div className="flex justify-between items-start mb-4">
                            <div className={`p-3.5 rounded-2xl transition-colors ${booking.item?.id === s.id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : (isDark ? 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200')}`}><s.icon size={26}/></div>
                            <div className="text-right">
                               <span className="block text-2xl font-black tracking-tight">{T.currency} {s.price}</span>
                               <span className="text-[10px] uppercase font-bold opacity-50 flex items-center justify-end gap-1"><Clock size={10}/> {s.min} min</span>
                            </div>
                          </div>
                          <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                          
                          {/* Details expand */}
                          <div className={`grid transition-all duration-300 ease-in-out ${booking.item?.id === s.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                              <div className="overflow-hidden">
                                  <div className={`p-4 rounded-xl text-xs leading-relaxed ${isDark ? 'bg-zinc-950/50 text-zinc-300' : 'bg-slate-50 text-slate-700'}`}>
                                     <div className="flex items-center gap-2 font-bold mb-2 text-blue-500"><Info size={12}/> {T.details_label}</div>
                                     {s.details}
                                  </div>
                              </div>
                          </div>
                      </div>
                    ))}
                  </div>
              )}

              {/* LISTA: PLANOS (NOVA UI) */}
              {tab === 'plans' && (
                  <div className="space-y-6 animate-slide-in">
                      <div className={`p-4 rounded-2xl text-center text-sm ${isDark ? 'bg-blue-900/20 text-blue-200' : 'bg-blue-50 text-blue-800'}`}>
                          💡 <strong>Dica:</strong> Assinantes têm prioridade na agenda.
                      </div>
                      {DATA.plans.map(plan => (
                          <PlanCard 
                              key={plan.id} 
                              plan={plan} 
                              isDark={isDark} 
                              T={T}
                              selected={booking.item?.id === plan.id}
                              onClick={() => selectItem(plan, 'plan')}
                          />
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* === STEP 1: DATE & TIME === */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-6">
                 <h2 className="text-xl font-bold">{booking.type === 'plan' ? T.select_time_plan_title : T.select_time_title}</h2>
                 <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide -mx-6 px-6 mb-2">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); 
                  d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  
                  let lbl = d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US', {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; 
                  if(i===1) lbl=T.tomorrow;

                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                      className={`min-w-[70px] h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border transition-all flex-shrink-0 active:scale-95 
                      ${isSel 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105' 
                          : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')}`}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider">{lbl}</span>
                      <span className="text-2xl font-black">{d.getDate()}</span>
                      {i === 0 && <span className="w-1 h-1 rounded-full bg-emerald-500"></span>}
                    </button>
                  )
                })}
              </div>
              
              {!booking.date && (
                   <div className="flex flex-col items-center justify-center py-12 opacity-30 gap-4">
                       <Calendar size={40} />
                       <p className="text-sm font-bold">{T.empty_date}</p>
                   </div>
              )}

              <div className={`grid grid-cols-4 gap-3 ${!booking.date ? 'opacity-30 pointer-events-none' : ''}`}>
                 {availableTimes.map(t => (
                      <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }}
                          className={`w-full py-3.5 rounded-xl text-xs font-bold border transition-all active:scale-95 duration-200
                          ${booking.time === t 
                              ? 'bg-white text-black border-white shadow-lg transform scale-105' 
                              : (isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}
                      >
                          {t}
                      </button>
                 ))}
              </div>
            </div>
          )}

          {/* === STEP 2: LOCATION === */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-xl font-bold text-center mb-8">{T.location_title}</h2>
              
              {/* Selector */}
              <div className={`grid grid-cols-3 gap-2 p-1 rounded-2xl mb-8 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} 
                        className={`py-4 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all 
                        ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow-md' : 'bg-white text-black shadow-md') : 'opacity-50 hover:opacity-100'}`}>
                        <x.i size={20}/> {x.l}
                    </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <div>
                    <label className={`text-[10px] font-bold ml-4 mb-2 block uppercase tracking-wider opacity-50`}>{T.input_name}</label>
                    <div className="relative">
                        <input value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} 
                            className={`w-full pl-12 pr-4 py-4 rounded-2xl border outline-none text-base transition-colors focus:border-blue-500 
                            ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30"><Smartphone size={20}/></span>
                    </div>
                 </div>

                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_90px] gap-3">
                           <input value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} placeholder={T.input_addr} className={`p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                           <input type="tel" value={booking.address.number} onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder="Nº" className={`p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        </div>
                        <input value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder="Bairro" className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder="Cidade" className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                     </div>
                 )}
                 
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <input value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} placeholder={T.input_hotel} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder="Cidade" className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                    </div>
                 )}

                 {booking.locationType === 'motel' && (
                    <div className={`p-6 rounded-3xl border text-center text-sm ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <BedDouble className="mx-auto mb-3 opacity-30" size={32}/>
                        {T.motel_note}
                    </div>
                 )}
              </div>

              {/* Extras só aparecem se for SERVIÇO, planos já incluem tudo ou não aplicam */}
              {booking.type === 'service' && (
                  <div className="pt-8 border-t border-dashed border-gray-500/10 mt-8">
                     <h3 className={`text-[10px] font-bold uppercase mb-4 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} 
                                className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] 
                                ${booking.extras[ex.id] ? 'bg-blue-500/10 border-blue-500/50' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                              <div className="flex items-center gap-4">
                                 <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
                                 <div>
                                     <p className="text-sm font-bold">{ex.label}</p>
                                     <p className="text-[10px] opacity-60">{ex.desc}</p>
                                 </div>
                              </div>
                              <span className={`text-xs font-bold ${booking.extras[ex.id] ? 'text-blue-500' : 'opacity-50'}`}>+ {T.currency} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* === STEP 3: CHECKOUT === */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className={`p-6 rounded-[2rem] border shadow-2xl relative overflow-hidden ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  {/* Decorative Header */}
                  <div className={`absolute top-0 left-0 w-full h-2 ${booking.type === 'plan' ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-blue-500'}`}></div>

                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded mb-2 inline-block ${booking.type === 'plan' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                              {booking.type === 'plan' ? 'PLANO VIP' : 'SESSÃO'}
                          </span>
                          <h2 className="font-black text-2xl max-w-[200px] leading-tight">{booking.item.title}</h2>
                      </div>
                      <div className="text-right">
                          <span className="block text-2xl font-black">{T.currency} {booking.item.price}</span>
                          {booking.type === 'plan' && <span className="text-xs text-emerald-500 font-bold">Economia de {T.currency}{booking.item.savings}</span>}
                      </div>
                  </div>

                  <div className="space-y-2 border-b border-dashed border-gray-500/20 pb-6 mb-6">
                      {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                          <div key={k} className="flex justify-between text-sm opacity-70">
                              <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                              <span>{T.currency} {DATA.extras.find(e=>e.id===k).price}</span>
                          </div>
                      ))}
                      {booking.type === 'plan' && (
                          <div className="text-xs opacity-50 italic mt-2">
                              * Inclui benefícios exclusivos e prioridade.
                          </div>
                      )}
                  </div>
                  
                  {/* COUPON AREA */}
                  <div className="mb-6">
                       {/* Se for plano, as vezes não permite cupom, mas vamos deixar liberado por enquanto */}
                       <div className="flex items-center gap-2 text-xs font-bold opacity-60 mb-3 uppercase tracking-wider"><Tag size={12}/> {T.coupon_title}</div>
                       {user.coupons.length > 0 ? (
                           <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                               {user.coupons.map(c => {
                                   const isApplied = booking.appliedCoupon?.id === c.id;
                                   return (
                                       <button key={c.id} onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                           className={`flex-shrink-0 px-4 py-3 rounded-xl border transition-all text-left min-w-[140px]
                                           ${isApplied ? 'border-emerald-500 bg-emerald-500/10' : (isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-200 bg-slate-50')}`}>
                                           <div className={`text-[10px] font-bold mb-1 ${isApplied ? 'text-emerald-500' : 'opacity-50'}`}>{c.title}</div>
                                           <div className="font-black text-lg">-{T.currency}{c.val}</div>
                                       </button>
                                   )
                               })}
                           </div>
                       ) : <div className="text-xs opacity-40">Nenhum cupom disponível.</div>}
                  </div>

                  <div className="flex justify-between items-end pt-2">
                      <div>
                          <p className="text-xs font-bold uppercase opacity-50 mb-1">{T.total_label}</p>
                          <p className="text-[10px] text-amber-500 font-medium bg-amber-500/10 px-2 py-0.5 rounded">{T.uber_note}</p>
                      </div>
                      <span className="text-4xl font-black tracking-tighter text-blue-500">{T.currency} {getFinancials.total}</span>
                  </div>
               </div>

               <div className="mt-8 grid grid-cols-2 gap-4">
                   {[{id:'pix', l:'PIX', i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                       <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} 
                           className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${p.id === 'money' ? 'col-span-2' : ''}
                           ${booking.payment === p.id 
                               ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                               : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                           <p.i size={20}/> <span className="font-bold text-sm uppercase">{p.l}</span>
                           {booking.payment === p.id && <Check size={16} className="ml-auto"/>}
                       </button>
                   ))}
               </div>
               
               <label className="flex items-start gap-3 p-4 rounded-2xl border border-dashed border-gray-500/30 mt-6 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                   <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="mt-1 w-4 h-4 accent-blue-600"/>
                   <span className="text-xs leading-relaxed">{T.agree_terms} <u onClick={(e)=>{e.preventDefault(); setTermsOpen(true)}} className="font-bold">Ler Regras</u>.</span>
               </label>
            </div>
          )}

          {/* === STEP 4: SUCCESS === */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-10 text-center animate-scale-in">
                 <div className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-8 animate-bounce">
                     <Check size={48} className="text-white" strokeWidth={4}/>
                 </div>
                 <h1 className="text-3xl font-black mb-2">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10 leading-relaxed">{T.success_sub}</p>
                 
                 <button onClick={openZap} className="w-full py-5 bg-[#25D366] hover:brightness-110 text-white font-bold rounded-2xl text-lg shadow-xl shadow-green-500/20 flex items-center justify-center gap-3 transition-transform active:scale-95">
                     <MessageCircle size={28} fill="white" strokeWidth={0}/> {T.whatsapp_btn}
                 </button>
                 
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'service', payment: '', appliedCoupon: null, termsAccepted: false});}} className="mt-8 text-xs font-bold uppercase opacity-40 tracking-widest hover:opacity-100 p-4">
                    {T.back_home}
                 </button>
             </div>
          )}

        </div>
      </main>

      {/* FOOTER ACTION BAR */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/20 to-transparent z-50 pointer-events-none">
            <div className="pointer-events-auto max-w-md mx-auto">
                <div className={`p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border transition-colors duration-500
                    ${isDark ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-zinc-200'}`}>
                    
                    {step > 0 && (
                        <button onClick={()=>setStep(step-1)} className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
                            <ChevronLeft size={20}/>
                        </button>
                    )}
                    
                    {step < 3 && booking.item && (
                        <div className="flex-1 pl-2 animate-fade-in">
                            <span className="block text-[9px] font-bold uppercase opacity-50 tracking-wider">Total Estimado</span>
                            <span className="block text-xl font-black tracking-tight">{T.currency} {getFinancials.total}</span>
                        </div>
                    )}
                    
                    <button 
                        disabled={!canProceed()} 
                        onClick={() => step === 3 ? finishBooking() : setStep(s => s + 1)}
                        className={`h-12 px-8 rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg 
                        ${step < 3 ? 'ml-auto' : 'w-full'} 
                        ${!canProceed() 
                            ? 'bg-zinc-500 opacity-50 cursor-not-allowed text-white' 
                            : 'bg-blue-600 text-white shadow-blue-600/30 hover:bg-blue-500 hover:scale-105 active:scale-95'}`}
                    >
                        {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md rounded-[2rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">{T.reviews_title}</h3>
                <button onClick={()=>setReviewsOpen(false)} className="p-2 bg-black/10 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-3">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                       <div className="flex justify-between mb-2"><span className="font-bold text-sm text-blue-500">{r.n}</span><div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div></div>
                       <p className="text-sm italic opacity-70">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>
      
      {/* LEVEL UP POPUP */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative w-full max-w-sm text-center animate-bounce-slow">
                 <div className="relative">
                     <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-600 blur-3xl opacity-30 rounded-full"></div>
                     <Trophy size={80} className="relative z-10 mx-auto text-amber-400 mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                 </div>
                 <h2 className="text-3xl font-black text-white mb-2">LEVEL UP!</h2>
                 <p className="text-zinc-300 mb-8">Você desbloqueou um novo nível e ganhou um cupom exclusivo.</p>
                 <button onClick={()=>setLevelUpPopup(false)} className="bg-amber-500 text-black font-black py-4 px-8 rounded-full w-full hover:scale-105 transition-transform">RESGATAR RECOMPENSA</button>
            </div>
        </div>
      )}

      {/* WELCOME POPUP */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40">
                    <Gift size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-black mb-2">Presente para você!</h2>
                <p className="opacity-70 text-sm leading-relaxed mb-6">Para começar com o pé direito, liberamos um cupom de boas-vindas.</p>
                <button onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}} className="w-full py-4 bg-white text-black font-black rounded-2xl text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl">
                    PEGAR MEU CUPOM
                </button>
            </div>
        </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .animate-fade-in { animation: fadeIn 0.6s ease-out; } 
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
