import React, { useState, useEffect, useRef } from 'react';
import {
  Camera, Calendar, Clock, User, Instagram, 
  Check, X, MessageCircle, Play, Star,
  ShieldCheck, Sparkles, Loader2, Menu, 
  Zap, Film, ChevronDown, ArrowRight
} from 'lucide-react';

/**
 * ==================================================================================
 * LUMINA GLASS OS - APPLE 2026 AESTHETIC
 * ==================================================================================
 * Design System: "Deep Glass"
 * Tipografia: Inter (Moderna, Limpa, Legível)
 * Cores: Platinum, Obsidian, Translucent White
 */

// --- CONFIGURAÇÃO & CONTEÚDO (100% PORTUGUÊS) ---

const CONFIG = {
  PHONE: "5517991360413", 
  CURRENCY: 'R$',
  BRAND: "Lumina Studio"
};

const DATA = {
  // VÍDEO HERO: Moda/Estúdio em movimento suave (Alta qualidade)
  heroVideo: "https://videos.pexels.com/video-files/5309381/5309381-hd_1920_1080_25fps.mp4",
  
  services: [
    {
      id: 'foto-pessoal',
      category: 'FOTOGRAFIA',
      title: "Ensaio Pessoal Premium",
      price: 490,
      duration: "1 Hora",
      desc: "Ideal para renovar seu perfil profissional e redes sociais com autoridade.",
      features: ["10 Fotos Editadas (Alto Nível)", "Direção de Poses Completa", "1 Look"],
      highlight: false
    },
    {
      id: 'foto-moda',
      category: 'FOTOGRAFIA',
      title: "Experiência Vogue",
      price: 990,
      duration: "2 Horas",
      desc: "Sinta-se em um editorial de revista. Iluminação de cinema e produção artística.",
      features: ["30 Fotos Fine Art", "3 Trocas de Look", "Vídeo de Bastidores (15s)"],
      highlight: true
    },
    {
      id: 'video-reels',
      category: 'VIDEO MAKER',
      title: "Produção de Reels Viral",
      price: 590,
      duration: "1.5 Horas",
      desc: "Vídeos dinâmicos verticais para TikTok e Instagram. Edição com cortes rápidos e música.",
      features: ["3 Vídeos Verticais (Reels)", "Roteiro Estratégico", "Captação 4K"],
      highlight: false
    },
    {
      id: 'video-campanha',
      category: 'VIDEO MAKER',
      title: "Filme Publicitário",
      price: 2200,
      duration: "4 Horas",
      desc: "Um comercial completo para sua marca. Narrativa cinematográfica e drone.",
      features: ["Filme Completo (60s)", "Imagens Aéreas (Drone)", "Entrevistas"],
      highlight: true
    }
  ],

  portfolio: [
    { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80", cat: "Retrato" },
    { src: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80", cat: "Cinema" },
    { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80", cat: "Moda" },
    { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80", cat: "Masculino" }
  ]
};

// --- COMPONENTES UI "GLASS" ---

const GlassCard = ({ children, className = "", hoverEffect = false }: any) => (
  <div className={`
    relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl
    bg-white/5 backdrop-blur-2xl transition-all duration-500
    ${hoverEffect ? 'hover:bg-white/10 hover:border-white/20 hover:scale-[1.01]' : ''}
    ${className}
  `}>
    {/* Brilho interno sutil */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', full, onClick, disabled }: any) => {
  const base = "h-14 rounded-2xl font-semibold tracking-wide transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group active:scale-95";
  const styles: any = {
    primary: "bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    glass: "bg-white/10 text-white border border-white/10 hover:bg-white/20 backdrop-blur-md",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#1ebc57] shadow-[0_0_20px_rgba(37,211,102,0.4)]"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${full ? 'w-full' : 'px-8'}`}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
};

// --- ANIMAÇÃO DE FUNDO (AURORA) ---
const AuroraBackground = () => (
  <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050505]">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] animate-blob"></div>
    <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-blob animation-delay-4000"></div>
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [booking, setBooking] = useState({
    serviceId: '',
    date: null as Date | null,
    time: null as string | null,
    name: ''
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const selectedService = DATA.services.find(s => s.id === booking.serviceId);

  const handleScroll = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
  };

  const enviarWhatsapp = () => {
    if(!selectedService || !booking.date || !booking.time || !booking.name) return;
    const dateStr = booking.date.toLocaleDateString('pt-BR');
    const msg = `Olá! Meu nome é *${booking.name}*.\nGostaria de agendar: *${selectedService.title}* (${selectedService.category})\nPara o dia: ${dateStr} às ${booking.time}.\nValor: R$ ${selectedService.price}. Aguardo confirmação!`;
    window.open(`https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <Loader2 size={40} className="text-white animate-spin mb-4"/>
      <p className="text-white/50 text-xs uppercase tracking-[0.3em] animate-pulse">Carregando Experiência</p>
    </div>
  );

  return (
    <div className="relative text-white font-sans selection:bg-white/30 min-h-screen">
      
      <AuroraBackground />

      {/* --- MENU FLUTUANTE DE VIDRO --- */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg">
        <GlassCard className="flex items-center justify-between px-6 py-4 !rounded-full bg-black/40 backdrop-blur-xl border-white/10">
          <span className="font-bold text-lg tracking-tight">Lumina</span>
          <div className="hidden md:flex items-center gap-6">
            {['Home', 'Serviços', 'Portfolio', 'Agendar'].map(item => (
              <button 
                key={item} 
                onClick={() => handleScroll(item.toLowerCase() === 'home' ? 'hero' : item.toLowerCase())}
                className="text-xs font-medium text-white/70 hover:text-white transition-colors uppercase tracking-wider"
              >
                {item}
              </button>
            ))}
          </div>
          <button className="md:hidden text-white"><Menu size={20}/></button>
        </GlassCard>
      </nav>

      {/* --- HERO SECTION (VÍDEO) --- */}
      <section id="hero" className="relative h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Vídeo de Fundo */}
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-60">
            <source src={DATA.heroVideo} type="video/mp4" />
          </video>
          {/* Gradiente para o texto aparecer bem */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-3xl space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium uppercase tracking-widest text-white/90">
            <Sparkles size={12} className="text-yellow-200" /> Disponível para 2026
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white drop-shadow-2xl">
            Sua Imagem <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">Cinematográfica</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto leading-relaxed">
            Fotografia High-End e Produção de Vídeo. <br/>
            Eleve sua autoridade com visuais que impressionam.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button onClick={() => handleScroll('serviços')}>
              Ver Experiências <ChevronDown size={18}/>
            </Button>
            <Button variant="glass" onClick={() => handleScroll('portfolio')}>
              Ver Portfolio <ArrowRight size={18}/>
            </Button>
          </div>
        </div>
      </section>

      {/* --- SERVIÇOS (VIDRO CRISTALINO) --- */}
      <section id="serviços" className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Escolha sua Experiência</h2>
            <p className="text-white/50">Pacotes desenhados para impacto máximo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DATA.services.map((service) => (
              <GlassCard 
                key={service.id} 
                hoverEffect={true}
                className={`p-8 md:p-10 flex flex-col ${service.highlight ? 'border-white/30 bg-white/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-[10px] font-bold uppercase tracking-widest text-white/80">
                    {service.category}
                  </span>
                  {service.highlight && <Star size={20} className="text-yellow-200 fill-yellow-200/20"/>}
                </div>

                <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                <p className="text-white/60 text-sm mb-8 leading-relaxed">{service.desc}</p>

                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-4xl font-bold">R$ {service.price}</span>
                  <span className="text-sm text-white/40">/ sessão</span>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {service.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                      <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Check size={12} />
                      </div>
                      {feat}
                    </li>
                  ))}
                  <li className="flex items-center gap-3 text-sm text-white/80">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      <Clock size={12} />
                    </div>
                    Duração: {service.duration}
                  </li>
                </ul>

                <Button 
                  variant={service.highlight ? 'primary' : 'glass'} 
                  full 
                  onClick={() => {
                    setBooking(prev => ({ ...prev, serviceId: service.id }));
                    handleScroll('agendar');
                  }}
                >
                  Selecionar {service.category === 'VIDEO MAKER' ? 'Vídeo' : 'Ensaio'}
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* --- PORTFOLIO (GRID DINÂMICO) --- */}
      <section id="portfolio" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto mb-12 flex items-end justify-between">
          <h2 className="text-3xl font-bold">Trabalhos Recentes</h2>
          <span className="text-sm text-white/50 hidden md:block">Arraste para ver mais</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[600px] md:h-[400px]">
          {DATA.portfolio.map((item, i) => (
            <GlassCard key={i} className="group cursor-pointer h-full relative" hoverEffect>
              <img src={item.src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt=""/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2 rounded-full backdrop-blur-md">
                  {item.cat}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* --- AGENDAMENTO (FORMULÁRIO CLEAN) --- */}
      <section id="agendar" className="py-32 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 md:p-16 bg-black/60">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Finalize seu Agendamento</h2>
              <p className="text-white/50">Selecione a data ideal para sua produção.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Esquerda: Calendário */}
              <div className="space-y-8">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-4">1. Data</label>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({length: 10}).map((_, i) => {
                      const d = new Date(); d.setDate(d.getDate() + i + 1);
                      const isSel = booking.date?.toDateString() === d.toDateString();
                      return (
                        <button 
                          key={i} 
                          onClick={() => setBooking(prev => ({...prev, date: d, time: null}))}
                          className={`p-3 rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-white text-black border-white' : 'border-white/10 hover:bg-white/10'}`}
                        >
                          <span className="text-[10px] uppercase">{d.toLocaleDateString('pt-BR', {weekday: 'short'}).slice(0,3)}</span>
                          <span className="text-lg font-bold">{d.getDate()}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className={!booking.date ? 'opacity-30 pointer-events-none' : ''}>
                  <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-4">2. Horário</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['09:00', '11:00', '14:00', '16:00', '19:00'].map(t => (
                      <button 
                        key={t}
                        onClick={() => setBooking(prev => ({...prev, time: t}))}
                        className={`py-3 rounded-lg text-sm font-medium border transition-all ${booking.time === t ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direita: Dados e Resumo */}
              <div className="flex flex-col gap-6">
                 <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                   <p className="text-xs uppercase text-white/40 mb-1">Serviço Selecionado</p>
                   <p className="text-xl font-bold">{selectedService ? selectedService.title : 'Selecione um pacote acima'}</p>
                   <p className="text-sm text-white/60 mt-1">{selectedService ? `R$ ${selectedService.price} • ${selectedService.duration}` : ''}</p>
                 </div>

                 <div className="space-y-4">
                   <div>
                     <label className="text-xs font-bold uppercase text-white/60 ml-1">Seu Nome</label>
                     <input 
                       value={booking.name}
                       onChange={e => setBooking(prev => ({...prev, name: e.target.value}))}
                       placeholder="Digite seu nome completo"
                       className="w-full mt-2 h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white outline-none focus:border-white/50 transition-colors"
                     />
                   </div>

                   <Button variant="whatsapp" full onClick={enviarWhatsapp} disabled={!booking.date || !booking.time || !booking.name || !selectedService}>
                     <MessageCircle size={20}/> Confirmar no WhatsApp
                   </Button>
                   
                   <p className="text-[10px] text-center text-white/30 flex items-center justify-center gap-2 mt-2">
                     <ShieldCheck size={12}/> Agendamento seguro e direto
                   </p>
                 </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 text-center border-t border-white/5 bg-black relative z-10">
        <p className="text-lg font-bold tracking-tight mb-2">Lumina.</p>
        <p className="text-xs text-white/40">© 2026 Lumina Studio. Todos os direitos reservados.</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
        
        body { font-family: 'Inter', sans-serif; background-color: #050505; }
        
        .animate-blob { animation: blob 10s infinite; }
        .animate-fade-in-up { animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
