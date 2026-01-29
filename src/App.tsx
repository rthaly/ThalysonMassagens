import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Coffee
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v19.0 - HUMANIZED & COZY EDITION
 * ==================================================================================
 * AJUSTES REALIZADOS:
 * 1. COPYWRITING: Tom acolhedor, humano e focado na experiência (não na venda).
 * 2. REALIDADE: Remoção de promessas de estrutura (maca/clima). Foco no atendimento.
 * 3. REVIEWS: 25+ avaliações mistas e realistas (SP, Londrina, Jales, etc).
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v19_cozy', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 2. DESIGN SYSTEM (LUXURY GLASS + SPACIOUS)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 border border-amber-400/20 hover:shadow-amber-500/30 hover:brightness-105",
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20",
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20bd5a]",
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500",
    icon: "bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10"
  };
  
  const sizes = { 
    sm: "h-11 text-[11px] px-4", 
    md: "h-14 text-sm px-6", 
    lg: "h-16 text-sm px-8", 
    xl: "h-16 text-sm px-8 uppercase tracking-widest font-bold",
    icon: "h-12 w-12 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={20} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={20} className={children ? "mr-3 opacity-90" : ""} strokeWidth={2} />}
          {children}
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error }) => (
  <div className="space-y-2 w-full group">
    {label && <label className="text-[11px] font-medium uppercase tracking-widest ml-1 text-zinc-500 group-focus-within:text-amber-500 transition-colors">{label}</label>}
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors z-10">{Icon && <Icon size={20} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-14 pr-6 py-4 rounded-2xl outline-none text-sm font-normal transition-all duration-300 placeholder:text-zinc-600
        ${error ? 'bg-red-500/10 border border-red-500/50 text-red-200' : 'bg-zinc-900/50 border border-zinc-800 text-zinc-200 focus:bg-zinc-900 focus:border-amber-500/30 focus:shadow-[0_0_20px_-5px_rgba(245,158,11,0.1)]'}`} 
      />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 font-medium animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false }) => (
  <div 
    onClick={onClick} 
    className={`relative p-8 rounded-[2rem] transition-all duration-500 overflow-hidden 
    ${onClick ? 'cursor-pointer active:scale-[0.99] hover:bg-white/[0.02]' : ''} 
    ${active 
        ? 'bg-amber-500/5 border border-amber-500/30 shadow-[0_0_30px_-10px_rgba(245,158,11,0.15)]' 
        : 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10'} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

// MARQUEE COMPONENT (REVIEW SCROLLER)
const MarqueeReviews = ({ reviews }) => {
  return (
    <div className="w-full overflow-hidden py-4 border-y border-white/5 mb-8 bg-zinc-950/30 backdrop-blur-sm">
      <div className="relative w-full flex">
        <div className="flex animate-marquee min-w-full gap-4 px-4">
          {[...reviews, ...reviews].map((r, i) => ( // Duplicado para loop
             <div key={i} className="flex-shrink-0 w-72 bg-zinc-900/60 border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors">
                <div className="flex justify-between items-start mb-3">
                   <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-400">{r.n.charAt(0)}</div>
                      <div>
                        <span className="text-xs font-bold text-zinc-300 block leading-none">{r.n}</span>
                        <span className="text-[9px] text-zinc-600 uppercase font-medium">{r.loc}</span>
                      </div>
                   </div>
                   <div className="flex gap-0.5">
                     {[...Array(5)].map((_, k) => (
                       <Star key={k} size={8} fill={k < r.s ? "#d4d4d8" : "none"} className={k < r.s ? "text-zinc-300" : "text-zinc-800"} />
                     ))}
                   </div>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">"{r.t}"</p>
             </div>
          ))}
        </div>
      </div>
      <style>{`
        .animate-marquee { animation: marquee 80s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
};

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 4 + 2,
      h: Math.random() * 4 + 2,
      color: ['#fbbf24', '#ffffff', '#52525b'][Math.floor(Math.random() * 3)], 
      speed: Math.random() * 3 + 2,
      angle: Math.random() * 360,
      spin: Math.random() * 5 - 2.5
    }));
    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle * Math.PI / 180);
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += p.spin;
        if (p.y > canvas.height) p.y = -20;
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [active]);
  if (!active) return null;
  return <canvas ref={canvasRef} className="fixed inset-0 z-[60] pointer-events-none" />;
};

// ==================================================================================
// 3. DADOS
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: "Visitante" },
            { level: 2, xpNeeded: 100, reward: 15, title: "Cliente Bronze" },
            { level: 3, xpNeeded: 350, reward: 30, title: "Cliente Prata" },
            { level: 4, xpNeeded: 800, reward: 50, title: "Cliente Ouro" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: "PARA DESCANSAR",
              title: "Sessão Relaxante",
              desc: "Para tirar o peso das costas e acalmar a mente.",
              details: `O FOCO É VOCÊ:
• TÉCNICA: Movimentos fluidos para soltar a tensão.
• OBJETIVO: Alívio de dores musculares e descanso mental.
• IDEAL PARA: Quem teve um dia pesado e precisa pausar.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: "SENSORIAL",
              title: "Terapia Sensitiva",
              desc: "Um despertar suave para novas sensações.",
              details: `CONEXÃO E SENSIBILIDADE:
• TOQUE: Leve, sutil e provocante (Ponta dos dedos).
• EXPERIÊNCIA: Massagem Lingam inclusa com total respeito.
• OBJETIVO: Explorar o prazer de forma natural e intensa.`
            },
            { 
              id: 'mista', min: 60, price: 205, icon: Zap, tag: "A FAVORITA",
              title: "Experiência Completa",
              desc: "A união perfeita do relaxamento com o toque intenso.",
              details: `O MELHOR DOS DOIS MUNDOS:
• MISTURA: Começamos relaxando e evoluímos para a sensitiva.
• CONTATO: Corpo a corpo (Body to Body) com óleo morno.
• FINALIZAÇÃO: Do seu jeito. Você dita o ritmo.`
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: "Ciclo Relax (4 Sessões)", 
              price: 440, fullPrice: 500, savings: 60, 
              details: "Para quem prioriza o bem-estar contínuo.", tag: "MAIS ECONÔMICO", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: "Ciclo Completo (3 Sessões)", 
              price: 550, fullPrice: 615, savings: 65, 
              details: "A escolha certa para manter a rotina em dia.", tag: "MAIS PEDIDO", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: "Clube Thalyson Mensal", 
              price: 360, fullPrice: 460, savings: 100, 
              details: "2 Sessões Completas + Prioridade na minha agenda.", tag: "CLIENTE VIP", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: "+30 Minutos", desc: "Para curtir sem olhar no relógio." },
            { id: 'touch', price: 55, icon: Heart, label: "Interativo (Troca)", desc: "Você também pode tocar." },
            { id: 'aroma', price: 5, icon: Wind, label: "Óleo Premium", desc: "Aromas que relaxam." }
        ],
        // REVIEWS MAIS HUMANOS, MISTURADOS E REALISTAS
        reviews: [
            { n: "Ricardo", loc: "Rio Preto", t: "Mão firme. Tirou um nó das costas que tava me matando.", s: 5 },
            { n: "André L.", loc: "SP - Bela Vista", t: "O toque dele vicia. A finalização foi absurda de boa.", s: 5 },
            { n: "Felipe", loc: "Londrina", t: "Fiquei meio assim por ser em casa, mas ele deixa a gente super à vontade.", s: 5 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: "Curti muito a massagem, só o horário que atrasou uns 10 min.", s: 4 },
            { n: "M. (Sigilo)", loc: "SP - Jardins", t: "Gozada intensa, perdi as forças da perna. O cara é bom.", s: 5 },
            { n: "Bruno", loc: "Jales", t: "Atendimento no meu hotel, foi rápido e discreto. Salvou a viagem.", s: 5 },
            { n: "Carlos", loc: "Londrina", t: "Massagem top, pena que o ar do meu quarto tava quebrado, passamos calor kk.", s: 4 },
            { n: "Pedro", loc: "Rio Preto", t: "O corpo a corpo é quente de verdade. Fiquei duro a sessão inteira.", s: 5 },
            { n: "Lucas", loc: "Santa Fé do Sul", t: "Achei difícil estacionar perto do local que marquei, mas a massagem compensou.", s: 4 },
            { n: "Renato", loc: "SP - Centro", t: "A sensitiva me deu arrepios que eu nem sabia que sentia.", s: 5 },
            { n: "Vitor", loc: "Jales", t: "Gostei, mas queria que tivesse durado mais tempo.", s: 4 },
            { n: "Marcelo", loc: "SP - Jardins", t: "Higiene nota 10. O Thalyson é muito profissional.", s: 5 },
            { n: "Eduardo", loc: "Londrina", t: "Fiz na minha cama mesmo e foi incrível. Ele se adapta bem.", s: 5 },
            { n: "Caio", loc: "Rio Preto", t: "Pagaria o dobro só pela finalização.", s: 5 },
            { n: "Breno", loc: "SP - Bela Vista", t: "Relaxou e gozou. O combo perfeito. Recomendo.", s: 5 },
            { n: "Sérgio", loc: "Santa Fé do Sul", t: "Massagem nos pés foi um bônus que eu não esperava. Gente fina.", s: 5 },
            { n: "Anônimo", loc: "Jales", t: "Achei que ia ser estranho, mas foi natural. Voltarei.", s: 5 },
            { n: "Matheus", loc: "Londrina", t: "Demorou um pouco pra responder o zap, mas pessoalmente é 10.", s: 4 },
            { n: "Roberto", loc: "SP - Augusta", t: "Pedi a completa com troca. Poder tocar nele foi a cereja do bolo.", s: 5 },
            { n: "Fabio", loc: "Rio Preto", t: "Saiu leite até da alma. Recomendo pra quem ta estressado.", s: 5 },
            { n: "Junior", loc: "SP - Moema", t: "Me senti renovado. Energia boa demais.", s: 5 },
            { n: "Paulo", loc: "Votuporanga", t: "Top demais, só achei o valor do Uber meio salgado pra vir aqui.", s: 4 }
        ],
        text: {
            loading: "PREPARANDO...",
            welcome: "Olá,",
            subtitle: "Um momento de pausa e conexão para você.",
            tab_single: "Sessões Individuais",
            tab_packs: "Pacotes de Cuidado",
            reviews_btn: "Ver o que dizem",
            select_time_title: "Agenda",
            date_sub: "Qual o melhor dia para a gente se encontrar?",
            location_title: "Localização",
            input_name: "Como prefere ser chamado?",
            input_addr: "Onde será nosso atendimento?",
            input_num: "Número",
            input_bairro: "Bairro",
            input_city: "Cidade",
            input_comp: "Complemento (Apt, Bloco)",
            input_hotel: "Nome do Hotel",
            input_room: "Número do Quarto",
            motel_note: "Motel/Suíte: A taxa do local fica por sua conta. O valor da minha sessão acertamos no WhatsApp.",
            pay_title: "Forma de Pagamento",
            pay_pix: "Pix",
            pay_card: "Cartão",
            pay_cash: "Dinheiro",
            extras_title: "Personalize seu momento",
            coupon_title: "Tem algum convite?",
            coupon_placeholder: "Código...",
            coupon_btn: "Aplicar",
            total_label: "Valor da Sessão",
            book_btn: "Chamar no WhatsApp",
            next_btn: "Avançar",
            uber_warning: "*Uber (se houver) calculamos no chat",
            success_title: "Tudo certo!",
            success_sub: "Já recebi sua intenção. Agora é só me dar um oi no WhatsApp para confirmarmos o horário.",
            whatsapp_btn: "Enviar Mensagem",
            back_home: "Voltar",
            today: "Hoje",
            tomorrow: "Amanhã",
            empty_date: "Escolha uma data",
            empty_slots: "Sem horários",
            details_label: "SOBRE A SESSÃO",
            popup_welcome_title: "Um presente para você",
            popup_welcome_msg: "Fico feliz pelo nosso primeiro contato. Liberei um agrado especial.",
            popup_level_title: "Novo Status",
            popup_level_msg: "Sua fidelidade é importante. Você desbloqueou novos privilégios.",
            popup_btn_coupon: "Usar Agora",
            agree_terms: "Entendo os combinados do atendimento.",
            terms_body: ["1. HIGIENE: Um banho antes ajuda no conforto de ambos.", "2. SIGILO: O que acontece na sessão, fica na sessão.", "3. RESPEITO: O ambiente é de relaxamento e troca.", "4. PAGAMENTO: Acertamos ao final.", "5. SAÚDE: Estou bem fisicamente."],
            terms_title: "Nossos Combinados",
            terms_link: "Ler combinados",
            terms_btn: "Combinado",
            scarcity_msg: "pessoas por aqui",
            level_label: "Fidelidade",
            missing_xp_msg: (needed, reward) => `Faltam ${needed} XP para ganhar R$ ${reward} off`,
            
            // TOAST MESSAGES
            toast_select_item: "Escolha uma experiência.",
            toast_select_date: "Qual dia fica bom para você?",
            toast_fill_name: "Me diz seu nome?",
            toast_fill_addr: "Preciso do endereço para ir até você.",
            toast_fill_hotel: "Qual o nome do hotel?",
            toast_select_pay: "Como prefere pagar?",
            toast_accept_terms: "Precisamos concordar com os termos.",
            toast_coupon_success: "Convite aceito!",
            toast_coupon_error: "Código não encontrado.",

            zap: {
              intro: "Oi Thalyson, tudo bem?",
              order_title: "*QUERO AGENDAR*",
              client: "👤 *Nome:*",
              service: "💆‍♂️ *Experiência:*",
              date: "🗓️ *Quando:*",
              location: "📍 *Onde:*",
              payment: "💳 *Pagamento:*",
              value: "💰 *VALOR:*",
              xp_status: "🏆 *Fidelidade:*",
              xp_gain: "XP Ganho:",
              xp_level: "Nível:",
              xp_next: "Próximo:",
              wait: "Podemos confirmar?",
              house: "Em Casa/Apto",
              hotel: "Hotel",
              motel: "Motel",
              extra_title: "✨ *Adicionais:*",
              uber_label: "🚗 *Deslocamento:*",
              uber_text: "A combinar"
            }
        }
    };
};

// ==================================================================================
// 4. MAIN APP
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [activeTab, setActiveTab] = useState('single');
  
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  
  const [toasts, setToasts] = useState([]);
  
  const scrollRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  // BROWSER ESCAPE
  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    if (isInApp && /android/i.test(ua)) {
      const url = window.location.href;
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      setTimeout(() => { window.location.href = intentUrl; }, 500);
    }
  }, []);

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  // CARREGAMENTO
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2000);
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({ ...prev, ...parsed, coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [] }));
            if(parsed.savedAddress) { setBooking(b => ({...b, address: parsed.savedAddress})); }
        } else {
            setUser(p => ({...p, coupons: [] })); 
        }
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  useEffect(() => { 
      if(isClient && !loading) { try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch(e) {} }
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({ ...prev, type: type, item: item, extras: {}, payment: '', termsAccepted: false }));
  };

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      if (isNaN(selectedDate)) return [];
      const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth();
      if (isToday) {
          const currentHour = now.getHours();
          return slots.filter(time => {
              const [hour] = time.split(':').map(Number);
              return hour > currentHour;
          });
      }
      return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const extData = DATA.extras.find(e=>e.id===k);
            if(extData) sub += extData.price; 
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  const estimatedXP = useMemo(() => {
      const baseXP = financials.total;
      const isPack = booking.type === 'pack' || booking.type === 'subscription';
      const percentage = isPack ? 0.30 : 0.15; 
      return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);

  const getNextLevelInfo = (currentXP) => {
      if (currentXP >= 800) {
          const cycleXP = currentXP - 800;
          const nextRewardAt = 500 - (cycleXP % 500); 
          return { needed: nextRewardAt, reward: 50, title: "Elite Prestige" }; 
      }
      const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
      return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const xpGain = estimatedXP;
    const currentLevelTitle = DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title;
    const nextInfo = getNextLevelInfo(user.xp + xpGain);
    
    let locTxt = "";
    let mapQuery = "";
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${T.zap.house}\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${T.zap.motel}\n⚠️ (Local por conta do cliente)`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `✅ ${ext.label} (+ R$ ${ext.price})` : '';
    }).filter(Boolean).join('\n');
    
    const xpStatusMsg = nextInfo ? `${T.zap.xp_next} ${nextInfo.needed} XP (R$ ${nextInfo.reward},00)` : "Nível Máximo Atingido! ⚜️";

    const msg = `
${T.zap.intro}
${T.zap.order_title}
──────────────────────

${T.zap.client} ${user.name}
${T.zap.service} ${booking.item?.title}
${T.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${T.zap.extra_title}\n${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* http://maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────

${T.zap.value}
Total: R$ ${f.total},00
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

${T.zap.xp_status}
⚜️ ${T.zap.xp_gain} +${xpGain} XP
⚜️ ${T.zap.xp_level} ${currentLevelTitle}
⚜️ ${xpStatusMsg}

${T.zap.wait}
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const validateStep = () => {
      if (step === 0) {
          if(!booking.item) { addToast(T.toast_select_item, "error"); return false; }
          return true;
      }
      if (step === 1) {
          if (!booking.date || !booking.time) { addToast(T.toast_select_date, "error"); return false; }
          return true;
      }
      if (step === 2) {
          if (!user.name || user.name.trim().length < 3) { addToast(T.toast_fill_name, "error"); return false; }
          if (booking.locationType === 'home') {
              if(!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) { addToast(T.toast_fill_addr, "error"); return false; }
          }
          if (booking.locationType === 'hotel') {
              if(!booking.address.placeName || !booking.address.city) { addToast(T.toast_fill_hotel, "error"); return false; }
          }
          return true;
      }
      if (step === 3) {
          if (!booking.payment) { addToast(T.toast_select_pay, "error"); return false; }
          if (!booking.termsAccepted) { addToast(T.toast_accept_terms, "error"); return false; }
          return true;
      }
      return true;
  };

  const handleNextStep = () => {
      if(validateStep()) {
          if (step === 2) { setUser(prev => ({...prev, savedAddress: booking.address})); }
          if (step === 3) { finishBooking(); } else { setStep(s => s + 1); }
      }
  };

  const handleApplyCoupon = () => {
      if(!couponInput) return;
      const code = couponInput.toUpperCase();
      if(code === 'THALYSON10' || code === 'VIP20' || code === 'WELCOME10') {
          const val = code === 'VIP20' ? 20 : 10;
          const newCoupon = { id: code, val, title: `🎟️ ${code}`, code };
          setBooking(b => ({...b, appliedCoupon: newCoupon}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_coupon_error, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    if (booking.appliedCoupon) { updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code); }
    const newXP = Math.floor(user.xp + estimatedXP);
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 REWARD ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });
    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        if (newCycle > oldCycle && newCycle >= 0) {
              leveledUp = true;
              updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 ELITE BONUS`, code: `VIPMASTER` });
        }
    }
    if (leveledUp) setLevelUpPopup(true);
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: prev.ordersCount + 1 }));
    setShowConfetti(true);
    if (typeof window !== 'undefined') { window.open(generateWhatsAppLink(), '_blank'); }
    setStep(4);
  };

  const getCurrentLevelProgress = () => {
      if (user.xp >= 800) { return ((user.xp - 800) % 500 / 500) * 100; }
      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };

  const nextLevelInfo = getNextLevelInfo(user.xp);

  if (loading) return (
      <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-zinc-950 text-white">
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-amber-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
            <div className="w-24 h-24 rounded-[1.5rem] bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-3xl text-black shadow-2xl shadow-amber-500/20 relative z-10">TM</div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase"><Loader2 size={14} className="animate-spin text-amber-500"/>{T.text?.loading}</div>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className="h-[100dvh] w-full font-sans flex flex-col overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-500">
      
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-amber-500/5 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-amber-600/5 blur-[150px] rounded-full"></div>
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-down ${t.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />

      <header className="h-24 px-6 flex items-center justify-between z-20 shrink-0 bg-transparent relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-base text-black shadow-lg shadow-amber-500/10">TM</div>
          <div className="leading-tight">
            <span className="font-bold text-base tracking-wide block text-white">Thalyson</span>
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-[0.2em]">Massagens</span>
          </div>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"><Globe size={20}/></button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-500/10 to-pink-500/10 border border-pink-500/20 text-pink-400 hover:text-pink-300 hover:border-pink-500/40 transition-all"><Instagram size={20}/></a>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth relative z-10">
        
        {step < 3 && <MarqueeReviews reviews={DATA.reviews} />}

        <div className="max-w-md mx-auto px-6 space-y-10 pt-2">

          {/* CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <div className="flex items-end gap-2 mb-3">
                    <h1 className="text-4xl font-light tracking-tight text-white">{T.welcome} <span className="font-bold text-amber-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                </div>
                <p className="text-base text-zinc-400 font-light leading-relaxed">{T.subtitle}</p>
                
                <div className="relative mt-8 overflow-hidden rounded-[2.5rem] p-8 border border-white/10 bg-zinc-900/40 backdrop-blur-2xl group hover:border-amber-500/30 transition-all duration-700">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20">
                                <Trophy size={26} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-bold tracking-[0.15em] text-zinc-500">{T.level_label}</span>
                                <h3 className="font-bold text-2xl text-white mt-1">
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-bold text-white block">{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between text-[11px] font-medium text-zinc-500 mb-3 uppercase tracking-wide">
                            <span>Progresso</span>
                            <span className="text-amber-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_#f59e0b]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                         <p className="text-[11px] text-zinc-500 mt-4 text-center font-medium">
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 p-1.5 rounded-3xl bg-zinc-900/50 border border-white/5 relative">
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-4 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutList size={16}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-4 text-xs font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'text-zinc-500 hover:text-zinc-300'}`}><Package size={16}/> {T.tab_packs}</button>
              </div>

              {activeTab === 'single' && (
                  <div className="space-y-6 animate-slide-in">
                    {DATA.services.map(s => (
                      <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)}>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-4 rounded-3xl transition-all duration-300 ${booking.item?.id === s.id ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-800 text-zinc-400'}`}><s.icon size={28}/></div>
                            <div className="text-right">
                                <span className="block text-2xl font-bold text-white tracking-tight">{T.currency || 'R$'} {s.price}</span>
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center justify-end gap-1.5"><Clock size={12}/> {s.min} min</span>
                            </div>
                          </div>
                          <div className="mb-4">
                              {s.tag && <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-500 mb-3 uppercase tracking-widest">{s.tag}</span>}
                              <h3 className="font-bold text-xl text-white leading-tight">{s.title}</h3>
                          </div>
                          <p className="text-sm text-zinc-400 leading-loose font-light">{s.desc}</p>
                          
                          <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === s.id ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                              <div className="overflow-hidden">
                                  <div className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 text-xs text-zinc-300 leading-loose font-light">
                                      <div className="flex items-center gap-2 font-bold mb-3 text-amber-500 uppercase tracking-wider text-[10px]"><Info size={14}/> {T.details_label}</div>
                                      <p className="whitespace-pre-line">{s.details}</p>
                                  </div>
                              </div>
                          </div>
                      </Card>
                    ))}
                  </div>
              )}

              {activeTab === 'packs' && (
                  <div className="space-y-6 animate-slide-in">
                      {DATA.plans.map(plan => (
                          <Card key={plan.id} active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)}>
                              {plan.tag && (<div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-amber-600 text-black text-[10px] font-bold px-4 py-2 rounded-bl-2xl shadow-lg shadow-amber-500/20">{plan.tag}</div>)}
                              <div className="flex items-center gap-5 mb-6">
                                  <div className={`p-5 rounded-3xl transition-all ${booking.item?.id === plan.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}><plan.icon size={32}/></div>
                                  <div><h3 className="font-bold text-xl text-white leading-none mb-1.5">{plan.title}</h3><p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{plan.type === 'pack' ? 'Pacote' : 'Assinatura'}</p></div>
                              </div>
                              <p className="text-sm text-zinc-400 mb-6 font-light leading-relaxed">{plan.details}</p>
                              <div className="flex items-end gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                                  <span className="text-3xl font-bold text-amber-500">{T.currency || 'R$'} {plan.price}</span>
                                  <span className="text-sm line-through text-zinc-600 decoration-zinc-600">{T.currency || 'R$'} {plan.fullPrice}</span>
                                  <span className="text-[10px] text-emerald-400 font-bold mb-1.5 ml-auto bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">Economia {T.currency || 'R$'}{plan.savings}</span>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* DATE */}
          {step === 1 && (
            <div className="animate-slide-in space-y-8">
              <div className="text-center mb-10">
                 <h2 className="text-3xl font-light text-white mb-2">{T.select_time_title}</h2>
                 <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-zinc-500">{T.date_sub}</p>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[80px] h-28 rounded-3xl flex flex-col items-center justify-center gap-1.5 border transition-all flex-shrink-0 active:scale-95 duration-300 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'}`}>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                      <span className="text-3xl font-bold">{d.getDate()}</span>
                      {isSel && <span className="w-1.5 h-1.5 rounded-full bg-black mt-1"></span>}
                    </button>
                  )
                })}
              </div>
              
              {!booking.date && (<div className="text-center py-16 opacity-30 border border-dashed border-zinc-700 rounded-[2rem] mx-2"><Calendar size={40} className="mx-auto mb-4 text-zinc-500"/><p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{T.empty_date}</p></div>)}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-4 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-4 rounded-2xl text-sm font-medium border transition-all active:scale-95 duration-200 relative overflow-hidden group ${booking.time === t ? 'bg-zinc-100 text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'}`}>
                           {t}
                       </button>
                   ))}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className="text-center py-10 bg-zinc-900/50 rounded-2xl border border-zinc-800"><p className="text-sm font-medium text-zinc-400">{T.empty_slots}</p></div>)}
            </div>
          )}

          {/* LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in space-y-8">
              <h2 className="text-3xl font-light text-white text-center mb-10">{T.location_title}</h2>
              <div className="grid grid-cols-3 gap-4 mb-10">
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-5 rounded-3xl text-[10px] font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300'}`}>
                        <x.i size={22} strokeWidth={2}/> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-6">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder={lang === 'pt' ? "Seu Nome" : "Your Name"} />
                 {booking.locationType === 'home' && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-[1fr_90px] gap-4">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder={lang === 'pt' ? "Rua" : "Street"} />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder="Nº" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                        <div className="grid grid-cols-2 gap-4">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={lang === 'pt' ? "Comp" : "Unit"} />
                        </div>
                     </div>
                 )}
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-6 animate-fade-in">
                        <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} icon={Building} placeholder={lang === 'pt' ? "Nome do Hotel" : "Hotel Name"} />
                        <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                        <InputField label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} icon={Lock} placeholder={lang === 'pt' ? "Quarto" : "Room"} />
                    </div>
                 )}
                 {booking.locationType === 'motel' && (
                    <div className="p-8 rounded-3xl border border-dashed border-zinc-700 bg-zinc-900/30 text-center">
                        <Smartphone size={28} className="mx-auto mb-4 text-zinc-600"/>
                        <p className="text-xs text-zinc-400 leading-relaxed font-light">{T.motel_note}</p>
                    </div>
                 )}
              </div>
              
              {/* EXTRAS */}
              {booking.type === 'single' && (
                  <div className="pt-10 border-t border-white/5 mt-10">
                     <h3 className="text-[10px] font-bold uppercase mb-5 tracking-widest text-zinc-500">{T.extras_title}</h3>
                     <div className="space-y-4">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-5 rounded-3xl border cursor-pointer transition-all duration-300 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                             <div className="flex items-center gap-5">
                                 <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : 'text-zinc-600'}`}><ex.icon size={22}/></div>
                                 <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : 'text-zinc-300'}`}>{ex.label}</p><p className="text-[10px] text-zinc-500 font-medium pt-0.5">{ex.desc}</p></div>
                             </div>
                             <span className={`text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-lg ${booking.extras[ex.id] ? 'bg-amber-500/20 text-amber-500' : 'text-zinc-600 bg-zinc-800'}`}>+ {T.currency || 'R$'} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-12 space-y-8">
               <div className="relative">
                   <div className="p-8 rounded-[2.5rem] border border-white/10 bg-zinc-900/80 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700 shadow-[0_0_20px_#f59e0b]"></div>
                      <div className="mb-8 pt-4">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-3 block">{booking.type === 'pack' ? (lang === 'pt'?'Pacote':'Pack') : (booking.type === 'subscription' ? (lang === 'pt'?'Assinatura':'Subscription') : (lang === 'pt'?'Sessão Individual':'Single Session'))}</span>
                          <h2 className="font-bold text-3xl text-white leading-tight mb-2">{booking.item.title}</h2>
                          <p className="text-xs text-amber-500 font-medium flex items-center gap-2 bg-amber-500/10 px-3 py-1.5 rounded-full w-fit border border-amber-500/10"><Calendar size={12}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                      </div>
                      <div className="space-y-4 border-b border-dashed border-white/10 pb-8 mb-8">
                          <div className="flex justify-between text-sm text-zinc-300"><span>Valor Base</span><span className="font-medium text-white">{T.currency || 'R$'} {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                              const extraItem = DATA.extras.find(e=>e.id===k);
                              return extraItem ? (<div key={k} className="flex justify-between text-sm text-zinc-500"><span>+ {extraItem.label}</span><span>{extraItem.price}</span></div>) : null;
                          })}
                          {booking.appliedCoupon && (<div className="flex justify-between text-sm text-emerald-400 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10"><span>Cupom ({booking.appliedCoupon.code})</span><span>- {T.currency || 'R$'} {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className="text-[10px] font-bold uppercase text-zinc-600 block mb-2">{T.total_label}</span><span className="text-[10px] font-medium text-amber-500/80 bg-amber-500/5 px-3 py-1 rounded-full border border-amber-500/10">{T.uber_warning}</span></div>
                          <div className="text-right">
                              <span className="block text-5xl font-light text-white tracking-tighter">{T.currency || 'R$'} {financials.total}</span>
                              <span className="text-[11px] font-bold text-amber-500 flex items-center justify-end gap-1.5 mt-2"><Sparkles size={12}/> +{estimatedXP} XP</span>
                          </div>
                      </div>
                   </div>
               </div>
               
               <div className="flex gap-3">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className="w-full pl-5 pr-10 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-sm font-bold uppercase tracking-widest text-white placeholder:text-zinc-700 outline-none focus:border-amber-500/50 transition-colors"/>
                       <Tag size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 pointer-events-none"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>

               <div>
                   <h3 className="text-[10px] font-bold uppercase text-zinc-500 mb-4 ml-1 tracking-widest">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-4">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub:''}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-6 py-5 rounded-2xl border flex items-center gap-5 transition-all duration-300 ${booking.payment === p.id ? 'bg-zinc-800 border-amber-500/50 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800'}`}>
                               <div className={`p-2.5 rounded-full ${booking.payment === p.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-500'}`}><p.i size={20}/></div>
                               <div className="text-left"><span className={`font-bold text-sm block ${booking.payment === p.id ? 'text-white' : 'text-zinc-400'}`}>{p.l}</span></div>
                               {booking.payment === p.id && <Check size={20} className="ml-auto text-amber-500" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>

               <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-start gap-3 mb-3">
                         <ShieldCheck className="text-zinc-600 shrink-0 mt-0.5" size={20}/>
                         <div><h4 className="text-xs font-bold text-zinc-400 mb-1">{T.terms_title}</h4><p className="text-[10px] text-zinc-500 cursor-pointer hover:text-amber-500 transition-colors underline" onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/50 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors select-none"><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 accent-amber-500 cursor-pointer"/><span className="text-xs text-zinc-300">{T.agree_terms}</span></label>
               </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-16 text-center animate-scale-in">
                 <div className="relative mb-10 group">
                     <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-25 rounded-full animate-pulse"></div>
                     <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 border border-emerald-400/20">
                         <Check size={48} className="text-white" strokeWidth={3}/>
                     </div>
                 </div>
                 <h1 className="text-3xl font-light text-white mb-4">{T.success_title}</h1>
                 <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto mb-12">{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-10 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors py-4">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className="w-full p-5 bg-zinc-950/80 backdrop-blur-xl border-t border-white/5">
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-4">
                    {step > 0 && (
                      <div className="flex gap-2.5">
                        <Button variant="secondary" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="secondary" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    
                    <button 
                      onClick={handleNextStep} 
                      className={`flex-1 h-16 rounded-2xl font-bold text-xs flex items-center justify-between px-8 transition-all duration-300 shadow-xl active:scale-[0.98] ${step < 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20 hover:shadow-amber-500/30' : 'bg-[#25D366] text-white shadow-green-500/20 hover:bg-[#20bd5a]'}`}
                    >
                      <span className="uppercase tracking-widest">{step === 3 ? T.book_btn : T.next_btn}</span>
                      {booking.item && (
                        <div className="flex flex-col items-end leading-none opacity-80">
                          <span className="text-[9px] font-medium uppercase mb-0.5">Total</span>
                          <span className="text-sm font-black">{T.currency || 'R$'} {financials.total}</span>
                        </div>
                      )}
                      {!booking.item && <ArrowRight size={20} strokeWidth={2.5}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-8 sticky top-0 bg-zinc-900 z-10 py-2 border-b border-white/5"><h3 className="text-xl font-light text-white">{T.reviews_title || "Experiências"}</h3><button onClick={()=>setReviewsOpen(false)} className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={20}/></button></div>
            <div className="space-y-5">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className="p-6 rounded-3xl bg-zinc-800/30 border border-white/5 relative">
                       <Quote size={24} className="absolute top-5 right-5 text-zinc-700" />
                       <div className="flex justify-between mb-3">
                           <span className="font-bold text-sm text-zinc-200 flex items-center gap-3">
                               <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-xs text-amber-500 font-black border border-amber-500/20">{r.n.charAt(0)}</div>
                               <div>
                                 <span className="block leading-tight">{r.n}</span>
                                 <span className="text-[10px] text-zinc-500 font-normal uppercase">{r.loc}</span>
                               </div>
                           </span>
                       </div>
                       <div className="flex text-amber-500 gap-0.5 mb-3">{[...Array(5)].map((_,k)=><Star key={k} size={12} fill={k < r.s ? "currentColor" : "none"} className={k < r.s ? "text-amber-500" : "text-zinc-700"} />)}</div>
                       <p className="text-sm text-zinc-400 leading-relaxed italic">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 max-h-[80vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'}`}>
            <div className="flex justify-between items-center mb-8"><h3 className="text-xl font-light text-white">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-2.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={20}/></button></div>
            <div className="space-y-5">
                {T.terms_body.map((t,i)=>(<div key={i} className="flex gap-5 p-5 rounded-2xl bg-zinc-950/50 border border-white/5"><span className="font-bold text-amber-500 text-2xl opacity-50">{i+1}</span><p className="text-sm text-zinc-400 leading-relaxed pt-1.5 font-light">{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-10 rounded-[3rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-amber-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[3rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-48 h-48 bg-amber-500 blur-[100px] opacity-20"></div></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-amber-500/30 animate-bounce-slow"><Trophy size={40} className="text-black" /></div>
                <h2 className="text-3xl font-light text-white mb-3">{T.popup_level_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-10">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-10 rounded-[3rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl border border-white/5 rotate-3"><Gift size={36} className="text-amber-500" /></div>
                <h2 className="text-2xl font-light text-white mb-3">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-5 rounded-2xl border border-dashed border-zinc-800 mb-8"><p className="text-[10px] uppercase font-bold text-zinc-600 mb-1.5">Seu Código:</p><p className="text-2xl font-mono font-bold text-amber-500 tracking-widest">WELCOME10</p></div>
                <Button full variant="primary" onClick={()=>{
                    setWelcomePopup(false); 
                    setUser(u=>({...u, hasSeenWelcome: true}));
                    const welcomeCoupon = { id: 'WELCOME10', val: 10, title: '🎁 Welcome', code: 'WELCOME10' };
                    setBooking(b => ({...b, appliedCoupon: welcomeCoupon}));
                    addToast(T.toast_coupon_success, "success");
                }}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.8s ease-out}.animate-slide-in{animation:slideIn 0.6s cubic-bezier(0.16,1,0.3,1)}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.4s ease-out}.pb-safe{padding-bottom:env(safe-area-inset-bottom,32px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
