import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Zap, X, Globe, Building, BedDouble, 
  Heart, Instagram, Moon, Sun, Home, 
  CreditCard, Banknote, QrCode, Trophy, Info, Gift, 
  ChevronLeft, ChevronRight, Loader2, ShieldCheck, AlertTriangle, Tag, Sparkles, 
  MapPin, Calendar, Smartphone, Crown, LayoutList, Package, 
  Lock, User, Quote, Share2, ExternalLink, Copy
} from 'lucide-react';

/**
 * ==================================================================================
 * THALYSON APP OS v39.0 - VERTICAL GLASS FLOW (POPPINS EDITION)
 * ==================================================================================
 * 1. FONTE: Poppins (Google Fonts) para máxima legibilidade.
 * 2. UX: Mobile First, Botões Grandes, Alto Contraste.
 * 3. VISUAL: Glassmorphism (Gaussiano) e fluxo vertical limpo.
 * 4. DADOS: CNPJ PIX Atualizado e Lógica de Horário Mantida.
 */

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens", 
  STORAGE_KEY: '@thaly_app_v39_glass', 
  PIX_KEY: "62922530000144", // CNPJ ATUALIZADO
  PIX_DISPLAY: "62.922.530/0001-44", // Formato visual
  SECRET_TOKEN: 'THALY_GLASS_2026',
  START_HOUR: 9,
  END_HOUR: 20
};

// ==================================================================================
// 1. STYLE INJECTION (POPPINS FONT)
// ==================================================================================
// Injetamos a fonte diretamente para garantir que carregue
const FontStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    
    body, button, input { font-family: 'Poppins', sans-serif; }
    
    .glass-panel {
      background: rgba(30, 41, 59, 0.7);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    .glass-input {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: white;
    }
    .glass-input:focus {
      border-color: #38bdf8;
      background: rgba(0, 0, 0, 0.5);
    }

    .hide-scrollbar::-webkit-scrollbar { display: none; }
    
    /* Animação Vertical Suave */
    @keyframes slideUpFade {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-enter { animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  `}</style>
);

// ==================================================================================
// 2. COMPONENTS (HIGH CONTRAST & BIG TOUCH TARGETS)
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: Icon, className = '' }) => {
  // Botões mais altos e robustos para o dedo (Mobile First)
  const baseStyle = "relative flex items-center justify-center font-semibold tracking-wide transition-all duration-200 active:scale-[0.98] rounded-xl shadow-lg";
  
  const variants = {
    primary: "bg-sky-500 text-white shadow-sky-500/25 hover:bg-sky-400",
    secondary: "bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700",
    whatsapp: "bg-[#25D366] text-white shadow-green-500/20",
    outline: "bg-transparent border-2 border-slate-600 text-slate-300",
  };
  
  const sizes = { 
    sm: "h-10 text-xs px-4", 
    md: "h-14 text-sm px-6", // Altura aumentada para 56px (Padrão Mobile)
    lg: "h-16 text-base px-8", 
    icon: "h-12 w-12 p-0 rounded-full"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {Icon && <Icon size={20} className={children ? "mr-3" : ""} strokeWidth={2.5} />}
      <span>{children}</span>
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text", mask }) => {
    const handleChange = (e) => {
        let val = e.target.value;
        if (mask) val = mask(val);
        onChange(val);
    };

    return (
      <div className="w-full space-y-2">
        {label && <label className="text-xs font-bold uppercase tracking-wider text-sky-400 ml-1">{label}</label>}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">{Icon && <Icon size={20} />}</div>
          <input 
            type={type} 
            value={value} 
            onChange={handleChange} 
            placeholder={placeholder} 
            className="w-full pl-12 pr-4 h-16 rounded-2xl outline-none text-base font-medium transition-all glass-input placeholder:text-slate-600" 
          />
        </div>
      </div>
    );
};

const Card = ({ children, onClick, active = false, className = "" }) => (
  <div 
    onClick={onClick} 
    className={`relative p-6 rounded-3xl transition-all duration-300 overflow-hidden group cursor-pointer border-2
    ${active 
        ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_30px_-10px_rgba(14,165,233,0.3)]' 
        : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-800/60'} 
    ${className}`}
  >
    {children}
  </div>
);

// ==================================================================================
// 3. LOGIC & DATA
// ==================================================================================

const getData = () => {
    return {
        // Dados mantidos, apenas visual ajustado
        services: [
            { 
              id: 'relaxante', min: 60, price: 125, icon: Wind,
              title: "Relaxante", desc: "Alívio muscular profundo.",
              details: "Foco total em tirar dores e tensão. Sem toques íntimos." 
            },
            { 
              id: 'sensitiva', min: 60, price: 155, icon: Flame,
              title: "Sensitiva", desc: "Toque leve e despertar.",
              details: "Começa relaxante e evolui para toques sensoriais na pele."
            },
            { 
              id: 'mista', min: 60, price: 195, icon: Zap, tag: "POPULAR",
              title: "Mista (Completa)", desc: "A fusão perfeita.",
              details: "Relaxante muscular + Sensitiva + Corpo a Corpo (Body). Finalização livre."
            }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: "Ciclo Relax (4x)", 
              price: 397, fullPrice: 500, savings: 103, 
              desc: "4 Sessões Relaxantes.", tag: "MELHOR PREÇO", icon: Package 
            },
            { 
              id: 'pack_mista', type: 'pack', title: "Ciclo Completo (3x)", 
              price: 487, fullPrice: 585, savings: 98, 
              desc: "3 Sessões Mistas.", tag: "RECOMENDADO", icon: Zap 
            },
            { 
              id: 'vip_club', type: 'subscription', title: "Clube VIP Mensal", 
              price: 297, fullPrice: 390, savings: 93, 
              desc: "2 Sessões Mistas/Mês.", tag: "VIP", icon: Crown 
            }
        ],
        extras: [
            { id: 'more_time', price: 55, icon: Clock, label: "+30 Minutos" },
            { id: 'touch', price: 55, icon: Heart, label: "Interatividade" },
            { id: 'aroma', price: 5, icon: Wind, label: "Aromaterapia" }
        ],
        reviews: [
            { n: "Bruno", t: "Profissional impecável. Técnica muito boa.", s: 5 },
            { n: "Ricardo", t: "Sai renovado. Recomendo a Mista.", s: 5 },
            { n: "Felipe", t: "Local discreto e seguro. Gostei.", s: 5 }
        ]
    };
};

// ==================================================================================
// 4. MAIN APP
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0); 
  const [activeTab, setActiveTab] = useState('packs');
  const [isClient, setIsClient] = useState(false);
  const scrollRef = useRef(null);
  
  const DATA = useMemo(() => getData(), []);

  // User State
  const [user, setUser] = useState({ name: '', savedAddress: {} });
  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { street: '', number: '', district: '', city: '' },
    payment: '', termsAccepted: false
  });

  // Init
  useEffect(() => {
    setIsClient(true);
    const s = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (s) {
        try {
            const p = JSON.parse(s);
            if(p.user) setUser(p.user);
            // Recupera draft apenas se data for futura
            if(p.draft && new Date(p.draft.date) >= new Date().setHours(0,0,0,0)) {
                setBooking(p.draft);
                if(p.step) setStep(p.step);
            }
        } catch(e) {}
    }
  }, []);

  // Auto Save
  useEffect(() => { 
      if(isClient) localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user, draft: booking, step })); 
  }, [user, booking, step, isClient]);

  // Scroll to Top on Step Change
  useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTo({top:0, behavior:'smooth'}); }, [step]);

  // --- HELPERS ---
  const vibrate = () => { if (navigator.vibrate) navigator.vibrate(10); };
  
  const daysArray = useMemo(() => {
      const days = [];
      const today = new Date();
      for(let i=0; i<30; i++) { 
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          days.push(d);
      }
      return days;
  }, []);

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = [];
      for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      
      const now = new Date();
      const selectedDate = new Date(booking.date);
      if (selectedDate.getDate() === now.getDate()) {
          const currentHour = now.getHours();
          // Lógica: Se hora do slot > hora atual, mostra. (11:55 mostra 12:00)
          return slots.filter(time => parseInt(time) > currentHour);
      }
      return slots;
  }, [booking.date]);

  const totalValue = useMemo(() => {
    if (!booking.item) return 0;
    let total = booking.item.price;
    Object.keys(booking.extras).forEach(k => {
        if(booking.extras[k]) {
            const ex = DATA.extras.find(e=>e.id===k);
            if(ex) total += (booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price);
        }
    });
    return total;
  }, [booking]);

  const generateWhatsApp = () => {
      const dateStr = booking.date ? new Date(booking.date).toLocaleDateString('pt-BR') : '';
      const hash = btoa(`${totalValue}-${dateStr}-${CONFIG.SECRET_TOKEN}`).substring(0,6).toUpperCase();
      let loc = booking.locationType === 'home' ? `Casa` : (booking.locationType === 'hotel' ? `Hotel` : `Motel`);
      
      const msg = `*NOVO AGENDAMENTO* #${hash}\n\n👤 *${user.name}*\n💆‍♂️ *${booking.item?.title}*\n🗓️ *${dateStr} às ${booking.time}*\n📍 *${loc}*\n💰 *R$ ${totalValue},00*\n\nAguardo confirmação!`;
      window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
      setStep(4);
  };

  // --- RENDER ---
  if (!isClient) return <div className="bg-slate-950 min-h-screen"/>;

  return (
    <div className="h-[100dvh] w-full bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <FontStyles />

      {/* HEADER (Gaussian Blur) */}
      <header className="fixed top-0 left-0 w-full h-20 z-50 glass-panel border-b-0 border-b-white/5 flex items-center justify-between px-6">
          <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">Thalyson</h1>
              <span className="text-[10px] font-bold text-sky-500 uppercase tracking-[0.3em]">Massagens</span>
          </div>
          {step > 0 && step < 4 && (
              <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-500 transition-all duration-500" style={{width: `${(step/3)*100}%`}}></div>
                  </div>
              </div>
          )}
      </header>

      {/* MAIN CONTENT */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pt-24 pb-32 px-4 scroll-smooth">
        <div className="max-w-md mx-auto space-y-8 animate-enter">

          {/* STEP 0: CATALOGO */}
          {step === 0 && (
            <>
              <div className="space-y-2">
                  <h2 className="text-3xl font-semibold text-white">Escolha sua <br/><span className="text-sky-500">Experiência</span></h2>
                  <p className="text-slate-400 text-sm leading-relaxed">Pausa, respira e conecta. O momento é seu.</p>
              </div>

              {/* Toggle Tabs */}
              <div className="bg-slate-900 p-1.5 rounded-2xl grid grid-cols-2 gap-1 border border-slate-800">
                  <button onClick={()=>{vibrate(); setActiveTab('packs')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab==='packs' ? 'bg-slate-800 text-sky-400 shadow-md' : 'text-slate-500'}`}>Ciclos & Planos</button>
                  <button onClick={()=>{vibrate(); setActiveTab('single')}} className={`py-3 rounded-xl text-xs font-bold uppercase transition-all ${activeTab==='single' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500'}`}>Avulso</button>
              </div>

              <div className="grid gap-5 pb-8">
                  {(activeTab === 'single' ? DATA.services : DATA.plans).map(item => (
                      <Card key={item.id} onClick={() => { vibrate(); setBooking(b => ({ ...b, type: activeTab === 'single' ? 'single' : item.type, item })); setStep(1); }}>
                          {item.tag && <span className="absolute top-4 right-4 bg-sky-500/20 text-sky-400 text-[10px] font-bold px-3 py-1 rounded-full border border-sky-500/20">{item.tag}</span>}
                          <div className="flex items-start gap-5">
                              <div className="h-14 w-14 rounded-2xl bg-slate-800 flex items-center justify-center text-sky-500 shrink-0">
                                  <item.icon size={28} strokeWidth={1.5} />
                              </div>
                              <div>
                                  <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                  <p className="text-sm text-slate-400 leading-snug">{item.desc}</p>
                              </div>
                          </div>
                          <div className="mt-5 pt-5 border-t border-white/5 flex justify-between items-end">
                              <span className="text-xs font-bold text-slate-500 uppercase">{item.min ? `${item.min} MIN` : 'MENSAL'}</span>
                              <div className="text-right">
                                  {item.fullPrice && <span className="text-xs line-through text-slate-600 block">R$ {item.fullPrice}</span>}
                                  <span className="text-2xl font-bold text-sky-400">R$ {item.price}</span>
                              </div>
                          </div>
                      </Card>
                  ))}
              </div>
              
              {/* Reviews Scroll Horizontal */}
              <div className="border-t border-white/5 pt-8">
                  <h3 className="text-sm font-bold text-slate-500 uppercase mb-4 pl-2">O que dizem</h3>
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x px-2">
                      {DATA.reviews.map((r, i) => (
                          <div key={i} className="min-w-[260px] bg-slate-900/50 p-5 rounded-3xl border border-white/5 snap-center">
                              <div className="flex gap-1 mb-3 text-sky-500"><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/><Star size={14} fill="currentColor"/></div>
                              <p className="text-sm text-slate-300 italic mb-3">"{r.t}"</p>
                              <p className="text-xs font-bold text-slate-500 uppercase">{r.n}</p>
                          </div>
                      ))}
                  </div>
              </div>
            </>
          )}

          {/* STEP 1: DATA E HORA */}
          {step === 1 && (
            <div className="space-y-8">
               <div className="text-center">
                   <h2 className="text-2xl font-bold text-white">Quando?</h2>
                   <p className="text-slate-400 text-sm">Selecione o melhor horário.</p>
               </div>

               {/* Datas - Horizontal Scroll */}
               <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar snap-x -mx-4 px-4">
                   {daysArray.map((d, i) => {
                       const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                       return (
                           <button key={i} onClick={() => {vibrate(); setBooking(b => ({ ...b, date: d, time: null }))}} className={`h-24 min-w-[5rem] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all border-2 snap-start ${isSel ? 'bg-sky-500 border-sky-500 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                               <span className="text-[10px] font-bold uppercase tracking-wider">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                               <span className="text-2xl font-bold">{d.getDate()}</span>
                           </button>
                       )
                   })}
               </div>

               {/* Grid de Horários */}
               {booking.date ? (
                   generateTimeSlots.length > 0 ? (
                       <div className="grid grid-cols-4 gap-3 animate-enter">
                           {generateTimeSlots.map((t) => (
                               <button key={t} onClick={() => {vibrate(); setBooking(b => ({...b, time: t}))}} className={`py-3 rounded-xl text-sm font-bold border-2 transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'}`}>
                                   {t}
                               </button>
                           ))}
                       </div>
                   ) : <div className="p-6 bg-slate-900 rounded-2xl text-center text-slate-500 border border-white/5">Dia cheio. Tente outro.</div>
               ) : <div className="p-8 text-center text-slate-600 font-medium">Toque em uma data acima.</div>}
            </div>
          )}

          {/* STEP 2: LOCAL E DADOS */}
          {step === 2 && (
             <div className="space-y-8">
                 <h2 className="text-2xl font-bold text-center text-white">Localização</h2>
                 <div className="grid grid-cols-3 gap-3">
                     {[{id:'home', l:'Casa', i:Home}, {id:'motel', l:'Motel', i:BedDouble}, {id:'hotel', l:'Hotel', i:Building}].map(x => (
                         <button key={x.id} onClick={()=>{vibrate(); setBooking(b=>({...b, locationType: x.id}))}} className={`h-24 rounded-2xl text-xs font-bold uppercase flex flex-col items-center justify-center gap-3 border-2 transition-all ${booking.locationType === x.id ? 'bg-sky-500/20 border-sky-500 text-sky-400' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                             <x.i size={24}/> {x.l}
                         </button>
                     ))}
                 </div>
                 
                 <div className="space-y-5 animate-enter">
                     <InputField label="Seu Nome" value={user.name} onChange={v=>setUser(u=>({...u, name: v}))} icon={User} placeholder="Como prefere ser chamado?" />
                     {booking.locationType !== 'motel' && (
                         <>
                             <div className="grid grid-cols-[1fr_90px] gap-4">
                                 <InputField label={booking.locationType==='hotel'?'Hotel':'Rua'} value={booking.address.street} onChange={v=>setBooking(b=>({...b, address: {...b.address, street: v}}))} icon={booking.locationType==='hotel'?Building:MapPin} />
                                 <InputField label={booking.locationType==='hotel'?'Quarto':'Nº'} value={booking.address.number} type="tel" onChange={v=>setBooking(b=>({...b, address: {...b.address, number: v}}))} />
                             </div>
                             <InputField label={booking.locationType==='hotel'?'Cidade':'Bairro'} value={booking.address.district} onChange={v=>setBooking(b=>({...b, address: {...b.address, district: v}}))} icon={MapPin} />
                         </>
                     )}
                     {booking.locationType === 'motel' && <div className="p-4 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-center text-sm text-slate-400">A taxa do local fica por conta do cliente.</div>}
                 </div>

                 <div className="pt-6 border-t border-white/5">
                     <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Turbine sua sessão</h3>
                     <div className="space-y-3">
                         {DATA.extras.map(ex => (
                             <div key={ex.id} onClick={()=>{vibrate(); setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))}} className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${booking.extras[ex.id] ? 'bg-sky-500/10 border-sky-500' : 'bg-slate-900 border-slate-800'}`}>
                                 <div className="flex items-center gap-3">
                                     <div className={`p-2 rounded-lg ${booking.extras[ex.id] ? 'text-sky-400' : 'text-slate-600'}`}><ex.icon size={20}/></div>
                                     <span className={`font-semibold ${booking.extras[ex.id] ? 'text-white' : 'text-slate-400'}`}>{ex.label}</span>
                                 </div>
                                 <span className={`text-xs font-bold px-2 py-1 rounded ${booking.extras[ex.id] ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>+ R$ {ex.price}</span>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
          )}

          {/* STEP 3: CHECKOUT & PIX */}
          {step === 3 && (
             <div className="space-y-6 animate-enter">
                 <div className="text-center">
                     <h2 className="text-2xl font-bold text-white">Resumo</h2>
                     <p className="text-slate-400 text-sm">Confira os detalhes.</p>
                 </div>

                 <div className="glass-panel p-6 rounded-3xl relative overflow-hidden">
                     <div className="relative z-10">
                         <h3 className="text-2xl font-bold text-white mb-1">{booking.item?.title}</h3>
                         <p className="text-sky-400 font-medium mb-6">{new Date(booking.date).toLocaleDateString('pt-BR')} às {booking.time}</p>
                         
                         <div className="space-y-3 border-t border-white/10 pt-4 mb-6">
                             <div className="flex justify-between text-sm text-slate-300"><span>Valor Base</span><span>R$ {booking.item?.price}</span></div>
                             {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k=>(
                                 <div key={k} className="flex justify-between text-sm text-slate-400"><span>+ {DATA.extras.find(e=>e.id===k).label}</span><span>R$ {DATA.extras.find(e=>e.id===k).price}</span></div>
                             ))}
                         </div>
                         <div className="flex justify-between items-end">
                             <span className="text-xs font-bold uppercase text-slate-500">Total</span>
                             <span className="text-4xl font-bold text-white">R$ {totalValue}</span>
                         </div>
                     </div>
                 </div>

                 <div className="space-y-3">
                     <h3 className="text-xs font-bold text-slate-500 uppercase ml-1">Pagamento</h3>
                     {[{id:'pix', l:'PIX (CNPJ)', i:QrCode}, {id:'money', l:'Dinheiro', i:Banknote}, {id:'card', l:'Cartão', i:CreditCard}].map(p => (
                         <button key={p.id} onClick={()=>{vibrate(); setBooking(b=>({...b, payment: p.id}))}} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${booking.payment === p.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>
                             <div className="flex items-center gap-3"><p.i size={20}/><span className="font-semibold">{p.l}</span></div>
                             {booking.payment === p.id && <div className="h-5 w-5 bg-emerald-500 rounded-full flex items-center justify-center"><Check size={12} className="text-black"/></div>}
                         </button>
                     ))}
                 </div>

                 {booking.payment === 'pix' && (
                     <div className="p-5 bg-slate-900 rounded-2xl border border-dashed border-slate-700 animate-enter">
                         <p className="text-xs text-center text-slate-500 mb-3 uppercase font-bold">Chave CNPJ</p>
                         <div className="flex gap-2">
                             <div className="flex-1 bg-black/30 rounded-xl flex items-center justify-center text-lg font-mono text-white border border-white/5">{CONFIG.PIX_DISPLAY}</div>
                             <button onClick={()=>{navigator.clipboard.writeText(CONFIG.PIX_KEY); vibrate();}} className="h-12 w-12 bg-slate-800 rounded-xl flex items-center justify-center text-white border border-slate-700 active:bg-sky-500"><Copy size={20}/></button>
                         </div>
                     </div>
                 )}

                 <div className="pt-4">
                     <label className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                         <input type="checkbox" checked={booking.termsAccepted} onChange={e=>setBooking(b=>({...b, termsAccepted: e.target.checked}))} className="h-6 w-6 rounded-md border-slate-600 bg-slate-800 accent-sky-500"/>
                         <span className="text-xs text-slate-400 leading-snug">Concordo com os termos de higiene, segurança e cancelamento.</span>
                     </label>
                 </div>
             </div>
          )}

          {/* STEP 4: SUCCESS */}
          {step === 4 && (
             <div className="flex flex-col items-center justify-center pt-20 text-center animate-enter px-6">
                 <div className="h-28 w-28 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_-10px_rgba(16,185,129,0.5)] mb-8">
                     <Check size={56} className="text-white" strokeWidth={3}/>
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-3">Tudo Certo!</h2>
                 <p className="text-slate-400 mb-10 max-w-[250px]">Seu pré-agendamento foi gerado. Finalize no WhatsApp para confirmar.</p>
                 <Button variant="secondary" full onClick={()=>{setStep(0); setBooking({...booking, item:null})}}>Voltar ao Início</Button>
             </div>
          )}

        </div>
      </main>

      {/* FOOTER ACTION (Gaussian Blur) */}
      {step < 4 && (
          <div className="fixed bottom-0 left-0 w-full p-4 glass-panel border-t-0 border-t-white/10 z-50">
              <div className="max-w-md mx-auto flex gap-3">
                  {step > 0 && <Button variant="secondary" size="icon" icon={ChevronLeft} onClick={()=>{vibrate(); setStep(step-1)}} />}
                  <Button full variant={step===3 ? 'whatsapp' : 'primary'} size="lg" onClick={()=>{
                      vibrate();
                      if(step===0 && !booking.item) return;
                      if(step===1 && (!booking.date || !booking.time)) return;
                      if(step===2 && !user.name) return;
                      if(step===3) {
                          if(!booking.payment || !booking.termsAccepted) return;
                          generateWhatsApp();
                      } else {
                          setStep(step+1);
                      }
                  }}>
                      {step === 3 ? 'FINALIZAR NO WHATSAPP' : 'CONTINUAR'}
                  </Button>
              </div>
          </div>
      )}
    </div>
  );
}
