import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÃO (MUDE AQUI OS DADOS DO SEU CLIENTE ANTES DE MOSTRAR)
   ========================================================================== */
const CONFIG = {
  NOME_PROFISSIONAL: 'Marina Albuquerque', // Nome do cliente que vai comprar de você
  SUBTITULO: 'Especialista em Massoterapia & Estética',
  PHONE: '5511999999999', // WhatsApp do cliente
  PIX_KEY: '123.456.789-00', // Chave Pix do cliente
  INSTAGRAM: 'https://www.instagram.com/',
  REVIEW_LINK: 'https://g.page/',
  // Foto profissional real de terapeuta para o cliente se identificar
  COVER_IMAGE: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
  AVATAR: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  COUPONS: { BEMVINDA: 15, VIPS: 0.15 } as Record<string, number>,
  SIGNAL_AMOUNT: 50, // Valor fixo do sinal
  FIRST_TIME_DISCOUNT: 20,
  PEAK_FEE: 35,
  PIX_DISCOUNT: 0.05,
  OPEN_MIN: 9 * 60, 
  LAST_END_MIN: 20 * 60, 
  SLOT_STEP: 30, 
  BUFFER_STUDIO: 30, 
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 120, 
  MIN_LEAD_HOME: 240, 
  DAYS_AHEAD: 14,
  DAYS_OFF: [0], 
};

const PACKAGES = [
  { id: 'relaxante', title: 'Massagem Relaxante', originalPrice: 190, price: 160, min: 60, tags: ['Aromaterapia', 'Corpo Inteiro'],
    desc: 'Desperte os sentidos e elimine a tensão acumulada. Movimentos contínuos e fluidos com óleos essenciais puros para induzir a um estado de relaxamento profundo.' },
  { id: 'drenagem', title: 'Drenagem Linfática Método Exclusivo', originalPrice: 220, price: 180, min: 60, tags: ['Detox', 'Modeladora'],
    desc: 'Estímulo suave do sistema linfático para redução de edemas e eliminação de toxinas. O contorno corporal mais leve desde a primeira sessão.' },
  { id: 'pedras', title: 'Terapia das Pedras Quentes', originalPrice: 260, price: 220, min: 90, tags: ['Termoterapia', 'Energia'],
    desc: 'O calor profundo das pedras vulcânicas derrete tensões musculares crônicas, alinhando centros energéticos e trazendo um conforto térmico ímpar.' },
  { id: 'spa_facial', title: 'Spa Facial Iluminador', originalPrice: 180, price: 140, min: 50, tags: ['Revitalização', 'Glow'],
    desc: 'Limpeza, esfoliação com bioativos e máscara nutritiva de argila dourada. Devolve o viço natural e a hidratação da pele cansada.' },
];

const ADDONS = [
  { id: 'esfoliacao', label: 'Esfoliação Corporal Renovadora', price: 50 },
  { id: 'escalda', label: 'Escalda-pés com Ervas Frescas', price: 40 },
];

const PEAK_HOURS = ['18:00', '18:30', '19:00', '19:30'];

/* ==========================================================================
   2. UTILITÁRIOS & ESTILO
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch (e) {} },
};

const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date): boolean => !!a && dateKey(a) === dateKey(b);
const dayLabel = (d: Date, i: number) => (i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };

const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  leaf: 'M11 20A7 7 0 0 1 4 13c0-3.5 3-7 8-11 5 4 8 7.5 8 11a7 7 0 0 1-7 7z M12 2v20 M12 12l3-3 M12 16l3-3',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  sparkles: 'M9 3v4 M7 5h4 M19 8v4 M17 10h4 M12 15l-3 6 1.5-6-3-2h4l1.5-4 1.5 4h4l-3 2 1.5 6z',
  chevronLeft: 'M15 18l-6-6 6-6',
};

type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name] || ''} />
  </svg>
));

const inputCls = 'w-full bg-transparent border-b-2 border-stone-300 px-2 py-4 text-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-stone-900 transition-colors rounded-none';
const labelCls = 'block text-[11px] font-bold tracking-widest text-stone-900 uppercase mt-8 mb-3';
const chipBase = 'min-h-[60px] border-2 rounded-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-900 shadow-sm';
const chipOn = 'bg-stone-900 text-white border-stone-900 font-semibold transform scale-[1.02] shadow-md';
const chipOff = 'bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50';
const btnPrimary = 'min-h-[60px] px-8 text-[15px] tracking-wide font-bold rounded-2xl bg-[#3E4233] text-white hover:bg-[#2A2D23] shadow-lg shadow-[#3E4233]/30 active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#3E4233] focus-visible:outline-offset-2 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none disabled:cursor-not-allowed';

/* ==========================================================================
   3. APP
   ========================================================================== */
type SlotStatus = 'ok' | 'past';
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [isReturning, setIsReturning] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '' });
  const [now, setNow] = useState(() => new Date());
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [whatsappSent, setWhatsappSent] = useState(false);

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {},
  });
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 1200); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (store.get('agenda_pro_onboard') === 'yes') setStep(1);
    if (store.get('agenda_pro_ret') === 'yes') setIsReturning(true);
    const draft = store.get('agenda_pro_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '', cep: d.cep || '' }));
      } catch (e) {}
    }
  }, [isLoading]);

  useEffect(() => {
    if (data.name.length > 2) {
      store.set('agenda_pro_draft', JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro, cep: data.cep }));
    }
  }, [data.name, data.locType, data.street, data.number, data.bairro, data.cep]);

  useEffect(() => { if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS = [];
    ADDONS.forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); }
    });
    
    const base = pkg.price + addonsTotal;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;

    let discount = 0;
    if (coupon.applied) {
      const v = coupon.value;
      discount = v < 1 ? Math.floor(base * v) : v;
    } else if (!isReturning) {
      discount = CONFIG.FIRST_TIME_DISCOUNT;
    }
    discount = Math.min(discount, base);

    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    const rest = Math.max(0, total - sinal); // Valor exato que falta pagar após o sinal de 50
    
    return { base: pkg.price, addonsTotal, peakFee, discount, pixDiscount, total, sinal, rest, dur, activeAddons };
  }, [data, pkg, isHome, isReturning, coupon.applied, coupon.value]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; out.length < CONFIG.DAYS_AHEAD && i < 40; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      if (!CONFIG.DAYS_OFF.includes(d.getDay())) out.push({ d, i });
    }
    return out;
  }, []);

  const slots = useMemo(() => {
    if (!data.date) return [];
    const buffer = isHome ? CONFIG.BUFFER_HOME : CONFIG.BUFFER_STUDIO;
    const lead = isHome ? CONFIG.MIN_LEAD_HOME : CONFIG.MIN_LEAD_STUDIO;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = sameDay(data.date, now);
    const out: { t: string; status: SlotStatus }[] = [];
    
    for (let m = CONFIG.OPEN_MIN; (m + invoice.dur + buffer) <= (CONFIG.LAST_END_MIN + buffer); m += CONFIG.SLOT_STEP) {
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  const errors = {
    name: data.name.trim().length < 3 ? 'Preencha seu nome completo.' : '',
    date: !data.date ? 'Escolha uma data disponível.' : '',
    time: data.date && !data.time ? 'Selecione um horário.' : '',
    address: isHome && !(data.street && data.number && data.bairro) ? 'Preencha o endereço de destino completo.' : '',
  };
  const step2Valid = !errors.name && data.date && data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase();
    if (!code) return;
    const val = CONFIG.COUPONS[code];
    if (val) {
      vibrate([20, 40]); setCoupon({ input: '', applied: code, value: val, error: '' }); showToast('Vantagem aplicada com sucesso.');
    } else {
      vibrate(50); setCoupon((c) => ({ ...c, error: 'Código inválido ou expirado.' }));
    }
  };

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY);
    showToast(ok ? 'Chave Pix copiada' : `Chave Pix: ${CONFIG.PIX_KEY}`);
  };

  const selectPayment = (m: string) => { vibrate(15); set({ payment: m }); };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast('CEP não encontrado.');
      } catch (e) { showToast('Erro ao buscar o CEP.'); }
    }
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc;
    if (!isHome) loc = '📍 *Local:* Atendimento no Studio';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}`;
      loc = `📍 *Atendimento em Domicílio*\n*Endereço:* ${full}`;
    }
    
    // MENSAGEM DO WHATSAPP CORRIGIDA COM OS VALORES EXATOS DE TOTAL, SINAL E RESTANTE
    let t = `Olá, ${CONFIG.NOME_PROFISSIONAL.split(' ')[0]}! Finalizei a solicitação de agendamento no site e gostaria de confirmar meu horário.\n\n`;
    t += `👤 *NOME:* ${clean(data.name)}\n`;
    t += `📅 *DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    
    t += `💆‍♀️ *SESSÃO ESCOLHIDA (${invoice.dur} min):*\n▪ ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `▪ Adicional: ${a.label}\n`));
    if (data.req.trim()) t += `\n*OBSERVAÇÃO:* "${clean(data.req)}"\n`;
    
    t += `\n*====================*\n`;
    t += `*💰 RESUMO FINANCEIRO*\n`;
    t += `*====================*\n`;
    t += `*Valor Total:* ${money(invoice.total)}\n\n`;
    t += `*1️⃣ PIX AGORA (Sinal):* ${money(invoice.sinal)}\n`;
    t += `*2️⃣ RESTANTE A PAGAR NO DIA:* ${money(invoice.rest)} (${data.payment.toUpperCase()})\n\n`;
    
    t += `*Chave Pix para o Sinal:* ${CONFIG.PIX_KEY}\n\n`;
    t += 'Segue em anexo o comprovante do sinal. Aguardo sua confirmação!';
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const finishBooking = () => {
    if (!data.payment) { vibrate(50); showToast('Selecione como irá pagar o restante no local.'); return; }
    if (!data.date) return;
    
    store.set('agenda_pro_ret', 'yes'); 
    store.del('agenda_pro_draft');
    
    setWhatsappSent(true);
    setStep(4);
    
    vibrate([30, 50]);
    setTimeout(() => {
        window.location.href = whatsappLink();
    }, 600);
  };

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap');
      
      body { font-family: 'Outfit', sans-serif; background-color: #F8F8F6; color: #1C1917; }
      .font-serif { font-family: 'Playfair Display', serif; }
      
      @keyframes fadeUp { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform:none } }
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes pulseSlow { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .8; transform: scale(0.98); } }
      
      .fade-up { animation: fadeUp .6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .stagger-1 { animation-delay: 100ms; }
      .stagger-2 { animation-delay: 200ms; }
      .stagger-3 { animation-delay: 300ms; }
      .fade-in { animation: fadeIn .8s ease both; }
      .load-pulse { animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      
      .hide-scrollbar::-webkit-scrollbar { display:none } .hide-scrollbar { scrollbar-width:none }
      
      .glass-header {
        background: rgba(248, 248, 246, 0.9);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(0,0,0,0.06);
      }
    ` }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F6] flex flex-col items-center justify-center px-6" role="status">
        <Icon name="leaf" size={48} className="text-[#3E4233] mb-6 load-pulse" />
        <h1 className="text-sm font-bold tracking-[0.4em] uppercase text-stone-900 mb-2 text-center">Iniciando</h1>
        {css}
      </div>
    );
  }

  const SummaryRow = ({ label, value, bold = false }: { label: string; value: ReactNode; bold?: boolean }) => (
    <div className={`flex justify-between items-center py-2.5 ${bold ? 'text-stone-900 font-bold' : 'text-stone-700 font-medium'}`}>
      <span className="text-[15px]">{label}</span>
      <span className="text-[15px] text-right">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F8F6] text-stone-900 selection:bg-[#3E4233]/20 pb-16 relative">
      {toast && (
        <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold text-[14px] tracking-wide shadow-2xl fade-up max-w-[90vw] text-center border border-stone-800">{toast}</div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-stone-900/70 backdrop-blur-md fade-in" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-0 relative shadow-2xl fade-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-40 bg-stone-200 relative">
               <img src={CONFIG.COVER_IMAGE} className="w-full h-full object-cover" alt="Ambiente do Spa" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <button aria-label="Fechar" autoFocus onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition"><Icon name="close" size={20} /></button>
            </div>
            
            <div className="px-8 pb-10 -mt-14 relative z-10">
              <img src={CONFIG.AVATAR} className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl mb-4" alt={CONFIG.NOME_PROFISSIONAL} />
              <h2 className="text-3xl font-serif font-semibold text-stone-900">{CONFIG.NOME_PROFISSIONAL}</h2>
              <p className="text-[#3E4233] text-[15px] font-bold tracking-wide mb-6">{CONFIG.SUBTITULO}</p>
              
              <div className="space-y-4 text-[16px] text-stone-700 leading-relaxed mb-8">
                <p>O luxo de pausar. Especialista em terapias manuais focadas em resultados reais de bem-estar, unindo ciência biomecânica e elementos da natureza.</p>
                <div className="bg-stone-50 p-5 rounded-2xl flex gap-4 items-start border border-stone-200 shadow-sm">
                  <Icon name="map" size={20} className="mt-0.5 text-[#3E4233]" />
                  <p className="text-[14px] font-medium text-stone-800">Atendimento em clínica com cromoterapia ou no conforto do seu domicílio.</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-stone-200">
                <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-[15px] font-bold text-stone-900 hover:text-white bg-stone-100 hover:bg-stone-900 px-6 py-4 rounded-xl transition-all w-full"><Icon name="instagram" size={20} /> Instagram Oficial</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {step > 0 && step < 4 && (
        <header className="glass-header px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-8 sticky top-0 z-40 transition-all shadow-sm">
          <button onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl group">
            <img src={CONFIG.AVATAR} alt="" className="w-12 h-12 rounded-full object-cover shadow-sm group-hover:shadow-md transition-all" />
            <div>
              <span className="block text-[16px] font-serif font-semibold text-stone-900">{CONFIG.NOME_PROFISSIONAL}</span>
              <span className="block text-[11px] font-bold uppercase tracking-widest text-[#3E4233]">Ver Perfil</span>
            </div>
          </button>
          <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-700 ${step >= i ? 'w-6 bg-stone-900' : 'w-2 bg-stone-300'}`} />
            ))}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        
        {step === 0 && (
          <div className="flex flex-col justify-between min-h-[100dvh] pb-10 pt-16 fade-up">
            <div className="stagger-1">
              <div className="w-24 h-24 bg-stone-200 rounded-full overflow-hidden mb-8 shadow-md">
                 <img src={CONFIG.AVATAR} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-[11px] font-bold tracking-[0.3em] text-[#3E4233] uppercase mb-3">Bem-vindo(a)</h2>
              <h1 className="text-5xl md:text-6xl font-serif font-semibold mb-6 leading-[1.1] text-stone-900">Seu <span className="italic text-[#3E4233]">refúgio</span> de autocuidado.</h1>
              <p className="text-stone-700 text-lg md:text-xl leading-relaxed font-medium mb-12 pr-4">
                Agende sua sessão exclusiva em poucos segundos e garanta um momento de pausa real na sua rotina.
              </p>
            </div>
            
            <div className="space-y-6 stagger-2">
              <div className="flex gap-5 items-start bg-white p-5 rounded-3xl shadow-sm border border-stone-200">
                <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-900"><Icon name="sparkles" size={22} /></div>
                <p className="text-[15px] font-medium text-stone-800 leading-relaxed pt-1">Experiência impecável garantida desde o clique do agendamento até a finalização da terapia.</p>
              </div>
              <button onClick={() => { vibrate(30); store.set('agenda_pro_onboard', 'yes'); setStep(1); }} className={`${btnPrimary} w-full mt-6 text-lg py-5 shadow-2xl`}>
                Reservar Horário
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <p className="text-[11px] font-bold tracking-widest text-[#3E4233] uppercase mb-2">Etapa 01</p>
            <h1 className="text-4xl font-serif font-semibold mb-10 text-stone-900">O que você <span className="italic">precisa hoje?</span></h1>
            
            {!isReturning && (
              <div className="bg-[#3E4233] text-white p-6 rounded-3xl mb-10 shadow-lg flex items-start gap-5 stagger-1">
                <Icon name="leaf" className="mt-0.5 shrink-0" size={24} />
                <p className="text-[15px] leading-relaxed font-medium">Primeira experiência no Studio? Você ganha <strong className="font-bold underline decoration-[#899076] decoration-2 underline-offset-4">R$ {CONFIG.FIRST_TIME_DISCOUNT} de cortesia</strong> no resumo final do seu pedido.</p>
              </div>
            )}

            <div className="space-y-6 stagger-2" role="radiogroup">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id }); }}
                    className={`w-full text-left p-7 rounded-[2rem] transition-all duration-300 border-2 focus-visible:outline focus-visible:outline-stone-900 relative overflow-hidden ${on ? 'bg-stone-900 border-stone-900 shadow-xl transform scale-[1.01]' : 'bg-white border-stone-200 hover:border-stone-400 hover:shadow-md'}`}>
                    {on && <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>}
                    <div className="flex justify-between items-start gap-4 mb-5 relative z-10">
                      <h3 className={`font-serif text-2xl ${on ? 'text-white font-semibold' : 'text-stone-900 font-bold'}`}>{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className={`text-[12px] line-through font-bold block mb-1 ${on ? 'text-stone-400' : 'text-stone-400'}`}>{money(p.originalPrice)}</span>
                        <span className={`font-bold text-xl ${on ? 'text-white' : 'text-stone-900'}`}>{money(p.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-5 relative z-10">
                      <span className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 ${on ? 'bg-stone-800 text-stone-200' : 'bg-stone-100 text-stone-700'}`}><Icon name="clock" size={14} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg ${on ? 'bg-stone-800 text-stone-300' : 'bg-stone-100 text-stone-600'}`}>{t}</span>)}
                    </div>
                    <p className={`text-[15px] leading-relaxed font-medium relative z-10 ${on ? 'text-stone-300' : 'text-stone-600'}`}>{p.desc}</p>
                  </button>
                );
              })}
              
              <div className="pt-8 stagger-3">
                <h3 className="font-serif text-2xl font-semibold text-stone-900 mb-6">Complementos</h3>
                <div className="flex flex-col gap-4">
                  {ADDONS.map((a) => {
                    const on = !!data.addons[a.id];
                    return (
                      <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                        className={`w-full p-6 text-[15px] rounded-3xl border-2 flex justify-between items-center gap-4 transition-all duration-300 ${on ? 'bg-stone-900 border-stone-900 text-white shadow-md' : 'bg-white border-stone-200 text-stone-800 hover:border-stone-400 font-medium'}`}>
                        <span className="flex items-center gap-4">
                          <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${on ? 'bg-white border-white text-stone-900' : 'border-stone-300'}`}>{on && <Icon name="check" size={14} />}</span>
                          <span className={on ? 'font-bold' : ''}>{a.label}</span>
                        </span>
                        <span className={`font-bold ${on ? 'text-stone-300' : 'text-stone-500'}`}>+ {money(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t-2 border-stone-200 flex gap-6 items-center bg-[#F8F8F6]/90 backdrop-blur-md sticky bottom-0 pb-8 -mx-6 px-6 z-20">
              <div className="flex-1">
                 <p className="text-[12px] font-bold tracking-widest text-stone-500 uppercase mb-1">Duração: {invoice.dur} min</p>
                 <p className="text-4xl font-serif font-bold text-stone-900">{money(invoice.base + invoice.addonsTotal)}</p>
              </div>
              <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up pb-10">
            <button onClick={() => setStep(1)} className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-[14px] mb-8 font-bold transition"><Icon name="chevronLeft" size={18} /> Voltar</button>
            <p className="text-[11px] font-bold tracking-widest text-[#3E4233] uppercase mb-2">Etapa 02</p>
            <h1 className="text-4xl font-serif font-semibold mb-10 text-stone-900">Seus dados</h1>
            
            <div className="space-y-10 bg-white p-6 sm:p-8 rounded-[2rem] border border-stone-200 shadow-sm stagger-1">
              <div>
                <label htmlFor="nm" className={labelCls}>Nome Completo</label>
                <input id="nm" autoComplete="name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Digite seu nome" maxLength={60} />
                {touched && errors.name && <p className="text-[13px] font-bold text-red-600 mt-2">{errors.name}</p>}
              </div>

              <div className="pt-4">
                <span className={labelCls}>Local do Atendimento</span>
                <div className="grid grid-cols-2 gap-4" role="radiogroup">
                  {[['studio', 'No Studio'], ['home', 'Em Domicílio']].map(([v, l]) => (
                    <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v as 'studio'|'home' })} className={`${chipBase} text-[15px] ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
                {isHome && <p className="text-[13px] font-medium text-stone-600 mt-4 leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-200">Horários de pico (18h-20h) em domicílio possuem acréscimo de deslocamento de <strong className="text-stone-900">{money(CONFIG.PEAK_FEE)}</strong>.</p>}
              </div>

              {!isHome ? (
                <div className="bg-stone-900 text-white p-6 rounded-2xl flex gap-5 items-start shadow-md">
                   <Icon name="map" size={24} className="text-[#899076] shrink-0 mt-0.5" />
                   <p className="text-[15px] font-medium leading-relaxed">
                     O Studio fica na área central. O endereço completo e as instruções de chegada são enviadas junto com a confirmação.
                   </p>
                </div>
              ) : (
                <div className="space-y-5 fade-up bg-stone-50 p-6 rounded-2xl border border-stone-200 shadow-inner">
                  <p className="text-[14px] font-bold text-stone-800 mb-4">A terapeuta levará maca profissional, toalhas e óleos.</p>
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-5">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-[13px] font-bold text-red-600">{errors.address}</p>}
                </div>
              )}

              <div className="pt-6">
                <span className={labelCls}>Data do agendamento</span>
                <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0" role="radiogroup">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { set({ date: d, time: '' }); }} 
                        className={`shrink-0 snap-start w-[88px] py-5 flex flex-col items-center border-2 rounded-2xl transition-all ${sel ? 'bg-stone-900 border-stone-900 text-white shadow-lg transform scale-[1.03]' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                        <span className={`text-[11px] font-bold tracking-widest uppercase mb-1.5 ${sel ? 'text-stone-400' : 'text-stone-500'}`}>{dayLabel(d, i)}</span>
                        <span className={`text-3xl font-serif font-bold mb-1.5 ${sel ? 'text-white' : 'text-stone-900'}`}>{d.getDate()}</span>
                        <span className="text-[12px] font-bold uppercase tracking-wide">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </button>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-[13px] font-bold text-red-600">{errors.date}</p>}
              </div>

              {data.date && (
                <div className="fade-up pt-4">
                  <span className={labelCls}>Horário de Início</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4" role="radiogroup">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const ok = status === 'ok';
                      const peak = isHome && PEAK_HOURS.includes(t);
                      return (
                        <button key={t} role="radio" aria-checked={sel} disabled={!ok}
                          onClick={() => { vibrate(15); set({ time: t }); }}
                          className={`min-h-[64px] py-2 border-2 rounded-2xl flex flex-col items-center justify-center transition-all ${sel ? 'bg-[#3E4233] border-[#3E4233] text-white shadow-lg transform scale-[1.05]' : ok ? 'bg-white border-stone-200 text-stone-800 font-bold hover:border-stone-400' : 'bg-stone-100 border-stone-100 text-stone-400 cursor-not-allowed'}`}>
                          <span className={`text-[17px] tracking-wide ${sel ? 'font-bold' : ''}`}>{t}</span>
                          {peak && ok && <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${sel ? 'text-stone-300' : 'text-stone-500'}`}>Pico</span>}
                        </button>
                      );
                    })}
                  </div>
                  {availableCount === 0 && <p className="text-[14px] font-bold text-stone-600 text-center py-8 bg-stone-50 rounded-xl mt-4">Agenda completa neste dia. Selecione outra data.</p>}
                  {touched && errors.time && <p className="text-[13px] font-bold text-red-600 mt-4">{errors.time}</p>}
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-end">
              <button onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Preencha os campos obrigatórios'); } }} className={`${btnPrimary} w-full py-5 text-lg`}>Ir para o Pagamento</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up pb-10">
            <button onClick={() => setStep(2)} className="text-stone-500 hover:text-stone-900 flex items-center gap-2 text-[14px] mb-8 font-bold transition"><Icon name="chevronLeft" size={18} /> Voltar e alterar</button>
            <p className="text-[11px] font-bold tracking-widest text-[#3E4233] uppercase mb-2">Etapa 03</p>
            <h1 className="text-4xl font-serif font-semibold mb-10 text-stone-900">Finalizar Reserva</h1>
            
            <div className="space-y-8">
              
              <div className="bg-white p-7 sm:p-10 rounded-[2rem] border border-stone-200 shadow-md relative overflow-hidden stagger-1">
                <div className="absolute top-0 right-0 w-40 h-40 bg-stone-100 rounded-bl-full -mr-10 -mt-10 opacity-60 pointer-events-none"></div>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mb-8 relative z-10">Resumo do Pedido</h3>
                
                <div className="space-y-4 mb-8 relative z-10">
                  <SummaryRow bold label="Serviço" value={pkg.title} />
                  <SummaryRow label="Data" value={<span className="capitalize">{data.date?.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })}</span>} />
                  <SummaryRow label="Horário" value={`${data.time} às ${endTime}`} />
                  <SummaryRow label="Local" value={isHome ? 'Em Domicílio' : 'No Studio'} />
                  {isHome && <p className="text-right text-[13px] font-bold text-stone-500 mt-2">{data.street}, {data.number}</p>}
                </div>
                
                <div className="h-0.5 bg-stone-100 my-8"></div>
                
                <div className="space-y-4 mb-8">
                  <SummaryRow label="Valor base" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <SummaryRow label="Adicionais" value={`+ ${money(invoice.addonsTotal)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between items-center py-3 px-4 bg-[#3E4233] text-white font-bold rounded-xl shadow-inner mt-4 mb-4">
                      <span className="text-[15px] flex items-center gap-2"><Icon name="check" size={16} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Cortesia 1ª Sessão'}</span>
                      <span className="text-[15px]">- {money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.peakFee > 0 && <SummaryRow label="Taxa de deslocamento" value={`+ ${money(invoice.peakFee)}`} />}
                  {invoice.pixDiscount > 0 && <SummaryRow bold label="Desconto Pix (5%)" value={<span className="text-[#3E4233]">- {money(invoice.pixDiscount)}</span>} />}
                </div>

                <div className="flex justify-between items-end pt-6 border-t-2 border-stone-200 mt-8">
                  <span className="text-[13px] text-stone-600 uppercase tracking-widest font-bold">Total Final</span>
                  <span className="text-5xl font-serif font-bold text-stone-900">{money(invoice.total)}</span>
                </div>
              </div>

              <div className="bg-stone-50 p-7 sm:p-10 rounded-[2rem] border border-stone-200 shadow-inner stagger-2">
                <h3 className="font-serif text-xl font-bold text-stone-900 mb-8">Como deseja acertar o restante?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" role="radiogroup">
                  {[['pix', 'Pix (-5%)'], ['card', 'Cartão no local'], ['cash', 'Dinheiro']].map(([id, l]) => (
                    <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => selectPayment(id)} className={`${chipBase} text-[15px] font-bold ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>

                <label htmlFor="rq" className={labelCls}>Observações (Opcional)</label>
                <input id="rq" type="text" placeholder="Alguma sensibilidade ou foco específico?" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={`${inputCls} mb-10 bg-transparent`} />
                
                {!coupon.applied && (
                  <div className="mb-10">
                    <label htmlFor="cp" className={labelCls}>Possui voucher?</label>
                    <div className="flex gap-3">
                      <input id="cp" type="text" autoCapitalize="characters" placeholder="Digite o código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase tracking-widest bg-transparent ${coupon.error ? 'border-red-500' : ''}`} />
                      <button onClick={applyCoupon} className="min-h-[60px] px-8 text-[14px] font-bold rounded-xl border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors">Aplicar</button>
                    </div>
                    {coupon.error && <p className="text-[13px] font-bold text-red-600 mt-3">{coupon.error}</p>}
                  </div>
                )}

                <div className="bg-white p-8 rounded-3xl border border-stone-200 shadow-lg text-center mt-6">
                  <p className="text-[12px] text-stone-500 uppercase tracking-widest font-bold mb-4">Divisão do Pagamento</p>
                  
                  <div className="bg-stone-50 rounded-2xl p-6 mb-6 border border-stone-100 space-y-4">
                     <div className="flex justify-between items-center border-b border-stone-200 pb-3">
                       <span className="text-stone-600 font-medium text-[15px]">1. Sinal (Pix agora):</span>
                       <span className="text-stone-900 font-bold text-lg">{money(invoice.sinal)}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-stone-600 font-medium text-[15px]">2. Restante (No dia):</span>
                       <span className="text-[#3E4233] font-extrabold text-xl">{money(invoice.rest)}</span>
                     </div>
                  </div>

                  <button onClick={copyPix} className="flex items-center justify-center gap-3 text-[15px] font-bold text-stone-800 hover:text-white bg-stone-200 hover:bg-stone-900 px-6 py-4 rounded-xl transition-all w-full sm:w-auto mx-auto"><Icon name="copy" size={20} /> Copiar Chave Pix ({CONFIG.PIX_KEY})</button>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 stagger-3">
              <button onClick={finishBooking} disabled={whatsappSent} className={`${btnPrimary} w-full py-6 text-xl flex items-center justify-center gap-3 shadow-2xl`}>
                {whatsappSent ? 'Gerando pedido...' : 'Confirmar via WhatsApp'}
              </button>
              <p className="text-center text-[13px] font-bold text-stone-500 mt-4 px-4">
                Você será direcionado(a) ao WhatsApp para enviar o comprovante do sinal e aprovar o horário.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-in flex flex-col items-center justify-center min-h-[70vh] text-center pt-10">
            <div className="w-24 h-24 bg-[#3E4233] text-white rounded-full flex items-center justify-center mb-8 shadow-xl">
              <Icon name="check" size={40} />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-6 text-stone-900">Tudo pronto!</h1>
            <p className="text-[16px] font-medium text-stone-600 leading-relaxed mb-12 max-w-sm">
              Sua solicitação foi gerada. <strong className="text-stone-900">Envie o comprovante do Pix na conversa que acabou de abrir</strong> para validarmos sua reserva.
            </p>
            <div className="w-full max-w-sm space-y-4">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} py-5 flex items-center justify-center w-full`}>Abrir WhatsApp Manualmente</a>
              <button onClick={() => { setStep(1); setWhatsappSent(false); }} className="w-full min-h-[60px] text-[15px] font-bold text-stone-500 hover:text-stone-900 transition-colors">Fazer outro agendamento</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}
