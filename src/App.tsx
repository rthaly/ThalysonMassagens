import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronRight, Menu, X, 
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, User, AlertTriangle, Car
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO & LOGICA COMERCIAL
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 15, 
  XP_THRESHOLDS: { VIP: 80, ALPHA: 100 }, 
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 80, 
    AROMA: 15,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

// CIDADES E TAXAS DE DESLOCAMENTO
const CITIES = [
  { id: 'santafe', name: 'Santa Fé do Sul', fee: 0 },
  { id: 'tresfron', name: 'Três Fronteiras', fee: 20 },
  { id: 'jales', name: 'Jales', fee: 50 },
  { id: 'rubineia', name: 'Rubinéia', fee: 25 },
  { id: 'aparecida', name: 'Ap. do Taboado', fee: 60 },
  { id: 'outra', name: 'Outra (Consultar)', fee: 0 } // Valor a combinar
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home, desc: 'Atendimento na sua residência' },
  { id: 'apto', label: 'Apartamento', icon: Building, desc: 'Prédio / Condomínio' },
  { id: 'hotel', label: 'Hotel', icon: Bed, desc: 'Vou até o seu quarto' },
  { id: 'motel', label: 'Motel', icon: Flame, desc: 'Encontro discreto na suíte' },
];

const LEVELS = [
  { name: 'Visitante', min: 0, color: 'text-gray-400', bg: 'bg-gray-600' },
  { name: 'Membro', min: 20, color: 'text-blue-400', bg: 'bg-blue-500' },
  { name: 'VIP', min: 60, color: 'text-[#FFD60A]', bg: 'bg-[#FFD60A]' }, 
  { name: 'ALPHA', min: 99, color: 'text-[#32D74B]', bg: 'bg-[#32D74B]' }
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Alpha Premium', 
    short: 'Protocolo Completo',
    desc: 'O ápice do relaxamento. Massagem profunda, óleo quente, toque pele na pele e finalização manual intensa. Você no controle.', 
    duration: 60, 
    price: 160, 
    badge: 'MAIS ESCOLHIDO 🏆',
    xp: 60 
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico. Ideal para remover dores lombares e stress. Movimentos firmes e técnicos. Sem interação íntima.', 
    duration: 50, 
    price: 130, 
    badge: null,
    xp: 30
  },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

// ==================================================================================
// 2. UTILITÁRIOS & DESIGN SYSTEM
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours() + 1; 
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #000000; --card-bg: #111111; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, select, button { outline: none; }
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pulse-glow { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }

.animate-enter { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s ease-out forwards; }
.btn-pulse { animation: pulse-glow 2s infinite; }

.glass-header { background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px; transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1); }
.card-selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.05); box-shadow: 0 0 30px rgba(10, 132, 255, 0.1); }
.input-field { background: #161616; border: 1px solid #333; color: white; border-radius: 14px; width: 100%; transition: all 0.3s; font-size: 15px; padding: 14px; }
.input-field:focus { border-color: var(--primary); background: #222; }
.primary-btn { background: var(--primary); color: white; border-radius: 18px; font-weight: 700; border: none; box-shadow: 0 8px 25px rgba(10, 132, 255, 0.3); }

.section-blur { opacity: 0.3; filter: blur(4px); pointer-events: none; transition: all 0.6s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }
`;

// ==================================================================================
// 3. COMPONENTES
// ==================================================================================

const LevelBar = ({ xp }) => {
    const currentLevel = LEVELS.slice().reverse().find(l => xp >= l.min) || LEVELS[0];
    const nextLevel = LEVELS.find(l => l.min > xp);
    const progress = nextLevel ? Math.min(100, ((xp - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100) : 100;

    return (
        <div className="mb-6 animate-enter">
            <div className="flex justify-between items-end mb-2">
                <div><span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Nível Cliente</span><div className={`flex items-center gap-2 font-black text-lg ${currentLevel.color}`}><Crown size={18} fill="currentColor" /> {currentLevel.name.toUpperCase()}</div></div>
                {nextLevel && <span className="text-[10px] text-gray-500">Próximo: {nextLevel.name}</span>}
            </div>
            <div className="h-2 w-full bg-[#222] rounded-full overflow-hidden relative"><div className={`h-full ${currentLevel.bg} transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]`} style={{ width: `${progress}%` }}></div></div>
            {currentLevel.name === 'VIP' && <p className="text-[10px] text-center mt-2 text-[#FFD60A] font-bold animate-pulse">CUPOM VIP DESBLOQUEADO 🎉</p>}
        </div>
    );
};

// ==================================================================================
// 4. APLICAÇÃO
// ==================================================================================

export default function BookingApp() {
  const [data, setData] = useState(() => {
     try {
       const s = localStorage.getItem('thaly_ultimate_v1');
       if(s) { const p = JSON.parse(s); if(p.date) p.date = new Date(p.date); return p; }
     } catch(e){}
     // DATA STRUCTURE ROBUSTA PARA ENDEREÇOS
     return { 
         name: '', age: '', medical: false, 
         service: null, date: null, time: null, 
         extras: { upgrade: false, touch: false, aroma: false }, 
         payment: null,
         location: {
             type: 'home', // home, apto, hotel, motel
             city: CITIES[0], // Default Santa Fe
             // Campos unificados
             street: '', number: '', district: '', 
             building: '', block: '', aptNumber: '', 
             hotelName: '', roomNumber: '', 
             motelName: '', suiteType: '',
             reference: ''
         }
     };
  });

  const [stage, setStage] = useState(0); 
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_ultimate_v1', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 1000); }, []);

  // CÁLCULO FINANCEIRO
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service ? data.service.price : 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras.upgrade) xpPoints += 25;

    const touch = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras.touch) xpPoints += 30;

    const aroma = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras.aroma) xpPoints += 15;

    const travelFee = data.location.city ? data.location.city.fee : 0;
    
    const sub = base + upg + touch + aroma + travelFee;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, sub, desc, total: Math.max(0, sub - desc) },
        xp: xpPoints
    };
  }, [data.service, data.extras, hasCoupon, data.location.city]);

  const isVip = xp >= CONFIG.XP_THRESHOLDS.VIP;

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        setTimeout(() => {
            const yOffset = -90; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 200);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToSection(ref);
  };

  // GERADOR DE MENSAGEM WHATSAPP (COMPLETO)
  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let t = `🦁 *NOVO AGENDAMENTO VIP*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name}* (${data.age} anos)\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name.toUpperCase()}*\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `🔥 *EXTRAS:*\n`;
        if(data.extras.upgrade) t += `+ Upgrade Tempo\n`;
        if(data.extras.touch) t += `+ Interação\n`;
        if(data.extras.aroma) t += `+ Aromaterapia\n`;
    }
    
    t += `\n📍 *LOCALIZAÇÃO: ${loc.type.toUpperCase()}*\n`;
    t += `🏙️ Cidade: ${loc.city.name} (Taxa: ${Utils.formatBRL(loc.city.fee)})\n`;
    
    if(loc.type === 'home') {
        t += `🏠 Rua: ${loc.street}, ${loc.number}\n`;
        t += `🏘️ Bairro: ${loc.district}\n`;
        if(loc.reference) t += `👀 Ref: ${loc.reference}\n`;
    } else if (loc.type === 'apto') {
        t += `🏢 Edifício: ${loc.building}\n`;
        t += `🚪 Apto: ${loc.aptNumber} (Bloco ${loc.block})\n`;
        t += `🏘️ Bairro: ${loc.district}\n`;
    } else if (loc.type === 'hotel') {
        t += `🏨 Hotel: ${loc.hotelName}\n`;
        t += `🔑 Quarto: ${loc.roomNumber}\n`;
    } else if (loc.type === 'motel') {
        t += `🏩 Motel: ${loc.motelName}\n`;
        t += `🛏️ Suíte: ${loc.suiteType || 'A escolher'}\n`;
        t += `⚠️ *Ciente que pago o quarto à parte*\n`;
    }

    t += `\n💰 *TOTAL FINAL: ${Utils.formatBRL(financials.total)}*\n`;
    if(hasCoupon) t += `🎟️ *Cupom VIP Aplicado*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  // VALIDAÇÃO DE ENDEREÇO
  const isAddressValid = () => {
      const l = data.location;
      if (!l.city) return false;
      if (l.type === 'home') return l.street && l.number && l.district;
      if (l.type === 'apto') return l.building && l.aptNumber && l.district;
      if (l.type === 'hotel') return l.hotelName && l.roomNumber;
      if (l.type === 'motel') return l.motelName;
      return false;
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <style>{globalStyles}</style>
      <div className="w-16 h-16 border-4 border-[#111] border-t-[#0A84FF] rounded-full animate-spin mb-6"></div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.4em]">Carregando...</p>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-[#050505] pt-12 pb-12 px-6 flex flex-col items-center animate-enter text-center">
       <style>{globalStyles}</style>
       <div className="w-24 h-24 bg-[#32D74B]/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.4)] animate-scale">
         <Check className="w-10 h-10 text-[#32D74B]" strokeWidth={4} />
       </div>
       <h2 className="text-3xl font-bold text-white mb-2">Pedido Gerado!</h2>
       <p className="text-gray-400 mb-8 text-sm max-w-xs">Envie a confirmação abaixo para meu WhatsApp para garantir seu horário na agenda.</p>

       <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl overflow-hidden shadow-2xl relative mb-8">
           <div className="p-6">
              <div className="flex justify-between items-start mb-4 border-b border-[#333] pb-4">
                 <div className="text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Total</p>
                    <p className="text-[#32D74B] font-bold text-2xl">{Utils.formatBRL(financials.total)}</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Taxa Deslocamento</p>
                    <p className="text-white font-bold">{Utils.formatBRL(financials.travelFee)}</p>
                 </div>
              </div>
              <div className="text-left space-y-3">
                  <p className="text-gray-300 text-sm flex items-center gap-2"><MapPin size={16} className="text-[#0A84FF]"/> {data.location.city.name}</p>
                  <p className="text-gray-300 text-sm flex items-center gap-2"><CalendarIcon size={16} className="text-[#0A84FF]"/> {data.date?.toLocaleDateString()} às {data.time}</p>
              </div>
           </div>
       </div>

       <a href={generateMessage()} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform mb-4">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
       </a>
       <button onClick={() => { setSuccess(false); setStage(0); window.scrollTo(0,0); }} className="text-gray-600 font-bold text-xs uppercase py-4">Voltar</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-48 selection:bg-[#0A84FF] selection:text-white relative">
      <style>{globalStyles}</style>
      
      {/* HEADER */}
      <header className="fixed top-0 w-full z-40 glass-header py-3 px-5 flex justify-between items-center">
        <span className="font-bold text-lg tracking-tight text-white" onClick={() => window.location.reload()}>THALY.</span>
        <div className="flex items-center gap-3">
            <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#1C1C1E] rounded-full border border-[#333]"><Instagram size={18} className="text-white"/></a>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-24 px-5">
        
        {/* 1. INTRODUÇÃO */}
        <section ref={refs.intro} className={`transition-all duration-500 ${stage === 0 ? 'section-active' : 'section-blur'}`}>
            <div className="mb-6 mt-2">
                <h1 className="text-[34px] font-extrabold leading-tight mb-2">Massagem &<br/><span className="text-[#0A84FF]">Momentos Únicos.</span></h1>
                <p className="text-gray-400 text-sm leading-relaxed">Atendimento exclusivo para homens exigentes. Sigilo e satisfação garantidos.</p>
            </div>

            <LevelBar xp={xp} />

            <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
                <div><input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome" className="input-field"/></div>
                <div><input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Idade" className="input-field"/></div>
                <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#161616] border-[#333]'}`}>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>{data.medical && <Check size={12} className="text-white"/>}</div>
                    <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Maior de idade e saudável</p>
                </div>
                {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                    <button onClick={() => advanceStage(1, refs.services)} className="primary-btn w-full py-4 flex items-center justify-center gap-2">Iniciar <ArrowRight size={20}/></button>
                )}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`mt-10 transition-all duration-500 ${stage === 1 ? 'section-active' : stage > 1 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 1) { setStage(1); scrollToSection(refs.services); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { if(stage === 1) { setData({...data, service: s}); advanceStage(2, refs.datetime); }}} className={`card-base p-5 cursor-pointer relative ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">{s.badge}</div>}
                        <div className="flex justify-between items-start mb-2">
                            <div><h3 className={`text-lg font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3><p className="text-[9px] font-bold text-gray-500 uppercase">+ {s.xp} XP</p></div>
                            <span className="text-white font-bold bg-[#222] border border-[#333] px-2 py-1 rounded text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA/HORA */}
        <section ref={refs.datetime} className={`mt-10 transition-all duration-500 ${stage === 2 ? 'section-active' : stage > 2 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 2) { setStage(2); scrollToSection(refs.datetime); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">02.</span> Agenda</h3>
            <div className="card-base p-5">
                <div className="flex gap-2 overflow-x-auto pb-4 ios-scroll snap-x">
                    {[...Array(10)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} className={`snap-center min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center border ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                                <span className="text-[9px] font-bold uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-2 ${data.date ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => (
                        <button key={t} disabled={Utils.isTimeBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); advanceStage(3, refs.extras); }} className={`py-2 rounded-lg text-xs font-bold border ${data.time === t ? 'bg-white text-black' : Utils.isTimeBlocked(data.date, t) ? 'opacity-30 line-through' : 'bg-[#161616] border-[#333] text-gray-300'}`}>{t}</button>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`mt-10 transition-all duration-500 ${stage === 3 ? 'section-active' : stage > 3 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 3) { setStage(3); scrollToSection(refs.extras); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">03.</span> Extras</h3>
            <div className="card-base divide-y divide-[#222]">
                {[
                   { id: 'upgrade', label: '+30 Minutos', sub: 'Estenda o tempo', icon: Clock, price: data.service?.price * CONFIG.PRICES.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação', sub: 'Toques recíprocos', icon: Flame, price: CONFIG.PRICES.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', sub: 'Óleos especiais', icon: Wind, price: CONFIG.PRICES.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-5 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${data.extras[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#333]'}`}>{data.extras[item.id] && <Check size={14} className="text-white"/>}</div>
                            <div><p className="font-bold text-white text-sm">{item.label}</p><p className="text-[11px] text-gray-500">{item.sub}</p></div>
                        </div>
                        <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => advanceStage(4, refs.location)} className="w-full mt-4 py-3 rounded-xl text-sm font-bold bg-[#1C1C1E] text-gray-400 border border-[#333]">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO (ULTIMATE) */}
        <section ref={refs.location} className={`mt-10 transition-all duration-500 ${stage === 4 ? 'section-active' : stage > 4 ? 'section-blur cursor-pointer' : 'hidden opacity-0'}`} onClick={() => {if(stage > 4) { setStage(4); scrollToSection(refs.location); }}}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">04.</span> Localização</h3>
            
            {/* SELETOR DE CIDADE */}
            <div className="mb-4">
                <label className="text-[10px] uppercase font-bold text-gray-500 mb-2 block">Selecione a Cidade</label>
                <div className="flex gap-2 overflow-x-auto pb-2 ios-scroll">
                    {CITIES.map(c => (
                        <button key={c.id} onClick={() => setData({...data, location: {...data.location, city: c}})} 
                            className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-bold border ${data.location.city.id === c.id ? 'bg-[#0A84FF] border-[#0A84FF] text-white' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                            {c.name} {c.fee > 0 && `(+${c.fee})`}
                        </button>
                    ))}
                </div>
            </div>

            {/* ABAS DE TIPO */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#161616] border-[#333] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1"/>
                        <span className="text-[9px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* FORMULARIO DINAMICO */}
            <div className="card-base p-5 animate-enter border-[#333]">
                {data.location.type === 'home' && (
                    <div className="space-y-3">
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Ponto de Referência (Opcional)" value={data.location.reference} onChange={e => setData({...data, location: {...data.location, reference: e.target.value}})} className="input-field"/>
                    </div>
                )}

                {data.location.type === 'apto' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Edifício / Condomínio" value={data.location.building} onChange={e => setData({...data, location: {...data.location, building: e.target.value}})} className="input-field"/>
                        <div className="flex gap-3"><input placeholder="Bloco" value={data.location.block} onChange={e => setData({...data, location: {...data.location, block: e.target.value}})} className="input-field w-1/2"/><input placeholder="Apto" type="tel" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} className="input-field w-1/2"/></div>
                        <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                    </div>
                )}

                {data.location.type === 'hotel' && (
                    <div className="space-y-3">
                        <input placeholder="Nome do Hotel" value={data.location.hotelName} onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Número do Quarto" type="tel" value={data.location.roomNumber} onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} className="input-field"/>
                        <p className="text-[10px] text-gray-500 flex items-center gap-1"><AlertTriangle size={10} className="text-yellow-500"/> Preciso que deixe autorizado na recepção.</p>
                    </div>
                )}

                {data.location.type === 'motel' && (
                    <div className="space-y-3">
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl flex gap-3 items-start">
                             <AlertTriangle size={18} className="text-yellow-500 shrink-0 mt-0.5"/>
                             <p className="text-xs text-yellow-500/90 leading-relaxed">O valor da suíte/período é pago por você diretamente ao Motel na saída.</p>
                        </div>
                        <input placeholder="Nome do Motel" value={data.location.motelName} onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})} className="input-field"/>
                        <input placeholder="Tipo de Suíte (Opcional)" value={data.location.suiteType} onChange={e => setData({...data, location: {...data.location, suiteType: e.target.value}})} className="input-field"/>
                    </div>
                )}
                
                <button disabled={!isAddressValid()} onClick={() => advanceStage(5, refs.payment)} 
                    className="primary-btn w-full py-4 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">Confirmar Local</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`mt-10 transition-all duration-500 ${stage === 5 ? 'section-active' : 'hidden opacity-0'}`}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-white"><span className="text-[#0A84FF]">05.</span> Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, null); if(method==='pix') navigator.clipboard.writeText(CONFIG.PIX_KEY); }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${data.payment === method ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#222]'}`}>
                        <span className="text-[10px] font-bold uppercase">{method}</span>
                    </button>
                ))}
            </div>
        </section>

      </main>

      {/* CHECKOUT STICKY */}
      {stage >= 6 && !success && (
        <div className="fixed bottom-0 w-full z-50 animate-enter">
            <div className="h-12 bg-gradient-to-t from-black via-black/80 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            <div className="bg-[#111]/95 backdrop-blur-xl border-t border-white/10 p-5 rounded-t-[30px] shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Total (Serviço + Taxa)</p>
                        <div className="flex items-baseline gap-2">
                            {hasCoupon && <span className="text-xs text-gray-500 line-through">{Utils.formatBRL(financials.sub)}</span>}
                            <span className="text-3xl font-black text-white">{Utils.formatBRL(financials.total)}</span>
                        </div>
                        {financials.travelFee > 0 && <p className="text-[9px] text-[#0A84FF] mt-1 flex items-center gap-1"><Car size={10}/> Taxa {data.location.city.name} inclusa</p>}
                    </div>
                    {!hasCoupon ? (
                        isVip ? <button onClick={() => setHasCoupon(true)} className="h-9 px-3 rounded-full bg-[#FFD60A] text-black font-bold text-xs animate-bounce">Usar Cupom</button> : <div className="text-[9px] text-gray-500 text-right">Jogue mais XP<br/>p/ ganhar Cupom</div>
                    ) : <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-2 py-1 rounded">VIP ATIVO</div>}
                </div>
                <button onClick={() => { setSuccess(true); window.scrollTo(0,0); }} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-2">Finalizar Pedido <MessageCircle size={20}/></button>
            </div>
        </div>
      )}
    </div>
  );
}
