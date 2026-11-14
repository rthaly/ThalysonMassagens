Se você subiu esse arquivo direto no GitHub para rodar na Vercel e o build quebrou, quase sempre é por causa de um destes 4 motivos:

1. **Case-sensitivity no Linux (Vercel):** No Windows seu arquivo funciona como `app.tsx` (minúsculo), mas na Vercel (Linux) o `main.tsx` importa `import App from './App.tsx'` (maiúsculo). Se você subiu como `app.tsx`, o build falha na hora. O nome do arquivo no repositório tem que ser **`App.tsx`**.
2. **Tipagem estrita do TypeScript (`RefObject`):** No React 19 / `@types/react` mais recente, `useRef<HTMLDivElement>(null)` retorna `RefObject<HTMLDivElement null |>`. Quando você passa isso para a função `scrollToRef(r: RefObject<HTMLDivElement>)`, o compilador `tsc` da Vercel trava o build com erro de tipagem.
3. **Dependência faltando (`sonner` ou componentes `shadcn/ui`):** Se o repositório não tiver o pacote `sonner` no `package.json` ou algum componente de `@/components/ui/...` (como `toggle-group` ou `accordion`), o Vite falha.
4. **Caminho do avatar (`/thalyson.jpg`):** Não quebra o build, mas se a imagem não estiver dentro da pasta `public/` do repositório com esse exato nome em minúsculo, ela vai cair no fallback com a letra "T".

Já corrigi a tipagem do `RefObject<HTMLDivElement null |>` e deixei o `App.tsx` blindado para passar no `tsc -b && vite build` estrito da Vercel sem reclamar.

**O que você precisa fazer no GitHub agora:**

1. Salve o código abaixo no arquivo **`src/App.tsx`** (com **A** maiúsculo — se existir um `app.tsx` minúsculo na pasta, apague).
2. Se o erro persistir, cole aqui a linha em vermelho do log da Vercel para vermos exatamente qual importação está faltando no seu `package.json`.

```tsx
import {
  useState, useEffect, useLayoutEffect, useMemo, useRef, useCallback, memo,
  type ReactNode, type CSSProperties, type RefObject,
} from 'react';
import { Toaster, toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

/* ------------------------------------------------------------------ */
/*  Configuração                                                       */
/* ------------------------------------------------------------------ */
const SITE_NAME = 'Relaxar hoje com Thalyson';
const LEGAL = {
  RAZAO: 'Thalyson Rodrigo dos Santos',
  CNPJ: '62.922.530/0001-44',
  ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo - SP',
  EMAIL: 'relaxecomthalyson@gmail.com',
  ENCARREGADO: 'Thalyson Rodrigo dos Santos',
  ATUALIZADO: '05/11/2026',
  CANCEL_FREE_HOURS: 12,
};

const C = {
  PHONE: '5517991360413',
  PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp',
  REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  AVATAR: '/thalyson.jpg',
  COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  SIGNAL: 40,
  FIRST: 15,
  REQ_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISC: 0.03,
  TIME_ADD: 75,
  APARO_FULL: 130,
  PACK_PAY: 4,
  PACK_TOTAL: 5,
  PACK_DAYS: 60,
  OPEN: 9 * 60,
  LAST_END: 23 * 60 + 30,
  STEP: 60,
  LEAD_S: 30,
  LEAD_H: 60,
  DAYS: 14,
};
const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

type Lang = 'pt' | 'en' | 'es';
type Theme = 'dark' | 'light';
type Phase = 'loading' | 'welcome' | 'site';
type Offer = 'single' | 'combo' | 'pack';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
type PkgTheme = 'sage' | 'amber' | 'crimson' | 'midnight' | 'slate';
type PkgText = { title: string; desc: string; tags: string[]; flow: string[] };

const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const LANG_NAME: Record<Lang, string> = { pt: 'Português', en: 'English', es: 'Español' };

/* ------------------------------------------------------------------ */
/*  Textos                                                             */
/* ------------------------------------------------------------------ */
const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando o seu momento de pausa', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Massagem masculina em São Paulo. Escolha, marque e confirme pelo WhatsApp. Simples e reservado.', w1: 'Reserva em 1 minuto', w2: 'Sinal de só R$ 40', w3: 'Cancelamento grátis',
    enter: 'Entrar e agendar', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'O seu momento de pausa.', sub: 'Massagem masculina em São Paulo. Escolha, agende e relaxe: a confirmação chega direto no seu WhatsApp.',
    cta: 'Agendar agora', reviews: 'Avaliações', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Massagens a partir de',
    t1: 'Sinal de só R$ 40, o resto depois da sessão', t2: 'Cancelamento grátis até 12h antes', t3: '1ª sessão com R$ 15 off, automático',
    offH: 'Mais vantagem para você', offS: 'Combo com depilação e pacote fidelidade, com a economia sempre à vista.',
    cbT: 'Massagem + depilação', cbD: 'Economize até R$ 70 no mesmo atendimento.', lyT: 'Leve 5, pague 4', lyD: 'A 5ª sessão é grátis. Você agenda a 1ª agora.', see: 'Ver opção',
    s1: 'Escolha a sessão', s2: 'Quer aproveitar o pacote?', s3: 'Quando e onde', s4: 'Resumo e pagamento', min: 'min', flowH: 'Como será a sessão',
    oSingle: 'Sessão avulsa', oSingleD: 'Uma sessão, sem compromisso.', oCombo: 'Com depilação', oComboD: 'Inclui aparo de pelos em até 3 lugares.', oPack: 'Pacote 5 sessões', oPackD: 'Pague 4 e a 5ª é grátis. Validade de {n} dias.',
    save: 'Economize', was: 'De', listen: 'Ouvir descrição', pause: 'Pausar áudio', resume: 'Continuar áudio', stopA: 'Parar',
    voiceLow: 'Este aparelho não tem voz masculina em português. Usei um tom mais grave.', noTts: 'Seu navegador não suporta narração em áudio.',
    skip: 'Ir para o conteúdo', guar: 'Garantias', legalNav: 'Documentos legais',
    packNote: 'Cupom e desconto de 1ª sessão não acumulam com o pacote, que já é o melhor preço. Você agenda esta 1ª sessão agora e as outras 4 depois, pelo WhatsApp.',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).', place: 'Local da sessão', studio: 'No espaço do terapeuta', home: 'O Terapeuta vai até você',
    peakNote: 'Horários de pico no seu endereço têm taxa de R$ 18. Pedimos mais antecedência para o deslocamento. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú). O endereço exato é enviado junto com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua ou Avenida', number: 'Nº', comp: 'Qual Apto? Bloco?', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    demo: 'Disponibilidade demonstrativa: a reserva só vale após a resposta no WhatsApp.', dateErr: 'Escolha uma data.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'indisponível',
    cont: 'Continuar para o resumo', fill: 'Complete os campos destacados', change: 'Alterar', sPack: 'Sessão', sWhen: 'Quando', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)',
    lPack: 'Sessão', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Depilação (preço de combo)', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Presente de 1ª sessão', lCoupon: 'Cupom', lPeak: 'Deslocamento / pico', lPix: 'Desconto Pix (3%)',
    saved: 'Você economiza', total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    extras: 'Extras e cupom (opcional)', couponQ: 'Possui cupom?', couponPh: 'Código', apply: 'Aplicar', remove: 'Remover', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido ou expirado.', couponPackNote: 'Cupom pausado: o pacote de 5 sessões já aplica o maior desconto.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp, não é salvo neste aparelho e posso retirar o consentimento quando quiser.',
    reqPh: 'Algum detalhe ou vontade para a sessão', reqNote: 'Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.',
    pay: 'Como vai pagar o restante?', pix: 'Pix (-3%)', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'As taxas e o parcelamento no cartão são combinados diretamente pelo WhatsApp antes do pagamento.',
    optIn: 'Quero receber lembretes e novidades pelo WhatsApp (opcional).',
    ageA: 'Declaro ter 18 anos ou mais e li a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e a', refund: 'Política de Cancelamento',
    sigA: 'Para confirmar o horário, envie um sinal de', sigB: 'via Pix. O restante é acertado após a sessão.', copyPix: 'Copiar chave Pix (CNPJ)', pixCopied: 'Chave Pix (CNPJ) copiada',
    send: 'Enviar pelo WhatsApp', needPay: 'Escolha a forma de pagamento', needAge: 'Confirme que você tem 18 anos ou mais',
    doneH: 'Tudo pronto!', doneP: 'Sua solicitação foi preparada. O horário só está confirmado depois da resposta pelo WhatsApp. Se o WhatsApp não abriu, use o botão abaixo.',
    doneSig: 'Envie o comprovante do sinal na conversa para confirmar.', resend: 'Reenviar mensagem', addCal: 'Adicionar ao Google Calendar', restart: 'Voltar ao início',
    chatQ: 'Prefere tirar uma dúvida antes?', chatBtn: 'Falar no WhatsApp', chatMsg: 'Oi Thalyson! Vim pelo site Relaxar hoje com Thalyson e tenho uma dúvida.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Terapeuta masculino', about1: 'Meu trabalho é direto e focado no corpo masculino: usar o toque para aliviar o peso e a tensão da sua rotina.',
    about2: 'Atendo em uma suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.', seeProfile: 'Ver perfil completo',
    faqH: 'Dúvidas rápidas', q1: 'Como funciona o sinal?', a1: 'Você paga R$ 40 por Pix para garantir o horário. O restante é pago depois da sessão, na forma que escolher.',
    q2: 'E se eu precisar cancelar?', a2: 'Até 12 horas antes você recebe o sinal de volta ou remarca sem custo.', q3: 'Que dados preciso informar?', a3: 'Só nome, dia, horário e pacote. Não pedimos CPF, e-mail nem telefone no site.',
    q4: 'Posso pagar no cartão?', a4: 'Sim: Pix (com 3% de desconto), cartão em até 12x (taxas combinadas antes) ou dinheiro.',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento e reembolso', footCookies: 'Cookies', adults: 'Serviço exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Alternar tema', lang: 'Idioma', srLight: 'Mudar para tema claro', srDark: 'Mudar para tema escuro', legalNote: '',
    profile: 'Perfil', openProfile: 'Abrir perfil de Thalyson', gm: 'Bom dia', ga: 'Boa tarde', gn: 'Boa noite',
    pBul1: 'Conversa inicial para combinar limites e preferências', pBul2: 'Atendimento sem pressa, com horário reservado só para você', pBul3: 'Ambiente reservado, em suíte no Centro Histórico',
    pHours: 'Horário de atendimento', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Formas de pagamento', pPayV: 'Pix (3% off), cartão até 12x e dinheiro',
    pWhere: 'Onde atendo', pWhereV: 'No meu espaço (Bela Vista) ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis até 12 horas antes',
    pForget: 'Apagar meus dados deste aparelho', forgot: 'Dados apagados deste aparelho',
    recommended: 'Recomendado para hoje', smartSub: 'Seu corpo pede pausa. Deixe o resto comigo.', lastSlots: 'Atenção: Últimos horários para hoje',
  },
  en: {
    loadMsg: 'Preparing your moment to pause', badge: 'Bela Vista, Downtown São Paulo',
    wSub: 'Men’s massage in São Paulo. Choose, book and confirm on WhatsApp. Simple and private.', w1: 'Book in 1 minute', w2: 'Deposit of only R$ 40', w3: 'Free cancellation',
    enter: 'Enter and book', needAgeEnter: 'Confirm you are 18 or older',
    h1: 'Your moment to pause.', sub: 'Men’s massage in São Paulo. Choose, book and relax: the confirmation lands straight in your WhatsApp.',
    cta: 'Book now', reviews: 'Reviews', nextFree: 'Next free slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Massages from',
    t1: 'Deposit of only R$ 40, the rest after the session', t2: 'Free cancellation up to 12h before', t3: 'R$ 15 off your 1st session, automatic',
    offH: 'More value for you', offS: 'Grooming combo and loyalty pack, with the savings always in sight.',
    cbT: 'Massage + grooming', cbD: 'Save up to R$ 70 in the same visit.', lyT: 'Get 5, pay for 4', lyD: 'The 5th session is free. You book the 1st now.', see: 'See option',
    s1: 'Choose your session', s2: 'How would you like it?', s3: 'When and where', s4: 'Summary and payment', min: 'min', flowH: 'How the session goes',
    oSingle: 'Single session', oSingleD: 'One session, no commitment.', oCombo: 'With grooming', oComboD: 'Includes body trimming in up to 3 areas.', oPack: '5-session pack', oPackD: 'Pay for 4, the 5th is free. Valid for {n} days.',
    save: 'Save', was: 'Was', listen: 'Listen to description', pause: 'Pause audio', resume: 'Resume audio', stopA: 'Stop',
    voiceLow: 'This device has no male voice for this language. A deeper tone was used.', noTts: 'Your browser does not support audio narration.',
    skip: 'Skip to content', guar: 'Guarantees', legalNav: 'Legal documents',
    packNote: 'Coupons and the 1st-session gift do not stack with the pack, which is already the best price. You book this 1st session now and the other 4 later on WhatsApp.',
    name: 'What should I call you?', namePh: 'Your name', nameErr: 'Enter your name (min. 3 letters).', place: 'Session location', studio: 'At my place', home: 'I come to you',
    peakNote: 'Peak hours at your address carry a R$ 18 fee. We ask for more notice for travel. The ZIP code is looked up via ViaCEP.',
    studioInfo: 'The suite is in the Historic Center, Bela Vista (near Anhangabaú metro). The exact address is sent with the confirmation.',
    cep: 'ZIP code (fills the address)', street: 'Street or Avenue', number: 'No.', comp: 'Apartment / complement', bairro: 'Neighborhood', addrErr: 'Fill in street, number and neighborhood.', cepFail: 'ZIP code not found. Fill in manually.',
    date: 'Date', time: 'Start time', session: 'Session of', peak: 'Peak', noSlots: 'No free slots on this day. Try another date.',
    demo: 'Sample availability: the booking only counts after the reply on WhatsApp.', dateErr: 'Choose a date.', timeErr: 'Choose a time.', from: 'From', to: 'to', unavailable: 'unavailable',
    cont: 'Continue to summary', fill: 'Complete the highlighted fields', change: 'Change', sPack: 'Session', sWhen: 'When', sLoc: 'Location', sLocStudio: 'At the suite (Bela Vista)',
    lPack: 'Session', lPack5: '5-session pack (4 paid)', lCombo: 'Grooming (combo price)', lTime: '+30 extra minutes', lReq: 'Specific request', lFirst: '1st session gift', lCoupon: 'Coupon', lPeak: 'Travel / peak', lPix: 'Pix discount (3%)',
    saved: 'You save', total: 'Total', signal: 'Deposit now', rest: 'After the session',
    extras: 'Extras and coupon (optional)', couponQ: 'Have a coupon?', couponPh: 'Code', apply: 'Apply', remove: 'Remove', couponOk: 'Coupon applied', couponBad: 'Invalid or expired coupon.', couponPackNote: 'Coupon paused: the 5-session pack already includes the maximum discount.',
    reqQ: 'Specific request (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describing a request that may relate to sex life (sensitive data), only so it can be evaluated. It goes only via WhatsApp, is not saved on this device, and I can withdraw consent any time.',
    reqPh: 'Any detail or wish for the session', reqNote: 'Request evaluated at the time of the session. If not feasible, it is not charged.',
    pay: 'How will you pay the remainder?', pix: 'Pix (-3%)', card: 'Card up to 12x', cash: 'Cash', cardNote: 'Card fees and installments are arranged directly on WhatsApp before payment.',
    optIn: 'I want reminders and news via WhatsApp (optional).',
    ageA: 'I declare I am 18 or older and have read the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and the', refund: 'Cancellation Policy',
    sigA: 'To confirm the time, send a deposit of', sigB: 'via Pix. The rest is settled after the session.', copyPix: 'Copy Pix key (CNPJ)', pixCopied: 'Pix key (CNPJ) copied',
    send: 'Send on WhatsApp', needPay: 'Choose a payment method', needAge: 'Confirm you are 18 or older',
    doneH: 'All set!', doneP: 'Your request is ready. The time is only confirmed after the reply on WhatsApp. If WhatsApp did not open, use the button below.',
    doneSig: 'Send the deposit receipt in the chat to confirm.', resend: 'Resend message', addCal: 'Add to Google Calendar', restart: 'Back to start',
    chatQ: 'Prefer to ask something first?', chatBtn: 'Chat on WhatsApp', chatMsg: 'Hi Thalyson! I came from the Relaxar hoje com Thalyson site and have a question.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Male therapist', about1: 'My work is direct and focused on the male body: using touch to relieve the weight and tension of your routine.',
    about2: 'I work from a suite in downtown São Paulo, close to the Anhangabaú metro station.', seeProfile: 'See full profile',
    faqH: 'Quick questions', q1: 'How does the deposit work?', a1: 'You pay R$ 40 by Pix to hold the time. The rest is paid after the session, in the way you choose.',
    q2: 'What if I need to cancel?', a2: 'Up to 12 hours before, you get the deposit back or reschedule at no cost.', q3: 'What data do I need to give?', a3: 'Only name, day, time and package. We don’t ask for ID, email or phone on the site.',
    q4: 'Can I pay by card?', a4: 'Yes: Pix (3% off), card up to 12x (fees agreed beforehand) or cash.',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Cancellation and refunds', footCookies: 'Cookies', adults: 'Service exclusively for adults 18+.',
    close: 'Close', theme: 'Toggle theme', lang: 'Language', srLight: 'Switch to light theme', srDark: 'Switch to dark theme', legalNote: 'Legal documents are provided in Portuguese, which is the binding version.',
    profile: 'Profile', openProfile: 'Open Thalyson’s profile', gm: 'Good morning', ga: 'Good afternoon', gn: 'Good evening',
    pBul1: 'Initial chat to agree on limits and preferences', pBul2: 'No rush, with a time slot reserved just for you', pBul3: 'Private setting, in a suite in the Historic Center',
    pHours: 'Opening hours', pHoursV: 'Every day, from {a} to {b}', pPay: 'Payment methods', pPayV: 'Pix (3% off), card up to 12x and cash',
    pWhere: 'Where I work', pWhereV: 'At my place (Bela Vista) or at your address', pCancel: 'Cancellation', pCancelV: 'Free up to 12 hours before',
    pForget: 'Erase my data from this device', forgot: 'Data erased from this device',
    recommended: 'Recommended for today', smartSub: 'Your body asks for a pause. Leave the rest to me.', lastSlots: 'Attention: Last slots for today',
  },
  es: {
    loadMsg: 'Preparando tu momento de pausa', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Masaje masculino en São Paulo. Elige, reserva y confirma por WhatsApp. Simple y reservado.', w1: 'Reserva en 1 minuto', w2: 'Señal de solo R$ 40', w3: 'Cancelación gratis',
    enter: 'Entrar y reservar', needAgeEnter: 'Confirma que tienes 18 años o más',
    h1: 'Tu momento de pausa.', sub: 'Masaje masculino en São Paulo. Elige, reserva y relájate: la confirmación llega directo a tu WhatsApp.',
    cta: 'Reservar ahora', reviews: 'Reseñas', nextFree: 'Próximo horario libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Masajes desde',
    t1: 'Señal de solo R$ 40, el resto después de la sesión', t2: 'Cancelación gratis hasta 12h antes', t3: '1ª sesión con R$ 15 de descuento, automático',
    offH: 'Más ventaja para ti', offS: 'Combo con depilación y paquete de fidelidad, con el ahorro siempre a la vista.',
    cbT: 'Masaje + depilación', cbD: 'Ahorra hasta R$ 70 en la misma visita.', lyT: 'Lleva 5, paga 4', lyD: 'La 5ª sesión es gratis. Reservas la 1ª ahora.', see: 'Ver opción',
    s1: 'Elige la sesión', s2: '¿Cómo la quieres?', s3: 'Cuándo y dónde', s4: 'Resumen y pago', min: 'min', flowH: 'Cómo será la sesión',
    oSingle: 'Sesión individual', oSingleD: 'Una sesión, sin compromiso.', oCombo: 'Con depilación', oComboD: 'Incluye recorte de vello hasta en 3 zonas.', oPack: 'Paquete 5 sesiones', oPackD: 'Paga 4 y la 5ª es gratis. Validez de {n} días.',
    save: 'Ahorra', was: 'Antes', listen: 'Escuchar descripción', pause: 'Pausar audio', resume: 'Continuar audio', stopA: 'Detener',
    voiceLow: 'Este dispositivo no tiene voz masculina en este idioma. Usé un tono más grave.', noTts: 'Tu navegador no admite narración en audio.',
    skip: 'Ir al contenido', guar: 'Garantías', legalNav: 'Documentos legales',
    packNote: 'Los cupones y el regalo de 1ª sesión no se acumulan con el paquete, que ya es el mejor precio. Reservas esta 1ª sesión ahora y las otras 4 después por WhatsApp.',
    name: '¿Cómo debo llamarte?', namePh: 'Tu nombre', nameErr: 'Ingresa tu nombre (mín. 3 letras).', place: 'Lugar de la sesión', studio: 'En mi espacio', home: 'Voy hasta ti',
    peakNote: 'Los horarios pico en tu dirección tienen una tasa de R$ 18. Pedimos más antelación por el desplazamiento. El CEP se consulta en ViaCEP.',
    studioInfo: 'La suite está en el Centro Histórico, en Bela Vista (cerca del metro Anhangabaú). La dirección exacta se envía con la confirmación.',
    cep: 'CEP (completa la dirección)', street: 'Calle o Avenida', number: 'Nº', comp: 'Complemento', bairro: 'Barrio', addrErr: 'Completa calle, número y barrio.', cepFail: 'CEP no encontrado. Complétalo manualmente.',
    date: 'Fecha', time: 'Hora de inicio', session: 'Sesión de', peak: 'Pico', noSlots: 'Sin horarios libres este día. Prueba otra fecha.',
    demo: 'Disponibilidad demostrativa: la reserva solo vale tras la respuesta en WhatsApp.', dateErr: 'Elige una fecha.', timeErr: 'Elige un horario.', from: 'De', to: 'a', unavailable: 'no disponible',
    cont: 'Continuar al resumen', fill: 'Completa los campos resaltados', change: 'Cambiar', sPack: 'Sesión', sWhen: 'Cuándo', sLoc: 'Lugar', sLocStudio: 'En la suite (Bela Vista)',
    lPack: 'Sesión', lPack5: 'Paquete 5 sesiones (4 pagadas)', lCombo: 'Depilación (precio de combo)', lTime: '+30 minutos extra', lReq: 'Pedido específico', lFirst: 'Regalo de 1ª sesión', lCoupon: 'Cupón', lPeak: 'Desplazamiento / pico', lPix: 'Descuento Pix (3%)',
    saved: 'Ahorras', total: 'Total', signal: 'Señal ahora', rest: 'Después de la sesión',
    extras: 'Extras y cupón (opcional)', couponQ: '¿Tienes un cupón?', couponPh: 'Código', apply: 'Aplicar', remove: 'Quitar', couponOk: 'Cupón activado', couponBad: 'Cupón inválido o vencido.', couponPackNote: 'Cupón pausado: el paquete de 5 sesiones ya aplica el máximo descuento.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Más información',
    reqConsent: 'Consiento informar un pedido que puede tratar sobre vida sexual (dato sensible), solo para que sea evaluado. Va solo por WhatsApp, no se guarda en este dispositivo y puedo retirar el consentimiento cuando quiera.',
    reqPh: 'Algún detalle o deseo para la sesión', reqNote: 'Pedido evaluado en el momento de la atención. Si es inviable, no se cobra.',
    pay: '¿Cómo pagarás el resto?', pix: 'Pix (-3%)', card: 'Tarjeta hasta 12x', cash: 'Efectivo', cardNote: 'Las tasas y cuotas de tarjeta se acuerdan directamente por WhatsApp antes del pago.',
    optIn: 'Quiero recibir recordatorios y novedades por WhatsApp (opcional).',
    ageA: 'Declaro tener 18 años o más y haber leído la', privacy: 'Política de Privacidad', terms: 'Términos', and: 'y la', refund: 'Política de Cancelación',
    sigA: 'Para confirmar el horario, envía una señal de', sigB: 'por Pix. El resto se paga después de la sesión.', copyPix: 'Copiar clave Pix (CNPJ)', pixCopied: 'Clave Pix (CNPJ) copiada',
    send: 'Enviar por WhatsApp', needPay: 'Elige la forma de pago', needAge: 'Confirma que tienes 18 años o más',
    doneH: '¡Todo listo!', doneP: 'Tu solicitud está preparada. El horario solo se confirma tras la respuesta por WhatsApp. Si no se abrió, usa el botón de abajo.',
    doneSig: 'Envía el comprobante de la señal en el chat para confirmar.', resend: 'Reenviar mensaje', addCal: 'Añadir a Google Calendar', restart: 'Volver al inicio',
    chatQ: '¿Prefieres preguntar algo antes?', chatBtn: 'Hablar por WhatsApp', chatMsg: '¡Hola Thalyson! Vengo del sitio Relaxar hoje com Thalyson y tengo una duda.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Terapeuta masculino', about1: 'Mi trabajo es directo y enfocado en el cuerpo masculino: usar el tacto para aliviar el peso y la tensión de tu rutina.',
    about2: 'Atiendo en una suite en el Centro Histórico de SP, cerca del metro Anhangabaú.', seeProfile: 'Ver perfil completo',
    faqH: 'Dudas rápidas', q1: '¿Cómo funciona la señal?', a1: 'Pagas R$ 40 por Pix para asegurar el horario. El resto se paga después de la sesión, como prefieras.',
    q2: '¿Y si necesito cancelar?', a2: 'Hasta 12 horas antes recibes la señal de vuelta o reprogramas sin costo.', q3: '¿Qué datos debo dar?', a3: 'Solo nombre, día, horario y paquete. No pedimos documento, correo ni teléfono en el sitio.',
    q4: '¿Puedo pagar con tarjeta?', a4: 'Sí: Pix (3% de descuento), tarjeta hasta 12x (tasas acordadas antes) o efectivo.',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Cancelación y reembolso', footCookies: 'Cookies', adults: 'Servicio exclusivo para mayores de 18 años.',
    close: 'Cerrar', theme: 'Cambiar tema', lang: 'Idioma', srLight: 'Cambiar a tema claro', srDark: 'Cambiar a tema oscuro', legalNote: 'Los documentos legales están en portugués, que es la versión vinculante.',
    profile: 'Perfil', openProfile: 'Abrir perfil de Thalyson', gm: 'Buenos días', ga: 'Buenas tardes', gn: 'Buenas noches',
    pBul1: 'Conversación inicial para acordar límites y preferencias', pBul2: 'Sin prisa, con un horario reservado solo para ti', pBul3: 'Ambiente reservado, en una suite del Centro Histórico',
    pHours: 'Horario de atención', pHoursV: 'Todos los días, de {a} a {b}', pPay: 'Formas de pago', pPayV: 'Pix (3% de descuento), tarjeta hasta 12x y efectivo',
    pWhere: 'Dónde atiendo', pWhereV: 'En mi espacio (Bela Vista) o en tu dirección', pCancel: 'Cancelación', pCancelV: 'Gratis hasta 12 horas antes',
    pForget: 'Borrar mis datos de este dispositivo', forgot: 'Datos borrados de este dispositivo',
    recommended: 'Recomendado para hoy', smartSub: 'Tu cuerpo pide pausa. Déjame el resto a mí.', lastSlots: 'Atención: Últimos horarios para hoy',
  },
};

const PACKAGES: { id: string; price: number; min: number; combo: number; theme: PkgTheme; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, combo: 90, theme: 'sage', L: {
    pt: { title: 'Massagem Clássica', tags: ['Descompressão', 'Pistola relaxante', 'Foco muscular'], desc: 'O alívio direto. Focado em desatar os nós da sua rotina e soltar a musculatura pesada através de toques profundos e vigorosos.',
      flow: ['Conversa para identificar onde seu corpo acumula mais peso.', 'Trabalho manual intenso para soltar a tensão muscular.', 'Uso da pistola nos pontos críticos.', 'Finalização focada em relaxamento puro.'] },
    en: { title: 'Classic Massage', tags: ['Decompression', 'Massage gun', 'Muscle focus'], desc: 'Direct relief. Focused on untying the knots of your routine and loosening heavy muscles through deep, vigorous touch.',
      flow: ['Chat to identify where your body holds stress.', 'Intense manual work to release muscle tension.', 'Gun used on critical points.', 'Finish focused on pure relaxation.'] },
    es: { title: 'Masaje Clásico', tags: ['Descompresión', 'Pistola relajante', 'Foco muscular'], desc: 'El alivio directo. Enfocado en desatar los nudos de tu rutina y soltar la musculatura pesada mediante toques profundos.',
      flow: ['Charla para identificar dónde acumulas estrés.', 'Trabajo manual intenso para soltar la tensión.', 'Uso de pistola en puntos críticos.', 'Final enfocado en pura relajación.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, theme: 'amber', L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Despertar', 'Toque sutil', 'Finalização tântrica'], desc: 'A transição. Começa quebrando a tensão acumulada e evolui para toques muito mais sutis que despertam o corpo inteiro, mudando a sua energia.',
      flow: ['Massagem inicial para quebrar a tensão defensiva do corpo.', 'Transição para toques lentos e sutis (tântrica).', 'Foco no despertar sensorial.', 'Finalização direcionada ao prazer.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Awakening', 'Subtle touch', 'Tantric finish'], desc: 'The transition. Starts by breaking accumulated tension and evolves into much subtler touches that wake up the whole body, shifting your energy.',
      flow: ['Initial massage to break the body\'s defensive tension.', 'Transition to slow, subtle touches (tantric).', 'Focus on sensory awakening.', 'Pleasure-directed finish.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Despertar', 'Toque sutil', 'Final tántrico'], desc: 'La transición. Empieza rompiendo la tensión acumulada y evoluciona a toques mucho más sutiles que despiertan todo el cuerpo.',
      flow: ['Masaje inicial para romper la tensión defensiva.', 'Transición a toques lentos y sutiles (tántrica).', 'Foco en el despertar sensorial.', 'Final dirigido al placer.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, theme: 'crimson', L: {
    pt: { title: 'Sensações com a Barba', tags: ['Contraste', 'Naturista', 'Intensidade'], desc: 'O contraste térmico e tátil. A base relaxante se mistura ao toque áspero e íntimo da barba deslizando pela pele, criando uma experiência sensorial imprevisível.',
      flow: ['Sessão naturista (ambos à vontade).', 'Relaxamento preparatório.', 'Estímulos contrastantes usando o contato da barba pelo corpo.', 'Finalização intensa.'] },
    en: { title: 'Beard Sensations', tags: ['Contrast', 'Naturist', 'Intensity'], desc: 'Thermal and tactile contrast. The relaxing base mixes with the rough, intimate touch of the beard gliding over your skin.',
      flow: ['Naturist session (both completely comfortable).', 'Preparatory relaxation.', 'Contrasting stimuli using beard contact across the body.', 'Intense finish.'] },
    es: { title: 'Sensaciones con la Barba', tags: ['Contraste', 'Naturista', 'Intensidad'], desc: 'El contraste térmico y táctil. La base relajante se mezcla con el toque áspero e íntimo de la barba deslizándose por la piel.',
      flow: ['Sesión naturista (ambos cómodos).', 'Relajación preparatoria.', 'Estímulos contrastantes usando el contacto de la barba.', 'Final intenso.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, theme: 'midnight', L: {
    pt: { title: 'Corpo a Corpo & Interação', tags: ['Sem barreiras', 'Deslizamento', 'Liberdade total'], desc: 'A entrega absoluta. Nenhuma barreira física. Uso meu corpo sobre o seu com gel deslizante, e você tem espaço e liberdade total para retribuir os toques.',
      flow: ['Alinhamento de limites.', 'Massagem de soltura.', 'Proximidade máxima com gel corpo a corpo.', 'Liberdade para você conduzir e retribuir os toques.', 'Finalização conjunta.'] },
    en: { title: 'Body to Body & Interaction', tags: ['No barriers', 'Gliding', 'Total freedom'], desc: 'Absolute surrender. No physical barriers. I use my body over yours with gliding gel, and you have complete freedom to touch back.',
      flow: ['Alignment of boundaries.', 'Release massage.', 'Maximum closeness with body-to-body gel.', 'Freedom for you to lead and return touches.', 'Shared finish.'] },
    es: { title: 'Cuerpo a Cuerpo & Interacción', tags: ['Sin barreras', 'Deslizamiento', 'Libertad total'], desc: 'La entrega absoluta. Ninguna barrera física. Uso mi cuerpo sobre el tuyo con gel, y tienes libertad total para devolver los toques.',
      flow: ['Alineación de límites.', 'Masaje de soltura.', 'Cercanía máxima con gel cuerpo a cuerpo.', 'Libertad para que conduzcas y devuelvas toques.', 'Final conjunto.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, theme: 'slate', L: {
    pt: { title: 'Apenas Depilação (Máquina)', tags: ['Estética', 'Praticidade'], desc: 'Serviço isolado e direto para quem busca apenas higiene e estética visual. Aparo rápido e limpo em até 3 áreas do corpo.',
      flow: ['Alinhamento do resultado esperado.', 'Aparo com máquina e pentes específicos.', 'Acabamento final.'] },
    en: { title: 'Trimming Only (Machine)', tags: ['Grooming', 'Practicality'], desc: 'Direct standalone service for those just looking for hygiene and visual aesthetics. Quick, clean trim on up to 3 body areas.',
      flow: ['Alignment of the expected result.', 'Trimming with machine and specific guards.', 'Final finishing touches.'] },
    es: { title: 'Solo Depilación (Máquina)', tags: ['Estética', 'Practicidad'], desc: 'Servicio aislado y directo para quien busca solo higiene y estética. Recorte rápido y limpio en hasta 3 zonas del cuerpo.',
      flow: ['Alineación del resultado esperado.', 'Recorte con máquina y peines específicos.', 'Acabado final.'] } } },
];
const MASSAGES = PACKAGES.filter((p) => p.combo > 0);
const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };

/* ------------------------------------------------------------------ */
/*  Documentos legais                                                  */
/* ------------------------------------------------------------------ */
const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="mb-2 mt-5 font-semibold text-[var(--ink)]">{children}</h3>;
const DOCS: Record<DocId, { title: string; body: ReactNode }> = {
  privacy: { title: 'Política de Privacidade', body: (<>
    <P>Última atualização: {LEGAL.ATUALIZADO}. Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).</P>
    <H>1. Controlador</H><P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}, {LEGAL.ENDERECO}. Contato: {LEGAL.EMAIL}. Encarregado (DPO): {LEGAL.ENCARREGADO}, {LEGAL.EMAIL}.</P>
    <H>2. Dados que coletamos e por quê</H><P>Nome (como quer ser chamado), data, horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se escolher atendimento no seu endereço, para o deslocamento. Não pedimos CPF, e-mail, telefone nem data de nascimento no formulário; seu número aparece apenas na conversa de WhatsApp que você mesmo inicia.</P>
    <H>3. Dado sensível (vida sexual)</H><P>O campo opcional de pedido específico pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos se você marcar o consentimento específico ao lado do campo, apenas para avaliar o pedido, e ele não é salvo neste aparelho nem registrado em banco de dados. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.</P>
    <H>4. Com quem os dados são compartilhados</H><P>WhatsApp (Meta Platforms), para onde sua solicitação é enviada por você. ViaCEP, que recebe o CEP digitado para preencher o endereço. Google Fonts, que entrega as fontes do site. Não vendemos dados.</P>
    <H>5. Armazenamento no seu aparelho</H><P>Veja a seção Cookies e armazenamento local.</P>
    <H>6. Retenção</H><P>Conversas de WhatsApp e registros de agendamento são mantidos pelo tempo necessário para a sessão, para o acerto financeiro e para cumprir obrigações legais, e depois eliminados. Dados fiscais seguem os prazos da lei.</P>
    <H>7. Seus direitos (art. 18)</H><P>Confirmação do tratamento, acesso, correção, anonimização ou eliminação, portabilidade, informação sobre compartilhamento, revogação do consentimento e oposição. Peça pelo e-mail do encarregado; respondemos em prazo razoável. Você também pode reclamar à ANPD (gov.br/anpd).</P>
    <H>8. Menores</H><P>O serviço é exclusivo para maiores de 18 anos. Não coletamos dados de menores intencionalmente.</P>
    <H>9. Segurança</H><P>Usamos conexão HTTPS e limitamos os dados ao necessário. Nenhum sistema é totalmente invulnerável; em caso de incidente relevante, comunicaremos você e a ANPD conforme a lei.</P></>) },
  terms: { title: 'Termos de Serviço', body: (<>
    <P>Última atualização: {LEGAL.ATUALIZADO}. Ao usar este site você declara que leu e concorda com estes termos.</P>
    <H>1. Prestador</H><P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}, {LEGAL.ENDERECO}, {LEGAL.EMAIL}.</P>
    <H>2. Serviço</H><P>Massagem e serviços de estética masculina, exclusivos para maiores de 18 anos, conforme o pacote escolhido. As descrições são informativas; massagem não substitui tratamento médico e não promete resultado de saúde.</P>
    <H>3. Solicitação e confirmação</H><P>O site apenas registra uma solicitação. O horário só está garantido após a confirmação pelo WhatsApp e o pagamento do sinal. A disponibilidade mostrada pode ser demonstrativa.</P>
    <H>4. Preços, combos e pacotes</H><P>Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. O combo massagem + depilação tem preço promocional sobre o aparo avulso. O pacote de 5 sessões (pague 4, a 5ª é grátis) é válido por {C.PACK_DAYS} dias a partir da 1ª sessão, não acumula com cupom nem com o desconto de 1ª sessão, e as sessões seguintes são agendadas pelo WhatsApp conforme disponibilidade. Extras, taxa de horário de pico (atendimento no endereço do cliente) e pedido específico aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.</P>
    <H>5. Conduta</H><P>Exige-se respeito mútuo. O terapeuta pode encerrar a sessão, sem devolução do valor dos serviços já prestados, em caso de desrespeito, assédio, uso de drogas, embriaguez evidente ou risco à segurança. Informe previamente condições de saúde, alergias e lesões.</P>
    <H>6. Lei aplicável</H><P>Lei brasileira, incluindo o Código de Defesa do Consumidor. Foro do domicílio do consumidor.</P></>) },
  refund: { title: 'Política de Cancelamento e Reembolso', body: (<>
    <P>Última atualização: {LEGAL.ATUALIZADO}. Estas regras valem sem prejuízo dos direitos do consumidor previstos em lei.</P>
    <H>1. Cancelamento pelo cliente</H><P>Com pelo menos {LEGAL.CANCEL_FREE_HOURS} horas de antecedência: devolução integral do sinal via Pix ou remarcação sem custo. Com menos antecedência ou falta sem aviso: o sinal pode ser retido para cobrir o horário reservado, ou convertido em crédito, a critério do prestador.</P>
    <H>2. Arrependimento (art. 49 do CDC)</H><P>Se a contratação for feita à distância, você pode se arrepender em até 7 dias da contratação e receber de volta o sinal, desde que a sessão ainda não tenha sido realizada. Para sessões agendadas dentro desse prazo, o direito vale até o momento da sessão.</P>
    <H>3. Cancelamento pelo prestador</H><P>Se não puder atender, o sinal é devolvido integralmente ou a sessão é remarcada, conforme sua escolha.</P>
    <H>4. Como pedir</H><P>Responda a conversa do WhatsApp ou escreva para {LEGAL.EMAIL}. O reembolso é feito pelo mesmo meio de pagamento em até 7 dias úteis.</P>
    <H>5. Pedido específico</H><P>Se o pedido for considerado inviável, a taxa correspondente não é cobrada.</P></>) },
  cookies: { title: 'Cookies e armazenamento local', body: (<>
    <P>Este site não usa cookies de publicidade nem ferramentas de análise ou rastreamento (como Google Analytics ou Meta Pixel).</P>
    <H>Estritamente necessário</H><P>Guardamos no navegador (localStorage) apenas suas preferências de tema e idioma, a confirmação de maioridade e a lembrança de que você já agendou antes (para não repetir o desconto de primeira sessão). Não identificam você. Nome e endereço não são guardados. Você pode apagar tudo em “Apagar meus dados deste aparelho”, no perfil.</P>
    <P>Se no futuro ativarmos qualquer ferramenta de análise ou marketing, ela só carregará depois do seu consentimento.</P></>) },
};

/* ------------------------------------------------------------------ */
/*  Utilitários                                                        */
/* ------------------------------------------------------------------ */
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate?.(p); } catch { /* sem suporte */ } };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* ignorado */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* ignorado */ } },
};
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch { return false; } };
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;
const spNow = () => { try { return new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })); } catch { return new Date(); } };

type Slot = { t: string; ok: boolean };
function buildSlots(date: Date, dur: number, isHome: boolean, now: Date): Slot[] {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out: Slot[] = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  return out;
}

/* ------------------------------------------------------------------ */
/*  Narração em áudio (voz masculina, pausar e continuar)              */
/* ------------------------------------------------------------------ */
type NarrState = 'idle' | 'playing' | 'paused';
const MALE_RE = /(felipe|daniel|ant[oô]nio|ricardo|jorge|diego|pablo|raul|enrique|carlos|david|thiago|donato|george|\bmark\b|\bfred\b|\balex\b|\bmale\b|masculin|homem)/i;
const FEMALE_RE = /(female|feminin|mulher|francisca|luciana|maria|fernanda|joana|camila|vit[oó]ria|paulina|m[oó]nica|helena|laura|samantha|zira|susan|google)/i;

function pickVoice(voices: SpeechSynthesisVoice[], lang: Lang) {
  const loc = LOCALE[lang].toLowerCase();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  const exact = voices.filter((v) => norm(v) === loc);
  const same = exact.length ? exact : voices.filter((v) => norm(v).startsWith(lang));
  const male = same.find((v) => MALE_RE.test(v.name) && !FEMALE_RE.test(v.name));
  return { voice: male || same[0] || null, male: !!male };
}

function useNarrator(lang: Lang) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [state, setState] = useState<NarrState>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const chunks = useRef<string[]>([]);
  const idx = useRef(0);
  const token = useRef(0);
  const choice = useMemo(() => pickVoice(voices, lang), [voices, lang]);
  const choiceRef = useRef(choice);
  choiceRef.current = choice;
  const langRef = useRef(lang);
  langRef.current = lang;

  useEffect(() => {
    if (!supported) return undefined;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, [supported]);

  useEffect(() => () => { if (supported) { token.current += 1; window.speechSynthesis.cancel(); } }, [supported]);

  const step = useCallback(function run(tk: number) {
    if (tk !== token.current) return;
    const i = idx.current;
    if (i >= chunks.current.length) { setState('idle'); setActiveId(null); return; }
    const u = new SpeechSynthesisUtterance(chunks.current[i]);
    const { voice, male } = choiceRef.current;
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = LOCALE[langRef.current];
    u.rate = 0.92;
    u.pitch = male ? 1 : 0.7;
    u.onend = () => { if (tk !== token.current) return; idx.current = i + 1; run(tk); };
    u.onerror = (e) => {
      if (tk !== token.current) return;
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      setState('idle'); setActiveId(null);
    };
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    token.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setState('idle'); setActiveId(null);
  }, [supported]);

  const play = useCallback((id: string, text: string) => {
    if (!supported) return;
    const tk = ++token.current;
    window.speechSynthesis.cancel();
    chunks.current = (text.match(/[^.!?]+[.!?]*/g) || [text]).map((s) => s.trim()).filter(Boolean);
    idx.current = 0;
    setActiveId(id); setState('playing');
    setTimeout(() => step(tk), 80);
  }, [supported, step]);

  const pause = useCallback(() => {
    token.current += 1;
    if (supported) window.speechSynthesis.cancel();
    setState('paused');
  }, [supported]);

  const resume = useCallback(() => {
    const tk = ++token.current;
    setState('playing');
    setTimeout(() => step(tk), 80);
  }, [step]);

  const toggle = useCallback((id: string, text: string) => {
    if (activeId === id && state === 'playing') pause();
    else if (activeId === id && state === 'paused') resume();
    else play(id, text);
  }, [activeId, state, pause, resume, play]);

  return { supported, state, activeId, male: choice.male, hasVoice: !!choice.voice, toggle, stop };
}

/* ------------------------------------------------------------------ */
/*  Classes reutilizáveis                                              */
/* ------------------------------------------------------------------ */
const CARD = 'gap-0 rounded-3xl border-[var(--line)] bg-[var(--surf)] py-0 text-[var(--ink)] shadow-sm';
const BTN = 'h-auto min-h-14 whitespace-normal rounded-full px-6 py-3 text-base font-bold leading-tight text-balance';
const BTN_P = `${BTN} bg-[var(--acc)] text-[var(--onacc)] shadow-md hover:bg-[var(--acc)] hover:opacity-90 disabled:bg-[var(--surf2)] disabled:text-[var(--mute)] disabled:opacity-100 disabled:shadow-none`;
const BTN_G = `${BTN} border border-[var(--line)] bg-transparent text-[var(--ink)] shadow-none hover:bg-[var(--surf2)] hover:text-[var(--ink)]`;
const INP = 'h-14 rounded-2xl border-[var(--line)] bg-[var(--surf)] px-4 text-base text-[var(--ink)] placeholder:text-[var(--mute)] md:text-base focus-visible:border-[var(--acc)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--rg)]';
const CHIP = 'relative flex min-h-12 cursor-pointer items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surf)] px-3 py-2 text-center text-base font-semibold leading-tight text-balance transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[color:var(--acc)]';
const CHIP_ON = 'border-[var(--acc)] bg-[var(--acc)] font-bold text-[var(--onacc)]';
const CHIP_OFF = 'cursor-not-allowed line-through opacity-40';
const CHK = 'mt-0.5 size-6 shrink-0 rounded-md border-2 border-[var(--mute)] bg-[var(--surf)] data-[state=checked]:border-[var(--acc)] data-[state=checked]:bg-[var(--acc)] data-[state=checked]:text-[var(--onacc)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--rg)]';
const LBL = 'mb-2.5 block text-sm font-bold leading-snug text-[var(--mute)]';
const LBL_CHK = 'cursor-pointer items-start text-sm font-normal leading-relaxed';
const DLG = 'th-font max-h-[90dvh] w-[calc(100%-1.5rem)] max-w-lg gap-0 overflow-y-auto rounded-3xl border-[var(--line)] bg-[var(--surf)] p-0 text-[var(--ink)] sm:max-w-lg';

/* ------------------------------------------------------------------ */
/*  Ícones, avatar e animações                                         */
/* ------------------------------------------------------------------ */
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
  plus: 'M12 5v14 M5 12h14',
  sparkle: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  play: 'M5 3l14 9-14 9V3z',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
  stop: 'M6 6h12v12H6z',
  x: 'M18 6L6 18 M6 6l12 12',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICONS[name]} /></svg>
));

function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} serif inline-flex items-center justify-center bg-[var(--acc)] text-[var(--onacc)]`}>T</span>;
  return <img src={C.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

function useSeen<E extends HTMLElement>() {
  const ref = useRef<E>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setSeen(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  return <div ref={ref} className={`rv ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
function Title({ children, as = 'h2', className = '', style, id }: { children: string; as?: 'h1' | 'h2'; className?: string; style?: CSSProperties; id?: string }) {
  const { ref, seen } = useSeen<HTMLHeadingElement>();
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={`ttl serif ${seen ? 'in' : ''} ${className}`} style={style}>
      {children.split(' ').map((w, i) => (<span key={i} className="w"><span style={{ transitionDelay: `${i * 60}ms` }}>{w}&nbsp;</span></span>))}
    </Tag>
  );
}

const Row = ({ label, value, tone }: { label: string; value: ReactNode; tone?: 'ok' }) => (
  <div className={cn('flex justify-between gap-4 text-[15.5px]', tone && 'font-bold text-[var(--ok)]')}>
    <span className={tone ? undefined : 'text-[var(--mute)]'}>{label}</span>
    <span className="text-right font-semibold">{value}</span>
  </div>
);

const LinkBtn = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <Button type="button" variant="link" onClick={onClick} className="inline h-auto whitespace-normal p-0 text-left align-baseline font-semibold text-[var(--ink)] underline underline-offset-4 hover:text-[var(--ink)]">{children}</Button>
);

const StepHead = ({ n, title, done }: { n: number; title: string; done: boolean }) => (
  <div className="mb-6 flex items-center gap-4">
    <span className={cn('inline-flex size-9 shrink-0 items-center justify-center rounded-full border-[1.5px] text-[15px] font-extrabold transition-colors', done ? 'border-[var(--acc)] bg-[var(--acc)] text-[var(--onacc)]' : 'border-[var(--line)] text-[var(--mute)]')}>
      {done ? <Icon name="check" size={16} /> : n}
    </span>
    <Title as="h2" className="text-[28px] md:text-[34px]">{title}</Title>
  </div>
);

/* ------------------------------------------------------------------ */
/*  CSS global                                                         */
/* ------------------------------------------------------------------ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@400..800&display=swap');
:root{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#F2EFEB;--ink:#1C1A17;--mute:#6B655C;--line:rgba(28,26,23,.12);--acc:#1C1A17;--onacc:#FFFFFF;--rg:rgba(28,26,23,.22);--ok:#1E533F;--warn:#8F5A1A;--err:#C2334D;color-scheme:light}
:root[data-th=dark]{--bg:#141312;--surf:#1D1B1A;--surf2:#2A2725;--ink:#F2EFEB;--mute:#A19A90;--line:rgba(242,239,235,.12);--acc:#F2EFEB;--onacc:#141312;--rg:rgba(242,239,235,.28);--ok:#50A684;--warn:#E6A15C;--err:#FF8A9B;color-scheme:dark}
html{background:var(--bg);-webkit-text-size-adjust:100%}
.app,.th-font{font-family:'Manrope',system-ui,sans-serif}
.app{background:var(--bg);color:var(--ink);font-size:17px;line-height:1.55;min-height:100vh;min-height:100dvh;overflow-x:clip;transition:background .3s,color .3s;overflow-wrap:break-word;word-break:normal;hyphens:manual;text-wrap:pretty}
.app h1,.app h2,.app h3,.th-font h2,.th-font h3{text-wrap:balance;hyphens:manual;word-break:normal}
.app .text-sm{font-size:15.5px}.app .text-xs{font-size:13.5px}
.serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
.err{font-size:14px;color:var(--err);margin-top:8px}
.glow{position:absolute;top:-6%;right:-30%;width:min(95vw,640px);aspect-ratio:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--acc) 15%,transparent),transparent 66%);animation:drift 14s ease-in-out infinite}
.dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 var(--ok);animation:pulse 2.6s ease-out infinite}
.core{position:absolute;inset:0;margin:auto;width:96px;height:96px;border-radius:50%;overflow:hidden;animation:breathe 6s ease-in-out infinite}
.ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--acc);opacity:0;animation:ring 3.6s ease-out infinite}
.rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
.loadbar{transform-origin:left;animation:bar 2.4s cubic-bezier(.5,0,.2,1) both}
.rv{opacity:0;transform:translateY(26px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}
.ttl{font-weight:300;line-height:1.1;letter-spacing:-0.02em;padding-bottom:.1em}
.ttl .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.15em;margin-bottom:-.15em}
.ttl .w>span{display:inline-block;transform:translateY(108%);opacity:0;transition:transform 1s cubic-bezier(.2,.7,.2,1),opacity .8s ease}
.ttl.in .w>span{transform:none;opacity:1}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px max(16px,env(safe-area-inset-right)) calc(12px + env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{scrollbar-width:none}
@keyframes breathe{0%,100%{transform:scale(.96)}50%{transform:scale(1.04)}}
@keyframes ring{0%{transform:scale(.55);opacity:.6}100%{transform:scale(1.7);opacity:0}}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-4%,5%)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 55%,transparent)}100%{box-shadow:0 0 0 12px transparent}}
@media (max-width:640px){.ttl{font-size:clamp(36px,10vw,50px)!important}}
@media (prefers-reduced-motion:reduce){.glow,.dot,.core,.ring,.rise,.loadbar{animation:none!important}.rv,.ttl .w>span{opacity:1!important;transform:none!important;transition:none!important}*{scroll-behavior:auto!important}}
`;

interface Booking {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addTime: boolean;
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */
export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const s = store.get('thaly_lang');
    return s === 'en' || s === 'es' ? s : 'pt';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const s = store.get('thaly_theme');
    if (s === 'dark' || s === 'light') return s;
    try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch { return 'dark'; }
  });
  const t = useCallback((k: string) => T[lang][k] ?? T.pt[k] ?? k, [lang]);

  const [phase, setPhase] = useState<Phase>('loading');
  const [profileOpen, setProfileOpen] = useState(false);
  const [offer, setOffer] = useState<Offer>('single');
  const [reviewed, setReviewed] = useState(false);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [isReturning, setIsReturning] = useState(() => store.get('thaly_returning_final') === 'yes');
  const [touched, setTouched] = useState(false);
  const [doc, setDoc] = useState<DocId | null>(null);
  const [now, setNow] = useState(() => spNow());
  const [showBar, setShowBar] = useState(false);
  const [coupon, setCoupon] = useState({ input: '', applied: '', value: 0, error: '' });
  const [ageOk, setAgeOk] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState('');
  const [data, setData] = useState<Booking>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: '', addTime: false,
  });
  const set = (patch: Partial<Booking>) => setData((p) => ({ ...p, ...patch }));

  const narr = useNarrator(lang);
  const narrStopRef = useRef(narr.stop);
  narrStopRef.current = narr.stop;

  const bookRef = useRef<HTMLDivElement | null>(null);
  const s3Ref = useRef<HTMLDivElement | null>(null);
  const s4Ref = useRef<HTMLDivElement | null>(null);
  const numberRef = useRef<HTMLInputElement | null>(null);

  const showToast = (m: string) => { toast(m); };
  const scrollToRef = (r: RefObject<HTMLDivElement | null>, ms = 140) =>
    setTimeout(() => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), ms);
  const goBook = () => scrollToRef(bookRef, 30);

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.th = theme;
    root.classList.toggle('dark', theme === 'dark');
    store.set('thaly_theme', theme);
  }, [theme]);

  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* ignorado */ }
    const id = setTimeout(() => {
      if (store.get('thaly_onboard_final') === 'yes') { setAgeOk(true); setPhase('site'); } else setPhase('welcome');
    }, reduce ? 800 : 2600);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => { if (phase !== 'loading') window.scrollTo({ top: 0 }); }, [phase]);
  useEffect(() => { store.set('thaly_lang', lang); document.documentElement.lang = LOCALE[lang]; }, [lang]);
  useEffect(() => { document.title = SITE_NAME; }, []);
  useEffect(() => { const i = setInterval(() => setNow(spNow()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => { narrStopRef.current(); }, [data.packageId, lang]);

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

  const chosen = data.packageId !== '';
  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[1], [data.packageId]);
  const pt = pkg.L[lang];
  const isHome = data.locType === 'home';
  const isSolo = pkg.id === 'aparo_solo';
  const offerEff: Offer = isSolo ? 'single' : offer;
  const aparoOn = offerEff === 'combo';
  const isPack = offerEff === 'pack';
  const hasReq = reqOk && data.req.trim().length > 3;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOCALE[lang], o);

  const recommendedPkgId = useMemo(() => {
    const day = now.getDay();
    const hour = now.getHours();
    if (day === 1 || (hour >= 9 && hour < 14)) return 'classica';
    if (day === 5 || day === 6 || hour >= 20) return 'sensitiva';
    return 'fusion';
  }, [now]);

  const invoice = useMemo(() => {
    let dur = pkg.min;
    const timeAdd = data.addTime ? C.TIME_ADD : 0;
    if (data.addTime) dur += 30;
    const aparoAdd = aparoOn ? pkg.combo : 0;
    const comboSave = aparoOn ? C.APARO_FULL - pkg.combo : 0;
    const sessionPrice = isPack ? pkg.price * C.PACK_PAY : pkg.price;
    const packSave = isPack ? pkg.price * (C.PACK_TOTAL - C.PACK_PAY) : 0;
    const reqFee = hasReq ? C.REQ_FEE : 0;
    const base = sessionPrice + aparoAdd + timeAdd + reqFee;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? C.PEAK_FEE : 0;
    let discount = 0;
    if (!isPack) {
      if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
      else if (!isReturning) discount = C.FIRST;
    }
    discount = Math.min(discount, base);
    const after = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(after * C.PIX_DISC) : 0;
    const total = after - pixDiscount + peakFee;
    const sinal = Math.min(C.SIGNAL, total);
    return {
      sessionPrice, aparoAdd, timeAdd, reqFee, peakFee, discount, pixDiscount,
      total, sinal, rest: Math.max(0, total - sinal), dur, comboSave, packSave,
      saved: comboSave + packSave + discount + pixDiscount,
    };
  }, [data, pkg, isHome, isPack, aparoOn, isReturning, coupon.applied, coupon.value, hasReq]);

  const todayKey = dateKey(now);
  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);
    for (let i = 0; i < C.DAYS; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      out.push({ d, i });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.dur, isHome, now) : []), [data.date, invoice.dur, isHome, now]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  useEffect(() => {
    if (data.time && !slots.some((s) => s.t === data.time && s.ok)) {
      set({ time: '' });
      setReviewed(false);
    }
  }, [slots, data.time]);

  const nextFree = useMemo(() => {
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);
    for (let k = 0; k < 4; k++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + k);
      const s = buildSlots(d, pkg.min, false, now).find((x) => x.ok);
      if (s) return { d, t: s.t, k };
    }
    return null;
  }, [now, pkg.min]);

  const errors = {
    name: data.name.trim().length < 3 ? t('nameErr') : '',
    date: !data.date ? t('dateErr') : '',
    time: data.date && !data.time ? t('timeErr') : '',
    address: isHome && !(data.street.trim() && data.number.trim() && data.bairro.trim()) ? t('addrErr') : '',
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
  const removeCoupon = () => {
    vibrate(10);
    setCoupon({ input: '', applied: '', value: 0, error: '' });
  };
  const copyPix = async () => { const ok = await copyText(C.PIX_KEY); showToast(ok ? t('pixCopied') : `Pix: ${C.PIX_KEY}`); };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        if (!res.ok) throw new Error('CEP fetch fail');
        const j = await res.json();
        if (!j.erro) {
          setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro }));
          setTimeout(() => numberRef.current?.focus(), 150);
        } else showToast(t('cepFail'));
      } catch { showToast(t('cepFail')); }
    }
  };

  const pickPkg = (id: string) => {
    vibrate(15);
    set({ packageId: id });
    if (id === 'aparo_solo') setOffer('single');
  };
  const pickOffer = (o: Offer) => { vibrate(20); setOffer(o); goBook(); };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) loc = '📍 *Local:* Atendimento no espaço, região da Bela Vista/Centro Histórico. O endereço exato será enviado após a confirmação.';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, São Paulo`;
      loc = `📍 *Local:* Atendimento no seu endereço.\n*Endereço informado:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    const pk = pkg.L.pt;
    let m = `Oi Thalyson! Vim pelo site *${SITE_NAME}* e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    m += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    m += `*SESSÃO ESCOLHIDA (${invoice.dur} min):*\n✅ ${pk.title}\n\n*O que vai acontecer na sessão:*\n`;
    m += pk.flow.map((s, i) => `${i + 1}. ${s}`).join('\n') + '\n';
    if (aparoOn || data.addTime) {
      m += '\n*Adicionais:*\n';
      if (aparoOn) m += `➕ Aparo de pelos até 3 lugares (preço de combo, economia de ${money(invoice.comboSave)})\n`;
      if (data.addTime) m += '➕ +30 minutos extras\n';
    }
    if (hasReq) m += `\n*VONTADE ESPECÍFICA (consentimento dado no site):* "${clean(data.req)}"\n`;
    if (isPack) m += `\n🎁 *PACOTE 5 SESSÕES (pague 4, a 5ª é grátis):* esta é a 1ª sessão. As outras 4 serão agendadas depois por aqui, com validade de ${C.PACK_DAYS} dias. Economia do pacote: ${money(invoice.packSave)}.\n`;
    m += '\n*RESUMO DO PAGAMENTO:*\n';
    m += `${isPack ? `Pacote 5 sessões (4 pagas): ${money(invoice.sessionPrice)}` : `Sessão: ${money(invoice.sessionPrice)}`}\n`;
    if (invoice.aparoAdd > 0) m += `Depilação (combo): +${money(invoice.aparoAdd)}\n`;
    if (invoice.timeAdd > 0) m += `+30 minutos: +${money(invoice.timeAdd)}\n`;
    if (invoice.reqFee > 0) m += `Pedido específico: +${money(invoice.reqFee)}\n`;
    if (invoice.discount > 0) m += `🏷️ ${coupon.applied ? `Cupom ${coupon.applied}` : 'Presente de 1ª sessão'}: -${money(invoice.discount)}\n`;
    if (invoice.pixDiscount > 0) m += `🏷️ Desconto Pix (3%): -${money(invoice.pixDiscount)}\n`;
    if (invoice.peakFee > 0) m += `Taxa de deslocamento/pico: +${money(invoice.peakFee)}\n`;
    m += `*Valor Total:* ${money(invoice.total)} (${PAY_PT[data.payment] || data.payment})\n`;
    m += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n`;
    if (invoice.saved > 0) m += `💚 *Economia total neste pedido:* ${money(invoice.saved)}\n`;
    m += '\n✅ Declaro ter 18 anos ou mais e ter lido a Política de Privacidade, os Termos e a Política de Cancelamento.\n';
    if (optIn) m += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n';
    if (lang !== 'pt') m += `🌐 Idioma do cliente: ${lang === 'en' ? 'English' : 'Español'}\n`;
    if (!isPack) m += '\n🎁 *Para a próxima:* tenho direito ao cupom SESSAO2 no meu próximo agendamento.\n';
    m += '\nAguardo sua resposta para mandar o comprovante do sinal!';
    return waLink(m);
  };

  const googleCalendarLink = () => {
    if (!data.date || !data.time) return '';
    const day = dateKey(data.date).replace(/-/g, '');
    const startDateTime = `${day}T${data.time.replace(':', '')}00`;
    const endDateTime = `${day}T${fromMin(toMin(data.time) + invoice.dur).replace(':', '')}00`;
    const text = encodeURIComponent(`Massagem: ${pkg.L.pt.title} - Thalyson`);
    const details = encodeURIComponent(`Sinal de ${money(invoice.sinal)} via Pix. Restante: ${money(invoice.rest)}.`);
    const location = encodeURIComponent(isHome ? `${data.street}, ${data.number} - ${data.bairro}, São Paulo` : 'Bela Vista, São Paulo - SP');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}&ctz=America/Sao_Paulo`;
  };

  const goReview = () => {
    if (!chosen) { showToast(t('s1')); goBook(); return; }
    if (!step3Valid) { vibrate(50); setTouched(true); showToast(t('fill')); return; }
    vibrate(30); setReviewed(true); scrollToRef(s4Ref, 160);
  };

  const finish = () => {
    if (!step3Valid) { setTouched(true); showToast(t('fill')); scrollToRef(s3Ref, 30); return; }
    if (!data.payment) { vibrate(50); showToast(t('needPay')); return; }
    if (!ageOk) { vibrate(50); showToast(t('needAge')); return; }
    if (!data.date || !data.time) return;
    if (hp) { setDone(true); setSentLink('#'); return; }
    const link = whatsappLink();
    store.set('thaly_returning_final', 'yes');
    setSentLink(link); vibrate([30, 50]);
    const w = window.open(link, '_blank');
    if (!w) window.location.href = link;
    else { try { w.opener = null; } catch { /* ignorado */ } }
    setDone(true);
    scrollToRef(bookRef, 60);
  };

  const resetBooking = () => {
    setTouched(false); setReqOk(false); setDone(false); setReviewed(false); setOffer('single');
    setData((p) => ({ ...p, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: '', addTime: false }));
  };
  const restart = () => {
    vibrate(15);
    if (store.get('thaly_returning_final') === 'yes') setIsReturning(true);
    resetBooking(); goBook();
  };

  const forgetMe = () => {
    ['thaly_returning_final', 'thaly_onboard_final', 'thaly_cid', 'thaly_name'].forEach((k) => store.del(k));
    narr.stop();
    setIsReturning(false); setAgeOk(false); setCoupon({ input: '', applied: '', value: 0, error: '' });
    resetBooking(); setData((p) => ({ ...p, name: '' }));
    setProfileOpen(false); setPhase('welcome'); showToast(t('forgot'));
  };

  const enter = () => {
    if (!ageOk) { vibrate(50); showToast(t('needAgeEnter')); return; }
    vibrate(30); store.set('thaly_onboard_final', 'yes'); setPhase('site');
  };

  const dayName = (d: Date, i: number) => (i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmt(d, { weekday: 'short' }).replace('.', ''));
  const greeting = now.getHours() < 12 ? t('gm') : now.getHours() < 18 ? t('ga') : t('gn');
  const chatLink = waLink(t('chatMsg'));
  const nextLabel = nextFree ? `${nextFree.k === 0 ? t('today') : nextFree.k === 1 ? t('tomorrow') : fmt(nextFree.d, { weekday: 'long' })} ${nextFree.t}` : '';

  const renderAge = (id: string) => (
    <div className="flex items-start gap-3 text-sm leading-relaxed">
      <Checkbox id={id} checked={ageOk} onCheckedChange={(c) => setAgeOk(c === true)} className={CHK} />
      <p>
        <Label htmlFor={id} className={cn(LBL_CHK, 'inline')}>{t('ageA')} </Label>
        <LinkBtn onClick={() => setDoc('privacy')}>{t('privacy')}</LinkBtn>, <LinkBtn onClick={() => setDoc('terms')}>{t('terms')}</LinkBtn> {t('and')} <LinkBtn onClick={() => setDoc('refund')}>{t('refund')}</LinkBtn>.
      </p>
    </div>
  );

  const styleTag = <style dangerouslySetInnerHTML={{ __html: CSS }} />;
  const toaster = <Toaster position="top-center" theme={theme} toastOptions={{ style: { fontFamily: "'Manrope', system-ui, sans-serif", fontSize: 15 } }} />;

  /* ---------------------------- Carregando ---------------------------- */
  if (phase === 'loading') {
    return (
      <div className="app flex flex-col items-center justify-center px-6 text-center" role="status" aria-live="polite" aria-busy="true">
        {styleTag}
        <div className="relative" style={{ width: 176, height: 176 }}>
          <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} /><span className="ring" style={{ animationDelay: '2.4s' }} />
          <div className="core"><Avatar className="h-full w-full rounded-full text-4xl" alt="" /></div>
        </div>
        <h1 className="serif rise mt-10 font-light" style={{ fontSize: 'clamp(30px,7vw,44px)', letterSpacing: '-0.01em', animationDelay: '.3s' }}>{SITE_NAME}</h1>
        <p className="rise mt-3 text-sm text-[var(--mute)]" style={{ animationDelay: '.7s' }}>{t('loadMsg')}</p>
        <div className="mt-8 h-[3px] w-48 overflow-hidden rounded-full bg-[var(--line)]"><div className="loadbar h-full bg-[var(--acc)]" /></div>
      </div>
    );
  }

  /* ------------------------------ Página ------------------------------ */
  return (
    <div className="app" style={{ paddingBottom: showBar ? 96 : 24 }}>
      {styleTag}
      {toaster}

      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[300] focus:rounded-full focus:bg-[var(--acc)] focus:px-5 focus:py-3 focus:font-bold focus:text-[var(--onacc)]">{t('skip')}</a>

      <header className="sticky top-0 z-50 border-b border-[var(--line)] backdrop-blur-[14px]" style={{ background: 'color-mix(in srgb,var(--bg) 88%,transparent)', paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2 px-4 py-2">
          <Button type="button" variant="ghost" onClick={() => { vibrate(10); setProfileOpen(true); }} aria-label={t('openProfile')} aria-haspopup="dialog" className="h-auto min-w-0 gap-3 rounded-xl px-1 py-1 hover:bg-transparent">
            <Avatar className="size-11 rounded-full" alt="" />
            <span className="serif hidden whitespace-nowrap text-[17px] min-[430px]:inline">Relaxar hoje</span>
          </Button>
          <div className="flex shrink-0 items-center gap-2">
            <ToggleGroup type="single" value={lang} onValueChange={(v) => { if (v) { vibrate(10); setLang(v as Lang); } }} aria-label={t('lang')} className="gap-0 rounded-full border border-[var(--line)] bg-[var(--surf)] p-0.5">
              {(['pt', 'en', 'es'] as Lang[]).map((l) => (
                <ToggleGroupItem key={l} value={l} aria-label={LANG_NAME[l]} className="h-10 min-w-11 rounded-full px-2 text-xs font-extrabold text-[var(--mute)] hover:bg-transparent hover:text-[var(--ink)] data-[state=on]:bg-[var(--ink)] data-[state=on]:text-[var(--bg)]">{l.toUpperCase()}</ToggleGroupItem>
              ))}
            </ToggleGroup>
            <Button type="button" variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('srLight') : t('srDark')} title={t('theme')} className="size-11 rounded-full text-[var(--ink)] hover:bg-[var(--surf2)]">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-5">
        {phase === 'welcome' && (
          <section className="mx-auto flex min-h-[84dvh] max-w-xl flex-col justify-center py-10" aria-labelledby="wt">
            <div className="rise relative mb-9" style={{ width: 104, height: 104 }}>
              <span className="ring" /><span className="ring" style={{ animationDelay: '1.8s' }} />
              <div className="core" style={{ width: 104, height: 104 }}><Avatar className="h-full w-full rounded-full text-4xl" alt="Thalyson" /></div>
            </div>
            <p className="rise mb-4 inline-flex items-center gap-2 self-start text-sm font-semibold text-[var(--mute)]" style={{ animationDelay: '.1s' }}><Icon name="map" size={16} /> {t('badge')}</p>
            <h1 id="wt" className="serif rise mb-5 font-light leading-[1.02]" style={{ fontSize: 'clamp(46px,12vw,78px)', letterSpacing: '-0.02em', animationDelay: '.2s' }}>Relaxar hoje<br />com Thalyson</h1>
            <p className="rise mb-8 text-lg leading-relaxed text-[var(--mute)]" style={{ animationDelay: '.35s' }}>{t('wSub')}</p>
            <ul className="rise mb-9 grid gap-3" style={{ animationDelay: '.5s' }}>
              {[['w1', 'clock'], ['w2', 'lock'], ['w3', 'shield']].map(([k, ic]) => (<li key={k} className="flex items-center gap-3 font-semibold"><Icon name={ic as IconName} size={20} />{t(k)}</li>))}
            </ul>
            <div className="rise mb-6" style={{ animationDelay: '.6s' }}>{renderAge('age-w')}</div>
            <Button type="button" onClick={enter} disabled={!ageOk} className={cn(BTN_P, 'rise w-full min-h-[62px] text-[17px]')} style={{ animationDelay: '.7s' }}>{ageOk ? t('enter') : t('needAgeEnter')}</Button>
          </section>
        )}

        {phase === 'site' && (<>
          {/* Hero */}
          <section className="relative flex flex-col justify-center pb-16 pt-14" style={{ minHeight: 'calc(100svh - 76px)' }}>
            <div className="glow" aria-hidden="true" />
            <div className="relative">
              <Reveal><p className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--mute)]"><Icon name="map" size={16} /> {t('badge')}</p></Reveal>
              <Title as="h1" className="mb-4" style={{ fontSize: 'clamp(50px,13vw,92px)' }}>{t('h1')}</Title>
              <Reveal delay={250}><p className="mb-8 max-w-md text-lg leading-relaxed text-[var(--mute)]">{isReturning ? t('smartSub') : t('sub')}</p></Reveal>
              <Reveal delay={380}>
                <div className="mb-8 flex flex-wrap gap-3">
                  <Button type="button" onClick={goBook} className={cn(BTN_P, 'min-h-[60px] px-9 text-[17px]')}>{t('cta')}</Button>
                  <Button asChild variant="outline" className={cn(BTN_G, 'min-h-[60px]')}>
                    <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer"><Icon name="star" size={18} /> {t('reviews')}</a>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={500}>
                {nextFree && (
                  <p className="flex items-center gap-3 text-sm text-[var(--mute)]"><span className="dot shrink-0" aria-hidden="true" /><span>{t('nextFree')}: <strong className="text-[var(--ink)]">{nextLabel}</strong></span></p>
                )}
                <p className="mt-1 text-sm text-[var(--mute)]">{t('fromM')} {money(Math.min(...MASSAGES.map((p) => p.price)))}</p>
              </Reveal>
            </div>
          </section>

          {/* Garantias */}
          <Reveal className="mb-24">
            <ul className="grid gap-5 sm:grid-cols-3" aria-label={t('guar')}>
              {[['t1', 'lock'], ['t2', 'shield'], ['t3', 'star']].map(([k, ic]) => (
                <li key={k} className="flex items-start gap-3 text-[15.5px] leading-snug"><Icon name={ic as IconName} size={22} className="mt-0.5" />{t(k)}</li>
              ))}
            </ul>
          </Reveal>

          {/* Ofertas */}
          <section className="mb-28" aria-labelledby="off">
            <Title id="off" className="mb-3 text-[34px] md:text-[44px]">{t('offH')}</Title>
            <Reveal delay={120}><p className="mb-8 text-[var(--mute)]">{t('offS')}</p></Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {([['combo', 'cbT', 'cbD', 'plus'], ['pack', 'lyT', 'lyD', 'gift']] as [Offer, string, string, IconName][]).map(([o, a, b, ic], i) => (
                <Reveal key={o} delay={i * 120} className="h-full">
                  <Card className={cn(CARD, 'h-full transition-colors hover:bg-[var(--surf2)]')}>
                    <button type="button" onClick={() => pickOffer(o)} className="flex h-full w-full flex-col gap-3 rounded-3xl p-6 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--acc)]">
                      <Icon name={ic} size={28} />
                      <span className="serif mt-2 text-[28px] leading-tight text-balance">{t(a)}</span>
                      <span className="text-[15.5px] text-[var(--mute)]">{t(b)}</span>
                      <span className="mt-auto pt-2 font-semibold underline underline-offset-4">{t('see')}</span>
                    </button>
                  </Card>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Agendamento */}
          <section ref={bookRef} className="mb-28 scroll-mt-24" aria-label={t('cta')}>
            {done ? (
              <Reveal>
                <Card className={cn(CARD, 'border-none bg-[var(--surf2)] p-8 text-center')}>
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full text-[var(--ok)]" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)' }}><Icon name="check" size={32} /></div>
                  <h2 className="serif mb-4 text-4xl font-light">{t('doneH')}</h2>
                  <p className="mb-4 leading-relaxed text-[var(--mute)]">{t('doneP')}</p>
                  <p className="mb-8 font-bold">{t('doneSig')} ({money(invoice.sinal)})</p>
                  <div className="mx-auto max-w-xs space-y-3">
                    <Button asChild className={cn(BTN_P, 'w-full')}>
                      <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer">{t('resend')}</a>
                    </Button>
                    <Button type="button" variant="outline" onClick={copyPix} className={cn(BTN_G, 'w-full')}><Icon name="copy" size={16} /> {t('copyPix')}</Button>
                    {googleCalendarLink() && (
                      <Button asChild variant="outline" className={cn(BTN_G, 'w-full')}>
                        <a href={googleCalendarLink()} target="_blank" rel="noopener noreferrer"><Icon name="cal" size={16} /> {t('addCal')}</a>
                      </Button>
                    )}
                    <Button type="button" variant="link" onClick={restart} className="h-auto min-h-12 w-full whitespace-normal text-sm text-[var(--mute)] underline underline-offset-4 hover:text-[var(--ink)]">{t('restart')}</Button>
                  </div>
                </Card>
              </Reveal>
            ) : (
              <div className="space-y-24">
                {/* 1. Sessão */}
                <div>
                  <StepHead n={1} title={t('s1')} done={chosen} />
                  <RadioGroup value={data.packageId} onValueChange={pickPkg} aria-label={t('s1')} className="grid gap-3 md:grid-cols-2">
                    {PACKAGES.map((p, i) => {
                      const on = data.packageId === p.id;
                      const L = p.L[lang];
                      const isRec = p.id === recommendedPkgId && !chosen;
                      const isDark = theme === 'dark';
                      const themeColors: Record<PkgTheme, string> = {
                        sage: isDark ? '94, 184, 140' : '43, 76, 59',
                        amber: isDark ? '235, 157, 75' : '143, 90, 26',
                        crimson: isDark ? '224, 102, 92' : '140, 59, 50',
                        midnight: isDark ? '171, 142, 204' : '61, 43, 76',
                        slate: isDark ? '148, 163, 184' : '90, 100, 110',
                      };
                      const rgb = themeColors[p.theme];
                      const mine = narr.activeId === p.id;
                      const playing = mine && narr.state === 'playing';
                      const paused = mine && narr.state === 'paused';
                      const narrText = `${L.title}. ${L.desc} ${t('flowH')}: ${L.flow.join(' ')}`;
                      return (
                        <Reveal key={p.id} delay={(i % 2) * 80} className={on ? 'md:col-span-2' : ''}>
                          <div
                            className="overflow-hidden rounded-[22px] border border-[var(--line)] bg-[var(--surf)] transition-colors"
                            style={{
                              borderColor: on ? `rgb(${rgb})` : isRec ? `rgba(${rgb}, 0.5)` : undefined,
                              boxShadow: on ? `0 0 0 1px rgb(${rgb})` : isRec ? `0 0 0 1px rgba(${rgb}, 0.3)` : undefined,
                              backgroundColor: on ? `rgba(${rgb}, 0.05)` : isRec ? `rgba(${rgb}, 0.03)` : undefined,
                            }}
                          >
                            <Label htmlFor={`pkg-${p.id}`} className="block cursor-pointer px-5 py-4 text-base font-normal leading-snug has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-[color:var(--acc)]">
                              <RadioGroupItem id={`pkg-${p.id}`} value={p.id} className="sr-only" />
                              {isRec && (
                                <Badge className="mb-2 gap-1.5 whitespace-normal rounded-full border-0 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide shadow-none hover:bg-transparent" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>
                                  <Icon name="sparkle" size={12} /> {t('recommended')}
                                </Badge>
                              )}
                              <span className="flex items-baseline justify-between gap-4">
                                <span className="serif text-[22px] leading-tight text-balance">{L.title}</span>
                                <span className="serif shrink-0 text-[22px] font-semibold" style={{ color: on || isRec ? `rgb(${rgb})` : 'var(--acc)' }}>{money(p.price)}</span>
                              </span>
                              <span className="mt-1 block text-sm text-[var(--mute)]">{p.min} {t('min')}, {L.tags.slice(0, 2).join(' • ')}</span>
                            </Label>
                            {on && (
                              <div className="rise border-t border-[var(--line)] px-5 pb-5">
                                <p className="mb-4 pt-4 text-[15.5px] leading-relaxed">{L.desc}</p>
                                <div className="mb-4 flex flex-wrap gap-2">
                                  {L.tags.map((g) => (
                                    <Badge key={g} variant="secondary" className="whitespace-normal rounded-full border-0 px-3 py-1.5 text-center text-xs font-bold shadow-none hover:bg-transparent" style={{ backgroundColor: `rgba(${rgb}, 0.12)`, color: `rgb(${rgb})` }}>{g}</Badge>
                                  ))}
                                </div>
                                <p className="mb-2 text-sm font-bold">{t('flowH')}</p>
                                <ol className="mb-4 list-decimal space-y-1 pl-5 text-[15.5px] leading-relaxed text-[var(--mute)]">
                                  {L.flow.map((s) => <li key={s}>{s}</li>)}
                                </ol>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    type="button" variant="outline" disabled={!narr.supported}
                                    onClick={() => { vibrate(10); narr.toggle(p.id, narrText); }}
                                    className={cn(BTN_G, 'min-h-12 flex-1 basis-44 text-sm')}
                                    style={{ borderColor: `rgba(${rgb}, 0.45)`, color: `rgb(${rgb})` }}
                                  >
                                    <Icon name={playing ? 'pause' : 'play'} size={16} />
                                    {playing ? t('pause') : paused ? t('resume') : t('listen')}
                                  </Button>
                                  {mine && (
                                    <Button type="button" variant="outline" onClick={() => { vibrate(10); narr.stop(); }} className={cn(BTN_G, 'min-h-12 text-sm')}>
                                      <Icon name="stop" size={14} /> {t('stopA')}
                                    </Button>
                                  )}
                                </div>
                                {!narr.supported && <p className="mt-2 text-xs text-[var(--mute)]" role="status">{t('noTts')}</p>}
                                {mine && narr.supported && !narr.male && <p className="mt-2 text-xs text-[var(--mute)]" role="status">{t('voiceLow')}</p>}
                              </div>
                            )}
                          </div>
                        </Reveal>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* 2. Oferta */}
                {chosen && !isSolo && (
                  <div className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={2} title={t('s2')} done={true} />
                      <RadioGroup value={offerEff} onValueChange={(v) => { vibrate(15); setOffer(v as Offer); }} aria-label={t('s2')} className="grid gap-3">
                        {([
                          ['single', t('oSingle'), t('oSingleD'), pkg.price, 0, 0],
                          ['combo', t('oCombo'), t('oComboD'), pkg.price + pkg.combo, pkg.price + C.APARO_FULL, C.APARO_FULL - pkg.combo],
                          ['pack', t('oPack'), t('oPackD').replace('{n}', String(C.PACK_DAYS)), pkg.price * C.PACK_PAY, pkg.price * C.PACK_TOTAL, pkg.price],
                        ] as [Offer, string, string, number, number, number][]).map(([o, a, b, price, was, sv]) => (
                          <Label key={o} className={cn('block cursor-pointer rounded-[22px] border border-[var(--line)] bg-[var(--surf)] p-5 text-base font-normal leading-snug transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[color:var(--acc)]', offerEff === o && 'border-[var(--acc)] bg-[var(--surf2)] shadow-[0_0_0_1px_var(--acc)]')}>
                            <RadioGroupItem value={o} className="sr-only" />
                            <span className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 sm:flex-nowrap">
                              <span className="min-w-0 flex-1"><span className="block font-bold">{a}</span><span className="mt-1 block text-sm text-[var(--mute)]">{b}</span></span>
                              <span className="shrink-0 text-right">
                                <span className="serif block text-[22px] leading-none text-[var(--acc)]">{money(price)}</span>
                                {sv > 0 && <span className="mt-1 block text-xs"><s className="text-[var(--mute)]">{money(was)}</s></span>}
                              </span>
                            </span>
                            {sv > 0 && <Badge className="mt-3 whitespace-normal rounded-full border-0 px-3 py-1.5 text-xs font-extrabold shadow-none hover:bg-transparent" style={{ background: 'color-mix(in srgb,var(--ok) 16%,transparent)', color: 'var(--ok)' }}>{t('save')} {money(sv)}</Badge>}
                          </Label>
                        ))}
                      </RadioGroup>
                      {isPack && <p className="mt-4 text-sm leading-relaxed text-[var(--mute)]">{t('packNote')}</p>}
                    </Reveal>
                  </div>
                )}

                {/* 3. Quando e onde */}
                {chosen && (
                  <div ref={s3Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 2 : 3} title={t('s3')} done={step3Valid} />
                      <div className="space-y-9">
                        <div className="min-w-0">
                          <p className={LBL} id="date-lbl">{t('date')}</p>
                          <RadioGroup
                            aria-labelledby="date-lbl" orientation="horizontal"
                            value={data.date ? dateKey(data.date) : ''}
                            onValueChange={(v) => { const f = days.find((x) => dateKey(x.d) === v); if (f) set({ date: f.d, time: '' }); }}
                            className="hide-sb -mx-5 flex w-auto max-w-none snap-x gap-3 overflow-x-auto px-5 py-1"
                          >
                            {days.map(({ d, i }) => {
                              const sel = sameDay(data.date, d);
                              return (
                                <Label key={dateKey(d)} className={cn(CHIP, 'w-20 min-w-20 shrink-0 snap-start flex-col py-3', sel && CHIP_ON)}>
                                  <RadioGroupItem value={dateKey(d)} aria-label={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} className="sr-only" />
                                  <span aria-hidden="true" className="text-xs font-bold capitalize">{dayName(d, i)}</span>
                                  <span aria-hidden="true" className="serif text-[28px] leading-tight">{d.getDate()}</span>
                                  <span aria-hidden="true" className="text-xs opacity-70">{fmt(d, { month: 'short' }).replace('.', '')}</span>
                                </Label>
                              );
                            })}
                          </RadioGroup>
                          {touched && errors.date && <p className="err" role="alert">{errors.date}</p>}
                        </div>

                        {data.date && (
                          <div className="rise min-w-0">
                            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-4">
                              <p className={cn(LBL, 'mb-0')} id="time-lbl">{t('time')}</p>
                              <span className="text-xs text-[var(--mute)]">{t('session')} {invoice.dur} {t('min')}</span>
                            </div>
                            {availableCount > 0 && availableCount <= 2 && <p className="mb-3 text-xs font-bold text-[var(--warn)]">{t('lastSlots')}</p>}
                            <RadioGroup aria-labelledby="time-lbl" value={data.time} onValueChange={(v) => { vibrate(15); set({ time: v }); }} className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                              {slots.map(({ t: tm, ok }) => {
                                const sel = data.time === tm;
                                const peak = isHome && PEAK_HOURS.includes(tm);
                                return (
                                  <Label key={tm} className={cn(CHIP, 'flex-col py-3', sel && CHIP_ON, !ok && CHIP_OFF)}>
                                    <RadioGroupItem value={tm} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} className="sr-only" />
                                    <span aria-hidden="true">{tm}</span>
                                    {peak && ok && <span aria-hidden="true" className={cn('text-[11px] font-bold', !sel && 'text-[var(--warn)]')}>{t('peak')} +{C.PEAK_FEE}</span>}
                                  </Label>
                                );
                              })}
                            </RadioGroup>
                            {availableCount === 0 && <p className="py-5 text-center text-sm text-[var(--mute)]">{t('noSlots')}</p>}
                            {data.time && <p className="mt-4 flex items-center gap-2 text-[15.5px] font-semibold text-[var(--ok)]"><Icon name="check" size={16} /> {t('from')} {data.time} {t('to')} {endTime}</p>}
                            <p className="mt-3 text-xs text-[var(--mute)]">{t('demo')}</p>
                            {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                          </div>
                        )}

                        <div>
                          <Label htmlFor="nm" className={LBL}>{t('name')}</Label>
                          <Input id="nm" autoComplete="given-name" type="text" value={data.name} maxLength={60} placeholder={t('namePh')} onChange={(e) => set({ name: e.target.value })} className={INP} aria-invalid={touched && !!errors.name} aria-describedby={touched && errors.name ? 'nm-err' : undefined} />
                          {touched && errors.name && <p id="nm-err" className="err" role="alert">{errors.name}</p>}
                          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>

                        <div className="min-w-0">
                          <p className={LBL} id="loc-lbl">{t('place')}</p>
                          <RadioGroup
                            aria-labelledby="loc-lbl"
                            value={data.locType}
                            onValueChange={(v) => {
                              const nextLoc = v as 'studio' | 'home';
                              set({ locType: nextLoc });
                              if (nextLoc === 'studio') set({ cep: '', street: '', number: '', comp: '', bairro: '' });
                            }}
                            className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2"
                          >
                            {([['studio', t('studio')], ['home', t('home')]] as const).map(([id, label]) => (
                              <Label key={id} className={cn(CHIP, data.locType === id && CHIP_ON)}>
                                <RadioGroupItem value={id} className="sr-only" />{label}
                              </Label>
                            ))}
                          </RadioGroup>
                          <p className="mt-3 text-sm leading-relaxed text-[var(--mute)]">{isHome ? t('peakNote') : t('studioInfo')}</p>
                        </div>

                        {isHome && (
                          <div className="rise space-y-3">
                            <Input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder={t('cep')} aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className={INP} />
                            <Input type="text" autoComplete="street-address" placeholder={t('street')} aria-label={t('street')} maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className={INP} />
                            <div className="flex gap-3">
                              <Input ref={numberRef} type="text" inputMode="numeric" placeholder={t('number')} aria-label={t('number')} maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className={cn(INP, 'w-1/3')} />
                              <Input type="text" placeholder={t('comp')} aria-label={t('comp')} maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className={cn(INP, 'w-2/3')} />
                            </div>
                            <Input type="text" placeholder={t('bairro')} aria-label={t('bairro')} maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className={INP} />
                            {touched && errors.address && <p className="err" role="alert">{errors.address}</p>}
                          </div>
                        )}

                        <div>
                          <Button type="button" className={cn(BTN_P, 'w-full min-h-[60px]')} onClick={goReview}>{t('cont')}</Button>
                          <p className="mt-4 text-center text-sm text-[var(--mute)]">{t('chatQ')} <a href={chatLink} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--ink)] underline underline-offset-4">{t('chatBtn')}</a></p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                )}

                {/* 4. Resumo */}
                {chosen && reviewed && (
                  <div ref={s4Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 3 : 4} title={t('s4')} done={false} />
                      <div className="space-y-8">
                        <Card className={cn(CARD, 'space-y-3 p-6')}>
                          <Row label={t('sPack')} value={pt.title} />
                          <Row label={t('sWhen')} value={data.date ? `${fmt(data.date, { weekday: 'short', day: '2-digit', month: 'short' })}, ${data.time} – ${endTime}` : ''} />
                          <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number}` : t('sLocStudio')} />
                          <Button type="button" variant="link" onClick={() => scrollToRef(s3Ref, 30)} className="h-auto min-h-11 justify-start p-0 text-sm font-semibold text-[var(--ink)] underline underline-offset-4">{t('change')}</Button>
                        </Card>

                        <div className="min-w-0">
                          <p className={LBL} id="pay-lbl">{t('pay')}</p>
                          <RadioGroup aria-labelledby="pay-lbl" value={data.payment} onValueChange={(v) => { vibrate(15); set({ payment: v }); }} className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-3">
                            {(['pix', 'card', 'cash'] as const).map((p) => (
                              <Label key={p} className={cn(CHIP, 'px-2 text-[15px]', data.payment === p && CHIP_ON)}>
                                <RadioGroupItem value={p} className="sr-only" />{t(p)}
                              </Label>
                            ))}
                          </RadioGroup>
                          {data.payment === 'card' && <p className="mt-3 text-sm text-[var(--mute)]">{t('cardNote')}</p>}
                        </div>

                        <Card className={cn(CARD, 'px-6')}>
                          <Accordion type="single" collapsible>
                            <AccordionItem value="extras" className="border-b-0">
                              <AccordionTrigger className="min-h-[60px] py-4 text-left text-base font-bold hover:no-underline">{t('extras')}</AccordionTrigger>
                              <AccordionContent className="space-y-6 px-1 pb-6 text-base">
                                <div className="flex items-center gap-3">
                                  <Checkbox id="add-time" checked={data.addTime} onCheckedChange={(c) => { vibrate(15); set({ addTime: c === true }); }} className={cn(CHK, 'mt-0')} />
                                  <Label htmlFor="add-time" className="min-h-11 flex-1 cursor-pointer justify-between gap-3 text-base font-normal leading-snug">
                                    <span>{t('lTime')}</span><span className="font-bold">+ {money(C.TIME_ADD)}</span>
                                  </Label>
                                </div>

                                <div>
                                  <Label htmlFor="cp" className={LBL}>{t('couponQ')}</Label>
                                  {coupon.applied ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surf2)] px-4 py-3">
                                        <span className="font-bold text-[var(--ok)]">{coupon.applied}</span>
                                        <Button type="button" variant="ghost" size="sm" onClick={removeCoupon} className="h-8 gap-1 px-2 text-xs text-[var(--mute)] hover:text-[var(--ink)]">
                                          <Icon name="x" size={14} /> {t('remove')}
                                        </Button>
                                      </div>
                                      {isPack && <p className="text-xs text-[var(--warn)]">{t('couponPackNote')}</p>}
                                    </div>
                                  ) : isPack ? (
                                    <p className="text-xs text-[var(--mute)]">{t('couponPackNote')}</p>
                                  ) : (
                                    <>
                                      <div className="flex gap-2">
                                        <Input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className={cn(INP, 'min-w-0 flex-1 uppercase')} aria-describedby={coupon.error ? 'cp-err' : undefined} />
                                        <Button type="button" variant="outline" onClick={applyCoupon} className={BTN_G}>{t('apply')}</Button>
                                      </div>
                                      {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                                    </>
                                  )}
                                </div>

                                <div>
                                  <p className={LBL}>{t('reqQ')}</p>
                                  <div className="mb-3 flex items-start gap-3 text-sm leading-relaxed">
                                    <Checkbox id="req-ok" checked={reqOk} onCheckedChange={(c) => { setReqOk(c === true); if (c !== true) set({ req: '' }); }} className={CHK} />
                                    <p className="text-[var(--mute)]"><Label htmlFor="req-ok" className={cn(LBL_CHK, 'inline')}>{t('reqConsent')} </Label><LinkBtn onClick={() => setDoc('privacy')}>{t('learn')}</LinkBtn></p>
                                  </div>
                                  <Label htmlFor="rq" className="sr-only">{t('reqPh')}</Label>
                                  <Input id="rq" type="text" disabled={!reqOk} placeholder={t('reqPh')} maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className={INP} />
                                  <p className="mt-3 text-xs text-[var(--mute)]">{t('reqNote')}</p>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </Card>

                        <Card className={cn(CARD, 'p-6')}>
                          <div className="mb-5 space-y-3">
                            <Row label={isPack ? t('lPack5') : t('lPack')} value={money(invoice.sessionPrice)} />
                            {invoice.aparoAdd > 0 && <Row label={t('lCombo')} value={`+${money(invoice.aparoAdd)}`} />}
                            {invoice.timeAdd > 0 && <Row label={t('lTime')} value={`+${money(invoice.timeAdd)}`} />}
                            {invoice.reqFee > 0 && <Row label={t('lReq')} value={`+${money(invoice.reqFee)}`} />}
                            {invoice.discount > 0 && <Row tone="ok" label={coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')} value={`-${money(invoice.discount)}`} />}
                            {invoice.pixDiscount > 0 && <Row tone="ok" label={t('lPix')} value={`-${money(invoice.pixDiscount)}`} />}
                            {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                          </div>
                          <Separator className="bg-[var(--line)]" />
                          <div className="flex items-end justify-between gap-4 pt-5">
                            <span className="text-[var(--mute)]">{t('total')}</span>
                            <span className="serif text-[46px] font-light leading-none">{money(invoice.total)}</span>
                          </div>
                          {invoice.saved > 0 && <p className="mt-4 rounded-2xl py-2.5 text-center text-[15px] font-extrabold text-[var(--ok)]" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)' }}>{t('saved')} {money(invoice.saved)}</p>}
                          <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                            <div className="rounded-2xl bg-[var(--surf2)] p-3"><p className="text-xs text-[var(--mute)]">{t('signal')}</p><p className="font-extrabold">{money(invoice.sinal)}</p></div>
                            <div className="rounded-2xl bg-[var(--surf2)] p-3"><p className="text-xs text-[var(--mute)]">{t('rest')}</p><p className="font-extrabold">{money(invoice.rest)}</p></div>
                          </div>
                        </Card>

                        <p className="text-[15.5px] leading-relaxed">
                          {t('sigA')} <strong>{money(invoice.sinal)}</strong> {t('sigB')}{' '}
                          <Button type="button" variant="link" onClick={copyPix} className="inline-flex h-auto min-h-11 gap-1 whitespace-normal p-0 text-left font-semibold text-[var(--ink)] underline underline-offset-4"><Icon name="copy" size={15} /> {t('copyPix')}</Button>
                        </p>

                        <div className="flex items-start gap-3 text-sm leading-relaxed text-[var(--mute)]">
                          <Checkbox id="opt-in" checked={optIn} onCheckedChange={(c) => setOptIn(c === true)} className={CHK} />
                          <Label htmlFor="opt-in" className={LBL_CHK}>{t('optIn')}</Label>
                        </div>

                        {renderAge('age-ok')}

                        <Button type="button" onClick={finish} disabled={!data.payment || !ageOk} className={cn(BTN_P, 'w-full min-h-16 text-[17px]')}>
                          {!data.payment ? t('needPay') : !ageOk ? t('needAge') : t('send')}
                        </Button>
                      </div>
                    </Reveal>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Sobre */}
          <section className="mb-24" aria-labelledby="ab">
            <Reveal>
              <div className="mb-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                <Avatar className="size-20 rounded-full" alt="Thalyson" />
                <div>
                  <Title id="ab" className="text-[26px] md:text-[32px]">{t('aboutH')}</Title>
                  <p className="text-sm font-bold">{t('aboutR')}</p>
                </div>
              </div>
              <p className="mx-auto mb-3 max-w-xl text-center leading-relaxed text-[var(--mute)] sm:mx-0 sm:text-left">{t('about1')}</p>
              <p className="mx-auto mb-6 flex max-w-xl items-start justify-center gap-3 text-left text-[15.5px] leading-relaxed sm:mx-0 sm:justify-start"><Icon name="map" size={18} className="mt-1" />{t('about2')}</p>
              <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                <Button type="button" onClick={() => setProfileOpen(true)} className={cn(BTN_P, 'min-h-[50px]')}>{t('seeProfile')}</Button>
                <Button asChild variant="outline" className={cn(BTN_G, 'min-h-[50px]')}>
                  <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={18} /> Instagram</a>
                </Button>
              </div>
            </Reveal>
          </section>

          {/* FAQ */}
          <section className="mb-8" aria-labelledby="fq">
            <Title id="fq" className="mb-6 text-[32px] md:text-[40px]">{t('faqH')}</Title>
            <Reveal>
              <Card className={cn(CARD, 'px-6')}>
                <Accordion type="single" collapsible>
                  {[['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4']].map(([q, a]) => (
                    <AccordionItem key={q} value={q} className="border-[var(--line)]">
                      <AccordionTrigger className="min-h-[60px] py-4 text-left text-base font-bold hover:no-underline">{t(q)}</AccordionTrigger>
                      <AccordionContent className="pb-4 text-base leading-relaxed text-[var(--mute)]">{t(a)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </Reveal>
          </section>
        </>)}
      </main>

      <footer className="mx-auto mt-16 max-w-xl border-t border-[var(--line)] px-6 pt-6 text-center text-xs leading-relaxed text-[var(--mute)]">
        <nav aria-label={t('legalNav')} className="flex flex-wrap justify-center gap-x-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <Button key={id} type="button" variant="link" onClick={() => setDoc(id)} className="h-auto min-h-11 whitespace-normal px-2 text-xs text-[var(--mute)] underline underline-offset-4 hover:text-[var(--ink)]">{t(k)}</Button>
          ))}
        </nav>
        <p className="mt-2">{SITE_NAME}<br />{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}<br />{LEGAL.ENDERECO}<br /><span className="[overflow-wrap:anywhere]">{LEGAL.EMAIL}</span></p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
      </footer>

      {showBar && !done && (
        <div className="bar">
          <div className="mx-auto flex max-w-3xl items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs leading-tight text-[var(--mute)]">{chosen ? pt.title : t('fromM')}</p>
              <p className="serif text-2xl leading-none">{money(chosen ? invoice.total : Math.min(...MASSAGES.map((p) => p.price)))}</p>
            </div>
            <Button type="button" onClick={goBook} className={cn(BTN_P, 'shrink-0')}>{t('cta')}</Button>
          </div>
        </div>
      )}

      {/* Perfil */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className={DLG}>
          <DialogHeader className="border-b border-[var(--line)] p-5 pr-14 text-left">
            <DialogTitle className="serif text-xl font-normal">{t('profile')}</DialogTitle>
            <DialogDescription className="sr-only">{t('aboutH')}</DialogDescription>
          </DialogHeader>
          <div className="p-6">
            <div className="mb-5 flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <Avatar className="size-24 rounded-full" alt="Thalyson" />
              <div>
                <h3 className="serif text-2xl leading-tight">{t('aboutH')}</h3>
                <p className="text-sm font-bold">{t('aboutR')}</p>
              </div>
            </div>
            <p className="mb-2 leading-relaxed">{greeting}. {t('about1')}</p>
            <ul className="my-4 space-y-2">
              {['pBul1', 'pBul2', 'pBul3'].map((k) => (<li key={k} className="flex items-start gap-3 text-[15.5px] leading-relaxed"><Icon name="check" size={18} className="mt-1" /><span>{t(k)}</span></li>))}
            </ul>
            <dl className="mb-6 space-y-4 rounded-2xl bg-[var(--surf2)] p-5">
              {([['pHours', t('pHoursV').replace('{a}', fromMin(C.OPEN)).replace('{b}', fromMin(C.LAST_END))], ['pWhere', t('pWhereV')], ['pPay', t('pPayV')], ['pCancel', t('pCancelV')]] as [string, string][]).map(([k, v]) => (
                <div key={k}><dt className="text-xs font-bold text-[var(--mute)]">{t(k)}</dt><dd className="text-[15.5px] font-semibold">{v}</dd></div>
              ))}
              <div><dt className="text-xs font-bold text-[var(--mute)]">{t('sLoc')}</dt><dd className="text-[15.5px] font-semibold">{t('about2')}</dd></div>
            </dl>
            <div className="mb-6 grid gap-3">
              {phase === 'site' && <Button type="button" className={cn(BTN_P, 'w-full')} onClick={() => { setProfileOpen(false); goBook(); }}>{t('cta')}</Button>}
              <Button asChild variant="outline" className={cn(BTN_G, 'w-full')}>
                <a href={chatLink} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> {t('chatBtn')}</a>
              </Button>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                <Button asChild variant="outline" className={cn(BTN_G, 'min-h-[50px]')}>
                  <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={18} /> Instagram</a>
                </Button>
                <Button asChild variant="outline" className={cn(BTN_G, 'min-h-[50px]')}>
                  <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer"><Icon name="star" size={18} /> {t('reviews')}</a>
                </Button>
              </div>
            </div>
            <Button type="button" variant="link" onClick={forgetMe} className="h-auto min-h-12 w-full whitespace-normal text-sm text-[var(--mute)] underline underline-offset-4 hover:text-[var(--ink)]">{t('pForget')}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Documentos legais */}
      {doc && (
        <Dialog open onOpenChange={(o) => { if (!o) setDoc(null); }}>
          <DialogContent className={DLG}>
            <DialogHeader className="border-b border-[var(--line)] p-5 pr-14 text-left">
              <DialogTitle className="serif text-xl font-normal">{DOCS[doc].title}</DialogTitle>
              <DialogDescription className="sr-only">{DOCS[doc].title}</DialogDescription>
            </DialogHeader>
            <div className="p-5 text-sm leading-relaxed text-[var(--mute)]">
              {t('legalNote') && <p className="mb-3 font-semibold text-[var(--ink)]">{t('legalNote')}</p>}
              {DOCS[doc].body}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

```
