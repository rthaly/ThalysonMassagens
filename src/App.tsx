import React, { useState, useEffect, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Share2, HelpCircle, Wallet, Gift, 
  CreditCard, Banknote, Building, RefreshCw, User, Copy, 
  CheckCircle, Info, Navigation, BedDouble, Map, Lock
} from 'lucide-react';

// ==================================================================================
// 1. DATABASE & CONFIGURAÇÕES (TEXTOS E PREÇOS EXATOS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  PIX_KEY: "62922530000144",
  STORAGE_KEY: 'thaly_app_v12_master',
  XP_TARGET: 300 
};

const SERVICES = [
  { 
    id: 'completa', 
    name: '🔥 Completa (1h)', 
    label: 'A MAIS PEDIDA',
    price: 175, 
    xp: 100,
    desc: 'Corpo a corpo + finalização.',
    details: [
        '1️⃣ Relaxante no corpo todo (Tira tensão)',
        '2️⃣ Corpo a Corpo (Pele com pele, sensitivo)',
        '3️⃣ Tântrica (Massagem íntima c/ finalização manual)'
    ],
    disclaimer: 'Focado no prazer e relaxamento. Não tem penetração nem oral.'
  },
  { 
    id: 'relax', 
    name: '🍃 Relaxante (1h)', 
    label: 'TERAPÊUTICA',
    price: 145, 
    xp: 50,
    desc: 'Apenas muscular.',
    details: [
        '1️⃣ Foco 100% terapêutico',
        '2️⃣ Remoção de dores e nós',
        '3️⃣ Alívio de stress físico'
    ],
    disclaimer: 'Atenção: Nesta modalidade NÃO há toques íntimos.'
  }
];

const EXTRAS = [
  { id: 'more_time', label: 'Duração 1h30', sub: '+30 minutos de sessão', icon: Clock, price: 70 },
  { id: 'touch', label: 'Interatividade', sub: 'Toque recíproco permitido', icon: Flame, price: 63, warn: 'Fico de cueca na interação' },
  { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos essenciais premium', icon: Wind, price: 10 }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Gostei muito! Um toque super bom! Foi uma experiência ótima.", a: "Marcelo", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Foi excelente! Faria semanal kkk Obrigado por ter vindo!",a:"Everton", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", a: "Anônimo", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós das costas.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Agradeço pela paciência e pelo serviço impecável.", a: "Sr. João", s: 5 }
];

const FAQS = [
    { q: "Onde é o atendimento?", a: "Vou até você: Sua Casa, Apartamento, Hotel ou Motel." },
    { q: "O deslocamento é incluso?", a: "Não. A taxa de Uber (Ida/Volta) é calculada e combinada no WhatsApp." },
    { q: "Aceita Cartão?", a: "Sim. Pix, Dinheiro e Cartão de Crédito/Débito." },
    { q: "É seguro e sigiloso?", a: "Totalmente. Profissionalismo e discrição são prioridade." }
];

// ==================================================================================
// 2. DESIGN SYSTEM (UX/UI SENIOR)
// ==================================================================================

const Utils = {
    fmtMoney: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
    vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
    copyPix: () => { navigator.clipboard.writeText(CONFIG.PIX_KEY); return true; }
};

const Toast = ({ msg, show }) => (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 transform ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
        <div className="bg-[#1C1C1E]/90 border border-green-500/40 text-white px-6 py-3 rounded-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center gap-3 backdrop-blur-xl">
            <CheckCircle size={18} className="text-green-500"/>
            <span className="text-xs font-bold uppercase tracking-wider">{msg}</span>
        </div>
    </div>
);

const BigInput = ({ label, value, onChange, placeholder, type="text", icon: Icon }) => (
  <div className="mb-5 w-full group">
    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 mb-2 block tracking-wider group-focus-within:text-green-500 transition-colors">{label}</label>
    <div className="relative">
        <input 
            type={type} value={value} onChange={onChange} placeholder={placeholder}
            className="w-full h-14 bg-[#111] border border-[#333] rounded-2xl px-4 pl-12 text-white text-base placeholder:text-gray-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/30 outline-none transition-all duration-300"
        />
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-green-500 transition-colors" size={20} />}
    </div>
  </div>
);

const PrimaryButton = ({ onClick, disabled, label, icon: Icon, pulse, variant="primary" }) => (
    <button 
        onClick={onClick} disabled={disabled}
        className={`w-full h-14 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98]
            ${variant === 'primary' 
                ? (disabled ? 'bg-[#222] text-gray-600 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]')
                : 'bg-[#1C1C1E] border border-[#333] text-white hover:bg-[#222]'
            }
            ${pulse ? 'animate-pulse' : ''}
        `}
    >
        {label} {Icon && <Icon size={18}/>}
    </button>
);

const SplashScreen = ({ onFinish }) => {
    const [fade, setFade] = useState(false);
    useEffect(() => { setTimeout(() => setFade(true), 2000); setTimeout(onFinish, 2500); }, []);
    return (
        <div className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-opacity duration-700 ${fade ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse"></div>
                <div className="relative animate-bounce text-green-500"><Zap size={64} fill="currentColor"/></div>
            </div>
            <h1 className="text-3xl font-black tracking-[0.4em] text-white">THALY</h1>
            <p className="text-[10px] text-gray-600 mt-3 uppercase tracking-widest font-bold">Experiência VIP</p>
        </div>
    );
};

const ReviewCarousel = () => (
    <div className="w-full overflow-hidden relative py-4">
        <div className="flex gap-4 animate-scroll w-max">
             {[...REVIEWS_DB, ...REVIEWS_DB].map((r, i) => (
                 <div key={i} className="w-[280px] bg-[#161616] p-6 rounded-3xl border border-[#2A2A2A] flex-shrink-0 relative overflow-hidden">
                     <div className="flex text-yellow-500 mb-3 gap-1">{[...Array(5)].map((_,k)=><Star key={k} size={12} fill="currentColor"/>)}</div>
                     <p className="text-gray-300 text-xs italic mb-4 leading-relaxed line-clamp-3">"{r.t}"</p>
                     <div className="flex items-center gap-2 border-t border-[#333] pt-3">
                        <Shield size={12} className="text-green-500"/>
                        <p className="text-[9px] font-black text-gray-500 uppercase tracking-wider">{r.a}</p>
                     </div>
                 </div>
             ))}
        </div>
        <style>{`@keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-scroll { animation: scroll 120s linear infinite; }`}</style>
    </div>
);

// ==================================================================================
// 3. APP LÓGICA
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  // Persistence
  const [user, setUser] = useState(() => {
      try {
          const s = localStorage.getItem(CONFIG.STORAGE_KEY);
          return s ? JSON.parse(s) : { name: '', xp: 0, coupons: [{ id: 'WELCOME', label: '1ª Vez', val: 15 }] };
      } catch { return { name: '', xp: 0, coupons: [] }; }
  });
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // Session
  const initialBooking = {
      healthChecked: false,
      service: null,
      extras: {}, 
      date: null,
      time: null,
      locationType: 'home', 
      address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
      payment: null,
      appliedCoupon: null
  };
  const [booking, setBooking] = useState(initialBooking);

  // Actions
  const showToast = (msg) => { setToast({ show: true, msg }); setTimeout(() => setToast({ show: false, msg: '' }), 3000); };
  const handleNext = () => { Utils.vibrate(); window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const handleBack = () => { Utils.vibrate(); setStep(s => s - 1); };
  const handleReset = () => { setSuccess(false); setBooking(initialBooking); setStep(0); };

  // Lógica "Esgotado" Realista
  const isTimeBlocked = (date, timeStr) => {
      if (!date) return true;
      const now = new Date();
      const sel = new Date(date);
      const [h] = timeStr.split(':').map(Number);
      if (sel.toDateString() === now.toDateString() && h <= now.getHours()) return 'past';
      if ((sel.getDate() + h) % 6 === 0) return 'sold_out'; 
      return 'available';
  };

  const calculateTotal = () => {
      let s = booking.service?.price || 0;
      let e = 0;
      Object.keys(booking.extras).forEach(k => { if(booking.extras[k]) e += EXTRAS.find(x => x.id === k).price; });
      const d = booking.appliedCoupon?.val || 0;
      return { service: s, extras: e, disc: d, final: Math.max(0, s + e - d) };
  };

  const isAddressValid = () => {
      const { city, street, number, district, motelName, suite, hotelName, room } = booking.address;
      if (!city || city.length < 3) return false;
      if (booking.locationType === 'motel') return motelName && suite;
      if (booking.locationType === 'hotel') return hotelName && room;
      return street && number && district;
  };

  const finalize = () => {
      const newCoupons = user.coupons.filter(c => c.id !== booking.appliedCoupon?.id);
      const newXP = user.xp + (booking.service?.xp || 0);
      if (Math.floor(newXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
          newCoupons.push({ id: `RWD_${Date.now()}`, label: 'Fidelidade', val: 30 });
      }
      setUser({ ...user, xp: newXP, coupons: newCoupons });

      let locStr = "";
      let mapLink = "";
      const addr = booking.address;
      
      if(booking.locationType === 'motel') {
          locStr = `🏩 MOTEL: ${addr.motelName}\n🚪 SUÍTE: ${addr.suite}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.motelName + ' ' + addr.city)}`;
      } else if(booking.locationType === 'hotel') {
          locStr = `🏨 HOTEL: ${addr.hotelName}\n🚪 QUARTO: ${addr.room}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.hotelName + ' ' + addr.city)}`;
      } else {
          locStr = `🏠 CASA: ${addr.street}, ${addr.number}\n🏘️ BAIRRO: ${addr.district} ${addr.comp ? `(${addr.comp})` : ''}`;
          mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr.street + ', ' + addr.number + ' - ' + addr.district + ', ' + addr.city)}`;
      }

      const fin = calculateTotal();
      const extrasTxt = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> `• ${EXTRAS.find(x=>x.id===k).label} (+${Utils.fmtMoney(EXTRAS.find(x=>x.id===k).price)})`).join('\n');

      const text = `
*AGENDAMENTO VIP* 🌿
---------------------------
👤 *Cliente:* ${user.name}
✅ *Status:* Confirmado (+18)

💆 *Serviço:* ${booking.service?.name}
📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

✨ *Adicionais:*
${extrasTxt || 'Nenhum'}

📍 *Localização:*
${locStr}
🗺️ Cidade: ${addr.city}
🔗 Maps: ${mapLink}

💰 *RESUMO FINANCEIRO:*
Serviço: ${Utils.fmtMoney(fin.service)}
Extras: ${Utils.fmtMoney(fin.extras)}
${booking.appliedCoupon ? `🎟️ Cupom: - ${Utils.fmtMoney(fin.disc)}` : ''}
*TOTAL A PAGAR: ${Utils.fmtMoney(fin.final)}*

🚗 *Uber (Ida/Volta):* A calcular no Zap.

💳 *Pagamento:* ${booking.payment?.toUpperCase()}
`.trim();

      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`, '_blank');
      setSuccess(true);
  };

  const financials = calculateTotal();

  if (loading) return <SplashScreen onFinish={() => setLoading(false)} />;

  if (success) return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center animate-fade-in text-white">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(34,197,94,0.4)]"><Check size={48} className="text-black" strokeWidth={4}/></div>
          <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">Sucesso!</h2>
          <p className="text-gray-400 mb-8 max-w-xs">Pedido enviado. Aguarde a confirmação do Uber no WhatsApp.</p>
          <PrimaryButton onClick={handleReset} label="Novo Agendamento" icon={RefreshCw} variant="secondary"/>
      </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-48 selection:bg-green-500 selection:text-black">
      <Toast show={toast.show} msg={toast.msg} />

      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5">
         <div className="px-5 py-4 flex justify-between items-center">
             <div className="flex items-center gap-3">
                 {step > 0 && <button onClick={handleBack} className="p-2 -ml-2 text-gray-400 active:text-white"><ChevronLeft/></button>}
                 <h1 className="text-sm font-black tracking-[0.2em] uppercase text-white">Thalymassagens</h1>
             </div>
             <div className="flex gap-2">
                 <button onClick={() => setWalletOpen(true)} className="p-2 bg-[#111] rounded-full border border-[#222] text-green-500 relative">
                    <Gift size={20}/>
                    {user.coupons.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-black"></span>}
                 </button>
                 <button onClick={() => setMenuOpen(true)} className="p-2 bg-[#111] rounded-full border border-[#222]"><Menu size={20}/></button>
             </div>
         </div>
         <div className="h-[2px] w-full bg-[#111]"><div className="h-full bg-green-500 transition-all duration-500 ease-out" style={{width: `${((step+1)/3)*100}%`}}></div></div>
      </header>

      {/* MODALS */}
      {menuOpen && <div className="fixed inset-0 z-50 flex justify-end"><div className="absolute inset-0 bg-black/80" onClick={()=>setMenuOpen(false)}></div><div className="relative w-72 h-full bg-[#111] border-l border-[#222] p-6 shadow-2xl animate-slide-in"><button onClick={()=>setMenuOpen(false)} className="mb-8"><X/></button><div className="bg-[#222] p-4 rounded-xl mb-4 text-center"><p className="text-xs text-gray-400 uppercase">Fidelidade</p><p className="text-green-500 font-bold text-xl">{user.xp} XP</p></div><button className="w-full py-4 bg-[#222] rounded-xl font-bold text-sm mb-2" onClick={() => { setHelpOpen(true); setMenuOpen(false); }}>Dúvidas</button><button className="w-full py-4 bg-[#222] rounded-xl font-bold text-sm" onClick={()=>{if(navigator.share)navigator.share({url:window.location.href})}}>Compartilhar</button></div></div>}
      {helpOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"><div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6"><h3 className="font-bold text-xl mb-4">Dúvidas</h3><div className="space-y-3">{FAQS.map((f,i)=>(<div key={i} className="bg-[#111] p-4 rounded-xl border border-[#222]"><p className="text-green-500 text-xs font-bold mb-1">{f.q}</p><p className="text-xs text-gray-400">{f.a}</p></div>))}</div><button onClick={()=>setHelpOpen(false)} className="w-full mt-4 py-3 bg-[#333] rounded-xl font-bold text-sm">Fechar</button></div></div>}
      {walletOpen && <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90"><div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6"><div className="flex justify-between mb-6"><h3 className="font-bold text-white text-xl flex gap-2"><Wallet className="text-green-500"/> Carteira</h3><button onClick={()=>setWalletOpen(false)}><X/></button></div>{user.coupons.length===0?<p className="text-center text-gray-500">Vazia.</p>:user.coupons.map(c=>(<button key={c.id} onClick={()=>{setBooking({...booking, appliedCoupon:c});setWalletOpen(false);showToast('CUPOM APLICADO!');}} className="w-full p-4 bg-black border border-green-900 rounded-xl flex justify-between mb-2 text-green-500 font-bold"><span>{c.label}</span><span>R$ {c.val}</span></button>))}</div></div>}

      <main className="pt-24 px-5 max-w-md mx-auto animate-fade-in">

        {/* STEP 0: INTRO & SERVIÇOS */}
        {step === 0 && (
            <>
                {user.coupons.some(c=>c.id==='WELCOME') && (
                    <div onClick={() => setWalletOpen(true)} className="p-4 rounded-2xl bg-gradient-to-r from-green-900/20 to-black border border-green-500/20 flex items-center gap-4 cursor-pointer mb-8 hover:border-green-500/50 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-black animate-pulse"><Gift size={20}/></div>
                        <div><p className="font-black text-green-400 text-sm uppercase">Cupom Disponível</p><p className="text-xs text-gray-400">Toque para usar seu desconto.</p></div>
                    </div>
                )}
                <h2 className="text-3xl font-black mb-2 tracking-tight">Bem-vindo.</h2>
                <div className="space-y-4 mb-10">
                    <BigInput label="Seu Nome" placeholder="Como prefere ser chamado?" value={user.name} onChange={e => setUser({...user, name: e.target.value})} icon={User} />
                    <div onClick={() => setBooking({...booking, healthChecked: !booking.healthChecked})} className={`p-5 rounded-2xl border flex gap-4 cursor-pointer items-center transition-all ${booking.healthChecked ? 'bg-[#1C1C1E] border-green-500' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-6 h-6 rounded flex items-center justify-center border ${booking.healthChecked ? 'bg-green-500 border-green-500 text-black' : 'border-[#444]'}`}>{booking.healthChecked && <Check size={16} strokeWidth={3}/>}</div>
                        <p className="text-xs text-gray-400">Tenho +18 anos e estou saudável.</p>
                    </div>
                </div>
                
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Escolha a Experiência</h3>
                
                <div className="space-y-6 pb-10">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => setBooking({...booking, service: s})} className={`relative overflow-hidden w-full p-6 rounded-[2rem] border-2 transition-all cursor-pointer ${booking.service?.id === s.id ? 'bg-[#18181b] border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'bg-[#111] border-[#222]'}`}>
                            <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest ${booking.service?.id === s.id ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-500'}`}>{s.label}</div>
                            <h3 className={`text-xl font-black uppercase mb-1 ${booking.service?.id === s.id ? 'text-white' : 'text-gray-400'}`}>{s.name}</h3>
                            <div className="flex items-center gap-2 mb-4"><span className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-400' : 'text-gray-500'}`}>{Utils.fmtMoney(s.price)}</span></div>
                            <div className={`space-y-2 mb-4 p-4 rounded-xl ${booking.service?.id === s.id ? 'bg-black/40 border border-white/5' : 'bg-black/20'}`}>{s.steps.map((step, i) => (<p key={i} className="text-xs text-gray-300 font-medium">{step}</p>))}</div>
                            <p className="text-[10px] text-gray-500 flex items-center gap-1 italic"><Info size={10}/> {s.disclaimer}</p>
                        </div>
                    ))}
                </div>

                <div className="mb-20">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Avaliações (+50)</p>
                    <ReviewCarousel />
                </div>

                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-[60]">
                    <PrimaryButton disabled={!booking.healthChecked || user.name.length < 3 || !booking.service} onClick={handleNext} label="Continuar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 1: EXTRAS & DATA */}
        {step === 1 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Personalize</h2>
                <div className="mb-10">
                    {EXTRAS.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div key={ex.id} onClick={() => setBooking({...booking, extras: {...booking.extras, [ex.id]: !active}})} className={`relative p-5 rounded-2xl border transition-all cursor-pointer mb-3 flex items-center justify-between ${active ? 'bg-[#1C1C1E] border-green-500/50' : 'bg-[#111] border-[#222]'}`}>
                                <div className="flex items-center gap-4"><div className={`w-10 h-10 rounded-full flex items-center justify-center ${active ? 'bg-green-500 text-black' : 'bg-[#222] text-gray-600'}`}><ex.icon size={20}/></div><div><p className="font-bold text-sm text-white">{ex.label}</p><p className="text-xs text-gray-500">{ex.sub}</p>{active && ex.warn && <p className="text-[10px] text-yellow-500 mt-1 flex items-center gap-1"><AlertTriangle size={10}/> {ex.warn}</p>}</div></div>
                                <span className={`font-bold text-sm ${active ? 'text-green-500' : 'text-gray-600'}`}>+ R$ {ex.price}</span>
                            </div>
                        )
                    })}
                </div>
                <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Data e Hora</p>
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide mb-4">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        return <button key={i} onClick={() => setBooking({...booking, date: d, time: null})} className={`min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border flex-shrink-0 transition-all ${isSel ? 'bg-white text-black border-white' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}><span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span><span className="text-2xl font-bold">{d.getDate()}</span></button>
                    })}
                </div>
                {booking.date && (
                    <div className="grid grid-cols-4 gap-2 animate-fade-in pb-24">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = isTimeBlocked(booking.date, t);
                            return <button key={t} disabled={status !== 'available'} onClick={() => setBooking({...booking, time: t})} className={`py-3 rounded-xl text-xs font-bold border relative ${booking.time === t ? 'bg-white text-black border-white' : status === 'sold_out' ? 'opacity-50 bg-[#111] border-[#222]' : status === 'past' ? 'opacity-30 bg-[#111] border-[#222]' : 'bg-[#1C1C1E] border-[#333]'}`}>{t}{status === 'sold_out' && <div className="absolute inset-0 flex items-center justify-center bg-black/80 rounded-xl"><span className="text-[8px] text-red-500 font-black -rotate-12">ESGOTADO</span></div>}</button>
                        })}
                    </div>
                )}
                <div className="fixed bottom-0 left-0 w-full p-5 bg-black/95 border-t border-white/10 z-[60]">
                    <PrimaryButton disabled={!booking.time} onClick={handleNext} label="Avançar" icon={ArrowRight} />
                </div>
            </>
        )}

        {/* STEP 2: LOCAL, RESUMO & PAGAMENTO */}
        {step === 2 && (
            <>
                <h2 className="text-2xl font-bold mb-8">Localização</h2>
                
                <div className="flex bg-[#1C1C1E] p-1.5 rounded-2xl mb-6 border border-[#333]">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button key={t} onClick={() => setBooking({...booking, locationType: t, address: {...booking.address, motelName: '', suite: '', hotelName: '', room: '', street: '', number: '', district: ''}})} 
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${booking.locationType === t ? 'bg-[#333] text-white shadow-md' : 'text-gray-500'}`}>
                            {t === 'home' ? 'Casa' : t.toUpperCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4 mb-8">
                    <BigInput label="Cidade Atual" placeholder="Ex: Londrina..." value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} icon={MapPin} />
                    
                    {booking.locationType === 'motel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Nome do Motel" placeholder="Ex: Motel London" value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número da Suíte" placeholder="Ex: 20" type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : booking.locationType === 'hotel' ? (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Nome do Hotel" placeholder="Ex: Hotel Bourbon" value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} icon={Building} />
                            <BigInput label="Número do Quarto" placeholder="Ex: 104" type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} icon={BedDouble} />
                        </div>
                    ) : (
                        <div className="animate-fade-in space-y-4">
                            <BigInput label="Endereço (Rua)" placeholder="Ex: Rua Piauí" value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} icon={Navigation} />
                            <div className="flex gap-3">
                                <div className="w-1/3"><BigInput label="Número" placeholder="123" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                                <div className="w-2/3"><BigInput label="Bairro" placeholder="Centro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                            </div>
                            <BigInput label="Complemento (Opcional)" placeholder="Ex: Apto 101" value={booking.address.comp} onChange={e => setBooking({...booking, address: {...booking.address, comp: e.target.value}})} />
                        </div>
                    )}
                </div>

                {/* TICKET DE RESUMO */}
                <div className="bg-[#1C1C1E] border border-[#333] rounded-[2rem] p-6 mb-8 relative overflow-hidden">
                    <div className="border-b border-[#333] pb-4 mb-4 text-center">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Resumo do Pedido</p>
                        <h3 className="text-xl font-black text-white">{booking.service?.name}</h3>
                        <p className="text-sm text-green-500 font-bold mt-1">{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                    </div>
                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm text-gray-400"><span>Valor Base</span><span>{Utils.fmtMoney(booking.service?.price)}</span></div>
                        {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=> (
                            <div key={k} className="flex justify-between text-sm text-white"><span>+ {EXTRAS.find(e=>e.id===k).label}</span><span>{Utils.fmtMoney(EXTRAS.find(e=>e.id===k).price)}</span></div>
                        ))}
                        {booking.appliedCoupon ? <div className="flex justify-between text-sm text-green-400 font-bold py-2 border-t border-[#333]"><span>Cupom Aplicado</span><span>- {Utils.fmtMoney(booking.appliedCoupon.val)}</span></div> : <button onClick={() => setShowWallet(true)} className="w-full py-2 border border-dashed border-[#444] rounded-lg text-xs text-gray-500 mt-2 flex items-center justify-center gap-2 hover:text-green-500 hover:border-green-500 transition-colors"><Ticket size={14}/> Tenho Cupom</button>}
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-[#333]">
                        <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
                        <span className="text-3xl font-black text-white">{Utils.fmtMoney(financials.final)}</span>
                    </div>
                </div>

                <div className="mb-32">
                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-3 ml-1">Pagamento (No Local)</p>
                    <div className="grid grid-cols-3 gap-3">
                        {['pix', 'card', 'esp'].map(p => (
                            <button key={p} onClick={() => setBooking({...booking, payment: p})} className={`py-4 rounded-xl border text-[10px] font-black uppercase flex flex-col items-center gap-2 transition-all ${booking.payment === p ? 'bg-white text-black shadow-lg' : 'bg-[#1C1C1E] border-[#333] text-gray-500'}`}>
                                {p === 'pix' && <Zap size={18}/>}{p === 'card' && <CreditCard size={18}/>}{p === 'esp' && <Banknote size={18}/>}
                                {p === 'esp' ? 'Dinheiro' : p === 'card' ? 'Cartão' : 'Pix'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="fixed bottom-0 left-0 w-full p-6 bg-black/95 border-t border-white/10 z-[60]">
                    <div className="flex justify-between items-center mb-4 px-1"><span className="text-xs text-gray-500"><AlertTriangle size={12} className="inline text-yellow-500 mb-0.5"/> Uber não incluso</span><button onClick={() => {Utils.copyPix(); showToast("CHAVE PIX COPIADA!")}} className="text-[10px] font-bold text-green-500 flex items-center gap-1"><Copy size={10}/> PIX COPY</button></div>
                    <PrimaryButton disabled={!isAddressValid() || !booking.payment} onClick={finalize} label="Confirmar Agendamento" icon={MessageCircle} pulse />
                </div>
            </>
        )}
      </main>
      <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } .animate-fade-in { animation: fadeIn 0.5s ease-out; } @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } } .animate-slide-in { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); } .animate-scroll { animation: scroll 120s linear infinite; } @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
    </div>
  );
}
