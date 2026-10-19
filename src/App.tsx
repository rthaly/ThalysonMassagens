import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   1. CONFIGURAÇÃO PREMIUM (Ajuste para a sua cliente)
   ========================================================================== */
const CONFIG = {
  NOME_PROFISSIONAL: 'Marina Albuquerque',
  SUBTITULO: 'Spa & Bem-estar Corporal',
  PHONE: '5511999999999', // Coloque o número do cliente aqui
  PIX_KEY: '123.456.789-00', // CPF ou CNPJ da cliente
  INSTAGRAM: 'https://www.instagram.com/',
  REVIEW_LINK: 'https://g.page/',
  // FOTO: Usando uma imagem de Unsplash de alta qualidade (SPA/Textura)
  COVER_IMAGE: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80', 
  AVATAR: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  COUPONS: { BEMVINDA: 15, VIPS: 0.15 } as Record<string, number>,
  SIGNAL_AMOUNT: 50,
  FIRST_TIME_DISCOUNT: 20,
  PEAK_FEE: 35,
  PIX_DISCOUNT: 0.05,
  OPEN_MIN: 9 * 60, // 09:00
  LAST_END_MIN: 20 * 60, // 20:00
  SLOT_STEP: 30, // Horários a cada 30 min para mais flexibilidade visual
  BUFFER_STUDIO: 30, // Tempo entre sessões
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 120, // 2h de antecedência mínima
  MIN_LEAD_HOME: 240, // 4h de antecedência mínima para domicílio
  DAYS_AHEAD: 14,
  DAYS_OFF: [0], // 0 = Domingo
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
   2. UTILITÁRIOS & ÍCONES MINIMALISTAS
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
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  sparkles: 'M9 3v4 M7 5h4 M19 8v4 M17 10h4 M12 15l-3 6 1.5-6-3-2h4l1.5-4 1.5 4h4l-3 2 1.5 6z',
  chevronLeft: 'M15 18l-6-6 6-6',
};

type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name] || ''} />
  </svg>
));

/* PALETA GOURMET: Fundo claro e areia, textos em cinza escuro/verde oliva suave */
const inputCls = 'w-full bg-stone-50 border-b border-stone-300 px-2 py-4 text-base text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-stone-800 transition-colors bg-transparent rounded-none';
const labelCls = 'block text-xs font-medium tracking-widest text-stone-500 uppercase mt-6 mb-2';
const chipBase = 'min-h-[56px] border rounded-2xl transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-500';
const chipOn = 'bg-stone-800 text-stone-50 border-stone-800 font-medium shadow-md transform scale-[1.02]';
const chipOff = 'bg-white border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50';
const btnPrimary = 'min-h-[56px] px-8 text-[15px] tracking-wide font-medium rounded-2xl bg-[#6B705C] text-white hover:bg-[#585c4b] shadow-lg shadow-[#6B705C]/20 active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6B705C] focus-visible:outline-offset-2 disabled:bg-stone-300 disabled:text-stone-500 disabled:shadow-none disabled:cursor-not-allowed';
const btnSecondary = 'min-h-[56px] px-6 text-[15px] font-medium rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-500';

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
    if (store.get('agenda_spa_onboard') === 'yes') setStep(1);
    if (store.get('agenda_spa_ret') === 'yes') setIsReturning(true);
    const draft = store.get('agenda_spa_draft');
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '', cep: d.cep || '' }));
      } catch (e) {}
    }
  }, [isLoading]);

  useEffect(() => {
    if (data.name.length > 2) {
      store.set('agenda_spa_draft', JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro, cep: data.cep }));
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
    
    // Filtro para garantir que a sessão inteira + buffer cabem no horário de funcionamento
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
    name: data.name.trim().length < 3 ? 'Por favor, informe seu nome.' : '',
    date: !data.date ? 'Escolha uma data para o seu momento.' : '',
    time: data.date && !data.time ? 'Selecione um horário.' : '',
    address: isHome && !(data.street && data.number && data.bairro) ? 'Preencha o endereço completo.' : '',
  };
  const step2Valid = !errors.name && data.date && data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase();
    if (!code) return;
    const val = CONFIG.COUPONS[code];
    if (val) {
      vibrate([20, 40]); setCoupon({ input: '', applied: code, value: val, error: '' }); showToast('Vantagem aplicada!');
    } else {
      vibrate(50); setCoupon((c) => ({ ...c, error: 'Cupom inválido ou expirado.' }));
    }
  };

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY);
    showToast(ok ? 'Chave Pix copiada com sucesso' : `Chave Pix: ${CONFIG.PIX_KEY}`);
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
    if (!isHome) loc = '📍 *Local:* No Studio';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}`;
      loc = `📍 *Atendimento em Domicílio*\n*Endereço:* ${full}`;
    }
    
    let t = `Olá, Marina! Realizei uma reserva pelo seu catálogo e gostaria de confirmar meu horário.\n\n*NOME:* ${clean(data.name)}\n`;
    t += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    
    t += `*SERVIÇO ESCOLHIDO (${invoice.dur} min):*\n✨ ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `🌿 Adicional: ${a.label}\n`));
    if (data.req.trim()) t += `\n*OBSERVAÇÃO:* "${clean(data.req)}"\n`;
    
    t += `\n*DETALHES DO PAGAMENTO:*\n*Valor Total:* ${money(invoice.total)} (Acerto final no ${data.payment.toUpperCase()})\n`;
    t += `*Sinal de Reserva (Pix):* ${money(invoice.sinal)}\n\n`;
    
    t += 'Aguardo sua aprovação para enviar o comprovante do sinal. Obrigado(a)!';
    
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const finishBooking = () => {
    if (!data.payment) { vibrate(50); showToast('Por favor, selecione como deseja acertar o restante no dia.'); return; }
    if (!data.date) return;
    
    store.set('agenda_spa_ret', 'yes'); 
    store.del('agenda_spa_draft');
    
    setWhatsappSent(true);
    setStep(4);
    
    vibrate([30, 50]);
    // Atraso sutil para transição elegante
    setTimeout(() => {
        window.location.href = whatsappLink();
    }, 600);
  };

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
      
      body { font-family: 'Outfit', sans-serif; background-color: #FAFAFA; color: #292524; }
      .font-serif { font-family: 'Playfair Display', serif; }
      
      @keyframes fadeUp { from { opacity:0; transform: translateY(16px) } to { opacity:1; transform:none } }
      @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
      @keyframes pulseSlow { 0%, 100% { opacity: 1; } 50% { opacity: .7; } }
      
      .fade-up { animation: fadeUp .6s cubic-bezier(0.16, 1, 0.3, 1) both; }
      .fade-in { animation: fadeIn .8s ease both; }
      .load-pulse { animation: pulseSlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      
      .hide-scrollbar::-webkit-scrollbar { display:none } .hide-scrollbar { scrollbar-width:none }
      
      /* Efeito Glassmorphism sutil para o header */
      .glass-header {
        background: rgba(250, 250, 250, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid rgba(0,0,0,0.05);
      }
    ` }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F4] flex flex-col items-center justify-center px-6" role="status">
        <Icon name="leaf" size={40} className="text-[#6B705C] mb-6 load-pulse" />
        <h1 className="text-sm font-medium tracking-[0.3em] uppercase text-stone-500 mb-2 font-serif italic text-center">Preparando o seu momento</h1>
        {css}
      </div>
    );
  }

  const SummaryRow = ({ label, value, highlight = false }: { label: string; value: ReactNode; highlight?: boolean }) => (
    <div className={`flex justify-between items-center py-2 ${highlight ? 'text-[#6B705C] font-medium' : 'text-stone-600'}`}>
      <span className="text-sm">{label}</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-stone-800 selection:bg-[#6B705C]/20 pb-16 relative">
      {toast && (
        <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-900 text-white px-6 py-3 rounded-full font-medium text-[13px] tracking-wide shadow-2xl fade-up max-w-[90vw] text-center border border-stone-700">{toast}</div>
      )}

      {/* MODAL DE PERFIL */}
      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-stone-900/60 backdrop-blur-sm fade-in" onClick={() => setProfileOpen(false)}>
          <div role="dialog" aria-modal="true" className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-0 relative shadow-2xl fade-up overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="h-32 bg-stone-200 relative">
               <img src={CONFIG.COVER_IMAGE} className="w-full h-full object-cover" alt="Ambiente do Spa" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
               <button aria-label="Fechar" autoFocus onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/40 transition"><Icon name="close" size={18} /></button>
            </div>
            
            <div className="px-8 pb-8 -mt-12 relative z-10">
              <img src={CONFIG.AVATAR} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-4" alt={CONFIG.NOME_PROFISSIONAL} />
              <h2 className="text-2xl font-serif font-medium text-stone-800">{CONFIG.NOME_PROFISSIONAL}</h2>
              <p className="text-[#6B705C] text-sm tracking-wide mb-6">{CONFIG.SUBTITULO}</p>
              
              <div className="space-y-4 text-[15px] text-stone-600 leading-relaxed mb-8">
                <p>O luxo de pausar. Especialista em terapias manuais e bem-estar, ofereço tratamentos que unem ciência e natureza para reequilibrar seu corpo e mente.</p>
                <div className="bg-[#F5F5F4] p-4 rounded-2xl flex gap-3 items-start border border-stone-200">
                  <Icon name="map" size={18} className="mt-0.5 text-[#6B705C]" />
                  <p className="text-sm">Atendimento em ambiente climatizado, aromatizado e com cromoterapia, ou no conforto do seu domicílio.</p>
                </div>
              </div>
              
              <div className="pt-6 border-t border-stone-200 flex justify-center">
                <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700 hover:text-stone-900 bg-stone-100 px-6 py-3 rounded-xl transition w-full"><Icon name="instagram" size={18} /> Acompanhe no Instagram</a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PROGRESSO (Passos 1 a 3) */}
      {step > 0 && step < 4 && (
        <header className="glass-header px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 z-40 transition-all">
          <button onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl group">
            <img src={CONFIG.AVATAR} alt="" className="w-11 h-11 rounded-full object-cover border-2 border-transparent group-hover:border-stone-300 transition" />
            <div>
              <span className="block text-[15px] font-serif font-medium text-stone-800">{CONFIG.NOME_PROFISSIONAL}</span>
              <span className="block text-[11px] uppercase tracking-wider text-stone-500">Ver Perfil</span>
            </div>
          </button>
          <div className="flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-700 ${step >= i ? 'w-5 bg-[#6B705C]' : 'w-2 bg-stone-200'}`} />
            ))}
          </div>
        </header>
      )}

      <main className="px-6 max-w-lg mx-auto">
        
        {/* PASSO 0: HOME */}
        {step === 0 && (
          <div className="flex flex-col justify-between min-h-[100dvh] pb-10 pt-16 fade-up">
            <div>
              <div className="w-20 h-20 bg-stone-200 rounded-full overflow-hidden mb-8 shadow-sm">
                 <img src={CONFIG.AVATAR} alt="Logo" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-sm tracking-[0.2em] text-stone-500 uppercase mb-2">Bem-vindo(a)</h2>
              <h1 className="text-5xl font-serif font-medium mb-6 leading-tight text-stone-900">O seu <br/><span className="italic text-[#6B705C]">refúgio</span> diário.</h1>
              <p className="text-stone-600 text-lg leading-relaxed font-light mb-12 pr-4">
                Redefina o conceito de descanso. Reserve seu momento de cuidado pessoal em poucos toques, com total exclusividade.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-[#6B705C]"><Icon name="sparkles" size={18} /></div>
                <p className="text-sm text-stone-600 leading-relaxed pt-1">Experiência premium garantida desde o agendamento até o toque final da terapia.</p>
              </div>
              <button onClick={() => { vibrate(30); store.set('agenda_spa_onboard', 'yes'); setStep(1); }} className={`${btnPrimary} w-full mt-4 text-base shadow-xl`}>
                Explorar Tratamentos
              </button>
            </div>
          </div>
        )}

        {/* PASSO 1: SERVIÇOS */}
        {step === 1 && (
          <div className="fade-up">
            <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">Etapa 01</p>
            <h1 className="text-3xl font-serif font-medium mb-8 text-stone-900">Escolha o <span className="italic">cuidado</span></h1>
            
            {!isReturning && (
              <div className="bg-[#6B705C]/5 border border-[#6B705C]/20 p-5 rounded-2xl mb-8 flex items-start gap-4">
                <Icon name="leaf" className="text-[#6B705C] mt-0.5 shrink-0" size={20} />
                <p className="text-[13px] text-stone-700 leading-relaxed">Sua primeira experiência conosco? Um presente de boas-vindas (<strong className="font-medium text-[#6B705C]">R$ {CONFIG.FIRST_TIME_DISCOUNT} de cortesia</strong>) será aplicado no final.</p>
              </div>
            )}

            <div className="space-y-5" role="radiogroup">
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <button key={p.id} role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id }); }}
                    className={`w-full text-left p-6 rounded-3xl transition-all duration-300 border focus-visible:outline focus-visible:outline-[#6B705C] ${on ? 'bg-white border-[#6B705C] shadow-lg shadow-[#6B705C]/10 transform scale-[1.01]' : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-sm'}`}>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <h3 className={`font-serif text-xl ${on ? 'text-stone-900 font-medium' : 'text-stone-800'}`}>{p.title}</h3>
                      <div className="text-right shrink-0">
                        <span className="text-[11px] line-through text-stone-400 block mb-0.5">{money(p.originalPrice)}</span>
                        <span className={`font-medium text-lg ${on ? 'text-[#6B705C]' : 'text-stone-800'}`}>{money(p.price)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-[#F5F5F4] text-stone-600 inline-flex items-center gap-1"><Icon name="clock" size={12} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className="text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded bg-stone-100 text-stone-500">{t}</span>)}
                    </div>
                    <p className="text-[14px] leading-relaxed text-stone-500 font-light">{p.desc}</p>
                  </button>
                );
              })}
              
              <div className="pt-8">
                <h3 className="font-serif text-lg text-stone-900 mb-4">Complemente sua experiência</h3>
                <div className="flex flex-col gap-3">
                  {ADDONS.map((a) => {
                    const on = !!data.addons[a.id];
                    return (
                      <button key={a.id} role="checkbox" aria-checked={on} onClick={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }}
                        className={`w-full p-5 text-sm rounded-2xl border flex justify-between items-center gap-4 transition-all duration-300 ${on ? 'bg-[#6B705C]/5 border-[#6B705C] text-stone-900 shadow-sm' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'}`}>
                        <span className="flex items-center gap-3">
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${on ? 'bg-[#6B705C] border-[#6B705C] text-white' : 'border-stone-300'}`}>{on && <Icon name="check" size={12} />}</span>
                          <span className={on ? 'font-medium' : ''}>{a.label}</span>
                        </span>
                        <span className="font-medium text-stone-500">+ {money(a.price)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-stone-200 flex gap-6 items-center bg-white/50 backdrop-blur sticky bottom-0 pb-6 -mx-6 px-6">
              <div className="flex-1">
                 <p className="text-[11px] tracking-wide text-stone-500 uppercase mb-1">Duração: {invoice.dur} min</p>
                 <p className="text-3xl font-serif text-stone-900">{money(invoice.base + invoice.addonsTotal)}</p>
              </div>
              <button onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Agendar Horário</button>
            </div>
          </div>
        )}

        {/* PASSO 2: AGENDAMENTO */}
        {step === 2 && (
          <div className="fade-up pb-10">
            <button onClick={() => setStep(1)} className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-sm mb-6 font-medium transition"><Icon name="chevronLeft" size={16} /> Voltar aos serviços</button>
            <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">Etapa 02</p>
            <h1 className="text-3xl font-serif font-medium mb-8 text-stone-900">Seus dados</h1>
            
            <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm">
              <div>
                <label htmlFor="nm" className={labelCls}>Nome Completo</label>
                <input id="nm" autoComplete="name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Como gosta de ser chamado(a)?" maxLength={60} />
                {touched && errors.name && <p className="text-xs text-red-500 mt-2">{errors.name}</p>}
              </div>

              <div className="pt-2">
                <span className={labelCls}>Local da Experiência</span>
                <div className="grid grid-cols-2 gap-3" role="radiogroup">
                  {[['studio', 'No Studio'], ['home', 'Em Domicílio']].map(([v, l]) => (
                    <button key={v} role="radio" aria-checked={data.locType === v} onClick={() => set({ locType: v as 'studio'|'home' })} className={`${chipBase} text-[14px] ${data.locType === v ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>
                {isHome && <p className="text-[12px] text-stone-500 mt-3 leading-relaxed">Atendimentos em domicílio nos horários de pico (18h-20h) possuem acréscimo de deslocamento de {money(CONFIG.PEAK_FEE)}.</p>}
              </div>

              {!isHome ? (
                <div className="bg-stone-50 p-5 rounded-2xl border border-stone-100 flex gap-4 items-start">
                   <Icon name="map" size={20} className="text-stone-400 shrink-0 mt-0.5" />
                   <p className="text-[14px] text-stone-600 leading-relaxed">
                     O Studio fica no coração da cidade. Um ambiente silencioso e preparado. O endereço exato é enviado junto com a confirmação.
                   </p>
                </div>
              ) : (
                <div className="space-y-4 fade-up bg-stone-50 p-5 rounded-2xl border border-stone-100">
                  <p className="text-[13px] text-stone-500 mb-4">A terapeuta levará maca, toalhas e todos os óleos essenciais para o seu conforto.</p>
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-4">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Nº" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>
              )}

              <div className="pt-4">
                <span className={labelCls}>Data do agendamento</span>
                <div className="flex gap-3 overflow-x-auto pb-4 pt-1 snap-x hide-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0" role="radiogroup">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <button key={dateKey(d)} role="radio" aria-checked={sel} onClick={() => { set({ date: d, time: '' }); }} 
                        className={`shrink-0 snap-start w-20 py-4 flex flex-col items-center border rounded-2xl transition-all ${sel ? 'bg-stone-800 border-stone-800 text-white shadow-md transform scale-[1.02]' : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400'}`}>
                        <span className={`text-[10px] font-medium tracking-widest uppercase mb-1 ${sel ? 'text-stone-300' : 'text-stone-400'}`}>{dayLabel(d, i)}</span>
                        <span className={`text-2xl font-serif mb-1 ${sel ? 'text-white' : 'text-stone-800'}`}>{d.getDate()}</span>
                        <span className="text-[11px] uppercase tracking-wide">{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </button>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
              </div>

              {data.date && (
                <div className="fade-up pt-2">
                  <span className={labelCls}>Horário de início</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3" role="radiogroup">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const ok = status === 'ok';
                      const peak = isHome && PEAK_HOURS.includes(t);
                      return (
                        <button key={t} role="radio" aria-checked={sel} disabled={!ok}
                          onClick={() => { vibrate(15); set({ time: t }); }}
                          className={`min-h-[54px] py-2 border rounded-xl flex flex-col items-center justify-center transition-all ${sel ? 'bg-[#6B705C] border-[#6B705C] text-white shadow-md' : ok ? 'bg-white border-stone-200 text-stone-700 hover:border-stone-400' : 'bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed'}`}>
                          <span className={`text-[15px] font-medium tracking-wide ${sel ? 'text-white' : ''}`}>{t}</span>
                          {peak && ok && <span className={`text-[9px] uppercase tracking-wider mt-0.5 ${sel ? 'text-stone-200' : 'text-stone-400'}`}>Pico</span>}
                        </button>
                      );
                    })}
                  </div>
                  {availableCount === 0 && <p className="text-[13px] text-stone-500 text-center py-6">Agenda completa neste dia. Por favor, selecione outra data.</p>}
                  {touched && errors.time && <p className="text-xs text-red-500 mt-3">{errors.time}</p>}
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end">
              <button onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Preencha os campos obrigatórios'); } }} className={`${btnPrimary} w-full sm:w-auto`}>Revisar e Finalizar</button>
            </div>
          </div>
        )}

        {/* PASSO 3: REVISÃO E CHECKOUT */}
        {step === 3 && (
          <div className="fade-up pb-10">
            <button onClick={() => setStep(2)} className="text-stone-400 hover:text-stone-700 flex items-center gap-1 text-sm mb-6 font-medium transition"><Icon name="chevronLeft" size={16} /> Alterar dados</button>
            <p className="text-[11px] font-semibold tracking-widest text-stone-400 uppercase mb-2">Etapa 03</p>
            <h1 className="text-3xl font-serif font-medium mb-8 text-stone-900">Finalizar Reserva</h1>
            
            <div className="space-y-6">
              
              {/* CARD DE RESUMO */}
              <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#F5F5F4] rounded-bl-full -mr-10 -mt-10 opacity-50 pointer-events-none"></div>
                <h3 className="font-serif text-xl text-stone-800 mb-6 relative z-10">Sua sessão</h3>
                
                <div className="space-y-3 mb-6 relative z-10">
                  <SummaryRow label="Serviço" value={<span className="font-medium">{pkg.title}</span>} />
                  <SummaryRow label="Data" value={<span className="capitalize">{data.date?.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'long' })}</span>} />
                  <SummaryRow label="Horário" value={`${data.time} às ${endTime}`} />
                  <SummaryRow label="Local" value={isHome ? 'Em Domicílio' : 'No Studio'} />
                  {isHome && <p className="text-right text-[11px] text-stone-400 mt-1">{data.street}, {data.number}</p>}
                </div>
                
                <div className="h-px bg-stone-100 my-6"></div>
                
                <div className="space-y-3 mb-6">
                  <SummaryRow label="Valor base" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <SummaryRow label="Adicionais" value={`+ ${money(invoice.addonsTotal)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between items-center py-2 text-[#6B705C] font-medium bg-[#6B705C]/5 px-3 -mx-3 rounded-lg">
                      <span className="text-sm flex items-center gap-2"><Icon name="check" size={14} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Cortesia 1ª Sessão'}</span>
                      <span className="text-sm">- {money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.peakFee > 0 && <SummaryRow label="Taxa de deslocamento" value={`+ ${money(invoice.peakFee)}`} />}
                  {invoice.pixDiscount > 0 && <SummaryRow label="Desconto Pix (5%)" value={<span className="text-[#6B705C]">- {money(invoice.pixDiscount)}</span>} />}
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-stone-200 mt-6">
                  <span className="text-sm text-stone-500 uppercase tracking-widest font-medium">Total</span>
                  <span className="text-4xl font-serif text-stone-900">{money(invoice.total)}</span>
                </div>
              </div>

              {/* CHECKOUT SECTION */}
              <div className="bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-100">
                <h3 className="font-serif text-lg text-stone-800 mb-6">Como deseja acertar o restante?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8" role="radiogroup">
                  {[['pix', 'Pix (-5%)'], ['card', 'Cartão no local'], ['cash', 'Dinheiro']].map(([id, l]) => (
                    <button key={id} role="radio" aria-checked={data.payment === id} onClick={() => selectPayment(id)} className={`${chipBase} text-[13px] tracking-wide ${data.payment === id ? chipOn : chipOff}`}>{l}</button>
                  ))}
                </div>

                <label htmlFor="rq" className={labelCls}>Observações (Opcional)</label>
                <input id="rq" type="text" placeholder="Alguma área de foco, sensibilidade ou preferência?" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={`${inputCls} mb-8`} />
                
                {!coupon.applied && (
                  <div className="mb-8">
                    <label htmlFor="cp" className={labelCls}>Possui voucher?</label>
                    <div className="flex gap-2">
                      <input id="cp" type="text" autoCapitalize="characters" placeholder="Código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={`${inputCls} flex-1 uppercase tracking-widest ${coupon.error ? 'border-red-400' : ''}`} />
                      <button onClick={applyCoupon} className={`${btnSecondary} !min-h-[48px] !px-4`}>Aplicar</button>
                    </div>
                    {coupon.error && <p className="text-xs text-red-500 mt-2">{coupon.error}</p>}
                  </div>
                )}

                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm text-center">
                  <p className="text-[13px] text-stone-500 uppercase tracking-widest font-medium mb-2">Para garantir o horário</p>
                  <p className="text-sm text-stone-600 leading-relaxed mb-4">
                    Pedimos o adiantamento de <strong className="text-stone-900 font-medium">{money(invoice.sinal)}</strong> via Pix.<br/>O restante (<strong className="text-stone-900 font-medium">{money(invoice.rest)}</strong>) será pago no dia do atendimento.
                  </p>
                  <button onClick={copyPix} className="flex items-center justify-center gap-2 text-[13px] font-medium text-stone-700 hover:text-stone-900 bg-stone-100 px-4 py-2.5 rounded-lg transition w-full mx-auto"><Icon name="copy" size={16} /> Copiar Chave Pix ({CONFIG.PIX_KEY})</button>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button onClick={finishBooking} disabled={whatsappSent} className={`${btnPrimary} w-full flex items-center justify-center gap-3 text-lg`}>
                {whatsappSent ? 'Redirecionando...' : 'Confirmar via WhatsApp'}
              </button>
            </div>
            <p className="text-center text-[11px] text-stone-400 mt-6 pb-4">
              Ao confirmar, você será direcionado para o WhatsApp de {CONFIG.NOME_PROFISSIONAL.split(' ')[0]} para enviar o comprovante do sinal.
            </p>
          </div>
        )}

        {/* PASSO 4: SUCESSO (Redirecionamento) */}
        {step === 4 && (
          <div className="fade-in flex flex-col items-center justify-center min-h-[70vh] text-center pt-10">
            <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <Icon name="check" size={32} className="text-[#6B705C]" />
            </div>
            <h1 className="text-3xl font-serif font-medium mb-4 text-stone-900">Quase lá...</h1>
            <p className="text-[15px] text-stone-600 leading-relaxed mb-10 max-w-sm">
              Sua solicitação está pronta. Para finalizarmos a reserva do horário, envie o comprovante do Pix na conversa que acabou de abrir.
            </p>
            <div className="w-full max-w-xs space-y-4">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} flex items-center justify-center w-full shadow-lg shadow-stone-200`}>Abrir WhatsApp</a>
              <button onClick={() => { setStep(1); setWhatsappSent(false); }} className="w-full min-h-[48px] text-[13px] font-medium text-stone-500 hover:text-stone-800 transition">Voltar ao início</button>
            </div>
          </div>
        )}
      </main>
      {css}
    </div>
  );
}
