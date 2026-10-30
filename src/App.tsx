import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   DADOS LEGAIS (confirme a razão social no cartão CNPJ)
   ========================================================================== */
const SITE_NAME = 'Relaxar hoje com Thalyson';
const LEGAL = {
  RAZAO: 'Thalyson Rodrigo dos Santos',
  CNPJ: '62.922.530/0001-44',
  ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo - SP',
  EMAIL: 'relaxecomthalyson@gmail.com',
  ENCARREGADO: 'Thalyson Rodrigo dos Santos',
  ATUALIZADO: '01/01/2025',
  CANCEL_FREE_HOURS: 12,
};

/* ==========================================================================
   CONFIGURAÇÃO
   ========================================================================== */
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
  PACK_DAYS: 30, // Reduzido de 90 para 30 dias
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
const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

/* ==========================================================================
   TEXTOS (PT / EN / ES)
   ========================================================================== */
const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando o seu momento de pausa', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Massagem masculina em São Paulo. Escolha, marque e confirme pelo WhatsApp. Simples e reservado.', w1: 'Reserva em 1 minuto', w2: 'Sinal de só R$ 40', w3: 'Cancelamento grátis',
    enter: 'Entrar e agendar', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'O seu momento de pausa.', sub: 'Massagem masculina em São Paulo. Escolha, agende e relaxe: a confirmação chega direto no seu WhatsApp.',
    cta: 'Agendar agora', reviews: 'Avaliações', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Massagens a partir de',
    t1: 'Sinal de R$ 40, o resto após a sessão', t2: 'Cancelamento grátis até 12h antes', t3: 'R$ 15 off na 1ª sessão, automático',
    offH: 'Mais vantagem para você', offS: 'Combo com depilação e pacote fidelidade, com a economia sempre à vista.',
    cbT: 'Massagem + depilação', cbD: 'Economize até R$ 70 no mesmo atendimento.', lyT: 'Leve 5, pague 4', lyD: 'A 5ª sessão é grátis. Você agenda a 1ª agora.', see: 'Ver opção',
    s1: 'Escolha a sessão', s2: 'Como quer levar?', s3: 'Quando e onde', s4: 'Resumo e pagamento', min: 'min', flowH: 'Como será a sessão',
    oSingle: 'Sessão avulsa', oSingleD: 'Uma sessão, sem compromisso.', oCombo: 'Com depilação', oComboD: 'Inclui aparo de pelos em até 3 lugares.', oPack: 'Pacote 5 sessões', oPackD: 'Pague 4 e a 5ª é grátis. Validade de {n} dias.',
    save: 'Economize', was: 'De',
    packNote: 'Cupom e desconto de 1ª sessão não acumulam com o pacote, que já é o melhor preço. Você agenda esta 1ª sessão agora e as outras 4 depois, pelo WhatsApp.',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).', place: 'Local da sessão', studio: 'No meu espaço', home: 'Vou até você',
    peakNote: 'Horários de pico no seu endereço têm taxa de R$ 18. Pedimos mais antecedência para o deslocamento. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú). O endereço exato é enviado com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua ou Avenida', number: 'Nº', comp: 'Complemento', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    demo: 'Disponibilidade demonstrativa: a reserva só vale após a resposta no WhatsApp.', dateErr: 'Escolha uma data.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'indisponível',
    cont: 'Continuar para o resumo', fill: 'Complete os campos destacados', change: 'Alterar', sPack: 'Sessão', sWhen: 'Quando', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)',
    lPack: 'Sessão', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Depilação (combo)', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Presente de 1ª sessão', lCoupon: 'Cupom', lPeak: 'Deslocamento / pico', lPix: 'Desconto Pix (3%)',
    saved: 'Você economiza', total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    extras: 'Extras e cupom', couponQ: 'Possui cupom?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido ou expirado.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp, não é salvo neste aparelho e posso retirar o consentimento quando quiser.',
    reqPh: 'Algum detalhe ou vontade para a sessão', reqNote: 'Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.',
    pay: 'Como vai pagar o restante?', pix: 'Pix (-3%)', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'Taxas do cartão são combinadas pelo WhatsApp antes do pagamento.',
    optIn: 'Quero receber lembretes e novidades pelo WhatsApp.',
    ageA: 'Declaro ter 18 anos ou mais e li a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e a', refund: 'Política de Cancelamento',
    sigA: 'Para confirmar o horário, envie o sinal de', sigB: 'via Pix. O restante é acertado após a sessão.', copyPix: 'Copiar chave Pix', pixCopied: 'Chave Pix copiada',
    send: 'Enviar pelo WhatsApp', needPay: 'Escolha a forma de pagamento', needAge: 'Confirme que você tem 18 anos ou mais',
    doneH: 'Tudo pronto!', doneP: 'Sua solicitação foi preparada. O horário só está confirmado depois da resposta pelo WhatsApp.',
    doneSig: 'Envie o comprovante do sinal na conversa para confirmar.', resend: 'Reenviar mensagem', addCal: 'Adicionar à agenda', restart: 'Voltar ao início',
    chatQ: 'Prefere tirar uma dúvida antes?', chatBtn: 'Falar no WhatsApp', chatMsg: 'Oi Thalyson! Vim pelo site Relaxar hoje com Thalyson e tenho uma dúvida.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta masculino', about1: 'Meu trabalho é focado no corpo masculino: usar o toque para aliviar o peso e a tensão da sua rotina.',
    about2: 'Atendo em uma suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.', seeProfile: 'Ver perfil',
    faqH: 'Dúvidas rápidas', q1: 'Como funciona o sinal?', a1: 'Você paga R$ 40 por Pix para garantir o horário. O restante é pago depois da sessão.',
    q2: 'E se eu precisar cancelar?', a2: 'Até 12 horas antes você recebe o sinal de volta ou remarca sem custo.', q3: 'Que dados preciso informar?', a3: 'Só nome, dia, horário e pacote. Não pedimos CPF nem telefone no site.',
    q4: 'Posso pagar no cartão?', a4: 'Sim: Pix (com 3% de desconto), cartão em até 12x (taxas combinadas antes) ou dinheiro.',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento', footCookies: 'Cookies', adults: 'Serviço exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Alternar tema', lang: 'Idioma', srLight: 'Tema claro', srDark: 'Tema escuro', legalNote: '',
    profile: 'Perfil', openProfile: 'Abrir perfil', gm: 'Bom dia', ga: 'Boa tarde', gn: 'Boa noite',
    pBul1: 'Conversa inicial para combinar limites', pBul2: 'Atendimento sem pressa, horário reservado', pBul3: 'Ambiente reservado em suíte',
    pHours: 'Horário', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Pagamento', pPayV: 'Pix, cartão até 12x e dinheiro',
    pWhere: 'Onde atendo', pWhereV: 'Bela Vista ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis até 12 horas antes',
    pForget: 'Apagar meus dados deste aparelho', forgot: 'Dados apagados'
  },
  en: {
    loadMsg: 'Preparing your moment to pause', badge: 'Bela Vista, Downtown São Paulo',
    wSub: 'Men’s massage in São Paulo. Choose, book and confirm on WhatsApp. Simple and private.', w1: 'Book in 1 minute', w2: 'Deposit of R$ 40', w3: 'Free cancellation',
    enter: 'Enter and book', needAgeEnter: 'Confirm you are 18 or older',
    h1: 'Your moment to pause.', sub: 'Men’s massage in São Paulo. Choose, book and relax: the confirmation lands straight in your WhatsApp.',
    cta: 'Book now', reviews: 'Reviews', nextFree: 'Next free slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Massages from',
    t1: 'Deposit of R$ 40, the rest after', t2: 'Free cancellation up to 12h before', t3: 'R$ 15 off 1st session, automatic',
    offH: 'More value for you', offS: 'Grooming combo and loyalty pack, with savings always in sight.',
    cbT: 'Massage + grooming', cbD: 'Save up to R$ 70 in the same visit.', lyT: 'Get 5, pay for 4', lyD: 'The 5th session is free.', see: 'See option',
    s1: 'Choose session', s2: 'How would you like it?', s3: 'When and where', s4: 'Summary & payment', min: 'min', flowH: 'How it goes',
    oSingle: 'Single session', oSingleD: 'One session, no commitment.', oCombo: 'With grooming', oComboD: 'Includes body trimming.', oPack: '5-session pack', oPackD: 'Pay 4, 5th is free. Valid for {n} days.',
    save: 'Save', was: 'Was',
    packNote: 'Coupons do not stack with the pack. Book the 1st session now and the other 4 later on WhatsApp.',
    name: 'What should I call you?', namePh: 'Your name', nameErr: 'Enter your name.', place: 'Location', studio: 'At my place', home: 'I come to you',
    peakNote: 'Peak hours at your address carry a R$ 18 fee.',
    studioInfo: 'The suite is in Bela Vista. Address sent with confirmation.',
    cep: 'ZIP code', street: 'Street', number: 'No.', comp: 'Apartment', bairro: 'Neighborhood', addrErr: 'Fill in address fields.', cepFail: 'ZIP not found.',
    date: 'Date', time: 'Start time', session: 'Session', peak: 'Peak', noSlots: 'No free slots. Try another date.',
    demo: 'Sample availability: confirmed only via WhatsApp.', dateErr: 'Choose a date.', timeErr: 'Choose a time.', from: 'From', to: 'to', unavailable: 'unavailable',
    cont: 'Continue', fill: 'Complete highlighted fields', change: 'Change', sPack: 'Session', sWhen: 'When', sLoc: 'Location', sLocStudio: 'At the suite',
    lPack: 'Session', lPack5: '5-session pack', lCombo: 'Grooming', lTime: '+30 extra minutes', lReq: 'Specific request', lFirst: '1st session gift', lCoupon: 'Coupon', lPeak: 'Travel/peak', lPix: 'Pix discount',
    saved: 'You save', total: 'Total', signal: 'Deposit now', rest: 'After session',
    extras: 'Extras & coupon', couponQ: 'Have a coupon?', couponPh: 'Code', apply: 'Apply', couponOk: 'Applied', couponBad: 'Invalid coupon.',
    reqQ: 'Specific request (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describing a request that may relate to sex life, only for evaluation. Goes via WhatsApp only.',
    reqPh: 'Details or wishes', reqNote: 'Evaluated at session time. If not feasible, not charged.',
    pay: 'How will you pay the rest?', pix: 'Pix (-3%)', card: 'Card', cash: 'Cash', cardNote: 'Card fees agreed on WhatsApp.',
    optIn: 'I want reminders via WhatsApp.',
    ageA: 'I am 18+ and read the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and', refund: 'Cancellation Policy',
    sigA: 'To confirm, send a deposit of', sigB: 'via Pix. Rest settled after.', copyPix: 'Copy Pix key', pixCopied: 'Copied',
    send: 'Send on WhatsApp', needPay: 'Choose payment method', needAge: 'Confirm you are 18+',
    doneH: 'All set!', doneP: 'Your request is ready. Time confirmed after WhatsApp reply.',
    doneSig: 'Send deposit receipt in chat to confirm.', resend: 'Resend', addCal: 'Add to calendar', restart: 'Restart',
    chatQ: 'Ask something first?', chatBtn: 'Chat on WhatsApp', chatMsg: 'Hi Thalyson! I have a question.',
    aboutH: 'Thalyson Massagens', aboutR: 'Male therapist', about1: 'Focused on the male body: relieving routine tension.',
    about2: 'I work from a suite in downtown SP.', seeProfile: 'See profile',
    faqH: 'Quick questions', q1: 'How does the deposit work?', a1: 'Pay R$ 40 via Pix to hold the time.',
    q2: 'Cancellation?', a2: 'Up to 12h before, you get the deposit back.', q3: 'What data do I give?', a3: 'Name, day, time. No ID or phone needed on site.',
    q4: 'Pay by card?', a4: 'Yes: Pix, card or cash.',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Refunds', footCookies: 'Cookies', adults: 'Service for adults 18+.',
    close: 'Close', theme: 'Theme', lang: 'Language', srLight: 'Light theme', srDark: 'Dark theme', legalNote: 'Documents are binding in Portuguese.',
    profile: 'Profile', openProfile: 'Open profile', gm: 'Good morning', ga: 'Good afternoon', gn: 'Good evening',
    pBul1: 'Initial chat to agree on limits', pBul2: 'No rush, reserved time slot', pBul3: 'Private suite setting',
    pHours: 'Hours', pHoursV: 'Every day, {a} to {b}', pPay: 'Payment', pPayV: 'Pix, card, cash',
    pWhere: 'Location', pWhereV: 'At my place or yours', pCancel: 'Cancellation', pCancelV: 'Free up to 12h before',
    pForget: 'Erase my data', forgot: 'Data erased'
  },
  es: {
    loadMsg: 'Preparando tu momento', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Masaje masculino en São Paulo. Reserva y confirma por WhatsApp.', w1: 'Reserva en 1 minuto', w2: 'Señal de R$ 40', w3: 'Cancelación gratis',
    enter: 'Entrar y reservar', needAgeEnter: 'Confirma que tienes 18+',
    h1: 'Tu momento de pausa.', sub: 'Elige, reserva y relájate: la confirmación llega a tu WhatsApp.',
    cta: 'Reservar ahora', reviews: 'Reseñas', nextFree: 'Próximo horario libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Masajes desde',
    t1: 'Señal de R$ 40, resto después', t2: 'Cancelación gratis hasta 12h antes', t3: 'R$ 15 off en 1ª sesión',
    offH: 'Más ventajas', offS: 'Combo con depilación y paquete fidelidad.',
    cbT: 'Masaje + depilación', cbD: 'Ahorra hasta R$ 70.', lyT: 'Lleva 5, paga 4', lyD: 'La 5ª sesión es gratis.', see: 'Ver opción',
    s1: 'Elige la sesión', s2: '¿Cómo la quieres?', s3: 'Cuándo y dónde', s4: 'Resumen y pago', min: 'min', flowH: 'Cómo será',
    oSingle: 'Sesión individual', oSingleD: 'Una sesión, sin compromiso.', oCombo: 'Con depilación', oComboD: 'Incluye recorte de vello.', oPack: 'Paquete 5 sesiones', oPackD: 'Paga 4, 5ª gratis. Validez {n} días.',
    save: 'Ahorra', was: 'Antes',
    packNote: 'Los cupones no se acumulan. Reservas la 1ª sesión ahora.',
    name: '¿Cómo te llamo?', namePh: 'Tu nombre', nameErr: 'Ingresa tu nombre.', place: 'Lugar', studio: 'En mi espacio', home: 'Voy hasta ti',
    peakNote: 'Horarios pico en tu dirección tienen tasa de R$ 18.',
    studioInfo: 'La suite está en Bela Vista. Dirección exacta por WhatsApp.',
    cep: 'CEP', street: 'Calle', number: 'Nº', comp: 'Complemento', bairro: 'Barrio', addrErr: 'Completa la dirección.', cepFail: 'CEP no encontrado.',
    date: 'Fecha', time: 'Hora', session: 'Sesión', peak: 'Pico', noSlots: 'Sin horarios. Prueba otra fecha.',
    demo: 'Disponibilidad demostrativa. Se confirma en WhatsApp.', dateErr: 'Elige fecha.', timeErr: 'Elige hora.', from: 'De', to: 'a', unavailable: 'no disponible',
    cont: 'Continuar', fill: 'Completa los campos', change: 'Cambiar', sPack: 'Sesión', sWhen: 'Cuándo', sLoc: 'Lugar', sLocStudio: 'En la suite',
    lPack: 'Sesión', lPack5: 'Paquete 5 sesiones', lCombo: 'Depilación', lTime: '+30 min extra', lReq: 'Pedido específico', lFirst: 'Regalo 1ª sesión', lCoupon: 'Cupón', lPeak: 'Desplazamiento', lPix: 'Descuento Pix',
    saved: 'Ahorras', total: 'Total', signal: 'Señal ahora', rest: 'Después',
    extras: 'Extras y cupón', couponQ: '¿Tienes cupón?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Activado', couponBad: 'Cupón inválido.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saber más',
    reqConsent: 'Consiento informar un pedido sobre vida sexual para evaluación. Solo por WhatsApp.',
    reqPh: 'Detalles o deseos', reqNote: 'Evaluado en la sesión. Si es inviable, no se cobra.',
    pay: '¿Cómo pagarás el resto?', pix: 'Pix (-3%)', card: 'Tarjeta', cash: 'Efectivo', cardNote: 'Tasas de tarjeta acordadas antes.',
    optIn: 'Quiero recibir recordatorios por WhatsApp.',
    ageA: 'Tengo 18+ y leí la', privacy: 'Privacidad', terms: 'Términos', and: 'y', refund: 'Cancelación',
    sigA: 'Para confirmar, envía señal de', sigB: 'por Pix. El resto después.', copyPix: 'Copiar clave Pix', pixCopied: 'Copiada',
    send: 'Enviar por WhatsApp', needPay: 'Elige pago', needAge: 'Confirma 18+',
    doneH: '¡Listo!', doneP: 'Solicitud preparada. Se confirma por WhatsApp.',
    doneSig: 'Envía el comprobante en el chat.', resend: 'Reenviar', addCal: 'Añadir al calendario', restart: 'Reiniciar',
    chatQ: '¿Preguntas?', chatBtn: 'Hablar por WhatsApp', chatMsg: '¡Hola Thalyson! Tengo una duda.',
    aboutH: 'Thalyson Massagens', aboutR: 'Terapeuta', about1: 'Enfocado en aliviar el peso de tu rutina.',
    about2: 'Atiendo en una suite en el Centro de SP.', seeProfile: 'Ver perfil',
    faqH: 'Dudas', q1: '¿Cómo funciona la señal?', a1: 'Pagas R$ 40 por Pix para asegurar la hora.',
    q2: '¿Cancelación?', a2: 'Hasta 12h antes recibes la señal de vuelta.', q3: '¿Qué datos doy?', a3: 'Solo nombre, día, hora.',
    q4: '¿Tarjeta?', a4: 'Sí: Pix, tarjeta o efectivo.',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Reembolso', footCookies: 'Cookies', adults: 'Solo para 18+.',
    close: 'Cerrar', theme: 'Tema', lang: 'Idioma', srLight: 'Tema claro', srDark: 'Tema oscuro', legalNote: 'Documentos vinculantes en portugués.',
    profile: 'Perfil', openProfile: 'Abrir perfil', gm: 'Buenos días', ga: 'Buenas tardes', gn: 'Buenas noches',
    pBul1: 'Charla inicial para límites', pBul2: 'Sin prisa, horario reservado', pBul3: 'Ambiente privado',
    pHours: 'Horario', pHoursV: 'Todos los días, {a} a {b}', pPay: 'Pago', pPayV: 'Pix, tarjeta, efectivo',
    pWhere: 'Dónde', pWhereV: 'En mi espacio o el tuyo', pCancel: 'Cancelación', pCancelV: 'Gratis hasta 12h antes',
    pForget: 'Borrar mis datos', forgot: 'Datos borrados'
  },
};

type PkgText = { title: string; desc: string; tags: string[]; flow: string[] };
const PACKAGES = [
  { id: 'classica', price: 180, min: 40, combo: 90, L: {
    pt: { title: 'Massagem Clássica', tags: ['Relaxamento', 'Sem toque íntimo'], desc: 'O essencial para quem está com o corpo cansado da rotina. Foco total em soltar a musculatura.', flow: ['Conversa rápida.', 'Massagem clássica manual.', 'Pistola relaxante.', 'Encerramento tranquilo.'] },
    en: { title: 'Classic Massage', tags: ['Relaxation', 'No intimate touch'], desc: 'The essential for a body worn out by routine. Focus on loosening muscles.', flow: ['Quick chat.', 'Manual classic massage.', 'Massage gun.', 'Calm finish.'] },
    es: { title: 'Masaje Clásico', tags: ['Relajación', 'Sin toque íntimo'], desc: 'Lo esencial para el cuerpo cansado. Foco en soltar la musculatura.', flow: ['Charla rápida.', 'Masaje clásico manual.', 'Pistola relajante.', 'Cierre tranquilo.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Tântrica', 'Finalização lingam'], desc: 'Começamos relaxando o corpo e os toques ficam mais leves quando você estiver à vontade.', flow: ['Combinado de limites.', 'Massagem clássica.', 'Toques tântricos.', 'Massagem lingam.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Tantric', 'Lingam finish'], desc: 'Start by relaxing the body, touches get lighter when you are at ease.', flow: ['Limits check.', 'Classic massage.', 'Tantric touches.', 'Lingam massage.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Tántrica', 'Final lingam'], desc: 'Relajamos el cuerpo y los toques se vuelven suaves cuando te sientas cómodo.', flow: ['Límites.', 'Masaje clásico.', 'Toques tántricos.', 'Masaje lingam.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, L: {
    pt: { title: 'Sensações com a Barba', tags: ['Tântrica', 'Naturista', 'Barba'], desc: 'Totalmente à vontade. Massagem clássica, proximidade e uso da barba no corpo.', flow: ['Naturista (à vontade).', 'Massagem clássica.', 'Uso da barba.', 'Massagem lingam.'] },
    en: { title: 'Beard Sensations', tags: ['Tantric', 'Naturist', 'Beard play'], desc: 'Fully comfortable. Classic massage, closeness, and beard play.', flow: ['Naturist.', 'Classic massage.', 'Beard play.', 'Lingam massage.'] },
    es: { title: 'Sensaciones con Barba', tags: ['Tántrica', 'Naturista', 'Barba'], desc: 'Totalmente cómodos. Masaje clásico, cercanía y uso de barba.', flow: ['Naturista.', 'Masaje clásico.', 'Uso de barba.', 'Masaje lingam.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, L: {
    pt: { title: 'Corpo a Corpo', tags: ['Tântrica', 'Naturista', 'Interação'], desc: 'O pacote sem barreiras. Proximidade física total e liberdade para interagir.', flow: ['Limites.', 'Massagem clássica.', 'Corpo a corpo com gel.', 'Interação livre.', 'Massagem lingam.'] },
    en: { title: 'Body to Body', tags: ['Tantric', 'Naturist', 'Interaction'], desc: 'The no-barriers package. Total closeness and freedom to interact.', flow: ['Limits.', 'Classic massage.', 'Body-to-body gel.', 'Free interaction.', 'Lingam massage.'] },
    es: { title: 'Cuerpo a Cuerpo', tags: ['Tántrica', 'Naturista', 'Interacción'], desc: 'Sin barreras. Cercanía total y libertad para interactuar.', flow: ['Límites.', 'Masaje clásico.', 'Cuerpo a cuerpo gel.', 'Interacción.', 'Masaje lingam.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, L: {
    pt: { title: 'Só Depilação', tags: ['Estética', 'Máquina'], desc: 'Aparo de pelos em até 3 lugares com máquina. Sem massagem.', flow: ['Conversa.', 'Aparo com máquina (pente 1 e 3).', 'Acabamento.'] },
    en: { title: 'Trimming Only', tags: ['Grooming', 'Machine'], desc: 'Body hair trimming in up to 3 areas. No massage.', flow: ['Chat.', 'Machine trim.', 'Finishing.'] },
    es: { title: 'Solo Depilación', tags: ['Estética', 'Máquina'], desc: 'Recorte de vello en hasta 3 zonas. Sin masaje.', flow: ['Charla.', 'Recorte a máquina.', 'Acabado.'] } } },
];
const MASSAGES = PACKAGES.filter((p) => p.combo > 0);
const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };

/* ==========================================================================
   ESTILO E UI PREMIUM (MENOS BORDAS, MAIS ESPAÇO)
   ========================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..400&family=Manrope:wght@400;500;600;700&display=swap');
.app{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#F2EFEB;--ink:#1C1A17;--mute:#746E65;--line:rgba(28,26,23,.08);--acc:#1C1A17;--onacc:#FFFFFF;--ok:#1E533F;--warn:#A86B22;--ring:rgba(28,26,23,.15)}
.app[data-theme=dark]{--bg:#141312;--surf:#1D1B1A;--surf2:#2A2725;--ink:#F2EFEB;--mute:#999187;--line:rgba(242,239,235,.08);--acc:#F2EFEB;--onacc:#141312;--ok:#50A684;--warn:#E6A15C;--ring:rgba(242,239,235,.2)}
.app{background:var(--bg);color:var(--ink);font-family:'Manrope',sans-serif;font-size:16px;line-height:1.6;min-height:100vh;overflow-x:clip;transition:background .4s,color .4s}
.serif{font-family:'Fraunces',serif;font-weight:300;}
.card{background:var(--surf);border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.03);border:1px solid var(--line)}
.app[data-theme=dark] .card{box-shadow:none}
.btn{min-height:56px;padding:0 28px;border-radius:999px;font-weight:600;font-size:16px;display:inline-flex;align-items:center;justify-content:center;gap:10px;cursor:pointer;transition:all .2s ease;border:1px solid transparent}
.btn:active{transform:scale(.97)}
.btn-p{background:var(--acc);color:var(--onacc);box-shadow:0 4px 12px var(--ring)}
.btn-p:disabled{background:var(--surf2);color:var(--mute);box-shadow:none;cursor:not-allowed}
.btn-g{background:var(--surf);border-color:var(--line);color:var(--ink)}
.btn-g:hover{background:var(--surf2)}
.chip{min-height:52px;border-radius:16px;background:var(--surf);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:all .3s ease;font-weight:500;}
.chip.on{background:var(--acc);color:var(--onacc);border-color:var(--acc);font-weight:600}
.chip.off{opacity:.4;text-decoration:line-through;pointer-events:none}
.opt{display:block;border-radius:20px;padding:20px;background:var(--surf);border:1px solid var(--line);cursor:pointer;transition:all .3s ease}
.opt.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc);background:var(--surf2)}
.inp{width:100%;min-height:56px;padding:0 20px;border-radius:16px;background:var(--surf);border:1px solid var(--line);color:var(--ink);font-size:16px;transition:border-color .2s}
.inp:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--ring)}
.lbl{display:block;font-size:14px;font-weight:600;color:var(--mute);margin-bottom:8px}
.err{font-size:13px;color:#D6455D;margin-top:6px}
.rv{opacity:0;transform:translateY(20px);transition:opacity .8s cubic-bezier(0.22, 1, 0.36, 1), transform .8s cubic-bezier(0.22, 1, 0.36, 1)}
.rv.in{opacity:1;transform:none}
.ttl{font-weight:300;line-height:1.1;letter-spacing:-0.03em}
.ttl .w{display:inline-block;overflow:hidden;padding-bottom:0.2em;margin-bottom:-0.2em;vertical-align:top;}
.ttl .w>span{display:inline-block;transform:translateY(110%);opacity:0;transition:transform .9s cubic-bezier(0.22, 1, 0.36, 1), opacity .7s ease}
.ttl.in .w>span{transform:none;opacity:1}
.glow{position:absolute;top:-10%;right:-20%;width:80vw;max-width:600px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle, var(--ring) 0%, transparent 60%);pointer-events:none;}
.step-dot{width:28px;height:28px;border-radius:50%;background:var(--surf2);color:var(--mute);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;transition:all .3s}
.step-dot.ok{background:var(--acc);color:var(--onacc)}
.bar{position:fixed;bottom:0;left:0;right:0;z-index:40;background:color-mix(in srgb,var(--surf) 90%,transparent);backdrop-filter:blur(12px);border-top:1px solid var(--line);padding:16px;padding-bottom:calc(16px + env(safe-area-inset-bottom));}
.hide-sb::-webkit-scrollbar{display:none}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--acc) 40%,transparent)}100%{box-shadow:0 0 0 12px transparent}}
`;

/* ==========================================================================
   ÍCONES MINIMALISTAS
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
  close: 'M18 6L6 18 M6 6l12 12',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICONS[name]} /></svg>
));

function Avatar({ className }: { className: string }) {
  return <img src={C.AVATAR} alt="Thalyson" onError={(e) => (e.currentTarget.style.display = 'none')} className={`${className} object-cover bg-[var(--surf2)]`} />;
}

/* ==========================================================================
   UTILITÁRIOS E COMPONENTES
   ========================================================================== */
function useSeen<E extends HTMLElement>() {
  const ref = useRef<E>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, seen };
}
function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, seen } = useSeen<HTMLDivElement>();
  return <div ref={ref} className={`rv ${seen ? 'in' : ''} ${className}`} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}
function Title({ children, as = 'h2', className = '' }: { children: string; as?: 'h1' | 'h2'; className?: string }) {
  const { ref, seen } = useSeen<HTMLHeadingElement>();
  const Tag = as;
  return (
    <Tag ref={ref} className={`ttl serif ${seen ? 'in' : ''} ${className}`}>
      {children.split(' ').map((w, i) => (<span key={i} className="w"><span style={{ transitionDelay: `${i * 60}ms` }}>{w}&nbsp;</span></span>))}
    </Tag>
  );
}
const Row = ({ label, value, strong }: { label: string; value: ReactNode; strong?: boolean }) => (
  <div className="flex justify-between gap-4 text-[15px]" style={strong ? { color: 'var(--ok)', fontWeight: 600 } : undefined}>
    <span style={{ color: strong ? 'inherit' : 'var(--mute)' }}>{label}</span>
    <span className="font-medium text-right">{value}</span>
  </div>
);

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number = 15) => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch(e) { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch(e) {} } };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;

function buildSlots(date: Date, dur: number, isHome: boolean, now: Date) {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  return out;
}

/* ==========================================================================
   APP PRINCIPAL
   ========================================================================== */
interface Booking {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addTime: boolean
