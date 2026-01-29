import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, Copy
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v22.0 - FINAL STABLE (Z FLIP 5 OPTIMIZED)
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v22_stable', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 2. DESIGN SYSTEM (MOBILE FIRST & ROBUST)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-amber-500 to-amber-600 text-zinc-950 shadow-lg shadow-amber-500/20 border border-amber-400/20 hover:shadow-amber-500/30",
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20",
    whatsapp: "bg-[#25D366] text-white shadow-lg shadow-green-500/20 hover:bg-[#20bd5a] border border-green-400/20",
    outline: "bg-transparent border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500",
    icon: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-3", 
    md: "h-12 text-xs px-5", 
    lg: "h-14 text-sm px-6", 
    xl: "h-14 text-xs font-bold uppercase tracking-widest", 
    icon: "h-10 w-10 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={18} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={18} className={children ? "mr-2 opacity-90 flex-shrink-0" : ""} strokeWidth={2.5} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error }) => (
  <div className="space-y-2 w-full group">
    {label && <label className="text-[10px] font-medium uppercase tracking-widest ml-1 text-zinc-500 group-focus-within:text-amber-500 transition-colors">{label}</label>}
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-amber-500 transition-colors z-10">{Icon && <Icon size={18} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-sm font-normal transition-all duration-300 placeholder:text-zinc-600 bg-zinc-900/50 border border-zinc-800 text-zinc-200 focus:bg-zinc-900 focus:border-amber-500/30 focus:shadow-[0_0_20px_-5px_rgba(245,158,11,0.1)] ${error ? 'border-red-500/50 text-red-200' : ''}`} 
      />
    </div>
    {error && <p className="text-red-400 text-[10px] ml-2 font-medium animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-[1.8rem] transition-all duration-500 overflow-hidden 
    ${onClick ? 'cursor-pointer active:scale-[0.99] hover:bg-white/[0.02]' : ''} 
    ${active 
        ? 'bg-amber-500/5 border border-amber-500/30 shadow-[0_0_25px_-10px_rgba(245,158,11,0.15)]' 
        : 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-white/10'} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

const AutoScrollReviews = ({ reviews }) => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    let animationFrameId;
    const scroll = () => {
      if (!isPaused) {
        if (scrollContainer.scrollLeft >= (scrollContainer.scrollWidth / 2)) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 0.5; 
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const loopReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className="w-full overflow-hidden py-6 border-y border-white/5 mb-8 bg-zinc-950/30 backdrop-blur-sm">
      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {loopReviews.map((r, i) => (
           <div key={i} className="flex-shrink-0 w-72 bg-zinc-900/80 border border-white/5 p-5 rounded-2xl transition-colors hover:border-amber-500/30 select-none">
              <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-300 border border-white/5">{r.n.charAt(0)}</div>
                    <div>
                      <span className="text-xs font-bold text-zinc-200 block leading-none mb-0.5">{r.n}</span>
                      <span className="text-[9px] text-amber-500 uppercase font-bold tracking-wider">{r.loc}</span>
                    </div>
                 </div>
                 <div className="flex gap-0.5">
                   {[...Array(5)].map((_, k) => (
                     <Star key={k} size={10} fill={k < r.s ? "#fbbf24" : "none"} className={k < r.s ? "text-amber-400" : "text-zinc-700"} />
                   ))}
                 </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed font-light italic">"{r.t}"</p>
           </div>
        ))}
      </div>
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
// 3. DADOS (FULL TRANSLATION)
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Bronze" : "Bronze" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Prata" : "Silver" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Ouro" : "Gold" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: isPT ? "RELAXAR" : "RELAX",
              title: isPT ? "Sessão Relaxante" : "Relaxing Session",
              desc: isPT ? "Para tirar o peso das costas e acalmar a mente." : "To relieve back weight and calm the mind.",
              details: isPT ? `O FOCO É O ALÍVIO:
• TÉCNICA: Movimentos firmes e fluidos (Mãos e Madeira).
• OBJETIVO: Destravar musculatura e tirar dores.
• IDEAL PARA: Quem precisa descarregar o estresse.` : `FOCUS ON RELIEF:
• TECHNIQUE: Firm fluid movements (Hands & Wood).
• GOAL: Unlock muscles and remove pain.
• IDEAL FOR: Unloading stress.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: isPT ? "SENSORIAL" : "SENSORY",
              title: isPT ? "Terapia Sensitiva" : "Sensitive Therapy",
              desc: isPT ? "Um despertar suave para novas sensações." : "A soft awakening to new sensations.",
              details: isPT ? `CONEXÃO E SENSIBILIDADE:
• TOQUE: Leve, sutil e elétrico (Ponta dos dedos).
• EXPERIÊNCIA: Massagem Lingam inclusa na terapia.
• OBJETIVO: Explorar o prazer natural do corpo sem pressa.` : `CONNECTION & SENSITIVITY:
• TOUCH: Light, subtle, electric (Fingertips).
• EXPERIENCE: Lingam massage included.
• GOAL: Explore natural body pleasure without rush.`
            },
            { 
              id: 'mista', min: 60, price: 205, icon: Zap, tag: isPT ? "COMPLETA" : "COMPLETE",
              title: isPT ? "Experiência Mista" : "Mixed Experience",
              desc: isPT ? "A união do relaxamento com o toque intenso." : "Union of relaxation and intense touch.",
              details: isPT ? `A MAIS PEDIDA:
• INÍCIO: Massagem relaxante para soltar o corpo.
• MEIO: Evolui para sensitiva e Body to Body (com óleo).
• FINAL: Lingam Massagem inclusa.
• CLÍMAX: Você pode gozar ou não. É opcional, nada é forçado.` : `MOST REQUESTED:
• START: Relaxing massage to loosen up.
• MIDDLE: Evolves to sensitive and Body to Body (oiled).
• END: Lingam Massage included.
• CLIMAX: You can cum or not. Optional, no pressure.`
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Relax (4x)" : "Relax Cycle (4x)", 
              price: 440, fullPrice: 500, savings: 60, 
              details: isPT ? "Bem-estar contínuo." : "Continuous well-being.", tag: isPT ? "ECONOMIA" : "SAVINGS", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Ciclo Completo (3x)" : "Full Cycle (3x)", 
              price: 550, fullPrice: 615, savings: 65, 
              details: isPT ? "Manter a rotina em dia." : "Keep routine on track.", tag: isPT ? "PREFERIDO" : "PREFERRED", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: isPT ? "Clube Mensal" : "Monthly Club", 
              price: 360, fullPrice: 460, savings: 100, 
              details: isPT ? "2 Sessões Completas + Prioridade." : "2 Full Sessions + Priority.", tag: "VIP", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa." : "No rush." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Troca (Interativo)" : "Switch (Interactive)", desc: isPT ? "Você toca também." : "You touch too." },
            { id: 'aroma', price: 5, icon: Wind, label: isPT ? "Óleo Premium" : "Premium Oil", desc: isPT ? "Aromas importados." : "Imported scents." }
        ],
        reviews: [
            { n: "Ricardo M.", loc: "Rio Preto", t: isPT ? "Mão firme. Tirou um nó das costas que tava me matando." : "Firm hands. Removed a knot from my back that was killing me.", s: 5 },
            { n: "André L.", loc: "SP - Bela Vista", t: isPT ? "O toque dele vicia. A finalização foi absurda de boa." : "Addictive touch. The ending was absurdly good.", s: 5 },
            { n: "Felipe", loc: "Londrina", t: isPT ? "Fiquei meio assim por ser em casa e não ter maca, mas foi na cama mesmo e foi ótimo." : "Was unsure about doing it at home without a table, but bed worked great.", s: 5 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: isPT ? "Curti muito a massagem, só o horário que atrasou uns 10 min." : "Loved the massage, just ran 10 mins late.", s: 4 },
            { n: "Bruno", loc: "Jales", t: isPT ? "Atendimento no meu hotel, foi rápido e discreto. Salvou a viagem de negócios." : "Service at my hotel, fast and discreet. Saved the business trip.", s: 5 },
            { n: "Carlos", loc: "Londrina", t: isPT ? "Massagem top, pena que o ar do meu quarto tava quebrado, passamos calor kk." : "Top massage, pity my AC was broken, we sweat lol.", s: 4 },
            { n: "Pedro", loc: "Rio Preto", t: isPT ? "O corpo a corpo é quente de verdade. Energia surreal." : "Body to body is truly hot. Surreal energy.", s: 5 },
            { n: "Lucas", loc: "Santa Fé do Sul", t: isPT ? "Achei difícil estacionar perto do local que marquei, mas a massagem compensou." : "Hard to park nearby, but massage made up for it.", s: 4 },
            { n: "Renato", loc: "SP - Centro", t: isPT ? "A sensitiva me deu arrepios que eu nem sabia que sentia. Respeitoso." : "Sensitive gave me chills I didn't know I had. Respectful.", s: 5 },
            { n: "Vitor", loc: "Jales", t: isPT ? "Gostei, mas queria que tivesse durado mais tempo. Passou voando." : "Liked it, but wished it lasted longer. Time flew.", s: 4 },
            { n: "Marcelo", loc: "SP - Jardins", t: isPT ? "Higiene nota 10. O Thalyson é muito profissional com os lençóis e óleos." : "Hygiene 10/10. Thalyson is very professional with sheets and oils.", s: 5 },
            { n: "Eduardo", loc: "Londrina", t: isPT ? "Ele se adapta bem ao espaço. Fizemos no sofá cama e foi incrível." : "Adapts well to space. Did it on sofa bed and was amazing.", s: 5 },
            { n: "Caio", loc: "Rio Preto", t: isPT ? "Pagaria o dobro só pela atenção que ele dá." : "Would pay double just for the attention.", s: 5 },
            { n: "Breno", loc: "SP - Bela Vista", t: isPT ? "Relaxou e gozou. O combo perfeito pra quem vive na correria de SP." : "Relaxed and came. Perfect combo for SP rush.", s: 5 },
            { n: "Sérgio", loc: "Santa Fé do Sul", t: isPT ? "Massagem nos pés foi um bônus que eu não esperava." : "Foot massage was an unexpected bonus.", s: 5 },
            { n: "Matheus", loc: "Londrina", t: isPT ? "Demorou um pouco pra responder o zap, mas pessoalmente é 10." : "Took a bit to reply on whatsapp, but in person is 10/10.", s: 4 },
            { n: "Roberto", loc: "SP - Augusta", t: isPT ? "Pedi a completa com troca. Poder tocar nele foi a cereja do bolo." : "Asked for complete with switch. Touching him was the cherry on top.", s: 5 },
            { n: "Fabio", loc: "Rio Preto", t: isPT ? "Saiu leite até da alma. Recomendo pra quem ta estressado." : "Milked my soul. Recommend for stressed people.", s: 5 },
            { n: "Junior", loc: "SP - Moema", t: isPT ? "Me senti renovado. Energia boa demais." : "Felt renewed. Too good energy.", s: 5 },
            { n: "Paulo", loc: "Votuporanga", t: isPT ? "Top demais, só achei o valor do Uber meio salgado pra vir aqui." : "Too top, but Uber price was a bit salty to come here.", s: 4 },
            { n: "M. (Sigilo)", loc: "SP - Jardins", t: isPT ? "Gozada intensa, perdi as forças da perna. O cara é bom." : "Intense finish, lost leg strength. Guy is good.", s: 5 }
        ],
        text: {
            loading: isPT ? "PREPARANDO..." : "PREPARING...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Um momento de pausa e conexão." : "A moment of pause and connection.",
            tab_single: isPT ? "Sessões Individuais" : "Single Sessions",
            tab_packs: isPT ? "Ciclos de Cuidado" : "Care Cycles",
            reviews_btn: isPT ? "Ler Avaliações" : "Read Reviews",
            select_time_title: isPT ? "Agenda" : "Schedule",
            date_sub: isPT ? "Qual o melhor dia para você?" : "What is the best day for you?",
            location_title: isPT ? "Localização" : "Location",
            input_name: isPT ? "Seu Nome/Apelido" : "Your Name/Nickname",
            input_addr: isPT ? "Endereço do atendimento" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Comp. (Apt/Bloco)" : "Unit",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Nº Quarto" : "Room #",
            motel_note: isPT ? "Motel/Suíte: Taxa do local por sua conta. Valor da sessão acertamos no Zap." : "Motel/Suite: Venue fee on you. Session fee settled on WhatsApp.",
            pay_title: isPT ? "Pagamento" : "Payment",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Personalizar" : "Customize",
            coupon_title: isPT ? "Tem convite?" : "Have an invite?",
            coupon_placeholder: isPT ? "Código..." : "Code...",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            total_label: isPT ? "Valor Total" : "Total Price",
            book_btn: isPT ? "FINALIZAR AGENDAMENTO" : "FINISH BOOKING",
            next_btn: isPT ? "Avançar" : "Next",
            uber_warning: isPT ? "*Uber calculado no chat" : "*Uber calculated in chat",
            success_title: isPT ? "Tudo certo!" : "All set!",
            success_sub: isPT ? "Já recebi sua intenção. Agora é só me dar um oi no WhatsApp para confirmarmos." : "Intent received. Just say hi on WhatsApp to confirm.",
            whatsapp_btn: isPT ? "CHAMAR NO WHATSAPP" : "OPEN WHATSAPP",
            back_home: isPT ? "Voltar" : "Back",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            empty_date: isPT ? "Escolha uma data" : "Pick a date",
            empty_slots: isPT ? "Sem horários" : "No slots",
            details_label: isPT ? "DETALHES" : "DETAILS",
            popup_welcome_title: isPT ? "Presente" : "Gift",
            popup_welcome_msg: isPT ? "Fico feliz pelo contato. Liberei um agrado especial." : "Happy for the contact. Released a special treat.",
            popup_level_title: isPT ? "Novo Nível" : "New Level",
            popup_level_msg: isPT ? "Sua fidelidade desbloqueou novos privilégios." : "Loyalty unlocked new privileges.",
            popup_btn_coupon: isPT ? "Pegar Agora" : "Get Now",
            agree_terms: isPT ? "Li os combinados." : "Read the terms.",
            terms_body: isPT ? ["1. HIGIENE: Banho prévio ajuda no conforto.", "2. SIGILO: O que acontece na sessão, fica na sessão.", "3. RESPEITO: Ambiente de relaxamento.", "4. PAGAMENTO: Acertamos ao final.", "5. SAÚDE: Estou bem fisicamente."] : ["1. HYGIENE: Shower helps comfort.", "2. SECRECY: Stays in the session.", "3. RESPECT: Relaxing environment.", "4. PAYMENT: At the end.", "5. HEALTH: Physically fit."],
            terms_title: isPT ? "Combinados" : "Terms",
            terms_link: isPT ? "Ler combinados" : "Read terms",
            terms_btn: isPT ? "Combinado" : "Agreed",
            scarcity_msg: isPT ? "interessados" : "interested",
            level_label: isPT ? "Fidelidade" : "Loyalty",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP -> R$ ${reward} off` : `${needed} XP -> $ ${reward} off`,
            
            // TOAST MESSAGES
            toast_select_item: isPT ? "Escolha uma experiência." : "Pick an experience.",
            toast_select_date: isPT ? "Qual dia fica bom?" : "Which day works?",
            toast_fill_name: isPT ? "Qual seu nome?" : "What's your name?",
            toast_fill_addr: isPT ? "Preciso do endereço." : "Need address.",
            toast_fill_hotel: isPT ? "Qual o hotel?" : "Which hotel?",
            toast_select_pay: isPT ? "Como prefere pagar?" : "How to pay?",
            toast_accept_terms: isPT ? "Aceite os combinados." : "Accept terms.",
            toast_coupon_success: isPT ? "Convite aceito!" : "Code accepted!",
            toast_coupon_error: isPT ? "Código não encontrado." : "Code not found.",

            zap: {
              intro: isPT ? "Oi Thalyson, tudo bem?" : "Hi Thalyson, how are you?",
              order_title: isPT ? "*QUERO AGENDAR*" : "*BOOKING REQUEST*",
              client: isPT ? "👤 *Nome:*" : "👤 *Name:*",
              service: isPT ? "💆‍♂️ *Sessão:*" : "💆‍♂️ *Session:*",
              date: isPT ? "🗓️ *Quando:*" : "🗓️ *When:*",
              location: isPT ? "📍 *Onde:*" : "📍 *Where:*",
              payment: isPT ? "💳 *Pgto:*" : "💳 *Pay:*",
              value: isPT ? "💰 *VALOR:*" : "💰 *PRICE:*",
              xp_status: isPT ? "🏆 *Fidelidade:*" : "🏆 *Loyalty:*",
              xp_gain: isPT ? "XP Ganho:" : "XP Earned:",
              xp_level: isPT ? "Nível:" : "Level:",
              xp_next: isPT ? "Próximo:" : "Next:",
              wait: isPT ? "Podemos confirmar?" : "Can we confirm?",
              house: isPT ? "Em Casa" : "Home",
              hotel: "Hotel",
              motel: "Motel",
              extra_title: isPT ? "✨ *Extras:*" : "✨ *Extras:*",
              uber_label: isPT ? "🚗 *Uber:*" : "🚗 *Uber:*",
              uber_text: isPT ? "A combinar" : "TBD"
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
  const [isDark, setIsDark] = useState(true);
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thalyson Massagens',
          text: lang === 'pt' ? 'Agende seu momento de relaxamento.' : 'Book your relaxation moment.',
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(lang === 'pt' ? "Link copiado!" : "Link copied!", "success");
    }
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

  // CARREGAMENTO E INICIALIZAÇÃO DE DADOS
  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2000);
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            setUser(prev => ({ 
                ...prev, 
                ...parsed, 
                coupons: Array.isArray(parsed.coupons) ? parsed.coupons : [] 
            }));
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
    
    const xpStatusMsg = nextInfo ? `${T.zap.xp_next} ${nextInfo.needed} XP (R$ ${nextInfo.reward} off)` : "Nível Máximo! ⚜️";

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
    
    // Remove o cupom que foi usado nesta sessão
    if (booking.appliedCoupon) { 
        updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code); 
    }
    
    const newXP = Math.floor(user.xp + estimatedXP);
    let leveledUp = false;
    
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });
    
    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        if (newCycle > oldCycle && newCycle >= 0) {
              leveledUp = true;
              updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 Elite`, code: `VIPMASTER` });
        }
    }
    
    if (leveledUp) setLevelUpPopup(true);
    
    // ATUALIZA O ESTADO COM OS NOVOS CUPONS
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
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative mb-8">
            <div className={`absolute inset-0 blur-3xl opacity-20 rounded-full animate-pulse ${isDark ? 'bg-amber-500' : 'bg-amber-400'}`}></div>
            <div className={`w-24 h-24 rounded-[1.5rem] flex items-center justify-center font-bold text-3xl shadow-2xl relative z-10 ${isDark ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-amber-500/20' : 'bg-white text-amber-500 shadow-slate-200'}`}>TM</div>
        </div>
        <div className="flex items-center gap-3 text-xs font-bold tracking-[0.25em] opacity-50 uppercase"><Loader2 size={14} className="animate-spin text-amber-500"/>{T.text?.loading}</div>
      </div>
  );
  
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-amber-500/30 selection:text-amber-500' : 'bg-slate-50 text-slate-800 selection:bg-amber-200 selection:text-amber-800'}`}>
      
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] blur-[150px] rounded-full ${isDark ? 'bg-amber-500/5' : 'bg-amber-200/40'}`}></div>
          <div className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] blur-[150px] rounded-full ${isDark ? 'bg-amber-600/5' : 'bg-orange-200/40'}`}></div>
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-down ${t.type === 'success' ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-700') : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-200 text-red-700')}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />

      <header className="h-24 px-6 flex items-center justify-between z-20 shrink-0 bg-transparent relative">
        <div className="flex flex-col justify-center">
            <span className={`font-bold text-lg tracking-wide block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</span>
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-[0.2em]">Massagens</span>
        </div>
        <div className="flex gap-2">
            <button onClick={handleShare} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm'}`}><Share2 size={18}/></button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm'}`}><Instagram size={18}/></a>
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-amber-500 hover:text-amber-600 shadow-sm'}`}>{isDark ? <Moon size={18}/> : <Sun size={18}/>}</button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-40 scroll-smooth relative z-10">
        
        {step < 3 && <AutoScrollReviews reviews={DATA.reviews} />}

        <div className="max-w-md mx-auto px-5 space-y-8 pt-2">

          {/* CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in space-y-8">
              <div>
                <div className="flex items-end gap-2 mb-3">
                    <h1 className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome} <span className="font-bold text-amber-500">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'Visitante':'Visitor')}</span></h1>
                </div>
                <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                <div className={`relative mt-8 overflow-hidden rounded-[2rem] p-6 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-amber-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-amber-500/30'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700"></div>
                    
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-amber-500/20' : 'bg-amber-500 text-white shadow-amber-200'}`}>
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className={`flex justify-between text-[10px] font-medium mb-3 uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                            <span>Progresso</span>
                            <span className="text-amber-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-200'}`}>
                            <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_15px_#f59e0b]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                         <p className={`text-[10px] mt-4 text-center font-medium ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
                </div>
              </div>

              <div className={`grid grid-cols-2 p-1.5 rounded-3xl border relative ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-slate-100 border-slate-200'}`}>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-4 text-[11px] font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'bg-white text-slate-900 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600')}`}><LayoutList size={14}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-4 text-[11px] font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'bg-white text-slate-900 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600')}`}><Package size={14}/> {T.tab_packs}</button>
              </div>

              {activeTab === 'single' && (
                  <div className="space-y-6 animate-slide-in">
                    {DATA.services.map(s => (
                      <Card key={s.id} active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)} className={!isDark ? 'bg-white shadow-lg border-slate-100' : ''}>
                          <div className="flex justify-between items-start mb-6">
                            <div className={`p-3.5 rounded-2xl transition-all duration-300 ${booking.item?.id === s.id ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black shadow-lg shadow-amber-500/20' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-400')}`}><s.icon size={24}/></div>
                            <div className="text-right">
                                <span className={`block text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.currency || 'R$'} {s.price}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}><Clock size={12}/> {s.min} min</span>
                            </div>
                          </div>
                          <div className="mb-4">
                              {s.tag && <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 mb-3 uppercase tracking-widest">{s.tag}</span>}
                              <h3 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                          </div>
                          <p className={`text-xs leading-loose font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{s.desc}</p>
                          
                          <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === s.id ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                              <div className="overflow-hidden">
                                  <div className={`p-5 rounded-2xl border text-[11px] leading-loose font-light ${isDark ? 'bg-zinc-950/50 border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                                      <div className="flex items-center gap-2 font-bold mb-3 text-amber-500 uppercase tracking-wider text-[10px]"><Info size={12}/> {T.details_label}</div>
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
                          <Card key={plan.id} active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)} className={!isDark ? 'bg-white shadow-lg border-slate-100' : ''}>
                              {plan.tag && (<div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-amber-600 text-black text-[9px] font-bold px-3 py-2 rounded-bl-2xl shadow-lg shadow-amber-500/20">{plan.tag}</div>)}
                              <div className="flex items-center gap-4 mb-6">
                                  <div className={`p-4 rounded-2xl transition-all ${booking.item?.id === plan.id ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400')}`}><plan.icon size={28}/></div>
                                  <div><h3 className={`font-bold text-lg leading-none mb-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.title}</h3><p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{plan.type === 'pack' ? (lang === 'pt' ? 'Pacote' : 'Pack') : (lang === 'pt' ? 'Assinatura' : 'Subscription')}</p></div>
                              </div>
                              <p className={`text-xs mb-6 font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{plan.details}</p>
                              <div className={`flex items-end gap-3 p-4 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                  <span className="text-2xl font-bold text-amber-500">{T.currency || 'R$'} {plan.price}</span>
                                  <span className={`text-xs line-through decoration-zinc-600 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{T.currency || 'R$'} {plan.fullPrice}</span>
                                  <span className="text-[9px] text-emerald-500 font-bold mb-1 ml-auto bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">-{T.currency || 'R$'}{plan.savings}</span>
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
              <div className="text-center mb-8">
                 <h2 className={`text-2xl font-light mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
                 <p className={`text-[10px] uppercase tracking-[0.25em] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.date_sub}</p>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[70px] h-24 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all flex-shrink-0 active:scale-95 duration-300 ${isSel ? 'bg-amber-500 border-amber-500 text-black shadow-lg shadow-amber-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600')}`}>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                      <span className="text-2xl font-bold">{d.getDate()}</span>
                      {isSel && <span className="w-1.5 h-1.5 rounded-full bg-black mt-1"></span>}
                    </button>
                  )
                })}
              </div>
              
              {!booking.date && (<div className={`text-center py-16 opacity-30 border border-dashed rounded-[2rem] mx-2 ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-400'}`}><Calendar size={36} className="mx-auto mb-4"/><p className="text-[10px] font-bold uppercase tracking-wider">{T.empty_date}</p></div>)}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-3.5 rounded-xl text-xs font-medium border transition-all active:scale-95 duration-200 relative overflow-hidden group ${booking.time === t ? (isDark ? 'bg-zinc-100 text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-slate-900 text-white border-slate-900 shadow-xl') : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800')}`}>
                           {t}
                       </button>
                   ))}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className={`text-center py-10 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}><p className="text-xs font-medium">{T.empty_slots}</p></div>)}
            </div>
          )}

          {/* LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in space-y-8">
              <h2 className={`text-2xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
              <div className="grid grid-cols-3 gap-3 mb-8">
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 rounded-2xl text-[9px] font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-2 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-500 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600')}`}>
                        <x.i size={20} strokeWidth={2}/> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-6">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder={lang === 'pt' ? "Seu Nome" : "Your Name"} />
                 {booking.locationType === 'home' && (
                     <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-[1fr_80px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder={lang === 'pt' ? "Rua" : "Street"} />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder="Nº" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                        <div className="grid grid-cols-2 gap-3">
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
                    <div className={`p-6 rounded-2xl border border-dashed text-center ${isDark ? 'border-zinc-700 bg-zinc-900/30' : 'border-slate-300 bg-slate-50'}`}>
                        <Smartphone size={24} className={`mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}/>
                        <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.motel_note}</p>
                    </div>
                 )}
              </div>
              
              {/* EXTRAS */}
              {booking.type === 'single' && (
                  <div className={`pt-8 border-t mt-8 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                     <h3 className={`text-[10px] font-bold uppercase mb-4 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${booking.extras[ex.id] ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`p-2 rounded-xl transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : (isDark ? 'text-zinc-600' : 'text-slate-400')}`}><ex.icon size={20}/></div>
                                 <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-amber-500' : (isDark ? 'text-zinc-300' : 'text-slate-700')}`}>{ex.label}</p><p className={`text-[10px] font-medium pt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{ex.desc}</p></div>
                             </div>
                             <span className={`text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-lg ${booking.extras[ex.id] ? 'bg-amber-500/20 text-amber-500' : (isDark ? 'text-zinc-600 bg-zinc-800' : 'text-slate-400 bg-slate-100')}`}>+ {T.currency || 'R$'} {ex.price}</span>
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
                   <div className={`p-6 rounded-[2rem] border backdrop-blur-2xl shadow-2xl relative overflow-hidden ${isDark ? 'border-white/10 bg-zinc-900/80' : 'border-slate-200 bg-white/90'}`}>
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-700 shadow-[0_0_20px_#f59e0b]"></div>
                      <div className="mb-6 pt-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest mb-2 block ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{booking.type === 'pack' ? (lang === 'pt'?'Pacote':'Pack') : (booking.type === 'subscription' ? (lang === 'pt'?'Assinatura':'Subscription') : (lang === 'pt'?'Sessão Individual':'Single Session'))}</span>
                          <h2 className={`font-bold text-2xl leading-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.item.title}</h2>
                          <p className="text-[11px] text-amber-500 font-medium flex items-center gap-2 bg-amber-500/10 px-2 py-1 rounded-full w-fit border border-amber-500/10"><Calendar size={10}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                      </div>
                      <div className={`space-y-3 border-b border-dashed pb-6 mb-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                          <div className={`flex justify-between text-xs ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}><span>{lang === 'pt' ? 'Valor Base' : 'Base Price'}</span><span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.currency || 'R$'} {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                              const extraItem = DATA.extras.find(e=>e.id===k);
                              return extraItem ? (<div key={k} className={`flex justify-between text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}><span>+ {extraItem.label}</span><span>{extraItem.price}</span></div>) : null;
                          })}
                          {booking.appliedCoupon && (<div className="flex justify-between text-xs text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 font-bold"><span>{lang === 'pt' ? 'Cupom' : 'Coupon'} ({booking.appliedCoupon.code})</span><span>- {T.currency || 'R$'} {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className={`text-[9px] font-bold uppercase block mb-1 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{T.total_label}</span><span className="text-[9px] font-medium text-amber-500/80 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">{T.uber_warning}</span></div>
                          <div className="text-right">
                              <span className={`block text-4xl font-light tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.currency || 'R$'} {financials.total}</span>
                              <span className="text-[10px] font-bold text-amber-500 flex items-center justify-end gap-1.5 mt-1"><Sparkles size={10}/> +{estimatedXP} XP</span>
                          </div>
                      </div>
                   </div>
               </div>
               
               <div className="flex gap-2">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-8 py-3.5 rounded-xl border text-sm font-bold uppercase tracking-widest outline-none focus:border-amber-500/50 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-300'}`}/>
                       <Tag size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-700' : 'text-slate-300'}`}/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>

               {/* LISTA DE CUPONS COM SCROLL HORIZONTAL */}
               {user.coupons && user.coupons.length > 0 && (
                   <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-hide">
                       <div className="flex gap-2">
                           {user.coupons.map(c => {
                               const isApplied = booking.appliedCoupon?.id === c.id;
                               return (
                                   <button 
                                       key={c.id} 
                                       onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                       className={`flex-shrink-0 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all whitespace-nowrap active:scale-95 ${isApplied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : (isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300')}`}
                                   >
                                       {c.title}
                                   </button>
                               )
                           })}
                       </div>
                   </div>
               )}

               <div>
                   <h3 className={`text-[10px] font-bold uppercase mb-4 ml-1 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub:''}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${booking.payment === p.id ? 'bg-zinc-800 border-amber-500/50 shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]' : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`}>
                               <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-amber-500 text-black' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-400')}`}><p.i size={18}/></div>
                               <div className="text-left"><span className={`font-bold text-xs block ${booking.payment === p.id ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-zinc-400' : 'text-slate-500')}`}>{p.l}</span></div>
                               {booking.payment === p.id && <Check size={18} className="ml-auto text-amber-500" strokeWidth={3}/>}
                           </button>
                       ))}
                   </div>
               </div>

               <div className={`p-4 rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-start gap-3 mb-2">
                         <ShieldCheck className={`${isDark ? 'text-zinc-600' : 'text-slate-400'} shrink-0 mt-0.5`} size={18}/>
                         <div><h4 className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.terms_title}</h4><p className={`text-[10px] cursor-pointer hover:text-amber-500 transition-colors underline ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                    </div>
                    <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-zinc-500 transition-colors select-none ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-white border-slate-200'}`}><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-amber-500 cursor-pointer"/><span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.agree_terms}</span></label>
               </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-16 text-center animate-scale-in">
                 <div className="relative mb-10 group">
                     <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-25 rounded-full animate-pulse"></div>
                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 border border-emerald-400/20">
                         <Check size={40} className="text-white" strokeWidth={3}/>
                     </div>
                 </div>
                 <h1 className={`text-2xl font-light mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h1>
                 <p className={`text-xs leading-relaxed max-w-xs mx-auto mb-10 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className={`mt-8 text-[10px] font-bold uppercase tracking-widest transition-colors py-4 ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-400 hover:text-slate-600'}`}>{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className={`w-full p-4 backdrop-blur-xl border-t ${isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-slate-200'}`}>
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="secondary" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    
                    {/* Botão Avançar: Coluna para evitar quebra no Z Flip */}
                    <button 
                      onClick={handleNextStep} 
                      className={`flex-1 min-h-[3.5rem] rounded-2xl flex flex-col items-center justify-center px-4 transition-all duration-300 shadow-xl active:scale-[0.98] ${step < 3 ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-amber-500/20 hover:shadow-amber-500/30' : 'bg-[#25D366] text-white shadow-green-500/20 hover:bg-[#20bd5a]'}`}
                    >
                      <div className="flex items-center justify-center w-full">
                          <span className="text-xs font-bold uppercase tracking-widest mr-2">{step === 3 ? T.book_btn : T.next_btn}</span>
                          {!booking.item && <ArrowRight size={16} strokeWidth={2.5}/>}
                      </div>
                      
                      {booking.item && (
                        <div className="flex flex-col items-center leading-none opacity-90 mt-0.5">
                          <span className="text-[10px] font-black whitespace-nowrap">{T.currency || 'R$'} {financials.total}</span>
                        </div>
                      )}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md border rounded-[2.5rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className={`flex justify-between items-center mb-6 sticky top-0 z-10 py-2 border-b ${isDark ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100'}`}><h3 className={`text-lg font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.reviews_title || "Experiências"}</h3><button onClick={()=>setReviewsOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}><X size={18}/></button></div>
            <div className="space-y-4">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className={`p-5 rounded-2xl border relative ${isDark ? 'bg-zinc-800/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                       <Quote size={20} className={`absolute top-4 right-4 ${isDark ? 'text-zinc-700' : 'text-slate-300'}`} />
                       <div className="flex justify-between mb-2">
                           <span className={`font-bold text-sm flex items-center gap-3 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border ${isDark ? 'bg-gradient-to-br from-amber-500/20 to-amber-600/20 text-amber-500 border-amber-500/20' : 'bg-amber-100 text-amber-600 border-amber-200'}`}>{r.n.charAt(0)}</div>
                               <div>
                                 <span className="block leading-tight text-xs">{r.n}</span>
                                 <span className={`text-[9px] font-normal uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{r.loc}</span>
                               </div>
                           </span>
                       </div>
                       <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill={k < r.s ? "#fbbf24" : "none"} className={k < r.s ? "text-amber-400" : (isDark ? "text-zinc-700" : "text-slate-300")} />)}</div>
                       <p className={`text-xs leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md border rounded-[2rem] p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-6"><h3 className={`text-lg font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}><X size={18}/></button></div>
            <div className="space-y-4">
                {T.terms_body.map((t,i)=>(<div key={i} className={`flex gap-4 p-4 rounded-xl border ${isDark ? 'bg-zinc-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}><span className="font-bold text-amber-500 text-xl opacity-50">{i+1}</span><p className={`text-xs leading-relaxed pt-1 font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-amber-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-40 h-40 bg-amber-500 blur-[80px] opacity-20"></div></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30 animate-bounce-slow"><Trophy size={32} className="text-black" /></div>
                <h2 className="text-2xl font-light text-white mb-2">{T.popup_level_title}</h2><p className="text-zinc-400 text-xs leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5 rotate-3"><Gift size={32} className="text-amber-500" /></div>
                <h2 className="text-xl font-light text-white mb-2">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-xs leading-relaxed mb-6">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Seu Código:</p><p className="text-xl font-mono font-bold text-amber-500 tracking-widest">WELCOME10</p></div>
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
