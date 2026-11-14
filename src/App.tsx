import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';

// --- CONFIGURAÇÕES ---
const SITE_NAME = 'Relaxar hoje com Thalyson';
const LEGAL = { RAZAO: 'Thalyson Rodrigo dos Santos', CNPJ: '62.922.530/0001-44', ENDERECO: 'Avenida 9 de Julho, Bela Vista, São Paulo', EMAIL: 'relaxecomthalyson@gmail.com', ATUALIZADO: '05/11/2026' };

const C = {
  PHONE: '5517991360413', PIX_KEY: '62922530000144',
  INSTAGRAM: 'https://www.instagram.com/relaxarhojesp', REVIEW_LINK: 'https://g.page/r/Cd1aEwEt0R1QEAE/review',
  AVATAR: '/thalyson.jpg', COUPONS: { SESSAO2: 0.08, RELAXAR13: 0.13 } as Record<string, number>,
  SIGNAL: 40, FIRST: 15, REQ_FEE: 140, PEAK_FEE: 18, PIX_DISC: 0.03, TIME_ADD: 75, APARO_FULL: 130,
  PACK_PAY: 4, PACK_TOTAL: 5, PACK_DAYS: 60, OPEN: 9 * 60, LAST_END: 23 * 60 + 30, STEP: 60, LEAD_S: 30, LEAD_H: 60, DAYS: 14,
};
const PEAK_HOURS = ['12:00', '13:00', '17:00', '18:00', '19:00'];
type Lang = 'pt' | 'en' | 'es';

const T: Record<Lang, Record<string, string>> = {
  pt: {
    badge: 'Bela Vista, São Paulo', h1: 'O refúgio que o seu corpo pede.', sub: 'Massagem masculina premium. Escolha o que precisa hoje, reserve em segundos e deixe o resto comigo.',
    cta: 'Agendar momento', s1: 'Escolha o seu ritual', s2: 'Qual a frequência?', s3: 'Quando e onde', s4: 'Confirme os detalhes',
    min: 'min', cont: 'Avançar', back: 'Voltar', total: 'Total', signal: 'Sinal (Pix)', rest: 'Restante no local',
    studio: 'No meu espaço', home: 'No seu espaço', date: 'Selecione o dia', time: 'Horários disponíveis',
    name: 'Como posso te chamar?', namePh: 'Seu primeiro nome', pay: 'Como prefere pagar o restante?',
    pix: 'Pix (-3%)', card: 'Cartão', cash: 'Dinheiro', send: 'Enviar pelo WhatsApp', doneH: 'Solicitação preparada!',
    doneP: 'Clique abaixo para enviar no WhatsApp e confirmar o horário com o sinal.', resend: 'Abrir WhatsApp', restart: 'Novo agendamento',
    listen: 'Ouvir sobre este ritual', pause: 'Pausar áudio', resume: 'Continuar', stopA: 'Parar',
    single: 'Sessão Única', combo: 'Combo (Com depilação)', pack: 'Pacote (Leve 5, pague 4)',
    lTime: 'Adicionar +30 minutos', lCoupon: 'Cupom de desconto', apply: 'Aplicar',
    ageA: 'Confirmo que tenho 18+ anos e aceito os termos.', needAge: 'Confirme a idade', needName: 'Preencha seu nome',
    needDate: 'Escolha uma data e horário', needPay: 'Escolha o pagamento', recommended: 'O mais escolhido', economy: 'Economia', demo: 'Reserva demonstrativa via WhatsApp'
  },
  en: {
    badge: 'Bela Vista, São Paulo', h1: 'The refuge your body asks for.', sub: 'Premium men’s massage. Choose what you need today, book in seconds, and leave the rest to me.',
    cta: 'Book moment', s1: 'Choose your ritual', s2: 'Frequency', s3: 'When and where', s4: 'Confirm details',
    min: 'min', cont: 'Next', back: 'Back', total: 'Total', signal: 'Deposit (Pix)', rest: 'Rest on site',
    studio: 'At my place', home: 'At your place', date: 'Select date', time: 'Available times',
    name: 'What should I call you?', namePh: 'First name', pay: 'How will you pay the rest?',
    pix: 'Pix (-3%)', card: 'Card', cash: 'Cash', send: 'Send on WhatsApp', doneH: 'Request ready!',
    doneP: 'Click below to send on WhatsApp and confirm.', resend: 'Open WhatsApp', restart: 'New booking',
    listen: 'Listen to this ritual', pause: 'Pause', resume: 'Resume', stopA: 'Stop',
    single: 'Single', combo: 'Combo', pack: 'Pack (Buy 5, pay 4)',
    lTime: 'Add +30 minutes', lCoupon: 'Coupon', apply: 'Apply',
    ageA: 'I am 18+ and accept terms.', needAge: 'Confirm age', needName: 'Enter your name',
    needDate: 'Choose date and time', needPay: 'Choose payment', recommended: 'Most chosen', economy: 'Save', demo: 'Demo booking via WhatsApp'
  },
  es: {
    badge: 'Bela Vista, São Paulo', h1: 'El refugio que tu cuerpo pide.', sub: 'Masaje masculino premium. Elige lo que necesitas hoy, reserva en segundos.',
    cta: 'Reservar momento', s1: 'Elige tu ritual', s2: 'Frecuencia', s3: 'Cuándo y dónde', s4: 'Confirmar detalles',
    min: 'min', cont: 'Siguiente', back: 'Volver', total: 'Total', signal: 'Señal (Pix)', rest: 'Resto en sitio',
    studio: 'En mi espacio', home: 'En tu espacio', date: 'Elige el día', time: 'Horarios disponibles',
    name: '¿Tu nombre?', namePh: 'Nombre', pay: '¿Cómo pagarás el resto?',
    pix: 'Pix (-3%)', card: 'Tarjeta', cash: 'Efectivo', send: 'Enviar por WhatsApp', doneH: '¡Listo!',
    doneP: 'Haz clic para enviar por WhatsApp y confirmar.', resend: 'Abrir WhatsApp', restart: 'Nueva reserva',
    listen: 'Escuchar ritual', pause: 'Pausar', resume: 'Continuar', stopA: 'Detener',
    single: 'Sesión Única', combo: 'Combo', pack: 'Paquete (5x4)',
    lTime: 'Añadir +30 min', lCoupon: 'Cupón', apply: 'Aplicar',
    ageA: 'Tengo 18+ años.', needAge: 'Confirma edad', needName: 'Ingresa tu nombre',
    needDate: 'Elige fecha y hora', needPay: 'Elige pago', recommended: 'Más elegido', economy: 'Ahorra', demo: 'Reserva demo vía WhatsApp'
  }
};

const PACKAGES = [
  { id: 'classica', price: 180, min: 40, combo: 90, L: {
    pt: { title: 'Massagem Clássica', tags: ['Descompressão', 'Pistola', 'Foco Muscular'], desc: 'O alívio direto para o peso do dia a dia. Trabalho manual intenso e uso de pistola para soltar a musculatura.', flow: ['Conversa para identificar a tensão.', 'Trabalho manual profundo.', 'Alívio com pistola.', 'Relaxamento final.'] },
    en: { title: 'Classic Massage', tags: ['Decompression', 'Gun', 'Muscle'], desc: 'Direct relief for daily weight.', flow: ['Chat.', 'Deep manual work.', 'Gun relief.', 'Final relax.'] },
    es: { title: 'Masaje Clásico', tags: ['Descompresión', 'Pistola', 'Músculo'], desc: 'Alivio directo.', flow: ['Charla.', 'Trabajo manual.', 'Pistola.', 'Relajación.'] } } },
  { id: 'sensitiva', price: 220, min: 60, combo: 85, L: {
    pt: { title: 'Sensitiva & Prazer', tags: ['Despertar', 'Toque Sutil', 'Tântrica'], desc: 'A transição. Começa quebrando a tensão e evolui para toques lentos e sutis que despertam o corpo inteiro.', flow: ['Quebra de tensão.', 'Toques lentos.', 'Foco sensorial.', 'Finalização.'] },
    en: { title: 'Sensitive & Pleasure', tags: ['Awakening', 'Subtle', 'Tantric'], desc: 'The transition to subtle touches.', flow: ['Break tension.', 'Slow touches.', 'Sensory focus.', 'Finish.'] },
    es: { title: 'Sensitiva & Placer', tags: ['Despertar', 'Sutil', 'Tántrico'], desc: 'La transición.', flow: ['Romper tensión.', 'Toques lentos.', 'Foco sensorial.', 'Final.'] } } },
  { id: 'fusion', price: 290, min: 60, combo: 75, L: {
    pt: { title: 'Sensações com a Barba', tags: ['Contraste', 'Naturista', 'Intenso'], desc: 'O contraste térmico e tátil. A base relaxante se mistura ao toque áspero da barba deslizando pela pele.', flow: ['Sessão naturista.', 'Relaxamento.', 'Estímulos com a barba.', 'Finalização.'] },
    en: { title: 'Beard Sensations', tags: ['Contrast', 'Naturist', 'Intense'], desc: 'Thermal and tactile contrast.', flow: ['Naturist.', 'Relaxation.', 'Beard stimuli.', 'Finish.'] },
    es: { title: 'Sensaciones Barba', tags: ['Contraste', 'Naturista', 'Intenso'], desc: 'Contraste táctil.', flow: ['Naturista.', 'Relajación.', 'Estímulos.', 'Final.'] } } },
  { id: 'completa', price: 390, min: 60, combo: 60, L: {
    pt: { title: 'Corpo a Corpo', tags: ['Sem Barreiras', 'Gel', 'Liberdade'], desc: 'A entrega absoluta. Uso meu corpo sobre o seu com gel deslizante e você tem liberdade para retribuir.', flow: ['Alinhamento.', 'Soltura.', 'Gel corpo a corpo.', 'Interação.', 'Finalização.'] },
    en: { title: 'Body to Body', tags: ['No barriers', 'Gel', 'Freedom'], desc: 'Absolute surrender.', flow: ['Alignment.', 'Release.', 'Gel.', 'Interaction.', 'Finish.'] },
    es: { title: 'Cuerpo a Cuerpo', tags: ['Sin barreras', 'Gel', 'Libertad'], desc: 'Entrega absoluta.', flow: ['Alineación.', 'Soltura.', 'Gel.', 'Interacción.', 'Final.'] } } },
  { id: 'aparo_solo', price: 130, min: 40, combo: 0, L: {
    pt: { title: 'Apenas Depilação', tags: ['Estética', 'Prático'], desc: 'Serviço isolado para higiene e estética visual. Aparo rápido e limpo em até 3 áreas.', flow: ['Alinhamento.', 'Aparo.', 'Acabamento.'] },
    en: { title: 'Trimming Only', tags: ['Grooming', 'Practical'], desc: 'Quick trim up to 3 areas.', flow: ['Alignment.', 'Trim.', 'Finish.'] },
    es: { title: 'Solo Depilación', tags: ['Estética', 'Práctico'], desc: 'Recorte rápido.', flow: ['Alineación.', 'Recorte.', 'Acabado.'] } } },
];

const money = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;
const store = { get: (k: string) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k: string, v: string) => { try { localStorage.setItem(k, v); } catch {} }, del: (k: string) => { try { localStorage.removeItem(k); } catch {} } };
const maskCEP = (v: string) => v.replace(/\D/g, '').replace(/^(\d{5})(\d)/, '$1-$2').slice(0, 9);
const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const fromMin = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
const sameDay = (a: Date | null, b: Date) => !!a && dateKey(a) === dateKey(b);
const waLink = (text: string) => `https://api.whatsapp.com/send?phone=${C.PHONE}&text=${encodeURIComponent(text)}`;
const clean = (t: string) => t.replace(/[*_~`\r\n]+/g, ' ').trim();

function buildSlots(date: Date, dur: number, isHome: boolean, now: Date) {
  const lead = isHome ? C.LEAD_H : C.LEAD_S;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const today = sameDay(date, now);
  const out = [];
  for (let m = C.OPEN; m + dur <= C.LAST_END; m += C.STEP) out.push({ t: fromMin(m), ok: !(today && m < nowMin + lead) });
  return out;
}

// --- ÍCONES SVG ---
const Icon = ({ name, size = 20, className = '' }: { name: string; size?: number, className?: string }) => {
  const paths: Record<string, string> = {
    map: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
    play: 'M5 3l14 9-14 9V3z', pause: 'M6 4h4v16H6z M14 4h4v16h-4z', stop: 'M6 6h12v12H6z',
    check: 'M20 6L9 17l-5-5', close: 'M18 6L6 18 M6 6l12 12',
    cal: 'M3 6h18v15H3z M3 10h18 M8 3v4 M16 3v4', copy: 'M9 9h11v11H9z M5 15H4V4h11v1',
    chat: 'M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.2A8 8 0 1 1 21 12z',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z', arrow: 'M5 12h14 M12 5l7 7-7 7'
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}><path d={paths[name] || ''} /></svg>;
};

// --- CSS (Nova Identidade: Musgo, Terracota e Areia) ---
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

:root {
  --bg: #F4F1EB; --surf: #FFFFFF; --surf2: #EBE5DA; --ink: #1C2321; --mute: #6A736F;
  --line: rgba(28, 35, 33, 0.08); --acc: #C26A4A; --acc-hover: #A95B3E; --onacc: #FFFFFF;
  --glass: rgba(244, 241, 235, 0.85); --gold: #C29B5A; --shadow: 0 8px 30px rgba(0,0,0,0.04);
}
[data-theme="dark"] {
  --bg: #0E1311; --surf: #161D1A; --surf2: #1F2824; --ink: #E8EAE9; --mute: #939D98;
  --line: rgba(232, 234, 233, 0.1); --acc: #D47A59; --acc-hover: #E38B6A; --onacc: #161D1A;
  --glass: rgba(14, 19, 17, 0.85); --gold: #D4B88C; --shadow: 0 8px 30px rgba(0,0,0,0.2);
}

body { margin: 0; padding: 0; background: var(--bg); color: var(--ink); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
* { box-sizing: border-box; }
.serif { font-family: 'DM Serif Display', serif; font-weight: 400; }
.app { min-height: 100vh; display: flex; flex-direction: column; overflow-x: hidden; }
.container { width: 100%; max-width: 860px; margin: 0 auto; padding: 0 20px; }

/* Glass Header */
.header { position: sticky; top: 0; z-index: 50; background: var(--glass); backdrop-filter: blur(16px); border-bottom: 1px solid var(--line); padding: 16px 0; }
.header-inner { display: flex; justify-content: space-between; align-items: center; }
.logo { display: flex; align-items: center; gap: 12px; font-size: 20px; font-weight: 500; text-decoration: none; color: var(--ink); }
.logo img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--surf2); }
.controls { display: flex; gap: 8px; align-items: center; }
.btn-icon { background: var(--surf2); border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--ink); cursor: pointer; transition: 0.2s; }
.btn-icon:hover { background: var(--line); }
select.lang { background: var(--surf2); border: none; padding: 0 12px; height: 40px; border-radius: 20px; color: var(--ink); font-family: inherit; font-weight: 600; font-size: 13px; cursor: pointer; outline: none; }

/* Hero Editorial */
.hero { padding: 80px 0 60px; text-align: center; display: flex; flex-direction: column; align-items: center; }
.badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--acc); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
.hero h1 { font-size: clamp(40px, 8vw, 72px); line-height: 1.05; margin: 0 0 24px; max-width: 700px; }
.hero p { font-size: 18px; color: var(--mute); max-width: 500px; margin: 0 0 40px; }

/* Botões */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 56px; padding: 0 32px; border-radius: 99px; font-weight: 600; font-size: 16px; border: none; cursor: pointer; transition: all 0.2s; text-decoration: none; }
.btn-primary { background: var(--acc); color: var(--onacc); }
.btn-primary:hover { background: var(--acc-hover); transform: translateY(-2px); }
.btn-primary:disabled { background: var(--surf2); color: var(--mute); cursor: not-allowed; transform: none; }
.btn-outline { background: transparent; border: 1.5px solid var(--line); color: var(--ink); }
.btn-outline:hover { background: var(--surf2); }
.btn-text { background: none; border: none; color: var(--ink); font-weight: 600; font-size: 14px; text-decoration: underline; text-underline-offset: 4px; cursor: pointer; padding: 0; }

/* Inputs */
.input-group { margin-bottom: 24px; text-align: left; }
.input-group label { display: block; font-size: 14px; font-weight: 600; color: var(--mute); margin-bottom: 10px; }
.input { width: 100%; height: 60px; padding: 0 20px; border-radius: 20px; border: 1.5px solid var(--line); background: var(--surf); color: var(--ink); font-size: 16px; font-family: inherit; transition: 0.2s; }
.input:focus { outline: none; border-color: var(--acc); box-shadow: 0 0 0 4px rgba(194, 106, 74, 0.1); }

/* Cards de Serviço */
.services-grid { display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 32px; }
@media (min-width: 700px) { .services-grid { grid-template-columns: 1fr 1fr; } }

.service-card { background: var(--surf); border: 1.5px solid var(--line); border-radius: 28px; padding: 28px; cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; box-shadow: var(--shadow); }
.service-card:hover { transform: translateY(-4px); border-color: var(--mute); }
.service-card.selected { border-color: var(--acc); box-shadow: 0 12px 40px rgba(194, 106, 74, 0.15); background: var(--surf); }
.service-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
.service-title { font-size: 26px; line-height: 1.1; margin: 0; }
.service-price { font-size: 24px; color: var(--acc); font-weight: 500; }
.service-meta { font-size: 14px; color: var(--mute); font-weight: 500; display: flex; gap: 8px; align-items: center; }
.badge-rec { display: inline-block; background: rgba(194, 106, 74, 0.1); color: var(--acc); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 99px; margin-bottom: 16px; }

/* Expansão do Card */
.service-expanded { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--line); animation: fadeIn 0.4s ease; }
.service-expanded p { color: var(--mute); font-size: 15px; margin-bottom: 20px; line-height: 1.6; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.tag { background: var(--surf2); font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 99px; color: var(--ink); }

/* Player de Áudio Customizado */
.audio-player { display: flex; align-items: center; gap: 12px; background: var(--surf2); padding: 8px 8px 8px 20px; border-radius: 99px; margin-bottom: 20px; }
.audio-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--acc); color: #fff; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: 0.2s; }
.audio-btn:hover { background: var(--acc-hover); }
.audio-text { font-size: 13px; font-weight: 600; flex: 1; }

/* Calendário e Horários */
.date-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 16px; scrollbar-width: none; margin-bottom: 32px; }
.date-scroll::-webkit-scrollbar { display: none; }
.date-card { min-width: 76px; padding: 16px 0; border-radius: 20px; border: 1.5px solid var(--line); background: var(--surf); display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: 0.2s; }
.date-card.selected { background: var(--acc); border-color: var(--acc); color: var(--onacc); }
.date-card.selected .date-day, .date-card.selected .date-week { color: var(--onacc); opacity: 1; }
.date-week { font-size: 12px; font-weight: 600; text-transform: uppercase; color: var(--mute); margin-bottom: 4px; }
.date-day { font-family: 'DM Serif Display', serif; font-size: 28px; line-height: 1; }

.time-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 12px; margin-bottom: 32px; }
.time-card { padding: 14px 0; border-radius: 16px; border: 1.5px solid var(--line); background: var(--surf); text-align: center; font-weight: 600; cursor: pointer; transition: 0.2s; }
.time-card.selected { background: var(--acc); border-color: var(--acc); color: var(--onacc); }
.time-card.disabled { opacity: 0.3; text-decoration: line-through; cursor: not-allowed; }

/* Opções (Combo/Pacote) */
.option-card { display: flex; justify-content: space-between; align-items: center; padding: 20px; border: 1.5px solid var(--line); border-radius: 20px; margin-bottom: 12px; cursor: pointer; transition: 0.2s; background: var(--surf); }
.option-card.selected { border-color: var(--acc); background: rgba(194, 106, 74, 0.05); }

/* Barra Flutuante */
.floating-bar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surf); border-top: 1px solid var(--line); padding: 16px 20px calc(16px + env(safe-area-inset-bottom)); z-index: 100; box-shadow: 0 -10px 30px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; }
.floating-bar-info p { margin: 0; font-size: 12px; color: var(--mute); font-weight: 600; }
.floating-bar-info h4 { margin: 0; font-size: 24px; font-family: 'DM Serif Display', serif; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.anim { animation: fadeIn 0.5s ease both; }
`;

// --- NARRADOR ---
function useNarrator(lang: Lang) {
  const [state, setState] = useState<'idle'|'playing'|'paused'>('idle');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hasMale, setHasMale] = useState(true);
  const chunks = useRef<string[]>([]); const idx = useRef(0); const token = useRef(0);

  const step = (tk: number) => {
    if (tk !== token.current) return;
    if (idx.current >= chunks.current.length) { setState('idle'); setActiveId(null); return; }
    const u = new SpeechSynthesisUtterance(chunks.current[idx.current]);
    u.lang = lang === 'pt' ? 'pt-BR' : lang === 'en' ? 'en-US' : 'es-ES';
    u.rate = 0.9; u.pitch = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const male = voices.find(v => v.lang.startsWith(lang) && /(felipe|daniel|antonio|ricardo|homem|male|masc)/i.test(v.name));
    if (male) { u.voice = male; setHasMale(true); } else setHasMale(false);
    u.onend = () => { if (tk !== token.current) return; idx.current++; step(tk); };
    window.speechSynthesis.speak(u);
  };

  const play = (id: string, text: string) => {
    const tk = ++token.current; window.speechSynthesis.cancel();
    chunks.current = text.match(/[^.!?]+[.!?]*/g) || [text]; idx.current = 0;
    setActiveId(id); setState('playing'); setTimeout(() => step(tk), 100);
  };
  const toggle = (id: string, text: string) => {
    if (activeId === id && state === 'playing') { token.current++; window.speechSynthesis.cancel(); setState('paused'); }
    else if (activeId === id && state === 'paused') { const tk = ++token.current; setState('playing'); setTimeout(() => step(tk), 100); }
    else play(id, text);
  };
  const stop = () => { token.current++; window.speechSynthesis.cancel(); setState('idle'); setActiveId(null); };
  return { state, activeId, hasMale, toggle, stop };
}

// --- APP ---
export default function App() {
  const [lang, setLang] = useState<Lang>('pt');
  const [theme, setTheme] = useState<'light'|'dark'>(() => (store.get('thaly_theme') as 'light'|'dark') || 'dark');
  const [intro, setIntro] = useState(() => store.get('thaly_onboard') !== 'yes');
  const [ageOk, setAgeOk] = useState(false);
  const [step, setStep] = useState<1|2|3|4>(1);
  const [done, setDone] = useState(false);
  
  const [pkgId, setPkgId] = useState('');
  const [offer, setOffer] = useState<'single'|'combo'|'pack'>('single');
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [locType, setLocType] = useState<'studio'|'home'>('studio');
  const [payment, setPayment] = useState('');
  const [addTime, setAddTime] = useState(false);
  const [cep, setCep] = useState(''); const [street, setStreet] = useState(''); const [number, setNumber] = useState(''); const [bairro, setBairro] = useState('');

  const [now] = useState(new Date());
  const narr = useNarrator(lang);
  const t = (k: string) => T[lang][k] || T.pt[k] || k;

  useEffect(() => { document.documentElement.dataset.theme = theme; store.set('thaly_theme', theme); }, [theme]);

  const pkg = PACKAGES.find(p => p.id === pkgId) || PACKAGES[0];
  const isHome = locType === 'home';
  
  const invoice = useMemo(() => {
    let dur = pkg.min + (addTime ? 30 : 0);
    let base = (offer === 'pack' ? pkg.price * 4 : pkg.price);
    if (offer === 'combo') base += pkg.combo;
    if (addTime) base += C.TIME_ADD;
    const disc = store.get('thaly_returning') !== 'yes' ? C.FIRST : 0;
    const pix = payment === 'pix' ? Math.ceil((base - disc) * C.PIX_DISC) : 0;
    const peak = isHome && PEAK_HOURS.includes(time) ? C.PEAK_FEE : 0;
    const total = base - disc - pix + peak;
    return { dur, total, sinal: Math.min(C.SIGNAL, total), rest: total - Math.min(C.SIGNAL, total) };
  }, [pkg, offer, addTime, isHome, time, payment]);

  const days = useMemo(() => {
    const arr = []; const d = new Date(); d.setHours(0,0,0,0);
    for(let i=0; i<C.DAYS; i++) { const nd = new Date(d); nd.setDate(nd.getDate()+i); arr.push({ d: nd, i }); }
    return arr;
  }, []);
  const slots = useMemo(() => date ? buildSlots(date, invoice.dur, isHome, now) : [], [date, invoice.dur, isHome, now]);

  const handleCep = async (v: string) => {
    const m = maskCEP(v); setCep(m);
    if (m.length === 9) {
      const res = await fetch(`https://viacep.com.br/ws/${m.replace('-','')}/json/`);
      const j = await res.json();
      if (!j.erro) { setStreet(j.logradouro || ''); setBairro(j.bairro || ''); }
    }
  };

  const finish = () => {
    if (!payment) return alert(t('needPay'));
    if (!ageOk) return alert(t('needAge'));
    let msg = `Oi Thalyson! Quero confirmar:\n\n*NOME:* ${clean(name)}\n*DATA:* ${date?.toLocaleDateString()} às ${time}\n*LOCAL:* ${isHome ? `${street}, ${number}` : 'No espaço'}\n*SESSÃO:* ${pkg.L.pt.title} (${invoice.dur}min)\n\n*Total:* ${money(invoice.total)}\n*Sinal Pix:* ${money(invoice.sinal)}\n*Restante:* ${money(invoice.rest)}\n\n✅ 18+ anos.`;
    store.set('thaly_returning', 'yes');
    window.location.href = waLink(msg); // iOS fix
    setDone(true);
  };

  const gCal = () => {
    const st = `${dateKey(date!).replace(/-/g,'')}T${time.replace(':','')}00`;
    const en = `${dateKey(date!).replace(/-/g,'')}T${fromMin(toMin(time)+invoice.dur).replace(':','')}00`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Massagem&dates=${st}/${en}&ctz=America/Sao_Paulo`;
  };

  if (intro) {
    return (
      <div className="app" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <img src={C.AVATAR} alt="T" style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: 24, border: '4px solid var(--surf)' }} />
        <h1 className="serif" style={{ fontSize: 44, marginBottom: 16 }}>Relaxar hoje<br/>com Thalyson</h1>
        <p style={{ color: 'var(--mute)', marginBottom: 32, maxWidth: 300 }}>Massagem masculina premium. Reserve seu momento com privacidade.</p>
        <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, cursor: 'pointer', fontSize: 14 }}>
          <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--acc)' }} />
          Tenho 18+ anos.
        </label>
        <button className="btn btn-primary" disabled={!ageOk} onClick={() => { store.set('thaly_onboard', 'yes'); setIntro(false); }}>
          Entrar e Agendar
        </button>
      </div>
    );
  }

  return (
    <div className="app" style={{ paddingBottom: 100 }}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      
      <header className="header">
        <div className="container header-inner">
          <a href="#" className="logo serif"><img src={C.AVATAR} alt="T" /> Relaxar hoje</a>
          <div className="controls">
            <select className="lang" value={lang} onChange={e => setLang(e.target.value as Lang)}>
              <option value="pt">PT</option><option value="en">EN</option><option value="es">ES</option>
            </select>
            <button className="btn-icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className="container anim">
        <section className="hero">
          <div className="badge"><Icon name="map" size={14} /> {t('badge')}</div>
          <h1 className="serif">{t('h1')}</h1>
          <p>{t('sub')}</p>
        </section>

        {/* FLUXO DE AGENDAMENTO */}
        {done ? (
          <div className="card anim" style={{ textAlign: 'center', background: 'var(--surf)', padding: 40, borderRadius: 32, border: '1px solid var(--line)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(194, 106, 74, 0.1)', color: 'var(--acc)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}><Icon name="check" size={32} /></div>
            <h2 className="serif" style={{ fontSize: 32, marginBottom: 16 }}>{t('doneH')}</h2>
            <p style={{ color: 'var(--mute)', marginBottom: 32 }}>{t('doneP')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={waLink('Oi!')} className="btn btn-primary">{t('resend')}</a>
              <a href={gCal()} className="btn btn-outline">{t('addCal')}</a>
              <button onClick={() => { setStep(1); setDone(false); setPkgId(''); }} className="btn-text">{t('restart')}</button>
            </div>
          </div>
        ) : (
          <div style={{ paddingBottom: 40 }}>
            
            {/* STEP 1 */}
            {step === 1 && (
              <div>
                <h2 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>{t('s1')}</h2>
                <div className="services-grid">
                  {PACKAGES.map(p => (
                    <div key={p.id} onClick={() => setPkgId(p.id)} className={`service-card ${pkgId === p.id ? 'selected' : ''}`}>
                      <div className="service-header">
                        <h3 className="serif service-title">{p.L[lang].title}</h3>
                        <span className="serif service-price">{money(p.price)}</span>
                      </div>
                      <div className="service-meta">
                        <span>{p.min} {t('min')}</span> • <span>{p.L[lang].tags[0]}</span>
                      </div>
                      
                      {pkgId === p.id && (
                        <div className="service-expanded">
                          <p>{p.L[lang].desc}</p>
                          <div className="tag-list">
                            {p.L[lang].tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
                          </div>
                          
                          {/* ÁUDIO PLAYER PREMIUM */}
                          <div className="audio-player">
                            <button onClick={(e) => { e.stopPropagation(); narr.toggle(p.id, `${p.L[lang].title}. ${p.L[lang].desc}`); }} className="audio-btn">
                              <Icon name={narr.activeId === p.id && narr.state === 'playing' ? 'pause' : 'play'} size={16} />
                            </button>
                            <span className="audio-text">{narr.activeId === p.id && narr.state === 'playing' ? t('pause') : t('listen')}</span>
                            {narr.activeId === p.id && <button onClick={(e) => { e.stopPropagation(); narr.stop(); }} className="btn-icon" style={{ width: 32, height: 32 }}><Icon name="stop" size={12} /></button>}
                          </div>
                          {narr.activeId === p.id && !narr.hasMale && <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--mute)' }}>Usando voz grave nativa.</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {pkgId && pkgId !== 'aparo_solo' && (
                  <div className="anim" style={{ marginBottom: 32 }}>
                    <p style={{ fontWeight: 600, marginBottom: 16 }}>{t('s2')}</p>
                    {[['single', t('single'), pkg.price], ['combo', t('combo'), pkg.price + pkg.combo], ['pack', t('pack'), pkg.price * 4]].map(([id, lbl, pr]) => (
                      <div key={id} onClick={() => setOffer(id as any)} className={`option-card ${offer === id ? 'selected' : ''}`}>
                        <span style={{ fontWeight: 600 }}>{lbl}</span>
                        <span className="serif" style={{ fontSize: 20 }}>{money(pr)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div>
                <h2 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>{t('s3')}</h2>
                
                <p style={{ fontWeight: 600, marginBottom: 16 }}>{t('date')}</p>
                <div className="date-scroll">
                  {days.map(({d, i}) => (
                    <div key={i} onClick={() => { setDate(d); setTime(''); }} className={`date-card ${sameDay(date, d) ? 'selected' : ''}`}>
                      <span className="date-week">{i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : d.toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                      <span className="date-day">{d.getDate()}</span>
                    </div>
                  ))}
                </div>

                {date && (
                  <div className="anim">
                    <p style={{ fontWeight: 600, marginBottom: 16 }}>{t('time')}</p>
                    <div className="time-grid">
                      {slots.map(s => (
                        <div key={s.t} onClick={() => s.ok && setTime(s.t)} className={`time-card ${time === s.t ? 'selected' : ''} ${!s.ok ? 'disabled' : ''}`}>
                          {s.t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 32 }}>
                  <p style={{ fontWeight: 600, marginBottom: 16 }}>{t('studio').replace('No meu', 'Onde')}?</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div onClick={() => setLocType('studio')} className={`option-card ${locType === 'studio' ? 'selected' : ''}`} style={{ justifyContent: 'center' }}>{t('studio')}</div>
                    <div onClick={() => setLocType('home')} className={`option-card ${locType === 'home' ? 'selected' : ''}`} style={{ justifyContent: 'center' }}>{t('home')}</div>
                  </div>
                </div>

                {isHome && (
                  <div className="anim" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
                    <input className="input" placeholder="CEP" value={cep} onChange={e => handleCep(e.target.value)} />
                    <input className="input" placeholder="Rua" value={street} onChange={e => setStreet(e.target.value)} />
                    <div style={{ display: 'flex', gap: 12 }}>
                      <input className="input" placeholder="Nº" value={number} onChange={e => setNumber(e.target.value)} style={{ flex: 1 }} />
                      <input className="input" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} style={{ flex: 2 }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div>
                <h2 className="serif" style={{ fontSize: 32, marginBottom: 24 }}>{t('s4')}</h2>
                
                <div className="input-group">
                  <label>{t('name')}</label>
                  <input className="input" placeholder={t('namePh')} value={name} onChange={e => setName(e.target.value)} />
                </div>

                <div className="input-group">
                  <label>{t('pay')}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {['pix', 'card', 'cash'].map(p => (
                      <div key={p} onClick={() => setPayment(p)} className={`option-card ${payment === p ? 'selected' : ''}`} style={{ justifyContent: 'center', padding: 16 }}>{t(p)}</div>
                    ))}
                  </div>
                </div>

                <div style={{ background: 'var(--surf2)', padding: 24, borderRadius: 24, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, color: 'var(--mute)', fontSize: 15 }}><span>{pkg.L[lang].title}</span><span>{money(invoice.total)}</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 24, paddingTop: 12, borderTop: '1px solid var(--line)' }}><span>{t('total')}</span><span className="serif">{money(invoice.total)}</span></div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <div style={{ flex: 1, background: 'var(--surf)', padding: 12, borderRadius: 16, textAlign: 'center' }}><span style={{ fontSize: 12, color: 'var(--mute)' }}>{t('signal')}</span><br/><strong style={{ color: 'var(--acc)' }}>{money(invoice.sinal)}</strong></div>
                    <div style={{ flex: 1, background: 'var(--surf)', padding: 12, borderRadius: 16, textAlign: 'center' }}><span style={{ fontSize: 12, color: 'var(--mute)' }}>{t('rest')}</span><br/><strong>{money(invoice.rest)}</strong></div>
                  </div>
                </div>

                <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={ageOk} onChange={e => setAgeOk(e.target.checked)} style={{ width: 20, height: 20, accentColor: 'var(--acc)' }} />
                  {t('ageA')}
                </label>
              </div>
            )}
          </div>
        )}
      </main>

      {/* BARRA FLUTUANTE DE AÇÃO */}
      {!done && (
        <div className="floating-bar">
          <div className="floating-bar-info">
            {step > 1 && <button onClick={() => setStep(s => (s - 1) as any)} style={{ background: 'none', border: 'none', color: 'var(--mute)', fontSize: 13, fontWeight: 600, padding: 0, marginBottom: 4, cursor: 'pointer' }}>← {t('back')}</button>}
            <h4>{step === 1 && !pkgId ? 'Selecione' : money(invoice.total)}</h4>
          </div>
          {step < 3 ? (
            <button 
              onClick={() => { 
                if(step === 1 && !pkgId) return alert('Escolha um ritual'); 
                if(step === 2 && (!date || !time)) return alert(t('needDate')); 
                setStep(s => (s + 1) as any); 
                window.scrollTo({top: 0, behavior: 'smooth'}); 
              }} 
              className="btn btn-primary"
            >
              {t('cont')} <Icon name="arrow" size={16} />
            </button>
          ) : (
            <button onClick={finish} disabled={!name || !payment || !ageOk} className="btn btn-primary">
              {t('send')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
