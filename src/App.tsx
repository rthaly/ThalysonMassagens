import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   DADOS E COMPONENTES LEGAIS
   ========================================================================== */
const LEGAL = {
  // Confirme se a razão social no cartão CNPJ é exatamente esta.
  RAZAO: 'Thalyson Rodrigo dos Santos',
  CNPJ: '62.922.530/0001-44',
  // Se quiser, acrescente o número: 'Avenida 9 de Julho, 0000, Bela Vista, São Paulo - SP'
  ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo - SP',
  EMAIL: 'relaxecomthalyson@gmail.com',
  ENCARREGADO: 'Thalyson Rodrigo dos Santos',
  EMAIL_DPO: 'relaxecomthalyson@gmail.com',
  ATUALIZADO: '01/01/2025',
  CANCEL_FREE_HOURS: 12,
};

type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
const CONSENT_KEY = 'thaly_consent_v1';

const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="text-stone-50 font-semibold mt-5 mb-2">{children}</h3>;

const DOCS: Record<DocId, { title: string; body: ReactNode }> = {
  privacy: {
    title: 'Política de Privacidade',
    body: (<>
      <P>Última atualização: {LEGAL.ATUALIZADO}. Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).</P>
      <H>1. Controlador</H>
      <P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}, {LEGAL.ENDERECO}. Contato: {LEGAL.EMAIL}. Encarregado (DPO): {LEGAL.ENCARREGADO}, {LEGAL.EMAIL_DPO}.</P>
      <H>2. Dados que coletamos e por quê</H>
      <P>Nome (como quer ser chamado), data, horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se escolher atendimento no seu endereço, para o deslocamento. Não pedimos CPF, e-mail, telefone nem data de nascimento no formulário; seu número aparece apenas na conversa de WhatsApp que você mesmo inicia.</P>
      <H>3. Dado sensível (vida sexual)</H>
      <P>O campo opcional de pedido específico pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos se você marcar o consentimento específico ao lado do campo, apenas para avaliar o pedido, e ele não é salvo neste aparelho nem registrado em banco de dados. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.</P>
      <H>4. Com quem os dados são compartilhados</H>
      <P>WhatsApp (Meta Platforms), para onde sua solicitação é enviada por você. ViaCEP, que recebe o CEP digitado para preencher o endereço. Se o sistema de agenda estiver ativo, o provedor de banco de dados que o hospeda (Supabase). Não vendemos dados.</P>
      <H>5. Armazenamento no seu aparelho</H>
      <P>Veja a seção Cookies e armazenamento local. Seus dados só ficam salvos no aparelho se você escolher “Lembrar meus dados”.</P>
      <H>6. Retenção</H>
      <P>Conversas de WhatsApp e registros de agendamento são mantidos pelo tempo necessário para a sessão, para o acerto financeiro e para cumprir obrigações legais, e depois eliminados. Dados fiscais seguem os prazos da lei.</P>
      <H>7. Seus direitos (art. 18)</H>
      <P>Confirmação do tratamento, acesso, correção, anonimização ou eliminação, portabilidade, informação sobre compartilhamento, revogação do consentimento e oposição. Peça pelo e-mail do encarregado; respondemos em prazo razoável. Você também pode reclamar à ANPD (gov.br/anpd).</P>
      <H>8. Menores</H>
      <P>O serviço é exclusivo para maiores de 18 anos. Não coletamos dados de menores intencionalmente.</P>
      <H>9. Segurança</H>
      <P>Usamos conexão HTTPS e limitamos os dados ao necessário. Nenhum sistema é totalmente invulnerável; em caso de incidente relevante, comunicaremos você e a ANPD conforme a lei.</P>
    </>),
  },
  terms: {
    title: 'Termos de Serviço',
    body: (<>
      <P>Última atualização: {LEGAL.ATUALIZADO}. Ao usar este site você declara que leu e concorda com estes termos.</P>
      <H>1. Prestador</H>
      <P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}, {LEGAL.ENDERECO}, {LEGAL.EMAIL}.</P>
      <H>2. Serviço</H>
      <P>Massagem e serviços de estética masculina, exclusivos para maiores de 18 anos, conforme o pacote escolhido. As descrições são informativas; massagem não substitui tratamento médico e não promete resultado de saúde.</P>
      <H>3. Solicitação e confirmação</H>
      <P>O site apenas registra uma solicitação. O horário só está garantido após a confirmação pelo WhatsApp e o pagamento do sinal. A disponibilidade mostrada pode ser demonstrativa.</P>
      <H>4. Preços e pagamento</H>
      <P>Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. Adicionais, taxa de horário de pico (atendimento no endereço do cliente) e pedido específico aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.</P>
      <H>5. Conduta</H>
      <P>Exige-se respeito mútuo. O terapeuta pode encerrar a sessão, sem devolução do valor dos serviços já prestados, em caso de desrespeito, assédio, uso de drogas, embriaguez evidente ou risco à segurança. Informe previamente condições de saúde, alergias e lesões.</P>
      <H>6. Lei aplicável</H>
      <P>Lei brasileira, incluindo o Código de Defesa do Consumidor. Foro do domicílio do consumidor.</P>
    </>),
  },
  refund: {
    title: 'Política de Cancelamento e Reembolso',
    body: (<>
      <P>Última atualização: {LEGAL.ATUALIZADO}. Estas regras valem sem prejuízo dos direitos do consumidor previstos em lei.</P>
      <H>1. Cancelamento pelo cliente</H>
      <P>Com pelo menos {LEGAL.CANCEL_FREE_HOURS} horas de antecedência: devolução integral do sinal via Pix ou remarcação sem custo. Com menos antecedência ou falta sem aviso: o sinal pode ser retido para cobrir o horário reservado, ou convertido em crédito, a critério do prestador.</P>
      <H>2. Arrependimento (art. 49 do CDC)</H>
      <P>Se a contratação for feita à distância, você pode se arrepender em até 7 dias da contratação e receber de volta o sinal, desde que a sessão ainda não tenha sido realizada. Para sessões agendadas dentro desse prazo, o direito vale até o momento da sessão.</P>
      <H>3. Cancelamento pelo prestador</H>
      <P>Se não puder atender, o sinal é devolvido integralmente ou a sessão é remarcada, conforme sua escolha.</P>
      <H>4. Como pedir</H>
      <P>Responda a conversa do WhatsApp ou escreva para {LEGAL.EMAIL}. O reembolso é feito pelo mesmo meio de pagamento em até 7 dias úteis.</P>
      <H>5. Pedido específico</H>
      <P>Se o pedido for considerado inviável, a taxa correspondente não é cobrada.</P>
    </>),
  },
  cookies: {
    title: 'Cookies e armazenamento local',
    body: (<>
      <P>Este site não usa cookies de publicidade nem ferramentas de análise ou rastreamento (como Google Analytics ou Meta Pixel).</P>
      <H>Estritamente necessário</H>
      <P>Guardamos no navegador (localStorage) a lembrança de que você já viu a tela inicial e de que já agendou antes (para não repetir o desconto de primeira sessão). Não identificam você.</P>
      <H>Opcional (com seu consentimento)</H>
      <P>“Lembrar meus dados” salva nome, tipo de local e endereço neste aparelho para agilizar um próximo agendamento. Você pode apagar tudo no botão “Apagar meus dados” do perfil ou alterar a escolha em “Preferências de privacidade” no rodapé.</P>
      <P>Se no futuro ativarmos qualquer ferramenta de análise ou marketing, ela só carregará depois do seu consentimento.</P>
    </>),
  },
};

function LegalModal({ doc, onClose }: { doc: DocId; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  // CORREÇÃO: onClose chega como função nova a cada render do App; guardá-la em ref evita
  // que o efeito rode de novo (e roube o foco) a cada atualização de tela.
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
  }, []);

  const d = DOCS[doc];
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-stone-950/90" onClick={() => closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(e) => e.stopPropagation()}
        className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center gap-4 p-5 border-b border-stone-700">
          <h2 id="legal-title" className="text-lg text-stone-50">{d.title}</h2>
          <button type="button" onClick={() => closeRef.current()} className="min-h-[44px] px-4 text-sm font-semibold rounded-xl border border-stone-600 text-stone-200 hover:bg-stone-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">Fechar</button>
        </div>
        <div className="p-5 overflow-y-auto text-sm text-stone-300 leading-relaxed" tabIndex={0}>{d.body}</div>
      </div>
    </div>
  );
}

function LegalFooter({ onOpen, onPrefs }: { onOpen: (d: DocId) => void; onPrefs: () => void }) {
  const link = 'underline underline-offset-4 min-h-[44px] inline-flex items-center px-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 rounded';
  return (
    <footer className="px-6 max-w-lg mx-auto mt-12 pt-6 border-t border-stone-800 text-xs text-stone-400 leading-relaxed text-center">
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
  const b = 'min-h-[48px] px-5 text-sm font-semibold rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400';
  return (
    <section aria-label="Preferências de privacidade" className="fixed bottom-0 inset-x-0 z-[120] bg-stone-900 border-t border-stone-600 p-5">
      <div className="max-w-lg mx-auto">
        <p className="text-sm text-stone-200 leading-relaxed mb-4">
          Não usamos rastreadores nem anúncios. Podemos lembrar seu nome e endereço neste aparelho para agilizar a próxima reserva. Você decide (os dois botões têm o mesmo destaque).{' '}
          <button type="button" className="underline underline-offset-4 min-h-[44px]" onClick={() => onOpen('cookies')}>Saiba mais</button>
        </p>
        <div className="flex gap-3">
          <button type="button" className={`${b} flex-1 bg-stone-100 text-stone-950`} onClick={() => onChoose('min')}>Só o necessário</button>
          <button type="button" className={`${b} flex-1 bg-stone-100 text-stone-950`} onClick={() => onChoose('remember')}>Lembrar meus dados</button>
        </div>
      </div>
    </section>
  );
}

/* ==========================================================================
   CONFIGURAÇÃO PRINCIPAL DO APP
   ========================================================================== */
// CORREÇÃO: leitura segura. Se o projeto não for Vite, não derruba o app.
let ENV: Record<string, string | undefined> = {};
try { ENV = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {}; } catch { ENV = {}; }

const CONFIG = {
  PHONE: '5517991360413',
  PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp',
  REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  // Arquivo em public/. A barra inicial garante que carregue em qualquer rota.
  AVATAR: '/thalyson.jpg',
  SUPABASE_URL: ENV.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: ENV.VITE_SUPABASE_ANON_KEY || ENV.VITE_SUPABASE_PUBLISHABLE_KEY || '',
  COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  SIGNAL_AMOUNT: 40,
  FIRST_TIME_DISCOUNT: 15,
  FETISH_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISCOUNT: 0.03,
  OPEN_MIN: 9 * 60,
  LAST_END_MIN: 23 * 60 + 30,
  SLOT_STEP: 60,
  BUFFER_STUDIO: 15,
  BUFFER_HOME: 60,
  MIN_LEAD_STUDIO: 30,
  MIN_LEAD_HOME: 60,
  DAYS_AHEAD: 14,
  DAYS_OFF: [] as number[],
  BLOCKED: {} as Record<string, string[]>,
};

const PACKAGES = [
  { id: 'classica', title: 'Massagem Clássica', price: 180, min: 40, tags: ['Apenas Mãos', 'Sem Toque Íntimo'],
    desc: 'O essencial para quem está com o corpo cansado da rotina. Uso a força das minhas mãos para trabalhar a tensão e soltar sua musculatura, com foco no relaxamento.' },
  { id: 'sensitiva', title: 'Sensitiva & Prazer', price: 220, min: 60, tags: ['Toques Leves', 'Finalização Íntima'],
    desc: 'Começamos com a massagem clássica para relaxar o corpo. Quando você estiver à vontade, os toques mudam, ficam mais leves e encerramos com a massagem íntima.' },
  { id: 'fusion', title: 'Sensações com a Barba', price: 290, min: 60, tags: ['Naturista', 'Uso de Barba'],
    desc: 'Ficamos totalmente à vontade. Primeiro a massagem clássica, depois uso minha barba em algumas partes do seu corpo e encerramos com a massagem íntima.' },
  { id: 'completa', title: 'Massagem Corpo a Corpo & Interação', price: 390, min: 60, tags: ['Gel Nuru', 'A Sua Vez de Tocar'],
    desc: 'O pacote sem barreiras. Primeiro a massagem clássica, depois proximidade física com gel corpo a corpo e liberdade para você fazer massagem em mim, e encerramos com a massagem íntima.' },
  { id: 'aparo_solo', title: 'Apenas Depilação (Máquina)', price: 130, min: 40, tags: ['Estética', 'Sem Massagem'],
    desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares), pente 1 e 3, utilizando máquina.' },
];

const ADDONS = [
  { id: 'time', label: '+30 minutos extras', price: 75 },
  { id: 'aparo', label: 'Aparar Pelos até 3 lugares (Máquina)', price: 130 },
];

const LOC_TYPES = [
  { id: 'studio', label: 'No meu espaço' },
  { id: 'home', label: 'Vou até você' },
] as const;

const PAYMENT_METHODS = [
  { id: 'pix', label: 'Pix (-3%)' },
  { id: 'card', label: 'Cartão até 12x (Consultar)' },
  { id: 'cash', label: 'Dinheiro' },
] as const;

const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

/* ==========================================================================
   UTILITÁRIOS GERAIS
   ========================================================================== */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch (e) {} },
};
const BACKEND_ON = !!(CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY);

async function rpc<T>(fn: string, args: Record<string, unknown>): Promise<{ ok: boolean; data: T | null }> {
  if (!BACKEND_ON) return { ok: false, data: null };
  try {
    const r = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: CONFIG.SUPABASE_ANON_KEY, Authorization: `Bearer ${CONFIG.SUPABASE_ANON_KEY}` },
      body: JSON.stringify(args),
    });
    if (!r.ok) return { ok: false, data: null };
    return { ok: true, data: (await r.json()) as T };
  } catch { return { ok: false, data: null }; }
}

const clientId = () => {
  let id = store.get('thaly_cid');
  if (!id || id.length < 8) {
    id = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    store.set('thaly_cid', id);
  }
  return id;
};

const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();

async function lookupCoupon(code: string): Promise<{ ok: boolean; value: number }> {
  if (!BACKEND_ON) return { ok: true, value: CONFIG.COUPONS[code] || 0 };
  const r = await rpc<number | null>('check_coupon_thalyson', { p_code: code });
  return { ok: r.ok, value: typeof r.data === 'number' ? r.data : 0 };
}

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

// Foto com plano B: se o arquivo não existir, mostra um círculo com a inicial em vez de imagem quebrada.
function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} bg-stone-700 text-stone-100 inline-flex items-center justify-center font-semibold`}>T</span>;
  return <img src={CONFIG.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

const inputCls = 'w-full bg-stone-900 border border-stone-700 rounded-2xl px-5 min-h-[52px] text-base text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 transition-colors disabled:opacity-50';
const labelCls = 'block text-xs font-semibold text-stone-300 mb-3';
const chipBase = 'min-h-[52px] border rounded-2xl transition-colors flex items-center justify-center relative focus-within:ring-2 focus-within:ring-amber-400 focus-within:ring-offset-2 focus-within:ring-offset-stone-950';
const chipOn = 'bg-stone-100 text-stone-950 border-stone-100 font-semibold cursor-pointer';
const chipOff = 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800 cursor-pointer';
const btnPrimary = 'min-h-[52px] px-6 text-sm font-bold rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 disabled:bg-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed';
const btnGhost = 'min-h-[52px] px-5 text-sm font-semibold rounded-xl border border-stone-600 text-stone-200 hover:bg-stone-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400';

/* ==========================================================================
   APP PRINCIPAL
   ========================================================================== */
type SlotStatus = 'ok' | 'past' | 'blocked';
interface BookingData {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

// CORREÇÃO: definido fora do App. Antes ele era recriado a cada render.
const Summary = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm"><span className="text-stone-400">{label}</span><span className="text-stone-100 font-medium text-right">{value}</span></div>
);

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
  const profileRef = useRef<HTMLDivElement>(null);

  const [doc, setDoc] = useState<DocId | null>(null);
  const [consent, setConsent] = useState<string | null>(() => store.get(CONSENT_KEY));
  const [askPrefs, setAskPrefs] = useState(false);
  const [ageOk, setAgeOk] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const remember = consent === 'remember';
  const bannerOpen = consent === null || askPrefs;

  const [data, setData] = useState<BookingData>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: PACKAGES[0].id, addons: {},
  });
  const set = (patch: Partial<BookingData>) => setData((p) => ({ ...p, ...patch }));

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };

  const choose = (c: 'min' | 'remember') => {
    store.set(CONSENT_KEY, c); setConsent(c); setAskPrefs(false);
    if (c === 'min') store.del('thaly_draft_booking');
  };

  useEffect(() => { const t = setTimeout(() => setIsLoading(false), 900); return () => clearTimeout(t); }, []);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (store.get('thaly_onboard_final') === 'yes') { setStep(1); setAgeOk(true); }
    if (store.get('thaly_returning_final') === 'yes') setIsReturning(true);
    const draft = store.get(CONSENT_KEY) === 'remember' ? store.get('thaly_draft_booking') : null;
    if (draft) {
      try {
        const d = JSON.parse(draft);
        setData((p) => ({ ...p, name: d.name || '', locType: d.locType || 'studio', street: d.street || '', number: d.number || '', bairro: d.bairro || '' }));
      } catch (e) {}
    }
  }, [isLoading]);

  useEffect(() => {
    if (remember && data.name.length > 2) {
      store.set('thaly_draft_booking', JSON.stringify({ name: data.name, locType: data.locType, street: data.street, number: data.number, bairro: data.bairro }));
    }
  }, [remember, data.name, data.locType, data.street, data.number, data.bairro]);

  useEffect(() => { if (step > 0) window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const prevFocus = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setProfileOpen(false); return; }
      if (e.key !== 'Tab' || !profileRef.current) return;
      const f = profileRef.current.querySelectorAll<HTMLElement>('button, a[href]');
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; prevFocus?.focus(); };
  }, [profileOpen]);

  useEffect(() => {
    if (data.packageId === 'aparo_solo' && data.addons.aparo) set({ addons: { ...data.addons, aparo: false } });
  }, [data.packageId, data.addons.aparo]);

  const [busy, setBusy] = useState<{ s: number; e: number }[] | null>(null);
  const [busyLoading, setBusyLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [hp, setHp] = useState('');
  const [optIn, setOptIn] = useState(false);
  const lockRef = useRef({ fails: 0, until: 0 });

  useEffect(() => {
    if (!data.date) return undefined;
    let off = false;
    setBusyLoading(true);
    rpc<{ s: number; e: number }[]>('get_busy_thalyson', { p_date: dateKey(data.date) })
      .then((r) => { if (!off) setBusy(r.ok ? r.data : null); })
      .finally(() => { if (!off) setBusyLoading(false); });
    return () => { off = true; };
  }, [data.date, tick]);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const isHome = data.locType === 'home';
  const hasReq = reqOk && data.req.trim().length > 3;

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const activeAddons: typeof ADDONS = [];
    ADDONS.forEach((a) => {
      if (data.addons[a.id]) { addonsTotal += a.price; activeAddons.push(a); if (a.id === 'time') dur += 30; }
    });
    const reqFee = hasReq ? CONFIG.FETISH_FEE : 0;
    const base = pkg.price + addonsTotal + reqFee;
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
    return { base: pkg.price, addonsTotal, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, activeAddons };
  }, [data, pkg, isHome, isReturning, coupon.applied, coupon.value, hasReq]);

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
    const blocked = (CONFIG.BLOCKED[dateKey(data.date)] || []).map(toMin);
    const out: { t: string; status: SlotStatus }[] = [];

    for (let m = CONFIG.OPEN_MIN; m + invoice.dur <= CONFIG.LAST_END_MIN; m += CONFIG.SLOT_STEP) {
      const end = m + invoice.dur + buffer;
      let status: SlotStatus = 'ok';
      if (today && m < nowMin + lead) status = 'past';
      else if (blocked.some((b) => b < end && b + CONFIG.SLOT_STEP > m)) status = 'blocked';
      else if ((busy || []).some((x) => x.s < end && (x.e + buffer) > m)) status = 'blocked';
      out.push({ t: fromMin(m), status });
    }
    return out;
  }, [data.date, isHome, invoice.dur, now, busy]);

  useEffect(() => {
    if (!busyLoading && data.time && !slots.some((s) => s.t === data.time && s.status === 'ok')) {
      set({ time: '' });
    }
  }, [slots, busyLoading, data.time]);

  const availableCount = slots.filter((s) => s.status === 'ok').length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  const errors = {
    name: data.name.trim().length < 3 ? 'Informe seu nome (mín. 3 letras).' : '',
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
    store.del('thaly_draft_booking'); store.del('thaly_cid'); store.del(CONSENT_KEY);
    setConsent(null);
    set({ name: '', cep: '', street: '', number: '', comp: '', bairro: '', req: '' });
    setReqOk(false);
    showToast('Dados apagados deste aparelho');
  };

  const copyPix = async () => {
    const ok = await copyText(CONFIG.PIX_KEY);
    showToast(ok ? 'Chave Pix (CNPJ) copiada' : `Chave Pix: ${CONFIG.PIX_KEY}`);
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

  const whatsappLink = (bookingCode = '') => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc;
    if (!isHome) loc = '📍 *Local:* Atendimento no meu espaço, região da Bela Vista/Centro Histórico. O endereço exato será enviado após a confirmação.';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, São Paulo`;
      loc = `📍 *Local:* Atendimento no seu endereço.\n*Endereço informado:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }

    let t = `Oi Thalyson! Fechei pelo site e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    if (bookingCode) t += `*CÓDIGO DA SOLICITAÇÃO:* ${bookingCode}\n`;
    t += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;

    t += `*PACOTE (${invoice.dur} min):*\n✅ ${pkg.title}\n`;
    invoice.activeAddons.forEach((a) => (t += `➕ ${a.label}\n`));
    if (hasReq) t += `\n*VONTADE ESPECÍFICA (consentimento dado no site):* "${clean(data.req)}"\n`;

    t += `\n*RESUMO DO PAGAMENTO:*\n*Valor Total:* ${money(invoice.total)} (${data.payment.toUpperCase()})\n`;
    t += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n\n`;
    t += '✅ Declaro ter 18 anos ou mais e ter lido a Política de Privacidade, os Termos e a Política de Cancelamento.\n';
    if (optIn) t += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n';
    t += '\n🎁 *Para a próxima:* tenho direito ao cupom SESSAO2 no meu próximo agendamento.\n\n';
    t += 'Aguardo sua resposta para mandar o comprovante do sinal!';

    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(t)}`;
  };

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, m: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(m).replace(':', '')}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); // UTC, formato correto
    const s = toMin(data.time);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thalyson//Agenda//PT', 'BEGIN:VEVENT',
      `UID:${Date.now()}@thalyson`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`,
      `SUMMARY:${pkg.title} - Thalyson`, `DESCRIPTION:Sinal de ${money(invoice.sinal)} via Pix para confirmar.`,
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'sessao.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a); // necessário em alguns navegadores
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const finishBooking = async () => {
    if (!data.payment) { vibrate(50); showToast('Escolha a forma de pagamento'); return; }
    if (submitting || !data.date || !data.time) return;
    if (BACKEND_ON && (busyLoading || busy === null)) {
      showToast('Ainda não consegui verificar os horários. Tente novamente.');
      return;
    }
    setSubmitting(true);

    if (hp) {
      setSubmitting(false);
      setSentLink('#');
      setStep(4);
      return;
    }

    const w = window.open('', '_blank');
    let bookingCode = '';

    if (BACKEND_ON) {
      const r = await rpc<{ ok: boolean; error?: string; booking_code?: string }>('book_slot_thalyson', {
        p_date: dateKey(data.date),
        p_start_minute: toMin(data.time),
        p_service_id: pkg.id,
        p_duration: invoice.dur,
        p_customer_name: data.name.trim(),
        p_client_key: clientId(),
        p_total: Number(invoice.total.toFixed(2)),
        p_signal: Number(invoice.sinal.toFixed(2)),
        p_remaining: Number(invoice.rest.toFixed(2)),
        p_is_home: isHome,
      });

      if (!r.ok || !r.data) {
        w?.close();
        setSubmitting(false);
        showToast('Não consegui registrar no banco. Nada foi reservado. Tente novamente em instantes.');
        return;
      }

      if (!r.data.ok) {
        const err = r.data.error;
        w?.close(); setSubmitting(false); vibrate(50);
        showToast(err === 'taken' ? 'Esse horário acabou de ser ocupado. Escolha outro.'
          : err === 'limit' ? 'Você já tem solicitações aguardando confirmação.'
          : err === 'pending_limit' ? 'Você já tem solicitações pendentes. Aguarde a confirmação.'
          : err === 'busy_system' ? 'Muitas solicitações pendentes agora. Tente em alguns minutos.'
          : err === 'outside_hours' ? 'Esse horário está fora do período de atendimento.'
          : err === 'past' ? 'Esse horário já passou ou está muito próximo. Escolha outro.'
          : err === 'invalid_service' ? 'O pacote não está cadastrado no banco. Avise o suporte antes de tentar reservar.'
          : 'Não foi possível registrar a solicitação. Revise os dados e tente novamente.');
        setTick((t) => t + 1); set({ time: '' }); setStep(2); return;
      }
      bookingCode = r.data.booking_code || '';
    }

    const link = whatsappLink(bookingCode);
    store.set('thaly_returning_final', 'yes'); store.del('thaly_draft_booking');
    setSentLink(link); vibrate([30, 50]);
    if (w) { w.opener = null; w.location.href = link; }
    else window.location.href = link;
    setSubmitting(false); setStep(4);
    if (!BACKEND_ON) showToast('Solicitação enviada. Sem o banco conectado, o horário precisa ser confirmado manualmente pelo WhatsApp.');
  };

  const resetFlow = () => {
    vibrate(15); setTouched(false); setReqOk(false);
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
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center px-6" role="status" aria-live="polite">
        <h1 className="text-sm text-stone-300 tracking-[0.25em] uppercase mb-8 text-center">Escolha, agende e relaxe</h1>
        <div className="w-40 h-0.5 bg-stone-800 rounded-full overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-1/3 bg-stone-300 load-bar rounded-full" />
        </div>
        {css}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-200 font-sans selection:bg-amber-500/30 relative ${bannerOpen ? 'pb-56' : 'pb-12'}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:bg-stone-100 focus:text-stone-950 focus:px-4 focus:py-3 focus:rounded-xl">Pular para o conteúdo</a>

      {toast && (
        <div role="status" aria-live="polite" className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-stone-100 text-stone-900 px-6 py-3 rounded-full font-medium text-sm shadow-xl fade-up max-w-[90vw] text-center">{toast}</div>
      )}

      {profileOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-stone-950/85 backdrop-blur-sm" onClick={() => setProfileOpen(false)}>
          <div ref={profileRef} role="dialog" aria-modal="true" aria-label="Perfil" className="bg-stone-900 border border-stone-700 rounded-3xl w-full max-w-sm p-8 relative shadow-2xl fade-up max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Fechar perfil" autoFocus onClick={() => setProfileOpen(false)} className="absolute top-4 right-4 p-3 text-stone-400 hover:text-white rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"><Icon name="close" /></button>
            <div className="mb-6"><Avatar className="w-20 h-20 rounded-full" alt="Foto de Thalyson, terapeuta" /></div>
            <h2 className="text-2xl font-light text-stone-50 mb-1">Thalyson Massagens, SP Bela Vista</h2>
            <p className="text-amber-400 text-xs font-semibold mb-6">Terapeuta masculino</p>
            <div className="space-y-4 text-sm text-stone-300 leading-relaxed mb-8">
              <p>{greeting}. Meu trabalho é direto e focado no corpo masculino: usar o toque para aliviar o peso e a tensão da sua rotina.</p>
              <p className="flex items-start gap-3 bg-stone-950 p-4 rounded-2xl"><Icon name="map" size={18} className="mt-0.5 text-stone-400" /><span>Atendo em uma suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.</span></p>
            </div>
            <button type="button" onClick={forgetMe} className="w-full text-xs text-stone-400 hover:text-stone-200 underline underline-offset-4 min-h-[44px] mb-4">Apagar meus dados deste aparelho</button>
            <div className="pt-6 border-t border-stone-700 flex justify-center gap-6">
              <a href={CONFIG.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white min-h-[44px]"><Icon name="instagram" size={18} /> Instagram</a>
              <a href={CONFIG.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-300 hover:text-white min-h-[44px]"><Icon name="star" size={18} /> Avaliações</a>
            </div>
          </div>
        </div>
      )}

      {step > 0 && (
        <header className="px-6 py-4 max-w-lg mx-auto flex justify-between items-center mb-6 sticky top-0 bg-stone-950/95 backdrop-blur-md z-40 border-b border-stone-800">
          <button type="button" onClick={() => { vibrate(10); setProfileOpen(true); }} className="flex items-center gap-3 text-left rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400">
            <Avatar className="w-10 h-10 rounded-full" alt="" />
            <span><span className="block text-sm font-medium text-stone-100">Thalyson Massagens</span><span className="block text-xs text-stone-400">Ver perfil</span></span>
          </button>
          <div className="flex gap-2" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={Math.min(step, 3)} aria-label={`Passo ${Math.min(step, 3)} de 3`}>
            {[1, 2, 3].map((i) => <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-6 bg-amber-400' : 'w-2 bg-stone-700'}`} />)}
          </div>
        </header>
      )}

      <main id="main" tabIndex={-1} className="px-6 max-w-lg mx-auto outline-none">
        {step === 0 && (
          <div className="flex flex-col justify-center min-h-[85vh] fade-up">
            <h1 className="text-4xl md:text-5xl font-light mb-12 leading-tight text-stone-50">O seu momento<br /><span className="text-stone-300">de pausa.</span></h1>
            <div className="space-y-4 mb-8">
              <div className="flex gap-4 p-6 bg-stone-900 rounded-3xl border border-stone-800"><Icon name="shield" className="text-amber-400 mt-0.5" size={22} /><p className="text-stone-300 text-sm leading-relaxed">{BACKEND_ON ? 'Privacidade e respeito. Os dados necessários (nome, data, horário e pacote) são enviados ao sistema de agenda para verificar e solicitar a reserva; ao concluir, os detalhes seguem para o WhatsApp.' : 'Privacidade e respeito. Os seus dados só saem deste aparelho quando você enviar a solicitação pelo WhatsApp.'}</p></div>
              <div className="flex gap-4 p-6 bg-stone-900 rounded-3xl border border-stone-800"><Icon name="lock" className="text-amber-400 mt-0.5" size={22} /><p className="text-stone-300 text-sm leading-relaxed">Atendimento estritamente para maiores de 18 anos, focado no relaxamento do corpo masculino.</p></div>
            </div>
            <div className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed mb-6">
              <input id="age-ok" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-400 shrink-0 cursor-pointer" />
              <p>
                <label htmlFor="age-ok" className="cursor-pointer">Declaro ter 18 anos ou mais e li a </label>
                <button type="button" onClick={() => setDoc('privacy')} className="underline underline-offset-4 text-amber-300 min-h-[24px]">Política de Privacidade</button>, os{' '}
                <button type="button" onClick={() => setDoc('terms')} className="underline underline-offset-4 text-amber-300 min-h-[24px]">Termos</button> e a{' '}
                <button type="button" onClick={() => setDoc('refund')} className="underline underline-offset-4 text-amber-300 min-h-[24px]">Política de Cancelamento</button>.
              </p>
            </div>
            <button type="button" disabled={!ageOk} onClick={() => { vibrate(30); store.set('thaly_onboard_final', 'yes'); setStep(1); }} className="bg-stone-100 text-stone-950 min-h-[60px] w-full text-sm font-bold rounded-2xl active:scale-[0.98] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:outline-offset-2 disabled:bg-stone-800 disabled:text-stone-400 disabled:cursor-not-allowed">Iniciar agendamento</button>
          </div>
        )}

        {step === 1 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 1 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Escolha o seu pacote</h1>

            {!isReturning && (
              <div className="bg-amber-900/20 border border-amber-500/30 p-5 rounded-3xl mb-8 flex items-start gap-4">
                <Icon name="star" className="text-amber-400 mt-0.5 shrink-0" size={22} />
                <p className="text-sm text-stone-200 leading-relaxed">Primeira vez por aqui? Um desconto de <strong className="text-amber-400">R$ {CONFIG.FIRST_TIME_DISCOUNT}</strong> será aplicado automaticamente no final.</p>
              </div>
            )}

            <fieldset className="space-y-4 min-w-0">
              <legend className="sr-only">Pacotes disponíveis</legend>
              {PACKAGES.map((p) => {
                const on = data.packageId === p.id;
                return (
                  <label key={p.id} className={`block w-full text-left p-6 rounded-3xl transition-all border cursor-pointer focus-within:ring-2 focus-within:ring-amber-400 ${on ? 'bg-stone-900 border-amber-400 shadow-lg' : 'bg-stone-950 border-stone-700 hover:bg-stone-900'}`}>
                    <input type="radio" name="package" value={p.id} checked={on} onChange={() => { vibrate(15); set({ packageId: p.id }); }} className="sr-only" />
                    <span className="flex justify-between items-start gap-4 mb-4">
                      <span className={`font-medium text-lg ${on ? 'text-stone-50' : 'text-stone-200'}`}>{p.title}</span>
                      <span className={`font-semibold text-lg shrink-0 ${on ? 'text-amber-300' : 'text-stone-200'}`}>{money(p.price)}</span>
                    </span>
                    <span className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-md bg-stone-800 text-stone-200 inline-flex items-center gap-1"><Icon name="clock" size={12} /> {p.min} min</span>
                      {p.tags.map((t) => <span key={t} className="text-xs font-medium px-3 py-1.5 rounded-md bg-stone-800 text-stone-300">{t}</span>)}
                    </span>
                    <span className="block text-sm leading-relaxed text-stone-300">{p.desc}</span>
                  </label>
                );
              })}
            </fieldset>

            <div className="pt-6">
              <h2 className="text-sm font-semibold text-stone-200 mb-4">Adicionais</h2>
              <fieldset className="flex flex-col gap-3 min-w-0">
                <legend className="sr-only">Serviços adicionais</legend>
                {ADDONS.filter((a) => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                  const on = !!data.addons[a.id];
                  return (
                    <label key={a.id} className={`w-full p-5 text-sm rounded-2xl border flex justify-between items-center gap-3 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-amber-400 ${on ? 'bg-stone-800 border-amber-400 text-stone-50' : 'bg-stone-950 border-stone-700 text-stone-300 hover:bg-stone-900'}`}>
                      <input type="checkbox" checked={on} onChange={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                      <span className="flex items-center gap-3"><span aria-hidden="true" className={`w-5 h-5 rounded-md border flex items-center justify-center ${on ? 'bg-amber-400 border-amber-400 text-stone-950' : 'border-stone-500'}`}>{on && <Icon name="check" size={14} />}</span>{a.label}</span>
                      <span className="font-medium">+ {money(a.price)}</span>
                    </label>
                  );
                })}
              </fieldset>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800 flex gap-6 items-center">
              <div className="flex-1"><p className="text-xs text-stone-400">Duração: {invoice.dur} min</p><p className="text-2xl font-light text-stone-50">{money(invoice.base + invoice.addonsTotal)}</p></div>
              <button type="button" onClick={() => { vibrate(30); setStep(2); }} className={btnPrimary}>Continuar</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 2 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Agendamento</h1>
            <div className="space-y-9">
              <div>
                <label htmlFor="nm" className={labelCls}>Como devo te chamar?</label>
                <input id="nm" autoComplete="given-name" type="text" value={data.name} onChange={(e) => set({ name: e.target.value })} className={inputCls} placeholder="Seu nome" maxLength={60} aria-invalid={touched && !!errors.name} aria-describedby={touched && errors.name ? 'nm-err' : undefined} />
                {touched && errors.name && <p id="nm-err" className="text-sm text-red-300 mt-2" role="alert">{errors.name}</p>}
                <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              </div>

              <fieldset className="min-w-0">
                <legend className={labelCls}>Local da sessão</legend>
                <div className="grid grid-cols-2 gap-3">
                  {LOC_TYPES.map(({ id, label }) => (
                    <label key={id} className={`${chipBase} text-sm px-3 ${data.locType === id ? chipOn : chipOff}`}>
                      <input type="radio" name="location" value={id} checked={data.locType === id} onChange={() => set({ locType: id })} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
                {isHome && <p className="text-xs text-stone-400 mt-3">Horários de pico no seu endereço têm taxa de {money(CONFIG.PEAK_FEE)}. Pedimos mais antecedência para o deslocamento. O endereço é usado apenas para esta solicitação e o CEP é consultado no serviço ViaCEP.</p>}
              </fieldset>

              {!isHome ? (
                <p className="text-sm text-stone-300 bg-stone-900 p-6 rounded-3xl border border-stone-700 leading-relaxed">
                  A suíte fica no <strong className="text-stone-50">Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú)</strong>. O endereço exato é enviado junto com a confirmação.
                </p>
              ) : (
                <div className="space-y-4 fade-up">
                  <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder="CEP (preenche o endereço)" aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={inputCls} />
                  <input type="text" autoComplete="street-address" placeholder="Rua ou Avenida" aria-label="Rua ou Avenida" maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={inputCls} />
                  <div className="flex gap-3">
                    <input ref={numberRef} type="text" inputMode="numeric" placeholder="Nº" aria-label="Número" maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={`${inputCls} w-1/3`} />
                    <input type="text" placeholder="Complemento" aria-label="Complemento" maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={`${inputCls} w-2/3`} />
                  </div>
                  <input type="text" placeholder="Bairro" aria-label="Bairro" maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={inputCls} />
                  {touched && errors.address && <p className="text-sm text-red-300" role="alert">{errors.address}</p>}
                </div>
              )}

              <fieldset className="min-w-0">
                <legend className={labelCls}>Data</legend>
                <div className="flex gap-3 overflow-x-auto py-2 snap-x hide-scrollbar -mx-6 px-6">
                  {days.map(({ d, i }) => {
                    const sel = sameDay(data.date, d);
                    return (
                      <label key={dateKey(d)} className={`${chipBase} shrink-0 snap-start w-[74px] py-3 flex-col ${sel ? chipOn : chipOff}`}>
                        <input type="radio" name="date" value={dateKey(d)} checked={sel}
                          aria-label={d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          onChange={() => { set({ date: d, time: '' }); setBusy(null); }} className="sr-only" />
                        <span aria-hidden="true" className="text-xs font-semibold capitalize">{dayLabel(d, i)}</span>
                        <span aria-hidden="true" className="text-2xl font-light">{d.getDate()}</span>
                        <span aria-hidden="true" className={`text-xs ${sel ? 'text-stone-600' : 'text-stone-400'}`}>{d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </label>
                    );
                  })}
                </div>
                {touched && errors.date && <p className="text-sm text-red-300 mt-2" role="alert">{errors.date}</p>}
              </fieldset>

              {data.date && (
                <fieldset className="fade-up min-w-0">
                  <legend className="sr-only">Horário de início</legend>
                  <div className="flex justify-between items-baseline mb-3">
                    <span aria-hidden="true" className="text-xs font-semibold text-stone-300">Horário de início</span>
                    <span className="text-xs text-stone-400" aria-live="polite">{busyLoading ? 'Verificando agenda…' : `Sessão de ${invoice.dur} min`}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {slots.map(({ t, status }) => {
                      const sel = data.time === t;
                      const ok = status === 'ok';
                      const peak = isHome && PEAK_HOURS.includes(t);
                      const off = !ok || busyLoading || (BACKEND_ON && busy === null);
                      return (
                        <label key={t} className={`${chipBase} py-3 flex-col ${sel ? chipOn : !off ? chipOff : 'bg-stone-950 border-stone-800 text-stone-500 line-through cursor-not-allowed'}`}>
                          <input type="radio" name="time" value={t} checked={sel} disabled={off}
                            aria-label={`${t}${off ? ', indisponível' : ''}${peak ? ', horário de pico' : ''}`}
                            onChange={() => { vibrate(15); set({ time: t }); }} className="sr-only" />
                          <span aria-hidden="true" className="text-sm font-medium">{t}</span>
                          {peak && ok && <span aria-hidden="true" className={`text-[11px] font-semibold ${sel ? 'text-amber-800' : 'text-amber-400'}`}>Pico +{money(CONFIG.PEAK_FEE).replace(',00', '')}</span>}
                        </label>
                      );
                    })}
                  </div>
                  {BACKEND_ON && busy === null && !busyLoading && <div className="text-sm text-amber-200 text-center py-5 space-y-3"><p>Não foi possível verificar a agenda agora. Por segurança, os horários ficam desativados até a verificação funcionar.</p><button type="button" onClick={() => setTick((v) => v + 1)} className="underline underline-offset-4 min-h-[44px]">Tentar novamente</button></div>}
                  {!busyLoading && !(BACKEND_ON && busy === null) && availableCount === 0 && <p className="text-sm text-stone-300 text-center py-6">Sem horários livres neste dia. Tente outra data.</p>}
                  {!BACKEND_ON && <p className="text-xs text-stone-400 mt-3">Disponibilidade demonstrativa: a reserva só será confirmada após resposta pelo WhatsApp.</p>}
                  {data.time && <p className="text-sm text-emerald-300 mt-4 flex items-center gap-2"><Icon name="check" size={16} /> Das {data.time} às {endTime}</p>}
                  {touched && errors.time && <p className="text-sm text-red-300 mt-2" role="alert">{errors.time}</p>}
                </fieldset>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className={`${btnGhost} w-1/3`}>Voltar</button>
              <button type="button" onClick={() => { if (step2Valid) { vibrate(30); setStep(3); } else { vibrate(50); setTouched(true); showToast('Complete os campos destacados'); } }} className={`${btnPrimary} flex-1`}>Revisar</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="fade-up">
            <p className="text-xs font-semibold text-amber-400 mb-2">Passo 3 de 3</p>
            <h1 className="text-3xl font-light mb-8 text-stone-50">Resumo</h1>
            <div className="space-y-8">
              <div className="p-6 bg-stone-900 rounded-3xl border border-stone-700 space-y-3">
                <Summary label="Pacote" value={pkg.title} />
                <Summary label="Data" value={data.date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })} />
                <Summary label="Horário" value={`${data.time} – ${endTime}`} />
                <Summary label="Local" value={isHome ? `${data.street}, ${data.number}` : 'No espaço (Bela Vista)'} />
                <button type="button" onClick={() => setStep(2)} className="text-sm text-amber-300 underline underline-offset-4 min-h-[44px]">Alterar data, horário ou local</button>
              </div>

              <div className="p-6 bg-stone-900 rounded-3xl border border-stone-700">
                <div className="space-y-4 mb-6">
                  <Summary label="Pacote escolhido" value={money(invoice.base)} />
                  {invoice.addonsTotal > 0 && <Summary label="Adicionais" value={`+${money(invoice.addonsTotal)}`} />}
                  {invoice.reqFee > 0 && <Summary label="Pedido específico" value={`+${money(invoice.reqFee)}`} />}
                  {invoice.discount > 0 && (
                    <div className="flex justify-between text-sm py-3 border-y border-stone-700 text-amber-300 font-medium">
                      <span className="flex items-center gap-2"><Icon name="check" size={16} />{coupon.applied ? `Cupom ${coupon.applied}` : 'Presente de 1ª sessão'}</span>
                      <span>-{money(invoice.discount)}</span>
                    </div>
                  )}
                  {invoice.peakFee > 0 && <Summary label="Deslocamento / pico" value={`+${money(invoice.peakFee)}`} />}
                  {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm text-amber-300"><span>Desconto Pix (3%)</span><span className="font-medium">-{money(invoice.pixDiscount)}</span></div>}
                </div>
                <div className="flex justify-between items-end pt-5 border-t border-stone-700">
                  <span className="text-sm text-stone-300">Total</span>
                  <span className="text-4xl font-light text-stone-50">{money(invoice.total)}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-center text-sm">
                  <div className="bg-stone-950 rounded-2xl p-3"><p className="text-stone-400 text-xs">Sinal agora</p><p className="font-semibold text-amber-300">{money(invoice.sinal)}</p></div>
                  <div className="bg-stone-950 rounded-2xl p-3"><p className="text-stone-400 text-xs">Após a sessão</p><p className="font-semibold text-stone-100">{money(invoice.rest)}</p></div>
                </div>
              </div>

              {!coupon.applied && (
                <div>
                  <label htmlFor="cp" className={labelCls}>Possui cupom adicional?</label>
                  <div className="flex gap-2">
                    <input id="cp" type="text" autoCapitalize="characters" placeholder="Código" value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} aria-describedby={coupon.error ? 'cp-err' : undefined} className={`${inputCls} flex-1 uppercase ${coupon.error ? 'border-red-400' : ''}`} />
                    <button type="button" onClick={applyCoupon} className={btnGhost}>Aplicar</button>
                  </div>
                  {coupon.error && <p id="cp-err" className="text-sm text-red-300 mt-2" role="alert">{coupon.error}</p>}
                </div>
              )}

              <div>
                <p className={labelCls}>Pedido específico? (+ {money(CONFIG.FETISH_FEE)})</p>
                <div className="flex items-start gap-3 text-xs text-stone-300 leading-relaxed mb-3">
                  <input id="req-ok" type="checkbox" checked={reqOk} onChange={(e) => { setReqOk(e.target.checked); if (!e.target.checked) set({ req: '' }); }} className="mt-0.5 w-5 h-5 accent-amber-400 shrink-0 cursor-pointer" />
                  <p>
                    <label htmlFor="req-ok" className="cursor-pointer">Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp, não é salvo neste aparelho nem no sistema de agenda, e posso retirar o consentimento quando quiser. </label>
                    <button type="button" onClick={() => setDoc('privacy')} className="underline underline-offset-4 text-amber-300">Saiba mais</button>
                  </p>
                </div>
                <label htmlFor="rq" className="sr-only">Descreva o pedido específico</label>
                <input id="rq" type="text" disabled={!reqOk} placeholder="Opcional: algum detalhe ou vontade para a sessão" maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={inputCls} />
                <p className="text-xs text-stone-400 mt-3 leading-relaxed">Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.</p>
              </div>

              <fieldset className="min-w-0">
                <legend className={labelCls}>Pagamento do restante</legend>
                <div className="grid grid-cols-3 gap-3">
                  {PAYMENT_METHODS.map(({ id, label }) => (
                    <label key={id} className={`${chipBase} text-xs font-semibold px-2 text-center ${data.payment === id ? chipOn : chipOff}`}>
                      <input type="radio" name="payment" value={id} checked={data.payment === id} onChange={() => selectPayment(id)} className="sr-only" />
                      {label}
                    </label>
                  ))}
                </div>
                {data.payment === 'card' && <p className="text-xs text-stone-400 mt-3">Taxas do cartão são combinadas pelo WhatsApp antes do pagamento.</p>}
              </fieldset>

              <label className="flex items-start gap-3 text-sm text-stone-300 leading-relaxed cursor-pointer min-h-[44px]">
                <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-5 h-5 accent-amber-400 shrink-0" />
                <span>Opcional: quero receber lembretes e novidades pelo WhatsApp. Posso pedir para parar a qualquer momento.</span>
              </label>

              <div className="bg-amber-950/40 border border-amber-700/50 p-6 rounded-3xl">
                <p className="text-sm text-amber-100 leading-relaxed text-center">Para confirmar o horário, envie um sinal de <strong className="text-amber-300">{money(invoice.sinal)} via Pix</strong>. O restante é acertado após a sessão. Cancelamento e reembolso: veja a{' '}
                  <button type="button" onClick={() => setDoc('refund')} className="underline underline-offset-4 text-amber-300">política</button>.</p>
                <button type="button" onClick={copyPix} className="mt-4 mx-auto flex items-center gap-2 text-sm font-semibold text-amber-200 underline underline-offset-4 min-h-[44px]"><Icon name="copy" size={16} /> Copiar chave Pix (CNPJ)</button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-stone-800 flex gap-3">
              <button type="button" onClick={() => setStep(2)} className={`${btnGhost} w-1/4`}>Voltar</button>
              <button type="button" onClick={finishBooking} disabled={submitting || !data.payment} className={`flex-1 min-h-[56px] text-sm font-bold rounded-xl flex items-center justify-center text-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 ${data.payment && !submitting ? 'bg-emerald-700 text-white hover:bg-emerald-600' : 'bg-stone-800 text-stone-400 cursor-not-allowed'}`}>{submitting ? 'Preparando...' : data.payment ? 'Enviar solicitação pelo WhatsApp' : 'Escolha a forma de pagamento'}</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="fade-up flex flex-col items-center justify-center min-h-[60vh] text-center mt-10">
            <div className="w-20 h-20 bg-emerald-900/40 rounded-full flex items-center justify-center mb-6 border border-emerald-600/60"><Icon name="check" size={32} className="text-emerald-400" /></div>
            <h1 className="text-3xl font-light mb-4 text-stone-50">Tudo pronto!</h1>
            <p className="text-sm text-stone-300 leading-relaxed mb-8 max-w-sm">
              Sua solicitação foi preparada. O horário só está confirmado depois da resposta pelo WhatsApp. Se o WhatsApp não abriu, use o botão abaixo.<br /><br />
              <strong className="text-amber-300 font-medium">Envie o comprovante do sinal ({money(invoice.sinal)}) na conversa para confirmar.</strong>
            </p>
            <div className="w-full max-w-xs space-y-3">
              <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer" onClick={() => vibrate(15)} className={`${btnPrimary} flex items-center justify-center w-full`}>Reenviar mensagem</a>
              <button type="button" onClick={copyPix} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="copy" size={16} /> Copiar chave Pix</button>
              <button type="button" onClick={downloadICS} className={`${btnGhost} w-full flex items-center justify-center gap-2`}><Icon name="cal" size={16} /> Adicionar à agenda</button>
              <button type="button" onClick={resetFlow} className="w-full min-h-[48px] text-sm text-stone-400 hover:text-stone-200 underline underline-offset-4">Voltar ao início</button>
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
