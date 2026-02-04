import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v38.0 - TITAN BLUE EDITION (FULL FEATURED)
 * ==================================================================================
 * 1. TEMA: Blue Sapphire (Confiança & Higiene).
 * 2. LÓGICA: Fast Track (11:55 libera 12:00).
 * 3. PAGAMENTO: Pix Copia e Cola integrado.
 * 4. DADOS: Base de dados completa restaurada (Reviews, Textos, Termos).
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v38_titan', 
  PIX_KEY: "62922530000144", // <--- COLOQUE SUA CHAVE AQUI
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_2026_SECURE',
  START_HOUR: 9,
  END_HOUR: 20
};

// ==================================================================================
// 1. DESIGN SYSTEM & COMPONENTS
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-medium tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.96] hover:brightness-110 shadow-lg hover:shadow-xl";
  
  const variants = {
    // BLUE THEME
    primary: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/30 border border-sky-400/20",
    secondary: "bg-white/5 backdrop-blur-md border border-white/10 text-zinc-200 hover:bg-white/10 hover:border-white/20",
    whatsapp: "bg-[#25D366] text-white shadow-green-500/20 border border-green-400/20",
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

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-2 w-full group">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest ml-1 transition-colors ${isDark ? 'text-zinc-500 group-focus-within:text-sky-500' : 'text-slate-500 group-focus-within:text-blue-600'}`}>{label}</label>}
    <div className="relative">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${isDark ? 'text-zinc-500 group-focus-within:text-sky-500' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{Icon && <Icon size={18} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-12 pr-4 py-4 rounded-2xl outline-none text-sm font-medium transition-all duration-300 
        ${isDark 
            ? 'bg-zinc-900/50 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 focus:bg-zinc-900 focus:border-sky-500/30' 
            : 'bg-white border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-md'} 
        border focus:shadow-[0_0_20px_-5px_rgba(14,165,233,0.1)] ${error ? 'border-red-500/50 text-red-500' : ''}`} 
      />
    </div>
    {error && <p className="text-red-500 text-[10px] ml-2 font-bold animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false, isDark = true }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-[2rem] transition-all duration-500 overflow-hidden h-full flex flex-col group
    ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-1' : ''} 
    ${active 
        ? 'bg-sky-500/10 border border-sky-500/30 shadow-[0_0_30px_-10px_rgba(14,165,233,0.2)]' 
        : (isDark ? 'bg-zinc-900/40 backdrop-blur-xl border border-white/5 hover:border-sky-500/20 hover:bg-zinc-900/60' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-500/30')} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-tr from-sky-500/5 to-transparent pointer-events-none" />}
    {children}
  </div>
);

const Confetti = ({ active }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 4 + 2,
      h: Math.random() * 6 + 4,
      color: ['#0ea5e9', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 3)], 
      speed: Math.random() * 4 + 3,
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

const AutoScrollReviews = ({ reviews, isDark }) => {
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
          scrollContainer.scrollLeft += 0.6; 
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };
    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const loopReviews = [...reviews, ...reviews, ...reviews];

  return (
    <div className={`w-full overflow-hidden py-8 border-y mb-10 backdrop-blur-sm ${isDark ? 'bg-zinc-950/30 border-white/5' : 'bg-slate-50/80 border-slate-200'}`}>
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto scrollbar-hide px-6"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setTimeout(() => setIsPaused(false), 2000)}
      >
        {loopReviews.map((r, i) => (
            <div key={`${i}-${r.n}`} className={`flex-shrink-0 w-80 border p-6 rounded-3xl transition-all duration-500 hover:scale-[1.02] cursor-grab active:cursor-grabbing select-none ${isDark ? 'bg-zinc-900/80 border-white/5 hover:border-sky-500/30' : 'bg-white border-slate-200 shadow-sm hover:border-blue-400'}`}>
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${isDark ? 'bg-zinc-800 text-zinc-300 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{r.n.charAt(0)}</div>
                    <div>
                      <span className={`text-sm font-bold block leading-none mb-0.5 ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{r.n}</span>
                      <span className="text-[10px] text-sky-500 uppercase font-bold tracking-wider">{r.loc}</span>
                    </div>
                 </div>
                 <div className="flex gap-0.5">
                   {[...Array(5)].map((_, k) => (
                     <Star key={k} size={12} fill={k < r.s ? "#0ea5e9" : "none"} className={k < r.s ? "text-sky-500" : (isDark ? "text-zinc-700" : "text-slate-300")} />
                   ))}
                 </div>
              </div>
              <p className={`text-xs leading-relaxed font-light italic ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>"{r.t}"</p>
            </div>
        ))}
      </div>
    </div>
  );
};

// ==================================================================================
// 2. DADOS (FULL TRANSLATION PT/EN) - RESTAURADOS COMPLETOS
// ==================================================================================

const getData = (lang) => {
    const isPT = lang === 'pt';
    
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Amigo" : "Bronze" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "Próximo" : "Silver" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Íntimo" : "Gold" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: isPT ? "TERAPÊUTICA" : "RELAX",
              title: isPT ? "Sessão Relaxante" : "Relaxing Session",
              desc: isPT ? "Alívio muscular e mental." : "Deep muscle and mental relief.",
              details: isPT ? `FOCO NO ALÍVIO:
• COMO É: Massagem profunda para tirar tensão e dores do corpo.
• LIMITE: **Não possui toques íntimos.** Apenas relaxamento muscular.
• IDEAL PARA: Quem está travado, cansado ou estressado.` 
              : `FOCUS ON RELIEF:
• WHAT IS IT: Deep massage to remove tension and body aches.
• LIMIT: **No intimate touches.** Just muscle relaxation.
• IDEAL FOR: Those who are stuck, tired or stressed.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: isPT ? "SENSORIAL" : "SENSORY",
              title: isPT ? "Terapia Sensitiva" : "Sensitive Therapy",
              desc: isPT ? "Um despertar suave do corpo." : "A gentle awakening of the body.",
              details: isPT ? `CONEXÃO SUTIL:
• INÍCIO: Começamos sempre com a relaxante para soltar o corpo.
• EVOLUÇÃO: Toques leves (ponta dos dedos) percorrendo a pele.
• FINAL: A massagem íntima faz parte. O gozar é permitido e natural.`
              : `SUBTLE CONNECTION:
• START: We always start with relaxing massage to loosen the body.
• EVOLUTION: Light touches (fingertips) running across the skin.
• END: Intimate massage is part of it. Climax is allowed and natural.`
            },
            { 
              id: 'mista', min: 60, price: 195, icon: Zap, tag: isPT ? "COMPLETA" : "COMPLETE",
              title: isPT ? "Experiência Mista" : "Mixed Experience",
              desc: isPT ? "A fusão do relaxamento com o intenso." : "The fusion of relaxation with intensity.",
              details: isPT ? `A ESCOLHA FAVORITA:
• INÍCIO: Relaxante muscular completa.
• MEIO: Evolui para sensitiva e contato corpo a corpo (Body).
• FINAL: Liberdade total. O clímax (gozar) é bem-vindo e faz parte do alívio.`
              : `FAVORITE CHOICE:
• START: Full muscle relaxation.
• MIDDLE: Evolves to sensitive and Body-to-Body contact.
• END: Total freedom. Climax is welcome and part of the relief.`
            }
        ],
        plans: [
            // UPDATE: Preços Psicológicos (Terminados em 7 ou 9)
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Relax (4x)" : "Relax Cycle (4x)", 
              price: 397, fullPrice: 500, savings: 103,
              desc: isPT ? "Contém: 4 Sessões Relaxantes (1h)." : "Contains: 4 Relax Sessions (1h).",
              details: isPT ? "Ideal para tratamento de dores crônicas ou estresse acumulado. As 4 sessões são focadas em relaxamento muscular (sem parte íntima)." 
                            : "Ideal for chronic pain treatment or accumulated stress. The 4 sessions focus on muscle relaxation (no intimate part).", 
              tag: isPT ? "ECONOMIA" : "SAVINGS", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Ciclo Completo (3x)" : "Full Cycle (3x)", 
              price: 487, fullPrice: 585, savings: 98,
              desc: isPT ? "Contém: 3 Sessões Mistas (1h)." : "Contains: 3 Mixed Sessions (1h).",
              details: isPT ? "A rotina perfeita. São 3 sessões da experiência completa (Mista), unindo relaxamento muscular e finalização."
                            : "The perfect routine. 3 sessions of the full experience (Mixed), combining muscle relaxation and finishing.", 
              tag: isPT ? "PREFERIDO" : "PREFERRED", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: isPT ? "Clube Mensal" : "Monthly Club", 
              price: 297, fullPrice: 390, savings: 93,
              desc: isPT ? "Mensalidade: 2 Sessões Mistas." : "Monthly: 2 Mixed Sessions.",
              details: isPT ? "Garanta seu bem-estar mensal. Inclui 2 Sessões Mistas por mês + Prioridade na escolha de horários."
                            : "Guarantee your monthly well-being. Includes 2 Mixed Sessions per month + Priority booking.", 
              tag: "VIP", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Para não ter pressa." : "No rush." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Interatividade" : "Interactivity", desc: isPT ? "Você toca também." : "You touch too." },
            { id: 'aroma', price: 5, icon: Wind, label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Essência no ar." : "Scent in the air." }
        ],
        reviews: [
            { n: "Bruno", loc: "SP - Bela Vista", t: isPT ? "Thalyson, quero dizer que sua massagem foi muito bem executada. Você primeiro conhece o corpo para ir executando o procedimento com muito cuidado e segurança. Recomendo muito." : "Thalyson, I want to say your massage was executed very well. You first get to know the body to perform the procedure with care and safety. Highly recommend.", s: 5 },
            { n: "Tiago", loc: "SP - Bela Vista", t: isPT ? "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida." : "Thalyson has surreal energy. The massage was perfect, best of my life.", s: 5 },
            { n: "Alan", loc: "SP - Bela Vista", t: isPT ? "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois, saí mais leve. Da pra ver que ele manda bem no que faz. Obrigado!" : "Liked Thalyson's massage a lot, felt very relaxed after, left lighter. You can see he knows what he's doing. Thanks!", s: 5 },
            { n: "Felipe", loc: "Londrina", t: isPT ? "Fiquei na dúvida por ser no sofá, mas foi surpreendentemente confortável." : "Was doubtful about the sofa, but it was surprisingly comfortable.", s: 5 },
            { n: "Ricardo M.", loc: "Rio Preto", t: isPT ? "Mão firme. Consegui relaxar de verdade, coisa que não fazia há tempos." : "Firm hand. Managed to truly relax, something I hadn't done in ages.", s: 5 },
            { n: "André L.", loc: "SP - Bela Vista", t: isPT ? "O toque dele é diferente. Me senti muito à vontade." : "His touch is different. Felt very comfortable.", s: 5 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: isPT ? "Gostei muito da energia, pessoa do bem. Recomendo." : "Liked the energy a lot, good person. Recommend.", s: 4 },
            { n: "Bruno", loc: "Jales", t: isPT ? "Veio até meu hotel, foi super discreto e educado. Salvou minha semana." : "Came to my hotel, super discreet and polite. Saved my week.", s: 5 },
            { n: "Carlos", loc: "Londrina", t: isPT ? "Massagem ótima, pena que estava muito quente no dia." : "Great massage, pity it was very hot that day.", s: 4 },
            { n: "Pedro", loc: "Rio Preto", t: isPT ? "A energia do corpo a corpo é intensa. Me senti renovado." : "The body-to-body energy is intense. Felt renewed.", s: 5 },
            { n: "Lucas", loc: "Santa Fé do Sul", t: isPT ? "Foi um pouco difícil achar vaga, mas a sessão compensou o estresse." : "Was hard to find parking, but the session made up for the stress.", s: 4 },
            { n: "Renato", loc: "SP - Centro", t: isPT ? "Muito respeitoso e profissional. A sensitiva é uma experiência única." : "Very respectful and professional. The sensitive therapy is a unique experience.", s: 5 },
            { n: "Vitor", loc: "Jales", t: isPT ? "Gostei, passou rápido demais. Na próxima pego mais tempo." : "Liked it, went too fast. Next time I'll take more time.", s: 4 },
            { n: "Eduardo", loc: "Londrina", t: isPT ? "Ele se adapta bem. Fizemos na cama e foi super tranquilo." : "He adapts well. We did it on the bed and it was super chill.", s: 5 },
            { n: "Caio", loc: "Rio Preto", t: isPT ? "A atenção que ele dá faz valer a pena." : "The attention he gives makes it worth it.", s: 5 },
            { n: "Breno", loc: "SP - Bela Vista", t: isPT ? "Relaxei e me diverti. Ótimo pra esquecer os problemas de SP." : "Relaxed and had fun. Great to forget SP problems.", s: 5 },
            { n: "Sérgio", loc: "Santa Fé do Sul", t: isPT ? "A massagem nos pés foi um detalhe que fez diferença." : "The foot massage was a detail that made a difference.", s: 5 },
            { n: "Matheus", loc: "Londrina", t: isPT ? "Demorou um pouquinho pra responder, mas pessoalmente é nota 10." : "Took a bit to reply, but in person is 10/10.", s: 4 },
            { n: "Roberto", loc: "SP - Augusta", t: isPT ? "Pedi com interação. Foi uma troca muito gostosa." : "Asked for interaction. It was a very nice exchange.", s: 5 },
            { n: "Fabio", loc: "Rio Preto", t: isPT ? "Saiu todo o peso das costas. Recomendo pra quem busca paz." : "All the weight off my back gone. Recommend for those seeking peace.", s: 5 },
            { n: "Junior", loc: "SP - Moema", t: isPT ? "Me senti leve. Energia ótima." : "Felt light. Great energy.", s: 5 },
            { n: "Paulo", loc: "Votuporanga", t: isPT ? "Muito bom, só o Uber que ficou caro pra vir." : "Very good, only the Uber was expensive to come.", s: 4 },
            { n: "M. (Sigilo)", loc: "SP - Jardins", t: isPT ? "Finalização intensa, perdi as forças. O cara é bom." : "Intense finish, lost my strength. The guy is good.", s: 5 }
        ],
        text: {
            loading: isPT ? "CARREGANDO..." : "LOADING...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Um convite para pausar e se reconectar com você." : "An invitation to pause and reconnect with yourself.",
            tab_single: isPT ? "Experiências" : "Experiences",
            tab_packs: isPT ? "Ciclos & Planos" : "Cycles & Plans",
            select_time_title: isPT ? "Data & Horário" : "Date & Time",
            date_sub: isPT ? "Selecione o momento ideal" : "Select the ideal moment",
            location_title: isPT ? "Localização" : "Location",
            input_name: isPT ? "Como prefere ser chamado?" : "How would you like to be called?",
            input_addr: isPT ? "Endereço do encontro" : "Meeting address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Unit/Apt",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Nº Quarto" : "Room #",
            motel_note: isPT ? "Motel/Suíte: A taxa do local fica por sua conta. O valor da minha sessão acertamos no WhatsApp." 
                             : "Motel/Suite: The venue fee is on you. We settle my session fee on WhatsApp.",
            pay_title: isPT ? "Forma de Pagamento" : "Payment Method",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Personalize seu momento" : "Customize your moment",
            coupon_title: isPT ? "Possui um convite?" : "Have an invite?",
            coupon_placeholder: isPT ? "Código do convite..." : "Invite code...",
            coupon_btn: isPT ? "Aplicar" : "Apply",
            total_label: isPT ? "Investimento" : "Investment",
            book_btn: isPT ? "CONFIRMAR INTERESSE" : "CONFIRM INTEREST",
            next_btn: isPT ? "Continuar" : "Next",
            uber_warning: isPT ? "*Deslocamento calculado no chat" : "*Uber calculated in chat",
            success_title: isPT ? "Tudo Certo!" : "All Set!",
            success_sub: isPT ? "Recebi seu pedido. Me chame no WhatsApp para combinarmos os detalhes finais." 
                              : "Request received. Please msg me on WhatsApp to finalize details.",
            whatsapp_btn: isPT ? "COMBINAR NO WHATSAPP" : "FINALIZE ON WHATSAPP",
            back_home: isPT ? "Voltar ao início" : "Back to home",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            empty_date: isPT ? "Selecione uma data" : "Select a date",
            empty_slots: isPT ? "Agenda cheia neste dia" : "Full schedule this day",
            details_label: isPT ? "SOBRE A EXPERIÊNCIA" : "ABOUT THE EXPERIENCE",
            popup_welcome_title: isPT ? "Boas-vindas" : "Welcome",
            popup_welcome_msg: isPT ? "Que bom ter você por aqui. Preparei um presente para nosso primeiro encontro." 
                                    : "Glad to have you here. I prepared a gift for our first meeting.",
            popup_level_title: isPT ? "Novo Ciclo" : "New Cycle",
            popup_level_msg: isPT ? "Sua presença constante desbloqueou novos carinhos." : "Your loyalty unlocked new treats.",
            popup_btn_coupon: isPT ? "Resgatar Presente" : "Redeem Gift",
            agree_terms: isPT ? "Estou ciente de como funciona." : "I am aware of how it works.",
            terms_body: isPT ? ["1. HIGIENE: Um banho prévio ajuda no nosso conforto.", "2. SIGILO: Sua privacidade é absoluta comigo.", "3. AMBIENTE: Adapto o atendimento ao seu espaço (Cama/Sofá) para seu total relaxamento.", "4. RESPEITO: Um espaço livre de julgamentos.", "5. SAÚDE: Confirmo que estou saudável e sem sintomas para receber a massagem."] 
                             : ["1. HYGIENE: A shower beforehand helps our comfort.", "2. PRIVACY: Your privacy is absolute with me.", "3. ENVIRONMENT: I adapt to your space (Bed/Sofa) for total relaxation.", "4. RESPECT: A judgment-free space.", "5. HEALTH: I confirm I am healthy and symptom-free to receive the massage."],
            terms_title: isPT ? "Alguns Combinados" : "Some Agreements",
            terms_link: isPT ? "Ler combinados importantes" : "Read important terms",
            terms_btn: isPT ? "Entendido" : "Understood",
            level_label: isPT ? "Fidelidade" : "Loyalty",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP -> R$ ${reward} de carinho` : `${needed} XP left -> R$ ${reward} treat`,
            
            toast_select_item: isPT ? "Selecione uma experiência primeiro." : "Select an experience first.",
            toast_select_date: isPT ? "Qual dia fica melhor para você?" : "Which day works best?",
            toast_fill_name: isPT ? "Gostaria de saber seu nome." : "I'd like to know your name.",
            toast_fill_addr: isPT ? "Preciso saber onde será." : "I need to know the location.",
            toast_fill_hotel: isPT ? "Qual o nome do hotel?" : "What is the hotel name?",
            toast_select_pay: isPT ? "Como prefere acertar?" : "How do you prefer to pay?",
            toast_accept_terms: isPT ? "Por favor, confirme os combinados." : "Please confirm the agreements.",
            toast_coupon_success: isPT ? "Convite aceito com sucesso!" : "Invite accepted successfully!",
            toast_coupon_error: isPT ? "Este código não foi encontrado." : "This code was not found.",
            toast_coupon_used: isPT ? "Você já usou este convite!" : "You have already used this invite!",

            zap: {
              intro: isPT ? "Oi Thalyson, tudo bem?" : "Hi Thalyson, how are you?",
              order_title: isPT ? "*SOLICITAÇÃO DE AGENDAMENTO*" : "*BOOKING REQUEST*",
              client: isPT ? "👤 *Nome:*" : "👤 *Name:*",
              service: isPT ? "💆‍♂️ *Experiência:*" : "💆‍♂️ *Experience:*",
              date: isPT ? "🗓️ *Data:*" : "🗓️ *Date:*",
              location: isPT ? "📍 *Local:*" : "📍 *Location:*",
              payment: isPT ? "💳 *Prefiro pagar via:*" : "💳 *Pref to pay via:*",
              value: isPT ? "💰 *INVESTIMENTO:*" : "💰 *INVESTMENT:*",
              xp_status: isPT ? "🏆 *Meu Nível:*" : "🏆 *My Level:*",
              xp_gain: isPT ? "XP Ganho:" : "XP Earned:",
              xp_level: isPT ? "Status:" : "Status:",
              xp_next: isPT ? "Próximo:" : "Next:",
              wait: isPT ? "Podemos confirmar o horário?" : "Can we confirm the time?",
              house: isPT ? "Casa / Apt" : "Home / Apt",
              hotel: "Hotel",
              motel: "Motel",
              extra_title: isPT ? "✨ *Adicionais (com desconto):*" : "✨ *Extras (discounted):*",
              uber_label: isPT ? "🚗 *Deslocamento:*" : "🚗 *Travel Fee:*",
              uber_text: isPT ? "A combinar no chat" : "To be agreed in chat",
              browser_warn: isPT ? "⚠️ Recomendo abrir no Chrome/Safari para salvar seus dados." : "⚠️ Recommend opening in Chrome/Safari to save your data."
            }
        }
    };
};

// ==================================================================================
// 3. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  // --- ESTADOS ---
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs');
  const [isClient, setIsClient] = useState(false);
  
  // MODAIS & UI
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [toasts, setToasts] = useState([]);
  
  // REFS
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null); 
  
  // MEMOIZED DADOS
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  // ESTADO DO USUÁRIO
  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], usedCoupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  // ESTADO DA RESERVA ATUAL
  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  // --- EFEITOS & LÓGICA ---

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
    
    if (isInApp && /android/i.test(ua)) {
      const url = window.location.href;
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      setTimeout(() => { window.location.href = intentUrl; }, 500);
    }
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
    setTimeout(() => setLoading(false), 1500); 
  }, [isClient]);

  useEffect(() => { 
      if(isClient && dataLoaded) { 
          const saveData = {
              user: user,
              bookingDraft: booking, 
              step: step 
          };
          try { 
              localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(saveData)); 
          } catch(e) {} 
      }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
     if(!loading && isClient && dataLoaded && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded]);

  useEffect(() => { 
      if(scrollRef.current) scrollRef.current.scrollTo(0,0); 
  }, [step]);


  // --- FUNÇÕES AUXILIARES ---

  const addToast = (msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Thalyson Massagens',
          text: lang === 'pt' ? 'Um convite para o seu relaxamento.' : 'An invitation to your relaxation.',
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast(lang === 'pt' ? "Link copiado!" : "Link copied!", "success");
    }
  };

  const scrollDates = (direction) => {
      if(dateScrollRef.current) {
          const scrollAmount = direction === 'left' ? -200 : 200;
          dateScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({ ...prev, type: type, item: item, extras: {}, payment: '', termsAccepted: false }));
  };

  const daysArray = useMemo(() => {
      const days = [];
      const today = new Date();
      for(let i=0; i<30; i++) { 
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          days.push(d);
      }
      return days;
  }, []);

  // AGENDAMENTO RÁPIDO (FAST TRACK)
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
              // Lógica: Se a hora do slot for maior que a hora atual, mostra.
              // Exemplo: São 11:55 (Hora 11). Slot 12:00 (Hora 12). 12 > 11 (True). Mostra.
              // Exemplo: São 12:05 (Hora 12). Slot 12:00 (Hora 12). 12 > 12 (False). Esconde.
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
    
    // Hash de segurança para validação
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
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        if(!ext) return '';
        const price = booking.type !== 'single' ? Math.floor(ext.price * 0.8) : ext.price;
        return `✅ ${ext.label} (+ R$ ${price})`;
    }).filter(Boolean).join('\n');
    
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
${mapQuery ? `\n🔗 *Mapa:* http://googleusercontent.com/maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────

${T.zap.value}
Total: R$ ${f.total},00
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

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
    setShowConfetti(true);
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

  // --- RENDER GUARDS ---
  
  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950" />;

  // --- ANIMAÇÃO INICIAL (AZUL) ---
  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative mb-12">
            <div className={`absolute inset-0 blur-3xl opacity-30 rounded-full animate-pulse-slow ${isDark ? 'bg-sky-500' : 'bg-blue-400'}`}></div>
            <div className="w-32 h-32 rounded-[2rem] flex items-center justify-center font-black text-5xl shadow-2xl relative z-10 bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/30 animate-bounce-slow">TM</div>
        </div>
        <div className="flex flex-col items-center gap-4">
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-sky-500 animate-slide-in" style={{width: '100%', animationDuration: '2s'}}></div>
            </div>
            <div className="text-[10px] font-bold tracking-[0.3em] opacity-50 uppercase flex items-center gap-2">
                <span className="animate-pulse">{T.loading}</span>
            </div>
        </div>
      </div>
  );
  
  // --- LAYOUT PRINCIPAL ---

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-sky-500/30 selection:text-sky-500' : 'bg-slate-50 text-slate-800 selection:bg-blue-200 selection:text-blue-800'}`}>
      
      {/* Background Ambience - BLUE THEME */}
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] blur-[150px] rounded-full animate-pulse-slow ${isDark ? 'bg-sky-500/5' : 'bg-blue-200/40'}`}></div>
          <div className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] blur-[150px] rounded-full animate-pulse-slow ${isDark ? 'bg-indigo-600/5' : 'bg-indigo-200/40'}`}></div>
      </div>

      {/* Toasts */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-5 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-down ${t.type === 'success' ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800') : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-200 text-red-700')}`}>
            {t.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="text-sm font-medium leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />

      {/* Header */}
      <header className="h-20 px-6 md:px-12 flex items-center justify-between z-20 shrink-0 bg-transparent relative max-w-5xl mx-auto w-full">
        <div className="flex flex-col justify-center">
            <span className={`font-bold text-lg tracking-wide block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</span>
            <span className="text-[10px] uppercase font-bold text-sky-500 tracking-[0.2em]">Massagens</span>
        </div>
        <div className="flex gap-2">
            <button onClick={handleShare} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Share2 size={18}/></button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Instagram size={18}/></a>
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-sky-500 hover:text-sky-600 shadow-sm'}`}>{isDark ? <Moon size={18}/> : <Sun size={18}/>}</button>
        </div>
      </header>

      {/* Main Content Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-48 pt-4 scroll-smooth relative z-10 px-4 md:px-8">
        
        {step < 3 && <AutoScrollReviews reviews={DATA.reviews} isDark={isDark} />}

        <div className="max-w-md md:max-w-5xl mx-auto space-y-10">

          {/* CATALOG (STEP 0) */}
          {step === 0 && (
            <div className="animate-fade-in space-y-10">
              
              {/* Desktop Header Grid */}
              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="animate-slide-up delay-100">
                    <div className="flex items-end gap-2 mb-3">
                        <h1 className={`text-3xl md:text-5xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.welcome} <span className="font-bold text-sky-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span></h1>
                    </div>
                    <p className={`text-sm md:text-lg font-light leading-relaxed max-w-md ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.subtitle}</p>
                    
                    <div className="mt-4 flex items-center gap-2 p-3 rounded-lg border border-sky-500/20 bg-sky-500/5 text-sky-500 text-[10px]">
                        <ExternalLink size={12} />
                        <span>{T.zap.browser_warn}</span>
                    </div>
                </div>
                
                {/* Level Card (BLUE THEME) */}
                <div className={`hidden md:block animate-slide-up delay-200 relative overflow-hidden rounded-[2rem] p-8 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-sky-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/20' : 'bg-sky-500 text-white shadow-sky-200'}`}>
                                <Trophy size={28} />
                            </div>
                            <div>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-2xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-sky-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`flex justify-between text-[10px] font-medium mb-3 uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                            <span>Progresso</span>
                            <span className="text-sky-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_15px_#0ea5e9]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                    </div>
                </div>
              </div>

              {/* Mobile Level Card (BLUE THEME) */}
              <div className={`md:hidden animate-slide-up delay-200 relative mt-4 overflow-hidden rounded-[2rem] p-6 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-sky-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-sky-500/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-sky-500/20' : 'bg-sky-500 text-white shadow-sky-200'}`}>
                                <Trophy size={24} />
                            </div>
                            <div>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-sky-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`flex justify-between text-[10px] font-medium mb-3 uppercase tracking-wide ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                            <span>Progresso</span>
                            <span className="text-sky-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_15px_#0ea5e9]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                          <p className={`text-[10px] mt-4 text-center font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
              </div>

              {/* Tabs */}
              <div className={`animate-slide-up delay-300 grid grid-cols-2 p-1.5 rounded-3xl border relative max-w-sm mx-auto md:mx-0 ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <button onClick={()=>setActiveTab('packs')} className={`relative z-10 py-4 text-[11px] font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='packs' ? (isDark ? 'bg-zinc-800 text-sky-500 shadow-xl shadow-black/20 ring-1 ring-sky-500/20' : 'bg-slate-100 text-blue-600 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600')}`}>
                      <Package size={14} className={activeTab === 'packs' ? 'animate-pulse' : ''}/> {T.tab_packs}
                      {activeTab !== 'packs' && <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-500 rounded-full animate-ping"></span>}
                  </button>
                  <button onClick={()=>setActiveTab('single')} className={`relative z-10 py-4 text-[11px] font-bold uppercase tracking-wider rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 ${activeTab==='single' ? (isDark ? 'bg-zinc-800 text-white shadow-xl shadow-black/20' : 'bg-slate-100 text-slate-900 shadow-sm') : (isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600')}`}>
                      <LayoutList size={14}/> {T.tab_single}
                  </button>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in delay-300">
                  {activeTab === 'single' && DATA.services.map((s, idx) => (
                      <div key={s.id} className="animate-scale-in" style={{animationDelay: `${idx * 100}ms`}}>
                        <Card active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)} isDark={isDark}>
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-3.5 rounded-2xl transition-all duration-300 ${booking.item?.id === s.id ? 'bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/20' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={24}/></div>
                                <div className="text-right">
                                    <span className={`block text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>R$ {s.price}</span>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center justify-end gap-1.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}><Clock size={12}/> {s.min} min</span>
                                </div>
                            </div>
                            <div className="mb-4 flex-1">
                                {s.tag && <span className="inline-block px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-[9px] font-bold text-sky-500 mb-3 uppercase tracking-widest">{s.tag}</span>}
                                <h3 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                                <p className={`text-xs leading-loose font-light mt-2 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                            </div>
                            <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === s.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                <div className="overflow-hidden">
                                    <div className={`p-5 rounded-2xl border text-[11px] leading-loose font-light ${isDark ? 'bg-zinc-950/50 border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                        <div className="flex items-center gap-2 font-bold mb-3 text-sky-500 uppercase tracking-wider text-[10px]"><Info size={12}/> {T.details_label}</div>
                                        <p className="whitespace-pre-line">{s.details}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                      </div>
                  ))}

                  {activeTab === 'packs' && DATA.plans.map((plan, idx) => (
                      <div key={plan.id} className="animate-scale-in" style={{animationDelay: `${idx * 100}ms`}}>
                        <Card active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)} isDark={isDark} className="border-sky-500/20">
                            {plan.tag && (<div className="absolute top-0 right-0 bg-gradient-to-bl from-sky-500 to-blue-600 text-white text-[9px] font-bold px-3 py-2 rounded-bl-2xl shadow-lg shadow-sky-500/20">{plan.tag}</div>)}
                            <div className="flex items-center gap-4 mb-6">
                                <div className={`p-4 rounded-2xl transition-all ${booking.item?.id === plan.id ? 'bg-sky-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500')}`}><plan.icon size={28}/></div>
                                <div>
                                    <h3 className={`font-bold text-lg leading-none mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.title}</h3>
                                    <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{plan.type === 'pack' ? (lang === 'pt' ? "Pacote" : "Pack") : (lang === 'pt' ? "Assinatura" : "Subscription")}</p>
                                </div>
                            </div>
                            <div className={`mb-6 p-3 rounded-xl border flex-1 ${isDark ? 'bg-zinc-950/30 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <p className={`text-xs font-medium leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{plan.desc}</p>
                            </div>
                            <div className={`flex items-end gap-3 p-4 rounded-2xl border ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="text-2xl font-bold text-sky-500">R$ {plan.price}</span>
                                <span className={`text-xs line-through decoration-zinc-600 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>R$ {plan.fullPrice}</span>
                                <span className="text-[9px] text-emerald-500 font-bold mb-1 ml-auto bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">-R${plan.savings}</span>
                            </div>
                            <div className={`grid transition-all duration-500 ease-in-out ${booking.item?.id === plan.id ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'}`}>
                                <div className="overflow-hidden">
                                    <div className={`p-5 rounded-2xl border text-[11px] leading-loose font-light ${isDark ? 'bg-zinc-950/50 border-white/5 text-zinc-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                        <div className="flex items-center gap-2 font-bold mb-3 text-sky-500 uppercase tracking-wider text-[10px]"><Info size={12}/> {T.details_label}</div>
                                        <p className="whitespace-pre-line">{plan.details}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                      </div>
                  ))}
              </div>
            </div>
          )}

          {/* DATE (STEP 1) - FULL MONTH */}
          {step === 1 && (
            <div className="animate-slide-in space-y-12">
              <div className="text-center mb-8">
                 <h2 className={`text-3xl font-light mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
                 <p className={`text-[10px] uppercase tracking-[0.25em] font-bold ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>
              
              <div className="relative group">
                  <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><ChevronLeft size={20} /></button>
                  
                  <div className="overflow-hidden">
                      <div ref={dateScrollRef} className="flex gap-3 overflow-x-auto pb-8 scrollbar-hide px-2 snap-x snap-mandatory">
                        {daysArray.map((d, i) => { 
                          const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                          let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                          const monthName = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {month:'short'}).replace('.','');
                          if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                          const showMonth = d.getDate() === 1 || i === 0;

                          return (
                            <div key={i} className="flex flex-col gap-2">
                                {showMonth && <span className={`text-[9px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{monthName}</span>}
                                <button onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`snap-start min-w-[80px] h-28 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all flex-shrink-0 active:scale-95 duration-300 ${isSel ? 'bg-sky-500 border-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 shadow-sm')} ${!showMonth ? 'mt-6' : ''}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                                    <span className="text-3xl font-bold">{d.getDate()}</span>
                                    {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
                                </button>
                            </div>
                          )
                        })}
                      </div>
                  </div>

                  <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><ChevronRight size={20} /></button>
              </div>
              
              {!booking.date && (<div className={`text-center py-16 opacity-30 border border-dashed rounded-[2rem] mx-2 ${isDark ? 'border-zinc-700 text-zinc-500' : 'border-slate-300 text-slate-400'}`}><Calendar size={36} className="mx-auto mb-4"/><p className="text-[10px] font-bold uppercase tracking-wider">{T.empty_date}</p></div>)}
              
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in">
                   {generateTimeSlots.map((t, idx) => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-4 rounded-xl text-sm font-medium border transition-all active:scale-95 duration-200 relative overflow-hidden group animate-scale-in ${booking.time === t ? (isDark ? 'bg-zinc-100 text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-slate-900 text-white border-slate-900 shadow-xl') : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800')}`} style={{animationDelay: `${idx * 50}ms`}}>
                           {t}
                       </button>
                   ))}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className={`text-center py-10 rounded-2xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}><p className="text-xs font-medium">{T.empty_slots}</p></div>)}
            </div>
          )}

          {step === 2 && (
             <div className="animate-slide-in space-y-10">
               <h2 className={`text-3xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
               <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto">
                  {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map(x => (
                      <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-6 rounded-2xl text-[10px] font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-3 transition-all duration-300 border ${booking.locationType === x.id ? 'bg-sky-500/10 border-sky-500/50 text-sky-500 shadow-[0_0_20px_-5px_rgba(14,165,233,0.3)] scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700')}`}>
                          <x.i size={24} strokeWidth={2}/> {x.l}
                      </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} placeholder={lang === 'pt' ? "Seu Nome/Apelido" : "Your Name/Nickname"} />
                      {booking.locationType === 'home' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="grid grid-cols-[1fr_100px] gap-3">
                                 <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon={MapPin} placeholder={lang === 'pt' ? "Rua" : "Street"} />
                                 <InputField isDark={isDark} label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder={lang === 'pt' ? "Nº" : "No."} />
                              </div>
                              <InputField isDark={isDark} label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                              <div className="grid grid-cols-2 gap-3">
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
                          <div className={`p-6 rounded-2xl border border-dashed text-center ${isDark ? 'border-zinc-700 bg-zinc-900/30' : 'border-slate-300 bg-slate-50'}`}>
                             <Smartphone size={24} className={`mx-auto mb-3 ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}/>
                             <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.motel_note}</p>
                          </div>
                      )}
                   </div>
                   <div className={`pt-0 md:pl-8 md:border-l ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                      <h3 className={`text-[10px] font-bold uppercase mb-6 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{booking.type !== 'single' ? T.extras_title.replace('Extras:', 'Adicionais (20% OFF):') : T.extras_title}</h3>
                      <div className="space-y-3">
                         {DATA.extras.map((ex, idx) => {
                            const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                            return (
                               <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-300 animate-slide-in ${booking.extras[ex.id] ? 'bg-sky-500/10 border-sky-500/40 shadow-[0_0_20px_-5px_rgba(14,165,233,0.2)]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`} style={{animationDelay: `${idx * 100}ms`}}>
                                 <div className="flex items-center gap-4">
                                     <div className={`p-2 rounded-xl transition-colors ${booking.extras[ex.id] ? 'text-sky-500' : (isDark ? 'text-zinc-600' : 'text-slate-500')}`}><ex.icon size={20}/></div>
                                     <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-sky-500' : (isDark ? 'text-zinc-300' : 'text-slate-700')}`}>{ex.label}</p><p className={`text-[10px] font-medium pt-0.5 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p></div>
                                 </div>
                                 <div className="text-right">
                                    {booking.type !== 'single' && (<span className={`text-[9px] line-through block ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>R$ {ex.price}</span>)}
                                    <span className={`text-[10px] font-bold whitespace-nowrap px-2 py-1 rounded-lg inline-block ${booking.extras[ex.id] ? 'bg-sky-500/20 text-sky-500' : (isDark ? 'text-zinc-600 bg-zinc-800' : 'text-slate-500 bg-slate-100')}`}>+ R$ {price}</span>
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
             <div className="animate-slide-in pb-12 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-8">
                    <div className="relative">
                        <div className={`p-8 rounded-[2rem] border backdrop-blur-2xl shadow-2xl relative overflow-hidden ${isDark ? 'border-white/10 bg-zinc-900/80' : 'border-slate-200 bg-white/90'}`}>
                          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-blue-700 shadow-[0_0_20px_#0ea5e9]"></div>
                          <div className="mb-8 pt-2">
                              <span className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{booking.type === 'pack' ? (lang === 'pt' ? "Pacote" : "Pack") : (booking.type === 'subscription' ? (lang === 'pt' ? "Assinatura" : "Subscription") : (lang === 'pt' ? "Sessão Individual" : "Single Session"))}</span>
                              <h2 className={`font-bold text-3xl leading-tight mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{booking.item.title}</h2>
                              <p className="text-xs text-sky-500 font-medium flex items-center gap-2 bg-sky-500/10 px-3 py-1.5 rounded-full w-fit border border-sky-500/10"><Calendar size={12}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                          </div>
                          <div className={`space-y-4 border-b border-dashed pb-8 mb-8 ${isDark ? 'border-white/10' : 'border-slate-300'}`}>
                              <div className={`flex justify-between text-sm ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}><span>{lang === 'pt' ? "Valor Base" : "Base Price"}</span><span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>R$ {booking.item.price}</span></div>
                              {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                                  const extraItem = DATA.extras.find(e=>e.id===k);
                                  if(!extraItem) return null;
                                  const price = booking.type !== 'single' ? Math.floor(extraItem.price * 0.8) : extraItem.price;
                                  return (<div key={k} className={`flex justify-between text-sm ${isDark ? 'text-zinc-500' : 'text-slate-600'}`}><span>+ {extraItem.label} {booking.type!=='single' && '(Promo)'}</span><span>{price}</span></div>);
                              })}
                              {booking.appliedCoupon && (<div className="flex justify-between text-sm text-emerald-500 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20 font-bold"><span>{lang === 'pt' ? "Cupom" : "Coupon"} ({booking.appliedCoupon.code})</span><span>- R$ {booking.appliedCoupon.val}</span></div>)}
                          </div>
                          <div className="flex justify-between items-end">
                              <div><span className={`text-[10px] font-bold uppercase block mb-1 ${isDark ? 'text-zinc-600' : 'text-slate-500'}`}>{T.total_label}</span><span className="text-[10px] font-medium text-sky-500/80 bg-sky-500/5 px-2 py-0.5 rounded-full border border-sky-500/10">{T.uber_warning}</span></div>
                              <div className="text-right">
                                  <span className={`block text-5xl font-light tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>R$ {financials.total}</span>
                                  <span className="text-xs font-bold text-sky-500 flex items-center justify-end gap-1.5 mt-2"><Sparkles size={12}/> +{estimatedXP} XP</span>
                              </div>
                          </div>
                        </div>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-8 py-3.5 rounded-xl border text-sm font-bold uppercase tracking-widest outline-none focus:border-sky-500/50 transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'}`}/>
                                <Tag size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDark ? 'text-zinc-700' : 'text-slate-400'}`}/>
                            </div>
                            <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
                        </div>

                         {user.coupons && user.coupons.length > 0 && (
                            <div className="w-full overflow-x-auto pb-2 pt-1 scrollbar-hide">
                                <div className="flex gap-2">
                                    {user.coupons.map(c => {
                                        const isApplied = booking.appliedCoupon?.id === c.id;
                                        return (
                                            <button 
                                                key={c.id} 
                                                onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                                className={`flex-shrink-0 px-3 py-2 rounded-xl border text-[10px] font-bold uppercase transition-all whitespace-nowrap active:scale-95 ${isApplied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500' : (isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')}`}
                                            >
                                                {c.title}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className={`text-[10px] font-bold uppercase mb-4 ml-1 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{T.pay_title}</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {[{id:'pix', l:T.pay_pix, i:QrCode, sub:''}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map((p, idx) => (
                                    <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`animate-slide-in px-5 py-4 rounded-xl border flex items-center gap-4 transition-all duration-300 ${booking.payment === p.id ? 'bg-zinc-800 border-sky-500/50 shadow-[0_0_20px_-5px_rgba(14,165,233,0.2)]' : (isDark ? 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:bg-slate-50')}`} style={{animationDelay: `${idx * 100}ms`}}>
                                            <div className={`p-2 rounded-full ${booking.payment === p.id ? 'bg-sky-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-slate-100 text-slate-500')}`}><p.i size={18}/></div>
                                            <div className="text-left"><span className={`font-bold text-xs block ${booking.payment === p.id ? (isDark ? 'text-white' : 'text-slate-900') : (isDark ? 'text-zinc-400' : 'text-slate-600')}`}>{p.l}</span></div>
                                            {booking.payment === p.id && <Check size={18} className="ml-auto text-sky-500" strokeWidth={3}/>}
                                    </button>
                                ))}
                            </div>
                            
                            {/* PIX COPY PASTE */}
                            {booking.payment === 'pix' && (
                                <div className={`mt-4 p-4 rounded-xl border border-dashed ${isDark ? 'border-zinc-700 bg-zinc-900/50' : 'border-slate-300 bg-slate-50'} animate-fade-in`}>
                                    <p className={`text-[10px] uppercase font-bold text-center mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Chave Pix (Copia e Cola)</p>
                                    <div className="flex gap-2">
                                        <input readOnly value={CONFIG.PIX_KEY} className={`w-full text-xs font-mono text-center rounded-lg border px-2 py-2 ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-600'}`} />
                                        <button onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); addToast("Chave Pix copiada!", "success")}} className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Copy size={16}/></button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`p-4 rounded-xl border ${isDark ? 'border-zinc-800 bg-zinc-900/30' : 'border-slate-200 bg-slate-50'}`}>
                             <div className="flex items-start gap-3 mb-2">
                                  <ShieldCheck className={`${isDark ? 'text-zinc-600' : 'text-slate-500'} shrink-0 mt-0.5`} size={18}/>
                                  <div><h4 className={`text-xs font-bold mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-700'}`}>{T.terms_title}</h4><p className={`text-[10px] cursor-pointer hover:text-sky-500 transition-colors underline ${isDark ? 'text-zinc-500' : 'text-slate-500'}`} onClick={() => setTermsOpen(true)}>{T.terms_link}</p></div>
                             </div>
                             <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:border-zinc-500 transition-colors select-none ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-white border-slate-200'}`}><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 accent-sky-500 cursor-pointer"/><span className={`text-[10px] font-bold uppercase ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{T.agree_terms}</span></label>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {/* SUCCESS (STEP 4) */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-16 text-center animate-scale-in">
                 <div className="relative mb-10 group">
                     <div className="absolute inset-0 bg-emerald-500 blur-[80px] opacity-25 rounded-full animate-pulse"></div>
                     <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-700 flex items-center justify-center shadow-2xl shadow-emerald-500/30 relative z-10 border border-emerald-400/20">
                         <Check size={40} className="text-white" strokeWidth={3}/>
                     </div>
                 </div>
                 <h1 className={`text-2xl font-light mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h1>
                 <p className={`text-xs leading-relaxed max-w-xs mx-auto mb-10 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className={`mt-8 text-[10px] font-bold uppercase tracking-widest transition-colors py-4 ${isDark ? 'text-zinc-600 hover:text-zinc-400' : 'text-slate-400 hover:text-slate-600'}`}>{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER NAV */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className={`w-full p-4 backdrop-blur-xl border-t ${isDark ? 'bg-zinc-950/90 border-white/5' : 'bg-white/90 border-slate-200'}`}>
                <div className="pointer-events-auto max-w-md md:max-w-5xl mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="secondary" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    <button 
                      onClick={handleNextStep} 
                      className={`flex-1 min-h-[3.5rem] rounded-2xl flex flex-col items-center justify-center px-4 transition-all duration-300 shadow-xl active:scale-[0.98] ${step < 3 ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20 hover:shadow-sky-500/30' : 'bg-[#25D366] text-white shadow-green-500/20 hover:bg-[#20bd5a]'}`}
                    >
                      <div className="flex items-center justify-center w-full">
                          <span className="text-xs font-bold uppercase tracking-widest mr-2">{step === 3 ? T.book_btn : T.next_btn}</span>
                          {!booking.item && <ArrowRight size={16} strokeWidth={2.5}/>}
                      </div>
                      {booking.item && (
                        <div className="flex flex-col items-center leading-none opacity-90 mt-0.5">
                          <span className="text-[10px] font-black whitespace-nowrap">R$ {financials.total}</span>
                        </div>
                      )}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* --- MODALS --- */}

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
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border ${isDark ? 'bg-gradient-to-br from-sky-500/20 to-blue-600/20 text-sky-500 border-sky-500/20' : 'bg-sky-100 text-sky-600 border-sky-200'}`}>{r.n.charAt(0)}</div>
                               <div>
                                 <span className="block leading-tight text-xs">{r.n}</span>
                                 <span className={`text-[9px] font-normal uppercase ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{r.loc}</span>
                               </div>
                           </span>
                       </div>
                       <div className="flex gap-0.5 mb-2">{[...Array(5)].map((_,k)=><Star key={k} size={10} fill={k < r.s ? "#0ea5e9" : "none"} className={k < r.s ? "text-sky-500" : (isDark ? "text-zinc-700" : "text-slate-300")} />)}</div>
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
                {T.terms_body.map((t,i)=>(<div key={i} className={`flex gap-4 p-4 rounded-xl border ${isDark ? 'bg-zinc-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}><span className="font-bold text-sky-500 text-xl opacity-50">{i+1}</span><p className={`text-xs leading-relaxed pt-1 font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-sky-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-40 h-40 bg-sky-500 blur-[80px] opacity-20"></div></div>
                <div className="w-20 h-20 bg-gradient-to-tr from-sky-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-sky-500/30 animate-bounce-slow"><Trophy size={32} className="text-white" /></div>
                <h2 className="text-2xl font-light text-white mb-2">{T.popup_level_title}</h2><p className="text-zinc-400 text-xs leading-relaxed mb-8">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-16 h-16 bg-zinc-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl border border-white/5 rotate-3"><Gift size={32} className="text-sky-500" /></div>
                <h2 className="text-xl font-light text-white mb-2">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-xs leading-relaxed mb-6">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-4 rounded-xl border border-dashed border-zinc-800 mb-6"><p className="text-[10px] uppercase font-bold text-zinc-600 mb-1">Seu Código:</p><p className="text-xl font-mono font-bold text-sky-500 tracking-widest">WELCOME10</p></div>
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

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.8s ease-out}.animate-slide-in{animation:slideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-slide-up{animation:slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.4s ease-out}.animate-pulse-slow{animation:pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite}.pb-safe{padding-bottom:env(safe-area-inset-bottom,32px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
