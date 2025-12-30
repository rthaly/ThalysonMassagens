import React, { useState, useEffect, useRef, useReducer, useMemo, useCallback, useContext, createContext } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Clock,
  Bell, Tag, AlertCircle, ArrowRight, Eye, EyeOff, Share2, 
  LogOut, Star, Instagram, Menu, Send, CreditCard, Banknote, QrCode, 
  CheckCircle2, Info, ChevronRight, Crown, Trash2
} from 'lucide-react';

// ==================================================================================
// 1. CONSTANTES & UTILITÁRIOS (Separation of Concerns)
// ==================================================================================

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 },
  CONTACT: { PHONE: '5517991360413', PIX: '62922530000144' },
  RATES: [0, 0, 0.0499, 0.0600, 0.0700, 0.0800, 0.0900, 0.1000, 0.1050, 0.1100, 0.1150, 0.1190, 0.1238]
};

const SERVICES_DB = [
  { 
    id: 'masculina', name: 'Massagem Masculina', type: 'sensual',
    description: 'Massagem Relaxante + Toques corpo a corpo com finalização manual.', 
    labelDuration: '60 min', basePrice: 140, highlight: "MAIS PEDIDA 🔥", 
    details: ["Relaxante + Body-to-Body", "Massagista de Cueca", "Finalização Manual", "Alívio Completo"] 
  },
  { 
    id: 'relaxante', name: 'Massagem Relaxante', type: 'relax',
    description: 'Corpo inteiro: Costas, braços, pernas e pés. (Sem toques íntimos).', 
    labelDuration: '60 min', basePrice: 90, ratings: 4.9,
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"] 
  },
];

const LOCATIONS_DB = [
  { id: 'motel', label: 'Suíte Privada (Motel)', sublabel: 'Vou com você', fee: 75, allowsTable: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', sublabel: 'No conforto do seu lar', fee: 40, allowsTable: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', sublabel: 'Atendimento na região', fee: 0, allowsTable: false, isPending: true, input: true },
];

const LEVELS = [
  { name: 'Bronze', min: 0, rewardCode: null, icon: '🥉', perks: ["Acesso VIP", "Agendamento Rápido"] },
  { name: 'Prata', min: 400, rewardCode: 'NIVELPRATA', icon: '🥈', perks: ["Cupom R$ 15", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, rewardCode: 'NIVELOURO', icon: '🥇', perks: ["Cupom R$ 25", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, rewardCode: 'NIVELDIAMANTE', icon: '💎', perks: ["Cupom R$ 50", "Prioridade Total"] },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10, desc: '10% OFF (1ª Vez)' },
  'MASCULINA': { code: 'MASCULINA', type: 'percent', value: 10, desc: '10% OFF Especial' },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20, desc: 'R$ 20,00 OFF' },
  'NIVELPRATA': { code: 'NIVELPRATA', type: 'fixed', value: 15, desc: 'R$ 15,00 OFF (Prata)' },
  'NIVELOURO': { code: 'NIVELOURO', type: 'fixed', value: 25, desc: 'R$ 25,00 OFF (Ouro)' },
  'NIVELDIAMANTE': { code: 'NIVELDIAMANTE', type: 'fixed', value: 50, desc: 'R$ 50,00 OFF (Diamante)' },
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 2. CONTEXTS (State Management)
// ==================================================================================

const ToastContext = createContext();
const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast.show && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl backdrop-blur-md border animate-fade-in" 
             style={{ backgroundColor: toast.type === 'success' ? 'rgba(50, 215, 75, 0.9)' : 'rgba(255, 69, 58, 0.9)', borderColor: 'rgba(255,255,255,0.2)' }}>
           {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-white" /> : <AlertCircle className="w-5 h-5 text-white" />}
           <span className="text-white font-bold text-[14px]">{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  );
};

// ==================================================================================
// 3. HOOKS PERSONALIZADOS
// ==================================================================================

// Hook de Persistência
const usePersistedState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
};

// Hook de Cálculo de Preço (Memoizado)
const usePriceCalculator = (selection, loyalty) => {
  return useMemo(() => {
    if (!selection.service) return { total: 0, visualTotal: 0 };

    let total = selection.service.basePrice;
    
    // Add-ons
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;
    if (selection.useTable) total += CONFIG.PRICES.MACA;
    
    // Aroma Logic
    const currentLevel = [...LEVELS].reverse().find(l => (loyalty.totalSpent || 0) >= l.min) || LEVELS[0];
    let aromaPrice = CONFIG.PRICES.AROMA_FULL;
    if (currentLevel.name === 'Prata') aromaPrice = CONFIG.PRICES.AROMA_DISCOUNT;
    if (currentLevel.name === 'Ouro' || currentLevel.name === 'Diamante') aromaPrice = 0;
    
    if (selection.aroma) total += aromaPrice;

    // Fees & Discounts
    const fee = selection.location?.fee || 0;
    let discount = 0;
    if (selection.coupon) {
       const baseForDiscount = total; 
       if (selection.coupon.type === 'percent') discount = baseForDiscount * (selection.coupon.value / 100);
       else discount = selection.coupon.value;
    }

    const visualTotal = total + fee - discount; // Dinheiro/Pix
    
    // Credit Card Logic
    let creditTotal = visualTotal;
    if (selection.paymentMethod === 'credit_card') {
      const rate = CONFIG.RATES[selection.installments] || 0;
      creditTotal = visualTotal / (1 - rate);
    }

    return { total: visualTotal, creditTotal, fee, discount, aromaPrice };
  }, [selection, loyalty]);
};

// ==================================================================================
// 4. COMPONENTES MENORES (UI Kits)
// ==================================================================================

const Card = ({ children, className = "", onClick }) => (
  <div onClick={onClick} className={`ios-card rounded-[22px] border border-white/10 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', className = "", ...props }) => {
  const base = "w-full font-bold py-4 rounded-[18px] flex justify-center items-center gap-2 transition-all active:scale-[0.98]";
  const styles = {
    primary: "ios-btn-primary shadow-lg text-white",
    secondary: "bg-[#2C2C2E] border border-white/10 hover:bg-[#3A3A3C] text-white",
    outline: "border border-[#0A84FF] text-[#0A84FF] bg-[#0A84FF]/10",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20"
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props}>{children}</button>;
};

const Header = ({ title, showBack, onBack, rightAction }) => (
  <div className="flex items-center justify-between mb-6 pt-2">
    <div className="flex items-center gap-3">
      {showBack && <button onClick={onBack} className="p-2 -ml-2 rounded-full bg-white/5"><ChevronLeft className="w-6 h-6 text-[#0A84FF]" /></button>}
      {title && <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>}
    </div>
    {rightAction}
  </div>
);

// ==================================================================================
// 5. TELAS DO FLUXO (Componentização)
// ==================================================================================

const IdentityStep = ({ user, setUser, onNext }) => (
  <div className="animate-fade-in space-y-6">
    <Header title="Identificação" />
    <p className="text-gray-400 text-sm">Necessário para manter a segurança e exclusividade.</p>
    
    <div className="bg-[#1C1C1E] p-6 rounded-[24px] border border-white/10">
      <label className="text-[11px] text-[#0A84FF] font-bold uppercase tracking-wider block mb-2">Seu Nome</label>
      <input 
        value={user.name} 
        onChange={e => setUser({...user, name: e.target.value})} 
        className="w-full bg-transparent text-white text-[22px] font-medium placeholder:text-gray-600 border-b border-white/10 py-2 focus:border-[#0A84FF] transition-colors outline-none" 
        placeholder="Digite seu nome..." 
      />
    </div>

    <div className="space-y-3">
      {[
        { key: 'isAdult', label: 'Maior de 18 anos' },
        { key: 'isMassagemOk', label: 'Ciente que é massagem terapêutica' }
      ].map((item) => (
        <button key={item.key} onClick={() => { triggerHaptic(); setUser({...user, [item.key]: !user[item.key]}); }} 
          className={`w-full p-5 rounded-[22px] border flex items-center gap-4 transition-all duration-300 ${user[item.key] ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-transparent'}`}>
          <div className={`w-6 h-6 rounded-full border-[1.5px] flex items-center justify-center transition-all ${user[item.key] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-gray-600'}`}>
            {user[item.key] && <Check className="w-3.5 h-3.5 text-white" />}
          </div>
          <span className={`text-[15px] font-medium ${user[item.key] ? 'text-white' : 'text-gray-400'}`}>{item.label}</span>
        </button>
      ))}
    </div>

    <Button disabled={!user.name || !user.isAdult || !user.isMassagemOk} onClick={onNext} className="mt-4 disabled:opacity-50">
      Continuar
    </Button>
  </div>
);

// ==================================================================================
// 6. APP PRINCIPAL (Refatorado com useReducer)
// ==================================================================================

const initialState = {
  step: 'home',
  service: null,
  location: null,
  date: null,
  time: '',
  useTable: null,
  city: '',
  coupon: null,
  upgrade: false,
  music: null,
  aroma: false,
  paymentMethod: null,
  installments: 1
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP': return { ...state, step: action.payload };
    case 'SELECT_SERVICE': return { ...state, service: action.payload, step: 'configure' };
    case 'UPDATE_SELECTION': return { ...state, ...action.payload };
    case 'RESET': return initialState;
    default: return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [loyalty, setLoyalty] = usePersistedState('thaly_system_v3_senior', { 
    savedName: '', totalSpent: 0, inventory: ['BEMVINDO'], notifications: [] 
  });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [privacyMode, setPrivacyMode] = useState(true);
  
  // Efeito para carregar usuário salvo
  useEffect(() => {
    if (loyalty.savedName && !user.name) {
      setUser(prev => ({ ...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true }));
    }
  }, [loyalty.savedName]);

  // Pricing Logic Hook
  const pricing = usePriceCalculator(state, loyalty);

  const handleFinalize = () => {
    // Aqui entra a lógica de envio (simplificada para o exemplo)
    const msg = `*NOVO PEDIDO DO APP* \nCliente: ${user.name}\nServiço: ${state.service.name}\nTotal: ${formatCurrency(pricing.total)}`;
    const url = `https://api.whatsapp.com/send?phone=${CONFIG.CONTACT.PHONE}&text=${encodeURIComponent(msg)}`;
    
    // Atualiza Loyalty
    const newSpent = (loyalty.totalSpent || 0) + pricing.total;
    let newInventory = [...loyalty.inventory];
    if(state.coupon) newInventory = newInventory.filter(c => c !== state.coupon.code);

    setLoyalty(prev => ({ ...prev, totalSpent: newSpent, inventory: newInventory }));
    window.open(url, '_blank');
    dispatch({ type: 'SET_STEP', payload: 'success' });
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex justify-center bg-black font-sans text-gray-200">
        <style>{`
          .aurora-bg { background: radial-gradient(140% 100% at 50% 0%, rgba(20, 20, 22, 1), #000000 60%), radial-gradient(100% 100% at 50% 100%, rgba(10, 132, 255, 0.04), transparent 50%); background-attachment: fixed; }
          .ios-card { background: rgba(28, 28, 30, 0.55); backdrop-filter: blur(50px); border: 1px solid rgba(255,255,255,0.08); }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div className="w-full max-w-[440px] aurora-bg min-h-screen sm:h-[95vh] sm:my-4 sm:rounded-[40px] sm:border border-white/10 shadow-2xl relative overflow-hidden flex flex-col">
          
          {/* HEADER CONDICIONAL */}
          <div className="pt-12 px-6 pb-4 flex justify-between items-center z-20">
             {state.step !== 'home' ? (
               <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'home' })} className="p-2 bg-white/10 rounded-full"><ChevronLeft/></button>
             ) : (
               <div className="flex flex-col">
                 <span className="text-xs text-[#0A84FF] font-bold tracking-widest uppercase">Bem-vindo</span>
                 <span className="text-sm font-bold text-gray-200">{user.name || 'Visitante'}</span>
               </div>
             )}
             <div className="flex gap-3">
                <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Crown className="w-3 h-3 text-[#FFD60A]"/> 
                  {LEVELS.reverse().find(l => loyalty.totalSpent >= l.min)?.name || 'Bronze'}
                </div>
             </div>
          </div>

          {/* CONTEÚDO PRINCIPAL (RENDERIZAÇÃO CONDICIONAL LIMPA) */}
          <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
            
            {state.step === 'home' && (
              <div className="animate-fade-in space-y-8">
                <div className="text-center mt-4 mb-8">
                  <h1 className="text-3xl font-bold text-white mb-1">Massagens <span className="text-[#0A84FF]">Premium</span></h1>
                  <p className="text-gray-400 text-sm">Santa Fé do Sul e Região</p>
                </div>
                
                {/* Cartão de Fidelidade Mini */}
                <Card className="p-5 bg-gradient-to-br from-[#1C1C1E] to-[#000]">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Total Investido</p>
                        <h3 className="text-2xl font-mono font-bold text-white mt-1">
                          {privacyMode ? '••••' : formatCurrency(loyalty.totalSpent)}
                        </h3>
                      </div>
                      <button onClick={() => setPrivacyMode(!privacyMode)} className="text-gray-500">
                        {privacyMode ? <EyeOff size={20}/> : <Eye size={20}/>}
                      </button>
                   </div>
                </Card>

                <div>
                   <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Escolha seu Serviço</h3>
                   <div className="space-y-4">
                     {SERVICES_DB.map(service => (
                       <Card key={service.id} onClick={() => {
                         if(!user.name) dispatch({ type: 'SET_STEP', payload: 'identity' });
                         else dispatch({ type: 'SELECT_SERVICE', payload: service });
                       }} className="p-5 active:scale-95 transition-transform cursor-pointer relative overflow-hidden group">
                          {service.highlight && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-bold px-3 py-1 rounded-bl-xl">{service.highlight}</div>}
                          <div className="flex justify-between items-start mb-2">
                             <h4 className="text-lg font-bold text-white">{service.name}</h4>
                             <span className="text-[#0A84FF] font-bold">{formatCurrency(service.basePrice)}</span>
                          </div>
                          <p className="text-sm text-gray-400 leading-relaxed">{service.description}</p>
                       </Card>
                     ))}
                   </div>
                </div>
              </div>
            )}

            {state.step === 'identity' && (
              <IdentityStep 
                user={user} 
                setUser={setUser} 
                onNext={() => {
                   setLoyalty(prev => ({...prev, savedName: user.name}));
                   dispatch({ type: 'SET_STEP', payload: state.service ? 'configure' : 'home' });
                }} 
              />
            )}

            {state.step === 'configure' && state.service && (
              <div className="animate-fade-in space-y-8">
                 <Header title="Configurar" />
                 
                 {/* 1. Data e Hora Simplificada */}
                 <section>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Data</h4>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       {[...Array(14)].map((_, i) => {
                          const d = new Date(); d.setDate(d.getDate() + i);
                          const isSel = state.date?.getDate() === d.getDate();
                          return (
                            <button key={i} onClick={() => dispatch({ type: 'UPDATE_SELECTION', payload: { date: d } })} 
                              className={`min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}>
                               <span className="text-[10px] uppercase font-bold">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                               <span className="text-xl font-bold">{d.getDate()}</span>
                            </button>
                          )
                       })}
                    </div>
                    {state.date && (
                       <div className="grid grid-cols-4 gap-2 mt-4 animate-fade-in">
                          {['09:00','10:00','14:00','16:00','18:00','20:00'].map(t => (
                             <button key={t} onClick={() => dispatch({ type: 'UPDATE_SELECTION', payload: { time: t } })}
                               className={`py-2 rounded-xl text-sm font-bold border ${state.time === t ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] text-gray-400 border-white/5'}`}>
                               {t}
                             </button>
                          ))}
                       </div>
                    )}
                 </section>

                 {/* 2. Local */}
                 <section>
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Local</h4>
                    <div className="space-y-3">
                       {LOCATIONS_DB.map(loc => (
                          <button key={loc.id} onClick={() => dispatch({ type: 'UPDATE_SELECTION', payload: { location: loc, useTable: null } })}
                             className={`w-full p-4 rounded-2xl border text-left flex justify-between items-center transition-all ${state.location?.id === loc.id ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-white/5'}`}>
                             <div>
                               <p className="font-bold text-white text-sm">{loc.label}</p>
                               <p className="text-xs text-gray-500">{loc.sublabel}</p>
                             </div>
                             {loc.fee > 0 && <span className="text-xs font-bold text-[#FFD60A]">+ {formatCurrency(loc.fee)}</span>}
                          </button>
                       ))}
                    </div>
                 </section>

                 {/* Resumo Financeiro (Footer fixo simulado aqui por simplicidade) */}
                 <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-end mb-4">
                       <span className="text-gray-400 text-sm">Total Estimado</span>
                       <span className="text-2xl font-bold text-white">{formatCurrency(pricing.total)}</span>
                    </div>
                    <Button onClick={handleFinalize} disabled={!state.date || !state.time || !state.location}>
                       Agendar no WhatsApp
                    </Button>
                 </div>
              </div>
            )}
            
            {state.step === 'success' && (
               <div className="h-full flex flex-col items-center justify-center animate-fade-in pt-20">
                  <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                     <Check className="w-10 h-10 text-white stroke-[3px]"/>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Pedido Criado!</h2>
                  <p className="text-gray-400 text-center mb-8">Finalize a conversa no WhatsApp para confirmar.</p>
                  <Button variant="secondary" onClick={() => dispatch({ type: 'RESET' })}>Voltar ao Início</Button>
               </div>
            )}

          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
