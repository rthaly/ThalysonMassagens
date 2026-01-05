import { useState, useEffect } from 'react';
import { 
  ChevronRight, Calendar, MapPin, Clock, Check, 
  X, User, Sparkles, Phone, ArrowRight, Star
} from 'lucide-react';

// ==================================================================================
// 1. ESTILOS GLOBAIS (Minimalista & Premium)
// ==================================================================================
const styles = `
  * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
  body { 
    background-color: #000; color: #fff; 
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    overscroll-behavior-y: none;
  }
  .app-container {
    max-width: 420px; margin: 0 auto; min-height: 100vh;
    background: radial-gradient(circle at top right, #1a1a1a, #000);
    position: relative; overflow-x: hidden;
  }
  .glass-card {
    background: rgba(28, 28, 30, 0.6);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
  }
  .btn-primary {
    background: #0A84FF; color: white; border: none;
    font-weight: 600; transition: transform 0.1s;
  }
  .btn-primary:active { transform: scale(0.97); }
  .anim-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  input { outline: none; }
`;

// ==================================================================================
// 2. DADOS DO SISTEMA
// ==================================================================================

const SERVICES = [
  { id: 'masculina', name: 'Massagem Masculina', price: 150, time: '60 min', desc: 'Relaxamento muscular e finalização tântrica.' },
  { id: 'relaxante', name: 'Massagem Relaxante', price: 120, priceDiscount: 100, time: '50 min', desc: 'Tira dores e tensão do corpo todo.' },
  { id: 'tantrica', name: 'Tântrica Real', price: 200, time: '90 min', desc: 'Experiência sensorial completa e intensa.' }
];

const LOCATIONS = [
  { id: 'suite', name: 'Suíte (Motel)', tax: 70, detail: 'Taxa da suíte inclusa' },
  { id: 'local', name: 'Seu Local (Santa Fé)', tax: 20, detail: 'Taxa de deslocamento' },
  { id: 'outras', name: 'Outras Cidades', tax: 0, detail: 'Valor a combinar no Zap' }
];

const WELCOME_COUPON = { code: 'PRIMEIRA_VEZ', discount: 20, label: 'R$ 20,00 OFF' };

// ==================================================================================
// 3. COMPONENTE PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  // --- ESTADOS ---
  const [step, setStep] = useState('loading'); // loading, login, home, checkout, success
  const [user, setUser] = useState(null);
  const [couponActive, setCouponActive] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  
  // Carrinho
  const [booking, setBooking] = useState({
    service: null,
    location: null,
    date: null,
    time: null,
    address: ''
  });

  // --- LÓGICA DE INICIALIZAÇÃO E "LOGIN" ---
  useEffect(() => {
    // Simula verificação de banco de dados local
    const savedUser = localStorage.getItem('thaly_user_v1');
    setTimeout(() => {
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setStep('home');
      } else {
        setStep('login');
      }
    }, 1000);
  }, []);

  // Verifica se deve oferecer o cupom assim que entrar na Home
  useEffect(() => {
    if (step === 'home' && user) {
      // Se o usuário nunca usou o cupom e ainda não o ativou
      if (!user.hasUsedWelcomeCoupon && !couponActive) {
        setTimeout(() => setShowCouponModal(true), 500);
      }
    }
  }, [step, user]);

  // --- FUNÇÕES ---

  const handleLogin = (name, phone) => {
    if (!name || !phone) return alert("Preencha todos os campos.");
    
    const newUser = { 
      name, 
      phone, 
      id: Date.now(), 
      hasUsedWelcomeCoupon: false // Flag importante
    };
    
    localStorage.setItem('thaly_user_v1', JSON.stringify(newUser));
    setUser(newUser);
    setStep('home');
  };

  const applyCoupon = () => {
    setCouponActive(true);
    setShowCouponModal(false);
  };

  const handleBookingConfirm = () => {
    // Calcular totais
    const servicePrice = booking.service.price;
    const tax = booking.location.tax;
    const discount = couponActive ? WELCOME_COUPON.discount : 0;
    const total = servicePrice + tax - discount;

    // Gerar mensagem do WhatsApp
    const msg = `*NOVO AGENDAMENTO VIA APP* 📅
    
👤 *Cliente:* ${user.name}
📱 *Tel:* ${user.phone}

💆 *Serviço:* ${booking.service.name} (${booking.service.time})
💰 *Valor Base:* R$ ${servicePrice},00

📍 *Local:* ${booking.location.name}
🚗 *Taxa Local:* ${tax > 0 ? `R$ ${tax},00` : 'A combinar'}
${booking.address ? `🏠 *Endereço:* ${booking.address}` : ''}

📅 *Data:* ${booking.date} às ${booking.time}

${couponActive ? `🎟 *CUPOM APLICADO:* -R$ ${WELCOME_COUPON.discount},00` : ''}
---------------------------
*TOTAL FINAL: R$ ${total},00*`;

    // Atualizar usuário (Queimar o cupom)
    if (couponActive) {
      const updatedUser = { ...user, hasUsedWelcomeCoupon: true };
      setUser(updatedUser);
      localStorage.setItem('thaly_user_v1', JSON.stringify(updatedUser));
    }

    // Enviar
    const link = `https://wa.me/5517991360413?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
    setStep('success');
  };

  const resetFlow = () => {
    setBooking({ service: null, location: null, date: null, time: null, address: '' });
    setCouponActive(false); // Reseta o cupom da sessão atual
    setStep('home');
  };

  const handleLogout = () => {
    if(confirm("Sair desconectará sua conta.")) {
        localStorage.removeItem('thaly_user_v1');
        window.location.reload();
    }
  }

  // --- RENDERIZAÇÃO ---

  if (step === 'loading') return (
    <div className="h-screen bg-black flex items-center justify-center">
        <style>{styles}</style>
        <div className="animate-pulse text-[#0A84FF] font-bold tracking-widest">CARREGANDO...</div>
    </div>
  );

  return (
    <div className="app-container font-sans text-gray-200">
      <style>{styles}</style>

      {/* HEADER FIXO */}
      <div className="p-6 flex justify-between items-center bg-black/50 backdrop-blur-md sticky top-0 z-20">
        <h1 className="font-bold text-lg text-white">Thalyson<span className="text-[#0A84FF]">Massagens</span></h1>
        {user && <button onClick={handleLogout} className="text-xs text-gray-500 underline">Sair</button>}
      </div>

      {/* --- TELA 1: LOGIN (SIMPLIFICADO) --- */}
      {step === 'login' && <LoginScreen onLogin={handleLogin} />}

      {/* --- TELA 2: HOME / SELEÇÃO --- */}
      {step === 'home' && (
        <div className="p-6 pb-32 anim-up">
          {/* USER WELCOME */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Olá, {user.name.split(' ')[0]} 👋</h2>
            <p className="text-gray-400 text-sm">Pronto para relaxar hoje?</p>
          </div>

          {/* INDICADOR DE CUPOM ATIVO */}
          {couponActive && (
             <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center gap-3 text-green-400 text-sm font-bold animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Desconto de {WELCOME_COUPON.label} ativado!</span>
             </div>
          )}

          {/* LISTA DE SERVIÇOS */}
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Escolha o Serviço</h3>
          <div className="space-y-4">
            {SERVICES.map(srv => (
              <div key={srv.id} onClick={() => { setBooking({...booking, service: srv}); setStep('checkout'); }}
                className="glass-card p-5 active:scale-95 transition-all cursor-pointer relative overflow-hidden group">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lg text-white">{srv.name}</h4>
                  <span className="text-[#0A84FF] font-bold">R$ {srv.price}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{srv.desc}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                  <Clock className="w-3 h-3" /> {srv.time}
                </div>
                {/* Visual Flair */}
                <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#0A84FF]/10 rounded-full blur-xl group-hover:bg-[#0A84FF]/20 transition-all"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TELA 3: CHECKOUT / DETALHES --- */}
      {step === 'checkout' && (
        <div className="p-6 pb-32 anim-up min-h-screen flex flex-col">
          <button onClick={() => setStep('home')} className="mb-4 text-sm text-gray-500 flex items-center gap-1 hover:text-white"><ArrowRight className="w-4 h-4 rotate-180"/> Voltar</button>
          
          <h2 className="text-2xl font-bold text-white mb-6">Finalizar Agendamento</h2>

          <div className="space-y-6 flex-1">
            {/* SERVIÇO SELECIONADO */}
            <div className="glass-card p-4 border-l-4 border-l-[#0A84FF]">
               <span className="text-xs text-gray-500 uppercase font-bold">Serviço</span>
               <div className="flex justify-between items-center">
                 <span className="text-white font-bold">{booking.service.name}</span>
                 <span className="text-[#0A84FF]">R$ {booking.service.price}</span>
               </div>
            </div>

            {/* LOCAL */}
            <div>
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Onde será?</h3>
               <div className="space-y-2">
                 {LOCATIONS.map(loc => (
                    <button key={loc.id} onClick={() => setBooking({...booking, location: loc, address: ''})}
                      className={`w-full p-4 rounded-xl text-left border transition-all ${booking.location?.id === loc.id ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#1c1c1e] border-white/5 text-gray-400'}`}>
                      <div className="flex justify-between">
                        <span className="font-bold">{loc.name}</span>
                        <span className="text-xs opacity-70 mt-0.5">{loc.tax > 0 ? `+ R$ ${loc.tax}` : 'Grátis'}</span>
                      </div>
                    </button>
                 ))}
               </div>
               
               {booking.location?.id === 'local' && (
                  <input 
                    placeholder="Digite seu Endereço e Bairro"
                    className="mt-3 w-full bg-[#1C1C1E] text-white p-4 rounded-xl border border-white/10 focus:border-[#0A84FF] transition-colors"
                    onChange={(e) => setBooking({...booking, address: e.target.value})}
                  />
               )}
            </div>

            {/* DATA SIMPLIFICADA */}
            <div>
               <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Quando?</h3>
               <div className="grid grid-cols-2 gap-3 mb-3">
                 <input type="date" className="bg-[#1C1C1E] text-white p-3 rounded-xl border border-white/10 uppercase" 
                    onChange={(e) => setBooking({...booking, date: e.target.value})} />
                 <input type="time" className="bg-[#1C1C1E] text-white p-3 rounded-xl border border-white/10" 
                    onChange={(e) => setBooking({...booking, time: e.target.value})} />
               </div>
            </div>
          </div>

          {/* RESUMO DE VALORES */}
          <div className="mt-8 pt-4 border-t border-white/10">
             <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Serviço</span>
                <span>R$ {booking.service.price}</span>
             </div>
             {booking.location && booking.location.tax > 0 && (
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Taxa Local</span>
                    <span>R$ {booking.location.tax}</span>
                </div>
             )}
             {couponActive && (
                <div className="flex justify-between text-sm text-green-400 mb-2 font-bold">
                    <span>Cupom ({WELCOME_COUPON.code})</span>
                    <span>- R$ {WELCOME_COUPON.discount}</span>
                </div>
             )}
             
             <div className="flex justify-between items-end mt-4">
                <span className="text-white font-bold text-lg">Total</span>
                <span className="text-[#0A84FF] font-bold text-2xl">
                    R$ {(booking.service.price + (booking.location?.tax || 0) - (couponActive ? WELCOME_COUPON.discount : 0))}
                </span>
             </div>

             <button 
                disabled={!booking.date || !booking.time || !booking.location}
                onClick={handleBookingConfirm}
                className="w-full mt-6 btn-primary py-4 rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:shadow-none">
                Confirmar no WhatsApp
             </button>
          </div>
        </div>
      )}

      {/* --- TELA 4: SUCESSO --- */}
      {step === 'success' && (
        <div className="h-screen flex flex-col items-center justify-center p-6 text-center anim-up">
           <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
              <Check className="w-10 h-10 text-white" />
           </div>
           <h2 className="text-2xl font-bold text-white mb-2">Pedido Enviado!</h2>
           <p className="text-gray-400 mb-8">Verifique seu WhatsApp para confirmar o pagamento.</p>
           <button onClick={resetFlow} className="text-[#0A84FF] font-bold">Voltar ao Início</button>
        </div>
      )}

      {/* --- MODAL DE CUPOM --- */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
           <div className="bg-[#1C1C1E] border border-[#0A84FF]/30 w-full max-w-sm rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(10,132,255,0.2)] anim-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0A84FF] to-purple-500"></div>
              <Sparkles className="w-12 h-12 text-[#FFD60A] mx-auto mb-4 animate-spin-slow" />
              <h2 className="text-2xl font-bold text-white mb-2">Presente Exclusivo!</h2>
              <p className="text-gray-400 text-sm mb-6">Como é sua primeira vez aqui, liberamos um desconto especial para você usar <b>AGORA</b>.</p>
              
              <div className="bg-white/5 p-4 rounded-xl mb-6 border border-dashed border-white/20">
                 <span className="block text-xs text-gray-500 uppercase tracking-widest mb-1">Cupom</span>
                 <span className="text-2xl font-mono font-bold text-[#0A84FF]">{WELCOME_COUPON.code}</span>
                 <span className="block text-sm text-white mt-1 font-bold">R$ 20,00 OFF</span>
              </div>

              <button onClick={applyCoupon} className="w-full btn-primary py-3.5 rounded-xl mb-3 shadow-lg">
                 RESGATAR AGORA
              </button>
              <button onClick={() => setShowCouponModal(false)} className="text-xs text-gray-500 hover:text-white transition-colors">
                 Não quero desconto
              </button>
           </div>
        </div>
      )}

    </div>
  );
}

// Subcomponente de Login
function LoginScreen({ onLogin }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <div className="p-8 h-full flex flex-col justify-center pt-32 anim-up">
            <div className="mb-8">
                <div className="w-12 h-12 bg-[#0A84FF] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
                    <User className="w-6 h-6 text-white"/>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Bem-vindo.</h1>
                <p className="text-gray-400">Identifique-se para acessar a agenda.</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Seu Nome</label>
                    <div className="glass-card flex items-center px-4 py-3">
                        <User className="w-5 h-5 text-gray-500 mr-3"/>
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Como gosta de ser chamado?" className="bg-transparent w-full text-white placeholder-gray-600"/>
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Whatsapp</label>
                    <div className="glass-card flex items-center px-4 py-3">
                        <Phone className="w-5 h-5 text-gray-500 mr-3"/>
                        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="bg-transparent w-full text-white placeholder-gray-600"/>
                    </div>
                </div>
            </div>

            <button onClick={() => onLogin(name, phone)} className="mt-8 w-full btn-primary py-4 rounded-xl text-lg shadow-lg flex items-center justify-center gap-2">
                Entrar <ChevronRight className="w-5 h-5"/>
            </button>
            <p className="text-center text-[10px] text-gray-600 mt-6">Seus dados ficam salvos apenas neste dispositivo.</p>
        </div>
    )
}
