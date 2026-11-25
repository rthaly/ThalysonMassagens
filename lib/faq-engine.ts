import { sessions } from '@/lib/content'
import { AVISOS } from '@/lib/atendimento'
import { PKG_MINUTES, SLUG_TO_PKG } from '@/lib/chat-knowledge'
import { addDays, freeSlots, isValidDate, spNow, type Busy, DAYS_AHEAD } from '@/lib/slots'

// Assistente de dúvidas SEM IA e SEM custo: reconhece perguntas comuns, responde com os mesmos dados do site
// (lib/content.ts e lib/atendimento.ts) e consulta a agenda real. O que não entende, encaminha ao WhatsApp.

type Lang = 'pt' | 'en' | 'es'
export type Booking = { packageId: string; offer: string; date: string; time: string; locType: 'studio' | 'home' }
export type Reply = { reply: string; booking?: Booking | null; handoff?: boolean }
type Msg = { role: 'user' | 'assistant'; content: string }

// Regras do negócio (as mesmas do fluxo de reserva em components/legacy-experience.tsx)
const SIGNAL = 40, FIRST = 15, PEAK_FEE = 18, REQ_FEE = 140, TIME_ADD = 75
const COMBO_APARO: Record<string, number> = { classica: 90, sensitiva: 85, fusion: 75, completa: 60 }

const norm = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const L = (lang: Lang, pt: string, en: string, es: string) => (lang === 'en' ? en : lang === 'es' ? es : pt)
const byPkg = (id: string) => sessions.find((s) => SLUG_TO_PKG[s.slug] === id)!
const money = (v: number) => `R$ ${v}`
const dur = (label: string, lang: Lang) => (lang === 'en' ? label.replace(' a ', ' to ') : label)

const SESSION_PATTERNS: [string, RegExp][] = [
  ['aparo_solo', /(aparo|aparar|depila|trim)/],
  ['fusion', /(barba|sensacoes|sensacao|beard|barba)/],
  ['completa', /(completa|corpo a corpo|corpo-a-corpo|body to body|cuerpo a cuerpo)/],
  ['sensitiva', /(sensitiva|sensitive)/],
  ['classica', /(classica|terapeutica|classic|clasica|therapeutic|terapeutico)/],
]
const WEEKDAYS: [string, number][] = [['domingo|sunday|domingo', 0], ['segunda|monday|lunes', 1], ['terca|tuesday|martes', 2], ['quarta|wednesday|miercoles', 3], ['quinta|thursday|jueves', 4], ['sexta|friday|viernes', 5], ['sabado|saturday|sabado', 6]]

const findSession = (n: string) => SESSION_PATTERNS.find(([, re]) => re.test(n))?.[0] ?? null
const weekdayOf = (date: string) => new Date(`${date}T12:00:00-03:00`).getUTCDay()

function findDate(n: string, today: string): string | null {
  if (/(depois de amanha|pasado manana|day after tomorrow)/.test(n)) return addDays(today, 2)
  if (/(amanha|manana|tomorrow)/.test(n)) return addDays(today, 1)
  if (/(hoje|hoy|today)/.test(n)) return today
  const dm = n.match(/\b(\d{1,2})[\/\-](\d{1,2})\b/)
  if (dm) {
    const y = today.slice(0, 4); const iso = `${y}-${dm[2].padStart(2, '0')}-${dm[1].padStart(2, '0')}`
    if (isValidDate(iso)) return iso < today ? `${Number(y) + 1}${iso.slice(4)}` : iso
  }
  const dd = n.match(/\bdia (\d{1,2})\b/)
  if (dd) {
    for (let i = 0; i < DAYS_AHEAD; i++) { const d = addDays(today, i); if (Number(d.slice(8)) === Number(dd[1])) return d }
  }
  for (const [names, idx] of WEEKDAYS) {
    if (new RegExp(`\\b(${names})`).test(n)) { for (let i = 1; i <= 7; i++) { const d = addDays(today, i); if (weekdayOf(d) === idx) return d } }
  }
  return null
}

function findTime(n: string): string | null {
  const m = n.match(/\b(\d{1,2})\s?(?:h|:)\s?(\d{2})?/) || n.match(/\b(?:as|a las|at) (\d{1,2})\b/)
  if (!m) return null
  const h = Number(m[1]); const min = Number(m[2] ?? 0)
  return h >= 0 && h <= 23 && min <= 59 ? `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}` : null
}

function dayLabel(date: string, lang: Lang) {
  const loc = lang === 'en' ? 'en-US' : lang === 'es' ? 'es-ES' : 'pt-BR'
  return new Intl.DateTimeFormat(loc, { weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'America/Sao_Paulo' }).format(new Date(`${date}T12:00:00-03:00`))
}

const avisos = (today: string) => AVISOS.filter((a) => !a.ate || a.ate >= today).map((a) => a.texto)

export function answer(messages: Msg[], lang: Lang, busy: Busy[], now = new Date()): Reply {
  const today = spNow(now).date
  const users = messages.filter((m) => m.role === 'user').slice(-6)
  const last = norm(users[users.length - 1]?.content ?? '')
  const ctx = users.map((m) => norm(m.content))

  // Dados que a pessoa já deu na conversa (o mais recente vale)
  let sid: string | null = null, date: string | null = null, time: string | null = null
  for (const c of ctx) { sid = findSession(c) ?? sid; date = findDate(c, today) ?? date; time = findTime(c) ?? time }
  const lastSession = findSession(last)
  const isHome = ctx.some((c) => /(domicilio|\bcasa\b|meu endereco|\bhotel\b|home visit|a domicilio|at home|en casa|my home|my place|my address|mi casa|mi direccion)/.test(c)) && !/(suite|na sua suite)/.test(last)
  const offer = /(com aparo|aparo junto|combo)/.test(last) ? 'combo' : /(quinzenal|2x)/.test(last) ? 'biweekly' : /pacote/.test(last) ? 'pack' : 'single'
  const wantsBook = /\b(reservar|marcar|agendar|quero (ir|fazer|esse|essa)|book|reserve)\b/.test(last) || (!!findTime(last) && !!date && !/(cancel|remarc|antes|reembols|devolv|aviso)/.test(last))
  const nav = avisos(today)
  const avisoTxt = nav.length ? `\n\n${nav.join('\n')}` : ''

  // ---- Reserva: só propõe se o horário estiver mesmo livre ----
  if (wantsBook) {
    if (!sid) return { reply: L(lang, 'Qual sessão você quer: Clássica, Sensitiva, Sensações com Barba ou Corpo a Corpo?', 'Which session do you want: Classic, Sensitive, Beard Sensations or Body to Body?', '¿Qué sesión quieres: Clásica, Sensitiva, Sensaciones con Barba o Cuerpo a Cuerpo?') }
    if (!date) return { reply: L(lang, 'Para qual dia? Pode dizer hoje, amanhã, um dia da semana ou uma data como 25/11.', 'For which day? You can say today, tomorrow, a weekday or a date like 25/11.', '¿Para qué día? Puedes decir hoy, mañana, un día de la semana o una fecha como 25/11.') + avisoTxt }
    const slots = freeSlots(date, PKG_MINUTES[sid], isHome, busy, now)
    if (!time) return slots.length ? { reply: L(lang, `${dayLabel(date, lang)} tenho estes horários: ${slots.join(', ')}. Qual prefere?`, `On ${dayLabel(date, lang)} I have: ${slots.join(', ')}. Which one?`, `El ${dayLabel(date, lang)} tengo: ${slots.join(', ')}. ¿Cuál prefieres?`) + avisoTxt } : { reply: L(lang, `Em ${dayLabel(date, lang)} não tenho horário livre. Quer tentar outro dia?`, `No free time on ${dayLabel(date, lang)}. Want another day?`, `No hay horario libre el ${dayLabel(date, lang)}. ¿Otro día?`) + avisoTxt }
    if (!slots.includes(time)) return { reply: slots.length ? L(lang, `Às ${time} não está livre. Livres em ${dayLabel(date, lang)}: ${slots.join(', ')}.`, `${time} is not free. Free on ${dayLabel(date, lang)}: ${slots.join(', ')}.`, `A las ${time} no está libre. Libres el ${dayLabel(date, lang)}: ${slots.join(', ')}.`) : L(lang, `Em ${dayLabel(date, lang)} não tenho horário livre. Quer tentar outro dia?`, `No free time on ${dayLabel(date, lang)}. Want another day?`, `No hay horario libre el ${dayLabel(date, lang)}. ¿Otro día?`) }
    const s = byPkg(sid)
    const peak = isHome && ['12:00', '13:00', '17:00', '18:00', '19:00'].includes(time)
    const fee = peak ? L(lang, ` Nesse horário, no seu endereço, há taxa de deslocamento de ${money(PEAK_FEE)}.`, ` At that time, at your address, there is a ${money(PEAK_FEE)} travel fee.`, ` A esa hora, en tu dirección, hay una tasa de desplazamiento de ${money(PEAK_FEE)}.`) : ''
    return {
      reply: L(lang, `Deixei o pedido pronto na tela: ${s.name}, ${dayLabel(date, lang)} às ${time}. Revise e mande no WhatsApp. O Thalyson confirma depois do Pix do sinal de ${money(SIGNAL)}.`, `Your request is ready on screen: ${s.name}, ${dayLabel(date, lang)} at ${time}. Review it and send on WhatsApp. Thalyson confirms after the ${money(SIGNAL)} Pix deposit.`, `Dejé el pedido listo en pantalla: ${s.name}, ${dayLabel(date, lang)} a las ${time}. Revísalo y envíalo por WhatsApp. Thalyson confirma después del Pix de señal de ${money(SIGNAL)}.`) + fee,
      booking: { packageId: sid, offer: sid === 'aparo_solo' ? 'single' : offer, date, time, locType: isHome ? 'home' : 'studio' },
    }
  }

  const ask = (re: RegExp) => re.test(last)

  if (ask(/(voce e (um )?(robo|ia|bot|pessoa|humano)|e uma ia|e um robo|com quem falo|quem esta ai|are you (a )?(bot|human|ai)|eres (un )?(robot|bot|humano))/))
    return { reply: L(lang, 'Sou um assistente automático do site, não uma pessoa. Respondo as dúvidas mais comuns e mostro horários livres. Quem confirma tudo é o Thalyson, pelo WhatsApp.', 'I am an automatic assistant on the site, not a person. I answer common questions and show free times. Thalyson confirms everything on WhatsApp.', 'Soy un asistente automático del sitio, no una persona. Respondo dudas comunes y muestro horarios libres. Thalyson confirma todo por WhatsApp.'), handoff: true }

  if (ask(/(obrigad|valeu|thanks|thank you|gracias)/))
    return { reply: L(lang, 'Por nada. Se quiser reservar, é só me dizer a sessão, o dia e o horário.', 'Anytime. To book, just tell me the session, day and time.', 'De nada. Para reservar, dime la sesión, el día y la hora.') }

  if (ask(/lingam/))
    return { reply: L(lang, 'Lingam é a palavra em sânscrito para pênis. A massagem lingam é a parte final de algumas sessões: toques lentos no pênis, com gel lubrificante, para você relaxar por completo. Acontece só depois da massagem terapêutica, e tudo no seu ritmo. Se não quiser, é só avisar antes de começar.', 'Lingam is the Sanskrit word for penis. Lingam massage is the final part of some sessions: slow touch on the penis with lubricating gel so you relax completely. It comes only after the therapeutic massage, at your pace. If you do not want it, just say so before we start.', 'Lingam es la palabra en sánscrito para pene. El masaje lingam es la parte final de algunas sesiones: toques lentos en el pene con gel lubricante para que te relajes por completo. Viene solo después del masaje terapéutico y a tu ritmo. Si no lo quieres, avísame antes de empezar.') }

  if (ask(/(horario|horarios|livre|livres|disponivel|disponiveis|vaga|vagas|agenda|tem (como|horario)|available|free time|disponible|libre)/)) {
    const day = date ?? today
    const pid = sid ?? 'sensitiva'
    const slots = freeSlots(day, PKG_MINUTES[pid], isHome, busy, now)
    const note = sid ? '' : L(lang, ' (considerei uma sessão de 60 a 80 min)', ' (assuming a 60 to 80 min session)', ' (considerando una sesión de 60 a 80 min)')
    if (slots.length) return { reply: L(lang, `${dayLabel(day, lang)} tenho: ${slots.join(', ')}${note}. Quer reservar algum? Diga a sessão e o horário.`, `${dayLabel(day, lang)} I have: ${slots.join(', ')}${note}. Want to book one? Tell me the session and time.`, `${dayLabel(day, lang)} tengo: ${slots.join(', ')}${note}. ¿Quieres reservar uno? Dime la sesión y la hora.`) + avisoTxt }
    for (let i = 1; i < DAYS_AHEAD; i++) {
      const d = addDays(day, i); const next = freeSlots(d, PKG_MINUTES[pid], isHome, busy, now)
      if (next.length) return { reply: L(lang, `${dayLabel(day, lang)} não tenho horário livre. O próximo dia é ${dayLabel(d, lang)}, com: ${next.slice(0, 8).join(', ')}.`, `No free time on ${dayLabel(day, lang)}. The next day is ${dayLabel(d, lang)}, with: ${next.slice(0, 8).join(', ')}.`, `No hay horario libre el ${dayLabel(day, lang)}. El próximo día es ${dayLabel(d, lang)}, con: ${next.slice(0, 8).join(', ')}.`) + avisoTxt }
    }
    return { reply: L(lang, 'Não achei horário livre nos próximos dias. Me chama no WhatsApp que eu vejo uma data para você.', 'I found no free time in the coming days. Message me on WhatsApp and I will find a date.', 'No encontré horario libre en los próximos días. Escríbeme por WhatsApp y busco una fecha.') + avisoTxt, handoff: true }
  }

  if (ask(/\b(preco|precos|valor|valores|quanto (custa|e|fica)|custa|tabela|price|prices|cost|how much|cuanto|precio)\b/)) {
    if (lastSession === 'aparo_solo') { const s = byPkg(lastSession); return { reply: L(lang, `${s.name}: ${money(s.price)}, de ${s.durationLabel} minutos. Essa opção não tem desconto de primeira vez nem de Pix.`, `${s.name}: ${money(s.price)}, ${s.durationLabel} minutes. This option has no first-visit or Pix discount.`, `${s.name}: ${money(s.price)}, ${s.durationLabel} minutos. Esta opción no tiene descuento de primera vez ni de Pix.`) } }
    if (lastSession) { const s = byPkg(lastSession); return { reply: L(lang, `${s.name}: ${money(s.price)}, de ${s.durationLabel} minutos. Na primeira sessão tem ${money(FIRST)} de desconto automático, e no restante pago no Pix tem 3% de desconto.`, `${s.name}: ${money(s.price)}, ${s.durationLabel} minutes. First session gets ${money(FIRST)} off automatically, and paying the rest by Pix gets 3% off.`, `${s.name}: ${money(s.price)}, ${s.durationLabel} minutos. La primera sesión tiene ${money(FIRST)} de descuento automático y pagando el resto por Pix hay 3% de descuento.`) } }
    return { reply: L(lang, `${sessions.map((s) => `${s.name}: ${money(s.price)} (${s.durationLabel} min)`).join('\n')}\n\nSinal de ${money(SIGNAL)} no Pix para segurar o horário, descontado do total. Primeira sessão: ${money(FIRST)} de desconto.`, `${sessions.map((s) => `${s.name}: ${money(s.price)} (${dur(s.durationLabel, 'en')} min)`).join('\n')}\n\n${money(SIGNAL)} Pix deposit to hold the time, deducted from the total. First session: ${money(FIRST)} off.`, `${sessions.map((s) => `${s.name}: ${money(s.price)} (${s.durationLabel} min)`).join('\n')}\n\nSeñal de ${money(SIGNAL)} por Pix para guardar el horario, descontada del total. Primera sesión: ${money(FIRST)} de descuento.`) }
  }

  if (ask(/(quanto tempo|duracao|dura\b|how long|cuanto dura|duration)/))
    return { reply: L(lang, 'A Clássica dura de 40 a 60 minutos. A Sensitiva, a Sensações com Barba e a Corpo a Corpo duram de 60 a 80 minutos. O aparo, de 40 a 60 minutos. O tempo varia de acordo com o ritmo da sessão.', 'The Classic lasts 40 to 60 minutes. Sensitive, Beard Sensations and Body to Body last 60 to 80 minutes. The trim, 40 to 60 minutes. The time varies with the pace of the session.', 'La Clásica dura de 40 a 60 minutos. Sensitiva, Sensaciones con Barba y Cuerpo a Cuerpo duran de 60 a 80 minutos. El recorte, de 40 a 60 minutos. El tiempo varía según el ritmo de la sesión.') }

  if (ask(/(\bnu\b|\bnua\b|pelad|sem roupa|cueca|tirar a roupa|roupa|naked|nude|undress|desnud|ropa)/))
    return { reply: L(lang, 'Em todas as sessões você pode ficar sem roupa. Na Sensitiva só você fica sem roupa. Na Sensações com Barba e na Corpo a Corpo, nós dois ficamos nus. Na Clássica não tem toques íntimos. Qualquer limite seu eu respeito, é só dizer antes de começar.', 'In every session you can be undressed. In Sensitive only you are undressed. In Beard Sensations and Body to Body, we are both nude. The Classic has no intimate touch. I respect any limit you have, just say so before we start.', 'En todas las sesiones puedes quedarte sin ropa. En Sensitiva solo tú. En Sensaciones con Barba y Cuerpo a Cuerpo, los dos estamos desnudos. La Clásica no tiene toques íntimos. Respeto cualquier límite tuyo, dímelo antes de empezar.') }

  if (ask(/(primeira vez|nunca fiz|nunca fui|first time|primera vez|vergonha|timid|nervos)/))
    return { reply: L(lang, `Super normal na primeira vez. A gente conversa uns 2 minutos antes de começar, você me diz o que prefere e o que não quer, e tudo acontece no seu ritmo. Na primeira sessão tem ${money(FIRST)} de desconto automático. Se quiser ajuda para escolher, use o botão "Descobrir minha sessão" na página.`, `Totally normal on your first time. We chat for about 2 minutes before starting, you tell me what you prefer and what you do not want, and everything goes at your pace. Your first session gets ${money(FIRST)} off automatically.`, `Totalmente normal la primera vez. Conversamos unos 2 minutos antes de empezar, me dices qué prefieres y qué no quieres, y todo va a tu ritmo. La primera sesión tiene ${money(FIRST)} de descuento automático.`) }

  if (ask(/(domicilio|\bcasa\b|meu endereco|ir ate|vem ate|\bhotel\b|home visit|a domicilio|at home|en casa|my home|my place|my address|mi casa|mi direccion)/))
    return { reply: L(lang, `Atendo no seu endereço em São Paulo. Eu levo os cremes e você só precisa estar de banho tomado. Nos horários de trânsito pesado (12h, 13h, 17h, 18h e 19h) há taxa de deslocamento de ${money(PEAK_FEE)}. Deixo 30 minutos de folga antes e depois para o deslocamento.`, `I come to your address in São Paulo. I bring the creams and you just need to be freshly showered. At heavy-traffic times (12, 1, 5, 6 and 7 pm) there is a ${money(PEAK_FEE)} travel fee. I leave 30 minutes before and after for travel.`, `Atiendo en tu dirección en São Paulo. Llevo las cremas y tú solo debes estar duchado. En horarios de tráfico pesado (12, 13, 17, 18 y 19 h) hay una tasa de desplazamiento de ${money(PEAK_FEE)}. Dejo 30 minutos antes y después para el traslado.`) }

  if (ask(/(\bonde\b|endereco|\bfica\b|\bmetro\b|anhangabau|bela vista|como chego|chegar|address|\bwhere\b|donde|direccion|localizacao|cidade|regiao|bairro)/))
    return { reply: L(lang, 'Fica na Bela Vista, perto do Metrô Anhangabaú, numa suíte simples e reservada. O endereço exato eu mando pelo WhatsApp depois da reserva. Também atendo no seu endereço em São Paulo.', 'It is in Bela Vista, near Anhangabaú Metro, in a simple, private suite. I send the exact address on WhatsApp after you book. I also come to your address in São Paulo.', 'Está en Bela Vista, cerca del Metro Anhangabaú, en una suite simple y reservada. Te mando la dirección exacta por WhatsApp después de reservar. También atiendo en tu dirección en São Paulo.'), handoff: false }

  if (ask(/(cancel|remarc|reembols|devolv|desist|reschedul|refund|reprogram)/))
    return { reply: L(lang, `Avisando até 12 horas antes, eu devolvo os ${money(SIGNAL)} do sinal no Pix ou troco o dia sem custo. Com menos aviso, o sinal pode ficar como crédito ou ser retido, conforme combinamos.`, `If you tell me at least 12 hours ahead, I refund the ${money(SIGNAL)} deposit via Pix or move the day at no cost. With less notice, the deposit may become credit or be kept.`, `Avisando hasta 12 horas antes, devuelvo los ${money(SIGNAL)} de señal por Pix o cambio el día sin costo. Con menos aviso, la señal puede quedar como crédito o retenerse.`) }

  if (ask(/(sinal|pix|cartao|pagamento|pagar|dinheiro|parcel|payment|deposit|pago|tarjeta|efectivo)/))
    return { reply: L(lang, `Você paga ${money(SIGNAL)} de sinal no Pix para segurar o horário, e esse valor é descontado do total. O restante é depois da sessão, no Pix (3% de desconto), no cartão em até 12x ou em dinheiro.`, `You pay a ${money(SIGNAL)} Pix deposit to hold the time, deducted from the total. The rest is after the session: Pix (3% off), card up to 12 installments or cash.`, `Pagas ${money(SIGNAL)} de señal por Pix para guardar el horario, descontados del total. El resto es después de la sesión: Pix (3% de descuento), tarjeta hasta 12 cuotas o efectivo.`) }

  if (ask(/(desconto|cupom|promo|promocao|oferta|coupon|discount|descuento)/))
    return { reply: L(lang, `Primeira sessão: ${money(FIRST)} de desconto automático. Cupons: RELAXAR13 (13%) e SESSAO2 (8%). Pix no restante: 3%. Plano 2x no mês: 10% nas duas sessões. Pacote de 5 sessões: você paga 4. Planos e pacotes não acumulam com cupom. O aparo sozinho não tem desconto.`, `First session: ${money(FIRST)} off automatically. Coupons: RELAXAR13 (13%) and SESSAO2 (8%). Pix for the rest: 3%. 2x a month plan: 10% on both sessions. 5-session pack: you pay for 4. Plans and packs do not stack with coupons. The trim alone has no discount.`, `Primera sesión: ${money(FIRST)} de descuento automático. Cupones: RELAXAR13 (13%) y SESSAO2 (8%). Pix en el resto: 3%. Plan 2x al mes: 10% en las dos sesiones. Paquete de 5 sesiones: pagas 4. Planes y paquetes no se acumulan con cupón. El recorte solo no tiene descuento.`) }

  if (ask(/(plano|pacote|quinzenal|mensal|package|\bplan\b|paquete)/))
    return { reply: L(lang, 'Plano 2x no mês: duas sessões para usar em até 30 dias, com 10% de desconto. Pacote de 5 sessões: você paga 4 e usa em até 60 dias. Você marca a primeira data no site e combina as próximas direto comigo.', '2x a month plan: two sessions within 30 days, 10% off. 5-session pack: you pay for 4 and use them within 60 days. You book the first date on the site and arrange the rest with me.', 'Plan 2x al mes: dos sesiones en hasta 30 días, con 10% de descuento. Paquete de 5 sesiones: pagas 4 y las usas en hasta 60 días. Reservas la primera fecha en el sitio y coordinas el resto conmigo.') }

  if (ask(/(banho|higiene|limpo|shower|ducha)/))
    return { reply: L(lang, 'Peço que você venha já de banho tomado, para aproveitar o tempo inteiro na maca.', 'I ask that you arrive freshly showered, so you can enjoy the full time on the table.', 'Te pido que vengas ya duchado, para aprovechar todo el tiempo en la camilla.') }

  if (ask(/(levar|trazer|preciso de algo|bring)/))
    return { reply: L(lang, 'Só venha de banho tomado.', 'Just arrive freshly showered.', 'Solo ven ya duchado.') }

  if (ask(/(\bidade\b|menor de|18 anos|age limit|\bedad\b)/))
    return { reply: L(lang, 'O atendimento é só para maiores de 18 anos.', 'The service is only for people 18 or older.', 'La atención es solo para mayores de 18 años.') }

  // Descrição de uma sessão
  if (lastSession && ask(/(o que|como (e|funciona)|explica|detalh|fala|conta|incluso|inclui|what is|how does|que es|como funciona|tem )/)) {
    const s = byPkg(lastSession)
    if (lang === 'pt') return { reply: `${s.name} (${s.durationLabel} min, ${money(s.price)}): ${s.summary} ${s.steps.join('. ')}.${s.note ? ' ' + s.note : ''}` }
    return { reply: L(lang, '', `${s.name}: ${money(s.price)}, ${s.durationLabel} minutes. The full description is in the session card on the page.`, `${s.name}: ${money(s.price)}, ${s.durationLabel} minutos. La descripción completa está en la tarjeta de la sesión en la página.`) }
  }

  // Recomendação: palavras-chave do que a pessoa precisa
  if (ask(/(qual (sessao|massagem)|recomend|indica|combina|which session|que sesion|nao sei|duvida entre)/) || /\b(dor|dores|travad\w*|costas|ombros?|pescoco|treino|stress|estresse|cansad\w*|relaxar|desligar|ansios\w*|barba|intens\w*)\b/.test(last)) {
    const pid = /(barba|naturista|nus)/.test(last) ? 'fusion' : /(intens|completa|mais contato|corpo a corpo)/.test(last) ? 'completa' : /(relaxar|desligar|estress|ansios|cabeca)/.test(last) ? 'sensitiva' : /\b(dor|dores|travad\w*|costas|ombros?|pescoco|treino|cansad\w*)\b/.test(last) ? 'classica' : null
    if (pid) { const s = byPkg(pid); return { reply: L(lang, `Pelo que você contou, eu indicaria a ${s.name} (${s.durationLabel} min, ${money(s.price)}). ${s.summary} Quer ver horários livres?`, `From what you told me, I would suggest ${s.name} (${s.durationLabel} min, ${money(s.price)}). Want to see free times?`, `Por lo que me cuentas, te sugeriría ${s.name} (${s.durationLabel} min, ${money(s.price)}). ¿Quieres ver horarios libres?`) } }
    return { reply: L(lang, 'Me conta o que você mais precisa hoje: soltar costas e ombros travados (Clássica), desligar a cabeça e relaxar o corpo todo (Sensitiva), algo mais intenso e com mais contato (Sensações ou Corpo a Corpo) ou só aparar os pelos?', 'Tell me what you need most today: loosen a stiff back and shoulders (Classic), switch off and relax the whole body (Sensitive), something more intense with more contact (Beard Sensations or Body to Body) or just a trim?', 'Cuéntame qué necesitas más hoy: soltar espalda y hombros trabados (Clásica), desconectar y relajar todo el cuerpo (Sensitiva), algo más intenso y con más contacto (Sensaciones o Cuerpo a Cuerpo) o solo recortar el vello?') }
  }

  if (lastSession) { const s = byPkg(lastSession); return { reply: L(lang, `${s.name}: ${s.durationLabel} min, ${money(s.price)}. ${s.summary} Quer ver os horários livres ou saber mais sobre ela?`, `${s.name}: ${s.durationLabel} min, ${money(s.price)}. Want to see free times?`, `${s.name}: ${s.durationLabel} min, ${money(s.price)}. ¿Quieres ver horarios libres?`) } }

  if (/^(oi|ola|opa|bom dia|boa tarde|boa noite|e ai|hey|hi|hello|hola|buenas)\b/.test(last))
    return { reply: L(lang, 'Oi! Posso falar de sessões, preços, horários livres, como funciona a reserva e o que mais você quiser saber. O que você procura?', 'Hi! I can talk about sessions, prices, free times, how booking works and more. What are you looking for?', '¡Hola! Puedo hablar de sesiones, precios, horarios libres, cómo funciona la reserva y más. ¿Qué buscas?') }

  return { reply: L(lang, 'Essa eu não sei responder por aqui. Me chama direto no WhatsApp que eu respondo rápido.', 'I cannot answer that here. Message me directly on WhatsApp and I will reply fast.', 'Eso no sé responderlo por aquí. Escríbeme directo por WhatsApp y respondo rápido.'), handoff: true }
}
