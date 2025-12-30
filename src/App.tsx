import { useState, useEffect, useRef, useMemo } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Zap, Bell, ArrowRight, Eye, EyeOff,
  LogOut, RefreshCw, CreditCard, Banknote, QrCode, 
  Info, Send, Menu, Flame, Smile, Lock, TrendingUp,
  AlertTriangle, Navigation, ThumbsUp, User
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO & DADOS (BACKEND MOCK)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413",
  COLOR_PRIMARY: "#D4AF37", // Dourado Premium
  COLOR_ACCENT: "#1E1E1E",
  ANIMATION_SPEED: "0.4s",
};

const SERVICES = [
  { 
    id: 'masculina', name: 'Experiência Tantra', type: 'premium',
    short: 'Massagem + Finalização',
    description: 'A união perfeita entre o toque terapêutico e a energia tântrica. Inclui relaxamento muscular profundo e massagem lingam manual.', 
    duration: '60 min', basePrice: 150, 
    highlight: "PREFERIDA DOS CASADOS 🔥", 
    tags: ["Toque Íntimo", "Lingam", "Alívio Total"] 
  },
  { 
    id: 'relaxante', name: 'Relaxante Clássica', type: 'relax',
    short: 'Corpo Inteiro (Sem íntimo)',
    description: 'Terapia manual para remover nódulos de tensão, estresse e cansaço. Foco em costas, pernas e pescoço.', 
    duration: '50 min', basePrice: 100, 
    tags: ["Terapêutica", "Sem Íntimo", "Anti-stress"] 
  },
  { 
    id: 'dual', name: 'Dual Interativa', type: 'vip',
    short: 'Você toca e recebe',
    description: 'Uma sessão onde a passividade dá lugar à interação. Troca de energia mútua guiada pelo terapeuta.', 
    duration: '90 min', basePrice: 250, 
    highlight: "NOVIDADE VIP 👑",
    tags: ["Interativa", "Reciprocidade", "Intensa"] 
  }
];

const LOCATIONS = [
  { id: 'santa-fe', label: 'Domicílio / Hotel', sub: 'Vou até você (Santa Fé)', fee: 40, icon: <MapPin className="w-4 h-4"/> },
  { id: 'motel', label: 'Suíte Motel', sub: 'Encontro discreto', fee: 0, icon: <Lock className="w-4 h-4"/>, isMotel: true },
  { id: 'studio', label: 'Meu Espaço', sub: 'Ambiente preparado (Jales)', fee: 0, icon: <MapPin className="w-4 h-4"/> }
];

const BODY_AREAS = [
  { id: 'costas', label: 'Costas' },
  { id: 'pescoco', label: 'Pescoço' },
  { id: 'pernas', label: 'Pernas' },
  { id: 'gluteos', label: 'Glúteos' },
  { id: 'virilha', label: 'Virilha' },
  { id: 'pes', label: 'Pés' }
];

const REVIEWS = [
  { text: "Discrição total. Sou casado e me senti muito seguro.", author: "Anônimo, 42" },
  { text: "Mão firme e técnica perfeita. O final foi incrível.", author: "Engenheiro, S. Fé" },
  { text: "Ambiente do motel facilitou muito. Recomendo.", author: "R.S." },
  { text: "Profissional de alto nível. Vale cada centavo.", author: "Médico, 50" },
];

// ==================================================================================
// 2. UTILITÁRIOS & HOOKS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

const useHaptic = () => {
  return (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); };
};

const getCurrentTimeGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return "Bom dia";
  if (hr < 18) return "Boa tarde";
  return "Boa noite";
};

// ==================================================================================
// 3. ESTILOS CSS IN-JS (Senior Polish)
// ==================================================================================

const globalStyles = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: #050505; 
    color: #E0E0E0; 
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
    overscroll-behavior-y: none;
  }
  .glass-panel {
    background: rgba(30, 30, 30, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  }
  .gold-gradient-text {
    background: linear-gradient(135deg, #FFF 0%, #D4AF37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .animate-float { animation: float 6s ease-in-out infinite; }
  @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .input-clean {
    background: transparent; border: none; outline: none; color: white; width: 100%;
    font-size: 18px; placeholder-color: #555;
  }
  .blur-sensitive { filter: blur(6px); user-select: none; transition: 0.3s; }
  .btn-primary {
    background: linear-gradient(180deg, #D4AF37 0%, #AA8C2C 100%);
    box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
    color: #000; border: none; font-weight: 700;
  }
  .btn-primary:active { transform: scale(0.98); opacity: 0.9; }
`;

// ==================================================================================
// 4. COMPONENTES DE UI
// ==================================================================================

const PanicButton = () => (
  <button 
    onClick={() => window.location.href = "https://news.google.com"}
    className="fixed top-4 right-4 z-[100] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-full border border-red-500/30 transition-all duration-300 group"
    title="Saída de Emergência"
  >
    <LogOut className="w-4 h-4" />
    <span className="absolute right-full mr-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity pointer-events-none">
      Sair Agora
    </span>
  </button>
);

const Toast = ({ msg, type = 'success' }) => (
  <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[90] flex items-center gap-3 px-6 py-3 rounded-full glass-panel shadow-2xl animate-float">
    {type === 'success' ? <Check className="w-4 h-4 text-green-400"/> : <AlertTriangle className="w-4 h-4 text-yellow-400"/>}
    <span className="text-sm font-medium text-white">{msg}</span>
  </div>
);

const ProgressBar = ({ step, total }) => (
  <div className="w-full h-1 bg-gray-800 fixed top-0 left-0 z-50">
    <div 
      className="h-full bg-[#D4AF37] transition-all duration-500 ease-out shadow-[0_0_10px_#D4AF37]"
      style={{ width: `${(step / total) * 100}%` }}
    />
  </div>
);

// ==================================================================================
// 5. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const vibrate = useHaptic();
  
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [privacyMode, setPrivacyMode] = useState(false);
  const [user, setUser] = useState({ name: '', phone: '' });
  const [selection, setSelection] = useState({
    service: null,
    location: null,
    date: null,
    time: null,
    areas: [],
    extras: []
  });
  const [toast, setToast] = useState(null);

  // --- REFS ---
  const scrollRef = useRef(null);

  // --- EFFECTS ---
  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    const savedUser = localStorage.getItem('thalyson_user');
    if(savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if(toast) setTimeout(() => setToast(null), 3000);
  }, [toast]);

  // --- HANDLERS ---
  const handleNext = () => {
    vibrate();
    if(step === 1 && (!user.name)) { setToast({msg: 'Como posso te chamar?', type: 'error'}); return; }
    if(step === 2 && !selection.service) { setToast({msg: 'Selecione uma experiência.', type: 'error'}); return; }
    if(step === 3 && !selection.location) { setToast({msg: 'Onde será o atendimento?', type: 'error'}); return; }
    if(step === 4 && (!selection.date || !selection.time)) { setToast({msg: 'Escolha data e hora.', type: 'error'}); return; }
    
    setStep(s => s + 1);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    vibrate();
    setStep(s => s - 1);
  };

  const toggleArea = (id) => {
    vibrate(5);
    setSelection(prev => {
      const areas = prev.areas.includes(id) 
        ? prev.areas.filter(a => a !== id)
        : [...prev.areas, id];
      return { ...prev, areas };
    });
  };

  const finalizeBooking = () => {
    localStorage.setItem('thalyson_user', JSON.stringify(user));
    
    const total = (selection.service.basePrice + (selection.location.fee || 0));
    
    let msg = `*NOVA RESERVA VIP* 🔒\n`;
    msg += `👤 *Cliente:* ${user.name}\n`;
    msg += `💆‍♂️ *Serviço:* ${selection.service.name}\n`;
    msg += `📍 *Local:* ${selection.location.label} ${selection.location.isMotel ? '(Motel)' : ''}\n`;
    msg += `📅 *Data:* ${selection.date} às ${selection.time}\n`;
    if(selection.areas.length) msg += `🎯 *Foco:* ${selection.areas.join(', ')}\n`;
    msg += `💰 *Valor Estimado:* ${formatCurrency(total)}\n\n`;
    msg += `_Aguardo confirmação do endereço/detalhes._`;

    const url = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  // --- RENDERS ---

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#D4AF3715,transparent_50%)] animate-pulse" />
      <div className="w-16 h-16 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin"/>
      <p className="mt-4 text-[#D4AF37] text-xs font-bold tracking-[0.3em] uppercase animate-pulse">Carregando Experiência</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
      <style>{globalStyles}</style>
      <ProgressBar step={step} total={5} />
      <PanicButton />
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* BACKGROUND AMBIENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[100px] animate-float"/>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] animate-float" style={{animationDelay: '2s'}}/>
      </div>

      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-end bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
        <div className="pointer-events-auto">
          {step > 1 ? (
            <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors"><ChevronLeft /></button>
          ) : (
            <div className="flex flex-col">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest flex items-center gap-1">
                <Shield className="w-3 h-3" /> 100% Sigiloso
              </span>
              <h1 className="text-xl font-bold text-white mt-1">Thalyson T.</h1>
            </div>
          )}
        </div>
        <button 
          onClick={() => { vibrate(); setPrivacyMode(!privacyMode); }}
          className={`pointer-events-auto p-2 rounded-full border transition-all ${privacyMode ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'border-white/10 text-gray-400 bg-black/50'}`}
        >
          {privacyMode ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
        </button>
      </header>

      {/* MAIN CONTENT SCROLLABLE */}
      <main ref={scrollRef} className="relative z-10 pt-24 pb-32 px-4 max-w-md mx-auto min-h-screen overflow-y-auto hide-scrollbar">
        
        {/* STEP 1: IDENTITY & WELCOME */}
        {step === 1 && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <p className="text-gray-400 text-sm mb-1">{getCurrentTimeGreeting()},</p>
              <h2 className="text-3xl font-bold text-white leading-tight">
                Pronto para fugir<br/>da <span className="gold-gradient-text">rotina hoje?</span>
              </h2>
            </div>

            <div className="glass-panel p-6 rounded-[24px] space-y-4">
              <div className="flex items-center gap-4 border-b border-white/5 pb-2">
                <User className="w-5 h-5 text-[#D4AF37]" />
                <input 
                  value={user.name} 
                  onChange={e => setUser({...user, name: e.target.value})}
                  placeholder="Como prefere ser chamado?"
                  className="input-clean bg-transparent placeholder:text-gray-600"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                <Lock className="w-3 h-3 inline mr-1"/>
                Seus dados não ficam salvos online. Atendimento exclusivo para homens (30+). Respeito e discrição garantidos.
              </p>
            </div>

            <div className="space-y-3">
               <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">
                 <Star className="w-3 h-3 text-[#D4AF37]"/> Últimas Avaliações
               </div>
               <div className="glass-panel p-4 rounded-xl overflow-hidden relative">
                 <div className="flex gap-6 animate-float whitespace-nowrap" style={{animationDuration: '10s'}}>
                   {REVIEWS.map((r, i) => (
                     <div key={i} className="inline-block w-64 whitespace-normal">
                       <p className="text-sm text-gray-300 italic">"{r.text}"</p>
                       <p className="text-[10px] text-[#D4AF37] mt-1 font-bold">- {r.author}</p>
                     </div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* STEP 2: SERVICE SELECTION */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Escolha sua Experiência</h2>
            <div className="space-y-4">
              {SERVICES.map(service => (
                <div 
                  key={service.id}
                  onClick={() => { vibrate(); setSelection({...selection, service}); }}
                  className={`glass-panel p-5 rounded-[20px] border transition-all duration-300 relative overflow-hidden group
                    ${selection.service?.id === service.id ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/5 hover:border-white/20'}
                  `}
                >
                  {service.highlight && (
                    <div className="absolute top-0 right-0 bg-[#D4AF37] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                      {service.highlight}
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                    <span className={`text-lg font-bold ${privacyMode ? 'blur-sensitive' : 'text-[#D4AF37]'}`}>
                      {formatCurrency(service.basePrice)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">{service.duration} • {service.short}</p>
                  <p className="text-sm text-gray-300 leading-relaxed opacity-80 mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.tags.map(t => (
                      <span key={t} className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-gray-400 border border-white/5">{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Foco de Tensão / Prazer</h3>
               <div className="flex flex-wrap gap-2">
                 {BODY_AREAS.map(area => (
                   <button
                     key={area.id}
                     onClick={() => toggleArea(area.label)}
                     className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${selection.areas.includes(area.label) ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-700'}`}
                   >
                     {area.label}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION */}
        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-xl font-bold text-white mb-4">Local de Atendimento</h2>
             <div className="grid grid-cols-1 gap-3">
               {LOCATIONS.map(loc => (
                 <button
                   key={loc.id}
                   onClick={() => { vibrate(); setSelection({...selection, location: loc}); }}
                   className={`p-4 rounded-[18px] border text-left flex items-center gap-4 transition-all
                     ${selection.location?.id === loc.id ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'glass-panel text-gray-300 border-white/5'}
                   `}
                 >
                   <div className={`p-3 rounded-full ${selection.location?.id === loc.id ? 'bg-black/10' : 'bg-white/5'}`}>
                     {loc.icon}
                   </div>
                   <div className="flex-1">
                     <p className="font-bold text-sm">{loc.label}</p>
                     <p className={`text-xs ${selection.location?.id === loc.id ? 'text-black/70' : 'text-gray-500'}`}>{loc.sub}</p>
                   </div>
                   {loc.fee > 0 && <span className="text-xs font-bold">+ {formatCurrency(loc.fee)}</span>}
                 </button>
               ))}
             </div>
             
             {selection.location?.isMotel && (
               <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex gap-3 items-start">
                 <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                 <p className="text-xs text-blue-200 leading-relaxed">
                   <strong>Nota sobre Motéis:</strong> Eu vou até a suíte onde você estiver. O valor da suíte é por sua conta. Total discrição na entrada e saída.
                 </p>
               </div>
             )}
          </div>
        )}

        {/* STEP 4: DATE & TIME */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-xl font-bold text-white mb-4">Data e Hora</h2>
            
            {/* Simple Date Selector Mock */}
            <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
              {[0,1,2,3].map(offset => {
                const d = new Date(); d.setDate(d.getDate() + offset);
                const dayName = offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', {weekday: 'short'});
                const dayNum = d.getDate();
                const isSel = selection.date === dayName; // Simple logic
                return (
                  <button 
                    key={offset}
                    onClick={() => { vibrate(); setSelection({...selection, date: dayName}); }}
                    className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#D4AF37] border-[#D4AF37] text-black' : 'glass-panel border-white/5 text-gray-400'}`}
                  >
                    <span className="text-[10px] font-bold uppercase">{dayName}</span>
                    <span className="text-2xl font-bold">{dayNum}</span>
                  </button>
                )
              })}
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-4 gap-2">
              {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
                <button
                   key={t}
                   onClick={() => { vibrate(); setSelection({...selection, time: t}); }}
                   className={`py-2 rounded-lg text-sm font-medium border transition-all ${selection.time === t ? 'bg-white text-black border-white' : 'bg-white/5 text-gray-400 border-transparent'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 justify-center mt-4 opacity-50">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="text-xs text-gray-400">2 outros usuários vendo horários agora</span>
            </div>
          </div>
        )}

        {/* STEP 5: REVIEW & SEND */}
        {step === 5 && (
          <div className="space-y-6 animate-fade-in pb-20">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-[#D4AF37] rounded-full mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_#D4AF3766]">
                <Check className="w-10 h-10 text-black stroke-[3px]" />
              </div>
              <h2 className="text-2xl font-bold text-white">Quase lá, {user.name}!</h2>
              <p className="text-gray-400 text-sm">Confira os detalhes para finalizar.</p>
            </div>

            <div className="glass-panel p-6 rounded-[24px] relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>
               
               <div className="space-y-4 text-sm">
                 <div className="flex justify-between">
                   <span className="text-gray-400">Serviço</span>
                   <span className="text-white font-bold">{selection.service.name}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">Duração</span>
                   <span className="text-white">{selection.service.duration}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">Local</span>
                   <span className="text-white">{selection.location.label}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-400">Data</span>
                   <span className="text-white">{selection.date} às {selection.time}</span>
                 </div>
                 
                 <div className="border-t border-dashed border-white/10 my-4 pt-4">
                   <div className="flex justify-between items-end">
                     <span className="text-gray-400">Total Estimado</span>
                     <div className="text-right">
                       <span className={`text-2xl font-bold ${privacyMode ? 'blur-sensitive' : 'text-[#D4AF37]'}`}>
                         {formatCurrency(selection.service.basePrice + (selection.location.fee || 0))}
                       </span>
                       <p className="text-[10px] text-gray-500">Pagamento: Pix, Dinheiro ou Cartão</p>
                     </div>
                   </div>
                 </div>
               </div>
            </div>

            <button onClick={finalizeBooking} className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-2">
              Confirmar no WhatsApp <Send className="w-5 h-5" />
            </button>
            
            <p className="text-center text-[10px] text-gray-600 mt-4 max-w-xs mx-auto">
              Ao confirmar, você será redirecionado para o WhatsApp pessoal do terapeuta. Seus dados não são armazenados em servidor.
            </p>
          </div>
        )}
      </main>

      {/* FOOTER ACTION BUTTON (Steps 1-4) */}
      {step < 5 && (
        <div className="fixed bottom-0 w-full p-4 z-50 bg-gradient-to-t from-black via-black to-transparent pt-12">
          <button 
            onClick={handleNext}
            className="w-full btn-primary py-4 rounded-[18px] text-[16px] flex justify-between items-center px-6 group"
          >
            <span>{step === 1 ? 'Começar' : 'Continuar'}</span>
            <ArrowRight className="w-5 h-5 group-active:translate-x-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}
