import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Check, X, HelpCircle, CreditCard, MapPin, Calendar, Clock, Briefcase, Bed, Shield, Users, Flame, Star, Instagram, Info, Flower } from 'lucide-react';

// --- ESTILOS GLOBAIS ---
// ADICIONADO: text-size-adjust para evitar zoom indesejado no iPhone e suporte a dvh
const globalStyles = `
  /* Ocultar barra de rolagem nativa */
  ::-webkit-scrollbar { width: 0px; height: 0px; background: transparent; }
  * { 
    scrollbar-width: none; 
    -ms-overflow-style: none; 
    -webkit-tap-highlight-color: transparent; 
    -webkit-text-size-adjust: 100%; /* Fix iOS font scaling */
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
    
  input { user-select: text; font-size: 16px; }
  /* Ajuste seguro para iPhone X e novos Androids */
  .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
    
  @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  .modal-animate { animation: zoomIn 0.2s ease-out forwards; }
    
  /* Animação Suave da Mensagem (Fade Lateral) */
  @keyframes messageIn {
    0% { opacity: 0; transform: translateX(-10px); }
    100% { opacity: 1; transform: translateX(0); }
  }
  .animate-message-in { animation: messageIn 0.6s ease-out forwards; }

  @keyframes pulse-soft {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }
`;

const IconBack = () => <ChevronLeft className="w-6 h-6" />;

// --- TIPOS ---
type Service = {
  id: string;
  name: string;
  description: string;
  labelDuration: string;
  minutes: number;
  basePrice: number;
  details: string[];
  isExplicit?: boolean;
  highlight?: string;
};

type LocationOption = {
  id: string;
  label: string;
  sublabel: string;
  fee: number | null; 
  allowsTableChoice?: boolean;
};

// --- DADOS ---
const services: Service[] = [
  {
    id: 'relaxante',
    name: 'Massagem Relaxante',
    description: 'Foco total em alívio muscular e dores. Terapia corporal completa.',
    labelDuration: '40 min', 
    minutes: 40, 
    basePrice: 70,
    details: [
      "💆‍♂️ Cabeça (Cervical)",
      "💪 Costas e Ombros (Trapézio)",
      "✋ Braços e Mãos",
      "🦵 Pernas, Coxas e Pés",
      "🚫 Terapia sem toques íntimos",
      "✨ Foco: Alívio de dores e tensão"
    ]
  },
  {
    id: 'tantrica',
    name: 'Massagem Masculina',
    description: 'Experiência sensorial completa. Massagem pélvica (Lingam) com ética.',
    labelDuration: '60 min', 
    minutes: 60, 
    basePrice: 110,
    isExplicit: true,
    highlight: "🔥 A MAIS PEDIDA",
    details: [
      "🔥 Técnica da Relaxante inclusa",
      "🍑 Região Glútea",
      "🦵 Parte interna das coxas",
      "🍆 Massagem Pélvica (Lingam)",
      "💦 Com Finalização",
      "✨ Foco: Prazer e Relaxamento total"
    ]
  },
];

const locations: LocationOption[] = [
  {
    id: 'santa-fe',
    label: 'Na casa do cliente (Santa Fé)',
    sublabel: 'Vou até você. Atendimento na sua cama ou sofá.',
    fee: 40,
    allowsTableChoice: true,
  },
  {
    id: 'outras-cidades',
    label: 'Região',
    sublabel: 'Apenas Cama ou Sofá (Não levo maca)',
    fee: null, 
    allowsTableChoice: false, 
  },
  {
    id: 'motel',
    label: 'Na Suíte privada (Motel)',
    sublabel: 'Ambiente climatizado, seguro e sigilo.',
    fee: 75,
    allowsTableChoice: false,
  },
];

const timeSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

// --- UTILS & COMPONENTS ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
};

const ReviewsCarousel = () => {
  const [index, setIndex] = useState(0);
  const reviews = [
    { text: "Gostei bastante, mas 40 min passou muito rápido. Vou pegar 1h na próxima.", author: "Carlos (Jales)", rating: 4 },
    { text: "Mão muito boa, pesada na medida certa. Sai renovado.", author: "Renan (Santa Fé)", rating: 5 },
    { text: "Achei o óleo um pouco frio no começo, mas a técnica compensa demais.", author: "Paulo (Três Fronteiras)", rating: 4 },
    { text: "Fizemos na suíte do motel, foi bem tranquilo e profissional. Voltarei.", author: "Lucas M.", rating: 5 },
    { text: "Pontual e discreto. O atendimento em casa facilita muito.", author: "Gustavo (Santa Fé)", rating: 5 },
    { text: "Melhor massagem da região, sem dúvida.", author: "Felipe (Três Fronteiras)", rating: 5 },
    { text: "O agendamento por aqui é muito prático.", author: "André (Urânia)", rating: 5 },
    { text: "Tira toda a tensão das costas. Recomendo.", author: "Bruno (Santa Fé)", rating: 5 },
    { text: "Profissional educado e respeitoso.", author: "Marcos (Rubinéia)", rating: 5 },
    { text: "Achei difícil achar horário de noite, mas valeu a pena a espera.", author: "Roberto (Jales)", rating: 4 },
    { text: "A maca portátil é bem confortável, nem parece que ta em casa.", author: "Diego (Santa Fé)", rating: 5 },
    { text: "Relaxamento total. Dormi depois da sessão.", author: "Sérgio (Três Fronteiras)", rating: 5 },
    { text: "Preço justo pelo serviço entregue.", author: "Fernando (Santa Clara)", rating: 5 },
    { text: "Técnica muito boa para dores lombares.", author: "Vitor (Santa Fé)", rating: 5 },
    { text: "Atendimento nota 10.", author: "Ricardo (Aparecida)", rating: 5 }
  ];

  useEffect(() => {
    const timer = setInterval(() => { setIndex((prev) => (prev + 1) % reviews.length); }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-8 bg-[#1e293b]/30 border border-slate-700/30 rounded-2xl p-4 relative overflow-hidden backdrop-blur-sm w-full max-w-sm mx-auto h-32 flex flex-col justify-center">
      {reviews.map((review, i) => (
        <div key={i} className={`absolute inset-0 flex flex-col justify-center items-center text-center px-4 transition-opacity duration-1000 ${i === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
          <div className="flex gap-1 mb-2 opacity-90 justify-center">
            {[...Array(5)].map((_, starI) => (
              <Star 
                key={starI} 
                className={`w-3 h-3 ${starI < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'}`} 
              />
            ))}
          </div>
          <p className="text-sm text-slate-300 italic font-light leading-relaxed line-clamp-2">"{review.text}"</p>
          <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wide">- {review.author}</p>
        </div>
      ))}
    </div>
  );
};

const LiveStatusMessage = () => {
  const [msgIndex, setMsgIndex] = useState(0);
    
  const messages = [
    { text: "Rafael (Santa Fé) acabou de agendar" },
    { text: "Levando relaxamento até Três Fronteiras..." },
    { text: "Toque firme e técnica apurada" },
    { text: "Lucas (Jales) reservou horário" },
    { text: "Atendimento discreto e sem pressa" },
    { text: "Indo atender em domicílio agora..." },
    { text: "Felipe (Santa Fé) garantiu a vaga" },
    { text: "Sessão na suíte finalizada com sucesso" },
    { text: "Bruno (Três Fronteiras) está agendando" },
    { text: "Óleos essenciais e maca portátil" },
    { text: "João (Santa Fé) avaliou: 'Mãos excelentes'" },
    { text: "Últimos horários da noite disponíveis" },
    { text: "Carlos (Urânia) reservou Tântrica" },
    { text: "Levando a maca para Santa Clara..." },
    { text: "Eduardo (Santa Fé) acabou de agendar" },
    { text: "Massagem focada em aliviar tensão" },
    { text: "Gabriel (Três Fronteiras) confirmou" },
    { text: "Chegando no horário combinado" },
    { text: "Vitor (Santa Fé) reservou para hoje" },
    { text: "Experiência sensorial única" },
    { text: "André (Rubinéia) está online" },
    { text: "Roberto (Santa Fé) acabou de agendar" },
    { text: "Diego (Jales) avaliou com 4 estrelas" },
    { text: "Ricardo (Santa Fé) garantiu horário" },
    { text: "Sérgio (Três Fronteiras) reservou agora" },
    { text: "Atendimento na cama ou maca (você escolhe)" },
    { text: "Fernando (Santa Fé) acabou de agendar" }
  ];

  useEffect(() => {
    const interval = setInterval(() => { setMsgIndex((prev) => (prev + 1) % messages.length); }, 4000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center h-12">
        {messages.map((msg, i) => (
           i === msgIndex && (
             <div key={i} className="animate-message-in bg-white/5 backdrop-blur-md border border-white/10 pl-3 pr-4 py-2 rounded-2xl rounded-tl-sm shadow-xl flex items-center gap-2 max-w-[200px]">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shrink-0"></div>
                <span className="text-slate-200 text-[10px] font-medium leading-tight">
                  {msg.text}
                </span>
             </div>
           )
        ))}
    </div>
  );
};

export default function App() {
  const [step, setStep] = useState<'home' | 'identity' | 'services' | 'configure' | 'success'>('home');
  const [showFaq, setShowFaq] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [detailService, setDetailService] = useState<Service | null>(null);
    
  const [userName, setUserName] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [isHealthOk, setIsHealthOk] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption | null>(null);
  const [upgradeEnabled, setUpgradeEnabled] = useState(false);
   
  const [useTable, setUseTable] = useState<boolean | null>(null); 

  const [currentViewDate, setCurrentViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [greeting, setGreeting] = useState('');

  const timesSectionRef = useRef<HTMLDivElement>(null);
  const locationSectionRef = useRef<HTMLDivElement>(null);
  const surfaceSectionRef = useRef<HTMLDivElement>(null);
  const extrasSectionRef = useRef<HTMLDivElement>(null);

  // --- LÓGICA DE DETECÇÃO DE BROWSER E INTENT (ANDROID) ---
  useEffect(() => {
    // Tenta detectar se está dentro do Instagram/Facebook no Android e sugere Chrome
    const userAgent = navigator.userAgent || navigator.vendor;
    const isInstagram = userAgent.includes('Instagram');
    const isFB = userAgent.includes('FBAN') || userAgent.includes('FBAV');
    const isAndroid = /android/i.test(userAgent);

    if (isAndroid && (isInstagram || isFB)) {
       // Tenta redirecionar via Intent para o Chrome
       const url = window.location.href;
       const intentUrl = `intent://${url.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
       // Descomente a linha abaixo para forçar o redirecionamento imediato (pode ser bloqueado pelo app)
       // window.location.href = intentUrl;
       console.log("Ambiente in-app detectado. Layout otimizado via dvh.");
    }
  }, []);

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const handlePrevMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentViewDate(new Date(currentViewDate.getFullYear(), currentViewDate.getMonth() + 1, 1));
  const isSameDay = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isPast = (day: number) => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const dateToCheck = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day);
    return dateToCheck < today;
  };
  const isTimeBlocked = (timeStr: string) => {
    if (!selectedDate) return true;
    const now = new Date();
    const isToday = selectedDate.getDate() === now.getDate() && selectedDate.getMonth() === now.getMonth() && selectedDate.getFullYear() === now.getFullYear();
    if (!isToday) return false;
    const [slotHour] = timeStr.split(':').map(Number);
    return slotHour <= now.getHours();
  };

  useEffect(() => {
    if (selectedDate && timesSectionRef.current) {
      setTimeout(() => {
        timesSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedTime && locationSectionRef.current && step === 'configure') {
      setTimeout(() => {
        locationSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [selectedDate, selectedTime, step]);

  useEffect(() => {
    if (selectedLocation && step === 'configure') {
       setTimeout(() => {
        if (selectedLocation.allowsTableChoice) {
           surfaceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
           extrasSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
    }
  }, [selectedLocation, step]);

  useEffect(() => {
    if (useTable !== null && step === 'configure') {
      setTimeout(() => {
        extrasSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 400);
    }
  }, [useTable, step]);

  const handleIdentitySubmit = () => {
    if (userName.trim().length < 3) { setErrorMsg('Digite seu nome para continuar.'); return; }
    if (!isAdult) { setErrorMsg('Confirme ser maior de 18 anos.'); return; }
    if (!isHealthOk) { setErrorMsg('Confirme que está bem de saúde.'); return; }
    setErrorMsg('');
    setGreeting(getGreeting());
    setStep('services');
  };

  const calculateTotal = () => {
    if (!selectedService || !selectedLocation) return 0;
    let total = selectedService.basePrice;
    if (selectedLocation.fee !== null) total += selectedLocation.fee;
    if (upgradeEnabled) total += selectedService.basePrice * 0.5;
    return total;
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setSelectedLocation(null);
    setUpgradeEnabled(false);
    setUseTable(null);
    setSelectedDate(null);
    setSelectedTime('');
    setStep('configure');
  };

  const handleWhatsAppClick = () => {
    if (!selectedService || !selectedLocation) return;
      
    if (!selectedDate || !selectedTime) { 
      setShowCalendar(true); 
      return; 
    }

    if (selectedLocation.allowsTableChoice && useTable === null) {
      alert("Por favor, selecione se prefere na Cama ou na Maca para continuar.");
      surfaceSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const E = {
      brilho: '\u2728',     
      user: '\uD83D\uDC64', 
      cal: '\uD83D\uDCC5',  
      mass: '\uD83D\uDC86', 
      pin: '\uD83D\uDCCD',  
      cama: '\uD83D\uDECF', 
      din: '\uD83D\uDCB0',  
      ok: '\u2705',         
      predio: '\uD83C\uDFE2'
    };

    const total = calculateTotal();
     
    let totalMinutes = selectedService.minutes;
    let durationText = `${totalMinutes} min`;
    if (upgradeEnabled) {
      totalMinutes += 30;
      durationText = `${selectedService.minutes} min + 30 min extra`;
    }

    let surfaceText = "";
    if (selectedLocation.allowsTableChoice) {
      surfaceText = useTable ? `${E.ok} Levar Maca Portátil` : `${E.cama} Na Cama do Cliente`;
    } else if (selectedLocation.id === 'outras-cidades') {
      surfaceText = `${E.cama} Cama ou Sofá`;
    } else {
      surfaceText = `${E.predio} Estrutura do Motel`;
    }

    const formattedDate = selectedDate.toLocaleDateString('pt-BR');
    const isToday = new Date().toDateString() === selectedDate.toDateString();
    const dateDisplay = isToday ? `${formattedDate} (HOJE)` : formattedDate;

    const message = `${E.brilho} *NOVO PEDIDO DE AGENDAMENTO*

${E.user} *Cliente:* ${userName}
${E.ok} Maior de 18 | ${E.ok} Liberado p/ Massagem

${E.cal} *${dateDisplay}* às *${selectedTime}*

${E.mass} *${selectedService.name}*
⏱ Duração: ${durationText}

${E.pin} *Local:* ${selectedLocation.label}
${surfaceText}

${E.din} *Valor Final: R$ ${total.toFixed(2)}* (Pix)
_${selectedLocation.fee ? 'Já inclui taxa de deslocamento' : 'Frete a combinar'}_

------------------------------
Olá, gostaria de confirmar se este horário está livre.`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  const resetFlow = () => {
    setStep('home');
    setUserName('');
    setIsAdult(false);
    setIsHealthOk(false);
    setSelectedService(null);
    setSelectedLocation(null);
    setUpgradeEnabled(false);
    setSelectedDate(null);
    setSelectedTime('');
  };

  useEffect(() => { setCurrentViewDate(new Date()); }, []);

  const UserHeader = () => (
    <div className="flex justify-end items-center mb-4 shrink-0 bg-[#1e293b] p-3 rounded-2xl border border-slate-700">
      <div className="text-right">
        <p className="text-[10px] text-slate-400 uppercase tracking-wide">{greeting}</p>
        <p className="text-[#0ea5e9] font-bold text-sm truncate max-w-[200px]">{userName}</p>
      </div>
    </div>
  );

  return (
    // WRAPPER PRINCIPAL - Ajustado para 100dvh para corrigir visual no Instagram/WebView
    <div className="min-h-[100dvh] bg-[#020617] flex items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <style>{globalStyles}</style>
        
      {/* CONTAINER DO APP */}
      <div className="w-full max-w-[450px] min-h-[100dvh] sm:min-h-[850px] sm:max-h-[90vh] bg-[#0f172a] sm:rounded-[30px] shadow-2xl relative overflow-y-auto flex flex-col font-sans text-white border-0 sm:border-8 border-[#1e293b] scrollbar-hide">
        
        {/* --- MODAL DETALHES --- */}
        {detailService && (
          <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl p-6 border border-slate-700 shadow-2xl relative modal-animate mx-auto">
              <div className="flex justify-between items-start mb-6">
                <div><span className="text-[#0ea5e9] text-xs font-bold uppercase tracking-wider">Como funciona a</span><h3 className="text-2xl font-bold text-white leading-tight">{detailService.name}</h3></div>
                <button onClick={() => setDetailService(null)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4 mb-8">
                <p className="text-slate-300 text-sm italic border-l-2 border-[#0ea5e9] pl-3">{detailService.description}</p>
                <div className="bg-[#0f172a] rounded-xl p-4 border border-slate-700">
                  <h4 className="text-white font-bold mb-3 flex items-center gap-2 text-sm uppercase"><Check className="w-4 h-4 text-[#0ea5e9]" /> O que está incluso:</h4>
                  <ul className="space-y-2">{detailService.details.map((item, idx) => (<li key={idx} className="text-slate-300 text-sm flex items-start gap-2"><span className="text-[#0ea5e9] mt-1">•</span> {item}</li>))}</ul>
                </div>
              </div>
              <div className="pb-8">
                <button onClick={() => { handleServiceSelect(detailService); setDetailService(null); }} className="w-full bg-[#0ea5e9] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0284c7] active:scale-95 transition-all">Escolher essa Massagem</button>
              </div>
            </div>
          </div>
        )}

        {/* TELA SUCESSO */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-300">
            <div className="w-24 h-24 bg-[#0ea5e9]/10 rounded-full flex items-center justify-center mb-6 animate-pulse-green"><Check className="w-12 h-12 text-[#0ea5e9]" strokeWidth={3} /></div>
            <h2 className="text-3xl font-bold text-white mb-2">Quase lá, {userName}!</h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">Seu agendamento foi gerado. <br/><strong className="text-white">Envie a mensagem</strong> no WhatsApp para confirmar.</p>
            <div className="w-full max-w-xs space-y-4">
              <button onClick={handleWhatsAppClick} className="w-full bg-[#1e293b] border border-[#0ea5e9]/30 text-[#0ea5e9] py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#0ea5e9]/10 transition-colors">Reenviar WhatsApp</button>
              <button onClick={resetFlow} className="w-full bg-slate-800 text-slate-400 py-4 rounded-xl font-bold hover:text-white transition-colors">Voltar ao Início</button>
            </div>
          </div>
        )}

        {/* POP-UP CALENDÁRIO */}
        {showCalendar && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl border border-slate-700 shadow-2xl relative modal-animate flex flex-col max-h-[85vh] overflow-hidden mx-auto">
              <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#0f172a] shrink-0">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-[#0ea5e9]" /> Escolha o Dia</h3>
                <button onClick={() => setShowCalendar(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="overflow-y-auto p-4 scrollbar-hide">
                <div className="flex justify-between items-center mb-4 px-2">
                  <button onClick={handlePrevMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"><ChevronLeft className="w-5 h-5 text-slate-300" /></button>
                  <span className="font-bold text-lg capitalize text-white w-32 text-center">{currentViewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).split(' de ').join(' ')}</span>
                  <button onClick={handleNextMonth} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"><ChevronRight className="w-5 h-5 text-slate-300" /></button>
                </div>
                <div className="grid grid-cols-7 mb-2 text-center">
                  {['D','S','T','Q','Q','S','S'].map(d => <span key={d} className="text-xs font-bold text-slate-500">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {Array.from({ length: getFirstDayOfMonth(currentViewDate) }).map((_, i) => <div key={`empty-${i}`} className="h-10" />)}
                  {Array.from({ length: getDaysInMonth(currentViewDate) }).map((_, i) => {
                    const day = i + 1;
                    const dateToCheck = new Date(currentViewDate.getFullYear(), currentViewDate.getMonth(), day);
                    const disabled = isPast(day);
                    const isSelected = selectedDate && isSameDay(selectedDate, dateToCheck);
                    return (
                      <button key={day} disabled={disabled} onClick={() => { setSelectedDate(dateToCheck); setSelectedTime(''); }} className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all ${isSelected ? 'bg-[#0ea5e9] text-white shadow-lg scale-110' : ''} ${!isSelected && !disabled ? 'text-white hover:bg-slate-700 bg-slate-800/50' : ''} ${disabled ? 'text-slate-700 cursor-not-allowed opacity-30' : ''}`}>{day}</button>
                    );
                  })}
                  {Array.from({ length: 42 - (getFirstDayOfMonth(currentViewDate) + getDaysInMonth(currentViewDate)) }).map((_, i) => <div key={`fill-${i}`} className="h-10" />)}
                </div>
                {selectedDate && (
                  <div ref={timesSectionRef} className="animate-in slide-in-from-bottom-2 pt-4 border-t border-slate-700 min-h-[200px]">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-[#0ea5e9]" /> Horários Livres (Dia {selectedDate.getDate()})</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((time) => {
                        const disabled = isTimeBlocked(time);
                        return (
                          <button key={time} disabled={disabled} onClick={() => setSelectedTime(time)} className={`py-2 rounded-lg text-xs font-bold border transition-all ${selectedTime === time ? 'bg-[#0ea5e9] border-[#0ea5e9] text-white shadow-md' : ''} ${!selectedTime && !disabled ? 'bg-[#0f172a] border-slate-700 text-slate-300 hover:border-[#0ea5e9]' : ''} ${disabled ? 'bg-slate-800/50 border-slate-800 text-slate-600 cursor-not-allowed' : ''}`}>{time}</button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-700 bg-[#0f172a] shrink-0">
                <button disabled={!selectedDate || !selectedTime} onClick={() => setShowCalendar(false)} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${(!selectedDate || !selectedTime) ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#0ea5e9] text-white hover:bg-[#0284c7] active:scale-95'}`}>{(!selectedDate || !selectedTime) ? 'Escolha o Dia e Hora' : 'Confirmar Data'}</button>
              </div>
            </div>
          </div>
        )}

        {/* FAQ MODAL */}
        {showFaq && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1e293b] w-full max-w-sm rounded-2xl p-6 border border-slate-700 shadow-2xl relative modal-animate flex flex-col max-h-[85vh] mx-auto">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="text-xl font-bold text-white flex items-center gap-2"><HelpCircle className="w-6 h-6 text-[#0ea5e9]" /> Dúvidas / Regras</h3>
                <button onClick={() => setShowFaq(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-6 text-sm overflow-y-auto pr-2 scrollbar-hide max-h-[60vh]">
                <div className="space-y-2">
                  <h4 className="text-red-400 font-bold flex items-center gap-2 sticky top-0 bg-[#1e293b] py-1 z-10"><Shield className="w-4 h-4" /> Respeito e Conduta</h4>
                  <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                    <p className="text-slate-200 text-sm leading-relaxed">Trabalho com <strong>Terapia Corporal Estrita</strong>.<br/><br/><span className="text-white font-bold">🚫 Não faço programa sexual</span> (não tem sexo/penetração). É massagem para relaxar e não cansar haha.</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[#0ea5e9] font-bold flex items-center gap-2 sticky top-0 bg-[#1e293b] py-1 z-10"><CreditCard className="w-4 h-4" /> Pagamento</h4>
                  <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-700">
                    <p className="text-slate-300 mb-3">Aceito <strong>PIX</strong> (sem taxa) e cartões (Taxa cliente).</p>
                    <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/30"><span className="block text-xs text-slate-400 uppercase font-bold mb-2">Simulação (Tântrica + Uber):</span><div className="flex justify-between text-slate-300 text-xs mb-1"><span>Valor (110+40):</span><span>R$ 150,00</span></div><div className="flex justify-between text-[#0ea5e9] font-bold border-t border-slate-600 pt-2 mt-1"><span>Crédito (Aprox):</span><span>~R$ 162,00</span></div></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[#0ea5e9] font-bold flex items-center gap-2 sticky top-0 bg-[#1e293b] py-1 z-10"><MapPin className="w-4 h-4" /> Locais</h4>
                  <ul className="list-disc list-inside text-slate-300 space-y-1 ml-1 bg-[#0f172a] p-3 rounded-xl border border-slate-700"><li><strong>Domicílio:</strong> Levo a maca e óleos.</li><li><strong>Suíte ( motel ):</strong> Ambiente climatizado e confortável. Sigilo total. Cliente arca com a suíte.</li></ul>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700 mt-2 bg-[#1e293b] shrink-0">
                <button onClick={() => setShowFaq(false)} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors active:scale-95">Voltar</button>
              </div>
            </div>
          </div>
        )}

        {/* --- HOME --- */}
        {step === 'home' && (
          <div className="flex-1 flex flex-col p-8 pt-16 bg-gradient-to-b from-[#0f172a] to-[#1e293b] overflow-y-auto">
            <div className="flex justify-between z-10 shrink-0">
              <a href="https://www.instagram.com/thalymassagens/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-300 hover:text-[#0ea5e9] text-sm font-medium transition-colors bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-700 shadow-lg">
                <Instagram className="w-4 h-4" /> Instagram
              </a>
              <button onClick={() => setShowFaq(true)} className="flex items-center gap-2 text-slate-300 hover:text-[#0ea5e9] text-sm font-medium transition-colors bg-slate-800/80 backdrop-blur-sm px-3 py-2 rounded-full border border-slate-700 shadow-lg">
                <HelpCircle className="w-4 h-4" /> Dúvidas
              </button>
            </div>
              
            <div className="mt-10 flex flex-col items-center justify-start flex-grow">
              <div className="flex items-center justify-center gap-3 mb-6 w-full px-2">
                  {/* ICONE CENTRAL */}
                  <div className="w-20 h-20 bg-[#0ea5e9]/5 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.1)] border border-[#0ea5e9]/20 animate-[pulse-soft_3s_infinite] shrink-0">
                    <Flower className="w-10 h-10 text-[#0ea5e9]" strokeWidth={1.2} />
                  </div>
                  {/* BALÃO DE MENSAGEM (FLEX ROW) */}
                  <LiveStatusMessage />
              </div>
                
              <h1 className="text-4xl font-bold tracking-tight text-white mb-2 text-center">Foque no seu<br/><span className="text-[#0ea5e9]">Bem-estar</span></h1>
              
              <div className="w-full my-6">
                <ReviewsCarousel />
              </div>

              {/* Botão colado no conteúdo, sem ir pro rodapé */}
              <button onClick={() => setStep('identity')} className="w-full bg-[#0ea5e9] text-white font-bold text-lg py-5 rounded-2xl shadow-xl hover:bg-[#0284c7] transition-all active:scale-95">AGENDAR SESSÃO</button>
            </div>
          </div>
        )}

        {/* --- IDENTIDADE --- */}
        {step === 'identity' && (
          <div className="flex-1 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6 shrink-0"><button onClick={() => setStep('home')} className="text-slate-400 flex items-center gap-2 font-medium p-2 -ml-2 hover:text-white transition-colors"><IconBack /> Voltar</button></div>
            <h2 className="text-3xl font-bold mb-2 text-white shrink-0">Identificação</h2>
            
            <div className="space-y-6 mt-2">
              <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-700 focus-within:border-[#0ea5e9] transition-colors">
                <label className="block text-[#0ea5e9] text-xs font-bold uppercase mb-2">Seu Nome</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Como prefere ser chamado?" className="w-full bg-transparent text-white text-xl outline-none placeholder:text-slate-600" />
              </div>
              <div onClick={() => setIsAdult(!isAdult)} className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isAdult ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]' : 'bg-[#1e293b] border-slate-700'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isAdult ? 'border-[#0ea5e9] bg-[#0ea5e9]' : 'border-slate-500'}`}>{isAdult && <Check className="w-5 h-5 text-white" />}</div>
                <span className={isAdult ? 'text-white font-medium text-lg' : 'text-slate-400 text-lg'}>Sou maior de 18 anos</span>
              </div>
              <div onClick={() => setIsHealthOk(!isHealthOk)} className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${isHealthOk ? 'bg-[#0ea5e9]/10 border-[#0ea5e9]' : 'bg-[#1e293b] border-slate-700'}`}>
                <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isHealthOk ? 'border-[#0ea5e9] bg-[#0ea5e9]' : 'border-slate-500'}`}>{isHealthOk && <Check className="w-5 h-5 text-white" />}</div>
                <span className={isHealthOk ? 'text-white font-medium text-lg' : 'text-slate-400 text-lg'}>Estou liberado para a Massagem</span>
              </div>
              {errorMsg && (<div className="p-4 bg-red-500/10 text-red-400 text-sm rounded-xl text-center font-bold">{errorMsg}</div>)}
              
              <button onClick={handleIdentitySubmit} className="w-full bg-[#0ea5e9] text-white font-bold text-lg py-5 rounded-2xl shadow-xl active:scale-95 transition-transform mt-4">CONTINUAR</button>
            </div>
          </div>
        )}

        {/* --- SERVIÇOS --- */}
        {step === 'services' && (
          <div className="flex-1 flex flex-col p-6 pb-safe">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <button onClick={() => setStep('identity')} className="text-slate-400 flex items-center gap-2 p-2 -ml-2 hover:text-white transition-colors"><IconBack /></button>
              <UserHeader />
            </div>
              
            <div className="shrink-0 mb-6">
              <h2 className="text-3xl font-bold mb-2">Escolha</h2>
              <p className="text-slate-400">Qual experiência deseja hoje?</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pb-20 scrollbar-hide px-1">
              {services.map((service) => (
                <button key={service.id} onClick={() => setDetailService(service)} className={`w-full bg-[#1e293b] hover:bg-[#283548] p-6 rounded-3xl text-left transition-all active:scale-[0.98] border-l-4 shadow-lg relative overflow-hidden ${service.highlight ? 'border-yellow-500' : 'border-[#0ea5e9]'}`}>
                  {service.highlight && (
                    <div className="absolute top-0 right-0 bg-yellow-500 text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wide z-10">
                      {service.highlight}
                    </div>
                  )}
                  {/* AJUSTE DE ALINHAMENTO AQUI: gap-4, items-center, justify-between */}
                  <div className="flex justify-between items-center mb-3 relative z-10 gap-4">
                    <h3 className="text-2xl font-bold text-white transition-colors flex-1 leading-tight">{service.name}</h3>
                    <div className="flex flex-col items-end shrink-0">
                        {/* shrink-0 e whitespace-nowrap impedem que o preço quebre ou amasse */}
                        <span className="text-[#0ea5e9] font-bold text-xl whitespace-nowrap">R$ {service.basePrice}</span>
                    </div>
                  </div>
                  <p className="text-base text-slate-300 leading-relaxed mb-4 relative z-10">{service.description}</p>
                  <div className="flex justify-between items-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg text-sm text-slate-300 font-medium">⏱ {service.labelDuration}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- CONFIGURAÇÃO --- */}
        {step === 'configure' && selectedService && (
          <div className="flex-1 flex flex-col p-6 pb-safe">
            <div className="pb-2 shrink-0 z-10 flex justify-between items-center">
              <button onClick={() => setStep('services')} className="text-slate-400 flex items-center gap-2 font-medium p-2 -ml-2 hover:text-white transition-colors"><IconBack /> Trocar Serviço</button>
              <UserHeader />
            </div>

            <div className="flex-1 overflow-y-auto pt-2 pb-80 scrollbar-hide">
              <div className="bg-[#1e293b] p-6 rounded-3xl mb-8 border border-slate-700/50">
                <span className="text-[#0ea5e9] text-xs font-bold uppercase tracking-wider">Você escolheu</span>
                <h2 className="text-2xl font-bold text-white mt-1">{selectedService.name}</h2>
                <p className="text-slate-400 text-sm mt-1">Duração Base: {selectedService.labelDuration}</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-[#0ea5e9]"/> Data e Horário</h3>
                  <button onClick={() => setShowCalendar(true)} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all active:scale-[0.98] ${selectedDate && selectedTime ? 'bg-[#1e293b] border-[#0ea5e9] text-white shadow-[0_0_15px_rgba(14,165,233,0.15)]' : 'bg-[#1e293b] border-slate-700 text-slate-400 hover:border-slate-500'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedDate ? 'bg-[#0ea5e9] text-white' : 'bg-slate-800 text-slate-500'}`}><Calendar className="w-6 h-6" /></div>
                      <div className="text-left"><span className="block text-xs font-bold uppercase tracking-wide opacity-70 mb-1">{selectedDate ? 'Agendado para:' : 'Toque para escolher'}</span><span className={`block text-lg font-bold leading-tight ${selectedDate ? 'text-white' : 'text-slate-500'}`}>{selectedDate ? `${selectedDate.toLocaleDateString('pt-BR')} às ${selectedTime}` : 'Selecionar Data'}</span></div>
                    </div>
                    {selectedDate && <Check className="w-6 h-6 text-[#0ea5e9]" />}
                  </button>
                </div>

                <div ref={locationSectionRef}>
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-[#0ea5e9]"/> Local</h3>
                  <div className="space-y-3">
                    {locations.map((location) => {
                      const isSelected = selectedLocation?.id === location.id;
                      return (
                        <div key={location.id}>
                          <button onClick={() => { setSelectedLocation(location); setUseTable(null); }} className={`w-full p-5 rounded-2xl text-left transition-all border-2 active:scale-[0.98] ${isSelected ? 'bg-[#0ea5e9] border-[#0ea5e9] shadow-lg' : 'bg-[#1e293b] border-transparent hover:bg-[#283548]'}`}>
                            <div className="flex justify-between items-center gap-3">
                              <div><p className={`font-bold text-lg ${isSelected ? 'text-white' : 'text-slate-200'}`}>{location.label}</p><p className={`text-sm ${isSelected ? 'text-sky-100' : 'text-slate-500'}`}>{location.sublabel}</p></div>
                              <span className={`font-bold text-lg whitespace-nowrap shrink-0 ${isSelected ? 'text-white' : 'text-[#0ea5e9]'}`}>{location.fee !== null ? `+R$ ${location.fee}` : <span className={`text-xs px-2 py-1 rounded uppercase ${isSelected ? 'bg-white/20' : 'bg-slate-800 text-slate-400'}`}>A Calcular</span>}</span>
                            </div>
                          </button>
                          {isSelected && location.allowsTableChoice && (
                            <div ref={surfaceSectionRef} className="mt-3 ml-2 pl-4 border-l-2 border-[#0ea5e9]/30 space-y-2 animate-in slide-in-from-left-2">
                              <p className="text-[#0ea5e9] text-xs font-bold uppercase mb-2">Preferência de Superfície:</p>
                              
                              <button onClick={() => setUseTable(false)} className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${useTable === false ? 'bg-[#1e293b] border-[#0ea5e9] text-white' : 'border-slate-700 text-slate-400'}`}><Bed className={`w-5 h-5 ${useTable === false ? 'text-[#0ea5e9]' : 'text-slate-500'}`} /><div className="text-left"><span className="block font-bold text-sm">Na Cama Mesmo</span><span className="text-xs opacity-70">Mais prático</span></div>{useTable === false && <Check className="w-4 h-4 text-[#0ea5e9] ml-auto" />}</button>
                              
                              <button onClick={() => setUseTable(true)} className={`flex items-center gap-3 w-full p-3 rounded-xl border transition-all ${useTable === true ? 'bg-[#1e293b] border-[#0ea5e9] text-white' : 'border-slate-700 text-slate-400'}`}><Briefcase className={`w-5 h-5 ${useTable === true ? 'text-[#0ea5e9]' : 'text-slate-500'}`} /><div className="text-left"><span className="block font-bold text-sm">Levar Maca</span><span className="text-xs opacity-70">Eu levo equipamento</span></div>{useTable === true && <Check className="w-4 h-4 text-[#0ea5e9] ml-auto" />}</button>
                              
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div ref={extrasSectionRef} className="pt-6 border-t border-slate-800">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-[#0ea5e9]"/> Tempo Extra?</h3>
                  <button onClick={() => setUpgradeEnabled(!upgradeEnabled)} className={`w-full p-5 rounded-2xl text-left transition-all border-2 active:scale-[0.98] ${upgradeEnabled ? 'bg-[#0ea5e9] border-[#0ea5e9] shadow-lg' : 'bg-[#1e293b] border-transparent hover:bg-[#283548]'}`}>
                    <div className="flex justify-between items-center gap-3">
                      <div><p className={`font-bold text-lg ${upgradeEnabled ? 'text-white' : 'text-slate-200'}`}>Adicionar +30 Minutos</p><p className={`text-sm ${upgradeEnabled ? 'text-sky-100' : 'text-slate-500'}`}>Estender a experiência</p></div>
                      <span className={`font-bold text-lg whitespace-nowrap shrink-0 ${upgradeEnabled ? 'text-white' : 'text-[#0ea5e9]'}`}>+R$ {(selectedService.basePrice * 0.5).toFixed(0)}</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {selectedLocation && (
              <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/95 to-transparent pt-6 pb-safe px-4">
                <div className="w-full max-w-[450px] mx-auto bg-[#1e293b] border border-slate-700/50 p-4 shadow-2xl rounded-2xl mb-2 animate-in slide-in-from-bottom duration-300">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-slate-400 text-sm font-medium uppercase block">Total (PIX/Dinheiro)</span>
                        <button onClick={() => setShowFaq(true)} className="text-xs text-[#0ea5e9] underline mt-1 font-bold">Ver taxas do cartão</button>
                      </div>
                      <div className="text-right">
                        <span className="text-4xl font-bold text-[#0ea5e9] tracking-tight whitespace-nowrap">
                          R$ {calculateTotal().toFixed(2)}
                          {selectedLocation.fee === null && <span className="text-sm ml-1 text-slate-500">+ Frete</span>}
                        </span>
                      </div>
                    </div>
                    <button onClick={handleWhatsAppClick} className="w-full bg-[#0ea5e9] text-white py-4 rounded-xl font-bold text-xl hover:bg-[#0284c7] transition-all active:scale-[0.98] shadow-lg shadow-sky-500/20">
                      {selectedLocation.fee === null ? 'COMBINAR NO WHATSAPP' : 'FECHAR AGENDAMENTO'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
