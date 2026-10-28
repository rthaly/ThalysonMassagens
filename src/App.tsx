import { useState, useEffect, useMemo, memo, type ReactNode } from 'react';

/* ==========================================================================
   BRAND & LEGAL
   ========================================================================== */
const LEGAL = {
  RAZAO: 'Thalyson Rodrigo dos Santos',
  CNPJ: '62.922.530/0001-44',
  ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo - SP',
  EMAIL: 'relaxecomthalyson@gmail.com',
  ENCARREGADO: 'Thalyson Rodrigo dos Santos',
  EMAIL_DPO: 'relaxecomthalyson@gmail.com',
  ATUALIZADO: '01/01/2025',
  CANCEL_FREE_HOURS: 12,
};

const PACKAGES = [
  { id: 'classica', title: 'Massagem Clássica', price: 180, min: 40, tags: ['Relaxamento Completo','Pistola Relaxante', 'Sem Toque Íntimo'], desc: 'O essencial para quem está com o corpo cansado da rotina.' },
  { id: 'sensitiva', title: 'Sensitiva & Prazer', price: 220, min: 60, tags: ['Tântrica','Pistola Relaxante', 'Finalização lingam'], desc: 'Relaxamento inicial, então toques leves e finalização lingam.' },
  { id: 'fusion', title: 'Sensações com a Barba', price: 290, min: 60, tags: ['Tântrica','Naturista','Pistola Relaxante','Uso de Barba'], desc: 'Massagem clássica, uso da barba, encerramento lingam.' },
  { id: 'completa', title: 'Massagem Corpo a Corpo & Interação', price: 390, min: 60, tags: ['Tântrica','Pistola Relaxante','Naturista','Interação','Você faz massagem'], desc: 'Pacote sem barreiras: clássica, gel corpo a corpo, você faz massagem.' },
  { id: 'aparo_solo', title: 'Apenas Depilação (Máquina)', price: 130, min: 40, tags: ['Estética', 'Sem Massagem'], desc: 'Aparo de pelos (até 3 lugares), pente 1 e 3, utilizando máquina.' },
];

const ADDONS = [
  { id: 'time', label: '+30 min', price: 75 },
  { id: 'aparo', label: 'Aparar pelos (3 lugares)', price: 130 },
];

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

const LOC_TYPES = [
  { id: 'studio', label: 'No meu espaço' },
  { id: 'home', label: 'Vou até você' },
];

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix (-3%)' },
  { id: 'card', label: 'Cartão até 12x' },
  { id: 'cash', label: 'Dinheiro' },
];

/* ==========================================================================
   TYPOGRAPHY & COLOR TOKENS (deliberate, non-template)
   ========================================================================== */
const COLORS = {
  bg: '#0d0d0d',
  surface: '#1a1a1a',
  primary: '#c9a466',      // warm clay - distinctive accent
  primaryHover: '#b89558',
  text: '#e8e6e3',
  muted: '#8b8a88',
  accent: '#4a3b2f',
  warning: '#c4a672',
};

const FONTS = {
  display: "'Merriweather', serif",
  body: "'Inter', system-ui, -apple-system, sans-serif",
  monospace: "'Fira Code', monospace",
};

const TYPE_SCALE = {
  h1: '2.5rem',
  h2: '2rem',
  h3: '1.5rem',
  body: '1rem',
  small: '0.875rem',
};

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

/* ==========================================================================
   ICON COMPONENT
   ========================================================================== */
const Icon = memo(({ name, size = 18, className = '' }: { name: string; size?: number; className?: string }) => {
  const icons: Record<string, string> = {
    shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
    clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
    check: 'M20 6L9 17l-5-5',
    close: 'M18 6L6 18 M6 6l12 12',
    instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z',
    map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    copy: 'M9 9h11v11H9z',
    cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
      <path d={icons[name] || ''} />
    </svg>
  );
});

/* ==========================================================================
   COMPONENTS
   ========================================================================== */
const PackageCard = memo(({ pkg, isSelected, onSelect }: { pkg: any; isSelected: boolean; onSelect: (id: string) => void }) => {
  return (
    <div style={ {
      borderRadius: '12px',
      border: `2px ${isSelected ? 'solid' : 'none'} ${isSelected ? COLORS.primary : 'rgba(255,255,255,0)'}`,
      background: isSelected ? 'rgba(201, 164, 102, 0.08)' : COLORS.surface,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      padding: '24px',
      marginBottom: '12px',
      position: 'relative',
      overflow: 'hidden',
    }} onClick={() => onSelect(pkg.id)}>
      <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' } }>
        <h3 style={ { fontFamily: FONTS.display, fontWeight: 400, fontSize: '1.25rem', color: COLORS.text, margin: 0, lineHeight: 1.3 } }>{pkg.title}</h3>
        <span style={ { fontFamily: FONTS.body, fontSize: '0.75rem', fontWeight: 600, color: COLORS.primary, textTransform: 'uppercase', letterSpacing: '0.05em' } }>R$ {pkg.price}</span>
      </div>
      <p style={ { fontFamily: FONTS.body, fontSize: '0.875rem', color: COLORS.muted, lineHeight: 1.5 } }>{pkg.desc}</p>
      <div style={ { display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' } }>
        {pkg.tags.map((t: string, i: number) => (
          <span key={i} style={ {
            fontFamily: FONTS.body, fontSize: '0.7rem', fontWeight: 500, color: COLORS.primary,
            background: 'rgba(201, 164, 102, 0.15)', padding: '3px 8px', borderRadius: '4px', textTransform: 'capitalize'
          } }>{t}</span>
        ))}
      </div>
    </div>
  );
});

const SummaryLine = ({ label, value }: { label: string; value: ReactNode }) => (
  <div style={ { display: 'flex', justifyContent: 'space-between', fontSize: TYPE_SCALE.small, color: COLORS.muted } }>
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

/* ==========================================================================
   HOOK: booking logic
   ========================================================================== */
type BookingData = {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
};

const useBooking = (initial: BookingData) => {
  const [data, setData] = useState<BookingData>(initial);
  const [step, setStep] = useState(1);
  const [touched, setTouched] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '' });
  const [now, setNow] = useState(() => new Date());
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const choose = (c: 'min' | 'remember') => {
    localStorage.setItem(CONSENT_KEY, c);
    if (c === 'min') localStorage.removeItem('thaly_draft_booking');
  };

  const remember = localStorage.getItem(CONSENT_KEY) === 'remember';

  // Get current package
  const pkg = PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0];
  const isHome = data.locType === 'home';

  // --- Calculate invoice ---
  // Base price
  const basePrice = pkg.price;

  // Addons: collect prices of selected addons
  const selectedAddonIds = Object.keys(data.addons).filter(k => data.addons[k as keyof typeof data.addons]);
  const addonPriceMap = { time: 75, aparo: 130 };
  const addonsTotal = selectedAddonIds.reduce((sum, k) => sum + (addonPriceMap[k as keyof typeof addonPriceMap] || 0), 0);

  // First-time discount if not returning
  const firstTimeDiscount = remember ? 0 : 15;

  // Request fee (fetish/specific)
  const hasReq = data.req.trim().length > 3;
  const reqFee = hasReq ? 140 : 0;

  // Before-discount subtotal
  const subtotalBeforeDiscount = basePrice + addonsTotal + reqFee;

  // Discount applied
  const discount = Math.min(firstTimeDiscount, subtotalBeforeDiscount);

  // After discount
  const afterDiscount = subtotalBeforeDiscount - discount;

  // Pix discount (3%)
  const pixDiscount = data.payment === 'pix' ? Math.ceil(afterDiscount * 0.03) : 0;

  // Peak fee (home + peak hour)
  const peakFee = isHome && data.time && PEAK_HOURS.includes(data.time) ? 18 : 0;

  // Total
  const total = afterDiscount - pixDiscount + peakFee;

  // Signal (minimum 40, max total)
  const sinal = Math.min(40, total);

  // Remaining after signal
  const rest = Math.max(0, total - sinal);

  // Errors
  const errors = {
    name: data.name.trim().length < 3 ? 'Nome precisa ter no min. 3 letras.' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !data.street ? 'Rua, número e bairro.' : '',
  };
  const formValid = !errors.name && !!data.date && !!data.time && !errors.address;

  // CEP lookup
  const handleCep = async (val: string) => {
    const cleanCEP = val.replace(/\D/g, '').slice(0, 8);
    if (cleanCEP.length < 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const j = await res.json();
      if (!j.erro) {
        setData(d => ({ ...d, street: j.logradouro || d.street, bairro: j.bairro || d.bairro }));
        setTimeout(() => {/* focus */}, 100);
      } else showToast('CEP não encontrado.');
    } catch { showToast('Erro ao consultar CEP.'); }
  };

  // WhatsApp link
  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc;
    if (!isHome) {
      loc = '📍 Atendimento no meu espaço, região Bela Vista/Centro Histórico.';
    } else {
      const full = `${data.street}, ${data.number}${data.comp ? ' - ' + data.comp : ''} - ${data.bairro}, São Paulo`;
      loc = `📍 Atendimento no seu endereço.\n*Endereço:* ${full}\n🗺️ Mapa: https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }

    let t = `Oi Thalyson! Fechei pelo site:\n\n*NOME:* ${data.name}\n`;
    t += `*DIA E HORA:* ${dStr} das ${data.time} às ${Number(data.time.split(':')[0]) + pkg.min / 60 + (selectedAddonIds.includes('time') ? 0.5 : 0)}h\n${loc}\n\n`;
    t += `*PACOTE:* ${pkg.title} (${pkg.min} min)\n`;
    if (selectedAddonIds.length > 0) {
      t += 'Adicionais:\n';
      selectedAddonIds.forEach(k => {
        const a = ADDONS.find(x => x.id === k);
        if (a) t += `- ${a.label}\n`;
      });
    }
    t += `*PAGAMENTO:* ${data.payment.toUpperCase()}\n*Sinal:* ${money(sinal)} via Pix\n*Restante:* ${money(rest)} após sessão\n`;
    t += '✅ Declaro ter 18 anos ou mais.\n';
    t += 'Aguardo confirmação!';
    return `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(t)}`;
  };

  const finishBooking = () => {
    if (!data.payment) { showToast('Escolha forma de pagamento'); return; }
    if (!data.date || !data.time) { showToast('Preencha data e horário'); return; }
    const link = whatsappLink();
    localStorage.setItem('thaly_returning_final', 'yes');
    localStorage.removeItem('thaly_draft_booking');
    window.open(link, '_blank');
    showToast('Solicitação enviada. WhatsApp abrirá em nova aba.');
  };

  const resetFlow = () => {
    setData(initial);
    setStep(1);
    setTouched(false);
  };

  return {
    data, setData, step, setStep, touched, setTouched,
    coupon, setCoupon, now, setNow, profileOpen, setProfileOpen,
    toast, setToast, pkg, formValid, errors,
    handleCep, finishBooking, resetFlow,
  };
};

/* ==========================================================================
   SINGLE-PAGE COMPONENT
   ========================================================================== */
export default function SinglePageBooking() {
  const initial: BookingData = {
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {},
  };

  const { data, setData, step, setStep, touched, setTouched, coupon, setCoupon, now, setNow, pkg, formValid, errors,
    handleCep, finishBooking, resetFlow } = useBooking(initial);

  const greeting = now.getHours() < 12 ? 'Bom dia' : now.getHours() < 18 ? 'Boa tarde' : 'Boa noite';

  // Available days (next 14)
  const days = useMemo(() => {
    const out: Date[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i);
      out.push(d);
    }
    return out;
  }, []);

  // Time slots (simplified: hourly from 9h to 23:30)
  const slots = useMemo(() => {
    if (!data.date) return [];
    const buffer = isHome ? 60 : 15;
    const lead = isHome ? 60 : 30;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = data.date && now.getFullYear() === data.date.getFullYear() &&
      now.getMonth() === data.date.getMonth() && now.getDate() === data.date.getDate();

    const out: { t: string; available: boolean }[] = [];
    for (let m = 9 * 60; m <= 23 * 60 + 30; m += 60) {
      const end = m + pkg.min + buffer;
      let available = true;
      if (today && m < nowMin + lead) available = false;
      out.push({ t: `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`, available });
    }
    return out;
  }, [data.date, pkg.min, isHome]);

  // Interval to update time
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  // Step navigation
  const nextStep = () => {
    if (step < 3) {
      if (step === 2 && !formValid) {
        setTouched(true);
        return;
      }
      setStep(step + 1);
    }
  };
  const prevStep = () => setStep(Math.max(1, step - 1));

  // Coupon apply
  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase();
    if (!code) return;
    if (code === 'SESSAO2' || code === 'RELAXAR13') {
      setCoupon({ input: code, applied: code, value: code === 'SESSAO2' ? 8 : 13, error: '' });
      showToast('Cupom ativado!');
    } else {
      setCoupon(prev => ({ ...prev, error: 'Cupom inválido.' }));
    }
  };

  // Render current package for display
  const currentPkg = PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0];

  return (
    <div style={ {
      minHeight: '100vh',
      backgroundColor: COLORS.bg,
      color: COLORS.text,
      fontFamily: FONTS.body,
      lineHeight: 1.6,
      margin: 0,
      padding: '40px 24px',
      maxWidth: '800px',
      margin: '0 auto',
      boxSizing: 'border-box',
    }}>

      {/* HEADER */}
      <header style={ {
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        paddingBottom: '24px',
        marginBottom: '32px',
      }}>
        <div style={ { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' } }>
          <span style={ {
            fontFamily: FONTS.display, fontSize: '2rem', fontWeight: 400, color: COLORS.primary, letterSpacing: '-0.02em'
          }}>Thalyson Massagens</span>
          <small style={ { fontFamily: FONTS.body, fontSize: '0.75rem', color: COLORS.muted, textTransform: 'uppercase', letterSpacing: '0.1em' } }>SP • Bela Vista</small>
        </div>
        <p style={ {
          fontFamily: FONTS.body, fontSize: '0.875rem', color: COLORS.muted,
          fontStyle: 'italic', margin: 0, maxWidth: '600px'
        }}>Relaxamento masculino · Focado no corpo · Design único</p>
      </header>

      {/* STEP 1: PACKAGE */}
      <section style={ { marginBottom: '48px' } }>
        <h2 style={ {
          fontFamily: FONTS.display, fontSize: TYPE_SCALE.h2, fontWeight: 400, color: COLORS.text, marginBottom: '24px', lineHeight: 1.3
        }}>Escolha seu pacote</h2>
        <div style={ { display: 'grid', gap: '16px' } }>
          {PACKAGES.map((p) => (
            <PackageCard key={p.id} pkg={p} isSelected={data.packageId === p.id} onSelect={(id) => {
              setData(d => ({ ...d, packageId: id }));
              // reset other fields when changing package
              setData(d => ({ ...d, addons: {}, time: '', date: null }));
            }} />
          ))}
        </div>
        <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, marginTop: '16px' } }>
          Duração: <strong>{currentPkg.min} min</strong> · Base: {money(currentPkg.price)}
        </p>
      </section>

      {/* STEP 2: SCHEDULING */}
      <section style={ { marginBottom: '48px' } }>
        <h2 style={ {
          fontFamily: FONTS.display, fontSize: TYPE_SCALE.h2, fontWeight: 400, color: COLORS.text, marginBottom: '24px', lineHeight: 1.3
        }}>Agende sua sessão</h2>

        <div style={ { marginBottom: '20px' } }>
          <label style={ {
            display: 'flex', gap: '12px', alignItems: 'center', fontSize: TYPE_SCALE.small, marginBottom: '8px'
          }}>
            <input
              type="radio" name="locType" value="studio"
              checked={data.locType === 'studio'}
              onChange={(e) => setData(d => ({ ...d, locType: 'studio' }))}
              style={ { accentColor: COLORS.primary, cursor: 'pointer' }} /> Estúdio
            <input
              type="radio" name="locType" value="home"
              checked={data.locType === 'home'}
              onChange={(e) => setData(d => ({ ...d, locType: 'home' }))}
              style={ { accentColor: COLORS.primary, cursor: 'pointer' }} /> Casa / Hotel
          </label>
        </div>

        {isHome && (
          <div style={ {
            background: COLORS.surface, borderRadius: '8px', padding: '20px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.05)'
          }}>
            <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, margin: '8px 0' } }>
              Horários de pico têm taxa de R$ 18,00. Pedimos mais antecedência para deslocamento.
            </p>
            <input
              type="tel" inputMode="numeric" placeholder="CEP"
              value={data.cep} onChange={(e) => handleCep(e.target.value)}
              style={ {
                width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body, margin: '8px 0'
              }}
            />
            <input
              type="text" placeholder="Rua/Av."
              value={data.street} onChange={(e) => setData(d => ({ ...d, street: e.target.value }))}
              style={ { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body, margin: '8px 0' } }
            />
            <div style={ { display: 'flex', gap: '8px' } }>
              <input
                type="text" placeholder="Nº"
                value={data.number} onChange={(e) => setData(d => ({ ...d, number: e.target.value }))}
                style={ { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                  background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body } }
              />
              <input
                type="text" placeholder="Bairro"
                value={data.bairro} onChange={(e) => setData(d => ({ ...d, bairro: e.target.value }))}
                style={ { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
                  background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body } }
              />
            </div>
          </div>
        )}

        <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, margin: '16px 0' } }>
          Data:
        </p>
        <div style={ { display: 'grid', gap: '8px' } }>
          {days.map((d, i) => {
            const isToday = i === 0;
            const dayName = d.toLocaleDateString('pt-BR', { weekday: 'short' });
            const dayNum = d.getDate();
            const month = d.toLocaleDateString('pt-BR', { month: 'short' });
            return (
              <label key={d.toISOString()} style={ {
                padding: '10px 16px', borderRadius: '8px', cursor: 'pointer',
                background: data.date && data.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10)
                  ? 'rgba(201, 164, 102, 0.15)' : COLORS.surface,
                border: `1px solid ${data.date && data.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10) ? COLORS.primary : 'transparent'}`,
                transition: 'all 0.2s ease'
              }} onClick={() => setData(d2 => ({ ...d2, date: d, time: '' }))}
              >
                <span style={ { fontFamily: FONTS.body, fontWeight: 600, color: data.date && data.date.toISOString().slice(0, 10) === d.toISOString().slice(0, 10) ? COLORS.primary : COLORS.text } }>
                  {isToday ? 'Hoje' : dayName}, {dayNum} {month}
                </span>
              </label>
            );
          })}
        </div>

        <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, margin: '16px 0' } }>
          Horário:
        </p>
        <select
          value={data.time}
          onChange={(e) => setData(d => ({ ...d, time: e.target.value }))}
          style={ {
            width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
            background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body, appearance: 'none', cursor: 'pointer'
          }}
        >
          <option value="">Selecione um horário</option>
          {slots.filter(s => s.available).map((s) => (
            <option key={s.t} value={s.t}>
              {s.t}
            </option>
          ))}
        </select>
      </section>

      {/* STEP 3: SUMMARY & CONFIRM */}
      <section style={ { marginBottom: '48px' } }>
        <h2 style={ {
          fontFamily: FONTS.display, fontSize: TYPE_SCALE.h2, fontWeight: 400, color: COLORS.text, marginBottom: '24px', lineHeight: 1.3
        }}>Resumo</h2>

        <div style={ {
          background: COLORS.surface, borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={ { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '20px' } }>
            <span style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.body, color: COLORS.muted } }>Pacote</span>
            <span style={ { fontFamily: FONTS.display, fontSize: TYPE_SCALE.body, color: COLORS.primary } }>{currentPkg.title}</span>
          </div>
          <SummaryLine label="Data" value={data.date ? data.date.toLocaleDateString('pt-BR') : 'Não informado'} />
          <SummaryLine label="Horário" value={data.time || 'Não informado'} />
          <SummaryLine label="Local" value={isHome ? `${data.street}, ${data.number}` : 'No espaço (Bela Vista)'} />
          <SummaryLine label="Adicionais" value={selectedAddonIds.length > 0 ? '+30 min' : 'Nenhum'} />
          <hr style={ { borderColor: 'rgba(255,255,255,0.1)', margin: '20px 0' } } />
          <div style={ { display: 'flex', justifyContent: 'space-between', fontWeight: 600 } }>
            <span>Subtotal</span>
            <span>{money(basePrice)}</span>
          </div>
          {selectedAddonIds.length > 0 && (
            <div style={ { display: 'flex', justifyContent: 'space-between', fontSize: TYPE_SCALE.small, color: COLORS.muted } }>
              <span>Adicionais</span>
              <span>{money(addonPriceMap[selectedAddonIds[0] as keyof typeof addonPriceMap] || 0)}</span>
            </div>
          )}
          <div style={ { display: 'flex', justifyContent: 'space-between', fontSize: TYPE_SCALE.body, color: COLORS.primary, fontWeight: 600, marginTop: '8px' } }>
            <span>Total</span>
            <span>{money(total)}</span>
          </div>
        </div>

        {/* Coupon */}
        {!coupon.applied && (
          <div style={ { margin: '20px 0', padding: '16px', background: COLORS.surface, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' } }>
            <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, marginBottom: '8px' } }>Cupom adicional?</p>
            <input
              type="text" placeholder="SESSAO2 ou RELAXAR13"
              value={coupon.input}
              onChange={(e) => setCoupon(c => ({ ...c, input: e.target.value }))}
              style={ {
                width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)',
                background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body, marginTop: '4px'
              }}
            />
            <button
              onClick={applyCoupon}
              style={ {
                marginTop: '8px', padding: '8px 16px', borderRadius: '4px', border: 'none', background: COLORS.primary, color: '#0a0a0a',
                fontSize: TYPE_SCALE.small, fontWeight: 600, cursor: 'pointer', width: 'auto'
              }}
            >
              Aplicar
            </button>
            {coupon.error && <p style={ { margin: '8px 0 0', color: COLORS.warning, fontSize: TYPE_SCALE.small } }>{coupon.error}</p>}
          </div>
        )}

        {/* Specific request */}
        <details style={ { margin: '20px 0' } }>
          <summary style={ {
            fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, cursor: 'pointer', marginBottom: '8px'
          }}>Pedido específico? (+ R$ 140,00)</summary>
          <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted } }>
            Consente em informar um pedido que pode tratar de vida sexual (dado sensível). Ele segue só pelo WhatsApp, não é salvo neste aparelho nem no sistema de agenda. Se inviável, o valor não é cobrado.
          </p>
          <input
            placeholder="Descreva seu desejo ou necessidade"
            value={data.req}
            onChange={(e) => setData(d => ({ ...d, req: e.target.value }))}
            style={ {
              width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
              background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.body, marginTop: '8px'
            }}
          />
        </details>

        {/* Payment */}
        <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted, margin: '20px 0 8px' } }>Pagamento do restante</p>
        <div style={ { display: 'flex', gap: '24px' } }>
          {PAYMENT_METHODS.map((m) => (
            <label key={m.id} style={ {
              display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
              fontSize: TYPE_SCALE.small, color: data.payment === m.id ? COLORS.primary : COLORS.muted
            }}>
              <input
                type="radio" name="payment" value={m.id}
                checked={data.payment === m.id}
                onChange={(e) => setData(d => ({ ...d, payment: e.target.value }))}
                style={ { accentColor: COLORS.primary, cursor: 'pointer' }} />
              {m.label}
            </label>
          ))}
        </div>
        <p style={ { fontFamily: FONTS.body, fontSize: TYPE_SCALE.small, color: COLORS.muted } }>
          * Sinal de R$ 40,00 via Pix na confirmação. Restante após sessão.
        </p>
      </section>

      {/* ACTIONS */}
      <footer style={ {
        marginTop: '48px', paddingTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <button
          onClick={prevStep}
          style={ {
            padding: '10px 24px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)',
            background: COLORS.bg, color: COLORS.text, fontSize: TYPE_SCALE.small, fontWeight: 500, cursor: 'pointer'
          }}
        >
          Voltar
        </button>
        <button
          onClick={finishBooking}
          style={ {
            padding: '12px 32px', borderRadius: '8px', border: 'none', background: COLORS.primary, color: '#0a0a0a',
            fontSize: TYPE_SCALE.body, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s'
          }}
          disabled={!formValid}
        >
          {step === 3 ? 'Enviar para WhatsApp' : 'Próximo'}
        </button>
      </footer>

      {/* TOAST */}
      {toast && (
        <div style={ {
          position: 'fixed', top: '24px', right: '24px', background: COLORS.surface,
          borderRadius: '8px', padding: '16px', color: COLORS.text, fontSize: TYPE_SCALE.body,
          border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000
        }}>{toast}</div>
      )}

    </div>
  );
}
