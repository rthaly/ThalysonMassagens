'use client'

import {
  useState, useEffect, useMemo, useRef, useCallback, useContext, createContext, useId, memo, forwardRef, cloneElement, isValidElement,
  type ReactNode, type ReactElement, type CSSProperties,
  type ButtonHTMLAttributes, type InputHTMLAttributes, type LabelHTMLAttributes, type HTMLAttributes,
} from 'react';
import { track } from '@vercel/analytics';
import { sessions, reviews as REVIEWS_PT } from '@/lib/content';
import { AssistantChat, type ChatBooking } from '@/components/assistant-chat';

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
  PIX_KEY: 'relaxecomthalyson@gmail.com',
  PIX_LABEL: 'E-mail',
  PAY_LINK: 'https://link.mercadopago.com.br/thalysonm', // link de pagamento do Mercado Pago (a pessoa digita o valor)
  INSTAGRAM: 'https://www.instagram.com/relaxecomthalyson',
  PORTFOLIO: 'https://thalysondesigner.vercel.app/',
  REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  AVATAR: '/thalyson.jpg',
  COUPONS: { RELAXAR13: 0.13, SESSAO2: 0.08 } as Record<string, number>,
  PUBLIC_COUPONS: [
    { code: 'RELAXAR13', pct: 13 },
    { code: 'SESSAO2', pct: 8 },
  ],
  SIGNAL: 40,
  FIRST: 15,
  REQ_FEE: 140,
  PEAK_FEE: 18,
  PIX_DISC: 0, // sem desconto por forma de pagamento: preço único e redondo
  TIME_ADD: 75,
  APARO_FULL: 130,
  BIWEEKLY_DISC: 0.10,
  BIWEEKLY_DAYS: 30,
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
type Offer = 'single' | 'combo' | 'biweekly' | 'pack';
type DocId = 'privacy' | 'terms' | 'refund' | 'cookies';
type PkgTheme = 'sage' | 'amber' | 'crimson' | 'midnight' | 'slate';
type PkgText = { title: string; subtitle: string; desc: string; flow: string[] };
type Ref<E> = { current: E | null };

const LOCALE: Record<Lang, string> = { pt: 'pt-BR', en: 'en-US', es: 'es-ES' };
const LANG_NAME: Record<Lang, string> = { pt: 'Português', en: 'English', es: 'Español' };

const T: Record<Lang, Record<string, string>> = {
  pt: {
    loadMsg: 'Preparando seu horário reservado', badge: 'Bela Vista, perto do Metrô Anhangabaú',
    wSub: 'Atendimento individual em São Paulo. Você escolhe a sessão, marca o horário em 1 minuto e confirma direto comigo no WhatsApp.',
    
    enter: 'Ver sessões e horários', needAgeEnter: 'Confirme que tem 18 anos ou mais',
    h1: 'Tire o peso do corpo. Desligue a cabeça.',
    sub: 'Atendimento individual na Bela Vista ou no seu endereço, em São Paulo. Você vê a duração e o valor de cada sessão antes de marcar.',
    cta: 'Escolher sessão e horário', reviews: 'Avaliações no Google', nextFree: 'Próximo horário livre', today: 'hoje', tomorrow: 'amanhã', fromM: 'Sessões a partir de',
    
    
    
    
    
    
    
    s1: 'Escolha a sessão', s2: 'Avulsa, combo ou plano', s3: 'Onde, dia e horário', s4: 'Confira e envie',
    min: 'min', flowH: 'O que acontece', firstBadge: '1ª vez: R$ 15 off', firstShort: '1ª vez', pixHint: 'no Pix',
    oSingle: 'Sessão avulsa', oSingleD: 'Sem compromisso. Já entra com R$ 15 de desconto na primeira vez.',
    oCombo: 'Sessão + aparo de pelos', oComboD: 'Faço o aparo na máquina em até 3 regiões no mesmo atendimento.',
    oBiweekly: '2x no mês (Quinzenal • 10% off)', oBiweeklyD: '2 sessões para usar em até {n} dias. Você marca a 1ª agora e combina a 2ª direto comigo.',
    oPack: 'Pacote 5 sessões (1 grátis)', oPackD: 'Pague 4 e ganhe a 5ª. Validade de {n} dias para agendar pelo WhatsApp.',
    save: 'Economia de', was: 'De', listen: 'Ouvir descrição', pause: 'Pausar', resume: 'Continuar', stopA: 'Parar',
    voiceLow: 'Áudio adaptado para este aparelho', noTts: 'Seu navegador não tem suporte para áudio.',
    skip: 'Ir para o conteúdo', legalNav: 'Documentos legais',
    packNote: 'Planos e pacotes já têm desconto, então não acumulam com cupons. Você marca a 1ª data aqui e combina as próximas direto comigo.',
    recSlotH: 'Horário recomendado livre agora', recSlotBtn: 'Usar este horário',
    name: 'Como você quer ser chamado?', namePh: 'Seu nome ou apelido', nameErr: 'Digite pelo menos 3 letras.',
    place: 'Onde vai ser?', studio: 'Na minha suíte (Bela Vista)', home: 'No seu endereço (SP)',
    homeInfo: 'Vou até o seu endereço levando os cremes. Esteja de banho tomado na hora combinada. Nos horários de trânsito pesado há taxa de deslocamento de R$ 18.',
    studioInfo: 'Suíte simples e reservada na Bela Vista, perto do Metrô Anhangabaú. Venha de banho tomado. Mando a localização exata quando confirmar.',
    cep: 'CEP', street: 'Rua ou Avenida', number: 'Nº', comp: 'Apto / Bloco', bairro: 'Bairro', addrErr: 'Preencha rua, número e bairro.', cepFail: 'CEP não encontrado. Preencha manualmente.',
    date: 'Dia', time: 'Horário de início', session: 'Duração:', peak: 'Trânsito', noSlots: 'Agenda cheia neste dia. Escolha outra data acima.',
    demo: 'Horários sujeitos a confirmação rápida no WhatsApp.', dateErr: 'Escolha um dia.', timeErr: 'Escolha um horário.', from: 'Das', to: 'às', unavailable: 'ocupado',
    cont: 'Ver resumo e valores', fill: 'Preencha os campos destacados acima', change: 'Alterar dados', sPack: 'Sessão', sWhen: 'Data e horário', sLoc: 'Local', sLocStudio: 'Suíte Bela Vista (próximo ao Metrô Anhangabaú)',
    lPack: 'Sessão escolhida', lPack2: 'Plano 2x no mês (2 sessões)', lPack5: 'Pacote 5 sessões (4 pagas)', lCombo: 'Aparo de pelos (combo)', lTime: '+30 minutos extras', lReq: 'Pedido específico', lSubtotal: 'Subtotal sem descontos', lPlanDisc: 'Desconto do plano/pacote', lFirst: 'Desconto 1ª sessão', lCoupon: 'Cupom aplicado', lPeak: 'Deslocamento / trânsito', lPix: 'Desconto Pix (3%)',
    saved: 'Total economizado', total: 'Valor total final', signal: 'Sinal da reserva (Pix agora)', rest: 'Restante após a sessão',
    prefsH: 'Clima da sessão (opcional)', prefIncenseS: 'Incenso aceso', prefMusicS: 'Música ambiente', seeReviews: 'Ver avaliações', aboutN: 'Thalyson, na Bela Vista (SP)',
    prefIncense: 'Gosto de incenso aceso',
    prefMusic: 'Quero música ambiente tocando',
    extras: 'Adicionar +30 min, cupom ou pedido', couponQ: 'Tem um cupom?', couponPh: 'Digite o código', apply: 'Aplicar', couponOk: 'Cupom aplicado!', couponBad: 'Cupom inválido.', couponRemove: 'Remover',
    reqQ: 'Tem algum pedido específico? (+ R$ 140)', learn: 'Saiba mais',
    reqConsent: 'Autorizo enviar este pedido apenas para avaliação no WhatsApp. Não fica salvo no site.',
    reqPh: 'Escreva o que gostaria de incluir', reqNote: 'Avalio antes de confirmar; se não der para fazer, não cobro nada a mais.',
    pay: 'Como prefere pagar?', sinalH: 'Agora: sinal de {v}', restP: 'No Pix, no cartão por aproximação no meu celular ou em dinheiro, como preferir.', wizStep: 'Passo {a} de {b}', wizBack: 'Voltar', wizNext: 'Continuar', wizPkg: 'Continuar com esta sessão', sinalP: 'Segura o horário só para você e já sai do total.', restH: 'Depois da sessão: {v}', pix: 'Pix', card: 'Cartão até 12x', cash: 'Dinheiro', cardNote: 'Cartão por aproximação direto no meu celular, é só encostar.',
    healthStudio: 'Declaro que estou com a saúde em dia (sem febre, sintomas gripais ou irritações na pele) e que irei já de banho tomado.',
    healthHome: 'Declaro que estou com a saúde em dia (sem febre, sintomas gripais ou irritações na pele) e que já estarei de banho tomado quando você chegar.',
    optIn: 'Pode me avisar no WhatsApp quando abrir horário livre ou promoção.',
    ageA: 'Confirmo ter 18 anos ou mais e concordo com a', privacy: 'Política de Privacidade', terms: 'Termos', and: 'e', refund: 'Regras de Cancelamento',
    sigA: 'Para travar esse horário só para você, faça o Pix do sinal de', sigB: 'Esse valor já é abatido e você paga o restante de', sigC: 'só depois da sessão.', copyPix: 'Copiar chave Pix (e-mail)', pixCopied: 'Chave Pix copiada!', payLink: 'Pagar {v} no Mercado Pago', payHint: 'Na página do Mercado Pago, digite {v} e conclua. Depois me mande o comprovante no WhatsApp.',
    send: 'Mandar pedido no WhatsApp', needPay: 'Escolha como vai pagar o restante', needHealth: 'Confirme saúde em dia e banho tomado', needAge: 'Confirme que tem 18 anos ou mais',
    doneH: 'Resumo pronto', doneP: 'Agora é só enviar a mensagem que abriu no seu WhatsApp junto com o comprovante do sinal de R$ 40 para eu travar seu horário.',
    doneSig: 'Chave Pix (e-mail):', resend: 'Abrir WhatsApp novamente', addCal: 'Salvar na agenda', restart: 'Fazer outro agendamento',
    chatQ: 'Ficou com alguma dúvida antes de marcar?', chatBtn: 'Falar no WhatsApp', chatMsg: 'Oi Thalyson! Vi seu site e queria tirar uma dúvida sobre a massagem.',
    revH: 'Quem já passou por aqui', revS: 'Comentários enviados via WhatsApp de quem já relaxou comigo.', revMore: 'Ver mais avaliações ({n})', revLess: 'Mostrar menos', revBtn: 'Avaliar no Google',
    aboutH: 'Quem vai te atender', aboutR: 'Atendimento direto comigo, sem intermediários',
    about1: 'Tenho 30 anos, sou do interior de SP e cheguei em São Paulo há menos de 1 ano. Ainda estou me instalando e conhecendo a cidade, então meu atendimento é bem direto e sem luxo de clínica: uma suíte residencial simples e reservada na Bela Vista para você desligar da correria.',
    about2: 'Suíte simples e reservada, perto do Metrô Anhangabaú, com maca de madeira e horário só seu.', seeProfile: 'Ver detalhes do espaço',
    faqH: 'Dúvidas diretas', faqS: 'Toque em uma pergunta ou escreva a sua. O assistente responde na hora, com os avisos do dia.', faqOwn: 'Escrever minha dúvida',
    
    q2: 'E se eu precisar remarcar?',
    q3: 'Meus dados ficam salvos?',
    
    q5: 'Nunca fui em massagem assim, fico meio travado. Tudo bem?',
    footPrivacy: 'Privacidade', footTerms: 'Termos', footRefund: 'Cancelamento', footCookies: 'Cookies', adults: 'Atendimento exclusivo para maiores de 18 anos.',
    builtBy: 'Site desenvolvido por',
    close: 'Fechar', theme: 'Mudar cor da tela', lang: 'Idioma', srLight: 'Mudar para tema claro', srDark: 'Mudar para tema escuro', legalNote: '',
    profile: 'Sobre o atendimento', openProfile: 'Ver perfil de Thalyson', gm: 'Bom dia', ga: 'Boa tarde', gn: 'Boa noite',
    pBul1: 'Conversa rápida antes de começar para alinhar pressão, música e incenso',
    pBul2: 'Horário exclusivo: você não cruza com ninguém na entrada ou saída',
    pBul3: 'Suíte residencial reservada na Bela Vista ou no seu endereço em SP (esteja já de banho tomado)',
    pHours: 'Horários', pHoursV: 'Todos os dias, das {a} às {b}', pPay: 'Pagamento', pPayV: 'Pix, cartão por aproximação no celular ou dinheiro',
    pWhere: 'Local', pWhereV: 'Bela Vista (perto do Metrô Anhangabaú) ou no seu endereço', pCancel: 'Cancelamento', pCancelV: 'Grátis avisando até 12h antes',
    pForget: 'Apagar meus dados deste aparelho', forgot: 'Pronto, dados apagados.',
    recommended: 'Mais escolhida', smartSub: 'Que bom te ver de volta. Escolha o dia e o horário.', lastSlots: 'Últimos horários livres hoje', upTo: 'pode ir até', howH: 'Como funciona', howS: 'Sem cadastro e sem pagar nada no site.', how1T: 'Escolha a sessão', how1D: 'Veja duração, valor e os horários livres.', how2T: 'Mande o pedido', how2D: 'O resumo vai pronto para o meu WhatsApp.', how3T: 'Confirme com o sinal', how3D: 'O sinal de R$ 40 segura o horário e sai do total. O restante você paga depois da sessão.', howNote: 'Venha de banho tomado. Incenso e música ficam por sua escolha, na hora do pedido.', endH: 'Vamos marcar?', endP: 'Leva um minuto. O pedido vai pronto para o meu WhatsApp.', q6: 'Atende no meu endereço?', sessS: 'Primeira sessão: R$ 15 de desconto já aplicado nos valores (o aparo avulso não tem desconto).', 
    quizH: 'Não sabe qual escolher?', quizS: '3 toques e eu te indico a sessão certa para hoje.', quizStart: 'Descobrir minha sessão',
    quizQ1: 'O que você mais precisa hoje?', quizA1a: 'Soltar costas e ombros travados', quizA1b: 'Desligar a cabeça e relaxar o corpo todo', quizA1c: 'Algo mais intenso e com mais contato', quizA1d: 'Só aparar os pelos',
    quizQ2: 'Já fez uma sessão assim antes?', quizA2a: 'É minha primeira vez', quizA2b: 'Já fiz outras vezes',
    quizQ3: 'Pensa em vir com frequência?', quizA3a: 'Só hoje, por enquanto', quizA3b: 'Quero fazer disso uma rotina',
    quizRes: 'Minha indicação para você', quizGo: 'Reservar esta sessão', quizRedo: 'Refazer', quizStep: 'Pergunta {a} de {b}',
    
    
    
    
    
    quizPlan: 'Com o plano 2x no mês você economiza {v}.', quizFirst: 'Primeira vez: R$ 15 de desconto já aplicado.',
    draftH: 'Continuar sua reserva?', draftP: '{s} • {d}', draftBtn: 'Continuar', draftNo: 'Começar do zero',
    nudgeH: 'Ficou alguma dúvida?', nudgeP: 'Me chama no WhatsApp que eu respondo rápido. Sua sessão já vai escrita na mensagem.', nudgeBtn: 'Tirar dúvida no WhatsApp', nudgeClose: 'Agora não',
    nudgeMsg: 'Oi Thalyson! Estava vendo a sessão {s} no site e fiquei com uma dúvida:',
    liveCal: 'Horários conferidos agora na agenda do Thalyson.',
  },
  en: {
    loadMsg: 'Preparing your private slot', badge: 'Bela Vista, near Anhangabaú Metro',
    wSub: 'One-on-one men’s massage in São Paulo. Pick your session, book in 1 minute and confirm directly with me on WhatsApp.',
    
    enter: 'See sessions and times', needAgeEnter: 'Confirm you are 18 or older',
    h1: 'Drop the tension. Clear your head.',
    sub: 'One-on-one sessions in Bela Vista or at your address in São Paulo. You see the length and price of each session before booking.',
    cta: 'Choose session and time', reviews: 'Google Reviews', nextFree: 'Next open slot', today: 'today', tomorrow: 'tomorrow', fromM: 'Sessions from',
    
    
    
    
    
    
    
    s1: 'Choose your session', s2: 'Single, combo or plan', s3: 'Where, day and time', s4: 'Review and send',
    min: 'min', flowH: 'What happens', firstBadge: '1st visit: R$ 15 off', firstShort: '1st visit', pixHint: 'on Pix',
    oSingle: 'Single session', oSingleD: 'No commitment. Includes R$ 15 off your first visit.',
    oCombo: 'Session + body trimming', oComboD: 'Clipper trimming on up to 3 areas in the same appointment.',
    oBiweekly: '2x a month (Biweekly • 10% off)', oBiweeklyD: '2 sessions to use within {n} days. Book your 1st now and schedule the 2nd directly with me.',
    oPack: '5-session pack (1 free)', oPackD: 'Pay for 4 and get the 5th free. Valid for {n} days via WhatsApp.',
    save: 'You save', was: 'Was', listen: 'Listen to description', pause: 'Pause', resume: 'Resume', stopA: 'Stop',
    voiceLow: 'Adapted voice mode for this device', noTts: 'Your browser does not support audio narration.',
    skip: 'Skip to content', legalNav: 'Legal documents',
    packNote: 'Plans and packs already include a discount, so they do not stack with coupons. Book your 1st date here and arrange the next ones directly with me.',
    recSlotH: 'Next open recommended slot', recSlotBtn: 'Use this time',
    name: 'What should I call you?', namePh: 'Your first name or nickname', nameErr: 'Enter at least 3 letters.',
    place: 'Where will it be?', studio: 'At my suite (Bela Vista)', home: 'At your address (SP)',
    homeInfo: 'I come to your address bringing the creams. Be freshly showered by the scheduled time. Heavy traffic hours carry an R$ 18 travel fee.',
    studioInfo: 'A simple, private suite in Bela Vista, near Anhangabaú Metro. Arrive freshly showered. I send the exact location once confirmed.',
    cep: 'ZIP code', street: 'Street or Avenue', number: 'No.', comp: 'Apt / Unit', bairro: 'Neighborhood', addrErr: 'Fill in street, number and neighborhood.', cepFail: 'ZIP code not found. Fill in manually.',
    date: 'Day', time: 'Start time', session: 'Duration:', peak: 'Traffic', noSlots: 'Fully booked on this day. Pick another date above.',
    demo: 'Times subject to quick confirmation on WhatsApp.', dateErr: 'Choose a day.', timeErr: 'Choose a time.', from: 'From', to: 'to', unavailable: 'booked',
    cont: 'See summary and prices', fill: 'Fill in the highlighted fields above', change: 'Edit details', sPack: 'Session', sWhen: 'Date & time', sLoc: 'Location', sLocStudio: 'Bela Vista Suite (near Anhangabaú Metro)',
    lPack: 'Chosen session', lPack2: '2x a month plan (2 sessions)', lPack5: '5-session pack (4 paid)', lCombo: 'Body trimming (combo)', lTime: '+30 extra minutes', lReq: 'Specific request', lSubtotal: 'Subtotal before discounts', lPlanDisc: 'Plan/pack discount', lFirst: '1st session discount', lCoupon: 'Coupon applied', lPeak: 'Travel / traffic', lPix: 'Pix discount (3%)',
    saved: 'Total saved', total: 'Final total', signal: 'Booking deposit (Pix now)', rest: 'Balance after session',
    prefsH: 'Session atmosphere (optional)', prefIncenseS: 'Incense on', prefMusicS: 'Background music', seeReviews: 'See reviews', aboutN: 'Thalyson, in Bela Vista (SP)',
    prefIncense: 'I like incense burning',
    prefMusic: 'I want background music playing',
    extras: 'Add +30 min, coupon or request', couponQ: 'Have a coupon?', couponPh: 'Type the code', apply: 'Apply', couponOk: 'Coupon applied!', couponBad: 'Invalid coupon.', couponRemove: 'Remove',
    reqQ: 'Any specific request? (+ R$ 140)', learn: 'Learn more',
    reqConsent: 'I consent to sending this request for evaluation on WhatsApp only. Not saved on the site.',
    reqPh: 'Write what you would like to include', reqNote: 'Evaluated before confirming; if not feasible, nothing extra is charged.',
    pay: 'How would you like to pay?', sinalH: 'Now: {v} deposit', restP: 'By Pix, card by tap on my phone, or cash, whatever you prefer.', wizStep: 'Step {a} of {b}', wizBack: 'Back', wizNext: 'Continue', wizPkg: 'Continue with this session', sinalP: 'It holds the time just for you and comes off the total.', restH: 'After the session: {v}', pix: 'Pix', card: 'Card up to 12x', cash: 'Cash', cardNote: 'Card by tap, right on my phone.',
    healthStudio: 'I declare I am in good health (no fever, flu symptoms or skin irritations) and will arrive freshly showered.',
    healthHome: 'I declare I am in good health (no fever, flu symptoms or skin irritations) and will already be freshly showered when you arrive.',
    optIn: 'Notify me on WhatsApp when open slots or promos come up.',
    ageA: 'I confirm I am 18 or older and agree to the', privacy: 'Privacy Policy', terms: 'Terms', and: 'and', refund: 'Cancellation Rules',
    sigA: 'To lock this time exclusively for you, send the Pix deposit of', sigB: 'This amount is deducted and you pay the remaining', sigC: 'only after the session.', copyPix: 'Copy Pix key (email)', pixCopied: 'Pix key copied!', payLink: 'Pay {v} on Mercado Pago', payHint: 'On the Mercado Pago page, enter {v} and finish. Then send me the receipt on WhatsApp.',
    send: 'Send request on WhatsApp', needPay: 'Choose how you will pay the rest', needHealth: 'Confirm good health & freshly showered', needAge: 'Confirm you are 18 or older',
    doneH: 'Summary ready', doneP: 'Just send the message that opened in WhatsApp along with your R$ 40 deposit receipt so I can lock your slot.',
    doneSig: 'Pix Key (email):', resend: 'Open WhatsApp again', addCal: 'Save to calendar', restart: 'Make another booking',
    chatQ: 'Have a question before booking?', chatBtn: 'Chat on WhatsApp', chatMsg: 'Hi Thalyson! I saw your site and have a quick question about the massage.',
    revH: 'Client feedback', revS: 'Notes sent on WhatsApp by people who came for a session.', revMore: 'See more reviews ({n})', revLess: 'Show less', revBtn: 'Review on Google',
    aboutH: 'Who will see you', aboutR: 'Direct service with me, no middlemen',
    about1: 'I’m 30, from upstate SP, and moved to São Paulo less than a year ago. I’m still settling in and getting to know the city, so my service is straightforward without fake clinic luxury—a simple, private suite in Bela Vista for you to unplug.',
    about2: 'A simple, private suite near Anhangabaú Metro, with a wooden table and a time slot just for you.', seeProfile: 'See space details',
    faqH: 'Straight answers', faqS: 'Tap a question or write your own. The assistant answers right away, with today\'s notices.', faqOwn: 'Write my question',
    
    q2: 'What if I need to reschedule?',
    q3: 'Is my data saved?',
    
    q5: 'First time doing a massage like this and feeling shy. Is that okay?',
    footPrivacy: 'Privacy', footTerms: 'Terms', footRefund: 'Cancellation', footCookies: 'Cookies', adults: 'Service strictly for adults 18 and older.',
    builtBy: 'Website built by',
    close: 'Close', theme: 'Switch screen theme', lang: 'Language', srLight: 'Switch to light theme', srDark: 'Switch to dark theme', legalNote: 'Legal documents are provided in Portuguese, which is the binding version.',
    profile: 'About the session', openProfile: 'Open Thalyson’s profile', gm: 'Good morning', ga: 'Good afternoon', gn: 'Good evening',
    pBul1: 'Quick chat before starting to align pressure, music and incense',
    pBul2: 'Exclusive slot: you never cross paths with anyone entering or leaving',
    pBul3: 'Private residential suite in Bela Vista or at your SP address (please be freshly showered)',
    pHours: 'Hours', pHoursV: 'Every day, from {a} to {b}', pPay: 'Payment', pPayV: 'Pix, card by tap on my phone, or cash',
    pWhere: 'Location', pWhereV: 'Bela Vista (near Anhangabaú Metro) or at your address', pCancel: 'Cancellation', pCancelV: 'Free up to 12h in advance',
    pForget: 'Clear my data from this device', forgot: 'Done, data cleared.',
    recommended: 'Most booked', smartSub: 'Good to see you back. Pick your day and time.', lastSlots: 'Last open slots today', upTo: 'may run until', howH: 'How it works', howS: 'No sign-up and nothing to pay on the site.', how1T: 'Pick a session', how1D: 'See length, price and free times.', how2T: 'Send the request', how2D: 'The summary arrives ready on my WhatsApp.', how3T: 'Confirm with the deposit', how3D: 'The R$ 40 deposit holds the time and comes off the total. You pay the rest after the session.', howNote: 'Arrive freshly showered. Incense and music are your choice when you book.', endH: 'Ready to book?', endP: 'It takes a minute. The request arrives ready on my WhatsApp.', q6: 'Do you come to my address?', sessS: 'First session: R$ 15 off already applied to the prices (the trim alone has no discount).', 
    quizH: 'Not sure which one?', quizS: '3 taps and I’ll point you to the right session for today.', quizStart: 'Find my session',
    quizQ1: 'What do you need most today?', quizA1a: 'Loosen a stiff back and shoulders', quizA1b: 'Switch off and relax the whole body', quizA1c: 'Something more intense, with more contact', quizA1d: 'Just a trim',
    quizQ2: 'Have you done a session like this before?', quizA2a: 'It’s my first time', quizA2b: 'I’ve done it before',
    quizQ3: 'Planning to come regularly?', quizA3a: 'Just today, for now', quizA3b: 'I want to make it a routine',
    quizRes: 'My pick for you', quizGo: 'Book this session', quizRedo: 'Start over', quizStep: 'Question {a} of {b}',
    
    
    
    
    
    quizPlan: 'With the 2x a month plan you save {v}.', quizFirst: 'First time: R$ 15 off already applied.',
    draftH: 'Continue your booking?', draftP: '{s} • {d}', draftBtn: 'Continue', draftNo: 'Start fresh',
    nudgeH: 'Any questions?', nudgeP: 'Message me on WhatsApp and I’ll reply fast. Your session is already in the message.', nudgeBtn: 'Ask on WhatsApp', nudgeClose: 'Not now',
    nudgeMsg: 'Hi Thalyson! I was looking at the {s} session on your site and have a question:',
    liveCal: 'Times checked live on Thalyson’s calendar.',
  },
  es: {
    loadMsg: 'Preparando tu horario reservado', badge: 'Bela Vista, cerca del Metro Anhangabaú',
    wSub: 'Atención individual en São Paulo. Eliges la sesión, agendas en 1 minuto y confirmas directo conmigo por WhatsApp.',
    
    enter: 'Ver sesiones y horarios', needAgeEnter: 'Confirma que tienes 18 años o más',
    h1: 'Suelta el peso del cuerpo. Apaga la cabeza.',
    sub: 'Atención individual en Bela Vista o en tu dirección, en São Paulo. Ves la duración y el precio de cada sesión antes de reservar.',
    cta: 'Elegir sesión y horario', reviews: 'Ver reseñas en Google', nextFree: 'Próximo horario libre', today: 'hoy', tomorrow: 'mañana', fromM: 'Sesiones desde',
    
    
    
    
    
    
    
    s1: 'Elige la sesión', s2: 'Individual, combo o plan', s3: 'Dónde, día y horario', s4: 'Revisa y envía',
    min: 'min', flowH: 'Qué pasa', firstBadge: '1ª vez: R$ 15 off', firstShort: '1ª vez', pixHint: 'en Pix',
    oSingle: 'Sesión individual', oSingleD: 'Sin compromiso. Ya entra con R$ 15 de descuento la primera vez.',
    oCombo: 'Sesión + recorte de vello', oComboD: 'Recorte a máquina en hasta 3 zonas en la misma atención.',
    oBiweekly: '2x al mes (Quincenal • 10% off)', oBiweeklyD: '2 sesiones para usar en hasta {n} días. Agendas la 1ª ahora y combinas la 2ª directo conmigo.',
    oPack: 'Paquete 5 sesiones (1 gratis)', oPackD: 'Paga 4 y gana la 5ª. Validez de {n} días para agendar por WhatsApp.',
    save: 'Ahorro de', was: 'Antes', listen: 'Oír descripción', pause: 'Pausar', resume: 'Continuar', stopA: 'Detener',
    voiceLow: 'Audio adaptado para este dispositivo', noTts: 'Tu navegador no soporta narración en audio.',
    skip: 'Ir al contenido', legalNav: 'Documentos legales',
    packNote: 'Planes y paquetes ya tienen descuento, así que no suman con cupones. Agendas la 1ª fecha aquí y combinas las siguientes directo conmigo.',
    recSlotH: 'Horario recomendado libre ahora', recSlotBtn: 'Usar este horario',
    name: '¿Cómo quieres que te llame?', namePh: 'Tu nombre o apodo', nameErr: 'Escribe al menos 3 letras.',
    place: '¿Dónde será?', studio: 'En mi suite (Bela Vista)', home: 'En tu dirección (SP)',
    homeInfo: 'Voy hasta tu dirección llevando las cremas. Ten la ducha hecha a la hora acordada. En horarios de tráfico intenso hay tasa de traslado de R$ 18.',
    studioInfo: 'Suite simple y reservada en Bela Vista, cerca del Metro Anhangabaú. Ven recién duchado. Envío la ubicación exacta al confirmar.',
    cep: 'CEP', street: 'Calle o Avenida', number: 'Nº', comp: 'Depto / Bloque', bairro: 'Barrio', addrErr: 'Completa calle, número y barrio.', cepFail: 'CEP no encontrado. Completa manualmente.',
    date: 'Día', time: 'Hora de inicio', session: 'Duración:', peak: 'Tráfico', noSlots: 'Agenda llena este día. Elige otra fecha arriba.',
    demo: 'Horarios sujetos a confirmación rápida en WhatsApp.', dateErr: 'Elige un día.', timeErr: 'Elige un horario.', from: 'De', to: 'a', unavailable: 'ocupado',
    cont: 'Ver resumen y valores', fill: 'Completa los campos marcados arriba', change: 'Cambiar datos', sPack: 'Sesión', sWhen: 'Fecha y horario', sLoc: 'Lugar', sLocStudio: 'Suite Bela Vista (cerca del Metro Anhangabaú)',
    lPack: 'Sesión elegida', lPack2: 'Plan 2x al mes (2 sesiones)', lPack5: 'Paquete 5 sesiones (4 pagas)', lCombo: 'Recorte de vello (combo)', lTime: '+30 minutos extra', lReq: 'Pedido específico', lSubtotal: 'Subtotal sin descuentos', lPlanDisc: 'Descuento plan/paquete', lFirst: 'Descuento 1ª sesión', lCoupon: 'Cupón aplicado', lPeak: 'Traslado / tráfico', lPix: 'Descuento Pix (3%)',
    saved: 'Total ahorrado', total: 'Valor total final', signal: 'Señal de reserva (Pix ahora)', rest: 'Restante después de la sesión',
    prefsH: 'Ambiente de la sesión (opcional)', prefIncenseS: 'Incienso encendido', prefMusicS: 'Música ambiente', seeReviews: 'Ver reseñas', aboutN: 'Thalyson, en Bela Vista (SP)',
    prefIncense: 'Me gusta con incienso encendido',
    prefMusic: 'Quiero música ambiental sonando',
    extras: 'Sumar +30 min, cupón o pedido', couponQ: '¿Tienes un cupón?', couponPh: 'Escribe el código', apply: 'Aplicar', couponOk: '¡Cupón aplicado!', couponBad: 'Cupón inválido.', couponRemove: 'Quitar',
    reqQ: '¿Algún pedido específico? (+ R$ 140)', learn: 'Más info',
    reqConsent: 'Autorizo enviar este pedido solo para evaluación en WhatsApp. No queda guardado en el sitio.',
    reqPh: 'Escribe qué te gustaría incluir', reqNote: 'Evalúo antes de confirmar; si no es posible hacerlo, no cobro nada extra.',
    pay: '¿Cómo prefieres pagar?', sinalH: 'Ahora: seña de {v}', restP: 'Por Pix, tarjeta por aproximación en mi celular o efectivo, como prefieras.', wizStep: 'Paso {a} de {b}', wizBack: 'Volver', wizNext: 'Continuar', wizPkg: 'Continuar con esta sesión', sinalP: 'Asegura el horario solo para ti y se descuenta del total.', restH: 'Después de la sesión: {v}', pix: 'Pix', card: 'Tarjeta hasta 12x', cash: 'Efectivo', cardNote: 'Tarjeta por aproximación directo en mi celular.',
    healthStudio: 'Declaro que estoy bien de salud (sin fiebre, síntomas gripales ni irritaciones en la piel) y que iré ya duchado.',
    healthHome: 'Declaro que estoy bien de salud (sin fiebre, síntomas gripales ni irritaciones en la piel) y que ya estaré duchado cuando llegues.',
    optIn: 'Avísame por WhatsApp cuando se libere un horario o promoción.',
    ageA: 'Confirmo tener 18 años o más y acepto la', privacy: 'Política de Privacidad', terms: 'Términos', and: 'y', refund: 'Reglas de Cancelación',
    sigA: 'Para bloquear este horario solo para ti, haz el Pix de señal de', sigB: 'Ese valor ya se descuenta y pagas el resto de', sigC: 'solo después de la sesión.', copyPix: 'Copiar clave Pix (e-mail)', pixCopied: '¡Clave Pix copiada!', payLink: 'Pagar {v} en Mercado Pago', payHint: 'En la página de Mercado Pago, escribe {v} y finaliza. Luego mándame el comprobante por WhatsApp.',
    send: 'Mandar pedido por WhatsApp', needPay: 'Elige cómo pagarás el resto', needHealth: 'Confirma salud al día y estar duchado', needAge: 'Confirma que tienes 18 años o más',
    doneH: 'Resumen listo', doneP: 'Ahora solo envía el mensaje que se abrió en tu WhatsApp junto con el comprobante de los R$ 40 para bloquear tu horario.',
    doneSig: 'Clave Pix (e-mail):', resend: 'Abrir WhatsApp nuevamente', addCal: 'Guardar en agenda', restart: 'Hacer otra reserva',
    chatQ: '¿Te quedó alguna duda antes de reservar?', chatBtn: 'Hablar por WhatsApp', chatMsg: '¡Hola Thalyson! Vi tu sitio y quería hacerte una consulta sobre el masaje.',
    revH: 'Quienes ya pasaron por aquí', revS: 'Comentarios enviados por WhatsApp de quienes ya vinieron a una sesión.', revMore: 'Ver más reseñas ({n})', revLess: 'Mostrar menos', revBtn: 'Reseñar en Google',
    aboutH: 'Quién te atiende', aboutR: 'Atención directa conmigo, sin intermediarios',
    about1: 'Tengo 30 años, soy del interior de SP y llegué a São Paulo hace menos de 1 año. Todavía me estoy instalando y conociendo la ciudad, así que mi atención es directa y sin lujo falso de clínica: una suite residencial simple y reservada en Bela Vista para desconectar.',
    about2: 'Suite simple y reservada, cerca del Metro Anhangabaú, con camilla de madera y horario solo para ti.', seeProfile: 'Ver detalles del espacio',
    faqH: 'Dudas directas', faqS: 'Toca una pregunta o escribe la tuya. El asistente responde al instante, con los avisos del día.', faqOwn: 'Escribir mi duda',
    
    q2: '¿Y si necesito reprogramar?',
    q3: '¿Mis datos quedan guardados?',
    
    q5: 'Nunca fui a un masaje así y me da algo de vergüenza. ¿Está bien?',
    footPrivacy: 'Privacidad', footTerms: 'Términos', footRefund: 'Cancelación', footCookies: 'Cookies', adults: 'Servicio exclusivo para mayores de 18 años.',
    builtBy: 'Sitio desarrollado por',
    close: 'Cerrar', theme: 'Cambiar color de pantalla', lang: 'Idioma', srLight: 'Cambiar a tema claro', srDark: 'Cambiar a tema oscuro', legalNote: 'Los documentos legales están en portugués, que es la versión vinculante.',
    profile: 'Sobre la atención', openProfile: 'Ver perfil de Thalyson', gm: 'Buenos días', ga: 'Buenas tardes', gn: 'Buenas noches',
    pBul1: 'Charla rápida antes de empezar para alinear presión, música e incienso',
    pBul2: 'Horario exclusivo: no te cruzas con nadie al entrar ni al salir',
    pBul3: 'Suite residencial reservada en Bela Vista o en tu dirección en SP (estate ya duchado)',
    pHours: 'Horarios', pHoursV: 'Todos los días, de {a} a {b}', pPay: 'Pago', pPayV: 'Pix, tarjeta por aproximación en el celular o efectivo',
    pWhere: 'Lugar', pWhereV: 'Bela Vista (cerca del Metro Anhangabaú) o en tu dirección', pCancel: 'Cancelación', pCancelV: 'Gratis avisando hasta 12h antes',
    pForget: 'Borrar mis datos de este dispositivo', forgot: 'Listo, datos borrados.',
    recommended: 'Más elegida', smartSub: 'Qué bueno verte de nuevo. Elige el día y el horario.', lastSlots: 'Últimos horarios libres hoy', upTo: 'puede llegar hasta', howH: 'Cómo funciona', howS: 'Sin registro y sin pagar nada en el sitio.', how1T: 'Elige la sesión', how1D: 'Mira duración, precio y horarios libres.', how2T: 'Envía el pedido', how2D: 'El resumen llega listo a mi WhatsApp.', how3T: 'Confirma con la señal', how3D: 'La seña de R$ 40 asegura el horario y se descuenta del total. El resto lo pagas después de la sesión.', howNote: 'Ven ya duchado. El incienso y la música los eliges al pedir.', endH: '¿Reservamos?', endP: 'Toma un minuto. El pedido llega listo a mi WhatsApp.', q6: '¿Atiendes en mi dirección?', sessS: 'Primera sesión: R$ 15 de descuento ya aplicado en los precios (el recorte solo no tiene descuento).', 
    quizH: '¿No sabes cuál elegir?', quizS: '3 toques y te indico la sesión ideal para hoy.', quizStart: 'Descubrir mi sesión',
    quizQ1: '¿Qué necesitas más hoy?', quizA1a: 'Soltar espalda y hombros trabados', quizA1b: 'Apagar la cabeza y relajar todo el cuerpo', quizA1c: 'Algo más intenso y con más contacto', quizA1d: 'Solo recortar el vello',
    quizQ2: '¿Ya hiciste una sesión así?', quizA2a: 'Es mi primera vez', quizA2b: 'Ya lo hice antes',
    quizQ3: '¿Piensas venir con frecuencia?', quizA3a: 'Solo hoy, por ahora', quizA3b: 'Quiero hacerlo rutina',
    quizRes: 'Mi recomendación para ti', quizGo: 'Reservar esta sesión', quizRedo: 'Rehacer', quizStep: 'Pregunta {a} de {b}',
    
    
    
    
    
    quizPlan: 'Con el plan 2x al mes ahorras {v}.', quizFirst: 'Primera vez: R$ 15 de descuento ya aplicado.',
    draftH: '¿Continuar tu reserva?', draftP: '{s} • {d}', draftBtn: 'Continuar', draftNo: 'Empezar de cero',
    nudgeH: '¿Te quedó alguna duda?', nudgeP: 'Escríbeme por WhatsApp y respondo rápido. Tu sesión ya va en el mensaje.', nudgeBtn: 'Preguntar por WhatsApp', nudgeClose: 'Ahora no',
    nudgeMsg: '¡Hola Thalyson! Estaba viendo la sesión {s} en tu sitio y tengo una duda:',
    liveCal: 'Horarios verificados ahora en la agenda de Thalyson.',
  },
};

// O português vem de lib/content.ts (fonte única). Inglês e espanhol ficam aqui.
const PT = (id: string): PkgText => { const x = sessions.find((i) => i.pkgId === id)!; return { title: x.name, subtitle: x.summary, desc: x.note, flow: x.steps }; };
const PACKAGES: { id: string; price: number; min: number; max: number; combo: number; theme: PkgTheme; L: Record<Lang, PkgText> }[] = [
  { id: 'classica', price: 180, min: 40, max: 60, combo: 90, theme: 'sage', L: {
    pt: PT('classica'),
    en: {
      title: 'Classic Massage',
      subtitle: 'Therapeutic full-body massage. No intimate touch.',
      desc: 'No finish. You can be undressed.',
      flow: ['You tell me where you feel tight', 'Whole body with firm pressure: feet, legs, glutes, back, neck, arms and hands', 'Massage gun on the toughest knots'],
    },
    es: {
      title: 'Masaje Clásico',
      subtitle: 'Masaje terapéutico de todo el cuerpo. Sin toques íntimos.',
      desc: 'Sin final. Puedes quedarte sin ropa.',
      flow: ['Me dices dónde estás más tenso', 'Todo el cuerpo con presión firme: pies, piernas, glúteos, espalda, cuello, brazos y manos', 'Pistola masajeadora en los nudos más duros'],
    },
  } },
  { id: 'sensitiva', price: 220, min: 60, max: 80, combo: 85, theme: 'amber', L: {
    pt: PT('sensitiva'),
    en: {
      title: 'Sensitive + Lingam',
      subtitle: 'Therapeutic massage, feather-light touch and lingam at the end.',
      desc: 'Only you are undressed, if you want.',
      flow: ['Therapeutic massage on the whole body', 'Touch so light it feels like feathers, from head to toe', 'Lingam: slow massage of the penis with gel until you relax completely'],
    },
    es: {
      title: 'Sensitiva + Lingam',
      subtitle: 'Masaje terapéutico, toques suaves como plumas y lingam al final.',
      desc: 'Solo tú quedas sin ropa, si quieres.',
      flow: ['Masaje terapéutico en todo el cuerpo', 'Toques tan suaves que parecen plumas, de la cabeza a los pies', 'Lingam: masaje lento en el pene con gel hasta relajarte por completo'],
    },
  } },
  { id: 'fusion', price: 290, min: 60, max: 80, combo: 75, theme: 'crimson', L: {
    pt: PT('fusion'),
    en: {
      title: 'Beard Sensations + Lingam',
      subtitle: 'Both of us nude, with beard touch and lingam at the end.',
      desc: 'Naturist session: both of us undressed.',
      flow: ['Therapeutic massage', 'Light touch and my beard on some parts of the body', 'Lingam at the end, with gel and no rush'],
    },
    es: {
      title: 'Sensaciones con Barba + Lingam',
      subtitle: 'Los dos desnudos, con el toque de la barba y lingam al final.',
      desc: 'Sesión naturista: los dos sin ropa.',
      flow: ['Masaje terapéutico', 'Toques suaves y mi barba en algunos puntos del cuerpo', 'Lingam al final, con gel y sin prisa'],
    },
  } },
  { id: 'completa', price: 390, min: 60, max: 80, combo: 60, theme: 'midnight', L: {
    pt: PT('completa'),
    en: {
      title: 'Body to Body + Lingam',
      subtitle: 'Both nude, skin to skin, you can massage me too, and lingam at the end.',
      desc: 'Both of us undressed.',
      flow: ['Therapeutic massage', 'Light touch, beard and body-to-body contact', 'You can touch me and massage me too', 'Lingam at the end'],
    },
    es: {
      title: 'Cuerpo a Cuerpo + Lingam',
      subtitle: 'Los dos desnudos, piel con piel, tú también puedes masajearme y lingam al final.',
      desc: 'Los dos sin ropa.',
      flow: ['Masaje terapéutico', 'Toques suaves, barba y contacto cuerpo a cuerpo', 'Puedes tocarme y masajearme', 'Lingam al final'],
    },
  } },
  { id: 'aparo_solo', price: 130, min: 40, max: 60, combo: 0, theme: 'slate', L: {
    pt: PT('aparo_solo'),
    en: {
      title: 'Body Trimming Only',
      subtitle: 'Trim with a clipper in up to 3 areas, no blade.',
      desc: '',
      flow: ['You pick the areas and the guard length', 'Clipper with sanitized guards', 'Clean finish'],
    },
    es: {
      title: 'Solo Recorte de Vello',
      subtitle: 'Recorte a máquina en hasta 3 zonas, sin cuchilla.',
      desc: '',
      flow: ['Eliges las zonas y la altura del peine', 'Máquina con peines higienizados', 'Acabado limpio'],
    },
  } },
];

type ReviewItem = { initials: string; name: string; tag: string; when: string; stars: number; text: string };


// Avaliações da Home: as mesmas de lib/content.ts (texto moderado). As completas ficam em /avaliacoes (noindex).
const REV_EN: Record<string, [string, string]> = {
  'Rafael M.': ['It had been a while since I switched off like that. He started on the tension in my back and I left feeling light.', '3 days ago'],
  'Lucas T.': ['I only booked the classic because my lower back was locked up from training. Firm hands, just right.', '1 week ago'],
  'Bruno S.': ['Direct contact, no fuss, and really good hands. Calm, welcoming service.', '2 weeks ago'],
  'Diego G.': ['I asked him to put out the incense and he did it right away. The beard on my neck and back gave me goosebumps.', '2 weeks ago'],
  'Felipe A.': ['I was a bit tense since it was my first time, but Thalyson makes everything feel natural. Private and unhurried.', '3 weeks ago'],
  'Matheus C.': ['I sit at a desk all day and my neck was stiff. His hands are firm, just right.', '1 month ago'],
};
const REV_ES: Record<string, [string, string]> = {
  'Rafael M.': ['Hacía tiempo que no me desconectaba así. Empezó quitando la tensión de la espalda y salí liviano.', 'hace 3 días'],
  'Lucas T.': ['Tomé solo la clásica porque tenía la zona lumbar trabada por el entrenamiento. Mano firme, en su justa medida.', 'hace 1 semana'],
  'Bruno S.': ['Contacto directo, sin vueltas, y muy buenas manos. Atención tranquila y acogedora.', 'hace 2 semanas'],
  'Diego G.': ['Le pedí que apagara el incienso y lo quitó al momento. La barba por el cuello y la espalda me erizó entero.', 'hace 2 semanas'],
  'Felipe A.': ['Fui algo tenso por ser la primera vez, pero Thalyson hace que todo sea natural. Reservado y sin prisa.', 'hace 3 semanas'],
  'Matheus C.': ['Trabajo sentado todo el día y tenía el cuello rígido. Su mano es firme en su justa medida.', 'hace 1 mes'],
};
const pkgTitle = (sessionName: string, l: Lang) => {
  const id = sessions.find((x) => x.name === sessionName)?.pkgId;
  return (PACKAGES.find((p) => p.id === id)?.L[l].title) || sessionName;
};
const HOME_REVIEWS: Record<Lang, ReviewItem[]> = {
  pt: REVIEWS_PT.map((r) => ({ initials: r.initials, name: r.name, tag: r.session, when: r.when, stars: r.stars, text: r.text })),
  en: REVIEWS_PT.map((r) => ({ initials: r.initials, name: r.name, tag: pkgTitle(r.session, 'en'), when: REV_EN[r.name]?.[1] || r.when, stars: r.stars, text: REV_EN[r.name]?.[0] || r.text })),
  es: REVIEWS_PT.map((r) => ({ initials: r.initials, name: r.name, tag: pkgTitle(r.session, 'es'), when: REV_ES[r.name]?.[1] || r.when, stars: r.stars, text: REV_ES[r.name]?.[0] || r.text })),
};

export const REVIEWS: Record<Lang, ReviewItem[]> = {
  pt: [
    {
      initials: 'RM', name: 'Rafael M.', tag: 'Sensitiva + Lingam', when: 'há 3 dias', stars: 5,
      text: 'Cara, fazia tempo que eu não desligava assim. Começou tirando a tensão das costas e quando foi pra parte sensitiva fiquei muito excitado, gozei bastante e saí leve demais.',
    },
    {
      initials: 'LT', name: 'Lucas T.', tag: 'Massagem Clássica', when: 'há 1 semana', stars: 5,
      text: 'Peguei só a clássica porque tava com a lombar travada de treino. Relaxouuuu muito! A pistola no final pegou bem forte no nó do ombro, deu até uma ardida na hora mas depois soltou tudo.',
    },
    {
      initials: 'BS', name: 'Bruno S.', tag: 'Corpo a Corpo + Lingam', when: 'há 2 semanas', stars: 5,
      text: 'O corpo peludo dele deslizando com gel dá um tesão absurdo, ainda mais podendo tocar de volta. Não consegui segurar muito não, gozei muito mesmo. Volto mês que vem.',
    },
    {
      initials: 'DG', name: 'Diego G.', tag: 'Sensações com a Barba', when: 'há 2 semanas', stars: 4,
      text: 'Achei o incenso um pouco forte logo que entrei, pedi pra apagar e ele tirou na hora sem problema. Depois a barba passando no pescoço e nas costas me arrepiou inteiro, muito bom.',
    },
    {
      initials: 'FA', name: 'Felipe A.', tag: 'Sensitiva + Lingam', when: 'há 3 semanas', stars: 5,
      text: 'Fui meio travado por ser a primeira vez, mas o Thalyson deixa tudo muito natural. Fui já de banho tomado como combinado, clima reservado e sem pressa nenhuma.',
    },
    {
      initials: 'MC', name: 'Matheus C.', tag: 'Massagem Clássica', when: 'há 1 mês', stars: 5,
      text: 'Trabalho o dia inteiro sentado e estava com o pescoço duro. A mão dele é firme na medida certa e com o creme hidratante não fica aquela meleca depois.',
    },
    {
      initials: 'GV', name: 'Gabriel V.', tag: 'Corpo a Corpo + Lingam', when: 'há 1 mês', stars: 5,
      text: 'Sou fã de cara peludo e o Thalyson tem presença demais. Pele quente, contato direto sem frescura e mão muito boa no lingam. Saí com as pernas bambas.',
    },
    {
      initials: 'HN', name: 'Henrique N.', tag: 'Sensitiva + Lingam', when: 'há 1 mês', stars: 4,
      text: 'Por ser perto do Anhangabaú dá pra ouvir um pouco de barulho de rua lá fora, mas a música ambiente abafa bem e a massagem faz você esquecer do mundo. Gozei demais.',
    },
    {
      initials: 'PR', name: 'Pedro R.', tag: 'Clássica + Aparo', when: 'há 1 mês', stars: 5,
      text: 'Fiz o combo de aparo e massagem clássica. Aparo bem feito na máquina sem irritar e a massagem relaxou muito as costas. Preço justo pelo tempo.',
    },
    {
      initials: 'AL', name: 'André L.', tag: 'Sensações com a Barba', when: 'há 2 meses', stars: 5,
      text: 'Nunca tinha feito sessão naturista. O jeito tranquilo dele quebra o gelo rápido e o contraste da barba com a mão deixou tudo bem intenso.',
    },
    {
      initials: 'CS', name: 'Caio S.', tag: 'Massagem Clássica', when: 'há 2 meses', stars: 4,
      text: 'A pistola massageadora é meio agressiva pra quem tem cócegas ou sensibilidade, pedi pra pegar mais leve na panturrilha e ele ajustou na hora. Relaxou bastante.',
    },
    {
      initials: 'RO', name: 'Rodrigo O.', tag: 'Sensitiva + Lingam', when: 'há 2 meses', stars: 5,
      text: 'Já fechei o plano de 2x no mês porque virou meu escape da rotina de SP. Atendimento direto, sem papo furado e sempre saio renovado.',
    },
    {
      initials: 'VK', name: 'Vinícius K.', tag: 'Corpo a Corpo + Lingam', when: 'há 2 meses', stars: 5,
      text: 'Espaço simples, limpo e bem reservado, você não cruza com ninguém. O contato corpo a corpo é surreal de bom, me excitou do começo ao fim.',
    },
    {
      initials: 'JM', name: 'João M.', tag: 'Massagem Clássica', when: 'há 3 meses', stars: 5,
      text: 'Cheguei moído de viagem, peguei 40 min de clássica e parecia que tinha dormido 8 horas. Recomendo demais pra quem precisa soltar o corpo.',
    },
    {
      initials: 'TS', name: 'Tiago S.', tag: 'Sensitiva + Lingam', when: 'há 3 meses', stars: 5,
      text: 'Sem luxo de clínica cara, mas com uma entrega que dá de 10 a 0 em muito lugar por aí. Mão firme nas costas e toque muito bom na finalização.',
    },
  ],
  en: [
    {
      initials: 'RM', name: 'Rafael M.', tag: 'Sensitive + Lingam', when: '3 days ago', stars: 5,
      text: 'Honestly hadn’t switched off like that in ages. Started by releasing back tension and once the sensitive part kicked in I got super turned on, came hard and walked out light.',
    },
    {
      initials: 'LT', name: 'Lucas T.', tag: 'Classic Massage', when: '1 week ago', stars: 5,
      text: 'Booked just the classic because my lower back was locked from lifting. Relaxed me so much! The massage gun at the end hit a deep shoulder knot pretty hard at first, then released everything.',
    },
    {
      initials: 'BS', name: 'Bruno S.', tag: 'Body to Body + Lingam', when: '2 weeks ago', stars: 5,
      text: 'His hairy body gliding with gel is crazy hot, especially being able to touch back. Couldn’t hold back for long, came a lot. Coming back next month.',
    },
    {
      initials: 'DG', name: 'Diego G.', tag: 'Beard Sensations', when: '2 weeks ago', stars: 4,
      text: 'Thought the incense was a bit strong when I walked in, asked to put it out and he did right away. His beard brushing down my neck and back gave me chills, really good.',
    },
    {
      initials: 'FA', name: 'Felipe A.', tag: 'Sensitive + Lingam', when: '3 weeks ago', stars: 5,
      text: 'Went in a bit stiff for my first time, but Thalyson keeps everything natural. Arrived freshly showered as arranged, private vibe and zero rush.',
    },
    {
      initials: 'MC', name: 'Matheus C.', tag: 'Classic Massage', when: '1 month ago', stars: 5,
      text: 'I sit at a desk all day and my neck was tight. Firm pressure in the right spots and the moisturizing cream doesn’t leave you sticky afterward.',
    },
    {
      initials: 'GV', name: 'Gabriel V.', tag: 'Body to Body + Lingam', when: '1 month ago', stars: 5,
      text: 'Big fan of hairy guys and Thalyson has great presence. Warm skin, direct contact without pretension and great hands on the lingam. Left weak in the knees.',
    },
    {
      initials: 'HN', name: 'Henrique N.', tag: 'Sensitive + Lingam', when: '1 month ago', stars: 4,
      text: 'Being near Anhangabaú you hear a bit of street noise outside, but the background music covers it well and the massage makes you forget everything. Finished big.',
    },
    {
      initials: 'PR', name: 'Pedro R.', tag: 'Classic + Trimming', when: '1 month ago', stars: 5,
      text: 'Got the trimming + classic combo. Clean clipper trim without irritation and the massage loosened up my back. Fair price for the time.',
    },
    {
      initials: 'AL', name: 'André L.', tag: 'Beard Sensations', when: '2 months ago', stars: 5,
      text: 'Never tried a naturist session before. His calm vibe breaks the ice fast and the contrast of beard and hands felt intense.',
    },
    {
      initials: 'CS', name: 'Caio S.', tag: 'Classic Massage', when: '2 months ago', stars: 4,
      text: 'The massage gun feels a bit intense if you’re sensitive, asked him to go lighter on my calves and he adjusted right away. Very relaxing.',
    },
    {
      initials: 'RO', name: 'Rodrigo O.', tag: 'Sensitive + Lingam', when: '2 months ago', stars: 5,
      text: 'Already grabbed the 2x a month plan because it became my escape from SP rush. Straightforward service and always leave recharged.',
    },
    {
      initials: 'VK', name: 'Vinícius K.', tag: 'Body to Body + Lingam', when: '2 months ago', stars: 5,
      text: 'Simple, clean and discreet space, never bump into anyone. Body-to-body contact is unreal, had me turned on from start to finish.',
    },
    {
      initials: 'JM', name: 'João M.', tag: 'Classic Massage', when: '3 months ago', stars: 5,
      text: 'Arrived wrecked from a trip, booked 40 min classic and felt like I slept 8 hours. Highly recommend to unwind your body.',
    },
    {
      initials: 'TS', name: 'Tiago S.', tag: 'Sensitive + Lingam', when: '3 months ago', stars: 5,
      text: 'No fake luxury clinic vibe, just genuine skill that beats plenty of pricey places. Firm on the back and great touch at the end.',
    },
  ],
  es: [
    {
      initials: 'RM', name: 'Rafael M.', tag: 'Sensitiva + Lingam', when: 'hace 3 días', stars: 5,
      text: 'Hacía tiempo que no desconectaba así. Empezó soltando la espalda y cuando pasó a la sensitiva me excité muchísimo, acabé bastante y salí liviano.',
    },
    {
      initials: 'LT', name: 'Lucas T.', tag: 'Masaje Clásico', when: 'hace 1 semana', stars: 5,
      text: 'Pedí solo el clásico porque tenía la lumbar trabada de entrenar. ¡Relajó muchísimo! La pistola al final pegó fuerte en el nudo del hombro pero soltó todo.',
    },
    {
      initials: 'BS', name: 'Bruno S.', tag: 'Cuerpo a Cuerpo + Lingam', when: 'hace 2 semanas', stars: 5,
      text: 'Su cuerpo peludo deslizando con gel calienta muchísimo, más aún pudiendo tocar de vuelta. No aguanté mucho y acabé un montón. Vuelvo el mes que viene.',
    },
    {
      initials: 'DG', name: 'Diego G.', tag: 'Sensaciones con Barba', when: 'hace 2 semanas', stars: 4,
      text: 'Sentí el incienso un poco fuerte al entrar, pedí apagarlo y lo sacó al toque. Después la barba pasando por cuello y espalda me erizó entero, muy bueno.',
    },
    {
      initials: 'FA', name: 'Felipe A.', tag: 'Sensitiva + Lingam', when: 'hace 3 semanas', stars: 5,
      text: 'Fui algo nervioso por ser la primera vez, pero Thalyson hace todo muy natural. Fui recién duchado como acordamos, clima reservado y sin prisa.',
    },
    {
      initials: 'MC', name: 'Matheus C.', tag: 'Masaje Clásico', when: 'hace 1 mes', stars: 5,
      text: 'Trabajo todo el día sentado y tenía el cuello duro. Presión firme justa y con la crema hidratante no quedas pegajoso después.',
    },
    {
      initials: 'GV', name: 'Gabriel V.', tag: 'Cuerpo a Cuerpo + Lingam', when: 'hace 1 mes', stars: 5,
      text: 'Me encantan los tipos peludos y Thalyson tiene mucha presencia. Piel caliente, contacto directo sin vueltas y muy buena mano en el lingam.',
    },
    {
      initials: 'HN', name: 'Henrique N.', tag: 'Sensitiva + Lingam', when: 'hace 1 mes', stars: 4,
      text: 'Al estar cerca de Anhangabaú se escucha algo de ruido de calle afuera, pero la música tapa bien y el masaje te hace olvidar todo. Acabé muchísimo.',
    },
    {
      initials: 'PR', name: 'Pedro R.', tag: 'Clásico + Recorte', when: 'hace 1 mes', stars: 5,
      text: 'Hice el combo de recorte y masaje clásico. Prolijo a máquina sin irritar y el masaje soltó la espalda. Buen precio por el tiempo.',
    },
    {
      initials: 'AL', name: 'André L.', tag: 'Sensaciones con Barba', when: 'hace 2 meses', stars: 5,
      text: 'Nunca había probado sesión naturista. Su onda tranquila rompe el hielo rápido y el contraste de la barba con la mano estuvo muy intenso.',
    },
    {
      initials: 'CS', name: 'Caio S.', tag: 'Masaje Clásico', when: 'hace 2 meses', stars: 4,
      text: 'La pistola masajeadora es un poco intensa si tienes sensibilidad, le pedí más suave en los gemelos y ajustó al instante. Relajó bastante.',
    },
    {
      initials: 'RO', name: 'Rodrigo O.', tag: 'Sensitiva + Lingam', when: 'hace 2 meses', stars: 5,
      text: 'Ya tomé el plan 2x al mes porque se volvió mi cable a tierra en SP. Atención directa, sin vueltas y salgo renovado.',
    },
    {
      initials: 'VK', name: 'Vinícius K.', tag: 'Cuerpo a Cuerpo + Lingam', when: 'hace 2 meses', stars: 5,
      text: 'Espacio simple, limpio y discreto, no te cruzas con nadie. El contacto cuerpo a cuerpo es increíble, me excitó de principio a fin.',
    },
    {
      initials: 'JM', name: 'João M.', tag: 'Masaje Clásico', when: 'hace 3 meses', stars: 5,
      text: 'Llegué molido de viaje, tomé 40 min de clásico y parecía que había dormido 8 horas. Muy recomendable.',
    },
    {
      initials: 'TS', name: 'Tiago S.', tag: 'Sensitiva + Lingam', when: 'hace 3 meses', stars: 5,
      text: 'Sin lujo de clínica cara, pero con una entrega que supera a muchos lugares. Firme en la espalda y muy buen toque al final.',
    },
  ],
};

const dr = (p: { min: number; max: number }, l?: Lang) => (p.max > p.min ? `${p.min} ${l === 'en' ? 'to' : 'a'} ${p.max}` : `${p.min}`);
const MASSAGES = PACKAGES.filter((p) => p.combo > 0);
const PAY_PT: Record<string, string> = { pix: 'PIX', card: 'CARTÃO', cash: 'DINHEIRO' };
const THEME_RGB: Record<PkgTheme, { dark: string; light: string }> = {
  sage: { dark: '94, 184, 140', light: '30, 83, 63' },
  amber: { dark: '235, 157, 75', light: '143, 90, 26' },
  crimson: { dark: '224, 102, 92', light: '140, 59, 50' },
  midnight: { dark: '171, 142, 204', light: '61, 43, 76' },
  slate: { dark: '148, 163, 184', light: '75, 85, 99' },
};

const P = ({ children }: { children: ReactNode }) => <p className="mb-3">{children}</p>;
const H = ({ children }: { children: ReactNode }) => <h3 className="font-semibold mt-5 mb-2 c-ink">{children}</h3>;
const DOCS: Record<DocId, { title: string; body: ReactNode }> = {
  privacy: { title: 'Política de Privacidade', body: (<>
    <P>Última atualização: {LEGAL.ATUALIZADO}. Esta política segue a Lei Geral de Proteção de Dados (Lei 13.709/2018, LGPD).</P>
    <H>1. Controlador</H><P>{LEGAL.RAZAO}, CNPJ {LEGAL.CNPJ}, {LEGAL.ENDERECO}. Contato: {LEGAL.EMAIL}. Encarregado (DPO): {LEGAL.ENCARREGADO}, {LEGAL.EMAIL}.</P>
    <H>2. Dados que coletamos e por quê</H><P>Nome (como quer ser chamado), data, horário, pacote e forma de pagamento: para preparar e executar o agendamento (art. 7º, V, execução de contrato). Endereço (rua, número, complemento, bairro e CEP): somente se escolher atendimento no seu endereço, para o deslocamento. Não pedimos CPF, e-mail, telefone nem data de nascimento no formulário; seu número aparece apenas na conversa de WhatsApp que você mesmo inicia.</P>
    <H>3. Dado sensível (vida sexual)</H><P>O campo opcional de pedido específico pode revelar dado sobre vida sexual, considerado sensível (art. 5º, II). Só tratamos se você marcar o consentimento específico ao lado do campo, apenas para avaliar o pedido, e ele não é salvo neste aparelho nem registrado em banco de dados. Você pode retirar o consentimento a qualquer momento pedindo a exclusão da conversa.</P>
    <H>4. Com quem os dados são compartilhados</H><P>WhatsApp (Meta Platforms), para onde sua solicitação é enviada por você. O assistente de dúvidas do site funciona com regras do próprio site e consulta só os horários livres da agenda (nunca nomes de clientes). O que você digita nele não é enviado a nenhuma empresa de IA e não fica salvo. Mesmo assim, não escreva telefone, endereço nem dados de saúde no chat. ViaCEP, que recebe o CEP digitado para preencher o endereço. Google Fonts, que entrega as fontes do site. Não vendemos dados.</P>
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
    <H>4. Preços, combos e planos</H><P>Os valores são exibidos em reais. O sinal confirma a reserva e é abatido do total; o restante é pago após a sessão. O combo massagem + depilação tem preço promocional sobre o aparo avulso. O plano 2x no mês (10% de desconto, validade de {C.BIWEEKLY_DAYS} dias) e o pacote de 5 sessões (pague 4, a 5ª é grátis, validade de {C.PACK_DAYS} dias) não acumulam com cupom nem com o desconto de 1ª sessão, e as sessões seguintes são agendadas pelo WhatsApp conforme disponibilidade. Extras, taxa de horário de pico (atendimento no endereço do cliente) e pedido específico aparecem no resumo antes do envio. Parcelamento no cartão pode ter taxas, informadas antes do pagamento.</P>
    <H>5. Conduta e higiene</H><P>Exige-se respeito mútuo e higiene pessoal (estar já de banho tomado no horário combinado, tanto na suíte quanto em domicílio). O terapeuta pode encerrar a sessão, sem devolução do valor dos serviços já prestados, em caso de desrespeito, assédio, sintomas infecciosos/gripais evidentes, uso de drogas, embriaguez ou risco à segurança. Informe previamente condições de saúde e alergias.</P>
    <H>6. Lei aplicável</H><P>Lei brasileira, incluindo o Código de Defesa do Consumidor. Foro do domicílio do consumidor.</P></>) },
  refund: { title: 'Política de Cancelamento e Reembolso', body: (<>
    <P>Última atualização: {LEGAL.ATUALIZADO}. Estas regras valem sem prejuízo dos direitos do consumidor previstos em lei.</P>
    <H>1. Cancelamento pelo cliente</H><P>Com pelo menos {LEGAL.CANCEL_FREE_HOURS} horas de antecedência: devolução integral do sinal via Pix ou remarcação sem custo. Com menos antecedência ou falta sem aviso: o sinal pode ser retido para cobrir o horário reservado, ou convertido em crédito, a critério do prestador.</P>
    <H>2. Arrependimento (art. 49 do CDC)</H><P>Se a contratação for feita à distância, você pode se arrepender em até 7 dias da contratação e receber de volta o sinal, desde que a sessão ainda não tenha sido realizada. Para sessões agendadas dentro desse prazo, o direito vale até o momento da sessão.</P>
    <H>3. Cancelamento pelo prestador</H><P>Se não puder atender, o sinal é devolvido integralmente ou a sessão é remarcada, conforme sua escolha.</P>
    <H>4. Como pedir</H><P>Responda a conversa do WhatsApp ou escreva para {LEGAL.EMAIL}. O reembolso é feito pelo mesmo meio de pagamento em até 7 dias úteis.</P>
    <H>5. Pedido específico</H><P>Se o pedido for considerado inviável, a taxa correspondente não é cobrada.</P></>) },
  cookies: { title: 'Cookies e armazenamento local', body: (<>
    <P>Este site não usa cookies de publicidade nem rastreadores de marketing (como Google Analytics ou Meta Pixel). Usamos o Vercel Web Analytics, que conta visitas e etapas da reserva de forma anônima e agregada, sem cookies e sem identificar você.</P>
    <H>Estritamente necessário</H><P>Guardamos no navegador (localStorage) apenas suas preferências de tema e idioma, a confirmação de maioridade, a lembrança de que você já agendou antes (para não repetir o desconto de primeira sessão) e, por até 3 dias, a sessão, o dia e o horário que você estava escolhendo, para poder continuar depois. Não identificam você. Nome e endereço não são guardados. Você pode apagar tudo em “Apagar meus dados deste aparelho”, no perfil.</P>
    <P>Se no futuro ativarmos qualquer ferramenta de análise ou marketing, ela só carregará depois do seu consentimento.</P></>) },
};

const cn = (...a: Array<string | false | null | undefined>) => a.filter(Boolean).join(' ');
const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const vibrate = (p: number | number[] = 20) => { try { navigator.vibrate?.(p); } catch { /* */ } };
const store = {
  get: (k: string): string | null => { try { return localStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch { /* */ } },
  del: (k: string) => { try { localStorage.removeItem(k); } catch { /* */ } },
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
type Busy = Array<[number, number]>;
// Converte um horário ISO para o "relógio de parede" de São Paulo, no mesmo formato que spNow() usa.
const toSpWall = (iso: string) => { try { return new Date(new Date(iso).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })).getTime(); } catch { return new Date(iso).getTime(); } };
const TRAVEL_BUFFER = 30;
function buildSlots(date: Date, dur: number, isHome: boolean, now: Date, busy: Busy = []): Slot[] {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const day0 = new Date(date); day0.setHours(0, 0, 0, 0);
  const buf = isHome ? TRAVEL_BUFFER : 0;
  const out: Slot[] = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) {
    const a = day0.getTime() + (m - buf) * 60000;
    const b = day0.getTime() + (m + dur + buf) * 60000;
    const clash = busy.some(([s, e]) => s < b && e > a);
    out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) && !clash });
  }
  return out;
}

const SLUG_TO_PKG: Record<string, string> = {
  'massagem-classica': 'classica', 'massagem-sensitiva': 'sensitiva', 'sessao-sensacoes': 'fusion', 'sessao-completa': 'completa', 'aparo-masculino': 'aparo_solo', 'sensitiva-lingam': 'sensitiva', 'sensacoes-barba-lingam': 'fusion', 'corpo-a-corpo-lingam': 'completa', 'apenas-aparo': 'aparo_solo',
  classica: 'classica', sensitiva: 'sensitiva', fusion: 'fusion', completa: 'completa', aparo: 'aparo_solo', aparo_solo: 'aparo_solo',
};
type Draft = { packageId: string; offer: Offer; date: string; time: string; locType: 'studio' | 'home'; at: number };
const DRAFT_KEY = 'thaly_draft';
const DRAFT_TTL = 3 * 24 * 60 * 60 * 1000;
const safeTrack = (name: string, props?: Record<string, string | number | boolean>) => { try { track(name, props); } catch { /* */ } };

type NarrState = 'idle' | 'playing' | 'paused';
// Prioridade: voz masculina em pt-BR (Daniel, Antonio, Felipe, Ricardo...). A voz "Google português do Brasil" é feminina.
const MALE_RE = /(daniel|ant[oô]nio|ricardo|felipe|jorge|diego|thiago|raul|carlos|david|donato|paulo|rafael|luciano|marcos|nelson|miguel|alvaro|enrique|pablo|\bmale\b|masculin|homem|hombre)/i;
const FEMALE_RE = /(maria|francisca|luciana|fernanda|joana|camila|vit[oó]ria|paulina|m[oó]nica|helena|laura|samantha|zira|susan|elvira|paloma|dalia|jenny|aria|sonia|natasha|hazel|libby|emma|victoria|female|feminin|mulher|mujer|woman|google portugu[eê]s|google espa|google us english|google uk english)/i;
type VoiceKind = 'male' | 'neutral' | 'female' | 'none';

function pickVoice(voices: SpeechSynthesisVoice[], lang: Lang): { voice: SpeechSynthesisVoice | null; kind: VoiceKind } {
  const loc = LOCALE[lang].toLowerCase();
  const norm = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  const exact = voices.filter((v) => norm(v) === loc);
  const sameLang = voices.filter((v) => norm(v).startsWith(lang));
  const isMale = (v: SpeechSynthesisVoice) => MALE_RE.test(v.name) && !FEMALE_RE.test(v.name);
  const isFemale = (v: SpeechSynthesisVoice) => FEMALE_RE.test(v.name);
  const m1 = exact.find(isMale); if (m1) return { voice: m1, kind: 'male' };
  const m2 = sameLang.find(isMale); if (m2) return { voice: m2, kind: 'male' };
  const n1 = exact.find((v) => !isFemale(v)); if (n1) return { voice: n1, kind: 'neutral' };
  const f1 = exact[0] || sameLang[0]; if (f1) return { voice: f1, kind: isFemale(f1) ? 'female' : 'neutral' };
  return { voice: null, kind: 'none' };
}

// Toca public/voz/<idioma>/<sessão>.mp3 (voz masculina neural, gerada uma vez com scripts/gerar-voz.mjs).
// Se o arquivo não existir, cai na voz do navegador, priorizando voz masculina.
const AUDIO_OK = /(audio|mpeg|octet-stream)/i;

function useNarrator(lang: Lang) {
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined';
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [hasFile, setHasFile] = useState(false);
  const [state, setState] = useState<NarrState>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const chunks = useRef<string[]>([]);
  const idx = useRef(0);
  const token = useRef(0);
  const mode = useRef<'file' | 'tts'>('tts');
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const files = useRef<Record<string, string | null>>({});
  const choice = useMemo(() => pickVoice(voices, lang), [voices, lang]);
  const choiceRef = useRef(choice);
  choiceRef.current = choice;
  const langRef = useRef(lang);
  langRef.current = lang;
  const supported = ttsSupported || hasFile;

  useEffect(() => {
    if (!ttsSupported) return undefined;
    const synth = window.speechSynthesis;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    return () => synth.removeEventListener?.('voiceschanged', load);
  }, [ttsSupported]);

  useEffect(() => {
    let alive = true;
    setHasFile(false);
    fetch(`/voz/${lang}/classica.mp3`, { method: 'HEAD' }).then((r) => { if (alive && r.ok && AUDIO_OK.test(r.headers.get('content-type') || '')) setHasFile(true); }).catch(() => { /* sem arquivo */ });
    return () => { alive = false; };
  }, [lang]);

  const killAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) { a.onended = null; a.onerror = null; a.pause(); audioRef.current = null; }
  }, []);

  useEffect(() => () => { token.current += 1; killAudio(); if (ttsSupported) window.speechSynthesis.cancel(); }, [ttsSupported, killAudio]);

  const step = useCallback(function run(tk: number) {
    if (tk !== token.current) return;
    const i = idx.current;
    if (i >= chunks.current.length) { setState('idle'); setActiveId(null); return; }
    const u = new SpeechSynthesisUtterance(chunks.current[i]);
    const { voice, kind } = choiceRef.current;
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = LOCALE[langRef.current];
    // Ritmo e tom naturais: voz masculina quase sem ajuste; só abaixa o tom se a única voz for feminina.
    u.rate = kind === 'male' ? 1 : kind === 'neutral' ? 0.98 : 0.95;
    u.pitch = kind === 'male' ? 0.95 : kind === 'neutral' ? 0.9 : 0.8;
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
    killAudio();
    if (ttsSupported) window.speechSynthesis.cancel();
    setState('idle'); setActiveId(null);
  }, [ttsSupported, killAudio]);

  const findFile = useCallback(async (id: string) => {
    const key = `${langRef.current}/${id}`;
    if (key in files.current) return files.current[key];
    for (const url of [`/voz/${key}.mp3`]) {
      try {
        const r = await fetch(url, { method: 'HEAD' });
        if (r.ok && AUDIO_OK.test(r.headers.get('content-type') || '')) { files.current[key] = url; return url; }
      } catch { /* tenta o próximo */ }
    }
    files.current[key] = null;
    return null;
  }, []);

  const startTts = useCallback((tk: number, text: string) => {
    if (!ttsSupported) { setState('idle'); setActiveId(null); return; }
    mode.current = 'tts';
    window.speechSynthesis.cancel();
    chunks.current = (text.match(/[^.!?]+[.!?]*/g) || [text]).map((x) => x.trim()).filter(Boolean);
    idx.current = 0;
    setTimeout(() => step(tk), 80);
  }, [ttsSupported, step]);

  const play = useCallback(async (id: string, text: string) => {
    const tk = ++token.current;
    killAudio();
    if (ttsSupported) window.speechSynthesis.cancel();
    setActiveId(id); setState('playing');
    const url = await findFile(id);
    if (tk !== token.current) return;
    if (url) {
      mode.current = 'file';
      const a = new Audio(url);
      audioRef.current = a;
      a.onended = () => { if (tk !== token.current) return; setState('idle'); setActiveId(null); };
      a.onerror = () => { if (tk !== token.current) return; killAudio(); startTts(tk, text); };
      a.play().catch(() => { if (tk === token.current) { killAudio(); startTts(tk, text); } });
      return;
    }
    startTts(tk, text);
  }, [ttsSupported, findFile, killAudio, startTts]);

  const pause = useCallback(() => {
    if (mode.current === 'file' && audioRef.current) audioRef.current.pause();
    else { token.current += 1; if (ttsSupported) window.speechSynthesis.cancel(); }
    setState('paused');
  }, [ttsSupported]);

  const resume = useCallback(() => {
    if (mode.current === 'file' && audioRef.current) { audioRef.current.play().catch(() => stop()); setState('playing'); return; }
    const tk = ++token.current;
    setState('playing');
    setTimeout(() => step(tk), 80);
  }, [step, stop]);

  const toggle = useCallback((id: string, text: string) => {
    if (activeId === id && state === 'playing') pause();
    else if (activeId === id && state === 'paused') resume();
    else play(id, text);
  }, [activeId, state, pause, resume, play]);

  const male = hasFile ? true : choice.kind === 'male' || choice.kind === 'neutral';
  return { supported, state, activeId, male, toggle, stop };
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
  sparkle: 'M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z',
  play: 'M5 3l14 9-14 9V3z',
  pause: 'M6 4h4v16H6z M14 4h4v16h-4z',
  stop: 'M6 6h12v12H6z',
  card: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z M2 10h20',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z M7 7h.01',
};
type IconName = keyof typeof ICONS;
const Icon = memo(({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`} aria-hidden="true"><path d={ICONS[name]} /></svg>
));

function Avatar({ className, alt, style }: { className: string; alt: string; style?: CSSProperties }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <span role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true} className={`${className} serif inline-flex items-center justify-center`} style={{ background: 'var(--acc)', color: 'var(--onacc)' }}>T</span>;
  return <img src={C.AVATAR} alt={alt} onError={() => setFailed(true)} style={style} className={`${className} object-cover`} />;
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
    <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4" style={{ background: 'rgba(8,6,12,.74)', zIndex: 150 }} onClick={() => closeRef.current()}>
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
  <div className={cn('flex justify-between items-baseline gap-3 text-[15.5px]', tone && 'c-ok font-bold')}>
    <span className={cn('min-w-0 flex-1', !tone && 'c-mute')}>{label}</span>
    <span className="font-semibold text-right row-v">{value}</span>
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

const CSS = `
.app{--bg:#F9F8F6;--surf:#FFFFFF;--surf2:#EFECE6;--ink:#161412;--mute:#57524A;--line:rgba(22,20,18,.15);--acc:#161412;--onacc:#FFFFFF;--rg:rgba(22,20,18,.24);--ok:#145A3E;--warn:#8A4B08;--err:#B81D3A}
.app[data-theme=dark]{--bg:#121110;--surf:#1C1A19;--surf2:#282523;--ink:#F5F2EE;--mute:#B0A99E;--line:rgba(245,242,238,.15);--acc:#F5F2EE;--onacc:#121110;--rg:rgba(245,242,238,.3);--ok:#5EC49B;--warn:#F0AA5E;--err:#FF8A9B}
.app{background:var(--bg);color:var(--ink);font-family:var(--f-sans),'Poppins',system-ui,sans-serif;font-size:16px;line-height:1.6;min-height:100vh;min-height:100dvh;overflow-x:clip;transition:background .3s,color .3s;overflow-wrap:break-word;word-break:normal;hyphens:manual;text-wrap:pretty;-webkit-text-size-adjust:100%}
.app h1,.app h2,.app h3{text-wrap:balance;word-break:normal;hyphens:manual}
.app .text-sm{font-size:15.5px}.app .text-xs{font-size:13.5px}
.app button,.app input,.app label{font-family:inherit}
.serif{font-family:var(--f-serif),'Fraunces',Georgia,serif;font-optical-sizing:auto}
.num{font-variant-numeric:tabular-nums;white-space:nowrap;flex-shrink:0}
.numw{font-variant-numeric:tabular-nums;min-width:0;overflow-wrap:anywhere}
.cap1::first-letter{text-transform:uppercase}
.c-mute{color:var(--mute)}.c-ink{color:var(--ink)}.c-ok{color:var(--ok)}.c-warn{color:var(--warn)}
.bg-s2{background:var(--surf2)}.bd-line{border-color:var(--line)}
.err{font-size:14px;color:var(--err);margin-top:8px;font-weight:600}
.skip{position:absolute;left:-9999px;top:8px;z-index:300;background:var(--acc);color:var(--onacc);padding:12px 20px;border-radius:999px;font-weight:700}
.skip:focus{position:fixed;left:12px}

.card-ui{background:var(--surf);color:var(--ink);border:1px solid var(--line);border-radius:24px;box-shadow:0 8px 30px rgba(0,0,0,.04)}
.app[data-theme=dark] .card-ui{box-shadow:none}
.card-flat{border:1px solid var(--line);background:var(--surf2)}
.modal-card{max-width:32rem;max-height:90vh;max-height:90dvh;border-radius:28px 28px 0 0}
@media(min-width:640px){.modal-card{border-radius:28px}}

.glass-stage{position:relative;border-radius:32px;padding:24px;background:radial-gradient(120% 100% at 10% 0%,rgba(22,20,18,.06),transparent 60%),radial-gradient(100% 100% at 90% 100%,rgba(20,90,62,.07),transparent 60%),var(--surf2);border:1px solid var(--line)}
.app[data-theme=dark] .glass-stage{background:radial-gradient(120% 100% at 10% 0%,rgba(245,242,238,.07),transparent 60%),radial-gradient(100% 100% at 90% 100%,rgba(94,196,155,.08),transparent 60%),#171615}
.app{--gl-hi:rgba(255,255,255,.85);--gl-lo:rgba(22,20,18,.10);--gl-sh:rgba(22,20,18,.28)}
.app[data-theme=dark]{--gl-hi:rgba(255,255,255,.22);--gl-lo:rgba(0,0,0,.35);--gl-sh:rgba(0,0,0,.6)}
.glass-ui{position:relative;isolation:isolate;background:linear-gradient(165deg,color-mix(in srgb,var(--surf) 62%,transparent),color-mix(in srgb,var(--surf) 40%,transparent));backdrop-filter:blur(18px) saturate(170%) brightness(1.05);-webkit-backdrop-filter:blur(18px) saturate(170%) brightness(1.05);border:1px solid color-mix(in srgb,var(--ink) 12%,transparent);border-radius:22px;box-shadow:inset 0 1px 0 var(--gl-hi),inset 0 -1px 0 var(--gl-lo),0 1px 2px var(--gl-lo),0 20px 40px -20px var(--gl-sh)}
.glass-ui::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background:radial-gradient(110% 80% at 8% 0%,rgba(255,255,255,.16),transparent 55%)}
.glass-photo{background:rgba(18,17,16,.6);backdrop-filter:blur(16px) saturate(160%);-webkit-backdrop-filter:blur(16px) saturate(160%);border:1px solid rgba(255,255,255,.2);border-radius:18px;color:#F5F2EE;box-shadow:inset 0 1px 0 rgba(255,255,255,.28),0 10px 24px -12px rgba(0,0,0,.6)}
.hero-photo{position:absolute;left:-8px;right:-8px;top:-24px;height:460px;background:url(/thalyson.jpg) 50% 25%/cover no-repeat;filter:blur(34px) saturate(1.5);opacity:.2;pointer-events:none;-webkit-mask-image:linear-gradient(#000 35%,transparent);mask-image:linear-gradient(#000 35%,transparent)}
.app[data-theme=dark] .hero-photo{opacity:.28}
.glass-glow{position:absolute;inset:40px -4px -8px;z-index:-1;pointer-events:none;filter:blur(26px);background:radial-gradient(55% 45% at 15% 25%,color-mix(in srgb,var(--warn) 30%,transparent),transparent 70%),radial-gradient(50% 45% at 88% 78%,color-mix(in srgb,var(--ok) 26%,transparent),transparent 70%)}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass-ui{background:var(--surf)}.glass-photo{background:rgba(18,17,16,.85)}}
@media (prefers-reduced-transparency:reduce){.glass-ui{background:var(--surf);backdrop-filter:none;-webkit-backdrop-filter:none}.glass-photo{background:rgba(18,17,16,.92);backdrop-filter:none;-webkit-backdrop-filter:none}.hero-photo,.glass-glow{display:none}}
@media (prefers-contrast:more){.glass-ui{border-color:var(--ink)}.glass-photo{border-color:#F5F2EE}}
.glass-rev{position:relative;border-radius:26px;padding:22px;background:linear-gradient(145deg,rgba(255,255,255,.78),rgba(255,255,255,.46));backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%);border:1px solid rgba(255,255,255,.85);box-shadow:0 16px 36px -12px rgba(22,20,18,.12),inset 0 1px 0 rgba(255,255,255,.95);transition:transform .25s ease,box-shadow .25s ease}
.app[data-theme=dark] .glass-rev{background:linear-gradient(145deg,rgba(44,41,39,.72),rgba(26,24,23,.52));border:1px solid rgba(245,242,238,.14);box-shadow:0 18px 40px -12px rgba(0,0,0,.55),inset 0 1px 0 rgba(245,242,238,.16)}
@media(hover:hover){.glass-rev:hover{transform:translateY(-3px)}}
.glass-avatar{width:40px;height:40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:800;font-size:13px;letter-spacing:.03em;background:rgba(22,20,18,.08);color:var(--ink);border:1px solid var(--line);flex-shrink:0}
.app[data-theme=dark] .glass-avatar{background:rgba(245,242,238,.1)}

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
.btn-ui{max-width:100%}
@media (max-width:480px){.btn-lg{padding:12px 24px}}
.btn-xl{min-height:64px;font-size:17px}
.btn-round{min-height:46px;min-width:46px;width:46px;padding:0;border:none}
.btn-icon{min-height:44px;min-width:44px;width:44px;padding:0;border:none}
.btn-ghost{background:transparent;border:none;min-height:auto;padding:4px;justify-content:flex-start;border-radius:14px;font-weight:500}

.coupon-pill{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:6px 14px;border-radius:999px;border:1.5px dashed var(--ok);background:color-mix(in srgb,var(--ok) 12%,transparent);color:var(--ok);font-size:14px;font-weight:800;cursor:pointer;transition:transform .15s,background .2s}
.coupon-pill:hover{background:color-mix(in srgb,var(--ok) 20%,transparent)}
.coupon-pill:active{transform:scale(.97)}

.lnk-ui{display:inline;background:none;border:0;padding:0;font:inherit;font-weight:700;color:var(--ink);text-decoration:underline;text-underline-offset:4px;cursor:pointer;text-align:left;overflow-wrap:break-word}
.lnk-block{display:inline-flex;align-items:center;justify-content:center;gap:4px;min-height:44px;padding:0 8px;text-align:center}
.lnk-mute{color:var(--mute);font-weight:600;font-size:14px}
.lnk-left{justify-content:flex-start;padding:0}
.lnk-full{display:flex;width:100%}

.inp-ui{display:block;width:100%;min-height:56px;padding:0 18px;border-radius:16px;background:var(--surf);border:1.5px solid var(--line);color:var(--ink);font-size:17px;transition:border-color .2s,box-shadow .2s}
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
.chk-ui{position:relative}.chk-ui::after{content:'';position:absolute;inset:-12px}
.chk-ui:focus-visible,.btn-ui:focus-visible,.coupon-pill:focus-visible,.lnk-ui:focus-visible,.app a:focus-visible,.app button:focus-visible{outline:2px solid var(--acc);outline-offset:3px}

.chip-ui{position:relative;display:flex;align-items:center;justify-content:center;min-height:54px;padding:8px 12px;border:1.5px solid var(--line);border-radius:18px;background:var(--surf);color:var(--ink);text-align:center;cursor:pointer;transition:background .2s,color .2s,border-color .2s;font-weight:700;font-size:16px;line-height:1.2;text-wrap:balance}
.chip-ui.col{flex-direction:column}
.chip-ui.on{background:var(--acc);color:var(--onacc);border-color:var(--acc)}
.chip-ui.off{opacity:.42;text-decoration:line-through;cursor:not-allowed}
.chip-ui:has(input:focus-visible),.opt-ui:has(input:focus-visible){outline:2px solid var(--acc);outline-offset:3px}
.opt-ui{display:block;border-radius:22px;padding:20px;background:var(--surf);cursor:pointer;border:1.5px solid var(--line);transition:border-color .2s,background .2s}
.opt-ui.on{border-color:var(--acc);box-shadow:0 0 0 1px var(--acc);background:var(--surf2)}
.pkg-ui{overflow:hidden;border-radius:22px;border:1.5px solid var(--line);background:var(--surf);transition:border-color .2s,background .2s}
.pkg-head{display:block;cursor:pointer;padding:20px}
.pkg-head:has(input:focus-visible){outline:2px solid var(--acc);outline-offset:-3px}

.badge-ui{display:inline-flex;align-items:center;gap:6px;border-radius:999px;padding:5px 12px;font-size:12px;font-weight:800;line-height:1.2;text-align:center}
.badge-rec{display:inline-flex;align-items:center;gap:6px;background:color-mix(in srgb,var(--ok) 16%,transparent);color:var(--ok);font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:99px;text-transform:uppercase;letter-spacing:.04em}
.sep-ui{height:1px;background:var(--line);width:100%}

.seg{display:inline-flex;border:1.5px solid var(--line);border-radius:999px;padding:3px;background:var(--surf)}
.seg button{min-height:44px;min-width:44px;padding:0 8px;border-radius:999px;font-size:13px;font-weight:700;color:var(--mute)}
.seg button[aria-pressed=true]{background:var(--ink);color:var(--bg)}
.brand{display:none}
@media(min-width:430px){.brand{display:inline}}
.g-2,.g-3{display:grid;grid-template-columns:1fr;gap:12px}
@media(min-width:420px){.g-2{grid-template-columns:1fr 1fr}.g-3{grid-template-columns:repeat(3,1fr)}}

.glow{position:absolute;top:-6%;right:0;max-width:100%;width:min(95vw,640px);aspect-ratio:1;border-radius:50%;pointer-events:none;background:radial-gradient(circle,color-mix(in srgb,var(--acc) 14%,transparent),transparent 66%)}
.dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 0 var(--ok);animation:pulse 2.6s ease-out 3}
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
.bar{position:fixed;left:0;right:0;bottom:0;z-index:60;padding:12px 16px calc(12px + env(safe-area-inset-bottom));background:color-mix(in srgb,var(--bg) 92%,transparent);backdrop-filter:blur(14px);border-top:1px solid var(--line)}
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
.lnk-ui:not(.lnk-block){padding:10px 2px;margin:-10px -2px}
.ask-list{display:grid;gap:8px}
.ask-ui{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-height:52px;padding:12px 16px;text-align:left;font:inherit;font-size:15px;line-height:1.35;color:inherit;background:transparent;border:1px solid var(--line);border-radius:16px;cursor:pointer;transition:border-color .2s,background-color .2s}
.ask-ui:hover{border-color:var(--acc)}
.ask-ui:focus-visible{outline:2px solid var(--acc);outline-offset:2px}
.ask-own{margin-top:6px;justify-self:start}
.draft-card{display:grid;gap:14px;min-width:0}
.draft-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:0}
.draft-actions .btn-ui{min-width:0;white-space:normal;text-align:center;line-height:1.2;padding-left:10px;padding-right:10px}
@media (min-width:640px){.draft-card{grid-template-columns:minmax(0,1fr) auto;align-items:center}.draft-actions{grid-template-columns:auto auto}}
.how-list{list-style:none;margin:0 0 14px;padding:0;counter-reset:st;display:grid;gap:12px}
.how-list li{counter-increment:st;position:relative;padding:3px 0 0 42px;font-size:15px;line-height:1.5;min-height:30px}
.how-list li::before{content:counter(st);position:absolute;left:0;top:0;width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font:600 13px/1 var(--f-sans),'Poppins',sans-serif;background:var(--surf2);color:var(--ink);border:1px solid var(--line)}
.how-step{position:relative;overflow:hidden;transition:transform .25s ease,box-shadow .25s ease}
.how-step:hover{transform:translateY(-2px)}
.how-n{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;margin-bottom:14px;font:600 16px/1 var(--f-serif),'Fraunces',serif;background:var(--acc);color:var(--onacc)}
.how-step::after{content:'';position:absolute;left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,var(--acc),transparent);transform:scaleX(0);transform-origin:left;transition:transform .9s cubic-bezier(.2,.7,.2,1) .4s}
.rv.in .how-step::after{transform:scaleX(1)}
.pkg-ui{transition:border-color .2s,background .2s,transform .25s ease}
.pkg-ui:hover{transform:translateY(-2px)}
.btn-ui:active,.chip-ui:active{transform:scale(.98)}
.hero-pill{overflow:hidden}
.hero-pill::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.2) 50%,transparent 70%);transform:translateX(-120%);animation:sheen 2.4s ease .9s 1 both}
@keyframes sheen{to{transform:translateX(120%)}}
@keyframes fadeOnly{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.glow,.dot,.core,.ring,.loadbar,.hero-pill::after{animation:none!important}.rise{animation:fadeOnly .6s both!important}.rv,.ttl .w>span{transform:none!important;transition:opacity .7s ease!important}.how-step::after{transform:scaleX(1);transition:none}.pkg-ui:hover,.how-step:hover{transform:none}*{scroll-behavior:auto!important}}
/* ===== Liquid Glass (estilo Apple): material, aro de luz, brilho que segue o dedo ===== */
.app{--lg-a:rgba(255,255,255,.64);--lg-b:rgba(255,255,255,.30);--lg-hi:rgba(255,255,255,.95);--lg-lo:rgba(22,20,18,.10);--lg-glow:rgba(255,255,255,.55);--lg-sh:rgba(22,20,18,.24);--lg-rim1:rgba(255,255,255,.95);--lg-rim2:rgba(255,255,255,.55);--lg-spec:rgba(255,255,255,.6)}
.app[data-theme=dark]{--lg-a:rgba(255,255,255,.14);--lg-b:rgba(255,255,255,.045);--lg-hi:rgba(255,255,255,.4);--lg-lo:rgba(0,0,0,.45);--lg-glow:rgba(255,255,255,.10);--lg-sh:rgba(0,0,0,.65);--lg-rim1:rgba(255,255,255,.62);--lg-rim2:rgba(255,255,255,.22);--lg-spec:rgba(255,255,255,.24)}
.app{position:relative;isolation:isolate}
.app::before{content:'';position:fixed;inset:0;z-index:-1;pointer-events:none;transform:translateZ(0);background-image:radial-gradient(60% 38% at 8% 0%,color-mix(in srgb,var(--warn) 14%,transparent),transparent 70%),radial-gradient(55% 40% at 100% 55%,color-mix(in srgb,var(--ok) 12%,transparent),transparent 70%),radial-gradient(50% 35% at 0% 100%,color-mix(in srgb,var(--ink) 7%,transparent),transparent 70%)}
.glass-ui,.btn-g,.btn-icon,.btn-round,.bar{background:linear-gradient(135deg,var(--lg-a),var(--lg-b));backdrop-filter:none;-webkit-backdrop-filter:none;box-shadow:inset 1px 1px 0 var(--lg-hi),inset -1px -1px 0 var(--lg-lo),inset 0 0 16px -6px var(--lg-glow),0 12px 28px -14px var(--lg-sh),0 2px 5px -2px var(--lg-lo)}
.btn-g,.btn-icon,.btn-round{position:relative;isolation:isolate;border-color:transparent}
.btn-g:hover:not(:disabled){background:linear-gradient(135deg,var(--lg-a),var(--lg-b));filter:brightness(1.04)}
.glass-ui,.btn-g,.btn-icon,.btn-round,.bar{--mx:18%;--my:0%}
.glass-ui::before,.btn-g::before,.btn-icon::before,.btn-round::before,.bar::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:inherit;pointer-events:none;background:radial-gradient(150px 110px at var(--mx) var(--my),var(--lg-spec),transparent 70%)}
.glass-ui::after,.btn-g::after,.btn-icon::after,.btn-round::after,.bar::after{content:'';position:absolute;inset:0;border-radius:inherit;padding:1px;pointer-events:none;background:linear-gradient(135deg,var(--lg-rim1),transparent 36%,transparent 64%,var(--lg-rim2));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
.btn-p{position:relative;background:linear-gradient(180deg,color-mix(in srgb,var(--acc) 86%,#fff),var(--acc));box-shadow:inset 0 1px 0 rgba(255,255,255,.3),inset 0 -10px 18px -10px rgba(0,0,0,.35),0 10px 22px -10px var(--rg)}
.btn-p:disabled{background:var(--surf2);box-shadow:none}
.chip-ui{background:linear-gradient(135deg,var(--lg-a),var(--lg-b));box-shadow:inset 1px 1px 0 var(--lg-hi),inset -1px -1px 0 var(--lg-lo),0 6px 14px -10px var(--lg-sh)}
.chip-ui.on{background:linear-gradient(180deg,color-mix(in srgb,var(--acc) 86%,#fff),var(--acc));box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 8px 18px -10px var(--rg)}
.bar{left:12px;right:12px;margin-inline:auto;max-width:720px;bottom:calc(10px + env(safe-area-inset-bottom));padding:10px 10px 10px 20px;border:0;border-radius:30px}
.btn-ui:active,.chip-ui:active{transform:scale(.97);transition-duration:.12s}
.bar .flex-1{flex:0 0 auto;max-width:42%}.bar .flex-1 p.truncate{white-space:normal;overflow:visible;text-overflow:clip;line-height:1.15}.bar .btn-ui{flex:1 1 0;min-width:0;min-height:52px;padding:8px 16px;font-size:15px}
@supports not ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.glass-ui,.btn-g,.btn-icon,.btn-round,.bar{background:var(--surf)}}
@media (prefers-reduced-transparency:reduce){.glass-ui,.btn-g,.btn-icon,.btn-round,.bar,.chip-ui{background:var(--surf);backdrop-filter:none;-webkit-backdrop-filter:none}.chip-ui.on{background:var(--acc)}.glass-ui::before,.btn-g::before,.btn-icon::before,.btn-round::before,.bar::before{display:none}}
@media (prefers-contrast:more){.glass-ui::after,.btn-g::after,.btn-icon::after,.btn-round::after,.bar::after{display:none}.btn-g,.bar,.btn-icon,.btn-round{border:1px solid var(--ink)}}
.bar,.hero-pill,.hero-facts{backdrop-filter:blur(14px) saturate(180%);-webkit-backdrop-filter:blur(14px) saturate(180%)}
.glass-rev{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
@media (prefers-reduced-transparency:reduce){.bar,.hero-pill,.hero-facts{backdrop-filter:none;-webkit-backdrop-filter:none}}
/* ===== Layout das seções (leitura da esquerda para a direita, botões alinhados) ===== */
.btn-row{display:grid;gap:12px;align-items:stretch}
.btn-row>.btn-ui{width:100%}
@media(min-width:640px){.btn-row{display:flex;flex-wrap:wrap}.btn-row>.btn-ui{width:auto}}
.btn-col{display:grid;gap:12px}.btn-col>.btn-ui{width:100%}
.hero-facts{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(0,1fr);margin:0;padding:14px 18px;border-radius:22px;max-width:460px}
.hero-facts>div{min-width:0;padding-right:12px}
.hero-facts>div+div{padding:0 0 0 16px;border-left:1px solid var(--line)}
.hero-facts dt{font-size:13px;line-height:1.3;color:var(--mute)}
.hero-facts dd{margin:4px 0 0;display:flex;flex-wrap:wrap;align-items:center;column-gap:8px;font:500 20px/1.2 var(--f-serif),'Fraunces',Georgia,serif;color:var(--ink);white-space:normal}
.hero-facts .dot{flex:none}
.hero-facts-sub{display:block;width:100%;margin-top:4px;font:600 12px/1.2 var(--f-sans),'Poppins',sans-serif;color:var(--ok)}
.how-line{list-style:none;margin:0;padding:0;display:grid}
.how-line>li{position:relative;padding-bottom:28px}
.how-line>li:last-child{padding-bottom:0}
.how-line>li:not(:last-child)::before{content:'';position:absolute;left:17px;top:42px;bottom:6px;width:1.5px;background:var(--line)}
.how-row{display:grid;grid-template-columns:36px minmax(0,1fr);gap:16px;align-items:start}
.how-line .how-n{width:36px;height:36px;margin:0}
@media(min-width:768px){.how-line{grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}.how-line>li{padding:0}.how-line>li::before{display:none}.how-row{grid-template-columns:1fr;gap:14px}}
.how-note{display:flex;align-items:flex-start;gap:12px;margin-top:28px;padding:14px 16px;border-radius:18px;font-size:15px;line-height:1.5}
.how-note svg{margin-top:2px;color:var(--ok)}
.quiz-inline{display:grid;gap:12px;padding:16px 18px;border-radius:22px;margin-bottom:20px}
.quiz-inline .btn-ui{width:100%}
@media(min-width:640px){.quiz-inline{grid-template-columns:minmax(0,1fr) auto;align-items:center}.quiz-inline .btn-ui{width:auto}}
.rec-slot{display:grid;gap:12px;padding:16px;border-radius:20px}
.rec-slot .btn-ui{width:100%}
@media(min-width:480px){.rec-slot{grid-template-columns:minmax(0,1fr) auto;align-items:center}.rec-slot .btn-ui{width:auto}}
.rev-grid{display:grid;gap:14px}
@media(min-width:768px){.rev-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.rev-card{display:flex;flex-direction:column;gap:14px;margin:0}
.rev-card blockquote{margin:0;flex:1}
.rev-stars{display:flex;gap:3px;color:var(--warn)}
.rev-by{display:flex;align-items:center;gap:12px;padding-top:14px;border-top:1px solid var(--line)}
.about{display:grid;gap:24px}
.about-photo{border-radius:28px;overflow:hidden;aspect-ratio:1/1;width:100%;max-width:520px}
.about-photo img{display:block;width:100%;height:100%;object-fit:cover;object-position:50% 50%}
@media(min-width:768px){.about{gap:32px}}
.about-facts{list-style:none;margin:0;padding:0;display:grid;gap:12px}
.about-facts li{display:grid;grid-template-columns:18px minmax(0,1fr);gap:12px;align-items:start;font-size:15px;line-height:1.5}
.about-facts svg{margin-top:2px;color:var(--mute)}
.ask-ui{min-height:56px}
.ask-own{border-style:dashed}
.end-card{padding:28px 22px;border-radius:28px}
.pay-step{padding:20px;border-radius:22px}
.wiz-top{display:grid;gap:8px}
.wiz-bar{height:4px;border-radius:99px;background:var(--line);overflow:hidden}
.wiz-bar span{display:block;height:100%;border-radius:inherit;background:var(--acc);transition:width .35s ease}
.wiz-nav{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px;margin-top:24px}
.wiz-nav .btn-ui{width:100%}
.pay-h{font:500 21px/1.25 var(--f-serif),'Fraunces',Georgia,serif;margin:0 0 4px}
.row-v{min-width:0;max-width:64%;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}
@media(min-width:640px){.end-card{padding:40px}}
`;

interface Booking {
  name: string; locType: 'studio' | 'home'; cep: string; street: string; number: string; comp: string; bairro: string;
  date: Date | null; time: string; req: string; payment: string; packageId: string; addTime: boolean;
  incense: boolean; music: boolean;
}

export default function App() {
  // Idioma e tema começam iguais no servidor e no navegador (pt e escuro) e são lidos depois que a página
  // monta. Ler o localStorage já no início deixava o HTML do servidor escuro e o React não corrigia.
  const [lang, setLang] = useState<Lang>('pt');
  const [theme, setTheme] = useState<Theme>('dark');
  const [prefsReady, setPrefsReady] = useState(false);
  useEffect(() => {
    const l = store.get('thaly_lang');
    if (l === 'en' || l === 'es') setLang(l);
    const st = store.get('thaly_theme');
    let th: Theme = 'dark';
    if (st === 'dark' || st === 'light') th = st;
    else { try { th = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'; } catch { /* */ } }
    setTheme(th);
    setPrefsReady(true);
  }, []);
  const t = (k: string) => T[lang][k] ?? T.pt[k] ?? k;

  const [phase, setPhase] = useState<Phase>('loading');
  const [profileOpen, setProfileOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [ask, setAsk] = useState<{ q: string; k: number } | null>(null);
  // Liquid Glass: o brilho do vidro acompanha o dedo ou o mouse (sem movimento se a pessoa pediu menos animação)
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.('.glass-ui,.btn-g,.btn-icon,.btn-round,.bar,.aic-launch') as HTMLElement | null;
      if (!el) return;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
        el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
      });
    };
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', move, { passive: true });
    return () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerdown', move); cancelAnimationFrame(raf); };
  }, []);
  const [offer, setOffer] = useState<Offer>('single');
  const [reviewed, setReviewed] = useState(false);
  // Reserva em telas: 1 sessão, 2 formato, 3 onde e quando, 4 conferir e enviar
  const [view, setView] = useState<1 | 2 | 3 | 4>(1);
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
  const [healthOk, setHealthOk] = useState(false);
  const [reqOk, setReqOk] = useState(false);
  const [optIn, setOptIn] = useState(false);
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState<Busy>([]);
  const [liveCal, setLiveCal] = useState(false);
  const [quiz, setQuiz] = useState<{ step: number; need: string; first: string; freq: string }>({ step: 0, need: '', first: '', freq: '' });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [nudge, setNudge] = useState(false);
  const deepLink = useRef<{ pkg: string; coupon: string; book: boolean } | null>(null);
  const [data, setData] = useState<Booking>({
    name: '', locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '',
    date: null, time: '', req: '', payment: '', packageId: '', addTime: false,
    incense: true, music: true,
  });
  const set = (patch: Partial<Booking>) => setData((p) => ({ ...p, ...patch }));

  const narr = useNarrator(lang);

  const bookRef = useRef<HTMLDivElement>(null);
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
  const firstView = useRef(true);
  useEffect(() => { if (firstView.current) { firstView.current = false; return; } scrollToRef(bookRef, 30); }, [view]);

  useEffect(() => {
    let reduce = false;
    try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { /* */ }
    try {
      const q = new URLSearchParams(window.location.search);
      const pkgQ = SLUG_TO_PKG[(q.get('sessao') || '').toLowerCase()] || '';
      const couponQ = (q.get('cupom') || '').trim().toUpperCase();
      if (pkgQ || couponQ || q.has('agendar')) deepLink.current = { pkg: pkgQ, coupon: couponQ, book: true };
    } catch { /* */ }
    const onboarded = store.get('thaly_onboard_final') === 'yes';
    // Sem espera artificial: abre assim que o navegador terminou de montar a página.
    const id = setTimeout(() => {
      if (onboarded) { setAgeOk(true); setPhase('site'); } else setPhase('welcome');
    }, 0);
    return () => clearTimeout(id);
  }, []);
  useEffect(() => {
    let alive = true;
    const load = () => fetch('/api/disponibilidade', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (!alive || !j) return;
        setLiveCal(!!j.live);
        if (Array.isArray(j.busy)) setBusy(j.busy.map((b: { start: string; end: string }) => [toSpWall(b.start), toSpWall(b.end)] as [number, number]));
      })
      .catch(() => { /* sem agenda: mantém horários padrão */ });
    load();
    const i = setInterval(load, 120000);
    return () => { alive = false; clearInterval(i); };
  }, []);
  useEffect(() => {
    if (phase === 'loading') return;
    window.scrollTo({ top: 0 });
    if (phase === 'site' && window.location.hash) {
      const hid = window.location.hash.slice(1);
      setTimeout(() => document.getElementById(hid)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    }
  }, [phase]);
  useEffect(() => { if (!prefsReady) return; store.set('thaly_lang', lang); document.documentElement.lang = LOCALE[lang]; }, [lang, prefsReady]);
  useEffect(() => { document.title = SITE_NAME; }, []);
  useEffect(() => { if (!prefsReady) return; store.set('thaly_theme', theme); document.documentElement.dataset.theme = theme; }, [theme, prefsReady]);
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
  const isBiweekly = offerEff === 'biweekly';
  const isPack = offerEff === 'pack';
  const hasPlan = isBiweekly || isPack;
  const hasReq = reqOk && data.req.trim().length > 3;
  const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString(LOCALE[lang], o);

  const recommendedPkgId = useMemo(() => {
    const day = now.getDay();
    const hour = now.getHours();
    return day === 1 || (hour >= 9 && hour < 13) ? 'classica' : 'sensitiva';
  }, [now]);

  const getVisualPrice = useCallback((basePrice: number, noDisc = false) => {
    let disc = 0;
    if (noDisc) disc = 0;
    else if (coupon.applied) disc = coupon.value < 1 ? Math.floor(basePrice * coupon.value) : coupon.value;
    else if (!isReturning) disc = C.FIRST;
    const finalPrice = Math.max(0, basePrice - disc);
    const pixPrice = finalPrice - Math.ceil(finalPrice * C.PIX_DISC);
    return { finalPrice, disc, pixPrice };
  }, [coupon.applied, coupon.value, isReturning]);

  const invoice = useMemo(() => {
    let dur = pkg.min;
    const timeAdd = data.addTime ? C.TIME_ADD : 0;
    if (data.addTime) dur += 30;
    const aparoAdd = aparoOn ? pkg.combo : 0;
    const comboSave = aparoOn ? C.APARO_FULL - pkg.combo : 0;

    const fullUnitsPrice = isPack ? pkg.price * C.PACK_TOTAL : isBiweekly ? pkg.price * 2 : pkg.price;
    const biweeklyPrice = Math.round(pkg.price * 2 * (1 - C.BIWEEKLY_DISC));
    const biweeklySave = isBiweekly ? (pkg.price * 2) - biweeklyPrice : 0;
    const packSave = isPack ? pkg.price * (C.PACK_TOTAL - C.PACK_PAY) : 0;
    const planDiscount = biweeklySave + packSave;

    const sessionPrice = isPack ? pkg.price * C.PACK_PAY : isBiweekly ? biweeklyPrice : pkg.price;
    const reqFee = hasReq ? C.REQ_FEE : 0;
    const peakFee = isHome && PEAK_HOURS.includes(data.time) ? C.PEAK_FEE : 0;

    const grossSubtotal = fullUnitsPrice + (aparoOn ? C.APARO_FULL : 0) + timeAdd + reqFee + peakFee;
    const base = sessionPrice + aparoAdd + timeAdd + reqFee;

    let discount = 0;
    if (!hasPlan && !isSolo) {
      if (coupon.applied) discount = coupon.value < 1 ? Math.floor(base * coupon.value) : coupon.value;
      else if (!isReturning) discount = C.FIRST;
    }
    discount = Math.min(discount, base);
    const after = base - discount;
    const pixDiscount = data.payment === 'pix' && !isSolo ? Math.ceil(after * C.PIX_DISC) : 0;
    const total = after - pixDiscount + peakFee;
    const sinal = Math.min(C.SIGNAL, total);
    const rest = Math.max(0, total - sinal);
    const saved = comboSave + planDiscount + discount + pixDiscount;

    return {
      fullUnitsPrice,
      sessionPrice,
      aparoAdd,
      timeAdd,
      reqFee,
      peakFee,
      grossSubtotal,
      planDiscount,
      discount,
      pixDiscount,
      total,
      sinal,
      rest,
      dur,
      durMax: dur + (pkg.max - pkg.min),
      comboSave,
      packSave,
      biweeklySave,
      saved,
    };
  }, [data, pkg, isHome, isSolo, isPack, isBiweekly, hasPlan, aparoOn, isReturning, coupon.applied, coupon.value, hasReq]);

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

  const slots = useMemo(() => (data.date ? buildSlots(data.date, invoice.durMax, isHome, now, busy) : []), [data.date, invoice.durMax, isHome, now, busy]);
  const availableCount = slots.filter((s) => s.ok).length;
  const endTime = data.time ? fromMin(toMin(data.time) + invoice.dur) : '';
  const endMax = data.time ? fromMin(toMin(data.time) + invoice.durMax) : '';
  const ranged = invoice.durMax > invoice.dur;
  useEffect(() => { if (data.time && !slots.some((s) => s.t === data.time && s.ok)) set({ time: '' }); }, [slots, data.time]);

  const nextFree = useMemo(() => {
    const baseDate = new Date(now);
    baseDate.setHours(0, 0, 0, 0);
    for (let k = 0; k < 4; k++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + k);
      const s = buildSlots(d, pkg.max, isHome, now, busy).find((x) => x.ok);
      if (s) return { d, t: s.t, k };
    }
    return null;
  }, [now, pkg.max, isHome, busy]);

  const errors = {
    name: data.name.trim().length < 3 ? t('nameErr') : '',
    date: !data.date ? t('dateErr') : '',
    time: data.date && !data.time ? t('timeErr') : '',
    address: isHome && !(data.street && data.number && data.bairro) ? t('addrErr') : '',
  };
  const step3Valid = !errors.name && !!data.date && !!data.time && !errors.address;

  const selectCouponCode = (rawCode: string) => {
    const code = rawCode.trim().toUpperCase().slice(0, 30);
    if (!code) return;
    const v = C.COUPONS[code] || 0;
    if (v > 0) {
      vibrate([20, 40]);
      setCoupon({ input: '', applied: code, value: v, error: '' });
      showToast(`${t('couponOk')} (${code})`);
    } else {
      vibrate(50);
      setCoupon((c) => ({ ...c, error: t('couponBad') }));
    }
  };

  const clearCoupon = () => {
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
        if (!j.erro) { setData((p) => ({ ...p, street: j.logradouro || p.street, bairro: j.bairro || p.bairro })); setTimeout(() => numberRef.current?.focus(), 150); }
        else showToast(t('cepFail'));
      } catch { showToast(t('cepFail')); }
    }
  };

  const pickPkg = (id: string) => {
    vibrate(15);
    if (id !== data.packageId) safeTrack('sessao_escolhida', { sessao: id });
    const chosenPkg = PACKAGES.find((p) => p.id === id) || PACKAGES[1];
    if (!data.date) {
      const baseDate = new Date(now);
      baseDate.setHours(0, 0, 0, 0);
      for (let k = 0; k < 4; k++) {
        const d = new Date(baseDate);
        d.setDate(d.getDate() + k);
        const s = buildSlots(d, chosenPkg.max, isHome, now, busy).find((x) => x.ok);
        if (s) {
          set({ packageId: id, date: d, time: s.t });
          if (id === 'aparo_solo') setOffer('single');
          return;
        }
      }
    }
    set({ packageId: id });
    if (id === 'aparo_solo') setOffer('single');
  };
  const pickOffer = (o: Offer) => { vibrate(20); setOffer(o); goBook(); };

  const mapsLink = () => {
    if (!isHome) return '';
    const query = [clean(data.street), clean(data.number), clean(data.bairro), data.cep, 'São Paulo - SP'].filter(Boolean).join(', ');
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const whatsappLink = () => {
    const dStr = data.date ? data.date.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }) : '';
    const pk = pkg.L.pt;
    const extras: string[] = [];
    if (aparoOn) extras.push('com aparo de pelos');
    if (data.addTime) extras.push('+30 min');
    if (isBiweekly) extras.push('plano 2x no mês (10% off)');
    if (isPack) extras.push('pacote 5 sessões (1 grátis)');
    const extraTxt = extras.length ? ` (${extras.join(', ')})` : '';

    const fullAddr = `${clean(data.street)}, ${clean(data.number)}${data.comp ? ' - ' + clean(data.comp) : ''} - ${clean(data.bairro)}${data.cep ? ` (CEP ${data.cep})` : ''}`;
    const locTxt = isHome ? `No meu endereço: ${fullAddr}` : 'Na sua suíte (Bela Vista)';
    const vibeTxt = `Incenso: ${data.incense ? 'Sim' : 'Não'} • Música: ${data.music ? 'Sim' : 'Não'}`;
    const hygieneTxt = isHome
      ? 'Saúde em dia e já estarei de banho tomado quando você chegar.'
      : 'Saúde em dia e irei já de banho tomado.';

    const discLines: string[] = [];
    if (invoice.comboSave > 0) discLines.push(`  - Desconto combo aparo: -${money(invoice.comboSave)}`);
    if (invoice.biweeklySave > 0) discLines.push(`  - Desconto plano 2x no mês (10%): -${money(invoice.biweeklySave)}`);
    if (invoice.packSave > 0) discLines.push(`  - Desconto pacote 5 sessões (1 grátis): -${money(invoice.packSave)}`);
    if (invoice.discount > 0) {
      discLines.push(
        coupon.applied
          ? `  - Cupom ${coupon.applied}: -${money(invoice.discount)}`
          : `  - Desconto 1ª sessão: -${money(invoice.discount)}`,
      );
    }
    if (invoice.pixDiscount > 0) discLines.push(`  - Desconto Pix (3%): -${money(invoice.pixDiscount)}`);

    let m = `Oi Thalyson! Sou o *${clean(data.name)}* e quero agendar:\n\n`;
    m += `• *Sessão:* ${pk.title}${extraTxt}\n`;
    m += `• *Quando:* ${dStr}, das ${data.time} às ${endTime}${ranged ? ` (pode ir até ${endMax}; ${invoice.dur} a ${invoice.durMax} min)` : ` (${invoice.dur} min)`}\n`;
    m += `• *Onde:* ${locTxt}\n`;
    if (isHome) m += `• *Mapa:* ${mapsLink()}\n`;
    m += `• *Clima:* ${vibeTxt}\n`;
    if (hasReq) m += `• *Pedido específico:* ${clean(data.req)}\n`;
    m += `• *Higiene:* ${hygieneTxt}\n\n`;

    m += `*RESUMO DOS VALORES*\n`;
    m += `• Subtotal: ${money(invoice.grossSubtotal)}\n`;
    if (discLines.length > 0) {
      m += `• Descontos aplicados:\n${discLines.join('\n')}\n`;
      m += `• Economia total: *-${money(invoice.saved)}*\n`;
    }
    m += `• *Valor Total:* *${money(invoice.total)}*\n`;
    m += `• Sinal da reserva (Pix agora): *-${money(invoice.sinal)}*\n`;
    m += `• *Restante após a sessão:* *${money(invoice.rest)}*\n\n`;
    m += `Já vou fazer o Pix do sinal de *${money(invoice.sinal)}* na chave *${C.PIX_KEY}* e te mando o comprovante aqui.`;
    return waLink(m);
  };

  const googleCalendarLink = () => {
    if (!data.date || !data.time) return '';
    const day = dateKey(data.date).replace(/-/g, '');
    const startDateTime = `${day}T${data.time.replace(':', '')}00`;
    const endDateTime = `${day}T${fromMin(toMin(data.time) + invoice.dur).replace(':', '')}00`;
    const text = encodeURIComponent(`Massagem: ${pkg.L.pt.title} - Thalyson`);
    const hygieneNote = isHome ? 'Estar já de banho tomado quando o massagista chegar.' : 'Ir já de banho tomado.';
    const details = encodeURIComponent(`Total: ${money(invoice.total)}. Sinal: ${money(invoice.sinal)} via Pix (${C.PIX_KEY}). Restante após a sessão: ${money(invoice.rest)}. ${hygieneNote}`);
    const location = encodeURIComponent(isHome ? `${data.street}, ${data.number} - ${data.bairro}, São Paulo` : 'Bela Vista, São Paulo - SP');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startDateTime}/${endDateTime}&details=${details}&location=${location}&ctz=America/Sao_Paulo`;
  };

  const goReview = () => {
    if (!chosen) { showToast(t('s1')); goBook(); return; }
    if (!step3Valid) { vibrate(50); setTouched(true); showToast(t('fill')); return; }
    vibrate(30); setReviewed(true); setView(4);
    safeTrack('revisar_valores', { sessao: pkg.id, plano: offerEff, local: data.locType });
  };

  const finish = () => {
    if (!step3Valid) { setTouched(true); showToast(t('fill')); setView(3); return; }
    if (!healthOk) { vibrate(50); showToast(t('needHealth')); return; }
    if (!ageOk) { vibrate(50); showToast(t('needAge')); return; }
    if (!data.date || !data.time) return;
    if (hp) { setDone(true); setSentLink('#'); return; }
    const link = whatsappLink();
    store.set('thaly_returning_final', 'yes');
    store.del(DRAFT_KEY);
    safeTrack('pedido_whatsapp', { sessao: pkg.id, plano: offerEff, local: data.locType, valor: invoice.total, pagamento: data.payment, cupom: coupon.applied || 'nenhum' });
    setSentLink(link); vibrate([30, 50]);
    const w = window.open(link, '_blank');
    if (!w) window.location.href = link;
    else { try { w.opener = null; } catch { /* */ } }
    setDone(true);
    scrollToRef(bookRef, 60);
  };

  const resetBooking = () => {
    setTouched(false); setReqOk(false); setHealthOk(false); setDone(false); setReviewed(false); setExtrasOpen(false); setOffer('single'); setView(1);
    setData((p) => ({ ...p, locType: 'studio', cep: '', street: '', number: '', comp: '', bairro: '', date: null, time: '', req: '', payment: '', packageId: '', addTime: false, incense: true, music: true }));
  };
  const restart = () => {
    vibrate(15);
    if (store.get('thaly_returning_final') === 'yes') setIsReturning(true);
    resetBooking(); goBook();
  };

  const forgetMe = () => {
    ['thaly_returning_final', 'thaly_onboard_final', 'thaly_cid', 'thaly_name', DRAFT_KEY].forEach((k) => store.del(k));
    setDraft(null);
    narr.stop();
    setIsReturning(false); setAgeOk(false); setHealthOk(false); setCoupon({ input: '', applied: '', value: 0, error: '' });
    resetBooking(); setData((p) => ({ ...p, name: '' }));
    setProfileOpen(false); setPhase('welcome'); showToast(t('forgot'));
  };

  const enter = () => {
    if (!ageOk) { vibrate(50); showToast(t('needAgeEnter')); return; }
    vibrate(30); store.set('thaly_onboard_final', 'yes'); setPhase('site');
  };

  const dayName = (d: Date, i: number) => (i === 0 ? t('today') : i === 1 ? t('tomorrow') : fmt(d, { weekday: 'short' }).replace('.', ''));
  const greeting = now.getHours() < 12 ? t('gm') : now.getHours() < 18 ? t('ga') : t('gn');
  const chatLink = chosen ? waLink(t('nudgeMsg').replace('{s}', pt.title)) : waLink(t('chatMsg'));
  const onChat = () => safeTrack('duvida_whatsapp', { sessao: chosen ? pkg.id : 'nenhuma' });
  const nextLabel = nextFree ? `${nextFree.k === 0 ? t('today') : nextFree.k === 1 ? t('tomorrow') : fmt(nextFree.d, { weekday: 'long' })} ${nextFree.t}` : '';
  const minMassagePrice = useMemo(() => Math.min(...MASSAGES.map((p) => p.price)), []);
  const minVisual = getVisualPrice(minMassagePrice);
  const allReviews = HOME_REVIEWS[lang];
  const visibleReviews = showAllReviews ? allReviews : allReviews.slice(0, 3);

  // ---- Deep links (?sessao=, ?cupom=, ?agendar) aplicados quando o site abre ----
  useEffect(() => {
    if (phase !== 'site' || !deepLink.current) return;
    const dl = deepLink.current; deepLink.current = null;
    if (dl.pkg) pickPkg(dl.pkg);
    if (dl.coupon && C.COUPONS[dl.coupon]) setCoupon({ input: '', applied: dl.coupon, value: C.COUPONS[dl.coupon], error: '' });
    safeTrack('link_direto', { sessao: dl.pkg || 'nenhuma', cupom: dl.coupon || 'nenhum' });
    if (dl.book) scrollToRef(bookRef, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // ---- Rascunho: lembra sessão/dia/horário (sem nome nem endereço) por 3 dias ----
  useEffect(() => {
    if (phase !== 'site') return;
    try {
      const raw = store.get(DRAFT_KEY);
      if (!raw) return;
      const d = JSON.parse(raw) as Draft;
      const stillValid = d && Date.now() - d.at < DRAFT_TTL && PACKAGES.some((p) => p.id === d.packageId) && (!d.date || d.date >= dateKey(spNow()));
      if (stillValid) setDraft(d); else store.del(DRAFT_KEY);
    } catch { store.del(DRAFT_KEY); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);
  useEffect(() => {
    if (phase !== 'site' || done || !data.packageId || draft) return;
    const d: Draft = { packageId: data.packageId, offer, date: data.date ? dateKey(data.date) : '', time: data.time, locType: data.locType, at: Date.now() };
    store.set(DRAFT_KEY, JSON.stringify(d));
  }, [phase, done, draft, data.packageId, data.date, data.time, data.locType, offer]);
  const resumeDraft = () => {
    if (!draft) return;
    const day = draft.date ? days.find((x) => dateKey(x.d) === draft.date)?.d ?? null : null;
    setOffer(draft.offer);
    set({ packageId: draft.packageId, date: day, time: day ? draft.time : '', locType: draft.locType });
    setDraft(null); safeTrack('rascunho_retomado', { sessao: draft.packageId }); setView(3);
  };
  const dropDraft = () => { store.del(DRAFT_KEY); setDraft(null); };
  // Pedido proposto pelo assistente de IA: preenche sessão, plano, dia e horário e leva a pessoa para o passo seguinte
  const applyChatBooking = (b: ChatBooking) => {
    const day = days.find((x) => dateKey(x.d) === b.date)?.d ?? null;
    if (!PACKAGES.some((x) => x.id === b.packageId) || !day) { showToast(t('fill')); return; }
    setDraft(null);
    setOffer(b.packageId === 'aparo_solo' ? 'single' : (['single', 'combo', 'biweekly', 'pack'].includes(b.offer) ? (b.offer as Offer) : 'single'));
    set({ packageId: b.packageId, date: day, time: b.time, locType: b.locType });
    setView(3);
  };

  // ---- Quiz "qual sessão é pra você" ----
  const quizResult = useMemo(() => {
    if (quiz.step < 4) return null;
    const first = quiz.first === 'yes';
    const id = quiz.need === 'muscle' ? 'classica' : quiz.need === 'relax' ? 'sensitiva' : quiz.need === 'intense' ? (first ? 'fusion' : 'completa') : 'aparo_solo';
    const p = PACKAGES.find((x) => x.id === id) || PACKAGES[1];
    const plan: Offer = quiz.freq === 'routine' && id !== 'aparo_solo' ? 'biweekly' : 'single';
    const planSave = plan === 'biweekly' ? p.price * 2 - Math.round(p.price * 2 * (1 - C.BIWEEKLY_DISC)) : 0;
    return { p, plan, planSave };
  }, [quiz]);
  const answerQuiz = (patch: Partial<typeof quiz>) => {
    vibrate(12);
    setQuiz((q) => {
      const next = { ...q, ...patch, step: q.step + 1 };
      // Aparo não precisa das outras perguntas.
      if (next.need === 'aparo') return { ...next, first: 'no', freq: 'once', step: 4 };
      return next;
    });
  };
  const applyQuiz = () => {
    if (!quizResult) return;
    safeTrack('quiz_concluido', { sessao: quizResult.p.id, plano: quizResult.plan });
    pickPkg(quizResult.p.id); setOffer(quizResult.plan); setView(quizResult.p.id === 'aparo_solo' ? 3 : 2);
  };

  // ---- Ajuda na hora certa: quem escolheu e parou, ou vai sair, recebe um convite para tirar dúvida ----
  useEffect(() => {
    if (phase !== 'site' || !chosen || reviewed || done || nudge) return undefined;
    let seen = false; try { seen = sessionStorage.getItem('thaly_nudge') === '1'; } catch { /* */ }
    if (seen) return undefined;
    const show = () => { setNudge(true); try { sessionStorage.setItem('thaly_nudge', '1'); } catch { /* */ } safeTrack('ajuda_exibida', { sessao: data.packageId }); };
    const idle = setTimeout(show, 50000);
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) show(); };
    document.addEventListener('mouseleave', onLeave);
    return () => { clearTimeout(idle); document.removeEventListener('mouseleave', onLeave); };
  }, [phase, chosen, reviewed, done, nudge, data.packageId, data.date, data.time]);

  const renderAge = (id: string) => (
    <div className="flex items-start gap-3 text-sm leading-relaxed">
      <Checkbox id={id} checked={ageOk} onCheckedChange={setAgeOk} />
      <p>
        <Label htmlFor={id} className="lbl-chk">{t('ageA')} </Label>
        <LinkBtn onClick={() => setDoc('privacy')}>{t('privacy')}</LinkBtn>, <LinkBtn onClick={() => setDoc('terms')}>{t('terms')}</LinkBtn> {t('and')} <LinkBtn onClick={() => setDoc('refund')}>{t('refund')}</LinkBtn>.
      </p>
    </div>
  );

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

  return (
    <div className="app" data-theme={theme} style={{ paddingBottom: showBar ? 96 : 24 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {toast && <div role="status" aria-live="polite" className="fixed left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-sm font-semibold text-center shadow-xl" style={{ top: 80, zIndex: 200, maxWidth: '90vw', background: 'var(--ink)', color: 'var(--bg)' }}>{toast}</div>}

      <a href="#main" className="skip">{t('skip')}</a>

      <header className="sticky top-0" style={{ zIndex: 50, background: 'color-mix(in srgb,var(--bg) 90%,transparent)', backdropFilter: 'blur(14px)', borderBottom: '1px solid var(--line)', paddingTop: 'env(safe-area-inset-top)' }}>
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
            <div className="rise mb-6" style={{ animationDelay: '.6s' }}>{renderAge('age-w')}</div>
            <Button onClick={enter} disabled={!ageOk} className="btn-ui btn-p btn-xl w-full rise" style={{ animationDelay: '.7s' }}>{ageOk ? t('enter') : t('needAgeEnter')}</Button>
          </section>
        )}

        {phase === 'site' && (<>
          <section className="relative pt-12 pb-14 flex flex-col justify-center" style={{ minHeight: 'calc(100svh - 76px)' }}>
            <div className="glow" aria-hidden="true" />
            <div className="hero-photo" aria-hidden="true" />
            <div className="relative">
              <Reveal><div className="glass-ui hero-pill inline-flex items-center gap-3 max-w-full pl-1.5 pr-4 py-1.5 mb-6"><Avatar className="w-11 h-11 rounded-full shrink-0" alt="" /><p className="min-w-0 text-sm font-semibold leading-snug">Thalyson<span className="block text-[13px] font-medium" style={{ color: 'color-mix(in srgb,var(--ink) 80%,transparent)' }}>{t('badge')}</span></p></div></Reveal>
              <Title as="h1" className="mb-4" style={{ fontSize: 'clamp(44px,11.5vw,84px)' }}>{t('h1')}</Title>
              <Reveal delay={250}><p className="text-lg leading-relaxed mb-8 max-w-md c-mute">{isReturning ? t('smartSub') : t('sub')}</p></Reveal>
              <Reveal delay={380}>
                <div className="btn-row mb-6">
                  <Button onClick={goBook} className="btn-ui btn-p btn-lg">{t('cta')}</Button>
                  <Button onClick={() => document.getElementById('avaliacoes')?.scrollIntoView({ block: 'start' })} className="btn-ui btn-g btn-lg"><Icon name="star" size={18} /> {t('seeReviews')}</Button>
                </div>
              </Reveal>
              <Reveal delay={500}>
                <dl className="hero-facts glass-ui">
                  {nextFree && <div><dt>{t('nextFree')}</dt><dd className="num"><span className="dot" aria-hidden="true" /> {nextLabel}</dd></div>}
                  <div><dt>{t('fromM')}</dt><dd className="num">{money(minVisual.disc > 0 ? minVisual.finalPrice : minMassagePrice)}{minVisual.disc > 0 && <span className="hero-facts-sub"> {t('firstShort')}</span>}</dd></div>
                </dl>
              </Reveal>
            </div>
          </section>

          <section id="como-funciona" className="mb-24 scroll-mt-20" aria-labelledby="how-h">
            <Title id="how-h" className="text-[30px] md:text-[38px] mb-2">{t('howH')}</Title>
            <Reveal delay={100}><p className="mb-8 c-mute">{t('howS')}</p></Reveal>
            <ol className="how-line">
              {(['1', '2', '3'] as const).map((n, i) => (
                <li key={n}>
                  <Reveal delay={i * 90} className="how-row">
                    <span className="how-n" aria-hidden="true">{n}</span>
                    <div className="min-w-0">
                      <p className="serif text-[21px] leading-tight mb-1">{t(`how${n}T`)}</p>
                      <p className="text-sm leading-relaxed c-mute">{t(`how${n}D`)}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <Reveal delay={200}><p className="how-note glass-ui"><Icon name="check" size={18} /><span>{t('howNote')}</span></p></Reveal>
          </section>

          {draft && !chosen && (
            <Reveal className="mb-10">
              <Card className="draft-card p-5" style={{ borderColor: 'var(--acc)' }}>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider c-mute">{t('draftH')}</p>
                  <p className="font-extrabold numw leading-snug">{(PACKAGES.find((p) => p.id === draft.packageId) || PACKAGES[1]).L[lang].title}</p>
                  {draft.date && <p className="text-sm font-semibold numw c-mute cap1">{fmt(new Date(`${draft.date}T12:00:00`), { weekday: 'long', day: 'numeric', month: 'long' })}{draft.time ? `, ${draft.time}` : ''}</p>}
                </div>
                <div className="draft-actions">
                  <Button onClick={dropDraft} className="btn-ui btn-g btn-sm">{t('draftNo')}</Button>
                  <Button onClick={resumeDraft} className="btn-ui btn-p btn-sm">{t('draftBtn')}</Button>
                </div>
              </Card>
            </Reveal>
          )}

          <section id="sessoes" ref={bookRef} className="scroll-mt-20 mb-24" aria-label={t('cta')}>
            {done ? (
              <Reveal>
                <Card className="card-flat p-6 sm:p-8">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6 c-ok" style={{ background: 'color-mix(in srgb,var(--ok) 18%,transparent)' }}><Icon name="check" size={32} /></div>
                  <h2 className="serif text-4xl font-light mb-4">{t('doneH')}</h2>
                  <p className="leading-relaxed mb-4 c-mute">{t('doneP')}</p>
                  <p className="font-bold mb-8">{t('doneSig')} {C.PIX_KEY} • <span className="num">{money(invoice.sinal)}</span></p>
                  <div className="btn-col max-w-sm">
                    <Button asChild className="btn-ui btn-p w-full">
                      <a href={sentLink && sentLink !== '#' ? sentLink : whatsappLink()} target="_blank" rel="noopener noreferrer">{t('resend')}</a>
                    </Button>
                    <Button asChild className="btn-ui btn-g w-full">
                      <a href={C.PAY_LINK} target="_blank" rel="noopener noreferrer" onClick={() => safeTrack('sinal_mercadopago', { tela: 'final' })}><Icon name="card" size={16} /> {t('payLink').replace('{v}', money(invoice.sinal))}</a>
                    </Button>
                    <Button onClick={copyPix} className="btn-ui btn-g w-full"><Icon name="copy" size={16} /> {t('copyPix')}</Button>
                    <p className="text-xs c-mute">{t('payHint').replace('{v}', money(invoice.sinal))}</p>
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
              <div className="space-y-10">
                <div className="wiz-top" aria-live="polite">
                  <p className="text-sm font-semibold numw">{t('wizStep').replace('{a}', String(view === 1 ? 1 : view === 2 ? 2 : isSolo ? view - 1 : view)).replace('{b}', String(isSolo ? 3 : 4))}</p>
                  <div className="wiz-bar" aria-hidden="true"><span style={{ width: `${((view === 1 ? 1 : view === 2 ? 2 : isSolo ? view - 1 : view) / (isSolo ? 3 : 4)) * 100}%` }} /></div>
                </div>
                {view === 1 && (<div>
                  <StepHead n={1} title={t('s1')} done={chosen} />
                  <p className="text-sm mb-5 -mt-3 c-mute">{t('sessS')}</p>
                  {quiz.step === 0 ? (
                    <div className="quiz-inline glass-ui">
                      <div className="min-w-0">
                        <p className="font-semibold leading-snug">{t('quizH')}</p>
                        <p className="text-sm c-mute">{t('quizS')}</p>
                      </div>
                      <Button onClick={() => { vibrate(10); setQuiz({ step: 1, need: '', first: '', freq: '' }); safeTrack('quiz_iniciado'); }} className="btn-ui btn-g btn-sm"><Icon name="sparkle" size={16} /> {t('quizStart')}</Button>
                    </div>
                  ) : (
                    <Card className="p-5 sm:p-7 mb-5">
                {quiz.step >= 1 && quiz.step <= 3 && (
                  <div className="rise" key={quiz.step} aria-live="polite">
                    <p className="text-xs font-bold uppercase tracking-wider c-mute mb-2 numw">{t('quizStep').replace('{a}', String(quiz.step)).replace('{b}', '3')}</p>
                    <div className="h-1 rounded-full mb-5 overflow-hidden" style={{ background: 'var(--line)' }}><div className="h-full" style={{ width: `${(quiz.step / 3) * 100}%`, background: 'var(--acc)', transition: 'width .3s' }} /></div>
                    <h2 id="quiz-h" className="serif text-[24px] md:text-[30px] leading-tight mb-5">{t(`quizQ${quiz.step}`)}</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {(quiz.step === 1
                        ? [['muscle', 'quizA1a'], ['relax', 'quizA1b'], ['intense', 'quizA1c'], ['aparo', 'quizA1d']]
                        : quiz.step === 2 ? [['yes', 'quizA2a'], ['no', 'quizA2b']] : [['once', 'quizA3a'], ['routine', 'quizA3b']]
                      ).map(([v, k]) => (
                        <button key={v} type="button" className="chip-ui" style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '16px 18px', fontSize: 15.5 }}
                          onClick={() => answerQuiz(quiz.step === 1 ? { need: v } : quiz.step === 2 ? { first: v } : { freq: v })}>
                          {t(k)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {quizResult && (
                  <div className="rise" aria-live="polite">
                    <p className="text-xs font-bold uppercase tracking-wider c-ok mb-2">{t('quizRes')}</p>
                    <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
                      <h2 id="quiz-h" className="serif text-[30px] md:text-[38px] leading-tight">{quizResult.p.L[lang].title}</h2>
                      <span className="serif text-[26px] num" style={{ color: 'var(--acc)' }}>
                        {quizResult.plan === 'biweekly'
                          ? <>{money(quizResult.p.price * 2 - quizResult.planSave)} <span className="text-sm c-mute">/ 2x</span></>
                          : money(getVisualPrice(quizResult.p.price).finalPrice)}
                      </span>
                    </div>
                    <p className="leading-relaxed mb-3">{quizResult.p.L[lang].subtitle}</p>
                    <ul className="text-sm space-y-1 mb-6 c-mute">
                      <li className="flex items-center gap-2"><Icon name="clock" size={15} /> <span className="num">{dr(quizResult.p, lang)} {t('min')}</span></li>
                      {quizResult.planSave > 0 && <li className="flex items-center gap-2 c-ok"><Icon name="check" size={15} /> {t('quizPlan').replace('{v}', money(quizResult.planSave))}</li>}
                      {quizResult.plan === 'single' && !isReturning && quizResult.p.id !== 'aparo_solo' && <li className="flex items-center gap-2 c-ok"><Icon name="check" size={15} /> {t('quizFirst')}</li>}
                      {nextFree && <li className="flex items-center gap-2"><span className="dot" aria-hidden="true" /> {t('nextFree')}: <strong className="c-ink num">{nextLabel}</strong></li>}
                    </ul>
                    <div className="btn-row">
                      <Button onClick={applyQuiz} className="btn-ui btn-p btn-md">{t('quizGo')}</Button>
                      <Button onClick={() => setQuiz({ step: 0, need: '', first: '', freq: '' })} className="btn-ui btn-g btn-md">{t('close')}</Button>
                    </div>
                  </div>
                )}
                    </Card>
                  )}
                  <RadioGroup value={data.packageId} onValueChange={pickPkg} aria-label={t('s1')} className="grid gap-3">
                    {PACKAGES.map((p, i) => {
                      const on = data.packageId === p.id;
                      const L = p.L[lang];
                      const isRec = p.id === recommendedPkgId;
                      const rgb = THEME_RGB[p.theme][theme];
                      const mine = narr.activeId === p.id;
                      const playing = mine && narr.state === 'playing';
                      const paused = mine && narr.state === 'paused';
                      const vp = getVisualPrice(p.price, p.id === 'aparo_solo');
                      const narrText = `${L.title}. ${L.subtitle} ${t('flowH')}: ${L.flow.join('. ')}. ${L.desc}`;
                      return (
                        <Reveal key={p.id} delay={i * 50}>
                          <div
                            className="pkg-ui"
                            style={{
                              borderColor: on ? `rgb(${rgb})` : isRec ? `rgba(${rgb}, 0.55)` : undefined,
                              boxShadow: on ? `0 0 0 1px rgb(${rgb})` : isRec ? `0 0 0 1px rgba(${rgb}, 0.25)` : undefined,
                              backgroundColor: on ? `rgba(${rgb}, 0.06)` : isRec ? `rgba(${rgb}, 0.03)` : undefined,
                            }}
                          >
                            <Label className="pkg-head">
                              <RadioGroupItem value={p.id} />
                              <div className="flex justify-between items-start gap-3">
                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-1">
                                    <span className="serif text-[21px] sm:text-[23px] leading-tight">{L.title}</span>
                                    <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-s2 num">{dr(p, lang)} {t('min')}</span>
                                    {isRec && <span className="badge-rec"><Icon name="sparkle" size={11} /> {t('recommended')}</span>}
                                  </div>
                                  <span className="block text-sm c-mute">{L.subtitle}</span>
                                </div>
                                <div className="text-right num">
                                  <span className="serif text-[22px] sm:text-[25px] leading-none block font-semibold" style={{ color: on || isRec ? `rgb(${rgb})` : 'var(--acc)' }}>
                                    {money(p.price)}
                                  </span>
                                  {vp.disc > 0 && <span className="block text-xs font-bold mt-1 c-ok">{t('firstShort')} {money(vp.finalPrice)}</span>}
                                </div>
                              </div>
                            </Label>
                            {on && (
                              <div className="rise px-5 pb-5" style={{ borderTop: '1px solid var(--line)' }}>
                                <p className="text-sm font-bold pt-4 mb-3">{t('flowH')}</p>
                                <ol className="how-list">{L.flow.map((st) => <li key={st}>{st}</li>)}</ol>
                                {L.desc && <p className="text-sm mb-4 c-mute">{L.desc}</p>}
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    disabled={!narr.supported}
                                    onClick={() => { vibrate(10); narr.toggle(p.id, narrText); }}
                                    className="btn-ui btn-g btn-sm"
                                    style={{ borderColor: `rgba(${rgb}, 0.5)`, color: `rgb(${rgb})` }}
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
                                <Button onClick={() => { vibrate(15); setView(p.id === 'aparo_solo' ? 3 : 2); }} className="btn-ui btn-p btn-md w-full mt-5">{t('wizPkg')}</Button>
                                {mine && narr.supported && !narr.male && <p className="text-xs mt-2 c-mute" role="status">{t('voiceLow')}</p>}
                              </div>
                            )}
                          </div>
                        </Reveal>
                      );
                    })}
                  </RadioGroup>
                </div>)}

                {chosen && !isSolo && view === 2 && (
                  <div className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={2} title={t('s2')} done={true} />
                      <RadioGroup value={offerEff} onValueChange={(v) => { vibrate(15); setOffer(v as Offer); }} aria-label={t('s2')} className="grid sm:grid-cols-2 gap-3">
                        {([
                          ['single', t('oSingle'), t('oSingleD'), getVisualPrice(pkg.price).finalPrice, getVisualPrice(pkg.price).disc > 0 ? pkg.price : 0, getVisualPrice(pkg.price).disc],
                          ['combo', t('oCombo'), t('oComboD'), getVisualPrice(pkg.price + pkg.combo).finalPrice, pkg.price + C.APARO_FULL, (C.APARO_FULL - pkg.combo) + getVisualPrice(pkg.price + pkg.combo).disc],
                          ['biweekly', t('oBiweekly'), t('oBiweeklyD').replace('{n}', String(C.BIWEEKLY_DAYS)), Math.round(pkg.price * 2 * (1 - C.BIWEEKLY_DISC)), pkg.price * 2, (pkg.price * 2) - Math.round(pkg.price * 2 * (1 - C.BIWEEKLY_DISC))],
                          ['pack', t('oPack'), t('oPackD').replace('{n}', String(C.PACK_DAYS)), pkg.price * C.PACK_PAY, pkg.price * C.PACK_TOTAL, pkg.price],
                        ] as [Offer, string, string, number, number, number][]).map(([o, a, b, price, was, sv]) => (
                          <Label key={o} className={cn('opt-ui flex flex-col justify-between', offerEff === o && 'on')}>
                            <RadioGroupItem value={o} />
                            <div>
                              <div className="flex justify-between items-start gap-3">
                                <span className="font-bold leading-snug min-w-0 flex-1">{a}</span>
                                <span className="text-right num">
                                  <span className="serif text-[21px] sm:text-[22px] block leading-none font-semibold" style={{ color: 'var(--acc)' }}>{money(price)}</span>
                                  {was > price && <span className="block text-xs mt-1"><s className="c-mute">{money(was)}</s></span>}
                                </span>
                              </div>
                              <span className="block text-sm mt-2 c-mute">{b}</span>
                            </div>
                            {sv > 0 && <Badge className="mt-3 self-start c-ok num" style={{ background: 'color-mix(in srgb,var(--ok) 16%,transparent)' }}>{t('save')} {money(sv)}</Badge>}
                          </Label>
                        ))}
                      </RadioGroup>
                      {hasPlan && <p className="text-sm leading-relaxed mt-3 c-mute">{t('packNote')}</p>}
                      <div className="wiz-nav">
                        <Button onClick={() => setView(1)} className="btn-ui btn-g btn-md">{t('wizBack')}</Button>
                        <Button onClick={() => { vibrate(15); setView(3); }} className="btn-ui btn-p btn-md">{t('wizNext')}</Button>
                      </div>
                    </Reveal>
                  </div>
                )}

                {chosen && view === 3 && (
                  <div ref={s3Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 2 : 3} title={t('s3')} done={step3Valid} />
                      <div className="space-y-8">
                        <div style={{ minWidth: 0 }}>
                          <p className="lbl-ui" id="loc-lbl">{t('place')}</p>
                          <RadioGroup aria-labelledby="loc-lbl" value={data.locType} onValueChange={(v) => set({ locType: v as 'studio' | 'home' })} className="g-2">
                            {([['studio', t('studio')], ['home', t('home')]] as const).map(([id, label]) => (
                              <Label key={id} className={cn('chip-ui', data.locType === id && 'on')}>
                                <RadioGroupItem value={id} />{label}
                              </Label>
                            ))}
                          </RadioGroup>
                          <p className="text-sm mt-3 leading-relaxed c-mute">{isHome ? t('homeInfo') : t('studioInfo')}</p>
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

                        {nextFree && (
                          <div className="rec-slot" style={{ background: 'color-mix(in srgb,var(--ok) 12%,transparent)', border: '1px solid color-mix(in srgb,var(--ok) 35%,transparent)' }}>
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="dot" aria-hidden="true" />
                              <div className="min-w-0">
                                <p className="text-xs font-bold uppercase tracking-wider c-ok">{t('recSlotH')}</p>
                                <p className="font-extrabold capitalize numw">{nextLabel}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => { vibrate(15); set({ date: nextFree.d, time: nextFree.t }); }}
                              className="btn-ui btn-sm"
                              style={{ background: 'var(--ok)', color: 'var(--onacc)', minHeight: 44, padding: '8px 16px', fontSize: 14 }}
                            >
                              {t('recSlotBtn')}
                            </Button>
                          </div>
                        )}

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
                                <Label key={dateKey(d)} className={cn('chip-ui col shrink-0 snap-start num', sel && 'on')} style={{ width: 80, minWidth: 80, padding: '12px 4px' }}>
                                  <RadioGroupItem value={dateKey(d)} aria-label={fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} />
                                  <span aria-hidden="true" className="text-xs font-bold capitalize">{dayName(d, i)}</span>
                                  <span aria-hidden="true" className="serif text-[28px] leading-tight">{d.getDate()}</span>
                                  <span aria-hidden="true" className="text-xs opacity-75">{fmt(d, { month: 'short' }).replace('.', '')}</span>
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
                              <span className="text-xs c-mute num">{t('session')} {ranged ? `${invoice.dur} ${lang === 'en' ? 'to' : 'a'} ${invoice.durMax}` : invoice.dur} {t('min')}</span>
                            </div>
                            {availableCount > 0 && availableCount <= 2 && <p className="text-xs font-bold mb-3 c-warn">{t('lastSlots')}</p>}
                            <RadioGroup aria-labelledby="time-lbl" value={data.time} onValueChange={(v) => { vibrate(15); set({ time: v }); }} className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                              {slots.map(({ t: tm, ok }) => {
                                const sel = data.time === tm;
                                const peak = isHome && PEAK_HOURS.includes(tm);
                                return (
                                  <Label key={tm} className={cn('chip-ui col num', sel && 'on', !ok && 'off')} style={{ padding: '12px 4px' }}>
                                    <RadioGroupItem value={tm} disabled={!ok} aria-label={`${tm}${!ok ? ', ' + t('unavailable') : ''}${peak ? ', ' + t('peak') : ''}`} />
                                    <span aria-hidden="true">{tm}</span>
                                    {peak && ok && <span aria-hidden="true" className="text-xs font-bold" style={{ color: sel ? 'inherit' : 'var(--warn)' }}>{t('peak')} +{C.PEAK_FEE}</span>}
                                  </Label>
                                );
                              })}
                            </RadioGroup>
                            {availableCount === 0 && <p className="text-sm py-5 c-mute">{t('noSlots')}</p>}
                            {data.time && <p className="text-[15.5px] font-semibold mt-4 flex items-start gap-2 c-ok numw"><Icon name="check" size={16} className="mt-1" /> {t('from')} {data.time} {t('to')} {endTime}{ranged ? ` (${t('upTo')} ${endMax})` : ''}</p>}
                            <p className="text-xs mt-3 c-mute">{liveCal ? <><span className="dot" aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 8, marginRight: 6, verticalAlign: 'middle' }} />{t('liveCal')}</> : t('demo')}</p>
                            {touched && errors.time && <p className="err" role="alert">{errors.time}</p>}
                          </div>
                        )}

                        <div>
                          <Label htmlFor="nm" className="lbl-ui">{t('name')}</Label>
                          <Input id="nm" autoComplete="given-name" type="text" value={data.name} maxLength={60} placeholder={t('namePh')} onChange={(e) => set({ name: e.target.value })} aria-invalid={touched && !!errors.name} aria-describedby={touched && errors.name ? 'nm-err' : undefined} />
                          {touched && errors.name && <p id="nm-err" className="err" role="alert">{errors.name}</p>}
                          <input type="text" name="website" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                        </div>

                        <div>
                          <p className="lbl-ui" id="prefs-lbl">{t('prefsH')}</p>
                          <div className="g-2" role="group" aria-labelledby="prefs-lbl">
                            <button type="button" aria-pressed={data.incense} className={cn('chip-ui', data.incense && 'on')} onClick={() => { vibrate(10); set({ incense: !data.incense }); }}>{data.incense && <Icon name="check" size={16} />} {t('prefIncenseS')}</button>
                            <button type="button" aria-pressed={data.music} className={cn('chip-ui', data.music && 'on')} onClick={() => { vibrate(10); set({ music: !data.music }); }}>{data.music && <Icon name="check" size={16} />} {t('prefMusicS')}</button>
                          </div>
                        </div>

                        <div>
                          <div className="wiz-nav">
                            <Button onClick={() => setView(isSolo ? 1 : 2)} className="btn-ui btn-g btn-md">{t('wizBack')}</Button>
                            <Button className="btn-ui btn-p btn-md" onClick={goReview}>{t('cont')}</Button>
                          </div>
                          <p className="text-sm mt-4 c-mute">{t('chatQ')} <a href={chatLink} onClick={onChat} target="_blank" rel="noopener noreferrer" className="lnk-ui" style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44 }}>{t('chatBtn')}</a></p>
                        </div>
                      </div>
                    </Reveal>
                  </div>
                )}

                {chosen && reviewed && view === 4 && (
                  <div ref={s4Ref} className="scroll-mt-24">
                    <Reveal>
                      <StepHead n={isSolo ? 3 : 4} title={t('s4')} done={false} />
                      <div className="space-y-8">
                        <Card className="p-6 space-y-3">
                          <Row label={t('sPack')} value={pt.title} />
                          <Row label={t('sWhen')} value={data.date ? `${fmt(data.date, { weekday: 'short', day: '2-digit', month: 'short' })}, ${data.time} – ${endTime}${ranged ? ` (${t('upTo')} ${endMax})` : ''}` : ''} />
                          <Row label={t('sLoc')} value={isHome ? `${data.street}, ${data.number} - ${data.bairro}` : t('sLocStudio')} />
                          <Button onClick={() => setView(3)} className="lnk-ui lnk-block lnk-left text-sm">{t('change')}</Button>
                        </Card>

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
                                  <span className="min-w-0 flex-1">{t('lTime')}</span><span className="font-bold num">+ {money(C.TIME_ADD)}</span>
                                </Label>
                              </div>
                              {!hasPlan && (
                                <div>
                                  <Label htmlFor="cp" className="lbl-ui">{t('couponQ')}</Label>
                                  {coupon.applied ? (
                                    <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-s2 text-sm">
                                      <span className="font-bold c-ok">{t('lCoupon')}: {coupon.applied}</span>
                                      <Button onClick={clearCoupon} className="lnk-ui text-xs">{t('couponRemove')}</Button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex gap-2">
                                        <Input id="cp" type="text" autoCapitalize="characters" placeholder={t('couponPh')} value={coupon.input} onChange={(e) => setCoupon({ ...coupon, input: e.target.value, error: '' })} onKeyDown={(e) => e.key === 'Enter' && selectCouponCode(coupon.input)} className="uppercase flex-1" style={{ minWidth: 0 }} aria-describedby={coupon.error ? 'cp-err' : undefined} />
                                        <Button onClick={() => selectCouponCode(coupon.input)} className="btn-ui btn-g shrink-0">{t('apply')}</Button>
                                      </div>
                                      {coupon.error && <p id="cp-err" className="err" role="alert">{coupon.error}</p>}
                                    </>
                                  )}
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
                            <Row label={isPack ? t('lPack5') : isBiweekly ? t('lPack2') : t('lPack')} value={money(invoice.fullUnitsPrice)} />
                            {aparoOn && <Row label={t('lCombo')} value={`+${money(C.APARO_FULL)}`} />}
                            {invoice.timeAdd > 0 && <Row label={t('lTime')} value={`+${money(invoice.timeAdd)}`} />}
                            {invoice.reqFee > 0 && <Row label={t('lReq')} value={`+${money(invoice.reqFee)}`} />}
                            {invoice.peakFee > 0 && <Row label={t('lPeak')} value={`+${money(invoice.peakFee)}`} />}
                            {invoice.saved > 0 && <Row label={t('lSubtotal')} value={money(invoice.grossSubtotal)} />}
                            {invoice.comboSave > 0 && <Row tone="ok" label={t('lCombo')} value={`-${money(invoice.comboSave)}`} />}
                            {invoice.planDiscount > 0 && <Row tone="ok" label={t('lPlanDisc')} value={`-${money(invoice.planDiscount)}`} />}
                            {invoice.discount > 0 && <Row tone="ok" label={coupon.applied ? `${t('lCoupon')} ${coupon.applied}` : t('lFirst')} value={`-${money(invoice.discount)}`} />}
                            {invoice.pixDiscount > 0 && <Row tone="ok" label={t('lPix')} value={`-${money(invoice.pixDiscount)}`} />}
                          </div>
                          <Separator />
                          <div className="flex justify-between items-baseline gap-3 pt-5">
                            <span className="c-mute min-w-0">{t('total')}</span>
                            <span className="serif text-[34px] sm:text-[46px] leading-none font-light num">{money(invoice.total)}</span>
                          </div>
                          {invoice.saved > 0 && <p className="mt-4 text-[15px] font-extrabold px-4 py-2.5 rounded-2xl c-ok numw" style={{ background: 'color-mix(in srgb,var(--ok) 15%,transparent)' }}>{t('saved')}: -{money(invoice.saved)}</p>}
                        </Card>

                        <div className="pay-step glass-ui" role="group" aria-labelledby="sinal-h">
                          <p id="sinal-h" className="pay-h numw">{t('sinalH').replace('{v}', money(invoice.sinal))}</p>
                          <p className="text-sm mb-4 c-mute">{t('sinalP')}</p>
                          <div className="btn-col">
                            <Button asChild className="btn-ui btn-g btn-md">
                              <a href={C.PAY_LINK} target="_blank" rel="noopener noreferrer" onClick={() => safeTrack('sinal_mercadopago', { tela: 'resumo' })}><Icon name="card" size={17} /> {t('payLink').replace('{v}', money(invoice.sinal))}</a>
                            </Button>
                            <Button onClick={copyPix} className="btn-ui btn-g btn-md"><Icon name="copy" size={16} /> {t('copyPix')}</Button>
                          </div>
                          <p className="text-xs mt-3 c-mute">{t('payHint').replace('{v}', money(invoice.sinal))}</p>
                        </div>

                        <div className="pay-step card-ui" role="group" aria-labelledby="rest-h">
                          <p id="rest-h" className="pay-h numw">{t('restH').replace('{v}', money(invoice.rest))}</p>
                          <p className="text-sm c-mute">{t('restP')}</p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3 text-sm leading-relaxed">
                            <Checkbox id="health-ok" checked={healthOk} onCheckedChange={setHealthOk} />
                            <Label htmlFor="health-ok" className="lbl-chk font-semibold">{isHome ? t('healthHome') : t('healthStudio')}</Label>
                          </div>

                          <div className="flex items-start gap-3 text-sm leading-relaxed c-mute">
                            <Checkbox id="opt-in" checked={optIn} onCheckedChange={setOptIn} />
                            <Label htmlFor="opt-in" className="lbl-chk">{t('optIn')}</Label>
                          </div>

                          {!ageOk && renderAge('age-ok')}
                        </div>

                        <Button onClick={finish} disabled={!healthOk || !ageOk} className="btn-ui btn-p btn-xl w-full">
                          {!healthOk ? t('needHealth') : !ageOk ? t('needAge') : t('send')}
                        </Button>
                        <Button onClick={() => setView(3)} className="lnk-ui lnk-block lnk-left lnk-mute">{t('wizBack')}</Button>
                      </div>
                    </Reveal>
                  </div>
                )}
              </div>
            )}
          </section>

          <section id="avaliacoes" className="mb-24 scroll-mt-20" aria-labelledby="rv-sec">
            <Title id="rv-sec" className="text-[30px] md:text-[38px] mb-1">{t('revH')}</Title>
            <Reveal delay={100}><p className="text-sm mb-6 c-mute">{t('revS')}</p></Reveal>
            <div className="rev-grid">
              {visibleReviews.map((r, i) => (
                <Reveal key={`${r.name}-${i}`} delay={(i % 3) * 80} className="h-full">
                  <figure className="glass-rev rev-card h-full">
                    <div className="rev-stars" role="img" aria-label={`${r.stars}/5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <svg key={n} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ opacity: n <= r.stars ? 1 : 0.25 }}><path d={ICONS.star} /></svg>
                      ))}
                    </div>
                    <blockquote className="text-[15px] leading-relaxed c-ink">{r.text}</blockquote>
                    <figcaption className="rev-by">
                      <span className="glass-avatar" aria-hidden="true">{r.initials}</span>
                      <span className="min-w-0"><strong className="block text-sm leading-tight c-ink">{r.name}</strong><span className="block text-xs c-mute">{r.tag}, {r.when}</span></span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
            <div className="btn-row mt-6">
              {allReviews.length > 3 && (
                <Button onClick={() => { vibrate(10); setShowAllReviews((v) => !v); }} className="btn-ui btn-g btn-md">
                  {showAllReviews ? t('revLess') : t('revMore').replace('{n}', String(allReviews.length))}
                </Button>
              )}
              <Button asChild className="btn-ui btn-g btn-md">
                <a href={C.REVIEW_LINK} target="_blank" rel="noopener noreferrer"><Icon name="star" size={16} /> {t('revBtn')}</a>
              </Button>
            </div>
          </section>

          <section id="sobre" className="mb-24 scroll-mt-20" aria-labelledby="ab">
            <Reveal>
              <div className="about">
                <div className="about-photo"><Avatar className="w-full h-full" alt="Thalyson" /></div>
                <div className="min-w-0">
                  <Title id="ab" className="text-[30px] md:text-[38px] mb-1">{t('aboutH')}</Title>
                  <p className="text-sm font-semibold mb-4">{t('aboutN')}</p>
                  <p className="leading-relaxed mb-5 c-mute">{t('about1')}</p>
                  <ul className="about-facts">
                    <li><Icon name="map" size={18} /><span>{t('about2')}</span></li>
                    <li><Icon name="check" size={18} /><span>{t('pBul1')}</span></li>
                    <li><Icon name="lock" size={18} /><span>{t('pBul2')}</span></li>
                  </ul>
                  <div className="btn-row mt-6">
                    <Button onClick={() => setProfileOpen(true)} className="btn-ui btn-p btn-md">{t('seeProfile')}</Button>
                    <Button asChild className="btn-ui btn-g btn-md"><a href={C.INSTAGRAM} target="_blank" rel="noopener noreferrer"><Icon name="instagram" size={18} /> Instagram</a></Button>
                  </div>
                </div>
              </div>
            </Reveal>
          </section>

          <section className="mb-20" aria-labelledby="fq">
            <Title id="fq" className="text-[30px] md:text-[38px] mb-2">{t('faqH')}</Title>
            <Reveal delay={100}><p className="mb-5 c-mute">{t('faqS')}</p></Reveal>
            <Reveal>
              <div className="ask-list">
                {(['q2', 'q3', 'q5', 'q6'] as const).map((q) => (
                  <button key={q} type="button" className="ask-ui" onClick={() => { vibrate(10); safeTrack('duvida_pergunta', { q }); setAsk({ q: t(q), k: Date.now() }); }}>
                    <span className="min-w-0">{t(q)}</span>
                    <Icon name="chat" size={16} />
                  </button>
                ))}
                <button type="button" className="ask-ui ask-own" onClick={() => { vibrate(10); setAsk({ q: '', k: Date.now() }); }}>
                  <span className="min-w-0 font-semibold">{t('faqOwn')}</span>
                  <Icon name="chat" size={16} />
                </button>
              </div>
            </Reveal>
          </section>

          <section className="mb-8" aria-labelledby="end-h">
            <Reveal>
              <div className="glass-ui end-card">
                <Title id="end-h" className="text-[30px] md:text-[40px] mb-2">{t('endH')}</Title>
                <p className="mb-6 c-mute">{t('endP')}</p>
                <div className="btn-row">
                  <Button onClick={goBook} className="btn-ui btn-p btn-lg">{t('cta')}</Button>
                  <Button asChild className="btn-ui btn-g btn-lg"><a href={chatLink} onClick={onChat} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> {t('chatBtn')}</a></Button>
                </div>
              </div>
            </Reveal>
          </section>
        </>)}
      </main>

      <footer className="max-w-3xl mx-auto px-5 mt-16 pt-6 text-xs leading-relaxed c-mute" style={{ borderTop: '1px solid var(--line)' }}>
        <nav aria-label={t('legalNav')} className="flex flex-wrap gap-x-2 -mx-2">
          {([['privacy', 'footPrivacy'], ['terms', 'footTerms'], ['refund', 'footRefund'], ['cookies', 'footCookies']] as [DocId, string][]).map(([id, k]) => (
            <Button key={id} onClick={() => setDoc(id)} className="lnk-ui lnk-block lnk-mute">{t(k)}</Button>
          ))}
        </nav>
        <p className="mt-2">
          {SITE_NAME} • Bela Vista, São Paulo - SP<br />
          <span style={{ overflowWrap: 'anywhere' }}>{LEGAL.EMAIL}</span>
        </p>
        <p className="mt-2 font-semibold">{t('adults')}</p>
        <p className="mt-5 pt-4" style={{ borderTop: '1px solid var(--line)' }}>
          {t('builtBy')}{' '}
          <a href={C.PORTFOLIO} target="_blank" rel="noopener noreferrer" className="lnk-ui c-ink" style={{ display: 'inline-block', padding: '13px 6px' }}>
            Thalyson Design
          </a>
        </p>
      </footer>

      {showBar && !done && (
        <div className="bar">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-tight c-mute truncate">{chosen ? pt.title : t('fromM')}</p>
              <p className="serif text-xl sm:text-2xl leading-none num">
                {money(chosen ? getVisualPrice(pkg.price).finalPrice : minVisual.finalPrice)}
              </p>
            </div>
            <Button onClick={goBook} className="btn-ui btn-p shrink-0">{t('cta')}</Button>
          </div>
        </div>
      )}

      {phase === 'site' && !done && (
        <AssistantChat
          lang={lang}
          bottom={showBar ? 100 : 18}
          avatar={C.AVATAR}
          whatsappUrl={chatLink}
          labelFor={(id) => (PACKAGES.find((x) => x.id === id) || PACKAGES[1]).L[lang].title}
          dateLabel={(iso) => fmt(new Date(`${iso}T12:00:00`), { weekday: 'short', day: '2-digit', month: 'short' })}
          onApply={applyChatBooking}
          onEvent={safeTrack}
          ask={ask}
        />
      )}

      {nudge && chosen && !done && (
        <div role="dialog" aria-labelledby="nudge-h" className="fixed left-1/2 -translate-x-1/2 rise" style={{ bottom: showBar ? 104 : 20, zIndex: 120, width: 'min(560px, calc(100vw - 24px))' }}>
          <Card className="p-5 shadow-xl" style={{ background: 'var(--bg)', borderColor: 'var(--acc)' }}>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12 rounded-full shrink-0" alt="" />
              <div className="min-w-0 flex-1">
                <p id="nudge-h" className="font-extrabold">{t('nudgeH')}</p>
                <p className="text-sm leading-relaxed c-mute mb-4">{t('nudgeP')}</p>
                <div className="flex flex-wrap gap-2">
                  <Button asChild className="btn-ui btn-p btn-sm">
                    <a href={chatLink} target="_blank" rel="noopener noreferrer" onClick={() => { safeTrack('ajuda_clicada', { sessao: data.packageId }); setNudge(false); }}><Icon name="chat" size={16} /> {t('nudgeBtn')}</a>
                  </Button>
                  <Button onClick={() => setNudge(false)} className="btn-ui btn-g btn-sm">{t('nudgeClose')}</Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {profileOpen && (
        <Modal title={t('profile')} onClose={() => setProfileOpen(false)} closeLabel={t('close')}>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-5">
              <Avatar className="w-20 h-20 rounded-full shrink-0" alt="Thalyson" />
              <div className="min-w-0">
                <h3 className="serif text-2xl leading-tight">{t('aboutN')}</h3>
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
                <a href={chatLink} onClick={onChat} target="_blank" rel="noopener noreferrer"><Icon name="chat" size={18} /> {t('chatBtn')}</a>
              </Button>
              <SocialButtons reviewsLabel={t('reviews')} grid />
            </div>
            <Button onClick={forgetMe} className="lnk-ui lnk-block lnk-mute lnk-full">{t('pForget')}</Button>
          </div>
        </Modal>
      )}

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
