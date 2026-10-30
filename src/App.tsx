import { useState, useEffect, useMemo, useRef, memo, type ReactNode } from 'react';

/* ==========================================================================
   DADOS LEGAIS (confirme a razão social no cartão CNPJ)
   ========================================================================== */
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
  OPEN: 9 * 60,
  LAST_END: 23 * 60 + 30,
  STEP: 60,
  BUF_S: 15,
  BUF_H: 60,
  LEAD_S: 30,
  LEAD_H: 60,
  DAYS: 14,
};
const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];

type Lang = 'pt' | 'en' | 'es';
type Theme = 'dark' | 'light';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };

/* ==========================================================================
   TEXTOS (PT / EN / ES)
   ========================================================================== */
const T: Record<Lang, Record<string, string>> = {
  pt: {
    badge: 'Bela Vista, Centro de São Paulo', h1: 'O seu momento de pausa.',
    sub: 'Massagem masculina em São Paulo. Escolha, agende e relaxe: a confirmação chega direto no seu WhatsApp.',
    cta: 'Agendar agora', reviews: 'Ver avaliações', next: 'Próximo horário livre', today: 'Hoje', tomorrow: 'Amanhã', tapBook: 'Toque para reservar',
    t1: 'Sinal de só R$ 40', t1d: 'O restante você paga depois da sessão.',
    t2: 'Cancelamento grátis', t2d: 'Até 12 horas antes, com sinal devolvido.',
    t3: 'Tudo pelo WhatsApp', t3d: 'Sem cadastro, sem e-mail, sem baixar app.',
    t4: '1ª sessão com R$ 15 off', t4d: 'Aplicado automaticamente no resumo.',
    pkgH: 'Escolha o seu pacote', pkgS: 'Atendimento reservado, exclusivo para maiores de 18 anos.', pick: 'Escolher este', picked: 'Selecionado', min: 'min',
    howH: 'Três toques e está feito', h1t: 'Escolha', h1d: 'Pacote e adicionais, com o preço sempre visível.', h2t: 'Marque', h2d: 'Dia, horário e local da sessão.', h3t: 'Confirme', h3d: 'Envie o sinal por Pix no WhatsApp e pronto.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Terapeuta masculino',
    about1: 'Meu trabalho é direto e focado no corpo masculino: usar o toque para aliviar o peso e a tensão da sua rotina.',
    about2: 'Atendo em uma suíte no Centro Histórico de SP, próximo ao Metrô Anhangabaú.',
    bookH: 'Agende em 1 minuto', step: 'Passo', of: 'de',
    name: 'Como devo te chamar?', namePh: 'Seu nome', nameErr: 'Informe seu nome (mín. 3 letras).',
    place: 'Local da sessão', studio: 'No meu espaço', home: 'Vou até você',
    peakNote: 'Horários de pico no seu endereço têm taxa de R$ 18. Pedimos mais antecedência para o deslocamento. O CEP é consultado no ViaCEP.',
    studioInfo: 'A suíte fica no Centro Histórico, na Bela Vista (próximo ao Metrô Anhangabaú). O endereço exato é enviado junto com a confirmação.',
    cep: 'CEP (preenche o endereço)', street: 'Rua ou Avenida', number: 'Nº', comp: 'Complemento', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Data', time: 'Horário de início', session: 'Sessão de', peak: 'Pico', noSlots: 'Sem horários livres neste dia. Tente outra data.',
    demo: 'Disponibilidade demonstrativa: a reserva só vale após a resposta no WhatsApp.', dateErr: 'Escolha uma data.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'indisponível',
    review: 'Revisar', back: 'Voltar', fill: 'Complete os campos destacados',
    sumH: 'Resumo', sPack: 'Pacote', sDate: 'Data', sTime: 'Horário', sLoc: 'Local', sLocStudio: 'No espaço (Bela Vista)', change: 'Alterar data, horário ou local',
    addons: 'Adicionais', addonTime: '+30 minutos extras', addonAparo: 'Aparar pelos até 3 lugares (máquina)',
    lPack: 'Pacote escolhido', lAddons: 'Adicionais', lReq: 'Pedido específico', lFirst: 'Presente de 1ª sessão', lCoupon: 'Cupom', lPeak: 'Deslocamento / pico', lPix: 'Desconto Pix (3%)',
    total: 'Total', signal: 'Sinal agora', rest: 'Após a sessão',
    couponQ: 'Possui cupom adicional?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupom ativado', couponBad: 'Cupom inválido ou expirado.',
    reqQ: 'Pedido específico? (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Consinto em informar um pedido que pode tratar de vida sexual (dado sensível), apenas para que ele seja avaliado. Ele segue só pelo WhatsApp, não é salvo neste aparelho e posso retirar o consentimento quando quiser.',
    reqPh: 'Opcional: algum detalhe ou vontade para a sessão', reqNote: 'Pedido avaliado no momento do atendimento. Se inviável, o valor não é cobrado.',
    pay: 'Pagamento do restante', pix: 'Pix (-3%)', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'Taxas do cartão são combinadas pelo WhatsApp antes do pagamento.',
    optIn: 'Opcional: quero receber lembretes e novidades pelo WhatsApp. Posso pedir para parar a qualquer momento.',
    ageA: 'Declaro ter 18 anos ou mais e li a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e a', refund: 'Política de Cancelamento',
    sigA: 'Para confirmar o horário, envie um sinal de', sigB: 'via Pix. O restante é acertado após a sessão.', copyPix: 'Copiar chave Pix (CNPJ)', pixCopied: 'Chave Pix (CNPJ) copiada',
    send: 'Enviar solicitação pelo WhatsApp', needPay: 'Escolha a forma de pagamento', needAge: 'Confirme que você tem 18 anos ou mais', preparing: 'Preparando...',
    doneH: 'Tudo pronto!', doneP: 'Sua solicitação foi preparada. O horário só está confirmado depois da resposta pelo WhatsApp. Se o WhatsApp não abriu, use o botão abaixo.',
    doneSig: 'Envie o comprovante do sinal na conversa para confirmar.', resend: 'Reenviar mensagem', addCal: 'Adicionar à agenda', restart: 'Voltar ao início',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento e reembolso', footCookies: 'Cookies', adults: 'Serviço exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Alternar tema', lang: 'Idioma', from_: 'a partir de', legalNote: '', book: 'Agendar',
    srLight: 'Mudar para tema claro', srDark: 'Mudar para tema escuro',
  },
  en: {
    badge: 'Bela Vista, Downtown São Paulo', h1: 'Your moment to pause.',
    sub: 'Men’s massage in São Paulo. Choose, book and relax: the confirmation lands straight in your WhatsApp.',
    cta: 'Book now', reviews: 'See reviews', next: 'Next free slot', today: 'Today', tomorrow: 'Tomorrow', tapBook: 'Tap to reserve',
    t1: 'Deposit of only R$ 40', t1d: 'You pay the rest after the session.',
    t2: 'Free cancellation', t2d: 'Up to 12 hours before, deposit refunded.',
    t3: 'All through WhatsApp', t3d: 'No sign-up, no email, no app to download.',
    t4: 'R$ 15 off your 1st session', t4d: 'Applied automatically in the summary.',
    pkgH: 'Choose your package', pkgS: 'Private service, exclusively for adults 18+.', pick: 'Choose this', picked: 'Selected', min: 'min',
    howH: 'Three taps and you’re done', h1t: 'Choose', h1d: 'Package and add-ons, with the price always visible.', h2t: 'Book', h2d: 'Day, time and place of the session.', h3t: 'Confirm', h3d: 'Send the deposit by Pix on WhatsApp and that’s it.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Male therapist',
    about1: 'My work is direct and focused on the male body: using touch to relieve the weight and tension of your routine.',
    about2: 'I work from a suite in downtown São Paulo, close to the Anhangabaú metro station.',
    bookH: 'Book in 1 minute', step: 'Step', of: 'of',
    name: 'What should I call you?', namePh: 'Your name', nameErr: 'Enter your name (min. 3 letters).',
    place: 'Session location', studio: 'At my place', home: 'I come to you',
    peakNote: 'Peak hours at your address carry a R$ 18 fee. We ask for more notice for travel. The ZIP code is looked up via ViaCEP.',
    studioInfo: 'The suite is in the Historic Center, Bela Vista (near Anhangabaú metro). The exact address is sent with the confirmation.',
    cep: 'ZIP code (fills the address)', street: 'Street or Avenue', number: 'No.', comp: 'Apartment / complement', bairro: 'Neighborhood', addrErr: 'Fill in street, number and neighborhood.', cepFail: 'ZIP code not found. Fill in manually.',
    date: 'Date', time: 'Start time', session: 'Session of', peak: 'Peak', noSlots: 'No free slots on this day. Try another date.',
    demo: 'Sample availability: the booking only counts after the reply on WhatsApp.', dateErr: 'Choose a date.', timeErr: 'Choose a time.', from: 'From', to: 'to', unavailable: 'unavailable',
    review: 'Review', back: 'Back', fill: 'Complete the highlighted fields',
    sumH: 'Summary', sPack: 'Package', sDate: 'Date', sTime: 'Time', sLoc: 'Location', sLocStudio: 'At the suite (Bela Vista)', change: 'Change date, time or location',
    addons: 'Add-ons', addonTime: '+30 extra minutes', addonAparo: 'Body trimming up to 3 areas (machine)',
    lPack: 'Chosen package', lAddons: 'Add-ons', lReq: 'Specific request', lFirst: '1st session gift', lCoupon: 'Coupon', lPeak: 'Travel / peak', lPix: 'Pix discount (3%)',
    total: 'Total', signal: 'Deposit now', rest: 'After the session',
    couponQ: 'Have an extra coupon?', couponPh: 'Code', apply: 'Apply', couponOk: 'Coupon applied', couponBad: 'Invalid or expired coupon.',
    reqQ: 'Specific request? (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to describing a request that may relate to sex life (sensitive data), only so it can be evaluated. It goes only via WhatsApp, is not saved on this device, and I can withdraw consent any time.',
    reqPh: 'Optional: any detail or wish for the session', reqNote: 'Request evaluated at the time of the session. If not feasible, it is not charged.',
    pay: 'Payment of the remainder', pix: 'Pix (-3%)', card: 'Card up to 12x', cash: 'Cash', cardNote: 'Card fees are agreed on WhatsApp before payment.',
    optIn: 'Optional: I want reminders and news via WhatsApp. I can ask to stop at any time.',
    ageA: 'I declare I am 18 or older and have read the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and the', refund: 'Cancellation Policy',
    sigA: 'To confirm the time, send a deposit of', sigB: 'via Pix. The rest is settled after the session.', copyPix: 'Copy Pix key (CNPJ)', pixCopied: 'Pix key (CNPJ) copied',
    send: 'Send request on WhatsApp', needPay: 'Choose a payment method', needAge: 'Confirm you are 18 or older', preparing: 'Preparing...',
    doneH: 'All set!', doneP: 'Your request is ready. The time is only confirmed after the reply on WhatsApp. If WhatsApp did not open, use the button below.',
    doneSig: 'Send the deposit receipt in the chat to confirm.', resend: 'Resend message', addCal: 'Add to calendar', restart: 'Back to start',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Cancellation and refunds', footCookies: 'Cookies', adults: 'Service exclusively for adults 18+.',
    close: 'Close', theme: 'Toggle theme', lang: 'Language', from_: 'from', legalNote: 'Legal documents are provided in Portuguese, which is the binding version.', book: 'Book',
    srLight: 'Switch to light theme', srDark: 'Switch to dark theme',
  },
  es: {
    badge: 'Bela Vista, Centro de São Paulo', h1: 'Tu momento de pausa.',
    sub: 'Masaje masculino en São Paulo. Elige, reserva y relájate: la confirmación llega directo a tu WhatsApp.',
    cta: 'Reservar ahora', reviews: 'Ver reseñas', next: 'Próximo horario libre', today: 'Hoy', tomorrow: 'Mañana', tapBook: 'Toca para reservar',
    t1: 'Señal de solo R$ 40', t1d: 'El resto lo pagas después de la sesión.',
    t2: 'Cancelación gratis', t2d: 'Hasta 12 horas antes, con señal devuelta.',
    t3: 'Todo por WhatsApp', t3d: 'Sin registro, sin correo, sin descargar apps.',
    t4: '1ª sesión con R$ 15 de descuento', t4d: 'Se aplica automáticamente en el resumen.',
    pkgH: 'Elige tu paquete', pkgS: 'Atención reservada, exclusiva para mayores de 18 años.', pick: 'Elegir este', picked: 'Seleccionado', min: 'min',
    howH: 'Tres toques y listo', h1t: 'Elige', h1d: 'Paquete y adicionales, con el precio siempre visible.', h2t: 'Reserva', h2d: 'Día, hora y lugar de la sesión.', h3t: 'Confirma', h3d: 'Envía la señal por Pix en WhatsApp y listo.',
    aboutH: 'Thalyson Massagens, SP Bela Vista', aboutR: 'Terapeuta masculino',
    about1: 'Mi trabajo es directo y enfocado en el cuerpo masculino: usar el tacto para aliviar el peso y la tensión de tu rutina.',
    about2: 'Atiendo en una suite en el Centro Histórico de SP, cerca del metro Anhangabaú.',
    bookH: 'Reserva en 1 minuto', step: 'Paso', of: 'de',
    name: '¿Cómo debo llamarte?', namePh: 'Tu nombre', nameErr: 'Ingresa tu nombre (mín. 3 letras).',
    place: 'Lugar de la sesión', studio: 'En mi espacio', home: 'Voy hasta ti',
    peakNote: 'Los horarios pico en tu dirección tienen una tasa de R$ 18. Pedimos más antelación por el desplazamiento. El CEP se consulta en ViaCEP.',
    studioInfo: 'La suite está en el Centro Histórico, en Bela Vista (cerca del metro Anhangabaú). La dirección exacta se envía con la confirmación.',
    cep: 'CEP (completa la dirección)', street: 'Calle o Avenida', number: 'Nº', comp: 'Complemento', bairro: 'Barrio', addrErr: 'Completa calle, número y barrio.', cepFail: 'CEP no encontrado. Complétalo manualmente.',
    date: 'Fecha', time: 'Hora de inicio', session: 'Sesión de', peak: 'Pico', noSlots: 'Sin horarios libres este día. Prueba otra fecha.',
    demo: 'Disponibilidad demostrativa: la reserva solo vale tras la respuesta en WhatsApp.', dateErr: 'Elige una fecha.', timeErr: 'Elige un horario.', from: 'De', to: 'a', unavailable: 'no disponible',
    review: 'Revisar', back: 'Volver', fill: 'Completa los campos resaltados',
    sumH: 'Resumen', sPack: 'Paquete', sDate: 'Fecha', sTime: 'Horario', sLoc: 'Lugar', sLocStudio: 'En la suite (Bela Vista)', change: 'Cambiar fecha, horario o lugar',
    addons: 'Adicionales', addonTime: '+30 minutos extra', addonAparo: 'Recorte de vello hasta 3 zonas (máquina)',
    lPack: 'Paquete elegido', lAddons: 'Adicionales', lReq: 'Pedido específico', lFirst: 'Regalo de 1ª sesión', lCoupon: 'Cupón', lPeak: 'Desplazamiento / pico', lPix: 'Descuento Pix (3%)',
    total: 'Total', signal: 'Señal ahora', rest: 'Después de la sesión',
    couponQ: '¿Tienes un cupón adicional?', couponPh: 'Código', apply: 'Aplicar', couponOk: 'Cupón activado', couponBad: 'Cupón inválido o vencido.',
    reqQ: '¿Pedido específico? (+ R$ 140)', learn: 'Más información',
    reqConsent: 'Consiento informar un pedido que puede tratar sobre vida sexual (dato sensible), solo para que sea evaluado. Va solo por WhatsApp, no se guarda en este dispositivo y puedo retirar el consentimiento cuando quiera.',
    reqPh: 'Opcional: algún detalle o deseo para la sesión', reqNote: 'Pedido evaluado en el momento de la atención. Si es inviable, no se cobra.',
    pay: 'Pago del resto', pix: 'Pix (-3%)', card: 'Tarjeta hasta 12x', cash: 'Efectivo', cardNote: 'Las tasas de tarjeta se acuerdan por WhatsApp antes del pago.',
    optIn: 'Opcional: quiero recibir recordatorios y novedades por WhatsApp. Puedo pedir que paren en cualquier momento.',
    ageA: 'Declaro tener 18 años o más y haber leído la', privacy: 'Política de Privacidad', terms: 'Términos', and: 'y la', refund: 'Política de Cancelación',
    sigA: 'Para confirmar el horario, envía una señal de', sigB: 'por Pix. El resto se paga después de la sesión.', copyPix: 'Copiar clave Pix (CNPJ)', pixCopied: 'Clave Pix (CNPJ) copiada',
    send: 'Enviar solicitud por WhatsApp', needPay: 'Elige la forma de pago', needAge: 'Confirma que tienes 18 años o más', preparing: 'Preparando...',
    doneH: '¡Todo listo!', doneP: 'Tu solicitud está preparada. El horario solo se confirma tras la respuesta por WhatsApp. Si no se abrió, usa el botón de abajo.',
    doneSig: 'Envía el comprobante de la señal en el chat para confirmar.', resend: 'Reenviar mensaje', addCal: 'Añadir al calendario', restart: 'Volver al inicio',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Cancelación y reembolso', footCookies: 'Cookies', adults: 'Servicio exclusivo para mayores de 18 años.',
    close: 'Cerrar', theme: 'Cambiar tema', lang: 'Idioma', from_: 'desde', legalNote: 'Los documentos legales están en portugués, que es la versión vinculante.', book: 'Reservar',
    srLight: 'Cambiar a tema claro', srDark: 'Cambiar a tema oscuro',
  },
};

type PkgText = { title: string; desc: string; tags: string[] };
const PACKAGES: { id: string; price: number; min: number; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, L: {
    pt: { title: 'Massagem Clássica', tags: ['Relaxamento completo', 'Pistola relaxante', 'Sem toque íntimo'], desc: 'O essencial para quem está com o corpo cansado da rotina. Uso a força das minhas mãos para trabalhar a tensão e soltar sua musculatura, com foco no relaxamento.' },
    en: { title: 'Classic Massage', tags: ['Full relaxation', 'Massage gun', 'No intimate touch'], desc: 'The essential for a body worn out by routine. I use the strength of my hands to work out tension and loosen your muscles, focused on relaxation.' },
    es: { title: 'Masaje Clásico', tags: ['Relajación completa', 'Pistola relajante', 'Sin toque íntimo'], desc: 'Lo esencial para un cuerpo cansado de la rutina. Uso la fuerza de mis manos para trabajar la tensión y soltar tu musculatura, con foco en la relajación.' } } },
  { id: 'sensitiva', price: 220, min: 60, L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Tântrica', 'Pistola relaxante', 'Finalização lingam'], desc: 'Começamos com a massagem clássica para relaxar o corpo. Quando você estiver à vontade, os toques mudam, ficam mais leves e encerramos com a massagem lingam.' },
    en: { title: 'Sensitive & Pleasure', tags: ['Tantric', 'Massage gun', 'Lingam finish'], desc: 'We start with the classic massage to relax the body. When you feel at ease, the touch changes and becomes lighter, and we close with lingam massage.' },
    es: { title: 'Sensitiva & Placer', tags: ['Tántrica', 'Pistola relajante', 'Final lingam'], desc: 'Empezamos con el masaje clásico para relajar el cuerpo. Cuando te sientas cómodo, los toques cambian y se vuelven más suaves, y cerramos con masaje lingam.' } } },
  { id: 'fusion', price: 290, min: 60, L: {
    pt: { title: 'Sensações com a Barba', tags: ['Tântrica', 'Naturista', 'Pistola relaxante', 'Uso de barba'], desc: 'Ficamos totalmente à vontade. Primeiro a massagem clássica, depois uso minha barba em algumas partes do seu corpo e encerramos com a massagem lingam.' },
    en: { title: 'Beard Sensations', tags: ['Tantric', 'Naturist', 'Massage gun', 'Beard play'], desc: 'We get fully comfortable. First the classic massage, then I use my beard on some parts of your body, and we close with lingam massage.' },
    es: { title: 'Sensaciones con la Barba', tags: ['Tántrica', 'Naturista', 'Pistola relajante', 'Uso de barba'], desc: 'Nos ponemos totalmente cómodos. Primero el masaje clásico, luego uso mi barba en algunas partes de tu cuerpo y cerramos con masaje lingam.' } } },
  { id: 'completa', price: 390, min: 60, L: {
    pt: { title: 'Corpo a Corpo & Interação', tags: ['Tântrica', 'Pistola relaxante', 'Naturista', 'Interação', 'Você faz massagem'], desc: 'O pacote sem barreiras. Primeiro a massagem clássica, depois proximidade física com gel corpo a corpo e liberdade para você fazer massagem em mim, e encerramos com a massagem lingam.' },
    en: { title: 'Body to Body & Interaction', tags: ['Tantric', 'Massage gun', 'Naturist', 'Interaction', 'You massage me'], desc: 'The no-barriers package. First the classic massage, then physical closeness with body-to-body gel and the freedom for you to massage me, and we close with lingam massage.' },
    es: { title: 'Cuerpo a Cuerpo & Interacción', tags: ['Tántrica', 'Pistola relajante', 'Naturista', 'Interacción', 'Tú me masajeas'], desc: 'El paquete sin barreras. Primero el masaje clásico, luego cercanía física con gel cuerpo a cuerpo y libertad para que me hagas masaje, y cerramos con masaje lingam.' } } },
  { id: 'aparo_solo', price: 130, min: 40, L: {
    pt: { title: 'Apenas Depilação (Máquina)', tags: ['Estética', 'Sem massagem'], desc: 'Serviço isolado para quem busca apenas estética. Aparo de pelos (até 3 lugares), pente 1 e 3, utilizando máquina.' },
    en: { title: 'Trimming Only (Machine)', tags: ['Grooming', 'No massage'], desc: 'Standalone service for grooming only. Body hair trimming (up to 3 areas), guards 1 and 3, using a machine.' },
    es: { title: 'Solo Depilación (Máquina)', tags: ['Estética', 'Sin masaje'], desc: 'Servicio aislado para quien busca solo estética. Recorte de vello (hasta 3 zonas), peine 1 y 3, con máquina.' } } },
];
const ADDONS = [{ id: 'time', key: 'addonTime', price: 75 }, { id: 'aparo', key: 'addonAparo', price: 130 }];

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
    <H>4. Com quem os dados são compartilhados</H><P>WhatsApp (Meta Platforms), para onde sua solicitação é enviada por você. ViaCEP, que recebe o CEP digitado para preencher o endereço. Não vendemos dados.</P>
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
    <H>4. Preços e pagamento</H><P>Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. Adicionais, taxa de horário de pico (atendimento no endereço do cliente) e pedido específico aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.</P>
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
    <H>Estritamente necessário</H><P>Guardamos no navegador (localStorage) apenas suas preferências de tema e idioma e a lembrança de que você já agendou antes (para não repetir o desconto de primeira sessão). Não identificam você. Nome e endereço não são guardados.</P>
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
};
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const copyText = async (t: string) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { return false; } };

type Slot = { t: string; ok: boolean };
function buildSlots(date: Date, dur: number, isHome: boolean, now: Date): Slot[] {
  const buffer = isHome ? C.BUF_H : C.BUF_S;
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out: Slot[] = [];
  for (let m = C.OPEN; m + dur + buffer <= C.LAST_END + buffer && m + dur <= C.LAST_END; m += C.STEP) {
    out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  }
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

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div className="flex justify-between gap-4 text-sm"><span style={{ color: 'var(--mute)' }}>{label}</span><span className="font-semibold text-right">{value}</span></div>
);

/* ==========================================================================
   ESTILO (tokens + componentes)
   ========================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@400..800&display=swap');
.app{--bg:#F4EFE7;--surf:#FFFFFF;--surf2:#EBE4D8;--ink:#17151F;--mute:#5E5A6B;--line:rgba(23,21,31,.14);--acc:#3E3AAE;--onacc:#FFFFFF;--ring:rgba(62,58,174,.28);--ok:#0F7A55;--warn:#9A5B0C}
.app[data-theme=dark]{--bg:#0F0D16;--surf:#1A1726;--surf2:#262236;--ink:#F3EEE6;--mute:#B1AAC0;--line:rgba(243,238,230,.14);--acc:#F2B866;--onacc:#1B1204;--ring:rgba(242,184,102,.3);--ok:#5FD3A2;--warn:#F2B866}
.app{background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,sans-serif;min-height:100vh;transition:background .3s,color .3s}
.serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
.card{background:var(--surf);border:1px solid var(--line);border-radius:28px}
.btn{min-height:52px;padding:0 26px;border-radius:999px;font-weight:700;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;transition:transform .15s,opacity .2s}
.btn:active{transform:scale(.98)}
.btn-p{background:var(--acc);color:var(--onacc)}
.btn-p:disabled{background:var(--surf2);color:var(--mute);cursor:not-allowed}
.btn-g{border:1px solid var(--line);color:var(--ink);background:transparent}
.link{text-decoration:underline;text-underline-offset:4px;color:var(--acc);min-height:28px}
.chip{min-height:52px;border:1px solid var(--line);border-radius:18px;background:var(--surf);display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer;transition:background .2s,color .2s;position:relative}
.chip.on{background:var(--ink);color:var(--bg);border-color:var(--ink);font-weight:700}
.chip.off{opacity:.38;text-decoration:line-through;cursor:not-allowed}
.chip:has(input:focus-visible),.btn:focus-visible,button:focus-visible,a:focus-visible,input[type=checkbox]:focus-visible{outline:2px solid var(--acc);outline-offset:3px}
.inp{width:100%;min-height:54px;padding:0 18px;border-radius:18px;background:var(--surf);border:1px solid var(--line);color:var(--ink);font-size:16px}
.inp::placeholder{color:var(--mute)}
.inp:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--ring)}
.inp:disabled{opacity:.5}
.lbl{display:block;font-size:13px;font-weight:700;color:var(--mute);margin-bottom:10px}
.err{font-size:13px;color:#D6455D;margin-top:8px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;background:var(--surf)}
.seg button{min-height:34px;min-width:40px;padding:0 10px;border-radius:999px;font-size:12px;font-weight:800;color:var(--mute)}
.seg button[aria-pressed=true]{background:var(--ink);color:var(--bg)}
.orb{position:relative;width:min(78vw,300px);aspect-ratio:1;border-radius:50%;display:flex;align-items:center;justify-content:center;text-align:center;cursor:pointer}
.orb::before,.orb::after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,color-mix(in srgb,var(--acc) 70%,white),var(--acc) 48%,color-mix(in srgb,var(--acc) 0%,transparent) 74%);animation:breathe 7s ease-in-out infinite}
.orb::after{inset:-14%;opacity:.25;animation-delay:-3.5s;filter:blur(18px)}
.orb>*{position:relative;z-index:1;color:var(--onacc)}
@keyframes breathe{0%,100%{transform:scale(.93)}50%{transform:scale(1.05)}}
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
.hide-sb::-webkit-scrollbar{display:none}.hide-sb{scrollbar-width:none}
@media (prefers-reduced-motion:reduce){.orb::before,.orb::after{animation:none}*{transition:none!important;scroll-behavior:auto!important}}
`;

/* ==========================================================================
   MODAL LEGAL
   ========================================================================== */
function LegalModal({ doc, onClose, closeLabel, note }: { doc: DocId; onClose: () => void; closeLabel: string; note: string }) {
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
      const f = el.querySelectorAll<HTMLElement>('button, [tabindex]:not([tabindex="-1"])');
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
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(8,6,12,.7)' }} onClick={() => closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="legal-title" onClick={(e) => e.stopPropagation()} className="card w-full max-w-lg max-h-[88vh] flex flex-col" style={{ borderRadius: '28px 28px 0 0' }}>
        <div className="flex justify-between items-center gap-4 p-5" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 id="legal-title" className="serif text-xl">{d.title}</h2>
          <button type="button" onClick={() => closeRef.current()} className="btn btn-g" style={{ minHeight: 44 }}>{closeLabel}</button>
        </div>
        <div className="p-5 overflow-y-auto text-sm leading-relaxed" style={{ color: 'var(--mute)' }} tabIndex={0}>
          {note && <p className="mb-3 font-semibold" style={{ color: 'var(--ink)' }}>{note}</p>}
          {d.body}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   APP
   ========================================================================== */
interface Booking {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addons: Record<string, boolean>;
}

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    const s = store.get('thaly_lang') as Lang | null;
    if (s === 'pt' || s === 'en' || s === 'es') return s;
    const n = (typeof navigator !== 'undefined' ? navigator.language : 'pt').slice(0, 2);
    return n === 'en' || n === 'es' ? n : 'pt';
  });
  const [theme, setTheme] = useState<Theme>(() => {
    const s = store.get('thaly_theme');
    if (s === 'dark' || s === 'light') return s;
    try { return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  });
  const t = (k: string) => T[lang][k] ?? T.pt[k] ?? k;

  const [bStep, setBStep] = useState<1 | 2>(1);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [isReturning] = useState(() => store.get('thaly_returning_final') === 'yes');
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
    date: null, time: '', req: '', payment: '', packageId: PACKAGES[1].id, addons: {},
  });
  const set = (patch: Partial<Booking>) => setData((p) => ({ ...p, ...patch }));

  const bookRef = useRef<HTMLElement>(null);
  const numberRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (m: string) => {
    setToast(m);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3500);
  };
  const goBook = () => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  useEffect(() => { store.set('thaly_lang', lang); document.documentElement.lang = LOCALE[lang]; }, [lang]);
  useEffect(() => { store.set('thaly_theme', theme); }, [theme]);
  useEffect(() => { const i = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  useEffect(() => {
    const onScroll = () => {
      const r = bookRef.current?.getBoundingClientRect();
      setShowBar(window.scrollY > 420 && !!r && r.top > window.innerHeight * 0.55);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const pkg = useMemo(() => PACKAGES.find((p) => p.id === data.packageId) || PACKAGES[0], [data.packageId]);
  const pt = pkg.L[lang];
  const isHome = data.locType === 'home';
  const hasReq = reqOk && data.req.trim().length > 3;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOCALE[lang], o);

  useEffect(() => {
    if (data.packageId === 'aparo_solo' && data.addons.aparo) set({ addons: { ...data.addons, aparo: false } });
  }, [data.packageId, data.addons.aparo]);

  const invoice = useMemo(() => {
    let dur = pkg.min, addonsTotal = 0;
    const active: typeof ADDONS = [];
    ADDONS.forEach((a) => { if (data.addons[a.id]) { addonsTotal += a.price; active.push(a); if (a.id === 'time') dur += 30; } });
    const reqFee = hasReq ? C.REQ_FEE : 0;
    const base = pkg.price + addonsTotal + reqFee;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? C.PEAK_FEE : 0;
    let discount = 0;
    if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
    else if (!isReturning) discount = C.FIRST;
    discount = Math.min(discount, base);
    const after = base - discount;
    const pixDiscount = data.payment === 'pix' ? Math.ceil(after * C.PIX_DISC) : 0;
    const total = after - pixDiscount + peakFee;
    const sinal = Math.min(C.SIGNAL, total);
    return { base: pkg.price, addonsTotal, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, active };
  }, [data, pkg, isHome, isReturning, coupon.applied, coupon.value, hasReq]);

  const days = useMemo(() => {
    const out: { d: Date; i: number }[] = [];
    for (let i = 0; i < C.DAYS; i++) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); out.push({ d, i }); }
    return out;
  }, []);

  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.dur, isHome, now) : []), [data.date, invoice.dur, isHome, now]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';

  useEffect(() => {
    if (data.time && !slots.some((s) => s.t === data.time && s.ok)) set({ time: '' });
  }, [slots, data.time]);

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
  const step1Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  const applyCoupon = () => {
    const code = coupon.input.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const v = C.COUPONS[code] || 0;
    if (v > 0) { vibrate([20, 40]); setCoupon({ input: '', applied: code, value: v, error: '' }); showToast(t('couponOk')); }
    else { vibrate(50); setCoupon((c) => ({ ...c, error: t('couponBad') })); }
  };

  const copyPix = async () => {
    const ok = await copyText(C.PIX_KEY);
    showToast(ok ? t('pixCopied') : `Pix: ${C.PIX_KEY}`);
  };

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

  // A mensagem para o WhatsApp é sempre em português (idioma do terapeuta).
  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' }) : '';
    let loc: string;
    if (!isHome) loc = '📍 *Local:* Atendimento no meu espaço, região da Bela Vista/Centro Histórico. O endereço exato será enviado após a confirmação.';
    else {
      const full = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}, São Paulo`;
      loc = `📍 *Local:* Atendimento no seu endereço.\n*Endereço informado:* ${full}\n*Mapa:* https://maps.google.com/?q=${encodeURIComponent(full)}`;
    }
    const pk = pkg.L.pt;
    let m = `Oi Thalyson! Fechei pelo site e quero confirmar.\n\n*NOME:* ${clean(data.name)}\n`;
    m += `*DIA E HORA:* ${dStr} das ${data.time} às ${endTime}\n${loc}\n\n`;
    m += `*PACOTE (${invoice.dur} min):*\n✅ ${pk.title}\n`;
    invoice.active.forEach((a) => (m += `➕ ${T.pt[a.key]}\n`));
    if (hasReq) m += `\n*VONTADE ESPECÍFICA (consentimento dado no site):* "${clean(data.req)}"\n`;
    m += `\n*RESUMO DO PAGAMENTO:*\n*Valor Total:* ${money(invoice.total)} (${data.payment.toUpperCase()})\n`;
    m += `*Sinal (Pix agora):* ${money(invoice.sinal)}\n*Restante (depois da sessão):* ${money(invoice.rest)}\n\n`;
    m += '✅ Declaro ter 18 anos ou mais e ter lido a Política de Privacidade, os Termos e a Política de Cancelamento.\n';
    if (optIn) m += '🔔 Aceito receber lembretes e novidades por WhatsApp.\n';
    if (lang !== 'pt') m += `🌐 Idioma do cliente: ${lang === 'en' ? 'English' : 'Español'}\n`;
    m += '\n🎁 *Para a próxima:* tenho direito ao cupom SESSAO2 no meu próximo agendamento.\n\nAguardo sua resposta para mandar o comprovante do sinal!';
    return `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(m)}`;
  };

  const downloadICS = () => {
    if (!data.date || !data.time) return;
    const f = (d: Date, m: number) => `${dateKey(d).replace(/-/g, '')}T${fromMin(m).replace(':', '')}00`;
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

  const finish = () => {
    if (!ageOk) { vibrate(50); showToast(t('needAge')); return; }
    if (!data.payment) { vibrate(50); showToast(t('needPay')); return; }
    if (!data.date || !data.time) return;
    if (hp) { setDone(true); setSentLink('#'); return; } // honeypot
    const link = whatsappLink();
    store.set('thaly_returning_final', 'yes');
    setSentLink(link); vibrate([30, 50]);
    const w = window.open(link, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = link;
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const restart = () => {
    vibrate(15); setTouched(false); setReqOk(false); setAgeOk(false); setDone(false); setBStep(1);
    setData((p) => ({ ...p, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', addons: {} }));
    setTimeout(goBook, 50);
  };

  const quickBook = () => {
    if (!nextFree) return goBook();
    vibrate(20); set({ date: nextFree.d, time: nextFree.t, locType: 'studio' }); setBStep(1); goBook();
  };

  const dayName = (d: Date, i: number) => (i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmt(d, { weekday: 'short' }).replace('.', ''));

  return (
    <div className="app" data-theme={theme} style={{ paddingBottom: showBar ? 84 : 24 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <a href="#book" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[300] focus:px-4 focus:py-3 focus:rounded-xl" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>{t('book')}</a>

      {toast && <div role="status" aria-live="polite" className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full text-sm font-semibold max-w-[90vw] text-center shadow-xl" style={{ background: 'var(--ink)', color: 'var(--bg)' }}>{toast}</div>}

      {/* TOPO: idioma + tema */}
      <header className="sticky top-0 z-50" style={{ background: 'color-mix(in srgb,var(--bg) 85%,transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)' }}>
        <div className="max-w-5xl mx-auto px-5 py-3 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-3 min-w-0">
            <Avatar className="w-9 h-9 rounded-full" alt="" />
            <span className="serif text-lg truncate">Thalyson</span>
          </a>
          <div className="flex items-center gap-2">
            <div className="seg" role="group" aria-label={t('lang')}>
              {(['pt', 'en', 'es'] as Lang[]).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} onClick={() => { vibrate(10); setLang(l); }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('srLight') : t('srDark')} title={t('theme')} className="btn btn-g" style={{ minHeight: 42, width: 42, padding: 0 }}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="max-w-5xl mx-auto px-5">
        {/* HERO */}
        <section className="pt-10 pb-14 grid md:grid-cols-[1.15fr_.85fr] gap-10 items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-semibold mb-6 px-4 py-2 rounded-full" style={{ border: '1px solid var(--line)', background: 'var(--surf)' }}>
              <Icon name="map" size={16} className="" /> {t('badge')}
            </p>
            <h1 className="serif font-light leading-[1.02] mb-6" style={{ fontSize: 'clamp(44px,9vw,84px)', letterSpacing: '-0.02em' }}>{t('h1')}</h1>
            <p className="text-lg leading-relaxed mb-8 max-w-md" style={{ color: 'var(--mute)' }}>{t('sub')}</p>
            <div className="flex flex-wrap gap-3 mb-3">
              <button type="button" onClick={goBook} className="btn btn-p" style={{ minHeight: 58, padding: '0 32px' }}>{t('cta')}</button>
              <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 58 }}><Icon name="star" size={18} /> {t('reviews')}</a>
            </div>
            <p className="text-sm" style={{ color: 'var(--mute)' }}>{t('from_')} {money(Math.min(...PACKAGES.map((p) => p.price)))} · {t('t1').toLowerCase()}</p>
          </div>
          <div className="flex justify-center py-6">
            <button type="button" className="orb" onClick={quickBook} aria-label={nextFree ? `${t('next')}: ${nextFree.k === 0 ? t('today') : nextFree.k === 1 ? t('tomorrow') : fmt(nextFree.d, { weekday: 'long' })} ${nextFree.t}` : t('cta')}>
              <span>
                <span className="block text-sm font-semibold opacity-80">{t('next')}</span>
                <span className="serif block text-5xl font-light my-1">{nextFree ? nextFree.t : '--:--'}</span>
                <span className="block text-sm font-bold">{nextFree ? (nextFree.k === 0 ? t('today') : nextFree.k === 1 ? t('tomorrow') : fmt(nextFree.d, { weekday: 'long', day: 'numeric' })) : ''}</span>
                <span className="block text-xs mt-3 opacity-80">{t('tapBook')}</span>
              </span>
            </button>
          </div>
        </section>

        {/* CONFIANÇA */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-20" aria-label="Garantias">
          {[['t1', 't1d', 'lock'], ['t2', 't2d', 'shield'], ['t3', 't3d', 'chat'], ['t4', 't4d', 'star']].map(([a, b, ic]) => (
            <div key={a} className="card p-5" style={{ borderRadius: 22 }}>
              <Icon name={ic as IconName} size={22} className="mb-3" />
              <p className="font-bold text-sm mb-1">{t(a)}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--mute)' }}>{t(b)}</p>
            </div>
          ))}
        </section>

        {/* PACOTES */}
        <section className="mb-20" aria-labelledby="pk">
          <h2 id="pk" className="serif text-4xl font-light mb-2">{t('pkgH')}</h2>
          <p className="mb-8" style={{ color: 'var(--mute)' }}>{t('pkgS')}</p>
          <div className="grid md:grid-cols-2 gap-4">
            {PACKAGES.map((p) => {
              const on = data.packageId === p.id;
              const L = p.L[lang];
              return (
                <article key={p.id} className="card p-6 flex flex-col" style={on ? { borderColor: 'var(--acc)', boxShadow: '0 0 0 2px var(--acc)' } : undefined}>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="serif text-2xl leading-tight">{L.title}</h3>
                    <p className="serif text-2xl shrink-0" style={{ color: 'var(--acc)' }}>{money(p.price)}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1" style={{ background: 'var(--ink)', color: 'var(--bg)' }}><Icon name="clock" size={12} /> {p.min} {t('min')}</span>
                    {L.tags.map((g) => <span key={g} className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--surf2)' }}>{g}</span>)}
                  </div>
                  <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--mute)' }}>{L.desc}</p>
                  <button type="button" aria-pressed={on} onClick={() => { vibrate(15); set({ packageId: p.id }); goBook(); }} className={`btn ${on ? 'btn-p' : 'btn-g'}`}>
                    {on && <Icon name="check" size={16} />} {on ? t('picked') : t('pick')}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        {/* COMO FUNCIONA (sequência real) */}
        <section className="mb-20" aria-labelledby="how">
          <h2 id="how" className="serif text-4xl font-light mb-8">{t('howH')}</h2>
          <ol className="grid md:grid-cols-3 gap-4">
            {[['h1t', 'h1d'], ['h2t', 'h2d'], ['h3t', 'h3d']].map(([a, b], i) => (
              <li key={a} className="card p-6">
                <span className="serif text-5xl font-light" style={{ color: 'var(--acc)' }}>{i + 1}</span>
                <p className="font-bold mt-3 mb-1">{t(a)}</p>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--mute)' }}>{t(b)}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* SOBRE */}
        <section className="mb-20 card p-6 md:p-10 grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <Avatar className="w-28 h-28 rounded-full" alt="Thalyson" />
          <div>
            <h2 className="serif text-3xl font-light mb-1">{t('aboutH')}</h2>
            <p className="text-sm font-bold mb-4" style={{ color: 'var(--acc)' }}>{t('aboutR')}</p>
            <p className="leading-relaxed mb-3" style={{ color: 'var(--mute)' }}>{t('about1')}</p>
            <p className="flex items-start gap-3 text-sm leading-relaxed mb-5"><Icon name="map" size={18} className="mt-0.5" />{t('about2')}</p>
            <div className="flex flex-wrap gap-3">
              <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 44 }}><Icon name="instagram" size={18} /> Instagram</a>
              <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer" className="btn btn-g" style={{ minHeight: 44 }}><Icon name="star" size={18} /> {t('reviews')}</a>
            </div>
          </div>
        </section>

        {/* AGENDAMENTO */}
        <section id="book" ref={bookRef} className="scroll-mt-20 max-w-xl mx-auto" aria-labelledby="bk">
          {done ? (
            <div className="card p-8 text-center">
              <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)', color: 'var(--ok)' }}><Icon name="check" size={32} /></div>
              <h2 id="bk" className="serif text-4xl font-light mb-4">{t('doneH')}</h2>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--mute)' }}>{t('doneP')}</p>
              <p className="text-sm font-bold mb-8" style={{ color: 'var(--acc)' }}>{t('doneSig')} ({money(invoice.sinal)})</p>
              <div className="space-y-3">
                <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-p w-full">{t('resend')}</a>
                <button type="button" onClick={copyPix} className="btn btn-g w-full"><Icon name="copy" size={16} /> {t('copyPix')}</button>
                <button type="button" onClick={downloadICS} className="btn btn-g w-full"><Icon name="cal" size={16} /> {t('addCal')}</button>
                <button type="button" onClick={restart} className="w-full min-h-[48px] text-sm underline underline-offset-4" style={{ color: 'var(--mute)' }}>{t('restart')}</button>
              </div>
            </div>
          ) : (
            <div className="card p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 id="bk" className="serif text-3xl font-light">{t('bookH')}</h2>
                <div className="flex gap-2 items-center" role="progressbar" aria-valuemin={1} aria-valuemax={2} aria-valuenow={bStep} aria-label={`${t('step')} ${bStep} ${t('of')} 2`}>
                  {[1, 2].map((i) => <span key={i} className="h-1.5 rounded-full transition-all" style={{ width: bStep >= i ? 28 : 10, background: bStep >= i ? 'var(--acc)' : 'var(--line)' }} />)}
                </div>
              </div>

              {/* seletor rápido de pacote */}
              <div className="flex gap-2 overflow-x-auto hide-sb -mx-6 px-6 pb-3 mb-6" role="radiogroup" aria-label={t('pkgH')}>
                {PACKAGES.map((p) => {
                  const on = data.packageId === p.id;
                  return (
                    <button key={p.id} type="button" role="radio" aria-checked={on} onClick={() => { vibrate(15); set({ packageId: p.id }); }} className={`chip shrink-0 px-4 text-sm ${on ? 'on' : ''}`} style={{ minHeight: 46 }}>
                      {p.L[lang].title} <span className="ml-2 opacity-70">{money(p.price)}</span>
                    </button>
                  );
                })}
              </div>

              {bStep === 1 && (
                <div className="space-y-8">
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
                        <label key={id} className={`chip text-sm px-3 ${data.locType === id ? 'on' : ''}`}>
                          <input type="radio" name="location" value={id} checked={data.locType === id} onChange={() => set({ locType: id })} className="sr-only" />{label}
                        </label>
                      ))}
                    </div>
                    {isHome && <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--mute)' }}>{t('peakNote')}</p>}
                  </fieldset>

                  {!isHome ? (
                    <p className="text-sm leading-relaxed p-5 rounded-2xl" style={{ background: 'var(--surf2)' }}>{t('studioInfo')}</p>
                  ) : (
                    <div className="space-y-3">
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
                    <div className="flex gap-3 overflow-x-auto py-2 hide-sb -mx-6 px-6 snap-x">
                      {days.map(({ d, i }) => {
                        const sel = sameDay(data.date, d);
                        return (
                          <label key={dateKey(d)} className={`chip shrink-0 snap-start flex-col py-3 ${sel ? 'on' : ''}`} style={{ width: 76 }}>
                            <input type="radio" name="date" value={dateKey(d)} checked={sel} aria-label={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} onChange={() => set({ date: d, time: '' })} className="sr-only" />
                            <span aria-hidden="true" className="text-xs font-bold capitalize">{dayName(d, i)}</span>
                            <span aria-hidden="true" className="serif text-3xl font-light">{d.getDate()}</span>
                            <span aria-hidden="true" className="text-xs opacity-70">{fmt(d, { month: 'short' }).replace('.', '')}</span>
                          </label>
                        );
                      })}
                    </div>
                    {touched && errors.date && <p className="err" role="alert">{errors.date}</p>}
                  </fieldset>

                  {data.date && (
                    <fieldset className="min-w-0">
                      <legend className="sr-only">{t('time')}</legend>
                      <div className="flex justify-between items-baseline mb-3">
                        <span aria-hidden="true" className="lbl" style={{ marginBottom: 0 }}>{t('time')}</span>
                        <span className="text-xs" style={{ color: 'var(--mute)' }}>{t('session')} {invoice.dur} {t('min')}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {slots.map(({ t: tm, ok }) => {
                          const sel = data.time === tm;
                          const peak = isHome && PEAK_HOURS.includes(tm);
                          return (
                            <label key={tm} className={`chip flex-col py-3 ${sel ? 'on' : ''} ${!ok ? 'off' : ''}`}>
                              <input type="radio" name="time" value={tm} checked={sel} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} onChange={() => { vibrate(15); set({ time: tm }); }} className="sr-only" />
                              <span aria-hidden="true" className="text-sm font-semibold">{tm}</span>
                              {peak && ok && <span aria-hidden="true" className="text-[11px] font-bold" style={{ color: sel ? 'inherit' : 'var(--warn)' }}>{t('peak')} +{C.PEAK_FEE}</span>}
                            </label>
                          );
                        })}
                      </div>
                      {availableCount === 0 && <p className="text-sm text-center py-5" style={{ color: 'var(--mute)' }}>{t('noSlots')}</p>}
                      <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('demo')}</p>
                      {data.time && <p className="text-sm font-semibold mt-4 flex items-center gap-2" style={{ color: 'var(--ok)' }}><Icon name="check" size={16} /> {t('from')} {data.time} {t('to')} {endTime}</p>}
                      {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                    </fieldset>
                  )}

                  <button type="button" className="btn btn-p w-full" onClick={() => { if (step1Valid) { vibrate(30); setBStep(2); goBook(); } else { vibrate(50); setTouched(true); showToast(t('fill')); } }}>{t('review')}</button>
                </div>
              )}

              {bStep === 2 && (
                <div className="space-y-8">
                  <div className="p-5 rounded-2xl space-y-3" style={{ background: 'var(--surf2)' }}>
                    <Row label={t('sPack')} value={pt.title} />
                    <Row label={t('sDate')} value={data.date ? fmt(data.date, { weekday: 'long', day: '2-digit', month: 'long' }) : ''} />
                    <Row label={t('sTime')} value={`${data.time} – ${endTime}`} />
                    <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number}` : t('sLocStudio')} />
                    <button type="button" onClick={() => setBStep(1)} className="link text-sm">{t('change')}</button>
                  </div>

                  <fieldset className="min-w-0">
                    <legend className="lbl">{t('addons')}</legend>
                    <div className="flex flex-col gap-3">
                      {ADDONS.filter((a) => !(data.packageId === 'aparo_solo' && a.id === 'aparo')).map((a) => {
                        const on = !!data.addons[a.id];
                        return (
                          <label key={a.id} className={`chip justify-between px-5 text-sm gap-3 ${on ? 'on' : ''}`} style={{ textAlign: 'left' }}>
                            <input type="checkbox" checked={on} onChange={() => { vibrate(15); set({ addons: { ...data.addons, [a.id]: !on } }); }} className="sr-only" />
                            <span className="flex items-center gap-3"><span aria-hidden="true" className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ border: '1.5px solid currentColor' }}>{on && <Icon name="check" size={14} />}</span>{t(a.key)}</span>
                            <span className="font-bold shrink-0">+ {money(a.price)}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div>
                    <p className="lbl">{t('reqQ')}</p>
                    <div className="flex items-start gap-3 text-xs leading-relaxed mb-3">
                      <input id="req-ok" type="checkbox" checked={reqOk} onChange={(e) => { setReqOk(e.target.checked); if (!e.target.checked) set({ req: '' }); }} className="mt-0.5 w-5 h-5 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                      <p style={{ color: 'var(--mute)' }}><label htmlFor="req-ok" className="cursor-pointer">{t('reqConsent')} </label><button type="button" className="link" onClick={() => setDoc('privacy')}>{t('learn')}</button></p>
                    </div>
                    <label htmlFor="rq" className="sr-only">{t('reqPh')}</label>
                    <input id="rq" type="text" disabled={!reqOk} placeholder={t('reqPh')} maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} className="inp" />
                    <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('reqNote')}</p>
                  </div>

                  <fieldset className="min-w-0">
                    <legend className="lbl">{t('pay')}</legend>
                    <div className="grid grid-cols-3 gap-3">
                      {([['pix', t('pix')], ['card', t('card')], ['cash', t('cash')]] as const).map(([id, label]) => (
                        <label key={id} className={`chip text-xs font-semibold px-2 ${data.payment === id ? 'on' : ''}`}>
                          <input type="radio" name="payment" value={id} checked={data.payment === id} onChange={() => { vibrate(15); set({ payment: id }); }} className="sr-only" />{label}
                        </label>
                      ))}
                    </div>
                    {data.payment === 'card' && <p className="text-xs mt-3" style={{ color: 'var(--mute)' }}>{t('cardNote')}</p>}
                  </fieldset>

                  {!coupon.applied && (
                    <div>
                      <label htmlFor="cp" className="lbl">{t('couponQ')}</label>
                      <div className="flex gap-2">
                        <input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className="inp uppercase flex-1" aria-describedby={coupon.error ? 'cp-err' : undefined} />
                        <button type="button" onClick={applyCoupon} className="btn btn-g">{t('apply')}</button>
                      </div>
                      {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                    </div>
                  )}

                  {/* TOTAL */}
                  <div className="p-5 rounded-2xl" style={{ border: '1px solid var(--line)' }}>
                    <div className="space-y-3 mb-5">
                      <Row label={t('lPack')} value={money(invoice.base)} />
                      {invoice.addonsTotal > 0 && <Row label={t('lAddons')} value={`+${money(invoice.addonsTotal)}`} />}
                      {invoice.reqFee > 0 && <Row label={t('lReq')} value={`+${money(invoice.reqFee)}`} />}
                      {invoice.discount > 0 && <div className="flex justify-between text-sm font-bold" style={{ color: 'var(--ok)' }}><span>{coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')}</span><span>-{money(invoice.discount)}</span></div>}
                      {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                      {invoice.pixDiscount > 0 && <div className="flex justify-between text-sm font-bold" style={{ color: 'var(--ok)' }}><span>{t('lPix')}</span><span>-{money(invoice.pixDiscount)}</span></div>}
                    </div>
                    <div className="flex justify-between items-end pt-4" style={{ borderTop: '1px solid var(--line)' }}>
                      <span className="text-sm" style={{ color: 'var(--mute)' }}>{t('total')}</span>
                      <span className="serif text-5xl font-light">{money(invoice.total)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-4 text-center text-sm">
                      <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('signal')}</p><p className="font-extrabold" style={{ color: 'var(--acc)' }}>{money(invoice.sinal)}</p></div>
                      <div className="rounded-2xl p-3" style={{ background: 'var(--surf2)' }}><p className="text-xs" style={{ color: 'var(--mute)' }}>{t('rest')}</p><p className="font-extrabold">{money(invoice.rest)}</p></div>
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl text-center" style={{ background: 'color-mix(in srgb,var(--acc) 12%,transparent)', border: '1px solid color-mix(in srgb,var(--acc) 35%,transparent)' }}>
                    <p className="text-sm leading-relaxed">{t('sigA')} <strong>{money(invoice.sinal)}</strong> {t('sigB')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.</p>
                    <button type="button" onClick={copyPix} className="link mx-auto mt-3 inline-flex items-center gap-2 text-sm font-bold min-h-[44px]"><Icon name="copy" size={16} /> {t('copyPix')}</button>
                  </div>

                  <label className="flex items-start gap-3 text-sm leading-relaxed cursor-pointer" style={{ color: 'var(--mute)' }}>
                    <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} className="mt-1 w-5 h-5 shrink-0" style={{ accentColor: 'var(--acc)' }} /><span>{t('optIn')}</span>
                  </label>

                  <div className="flex items-start gap-3 text-sm leading-relaxed">
                    <input id="age-ok" type="checkbox" checked={ageOk} onChange={(e) => setAgeOk(e.target.checked)} className="mt-1 w-5 h-5 shrink-0 cursor-pointer" style={{ accentColor: 'var(--acc)' }} />
                    <p><label htmlFor="age-ok" className="cursor-pointer">{t('ageA')} </label>
                      <button type="button" className="link" onClick={() => setDoc('privacy')}>{t('privacy')}</button>, <button type="button" className="link" onClick={() => setDoc('terms')}>{t('terms')}</button> {t('and')} <button type="button" className="link" onClick={() => setDoc('refund')}>{t('refund')}</button>.</p>
                  </div>

                  <div className="flex gap-3">
                    <button type="button" onClick={() => setBStep(1)} className="btn btn-g" style={{ width: '30%' }}>{t('back')}</button>
                    <button type="button" onClick={finish} disabled={!data.payment || !ageOk} className="btn btn-p flex-1 text-center" style={{ minHeight: 58 }}>
                      {!ageOk ? t('needAge') : !data.payment ? t('needPay') : t('send')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* RODAPÉ LEGAL */}
      <footer className="max-w-xl mx-auto px-6 mt-16 pt-6 text-xs leading-relaxed text-center" style={{ borderTop: '1px solid var(--line)', color: 'var(--mute)' }}>
        <nav aria-label="Legal" className="flex flex-wrap justify-center gap-x-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <button key={id} type="button" onClick={() => setDoc(id)} className="underline underline-offset-4 min-h-[44px] px-2">{t(k)}</button>
          ))}
        </nav>
        <p className="mt-2">{LEGAL.RAZAO} · CNPJ {LEGAL.CNPJ}<br />{LEGAL.ENDERECO}<br />{LEGAL.EMAIL}</p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
      </footer>

      {/* BARRA FIXA DE CONVERSÃO */}
      {showBar && !done && (
        <div className="bar">
          <div className="max-w-xl mx-auto flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs truncate" style={{ color: 'var(--mute)' }}>{pt.title}</p>
              <p className="serif text-2xl leading-none">{money(pkg.price)}</p>
            </div>
            <button type="button" onClick={goBook} className="btn btn-p">{t('cta')}</button>
          </div>
        </div>
      )}

      {doc && <LegalModal doc={doc} onClose={() => setDoc(null)} closeLabel={t('close')} note={t('legalNote')} />}
    </div>
  );
}
