import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ArrowRight, MapPin, Calendar, Clock,
  Star, Bell, Shield, CreditCard, QrCode, 
  MessageCircle, Heart, Flame, Eye, EyeOff, CheckCircle2,
  Navigation, User, Info, HelpCircle, X, AlertCircle
} from 'lucide-react';

// ==================================================================================
// 1. DADOS E CONFIGURAÇÃO (O CÉREBRO DO APP)
// ==================================================================================

const CONFIG = {
  WHATSAPP: "5517991360413", 
  PRICES: { 
    TOUCH: 60, 
    AROMA: 20
  },
  // Define quantas horas de antecedência mínima você precisa
  MIN_NOTICE_HOURS: 1 
};

const SERVICES = [
  { 
    id: 'descompressao', 
    name: 'Descompressão Alpha', 
    tag: 'TIRA O ESTRESSE', 
    desc: 'Sessão focada em zerar sua tensão. Ideal para quem tem rotina pesada. Massagem profunda nas costas, pescoço e pernas, finalizando com relaxamento total.', 
    duration: '50 min', 
    price: 140, 
    vibe: '🌿 Alívio & Paz',
    features: ['Foco em Dores Musculares', 'Óleo Neutro Aquecido', 'Ambiente Escuro', 'Sem Toque Íntimo']
  },
  { 
    id: 'sensorial', 
    name: 'Experiência Tântrica', 
    tag: 'PRAZER TOTAL 🔥', 
    desc: 'O carro-chefe. Uma jornada sensorial que começa lenta e evolui para toques provocantes no corpo todo. Liberdade total para interagir, sentir e chegar ao ápice do prazer.', 
    duration: '60 min', 
    price: 190, 
    vibe: '🔥 Intensa & Livre',
    features: ['Toque no corpo todo', 'Massagem Lingam', 'Finalização Manual', 'Interação Permitida']
  }
];

const FAQS = [
  { q: "É sigiloso mesmo?", a: "Absoluto. Atendo empresários e casados diariamente. Nada fica registrado." },
  { q: "Onde é o atendimento?", a: "Vou até você (Sua casa/hotel) ou em local parceiro (consulte taxa)." },
  { q: "Posso tomar banho antes?", a: "Deve. Higiene é fundamental para uma boa experiência mútua." },
  { q: "Aceita cartão?", a: "Sim, Pix, Dinheiro e Cartão (taxa da máquina)." }
];

const REVIEWS = [
  { t: "O cara é profissional. Chegou no horário, discreto na portaria. A massagem foi exatamente o que eu precisava pra desestressar.", a: "André (Advogado)", r: 5 },
  { t: "Primeira vez que faço tântrica. A sensação é inexplicável. O Thalyson deixa a gente super à vontade. Recomendo.", a: "Curioso (35 anos)", r: 5 },
  { t: "Sou casado, minha esposa não sabe. O sigilo foi 100%. Voltarei sempre que der uma escapada.", a: "Anônimo", r: 5 },
  { t: "Higiene impecável e mão firme. A finalização foi sensacional.", a: "M. (Santa Fé)", r: 5 }
];

const LIVE_STATUS_MSGS = [
  "Atendimento em andamento no Centro 💆‍♂️",
  "Horário das 20h acabou de ser reservado 🔥",
  "Agenda de Sexta feira quase lotada 📅",
  "Sigilo e discrição garantidos 🔒"
];

// ==================================================================================
// 2. ESTILOS CSS (DARK LUXURY OTIMIZADO)
// ==================================================================================

const styles = `
  :root {
    --bg-color: #050505;
    --surface: rgba(30, 30, 35, 0.9);
    --surface-light: rgba(45, 45, 50, 0.9);
    --accent: #2563EB;
    --accent-glow: rgba(37, 99, 235, 0.4);
    --gold: #D4AF37;
    --danger: #EF4444;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: var(--bg-color); color: #FFF;
    font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
    overscroll-behavior-y: none;
    overflow-x: hidden;
  }
  .ambient-bg {
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1;
    background: 
      radial-gradient(circle at 10% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 40%),
      radial-gradient(circle at 90% 80%, rgba(212, 175, 55, 0.05) 0%, transparent 40%);
  }
  
  /* Glass Cards */
  .glass-card {
    background: var(--surface); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
    border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  }
  
  /* Buttons */
  .action-btn {
    background: linear-gradient(135deg, #2563EB, #1E40AF); border: none; color: white;
    box-shadow: 0 4px 15px var(--accent-glow); transition: all 0.2s; cursor: pointer;
  }
  .action-btn:active { transform: scale(0.96); }
  .action-btn:disabled { background: #333; color: #666; box-shadow: none; cursor: not-allowed; }

  .slot-btn {
    transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); cursor: pointer;
  }
  .slot-btn.active { background: var(--accent); border-color: var(--accent); color: white; box-shadow: 0 0 10px var(--accent-glow); }
  .slot-btn.disabled { opacity: 0.3; cursor: not-allowed; background: rgba(0,0,0,0.3); border-color: transparent; }
  
  /* Inputs */
  .input-field {
    background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.15); 
    color: white; width: 100%; padding: 14px; border-radius: 12px; font-size: 16px; outline: none;
    transition: border-color 0.2s;
  }
  .input-field:focus { border-color: var(--accent); background: rgba(0,0,0,0.6); }
  .input-error { border-color: var(--danger); }

  /* Animations */
  .animate-enter { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; transform: translateY(20px); }
  @keyframes slideUp { to { opacity: 1; transform: translateY(0); } }
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  
  /* Toast */
  .toast-enter { animation: slideDown 0.3s forwards; }
  @keyframes slideDown { from { transform: translate(-50%, -100%); } to { transform: translate(-50%, 20px); } }
`;

// ==================================================================================
// 3. COMPONENTES AUXILIARES
// ==================================================================================

const Toast = ({ msg, type = 'error' }) => (
  <div className="fixed top-0 left-1/2 z-[200] bg-[#1C1C1E] border border-white/10 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 toast-enter min-w-[300px] justify-center">
    {type === 'error' ? <AlertCircle className="text-red-500 w-5 h-5"/> : <CheckCircle2 className="text-green-500 w-5 h-5"/>}
    <span className="text-sm font-bold">{msg}</span>
  </div>
);

const Header = ({ step, goBack, onOpenFaq }) => (
  <div className="fixed top-0 w-full z-50 px-6 pt-6 pb-4 bg-gradient-to-b from-black via-black/95 to-transparent flex justify-between items-center pointer-events-none">
    <div className="pointer-events-auto">
      {step > 1 ? (
        <button onClick={goBack} className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white active:scale-90 transition-transform hover:bg-white/5">
          <ChevronLeft className="w-5 h-5" />
        </button>
      ) : (
        <div className="flex flex-col animate-enter">
          <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase">Thalyson VIP</span>
          <span className="text-sm font-medium text-gray-300">Discrição & Prazer</span>
        </div>
      )}
    </div>
    <div className="pointer-events-auto flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-full glass-card flex items-center gap-2 border border-green-500/30">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/>
            <span className="text-[10px] font-bold text-green-400">ONLINE</span>
        </div>
        <button onClick={onOpenFaq} className="w-9 h-9 rounded-full glass-card flex items-center justify-center text-gray-400 active:scale-90">
            <HelpCircle className="w-4 h-4" />
        </button>
    </div>
  </div>
);

const DateAndTimeSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const [dates, setDates] = useState([]);
  
  // Lista de horários possíveis
  const allSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', 
    '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
  ];

  useEffect(() => {
    const arr = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) { 
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

  // --- LÓGICA DE BLOQUEIO INTELIGENTE ---
  const isSlotBlocked = (slotTime, dateObj) => {
    if (!dateObj) return true;
    const now = new Date();
    const isToday = dateObj.toDateString() === now.toDateString();
    
    if (!isToday) return false; // Dias futuros estão livres

    const [slotHour] = slotTime.split(':').map(Number);
    const currentHour = now.getHours();
    
    // Bloqueia se a hora do slot for menor ou igual a hora atual + margem
    // Ex: Agora é 13:00. Margem 1h. Slot 14:00 (14 <= 13+1) -> Bloqueado.
    return slotHour <= (currentHour + CONFIG.MIN_NOTICE_HOURS); 
  };

  return (
    <div className="animate-enter" style={{animationDelay: '0.1s'}}>
      <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Escolha o Dia</h3>
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar">
        {dates.map((d, i) => {
          const isSel = selectedDate && selectedDate.toDateString() === d.toDateString();
          return (
            <button key={i} onClick={() => onSelect(d, null)} 
              className={`flex flex-col items-center justify-center min-w-[70px] h-[75px] rounded-xl border transition-all ${isSel ? 'bg-blue-600 text-white border-blue-500 scale-105 shadow-lg' : 'glass-btn border-white/5 text-gray-400'}`}>
              <span className={`text-[9px] font-bold mb-1 ${isSel ? 'text-white' : 'text-blue-500'}`}>{getLabel(d)}</span>
              <span className="text-xl font-bold font-mono">{d.getDate()}</span>
            </button>
          )
        })}
      </div>
      
      {selectedDate && (
        <div className="mt-6 animate-enter">
          <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-widest">Horários Disponíveis</h3>
          <div className="grid grid-cols-4 gap-3">
            {allSlots.map(t => {
              const blocked = isSlotBlocked(t, selectedDate);
              return (
                <button 
                  key={t} 
                  disabled={blocked}
                  onClick={() => onSelect(selectedDate, t)} 
                  className={`py-3 rounded-xl text-sm font-bold slot-btn ${selectedTime === t ? 'active' : ''} ${blocked ? 'disabled' : ''}`}
                >
                  {t}
                </button>
              )
            })}
          </div>
          <p className="text-[10px] text-gray-500 mt-3 text-center flex items-center justify-center gap-1">
             <Info className="w-3 h-3"/> Horários passados são bloqueados.
          </p>
        </div>
      )}
    </div>
  )
};

// ==================================================================================
// 4. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [liveMsg, setLiveMsg] = useState(LIVE_STATUS_MSGS[0]);
  const [showFaq, setShowFaq] = useState(false);
  const [toast, setToast] = useState(null); // { msg: '', type: 'error' | 'success' }

  // Estado Geral do Pedido
  const [booking, setBooking] = useState({
    service: null,
    date: null,
    time: null,
    address: { street: '', number: '', complement: '', district: '' },
    extras: { touch: false, aroma: false }
  });

  // Mostra toast por 3 segundos
  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
     setLoading(true); // Simula envio

     const dateStr = booking.date.toLocaleDateString('pt-BR');
     const msg = `*NOVO PEDIDO VIP* 🔒
---------------------------
💆‍♂️ *${booking.service.name}*
📅 ${dateStr} às ${booking.time}
---------------------------
📍 *LOCAL:*
${booking.address.street}, ${booking.address.number}
${booking.address.complement}
${booking.address.district}
---------------------------
*ADICIONAIS:*
🔥 Toque: ${booking.extras.touch ? 'SIM' : 'Não'}
🌿 Aroma: ${booking.extras.aroma ? 'SIM' : 'Não'}
---------------------------
💰 *TOTAL: ${formatMoney(calcTotal())}*
---------------------------
_Aguardo confirmação do terapeuta._`;

     // Delay para parecer processamento real
     setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${CONFIG.WHATSAPP}&text=${encodeURIComponent(msg)}`, '_blank');
        setLoading(false);
        setStep('success'); // Tela de Sucesso antes de resetar
        
        // Reseta tudo após 4 segundos
        setTimeout(() => {
            setBooking({ service: null, date: null, time: null, address: { street: '', number: '', complement: '', district: '' }, extras: { touch: false, aroma: false } });
            setStep(1);
        }, 4000);
     }, 1500);
  };

  const validateAddress = () => {
      if(booking.address.street.length < 3) return showToast("Digite o nome da rua");
      if(booking.address.number.length < 1) return showToast("Digite o número");
      if(booking.address.district.length < 3) return showToast("Digite o bairro");
      setStep(4);
  }

  // --- RENDERS ---

  if(loading && step !== 'success') return (
    <div className="h-screen bg-black flex flex-col items-center justify-center fixed inset-0 z-[100]">
      <style>{styles}</style>
      <div className="w-16 h-16 border-4 border-blue-600/30 border-t-blue-500 rounded-full animate-spin mb-6"/>
      <span className="text-[12px] tracking-[0.3em] font-bold text-blue-500 animate-pulse">CARREGANDO...</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-24 w-full max-w-md mx-auto relative">
      <style>{styles}</style>
      <div className="ambient-bg" />
      
      {toast && <Toast msg={toast.msg} type={toast.type} />}

      {/* Tela de Sucesso Pós-Envio */}
      {step === 'success' ? (
          <div className="h-screen flex flex-col items-center justify-center px-6 text-center animate-enter">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                  <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h2>
              <p className="text-gray-400 text-sm">Verifique seu WhatsApp para confirmar.<br/>Redirecionando para o início...</p>
          </div>
      ) : (
        <>
            <Header step={step} goBack={() => setStep(s => s-1)} onOpenFaq={() => setShowFaq(true)} />

            {/* --- PASSO 1: VITRINE --- */}
            {step === 1 && (
                <div className="px-6 pt-24 pb-10">
                <div className="mb-6 animate-enter">
                    <h1 className="text-3xl font-bold text-white leading-tight">Sua jornada de <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">prazer começa aqui.</span></h1>
                    <p className="text-gray-400 text-sm mt-2">Sigilo absoluto e atendimento exclusivo.</p>
                </div>

                {/* Live Ticker */}
                <div className="flex justify-center mb-8 animate-enter">
                    <div className="glass-card px-4 py-2 rounded-full flex items-center gap-2 border border-blue-500/20 shadow-lg">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"/>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wide">{liveMsg}</span>
                    </div>
                </div>

                <div className="space-y-8 mb-10">
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

                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest pl-1">Avaliações Reais</h3>
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

            {/* --- PASSO 2: DATA & EXTRAS --- */}
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

            {/* --- PASSO 3: LOCALIZAÇÃO (COM VALIDAÇÃO) --- */}
            {step === 3 && (
                <div className="px-6 pt-24 pb-10">
                <h2 className="text-2xl font-bold mb-6 animate-enter">Localização</h2>
                
                <div className="animate-enter space-y-4">
                    <div className="glass-card p-5 rounded-2xl border-l-4 border-blue-600">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="text-blue-500 w-5 h-5" />
                            <h3 className="font-bold text-white">Onde irei te atender?</h3>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Rua / Avenida</label>
                                <input 
                                    value={booking.address.street} 
                                    onChange={e => setBooking(p => ({...p, address: {...p.address, street: e.target.value}}))} 
                                    className={`input-field ${booking.address.street.length > 0 && booking.address.street.length < 3 ? 'input-error' : ''}`}
                                    placeholder="Ex: Av. Navarro de Andrade"
                                />
                            </div>
                            <div className="flex gap-3">
                                <div className="w-1/3">
                                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Número</label>
                                <input 
                                    value={booking.address.number} 
                                    onChange={e => setBooking(p => ({...p, address: {...p.address, number: e.target.value}}))} 
                                    className="input-field" 
                                    placeholder="123"
                                    type="tel"
                                />
                                </div>
                                <div className="flex-1">
                                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Comp. (Apto/Bloco)</label>
                                <input 
                                    value={booking.address.complement} 
                                    onChange={e => setBooking(p => ({...p, address: {...p.address, complement: e.target.value}}))} 
                                    className="input-field" 
                                    placeholder="Opcional"
                                />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Cidade / Bairro</label>
                                <input 
                                    value={booking.address.district} 
                                    onChange={e => setBooking(p => ({...p, address: {...p.address, district: e.target.value}}))} 
                                    className="input-field" 
                                    placeholder="Ex: Santa Fé, Centro"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-start gap-2 px-2">
                        <Shield className="w-4 h-4 text-green-500 shrink-0 mt-0.5"/>
                        <p className="text-[10px] text-gray-400">Seu endereço é mantido em sigilo absoluto e deletado do meu sistema após o atendimento.</p>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={validateAddress} 
                        className="w-full py-4 rounded-xl font-bold text-lg flex justify-center items-center gap-2 transition-all action-btn"
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
                    Ao clicar, seu pedido será montado no WhatsApp. Site 100% seguro.
                </p>
                </div>
            )}
        </>
      )}

      {/* --- FAQ MODAL --- */}
      {showFaq && (
          <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-enter" onClick={() => setShowFaq(false)}>
              <div className="bg-[#1C1C1E] border border-white/10 w-full max-w-sm rounded-3xl p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2"><HelpCircle className="text-blue-500"/> Dúvidas</h3>
                      <button onClick={() => setShowFaq(false)}><X className="text-gray-500"/></button>
                  </div>
                  <div className="space-y-4 max-h-[60vh] overflow-y-auto hide-scrollbar">
                      {FAQS.map((f, i) => (
                          <div key={i} className="pb-4 border-b border-white/5 last:border-0">
                              <p className="text-sm font-bold text-white mb-1">{f.q}</p>
                              <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 text-center">
                      <p className="text-[10px] text-gray-500">Toque fora para fechar</p>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
}
