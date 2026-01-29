import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  ChevronRight, Lock, History, User, Wallet, Share2, Copy, Quote, Smile,
  RotateCcw
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v17.7 - NEO-BRUTALISM EDITION
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v17_7_mobile_ui', 
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US'
};

// ==================================================================================
// 2. DESIGN SYSTEM (NEO-BRUTALISM OVERHAUL)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '', loading = false }) => {
  // Neo-Brutalism Base: Bold, thick borders, hard shadow, mechanical press effect
  const baseStyle = "relative flex items-center justify-center font-black uppercase tracking-wider transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black rounded-lg select-none touch-manipulation overflow-hidden active:translate-x-[2px] active:translate-y-[2px] active:shadow-none";
  
  // Hard Shadows applied to default states
  const hardShadow = "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]";

  const variants = {
    primary: `bg-yellow-400 text-black hover:bg-yellow-300 ${hardShadow}`,
    secondary: `bg-white text-black hover:bg-zinc-100 ${hardShadow}`,
    whatsapp: `bg-green-500 text-black hover:bg-green-400 ${hardShadow}`,
    outline: "bg-transparent border-2 border-black text-black hover:bg-black hover:text-white border-dashed",
    icon: `bg-white text-black hover:bg-zinc-100 ${hardShadow}`
  };
  
  const sizes = { 
    sm: "h-10 text-[10px] px-3", 
    md: "h-12 text-xs px-4", 
    lg: "h-14 text-sm px-6", 
    xl: "h-16 text-base px-6",
    icon: "h-12 w-12 p-0 flex-shrink-0"
  };

  return (
    <button onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Loader2 size={20} className="animate-spin text-black"/> : (
        <>
          {Icon && <Icon size={20} className={children ? "mr-2" : ""} strokeWidth={3} />}
          {children}
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", error, isDark }) => (
  <div className="space-y-1 w-full">
    {label && <label className={`text-xs font-black uppercase tracking-widest ml-1 ${isDark ? 'text-white' : 'text-black'}`}>{label}</label>}
    <div className="relative group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-black z-10 pointer-events-none`}>{Icon && <Icon size={20} strokeWidth={2.5} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-12 pr-4 py-3.5 rounded-lg border-2 border-black outline-none text-base font-bold transition-all placeholder:text-zinc-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none ${error ? 'bg-red-200 focus:bg-red-100' : 'bg-white focus:bg-yellow-50 text-black'}`} 
      />
    </div>
    {error && <div className="bg-red-500 text-white text-[10px] font-black uppercase p-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] inline-block mt-1">{error}</div>}
  </div>
);

const Card = ({ children, isDark, className = '', onClick, active = false }) => (
  <div 
    onClick={onClick} 
    className={`relative p-5 rounded-lg border-2 border-black transition-all duration-200 overflow-hidden 
    ${onClick ? 'cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none' : ''} 
    ${isDark ? 'bg-zinc-900 text-white shadow-[4px_4px_0px_0px_#ffffff]' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}
    ${active ? (isDark ? 'bg-zinc-800 ring-2 ring-yellow-400' : 'bg-yellow-100 ring-2 ring-black') : ''} 
    ${className}`}
  >
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
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 5, // Bigger squares
      h: Math.random() * 10 + 5,
      color: ['#FACC15', '#000000', '#EC4899', '#22C55E'][Math.floor(Math.random() * 4)], // Neo colors
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
        ctx.strokeStyle = "black"; // Outline confetti
        ctx.lineWidth = 2;
        ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
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
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "NOOB" : "NOOB", color: "text-zinc-500" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "BRONZE" : "BRONZE", color: "text-orange-500" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "SILVER" : "SILVER", color: "text-gray-400" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "KING" : "KING", color: "text-yellow-500" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind, tag: isPT ? "RELAX" : "RELAX",
              title: isPT ? "Relaxante (Madeira)" : "Wood Therapy Relax",
              desc: isPT ? "Alívio imediato para o cansaço." : "Immediate relief for tiredness.",
              details: isPT ? `COMO É A SESSÃO?
• TÉCNICA: Rolos de madeira + Mãos.
• SEM DOR: Focado 100% em relaxar.
• FINAL: Manual.` : `HOW IS THE SESSION?
• TECHNIQUE: Wood rollers + Hands.
• PAINLESS: 100% relaxation focus.
• FINISH: Manual.`
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame, tag: isPT ? "HOT" : "HOT",
              title: isPT ? "Sensitiva (+ Lingam)" : "Tantric Sensitive",
              desc: isPT ? "Jornada de sensações." : "Journey of sensations.",
              details: isPT ? `DETALHES:
• TOQUE: Leve (ponta dos dedos).
• EXTAS: Lingam incluso.
• META: Prazer máximo.` : `DETAILS:
• TOUCH: Light (fingertips).
• EXTRAS: Lingam included.
• GOAL: Max pleasure.`
            },
            { 
              id: 'mista', min: 60, price: 205, icon: Zap, tag: isPT ? "TOP 1" : "TOP 1",
              title: isPT ? "Mista Completa" : "Full Mixed Exp",
              desc: isPT ? "Relaxamento + Intensidade." : "Relaxation + Intensity.",
              details: isPT ? `O COMBO PERFEITO:
• MIX: Relaxante + Sensitiva.
• CORPO: Body to Body.
• FINAL: Você escolhe.` : `PERFECT COMBO:
• MIX: Relaxing + Sensitive.
• BODY: Body to Body.
• FINISH: You choose.`
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Pack Relax (4x)" : "Relax Pack (4x)", 
              price: 440, fullPrice: 500, savings: 60, 
              details: isPT ? "4 sessões Relaxantes." : "4 Relax sessions.", tag: isPT ? "2X XP" : "2X XP", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Pack Mista (3x)" : "Full Pack (3x)", 
              price: 550, fullPrice: 615, savings: 65, 
              details: isPT ? "3 sessões Completas." : "3 Full sessions.", tag: isPT ? "BEST" : "BEST", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: isPT ? "Clube VIP" : "VIP Club", 
              price: 360, fullPrice: 460, savings: 100, 
              details: isPT ? "2 Mistas/mês + Prioridade." : "2 Full/mo + Priority.", tag: isPT ? "VIP" : "VIP", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: isPT ? "+30 Min" : "+30 Min", desc: isPT ? "Sem pressa." : "No rush." },
            { id: 'touch', price: 55, icon: Heart, label: isPT ? "Troca" : "Switch", desc: isPT ? "Você toca." : "You touch." },
            { id: 'aroma', price: 5, icon: Wind, label: isPT ? "Aroma" : "Aroma", desc: isPT ? "Óleos essenciais." : "Essential oils." }
        ],
        reviews: [
            { n: "Tiago", t: isPT ? "A sensitiva foi uma experiência de outro mundo." : "The sensitive massage was out of this world.", s: 5 },
            { n: "Pedro H.", t: isPT ? "Fui estressado e saí flutuando." : "Went in stressed, came out floating.", s: 5 },
            { n: "Marcos", t: isPT ? "Profissionalismo nota 10." : "Professionalism 10/10.", s: 5 },
            { n: "Tiago (Bela Vista)", t: isPT ? "O Thalyson tem uma energia surreal. A massagem foi perfeita." : "Thalyson has surreal energy. Massage was perfect.", s: 5 },
            { n: "Anônimo", t: isPT ? "O toque dele vicia. A finalização foi absurda, jorrei longe." : "His touch is addictive. The finish was absurd, shot far.", s: 5 },
            { n: "Curioso SP", t: isPT ? "Mão firme, pegada de macho. O óleo quente faz toda a diferença." : "Firm hand, manly grip. The warm oil makes all the difference.", s: 5 },
            { n: "M. (Jardins)", t: isPT ? "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso." : "Paid extra to touch and worth every penny. Soft skin, smells good.", s: 5 },
            { n: "Empresário", t: isPT ? "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório." : "I'm married, had doubts. Secrecy was absolute. Came to my office.", s: 5 },
            { n: "M. (Casado)", t: isPT ? "Precisava desse escape. O stress sumiu na hora. Discrição nota 10." : "Needed this escape. Stress vanished instantly. Discretion 10/10.", s: 5 },
            { n: "Roberto", t: isPT ? "O upgrade de 30 minutos vale a pena. Não dá vontade de parar." : "The 30min upgrade is worth it. You don't want it to stop.", s: 5 },
            { n: "Fã", t: isPT ? "Ele de cueca branca... sem comentários. Visual nota 1000." : "Him in white underwear... no comments. Visuals 10/10.", s: 5 },
            { n: "Carlos A.", t: isPT ? "Profissionalismo raro hoje em dia. Pontual e educado." : "Rare professionalism nowadays. Punctual and polite.", s: 5 },
            { n: "Lucas", t: isPT ? "A mistura de força e suavidade é incrível. Recomendo." : "Mix of strength and softness is amazing. Recommended.", s: 5 },
            { n: "Novato", t: isPT ? "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa." : "First time doing this, felt super comfortable. Thalyson is a good guy.", s: 5 },
            { n: "Gustavo", t: isPT ? "Ambiente que ele cria com a música e o cheiro é relaxante demais." : "The atmosphere he creates with music and scent is too relaxing.", s: 5 },
            { n: "Felipe Personal", t: isPT ? "Tinha muita dor na lombar, ele resolveu em uma sessão. Mão milagrosa." : "Had lots of lower back pain, solved in one session. Miracle hands.", s: 5 },
            { n: "J.P.", t: isPT ? "O corpo a corpo é quente de verdade. Uma experiência única." : "Body to body is truly hot. A unique experience.", s: 5 },
            { n: "André", t: isPT ? "Gostei que ele respeita os limites, mas entrega muito prazer." : "Liked that he respects limits but delivers lots of pleasure.", s: 5 },
            { n: "Turista RJ", t: isPT ? "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem." : "Hotel service was super fast and discreet. Saved my trip.", s: 5 },
            { n: "Anônimo", t: isPT ? "Cara bonito, limpo e com pegada. O pacote completo." : "Handsome guy, clean, with a grip. The full package.", s: 5 },
            { n: "Breno", t: isPT ? "Fiz a relaxante e dormi na maca de tão bom. Recomendo." : "Did the relaxing one and fell asleep on the table. Recommend.", s: 5 },
            { n: "Dr. Marcelo", t: isPT ? "A técnica dele é diferente de tudo. Vale cada real." : "His technique is unlike anything. Worth every cent.", s: 5 },
            { n: "Caio", t: isPT ? "Sensação de liberdade total. O toque extra é obrigatório." : "Feeling of total freedom. Extra touch is mandatory.", s: 5 },
            { n: "Vitor", t: isPT ? "Me senti renovado. Energia lá em cima depois da sessão." : "Felt renewed. High energy after the session.", s: 5 },
            { n: "Renan", t: isPT ? "Extremamente educado e com papo bom, além da massagem top." : "Extremely polite and good chat, plus top massage.", s: 5 },
            { n: "Paulo", t: isPT ? "O óleo de coco morno é um detalhe que faz toda diferença." : "Warm coconut oil is a detail that makes a difference.", s: 5 },
            { n: "Cliente Antigo", t: isPT ? "Já fiz com vários massagistas, o Thalyson é o melhor da região." : "Been to many masseurs, Thalyson is the best in the region.", s: 5 },
            { n: "Dica do Beto", t: isPT ? "Não economizem, peçam a completa com aromaterapia." : "Don't save money, ask for the full one with aromatherapy.", s: 5 },
            { n: "Advogado SP", t: isPT ? "Pontualidade britânica. Chegou na hora marcada." : "British punctuality. Arrived right on time.", s: 5 },
            { n: "Gym Rat", t: isPT ? "Fiquei impressionado com a força das mãos dele." : "Impressed with the strength of his hands.", s: 5 },
            { n: "Hétero Curioso", t: isPT ? "Excelente profissional. Me deixou super confortável." : "Excellent professional. Made me feel super comfortable.", s: 5 },
            { n: "Motorista", t: isPT ? "Massagem terapêutica de verdade, tirou todos os nós das costas." : "Real therapeutic massage, removed all back knots.", s: 5 },
            { n: "M. (Sigilo)", t: isPT ? "O sigilo é garantido mesmo. Pode confiar." : "Secrecy is guaranteed. You can trust.", s: 5 },
            { n: "Sr. João", t: isPT ? "Agradeço pela paciência e pelo serviço impecável." : "Thanks for the patience and impeccable service.", s: 5 },
            { n: "Designer", t: isPT ? "Experiência sensorial incrível. O cheiro, o toque, a música." : "Amazing sensory experience. The smell, touch, music.", s: 5 },
            { n: "Executivo", t: isPT ? "Saí flutuando. Recomendo para quem tem rotina estressante." : "Left floating. Recommend for stressful routines.", s: 5 },
            { n: "Matheus", t: isPT ? "O Thalyson é muito gente fina. O tempo passou voando." : "Thalyson is a great guy. Time flew by.", s: 5 },
            { n: "Bruno", t: isPT ? "Melhor investimento da semana. Relaxamento total." : "Best investment of the week. Total relaxation.", s: 5 },
            { n: "Rafa", t: isPT ? "Toque firme, mas sensível. Sabe onde tocar." : "Firm but sensitive touch. Knows where to touch.", s: 5 },
            { n: "Tech Guy", t: isPT ? "Gostei da facilidade de agendar pelo app. Sem enrolação." : "Liked the ease of booking via app. No hassle.", s: 5 },
            { n: "Corredor", t: isPT ? "Massagem nos pés foi um bônus que eu não esperava. Ótimo." : "Foot massage was an unexpected bonus. Great.", s: 5 },
            { n: "Fã #2", t: isPT ? "Simpático e bonito. O serviço é completo mesmo." : "Friendly and handsome. Service is truly complete.", s: 5 },
            { n: "Pedro", t: isPT ? "Me ajudou muito com a ansiedade. Gratidão." : "Helped a lot with anxiety. Grateful.", s: 5 },
            { n: "Morador Centro", t: isPT ? "Fiz no meu apto e ele levou tudo, maca, toalhas. Prático." : "Did it at my apt, he brought everything, table, towels. Practical.", s: 5 },
            { n: "Curioso", t: isPT ? "A massagem tântrica dele desbloqueou sensações novas." : "His tantric massage unlocked new sensations.", s: 5 },
            { n: "Ricardo", t: isPT ? "Valeu a pena esperar a agenda liberar." : "Worth waiting for the schedule to open.", s: 5 },
            { n: "Sérgio", t: isPT ? "Nota 10. Nada a reclamar." : "Score 10. Nothing to complain about.", s: 5 },
            { n: "Médico", t: isPT ? "Muito higiênico e cuidadoso." : "Very hygienic and careful.", s: 5 },
            { n: "Cliente Fiel", t: isPT ? "Voltarei com certeza na próxima semana." : "Will definitely return next week.", s: 5 },
            { n: "Fernando", t: isPT ? "Paz de espírito e corpo relaxado. Obrigado." : "Peace of mind and relaxed body. Thanks.", s: 5 },
            { n: "Sigilo Total", t: isPT ? "Gozada monstruosa. Ele sabe tirar leite." : "Monstrous finish. He knows how to milk it.", s: 5 },
            { n: "Ativo", t: isPT ? "Curti demais o corpo dele roçando. Fiquei duro a massagem toda." : "Loved his body rubbing. Was hard the whole massage.", s: 5 },
            { n: "Passivo", t: isPT ? "Mão de fada mas com força. Do jeito que eu gosto." : "Fairy hands but with strength. The way I like it.", s: 5 },
            { n: "Anônimo 2", t: isPT ? "O creme desliza muito bem, a pele dele é macia." : "Cream glides very well, his skin is soft.", s: 5 },
            { n: "J.", t: isPT ? "Gostei dos paus que ele usa na massagem com madeira, relaxa mesmo." : "Liked the sticks he uses in wood massage, really relaxes.", s: 5 },
            { n: "Visitante", t: isPT ? "Saiu leite até da alma. Recomendo a sensitiva." : "Milk came out from the soul. Recommend sensitive.", s: 5 }
        ],
        text: {
            loading: isPT ? "CARREGANDO..." : "LOADING...",
            welcome: isPT ? "HELLO," : "HELLO,",
            subtitle: isPT ? "QUAL A BOA DE HOJE?" : "WHAT'S UP TODAY?",
            tab_single: isPT ? "AVULSA" : "SINGLE",
            tab_packs: isPT ? "PACKS" : "PACKS",
            reviews_btn: isPT ? "VER REVIEWS (+50)" : "READ REVIEWS (50+)",
            select_time_title: isPT ? "QUANDO?" : "WHEN?",
            date_sub: isPT ? "ESCOLHA O HORÁRIO:" : "PICK A TIME:",
            location_title: isPT ? "ONDE?" : "WHERE?",
            input_name: isPT ? "SEU NOME" : "YOUR NAME",
            input_addr: isPT ? "ENDEREÇO" : "ADDRESS",
            input_num: isPT ? "NÚMERO" : "NUMBER",
            input_bairro: isPT ? "BAIRRO" : "DISTRICT",
            input_city: isPT ? "CIDADE" : "CITY",
            input_comp: isPT ? "COMPLEMENTO" : "UNIT",
            input_hotel: isPT ? "HOTEL" : "HOTEL",
            input_room: isPT ? "QUARTO" : "ROOM",
            motel_note: isPT ? "MOTEL: Você paga a suíte. Massagem + extras combinamos no Zap." : "MOTEL: You pay the suite. Massage + extras on chat.",
            pay_title: isPT ? "PAGAMENTO" : "PAYMENT",
            pay_pix: "PIX",
            pay_card: isPT ? "CARTÃO" : "CARD",
            pay_cash: isPT ? "DINHEIRO" : "CASH",
            extras_title: isPT ? "TURBINAR" : "BOOST IT",
            coupon_title: isPT ? "CUPOM" : "COUPON",
            coupon_placeholder: isPT ? "CÓDIGO..." : "CODE...",
            coupon_btn: isPT ? "APLICAR" : "APPLY",
            remove: isPT ? "REMOVER" : "REMOVE",
            total_label: isPT ? "TOTAL" : "TOTAL",
            book_btn: isPT ? "CONFIRMAR" : "CONFIRM",
            next_btn: isPT ? "PRÓXIMO" : "NEXT",
            uber_warning: isPT ? "UBER À PARTE" : "UBER NOT INCL.",
            success_title: isPT ? "BOA!" : "NICE!",
            success_sub: isPT ? "Agora é só finalizar no WhatsApp." : "Now finish it on WhatsApp.",
            whatsapp_btn: isPT ? "CHAMAR NO ZAP" : "OPEN WHATSAPP",
            back_home: isPT ? "VOLTAR" : "BACK",
            today: isPT ? "HOJE" : "TODAY",
            tomorrow: isPT ? "AMANHÃ" : "TOMORROW",
            empty_date: isPT ? "SELECIONE UMA DATA" : "SELECT A DATE",
            empty_slots: isPT ? "LOTADO." : "FULL.",
            details_label: isPT ? "INFO:" : "INFO:",
            security_note: isPT ? "Dados salvos no seu aparelho." : "Data saved on device.",
            popup_welcome_title: isPT ? "BEM-VINDO!" : "WELCOME!",
            popup_welcome_msg: isPT ? "Toma esse presente pra começar bem." : "Take this gift to start well.",
            popup_level_title: isPT ? "LEVEL UP!" : "LEVEL UP!",
            popup_level_msg: isPT ? "Você subiu de nível. Respeito máximo." : "You leveled up. Max respect.",
            popup_btn_coupon: isPT ? "PEGAR" : "GRAB IT",
            agree_terms: isPT ? "Aceito as regras do jogo." : "I accept the rules.",
            terms_body: isPT ? ["1. HIGIENE: Banho antes é lei.", "2. SIGILO: O que rola aqui, morre aqui.", "3. RESPEITO: Sem vacilo.", "4. PAGAMENTO: Pix ou Dinheiro.", "5. SAÚDE: Tô bem de saúde."] : ["1. HYGIENE: Shower first.", "2. SECRECY: Stays here.", "3. RESPECT: Be cool.", "4. PAYMENT: Pix or Cash.", "5. HEALTH: I'm fit."],
            terms_title: isPT ? "REGRAS" : "RULES",
            terms_link: isPT ? "LER REGRAS" : "READ RULES",
            terms_btn: isPT ? "ENTENDIDO" : "UNDERSTOOD",
            scarcity_msg: isPT ? "OLHANDO AGORA" : "LOOKING NOW",
            xp_label: "XP",
            level_label: isPT ? "RANK" : "RANK",
            max_level: isPT ? "MAX VIP!" : "MAX VIP!",
            missing_xp_msg: (needed, reward) => isPT ? `Falta ${needed} XP pra R$ ${reward}` : `${needed} XP to $ ${reward}`,
            
            // TOAST MESSAGES
            toast_select_item: isPT ? "ESCOLHE ALGUMA COISA." : "PICK SOMETHING.",
            toast_select_date: isPT ? "QUAL O DIA?" : "WHICH DAY?",
            toast_fill_name: isPT ? "QUAL SEU NOME?" : "YOUR NAME?",
            toast_fill_addr: isPT ? "ONDE É?" : "WHERE IS IT?",
            toast_fill_hotel: isPT ? "QUAL HOTEL?" : "WHICH HOTEL?",
            toast_select_pay: isPT ? "COMO VAI PAGAR?" : "HOW TO PAY?",
            toast_accept_terms: isPT ? "ACEITA AS REGRAS." : "ACCEPT RULES.",
            toast_coupon_success: isPT ? "CUPOM BOA!" : "NICE COUPON!",
            toast_coupon_error: isPT ? "CUPOM RUIM." : "BAD COUPON.",

            zap: {
              intro: isPT ? "Fala Thalyson! 🤘" : "Yo Thalyson! 🤘",
              order_title: isPT ? "🔥 *NOVO PEDIDO*" : "🔥 *NEW ORDER*",
              client: isPT ? "👤 *CLIENTE:*" : "👤 *CLIENT:*",
              service: isPT ? "💆‍♂️ *SERVIÇO:*" : "💆‍♂️ *SERVICE:*",
              date: isPT ? "🗓️ *DATA:*" : "🗓️ *DATE:*",
              location: isPT ? "📍 *LOCAL:*" : "📍 *LOC:*",
              payment: isPT ? "💳 *PAGAMENTO:*" : "💳 *PAYMENT:*",
              value: isPT ? "💰 *TOTAL:*" : "💰 *TOTAL:*",
              xp_status: isPT ? "🏆 *STATUS:*" : "🏆 *STATUS:*",
              xp_gain: isPT ? "XP:" : "XP:",
              xp_level: isPT ? "Level:" : "Level:",
              xp_next: isPT ? "Próximo:" : "Next:",
              wait: isPT ? "Bora fechar?" : "Let's close?",
              house: isPT ? "CASA" : "HOME",
              hotel: "HOTEL",
              motel: isPT ? "MOTEL" : "MOTEL",
              extra_title: isPT ? "✨ *EXTRAS:*" : "✨ *EXTRAS:*",
              uber_label: isPT ? "🚗 *UBER:*" : "🚗 *UBER:*",
              uber_text: isPT ? "A combinar." : "TBD."
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
  
  const [viewers, setViewers] = useState(0);
  const [showScarcity, setShowScarcity] = useState(false);
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

  // BROWSER ESCAPE & IN-APP BROWSER DETECTION
  useEffect(() => {
    // Detecta se é navegador in-app (Instagram, FB, etc)
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = (ua.indexOf("Instagram") > -1) || (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);

    if (isInApp && /android/i.test(ua)) {
      // Tenta forçar abertura no Chrome apenas no Android (iOS bloqueia isso)
      const url = window.location.href;
      // Intent scheme para Android
      const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      // Pequeno timeout para não quebrar a carga inicial
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

  // CARREGAMENTO SEGURO
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
            if(parsed.savedAddress) {
                setBooking(b => ({...b, address: parsed.savedAddress}));
            }
        } else {
            setUser(p => ({...p, coupons: [] })); 
        }
    } catch (e) {
        console.error("Storage error", e);
    }
  }, []);

  useEffect(() => {
     if(!loading && isClient && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 1500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome]);

  useEffect(() => { 
      if(isClient && !loading) {
          try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); } catch(e) {}
      }
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 4) + 3; 
      setViewers(randomViewers);
      setShowScarcity(true);
      setTimeout(() => setShowScarcity(false), 4000);
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({
          ...prev,
          type: type,
          item: item,
          // MANTÉM CUPOM APLICADO
          extras: {}, 
          payment: '',
          termsAccepted: false
      }));
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
            if(extData) {
                sub += extData.price; 
            }
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    const total = Math.max(0, sub - disc);
    return { sub, disc, total };
  }, [booking.item, booking.extras, booking.appliedCoupon, DATA.extras]);

  // CÁLCULO DE XP TURBINADO
  const estimatedXP = useMemo(() => {
      const baseXP = financials.total;
      const isPack = booking.type === 'pack' || booking.type === 'subscription';
      const percentage = isPack ? 0.30 : 0.15; 
      return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);

  // LÓGICA INFINITA DE NÍVEL
  const getNextLevelInfo = (currentXP) => {
      // Se XP for maior que o nível máximo (800)
      if (currentXP >= 800) {
          const cycleXP = currentXP - 800;
          const nextRewardAt = 500 - (cycleXP % 500); 
          return { needed: nextRewardAt, reward: 50, title: "PRESTIGE" }; 
      }
      
      const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
      return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };

  // GERADOR WHATSAPP ESTILO TICKET
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
        locTxt = `${T.zap.motel}\n⚠️ (Combinar detalhes e valor total da suíte no chat)`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 Quarto: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    // EXTRAS COM PREÇO NO ZAP
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return ext ? `✅ ${ext.label} (+ R$ ${ext.price})` : '';
    }).filter(Boolean).join('\n');
    
    const xpStatusMsg = nextInfo 
        ? `${T.zap.xp_next} ${nextInfo.needed} XP (R$ ${nextInfo.reward},00)`
        : "MAX LEVEL! 🚀";

    const msg = `
${T.zap.intro}
${T.zap.order_title}
_____________________________

${T.zap.client} ${user.name}
${T.zap.service} ${booking.item?.title}
${T.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${T.zap.extra_title}\n${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* http://maps.google.com/?q=${encodeURIComponent(mapQuery)}` : ''}
_____________________________

${T.zap.value}
Total: R$ ${f.total},00
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

${T.zap.xp_status}
🔹 ${T.zap.xp_gain} +${xpGain} XP
🔹 ${T.zap.xp_level} ${currentLevelTitle}
🔹 ${xpStatusMsg}

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
              if(!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) {
                  addToast(T.toast_fill_addr, "error"); return false;
              }
          }
          if (booking.locationType === 'hotel') {
              if(!booking.address.placeName || !booking.address.city) {
                  addToast(T.toast_fill_hotel, "error"); return false;
              }
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
          if (step === 2) {
              setUser(prev => ({...prev, savedAddress: booking.address}));
          }
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
    // CORREÇÃO: REMOVER CUPOM USADO DA LISTA
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    
    if (booking.appliedCoupon) {
        // Remove o cupom que acabou de ser usado
        updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code);
    }
    
    // XP CALCULADO COM BASE NA NOVA REGRA
    const newXP = Math.floor(user.xp + estimatedXP);
    
    let leveledUp = false;
    
    // LÓGICA DE LEVEL UP NORMAL
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 REWARD ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });

    // LÓGICA DE LEVEL UP INFINITO (PRESTIGE)
    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        
        if (newCycle > oldCycle && newCycle >= 0) {
              leveledUp = true;
              // GANHA CUPOM DE 50 A CADA 500 XP
              updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 PRESTIGE`, code: `VIPMASTER` });
        }
    }

    if (leveledUp) setLevelUpPopup(true);
    
    setUser(prev => ({ ...prev, xp: newXP, coupons: updatedCoupons, ordersCount: prev.ordersCount + 1 }));
    setShowConfetti(true);
    
    if (typeof window !== 'undefined') {
        const zapLink = generateWhatsAppLink();
        window.open(zapLink, '_blank');
    }
    setStep(4);
  };

  const getCurrentLevelProgress = () => {
      // BARRA DE PROGRESSO INFINITA
      if (user.xp >= 800) {
          const cycleXP = user.xp - 800;
          const progressInCycle = cycleXP % 500;
          return (progressInCycle / 500) * 100;
      }

      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      const totalNeeded = nextLevel.xpNeeded - currentLevel.xpNeeded;
      const currentProgress = user.xp - currentLevel.xpNeeded;
      return Math.min(100, Math.max(0, (currentProgress / totalNeeded) * 100));
  };

  const nextLevelInfo = getNextLevelInfo(user.xp);

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center border-4 border-black ${isDark ? 'bg-zinc-900 text-white' : 'bg-yellow-400 text-black'}`}>
        <div className="relative"><div className="w-20 h-20 bg-black text-white flex items-center justify-center font-black text-2xl border-2 border-white shadow-[6px_6px_0px_0px_#ffffff]">TM</div></div>
        <h1 className="mt-8 text-3xl font-black uppercase tracking-widest">THALYSON</h1>
        <div className="mt-4 flex items-center gap-2 text-xs font-mono font-bold border-2 border-current px-2 py-1"><Loader2 size={14} className="animate-spin"/>{T.text?.loading || "LOADING..."}</div>
      </div>
  );
  
  if (!isClient) return <div className="bg-black h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-200 ${isDark ? 'bg-black text-white' : 'bg-yellow-50 text-black'}`}>
      
      {/* BACKGROUND PATTERN */}
      <div className="fixed inset-0 pointer-events-none opacity-10" style={{backgroundImage: `radial-gradient(${isDark ? '#ffffff' : '#000000'} 2px, transparent 2px)`, backgroundSize: '24px 24px'}}></div>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-3 p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-slide-down font-bold uppercase tracking-wide ${t.type === 'success' ? 'bg-green-400 text-black' : 'bg-red-500 text-white'}`}>
            {t.type === 'success' ? <Check size={24} strokeWidth={4}/> : <AlertTriangle size={24} strokeWidth={4}/>}
            <span className="text-xs">{t.msg}</span>
          </div>
        ))}
      </div>

      <Confetti active={showConfetti} />
      
      {/* SCARCITY */}
      <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none transition-all duration-300 transform ${showScarcity ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
           <div className="bg-black text-white px-4 py-2 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)] flex items-center gap-2">
               <span className="w-3 h-3 bg-red-500 animate-pulse border border-white"></span>
               <span className="text-xs font-black tracking-widest uppercase">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      <header className={`h-20 px-6 flex items-center justify-between z-20 shrink-0 border-b-4 border-black ${isDark ? 'bg-zinc-900' : 'bg-yellow-400'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-sm border-2 border-white shadow-[3px_3px_0px_0px_#ffffff]">TM</div>
          <div className="leading-none">
            <span className="font-black text-lg tracking-tighter block uppercase">THALYSON</span>
            <span className="text-[10px] uppercase font-black bg-black text-white px-1">MASSAGENS</span>
          </div>
        </div>
        <div className="flex gap-3">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${isDark ? 'bg-white text-black' : 'bg-white text-black'}`}><Globe size={20} strokeWidth={2.5}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${isDark ? 'bg-yellow-400 text-black' : 'bg-zinc-900 text-white'}`}>{isDark ? <Sun size={20} strokeWidth={2.5}/> : <Moon size={20} strokeWidth={2.5}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`w-10 h-10 flex items-center justify-center border-2 border-black transition-all active:translate-y-1 active:shadow-none shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] bg-pink-500 text-white`}><Instagram size={20} strokeWidth={2.5}/></a>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-40 scroll-smooth relative">
        <div className="max-w-md mx-auto space-y-8 pt-4">

          {/* CATALOG */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex items-end gap-2 mb-2">
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic transform -skew-x-6">{T.welcome} <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 underline decoration-black decoration-4">{user.name ? user.name.split(' ')[0] : (lang==='pt'?'VISITANTE':'VISITOR')}</span></h1>
                </div>
                <p className={`text-sm mb-6 font-bold uppercase tracking-widest border-l-4 border-black pl-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{T.subtitle}</p>
                
                {/* XP CARD */}
                <div className={`relative overflow-hidden p-6 mb-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 flex items-center justify-center border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-400 text-black`}>
                                <Trophy size={28} strokeWidth={2.5} />
                            </div>
                            <div>
                                <span className="text-[10px] uppercase font-black tracking-widest bg-black text-white px-1.5 py-0.5">{T.level_label}</span>
                                <h3 className={`font-black text-2xl uppercase mt-1 italic`}>
                                    {user.xp >= 800 ? "VIP MASTER" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black block">{user.xp}</span>
                            <span className="text-xs font-bold uppercase border-t-2 border-current pt-1 block">{T.xp_label}</span>
                        </div>
                    </div>
                    <div className="mt-4 border-2 border-black p-1 bg-white">
                        <div className="h-4 w-full bg-zinc-200 relative overflow-hidden">
                            <div className="h-full bg-pink-500 border-r-2 border-black" style={{width: `${getCurrentLevelProgress()}%`}}></div>
                            {/* Striped pattern overlay */}
                            <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px'}}></div>
                        </div>
                    </div>
                    <p className="text-[10px] font-bold uppercase mt-2 text-right">
                         {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "INFINITE CYCLE: +R$50 / 500 XP"}
                    </p>
                </div>
                
                <Button variant="secondary" full size="sm" onClick={() => setReviewsOpen(true)} icon={Star}>{T.reviews_btn}</Button>
              </div>

              <div className={`grid grid-cols-2 gap-0 border-4 border-black bg-black mb-8`}>
                  <button onClick={()=>setActiveTab('single')} className={`py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab==='single' ? (isDark ? 'bg-white text-black' : 'bg-yellow-400 text-black') : 'bg-zinc-800 text-zinc-500'}`}><LayoutList size={16} strokeWidth={3}/> {T.tab_single}</button>
                  <button onClick={()=>setActiveTab('packs')} className={`py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab==='packs' ? (isDark ? 'bg-white text-black' : 'bg-yellow-400 text-black') : 'bg-zinc-800 text-zinc-500'}`}><Package size={16} strokeWidth={3}/> {T.tab_packs}</button>
              </div>

              {activeTab === 'single' && (
                  <div className="space-y-6 animate-slide-in">
                    {DATA.services.map(s => (
                      <Card key={s.id} isDark={isDark} active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)}>
                          <div className="flex justify-between items-start mb-4 w-full">
                            <div className={`p-3 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${booking.item?.id === s.id ? 'bg-black text-white' : (isDark ? 'bg-white text-black' : 'bg-yellow-400 text-black')}`}><s.icon size={28} strokeWidth={2.5}/></div>
                            <div className="text-right flex-shrink-0 ml-4">
                                <span className="block text-3xl font-black tracking-tighter italic">{T.currency || 'R$'} {s.price}</span>
                                <span className="text-[10px] uppercase font-black bg-black text-white px-1 inline-block"><Clock size={10} className="inline mr-1"/> {s.min} min</span>
                            </div>
                          </div>
                          <div className="mb-3">{s.tag && <span className="inline-block px-2 py-1 bg-pink-500 border-2 border-black text-[10px] font-black text-white mb-2 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-2">{s.tag}</span>}<h3 className="font-black text-xl uppercase leading-none">{s.title}</h3></div>
                          <p className={`text-sm font-medium leading-tight mb-4 opacity-80 border-l-2 border-current pl-2`}>{s.desc}</p>
                          {booking.item?.id === s.id && (<div className={`mt-4 p-4 border-2 border-black text-xs font-mono uppercase leading-relaxed animate-fade-in ${isDark ? 'bg-zinc-800 text-white' : 'bg-zinc-100 text-black'}`}><div className="flex items-center gap-2 font-black mb-2 text-pink-500"><Info size={14} strokeWidth={3}/> {T.details_label}</div><p className="whitespace-pre-line">{s.details}</p></div>)}
                      </Card>
                    ))}
                  </div>
              )}

              {activeTab === 'packs' && (
                  <div className="space-y-6 animate-slide-in">
                      {DATA.plans.map(plan => (
                          <Card key={plan.id} isDark={isDark} active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)} className="overflow-visible">
                              {plan.tag && (<div className="absolute -top-4 -right-2 bg-green-400 border-2 border-black text-black text-xs font-black px-3 py-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] z-10 rotate-3">{plan.tag}</div>)}
                              <div className="flex items-center gap-4 mb-4 relative z-0">
                                  <div className={`p-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${booking.item?.id === plan.id ? 'bg-black text-white' : 'bg-yellow-400 text-black'}`}><plan.icon size={32} strokeWidth={2.5}/></div>
                                  <div><h3 className="font-black text-xl uppercase leading-none mb-1 italic">{plan.title}</h3><p className="text-[10px] font-bold uppercase bg-black text-white inline-block px-1">{plan.type === 'pack' ? 'PACK' : 'SUBSCRIPTION'}</p></div>
                              </div>
                              <p className={`text-sm font-bold mb-5 border-l-4 border-current pl-3 ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>{plan.details}</p>
                              <div className="flex items-end gap-3 p-3 border-2 border-black bg-zinc-100 dark:bg-zinc-800">
                                  <span className="text-3xl font-black text-black dark:text-white whitespace-nowrap">{T.currency || 'R$'} {plan.price}</span>
                                  <span className="text-sm line-through opacity-50 font-bold decoration-2 decoration-red-500 whitespace-nowrap">{T.currency || 'R$'} {plan.fullPrice}</span>
                                  <span className="text-xs text-black font-black mb-1 ml-auto bg-green-400 px-2 border-2 border-black whitespace-nowrap shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">-{T.currency || 'R$'}{plan.savings}</span>
                              </div>
                          </Card>
                      ))}
                  </div>
              )}
            </div>
          )}

          {/* DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-8 border-b-4 border-black pb-4">
                 <h2 className="text-4xl font-black uppercase italic">{T.select_time_title}</h2>
                 <p className={`text-xs uppercase font-black bg-black text-white inline-block px-2 transform rotate-1`}>{T.date_sub}</p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-8 scrollbar-hide -mx-6 px-6 mb-4">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                  let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; if(i===1) lbl=T.tomorrow;
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} className={`min-w-[80px] h-28 border-2 border-black flex flex-col items-center justify-center gap-1 transition-all flex-shrink-0 active:translate-y-1 active:shadow-none duration-150 ${isSel ? 'bg-yellow-400 text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-2' : (isDark ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-zinc-50')}`}>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-1 w-full text-center">{lbl}</span><span className="text-4xl font-black">{d.getDate()}</span>{isSel && <span className="w-3 h-3 bg-black border border-white animate-bounce mt-1"></span>}
                    </button>
                  )
                })}
              </div>
              {!booking.date && (<div className="text-center py-12 border-4 border-dashed border-zinc-700 mx-2 bg-zinc-800/20"><Calendar size={48} className="mx-auto mb-4 opacity-50" strokeWidth={1.5}/><p className="text-lg font-black uppercase">{T.empty_date}</p></div>)}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 gap-3 animate-fade-in">
                   {generateTimeSlots.map(t => (
                       <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }} className={`py-4 text-base font-black border-2 border-black transition-all active:translate-y-1 active:shadow-none duration-100 ${booking.time === t ? 'bg-black text-white shadow-[4px_4px_0px_0px_#facc15]' : (isDark ? 'bg-zinc-800 text-white hover:bg-zinc-700 shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]' : 'bg-white text-black hover:bg-yellow-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]')}`}>
                           {t}
                       </button>
                   ))}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className="text-center py-10 bg-red-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"><p className="text-xl font-black uppercase">{T.empty_slots}</p></div>)}
            </div>
          )}

          {/* LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-4xl font-black text-center mb-8 uppercase italic border-b-4 border-black pb-2">{T.location_title}</h2>
              <div className={`grid grid-cols-3 gap-0 border-2 border-black mb-8`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:T.zap.motel, i:BedDouble}, {id:'hotel', l:T.zap.hotel, i:Building}].map((x, idx) => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-4 text-[10px] font-black uppercase flex flex-col items-center justify-center gap-2 transition-all ${idx !== 2 ? 'border-r-2 border-black' : ''} ${booking.locationType === x.id ? (isDark ? 'bg-white text-black' : 'bg-yellow-400 text-black') : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                        <x.i size={24} strokeWidth={2.5}/> {x.l}
                    </button>
                 ))}
              </div>
              <div className="space-y-6">
                 <InputField label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon={User} isDark={isDark} placeholder={lang === 'pt' ? "NOME COMPLETO" : "FULL NAME"} />
                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_100px] gap-3">
                           <InputField label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} isDark={isDark} icon={MapPin} placeholder={lang === 'pt' ? "RUA/AV" : "STREET"} />
                           <InputField label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} isDark={isDark} placeholder="Nº" />
                        </div>
                        <InputField label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} isDark={isDark} placeholder={lang === 'pt' ? "BAIRRO" : "DISTRICT"} />
                        <div className="grid grid-cols-2 gap-3">
                             <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder={lang === 'pt' ? "CIDADE" : "CITY"} />
                             <InputField label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} placeholder={lang === 'pt' ? "COMPLEMENTO" : "UNIT"} />
                        </div>
                     </div>
                 )}
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <InputField label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} isDark={isDark} icon={Building} placeholder={lang === 'pt' ? "NOME HOTEL" : "HOTEL NAME"} />
                        <InputField label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} isDark={isDark} placeholder={lang === 'pt' ? "CIDADE" : "CITY"} />
                        <InputField label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} isDark={isDark} icon={Lock} placeholder={lang === 'pt' ? "QUARTO" : "ROOM"} />
                    </div>
                 )}
                 {booking.locationType === 'motel' && (
                    <div className={`p-6 border-2 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                        <div className="w-14 h-14 bg-black text-white rounded-none flex items-center justify-center mx-auto mb-3 border-2 border-white"><Smartphone size={28} strokeWidth={2.5}/></div>
                        <p className="font-bold font-mono text-sm">{T.motel_note}</p>
                    </div>
                 )}
              </div>
              {/* EXTRAS SÓ APARECEM SE FOR SINGLE */}
              {booking.type === 'single' && (
                  <div className="pt-8 border-t-4 border-black border-dashed mt-8">
                     <h3 className={`text-sm font-black uppercase mb-4 tracking-widest bg-black text-white inline-block px-2 transform -rotate-1`}>{T.extras_title}</h3>
                     <div className="space-y-3">
                        {DATA.extras.map(ex => (
                           <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-4 border-2 border-black cursor-pointer transition-all active:translate-y-1 active:shadow-none duration-150 ${booking.extras[ex.id] ? 'bg-pink-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : (isDark ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800' : 'bg-white hover:bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]')}`}>
                             <div className="flex items-center gap-4">
                                 <div className={`p-2 border-2 border-black ${booking.extras[ex.id] ? 'bg-white text-black' : 'bg-zinc-200 text-black'}`}><ex.icon size={20} strokeWidth={3}/></div>
                                 <div><p className="text-sm font-black uppercase">{ex.label}</p><p className="text-[10px] font-mono font-bold uppercase">{ex.desc}</p></div>
                             </div>
                             <span className={`text-sm font-black whitespace-nowrap bg-black text-white px-2 py-0.5 ${booking.extras[ex.id] ? '' : 'opacity-50'}`}>+ {T.currency || 'R$'} {ex.price}</span>
                           </div>
                        ))}
                     </div>
                  </div>
              )}
            </div>
          )}

          {/* CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className="relative">
                   <div className={`p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                      <div className="flex justify-between items-start mb-6 border-b-4 border-black pb-4">
                          <div>
                              <span className={`text-[10px] font-black uppercase px-2 py-1 mb-2 inline-block border-2 border-black ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>{booking.type === 'pack' ? (lang === 'pt'?'PACOTE':'PACK') : (booking.type === 'subscription' ? (lang === 'pt'?'ASSINATURA':'SUBSCRIPTION') : (lang === 'pt'?'SESSÃO':'SESSION'))}</span>
                              <h2 className="font-black text-3xl leading-none uppercase italic">{booking.item.title}</h2>
                              <p className="text-xs font-mono font-bold mt-2 bg-yellow-400 text-black inline-block px-1 border border-black">{booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} @ {booking.time}</p>
                          </div>
                      </div>
                      <div className="space-y-3 border-b-4 border-dashed border-zinc-700/50 pb-6 mb-6 font-mono text-sm font-bold uppercase">
                          <div className="flex justify-between"><span>BASE</span><span className="whitespace-nowrap">{T.currency || 'R$'} {booking.item.price}</span></div>
                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>{
                              const extraItem = DATA.extras.find(e=>e.id===k);
                              return extraItem ? (<div key={k} className="flex justify-between opacity-80"><span>+ {extraItem.label}</span><span className="whitespace-nowrap">{extraItem.price}</span></div>) : null;
                          })}
                          {booking.appliedCoupon && (<div className="flex justify-between text-black bg-green-400 p-2 border-2 border-black"><span>CUPOM ({booking.appliedCoupon.code})</span><span className="whitespace-nowrap">- {T.currency || 'R$'} {booking.appliedCoupon.val}</span></div>)}
                      </div>
                      <div className="flex justify-between items-end">
                          <div><span className="text-[10px] font-black uppercase block mb-1">{T.total_label}</span><span className="text-[10px] font-black bg-black text-white px-2 py-0.5 border border-white transform rotate-1 inline-block">{T.uber_warning}</span></div>
                          <div className="text-right flex-shrink-0 ml-4">
                              <span className="block text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-400 to-orange-500 whitespace-nowrap drop-shadow-[2px_2px_0_rgba(0,0,0,1)]" style={{WebkitTextStroke: '2px black'}}>{T.currency || 'R$'} {financials.total}</span>
                              <span className="text-xs font-black bg-black text-yellow-400 border border-yellow-400 px-2 py-0.5 inline-flex items-center justify-end gap-1 mt-1 shadow-[2px_2px_0px_0px_#facc15]"><Sparkles size={12}/> +{estimatedXP} XP</span>
                          </div>
                      </div>
                   </div>
               </div>
               <div className="mt-8 flex gap-2">
                   <div className="relative flex-1">
                       <input value={couponInput} onChange={e=>setCouponInput(e.target.value)} placeholder={T.coupon_placeholder} className={`w-full pl-4 pr-4 py-4 border-2 border-black outline-none text-sm font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none focus:translate-x-[4px] focus:translate-y-[4px] transition-all ${isDark ? 'bg-zinc-800 text-white placeholder:text-zinc-600' : 'bg-white text-black'}`}/>
                       <Tag size={20} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none"/>
                   </div>
                   <Button onClick={handleApplyCoupon} variant="secondary" size="md">{T.coupon_btn}</Button>
               </div>
               {user.coupons && user.coupons.length > 0 && (
                   <div className="mt-6 flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                       {user.coupons.map(c => {
                           const isApplied = booking.appliedCoupon?.id === c.id;
                           return (<button key={c.id} onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} className={`flex-shrink-0 px-4 py-2 border-2 border-black text-xs font-black uppercase transition-all whitespace-nowrap shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1 ${isApplied ? 'bg-green-400 text-black' : (isDark ? 'bg-zinc-800 text-white' : 'bg-white text-black')}`}>{c.title}</button>)
                       })}
                   </div>
               )}
               <div className="mt-8">
                   <h3 className="text-xs font-black uppercase mb-3 ml-1 bg-black text-white inline-block px-2">{T.pay_title}</h3>
                   <div className="grid grid-cols-1 gap-4">
                       {[{id:'pix', l:T.pay_pix, i:QrCode, sub: lang === 'pt'?'INSTANTÂNEO':'INSTANT'}, {id:'card', l:T.pay_card, i:CreditCard, sub:''}, {id:'money', l:T.pay_cash, i:Banknote, sub:''}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`px-6 py-4 border-2 border-black flex items-center gap-4 transition-all active:translate-y-1 active:shadow-none duration-150 ${booking.payment === p.id ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : (isDark ? 'bg-zinc-900 text-white hover:bg-zinc-800' : 'bg-white text-black hover:bg-zinc-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]')}`}>
                               <div className={`p-2 border-2 border-black ${booking.payment === p.id ? 'bg-white text-black' : 'bg-zinc-200 text-black'}`}><p.i size={24} strokeWidth={2.5}/></div>
                               <div className="text-left"><span className="font-black text-base block uppercase">{p.l}</span>{p.sub && <span className="text-[10px] font-mono font-bold bg-black text-white px-1 uppercase tracking-widest">{p.sub}</span>}</div>
                               {booking.payment === p.id && <Check size={28} className="ml-auto" strokeWidth={4}/>}
                           </button>
                       ))}
                   </div>
               </div>
               <div className={`mt-8 p-4 border-2 border-black flex flex-col gap-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isDark ? 'bg-zinc-900 text-white' : 'bg-pink-100 text-black'}`}>
                    <div className="flex items-start gap-3">
                         <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={24} strokeWidth={3}/>
                         <div><h4 className="text-sm font-black uppercase mb-1 decoration-2 underline">{T.terms_title}</h4><p className="text-xs font-bold uppercase cursor-pointer hover:bg-black hover:text-white inline-block px-1 transition-colors" onClick={() => setTermsOpen(true)}>{T.terms_link} &rarr;</p></div>
                    </div>
                    <label className="flex items-center gap-3 p-3 border-2 border-black bg-white/10 cursor-pointer select-none hover:bg-white/20"><input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-6 h-6 accent-black border-2 border-black rounded-none cursor-pointer"/><span className="text-xs font-black uppercase">{T.agree_terms}</span></label>
               </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-8 text-center animate-scale-in">
                 <div className="relative mb-8">
                     <div className="absolute inset-0 bg-green-400 blur-xl opacity-50 rounded-full animate-pulse"></div>
                     <div className="w-32 h-32 bg-green-500 border-4 border-black flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-10 animate-bounce-slow">
                         <Check size={64} className="text-black" strokeWidth={5}/>
                     </div>
                 </div>
                 <h1 className="text-5xl font-black mb-3 uppercase italic transform -rotate-2">{T.success_title}</h1>
                 <p className="font-bold font-mono max-w-xs mx-auto mb-10 text-sm border-2 border-black p-2 bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">{T.success_sub}</p>
                 <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon={MessageCircle}>{T.whatsapp_btn}</Button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false}); setShowConfetti(false);}} className="mt-8 text-sm font-black uppercase bg-black text-white hover:bg-zinc-800 px-6 py-3 border-2 border-transparent hover:border-white transition-all">{T.back_home}</button>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER - MOBILE OPTIMIZED */}
      {step < 4 && (
         <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none pb-safe">
            <div className={`w-full p-4 border-t-4 border-black transition-all duration-300 ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
                <div className="pointer-events-auto max-w-md mx-auto flex items-center gap-3">
                    {step > 0 && (
                      <div className="flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => setStep(0)} icon={Home} />
                        <Button variant="secondary" size="icon" onClick={() => setStep(step - 1)} icon={ChevronLeft} />
                      </div>
                    )}
                    
                    {/* Botão Avançar Integrado */}
                    <button 
                      onClick={handleNextStep} 
                      className={`flex-1 h-14 border-2 border-black font-black text-sm flex items-center justify-between px-6 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] ${step < 3 ? 'bg-yellow-400 text-black hover:bg-yellow-300' : 'bg-green-500 text-black hover:bg-green-400'}`}
                    >
                      <span className="uppercase tracking-widest italic">{step === 3 ? T.book_btn : T.next_btn}</span>
                      {booking.item && (
                        <div className="flex flex-col items-end leading-none">
                          <span className="text-[9px] font-black bg-black text-white px-1 mb-0.5">TOTAL</span>
                          <span className="text-base font-black whitespace-nowrap">{T.currency || 'R$'} {financials.total}</span>
                        </div>
                      )}
                      {!booking.item && <ArrowRight size={24} strokeWidth={4}/>}
                    </button>
                </div>
            </div>
         </div>
      )}

      {/* MODALS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${reviewsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-grayscale transition-opacity ${reviewsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setReviewsOpen(false)}></div>
         <div className={`relative w-full max-w-md border-4 border-black p-6 max-h-[85vh] overflow-y-auto transform transition-transform duration-300 shadow-[8px_8px_0px_0px_#facc15] ${reviewsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4"><h3 className="text-3xl font-black uppercase italic">{T.reviews_title || "REVIEWS"}</h3><button onClick={()=>setReviewsOpen(false)} className="p-2 bg-red-500 text-white border-2 border-black hover:bg-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"><X size={24} strokeWidth={3}/></button></div>
            <div className="space-y-6">
                {DATA.reviews.map((r,i)=>(
                   <div key={i} className={`p-5 border-2 border-black relative ${isDark ? 'bg-zinc-800' : 'bg-zinc-50'}`}>
                       <Quote size={24} className="absolute -top-3 -right-3 text-black fill-yellow-400 stroke-2 bg-white border-2 border-black p-1 box-content" />
                       <div className="flex justify-between mb-3">
                           <span className="font-black text-sm uppercase flex items-center gap-3">
                               <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-xs font-black border-2 border-white">{r.n.charAt(0)}</div>
                               {r.n}
                           </span>
                       </div>
                       <div className="flex text-black gap-1 mb-3">{[...Array(r.s)].map((_,k)=><Star key={k} size={16} fill="#FACC15" strokeWidth={2}/>)}</div>
                       <p className="text-sm font-bold font-mono uppercase leading-tight">"{r.t}"</p>
                   </div>
                ))}
            </div>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-300 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-grayscale transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-md border-4 border-black p-6 max-h-[80vh] overflow-y-auto transform transition-transform duration-300 shadow-[8px_8px_0px_0px_#ec4899] ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}`}>
            <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4"><h3 className="text-3xl font-black uppercase italic">{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className="p-2 bg-red-500 text-white border-2 border-black hover:bg-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-1"><X size={24} strokeWidth={3}/></button></div>
            <div className="space-y-4">
                {T.terms_body.map((t,i)=>(<div key={i} className="flex gap-4 p-4 border-2 border-black bg-zinc-100 dark:bg-zinc-800"><span className="font-black text-4xl text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-pink-500 leading-none" style={{WebkitTextStroke: '1px black'}}>{i+1}</span><p className="text-sm font-bold uppercase leading-tight pt-2">{t.substring(3)}</p></div>))}
                <Button full onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className={`relative p-8 border-4 border-black text-center max-w-sm w-full animate-scale-in shadow-[12px_12px_0px_0px_#facc15] ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                <div className="w-24 h-24 bg-yellow-400 border-4 border-black flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] animate-bounce"><Trophy size={48} className="text-black" strokeWidth={2.5} /></div>
                <h2 className="text-4xl font-black mb-2 italic tracking-tighter uppercase">{T.popup_level_title}</h2><p className="font-bold font-mono text-sm leading-tight mb-8 border-y-2 border-black py-4">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon={Ticket}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 border-4 border-black text-center max-w-sm w-full animate-scale-in shadow-[12px_12px_0px_0px_#ec4899] ${isDark ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
                <div className="w-20 h-20 bg-pink-500 border-4 border-black rotate-3 flex items-center justify-center mx-auto mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"><Gift size={40} className="text-white" strokeWidth={2.5}/></div>
                <h2 className="text-4xl font-black mb-2 uppercase italic">{T.popup_welcome_title}</h2><p className="font-bold font-mono text-sm leading-tight mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-black text-yellow-400 p-4 border-2 border-dashed border-white mb-6 transform -rotate-2"><p className="text-[10px] uppercase font-black text-white mb-1">CODE:</p><p className="text-2xl font-mono font-black tracking-widest">WELCOME10</p></div>
                <Button full variant="primary" onClick={()=>{
                    setWelcomePopup(false); 
                    setUser(u=>({...u, hasSeenWelcome: true}));
                    const welcomeCoupon = { id: 'WELCOME10', val: 10, title: '🎁 WELCOME', code: 'WELCOME10' };
                    setBooking(b => ({...b, appliedCoupon: welcomeCoupon}));
                    addToast(T.toast_coupon_success, "success");
                }}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.2s ease-out}.animate-slide-up{animation:slideUp 0.3s cubic-bezier(0,1,0,1)}.animate-slide-in{animation:slideIn 0.3s cubic-bezier(0,1,0,1)}.animate-scale-in{animation:scaleIn 0.3s cubic-bezier(0,1,0,1)}.animate-bounce-slow{animation:bounce 2s infinite}.animate-slide-down{animation:slideDown 0.2s cubic-bezier(0,1,0,1)}.pb-safe{padding-bottom:env(safe-area-inset-bottom,24px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{transform:translateY(50px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideIn{from{transform:translateX(50px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.8);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-50px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
