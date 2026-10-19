import { useState, useEffect, useMemo, useRef, memo, type ReactNode, type CSSProperties } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÃO — É SÓ AQUI QUE VOCÊ TROCA OS DADOS DE CADA CLIENTE
   ========================================================================== */
const CONFIG = {
  NOME_PROFISSIONAL: 'Marina Albuquerque',
  SUBTITULO: 'Massoterapia e estética',
  BIO: 'Terapias manuais com foco em resultado: menos dor, mais descanso. Atendo no studio ou na sua casa, com maca, toalhas e óleos por minha conta.',
  PHONE: '5511999999999', // formato: 55 + DDD + número (só dígitos)
  PIX_KEY: '123.456.789-00',
  INSTAGRAM: 'https://www.instagram.com/',
  // Deixe vazio '' para usar monograma/gradiente. Use SÓ fotos da própria cliente (foto de banco de imagem = risco de confiança e de direito de imagem).
  AVATAR: '',
  COVER_IMAGE: '',
  TEMA: 'pinho' as 'pinho' | 'ameixa' | 'oceano',
  PREFIXO_STORAGE: 'agenda_marina', // troque por cliente, evita conflito entre sites no mesmo domínio
  // Cupons guardados como hash SHA-256 (não aparecem em texto puro no código). Gere novos: echo -n "CODIGO" | sha256sum
  CUPONS: {
    '97f3d191265f088b2c6c27a1007e5ea39bb59af039bb622273198ef4249fa2ce': { label: 'Boas-vindas', value: 15 }, // R$ 15 fixo
    '6750db4abc5d9f40baba4b6284cfbfb5ff8e8e2573a8625ae936d4a6e6515e6d': { label: 'VIP', value: 0.15 }, // 15%
  } as Record<string, { label: string; value: number }>,
  SIGNAL_AMOUNT: 50,
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
  DAYS_OFF: [0], // 0 = domingo
  // Agenda manual (sem banco): bloqueie aqui o que a profissional já tem ocupado. Formato 'AAAA-MM-DD': ['HH:MM-HH:MM']
  BLOQUEIOS: {
    // '2026-10-23': ['09:00-12:00'],
    // '2026-12-25': ['00:00-23:59'],
  } as Record<string, string[]>,
};

const THEMES = {
  pinho: { brand: '#23403A', dark: '#162B27', accent: '#B08D57', paper: '#F3F5F2', soft: '#E3EAE5' },
  ameixa: { brand: '#4A2C4A', dark: '#321D32', accent: '#C9A27A', paper: '#F7F3F6', soft: '#EBE0EA' },
  oceano: { brand: '#1F3B57', dark: '#14283C', accent: '#C7A97B', paper: '#F2F5F8', soft: '#DFE8F0' },
};

const PACKAGES = [
  { id: 'relaxante', title: 'Massagem relaxante', originalPrice: 190, price: 160, min: 60, tags: ['Aromaterapia', 'Corpo inteiro'],
    desc: 'Movimentos contínuos com óleos essenciais para soltar a tensão do dia a dia e ajudar no sono.' },
  { id: 'drenagem', title: 'Drenagem linfática', originalPrice: 220, price: 180, min: 60, tags: ['Redução de inchaço', 'Modeladora'],
    desc: 'Toques leves que estimulam o sistema linfático e reduzem a retenção de líquido.' },
  { id: 'pedras', title: 'Pedras quentes', originalPrice: 260, price: 220, min: 90, tags: ['Termoterapia'],
    desc: 'O calor das pedras vulcânicas relaxa a musculatura profunda, indicado para dores crônicas e estresse.' },
  { id: 'spa_facial', title: 'Spa facial', originalPrice: 180, price: 140, min: 50, tags: ['Limpeza', 'Hidratação'],
    desc: 'Limpeza, esfoliação suave e máscara nutritiva para devolver viço à pele cansada.' },
];

const ADDONS = [
  { id: 'esfoliacao', label: 'Esfoliação corporal', price: 50 },
  { id: 'escalda', label: 'Escalda-pés com ervas', price: 40 },
];

const PEAK_HOURS = ['18:00', '18:30', '19:00', '19:30'];

/* ==========================================================================
   2. UTILITÁRIOS E SEGURANÇA
   ========================================================================== */
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const money = (v: number) => brl.format(v).replace(/\u00a0/g, ' ');
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate?.(p); } catch (e) {} };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(`${CONFIG.PREFIXO_STORAGE}_${k}`); } catch (e) { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(`${CONFIG.PREFIXO_STORAGE}_${k}`, v); } catch (e) {} },
};
// Privacidade: NENHUM dado pessoal (nome, endereço, CEP) é gravado no aparelho. Só a marca "cliente recorrente".

// Remove caracteres de controle e de formatação do WhatsApp (* _ ~ `), links e limita tamanho.
const clean = (t: string, max = 140) =>
  t.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/[*_~`]+/g, '').replace(/https?:\/\/\S+/gi, '[link removido]').replace(/\s+/g, ' ').trim().slice(0, max);
const cleanName = (t: string) => t.replace(/[^\p{L}\p{M}\s'.-]/gu, '').replace(/\s+/g, ' ').slice(0, 60);
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const safeUrl = (u: string) => { try { return new URL(u).protocol === 'https:' ? u : '#'; } catch (e) { return '#'; } };
const PHONE_OK = /^55\d{10,11}$/.test(CONFIG.PHONE);

const sha256 = async (s: string) => {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
};

const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const dayLabel = (d: Date, i: number) => (i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };

const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  lock: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
  chevronLeft: 'M15 18l-6-6 6-6',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
));

const initials = CONFIG.NOME_PROFISSIONAL.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
const Avatar = ({ size = 48 }: { size?: number }) => {
  const [failed, setFailed] = useState(false);
  if (CONFIG.AVATAR && !failed) {
    return <img src={CONFIG.AVATAR} alt="" width={size} height={size} onError={() => setFailed(true)} referrerPolicy="no-referrer" className="rounded-full object-cover shrink-0" style={{ width: size, height: size }} />;
  }
  return (
    <span className="rounded-full shrink-0 inline-flex items-center justify-center font-serif font-semibold bg-[var(--brand)] text-[var(--paper)]" style={{ width: size, height: size, fontSize: size * 0.38 }} aria-hidden="true">{initials}</span>
  );
};

const inputCls = 'w-full bg-white border border-stone-300 rounded-xl px-4 min-h-[56px] text-[16px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/20 transition';
const labelCls = 'block text-[15px] font-semibold text-stone-900 mb-2';
const errCls = 'text-[14px] font-medium text-red-700 mt-2';
const chipOn = 'bg-[var(--brand)] text-white border-[var(--brand)]';
const chipOff = 'bg-white border-stone-300 text-stone-800 hover:border-stone-500';
const btnPrimary = 'min-h-[56px] px-8 text-[16px] font-semibold rounded-xl bg-[var(--brand)] text-white hover:bg-[var(--dark)] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed';

/* ==========================================================================
   3. APP
   ========================================================================== */
type SlotStatus = 'ok' | 'past' | 'busy';
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}
const EMPTY: BookingData = { name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {} };

const SummaryRow = ({ label, value, bold = false }: { label: string; value: ReactNode; bold?: boolean }) => (
  <div className={`flex justify-between items-baseline gap-4 py-2 text-[15px] ${bold ? 'text-stone-900 font-semibold' : 'text-stone-600'}`}>
    <span>{label}</span><span className="text-right text-stone-900">{value}</span>
  </div>
);

const BottomBar = ({ children }: { children: ReactNode }) => (
  <div className="fixed bottom-0 inset-x-0 z-30 bg-[var(--paper)]/95 backdrop-blur border-t border-stone-300" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
    <div className="max-w-lg mx-auto px-5 py-3 flex items-center gap-4">{children}</div>
  </div>
);

export default function App() {
  const [step, setStep] = useState(0);
  const [isReturning, setIsReturning] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState('');
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '', open: false });
  const [now, setNow] = useState(() => new Date());
  const [ref] = useState(() => Math.random().toString(36).slice(2, 7).toUpperCase());
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cepAbort = useRef<AbortController | null>(null);
  const attempts = useRef({ fails: 0, lockUntil: 0 });
  const [data, setData] = useState<BookingData>(EMPTY);
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const theme = THEMES[CONFIG.TEMA] || THEMES.pinho;
  const themeVars = { '--brand': theme.brand, '--dark': theme.dark, '--accent': theme.accent, '--paper': theme.paper, '--soft': theme.soft } as CSSProperties;

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3200);
  };

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => { if (store.get('ret') === 'yes') setIsReturning(true); }, []);
  useEffect(() => { if (step > 0) window.scrollTo({ top: 0 }); }, [step]);
  useEffect(() => { document.title = `${CONFIG.NOME_PROFISSIONAL} · Agendamento`; }, []);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';

  const invoice = useMemo(() => {
    const activeAddons = ADDONS.filter((a) => data.addons[a.id]);
    const addonsTotal = activeAddons.reduce((s, a) => s + a.price, 0);
    const base = pkg.price + addonsTotal;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? CONFIG.PEAK_FEE : 0;
    let discount = 0;
    if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
    else if (!isReturning) discount = CONFIG.FIRST_TIME_DISCOUNT;
    discount = Math.min(discount, base);
    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    const total = afterDiscount - pixDiscount + peakFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur: pkg.min, activeAddons };
  }, [data.addons, data.time, data.payment, pkg, isHome, isReturning, coupon.applied, coupon.value]);

  const todayKey = dateKey(now);
  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; out.length < CONFIG.DAYS_AHEAD && i < 40; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      if (!CONFIG.DAYS_OFF.includes(d.getDay())) out.push({ d, i });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const slots = useMemo(() => {
    if (!data.date) return [];
    const buffer = isHome ? CONFIG.BUFFER_HOME : CONFIG.BUFFER_STUDIO;
    const lead = isHome ? CONFIG.MIN_LEAD_HOME : CONFIG.MIN_LEAD_STUDIO;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = sameDay(data.date, now);
    const blocks = (CONFIG.BLOQUEIOS[dateKey(data.date)] || []).map((r) => { const [a, b] = r.split('-'); return [toMin(a), toMin(b)]; });
    const out: { t: string; status: SlotStatus }[] = [];
    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      else if (blocks.some(([a, b]) => m < b + buffer && m + invoice.dur + buffer > a)) status = 'busy';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  const periods = [
    { label: 'Manhã', items: slots.filter((s) => toMin(s.t) < 720) },
    { label: 'Tarde', items: slots.filter((s) => toMin(s.t) >= 720 && toMin(s.t) < 1080) },
    { label: 'Noite', items: slots.filter((s) => toMin(s.t) >= 1080) },
  ].filter((p) => p.items.length);

  const errors = {
    name: data.name.trim().split(' ').filter(Boolean).length < 2 ? 'Informe nome e sobrenome.' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !(data.street.trim() && data.number.trim() && data.bairro.trim()) ? 'Preencha rua, número e bairro.' : '',
  };
  const step2Valid = !errors.name && !errors.date && !errors.time && !errors.address;

  const applyCoupon = async () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    if (Date.now() < attempts.current.lockUntil) { setCoupon((c) => ({ ...c, error: 'Muitas tentativas. Aguarde 1 minuto.' })); return; }
    const found = CONFIG.CUPONS[await sha256(code)];
    if (found) {
      attempts.current.fails = 0;
      vibrate([20, 40]); setCoupon({ input: '', applied: found.label, value: found.value, error: '', open: false }); showToast('Cupom aplicado.');
    } else {
      attempts.current.fails += 1;
      if (attempts.current.fails >= 5) { attempts.current = { fails: 0, lockUntil: Date.now() + 60000 }; }
      vibrate(50); setCoupon((c) => ({ ...c, error: 'Cupom inválido ou expirado.' }));
    }
  };

  const copyPix = async () => showToast((await copyText(CONFIG.PIX_KEY)) ? 'Chave Pix copiada.' : `Chave Pix: ${CONFIG.PIX_KEY}`);

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length !== 9) return;
    cepAbort.current?.abort();
    const ctl = new AbortController(); cepAbort.current = ctl;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${masked.replace(/\D/g, '')}/json/`, { signal: ctl.signal, referrerPolicy: 'no-referrer' });
      if (!res.ok) throw new Error('bad');
      const j = await res.json();
      if (j && !j.erro) {
        setData((p) => ({ ...p, street: clean(String(j.logradouro || ''), 100) || p.street, bairro: clean(String(j.bairro || ''), 60) || p.bairro }));
        setTimeout(() => numberRef.current?.focus(), 150);
      } else showToast('CEP não encontrado. Preencha o endereço manualmente.');
    } catch (e) { if ((e as Error).name !== 'AbortError') showToast('Não foi possível buscar o CEP. Preencha manualmente.'); }
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    const loc = !isHome
      ? 'Local: Studio'
      : `Atendimento em domicílio\nEndereço: ${clean(data.street, 100)}, ${clean(data.number, 10)}${data.comp ? ' - ' + clean(data.comp, 40) : ''} - ${clean(data.bairro, 60)}`;
    let t = `Olá, ${CONFIG.NOME_PROFISSIONAL.split(' ')[0]}! Quero confirmar meu agendamento (ref. ${ref}).\n\n`;
    t += `*Nome:* ${clean(data.name, 60)}\n*Dia e hora:* ${dStr}, ${data.time} às ${endTime}\n${loc}\n\n`;
    t += `*Sessão (${invoice.dur} min):* ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `Adicional: ${a.label}\n`));
    if (data.req.trim()) t += `Observação: "${clean(data.req)}"\n`;
    t += `\n*Total:* ${money(invoice.total)}\n*Sinal via Pix:* ${money(invoice.sinal)}\n*Restante no dia:* ${money(invoice.rest)} (${{ pix: 'Pix', card: 'cartão', cash: 'dinheiro' }[data.payment] || ''})\n\n`;
    t += 'Vou enviar o comprovante do sinal em seguida.';
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const openWhatsapp = () => {
    const w = window.open(whatsappLink(), '_blank');
    if (w) w.opener = null; else window.location.href = whatsappLink();
  };

  const finishBooking = () => {
    if (!PHONE_OK) { showToast('Número de WhatsApp inválido na configuração.'); return; }
    if (!data.payment) { vibrate(50); setTouched(true); showToast('Escolha como vai pagar o restante.'); return; }
    if (!data.date || !step2Valid) return;
    store.set('ret', 'yes');
    vibrate([30, 50]);
    openWhatsapp();
    setStep(4);
  };

  const restart = () => { setData(EMPTY); setCoupon({ input: '', applied: '', value: 0, error: '', open: false }); setTouched(false); setStep(1); };

  const goStep3 = () => {
    if (step2Valid) { vibrate(30); setStep(3); return; }
    vibrate(50); setTouched(true); showToast('Falta preencher alguns campos.');
    setTimeout(() => document.querySelector('[data-err]')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60);
  };

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
      body { font-family: 'Figtree', system-ui, sans-serif; background: var(--paper); color: #1c1917; -webkit-tap-highlight-color: transparent; }
      .font-serif { font-family: 'Fraunces', Georgia, serif; }
      @keyframes rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
      @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
      .rise { animation: rise .5s cubic-bezier(.16,1,.3,1) both; }
      .fade { animation: fade .3s ease both; }
      .hide-scrollbar::-webkit-scrollbar { display: none } .hide-scrollbar { scrollbar-width: none }
      button:focus-visible, a:focus-visible, input:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
      @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; } }
    ` }} />
  );

  return (
    <div className="min-h-screen text-stone-900 relative" style={{ ...themeVars, background: 'var(--paper)' }}>
      {toast && <div role="status" aria-live="polite" className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-6 py-3.5 rounded-xl font-medium text-[15px] shadow-2xl rise max-w-[90vw] text-center">{toast}</div>}

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-stone-900/60 fade" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Perfil" className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-7 rise" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-5">
              <Avatar size={72} />
              <button aria-label="Fechar" autoFocus onClick={() => setProfileOpen(false)} className="p-3 -m-2 rounded-full hover:bg-stone-100"><Icon name="close" /></button>
            </div>
            <h2 className="text-2xl font-serif font-semibold">{CONFIG.NOME_PROFISSIONAL}</h2>
            <p className="text-[var(--brand)] font-medium mb-4">{CONFIG.SUBTITULO}</p>
            <p className="text-stone-700 leading-relaxed mb-6">{CONFIG.BIO}</p>
            <a href={safeUrl(CONFIG.INSTAGRAM)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-semibold bg-stone-100 hover:bg-stone-200 min-h-[52px] rounded-xl transition"><Icon name="instagram" /> Ver Instagram</a>
          </div>
        </div>
      )}

      {step > 0 && step < 4 && (
        <header className="sticky top-0 z-40 bg-[var(--paper)]/95 backdrop-blur border-b border-stone-300">
          <div className="max-w-lg mx-auto px-5 py-3 flex justify-between items-center">
            <button onClick={() => setProfileOpen(true)} className="flex items-center gap-3 text-left rounded-xl" aria-label="Abrir perfil">
              <Avatar size={40} />
              <span className="font-serif font-semibold text-[17px]">{CONFIG.NOME_PROFISSIONAL}</span>
            </button>
            <p className="text-[14px] font-medium text-stone-600" aria-live="polite">Passo {step} de 3</p>
          </div>
          <div className="h-1 bg-stone-200" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
            <div className="h-full bg-[var(--brand)] transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }} />
          </div>
        </header>
      )}

      <main className={`max-w-lg mx-auto ${step === 0 ? '' : 'px-5 pt-8 pb-36'}`}>
        {step === 0 && (
          <div className="min-h-[100dvh] flex flex-col">
            <div className="relative h-[42dvh] min-h-[260px] overflow-hidden rounded-b-[2.5rem] bg-[var(--brand)]">
              {CONFIG.COVER_IMAGE ? (
                <img src={CONFIG.COVER_IMAGE} alt="" referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <g fill="none" stroke="var(--accent)" strokeOpacity=".45" strokeWidth="1">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => <ellipse key={i} cx="200" cy="330" rx={90 + i * 38} ry={70 + i * 30} />)}
                  </g>
                </svg>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
                <Avatar size={52} />
                <div><p className="font-serif text-xl font-semibold leading-tight">{CONFIG.NOME_PROFISSIONAL}</p><p className="text-[14px] text-white/85">{CONFIG.SUBTITULO}</p></div>
              </div>
            </div>
            <div className="px-6 pt-10 pb-8 flex-1 flex flex-col justify-between rise">
              <div>
                <h1 className="text-[2.6rem] leading-[1.08] font-serif font-semibold mb-5">Escolha a sessão, o horário e confirme pelo WhatsApp.</h1>
                <p className="text-stone-700 text-lg leading-relaxed">Leva cerca de 2 minutos. Seus dados vão direto para o WhatsApp da profissional e não ficam guardados neste site.</p>
              </div>
              <button onClick={() => { vibrate(30); store.set('onboard', 'yes'); setStep(1); }} className={`${btnPrimary} w-full mt-10 text-lg`}>Agendar horário</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="rise">
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-6">Qual sessão você quer?</h1>
            {!isReturning && (
              <p className="bg-[var(--soft)] text-stone-900 p-4 rounded-xl mb-6 text-[15px] leading-relaxed">Primeira vez? Você ganha <strong>{money(CONFIG.FIRST_TIME_DISCOUNT)} de desconto</strong> no resumo final.</p>
            )}
            <div className="space-y-4" role="radiogroup" aria-label="Sessões">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id, time: '' }); }}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition ${on ? 'bg-[var(--brand)] border-[var(--brand)] text-white' : 'bg-white border-stone-200 hover:border-stone-400'}`}>
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-serif text-[1.35rem] font-semibold leading-snug">{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className={`text-[13px] line-through block ${on ? 'text-white/60' : 'text-stone-500'}`}>{money(p.originalPrice)}</span>
                        <span className="font-bold text-lg">{money(p.price)}</span>
                      </div>
                    </div>
                    <p className={`text-[15px] leading-relaxed mb-3 ${on ? 'text-white/85' : 'text-stone-600'}`}>{p.desc}</p>
                    <p className={`text-[14px] flex items-center gap-1.5 ${on ? 'text-white/85' : 'text-stone-600'}`}><Icon name="clock" size={15} /> {p.min} min · {p.tags.join(', ')}</p>
                  </button>
                );
              })}
            </div>
            <h2 className="font-serif text-xl font-semibold mt-9 mb-3">Quer adicionar algo?</h2>
            <div className="flex flex-col gap-3">
              {ADDONS.map((a) => {
                const on = !!data.addons[a.id];
                return (
                  <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                    className={`w-full p-4 min-h-[60px] rounded-xl border-2 flex justify-between items-center gap-3 transition ${on ? 'border-[var(--brand)] bg-[var(--soft)]' : 'bg-white border-stone-200 hover:border-stone-400'}`}>
                    <span className="flex items-center gap-3 font-medium">
                      <span className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${on ? 'bg-[var(--brand)] border-[var(--brand)] text-white' : 'border-stone-400'}`}>{on && <Icon name="check" size={14} />}</span>
                      {a.label}
                    </span>
                    <span className="font-semibold text-stone-700">+ {money(a.price)}</span>
                  </button>
                );
              })}
            </div>
            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-600">{invoice.dur} min</p><p className="text-2xl font-serif font-semibold">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
            </BottomBar>
          </div>
        )}

        {step === 2 && (
          <div className="rise">
            <button onClick={() => setStep(1)} className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[15px] mb-5 font-medium min-h-[44px]"><Icon name="chevronLeft" size={18} /> Voltar</button>
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-6">Quando e onde?</h1>

            <section className="mb-8">
              <label htmlFor="nm" className={labelCls}>Seu nome completo</label>
              <input id="nm" autoComplete="name" type="text" value={data.name} onChange={(e) => set({ name: cleanName(e.target.value) })} className={inputCls} placeholder="Ex.: Ana Souza" maxLength={60} aria-invalid={touched && !!errors.name} />
              {touched && errors.name && <p data-err className={errCls}>{errors.name}</p>}
            </section>

            <section className="mb-8">
              <span className={labelCls}>Onde será o atendimento?</span>
              <div className="grid grid-cols-2 gap-3" role="radiogroup">
                {[['studio', 'No studio'], ['home', 'Na minha casa']].map(([v, l]) => (
                  <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v as 'studio' | 'home', time: '' })} className={`min-h-[56px] rounded-xl border-2 font-semibold transition ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                ))}
              </div>
              {!isHome ? (
                <p className="text-[14px] text-stone-600 mt-3 flex gap-2"><Icon name="map" size={18} className="mt-0.5" />O endereço do studio e como chegar chegam junto com a confirmação.</p>
              ) : (
                <div className="mt-4 space-y-3 bg-white p-4 rounded-2xl border border-stone-200">
                  <p className="text-[14px] text-stone-600">Levo maca, toalhas e óleos. Horários das 18h às 20h têm acréscimo de {money(CONFIG.PEAK_FEE)} de deslocamento.</p>
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche o endereço)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="address-line1" placeholder="Rua ou avenida" aria-label="Rua ou avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Número" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-2/5`} />
                    <input type="text" placeholder="Complemento" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-3/5`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p data-err className={errCls}>{errors.address}</p>}
                </div>
              )}
            </section>

            <section className="mb-8">
              <span className={labelCls}>Dia</span>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar -mx-5 px-5" role="radiogroup">
                {days.map(({ d, i }) => {
                  const sel = sameDay(data.date, d);
                  return (
                    <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { vibrate(10); set({ date: d, time: '' }); }}
                      className={`shrink-0 snap-start w-[76px] py-3.5 flex flex-col items-center border-2 rounded-xl transition ${sel ? chipOn : chipOff}`}>
                      <span className={`text-[13px] capitalize ${sel ? 'text-white/80' : 'text-stone-500'}`}>{dayLabel(d, i)}</span>
                      <span className="text-2xl font-serif font-semibold my-0.5">{d.getDate()}</span>
                      <span className={`text-[13px] ${sel ? 'text-white/80' : 'text-stone-500'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                    </button>
                  );
                })}
              </div>
              {touched && errors.date && <p data-err className={errCls}>{errors.date}</p>}
            </section>

            {data.date && (
              <section className="fade">
                <span className={labelCls}>Horário de início <span className="font-normal text-stone-500">({invoice.dur} min de sessão)</span></span>
                {availableCount === 0 ? (
                  <p className="text-[15px] text-stone-700 bg-white border border-stone-200 rounded-xl p-5">Sem horários livres neste dia. Escolha outra data.</p>
                ) : periods.map((p) => (
                  <div key={p.label} className="mb-5">
                    <p className="text-[14px] text-stone-500 mb-2">{p.label}</p>
                    <div className="grid grid-cols-4 gap-2.5" role="radiogroup">
                      {p.items.map(({ t, status }) => {
                        const sel = data.time === t, ok = status === 'ok', peak = isHome && PEAK_HOURS.includes(t);
                        return (
                          <button key={t} role="radio" aria-checked={sel} disabled={!ok} aria-label={`${t}${ok ? '' : ', indisponível'}`} onClick={() => { vibrate(15); set({ time: t }); }}
                            className={`min-h-[52px] border-2 rounded-xl flex flex-col items-center justify-center transition text-[16px] ${sel ? chipOn + ' font-semibold' : ok ? 'bg-white border-stone-300 hover:border-stone-500' : 'bg-stone-100 border-stone-100 text-stone-400 line-through cursor-not-allowed'}`}>
                            {t}{peak && ok && <span className={`text-[10px] leading-none mt-0.5 ${sel ? 'text-white/80' : 'text-stone-500'}`}>+{money(CONFIG.PEAK_FEE)}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {data.time && <p className="text-[14px] text-stone-600">Sessão das {data.time} às {endTime}.</p>}
                {touched && errors.time && <p data-err className={errCls}>{errors.time}</p>}
              </section>
            )}

            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-600">{pkg.title}</p><p className="text-xl font-serif font-semibold">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button onClick={goStep3} className={btnPrimary}>Revisar e pagar</button>
            </BottomBar>
          </div>
        )}

        {step === 3 && (
          <div className="rise">
            <button onClick={() => setStep(2)} className="text-stone-600 hover:text-stone-900 flex items-center gap-1 text-[15px] mb-5 font-medium min-h-[44px]"><Icon name="chevronLeft" size={18} /> Alterar dados</button>
            <h1 className="text-[2rem] leading-tight font-serif font-semibold mb-6">Revise e confirme</h1>

            <section className="bg-white p-6 rounded-2xl border border-stone-200 mb-6">
              <SummaryRow bold label="Sessão" value={pkg.title} />
              <SummaryRow label="Dia" value={<span className="capitalize">{data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}</span>} />
              <SummaryRow label="Horário" value={`${data.time} às ${endTime}`} />
              <SummaryRow label="Local" value={isHome ? `${clean(data.street, 100)}, ${clean(data.number, 10)}` : 'Studio'} />
              <div className="h-px bg-stone-200 my-3" />
              <SummaryRow label="Sessão" value={money(invoice.base)} />
              {invoice.activeAddons.map((a) => <SummaryRow key={a.id} label={a.label} value={`+ ${money(a.price)}`} />)}
              {invoice.discount > 0 && <SummaryRow label={coupon.applied ? `Cupom ${coupon.applied}` : 'Desconto 1ª sessão'} value={<span className="text-emerald-800 font-semibold">- {money(invoice.discount)}</span>} />}
              {invoice.peakFee > 0 && <SummaryRow label="Deslocamento (horário de pico)" value={`+ ${money(invoice.peakFee)}`} />}
              {invoice.pixDiscount > 0 && <SummaryRow label="Desconto Pix (5%)" value={<span className="text-emerald-800 font-semibold">- {money(invoice.pixDiscount)}</span>} />}
              <div className="flex justify-between items-baseline pt-4 mt-3 border-t border-stone-300">
                <span className="font-semibold">Total</span>
                <span className="text-4xl font-serif font-semibold">{money(invoice.total)}</span>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="font-serif text-xl font-semibold mb-3">Como paga o restante no dia?</h2>
              <div className="grid grid-cols-3 gap-2.5" role="radiogroup">
                {[['pix', 'Pix (-5%)'], ['card', 'Cartão'], ['cash', 'Dinheiro']].map(([id, l]) => (
                  <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => { vibrate(15); set({ payment: id }); }} className={`min-h-[56px] rounded-xl border-2 text-[15px] font-semibold transition ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                ))}
              </div>
              {touched && !data.payment && <p data-err className={errCls}>Escolha uma forma de pagamento.</p>}
            </section>

            <section className="mb-6">
              <label htmlFor="rq" className={labelCls}>Alguma observação? <span className="font-normal text-stone-500">(opcional)</span></label>
              <input id="rq" type="text" placeholder="Sensibilidade, região com dor, preferência de pressão" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={inputCls} />
            </section>

            <section className="mb-6">
              {!coupon.applied && (coupon.open ? (
                <div>
                  <label htmlFor="cp" className={labelCls}>Código do cupom</label>
                  <div className="flex gap-3">
                    <input id="cp" type="text" autoCapitalize="characters" autoComplete="off" maxLength={30} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase ${coupon.error ? 'border-red-600' : ''}`} />
                    <button onClick={applyCoupon} className="min-h-[56px] px-6 font-semibold rounded-xl border-2 border-[var(--brand)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white transition">Aplicar</button>
                  </div>
                  {coupon.error && <p className={errCls}>{coupon.error}</p>}
                </div>
              ) : (
                <button onClick={() => setCoupon({ ...coupon, open: true })} className="text-[15px] font-semibold text-[var(--brand)] underline underline-offset-4 min-h-[44px]">Tenho um cupom</button>
              ))}
            </section>

            <section className="bg-[var(--soft)] p-6 rounded-2xl mb-4">
              <h2 className="font-serif text-xl font-semibold mb-1">Sinal para reservar o horário</h2>
              <p className="text-[14px] text-stone-700 mb-4">Pague o sinal por Pix e envie o comprovante no WhatsApp.</p>
              <div className="bg-white rounded-xl p-4 space-y-2 mb-4">
                <div className="flex justify-between"><span className="text-stone-600">Sinal agora (Pix)</span><strong>{money(invoice.sinal)}</strong></div>
                <div className="flex justify-between"><span className="text-stone-600">Restante no dia</span><strong>{money(invoice.rest)}</strong></div>
              </div>
              <button onClick={copyPix} className="w-full min-h-[52px] flex items-center justify-center gap-2 font-semibold rounded-xl bg-white border-2 border-stone-300 hover:border-[var(--brand)] transition"><Icon name="copy" size={18} /> Copiar chave Pix</button>
              <p className="text-[13px] text-stone-600 text-center mt-2 break-all">{CONFIG.PIX_KEY}</p>
            </section>
            <p className="text-[13px] text-stone-600 flex items-start gap-2"><Icon name="lock" size={16} className="mt-0.5" />Seus dados são enviados apenas pelo WhatsApp. Este site não guarda nome, endereço nem telefone.</p>

            <BottomBar>
              <div className="flex-1"><p className="text-[13px] text-stone-600">Total</p><p className="text-xl font-serif font-semibold">{money(invoice.total)}</p></div>
              <button onClick={finishBooking} className={btnPrimary}>Confirmar no WhatsApp</button>
            </BottomBar>
          </div>
        )}

        {step === 4 && (
          <div className="fade flex flex-col items-center text-center pt-16">
            <div className="w-20 h-20 bg-[var(--brand)] text-white rounded-full flex items-center justify-center mb-6"><Icon name="check" size={36} /></div>
            <h1 className="text-[2rem] font-serif font-semibold mb-2">Falta só enviar o comprovante</h1>
            <p className="text-stone-600 mb-8">Referência do pedido: <strong className="text-stone-900">{ref}</strong></p>
            <ol className="text-left w-full space-y-3 mb-10 text-[16px]">
              <li className="bg-white border border-stone-200 rounded-xl p-4">Pague o sinal de <strong>{money(invoice.sinal)}</strong> por Pix.</li>
              <li className="bg-white border border-stone-200 rounded-xl p-4">Envie o comprovante na conversa do WhatsApp.</li>
              <li className="bg-white border border-stone-200 rounded-xl p-4">Aguarde a confirmação do horário.</li>
            </ol>
            <div className="w-full space-y-3">
              <button onClick={openWhatsapp} className={`${btnPrimary} w-full`}>Abrir WhatsApp de novo</button>
              <button onClick={restart} className="w-full min-h-[52px] font-semibold text-stone-600 hover:text-stone-900">Fazer outro agendamento</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}
