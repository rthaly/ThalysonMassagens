import { useState, useEffect, useMemo, useRef, memo, type ReactNode, type RefObject } from 'react';

/* ==========================================================================
   1) IDENTIDADE — TUDO QUE É "SEU" FICA AQUI. Troque e o resto do site acompanha.
   ========================================================================== */
const BRAND = {
  NAME: 'Lume Massoterapia',
  SHORT: 'Lume',
  THERAPIST: 'Seu Nome',            // nome que aparece na mensagem de WhatsApp
  ROLE: 'Massoterapeuta e esteticista',
  CITY: 'São Paulo',
  AREA: 'Zona Sul, Centro e região',
  STUDIO_ADDR: 'Bela Vista, São Paulo',
  BIO: 'Atendo com calma, escuta e técnica. Você diz como está se sentindo, eu ajusto a pressão e o ritmo da sessão para o que o seu corpo precisa hoje.',
  HERO_TITLE: 'Seu corpo merece uma pausa de verdade',
  HERO_SUB: 'Massagem e estética com maca, óleos e toda a estrutura. Escolha o horário em um minuto: o sinal só é pago depois que eu confirmar a sua reserva.',
};

const LEGAL = {
  RAZAO: 'Nome Empresarial do Prestador',   // confirme exatamente como está no cartão CNPJ
  CNPJ: '00.000.000/0001-00',
  ENDERECO: 'Bela Vista, São Paulo - SP',
  EMAIL: 'contato@seudominio.com.br',
  ENCARREGADO: 'Seu Nome',
  EMAIL_DPO: 'contato@seudominio.com.br',
  ATUALIZADO: '01/01/2026',
  CANCEL_FREE_HOURS: 12,
};

// Depoimentos REAIS (com autorização). Enquanto estiver vazio, a seção não aparece.
const REVIEWS: { name: string; text: string }[] = [];

const FAQ: [string, string][] = [
  ['Preciso pagar para reservar?', 'Não na hora. Você envia a solicitação, eu confirmo o horário pelo WhatsApp e só então você faz o sinal via Pix. O restante é pago depois da sessão.'],
  ['O que preciso preparar?', 'Nada. Levo maca, óleos e tudo o que for necessário. Se for no seu endereço, basta um espaço livre de uns 2 metros.'],
  ['Posso remarcar ou cancelar?', `Sim. Com pelo menos ${LEGAL.CANCEL_FREE_HOURS} horas de antecedência você remarca sem custo ou recebe o sinal de volta.`],
  ['Como funciona a primeira sessão?', 'Começamos com uma conversa curta sobre objetivo, alergias e lesões. A pressão é ajustada durante toda a sessão, é só avisar.'],
];

const CONFIG = {
  PHONE: '5511999999999',
  PIX_KEY: '00000000000100',
  PIX_LABEL: 'CNPJ',
  INSTAGRAM: 'https://www.instagram.com/seuperfil',
  REVIEW_LINK: 'https://g.page/r/SEU_LINK/review',
  AVATAR: '/perfil.jpg', // arquivo em public/
  // Nomes das funções no Supabase. Mantive os originais para não quebrar o banco que você já tem.
  RPC: { busy: 'get_busy_thalyson', book: 'book_slot_thalyson', coupon: 'check_coupon_thalyson' },
  COUPONS: { VOLTEI: 0.08, AMIGO13: 0.13 } as Record<string, number>,
  SIGNAL_AMOUNT: 40,
  FIRST_TIME_DISCOUNT: 15,
  HOME_FEE: 25,
  PIX_DISCOUNT: 0.03,
  OPEN_MIN: 9 * 60,
  LAST_END_MIN: 21 * 60,
  SLOT_STEP: 60,
  BUFFER_STUDIO: 15,
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 30,
  MIN_LEAD_HOME: 120,
  DAYS_AHEAD: 14,
  DAYS_OFF: [] as number[],
  BLOCKED: {} as Record<string, string[]>,
};

// Exemplos: troque pelos seus serviços. "featured" marca o mais escolhido (vem pré-selecionado).
const PACKAGES = [
  { id: 'relaxante', title: 'Massagem relaxante', price: 180, min: 50, tags: ['Corpo todo', 'Pressão ajustável'], featured: false,
    desc: 'Para soltar a tensão do dia a dia. Movimentos longos e firmes nas costas, ombros, pernas e braços.' },
  { id: 'premium', title: 'Experiência completa', price: 290, min: 90, tags: ['Pedras quentes', 'Pés e couro cabeludo'], featured: true,
    desc: 'A sessão mais completa: relaxante com pedras quentes, massagem nos pés e finalização com calma. Ideal para desacelerar de verdade.' },
  { id: 'muscular', title: 'Alívio de dor muscular', price: 200, min: 60, tags: ['Liberação miofascial', 'Ventosas'], featured: false,
    desc: 'Foco nos pontos de tensão: pescoço, lombar e ombros. Indicado para quem passa muito tempo sentado ou treina.' },
  { id: 'drenagem', title: 'Drenagem linfática', price: 200, min: 50, tags: ['Reduz inchaço', 'Toque leve'], featured: false,
    desc: 'Técnica suave para estimular a circulação e reduzir a sensação de peso e inchaço.' },
];

const ADDONS = [
  { id: 'time', label: 'Mais 30 minutos de sessão', price: 70 },
  { id: 'stones', label: 'Pedras quentes', price: 40 },
];

const LOC_TYPES = [
  { id: 'studio', label: 'No meu espaço' },
  { id: 'home', label: 'Na sua casa' },
] as const;

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix (-3%)' },
  { id: 'card', label: 'Cartão' },
  { id: 'cash', label: 'Dinheiro' },
] as const;

const K = { consent: 'lume_consent_v1', draft: 'lume_draft', cid: 'lume_cid', ret: 'lume_returning' };

/* ==========================================================================
   2) TEXTOS LEGAIS (LGPD / CDC) — revise com seu contador ou advogado
   ========================================================================== */
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
type Sec = [string, string];

const DOCS: Record<DocId, { title: string; intro: string; secs: Sec[] }> = {
  privacy: {
    title: 'Política de Privacidade',
    intro: `Última atualização: ${LEGAL.ATUALIZADO}. Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018).`,
    secs: [
      ['1. Controlador', `${LEGAL.RAZAO}, CNPJ ${LEGAL.CNPJ}, ${LEGAL.ENDERECO}. Contato: ${LEGAL.EMAIL}. Encarregado (DPO): ${LEGAL.ENCARREGADO}, ${LEGAL.EMAIL_DPO}.`],
      ['2. Dados e finalidade', 'Nome, data, horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V). Endereço (rua, número, complemento, bairro e CEP): somente se você escolher atendimento no seu endereço. Não pedimos CPF, e-mail nem data de nascimento; seu telefone só aparece na conversa de WhatsApp que você mesmo inicia.'],
      ['3. Campo de observações', 'O campo opcional de observações segue apenas pelo WhatsApp e não é salvo neste aparelho nem no sistema de agenda. Evite informar dados sensíveis (como condições de saúde) além do necessário; se precisar informar, será usado só para adequar a sessão e você pode pedir a exclusão a qualquer momento.'],
      ['4. Compartilhamento', 'WhatsApp (Meta Platforms), para onde você envia a solicitação. ViaCEP, que recebe o CEP digitado. Google Fonts, que entrega as fontes do site e pode registrar seu IP. Se o sistema de agenda estiver ativo, o provedor de banco de dados (Supabase). Não vendemos dados.'],
      ['5. Armazenamento e retenção', 'Dados ficam no seu aparelho só se você escolher “Lembrar meus dados”. Conversas e registros de agendamento são mantidos pelo tempo necessário para a sessão, o acerto financeiro e obrigações legais, e depois eliminados.'],
      ['6. Seus direitos (art. 18)', 'Confirmação, acesso, correção, anonimização ou eliminação, portabilidade, informação sobre compartilhamento, revogação do consentimento e oposição. Peça pelo e-mail do encarregado. Você também pode reclamar à ANPD (gov.br/anpd).'],
      ['7. Menores e segurança', 'Serviço exclusivo para maiores de 18 anos. Usamos HTTPS e limitamos os dados ao necessário; em caso de incidente relevante, avisaremos você e a ANPD conforme a lei.'],
    ],
  },
  terms: {
    title: 'Termos de Serviço',
    intro: `Última atualização: ${LEGAL.ATUALIZADO}. Ao usar este site você declara que leu e concorda com estes termos.`,
    secs: [
      ['1. Prestador', `${LEGAL.RAZAO}, CNPJ ${LEGAL.CNPJ}, ${LEGAL.ENDERECO}, ${LEGAL.EMAIL}.`],
      ['2. Serviço', 'Massagem e estética, para maiores de 18 anos, conforme o pacote escolhido. As descrições são informativas; massagem não substitui tratamento médico nem promete resultado de saúde.'],
      ['3. Solicitação e confirmação', 'O site registra uma solicitação. O horário só está garantido após a confirmação pelo WhatsApp e o pagamento do sinal. Sem o sistema de agenda conectado, a disponibilidade exibida é demonstrativa.'],
      ['4. Preços e pagamento', 'Valores em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. Adicionais e taxa de deslocamento aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.'],
      ['5. Conduta', 'Exige-se respeito mútuo. A sessão pode ser encerrada, sem devolução do valor dos serviços já prestados, em caso de desrespeito, assédio, embriaguez evidente ou risco à segurança. Informe previamente condições de saúde, alergias e lesões.'],
      ['6. Lei aplicável', 'Lei brasileira, incluindo o Código de Defesa do Consumidor. Foro do domicílio do consumidor.'],
    ],
  },
  refund: {
    title: 'Cancelamento e Reembolso',
    intro: `Última atualização: ${LEGAL.ATUALIZADO}. Estas regras valem sem prejuízo dos direitos do consumidor.`,
    secs: [
      ['1. Cancelamento pelo cliente', `Com pelo menos ${LEGAL.CANCEL_FREE_HOURS} horas de antecedência: devolução integral do sinal via Pix ou remarcação sem custo. Com menos antecedência ou falta sem aviso: o sinal pode ser retido para cobrir o horário reservado, ou convertido em crédito, a critério do prestador.`],
      ['2. Arrependimento (art. 49 do CDC)', 'Na contratação à distância, você pode se arrepender em até 7 dias e receber o sinal de volta, desde que a sessão ainda não tenha sido realizada.'],
      ['3. Cancelamento pelo prestador', 'Se não puder atender, o sinal é devolvido integralmente ou a sessão é remarcada, conforme sua escolha.'],
      ['4. Como pedir', `Responda a conversa do WhatsApp ou escreva para ${LEGAL.EMAIL}. O reembolso é feito pelo mesmo meio de pagamento em até 7 dias úteis.`],
    ],
  },
  cookies: {
    title: 'Cookies e armazenamento local',
    intro: 'Este site não usa cookies de publicidade nem ferramentas de análise ou rastreamento (como Google Analytics ou Meta Pixel).',
    secs: [
      ['Estritamente necessário', 'Guardamos no navegador (localStorage) a lembrança de que você já agendou antes, para não repetir o desconto de primeira visita, e a sua escolha de privacidade. Não identificam você.'],
      ['Opcional (com seu consentimento)', '“Lembrar meus dados” salva nome, tipo de local e endereço neste aparelho para agilizar a próxima reserva. Você pode apagar tudo em “Apagar meus dados” no perfil ou mudar a escolha em “Preferências de privacidade” no rodapé.'],
      ['Futuro', 'Se ativarmos qualquer ferramenta de análise ou marketing, ela só carregará depois do seu consentimento.'],
    ],
  },
};

/* ==========================================================================
   3) UTILITÁRIOS
   ========================================================================== */
let ENV: Record<string, string | undefined> = {};
try { ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {}; } catch { ENV = {}; }
const SUPABASE_URL = ENV.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = ENV.VITE_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_PUBLISHABLE_KEY || '';
const BACKEND_ON = !!(SUPABASE_URL && SUPABASE_KEY);

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch { /* ignore */ } };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<{ ok: boolean; data: T | null }> {
  if (!BACKEND_ON) return { ok: false, data: null };
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      body: JSON.stringify(args),
    });
    if (!r.ok) return { ok: false, data: null };
    return { ok: true, data: (await r.json()) as T };
  } catch { return { ok: false, data: null }; }
}

const clientId = () => {
  let id = store.get(K.cid);
  if (!id || id.length < 8) {
    id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    store.set(K.cid, id);
  }
  return id;
};

const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date): boolean => !!a && dateKey(a) === dateKey(b);
const dayLabel = (d: Date, i: number) => (i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''));
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };

async function lookupCoupon(code: string): Promise<{ ok: boolean; value: number }> {
  if (!BACKEND_ON) return { ok: true, value: CONFIG.COUPONS[code] || 0 };
  const r = await rpc<number | null>(CONFIG.RPC.coupon, { p_code: code });
  return { ok: r.ok, value: typeof r.data === 'number' ? r.data : 0 };
}

const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  check: 'M20 6L9 17l-5-5',
  close: 'M18 6L6 18 M6 6l12 12',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
  leaf: 'M5 21c0-9 5-15 15-16 0 10-6 15-15 16z M5 21c2-5 5-8 9-10',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true">
    <path d={ICONS[name]} />
  </svg>
));

/* Estilos compartilhados (tema claro) */
const inputCls = 'w-full bg-white border border-stone-300 rounded-2xl px-5 min-h-[52px] text-base text-slate-900 placeholder:text-stone-500 focus:outline-none focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20 transition-colors disabled:opacity-50';
const labelCls = 'block text-sm font-medium text-slate-700 mb-3';
const chipBase = 'min-h-[52px] border rounded-full transition-colors flex items-center justify-center relative focus-within:ring-2 focus-within:ring-teal-700 focus-within:ring-offset-2 focus-within:ring-offset-[#F7F9F8]';
const chipOn = 'bg-slate-900 text-white border-slate-900 font-semibold cursor-pointer';
const chipOff = 'bg-white border-stone-300 text-slate-700 hover:border-slate-500 cursor-pointer';
const btnPrimary = 'min-h-[52px] px-7 text-sm font-semibold rounded-full bg-teal-800 text-white hover:bg-teal-700 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:bg-stone-200 disabled:text-stone-500 disabled:cursor-not-allowed';
const btnGhost = 'min-h-[52px] px-6 text-sm font-semibold rounded-full border border-stone-300 text-slate-800 bg-white hover:border-slate-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800';
const linkCls = 'underline underline-offset-4 text-teal-800 hover:text-teal-700';

/* Título com revelação palavra por palavra (motion design). Respeita prefers-reduced-motion. */
function AnimTitle({ text, as: Tag = 'h1', className = '' }: { text: string; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Tag className={`disp ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom pb-[0.18em] -mb-[0.18em] mr-[0.25em]">
          <span className="inline-block rise" style={{ animationDelay: `${120 + i * 90}ms` }}>{w}</span>
        </span>
      ))}
    </Tag>
  );
}

function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} bg-teal-100 text-teal-900 inline-flex items-center justify-center disp text-xl`}>{BRAND.SHORT[0]}</span>;
  return <img src={CONFIG.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

const Summary = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm"><span className="text-stone-600">{label}</span><span className="text-slate-900 font-medium text-right">{value}</span></div>
);

const ActionBar = ({ children }: { children: ReactNode }) => (
  <div className="sticky bottom-0 -mx-6 px-6 py-4 mt-10 bg-[#F7F9F8]/95 backdrop-blur border-t border-stone-200 flex gap-3 items-center z-30">{children}</div>
);

/* Foco preso + ESC + trava de rolagem para os modais */
function useModal(ref: RefObject<HTMLDivElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = ref.current;
    el?.querySelector<HTMLElement>('button')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { closeRef.current(); return; }
      if (e.key !== 'Tab' || !el) return;
      const f = el.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; prevFocus?.focus(); };
  }, [ref]);
}

function LegalModal({ doc, onClose }: { doc: DocId; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  const d = DOCS[doc];
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/50" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(e) => e.stopPropagation()} className="bg-white border border-stone-200 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center gap-4 p-5 border-b border-stone-200">
          <h2 id="legal-title" className="disp text-2xl text-slate-900">{d.title}</h2>
          <button type="button" onClick={onClose} className="min-h-[44px] px-4 text-sm font-semibold rounded-full border border-stone-300 text-slate-800 hover:bg-stone-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800">Fechar</button>
        </div>
        <div className="p-5 overflow-y-auto text-sm text-slate-700 leading-relaxed" tabIndex={0}>
          <p className="mb-4">{d.intro}</p>
          {d.secs.map(([h, t]) => (<div key={h}><h3 className="text-slate-900 font-semibold mt-5 mb-2">{h}</h3><p>{t}</p></div>))}
        </div>
      </div>
    </div>
  );
}

function ProfileModal({ onClose, onForget, greeting }: { onClose: () => void; onForget: () => void; greeting: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useModal(ref, onClose);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/50" onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label="Perfil" onClick={(e) => e.stopPropagation()} className="bg-white border border-stone-200 rounded-3xl w-full max-w-sm p-8 relative shadow-xl max-h-[90vh] overflow-y-auto">
        <button type="button" aria-label="Fechar perfil" onClick={onClose} className="absolute top-3 right-3 p-3 text-stone-500 hover:text-slate-900 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800"><Icon name="close" /></button>
        <Avatar className="w-20 h-20 rounded-full mb-5" alt={`Foto de ${BRAND.THERAPIST}`} />
        <h2 className="disp text-3xl text-slate-900">{BRAND.NAME}</h2>
        <p className="text-teal-800 text-sm font-medium mb-5">{BRAND.ROLE}</p>
        <div className="space-y-4 text-sm text-slate-700 leading-relaxed mb-6">
          <p>{greeting}. {BRAND.BIO}</p>
          <p className="flex items-start gap-3 bg-[#F7F9F8] p-4 rounded-2xl"><Icon name="map" size={18} className="mt-0.5 text-teal-800" /><span>Atendimento em {BRAND.STUDIO_ADDR} e no seu endereço ({BRAND.AREA}).</span></p>
        </div>
        <button type="button" onClick={onForget} className="w-full text-xs text-stone-600 hover:text-slate-900 underline underline-offset-4 min-h-[44px] mb-3">Apagar meus dados deste aparelho</button>
        <div className="pt-5 border-t border-stone-200 flex justify-center gap-6">
          <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 min-h-[44px]"><Icon name="instagram" size={18} /> Instagram</a>
          <a href={CONFIG.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 min-h-[44px]"><Icon name="star" size={18} /> Avaliações</a>
        </div>
      </div>
    </div>
  );
}

function LegalFooter({ onOpen, onPrefs }: { onOpen: (d: DocId) => void; onPrefs: () => void }) {
  const link = 'underline underline-offset-4 min-h-[44px] inline-flex items-center px-2 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800';
  return (
    <footer className="px-6 max-w-lg mx-auto mt-14 pt-6 border-t border-stone-200 text-xs text-stone-600 leading-relaxed text-center">
      <nav aria-label="Informações legais" className="flex flex-wrap justify-center">
        <button type="button" className={link} onClick={() => onOpen('privacy')}>Privacidade</button>
        <button type="button" className={link} onClick={() => onOpen('terms')}>Termos</button>
        <button type="button" className={link} onClick={() => onOpen('refund')}>Cancelamento e reembolso</button>
        <button type="button" className={link} onClick={() => onOpen('cookies')}>Cookies</button>
        <button type="button" className={link} onClick={onPrefs}>Preferências de privacidade</button>
      </nav>
      <p className="mt-3">{LEGAL.RAZAO} · CNPJ {LEGAL.CNPJ}<br />{LEGAL.ENDERECO}<br />{LEGAL.EMAIL}</p>
      <p className="mt-2">Serviço exclusivo para maiores de 18 anos.</p>
    </footer>
  );
}

function ConsentBanner({ onChoose, onOpen }: { onChoose: (c: 'min' | 'remember') => void; onOpen: (d: DocId) => void }) {
  const b = 'min-h-[48px] px-5 text-sm font-semibold rounded-full bg-slate-900 text-white flex-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800';
  return (
    <section aria-label="Preferências de privacidade" className="fixed bottom-0 inset-x-0 z-[120] bg-white border-t border-stone-300 p-5 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]">
      <div className="max-w-lg mx-auto">
        <p className="text-sm text-slate-700 leading-relaxed mb-4">
          Sem rastreadores nem anúncios. Podemos lembrar seu nome e endereço neste aparelho para a próxima reserva ser mais rápida. Você decide.{' '}
          <button type="button" className={`${linkCls} min-h-[44px]`} onClick={() => onOpen('cookies')}>Saiba mais</button>
        </p>
        <div className="flex gap-3">
          <button type="button" className={b} onClick={() => onChoose('min')}>Só o necessário</button>
          <button type="button" className={b} onClick={() => onChoose('remember')}>Lembrar meus dados</button>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   4) APP
   ========================================================================== */
type SlotStatus = 'ok' | 'past' | 'blocked';
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; notes: string; payment: string; packageId: string; addons: Record<string, boolean>;
}
const DEFAULT_PKG = (PACKAGES.find((p) => p.featured) || PACKAGES[0]).id;
const emptyData = (): BookingData => ({
  name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
  date: null, time: '', notes: '', payment: '', packageId: DEFAULT_PKG, addons: {},
});

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
  const lockRef = useRef({ fails: 0, until: 0 });

  const [doc, setDoc] = useState<DocId | null>(null);
  const [consent, setConsent] = useState<string | null>(() => store.get(K.consent));
  const [askPrefs, setAskPrefs] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState('');
  const remember = consent === 'remember';
  const bannerOpen = consent === null || askPrefs;

  const [data, setData] = useState<BookingData>(emptyData);
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const [busy, setBusy] = useState<{ s: number; e: number }[] | null>(null);
  const [busyLoading, setBusyLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sentLink, setSentLink] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };

  const choose = (c: 'min' | 'remember') => {
    store.set(K.consent, c); setConsent(c); setAskPrefs(false);
    if (c === 'min') store.del(K.draft);
  };

  // Fontes elegantes: Instrument Serif (títulos) + Hanken Grotesk (texto)
  useEffect(() => {
    if (document.getElementById('brand-fonts')) return;
    const l = document.createElement('link');
    l.id = 'brand-fonts'; l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Hanken+Grotesk:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }, []);

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 700); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (store.get(K.ret) === 'yes') setIsReturning(true);
    const draft = store.get(K.consent) === 'remember' ? store.get(K.draft) : null;
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '' }));
      } catch { /* rascunho inválido */ }
    }
  }, [isLoading]);

  useEffect(() => {
    if (remember && data.name.length > 2) {
      store.set(K.draft, JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro }));
    }
  }, [remember, data.name, data.locType, data.street, data.number, data.bairro]);

  useEffect(() => { if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  useEffect(() => {
    if (!data.date) return undefined;
    let off = false;
    setBusyLoading(true);
    rpc<{ s: number; e: number }[]>(CONFIG.RPC.busy, { p_date: dateKey(data.date) })
      .then((r) => { if (!off) setBusy(r.ok ? r.data : null); })
      .finally(() => { if (!off) setBusyLoading(false); });
    return () => { off = true; };
  }, [data.date, tick]);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS = [];
    ADDONS.forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); if (a.id === 'time') dur += 30; }
    });
    const base = pkg.price + addonsTotal;
    const homeFee = isHome ? CONFIG.HOME_FEE : 0;

    let discount = 0;
    if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
    else if (!isReturning) discount = CONFIG.FIRST_TIME_DISCOUNT;
    discount = Math.min(discount, base);

    const afterDiscount = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.round(afterDiscount * CONFIG.PIX_DISCOUNT) : 0;
    const total = afterDiscount - pixDiscount + homeFee;
    const sinal = Math.min(CONFIG.SIGNAL_AMOUNT, total);
    return { base: pkg.price, addonsTotal, homeFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
  }, [data.addons, data.payment, pkg, isHome, isReturning, coupon.applied, coupon.value]);

  // Recalcula se a página ficar aberta depois da meia-noite
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
    const blocked = (CONFIG.BLOCKED[dateKey(data.date)] || []).map(toMin);
    const out: { t: string; status: SlotStatus }[] = [];
    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      const end = m + invoice.dur + buffer;
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      else if (blocked.some((b) => b < end && b + CONFIG.SLOT_STEP > m)) status = 'blocked';
      else if ((busy || []).some((x) => x.s < end && x.e + buffer > m)) status = 'blocked';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now, busy]);

  useEffect(() => {
    if (!busyLoading && data.time && !slots.some((s) => s.t === data.time && s.status === 'ok')) set({ time: '' });
  }, [slots, busyLoading, data.time]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  const verified = BACKEND_ON && busy !== null && !busyLoading; // só falamos de escassez com dados reais

  const errors = {
    name: data.name.trim().length < 3 ? 'Informe seu nome (mínimo 3 letras).' : '',
    date: !data.date ? 'Escolha uma data.' : '',
    time: data.date && !data.time ? 'Escolha um horário.' : '',
    address: isHome && !(data.street && data.number && data.bairro) ? 'Preencha rua, número e bairro.' : '',
  };
  const step2Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  const applyCoupon = async () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const L = lockRef.current;
    if (Date.now() < L.until) { setCoupon((c) => ({ ...c, error: 'Muitas tentativas. Aguarde alguns segundos.' })); return; }
    const r = await lookupCoupon(code);
    if (r.value > 0) {
      L.fails = 0; vibrate([20, 40]); setCoupon({ input: '', applied: code, value: r.value, error: '' }); showToast('Cupom ativado');
    } else {
      vibrate(50); L.fails += 1;
      if (L.fails >= 3) { L.until = Date.now() + 30000; L.fails = 0; }
      setCoupon((c) => ({ ...c, error: r.ok ? 'Cupom inválido ou expirado.' : 'Sem conexão. Tente novamente.' }));
    }
  };

  const forgetMe = () => {
    store.del(K.draft); store.del(K.cid); store.del(K.consent);
    setConsent(null); setProfileOpen(false);
    set({ name: '', cep: '', street: '', number: '', comp: '', bairro: '', notes: '' });
    showToast('Dados apagados deste aparelho');
  };

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY);
    showToast(ok ? `Chave Pix (${CONFIG.PIX_LABEL}) copiada` : `Chave Pix: ${CONFIG.PIX_KEY}`);
  };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast('CEP não encontrado. Preencha manualmente.');
      } catch { showToast('Sem conexão para buscar o CEP.'); }
    }
  };

  const whatsappLink = (bookingCode = '') => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) loc = `📍 *Local:* No espaço (${BRAND.STUDIO_ADDR}). O endereço exato será enviado após a confirmação.`;
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, ${BRAND.CITY}`;
      loc = `📍 *Local:* No meu endereço.\n*Endereço:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    let t = `Olá, ${BRAND.THERAPIST}! Fiz uma solicitação pelo site e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    if (bookingCode) t += `*CÓDIGO DA SOLICITAÇÃO:* ${bookingCode}\n`;
    t += `*DIA E HORA:* ${dStr}, das ${data.time} às ${endTime}\n${loc}\n\n*SERVIÇO (${invoice.dur} min):*\n✅ ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `➕ ${a.label}\n`));
    if (data.notes.trim()) t += `\n*OBSERVAÇÕES:* ${clean(data.notes)}\n`;
    t += `\n*PAGAMENTO:*\n*Total:* ${money(invoice.total)} (${(PAYMENT_METHODS.find((m) => m.id === data.payment)?.label || '').replace(/ \(.*\)/, '')})\n`;
    t += `*Sinal (Pix, após a confirmação):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n\n`;
    t += '✅ Declaro ter 18 anos ou mais e ter lido a Política de Privacidade, os Termos e a Política de Cancelamento.\n';
    if (optIn) t += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n';
    t += '\nAguardo a confirmação do horário!';
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, m: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(m).replace(':', '')}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const s = toMin(data.time);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', `PRODID:-//${BRAND.SHORT}//Agenda//PT`, 'BEGIN:VEVENT',
      `UID:${Date.now()}@${BRAND.SHORT.toLowerCase()}`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`,
      `SUMMARY:${pkg.title} - ${BRAND.SHORT}`, `DESCRIPTION:Sinal de ${money(invoice.sinal)} via Pix após a confirmação.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'sessao.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const finishBooking = async () => {
    if (!data.payment) { vibrate(50); showToast('Escolha a forma de pagamento'); return; }
    if (!ageOk) { vibrate(50); showToast('Confirme que tem 18 anos ou mais'); return; }
    if (submitting || !data.date || !data.time) return;
    if (BACKEND_ON && (busyLoading || busy === null)) { showToast('Ainda não consegui verificar os horários. Tente novamente.'); return; }
    setSubmitting(true);

    if (hp) { setSubmitting(false); setSentLink('#'); setStep(4); return; } // honeypot: finge sucesso para robôs

    const w = window.open('', '_blank'); // abre antes do await para não ser bloqueado
    let bookingCode = '';

    if (BACKEND_ON) {
      const r = await rpc<{ ok: boolean; error?: string; booking_code?: string }>(CONFIG.RPC.book, {
        p_date: dateKey(data.date), p_start_minute: toMin(data.time), p_service_id: pkg.id, p_duration: invoice.dur,
        p_customer_name: data.name.trim(), p_client_key: clientId(),
        p_total: Number(invoice.total.toFixed(2)), p_signal: Number(invoice.sinal.toFixed(2)), p_remaining: Number(invoice.rest.toFixed(2)),
        p_is_home: isHome,
      });
      if (!r.ok || !r.data) {
        w?.close(); setSubmitting(false);
        showToast('Não consegui registrar a reserva. Nada foi reservado. Tente novamente em instantes.');
        return;
      }
      if (!r.data.ok) {
        const err = r.data.error;
        w?.close(); setSubmitting(false); vibrate(50);
        showToast(err === 'taken' ? 'Esse horário acabou de ser ocupado. Escolha outro.'
          : err === 'limit' || err === 'pending_limit' ? 'Você já tem solicitações aguardando confirmação.'
          : err === 'busy_system' ? 'Muitas solicitações pendentes agora. Tente em alguns minutos.'
          : err === 'outside_hours' ? 'Esse horário está fora do período de atendimento.'
          : err === 'past' ? 'Esse horário já passou ou está muito próximo. Escolha outro.'
          : err === 'invalid_service' ? 'Este serviço ainda não está cadastrado no banco. Avise o suporte.'
          : 'Não foi possível registrar a solicitação. Revise os dados e tente novamente.');
        setTick((t) => t + 1); set({ time: '' }); setStep(2); return;
      }
      bookingCode = r.data.booking_code || '';
    }

    const link = whatsappLink(bookingCode);
    store.set(K.ret, 'yes'); store.del(K.draft);
    setSentLink(link); vibrate([30, 50]);
    if (w) { w.opener = null; w.location.href = link; } else window.location.href = link;
    setSubmitting(false); setStep(4);
    if (!BACKEND_ON) showToast('Solicitação enviada. O horário será confirmado manualmente pelo WhatsApp.');
  };

  const resetFlow = () => {
    vibrate(15); setTouched(false); setAgeOk(false);
    setData((p) => ({ ...emptyData(), name: p.name }));
    setCoupon({ input: '', applied: '', value: 0, error: '' });
    setStep(1);
  };

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const firstName = data.name.trim().split(' ')[0];

  const css = (
    <style dangerouslySetInnerHTML={{ __html: `
      .disp { font-family: 'Instrument Serif', 'Cormorant Garamond', Georgia, serif; font-weight: 400; letter-spacing: -0.01em; line-height: 1.05; }
      .body-font { font-family: 'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif; }
      @keyframes rise { from { transform: translateY(105%); opacity: 0 } to { transform: none; opacity: 1 } }
      @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      @keyframes draw { from { transform: scaleX(0) } to { transform: scaleX(1) } }
      @keyframes drift { 0%,100% { transform: translate(0,0) } 50% { transform: translate(18px,-14px) } }
      @keyframes slide { 0% { transform: translateX(-100%) } 100% { transform: translateX(300%) } }
      .rise { animation: rise .95s cubic-bezier(.2,.8,.2,1) both }
      .soft-in { animation: fadeIn .5s ease both }
      .draw-line { transform-origin: left; animation: draw 1.1s .7s cubic-bezier(.2,.8,.2,1) both }
      .drift { animation: drift 14s ease-in-out infinite }
      .load-bar { animation: slide 1.2s infinite ease-in-out }
      .hide-scrollbar::-webkit-scrollbar { display: none } .hide-scrollbar { scrollbar-width: none }
      details > summary { list-style: none } details > summary::-webkit-details-marker { display: none }
      details[open] .plus { transform: rotate(45deg) } .plus { transition: transform .25s ease }
      @media (prefers-reduced-motion: reduce) { .rise, .soft-in, .draw-line, .drift, .load-bar { animation: none } * { transition: none !important } }
    ` }} />
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F7F9F8] body-font flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
        <p className="disp text-4xl text-slate-900 mb-8 text-center">{BRAND.NAME}</p>
        <div className="w-40 h-0.5 bg-stone-200 rounded-full overflow-hidden relative"><div className="absolute inset-y-0 left-0 w-1/3 bg-teal-800 load-bar rounded-full" /></div>
        {css}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#F7F9F8] text-slate-800 body-font selection:bg-teal-200 relative overflow-x-clip ${bannerOpen ? 'pb-56' : 'pb-12'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-white focus:text-slate-900 focus:px-4 focus:py-3 focus:rounded-xl">Pular para o conteúdo</a>

      {toast && <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-6 py-3 rounded-full font-medium text-sm shadow-xl soft-in max-w-[90vw] text-center">{toast}</div>}
      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} onForget={forgetMe} greeting={greeting} />}

      {step > 0 && step < 4 && (
        <header className="px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 bg-[#F7F9F8]/90 backdrop-blur-md z-40 border-b border-stone-200">
          <button type="button" onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800">
            <Avatar className="w-10 h-10 rounded-full" alt="" />
            <span><span className="block text-sm font-semibold text-slate-900">{BRAND.NAME}</span><span className="block text-xs text-stone-600">Ver perfil</span></span>
          </button>
          <div className="flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(step, 3)} aria-label={`Passo ${Math.min(step, 3)} de 3`}>
            {[1, 2, 3].map((i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-teal-800' : 'w-2 bg-stone-300'}`} />)}
          </div>
        </header>
      )}

      <main id="main" tabIndex={-1} className="px-6 max-w-lg mx-auto outline-none" key={step}>
        {/* ---------- 0. PÁGINA INICIAL ---------- */}
        {step === 0 && (
          <div>
            <section className="relative pt-14 pb-12 min-h-[78vh] flex flex-col justify-center">
              <div aria-hidden="true" className="absolute -top-10 -right-24 w-72 h-72 rounded-full bg-teal-200/50 blur-3xl drift" />
              <p className="relative text-sm text-teal-800 font-medium mb-5 soft-in">{BRAND.CITY} · {BRAND.ROLE}</p>
              <AnimTitle text={BRAND.HERO_TITLE} className="relative text-[3.4rem] sm:text-6xl text-slate-900" />
              <div aria-hidden="true" className="relative h-px w-24 bg-teal-800 my-7 draw-line" />
              <p className="relative text-base text-slate-700 leading-relaxed mb-9 soft-in" style={{ animationDelay: '.9s' }}>{BRAND.HERO_SUB}</p>
              <div className="relative flex flex-col gap-3 soft-in" style={{ animationDelay: '1.1s' }}>
                <button type="button" onClick={() => { vibrate(30); setStep(1); }} className={`${btnPrimary} min-h-[58px] text-base`}>Ver horários disponíveis</button>
                <a href={`https://wa.me/${CONFIG.PHONE}`} target="_blank" rel="noopener noreferrer" className={`${btnGhost} flex items-center justify-center`}>Prefiro conversar no WhatsApp</a>
              </div>
            </section>

            <section aria-label="Garantias" className="grid gap-3 mb-14">
              {([
                ['leaf', 'Estrutura completa', 'Maca, óleos e materiais higienizados. Você não precisa preparar nada.'],
                ['clock', 'Pontualidade', 'Confirmo o horário antes da sessão e chego quando combinado.'],
                ['shield', 'Discrição e respeito', 'Seus dados ficam só com o necessário para a reserva.'],
              ] as [IconName, string, string][]).map(([ic, t, d]) => (
                <div key={t} className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-200">
                  <Icon name={ic} className="text-teal-800 mt-0.5" size={22} />
                  <div><h2 className="font-semibold text-slate-900 text-base mb-1">{t}</h2><p className="text-sm text-slate-600 leading-relaxed">{d}</p></div>
                </div>
              ))}
            </section>

            <section className="mb-14">
              <AnimTitle as="h2" text="Reservar leva um minuto" className="text-4xl text-slate-900 mb-6" />
              <ol className="space-y-5">
                {['Escolha o serviço e o horário que combina com você.', 'Eu confirmo pelo WhatsApp. Só então você paga o sinal.', 'Relaxe: eu levo tudo e cuido do resto.'].map((t, i) => (
                  <li key={t} className="flex gap-4 items-start"><span className="disp text-3xl text-teal-800 w-7 shrink-0">{i + 1}</span><p className="text-slate-700 leading-relaxed pt-1">{t}</p></li>
                ))}
              </ol>
            </section>

            {REVIEWS.length > 0 && (
              <section className="mb-14">
                <AnimTitle as="h2" text="Quem já passou por aqui" className="text-4xl text-slate-900 mb-6" />
                <div className="space-y-4">
                  {REVIEWS.map((r) => (<figure key={r.name} className="p-6 bg-white rounded-2xl border border-stone-200"><blockquote className="text-slate-700 leading-relaxed mb-3">“{r.text}”</blockquote><figcaption className="text-sm font-semibold text-slate-900">{r.name}</figcaption></figure>))}
                </div>
                <a href={CONFIG.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className={`${linkCls} inline-flex items-center min-h-[44px] mt-3 text-sm`}>Ver todas as avaliações</a>
              </section>
            )}

            <section className="mb-14">
              <AnimTitle as="h2" text="Dúvidas comuns" className="text-4xl text-slate-900 mb-4" />
              <div className="divide-y divide-stone-200 border-y border-stone-200">
                {FAQ.map(([q, a]) => (
                  <details key={q} className="group py-1">
                    <summary className="flex justify-between items-center gap-4 min-h-[56px] cursor-pointer font-medium text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-800 rounded">{q}<span className="plus text-2xl text-teal-800 leading-none" aria-hidden="true">+</span></summary>
                    <p className="pb-4 text-sm text-slate-600 leading-relaxed">{a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section className="text-center py-10 px-6 bg-white rounded-3xl border border-stone-200">
              <AnimTitle as="h2" text="Pronto para a sua pausa?" className="text-4xl text-slate-900 mb-3" />
              <p className="text-sm text-slate-600 mb-6">{isReturning ? 'Que bom ter você de volta.' : `Na primeira visita, ${money(CONFIG.FIRST_TIME_DISCOUNT)} de desconto aplicados automaticamente.`}</p>
              <button type="button" onClick={() => { vibrate(30); setStep(1); }} className={`${btnPrimary} w-full`}>Escolher meu horário</button>
            </section>
          </div>
        )}

        {/* ---------- 1. SERVIÇO ---------- */}
        {step === 1 && (
          <div>
            <p className="text-sm text-teal-800 font-medium mb-2">Passo 1 de 3</p>
            <AnimTitle text="O que o seu corpo pede hoje?" className="text-5xl text-slate-900 mb-6" />
            {!isReturning && (
              <p className="flex items-start gap-3 bg-teal-50 border border-teal-200 p-4 rounded-2xl mb-7 text-sm text-teal-900 leading-relaxed"><Icon name="star" size={18} className="mt-0.5" />Primeira visita: {money(CONFIG.FIRST_TIME_DISCOUNT)} de desconto entram sozinhos no resumo.</p>
            )}
            <fieldset className="space-y-4 min-w-0">
              <legend className="sr-only">Serviços disponíveis</legend>
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <label key={p.id} className={`block w-full p-6 rounded-3xl transition-all border cursor-pointer focus-within:ring-2 focus-within:ring-teal-700 ${on ? 'bg-white border-teal-800 shadow-md' : 'bg-white/60 border-stone-300 hover:bg-white'}`}>
                    <input type="radio" name="package" value={p.id} checked={on} onChange={() => { vibrate(15); set({ packageId: p.id }); }} className="sr-only" />
                    <span className="flex justify-between items-start gap-4 mb-3">
                      <span className="disp text-3xl text-slate-900">{p.title}</span>
                      <span className="font-semibold text-lg shrink-0 text-slate-900 pt-1">{money(p.price)}</span>
                    </span>
                    {p.featured && <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-900 mb-3">Mais escolhido</span>}
                    <span className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-stone-100 text-slate-700 inline-flex items-center gap-1"><Icon name="clock" size={12} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-full bg-stone-100 text-slate-700">{t}</span>)}
                    </span>
                    <span className="block text-sm leading-relaxed text-slate-600">{p.desc}</span>
                  </label>
                );
              })}
            </fieldset>

            <fieldset className="pt-8 min-w-0">
              <legend className="text-sm font-medium text-slate-700 mb-3">Quer deixar a sessão ainda melhor?</legend>
              <div className="flex flex-col gap-3">
                {ADDONS.map((a) => {
                  const on = !!data.addons[a.id];
                  return (
                    <label key={a.id} className={`w-full p-4 text-sm rounded-2xl border flex justify-between items-center gap-3 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-teal-700 ${on ? 'bg-white border-teal-800 text-slate-900' : 'bg-white/60 border-stone-300 text-slate-700 hover:bg-white'}`}>
                      <input type="checkbox" checked={on} onChange={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                      <span className="flex items-center gap-3"><span aria-hidden="true" className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? 'bg-teal-800 border-teal-800 text-white' : 'border-stone-400'}`}>{on && <Icon name="check" size={14} />}</span>{a.label}</span>
                      <span className="font-medium">+ {money(a.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <ActionBar>
              <div className="flex-1"><p className="text-xs text-stone-600">{invoice.dur} min de sessão</p><p className="disp text-3xl text-slate-900">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button type="button" onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Escolher horário</button>
            </ActionBar>
          </div>
        )}

        {/* ---------- 2. AGENDA ---------- */}
        {step === 2 && (
          <div>
            <p className="text-sm text-teal-800 font-medium mb-2">Passo 2 de 3</p>
            <AnimTitle text="Quando fica bom para você?" className="text-5xl text-slate-900 mb-8" />
            <div className="space-y-9">
              <div>
                <label htmlFor="nm" className={labelCls}>Como devo te chamar?</label>
                <input id="nm" autoComplete="given-name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Seu nome" maxLength={60} aria-invalid={touched && !!errors.name} aria-describedby={touched && errors.name ? 'nm-err' : undefined} />
                {touched && errors.name && <p id="nm-err" className="text-sm text-red-700 mt-2" role="alert">{errors.name}</p>}
                <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              </div>

              <fieldset className="min-w-0">
                <legend className={labelCls}>Onde será a sessão?</legend>
                <div className="grid grid-cols-2 gap-3">
                  {LOC_TYPES.map(({ id, label }) => (
                    <label key={id} className={`${chipBase} text-sm px-3 ${data.locType === id ? chipOn : chipOff}`}>
                      <input type="radio" name="location" value={id} checked={data.locType === id} onChange={() => set({ locType: id })} className="sr-only" />{label}
                    </label>
                  ))}
                </div>
                {isHome && <p className="text-xs text-stone-600 mt-3 leading-relaxed">Taxa de deslocamento de {money(CONFIG.HOME_FEE)}, já somada no resumo. Pedimos mais antecedência para a viagem. O endereço é usado só nesta solicitação e o CEP é consultado no ViaCEP.</p>}
              </fieldset>

              {!isHome ? (
                <p className="text-sm text-slate-700 bg-white p-5 rounded-2xl border border-stone-200 leading-relaxed flex gap-3"><Icon name="map" size={18} className="mt-0.5 text-teal-800" /><span>O espaço fica em <strong className="text-slate-900">{BRAND.STUDIO_ADDR}</strong>. O endereço exato chega junto com a confirmação.</span></p>
              ) : (
                <div className="space-y-4">
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche o endereço)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" aria-label="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Nº" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-sm text-red-700" role="alert">{errors.address}</p>}
                </div>
              )}

              <fieldset className="min-w-0">
                <legend className={labelCls}>Escolha o dia</legend>
                <div className="flex gap-3 overflow-x-auto py-2 snap-x hide-scrollbar -mx-6 px-6">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <label key={dateKey(d)} className={`${chipBase} !rounded-3xl shrink-0 snap-start w-[74px] py-3 flex-col ${sel ? chipOn : chipOff}`}>
                        <input type="radio" name="date" value={dateKey(d)} checked={sel} aria-label={d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          onChange={() => { set({ date: d, time: '' }); setBusy(null); }} className="sr-only" />
                        <span aria-hidden="true" className="text-xs font-semibold capitalize">{dayLabel(d, i)}</span>
                        <span aria-hidden="true" className="disp text-3xl">{d.getDate()}</span>
                        <span aria-hidden="true" className={`text-xs ${sel ? 'text-stone-300' : 'text-stone-600'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </label>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-sm text-red-700 mt-2" role="alert">{errors.date}</p>}
              </fieldset>

              {data.date && (
                <fieldset className="soft-in min-w-0">
                  <legend className="sr-only">Horário de início</legend>
                  <div className="flex justify-between items-baseline mb-3">
                    <span aria-hidden="true" className="text-sm font-medium text-slate-700">Horário de início</span>
                    <span className="text-xs text-stone-600" aria-live="polite">{busyLoading ? 'Verificando agenda…' : verified && availableCount > 0 && availableCount <= 3 ? `Restam ${availableCount} ${availableCount === 1 ? 'horário' : 'horários'} neste dia` : `Sessão de ${invoice.dur} min`}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const off = status !== 'ok' || busyLoading || (BACKEND_ON && busy === null);
                      return (
                        <label key={t} className={`${chipBase} py-3 ${sel ? chipOn : !off ? chipOff : 'bg-stone-100 border-stone-200 text-stone-500 line-through cursor-not-allowed'}`}>
                          <input type="radio" name="time" value={t} checked={sel} disabled={off} aria-label={`${t}${off ? ', indisponível' : ''}`} onChange={() => { vibrate(15); set({ time: t }); }} className="sr-only" />
                          <span aria-hidden="true" className="text-sm font-medium">{t}</span>
                        </label>
                      );
                    })}
                  </div>
                  {BACKEND_ON && busy === null && !busyLoading && <div className="text-sm text-amber-900 text-center py-5 space-y-3"><p>Não foi possível verificar a agenda agora. Por segurança, os horários ficam desativados até a verificação funcionar.</p><button type="button" onClick={() => setTick((v) => v + 1)} className={`${linkCls} min-h-[44px]`}>Tentar novamente</button></div>}
                  {!busyLoading && !(BACKEND_ON && busy === null) && availableCount === 0 && <p className="text-sm text-slate-700 text-center py-6">Sem horários livres neste dia. Que tal o dia seguinte?</p>}
                  {!BACKEND_ON && <p className="text-xs text-stone-600 mt-3">Disponibilidade demonstrativa: a reserva só vale depois da minha resposta no WhatsApp.</p>}
                  {data.time && <p className="text-sm text-teal-800 font-medium mt-4 flex items-center gap-2"><Icon name="check" size={16} /> Das {data.time} às {endTime}</p>}
                  {touched && errors.time && <p className="text-sm text-red-700 mt-2" role="alert">{errors.time}</p>}
                </fieldset>
              )}
            </div>

            <ActionBar>
              <button type="button" onClick={() => setStep(1)} className={`${btnGhost} px-5`}>Voltar</button>
              <button type="button" onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Complete os campos destacados'); } }} className={`${btnPrimary} flex-1`}>Ver resumo</button>
            </ActionBar>
          </div>
        )}

        {/* ---------- 3. RESUMO ---------- */}
        {step === 3 && (
          <div>
            <p className="text-sm text-teal-800 font-medium mb-2">Passo 3 de 3</p>
            <AnimTitle text={firstName ? `Tudo certo, ${firstName}?` : 'Tudo certo?'} className="text-5xl text-slate-900 mb-8" />
            <div className="space-y-8">
              <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-3">
                <Summary label="Serviço" value={pkg.title} />
                <Summary label="Dia" value={data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} />
                <Summary label="Horário" value={`${data.time} às ${endTime}`} />
                <Summary label="Local" value={isHome ? `${data.street}, ${data.number}` : `No espaço (${BRAND.STUDIO_ADDR})`} />
                <button type="button" onClick={() => setStep(2)} className={`${linkCls} text-sm min-h-[44px]`}>Alterar dia, horário ou local</button>
              </div>

              <div className="p-6 bg-white rounded-3xl border border-stone-200">
                <div className="space-y-4 mb-6">
                  <Summary label="Serviço" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <Summary label="Adicionais" value={`+${money(invoice.addonsTotal)}`} />}
                  {invoice.homeFee > 0 && <Summary label="Deslocamento" value={`+${money(invoice.homeFee)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm py-3 border-y border-stone-200 text-teal-800 font-medium">
                      <span className="flex items-center gap-2"><Icon name="check" size={16} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Desconto de primeira visita'}</span>
                      <span>-{money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm text-teal-800 font-medium"><span>Desconto Pix (3%)</span><span>-{money(invoice.pixDiscount)}</span></div>}
                </div>
                <div className="flex justify-between items-end pt-5 border-t border-stone-200">
                  <span className="text-sm text-slate-600">Total</span>
                  <span className="disp text-5xl text-slate-900">{money(invoice.total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-[#F7F9F8] rounded-2xl p-3"><p className="text-stone-600 text-xs">Sinal, após a confirmação</p><p className="font-semibold text-teal-800">{money(invoice.sinal)}</p></div>
                  <div className="bg-[#F7F9F8] rounded-2xl p-3"><p className="text-stone-600 text-xs">Depois da sessão</p><p className="font-semibold text-slate-900">{money(invoice.rest)}</p></div>
                </div>
              </div>

              <fieldset className="min-w-0">
                <legend className={labelCls}>Como prefere pagar o restante?</legend>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map(({ id, label }) => (
                    <label key={id} className={`${chipBase} text-xs font-semibold px-2 text-center ${data.payment === id ? chipOn : chipOff}`}>
                      <input type="radio" name="payment" value={id} checked={data.payment === id} onChange={() => { vibrate(15); set({ payment: id }); }} className="sr-only" />{label}
                    </label>
                  ))}
                </div>
                {data.payment === 'card' && <p className="text-xs text-stone-600 mt-3">Eventuais taxas do cartão são combinadas pelo WhatsApp antes do pagamento.</p>}
              </fieldset>

              <div>
                <label htmlFor="obs" className={labelCls}>Algo que eu deva saber? (opcional)</label>
                <input id="obs" type="text" placeholder="Ex.: lesão no ombro, prefiro pressão leve" maxLength={140} value={data.notes} onChange={(e) => set({ notes: e.target.value })} className={inputCls} />
                <p className="text-xs text-stone-600 mt-2 leading-relaxed">Segue só pelo WhatsApp, não fica salvo neste aparelho nem no sistema.</p>
              </div>

              {!coupon.applied && (
                <div>
                  <label htmlFor="cp" className={labelCls}>Tem um cupom?</label>
                  <div className="flex gap-2">
                    <input id="cp" type="text" autoCapitalize="characters" placeholder="Código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} aria-describedby={coupon.error ? 'cp-err' : undefined} className={`${inputCls} flex-1 uppercase ${coupon.error ? '!border-red-600' : ''}`} />
                    <button type="button" onClick={applyCoupon} className={btnGhost}>Aplicar</button>
                  </div>
                  {coupon.error && <p id="cp-err" className="text-sm text-red-700 mt-2" role="alert">{coupon.error}</p>}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                  <input id="age-ok" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-5 h-5 accent-teal-800 shrink-0 cursor-pointer" />
                  <p>
                    <label htmlFor="age-ok" className="cursor-pointer">Declaro ter 18 anos ou mais e li a </label>
                    <button type="button" onClick={() => setDoc('privacy')} className={`${linkCls} min-h-[24px]`}>Política de Privacidade</button>, os{' '}
                    <button type="button" onClick={() => setDoc('terms')} className={`${linkCls} min-h-[24px]`}>Termos</button> e o{' '}
                    <button type="button" onClick={() => setDoc('refund')} className={`${linkCls} min-h-[24px]`}>Cancelamento e reembolso</button>.
                  </p>
                </div>
                <label className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed cursor-pointer">
                  <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-5 h-5 accent-teal-800 shrink-0" />
                  <span>Opcional: quero receber lembretes e novidades pelo WhatsApp. Posso pedir para parar quando quiser.</span>
                </label>
              </div>

              <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl text-sm text-teal-900 leading-relaxed text-center">
                Nada é cobrado agora. Depois que eu confirmar o horário, você envia o sinal de <strong>{money(invoice.sinal)}</strong> via Pix e o restante é acertado depois da sessão.
                <button type="button" onClick={copyPix} className={`${linkCls} mt-3 mx-auto flex items-center gap-2 font-semibold min-h-[44px]`}><Icon name="copy" size={16} /> Copiar chave Pix ({CONFIG.PIX_LABEL})</button>
              </div>
            </div>

            <ActionBar>
              <button type="button" onClick={() => setStep(2)} className={`${btnGhost} px-5`}>Voltar</button>
              <button type="button" onClick={finishBooking} disabled={submitting || !data.payment || !ageOk} className={`${btnPrimary} flex-1 min-h-[56px] text-center`}>
                {submitting ? 'Preparando…' : !data.payment ? 'Escolha a forma de pagamento' : !ageOk ? 'Confirme que tem 18 anos ou mais' : 'Solicitar pelo WhatsApp'}
              </button>
            </ActionBar>
          </div>
        )}

        {/* ---------- 4. CONCLUÍDO ---------- */}
        {step === 4 && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-6 text-teal-800"><Icon name="check" size={30} /></div>
            <AnimTitle text="Solicitação enviada" className="text-5xl text-slate-900 mb-4" />
            <p className="text-sm text-slate-700 leading-relaxed mb-8 max-w-sm">
              O horário fica garantido depois da minha resposta no WhatsApp. Se a conversa não abriu, use o primeiro botão abaixo.<br /><br />
              <strong className="text-teal-800 font-semibold">Com o horário confirmado, envie o sinal de {money(invoice.sinal)} para fechar a reserva.</strong>
            </p>
            <div className="w-full max-w-xs space-y-3">
              <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} flex items-center justify-center w-full`}>Abrir conversa no WhatsApp</a>
              <button type="button" onClick={copyPix} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="copy" size={16} /> Copiar chave Pix</button>
              <button type="button" onClick={downloadICS} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="cal" size={16} /> Adicionar à agenda</button>
              <button type="button" onClick={resetFlow} className="w-full min-h-[48px] text-sm text-stone-600 hover:text-slate-900 underline underline-offset-4">Fazer outra reserva</button>
            </div>
          </div>
        )}
      </main>

      <LegalFooter onOpen={setDoc} onPrefs={() => setAskPrefs(true)} />
      {doc && <LegalModal doc={doc} onClose={() => setDoc(null)} />}
      {bannerOpen && <ConsentBanner onChoose={choose} onOpen={setDoc} />}
      {css}
    </div>
  );
}
