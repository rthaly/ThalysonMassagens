import React, { useState, useEffect } from 'react';
import {
  Check, Star, ArrowRight, MessageCircle, Ticket, Flame, Wind, 
  Clock, Calendar, MapPin, ChevronLeft, AlertTriangle, 
  Shield, Zap, Menu, X, Gift, Wallet, User, Copy, 
  Navigation, Building, BedDouble, Trash2, Heart, Smile
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES DO NEGÓCIO (EDITÁVEIS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", // Seu WhatsApp
  PIX_KEY: "62922530000144",
  APP_NAME: "Thalyson Massagens",
  STORAGE_KEY: '@thalyson_app_v4_system', // Chave para salvar dados no celular do cliente
  XP_PER_REAL: 1, // 1 real = 1 ponto de XP
  XP_TARGET: 300, // A cada 300 pontos ganha cupom
  COUPON_VALUE: 30 // Valor do cupom de fidelidade
};

// ==================================================================================
// 2. TEXTOS PERSUASIVOS E ACOLHEDORES (COPYWRITING)
// ==================================================================================

const TEXTS = {
  welcome: "Olá, vamos renovar suas energias?",
  subtitle: "Massagem humanizada, feita com calma e atenção plena em você.",
  
  placeholder_name: "Como prefiro ser chamado...",
  label_name: "Seu Nome",
  
  // Categorias
  cat_choice: "Qual experiência você busca hoje?",
  
  // Serviços
  svc_comp_name: "Experiência Completa (1h)",
  svc_comp_badge: "A MAIS PEDIDA ❤️",
  svc_comp_desc: "O equilíbrio perfeito entre relaxamento físico e conexão sensorial.",
  svc_comp_details: [
    "Massagem no corpo todo para tirar a tensão.",
    "Toque pele com pele (sensitivo e envolvente).",
    "Finalização tântrica manual (Lingam) com óleo aquecido."
  ],
  
  svc_relax_name: "Apenas Relaxar (1h)",
  svc_relax_badge: "TERAPÊUTICA 🍃",
  svc_relax_desc: "Um momento de paz absoluta para desconectar do estresse.",
  svc_relax_details: [
    "Foco 100% em alívio de dores musculares.",
    "Movimentos longos e deslizantes.",
    "Sem toques íntimos, apenas descanso profundo."
  ],

  // Extras (Upsell)
  extras_title: "Personalize seu momento",
  ext_time_label: "Estender Sessão (+30min)",
  ext_time_sub: "Para curtir sem pressa nenhuma.",
  
  ext_touch_label: "Interatividade (Toques em mim)",
  ext_touch_sub: "Você pode tocar e interagir durante a sessão.",
  
  ext_aroma_label: "Aromaterapia",
  ext_aroma_sub: "Óleos essenciais para acalmar a mente.",

  // Local
  loc_title: "Onde será nosso atendimento?",
  btn_home: "No seu Conforto (Casa)",
  btn_hotel: "Hotel",
  btn_motel: "Motel",
  
  // Resumo
  review_title: "Resumo do seu Pedido",
  review_msg: "Tudo certo! Confira os detalhes antes de chamar no Zap.",
  
  // Botões
  btn_next: "Continuar",
  btn_finish: "Confirmar no WhatsApp",
  
  // Fidelidade
  loyalty_title: "Sua Carteira de Pontos",
  loyalty_desc: "A cada relaxamento, você fica mais perto de um presente.",
  coupon_empty: "Você ainda não tem cupons ativos.",
  coupon_use: "USAR CUPOM",
  coupon_active: "CUPOM APLICADO!"
};

// BANCO DE DADOS DE PRODUTOS
const DB = {
  services: [
    { id: 'completa', price: 175, xp: 175, icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
    { id: 'relax', price: 145, xp: 145, icon: Wind, color: 'text-teal-600', bg: 'bg-teal-50' }
  ],
  extras: [
    { id: 'more_time', label: TEXTS.ext_time_label, sub: TEXTS.ext_time_sub, price: 70, icon: Clock },
    { id: 'touch', label: TEXTS.ext_touch_label, sub: TEXTS.ext_touch_sub, price: 63, icon: Heart }, // Valor mantido do seu prompt anterior
    { id: 'aroma', label: TEXTS.ext_aroma_label, sub: TEXTS.ext_aroma_sub, price: 5, icon: Smile }
  ]
};

// ==================================================================================
// 3. COMPONENTES VISUAIS (DESIGN SYSTEM SIMPLIFICADO)
// ==================================================================================

const Card = ({ children, active, onClick, className = "" }) => (
  <div 
    onClick={onClick}
    className={`relative p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden ${className} 
    ${active ? 'border-green-500 bg-green-50/50 shadow-md transform scale-[1.01]' : 'border-gray-100 bg-white hover:border-gray-200 shadow-sm'}`}
  >
    {children}
    {active && <div className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1 animate-in fade-in zoom-in"><Check size={14} strokeWidth={3}/></div>}
  </div>
);

const Button = ({ children, onClick, disabled, variant = 'primary', icon: Icon, pulse }) => (
  <button 
    onClick={onClick} disabled={disabled}
    className={`w-full h-14 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg
    ${variant === 'primary' 
      ? (disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200') 
      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}
    ${pulse ? 'animate-pulse' : ''}`}
  >
    {children} {Icon && <Icon size={18}/>}
  </button>
);

const Input = ({ label, value, onChange, placeholder, icon: Icon, type="text" }) => (
  <div className="mb-4">
    <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">{label}</label>
    <div className="relative group">
      <input 
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full h-12 rounded-xl border border-gray-200 px-4 pl-11 text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all bg-white"
      />
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />}
    </div>
  </div>
);

// ==================================================================================
// 4. LÓGICA INTELIGENTE (APP)
// ==================================================================================

export default function App() {
  const [step, setStep] = useState(0);
  const [walletOpen, setWalletOpen] = useState(false);
  
  // ESTADO DO USUÁRIO (Persistente)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
      return saved ? JSON.parse(saved) : { name: '', xp: 0, coupons: [] };
    } catch { return { name: '', xp: 0, coupons: [] }; }
  });

  // Salvar dados automaticamente
  useEffect(() => { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(user)); }, [user]);

  // ESTADO DO AGENDAMENTO ATUAL
  const [booking, setBooking] = useState({
    service: null,
    extras: {},
    date: null,
    time: null,
    locationType: 'home', 
    address: { city: '', street: '', number: '', district: '', comp: '', motelName: '', suite: '', hotelName: '', room: '' },
    payment: 'pix',
    appliedCoupon: null
  });

  // HELPERS
  const toggleExtra = (id) => setBooking(prev => ({ ...prev, extras: { ...prev.extras, [id]: !prev.extras[id] } }));
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  // SISTEMA DE CUPONS E PREÇO
  const calculateTotal = () => {
    let total = booking.service?.price || 0;
    Object.keys(booking.extras).forEach(key => {
      if (booking.extras[key]) {
        const extra = DB.extras.find(e => e.id === key);
        if (extra) total += extra.price;
      }
    });
    const discount = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    return { 
      subtotal: total, 
      discount, 
      final: Math.max(0, total - discount) 
    };
  };

  const totals = calculateTotal();

  // FINALIZAR PEDIDO & GERAR ZAP
  const handleFinish = () => {
    // 1. Lógica de Fidelidade (Adicionar XP e Gerar Cupom se bater meta)
    const xpGained = booking.service?.xp || 0;
    const currentXP = user.xp + xpGained;
    let newCoupons = [...user.coupons];
    
    // Se usou cupom, remove da lista
    if (booking.appliedCoupon) {
      newCoupons = newCoupons.filter(c => c.id !== booking.appliedCoupon.id);
    }

    // Se bateu a meta de XP, ganha novo cupom
    if (Math.floor(currentXP / CONFIG.XP_TARGET) > Math.floor(user.xp / CONFIG.XP_TARGET)) {
      newCoupons.push({ 
        id: Date.now(), 
        title: `Fidelidade Nível ${Math.floor(currentXP / CONFIG.XP_TARGET)}`, 
        val: CONFIG.COUPON_VALUE 
      });
    }

    setUser({ ...user, xp: currentXP, coupons: newCoupons });

    // 2. Montar Mensagem WhatsApp
    const svcName = booking.service.id === 'completa' ? "🔥 Experiência Completa" : "🍃 Apenas Relaxar";
    const extrasTxt = Object.keys(booking.extras).filter(k => booking.extras[k]).map(k => {
      const ex = DB.extras.find(e => e.id === k);
      return `+ ${ex.label}`;
    }).join('\n');

    let locTxt = "";
    if (booking.locationType === 'home') locTxt = `🏠 Casa: ${booking.address.street}, ${booking.address.number} - ${booking.address.district}`;
    if (booking.locationType === 'motel') locTxt = `🏩 Motel: ${booking.address.motelName} (Suíte ${booking.address.suite})`;
    if (booking.locationType === 'hotel') locTxt = `🏨 Hotel: ${booking.address.hotelName} (Quarto ${booking.address.room})`;

    const msg = `
*OLÁ THALYSON! QUERO AGENDAR* 👋
------------------------------
👤 *Cliente:* ${user.name}

💆 *${svcName}*
📅 ${new Date(booking.date).toLocaleDateString('pt-BR')} às ${booking.time}

${extrasTxt ? `✨ *Adicionais:*\n${extrasTxt}\n` : ''}
📍 *Cidade:* ${booking.address.city}
${locTxt}

💰 *Resumo Financeiro:*
Serviço: R$ ${totals.subtotal.toFixed(2)}
${booking.appliedCoupon ? `🎟️ Desconto: - R$ ${totals.discount.toFixed(2)}` : ''}
*Total: R$ ${totals.final.toFixed(2)}*

🚗 *Uber:* (Calcular ao confirmar)
💳 *Pagamento:* ${booking.payment.toUpperCase()}
    `.trim();

    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
    
    // Resetar (Opcional)
    alert("Te redirecionei para o WhatsApp! Nos falamos lá.");
    setStep(0);
    setBooking({ ...booking, service: null, date: null, time: null, appliedCoupon: null });
  };

  // NAVEGAÇÃO
  const nextStep = () => { scrollToTop(); setStep(s => s + 1); };
  const prevStep = () => { scrollToTop(); setStep(s => s - 1); };

  // --- COMPONENTES DA UI ---

  // Header Simples e Limpo
  const Header = () => (
    <div className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 z-50 px-5 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {step > 0 && <button onClick={prevStep} className="p-1 rounded-full hover:bg-gray-100"><ChevronLeft/></button>}
        <div>
          <h1 className="font-bold text-gray-800 tracking-tight">{CONFIG.APP_NAME}</h1>
          <div className="h-1 w-24 bg-gray-100 rounded-full mt-1 overflow-hidden">
            <div className="h-full bg-green-500 transition-all duration-500" style={{width: `${(user.xp % CONFIG.XP_TARGET) / CONFIG.XP_TARGET * 100}%`}}></div>
          </div>
        </div>
      </div>
      <button onClick={() => setWalletOpen(true)} className="relative p-2 bg-gray-50 rounded-full border border-gray-100 text-gray-600">
        <Gift size={20}/>
        {user.coupons.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-bounce"></span>}
      </button>
    </div>
  );

  // Modal da Carteira (Fidelidade)
  const WalletModal = () => (
    walletOpen && (
      <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
        <div className="bg-white w-full max-w-sm rounded-3xl p-6 animate-in slide-in-from-bottom-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2"><Wallet className="text-green-600"/> {TEXTS.loyalty_title}</h3>
            <button onClick={() => setWalletOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={16}/></button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-2xl mb-6 border border-gray-100 text-center">
            <p className="text-3xl font-black text-green-600">{user.xp}</p>
            <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Pontos XP</p>
            <p className="text-xs text-gray-500 mt-2">Faltam <span className="font-bold text-gray-800">{CONFIG.XP_TARGET - (user.xp % CONFIG.XP_TARGET)}</span> pontos para ganhar R$ {CONFIG.COUPON_VALUE} OFF.</p>
          </div>

          <div className="space-y-3">
            {user.coupons.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-4">{TEXTS.coupon_empty}</p>
            ) : (
              user.coupons.map(coupon => (
                <div key={coupon.id} className="border border-green-200 bg-green-50 p-4 rounded-xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-green-800">{coupon.title}</p>
                    <p className="text-xs text-green-600 font-bold">Vale R$ {coupon.val},00</p>
                  </div>
                  {booking.appliedCoupon?.id === coupon.id ? (
                    <span className="text-xs font-bold text-green-600 flex items-center gap-1"><Check size={12}/> APLICADO</span>
                  ) : (
                    <button 
                      onClick={() => { setBooking({...booking, appliedCoupon: coupon}); setWalletOpen(false); }}
                      className="bg-green-600 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm active:scale-95 transition-transform"
                    >
                      {TEXTS.coupon_use}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-gray-800 font-sans pb-32 selection:bg-green-100">
      <Header />
      <WalletModal />

      <main className="pt-24 px-5 max-w-md mx-auto">
        
        {/* PASSO 1: BOAS VINDAS E SERVIÇO */}
        {step === 0 && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold mb-2">{TEXTS.welcome}</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">{TEXTS.subtitle}</p>

            <Input 
              label={TEXTS.label_name} 
              icon={User} 
              placeholder={TEXTS.placeholder_name} 
              value={user.name} 
              onChange={e => setUser({...user, name: e.target.value})} 
            />

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8">{TEXTS.cat_choice}</p>

            <div className="space-y-5">
              {DB.services.map(svc => (
                <Card 
                  key={svc.id} 
                  active={booking.service?.id === svc.id} 
                  onClick={() => setBooking({ ...booking, service: svc })}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-3 rounded-xl ${svc.bg} ${svc.color}`}><svc.icon size={24}/></div>
                    {svc.id === 'completa' && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-red-200 shadow-lg">{TEXTS.svc_comp_badge}</span>}
                  </div>
                  <h3 className="text-lg font-bold mb-1">{svc.id === 'completa' ? TEXTS.svc_comp_name : TEXTS.svc_relax_name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{svc.id === 'completa' ? TEXTS.svc_comp_desc : TEXTS.svc_relax_desc}</p>
                  <ul className="space-y-2 mb-4">
                    {(svc.id === 'completa' ? TEXTS.svc_comp_details : TEXTS.svc_relax_details).map((d, i) => (
                      <li key={i} className="flex gap-2 text-xs text-gray-600"><Check size={14} className="text-green-500 shrink-0"/> {d}</li>
                    ))}
                  </ul>
                  <p className="font-bold text-lg text-gray-900">R$ {svc.price}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* PASSO 2: EXTRAS E DATA */}
        {step === 1 && (
          <div className="animate-in slide-in-from-right-10 duration-300">
            <h2 className="text-xl font-bold mb-6">{TEXTS.extras_title}</h2>
            
            <div className="space-y-3 mb-10">
              {DB.extras.map(extra => (
                <div 
                  key={extra.id} 
                  onClick={() => toggleExtra(extra.id)}
                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${booking.extras[extra.id] ? 'border-green-500 bg-green-50' : 'border-gray-100 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${booking.extras[extra.id] ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <extra.icon size={18}/>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{extra.label}</p>
                      <p className="text-xs text-gray-500">{extra.sub}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${booking.extras[extra.id] ? 'text-green-600' : 'text-gray-400'}`}>+R$ {extra.price}</p>
                </div>
              ))}
            </div>

            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Escolha a Data</p>
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-5 px-5">
              {[...Array(10)].map((_, i) => {
                const d = new Date(); d.setDate(d.getDate() + i);
                const isSelected = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                return (
                  <button 
                    key={i} onClick={() => setBooking({...booking, date: d, time: null})}
                    className={`min-w-[70px] h-[85px] rounded-2xl border flex flex-col items-center justify-center transition-all flex-shrink-0 ${isSelected ? 'bg-gray-900 text-white border-gray-900 scale-105 shadow-lg' : 'bg-white border-gray-200 text-gray-400'}`}
                  >
                    <span className="text-[10px] font-bold uppercase">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                    <span className="text-2xl font-bold">{d.getDate()}</span>
                  </button>
                )
              })}
            </div>

            {booking.date && (
              <div className="mt-6 animate-in fade-in">
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Escolha o Horário</p>
                 <div className="grid grid-cols-4 gap-2">
                   {['09:00','10:00','11:00','13:00','14:00','16:00','18:00','20:00'].map(t => (
                     <button 
                      key={t} onClick={() => setBooking({...booking, time: t})}
                      className={`py-3 rounded-xl text-xs font-bold border transition-all ${booking.time === t ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white border-gray-200 hover:border-green-400 text-gray-700'}`}
                     >
                       {t}
                     </button>
                   ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* PASSO 3: LOCAL E PAGAMENTO */}
        {step === 2 && (
          <div className="animate-in slide-in-from-right-10 duration-300">
            <h2 className="text-xl font-bold mb-1">{TEXTS.loc_title}</h2>
            <p className="text-gray-500 text-xs mb-6">Calcularei o Uber com base nisso.</p>

            <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
              {[
                {id: 'home', label: TEXTS.btn_home}, 
                {id: 'motel', label: TEXTS.btn_motel}, 
                {id: 'hotel', label: TEXTS.btn_hotel}
              ].map(loc => (
                <button 
                  key={loc.id} onClick={() => setBooking({...booking, locationType: loc.id})}
                  className={`flex-1 py-3 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${booking.locationType === loc.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-8">
              <Input label="Cidade" icon={MapPin} value={booking.address.city} onChange={e => setBooking({...booking, address: {...booking.address, city: e.target.value}})} placeholder="Ex: São Paulo" />
              
              {booking.locationType === 'home' && (
                <>
                  <Input label="Rua / Avenida" icon={Navigation} value={booking.address.street} onChange={e => setBooking({...booking, address: {...booking.address, street: e.target.value}})} />
                  <div className="flex gap-3">
                    <div className="w-1/3"><Input label="Número" type="tel" value={booking.address.number} onChange={e => setBooking({...booking, address: {...booking.address, number: e.target.value}})} /></div>
                    <div className="w-2/3"><Input label="Bairro" value={booking.address.district} onChange={e => setBooking({...booking, address: {...booking.address, district: e.target.value}})} /></div>
                  </div>
                </>
              )}
              
              {booking.locationType === 'motel' && (
                <>
                  <Input label="Nome do Motel" icon={Building} value={booking.address.motelName} onChange={e => setBooking({...booking, address: {...booking.address, motelName: e.target.value}})} />
                  <Input label="Número da Suíte" icon={BedDouble} type="tel" value={booking.address.suite} onChange={e => setBooking({...booking, address: {...booking.address, suite: e.target.value}})} />
                </>
              )}

               {booking.locationType === 'hotel' && (
                <>
                  <Input label="Nome do Hotel" icon={Building} value={booking.address.hotelName} onChange={e => setBooking({...booking, address: {...booking.address, hotelName: e.target.value}})} />
                  <Input label="Número do Quarto" icon={BedDouble} type="tel" value={booking.address.room} onChange={e => setBooking({...booking, address: {...booking.address, room: e.target.value}})} />
                </>
              )}
            </div>

            {/* Ticket de Resumo */}
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-6 relative">
              <div className="absolute -left-3 top-1/2 w-6 h-6 bg-[#FDFDFD] rounded-full"></div>
              <div className="absolute -right-3 top-1/2 w-6 h-6 bg-[#FDFDFD] rounded-full"></div>
              
              <h3 className="text-center font-bold uppercase text-gray-400 text-xs tracking-widest mb-4">{TEXTS.review_title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between"><span>{booking.service?.id === 'completa' ? 'Experiência Completa' : 'Relax'}</span><span>R$ {booking.service?.price}</span></div>
                {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => (
                  <div key={k} className="flex justify-between text-gray-500"><span>+ {DB.extras.find(e=>e.id===k).label}</span><span>R$ {DB.extras.find(e=>e.id===k).price}</span></div>
                ))}
                {booking.appliedCoupon && (
                   <div className="flex justify-between text-green-600 font-bold bg-green-50 p-2 rounded-lg mt-2">
                     <span className="flex items-center gap-1"><Ticket size={12}/> {booking.appliedCoupon.title}</span>
                     <span>- R$ {booking.appliedCoupon.val}</span>
                   </div>
                )}
              </div>

              <div className="border-t pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">Total Estimado</span>
                <span className="font-black text-2xl text-gray-900">R$ {totals.final.toFixed(2)}</span>
              </div>
              
              {!booking.appliedCoupon && (
                <button onClick={() => setWalletOpen(true)} className="w-full mt-4 text-xs font-bold text-green-600 border border-green-200 bg-green-50 py-2 rounded-lg hover:bg-green-100 transition-colors">
                  TEM CUPOM? CLIQUE AQUI
                </button>
              )}
            </div>
            
            <div className="mt-8 mb-4">
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Forma de Pagamento</p>
               <div className="flex gap-2">
                 {['pix','cartão','dinheiro'].map(p => (
                   <button key={p} onClick={()=>setBooking({...booking, payment: p})} className={`flex-1 py-3 text-xs font-bold uppercase rounded-xl border ${booking.payment === p ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'}`}>{p}</button>
                 ))}
               </div>
            </div>

          </div>
        )}

      </main>

      {/* FOOTER FIXO */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur border-t border-gray-100 p-5 z-40 safe-area-bottom">
        {step === 0 && <Button onClick={nextStep} disabled={!user.name || !booking.service} icon={ArrowRight} pulse>{TEXTS.btn_next}</Button>}
        {step === 1 && <Button onClick={nextStep} disabled={!booking.date || !booking.time} icon={ArrowRight}>{TEXTS.btn_next}</Button>}
        {step === 2 && <Button onClick={handleFinish} disabled={!booking.address.city} icon={MessageCircle} variant="primary" pulse>{TEXTS.btn_finish}</Button>}
      </div>

      <style>{`
        .safe-area-bottom { padding-bottom: env(safe-area-inset-bottom); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
