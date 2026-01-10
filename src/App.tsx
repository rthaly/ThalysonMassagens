import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle, 
  Ticket, Lock, Flame, Wind,
  CreditCard, Banknote, QrCode, Copy, 
  ChevronRight, Menu, X, HelpCircle, Instagram, Info, MapPin, Calendar as CalendarIcon, Clock
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÃO DE NEGÓCIO
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413", 
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144", 
  COUPON_VAL: 12,
  PRICES: {
    UPGRADE_PCT: 0.5, 
    TOUCH: 53, 
    AROMA: 10,
  },
  URLS: {
    WHATSAPP_API: "https://api.whatsapp.com/send"
  }
};

const LIVE_NOTIFICATIONS = [
  "🔥 João acabou de agendar",
  "👀 4 pessoas visualizando agora",
  "📅 Agenda de Sexta quase cheia",
  "⭐ Pedro avaliou com 5 estrelas",
  "✅ Matheus confirmou presença",
  "💎 Murilo usou o Cupom",
  "🌊 Ricardo ativou o modo relax",
  "💬 Lucas enviou uma dúvida",
  "🏠 Atendimento em domicílio iniciado"
];

const SERVICES = [
  { 
    id: 'completa', 
    name: 'Experiência Completa', 
    short: 'Relaxamento + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleo, toque corpo a corpo e finalização manual intensa.', 
    duration: 60, 
    price: 155, 
    badge: 'MAIS PEDIDA 🔥'
  },
  { 
    id: 'relax', 
    name: 'Massagem Relaxante', 
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques suaves para relaxar e tirar o stress, sem toques íntimos.', 
    duration: 60, 
    price: 125, 
    badge: null
  },
];

const TIME_SLOTS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', 
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'
];

const LOCATIONS = [
  { id: 'home', label: 'Na sua Casa / Apto', sub: 'Atendimento no seu conforto', icon: Home, input: true },
  { id: 'hotel', label: 'Hotel / Motel', sub: 'Vou até a sua suíte (Sigilo Total)', icon: Bed, input: true },
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
  { t: "Ele de cueca branca... sem comentários. Visual nota 1000.", a: "Fã", s: 5 },
  { t: "Profissionalismo raro hoje em dia. Pontual e educado.", a: "Carlos A.", s: 5 },
  { t: "A mistura de força e suavidade é incrível. Recomendo.", a: "Lucas", s: 5 },
  { t: "Primeira vez que faço e me senti super à vontade. Thalyson é gente boa.", a: "Novato", s: 5 },
  { t: "Ambiente que ele cria com a música e o cheiro é relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante da massagem do Thalyson, me senti bem relaxado depois, saí mais leve. Da pra ver que ele manda bem no que faz. Obrigado!", a: "Alan SP ", s: 5 },
  { t: "O corpo a corpo é quente de verdade. Uma experiência única.", a: "J.P.", s: 5 },
  { t: "Gostei que ele respeita os limites, mas entrega muito prazer.", a: "André", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto. Salvou minha viagem.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Fiz a relaxante e dormi na maca de tão bom. Recomendo.", a: "Breno", s: 5 },
  { t: "A técnica dele é diferente de tudo. Vale cada real.", a: "Dr. Marcelo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Me senti renovado. Energia lá em cima depois da sessão.", a: "Vitor", s: 5 },
  { t: "Extremamente educado e com papo bom, além da massagem top.", a: "Renan", s: 5 },
  { t: "O  lubrificante é um detalhe que faz toda diferença.", a: "Paulo", s: 5 },
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
  { t: "Paz de espírito e corpo relaxado. Obrigado.", a: "Fernando", s: 5 }
];

// ==================================================================================
// 2. UTILITÁRIOS
// ==================================================================================

const Utils = {
  formatBRL: (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  vibrate: (pattern = 10) => { if (navigator.vibrate) navigator.vibrate(pattern); },
  shuffleArray: (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  isTimeBlocked: (selectedDate, timeString) => {
    if (!selectedDate) return true;
    const now = new Date();
    const today = new Date(); today.setHours(0,0,0,0);
    const sel = new Date(selectedDate); sel.setHours(0,0,0,0);
    if (sel < today) return true; 
    if (sel > today) return false; 
    const [hours] = timeString.split(':').map(Number);
    return hours <= now.getHours();
  },
  getGreeting: () => {
    const h = new Date().getHours();
    return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
  }
};

// ==================================================================================
// 3. ESTILOS GLOBAIS
// ==================================================================================

const globalStyles = `
:root { --primary: #0A84FF; --bg-app: #000000; --card-bg: #121212; --border: #2C2C2E; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
html { font-size: 16px; background-color: var(--bg-app); color-scheme: dark; }
body { 
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", Helvetica, sans-serif; 
  letter-spacing: -0.01em; color: #fff; background: var(--bg-app);
  padding-bottom: env(safe-area-inset-bottom); overflow-x: hidden;
}
@keyframes shimmer { 0% {background-position: -200% 0;} 100% {background-position: 200% 0;} }
.text-shimmer {
  background: linear-gradient(90deg, #ffffff 0%, #0A84FF 50%, #ffffff 100%);
  background-size: 200% auto; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 5s linear infinite;
}
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes bubblePop { 0% { opacity: 0; transform: scale(0.8) translateY(-10px); } 10% { opacity: 1; transform: scale(1) translateY(0); } 90% { opacity: 1; transform: scale(1) translateY(0); } 100% { opacity: 0; transform: scale(0.8) translateY(-10px); } }
.animate-enter { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-scale { animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
.animate-slide { animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
.animate-bubble { animation: bubblePop 6s ease-in-out forwards; }
.ios-bg { background: radial-gradient(circle at 50% 0%, #1a1a1a 0%, #000000 70%); min-height: 100vh; }
.ios-card { 
  background: var(--card-bg); border: 1px solid var(--border); border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.ios-card:active { transform: scale(0.98); background: #1A1A1A; }
.ios-card.selected { border-color: var(--primary); background: rgba(10, 132, 255, 0.08); box-shadow: 0 0 0 1px var(--primary), 0 10px 40px rgba(10, 132, 255, 0.1); }
.ios-input { background: #1C1C1E; border: 1px solid #333; color: white; font-size: 17px; border-radius: 14px; width: 100%; transition: all 0.2s; }
.ios-input:focus { border-color: var(--primary); background: #222; outline: none; }
.ios-btn { background: var(--primary); color: white; border-radius: 16px; font-weight: 700; font-size: 17px; border: none; transition: transform 0.2s; box-shadow: 0 4px 20px rgba(10, 132, 255, 0.25); }
.ios-btn:active { opacity: 0.9; transform: scale(0.97); }
.section-blur { opacity: 0.3; filter: blur(3px); pointer-events: none; transition: all 0.6s ease; }
.section-active { opacity: 1; filter: blur(0); pointer-events: auto; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ==================================================================================
// 4. COMPONENTES VISUAIS
// ==================================================================================

const LiveBubbles = () => {
    const [activeMsg, setActiveMsg] = useState(null);
    useEffect(() => {
      const cycle = () => {
        const randomMsg = LIVE_NOTIFICATIONS[Math.floor(Math.random() * LIVE_NOTIFICATIONS.length)];
        setTimeout(() => { setActiveMsg(randomMsg); }, 2000);
        setTimeout(() => setActiveMsg(null), 8000);
      };
      cycle();
      const interval = setInterval(cycle, 18000);
      return () => clearInterval(interval);
    }, []);
    if (!activeMsg) return null;
    return (
      <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-30 w-max max-w-[90%] pointer-events-none">
        <div className="bg-[#1C1C1E]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl animate-bubble">
           <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse"></div>
           <span className="text-xs font-bold text-white tracking-wide">{activeMsg}</span>
        </div>
      </div>
    );
};

const ReviewsTicker = () => {
  const [reviews, setReviews] = useState([]);
  const [idx, setIdx] = useState(0);
  useEffect(() => { setReviews(Utils.shuffleArray([...REVIEWS_DB])); }, []);
  useEffect(() => { if (reviews.length === 0) return; const t = setInterval(() => setIdx(i => (i+1)%reviews.length), 6000); return () => clearInterval(t); }, [reviews]);
  if (reviews.length === 0) return null;
  return (
      <div className="mb-6 p-1 relative min-h-[90px] flex items-center animate-enter">
          <div key={idx} className="absolute inset-0 flex flex-col justify-center animate-enter">
              <div className="flex gap-1 text-[#FFD60A] mb-2">{[...Array(5)].map((_,i) => <Star key={i} size={14} fill="currentColor" strokeWidth={0} />)}</div>
              <p className="text-[15px] text-white font-medium leading-relaxed mb-1 italic">"{reviews[idx].t}"</p>
              <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">— {reviews[idx].a}</p>
          </div>
      </div>
  )
}

const MenuOverlay = ({ onClose, onHelp }) => (
  <div className="fixed inset-0 z-[200] flex justify-end animate-enter">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
    <div className="relative w-3/4 max-w-sm h-full bg-[#1C1C1E] border-l border-[#333] p-6 shadow-2xl animate-slide flex flex-col">
       <button onClick={onClose} className="self-end p-2 bg-[#333] rounded-full mb-8"><X size={20} className="text-white"/></button>
       <h2 className="text-2xl font-bold text-white mb-6">Menu</h2>
       <div className="space-y-4">
          <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" 
             className="flex items-center gap-4 p-4 rounded-xl bg-[#2C2C2E] active:bg-[#333] transition-colors">
             <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center">
                <Instagram size={20} className="text-white"/>
             </div>
             <div>
                <p className="font-bold text-white">Instagram</p>
                <p className="text-xs text-gray-400">@{CONFIG.INSTAGRAM}</p>
             </div>
          </a>
          <button onClick={() => { onClose(); onHelp(); }} 
             className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#2C2C2E] active:bg-[#333] transition-colors text-left">
             <div className="w-10 h-10 rounded-full bg-[#0A84FF]/20 flex items-center justify-center">
                <HelpCircle size={20} className="text-[#0A84FF]"/>
             </div>
             <div>
                <p className="font-bold text-white">Como Funciona?</p>
                <p className="text-xs text-gray-400">Ajuda e Dúvidas</p>
             </div>
          </button>
       </div>
       <div className="mt-auto pt-6 border-t border-[#333]">
          <p className="text-xs text-center text-gray-600">Thalymassagens App<br/>Versão 10.0 (Completa)</p>
       </div>
    </div>
  </div>
);

// AJUDA EXPANDIDA
const HelpModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 animate-enter">
    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
    <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-3xl p-6 shadow-2xl overflow-y-auto max-h-[85vh]">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2"><Info size={20} className="text-[#0A84FF]"/> Guia Rápido</h2>
            <button onClick={onClose} className="p-1 bg-[#333] rounded-full"><X size={16} className="text-gray-400"/></button>
        </div>
        <div className="space-y-6">
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                <div><h3 className="font-bold text-white text-sm">O Serviço</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Massagem profissional masculina realizada no conforto do seu local (Apt, Casa, Suíte e Hotel).</p></div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <div><h3 className="font-bold text-white text-sm">Preparação</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Recomendo um banho quente antes. 
                  Levo óleos e lubrificantes. Tenha duas toalhas disponíveis.</p></div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                <div><h3 className="font-bold text-white text-sm">Segurança</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Sigilo total garantido. Atendimento discreto e respeitoso.</p></div>
            </div>
            <div className="bg-[#2C2C2E] p-4 rounded-xl border border-[#333]">
                <h4 className="font-bold text-white text-xs uppercase mb-2 flex items-center gap-2"><Lock size={12}/> Pagamento & Cancelamento</h4>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                    <li>Pagamento direto via Pix ou Dinheiro.</li>
                    <li>Cancelamentos com min. 2 horas de antecedência.</li>
                    <li>Taxa de deslocamento pode variar conforme distância.</li>
                </ul>
            </div>
        </div>
        <button onClick={onClose} className="w-full mt-6 bg-[#0A84FF] py-3 rounded-xl font-bold text-sm">Entendi!</button>
    </div>
  </div>
);

// TELA DE SUCESSO PREENCHIDA
const SuccessScreen = ({ data, financials, whatsappLink, onCopy, onReset }) => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-5 flex flex-col items-center animate-enter text-center">
      
      <div className="w-20 h-20 bg-[#32D74B] rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(50,215,75,0.3)] animate-scale">
        <Check className="w-10 h-10 text-black" strokeWidth={4} />
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pedido Confirmado!</h2>
      <p className="text-gray-400 mb-8 text-sm max-w-xs">
        Agora tome uma ducha, que vou confirmar sua sessão, Obrigado!
      </p>

      {/* CARD RESUMO (TICKET) */}
      <div className="w-full max-w-sm bg-[#1C1C1E] border border-[#333] rounded-2xl p-6 mb-8 relative overflow-hidden text-left shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
          
          <div className="flex justify-between items-start mb-4 border-b border-[#333] pb-4">
              <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Serviço</p>
                  <p className="text-white font-bold text-lg">{data.service?.name}</p>
              </div>
              <div className="text-right">
                   <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1">Valor Final</p>
                   <p className="text-[#32D74B] font-bold text-xl">{Utils.formatBRL(financials.finalTotal)}</p>
              </div>
          </div>

          <div className="space-y-3">
              <div className="flex items-center gap-3">
                  <CalendarIcon size={16} className="text-[#0A84FF]"/>
                  <span className="text-sm text-gray-300">
                      {data.date ? data.date.toLocaleDateString('pt-BR') : '--/--'} às {data.time}
                  </span>
              </div>
              <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#0A84FF]"/>
                  <span className="text-sm text-gray-300">{data.location?.label}</span>
              </div>
              <div className="flex items-center gap-3">
                  <Clock size={16} className="text-[#0A84FF]"/>
                  <span className="text-sm text-gray-300">Duração: {data.service?.duration + (data.extras.upgrade ? 30 : 0)} min</span>
              </div>
          </div>
          
          {data.payment === 'pix' && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Chave Pix (Copiada)</p>
                  <p className="text-xs text-gray-400 break-all font-mono bg-black/30 p-2 rounded">{CONFIG.PIX_KEY}</p>
              </div>
          )}
      </div>

      <a href={whatsappLink} target="_blank" rel="noreferrer" 
         className="w-full max-w-sm bg-[#32D74B] text-black font-bold py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity text-lg shadow-lg active:scale-95 transition-transform">
         <MessageCircle size={24} fill="currentColor" /> Enviar no WhatsApp
      </a>
      
      <button onClick={onCopy} 
         className="w-full max-w-sm bg-[#1C1C1E] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 mb-8 border border-[#333] active:scale-95 transition-transform">
         <Copy size={20} /> Copiar Texto
      </button>

      <button onClick={onReset} 
        className="text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors py-4">
        Fazer novo pedido
      </button>
    </div>
  );
};

// ==================================================================================
// 5. APP PRINCIPAL
// ==================================================================================

export default function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem('thaly_full_v8');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date) parsed.date = new Date(parsed.date);
        if (!parsed.medical) parsed.medical = false;
        return parsed;
      }
    } catch (e) { console.error(e); }
    return {
      name: '', age: '', medical: false, 
      service: null, date: null, time: null, location: null,
      street: '', number: '', district: '', comp: '',
      extras: { upgrade: false, touch: false, aroma: false }, payment: null 
    };
  });

  const [stage, setStage] = useState(0);
  const [hasCoupon, setHasCoupon] = useState(false); 
  const [success, setSuccess] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const refs = {
    intro: useRef(null), services: useRef(null), datetime: useRef(null),
    extras: useRef(null), location: useRef(null), payment: useRef(null), checkout: useRef(null)
  };

  useEffect(() => { localStorage.setItem('thaly_full_v8', JSON.stringify(data)); }, [data]);
  useEffect(() => { setTimeout(() => setLoading(false), 800); }, []);

  const financials = useMemo(() => {
    const basePrice = data.service ? data.service.price : 0;
    const upgradePrice = data.extras.upgrade ? (basePrice * CONFIG.PRICES.UPGRADE_PCT) : 0;
    const touchPrice = data.extras.touch ? CONFIG.PRICES.TOUCH : 0;
    const aromaPrice = data.extras.aroma ? CONFIG.PRICES.AROMA : 0;
    const subTotal = basePrice + upgradePrice + touchPrice + aromaPrice;
    const discount = hasCoupon ? CONFIG.COUPON_VAL : 0;
    return { basePrice, upgradePrice, touchPrice, aromaPrice, subTotal, discount, finalTotal: Math.max(0, subTotal - discount) };
  }, [data.service, data.extras, hasCoupon]);

  const activeExtrasCount = Object.values(data.extras).filter(Boolean).length;

  const scrollToRef = (ref) => {
    if (ref && ref.current) setTimeout(() => { ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 150);
  };

  const advanceStage = (nextStage, nextRef) => {
    Utils.vibrate([10]);
    if(nextStage > stage) setStage(nextStage);
    scrollToRef(nextRef);
  };

  const handleTimeSelect = (t) => {
    if (Utils.isTimeBlocked(data.date, t)) {
        Utils.vibrate([50, 50, 50]);
        return;
    }
    setData({...data, time: t});
    advanceStage(3, refs.extras);
  };

  const generateMessage = () => {
    const dateStr = data.date ? data.date.toLocaleDateString('pt-BR') : '';
    let text = `${Utils.getGreeting()} Thalyson! 🌿\nGostaria de agendar:\n\n`;
    text += `👤 *${data.name}* (${data.age} anos)\n`;
    text += `✅ *Liberado p/ Massagem: Sim*\n`; 
    text += `💆 *${data.service?.name}*\n`;
    text += `📅 *${dateStr} às ${data.time}*\n`;
    
    if (data.location) {
        text += `📍 *${data.location.label}*\n`;
        text += `🏠 ${data.street}, ${data.number} - ${data.district}\n`;
        if(data.comp) text += `🏢 ${data.comp}\n`;
    }

    text += `\n*RESUMO FINANCEIRO (Detalhado):*\n`;
    text += `🔹 Serviço Base: ${Utils.formatBRL(financials.basePrice)}\n`;
    
    if(financials.upgradePrice > 0) text += `⏱️ Upgrade 30min: +${Utils.formatBRL(financials.upgradePrice)}\n`;
    if(financials.touchPrice > 0) text += `🔥 Interação: +${Utils.formatBRL(financials.touchPrice)}\n`;
    if(financials.aromaPrice > 0) text += `🍃 Aromaterapia: +${Utils.formatBRL(financials.aromaPrice)}\n`;
    if(financials.discount > 0) text += `🎟️ Desconto VIP: -${Utils.formatBRL(financials.discount)}\n`;
    
    text += `\n💰 *TOTAL FINAL: ${Utils.formatBRL(financials.finalTotal)}*\n`;
    text += `🚗 *+ TAXA DESLOCAMENTO: A CALCULAR*\n`;
    text += `💳 Pagamento: ${data.payment ? data.payment.toUpperCase() : 'A COMBINAR'}`;
    
    return text;
  };

  const finishOrder = () => {
    const text = generateMessage();
    const link = `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(text)}`;
    setWhatsappLink(link);
    setSuccess(true);
    window.open(link, '_blank');
  };

  const showToast = (msg) => {
      setToast(msg);
      setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMessage());
    showToast('Copiado!');
  };

  if (loading) return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-t-2 border-[#0A84FF] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] animate-pulse">Carregando...</p>
    </div>
  );

  return (
    <div className="ios-bg min-h-screen text-white pb-48 selection:bg-[#0A84FF] selection:text-white">
      <style>{globalStyles}</style>
      
      {/* HEADER GLOBAL FIXO */}
      <header className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-xl border-b border-white/5 py-3 px-6 flex justify-between items-center transition-all duration-300">
        <span className="font-extrabold text-lg tracking-tight text-shimmer cursor-pointer" onClick={() => { setSuccess(false); setStage(0); window.scrollTo(0,0); }}>THALYMASSAGENS</span>
        <div className="flex items-center gap-3">
            <button onClick={() => { setShowMenu(true); }} className="p-2 bg-[#1C1C1E] rounded-full border border-[#333] active:scale-95 transition-transform">
                <Menu size={18} className="text-white"/>
            </button>
        </div>
      </header>

      {/* OVERLAYS */}
      <LiveBubbles />
      {showMenu && <MenuOverlay onClose={() => setShowMenu(false)} onHelp={() => setShowHelp(true)} />}
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {/* TOAST */}
      {toast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] bg-[#32D74B] text-black px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold text-sm animate-scale">
            <Check size={16} strokeWidth={3}/> {toast}
        </div>
      )}

      {/* --- TELA DE SUCESSO OU HOME --- */}
      {success ? (
        <SuccessScreen 
          data={data} 
          financials={financials}
          whatsappLink={whatsappLink} 
          onCopy={handleCopy} 
          onReset={() => { setSuccess(false); setStage(0); window.scrollTo(0,0); }}
        />
      ) : (
        <main className="max-w-md mx-auto pt-24 px-5">
            
            {/* 1. INTRODUÇÃO */}
            <section ref={refs.intro} className={`transition-all duration-700 ${stage >= 0 ? 'section-active' : 'section-blur'}`}>
                <div className="mb-8 mt-4">
                    <h1 className="text-[40px] font-bold leading-[1.05] tracking-tight mb-3">
                    Relaxamento<br/><span className="text-[#555]">Exclusivo.</span>
                    </h1>
                    <p className="text-gray-400 text-[17px] leading-relaxed">
                    Massoterapia masculina no conforto do seu local.
                    </p>
                </div>

                <ReviewsTicker />

                <div className="ios-card p-6 space-y-5">
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Seu Nome</label>
                            <input 
                            value={data.name} onChange={e => setData({...data, name: e.target.value})}
                            placeholder="Como prefere ser chamado?" className="ios-input p-4"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block ml-1">Sua Idade</label>
                            <input 
                            type="tel" maxLength={2} value={data.age} onChange={e => setData({...data, age: e.target.value.replace(/\D/g,'')})}
                            placeholder="Ex: 30" className="ios-input p-4"
                            />
                        </div>

                        {/* --- CHECKBOX DE SAÚDE --- */}
                        <div onClick={() => { Utils.vibrate(); setData({...data, medical: !data.medical}) }} 
                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#1C1C1E] border-[#333] hover:bg-[#222]'}`}>
                            
                            <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#555]'}`}>
                                {data.medical && <Check size={14} className="text-white"/>}
                            </div>
                            
                            <div className="flex-1">
                                <p className={`text-[15px] font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Liberado para massagem</p>
                                <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Confirmo que estou apto e sem lesões.</p>
                            </div>
                        </div>

                        {/* BOTÃO START */}
                        {data.name.length > 2 && data.age && data.medical && stage === 0 && (
                            <button onClick={() => advanceStage(1, refs.services)} className="ios-btn w-full py-4 mt-2 flex items-center justify-center gap-2 animate-scale shadow-lg shadow-blue-900/20">
                                Começar Agendamento <ArrowRight size={20}/>
                            </button>
                        )}
                </div>
            </section>

            {/* 2. SERVIÇOS */}
            <section ref={refs.services} className={`mt-16 transition-all duration-700 ${stage >= 1 ? 'section-active' : 'section-blur'}`}>
                <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">01.</span> Experiência</h3>
                <div className="space-y-6">
                    {SERVICES.map(s => (
                        <div key={s.id} onClick={() => { setData({...data, service: s}); advanceStage(2, refs.datetime); }}
                            className={`ios-card p-6 cursor-pointer relative ${data.service?.id === s.id ? 'selected' : ''}`}>
                            {s.badge && <span className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[10px] font-bold px-3 py-1.5 rounded-bl-xl">{s.badge}</span>}
                            <div className="flex justify-between items-start mb-3">
                                <h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                                <span className="text-gray-300 font-bold bg-[#333] px-3 py-1 rounded-lg text-sm">{Utils.formatBRL(s.price)}</span>
                            </div>
                            <p className="text-[11px] font-bold text-[#0A84FF] uppercase tracking-wide border border-[#0A84FF]/30 inline-block px-2 py-1 rounded mb-3">{s.short}</p>
                            <p className="text-gray-400 text-[15px] leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. DATA E HORA */}
            <section ref={refs.datetime} className={`mt-16 transition-all duration-700 ${stage >= 2 ? 'section-active' : 'section-blur'}`}>
                <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">02.</span> Agendamento</h3>
                <div className="ios-card p-6">
                    <div className="flex gap-3 overflow-x-auto pb-5 scrollbar-hide snap-x">
                        {[...Array(14)].map((_, i) => {
                            const d = new Date(); d.setDate(d.getDate() + i);
                            const isSelected = data.date && new Date(data.date).getDate() === d.getDate();
                            return (
                                <button key={i} onClick={() => { Utils.vibrate(); setData({...data, date: d, time: null}); }}
                                    className={`snap-center min-w-[72px] h-[88px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSelected ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg scale-105' : 'bg-[#1C1C1E] border-[#333] text-gray-400'}`}>
                                    <span className="text-[10px] font-bold uppercase mb-1 opacity-60">{i===0?'HOJE':d.toLocaleDateString('pt-BR',{weekday:'short'}).slice(0,3)}</span>
                                    <span className="text-[24px] font-bold tracking-tight">{d.getDate()}</span>
                                </button>
                            )
                        })}
                    </div>
                    
                    <div className={`grid grid-cols-4 gap-3 transition-all duration-500 ${data.date ? 'opacity-100 mt-4' : 'opacity-20 pointer-events-none'}`}>
                        {TIME_SLOTS.map(t => {
                            const isBlocked = Utils.isTimeBlocked(data.date, t);
                            return (
                                <button key={t} disabled={isBlocked} onClick={() => handleTimeSelect(t)}
                                    className={`py-3.5 rounded-xl text-[14px] font-bold border transition-all relative overflow-hidden
                                        ${data.time === t ? 'bg-white text-black border-white shadow-md' : 
                                        isBlocked ? 'bg-transparent text-[#333] border-[#222] cursor-not-allowed decoration-slice' : 
                                        'bg-[#1C1C1E] border-transparent text-gray-300 hover:bg-[#2C2C2E]'}`}>
                                    {isBlocked && <div className="absolute inset-0 flex items-center justify-center"><div className="w-[120%] h-[1px] bg-[#333] rotate-45"></div></div>}
                                    {t}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* 4. ADICIONAIS */}
            <section ref={refs.extras} className={`mt-16 transition-all duration-700 ${stage >= 3 ? 'section-active' : 'section-blur'}`}>
                <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">03.</span> Personalizar</h3>
                
                <div className="ios-card rounded-[24px] overflow-hidden divide-y divide-[#333]">
                        {/* UPGRADE TEMPO */}
                        <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, upgrade: !data.extras.upgrade}}); }}
                            className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                            <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.upgrade ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444] bg-transparent'}`}>
                                {data.extras.upgrade && <Check size={16} className="text-white"/>}
                            </div>
                            <div>
                                <p className="font-bold text-white text-[16px]">+30 Minutos</p>
                                <p className="text-[12px] text-gray-500">Sessão estendida</p>
                            </div>
                            </div>
                            <span className="text-[#0A84FF] font-bold text-[14px]">+ {Utils.formatBRL(data.service ? data.service.price * CONFIG.PRICES.UPGRADE_PCT : 0)}</span>
                        </div>

                        {/* TOUCH */}
                        <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, touch: !data.extras.touch}}); }}
                            className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                            <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.touch ? 'bg-[#FF375F] border-[#FF375F]' : 'border-[#444] bg-transparent'}`}>
                                {data.extras.touch && <Flame size={16} className="text-white"/>}
                            </div>
                            <div>
                                <p className="font-bold text-white text-[16px]">Interação / Toque</p>
                                <p className="text-[12px] text-gray-500">Liberdade total</p>
                            </div>
                            </div>
                            <span className="text-[#FF375F] font-bold text-[14px]">+ {Utils.formatBRL(CONFIG.PRICES.TOUCH)}</span>
                        </div>

                        {/* AROMA */}
                        <div onClick={() => { Utils.vibrate(); setData({...data, extras: {...data.extras, aroma: !data.extras.aroma}}); }}
                            className="p-6 flex justify-between items-center cursor-pointer active:bg-[#333] transition-colors">
                            <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${data.extras.aroma ? 'bg-[#32D74B] border-[#32D74B]' : 'border-[#444] bg-transparent'}`}>
                                {data.extras.aroma && <Wind size={16} className="text-white"/>}
                            </div>
                            <div>
                                <p className="font-bold text-white text-[16px]">Aromaterapia</p>
                                <p className="text-[12px] text-gray-500">Óleos essenciais</p>
                            </div>
                            </div>
                            <span className="text-[#32D74B] font-bold text-[14px]">+ {Utils.formatBRL(CONFIG.PRICES.AROMA)}</span>
                        </div>
                </div>

                {/* BOTÃO INTELIGENTE */}
                <button onClick={() => advanceStage(4, refs.location)} 
                    className={`w-full mt-6 py-4 rounded-2xl text-[16px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg
                    ${activeExtrasCount > 0 
                        ? 'bg-[#0A84FF] text-white' 
                        : 'bg-[#1C1C1E] text-gray-400 border border-[#333] hover:text-white hover:bg-[#2C2C2E]'
                    }`}>
                    {activeExtrasCount > 0 ? `Confirmar ${activeExtrasCount} Adicionais` : 'Pular esta etapa'}
                    {activeExtrasCount > 0 ? <Check size={20}/> : <ChevronRight size={20}/>}
                </button>
            </section>

            {/* 5. LOCALIZAÇÃO */}
            <section ref={refs.location} className={`mt-16 transition-all duration-700 ${stage >= 4 ? 'section-active' : 'section-blur'}`}>
                <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">04.</span> Localização</h3>
                <div className="space-y-4">
                    {LOCATIONS.map(loc => {
                        const isSel = data.location?.id === loc.id;
                        return (
                            <div key={loc.id}>
                                <div onClick={() => { setData({...data, location: loc}); }}
                                    className={`p-5 rounded-2xl border flex items-center gap-4 cursor-pointer transition-all ${isSel ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'ios-card border-transparent'}`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSel ? 'bg-[#0A84FF] text-white' : 'bg-[#222] text-gray-500'}`}>
                                        <loc.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white text-[16px]">{loc.label}</p>
                                        <p className="text-[12px] text-gray-500">{loc.sub}</p>
                                    </div>
                                </div>
                                
                                {isSel && (
                                    <div className="mt-4 ml-6 pl-6 border-l-2 border-[#333] space-y-4 animate-enter">
                                        <input value={data.street} onChange={e => setData({...data, street: e.target.value})} placeholder="Rua / Avenida" className="ios-input p-4"/>
                                        <div className="flex gap-3">
                                            <input type="tel" value={data.number} onChange={e => setData({...data, number: e.target.value})} placeholder="Nº" className="ios-input p-4 w-1/3 text-center"/>
                                            <input value={data.district} onChange={e => setData({...data, district: e.target.value})} placeholder="Bairro" className="ios-input p-4 w-2/3"/>
                                        </div>
                                        <input value={data.comp} onChange={e => setData({...data, comp: e.target.value})} placeholder="Complemento (Opcional)" className="ios-input p-4"/>
                                        
                                        <button disabled={!data.street || !data.number || !data.district}
                                            onClick={() => advanceStage(5, refs.payment)}
                                            className="w-full bg-[#1C1C1E] text-white py-4 rounded-xl text-[14px] font-bold border border-[#333] hover:bg-[#2C2C2E] disabled:opacity-50 transition-all flex justify-center gap-2">
                                            Confirmar Endereço <Check size={18}/>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </section>

            {/* 6. PAGAMENTO */}
            <section ref={refs.payment} className={`mt-16 transition-all duration-700 ${stage >= 5 ? 'section-active' : 'section-blur'}`}>
                <h3 className="text-xl font-bold mb-5 ml-1 flex items-center gap-2"><span className="text-gray-600">05.</span> Pagamento</h3>
                
                <div className="ios-card p-3 rounded-3xl grid grid-cols-3 gap-3 mb-32">
                    {['pix', 'dinheiro', 'cartao'].map(method => (
                        <button key={method} onClick={() => { setData({...data, payment: method}); advanceStage(6, refs.checkout); if(method==='pix'){navigator.clipboard.writeText(CONFIG.PIX_KEY); showToast('Chave Pix Copiada!')} }}
                            className={`flex flex-col items-center gap-3 p-5 rounded-2xl border transition-all ${data.payment === method ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'border-transparent hover:bg-[#222]'}`}>
                            {method === 'pix' && <QrCode className="text-[#0A84FF]" size={24}/>}
                            {method === 'dinheiro' && <Banknote className="text-[#32D74B]" size={24}/>}
                            {method === 'cartao' && <CreditCard className="text-[#FFD60A]" size={24}/>}
                            <span className="text-[12px] font-bold text-gray-300 uppercase">{method}</span>
                        </button>
                    ))}
                </div>
            </section>
        </main>
      )}

      {/* 7. CHECKOUT BAR */}
      {!success && stage >= 6 && (
        <div ref={refs.checkout} className="fixed bottom-0 w-full z-50 animate-enter">
            {/* Gradient Fade */}
            <div className="h-24 bg-gradient-to-t from-black via-black/90 to-transparent absolute bottom-full w-full pointer-events-none"></div>
            
            {/* Sheet Content */}
            <div className="bg-[#1C1C1E]/95 backdrop-blur-2xl border-t border-white/10 p-6 pb-10 rounded-t-[36px] shadow-[0_-10px_60px_rgba(0,0,0,0.7)] max-w-md mx-auto relative ring-1 ring-white/5">
                
                {/* Handle */}
                <div className="w-12 h-1.5 bg-[#38383A] rounded-full mx-auto mb-8"></div>

                <div className="flex justify-between items-end mb-6">
                    <div>
                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Final</p>
                        <div className="flex items-baseline gap-2.5">
                            {hasCoupon && <span className="text-[15px] text-gray-600 line-through decoration-red-500 font-bold">{Utils.formatBRL(financials.subTotal)}</span>}
                            <span className="text-[36px] font-extrabold text-white tracking-tight">{Utils.formatBRL(financials.finalTotal)}</span>
                        </div>
                    </div>
                    {!hasCoupon && (
                        <button onClick={() => { setHasCoupon(true); Utils.vibrate(); showToast('Desconto Aplicado!'); }} 
                            className="h-10 px-4 rounded-full bg-[#0A84FF]/10 text-[#0A84FF] font-bold text-xs border border-[#0A84FF]/20 flex items-center gap-2">
                            <Ticket size={14}/> Aplicar Cupom
                        </button>
                    )}
                    {hasCoupon && <div className="h-8 px-3 rounded-full bg-[#32D74B]/10 text-[#32D74B] font-bold text-[10px] border border-[#32D74B]/20 flex items-center">VIP ATIVO</div>}
                </div>
                
                <button onClick={finishOrder} className="ios-btn w-full h-16 rounded-[22px] text-[18px] shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-3">
                    <MessageCircle size={24} fill="currentColor" />
                    Enviar Pedido
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
