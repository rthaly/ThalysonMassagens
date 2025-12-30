import { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft, Check, X, MapPin, Calendar, Clock,
  Shield, Star, Zap, Bell, ArrowRight, Eye, EyeOff,
  LogOut, CreditCard, Banknote, QrCode, 
  Info, Send, Menu, Flame, Lock, User, 
  ChevronRight, Sparkles, Map, Phone
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÃO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu número
  COLORS: {
    bg: "#000000",
    card: "#1C1C1E",
    primary: "#0A84FF",
    success: "#30D158",
    warning: "#FFD60A",
    text: "#FFFFFF",
    subtext: "#8E8E93"
  }
};

const SERVICES = [
  { 
    id: 'masculina', 
    name: 'Massagem Masculina', 
    duration: '60 min', 
    price: 140, 
    tag: 'MAIS PEDIDA 🔥',
    desc: 'Relaxante + Toque corpo a corpo (Body) + Finalização Lingam.',
    details: ['Alívio de Tensão', 'Toque Tântrico', 'Finalização Manual', 'Sigilo Total']
  },
  { 
    id: 'relaxante', 
    name: 'Relaxante Clássica', 
    duration: '60 min', 
    price: 90, 
    tag: null,
    desc: 'Massagem completa focada em dores musculares e stress. Sem toques íntimos.',
    details: ['Corpo Inteiro', 'Música Zen', 'Óleos Essenciais', 'Terapêutica']
  },
  { 
    id: 'dual', 
    name: 'Experiência Dual (Interativa)', 
    duration: '90 min', 
    price: 200, 
    tag: 'NOVIDADE VIP 👑',
    desc: 'Você recebe e também pode interagir. Uma troca de energia intensa e recíproca.',
    details: ['Interação Permitida', 'Tempo Estendido', 'Conexão Total', 'Clímax Intenso']
  }
];

const LOCATIONS = [
  { id: 'motel', label: 'Suíte (Motel)', sub: 'Vou com você', fee: 75, icon: <Lock className="w-5 h-5"/> },
  { id: 'santa-fe', label: 'Domicílio', sub: 'Santa Fé do Sul', fee: 40, icon: <MapPin className="w-5 h-5"/> },
  { id: 'outras', label: 'Outras Cidades', sub: 'Taxa a combinar', fee: 0, icon: <Map className="w-5 h-5"/>, pending: true }
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (Mobile First Optimization)
// ==================================================================================

const globalStyles = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
  body { background-color: #000; color: #fff; overscroll-behavior-y: none; user-select: none; }
  
  /* Utilities */
  .ios-btn { transform: scale(1); transition: transform 0.1s; }
  .ios-btn:active { transform: scale(0.96); }
  
  .glass {
    background: rgba(28, 28, 30, 0.65);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.1);
  }
  
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  /* Animations */
  @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .animate-fade-in { animation: fadeIn 0.3s ease-out; }

  @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(48, 209, 88, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(48, 209, 88, 0); } 100% { box-shadow: 0 0 0 0 rgba(48, 209, 88, 0); } }
  .status-dot { animation: pulse-green 2s infinite; }
`;

// ==================================================================================
// 3. UTILS & HOOKS
// ==================================================================================

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const triggerHaptic = () => { if (navigator.vibrate) navigator.vibrate(10); };

// ==================================================================================
// 4. COMPONENTES DE UI
// ==================================================================================

const Header = ({ title, showBack, onBack, privacyMode, togglePrivacy }) => (
  <div className="fixed top-0 left-0 right-0 z-50 pt-12 pb-4 px-5 bg-black/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
    <div className="flex items-center gap-3">
      {showBack && (
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-blue-500 ios-btn">
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      <h1 className="text-[17px] font-bold tracking-tight">{title}</h1>
    </div>
    <div className="flex gap-3">
      <button onClick={togglePrivacy} className="ios-btn text-gray-400">
        {privacyMode ? <EyeOff className="w-5 h-5 text-blue-500"/> : <Eye className="w-5 h-5"/>}
      </button>
      <button onClick={() => window.location.href="https://google.com"} className="ios-btn text-red-500">
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  </div>
);

const ProgressBar = ({ step, total }) => (
  <div className="fixed top-[88px] left-0 right-0 h-1 bg-gray-900 z-40">
    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${(step / total) * 100}%` }} />
  </div>
);

const StatusBadge = () => (
  <div className="flex items-center gap-2 bg-[#1C1C1E] px-3 py-1.5 rounded-full border border-white/5 w-max mx-auto mb-6 shadow-lg">
    <div className="w-2 h-2 bg-green-500 rounded-full status-dot"></div>
    <span className="text-[11px] font-bold text-gray-300 uppercase tracking-wide">Online Agora</span>
  </div>
);

// ==================================================================================
// 5. APP CORE
// ==================================================================================

export default function App() {
  // State
  const [step, setStep] = useState('home');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [user, setUser] = useState({ name: '', isAdult: false });
  const [cart, setCart] = useState({
    service: null,
    location: null,
    date: null,
    time: null,
    extras: { table: false, aroma: false },
    payment: null
  });

  // Scroll to top on step change
  useEffect(() => { window.scrollTo(0,0); }, [step]);

  // Logic
  const togglePrivacy = () => { triggerHaptic(); setPrivacyMode(!privacyMode); };
  
  const calculateTotal = () => {
    let total = 0;
    if (cart.service) total += cart.service.price;
    if (cart.location) total += cart.location.fee;
    if (cart.extras.table) total += 20; // Taxa Maca
    if (cart.extras.aroma) total += 10; // Taxa Aroma
    return total;
  };

  const generateWhatsappLink = () => {
    const total = calculateTotal();
    const dateStr = cart.date ? cart.date.toLocaleDateString('pt-BR') : '';
    
    let text = `*NOVO PEDIDO (APP)* 📲\n\n`;
    text += `👤 *Nome:* ${user.name}\n`;
    text += `💆‍♂️ *Serviço:* ${cart.service.name}\n`;
    text += `📅 *Data:* ${dateStr} às ${cart.time}\n`;
    text += `📍 *Local:* ${cart.location.label}\n`;
    
    if (cart.extras.table || cart.extras.aroma) {
      text += `✨ *Extras:* ${cart.extras.table ? 'Maca ' : ''}${cart.extras.aroma ? 'Aroma' : ''}\n`;
    }
    
    text += `💰 *Valor Total:* ${formatCurrency(total)}\n`;
    text += `💳 *Pagamento:* ${cart.payment}\n\n`;
    text += `_Aguardo confirmação._`;

    return `https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(text)}`;
  };

  const handleNextStep = (next) => { triggerHaptic(); setStep(next); };

  // --- RENDERS DAS TELAS ---

  // 1. HOME
  if (step === 'home') return (
    <div className="min-h-screen bg-black pb-32">
      <style>{globalStyles}</style>
      <div className="relative h-[40vh] bg-gradient-to-b from-blue-900/40 to-black flex flex-col items-center justify-end pb-8">
        <StatusBadge />
        <h1 className="text-3xl font-bold text-center px-4 leading-tight mb-2">Massagem <span className="text-blue-500">Exclusiva</span><br/>& Relaxante</h1>
        <p className="text-gray-400 text-sm text-center max-w-[280px]">Santa Fé do Sul e Região.<br/>Atendimento discreto e profissional.</p>
      </div>

      <div className="px-5 -mt-6">
        <div className="bg-[#1C1C1E] rounded-[24px] p-6 border border-white/5 shadow-2xl">
          <label className="text-[11px] text-blue-500 font-bold uppercase mb-2 block tracking-wider">Identificação Rápida</label>
          <input 
            placeholder="Seu primeiro nome..." 
            value={user.name}
            onChange={(e) => setUser({...user, name: e.target.value})}
            className="w-full bg-black/50 border-none rounded-xl p-4 text-white text-lg placeholder:text-gray-600 outline-none focus:ring-1 focus:ring-blue-500 mb-4"
          />
          
          <button 
            onClick={() => setUser({...user, isAdult: !user.isAdult})}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${user.isAdult ? 'bg-blue-500/10 border-blue-500' : 'bg-black/30 border-transparent'}`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${user.isAdult ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}`}>
              {user.isAdult && <Check className="w-3 h-3 text-white" />}
            </div>
            <span className={`text-sm ${user.isAdult ? 'text-white font-bold' : 'text-gray-400'}`}>Tenho mais de 18 anos</span>
          </button>

          <button 
            disabled={!user.name || !user.isAdult}
            onClick={() => handleNextStep('services')}
            className="w-full mt-6 bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl text-[16px] shadow-lg shadow-blue-900/20 ios-btn flex items-center justify-center gap-2"
          >
            Ver Serviços e Preços <ArrowRight className="w-5 h-5"/>
          </button>
        </div>

        <div className="mt-8 px-2 flex justify-between text-gray-500 text-[10px] uppercase font-bold tracking-widest">
          <span>Segurança</span>
          <span>Discrição</span>
          <span>Higiene</span>
        </div>
      </div>
    </div>
  );

  // 2. SELEÇÃO DE SERVIÇO
  if (step === 'services') return (
    <div className="min-h-screen bg-black pb-40">
      <style>{globalStyles}</style>
      <Header title="Escolha a Experiência" showBack onBack={() => setStep('home')} privacyMode={privacyMode} togglePrivacy={togglePrivacy} />
      <ProgressBar step={1} total={4} />

      <div className="pt-28 px-5 space-y-5 animate-slide-up">
        {SERVICES.map((s) => (
          <div 
            key={s.id} 
            onClick={() => { setCart({...cart, service: s}); handleNextStep('configure'); }}
            className="bg-[#1C1C1E] p-5 rounded-[22px] border border-white/5 active:border-blue-500 active:bg-blue-900/10 transition-all relative overflow-hidden ios-btn"
          >
            {s.tag && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1 rounded-bl-xl">{s.tag}</div>}
            
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-white">{s.name}</h3>
            </div>
            
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-lg font-bold text-blue-500 ${privacyMode ? 'blur-sm' : ''}`}>{formatCurrency(s.price)}</span>
              <span className="text-gray-600 text-sm">• {s.duration}</span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>
            
            <div className="flex flex-wrap gap-2">
              {s.details.map((d, i) => (
                <span key={i} className="text-[10px] bg-white/5 text-gray-300 px-2 py-1 rounded-md">{d}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 3. CONFIGURAÇÃO (LOCAL, DATA, EXTRAS)
  if (step === 'configure') return (
    <div className="min-h-screen bg-black pb-48">
      <style>{globalStyles}</style>
      <Header title="Personalizar" showBack onBack={() => setStep('services')} privacyMode={privacyMode} togglePrivacy={togglePrivacy} />
      <ProgressBar step={2} total={4} />

      <div className="pt-28 px-5 space-y-8 animate-slide-up">
        
        {/* LOCAL */}
        <section>
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Onde será?</h3>
          <div className="space-y-3">
            {LOCATIONS.map((l) => (
              <button 
                key={l.id}
                onClick={() => setCart({...cart, location: l})}
                className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all ios-btn ${cart.location?.id === l.id ? 'bg-blue-900/20 border-blue-500' : 'bg-[#1C1C1E] border-white/5'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cart.location?.id === l.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
                  {l.icon}
                </div>
                <div className="text-left flex-1">
                  <p className={`font-bold text-sm ${cart.location?.id === l.id ? 'text-white' : 'text-gray-300'}`}>{l.label}</p>
                  <p className="text-xs text-gray-500">{l.sub}</p>
                </div>
                {l.fee > 0 && <span className="text-xs font-bold text-[#FFD60A] bg-[#FFD60A]/10 px-2 py-1 rounded">+ {formatCurrency(l.fee)}</span>}
              </button>
            ))}
          </div>
        </section>

        {/* DATA (Horizontal Scroll) */}
        <section>
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Quando?</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {[0,1,2,3,4].map((offset) => {
              const d = new Date(); d.setDate(d.getDate() + offset);
              const isSelected = cart.date?.toDateString() === d.toDateString();
              const dayName = offset === 0 ? 'Hoje' : d.toLocaleDateString('pt-BR', {weekday: 'short'}).replace('.','');
              
              return (
                <button
                  key={offset}
                  onClick={() => setCart({...cart, date: d})}
                  className={`min-w-[70px] h-[80px] rounded-2xl border flex flex-col items-center justify-center transition-all ios-btn ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}
                >
                  <span className="text-[10px] font-bold uppercase mb-1">{dayName}</span>
                  <span className="text-2xl font-bold">{d.getDate()}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* HORÁRIO (Grid) */}
        {cart.date && (
          <div className="grid grid-cols-4 gap-2 animate-fade-in">
            {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'].map(t => (
              <button 
                key={t}
                onClick={() => setCart({...cart, time: t})}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${cart.time === t ? 'bg-white text-black' : 'bg-[#1C1C1E] text-gray-400'}`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* EXTRAS (Upsell) */}
        <section>
           <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Extras</h3>
           <div className="flex gap-3">
             <button 
               onClick={() => setCart({...cart, extras: {...cart.extras, table: !cart.extras.table}})}
               className={`flex-1 p-4 rounded-xl border text-center transition-all ${cart.extras.table ? 'bg-blue-900/20 border-blue-500' : 'bg-[#1C1C1E] border-white/5'}`}
             >
               <span className="block text-sm font-bold text-white mb-1">Maca Portátil</span>
               <span className="text-xs text-blue-400 font-bold">+ {formatCurrency(20)}</span>
             </button>
             <button 
               onClick={() => setCart({...cart, extras: {...cart.extras, aroma: !cart.extras.aroma}})}
               className={`flex-1 p-4 rounded-xl border text-center transition-all ${cart.extras.aroma ? 'bg-blue-900/20 border-blue-500' : 'bg-[#1C1C1E] border-white/5'}`}
             >
               <span className="block text-sm font-bold text-white mb-1">Aromaterapia</span>
               <span className="text-xs text-blue-400 font-bold">+ {formatCurrency(10)}</span>
             </button>
           </div>
        </section>

      </div>

      {/* STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 glass px-5 py-4 pb-8 z-50">
        <div className="flex justify-between items-center mb-3">
           <span className="text-sm text-gray-400">Total Estimado</span>
           <span className={`text-2xl font-bold text-white ${privacyMode ? 'blur-md' : ''}`}>{formatCurrency(calculateTotal())}</span>
        </div>
        <button 
          disabled={!cart.location || !cart.date || !cart.time}
          onClick={() => handleNextStep('checkout')}
          className="w-full bg-blue-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl text-[16px] shadow-lg ios-btn"
        >
          Continuar
        </button>
      </div>
    </div>
  );

  // 4. CHECKOUT
  if (step === 'checkout') return (
    <div className="min-h-screen bg-black pb-32">
       <style>{globalStyles}</style>
       <Header title="Finalizar" showBack onBack={() => setStep('configure')} privacyMode={privacyMode} togglePrivacy={togglePrivacy} />
       <ProgressBar step={4} total={4} />

       <div className="pt-28 px-5 animate-slide-up">
         <h2 className="text-2xl font-bold mb-6">Tudo certo, {user.name}?</h2>
         
         <div className="bg-[#1C1C1E] rounded-[24px] p-6 border border-white/10 mb-6">
           <div className="space-y-4">
             <div className="flex justify-between border-b border-white/5 pb-3">
               <span className="text-gray-400">Serviço</span>
               <span className="text-white font-bold text-right">{cart.service.name}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-3">
               <span className="text-gray-400">Data e Hora</span>
               <span className="text-white font-bold text-right">{cart.date.toLocaleDateString('pt-BR')} às {cart.time}</span>
             </div>
             <div className="flex justify-between border-b border-white/5 pb-3">
               <span className="text-gray-400">Local</span>
               <div className="text-right">
                 <span className="text-white font-bold block">{cart.location.label}</span>
                 {cart.location.fee > 0 && <span className="text-xs text-[#FFD60A]">Taxa inclusa</span>}
               </div>
             </div>
             { (cart.extras.table || cart.extras.aroma) && (
               <div className="flex justify-between border-b border-white/5 pb-3">
                 <span className="text-gray-400">Extras</span>
                 <span className="text-white font-bold text-right">
                    {cart.extras.table && 'Maca, '}
                    {cart.extras.aroma && 'Aroma'}
                 </span>
               </div>
             )}
             <div className="flex justify-between pt-2">
               <span className="text-white font-bold text-lg">Total</span>
               <span className={`text-blue-500 font-bold text-2xl ${privacyMode ? 'blur-md' : ''}`}>{formatCurrency(calculateTotal())}</span>
             </div>
           </div>
         </div>

         <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3">Forma de Pagamento</h3>
         <div className="grid grid-cols-3 gap-3 mb-8">
           {['Pix', 'Dinheiro', 'Cartão'].map(p => (
             <button 
               key={p} 
               onClick={() => setCart({...cart, payment: p})}
               className={`py-3 rounded-xl border text-sm font-bold transition-all ${cart.payment === p ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-white/5 text-gray-400'}`}
             >
               {p}
             </button>
           ))}
         </div>

         <button 
            disabled={!cart.payment}
            onClick={() => window.open(generateWhatsappLink(), '_blank')}
            className="w-full bg-[#30D158] hover:bg-[#28c04d] disabled:bg-gray-800 disabled:text-gray-500 text-white font-bold py-4 rounded-xl text-[17px] shadow-[0_0_20px_rgba(48,209,88,0.3)] ios-btn flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Solicitar no WhatsApp
          </button>
          
          <p className="text-center text-[10px] text-gray-600 mt-4 px-4">
            Ao clicar, você será redirecionado para o WhatsApp do profissional. Seus dados não ficam salvos em nenhum servidor.
          </p>
       </div>
    </div>
  );

  return null;
}
