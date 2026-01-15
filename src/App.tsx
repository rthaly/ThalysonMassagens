import React, { useState, useEffect, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind, Crown, MapPin, Building,
  CreditCard, Banknote, QrCode, ChevronLeft, X, 
  Calendar as CalendarIcon, Clock, User, AlertTriangle, Info, Sparkles, Shield
} from 'lucide-react';

// ==================================================================================
// 1. DADOS & CONFIGURAÇÃO (PRESERVANDO SEU CONTEÚDO)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  PIX_KEY: "62922530000144",
  COUPON_DISCOUNT: 15.00,
  PRICES: { UPGRADE: 0.5, TOUCH: 73, AROMA: 5 },
  XP_LEVELS: { VIP: 150, ALPHA: 300 }
};

const LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0, zone: 'Base' },
  { id: 'augusta', name: 'Augusta / Centro', fee: 15.00, zone: 'Centro' },
  { id: 'paulista', name: 'Paulista / Jardins', fee: 20.00, zone: 'Nobre' },
  { id: 'higienopolis', name: 'Higienópolis', fee: 25.00, zone: 'Centro' },
  { id: 'pinheiros', name: 'Pinheiros / Madalena', fee: 30.00, zone: 'Oeste' },
  { id: 'itaim', name: 'Itaim / V. Olímpia', fee: 35.00, zone: 'Sul' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 35.00, zone: 'Sul' },
  { id: 'mariana', name: 'Vila Mariana', fee: 30.00, zone: 'Sul' },
  { id: 'perdizes', name: 'Perdizes / B. Funda', fee: 30.00, zone: 'Oeste' },
  { id: 'brooklin', name: 'Brooklin / C. Belo', fee: 40.00, zone: 'Sul' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 50.00, zone: 'Leste' },
  { id: 'morumbi', name: 'Morumbi', fee: 60.00, zone: 'Sul' },
  { id: 'outra', name: 'Outro (Consultar)', fee: 0, zone: '?' },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    desc: 'Massagista de Cueca. Protocolo premium com óleos, toque pele na pele e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    desc: 'Foco 100% terapêutico. Ideal para dores e tensão. Toques firmes para zerar o stress.', 
    duration: 60, 
    price: 125, 
    badge: null,
    xp: 50
  },
];

const EXTRAS = [
  { id: 'upgrade', title: '+30 Minutos', desc: 'Sessão estendida.', icon: Clock, getPrice: (b) => b * 0.5, xp: 30 },
  { id: 'touch', title: 'Interação', desc: 'Toques recíprocos.', icon: Flame, getPrice: () => 73, xp: 40 },
  { id: 'aroma', title: 'Aromaterapia', desc: 'Óleos essenciais.', icon: Wind, getPrice: () => 5, xp: 15 }
];

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const REVIEWS = [
  { t: "Melhor da vida. O toque vicia.", a: "Anônimo", s: 5 },
  { t: "Sigilo absoluto. Atendeu no escritório.", a: "Empresário", s: 5 },
  { t: "Paguei o extra e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
  { t: "Mão firme, pegada de macho.", a: "Curioso SP", s: 5 },
];

// ==================================================================================
// 2. ESTILOS (MODERN UI)
// ==================================================================================

const styles = `
:root { --primary: #3B82F6; --bg: #000000; --card: #121212; --border: #27272A; --text-muted: #A1A1AA; }
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, sans-serif; }
body { background: var(--bg); color: #fff; margin: 0; height: 100vh; overflow: hidden; }

/* Layout Wizard */
.app-container { display: flex; flex-direction: column; height: 100%; max-width: 450px; margin: 0 auto; background: #050505; position: relative; }
.step-content { flex: 1; overflow-y: auto; padding: 20px; padding-bottom: 100px; }
.bottom-bar { position: absolute; bottom: 0; left: 0; right: 0; background: rgba(18,18,18,0.9); backdrop-filter: blur(10px); border-top: 1px solid var(--border); padding: 20px; z-index: 50; }

/* Components */
.card-select { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 16px; transition: all 0.2s; cursor: pointer; position: relative; overflow: hidden; }
.card-select.active { border-color: var(--primary); background: rgba(59, 130, 246, 0.1); box-shadow: 0 0 20px rgba(59, 130, 246, 0.15); }

.btn-main { width: 100%; background: #fff; color: #000; font-weight: 800; font-size: 16px; padding: 16px; border-radius: 14px; border: none; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.1s; }
.btn-main:active { transform: scale(0.98); }
.btn-main:disabled { opacity: 0.5; }

.input-modern { width: 100%; background: #1E1E20; border: 1px solid #333; color: #fff; padding: 14px; border-radius: 12px; font-size: 15px; outline: none; transition: 0.2s; }
.input-modern:focus { border-color: var(--primary); }

/* Animations */
@keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
.anim-enter { animation: slideIn 0.4s ease-out forwards; }

.xp-bar-bg { height: 4px; background: #333; border-radius: 2px; overflow: hidden; margin-top: 8px; }
.xp-bar-fill { height: 100%; background: linear-gradient(90deg, #3B82F6, #8B5CF6); transition: width 1s ease; }
`;

// ==================================================================================
// 3. UTILITÁRIOS
// ==================================================================================

const Utils = {
  fmt: (v) => v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  isBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) return true;
    if (sel > today) return false;
    const [h] = t.split(':').map(Number);
    const slot = new Date(); slot.setHours(h, 0, 0, 0);
    return slot < new Date(now.getTime() + 30 * 60000); 
  }
};

// ==================================================================================
// 4. APP COMPLETO
// ==================================================================================

export default function App() {
  // STATE INICIALIZAÇÃO SEGURA
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem('THALY_NEXTGEN_V1');
      if (s) {
        const p = JSON.parse(s);
        if (p.date) p.date = new Date(p.date);
        return p;
      }
    } catch (e) { localStorage.removeItem('THALY_NEXTGEN_V1'); }
    return {
      step: 0, // 0:Intro, 1:Service, 2:Time, 3:Extras, 4:Location, 5:Checkout
      name: '', age: '', medical: false,
      service: null, date: null, time: null,
      extras: { upgrade: false, touch: false, aroma: false },
      location: { neighborhood: null, type: 'home', street: '', number: '', apt: '', hotel: '', room: '', motel: '', suite: '' },
      payment: null,
      couponActive: false
    };
  });

  const [showCouponModal, setShowCouponModal] = useState(false);
  const isFirstTime = !localStorage.getItem('thaly_history_ng');

  useEffect(() => { localStorage.setItem('THALY_NEXTGEN_V1', JSON.stringify(data)); }, [data]);

  // Trigger Cupom
  useEffect(() => {
    if (data.step === 0 && isFirstTime && !data.couponActive) {
      setTimeout(() => setShowCouponModal(true), 1500);
    }
  }, [data.step, isFirstTime]);

  // CÁLCULOS
  const { financials, xp } = useMemo(() => {
    let xp = 0;
    const base = data.service?.price || 0;
    if (data.service) xp += data.service.xp;

    let extrasTotal = 0;
    if (data.extras?.upgrade) { extrasTotal += (base * CONFIG.PRICES.UPGRADE); xp += 30; }
    if (data.extras?.touch) { extrasTotal += CONFIG.PRICES.TOUCH; xp += 40; }
    if (data.extras?.aroma) { extrasTotal += CONFIG.PRICES.AROMA; xp += 15; }

    const fee = data.location?.neighborhood?.fee || 0;
    const sub = base + extrasTotal + fee;
    const desc = data.couponActive ? CONFIG.COUPON_DISCOUNT : 0;

    return {
      base, extrasTotal, fee, sub, desc,
      total: Math.max(0, sub - desc),
      xp
    };
  }, [data]);

  // NAVEGAÇÃO
  const next = () => setData(prev => ({ ...prev, step: prev.step + 1 }));
  const back = () => setData(prev => ({ ...prev, step: prev.step - 1 }));
  
  const finish = () => {
    localStorage.setItem('thaly_history_ng', 'true');
    const msg = generateWhatsapp();
    window.open(msg, '_blank');
    setData(prev => ({...prev, step: 6})); // Tela final
  };

  const generateWhatsapp = () => {
    let t = `🦁 *AGENDAMENTO NOVO*\n────────────────\n`;
    t += `👤 *${data.name}* (${data.age})\n`;
    t += `📅 *${data.date?.toLocaleDateString()} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*: ${Utils.fmt(financials.base)}\n`;
    
    if (financials.extrasTotal > 0) {
      t += `🔥 *EXTRAS:* `;
      const l = [];
      if(data.extras.upgrade) l.push(`+30min`);
      if(data.extras.touch) l.push(`Interação`);
      if(data.extras.aroma) l.push(`Aroma`);
      t += l.join(', ') + ` (${Utils.fmt(financials.extrasTotal)})\n`;
    }

    const loc = data.location;
    t += `\n📍 *${loc.neighborhood?.name}*\n`;
    if(loc.type === 'home') t += `🏠 ${loc.street}, ${loc.number}\n`;
    else if(loc.type === 'apto') t += `🏢 ${loc.street}, ${loc.number} - Ap ${loc.apt}\n`;
    else if(loc.type === 'hotel') t += `🏨 ${loc.hotel} (Qto ${loc.room})\n`;
    else if(loc.type === 'motel') t += `🏩 ${loc.motel} (Suíte ${loc.suite})\n⚠️ *Eu pago a suíte*\n`;

    t += `\n🚗 Taxa: ${Utils.fmt(financials.fee)}\n`;
    if(data.couponActive) t += `🎟️ Desconto: -${Utils.fmt(financials.desc)}\n`;
    t += `✅ *TOTAL: ${Utils.fmt(financials.total)}*\n`;
    t += `💳 ${data.payment}\n`;

    return `${CONFIG.URLS.WHATSAPP}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  // --- COMPONENTES DE TELA ---

  const Header = () => (
    <div className="flex justify-between items-center p-5 pt-6 bg-[#050505] sticky top-0 z-20 border-b border-[#222]">
      {data.step > 0 && data.step < 6 ? (
        <button onClick={back} className="p-2 -ml-2"><ChevronLeft className="text-white"/></button>
      ) : <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">T</div>}
      
      <div className="flex-1 px-4">
        <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500 mb-1">
          <span>{xp < CONFIG.XP_LEVELS.VIP ? 'Membro' : 'VIP'}</span>
          <span>{xp} XP</span>
        </div>
        <div className="xp-bar-bg"><div className="xp-bar-fill" style={{width: `${Math.min(100, (xp/300)*100)}%`}}></div></div>
      </div>
      
      {data.couponActive && <Ticket size={20} className="text-green-500 animate-pulse"/>}
    </div>
  );

  // TELAS DO WIZARD
  const renderStep = () => {
    switch (data.step) {
      case 0: // INTRO
        return (
          <div className="anim-enter space-y-6">
            <h1 className="text-3xl font-black leading-tight">Relaxamento <span className="text-blue-500">Exclusivo</span> & Massoterapia.</h1>
            
            {/* Reviews Slider */}
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll">
              {REVIEWS.map((r, i) => (
                <div key={i} className="min-w-[260px] bg-[#151515] p-4 rounded-xl border border-[#222]">
                  <div className="flex text-yellow-500 mb-2 gap-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div>
                  <p className="text-sm text-gray-300 italic">"{r.t}"</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <input value={data.name} onChange={e=>setData({...data, name: e.target.value})} placeholder="Seu Nome" className="input-modern"/>
              <input type="tel" maxLength={2} value={data.age} onChange={e=>setData({...data, age: e.target.value})} placeholder="Sua Idade" className="input-modern"/>
              <div onClick={()=>setData({...data, medical: !data.medical})} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${data.medical ? 'border-blue-500 bg-blue-500/10' : 'border-[#333]'}`}>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${data.medical ? 'bg-blue-500 border-blue-500' : 'border-[#555]'}`}>{data.medical && <Check size={12}/>}</div>
                <span className="text-sm font-bold text-gray-300">Maior de idade e saudável</span>
              </div>
            </div>
          </div>
        );

      case 1: // SERVIÇOS
        return (
          <div className="anim-enter space-y-4">
            <h2 className="text-xl font-bold">Escolha a Experiência</h2>
            {SERVICES.map(s => (
              <div key={s.id} onClick={()=>setData({...data, service: s})} 
                className={`card-select ${data.service?.id === s.id ? 'active' : ''}`}>
                {s.badge && <span className="absolute top-0 right-0 bg-yellow-500 text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">{s.badge}</span>}
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-lg">{s.name}</h3>
                  <span className="bg-[#222] px-2 py-1 rounded text-sm font-bold">{Utils.fmt(s.price)}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        );

      case 2: // DATA E HORA
        return (
          <div className="anim-enter space-y-6">
            <h2 className="text-xl font-bold">Data e Horário</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 hide-scroll">
              {[...Array(10)].map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                const sel = data.date && new Date(data.date).getDate() === d.getDate();
                return (
                  <button key={i} onClick={()=>setData({...data, date: d, time: null})} 
                    className={`min-w-[60px] h-[70px] rounded-xl flex flex-col items-center justify-center border transition-all ${sel ? 'bg-blue-600 border-blue-600' : 'bg-[#151515] border-[#333]'}`}>
                    <span className="text-[10px] font-bold uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                    <span className="text-xl font-bold">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>
            <div className={`grid grid-cols-4 gap-2 ${!data.date ? 'opacity-30 pointer-events-none' : ''}`}>
              {TIME_SLOTS.map(t => (
                <button key={t} disabled={Utils.isBlocked(data.date, t)} onClick={()=>setData({...data, time: t})}
                  className={`py-3 rounded-lg text-xs font-bold border ${data.time === t ? 'bg-white text-black' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through' : 'bg-[#151515] border-[#333]'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        );

      case 3: // EXTRAS
        return (
          <div className="anim-enter space-y-4">
            <h2 className="text-xl font-bold">Turbine o Relaxamento</h2>
            {EXTRAS.map(e => (
              <div key={e.id} onClick={()=>setData({...data, extras: {...data.extras, [e.id]: !data.extras[e.id]}})}
                className={`card-select flex justify-between items-center ${data.extras[e.id] ? 'active' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${data.extras[e.id] ? 'bg-blue-500 text-white' : 'bg-[#222] text-gray-500'}`}><e.icon size={16}/></div>
                  <div><p className="font-bold text-sm">{e.title}</p><p className="text-[10px] text-gray-500">{e.desc}</p></div>
                </div>
                <span className="text-xs font-bold text-blue-400">+ {Utils.fmt(e.getPrice(data.service?.price || 0))}</span>
              </div>
            ))}
          </div>
        );

      case 4: // LOCALIZAÇÃO
        return (
          <div className="anim-enter space-y-5">
            <h2 className="text-xl font-bold">Onde será?</h2>
            
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block">Selecione o Bairro (Taxa Uber Ida+Volta)</label>
              <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll">
                {LOCATIONS.map(l => (
                  <div key={l.id} onClick={()=>setData({...data, location: {...data.location, neighborhood: l}})}
                    className={`min-w-[120px] p-3 rounded-xl border cursor-pointer ${data.location.neighborhood?.id === l.id ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#151515]'}`}>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{l.zone}</p>
                    <p className="font-bold text-sm truncate">{l.name}</p>
                    <p className="text-xs text-blue-400 font-bold mt-1">{l.fee === 0 ? 'Grátis' : Utils.fmt(l.fee)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {LOCATION_TYPES.map(t => (
                <button key={t.id} onClick={()=>setData({...data, location: {...data.location, type: t.id}})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border ${data.location.type === t.id ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-[#151515] border-[#333] text-gray-500'}`}>
                  <t.icon size={20} className="mb-1"/><span className="text-[10px] font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {data.location.type === 'home' && <><input placeholder="Rua" value={data.location.street} onChange={e=>setData({...data, location: {...data.location, street: e.target.value}})} className="input-modern"/><input placeholder="Número" type="tel" value={data.location.number} onChange={e=>setData({...data, location: {...data.location, number: e.target.value}})} className="input-modern"/></>}
              {data.location.type === 'apto' && <><input placeholder="Rua" value={data.location.street} onChange={e=>setData({...data, location: {...data.location, street: e.target.value}})} className="input-modern"/><div className="flex gap-2"><input placeholder="Número Prédio" value={data.location.number} onChange={e=>setData({...data, location: {...data.location, number: e.target.value}})} className="input-modern"/><input placeholder="Apto" value={data.location.apt} onChange={e=>setData({...data, location: {...data.location, apt: e.target.value}})} className="input-modern"/></div></>}
              {data.location.type === 'hotel' && <><input placeholder="Nome Hotel" value={data.location.hotel} onChange={e=>setData({...data, location: {...data.location, hotel: e.target.value}})} className="input-modern"/><input placeholder="Quarto" value={data.location.room} onChange={e=>setData({...data, location: {...data.location, room: e.target.value}})} className="input-modern"/></>}
              {data.location.type === 'motel' && <><input placeholder="Nome Motel" value={data.location.motel} onChange={e=>setData({...data, location: {...data.location, motel: e.target.value}})} className="input-modern"/><input placeholder="Suíte" value={data.location.suite} onChange={e=>setData({...data, location: {...data.location, suite: e.target.value}})} className="input-modern"/></>}
            </div>
          </div>
        );

      case 5: // PAGAMENTO E RESUMO
        return (
          <div className="anim-enter space-y-6">
            <h2 className="text-xl font-bold">Resumo do Pedido</h2>
            
            <div className="bg-[#151515] border border-[#333] rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"/>
              
              <div className="flex justify-between items-end mb-4 border-b border-[#333] pb-4">
                <div><p className="text-[10px] text-gray-500 uppercase font-bold">Total</p><p className="text-3xl font-black text-white">{Utils.fmt(financials.total)}</p></div>
                {data.couponActive && <div className="text-xs text-green-500 font-bold bg-green-900/20 px-2 py-1 rounded">Desconto Aplicado</div>}
              </div>

              <div className="space-y-2 text-sm text-gray-300">
                <p>💆 {data.service?.name}</p>
                <p>📍 {data.location?.neighborhood?.name}</p>
                <p>🚗 Taxa: {Utils.fmt(financials.fee)}</p>
                <p>📅 {data.date?.toLocaleDateString()} às {data.time}</p>
              </div>
            </div>

            <h3 className="font-bold text-sm text-gray-400 uppercase">Como quer pagar?</h3>
            <div className="grid grid-cols-3 gap-2">
              {['Pix', 'Dinheiro', 'Cartão'].map(m => (
                <button key={m} onClick={()=>setData({...data, payment: m})} 
                  className={`p-3 rounded-xl border text-sm font-bold ${data.payment === m ? 'bg-blue-500 border-blue-500 text-white' : 'bg-[#151515] border-[#333] text-gray-400'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>
        );
        
      case 6: // SUCESSO
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 anim-enter">
             <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"><Check size={40} className="text-green-500"/></div>
             <h2 className="text-3xl font-black mb-2">Tudo Certo!</h2>
             <p className="text-gray-400 mb-8">Envie o pedido no WhatsApp para eu confirmar.</p>
             <button onClick={()=>window.location.reload()} className="text-gray-500 font-bold text-sm">Fazer Novo Pedido</button>
          </div>
        )
      default: return null;
    }
  };

  // BOTÃO PRINCIPAL DINÂMICO
  const getButtonLabel = () => {
    switch(data.step) {
      case 0: return 'Começar Agora';
      case 1: return 'Confirmar Serviço';
      case 2: return 'Confirmar Horário';
      case 3: return 'Continuar';
      case 4: return 'Confirmar Local';
      case 5: return 'Finalizar Pedido';
      default: return '';
    }
  };

  const isStepValid = () => {
    if (data.step === 0) return data.name.length > 2 && data.age && data.medical;
    if (data.step === 1) return !!data.service;
    if (data.step === 2) return !!data.date && !!data.time;
    if (data.step === 3) return true; // Extras opcionais
    if (data.step === 4) return !!data.location.neighborhood && ((data.location.type === 'home' && data.location.street && data.location.number) || (data.location.type === 'motel' && data.location.motel));
    if (data.step === 5) return !!data.payment;
    return false;
  };

  return (
    <div className="app-container">
      <style>{styles}</style>
      <Header />
      
      {/* CUPOM MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-sm anim-enter">
          <div className="bg-[#18181b] w-full max-w-sm rounded-3xl border border-blue-500/50 p-6 text-center shadow-2xl">
            <Ticket size={40} className="text-blue-500 mx-auto mb-4"/>
            <h2 className="text-2xl font-black text-white mb-2">Ganhou R$ {CONFIG.COUPON_DISCOUNT}!</h2>
            <p className="text-gray-400 text-sm mb-6">Desconto de boas-vindas disponível.</p>
            <button onClick={()=>{setData({...data, couponActive: true}); setShowCouponModal(false)}} className="btn-main bg-blue-600 text-white mb-3">RESGATAR</button>
            <button onClick={()=>setShowCouponModal(false)} className="text-gray-500 text-xs font-bold uppercase">Dispensar</button>
          </div>
        </div>
      )}

      <div className="step-content">
        {renderStep()}
      </div>

      {data.step < 6 && (
        <div className="bottom-bar">
          <div className="flex justify-between items-center mb-3 px-1">
            <span className="text-xs font-bold text-gray-500 uppercase">Total Estimado</span>
            <span className="text-xl font-black text-white">{Utils.fmt(financials.total)}</span>
          </div>
          <button 
            disabled={!isStepValid()} 
            onClick={data.step === 5 ? finish : next} 
            className="btn-main disabled:opacity-50 disabled:scale-100 bg-white text-black">
            {getButtonLabel()} {data.step < 5 && <ArrowRight size={18}/>}
          </button>
        </div>
      )}
    </div>
  );
}
