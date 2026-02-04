import React, { useState, useEffect, useMemo, useRef } from 'react';

/**
 * ==================================================================================
 * THALYSON APP OS vFINAL - REFINAMENTO UI/UX + AVALIAÇÕES REALISTAS
 * ==================================================================================
 */

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/thalyson.massagens",
  STORAGE_KEY: '@thaly_app_prod_v71_final_glass',
  PIX_KEY: "62.922.530/0001-14",
  LOCALE_PT: 'pt-BR',
  LOCALE_EN: 'en-US',
  SECRET_TOKEN: 'THALY_SECURE',
  START_HOUR: 9,
  END_HOUR: 20
};

// ==================================================================================
// 1. ÍCONES (SVG PURO)
// ==================================================================================
const Icon = ({ name, size = 24, className = "" }) => {
  const icons = {
    Wind: <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" />, 
    Flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-5.318-1-1 4.41-4.41 6 3 6 6 0 2.21-1.79 4-4 4s-4-1.79-4-4a2 2 0 0 1 4 0Z" />, 
    Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, 
    Home: <><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
    Building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></>,
    BedDouble: <><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" /><path d="M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" /><path d="M12 4v6" /><path d="M2 18h20" /></>,
    Clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
    Switch: <path d="m16 3 4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16"/>,
    Package: <><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></>,
    Layers: <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z M22 17.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65 M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>,
    Crown: <path d="m2 4 3 12h14l3-12-6 7-4-9-4 9-6-7z" />,
    Loader2: <path d="M21 12a9 9 0 1 1-6.219-8.56" />,
    AlertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" /></>,
    QrCode: <><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></>,
    CreditCard: <><rect width="22" height="16" x="1" y="4" rx="2" ry="2" /><line x1="1" x2="23" y1="10" y2="10" /></>,
    Banknote: <><rect width="20" height="12" x="2" y="6" rx="2" /><circle cx="12" cy="12" r="2" /><path d="M6 12h.01M18 12h.01" /></>,
    Check: <polyline points="20 6 9 17 4 12" />,
    X: <path d="M18 6 6 18M6 6l12 12" />,
    ChevronLeft: <path d="m15 18-6-6 6-6" />,
    ChevronRight: <path d="m9 18 6-6-6-6" />,
    ChevronDown: <path d="m6 9 6 6 6-6" />,
    ArrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
    Star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
    Settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></>,
    Share2: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></>,
    Globe: <><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></>,
    Moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
    Sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
    ExternalLink: <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" x2="21" y1="14" y2="3" /></>,
    Trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" /></>,
    LayoutList: <><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /><path d="M14 4h7" /><path d="M14 9h7" /><path d="M14 15h7" /><path d="M14 20h7" /></>,
    Info: <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>,
    Calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></>,
    User: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    MapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
    Smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></>,
    Lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    Tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></>,
    ShieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></>,
    Copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></>,
    Instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></>,
    MessageCircle: <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />,
    Download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></>,
    Ticket: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>,
    Gift: <><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13" /><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" /><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" /></>,
    Quote: <><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></>,
    Sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3z" />,
    Hourglass: <><path d="M5 22h14" /><path d="M5 2h14" /><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" /><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" /></>,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};

// ==================================================================================
// 0. DADOS E TEXTOS (AJUSTADOS)
// ==================================================================================
const getData = (lang) => {
    const isPT = lang === 'pt';
    const currency = isPT ? 'R$' : '$';
    
    // DEFINIÇÃO DE PREÇOS
    const p = {
        relax: isPT ? 125 : 25,
        sens: isPT ? 155 : 30,
        titan: isPT ? 195 : 40,
        packRelax: { v: isPT ? 397 : 80, full: isPT ? 500 : 100, save: isPT ? 103 : 20 },
        packTri: { v: isPT ? 487 : 95, full: isPT ? 585 : 120, save: isPT ? 98 : 25 },
        packPass: { v: isPT ? 780 : 150, full: isPT ? 975 : 200, save: isPT ? 195 : 50 }
    };

    return {
        levels: [
            { level: 1, xpNeeded: 0, reward: 0, title: isPT ? "Visitante" : "Visitor" },
            { level: 2, xpNeeded: 100, reward: 15, title: isPT ? "Membro" : "Member" },
            { level: 3, xpNeeded: 350, reward: 30, title: isPT ? "VIP" : "VIP" },
            { level: 4, xpNeeded: 800, reward: 50, title: isPT ? "Elite" : "Elite" }
        ],
        services: [
            { 
              id: 'relaxante', min: 60, price: p.relax, icon: 'Wind', tag: isPT ? "100% FÍSICO" : "PHYSICAL",
              title: isPT ? "Massagem Clássica" : "Classic Relax",
              desc: isPT ? "Corpo todo (Costas, Mãos e Pés). Pressão Baixa/Média para relaxar." : "Full body (Back, Hands, Feet). Low/Mid pressure to relax.",
              details: isPT ? `RELAXAMENTO TOTAL (SEM DOR):\n• Foco: Costas, pernas, mãos e pés.\n• Pressão: Baixa a média (não machuca, é para relaxar).\n• Objetivo: Tirar o cansaço do dia a dia.\n• Sem toque íntimo nesta modalidade.` : `FULL BODY RELAX:\n• Focus: Back, legs, hands, feet.\n• Pressure: Low to Medium (relaxing).\n• No intimate touch.`
            },
            { 
              id: 'sensitiva', min: 60, price: p.sens, icon: 'Flame', tag: isPT ? "SENSORIAL + LINGAM" : "SENSORY",
              title: isPT ? "Tântrica Sensorial" : "Tantric Sensory",
              desc: isPT ? "Toque sutil, arrepios pelo corpo e finalização (Lingam)." : "Subtle touch, shivers and Lingam finish.",
              details: isPT ? `DESPERTAR DO CORPO:\n• Começa com toques sutis (pontas dos dedos) pelo corpo todo.\n• O objetivo é causar arrepios e sensibilidade.\n• Finaliza com a Massagem Lingam (toque genital focado no prazer).\n• Você recebe e sente.` : `BODY AWAKENING:\n• Subtle touches (fingertips).\n• Goal: Shivers and sensitivity.\n• Ends with Lingam Massage.`
            },
            { 
              id: 'mista', min: 60, price: p.titan, icon: 'Zap', tag: isPT ? "A MAIS COMPLETA" : "FULL FUSION",
              title: isPT ? "Experiência Fusion" : "Fusion Experience",
              desc: isPT ? "O melhor de tudo: Massagem relaxante + Corpo a Corpo + Lingam." : "Best of all: Relaxing + Body-to-Body + Lingam.",
              details: isPT ? `PARA QUEM QUER TUDO:\n• Começamos soltando a musculatura (relaxante).\n• Evoluímos para o Corpo a Corpo (troca de energia) sobre você.\n• Finalização Lingam intensa e demorada.\n• A experiência definitiva.` : `FOR WHO WANTS IT ALL:\n• Relaxing muscle start.\n• Body-to-Body energy.\n• Intense Lingam finish.`
            }
        ],
        extras: [
            { id: 'more_time', price: isPT ? 55 : 15, icon: 'Clock', label: isPT ? "+30 Minutos" : "+30 Minutes", desc: isPT ? "Pra não correr." : "No rush." },
            { id: 'touch', price: isPT ? 55 : 15, icon: 'Switch', label: isPT ? "Troca (Interativo)" : "Interactive", desc: isPT ? "Você pode tocar." : "You touch too." },
            { id: 'aroma', price: isPT ? 5 : 5, icon: 'Wind', label: isPT ? "Aromaterapia" : "Aromatherapy", desc: isPT ? "Óleos essenciais." : "Essential oils." }
        ],
        faq: [
            { q: "Qual a diferença real entre as sessões?", a: "Clássica (125) = Relaxamento muscular corpo todo (costas/pés). Tântrica (155) = Toque leve (pontas dos dedos) + Lingam. Fusion (195) = Mistura tudo e tem corpo a corpo." },
            { q: "O que é a Massagem Lingam?", a: "É uma massagem na região íntima. O foco não é apenas a finalização, mas estimular o prazer, circulação e sensibilidade de toda a área." },
            { q: "Você leva maca?", a: "Não. Levo óleos, cremes, lubrificantes, rolos de madeira e som ambiente. O atendimento é feito na sua cama ou sofá, de forma confortável." },
            { q: "O atendimento é sigiloso?", a: "Totalmente. Chego no local como um visitante comum, sem uniformes ou maletas chamativas." },
            { q: "Preciso ter estacionamento?", a: "Não obrigatório, mas se for em local de difícil acesso (centro/zonas pagas), o custo do estacionamento pode ser cobrado à parte." },
            { q: "Aceita cartão?", a: "Sim. Pix (5% off), Cartão de Crédito/Débito e Dinheiro." }
        ],
        plans: [
            { 
              id: 'pack_relax', type: 'pack', title: isPT ? "Ciclo Anti-Stress" : "Anti-Stress Cycle", 
              price: p.packRelax.v, fullPrice: p.packRelax.full, savings: p.packRelax.save,
              desc: isPT ? "4 Sessões de Massagem Clássica." : "4 Classic Massage Sessions.",
              details: isPT ? "MANUTENÇÃO CONTRA CANSAÇO:\n• 4 sessões focadas no corpo todo (mãos, pés, costas)." : "TIREDNESS MAINTENANCE:\n• 4 sessions focused on full body.", 
              tag: isPT ? "MANUTENÇÃO" : "MAINTENANCE", icon: 'Package' 
            },
            { 
              id: 'pack_mista', type: 'pack', title: isPT ? "Trilogia do Êxtase" : "Ecstasy Trilogy", 
              price: p.packTri.v, fullPrice: p.packTri.full, savings: p.packTri.save,
              desc: isPT ? "3 Sessões da Experiência Fusion." : "3 Fusion Sessions.",
              details: isPT ? "INTENSIDADE GARANTIDA:\n• 3 encontros da massagem mais completa (Fusion)." : "GUARANTEED INTENSITY:\n• 3 meetings of the fullest massage.", 
              tag: isPT ? "MAIS VENDIDO" : "BEST SELLER", icon: 'Zap' 
            },
            { 
              id: 'titan_passport', type: 'pack', title: isPT ? "Passaporte Titan (5x)" : "Titan Passport (5x)", 
              price: p.packPass.v, fullPrice: p.packPass.full, savings: p.packPass.save,
              desc: isPT ? "Compre 4, Leve 5 (Fusion)." : "Buy 4, Get 5 (Fusion).",
              details: isPT ? "A OFERTA IRRECUSÁVEL:\n• Você garante 5 sessões Fusion completas. Paga 4 e ganha 1." : "IRRESISTIBLE OFFER:\n• 5 full Fusion sessions. Pay 4, get 1 free.", 
              tag: isPT ? "1 SESSÃO GRÁTIS" : "1 FREE SESSION", icon: 'Crown' 
            }
        ],
        reviews: [
            { n: "Bruno", loc: "SP - Bela Vista", t: "Thalyson, quero dizer que sua massagem foi muito bem executada. Recomendo muito.", s: 5 },
            { n: "Tiago", loc: "SP - Bela Vista", t: "O Thalyson tem uma energia surreal. A massagem foi perfeita, melhor da minha vida.", s: 5 },
            { n: "Alan", loc: "SP - Bela Vista", t: "Gostei bastante, saí mais leve. Da pra ver que ele manda bem no que faz.", s: 5 },
            { n: "Felipe", loc: "Londrina", t: "Cara, sai da sessão flutuando. A parte do corpo a corpo é bizarra de boa.", s: 5 },
            { n: "Ricardo M.", loc: "Rio Preto", t: "Mão firme, sabe onde apertar. Tava travadão e resolveu.", s: 5 },
            { n: "André L.", loc: "SP - Jardins", t: "Curti muito, mas achei que 1 hora passou voando. Na próxima pego 1h30.", s: 4 },
            { n: "Gustavo", loc: "Santa Fé do Sul", t: "Primeira vez fazendo tântrica, tava meio nervoso mas ele deixou super a vontade.", s: 5 },
            { n: "Breno", loc: "Jales", t: "Moleque gente boa demais. A finalização foi forte, perdi as pernas kkkk", s: 5 },
            { n: "Pedro", loc: "Rio Preto", t: "Gozei horrores. Não esperava que fosse tão intenso assim.", s: 5 },
            { n: "Renato", loc: "SP - Centro", t: "Profissional. Chegou no horário, trouxe tudo. Recomendo a Fusion.", s: 5 },
            { n: "Vitor", loc: "Jales", t: "Gostei, massagem top. Só o ar condicionado do hotel que tava gelado demais.", s: 4 },
            { n: "Eduardo", loc: "Londrina", t: "Dormi na metade da relaxante de tão bom que tava.", s: 5 },
            { n: "Roberto", loc: "SP - Augusta", t: "Pedi com interação e valeu cada centavo. A pele dele é muito macia.", s: 5 },
            { n: "Lucas", loc: "SP - Moema", t: "Sensacional. A técnica do lingam é outro nível, nunca senti isso.", s: 5 },
            { n: "M. (Sigilo)", loc: "SP - Jardins", t: "Sem palavras. Gozada inesquecível.", s: 5 },
            { n: "João V.", loc: "Rio Preto", t: "Muito bom, mas podia ter um som mais alto. De resto, perfeito.", s: 4 },
            { n: "Diego", loc: "SP - Frei Caneca", t: "O cara é bonito e tem a mão pesada na medida certa. Voltarei.", s: 5 },
            { n: "Caio", loc: "Londrina", t: "Fizemos no tapete do hotel e foi uma aventura. Curti demais.", s: 5 },
            { n: "Rafa", loc: "SP - Centro", t: "Tremi todo no final. Energia absurda.", s: 5 },
            { n: "Leandro", loc: "Jales", t: "Pontual e discreto. Do jeito que eu precisava.", s: 5 },
            { n: "Matheus", loc: "SP - Pinheiros", t: "Achei o preço justo pelo serviço. O cara se entrega na massagem.", s: 5 },
            { n: "Fernando", loc: "Rio Preto", t: "Queria que não acabasse nunca. Fiquei triste quando o despertador tocou kkk", s: 4 },
            { n: "Igor", loc: "SP - Paulista", t: "Gostoso demais. O toque sutil dele arrepia até a alma.", s: 5 },
            { n: "Sérgio", loc: "Londrina", t: "Atendimento nota 10. Me senti renovado pra semana.", s: 5 },
            { n: "Paulo", loc: "SP - Barra Funda", t: "O corpo a corpo com óleo é sacanagem de bom. Recomendo.", s: 5 },
            { n: "Daniel", loc: "Jales", t: "Massagem boa, mas demorei pra conseguir agenda com ele.", s: 4 },
            { n: "Guilherme", loc: "Rio Preto", t: "Relaxei tanto que babey no travesseiro. Vergonha kkkk", s: 5 },
            { n: "Alex", loc: "SP - Consolação", t: "Experiência única. O Thalyson é super respeitoso mas sabe provocar.", s: 5 },
            { n: "Júlio", loc: "Londrina", t: "Top demais. Valeu a pena cada real.", s: 5 },
            { n: "Marcos", loc: "SP - Sta Cecília", t: "A mix de relaxante com tântrica é a melhor. Sai leve e vazio.", s: 5 },
            { n: "Erick", loc: "Rio Preto", t: "Muito bom, só achei o óleo um pouco gelado no começo.", s: 4 },
            { n: "Fabio", loc: "SP - Jardins", t: "Mão de anjo. Tirou uma dor nas costas que eu tinha há meses.", s: 5 },
            { n: "Luan", loc: "Jales", t: "Serviço completo. Banho tomado, massagem top e final feliz.", s: 5 },
            { n: "Geraldo", loc: "Londrina", t: "Cara educado e limpo. Gostei.", s: 5 },
            { n: "Willian", loc: "SP - Republica", t: "Achei que ia ser estranho, mas foi a melhor coisa que fiz no mês.", s: 5 }
        ],
        reviews_title: isPT ? "+50 Avaliações de Clientes" : "+50 Client Reviews",
        currency: currency,
        text: {
            welcome: isPT ? "Olá," : "Hello,",
            // Saudação dinâmica será tratada no componente
            subtitle: isPT ? "Ótima tarde para relaxar. Escolha sua experiência:" : "Disconnect your mind, feel your body. Choose your experience:",
            loading: isPT ? "Carregando..." : "Loading...",
            level_label: isPT ? "Nível Fidelidade" : "Loyalty Level",
            missing_xp_msg: (needed, reward) => isPT ? `Faltam ${needed} XP para o próximo nível (+R$${reward} de bônus)` : `${needed} XP needed for next level (+$${reward} bonus)`,
            tab_packs: isPT ? "Pacotes (Desconto)" : "Packages",
            tab_single: isPT ? "Sessão Avulsa" : "Single Session",
            details_label: isPT ? "Detalhes da Sessão" : "Details",
            faq_title: "Perguntas Frequentes",
            select_time_title: "Data e Hora",
            date_sub: "Escolha o melhor momento",
            today: isPT ? "Hoje" : "Today",
            tomorrow: isPT ? "Amanhã" : "Tomorrow",
            empty_date: isPT ? "Selecione uma data acima para ver horários" : "Select a date above to see slots",
            empty_slots: isPT ? "Agenda cheia para este dia." : "No slots available.",
            location_title: isPT ? "Onde será o atendimento?" : "Service Location",
            motel_note: isPT ? "Em motéis, o valor da suíte é pago diretamente ao estabelecimento por você." : "In motels, the suite fee is paid directly to the establishment.",
            input_name: isPT ? "Como devo te chamar?" : "Your Name",
            input_addr: isPT ? "Endereço" : "Address",
            input_num: isPT ? "Número" : "Number",
            input_bairro: isPT ? "Bairro" : "Neighborhood",
            input_city: isPT ? "Cidade" : "City",
            input_comp: isPT ? "Complemento (Apto/Bloco)" : "Unit/Apt",
            input_hotel: isPT ? "Nome do Hotel" : "Hotel Name",
            input_room: isPT ? "Número do Quarto" : "Room Number",
            extras_title: isPT ? "Turbine sua sessão:" : "Extras for your session:",
            total_label: "Valor Total",
            uber_warning: isPT ? "+ Taxa de Deslocamento (Uber)" : "+ Transport Fee (Uber)",
            coupon_section_title: isPT ? "Seus Cupons" : "Your Coupons",
            no_coupons: isPT ? "Você não possui cupons no momento." : "No coupons available.",
            coupon_btn: isPT ? "Usar" : "Apply",
            pay_title: isPT ? "Como prefere pagar?" : "Payment Method",
            pay_pix: isPT ? "Pix (5% de Desconto)" : "Pix (5% OFF)",
            pay_card: isPT ? "Cartão de Crédito" : "Credit Card",
            pay_cash: isPT ? "Dinheiro / Espécie" : "Cash",
            terms_title: isPT ? "Regras da Casa" : "Terms & Conditions",
            terms_link: isPT ? "Ler regras completas" : "Read full terms",
            agree_terms: isPT ? "Li e concordo com as regras." : "I read and agree to terms.",
            terms_body: isPT ? ["1. Higiene: Tome um banho antes da sessão.", "2. Respeito: Não insista em algo que não está no menu.", "3. Pagamento: Pode ser feito antes ou logo após o serviço.", "4. Cancelamento: Avise com 2h de antecedência."] : ["1. Hygiene mandatory.", "2. Respect required.", "3. Payment upfront.", "4. Cancellation 2h notice."],
            terms_btn: isPT ? "Concordo, vamos continuar" : "I Understand & Agree",
            success_title: isPT ? "Pré-Agendamento Feito!" : "Booking Confirmed!",
            success_sub: isPT ? "Agora basta enviar o resumo no WhatsApp para eu confirmar sua hora." : "Send receipt on WhatsApp to finalize.",
            whatsapp_btn: isPT ? "Finalizar no WhatsApp" : "Finalize on WhatsApp",
            back_home: isPT ? "Voltar ao Início" : "Back to Home",
            book_btn: isPT ? "Agendar Sessão" : "Book Now",
            next_btn: isPT ? "Continuar" : "Continue",
            install_app: isPT ? "Instalar App" : "Install App",
            install_desc: isPT ? "Tenha acesso rápido e fácil." : "Quick and easy access.",
            popup_level_title: isPT ? "Nível Subiu!" : "Level Up!",
            popup_level_msg: isPT ? "Parabéns! Você alcançou um novo nível de fidelidade." : "Congrats! You reached a new level.",
            popup_btn_coupon: isPT ? "Resgatar Recompensa" : "Redeem Reward",
            popup_welcome_title: isPT ? "Bem-vindo!" : "Welcome!",
            popup_welcome_msg: isPT ? "Já chega ganhando: tome um desconto na primeira sessão." : "We prepared a special gift for you.",
            toast_select_item: isPT ? "Selecione um serviço primeiro" : "Select a service",
            toast_select_date: isPT ? "Escolha o dia e a hora" : "Choose day and time",
            toast_fill_name: isPT ? "Preciso saber seu nome" : "Fill your name",
            toast_fill_addr: isPT ? "Preencha o endereço completo" : "Fill address",
            toast_fill_hotel: isPT ? "Preencha nome do hotel e quarto" : "Fill hotel details",
            toast_select_pay: isPT ? "Selecione como vai pagar" : "Select payment",
            toast_accept_terms: isPT ? "Aceite as regras para continuar" : "Accept terms",
            toast_coupon_success: isPT ? "Cupom aplicado com sucesso!" : "Coupon applied!",
            zap: {
                house: isPT ? "Atendimento em Residência" : "Residential Service",
                motel: isPT ? "Atendimento em Motel" : "Motel Service",
                hotel: isPT ? "Atendimento em Hotel" : "Hotel Service",
                intro: isPT ? "Thalyson, acabei de escolher minha sessão no App:" : "Hello Thalyson, confirming my booking:",
                order_title: "🔥 *NOVO PEDIDO*",
                client: "👤 *Cliente:*",
                service: "💆‍♂️ *Sessão:*",
                date: "📅 *Quando:*",
                extra_title: "➕ *Adicionais:*",
                location: "📍 *Onde:*",
                value: "💲 *Valor:*",
                payment: "💳 *Pagamento:*",
                uber_label: "🚗 *Deslocamento:*",
                uber_text: "Calcular Uber (Ida/Volta)",
                xp_status: "📈 *Fidelidade:*",
                xp_gain: "Ganho:",
                xp_level: "Nível:",
                wait: "Aguardo confirmação. Valeu!"
            }
        }
    };
};

// ==================================================================================
// 2. COMPONENTES VISUAIS
// ==================================================================================

const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, full = false, icon: IconName, className = '', loading = false }) => {
  const baseStyle = "relative flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl select-none touch-manipulation overflow-hidden active:scale-[0.98] hover:brightness-110 shadow-lg font-['Poppins']";
  
  const variants = {
    primary: "bg-blue-600 text-white border border-blue-500/20 shadow-blue-600/30",
    secondary: "bg-zinc-800 border border-zinc-700 text-zinc-100 hover:bg-zinc-700 hover:border-zinc-500",
    whatsapp: "bg-[#25D366] text-white border border-green-400/20 shadow-green-500/20",
    instagram: "bg-gradient-to-tr from-purple-600 to-pink-600 text-white border border-pink-400/20",
    outline: "bg-transparent border-2 border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-300",
    ghost: "bg-transparent text-zinc-400 hover:text-white hover:bg-white/5",
    icon: "bg-zinc-800 border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-700"
  };
  
  const sizes = { 
    sm: "h-10 text-xs px-4", 
    md: "h-14 text-sm px-6", 
    lg: "h-16 text-base px-8", 
    xl: "h-16 text-base font-bold uppercase tracking-widest", 
    icon: "h-12 w-12 p-0 flex-shrink-0 rounded-full" 
  };

  return (
    <button type="button" onClick={onClick} disabled={disabled || loading} className={`${baseStyle} ${variants[variant] || variants.primary} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`}>
      {loading ? <Icon name="Loader2" size={22} className="animate-spin text-current"/> : (
        <>
          {IconName && <Icon name={IconName} size={22} className={children ? "mr-3 opacity-90 flex-shrink-0" : ""} />}
          <span className="truncate">{children}</span>
        </>
      )}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon: IconName, type = "text", error, isDark }) => (
  <div className="space-y-3 w-full group font-['Poppins']">
    {label && <label className={`text-sm font-bold uppercase tracking-widest ml-1 transition-colors ${isDark ? 'text-zinc-300 group-focus-within:text-blue-400' : 'text-slate-600 group-focus-within:text-blue-600'}`}>{label}</label>}
    <div className="relative">
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors z-10 ${isDark ? 'text-zinc-400 group-focus-within:text-blue-400' : 'text-slate-400 group-focus-within:text-blue-600'}`}>{IconName && <Icon name={IconName} size={22} />}</div>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        placeholder={placeholder} 
        className={`w-full pl-14 pr-5 h-16 rounded-2xl outline-none text-base font-medium transition-all duration-300 
        ${isDark 
            ? 'bg-zinc-900 border-2 border-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:bg-zinc-950 focus:border-blue-500 hover:border-zinc-700' 
            : 'bg-white border-2 border-slate-200 text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:shadow-md hover:border-slate-300'} 
        focus:shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] ${error ? 'border-red-500/50 text-red-500' : ''}`} 
      />
    </div>
    {error && <p className="text-red-500 text-xs ml-2 font-bold animate-pulse">{error}</p>}
  </div>
);

const Card = ({ children, className = '', onClick, active = false, isDark = true }) => (
  <div 
    onClick={onClick} 
    className={`relative p-8 md:p-10 rounded-[2.5rem] transition-all duration-300 flex flex-col justify-between h-full group font-['Poppins'] min-h-[480px]
    ${onClick ? 'cursor-pointer active:scale-[0.98] hover:-translate-y-2' : ''} 
    ${active 
        ? 'bg-blue-900/10 border-2 border-blue-500 shadow-[0_0_50px_-10px_rgba(37,99,235,0.4)]' 
        : (isDark ? 'bg-zinc-900/80 backdrop-blur-2xl border border-white/10 hover:border-blue-500/40 hover:bg-zinc-800/80' : 'bg-white border border-slate-200 shadow-xl shadow-slate-200/50 hover:border-blue-500/30')} 
    ${className}`}
  >
    {active && <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none rounded-[2.5rem]" />}
    {children}
  </div>
);

const SmartTimer = ({ isDark }) => {
  const [time, setTime] = useState(600); 
  useEffect(() => {
    const interval = setInterval(() => {
        setTime(prev => {
            if (prev <= 0) return 600; 
            return prev - 1;
        });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const format = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  return (
    <div className={`flex items-center justify-center gap-3 p-5 rounded-2xl mb-8 border-2 transition-colors duration-500 ${time < 60 ? 'bg-red-500/10 border-red-500/30 text-red-400' : (isDark ? 'bg-blue-500/5 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600')}`}>
        <Icon name="Hourglass" size={20} className={time < 60 ? "animate-spin" : "animate-pulse"}/>
        <span className="text-sm font-bold uppercase tracking-wider">
            {time < 60 ? "Expira em breve: " : "Segurando vaga: "} 
            <span className="font-mono text-base ml-1">{format(time)}</span>
        </span>
    </div>
  );
};

const ReviewsCarousel = ({ reviews, isDark, title }) => {
  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
        const { current } = scrollRef;
        const scrollAmount = 360; 
        if (direction === 'left') {
            current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }
  };
  return (
    <div className={`w-full overflow-hidden py-20 border-t mt-12 relative group/reviews ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
      <div className="flex flex-col md:flex-row justify-between items-end px-6 md:px-12 mb-10 gap-6">
          <div>
              <h3 className={`text-3xl font-light mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>O que dizem sobre mim</h3>
              <p className={`text-xs uppercase tracking-[0.25em] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{title}</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => scroll('left')} className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}><Icon name="ChevronLeft" size={20} /></button>
             <button onClick={() => scroll('right')} className={`w-12 h-12 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'}`}><Icon name="ChevronRight" size={20} /></button>
          </div>
      </div>
      
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide px-6 md:px-12 snap-x snap-mandatory font-['Poppins'] pb-8">
        {reviews.map((r, i) => (
            <div key={`${i}-${r.n}`} className={`snap-center flex-shrink-0 w-80 md:w-96 p-8 rounded-[2rem] transition-all duration-300 hover:-translate-y-1 select-none border backdrop-blur-xl ${isDark ? 'bg-zinc-900/60 border-white/10 shadow-black/20 hover:border-blue-500/30' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40'}`}>
              <div className="flex justify-between items-start mb-6">
                 <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold border ${isDark ? 'bg-blue-600/20 text-blue-500 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>{r.n.charAt(0)}</div>
                    <div><span className={`text-base font-bold block leading-none mb-1 ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{r.n}</span><span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{r.loc}</span></div>
                 </div>
                 <div className={`px-2 py-1 rounded-lg border flex gap-1 ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-100'}`}>{[...Array(5)].map((_, k) => (<Icon key={k} name="Star" size={10} className={k < r.s ? "text-blue-500 fill-blue-500" : (isDark ? "text-zinc-800" : "text-slate-300")} />))}</div>
              </div>
              <div className="relative pt-2 pl-2">
                  <div className={`absolute -top-4 -left-2 opacity-10 ${isDark ? 'text-white' : 'text-black'}`}><Icon name="Quote" size={40}/></div>
                  <p className={`text-sm leading-relaxed font-light italic relative z-10 pl-2 ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>"{r.t}"</p>
              </div>
            </div>
        ))}
        <div className="w-6 shrink-0"></div>
      </div>
    </div>
  );
};

const FAQItem = ({ q, a, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex items-center justify-between text-left group">
                <span className={`text-base font-semibold transition-colors ${isDark ? 'text-zinc-200 group-hover:text-blue-400' : 'text-slate-700 group-hover:text-blue-600'}`}>{q}</span>
                <Icon name="ChevronDown" size={20} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : (isDark ? 'text-zinc-500' : 'text-slate-400')}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{a}</p>
            </div>
        </div>
    );
};

// ==================================================================================
// 4. APLICAÇÃO PRINCIPAL
// ==================================================================================

export default function App() {
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [step, setStep] = useState(0); 
  const [lang, setLang] = useState('pt');
  const [isDark, setIsDark] = useState(true);
  const [activeTab, setActiveTab] = useState('packs');
  const [isClient, setIsClient] = useState(false);
  
  const [termsOpen, setTermsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [welcomePopup, setWelcomePopup] = useState(false);
  const [levelUpPopup, setLevelUpPopup] = useState(false);
  const [toasts, setToasts] = useState([]);
  
  const scrollRef = useRef(null);
  const dateScrollRef = useRef(null); 
  
  const DATA = useMemo(() => getData(lang), [lang]);
  const T = DATA.text;

  const [user, setUser] = useState({ 
      name: '', xp: 0, coupons: [], usedCoupons: [], 
      savedAddress: { street: '', number: '', district: '', city: '', comp: '', placeName: '' }, 
      hasSeenWelcome: false,
      ordersCount: 0
  });

  const [booking, setBooking] = useState({
    type: 'single', item: null, extras: {}, date: null, time: null, locationType: 'home', 
    address: { city: '', district: '', street: '', number: '', comp: '', placeName: '' },
    payment: '', appliedCoupon: null, termsAccepted: false
  });

  // --- EFEITOS & LÓGICA ---

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    try {
        const s = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (s) {
            const parsed = JSON.parse(s);
            if(parsed.user) {
                setUser(prev => ({ ...prev, ...parsed.user, coupons: parsed.user.coupons || [], usedCoupons: parsed.user.usedCoupons || [] }));
            }
            if(parsed.bookingDraft && parsed.bookingDraft.item) {
                const draftDate = new Date(parsed.bookingDraft.date);
                if(draftDate > new Date()) {
                    setBooking(parsed.bookingDraft);
                    if(parsed.step) setStep(parsed.step); 
                }
            }
        }
    } catch (e) { 
        console.error("Erro ao carregar dados:", e); 
        localStorage.removeItem(CONFIG.STORAGE_KEY); 
    }
    setDataLoaded(true);
    setTimeout(() => setLoading(false), 1000); 
  }, [isClient]);

  useEffect(() => { 
      if(isClient && dataLoaded) { 
          const saveData = {
              user: user,
              bookingDraft: booking, 
              step: step 
          };
          try { 
              localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(saveData)); 
          } catch(e) {} 
      }
  }, [user, booking, step, isClient, dataLoaded]);

  useEffect(() => {
     if(!loading && isClient && dataLoaded && !user.hasSeenWelcome) {
         const timer = setTimeout(() => setWelcomePopup(true), 2500);
         return () => clearTimeout(timer);
     }
  }, [loading, isClient, user.hasSeenWelcome, dataLoaded]);

  useEffect(() => { 
      if(scrollRef.current) scrollRef.current.scrollTo(0,0); 
  }, [step]);

  const handleShare = () => {
      if (navigator.share) {
          navigator.share({ title: 'Thalyson Massagens', url: window.location.href });
      } else {
          navigator.clipboard.writeText(window.location.href);
          addToast("Link copiado!", "success");
      }
  };

  const scrollDates = (dir) => {
      if (dateScrollRef.current) {
          const amt = dir === 'left' ? -200 : 200;
          dateScrollRef.current.scrollBy({ left: amt, behavior: 'smooth' });
      }
  };

  const handleSelectItem = (type, item) => {
      setBooking(prev => ({ ...prev, type: type, item: item, extras: {}, payment: '', termsAccepted: false }));
      addToast(item.title, "success");
  };

  const addToast = (msg, type = "success") => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const daysArray = useMemo(() => {
      const days = [];
      const today = new Date();
      for(let i=0; i<30; i++) { 
          const d = new Date(today);
          d.setDate(today.getDate() + i);
          days.push(d);
      }
      return days;
  }, []);

  const generateTimeSlots = useMemo(() => {
      if (!booking.date) return [];
      const slots = [];
      for (let i = CONFIG.START_HOUR; i <= CONFIG.END_HOUR; i++) {
        slots.push(`${i < 10 ? '0' : ''}${i}:00`);
      }
      
      const now = new Date();
      const selectedDate = new Date(booking.date);
      if (isNaN(selectedDate.getTime())) return [];
      
      const isToday = selectedDate.getDate() === now.getDate() && 
                      selectedDate.getMonth() === now.getMonth() && 
                      selectedDate.getFullYear() === now.getFullYear();
      
      if (isToday) {
          const currentHour = now.getHours();
          return slots.filter(time => {
              const [hour] = time.split(':').map(Number);
              return hour > currentHour; 
          });
      }
      return slots;
  }, [booking.date]);

  const financials = useMemo(() => {
    if (!booking.item) return { total: 0, sub: 0, disc: 0, pixDisc: 0 };
    let sub = booking.item.price;
    Object.keys(booking.extras).forEach(k => { 
        if(booking.extras[k]) {
            const extData = DATA.extras.find(e=>e.id===k);
            if(extData) {
                const extraPrice = booking.type !== 'single' ? Math.floor(extData.price * 0.8) : extData.price;
                sub += extraPrice; 
            }
        }
    });
    const disc = booking.appliedCoupon ? booking.appliedCoupon.val : 0;
    let totalAfterCoupon = Math.max(0, sub - disc);
    
    let pixDisc = 0;
    if (booking.payment === 'pix') {
        pixDisc = Math.ceil(totalAfterCoupon * 0.05); 
    }
    
    const finalTotal = Math.max(0, totalAfterCoupon - pixDisc);

    return { sub, disc, pixDisc, total: finalTotal };
  }, [booking.item, booking.extras, booking.appliedCoupon, booking.type, DATA.extras, booking.payment]);

  const estimatedXP = useMemo(() => {
      const baseXP = financials.total;
      const isPack = booking.type === 'pack' || booking.type === 'subscription';
      const percentage = isPack ? 0.30 : 0.15; 
      return Math.floor(baseXP * percentage);
  }, [financials.total, booking.type]);

  const getNextLevelInfo = (currentXP) => {
      if (currentXP >= 800) {
          const cycleXP = currentXP - 800;
          const nextRewardAt = 500 - (cycleXP % 500); 
          return { needed: nextRewardAt, reward: 50, title: "Elite Prestige" }; 
      }
      const nextLevel = DATA.levels.find(l => l.xpNeeded > currentXP);
      return nextLevel ? { needed: nextLevel.xpNeeded - currentXP, reward: nextLevel.reward, title: nextLevel.title } : null;
  };

  const getGreeting = () => {
      const h = new Date().getHours();
      if (h < 12) return lang === 'pt' ? "Bom dia" : "Good morning";
      if (h < 18) return lang === 'pt' ? "Boa tarde" : "Good afternoon";
      return lang === 'pt' ? "Boa noite" : "Good evening";
  };

  const getSubGreeting = () => {
      const h = new Date().getHours();
      if (h < 12) return lang === 'pt' ? "Ótimo dia para relaxar" : "Great day to relax";
      if (h < 18) return lang === 'pt' ? "Ótima tarde para relaxar" : "Great afternoon to relax";
      return lang === 'pt' ? "Ótima noite para relaxar" : "Great night to relax";
  };

  const generateSecurityHash = (price, date, itemName) => {
    const raw = `${price}-${date}-${itemName}-${CONFIG.SECRET_TOKEN}`;
    return btoa(raw).substring(0, 8).toUpperCase();
  };

  const generateWhatsAppLink = () => {
    const f = financials;
    const dateStr = booking.date ? new Date(booking.date).toLocaleDateString(lang === 'pt' ? 'pt-BR' : 'en-US') : '';
    const xpGain = estimatedXP;
    const currentLevelTitle = DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title;
    
    const securityHash = generateSecurityHash(f.total, dateStr, booking.item?.id);

    let serviceTitle = booking.item?.title;
    if (booking.type !== 'single' && booking.item?.desc) {
       const descClean = booking.item.desc.replace(/^(Contém:|Contains:)\s*/i, '');
       serviceTitle += `\n📦 *${lang === 'pt' ? 'Inclui' : 'Includes'}:* ${descClean}`;
    }

    let locTxt = "";
    let mapQuery = "";
    if(booking.locationType === 'home') {
        const fullAddr = `${booking.address.street}, ${booking.address.number} - ${booking.address.district}, ${booking.address.city}`;
        locTxt = `${T.zap.house}\n📍 ${fullAddr}\n📝 Comp: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    } else if(booking.locationType === 'motel') {
        locTxt = `${T.zap.motel}\n⚠️ (${lang === 'pt' ? 'Local por conta do cliente' : 'Venue fee on client'})`;
    } else {
        const fullAddr = `${booking.address.placeName}, ${booking.address.city}`;
        locTxt = `${T.zap.hotel}: ${booking.address.placeName}\n📍 ${booking.address.city}\n🚪 ${lang === 'pt' ? 'Quarto' : 'Room'}: ${booking.address.comp || '-'}`;
        mapQuery = fullAddr;
    }
    
    const extrasList = Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
         let label = '';
         let price = 0;
         if(k === 'more_time') { label = '+30 Min'; price = DATA.extras[0].price; }
         if(k === 'touch') { label = 'Troca'; price = DATA.extras[1].price; }
         if(k === 'aroma') { label = 'Aroma'; price = DATA.extras[2].price; }
         
         if(booking.type !== 'single') price = Math.floor(price * 0.8);
        return `✅ ${label} (+ ${DATA.currency} ${price})`;
    }).filter(Boolean).join('\n');
    
    const msg = `
${getGreeting()} ${T.zap.intro}
${T.zap.order_title} 🔐 #${securityHash}
──────────────────────

${T.zap.client} ${user.name}
${T.zap.service} ${serviceTitle}
${T.zap.date} ${dateStr} - ${booking.time}

${extrasList ? `${T.zap.extra_title}\n${extrasList}\n` : ''}
${T.zap.location}
${locTxt}
${mapQuery ? `\n🔗 *Mapa:* https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}` : ''}
──────────────────────

${T.zap.value}
Total: ${DATA.currency} ${f.total},00
${booking.payment === 'pix' ? `(Inclui desconto de 5%)` : ''}
${T.zap.payment} ${booking.payment.toUpperCase()}
${T.zap.uber_label} ${T.zap.uber_text}

💰 *CHAVE PIX:* ${CONFIG.PIX_KEY}
📸 *INSTAGRAM:* ${CONFIG.INSTAGRAM_URL}

${T.zap.xp_status}
⚜️ ${T.zap.xp_gain} +${xpGain} XP
⚜️ ${T.zap.xp_level} ${currentLevelTitle}

${T.zap.wait}
`.trim();
    return `https://api.whatsapp.com/send?phone=${CONFIG.PHONE}&text=${encodeURIComponent(msg)}`;
  };

  const validateStep = () => {
      if (step === 0) {
          if(!booking.item) { addToast(T.toast_select_item, "error"); return false; }
          return true;
      }
      if (step === 1) {
          if (!booking.date || !booking.time) { addToast(T.toast_select_date, "error"); return false; }
          return true;
      }
      if (step === 2) {
          if (!user.name || user.name.trim().length < 3) { addToast(T.toast_fill_name, "error"); return false; }
          if (booking.locationType === 'home') {
              if(!booking.address.street || !booking.address.number || !booking.address.district || !booking.address.city) { addToast(T.toast_fill_addr, "error"); return false; }
          }
          if (booking.locationType === 'hotel') {
              if(!booking.address.placeName || !booking.address.city) { addToast(T.toast_fill_hotel, "error"); return false; }
          }
          return true;
      }
      if (step === 3) {
          if (!booking.payment) { addToast(T.toast_select_pay, "error"); return false; }
          if (!booking.termsAccepted) { addToast(T.toast_accept_terms, "error"); return false; }
          return true;
      }
      return true;
  };

  const handleNextStep = () => {
      if(validateStep()) {
          if (step === 2) { setUser(prev => ({...prev, savedAddress: booking.address})); }
          if (step === 3) { finishBooking(); } else { setStep(s => s + 1); }
      }
  };

  const finishBooking = () => {
    let updatedCoupons = Array.isArray(user.coupons) ? [...user.coupons] : [];
    let updatedHistory = Array.isArray(user.usedCoupons) ? [...user.usedCoupons] : [];
    if (booking.appliedCoupon) { 
        if(!updatedHistory.includes(booking.appliedCoupon.code)) {
            updatedHistory.push(booking.appliedCoupon.code);
        }
        updatedCoupons = updatedCoupons.filter(c => c.code !== booking.appliedCoupon.code); 
    }
    const newXP = Math.floor(user.xp + estimatedXP);
    let leveledUp = false;
    DATA.levels.forEach(lvl => {
        if (newXP >= lvl.xpNeeded && user.xp < lvl.xpNeeded && lvl.level > 1) {
            leveledUp = true;
            updatedCoupons.push({ id: `LVL${lvl.level}_${Date.now()}`, val: lvl.reward, title: `🏆 ${lvl.title}`, code: `LVLUP${lvl.level}` });
        }
    });
    if (newXP >= 800) {
        const oldCycle = Math.floor((user.xp - 800) / 500);
        const newCycle = Math.floor((newXP - 800) / 500);
        if (newCycle > oldCycle && newCycle >= 0) {
              leveledUp = true;
              updatedCoupons.push({ id: `PRESTIGE_${Date.now()}`, val: 50, title: `🏆 Elite`, code: `VIPMASTER` });
        }
    }
    if (leveledUp) setLevelUpPopup(true);
    setUser(prev => ({ 
        ...prev, 
        xp: newXP, 
        coupons: updatedCoupons,
        usedCoupons: updatedHistory,
        ordersCount: prev.ordersCount + 1 
    }));
    if (typeof window !== 'undefined') { window.open(generateWhatsAppLink(), '_blank'); }
    setBooking(b => ({...b, item: null, type:'single', payment: '', appliedCoupon: null, termsAccepted: false})); 
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({ user: {...user, xp: newXP}, bookingDraft: null, step: 0 }));
    setStep(4);
  };

  const getCurrentLevelProgress = () => {
      if (user.xp >= 800) { return ((user.xp - 800) % 500 / 500) * 100; }
      const currentLevelIndex = DATA.levels.slice().reverse().findIndex(l => user.xp >= l.xpNeeded);
      const realIndex = currentLevelIndex === -1 ? 0 : DATA.levels.length - 1 - currentLevelIndex;
      const currentLevel = DATA.levels[realIndex];
      const nextLevel = DATA.levels[realIndex + 1];
      if (!nextLevel) return 100; 
      return Math.min(100, Math.max(0, ((user.xp - currentLevel.xpNeeded) / (nextLevel.xpNeeded - currentLevel.xpNeeded)) * 100));
  };

  const nextLevelInfo = getNextLevelInfo(user.xp);

  if (!isClient) return <div className="min-h-screen w-full bg-zinc-950 font-['Poppins']" />;

  if (loading) return (
      <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-all duration-700 font-['Poppins'] ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <div className="relative mb-12">
            <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center font-black text-4xl shadow-2xl relative z-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30 animate-bounce-slow">TM</div>
        </div>
        <div className="flex flex-col items-center gap-4">
            <div className="w-40 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-slide-in" style={{width: '100%', animationDuration: '2s'}}></div>
            </div>
            <div className="text-xs font-bold tracking-[0.3em] opacity-50 uppercase flex items-center gap-2">
                <span className="animate-pulse">{T.loading}</span>
            </div>
        </div>
      </div>
  );

  return (
    <div className={`h-[100dvh] w-full font-['Poppins'] flex flex-col overflow-hidden transition-colors duration-500 ${isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-blue-500/30 selection:text-blue-500' : 'bg-slate-50 text-slate-800 selection:bg-blue-200 selection:text-blue-800'}`}>
      
      <div className="fixed inset-0 pointer-events-none">
          <div className={`absolute top-[-20%] left-[-20%] w-[70%] h-[70%] blur-[120px] rounded-full animate-pulse-slow ${isDark ? 'bg-blue-600/5' : 'bg-blue-200/40'}`}></div>
          <div className={`absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] blur-[120px] rounded-full animate-pulse-slow ${isDark ? 'bg-indigo-600/5' : 'bg-indigo-200/40'}`}></div>
      </div>

      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] flex flex-col gap-3 w-full max-w-xs pointer-events-none px-4">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl animate-slide-down ${t.type === 'success' ? (isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-100 border-emerald-200 text-emerald-800') : (isDark ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-100 border-red-200 text-red-700')}`}>
            {t.type === 'success' ? <Icon name="Check" size={20} /> : <Icon name="AlertTriangle" size={20} />}
            <span className="text-sm font-medium leading-tight">{t.msg}</span>
          </div>
        ))}
      </div>

      {/* HEADER (Ocultar no Passo 4 para clean look) */}
      {step !== 4 && (
        <header className="h-24 px-6 md:px-12 flex items-center justify-between z-20 shrink-0 bg-transparent relative max-w-5xl mx-auto w-full">
            <div className="flex flex-col justify-center">
                <span className={`font-bold text-2xl tracking-wide block leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>Thalyson</span>
                <span className="text-[10px] uppercase font-bold text-blue-500 tracking-[0.15em] mt-1.5 flex items-center gap-1"><Icon name="Star" size={12} className="fill-[#2563eb] text-[#2563eb]"/> +80 Clientes</span>
            </div>
            <div className="flex gap-2">
                <button onClick={()=>setSettingsOpen(true)} className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="Settings" size={20}/></button>
                <button onClick={handleShare} className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="Share2" size={20}/></button>
                <button onClick={() => setLang(l => l==='pt'?'en':'pt')} className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-sm'}`}><Icon name="Globe" size={20}/></button>
                <button onClick={() => setIsDark(!isDark)} className={`w-11 h-11 flex items-center justify-center rounded-full border transition-all ${isDark ? 'bg-white/5 border-white/5 text-zinc-300 hover:text-white' : 'bg-white border-slate-200 text-blue-500 hover:text-blue-600 shadow-sm'}`}>{isDark ? <Icon name="Moon" size={20}/> : <Icon name="Sun" size={20}/>}</button>
            </div>
        </header>
      )}

      <main ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-40 pt-4 scroll-smooth relative z-10 px-6 md:px-12">
        <div className="max-w-5xl mx-auto space-y-16">
          {step === 0 && (
            <div className="animate-fade-in space-y-16">
              <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                <div className="animate-slide-up delay-100">
                    <div className="flex items-end gap-3 mb-6">
                        <h1 className={`text-5xl md:text-6xl font-light tracking-tight leading-[1.1] ${isDark ? 'text-white' : 'text-slate-900'}`}>{getGreeting()}, <span className="font-bold text-blue-500">{user.name ? user.name.split(' ')[0] : (lang === 'pt' ? "Visitante" : "Visitor")}</span></h1>
                    </div>
                    <div className="text-lg font-light leading-relaxed max-w-lg min-h-[30px] flex items-center">
                        <span className={`animate-fade-in ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{getSubGreeting()}. <span className="opacity-50">Escolha:</span></span>
                    </div>
                </div>
                <div className={`hidden md:block animate-slide-up delay-200 relative overflow-hidden rounded-[2.5rem] p-10 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-blue-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20' : 'bg-blue-50 text-white shadow-blue-200'}`}>
                                <Icon name="Trophy" size={40} />
                            </div>
                            <div>
                                <span className={`text-xs uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-3xl mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-5xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-xs font-bold uppercase text-blue-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`flex justify-between text-xs font-bold mb-3 uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            <span>Progresso</span>
                            <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-2.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_15px_#2563eb]" style={{width: `${getCurrentLevelProgress()}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'}}></div>
                        </div>
                        <p className={`text-sm mt-5 text-center font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                             {nextLevelInfo ? T.missing_xp_msg(nextLevelInfo.needed, nextLevelInfo.reward) : "Ciclo Elite: +R$50 a cada 500 XP"}
                        </p>
                    </div>
                </div>
              </div>

              {/* Mobile Level Card */}
              <div className={`md:hidden animate-slide-up delay-200 relative mt-4 overflow-hidden rounded-[2rem] p-6 border backdrop-blur-2xl transition-all duration-700 ${isDark ? 'border-white/10 bg-zinc-900/40 hover:border-blue-500/30' : 'border-slate-200 bg-white/60 shadow-xl hover:border-blue-500/30'}`}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none transition-all duration-700"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isDark ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20' : 'bg-blue-50 text-white shadow-blue-200'}`}>
                                <Icon name="Trophy" size={26} />
                            </div>
                            <div>
                                <span className={`text-[10px] uppercase font-bold tracking-[0.15em] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.level_label}</span>
                                <h3 className={`font-bold text-2xl mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                    {user.xp >= 800 ? "VIP Master Elite" : (DATA.levels.find(l => user.xp >= l.xpNeeded && (!DATA.levels.find(nl => nl.xpNeeded > l.xpNeeded && user.xp >= nl.xpNeeded)))?.title || DATA.levels[0].title)}
                                </h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`text-3xl font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.xp}</span>
                            <span className="text-[10px] font-bold uppercase text-blue-500 tracking-wider">XP</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div className={`flex justify-between text-[10px] font-bold mb-2 uppercase tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                            <span>Progresso</span>
                            <span className="text-blue-500">{Math.floor(getCurrentLevelProgress())}%</span>
                        </div>
                        <div className={`h-1.5 w-full rounded-full overflow-hidden ${isDark ? 'bg-zinc-800' : 'bg-slate-300'}`}>
                            <div className="h-full bg-gradient-to-r from-blue-600 to-blue-400" style={{width: `${getCurrentLevelProgress()}%`}}></div>
                        </div>
                    </div>
              </div>

              <div className="flex p-1.5 rounded-2xl bg-zinc-900/50 border border-white/5 max-w-md mx-auto">
                  <button onClick={() => setActiveTab('packs')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'packs' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Icon name="Layers" size={16} className={activeTab === 'packs' ? 'animate-pulse' : ''}/> {T.tab_packs}
                  </button>
                  <button onClick={() => setActiveTab('single')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'single' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}>
                      <Icon name="LayoutList" size={16}/> {T.tab_single}
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeTab === 'single' ? DATA.services.map((s, idx) => (
                    <div key={s.id} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                         <Card active={booking.item?.id === s.id} onClick={() => handleSelectItem('single', s)} isDark={isDark}>
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-zinc-800 text-blue-500' : 'bg-blue-50 text-blue-600'}`}><Icon name={s.icon} size={32} /></div>
                                    <div className="text-right">
                                        <span className="text-blue-500 font-black text-4xl block tracking-tight">{DATA.currency} {s.price}</span>
                                        <span className={`text-xs font-bold uppercase tracking-wider flex items-center justify-end gap-1.5 mt-2 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}><Icon name="Clock" size={14}/> {s.min} min</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <span className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">{s.tag}</span>
                                    <h3 className={`text-2xl font-bold mt-4 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.title}</h3>
                                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{s.desc}</p>
                                </div>
                            </div>
                            <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 font-bold mb-3 text-blue-500 uppercase tracking-wider text-[10px]"><Icon name="Info" size={14}/> {T.details_label}</div>
                                <div className={`text-xs leading-relaxed space-y-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                                    {s.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                            </div>
                         </Card>
                    </div>
                )) : DATA.plans.map((plan, idx) => (
                    <div key={plan.id} className="animate-slide-up" style={{animationDelay: `${idx * 100}ms`}}>
                         <Card active={booking.item?.id === plan.id} onClick={() => handleSelectItem(plan.type, plan)} isDark={isDark} className="border-blue-500/20">
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${isDark ? 'bg-blue-500/10 text-blue-500' : 'bg-blue-50 text-white'}`}><Icon name={plan.icon} size={32} /></div>
                                    <div className="text-right">
                                        <span className={`text-sm line-through block opacity-50 mb-1 ${isDark ? 'text-zinc-400' : 'text-slate-400'}`}>{DATA.currency} {plan.fullPrice}</span>
                                        <span className="text-blue-500 font-black text-4xl block tracking-tight">{DATA.currency} {plan.price}</span>
                                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 block">Economize {DATA.currency} {plan.savings}</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">{plan.tag}</span>
                                    <h3 className={`text-2xl font-bold mt-4 mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.title}</h3>
                                    <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{plan.desc}</p>
                                </div>
                            </div>
                            <div className={`pt-6 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <div className="flex items-center gap-2 font-bold mb-3 text-blue-500 uppercase tracking-wider text-[10px]"><Icon name="Info" size={14}/> {T.details_label}</div>
                                <div className={`text-xs leading-relaxed space-y-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                                    {plan.details.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                                </div>
                            </div>
                         </Card>
                    </div>
                ))}
              </div>

              <ReviewsCarousel reviews={DATA.reviews} isDark={isDark} title={DATA.reviews_title} />

              <div className="max-w-3xl mx-auto py-20">
                  <h3 className={`text-3xl font-light text-center mb-12 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dúvidas Frequentes</h3>
                  <div className={`border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                      {DATA.faq.map((item, idx) => (
                          <FAQItem key={idx} q={item.q} a={item.a} isDark={isDark} />
                      ))}
                  </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="animate-slide-in space-y-12">
              <h2 className={`text-3xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.select_time_title}</h2>
              <div className="relative">
                  <button onClick={() => scrollDates('left')} className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><Icon name="ChevronLeft" size={24} /></button>
                  <div ref={dateScrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide px-2 py-4 snap-x">
                        {daysArray.map((d, idx) => { 
                          const isSel = booking.date && new Date(booking.date).toDateString() === d.toDateString();
                          let lbl = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {weekday:'short'}).slice(0,3);
                          const monthName = d.toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN, {month:'short'}).replace('.','');
                          return (
                            <div key={idx} className="snap-center">
                                <button onClick={() => setBooking(b => ({...b, date: d.toISOString(), time: null}))} className={`w-24 h-32 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all duration-300 border-2 ${isSel ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-600/30 scale-110' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600')}`}>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">{monthName}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{lbl}</span>
                                    <span className="text-3xl font-bold">{d.getDate()}</span>
                                    {isSel && <span className="w-1.5 h-1.5 rounded-full bg-white mt-1"></span>}
                                </button>
                            </div>
                          )
                        })}
                  </div>
                  <button onClick={() => scrollDates('right')} className={`hidden md:flex absolute -right-12 top-1/2 -translate-y-1/2 z-20 w-12 h-12 items-center justify-center rounded-full border transition-all hover:scale-110 ${isDark ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 shadow-md'}`}><Icon name="ChevronRight" size={24} /></button>
              </div>
              {!booking.date && (<div className={`text-center py-20 opacity-30 border-2 border-dashed rounded-[2.5rem] mx-2 ${isDark ? 'border-zinc-800 text-zinc-500' : 'border-slate-300 text-slate-400'}`}><Icon name="Calendar" size={48} className="mx-auto mb-4"/><p className="text-sm font-bold uppercase tracking-widest">{T.empty_date}</p></div>)}
              {booking.date && generateTimeSlots.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in">
                   {generateTimeSlots.map((t, idx) => {
                       const isLastSpot = idx === generateTimeSlots.length - 1 || idx === 2;
                       return (
                           <button key={t} onClick={() => { setBooking(b => ({...b, time: t})); }} className={`py-4 rounded-2xl text-sm font-semibold border-2 transition-all active:scale-95 duration-200 relative overflow-hidden group animate-scale-in ${booking.time === t ? (isDark ? 'bg-zinc-100 text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'bg-slate-900 text-white border-slate-900 shadow-xl') : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-800')}`} style={{animationDelay: `${idx * 50}ms`}}>
                               {t}
                               {isLastSpot && <span className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-bl-lg">🔥</span>}
                           </button>
                       )
                   })}
                </div>
              )}
              {booking.date && generateTimeSlots.length === 0 && (<div className={`text-center py-16 rounded-3xl border ${isDark ? 'bg-zinc-900/50 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}><p className="text-sm font-medium">{T.empty_slots}</p></div>)}
            </div>
          )}

          {step === 2 && (
             <div className="animate-slide-in space-y-16">
               <h2 className={`text-3xl font-light text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.location_title}</h2>
               <div className="grid grid-cols-3 gap-6 mb-10 max-w-xl mx-auto">
                  {[{id:'home', l:T.zap.house, i:'Home'}, {id:'motel', l:T.zap.motel, i:'BedDouble'}, {id:'hotel', l:T.zap.hotel, i:'Building'}].map(x => (
                      <button key={x.id} onClick={()=>setBooking(b=>({...b, locationType: x.id}))} className={`py-8 rounded-3xl text-[10px] md:text-xs font-bold uppercase tracking-wide flex flex-col items-center justify-center gap-4 transition-all duration-300 border-2 ${booking.locationType === x.id ? 'bg-blue-600/10 border-blue-500/50 text-blue-500 shadow-[0_0_30px_-5px_rgba(37,99,235,0.3)] scale-105' : (isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:border-zinc-700 hover:text-zinc-300' : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-700')}`}>
                          <Icon name={x.i} size={28} /> {x.l}
                      </button>
                  ))}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-8">
                      <InputField isDark={isDark} label={T.input_name} value={user.name} onChange={e=>setUser(u=>({...u, name: e.target.value}))} icon="User" placeholder={lang === 'pt' ? "Seu Nome/Apelido" : "Your Name/Nickname"} />
                      {booking.locationType === 'home' && (
                          <div className="space-y-6 animate-fade-in">
                              <div className="grid grid-cols-[1fr_120px] gap-4">
                                 <InputField isDark={isDark} label={T.input_addr} value={booking.address.street} onChange={e=>setBooking(b=>({...b, address: {...b.address, street: e.target.value}}))} icon="MapPin" placeholder={lang === 'pt' ? "Rua" : "Street"} />
                                 <InputField isDark={isDark} label={T.input_num} value={booking.address.number} type="tel" onChange={e=>setBooking(b=>({...b, address: {...b.address, number: e.target.value}}))} placeholder={lang === 'pt' ? "Nº" : "No."} />
                              </div>
                              <InputField isDark={isDark} label={T.input_bairro} value={booking.address.district} onChange={e=>setBooking(b=>({...b, address: {...b.address, district: e.target.value}}))} placeholder={lang === 'pt' ? "Bairro" : "District"} />
                              <div className="grid grid-cols-2 gap-4">
                                 <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                                 <InputField isDark={isDark} label={T.input_comp} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} placeholder={lang === 'pt' ? "Comp" : "Unit/Apt"} />
                              </div>
                          </div>
                      )}
                      {booking.locationType === 'hotel' && (
                          <div className="space-y-6 animate-fade-in">
                             <InputField isDark={isDark} label={T.input_hotel} value={booking.address.placeName} onChange={e=>setBooking(b=>({...b, address: {...b.address, placeName: e.target.value}}))} icon="Building" placeholder={lang === 'pt' ? "Nome do Hotel" : "Hotel Name"} />
                             <InputField isDark={isDark} label={T.input_city} value={booking.address.city} onChange={e=>setBooking(b=>({...b, address: {...b.address, city: e.target.value}}))} placeholder={lang === 'pt' ? "Cidade" : "City"} />
                             <InputField isDark={isDark} label={T.input_room} value={booking.address.comp} onChange={e=>setBooking(b=>({...b, address: {...b.address, comp: e.target.value}}))} icon="Lock" placeholder={lang === 'pt' ? "Quarto" : "Room"} />
                          </div>
                      )}
                      {booking.locationType === 'motel' && (
                          <div className={`p-10 rounded-3xl border border-dashed text-center ${isDark ? 'border-zinc-700 bg-zinc-900/30' : 'border-slate-300 bg-slate-50'}`}>
                             <Icon name="Smartphone" size={32} className={`mx-auto mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}/>
                             <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{T.motel_note}</p>
                          </div>
                      )}
                   </div>
                   <div className={`pt-0 md:pl-12 md:border-l ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                      <h3 className={`text-xs font-bold uppercase mb-8 tracking-widest ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{booking.type !== 'single' ? T.extras_title.replace(':', ' (20% OFF):') : T.extras_title}</h3>
                      <div className="space-y-4">
                         {DATA.extras.map((ex, idx) => {
                           const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                           return (
                             <div key={ex.id} onClick={()=>setBooking(b=>({...b, extras:{...b.extras, [ex.id]: !b.extras[ex.id]}}))} className={`group flex items-center justify-between p-5 rounded-2xl border cursor-pointer transition-all duration-300 animate-slide-in ${booking.extras[ex.id] ? 'bg-blue-600/10 border-blue-500/40 shadow-[0_0_20px_-5px_rgba(37,99,235,0.2)]' : (isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800' : 'bg-white border-slate-200 hover:border-slate-300')}`} style={{animationDelay: `${idx * 100}ms`}}>
                               <div className="flex items-center gap-5">
                                   <div className={`p-3 rounded-xl transition-colors ${booking.extras[ex.id] ? 'text-blue-500' : (isDark ? 'text-zinc-600' : 'text-slate-500')}`}><Icon name={ex.icon} size={22}/></div>
                                   <div><p className={`text-sm font-bold transition-colors ${booking.extras[ex.id] ? 'text-blue-500' : (isDark ? 'text-zinc-200' : 'text-slate-700')}`}>{ex.label}</p><p className={`text-xs font-medium pt-1 ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>{ex.desc}</p></div>
                               </div>
                               <div className="text-right">
                                  {booking.type !== 'single' && (<span className={`text-[10px] line-through block ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>{DATA.currency} {ex.price}</span>)}
                                  <span className={`text-xs font-bold whitespace-nowrap px-3 py-1.5 rounded-xl inline-block ${booking.extras[ex.id] ? 'bg-blue-500/20 text-blue-500' : (isDark ? 'text-zinc-500 bg-zinc-800' : 'text-slate-500 bg-slate-100')}`}>+ {DATA.currency} {price}</span>
                               </div>
                             </div>
                           )
                         })}
                      </div>
                   </div>
               </div>
             </div>
          )}

          {step === 3 && (
             <div className="animate-slide-in pb-16 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
                    <div className="relative">
                        <div className={`p-10 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                           <h3 className={`text-xl font-light mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Resumo da Reserva</h3>
                           <div className="space-y-8">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Serviço Selecionado</p>
                                      <h4 className={`text-xl font-bold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>{booking.item?.title}</h4>
                                      <p className="text-xs text-blue-500 font-medium flex items-center gap-3 bg-blue-500/10 px-4 py-2 rounded-full w-fit border border-blue-500/10 mt-3"><Icon name="Calendar" size={14}/> {booking.date ? new Date(booking.date).toLocaleDateString(lang==='pt'?CONFIG.LOCALE_PT:CONFIG.LOCALE_EN) : ''} • {booking.time}</p>
                                  </div>
                                  <span className="text-2xl font-bold text-blue-500">{DATA.currency} {booking.item?.price}</span>
                              </div>
                              {Object.keys(booking.extras).filter(k=>booking.extras[k]).length > 0 && (
                                  <div className={`pt-8 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                      <p className={`text-[10px] uppercase font-bold tracking-widest mb-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Adicionais</p>
                                      <div className="space-y-4">
                                          {Object.keys(booking.extras).filter(k=>booking.extras[k]).map(k => {
                                              const ex = DATA.extras.find(e=>e.id===k);
                                              const price = booking.type !== 'single' ? Math.floor(ex.price * 0.8) : ex.price;
                                              return (
                                                  <div key={k} className="flex justify-between items-center text-sm">
                                                      <span className={isDark ? 'text-zinc-300' : 'text-slate-600'}>{ex.label}</span>
                                                      <span className="font-bold text-blue-500">+ {DATA.currency} {price}</span>
                                                  </div>
                                              )
                                          })}
                                      </div>
                                  </div>
                              )}
                              <div className={`pt-8 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                  <div className="flex justify-between items-center mb-2">
                                      <span className={`text-sm ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Subtotal</span>
                                      <span className={`text-sm font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{DATA.currency} {financials.sub}</span>
                                  </div>
                                  {financials.disc > 0 && (
                                      <div className="flex justify-between items-center mb-2 text-emerald-500">
                                          <span className="text-sm">Desconto ({booking.appliedCoupon?.title})</span>
                                          <span className="text-sm font-bold">- {DATA.currency} {financials.disc}</span>
                                      </div>
                                  )}
                                  {financials.pixDisc > 0 && (
                                      <div className="flex justify-between items-center mb-2 text-blue-400">
                                          <span className="text-sm">Desconto Pix (5%)</span>
                                          <span className="text-sm font-bold">- {DATA.currency} {financials.pixDisc}</span>
                                      </div>
                                  )}
                                  <div className="flex justify-between items-center pt-6">
                                      <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Total</span>
                                      <div className="text-right">
                                          <span className="text-4xl font-black text-blue-500 tracking-tighter">{DATA.currency} {financials.total},00</span>
                                          <span className="text-xs font-bold text-blue-500 flex items-center justify-end gap-2 mt-2"><Icon name="Sparkles" size={14}/> +{estimatedXP} XP</span>
                                      </div>
                                  </div>
                              </div>
                           </div>
                        </div>
                        <div className="mt-8">
                           <SmartTimer isDark={isDark} />
                        </div>
                    </div>
                    <div className="space-y-8">
                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <h3 className={`text-xl font-light mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.coupon_section_title}</h3>
                            {user.coupons && user.coupons.length > 0 ? (
                                <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
                                    <div className="flex gap-3">
                                        {user.coupons.map(c => {
                                            const isApplied = booking.appliedCoupon?.id === c.id;
                                            return (
                                                <button 
                                                    key={c.id} 
                                                    onClick={() => setBooking(b => ({...b, appliedCoupon: isApplied ? null : c}))} 
                                                    className={`flex-shrink-0 px-6 py-4 rounded-xl border text-xs font-bold uppercase transition-all whitespace-nowrap active:scale-95 ${isApplied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-500 shadow-lg shadow-emerald-500/20' : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300')}`}
                                                >
                                                    {c.title}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <p className={`text-sm italic ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>{T.no_coupons}</p>
                            )}
                        </div>

                        <div className={`p-8 rounded-[2.5rem] border ${isDark ? 'bg-zinc-900/50 border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                            <h3 className={`text-xl font-light mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pagamento</h3>
                            <div className="grid grid-cols-1 gap-4">
                                {[{id:'pix', l:'Pix (Imediato)', i:'QrCode'}, {id:'card', l:'Cartão de Crédito', i:'CreditCard'}, {id:'money', l:'Dinheiro', i:'Banknote'}].map(p => (
                                    <button key={p.id} onClick={()=>setBooking(b=>({...b, payment: p.id}))} className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${booking.payment === p.id ? 'bg-blue-600/10 border-blue-500 text-blue-500' : (isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:bg-zinc-900' : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300')}`}>
                                            <Icon name={p.i} size={24} />
                                            <span className="text-sm font-bold uppercase tracking-wider">{p.l}</span>
                                            {booking.payment === p.id && <Icon name="Check" size={20} className="ml-auto text-blue-500" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Botão de Conduta / Termos - Alinhado */}
                        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${booking.termsAccepted ? 'bg-blue-500/10 border-blue-500/50' : (isDark ? 'border-zinc-800 hover:border-zinc-700' : 'border-slate-200 hover:border-slate-300')}`} onClick={() => setTermsOpen(true)}>
                            <div className="flex items-center gap-3">
                                <Icon name="ShieldCheck" className={`${isDark ? 'text-zinc-400' : 'text-slate-500'} shrink-0`} size={24}/>
                                <div className="flex flex-col">
                                    <span className={`text-sm font-bold ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{T.terms_title}</span>
                                    <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>Toque para ler</span>
                                </div>
                            </div>
                            <div onClick={(e) => { e.stopPropagation(); setBooking(b=>({...b, termsAccepted: !b.termsAccepted})); }} className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${booking.termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : (isDark ? 'border-zinc-700' : 'border-slate-300')}`}>
                                {booking.termsAccepted && <Icon name="Check" size={16} />}
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {step === 4 && (
             <div className={`fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl ${isDark ? 'bg-black/60' : 'bg-white/40'}`}>
                 <div className="animate-scale-in flex flex-col items-center justify-center text-center space-y-10 w-full max-w-lg">
                    <div className="relative">
                        <div className="w-36 h-36 bg-blue-600 rounded-[3rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 animate-bounce-slow relative z-10">
                            <Icon name="Check" size={64} className="text-white" />
                        </div>
                        <div className="absolute inset-0 bg-blue-500 blur-[80px] opacity-30 animate-pulse"></div>
                    </div>
                    <div>
                        <h2 className={`text-5xl font-light mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.success_title}</h2>
                        <p className={`text-lg max-w-sm mx-auto font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{T.success_sub}</p>
                    </div>
                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <Button variant="whatsapp" full size="xl" onClick={() => window.open(generateWhatsAppLink(), '_blank')} icon="MessageCircle">{T.whatsapp_btn}</Button>
                        <button onClick={() => setStep(0)} className={`text-sm font-bold uppercase tracking-widest transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'}`}>
                            {T.back_home}
                        </button>
                    </div>
                 </div>
             </div>
          )}
        </div>
      </main>

      {/* FOOTER IOS 2026 GLASS - OCULTO NO PASSO 4 */}
      {step !== 4 && (
        <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-6 pointer-events-none">
            <div className={`flex justify-between items-center p-2 rounded-[2.5rem] backdrop-blur-2xl border pointer-events-auto shadow-2xl transition-all duration-500 ${isDark ? 'bg-black/60 border-white/10 shadow-black/50' : 'bg-white/60 border-white/40 shadow-slate-300/50'}`}>
                <div className="flex items-center pl-2">
                    {step > 0 && (
                        <div className="flex gap-2 animate-slide-in">
                            <button onClick={() => setStep(0)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-slate-800 hover:bg-black/10'}`}><Icon name="Home" size={22}/></button>
                            <button onClick={() => setStep(step - 1)} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-black/5 text-slate-800 hover:bg-black/10'}`}><Icon name="ChevronLeft" size={22}/></button>
                        </div>
                    )}
                    {step === 0 && <div className="w-14 h-14"></div> /* Spacer */}
                </div>
                
                {/* Botão Próximo - Só aparece se houver item selecionado no passo 0 */}
                {(step > 0 || (step === 0 && booking.item)) && (
                    <button onClick={handleNextStep} className={`h-14 px-8 rounded-[2rem] bg-blue-600 text-white font-bold text-sm uppercase tracking-widest flex items-center gap-3 shadow-lg shadow-blue-600/30 transition-all active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed`}>
                        {step === 3 ? 'Finalizar' : 'Próximo'}
                        {!booking.item && <Icon name="ArrowRight" size={18} />}
                    </button>
                )}
            </div>
        </footer>
      )}

      {/* MODALS E POPUPS */}
      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${settingsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${settingsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setSettingsOpen(false)}></div>
         <div className={`relative w-full max-w-sm border rounded-[2.5rem] p-10 transform transition-transform duration-500 shadow-2xl ${settingsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="text-center mb-8">
                <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center mx-auto mb-6"><Icon name="Download" size={32} className="text-blue-500"/></div>
                <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.install_app}</h3>
                <p className={`text-base ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{T.install_desc}</p>
            </div>
            <div className={`p-5 rounded-2xl text-xs mb-8 leading-relaxed font-medium ${isDark ? 'bg-zinc-950 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>
                1. Toque no ícone de compartilhamento do navegador.<br/>
                2. Selecione "Adicionar à Tela de Início".
            </div>
            <Button full size="lg" onClick={()=>setSettingsOpen(false)}>Entendi</Button>
         </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-4 transition-all duration-500 pointer-events-none ${termsOpen ? 'opacity-100' : 'opacity-0'}`}>
         <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity ${termsOpen ? 'pointer-events-auto' : ''}`} onClick={()=>setTermsOpen(false)}></div>
         <div className={`relative w-full max-w-lg border rounded-[2.5rem] p-8 max-h-[85vh] overflow-y-auto transform transition-transform duration-500 shadow-2xl ${termsOpen ? 'translate-y-0 pointer-events-auto' : 'translate-y-full'} ${isDark ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-8"><h3 className={`text-2xl font-light ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.terms_title}</h3><button onClick={()=>setTermsOpen(false)} className={`p-3 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400 hover:text-white' : 'bg-slate-100 text-slate-500 hover:text-slate-800'}`}><Icon name="X" size={24}/></button></div>
            <div className="space-y-6">
                {T.terms_body.map((t,i)=>(<div key={i} className={`flex gap-5 p-6 rounded-3xl border ${isDark ? 'bg-zinc-950/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}><span className="font-bold text-blue-500 text-3xl opacity-40">{i+1}</span><p className={`text-sm leading-relaxed pt-1.5 font-light ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>{t.substring(3)}</p></div>))}
                <Button full size="lg" onClick={()=>setTermsOpen(false)} variant="primary">{T.terms_btn}</Button>
            </div>
         </div>
      </div>

      {levelUpPopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setLevelUpPopup(false)}></div>
            <div className="relative p-10 rounded-[2.5rem] text-center max-w-sm w-full animate-scale-in shadow-2xl border border-blue-500/20 bg-zinc-900">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2.5rem] pointer-events-none"><div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500 blur-[80px] opacity-20"></div></div>
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-500/30 animate-bounce-slow"><Icon name="Trophy" size={40} className="text-white" /></div>
                <h2 className="text-3xl font-light text-white mb-3">{T.popup_level_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-10">{T.popup_level_msg}</p>
                <Button full size="lg" onClick={()=>setLevelUpPopup(false)} icon="Ticket">{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      {welcomePopup && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={()=>setWelcomePopup(false)}></div>
            <div className="relative p-10 rounded-[2.5rem] text-center max-w-md w-full animate-scale-in shadow-2xl border border-white/10 bg-zinc-900">
                <div className="w-24 h-24 bg-zinc-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl border border-white/5 rotate-3"><Icon name="Gift" size={40} className="text-blue-500" /></div>
                <h2 className="text-3xl font-light text-white mb-4">{T.popup_welcome_title}</h2><p className="text-zinc-400 text-sm leading-relaxed mb-8">{T.popup_welcome_msg}</p>
                <div className="bg-zinc-950 p-6 rounded-2xl border border-dashed border-zinc-800 mb-8"><p className="text-xs uppercase font-bold text-zinc-500 mb-2">Seu Código:</p><p className="text-3xl font-mono font-bold text-blue-500 tracking-widest">BEMVINDO10</p></div>
                <Button full size="lg" variant="primary" onClick={()=>{
                    setWelcomePopup(false); 
                    setUser(u=>({...u, hasSeenWelcome: true}));
                    const welcomeCoupon = { id: 'BEMVINDO10', val: 10, title: '🎁 BEMVINDO10', code: 'BEMVINDO10' };
                    setBooking(b => ({...b, appliedCoupon: welcomeCoupon}));
                    setUser(prev => ({...prev, coupons: [...prev.coupons, welcomeCoupon]}));
                    addToast(T.toast_coupon_success, "success");
                }}>{T.popup_btn_coupon}</Button>
            </div>
        </div>
      )}

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');.scrollbar-hide::-webkit-scrollbar{display:none}.animate-fade-in{animation:fadeIn 0.8s ease-out}.animate-slide-in{animation:slideIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-slide-up{animation:slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0}.animate-scale-in{animation:scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0}.animate-bounce-slow{animation:bounce 3s infinite}.animate-slide-down{animation:slideDown 0.4s ease-out}.animate-pulse-slow{animation:pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite}.animate-spin-slow{animation:spin 3s linear infinite}.pb-safe{padding-bottom:env(safe-area-inset-bottom,32px)}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes slideUp{from{transform:translateY(40px);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes scaleIn{from{transform:scale(0.92);opacity:0}to{transform:scale(1);opacity:1}}@keyframes slideDown{from{transform:translateY(-30px);opacity:0}to{transform:translateY(0);opacity:1}}`}</style>
    </div>
  );
}
