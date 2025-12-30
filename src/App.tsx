import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, Check, X, HelpCircle, MapPin, Calendar, Bell, Tag, AlertCircle, 
  ArrowRight, Eye, EyeOff, Share2, LogOut, Crown, Music, Trash2, CreditCard, 
  Banknote, QrCode, CheckCircle2, Info, Send, Menu, Smartphone, Sparkles, 
  Settings, Lock, Unlock, Download, MoreHorizontal, Flame
} from 'lucide-react';

// ==================================================================================
// 1. INFRAESTRUTURA & UTILITÁRIOS
// ==================================================================================

const SecureStorage = {
  SECRET: 'THALY_ULTIMATE_V1_',
  encrypt: (data) => {
    try { return btoa(encodeURIComponent(JSON.stringify(data))); } catch (e) { return null; }
  },
  decrypt: (cipher) => {
    try { return JSON.parse(decodeURIComponent(atob(cipher))); } catch (e) { return null; }
  },
  set: (key, data) => {
    const cipher = SecureStorage.encrypt(data);
    if (cipher) localStorage.setItem(SecureStorage.SECRET + key, cipher);
  },
  get: (key) => {
    const cipher = localStorage.getItem(SecureStorage.SECRET + key);
    return cipher ? SecureStorage.decrypt(cipher) : null;
  },
  clear: () => localStorage.clear()
};

const generateCalendarLink = (serviceName, date, time) => {
  if (!date || !time) return '';
  const [hours, minutes] = time.split(':');
  const startDate = new Date(date);
  startDate.setHours(parseInt(hours), parseInt(minutes));
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);

  const formatDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(serviceName)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent("Sessão confirmada com Thalyson Massagens.")}&location=${encodeURIComponent("Santa Fé do Sul")}`;
};

// ==================================================================================
// 2. ESTILOS GLOBAIS (3D & ANIMAÇÕES)
// ==================================================================================

const globalStyles = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: #000000; }
body { 
  overscroll-behavior-y: none; touch-action: manipulation; 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif; 
  color: #fff; background: #000; -webkit-font-smoothing: antialiased;
}
::-webkit-scrollbar { display: none; }

/* 3D FLIP CARD EFFECT */
.flip-container { perspective: 1000px; }
.flip-card { 
  position: relative; width: 100%; height: 100%; text-align: center; 
  transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
  transform-style: preserve-3d; 
}
.flip-card.flipped { transform: rotateY(180deg); }
.flip-front, .flip-back { 
  position: absolute; width: 100%; height: 100%; 
  -webkit-backface-visibility: hidden; backface-visibility: hidden; 
  border-radius: 28px; overflow: hidden;
}
.flip-back { transform: rotateY(180deg); background: #1C1C1E; border: 1px solid rgba(255,255,255,0.1); }

/* UI ELEMENTS */
.ios-card { 
  background: rgba(28, 28, 30, 0.65); backdrop-filter: blur(40px);
  border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s ease;
}
.ios-card:active { transform: scale(0.99); }

.ios-btn-primary {
  background: linear-gradient(135deg, #007AFF, #0055FF);
  color: white; box-shadow: 0 4px 15px rgba(0, 122, 255, 0.4); border: none;
}
.ios-btn-primary:active { transform: scale(0.98); opacity: 0.9; }

/* ANIMATIONS */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
.animate-fade-in { animation: fadeIn 0.5s ease forwards; }
.animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }

/* TOASTS */
.toast-container { position: fixed; top: 10px; left: 0; right: 0; z-index: 9999; display: flex; flex-col; align-items: center; gap: 8px; pointer-events: none; }
.toast { pointer-events: auto; background: rgba(30,30,30,0.9); backdrop-filter: blur(12px); color: white; padding: 12px 20px; border-radius: 50px; font-size: 13px; font-weight: 600; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; items-center; gap: 8px; border: 1px solid rgba(255,255,255,0.1); animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
`;

// ==================================================================================
// 3. DADOS
// ==================================================================================

const CONFIG = {
  PRICES: { MACA: 20, AROMA_FULL: 10, AROMA_DISCOUNT: 5, UPGRADE_PCT: 0.5 }
};

const services = [
  { id: 'masculina', name: 'Massagem Masculina', labelDuration: '60 min', basePrice: 140, highlight: "MAIS PEDIDA 🔥", description: 'Massagem Relaxante + Body-to-Body (cueca) + Finalização Manual.' },
  { id: 'relaxante', name: 'Massagem Relaxante', labelDuration: '60 min', basePrice: 90, description: 'Terapêutica completa para alívio de tensões. Sem toques íntimos.' },
];

const locations = [
  { id: 'motel', label: 'Suíte (Motel)', fee: 75, allowsTableChoice: false, isMotel: true },
  { id: 'santa-fe', label: 'Santa Fé do Sul', fee: 40, allowsTableChoice: true, isUber: true },
  { id: 'outras-cidades', label: 'Cidades Vizinhas', fee: 0, allowsTableChoice: false, isPending: true, input: true },
];

const LEVELS = [
  { name: 'Bronze', min: 0, icon: '🥉', perks: ["Acesso VIP", "Agendamento"] },
  { name: 'Prata', min: 400, icon: '🥈', perks: ["Cupom R$ 15", "Aroma 50% OFF"] },
  { name: 'Ouro', min: 900, icon: '🥇', perks: ["Cupom R$ 25", "Aroma GRÁTIS"] },
  { name: 'Diamante', min: 1800, icon: '💎', perks: ["Cupom R$ 50", "Prioridade Total"] },
];

const SYSTEM_COUPONS = {
  'BEMVINDO': { code: 'BEMVINDO', type: 'percent', value: 10 },
  'VIP20': { code: 'VIP20', type: 'fixed', value: 20 },
};

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
const generateBookingId = () => Math.random().toString(36).substr(2, 5).toUpperCase();

// ==================================================================================
// 4. COMPONENTES AVANÇADOS
// ==================================================================================

const InstallPrompt = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    // Simulação visual para navegadores mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isMobile && !isStandalone) setTimeout(() => setShow(true), 3000);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-6 right-6 z-50 animate-slide-up">
      <div className="bg-[#1C1C1E] p-4 rounded-2xl border border-white/10 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#0A84FF] rounded-lg flex items-center justify-center"><Smartphone className="text-white w-6 h-6"/></div>
          <div><p className="text-white font-bold text-sm">Instalar App</p><p className="text-gray-400 text-xs">Acesso rápido e offline</p></div>
        </div>
        <button onClick={() => setShow(false)} className="p-2 bg-white/10 rounded-full"><X className="w-4 h-4"/></button>
      </div>
    </div>
  );
};

const LoyaltyFlipCard = ({ data, privacyMode, onTogglePrivacy }) => {
  const [flipped, setFlipped] = useState(false);
  const safeSpent = data.totalSpent || 0;
  const currentLevel = [...LEVELS].reverse().find(l => safeSpent >= l.min) || LEVELS[0];
  const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
  const progress = nextLevel ? Math.min(100, Math.max(0, ((safeSpent - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)) : 100;

  return (
    <div className="flip-container h-48 mb-6" onClick={() => setFlipped(!flipped)}>
      <div className={`flip-card ${flipped ? 'flipped' : ''}`}>
        
        {/* FRENTE */}
        <div className="flip-front ios-card p-5 relative bg-gradient-to-br from-[#1C1C1E] to-[#000]">
          <div className="absolute top-0 right-0 p-4 opacity-50"><MoreHorizontal className="w-5 h-5 text-gray-400"/></div>
          <div className="flex flex-col h-full justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#0A84FF] font-bold mb-1">Thalyson Rewards</p>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2">{currentLevel.name} {currentLevel.icon}</h3>
            </div>
            
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-xs text-gray-400">{privacyMode ? '••••' : formatCurrency(safeSpent)} investidos</span>
                <span className="text-xs font-bold text-[#32D74B]">{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#0A84FF] to-[#32D74B] transition-all duration-1000" style={{ width: `${progress}%` }}/>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-right">{nextLevel ? `Faltam ${formatCurrency(nextLevel.min - safeSpent)} para ${nextLevel.name}` : 'Nível Máximo!'}</p>
            </div>
          </div>
        </div>

        {/* VERSO (QR CODE) */}
        <div className="flip-back flex flex-col items-center justify-center p-5 relative bg-[#111]">
          <div className="absolute top-4 left-4 text-[10px] text-gray-500 uppercase font-bold">Seu ID de Membro</div>
          <div className="bg-white p-2 rounded-xl">
            <QrCode className="w-24 h-24 text-black"/>
          </div>
          <p className="text-gray-400 text-xs mt-3 font-mono tracking-widest">MEMBER-{data.savedName ? data.savedName.slice(0,3).toUpperCase() : 'GUEST'}-{Math.floor(Math.random()*999)}</p>
          <p className="text-[10px] text-[#0A84FF] mt-2 animate-pulse">Apresente para Check-in</p>
        </div>

      </div>
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState('home');
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [showUpsell, setShowUpsell] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminClicks, setAdminClicks] = useState(0);

  // States
  const [loyalty, setLoyalty] = useState(() => SecureStorage.get('DATA') || { savedName: '', totalSpent: 0, inventory: ['BEMVINDO'], notifications: [] });
  const [user, setUser] = useState({ name: '', isAdult: false, isMassagemOk: false });
  const [selection, setSelection] = useState({ service: null, location: null, date: null, time: '', useTable: null, city: '', coupon: null, upgrade: false, music: 'Zen 🧘', aroma: false, paymentMethod: null, installments: 1 });
  const [privacyMode, setPrivacyMode] = useState(true);

  // Initial Load
  useEffect(() => { 
    setTimeout(() => setLoading(false), 1500); 
    if(loyalty.savedName) setUser(prev => ({...prev, name: loyalty.savedName, isAdult: true, isMassagemOk: true}));
  }, []);

  // Persist Data
  useEffect(() => { SecureStorage.set('DATA', loyalty); }, [loyalty]);

  // Toast Helper
  const addToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  // Secret Admin Logic
  const handleLogoClick = () => {
    setAdminClicks(c => c + 1);
    if(adminClicks + 1 === 5) {
      setIsAdmin(true);
      addToast("Modo Admin Ativado 🕵️‍♂️", "success");
      setAdminClicks(0);
    }
  };

  // Pre-Finalization Check (Smart Upsell)
  const handlePreFinalize = () => {
    // Validações básicas
    if (!selection.date || !selection.time || !selection.location || !selection.paymentMethod) {
      addToast("Preencha todos os dados!", "error");
      return;
    }
    // Lógica Upsell: Se não tiver aroma nem upgrade, oferece aroma barato
    if (!selection.aroma && !selection.upgrade) {
      setShowUpsell(true);
    } else {
      handleWhatsApp();
    }
  };

  const handleWhatsApp = (acceptedUpsell = false) => {
    // Aplica o upsell se aceito
    let currentSelection = { ...selection };
    if (acceptedUpsell) {
      currentSelection.aroma = true;
      setSelection(currentSelection); // Atualiza estado visual
    }

    // Cálculos Finais
    const priceBase = currentSelection.service.basePrice;
    let total = priceBase;
    let extrasTxt = "";
    
    if (currentSelection.upgrade) { total += priceBase * CONFIG.PRICES.UPGRADE_PCT; extrasTxt += "\n➕ +30 Min (+Upgrade)"; }
    if (currentSelection.useTable) { total += CONFIG.PRICES.MACA; extrasTxt += "\n➕ Maca Portátil"; }
    
    let aromaPrice = 0;
    if (currentSelection.aroma) {
      const level = [...LEVELS].reverse().find(l => (loyalty.totalSpent||0) >= l.min) || LEVELS[0];
      aromaPrice = (level.name === 'Ouro' || level.name === 'Diamante') ? 0 : (level.name === 'Prata' ? 5 : 10);
      total += aromaPrice;
      extrasTxt += `\n➕ Aromaterapia (${aromaPrice === 0 ? 'GRÁTIS' : formatCurrency(aromaPrice)})`;
    }

    let fee = currentSelection.location.fee || 0;
    let discount = 0;
    if (currentSelection.coupon) {
        discount = currentSelection.coupon.type === 'percent' ? (total * currentSelection.coupon.value / 100) : currentSelection.coupon.value;
    }

    const finalPrice = total + fee - discount;
    const finalPriceCard = currentSelection.paymentMethod === 'credit_card' ? (finalPrice / (1 - 0.10)) : finalPrice; // Simulação juros simples

    // Atualiza Fidelidade
    const newTotalSpent = (loyalty.totalSpent || 0) + total;
    setLoyalty(prev => ({...prev, totalSpent: newTotalSpent, savedName: user.name }));

    // Gera Link
    const msg = `*NOVO PEDIDO #${generateBookingId()}*
👤 ${user.name}
📅 ${currentSelection.date.toLocaleDateString()} às ${currentSelection.time}
💆 ${currentSelection.service.name}
📍 ${currentSelection.location.label} ${currentSelection.city ? `(${currentSelection.city})` : ''}

*RESUMO:*
Base: ${formatCurrency(priceBase)}${extrasTxt}
Taxa Local: ${formatCurrency(fee)}
Desconto: -${formatCurrency(discount)}

*TOTAL: ${formatCurrency(finalPriceCard)}*
Pagamento: ${currentSelection.paymentMethod}
🎵 Vibe: ${currentSelection.music}`;

    const url = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setStep('success');
    setShowUpsell(false);
  };

  // --- RENDERS ---

  return (
    <div className="min-h-screen flex justify-center bg-black text-gray-200 font-sans selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>

      {/* TOASTS */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className="toast" style={{borderLeft: `4px solid ${t.type === 'error' ? '#FF3B30' : '#32D74B'}`}}>
            {t.type === 'error' ? <AlertCircle size={16}/> : <CheckCircle2 size={16}/>} {t.msg}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"/>
          <p className="mt-4 text-xs font-bold tracking-[0.3em] text-blue-500 animate-pulse">CARREGANDO</p>
        </div>
      ) : (
        <div className="w-full max-w-[440px] bg-black sm:my-4 sm:rounded-[40px] sm:border border-white/10 shadow-2xl relative overflow-hidden h-screen sm:h-[90vh] flex flex-col">
          
          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1a1a2e_0%,_#000000_70%)] pointer-events-none"/>

          {/* HEADER */}
          <div className="relative z-20 px-6 pt-10 pb-4 flex justify-between items-center bg-gradient-to-b from-black/90 to-transparent">
             {step !== 'home' ? (
               <button onClick={() => setStep('home')} className="p-2 -ml-2 rounded-full bg-white/5 backdrop-blur-md"><ChevronLeft className="text-[#0A84FF]"/></button>
             ) : (
               <div onClick={handleLogoClick} className="cursor-pointer">
                 <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Bem-vindo</p>
                 <h1 className="text-xl font-bold text-white">Massagens Relaxantes</h1>
               </div>
             )}
             <div className="flex gap-3">
               <button className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-white/10"><Bell className="w-5 h-5 text-gray-400"/></button>
             </div>
          </div>

          {/* CONTENT AREA */}
          <div className="flex-1 overflow-y-auto px-6 pb-32 relative z-10">
            
            {step === 'home' && (
              <div className="animate-fade-in pt-4">
                <LoyaltyFlipCard data={loyalty} privacyMode={privacyMode} />
                
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {services.map(s => (
                    <button key={s.id} onClick={() => { setSelection(prev => ({...prev, service: s})); setStep('config'); }} className="ios-card p-4 rounded-2xl text-left hover:bg-white/5 relative group overflow-hidden">
                      <div className="absolute top-0 right-0 bg-blue-600 w-12 h-12 blur-xl opacity-20 group-hover:opacity-40 transition-opacity"/>
                      {s.highlight && <span className="text-[9px] font-bold bg-[#FFD60A] text-black px-2 py-0.5 rounded-full mb-2 inline-block">{s.highlight}</span>}
                      <h3 className="font-bold text-lg leading-tight mb-1">{s.name}</h3>
                      <p className="text-xs text-gray-400 mb-2 h-8 overflow-hidden">{s.description}</p>
                      <div className="flex justify-between items-center">
                         <span className="text-blue-500 font-bold">{formatCurrency(s.basePrice)}</span>
                         <div className="w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center"><ArrowRight className="w-3 h-3 text-blue-500"/></div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-2xl bg-[#1C1C1E] border border-white/5 flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="text-green-500 w-5 h-5"/></div>
                  <div><h4 className="text-sm font-bold">Ambiente Seguro</h4><p className="text-xs text-gray-400">Sigilo total e profissionalismo garantido.</p></div>
                </div>

                {isAdmin && (
                  <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 mb-6">
                    <h4 className="text-red-500 font-bold text-sm mb-2 flex items-center gap-2"><Settings className="w-4 h-4"/> Painel Admin</h4>
                    <p className="text-xs text-gray-400 mb-3">Total Investido (Local): {formatCurrency(loyalty.totalSpent)}</p>
                    <button onClick={() => { SecureStorage.clear(); window.location.reload(); }} className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg flex items-center gap-1"><Trash2 className="w-3 h-3"/> Resetar Dados</button>
                  </div>
                )}
              </div>
            )}

            {step === 'config' && (
              <div className="animate-slide-up space-y-6 pt-2">
                {/* IDENTIFICAÇÃO RÁPIDA */}
                <div className="ios-card p-4 rounded-2xl">
                  <label className="text-xs text-blue-500 font-bold uppercase mb-2 block">Seu Nome</label>
                  <input value={user.name} onChange={e => setUser({...user, name: e.target.value})} placeholder="Como gosta de ser chamado?" className="w-full bg-transparent text-xl font-bold border-b border-white/10 pb-2 focus:border-blue-500 outline-none"/>
                </div>

                {/* DATA E HORA */}
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">Quando?</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {[0,1,2,3].map(d => {
                      const date = new Date(); date.setDate(date.getDate() + d);
                      const isSel = selection.date?.getDate() === date.getDate();
                      return (
                        <button key={d} onClick={() => setSelection({...selection, date})} className={`min-w-[70px] h-20 rounded-xl border flex flex-col items-center justify-center transition-all ${isSel ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                          <span className="text-xs font-bold uppercase">{date.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                          <span className="text-2xl font-bold">{date.getDate()}</span>
                        </button>
                      )
                    })}
                  </div>
                  {selection.date && (
                    <div className="grid grid-cols-4 gap-2 mt-2 animate-fade-in">
                      {['09:00','10:00','11:00','13:00','14:00','15:00','16:00','18:00','19:00','20:00'].map(t => (
                        <button key={t} onClick={() => setSelection({...selection, time: t})} className={`py-2 rounded-lg text-xs font-bold border ${selection.time === t ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>{t}</button>
                      ))}
                    </div>
                  )}
                </div>

                {/* LOCAL */}
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">Onde?</h3>
                  <div className="space-y-2">
                    {locations.map(l => (
                      <button key={l.id} onClick={() => setSelection({...selection, location: l})} className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${selection.location?.id === l.id ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                        <div className="flex items-center gap-3">
                           <MapPin className={`w-5 h-5 ${selection.location?.id === l.id ? 'text-blue-500' : 'text-gray-500'}`}/>
                           <span className="font-medium text-sm">{l.label}</span>
                        </div>
                        {l.fee > 0 && <span className="text-xs font-bold text-yellow-500">+{formatCurrency(l.fee)}</span>}
                      </button>
                    ))}
                    {selection.location?.input && (
                      <input value={selection.city} onChange={e => setSelection({...selection, city: e.target.value})} placeholder="Qual cidade?" className="w-full bg-[#1C1C1E] p-3 rounded-xl border border-white/10 text-sm"/>
                    )}
                  </div>
                </div>
                
                {/* PAGAMENTO */}
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase mb-3 ml-1">Pagamento</h3>
                  <div className="grid grid-cols-3 gap-2">
                     {['pix', 'cash', 'credit_card'].map( method => (
                       <button key={method} onClick={() => setSelection({...selection, paymentMethod: method})} className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 ${selection.paymentMethod === method ? 'bg-blue-500/10 border-blue-500 text-white' : 'bg-[#1C1C1E] border-white/10 text-gray-400'}`}>
                          {method === 'pix' ? <QrCode size={18}/> : method === 'cash' ? <Banknote size={18}/> : <CreditCard size={18}/>}
                          <span className="text-[10px] uppercase font-bold">{method === 'credit_card' ? 'Cartão' : method === 'cash' ? 'Dinheiro' : 'Pix'}</span>
                       </button>
                     ))}
                  </div>
                </div>

              </div>
            )}

            {step === 'success' && (
              <div className="flex flex-col items-center justify-center pt-20 animate-fade-in text-center">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)] animate-float">
                  <Check className="w-12 h-12 text-white stroke-[3]"/>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h2>
                <p className="text-gray-400 text-sm mb-8 px-8">Verifique seu WhatsApp para confirmar os detalhes.</p>
                
                <div className="w-full space-y-3">
                  <a href={generateCalendarLink(selection.service.name, selection.date, selection.time)} target="_blank" className="w-full bg-[#1C1C1E] border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-gray-300 hover:bg-[#2C2C2E]">
                    <Calendar className="w-4 h-4 text-blue-500"/> Adicionar à Agenda
                  </a>
                  <button onClick={() => setStep('home')} className="w-full py-3 text-sm text-gray-500 hover:text-white">Voltar ao Início</button>
                </div>
              </div>
            )}
            
          </div>

          {/* FOOTER ACTION */}
          {step === 'config' && (
            <div className="absolute bottom-0 w-full p-5 bg-[#1C1C1E]/90 backdrop-blur-md border-t border-white/10 z-30">
              <button onClick={handlePreFinalize} className="w-full ios-btn-primary py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2">
                Confirmar no WhatsApp <ArrowRight className="w-5 h-5"/>
              </button>
            </div>
          )}

          {/* UPSELL MODAL */}
          {showUpsell && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#1C1C1E] w-full max-w-sm rounded-3xl p-6 border border-yellow-500/30 shadow-2xl relative overflow-hidden animate-slide-up">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-orange-500"/>
                <div className="flex justify-center mb-4"><Flame className="w-12 h-12 text-orange-500 fill-orange-500 animate-pulse"/></div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Espere um pouco!</h3>
                <p className="text-gray-400 text-center text-sm mb-6">Que tal adicionar <b>Aromaterapia</b> por apenas <span className="text-green-400 font-bold">R$ 5,00</span> (50% OFF)?</p>
                <div className="space-y-3">
                  <button onClick={() => handleWhatsApp(true)} className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-black flex justify-center items-center gap-2">
                    <Sparkles className="w-4 h-4"/> SIM, EU QUERO
                  </button>
                  <button onClick={() => handleWhatsApp(false)} className="w-full py-3 text-gray-500 text-sm font-medium hover:text-white">Não, obrigado</button>
                </div>
              </div>
            </div>
          )}
          
          <InstallPrompt />
        </div>
      )}
    </div>
  );
}
