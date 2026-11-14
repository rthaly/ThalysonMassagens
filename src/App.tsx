import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

// --- CONSTANTES E DADOS ---
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
type Theme = 'dark' | 'light';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
type PkgTheme = 'sage' | 'amber' | 'crimson' | 'midnight' | 'slate';
type PkgText = { title: string; desc: string; tags: string[]; flow: string[] };

const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando seu momento', badge: 'Bela Vista, São Paulo',
    wSub: 'Massagem masculina premium. Escolha, agende e relaxe: a confirmação chega no seu WhatsApp.', w1: 'Reserva rápida', w2: 'Sinal de R$ 40', w3: 'Cancelamento grátis',
    enter: 'Entrar e agendar', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'O seu momento de pausa.', sub: 'Massagem masculina em São Paulo. Escolha o que seu corpo precisa hoje e deixe o resto comigo.',
    cta: 'Agendar agora', reviews: 'Avaliações', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Sessões a partir de',
    t1: 'Sinal de R$ 40, o resto depois', t2: 'Cancelamento grátis até 12h antes', t3: 'R$ 15 off na 1ª sessão, automático',
    offH: 'Mais vantagem', offS: 'Combo com depilação e pacote fidelidade, com a economia à vista.',
    cbT: 'Massagem + depilação', cbD: 'Economize até R$ 70 na mesma visita.', lyT: 'Leve 5, pague 4', lyD: 'A 5ª sessão é grátis. Agende a 1ª agora.', see: 'Ver opção',
    s1: 'Escolha a sessão', s2: 'Quando e onde', s3: 'Resumo e pagamento', min: 'min', flowH: 'Como funciona',
    oSingle: 'Sessão avulsa', oSingleD: 'Uma sessão, sem compromisso.', oCombo: 'Com depilação', oComboD: 'Inclui aparo em até 3 lugares.', oPack: 'Pacote 5 sessões', oPackD: 'Pague 4 e a 5ª é grátis. Validade de {n} dias.',
    save: 'Economize', was: 'De', listen: 'Ouvir descrição',
    packNote: 'Cupom não acumula com o pacote. Agende esta 1ª sessão agora e as outras 4 depois pelo WhatsApp.',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).', place: 'Local da sessão', studio: 'No espaço', home: 'Vou até você',
    peakNote: 'Horários de pico têm taxa de R$ 18. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico (Bela Vista), próximo ao Metrô Anhangabaú. O endereço exato é enviado com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua/Avenida', number: 'Nº', comp: 'Apto/Bloco', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    demo: 'Disponibilidade demonstrativa: a reserva só vale após resposta no WhatsApp.', dateErr: 'Escolha uma data.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'indisponível',
    cont: 'Continuar para resumo', fill: 'Complete os campos destacados', change: 'Alterar', sPack: 'Sessão', sWhen: 'Quando', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)',
    lPack: 'Sessão', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Depilação', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Presente de 1ª sessão', lCoupon: 'Cupom', lPeak: 'Taxa deslocamento/pico', lPix: 'Desconto Pix (3%)',
    saved: 'Você economiza', total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    extras: 'Extras e cupom (opcional)', couponQ: 'Possui cupom?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para avaliação. Não é salvo neste aparelho.',
    reqPh: 'Algum detalhe para a sessão', reqNote: 'Pedido avaliado no atendimento. Se inviável, não é cobrado.',
    pay: 'Como vai pagar o restante?', pix: 'Pix (-3%)', card: 'Cartão', cash: 'Dinheiro', cardNote: 'O cartão (até 12x) é acertado diretamente no WhatsApp antes do pagamento.',
    optIn: 'Quero receber lembretes (opcional).',
    ageA: 'Declaro ter 18 anos ou mais e li os', privacy: 'Termos de Privacidade', terms: 'Termos de Serviço', and: 'e os', refund: 'Cancelamento',
    sigA: 'Para confirmar, envie um sinal de', sigB: 'via Pix. O restante é após a sessão.', copyPix: 'Copiar chave Pix', pixCopied: 'Chave Pix copiada',
    send: 'Enviar pelo WhatsApp', needPay: 'Escolha o pagamento', needAge: 'Confirme a idade',
    doneH: 'Solicitação pronta!', doneP: 'O horário só está confirmado após a resposta no WhatsApp. Se não abriu, clique abaixo.',
    doneSig: 'Envie o comprovante na conversa.', resend: 'Abrir WhatsApp', addCal: 'Adicionar ao Google Calendar', restart: 'Novo agendamento',
    chatQ: 'Dúvidas antes?', chatBtn: 'Falar no WhatsApp', chatMsg: 'Oi Thalyson! Vim pelo site e tenho uma dúvida.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta masculino', about1: 'Meu trabalho é direto e focado no corpo masculino: usar o toque para aliviar o peso da rotina.',
    about2: 'Atendo em suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.', seeProfile: 'Ver perfil',
    faqH: 'Dúvidas rápidas', q1: 'Como funciona o sinal?', a1: 'Você paga R$ 40 por Pix para garantir o horário. O restante é pago depois.',
    q2: 'E se eu precisar cancelar?', a2: 'Até 12 horas antes você recebe o sinal de volta.', q3: 'Quais dados preciso informar?', a3: 'Só nome, dia e pacote. Sem CPF ou e-mail.',
    q4: 'Posso pagar no cartão?', a4: 'Sim: Pix (3% off), cartão em até 12x ou dinheiro.',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento', footCookies: 'Cookies', adults: 'Serviço exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Tema', lang: 'Idioma', profile: 'Perfil', openProfile: 'Abrir perfil', gm: 'Bom dia', ga: 'Boa tarde', gn: 'Boa noite',
    pBul1: 'Conversa inicial para alinhar limites', pBul2: 'Sem pressa, com horário reservado', pBul3: 'Ambiente reservado no Centro Histórico',
    pHours: 'Atendimento', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Pagamento', pPayV: 'Pix, cartão e dinheiro',
    pWhere: 'Local', pWhereV: 'Meu espaço ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis até 12 horas antes',
    pForget: 'Apagar meus dados', forgot: 'Dados apagados',
    recommended: 'Recomendado', smartSub: 'Deixe o resto comigo.', lastSlots: 'Últimos horários para hoje',
  },
  en: {
    loadMsg: 'Preparing your moment', badge: 'Bela Vista, São Paulo',
    wSub: 'Premium men’s massage. Choose, book and relax: confirmation arrives on WhatsApp.', w1: 'Fast booking', w2: 'R$ 40 deposit', w3: 'Free cancellation',
    enter: 'Enter and book', needAgeEnter: 'Confirm you are 18+',
    h1: 'Your moment to pause.', sub: 'Men’s massage in São Paulo. Choose what your body needs today.',
    cta: 'Book now', reviews: 'Reviews', nextFree: 'Next free slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Sessions from',
    t1: 'R$ 40 deposit, rest after', t2: 'Free cancellation up to 12h', t3: 'R$ 15 off 1st session',
    offH: 'More value', offS: 'Grooming combo and loyalty pack.',
    cbT: 'Massage + grooming', cbD: 'Save up to R$ 70.', lyT: 'Get 5, pay 4', lyD: '5th is free.', see: 'See option',
    s1: 'Choose session', s2: 'When and where', s3: 'Summary and payment', min: 'min', flowH: 'How it works',
    oSingle: 'Single session', oSingleD: 'No commitment.', oCombo: 'With grooming', oComboD: 'Up to 3 areas.', oPack: '5-session pack', oPackD: 'Valid for {n} days.',
    save: 'Save', was: 'Was', listen: 'Listen',
    packNote: 'Coupons do not stack with the pack.',
    name: 'What should I call you?', namePh: 'Your name', nameErr: 'Min. 3 letters.', place: 'Location', studio: 'At my place', home: 'I come to you',
    peakNote: 'Peak hours carry a R$ 18 fee.',
    studioInfo: 'The suite is in Bela Vista, near Anhangabaú metro. Exact address sent with confirmation.',
    cep: 'ZIP code', street: 'Street', number: 'No.', comp: 'Apt', bairro: 'Neighborhood', addrErr: 'Fill address.', cepFail: 'ZIP not found.',
    date: 'Date', time: 'Start time', session: 'Session of', peak: 'Peak', noSlots: 'No slots this day.',
    demo: 'Demo availability.', dateErr: 'Choose date.', timeErr: 'Choose time.', from: 'From', to: 'to', unavailable: 'unavailable',
    cont: 'Continue', fill: 'Complete fields', change: 'Change', sPack: 'Session', sWhen: 'When', sLoc: 'Location', sLocStudio: 'At suite',
    lPack: 'Session', lPack5: '5-session pack', lCombo: 'Grooming', lTime: '+30 min', lReq: 'Specific request', lFirst: '1st session gift', lCoupon: 'Coupon', lPeak: 'Travel/peak', lPix: 'Pix discount',
    saved: 'You save', total: 'Total', signal: 'Deposit now', rest: 'After session',
    extras: 'Extras & coupon', couponQ: 'Coupon?', couponPh: 'Code', apply: 'Apply', couponOk: 'Applied', couponBad: 'Invalid',
    reqQ: 'Specific request (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describe a request (sensitive data) for evaluation only.',
    reqPh: 'Any detail', reqNote: 'Evaluated on site.',
    pay: 'Pay remainder?', pix: 'Pix (-3%)', card: 'Card', cash: 'Cash', cardNote: 'Card fees agreed on WhatsApp.',
    optIn: 'Receive reminders',
    ageA: 'I am 18+ and read', privacy: 'Privacy', terms: 'Terms', and: 'and', refund: 'Cancellation',
    sigA: 'Send deposit of', sigB: 'via Pix.', copyPix: 'Copy Pix', pixCopied: 'Copied',
    send: 'Send on WhatsApp', needPay: 'Choose payment', needAge: 'Confirm age',
    doneH: 'All set!', doneP: 'Time confirmed after WhatsApp reply.',
    doneSig: 'Send receipt.', resend: 'Open WhatsApp', addCal: 'Google Calendar', restart: 'New booking',
    chatQ: 'Questions?', chatBtn: 'WhatsApp', chatMsg: 'Hi! I have a question.',
    aboutH: 'Thalyson Massagens', aboutR: 'Male therapist', about1: 'Focused on the male body.',
    about2: 'Suite in downtown SP.', seeProfile: 'Profile',
    faqH: 'FAQ', q1: 'Deposit?', a1: 'R$ 40 via Pix.',
    q2: 'Cancel?', a2: 'Free up to 12h.', q3: 'Data?', a3: 'Name and date only.',
    q4: 'Card?', a4: 'Pix, card or cash.',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Refund', footCookies: 'Cookies', adults: '18+ only.',
    close: 'Close', theme: 'Theme', lang: 'Language', profile: 'Profile', openProfile: 'Profile', gm: 'Good morning', ga: 'Good afternoon', gn: 'Good evening',
    pBul1: 'Initial chat', pBul2: 'No rush', pBul3: 'Private suite',
    pHours: 'Hours', pHoursV: 'Daily, {a} to {b}', pPay: 'Payment', pPayV: 'Pix, card, cash',
    pWhere: 'Where', pWhereV: 'My place or yours', pCancel: 'Cancel', pCancelV: 'Free up to 12h',
    pForget: 'Erase data', forgot: 'Erased',
    recommended: 'Recommended', smartSub: 'Leave the rest to me.', lastSlots: 'Last slots today',
  },
  es: {
    loadMsg: 'Preparando tu momento', badge: 'Bela Vista, São Paulo',
    wSub: 'Masaje masculino premium. Elige, reserva y relájate.', w1: 'Reserva rápida', w2: 'Señal R$ 40', w3: 'Cancelación gratis',
    enter: 'Entrar y reservar', needAgeEnter: 'Confirma 18+',
    h1: 'Tu momento de pausa.', sub: 'Masaje masculino en São Paulo.',
    cta: 'Reservar ahora', reviews: 'Reseñas', nextFree: 'Próximo libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Desde',
    t1: 'Señal R$ 40', t2: 'Cancelación 12h', t3: 'R$ 15 off 1ª',
    offH: 'Más ventaja', offS: 'Combo y paquete.',
    cbT: 'Masaje + depilación', cbD: 'Ahorra R$ 70.', lyT: 'Lleva 5, paga 4', lyD: '5ª gratis.', see: 'Ver',
    s1: 'Elige sesión', s2: 'Cuándo y dónde', s3: 'Resumen y pago', min: 'min', flowH: 'Cómo funciona',
    oSingle: 'Individual', oSingleD: 'Sin compromiso.', oCombo: 'Con depilación', oComboD: 'Hasta 3 zonas.', oPack: 'Paquete 5', oPackD: 'Validez {n} días.',
    save: 'Ahorra', was: 'Antes', listen: 'Escuchar',
    packNote: 'Cupones no se acumulan.',
    name: '¿Tu nombre?', namePh: 'Nombre', nameErr: 'Mín. 3 letras.', place: 'Lugar', studio: 'Mi espacio', home: 'Voy a ti',
    peakNote: 'Horas pico + R$ 18.',
    studioInfo: 'Suite en Bela Vista.',
    cep: 'CEP', street: 'Calle', number: 'Nº', comp: 'Comp', bairro: 'Barrio', addrErr: 'Completa dirección.', cepFail: 'CEP no encontrado.',
    date: 'Fecha', time: 'Hora', session: 'Sesión de', peak: 'Pico', noSlots: 'Sin horarios.',
    demo: 'Disponibilidad demo.', dateErr: 'Elige fecha.', timeErr: 'Elige hora.', from: 'De', to: 'a', unavailable: 'no disponible',
    cont: 'Continuar', fill: 'Completa campos', change: 'Cambiar', sPack: 'Sesión', sWhen: 'Cuándo', sLoc: 'Lugar', sLocStudio: 'En suite',
    lPack: 'Sesión', lPack5: 'Paquete 5', lCombo: 'Depilación', lTime: '+30 min', lReq: 'Pedido', lFirst: 'Regalo 1ª', lCoupon: 'Cupón', lPeak: 'Desplazamiento', lPix: 'Desc. Pix',
    saved: 'Ahorras', total: 'Total', signal: 'Señal ahora', rest: 'Después',
    extras: 'Extras y cupón', couponQ: '¿Cupón?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Activado', couponBad: 'Inválido',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Más info',
    reqConsent: 'Consiento informar pedido (dato sensible).',
    reqPh: 'Detalle', reqNote: 'Evaluado en sitio.',
    pay: '¿Pago restante?', pix: 'Pix (-3%)', card: 'Tarjeta', cash: 'Efectivo', cardNote: 'Tarjeta por WhatsApp.',
    optIn: 'Recibir recordatorios',
    ageA: 'Tengo 18+ y leí', privacy: 'Privacidad', terms: 'Términos', and: 'y', refund: 'Cancelación',
    sigA: 'Envía señal de', sigB: 'por Pix.', copyPix: 'Copiar Pix', pixCopied: 'Copiado',
    send: 'Enviar por WhatsApp', needPay: 'Elige pago', needAge: 'Confirma edad',
    doneH: '¡Listo!', doneP: 'Confirmado tras respuesta WhatsApp.',
    doneSig: 'Envía comprobante.', resend: 'Abrir WhatsApp', addCal: 'Google Calendar', restart: 'Nueva reserva',
    chatQ: '¿Dudas?', chatBtn: 'WhatsApp', chatMsg: '¡Hola! Tengo una duda.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta', about1: 'Enfoque masculino.',
    about2: 'Suite en centro SP.', seeProfile: 'Perfil',
    faqH: 'Dudas', q1: '¿Señal?', a1: 'R$ 40 por Pix.',
    q2: '¿Cancelar?', a2: 'Gratis 12h antes.', q3: '¿Datos?', a3: 'Solo nombre y fecha.',
    q4: '¿Tarjeta?', a4: 'Sí, hasta 12x.',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Reembolso', footCookies: 'Cookies', adults: 'Solo 18+.',
    close: 'Cerrar', theme: 'Tema', lang: 'Idioma', profile: 'Perfil', openProfile: 'Perfil', gm: 'Buenos días', ga: 'Buenas tardes', gn: 'Buenas noches',
    pBul1: 'Charla inicial', pBul2: 'Sin prisa', pBul3: 'Suite privada',
    pHours: 'Horario', pHoursV: 'Diario, {a} a {b}', pPay: 'Pago', pPayV: 'Pix, tarjeta, efectivo',
    pWhere: 'Lugar', pWhereV: 'Mi espacio o tuyo', pCancel: 'Cancelar', pCancelV: 'Gratis 12h',
    pForget: 'Borrar datos', forgot: 'Borrados',
    recommended: 'Recomendado', smartSub: 'Déjame el resto.', lastSlots: 'Últimos hoy',
  },
};

const PACKAGES: { id: string; price: number; min: number; combo: number; theme: PkgTheme; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, combo: 90, theme: 'sage', L: {
    pt: { title: 'Massagem Clássica', tags: ['Descompressão', 'Pistola', 'Foco muscular'], desc: 'O alívio direto. Focado em desatar os nós da sua rotina e soltar a musculatura pesada.', flow: ['Conversa para identificar a tensão.', 'Trabalho manual intenso.', 'Uso da pistola nos pontos críticos.', 'Relaxamento puro.'] },
    en: { title: 'Classic Massage', tags: ['Decompression', 'Gun', 'Muscle'], desc: 'Direct relief. Unknot your routine.', flow: ['Chat to identify stress.', 'Intense manual work.', 'Gun on critical points.', 'Pure relaxation.'] },
    es: { title: 'Masaje Clásico', tags: ['Descompresión', 'Pistola', 'Músculo'], desc: 'Alivio directo.', flow: ['Charla para estrés.', 'Trabajo manual.', 'Pistola en puntos.', 'Relajación pura.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, theme: 'amber', L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Despertar', 'Toque sutil', 'Tântrica'], desc: 'A transição. Começa quebrando a tensão e evolui para toques sutis que despertam o corpo.', flow: ['Quebra de tensão.', 'Toques lentos e sutis.', 'Foco sensorial.', 'Finalização direcionada.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Awakening', 'Subtle', 'Tantric'], desc: 'The transition to subtle touches.', flow: ['Break tension.', 'Slow touches.', 'Sensory focus.', 'Directed finish.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Despertar', 'Sutil', 'Tántrico'], desc: 'La transición.', flow: ['Romper tensión.', 'Toques lentos.', 'Foco sensorial.', 'Final dirigido.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, theme: 'crimson', L: {
    pt: { title: 'Sensações com a Barba', tags: ['Contraste', 'Naturista', 'Intensidade'], desc: 'O contraste térmico. A base relaxante se mistura ao toque áspero da barba.', flow: ['Sessão naturista.', 'Relaxamento.', 'Estímulos com a barba.', 'Finalização intensa.'] },
    en: { title: 'Beard Sensations', tags: ['Contrast', 'Naturist', 'Intensity'], desc: 'Thermal and tactile contrast.', flow: ['Naturist session.', 'Relaxation.', 'Beard stimuli.', 'Intense finish.'] },
    es: { title: 'Sensaciones Barba', tags: ['Contraste', 'Naturista', 'Intensidad'], desc: 'Contraste táctil.', flow: ['Sesión naturista.', 'Relajación.', 'Estímulos barba.', 'Final intenso.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, theme: 'midnight', L: {
    pt: { title: 'Corpo a Corpo', tags: ['Sem barreiras', 'Deslizamento', 'Liberdade'], desc: 'A entrega absoluta. Uso meu corpo sobre o seu e você tem liberdade para retribuir.', flow: ['Alinhamento.', 'Soltura.', 'Gel corpo a corpo.', 'Interação total.', 'Finalização conjunta.'] },
    en: { title: 'Body to Body', tags: ['No barriers', 'Gliding', 'Freedom'], desc: 'Absolute surrender.', flow: ['Alignment.', 'Release.', 'Body gel.', 'Total interaction.', 'Shared finish.'] },
    es: { title: 'Cuerpo a Cuerpo', tags: ['Sin barreras', 'Deslizamiento', 'Libertad'], desc: 'Entrega absoluta.', flow: ['Alineación.', 'Soltura.', 'Gel cuerpo.', 'Interacción.', 'Final conjunto.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, theme: 'slate', L: {
    pt: { title: 'Apenas Depilação', tags: ['Estética', 'Praticidade'], desc: 'Serviço isolado para higiene e estética. Aparo rápido em até 3 áreas.', flow: ['Alinhamento.', 'Aparo com máquina.', 'Acabamento.'] },
    en: { title: 'Trimming Only', tags: ['Grooming', 'Practical'], desc: 'Quick trim up to 3 areas.', flow: ['Alignment.', 'Machine trim.', 'Finish.'] },
    es: { title: 'Solo Depilación', tags: ['Estética', 'Práctico'], desc: 'Recorte rápido.', flow: ['Alineación.', 'Recorte máquina.', 'Acabado.'] } } },
];

const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };

// --- DOCS MODALS ---
const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="font-semibold mt-5 mb-2" style={{ color: 'var(--ink)' }}>{children}</h3>;

const DOCS: Record<DocId, { title: string; body: ReactNode }> = {
  privacy: { title: 'Privacidade', body: (<>
    <P>Atualizado: {LEGAL.ATUALIZADO}. Segue a LGPD (Lei 13.709/2018).</P>
    <H>1. Controlador</H><P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}. Contato: {LEGAL.EMAIL}.</P>
    <H>2. Dados</H><P>Nome, data, horário, pacote, endereço (se for em casa). Sem CPF ou e-mail.</P>
    <H>3. Sensível</H><P>Pedido específico (consentimento explícito), não é salvo.</P>
    <H>4. Compartilhamento</H><P>WhatsApp, ViaCEP (endereço).</P>
    <H>5. Direitos</H><P>Exclusão via "Apagar dados".</P>
  </>) },
  terms: { title: 'Termos', body: (<>
    <P>{LEGAL.RAZAO}. Serviço exclusivo para +18 anos.</P>
    <H>1. Reserva</H><P>O site apenas registra solicitação. Confirmado só no WhatsApp com o sinal.</P>
    <H>2. Preços</H><P>O sinal é abatido. Pacote válido por {C.PACK_DAYS} dias. Cartão com taxas no WhatsApp.</P>
    <H>3. Conduta</H><P>Respeito mútuo. O terapeuta pode encerrar em caso de desrespeito.</P>
  </>) },
  refund: { title: 'Cancelamento', body: (<>
    <P>Cancelamento grátis com {LEGAL.CANCEL_FREE_HOURS}h de antecedência (sinal devolvido ou remarcado).</P>
    <P>Arrependimento (CDC art. 49): 7 dias, se a sessão não ocorreu.</P>
    <P>Reembolso em até 7 dias úteis no mesmo meio.</P>
  </>) },
  cookies: { title: 'Cookies', body: (<>
    <P>Apenas essenciais para tema e idioma (localStorage). Sem rastreamento de terceiros.</P>
  </>) },
};

// --- UTILS ---
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch (e) {} },
  del: (k: string) => { try { localStorage.removeItem(k); } catch (e) {} },
};
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;

type Slot = { t: string; ok: boolean };
function buildSlots(date: Date, dur: number, isHome: boolean, now: Date): Slot[] {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out: Slot[] = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  return out;
}

// --- ICONS ---
const ICONS = {
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  check: 'M20 6L9 17l-5-5',
  map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
  cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4',
  sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z',
  close: 'M18 6L6 18 M6 6l12 12',
  play: 'M5 3l14 9-14 9V3z',
  plus: 'M12 5v14 M5 12h14',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
};
type IconName = keyof typeof ICONS;

const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICONS[name]} /></svg>
));

function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} className={`${className} flex items-center justify-center font-serif text-2xl bg-[var(--surf2)] text-[var(--ink)]`}>T</span>;
  return <img src={C.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

// --- COMPONENTES DE UI ---
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg bg-[var(--bg)] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-slide-up sm:animate-fade-in">
        <div className="flex justify-between items-center p-6 border-b border-[var(--line)]">
          <h2 className="font-serif text-xl text-[var(--ink)]">{title}</h2>
          <button onClick={onClose} className="p-2 text-[var(--mute)] hover:text-[var(--ink)] transition-colors"><Icon name="close" size={20} /></button>
        </div>
        <div className="p-6 overflow-y-auto text-[15px] text-[var(--mute)] leading-relaxed">{children}</div>
      </div>
    </div>
  );
};

// --- MAIN APP ---
export default function App() {
  const [lang, setLang] = useState<Lang>(() => (store.get('thaly_lang') as Lang) || 'pt');
  const [theme, setTheme] = useState<Theme>(() => (store.get('thaly_theme') as Theme) || 'dark');
  const [doc, setDoc] = useState<DocId | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [toast, setToast] = useState('');

  // STATE: INTRO
  const [isIntro, setIsIntro] = useState(() => store.get('thaly_onboard') !== 'yes');
  const [ageOk, setAgeOk] = useState(false);

  // STATE: BOOKING FLOW (1 = Service, 2 = Date/Loc, 3 = Review)
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');

  // STATE: FORM DATA
  const [pkgId, setPkgId] = useState<string>('');
  const [offer, setOffer] = useState<'single' | 'combo' | 'pack'>('single');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState(store.get('thaly_name') || '');
  const [locType, setLocType] = useState<'studio' | 'home'>('studio');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [comp, setComp] = useState('');
  const [bairro, setBairro] = useState('');
  const [payment, setPayment] = useState('');
  const [addTime, setAddTime] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const [req, setReq] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponApplied, setCouponApplied] = useState('');
  const [couponValue, setCouponValue] = useState(0);

  const bookRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);

  const t = (k: string) => T[lang][k] || T.pt[k] || k;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOCALE[lang], o);

  // EFFECTS
  useEffect(() => { store.set('thaly_lang', lang); document.documentElement.lang = LOCALE[lang]; }, [lang]);
  useEffect(() => { store.set('thaly_theme', theme); }, [theme]);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => { if (name.length > 2) store.set('thaly_name', name); }, [name]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(''), 3000); return () => clearTimeout(t); } }, [toast]);

  // DERIVED STATE
  const pkg = useMemo(() => PACKAGES.find(p => p.id === pkgId) || PACKAGES[0], [pkgId]);
  const pt = pkg.L[lang];
  const isSolo = pkg.id === 'aparo_solo';
  const effectiveOffer = isSolo ? 'single' : offer;
  const isPack = effectiveOffer === 'pack';
  const isCombo = effectiveOffer === 'combo';
  const hasReq = reqOk && req.trim().length > 3;

  // SMART RECOMMENDATION
  const recommendedPkgId = useMemo(() => {
    const h = now.getHours();
    if (now.getDay() === 1 || (h >= 9 && h < 14)) return 'classica';
    if (now.getDay() === 5 || h >= 20) return 'sensitiva';
    return 'fusion';
  }, [now]);

  // PRICING
  const invoice = useMemo(() => {
    let dur = pkg.min;
    const timeAdd = addTime ? C.TIME_ADD : 0;
    if (addTime) dur += 30;

    const aparoAdd = isCombo ? pkg.combo : 0;
    const comboSave = isCombo ? C.APARO_FULL - pkg.combo : 0;

    const sessionPrice = isPack ? pkg.price * C.PACK_PAY : pkg.price;
    const packSave = isPack ? pkg.price * (C.PACK_TOTAL - C.PACK_PAY) : 0;
    const reqFee = hasReq ? C.REQ_FEE : 0;

    const base = sessionPrice + aparoAdd + timeAdd + reqFee;
    const peakFee = locType === 'home' && PEAK_HOURS.includes(time) ? C.PEAK_FEE : 0;

    let discount = 0;
    if (!isPack) {
      if (couponApplied) discount = couponValue < 1 ? Math.floor(base * couponValue) : couponValue;
      else if (store.get('thaly_returning') !== 'yes') discount = C.FIRST;
    }
    discount = Math.min(discount, base);

    const after = base - discount;
    const pixDiscount = payment === 'pix' ? Math.ceil(after * C.PIX_DISC) : 0;
    const total = after - pixDiscount + peakFee;
    const sinal = Math.min(C.SIGNAL, total);

    return { sessionPrice, aparoAdd, timeAdd, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: total - sinal, dur, comboSave, packSave, saved: comboSave + packSave + discount + pixDiscount };
  }, [pkg, addTime, isCombo, isPack, hasReq, locType, time, couponApplied, couponValue, payment]);

  // DATE & TIME LOGIC
  const days = useMemo(() => {
    const arr = []; const d = new Date(); d.setHours(0, 0, 0, 0);
    for (let i = 0; i < C.DAYS; i++) { const nd = new Date(d); nd.setDate(nd.getDate() + i); arr.push({ d: nd, i }); }
    return arr;
  }, []);
  const slots = useMemo(() => date ? buildSlots(date, invoice.dur, locType === 'home', now) : [], [date, invoice.dur, locType, now]);
  const availableSlots = slots.filter(s => s.ok).length;
  const endTime = time ? fromMin(toMin(time) + invoice.dur) : '';

  // NEXT FREE SLOT
  const nextFree = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    for (let k = 0; k < 4; k++) {
      const test = new Date(d); test.setDate(test.getDate() + k);
      const s = buildSlots(test, 40, false, now).find(x => x.ok);
      if (s) return { d: test, t: s.t, k };
    }
    return null;
  }, [now]);

  // HANDLERS
  const showToast = (m: string) => { setToast(m); vibrate(20); };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'pt-BR'; u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } else showToast('Áudio não suportado.');
  };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val); setCep(masked);
    if (masked.length === 9) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        const j = await res.json();
        if (!j.erro) { setStreet(j.logradouro || street); setBairro(j.bairro || bairro); setTimeout(() => numberRef.current?.focus(), 100); }
      } catch (e) {}
    }
  };

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    const v = C.COUPONS[code] || 0;
    if (v > 0) { setCouponApplied(code); setCouponValue(v); setCouponInput(''); showToast(t('couponOk')); }
    else showToast(t('couponBad'));
  };

  const goStep2 = () => {
    if (!pkgId) { showToast(t('s1')); return; }
    setStep(2);
    setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const goStep3 = () => {
    if (!date || !time) { showToast(t('fill')); return; }
    if (name.trim().length < 3) { showToast(t('nameErr')); return; }
    if (locType === 'home' && (!street || !number || !bairro)) { showToast(t('addrErr')); return; }
    setStep(3);
    setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const finish = () => {
    if (!payment) { showToast(t('needPay')); return; }
    if (!ageOk) { showToast(t('needAge')); return; }

    const loc = locType === 'home' ? `${street}, ${number}${comp ? ` - ${comp}` : ''} - ${bairro}` : 'No espaço (Bela Vista)';
    const dStr = date?.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    const pk = pkg.L.pt;

    let m = `Oi Thalyson! Vim pelo site e quero confirmar:\n\n*NOME:* ${clean(name)}\n*DIA/HORA:* ${dStr} às ${time} (fim ~${endTime})\n*LOCAL:* ${loc}\n`;
    m += `\n*SESSÃO:* ${pk.title} (${invoice.dur} min)\n`;
    if (isCombo) m += `*ADICIONAL:* Depilação (Combo)\n`;
    if (addTime) m += `*ADICIONAL:* +30 minutos\n`;
    if (hasReq) m += `*PEDIDO:* "${clean(req)}"\n`;
    if (isPack) m += `\n*PACOTE:* 5 sessões (pague 4).\n`;

    m += `\n*PAGAMENTO:*\nTotal: ${money(invoice.total)} (${PAY_PT[payment]})\nSinal (Pix): ${money(invoice.sinal)}\nRestante: ${money(invoice.rest)}\n`;
    if (invoice.saved > 0) m += `Economia: ${money(invoice.saved)}\n`;

    m += `\n✅ Declaro ter 18+ anos e aceito os termos.`;
    if (optIn) m += `\n🔔 Aceito lembretes.`;

    store.set('thaly_returning', 'yes');
    const link = waLink(m);
    setSentLink(link);
    
    // iOS safe redirect
    window.location.href = link;
    
    setDone(true);
    setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const reset = () => {
    setStep(1); setDone(false); setPkgId(''); setOffer('single');
    setDate(null); setTime(''); setPayment(''); setAddTime(false); setReqOk(false); setReq('');
  };

  const googleCalendarLink = () => {
    if (!date || !time) return '';
    const st = `${dateKey(date).replace(/-/g, '')}T${time.replace(':', '')}00`;
    const en = `${dateKey(date).replace(/-/g, '')}T${fromMin(toMin(time) + invoice.dur).replace(':', '')}00`;
    const txt = encodeURIComponent(`Massagem: ${pkg.L.pt.title} - Thalyson`);
    const det = encodeURIComponent(`Sinal: ${money(invoice.sinal)} | Restante: ${money(invoice.rest)}`);
    const loc = encodeURIComponent(locType === 'home' ? `${street}, ${number} - ${bairro}` : 'Bela Vista, São Paulo');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${txt}&dates=${st}/${en}&details=${det}&location=${loc}&ctz=America/Sao_Paulo`;
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
    
    :root {
      --bg: #F8F6F1; --surf: #FFFFFF; --surf2: #F0ECE4; --ink: #1A1816; --mute: #7A7570;
      --line: rgba(26, 24, 22, 0.08); --acc: #1A1816; --onacc: #FFFFFF; --gold: #B89F7A; --ok: #2C5E4A;
    }
    [data-theme="dark"] {
      --bg: #0E0D0C; --surf: #1A1816; --surf2: #24211F; --ink: #F2EFEB; --mute: #999187;
      --line: rgba(242, 239, 235, 0.1); --acc: #F2EFEB; --onacc: #0E0D0C; --gold: #D4B88C; --ok: #50A684;
    }

    body {
      margin: 0; padding: 0; background: var(--bg); color: var(--ink);
      font-family: 'Inter', sans-serif; font-size: 16px; line-height: 1.6;
      -webkit-font-smoothing: antialiased; overflow-x: hidden;
      transition: background-color 0.4s ease, color 0.4s ease;
    }
    .serif { font-family: 'Cormorant Garamond', Georgia, serif; font-weight: 500; }
    
    /* ANIMATIONS */
    @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: none; } }
    @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.05); opacity: 1; } }
    @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(44, 94, 74, 0.4); } 100% { box-shadow: 0 0 0 12px transparent; } }

    .animate-fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-fade-in { animation: fadeIn 0.6s ease both; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .delay-1 { animation-delay: 0.1s; } .delay-2 { animation-delay: 0.2s; } .delay-3 { animation-delay: 0.3s; }
    
    /* UI COMPONENTS */
    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 56px; padding: 0 28px; border-radius: 99px;
      font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
      border: none; text-decoration: none; box-sizing: border-box;
    }
    .btn-primary { background: var(--acc); color: var(--onacc); }
    .btn-primary:disabled { background: var(--surf2); color: var(--mute); cursor: not-allowed; }
    .btn-outline { background: transparent; color: var(--ink); border: 1px solid var(--line); }
    .btn-gold { background: var(--gold); color: #1A1816; }
    
    .card { background: var(--surf); border-radius: 24px; border: 1px solid var(--line); padding: 24px; }
    
    .input-field {
      width: 100%; min-height: 56px; padding: 0 20px; border-radius: 16px;
      background: var(--surf2); border: 1px solid transparent; color: var(--ink);
      font-family: 'Inter', sans-serif; font-size: 16px; transition: all 0.2s; box-sizing: border-box;
    }
    .input-field:focus { outline: none; border-color: var(--gold); background: var(--surf); }
    .input-field::placeholder { color: var(--mute); }
    
    .chip {
      display: inline-flex; flex-direction: column; align-items: center; justify-content: center;
      min-height: 64px; padding: 12px; border-radius: 16px; background: var(--surf);
      border: 1px solid var(--line); cursor: pointer; transition: all 0.2s; user-select: none;
    }
    .chip.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }
    .chip.disabled { opacity: 0.4; text-decoration: line-through; cursor: not-allowed; }

    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .badge-gold { background: rgba(184, 159, 122, 0.15); color: var(--gold); }
    
    .h-scroll { display: flex; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: none; -ms-overflow-style: none; gap: 12px; padding-bottom: 8px; }
    .h-scroll::-webkit-scrollbar { display: none; }
    .h-scroll > * { scroll-snap-align: start; flex-shrink: 0; }

    .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); animation: pulse 2s infinite; }
    .glow { position: absolute; border-radius: 50%; background: radial-gradient(circle, var(--gold) 0%, transparent 70%); opacity: 0.1; filter: blur(60px); pointer-events: none; }
    
    /* RESPONSIVE UTILS */
    .container { width: 100%; max-width: 1024px; margin: 0 auto; padding: 0 20px; box-sizing: border-box; }
    .grid-2 { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr; gap: 16px; }
    
    @media (min-width: 768px) {
      .grid-2 { grid-template-columns: 1fr 1fr; }
      .grid-3 { grid-template-columns: repeat(3, 1fr); }
      .btn { min-height: 60px; font-size: 16px; }
    }
    
    h1, h2, h3, p { margin: 0; word-break: break-word; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .flex-start { display: flex; justify-content: flex-start; align-items: flex-start; }
  `;

  if (isIntro) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center', background: 'var(--bg)' }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="animate-fade-in" style={{ position: 'relative', marginBottom: '40px' }}>
          <div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '1px solid var(--gold)', opacity: 0.3, animation: 'breathe 4s infinite' }} />
          <Avatar className="w-32 h-32 rounded-full relative z-10" alt="" />
        </div>
        <h1 className="serif animate-fade-up delay-1" style={{ fontSize: '36px', lineHeight: 1.1, marginBottom: '12px' }}>Relaxar hoje<br />com Thalyson</h1>
        <p className="animate-fade-up delay-2" style={{ color: 'var(--mute)', marginBottom: '32px', maxWidth: '300px' }}>{t('wSub')}</p>
        
        <div className="animate-fade-up delay-3" style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left', maxWidth: '340px', marginBottom: '24px' }}>
          <input type="checkbox" id="age" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 24, height: 24, marginTop: 4, accentColor: 'var(--ink)' }} />
          <label htmlFor="age" style={{ fontSize: '14px', color: 'var(--mute)', lineHeight: 1.5 }}>
            Declaro ter 18 anos ou mais e aceito os <button onClick={() => setDoc('terms')} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--ink)', padding: 0, font: 'inherit', cursor: 'pointer' }}>Termos</button>.
          </label>
        </div>
        
        <button onClick={() => { if (!ageOk) return showToast(t('needAgeEnter')); store.set('thaly_onboard', 'yes'); setIsIntro(false); }} disabled={!ageOk} className="btn btn-primary" style={{ width: '100%', maxWidth: '340px' }}>
          {ageOk ? t('enter') : t('needAgeEnter')}
        </button>
        {doc && <Modal title={DOCS[doc].title} onClose={() => setDoc(null)}>{DOCS[doc].body}</Modal>}
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '60px' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      {/* HEADER */}
      <header style={{ position: 'sticky', top: 0, zIndex: 40, background: 'color-mix(in srgb, var(--bg) 85%, transparent)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--line)' }}>
        <div className="container flex-between" style={{ height: '64px' }}>
          <button onClick={() => setProfileOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Avatar className="w-10 h-10 rounded-full" alt="Thalyson" />
            <span className="serif" style={{ fontSize: '18px', color: 'var(--ink)' }}>Relaxar hoje</span>
          </button>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={lang} onChange={e => setLang(e.target.value as Lang)} style={{ background: 'var(--surf2)', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)', outline: 'none', cursor: 'pointer' }}>
              <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
            </select>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} style={{ background: 'none', border: 'none', color: 'var(--ink)', cursor: 'pointer', padding: '8px' }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="container" style={{ paddingTop: '60px', paddingBottom: '60px', position: 'relative' }}>
        <div className="glow" style={{ width: 400, height: 400, top: -100, right: -100 }} />
        <div className="animate-fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--gold)', fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>
            <Icon name="map" size={14} /> {t('badge')}
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(48px, 10vw, 80px)', lineHeight: 1, marginBottom: '24px' }}>{t('h1')}</h1>
          <p style={{ fontSize: '18px', color: 'var(--mute)', maxWidth: '500px', marginBottom: '32px' }}>{t('sub')}</p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
            <button onClick={() => { setStep(1); bookRef.current?.scrollIntoView({ behavior: 'smooth' }); }} className="btn btn-primary">{t('cta')}</button>
            <a href={C.REVIEW_LINK} target="_blank" rel="noreferrer" className="btn btn-outline"><Icon name="star" size={16} /> {t('reviews')}</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--mute)' }}>
            {nextFree && (<><span className="dot" /><span>{t('nextFree')}: <strong style={{ color: 'var(--ink)' }}>{nextFree.k === 0 ? t('today') : t('tomorrow')} {nextFree.t}</strong></span></>)}
          </div>
        </div>
      </section>

      {/* BOOKING FLOW */}
      <section ref={bookRef} className="container" style={{ paddingTop: '40px', paddingBottom: '80px' }}>
        
        {/* STEP INDICATOR */}
        {!done && (
          <div className="flex-between" style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map(s => (
                <div key={s} style={{ width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, background: step >= s ? 'var(--ink)' : 'var(--surf2)', color: step >= s ? 'var(--bg)' : 'var(--mute)', transition: 'all 0.3s' }}>{s}</div>
              ))}
            </div>
            <span style={{ fontSize: '14px', color: 'var(--mute)' }}>Etapa {step} de 3</span>
          </div>
        )}

        {done ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '40px 20px', background: 'var(--surf2)', border: 'none' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ok)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Icon name="check" size={32} />
            </div>
            <h2 className="serif" style={{ fontSize: '32px', marginBottom: '12px' }}>{t('doneH')}</h2>
            <p style={{ color: 'var(--mute)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>{t('doneP')}</p>
            <p style={{ fontWeight: 600, color: 'var(--gold)', marginBottom: '24px' }}>{t('doneSig')} ({money(invoice.sinal)})</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
              <a href={sentLink} target="_blank" rel="noreferrer" className="btn btn-primary">{t('resend')}</a>
              <button onClick={async () => { await copyText(C.PIX_KEY); showToast(t('pixCopied')); }} className="btn btn-outline"><Icon name="copy" size={16} /> {t('copyPix')}</button>
              <a href={googleCalendarLink()} target="_blank" rel="noreferrer" className="btn btn-outline"><Icon name="cal" size={16} /> {t('addCal')}</a>
              <button onClick={reset} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--mute)', padding: '12px', cursor: 'pointer', fontSize: '14px' }}>{t('restart')}</button>
            </div>
          </div>
        ) : (
          <div>
            {/* STEP 1: SERVICE */}
            {step === 1 && (
              <div className="animate-fade-up">
                <h2 className="serif" style={{ fontSize: '28px', marginBottom: '24px' }}>{t('s1')}</h2>
                <div className="grid-2">
                  {PACKAGES.map(p => {
                    const isSelected = pkgId === p.id;
                    const isRec = p.id === recommendedPkgId && !pkgId;
                    return (
                      <div key={p.id} onClick={() => { setPkgId(p.id); if(p.id === 'aparo_solo') setOffer('single'); }} className="card" style={{ cursor: 'pointer', borderColor: isSelected ? 'var(--gold)' : 'var(--line)', background: isSelected ? 'var(--surf2)' : 'var(--surf)', transition: 'all 0.2s' }}>
                        <div className="flex-between" style={{ alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 className="serif" style={{ fontSize: '22px', lineHeight: 1.2, flex: 1, paddingRight: '16px' }}>{p.L[lang].title}</h3>
                          <span className="serif" style={{ fontSize: '22px', fontWeight: 600, color: isSelected ? 'var(--gold)' : 'var(--ink)' }}>{money(p.price)}</span>
                        </div>
                        <div style={{ fontSize: '14px', color: 'var(--mute)', marginBottom: '16px' }}>{p.min} min • {p.L[lang].tags.slice(0, 2).join(' • ')}</div>
                        {isRec && <span className="badge badge-gold" style={{ marginBottom: '12px' }}>{t('recommended')}</span>}
                        
                        {isSelected && (
                          <div className="animate-fade-in" style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                            <p style={{ fontSize: '15px', marginBottom: '16px' }}>{p.L[lang].desc}</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                              {p.L[lang].tags.map(tag => <span key={tag} style={{ background: 'var(--bg)', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>{tag}</span>)}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); speak(`${p.L[lang].title}. ${p.L[lang].desc}`); }} className="btn btn-outline" style={{ minHeight: 40, padding: '0 16px', fontSize: '13px', width: '100%' }}>
                              <Icon name="play" size={14} /> {t('listen')}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {pkgId && !isSolo && (
                  <div className="animate-fade-up" style={{ marginTop: '40px' }}>
                    <h3 className="serif" style={{ fontSize: '22px', marginBottom: '16px' }}>Como quer aproveitar?</h3>
                    <div className="grid-3">
                      {([['single', t('oSingle'), pkg.price], ['combo', t('oCombo'), pkg.price + pkg.combo], ['pack', t('oPack'), pkg.price * C.PACK_PAY]] as const).map(([id, label, price]) => (
                        <div key={id} onClick={() => setOffer(id as any)} style={{ padding: '16px', borderRadius: '16px', border: `1px solid ${effectiveOffer === id ? 'var(--ink)' : 'var(--line)'}`, background: effectiveOffer === id ? 'var(--ink)' : 'var(--surf)', color: effectiveOffer === id ? 'var(--bg)' : 'var(--ink)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '14px' }}>{label}</div>
                          <div className="serif" style={{ fontSize: '20px' }}>{money(price)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={goStep2} disabled={!pkgId} className="btn btn-primary" style={{ width: '100%', marginTop: '40px' }}>{t('cont')}</button>
              </div>
            )}

            {/* STEP 2: DATE & TIME & DETAILS */}
            {step === 2 && (
              <div className="animate-fade-up">
                <h2 className="serif" style={{ fontSize: '28px', marginBottom: '24px' }}>{t('s2')}</h2>
                
                {/* DATES */}
                <div style={{ marginBottom: '32px' }}>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mute)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('date')}</span>
                  <div className="h-scroll">
                    {days.map(({ d, i }) => {
                      const sel = sameDay(date, d);
                      return (
                        <div key={dateKey(d)} onClick={() => { setDate(d); setTime(''); }} className={`chip ${sel ? 'active' : ''}`} style={{ width: '80px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 600, textTransform: 'capitalize', opacity: 0.8 }}>{i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmt(d, { weekday: 'short' })}</span>
                          <span className="serif" style={{ fontSize: '24px', lineHeight: 1.2 }}>{d.getDate()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* TIMES */}
                {date && (
                  <div className="animate-fade-in" style={{ marginBottom: '32px' }}>
                    <div className="flex-between" style={{ marginBottom: '12px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--mute)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('time')}</span>
                      <span style={{ fontSize: '12px', color: 'var(--mute)' }}>{invoice.dur} min</span>
                    </div>
                    {availableSlots === 0 ? <p style={{ fontSize: '14px', color: 'var(--mute)' }}>{t('noSlots')}</p> : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '10px' }}>
                        {slots.map(({ t: tm, ok }) => (
                          <div key={tm} onClick={() => ok && setTime(tm)} className={`chip ${time === tm ? 'active' : ''} ${!ok ? 'disabled' : ''}`} style={{ minHeight: '48px', padding: '8px' }}>
                            <span style={{ fontWeight: 600 }}>{tm}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* DETAILS */}
                <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mute)', marginBottom: '8px', textTransform: 'uppercase' }}>{t('name')}</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder={t('namePh')} className="input-field" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mute)', marginBottom: '8px', textTransform: 'uppercase' }}>{t('place')}</label>
                    <div className="grid-2">
                      <div onClick={() => setLocType('studio')} className={`chip ${locType === 'studio' ? 'active' : ''}`}>{t('studio')}</div>
                      <div onClick={() => setLocType('home')} className={`chip ${locType === 'home' ? 'active' : ''}`}>{t('home')}</div>
                    </div>
                  </div>
                  
                  {locType === 'home' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                      <input type="tel" placeholder={t('cep')} value={cep} onChange={e => handleCep(e.target.value)} className="input-field" maxLength={9} />
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input type="text" placeholder={t('street')} value={street} onChange={e => setStreet(e.target.value)} className="input-field" style={{ flex: 2 }} />
                        <input ref={numberRef} type="text" placeholder={t('number')} value={number} onChange={e => setNumber(e.target.value)} className="input-field" style={{ flex: 1 }} />
                      </div>
                      <input type="text" placeholder={t('bairro')} value={bairro} onChange={e => setBairro(e.target.value)} className="input-field" />
                      <p style={{ fontSize: '13px', color: 'var(--mute)' }}>{t('peakNote')}</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline" style={{ flex: 1 }}>Voltar</button>
                  <button onClick={goStep3} className="btn btn-primary" style={{ flex: 2 }}>{t('cont')}</button>
                </div>
              </div>
            )}

            {/* STEP 3: REVIEW & PAYMENT */}
            {step === 3 && (
              <div className="animate-fade-up">
                <h2 className="serif" style={{ fontSize: '28px', marginBottom: '24px' }}>{t('s3')}</h2>
                
                <div className="card" style={{ marginBottom: '24px', background: 'var(--surf2)', border: 'none' }}>
                  <div className="flex-between" style={{ marginBottom: '12px' }}><span style={{ color: 'var(--mute)' }}>{t('sPack')}</span><strong style={{ textAlign: 'right' }}>{pt.title} ({effectiveOffer})</strong></div>
                  <div className="flex-between" style={{ marginBottom: '12px' }}><span style={{ color: 'var(--mute)' }}>{t('sWhen')}</span><strong style={{ textAlign: 'right' }}>{date && `${fmt(date, { day: '2-digit', month: 'short' })}, ${time}`}</strong></div>
                  <div className="flex-between" style={{ marginBottom: '12px' }}><span style={{ color: 'var(--mute)' }}>{t('sLoc')}</span><strong style={{ textAlign: 'right' }}>{locType === 'studio' ? t('sLocStudio') : `${street}, ${number}`}</strong></div>
                  <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'var(--gold)', textDecoration: 'underline', fontSize: '13px', padding: 0, cursor: 'pointer' }}>{t('change')}</button>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--mute)', marginBottom: '12px', textTransform: 'uppercase' }}>{t('pay')}</span>
                  <div className="grid-3">
                    {(['pix', 'card', 'cash'] as const).map(p => (
                      <div key={p} onClick={() => setPayment(p)} className={`chip ${payment === p ? 'active' : ''}`} style={{ minHeight: '48px' }}>{t(p)}</div>
                    ))}
                  </div>
                  {payment === 'card' && <p style={{ fontSize: '13px', color: 'var(--mute)', marginTop: '12px' }}>{t('cardNote')}</p>}
                </div>

                <details className="card" style={{ marginBottom: '24px', padding: 0, overflow: 'hidden' }}>
                  <summary style={{ padding: '20px', cursor: 'pointer', fontWeight: 600, outline: 'none' }}>{t('extras')}</summary>
                  <div style={{ padding: '0 20px 20px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', marginBottom: '16px' }}>
                      <input type="checkbox" checked={addTime} onChange={e => setAddTime(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--ink)' }} />
                      <span style={{ flex: 1 }}>{t('lTime')}</span>
                      <strong>+{money(C.TIME_ADD)}</strong>
                    </label>
                    {!isPack && !couponApplied && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <input type="text" placeholder={t('couponPh')} value={couponInput} onChange={e => setCouponInput(e.target.value)} className="input-field" style={{ flex: 1, minHeight: '48px' }} />
                        <button onClick={applyCoupon} className="btn btn-outline" style={{ minHeight: '48px', padding: '0 16px' }}>{t('apply')}</button>
                      </div>
                    )}
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', marginBottom: '12px' }}>
                      <input type="checkbox" checked={reqOk} onChange={e => { setReqOk(e.target.checked); if (!e.target.checked) setReq(''); }} style={{ width: 20, height: 20, marginTop: 4, accentColor: 'var(--ink)' }} />
                      <span style={{ fontSize: '13px', color: 'var(--mute)' }}>{t('reqConsent')}</span>
                    </label>
                    <input type="text" disabled={!reqOk} placeholder={t('reqPh')} value={req} onChange={e => setReq(e.target.value)} className="input-field" style={{ minHeight: '48px' }} />
                  </div>
                </details>

                <div className="card" style={{ marginBottom: '24px', border: '1px solid var(--gold)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px', fontSize: '15px' }}>
                    <div className="flex-between"><span>{t('lPack')}</span><span>{money(invoice.sessionPrice)}</span></div>
                    {invoice.aparoAdd > 0 && <div className="flex-between" style={{ color: 'var(--ok)' }}><span>{t('lCombo')}</span><span>+{money(invoice.aparoAdd)}</span></div>}
                    {invoice.timeAdd > 0 && <div className="flex-between"><span>{t('lTime')}</span><span>+{money(invoice.timeAdd)}</span></div>}
                    {invoice.discount > 0 && <div className="flex-between" style={{ color: 'var(--ok)' }}><span>Desconto</span><span>-{money(invoice.discount)}</span></div>}
                    {invoice.pixDiscount > 0 && <div className="flex-between" style={{ color: 'var(--ok)' }}><span>{t('lPix')}</span><span>-{money(invoice.pixDiscount)}</span></div>}
                  </div>
                  <div className="flex-between" style={{ paddingTop: '16px', borderTop: '1px solid var(--line)' }}>
                    <strong style={{ fontSize: '16px' }}>{t('total')}</strong>
                    <span className="serif" style={{ fontSize: '32px', fontWeight: 600 }}>{money(invoice.total)}</span>
                  </div>
                  <div className="grid-2" style={{ marginTop: '16px' }}>
                    <div style={{ background: 'var(--surf2)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--mute)' }}>{t('signal')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--gold)' }}>{money(invoice.sinal)}</div>
                    </div>
                    <div style={{ background: 'var(--surf2)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: 'var(--mute)' }}>{t('rest')}</div>
                      <div style={{ fontWeight: 700 }}>{money(invoice.rest)}</div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '24px' }}>
                  <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 20, height: 20, marginTop: 4, accentColor: 'var(--ink)' }} />
                  <label style={{ fontSize: '13px', color: 'var(--mute)' }}>{t('ageA')} <button onClick={() => setDoc('terms')} style={{ background: 'none', border: 'none', textDecoration: 'underline', color: 'var(--ink)', padding: 0, font: 'inherit', cursor: 'pointer' }}>{t('terms')}</button>.</label>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setStep(2)} className="btn btn-outline" style={{ flex: 1 }}>Voltar</button>
                  <button onClick={finish} disabled={!payment || !ageOk} className="btn btn-primary" style={{ flex: 2 }}>{t('send')}</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* FAQ & ABOUT */}
      <section className="container" style={{ paddingBottom: '80px' }}>
        <div className="grid-2">
          <div className="card">
            <h3 className="serif" style={{ fontSize: '24px', marginBottom: '16px' }}>{t('aboutH')}</h3>
            <p style={{ color: 'var(--mute)', marginBottom: '16px' }}>{t('about1')}</p>
            <p style={{ color: 'var(--mute)', marginBottom: '24px' }}><Icon name="map" size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />{t('about2')}</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setProfileOpen(true)} className="btn btn-outline" style={{ flex: 1 }}>{t('seeProfile')}</button>
              <a href={C.INSTAGRAM} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ flex: 1 }}><Icon name="instagram" size={16} /> Instagram</a>
            </div>
          </div>
          <div className="card">
            <h3 className="serif" style={{ fontSize: '24px', marginBottom: '16px' }}>{t('faqH')}</h3>
            {[['q1','a1'],['q2','a2'],['q3','a3']].map(([q,a]) => (
              <details key={q} style={{ borderBottom: '1px solid var(--line)', padding: '12px 0' }}>
                <summary style={{ fontWeight: 600, cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between' }}>{t(q)} <Icon name="plus" size={16} /></summary>
                <p style={{ color: 'var(--mute)', fontSize: '14px', marginTop: '8px' }}>{t(a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '40px 20px', textAlign: 'center', fontSize: '12px', color: 'var(--mute)' }}>
        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={() => setDoc('privacy')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>{t('footPrivacy')}</button>
          <button onClick={() => setDoc('terms')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>{t('footTerms')}</button>
          <button onClick={() => setDoc('refund')} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>{t('footRefund')}</button>
        </div>
        <p style={{ marginBottom: '8px' }}>{LEGAL.RAZAO} • CNPJ {LEGAL.CNPJ}</p>
        <p style={{ fontWeight: 600 }}>{t('adults')}</p>
      </footer>

      {/* MODALS */}
      {toast && <div className="animate-fade-in" style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--ink)', color: 'var(--bg)', padding: '12px 24px', borderRadius: '99px', fontWeight: 600, fontSize: '14px', zIndex: 100, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>{toast}</div>}
      {profileOpen && (
        <Modal title={t('profile')} onClose={() => setProfileOpen(false)}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <Avatar className="w-16 h-16 rounded-full" alt="Thalyson" />
            <div>
              <h3 className="serif" style={{ fontSize: '20px', color: 'var(--ink)' }}>{t('aboutH')}</h3>
              <p style={{ color: 'var(--gold)', fontSize: '14px', fontWeight: 600 }}>{t('aboutR')}</p>
            </div>
          </div>
          <p style={{ marginBottom: '16px' }}>{t('about1')}</p>
          <ul style={{ paddingLeft: '20px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['pBul1','pBul2','pBul3'].map(k => <li key={k}>{t(k)}</li>)}
          </ul>
          <div style={{ background: 'var(--surf2)', padding: '16px', borderRadius: '16px', marginBottom: '24px' }}>
             <div style={{ marginBottom: '12px' }}><strong>{t('pHours')}:</strong> {t('pHoursV').replace('{a}', '09:00').replace('{b}', '23:30')}</div>
             <div style={{ marginBottom: '12px' }}><strong>{t('pPay')}:</strong> {t('pPayV')}</div>
             <div><strong>{t('pCancel')}:</strong> {t('pCancelV')}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a href={waLink(t('chatMsg'))} target="_blank" rel="noreferrer" className="btn btn-primary"><Icon name="chat" size={16} /> {t('chatBtn')}</a>
            <button onClick={() => { store.del('thaly_name'); store.del('thaly_returning'); setName(''); setProfileOpen(false); showToast(t('forgot')); }} style={{ background: 'none', border: 'none', color: 'var(--mute)', textDecoration: 'underline', cursor: 'pointer', padding: '8px' }}>{t('pForget')}</button>
          </div>
        </Modal>
      )}
      {doc && <Modal title={DOCS[doc].title} onClose={() => setDoc(null)}>{DOCS[doc].body}</Modal>}
    </div>
  );
}
