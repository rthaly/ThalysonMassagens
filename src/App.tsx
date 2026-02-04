import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind,
  Clock, Zap, X, Globe, Building, BedDouble,
  Heart, Instagram, Moon, Sun, Home,
  CreditCard, Banknote, QrCode, Trophy, Info, Gift,
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles,
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package,
  Lock, User, Quote, Share2, ExternalLink, Copy, Hourglass, Settings, Download, HelpCircle, ChevronDown
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v57.0 - FINAL COMPLETE FIXED & OPTIMIZED
 * ==================================================================================
 * CÓDIGO CORRIGIDO E APRIMORADO.
 */

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_v57_final_fixed',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_2026_SECURE',
  START_HOUR: 9,
  END_HOUR: 20
};

// ==================================================================================
// 1. DESIGN SYSTEM
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98] hover:brightness-110 shadow-lg font-['Poppins']";

  const variants = {
    primary: "bg-blue-600 text-white border border-blue-500/20 shadow-blue-600/30",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white border border-green-400/20 shadow-green-500/20",
    instagram: "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border border-pink-400/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-300",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    icon: "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700"
  };

  const sizes = {
    sm: "h-10 text-xs px-4",
    md: "h-14 text-sm px-6",
    lg: "h-16 text-base px-8",
    xl: "h-16 text-base font-bold uppercase tracking-widest",
    icon: "h-12 w-12 p-0 flex-shrink-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={22} className="animate-spin text-current"/> : (
        <>
          {Icon && <Icon size={22} className={children ? "mr-3 opacity-90 flex-shrink-0" : ""} strokeWidth={2.5} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2.5 w-full group font-['Poppins']">
    {label && <label className={`text-sm font-bold uppercase tracking-widest ml-1 transition-colors ${isDark ? 'text-zinc-400 group-focus-within:text-blue-500' : 'text-slate-600 group-focus-within:text-blue-600'}`}>{label}</label>}
    <div className="relative">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isDark ? 'text-zinc-500 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{Icon && <Icon size={22} />}</div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-14 pr-5 h-16 rounded-2xl outline-none text-base font-medium transition-all duration-300 
        ${isDark
            ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus:bg-zinc-950 focus:border-blue-500'
            : 'bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-md'} 
        focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] ${error ? 'border-red-500/50 text-red-500' : ''}`}
      />
    </div>
    {error && <p className="text-red-500 text-xs ml-2 font-bold animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false, isDark = true }) => (
  <div
    onClick={onClick}
    className={`relative p-8 rounded-[2.5rem] transition-all duration-300 flex flex-col justify-between h-full group font-['Poppins'] min-h-[480px]
    ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-2' : ''} 
    ${active
        ? 'bg-blue-900/10 border-2 border-blue-500 shadow-[0_0_50px_-10px_rgba(37,99,235,0.4)]'
        : (isDark ? 'bg-zinc-900/80 backdrop-blur-2xl border border-white/10 hover:border-blue-500/50 hover:bg-zinc-800' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-500/30')} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none rounded-[2.5rem]" />}
    {children}
  </div>
);

const SmartTimer = ({ isDark }) => {
  const [time, setTime] = useState(600);
  useEffect(() => {
    const interval = setInterval(() => {
        setTime(prev => {
            if (prev <= 0) return 600;
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  return (
    <div className={`flex items-center justify-center gap-3 p-4 rounded-2xl mb-8 border-2 transition-colors duration-500 ${time < 60 ? 'bg-red-500/10 border-red-500/30 text-red-400' : (isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')}`}>
        <Hourglass size={20} className={time < 60 ? "animate-spin" : "animate-pulse"}/>
        <span className="text-sm font-bold uppercase tracking-wider">
            {time < 60 ? "Expira em breve: " : "Segurando vaga: "}
            <span className="font-mono text-base ml-1">{format(time)}</span>
        </span>
    </div>
  );
};

const ReviewsCarousel = ({ reviews, isDark, title }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 340;
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };
  return (
    <div className={`w-full overflow-hidden py-14 border-t mt-20 relative group/reviews ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
      <div className="text-center mb-12">
          <h3 className={`text-3xl font-light mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>O que dizem sobre mim</h3>
          <p className={`text-sm uppercase tracking-[0.25em] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{title}</p>
      </div>
      <button onClick={() => scroll('left')} className={`hidden md:flex absolute left-8 top-1/2 z-20 w-12 h-12 items-center justify-center rounded-full border-2 transition-all shadow-xl backdrop-blur-xl opacity-0 group-hover/reviews:opacity-100 md:opacity-100 ${isDark ? 'bg-zinc-900/90 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-white'}`}><ChevronLeft size={24} /></button>
      <button onClick={() => scroll('right')} className={`hidden md:flex absolute right-8 top-1/2 z-20 w-12 h-12 items-center justify-center rounded-full border-2 transition-all shadow-xl backdrop-blur-xl opacity-0 group-hover/reviews:opacity-100 md:opacity-100 ${isDark ? 'bg-zinc-900/90 border-zinc-700 text-white hover:bg-zinc-800' : 'bg-white/90 border-slate-200 text-slate-800 hover:bg-white'}`}><ChevronRight size={24} /></button>
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-20 snap-x snap-mandatory font-['Poppins']">
        {reviews.map((r, i) => (
            <div key={`${i}-${r.n}`} className={`snap-center flex-shrink-0 w-80 sm:w-96 border p-8 rounded-[2rem] transition-all duration-300 hover:scale-[1.01] select-none ${isDark ? 'bg-zinc-900/80 border-white/10 hover:border-blue-500/20' : 'bg-white border-slate-200 shadow-sm hover:border-blue-400'}`}>
              <div className="flex justify-between items-start mb-5">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border ${isDark ? 'bg-zinc-800 text-zinc-300 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{r.n.charAt(0)}</div>
                    <div><span className={`text-base font-bold block leading-none mb-1 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{r.n}</span><span className="text-xs text-blue-500 uppercase font-bold tracking-wider">{r.loc}</span></div>
                 </div>
                 <div className="flex gap-0.5">{[...Array(5)].map((_, k) => (<Star key={k} size={14} fill={k < r.s ? "#3b82f6" : "none"} className={k < r.s ? "text-blue-500" : (isDark ? "text-zinc-700" : "text-slate-300")} />))}</div>
              </div>
              <p className={`text-sm leading-relaxed italic ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{r.t}"</p>
            </div>
        ))}
        <div className="w-6 shrink-0"></div>
      </div>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group">
                <span className={`text-base font-semibold transition-colors ${isDark ? 'text-zinc-200 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{q}</span>
                <ChevronDown size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : (isDark ? 'text-zinc-500' : 'text-slate-400')}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{a}</p>
            </div>
        </div>
    );
};

// ==================================================================================
// 2. DADOS (PREÇOS EM MOEDA DINÂMICA)
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    const currency = isPT ? 'R$' : '$';
    const p = {
        relax: isPT ? 125 : 35,
        sens: isPT ? 155 : 45,
        titan: isPT ? 195 : 60,
        packRelax: { v: isPT ? 397 : 120, full: isPT ? 500 : 140, save: isPT ? 103 : 20 },
        packTri: { v: isPT ? 487 : 150, full: isPT ? 585 : 180, save: isPT ? 98 : 30 },
        packPass: { v: isPT ? 780 : 240, full: isPT ? 975 : 300, save: isPT ? 195 : 60 }
    };

    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Amigo" : "Bronze" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Próximo" : "Silver" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Íntimo" : "Gold" }
        ],
        services: [
            {
              id: 'relaxante', min: 60, price: p.relax, icon: Wind, tag: isPT ? "100% FÍSICO" : "PHYSICAL",
              title: isPT ? "Massagem Clássica" : "Classic Relax",
              desc: isPT ? "Para tirar a dor. Foco exclusivo muscular. Sem toque íntimo." : "For pain. Muscle focus only. No intimate touch.",
              details: isPT ? `O ALÍVIO QUE VOCÊ PRECISA:\n• COMO FUNCIONA: Iniciamos com manobras firmes e profundas para soltar toda a musculatura das costas e pernas.\n• FOCO: Tirar "nós", tensão e cansaço físico.\n• TRAJE: O terapeuta usa roupa padrão.\n• NOTA: Esta sessão é puramente terapêutica/muscular.`
              : `BODY RESET:\n• HOW IT WORKS: Firm maneuvers to release back/leg muscles.\n• FOCUS: Remove knots and fatigue.\n• ATTIRE: Standard clothing.\n• NOTE: Purely therapeutic.`
            },
            {
              id: 'sensitiva', min: 60, price: p.sens, icon: Flame, tag: isPT ? "SENSORIAL + LINGAM" : "SENSORY",
              title: isPT ? "Tântrica Sensorial" : "Tantric Sensory",
              desc: isPT ? "Relaxamento + Toque Sutil + Finalização. Atendo de cueca." : "Relax + Subtle Touch + Finish. Underwear service.",
              details: isPT ? `A EVOLUÇÃO DO TOQUE:\n• O INÍCIO: Começamos SEMPRE soltando a musculatura (Relaxante) para você se entregar.\n• CONEXÃO: Toques sutis e sensoriais despertam a pele e a energia.\n• TRAJE: **Atendo de cueca** para criar um ambiente de maior intimidade e conforto.\n• O ÁPICE: Inclui a **Massagem Lingam** (toque íntimo) com foco em prazer e acolhimento.`
              : `TOUCH EVOLUTION:\n• START: Muscle relaxation first.\n• CONNECTION: Subtle touches to awaken skin.\n• ATTIRE: **I wear underwear** for intimacy.\n• PEAK: Includes **Lingam Massage** for pleasure.`
            },
            {
              id: 'mista', min: 60, price: p.titan, icon: Zap, tag: isPT ? "FUSÃO COMPLETA" : "FULL FUSION",
              title: isPT ? "Experiência Fusion" : "Fusion Experience",
              desc: isPT ? "Tudo em um: Muscular + Corpo a Corpo + Lingam Intenso." : "All in one: Muscle + Body-to-Body + Intense Lingam.",
              details: isPT ? `PARA QUEM QUER TUDO:\n• A JORNADA: Começa tirando a dor (Muscular), evolui para o contato pele com pele (Body-to-Body) e termina no êxtase.\n• LINGAM PREMIUM: Dedico mais tempo e técnica na região íntima para uma descarga de energia potente.\n• TRAJE: Atendo de cueca para permitir o deslizamento corporal.\n• RESULTADO: Você sai sem dor nas costas e com a mente leve.`
              : `FOR WHO WANTS IT ALL:\n• JOURNEY: Muscle relief -> Body-to-Body -> Ecstasy.\n• PREMIUM LINGAM: More time/technique on intimate area.\n• ATTIRE: Underwear.\n• RESULT: No pain, light mind.`
            }
        ],
        extras: [
            { id: 'more_time', price: isPT ? 55 : 15, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Sem pressa." : "No rush." },
            { id: 'touch', price: isPT ? 55 : 15, icon: Heart, label: isPT ? "Troca (Interativo)" : "Interactive", desc: isPT ? "Você toca também." : "You touch too." },
            { id: 'aroma', price: isPT ? 5 : 5, icon: Wind, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Imersão total." : "Total immersion." }
        ],
        faq: [
            { q: "Qual a diferença real entre as sessões?", a: "Clássica (R$125) = Só tira dor (sem sexo/lingam). Tântrica (R$155) = Tira dor + Toque leve + Lingam (de cueca). Fusion (R$195) = Tira dor + Corpo a Corpo + Lingam Intenso (a mais completa)." },
            { q: "Você tem local próprio?", a: "Não. Meu atendimento é 100% Delivery (Vou até você). Atendo em domicílio, hotéis ou motéis com total discrição e segurança." },
            { q: "Onde você atende?", a: "São Paulo Capital e região. O valor do transporte (Uber) é calculado à parte no momento do agendamento." },
            { q: "Pode 'gozar' na massagem?", a: "Sim! Nas experiências Tântrica e Fusion, o clímax é bem-vindo e faz parte do alívio terapêutico." },
            { q: "Aceita cartão?", a: "Sim, aceito Pix e Cartão de Crédito (via link seguro)." }
        ],
        plans: [
            {
              id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Anti-Stress" : "Anti-Stress Cycle",
              price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save,
              desc: isPT ? "4 Sessões de Massagem Clássica." : "4 Classic Massage Sessions.",
              details: isPT ? "MANUTENÇÃO CONTRA DOR:\n• 4 sessões focadas 100% em tirar tensão muscular.\n• Não inclui parte íntima."
                            : "PAIN MAINTENANCE:\n• 4 sessions focused on muscle tension.\n• No intimate part.",
              tag: isPT ? "MANUTENÇÃO" : "MAINTENANCE", icon: Package
            },
            {
              id: 'pack_mista', type: 'pack', title: isPT ? "Trilogia do Êxtase" : "Ecstasy Trilogy",
              price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save,
              desc: isPT ? "3 Sessões da Experiência Fusion." : "3 Fusion Sessions.",
              details: isPT ? "INTENSIDADE GARANTIDA:\n• 3 encontros da massagem mais completa (Fusion).\n• Ideal para quem quer viver o ápice do prazer repetidas vezes."
                            : "GUARANTEED INTENSITY:\n• 3 meetings of the fullest massage.\n• Ideal for repeated pleasure.",
              tag: isPT ? "MAIS VENDIDO" : "BEST SELLER", icon: Zap
            },
            {
              id: 'titan_passport', type: 'pack', title: isPT ? "Passaporte Titan (5x)" : "Titan Passport (5x)",
              price: p.packPass.v, fullPrice: p.packPass.full, savings: p.packPass.save,
              desc: isPT ? "Compre 4, Leve 5 (Fusion)." : "Buy 4, Get 5 (Fusion).",
              details: isPT ? "A OFERTA IRRECUSÁVEL:\n• Você garante 5 sessões Fusion completas.\n• Paga 4 e a 5ª é por minha conta.\n• Validade estendida para usar quando quiser."
                            : "IRRESISTIBLE OFFER:\n• 5 full Fusion sessions.\n• Pay 4, get 5th free.\n• Extended validity.",
              tag: isPT ? "1 SESSÃO GRÁTIS" : "1 FREE SESSION", icon: Crown
            }
        ],
        reviews: [
            { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Você primeiro conhece o corpo para ir executando o procedimento com muito cuidado e segurança. Recomendo muito.", s: 5 },
            { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", s: 5 },
            { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois, saí mais leve. Da pra ver que ele manda bem no que faz. Obrigado!", s: 5 },
            { n: "Felipe", loc: "Londrina", t: "Fiquei na dúvida por ser no sofá, mas foi surpreendentemente confortável.", s: 5 },
            { n: "Ricardo M.", loc: "Rio Preto", t: "Mão firme. Consegui relaxar de verdade, coisa que não fazia há tempos.", s: 5 },
            { n: "André L.", loc: "SP - Bela Vista", t: "O toque dele é diferente. Me senti muito à vontade.", s: 5 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: "Gostei muito da energia, pessoa do bem. Recomendo.", s: 4 },
            { n: "Bruno", loc: "Jales", t: "Veio até meu hotel, foi super discreto e educado. Salvou minha semana.", s: 5 },
            { n: "Carlos", loc: "Londrina", t: "Massagem ótima, pena que estava muito quente no dia.", s: 4 },
            { n: "Pedro", loc: "Rio Preto", t: "A energia do corpo a corpo é intensa. Me senti renovado.", s: 5 },
            { n: "Lucas", loc: "Santa Fé do Sul", t: "Foi um pouco difícil achar vaga, mas a sessão compensou o estresse.", s: 4 },
            { n: "Renato", loc: "SP - Centro", t: "Muito respeitoso e profissional. A sensitiva é uma experiência única.", s: 5 },
            { n: "Vitor", loc: "Jales", t: "Gostei, passou rápido demais. Na próxima pego mais tempo.", s: 4 },
            { n: "Eduardo", loc: "Londrina", t: "Ele se adapta bem. Fizemos na cama e foi super tranquilo.", s: 5 },
            { n: "Caio", loc: "Rio Preto", t: "A atenção que ele dá faz valer a pena.", s: 5 },
            { n: "Breno", loc: "SP - Bela Vista", t: "Relaxei e me diverti. Ótimo pra esquecer os problemas de SP.", s: 5 },
            { n: "Sérgio", loc: "Santa Fé do Sul", t: "A massagem nos pés foi um detalhe que fez diferença.", s: 5 },
            { n: "Matheus", loc: "Londrina", t: "Demorou um pouquinho pra responder, mas pessoalmente é nota 10.", s: 4 },
            { n: "Roberto", loc: "SP - Augusta", t: "Pedi com interação. Foi uma troca muito gostosa.", s: 5 },
            { n: "Fabio", loc: "Rio Preto", t: "Saiu todo o peso das costas. Recomendo pra quem busca paz.", s: 5 },
            { n: "Junior", loc: "SP - Moema", t: "Me senti leve. Energia ótima.", s: 5 },
            { n: "Paulo", loc: "Votuporanga", t: "Muito bom, só o Uber que ficou caro pra vir.", s: 4 },
            { n: "M. (Sigilo)", loc: "SP - Jardins", t: "Finalização intensa, perdi as forças. O cara é bom.", s: 5 }
        ],
        reviews_title: isPT ? "+50 Avaliações 5 Estrelas" : "+50 5-Star Reviews",
        currency: currency,
        text: {
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Escolha sua experiência e agende seu momento de relaxamento." : "Choose your experience and schedule your relaxation moment.",
            loading: isPT ? "Carregando..." : "Loading...",
            level_label: isPT ? "Nível de Fidelidade" : "Loyalty Level",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para ganhar R$${reward} de desconto!` : `${needed} XP left to get $${reward} off!`,
            tab_packs: isPT ? "Pacotes" : "Packs",
            tab_single: isPT ? "Sessões" : "Sessions",
            details_label: isPT ? "O que inclui" : "What's included",
            empty_date: isPT ? "Selecione uma data acima" : "Select a date above",
            empty_slots: isPT ? "Nenhum horário disponível para esta data." : "No slots available for this date.",
            location_title: isPT ? "Onde será o atendimento?" : "Where will it be?",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Unit",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Quarto" : "Room",
            motel_note: isPT ? "O atendimento em motéis é realizado com total discrição. O valor da entrada é por conta do cliente." : "Motel service is discreet. Entry fee is paid by the client.",
            extras_title: isPT ? "Extras:" : "Extras:",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            whatsapp_btn: isPT ? "Finalizar no WhatsApp" : "Finish on WhatsApp",
            install_app: isPT ? "Instalar App" : "Install App",
            install_desc: isPT ? "Adicione à sua tela inicial para acesso rápido." : "Add to home screen for quick access.",
            terms_title: isPT ? "Termos de Uso" : "Terms of Use",
            terms_link: isPT ? "Li e aceito os termos" : "I accept the terms",
            terms_body: isPT ? [
                "1. O atendimento é realizado com total respeito e profissionalismo.",
                "2. Cancelamentos devem ser feitos com 2h de antecedência.",
                "3. O valor do transporte é calculado à parte.",
                "4. Pagamento via Pix ou Cartão no início da sessão."
            ] : [
                "1. Service is professional and respectful.",
                "2. Cancellations must be made 2h in advance.",
                "3. Transport fee is calculated separately.",
                "4. Payment via Pix or Card at the start."
            ],
            terms_btn: isPT ? "Entendi" : "Got it",
            popup_level_title: isPT ? "Subiu de Nível!" : "Level Up!",
            popup_level_msg: isPT ? "Você ganhou um novo cupom de desconto." : "You've earned a new discount coupon.",
            popup_welcome_title: isPT ? "Bem-vindo!" : "Welcome!",
            popup_welcome_msg: isPT ? "Use o código abaixo na sua primeira reserva." : "Use the code below for your first booking.",
            popup_btn_coupon: isPT ? "Resgatar Cupom" : "Redeem Coupon",
            toast_select_item: isPT ? "Selecione um serviço primeiro!" : "Select a service first!",
            toast_select_date: isPT ? "Selecione data e horário!" : "Select date and time!",
            toast_fill_name: isPT ? "Por favor, informe seu nome." : "Please inform your name.",
            toast_fill_addr: isPT ? "Preencha o endereço completo." : "Fill full address.",
            toast_fill_hotel: isPT ? "Informe o nome do hotel." : "Inform hotel name.",
            toast_select_pay: isPT ? "Selecione a forma de pagamento." : "Select payment method.",
            toast_accept_terms: isPT ? "Você precisa aceitar os termos." : "You must accept terms.",
            toast_coupon_used: isPT ? "Este cupom já foi usado." : "Coupon already used.",
            toast_coupon_success: isPT ? "Cupom aplicado com sucesso!" : "Coupon applied!",
            toast_coupon_error: isPT ? "Cupom inválido." : "Invalid coupon.",
            zap: {
                intro: isPT ? "Olá Thalyson! Gostaria de solicitar um agendamento." : "Hi Thalyson! I'd like to schedule a session.",
                order_title: isPT ? "PEDIDO DE RESERVA" : "BOOKING REQUEST",
                client: isPT ? "👤 *Cliente:* " : "👤 *Client:* ",
                service: isPT ? "💆‍♂️ *Serviço:* " : "💆‍♂️ *Service:* ",
                date: isPT ? "📅 *Data:* " : "📅 *Date:* ",
                extra_title: isPT ? "➕ *Adicionais:* " : "➕ *Extras:* ",
                location: isPT ? "📍 *Localização:* " : "📍 *Location:* ",
                house: isPT ? "Residência" : "Residence",
                motel: isPT ? "Motel" : "Motel",
                hotel: isPT ? "Hotel" : "Hotel",
                value: isPT ? "💰 *Valor Total:* " : "💰 *Total Value:* ",
                payment: isPT ? "💳 *Pagamento:* " : "💳 *Payment:* ",
                uber_label: isPT ? "🚗 *Transporte:* " : "🚗 *Transport:* ",
                uber_text: isPT ? "A combinar (Uber)" : "To be arranged (Uber)",
                xp_status: isPT ? "⚜️ *STATUS FIDELIDADE*" : "⚜️ *LOYALTY STATUS*",
                xp_gain: isPT ? "Ganho estimado:" : "Estimated gain:",
                xp_level: isPT ? "Nível atual:" : "Current level:",
                wait: isPT ? "Aguardando sua confirmação! 🙏" : "Waiting for your confirmation! 🙏",
                browser_warn: isPT ? "Abra no navegador para melhor experiência" : "Open in browser for best experience"
            }
        }
    };
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs');
  const [isClient, setIsClient] = useState(false);

  const [termsOpen, setTermsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [toasts, setToasts] = useState([]);

  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null);

  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({
      name: '', xp: 0, coupons: [], usedCoupons: [],
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' },
      hasSeenWelcome: false,
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home',
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  const addToast = (msg, type = "success") => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            if(parsed.user) {
                setUser(prev => ({ ...prev, ...parsed.user, coupons: parsed.user.coupons || [], usedCoupons: parsed.user.usedCoupons || [] }));
            }
            if(parsed.bookingDraft && parsed.bookingDraft.item) {
                const draftDate = new Date(parsed.bookingDraft.date);
                if(draftDate > new Date()) {
                    setBooking(parsed.bookingDraft);
                    if(parsed.step) setStep(parsed.step);
                }
            }
        }
    } catch (e) {
        console.error("Erro ao carregar dados:", e);
        localStorage.removeItem(CONFIG.STORAGE_KEY);
    }
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1000);
  }, [isClient]);

  useEffect(() => {
      if(isClient && dataLoaded) {
          const saveData = { user, bookingDraft: step < 4 ? booking : null, step: step < 4 ? step : 0 };
          localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(saveData));
      }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
      if(isClient && dataLoaded && !user.hasSeenWelcome && !welcomePopup) {
          const timer = setTimeout(() => setWelcomePopup(true), 2500);
          return () => clearTimeout(timer);
      }
  }, [isClient, dataLoaded, user.hasSeenWelcome]);

  const generateDates = useMemo(() => {
      const dates = [];
      for (let i = 0; i < 14; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          dates.push(d);
      }
      return dates;
  }, []);

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = [];
      for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
        slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      }
      const now = new Date();
      const selectedDate = new Date(booking.date);
      if (isNaN(selectedDate.getTime())) return [];
      const isToday = selectedDate.getDate() === now.getDate() &&
                      selectedDate.getMonth() === now.getMonth() &&
                      selectedDate.getFullYear() === now.getFullYear();
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
            if(extData) {
                const extraPrice = booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
                sub += extraPrice;
            }
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras]);

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

  const generateSecurityHash = (price, date, itemName) => {
    const raw = `${price}-${date}-${itemName}-${CONFIG.SECRET_TOKEN}`;
    return btoa(raw).substring(0, 8).toUpperCase();
  };

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const xpGain = estimatedXP;
    const currentLevelTitle = DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title;
    const securityHash = generateSecurityHash(f.total, dateStr, booking.item?.id);

    let serviceTitle = booking.item?.title;
    if (booking.type !== 'single' && booking.item?.desc) {
       const descClean = booking.item.desc.replace(/^(Contém:|Contains:)\s*/i, '');
       serviceTitle += `\n📦 *${lang === 'pt' ? 'Inclui' : 'Includes'}:* ${descClean}`;
    }

    let locTxt = "";
    let mapQuery = "";
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${T.zap.house}\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${T.zap.motel}\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }

    const extrasList = Object.keys(booking.extras)
        .filter(k => booking.extras[k])
        .map(k => {
            const ext = DATA.extras.find(e => e.id === k);
            if (!ext) return null;
            let price = booking.type !== 'single' ? Math.floor(ext.price * 0.8) : ext.price;
            return `✅ ${ext.label} (+ ${DATA.currency} ${price})`;
        })
        .filter(Boolean)
        .join('\n');

    const msg = `
${T.zap.intro}

${T.zap.order_title} 🔐 #${securityHash}
──────────────────────

${T.zap.client} ${user.name}
${T.zap.service} ${serviceTitle}
${T.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${T.zap.extra_title}\n${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────

${T.zap.value}
Total: ${DATA.currency} ${f.total},00
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

💰 *CHAVE PIX:* ${CONFIG.PIX_KEY}
📸 *INSTAGRAM:* ${CONFIG.INSTAGRAM_URL}

${T.zap.xp_status}
⚜️ ${T.zap.xp_gain} +${xpGain} XP
⚜️ ${T.zap.xp_level} ${currentLevelTitle}

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
      const code = couponInput.toUpperCase().trim();
      if (user.usedCoupons.includes(code)) {
          addToast(T.toast_coupon_used, "error");
          return;
      }
      const validManualCodes = { 'WELCOME10': 10, 'THALYSON10': 10, 'VIP15': 15, 'PROMO30': 30, 'SUPER50': 50 };
      const inventoryCoupon = user.coupons.find(c => c.code === code);
      if (inventoryCoupon) {
          setBooking(b => ({...b, appliedCoupon: inventoryCoupon}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else if (validManualCodes[code]) {
          const newCoupon = { id: code, val: validManualCodes[code], title: `🎟️ ${code}`, code: code };
          setBooking(b => ({...b, appliedCoupon: newCoupon}));
          addToast(T.toast_coupon_success, "success");
          setCouponInput('');
      } else {
          addToast(T.toast_coupon_error, "error");
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    let updatedHistory = Array.isArray(user.usedCoupons) ? [...user.usedCoupons] : [];
    if (booking.appliedCoupon) {
        if(!updatedHistory.includes(booking.appliedCoupon.code)) {
            updatedHistory.push(booking.appliedCoupon.code);
        }
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
    setUser(prev => ({
        ...prev,
        xp: newXP,
        coupons: updatedCoupons,
        usedCoupons: updatedHistory,
        ordersCount: prev.ordersCount + 1
    }));
    if (typeof window !== 'undefined') { window.open(generateWhatsAppLink(), '_blank'); }
    setBooking(b => ({...b, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}));
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user: {...user, xp: newXP}, bookingDraft: null, step: 0 }));
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

  const handleSelectItem = (type, item) => {
      setBooking(b => ({...b, type, item, extras: {}}));
      addToast(item.title, "success");
  };

  const handleShare = () => {
      if (navigator.share) {
          navigator.share({ title: 'Thalyson Massagens', url: window.location.href });
      } else {
          navigator.clipboard.writeText(window.location.href);
          addToast("Link copiado!", "success");
      }
  };

  const scrollDates = (dir) => {
      if (dateScrollRef.current) {
          const amt = dir === 'left' ? -200 : 200;
          dateScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
      }
  };

  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 font-['Poppins']" />;

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 font-['Poppins'] ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative mb-12">
            <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-2xl relative z-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30 animate-bounce-slow">TM</div>
        </div>
        <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-slide-in" style={{width: '100%', animationDuration: '2s'}}></div>
            </div>
            <div className="text-xs font-bold tracking-[0.3em] opacity-50 uppercase flex items-center gap-2">
                <span className="animate-pulse">{T.loading}</span>
            </div>
        </div>
      </div>
  );

  return (
    <div className={`h-[100dvh] w-full font-['Poppins'] flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 selection:text-blue-500' : 'bg-slate-50 text-slate-800 selection:bg-blue-200 selection:text-blue-800'}`}>
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] blur-[120px] rounded-full animate-pulse-slow ${isDark ? 'bg-blue-600/5' : 'bg-blue-200/40'}`}></div>
          <div className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] blur-[120px] rounded-full animate-pulse-slow ${isDark ? 'bg-indigo-600/5' : 'bg-indigo-200/40'}`}></div>
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-down ${t.type === 'success' ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800') : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-200 text-red-700')}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      <header className="h-20 px-6 md:px-12 flex items-center justify-between z-20 shrink-0 bg-transparent relative max-w-5xl mx-auto w-full">
        <div className="flex flex-col justify-center">
            <span className={`font-bold text-xl tracking-wide block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</span>
            <span className="text-[9px] uppercase font-bold text-blue-500 tracking-[0.1em] mt-1 flex items-center gap-1"><Star size={10} fill="#2563eb"/> +59 Clientes Atendidos</span>
        </div>
        <div className="flex gap-2">
            <button onClick={()=>setSettingsOpen(true)} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Settings size={18}/></button>
            <button onClick={handleShare} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Share2 size={18}/></button>
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-blue-500 hover:text-blue-600 shadow-sm'}`}>{isDark ? <Moon size={18}/> : <Sun size={18}/>}</button>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-32 pt-6 scroll-smooth relative z-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-12">
          {step === 0 && (
            <div className="animate-fade-in space-y-12">
              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="animate-slide-up delay-100">
                    <div className="flex items-end gap-3 mb-4">
                        <h1 className={`text-4xl md:text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome} <span className="font-bold text-blue-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span></h1>
                    </div>
                    <p className={`text-base font-light leading-relaxed max-w-lg ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{T.subtitle}</p>
                    <div className="mt-6 flex items-center gap-2 p-3 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-500 text-xs font-medium w-fit">
                        <ExternalLink size={14} />
                        <span>{T.zap.browser_warn}</span>
                    </div>
                </div>
                <div className={`hidden md:block animate-slide-up delay-200 relative overflow-hidden rounded-[2.5rem] p-10 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-blue-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-5">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20' : 'bg-blue-500 text-white shadow-blue-200'}`}>
                                <Trophy size={32} />
                            </div>
                            <div>
                                <span className={`text-xs uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-3xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-4xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-xs font-bold uppercase text-blue-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`flex justify-between text-xs font-bold mb-3 uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            <span>Progresso</span>
                            <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_#2563eb]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                        <p className={`text-xs mt-4 text-center font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
                </div>
              </div>

              <div className={`md:hidden animate-slide-up delay-200 relative mt-4 overflow-hidden rounded-[2rem] p-6 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-blue-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20' : 'bg-blue-500 text-white shadow-blue-200'}`}>
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{width: `${getCurrentLevelProgress()}%`}}></div>
                        </div>
                    </div>
              </div>

              <div className="flex p-1.5 rounded-2xl bg-zinc-900/50 border border-white/5 max-w-md mx-auto">
                  <button onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Package size={16} className={activeTab === 'packs' ? 'animate-pulse' : ''}/> {T.tab_packs}
                  </button>
                  <button onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <LayoutList size={16}/> {T.tab_single}
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeTab === 'single' ? DATA.services.map((s, idx) => (
                    <div key={s.id} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                         <Card active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)} isDark={isDark}>
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-zinc-800 text-blue-500' : 'bg-blue-50 text-blue-600'}`}><s.icon size={28} /></div>
                                    <div className="text-right">
                                        <span className="text-blue-500 font-black text-3xl block">{DATA.currency} {s.price}</span>
                                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1.5 mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Clock size={14}/> {s.min} min</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">{s.tag}</span>
                                    <h3 className={`text-2xl font-bold mt-4 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                                </div>
                            </div>
                            <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 font-bold mb-3 text-blue-500 uppercase tracking-wider text-[10px]"><Info size={14}/> {T.details_label}</div>
                                <div className={`text-xs leading-relaxed space-y-1 font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                                    {s.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                            </div>
                         </Card>
                    </div>
                )) : DATA.plans.map((plan, idx) => (
                    <div key={plan.id} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                         <Card active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)} isDark={isDark} className="border-blue-500/20">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-500 text-white'}`}><plan.icon size={28} /></div>
                                    <div className="text-right">
                                        <span className={`text-xs line-through block opacity-50 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>{DATA.currency} {plan.fullPrice}</span>
                                        <span className="text-blue-500 font-black text-3xl block">{DATA.currency} {plan.price}</span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Economize {DATA.currency} {plan.savings}</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">{plan.tag}</span>
                                    <h3 className={`text-2xl font-bold mt-4 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.title}</h3>
                                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{plan.desc}</p>
                                </div>
                            </div>
                            <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 font-bold mb-3 text-blue-500 uppercase tracking-wider text-[10px]"><Info size={14}/> {T.details_label}</div>
                                <div className={`text-xs leading-relaxed space-y-1 font-light ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                                    {plan.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                            </div>
                         </Card>
                    </div>
                ))}
              </div>

              <ReviewsCarousel reviews={DATA.reviews} isDark={isDark} title={DATA.reviews_title} />

              <div className="max-w-3xl mx-auto py-20">
                  <h3 className={`text-3xl font-light text-center mb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dúvidas Frequentes</h3>
                  <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      {DATA.faq.map((item, idx) => (
                          <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />
                      ))}
                  </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-slide-in space-y-12">
              <h2 className={`text-3xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quando será sua sessão?</h2>
              <div className="relative">
                  <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><ChevronLeft size={20} /></button>
                  <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-4 snap-x">
                        {generateDates.map((d, idx) => {
                          const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                          let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                          const monthName = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {month:'short'}).replace('.','');
                          return (
                            <div key={idx} className="snap-center">
                                <button onClick={() => setBooking(b => ({...b, date: d.toISOString(), time: null}))} className={`w-24 h-32 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2 ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30 scale-110' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{monthName}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                                    <span className="text-3xl font-bold">{d.getDate()}</span>
                                    {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
                                </button>
                            </div>
                          )
                        })}
                  </div>
                  <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><ChevronRight size={20} /></button>
              </div>
              {!booking.date && (<div className={`text-center py-16 opacity-30 border border-dashed rounded-[2rem] mx-2 ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-400'}`}><Calendar size={40} className="mx-auto mb-4"/><p className="text-xs font-bold uppercase tracking-wider">{T.empty_date}</p></div>)}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in">
                   {generateTimeSlots.map((t, idx) => {
                       const isLastSpot = idx === generateTimeSlots.length - 1 || idx === 2;
                       return (
                           <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-4 rounded-xl text-sm font-semibold border transition-all active:scale-95 duration-200 relative overflow-hidden group animate-scale-in ${booking.time === t ? (isDark ? 'bg-zinc-100 text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-slate-900 text-white border-slate-900 shadow-xl') : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800')}`} style={{animationDelay: `${idx * 50}ms`}}>
                               {t}
                               {isLastSpot && <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">🔥</span>}
                           </button>
                       )
                   })}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className={`text-center py-12 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}><p className="text-sm font-medium">{T.empty_slots}</p></div>)}
            </div>
          )}

          {step === 2 && (
             <div className="animate-slide-in space-y-12">
               <h2 className={`text-3xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
               <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                      <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-6 rounded-2xl text-[10px] md:text-xs font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-blue-600/10 border-blue-500/50 text-blue-500 shadow-[0_0_20px_-5px_rgba(37,99,235,0.3)] scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700')}`}>
                          <x.i size={24} strokeWidth={2}/> {x.l}
                      </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder={lang === 'pt' ? "Seu Nome/Apelido" : "Your Name/Nickname"} />
                      {booking.locationType === 'home' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="grid grid-cols-[1fr_120px] gap-4">
                                 <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder={lang === 'pt' ? "Rua" : "Street"} />
                                 <InputField isDark={isDark} label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder={lang === 'pt' ? "Nº" : "No."} />
                              </div>
                              <InputField isDark={isDark} label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                              <div className="grid grid-cols-2 gap-4">
                                 <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                                 <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={lang === 'pt' ? "Comp" : "Unit/Apt"} />
                              </div>
                          </div>
                      )}
                      {booking.locationType === 'hotel' && (
                          <div className="space-y-6 animate-fade-in">
                             <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} icon={Building} placeholder={lang === 'pt' ? "Nome do Hotel" : "Hotel Name"} />
                             <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                             <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} icon={Lock} placeholder={lang === 'pt' ? "Quarto" : "Room"} />
                          </div>
                      )}
                      {booking.locationType === 'motel' && (
                          <div className={`p-8 rounded-2xl border border-dashed text-center ${isDark ? 'border-zinc-700 bg-zinc-900/30' : 'border-slate-300 bg-slate-50'}`}>
                             <Smartphone size={28} className={`mx-auto mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}/>
                             <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.motel_note}</p>
                          </div>
                      )}
                   </div>
                   <div className={`pt-0 md:pl-10 md:border-l ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                      <h3 className={`text-xs font-bold uppercase mb-6 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{booking.type !== 'single' ? T.extras_title.replace('Extras:', 'Adicionais (20% OFF):') : T.extras_title}</h3>
                      <div className="space-y-4">
                         {DATA.extras.map((ex, idx) => {
                            const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                               <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-slide-in ${booking.extras[ex.id] ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_-5px_rgba(37,99,235,0.2)]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`} style={{animationDelay: `${idx * 100}ms`}}>
                                 <div className="flex items-center gap-4">
                                     <div className={`p-2.5 rounded-xl transition-colors ${booking.extras[ex.id] ? 'text-blue-500' : (isDark ? 'text-zinc-600' : 'text-slate-500')}`}><ex.icon size={20}/></div>
                                     <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-blue-500' : (isDark ? 'text-zinc-200' : 'text-slate-700')}`}>{ex.label}</p><p className={`text-xs font-medium pt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p></div>
                                 </div>
                                 <div className="text-right">
                                    {booking.type !== 'single' && (<span className={`text-[10px] line-through block ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{DATA.currency} {ex.price}</span>)}
                                    <span className={`text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-xl inline-block ${booking.extras[ex.id] ? 'bg-blue-500/20 text-blue-500' : (isDark ? 'text-zinc-500 bg-zinc-800' : 'text-slate-500 bg-slate-100')}`}>+ {DATA.currency} {price}</span>
                                 </div>
                               </div>
                            )
                         })}
                      </div>
                   </div>
               </div>
             </div>
          )}

          {step === 3 && (
             <div className="animate-slide-in pb-16 space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
                    <div className="relative">
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                           <h3 className={`text-xl font-light mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Resumo da Reserva</h3>
                           <div className="space-y-6">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Serviço Selecionado</p>
                                      <h4 className={`text-lg font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{booking.item?.title}</h4>
                                      <p className="text-xs text-blue-500 font-medium flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full w-fit border border-blue-500/10 mt-3"><Calendar size={14}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                                  </div>
                                  <span className="text-xl font-bold text-blue-500">{DATA.currency} {booking.item?.price}</span>
                              </div>
                              {Object.keys(booking.extras).filter(k=>booking.extras[k]).length > 0 && (
                                  <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Adicionais</p>
                                      <div className="space-y-3">
                                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
                                              const ex = DATA.extras.find(e=>e.id===k);
                                              const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                                              return (
                                                  <div key={k} className="flex justify-between items-center text-sm">
                                                      <span className={isDark ? 'text-zinc-400' : 'text-slate-600'}>{ex.label}</span>
                                                      <span className="font-bold text-blue-500">+ {DATA.currency} {price}</span>
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                              )}
                              <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Subtotal</span>
                                      <span className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{DATA.currency} {financials.sub}</span>
                                  </div>
                                  {financials.disc > 0 && (
                                      <div className="flex justify-between items-center mb-2 text-emerald-500">
                                          <span className="text-sm">Desconto ({booking.appliedCoupon?.title})</span>
                                          <span className="text-sm font-bold">- {DATA.currency} {financials.disc}</span>
                                      </div>
                                  )}
                                  <div className="flex justify-between items-center pt-4">
                                      <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</span>
                                      <div className="text-right">
                                          <span className="text-3xl font-black text-blue-500">{DATA.currency} {financials.total},00</span>
                                          <span className="text-xs font-bold text-blue-500 flex items-center justify-end gap-2 mt-2"><Sparkles size={14}/> +{estimatedXP} XP</span>
                                      </div>
                                  </div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-8">
                           <SmartTimer isDark={isDark} />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <h3 className={`text-xl font-light mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Cupom de Desconto</h3>
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input type="text" value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder="Código" className={`w-full h-14 pl-5 pr-12 rounded-2xl outline-none text-sm font-bold uppercase tracking-widest border-2 transition-all ${isDark ? 'bg-zinc-950 border-zinc-800 text-white focus:border-blue-500' : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-blue-500'}`} />
                                    <Tag size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}/>
                                </div>
                                <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
                            </div>
                        </div>
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <h3 className={`text-xl font-light mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pagamento</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {[{id:'pix', l:'Pix (Imediato)', i:QrCode}, {id:'card', l:'Cartão de Crédito', i:CreditCard}].map(p => (
                                    <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${booking.payment === p.id ? 'bg-blue-600/10 border-blue-500 text-blue-500' : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300')}`}>
                                        <p.i size={24} />
                                        <span className="text-sm font-bold uppercase tracking-wider">{p.l}</span>
                                        {booking.payment === p.id && <Check size={20} className="ml-auto text-blue-500" strokeWidth={3}/>}
                                    </button>
                                ))}
                            </div>
                            {booking.payment === 'pix' && (
                                <div className="mt-6 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 animate-fade-in">
                                    <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3 text-center">Chave Pix para Cópia</p>
                                    <div className="flex gap-2">
                                        <input readOnly value={CONFIG.PIX_KEY} className={`w-full text-sm font-mono text-center rounded-xl border px-3 py-3 ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-600'}`} />
                                        <button onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); addToast("Chave Pix copiada!", "success")}} className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Copy size={20}/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex items-start gap-4 px-4">
                            <div onClick={()=>setBooking(b=>({...b, termsAccepted: !b.termsAccepted}))} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : (isDark ? 'border-zinc-700' : 'border-slate-300')}`}>
                                {booking.termsAccepted && <Check size={14} strokeWidth={4}/>}
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className={`${isDark ? 'text-zinc-500' : 'text-slate-500'} shrink-0 mt-0.5`} size={20}/>
                                <div><h4 className={`text-sm font-bold mb-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.terms_title}</h4><p className={`text-xs cursor-pointer hover:text-blue-500 transition-colors underline ${isDark ? 'text-zinc-500' : 'text-slate-500'}`} onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {step === 4 && (
             <div className="animate-scale-in flex flex-col items-center justify-center py-20 text-center space-y-8">
                <div className="relative">
                    <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-bounce-slow relative z-10">
                        <Check size={56} className="text-white" strokeWidth={3}/>
                    </div>
                    <div className="absolute inset-0 bg-blue-500 blur-[60px] opacity-20 animate-pulse"></div>
                </div>
                <div>
                    <h2 className={`text-4xl font-light mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quase lá!</h2>
                    <p className={`text-base max-w-sm mx-auto font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>Sua reserva foi pré-confirmada. Agora finalize o envio dos dados pelo WhatsApp para garantir seu horário.</p>
                </div>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <div className="flex gap-3">
                        <Button variant="secondary" size="icon" onClick={() => { navigator.clipboard.writeText(CONFIG.PIX_KEY); addToast("Chave Pix copiada!", "success"); }} icon={Copy} />
                        <Button variant="instagram" size="icon" onClick={() => window.open(CONFIG.INSTAGRAM_URL, '_blank')} icon={Instagram} />
                        <Button variant="outline" full onClick={() => setStep(0)} icon={Home}>Início</Button>
                    </div>
                    <Button variant="whatsapp" full size="lg" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                </div>
             </div>
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 w-full z-40 px-6 pb-safe pt-6 pointer-events-none">
         <div className="max-w-5xl mx-auto flex justify-between items-end pointer-events-auto">
             <div className="flex gap-3">
                 {step > 0 && step < 4 && (
                     <>
                         <button onClick={() => setStep(0)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}><Home size={20}/></button>
                         <button onClick={() => setStep(step - 1)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}><ChevronLeft size={20}/></button>
                     </>
                 )}
             </div>
             {step < 4 && (
                 <button onClick={handleNextStep} className={`h-20 px-10 rounded-[2rem] bg-blue-600 text-white font-bold text-lg flex items-center gap-4 shadow-2xl shadow-blue-600/40 transition-all active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}>
                     {step === 3 ? 'Finalizar' : 'Próximo'}
                     {!booking.item && <ArrowRight size={20} strokeWidth={2.5}/>}
                 </button>
             )}
         </div>
      </footer>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${settingsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${settingsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setSettingsOpen(false)}></div>
         <div className={`relative w-full max-w-sm border rounded-[2rem] p-8 transform transition-transform duration-500 shadow-2xl ${settingsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-4"><Download size={32} className="text-blue-500"/></div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.install_app}</h3>
                <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.install_desc}</p>
            </div>
            <div className={`p-4 rounded-xl text-xs mb-6 leading-relaxed ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                1. Toque no ícone de compartilhamento do navegador.<br/>
                2. Selecione "Adicionar à Tela de Início".
            </div>
            <Button full onClick={()=>setSettingsOpen(false)}>Ok</Button>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-lg border rounded-[2rem] p-8 max-h-[85vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-8"><h3 className={`text-xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className={`p-3 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}><X size={20}/></button></div>
            <div className="space-y-5">
                {T.terms_body.map((t,i)=>(<div key={i} className={`flex gap-5 p-5 rounded-2xl border ${isDark ? 'bg-zinc-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}><span className="font-bold text-blue-500 text-2xl opacity-50">{i+1}</span><p className={`text-sm leading-relaxed pt-1.5 font-light ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-10 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-blue-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 blur-[80px] opacity-20"></div></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 animate-bounce-slow"><Trophy size={40} className="text-white" /></div>
                <h2 className="text-3xl font-light text-white mb-3">{T.popup_level_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-10">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-10 rounded-[2.5rem] text-center max-w-md w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-24 h-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/5 rotate-3"><Gift size={40} className="text-blue-500" /></div>
                <h2 className="text-2xl font-light text-white mb-4">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-5 rounded-2xl border border-dashed border-zinc-800 mb-8"><p className="text-xs uppercase font-bold text-zinc-500 mb-2">Seu Código:</p><p className="text-2xl font-mono font-bold text-blue-500 tracking-widest">WELCOME10</p></div>
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

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.8s ease-out}.animate-slide-in{animation:slideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-slide-up{animation:slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.4s ease-out}.animate-pulse-slow{animation:pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite}.animate-spin-slow{animation:spin 3s linear infinite}.pb-safe{padding-bottom:env(safe-area-inset-bottom,32px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
