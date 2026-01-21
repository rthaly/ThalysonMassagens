import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar as CalIcon, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Music, DollarSign, Zap, Menu, X, Share2, HelpCircle
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES (FIXO LONDRINA)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu número
  COUPON_VAL: 15.00,
  THEME: '#22C55E' // Verde Londrina
};

const SERVICES = [
  { 
    id: 'completa', name: 'Experiência Completa', 
    desc: 'O carro-chefe. Relaxamento muscular profundo seguido de finalização manual intensa e explosiva.', 
    time: 60, price: 180, level: 50, badge: 'MAIS PEDIDA 🏆' 
  },
  { 
    id: 'relax', name: 'Massagem Relaxante', 
    desc: 'Foco terapêutico para alívio de dores e tensão. Sem toques íntimos.', 
    time: 60, price: 150, level: 30, badge: null 
  },
  { 
    id: 'tantra', name: 'Tântrica Sensitive', 
    desc: 'Toques sutis, respiração e conexão energética. Uma jornada sensorial.', 
    time: 90, price: 250, level: 80, badge: 'VIP ✨' 
  }
];

const EXTRAS = [
  { id: 'upgrade', label: '+30 Minutos', desc: 'Estenda seu tempo', icon: Clock, price: 50, level: 20 },
  { id: 'touch', label: 'Interação Recíproca', desc: 'Toque e troca de energia', icon: Flame, price: 60, level: 30 },
  { id: 'aroma', label: 'Aromaterapia', desc: 'Óleos essenciais', icon: Wind, price: 20, level: 10 }
];

const REVIEWS = [
  { t: "A melhor de Londrina. O Thalyson é super educado e a massagem é surreal.", a: "Carlos (Gleba)", s: 5 },
  { t: "Fui travado e saí leve. A finalização vale cada centavo.", a: "André", s: 5 },
  { t: "Ambiente do hotel foi respeitado, muito discreto.", a: "M. Viajante", s: 5 },
  { t: "O toque dele é diferente. Recomendo a completa com extra de tempo.", a: "Felipe", s: 5 },
  { t: "Profissionalismo nota 10. Virei cliente fiel.", a: "Dr. Roberto", s: 5 },
  { t: "Mão firme na medida certa. O cara é bom.", a: "Gustavo", s: 5 },
];

// ==================================================================================
// 2. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: () => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(10); },
  
  // Lógica de horários esgotados/passados
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    
    const now = new Date();
    const sel = new Date(selectedDate);
    const [h] = timeString.split(':').map(Number);

    // 1. Bloqueia passado (se for hoje)
    if (sel.toDateString() === now.toDateString()) {
      if (h <= now.getHours()) return true; 
    }

    // 2. Simula "Esgotado" aleatoriamente (mas determinístico)
    // Soma dia + hora. Se divisível por 7, está esgotado (cria buracos na agenda)
    const seed = sel.getDate() + h; 
    if (seed % 7 === 0) return 'sold_out'; // Flag especial

    return false;
  }
};

// ==================================================================================
// 3. COMPONENTES VISUAIS
// ==================================================================================

const ProgressBar = ({ currentLevel }) => {
  // Lógica visual: Nível de Experiência
  let label = "Básica";
  let color = "bg-gray-500";
  
  if (currentLevel > 40) { label = "Premium"; color = "bg-green-500"; }
  if (currentLevel > 90) { label = "VIP Gold"; color = "bg-yellow-400"; }

  return (
    <div className="mb-6 px-4">
      <div className="flex justify-between items-end mb-1">
        <span className="text-[10px] uppercase font-bold text-gray-400">Nível da Experiência</span>
        <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded text-black ${color.replace('bg-', 'bg-')}`}>
            {label}
        </span>
      </div>
      <div className="h-1.5 w-full bg-[#222] rounded-full overflow-hidden">
        <div 
            className={`h-full ${color} transition-all duration-500 ease-out`} 
            style={{ width: `${Math.min(currentLevel, 100)}%` }}
        />
      </div>
    </div>
  );
};

const ReviewCarousel = () => (
  <div className="relative w-full overflow-hidden py-4 bg-[#111] border-y border-[#222]">
    <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black to-transparent z-10"/>
    <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black to-transparent z-10"/>
    
    <div className="flex animate-scroll gap-4 w-max">
       {/* Duplicado para loop infinito */}
       {[...REVIEWS, ...REVIEWS].map((r, i) => (
         <div key={i} className="w-[260px] p-4 rounded-xl bg-[#1A1A1A] border border-[#333] flex-shrink-0">
            <div className="flex text-yellow-500 mb-2 gap-1">
                {[...Array(5)].map((_,k)=><Star key={k} size={10} fill="currentColor"/>)}
            </div>
            <p className="text-gray-300 text-xs italic leading-relaxed mb-2">"{r.t}"</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Shield size={10} className="text-green-500"/> {r.a}
            </p>
         </div>
       ))}
    </div>
    <style>{`
      @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      .animate-scroll { animation: scroll 40s linear infinite; }
    `}</style>
  </div>
);

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  
  // DADOS DO AGENDAMENTO
  const [booking, setBooking] = useState({
    name: '',
    service: null,
    extras: { upgrade: false, touch: false, aroma: false },
    date: null,
    time: null,
    locationType: 'home', // home, hotel, motel
    address: '',
    payment: 'pix'
  });

  // Cálculos em tempo real
  const { total, level, timeStr } = useMemo(() => {
    let t = 0;
    let l = 0; // Level (Gamificação Visual)

    if (booking.service) {
      t += booking.service.price;
      l += booking.service.level;
    }

    if (booking.extras.upgrade) { t += 50; l += 20; }
    if (booking.extras.touch) { t += 60; l += 30; }
    if (booking.extras.aroma) { t += 20; l += 10; }

    const d = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR', {day:'2-digit', month:'2-digit'}) : '';
    
    return { total: t, level: l, timeStr: d };
  }, [booking]);

  const handleNext = () => {
    Utils.vibrate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(s => s + 1);
  };

  const handleBack = () => {
    Utils.vibrate();
    setStep(s => s - 1);
  };

  const toggleExtra = (id) => {
    Utils.vibrate();
    setBooking(prev => ({
        ...prev, 
        extras: { ...prev.extras, [id]: !prev.extras[id] }
    }));
  };

  const generateWhatsApp = () => {
    const isMotel = booking.locationType === 'motel';
    const locLabel = isMotel ? '🏩 Motel' : booking.locationType === 'hotel' ? '🏨 Hotel' : '🏠 Residência';
    
    // Link do Maps se tiver endereço
    const mapsLink = booking.address.length > 5 
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address + ' Londrina PR')}`
        : '';

    let text = `*NOVO AGENDAMENTO - LONDRINA* 🌿\n`;
    text += `------------------------------\n`;
    text += `👤 *Cliente:* ${booking.name}\n`;
    text += `📅 *Data:* ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}\n`;
    text += `💆 *Serviço:* ${booking.service?.name}\n`;
    
    // Extras
    const extrasAtivos = Object.entries(booking.extras).filter(([_,v])=>v).map(([k])=>EXTRAS.find(e=>e.id===k).label);
    if(extrasAtivos.length > 0) {
        text += `✨ *Adicionais:* \n${extrasAtivos.map(e => `   • ${e}`).join('\n')}\n`;
    } else {
        text += `✨ *Adicionais:* Nenhum\n`;
    }

    text += `\n📍 *LOCALIZAÇÃO*\n`;
    text += `Tipo: ${locLabel}\n`;
    text += `Endereço: ${booking.address}\n`;
    if(mapsLink) text += `Maps: ${mapsLink}\n`;
    
    text += `\n💰 *FINANCEIRO*\n`;
    text += `Serviço Total: ${Utils.formatBRL(total)}\n`;
    text += `🚗 *Deslocamento:* A COMBINAR (Não incluso)\n`;
    text += `💳 *Pagamento:* ${booking.payment.toUpperCase()}\n`;
    text += `------------------------------\n`;
    text += `Olá Thalyson, aguardo sua confirmação!`;

    const url = `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-green-500 selection:text-black pb-32">
      
      {/* HEADER FIXO */}
      <header className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
                {step > 0 && (
                    <button onClick={handleBack} className="p-1 -ml-2 text-gray-400 active:scale-95 transition-transform">
                        <ChevronLeft size={24} />
                    </button>
                )}
                <div>
                    <h1 className="text-sm font-black tracking-tighter text-white">THALY<span className="text-green-500">MASSAGENS</span></h1>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <MapPin size={10} className="text-green-500"/>
                        LONDRINA - PR
                    </div>
                </div>
            </div>
            <button onClick={() => setShowMenu(true)} className="p-2 bg-[#222] rounded-full border border-[#333]">
                <Menu size={16} />
            </button>
        </div>
        {/* Barra de Progresso do Fluxo */}
        <div className="h-0.5 w-full bg-[#111]">
            <div className="h-full bg-green-500 transition-all duration-300" style={{width: `${(step/4)*100}%`}}></div>
        </div>
      </header>

      {/* MENU MODAL */}
      {showMenu && (
        <div className="fixed inset-0 z-[60] flex justify-end">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setShowMenu(false)}></div>
            <div className="relative w-64 bg-[#111] h-full border-l border-[#222] p-6 shadow-xl animate-enter-right">
                <div className="flex justify-between mb-8">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={()=>setShowMenu(false)}><X className="text-gray-400"/></button>
                </div>
                <div className="space-y-3">
                    <button className="w-full text-left p-3 rounded-lg bg-[#222] text-sm font-bold flex gap-2"><HelpCircle size={16}/> Dúvidas</button>
                    <button className="w-full text-left p-3 rounded-lg bg-[#222] text-sm font-bold flex gap-2"><Share2 size={16}/> Compartilhar</button>
                </div>
            </div>
        </div>
      )}

      {/* CONTEÚDO PRINCIPAL */}
      <main className="pt-20 max-w-md mx-auto animate-fade-in">
        
        {/* ETAPA 0: INTRODUÇÃO */}
        {step === 0 && (
            <div className="px-5 pt-4">
                <p className="text-green-500 font-bold text-xs uppercase tracking-widest mb-2">Bem-vindo a Londrina</p>
                <h2 className="text-3xl font-bold leading-tight mb-6">Seu momento de<br/>relaxamento começa aqui.</h2>
                
                <div className="mb-6">
                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-1 block">Como posso te chamar?</label>
                    <input 
                        value={booking.name}
                        onChange={e => setBooking({...booking, name: e.target.value})}
                        placeholder="Seu nome"
                        className="w-full bg-[#1A1A1A] border border-[#333] text-white p-4 rounded-xl focus:border-green-500 outline-none text-lg font-medium placeholder:text-gray-600"
                        autoFocus
                    />
                </div>

                <div className="bg-[#111] rounded-2xl border border-[#222] overflow-hidden mb-6">
                    <div className="p-3 border-b border-[#222] flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-300">Últimas Avaliações</span>
                    </div>
                    <ReviewCarousel />
                </div>

                <button 
                    disabled={booking.name.length < 3}
                    onClick={handleNext}
                    className="w-full py-4 bg-green-600 text-black font-black uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
                >
                    Começar Agendamento <ArrowRight size={18}/>
                </button>
            </div>
        )}

        {/* ETAPA 1: SERVIÇOS */}
        {step === 1 && (
            <div className="px-5 pt-4">
                <h2 className="text-xl font-bold mb-4">Escolha a Experiência</h2>
                <div className="space-y-4">
                    {SERVICES.map(s => (
                        <div 
                            key={s.id}
                            onClick={() => { Utils.vibrate(); setBooking({...booking, service: s}); handleNext(); }}
                            className={`relative p-5 rounded-2xl border cursor-pointer transition-all active:scale-[0.98] group
                                ${booking.service?.id === s.id ? 'bg-[#1A1A1A] border-green-500' : 'bg-[#111] border-[#222] hover:border-gray-600'}
                            `}
                        >
                            {/* Z-Index fix para garantir clique */}
                            <div className="relative z-10 pointer-events-none">
                                {s.badge && <span className="absolute -top-5 -right-5 bg-yellow-400 text-black text-[9px] font-black px-2 py-1 rounded-bl-lg">{s.badge}</span>}
                                
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className={`text-lg font-bold ${booking.service?.id === s.id ? 'text-green-500' : 'text-white'}`}>{s.name}</h3>
                                    <span className="bg-[#222] px-2 py-1 rounded text-xs font-bold text-white">{Utils.formatBRL(s.price)}</span>
                                </div>
                                <p className="text-xs text-gray-400 leading-relaxed mb-3">{s.desc}</p>
                                <div className="flex items-center gap-3 opacity-60">
                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1"><Clock size={10}/> {s.time} min</span>
                                    <span className="text-[10px] font-bold uppercase flex items-center gap-1"><Zap size={10}/> Nível {s.level}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* ETAPA 2: DATA E HORA */}
        {step === 2 && (
            <div className="px-5 pt-4">
                <h2 className="text-xl font-bold mb-4">Data e Hora</h2>
                
                {/* Scroll de Datas */}
                <div className="flex gap-3 overflow-x-auto pb-4 -mx-5 px-5 scrollbar-hide">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() + i);
                        const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                        
                        return (
                            <button 
                                key={i}
                                onClick={() => { Utils.vibrate(); setBooking({...booking, date: d, time: null}); }}
                                className={`min-w-[70px] h-[80px] rounded-xl flex flex-col items-center justify-center border transition-all flex-shrink-0
                                    ${isSel ? 'bg-green-600 border-green-600 text-black' : 'bg-[#1A1A1A] border-[#333] text-gray-400'}
                                `}
                            >
                                <span className="text-[10px] font-black uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Grid de Horas */}
                <div className={`mt-4 transition-opacity ${!booking.date ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                    <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Horários Disponíveis</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {['10:00','11:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00'].map(t => {
                            const status = Utils.isTimeBlocked(booking.date, t); // true (passado), 'sold_out' (esgotado), false (livre)
                            const isSoldOut = status === 'sold_out';
                            const isPast = status === true;
                            const isSelected = booking.time === t;

                            return (
                                <button 
                                    key={t}
                                    disabled={isPast || isSoldOut}
                                    onClick={() => { Utils.vibrate(); setBooking({...booking, time: t}); }}
                                    className={`relative py-2.5 rounded-lg border text-xs font-bold transition-all
                                        ${isSelected ? 'bg-white text-black border-white' : 
                                          isSoldOut ? 'bg-[#111] border-[#222] text-red-900 opacity-60 cursor-not-allowed' :
                                          isPast ? 'bg-[#111] border-[#222] text-gray-700 opacity-40 cursor-not-allowed' :
                                          'bg-[#1A1A1A] border-[#333] text-gray-300 hover:border-green-500'}
                                    `}
                                >
                                    {t}
                                    {isSoldOut && <div className="absolute inset-0 flex items-center justify-center"><span className="text-[8px] font-black text-red-600 -rotate-12 border border-red-900/50 px-1 bg-black/50 rounded">ESGOTADO</span></div>}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                     <button disabled={!booking.time} onClick={handleNext} className="px-8 py-3 bg-white text-black rounded-xl font-bold text-sm disabled:opacity-50">
                        Confirmar Horário
                     </button>
                </div>
            </div>
        )}

        {/* ETAPA 3: PERSONALIZAÇÃO (BOTOES FIX) */}
        {step === 3 && (
            <div className="px-5 pt-4">
                <h2 className="text-xl font-bold mb-4">Turbine sua Sessão</h2>
                
                <ProgressBar currentLevel={level} />

                <div className="space-y-3 mb-24">
                    {EXTRAS.map(ex => {
                        const active = booking.extras[ex.id];
                        return (
                            <div 
                                key={ex.id}
                                onClick={() => toggleExtra(ex.id)}
                                className={`relative p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all active:scale-[0.99]
                                    ${active ? 'bg-green-900/20 border-green-500' : 'bg-[#1A1A1A] border-[#333]'}
                                `}
                            >
                                <div className="flex items-center gap-4 pointer-events-none">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${active ? 'bg-green-500 border-green-500 text-black' : 'bg-[#111] border-[#333] text-gray-500'}`}>
                                        {active ? <Check size={18}/> : <ex.icon size={18}/>}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${active ? 'text-white' : 'text-gray-300'}`}>{ex.label}</p>
                                        <p className="text-[10px] text-gray-500">{ex.desc}</p>
                                    </div>
                                </div>
                                <span className={`font-bold text-xs pointer-events-none ${active ? 'text-green-400' : 'text-gray-500'}`}>
                                    + {Utils.formatBRL(ex.price)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}

        {/* ETAPA 4: LOCALIZAÇÃO */}
        {step === 4 && (
             <div className="px-5 pt-4">
                <h2 className="text-xl font-bold mb-4">Onde será?</h2>
                
                {/* Selector Tipo */}
                <div className="flex bg-[#1A1A1A] p-1 rounded-xl mb-6">
                    {['home', 'motel', 'hotel'].map(t => (
                        <button 
                            key={t} 
                            onClick={() => setBooking({...booking, locationType: t})}
                            className={`flex-1 py-3 text-xs font-bold uppercase rounded-lg transition-all
                                ${booking.locationType === t ? 'bg-[#333] text-white shadow-lg' : 'text-gray-500'}
                            `}
                        >
                            {t === 'home' ? 'Casa' : t}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                            {booking.locationType === 'motel' ? 'Nome do Motel + Suíte' : 'Endereço Completo'}
                        </label>
                        <textarea 
                            value={booking.address}
                            onChange={e => setBooking({...booking, address: e.target.value})}
                            placeholder={booking.locationType === 'home' ? "Rua, Número, Bairro, Complemento..." : "Digite aqui..."}
                            className="w-full h-24 bg-[#1A1A1A] border border-[#333] rounded-xl p-4 text-white focus:border-green-500 outline-none resize-none mt-1"
                        />
                    </div>
                </div>

                {/* Aviso Deslocamento */}
                <div className="mt-4 bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-xl flex gap-3">
                    <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
                    <p className="text-xs text-yellow-200/80 leading-relaxed">
                        <strong className="text-yellow-500 block mb-1">Taxa de Deslocamento</strong>
                        O valor do transporte (Uber Ida/Volta) <strong>não está incluso</strong> e será combinado diretamente no WhatsApp após o envio.
                    </p>
                </div>
             </div>
        )}

      </main>

      {/* FOOTER FIXO (RESUMO E CTA) */}
      {step > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0a]/90 backdrop-blur-lg border-t border-white/10 p-5 z-40 pb-safe">
            <div className="max-w-md mx-auto flex items-center justify-between gap-4">
                <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase">Total Estimado</p>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">{Utils.formatBRL(total)}</span>
                        <span className="text-[10px] text-gray-500">+ Taxa</span>
                    </div>
                </div>
                
                <div className="w-1/2">
                    {step < 4 ? (
                        <button 
                            onClick={handleNext} 
                            disabled={step === 2 && !booking.time}
                            className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            Avançar <ArrowRight size={16}/>
                        </button>
                    ) : (
                        <button 
                            onClick={generateWhatsApp}
                            disabled={booking.address.length < 5}
                            className="w-full py-3 bg-green-500 text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 animate-pulse"
                        >
                            Finalizar <MessageCircle size={18}/>
                        </button>
                    )}
                </div>
            </div>
          </div>
      )}

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 20px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}
