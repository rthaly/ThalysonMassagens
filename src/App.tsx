import {
  useState, useEffect, useMemo, useRef, useCallback, useContext, createContext, useId, memo, forwardRef, cloneElement, isValidElement,
  type ReactNode, type ReactElement, type CSSProperties,
  type ButtonHTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type HTMLAttributes,
} from 'react';

/* ================================================================== */
/*  CONFIGURAÇÃO CENTRAL                                               */
/* ================================================================== */
const SITE_NAME = 'Relaxar hoje com Thalyson';
const LEGAL = {
  RAZAO: 'Thalyson Rodrigo dos Santos',
  CNPJ: '62.922.530/0001-44',
  ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo - SP',
  EMAIL: 'relaxecomthalyson@gmail.com',
  ENCARREGADO: 'Thalyson Rodrigo dos Santos',
  ATUALIZADO: '18/11/2026',
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
type Ref<E> = { current: E | null };

const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const LANG_NAME: Record<Lang, string> = { pt: 'Português', en: 'English', es: 'Español' };

/* ================================================================== */
/*  TEXTOS (PT / EN / ES)                                              */
/* ================================================================== */
const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando um ambiente reservado para você', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Atendimento masculino individual em São Paulo. Você escolhe a sessão, reserva em 1 minuto e confirma direto comigo no WhatsApp.', w1: 'Sem sala de espera ou filas', w2: 'Reserva com sinal de R$ 40', w3: 'Sigilo e higiene total',
    enter: 'Ver sessões e horários', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'Desligue a cabeça. Solte o corpo.', sub: 'Uma hora inteira dedicada a tirar o peso da sua rotina, sem pressa e com total privacidade perto do metrô Anhangabaú.',
    cta: 'Escolher minha sessão', reviews: 'Avaliações', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Sessões a partir de',
    t1: 'Sinal de R$ 40 para travar a agenda; o resto só depois da sessão', t2: 'Remarcação ou reembolso grátis avisando até 12h antes', t3: 'R$ 15 de desconto automático na sua primeira sessão',
    offH: 'Mais vantagem na sua visita', offS: 'Resolva o cansaço e o visual no mesmo horário ou garanta sessões com desconto.',
    cbT: 'Massagem + aparo de pelos', cbD: 'Saia relaxado e alinhado na mesma visita, economizando até R$ 70.', lyT: 'Pacote 5 sessões (pague 4)', lyD: 'A 5ª sessão sai de graça para você manter o corpo leve o mês inteiro.', see: 'Aproveitar',
    s1: 'Qual sensação você busca hoje?', s2: 'Quer adicionar alguma vantagem?', s3: 'Dia, horário e local', s4: 'Confira e envie no WhatsApp', min: 'min', flowH: 'Como acontece na prática',
    oSingle: 'Apenas esta sessão', oSingleD: 'Sem compromisso, com R$ 15 off na primeira vez.', oCombo: 'Com aparo de pelos', oComboD: 'Inclui aparo na máquina em até 3 regiões no mesmo horário.', oPack: 'Pacote 5 sessões (1 grátis)', oPackD: 'Pague 4 e ganhe a 5ª. Você tem {n} dias para usar.',
    save: 'Economia de', was: 'De', listen: 'Ouvir como funciona', pause: 'Pausar áudio', resume: 'Continuar áudio', stopA: 'Parar',
    voiceLow: 'Modo de voz adaptado para este aparelho', noTts: 'Seu navegador não tem suporte para áudio.',
    skip: 'Ir para o conteúdo', guar: 'Garantias', legalNav: 'Documentos legais',
    packNote: 'O pacote já tem o maior desconto possível, por isso não soma com cupons. Você agenda a 1ª sessão agora e combina as outras 4 direto comigo pelo WhatsApp.',
    name: 'Como prefere ser chamado?', namePh: 'Seu primeiro nome ou apelido', nameErr: 'Digite pelo menos 3 letras.', place: 'Onde vai ser a sessão?', studio: 'Na minha suíte (Bela Vista)', home: 'No seu endereço (SP)',
    peakNote: 'Para atender no seu endereço nos horários de trânsito intenso, há taxa de R$ 18. Digite o CEP para preencher a rua.',
    studioInfo: 'Atendo sozinho em uma suíte reservada e climatizada na Bela Vista, a poucos passos do Metrô Anhangabaú. Assim que confirmar, te mando a localização exata.',
    cep: 'CEP', street: 'Rua ou Avenida', number: 'Nº', comp: 'Apto / Bloco', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha os campos abaixo.',
    date: 'Escolha o dia', time: 'Horário de início', session: 'Duração:', peak: 'Pico', noSlots: 'Agenda cheia neste dia. Escolha outra data acima.',
    demo: 'Horários sujeitos a confirmação rápida no WhatsApp.', dateErr: 'Escolha um dia.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'ocupado',
    cont: 'Revisar agendamento', fill: 'Preencha os campos marcados acima', change: 'Alterar', sPack: 'Sessão', sWhen: 'Data e hora', sLoc: 'Local', sLocStudio: 'Suíte Bela Vista (Centro)',
    lPack: 'Sessão escolhida', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Aparo de pelos (combo)', lTime: '+30 minutos extras', lReq: 'Pedido específico', lFirst: 'Desconto 1ª sessão', lCoupon: 'Cupom aplicado', lPeak: 'Deslocamento / trânsito', lPix: 'Desconto Pix (3%)',
    saved: 'Você está economizando', total: 'Valor final', signal: 'Sinal agora (Pix)', rest: 'Depois da sessão',
    extras: 'Adicionar mais tempo ou cupom', couponQ: 'Tem um cupom?', couponPh: 'Digite o código', apply: 'Aplicar', couponOk: 'Desconto aplicado', couponBad: 'Cupom inválido ou expirado.',
    reqQ: 'Algum pedido específico? (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Autorizo enviar este pedido específico apenas para avaliação no WhatsApp. Ele não fica salvo no site.',
    reqPh: 'Escreva o que você gostaria de incluir', reqNote: 'Avalio na hora; se não for possível realizar, não cobro nada a mais.',
    pay: 'Como vai pagar o restante depois?', pix: 'Pix (-3%)', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'Passamos a maquininha na hora; as taxas de parcelamento te informo antes no WhatsApp.',
    optIn: 'Quero receber avisos de horários livres e promoções no WhatsApp.',
    ageA: 'Confirmo ter 18 anos ou mais e concordo com a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e', refund: 'Regras de Cancelamento',
    sigA: 'Para travar esse horário só para você, envie o sinal de', sigB: 'via Pix. O restante você paga só depois de sair da maca.', copyPix: 'Copiar chave Pix (CNPJ)', pixCopied: 'Chave Pix copiada!',
    send: 'Confirmar no WhatsApp', needPay: 'Escolha como vai pagar o restante', needAge: 'Confirme que tem 18 anos ou mais',
    doneH: 'Pedido pronto!', doneP: 'Agora é só mandar a mensagem que abriu no seu WhatsApp e enviar o comprovante dos R$ 40 para eu travar sua hora.',
    doneSig: 'Chave Pix (CNPJ):', resend: 'Abrir WhatsApp novamente', addCal: 'Salvar na minha agenda', restart: 'Fazer outro agendamento',
    chatQ: 'Ficou com alguma dúvida antes de marcar?', chatBtn: 'Me chama direto no WhatsApp', chatMsg: 'Oi Thalyson! Vi seu site e queria tirar uma dúvida sobre a massagem.',
    aboutH: 'Thalyson • Bela Vista, SP', aboutR: 'Atendimento direto, sem intermediários', about1: 'Meu foco é simples: fazer você entrar carregado de tensão e sair leve, renovado e com a mente limpa. Sem frescura, sem roteiro engessado e respeitando o ritmo do seu corpo.',
    about2: 'Atendo sozinho em suíte privada na Bela Vista (pertinho do metrô Anhangabaú), com ducha quente, toalhas limpas e climatização.', seeProfile: 'Conhecer meu trabalho',
    faqH: 'Perguntas frequentes', q1: 'Por que preciso pagar R$ 40 de sinal?', a1: 'Como atendo sozinho com hora marcada e bloqueio a agenda inteira para você, o sinal garante que o horário não fique vago. Esse valor é descontado do total e você paga o resto só no final.',
    q2: 'E se acontecer um imprevisto?', a2: 'Avisando até 12 horas antes, eu devolvo seus R$ 40 na hora ou remarco para o dia que ficar melhor para você.', q3: 'Meus dados ficam expostos?', a3: 'De jeito nenhum. Não peço CPF, e-mail nem cadastro no site. Tudo é combinado direto comigo no WhatsApp com total discrição.',
    q4: 'Posso tomar banho no local?', a4: 'Sim, a suíte conta com ducha quente e toalhas higienizadas para você usar antes e depois da sessão.',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento', footCookies: 'Cookies', adults: 'Atendimento exclusivo para maiores de 18 anos.',
    close: 'Fechar', theme: 'Mudar cor da tela', lang: 'Idioma', srLight: 'Mudar para tema claro', srDark: 'Mudar para tema escuro', legalNote: '',
    profile: 'Sobre o atendimento', openProfile: 'Ver perfil de Thalyson', gm: 'Bom dia', ga: 'Boa tarde', gn: 'Boa noite',
    pBul1: 'Conversa rápida antes de começar para saber onde seu corpo pede mais atenção', pBul2: 'Horário exclusivo: você não cruza com ninguém na entrada ou saída', pBul3: 'Suíte reservada com ducha quente, maca confortável e climatização',
    pHours: 'Horários', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Pagamento', pPayV: 'Pix (3% de desconto), cartão até 12x ou dinheiro',
    pWhere: 'Local', pWhereV: 'Bela Vista (próximo ao metrô Anhangabaú) ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis avisando até 12h antes',
    pForget: 'Limpar meus dados deste aparelho', forgot: 'Pronto, dados apagados.',
    recommended: 'Mais pedida hoje', smartSub: 'Que bom te ver de volta. Escolha seu horário para relaxar.', lastSlots: 'Últimos horários livres para hoje',
  },
  en: {
    loadMsg: 'Preparing a private space for you', badge: 'Bela Vista, Downtown São Paulo',
    wSub: 'Private men’s massage in São Paulo. Pick your session, book in 1 minute and confirm directly with me on WhatsApp.', w1: 'No waiting rooms or crowds', w2: 'Only R$ 40 deposit to lock time', w3: 'Total privacy and hygiene',
    enter: 'See sessions and times', needAgeEnter: 'Confirm you are 18 or older',
    h1: 'Turn off your mind. Release your body.', sub: 'A full hour dedicated to taking the weight off your routine, unhurried and completely private near Anhangabaú metro.',
    cta: 'Choose my session', reviews: 'Reviews', nextFree: 'Next open slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Sessions starting at',
    t1: 'R$ 40 deposit to lock your slot; pay the rest after the session', t2: 'Free rescheduling or refund up to 12h in advance', t3: 'Automatic R$ 15 discount on your first session',
    offH: 'More value on your visit', offS: 'Take care of muscle tension and grooming in one visit, or save with a pack.',
    cbT: 'Massage + body trimming', cbD: 'Leave relaxed and groomed in the same visit, saving up to R$ 70.', lyT: '5-session pack (pay for 4)', lyD: 'Your 5th session is free so you can stay loose all month.', see: 'See option',
    s1: 'What are you looking for today?', s2: 'Want to add extra value?', s3: 'Day, time and location', s4: 'Review and send on WhatsApp', min: 'min', flowH: 'How the session works',
    oSingle: 'Single session only', oSingleD: 'No commitment, with R$ 15 off your first visit.', oCombo: 'With body trimming', oComboD: 'Includes machine trimming on up to 3 areas during the visit.', oPack: '5-session pack (1 free)', oPackD: 'Pay for 4 and get the 5th free. Valid for {n} days.',
    save: 'You save', was: 'Was', listen: 'Listen to how it works', pause: 'Pause audio', resume: 'Resume audio', stopA: 'Stop',
    voiceLow: 'Adapted voice mode for this device', noTts: 'Your browser does not support audio narration.',
    skip: 'Skip to content', guar: 'Guarantees', legalNav: 'Legal documents',
    packNote: 'The pack already gives the deepest discount, so coupons do not stack. Book your 1st session now and schedule the other 4 directly on WhatsApp.',
    name: 'What should I call you?', namePh: 'Your first name', nameErr: 'Enter at least 3 letters.', place: 'Where will the session take place?', studio: 'At my private suite (Bela Vista)', home: 'At your address (SP)',
    peakNote: 'Outcalls during heavy traffic hours carry an R$ 18 fee. Enter your ZIP code to fill the street.',
    studioInfo: 'I work solo in a private, air-conditioned suite in Bela Vista, steps from Anhangabaú metro. Once confirmed, I send the exact address.',
    cep: 'ZIP code', street: 'Street or Avenue', number: 'No.', comp: 'Apt / Unit', bairro: 'Neighborhood', addrErr: 'Fill in street, number and neighborhood.', cepFail: 'ZIP code not found. Fill in manually.',
    date: 'Choose a day', time: 'Start time', session: 'Duration:', peak: 'Peak', noSlots: 'Fully booked on this day. Pick another date above.',
    demo: 'Times subject to quick confirmation on WhatsApp.', dateErr: 'Choose a day.', timeErr: 'Choose a time.', from: 'From', to: 'to', unavailable: 'booked',
    cont: 'Review booking', fill: 'Fill in the highlighted fields above', change: 'Change', sPack: 'Session', sWhen: 'Date & time', sLoc: 'Location', sLocStudio: 'Bela Vista Suite (Downtown)',
    lPack: 'Chosen session', lPack5: '5-session pack (4 paid)', lCombo: 'Body trimming (combo)', lTime: '+30 extra minutes', lReq: 'Specific request', lFirst: '1st session discount', lCoupon: 'Coupon applied', lPeak: 'Travel / traffic', lPix: 'Pix discount (3%)',
    saved: 'You are saving', total: 'Final total', signal: 'Deposit now (Pix)', rest: 'After the session',
    extras: 'Add extra time or coupon', couponQ: 'Have a coupon?', couponPh: 'Enter code', apply: 'Apply', couponOk: 'Discount applied', couponBad: 'Invalid or expired coupon.',
    reqQ: 'Any specific request? (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to sending this specific request for evaluation on WhatsApp only. It is not saved on the site.',
    reqPh: 'Write what you would like to include', reqNote: 'Evaluated on the spot; if not feasible, nothing extra is charged.',
    pay: 'How will you pay the rest after?', pix: 'Pix (-3%)', card: 'Card up to 12x', cash: 'Cash', cardNote: 'Card machine available on site; installment fees shared beforehand on WhatsApp.',
    optIn: 'I want updates on open slots and offers on WhatsApp.',
    ageA: 'I confirm I am 18 or older and agree to the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and', refund: 'Cancellation Rules',
    sigA: 'To lock this time exclusively for you, send the', sigB: 'deposit via Pix. Pay the rest only after the session.', copyPix: 'Copy Pix key (CNPJ)', pixCopied: 'Pix key copied!',
    send: 'Confirm on WhatsApp', needPay: 'Choose how you will pay the rest', needAge: 'Confirm you are 18 or older',
    doneH: 'Request ready!', doneP: 'Just send the message that opened in WhatsApp along with your R$ 40 deposit receipt so I can lock your time.',
    doneSig: 'Pix Key (CNPJ):', resend: 'Open WhatsApp again', addCal: 'Save to my calendar', restart: 'Make another booking',
    chatQ: 'Have a question before booking?', chatBtn: 'Message me on WhatsApp', chatMsg: 'Hi Thalyson! I saw your site and have a quick question about the massage.',
    aboutH: 'Thalyson • Bela Vista, SP', aboutR: 'Direct service, no middlemen', about1: 'My goal is straightforward: have you walk in carrying tension and walk out light, renewed and clear-headed. No rigid scripts, always respecting your body’s pace.',
    about2: 'I work solo in a private suite in Bela Vista (near Anhangabaú metro), with a hot shower, fresh towels and climate control.', seeProfile: 'About my work',
    faqH: 'Common questions', q1: 'Why do I need a R$ 40 deposit?', a1: 'Since I work solo by appointment and block the entire slot for you, the deposit ensures the time isn’t left empty. It is deducted from your total and you pay the rest at the end.',
    q2: 'What if something comes up?', a2: 'Let me know at least 12 hours ahead and I refund your R$ 40 immediately or reschedule at no cost.', q3: 'Is my data kept private?', a3: 'Completely. No ID, email or signup required on the site. Everything is arranged directly with me on WhatsApp.',
    q4: 'Can I shower there?', a4: 'Yes, the suite has a hot shower and sanitized towels ready before and after your session.',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Cancellation', footCookies: 'Cookies', adults: 'Service strictly for adults 18 and older.',
    close: 'Close', theme: 'Switch screen theme', lang: 'Language', srLight: 'Switch to light theme', srDark: 'Switch to dark theme', legalNote: 'Legal documents are provided in Portuguese, which is the binding version.',
    profile: 'About the session', openProfile: 'Open Thalyson’s profile', gm: 'Good morning', ga: 'Good afternoon', gn: 'Good evening',
    pBul1: 'Quick chat before starting to see where your body needs the most attention', pBul2: 'Exclusive time slot: you never cross paths with anyone else', pBul3: 'Private suite with hot shower, comfortable table and climate control',
    pHours: 'Hours', pHoursV: 'Every day, from {a} to {b}', pPay: 'Payment', pPayV: 'Pix (3% off), card up to 12x or cash',
    pWhere: 'Location', pWhereV: 'Bela Vista (near Anhangabaú metro) or at your address', pCancel: 'Cancellation', pCancelV: 'Free up to 12h in advance',
    pForget: 'Clear my data from this device', forgot: 'Done, data cleared.',
    recommended: 'Most booked today', smartSub: 'Good to see you back. Pick your time to unwind.', lastSlots: 'Last open slots for today',
  },
  es: {
    loadMsg: 'Preparando un espacio reservado para ti', badge: 'Bela Vista, Centro de São Paulo',
    wSub: 'Atención masculina individual en São Paulo. Eliges la sesión, reservas en 1 minuto y confirmas directo conmigo por WhatsApp.', w1: 'Sin sala de espera ni filas', w2: 'Reserva con señal de R$ 40', w3: 'Sigilo e higiene total',
    enter: 'Ver sesiones y horarios', needAgeEnter: 'Confirma que tienes 18 años o más',
    h1: 'Apaga la mente. Suelta el cuerpo.', sub: 'Una hora entera dedicada a quitar el peso de tu rutina, sin prisa y con total privacidad cerca del metro Anhangabaú.',
    cta: 'Elegir mi sesión', reviews: 'Reseñas', nextFree: 'Próximo horario libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Sesiones desde',
    t1: 'Señal de R$ 40 para bloquear la agenda; el resto solo después de la sesión', t2: 'Reprogramación o reembolso gratis avisando hasta 12h antes', t3: 'R$ 15 de descuento automático en tu primera sesión',
    offH: 'Más ventaja en tu visita', offS: 'Resuelve el cansancio y el cuidado personal en el mismo horario o ahorra con paquete.',
    cbT: 'Masaje + recorte de vello', cbD: 'Sal relajado y prolijo en la misma visita, ahorrando hasta R$ 70.', lyT: 'Paquete 5 sesiones (paga 4)', lyD: 'La 5ª sesión es gratis para mantener el cuerpo liviano todo el mes.', see: 'Aprovechar',
    s1: '¿Qué sensación buscas hoy?', s2: '¿Quieres sumar alguna ventaja?', s3: 'Día, horario y lugar', s4: 'Revisa y envía por WhatsApp', min: 'min', flowH: 'Cómo funciona en la práctica',
    oSingle: 'Solo esta sesión', oSingleD: 'Sin compromiso, con R$ 15 off la primera vez.', oCombo: 'Con recorte de vello', oComboD: 'Incluye recorte a máquina hasta en 3 zonas en el mismo horario.', oPack: 'Paquete 5 sesiones (1 gratis)', oPackD: 'Paga 4 y gana la 5ª. Tienes {n} días para usar.',
    save: 'Ahorro de', was: 'Antes', listen: 'Escuchar cómo funciona', pause: 'Pausar audio', resume: 'Continuar audio', stopA: 'Detener',
    voiceLow: 'Modo de voz adaptado para este dispositivo', noTts: 'Tu navegador no soporta narración en audio.',
    skip: 'Ir al contenido', guar: 'Garantías', legalNav: 'Documentos legales',
    packNote: 'El paquete ya tiene el mayor descuento posible, por eso no se suma con cupones. Agendas la 1ª sesión ahora y combinas las otras 4 directo conmigo por WhatsApp.',
    name: '¿Cómo prefieres que te llame?', namePh: 'Tu primer nombre o apodo', nameErr: 'Escribe al menos 3 letras.', place: '¿Dónde será la sesión?', studio: 'En mi suite (Bela Vista)', home: 'En tu dirección (SP)',
    peakNote: 'Para atender en tu dirección en horarios de tráfico intenso hay tasa de R$ 18. Ingresa el CEP para completar la calle.',
    studioInfo: 'Atiendo solo en una suite reservada y climatizada en Bela Vista, a pasos del Metro Anhangabaú. Al confirmar te envío la ubicación exacta.',
    cep: 'CEP', street: 'Calle o Avenida', number: 'Nº', comp: 'Depto / Bloque', bairro: 'Barrio', addrErr: 'Completa calle, número y barrio.', cepFail: 'CEP no encontrado. Completa los campos abajo.',
    date: 'Elige el día', time: 'Hora de inicio', session: 'Duración:', peak: 'Pico', noSlots: 'Agenda llena este día. Elige otra fecha arriba.',
    demo: 'Horarios sujetos a confirmación rápida en WhatsApp.', dateErr: 'Elige un día.', timeErr: 'Elige un horario.', from: 'De', to: 'a', unavailable: 'ocupado',
    cont: 'Revisar reserva', fill: 'Completa los campos marcados arriba', change: 'Cambiar', sPack: 'Sesión', sWhen: 'Fecha y hora', sLoc: 'Lugar', sLocStudio: 'Suite Bela Vista (Centro)',
    lPack: 'Sesión elegida', lPack5: 'Paquete 5 sesiones (4 pagadas)', lCombo: 'Recorte de vello (combo)', lTime: '+30 minutos extra', lReq: 'Pedido específico', lFirst: 'Descuento 1ª sesión', lCoupon: 'Cupón aplicado', lPeak: 'Traslado / tráfico', lPix: 'Descuento Pix (3%)',
    saved: 'Estás ahorrando', total: 'Valor final', signal: 'Señal ahora (Pix)', rest: 'Después de la sesión',
    extras: 'Sumar más tiempo o cupón', couponQ: '¿Tienes un cupón?', couponPh: 'Escribe el código', apply: 'Aplicar', couponOk: 'Descuento aplicado', couponBad: 'Cupón inválido o vencido.',
    reqQ: '¿Algún pedido específico? (+ R$ 140)', learn: 'Más info',
    reqConsent: 'Autorizo enviar este pedido específico solo para evaluación en WhatsApp. No queda guardado en el sitio.',
    reqPh: 'Escribe lo que te gustaría incluir', reqNote: 'Evalúo en el momento; si no es posible realizarlo, no cobro nada extra.',
    pay: '¿Cómo pagarás el resto después?', pix: 'Pix (-3%)', card: 'Tarjeta hasta 12x', cash: 'Efectivo', cardNote: 'Cobramos en el lugar; las tasas de cuotas te las informo antes por WhatsApp.',
    optIn: 'Quiero recibir avisos de horarios libres y promociones por WhatsApp.',
    ageA: 'Confirmo tener 18 años o más y acepto la', privacy: 'Política de Privacidad', terms: 'Términos', and: 'y', refund: 'Reglas de Cancelación',
    sigA: 'Para bloquear este horario solo para ti, envía la señal de', sigB: 'vía Pix. El resto lo pagas solo después de salir de la camilla.', copyPix: 'Copiar clave Pix (CNPJ)', pixCopied: '¡Clave Pix copiada!',
    send: 'Confirmar en WhatsApp', needPay: 'Elige cómo pagarás el resto', needAge: 'Confirma que tienes 18 años o más',
    doneH: '¡Pedido listo!', doneP: 'Ahora solo envía el mensaje que se abrió en tu WhatsApp junto con el comprobante de los R$ 40 para bloquear tu hora.',
    doneSig: 'Clave Pix (CNPJ):', resend: 'Abrir WhatsApp nuevamente', addCal: 'Guardar en mi agenda', restart: 'Hacer otra reserva',
    chatQ: '¿Te quedó alguna duda antes de reservar?', chatBtn: 'Escríbeme directo al WhatsApp', chatMsg: '¡Hola Thalyson! Vi tu sitio y quería hacerte una consulta sobre el masaje.',
    aboutH: 'Thalyson • Bela Vista, SP', aboutR: 'Atención directa, sin intermediarios', about1: 'Mi objetivo es simple: que entres cargado de tensión y salgas liviano, renovado y con la mente despejada. Sin guiones rígidos y respetando el ritmo de tu cuerpo.',
    about2: 'Atiendo solo en suite privada en Bela Vista (cerca del metro Anhangabaú), con ducha caliente, toallas limpias y climatización.', seeProfile: 'Conocer mi trabajo',
    faqH: 'Preguntas frecuentes', q1: '¿Por qué debo pagar R$ 40 de señal?', a1: 'Como atiendo solo con hora marcada y bloqueo toda la agenda para ti, la señal asegura que el horario no quede vacío. Se descuenta del total y pagas el resto al final.',
    q2: '¿Y si surge un imprevisto?', a2: 'Avisando hasta 12 horas antes, te devuelvo tus R$ 40 al instante o reprogramamos para el día que prefieras.', q3: '¿Mis datos quedan expuestos?', a3: 'Para nada. No pido documento, correo ni registro en el sitio. Todo se coordina directo conmigo en WhatsApp con total discreción.',
    q4: '¿Puedo ducharme en el lugar?', a4: 'Sí, la suite cuenta con ducha caliente y toallas higienizadas para usar antes y después de la sesión.',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Cancelación', footCookies: 'Cookies', adults: 'Servicio exclusivo para mayores de 18 años.',
    close: 'Cerrar', theme: 'Cambiar color de pantalla', lang: 'Idioma', srLight: 'Cambiar a tema claro', srDark: 'Cambiar a tema oscuro', legalNote: 'Los documentos legales están en portugués, que es la versión vinculante.',
    profile: 'Sobre la atención', openProfile: 'Ver perfil de Thalyson', gm: 'Buenos días', ga: 'Buenas tardes', gn: 'Buenas noches',
    pBul1: 'Charla rápida antes de empezar para saber dónde tu cuerpo pide más atención', pBul2: 'Horario exclusivo: no te cruzas con nadie al entrar ni al salir', pBul3: 'Suite reservada con ducha caliente, camilla cómoda y climatización',
    pHours: 'Horarios', pHoursV: 'Todos los días, de {a} a {b}', pPay: 'Pago', pPayV: 'Pix (3% de descuento), tarjeta hasta 12x o efectivo',
    pWhere: 'Lugar', pWhereV: 'Bela Vista (cerca del metro Anhangabaú) o en tu dirección', pCancel: 'Cancelación', pCancelV: 'Gratis avisando hasta 12h antes',
    pForget: 'Borrar mis datos de este dispositivo', forgot: 'Listo, datos borrados.',
    recommended: 'Más pedida hoy', smartSub: 'Qué bueno verte de nuevo. Elige tu horario para relajarte.', lastSlots: 'Últimos horarios libres para hoy',
  },
};

const PACKAGES: { id: string; price: number; min: number; combo: number; theme: PkgTheme; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, combo: 90, theme: 'sage', L: {
    pt: { title: 'Massagem Clássica', tags: ['Alívio nas costas', 'Pistola massageadora', 'Sem finalização'], desc: 'Para quem está com o pescoço travado, ombros pesados e precisa sair leve. Uso pressão firme nas mãos e a pistola massageadora nos pontos mais duros para tirar a dor e o cansaço acumulado do dia.',
      flow: ['Você me mostra onde está doendo ou travado.', 'Solto a musculatura das costas, pescoço e pernas com manobras firmes.', 'Uso a pistola massageadora nos nós mais profundos.', 'Você sai com o corpo leve e a postura solta.'] },
    en: { title: 'Classic Massage', tags: ['Back relief', 'Massage gun', 'No intimate finish'], desc: 'For a stiff neck, heavy shoulders and built-up fatigue. I use firm hand pressure and a massage gun on tight spots to melt away physical tension.',
      flow: ['You show me where you feel stiff or sore.', 'I release back, neck and leg muscles with firm strokes.', 'Massage gun applied to deep knots.', 'You leave feeling light and loose.'] },
    es: { title: 'Masaje Clásico', tags: ['Alivio de espalda', 'Pistola masajeadora', 'Sin finalización'], desc: 'Para cuello trabado, hombros pesados y cansancio acumulado. Uso presión firme manual y pistola masajeadora en los puntos duros para quitar el dolor.',
      flow: ['Me muestras dónde sientes dolor o rigidez.', 'Suelto la musculatura de espalda, cuello y piernas con maniobras firmes.', 'Uso la pistola masajeadora en los nudos profundos.', 'Sales con el cuerpo liviano y suelto.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, theme: 'amber', L: {
    pt: { title: 'Sensitiva + Lingam', tags: ['Corpo todo', 'Toques lentos', 'Inclui Lingam'], desc: 'Começo tirando o peso das suas costas para você desligar a cabeça. Depois, o toque muda para manobras lentas e deslizantes que percorrem o corpo todo e terminam com a massagem lingam, trazendo alívio e prazer sem pressa.',
      flow: ['Massagem relaxante inicial para tirar a tensão do dia.', 'Transição para toques lentos e contínuos da cabeça aos pés.', 'Estímulo sensorial para você sair da mente e sentir a pele.', 'Finalização completa com massagem lingam.'] },
    en: { title: 'Sensitive + Lingam', tags: ['Full body', 'Slow touch', 'Includes Lingam'], desc: 'Starts by taking the weight off your back so your mind shuts off. Then the touch shifts to slow, gliding strokes across your entire body, ending with a full lingam massage.',
      flow: ['Initial relaxing massage to melt daily stress.', 'Transition to slow, continuous touch from head to toe.', 'Sensory awakening so you feel present in your skin.', 'Full finish with lingam massage.'] },
    es: { title: 'Sensitiva + Lingam', tags: ['Cuerpo completo', 'Toques lentos', 'Incluye Lingam'], desc: 'Empiezo quitando el peso de tu espalda para que apagues la mente. Luego el toque cambia a maniobras lentas por todo el cuerpo y termina con masaje lingam.',
      flow: ['Masaje relajante inicial para quitar la tensión del día.', 'Transición a toques lentos y continuos de pies a cabeza.', 'Estímulo sensorial para sentir la piel.', 'Finalización completa con masaje lingam.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, theme: 'crimson', L: {
    pt: { title: 'Sensações com a Barba + Lingam', tags: ['Naturista', 'Toque da barba', 'Inclui Lingam'], desc: 'Sessão naturista onde ambos ficamos sem roupa para o contato ser direto. Misturo o deslizamento das mãos com o toque quente e áspero da minha barba percorrendo a sua pele, encerrando com a massagem lingam.',
      flow: ['Atendimento naturista (ambos sem roupa, com total respeito).', 'Relaxamento muscular para preparar o corpo.', 'Deslizamento da barba pelo pescoço, costas e corpo inteiro.', 'Finalização intensa com massagem lingam.'] },
    en: { title: 'Beard Sensations + Lingam', tags: ['Naturist', 'Beard contact', 'Includes Lingam'], desc: 'Naturist session where both of us are unclothed for direct skin contact. I combine gliding hands with the warm, textured feel of my beard across your body, finishing with lingam massage.',
      flow: ['Naturist session (both unclothed, in total respect).', 'Muscle relaxation to prepare your body.', 'Beard gliding along your neck, back and full body.', 'Intense finish with lingam massage.'] },
    es: { title: 'Sensaciones con Barba + Lingam', tags: ['Naturista', 'Toque de barba', 'Incluye Lingam'], desc: 'Sesión naturista donde ambos estamos sin ropa para contacto directo. Combino el deslizamiento de las manos con el roce de mi barba por tu piel, cerrando con masaje lingam.',
      flow: ['Atención naturista (ambos sin ropa, con total respeto).', 'Relajación muscular preparatoria.', 'Deslizamiento de la barba por cuello, espalda y cuerpo.', 'Finalización intensa con masaje lingam.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, theme: 'midnight', L: {
    pt: { title: 'Corpo a Corpo + Lingam', tags: ['Sem barreiras', 'Interação livre', 'Inclui Lingam'], desc: 'Minha sessão mais completa e envolvente. Uso gel deslizante para trabalhar o meu corpo sobre o seu, com troca de calor e liberdade para você tocar e conduzir o ritmo junto comigo até a finalização lingam.',
      flow: ['Conversa rápida para alinhar o que você mais gosta.', 'Massagem preparatória com gel deslizante.', 'Contato corpo a corpo sem barreiras, com troca de calor.', 'Liberdade total para você retribuir os toques e finalizar com lingam.'] },
    en: { title: 'Body to Body + Lingam', tags: ['No barriers', 'Mutual touch', 'Includes Lingam'], desc: 'My most complete, immersive session. Using gliding gel, I use my body over yours with real warmth and freedom for you to touch back and guide the pace through the lingam finish.',
      flow: ['Quick chat to align what you enjoy most.', 'Preparatory massage with gliding gel.', 'Body-to-body contact without barriers.', 'Full freedom for you to return touches through the lingam finish.'] },
    es: { title: 'Cuerpo a Cuerpo + Lingam', tags: ['Sin barreras', 'Interacción libre', 'Incluye Lingam'], desc: 'Mi sesión más completa. Uso gel deslizante para trabajar mi cuerpo sobre el tuyo, con intercambio de calor y libertad para que toques y marques el ritmo hasta el final lingam.',
      flow: ['Charla rápida para alinear tus preferencias.', 'Masaje preparatorio con gel deslizante.', 'Contacto cuerpo a cuerpo sin barreras.', 'Libertad total para devolver toques y cerrar con lingam.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, theme: 'slate', L: {
    pt: { title: 'Apenas Aparo de Pelos', tags: ['Higiene e visual', 'Máquina e pentes'], desc: 'Atendimento rápido e discreto para deixar o visual limpo e alinhado. Faço o aparo na máquina com pentes higienizados em até 3 regiões do corpo à sua escolha.',
      flow: ['Você escolhe a altura do corte em cada região.', 'Aparo cuidadoso na máquina sem irritar a pele.', 'Acabamento limpo para você sair pronto.'] },
    en: { title: 'Body Trimming Only', tags: ['Clean look', 'Machine & guards'], desc: 'Quick, discreet grooming session to keep things neat. Machine trimming with sanitized guards on up to 3 body areas of your choice.',
      flow: ['You pick the trim length for each area.', 'Careful machine trimming without skin irritation.', 'Clean finish so you leave ready.'] },
    es: { title: 'Solo Recorte de Vello', tags: ['Higiene y estética', 'Máquina y peines'], desc: 'Atención rápida y discreta para dejar el cuerpo prolijo. Recorte a máquina con peines higienizados hasta en 3 zonas a elección.',
      flow: ['Eliges el largo deseado en cada zona.', 'Recorte cuidadoso a máquina sin irritar la piel.', 'Acabado limpio para salir listo.'] } } },
];
const MASSAGES = PACKAGES.filter((p) => p.combo > 0);
const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };
const THEME_RGB: Record<PkgTheme, { dark: string; light: string }> = {
  sage: { dark: '94, 184, 140', light: '43, 76, 59' },
  amber: { dark: '235, 157, 75', light: '143, 90, 26' },
  crimson: { dark: '224, 102, 92', light: '140, 59, 50' },
  midnight: { dark: '171, 142, 204', light: '61, 43, 76' },
  slate: { dark: '148, 163, 184', light: '90, 100, 110' },
};

/* ================================================================== */
/*  DOCUMENTOS LEGAIS                                                  */
/* ================================================================== */
const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="font-semibold mt-5 mb-2 c-ink">{children}</h3>;
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
    <H>Estritamente necessário</H><P>Guardamos no navegador (localStorage) apenas suas preferências de tema e idioma, a confirmação de maioridade e a lembrança de que você já agendou antes (para não repetir o desconto de primeira sessão). Não identificam você. Nome e endereço não são guardados. Você pode apagar tudo em “Limpar meus dados deste aparelho”, no perfil.</P>
    <P>Se no futuro ativarmos qualquer ferramenta de análise ou marketing, ela só carregará depois do seu consentimento.</P></>) },
};

/* ================================================================== */
/*  UTILITÁRIOS                                                        */
/* ================================================================== */
const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
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

/* ================================================================== */
/*  NARRAÇÃO EM ÁUDIO                                                  */
/* ================================================================== */
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

  return { supported, state, activeId, male: choice.male, toggle, stop };
}

/* ================================================================== */
/*  ÍCONES, AVATAR E ANIMAÇÕES                                         */
/* ================================================================== */
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
  sparkle: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  play: 'M5 3l14 9-14 9V3z',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
  stop: 'M6 6h12v12H6z',
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

/* ================================================================== */
/*  COMPONENTES UI                                                     */
/* ================================================================== */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean };
function Button({ asChild, className, children, type, ...rest }: BtnProps) {
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...(rest as Record<string, unknown>),
      className: cn(className, typeof child.props.className === 'string' ? child.props.className : undefined),
    });
  }
  return <button type={type ?? 'button'} className={className} {...rest}>{children}</button>;
}

const Card = ({ className, ...rest }: HTMLAttributes<HTMLDivElement>) => <div className={cn('card-ui', className)} {...rest} />;
const Label = ({ className, ...rest }: LabelHTMLAttributes<HTMLLabelElement>) => <label className={className} {...rest} />;
const Badge = ({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) => <span className={cn('badge-ui', className)} {...rest} />;
const Separator = () => <div role="separator" className="sep-ui" />;
const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...rest }, ref) => (
  <input ref={ref} className={cn('inp-ui', className)} {...rest} />
));
Input.displayName = 'Input';

function Checkbox({ id, checked, onCheckedChange, className }: { id?: string; checked: boolean; onCheckedChange: (c: boolean) => void; className?: string }) {
  return (
    <button type="button" role="checkbox" id={id} aria-checked={checked} onClick={() => onCheckedChange(!checked)} className={cn('chk-ui', className)}>
      {checked && <Icon name="check" size={16} />}
    </button>
  );
}

const RadioCtx = createContext<{ name: string; value: string; onChange: (v: string) => void }>({ name: '', value: '', onChange: () => undefined });
function RadioGroup({ value, onValueChange, className, children, ...aria }: { value: string; onValueChange: (v: string) => void; className?: string; children: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }) {
  const name = useId();
  return (
    <RadioCtx.Provider value={{ name, value, onChange: onValueChange }}>
      <div role="radiogroup" className={className} {...aria}>{children}</div>
    </RadioCtx.Provider>
  );
}
function RadioGroupItem({ value, disabled, ...aria }: { value: string; disabled?: boolean; 'aria-label'?: string }) {
  const c = useContext(RadioCtx);
  return <input type="radio" className="sr-only" name={c.name} value={value} checked={c.value === value} disabled={disabled} onChange={() => c.onChange(value)} {...aria} />;
}

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
    <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(8,6,12,.72)', zIndex: 150 }} onClick={() => closeRef.current()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()} className="card-ui modal-card w-full flex flex-col rise">
        <div className="flex justify-between items-center gap-4 p-5 bd-line" style={{ borderBottom: '1px solid var(--line)' }}>
          <h2 id="modal-title" className="serif text-xl">{title}</h2>
          <Button onClick={() => closeRef.current()} aria-label={closeLabel} className="btn-ui btn-g btn-round"><Icon name="close" size={18} /></Button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

const Row = ({ label, value, tone }: { label: string; value: ReactNode; tone?: 'ok' }) => (
  <div className={cn('flex justify-between gap-4 text-[15.5px]', tone && 'c-ok font-bold')}>
    <span className={tone ? undefined : 'c-mute'}>{label}</span>
    <span className="font-semibold text-right">{value}</span>
  </div>
);

const LinkBtn = ({ onClick, children }: { onClick: () => void; children: ReactNode }) => (
  <Button onClick={onClick} className="lnk-ui">{children}</Button>
);

const StepHead = ({ n, title, done }: { n: number; title: string; done: boolean }) => (
  <div className="flex items-center gap-4 mb-6">
    <span className={`stepn ${done ? 'ok' : ''}`}>{done ? <Icon name="check" size={16} /> : n}</span>
    <Title as="h2" className="text-[28px] md:text-[34px]">{title}</Title>
  </div>
);

const SocialButtons = ({ reviewsLabel, grid = false }: { reviewsLabel: string; grid?: boolean }) => (
  <div className={grid ? 'g-2' : 'flex flex-wrap gap-3'}>
    <Button asChild className="btn-ui btn-g btn-md">
      <a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={18} /> Instagram</a>
    </Button>
    <Button asChild className="btn-ui btn-g btn-md">
      <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer"><Icon name="star" size={18} /> {reviewsLabel}</a>
    </Button>
  </div>
);

/* ================================================================== */
/*  CSS                                                                */
/* ================================================================== */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@400..800&display=swap');
.app{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#F2EFEB;--ink:#1C1A17;--mute:#6B655C;--line:rgba(28,26,23,.12);--acc:#1C1A17;--onacc:#FFFFFF;--rg:rgba(28,26,23,.22);--ok:#1E533F;--warn:#8F5A1A;--err:#C2334D}
.app[data-theme=dark]{--bg:#141312;--surf:#1D1B1A;--surf2:#2A2725;--ink:#F2EFEB;--mute:#A19A90;--line:rgba(242,239,235,.12);--acc:#F2EFEB;--onacc:#141312;--rg:rgba(242,239,235,.28);--ok:#50A684;--warn:#E6A15C;--err:#FF8A9B}
.app{background:var(--bg);color:var(--ink);font-family:'Manrope',system-ui,sans-serif;font-size:17px;line-height:1.55;min-height:100vh;min-height:100dvh;overflow-x:clip;transition:background .3s,color .3s;overflow-wrap:break-word;word-break:normal;hyphens:manual;text-wrap:pretty;-webkit-text-size-adjust:100%}
.app h1,.app h2,.app h3{text-wrap:balance;word-break:normal;hyphens:manual}
.app .text-sm{font-size:15.5px}.app .text-xs{font-size:13.5px}
.app button,.app input,.app label{font-family:inherit}
.serif{font-family:'Fraunces',Georgia,serif;font-optical-sizing:auto}
.c-mute{color:var(--mute)}.c-ink{color:var(--ink)}.c-ok{color:var(--ok)}.c-warn{color:var(--warn)}
.bg-s2{background:var(--surf2)}.bd-line{border-color:var(--line)}
.err{font-size:14px;color:var(--err);margin-top:8px}
.skip{position:absolute;left:-9999px;top:8px;z-index:300;background:var(--acc);color:var(--onacc);padding:12px 20px;border-radius:999px;font-weight:700}
.skip:focus{position:fixed;left:12px}

.card-ui{background:var(--surf);color:var(--ink);border:1px solid var(--line);border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.03)}
.app[data-theme=dark] .card-ui{box-shadow:none}
.card-flat{border:none;background:var(--surf2)}
.modal-card{max-width:32rem;max-height:90vh;max-height:90dvh;border-radius:28px 28px 0 0}
@media(min-width:640px){.modal-card{border-radius:28px}}

.btn-ui{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:56px;padding:12px 24px;border-radius:999px;font-weight:700;font-size:16px;line-height:1.2;text-align:center;cursor:pointer;white-space:normal;text-wrap:balance;transition:transform .15s,opacity .2s,background .2s}
.btn-ui:active{transform:scale(.98)}
.btn-ui:disabled{cursor:not-allowed}
.btn-p{background:var(--acc);color:var(--onacc);box-shadow:0 4px 12px var(--rg)}
.btn-p:hover:not(:disabled){opacity:.92}
.btn-p:disabled{background:var(--surf2);color:var(--mute);box-shadow:none}
.btn-g{border:1px solid var(--line);color:var(--ink);background:transparent}
.btn-g:hover:not(:disabled){background:var(--surf2)}
.btn-g:disabled{opacity:.5}
.btn-sm{min-height:48px;font-size:15px}
.btn-md{min-height:50px}
.btn-lg{min-height:60px;font-size:17px;padding:12px 36px}
.btn-xl{min-height:64px;font-size:17px}
.btn-round{min-height:46px;min-width:46px;width:46px;padding:0;border:none}
.btn-icon{min-height:44px;min-width:44px;width:44px;padding:0;border:none}
.btn-ghost{background:transparent;border:none;min-height:auto;padding:4px;justify-content:flex-start;border-radius:14px;font-weight:500}

.lnk-ui{display:inline;background:none;border:0;padding:0;font:inherit;font-weight:600;color:var(--ink);text-decoration:underline;text-underline-offset:4px;cursor:pointer;text-align:left;overflow-wrap:break-word}
.lnk-block{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:44px;padding:0 8px;text-align:center}
.lnk-mute{color:var(--mute);font-weight:500;font-size:14px}
.lnk-left{justify-content:flex-start;padding:0}
.lnk-full{display:flex;width:100%}

.inp-ui{display:block;width:100%;min-height:56px;padding:0 18px;border-radius:16px;background:var(--surf);border:1px solid var(--line);color:var(--ink);font-size:17px;transition:border-color .2s,box-shadow .2s}
.inp-ui::placeholder{color:var(--mute)}
.inp-ui:focus{outline:none;border-color:var(--acc);box-shadow:0 0 0 3px var(--rg)}
.inp-ui:disabled{opacity:.5}
.inp-ui[aria-invalid=true]{border-color:var(--err)}

.lbl-ui{display:block;font-size:14.5px;font-weight:700;color:var(--mute);margin-bottom:10px;line-height:1.35}
.lbl-flat{margin-bottom:0}
.lbl-chk{cursor:pointer;font-size:14.5px;line-height:1.6}
.chk-ui{display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;flex-shrink:0;margin-top:2px;padding:0;border:2px solid var(--mute);border-radius:6px;background:var(--surf);color:var(--onacc);cursor:pointer;transition:background .15s,border-color .15s}
.chk-ui[aria-checked=true]{background:var(--acc);border-color:var(--acc)}
.chk-mid{margin-top:0}
.chk-ui:focus-visible,.btn-ui:focus-visible,.lnk-ui:focus-visible,.app a:focus-visible,.app button:focus-visible,.app summary:focus-visible{outline:2px solid var(--acc);outline-offset:3px}

.chip-ui{position:relative;display:flex;align-items:center;justify-content:center;min-height:54px;padding:8px 12px;border:1px solid var(--line);border-radius:18px;background:var(--surf);color:var(--ink);text-align:center;cursor:pointer;transition:background .2s,color .2s,border-color .2s;font-weight:600;font-size:16px;line-height:1.2;text-wrap:balance}
.chip-ui.col{flex-direction:column}
.chip-ui.on{background:var(--acc);color:var(--onacc);border-color:var(--acc);font-weight:700}
.chip-ui.off{opacity:.4;text-decoration:line-through;cursor:not-allowed}
.chip-ui:has(input:focus-visible),.opt-ui:has(input:focus-visible){outline:2px solid var(--acc);outline-offset:3px}
.opt-ui{display:block;border-radius:22px;padding:20px;background:var(--surf);cursor:pointer;border:1px solid var(--line);transition:border-color .2s,background .2s}
.opt-ui.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc);background:var(--surf2)}
.pkg-ui{overflow:hidden;border-radius:22px;border:1px solid var(--line);background:var(--surf);transition:border-color .2s,background .2s}
.pkg-head{display:block;cursor:pointer;padding:18px 20px}
.pkg-head:has(input:focus-visible){outline:2px solid var(--acc);outline-offset:-3px}

.badge-ui{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:6px 12px;font-size:12px;font-weight:800;line-height:1.2;text-align:center}
.badge-rec{display:inline-flex;align-items:center;gap:6px;background:color-mix(in srgb,var(--ok) 15%,transparent);color:var(--ok);font-size:11px;font-weight:800;padding:4px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.sep-ui{height:1px;background:var(--line);width:100%}

.seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px;background:var(--surf)}
.seg button{min-height:40px;min-width:44px;padding:0 8px;border-radius:999px;font-size:12.5px;font-weight:800;color:var(--mute)}
.seg button[aria-pressed=true]{background:var(--ink);color:var(--bg)}
.brand{display:none}
@media(min-width:430px){.brand{display:inline}}
.g-2,.g-3{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:420px){.g-2{grid-template-columns:1fr 1fr}.g-3{grid-template-columns:repeat(3,1fr)}}

.glow{position:absolute;top:-6%;right:-30%;width:min(95vw,640px);aspect-ratio:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--acc) 15%,transparent),transparent 66%);animation:drift 14s ease-in-out infinite}
.dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 var(--ok);animation:pulse 2.6s ease-out infinite}
.stepn{width:34px;height:34px;flex-shrink:0;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:15px;border:1.5px solid var(--line);color:var(--mute);transition:all .3s}
.stepn.ok{background:var(--acc);color:var(--onacc);border-color:var(--acc)}
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
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--bg) 90%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
.faq-btn{width:100%;min-height:60px;display:flex;align-items:center;justify-content:space-between;gap:12px;cursor:pointer;font-weight:700;text-align:left;background:transparent;border:0;color:var(--ink);font-size:inherit}
.faq-icon{font-size:24px;color:var(--acc);transition:transform .2s;flex-shrink:0;line-height:1}
.faq-icon.open{transform:rotate(45deg)}
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

/* ================================================================== */
/*  APP                                                                */
/* ================================================================== */
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
  const t = (k: string) => T[lang][k] ?? T.pt[k] ?? k;

  const [phase, setPhase] = useState<Phase>('loading');
  const [profileOpen, setProfileOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [offer, setOffer] = useState<Offer>('single');
  const [reviewed, setReviewed] = useState(false);
  const [done, setDone] = useState(false);
  const [sentLink, setSentLink] = useState('');
  const [isReturning, setIsReturning] = useState(() => store.get('thaly_returning_final') === 'yes');
  const [touched, setTouched] = useState(false);
  const [toast, setToast] = useState('');
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
  const scrollToRef = (r: Ref<HTMLDivElement>, ms = 140) => setTimeout(() => r.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), ms);
  const goBook = () => scrollToRef(bookRef, 30);

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
  useEffect(() => { store.set('thaly_theme', theme); }, [theme]);
  useEffect(() => { const i = setInterval(() => setNow(spNow()), 60000); return () => clearInterval(i); }, []);
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);
  useEffect(() => { narr.stop(); }, [data.packageId, lang, narr.stop]);
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
    return day === 1 || (hour >= 9 && hour < 13) ? 'classica' : 'sensitiva';
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
    return { sessionPrice, aparoAdd, timeAdd, reqFee, peakFee, discount, pixDiscount, total, sinal, rest: Math.max(0, total - sinal), dur, comboSave, packSave, saved: comboSave + packSave + discount + pixDiscount };
  }, [data, pkg, isHome, isPack, aparoOn, isReturning, coupon.applied, coupon.value, hasReq]);

  const todayKey = dateKey(now);
  const days = useMemo(() => {
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);
    return Array.from({ length: C.DAYS }, (_, i) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + i);
      return { d, i };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayKey]);

  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.dur, isHome, now) : []), [data.date, invoice.dur, isHome, now]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  useEffect(() => { if (data.time && !slots.some((s) => s.t === data.time && s.ok)) set({ time: '' }); }, [slots, data.time]);

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
        const res = await fetch(`https://viacep.com.br/ws/${masked.replace('-', '')}/json/`);
        if (!res.ok) throw new Error('CEP fetch fail');
        const j = await res.json();
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast(t('cepFail'));
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
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '';
    const pk = pkg.L.pt;
    const extras: string[] = [];
    if (aparoOn) extras.push('com aparo de pelos');
    if (data.addTime) extras.push('+30 min');
    if (isPack) extras.push('pacote 5 sessões');
    const extraTxt = extras.length ? ` (${extras.join(', ')})` : '';
    const locTxt = isHome
      ? `No meu endereço: ${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}`
      : 'Na sua suíte (Bela Vista)';

    let m = `Oi Thalyson! Sou o *${clean(data.name)}* e quero agendar:\n\n`;
    m += `• *Sessão:* ${pk.title}${extraTxt}\n`;
    m += `• *Quando:* ${dStr}, das ${data.time} às ${endTime}\n`;
    m += `• *Onde:* ${locTxt}\n`;
    m += `• *Total:* ${money(invoice.total)} (${PAY_PT[data.payment] || data.payment})\n`;
    if (hasReq) m += `• *Pedido:* ${clean(data.req)}\n`;
    m += `\nJá vou fazer o Pix do sinal de *${money(invoice.sinal)}* e te mando o comprovante aqui para confirmar.`;
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
    setTouched(false); setReqOk(false); setDone(false); setReviewed(false); setExtrasOpen(false); setOffer('single');
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
  const minMassagePrice = useMemo(() => Math.min(...MASSAGES.map((p) => p.price)), []);

  const renderAge = (id: string) => (
    <div className="flex items-start gap-3 text-sm leading-relaxed">
      <Checkbox id={id} checked={ageOk} onCheckedChange={setAgeOk} />
      <p>
        <Label htmlFor={id} className="lbl-chk">{t('ageA')} </Label>
        <LinkBtn onClick={() => setDoc('privacy')}>{t('privacy')}</LinkBtn>, <LinkBtn onClick={() => setDoc('terms')}>{t('terms')}</LinkBtn> {t('and')} <LinkBtn onClick={() => setDoc('refund')}>{t('refund')}</LinkBtn>.
      </p>
    </div>
  );

  /* ---------------------------- Carregando ---------------------------- */
  if (phase === 'loading') {
    return (
      <div className="app flex flex-col items-center justify-center px-6 text-center" data-theme={theme} role="status" aria-live="polite" aria-busy="true">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div className="relative" style={{ width: 176, height: 176 }}>
          <span className="ring" /><span className="ring" style={{ animationDelay: '1.2s' }} /><span className="ring" style={{ animationDelay: '2.4s' }} />
          <div className="core"><Avatar className="w-full h-full rounded-full text-4xl" alt="" /></div>
        </div>
        <h1 className="serif font-light mt-10 rise" style={{ fontSize: 'clamp(30px,7vw,44px)', letterSpacing: '-0.01em', animationDelay: '.3s' }}>{SITE_NAME}</h1>
        <p className="mt-3 rise text-sm c-mute" style={{ animationDelay: '.7s' }}>{t('loadMsg')}</p>
        <div className="mt-8 w-48 rounded-full overflow-hidden" style={{ height: 3, background: 'var(--line)' }}><div className="loadbar h-full" style={{ background: 'var(--acc)' }} /></div>
      </div>
    );
  }

  /* ------------------------------ Página ------------------------------ */
  return (
    <div className="app" data-theme={theme} style={{ paddingBottom: showBar ? 96 : 24 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {toast && <div role="status" aria-live="polite" className="fixed left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-semibold text-center shadow-xl" style={{ top: 80, zIndex: 200, maxWidth: '90vw', background: 'var(--ink)', color: 'var(--bg)' }}>{toast}</div>}

      <a href="#main" className="skip">{t('skip')}</a>

      <header className="sticky top-0" style={{ zIndex: 50, background: 'color-mix(in srgb,var(--bg) 88%,transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)', paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
          <Button onClick={() => { vibrate(10); setProfileOpen(true); }} aria-label={t('openProfile')} aria-haspopup="dialog" className="btn-ui btn-ghost min-w-0 gap-3">
            <Avatar className="w-11 h-11 rounded-full" alt="" />
            <span className="serif brand whitespace-nowrap" style={{ fontSize: 17 }}>Relaxar hoje</span>
          </Button>
          <div className="flex items-center gap-2 shrink-0">
            <div className="seg" role="group" aria-label={t('lang')}>
              {(['pt', 'en', 'es'] as Lang[]).map((l) => (
                <button key={l} type="button" aria-pressed={lang === l} aria-label={LANG_NAME[l]} onClick={() => { vibrate(10); setLang(l); }}>{l.toUpperCase()}</button>
              ))}
            </div>
            <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={theme === 'dark' ? t('srLight') : t('srDark')} title={t('theme')} className="btn-ui btn-g btn-icon">
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </Button>
          </div>
        </div>
      </header>

      <main id="main" className="max-w-3xl mx-auto px-5">
        {phase === 'welcome' && (
          <section className="max-w-xl mx-auto flex flex-col justify-center py-10" style={{ minHeight: '84vh' }} aria-labelledby="wt">
            <div className="relative mb-9 rise" style={{ width: 104, height: 104 }}>
              <span className="ring" /><span className="ring" style={{ animationDelay: '1.8s' }} />
              <div className="core" style={{ width: 104, height: 104 }}><Avatar className="w-full h-full rounded-full text-4xl" alt="Thalyson" /></div>
            </div>
            <p className="rise inline-flex items-center gap-2 text-sm font-semibold mb-4 self-start c-mute" style={{ animationDelay: '.1s' }}><Icon name="map" size={16} /> {t('badge')}</p>
            <h1 id="wt" className="serif font-light leading-[1.02] mb-5 rise" style={{ fontSize: 'clamp(46px,12vw,78px)', letterSpacing: '-0.02em', animationDelay: '.2s' }}>Relaxar hoje<br />com Thalyson</h1>
            <p className="text-lg leading-relaxed mb-8 rise c-mute" style={{ animationDelay: '.35s' }}>{t('wSub')}</p>
            <ul className="grid gap-3 mb-9 rise" style={{ animationDelay: '.5s' }}>
              {([['w1', 'clock'], ['w2', 'lock'], ['w3', 'shield']] as [string, IconName][]).map(([k, ic]) => (<li key={k} className="flex items-center gap-3 font-semibold"><Icon name={ic} size={20} />{t(k)}</li>))}
            </ul>
            <div className="rise mb-6" style={{ animationDelay: '.6s' }}>{renderAge('age-w')}</div>
            <Button onClick={enter} disabled={!ageOk} className="btn-ui btn-p btn-xl w-full rise" style={{ animationDelay: '.7s' }}>{ageOk ? t('enter') : t('needAgeEnter')}</Button>
          </section>
        )}

        {phase === 'site' && (<>
          {/* Hero */}
          <section className="relative pt-14 pb-16 flex flex-col justify-center" style={{ minHeight: 'calc(100svh - 76px)' }}>
            <div className="glow" aria-hidden="true" />
            <div className="relative">
              <Reveal><p className="inline-flex items-center gap-2 text-sm font-semibold mb-6 c-mute"><Icon name="map" size={16} /> {t('badge')}</p></Reveal>
              <Title as="h1" className="mb-4" style={{ fontSize: 'clamp(48px,12vw,86px)' }}>{t('h1')}</Title>
              <Reveal delay={250}><p className="text-lg leading-relaxed mb-8 max-w-md c-mute">{isReturning ? t('smartSub') : t('sub')}</p></Reveal>
              <Reveal delay={380}>
                <div className="flex flex-wrap gap-3 mb-8">
                  <Button onClick={goBook} className="btn-ui btn-p btn-lg">{t('cta')}</Button>
                  <Button asChild className="btn-ui btn-g btn-lg">
                    <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer"><Icon name="star" size={18} /> {t('reviews')}</a>
                  </Button>
                </div>
              </Reveal>
              <Reveal delay={500}>
                {nextFree && (
                  <p className="flex items-center gap-3 text-sm c-mute"><span className="dot" aria-hidden="true" /><span>{t('nextFree')}: <strong className="c-ink">{nextLabel}</strong></span></p>
                )}
                <p className="text-sm mt-1 c-mute">{t('fromM')} {money(minMassagePrice)}</p>
              </Reveal>
            </div>
          </section>

          {/* Garantias */}
          <Reveal className="mb-24">
            <ul className="grid sm:grid-cols-3 gap-5" aria-label={t('guar')}>
              {([['t1', 'lock'], ['t2', 'shield'], ['t3', 'star']] as [string, IconName][]).map(([k, ic]) => (
                <li key={k} className="flex items-start gap-3 text-[15.5px] leading-snug"><Icon name={ic} size={22} className="mt-0.5" />{t(k)}</li>
              ))}
            </ul>
          </Reveal>

          {/* Ofertas */}
          <section className="mb-28" aria-labelledby="off">
            <Title id="off" className="text-[34px] md:text-[44px] mb-3">{t('offH')}</Title>
            <Reveal delay={120}><p className="mb-8 c-mute">{t('offS')}</p></Reveal>
            <div className="grid sm:grid-cols-2 gap-4">
              {([['combo', 'cbT', 'cbD', 'plus'], ['pack', 'lyT', 'lyD', 'gift']] as [Offer, string, string, IconName][]).map(([o, a, b, ic], i) => (
                <Reveal key={o} delay={i * 120} className="h-full">
                  <Card className="h-full">
                    <button type="button" onClick={() => pickOffer(o)} className="flex flex-col gap-3 p-6 text-left w-full h-full" style={{ borderRadius: 24 }}>
                      <Icon name={ic} size={28} />
                      <span className="serif text-[28px] leading-tight mt-2">{t(a)}</span>
                      <span className="text-[15.5px] c-mute">{t(b)}</span>
                      <span className="lnk-ui mt-auto pt-2">{t('see')}</span>
                    </button>
                  </Card>
                </Reveal>
              ))}
            </div>
          </section>

          {/* Agendamento */}
          <section ref={bookRef} className="scroll-mt-20 mb-28" aria-label={t('cta')}>
            {done ? (
              <Reveal>
                <Card className="card-flat p-8 text-center">
                  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 c-ok" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)' }}><Icon name="check" size={32} /></div>
                  <h2 className="serif text-4xl font-light mb-4">{t('doneH')}</h2>
                  <p className="leading-relaxed mb-4 c-mute">{t('doneP')}</p>
                  <p className="font-bold mb-8">{t('doneSig')} {C.PIX_KEY} • {money(invoice.sinal)}</p>
                  <div className="space-y-3 max-w-xs mx-auto">
                    <Button asChild className="btn-ui btn-p w-full">
                      <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer">{t('resend')}</a>
                    </Button>
                    <Button onClick={copyPix} className="btn-ui btn-g w-full"><Icon name="copy" size={16} /> {t('copyPix')}</Button>
                    {googleCalendarLink() && (
                      <Button asChild className="btn-ui btn-g w-full">
                        <a href={googleCalendarLink()} target="_blank" rel="noopener noreferrer"><Icon name="cal" size={16} /> {t('addCal')}</a>
                      </Button>
                    )}
                    <Button onClick={restart} className="lnk-ui lnk-block lnk-mute lnk-full">{t('restart')}</Button>
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
                      const rgb = THEME_RGB[p.theme][theme];
                      const mine = narr.activeId === p.id;
                      const playing = mine && narr.state === 'playing';
                      const paused = mine && narr.state === 'paused';
                      const narrText = `${L.title}. ${L.desc} ${t('flowH')}: ${L.flow.join(' ')}`;
                      return (
                        <Reveal key={p.id} delay={(i % 2) * 80} className={on ? 'md:col-span-2' : ''}>
                          <div
                            className="pkg-ui"
                            style={{
                              borderColor: on ? `rgb(${rgb})` : isRec ? `rgba(${rgb}, 0.5)` : undefined,
                              boxShadow: on ? `0 0 0 1px rgb(${rgb})` : isRec ? `0 0 0 1px rgba(${rgb}, 0.3)` : undefined,
                              backgroundColor: on ? `rgba(${rgb}, 0.05)` : isRec ? `rgba(${rgb}, 0.03)` : undefined,
                            }}
                          >
                            <Label className="pkg-head">
                              <RadioGroupItem value={p.id} />
                              {isRec && <span className="badge-rec"><Icon name="sparkle" size={12} /> {t('recommended')}</span>}
                              <span className="flex justify-between items-baseline gap-4">
                                <span className="serif text-[22px] leading-tight">{L.title}</span>
                                <span className="serif text-[22px] shrink-0 font-semibold" style={{ color: on || isRec ? `rgb(${rgb})` : 'var(--acc)' }}>{money(p.price)}</span>
                              </span>
                              <span className="block text-sm mt-1 c-mute">{p.min} {t('min')} • {L.tags.join(' • ')}</span>
                            </Label>
                            {on && (
                              <div className="rise px-5 pb-5" style={{ borderTop: '1px solid var(--line)' }}>
                                <p className="text-[15.5px] leading-relaxed pt-4 mb-4">{L.desc}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {L.tags.map((g) => (
                                    <Badge key={g} style={{ backgroundColor: `rgba(${rgb}, 0.12)`, color: `rgb(${rgb})`, padding: '6px 12px' }}>{g}</Badge>
                                  ))}
                                </div>
                                <p className="text-sm font-bold mb-2">{t('flowH')}</p>
                                <ol className="pl-5 list-decimal text-[15.5px] leading-relaxed space-y-1 mb-4 c-mute">
                                  {L.flow.map((s) => <li key={s}>{s}</li>)}
                                </ol>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    disabled={!narr.supported}
                                    onClick={() => { vibrate(10); narr.toggle(p.id, narrText); }}
                                    className="btn-ui btn-g btn-sm flex-1"
                                    style={{ flexBasis: 176, borderColor: `rgba(${rgb}, 0.45)`, color: `rgb(${rgb})` }}
                                  >
                                    <Icon name={playing ? 'pause' : 'play'} size={16} />
                                    {playing ? t('pause') : paused ? t('resume') : t('listen')}
                                  </Button>
                                  {mine && (
                                    <Button onClick={() => { vibrate(10); narr.stop(); }} className="btn-ui btn-g btn-sm">
                                      <Icon name="stop" size={14} /> {t('stopA')}
                                    </Button>
                                  )}
                                </div>
                                {!narr.supported && <p className="text-xs mt-2 c-mute" role="status">{t('noTts')}</p>}
                                {mine && narr.supported && !narr.male && <p className="text-xs mt-2 c-mute" role="status">{t('voiceLow')}</p>}
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
                  <div ref={s2Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={2} title={t('s2')} done={true} />
                      <RadioGroup value={offerEff} onValueChange={(v) => { vibrate(15); setOffer(v as Offer); }} aria-label={t('s2')} className="grid gap-3">
                        {([
                          ['single', t('oSingle'), t('oSingleD'), pkg.price, 0, 0],
                          ['combo', t('oCombo'), t('oComboD'), pkg.price + pkg.combo, pkg.price + C.APARO_FULL, C.APARO_FULL - pkg.combo],
                          ['pack', t('oPack'), t('oPackD').replace('{n}', String(C.PACK_DAYS)), pkg.price * C.PACK_PAY, pkg.price * C.PACK_TOTAL, pkg.price],
                        ] as [Offer, string, string, number, number, number][]).map(([o, a, b, price, was, sv]) => (
                          <Label key={o} className={cn('opt-ui', offerEff === o && 'on')}>
                            <RadioGroupItem value={o} />
                            <span className="flex justify-between items-start gap-x-4 gap-y-2 flex-wrap sm:flex-nowrap">
                              <span className="flex-1" style={{ minWidth: 0 }}><span className="block font-bold">{a}</span><span className="block text-sm mt-1 c-mute">{b}</span></span>
                              <span className="text-right shrink-0">
                                <span className="serif text-[22px] block leading-none" style={{ color: 'var(--acc)' }}>{money(price)}</span>
                                {sv > 0 && <span className="block text-xs mt-1"><s className="c-mute">{money(was)}</s></span>}
                              </span>
                            </span>
                            {sv > 0 && <Badge className="mt-3 c-ok" style={{ background: 'color-mix(in srgb,var(--ok) 16%,transparent)' }}>{t('save')} {money(sv)}</Badge>}
                          </Label>
                        ))}
                      </RadioGroup>
                      {isPack && <p className="text-sm leading-relaxed mt-4 c-mute">{t('packNote')}</p>}
                    </Reveal>
                  </div>
                )}

                {/* 3. Quando e onde */}
                {chosen && (
                  <div ref={s3Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 2 : 3} title={t('s3')} done={step3Valid} />
                      <div className="space-y-9">
                        <div style={{ minWidth: 0 }}>
                          <p className="lbl-ui" id="date-lbl">{t('date')}</p>
                          <RadioGroup
                            aria-labelledby="date-lbl"
                            value={data.date ? dateKey(data.date) : ''}
                            onValueChange={(v) => { const f = days.find((x) => dateKey(x.d) === v); if (f) { vibrate(10); set({ date: f.d, time: '' }); } }}
                            className="flex gap-3 overflow-x-auto py-1 hide-sb -mx-5 px-5 snap-x"
                          >
                            {days.map(({ d, i }) => {
                              const sel = sameDay(data.date, d);
                              return (
                                <Label key={dateKey(d)} className={cn('chip-ui col shrink-0 snap-start', sel && 'on')} style={{ width: 80, minWidth: 80, padding: '12px 4px' }}>
                                  <RadioGroupItem value={dateKey(d)} aria-label={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} />
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
                          <div className="rise" style={{ minWidth: 0 }}>
                            <div className="flex justify-between items-baseline flex-wrap gap-x-4 mb-3">
                              <p className="lbl-ui lbl-flat" id="time-lbl">{t('time')}</p>
                              <span className="text-xs c-mute">{t('session')} {invoice.dur} {t('min')}</span>
                            </div>
                            {availableCount > 0 && availableCount <= 2 && <p className="text-xs font-bold mb-3 c-warn">{t('lastSlots')}</p>}
                            <RadioGroup aria-labelledby="time-lbl" value={data.time} onValueChange={(v) => { vibrate(15); set({ time: v }); }} className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {slots.map(({ t: tm, ok }) => {
                                const sel = data.time === tm;
                                const peak = isHome && PEAK_HOURS.includes(tm);
                                return (
                                  <Label key={tm} className={cn('chip-ui col', sel && 'on', !ok && 'off')} style={{ padding: '12px 4px' }}>
                                    <RadioGroupItem value={tm} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} />
                                    <span aria-hidden="true">{tm}</span>
                                    {peak && ok && <span aria-hidden="true" className="text-[11px] font-bold" style={{ color: sel ? 'inherit' : 'var(--warn)' }}>{t('peak')} +{C.PEAK_FEE}</span>}
                                  </Label>
                                );
                              })}
                            </RadioGroup>
                            {availableCount === 0 && <p className="text-sm text-center py-5 c-mute">{t('noSlots')}</p>}
                            {data.time && <p className="text-[15.5px] font-semibold mt-4 flex items-center gap-2 c-ok"><Icon name="check" size={16} /> {t('from')} {data.time} {t('to')} {endTime}</p>}
                            <p className="text-xs mt-3 c-mute">{t('demo')}</p>
                            {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                          </div>
                        )}

                        <div>
                          <Label htmlFor="nm" className="lbl-ui">{t('name')}</Label>
                          <Input id="nm" autoComplete="given-name" type="text" value={data.name} maxLength={60} placeholder={t('namePh')} onChange={(e) => set({ name: e.target.value })} aria-invalid={touched && !!errors.name} aria-describedby={touched && errors.name ? 'nm-err' : undefined} />
                          {touched && errors.name && <p id="nm-err" className="err" role="alert">{errors.name}</p>}
                          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>

                        <div style={{ minWidth: 0 }}>
                          <p className="lbl-ui" id="loc-lbl">{t('place')}</p>
                          <RadioGroup aria-labelledby="loc-lbl" value={data.locType} onValueChange={(v) => set({ locType: v as 'studio' | 'home' })} className="g-2">
                            {([['studio', t('studio')], ['home', t('home')]] as const).map(([id, label]) => (
                              <Label key={id} className={cn('chip-ui', data.locType === id && 'on')}>
                                <RadioGroupItem value={id} />{label}
                              </Label>
                            ))}
                          </RadioGroup>
                          <p className="text-sm mt-3 leading-relaxed c-mute">{isHome ? t('peakNote') : t('studioInfo')}</p>
                        </div>

                        {isHome && (
                          <div className="space-y-3 rise">
                            <Input type="tel" inputMode="numeric" autoComplete="postal-code" maxLength={9} placeholder={t('cep')} aria-label="CEP" value={data.cep} onChange={(e) => handleCep(e.target.value)} />
                            <Input type="text" autoComplete="street-address" placeholder={t('street')} aria-label={t('street')} maxLength={100} value={data.street} onChange={(e) => set({ street: e.target.value })} />
                            <div className="flex gap-3">
                              <Input ref={numberRef} type="text" inputMode="numeric" placeholder={t('number')} aria-label={t('number')} maxLength={10} value={data.number} onChange={(e) => set({ number: e.target.value })} style={{ flex: '0 0 34%', minWidth: 0 }} />
                              <Input type="text" placeholder={t('comp')} aria-label={t('comp')} maxLength={40} value={data.comp} onChange={(e) => set({ comp: e.target.value })} style={{ flex: '1 1 0', minWidth: 0 }} />
                            </div>
                            <Input type="text" placeholder={t('bairro')} aria-label={t('bairro')} maxLength={60} value={data.bairro} onChange={(e) => set({ bairro: e.target.value })} />
                            {touched && errors.address && <p className="err" role="alert">{errors.address}</p>}
                          </div>
                        )}

                        <div>
                          <Button className="btn-ui btn-p btn-lg w-full" onClick={goReview}>{t('cont')}</Button>
                          <p className="text-sm text-center mt-4 c-mute">{t('chatQ')} <a href={chatLink} target="_blank" rel="noopener noreferrer" className="lnk-ui">{t('chatBtn')}</a></p>
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
                        <Card className="p-6 space-y-3">
                          <Row label={t('sPack')} value={pt.title} />
                          <Row label={t('sWhen')} value={data.date ? `${fmt(data.date, { weekday: 'short', day: '2-digit', month: 'short' })}, ${data.time} – ${endTime}` : ''} />
                          <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number}` : t('sLocStudio')} />
                          <Button onClick={() => scrollToRef(s3Ref, 30)} className="lnk-ui lnk-block lnk-left text-sm">{t('change')}</Button>
                        </Card>

                        <div style={{ minWidth: 0 }}>
                          <p className="lbl-ui" id="pay-lbl">{t('pay')}</p>
                          <RadioGroup aria-labelledby="pay-lbl" value={data.payment} onValueChange={(v) => { vibrate(15); set({ payment: v }); }} className="g-3">
                            {(['pix', 'card', 'cash'] as const).map((p) => (
                              <Label key={p} className={cn('chip-ui', data.payment === p && 'on')} style={{ fontSize: 15, padding: '8px' }}>
                                <RadioGroupItem value={p} />{t(p)}
                              </Label>
                            ))}
                          </RadioGroup>
                          {data.payment === 'card' && <p className="text-sm mt-3 c-mute">{t('cardNote')}</p>}
                        </div>

                        <Card className="px-6">
                          <button type="button" aria-expanded={extrasOpen} onClick={() => setExtrasOpen((v) => !v)} className="faq-btn">
                            <span>{t('extras')}</span>
                            <span className={cn('faq-icon', extrasOpen && 'open')} aria-hidden="true">+</span>
                          </button>
                          {extrasOpen && (
                            <div className="pb-6 space-y-6 px-1 rise">
                              <div className="flex items-center gap-3">
                                <Checkbox id="add-time" checked={data.addTime} onCheckedChange={(c) => { vibrate(15); set({ addTime: c }); }} className="chk-mid" />
                                <Label htmlFor="add-time" className="lbl-chk flex flex-1 justify-between gap-3 items-center" style={{ minHeight: 44, fontSize: 16 }}>
                                  <span>{t('lTime')}</span><span className="font-bold">+ {money(C.TIME_ADD)}</span>
                                </Label>
                              </div>
                              {!isPack && !coupon.applied && (
                                <div>
                                  <Label htmlFor="cp" className="lbl-ui">{t('couponQ')}</Label>
                                  <div className="flex gap-2">
                                    <Input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && applyCoupon()} className="uppercase flex-1" style={{ minWidth: 0 }} aria-describedby={coupon.error ? 'cp-err' : undefined} />
                                    <Button onClick={applyCoupon} className="btn-ui btn-g">{t('apply')}</Button>
                                  </div>
                                  {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                                </div>
                              )}
                              <div>
                                <p className="lbl-ui">{t('reqQ')}</p>
                                <div className="flex items-start gap-3 text-sm leading-relaxed mb-3">
                                  <Checkbox id="req-ok" checked={reqOk} onCheckedChange={(c) => { setReqOk(c); if (!c) set({ req: '' }); }} />
                                  <p className="c-mute"><Label htmlFor="req-ok" className="lbl-chk">{t('reqConsent')} </Label><LinkBtn onClick={() => setDoc('privacy')}>{t('learn')}</LinkBtn></p>
                                </div>
                                <Label htmlFor="rq" className="sr-only">{t('reqPh')}</Label>
                                <Input id="rq" type="text" disabled={!reqOk} placeholder={t('reqPh')} maxLength={140} value={data.req} onChange={(e) => set({ req: e.target.value })} />
                                <p className="text-xs mt-3 c-mute">{t('reqNote')}</p>
                              </div>
                            </div>
                          )}
                        </Card>

                        <Card className="p-6">
                          <div className="space-y-3 mb-5">
                            <Row label={isPack ? t('lPack5') : t('lPack')} value={money(invoice.sessionPrice)} />
                            {invoice.aparoAdd > 0 && <Row label={t('lCombo')} value={`+${money(invoice.aparoAdd)}`} />}
                            {invoice.timeAdd > 0 && <Row label={t('lTime')} value={`+${money(invoice.timeAdd)}`} />}
                            {invoice.reqFee > 0 && <Row label={t('lReq')} value={`+${money(invoice.reqFee)}`} />}
                            {invoice.discount > 0 && <Row tone="ok" label={coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')} value={`-${money(invoice.discount)}`} />}
                            {invoice.pixDiscount > 0 && <Row tone="ok" label={t('lPix')} value={`-${money(invoice.pixDiscount)}`} />}
                            {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                          </div>
                          <Separator />
                          <div className="flex justify-between items-end gap-4 pt-5">
                            <span className="c-mute">{t('total')}</span>
                            <span className="serif text-[46px] leading-none font-light">{money(invoice.total)}</span>
                          </div>
                          {invoice.saved > 0 && <p className="mt-4 text-[15px] font-extrabold text-center py-2.5 rounded-2xl c-ok" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)' }}>{t('saved')} {money(invoice.saved)}</p>}
                          <div className="grid grid-cols-2 gap-3 mt-4 text-center">
                            <div className="rounded-2xl p-3 bg-s2"><p className="text-xs c-mute">{t('signal')}</p><p className="font-extrabold">{money(invoice.sinal)}</p></div>
                            <div className="rounded-2xl p-3 bg-s2"><p className="text-xs c-mute">{t('rest')}</p><p className="font-extrabold">{money(invoice.rest)}</p></div>
                          </div>
                        </Card>

                        <p className="text-[15.5px] leading-relaxed">
                          {t('sigA')} <strong>{money(invoice.sinal)}</strong> {t('sigB')}{' '}
                          <Button onClick={copyPix} className="lnk-ui lnk-block lnk-left"><Icon name="copy" size={15} /> {t('copyPix')}</Button>
                        </p>

                        <div className="flex items-start gap-3 text-sm leading-relaxed c-mute">
                          <Checkbox id="opt-in" checked={optIn} onCheckedChange={setOptIn} />
                          <Label htmlFor="opt-in" className="lbl-chk">{t('optIn')}</Label>
                        </div>

                        {renderAge('age-ok')}

                        <Button onClick={finish} disabled={!data.payment || !ageOk} className="btn-ui btn-p btn-xl w-full">
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
              <div className="flex items-center gap-5 mb-5 flex-col sm:flex-row text-center sm:text-left">
                <Avatar className="w-20 h-20 rounded-full" alt="Thalyson" />
                <div>
                  <Title id="ab" className="text-[26px] md:text-[32px]">{t('aboutH')}</Title>
                  <p className="text-sm font-bold">{t('aboutR')}</p>
                </div>
              </div>
              <p className="leading-relaxed mb-3 max-w-xl mx-auto sm:mx-0 text-center sm:text-left c-mute">{t('about1')}</p>
              <p className="flex items-start justify-center sm:justify-start gap-3 text-[15.5px] leading-relaxed mb-6 max-w-xl mx-auto sm:mx-0 text-left"><Icon name="map" size={18} className="mt-1" />{t('about2')}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                <Button onClick={() => setProfileOpen(true)} className="btn-ui btn-p btn-md">{t('seeProfile')}</Button>
                <SocialButtons reviewsLabel={t('reviews')} />
              </div>
            </Reveal>
          </section>

          {/* FAQ */}
          <section className="mb-8" aria-labelledby="fq">
            <Title id="fq" className="text-[32px] md:text-[40px] mb-6">{t('faqH')}</Title>
            <Reveal>
              <Card className="px-6">
                {[['q1', 'a1'], ['q2', 'a2'], ['q3', 'a3'], ['q4', 'a4']].map(([q, a], i) => {
                  const isOpen = openFaq === q;
                  return (
                    <div key={q} style={i ? { borderTop: '1px solid var(--line)' } : undefined}>
                      <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : q)} className="faq-btn">
                        <span>{t(q)}</span>
                        <span className={cn('faq-icon', isOpen && 'open')} aria-hidden="true">+</span>
                      </button>
                      {isOpen && <p className="pb-4 leading-relaxed c-mute rise">{t(a)}</p>}
                    </div>
                  );
                })}
              </Card>
            </Reveal>
          </section>
        </>)}
      </main>

      <footer className="max-w-xl mx-auto px-6 mt-16 pt-6 text-xs leading-relaxed text-center c-mute" style={{ borderTop: '1px solid var(--line)' }}>
        <nav aria-label={t('legalNav')} className="flex flex-wrap justify-center gap-x-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <Button key={id} onClick={() => setDoc(id)} className="lnk-ui lnk-block lnk-mute">{t(k)}</Button>
          ))}
        </nav>
        <p className="mt-2">{SITE_NAME}<br />{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}<br />{LEGAL.ENDERECO}<br /><span style={{ overflowWrap: 'anywhere' }}>{LEGAL.EMAIL}</span></p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
      </footer>

      {showBar && !done && (
        <div className="bar">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-1" style={{ minWidth: 0 }}>
              <p className="text-xs leading-tight c-mute">{chosen ? pt.title : t('fromM')}</p>
              <p className="serif text-2xl leading-none">{money(chosen ? pkg.price : minMassagePrice)}</p>
            </div>
            <Button onClick={goBook} className="btn-ui btn-p shrink-0">{t('cta')}</Button>
          </div>
        </div>
      )}

      {/* Perfil */}
      {profileOpen && (
        <Modal title={t('profile')} onClose={() => setProfileOpen(false)} closeLabel={t('close')}>
          <div className="p-6">
            <div className="flex items-center gap-5 mb-5 flex-col sm:flex-row text-center sm:text-left">
              <Avatar className="w-24 h-24 rounded-full" alt="Thalyson" />
              <div>
                <h3 className="serif text-2xl leading-tight">{t('aboutH')}</h3>
                <p className="text-sm font-bold">{t('aboutR')}</p>
              </div>
            </div>
            <p className="leading-relaxed mb-2">{greeting}. {t('about1')}</p>
            <ul className="my-4 space-y-2">
              {['pBul1', 'pBul2', 'pBul3'].map((k) => (<li key={k} className="flex items-start gap-3 text-[15.5px] leading-relaxed"><Icon name="check" size={18} className="mt-1" /><span>{t(k)}</span></li>))}
            </ul>
            <dl className="rounded-2xl p-5 space-y-4 mb-6 bg-s2">
              {([['pHours', t('pHoursV').replace('{a}', fromMin(C.OPEN)).replace('{b}', fromMin(C.LAST_END))], ['pWhere', t('pWhereV')], ['pPay', t('pPayV')], ['pCancel', t('pCancelV')]] as [string, string][]).map(([k, v]) => (
                <div key={k}><dt className="text-xs font-bold c-mute">{t(k)}</dt><dd className="text-[15.5px] font-semibold">{v}</dd></div>
              ))}
              <div><dt className="text-xs font-bold c-mute">{t('sLoc')}</dt><dd className="text-[15.5px] font-semibold">{t('about2')}</dd></div>
            </dl>
            <div className="grid gap-3 mb-6">
              {phase === 'site' && <Button className="btn-ui btn-p w-full" onClick={() => { setProfileOpen(false); goBook(); }}>{t('cta')}</Button>}
              <Button asChild className="btn-ui btn-g w-full">
                <a href={chatLink} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> {t('chatBtn')}</a>
              </Button>
              <SocialButtons reviewsLabel={t('reviews')} grid />
            </div>
            <Button onClick={forgetMe} className="lnk-ui lnk-block lnk-mute lnk-full">{t('pForget')}</Button>
          </div>
        </Modal>
      )}

      {/* Documentos legais */}
      {doc && (
        <Modal title={DOCS[doc].title} onClose={() => setDoc(null)} closeLabel={t('close')}>
          <div className="p-5 text-sm leading-relaxed c-mute" tabIndex={0}>
            {t('legalNote') && <p className="mb-3 font-semibold c-ink">{t('legalNote')}</p>}
            {DOCS[doc].body}
          </div>
        </Modal>
      )}
    </div>
  );
}
