import { useState, useEffect, useMemo, useRef, memo, type ReactNode, type CSSProperties, type RefObject } from 'react';
import { SITE, LEGAL, C, ADDON, SCHEDULE, BRAND, PACKAGES } from './client.config';
import { TX } from './texts';
import { DOCS, type DocId } from './legal';
import { money, vibrate, store, clean, maskCEP, dateKey, toMin, fromMin, sameDay, copyText } from './utils';

/* ==========================================================================
   CONSTANTES DERIVADAS DA CONFIGURAÇÃO
   ========================================================================== */
type Theme = 'dark' | 'light';
type Phase = 'loading' | 'welcome' | 'site';
type Offer = 'single' | 'combo' | 'pack';

const LOCALE = 'pt-BR';
const KEY = { theme: `${SITE.STORAGE}_theme`, onboard: `${SITE.STORAGE}_onboard`, returning: `${SITE.STORAGE}_returning` };
const hasSignal = C.SIGNAL > 0 && !!C.PIX_KEY;
const MIN_PRICE = Math.min(...PACKAGES.map((p) => p.price));
const MIN_DUR = Math.min(...PACKAGES.map((p) => p.min));
const PAY_LABEL: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };
const t = (k: string) => TX[k] ?? k;
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;

/* ==========================================================================
   AGENDA
   ========================================================================== */
type Slot = { t: string; ok: boolean };

const isOpenDay = (d: Date) => SCHEDULE.WEEKDAYS.includes(d.getDay()) && !SCHEDULE.BLOCKED_DATES.includes(dateKey(d));

function buildSlots(date: Date, dur: number, isHome: boolean, now: Date): Slot[] {
  if (!isOpenDay(date)) return [];
  const lead = isHome ? SCHEDULE.LEAD_HOME : SCHEDULE.LEAD_STUDIO;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const busy = (SCHEDULE.BUSY[dateKey(date)] || []).map(toMin);
  const out: Slot[] = [];
  for (let m = toMin(SCHEDULE.OPEN); m + dur <= toMin(SCHEDULE.CLOSE); m += SCHEDULE.STEP) {
    const clash = busy.some((b) => m < b + SCHEDULE.BUSY_MIN && b < m + dur);
    out.push({ t: fromMin(m), ok: !clash && !(today && m < nowMin + lead) });
  }
  return out;
}

/* ==========================================================================
   ÍCONES E COMPONENTES BASE
   ========================================================================== */
const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z M7 11V7a5 5 0 0 1 10 0v4',
  check: 'M20 6L9 17l-5-5',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z',
  gift: 'M20 12v10H4V12 M2 7h20v5H2z M12 22V7 M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  close: 'M18 6L6 18 M6 6l12 12',
  plus: 'M12 5v14 M5 12h14',
};
type IconName = keyof typeof ICONS;

const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
));

function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed || !SITE.AVATAR) {
    return (
      <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} serif inline-flex items-center justify-center`} style={{ background: 'var(--acc)', color: 'var(--onacc)' }}>
        {SITE.FIRST_NAME.charAt(0).toUpperCase()}
      </span>
    );
  }
  return <img src={SITE.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

/* Aparece ao entrar na tela */
function useSeen<E extends HTMLElement>() {
  const ref = useRef<E>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} className={`rv ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* Título que sobe palavra por palavra */
function Title({ children, as = 'h2', className = '', style, id }: { children: string; as?: 'h1' | 'h2'; className?: string; style?: CSSProperties; id?: string }) {
  const { ref, seen } = useSeen<HTMLHeadingElement>();
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={`ttl serif ${seen ? 'in' : ''} ${className}`} style={style}>
      {children.split(' ').map((w, i) => (
        <span key={i} className="w">
          <span style={{ transitionDelay: `${i * 60}ms` }}>{w}&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
}

const Row = ({ label, value, tone }: { label: string; value: ReactNode; tone?: 'ok' }) => (
  <div className="flex justify-between gap-4 text-[15.5px]" style={tone ? { color: 'var(--ok)', fontWeight: 700 } : undefined}>
    <span style={tone ? undefined : { color: 'var(--mute)' }}>{label}</span>
    <span className="font-semibold text-right">{value}</span>
  </div>
);

/* ==========================================================================
   ESTILO
   ========================================================================== */
const CSS = `
.app{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#F2EFEB;--ink:#1C1A17;--mute:#746E65;--line:rgba(28,26,23,.08);--acc:${BRAND.accentLight};--onacc:${BRAND.onAccentLight};--ring:rgba(28,26,23,.15);--ok:#1E533F;--warn:#A86B22}
.app[data-theme=dark]{--bg:#141312;--surf:#1D1B1A;--surf2:#2A2725;--ink:#F2EFEB;--mute:#999187;--line:rgba(242,239,235,.08);--acc:${BRAND.accentDark};--onacc:${BRAND.onAccentDark};--ring:rgba(242,239,235,.2);--ok:#50A684;--warn:#E6A15C}
.app{background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,sans-serif;font-size:17px;line-height:1.55;min-height:100vh;overflow-x:clip;transition:background .3s,color .3s}
.app .text-sm{font-size:15.5px}.app .text-xs{font-size:13.5px}
.serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
.card{background:var(--surf);border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.03);border:1px solid var(--line)}
.app[data-theme=dark] .card{box-shadow:none}
.btn{min-height:56px;padding:0 26px;border-radius:999px;font-weight:700;font-size:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:transform .15s,opacity .2s,background .2s}
.btn:active{transform:scale(.98)}
.btn-p{background:var(--acc);color:var(--onacc);box-shadow:0 4px 12px var(--ring)}
.btn-p:disabled{background:var(--surf2);color:var(--mute);cursor:not-allowed;box-shadow:none}
.btn-g{border:1px solid var(--line);color:var(--ink);background:transparent}
.btn-g:hover{background:var(--surf2)}
.link{text-decoration:underline;text-underline-offset:4px;color:var(--ink);font-weight:600;min-height:28px}
.chip{min-height:54px;border:1px solid var(--line);border-radius:18px;background:var(--surf);display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:all .2s;position:relative;font-weight:600}
.chip.on{background:var(--acc);color:var(--onacc);border-color:var(--acc);font-weight:700}
.chip.off{opacity:.36;text-decoration:line-through;cursor:not-allowed}
.opt{display:block;border-radius:22px;padding:20px;background:var(--surf);cursor:pointer;transition:all .2s;border:1px solid var(--line)}
.opt.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc);background:var(--surf2)}
.opt:has(input:focus-visible),.chip:has(input:focus-visible),.btn:focus-visible,button:focus-visible,a:focus-visible,summary:focus-visible,input[type=checkbox]:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.inp{width:100%;min-height:56px;padding:0 18px;border-radius:16px;background:var(--surf);border:1px solid var(--line);color:var(--ink);font-size:17px;transition:all .2s}
.inp::placeholder{color:var(--mute)}
.inp:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--ring)}
.inp:disabled{opacity:.5}
.lbl{display:block;font-size:14.5px;font-weight:700;color:var(--mute);margin-bottom:10px}
.err{font-size:14px;color:#D6455D;margin-top:8px}
.glow{position:absolute;top:-6%;right:-30%;width:min(95vw,640px);aspect-ratio:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--acc) 15%,transparent),transparent 66%);animation:drift 14s ease-in-out infinite}
.dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 var(--ok);animation:pulse 2.6s ease-out infinite}
.stepn{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;border:1.5px solid var(--line);color:var(--mute);transition:all .3s}
.stepn.ok{background:var(--acc);color:var(--onacc);border-color:var(--acc)}
.core{position:absolute;inset:0;margin:auto;width:96px;height:96px;border-radius:50%;overflow:hidden;animation:breathe 6s ease-in-out infinite}
.ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--acc);opacity:0;animation:ring 3.6s ease-out infinite}
.rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
.loadbar{transform-origin:left;animation:bar 2.4s cubic-bezier(.5,0,.2,1) both}
.rv{opacity:0;transform:translateY(26px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}
.ttl{font-weight:300;line-height:1.04;letter-spacing:-0.02em}
.ttl .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.ttl .w>span{display:inline-block;transform:translateY(108%);opacity:0;transition:transform 1s cubic-bezier(.2,.7,.2,1),opacity .8s ease}
.ttl.in .w>span{transform:none;opacity:1}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
details.faq summary{min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;font-weight:700;list-style:none}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary::after{content:'+';font-size:24px;color:var(--acc);transition:transform .2s}
details.faq[open] summary::after{transform:rotate(45deg)}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{scrollbar-width:none}
@keyframes breathe{0%,100%{transform:scale(.96)}50%{transform:scale(1.04)}}
@keyframes ring{0%{transform:scale(.55);opacity:.6}100%{transform:scale(1.7);opacity:0}}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-4%,5%)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 55%,transparent)}100%{box-shadow:0 0 0 12px transparent}}
@media (prefers-reduced-motion:reduce){.glow,.dot,.core,.ring,.rise,.loadbar{animation:none!important}.rv,.ttl .w>span{opacity:1!important;transform:none!important;transition:none!important}*{scroll-behavior:auto!important}}
`;

/* ==========================================================================
   MODAL ACESSÍVEL
   ========================================================================== */
function Modal({ title, onClose, closeLabel, children }: { title: string; onClose: () => void; closeLabel: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = ref.current;
    el?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeRef.current();
        return;
      }
      if (e.key !== 'Tab' || !el) return;
      const f = el.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, []);
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(8,6,12,.72)' }} onClick={() => closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg max-h-[90vh] flex flex-col rise" style={{ borderRadius: '28px 28px 0 0' }}>
        <div className="flex justify-between items-center gap-4 p-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 id="modal-title" className="serif text-xl">{title}</h2>
          <button type="button" onClick={() => closeRef.current()} aria-label={closeLabel} className="btn btn-g" style={{ minHeight: 46, minWidth: 46, padding: '0 14px', borderRadius: '50%', border: 'none' }}>
            <Icon name="close" size={18} />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const StepHead = ({ n, title, done }: { n: number; title: string; done: boolean }) => (
  <div className="flex items-center gap-4 mb-6">
    <span className={`stepn ${done ? 'ok' : ''}`}>{done ? <Icon name="check" size={16} /> : n}</span>
    <Title as="h2" className="text-[28px] md:text-[34px]">{title}</Title>
  </div>
);

/* ==========================================================================
   APP
   ========================================================================== */
interface Booking {
  name: string;
  locType: 'studio' | 'home';
  cep: string;
  street: string;
  number: string;
  comp: string;
  bairro: string;
  date: Date | null;
  time: string;
  payment: string;
  packageId: string;
  addTime: boolean;
}

const OFFER_CARDS = ([
  ['combo', 'cbT', 'cbD', 'plus'],
  ['pack', 'lyT', 'lyD', 'gift'],
] as [Offer, string, string, IconName][]).filter(([o]) => o !== 'combo' || ADDON.ENABLED);

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const s = store.get(KEY.theme);
    if (s === 'dark' || s === 'light') return s;
    try {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } catch {
      return 'light';
    }
  });

  const [phase, setPhase] = useState<Phase>('loading');
  const [profileOpen, setProfileOpen] = useState(false);
  const [offer, setOffer] = useState<Offer>('single');
  const [reviewed, setReviewed] = useState(false);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [isReturning, setIsReturning] = useState(() => store.get(KEY.returning) === 'yes');
  const [touched, setTouched] = useState(false);
  const [toast, setToast] = useState('');
  const [doc, setDoc] = useState<DocId | null>(null);
  const [now, setNow] = useState(() => new Date());
  const [showBar, setShowBar] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '' });
  const [ageOk, setAgeOk] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState('');
  const [data, setData] = useState<Booking>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', payment: '', packageId: '', addTime: false,
  });
  const set = (patch: Partial<Booking>) => setData((p) => ({ ...p, ...patch }));

  const bookRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };
  const scrollToRef = (r: RefObject<HTMLDivElement>, ms = 140) => setTimeout(() => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), ms);
  const goBook = () => scrollToRef(bookRef, 30);

  /* carregamento -> boas-vindas (ou direto ao site para quem já entrou) */
  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      reduce = false;
    }
    const id = setTimeout(() => {
      if (store.get(KEY.onboard) === 'yes') {
        setAgeOk(true);
        setPhase('site');
      } else {
        setPhase('welcome');
      }
    }, reduce ? 800 : 2600);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => { if (phase !== 'loading') window.scrollTo({ top: 0 }); }, [phase]);
  useEffect(() => { document.documentElement.lang = LOCALE; document.title = SITE.NAME; }, []);
  useEffect(() => { store.set(KEY.theme, theme); }, [theme]);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    if (phase !== 'site') { setShowBar(false); return undefined; }
    const onScroll = () => {
      const r = bookRef.current?.getBoundingClientRect();
      setShowBar(window.scrollY > 480 && !!r && r.top > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [phase]);

  /* sessão, oferta e fatura */
  const chosen = data.packageId !== '';
  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';
  const isPack = offer === 'pack';
  const addonOn = ADDON.ENABLED && offer === 'combo';
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOCALE, o);

  const invoice = useMemo(() => {
    const dur = pkg.min + (data.addTime ? 30 : 0);
    const timeAdd = data.addTime ? C.TIME_ADD : 0;
    const addonAdd = addonOn ? pkg.addonPrice : 0;
    const comboSave = addonOn ? Math.max(0, ADDON.FULL - pkg.addonPrice) : 0;
    const sessionPrice = isPack ? pkg.price * C.PACK_PAY : pkg.price;
    const packSave = isPack ? pkg.price * (C.PACK_TOTAL - C.PACK_PAY) : 0;
    const base = sessionPrice + addonAdd + timeAdd;
    const peakFee = isHome && SCHEDULE.PEAK_HOURS.includes(data.time) ? C.PEAK_FEE : 0;
    let discount = 0;
    if (!isPack) {
      if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
      else if (!isReturning) discount = C.FIRST;
    }
    discount = Math.min(discount, base);
    const after = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(after * C.PIX_DISC) : 0;
    const total = after - pixDiscount + peakFee;
    const sinal = hasSignal ? Math.min(C.SIGNAL, total) : 0;
    return { sessionPrice, addonAdd, timeAdd, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, comboSave, packSave, saved: comboSave + packSave + discount + pixDiscount };
  }, [data.addTime, data.payment, data.time, pkg, isHome, isPack, addonOn, isReturning, coupon.applied, coupon.value]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; i < SCHEDULE.DAYS; i++) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + i);
      out.push({ d, i });
    }
    return out;
  }, []);
  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.dur, isHome, now) : []), [data.date, invoice.dur, isHome, now]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  useEffect(() => {
    if (data.time && !slots.some((s) => s.t === data.time && s.ok)) setData((p) => ({ ...p, time: '' }));
  }, [slots, data.time]);

  const nextFree = useMemo(() => {
    for (let k = 0; k < SCHEDULE.DAYS; k++) {
      const d = new Date(now);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + k);
      const s = buildSlots(d, MIN_DUR, false, now).find((x) => x.ok);
      if (s) return { d, t: s.t, k };
    }
    return null;
  }, [now]);

  const errors = {
    name: data.name.trim().length < 3 ? t('nameErr') : '',
    date: !data.date ? t('dateErr') : '',
    time: data.date && !data.time ? t('timeErr') : '',
    address: isHome && !(data.street && data.number && data.bairro) ? t('addrErr') : '',
  };
  const step3Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const v = C.COUPONS[code] || 0;
    if (v > 0) {
      vibrate([20, 40]);
      setCoupon({ input: '', applied: code, value: v, error: '' });
      showToast(t('couponOk'));
    } else {
      vibrate(50);
      setCoupon((c) => ({ ...c, error: t('couponBad') }));
    }
  };
  const copyPix = async () => {
    const ok = await copyText(C.PIX_KEY);
    showToast(ok ? t('pixCopied') : `Pix: ${C.PIX_KEY}`);
  };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const j = await (await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`)).json();
        if (!j.erro) {
          setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro }));
          setTimeout(() => numberRef.current?.focus(), 150);
        } else {
          showToast(t('cepFail'));
        }
      } catch {
        showToast(t('cepFail'));
      }
    }
  };

  const pickPkg = (id: string) => {
    vibrate(15);
    set({ packageId: id });
    scrollToRef(s2Ref, 200);
  };
  const pickOffer = (o: Offer) => {
    vibrate(20);
    setOffer(o);
    goBook();
  };

  /* Mensagem do WhatsApp (sempre em português) */
  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString(LOCALE, { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) {
      loc = `📍 *Local:* Atendimento no studio (${SITE.REGION}). O endereço exato será enviado após a confirmação.`;
    } else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, São Paulo`;
      loc = `📍 *Local:* Atendimento no seu endereço.\n*Endereço informado:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    let m = `Oi ${SITE.FIRST_NAME}! Vim pelo site *${SITE.NAME}* e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    m += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    m += `*SESSÃO ESCOLHIDA (${invoice.dur} min):*\n✅ ${pkg.title}\n\n*O que vai acontecer na sessão:*\n`;
    m += pkg.flow.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n';
    if (addonOn || data.addTime) {
      m += '\n*Adicionais:*\n';
      if (addonOn) m += `➕ ${ADDON.NAME} (preço de combo, economia de ${money(invoice.comboSave)})\n`;
      if (data.addTime) m += '➕ +30 minutos extras\n';
    }
    if (isPack) m += `\n🎁 *PACOTE ${C.PACK_TOTAL} SESSÕES (pague ${C.PACK_PAY}, a ${C.PACK_TOTAL}ª é grátis):* esta é a 1ª sessão. As outras ${C.PACK_TOTAL - 1} serão agendadas depois por aqui, com validade de ${C.PACK_DAYS} dias. Economia do pacote: ${money(invoice.packSave)}.\n`;
    m += '\n*RESUMO DO PAGAMENTO:*\n';
    m += `${isPack ? `Pacote ${C.PACK_TOTAL} sessões (${C.PACK_PAY} pagas): ${money(invoice.sessionPrice)}` : `Sessão: ${money(invoice.sessionPrice)}`}\n`;
    if (invoice.addonAdd > 0) m += `${ADDON.NAME} (combo): +${money(invoice.addonAdd)}\n`;
    if (invoice.timeAdd > 0) m += `+30 minutos: +${money(invoice.timeAdd)}\n`;
    if (invoice.discount > 0) m += `🏷️ ${coupon.applied ? `Cupom ${coupon.applied}` : 'Presente de 1ª sessão'}: -${money(invoice.discount)}\n`;
    if (invoice.pixDiscount > 0) m += `🏷️ Desconto Pix: -${money(invoice.pixDiscount)}\n`;
    if (invoice.peakFee > 0) m += `Taxa de deslocamento/pico: +${money(invoice.peakFee)}\n`;
    m += `*Valor Total:* ${money(invoice.total)} (${PAY_LABEL[data.payment] || data.payment})\n`;
    if (hasSignal) m += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n`;
    else m += '*Pagamento:* depois da sessão\n';
    if (invoice.saved > 0) m += `💚 *Economia total neste pedido:* ${money(invoice.saved)}\n`;
    m += '\n✅ Declaro ter 18 anos ou mais e ter lido a Política de Privacidade, os Termos e a Política de Cancelamento.\n';
    if (optIn) m += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n';
    if (!isPack && C.RETURN_COUPON) m += `\n🎁 *Para a próxima:* tenho direito ao cupom ${C.RETURN_COUPON} no meu próximo agendamento.\n`;
    m += hasSignal ? '\nAguardo sua resposta para mandar o comprovante do sinal!' : '\nAguardo sua confirmação!';
    return waLink(m);
  };

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, mm: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(mm).replace(':', '')}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const s = toMin(data.time);
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${SITE.SHORT}//Agenda//PT`, 'BEGIN:VEVENT',
      `UID:${Date.now()}@${SITE.STORAGE}`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`,
      `SUMMARY:${pkg.title} - ${SITE.SHORT}`,
      `DESCRIPTION:${hasSignal ? `Sinal de ${money(invoice.sinal)} via Pix para confirmar.` : 'Aguarde a confirmação pelo WhatsApp.'}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sessao.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const goReview = () => {
    if (!chosen) { showToast(t('s1')); goBook(); return; }
    if (!step3Valid) { vibrate(50); setTouched(true); showToast(t('fill')); return; }
    vibrate(30);
    setReviewed(true);
    scrollToRef(s4Ref, 160);
  };

  const finish = () => {
    if (!step3Valid) { setTouched(true); showToast(t('fill')); scrollToRef(s3Ref, 30); return; }
    if (!data.payment) { vibrate(50); showToast(t('needPay')); return; }
    if (!ageOk) { vibrate(50); showToast(t('needAge')); return; }
    if (!data.date || !data.time) return;
    if (hp) { setDone(true); setSentLink('#'); return; } // armadilha anti-robô
    const link = whatsappLink();
    store.set(KEY.returning, 'yes');
    setSentLink(link);
    vibrate([30, 50]);
    const w = window.open(link, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = link;
    setDone(true);
    scrollToRef(bookRef, 60);
  };

  const resetBooking = () => {
    setTouched(false);
    setDone(false);
    setReviewed(false);
    setOffer('single');
    setData((p) => ({ ...p, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', payment: '', packageId: '', addTime: false }));
  };
  const restart = () => { vibrate(15); resetBooking(); goBook(); };

  const forgetMe = () => {
    [KEY.returning, KEY.onboard].forEach((k) => store.del(k));
    setIsReturning(false);
    setAgeOk(false);
    setCoupon({ input: '', applied: '', value: 0, error: '' });
    resetBooking();
    setData((p) => ({ ...p, name: '' }));
    setProfileOpen(false);
    setPhase('welcome');
    showToast(t('forgot'));
  };

  const enter = () => {
    if (!ageOk) { vibrate(50); showToast(t('needAgeEnter')); return; }
    vibrate(30);
    store.set(KEY.onboard, 'yes');
    setPhase('site');
  };

  const dayName = (d: Date, i: number) => (i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmt(d, { weekday: 'short' }).replace('.', ''));
  const greeting = now.getHours() < 12 ? t('gm') : now.getHours() < 18 ? t('ga') : t('gn');
  const chatLink = waLink(t('chatMsg'));
  const nextLabel = nextFree ? `${nextFree.k === 0 ? t('today') : nextFree.k === 1 ? t('tomorrow') : fmt(nextFree.d, { weekday: 'long' })} ${nextFree.t}` : '';

  const offerOptions = ([
    ['single', t('oSingle'), t('oSingleD'), pkg.price, 0, 0],
    ['combo', t('oCombo'), t('oComboD'), pkg.price + pkg.addonPrice, pkg.price + ADDON.FULL, Math.max(0, ADDON.FULL - pkg.addonPrice)],
    ['pack', t('oPack'), t('oPackD'), pkg.price * C.PACK_PAY, pkg.price * C.PACK_TOTAL, pkg.price * (C.PACK_TOTAL - C.PACK_PAY)],
  ] as [Offer, string, string, number, number, number][]).filter(([o]) => o !== 'combo' || ADDON.ENABLED);

  /* ---------------------------- CARREGAMENTO ---------------------------- */
  if (phase === 'loading') {
    return (
      <div className="app flex flex-col items-center justify-center px-6 text-center" data-theme={theme} role="status" aria-live="polite" aria-busy="true">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="relative" style={{ width: 176, height: 176 }}>
          <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} /><span className="ring" style={{ animationDelay: '2.4s' }} />
          <div className="core"><Avatar className="w-full h-full rounded-full text-4xl" alt="" /></div>
        </div>
        <h1 className="serif font-light mt-10 rise" style={{ fontSize: 'clamp(30px,7vw,44px)', letterSpacing: '-0.01em', animationDelay: '.3s' }}>{SITE.NAME}</h1>
        <p className="mt-3 rise text-sm" style={{ color: 'var(--mute)', animationDelay: '.7s' }}>{t('loadMsg')}</p>
        <div className="mt-8 w-48 rounded-full overflow-hidden" style={{ height: 3, background: 'var(--line)' }}><div className="loadbar h-full" style={{ background: 'var(--acc)' }} /></div>
      </div>
    );
  }

  /* ---------------------------- SITE ---------------------------- */
  return (
    <div className="app" data-theme={theme} style={{ paddingBottom: showBar ? 96 : 24 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {toast && <div role="status" aria-live="polite" className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full text-sm font-semibold max-w-[90vw] text-center shadow-xl" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>{toast}</div>}

      <header className="sticky top-0 z-50" style={{ background: 'color-mix(in srgb,var(--bg) 88%,transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <button type="button" onClick={() => { vibrate(10); setProfileOpen(true); }} aria-label={t('openProfile')} aria-haspopup="dialog" className="flex items-center gap-3 min-w-0 rounded-xl py-1">
            <Avatar className="w-11 h-11 rounded-full" alt="" />
            <span className="serif hidden min-[430px]:inline whitespace-nowrap" style={{ fontSize: 17 }}>{SITE.SHORT}</span>
          </button>
          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('srLight') : t('srDark')} title={t('theme')} className="btn btn-g" style={{ minHeight: 44, width: 44, padding: 0, borderRadius: '50%', border: 'none' }}>
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
        </div>
      </header>

      <main id="main" className="max-w-3xl mx-auto px-5">
        {/* ========== BOAS-VINDAS ========== */}
        {phase === 'welcome' && (
          <section className="max-w-xl mx-auto min-h-[84vh] flex flex-col justify-center py-10" aria-labelledby="wt">
            <div className="relative mb-9 rise" style={{ width: 104, height: 104 }}>
              <span className="ring" /><span className="ring" style={{ animationDelay: '1.8s' }} />
              <div className="core" style={{ width: 104, height: 104 }}><Avatar className="w-full h-full rounded-full text-4xl" alt={SITE.FIRST_NAME} /></div>
            </div>
            <p className="rise inline-flex items-center gap-2 text-sm font-semibold mb-4 self-start" style={{ color: 'var(--mute)', animationDelay: '.1s' }}><Icon name="map" size={16} /> {t('badge')}</p>
            <h1 id="wt" className="serif font-light leading-[1.02] mb-5 rise" style={{ fontSize: 'clamp(42px,11vw,72px)', letterSpacing: '-0.02em', animationDelay: '.2s' }}>{SITE.NAME}</h1>
            <p className="text-lg leading-relaxed mb-8 rise" style={{ color: 'var(--mute)', animationDelay: '.35s' }}>{t('wSub')}</p>
            <ul className="grid gap-3 mb-9 rise" style={{ animationDelay: '.5s' }}>
              {([['w1', 'clock'], ['w2', 'lock'], ['w3', 'shield']] as [string, IconName][]).map(([k, ic]) => (
                <li key={k} className="flex items-center gap-3 font-semibold"><Icon name={ic} size={20} />{t(k)}</li>
              ))}
            </ul>
            <div className="rise mb-6" style={{ animationDelay: '.6s' }}>
              <div className="flex items-start gap-3 text-sm leading-relaxed">
                <input id="age-w" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                <p>
                  <label htmlFor="age-w" className="cursor-pointer">{t('ageA')} </label>
                  <button type="button" className="link" onClick={() => setDoc('privacy')}>{t('privacy')}</button>, <button type="button" className="link" onClick={() => setDoc('terms')}>{t('terms')}</button> {t('and')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.
                </p>
              </div>
            </div>
            <button type="button" onClick={enter} disabled={!ageOk} className="btn btn-p w-full rise" style={{ minHeight: 62, fontSize: 17, animationDelay: '.7s' }}>{ageOk ? t('enter') : t('needAgeEnter')}</button>
          </section>
        )}

        {phase === 'site' && (<>
          {/* ========== HERO ========== */}
          <section className="relative pt-14 pb-16 flex flex-col justify-center" style={{ minHeight: 'calc(100svh - 76px)' }}>
            <div className="glow" aria-hidden="true" />
            <div className="relative">
              <Reveal><p className="inline-flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: 'var(--mute)' }}><Icon name="map" size={16} /> {t('badge')}</p></Reveal>
              <Title as="h1" className="mb-6" style={{ fontSize: 'clamp(50px,13vw,92px)' }}>{SITE.HERO_TITLE}</Title>
              <Reveal delay={250}><p className="text-lg leading-relaxed mb-9 max-w-md" style={{ color: 'var(--mute)' }}>{SITE.HERO_SUB}</p></Reveal>
              <Reveal delay={380}>
                <div className="flex flex-wrap gap-3 mb-8">
                  <button type="button" onClick={goBook} className="btn btn-p" style={{ minHeight: 60, padding: '0 36px', fontSize: 17 }}>{t('cta')}</button>
                  {SITE.REVIEW_LINK && <a href={SITE.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 60 }}><Icon name="star" size={18} /> {t('reviews')}</a>}
                </div>
              </Reveal>
              <Reveal delay={500}>
                <p className="flex items-center gap-3 text-sm" style={{ color: 'var(--mute)' }}>
                  {nextFree && (<><span className="dot" aria-hidden="true" /><span>{t('nextFree')}: <strong style={{ color: 'var(--ink)' }}>{nextLabel}</strong></span></>)}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--mute)' }}>{t('fromM')} {money(MIN_PRICE)}</p>
              </Reveal>
            </div>
          </section>

          {/* ========== CONFIANÇA ========== */}
          <Reveal className="mb-24">
            <ul className="grid sm:grid-cols-3 gap-5">
              {([['t1', 'lock'], ['t2', 'shield'], ['t3', 'star']] as [string, IconName][]).map(([k, ic]) => (
                <li key={k} className="flex items-start gap-3 text-[15.5px] leading-snug"><Icon name={ic} size={22} className="mt-0.5" />{t(k)}</li>
              ))}
            </ul>
          </Reveal>

          {/* ========== VANTAGENS ========== */}
          <section className="mb-28" aria-labelledby="off">
            <Title id="off" className="text-[34px] md:text-[44px] mb-3">{t('offH')}</Title>
            <Reveal delay={120}><p className="mb-8" style={{ color: 'var(--mute)' }}>{t('offS')}</p></Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {OFFER_CARDS.map(([o, a, b, ic], i) => (
                <Reveal key={o} delay={i * 120}>
                  <button type="button" onClick={() => pickOffer(o)} className="card p-6 text-left w-full h-full flex flex-col gap-3">
                    <Icon name={ic} size={28} />
                    <span className="serif text-[28px] leading-tight mt-2">{t(a)}</span>
                    <span className="text-[15.5px]" style={{ color: 'var(--mute)' }}>{t(b)}</span>
                    <span className="link mt-auto pt-2">{t('see')}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ========== AGENDAMENTO ========== */}
          <section ref={bookRef} className="scroll-mt-20 mb-28" aria-label={t('cta')}>
            {done ? (
              <Reveal>
                <div className="card p-8 text-center bg-[var(--surf2)] border-none">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)', color: 'var(--ok)' }}><Icon name="check" size={32} /></div>
                  <h2 className="serif text-4xl font-light mb-4">{t('doneH')}</h2>
                  <p className="leading-relaxed mb-4" style={{ color: 'var(--mute)' }}>{t('doneP')}</p>
                  {hasSignal && <p className="font-bold mb-8" style={{ color: 'var(--acc)' }}>{t('doneSig')} ({money(invoice.sinal)})</p>}
                  <div className="space-y-3 max-w-xs mx-auto">
                    <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-p w-full">{t('resend')}</a>
                    {hasSignal && <button type="button" onClick={copyPix} className="btn btn-g w-full"><Icon name="copy" size={16} /> {t('copyPix')}</button>}
                    <button type="button" onClick={downloadICS} className="btn btn-g w-full"><Icon name="cal" size={16} /> {t('addCal')}</button>
                    <button type="button" onClick={restart} className="w-full min-h-[48px] text-sm underline underline-offset-4" style={{ color: 'var(--mute)' }}>{t('restart')}</button>
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="space-y-24">
                {/* PASSO 1 */}
                <div>
                  <StepHead n={1} title={t('s1')} done={chosen} />
                  <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label={t('s1')}>
                    {PACKAGES.map((p, i) => {
                      const on = data.packageId === p.id;
                      return (
                        <Reveal key={p.id} delay={(i % 2) * 80} className={on ? 'md:col-span-2' : ''}>
                          <div className={`opt ${on ? 'on' : ''}`} style={{ padding: 0 }}>
                            <label className="block cursor-pointer" style={{ padding: '18px 20px' }}>
                              <input type="radio" name="package" value={p.id} checked={on} onChange={() => pickPkg(p.id)} className="sr-only" />
                              <span className="flex justify-between items-baseline gap-4">
                                <span className="serif text-[22px] leading-tight">{p.title}</span>
                                <span className="serif text-[22px] shrink-0" style={{ color: 'var(--acc)' }}>{money(p.price)}</span>
                              </span>
                              <span className="block text-sm mt-1" style={{ color: 'var(--mute)' }}>{p.min} {t('min')}, {p.tags.slice(0, 2).join(', ')}</span>
                            </label>
                            {on && (
                              <div className="rise px-5 pb-5" style={{ borderTop: '1px solid var(--line)' }}>
                                <p className="text-[15.5px] leading-relaxed pt-4 mb-4" style={{ color: 'var(--mute)' }}>{p.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-4">{p.tags.map((g) => <span key={g} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--surf2)' }}>{g}</span>)}</div>
                                <p className="text-sm font-bold mb-2">{t('flowH')}</p>
                                <ol className="pl-5 list-decimal text-[15.5px] leading-relaxed space-y-1" style={{ color: 'var(--mute)' }}>{p.flow.map((s) => <li key={s}>{s}</li>)}</ol>
                              </div>
                            )}
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>

                {/* PASSO 2: como levar */}
                {chosen && (
                  <div ref={s2Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={2} title={t('s2')} done={true} />
                      <div className="grid gap-3" role="radiogroup" aria-label={t('s2')}>
                        {offerOptions.map(([o, a, b, price, was, sv]) => (
                          <label key={o} className={`opt ${offer === o ? 'on' : ''}`}>
                            <input type="radio" name="offer" value={o} checked={offer === o} onChange={() => { vibrate(15); setOffer(o); }} className="sr-only" />
                            <span className="flex justify-between items-start gap-4">
                              <span><span className="block font-bold">{a}</span><span className="block text-sm mt-1" style={{ color: 'var(--mute)' }}>{b}</span></span>
                              <span className="text-right shrink-0">
                                <span className="serif text-[22px] block leading-none" style={{ color: 'var(--acc)' }}>{money(price)}</span>
                                {sv > 0 && <span className="block text-xs mt-1"><s style={{ color: 'var(--mute)' }}>{money(was)}</s></span>}
                              </span>
                            </span>
                            {sv > 0 && <span className="inline-block mt-3 text-xs font-extrabold px-3 py-1.5 rounded-full" style={{ background: 'color-mix(in srgb,var(--ok) 16%,transparent)', color: 'var(--ok)' }}>{t('save')} {money(sv)}</span>}
                          </label>
                        ))}
                      </div>
                      {isPack && <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--mute)' }}>{t('packNote')}</p>}
                    </Reveal>
                  </div>
                )}

                {/* PASSO 3: quando e onde */}
                {chosen && (
                  <div ref={s3Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={3} title={t('s3')} done={step3Valid} />
                      <div className="space-y-9">
                        <div>
                          <label htmlFor="nm" className="lbl">{t('name')}</label>
                          <input id="nm" autoComplete="given-name" type="text" value={data.name} maxLength={60} placeholder={t('namePh')} onChange={(e) => set({ name: e.target.value })} className="inp" aria-invalid={touched && !!errors.name} />
                          {touched && errors.name && <p className="err" role="alert">{errors.name}</p>}
                          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('place')}</legend>
                          <div className="grid grid-cols-2 gap-3">
                            {([['studio', t('studio')], ['home', t('home')]] as const).map(([id, label]) => (
                              <label key={id} className={`chip px-3 ${data.locType === id ? 'on' : ''}`}>
                                <input type="radio" name="location" value={id} checked={data.locType === id} onChange={() => set({ locType: id })} className="sr-only" />{label}
                              </label>
                            ))}
                          </div>
                          <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--mute)' }}>{isHome ? t('peakNote') : t('studioInfo')}</p>
                        </fieldset>

                        {isHome && (
                          <div className="space-y-3 rise">
                            <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder={t('cep')} aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className="inp" />
                            <input type="text" autoComplete="street-address" placeholder={t('street')} aria-label={t('street')} maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className="inp" />
                            <div className="flex gap-3">
                              <input ref={numberRef} type="text" inputMode="numeric" placeholder={t('number')} aria-label={t('number')} maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className="inp" style={{ width: '34%' }} />
                              <input type="text" placeholder={t('comp')} aria-label={t('comp')} maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className="inp" style={{ width: '66%' }} />
                            </div>
                            <input type="text" placeholder={t('bairro')} aria-label={t('bairro')} maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className="inp" />
                            {touched && errors.address && <p className="err" role="alert">{errors.address}</p>}
                          </div>
                        )}

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('date')}</legend>
                          <div className="flex gap-3 overflow-x-auto py-1 hide-sb -mx-5 px-5 snap-x">
                            {days.map(({ d, i }) => {
                              const sel = sameDay(data.date, d);
                              const closedDay = !isOpenDay(d);
                              return (
                                <label key={dateKey(d)} className={`chip shrink-0 snap-start flex-col py-3 ${sel ? 'on' : ''} ${closedDay ? 'off' : ''}`} style={{ width: 80 }}>
                                  <input type="radio" name="date" value={dateKey(d)} checked={sel} disabled={closedDay} aria-label={`${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })}${closedDay ? ', ' + t('closed') : ''}`} onChange={() => set({ date: d, time: '' })} className="sr-only" />
                                  <span aria-hidden="true" className="text-xs font-bold capitalize">{dayName(d, i)}</span>
                                  <span aria-hidden="true" className="serif text-[28px] leading-tight">{d.getDate()}</span>
                                  <span aria-hidden="true" className="text-xs opacity-70">{fmt(d, { month: 'short' }).replace('.', '')}</span>
                                </label>
                              );
                            })}
                          </div>
                          {touched && errors.date && <p className="err" role="alert">{errors.date}</p>}
                        </fieldset>

                        {data.date && (
                          <fieldset className="min-w-0 rise">
                            <legend className="sr-only">{t('time')}</legend>
                            <div className="flex justify-between items-baseline mb-3">
                              <span aria-hidden="true" className="lbl" style={{ marginBottom: 0 }}>{t('time')}</span>
                              <span className="text-xs" style={{ color: 'var(--mute)' }}>{t('session')} {invoice.dur} {t('min')}</span>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {slots.map(({ t: tm, ok }) => {
                                const sel = data.time === tm;
                                const peak = isHome && SCHEDULE.PEAK_HOURS.includes(tm);
                                return (
                                  <label key={tm} className={`chip flex-col py-3 ${sel ? 'on' : ''} ${!ok ? 'off' : ''}`}>
                                    <input type="radio" name="time" value={tm} checked={sel} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} onChange={() => { vibrate(15); set({ time: tm }); }} className="sr-only" />
                                    <span aria-hidden="true" className="font-semibold">{tm}</span>
                                    {peak && ok && <span aria-hidden="true" className="text-[11px] font-bold" style={{ color: sel ? 'inherit' : 'var(--warn)' }}>{t('peak')} +{C.PEAK_FEE}</span>}
                                  </label>
                                );
                              })}
                            </div>
                            {availableCount === 0 && <p className="text-sm text-center py-5" style={{ color: 'var(--mute)' }}>{t('noSlots')}</p>}
                            {data.time && <p className="text-[15.5px] font-semibold mt-4 flex items-center gap-2" style={{ color: 'var(--ok)' }}><Icon name="check" size={16} /> {t('from')} {data.time} {t('to')} {endTime}</p>}
                            <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('confirmNote')}</p>
                            {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                          </fieldset>
                        )}

                        <div>
                          <button type="button" className="btn btn-p w-full" style={{ minHeight: 60 }} onClick={goReview}>{t('cont')}</button>
                          <p className="text-sm text-center mt-4" style={{ color: 'var(--mute)' }}>{t('chatQ')} <a href={chatLink} target="_blank" rel="noopener noreferrer" className="link">{t('chatBtn')}</a></p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                )}

                {/* PASSO 4: resumo e pagamento */}
                {chosen && reviewed && (
                  <div ref={s4Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={4} title={t('s4')} done={false} />
                      <div className="space-y-8">
                        <div className="card p-6 space-y-3">
                          <Row label={t('sPack')} value={pkg.title} />
                          <Row label={t('sWhen')} value={data.date ? `${fmt(data.date, { weekday: 'short', day: '2-digit', month: 'short' })}, ${data.time} – ${endTime}` : ''} />
                          <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number}` : t('sLocStudio')} />
                          <button type="button" onClick={() => scrollToRef(s3Ref, 30)} className="link text-sm">{t('change')}</button>
                        </div>

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('pay')}</legend>
                          <div className="grid grid-cols-3 gap-3">
                            {(['pix', 'card', 'cash'] as const).map((p) => (
                              <label key={p} className={`chip text-[15px] px-2 ${data.payment === p ? 'on' : ''}`}>
                                <input type="radio" name="payment" value={p} checked={data.payment === p} onChange={() => { vibrate(15); set({ payment: p }); }} className="sr-only" />{t(p)}
                              </label>
                            ))}
                          </div>
                          {data.payment === 'card' && <p className="text-sm mt-3" style={{ color: 'var(--mute)' }}>{t('cardNote')}</p>}
                        </fieldset>

                        <details className="faq card px-6">
                          <summary>{t('extras')}</summary>
                          <div className="pb-6 space-y-6">
                            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                              <input type="checkbox" checked={data.addTime} onChange={(e) => { vibrate(15); set({ addTime: e.target.checked }); }} className="w-6 h-6 shrink-0" style={{ accentColor: 'var(--acc)' }} />
                              <span className="flex-1">{t('lTime')}</span><span className="font-bold">+ {money(C.TIME_ADD)}</span>
                            </label>
                            {!isPack && !coupon.applied && (
                              <div>
                                <label htmlFor="cp" className="lbl">{t('couponQ')}</label>
                                <div className="flex gap-2">
                                  <input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className="inp uppercase flex-1" aria-describedby={coupon.error ? 'cp-err' : undefined} />
                                  <button type="button" onClick={applyCoupon} className="btn btn-g">{t('apply')}</button>
                                </div>
                                {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                              </div>
                            )}
                          </div>
                        </details>

                        <div className="card p-6">
                          <div className="space-y-3 mb-5">
                            <Row label={isPack ? t('lPack5') : t('lPack')} value={money(invoice.sessionPrice)} />
                            {invoice.addonAdd > 0 && <Row label={t('lAddon')} value={`+${money(invoice.addonAdd)}`} />}
                            {invoice.timeAdd > 0 && <Row label={t('lTime')} value={`+${money(invoice.timeAdd)}`} />}
                            {invoice.discount > 0 && <Row tone="ok" label={coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')} value={`-${money(invoice.discount)}`} />}
                            {invoice.pixDiscount > 0 && <Row tone="ok" label={t('lPix')} value={`-${money(invoice.pixDiscount)}`} />}
                            {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                          </div>
                          <div className="flex justify-between items-end pt-5" style={{ borderTop: '1px solid var(--line)' }}>
                            <span style={{ color: 'var(--mute)' }}>{t('total')}</span>
                            <span className="serif text-[46px] leading-none font-light">{money(invoice.total)}</span>
                          </div>
                          {invoice.saved > 0 && <p className="mt-4 text-[15px] font-extrabold text-center py-2.5 rounded-2xl" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>{t('saved')} {money(invoice.saved)}</p>}
                          {hasSignal && (
                            <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                              <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('signal')}</p><p className="font-extrabold" style={{ color: 'var(--acc)' }}>{money(invoice.sinal)}</p></div>
                              <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('rest')}</p><p className="font-extrabold">{money(invoice.rest)}</p></div>
                            </div>
                          )}
                        </div>

                        {hasSignal && (
                          <p className="text-[15.5px] leading-relaxed">{t('sigA')} <strong>{money(invoice.sinal)}</strong> {t('sigB')}{' '}
                            <button type="button" onClick={copyPix} className="link inline-flex items-center gap-1"><Icon name="copy" size={15} /> {t('copyPix')}</button>
                          </p>
                        )}

                        <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer" style={{ color: 'var(--mute)' }}>
                          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-6 h-6 shrink-0" style={{ accentColor: 'var(--acc)' }} /><span>{t('optIn')}</span>
                        </label>

                        <div className="flex items-start gap-3 text-sm leading-relaxed">
                          <input id="age-ok" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                          <p>
                            <label htmlFor="age-ok" className="cursor-pointer">{t('ageA')} </label>
                            <button type="button" className="link" onClick={() => setDoc('privacy')}>{t('privacy')}</button>, <button type="button" className="link" onClick={() => setDoc('terms')}>{t('terms')}</button> {t('and')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.
                          </p>
                        </div>

                        <button type="button" onClick={finish} disabled={!data.payment || !ageOk} className="btn btn-p w-full" style={{ minHeight: 64, fontSize: 17 }}>
                          {!data.payment ? t('needPay') : !ageOk ? t('needAge') : t('send')}
                        </button>
                      </div>
                    </Reveal>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ========== SOBRE ========== */}
          <section className="mb-24" aria-labelledby="ab">
            <Reveal>
              <div className="flex items-center gap-5 mb-5">
                <Avatar className="w-20 h-20 rounded-full" alt={SITE.FIRST_NAME} />
                <div>
                  <Title id="ab" className="text-[26px] md:text-[32px]">{SITE.ABOUT_TITLE}</Title>
                  <p className="text-sm font-bold" style={{ color: 'var(--acc)' }}>{t('aboutR')}</p>
                </div>
              </div>
              <p className="leading-relaxed mb-3 max-w-xl" style={{ color: 'var(--mute)' }}>{SITE.ABOUT_1}</p>
              <p className="flex items-start gap-3 text-[15.5px] leading-relaxed mb-6 max-w-xl"><Icon name="map" size={18} className="mt-1" />{SITE.ABOUT_2}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setProfileOpen(true)} className="btn btn-p" style={{ minHeight: 50 }}>{t('seeProfile')}</button>
                {SITE.INSTAGRAM && <a href={SITE.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="instagram" size={18} /> Instagram</a>}
              </div>
            </Reveal>
          </section>

          {/* ========== DÚVIDAS ========== */}
          <section className="mb-8" aria-labelledby="fq">
            <Title id="fq" className="text-[32px] md:text-[40px] mb-6">{t('faqH')}</Title>
            <Reveal>
              <div className="card px-6">
                {[['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4']].map(([q, a], i) => (
                  <details key={q} className="faq" style={i ? { borderTop: '1px solid var(--line)' } : undefined}>
                    <summary>{t(q)}</summary>
                    <p className="pb-4 leading-relaxed" style={{ color: 'var(--mute)' }}>{t(a)}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </section>
        </>)}
      </main>

      <footer className="max-w-xl mx-auto px-6 mt-16 pt-6 text-xs leading-relaxed text-center" style={{ borderTop: '1px solid var(--line)', color: 'var(--mute)' }}>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <button key={id} type="button" onClick={() => setDoc(id)} className="underline underline-offset-4 min-h-[44px] px-2">{t(k)}</button>
          ))}
        </nav>
        <p className="mt-2">{SITE.NAME}<br />{LEGAL.RAZAO}, {LEGAL.DOC_LABEL} {LEGAL.DOC}<br />{LEGAL.ENDERECO}<br />{LEGAL.EMAIL}</p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
      </footer>

      {showBar && !done && (
        <div className="bar">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs truncate" style={{ color: 'var(--mute)' }}>{chosen ? pkg.title : t('fromM')}</p>
              <p className="serif text-2xl leading-none">{money(chosen ? pkg.price : MIN_PRICE)}</p>
            </div>
            <button type="button" onClick={goBook} className="btn btn-p">{t('cta')}</button>
          </div>
        </div>
      )}

      {profileOpen && (
        <Modal title={t('profile')} onClose={() => setProfileOpen(false)} closeLabel={t('close')}>
          <div className="p-6">
            <div className="flex items-center gap-5 mb-5">
              <Avatar className="w-24 h-24 rounded-full" alt={SITE.FIRST_NAME} />
              <div>
                <h3 className="serif text-2xl leading-tight">{SITE.ABOUT_TITLE}</h3>
                <p className="text-sm font-bold" style={{ color: 'var(--acc)' }}>{t('aboutR')}</p>
              </div>
            </div>
            <p className="leading-relaxed mb-2">{greeting}. {SITE.ABOUT_1}</p>
            <ul className="my-4 space-y-2">
              {SITE.BULLETS.map((b) => (<li key={b} className="flex items-start gap-3 text-[15.5px] leading-relaxed"><Icon name="check" size={18} className="mt-1" /><span>{b}</span></li>))}
            </ul>
            <dl className="rounded-2xl p-5 space-y-4 mb-6" style={{ background: 'var(--surf2)' }}>
              {([['pHours', t('pHoursV')], ['pWhere', t('pWhereV')], ['pPay', t('pPayV')], ['pCancel', t('pCancelV')]] as [string, string][]).map(([k, v]) => (
                <div key={k}><dt className="text-xs font-bold" style={{ color: 'var(--mute)' }}>{t(k)}</dt><dd className="text-[15.5px] font-semibold">{v}</dd></div>
              ))}
              <div><dt className="text-xs font-bold" style={{ color: 'var(--mute)' }}>{t('sLoc')}</dt><dd className="text-[15.5px] font-semibold">{SITE.ABOUT_2}</dd></div>
            </dl>
            <div className="grid gap-3 mb-6">
              {phase === 'site' && <button type="button" className="btn btn-p w-full" onClick={() => { setProfileOpen(false); goBook(); }}>{t('cta')}</button>}
              <a href={chatLink} target="_blank" rel="noopener noreferrer" className="btn btn-g w-full"><Icon name="chat" size={18} /> {t('chatBtn')}</a>
              {(SITE.INSTAGRAM || SITE.REVIEW_LINK) && (
                <div className="grid grid-cols-2 gap-3">
                  {SITE.INSTAGRAM && <a href={SITE.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="instagram" size={18} /> Instagram</a>}
                  {SITE.REVIEW_LINK && <a href={SITE.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="star" size={18} /> {t('reviews')}</a>}
                </div>
              )}
            </div>
            <button type="button" onClick={forgetMe} className="w-full text-sm underline underline-offset-4 min-h-[48px]" style={{ color: 'var(--mute)' }}>{t('pForget')}</button>
          </div>
        </Modal>
      )}

      {doc && (
        <Modal title={DOCS[doc].title} onClose={() => setDoc(null)} closeLabel={t('close')}>
          <div className="p-5 text-sm leading-relaxed" style={{ color: 'var(--mute)' }} tabIndex={0}>
            {DOCS[doc].body}
          </div>
        </Modal>
      )}
    </div>
  );
}
