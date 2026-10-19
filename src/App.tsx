import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type ProfileId = 'marina' | 'rafael' | 'camila' | 'lucas' | 'beatriz';
type Service = { id: string; name: string; description: string; minutes: number; originalPrice: number; price: number; image: string };
type Addon = { id: string; name: string; price: number };
type Profile = {
  id: ProfileId; shortName: string; name: string; role: string; intro: string; location: string; phone: string; pixKey: string; instagram: string;
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
    intro: 'Um momento só seu.', location: 'Jardins · São Paulo', phone: '', pixKey: '', instagram: 'https://www.instagram.com/', cover: PHOTO.spa,
    theme: { bg: '#fffdfd', surface: '#ffffff', ink: '#33262b', muted: '#81747b', line: '#eee3e6', accent: '#b66f83', accentInk: '#ffffff' },
    services: [
      { id: 'relaxante', name: 'Massagem relaxante', description: 'Para desacelerar, aliviar tensões e recuperar a sensação de bem-estar.', minutes: 60, originalPrice: 190, price: 160, image: PHOTO.massage },
      { id: 'drenagem', name: 'Drenagem linfática', description: 'Manobras suaves para uma sensação de leveza e cuidado corporal.', minutes: 60, originalPrice: 220, price: 180, image: PHOTO.stones },
      { id: 'pedras', name: 'Massagem com pedras quentes', description: 'Calor reconfortante para uma pausa profunda e relaxante.', minutes: 90, originalPrice: 260, price: 220, image: PHOTO.spa },
    ],
    addons: [{ id: 'esfoliacao', name: 'Esfoliação corporal', price: 50 }, { id: 'escalda', name: 'Escalda-pés com ervas', price: 40 }],
  },
  rafael: {
    id: 'rafael', shortName: 'Personal', name: 'Rafael Mendes', role: 'Personal trainer',
    intro: 'Treino com propósito.', location: 'Itaim Bibi · São Paulo', phone: '', pixKey: '', instagram: 'https://www.instagram.com/', cover: PHOTO.trainer,
    theme: { bg: '#f8fafc', surface: '#ffffff', ink: '#192a43', muted: '#69778b', line: '#e1e7ef', accent: '#29476f', accentInk: '#ffffff' },
    services: [
      { id: 'avaliacao', name: 'Avaliação física', description: 'Conversa inicial, objetivos e avaliação do condicionamento.', minutes: 60, originalPrice: 180, price: 150, image: PHOTO.recovery },
      { id: 'individual', name: 'Treino individual', description: 'Sessão personalizada para seu objetivo e ritmo.', minutes: 60, originalPrice: 220, price: 180, image: PHOTO.training },
      { id: 'dupla', name: 'Treino em dupla', description: 'Treine com acompanhamento e motivação extra.', minutes: 60, originalPrice: 280, price: 240, image: PHOTO.trainer },
    ],
    addons: [{ id: 'mobilidade', name: 'Bloco de mobilidade', price: 30 }, { id: 'plano', name: 'Plano de treino personalizado', price: 60 }],
  },
  camila: {
    id: 'camila', shortName: 'Estética', name: 'Camila Nogueira', role: 'Estética facial',
    intro: 'Sua pele, seu ritual.', location: 'Moema · São Paulo', phone: '', pixKey: '', instagram: 'https://www.instagram.com/', cover: PHOTO.facial,
    theme: { bg: '#fcfaf7', surface: '#ffffff', ink: '#3c3029', muted: '#82766c', line: '#ece4dc', accent: '#a66e50', accentInk: '#ffffff' },
    services: [
      { id: 'limpeza', name: 'Limpeza de pele', description: 'Cuidado completo para uma pele limpa e equilibrada.', minutes: 60, originalPrice: 230, price: 190, image: PHOTO.facial },
      { id: 'hidratacao', name: 'Hidratação facial', description: 'Ritual focado em conforto, maciez e hidratação.', minutes: 45, originalPrice: 180, price: 150, image: PHOTO.spa },
      { id: 'express', name: 'Glow express', description: 'Um cuidado rápido para renovar o viço da pele.', minutes: 30, originalPrice: 140, price: 110, image: PHOTO.stones },
    ],
    addons: [{ id: 'mascara', name: 'Máscara facial especial', price: 35 }, { id: 'massagem-facial', name: 'Massagem facial relaxante', price: 25 }],
  },
  lucas: {
    id: 'lucas', shortName: 'Fisioterapia', name: 'Lucas Ferreira', role: 'Fisioterapia & movimento',
    intro: 'Movimento com confiança.', location: 'Pinheiros · São Paulo', phone: '', pixKey: '', instagram: 'https://www.instagram.com/', cover: PHOTO.physio,
    theme: { bg: '#f7fbfa', surface: '#ffffff', ink: '#203a37', muted: '#6d827e', line: '#deebe7', accent: '#32796f', accentInk: '#ffffff' },
    services: [
      { id: 'avaliacao-fisio', name: 'Avaliação fisioterapêutica', description: 'Entenda suas necessidades e organize os próximos passos.', minutes: 60, originalPrice: 260, price: 220, image: PHOTO.physio },
      { id: 'terapia-manual', name: 'Terapia manual', description: 'Atendimento individual focado em mobilidade e função.', minutes: 50, originalPrice: 230, price: 190, image: PHOTO.massage },
      { id: 'recovery-esportivo', name: 'Recovery esportivo', description: 'Sessão de recuperação para quem mantém rotina ativa.', minutes: 45, originalPrice: 210, price: 170, image: PHOTO.recovery },
    ],
    addons: [{ id: 'alongamento', name: 'Orientação de alongamentos', price: 40 }, { id: 'mobilidade-fisio', name: 'Rotina de mobilidade para casa', price: 35 }],
  },
  beatriz: {
    id: 'beatriz', shortName: 'Nutrição', name: 'Beatriz Costa', role: 'Nutrição & hábitos saudáveis',
    intro: 'Pequenos passos, mais saúde.', location: 'Vila Mariana · São Paulo', phone: '', pixKey: '', instagram: 'https://www.instagram.com/', cover: PHOTO.nutrition,
    theme: { bg: '#fafbf6', surface: '#ffffff', ink: '#303a29', muted: '#78816c', line: '#e5e9dc', accent: '#74864b', accentInk: '#ffffff' },
    services: [
      { id: 'consulta-inicial', name: 'Consulta nutricional', description: 'Avaliação de rotina, objetivos e hábitos alimentares.', minutes: 60, originalPrice: 300, price: 260, image: PHOTO.nutrition },
      { id: 'retorno', name: 'Consulta de acompanhamento', description: 'Revise sua evolução e ajuste as próximas metas.', minutes: 45, originalPrice: 230, price: 190, image: PHOTO.facial },
      { id: 'online', name: 'Consulta online', description: 'Acompanhamento nutricional por videochamada.', minutes: 45, originalPrice: 250, price: 210, image: PHOTO.spa },
    ],
    addons: [{ id: 'checklist', name: 'Guia de organização alimentar', price: 35 }, { id: 'duvidas', name: 'Acompanhamento de dúvidas por 7 dias', price: 50 }],
  },
};

const PROFILE_IDS: ProfileId[] = ['marina', 'rafael', 'camila', 'lucas', 'beatriz'];
const BILLING = { signalAmount: 50, firstSessionDiscount: 20, pixDiscountRate: 0.05 };
const COUPONS: Record<string, { value: number; label: string }> = {
  BEMVINDO15: { value: 15, label: 'R$ 15 de desconto' },
  VIP15: { value: 0.15, label: '15% de desconto' },
};
type AppliedCoupon = { code: string; value: number; label: string };
type PaymentMethod = 'pix' | 'card' | 'cash' | '';
type BusySlot = { s: number; e: number };

type ImportMetaWithEnv = ImportMeta & { env?: Record<string, string | undefined> };
const ENV = (import.meta as ImportMetaWithEnv).env ?? {};
const SUPABASE_URL = (ENV.VITE_SUPABASE_URL ?? '').replace(/\/$/, '');
const SUPABASE_KEY = ENV.VITE_SUPABASE_PUBLISHABLE_KEY || ENV.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_KEY);

async function callSupabaseRpc<T>(functionName: string, args: Record<string, unknown>): Promise<T> {
  if (!SUPABASE_CONFIGURED) throw new Error('Supabase ainda não está configurado.');
  const headers: Record<string, string> = {
    apikey: SUPABASE_KEY,
    'Content-Type': 'application/json',
  };
  if (SUPABASE_KEY.startsWith('eyJ')) headers.Authorization = `Bearer ${SUPABASE_KEY}`;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(args),
  });
  const raw = await response.text();
  let payload: unknown = null;
  try { payload = raw ? JSON.parse(raw) : null; } catch { payload = raw; }
  if (!response.ok) {
    const detail = typeof payload === 'object' && payload && 'message' in payload
      ? String((payload as { message: unknown }).message)
      : `Erro HTTP ${response.status}`;
    throw new Error(detail);
  }
  return payload as T;
}

function getBookingClientKey(): string {
  const storageKey = 'booking_demo_client_key';
  try {
    let value = window.localStorage.getItem(storageKey);
    if (!value) {
      value = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(storageKey, value);
    }
    return value;
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}
const calculateInvoice = ({
  servicePrice,
  addonsTotal,
  isReturning,
  appliedCoupon,
  payment,
}: {
  servicePrice: number;
  addonsTotal: number;
  isReturning: boolean;
  appliedCoupon: AppliedCoupon | null;
  payment: PaymentMethod;
}) => {
  const subtotal = servicePrice + addonsTotal;
  const couponDiscount = appliedCoupon
    ? Math.min(subtotal, appliedCoupon.value < 1 ? Math.floor(subtotal * appliedCoupon.value) : appliedCoupon.value)
    : 0;
  const welcomeDiscount = !isReturning && !appliedCoupon ? Math.min(subtotal, BILLING.firstSessionDiscount) : 0;
  const discount = appliedCoupon ? couponDiscount : welcomeDiscount;
  const afterDiscount = Math.max(0, subtotal - discount);
  const pixDiscount = payment === 'pix' ? Math.min(afterDiscount, Math.ceil(afterDiscount * BILLING.pixDiscountRate)) : 0;
  const total = Math.max(0, afterDiscount - pixDiscount);
  const signal = Math.min(BILLING.signalAmount, total);
  const rest = Math.max(0, total - signal);
  return { subtotal, couponDiscount, welcomeDiscount, discount, afterDiscount, pixDiscount, total, signal, rest };
};
const OPEN_MINUTES = 9 * 60;
const CLOSE_MINUTES = 19 * 60;
const SLOT_STEP = 30;
const getAvailableTimes = (date: string, duration: number, busy: BusySlot[] = [], now = new Date()) => {
  if (!date || date < dateKey(now)) return [];
  const day = new Date(`${date}T12:00:00`);
  if (Number.isNaN(day.getTime()) || day.getDay() === 0) return [];
  const sameDay = dateKey(now) === date;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const result: string[] = [];
  for (let start = OPEN_MINUTES; start + duration <= CLOSE_MINUTES; start += SLOT_STEP) {
    if (sameDay && start < currentMinutes + SLOT_STEP) continue;
    const end = start + duration;
    if (busy.some((slot) => slot.s < end && slot.e > start)) continue;
    result.push(`${String(Math.floor(start / 60)).padStart(2, '0')}:${String(start % 60).padStart(2, '0')}`);
  }
  return result;
};
const money = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const clean = (s: string) => s.replace(/[\u0000-\u001f\u007f<>]/g, ' ').replace(/[*_~`]+/g, '').replace(/https?:\/\/\S+/gi, '[link removido]').replace(/\s+/g, ' ').trim().slice(0, 160);

const buildWhatsAppMessage = ({
  profileName,
  service,
  dateLabel,
  time,
  name,
  note,
  selectedAddons,
  total,
  signal,
  rest,
  bookingCode,
}: {
  profileName: string;
  service: Service;
  dateLabel: string;
  time: string;
  name: string;
  note: string;
  selectedAddons: Addon[];
  total: number;
  signal: number;
  rest: number;
  bookingCode: string;
}) => {
  const addonsText = selectedAddons.length
    ? `\nAdicionais: ${selectedAddons.map((addon) => clean(addon.name)).join(', ')}`
    : '';

  return `Olá, ${clean(profileName)}! Gostaria de solicitar um agendamento.\nReferência: ${clean(bookingCode)}\n\n*CLIENTE*\nNome: ${clean(name)}${note.trim() ? `\nObservações: ${clean(note)}` : ''}\n\n*AGENDAMENTO*\nAtendimento: ${clean(service.name)} (${service.minutes} min)\nData: ${dateLabel}\nHorário: ${time}${addonsText}\n\n*RESUMO DOS VALORES*\n*Valor total: ${money(total)}*\n*Sinal para reserva via Pix: ${money(signal)}*\n*Saldo restante: ${money(rest)}*\n\nEste pedido ainda depende da confirmação do profissional e da conferência do sinal. O sinal faz parte do valor total.`;
};

export default function App() {
  const [profileId, setProfileId] = useState<ProfileId>('marina');
  const [showProfileControls, setShowProfileControls] = useState(false);
  const brandTapRef = useRef({ count: 0, startedAt: 0 });
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
  const [isReturning, setIsReturning] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState('');
  const [billingNotice, setBillingNotice] = useState('');
  const [busySlots, setBusySlots] = useState<BusySlot[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');
  const [availabilityRefresh, setAvailabilityRefresh] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      setIsReturning(window.localStorage.getItem(`booking_${profileId}_returning`) === 'yes');
    } catch {
      setIsReturning(false);
    }
  }, [profileId]);

  useEffect(() => {
    let active = true;
    let interval: ReturnType<typeof setInterval> | undefined;

    if (!date) {
      setBusySlots([]);
      setAvailabilityLoading(false);
      setAvailabilityError('');
      return () => { active = false; };
    }
    if (!SUPABASE_CONFIGURED) {
      setBusySlots([]);
      setAvailabilityLoading(false);
      setAvailabilityError('Configure o Supabase no arquivo .env.local para consultar e reservar horários de verdade.');
      return () => { active = false; };
    }

    const loadBusySlots = async () => {
      if (active) setAvailabilityLoading(true);
      try {
        const result = await callSupabaseRpc<BusySlot[]>('get_busy', {
          p_profile_id: profileId,
          p_date: date,
        });
        if (!Array.isArray(result)) throw new Error('Resposta inesperada da agenda.');
        if (active) {
          setBusySlots(result
            .map((item) => ({ s: Number(item?.s), e: Number(item?.e) }))
            .filter((slot) => Number.isFinite(slot.s) && Number.isFinite(slot.e) && slot.s >= 0 && slot.e > slot.s && slot.e <= 1440));
          setAvailabilityError('');
        }
      } catch (err) {
        if (active) {
          setBusySlots([]);
          console.error('Falha ao consultar agenda:', err);
          setAvailabilityError('Não foi possível consultar a agenda com segurança. Tente novamente.');
        }
      } finally {
        if (active) setAvailabilityLoading(false);
      }
    };

    void loadBusySlots();
    interval = setInterval(() => { void loadBusySlots(); }, 20000);
    return () => {
      active = false;
      if (interval) clearInterval(interval);
    };
  }, [date, profileId, availabilityRefresh]);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        setShowProfileControls((visible) => !visible);
      }
      if (event.key === 'Escape') setShowProfileControls(false);
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  const handleBrandTap = () => {
    const now = Date.now();
    if (now - brandTapRef.current.startedAt > 1800) {
      brandTapRef.current = { count: 1, startedAt: now };
      return;
    }
    brandTapRef.current.count += 1;
    if (brandTapRef.current.count >= 5) {
      setShowProfileControls(true);
      brandTapRef.current = { count: 0, startedAt: 0 };
    }
  };

  const service = profile.services.find((s) => s.id === serviceId);
  const selectedAddons = profile.addons.filter((a) => addons.includes(a.id));
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const invoice = calculateInvoice({ servicePrice: service?.price ?? 0, addonsTotal, isReturning, appliedCoupon, payment });
  const { subtotal, discount, pixDiscount, total, signal, rest } = invoice;
  const serviceSavings = service ? Math.max(0, service.originalPrice - service.price) : 0;
  const dates = useMemo(() => Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); return d; }).filter((d) => d.getDay() !== 0), [profileId]);
  const selectedDate = date ? new Date(`${date}T12:00:00`) : null;
  const availableTimes = SUPABASE_CONFIGURED && !availabilityLoading && !availabilityError
    ? getAvailableTimes(date, service?.minutes ?? 60, busySlots)
    : [];
  const dateLabel = selectedDate ? selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : '';

  useEffect(() => {
    if (time && date && !availabilityLoading && !availabilityError && !availableTimes.includes(time)) {
      setTime('');
    }
  }, [time, date, availabilityLoading, availabilityError, busySlots, service?.minutes]);
  const themeVars = { '--bg': profile.theme.bg, '--surface': profile.theme.surface, '--ink': profile.theme.ink, '--muted': profile.theme.muted, '--line': profile.theme.line, '--accent': profile.theme.accent, '--accent-ink': profile.theme.accentInk } as CSSProperties;

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const changeProfile = (id: ProfileId) => {
    setShowProfileControls(false);
    if (id === profileId) return;
    setProfileId(id); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setNote(''); setError(''); setSent(false); setSentToConfiguredContact(false); setIsReturning(false); setPayment(''); setCouponInput(''); setAppliedCoupon(null); setCouponError(''); setBillingNotice(''); setBusySlots([]); setAvailabilityError(''); setAvailabilityLoading(false); setSubmitting(false); scrollTop();
  };
  const goToSchedule = () => {
    if (!service) { setError('Escolha um atendimento para continuar.'); return; }
    setError(''); setStep(1); scrollTop();
  };
  const goToDetails = () => {
    if (!date || !time || !availableTimes.includes(time)) { setError('Escolha um horário disponível na agenda.'); return; }
    setError(''); setStep(2); scrollTop();
  };
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase().replace(/\s+/g, '').slice(0, 30);
    const found = COUPONS[code];
    if (!code || !found) {
      setCouponError('Cupom inválido ou expirado.');
      setAppliedCoupon(null);
      return;
    }
    setAppliedCoupon({ code, value: found.value, label: found.label });
    setCouponInput(code);
    setCouponError('');
    setBillingNotice('Cupom aplicado ao resumo.');
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
    setBillingNotice('');
  };

  const copyPixKey = async () => {
    const key = profile.pixKey.trim();
    if (!key) {
      setBillingNotice('A chave Pix deste profissional ainda precisa ser configurada.');
      return;
    }
    try {
      await navigator.clipboard.writeText(key);
      setBillingNotice('Chave Pix copiada.');
    } catch {
      setBillingNotice(`Não foi possível copiar automaticamente. Selecione e copie a chave Pix: ${key}`);
    }
  };

  const sendRequest = async () => {
    if (!service) { setStep(0); setError('Escolha um atendimento.'); return; }
    if (!SUPABASE_CONFIGURED) {
      setError('A agenda ainda não está conectada. Siga o guia de integração e preencha as variáveis do Supabase.');
      return;
    }
    if (availabilityLoading) { setError('Estamos verificando os horários. Tente novamente em instantes.'); return; }
    if (availabilityError) { setError('Não foi possível consultar a agenda. Corrija a conexão antes de enviar o pedido.'); return; }
    if (!date || !time || !getAvailableTimes(date, service.minutes, busySlots).includes(time)) {
      setStep(1); setError('Esse horário não está mais disponível. Escolha outro horário.'); setAvailabilityRefresh((n) => n + 1); return;
    }
    if (name.trim().split(/\s+/).filter(Boolean).length < 2) { setError('Informe seu nome e sobrenome.'); return; }
    if (!payment) { setError('Escolha como pretende pagar o saldo restante.'); return; }

    const target = profile.phone.replace(/\D/g, '');
    if (target && (target.length < 10 || target.length > 15)) {
      setError('O telefone do profissional está incorreto na configuração do perfil.'); return;
    }

    setSubmitting(true);
    setError('');
    const whatsappWindow = window.open('about:blank', '_blank');
    try {
      const result = await callSupabaseRpc<{
        ok: boolean; error?: string; booking_id?: string; booking_code?: string; expires_at?: string;
      }>('book_slot', {
        p_profile_id: profileId,
        p_date: date,
        p_start_minute: Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5)),
        p_service_id: service.id,
        p_customer_name: clean(name),
        p_client_key: getBookingClientKey(),
        p_total: total,
        p_signal: signal,
        p_remaining: rest,
      });

      if (!result?.ok) {
        whatsappWindow?.close();
        const message = result?.error === 'taken'
          ? 'Outra pessoa acabou de reservar esse horário. Escolha outro.'
          : result?.error === 'pending_limit'
            ? 'Você já tem solicitações pendentes. Aguarde a confirmação anterior ou tente mais tarde.'
            : result?.error === 'invalid_service'
              ? 'Esse serviço não está configurado na agenda. Confira o SQL e os IDs dos serviços.'
              : result?.error === 'invalid_date'
                ? 'Essa data não está dentro do período de agendamento ou não aceita reservas.'
                : result?.error === 'invalid_name'
                  ? 'Informe o nome completo antes de continuar.'
                  : result?.error === 'outside_hours'
                    ? 'Esse horário fica fora do funcionamento configurado.'
                : result?.error === 'past'
                  ? 'Esse horário já passou. Escolha outro.'
                  : 'A agenda recusou a solicitação. Atualize os horários e tente novamente.';
        setError(message);
        setStep(1);
        setTime('');
        setAvailabilityRefresh((n) => n + 1);
        return;
      }

      const bookingCode = result.booking_code || result.booking_id?.slice(0, 8).toUpperCase() || 'AGENDAMENTO';
      const message = buildWhatsAppMessage({
        profileName: profile.name,
        service,
        dateLabel,
        time,
        name,
        note,
        selectedAddons,
        total,
        signal,
        rest,
        bookingCode,
      });
      const url = target ? `https://wa.me/${target}?text=${encodeURIComponent(message)}` : `https://wa.me/?text=${encodeURIComponent(message)}`;
      try { window.localStorage.setItem(`booking_${profileId}_returning`, 'yes'); } catch { }
      if (whatsappWindow) {
        whatsappWindow.opener = null;
        whatsappWindow.location.href = url;
      } else {
        window.location.assign(url);
        return;
      }
      setIsReturning(true);
      setSentToConfiguredContact(Boolean(target));
      setSent(true);
      setError('');
    } catch (err) {
      whatsappWindow?.close();
      // Não exiba mensagens internas do banco/API ao cliente.
      console.error('Falha ao criar reserva:', err);
      setError('Não foi possível concluir a reserva agora. Confira sua conexão e tente novamente.');
      setAvailabilityRefresh((n) => n + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return <div className="booking-app" style={themeVars}>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap');
      .booking-app{min-height:100vh;background:var(--bg);color:var(--ink);font-family:'Manrope','DM Sans',Arial,sans-serif;transition:background .2s,color .2s;padding-bottom:calc(92px + env(safe-area-inset-bottom))}
      .booking-app *{box-sizing:border-box}.booking-app button,.booking-app input,.booking-app textarea{font:inherit}.booking-app button{cursor:pointer;touch-action:manipulation}.booking-app button:focus-visible,.booking-app input:focus-visible,.booking-app textarea:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
      .booking-wrap{width:min(100% - 32px,680px);margin:0 auto}.booking-top{display:flex;align-items:center;justify-content:center;padding:18px 0 14px;border-bottom:1px solid var(--line)}.booking-brand{min-width:0;text-align:center}.booking-brand strong{display:block;font:500 20px/1.1 'Playfair Display',Georgia,serif;white-space:nowrap;letter-spacing:-.02em}.booking-brand span{display:block;color:var(--muted);font-size:10px;margin-top:4px}.booking-brand-trigger{display:block;border:0;background:transparent;color:inherit;padding:0;text-align:center;cursor:pointer}.booking-studio-panel{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483647;width:min(720px,calc(100% - 20px));padding:12px;border:1px solid #d8dce4;border-radius:16px;background:rgba(255,255,255,.97);color:#172033;box-shadow:0 14px 48px rgba(10,20,40,.25);backdrop-filter:blur(16px);font-family:Manrope,Arial,sans-serif}.booking-studio-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px}.booking-studio-head strong{display:block;font-size:12px;letter-spacing:.02em}.booking-studio-head small{display:block;font-size:10px;color:#667085;margin-top:3px}.booking-studio-close{width:34px;height:34px;border:1px solid #e1e5ec;border-radius:10px;background:#fff;color:#344054;font-size:20px;line-height:1}.booking-studio-buttons{display:flex;gap:7px;overflow-x:auto;padding-bottom:1px;scrollbar-width:none}.booking-studio-buttons::-webkit-scrollbar{display:none}.booking-studio-buttons button{flex:1 0 auto;min-height:42px;border:1px solid #e1e5ec;border-radius:10px;padding:8px 12px;background:#f8fafc;color:#344054;font-size:11px;font-weight:700;white-space:nowrap}.booking-studio-buttons button[aria-pressed="true"]{background:#172b4d;border-color:#172b4d;color:#fff}.booking-studio-tip{font-size:10px;line-height:1.4;color:#667085;margin:9px 1px 0}
      .booking-hero{padding:22px 0 18px}.booking-hero-image{height:174px;border-radius:17px;overflow:hidden;background:var(--line);position:relative;box-shadow:0 10px 28px rgba(35,28,31,.07)}.booking-hero-image img{width:100%;height:100%;object-fit:cover;object-position:center 55%;display:block}.booking-hero-image:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.36),transparent 80%)}.booking-hero-copy{position:absolute;z-index:1;left:22px;right:18px;bottom:20px;color:#fff}.booking-kicker{text-transform:uppercase;letter-spacing:.15em;font-size:9px;font-weight:700;opacity:.96}.booking-hero h1{font:400 clamp(31px,8vw,43px)/1.04 'Playfair Display',Georgia,serif;letter-spacing:-.025em;white-space:pre-line;margin:8px 0 0;max-width:340px}.booking-location{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:11px;margin-top:13px}
      .booking-step-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:16px 0}.booking-step-head h2{font:400 27px/1.1 'Playfair Display',Georgia,serif;margin:0}.booking-step-head span{font-size:10px;color:var(--muted);white-space:nowrap}.booking-progress{height:3px;display:flex;gap:5px;margin:18px 0 22px}.booking-progress i{height:3px;flex:1;background:var(--line);border-radius:8px}.booking-progress i.on{background:var(--accent)}.booking-section-label{font-size:11px;font-weight:700;margin:20px 0 10px}.booking-services{display:grid;gap:10px}.booking-service{width:100%;display:flex;align-items:center;gap:12px;text-align:left;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:14px;padding:11px;min-height:100px;transition:border-color .16s,background .16s,box-shadow .16s}.booking-service[aria-pressed="true"]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent),0 4px 14px rgba(25,30,45,.04)}.booking-service img{width:78px;height:78px;object-fit:cover;border-radius:8px;flex-shrink:0}.booking-service-info{flex:1;min-width:0}.booking-service-info strong{display:block;font-size:13px;line-height:1.3}.booking-service-info small{display:block;color:var(--muted);font-size:11px;line-height:1.45;margin-top:4px}.booking-service-meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px}.booking-service-meta b{font-size:13px}.booking-service-meta span{font-size:10px;color:var(--muted)}.booking-price-old{color:var(--muted);text-decoration:line-through;font-size:10px;font-weight:500}.booking-discount-pill{background:color-mix(in srgb,var(--accent) 12%,var(--surface));color:var(--accent)!important;font-weight:800;font-size:9px!important;border-radius:999px;padding:4px 6px}.booking-promo-note{display:flex;flex-direction:column;gap:4px;padding:13px 14px;margin:-4px 0 14px;border-radius:12px;background:color-mix(in srgb,var(--accent) 8%,var(--surface));border:1px solid color-mix(in srgb,var(--accent) 20%,var(--line));font-size:11px;line-height:1.5}.booking-promo-note strong{font-size:12px}.booking-returning{display:flex;align-items:flex-start;gap:10px;font-size:12px;line-height:1.5;margin:12px 0;padding:12px;border:1px solid var(--line);border-radius:11px;background:var(--surface)}.booking-returning input{width:17px;height:17px;accent-color:var(--accent);margin-top:1px;flex-shrink:0}.booking-coupon-box{background:var(--surface);border:1px solid var(--line);border-radius:13px;padding:14px;margin-top:10px}.booking-coupon-label{display:block;font-size:12px;font-weight:700;margin-bottom:9px}.booking-coupon-row{display:flex;gap:8px}.booking-coupon-row input{min-width:0;flex:1;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--ink);padding:11px;font-size:13px}.booking-coupon-applied{display:flex;align-items:center;justify-content:space-between;gap:10px}.booking-coupon-applied span{display:flex;flex-direction:column;gap:3px}.booking-coupon-applied small{color:var(--muted);font-size:11px}.booking-payment-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.booking-payment-choice{border:1px solid var(--line);border-radius:11px;background:var(--surface);padding:12px 7px;min-height:70px;text-align:center;color:var(--ink)}.booking-payment-choice strong,.booking-payment-choice span{display:block}.booking-payment-choice strong{font-size:12px}.booking-payment-choice span{font-size:9px;color:var(--muted);margin-top:5px;line-height:1.35}.booking-payment-choice[aria-pressed=true]{border-color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--surface))}.booking-saving-row,.booking-saving-row strong{color:#16805d!important}.booking-deposit-block{border-top:1px solid var(--line);margin-top:12px;padding-top:13px;display:grid;gap:10px}.booking-deposit-block>div{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px}.booking-deposit-block>div span{color:var(--muted)}.booking-deposit-block>div strong{font-size:15px}.booking-deposit-block>div:first-child strong{color:var(--accent)}.booking-deposit-block small{color:var(--muted);font-size:10px;line-height:1.4}.booking-pix-panel{margin-top:14px;padding:15px;border-radius:13px;border:1px solid var(--line);background:var(--bg);display:grid;gap:10px}.booking-pix-panel>div:first-child{display:flex;flex-direction:column;gap:5px}.booking-pix-panel>div:first-child strong{font-size:13px}.booking-pix-panel>div:first-child span{font-size:11px;color:var(--muted);line-height:1.5}.booking-pix-key{border:1px dashed var(--line);background:var(--surface);border-radius:9px;padding:11px;word-break:break-all;font-size:12px}.booking-billing-notice{font-size:11px;color:var(--accent);line-height:1.45}.booking-radio{width:20px;height:20px;border:1px solid var(--line);border-radius:50%;display:grid;place-items:center;flex-shrink:0}.booking-service[aria-pressed="true"] .booking-radio{border-color:var(--accent)}.booking-service[aria-pressed="true"] .booking-radio:after{content:'';width:10px;height:10px;border-radius:50%;background:var(--accent)}
      .booking-card{background:var(--surface);border:1px solid var(--line);border-radius:15px;padding:16px;margin-top:12px;box-shadow:0 4px 18px rgba(25,30,45,.025)}.booking-date-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:7px}.booking-date{min-width:0;padding:11px 2px;border:1px solid var(--line);border-radius:11px;background:transparent;color:var(--ink);text-align:center}.booking-date small{display:block;color:var(--muted);font-size:9px;text-transform:capitalize;margin-bottom:7px}.booking-date strong{font-size:15px}.booking-date[aria-pressed="true"]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}.booking-date[aria-pressed="true"] small{color:inherit;opacity:.8}.booking-time-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.booking-time{padding:13px 2px;border:1px solid var(--line);border-radius:11px;background:transparent;color:var(--ink);font-size:12px}.booking-time[aria-pressed="true"]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 14%,var(--surface));box-shadow:inset 0 0 0 1px var(--accent)}.booking-addon{display:flex;align-items:center;gap:10px;padding:13px 0;border-bottom:1px solid var(--line);font-size:12px}.booking-addon:last-child{border-bottom:0}.booking-addon input{width:18px;height:18px;accent-color:var(--accent)}.booking-addon span:nth-child(2){flex:1}.booking-addon b{font-size:12px}.booking-field{display:block;margin:14px 0}.booking-field span{display:block;font-size:11px;font-weight:700;margin-bottom:7px}.booking-field input,.booking-field textarea{display:block;width:100%;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--ink);padding:13px 12px;font-size:14px;min-height:46px}.booking-field textarea{min-height:76px;resize:vertical}.booking-field input::placeholder,.booking-field textarea::placeholder{color:var(--muted)}.booking-summary{background:var(--bg);border-radius:10px;padding:14px;margin:14px 0}.booking-summary-row{display:flex;justify-content:space-between;gap:12px;padding:7px 0;font-size:12px}.booking-summary-row span{color:var(--muted)}.booking-summary-row strong{text-align:right}.booking-summary-total{border-top:1px solid var(--line);margin-top:5px;padding-top:13px;font-size:15px}.booking-error{color:#c04e4e;font-size:12px;margin:12px 0}.booking-note{font-size:11px;color:var(--muted);line-height:1.55;margin:12px 0}.booking-actions{display:flex;gap:10px;margin-top:20px}.booking-btn{min-height:48px;border-radius:12px;padding:0 17px;border:1px solid var(--line);background:transparent;color:var(--ink);font-weight:700;font-size:13px;display:inline-flex;align-items:center;justify-content:center;gap:8px}.booking-btn.primary{flex:1;background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}.booking-btn:disabled{opacity:.45;cursor:not-allowed}.booking-bottom{position:fixed;z-index:20;bottom:0;left:0;right:0;background:var(--surface);border-top:1px solid var(--line);padding:10px 16px calc(10px + env(safe-area-inset-bottom));box-shadow:0 -6px 24px rgba(25,30,45,.055)}.booking-bottom-inner{width:min(100%,720px);margin:auto;display:flex;align-items:center;gap:12px}.booking-bottom-price{min-width:82px}.booking-bottom-price small{display:block;font-size:10px;color:var(--muted);margin-bottom:3px}.booking-bottom-price strong{font-size:16px}.booking-bottom .booking-btn{flex:1}.booking-success{text-align:center;padding:36px 8px 22px}.booking-success-mark{width:54px;height:54px;margin:0 auto 18px;border-radius:50%;background:var(--accent);color:var(--accent-ink);display:grid;place-items:center;font-size:24px}.booking-success h2{font:400 30px/1.1 'Playfair Display',Georgia,serif;margin:0 0 10px}.booking-success p{font-size:13px;line-height:1.65;color:var(--muted);max-width:330px;margin:0 auto 20px}.booking-footer{text-align:center;color:var(--muted);font-size:10px;padding:26px 0 10px}
      @media(min-width:640px){.booking-wrap{width:min(100% - 48px,680px)}.booking-hero{padding-top:30px}.booking-hero-image{height:240px}.booking-service img{width:88px;height:88px}.booking-services{gap:12px}.booking-card{padding:20px}.booking-bottom{padding-left:24px;padding-right:24px}}
      @media(max-width:360px){.booking-payment-choices{gap:5px}.booking-payment-choice{padding:10px 4px}.booking-payment-choice span{font-size:8px}.booking-coupon-row{flex-direction:column}.booking-wrap{width:calc(100% - 24px)}.booking-brand strong{font-size:16px}.booking-studio-panel{padding:9px}.booking-studio-buttons button{padding:8px 10px;font-size:10px}.booking-hero-image{height:155px}.booking-service{gap:8px;padding:8px}.booking-service img{width:66px;height:72px}.booking-service-info small{font-size:10px}.booking-time-grid{grid-template-columns:repeat(3,minmax(0,1fr))}.booking-bottom-inner{gap:8px}.booking-bottom-price{min-width:68px}}
      @media(prefers-reduced-motion:reduce){.booking-app *{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
    `}</style>

    {showProfileControls && <aside className="booking-studio-panel" role="dialog" aria-label="Controles privados de demonstração">
      <div className="booking-studio-head">
        <span><strong>CONTROLE DE GRAVAÇÃO</strong><small>Escolha um perfil; os controles se ocultam automaticamente.</small></span>
        <button type="button" className="booking-studio-close" aria-label="Ocultar controles" onClick={() => setShowProfileControls(false)}>×</button>
      </div>
      <nav className="booking-studio-buttons" role="group" aria-label="Trocar perfil da demonstração">
        {PROFILE_IDS.map((id) => <button key={id} type="button" aria-pressed={profileId === id} onClick={() => changeProfile(id)}>{PROFILES[id].shortName}</button>)}
      </nav>
      <p className="booking-studio-tip">Atalho: Alt + Shift + P · toque 5 vezes no nome no topo para abrir no celular. Esc oculta os controles.</p>
    </aside>}

    <header className="booking-wrap booking-top">
      <button type="button" className="booking-brand booking-brand-trigger" onClick={handleBrandTap} aria-label="Marca do profissional">
        <strong>{profile.name}</strong><span>{profile.role}</span>
      </button>
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
          <div className="booking-promo-note"><strong>Condição especial de boas-vindas</strong><span>R$ 20 de desconto na primeira sessão e mais 5% pagando o saldo por Pix.</span></div>
          <div className="booking-services">{profile.services.map((s) => <button key={`${profileId}-${s.id}`} type="button" className="booking-service" aria-pressed={serviceId === s.id} onClick={() => { if (serviceId !== s.id) { setDate(''); setTime(''); } setServiceId(s.id); setError(''); }}>
            <img src={s.image} alt="" loading="lazy" /><span className="booking-service-info"><strong>{s.name}</strong><small>{s.description}</small><span className="booking-service-meta"><span className="booking-price-old">{money(s.originalPrice)}</span><b>{money(s.price)}</b><span className="booking-discount-pill">-{Math.round((1 - s.price / s.originalPrice) * 100)}%</span><span>{s.minutes} min</span></span></span><span className="booking-radio" aria-hidden="true" />
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
          {!SUPABASE_CONFIGURED ? <p className="booking-note" role="status">Para exibir horários reais, conecte o Supabase seguindo o guia incluído no pacote.</p>
            : availabilityLoading ? <p className="booking-note" role="status">Consultando a agenda compartilhada…</p>
            : availabilityError ? <p className="booking-error" role="alert">{availabilityError}</p>
            : <div className="booking-time-grid">{availableTimes.length ? availableTimes.map((t) => <button key={t} type="button" className="booking-time" aria-pressed={time === t} onClick={() => { setTime(t); setError(''); }}>{t}</button>) : <p className="booking-note">Não há horários disponíveis para esta data. Escolha outro dia.</p>}</div>}
          <div className="booking-section-label">Serviços adicionais <span style={{ fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></div>
          <div className="booking-card">{profile.addons.map((a) => <label key={a.id} className="booking-addon"><input type="checkbox" checked={addons.includes(a.id)} onChange={(e) => setAddons((old) => e.target.checked ? [...old, a.id] : old.filter((id) => id !== a.id))} /><span>{a.name}</span><b>+ {money(a.price)}</b></label>)}</div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Atendimentos de segunda a sábado, das 9h às 19h. A disponibilidade é consultada na agenda; o horário só fica confirmado após o retorno do profissional e a validação do sinal.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(0); setError(''); }}>← Voltar</button></div>
        </section>}

        {step === 2 && <section aria-labelledby="booking-title">
          <div className="booking-step-head"><h2 id="booking-title">Seus dados</h2><span>3 de 3</span></div>
          <div className="booking-card">
            <div className="booking-summary-row"><span>Atendimento</span><strong>{service?.name}</strong></div>
            <div className="booking-summary-row"><span>Data</span><strong>{dateLabel}</strong></div>
            <div className="booking-summary-row"><span>Horário</span><strong>{time} · {service?.minutes} min</strong></div>
          </div>
          <label className="booking-field"><span>Nome completo</span><input value={name} onChange={(e) => { setName(e.target.value); setError(''); }} autoComplete="name" placeholder="Seu nome e sobrenome" maxLength={80} /></label>
          <label className="booking-field"><span>Observação <span style={{ display: 'inline', fontWeight: 400, color: 'var(--muted)' }}>· opcional</span></span><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Alguma preferência ou informação importante?" maxLength={160} /></label>

          <div className="booking-section-label">Condições e descontos</div>
          <label className="booking-returning"><input type="checkbox" checked={isReturning} onChange={(e) => { const returning = e.target.checked; setIsReturning(returning); setBillingNotice(''); try { if (returning) window.localStorage.setItem(`booking_${profileId}_returning`, 'yes'); else window.localStorage.removeItem(`booking_${profileId}_returning`); } catch { } }} /><span>Já sou cliente deste profissional (não aplicar desconto de primeira sessão)</span></label>
          {!isReturning && !appliedCoupon && <p className="booking-note">Desconto de boas-vindas de {money(BILLING.firstSessionDiscount)} aplicado automaticamente.</p>}
          <div className="booking-coupon-box">
            {!appliedCoupon ? <>
              <label className="booking-coupon-label" htmlFor="booking-coupon">Tem um cupom de desconto?</label>
              <div className="booking-coupon-row"><input id="booking-coupon" value={couponInput} onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); applyCoupon(); } }} placeholder="Digite o código" maxLength={30} autoCapitalize="characters" /><button type="button" className="booking-btn" onClick={applyCoupon}>Aplicar</button></div>
              {couponError && <p className="booking-error" role="alert">{couponError}</p>}
              <p className="booking-note">Um cupom substitui o desconto de boas-vindas; os descontos do atendimento e do Pix continuam no cálculo.</p>
            </> : <div className="booking-coupon-applied"><span><strong>Cupom {appliedCoupon.code}</strong><small>{appliedCoupon.label}</small></span><button type="button" className="booking-btn" onClick={removeCoupon}>Remover</button></div>}
          </div>

          <div className="booking-section-label">Como pretende pagar o saldo?</div>
          <div className="booking-payment-choices" role="group" aria-label="Forma de pagamento do saldo">
            <button type="button" className="booking-payment-choice" aria-pressed={payment === 'pix'} onClick={() => { setPayment('pix'); setBillingNotice(''); setError(''); }}><strong>Pix</strong><span>5% de desconto</span></button>
            <button type="button" className="booking-payment-choice" aria-pressed={payment === 'card'} onClick={() => { setPayment('card'); setBillingNotice(''); setError(''); }}><strong>Cartão</strong><span>Taxas a combinar</span></button>
            <button type="button" className="booking-payment-choice" aria-pressed={payment === 'cash'} onClick={() => { setPayment('cash'); setBillingNotice(''); setError(''); }}><strong>Dinheiro</strong><span>Pagamento no dia</span></button>
          </div>

          <div className="booking-section-label">Resumo dos valores</div>
          <div className="booking-card booking-invoice">
            <div className="booking-summary-row"><span>Preço de tabela</span><strong className="booking-price-old">{money(service?.originalPrice ?? 0)}</strong></div>
            <div className="booking-summary-row"><span>Preço promocional aplicado</span><strong>{money(service?.price ?? 0)}</strong></div>
            {serviceSavings > 0 && <p className="booking-note">Você já economiza {money(serviceSavings)} no preço promocional do atendimento.</p>}
            {selectedAddons.map((a) => <div key={a.id} className="booking-summary-row"><span>{a.name}</span><strong>+ {money(a.price)}</strong></div>)}
            <div className="booking-summary-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            {discount > 0 && <div className="booking-summary-row booking-saving-row"><span>{appliedCoupon ? `Cupom ${appliedCoupon.code}` : 'Desconto de primeira sessão'}</span><strong>− {money(discount)}</strong></div>}
            {pixDiscount > 0 && <div className="booking-summary-row booking-saving-row"><span>Desconto Pix (5%)</span><strong>− {money(pixDiscount)}</strong></div>}
            <div className="booking-summary-row booking-summary-total"><span>Total com descontos</span><strong>{money(total)}</strong></div>
            <div className="booking-deposit-block"><div><span>Sinal via Pix para reservar</span><strong>{money(signal)}</strong></div><div><span>Saldo restante</span><strong>{money(rest)}</strong></div><small>O sinal faz parte do valor total, não é uma cobrança adicional.</small></div>
          </div>

          <div className="booking-pix-panel">
            <div><strong>Pagamento do sinal</strong><span>O sinal de {money(signal)} é pago via Pix. O restante é acertado no dia conforme a opção selecionada.</span></div>
            {profile.pixKey.trim() ? <><div className="booking-pix-key">{profile.pixKey}</div><button type="button" className="booking-btn" onClick={copyPixKey}><span>Copiar chave Pix</span></button></> : <p className="booking-note">A chave Pix será compartilhada pelo profissional na conversa do WhatsApp.</p>}
            {billingNotice && <p className="booking-billing-notice" role="status">{billingNotice}</p>}
          </div>
          {error && <p className="booking-error" role="alert">{error}</p>}
          <p className="booking-note">Ao enviar, o sistema solicita uma reserva temporária de até 20 minutos, conforme a configuração da agenda. A confirmação definitiva depende do retorno do profissional e da conferência do sinal.</p>
          <div className="booking-actions"><button type="button" className="booking-btn" onClick={() => { setStep(1); setError(''); }}>← Voltar</button></div>
        </section>}
      </> : <section className="booking-success" aria-live="polite"><div className="booking-success-mark">✓</div><h2>Pedido preparado</h2><p>{sentToConfiguredContact ? 'Sua solicitação foi registrada na agenda. Envie a mensagem no WhatsApp e aguarde o profissional confirmar a disponibilidade e o sinal.' : 'Sua solicitação foi registrada na agenda. Encaminhe a mensagem ao profissional no WhatsApp e aguarde a confirmação da disponibilidade e do sinal.'}</p><button type="button" className="booking-btn primary" onClick={() => { setSent(false); setStep(0); setServiceId(''); setDate(''); setTime(''); setAddons([]); setName(''); setNote(''); setError(''); setSentToConfiguredContact(false); setIsReturning(false); setPayment(''); setCouponInput(''); setAppliedCoupon(null); setCouponError(''); setBillingNotice(''); scrollTop(); }}>Fazer novo agendamento</button></section>}
      <footer className="booking-footer">Atendimento personalizado · {profile.name}</footer>
    </main>

    {!sent && <div className="booking-bottom"><div className="booking-bottom-inner">
      <div className="booking-bottom-price"><small>{step === 0 ? (service ? 'Selecionado' : 'A partir de') : 'Total estimado'}</small><strong>{step === 0 ? money(service?.price ?? Math.min(...profile.services.map((s) => s.price))) : money(total)}</strong></div>
      {step === 0 ? <button type="button" className="booking-btn primary" disabled={!service} onClick={goToSchedule}>Escolher horário →</button> : step === 1 ? <button type="button" className="booking-btn primary" disabled={!date || !time} onClick={goToDetails}>Continuar →</button> : <button type="button" className="booking-btn primary" onClick={() => { void sendRequest(); }} disabled={submitting || !SUPABASE_CONFIGURED}>{submitting ? 'Reservando horário…' : 'Reservar e abrir WhatsApp ↗'}</button>}
    </div></div>}
  </div>;
}
