import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÃO (O que você vai mudar para cada cliente)
   ========================================================================== */
const CONFIG = {
  NOME_PROFISSIONAL: 'Marina Terapias',
  PHONE: '5511999999999', // Coloque o número do cliente aqui
  PIX_KEY: '123.456.789-00', // CPF ou CNPJ da cliente
  INSTAGRAM: 'https://www.instagram.com/',
  REVIEW_LINK: 'https://g.page/',
  AVATAR: 'https://i.pravatar.cc/150?img=47', // Foto genérica feminina para teste
  COUPONS: { BEMVINDA10: 10, OFF20: 0.20 } as Record<string, number>,
  SIGNAL_AMOUNT: 50,
  FIRST_TIME_DISCOUNT: 20,
  PEAK_FEE: 30,
  PIX_DISCOUNT: 0.05,
  OPEN_MIN: 8 * 60,
  LAST_END_MIN: 20 * 60,
  SLOT_STEP: 60,
  BUFFER_STUDIO: 15,
  BUFFER_HOME: 45,
  MIN_LEAD_STUDIO: 60,
  MIN_LEAD_HOME: 120,
  DAYS_AHEAD: 15,
  DAYS_OFF: [0], // 0 = Domingo
};

const PACKAGES = [
  { id: 'relaxante', title: 'Massagem Relaxante', originalPrice: 180, price: 150, min: 60, tags: ['Óleos Essenciais', 'Corpo Todo'],
    desc: 'Manobras suaves e profundas para aliviar a tensão muscular, melhorar a circulação e promover um relaxamento mental completo.' },
  { id: 'drenagem', title: 'Drenagem Linfática', originalPrice: 200, price: 160, min: 50, tags: ['Retenção de Líquidos', 'Estética'],
    desc: 'Técnica de massagem que estimula o sistema linfático, reduzindo inchaços, celulite e toxinas do corpo. Ideal para o dia a dia ou pós-operatório.' },
  { id: 'pedras', title: 'Terapia com Pedras Quentes', originalPrice: 250, price: 210, min: 80, tags: ['Calor Terapêutico', 'Profundo'],
    desc: 'A combinação perfeita entre a massagem manual e o calor das pedras vulcânicas. Derrete contraturas crônicas e alinha a energia.' },
  { id: 'limpeza', title: 'Limpeza de Pele Profunda', originalPrice: 160, price: 130, min: 60, tags: ['Facial', 'Extração'],
    desc: 'Remoção de cravos, impurezas e células mortas. Inclui vapor de ozônio, alta frequência e máscara de hidratação final.' },
];

const ADDONS = [
  { id: 'esfoliacao', label: 'Esfoliação Corporal', price: 40 },
  { id: 'mascara', label: 'Máscara Facial de Ouro', price: 60 },
];

const PEAK_HOURS = ['18:00', '19:00'];

/* ==========================================================================
   2. UTILITÁRIOS
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
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
};

type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name] || ''} />
  </svg>
));

const inputCls = 'w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 min-h-[52px] text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/30 transition-colors';
const labelCls = 'block text-xs font-semibold text-zinc-300 mb-3';
const chipBase = 'min-h-[52px] border rounded-2xl transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400 focus-visible:outline-offset-2';
const chipOn = 'bg-zinc-100 text-zinc-950 border-zinc-100 font-semibold';
const chipOff = 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800';
const btnPrimary = 'min-h-[52px] px-6 text-sm font-bold rounded-xl bg-rose-600 text-white hover:bg-rose-500 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 disabled:bg-zinc-800 disabled:text-zinc-500 disabled:cursor-not-allowed';
const btnGhost = 'min-h-[52px] px-5 text-sm font-semibold rounded-xl border border-zinc-600 text-zinc-200 hover:bg-zinc-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400';

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

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (store.get('agenda_onboard') === 'yes') setStep(1);
    if (store.get('agenda_returning') === 'yes') setIsReturning(true);
    const draft = store.get('agenda_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '', cep: d.cep || '' }));
      } catch (e) {}
    }
  }, [isLoading]);

  useEffect(() => {
    if (data.name.length > 2) {
      store.set('agenda_draft', JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro, cep: data.cep }));
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
    
    return { base: pkg.price, addonsTotal, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
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
    
    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  const errors = {
    name: data.name.trim().length < 3 ? 'Informe seu nome.' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !(data.street && data.number && data.bairro) ? 'Preencha rua, número e bairro.' : '',
  };
  const step2Valid = !errors.name && data.date && data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase();
    if (!code) return;
    const val = CONFIG.COUPONS[code];
    if (val) {
      vibrate([20, 40]); setCoupon({ input: '', applied: code, value: val, error: '' }); showToast('Cupom ativado');
    } else {
      vibrate(50); setCoupon((c) => ({ ...c, error: 'Cupom inválido ou expirado.' }));
    }
  };

  const forgetMe = () => {
    store.del('agenda_draft'); 
    set({ name: '', cep: '', street: '', number: '', comp: '', bairro: '' });
    showToast('Dados apagados deste aparelho');
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
        else showToast('CEP não encontrado. Preencha manualmente.');
      } catch (e) { showToast('Sem conexão para buscar o CEP.'); }
    }
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc;
    if (!isHome) loc = '📍 *Local:* Irei até o seu espaço na clínica.';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}`;
      loc = `📍 *Local:* Você virá até mim.\n*Endereço:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    
    let t = `Oi ${CONFIG.NOME_PROFISSIONAL.split(' ')[0]}! Fechei pelo seu site e quero confirmar meu horário.\n\n*NOME:* ${clean(data.name)}\n`;
    t += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    
    t += `*SERVIÇO (${invoice.dur} min):*\n✅ ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `➕ ${a.label}\n`));
    if (data.req.trim()) t += `\n*OBSERVAÇÃO:* "${clean(data.req)}"\n`;
    
    t += `\n*RESUMO DO PAGAMENTO:*\n*Valor Total:* ${money(invoice.total)} (${data.payment.toUpperCase()})\n`;
    t += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (no dia):* ${money(invoice.rest)}\n\n`;
    
    t += 'Aguardo sua confirmação para mandar o comprovante do Pix!';
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const finishBooking = () => {
    if (!data.payment) { vibrate(50); showToast('Escolha a forma de pagamento'); return; }
    if (!data.date) return;
    
    store.set('agenda_returning', 'yes'); 
    store.del('agenda_draft');
    
    const link = whatsappLink();
    vibrate([30, 50]);
    window.location.href = link;
    setStep(4);
  };

  const resetFlow = () => {
    vibrate(15); setTouched(false);
    setData((p) => ({ name: p.name, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {} }));
    setStep(1);
  };

  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes fadeUp { from { opacity:0; transform: translateY(12px) } to { opacity:1; transform:none } }
      @keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
      .fade-up { animation: fadeUp .4s ease both }
      .load-bar { animation: slide 1.2s infinite ease-in-out }
      .hide-scrollbar::-webkit-scrollbar { display:none } .hide-scrollbar { scrollbar-width:none }
      @media (prefers-reduced-motion: reduce) { .fade-up, .load-bar { animation: none } * { transition: none !important } }
    ` }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
        <h1 className="text-sm text-zinc-300 tracking-[0.25em] uppercase mb-8 text-center">Cuidando de você</h1>
        <div className="w-40 h-0.5 bg-zinc-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-zinc-300 load-bar rounded-full" />
        </div>
        {css}
      </div>
    );
  }

  const Summary = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex justify-between gap-4 text-sm"><span className="text-zinc-400">{label}</span><span className="text-zinc-100 font-medium text-right">{value}</span></div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-rose-500/30 pb-12 relative">
      {toast && (
        <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-zinc-100 text-zinc-900 px-6 py-3 rounded-full font-medium text-sm shadow-xl fade-up max-w-[90vw] text-center">{toast}</div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-zinc-950/85 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Perfil" className="bg-zinc-900 border border-zinc-700 rounded-3xl w-full max-w-sm p-8 relative shadow-2xl fade-up" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Fechar perfil" autoFocus onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-3 text-zinc-400 hover:text-white rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400"><Icon name="close" /></button>
            <img src={CONFIG.AVATAR} className="w-20 h-20 rounded-full object-cover mb-6 border-2 border-rose-900" alt={`Foto de ${CONFIG.NOME_PROFISSIONAL}`} />
            <h2 className="text-2xl font-light text-zinc-50 mb-1">{CONFIG.NOME_PROFISSIONAL}</h2>
            <p className="text-rose-400 text-xs font-semibold mb-6">Estética & Bem-estar</p>
            <div className="space-y-4 text-sm text-zinc-300 leading-relaxed mb-8">
              <p>{greeting}! Meu espaço foi criado para ser o seu refúgio na rotina. Tratamentos personalizados para o seu corpo e mente.</p>
              <p className="flex items-start gap-3 bg-zinc-950 p-4 rounded-2xl"><Icon name="map" size={18} className="mt-0.5 text-zinc-400" /><span>Atendimentos na clínica no Centro e também em domicílio para o seu conforto máximo.</span></p>
            </div>
            <button onClick={forgetMe} className="w-full text-xs text-zinc-500 hover:text-zinc-200 underline underline-offset-4 min-h-[44px] mb-4">Apagar meus dados deste aparelho</button>
            <div className="pt-6 border-t border-zinc-700 flex justify-center gap-6">
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-zinc-300 hover:text-white min-h-[44px]"><Icon name="instagram" size={18} /> Instagram</a>
            </div>
          </div>
        </div>
      )}

      {step > 0 && step < 4 && (
        <header className="px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 bg-zinc-950/95 backdrop-blur-md z-40 border-b border-zinc-800">
          <button onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400">
            <img src={CONFIG.AVATAR} alt="" className="w-10 h-10 rounded-full object-cover border border-rose-900" />
            <span><span className="block text-sm font-medium text-zinc-100">{CONFIG.NOME_PROFISSIONAL}</span><span className="block text-xs text-zinc-400">Ver perfil</span></span>
          </button>
          <div className="flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(step, 3)} aria-label={`Passo ${Math.min(step, 3)} de 3`}>
            {[1, 2, 3].map((i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-rose-400' : 'w-2 bg-zinc-700'}`} />)}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] fade-up">
            <h1 className="text-4xl md:text-5xl font-light mb-12 leading-tight text-zinc-50">Reserve o seu<br /><span className="text-zinc-400">momento.</span></h1>
            <div className="space-y-4 mb-12">
              <div className="flex gap-4 p-6 bg-zinc-900 rounded-3xl border border-zinc-800"><Icon name="shield" className="text-rose-400 mt-0.5" size={22} /><p className="text-zinc-300 text-sm leading-relaxed">Agendamento rápido e seguro. Seus dados ficam salvos apenas no seu aparelho e a reserva é confirmada direto no WhatsApp.</p></div>
              <div className="flex gap-4 p-6 bg-zinc-900 rounded-3xl border border-zinc-800"><Icon name="check" className="text-rose-400 mt-0.5" size={22} /><p className="text-zinc-300 text-sm leading-relaxed">Garantia de horário exclusivo sem filas e sem espera na clínica.</p></div>
            </div>
            <button onClick={() => { vibrate(30); store.set('agenda_onboard', 'yes'); setStep(1); }} className="bg-zinc-100 text-zinc-950 min-h-[60px] w-full text-sm font-bold rounded-2xl active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400 focus-visible:outline-offset-2">Iniciar agendamento</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-rose-400 mb-2">Passo 1 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-zinc-50">Escolha o serviço</h1>
            
            {!isReturning && (
              <div className="bg-rose-900/20 border border-rose-500/30 p-5 rounded-3xl mb-8 flex items-start gap-4">
                <Icon name="star" className="text-rose-400 mt-0.5 shrink-0" size={22} />
                <p className="text-sm text-zinc-200 leading-relaxed">Sua primeira vez aqui? O desconto de <strong className="text-rose-400">R$ {CONFIG.FIRST_TIME_DISCOUNT}</strong> será aplicado no resumo.</p>
              </div>
            )}

            <div className="space-y-4" role="radiogroup" aria-label="Pacotes">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id }); }}
                    className={`w-full text-left p-6 rounded-3xl transition-all border focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400 ${on ? 'bg-zinc-900 border-rose-400 shadow-lg' : 'bg-zinc-950 border-zinc-700 hover:bg-zinc-900'}`}>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className={`font-medium text-lg ${on ? 'text-zinc-50' : 'text-zinc-200'}`}>{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-xs line-through text-zinc-500 block">{money(p.originalPrice)}</span>
                        <span className={`font-semibold text-lg ${on ? 'text-rose-300' : 'text-zinc-200'}`}>{money(p.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-200 inline-flex items-center gap-1"><Icon name="clock" size={12} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-300">{t}</span>)}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">{p.desc}</p>
                  </button>
                );
              })}
              <div className="pt-6">
                <h3 className="text-sm font-semibold text-zinc-200 mb-4">Adicionais</h3>
                <div className="flex flex-col gap-3">
                  {ADDONS.map((a) => {
                    const on = !!data.addons[a.id];
                    return (
                      <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                        className={`w-full p-5 text-sm rounded-2xl border flex justify-between items-center gap-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400 ${on ? 'bg-zinc-800 border-rose-400 text-zinc-50' : 'bg-zinc-950 border-zinc-700 text-zinc-300 hover:bg-zinc-900'}`}>
                        <span className="flex items-center gap-3"><span className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? 'bg-rose-400 border-rose-400 text-zinc-950' : 'border-zinc-500'}`}>{on && <Icon name="check" size={14} />}</span>{a.label}</span>
                        <span className="font-medium">+ {money(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-6 items-center">
              <div className="flex-1"><p className="text-xs text-zinc-400">Duração: {invoice.dur} min</p><p className="text-2xl font-light text-zinc-50">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-rose-400 mb-2">Passo 2 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-zinc-50">Agendamento</h1>
            <div className="space-y-9">
              <div>
                <label htmlFor="nm" className={labelCls}>Seu nome completo</label>
                <input id="nm" autoComplete="name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Como devo te chamar?" maxLength={60} aria-invalid={touched && !!errors.name} />
                {touched && errors.name && <p className="text-sm text-red-300 mt-2" role="alert">{errors.name}</p>}
              </div>

              <div>
                <span className={labelCls}>Local do atendimento</span>
                <div className="grid grid-cols-2 gap-3" role="radiogroup">
                  {[['studio', 'Na clínica'], ['home', 'No meu endereço']].map(([v, l]) => (
                    <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v as 'studio'|'home' })} className={`${chipBase} text-sm px-3 ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
                {isHome && <p className="text-xs text-zinc-400 mt-3">Horários de pico em domicílio possuem taxa de deslocamento de {money(CONFIG.PEAK_FEE)}.</p>}
              </div>

              {!isHome ? (
                <p className="text-sm text-zinc-300 bg-zinc-900 p-6 rounded-3xl border border-zinc-700 leading-relaxed">
                  O espaço fica localizado no <strong className="text-zinc-50">Centro (próximo à estação central)</strong>. O endereço completo será enviado na confirmação pelo WhatsApp.
                </p>
              ) : (
                <div className="space-y-4 fade-up">
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche a rua)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" aria-label="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Nº" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-sm text-red-300" role="alert">{errors.address}</p>}
                </div>
              )}

              <div>
                <span className={labelCls}>Data</span>
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x hide-scrollbar -mx-6 px-6" role="radiogroup" aria-label="Datas">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { set({ date: d, time: '' }); }} className={`${chipBase} shrink-0 snap-start w-[74px] py-3 flex flex-col items-center ${sel ? chipOn : chipOff}`}>
                        <span className="text-xs font-semibold capitalize">{dayLabel(d, i)}</span>
                        <span className="text-2xl font-light">{d.getDate()}</span>
                        <span className={`text-xs ${sel ? 'text-zinc-600' : 'text-zinc-500'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </button>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-sm text-red-300 mt-2" role="alert">{errors.date}</p>}
              </div>

              {data.date && (
                <div className="fade-up">
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-xs font-semibold text-zinc-300">Horário desejado</span>
                    <span className="text-xs text-zinc-500">Aprovação sujeita à agenda</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3" role="radiogroup" aria-label="Horários">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const ok = status === 'ok';
                      const peak = isHome && PEAK_HOURS.includes(t);
                      return (
                        <button key={t} role="radio" aria-checked={sel} disabled={!ok}
                          onClick={() => { vibrate(15); set({ time: t }); }}
                          className={`${chipBase} py-3 flex flex-col items-center justify-center ${sel ? chipOn : ok ? chipOff : 'bg-zinc-950 border-zinc-800 text-zinc-700 line-through cursor-not-allowed'}`}>
                          <span className="text-sm font-medium">{t}</span>
                          {peak && ok && <span className={`text-[11px] font-semibold ${sel ? 'text-rose-800' : 'text-rose-400'}`}>Pico +{money(CONFIG.PEAK_FEE).replace(',00', '')}</span>}
                        </button>
                      );
                    })}
                  </div>
                  {availableCount === 0 && <p className="text-sm text-zinc-400 text-center py-6">Sem horários para hoje. Escolha o dia de amanhã.</p>}
                  {data.time && <p className="text-sm text-rose-300 mt-4 flex items-center gap-2"><Icon name="check" size={16} /> Horário reservado para pré-avaliação</p>}
                  {touched && errors.time && <p className="text-sm text-red-300 mt-2" role="alert">{errors.time}</p>}
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-3">
              <button onClick={() => setStep(1)} className={`${btnGhost} w-1/3`}>Voltar</button>
              <button onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Complete os campos destacados'); } }} className={`${btnPrimary} flex-1`}>Revisar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-rose-400 mb-2">Passo 3 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-zinc-50">Resumo da sessão</h1>
            <div className="space-y-8">
              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-700 space-y-3">
                <Summary label="Serviço" value={pkg.title} />
                <Summary label="Data" value={data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} />
                <Summary label="Horário" value={`${data.time} – ${endTime}`} />
                <Summary label="Local" value={isHome ? `${data.street}, ${data.number}` : 'Na clínica'} />
                <button onClick={() => setStep(2)} className="text-sm text-rose-300 underline underline-offset-4 pt-2">Alterar informações</button>
              </div>

              <div className="p-6 bg-zinc-900 rounded-3xl border border-zinc-700">
                <div className="space-y-4 mb-6">
                  <Summary label="Serviço base" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <Summary label="Adicionais" value={`+${money(invoice.addonsTotal)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm py-3 border-y border-zinc-800 text-rose-300 font-medium">
                      <span className="flex items-center gap-2"><Icon name="check" size={16} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Desconto 1ª vez'}</span>
                      <span>-{money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.peakFee > 0 && <Summary label="Taxa de deslocamento" value={`+${money(invoice.peakFee)}`} />}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm text-rose-300"><span>Desconto Pix (5%)</span><span className="font-medium">-{money(invoice.pixDiscount)}</span></div>}
                </div>
                <div className="flex justify-between items-end pt-5 border-t border-zinc-800">
                  <span className="text-sm text-zinc-300">Total</span>
                  <span className="text-4xl font-light text-zinc-50">{money(invoice.total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3"><p className="text-zinc-400 text-xs mb-1">Sinal para reservar</p><p className="font-semibold text-rose-300">{money(invoice.sinal)}</p></div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3"><p className="text-zinc-400 text-xs mb-1">Restante no dia</p><p className="font-semibold text-zinc-100">{money(invoice.rest)}</p></div>
                </div>
              </div>

              {!coupon.applied && (
                <div>
                  <label htmlFor="cp" className={labelCls}>Possui cupom de desconto?</label>
                  <div className="flex gap-2">
                    <input id="cp" type="text" autoCapitalize="characters" placeholder="Código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase ${coupon.error ? 'border-red-400' : ''}`} />
                    <button onClick={applyCoupon} className={btnGhost}>Aplicar</button>
                  </div>
                  {coupon.error && <p className="text-sm text-red-300 mt-2" role="alert">{coupon.error}</p>}
                </div>
              )}

              <div>
                <label htmlFor="rq" className={labelCls}>Alguma observação para a sessão?</label>
                <input id="rq" type="text" placeholder="Ex: alergia a óleos, foco nas costas, etc" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={inputCls} />
              </div>

              <div>
                <span className={labelCls}>Pagamento do restante</span>
                <div className="grid grid-cols-3 gap-3" role="radiogroup">
                  {[['pix', 'Pix (-5%)'], ['card', 'Cartão'], ['cash', 'Dinheiro']].map(([id, l]) => (
                    <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => selectPayment(id)} className={`${chipBase} text-xs font-semibold px-2 ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                <p className="text-sm text-zinc-300 leading-relaxed text-center">Para confirmar seu agendamento na agenda, faça o Pix do sinal (<strong className="text-rose-300">{money(invoice.sinal)}</strong>) e envie o comprovante no WhatsApp.</p>
                <button onClick={copyPix} className="mt-4 mx-auto flex items-center gap-2 text-sm font-semibold text-zinc-200 hover:text-white underline underline-offset-4 min-h-[44px]"><Icon name="copy" size={16} /> Copiar chave Pix</button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-800 flex gap-3">
              <button onClick={() => setStep(2)} className={`${btnGhost} w-1/4`}>Voltar</button>
              <button onClick={finishBooking} className={`flex-1 min-h-[56px] text-sm font-bold rounded-xl flex items-center justify-center text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${data.payment ? 'bg-rose-600 text-white hover:bg-rose-500' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}`}>
                Concluir no WhatsApp
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-up flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
            <h1 className="text-3xl font-light mb-4 text-zinc-50">Redirecionando...</h1>
            <p className="text-sm text-zinc-300 leading-relaxed mb-8 max-w-sm">
              Se o WhatsApp não abrir automaticamente, clique no botão abaixo.
            </p>
            <div className="w-full max-w-xs space-y-3">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} flex items-center justify-center w-full`}>Abrir WhatsApp manualmente</a>
              <button onClick={resetFlow} className="w-full min-h-[48px] text-sm text-zinc-500 hover:text-zinc-300 underline underline-offset-4">Voltar ao início</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}
