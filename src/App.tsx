import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

// --- CONFIGURAÇÕES E DADOS ---
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
  SIGNAL: 40, FIRST: 15, REQ_FEE: 140, PEAK_FEE: 18, PIX_DISC: 0.03, TIME_ADD: 75, APARO_FULL: 130,
  PACK_PAY: 4, PACK_TOTAL: 5, PACK_DAYS: 60,
  OPEN: 9 * 60, LAST_END: 23 * 60 + 30, STEP: 60, LEAD_S: 30, LEAD_H: 60, DAYS: 14,
};
const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

type Lang = 'pt' | 'en' | 'es';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';

const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando seu momento', badge: 'Bela Vista, São Paulo',
    wSub: 'Massagem masculina premium. Escolha, agende e relaxe: a confirmação chega no seu WhatsApp.', w1: 'Reserva rápida', w2: 'Sinal de R$ 40', w3: 'Cancelamento grátis',
    enter: 'Entrar e agendar', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'O seu momento de pausa.', sub: 'Massagem masculina em São Paulo. Escolha o que seu corpo precisa hoje e deixe o resto comigo.',
    cta: 'Agendar agora', reviews: 'Avaliações', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Sessões a partir de',
    s1: 'Escolha a sessão', s2: 'Quando e onde', s3: 'Resumo e pagamento', min: 'min', flowH: 'Como funciona',
    oSingle: 'Sessão avulsa', oCombo: 'Com depilação', oPack: 'Pacote 5 sessões',
    listen: 'Ouvir descrição', pause: 'Pausar', resume: 'Continuar', stopA: 'Parar', noTts: 'Áudio não suportado.', voiceLow: 'Usando tom mais grave.',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).', place: 'Local da sessão', studio: 'No espaço', home: 'Vou até você',
    peakNote: 'Horários de pico têm taxa de R$ 18. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico (Bela Vista), próximo ao Metrô Anhangabaú. O endereço exato é enviado com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua/Avenida', number: 'Nº', comp: 'Apto/Bloco', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    cont: 'Continuar', fill: 'Complete os campos destacados', change: 'Alterar', sPack: 'Sessão', sWhen: 'Quando', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)',
    lPack: 'Sessão', lPack5: 'Pacote 5 sessões', lCombo: 'Depilação', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Desconto 1ª sessão', lCoupon: 'Cupom', lPeak: 'Taxa deslocamento', lPix: 'Desconto Pix (3%)',
    saved: 'Você economiza', total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    extras: 'Extras e cupom (opcional)', couponQ: 'Cupom de desconto', apply: 'Aplicar', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para avaliação. Não é salvo neste aparelho.',
    reqPh: 'Algum detalhe para a sessão', reqNote: 'Pedido avaliado no atendimento. Se inviável, não é cobrado.',
    pay: 'Como vai pagar o restante?', pix: 'Pix (-3%)', card: 'Cartão', cash: 'Dinheiro', cardNote: 'O cartão (até 12x) é acertado diretamente no WhatsApp antes do pagamento.',
    optIn: 'Quero receber lembretes (opcional).',
    ageA: 'Declaro ter 18 anos ou mais e li os', privacy: 'Termos de Privacidade', terms: 'Termos de Serviço', and: 'e os', refund: 'Cancelamento',
    send: 'Enviar pelo WhatsApp', needPay: 'Escolha o pagamento', needAge: 'Confirme a idade',
    doneH: 'Solicitação pronta!', doneP: 'O horário só está confirmado após a resposta no WhatsApp. Se não abriu, clique abaixo.',
    doneSig: 'Envie o comprovante na conversa.', resend: 'Abrir WhatsApp', addCal: 'Google Calendar', restart: 'Novo agendamento',
    chatQ: 'Dúvidas antes?', chatBtn: 'Falar no WhatsApp', chatMsg: 'Oi Thalyson! Vim pelo site e tenho uma dúvida.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta masculino', about1: 'Meu trabalho é direto e focado no corpo masculino: usar o toque para aliviar o peso da rotina.',
    about2: 'Atendo em suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.', seeProfile: 'Ver perfil',
    faqH: 'Dúvidas rápidas', q1: 'Como funciona o sinal?', a1: 'Você paga R$ 40 por Pix para garantir o horário. O restante é pago depois.',
    q2: 'E se eu precisar cancelar?', a2: 'Até 12 horas antes você recebe o sinal de volta.', q3: 'Quais dados preciso informar?', a3: 'Só nome, dia e pacote. Sem CPF ou e-mail.',
    q4: 'Posso pagar no cartão?', a4: 'Sim: Pix (3% off), cartão em até 12x ou dinheiro.',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento', adults: 'Serviço exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Tema', profile: 'Perfil', openProfile: 'Abrir perfil',
    pBul1: 'Conversa inicial para alinhar limites', pBul2: 'Sem pressa, com horário reservado', pBul3: 'Ambiente reservado no Centro Histórico',
    pHours: 'Atendimento', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Pagamento', pPayV: 'Pix, cartão e dinheiro',
    pWhere: 'Local', pWhereV: 'Meu espaço ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis até 12 horas antes',
    pForget: 'Apagar meus dados', forgot: 'Dados apagados', recommended: 'Recomendado', lastSlots: 'Últimos horários para hoje', demo: 'Disponibilidade demonstrativa: a reserva só vale após resposta no WhatsApp.'
  },
  en: {
    loadMsg: 'Preparing your moment', badge: 'Bela Vista, São Paulo', wSub: 'Premium men’s massage. Choose, book and relax.', w1: 'Fast booking', w2: 'R$ 40 deposit', w3: 'Free cancellation',
    enter: 'Enter and book', needAgeEnter: 'Confirm you are 18+', h1: 'Your moment to pause.', sub: 'Men’s massage in São Paulo. Choose what your body needs today.',
    cta: 'Book now', reviews: 'Reviews', nextFree: 'Next free slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Sessions from', s1: 'Choose session', s2: 'When and where', s3: 'Summary and payment', min: 'min', flowH: 'How it works',
    oSingle: 'Single session', oCombo: 'With grooming', oPack: '5-session pack', listen: 'Listen', pause: 'Pause', resume: 'Resume', stopA: 'Stop', noTts: 'Audio not supported.', voiceLow: 'Using deeper tone.',
    name: 'What should I call you?', namePh: 'Your name', nameErr: 'Min. 3 letters.', place: 'Location', studio: 'At my place', home: 'I come to you', peakNote: 'Peak hours carry a R$ 18 fee.', studioInfo: 'The suite is in Bela Vista, near Anhangabaú metro.',
    cep: 'ZIP code', street: 'Street', number: 'No.', comp: 'Apt', bairro: 'Neighborhood', addrErr: 'Fill address.', date: 'Date', time: 'Start time', session: 'Session of', peak: 'Peak', noSlots: 'No slots this day.',
    cont: 'Continue', fill: 'Complete fields', change: 'Change', sPack: 'Session', sWhen: 'When', sLoc: 'Location', sLocStudio: 'At suite', lPack: 'Session', lPack5: '5-session pack', lCombo: 'Grooming', lTime: '+30 min', lReq: 'Specific request', lFirst: '1st session gift', lCoupon: 'Coupon', lPeak: 'Travel/peak', lPix: 'Pix discount',
    saved: 'You save', total: 'Total', signal: 'Deposit now', rest: 'After session', extras: 'Extras & coupon', couponQ: 'Coupon?', apply: 'Apply', couponOk: 'Applied', couponBad: 'Invalid', reqQ: 'Specific request (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describe a request (sensitive data) for evaluation only.', reqPh: 'Any detail', reqNote: 'Evaluated on site.', pay: 'Pay remainder?', pix: 'Pix (-3%)', card: 'Card', cash: 'Cash', cardNote: 'Card fees agreed on WhatsApp.', optIn: 'Receive reminders',
    ageA: 'I am 18+ and read', privacy: 'Privacy', terms: 'Terms', and: 'and', refund: 'Cancellation', send: 'Send on WhatsApp', needPay: 'Choose payment', needAge: 'Confirm age',
    doneH: 'All set!', doneP: 'Time confirmed after WhatsApp reply.', doneSig: 'Send receipt.', resend: 'Open WhatsApp', addCal: 'Google Calendar', restart: 'New booking', chatQ: 'Questions?', chatBtn: 'WhatsApp', chatMsg: 'Hi! I have a question.',
    aboutH: 'Thalyson Massagens', aboutR: 'Male therapist', about1: 'Focused on the male body.', about2: 'Suite in downtown SP.', seeProfile: 'Profile', faqH: 'FAQ', q1: 'Deposit?', a1: 'R$ 40 via Pix.', q2: 'Cancel?', a2: 'Free up to 12h.', q3: 'Data?', a3: 'Name and date only.', q4: 'Card?', a4: 'Pix, card or cash.',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Refund', adults: '18+ only.', close: 'Close', theme: 'Theme', profile: 'Profile', openProfile: 'Profile', pBul1: 'Initial chat', pBul2: 'No rush', pBul3: 'Private suite', pHours: 'Hours', pHoursV: 'Daily, {a} to {b}', pPay: 'Payment', pPayV: 'Pix, card, cash', pWhere: 'Where', pWhereV: 'My place or yours', pCancel: 'Cancel', pCancelV: 'Free up to 12h', pForget: 'Erase data', forgot: 'Erased', recommended: 'Recommended', lastSlots: 'Last slots today', demo: 'Demo availability.'
  },
  es: {
    loadMsg: 'Preparando tu momento', badge: 'Bela Vista, São Paulo', wSub: 'Masaje masculino premium. Elige, reserva y relájate.', w1: 'Reserva rápida', w2: 'Señal R$ 40', w3: 'Cancelación gratis',
    enter: 'Entrar y reservar', needAgeEnter: 'Confirma 18+', h1: 'Tu momento de pausa.', sub: 'Masaje masculino en São Paulo.', cta: 'Reservar ahora', reviews: 'Reseñas', nextFree: 'Próximo libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Desde', s1: 'Elige sesión', s2: 'Cuándo y dónde', s3: 'Resumen y pago', min: 'min', flowH: 'Cómo funciona',
    oSingle: 'Individual', oCombo: 'Con depilación', oPack: 'Paquete 5', listen: 'Escuchar', pause: 'Pausar', resume: 'Continuar', stopA: 'Detener', noTts: 'Audio no soportado.', voiceLow: 'Usando tono grave.',
    name: '¿Tu nombre?', namePh: 'Nombre', nameErr: 'Mín. 3 letras.', place: 'Lugar', studio: 'Mi espacio', home: 'Voy a ti', peakNote: 'Horas pico + R$ 18.', studioInfo: 'Suite en Bela Vista.', cep: 'CEP', street: 'Calle', number: 'Nº', comp: 'Comp', bairro: 'Barrio', addrErr: 'Completa dirección.', date: 'Fecha', time: 'Hora', session: 'Sesión de', peak: 'Pico', noSlots: 'Sin horarios.',
    cont: 'Continuar', fill: 'Completa campos', change: 'Cambiar', sPack: 'Sesión', sWhen: 'Cuándo', sLoc: 'Lugar', sLocStudio: 'En suite', lPack: 'Sesión', lPack5: 'Paquete 5', lCombo: 'Depilación', lTime: '+30 min', lReq: 'Pedido', lFirst: 'Regalo 1ª', lCoupon: 'Cupón', lPeak: 'Desplazamiento', lPix: 'Desc. Pix',
    saved: 'Ahorras', total: 'Total', signal: 'Señal ahora', rest: 'Después', extras: 'Extras y cupón', couponQ: '¿Cupón?', apply: 'Aplicar', couponOk: 'Activado', couponBad: 'Inválido', reqQ: 'Pedido específico (+ R$ 140)', learn: 'Más info',
    reqConsent: 'Consiento informar pedido (dato sensible).', reqPh: 'Detalle', reqNote: 'Evaluado en sitio.', pay: '¿Pago restante?', pix: 'Pix (-3%)', card: 'Tarjeta', cash: 'Efectivo', cardNote: 'Tarjeta por WhatsApp.', optIn: 'Recibir recordatorios',
    ageA: 'Tengo 18+ y leí', privacy: 'Privacidad', terms: 'Términos', and: 'y', refund: 'Cancelación', send: 'Enviar por WhatsApp', needPay: 'Elige pago', needAge: 'Confirma edad',
    doneH: '¡Listo!', doneP: 'Confirmado tras respuesta WhatsApp.', doneSig: 'Envía comprobante.', resend: 'Abrir WhatsApp', addCal: 'Google Calendar', restart: 'Nueva reserva', chatQ: '¿Dudas?', chatBtn: 'WhatsApp', chatMsg: '¡Hola! Tengo una duda.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta', about1: 'Enfoque masculino.', about2: 'Suite en centro SP.', seeProfile: 'Perfil', faqH: 'Dudas', q1: '¿Señal?', a1: 'R$ 40 por Pix.', q2: '¿Cancelar?', a2: 'Gratis 12h antes.', q3: '¿Datos?', a3: 'Solo nombre y fecha.', q4: '¿Tarjeta?', a4: 'Sí, hasta 12x.',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Reembolso', adults: 'Solo 18+.', close: 'Cerrar', theme: 'Tema', profile: 'Perfil', openProfile: 'Perfil', pBul1: 'Charla inicial', pBul2: 'Sin prisa', pBul3: 'Suite privada', pHours: 'Horario', pHoursV: 'Diario, {a} a {b}', pPay: 'Pago', pPayV: 'Pix, tarjeta, efectivo', pWhere: 'Lugar', pWhereV: 'Mi espacio o tuyo', pCancel: 'Cancelar', pCancelV: 'Gratis 12h', pForget: 'Borrar datos', forgot: 'Borrados', recommended: 'Recomendado', lastSlots: 'Últimos hoy', demo: 'Disponibilidad demo.'
  },
};

const PACKAGES = [
  { id: 'classica', price: 180, min: 40, combo: 90, L: {
    pt: { title: 'Massagem Clássica', tags: ['Descompressão', 'Pistola', 'Foco'], desc: 'O alívio direto. Focado em desatar os nós da sua rotina e soltar a musculatura pesada.', flow: ['Conversa inicial.', 'Trabalho manual intenso.', 'Uso da pistola.', 'Relaxamento puro.'] },
    en: { title: 'Classic Massage', tags: ['Decompression', 'Gun', 'Muscle'], desc: 'Direct relief.', flow: ['Chat.', 'Intense manual work.', 'Gun.', 'Pure relaxation.'] },
    es: { title: 'Masaje Clásico', tags: ['Descompresión', 'Pistola', 'Músculo'], desc: 'Alivio directo.', flow: ['Charla.', 'Trabajo manual.', 'Pistola.', 'Relajación.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Despertar', 'Sutil', 'Tântrica'], desc: 'A transição. Começa quebrando a tensão e evolui para toques sutis que despertam o corpo.', flow: ['Quebra de tensão.', 'Toques lentos.', 'Foco sensorial.', 'Finalização.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Awakening', 'Subtle', 'Tantric'], desc: 'The transition.', flow: ['Break tension.', 'Slow touches.', 'Sensory focus.', 'Finish.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Despertar', 'Sutil', 'Tántrico'], desc: 'La transición.', flow: ['Romper tensión.', 'Toques lentos.', 'Foco sensorial.', 'Final.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, L: {
    pt: { title: 'Sensações com a Barba', tags: ['Contraste', 'Naturista', 'Intenso'], desc: 'O contraste térmico. A base relaxante se mistura ao toque áspero da barba.', flow: ['Naturista.', 'Relaxamento.', 'Estímulos com a barba.', 'Finalização.'] },
    en: { title: 'Beard Sensations', tags: ['Contrast', 'Naturist', 'Intense'], desc: 'Thermal contrast.', flow: ['Naturist.', 'Relaxation.', 'Beard stimuli.', 'Finish.'] },
    es: { title: 'Sensaciones Barba', tags: ['Contraste', 'Naturista', 'Intenso'], desc: 'Contraste táctil.', flow: ['Naturista.', 'Relajación.', 'Estímulos.', 'Final.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, L: {
    pt: { title: 'Corpo a Corpo', tags: ['Sem barreiras', 'Gel', 'Liberdade'], desc: 'A entrega absoluta. Uso meu corpo sobre o seu e você tem liberdade para retribuir.', flow: ['Alinhamento.', 'Soltura.', 'Gel corpo a corpo.', 'Interação.', 'Finalização.'] },
    en: { title: 'Body to Body', tags: ['No barriers', 'Gel', 'Freedom'], desc: 'Absolute surrender.', flow: ['Alignment.', 'Release.', 'Gel.', 'Interaction.', 'Finish.'] },
    es: { title: 'Cuerpo a Cuerpo', tags: ['Sin barreras', 'Gel', 'Libertad'], desc: 'Entrega absoluta.', flow: ['Alineación.', 'Soltura.', 'Gel.', 'Interacción.', 'Final.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, L: {
    pt: { title: 'Apenas Depilação', tags: ['Estética', 'Prático'], desc: 'Serviço isolado para higiene e estética. Aparo rápido em até 3 áreas.', flow: ['Alinhamento.', 'Aparo.', 'Acabamento.'] },
    en: { title: 'Trimming Only', tags: ['Grooming', 'Practical'], desc: 'Quick trim.', flow: ['Alignment.', 'Trim.', 'Finish.'] },
    es: { title: 'Solo Depilación', tags: ['Estética', 'Práctico'], desc: 'Recorte rápido.', flow: ['Alineación.', 'Recorte.', 'Acabado.'] } } },
];

const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };

const DOCS: Record<DocId, { title: string; body: ReactNode }> = {
  privacy: { title: 'Privacidade', body: (
    <div className="text-sm leading-relaxed space-y-4">
      <p>Atualizado: {LEGAL.ATUALIZADO}. Segue a LGPD (Lei 13.709/2018).</p>
      <p><strong>Controlador:</strong> {LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}.</p>
      <p><strong>Dados:</strong> Nome, data, horário, pacote, endereço (se for em casa). Sem CPF ou e-mail.</p>
      <p><strong>Sensível:</strong> Pedido específico (consentimento explícito), não é salvo.</p>
      <p><strong>Compartilhamento:</strong> WhatsApp, ViaCEP (endereço).</p>
    </div>
  )},
  terms: { title: 'Termos', body: (
    <div className="text-sm leading-relaxed space-y-4">
      <p>Serviço exclusivo para +18 anos.</p>
      <p><strong>Reserva:</strong> O site registra a solicitação. Confirmado só no WhatsApp com o sinal.</p>
      <p><strong>Preços:</strong> O sinal é abatido. Pacote válido por {C.PACK_DAYS} dias.</p>
      <p><strong>Conduta:</strong> Respeito mútuo. O terapeuta pode encerrar em caso de desrespeito.</p>
    </div>
  )},
  refund: { title: 'Cancelamento', body: (
    <div className="text-sm leading-relaxed space-y-4">
      <p>Cancelamento grátis com {LEGAL.CANCEL_FREE_HOURS}h de antecedência (sinal devolvido ou remarcado).</p>
      <p>Reembolso em até 7 dias úteis no mesmo meio.</p>
    </div>
  )},
  cookies: { title: 'Cookies', body: (
    <div className="text-sm leading-relaxed space-y-4">
      <p>Apenas essenciais para tema e idioma (localStorage). Sem rastreamento de terceiros.</p>
    </div>
  )},
};

// --- UTILS ---
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch {} },
};
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;

function buildSlots(date: Date, dur: number, isHome: boolean, now: Date) {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  return out;
}

// --- ICONS ---
const Icon = ({ name, size = 20, className = '' }: { name: string; size?: number, className?: string }) => {
  const paths: Record<string, string> = {
    map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    play: 'M5 3l14 9-14 9V3z', pause: 'M6 4h4v16H6z M14 4h4v16h-4z', stop: 'M6 6h12v12H6z',
    check: 'M20 6L9 17l-5-5', close: 'M18 6L6 18 M6 6l12 12', plus: 'M12 5v14 M5 12h14',
    cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4', copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
    insta: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
    chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z', shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z'
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={paths[name] || ''} /></svg>;
};

// --- CSS GLOBAL (100% Livre de Bibliotecas) ---
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
:root {
  --bg: #F8F6F1; --surf: #FFFFFF; --surf2: #F0ECE4; --ink: #1A1816; --mute: #7A7570;
  --line: rgba(26,24,22,0.12); --acc: #1A1816; --onacc: #FFFFFF; --gold: #B89F7A; --ok: #2C5E4A;
}
[data-theme="dark"] {
  --bg: #0E0D0C; --surf: #1A1816; --surf2: #24211F; --ink: #F2EFEB; --mute: #A19A90;
  --line: rgba(242,239,235,0.12); --acc: #F2EFEB; --onacc: #0E0D0C; --gold: #D4B88C; --ok: #50A684;
}
body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; word-break: normal; overflow-wrap: break-word; }
.serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; }
.app { min-height: 100vh; display: flex; flex-direction: column; }
.container { width: 100%; max-width: 800px; margin: 0 auto; padding: 0 20px; }

/* Botões e Inputs */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 56px; padding: 0 24px; border-radius: 99px; font-weight: 600; font-size: 15px; border: none; cursor: pointer; transition: 0.2s; text-decoration: none; text-align: center; }
.btn:active { transform: scale(0.98); }
.btn-p { background: var(--acc); color: var(--onacc); width: 100%; }
.btn-p:disabled { background: var(--surf2); color: var(--mute); cursor: not-allowed; }
.btn-g { background: transparent; border: 1px solid var(--line); color: var(--ink); }
.inp { width: 100%; height: 56px; padding: 0 16px; border-radius: 16px; border: 1px solid var(--line); background: var(--surf); color: var(--ink); font-size: 16px; font-family: 'Inter', sans-serif; transition: 0.2s; }
.inp:focus { outline: none; border-color: var(--gold); box-shadow: 0 0 0 2px rgba(184, 159, 122, 0.2); }
.card { background: var(--surf); border: 1px solid var(--line); border-radius: 24px; padding: 24px; }

/* Layout e utilitários */
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.grid-2 { display: grid; grid-template-columns: 1fr; gap: 12px; }
.grid-3 { display: grid; grid-template-columns: 1fr; gap: 12px; }
@media (min-width: 600px) { .grid-2 { grid-template-columns: 1fr 1fr; } .grid-3 { grid-template-columns: repeat(3, 1fr); } }

/* Animações */
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.anim { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; }
`;

// --- NARRADOR DE ÁUDIO (Voz Masculina) ---
function useNarrator(lang: Lang) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [state, setState] = useState<'idle'|'playing'|'paused'>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasMale, setHasMale] = useState(true);
  const chunks = useRef<string[]>([]);
  const idx = useRef(0);
  const token = useRef(0);

  useEffect(() => () => { if (supported) window.speechSynthesis.cancel(); }, [supported]);

  const step = (tk: number) => {
    if (tk !== token.current) return;
    const i = idx.current;
    if (i >= chunks.current.length) { setState('idle'); setActiveId(null); return; }
    const u = new SpeechSynthesisUtterance(chunks.current[i]);
    u.lang = LOCALE[lang];
    u.rate = 0.9; u.pitch = 0.8; // Tom mais grave (masculino)

    const voices = window.speechSynthesis.getVoices();
    const male = voices.find(v => v.lang.startsWith(lang) && /(felipe|daniel|antonio|ricardo|homem|male|masc)/i.test(v.name));
    if (male) { u.voice = male; setHasMale(true); } else setHasMale(false);

    u.onend = () => { if (tk !== token.current) return; idx.current = i + 1; step(tk); };
    u.onerror = () => { if (tk === token.current) { setState('idle'); setActiveId(null); } };
    window.speechSynthesis.speak(u);
  };

  const play = (id: string, text: string) => {
    if (!supported) return;
    const tk = ++token.current;
    window.speechSynthesis.cancel();
    chunks.current = text.match(/[^.!?]+[.!?]*/g) || [text];
    idx.current = 0;
    setActiveId(id); setState('playing');
    setTimeout(() => step(tk), 100);
  };

  const toggle = (id: string, text: string) => {
    if (activeId === id && state === 'playing') {
      token.current++; window.speechSynthesis.cancel(); setState('paused');
    } else if (activeId === id && state === 'paused') {
      const tk = ++token.current; setState('playing'); setTimeout(() => step(tk), 100);
    } else play(id, text);
  };

  const stop = () => { token.current++; if (supported) window.speechSynthesis.cancel(); setState('idle'); setActiveId(null); };

  return { supported, state, activeId, hasMale, toggle, stop };
}

// --- APP ---
export default function App() {
  const [lang, setLang] = useState<Lang>(() => (store.get('thaly_lang') as Lang) || 'pt');
  const [theme, setTheme] = useState<'light'|'dark'>(() => (store.get('thaly_theme') as 'light'|'dark') || 'dark');
  const [intro, setIntro] = useState(() => store.get('thaly_onboard') !== 'yes');
  const [ageOk, setAgeOk] = useState(false);
  const [doc, setDoc] = useState<DocId | null>(null);
  const [profile, setProfile] = useState(false);
  
  // Fluxo de agendamento
  const [step, setStep] = useState<1|2|3|4>(1);
  const [done, setDone] = useState(false);
  const [pkgId, setPkgId] = useState('');
  const [offer, setOffer] = useState<'single'|'combo'|'pack'>('single');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [locType, setLocType] = useState<'studio'|'home'>('studio');
  const [cep, setCep] = useState(''); const [street, setStreet] = useState(''); const [number, setNumber] = useState(''); const [bairro, setBairro] = useState('');
  const [payment, setPayment] = useState('');
  const [addTime, setAddTime] = useState(false);
  const [reqOk, setReqOk] = useState(false); const [req, setReq] = useState('');
  const [coupon, setCoupon] = useState({ input: '', applied: '', val: 0 });
  
  const [now] = useState(new Date());
  const narr = useNarrator(lang);
  const t = (k: string) => T[lang][k] || T.pt[k] || k;
  
  useEffect(() => { document.documentElement.dataset.theme = theme; store.set('thaly_theme', theme); }, [theme]);
  useEffect(() => { store.set('thaly_lang', lang); }, [lang]);

  const pkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];
  const isHome = locType === 'home';
  const isSolo = pkg.id === 'aparo_solo';
  const effOffer = isSolo ? 'single' : offer;
  const hasReq = reqOk && req.trim().length > 3;

  // Cálculos de Preço
  const invoice = useMemo(() => {
    let dur = pkg.min + (addTime ? 30 : 0);
    let base = (effOffer === 'pack' ? pkg.price * 4 : pkg.price);
    if (effOffer === 'combo') base += pkg.combo;
    if (addTime) base += C.TIME_ADD;
    if (hasReq) base += C.REQ_FEE;
    
    let disc = 0;
    if (effOffer !== 'pack') {
      if (coupon.applied) disc = coupon.val < 1 ? Math.floor(base * coupon.val) : coupon.val;
      else if (store.get('thaly_returning') !== 'yes') disc = C.FIRST;
    }
    disc = Math.min(disc, base);

    const peak = isHome && PEAK_HOURS.includes(time) ? C.PEAK_FEE : 0;
    const pixDisc = payment === 'pix' ? Math.ceil((base - disc) * C.PIX_DISC) : 0;
    const total = base - disc - pixDisc + peak;
    const sinal = Math.min(C.SIGNAL, total);
    
    return { dur, total, sinal, rest: total - sinal, saved: disc + pixDisc, base, peak };
  }, [pkg, effOffer, addTime, hasReq, isHome, time, payment, coupon]);

  // Datas e Horários
  const days = useMemo(() => {
    const arr = []; const d = new Date(); d.setHours(0,0,0,0);
    for(let i=0; i<C.DAYS; i++) { const nd = new Date(d); nd.setDate(nd.getDate()+i); arr.push({ d: nd, i }); }
    return arr;
  }, []);
  const slots = useMemo(() => date ? buildSlots(date, invoice.dur, isHome, now) : [], [date, invoice.dur, isHome, now]);

  // Handlers
  const handleCep = async (v: string) => {
    const m = maskCEP(v); setCep(m);
    if (m.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${m.replace('-','')}/json/`);
        const j = await res.json();
        if (!j.erro) { setStreet(j.logradouro || ''); setBairro(j.bairro || ''); }
      } catch {}
    }
  };

  const applyCoupon = () => {
    const c = coupon.input.toUpperCase();
    if (C.COUPONS[c]) setCoupon({ input: '', applied: c, val: C.COUPONS[c] });
    else alert(t('couponBad'));
  };

  const nextStep = () => {
    if (step === 1 && !pkgId) return alert(t('s1'));
    if (step === 2 && (!date || !time)) return alert(t('fill'));
    if (step === 3 && name.trim().length < 3) return alert(t('nameErr'));
    if (step === 3 && isHome && (!street || !number || !bairro)) return alert(t('addrErr'));
    setStep(s => (s + 1) as any);
    setTimeout(() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const finish = () => {
    if (!payment) return alert(t('needPay'));
    if (!ageOk) return alert(t('needAge'));
    
    const loc = isHome ? `${street}, ${number} - ${bairro}` : 'No espaço (Bela Vista)';
    let msg = `Oi Thalyson! Vim pelo site e quero confirmar:\n\n*NOME:* ${clean(name)}\n*DATA/HORA:* ${date?.toLocaleDateString('pt-BR')} às ${time}\n*LOCAL:* ${loc}\n*SESSÃO:* ${pkg.L.pt.title} (${invoice.dur} min)\n`;
    if (hasReq) msg += `*PEDIDO:* "${clean(req)}"\n`;
    msg += `\n*VALORES:*\nTotal: ${money(invoice.total)} (${PAY_PT[payment]})\nSinal via Pix: ${money(invoice.sinal)}\nRestante: ${money(invoice.rest)}\n\n✅ Declaro ter 18+ anos.`;

    store.set('thaly_returning', 'yes');
    window.location.href = waLink(msg); // iOS Safe
    setDone(true);
  };

  const gCal = () => {
    if (!date || !time) return '';
    const st = `${dateKey(date).replace(/-/g,'')}T${time.replace(':','')}00`;
    const en = `${dateKey(date).replace(/-/g,'')}T${fromMin(toMin(time)+invoice.dur).replace(':','')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Massagem&dates=${st}/${en}&ctz=America/Sao_Paulo`;
  };

  // UI Base
  if (intro) {
    return (
      <div className="app" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <h1 className="serif anim" style={{ fontSize: 40, marginBottom: 16 }}>Relaxar hoje<br/>com Thalyson</h1>
        <p className="anim" style={{ color: 'var(--mute)', marginBottom: 32 }}>{t('wSub')}</p>
        <label className="anim" style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, cursor: 'pointer' }}>
          <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--gold)' }} />
          <span style={{ fontSize: 14 }}>Tenho 18+ anos e aceito os termos.</span>
        </label>
        <button className="btn btn-p anim" disabled={!ageOk} onClick={() => { store.set('thaly_onboard', 'yes'); setIntro(false); }}>
          {ageOk ? 'Entrar e Agendar' : 'Confirme a idade'}
        </button>
      </div>
    );
  }

  return (
    <div className="app" style={{ paddingBottom: 80 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      {/* HEADER */}
      <header style={{ padding: '20px 0', borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 10 }}>
        <div className="container flex-between">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src={C.AVATAR} alt="T" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
            <span className="serif" style={{ fontSize: 20 }}>Relaxar hoje</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={lang} onChange={e => setLang(e.target.value as Lang)} style={{ background: 'var(--surf2)', border: 'none', padding: '6px 10px', borderRadius: 8, color: 'var(--ink)', outline: 'none' }}>
              <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
            </select>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'none', border: 'none', color: 'var(--ink)', padding: 8, cursor: 'pointer' }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container anim" style={{ paddingTop: 60, paddingBottom: 60, textAlign: 'center' }}>
        <p style={{ color: 'var(--gold)', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{t('badge')}</p>
        <h1 className="serif" style={{ fontSize: 'clamp(40px, 10vw, 70px)', lineHeight: 1.1, marginBottom: 24 }}>{t('h1')}</h1>
        <p style={{ color: 'var(--mute)', fontSize: 18, maxWidth: 500, margin: '0 auto 32px' }}>{t('sub')}</p>
        <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-p" style={{ maxWidth: 300, margin: '0 auto' }}>{t('cta')}</button>
      </section>

      {/* BOOKING FLOW */}
      <section id="booking" className="container" style={{ marginBottom: 60 }}>
        
        {/* Progresso */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ width: 8, height: 8, borderRadius: '50%', background: step >= s ? 'var(--gold)' : 'var(--surf2)', transition: '0.3s' }} />
          ))}
        </div>

        {done ? (
          <div className="card anim" style={{ textAlign: 'center', background: 'var(--surf2)', border: 'none', padding: 40 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'var(--ok)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Icon name="check" size={30} /></div>
            <h2 className="serif" style={{ fontSize: 32, marginBottom: 16 }}>{t('doneH')}</h2>
            <p style={{ color: 'var(--mute)', marginBottom: 24 }}>{t('doneP')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={waLink('Oi!')} className="btn btn-p">{t('resend')}</a>
              <a href={gCal()} className="btn btn-g">{t('addCal')}</a>
              <button onClick={() => { setStep(1); setDone(false); setPkgId(''); }} className="btn btn-g" style={{ border: 'none' }}>{t('restart')}</button>
            </div>
          </div>
        ) : (
          <div className="anim">
            {/* STEP 1 - SERVIÇO */}
            {step === 1 && (
              <div>
                <h2 className="serif" style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>{t('s1')}</h2>
                <div className="grid-2">
                  {PACKAGES.map(p => (
                    <div key={p.id} onClick={() => { setPkgId(p.id); if(p.id==='aparo_solo') setOffer('single'); }} className="card" style={{ cursor: 'pointer', borderColor: pkgId === p.id ? 'var(--gold)' : 'var(--line)', background: pkgId === p.id ? 'var(--surf2)' : 'var(--surf)' }}>
                      <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: 8 }}>
                        <h3 className="serif" style={{ fontSize: 20 }}>{p.L[lang].title}</h3>
                        <span className="serif" style={{ fontSize: 20, color: 'var(--gold)' }}>{money(p.price)}</span>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--mute)', marginBottom: 16 }}>{p.min} min • {p.L[lang].tags.join(' • ')}</p>
                      
                      {pkgId === p.id && (
                        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                          <p style={{ fontSize: 14, marginBottom: 16 }}>{p.L[lang].desc}</p>
                          
                          {/* NARRADOR */}
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button onClick={(e) => { e.stopPropagation(); narr.toggle(p.id, `${p.L[lang].title}. ${p.L[lang].desc}`); }} className="btn btn-g" style={{ flex: 1, height: 44, fontSize: 13 }}>
                              <Icon name={narr.activeId === p.id && narr.state === 'playing' ? 'pause' : 'play'} size={14} />
                              {narr.activeId === p.id && narr.state === 'playing' ? t('pause') : t('listen')}
                            </button>
                            {narr.activeId === p.id && <button onClick={(e) => { e.stopPropagation(); narr.stop(); }} className="btn btn-g" style={{ height: 44, width: 44, padding: 0 }}><Icon name="stop" size={14} /></button>}
                          </div>
                          {narr.activeId === p.id && !narr.hasMale && <p style={{ fontSize: 10, color: 'var(--mute)', marginTop: 8, textAlign: 'center' }}>{t('voiceLow')}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {pkgId && !isSolo && (
                  <div style={{ marginTop: 32 }}>
                    <div className="grid-3">
                      {[['single', t('oSingle'), pkg.price], ['combo', t('oCombo'), pkg.price + pkg.combo], ['pack', t('oPack'), pkg.price * 4]].map(([id, lbl, pr]) => (
                        <div key={id} onClick={() => setOffer(id as any)} style={{ padding: 16, borderRadius: 16, border: `1px solid ${effOffer === id ? 'var(--gold)' : 'var(--line)'}`, background: effOffer === id ? 'rgba(184,159,122,0.1)' : 'var(--surf)', cursor: 'pointer', textAlign: 'center' }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: effOffer === id ? 'var(--gold)' : 'var(--ink)' }}>{lbl}</p>
                          <p className="serif" style={{ fontSize: 18, marginTop: 4 }}>{money(pr)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button onClick={nextStep} disabled={!pkgId} className="btn btn-p" style={{ marginTop: 32 }}>{t('cont')}</button>
              </div>
            )}

            {/* STEP 2 - DATA E HORA */}
            {step === 2 && (
              <div>
                <h2 className="serif" style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>{t('s2')}</h2>
                <div style={{ marginBottom: 32 }}>
                  <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }}>
                    {days.map(({d, i}) => (
                      <div key={i} onClick={() => { setDate(d); setTime(''); }} style={{ minWidth: 70, padding: 12, borderRadius: 16, border: `1px solid ${sameDay(date, d) ? 'var(--gold)' : 'var(--line)'}`, background: sameDay(date, d) ? 'rgba(184,159,122,0.1)' : 'var(--surf)', textAlign: 'center', cursor: 'pointer' }}>
                        <p style={{ fontSize: 12, color: sameDay(date,d) ? 'var(--gold)' : 'var(--mute)', textTransform: 'capitalize' }}>{i === 0 ? t('today') : i === 1 ? t('tomorrow') : d.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                        <p className="serif" style={{ fontSize: 24, fontWeight: 600, color: sameDay(date,d) ? 'var(--gold)' : 'var(--ink)' }}>{d.getDate()}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {date && (
                  <div style={{ marginBottom: 32 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--mute)', marginBottom: 12 }}>{t('time')} ({invoice.dur} min)</p>
                    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))' }}>
                      {slots.map(s => (
                        <div key={s.t} onClick={() => s.ok && setTime(s.t)} style={{ padding: 12, borderRadius: 12, border: `1px solid ${time === s.t ? 'var(--gold)' : 'var(--line)'}`, background: time === s.t ? 'var(--gold)' : 'var(--surf)', color: time === s.t ? '#000' : s.ok ? 'var(--ink)' : 'var(--mute)', textAlign: 'center', cursor: s.ok ? 'pointer' : 'not-allowed', opacity: s.ok ? 1 : 0.4 }}>
                          {s.t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)} className="btn btn-g" style={{ flex: 1 }}>Voltar</button>
                  <button onClick={nextStep} className="btn btn-p" style={{ flex: 2 }}>{t('cont')}</button>
                </div>
              </div>
            )}

            {/* STEP 3 - DADOS */}
            {step === 3 && (
              <div>
                <h2 className="serif" style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>Seus dados</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <input type="text" placeholder={t('namePh')} value={name} onChange={e => setName(e.target.value)} className="inp" />
                  
                  <div className="grid-2">
                    <div onClick={() => setLocType('studio')} style={{ padding: 16, borderRadius: 16, border: `1px solid ${locType === 'studio' ? 'var(--gold)' : 'var(--line)'}`, background: locType === 'studio' ? 'rgba(184,159,122,0.1)' : 'var(--surf)', textAlign: 'center', cursor: 'pointer', fontWeight: locType === 'studio' ? 600 : 400 }}>{t('studio')}</div>
                    <div onClick={() => setLocType('home')} style={{ padding: 16, borderRadius: 16, border: `1px solid ${locType === 'home' ? 'var(--gold)' : 'var(--line)'}`, background: locType === 'home' ? 'rgba(184,159,122,0.1)' : 'var(--surf)', textAlign: 'center', cursor: 'pointer', fontWeight: locType === 'home' ? 600 : 400 }}>{t('home')}</div>
                  </div>

                  {isHome && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <input type="text" placeholder="CEP" value={cep} onChange={e => handleCep(e.target.value)} className="inp" maxLength={9} />
                      <input type="text" placeholder="Rua" value={street} onChange={e => setStreet(e.target.value)} className="inp" />
                      <div style={{ display: 'flex', gap: 12 }}>
                        <input type="text" placeholder="Número" value={number} onChange={e => setNumber(e.target.value)} className="inp" style={{ flex: 1 }} />
                        <input type="text" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} className="inp" style={{ flex: 2 }} />
                      </div>
                    </div>
                  )}
                </div>
                
                <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                  <button onClick={() => setStep(2)} className="btn btn-g" style={{ flex: 1 }}>Voltar</button>
                  <button onClick={nextStep} className="btn btn-p" style={{ flex: 2 }}>{t('cont')}</button>
                </div>
              </div>
            )}

            {/* STEP 4 - RESUMO */}
            {step === 4 && (
              <div>
                <h2 className="serif" style={{ fontSize: 28, marginBottom: 24, textAlign: 'center' }}>{t('s3')}</h2>
                
                <div className="card" style={{ marginBottom: 24, background: 'var(--surf2)', border: 'none' }}>
                  <div className="flex-between" style={{ marginBottom: 8 }}><span>{pkg.L[lang].title}</span><strong>{money(invoice.total)}</strong></div>
                  <div className="flex-between" style={{ marginBottom: 8, fontSize: 14, color: 'var(--mute)' }}><span>{date?.toLocaleDateString('pt-BR')}</span><span>{time}</span></div>
                  <div style={{ fontSize: 14, color: 'var(--mute)' }}>{isHome ? `${street}, ${number}` : 'Bela Vista'}</div>
                </div>

                <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>{t('pay')}</p>
                <div className="grid-3" style={{ marginBottom: 24 }}>
                  {['pix', 'card', 'cash'].map(p => (
                    <div key={p} onClick={() => setPayment(p)} style={{ padding: 12, borderRadius: 12, border: `1px solid ${payment === p ? 'var(--gold)' : 'var(--line)'}`, background: payment === p ? 'rgba(184,159,122,0.1)' : 'var(--surf)', textAlign: 'center', cursor: 'pointer', fontSize: 14 }}>{t(p)}</div>
                  ))}
                </div>

                <div className="flex-between" style={{ marginBottom: 24, paddingTop: 16, borderTop: '1px solid var(--line)' }}>
                  <span>{t('total')}</span>
                  <span className="serif" style={{ fontSize: 32 }}>{money(invoice.total)}</span>
                </div>

                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 24, cursor: 'pointer', fontSize: 12, color: 'var(--mute)' }}>
                  <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 18, height: 18, marginTop: 2, accentColor: 'var(--gold)' }} />
                  <span>{t('ageA')} <span style={{ textDecoration: 'underline' }}>Termos</span>.</span>
                </label>

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(3)} className="btn btn-g" style={{ flex: 1 }}>Voltar</button>
                  <button onClick={finish} disabled={!payment || !ageOk} className="btn btn-p" style={{ flex: 2 }}>{t('send')}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
