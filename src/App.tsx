import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, MapPin, ChevronLeft, Zap, Menu, X, Globe, 
  User, Building, BedDouble, Trash2, 
  Heart, Smile, Instagram, Moon, Sun, ShieldCheck, 
  CheckCircle2, Home, Share2, 
  CreditCard, Banknote, QrCode, Trophy, Info, Car
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÕES
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/seumssagista", 
  STORAGE_KEY: '@thaly_app_v19_welcoming', 
  XP_TARGET: 500, 
};

// TEXTOS ACOLHEDORES E CLAROS
const TEXTS = {
  pt: {
    welcome: "Olá,",
    subtitle: "Escolha como deseja relaxar hoje.",
    reviews_count: "Ver avaliações de clientes",
    reviews_title: "O que dizem sobre mim",
    choose_service: "1. Escolha sua Sessão",
    duration: "min",
    currency: "R$",
    select_time_title: "2. Data e Horário",
    date_sub: "Selecione o melhor dia para o seu atendimento",
    time_title: "Horários Disponíveis",
    location_title: "3. Onde será o atendimento?",
    input_name: "Seu Nome (Como prefere ser chamado)",
    input_addr: "Endereço (Rua e Bairro)",
    input_comp: "Complemento ou Ponto de Referência",
    input_hotel: "Nome do Hotel",
    input_room: "Número do Quarto",
    motel_note: "Para Motéis: Combinamos o local exato pelo WhatsApp.",
    pay_title: "4. Forma de Pagamento",
    pay_pix: "PIX",
    pay_card: "Cartão",
    pay_cash: "Dinheiro",
    extras_title: "Deseja incluir algo a mais?",
    coupon_title: "Seus Cupons de Desconto",
    coupon_select: "Toque para selecionar",
    coupon_none: "Você não tem cupons no momento",
    remove: "Remover cupom",
    total_label: "Valor Total",
    book_btn: "ENVIAR PEDIDO",
    next_btn: "AVANÇAR",
    uber_note: "+ Taxa de deslocamento (Uber)",
    success_title: "Tudo pronto!",
    success_sub: "Agora basta enviar a confirmação no WhatsApp para garantir seu horário na minha agenda.",
    whatsapp_btn: "ENVIAR NO WHATSAPP",
    back_home: "Voltar para o início",
    address_warn: "Por favor, preencha onde devo ir.",
    today: "Hoje",
    tomorrow: "Amanhã",
    
    services: {
      relaxante: { title: "Relaxante", subtitle: "Leve e Tranquila", desc: "Movimentos suaves para tirar o peso das costas e acalmar a mente." },
      sensitiva: { title: "Sensitiva", subtitle: "Toque Pele com Pele", desc: "Uma massagem focada em sensações sutis e despertar o corpo." },
      mista: { title: "Completa", subtitle: "Relaxante + Sensitiva", desc: "Começa tirando a tensão muscular e termina com a parte sensitiva. Inclui finalização." }
    },
    
    extras_list: {
      more_time: { label: "+30 Minutos", sub: "Mais tempo de massagem" },
      touch: { label: "Toque Interativo", sub: "Você pode tocar também" },
      aroma: { label: "Aromaterapia", sub: "Óleos essenciais relaxantes" }
    },

    terms_body: [
      "1. Respeito: O atendimento é profissional. Qualquer conduta agressiva encerra a sessão.",
      "2. Higiene: Levo tudo higienizado e esterilizado. Prezo pela limpeza.",
      "3. Sigilo: Sua privacidade é total. O que acontece na sessão, fica na sessão.",
      "4. Motel: A entrada do motel é por conta do cliente.",
      "5. Pagamento: É feito logo após o término da massagem."
    ],
    terms_title: "Importante Saber",
    terms_agree: "Li e concordo com as",
    terms_link: "Regras de Atendimento",
    terms_btn: "Entendi e Concordo",

    zap: {
      greeting: ["Bom dia", "Boa tarde", "Boa noite"],
      intro: "Oi Thalyson! Gostaria de agendar:",
      section_serv: "💆‍♂️ SESSÃO",
      section_loc: "📍 LOCAL",
      section_fin: "💰 VALORES",
      item_serv: "Serviço:",
      item_extra: "Adicionais:",
      subtotal: "Subtotal:",
      discount: "Desconto:",
      uber_label: "🚗 Uber (Ida/Volta):",
      uber_val: "A calcular",
      total_pay: "Total a Pagar:",
      payment: "Pagamento:",
      wait: "Aguardo sua confirmação!"
    }
  },
  en: {
    welcome: "Hello,",
    subtitle: "Choose how you want to relax today.",
    reviews_count: "See client reviews",
    reviews_title: "Client Testimonials",
    choose_service: "1. Choose Session",
    duration: "min",
    currency: "R$",
    select_time_title: "2. Date & Time",
    date_sub: "Select the best day for you",
    time_title: "Available Hours",
    location_title: "3. Location",
    input_name: "Your Name",
    input_addr: "Address (Street & District)",
    input_comp: "Unit/Apt or Reference",
    input_hotel: "Hotel Name",
    input_room: "Room Number",
    motel_note: "For Motels: We decide the place on WhatsApp.",
    pay_title: "4. Payment Method",
    pay_pix: "PIX",
    pay_card: "Card",
    pay_cash: "Cash",
    extras_title: "Want to include extras?",
    coupon_title: "Your Coupons",
    coupon_select: "Tap to select",
    coupon_none: "No coupons available",
    remove: "Remove coupon",
    total_label: "Total Value",
    book_btn: "SEND REQUEST",
    next_btn: "NEXT STEP",
    uber_note: "+ Uber Fee (Round trip)",
    success_title: "All set!",
    success_sub: "Now just send the confirmation on WhatsApp to secure your slot.",
    whatsapp_btn: "SEND ON WHATSAPP",
    back_home: "Back to home",
    address_warn: "Please fill in the location.",
    today: "Today",
    tomorrow: "Tomorrow",

    services: {
      relaxante: { title: "Relaxing", subtitle: "Light & Peaceful", desc: "Gentle movements to remove back weight and calm the mind." },
      sensitiva: { title: "Sensitive", subtitle: "Skin-to-Skin", desc: "A massage focused on subtle sensations and body awakening." },
      mista: { title: "Complete", subtitle: "Relaxing + Sensitive", desc: "Starts with muscle relaxation and ends with the sensitive part. Finishing included." }
    },

    extras_list: {
      more_time: { label: "+30 Minutes", sub: "More massage time" },
      touch: { label: "Interactive Touch", sub: "You can touch too" },
      aroma: { label: "Aromatherapy", sub: "Relaxing essential oils" }
    },

    terms_body: [
      "1. Respect: Professional service. Aggression ends the session.",
      "2. Hygiene: I value hygiene. Everything is sterilized.",
      "3. Privacy: Guaranteed secrecy.",
      "4. Motel: Entrance fee is on the client.",
      "5. Payment: Done immediately after service."
    ],
    terms_title: "Good to Know",
    terms_agree: "I agree to the",
    terms_link: "Service Rules",
    terms_btn: "I Understand",

    zap: {
      greeting: ["Good morning", "Good afternoon", "Good evening"],
      intro: "Hi Thalyson! I'd like to book:",
      section_serv: "💆‍♂️ SESSION",
      section_loc: "📍 LOCATION",
      section_fin: "💰 VALUES",
      item_serv: "Service:",
      item_extra: "Extras:",
      subtotal: "Subtotal:",
      discount: "Discount:",
      uber_label: "🚗 Uber (Round Trip):",
      uber_val: "To calculate",
      total_pay: "Total to Pay:",
      payment: "Payment:",
      wait: "Waiting for confirmation!"
    }
  }
};

const DB = {
  services: [
    { id: 'relaxante', min: 60, price: 145, icon: Wind, color: 'text-teal-400' },
    { id: 'sensitiva', min: 60, price: 175, icon: Flame, color: 'text-rose-400' },
    { id: 'mista', min: 90, price: 255, icon: Zap, color: 'text-amber-400' }
  ],
  extras: [
    { id: 'more_time', price: 77, icon: Clock },
    { id: 'touch', price: 63, icon: Heart },
    { id: 'aroma', price: 5, icon: Smile }
  ],
  // LISTA COMPLETA DE AVALIAÇÕES (MANTIDA)
  reviews: [
    { name: "Tiago (Bela Vista)", text: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", stars: 5 },
    { name: "Anônimo", text: "O toque dele vicia. A finalização foi absurda, jorrei longe.", stars: 5 },
    { name: "Pedro H.", text: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", stars: 5 },
    { name: "Curioso SP", text: "Mão firme, pegada de macho. O óleo quente faz toda a diferença.", stars: 5 },
    { name: "M. (Jardins)", text: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", stars: 5 },
    { name: "Empresário", text: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", stars: 5 },
    { name: "M. (Casado)", text: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", stars: 5 },
    { name: "Roberto", text: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", stars: 5 },
    { name: "Fã", text: "Ele de cueca branca... sem comentários. Visual nota 1000.", stars: 5 },
    { name: "Carlos A.", text: "Profissionalismo raro hoje em dia. Pontual e educado.", stars: 5 },
    { name: "Lucas", text: "A mistura de força e suavidade é incrível. Recomendo.", stars: 5 },
    { name: "Novato", text: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", stars: 5 },
    { name: "Gustavo", text: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", stars: 5 },
    { name: "Felipe Personal", text: "Tinha muita dor na lombar, ele resolveu em uma sessão. Mão milagrosa.", stars: 5 },
    { name: "J.P.", text: "O corpo a corpo é quente de verdade. Uma experiência única.", stars: 5 },
    { name: "André", text: "Gostei que ele respeita os limites, mas entrega muito prazer.", stars: 5 },
    { name: "Turista RJ", text: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", stars: 5 },
    { name: "Anônimo", text: "Cara bonito, limpo e com pegada. O pacote completo.", stars: 5 },
    { name: "Breno", text: "Fiz a relaxante e dormi na maca de tão bom. Recomendo.", stars: 5 },
    { name: "Dr. Marcelo", text: "A técnica dele é diferente de tudo. Vale cada real.", stars: 5 },
    { name: "Caio", text: "Sensação de liberdade total. O toque extra é obrigatório.", stars: 5 },
    { name: "Vitor", text: "Me senti renovado. Energia lá em cima depois da sessão.", stars: 5 },
    { name: "Renan", text: "Extremamente educado e com papo bom, além da massagem top.", stars: 5 },
    { name: "Paulo", text: "O óleo de coco morno é um detalhe que faz toda diferença.", stars: 5 },
    { name: "Cliente Antigo", text: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", stars: 5 },
    { name: "Dica do Beto", text: "Não economizem, peçam a completa com aromaterapia.", stars: 5 },
    { name: "Advogado SP", text: "Pontualidade britânica. Chegou na hora marcada.", stars: 5 },
    { name: "Gym Rat", text: "Fiquei impressionado com a força das mãos dele.", stars: 5 },
    { name: "Anônimo", text: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", stars: 5 },
    { name: "Hétero Curioso", text: "Excelente profissional. Me deixou super confortável.", stars: 5 },
    { name: "Motorista", text: "Massagem terapêutica de verdade, tirou todos os nós das costas.", stars: 5 },
    { name: "M. (Sigilo)", text: "O sigilo é garantido mesmo. Pode confiar.", stars: 5 },
    { name: "Sr. João", text: "Agradeço pela paciência e pelo serviço impecável.", stars: 5 },
    { name: "Designer", text: "Experiência sensorial incrível. O cheiro, o toque, a música.", stars: 5 },
    { name: "Executivo", text: "Saí flutuando. Recomendo para quem tem rotina estressante.", stars: 5 },
    { name: "Matheus", text: "O Thalyson é muito gente fina. O tempo passou voando.", stars: 5 },
    { name: "Bruno", text: "Melhor investimento da semana. Relaxamento total.", stars: 5 },
    { name: "Rafa", text: "Toque firme, mas sensível. Sabe onde tocar.", stars: 5 },
    { name: "Tech Guy", text: "Gostei da facilidade de agendar pelo app. Sem enrolação.", stars: 5 },
    { name: "Corredor", text: "Massagem nos pés foi um bônus que eu não esperava. Ótimo.", stars: 5 },
    { name: "Fã #2", text: "Simpático e bonito. O serviço é completo mesmo.", stars: 5 },
    { name: "Pedro", text: "Me ajudou muito com a ansiedade. Gratidão.", stars: 5 },
    { name: "Morador Centro", text: "Fiz no meu apto e ele levou tudo, maca, toalhas. Prático.", stars: 5 },
    { name: "Curioso", text: "A massagem tântrica dele desbloqueou sensações novas.", stars: 5 },
    { name: "Ricardo", text: "Valeu a pena esperar a agenda liberar.", stars: 5 },
    { name: "Sérgio", text: "Nota 10. Nada a reclamar.", stars: 5 },
    { name: "Anônimo", text: "O final foi explosivo. Recomendo.", stars: 5 },
    { name: "Médico", text: "Muito higiênico e cuidadoso.", stars: 5 },
    { name: "Cliente Fiel", text: "Voltarei com certeza na próxima semana.", stars: 5 },
    { name: "Fernando", text: "Paz de espírito e corpo relaxado. Obrigado.", stars: 5 }
  ]
};

// ==================================================================================
// 2. MICRO-COMPONENTES (UI)
// ==================================================================================

// Bottom Sheet / Modal Acessível
const BottomSheet = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-zinc-950 border-t border-white/10 sm:border sm:rounded-3xl p-6 pb-8 animate-slide-up shadow-2xl h-[85vh] flex flex-col">
        <div className="w-16 h-1.5 bg-zinc-700 rounded-full mx-auto mb-6 flex-shrink-0 opacity-50"/>
        <div className="flex justify-between items-center mb-4 flex-shrink-0 px-2">
           <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
           <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white"><X size={24}/></button>
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-hide px-2">{children}</div>
      </div>
    </div>
  );
};

// Card de Serviço "Acolhedor"
const ServiceCard = ({ s, selected, onClick, T }) => (
  <div onClick={onClick} className={`relative p-6 rounded-3xl border-2 transition-all duration-200 cursor-pointer ${selected ? 'bg-blue-900/20 border-blue-500 shadow-xl' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
    <div className="flex justify-between items-start mb-3">
      <div className={`p-4 rounded-2xl ${selected ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
        <s.icon size={28} />
      </div>
      {selected && <div className="bg-blue-500 text-white p-1.5 rounded-full"><Check size={16} strokeWidth={4}/></div>}
    </div>
    <div className="mb-4">
      <h3 className="text-xl font-bold text-white mb-1">{T.services[s.id].title}</h3>
      <p className="text-sm font-medium text-blue-400">{T.services[s.id].subtitle}</p>
    </div>
    <p className="text-sm text-zinc-300 leading-relaxed mb-4 font-light">{T.services[s.id].desc}</p>
    <div className="flex items-center justify-between border-t border-white/5 pt-4">
      <span className="text-2xl font-bold text-white">{T.currency} {s.price}</span>
      <span className="text-sm text-zinc-500">{s.min} {T.duration}</span>
    </div>
  </div>
);

// ==================================================================================
// 3. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  
  // Modais
  const [menuOpen, setMenuOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });
  
  const scrollRef = useRef(null);
  const T = TEXTS[lang];

  // USUÁRIO E CUPONS
  const [user, setUser] = useState(() => {
    try {
       const s = localStorage.getItem(CONFIG.STORAGE_KEY);
       // INICIA COM CUPOM DE BOAS VINDAS
       const initialCoupons = [{ id: 'welcome', val: 12, title: 'Cupom Boas Vindas' }];
       if (!s) return { name: '', xp: 0, coupons: initialCoupons };
       return JSON.parse(s);
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // ESTADO DO AGENDAMENTO
  const [booking, setBooking] = useState({
    service: null, 
    extras: {}, 
    date: null, 
    time: null,
    locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', 
    appliedCoupon: null, 
    termsAccepted: false
  });

  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);
  
  // Scroll topo ao mudar etapa
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo(0,0); }, [step]);

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 3000);
  };

  const getFinancials = useMemo(() => {
    if (!booking.service) return { total: 0, sub: 0 };
    let sub = booking.service.price;
    Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) sub += DB.extras.find(e=>e.id===k).price });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { sub, disc, total: Math.max(0, sub - disc) };
  }, [booking]);

  const canProceed = () => {
    if (step === 0) return !!booking.service;
    if (step === 1) return !!booking.date && !!booking.time;
    if (step === 2) {
      const { street, number, comp, placeName, city } = booking.address;
      if (!user.name) return false;
      if (booking.locationType === 'home') return street && number && comp && city;
      if (booking.locationType === 'hotel') return placeName && city;
      return true; // Motel ok
    }
    return !!booking.payment && booking.termsAccepted;
  };

  const finishBooking = () => {
    // Remove cupom usado
    let updatedCoupons = [...user.coupons];
    if (booking.appliedCoupon) {
      updatedCoupons = updatedCoupons.filter(c => String(c.id) !== String(booking.appliedCoupon.id));
    }
    // Adiciona XP e possível cupom novo
    const newXP = user.xp + getFinancials.total;
    if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
        updatedCoupons.push({ id: Date.now(), val: 20, title: 'Cupom de Retorno' });
    }
    
    setUser({ ...user, xp: newXP, coupons: updatedCoupons });
    setStep(4);
  };

  const reset = () => {
    setStep(0);
    setBooking({ 
        service: null, extras: {}, date: null, time: null, locationType: 'home', 
        address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' }, 
        payment: '', appliedCoupon: null, termsAccepted: false 
    });
  };

  const openZap = () => {
    const f = getFinancials;
    const dateStr = booking.date.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US');
    
    let locTxt = "";
    if(booking.locationType === 'home') locTxt = `🏠 *${T.zap.section_loc} (Casa)*\n${booking.address.street}, ${booking.address.number}\nComp: ${booking.address.comp}\n${booking.address.district} - ${booking.address.city}`;
    else if(booking.locationType === 'motel') locTxt = `🏩 *${T.zap.section_loc} (Motel)*\nVamos combinar o local.`;
    else locTxt = `🏨 *${T.zap.section_loc} (Hotel)*\n${booking.address.placeName}\nQuarto: ${booking.address.comp}\n${booking.address.city}`;

    const extras = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>`+ ${T.extras_list[k].label}`).join('\n');

    const msg = `
${T.zap.greeting[1]}, Thalyson!
${T.zap.intro}

👤 *${user.name}*

${T.zap.section_serv}
${T.zap.item_serv} ${T.services[booking.service.id].title}
📅 ${dateStr} às ${booking.time}
${extras ? `${T.zap.item_extra}\n${extras}` : ''}

${locTxt}

${T.zap.section_fin}
${T.zap.subtotal} ${T.currency} ${f.sub},00
${f.disc > 0 ? `${T.zap.discount} - ${T.currency} ${f.disc},00` : ''}
${T.zap.uber_label} ${T.zap.uber_val}

✅ *${T.zap.total_pay} ${T.currency} ${f.total},00 + Uber*
${T.zap.payment} ${booking.payment.toUpperCase()}

${T.zap.wait}
`.trim();
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-zinc-950">
       <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-4xl animate-pulse">T.</div>
    </div>
  );

  return (
    <div className="h-[100dvh] w-full bg-zinc-950 text-zinc-100 font-sans flex flex-col overflow-hidden selection:bg-blue-500/30">
      
      {/* Toast Notification */}
      <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 pointer-events-none ${toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="bg-blue-600 px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 size={16}/> {toast.msg}
        </div>
      </div>

      {/* --- MENU --- */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] flex">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMenuOpen(false)}/>
           <div className="relative w-4/5 max-w-xs h-full bg-zinc-900 border-r border-white/10 p-6 shadow-2xl flex flex-col animate-slide-right">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="font-bold text-xl text-white">Menu</h2>
                 <button onClick={() => setMenuOpen(false)} className="p-2 bg-white/5 rounded-full"><X size={20}/></button>
              </div>
              <div className="p-5 bg-gradient-to-br from-blue-700 to-indigo-800 rounded-2xl mb-6 relative overflow-hidden">
                 <Trophy className="absolute -right-2 -bottom-2 text-white/10" size={100}/>
                 <p className="text-xs uppercase font-bold opacity-80 mb-1">Pontos de Fidelidade</p>
                 <p className="text-4xl font-black">{user.xp}</p>
                 <div className="w-full h-1.5 bg-black/30 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-white transition-all duration-1000" style={{width: `${(user.xp % 500)/5}%`}}/>
                 </div>
                 <p className="text-[10px] mt-2 opacity-70">Ganhe cupons acumulando pontos!</p>
              </div>
              <div className="space-y-3">
                 <button onClick={()=>setLang(l => l==='pt'?'en':'pt')} className="flex items-center gap-3 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10"><Globe size={20}/> {lang==='pt'?'English Version':'Versão em Português'}</button>
                 <a href={CONFIG.INSTAGRAM_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 text-blue-400 font-bold"><Instagram size={20}/> Instagram</a>
              </div>
           </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="h-20 px-6 flex items-center justify-between border-b border-white/5 bg-zinc-950/80 backdrop-blur-md z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white text-sm">T.</div>
          <div>
             <span className="font-bold text-base block leading-tight">Thalyson</span>
             <span className="text-[10px] text-zinc-400">Massoterapeuta</span>
          </div>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-3 bg-white/5 rounded-full hover:bg-white/10"><Menu size={24}/></button>
      </header>

      {/* --- CONTENT --- */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-6 pb-36">
        <div className="max-w-md mx-auto space-y-10 animate-fade-in">

          {/* 0. SERVIÇOS */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-white">{T.welcome} {user.name.split(' ')[0]}</h1>
                <p className="text-zinc-400 text-base">{T.subtitle}</p>
                <button onClick={() => setReviewsOpen(true)} className="flex items-center gap-2 mt-2 bg-white/5 px-3 py-1.5 rounded-lg w-fit hover:bg-white/10 transition-colors">
                  <div className="flex text-amber-400"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <span className="text-xs font-bold text-white">{T.reviews_count}</span>
                </button>
              </div>

              <div className="space-y-2">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">{T.choose_service}</h2>
                <div className="grid gap-5">
                  {DB.services.map(s => (
                    <ServiceCard key={s.id} s={s} T={T} selected={booking.service?.id === s.id} onClick={() => setBooking(b => ({ ...b, service: s }))} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 1. DATA E HORA */}
          {step === 1 && (
            <>
              <div className="text-center pb-4">
                <h2 className="text-2xl font-bold text-white">{T.select_time_title}</h2>
                <p className="text-zinc-400 text-sm mt-1">{T.date_sub}</p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6">
                {[...Array(7)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = booking.date?.toDateString() === d.toDateString();
                  let label = d.toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US', { weekday: 'short' }).slice(0,3);
                  if(i===0) label=T.today; if(i===1) label=T.tomorrow;
                  
                  return (
                    <button key={i} onClick={() => setBooking(b => ({ ...b, date: d, time: null }))} 
                      className={`min-w-[80px] h-24 rounded-3xl flex flex-col items-center justify-center gap-1 border-2 transition-all ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                      <span className="text-[10px] uppercase font-bold">{label}</span>
                      <span className="text-3xl font-black">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>

              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest text-center">{T.time_title}</h3>
                 <div className="grid grid-cols-3 gap-4">
                    {['09:00','10:00','11:00','13:00','14:30','16:00','18:00','19:30','21:00'].map(time => {
                      // Verificação Simples de Data
                      let disabled = false;
                      if(booking.date) {
                         const now = new Date();
                         if(booking.date.toDateString() === now.toDateString() && parseInt(time) <= now.getHours()) disabled = true;
                      }
                      
                      const isSel = booking.time === time;

                      return (
                        <button key={time} disabled={disabled} onClick={() => setBooking(b => ({ ...b, time }))}
                          className={`py-4 rounded-2xl text-sm font-bold border-2 transition-all 
                            ${disabled ? 'opacity-30 cursor-not-allowed border-transparent bg-zinc-900' : 
                              isSel ? 'bg-white text-blue-900 border-white shadow-xl scale-105 z-10' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600'}`}
                        >
                          {time}
                        </button>
                      )
                    })}
                 </div>
              </div>
            </>
          )}

          {/* 2. LOCAL */}
          {step === 2 && (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">{T.location_title}</h2>
              </div>

              {/* Toggle Local */}
              <div className="flex bg-zinc-900 p-1.5 rounded-2xl mb-8 border border-zinc-800">
                {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(opt => (
                  <button key={opt.id} onClick={() => setBooking(b => ({ ...b, locationType: opt.id }))} 
                    className={`flex-1 py-4 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${booking.locationType === opt.id ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500'}`}>
                    <opt.i size={18}/> {opt.l}
                  </button>
                ))}
              </div>

              <div className="space-y-5">
                {/* Nome - Sempre visível */}
                <div className="space-y-1">
                   <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{T.input_name}</label>
                   <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500 transition-colors" placeholder="Ex: João Silva"/>
                </div>

                {/* Form Casa */}
                {booking.locationType === 'home' && (
                  <div className="space-y-5 animate-fade-in">
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-3 text-amber-500 text-sm">
                       <Info className="shrink-0" size={20}/> <p>{T.address_warn}</p>
                    </div>
                    
                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{T.input_addr}</label>
                       <div className="grid grid-cols-[1fr_90px] gap-3">
                          <input value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Rua / Avenida" />
                          <input type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Nº" />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <input value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Bairro" />
                       <input value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Cidade" />
                    </div>

                    <div className="space-y-1">
                       <label className="text-xs font-bold text-zinc-500 uppercase ml-1">{T.input_comp}</label>
                       <input value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Ex: Apto 302 / Próx. ao Mercado" />
                    </div>
                  </div>
                )}

                {/* Form Motel */}
                {booking.locationType === 'motel' && (
                  <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-3xl flex items-center gap-4 animate-fade-in">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400"><MessageCircle size={20}/></div>
                    <p className="text-sm text-blue-100 font-medium leading-relaxed">{T.motel_note}</p>
                  </div>
                )}

                {/* Form Hotel */}
                {booking.locationType === 'hotel' && (
                  <div className="space-y-5 animate-fade-in">
                    <input value={booking.address.placeName} onChange={e => setBooking({...booking, address: {...booking.address, placeName: e.target.value}})} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder={T.input_hotel} />
                    <div className="grid grid-cols-2 gap-3">
                      <input value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder="Cidade" />
                      <input value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} className="bg-zinc-800 border border-zinc-700 text-white rounded-2xl px-5 py-4 text-base outline-none focus:border-blue-500" placeholder={T.input_room} />
                    </div>
                  </div>
                )}
              </div>

              {/* Extras */}
              <div className="pt-8 border-t border-white/5 mt-8">
                <h3 className="text-sm font-bold uppercase text-zinc-500 mb-6">{T.extras_title}</h3>
                <div className="space-y-4">
                  {DB.extras.map(ex => (
                    <div key={ex.id} onClick={() => setBooking(prev => ({ ...prev, extras: { ...prev.extras, [ex.id]: !prev.extras[ex.id] } }))} 
                      className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-blue-600/10 border-blue-500' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'}`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${booking.extras[ex.id] ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}><ex.icon size={20}/></div>
                        <div>
                          <p className="text-base font-bold text-white">{T.extras_list[ex.id].label}</p>
                          <p className="text-xs text-zinc-400">{T.extras_list[ex.id].sub}</p>
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${booking.extras[ex.id] ? 'text-blue-400' : 'text-zinc-600'}`}>+ {T.currency} {ex.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 3. RESUMO */}
          {step === 3 && (
            <>
              <h2 className="text-2xl font-bold text-center text-white mb-8">{T.resume_title}</h2>
              
              {/* Card Resumo */}
              <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-xl space-y-6">
                
                {/* Item Principal */}
                <div className="flex justify-between items-start pb-4 border-b border-zinc-800">
                   <div>
                      <p className="font-bold text-lg text-white">{T.services[booking.service.id].title}</p>
                      <p className="text-xs text-zinc-500">{T.services[booking.service.id].subtitle}</p>
                   </div>
                   <p className="font-bold text-lg text-white">{T.currency} {booking.service.price}</p>
                </div>

                {/* Extras */}
                {Object.keys(booking.extras).some(k=>booking.extras[k]) && (
                   <div className="space-y-3 pb-4 border-b border-zinc-800">
                      {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                        <div key={k} className="flex justify-between text-sm text-zinc-400">
                           <span>+ {T.extras_list[k].label}</span>
                           <span>{T.currency} {DB.extras.find(e=>e.id===k).price}</span>
                        </div>
                      ))}
                   </div>
                )}

                {/* Cupom */}
                <div className="bg-zinc-950 rounded-2xl p-4 flex items-center justify-between border border-zinc-800">
                    <div className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                       <div className="p-2 bg-zinc-900 rounded-lg"><Ticket size={16}/></div>
                       {T.coupon_title}
                    </div>
                    {user.coupons.length > 0 ? (
                      booking.appliedCoupon ? (
                        <button onClick={() => setBooking(b => ({...b, appliedCoupon: null}))} className="text-xs text-red-400 font-bold hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition-colors">{T.remove}</button>
                      ) : (
                        <select onChange={(e) => {
                          const c = user.coupons.find(cup => String(cup.id) === e.target.value);
                          setBooking(b => ({...b, appliedCoupon: c}));
                        }} className="bg-transparent text-sm font-bold text-blue-500 outline-none text-right cursor-pointer">
                          <option value="">{T.coupon_select}</option>
                          {user.coupons.map(c => <option key={c.id} value={c.id}>R$ {c.val} OFF</option>)}
                        </select>
                      )
                    ) : <span className="text-xs text-zinc-600 font-medium">{T.coupon_none}</span>}
                </div>

                {/* Totais */}
                <div className="space-y-2 pt-2">
                   {booking.appliedCoupon && (
                     <div className="flex justify-between text-sm text-green-500 font-bold">
                        <span>Desconto</span>
                        <span>- {T.currency} {booking.appliedCoupon.val}</span>
                     </div>
                   )}
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-zinc-500 uppercase">{T.total_label}</span>
                      <span className="text-4xl font-black text-white tracking-tight">{T.currency} {getFinancials.total}</span>
                   </div>
                   <div className="flex items-center gap-2 text-xs text-amber-500 font-medium bg-amber-500/10 p-2 rounded-lg w-fit">
                      <Car size={14}/> {T.uber_note}
                   </div>
                </div>
              </div>

              {/* Pagamento */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase text-zinc-500 mb-4 ml-1">{T.pay_title}</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[{id:'pix', l:T.pay_pix, i:QrCode}, {id:'card', l:T.pay_card, i:CreditCard}, {id:'cash', l:T.pay_cash, i:Banknote}].map(p => (
                    <button key={p.id} onClick={() => setBooking(b => ({...b, payment: p.id}))}
                      className={`flex flex-col items-center justify-center gap-2 py-5 rounded-2xl border-2 transition-all ${booking.payment === p.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}>
                      <p.i size={24}/> <span className="text-xs font-bold uppercase">{p.l}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Termos */}
              <div onClick={() => setBooking(b => ({...b, termsAccepted: !b.termsAccepted}))} className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 mt-6 cursor-pointer hover:bg-zinc-900 transition-colors">
                 <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${booking.termsAccepted ? 'bg-blue-600 border-blue-600' : 'border-zinc-600'}`}>
                    {booking.termsAccepted && <Check size={16} className="text-white"/>}
                 </div>
                 <p className="text-sm text-zinc-400 leading-relaxed">{T.terms_agree} <span onClick={(e)=>{e.stopPropagation(); setTermsOpen(true);}} className="text-blue-400 underline font-bold">{T.terms_link}</span>.</p>
              </div>
            </>
          )}

          {/* 4. SUCESSO */}
          {step === 4 && (
            <div className="flex flex-col items-center justify-center pt-24 text-center animate-scale-in">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)] mb-8">
                 <Check size={48} className="text-zinc-950" strokeWidth={4}/>
              </div>
              
              <h1 className="text-4xl font-black text-white mb-4">{T.success_title}</h1>
              <p className="text-zinc-400 text-base max-w-[280px] mx-auto leading-relaxed mb-12">{T.success_sub}</p>
              
              <button onClick={openZap} className="w-full py-5 bg-[#25D366] hover:bg-[#1da851] text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all text-lg">
                <MessageCircle size={28} fill="white"/> {T.whatsapp_btn}
              </button>
              
              <button onClick={reset} className="mt-10 text-xs text-zinc-500 hover:text-white uppercase font-bold tracking-widest">{T.back_home}</button>
            </div>
          )}

        </div>
      </main>

      {/* --- STICKY FOOTER --- */}
      {step < 4 && (
        <div className="h-28 px-6 border-t border-white/10 bg-zinc-950/90 backdrop-blur-xl flex items-center shrink-0 z-30 pb-4">
          <div className="w-full max-w-md mx-auto flex items-center gap-4">
            {step > 0 && (
               <button onClick={() => setStep(step - 1)} className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                 <ChevronLeft size={28}/>
               </button>
            )}

            <button 
              disabled={!canProceed()} 
              onClick={() => step === 3 ? finishBooking() : setStep(step + 1)}
              className={`h-16 rounded-2xl font-bold flex items-center justify-center gap-3 px-6 transition-all shadow-lg active:scale-95 flex-1 text-lg
                ${!canProceed() ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-blue-600 text-white shadow-blue-600/30'}`}
            >
              {step === 3 ? T.book_btn : T.next_btn} {step !== 3 && <ArrowRight size={24}/>}
            </button>
          </div>
        </div>
      )}

      {/* --- MODAIS --- */}
      <BottomSheet isOpen={reviewsOpen} onClose={() => setReviewsOpen(false)} title={T.reviews_title}>
         <div className="space-y-4">
            {DB.reviews.map((r, i) => (
               <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex justify-between mb-3">
                     <span className="font-bold text-blue-400 text-sm">{r.name}</span>
                     <div className="flex text-amber-400 gap-0.5">{[...Array(r.stars)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                  </div>
                  <p className="text-sm text-zinc-300 italic leading-relaxed">"{r.text}"</p>
               </div>
            ))}
         </div>
      </BottomSheet>

      <BottomSheet isOpen={termsOpen} onClose={() => setTermsOpen(false)} title={T.terms_title}>
         <div className="space-y-6 text-sm text-zinc-300 leading-relaxed font-light">
            {T.terms_body.map((t,i)=><p key={i} className="p-4 bg-zinc-900 rounded-xl border border-white/5">{t}</p>)}
         </div>
         <button onClick={()=>setTermsOpen(false)} className="w-full mt-8 py-5 bg-blue-600 text-white font-bold rounded-2xl text-lg">{T.terms_btn}</button>
      </BottomSheet>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.6s ease-out; }
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-slide-right { animation: slideRight 0.3s ease-out; }
        .animate-scale-in { animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}
