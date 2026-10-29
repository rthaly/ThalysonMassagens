import { useEffect, useMemo, useRef, useState } from 'react';

const CONFIG = {
  brand: 'relaxe',
  whatsapp: '5517991360413',
  pixKey: '62.922.530/0001-44',
  avatar: '/thalyson.jpg',
  email: 'relaxecomthalyson@gmail.com',
  razao: 'Thalyson Rodrigo dos Santos',
  cnpj: '62.922.530/0001-44',
  dpo: 'Thalyson Rodrigo dos Santos',
  dpoEmail: 'relaxecomthalyson@gmail.com',
  street: 'Avenida 9 de Julho',
  district: 'Bela Vista',
  city: 'São Paulo',
  state: 'SP',
  studioNote: 'Bela Vista · próximo ao Metrô Anhangabaú',
  daysAhead: 14,
  homeFee: 60,
  peakFee: 18,
  deposit: 40,
  firstDiscount: 15,
  specialFee: 140,
  pixDiscountPct: 3,
  cancelFreeHours: 12,
  coupons: { SESSAO2: 0.08, RELAXAR13: 0.13 },
  addons: [
    { id: 'time', minutes: 30, price: 75, name: { pt: '30 min extras', en: '30 extra min' } },
    { id: 'groom', minutes: 0, price: 130, name: { pt: 'Aparar pelos', en: 'Grooming' } },
  ],
  packages: [
    { id: 'classica', minutes: 40, price: 180, name: { pt: 'Clássica', en: 'Classic' } },
    { id: 'sensitiva', minutes: 60, price: 220, name: { pt: 'Sensitiva', en: 'Sensitive' } },
    { id: 'barba', minutes: 60, price: 290, name: { pt: 'Barba', en: 'Beard' } },
    { id: 'completa', minutes: 60, price: 390, name: { pt: 'Completa', en: 'Full' } },
    { id: 'aparo', minutes: 40, price: 130, name: { pt: 'Aparar', en: 'Grooming only' } },
  ],
} as const;

type PackageId = (typeof CONFIG.packages)[number]['id'];
type Lang = 'pt' | 'en';
type Theme = 'light' | 'dark';
type Place = 'studio' | 'home';
type Payment = 'pix' | 'card' | 'cash';

const WINDOWS = [
  { id: 'morning', start: 9, end: 12 },
  { id: 'afternoon', start: 13, end: 17 },
  { id: 'evening', start: 18, end: 23 },
] as const;

type WindowId = (typeof WINDOWS)[number]['id'];

function money(value: number, lang: Lang) {
  const fmt = new Intl.NumberFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(value);
  return fmt.replace(/^R\\\$\\s*/, 'R$​');
}

function buildDays(count: number) {
  const base = new Date();
  base.setHours(12, 0, 0, 0);
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    return { d };
  });
}

function firstOpenDay(days: { d: Date }[]) {
  return days.findIndex((day) => windowsFor(day.d).length > 0);
}

function windowsFor(date: Date) {
  const now = Date.now();
  return WINDOWS.filter((w) => {
    const end = new Date(date);
    end.setHours(w.end, 0, 0, 0);
    return end.getTime() - now > 90 * 60 * 1000;
  }).map((w) => w.id);
}

function pkgPrice(pkgId: PackageId) {
  return CONFIG.packages.find((p) => p.id === pkgId)?.price ?? 0;
}

function pkgName(pkgId: PackageId, lang: Lang) {
  return CONFIG.packages.find((p) => p.id === pkgId)?.name[lang] ?? 'Sessão';
}

function durationStr(pkgId: PackageId) {
  return CONFIG.packages.find((p) => p.id === pkgId)?.minutes ?? 40;
}

// Format WhatsApp message with all session details
function formatWaMessage({
  pkgId,
  place,
  win,
  name,
  payment,
  coupon,
  special,
  lang,
}: {
  pkgId: PackageId;
  place: Place;
  win: WindowId;
  name: string;
  payment: Payment;
  coupon?: { code: string; pct: number } | null;
  special?: string | null;
  lang: Lang;
}) {
  const pkg = CONFIG.packages.find((p) => p.id === pkgId) ?? CONFIG.packages[0];
  const price = pkg.price;
  const duration = pkg.minutes;
  const homeFeeVal = place === 'home' ? CONFIG.homeFee : 0;
  const peakFeeVal = win === 'evening' ? CONFIG.peakFee : 0;
  const discount = coupon?.pct ? Math.round(price * coupon.pct) : 0;
  const pixDiscount = place === 'home' && payment === 'pix' ? Math.round(price * (CONFIG.pixDiscountPct / 100)) : 0;
  const base = price + 0 + homeFeeVal + peakFeeVal - discount - pixDiscount;
  const total = base + CONFIG.deposit;
  const rest = total - CONFIG.deposit;

  const lines: string[] = [];

  lines.push('*Sessão de massagem relaxe*');
  lines.push('');

  // Time / package
  lines.push(`*Tempo:* ${pkgName(pkgId, lang)} · ${duration} min · R$ ${price}`);

  // Where
  const placeTxt = place === 'studio' ? 'No estúdio' : `No seu endereço · R$ ${homeFeeVal}`;
  lines.push(`*Onde:* ${placeTxt}`);

  // When
  const winTxt = win === 'morning' ? 'Manhã (9h–12h)' : win === 'afternoon' ? 'Tarde (13h–17h)' : 'Noite (18h–23h)';
  lines.push(`*Quando:* ${winTxt}`);

  // Who
  const nameTxt = name.trim() ? name : 'Não informado';
  lines.push(`*Quem:* ${nameTxt}`);

  // Add-ons
  const addonNames: string[] = [];
  if (special && special.includes('time')) addonNames.push('30 min extras R$ 75');
  if (special && special.includes('groom')) addonNames.push('Aparar pelos R$ 130');
  lines.push(`*Adicionais:* ${addonNames.length > 0 ? addonNames.join(', ') : 'Nenhum'}`);

  // Coupon
  if (coupon) {
    lines.push(`*Cupom:* ${coupon.code} · −${Math.round(coupon.pct * 100)}%`);
  }

  // Payment
  const paymentTxt = payment === 'pix' ? 'Pix −3%' : payment === 'card' ? 'Cartão 12x' : 'Dinheiro';
  lines.push(`*Pagamento:* ${paymentTxt}`);

  // Total
  lines.push(`*Total:* R$ ${total}`);

  // Deposit
  lines.push(`*Sinal:* R$ ${CONFIG.deposit}`);

  // Rest
  lines.push(`*Restante:* R$ ${rest}`);

  // Special request
  if (special && special.trim()) {
    lines.push(`*Pedido específico:* ${special}`);
  }

  // Note
  lines.push('');
  lines.push('*Nada é cobrado aqui. A confirmação e o sinal são combinados na conversa.*');

  // Encode for WhatsApp
  const text = lines.join('\n');
  return encodeURIComponent(text);
}

export default function App() {
  const [lang, setLang] = useState<Lang>('pt');
  const [theme, setTheme] = useState<Theme>('light');
  const profile = useMemo(() => {
    try {
      const raw = window.localStorage.getItem('relaxe.profile');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }, []);
  const [remember, setRemember] = useState<boolean>(!!window.localStorage.getItem('relaxe.remember'));
  const [sent, setSent] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pkgId, setPkgId] = useState<PackageId>('classica');
  const [name, setName] = useState(profile?.name ?? '');
  const [place, setPlace] = useState<Place>(profile?.place ?? 'studio');
  const [cep, setCep] = useState(profile?.cep ?? '');
  const [street, setStreet] = useState(profile?.street ?? '');
  const [number, setNumber] = useState(profile?.number ?? '');
  const [district, setDistrict] = useState(profile?.district ?? '');
  const [prefs, setPrefs] = useState('');
  const [special, setSpecial] = useState('');

  // Navigation helpers
  const goBack = () => {
    if (step === 1) setStep(1);
    else if (step === 2) setStep(1);
    else setStep(2);
  };
  const goForward = () => {
    if (!name.trim()) return;
    if (step === 1) setStep(2);
    else setStep(3);
  };

  // Handle send to WhatsApp
  const handleSend = () => {
    // Final validation
    if (!name.trim()) return alert('Escreva como você quer ser chamado.');

    // Build message with all current data
    const waMessage = formatWaMessage({
      pkgId,
      place,
      win: 'afternoon' as WindowId,
      name,
      payment: 'pix' as Payment,
      coupon: null,
      special,
      lang,
    });

    // Open WhatsApp
    const waHref = `https://wa.me/${CONFIG.whatsapp}?text=${waMessage}`;
    window.open(waHref, '_blank', 'noopener noreferrer');
    setSent(true);
  };

  return (
    <div className="rx-boot">
      <h1 className="rx-boot__brand">relaxe</h1>
      <div className="rx-boot__bar" />

      <div className="rx-steps">
        <button className="rx-steps__btn" disabled><span className="rx-steps__num">1</span> Sessão</button>
        <button className="rx-steps__btn" disabled><span className="rx-steps__num">2</span> Agenda</button>
        <button className="rx-steps__btn" disabled><span className="rx-steps__num">3</span> Você</button>
      </div>

      <section className="rx-panel" style={{ minHeight: '210px', animation: 'rx-in 0.22s ease-out both' }}>
        {step === 1 && (
          <><h3>Quanto tempo você quer</h3>
            <p>Escolha a sessão. Os adicionais entram na conta.</p>
            <div style={{ display: 'grid', gap: '8px', marginTop: '8px' }}>
              {CONFIG.packages.map((item) => (
                <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', border: '1px solid var(--line)', borderRadius: '11px', cursor: 'pointer', fontSize: '12px' }}>
                  <input type="radio" name="rx-package" value={item.id} checked={pkgId === item.id} style={{ display: 'none' }} />
                  <span>{item.name.pt} – {item.minutes} min – R$ {item.price}</span>
                </label>
              ))}
            </div></>
        )}

        {step === 2 && (
          <><h3>Onde você prefere</h3>
            <div style={{ display: 'flex', gap: '16px', margin: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '10px', cursor: 'pointer' }}>
                <input type="radio" name="rx-place" value="studio" checked={place === 'studio'} style={{ display: 'none' }} />
                <span>No estúdio</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', border: '1px solid var(--line)', borderRadius: '10px', cursor: 'pointer' }}>
                <input type="radio" name="rx-place" value="home" checked={place === 'home'} style={{ display: 'none' }} />
                <span>No seu endereço</span>
              </label>
            </div>
            {place === 'home' && (
              <><div style={{ margin: '0 16px 16px' }}>
                <input className="rx-input" placeholder="CEP" style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
                <input className="rx-input" placeholder="Rua" style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
                <input className="rx-input" placeholder="Número" style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
                <input className="rx-input" placeholder="Bairro" style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
              </div></>
            )}
            <div style={{ margin: '16px 0' }}>
              <p>Manhã: 9h–12h</p>
              <p>Tarde: 13h–17h</p>
              <p>Noite: 18h–23h</p>
            </div></>
        )}

        {step === 3 && (
          <><h3>Quem vai chegar</h3>
            <div style={{ marginBottom: '16px' }}>
              <input className="rx-input" placeholder="Seu nome" style={{ width: '100%', padding: '8px', marginBottom: '8px' }} />
            </div>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="radio" name="rx-payment" value="pix" checked style={{ display: 'none' }} />
                <span>Pix −3%</span>
              </label>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="radio" name="rx-payment" value="card" style={{ display: 'none' }} />
                <span>Cartão 12x</span>
              </label>
              <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="radio" name="rx-payment" value="cash" style={{ display: 'none' }} />
                <span>Dinheiro</span>
              </label>
            </div>
            <div style={{ margin: '16px 0' }}>
              <textarea placeholder="Preferências ou pedido específico" style={{ width: '100%', padding: '8px', marginBottom: '8px', minHeight: '60px' }}></textarea>
            </div>
            <div style={{ margin: '16px 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input type="checkbox" style={{ transform: 'scale(1.2)' }} />
                <span>Consinto em informar pedido específico</span>
              </label>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--muted)' }}>
                <span>Total: R$ {money(pkgPrice(pkgId) + CONFIG.deposit, lang)}</span>
                <span>Sinal: R$ {CONFIG.deposit}</span>
                <span>Restante: R$ {money(pkgPrice(pkgId), lang)}</span>
              </div>
            </div></>
        )}
      </section>

      <div className="rx-nav" style={{ display: 'flex', gap: '12px', marginTop: '22px', paddingTop: '16px', borderTop: '1px solid var(--line)', alignItems: 'center', justifyContent: 'flex-end' }}>
        {step > 1 && (
          <button className="rx-btn rx-btn--ghost rx-btn--back" style={{ flexShrink: 0, minWidth: '104px' }} onClick={goBack}>
            Voltar
          </button>
        )}
        {step < 3 && <button className="rx-btn rx-btn--primary" onClick={goForward}>Continuar</button>}
        {step === 3 && (
          <button className="rx-btn rx-btn--primary" onClick={handleSend}>
            Enviar no WhatsApp
          </button>
        )}
      </div>
    </div>
  );
}