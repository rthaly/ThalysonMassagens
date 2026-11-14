import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Check, Star, ArrowRight, Bed, Home, MessageCircle,
  Ticket, Lock, Flame, Wind, Crown, Shield, MapPin, Building,
  CreditCard, Banknote, QrCode, X,
  HelpCircle, Instagram, Calendar as CalendarIcon, Clock, AlertTriangle, Copy, Info,
  Play, Pause, Square, Volume2
} from 'lucide-react';

// ==================================================================================
// 1. CONFIGURAÇÕES & DADOS (FIXOS)
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM: "thalymassagens",
  PIX_KEY: "62922530000144",
  FIRST_COUPON_VAL: 15.00,

  PRICES: {
    UPGRADE_PCT: 0.5,
    TOUCH: 73,
    AROMA: 5,
  },

  XP_THRESHOLDS: { VIP: 150, ALPHA: 300 },
  URLS: { WHATSAPP_API: "https://api.whatsapp.com/send" }
};

// LOCAIS SP (TAXAS IDA+VOLTA JÁ CALCULADAS)
const LOCATIONS = [
  { id: 'bela_vista', name: 'Bela Vista', fee: 0, zone: 'Base' },
  { id: 'augusta', name: 'Augusta / Centro', fee: 15.00, zone: 'Centro' },
  { id: 'paulista', name: 'Paulista / Jardins', fee: 20.00, zone: 'Nobre' },
  { id: 'higienopolis', name: 'Higienópolis', fee: 25.00, zone: 'Centro' },
  { id: 'pinheiros', name: 'Pinheiros / V. Madalena', fee: 30.00, zone: 'Oeste' },
  { id: 'itaim', name: 'Itaim / V. Olímpia', fee: 35.00, zone: 'Sul' },
  { id: 'moema', name: 'Moema / Ibirapuera', fee: 35.00, zone: 'Sul' },
  { id: 'mariana', name: 'Vila Mariana', fee: 30.00, zone: 'Sul' },
  { id: 'perdizes', name: 'Perdizes / Barra Funda', fee: 30.00, zone: 'Oeste' },
  { id: 'brooklin', name: 'Brooklin / Campo Belo', fee: 40.00, zone: 'Sul' },
  { id: 'tatuape', name: 'Tatuapé / Mooca', fee: 50.00, zone: 'Leste' },
  { id: 'morumbi', name: 'Morumbi', fee: 60.00, zone: 'Sul' },
  { id: 'outra', name: 'Outro Bairro (Consultar)', fee: 0, zone: '?' },
];

const SERVICES = [
  {
    id: 'completa',
    name: 'Experiência Completa',
    short: 'Premium + Finalização',
    desc: 'Massagista de Cueca. O protocolo premium. Inicia de bruços soltando a musculatura, vira de frente com creme e óleos, toque corpo a corpo e finalização manual intensa.',
    duration: 60,
    price: 155,
    badge: 'MAIS PEDIDA 🔥',
    xp: 100
  },
  {
    id: 'relax',
    name: 'Massagem Relaxante',
    short: 'Tira Dores e Tensão',
    desc: 'Foco 100% terapêutico e relaxante. Ideal para remover dores lombares, pernas cansadas. Toques suaves para relaxar e tirar o stress, sem toques íntimos.',
    duration: 60,
    price: 125,
    badge: null,
    xp: 50
  },
];

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];

const REVIEWS_DB = [
  { t: "O Thalyson tem uma energia surreal. A massagem foi perfeita.", a: "Tiago", s: 5 },
  { t: "O toque dele vicia. A finalização foi absurda.", a: "Anônimo", s: 5 },
  { t: "Fui pra relaxar e saí de perna bamba. A massagem tântrica é real.", a: "Pedro H.", s: 5 },
  { t: "Mão firme, pegada de macho. O creme faz toda a diferença.", a: "Curioso SP", s: 5 },
  { t: "Paguei o extra pra tocar e valeu cada centavo.", a: "M. (Jardins)", s: 5 },
  { t: "Sou casado, tinha receio. O sigilo foi absoluto.", a: "Empresário", s: 5 },
  { t: "O upgrade de 30 minutos vale a pena.", a: "Roberto", s: 5 },
  { t: "Visual nota 1000. Profissionalismo raro.", a: "Carlos A.", s: 5 },
  { t: "Ambiente relaxante demais.", a: "Gustavo", s: 5 },
  { t: "Gostei bastante, me senti bem relaxado depois.", a: "Alan SP", s: 5 },
  { t: "O corpo a corpo é quente de verdade.", a: "J.P.", s: 5 },
  { t: "Atendimento no hotel foi super rápido e discreto.", a: "Turista RJ", s: 5 },
  { t: "Cara bonito, limpo e com pegada. O pacote completo.", a: "Anônimo", s: 5 },
  { t: "Sensação de liberdade total. O toque extra é obrigatório.", a: "Caio", s: 5 },
  { t: "Extremamente educado e com papo bom.", a: "Renan", s: 5 },
];

const LIVE_NOTIFICATIONS = [
  "🔥 João agendou agora", "👀 3 pessoas vendo a agenda", "📅 Sexta-feira quase cheia",
  "⭐ Pedro avaliou com 5 estrelas", "✅ Matheus confirmou", "💎 Murilo virou VIP",
  "🏠 Atendimento Hotel iniciado", "🚀 Bruno fechou pacote completo", "😈 Felipe adicionou interação",
  "🍃 Gustavo pediu Aromaterapia", "💳 Pix recebido", "🏳️‍🌈 Novo cliente cadastrado",
  "🚗 Thalyson a caminho", "✨ Avaliação 5 estrelas", "📍 Atendimento Bela Vista",
  "🎁 Cupom resgatado", "🔒 Dados seguros", "🛁 Banho tomado, pronto",
  "⚡ Ricardo agendou", "🏩 Chegando no Motel"
];

const LOCATION_TYPES = [
  { id: 'home', label: 'Casa', icon: Home },
  { id: 'apto', label: 'Apto', icon: Building },
  { id: 'hotel', label: 'Hotel', icon: Bed },
  { id: 'motel', label: 'Motel', icon: Flame },
];

// ==================================================================================
// 2. MOTOR DE VOZ MASCULINA ENVOLVENTE
// ==================================================================================

const MALE_VOICE_RE = /(daniel|felipe|ant[oô]nio|ricardo|thiago|donato|carlos|david|jorge|diego|pablo|raul|enrique|george|\bmark\b|\bfred\b|\balex\b|\bmale\b|masculin|homem)/i;
const FEMALE_VOICE_RE = /(female|feminin|mulher|francisca|luciana|maria|fernanda|joana|camila|vit[oó]ria|paulina|m[oó]nica|helena|laura|samantha|zira|susan|thalita)/i;

function selectSeductiveMaleVoice(voices: SpeechSynthesisVoice[]) {
  const ptVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('pt'));
  const malePt = ptVoices.find((v) => MALE_VOICE_RE.test(v.name) && !FEMALE_VOICE_RE.test(v.name));
  if (malePt) return { voice: malePt, isNativeMale: true };

  const nonFemalePt = ptVoices.find((v) => !FEMALE_VOICE_RE.test(v.name));
  if (nonFemalePt) return { voice: nonFemalePt, isNativeMale: false };

  return { voice: ptVoices[0] || voices[0] || null, isNativeMale: false };
}

function useSeductiveVoice() {
  const supported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof SpeechSynthesisUtterance !== 'undefined';

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');

  const chunksRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const tokenRef = useRef(0);
  const voicesRef = useRef(voices);
  voicesRef.current = voices;

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const loadVoices = () => setVoices(synth.getVoices());
    loadVoices();
    synth.addEventListener?.('voiceschanged', loadVoices);
    return () => synth.removeEventListener?.('voiceschanged', loadVoices);
  }, [supported]);

  const stop = useCallback(() => {
    tokenRef.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setStatus('idle');
    setActiveId(null);
  }, [supported]);

  useEffect(() => () => stop(), [stop]);

  const speakNextChunk = useCallback(function run(token: number) {
    if (token !== tokenRef.current) return;
    const idx = indexRef.current;
    if (idx >= chunksRef.current.length) {
      setStatus('idle');
      setActiveId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunksRef.current[idx]);
    const { voice, isNativeMale } = selectSeductiveMaleVoice(voicesRef.current);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = 'pt-BR';
    }

    utterance.rate = 0.85;
    utterance.pitch = isNativeMale ? 0.86 : 0.72;
    utterance.volume = 1;

    utterance.onend = () => {
      if (token !== tokenRef.current) return;
      indexRef.current = idx + 1;
      setTimeout(() => run(token), 180);
    };

    utterance.onerror = (e) => {
      if (token !== tokenRef.current) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      setStatus('idle');
      setActiveId(null);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const play = useCallback((id: string, text: string) => {
    if (!supported) return;
    const token = ++tokenRef.current;
    window.speechSynthesis.cancel();

    const cleanText = text
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
    const parts = (cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText]).map((s) => s.trim()).filter(Boolean);

    chunksRef.current = parts;
    indexRef.current = 0;
    setActiveId(id);
    setStatus('playing');
    setTimeout(() => speakNextChunk(token), 80);
  }, [supported, speakNextChunk]);

  const pause = useCallback(() => {
    if (!supported) return;
    tokenRef.current += 1;
    window.speechSynthesis.cancel();
    setStatus('paused');
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    const token = ++tokenRef.current;
    setStatus('playing');
    setTimeout(() => speakNextChunk(token), 80);
  }, [supported, speakNextChunk]);

  const toggle = useCallback((id: string, text: string) => {
    if (activeId === id && status === 'playing') {
      pause();
    } else if (activeId === id && status === 'paused') {
      resume();
    } else {
      play(id, text);
    }
  }, [activeId, status, pause, resume, play]);

  return { activeId, status, toggle, stop };
}

// ==================================================================================
// 3. ESTILOS GLOBAIS (PREMIUM & LIGHTWEIGHT)
// ==================================================================================

const styles = `
:root { --primary: #0A84FF; --bg: #09090b; --card: #18181b; --border: #27272a; }
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif; }
html, body { background: var(--bg); color: #fff; overflow-x: hidden; min-height: 100%; scroll-behavior: smooth; }
input, button { outline: none; }

.hide-scroll::-webkit-scrollbar { display: none; }
.hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-5px); } 100% { transform: translateY(0px); } }
@keyframes pulse-soft { 0% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(10, 132, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(10, 132, 255, 0); } }

.animate-fade { animation: fadeIn 0.6s ease-out forwards; }
.animate-enter { animation: fadeIn 0.35s ease-out forwards; }
.animate-pop { animation: scaleUp 0.4s cubic-bezier(0.17, 0.67, 0.23, 1.4) forwards; }
.animate-float { animation: float 3s ease-in-out infinite; }
.btn-pulse { animation: pulse-soft 2s infinite; }

.logo-shimmer {
  background: linear-gradient(90deg, #0A84FF 0%, #64D2FF 50%, #0A84FF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-nav { background: rgba(9, 9, 11, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05); z-index: 50; }
.card-base { background: var(--card); border: 1px solid var(--border); border-radius: 20px; transition: all 0.2s; }
.card-active { border-color: var(--primary); background: rgba(10,132,255,0.08); }
.input-clean { background: #27272a; border: 1px solid #3f3f46; color: white; border-radius: 12px; width: 100%; padding: 14px; font-size: 16px; transition: all 0.2s; }
.input-clean:focus { border-color: var(--primary); background: #3f3f46; }
.btn-primary { background: linear-gradient(to right, #0A84FF, #0066CC); color: white; border-radius: 16px; font-weight: 700; border: none; box-shadow: 0 4px 20px rgba(10, 132, 255, 0.25); transition: transform 0.15s; }
.btn-primary:active { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.45; pointer-events: none; box-shadow: none; }
`;

// ==================================================================================
// 4. UTILITÁRIOS (SEGURANÇA FINANCEIRA)
// ==================================================================================

const Utils = {
  fmt: (v: number) => (typeof v === 'number' && !isNaN(v)) ? v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00',
  vibrate: () => { if (navigator.vibrate) navigator.vibrate(10); },
  shuffle: <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5),
  isBlocked: (d: Date | string | null, t: string) => {
    if (!d) return true;
    const now = new Date();
    const sel = new Date(d);
    sel.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (sel < today) return true;
    if (sel > today) return false;
    const [h] = t.split(':').map(Number);
    const slot = new Date();
    slot.setHours(h, 0, 0, 0);
    return slot < new Date(now.getTime() + 30 * 60000);
  }
};

// ==================================================================================
// 5. COMPONENTES
// ==================================================================================

const Header = ({ onReload, onHelp }: { onReload: () => void; onHelp: () => void }) => (
  <header className="fixed top-0 w-full glass-nav py-3 px-5 flex justify-between items-center transition-all">
    <div className="flex items-center gap-2 cursor-pointer" onClick={onReload}>
      <div className="w-8 h-8 bg-[#0A84FF] rounded-lg flex items-center justify-center shadow-lg">
        <span className="font-black text-white text-sm">T.</span>
      </div>
      <span className="font-bold text-lg tracking-tight text-white">THALY.</span>
    </div>
    <div className="flex gap-3">
      <a href={`https://instagram.com/${CONFIG.INSTAGRAM}`} target="_blank" rel="noreferrer" className="p-2 bg-[#27272a] rounded-full text-white hover:bg-[#3f3f46] transition-colors">
        <Instagram size={18} />
      </a>
      <button onClick={onHelp} className="p-2 bg-[#27272a] rounded-full text-white hover:bg-[#3f3f46] transition-colors">
        <HelpCircle size={18} />
      </button>
    </div>
  </header>
);

const LiveStatus = () => {
  const [msg, setMsg] = useState<string | null>(null);
  const [pool, setPool] = useState<string[]>([]);

  useEffect(() => {
    setPool(Utils.shuffle([...LIVE_NOTIFICATIONS]));
  }, []);

  useEffect(() => {
    if (pool.length === 0) return;
    const timer = setInterval(() => {
      setPool(prev => {
        const currentPool = prev.length === 0 ? Utils.shuffle([...LIVE_NOTIFICATIONS]) : prev;
        const [next, ...rest] = currentPool;
        setMsg(next);
        setTimeout(() => setMsg(null), 4000);
        return rest;
      });
    }, 12000);
    return () => clearInterval(timer);
  }, [pool.length]);

  if (!msg) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 w-max max-w-[90%] pointer-events-none animate-fade">
      <div className="bg-[#18181b]/95 border border-[#333] px-4 py-2 rounded-full flex items-center gap-2 shadow-xl">
        <div className="w-2 h-2 rounded-full bg-[#32D74B] animate-pulse" />
        <span className="text-xs font-bold text-gray-200">{msg}</span>
      </div>
    </div>
  );
};

const ReviewsTicker = () => {
  const [idx, setIdx] = useState(0);
  const list = useMemo(() => Utils.shuffle([...REVIEWS_DB]), []);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % list.length), 6000);
    return () => clearInterval(t);
  }, [list]);

  return (
    <div className="bg-[#141416] border border-[#222] rounded-3xl p-6 mb-8 shadow-lg flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#0A84FF]/10 to-transparent rounded-bl-full transition-opacity group-hover:opacity-50"></div>
      <div>
        <div className="flex text-[#FFD60A] mb-3 gap-1">
          <Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" />
        </div>
        <p className="text-[15px] text-gray-300 italic leading-relaxed font-light">"{list[idx].t}"</p>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Shield size={12} className="text-[#32D74B]" />
        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wide">{list[idx].a}</p>
      </div>
    </div>
  );
};

const LocationSelector = ({ selectedId, onSelect }: { selectedId: string | null; onSelect: (loc: typeof LOCATIONS[0]) => void }) => {
  return (
    <div className="mb-6 -mx-5 px-5">
      <div className="flex gap-3 overflow-x-auto pb-4 hide-scroll snap-x px-1">
        {LOCATIONS.map(loc => {
          const isSelected = selectedId === loc.id;
          return (
            <div
              key={loc.id}
              onClick={() => { Utils.vibrate(); onSelect(loc); }}
              className={`snap-center flex-shrink-0 w-40 p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${isSelected ? 'border-[#0A84FF] bg-[#0A84FF]/10' : 'border-[#222] bg-[#141416]'}`}
            >
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">{loc.zone}</p>
              <p className="text-sm font-bold text-white mb-2 leading-tight h-10">{loc.name}</p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-gray-400">Ida+Volta</span>
                <span className={`text-xs font-bold ${isSelected ? 'text-[#0A84FF]' : 'text-white'}`}>
                  {loc.fee === 0 ? (loc.id === 'outra' ? 'Consultar' : 'Grátis') : Utils.fmt(loc.fee)}
                </span>
              </div>
              {isSelected && <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#0A84FF] shadow-[0_0_10px_#0A84FF]"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CouponPopup = ({ onClose, onAccept }: { onClose: () => void; onAccept: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-fade">
    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#0A84FF]/50 p-6 shadow-[0_0_50px_rgba(10,132,255,0.2)] animate-pop text-center">
      <div className="w-16 h-16 bg-[#0A84FF]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
        <Ticket size={32} className="text-[#0A84FF]" />
      </div>
      <h2 className="text-2xl font-black text-white mb-2">Você ganhou R$ {CONFIG.FIRST_COUPON_VAL}!</h2>
      <p className="text-gray-400 text-sm mb-6">Como é sua primeira vez aqui, liberei um desconto especial para você conhecer meu trabalho.</p>
      <button onClick={onAccept} className="w-full py-4 rounded-xl bg-[#0A84FF] text-white font-bold text-lg mb-3 shadow-lg btn-pulse">RESGATAR AGORA</button>
      <button onClick={onClose} className="text-gray-500 text-xs font-bold uppercase tracking-wider p-2">Dispensar por enquanto</button>
    </div>
  </div>
);

// ==================================================================================
// 6. APP PRINCIPAL
// ==================================================================================

const INITIAL_DATA = {
  name: '',
  age: '',
  medical: false,
  service: null as typeof SERVICES[0] | null,
  date: null as Date | null,
  time: null as string | null,
  extras: { upgrade: false, touch: false, aroma: false },
  payment: null as string | null,
  location: {
    id: null as string | null,
    type: 'home',
    street: '',
    number: '',
    apt: '',
    hotel: '',
    room: '',
    motel: '',
    suite: ''
  }
};

export default function BookingApp() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem('thaly_system_v2026');
      if (s) {
        const p = JSON.parse(s);
        if (p.date) p.date = new Date(p.date);
        if (!p.location || !p.location.type) throw new Error("Reset");
        return { ...INITIAL_DATA, ...p, location: { ...INITIAL_DATA.location, ...p.location } };
      }
    } catch {
      localStorage.removeItem('thaly_system_v2026');
    }
    return INITIAL_DATA;
  });

  const [stage, setStage] = useState(0);
  const [couponActive, setCouponActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedPix, setCopiedPix] = useState(false);

  const voice = useSeductiveVoice();
  const isFirstTime = !localStorage.getItem('thaly_history_complete');

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    localStorage.setItem('thaly_system_v2026', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 600);
    if (isFirstTime && !couponActive && stage === 0) {
      const t = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(t);
    }
  }, [isFirstTime, couponActive, stage]);

  useEffect(() => {
    if (success) voice.stop();
  }, [success, voice.stop]);

  // CÁLCULO FINANCEIRO BLINDADO (ESTRUTURA CORRIGIDA)
  const { financials, xp } = useMemo(() => {
    let xpPoints = 0;
    const base = data.service?.price || 0;
    if (data.service) xpPoints += data.service.xp;

    const upg = data.extras?.upgrade ? (base * CONFIG.PRICES.UPGRADE_PCT) : 0;
    if (data.extras?.upgrade) xpPoints += 25;

    const touch = data.extras?.touch ? CONFIG.PRICES.TOUCH : 0;
    if (data.extras?.touch) xpPoints += 30;

    const aroma = data.extras?.aroma ? CONFIG.PRICES.AROMA : 0;
    if (data.extras?.aroma) xpPoints += 15;

    const loc = LOCATIONS.find(l => l.id === data.location?.id);
    const travelFee = loc ? loc.fee : 0;

    const sub = base + upg + touch + aroma + travelFee;
    const desc = couponActive ? CONFIG.FIRST_COUPON_VAL : 0;

    return {
      xp: xpPoints,
      financials: {
        base,
        upg,
        touch,
        aroma,
        travelFee,
        sub,
        desc,
        total: Math.max(0, sub - desc),
        locName: loc ? loc.name : ''
      }
    };
  }, [data, couponActive]);

  const finalizeOrder = () => {
    voice.stop();
    if (couponActive || isFirstTime) localStorage.setItem('thaly_history_complete', 'true');
    setSuccess(true);
    scrollToTop();
  };

  const generateMessage = () => {
    const d = data.date ? new Date(data.date) : null;
    const dateStr = d ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}` : '';
    let t = `🦁 *PEDIDO DE AGENDAMENTO*\n──────────────────\n`;
    t += `👤 *${data.name}* (${data.age} anos)\n`;
    t += `📅 *${dateStr} às ${data.time}*\n`;
    t += `💆 *${data.service?.name}*: ${Utils.fmt(financials.base)}\n`;

    if (Object.values(data.extras).some(Boolean)) {
      t += `🔥 *EXTRAS:*\n`;
      if (data.extras.upgrade) t += `   + Upgrade 30min: ${Utils.fmt(financials.upg)}\n`;
      if (data.extras.touch) t += `   + Interação: ${Utils.fmt(financials.touch)}\n`;
      if (data.extras.aroma) t += `   + Aromaterapia: ${Utils.fmt(financials.aroma)}\n`;
    }

    t += `\n📍 *LOCAL: ${financials.locName}*\n`;
    if (data.location.type === 'home') t += `🏠 Casa: ${data.location.street}, ${data.location.number}\n`;
    else if (data.location.type === 'apto') t += `🏢 Apto: ${data.location.street}, ${data.location.number} - Ap ${data.location.apt}\n`;
    else if (data.location.type === 'hotel') t += `🏨 Hotel: ${data.location.hotel} (Qto ${data.location.room})\n`;
    else if (data.location.type === 'motel') {
      t += `🏩 Motel: ${data.location.motel}${data.location.suite ? ` (Suíte ${data.location.suite})` : ''}\n`;
      t += `⚠️ *Eu pago a suíte*\n`;
    }

    t += `\n💰 *RESUMO FINANCEIRO:*\n`;
    if (data.location.id === 'outra') t += `🚗 Deslocamento: A consultar\n`;
    else if (financials.travelFee > 0) t += `🚗 Deslocamento: ${Utils.fmt(financials.travelFee)}\n`;
    if (couponActive) t += `🎟️ Desconto 1ª Vez: -${Utils.fmt(financials.desc)}\n`;
    t += `✅ *TOTAL: ${Utils.fmt(financials.total)}*\n`;
    t += `💳 Pagamento: ${data.payment?.toUpperCase()}\n`;

    return `${CONFIG.URLS.WHATSAPP_API}?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const isFormValid = () => {
    const l = data.location;
    if (!l.id) return false;
    if (l.type === 'home') return Boolean(l.street.trim() && l.number.trim());
    if (l.type === 'apto') return Boolean(l.street.trim() && l.number.trim() && l.apt.trim());
    if (l.type === 'hotel') return Boolean(l.hotel.trim() && l.room.trim());
    if (l.type === 'motel') return Boolean(l.motel.trim());
    return false;
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(CONFIG.PIX_KEY);
    setCopiedPix(true);
    Utils.vibrate();
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const handleReset = () => {
    setData((prev: typeof INITIAL_DATA) => ({
      ...INITIAL_DATA,
      name: prev.name,
      age: prev.age,
      medical: prev.medical
    }));
    setSuccess(false);
    setStage(0);
    setCouponActive(false);
    scrollToTop();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#09090b] z-50 flex items-center justify-center text-white font-bold tracking-widest text-xs uppercase animate-pulse">
        Carregando...
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#09090b] pt-20 px-6 pb-12 flex flex-col items-center text-center animate-fade">
        <style>{styles}</style>
        <div className="w-24 h-24 bg-[#32D74B]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(50,215,75,0.2)]">
          <Check className="w-12 h-12 text-[#32D74B]" strokeWidth={4} />
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Pedido Pronto!</h2>
        <p className="text-gray-400 mb-8 text-sm max-w-xs">Agora é só enviar a confirmação gerada para o meu WhatsApp.</p>

        <div className="w-full max-w-sm bg-[#18181b] border border-[#333] rounded-3xl p-6 mb-8 text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-[#32D74B]"></div>
          <div className="flex justify-between items-end mb-6 border-b border-[#333] pb-6">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Total Final</p>
              <p className="text-[#32D74B] font-black text-3xl">{Utils.fmt(financials.total)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Deslocamento</p>
              <p className="text-white font-bold">
                {data.location.id === 'outra' ? 'A consultar' : Utils.fmt(financials.travelFee)}
              </p>
            </div>
          </div>
          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-center gap-3"><MapPin size={16} className="text-[#0A84FF]" /> {financials.locName}</p>
            <p className="flex items-center gap-3"><CalendarIcon size={16} className="text-[#0A84FF]" /> {data.date ? new Date(data.date).toLocaleDateString('pt-BR') : ''} às {data.time}</p>
          </div>
          {data.payment === 'pix' && (
            <div className="mt-6 p-4 bg-[#27272a] rounded-xl border border-[#333] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#0A84FF] font-bold uppercase mb-1">Chave Pix (CNPJ)</p>
                <p className="text-xs font-mono text-white">{CONFIG.PIX_KEY}</p>
              </div>
              <button onClick={handleCopyPix} className="px-3 py-2 rounded-lg bg-[#0A84FF]/20 text-[#0A84FF] text-xs font-bold flex items-center gap-1.5">
                <Copy size={14} /> {copiedPix ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          )}
        </div>

        <a href={generateMessage()} target="_blank" rel="noreferrer" className="w-full max-w-sm btn-primary py-4 text-lg flex items-center justify-center gap-2 mb-4">
          Enviar no WhatsApp <MessageCircle size={22} />
        </a>
        <button onClick={handleReset} className="text-gray-500 font-bold text-xs uppercase py-4">Fazer Novo Pedido</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-44 relative">
      <style>{styles}</style>
      <LiveStatus />
      <Header onReload={() => window.location.reload()} onHelp={() => setHelpOpen(true)} />

      {/* POPUP CUPOM */}
      {showPopup && (
        <CouponPopup
          onClose={() => setShowPopup(false)}
          onAccept={() => {
            setCouponActive(true);
            setShowPopup(false);
            Utils.vibrate();
          }}
        />
      )}

      {/* AJUDA */}
      {helpOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-fade">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setHelpOpen(false)}></div>
          <div className="relative bg-[#18181b] w-full max-w-sm rounded-3xl border border-[#222] p-6 shadow-2xl overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-xl flex items-center gap-2 text-white"><Info size={20} className="text-[#0A84FF]" /> Guia Rápido</h3>
              <button onClick={() => setHelpOpen(false)} className="bg-[#222] p-1.5 rounded-full text-gray-400 hover:text-white"><X size={16} /></button>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">1</div>
                <div><h3 className="font-bold text-white text-sm">O Serviço</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Massagem profissional masculina realizada no conforto do seu local (Apt, Casa, Suíte e Hotel).</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">2</div>
                <div><h3 className="font-bold text-white text-sm">Preparação</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Recomendo um banho quente antes. Levo creme, óleos, lubrificantes e aromatizador.</p></div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#0A84FF] flex items-center justify-center shrink-0 font-bold text-sm">3</div>
                <div><h3 className="font-bold text-white text-sm">Segurança</h3><p className="text-xs text-gray-400 leading-relaxed mt-1">Sigilo total garantido. Atendimento discreto e respeitoso.</p></div>
              </div>
              <div className="bg-[#1A1A1E] p-4 rounded-xl border border-[#333]">
                <h4 className="font-bold text-white text-xs uppercase mb-2 flex items-center gap-2"><Lock size={12} /> Pagamento & Cancelamento</h4>
                <ul className="text-xs text-gray-400 space-y-2 list-disc pl-4">
                  <li>Pagamento direto via Pix, Cartão e Dinheiro.</li>
                  <li>Cancelamentos com min. 2 horas de antecedência.</li>
                  <li>Taxa de deslocamento pode variar conforme distância.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-md mx-auto pt-28 px-5">
        {/* 1. INTRODUÇÃO & GAMIFICAÇÃO */}
        <section className="transition-all duration-500">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold mb-3 leading-[1.1] tracking-tight">
              Massagem &<br /><span className="logo-shimmer">Experiência.</span>
            </h1>
            <p className="text-gray-400 text-[15px] leading-relaxed">
              Massoterapia masculina no conforto do seu local. Técnica apurada e experiência premium.
            </p>
          </div>

          {/* LEVEL BAR (XP GAMIFICAÇÃO) */}
          <div className="mb-8 bg-[#18181b] p-5 rounded-3xl border border-[#222] relative overflow-hidden">
            <div className="flex justify-between items-end mb-3 relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Status VIP</span>
                <div className="flex items-center gap-2 font-black text-xl mt-0.5">
                  <Crown size={20} className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-gray-500"} />
                  <span className={xp >= CONFIG.XP_THRESHOLDS.VIP ? "text-[#FFD60A]" : "text-white"}>
                    {xp >= CONFIG.XP_THRESHOLDS.ALPHA ? 'ALPHA' : xp >= CONFIG.XP_THRESHOLDS.VIP ? 'VIP' : 'MEMBRO'}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-500">XP Atual</span>
                <span className="text-sm font-bold block text-white">{xp} <span className="text-gray-600">/ 300</span></span>
              </div>
            </div>
            <div className="h-3 w-full bg-[#131316] rounded-full overflow-hidden relative z-10 box-border border border-[#222]">
              <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-1000 ease-out" style={{ width: `${Math.min(100, (xp / 300) * 100)}%` }}></div>
            </div>
          </div>

          <ReviewsTicker />

          <div className="card-base p-6 space-y-5 shadow-2xl border-[#222]">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1.5 block">Seus Dados</label>
                <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} placeholder="Seu Nome ou Apelido" className="input-clean" />
              </div>
              <div>
                <input type="tel" maxLength={2} value={data.age} onChange={e => setData({ ...data, age: e.target.value.replace(/\D/g, '') })} placeholder="Sua Idade (Ex: 30)" className="input-clean" />
              </div>
            </div>

            <div
              onClick={() => { Utils.vibrate(); setData({ ...data, medical: !data.medical }); }}
              className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 ${data.medical ? 'bg-[#0A84FF]/10 border-[#0A84FF]' : 'bg-[#18181b] border-[#333]'}`}
            >
              <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${data.medical ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#444]'}`}>
                {data.medical && <Check size={14} className="text-white" />}
              </div>
              <p className={`text-sm font-bold ${data.medical ? 'text-white' : 'text-gray-400'}`}>Sou maior de idade e saudável</p>
            </div>

            {data.name.trim().length > 2 && Number(data.age) >= 18 && data.medical && stage === 0 && (
              <button
                onClick={() => { setStage(1); setTimeout(() => window.scrollBy({ top: 360, behavior: 'smooth' }), 100); }}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 mt-2 animate-enter"
              >
                Começar Agendamento <ArrowRight size={20} />
              </button>
            )}
          </div>
        </section>

        {/* 2. SERVIÇOS (COM VOZ MASCULINA) */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 1 ? 'opacity-100' : 'hidden'}`}>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">01.</span> Experiência</h3>
          <div className="space-y-5">
            {SERVICES.map(s => {
              const isThisVoice = voice.activeId === s.id;
              const isPlaying = isThisVoice && voice.status === 'playing';
              const isPaused = isThisVoice && voice.status === 'paused';
              const script = `${s.name}. ${s.desc}`;

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    voice.stop();
                    Utils.vibrate();
                    setData({ ...data, service: s });
                    if (stage === 1) {
                      setStage(2);
                      setTimeout(() => window.scrollBy({ top: 380, behavior: 'smooth' }), 100);
                    }
                  }}
                  className={`card-base p-6 cursor-pointer relative group ${data.service?.id === s.id ? 'card-active' : ''}`}
                >
                  {s.badge && (
                    <div className="absolute top-0 right-0 bg-[#FFD60A] text-black text-[9px] font-black px-3 py-1.5 rounded-bl-2xl shadow-lg z-10">
                      {s.badge}
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-3 relative z-10 pr-24">
                    <div>
                      <h3 className={`text-xl font-bold ${data.service?.id === s.id ? 'text-[#0A84FF]' : 'text-white'}`}>{s.name}</h3>
                      <p className="text-[11px] text-gray-500 font-semibold mt-0.5">{s.short} • {s.duration} min</p>
                    </div>
                    <span className="text-white font-bold bg-[#18181b] border border-[#333] px-3 py-1 rounded-lg text-sm shrink-0">
                      {Utils.fmt(s.price)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{s.desc}</p>

                  {/* CONTROLE DE ÁUDIO DA DESCRIÇÃO */}
                  <div onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => {
                        Utils.vibrate();
                        voice.toggle(s.id, script);
                      }}
                      className={`flex-1 py-2.5 px-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border ${
                        isPlaying
                          ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]'
                          : isPaused
                            ? 'bg-amber-500/15 border-amber-400/50 text-amber-300'
                            : 'bg-[#27272a]/70 border-[#3f3f46] text-gray-200 hover:bg-[#27272a]'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause size={14} className="fill-current" /> Pausar voz
                        </>
                      ) : isPaused ? (
                        <>
                          <Play size={14} className="fill-current" /> Continuar ouvindo
                        </>
                      ) : (
                        <>
                          <Volume2 size={14} className="text-[#0A84FF]" /> Ouvir descrição
                        </>
                      )}
                    </button>

                    {isThisVoice && (
                      <button
                        type="button"
                        onClick={() => {
                          Utils.vibrate();
                          voice.stop();
                        }}
                        aria-label="Parar áudio"
                        className="py-2.5 px-3 rounded-xl bg-[#27272a]/70 border border-[#3f3f46] text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Square size={14} className="fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. DATA E HORA */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 2 ? 'opacity-100' : 'hidden'}`}>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">02.</span> Data e Hora</h3>
          <div className="card-base p-6 border-[#222]">
            <div className="flex gap-3 overflow-x-auto pb-6 hide-scroll snap-x">
              {[...Array(10)].map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const isSel = data.date && new Date(data.date).getDate() === d.getDate() && new Date(data.date).getMonth() === d.getMonth();
                return (
                  <button
                    key={i}
                    onClick={() => { Utils.vibrate(); setData({ ...data, date: d, time: null }); }}
                    className={`snap-center min-w-[72px] h-[84px] rounded-2xl flex flex-col items-center justify-center border transition-all ${isSel ? 'bg-[#0A84FF] border-[#0A84FF] text-white shadow-lg' : 'bg-[#18181b] border-[#3f3f46] text-gray-400'}`}
                  >
                    <span className="text-[10px] font-bold uppercase mb-1 opacity-70">{d.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)}</span>
                    <span className="text-2xl font-bold">{d.getDate()}</span>
                  </button>
                );
              })}
            </div>
            <div className={`grid grid-cols-4 gap-3 mt-2 ${data.date ? '' : 'opacity-30 pointer-events-none'}`}>
              {TIME_SLOTS.map(t => (
                <button
                  key={t}
                  disabled={Utils.isBlocked(data.date, t)}
                  onClick={() => {
                    Utils.vibrate();
                    setData({ ...data, time: t });
                    if (stage === 2) {
                      setStage(3);
                      setTimeout(() => window.scrollBy({ top: 380, behavior: 'smooth' }), 100);
                    }
                  }}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${data.time === t ? 'bg-white text-black' : Utils.isBlocked(data.date, t) ? 'opacity-20 line-through border-transparent' : 'bg-[#18181b] border-[#3f3f46] text-gray-300'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. EXTRAS */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 3 ? 'opacity-100' : 'hidden'}`}>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">03.</span> Adicionais</h3>
          <div className="card-base divide-y divide-[#27272a]">
            {[
              { id: 'upgrade' as const, label: '+30 Minutos', desc: 'Mais tempo para curtir cada detalhe.', icon: Clock, price: (data.service?.price || 0) * CONFIG.PRICES.UPGRADE_PCT },
              { id: 'touch' as const, label: 'Interação / Toque', desc: 'Você no controle. Toques recíprocos.', icon: Flame, price: CONFIG.PRICES.TOUCH },
              { id: 'aroma' as const, label: 'Aromaterapia', desc: 'Óleos essenciais que acalmam a mente.', icon: Wind, price: CONFIG.PRICES.AROMA }
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => { Utils.vibrate(); setData({ ...data, extras: { ...data.extras, [item.id]: !data.extras[item.id] } }); }}
                className="p-5 flex justify-between items-center cursor-pointer hover:bg-[#1f1f23] transition-colors first:rounded-t-[20px] last:rounded-b-[20px]"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${data.extras?.[item.id] ? 'bg-[#0A84FF] border-[#0A84FF]' : 'border-[#3f3f46]'}`}>
                    {data.extras?.[item.id] ? <Check size={16} className="text-white" /> : <item.icon size={16} className="text-gray-500" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-[#0A84FF] font-bold text-sm">+ {Utils.fmt(item.price)}</span>
              </div>
            ))}
          </div>
          {stage === 3 && (
            <button
              onClick={() => { setStage(4); setTimeout(() => window.scrollBy({ top: 380, behavior: 'smooth' }), 100); }}
              className="w-full mt-5 py-4 rounded-xl text-sm font-bold bg-[#18181b] text-gray-300 border border-[#3f3f46] hover:border-[#0A84FF] transition-colors"
            >
              Continuar
            </button>
          )}
        </section>

        {/* 5. LOCALIZAÇÃO */}
        <section className={`mt-12 transition-opacity duration-500 ${stage >= 4 ? 'opacity-100' : 'hidden'}`}>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">04.</span> Localização</h3>

          <p className="text-[10px] uppercase font-bold text-gray-500 mb-3 ml-1">Selecione o Bairro (Taxa Uber Ida+Volta)</p>
          <LocationSelector
            selectedId={data.location.id}
            onSelect={(loc) => setData({ ...data, location: { ...data.location, id: loc.id } })}
          />

          <div className="grid grid-cols-4 gap-3 mb-5">
            {LOCATION_TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => { Utils.vibrate(); setData({ ...data, location: { ...data.location, type: t.id } }); }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${data.location.type === t.id ? 'bg-[#0A84FF]/20 border-[#0A84FF] text-[#0A84FF]' : 'bg-[#18181b] border-[#3f3f46] text-gray-500'}`}
              >
                <t.icon size={20} className="mb-1.5" />
                <span className="text-[10px] font-bold uppercase">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="card-base p-6 border-[#333] space-y-4">
            {data.location.type === 'home' && (
              <div className="flex gap-3">
                <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({ ...data, location: { ...data.location, street: e.target.value } })} className="input-clean w-2/3" />
                <input placeholder="Nº" type="tel" value={data.location.number} onChange={e => setData({ ...data, location: { ...data.location, number: e.target.value } })} className="input-clean w-1/3" />
              </div>
            )}
            {data.location.type === 'apto' && (
              <>
                <input placeholder="Rua / Avenida" value={data.location.street} onChange={e => setData({ ...data, location: { ...data.location, street: e.target.value } })} className="input-clean" />
                <div className="flex gap-3">
                  <input placeholder="Nº Prédio" type="tel" value={data.location.number} onChange={e => setData({ ...data, location: { ...data.location, number: e.target.value } })} className="input-clean w-1/2" />
                  <input placeholder="Nº Apto" type="tel" value={data.location.apt} onChange={e => setData({ ...data, location: { ...data.location, apt: e.target.value } })} className="input-clean w-1/2" />
                </div>
              </>
            )}
            {data.location.type === 'hotel' && (
              <>
                <input placeholder="Nome do Hotel" value={data.location.hotel} onChange={e => setData({ ...data, location: { ...data.location, hotel: e.target.value } })} className="input-clean" />
                <input placeholder="Número do Quarto" type="tel" value={data.location.room} onChange={e => setData({ ...data, location: { ...data.location, room: e.target.value } })} className="input-clean" />
              </>
            )}
            {data.location.type === 'motel' && (
              <>
                <input placeholder="Nome do Motel" value={data.location.motel} onChange={e => setData({ ...data, location: { ...data.location, motel: e.target.value } })} className="input-clean" />
                <input placeholder="Suíte (Ex: Hidro)" value={data.location.suite} onChange={e => setData({ ...data, location: { ...data.location, suite: e.target.value } })} className="input-clean" />
                <p className="text-[10px] text-yellow-500 flex items-center gap-1.5"><AlertTriangle size={12} /> O valor da suíte é pago por você.</p>
              </>
            )}
            {stage === 4 && (
              <button
                disabled={!isFormValid()}
                onClick={() => { setStage(5); setTimeout(() => window.scrollBy({ top: 320, behavior: 'smooth' }), 100); }}
                className="btn-primary w-full py-4 mt-2"
              >
                Confirmar Endereço
              </button>
            )}
          </div>
        </section>

        {/* 6. PAGAMENTO */}
        <section className={`mt-10 transition-opacity duration-500 ${stage >= 5 ? 'opacity-100' : 'hidden'}`}>
          <h3 className="text-lg font-bold mb-4 text-white flex items-center gap-2"><span className="text-[#0A84FF]">05.</span> Forma de Pagamento</h3>
          <div className="card-base p-4 grid grid-cols-3 gap-3 mb-32">
            {['pix', 'dinheiro', 'cartao'].map(m => (
              <button
                key={m}
                onClick={() => { Utils.vibrate(); setData({ ...data, payment: m }); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${data.payment === m ? 'bg-[#0A84FF]/20 border-[#0A84FF]' : 'border-[#333] hover:bg-[#18181b]'}`}
              >
                {m === 'pix' && <QrCode className="text-[#0A84FF]" />}
                {m === 'dinheiro' && <Banknote className="text-[#32D74B]" />}
                {m === 'cartao' && <CreditCard className="text-[#FFD60A]" />}
                <span className="text-[10px] font-bold uppercase tracking-wider">{m}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* CHECKOUT BAR */}
      {stage >= 5 && !success && (
        <div className="fixed bottom-0 left-0 right-0 z-50 animate-fade">
          <div className="max-w-md mx-auto bg-[#18181b]/95 border-t border-[#333] p-6 rounded-t-[32px] shadow-[0_-10px_60px_rgba(0,0,0,0.9)] backdrop-blur-md">
            <div className="flex justify-between items-end mb-5">
              <div>
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-widest">Total (+ Deslocamento)</p>
                <div className="flex items-baseline gap-2">
                  {couponActive && <span className="text-xs text-gray-500 line-through decoration-red-500">{Utils.fmt(financials.sub)}</span>}
                  <span className="text-4xl font-black text-white tracking-tighter">{Utils.fmt(financials.total)}</span>
                </div>
              </div>
              {couponActive && (
                <div className="text-[10px] text-[#32D74B] font-bold border border-[#32D74B] px-3 py-1.5 rounded-full bg-[#32D74B]/10 flex items-center gap-1">
                  <Check size={12} /> DESCONTO ATIVO
                </div>
              )}
            </div>
            <button disabled={!data.payment || !isFormValid()} onClick={finalizeOrder} className="btn-primary w-full h-16 text-lg flex items-center justify-center gap-3">
              Finalizar Pedido <MessageCircle size={24} fill="currentColor" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
