import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type ProfileId = 'marina' | 'rafael' | 'camila' | 'lucas' | 'beatriz';
type Service = { id: string; name: string; description: string; minutes: number; price: number; image: string };
type Addon = { id: string; name: string; price: number };
type Profile = {
  id: ProfileId; shortName: string; name: string; role: string; intro: string; location: string; phone: string; instagram: string;
  cover: string; theme: { bg: string; surface: string; ink: string; muted: string; line: string; accent: string; accentInk: string };
  services: Service[]; addons: Addon[];
};

const PHOTO = {
  spa: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=85',
  massage: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80',
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80',
  stones: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=900&q=80',
  trainer: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=85',
  training: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80',
  recovery: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
  physio: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=85',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=85',
};

const PROFILES: Record<ProfileId, Profile> = {
  marina: {
    id: 'marina', shortName: 'Massagem', name: 'Marina Albuquerque', role: 'Massoterapia & bem-estar',
    intro: 'Um momento só seu.', location: 'Jardins · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.spa,
    theme: { bg: '#fffdfd', surface: '#ffffff', ink: '#33262b', muted: '#81747b', line: '#eee3e6', accent: '#b66f83', accentInk: '#ffffff' },
    services: [
      { id: 'relaxante', name: 'Massagem relaxante', description: 'Para desacelerar e aliviar as tensões do dia.', minutes: 60, price: 180, image: PHOTO.massage },
      { id: 'drenagem', name: 'Drenagem linfática', description: 'Manobras suaves e sensação de leveza.', minutes: 60, price: 200, image: PHOTO.stones },
      { id: 'pedras', name: 'Massagem com pedras quentes', description: 'Calor reconfortante para uma pausa profunda.', minutes: 75, price: 230, image: PHOTO.spa },
    ],
    addons: [{ id: 'aroma', name: 'Aromaterapia', price: 25 }, { id: 'escalda', name: 'Escalda-pés botânico', price: 35 }],
  },
  rafael: {
    id: 'rafael', shortName: 'Personal', name: 'Rafael Mendes', role: 'Personal trainer',
    intro: 'Treino com propósito.', location: 'Itaim Bibi · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.trainer,
    theme: { bg: '#f8fafc', surface: '#ffffff', ink: '#192a43', muted: '#69778b', line: '#e1e7ef', accent: '#29476f', accentInk: '#ffffff' },
    services: [
      { id: 'avaliacao', name: 'Avaliação física', description: 'Conversa inicial, objetivos e avaliação do condicionamento.', minutes: 60, price: 150, image: PHOTO.recovery },
      { id: 'individual', name: 'Treino individual', description: 'Sessão personalizada para seu objetivo e ritmo.', minutes: 60, price: 180, image: PHOTO.training },
      { id: 'dupla', name: 'Treino em dupla', description: 'Treine com acompanhamento e motivação extra.', minutes: 60, price: 240, image: PHOTO.trainer },
    ],
    addons: [{ id: 'mobilidade', name: 'Bloco de mobilidade', price: 30 }, { id: 'plano', name: 'Plano de treino personalizado', price: 60 }],
  },
  camila: {
    id: 'camila', shortName: 'Estética', name: 'Camila Nogueira', role: 'Estética facial',
    intro: 'Sua pele, seu ritual.', location: 'Moema · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.facial,
    theme: { bg: '#fcfaf7', surface: '#ffffff', ink: '#3c3029', muted: '#82766c', line: '#ece4dc', accent: '#a66e50', accentInk: '#ffffff' },
    services: [
      { id: 'limpeza', name: 'Limpeza de pele', description: 'Cuidado completo para uma pele limpa e equilibrada.', minutes: 60, price: 190, image: PHOTO.facial },
      { id: 'hidratacao', name: 'Hidratação facial', description: 'Ritual focado em conforto, maciez e hidratação.', minutes: 45, price: 150, image: PHOTO.spa },
      { id: 'express', name: 'Glow express', description: 'Um cuidado rápido para renovar o viço da pele.', minutes: 30, price: 110, image: PHOTO.stones },
    ],
    addons: [{ id: 'mascara', name: 'Máscara facial especial', price: 35 }, { id: 'massagem-facial', name: 'Massagem facial relaxante', price: 25 }],
  },
  lucas: {
    id: 'lucas', shortName: 'Fisioterapia', name: 'Lucas Ferreira', role: 'Fisioterapia & movimento',
    intro: 'Movimento com confiança.', location: 'Pinheiros · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.physio,
    theme: { bg: '#f7fbfa', surface: '#ffffff', ink: '#203a37', muted: '#6d827e', line: '#deebe7', accent: '#32796f', accentInk: '#ffffff' },
    services: [
      { id: 'avaliacao-fisio', name: 'Avaliação fisioterapêutica', description: 'Entenda suas necessidades e organize os próximos passos.', minutes: 60, price: 220, image: PHOTO.physio },
      { id: 'terapia-manual', name: 'Terapia manual', description: 'Atendimento individual focado em mobilidade e função.', minutes: 50, price: 190, image: PHOTO.massage },
      { id: 'recovery-esportivo', name: 'Recovery esportivo', description: 'Sessão de recuperação para quem mantém rotina ativa.', minutes: 45, price: 170, image: PHOTO.recovery },
    ],
    addons: [{ id: 'alongamento', name: 'Orientação de alongamentos', price: 40 }, { id: 'mobilidade-fisio', name: 'Rotina de mobilidade para casa', price: 35 }],
  },
  beatriz: {
    id: 'beatriz', shortName: 'Nutrição', name: 'Beatriz Costa', role: 'Nutrição & hábitos saudáveis',
    intro: 'Pequenos passos, mais saúde.', location: 'Vila Mariana · São Paulo', phone: '', instagram: 'https://www.instagram.com/', cover: PHOTO.nutrition,
    theme: { bg: '#fafbf6', surface: '#ffffff', ink: '#303a29', muted: '#78816c', line: '#e5e9dc', accent: '#74864b', accentInk: '#ffffff' },
    services: [
      { id: 'consulta-inicial', name: 'Consulta nutricional', description: 'Avaliação de rotina, objetivos e hábitos alimentares.', minutes: 60, price: 260, image: PHOTO.nutrition },
      { id: 'retorno', name: 'Consulta de acompanhamento', description: 'Revise sua evolução e ajuste as próximas metas.', minutes: 45, price: 190, image: PHOTO.facial },
      { id: 'online', name: 'Consulta online', description: 'Acompanhamento nutricional por videochamada.', minutes: 45, price: 210, image: PHOTO.spa },
    ],
    addons: [{ id: 'checklist', name: 'Guia de organização alimentar', price: 35 }, { id: 'duvidas', name: 'Acompanhamento de dúvidas por 7 dias', price: 50 }],
  },
};

const PROFILE_IDS: ProfileId[] = ['marina', 'rafael', 'camila', 'lucas', 'beatriz'];
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 19 * 60;
const SLOT_STEP = 30;
const getAvailableTimes = (date: string, duration: number, now = new Date()) => {
  if (!date || date < dateKey(now)) return [];
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime()) || day.getDay() === 0) return [];
  const sameDay = dateKey(now) === date;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const occupiedMinutes = Math.ceil(duration / SLOT_STEP) * SLOT_STEP;
  const result: string[] = [];
  for (let start = OPEN_MINUTES; start + occupiedMinutes <= CLOSE_MINUTES; start += occupiedMinutes) {
    if (sameDay && start < currentMinutes + SLOT_STEP) continue;
    result.push(`${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`);
  }
  return result;
};
const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const clean = (s: string) => s.replace(/[<>\u0000-\u001f]/g, ' ').trim().slice(0, 160);

export default function App() {
  const [profileId, setProfileId] = useState<ProfileId>('marina');
  const profile = PROFILES[profileId];
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [addons, setAddons] = useState<string[]>([]);
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [sentToConfiguredContact, setSentToConfiguredContact] = useState(false);

  const service = profile.services.find((s) => s.id === serviceId);
  const total = (service?.price ?? 0) + profile.addons.filter((a) => addons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }).filter((d) => d.getDay() !== 0), [profileId]);
  const selectedDate = date ? new Date(`${date}T12:00:00`) : null;
  const availableTimes = getAvailableTimes(date, service?.minutes ?? 60);
  const dateLabel = selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : '';
  const themeVars = { '--bg': profile.theme.bg, '--surface': profile.theme.surface, '--ink': profile.theme.ink, '--muted': profile.theme.muted, '--line': profile.theme.line, '--accent': profile.theme.accent, '--accent-ink': profile.theme.accentInk } as CSSProperties;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const changeProfile = (id: ProfileId) => {
    if (id === profileId) return;
    setProfileId(id); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setNote(''); setError(''); setSent(false); setSentToConfiguredContact(false); scrollTop();
  };
  const goToSchedule = () => {
    if (!service) { setError('Escolha um atendimento para continuar.'); return; }
    setError(''); setStep(1); scrollTop();
  };
  const goToDetails = () => {
    if (!date || !time) { setError('Escolha uma data e um horário.'); return; }
    setError(''); setStep(2); scrollTop();
  };
  const sendRequest = () => {
    if (!service) { setStep(0); setError('Escolha um atendimento.'); return; }
    if (!date || !time || !getAvailableTimes(date, service.minutes).includes(time)) {
      setStep(1); setError('Esse horário não está mais disponível para solicitação. Escolha outra data ou horário.'); return;
    }
    if (name.trim().split(/\s+/).filter(Boolean).length < 2) { setError('Informe seu nome e sobrenome.'); return; }
    const extraText = profile.addons.filter((a) => addons.includes(a.id)).map((a) => `• ${a.name}: ${money(a.price)}`).join('\n');
    const message = `Olá, ${profile.name}! Gostaria de solicitar um agendamento.\n\nAtendimento: ${service.name} (${service.minutes} min)\nData: ${dateLabel}\nHorário: ${time}\n${extraText ? `Adicionais:\n${extraText}\n` : ''}Valor estimado: ${money(total)}\nNome: ${clean(name)}${note.trim() ? `\nObservações: ${clean(note)}` : ''}\n\nSei que o horário precisa ser confirmado.`;
    const target = profile.phone.replace(/\D/g, '');
    if (target && (target.length < 10 || target.length > 15)) {
      setError('Não foi possível preparar o contato do profissional. Tente novamente mais tarde.'); return;
    }
    const url = target ? `https://wa.me/${target}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
    const whatsappWindow = window.open(url, '_blank');
    if (!whatsappWindow) {
      window.location.assign(url);
      return;
    }
    whatsappWindow.opener = null;
    setSentToConfiguredContact(Boolean(target)); setSent(true); setError('');
  };

  return <div className="booking-app" style={themeVars}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap');
      .booking-app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Manrope','DM Sans',Arial,sans-serif;transition:background .2s,color .2s;padding-bottom:calc(92px + env(safe-area-inset-bottom))}
      .booking-app *{box-sizing:border-box}.booking-app button,.booking-app input,.booking-app textarea{font:inherit}.booking-app button{cursor:pointer;touch-action:manipulation}.booking-app button:focus-visible,.booking-app input:focus-visible,.booking-app textarea:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
      .booking-wrap{width:min(100% - 32px,680px);margin:0 auto}.booking-top{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:12px;padding:14px 0 12px;border-bottom:1px solid var(--line)}.booking-brand{min-width:0}.booking-brand strong{display:block;font:500 20px/1.1 'Playfair Display',Georgia,serif;white-space:nowrap;letter-spacing:-.02em}.booking-brand span{display:block;color:var(--muted);font-size:10px;margin-top:4px}.booking-switch{display:flex;gap:4px;max-width:100%;overflow-x:auto;border:1px solid var(--line);padding:4px;border-radius:14px;background:var(--surface);scrollbar-width:none}.booking-switch::-webkit-scrollbar{display:none}.booking-switch button{flex:1 0 auto;border:0;border-radius:10px;background:transparent;color:var(--muted);font-size:11px;font-weight:700;padding:10px 12px;white-space:nowrap}.booking-switch button[aria-pressed="true"]{background:var(--accent);color:var(--accent-ink)}
      .booking-hero{padding:22px 0 18px}.booking-hero-image{height:174px;border-radius:17px;overflow:hidden;background:var(--line);position:relative;box-shadow:0 10px 28px rgba(35,28,31,.07)}.booking-hero-image img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block}.booking-hero-image:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.36),transparent 80%)}.booking-hero-copy{position:absolute;z-index:1;left:22px;right:18px;bottom:20px;color:#fff}.booking-kicker{text-transform:uppercase;letter-spacing:.15em;font-size:9px;font-weight:700;opacity:.96}.booking-hero h1{font:400 clamp(31px,8vw,43px)/1.04 'Playfair Display',Georgia,serif;letter-spacing:-.025em;white-space:pre-line;margin:8px 0 0;max-width:340px}.booking-location{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:11px;margin-top:13px}
      .booking-step-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0}.booking-step-head h2{font:400 27px/1.1 'Playfair Display',Georgia,serif;margin:0}.booking-step-head span{font-size:10px;color:var(--muted);white-space:nowrap}.booking-progress{height:3px;display:flex;gap:5px;margin:18px 0 22px}.booking-progress i{height:3px;flex:1;background:var(--line);border-radius:8px}.booking-progress i.on{background:var(--accent)}.booking-section-label{font-size:11px;font-weight:700;margin:20px 0 10px}.booking-services{display:grid;gap:10px}.booking-service{width:100%;display:flex;align-items:center;gap:12px;text-align:left;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:11px;min-height:100px;transition:border-color .16s,background .16s,box-shadow .16s}.booking-service[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent),0 4px 14px rgba(25,30,45,.04)}.booking-service img{width:78px;height:78px;object-fit:cover;border-radius:8px;flex-shrink:0}.booking-service-info{flex:1;min-width:0}.booking-service-info strong{display:block;font-size:13px;line-height:1.3}.booking-service-info small{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-top:4px}.booking-service-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}.booking-service-meta b{font-size:13px}.booking-service-meta span{font-size:10px;color:var(--muted)}.booking-radio{width:20px;height:20px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;flex-shrink:0}.booking-service[aria-pressed="true"] .booking-radio{border-color:var(--accent)}.booking-service[aria-pressed="true"] .booking-radio:after{content:'';width:10px;height:10px;border-radius:50%;background:var(--accent)}
      .booking-card{background:var(--surface);border:1px solid var(--line);border-radius:15px;padding:16px;margin-top:12px;box-shadow:0 4px 18px rgba(25,30,45,.025)}.booking-date-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.booking-date{min-width:0;padding:11px 2px;border:1px solid var(--line);border-radius:11px;background:transparent;color:var(--ink);text-align:center}.booking-date small{display:block;color:var(--muted);font-size:9px;text-transform:capitalize;margin-bottom:7px}.booking-date strong{font-size:15px}.booking-date[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}.booking-date[aria-pressed="true"] small{color:inherit;opacity:.8}.booking-time-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.booking-time{padding:13px 2px;border:1px solid var(--line);border-radius:11px;background:transparent;color:var(--ink);font-size:12px}.booking-time[aria-pressed="true"]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--surface));box-shadow:inset 0 0 0 1px var(--accent)}.booking-addon{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--line);font-size:12px}.booking-addon:last-child{border-bottom:0}.booking-addon input{width:18px;height:18px;accent-color:var(--accent)}.booking-addon span:nth-child(2){flex:1}.booking-addon b{font-size:12px}.booking-field{display:block;margin:14px 0}.booking-field span{display:block;font-size:11px;font-weight:700;margin-bottom:7px}.booking-field input,.booking-field textarea{display:block;width:100%;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--ink);padding:13px 12px;font-size:14px;min-height:46px}.booking-field textarea{min-height:76px;resize:vertical}.booking-field input::placeholder,.booking-field textarea::placeholder{color:var(--muted)}.booking-summary{background:var(--bg);border-radius:10px;padding:14px;margin:14px 0}.booking-summary-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;font-size:12px}.booking-summary-row span{color:var(--muted)}.booking-summary-row strong{text-align:right}.booking-summary-total{border-top:1px solid var(--line);margin-top:5px;padding-top:13px;font-size:15px}.booking-error{color:#c04e4e;font-size:12px;margin:12px 0}.booking-note{font-size:11px;color:var(--muted);line-height:1.55;margin:12px 0}.booking-actions{display:flex;gap:10px;margin-top:20px}.booking-btn{min-height:48px;border-radius:12px;padding:0 17px;border:1px solid var(--line);background:transparent;color:var(--ink);font-weight:700;font-size:13px;display:inline-flex;align-items:center;justify-content:center;gap:8px}.booking-btn.primary{flex:1;background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.booking-btn:disabled{opacity:.45;cursor:not-allowed}.booking-bottom{position:fixed;z-index:20;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(25,30,45,.055)}.booking-bottom-inner{width:min(100%,720px);margin:auto;display:flex;align-items:center;gap:12px}.booking-bottom-price{min-width:82px}.booking-bottom-price small{display:block;font-size:10px;color:var(--muted);margin-bottom:3px}.booking-bottom-price strong{font-size:16px}.booking-bottom .booking-btn{flex:1}.booking-success{text-align:center;padding:36px 8px 22px}.booking-success-mark{width:54px;height:54px;margin:0 auto 18px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-size:24px}.booking-success h2{font:400 30px/1.1 'Playfair Display',Georgia,serif;margin:0 0 10px}.booking-success p{font-size:13px;line-height:1.65;color:var(--muted);max-width:330px;margin:0 auto 20px}.booking-footer{text-align:center;color:var(--muted);font-size:10px;padding:26px 0 10px}
      @media(min-width:640px){.booking-wrap{width:min(100% - 48px,680px)}.booking-hero{padding-top:30px}.booking-hero-image{height:240px}.booking-service img{width:88px;height:88px}.booking-services{gap:12px}.booking-card{padding:20px}.booking-bottom{padding-left:24px;padding-right:24px}}
      @media(max-width:360px){.booking-wrap{width:calc(100% - 24px)}.booking-brand strong{font-size:16px}.booking-switch button{padding:8px 10px;font-size:10px}.booking-hero-image{height:155px}.booking-service{gap:8px;padding:8px}.booking-service img{width:66px;height:72px}.booking-service-info small{font-size:10px}.booking-time-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.booking-bottom-inner{gap:8px}.booking-bottom-price{min-width:68px}}
      @media(prefers-reduced-motion:reduce){.booking-app *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `}</style>

    <header className="booking-wrap booking-top">
      <div className="booking-brand"><strong>{profile.name}</strong><span>{profile.role}</span></div>
      <nav className="booking-switch" role="group" aria-label="Escolher profissional">
        {PROFILE_IDS.map((id) => <button key={id} type="button" aria-pressed={profileId === id} onClick={() => changeProfile(id)}>{PROFILES[id].shortName}</button>)}
      </nav>
    </header>

    <main className="booking-wrap">
      <section className="booking-hero" aria-label={`Apresentação de ${profile.name}`}>
        <div className="booking-hero-image"><img src={profile.cover} alt={`Atendimento de ${profile.role}`} /><div className="booking-hero-copy"><div className="booking-kicker">{profile.role}</div><h1>{profile.intro}</h1></div></div>
        <div className="booking-location">⌖ <span>{profile.location}</span><span>·</span><span>Atendimento com hora marcada</span></div>
      </section>

      {!sent ? <>
        <div className="booking-progress" aria-label={`Etapa ${step + 1} de 3`}>{[0, 1, 2].map((n) => <i key={n} className={n <= step ? 'on' : ''} />)}</div>

        {step === 0 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Escolha seu atendimento</h2><span>1 de 3</span></div>
          <div className="booking-services">{profile.services.map((s) => <button key={`${profileId}-${s.id}`} type="button" className="booking-service" aria-pressed={serviceId === s.id} onClick={() => { if (serviceId !== s.id) { setDate(''); setTime(''); } setServiceId(s.id); setError(''); }}>
            <img src={s.image} alt="" loading="lazy" /><span className="booking-service-info"><strong>{s.name}</strong><small>{s.description}</small><span className="booking-service-meta"><b>{money(s.price)}</b><span>{s.minutes} min</span></span></span><span className="booking-radio" aria-hidden="true" />
          </button>)}</div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Escolha o atendimento ideal e encontre um horário para solicitar sua sessão.</p>
        </section>}

        {step === 1 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Quando fica melhor?</h2><span>2 de 3</span></div>
          {service && <div className="booking-card"><div className="booking-summary-row"><span>Atendimento</span><strong>{service.name}</strong></div><div className="booking-summary-row"><span>Duração</span><strong>{service.minutes} minutos</strong></div></div>}
          <div className="booking-section-label">Escolha o dia</div>
          <div className="booking-date-grid">{dates.map((d) => { const key = dateKey(d); return <button key={key} type="button" className="booking-date" aria-pressed={date === key} onClick={() => { setDate(key); setTime(''); setError(''); }}><small>{dateKey(d) === dateKey(new Date()) ? 'Hoje' : dateKey(d) === dateKey(new Date(Date.now() + 86400000)) ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small><strong>{d.getDate()}</strong></button>; })}</div>
          <div className="booking-section-label">Horários</div>
          <div className="booking-time-grid">{availableTimes.length ? availableTimes.map((t) => <button key={t} type="button" className="booking-time" aria-pressed={time === t} onClick={() => { setTime(t); setError(''); }}>{t}</button>) : <p className="booking-note">Não há horários para esta data. Escolha outro dia.</p>}</div>
          <div className="booking-section-label">Serviços adicionais <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></div>
          <div className="booking-card">{profile.addons.map((a) => <label key={a.id} className="booking-addon"><input type="checkbox" checked={addons.includes(a.id)} onChange={(e) => setAddons((old) => e.target.checked ? [...old, a.id] : old.filter((id) => id !== a.id))} /><span>{a.name}</span><b>+ {money(a.price)}</b></label>)}</div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Atendimentos de segunda a sábado, das 9h às 19h. O horário será confirmado pelo profissional após o envio da solicitação.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(0); setError(''); }}>← Voltar</button></div>
        </section>}

        {step === 2 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Seus dados</h2><span>3 de 3</span></div>
          <div className="booking-card"><div className="booking-summary-row"><span>Atendimento</span><strong>{service?.name}</strong></div><div className="booking-summary-row"><span>Data</span><strong>{dateLabel}</strong></div><div className="booking-summary-row"><span>Horário</span><strong>{time}</strong></div>{profile.addons.filter((a) => addons.includes(a.id)).map((a) => <div key={a.id} className="booking-summary-row"><span>{a.name}</span><strong>{money(a.price)}</strong></div>)}<div className="booking-summary-row booking-summary-total"><span>Total estimado</span><strong>{money(total)}</strong></div></div>
          <label className="booking-field"><span>Nome completo</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Seu nome e sobrenome" maxLength={80} /></label>
          <label className="booking-field"><span>Observação <span style={{ display: 'inline', fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alguma preferência ou informação importante?" maxLength={160} /></label>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Seu pedido será aberto no WhatsApp com os detalhes do atendimento. A reserva fica confirmada depois que o profissional responder.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(1); setError(''); }}>← Voltar</button></div>
        </section>}
      </> : <section className="booking-success" aria-live="polite"><div className="booking-success-mark">✓</div><h2>Pedido preparado</h2><p>{sentToConfiguredContact ? 'Sua solicitação foi preparada na conversa do profissional. Aguarde a confirmação de disponibilidade para considerar o horário reservado.' : 'Sua solicitação está pronta no WhatsApp. Escolha a conversa do profissional para encaminhar os detalhes e aguarde a confirmação do horário.'}</p><button type="button" className="booking-btn primary" onClick={() => { setSent(false); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setNote(''); setError(''); setSentToConfiguredContact(false); scrollTop(); }}>Fazer novo agendamento</button></section>}
      <footer className="booking-footer">Atendimento personalizado · {profile.name}</footer>
    </main>

    {!sent && <div className="booking-bottom"><div className="booking-bottom-inner">
      <div className="booking-bottom-price"><small>{step === 0 ? (service ? 'Selecionado' : 'A partir de') : 'Total estimado'}</small><strong>{step === 0 ? money(service?.price ?? Math.min(...profile.services.map((s) => s.price))) : money(total)}</strong></div>
      {step === 0 ? <button type="button" className="booking-btn primary" disabled={!service} onClick={goToSchedule}>Escolher horário →</button> : step === 1 ? <button type="button" className="booking-btn primary" disabled={!date || !time} onClick={goToDetails}>Continuar →</button> : <button type="button" className="booking-btn primary" onClick={sendRequest}>Enviar pedido ↗</button>}
    </div></div>}
  </div>;
}
