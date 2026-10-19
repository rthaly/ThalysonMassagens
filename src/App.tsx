import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

/**
 * DEMONSTRAÇÃO DE AGENDAMENTO — mobile-first
 * Um único App.tsx, sem Tailwind e sem dependências adicionais.
 * Personalize nomes, telefone, endereço, fotos e serviços no objeto PROFILES.
 * Os horários são exemplos; disponibilidade real exige agenda/backend compartilhado.
 */

type ProfileId = 'feminino' | 'masculino';
type Service = { id: string; name: string; description: string; minutes: number; price: number; image: string };
type Profile = {
  id: ProfileId; name: string; role: string; intro: string; location: string; phone: string; instagram: string;
  cover: string; theme: { bg: string; surface: string; ink: string; muted: string; line: string; accent: string; accentInk: string };
  services: Service[];
};

const PHOTO = {
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
  massage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
  stones: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
  male: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
  recovery: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
};

const PROFILES: Record<ProfileId, Profile> = {
  feminino: {
    id: 'feminino', name: 'Marina Albuquerque', role: 'Massoterapia & bem-estar',
    intro: 'Um momento só seu.', location: 'Jardins · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.spa,
    theme: { bg: '#fbf7f5', surface: '#ffffff', ink: '#382b30', muted: '#81747a', line: '#eadfdf', accent: '#b77d87', accentInk: '#ffffff' },
    services: [
      { id: 'relaxante', name: 'Massagem relaxante', description: 'Para desacelerar e aliviar as tensões do dia.', minutes: 60, price: 180, image: PHOTO.massage },
      { id: 'drenagem', name: 'Drenagem linfática', description: 'Manobras suaves e sensação de leveza.', minutes: 60, price: 200, image: PHOTO.stones },
      { id: 'facial', name: 'Ritual facial', description: 'Limpeza e hidratação em uma pausa restauradora.', minutes: 50, price: 160, image: PHOTO.facial },
    ],
  },
  masculino: {
    id: 'masculino', name: 'Rafael Mendes', role: 'Terapia corporal & recovery',
    intro: 'Recupere seu ritmo.', location: 'Itaim Bibi · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.male,
    theme: { bg: '#111a17', surface: '#19241f', ink: '#f2eee5', muted: '#b1b8b0', line: '#35433b', accent: '#c6a66e', accentInk: '#18211c' },
    services: [
      { id: 'deep', name: 'Massagem deep tissue', description: 'Pressão direcionada para pontos de tensão.', minutes: 60, price: 210, image: PHOTO.recovery },
      { id: 'recovery', name: 'Recovery esportivo', description: 'Cuidado corporal após treinos e dias intensos.', minutes: 60, price: 230, image: PHOTO.massage },
      { id: 'reset', name: 'Reset antiestresse', description: 'Uma pausa para reduzir o ritmo da rotina.', minutes: 50, price: 170, image: PHOTO.stones },
    ],
  },
};

const ADDONS = [ { id: 'aroma', name: 'Aromaterapia', price: 25 }, { id: 'escalda', name: 'Escalda-pés botânico', price: 35 } ];
const TIMES = ['09:00', '10:00', '11:30', '13:00', '14:30', '16:00', '17:00', '18:30'];
const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const clean = (s: string) => s.replace(/[<>\u0000-\u001f]/g, ' ').trim().slice(0, 160);

export default function App() {
  const [profileId, setProfileId] = useState<ProfileId>('feminino');
  const profile = PROFILES[profileId];
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addons, setAddons] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const service = profile.services.find((s) => s.id === serviceId);
  const total = (service?.price ?? 0) + ADDONS.filter((a) => addons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const dates = useMemo(() => Array.from({ length: 10 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }), [profileId]);
  const selectedDate = date ? new Date(`${date}T12:00:00`) : null;
  const dateLabel = selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : '';
  const themeVars = { '--bg': profile.theme.bg, '--surface': profile.theme.surface, '--ink': profile.theme.ink, '--muted': profile.theme.muted, '--line': profile.theme.line, '--accent': profile.theme.accent, '--accent-ink': profile.theme.accentInk } as CSSProperties;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const changeProfile = (id: ProfileId) => {
    if (id === profileId) return;
    setProfileId(id); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setPhone(''); setNote(''); setError(''); setSent(false); scrollTop();
  };
  const goToSchedule = () => {
    if (!service) { setError('Escolha uma experiência para continuar.'); return; }
    setError(''); setStep(1); scrollTop();
  };
  const goToDetails = () => {
    if (!date || !time) { setError('Escolha uma data e um horário.'); return; }
    setError(''); setStep(2); scrollTop();
  };
  const sendRequest = () => {
    if (!service) { setStep(0); setError('Escolha uma experiência.'); return; }
    if (name.trim().split(/\s+/).filter(Boolean).length < 2) { setError('Informe seu nome e sobrenome.'); return; }
    if (phone.replace(/\D/g, '').length < 10) { setError('Informe um telefone válido para contato.'); return; }
    const extraText = ADDONS.filter((a) => addons.includes(a.id)).map((a) => `• ${a.name}: ${money(a.price)}`).join('\n');
    const message = `Olá, ${profile.name}! Gostaria de solicitar um agendamento.\n\nServiço: ${service.name} (${service.minutes} min)\nData: ${dateLabel}\nHorário: ${time}\n${extraText ? `Adicionais:\n${extraText}\n` : ''}Valor estimado: ${money(total)}\nNome: ${clean(name)}\nContato: ${clean(phone)}${note.trim() ? `\nObservações: ${clean(note)}` : ''}\n\nSei que o horário precisa ser confirmado.`;
    const target = profile.phone.replace(/\D/g, '');
    const url = target ? `https://wa.me/${target}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer'); setSent(true); setError('');
  };

  return <div className="booking-app" style={themeVars}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap');
      .booking-app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'DM Sans',Arial,sans-serif;transition:background .25s,color .25s;padding-bottom:calc(92px + env(safe-area-inset-bottom))}
      .booking-app *{box-sizing:border-box}.booking-app button,.booking-app input,.booking-app textarea{font:inherit}.booking-app button{cursor:pointer;touch-action:manipulation}.booking-app button:focus-visible,.booking-app input:focus-visible,.booking-app textarea:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
      .booking-wrap{width:min(100% - 32px,720px);margin:0 auto}.booking-top{height:68px;display:flex;align-items:center;justify-content:space-between;gap:12px;border-bottom:1px solid var(--line)}.booking-brand{min-width:0}.booking-brand strong{display:block;font:500 18px/1.1 'Playfair Display',Georgia,serif;white-space:nowrap}.booking-brand span{display:block;color:var(--muted);font-size:10px;margin-top:4px}.booking-switch{display:flex;gap:3px;border:1px solid var(--line);padding:3px;border-radius:99px;background:var(--surface);flex-shrink:0}.booking-switch button{border:0;border-radius:99px;background:transparent;color:var(--muted);font-size:11px;font-weight:700;padding:9px 11px}.booking-switch button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
      .booking-hero{padding:24px 0 20px}.booking-hero-image{height:170px;border-radius:14px;overflow:hidden;background:var(--line);position:relative}.booking-hero-image img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block}.booking-hero-image:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.36),transparent 80%)}.booking-hero-copy{position:absolute;z-index:1;left:20px;right:18px;bottom:18px;color:#fff}.booking-kicker{text-transform:uppercase;letter-spacing:.15em;font-size:9px;font-weight:700;opacity:.9}.booking-hero h1{font:400 clamp(30px,8vw,42px)/1.04 'Playfair Display',Georgia,serif;white-space:pre-line;margin:8px 0 0;max-width:340px}.booking-location{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:11px;margin-top:13px}
      .booking-step-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0}.booking-step-head h2{font:400 27px/1.1 'Playfair Display',Georgia,serif;margin:0}.booking-step-head span{font-size:10px;color:var(--muted);white-space:nowrap}.booking-progress{height:3px;display:flex;gap:5px;margin:18px 0 22px}.booking-progress i{height:3px;flex:1;background:var(--line);border-radius:8px}.booking-progress i.on{background:var(--accent)}.booking-section-label{font-size:11px;font-weight:700;margin:20px 0 10px}.booking-services{display:grid;gap:10px}.booking-service{width:100%;display:flex;align-items:center;gap:12px;text-align:left;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:10px;min-height:100px;transition:border-color .16s,background .16s}.booking-service[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}.booking-service img{width:78px;height:78px;object-fit:cover;border-radius:8px;flex-shrink:0}.booking-service-info{flex:1;min-width:0}.booking-service-info strong{display:block;font-size:13px;line-height:1.3}.booking-service-info small{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-top:4px}.booking-service-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}.booking-service-meta b{font-size:13px}.booking-service-meta span{font-size:10px;color:var(--muted)}.booking-radio{width:20px;height:20px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;flex-shrink:0}.booking-service[aria-pressed="true"] .booking-radio{border-color:var(--accent)}.booking-service[aria-pressed="true"] .booking-radio:after{content:'';width:10px;height:10px;border-radius:50%;background:var(--accent)}
      .booking-card{background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:16px;margin-top:12px}.booking-date-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.booking-date{min-width:0;padding:10px 2px;border:1px solid var(--line);border-radius:9px;background:transparent;color:var(--ink);text-align:center}.booking-date small{display:block;color:var(--muted);font-size:9px;text-transform:capitalize;margin-bottom:7px}.booking-date strong{font-size:15px}.booking-date[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}.booking-date[aria-pressed="true"] small{color:inherit;opacity:.8}.booking-time-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.booking-time{padding:12px 2px;border:1px solid var(--line);border-radius:9px;background:transparent;color:var(--ink);font-size:12px}.booking-time[aria-pressed="true"]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--surface));box-shadow:inset 0 0 0 1px var(--accent)}.booking-addon{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--line);font-size:12px}.booking-addon:last-child{border-bottom:0}.booking-addon input{width:18px;height:18px;accent-color:var(--accent)}.booking-addon span:nth-child(2){flex:1}.booking-addon b{font-size:12px}.booking-field{display:block;margin:14px 0}.booking-field span{display:block;font-size:11px;font-weight:700;margin-bottom:7px}.booking-field input,.booking-field textarea{display:block;width:100%;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--ink);padding:13px 12px;font-size:14px;min-height:46px}.booking-field textarea{min-height:76px;resize:vertical}.booking-field input::placeholder,.booking-field textarea::placeholder{color:var(--muted)}.booking-summary{background:var(--bg);border-radius:10px;padding:14px;margin:14px 0}.booking-summary-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;font-size:12px}.booking-summary-row span{color:var(--muted)}.booking-summary-row strong{text-align:right}.booking-summary-total{border-top:1px solid var(--line);margin-top:5px;padding-top:13px;font-size:15px}.booking-error{color:#c04e4e;font-size:12px;margin:12px 0}.booking-note{font-size:11px;color:var(--muted);line-height:1.55;margin:12px 0}.booking-actions{display:flex;gap:10px;margin-top:20px}.booking-btn{min-height:48px;border-radius:10px;padding:0 17px;border:1px solid var(--line);background:transparent;color:var(--ink);font-weight:700;font-size:13px;display:inline-flex;align-items:center;justify-content:center;gap:8px}.booking-btn.primary{flex:1;background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.booking-btn:disabled{opacity:.45;cursor:not-allowed}.booking-bottom{position:fixed;z-index:20;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -8px 25px rgba(0,0,0,.05)}.booking-bottom-inner{width:min(100%,720px);margin:auto;display:flex;align-items:center;gap:12px}.booking-bottom-price{min-width:82px}.booking-bottom-price small{display:block;font-size:10px;color:var(--muted);margin-bottom:3px}.booking-bottom-price strong{font-size:16px}.booking-bottom .booking-btn{flex:1}.booking-success{text-align:center;padding:36px 8px 22px}.booking-success-mark{width:54px;height:54px;margin:0 auto 18px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-size:24px}.booking-success h2{font:400 30px/1.1 'Playfair Display',Georgia,serif;margin:0 0 10px}.booking-success p{font-size:13px;line-height:1.65;color:var(--muted);max-width:330px;margin:0 auto 20px}.booking-footer{text-align:center;color:var(--muted);font-size:10px;padding:26px 0 10px}
      @media(min-width:640px){.booking-wrap{width:min(100% - 48px,720px)}.booking-hero{padding-top:30px}.booking-hero-image{height:240px}.booking-service img{width:88px;height:88px}.booking-services{gap:12px}.booking-card{padding:20px}.booking-bottom{padding-left:24px;padding-right:24px}}
      @media(max-width:360px){.booking-wrap{width:calc(100% - 24px)}.booking-brand strong{font-size:16px}.booking-switch button{padding:8px;font-size:10px}.booking-hero-image{height:155px}.booking-service{gap:8px;padding:8px}.booking-service img{width:66px;height:72px}.booking-service-info small{font-size:10px}.booking-time-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.booking-bottom-inner{gap:8px}.booking-bottom-price{min-width:68px}}
      @media(prefers-reduced-motion:reduce){.booking-app *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `}</style>

    <header className="booking-wrap booking-top">
      <div className="booking-brand"><strong>{profile.name}</strong><span>{profile.role}</span></div>
      <div className="booking-switch" role="group" aria-label="Escolher demonstração">
        <button type="button" aria-pressed={profileId === 'feminino'} onClick={() => changeProfile('feminino')}>Marina</button>
        <button type="button" aria-pressed={profileId === 'masculino'} onClick={() => changeProfile('masculino')}>Rafael</button>
      </div>
    </header>

    <main className="booking-wrap">
      <section className="booking-hero" aria-label={`Apresentação de ${profile.name}`}>
        <div className="booking-hero-image"><img src={profile.cover} alt="Ambiente de bem-estar" /><div className="booking-hero-copy"><div className="booking-kicker">{profile.role}</div><h1>{profile.intro}</h1></div></div>
        <div className="booking-location">⌖ <span>{profile.location}</span><span>·</span><span>Atendimento com hora marcada</span></div>
      </section>

      {!sent ? <>
        <div className="booking-progress" aria-label={`Etapa ${step + 1} de 3`}>{[0, 1, 2].map((n) => <i key={n} className={n <= step ? 'on' : ''} />)}</div>

        {step === 0 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Escolha seu cuidado</h2><span>1 de 3</span></div>
          <div className="booking-services">{profile.services.map((s) => <button key={`${profileId}-${s.id}`} type="button" className="booking-service" aria-pressed={serviceId === s.id} onClick={() => { setServiceId(s.id); setError(''); }}>
            <img src={s.image} alt="" loading="lazy" /><span className="booking-service-info"><strong>{s.name}</strong><small>{s.description}</small><span className="booking-service-meta"><b>{money(s.price)}</b><span>{s.minutes} min</span></span></span><span className="booking-radio" aria-hidden="true" />
          </button>)}</div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Escolha uma experiência para ver os horários disponíveis nesta demonstração.</p>
        </section>}

        {step === 1 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Quando fica melhor?</h2><span>2 de 3</span></div>
          {service && <div className="booking-card"><div className="booking-summary-row"><span>Experiência</span><strong>{service.name}</strong></div><div className="booking-summary-row"><span>Duração</span><strong>{service.minutes} minutos</strong></div></div>}
          <div className="booking-section-label">Escolha o dia</div>
          <div className="booking-date-grid">{dates.map((d, i) => { const key = dateKey(d); return <button key={key} type="button" className="booking-date" aria-pressed={date === key} onClick={() => { setDate(key); setTime(''); setError(''); }}><small>{i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small><strong>{d.getDate()}</strong></button>; })}</div>
          <div className="booking-section-label">Horários</div>
          <div className="booking-time-grid">{TIMES.map((t) => <button key={t} type="button" className="booking-time" aria-pressed={time === t} onClick={() => { setTime(t); setError(''); }}>{t}</button>)}</div>
          <div className="booking-section-label">Torne a experiência ainda mais especial <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></div>
          <div className="booking-card">{ADDONS.map((a) => <label key={a.id} className="booking-addon"><input type="checkbox" checked={addons.includes(a.id)} onChange={(e) => setAddons((old) => e.target.checked ? [...old, a.id] : old.filter((id) => id !== a.id))} /><span>{a.name}</span><b>+ {money(a.price)}</b></label>)}</div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Os horários são ilustrativos e precisam ser confirmados pelo profissional.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(0); setError(''); }}>← Voltar</button></div>
        </section>}

        {step === 2 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Seus dados</h2><span>3 de 3</span></div>
          <div className="booking-card"><div className="booking-summary-row"><span>Experiência</span><strong>{service?.name}</strong></div><div className="booking-summary-row"><span>Data</span><strong>{dateLabel}</strong></div><div className="booking-summary-row"><span>Horário</span><strong>{time}</strong></div>{ADDONS.filter((a) => addons.includes(a.id)).map((a) => <div key={a.id} className="booking-summary-row"><span>{a.name}</span><strong>{money(a.price)}</strong></div>)}<div className="booking-summary-row booking-summary-total"><span>Total estimado</span><strong>{money(total)}</strong></div></div>
          <label className="booking-field"><span>Nome completo</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Seu nome e sobrenome" maxLength={80} /></label>
          <label className="booking-field"><span>WhatsApp para contato</span><input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" placeholder="(11) 99999-9999" maxLength={20} /></label>
          <label className="booking-field"><span>Observação <span style={{ display: 'inline', fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alguma preferência ou informação importante?" maxLength={160} /></label>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Ao enviar, o WhatsApp abrirá com sua solicitação pronta. O agendamento só será confirmado após resposta do profissional.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(1); setError(''); }}>← Voltar</button></div>
        </section>}
      </> : <section className="booking-success" aria-live="polite"><div className="booking-success-mark">✓</div><h2>Pedido preparado</h2><p>O WhatsApp foi aberto com os detalhes. Aguarde a confirmação de disponibilidade antes de considerar o horário reservado.</p><button type="button" className="booking-btn primary" onClick={() => { setSent(false); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setPhone(''); setNote(''); setError(''); scrollTop(); }}>Fazer novo agendamento</button></section>}
      <footer className="booking-footer">Demonstração de experiência de agendamento · {profile.name}</footer>
    </main>

    {!sent && <div className="booking-bottom"><div className="booking-bottom-inner">
      <div className="booking-bottom-price"><small>{step === 0 ? (service ? 'Selecionado' : 'A partir de') : 'Total estimado'}</small><strong>{step === 0 ? money(service?.price ?? Math.min(...profile.services.map((s) => s.price))) : money(total)}</strong></div>
      {step === 0 ? <button type="button" className="booking-btn primary" disabled={!service} onClick={goToSchedule}>Escolher horário →</button> : step === 1 ? <button type="button" className="booking-btn primary" disabled={!date || !time} onClick={goToDetails}>Continuar →</button> : <button type="button" className="booking-btn primary" onClick={sendRequest}>Enviar pedido ↗</button>}
    </div></div>}
  </div>;
}
