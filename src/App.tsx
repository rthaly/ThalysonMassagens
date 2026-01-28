import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, Bell,
  ChevronLeft, Loader2, Eye, ShieldCheck, AlertTriangle, Tag, Sparkles, MapPin, Calendar, Smartphone
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_final_fixed_v3', 
};

const TIME_SLOTS = [
  '09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00', '21:00'
];

const getData = (lang) => {
    const isPT = lang === 'pt';
    
    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 12, title: isPT ? "Iniciante" : "Beginner", color: "text-blue-400" },
            { level: 2, xpNeeded: 400, reward: 20, title: isPT ? "Bronze" : "Bronze", color: "text-orange-400" },
            { level: 3, xpNeeded: 1000, reward: 30, title: isPT ? "Prata" : "Silver", color: "text-slate-300" },
            { level: 4, xpNeeded: 2000, reward: 50, title: isPT ? "Ouro VIP" : "Gold VIP", color: "text-yellow-400" }
        ],

        services: [
            { 
              id: 'relaxante', 
              min: 60, 
              price: 90, 
              icon: Wind, 
              title: isPT ? "Relaxante (Rolos de Madeira)" : "Wood Relax",
              desc: isPT ? "Alívio de dores e tensão com rolos (Sem dor)." : "Pain relief with wood rollers.",
              details: isPT ? `COMO É A SESSÃO?
1. TÉCNICA: Uso 3 tipos de rolos de madeira anatômicos para soltar a musculatura.
2. SEM DOR: O foco é relaxamento, deslizando a madeira para tirar o peso das costas.
3. FINALIZAÇÃO: Toques manuais nas costas e pernas.
⚠️ Obs: Nesta modalidade não há toques íntimos.` : "Wood therapy focused on relaxation. No intimate touches."
            },
            { 
              id: 'sensitiva', 
              min: 60, 
              price: 160, 
              icon: Flame, 
              title: isPT ? "Sensitiva Tântrica (+ Lingam)" : "Tantric Sensitive",
              desc: isPT ? "Começa com Relaxante + Sensitiva + Finalização." : "Relax + Sensitive + Happy Ending.",
              details: isPT ? `O PROTOCOLO DESTA SESSÃO:
1. INÍCIO RELAXANTE: Começo tirando a tensão muscular (manual ou rolos).
2. SENSORIAL: Entro com a parte sensitiva (toques leves com a ponta dos dedos) para arrepiar o corpo.
3. LINGAM MASSAGE: Inclui a massagem técnica na região íntima (pênis e testículos).
4. OBJETIVO: Te levar ao limite do prazer.
5. FINALIZAÇÃO: Manual inclusa (com muito óleo).` : "Starts with relaxing, moves to sensory touches and includes Lingam Massage."
            },
            { 
              id: 'mista', 
              min: 60, // VOLTOU PARA 60 MINUTOS
              price: 200, 
              icon: Zap, 
              title: isPT ? "Experiência Mista Completa" : "Full Experience",
              desc: isPT ? "O equilíbrio perfeito (Relax + Corpo a Corpo)." : "The perfect balance.",
              details: isPT ? `A EXPERIÊNCIA COMPLETA (60min):
1. TÉCNICA: Começa com a massagem relaxante para soltar a musculatura.
2. INTENSIDADE: Aumento para a sensitiva e entro no corpo a corpo (Body to Body).
3. LINGAM: Fecho com a tântrica (finalização manual inclusa).
4. FOCO: Seu prazer, sem pressa.` : "Complete experience: Relaxing + Body to Body + Lingam."
            }
        ],

        extras: [
            { 
              id: 'more_time', 
              price: 55, 
              icon: Clock, 
              label: isPT ? "+30 Minutos" : "+30 Minutes",
              desc: isPT ? "Estenda seu tempo de prazer." : "More time."
            },
            { 
              id: 'touch', 
              price: 55, 
              icon: Heart,
              label: isPT ? "Troca de Energia" : "Energy Exchange",
              desc: isPT ? "Interativo: Você pode tocar no massagista." : "You can touch."
            },
            { 
              id: 'aroma', 
              price: 5, 
              icon: Wind,
              label: isPT ? "Aromaterapia" : "Aromatherapy",
              desc: isPT ? "Essências no ambiente." : "Scents."
            }
        ],

        // AVALIAÇÕES: ORIGINAIS + NOVAS (ESPECÍFICAS)
        reviews: [
            // ORIGINAIS (RESTAURADAS)
            { n: "Tiago", t: "A sensitiva foi uma experiência de outro mundo.", s: 5 },
            { n: "Pedro H.", t: "Fui estressado e saí flutuando.", s: 5 },
            { n: "Marcos", t: "Profissionalismo nota 10.", s: 5 },

            // NOVAS - LONDRINA
            { n: "Eduardo (Londrina)", t: "Sou daqui de Londrina, fui no hotel perto do Catuaí. O cara é discreto mesmo.", s: 5 },
            { n: "Ricardo (Gleba Palhano)", t: "Atendimento top aqui em Londrina. Os rolos de madeira salvam as costas.", s: 5 },
            { n: "M. (Londrina Centro)", t: "Rápido e prático. A finalização foi intensa, perna tremeu.", s: 5 },
            { n: "Júnior (Londrina)", t: "Estava a trabalho na cidade, ele veio no hotel. Salvou minha noite.", s: 5 },

            // NOVAS - SÃO PAULO (BELA VISTA / JARDINS)
            { n: "Tiago (Bela Vista)", t: "Moro na Frei Caneca, ele veio rápido. O toque dele é viciante.", s: 5 },
            { n: "M. (Jardins SP)", t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", s: 5 },
            { n: "Gustavo (Consolação)", t: "O apartamento dele em SP é super limpo. Jorrei longe na finalização.", s: 5 },
            { n: "Advogado (Paulista)", t: "Sigilo absoluto. Atendeu no meu flat. Recomendo.", s: 5 },
            { n: "Felipe (Centro SP)", t: "Achei que ia doer os rolos, mas relaxou demais. E a Lingam... sem palavras.", s: 5 },
            
            // NOVAS - SANTA FÉ DO SUL / JALES
            { n: "João (Santa Fé)", t: "Sou daqui de Santa Fé, conheço o trabalho dele faz tempo. O melhor.", s: 5 },
            { n: "Lucas (Jales)", t: "Vim de Jales só pra isso. A mista vale muito a pena.", s: 5 },
            { n: "Beto (Santa Fé do Sul)", t: "Ambiente climatizado top aqui na cidade. Saí renovado.", s: 5 },
            { n: "André (Região)", t: "Os rolos de madeira tiraram toda dor nas costas. Mão de fada.", s: 5 },

            // GERAIS / VISCERAIS
            { n: "Anônimo", t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", s: 5 },
            { n: "Curioso", t: "Mão firme, pegada de macho. O óleo faz toda a diferença.", s: 5 },
            { n: "Empresário", t: "Sou casado, tinha receio. O sigilo foi absoluto.", s: 5 },
            { n: "M. (Casado)", t: "Precisava desse escape. O stress sumiu na hora.", s: 5 },
            { n: "Roberto", t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", s: 5 },
            { n: "Fã", t: "Ele de cueca branca... sem comentários. Visual nota 1000.", s: 5 },
            { n: "Carlos A.", t: "Profissionalismo raro hoje em dia. Pontual e educado.", s: 5 },
            { n: "Gym Rat", t: "Fiquei impressionado com a força das mãos dele.", s: 5 },
            { n: "Hétero Curioso", t: "Excelente profissional. Me deixou super confortável.", s: 5 }
        ],
        text: {
            loading: isPT ? "CARREGANDO APP..." : "LOADING APP...",
            welcome: isPT ? "Olá," : "Hello,",
            subtitle: isPT ? "Seu momento de prazer e paz." : "Your moment of pleasure.",
            reviews_count: isPT ? "Ver Avaliações" : "Reviews",
            reviews_title: isPT ? "O que dizem os clientes" : "Reviews",
            select_time_title: isPT ? "Agendamento" : "Booking",
            date_sub: isPT ? "Horários disponíveis:" : "Available slots:",
            location_title: isPT ? "Local de Atendimento" : "Location",
            input_name: isPT ? "Seu Nome" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "District",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento" : "Unit/Apt",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Quarto" : "Room",
            motel_note: isPT ? "Motel: Combinamos detalhes no WhatsApp." : "Motel: Details on WhatsApp.",
            pay_title: isPT ? "Pagamento" : "Payment",
            pay_pix: "Pix",
            pay_card: isPT ? "Cartão" : "Card",
            pay_cash: isPT ? "Dinheiro" : "Cash",
            extras_title: isPT ? "Adicionais (Opcional)" : "Add-ons",
            coupon_title: isPT ? "Seus Cupons" : "Your Coupons",
            coupon_select: isPT ? "Selecionar desconto" : "Select discount",
            coupon_applied: isPT ? "Cupom Ativo!" : "Applied!",
            coupon_none: isPT ? "Sem cupons" : "No coupons",
            remove: isPT ? "Remover" : "Remove",
            total_label: "Total",
            book_btn: isPT ? "Finalizar no WhatsApp" : "Finish on WhatsApp",
            next_btn: isPT ? "Continuar" : "Continue",
            uber_note: isPT ? "+ Taxa Uber (Ida/Volta)" : "+ Uber Fee",
            success_title: isPT ? "Pedido Gerado!" : "Order Generated!",
            success_sub: isPT ? "Envie a mensagem pronta no WhatsApp para confirmar." : "Send the message on WhatsApp.",
            whatsapp_btn: isPT ? "Enviar Agora" : "Send Now",
            back_home: isPT ? "Voltar" : "Back",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            currency: isPT ? "R$" : "$",
            level_gold_title: isPT ? "Nível Ouro (Máximo)" : "Gold Level",
            level_gold_desc: isPT ? "Você possui desconto fixo." : "Fixed discount.",
            level_next: isPT ? "Próximo cupom:" : "Next coupon:",
            level_label: isPT ? "Nível" : "Level",
            empty_date: isPT ? "Selecione um dia acima" : "Select a day above",
            empty_slots: isPT ? "Agenda lotada ou encerrada." : "Schedule full.",
            try_tomorrow: isPT ? "Tente selecionar amanhã." : "Try tomorrow.",
            details_label: isPT ? "Detalhes Importantes:" : "Details:",
            discount_applied: isPT ? "Desconto aplicado:" : "Discount applied:",
            security_note: isPT ? "Dados salvos apenas no seu celular." : "Data saved locally.",
            
            // LEVEL UP TEXTOS - CORRIGIDOS
            popup_welcome_title: isPT ? "Bem-vindo!" : "Welcome!",
            popup_welcome_msg: isPT ? "Você ganhou R$ 12,00 OFF na primeira vez." : "You got R$ 12.00 OFF.",
            popup_level_title: isPT ? "SUBIU DE NÍVEL!" : "LEVEL UP!",
            popup_level_msg: isPT ? "Parabéns! Você desbloqueou um NOVO CUPOM de desconto para usar agora." : "Congrats! You unlocked a NEW COUPON.",
            popup_btn_coupon: isPT ? "USAR MEU CUPOM" : "USE COUPON",
            
            agree_terms: isPT ? "Li e concordo com as regras de higiene e respeito." : "I agree with rules.",
            
            terms_body: isPT ? [
              "1. Higiene: Material descartável e banho tomado.",
              "2. Sigilo: Privacidade absoluta garantida.",
              "3. Respeito: Profissionalismo acima de tudo.",
              "4. Pagamento: Ao final do atendimento."
            ] : ["1. Hygiene.", "2. Secrecy.", "3. Respect.", "4. Payment."],
            terms_title: isPT ? "Regras" : "Rules",
            terms_link: isPT ? "Ler regras" : "Read rules",
            terms_btn: isPT ? "Entendi" : "Got it",
            btn_close: isPT ? "Fechar" : "Close",
        
            zap: {
              intro: isPT ? "Oi Thalyson! Vim pelo App e quero agendar:" : "Hi Thalyson!",
              section_serv: isPT ? "🔥 *SERVIÇO*" : "🔥 *SERVICE*",
              section_det: isPT ? "📝 *DETALHES*" : "📝 *DETAILS*",
              section_loc: isPT ? "📍 *LOCAL*" : "📍 *LOCATION*",
              section_fin: isPT ? "💰 *VALORES*" : "💰 *VALUES*",
              map_link: isPT ? "🗺️ *Ver no Mapa:*" : "🗺️ *Map:*",
              wait: isPT ? "Aguardo retorno!" : "Waiting reply!",
              house: isPT ? "Casa" : "Home",
              hotel: "Hotel",
              motel: "Motel"
            },
            
            xp_text: "XP",
            scarcity_msg: isPT ? "pessoas vendo agora" : "people viewing"
        }
    };
};

// ==================================================================================
// 2. COMPONENTES
// ==================================================================================

const LoadingScreen = ({ isDark, text }) => (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center animate-pulse shadow-2xl shadow-blue-500/50">
                <span className="text-2xl font-black text-white">TM</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1.5 animate-bounce">
                <Check size={16} className="text-white" strokeWidth={3}/>
            </div>
        </div>
        <h1 className="mt-8 text-xl font-bold tracking-tight animate-pulse">Thalyson Massagens</h1>
        <div className="mt-4 flex items-center gap-2 text-xs opacity-50 font-mono">
            <Loader2 size={14} className="animate-spin"/>
            {text}
        </div>
    </div>
);

const Modal = ({ isOpen, onClose, children, title, isDark }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className={`relative w-full max-w-md rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl max-h-[85vh] flex flex-col ${isDark ? 'bg-zinc-900 border border-zinc-800 text-white' : 'bg-white text-zinc-900'}`}>
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
            {title && <h3 className="text-xl font-bold">{title}</h3>}
            <button onClick={onClose} className={`p-2 rounded-full ${isDark ? 'bg-zinc-800' : 'bg-zinc-100'}`}><X size={20}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide">{children}</div>
      </div>
    </div>
  );
};

const LevelCard = ({ xp, isDark, levels, text }) => {
    let currentLevel = levels[0];
    let nextLevel = levels[1];

    for (let i = 0; i < levels.length; i++) {
        if (xp >= levels[i].xpNeeded) {
            currentLevel = levels[i];
            nextLevel = levels[i+1] || null;
        }
    }

    const progress = nextLevel 
        ? Math.min(100, Math.max(0, ((xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100))
        : 100;

    return (
        <div className={`relative overflow-hidden rounded-3xl p-5 mb-6 border shadow-lg transition-all ${isDark ? 'bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700' : 'bg-white border-slate-100'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-cyan-400 shadow-lg shadow-blue-500/20`}>
                        <Trophy className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider opacity-60">{text.level_label}</span>
                        <h3 className={`font-black text-lg ${currentLevel.color}`}>{currentLevel.title}</h3>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-black">{xp}</span>
                    <span className="text-[10px] font-bold opacity-50 block">{text.xp_text}</span>
                </div>
            </div>

            {nextLevel ? (
                <>
                    <div className="flex justify-between text-xs font-bold mb-1 opacity-70">
                        <span>{progress.toFixed(0)}%</span>
                        <span>{text.level_next} {nextLevel.title}</span>
                    </div>
                    <div className={`h-3 w-full rounded-full overflow-hidden ${isDark ? 'bg-black/30' : 'bg-slate-100'}`}>
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="mt-2 text-[10px] opacity-50 text-center">{nextLevel.xpNeeded - xp} XP para {text.currency} {nextLevel.reward} OFF</p>
                </>
            ) : (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
                    <Sparkles className="text-amber-500" size={16}/>
                    <span className="text-xs font-bold text-amber-500">Nível Máximo!</span>
                </div>
            )}
        </div>
    );
};

// ==================================================================================
// 3. APP
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  
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
    service: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null,
    termsAccepted: false
  });

  useEffect(() => {
    setIsClient(true);
    setTimeout(() => setLoading(false), 2500);

    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            setUser(JSON.parse(s));
        } else {
            setUser(p => ({...p, coupons: [{ id: 'lvl1', val: 12, title: '🎁 Boas Vindas' }]}));
        }
    } catch (e) {
        console.warn("Storage disabled");
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
          try {
              localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); 
          } catch(e) {}
      }
  }, [user, isClient, loading]);

  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const triggerScarcity = () => {
      const randomViewers = Math.floor(Math.random() * 4) + 2; 
      setViewers(randomViewers);
      setShowScarcity(true);
      if(scarcityTimeout.current) clearTimeout(scarcityTimeout.current);
      scarcityTimeout.current = setTimeout(() => setShowScarcity(false), 3000);
  };

  const availableTimes = useMemo(() => {
      if (!booking.date) return [];
      const now = new Date();
      const selectedDate = new Date(booking.date);
      const isToday = selectedDate.getDate() === now.getDate() && 
                      selectedDate.getMonth() === now.getMonth() &&
                      selectedDate.getFullYear() === now.getFullYear();

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
    if (!booking.service) return { total: 0, sub: 0, disc: 0 };
    let sub = booking.service.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DATA.extras.find(e=>e.id===k).price; });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking.service, booking.extras, booking.appliedCoupon, DATA.extras]);

  const canProceed = useCallback(() => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      if (!user.name || user.name.trim().length < 2) return false;
      if (booking.locationType === 'home') return booking.address.street && booking.address.number && booking.address.city;
      if (booking.locationType === 'hotel') return booking.address.placeName && booking.address.city;
      return true; 
    }
    return !!booking.payment && booking.termsAccepted;
  }, [step, booking, user.name]);

  const finishBooking = () => {
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) {
        updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }
    const oldXP = user.xp;
    const newXP = oldXP + getFinancials.total;
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
        locTxt = `🏠 *${T.zap.house}:* ${fullAddr}\n📝 *Comp:* ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `🏩 *${T.zap.motel}:* Definir no chat.`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `🏨 *${T.zap.hotel}:* ${fullAddr}\n🚪 *Quarto:* ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    const encodedQuery = encodeURIComponent(mapQuery);
    const mapLink = mapQuery ? `https://www.google.com/maps/search/?api=1&query=${encodedQuery}` : '';

    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
        const ext = DATA.extras.find(e=>e.id===k);
        return `✅ + ${ext.label}`;
    }).join('\n');

    const msg = `
${T.zap.intro} *${user.name}*

${T.zap.section_serv}
💆‍♂️ *${booking.service.title}*
📅 ${dateStr} às ${booking.time}

${extrasList ? `${T.zap.section_det}\n${extrasList}\n` : ''}
${T.zap.section_loc}
${locTxt}
${mapLink ? `\n${T.zap.map_link} ${mapLink}` : ''}

${T.zap.section_fin}
Subtotal: ${T.currency} ${f.sub}
Desconto: - ${T.currency} ${f.disc}
${T.uber_note}

💎 *TOTAL: ${T.currency} ${f.total}*
Pagamento: *${booking.payment.toUpperCase()}*

${T.zap.wait}
`.trim();

    const zapUrl = `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
    window.open(zapUrl, '_blank');
  };

  if (loading) return <LoadingScreen isDark={isDark} text={T.loading} />;
  if (!isClient) return <div className="bg-zinc-950 h-screen w-full" />;

  return (
    <div className={`h-[100dvh] w-full font-sans flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* SCARCITY */}
      <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[90] pointer-events-none transition-all duration-500 ${showScarcity ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
           <div className="bg-black/80 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/10">
               <Eye size={18} className="text-emerald-400 animate-pulse" />
               <span className="text-xs font-bold tracking-wide">{viewers} {T.scarcity_msg}</span>
           </div>
      </div>

      {/* HEADER */}
      <header className={`h-16 px-6 flex items-center justify-between z-20 shrink-0 ${isDark ? 'bg-zinc-950 border-b border-zinc-800' : 'bg-white border-b border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-blue-500/30">TM</div>
          <span className="font-bold text-sm tracking-tight">Thalyson Massagens</span>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-600'}`}><Globe size={18}/></button>
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-amber-400' : 'bg-slate-100 text-blue-600'}`}>{isDark ? <Sun size={18}/> : <Moon size={18}/>}</button>
            <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className={`p-2 rounded-full ${isDark ? 'bg-zinc-900 text-pink-500' : 'bg-slate-100 text-pink-600'}`}><Instagram size={18}/></a>
        </div>
      </header>

      {/* CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-32 scroll-smooth relative">
        <div className={`fixed top-16 left-0 w-full h-6 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}></div>

        <div className="max-w-md mx-auto space-y-8 pt-2">

          {/* STEP 0: SERVICES */}
          {step === 0 && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-1">{T.welcome} <span className="text-blue-500">{user.name ? user.name.split(' ')[0] : 'Visitante'}</span></h1>
                <p className={`text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.subtitle}</p>
                
                <LevelCard xp={user.xp} isDark={isDark} levels={DATA.levels} text={T} />
                
                <button onClick={() => setReviewsOpen(true)} className="w-full mt-2 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-xl bg-blue-500/10 text-blue-500 text-sm font-bold cursor-pointer hover:bg-blue-500/20 active:scale-95 transition-transform">
                   <Star size={14} fill="currentColor"/> {T.reviews_count}
                </button>
              </div>

              <div className="space-y-4">
                {DATA.services.map(s => (
                  <div key={s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} 
                    className={`p-5 rounded-3xl border-2 cursor-pointer transition-all active:scale-[0.98] ${booking.service?.id === s.id ? 'border-blue-500 bg-blue-500/5' : (isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-white')}`}
                  >
                      <div className="flex justify-between items-center mb-3">
                        <div className={`p-3 rounded-2xl ${booking.service?.id === s.id ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><s.icon size={24}/></div>
                        <div className="text-right">
                           <span className="block text-xl font-bold">{T.currency} {s.price}</span>
                           <span className="text-[10px] uppercase font-bold opacity-60">{s.min} min</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg mb-1">{s.title}</h3>
                      <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{s.desc}</p>
                      
                      {booking.service?.id === s.id && (
                          <div className={`mt-3 p-3 rounded-xl text-xs leading-relaxed animate-fade-in ${isDark ? 'bg-black/20 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>
                             <div className="flex items-center gap-2 font-bold mb-1 text-blue-500"><Info size={12}/> {T.details_label}</div>
                             <p className="whitespace-pre-line">{s.details}</p>
                          </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: DATE */}
          {step === 1 && (
            <div className="animate-slide-in">
              <div className="text-center mb-6">
                 <h2 className="text-xl font-bold">{T.select_time_title}</h2>
                 <p className={`text-xs mt-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.date_sub}</p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 mb-6">
                {[...Array(14)].map((_, i) => { 
                  const d = new Date(); 
                  d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  
                  let lbl = d.toLocaleDateString(lang==='pt'?'pt-BR':'en-US', {weekday:'short'}).slice(0,3);
                  if(i===0) lbl=T.today; 
                  if(i===1) lbl=T.tomorrow;

                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                      className={`min-w-[70px] h-20 rounded-2xl flex flex-col items-center justify-center gap-1 border-2 transition-all flex-shrink-0 active:scale-95 ${isSel ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500' : 'bg-white border-slate-200 text-slate-400')}`}
                    >
                      <span className="text-[10px] font-bold uppercase">{lbl}</span>
                      <span className="text-xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              
              {!booking.date && (
                   <div className="text-center py-10 opacity-30">
                       <p className="text-sm font-bold">{T.empty_date}</p>
                   </div>
              )}

              {booking.date && availableTimes.length === 0 && (
                   <div className="text-center py-10 opacity-50 border-2 border-dashed rounded-xl border-zinc-700">
                       <p className="text-sm font-bold">{T.empty_slots}</p>
                       <p className="text-xs mt-1">{T.try_tomorrow}</p>
                   </div>
              )}

              <div className={`grid grid-cols-4 gap-3 ${!booking.date ? 'opacity-30 pointer-events-none' : ''}`}>
                 {availableTimes.map(t => (
                     <div key={t} className="relative group">
                        <button onClick={() => { setBooking(b => ({...b, time: t})); triggerScarcity(); }}
                            className={`w-full py-3 rounded-xl text-xs font-bold border transition-all active:scale-95 ${booking.time === t ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}
                        >
                            {t}
                        </button>
                     </div>
                 ))}
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-xl font-bold text-center mb-6">{T.location_title}</h2>
              <div className={`flex p-1 rounded-xl mb-6 ${isDark ? 'bg-zinc-900' : 'bg-slate-100'}`}>
                 {[{id:'home', l:T.zap.house, i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                    <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`flex-1 py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${booking.locationType === x.id ? (isDark ? 'bg-zinc-800 text-white shadow' : 'bg-white text-black shadow') : 'opacity-50 hover:opacity-100'}`}>
                        <x.i size={14}/> {x.l}
                    </button>
                 ))}
              </div>

              <div className="space-y-4">
                 <div>
                    <label className={`text-xs font-bold ml-1 mb-1 block uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.input_name}</label>
                    <input value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} className={`w-full p-4 rounded-2xl border outline-none text-base transition-colors focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-200 text-slate-900'}`} />
                    <p className={`text-[10px] mt-2 flex items-center gap-1 ${isDark?'text-zinc-500':'text-zinc-400'}`}><ShieldCheck size={10}/> {T.security_note}</p>
                 </div>

                 {booking.locationType === 'home' && (
                     <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-[1fr_80px] gap-3">
                           <input value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} placeholder={T.input_addr} className={`p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                           <input type="tel" value={booking.address.number} onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder={T.input_num} className={`p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        </div>
                        <input value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={T.input_bairro} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={T.input_city} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={T.input_comp} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                     </div>
                 )}
                 
                 {booking.locationType === 'hotel' && (
                    <div className="space-y-4 animate-fade-in">
                        <input value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} placeholder={T.input_hotel} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={T.input_city} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                        <input value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={T.input_room} className={`w-full p-4 rounded-2xl border outline-none focus:border-blue-500 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}/>
                    </div>
                 )}

                 {booking.locationType === 'motel' && (
                    <div className={`p-4 rounded-2xl border text-center text-sm ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                        <BedDouble className="mx-auto mb-2 opacity-50" size={24}/>
                        {T.motel_note}
                    </div>
                 )}
              </div>

              <div className="pt-6 border-t border-dashed border-zinc-700/50 mt-6">
                 <h3 className={`text-xs font-bold uppercase mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.extras_title}</h3>
                 <div className="space-y-3">
                    {DATA.extras.map(ex => (
                       <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] ${booking.extras[ex.id] ? 'bg-blue-500/10 border-blue-500' : (isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200')}`}>
                          <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-xl ${booking.extras[ex.id] ? 'bg-blue-500 text-white' : (isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500')}`}><ex.icon size={18}/></div>
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
            </div>
          )}

          {/* STEP 3: CHECKOUT */}
          {step === 3 && (
            <div className="animate-slide-in pb-10">
               <div className={`p-6 rounded-3xl border shadow-xl ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-dashed border-gray-500/20">
                     <span className="font-bold text-lg">{booking.service.title}</span>
                     <span className="font-bold text-lg">{T.currency} {booking.service.price}</span>
                  </div>
                  {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                      <div key={k} className="flex justify-between text-sm opacity-60 mb-2">
                          <span>+ {DATA.extras.find(e=>e.id===k).label}</span>
                          <span>{DATA.extras.find(e=>e.id===k).price}</span>
                      </div>
                  ))}
                  
                  {/* COUPON CARD */}
                  <div className="mt-4 mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold opacity-60 mb-2"><Tag size={14}/> {T.coupon_title}</div>
                      
                      {user.coupons.length > 0 ? (
                        <div className="grid gap-2">
                            {user.coupons.map(c => {
                                const isApplied = booking.appliedCoupon?.id === c.id;
                                return (
                                    <div key={c.id} onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                        className={`relative p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-[0.98] flex justify-between items-center
                                            ${isApplied 
                                                ? 'border-emerald-500 bg-emerald-500/10' 
                                                : (isDark ? 'border-zinc-800 bg-zinc-900' : 'border-slate-200 bg-slate-50')
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${isApplied ? 'bg-emerald-500 text-white' : 'bg-gray-500/10 text-gray-500'}`}>
                                                <Ticket size={16}/>
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm">{c.title}</p>
                                                <p className={`text-[10px] ${isApplied ? 'text-emerald-500 font-bold' : 'opacity-60'}`}>{isApplied ? T.coupon_applied : T.coupon_select}</p>
                                            </div>
                                        </div>
                                        <span className={`block font-black text-sm ${isApplied ? 'text-emerald-500' : 'opacity-50'}`}>-{T.currency}{c.val}</span>
                                    </div>
                                )
                            })}
                        </div>
                      ) : (
                          <div className="text-center py-4 opacity-50 text-xs border border-dashed rounded-xl">{T.coupon_none}</div>
                      )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-dashed border-gray-500/20 flex justify-between items-end">
                      <div>
                          <span className="text-[10px] font-bold uppercase opacity-50">{T.total_label}</span>
                          <p className="text-xs text-amber-500 font-medium mt-1">{T.uber_note}</p>
                      </div>
                      <span className="text-3xl font-black">{T.currency} {getFinancials.total}</span>
                  </div>
               </div>

               <div className="mt-6">
                   <h3 className="text-xs font-bold uppercase opacity-50 mb-3 ml-2">{T.pay_title}</h3>
                   <div className="grid grid-cols-3 gap-3">
                       {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'money', l:T.pay_cash, i:Banknote}].map(p => (
                           <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`py-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${booking.payment === p.id ? 'bg-blue-600 text-white border-blue-600' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-white border-slate-200 hover:border-slate-300')}`}>
                               <p.i size={20}/> <span className="text-[10px] font-bold uppercase">{p.l}</span>
                           </button>
                       ))}
                   </div>
               </div>
               
               <div className={`mt-8 p-4 rounded-2xl border flex flex-col gap-3 ${isDark ? 'bg-amber-900/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                    <div className="flex items-start gap-3">
                         <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18}/>
                         <div>
                             <h4 className="text-sm font-bold text-amber-500 mb-1">{T.terms_title}</h4>
                             <p className="text-xs opacity-70 mb-2 cursor-pointer underline" onClick={() => setTermsOpen(true)}>{T.terms_link}</p>
                         </div>
                    </div>
                    <label className="flex items-center gap-3 p-3 rounded-xl bg-black/5 cursor-pointer">
                        <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="w-5 h-5 accent-blue-600 rounded"/>
                        <span className="text-xs font-bold">{T.agree_terms}</span>
                    </label>
               </div>

            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-10 text-center animate-scale-in">
                 <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 mb-6 animate-bounce-slow">
                     <Check size={48} className="text-white" strokeWidth={4}/>
                 </div>
                 <h1 className="text-3xl font-black mb-2">{T.success_title}</h1>
                 <p className="opacity-60 max-w-xs mx-auto mb-10">{T.success_sub}</p>
                 <button onClick={openZap} className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-lg shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95">
                     <MessageCircle size={24} fill="white"/> {T.whatsapp_btn}
                 </button>
                 <button onClick={()=>{setStep(0); setBooking({...booking, service: null, payment: '', appliedCoupon: null, termsAccepted: false});}} className="mt-8 text-xs font-bold uppercase opacity-50 tracking-widest hover:opacity-100">{T.back_home}</button>
             </div>
          )}

        </div>
      </main>

      {/* FOOTER */}
      {step < 4 && (
         <div className="fixed bottom-6 left-6 right-6 z-50">
            <div className={`p-2 rounded-[2rem] shadow-2xl flex items-center gap-4 pr-3 backdrop-blur-xl border ${isDark ? 'bg-zinc-900/90 border-zinc-700' : 'bg-white/90 border-zinc-200'}`}>
                {step > 0 && <button onClick={()=>setStep(step-1)} className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}><ChevronLeft size={20}/></button>}
                
                {step < 3 && booking.service && (
                    <div className="flex-1 pl-2">
                        <span className="block text-[9px] font-bold uppercase opacity-50">{T.total_label}</span>
                        <span className="block text-xl font-black">{T.currency} {getFinancials.total}</span>
                    </div>
                )}
                
                <button 
                    disabled={!canProceed()} 
                    onClick={() => step === 3 ? finishBooking() : setStep(s => s + 1)}
                    className={`h-12 px-6 rounded-full font-bold flex items-center justify-center gap-2 transition-all ${step < 3 ? 'ml-auto' : 'w-full'} ${!canProceed() ? 'bg-zinc-500 opacity-50 cursor-not-allowed text-white' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 active:scale-95'}`}
                >
                    {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={18}/>}
                </button>
            </div>
         </div>
      )}

      {/* MODAL REVIEWS */}
      <Modal isOpen={reviewsOpen} onClose={()=>setReviewsOpen(false)} title={T.reviews_title} isDark={isDark}>
         <div className="space-y-3">
            {DATA.reviews.map((r,i)=>(
               <div key={i} className={`p-4 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex justify-between mb-1"><span className="font-bold text-sm text-blue-500">{r.n}</span><div className="flex text-amber-400 gap-0.5">{[...Array(r.s)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}</div></div>
                   <p className="text-sm italic opacity-70">"{r.t}"</p>
               </div>
            ))}
         </div>
      </Modal>

      {/* MODAL TERMOS */}
      <Modal isOpen={termsOpen} onClose={()=>setTermsOpen(false)} title={T.terms_title} isDark={isDark}>
         <div className="space-y-4">
            {T.terms_body.map((t,i)=><p key={i} className="text-sm opacity-80 border-l-2 border-blue-500 pl-3">{t}</p>)}
            <button onClick={()=>setTermsOpen(false)} className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4">{T.terms_btn}</button>
         </div>
      </Modal>

      {/* POPUP DE LEVEL UP */}
      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                {/* Confete visual */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[2.5rem]">
                    <div className="absolute top-10 left-10 w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="absolute top-20 right-10 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                </div>

                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/40 animate-bounce">
                    <Gift size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">{T.popup_level_title}</h2>
                <p className="opacity-70 text-lg leading-relaxed mb-6">{T.popup_level_msg}</p>
                <button onClick={()=>setLevelUpPopup(false)} className="w-full py-4 bg-amber-500 text-white font-black rounded-2xl text-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20">
                    <Ticket size={20}/> {T.popup_btn_coupon}
                </button>
            </div>
        </div>
      )}

      {/* POPUP WELCOME */}
      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className={`relative p-8 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border ${isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white text-zinc-900'}`}>
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/40 animate-bounce">
                    <Gift size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-black mb-2">{T.popup_welcome_title}</h2>
                <p className="opacity-70 text-lg leading-relaxed mb-6">{T.popup_welcome_msg}</p>
                <button onClick={()=>{setWelcomePopup(false); setUser(u=>({...u, hasSeenWelcome: true}));}} className="w-full py-4 bg-white text-black font-black rounded-2xl text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-xl">
                    <Ticket size={20}/> {T.popup_btn_coupon}
                </button>
            </div>
        </div>
      )}

      <div className={`fixed top-0 left-0 w-full h-8 z-10 pointer-events-none bg-gradient-to-b ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>
      <div className={`fixed bottom-0 left-0 w-full h-24 z-10 pointer-events-none bg-gradient-to-t ${isDark ? 'from-zinc-950' : 'from-slate-50'} to-transparent`}/>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .animate-fade-in { animation: fadeIn 0.6s ease-out; } 
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); } 
        .animate-slide-in { animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-bounce-slow { animation: bounce 3s infinite; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(30px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9) translateY(20px); opacity: 0; } to { transform: scale(1) translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
