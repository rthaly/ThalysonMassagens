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
  AVATAR: '/thalyson.jpg', // coloque o arquivo em public/
  COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  SIGNAL: 40,
  FIRST: 15,
  REQ_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISC: 0.03,
  TIME_ADD: 75, // +30 min
  APARO_FULL: 130,
  PACK_PAY: 4,
  PACK_TOTAL: 5,
  PACK_DAYS: 30, // Alterado para 30 dias conforme solicitado
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
    t1: 'Sinal de só R$ 40, o resto depois da sessão', t2: 'Cancelamento grátis até 12h antes', t3: '1ª sessão com R$ 15 off, automático',
    offH: 'Mais vantagem para você', offS: 'Combo com depilação e pacote fidelidade, com a economia sempre à vista.',
    cbT: 'Massagem + depilação', cbD: 'Economize até R$ 70 no mesmo atendimento.', lyT: 'Leve 5, pague 4', lyD: 'A 5ª sessão é grátis. Você agenda a 1ª agora.', see: 'Ver opção',
    s1: 'Escolha a sessão', s2: 'Como quer levar?', s3: 'Quando e onde', s4: 'Resumo e pagamento', min: 'min', flowH: 'Como será a sessão',
    oSingle: 'Sessão avulsa', oSingleD: 'Uma sessão, sem compromisso.', oCombo: 'Com depilação', oComboD: 'Inclui aparo de pelos em até 3 lugares.', oPack: 'Pacote 5 sessões', oPackD: 'Pague 4 e a 5ª é grátis. Validade de {n} dias.',
    save: 'Economize', was: 'De',
    packNote: 'Cupom e desconto de 1ª sessão não acumulam com o pacote, que já é o melhor preço. Você agenda esta 1ª sessão agora e as outras 4 depois, pelo WhatsApp.',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).', place: 'Local da sessão', studio: 'No meu espaço', home: 'Vou até você',
    peakNote: 'Horários de pico no seu endereço têm taxa de R$ 18. Pedimos mais antecedência para o deslocamento. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú). O endereço exato é enviado junto com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua ou Avenida', number: 'Nº', comp: 'Complemento', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    demo: 'Disponibilidade demonstrativa: a reserva só vale após a resposta no WhatsApp.', dateErr: 'Escolha uma data.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'indisponível',
    cont: 'Continuar para o resumo', fill: 'Complete os campos destacados', change: 'Alterar', sPack: 'Sessão', sWhen: 'Quando', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)',
    lPack: 'Sessão', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Depilação (preço de combo)', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Presente de 1ª sessão', lCoupon: 'Cupom', lPeak: 'Deslocamento / pico', lPix: 'Desconto Pix (3%)',
    saved: 'Você economiza', total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    extras: 'Extras e cupom (opcional)', couponQ: 'Possui cupom?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido ou expirado.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp, não é salvo neste aparelho e posso retirar o consentimento quando quiser.',
    reqPh: 'Algum detalhe ou vontade para a sessão', reqNote: 'Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.',
    pay: 'Como vai pagar o restante?', pix: 'Pix (-3%)', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'Taxas do cartão são combinadas pelo WhatsApp antes do pagamento.',
    optIn: 'Quero receber lembretes e novidades pelo WhatsApp (opcional).',
    ageA: 'Declaro ter 18 anos ou mais e li a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e a', refund: 'Política de Cancelamento',
    sigA: 'Para confirmar o horário, envie um sinal de', sigB: 'via Pix. O restante é acertado após a sessão.', copyPix: 'Copiar chave Pix (CNPJ)', pixCopied: 'Chave Pix (CNPJ) copiada',
    send: 'Enviar pelo WhatsApp', needPay: 'Escolha a forma de pagamento', needAge: 'Confirme que você tem 18 anos ou mais',
    doneH: 'Tudo pronto!', doneP: 'Sua solicitação foi preparada. O horário só está confirmado depois da resposta pelo WhatsApp. Se o WhatsApp não abriu, use o botão abaixo.',
    doneSig: 'Envie o comprovante do sinal na conversa para confirmar.', resend: 'Reenviar mensagem', addCal: 'Adicionar à agenda', restart: 'Voltar ao início',
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
    save: 'Save', was: 'Was',
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
    extras: 'Extras and coupon (optional)', couponQ: 'Have a coupon?', couponPh: 'Code', apply: 'Apply', couponOk: 'Coupon applied', couponBad: 'Invalid or expired coupon.',
    reqQ: 'Specific request (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describing a request that may relate to sex life (sensitive data), only so it can be evaluated. It goes only via WhatsApp, is not saved on this device, and I can withdraw consent any time.',
    reqPh: 'Any detail or wish for the session', reqNote: 'Request evaluated at the time of the session. If not feasible, it is not charged.',
    pay: 'How will you pay the remainder?', pix: 'Pix (-3%)', card: 'Card up to 12x', cash: 'Cash', cardNote: 'Card fees are agreed on WhatsApp before payment.',
    optIn: 'I want reminders and news via WhatsApp (optional).',
    ageA: 'I declare I am 18 or older and have read the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and the', refund: 'Cancellation Policy',
    sigA: 'To confirm the time, send a deposit of', sigB: 'via Pix. The rest is settled after the session.', copyPix: 'Copy Pix key (CNPJ)', pixCopied: 'Pix key (CNPJ) copied',
    send: 'Send on WhatsApp', needPay: 'Choose a payment method', needAge: 'Confirm you are 18 or older',
    doneH: 'All set!', doneP: 'Your request is ready. The time is only confirmed after the reply on WhatsApp. If WhatsApp did not open, use the button below.',
    doneSig: 'Send the deposit receipt in the chat to confirm.', resend: 'Resend message', addCal: 'Add to calendar', restart: 'Back to start',
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
    save: 'Ahorra', was: 'Antes',
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
    extras: 'Extras y cupón (opcional)', couponQ: '¿Tienes un cupón?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupón activado', couponBad: 'Cupón inválido o vencido.',
    reqQ: 'Pedido específico (+ R$ 140)', learn: 'Más información',
    reqConsent: 'Consiento informar un pedido que puede tratar sobre vida sexual (dato sensible), solo para que sea evaluado. Va solo por WhatsApp, no se guarda en este dispositivo y puedo retirar el consentimiento cuando quiera.',
    reqPh: 'Algún detalle o deseo para la sesión', reqNote: 'Pedido evaluado en el momento de la atención. Si es inviable, no se cobra.',
    pay: '¿Cómo pagarás el resto?', pix: 'Pix (-3%)', card: 'Tarjeta hasta 12x', cash: 'Efectivo', cardNote: 'Las tasas de tarjeta se acuerdan por WhatsApp antes del pago.',
    optIn: 'Quiero recibir recordatorios y novedades por WhatsApp (opcional).',
    ageA: 'Declaro tener 18 años o más y haber leído la', privacy: 'Política de Privacidad', terms: 'Términos', and: 'y la', refund: 'Política de Cancelación',
    sigA: 'Para confirmar el horario, envía una señal de', sigB: 'por Pix. El resto se paga después de la sesión.', copyPix: 'Copiar clave Pix (CNPJ)', pixCopied: 'Clave Pix (CNPJ) copiada',
    send: 'Enviar por WhatsApp', needPay: 'Elige la forma de pago', needAge: 'Confirma que tienes 18 años o más',
    doneH: '¡Todo listo!', doneP: 'Tu solicitud está preparada. El horario solo se confirma tras la respuesta por WhatsApp. Si no se abrió, usa el botón de abajo.',
    doneSig: 'Envía el comprobante de la señal en el chat para confirmar.', resend: 'Reenviar mensaje', addCal: 'Añadir al calendario', restart: 'Volver al inicio',
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
  },
};

type PkgText = { title: string; desc: string; tags: string[]; flow: string[] };
const PACKAGES: { id: string; price: number; min: number; combo: number; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, combo: 90, L: {
    pt: { title: 'Massagem Clássica', tags: ['Relaxamento completo', 'Pistola relaxante', 'Sem toque íntimo'], desc: 'O essencial para quem está com o corpo cansado da rotina. Uso a força das minhas mãos para trabalhar a tensão e soltar sua musculatura, com foco no relaxamento.',
      flow: ['Conversa rápida para alinhar seus pontos de tensão e limites.', 'Massagem clássica com as mãos, trabalhando a tensão da musculatura.', 'Pistola relaxante nos pontos mais tensos.', 'Encerramento tranquilo, sem toque íntimo.'] },
    en: { title: 'Classic Massage', tags: ['Full relaxation', 'Massage gun', 'No intimate touch'], desc: 'The essential for a body worn out by routine. I use the strength of my hands to work out tension and loosen your muscles, focused on relaxation.',
      flow: ['Quick chat to align your tension points and limits.', 'Classic massage with the hands, working out muscle tension.', 'Massage gun on the tightest spots.', 'Calm finish, no intimate touch.'] },
    es: { title: 'Masaje Clásico', tags: ['Relajación completa', 'Pistola relajante', 'Sin toque íntimo'], desc: 'Lo esencial para un cuerpo cansado de la rutina. Uso la fuerza de mis manos para trabajar la tensión y soltar tu musculatura, con foco en la relajación.',
      flow: ['Charla rápida para alinear tus puntos de tensión y límites.', 'Masaje clásico con las manos, trabajando la tensión muscular.', 'Pistola relajante en los puntos más tensos.', 'Cierre tranquilo, sin toque íntimo.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Tântrica', 'Pistola relaxante', 'Finalização lingam'], desc: 'Começamos com a massagem clássica para relaxar o corpo. Quando você estiver à vontade, os toques mudam, ficam mais leves e encerramos com a massagem lingam.',
      flow: ['Conversa rápida e combinado de limites.', 'Massagem clássica para relaxar o corpo.', 'Quando você estiver à vontade, os toques ficam mais leves (tântrica).', 'Encerramento com massagem lingam.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Tantric', 'Massage gun', 'Lingam finish'], desc: 'We start with the classic massage to relax the body. When you feel at ease, the touch changes and becomes lighter, and we close with lingam massage.',
      flow: ['Quick chat and agreement on limits.', 'Classic massage to relax the body.', 'When you feel at ease, the touch becomes lighter (tantric).', 'Closing with lingam massage.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Tántrica', 'Pistola relajante', 'Final lingam'], desc: 'Empezamos con el masaje clásico para relajar el cuerpo. Cuando te sientas cómodo, los toques cambian y se vuelven más suaves, y cerramos con masaje lingam.',
      flow: ['Charla rápida y acuerdo de límites.', 'Masaje clásico para relajar el cuerpo.', 'Cuando te sientas cómodo, los toques se vuelven más suaves (tántrica).', 'Cierre con masaje lingam.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, L: {
    pt: { title: 'Sensações com a Barba', tags: ['Tântrica', 'Naturista', 'Pistola relaxante', 'Uso de barba'], desc: 'Ficamos totalmente à vontade. Primeiro a massagem clássica, depois uso minha barba em algumas partes do seu corpo e encerramos com a massagem lingam.',
      flow: ['Conversa rápida e combinado de limites; ficamos totalmente à vontade (naturista).', 'Massagem clássica para relaxar.', 'Uso da barba em algumas partes do seu corpo.', 'Encerramento com massagem lingam.'] },
    en: { title: 'Beard Sensations', tags: ['Tantric', 'Naturist', 'Massage gun', 'Beard play'], desc: 'We get fully comfortable. First the classic massage, then I use my beard on some parts of your body, and we close with lingam massage.',
      flow: ['Quick chat and agreement on limits; we get fully comfortable (naturist).', 'Classic massage to relax.', 'Beard used on some parts of your body.', 'Closing with lingam massage.'] },
    es: { title: 'Sensaciones con la Barba', tags: ['Tántrica', 'Naturista', 'Pistola relajante', 'Uso de barba'], desc: 'Nos ponemos totalmente cómodos. Primero el masaje clásico, luego uso mi barba en algunas partes de tu cuerpo y cerramos con masaje lingam.',
      flow: ['Charla rápida y acuerdo de límites; nos ponemos totalmente cómodos (naturista).', 'Masaje clásico para relajar.', 'Uso de la barba en algunas partes de tu cuerpo.', 'Cierre con masaje lingam.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, L: {
    pt: { title: 'Corpo a Corpo & Interação', tags: ['Tântrica', 'Pistola relaxante', 'Naturista', 'Interação', 'Você faz massagem'], desc: 'O pacote sem barreiras. Primeiro a massagem clássica, depois proximidade física com gel corpo a corpo e liberdade para você fazer massagem em mim, e encerramos com a massagem lingam.',
      flow: ['Conversa rápida e combinado de limites.', 'Massagem clássica para relaxar.', 'Proximidade física com gel, corpo a corpo.', 'Você tem liberdade para fazer massagem em mim.', 'Encerramento com massagem lingam.'] },
    en: { title: 'Body to Body & Interaction', tags: ['Tantric', 'Massage gun', 'Naturist', 'Interaction', 'You massage me'], desc: 'The no-barriers package. First the classic massage, then physical closeness with body-to-body gel and the freedom for you to massage me, and we close with lingam massage.',
      flow: ['Quick chat and agreement on limits.', 'Classic massage to relax.', 'Physical closeness with body-to-body gel.', 'You are free to massage me.', 'Closing with lingam massage.'] },
    es: { title: 'Cuerpo a Cuerpo & Interacción', tags: ['Tántrica', 'Pistola relajante', 'Naturista', 'Interacción', 'Tú me masajeas'], desc: 'El paquete sin barreras. Primero el masaje clásico, luego cercanía física con gel cuerpo a cuerpo y libertad para que me hagas masaje, y cerramos con masaje lingam.',
      flow: ['Charla rápida y acuerdo de límites.', 'Masaje clásico para relajar.', 'Cercanía física con gel, cuerpo a cuerpo.', 'Tienes libertad para hacerme masaje.', 'Cierre con masaje lingam.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, L: {
    pt: { title: 'Apenas Depilação (Máquina)', tags: ['Estética', 'Sem massagem'], desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares), pente 1 e 3, utilizando máquina.',
      flow: ['Conversa rápida sobre o resultado que você quer.', 'Aparo de pelos em até 3 lugares, com máquina (pente 1 e 3).', 'Acabamento e finalização.'] },
    en: { title: 'Trimming Only (Machine)', tags: ['Grooming', 'No massage'], desc: 'Standalone service for grooming only. Body hair trimming (up to 3 areas), guards 1 and 3, using a machine.',
      flow: ['Quick chat about the result you want.', 'Hair trimming in up to 3 areas, with a machine (guards 1 and 3).', 'Finishing touches.'] },
    es: { title: 'Solo Depilación (Máquina)', tags: ['Estética', 'Sin masaje'], desc: 'Servicio aislado para quien busca solo estética. Recorte de vello (hasta 3 zonas), peine 1 y 3, con máquina.',
      flow: ['Charla rápida sobre el resultado que quieres.', 'Recorte de vello en hasta 3 zonas, con máquina (peine 1 y 3).', 'Acabado final.'] } } },
];
const MASSAGES = PACKAGES.filter((p) => p.combo > 0);
const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };

/* ==========================================================================
   DOCUMENTOS LEGAIS (versão vinculante em português)
   ========================================================================== */
const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="font-semibold mt-5 mb-2" style={{ color: 'var(--ink)' }}>{children}</h3>;
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

/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */
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
  close: 'M18 6L6 18 M6 6l12 12',
  plus: 'M12 5v14 M5 12h14',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICONS[name]} /></svg>
));

function Avatar({ className, alt }: { className: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} serif inline-flex items-center justify-center`} style={{ background: 'var(--acc)', color: 'var(--onacc)' }}>T</span>;
  return <img src={C.AVATAR} alt={alt} onError={() => setFailed(true)} className={`${className} object-cover`} />;
}

/* Aparece ao entrar na tela (fluxo vertical descendo) */
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
/* Título que sobe palavra por palavra, suavemente */
function Title({ children, as = 'h2', className = '', style, id }: { children: string; as?: 'h1' | 'h2'; className?: string; style?: React.CSSProperties; id?: string }) {
  const { ref, seen } = useSeen<HTMLHeadingElement>();
  const Tag = as;
  return (
    <Tag ref={ref} id={id} className={`ttl serif ${seen ? 'in' : ''} ${className}`} style={style}>
      {children.split(' ').map((w, i) => (<span key={i} className="w"><span style={{ transitionDelay: `${i * 60}ms` }}>{w}&nbsp;</span></span>))}
    </Tag>
  );
}

const Row = ({ label, value, tone }: { label: string; value: ReactNode; tone?: 'ok' }) => (
  <div className="flex justify-between gap-4 text-[15.5px]" style={tone ? { color: 'var(--ok)', fontWeight: 700 } : undefined}><span style={tone ? undefined : { color: 'var(--mute)' }}>{label}</span><span className="font-semibold text-right">{value}</span></div>
);

/* ==========================================================================
   ESTILO ORIGINAL PERFEITO (MAS COM CORES PREMIUM E SEM BORDAS PESADAS)
   ========================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@400..800&display=swap');
.app{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#F2EFEB;--ink:#1C1A17;--mute:#746E65;--line:rgba(28,26,23,.08);--acc:#1C1A17;--onacc:#FFFFFF;--ring:rgba(28,26,23,.15);--ok:#1E533F;--warn:#A86B22}
.app[data-theme=dark]{--bg:#141312;--surf:#1D1B1A;--surf2:#2A2725;--ink:#F2EFEB;--mute:#999187;--line:rgba(242,239,235,.08);--acc:#F2EFEB;--onacc:#141312;--ring:rgba(242,239,235,.2);--ok:#50A684;--warn:#E6A15C}
.app{background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,sans-serif;font-size:17px;line-height:1.55;min-height:100vh;overflow-x:clip;transition:background .3s,color .3s}
.app .text-sm{font-size:15.5px}.app .text-xs{font-size:13.5px}
.serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
.card{background:var(--surf);border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.03);border:1px solid var(--line)}
.app[data-theme=dark] .card{box-shadow:none}
.btn{min-height:56px;padding:0 26px;border-radius:999px;font-weight:700;font-size:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:transform .15s,opacity .2s,background .2s}
.btn:active{transform:scale(.98)}
.btn-p{background:var(--acc);color:var(--onacc);box-shadow:0 4px 12px var(--ring)}
.btn-p:disabled{background:var(--surf2);color:var(--mute);cursor:not-allowed;box-shadow:none}
.btn-g{border:1px solid var(--line);color:var(--ink);background:transparent}
.btn-g:hover{background:var(--surf2)}
.link{text-decoration:underline;text-underline-offset:4px;color:var(--ink);font-weight:600;min-height:28px}
.chip{min-height:54px;border:1px solid var(--line);border-radius:18px;background:var(--surf);display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:all .2s;position:relative;font-weight:600}
.chip.on{background:var(--acc);color:var(--onacc);border-color:var(--acc);font-weight:700}
.chip.off{opacity:.36;text-decoration:line-through;cursor:not-allowed}
.opt{display:block;border-radius:22px;padding:20px;background:var(--surf);cursor:pointer;transition:all .2s;border:1px solid var(--line)}
.opt.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc);background:var(--surf2)}
.opt:has(input:focus-visible),.chip:has(input:focus-visible),.btn:focus-visible,button:focus-visible,a:focus-visible,summary:focus-visible,input[type=checkbox]:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.inp{width:100%;min-height:56px;padding:0 18px;border-radius:16px;background:var(--surf);border:1px solid var(--line);color:var(--ink);font-size:17px;transition:all .2s}
.inp::placeholder{color:var(--mute)}
.inp:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--ring)}
.inp:disabled{opacity:.5}
.lbl{display:block;font-size:14.5px;font-weight:700;color:var(--mute);margin-bottom:10px}
.err{font-size:14px;color:#D6455D;margin-top:8px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;background:var(--surf)}
.seg button{min-height:34px;min-width:38px;padding:0 8px;border-radius:999px;font-size:12.5px;font-weight:800;color:var(--mute)}
.seg button[aria-pressed=true]{background:var(--ink);color:var(--bg)}
.glow{position:absolute;top:-6%;right:-30%;width:min(95vw,640px);aspect-ratio:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--acc) 15%,transparent),transparent 66%);animation:drift 14s ease-in-out infinite}
.dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 var(--ok);animation:pulse 2.6s ease-out infinite}
.stepn{width:34px;height:34px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;border:1.5px solid var(--line);color:var(--mute);transition:all .3s}
.stepn.ok{background:var(--acc);color:var(--onacc);border-color:var(--acc)}
.core{position:absolute;inset:0;margin:auto;width:96px;height:96px;border-radius:50%;overflow:hidden;animation:breathe 6s ease-in-out infinite}
.ring{position:absolute;inset:0;border-radius:50%;border:1.5px solid var(--acc);opacity:0;animation:ring 3.6s ease-out infinite}
.rise{animation:rise .9s cubic-bezier(.2,.7,.2,1) both}
.loadbar{transform-origin:left;animation:bar 2.4s cubic-bezier(.5,0,.2,1) both}
.rv{opacity:0;transform:translateY(26px);transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.rv.in{opacity:1;transform:none}
.ttl{font-weight:300;line-height:1.04;letter-spacing:-0.02em}
.ttl .w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}
.ttl .w>span{display:inline-block;transform:translateY(108%);opacity:0;transition:transform 1s cubic-bezier(.2,.7,.2,1),opacity .8s ease}
.ttl.in .w>span{transform:none;opacity:1}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
details.faq summary{min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;font-weight:700;list-style:none}
details.faq summary::-webkit-details-marker{display:none}
details.faq summary::after{content:'+';font-size:24px;color:var(--acc);transition:transform .2s}
details.faq[open] summary::after{transform:rotate(45deg)}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{scrollbar-width:none}
@keyframes breathe{0%,100%{transform:scale(.96)}50%{transform:scale(1.04)}}
@keyframes ring{0%{transform:scale(.55);opacity:.6}100%{transform:scale(1.7);opacity:0}}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes bar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes drift{0%,100%{transform:translate(0,0)}50%{transform:translate(-4%,5%)}}
@keyframes pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--ok) 55%,transparent)}100%{box-shadow:0 0 0 12px transparent}}
@media (prefers-reduced-motion:reduce){.glow,.dot,.core,.ring,.rise,.loadbar{animation:none!important}.rv,.ttl .w>span{opacity:1!important;transform:none!important;transition:none!important}*{scroll-behavior:auto!important}}
`;

/* ==========================================================================
   MODAL ACESSÍVEL
   ========================================================================== */
function Modal({ title, onClose, closeLabel, children }: { title: string; onClose: () => void; closeLabel: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
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
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(8,6,12,.72)' }} onClick={() => closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg max-h-[90vh] flex flex-col rise" style={{ borderRadius: '28px 28px 0 0' }}>
        <div className="flex justify-between items-center gap-4 p-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 id="modal-title" className="serif text-xl">{title}</h2>
          <button type="button" onClick={() => closeRef.current()} aria-label={closeLabel} className="btn btn-g" style={{ minHeight: 46, minWidth: 46, padding: '0 14px', borderRadius: '50%', border: 'none' }}><Icon name="close" size={18} /></button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const StepHead = ({ n, title, done }: { n: number; title: string; done: boolean }) => (
  <div className="flex items-center gap-4 mb-6">
    <span className={`stepn ${done ? 'ok' : ''}`}>{done ? <Icon name="check" size={16} /> : n}</span>
    <Title as="h2" className="text-[28px] md:text-[34px]">{title}</Title>
  </div>
);

/* ==========================================================================
   APP
   ========================================================================== */
interface Booking {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addTime: boolean;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const s = store.get('thaly_lang');
    return s === 'en' || s === 'es' ? s : 'pt';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const s = store.get('thaly_theme');
    if (s === 'dark' || s === 'light') return s;
    try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  });
  const t = (k: string) => T[lang][k] ?? T.pt[k] ?? k;

  const [phase, setPhase] = useState<Phase>('loading');
  const [profileOpen, setProfileOpen] = useState(false);
  const [offer, setOffer] = useState<Offer>('single');
  const [reviewed, setReviewed] = useState(false);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [isReturning, setIsReturning] = useState(() => store.get('thaly_returning_final') === 'yes');
  const [touched, setTouched] = useState(false);
  const [toast, setToast] = useState('');
  const [doc, setDoc] = useState<DocId | null>(null);
  const [now, setNow] = useState(() => new Date());
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

  const bookRef = useRef<HTMLDivElement>(null);
  const s2Ref = useRef<HTMLDivElement>(null);
  const s3Ref = useRef<HTMLDivElement>(null);
  const s4Ref = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };
  const scrollToRef = (r: React.RefObject<HTMLDivElement>, ms = 140) => setTimeout(() => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), ms);
  const goBook = () => scrollToRef(bookRef, 30);

  /* carregamento -> boas-vindas (ou direto ao site para quem já entrou) */
  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    const id = setTimeout(() => {
      if (store.get('thaly_onboard_final') === 'yes') { setAgeOk(true); setPhase('site'); } else setPhase('welcome');
    }, reduce ? 800 : 2600);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => { if (phase !== 'loading') window.scrollTo({ top: 0 }); }, [phase]);
  useEffect(() => { store.set('thaly_lang', lang); document.documentElement.lang = LOCALE[lang]; }, [lang]);
  useEffect(() => { document.title = SITE_NAME; }, []);
  useEffect(() => { store.set('thaly_theme', theme); }, [theme]);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
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
    return { sessionPrice, aparoAdd, timeAdd, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, comboSave, packSave, saved: comboSave + packSave + discount + pixDiscount };
  }, [data, pkg, isHome, isPack, aparoOn, isReturning, coupon.applied, coupon.value, hasReq]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; i < C.DAYS; i++) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); out.push({ d, i }); }
    return out;
  }, []);
  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.dur, isHome, now) : []), [data.date, invoice.dur, isHome, now]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  useEffect(() => { if (data.time && !slots.some((s) => s.t === data.time && s.ok)) set({ time: '' }); }, [slots, data.time]);

  const nextFree = useMemo(() => {
    for (let k = 0; k < 4; k++) {
      const d = new Date(now); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + k);
      const s = buildSlots(d, pkg.min, false, now).find((x) => x.ok);
      if (s) return { d, t: s.t, k };
    }
    return null;
  }, [now, pkg.min]);

  const errors = {
    name: data.name.trim().length < 3 ? t('nameErr') : '',
    date: !data.date ? t('dateErr') : '',
    time: data.date && !data.time ? t('timeErr') : '',
    address: isHome && !(data.street && data.number && data.bairro) ? t('addrErr') : '',
  };
  const step3Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const v = C.COUPONS[code] || 0;
    if (v > 0) { vibrate([20, 40]); setCoupon({ input: '', applied: code, value: v, error: '' }); showToast(t('couponOk')); }
    else { vibrate(50); setCoupon((c) => ({ ...c, error: t('couponBad') })); }
  };
  const copyPix = async () => { const ok = await copyText(C.PIX_KEY); showToast(ok ? t('pixCopied') : `Pix: ${C.PIX_KEY}`); };

  const handleCep = async (val: string) => {
    const masked = maskCEP(val);
    set({ cep: masked });
    if (masked.length === 9) {
      try {
        const j = await (await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`)).json();
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast(t('cepFail'));
      } catch (e) { showToast(t('cepFail')); }
    }
  };

  const pickPkg = (id: string) => {
    vibrate(15);
    set({ packageId: id });
    if (id === 'aparo_solo') setOffer('single');
    scrollToRef(id === 'aparo_solo' ? s3Ref : s2Ref, 200);
  };
  const pickOffer = (o: Offer) => { vibrate(20); setOffer(o); goBook(); };

  /* Mensagem do WhatsApp: sempre em português (idioma do terapeuta) */
  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) loc = '📍 *Local:* Atendimento no meu espaço, região da Bela Vista/Centro Histórico. O endereço exato será enviado após a confirmação.';
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

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, mm: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(mm).replace(':', '')}00`;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const s = toMin(data.time);
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Thalyson//Agenda//PT', 'BEGIN:VEVENT', `UID:${Date.now()}@thalyson`, `DTSTAMP:${stamp}`,
      `DTSTART:${f(data.date, s)}`, `DTEND:${f(data.date, s + invoice.dur)}`, `SUMMARY:${pkg.L.pt.title} - Thalyson`,
      `DESCRIPTION:Sinal de ${money(invoice.sinal)} via Pix para confirmar.`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a'); a.href = url; a.download = 'sessao.ics';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    if (hp) { setDone(true); setSentLink('#'); return; } // honeypot anti-robô
    const link = whatsappLink();
    store.set('thaly_returning_final', 'yes');
    setSentLink(link); vibrate([30, 50]);
    const w = window.open(link, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = link;
    setDone(true);
    scrollToRef(bookRef, 60);
  };

  const resetBooking = () => {
    setTouched(false); setReqOk(false); setDone(false); setReviewed(false); setOffer('single');
    setData((p) => ({ ...p, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: '', addTime: false }));
  };
  const restart = () => { vibrate(15); resetBooking(); goBook(); };

  const forgetMe = () => {
    ['thaly_returning_final', 'thaly_onboard_final', 'thaly_cid'].forEach((k) => store.del(k));
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

  /* ---------------------------- CARREGAMENTO ---------------------------- */
  if (phase === 'loading') {
    return (
      <div className="app flex flex-col items-center justify-center px-6 text-center" data-theme={theme} role="status" aria-live="polite" aria-busy="true">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="relative" style={{ width: 176, height: 176 }}>
          <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} /><span className="ring" style={{ animationDelay: '2.4s' }} />
          <div className="core"><Avatar className="w-full h-full rounded-full text-4xl" alt="" /></div>
        </div>
        <h1 className="serif font-light mt-10 rise" style={{ fontSize: 'clamp(30px,7vw,44px)', letterSpacing: '-0.01em', animationDelay: '.3s' }}>{SITE_NAME}</h1>
        <p className="mt-3 rise text-sm" style={{ color: 'var(--mute)', animationDelay: '.7s' }}>{t('loadMsg')}</p>
        <div className="mt-8 w-48 rounded-full overflow-hidden" style={{ height: 3, background: 'var(--line)' }}><div className="loadbar h-full" style={{ background: 'var(--acc)' }} /></div>
      </div>
    );
  }

  /* ---------------------------- SITE ---------------------------- */
  return (
    <div className="app" data-theme={theme} style={{ paddingBottom: showBar ? 96 : 24 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {toast && <div role="status" aria-live="polite" className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full text-sm font-semibold max-w-[90vw] text-center shadow-xl" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>{toast}</div>}

      <header className="sticky top-0 z-50" style={{ background: 'color-mix(in srgb,var(--bg) 88%,transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <button type="button" onClick={() => { vibrate(10); setProfileOpen(true); }} aria-label={t('openProfile')} aria-haspopup="dialog" className="flex items-center gap-3 min-w-0 rounded-xl py-1">
            <Avatar className="w-11 h-11 rounded-full" alt="" />
            <span className="serif hidden min-[430px]:inline whitespace-nowrap" style={{ fontSize: 17 }}>Relaxar hoje</span>
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="seg" role="group" aria-label={t('lang')}>
              {(['pt', 'en', 'es'] as Lang[]).map((l) => (<button key={l} type="button" aria-pressed={lang === l} onClick={() => { vibrate(10); setLang(l); }}>{l.toUpperCase()}</button>))}
            </div>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('srLight') : t('srDark')} title={t('theme')} className="btn btn-g" style={{ minHeight: 44, width: 44, padding: 0, borderRadius: '50%', border: 'none' }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </button>
          </div>
        </div>
      </header>

      <main id="main" className="max-w-3xl mx-auto px-5">
        {/* ========== BOAS-VINDAS ========== */}
        {phase === 'welcome' && (
          <section className="max-w-xl mx-auto min-h-[84vh] flex flex-col justify-center py-10" aria-labelledby="wt">
            <div className="relative mb-9 rise" style={{ width: 104, height: 104 }}>
              <span className="ring" /><span className="ring" style={{ animationDelay: '1.8s' }} />
              <div className="core" style={{ width: 104, height: 104 }}><Avatar className="w-full h-full rounded-full text-4xl" alt="Thalyson" /></div>
            </div>
            <p className="rise inline-flex items-center gap-2 text-sm font-semibold mb-4 self-start" style={{ color: 'var(--mute)', animationDelay: '.1s' }}><Icon name="map" size={16} /> {t('badge')}</p>
            <h1 id="wt" className="serif font-light leading-[1.02] mb-5 rise" style={{ fontSize: 'clamp(46px,12vw,78px)', letterSpacing: '-0.02em', animationDelay: '.2s' }}>Relaxar hoje<br />com Thalyson</h1>
            <p className="text-lg leading-relaxed mb-8 rise" style={{ color: 'var(--mute)', animationDelay: '.35s' }}>{t('wSub')}</p>
            <ul className="grid gap-3 mb-9 rise" style={{ animationDelay: '.5s' }}>
              {[['w1', 'clock'], ['w2', 'lock'], ['w3', 'shield']].map(([k, ic]) => (<li key={k} className="flex items-center gap-3 font-semibold"><Icon name={ic as IconName} size={20} />{t(k)}</li>))}
            </ul>
            <div className="rise mb-6" style={{ animationDelay: '.6s' }}>
              <div className="flex items-start gap-3 text-sm leading-relaxed">
                <input id="age-w" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                <p><label htmlFor="age-w" className="cursor-pointer">{t('ageA')} </label>
                  <button type="button" className="link" onClick={() => setDoc('privacy')}>{t('privacy')}</button>, <button type="button" className="link" onClick={() => setDoc('terms')}>{t('terms')}</button> {t('and')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.</p>
              </div>
            </div>
            <button type="button" onClick={enter} disabled={!ageOk} className="btn btn-p w-full rise" style={{ minHeight: 62, fontSize: 17, animationDelay: '.7s' }}>{ageOk ? t('enter') : t('needAgeEnter')}</button>
          </section>
        )}

        {phase === 'site' && (<>
          {/* ========== HERO ========== */}
          <section className="relative pt-14 pb-16 flex flex-col justify-center" style={{ minHeight: 'calc(100svh - 76px)' }}>
            <div className="glow" aria-hidden="true" />
            <div className="relative">
              <Reveal><p className="inline-flex items-center gap-2 text-sm font-semibold mb-6" style={{ color: 'var(--mute)' }}><Icon name="map" size={16} /> {t('badge')}</p></Reveal>
              <Title as="h1" className="mb-6" style={{ fontSize: 'clamp(50px,13vw,92px)' }}>{t('h1')}</Title>
              <Reveal delay={250}><p className="text-lg leading-relaxed mb-9 max-w-md" style={{ color: 'var(--mute)' }}>{t('sub')}</p></Reveal>
              <Reveal delay={380}>
                <div className="flex flex-wrap gap-3 mb-8">
                  <button type="button" onClick={goBook} className="btn btn-p" style={{ minHeight: 60, padding: '0 36px', fontSize: 17 }}>{t('cta')}</button>
                  <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 60 }}><Icon name="star" size={18} /> {t('reviews')}</a>
                </div>
              </Reveal>
              <Reveal delay={500}>
                <p className="flex items-center gap-3 text-sm" style={{ color: 'var(--mute)' }}>
                  {nextFree && (<><span className="dot" aria-hidden="true" /><span>{t('nextFree')}: <strong style={{ color: 'var(--ink)' }}>{nextLabel}</strong></span></>)}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--mute)' }}>{t('fromM')} {money(Math.min(...MASSAGES.map((p) => p.price)))}</p>
              </Reveal>
            </div>
          </section>

          {/* ========== CONFIANÇA ========== */}
          <Reveal className="mb-24">
            <ul className="grid sm:grid-cols-3 gap-5" aria-label="Garantias">
              {[['t1', 'lock'], ['t2', 'shield'], ['t3', 'star']].map(([k, ic]) => (
                <li key={k} className="flex items-start gap-3 text-[15.5px] leading-snug"><Icon name={ic as IconName} size={22} className="mt-0.5" />{t(k)}</li>
              ))}
            </ul>
          </Reveal>

          {/* ========== VANTAGENS ========== */}
          <section className="mb-28" aria-labelledby="off">
            <Title id="off" className="text-[34px] md:text-[44px] mb-3">{t('offH')}</Title>
            <Reveal delay={120}><p className="mb-8" style={{ color: 'var(--mute)' }}>{t('offS')}</p></Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {([['combo', 'cbT', 'cbD', 'plus'], ['pack', 'lyT', 'lyD', 'gift']] as [Offer, string, string, IconName][]).map(([o, a, b, ic], i) => (
                <Reveal key={o} delay={i * 120}>
                  <button type="button" onClick={() => pickOffer(o)} className="card p-6 text-left w-full h-full flex flex-col gap-3">
                    <Icon name={ic} size={28} />
                    <span className="serif text-[28px] leading-tight mt-2">{t(a)}</span>
                    <span className="text-[15.5px]" style={{ color: 'var(--mute)' }}>{t(b)}</span>
                    <span className="link mt-auto pt-2">{t('see')}</span>
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ========== AGENDAMENTO ========== */}
          <section ref={bookRef} className="scroll-mt-20 mb-28" aria-label={t('cta')}>
            {done ? (
              <Reveal>
                <div className="card p-8 text-center bg-[var(--surf2)] border-none">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)', color: 'var(--ok)' }}><Icon name="check" size={32} /></div>
                  <h2 className="serif text-4xl font-light mb-4">{t('doneH')}</h2>
                  <p className="leading-relaxed mb-4" style={{ color: 'var(--mute)' }}>{t('doneP')}</p>
                  <p className="font-bold mb-8" style={{ color: 'var(--acc)' }}>{t('doneSig')} ({money(invoice.sinal)})</p>
                  <div className="space-y-3 max-w-xs mx-auto">
                    <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-p w-full">{t('resend')}</a>
                    <button type="button" onClick={copyPix} className="btn btn-g w-full"><Icon name="copy" size={16} /> {t('copyPix')}</button>
                    <button type="button" onClick={downloadICS} className="btn btn-g w-full"><Icon name="cal" size={16} /> {t('addCal')}</button>
                    <button type="button" onClick={restart} className="w-full min-h-[48px] text-sm underline underline-offset-4" style={{ color: 'var(--mute)' }}>{t('restart')}</button>
                  </div>
                </div>
              </Reveal>
            ) : (
              <div className="space-y-24">
                {/* PASSO 1 */}
                <div>
                  <StepHead n={1} title={t('s1')} done={chosen} />
                  <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label={t('s1')}>
                    {PACKAGES.map((p, i) => {
                      const on = data.packageId === p.id;
                      const L = p.L[lang];
                      return (
                        <Reveal key={p.id} delay={(i % 2) * 80} className={on ? 'md:col-span-2' : ''}>
                          <div className={`opt ${on ? 'on' : ''}`} style={{ padding: 0 }}>
                            <label className="block cursor-pointer" style={{ padding: '18px 20px' }}>
                              <input type="radio" name="package" value={p.id} checked={on} onChange={() => pickPkg(p.id)} className="sr-only" />
                              <span className="flex justify-between items-baseline gap-4">
                                <span className="serif text-[22px] leading-tight">{L.title}</span>
                                <span className="serif text-[22px] shrink-0" style={{ color: 'var(--acc)' }}>{money(p.price)}</span>
                              </span>
                              <span className="block text-sm mt-1" style={{ color: 'var(--mute)' }}>{p.min} {t('min')}, {L.tags.slice(0, 2).join(', ')}</span>
                            </label>
                            {on && (
                              <div className="rise px-5 pb-5" style={{ borderTop: '1px solid var(--line)' }}>
                                <p className="text-[15.5px] leading-relaxed pt-4 mb-4" style={{ color: 'var(--mute)' }}>{L.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-4">{L.tags.map((g) => <span key={g} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--surf2)' }}>{g}</span>)}</div>
                                <p className="text-sm font-bold mb-2">{t('flowH')}</p>
                                <ol className="pl-5 list-decimal text-[15.5px] leading-relaxed space-y-1" style={{ color: 'var(--mute)' }}>{L.flow.map((s) => <li key={s}>{s}</li>)}</ol>
                              </div>
                            )}
                          </div>
                        </Reveal>
                      );
                    })}
                  </div>
                </div>

                {/* PASSO 2: como levar */}
                {chosen && !isSolo && (
                  <div ref={s2Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={2} title={t('s2')} done={true} />
                      <div className="grid gap-3" role="radiogroup" aria-label={t('s2')}>
                        {([
                          ['single', t('oSingle'), t('oSingleD'), pkg.price, 0, 0],
                          ['combo', t('oCombo'), t('oComboD'), pkg.price + pkg.combo, pkg.price + C.APARO_FULL, C.APARO_FULL - pkg.combo],
                          ['pack', t('oPack'), t('oPackD').replace('{n}', String(C.PACK_DAYS)), pkg.price * C.PACK_PAY, pkg.price * C.PACK_TOTAL, pkg.price],
                        ] as [Offer, string, string, number, number, number][]).map(([o, a, b, price, was, sv]) => (
                          <label key={o} className={`opt ${offerEff === o ? 'on' : ''}`}>
                            <input type="radio" name="offer" value={o} checked={offerEff === o} onChange={() => { vibrate(15); setOffer(o); }} className="sr-only" />
                            <span className="flex justify-between items-start gap-4">
                              <span><span className="block font-bold">{a}</span><span className="block text-sm mt-1" style={{ color: 'var(--mute)' }}>{b}</span></span>
                              <span className="text-right shrink-0">
                                <span className="serif text-[22px] block leading-none" style={{ color: 'var(--acc)' }}>{money(price)}</span>
                                {sv > 0 && <span className="block text-xs mt-1"><s style={{ color: 'var(--mute)' }}>{money(was)}</s></span>}
                              </span>
                            </span>
                            {sv > 0 && <span className="inline-block mt-3 text-xs font-extrabold px-3 py-1.5 rounded-full" style={{ background: 'color-mix(in srgb,var(--ok) 16%,transparent)', color: 'var(--ok)' }}>{t('save')} {money(sv)}</span>}
                          </label>
                        ))}
                      </div>
                      {isPack && <p className="text-sm leading-relaxed mt-4" style={{ color: 'var(--mute)' }}>{t('packNote')}</p>}
                    </Reveal>
                  </div>
                )}

                {/* PASSO 3: quando e onde */}
                {chosen && (
                  <div ref={s3Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 2 : 3} title={t('s3')} done={step3Valid} />
                      <div className="space-y-9">
                        <div>
                          <label htmlFor="nm" className="lbl">{t('name')}</label>
                          <input id="nm" autoComplete="given-name" type="text" value={data.name} maxLength={60} placeholder={t('namePh')} onChange={(e) => set({ name: e.target.value })} className="inp" aria-invalid={touched && !!errors.name} />
                          {touched && errors.name && <p className="err" role="alert">{errors.name}</p>}
                          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('place')}</legend>
                          <div className="grid grid-cols-2 gap-3">
                            {([['studio', t('studio')], ['home', t('home')]] as const).map(([id, label]) => (
                              <label key={id} className={`chip px-3 ${data.locType === id ? 'on' : ''}`}>
                                <input type="radio" name="location" value={id} checked={data.locType === id} onChange={() => set({ locType: id })} className="sr-only" />{label}
                              </label>
                            ))}
                          </div>
                          {isHome ? <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--mute)' }}>{t('peakNote')}</p> : <p className="text-sm mt-3 leading-relaxed" style={{ color: 'var(--mute)' }}>{t('studioInfo')}</p>}
                        </fieldset>

                        {isHome && (
                          <div className="space-y-3 rise">
                            <input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder={t('cep')} aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} className="inp" />
                            <input type="text" autoComplete="street-address" placeholder={t('street')} aria-label={t('street')} maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} className="inp" />
                            <div className="flex gap-3">
                              <input ref={numberRef} type="text" inputMode="numeric" placeholder={t('number')} aria-label={t('number')} maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} className="inp" style={{ width: '34%' }} />
                              <input type="text" placeholder={t('comp')} aria-label={t('comp')} maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} className="inp" style={{ width: '66%' }} />
                            </div>
                            <input type="text" placeholder={t('bairro')} aria-label={t('bairro')} maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} className="inp" />
                            {touched && errors.address && <p className="err" role="alert">{errors.address}</p>}
                          </div>
                        )}

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('date')}</legend>
                          <div className="flex gap-3 overflow-x-auto py-1 hide-sb -mx-5 px-5 snap-x">
                            {days.map(({ d, i }) => {
                              const sel = sameDay(data.date, d);
                              return (
                                <label key={dateKey(d)} className={`chip shrink-0 snap-start flex-col py-3 ${sel ? 'on' : ''}`} style={{ width: 80 }}>
                                  <input type="radio" name="date" value={dateKey(d)} checked={sel} aria-label={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} onChange={() => set({ date: d, time: '' })} className="sr-only" />
                                  <span aria-hidden="true" className="text-xs font-bold capitalize">{dayName(d, i)}</span>
                                  <span aria-hidden="true" className="serif text-[28px] leading-tight">{d.getDate()}</span>
                                  <span aria-hidden="true" className="text-xs opacity-70">{fmt(d, { month: 'short' }).replace('.', '')}</span>
                                </label>
                              );
                            })}
                          </div>
                          {touched && errors.date && <p className="err" role="alert">{errors.date}</p>}
                        </fieldset>

                        {data.date && (
                          <fieldset className="min-w-0 rise">
                            <legend className="sr-only">{t('time')}</legend>
                            <div className="flex justify-between items-baseline mb-3">
                              <span aria-hidden="true" className="lbl" style={{ marginBottom: 0 }}>{t('time')}</span>
                              <span className="text-xs" style={{ color: 'var(--mute)' }}>{t('session')} {invoice.dur} {t('min')}</span>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {slots.map(({ t: tm, ok }) => {
                                const sel = data.time === tm;
                                const peak = isHome && PEAK_HOURS.includes(tm);
                                return (
                                  <label key={tm} className={`chip flex-col py-3 ${sel ? 'on' : ''} ${!ok ? 'off' : ''}`}>
                                    <input type="radio" name="time" value={tm} checked={sel} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} onChange={() => { vibrate(15); set({ time: tm }); }} className="sr-only" />
                                    <span aria-hidden="true" className="font-semibold">{tm}</span>
                                    {peak && ok && <span aria-hidden="true" className="text-[11px] font-bold" style={{ color: sel ? 'inherit' : 'var(--warn)' }}>{t('peak')} +{C.PEAK_FEE}</span>}
                                  </label>
                                );
                              })}
                            </div>
                            {availableCount === 0 && <p className="text-sm text-center py-5" style={{ color: 'var(--mute)' }}>{t('noSlots')}</p>}
                            {data.time && <p className="text-[15.5px] font-semibold mt-4 flex items-center gap-2" style={{ color: 'var(--ok)' }}><Icon name="check" size={16} /> {t('from')} {data.time} {t('to')} {endTime}</p>}
                            <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('demo')}</p>
                            {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                          </fieldset>
                        )}

                        <div>
                          <button type="button" className="btn btn-p w-full" style={{ minHeight: 60 }} onClick={goReview}>{t('cont')}</button>
                          <p className="text-sm text-center mt-4" style={{ color: 'var(--mute)' }}>{t('chatQ')} <a href={chatLink} target="_blank" rel="noopener noreferrer" className="link">{t('chatBtn')}</a></p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                )}

                {/* PASSO 4: resumo e pagamento */}
                {chosen && reviewed && (
                  <div ref={s4Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 3 : 4} title={t('s4')} done={false} />
                      <div className="space-y-8">
                        <div className="card p-6 space-y-3">
                          <Row label={t('sPack')} value={pt.title} />
                          <Row label={t('sWhen')} value={data.date ? `${fmt(data.date, { weekday: 'short', day: '2-digit', month: 'short' })}, ${data.time} – ${endTime}` : ''} />
                          <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number}` : t('sLocStudio')} />
                          <button type="button" onClick={() => scrollToRef(s3Ref, 30)} className="link text-sm">{t('change')}</button>
                        </div>

                        <fieldset className="min-w-0">
                          <legend className="lbl">{t('pay')}</legend>
                          <div className="grid grid-cols-3 gap-3">
                            {(['pix', 'card', 'cash'] as const).map(p => (
                              <label key={p} className={`chip text-[15px] px-2 ${data.payment === p ? 'on' : ''}`}>
                                <input type="radio" name="payment" value={p} checked={data.payment === p} onChange={() => { vibrate(15); set({ payment: p }); }} className="sr-only" />{t(p)}
                              </label>
                            ))}
                          </div>
                          {data.payment === 'card' && <p className="text-sm mt-3" style={{ color: 'var(--mute)' }}>{t('cardNote')}</p>}
                        </fieldset>

                        <details className="faq card px-6">
                          <summary>{t('extras')}</summary>
                          <div className="pb-6 space-y-6">
                            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                              <input type="checkbox" checked={data.addTime} onChange={(e) => { vibrate(15); set({ addTime: e.target.checked }); }} className="w-6 h-6 shrink-0" style={{ accentColor: 'var(--acc)' }} />
                              <span className="flex-1">{t('lTime')}</span><span className="font-bold">+ {money(C.TIME_ADD)}</span>
                            </label>
                            {!isPack && !coupon.applied && (
                              <div>
                                <label htmlFor="cp" className="lbl">{t('couponQ')}</label>
                                <div className="flex gap-2">
                                  <input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className="inp uppercase flex-1" aria-describedby={coupon.error ? 'cp-err' : undefined} />
                                  <button type="button" onClick={applyCoupon} className="btn btn-g">{t('apply')}</button>
                                </div>
                                {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                              </div>
                            )}
                            <div>
                              <p className="lbl">{t('reqQ')}</p>
                              <div className="flex items-start gap-3 text-sm leading-relaxed mb-3">
                                <input id="req-ok" type="checkbox" checked={reqOk} onChange={(e) => { setReqOk(e.target.checked); if (!e.target.checked) set({ req: '' }); }} className="mt-1 w-6 h-6 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                                <p style={{ color: 'var(--mute)' }}><label htmlFor="req-ok" className="cursor-pointer">{t('reqConsent')} </label><button type="button" className="link" onClick={() => setDoc('privacy')}>{t('learn')}</button></p>
                              </div>
                              <label htmlFor="rq" className="sr-only">{t('reqPh')}</label>
                              <input id="rq" type="text" disabled={!reqOk} placeholder={t('reqPh')} maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className="inp" />
                              <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('reqNote')}</p>
                            </div>
                          </div>
                        </details>

                        <div className="card p-6">
                          <div className="space-y-3 mb-5">
                            <Row label={isPack ? t('lPack5') : t('lPack')} value={money(invoice.sessionPrice)} />
                            {invoice.aparoAdd > 0 && <Row label={t('lCombo')} value={`+${money(invoice.aparoAdd)}`} />}
                            {invoice.timeAdd > 0 && <Row label={t('lTime')} value={`+${money(invoice.timeAdd)}`} />}
                            {invoice.reqFee > 0 && <Row label={t('lReq')} value={`+${money(invoice.reqFee)}`} />}
                            {invoice.discount > 0 && <Row tone="ok" label={coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')} value={`-${money(invoice.discount)}`} />}
                            {invoice.pixDiscount > 0 && <Row tone="ok" label={t('lPix')} value={`-${money(invoice.pixDiscount)}`} />}
                            {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                          </div>
                          <div className="flex justify-between items-end pt-5" style={{ borderTop: '1px solid var(--line)' }}>
                            <span style={{ color: 'var(--mute)' }}>{t('total')}</span>
                            <span className="serif text-[46px] leading-none font-light">{money(invoice.total)}</span>
                          </div>
                          {invoice.saved > 0 && <p className="mt-4 text-[15px] font-extrabold text-center py-2.5 rounded-2xl" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)', color: 'var(--ok)' }}>{t('saved')} {money(invoice.saved)}</p>}
                          <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                            <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('signal')}</p><p className="font-extrabold" style={{ color: 'var(--acc)' }}>{money(invoice.sinal)}</p></div>
                            <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('rest')}</p><p className="font-extrabold">{money(invoice.rest)}</p></div>
                          </div>
                        </div>

                        <p className="text-[15.5px] leading-relaxed">{t('sigA')} <strong>{money(invoice.sinal)}</strong> {t('sigB')}{' '}
                          <button type="button" onClick={copyPix} className="link inline-flex items-center gap-1"><Icon name="copy" size={15} /> {t('copyPix')}</button></p>

                        <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer" style={{ color: 'var(--mute)' }}>
                          <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-6 h-6 shrink-0" style={{ accentColor: 'var(--acc)' }} /><span>{t('optIn')}</span>
                        </label>
                        
                        <div className="flex items-start gap-3 text-sm leading-relaxed">
                          <input id="age-ok" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-6 h-6 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                          <p><label htmlFor="age-ok" className="cursor-pointer">{t('ageA')} </label>
                            <button type="button" className="link" onClick={() => setDoc('privacy')}>{t('privacy')}</button>, <button type="button" className="link" onClick={() => setDoc('terms')}>{t('terms')}</button> {t('and')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.</p>
                        </div>

                        <button type="button" onClick={finish} disabled={!data.payment || !ageOk} className="btn btn-p w-full" style={{ minHeight: 64, fontSize: 17 }}>
                          {!data.payment ? t('needPay') : !ageOk ? t('needAge') : t('send')}
                        </button>
                      </div>
                    </Reveal>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* ========== SOBRE ========== */}
          <section className="mb-24" aria-labelledby="ab">
            <Reveal>
              <div className="flex items-center gap-5 mb-5">
                <Avatar className="w-20 h-20 rounded-full" alt="Thalyson" />
                <div>
                  <Title id="ab" className="text-[26px] md:text-[32px]">{t('aboutH')}</Title>
                  <p className="text-sm font-bold" style={{ color: 'var(--acc)' }}>{t('aboutR')}</p>
                </div>
              </div>
              <p className="leading-relaxed mb-3 max-w-xl" style={{ color: 'var(--mute)' }}>{t('about1')}</p>
              <p className="flex items-start gap-3 text-[15.5px] leading-relaxed mb-6 max-w-xl"><Icon name="map" size={18} className="mt-1" />{t('about2')}</p>
              <div className="flex flex-wrap gap-3">
                <button type="button" onClick={() => setProfileOpen(true)} className="btn btn-p" style={{ minHeight: 50 }}>{t('seeProfile')}</button>
                <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="instagram" size={18} /> Instagram</a>
              </div>
            </Reveal>
          </section>

          {/* ========== DÚVIDAS ========== */}
          <section className="mb-8" aria-labelledby="fq">
            <Title id="fq" className="text-[32px] md:text-[40px] mb-6">{t('faqH')}</Title>
            <Reveal>
              <div className="card px-6">
                {[['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4']].map(([q, a], i) => (
                  <details key={q} className="faq" style={i ? { borderTop: '1px solid var(--line)' } : undefined}>
                    <summary>{t(q)}</summary>
                    <p className="pb-4 leading-relaxed" style={{ color: 'var(--mute)' }}>{t(a)}</p>
                  </details>
                ))}
              </div>
            </Reveal>
          </section>
        </>)}
      </main>

      <footer className="max-w-xl mx-auto px-6 mt-16 pt-6 text-xs leading-relaxed text-center" style={{ borderTop: '1px solid var(--line)', color: 'var(--mute)' }}>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <button key={id} type="button" onClick={() => setDoc(id)} className="underline underline-offset-4 min-h-[44px] px-2">{t(k)}</button>
          ))}
        </nav>
        <p className="mt-2">{SITE_NAME}<br />{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}<br />{LEGAL.ENDERECO}<br />{LEGAL.EMAIL}</p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
      </footer>

      {showBar && !done && (
        <div className="bar">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs truncate" style={{ color: 'var(--mute)' }}>{chosen ? pt.title : t('fromM')}</p>
              <p className="serif text-2xl leading-none">{money(chosen ? pkg.price : Math.min(...MASSAGES.map((p) => p.price)))}</p>
            </div>
            <button type="button" onClick={goBook} className="btn btn-p">{t('cta')}</button>
          </div>
        </div>
      )}

      {profileOpen && (
        <Modal title={t('profile')} onClose={() => setProfileOpen(false)} closeLabel={t('close')}>
          <div className="p-6">
            <div className="flex items-center gap-5 mb-5">
              <Avatar className="w-24 h-24 rounded-full" alt="Thalyson" />
              <div>
                <h3 className="serif text-2xl leading-tight">{t('aboutH')}</h3>
                <p className="text-sm font-bold" style={{ color: 'var(--acc)' }}>{t('aboutR')}</p>
              </div>
            </div>
            <p className="leading-relaxed mb-2">{greeting}. {t('about1')}</p>
            <ul className="my-4 space-y-2">
              {['pBul1', 'pBul2', 'pBul3'].map((k) => (<li key={k} className="flex items-start gap-3 text-[15.5px] leading-relaxed"><Icon name="check" size={18} className="mt-1" /><span>{t(k)}</span></li>))}
            </ul>
            <dl className="rounded-2xl p-5 space-y-4 mb-6" style={{ background: 'var(--surf2)' }}>
              {([['pHours', t('pHoursV').replace('{a}', fromMin(C.OPEN)).replace('{b}', fromMin(C.LAST_END))], ['pWhere', t('pWhereV')], ['pPay', t('pPayV')], ['pCancel', t('pCancelV')]] as [string, string][]).map(([k, v]) => (
                <div key={k}><dt className="text-xs font-bold" style={{ color: 'var(--mute)' }}>{t(k)}</dt><dd className="text-[15.5px] font-semibold">{v}</dd></div>
              ))}
              <div><dt className="text-xs font-bold" style={{ color: 'var(--mute)' }}>{t('sLoc')}</dt><dd className="text-[15.5px] font-semibold">{t('about2')}</dd></div>
            </dl>
            <div className="grid gap-3 mb-6">
              {phase === 'site' && <button type="button" className="btn btn-p w-full" onClick={() => { setProfileOpen(false); goBook(); }}>{t('cta')}</button>}
              <a href={chatLink} target="_blank" rel="noopener noreferrer" className="btn btn-g w-full"><Icon name="chat" size={18} /> {t('chatBtn')}</a>
              <div className="grid grid-cols-2 gap-3">
                <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="instagram" size={18} /> Instagram</a>
                <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 50 }}><Icon name="star" size={18} /> {t('reviews')}</a>
              </div>
            </div>
            <button type="button" onClick={forgetMe} className="w-full text-sm underline underline-offset-4 min-h-[48px]" style={{ color: 'var(--mute)' }}>{t('pForget')}</button>
          </div>
        </Modal>
      )}

      {doc && (
        <Modal title={DOCS[doc].title} onClose={() => setDoc(null)} closeLabel={t('close')}>
          <div className="p-5 text-sm leading-relaxed" style={{ color: 'var(--mute)' }} tabIndex={0}>
            {t('legalNote') && <p className="mb-3 font-semibold" style={{ color: 'var(--ink)' }}>{t('legalNote')}</p>}
            {DOCS[doc].body}
          </div>
        </Modal>
      )}
    </div>
  );
}
