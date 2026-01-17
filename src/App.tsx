import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check, Star, ArrowRight, Home, MessageCircle, 
  Ticket, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, X, HelpCircle, Instagram, 
  Calendar as CalendarIcon, Clock, User, AlertTriangle, 
  Car, Copy, Info, Zap, ChevronDown, Share2, Music, Coffee,
  Lock, RefreshCw, Eye, ThumbsUp, Bed, Calendar, Heart, Smile, Map, Navigation, Ban,
  ChevronRight, Menu, LogOut
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE CIDADES E REGRAS
// ==================================================================================

const CONFIG = {
  APP_KEY: 'thaly_v25_header_pro', 
  COUPON_KEY_PERMANENT: 'thaly_coupon_burned_v1', 
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 12.00, 
  XP_THRESHOLDS: { VIP: 100 },
  URLS: { WHATSAPP_API: "https://api.whatsapp.com/send" }
};

// BANCO DE DADOS DAS CIDADES
const CITIES_DB = {
  sp: {
    id: 'sp',
    name: 'São Paulo - SP',
    short: 'SP',
    primaryColor: '#0A84FF',
    motelFee: 75,
    locations: [
      { id: 'bela_vista', name: 'Bela Vista / Augusta', fee: 0, zone: 'Base' },
      { id: 'consola', name: 'Consolação / Centro', fee: 16, zone: 'Zona 1' }, 
      { id: 'jardins', name: 'Jardins / Paulista', fee: 23, zone: 'Zona 1' }, 
      { id: 'higien', name: 'Higienópolis / Sta Cecília', fee: 24, zone: 'Zona 1' },
      { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 30, zone: 'Zona 2' },
      { id: 'itaim', name: 'Itaim Bibi / V. Olímpia', fee: 36, zone: 'Zona 2' },
      { id: 'moema', name: 'Moema / V. Mariana', fee: 44, zone: 'Zona 2' },
      { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 45, zone: 'Zona 2' },
      { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 55, zone: 'Zona 3' },
      { id: 'saude', name: 'Saúde / Jabaquara', fee: 63, zone: 'Zona 3' },
      { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 73, zone: 'Zona 3' },
      { id: 'morumbi', name: 'Morumbi / Panamby', fee: 80, zone: 'Zona 4' },
      { id: 'santana', name: 'Santana / ZN', fee: 84, zone: 'Zona 4' },
    ]
  },
  londrina: {
    id: 'londrina',
    name: 'Londrina - PR',
    short: 'LDB',
    primaryColor: '#32D74B', 
    motelFee: 30,
    locations: [
      { id: 'centro_ldb', name: 'Centro', fee: 10, zone: 'Zona 1' },
      { id: 'gleba', name: 'Gleba Palhano', fee: 15, zone: 'Zona 1' },
      { id: 'higienopolis_ldb', name: 'Jd. Higienópolis', fee: 15, zone: 'Zona 1' },
      { id: 'aeroporto', name: 'Região Aeroporto', fee: 20, zone: 'Zona 2' },
      { id: 'zona_norte', name: 'Zona Norte', fee: 25, zone: 'Zona 2' },
      { id: 'zona_sul', name: 'Zona Sul (Demais)', fee: 25, zone: 'Zona 2' },
      { id: 'cambe', name: 'Cambé / Ibiporã', fee: 40, zone: 'RML' },
    ]
  },
  santa_fe: {
    id: 'santa_fe',
    name: 'Santa Fé do Sul - SP',
    short: 'SFS',
    primaryColor: '#FFD60A', 
    motelFee: 0, 
    motelWarn: "Suíte (~R$ 75) paga diretamente ao Motel",
    locations: [
      { id: 'centro_sfs', name: 'Santa Fé (Cidade)', fee: 21.50, zone: 'Urbana' }, // x2 = 43
      { id: 'tres_fronteiras', name: 'Três Fronteiras', fee: 30, zone: 'Vicinais' },
      { id: 'zona_rural', name: 'Ranchos / Zona Rural', fee: 40, zone: 'Rural' },
    ]
  }
};

const PRICES_BASE = {
  UPGRADE_PCT: 0.3, 
  TOUCH: 63, 
  AROMA: 5,
  RUSH_HOUR_FEE: 15,
};

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'O ápice do relaxamento. Inicia soltando a musculatura e evolui para um contato corpo a corpo com cremes e óleos, respiração próxima e provocações sensoriais. Finalização manual intensa e explosiva.', 
    duration: 60, 
    price: 205, 
    badge: 'A MAIS PEDIDA ❤️',
    xp: 60,
    highlight: true 
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Alívio de Dores',
    desc: 'Foco 100% terapêutico. Ideal para remover dores no corpo cansado. Toques suaves e firmes para tirar o stress acumulado. Atenção: Nesta modalidade não há toques nas partes íntimas.', 
    duration: 60, 
    price: 155, 
    badge: null,
    xp: 30,
    highlight: false
  },
];

const MOODS = [
  { id: 'relax', label: 'Paz', icon: Wind, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'energy', label: 'Renovar', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  { id: 'intense', label: 'Sensorial, icon: Heart, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const PREFERENCES = {
  music: ['Zen', 'Sons da Natureza', 'Silêncio Total', 'Minha Playlist']
};

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

const TIME_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const RUSH_HOURS = ['18:00', '19:00', '20:00', '21:00'];

const FAQS = [
  { q: "Como é a Experiência Completa?", a: "É um atendimento onde cuido de você por inteiro. Une relaxamento muscular com toques provocantes e sutis, criando uma conexão única e um final extremamente prazeroso." },
  { q: "Onde é feito o atendimento?", a: "No seu conforto. Vou até sua residência, hotel ou motel. O atendimento é feito na sua cama ou sofá, onde você se sentir mais à vontade." },
  { q: "O pagamento é seguro?", a: "Totalmente. O valor do transporte (se houver) garante sua reserva. O valor do serviço você paga apenas pessoalmente." },
  { q: "Atende em Motel?", a: "Sim, com total sigilo. Em Santa Fé o cliente paga a suíte e a taxa de Uber é calculada no app. Em SP existe taxa fixa." }
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", a: "Tiago (Bela Vista)", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda, jorrei longe.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real mesmo.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo. Pele macia, cheiroso.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto. Atendeu no meu escritório.", a: "Empresário", s: 5 },
  { t: "Precisava desse escape. O stress sumiu na hora. Discrição nota 10.", a: "M. (Casado)", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena. Não dá vontade de parar.", a: "Roberto", s: 5 },
  { t: "Gostei muito! Um toque super bom! Foi uma experiência ótima, vou fazer de novo. :)", a: "Marcelo (Bela Vista)", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois, saí mais leve. Da pra ver que ele manda bem no que faz. Obrigado!", a: "Alan SP ", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Foi excelente! Faria semanal kkk
Obrigado por ter vindo! 💛", a: "Everton", s: 5 },
  { t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Você primeiro conhece o corpo para ir executando o procedimento com muito cuidado e segurança. Recomendo muito.", a: "Bruno (Bela Vista)", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
  { t: "Já fiz com vários massagistas, o Thalyson é o melhor da região.", a: "Cliente Antigo", s: 5 },
  { t: "Não economizem, peçam a completa com aromaterapia.", a: "Dica do Beto", s: 5 },
  { t: "Pontualidade britânica. Chegou na hora marcada.", a: "Advogado SP", s: 5 },
  { t: "Fiquei impressionado com a força das mãos dele.", a: "Gym Rat", s: 5 },
  { t: "A finalização manual é intensa mesmo, cumpriu o que prometeu.", a: "Anônimo", s: 5 },
  { t: "Excelente profissional. Me deixou super confortável.", a: "Hétero Curioso", s: 5 },
  { t: "Massagem terapêutica de verdade, tirou todos os nós das costas.", a: "Motorista", s: 5 },
  { t: "O sigilo é garantido mesmo. Pode confiar.", a: "M. (Sigilo)", s: 5 },
  { t: "Agradeço pela paciência e pelo serviço impecável.", a: "Sr. João", s: 5 },
  { t: "Experiência sensorial incrível. O cheiro, o toque, a música.", a: "Designer", s: 5 },
  { t: "Saí flutuando. Recomendo para quem tem rotina estressante.", a: "Executivo", s: 5 },
  { t: "O Thalyson é muito gente fina. O tempo passou voando.", a: "Matheus", s: 5 },
  { t: "Melhor investimento da semana. Relaxamento total.", a: "Bruno", s: 5 },
  { t: "Toque firme, mas sensível. Sabe onde tocar.", a: "Rafa", s: 5 },
  { t: "Gostei da facilidade de agendar pelo app. Sem enrolação.", a: "Tech Guy", s: 5 },
  { t: "Massagem nos pés foi um bônus que eu não esperava. Ótimo.", a: "Corredor", s: 5 },
  { t: "Simpático e bonito. O serviço é completo mesmo.", a: "Fã #2", s: 5 },
  { t: "Me ajudou muito com a ansiedade. Gratidão.", a: "Pedro", s: 5 },
  { t: "Fiz no meu apto e foi Prático.", a: "Morador Centro", s: 5 },
  { t: "A massagem tântrica dele desbloqueou sensações novas.", a: "Curioso", s: 5 },
  { t: "Valeu a pena esperar a agenda liberar.", a: "Ricardo", s: 5 },
  { t: "Nota 10. Nada a reclamar.", a: "Sérgio", s: 5 },
  { t: "O final foi explosivo. Recomendo.", a: "Anônimo", s: 5 },
  { t: "Muito higiênico e cuidadoso.", a: "Médico", s: 5 },
  { t: "Voltarei com certeza na próxima semana.", a: "Cliente Fiel", s: 5 },
  { t: "Paz de espírito e corpo relaxado. Obrigado.", a: "Fernando", s: 5 },
  { t: "Gostei da massagem, mão firme. Só dou 4 estrelas porque atrasou 10 min por causa da chuva.", a: "Paulo", s: 4 }, 
  { t: "O atendimento é ótimo, o menino é educado. Mas achei o óleo um pouco frio no começo.", a: "Carlos", s: 4 }, 
  { t: "Muito bom, mas passou tão rápido... queria ter ficado a tarde toda.", a: "Bruno", s: 4 } 
];

// ==================================================================================
// UTILS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(pattern); },
  shuffle: (arr) => [...arr].sort(() => Math.random() - 0.5),
   
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    
    if (sel < today) return true; 
    if (sel > today) return false; 

    const [slotH, slotM] = timeString.split(':').map(Number);
    const slotTime = new Date();
    slotTime.setHours(slotH, slotM || 0, 0, 0);
    const minTime = new Date(now.getTime() + 20 * 60000); 
    return slotTime < minTime;
  },

  getGreeting: () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }
};

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #050505; --card-bg: #141414; --border: #222; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "Roboto", sans-serif; }
body { background: var(--bg-app); color: #fff; padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden; scroll-behavior: smooth; }
input, select, button { outline: none; }

/* SCROLL NATIVO CORRIGIDO */
.ios-scroll { 
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding: 0 4px 16px 4px;
    -webkit-overflow-scrolling: touch;
}
.ios-scroll::-webkit-scrollbar { display: none; }
.ios-scroll > * { flex-shrink: 0; }

.glass-header { background: rgba(5, 5, 5, 0.95); border-bottom: 1px solid #222; }
.card-base { background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px; position: relative; overflow: hidden; }
.card-selected { border-color: var(--primary); background: #0A1E33; }
.input-field { background: #1C1C1E; border: 1px solid #333; color: white; border-radius: 12px; width: 100%; font-size: 16px; padding: 14px; }
.input-field:focus { border-color: var(--primary); background: #262626; }
.primary-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 800; border: none; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-enter { animation: fadeIn 0.8s ease-out forwards; }
.btn-pulse { animation: pulse 2s infinite; }
@keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }

/* EFEITO SHIMMER NO TITULO */
@keyframes shimmer {
  0% { background-position: 200% center; }
  100% { background-position: -200% center; }
}
.text-shimmer {
  background: linear-gradient(to right, #fff 20%, #999 40%, #fff 60%, #999 80%);
  background-size: 200% auto;
  color: #fff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s linear infinite;
}

/* ANIMAÇÃO LOGO */
@keyframes slideUpFade {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
.title-anim { animation: slideUpFade 1s ease-out forwards; }
`;

// ==================================================================================
// COMPONENTES
// ==================================================================================

const Toast = ({ msg, onClose }) => {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-max max-w-[90%]">
            <div className="bg-[#222] border border-white/10 px-4 py-3 rounded-full flex items-center gap-3 shadow-xl animate-enter">
                <Check size={16} className="text-[#32D74B]"/>
                <p className="text-sm font-bold text-white">{msg}</p>
            </div>
        </div>
    );
};

const StatusBar = ({ cityName, onSwitchCity }) => {
  return (
    <div className="w-full bg-[#111] border-b border-[#222] py-2 px-5 flex justify-between items-center text-[10px] uppercase font-bold text-gray-400">
       <div className="flex items-center gap-2 text-green-500">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
         Disponível
       </div>
       <button onClick={onSwitchCity} className="flex items-center gap-1 text-white bg-[#222] px-2 py-0.5 rounded-full border border-[#333]">
         <MapPin size={10} /> {cityName} <ChevronDown size={10}/>
       </button>
    </div>
  );
};

// COMPONENTE DE TICKET (RESUMO)
const TicketSummary = ({ data, financials, hasCoupon, onToggleCoupon, xp, isInteractive = false, couponUsedGlobal }) => {
    return (
        <div className="bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 relative overflow-hidden shadow-2xl animate-enter mb-6">
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#050505] rounded-full"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#050505] rounded-full"></div>
            
            <div className="text-center border-b border-dashed border-[#444] pb-6 mb-6">
                <h3 className="text-xl font-black text-white tracking-widest uppercase mb-1">RESUMO DO PEDIDO</h3>
                <p className="text-xs text-gray-500 uppercase">{data.date?.toLocaleDateString('pt-BR')} • {data.time}</p>
                <p className="text-[10px] text-[#0A84FF] font-bold mt-1 bg-[#0A84FF]/10 inline-block px-2 rounded uppercase">{data.city.name}</p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-300 font-medium">{data.service?.name}</span>
                    <span className="text-white font-bold">{Utils.formatBRL(financials.base)}</span>
                </div>
                
                {data.extras.upgrade && (
                    <div className="flex justify-between items-center text-xs text-[#0A84FF]">
                        <span>+ 30 Minutos</span>
                        <span>{Utils.formatBRL(financials.upg)}</span>
                    </div>
                )}
                {data.extras.touch && (
                    <div className="flex justify-between items-center text-xs text-[#0A84FF]">
                        <span>+ Interação</span>
                        <span>{Utils.formatBRL(financials.touch)}</span>
                    </div>
                )}
                {data.extras.aroma && (
                    <div className="flex justify-between items-center text-xs text-[#0A84FF]">
                        <span>+ Aromaterapia</span>
                        <span>{Utils.formatBRL(financials.aroma)}</span>
                    </div>
                )}

                {/* TAXA */}
                {financials.transportTotal > 0 ? (
                    <div className="flex justify-between items-center text-xs text-yellow-500">
                        <span>Taxa de Deslocamento</span>
                        <span>{Utils.formatBRL(financials.transportTotal)}</span>
                    </div>
                ) : (
                      <div className="flex justify-between items-center text-xs text-green-500">
                        <span>Taxa de Deslocamento</span>
                        <span>GRÁTIS</span>
                    </div>
                )}
                
                {hasCoupon && (
                      <div className="flex justify-between items-center text-xs text-[#32D74B]">
                        <span>Desconto VIP</span>
                        <span>- {Utils.formatBRL(financials.desc)}</span>
                    </div>
                )}
            </div>

            <div className="border-t border-dashed border-[#444] pt-4 mb-6">
                 <div className="flex justify-between items-end">
                    <span className="text-sm font-bold text-gray-400">Total Final</span>
                    <span className="text-3xl font-black text-white">{Utils.formatBRL(financials.total)}</span>
                 </div>
                 {data.city.motelWarn && data.location.type === 'motel' && (
                   <p className="text-[10px] text-gray-500 text-center mt-2 italic">
                     * {data.city.motelWarn}
                   </p>
                 )}
            </div>

            {/* SÓ MOSTRA SE NÃO USOU O CUPOM AINDA NA VIDA E SE É VIP */}
            {isInteractive && !hasCoupon && !couponUsedGlobal && xp >= CONFIG.XP_THRESHOLDS.VIP && !data.couponRescued && (
                <button onClick={onToggleCoupon} className="w-full py-3 bg-[#FFD60A]/10 border border-[#FFD60A] rounded-xl text-[#FFD60A] font-bold text-xs flex items-center justify-center gap-2 mb-2 animate-pulse">
                    <Ticket size={16}/> ATIVAR CUPOM DE DESCONTO
                </button>
            )}
             {isInteractive && hasCoupon && (
                 <div className="w-full py-2 bg-[#32D74B]/10 border border-[#32D74B] rounded-xl text-[#32D74B] font-bold text-[10px] flex items-center justify-center gap-2 mb-2">
                    <Check size={12}/> CUPOM APLICADO
                </div>
            )}
        </div>
    );
};

const ReviewsList = () => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const el = scrollRef.current;
        if(!el) return;
        
        const step = 0.5; 
        const interval = setInterval(() => {
            if(el) {
                el.scrollLeft += step;
            }
        }, 20);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mb-8 mt-4">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 px-1 flex items-center gap-1 opacity-70">
                <Heart size={10} className="text-red-500"/> Experiências Reais ({REVIEWS_DB.length})
            </h4>
            <div className="ios-scroll" ref={scrollRef}>
                {REVIEWS_DB.map((r, i) => (
                    <div key={i} className="min-w-[260px] max-w-[260px] bg-[#161616] border border-[#222] p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                        <div className="flex text-[#FFD60A] mb-2 gap-0.5">
                           {[...Array(5)].map((_,starI) => (
                               <Star key={starI} size={10} fill={starI < r.s ? "currentColor" : "none"} className={starI >= r.s ? "text-gray-700" : ""}/>
                           ))}
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed mb-3 italic">"{r.t}"</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase flex items-center gap-1"><Shield size={10} className="text-green-500"/> {r.a}</p>
                    </div>
                ))}
                <div className="min-w-[20px]"></div>
            </div>
        </div>
    )
}

const FAQSection = () => {
    const [open, setOpen] = useState(null);
    return (
        <div className="mt-8 mb-4">
            <h4 className="text-xs font-bold text-gray-500 mb-3 px-1 uppercase flex items-center gap-2"><HelpCircle size={12}/> Dúvidas & Detalhes</h4>
            <div className="card-base divide-y divide-[#222]">
                {FAQS.map((f, i) => (
                    <div key={i} className="p-4 cursor-pointer hover:bg-[#1a1a1a]" onClick={() => setOpen(open === i ? null : i)}>
                        <div className="flex justify-between items-center">
                            <h5 className="text-sm font-medium text-white">{f.q}</h5>
                            <ChevronDown size={16} className={`text-gray-500 transition-transform ${open === i ? 'rotate-180' : ''}`}/>
                        </div>
                        {open === i && <p className="text-xs text-gray-400 mt-3 leading-relaxed border-t border-[#333] pt-3">{f.a}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ==================================================================================
// APP PRINCIPAL
// ==================================================================================

export default function BookingApp() {
  const [activeCityId, setActiveCityId] = useState('sp'); // Default SP
  const currentCity = CITIES_DB[activeCityId];

  const [data, setData] = useState({ 
     name: '', age: '', medical: false, 
     mood: null, service: null, date: null, time: null, 
     extras: { upgrade: false, touch: false, aroma: false }, 
     prefs: { music: 'Zen / Spa' },
     payment: null,
     couponRescued: false,
     city: currentCity,
     location: { zone: currentCity.locations[0], type: 'home', street: '', number: '', district: '', reference: '', building: '', block: '', aptNumber: '', intercom: '', hotelName: '', roomNumber: '', motelName: '', suiteType: '' }
  });

  const [stage, setStage] = useState(0); 
  const [hasCoupon, setHasCoupon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [citySelectorOpen, setCitySelectorOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false); // NOVO STATE DO MENU
  const [toast, setToast] = useState(null);
  const [couponUsedGlobal, setCouponUsedGlobal] = useState(false);

  // Check if coupon was EVER used in this browser
  useEffect(() => {
    if (localStorage.getItem(CONFIG.COUPON_KEY_PERMANENT)) {
        setCouponUsedGlobal(true);
    }
  }, []);

  // Update data.city when activeCityId changes
  useEffect(() => {
    setData(prev => ({
        ...prev, 
        city: CITIES_DB[activeCityId],
        location: { ...prev.location, zone: CITIES_DB[activeCityId].locations[0] }
    }));
  }, [activeCityId]);

  useEffect(() => {
      try {
          const s = localStorage.getItem(CONFIG.APP_KEY);
          if (s) {
              const p = JSON.parse(s);
              if (p.date) p.date = new Date(p.date);
              // Restore data but keep current logic structure
              if(p.city && CITIES_DB[p.city.id]) {
                setActiveCityId(p.city.id);
                setData(p);
              }
              if(p.couponRescued) setHasCoupon(true);
          }
      } catch (e) {
          console.log("Erro ao carregar dados, iniciando limpo.");
      }
  }, []);

  useEffect(() => {
      localStorage.setItem(CONFIG.APP_KEY, JSON.stringify(data));
  }, [data]);

  const refs = {
    intro: useRef(null), mood: useRef(null), services: useRef(null), datetime: useRef(null), 
    extras: useRef(null), location: useRef(null), payment: useRef(null)
  };

  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service ? data.service.price : 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras.upgrade ? (base * PRICES_BASE.UPGRADE_PCT) : 0;
    if (data.extras.upgrade) xpPoints += 25;

    const touch = data.extras.touch ? PRICES_BASE.TOUCH : 0;
    if (data.extras.touch) xpPoints += 30; 

    const aroma = data.extras.aroma ? PRICES_BASE.AROMA : 0;
    if (data.extras.aroma) xpPoints += 15;

    const isRush = data.time && RUSH_HOURS.includes(data.time);
    const rushFee = isRush ? PRICES_BASE.RUSH_HOUR_FEE : 0;
    
    // CÁLCULO TAXA DE DESLOCAMENTO DINÂMICO POR CIDADE
    let travelFee = 0;
    
    if (data.location.type === 'motel') {
        // Usa a taxa fixa de motel da cidade atual
        travelFee = currentCity.motelFee;
    } else {
        // Se for casa/apto/hotel, usa a taxa do bairro selecionado (ida e volta * 2)
        travelFee = data.location.zone ? (data.location.zone.fee * 2) : 0;
    }
    
    const serviceTotal = base + upg + touch + aroma + rushFee; 
    const transportTotal = travelFee; 
    
    const sub = serviceTotal + transportTotal;
    const desc = hasCoupon ? CONFIG.COUPON_VAL : 0;
    const total = Math.max(0, sub - desc);
    
    return { 
        financials: { base, upg, touch, aroma, travelFee, rushFee, sub, desc, total, serviceTotal, transportTotal },
        xp: xpPoints
    };
  }, [data.service, data.extras, hasCoupon, data.location.zone, data.time, data.location.type, currentCity]);

  const isVip = xp >= CONFIG.XP_THRESHOLDS.VIP;

  const scrollToSection = (sectionRef) => {
    if (sectionRef && sectionRef.current) {
        setTimeout(() => {
            const yOffset = -120; 
            const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }, 150);
    }
  };

  const advanceStage = (next, ref) => {
    Utils.vibrate();
    if(next > stage) setStage(next);
    scrollToSection(ref);
  };

  const showToast = (msg) => setToast({msg});

  const addToCalendar = () => {
    if (!data.date || !data.time) return;
    const start = new Date(data.date);
    const [hours, minutes] = data.time.split(':').map(Number);
    start.setHours(hours, minutes, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + 1); 
    const formatDateTime = (date) => date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const title = `Massagem c/ Thalyson`;
    const details = `Serviço: ${data.service?.name}\nCidade: ${currentCity.name}`;
    const location = currentCity.name;
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatDateTime(start)}/${formatDateTime(end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
    window.open(url, '_blank');
  };

  const generateMessage = () => {
    const d = data.date;
    const loc = data.location;
    const dateStr = d ? `${d.getDate()}/${d.getMonth()+1}` : '';
    
    let addressQuery = '';
    if (loc.type === 'motel') addressQuery = loc.motelName + ' ' + currentCity.name;
    else if (loc.type === 'hotel') addressQuery = loc.hotelName + ' ' + currentCity.name;
    else addressQuery = `${loc.street}, ${loc.number} - ${loc.district}, ${currentCity.name}`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressQuery)}`;
    
    let t = `🌿 *AGENDAMENTO (${currentCity.short})*\n`;
    t += `------------------------------\n`;
    t += `👤 *${data.name.toUpperCase()}* (${data.age})\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name.toUpperCase()}*\n`;
    
    if(Object.values(data.extras).some(Boolean)) {
        t += `✨ *EXTRAS:* \n`;
        if(data.extras.upgrade) t += `   • +30min (+${Utils.formatBRL(financials.upg)})\n`;
        if(data.extras.touch) t += `   • Interação (+${Utils.formatBRL(financials.touch)})\n`;
        if(data.extras.aroma) t += `   • Aroma (+${Utils.formatBRL(financials.aroma)})\n`;
    }
    
    t += `🎧 Vibe: ${data.mood?.label} | 🎵 Som: ${data.prefs.music}\n`;
    
    t += `\n📍 *LOCAL: ${currentCity.name}*\n`;
    if(loc.type === 'home') {
        t += `🏠 End: ${loc.street}, ${loc.number} - ${loc.district}\n`;
    } else if (loc.type === 'apto') {
        t += `🏢 End: ${loc.street}, ${loc.number}\n`;
        t += `🚪 Apto/Bloco: ${loc.aptNumber}\n`;
        t += `🏙️ Bairro: ${loc.district}\n`;
    } else if (loc.type === 'motel') {
        t += `🏩 Motel: ${loc.motelName}\n`;
        if(currentCity.motelWarn) t += `⚠️ (${currentCity.motelWarn})\n`;
    } else {
        t += `🏨 Hotel: ${loc.hotelName} (Quarto ${loc.roomNumber})\n`;
    }
    t += `🗺️ *Maps:* ${mapsLink}\n`;

    t += `\n💰 *RESUMO FINANCEIRO:*\n`;
    t += `------------------------------\n`;
    t += `🔹 *Serviço + Extras:* ${Utils.formatBRL(financials.serviceTotal)} (Pagar ao final)\n`;
    
    if(financials.transportTotal > 0) {
         t += `🚗 *Taxa (Ida/Volta):* ${Utils.formatBRL(financials.transportTotal)} (Confirmar)\n`;
    } else {
         t += `🚗 *Taxa:* Grátis / Incluso\n`;
    }
    
    if(hasCoupon) t += `🎟️ *Desconto VIP:* -${Utils.formatBRL(financials.desc)}\n`;
    
    t += `\n✅ *TOTAL A PAGAR: ${Utils.formatBRL(financials.total)}*\n`;
    t += `💳 Forma de Pagto: ${data.payment?.toUpperCase()}\n`;
    
    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isAddressValid = () => {
      const l = data.location;
      const basics = l.street && l.number && l.district;
      
      if (l.type === 'home') return basics;
      if (l.type === 'apto') return l.street && l.number && l.aptNumber && l.district;
      if (l.type === 'hotel') return l.hotelName && l.roomNumber;
      if (l.type === 'motel') return l.motelName; 
      return false;
  };

  const handleConfirmAndSend = () => {
      // 1. Marca o cupom como usado para sempre se foi aplicado
      if (hasCoupon) {
          localStorage.setItem(CONFIG.COUPON_KEY_PERMANENT, 'true');
          setCouponUsedGlobal(true);
      }
      
      // 2. Abre o WhatsApp imediatamente
      const link = generateMessage();
      window.open(link, '_blank');
      
      // 3. Mostra a tela de sucesso como feedback no app
      setSuccess(true);
      window.scrollTo(0,0);
  };
  
  const handleReset = () => {
      // 4. RESET COMPLETO
      setData(prev => ({...prev, service: null, couponRescued: false})); 
      setHasCoupon(false); // Remove cupom da sessao atual
      setSuccess(false); 
      setStage(0); 
      window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen pb-48 relative bg-[#050505]">
      <style>{globalStyles}</style>
      <style>{`:root { --primary: ${currentCity.primaryColor}; }`}</style>
      {toast && <Toast msg={toast.msg} onClose={() => setToast(null)} />}
      
      {/* SELETOR DE CIDADE MODAL */}
      {citySelectorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-enter">
             <div className="absolute inset-0 bg-black/95" onClick={()=>setCitySelectorOpen(false)}></div>
             <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6">
                 <h3 className="text-xl font-bold text-white mb-6 text-center">Onde você está?</h3>
                 <div className="space-y-3">
                     {Object.values(CITIES_DB).map(city => (
                         <button key={city.id} onClick={() => { setActiveCityId(city.id); setCitySelectorOpen(false); Utils.vibrate(); showToast(`Cidade alterada para ${city.short}`); }}
                            className={`w-full p-4 rounded-xl border flex items-center justify-between ${activeCityId === city.id ? `bg-[${city.primaryColor}]/20 border-[${city.primaryColor}] text-white` : 'bg-[#111] border-[#333] text-gray-400'}`}>
                             <span className="font-bold flex items-center gap-2"><MapPin size={16}/> {city.name}</span>
                             {activeCityId === city.id && <Check size={16} color={city.primaryColor}/>}
                         </button>
                     ))}
                 </div>
                 <button onClick={()=>setCitySelectorOpen(false)} className="w-full mt-6 py-3 bg-[#333] rounded-xl font-bold text-white text-sm">Cancelar</button>
             </div>
        </div>
      )}

      {/* MENU LATERAL MODAL */}
      {showMenu && (
        <div className="fixed inset-0 z-[110] flex justify-end animate-enter">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={()=>setShowMenu(false)}></div>
             <div className="relative w-3/4 max-w-xs h-full bg-[#1C1C1E] border-l border-[#333] p-6 shadow-2xl flex flex-col">
                 <div className="flex justify-between items-center mb-8">
                     <span className="text-white font-bold text-lg">Menu</span>
                     <button onClick={()=>setShowMenu(false)}><X size={24} className="text-gray-400"/></button>
                 </div>
                 
                 <div className="space-y-4 flex-1">
                     <button onClick={() => { setCitySelectorOpen(true); setShowMenu(false); }} className="w-full p-4 rounded-xl bg-[#222] border border-[#333] flex items-center gap-3 text-white font-bold">
                        <MapPin size={20} className="text-[var(--primary)]"/> Alterar Cidade
                     </button>
                     <button onClick={() => { setHelpOpen(true); setShowMenu(false); }} className="w-full p-4 rounded-xl bg-[#222] border border-[#333] flex items-center gap-3 text-white font-bold">
                        <HelpCircle size={20} className="text-gray-400"/> Dúvidas & Ajuda
                     </button>
                     <button onClick={() => { if(navigator.share) navigator.share({url: window.location.href}); }} className="w-full p-4 rounded-xl bg-[#222] border border-[#333] flex items-center gap-3 text-white font-bold">
                        <Share2 size={20} className="text-gray-400"/> Compartilhar App
                     </button>
                 </div>
                 
                 <div className="pt-6 border-t border-[#333]">
                     <p className="text-[10px] text-gray-500 text-center uppercase">Thalyson Massagens © 2026</p>
                 </div>
             </div>
        </div>
      )}

      {/* HEADER FIXO NOVO */}
      <div className="fixed top-0 w-full z-40">
        <header className="bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex justify-between items-center transition-all duration-300">
          <div className="flex items-center gap-3">
            {/* SÓ MOSTRA VOLTAR SE STAGE > 0 E NÃO SUCESSO */}
            {stage > 0 && !success ? (
              <button 
                onClick={() => { Utils.vibrate(); setStage(s => s - 1); }} 
                className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors active:scale-95"
              >
                <ChevronRight size={24} className="rotate-180" />
              </button>
            ) : null}
            
            <span 
              className="font-extrabold text-lg tracking-tight text-shimmer cursor-pointer" 
              onClick={() => { 
                if(stage === 0 || window.confirm("Deseja voltar ao início e limpar o agendamento?")) { 
                   handleReset();
                }
              }}
            >
              THALYMASSAGENS
            </span>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => { setShowMenu(true); }} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform">
                <Menu size={18} className="text-white"/>
             </button>
          </div>
        </header>
        <StatusBar cityName={currentCity.name} onSwitchCity={() => setCitySelectorOpen(true)} />
        <div className="w-full h-[2px] bg-[#111]">
            <div className="h-full bg-[var(--primary)] transition-all duration-300" style={{width: `${(stage / 7) * 100}%`}}></div>
        </div>
      </div>

      {/* MODAL AJUDA */}
      {helpOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-enter">
              <div className="absolute inset-0 bg-black/90" onClick={()=>setHelpOpen(false)}></div>
              <div className="relative bg-[#1C1C1E] w-full max-w-sm rounded-3xl border border-[#333] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-xl text-white">Ajuda & Dúvidas</h3>
                      <button onClick={()=>setHelpOpen(false)}><X size={20} className="text-white"/></button>
                  </div>
                  <div className="space-y-4">
                      {FAQS.map((f, i) => (
                          <div key={i} className="bg-[#111] p-4 rounded-xl border border-[#222]">
                              <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2"><Info size={14} className="text-[#0A84FF]"/> {f.q}</h4>
                              <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
                          </div>
                      ))}
                  </div>
                  <button onClick={()=>setHelpOpen(false)} className="w-full mt-6 bg-[#0A84FF] text-white py-3 rounded-xl font-bold">Fechar</button>
              </div>
          </div>
      )}

      {/* TELA DE SUCESSO (COM TICKET) */}
      {success && (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 pt-32 animate-enter text-center">
            <div className="w-24 h-24 bg-[#32D74B] text-black rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(50,215,75,0.4)] animate-enter">
                <Check size={40} strokeWidth={4} />
            </div>
            <h2 className="text-3xl font-black text-white mb-2">TUDO CERTO!</h2>
            <p className="text-gray-400 mb-8 text-sm">Se o WhatsApp não abriu, clique abaixo.</p>

            {/* TICKET RESUMO VISUAL */}
            <div className="w-full max-w-sm">
                <TicketSummary 
                    data={data} 
                    financials={financials} 
                    hasCoupon={hasCoupon} 
                    xp={xp} 
                    isInteractive={false}
                    couponUsedGlobal={true} // Força esconder cupom na view de sucesso
                />
            </div>

            {/* BOTÃO WHATSAPP */}
            <a href={generateMessage()} target="_blank" rel="noreferrer" 
                className="w-full max-w-sm primary-btn py-4 text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#32D74B]/20 btn-pulse mb-3">
                <MessageCircle size={22} fill="currentColor" /> Enviar no WhatsApp
            </a>

            {/* BOTÃO AGENDA */}
            <button onClick={addToCalendar} className="w-full max-w-sm h-14 rounded-2xl bg-[#1A1A1A] border border-[#333] text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#222]">
                <CalendarIcon size={18}/> Adicionar na Agenda
            </button>
             
            <button onClick={handleReset} className="mt-6 flex items-center gap-2 text-gray-600 font-bold text-xs uppercase hover:text-white">
                <RefreshCw size={12}/> Fazer Novo Pedido
            </button>
        </div>
      )}

      {/* FLUXO PRINCIPAL */}
      {!success && (
      <main className="max-w-md mx-auto pt-32 px-5">
        
        {/* INTRODUÇÃO */}
        <section ref={refs.intro} className={`${stage === 0 ? 'block animate-enter' : 'hidden'}`}>
            <div className="my-6">
                <p className="text-[var(--primary)] font-bold text-[10px] uppercase tracking-widest mb-1">{Utils.getGreeting()}</p>
                {/* TITULO ANIMADO */}
                <h1 className="text-3xl font-bold text-white leading-tight title-anim">
                    Agende seu relaxamento<br/>hoje mesmo.
                </h1>
                <div onClick={() => setCitySelectorOpen(true)} className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#222] border border-[#333] cursor-pointer">
                    <MapPin size={12} className="text-gray-400"/>
                    <span className="text-xs font-bold text-gray-300">Atendendo em: {currentCity.name}</span>
                </div>
            </div>

            <ReviewsList />

            <div className="card-base p-6 border-[#222] bg-[#111] mb-8">
                 <div className="space-y-4">
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Seu Nome</label>
                        <input value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Como prefere ser chamado?" className="input-field"/>
                    </div>
                    <div>
                        <label className="text-[10px] uppercase font-bold text-gray-500 mb-1 ml-1">Idade</label>
                        <input type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})} placeholder="Ex: 30" className="input-field"/>
                    </div>
                    <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${data.medical ? 'bg-[var(--primary)]/10 border-[var(--primary)]' : 'bg-[#0A0A0A] border-[#222]'}`}>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${data.medical ? 'bg-[var(--primary)] border-[var(--primary)]' : 'border-[#444]'}`}>{data.medical && <Check size={14} className="text-white"/>}</div>
                        <p className="text-xs text-gray-400">Maior de idade e saudável</p>
                    </div>
                </div>
                {data.name.length > 2 && data.age && data.medical && (
                    <button onClick={() => advanceStage(1, refs.mood)} className="primary-btn w-full py-4 mt-4 flex items-center justify-center gap-2">
                        Começar <ArrowRight size={18}/>
                    </button>
                )}
            </div>
            <FAQSection />
        </section>

        {/* 1. VIBE */}
        <section ref={refs.mood} className={`${stage === 1 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">01. O que você busca hoje?</h3>
            <div className="grid grid-cols-3 gap-3">
                {MOODS.map(m => (
                    <button key={m.id} onClick={() => { setData({...data, mood: m}); advanceStage(2, refs.services); }}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${data.mood?.id === m.id ? 'border-white bg-[#222]' : 'bg-[#111] border-[#222]'}`}>
                        <m.icon size={24} className={`mb-2 ${m.color}`}/>
                        <span className="text-xs font-bold text-white">{m.label}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* 2. SERVIÇOS */}
        <section ref={refs.services} className={`${stage === 2 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">02. Escolha o Serviço</h3>
            <div className="space-y-4">
                {SERVICES.map(s => (
                    <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(3, refs.datetime); }} 
                        className={`card-base p-5 cursor-pointer border transition-all ${s.highlight ? 'border-[#FFD60A]/50 bg-[#1A1A1A]' : 'border-[#222]'} ${data.service?.id === s.id ? 'card-selected' : ''}`}>
                        
                        {s.badge && <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1 rounded-bl-xl">{s.badge}</div>}
                        
                        <div className="flex justify-between items-start mb-2">
                            <h3 className={`text-lg font-bold ${data.service?.id === s.id ? 'text-[var(--primary)]' : 'text-white'}`}>{s.name}</h3>
                            <span className="text-white font-bold bg-[#222] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 3. DATA E HORA */}
        <section ref={refs.datetime} className={`${stage === 3 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">03. Data e Hora</h3>
            <div className="card-base p-4 bg-[#111]">
                <div className="ios-scroll pb-2">
                    {[...Array(14)].map((_, i) => {
                        const d = new Date(); d.setDate(d.getDate() + i);
                        const isSel = data.date && new Date(data.date).getDate() === d.getDate();
                        return (
                            <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }} 
                                className={`min-w-[70px] h-[80px] rounded-xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[#161616] border-[#222] text-gray-400'}`}>
                                <span className="text-[10px] font-bold uppercase mb-1">{d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                <span className="text-2xl font-bold">{d.getDate()}</span>
                            </button>
                        )
                    })}
                </div>
                <div className={`grid grid-cols-4 gap-2 mt-4 ${data.date ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                    {TIME_SLOTS.map(t => {
                        const blocked = Utils.isTimeBlocked(data.date, t);
                        // SENIOR TOUCH: Simula vagas ocupadas aleatórias para dar senso de urgência (apenas visual)
                        const isRandomlyFull = !blocked && (parseInt(t.split(':')[0]) + data.date?.getDate()) % 5 === 0;
                        
                        return (
                        <button key={t} disabled={blocked || isRandomlyFull} onClick={() => { setData({...data, time: t}); advanceStage(4, refs.extras); }} 
                            className={`py-3 rounded-lg text-xs font-bold border flex flex-col items-center justify-center relative overflow-hidden
                            ${data.time === t ? 'bg-white text-black' : 
                              isRandomlyFull ? 'bg-[#1A1A1A] border-[#222] text-red-900 opacity-60' :
                              blocked ? 'opacity-20 line-through' : 'bg-[#1A1A1A] border-[#2A2A2A] text-gray-300'}`}>
                            {t}
                            {isRandomlyFull && <div className="absolute inset-0 flex items-center justify-center bg-black/40"><span className="text-[8px] font-black text-red-500 -rotate-12 border border-red-500 px-1 rounded">ESGOTADO</span></div>}
                        </button>
                    )})}
                </div>
                <p className="text-[10px] text-gray-500 text-center mt-4 flex items-center justify-center gap-1"><Zap size={10} className="text-yellow-500"/> Horários concorridos, reserve com antecedência.</p>
            </div>
        </section>

        {/* 4. EXTRAS */}
        <section ref={refs.extras} className={`${stage === 4 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">04. Personalize</h3>
            <div className="card-base divide-y divide-[#222] mb-4">
                {[
                   { id: 'upgrade', label: '+30 Minutos', icon: Clock, price: data.service?.price * PRICES_BASE.UPGRADE_PCT },
                   { id: 'touch', label: 'Interação', icon: Flame, price: PRICES_BASE.TOUCH },
                   { id: 'aroma', label: 'Aromaterapia', icon: Wind, price: PRICES_BASE.AROMA }
                ].map((item) => (
                    <div key={item.id} onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, [item.id]: !data.extras[item.id]}}); }} className="p-4 flex justify-between items-center cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${data.extras[item.id] ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'border-[#333] bg-[#0F0F0F] text-gray-500'}`}>
                                {data.extras[item.id] ? <Check size={18}/> : <item.icon size={18}/>}
                            </div>
                            <span className="font-bold text-white text-sm">{item.label}</span>
                        </div>
                        <span className="text-[var(--primary)] font-bold text-sm">+ {Utils.formatBRL(item.price)}</span>
                    </div>
                ))}
            </div>

            <div className="card-base p-4 border-[#222] bg-[#111]">
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2"><Music size={12}/> Som Ambiente</h4>
                <div className="ios-scroll pb-1">
                     {PREFERENCES.music.map(m => (
                         <button key={m} onClick={() => setData({...data, prefs: {...data.prefs, music: m}})} 
                             className={`px-4 py-2 rounded-lg text-[11px] font-bold border whitespace-nowrap ${data.prefs.music === m ? 'bg-[#FFD60A] border-[#FFD60A] text-black' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                             {m}
                         </button>
                     ))}
                </div>
            </div>

            <button onClick={() => advanceStage(5, refs.location)} className="primary-btn w-full py-4 mt-4">Continuar</button>
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section ref={refs.location} className={`${stage === 5 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">05. Localização ({currentCity.short})</h3>
            
            {/* ZONAS DA CIDADE ATUAL */}
            <div className="mb-4">
                <div className="ios-scroll pb-2">
                    {currentCity.locations.map(c => (
                        <button key={c.id} onClick={() => setData({...data, location: {...data.location, zone: c}})} 
                            className={`px-4 py-3 rounded-xl text-xs font-bold border whitespace-nowrap ${data.location.zone.id === c.id ? 'bg-[var(--primary)] border-[var(--primary)] text-white' : 'bg-[#161616] border-[#333] text-gray-400'}`}>
                            {c.name} {data.location.type !== 'motel' && c.fee > 0 && `(+${Utils.formatBRL(c.fee * 2)})`}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
                {LOCATION_TYPES.map(t => (
                    <button key={t.id} onClick={() => setData({...data, location: {...data.location, type: t.id}})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border ${data.location.type === t.id ? 'bg-[var(--primary)]/10 border-[var(--primary)] text-[var(--primary)]' : 'bg-[#121212] border-[#222] text-gray-500'}`}>
                        <t.icon size={20} className="mb-1.5"/>
                        <span className="text-[9px] font-bold uppercase">{t.label}</span>
                    </button>
                ))}
            </div>

            <div className="card-base p-4 bg-[#111] border-[#222]">
                {data.location.type === 'home' && (
                    <div className="space-y-3">
                        <div className="flex gap-2"><input placeholder="Rua" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} className="input-field w-2/3"/><input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} className="input-field w-1/3"/></div>
                        <input placeholder="Bairro" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} className="input-field"/>
                        <input placeholder="Referência" value={data.location.reference} onChange={e => setData({...data, location: {...data.location, reference: e.target.value}})} className="input-field"/>
                    </div>
                )}
                
                {data.location.type === 'apto' && (
                     <div className="space-y-3">
                        <div className="flex gap-2">
                             <input placeholder="Rua do Prédio" className="input-field w-2/3" value={data.location.street} onChange={e => setData({...data, location: {...data.location, street: e.target.value}})} />
                             <input placeholder="Nº Rua" className="input-field w-1/3" value={data.location.number} onChange={e => setData({...data, location: {...data.location, number: e.target.value}})} />
                        </div>
                        <div className="flex gap-2">
                             <input placeholder="Nº Apto / Bloco" className="input-field w-1/2" value={data.location.aptNumber} onChange={e => setData({...data, location: {...data.location, aptNumber: e.target.value}})} />
                             <input placeholder="Bairro" className="input-field w-1/2" value={data.location.district} onChange={e => setData({...data, location: {...data.location, district: e.target.value}})} />
                        </div>
                     </div>
                )}

                {/* LOGICA DE MOTEL DINAMICA */}
                {data.location.type === 'motel' && (
                     <div className="space-y-3">
                         <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl flex items-center gap-3">
                            <Flame size={20} className="text-red-500"/>
                            <div className="text-xs text-red-200">
                                <p className="font-bold">Atenção para Motel:</p>
                                {currentCity.motelWarn ? <p>{currentCity.motelWarn}</p> : <p>Taxa de deslocamento de {Utils.formatBRL(currentCity.motelFee)} aplicada.</p>}
                            </div>
                         </div>
                         <input placeholder="Nome do Motel" className="input-field" onChange={e => setData({...data, location: {...data.location, motelName: e.target.value}})}/>
                     </div>
                )}

                {data.location.type === 'hotel' && (
                    <div className="space-y-3">
                       <input placeholder="Nome do Hotel" className="input-field" onChange={e => setData({...data, location: {...data.location, hotelName: e.target.value}})}/>
                       <input placeholder="Quarto" className="input-field" onChange={e => setData({...data, location: {...data.location, roomNumber: e.target.value}})} />
                    </div>
                )}
                
                <button disabled={!isAddressValid()} onClick={() => advanceStage(6, refs.payment)} className="primary-btn w-full py-4 mt-4 disabled:opacity-50">Confirmar Local</button>
            </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section ref={refs.payment} className={`${stage === 6 ? 'block animate-enter' : 'hidden'}`}>
            <h3 className="text-lg font-bold mb-4 text-white">06. Pagamento</h3>
            <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
                {['pix', 'dinheiro', 'cartao'].map(method => (
                    <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(7, null); if(method==='pix') {navigator.clipboard.writeText(CONFIG.PIX_KEY); showToast('Pix Copiado!');} }} 
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${data.payment === method ? 'bg-[var(--primary)]/20 border-[var(--primary)]' : 'border-[#333] bg-[#121212]'}`}>
                        <span className="text-[10px] font-bold uppercase text-white">{method}</span>
                    </button>
                ))}
            </div>
        </section>

        {/* 7. REVISÃO (TICKET INTERATIVO) */}
        <section className={`${stage === 7 ? 'block animate-enter' : 'hidden'}`}>
             <h3 className="text-lg font-bold mb-4 text-white">07. Revisão</h3>
             <TicketSummary 
                data={data} 
                financials={financials} 
                hasCoupon={hasCoupon} 
                onToggleCoupon={() => { setHasCoupon(true); setData({...data, couponRescued: true}); Utils.vibrate(); showToast('Desconto Aplicado!'); }}
                xp={xp}
                isInteractive={true} 
                couponUsedGlobal={couponUsedGlobal}
            />
             <button onClick={handleConfirmAndSend} className="primary-btn w-full h-14 text-lg flex items-center justify-center gap-2 mb-32">
                Confirmar Agendamento <MessageCircle size={20}/>
            </button>
        </section>

      </main>
      )}

    </div>
  );
}
