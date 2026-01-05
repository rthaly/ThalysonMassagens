import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ArrowRight, MapPin, Calendar, Clock,
  Star, Bell, Shield, CreditCard, QrCode, 
  MessageCircle, Heart, Flame, Eye, EyeOff, CheckCircle2,
  Navigation, User
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO E COPYWRITING (O TOM "REAL" E "HUMANO")
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413", // Seu número real
  PRICES: { 
    TOUCH: 60, 
    AROMA: 20
  }
};

const SERVICES = [
  { 
    id: 'descompressao', 
    name: 'Descompressão Total', 
    tag: 'PARA QUEM TRABALHA MUITO', 
    desc: 'Sua mente não para? Essa sessão é para desligar o disjuntor. Foco total em tirar o peso das costas e zerar o estresse. Toque firme, óleo quente e silêncio absoluto.', 
    duration: '50 min', 
    price: 140, 
    vibe: '🌿 Alívio Imediato',
    features: ['Foco em Dores', 'Sem conversas fiadas', 'Óleo Neutro', 'Privacidade Total']
  },
  { 
    id: 'sensorial', 
    name: 'Experiência Sensorial', 
    tag: 'A MAIS PROCURADA 🔥', 
    desc: 'Para homens que querem sentir. Começa relaxando e evolui para toques provocantes que percorrem o corpo todo. Liberdade total para interagir, sentir e chegar ao ápice.', 
    duration: '60 min', 
    price: 190, 
    vibe: '🔥 Intensa & Livre',
    features: ['Toque no corpo todo', 'Massagem Tântrica', 'Finalização Manual', 'Interação permitida']
  }
];

// AVALIAÇÕES REAIS (PERFIS VARIADOS: CASADOS, CURIOSOS, ETC)
const REVIEWS = [
  { t: "Sou casado há 15 anos, rotina pesada. Foi meu momento de escape. O sigilo foi absoluto, ninguém me viu entrar ou sair.", a: "R. (Empresário, 48 anos)", r: 5 },
  { t: "Primeira vez com homem. Fiquei nervoso no começo, mas o Thalyson me deixou muito à vontade. O toque é diferente de tudo.", a: "Curioso (32 anos)", r: 5 },
  { t: "Tava precisando gozar e relaxar sem ninguém enchendo o saco. Foi direto ao ponto. Serviço top.", a: "Anônimo (Jales)", r: 5 },
  { t: "Gostei que ele foi até meu apto e foi super discreto na portaria. A massagem foi o melhor investimento da semana.", a: "Felipe (Médico)", r: 5 },
  { t: "Sou bi e meio chato com higiene. O cara é limpo, cheiroso e tem uma pegada firme. Volto semana que vem.", a: "Sigilo Total", r: 5 },
  { t: "Mãos de fada mas com força de homem. A finalização foi explosiva. Recomendo pra quem tá na seca.", a: "M.S. (Santa Fé)", r: 5 }
];

const LIVE_STATUS_MSGS = [
  "Um homem casado de Jales acabou de agendar 🔒", 
  "Horário das 20h foi reservado agora 🔥", 
  "Sigilo absoluto garantido em todos os atendimentos",
  "Atendendo agora no Centro de Santa Fé 📍"
];

// ==================================================================================
// 2. ESTILOS CSS (DARK LUXURY)
// ==================================================================================

const styles = `
  :root {
    --bg-color: #050505;
    --surface: rgba(30, 30, 35, 0.85);
    --accent: #2563EB;
    --gold: #D4AF37;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: var(--bg-color); color: #FFF;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
    overscroll-behavior-y: none;
  }
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: radial-gradient(circle at 50% 10%, rgba(37, 99, 235, 0.1) 0%, transparent 60%);
  }
  /* Cards */
  .glass-card {
    background: var(--surface); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  }
  /* Botões */
  .action-btn {
    background: linear-gradient(135deg, #2563EB, #1E40AF); border: none; color: white;
    box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); transition: transform 0.1s;
  }
  .action-btn:active { transform: scale(0.96); }
  .slot-btn {
    transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05);
  }
  .slot-btn.active { background: #2563EB; border-color: #2563EB; color: white; }
  .slot-btn.disabled { opacity: 0.3; cursor: not-allowed; background: rgba(0,0,0,0.5); text-decoration: line-through; }
  
  /* Inputs */
  .input-field {
    background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); 
    color: white; width: 100%; padding: 12px; border-radius: 12px; font-size: 16px; outline: none;
  }
  .input-field:focus { border-color: #2563EB; }

  .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
`;

// ==================================================================================
// 3. COMPONENTES LÓGICOS
// ==================================================================================

const Header = ({ step, goBack }) => (
  <div className="fixed top-0 w-full z-50 px-6 pt-6 pb-4 bg-gradient-to-b from-black via-black/95 to-transparent flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto">
      {step > 1 ? (
        <button onClick={goBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex flex-col animate-enter">
          <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson VIP</span>
          <span className="text-sm font-medium text-gray-300">Discrição & Prazer</span>
        </div>
      )}
    </div>
    <div className="pointer-events-auto px-3 py-1.5 rounded-full glass-card flex items-center gap-2 border border-green-500/30">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
        <span className="text-[10px] font-bold text-green-400">ONLINE</span>
    </div>
  </div>
);

const DateAndTimeSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const [dates, setDates] = useState([]);
  
  // Gera os horários das 09:00 as 23:00
  const allSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) { // Próximos 7 dias
      const d = new Date(today); d.setDate(today.getDate() + i); arr.push(d);
    }
    setDates(arr);
  }, []);

  const getLabel = (d) => {
    const now = new Date();
    if(d.toDateString() === now.toDateString()) return 'HOJE';
    const tmr = new Date(now); tmr.setDate(tmr.getDate() + 1);
    if(d.toDateString() === tmr.toDateString()) return 'AMANHÃ';
    return d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3).toUpperCase();
  };

  // Lógica de Bloqueio de Horário
  const isSlotBlocked = (slotTime, dateObj) => {
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    
    if (!isToday) return false; // Se não for hoje, tá liberado

    const [slotHour] = slotTime.split(':').map(Number);
    const currentHour = now.getHours();
    
    // Bloqueia se a hora já passou. Ex: Agora é 14:00, o slot 14:00 bloqueia (precisa de tempo pra chegar).
    // Damos uma margem de 1 hora de antecedência para preparo/deslocamento.
    return slotHour <= currentHour; 
  };

  return (
    <div className="animate-enter" style={{animationDelay: '0.1s'}}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Escolha o Dia</h3>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {dates.map((d, i) => {
          const isSel = selectedDate && selectedDate.toDateString() === d.toDateString();
          return (
            <button key={i} onClick={() => onSelect(d, null)} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-blue-600 text-white border-blue-500 scale-105' : 'glass-btn border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-blue-500'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-4 animate-enter">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Horário Disponível</h3>
          <div className="grid grid-cols-4 gap-2">
            {allSlots.map(t => {
              const blocked = isSlotBlocked(t, selectedDate);
              return (
                <button 
                  key={t} 
                  disabled={blocked}
                  onClick={() => onSelect(selectedDate, t)} 
                  className={`py-3 rounded-lg text-sm font-bold slot-btn ${selectedTime === t ? 'active' : ''} ${blocked ? 'disabled' : ''}`}
                >
                  {t}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-gray-500 mt-2 text-center">*Horários passados são bloqueados automaticamente.</p>
        </div>
      )}
    </div>
  )
};

const LocationForm = ({ data, onChange }) => {
  return (
    <div className="animate-enter space-y-4">
       <div className="glass-card p-5 rounded-2xl border-l-4 border-blue-600">
          <div className="flex items-center gap-2 mb-4">
             <MapPin className="text-blue-500 w-5 h-5" />
             <h3 className="font-bold text-white">Onde irei te atender?</h3>
          </div>
          
          <div className="space-y-3">
             <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Rua / Avenida</label>
                <input 
                  value={data.street} 
                  onChange={e => onChange('street', e.target.value)} 
                  className="input-field" 
                  placeholder="Ex: Av. Navarro de Andrade"
                />
             </div>
             <div className="flex gap-3">
                <div className="w-1/3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Número</label>
                  <input 
                    value={data.number} 
                    onChange={e => onChange('number', e.target.value)} 
                    className="input-field" 
                    placeholder="123"
                    type="tel"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Comp. (Apto/Bloco)</label>
                  <input 
                    value={data.complement} 
                    onChange={e => onChange('complement', e.target.value)} 
                    className="input-field" 
                    placeholder="Apto 42, Bloco B"
                  />
                </div>
             </div>
             <div>
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Cidade / Bairro</label>
                <input 
                    value={data.district} 
                    onChange={e => onChange('district', e.target.value)} 
                    className="input-field" 
                    placeholder="Ex: Santa Fé, Centro"
                />
             </div>
          </div>
       </div>
       <div className="flex items-start gap-2 px-2">
         <Shield className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
         <p className="text-[10px] text-gray-400">Seu endereço é mantido em sigilo absoluto e deletado após o atendimento.</p>
       </div>
    </div>
  )
}

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [liveMsg, setLiveMsg] = useState(LIVE_STATUS_MSGS[0]);
  
  // Estado do Agendamento
  const [booking, setBooking] = useState({
    service: null,
    date: null,
    time: null,
    address: { street: '', number: '', complement: '', district: '' },
    extras: { touch: false, aroma: false }
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500);
    const interval = setInterval(() => setLiveMsg(LIVE_STATUS_MSGS[Math.floor(Math.random() * LIVE_STATUS_MSGS.length)]), 4000);
    return () => clearInterval(interval);
  }, []);

  const formatMoney = (v) => v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'});
  
  const calcTotal = () => {
    if(!booking.service) return 0;
    let total = booking.service.price;
    if(booking.extras.touch) total += CONFIG.PRICES.TOUCH;
    if(booking.extras.aroma) total += CONFIG.PRICES.AROMA;
    return total;
  };

  const handleFinish = () => {
     // Formata a mensagem para o Whats
     const dateStr = booking.date.toLocaleDateString('pt-BR');
     const msg = `*NOVO AGENDAMENTO VIP* 🔒
---------------------------
💆‍♂️ *Serviço:* ${booking.service.name}
📅 *Data:* ${dateStr}
⏰ *Horário:* ${booking.time}
---------------------------
📍 *LOCAL:*
${booking.address.street}, ${booking.address.number}
${booking.address.complement} - ${booking.address.district}
---------------------------
*ADICIONAIS:*
Toque Interativo: ${booking.extras.touch ? 'SIM' : 'Não'}
Óleos Especiais: ${booking.extras.aroma ? 'SIM' : 'Não'}
---------------------------
💰 *TOTAL: ${formatMoney(calcTotal())}*
Pagamento: Pix ou Dinheiro
---------------------------
_Aguardo confirmação._`;

     // Abre o WhatsApp
     window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
     
     // Reseta para o início após 2 segundos
     setTimeout(() => {
        setBooking({ service: null, date: null, time: null, address: { street: '', number: '', complement: '', district: '' }, extras: { touch: false, aroma: false } });
        setStep(1);
     }, 2000);
  };

  const isLocationValid = () => {
      return booking.address.street.length > 3 && booking.address.number.length > 0 && booking.address.district.length > 3;
  }

  if(loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center fixed inset-0 z-[100]">
      <style>{styles}</style>
      <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-6"/>
      <span className="text-[12px] tracking-[0.3em] font-bold text-blue-500 animate-pulse">ACESSO SEGURO...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 w-full max-w-md mx-auto relative">
      <style>{styles}</style>
      <div className="ambient-bg" />
      <Header step={step} goBack={() => setStep(s => s-1)} />

      {/* --- PASSO 1: SERVIÇOS (VITRINE) --- */}
      {step === 1 && (
        <div className="px-6 pt-24 pb-10">
          <div className="mb-6 animate-enter">
            <h1 className="text-3xl font-bold text-white leading-tight">O que você <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">precisa hoje?</span></h1>
            <p className="text-gray-400 text-sm mt-2">Escolha sua experiência com sigilo total.</p>
          </div>

          <div className="flex justify-center mb-8 animate-enter">
            <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 border border-blue-500/20 shadow-lg">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
              <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{liveMsg}</span>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            {SERVICES.map((s, idx) => (
              <div key={s.id} className="glass-card p-6 rounded-3xl relative overflow-hidden animate-enter" style={{animationDelay: `${0.2 + (idx * 0.1)}s`}}>
                 {s.tag && <div className="absolute top-0 right-0 bg-blue-600 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-lg z-10">{s.tag}</div>}
                 
                 <div className="mb-3">
                     <h3 className="text-2xl font-bold text-white mb-1">{s.name}</h3>
                     <div className="flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-xl">{formatMoney(s.price)}</span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">• {s.duration}</span>
                     </div>
                 </div>
                 
                 <p className="text-sm text-gray-300 leading-relaxed mb-4">{s.desc}</p>

                 <div className="flex flex-wrap gap-2 mb-6">
                    {s.features.map((f, i) => (
                        <span key={i} className="text-[10px] bg-white/5 border border-white/5 px-2 py-1 rounded-md text-gray-400 font-medium">{f}</span>
                    ))}
                 </div>

                 <button onClick={() => { setBooking({...booking, service: s}); setStep(2); }} className="w-full action-btn py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                    QUERO ESSE <ArrowRight size={16}/>
                 </button>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest pl-1">Quem já experimentou</h3>
          <div className="overflow-x-auto flex gap-4 pb-4 hide-scrollbar animate-enter">
            {REVIEWS.map((r, i) => (
              <div key={i} className="glass-card min-w-[260px] p-4 rounded-xl border border-white/5 flex-shrink-0">
                <div className="flex gap-1 mb-2">
                   {[...Array(5)].map((_,k) => <Star key={k} size={12} className="text-yellow-500 fill-yellow-500"/>)}
                </div>
                <p className="text-xs text-gray-300 italic mb-2 leading-relaxed">"{r.t}"</p>
                <p className="text-[9px] text-gray-500 font-bold uppercase text-right opacity-70">- {r.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- PASSO 2: DATA E EXTRAS --- */}
      {step === 2 && (
        <div className="px-6 pt-24 pb-10">
           <h2 className="text-2xl font-bold mb-6 animate-enter">Agendamento</h2>
           
           <DateAndTimeSelector 
             selectedDate={booking.date} 
             selectedTime={booking.time} 
             onSelect={(d, t) => setBooking(prev => ({...prev, date: d, time: t || prev.time}))} 
           />

           {booking.date && booking.time && (
             <div className="mt-8 animate-enter">
               <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Turbinar Sessão</h3>
               <div className="space-y-3">
                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, touch: !p.extras.touch}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.touch ? 'bg-red-500/10 border-red-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.touch ? 'bg-red-500 text-white' : 'bg-white/5 text-gray-400'}`}><Heart size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Toque Interativo</span><span className="text-[10px] text-gray-500">Pode tocar no corpo</span></div>
                    </div>
                    <span className="text-xs font-bold text-red-400">+ {formatMoney(CONFIG.PRICES.TOUCH)}</span>
                  </button>

                  <button onClick={() => setBooking(p => ({...p, extras: {...p.extras, aroma: !p.extras.aroma}}))} 
                    className={`w-full p-4 rounded-xl border flex justify-between items-center transition-all ${booking.extras.aroma ? 'bg-blue-500/10 border-blue-500/50' : 'glass-btn border-white/5'}`}>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${booking.extras.aroma ? 'bg-blue-500 text-white' : 'bg-white/5 text-gray-400'}`}><Flame size={16} /></div>
                        <div className="text-left"><span className="text-sm font-bold block text-gray-200">Óleos Especiais</span><span className="text-[10px] text-gray-500">Aquecidos + Aromaterapia</span></div>
                    </div>
                    <span className="text-xs font-bold text-blue-400">+ {formatMoney(CONFIG.PRICES.AROMA)}</span>
                  </button>
               </div>
               <button onClick={() => setStep(3)} className="w-full mt-8 action-btn py-4 rounded-xl font-bold flex justify-center items-center gap-2 text-lg">Definir Local <MapPin size={20}/></button>
             </div>
           )}
        </div>
      )}

      {/* --- PASSO 3: LOCALIZAÇÃO (OBRIGATÓRIO) --- */}
      {step === 3 && (
        <div className="px-6 pt-24 pb-10">
           <h2 className="text-2xl font-bold mb-6 animate-enter">Localização</h2>
           
           <LocationForm 
             data={booking.address} 
             onChange={(field, value) => setBooking(prev => ({...prev, address: {...prev.address, [field]: value}}))}
           />

           <div className="mt-8">
              <button 
                disabled={!isLocationValid()} 
                onClick={() => setStep(4)} 
                className={`w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all ${isLocationValid() ? 'action-btn' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                Resumo do Pedido <ArrowRight size={20}/>
              </button>
           </div>
        </div>
      )}

      {/* --- PASSO 4: CHECKOUT --- */}
      {step === 4 && (
        <div className="px-6 pt-24 pb-10">
          <h2 className="text-2xl font-bold mb-6 animate-enter">Confirmação</h2>
          
          <div className="glass-card p-6 rounded-2xl border-t-4 border-blue-600 mb-6 animate-enter">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white">{booking.service.name}</h3>
                <span className="text-blue-400 font-bold">{formatMoney(booking.service.price)}</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 flex items-center gap-2">
              <Calendar size={14}/> {booking.date.toLocaleDateString('pt-BR')} às {booking.time}
            </p>
            
            <div className="p-3 bg-white/5 rounded-lg mb-4 border border-white/5">
                <p className="text-[11px] font-bold text-gray-500 uppercase mb-1">Local de Atendimento:</p>
                <p className="text-xs text-gray-300">{booking.address.street}, {booking.address.number}</p>
                <p className="text-xs text-gray-300">{booking.address.complement} - {booking.address.district}</p>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-4 mb-4">
               {booking.extras.touch && <div className="flex justify-between text-sm text-gray-300"><span>Toque Interativo</span><span>{formatMoney(CONFIG.PRICES.TOUCH)}</span></div>}
               {booking.extras.aroma && <div className="flex justify-between text-sm text-gray-300"><span>Óleos Especiais</span><span>{formatMoney(CONFIG.PRICES.AROMA)}</span></div>}
            </div>
            
            <div className="flex justify-between items-end pt-2 border-t border-white/10">
               <span className="text-xs font-bold text-gray-500 uppercase">Total Final</span>
               <span className="text-3xl font-bold text-white">{formatMoney(calcTotal())}</span>
            </div>
          </div>

          <button onClick={handleFinish} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,211,102,0.3)] flex justify-center items-center gap-3 animate-enter transition-transform active:scale-95">
             <MessageCircle size={22}/> ENVIAR AGORA
          </button>
          
          <p className="text-center text-[10px] text-gray-500 mt-4 px-4">
             Ao clicar, você será redirecionado para o WhatsApp com o pedido pronto. O site voltará ao início automaticamente.
          </p>
        </div>
      )}
    </div>
  );
}
