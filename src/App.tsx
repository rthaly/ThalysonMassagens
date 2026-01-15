import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, Building, Bed, Flame, 
  MapPin, Calendar as CalendarIcon, Clock, User, 
  Ticket, Shield, Zap, Info, ChevronRight, X, Copy, 
  CreditCard, Banknote, QrCode, Navigation
} from 'lucide-react';

// ==================================================================================
// 1. CORE BUSINESS & DATA (FIXOS)
// ==================================================================================

const SYSTEM_VERSION = 'THALY_REBOOT_V10_FINAL'; // Chave única para resetar cache

const CONFIG = {
  PHONE: "5517991360413",
  PIX: "62922530000144",
  COUPON_VALUE: 15.00,
  PRICES: {
    UPGRADE_PCT: 0.5, // 50%
    TOUCH: 73,
    AROMA: 5
  },
  XP_LEVELS: { VIP: 150, ALPHA: 300 }
};

// CÁLCULO REALISTA DE UBER (IDA E VOLTA)
// Base: Bela Vista. Mínimo R$10 trecho -> R$20 Total.
const ZONES = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0, time: '5 min' },
  { id: 'augusta', name: 'Augusta / Centro', fee: 18.00, time: '10 min' },
  { id: 'paulista', name: 'Paulista / Jardins', fee: 22.00, time: '15 min' },
  { id: 'higienopolis', name: 'Higienópolis', fee: 25.00, time: '20 min' },
  { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 32.00, time: '25 min' },
  { id: 'itaim', name: 'Itaim / V. Olímpia', fee: 38.00, time: '30 min' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 42.00, time: '35 min' },
  { id: 'vila_mariana', name: 'Vila Mariana', fee: 30.00, time: '25 min' },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 28.00, time: '25 min' },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 45.00, time: '40 min' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 55.00, time: '45 min' },
  { id: 'morumbi', name: 'Morumbi', fee: 65.00, time: '50 min' },
  { id: 'santana', name: 'Santana / ZN', fee: 50.00, time: '45 min' },
  { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, time: '?' },
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    tag: 'PREMIUM 🔥',
    desc: 'O protocolo exclusivo. Massagem profunda para soltar a musculatura, cremes e óleos de alta qualidade, toque corpo a corpo e finalização manual intensa.', 
    price: 155, 
    duration: 60,
    xp: 100 
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    tag: 'TERAPÊUTICA 🌿',
    desc: 'Foco 100% no alívio de dores e tensão muscular. Toques firmes e técnicos para zerar o stress. Sem toques íntimos.', 
    price: 125, 
    duration: 60,
    xp: 50 
  }
];

const EXTRAS = [
  { id: 'upgrade', name: 'Upgrade 30min', desc: 'Mais tempo de sessão', icon: Clock, price: (base) => base * 0.5, xp: 30 },
  { id: 'touch', name: 'Interação', desc: 'Toques recíprocos', icon: Flame, price: () => 73, xp: 40 },
  { id: 'aroma', name: 'Aromaterapia', desc: 'Essências relaxantes', icon: Wind, price: () => 5, xp: 15 },
];

const REVIEWS = [
  { text: "Melhor massagem da vida. O toque é surreal.", author: "Tiago", stars: 5 },
  { text: "Sigilo absoluto. Atendeu no meu escritório.", author: "Empresário", stars: 5 },
  { text: "A finalização foi absurda. Recomendo.", author: "Anônimo", stars: 5 },
  { text: "Mão firme e pegada de macho. Gostei.", author: "Curioso SP", stars: 5 },
];

const NOTIFICATIONS = [
  "🔥 João agendou agora", "👀 5 pessoas vendo a agenda", "📅 Sexta quase lotada",
  "✅ Matheus confirmou", "💎 Murilo virou VIP", "🏠 Atendimento Hotel iniciado",
  "🚗 Thalyson a caminho", "✨ Avaliação 5 estrelas recebida", "💳 Pix recebido"
];

// ==================================================================================
// 2. ESTILOS GLOBAIS (NOVO VISUAL "OBSIDIAN")
// ==================================================================================

const styles = `
:root { --primary: #2563EB; --accent: #34D399; --bg: #000000; --surface: #09090B; --border: #27272A; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
body { background: var(--bg); color: #fff; overflow-x: hidden; padding-bottom: 140px; }
input, button, select { outline: none; }

/* Scrollbars */
.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

/* Animações */
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(0,0,0,0); } 100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.anim-enter { animation: slideUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.btn-pulse { animation: pulse 2s infinite; }

/* Componentes */
.glass { background: rgba(9, 9, 11, 0.8); backdrop-filter: blur(16px); border-bottom: 1px solid rgba(255,255,255,0.08); }
.card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; transition: all 0.2s; position: relative; overflow: hidden; }
.card.active { border-color: var(--primary); background: rgba(37, 99, 235, 0.08); box-shadow: 0 0 20px rgba(37, 99, 235, 0.1); }

.input { width: 100%; background: #18181B; border: 1px solid #333; color: white; padding: 16px; border-radius: 14px; font-size: 16px; transition: 0.2s; }
.input:focus { border-color: var(--primary); background: #202025; }

.btn-main { background: linear-gradient(135deg, #2563EB, #1D4ED8); color: white; width: 100%; padding: 18px; border-radius: 18px; font-weight: 800; border: none; font-size: 16px; box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
.btn-main:active { transform: scale(0.98); }
.btn-main:disabled { opacity: 0.5; filter: grayscale(1); }

.badge-shimmer { background: linear-gradient(90deg, #fff 0%, #2563EB 50%, #fff 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s infinite linear; font-weight: 900; }
`;

// ==================================================================================
// 3. UTILITÁRIOS
// ==================================================================================

const Utils = {
  fmt: (v) => v ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
  isBlocked: (d, t) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d); sel.setHours(0,0,0,0);
    const today = new Date(); today.setHours(0,0,0,0);
    if (sel < today) return true;
    if (sel > today) return false;
    const [h] = t.split(':').map(Number);
    const slot = new Date(); slot.setHours(h, 0, 0, 0);
    return slot < new Date(now.getTime() + 60 * 60000); // Bloqueia 1h
  }
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  // --- INICIALIZAÇÃO SEGURA (ANTI-CRASH) ---
  const [data, setData] = useState(() => {
    // 1. Tenta recuperar dados
    try {
      const s = localStorage.getItem(SYSTEM_VERSION);
      if (s) {
        const p = JSON.parse(s);
        if (p.date) p.date = new Date(p.date);
        // Validação de integridade
        if (!p.location || !p.extras) throw new Error("Dados inválidos");
        return p;
      }
    } catch (e) {
      // 2. Se falhar, limpa o cache silenciosamente
      localStorage.removeItem(SYSTEM_VERSION);
    }
    // 3. Retorna estado inicial limpo
    return {
      name: '', age: '', medical: false,
      service: null, date: null, time: null,
      extras: { upgrade: false, touch: false, aroma: false },
      payment: null,
      location: { zone: null, type: 'home', street: '', num: '', comp: '', obs: '' },
      couponUsed: false
    };
  });

  // STATES DE UI
  const [loading, setLoading] = useState(true);
  const [showCoupon, setShowCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  
  // Histórico
  const isFirstTime = !localStorage.getItem('thaly_history_final');

  // Efeitos
  useEffect(() => { localStorage.setItem(SYSTEM_VERSION, JSON.stringify(data)); }, [data]);
  useEffect(() => { 
    setTimeout(() => setLoading(false), 600); // Fake load para evitar FOUC
    if (isFirstTime && !data.couponUsed) setTimeout(() => setShowCoupon(true), 2000);
  }, []);

  // CÁLCULOS (MEMOIZED & SAFE)
  const stats = useMemo(() => {
    let xp = 0;
    const base = data.service?.price || 0;
    if (data.service) xp += data.service.xp;

    let extrasTotal = 0;
    if (data.extras?.upgrade) { extrasTotal += (base * 0.5); xp += 30; }
    if (data.extras?.touch) { extrasTotal += 73; xp += 40; }
    if (data.extras?.aroma) { extrasTotal += 5; xp += 15; }

    const fee = data.location?.zone?.fee || 0;
    const sub = base + extrasTotal + fee;
    const discount = data.couponUsed ? CONFIG.COUPON_VALUE : 0;
    
    return {
      base, extrasTotal, fee, sub, discount,
      total: Math.max(0, sub - discount),
      xp
    };
  }, [data]);

  // NAVEGAÇÃO
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleFinish = () => {
    if (data.couponUsed || isFirstTime) localStorage.setItem('thaly_history_final', 'true');
    setSuccess(true);
    window.scrollTo(0,0);
  };

  // WHATSAPP GENERATOR (NOTA FISCAL)
  const getLink = () => {
    const d = data.date;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    let t = `🦁 *AGENDAMENTO NOVO*\n────────────────\n`;
    t += `👤 *${data.name}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*: ${Utils.fmt(stats.base)}\n`;
    
    if (stats.extrasTotal > 0) {
      t += `🔥 *EXTRAS:* `;
      const l = [];
      if (data.extras.upgrade) l.push('+30min');
      if (data.extras.touch) l.push('Interação');
      if (data.extras.aroma) l.push('Aroma');
      t += l.join(', ') + `\n`;
    }

    t += `\n📍 *LOCAL: ${data.location.zone?.name || '?'}*\n`;
    if (data.location.type === 'home') t += `🏠 Casa: ${data.location.street}, ${data.location.num}\n`;
    else if (data.location.type === 'apto') t += `🏢 Apto: ${data.location.street}, ${data.location.num} - ${data.location.comp}\n`;
    else if (data.location.type === 'hotel') t += `🏨 Hotel: ${data.location.street} (Qto ${data.location.num})\n`;
    else if (data.location.type === 'motel') t += `🏩 Motel: ${data.location.street} (Suíte ${data.location.num})\n⚠️ *Eu pago a suíte*\n`;

    t += `\n💰 *DETALHES:*\n`;
    if (stats.fee > 0) t += `🚗 Deslocamento: ${Utils.fmt(stats.fee)}\n`;
    if (data.couponUsed) t += `🎟️ Desconto 1ª Vez: -${Utils.fmt(stats.discount)}\n`;
    t += `✅ *TOTAL: ${Utils.fmt(stats.total)}*\n`;
    t += `💳 Pagamento: ${data.payment}\n`;

    return `${CONFIG.URLS.WHATSAPP}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  // VALIDAÇÃO DE PASSO
  const isReady = () => {
    if (!data.name || !data.age || !data.medical) return false;
    if (!data.service || !data.date || !data.time) return false;
    if (!data.location.zone) return false;
    if (data.location.type !== 'motel' && (!data.location.street || !data.location.num)) return false;
    if (data.location.type === 'motel' && !data.location.street) return false;
    if (!data.payment) return false;
    return true;
  };

  if (loading) return <div className="fixed inset-0 bg-[#000] flex items-center justify-center"><div className="w-10 h-10 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"/></div>;

  if (success) return (
    <div className="min-h-screen pt-20 px-6 text-center anim-enter">
      <style>{styles}</style>
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6"><Check size={40} className="text-green-500"/></div>
      <h1 className="text-3xl font-black mb-2">Pedido Pronto!</h1>
      <p className="text-gray-400 mb-8">Envie a confirmação no WhatsApp.</p>
      
      <div className="bg-[#111] border border-[#222] rounded-3xl p-6 text-left mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-green-500"/>
        <div className="flex justify-between items-end mb-6 pb-6 border-b border-[#222]">
          <div><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Final</p><p className="text-3xl font-black text-white">{Utils.fmt(stats.total)}</p></div>
          <div className="text-right"><p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Taxa</p><p className="text-white font-bold">{Utils.fmt(stats.fee)}</p></div>
        </div>
        <div className="space-y-3 text-sm text-gray-300">
          <p className="flex gap-3"><User size={16} className="text-blue-500"/> {data.name}</p>
          <p className="flex gap-3"><MapPin size={16} className="text-blue-500"/> {data.location.zone?.name}</p>
          <p className="flex gap-3"><CalendarIcon size={16} className="text-blue-500"/> {data.date?.toLocaleDateString()} às {data.time}</p>
        </div>
      </div>

      <a href={getLink()} className="btn-main mb-4">Enviar no WhatsApp <MessageCircle size={20}/></a>
      <button onClick={() => { setSuccess(false); window.location.reload(); }} className="text-sm font-bold text-gray-500 py-4">Voltar</button>
    </div>
  );

  return (
    <div className="pb-40">
      <style>{styles}</style>
      
      {/* HEADER */}
      <div className="fixed top-0 w-full glass py-4 px-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2" onClick={() => window.location.reload()}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">T</div>
          <span className="font-bold text-xl badge-shimmer">THALY.</span>
        </div>
        <div className="flex gap-3">
          <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} className="p-2 bg-[#222] rounded-full"><Instagram size={18}/></a>
          <button onClick={() => setHelpOpen(true)} className="p-2 bg-[#222] rounded-full"><Info size={18}/></button>
        </div>
      </div>

      {/* POPUP CUPOM */}
      {showCoupon && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 anim-enter">
          <div className="bg-[#111] w-full max-w-sm rounded-3xl border border-blue-500/50 p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"/>
            <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Ticket size={32} className="text-blue-500"/></div>
            <h2 className="text-2xl font-black mb-2">R$ {CONFIG.COUPON_VALUE} OFF!</h2>
            <p className="text-gray-400 text-sm mb-6">Presente exclusivo para sua primeira sessão.</p>
            <button onClick={() => { setData({...data, couponUsed: true}); setShowCoupon(false); Utils.vibrate(); }} className="btn-main mb-3 btn-pulse">USAR AGORA</button>
            <button onClick={() => setShowCoupon(false)} className="text-xs font-bold text-gray-500 uppercase">Dispensar</button>
          </div>
        </div>
      )}

      {/* HELP MODAL */}
      {helpOpen && (
        <div className="fixed inset-0 z-[90] bg-black/90 flex items-center justify-center p-6 anim-enter" onClick={() => setHelpOpen(false)}>
          <div className="bg-[#111] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between mb-6">
              <h3 className="font-bold text-xl flex gap-2"><Info className="text-blue-500"/> Ajuda</h3>
              <button onClick={() => setHelpOpen(false)}><X size={20}/></button>
            </div>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="p-4 bg-[#18181B] rounded-xl"><h4 className="font-bold text-white mb-1">Sigilo?</h4> Total. Atendo em residências e hotéis.</div>
              <div className="p-4 bg-[#18181B] rounded-xl"><h4 className="font-bold text-white mb-1">Pagamento?</h4> Pix, Dinheiro e Cartão.</div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto pt-24 px-5 space-y-12">
        
        {/* 1. INTRODUÇÃO */}
        <section id="intro" className="anim-enter">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-3 leading-[1.1]">Massagem &<br/><span className="badge-shimmer">Exclusividade.</span></h1>
            <p className="text-gray-400">Atendimento masculino premium. Técnica apurada e total discrição.</p>
          </div>

          <div className="bg-[#111] border border-[#222] rounded-3xl p-5 mb-8 relative overflow-hidden">
            <div className="flex justify-between items-end relative z-10">
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Nível</span>
                <div className="flex items-center gap-2 font-black text-xl text-white mt-1">
                  <Crown size={20} className={stats.xp > 150 ? "text-yellow-500" : "text-gray-600"}/> 
                  {stats.xp > 300 ? 'ALPHA' : stats.xp > 150 ? 'VIP' : 'MEMBRO'}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-gray-500 uppercase">XP</span>
                <span className="text-sm font-bold block">{stats.xp} / 300</span>
              </div>
            </div>
            <div className="h-2 w-full bg-[#222] rounded-full mt-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000" style={{ width: `${Math.min(100, (stats.xp/300)*100)}%` }}></div>
            </div>
          </div>

          <div className="card p-6 space-y-4 shadow-xl">
            <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Seu Nome" className="input"/>
            <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value})} placeholder="Idade" className="input"/>
            <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'border-blue-500 bg-blue-500/10' : 'border-[#333] bg-[#18181B]'}`}>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${data.medical ? 'bg-blue-500 border-blue-500' : 'border-[#555]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
              <span className="text-sm font-bold text-white">Maior de idade e saudável</span>
            </div>
            {data.name.length > 2 && data.age && data.medical && (
              <button onClick={() => { Utils.vibrate(); scrollTo('services'); }} className="btn-main mt-2">Começar <ArrowRight size={20}/></button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS */}
        {data.medical && (
          <section id="services" className="anim-enter">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-blue-500">01.</span> Escolha</h3>
            <div className="space-y-4">
              {SERVICES.map(s => (
                <div key={s.id} onClick={() => { setData({...data, service: s}); Utils.vibrate(); scrollTo('agenda'); }} 
                  className={`card p-6 cursor-pointer ${data.service?.id === s.id ? 'active' : ''}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-1 rounded mb-2 inline-block">{s.tag}</span>
                      <h3 className="text-xl font-bold text-white">{s.name}</h3>
                    </div>
                    <span className="text-white font-bold bg-[#222] px-3 py-1 rounded-lg text-sm">{Utils.fmt(s.price)}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. AGENDA */}
        {data.service && (
          <section id="agenda" className="anim-enter">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-blue-500">02.</span> Data e Hora</h3>
            <div className="card p-6">
              <div className="flex gap-3 overflow-x-auto pb-6 hide-scroll snap-x">
                {[...Array(14)].map((_, i) => {
                  const d = new Date(); d.setDate(d.getDate() + i);
                  const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                  return (
                    <button key={i} onClick={() => { setData({...data, date: d, time: null}); Utils.vibrate(); }} 
                      className={`snap-center min-w-[70px] h-[80px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-blue-600 border-blue-600 text-white' : 'bg-[#18181B] border-[#333] text-gray-400'}`}>
                      <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                      <span className="text-2xl font-bold">{d.getDate()}</span>
                    </button>
                  )
                })}
              </div>
              <div className={`grid grid-cols-4 gap-3 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
                {TIME_SLOTS.map(t => (
                  <button key={t} disabled={Utils.isBlocked(data.date, t)} onClick={() => { setData({...data, time: t}); Utils.vibrate(); scrollTo('extras'); }} 
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black border-white' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#18181B] border-[#333] text-gray-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. EXTRAS */}
        {data.time && (
          <section id="extras" className="anim-enter">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-blue-500">03.</span> Adicionais</h3>
            <div className="card divide-y divide-[#222]">
              {EXTRAS.map((item) => (
                <div key={item.id} onClick={() => { setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); Utils.vibrate(); }} 
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#18181B]">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-blue-500 border-blue-500 text-white' : 'border-[#333] text-gray-500'}`}>
                      {data.extras?.[item.id] ? <Check size={16}/> : <item.icon size={16}/>}
                    </div>
                    <div><p className="font-bold text-white">{item.name}</p><p className="text-[11px] text-gray-500">{item.desc}</p></div>
                  </div>
                  <span className="text-blue-500 font-bold text-sm">+ {Utils.fmt(item.price(data.service?.price || 0))}</span>
                </div>
              ))}
            </div>
            <button onClick={() => scrollTo('location')} className="w-full mt-4 py-4 rounded-xl text-sm font-bold bg-[#18181B] text-gray-300 border border-[#333]">Continuar</button>
          </section>
        )}

        {/* 5. LOCALIZAÇÃO */}
        {data.time && (
          <section id="location" className="anim-enter">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-blue-500">04.</span> Localização</h3>
            
            <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 ml-1">Selecione o Bairro (Taxa Uber Ida+Volta)</p>
            <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll snap-x -mx-5 px-5 mb-4">
              {ZONES.map(z => (
                <div key={z.id} onClick={() => setData({...data, location: {...data.location, zone: z}})}
                  className={`snap-center flex-shrink-0 w-36 p-4 rounded-2xl border cursor-pointer relative ${data.location.zone?.id === z.id ? 'border-blue-500 bg-blue-500/10' : 'border-[#222] bg-[#18181B]'}`}>
                  <p className="text-sm font-bold text-white mb-1 truncate">{z.name}</p>
                  <p className={`text-xs font-bold ${data.location.zone?.id === z.id ? 'text-blue-400' : 'text-gray-500'}`}>{z.fee === 0 ? 'Grátis' : Utils.fmt(z.fee)}</p>
                  {data.location.zone?.id === z.id && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#2563EB]"/>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-3 mb-5">
              {LOCATION_TYPES.map(t => (
                <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border ${data.location.type === t.id ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-[#18181B] border-[#333] text-gray-500'}`}>
                  <t.icon size={20} className="mb-1"/><span className="text-[10px] font-bold uppercase">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="card p-5 space-y-3 border-[#333]">
              {data.location.type === 'home' && <div className="flex gap-3"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input w-2/3"/><input placeholder="Nº" type="tel" value={data.location.num} onChange={e => setData({...data, location: {...data.location, num: e.target.value}})} className="input w-1/3"/></div>}
              
              {data.location.type === 'apto' && (
                <>
                  <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input"/>
                  <div className="flex gap-3"><input placeholder="Nº Prédio" type="tel" value={data.location.num} onChange={e => setData({...data, location: {...data.location, num: e.target.value}})} className="input w-1/2"/><input placeholder="Nº Apto" type="tel" value={data.location.comp} onChange={e => setData({...data, location: {...data.location, comp: e.target.value}})} className="input w-1/2"/></div>
                </>
              )}
              
              {data.location.type === 'hotel' && (
                <>
                  <input placeholder="Nome do Hotel" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input"/>
                  <input placeholder="Nº Quarto" type="tel" value={data.location.num} onChange={e => setData({...data, location: {...data.location, num: e.target.value}})} className="input"/>
                </>
              )}
              
              {data.location.type === 'motel' && (
                <>
                  <input placeholder="Nome do Motel" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input"/>
                  <input placeholder="Suíte (Ex: Hidro)" value={data.location.num} onChange={e => setData({...data, location: {...data.location, num: e.target.value}})} className="input"/>
                  <p className="text-[10px] text-yellow-500 flex items-center gap-1.5"><AlertTriangle size={12}/> O valor da suíte é pago por você.</p>
                </>
              )}
              <button onClick={() => scrollTo('payment')} className="btn-main mt-2">Confirmar Endereço</button>
            </div>
          </section>
        )}

        {/* 6. PAGAMENTO */}
        {data.location.zone && (
          <section id="payment" className="anim-enter">
            <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-blue-500">05.</span> Pagamento</h3>
            <div className="card p-4 grid grid-cols-3 gap-3">
                {['pix', 'dinheiro', 'cartao'].map(m => (
                    <button key={m} onClick={() => setData({...data, payment: m})} 
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border ${data.payment === m ? 'bg-blue-500/20 border-blue-500' : 'border-[#333] hover:bg-[#18181B]'}`}>
                        <span className="text-[10px] font-bold uppercase tracking-wider">{m}</span>
                    </button>
                ))}
            </div>
          </section>
        )}

      </main>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 w-full z-50 bg-[#09090B]/95 border-t border-[#222] p-5 pb-8 backdrop-blur-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)] anim-enter">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Total (+ Deslocamento)</p>
            <div className="flex items-baseline gap-2">
              {data.couponUsed && <span className="text-xs text-gray-500 line-through">{Utils.fmt(stats.sub)}</span>}
              <span className="text-3xl font-black text-white">{Utils.fmt(stats.total)}</span>
            </div>
          </div>
          {data.couponUsed && <div className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20 flex items-center gap-1"><Check size={12}/> CUPOM ATIVO</div>}
        </div>
        <button disabled={!isReady()} onClick={handleFinish} className="btn-main">Finalizar Pedido <MessageCircle size={20}/></button>
      </div>

    </div>
  );
}
