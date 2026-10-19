import React, { useEffect, useMemo, useState } from "react";

/**
 * DEMO DE AGENDAMENTO — Marina (feminino) + Rafael (masculino)
 * Requisitos: React 18+; arquivo App.tsx ou App.jsx em um projeto Vite.
 * Não exige biblioteca de ícones nem Tailwind.
 *
 * IMPORTANTE PARA PRODUÇÃO:
 * - Troque telefone, chave Pix, Instagram, endereço e imagens em PROFILES.
 * - Os horários são demonstrativos e calculados no navegador. Para impedir dupla reserva,
 *   conecte a agenda a um backend/banco de dados antes de publicar.
 * - O botão final abre o WhatsApp com uma mensagem pronta; não confirma pagamento nem reserva sozinho.
 */

type Service = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  oldPrice?: number;
  tag?: string;
  image: string;
};

type Profile = {
  id: "feminino" | "masculino";
  name: string;
  role: string;
  headline: string;
  bio: string;
  phone: string;
  pix: string;
  instagram: string;
  address: string;
  theme: {
    ink: string;
    deep: string;
    accent: string;
    paper: string;
    muted: string;
    line: string;
    heroWash: string;
  };
  cover: string;
  avatar: string;
  services: Service[];
};

const IMG = {
  femaleHero:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85",
  femaleMassage:
    "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1000&q=85",
  facial:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=85",
  stones:
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1000&q=85",
  maleHero:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=85",
  maleMassage:
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85",
  recovery:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=85",
  feet:
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=85",
};

const PROFILES: Record<Profile["id"], Profile> = {
  feminino: {
    id: "feminino",
    name: "Marina Albuquerque",
    role: "Massoterapia & estética",
    headline: "Seu momento de pausa.\\nSeu corpo em equilíbrio.",
    bio: "Terapias manuais com cuidado, presença e técnica. Um espaço para desacelerar, aliviar tensões e voltar para a sua rotina se sentindo melhor.",
    phone: "5511999999999",
    pix: "123.456.789-00",
    instagram: "https://www.instagram.com/",
    address: "Studio Marina · endereço informado após a confirmação",
    theme: {
      ink: "#482C3D",
      deep: "#2B1825",
      accent: "#C58D9D",
      paper: "#FBF6F5",
      muted: "#8B777F",
      line: "#E9DCDD",
      heroWash: "rgba(55, 24, 39, .48)",
    },
    cover: IMG.femaleHero,
    avatar: "MA",
    services: [
      {
        id: "relaxante",
        name: "Massagem relaxante",
        description: "Movimentos fluidos e óleos aromáticos para desacelerar e aliviar a tensão do dia a dia.",
        duration: 60,
        price: 160,
        oldPrice: 190,
        tag: "Mais escolhido",
        image: IMG.femaleMassage,
      },
      {
        id: "drenagem",
        name: "Drenagem linfática",
        description: "Manobras suaves que auxiliam a circulação linfática e a sensação de leveza.",
        duration: 60,
        price: 180,
        oldPrice: 220,
        image: IMG.facial,
      },
      {
        id: "pedras",
        name: "Pedras quentes",
        description: "O calor acolhedor das pedras acompanha uma massagem profundamente relaxante.",
        duration: 90,
        price: 220,
        oldPrice: 260,
        image: IMG.stones,
      },
      {
        id: "facial",
        name: "Spa facial",
        description: "Um ritual de limpeza e hidratação para uma pele com aparência descansada.",
        duration: 50,
        price: 140,
        oldPrice: 180,
        image: IMG.facial,
      },
    ],
  },
  masculino: {
    id: "masculino",
    name: "Rafael Mendes",
    role: "Massoterapia & recovery",
    headline: "Recupere o corpo.\\nRetome o seu ritmo.",
    bio: "Atendimento individual para quem precisa aliviar sobrecargas, recuperar a mobilidade e reservar um tempo para cuidar de si.",
    phone: "5511999999999",
    pix: "rafael.mendes@pix.com.br",
    instagram: "https://www.instagram.com/",
    address: "Studio Mendes · endereço informado após a confirmação",
    theme: {
      ink: "#DCE7E3",
      deep: "#101D1B",
      accent: "#C5A16B",
      paper: "#152522",
      muted: "#A2B3AD",
      line: "#30423D",
      heroWash: "rgba(7, 21, 19, .56)",
    },
    cover: IMG.maleHero,
    avatar: "RM",
    services: [
      {
        id: "desportiva",
        name: "Massagem desportiva",
        description: "Foco em grupos musculares sobrecarregados e recuperação após esforço físico.",
        duration: 60,
        price: 190,
        oldPrice: 230,
        tag: "Para rotina ativa",
        image: IMG.recovery,
      },
      {
        id: "profunda",
        name: "Terapia muscular",
        description: "Pressão ajustada à sua necessidade para trabalhar pontos de tensão muscular.",
        duration: 60,
        price: 180,
        oldPrice: 220,
        image: IMG.maleMassage,
      },
      {
        id: "recovery",
        name: "Recovery completo",
        description: "Sessão estendida de cuidado corporal para desacelerar e recuperar o ritmo.",
        duration: 90,
        price: 250,
        oldPrice: 290,
        image: IMG.stones,
      },
      {
        id: "pescoco",
        name: "Costas, pescoço e ombros",
        description: "Cuidado direcionado às regiões que mais acumulam tensão na rotina.",
        duration: 40,
        price: 125,
        oldPrice: 150,
        image: IMG.feet,
      },
    ],
  },
};

const ADDONS = [
  { id: "esfoliacao", name: "Esfoliação corporal", price: 50 },
  { id: "escalda", name: "Escalda-pés aromático", price: 40 },
];

const money = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

function Icon({
  name,
  size = 20,
}: {
  name: "arrow" | "clock" | "check" | "pin" | "sparkle" | "chevron" | "close" | "instagram" | "calendar" | "whatsapp";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    sparkle: <><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    whatsapp: <><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" /><path d="M9 9c.5 2 2 3.5 4 4l1-1 2 1c-.3 1.5-1.5 2-3 1.5-3-1-5-3-5-5 0-1 .5-1.5 1-1.5l1 1Z" /></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function App() {
  const [profileId, setProfileId] = useState<Profile["id"]>("feminino");
  const [step, setStep] = useState<"home" | "service" | "details" | "review" | "done">("home");
  const [serviceId, setServiceId] = useState("relaxante");
  const [addons, setAddons] = useState<string[]>([]);
  const [location, setLocation] = useState<"studio" | "home">("studio");
  const [fullName, setFullName] = useState("");
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [payment, setPayment] = useState<"pix" | "card" | "cash">("pix");
  const [note, setNote] = useState("");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [error, setError] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState("");

  const profile = PROFILES[profileId];
  const service = profile.services.find((item) => item.id === serviceId) ?? profile.services[0];

  useEffect(() => {
    document.title = `${profile.name} · Agendamento demonstrativo`;
    setServiceId(profile.services[0].id);
    setAddons([]);
    setDate("");
    setTime("");
    setStep("home");
    setError("");
  }, [profileId]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const dates = useMemo(() => {
    const out: Date[] = [];
    const cursor = new Date();
    cursor.setHours(12, 0, 0, 0);
    while (out.length < 14) {
      if (cursor.getDay() !== 0) out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    return out;
  }, [profileId]);

  const times = useMemo(() => {
    if (!date) return [];
    const chosen = new Date(`${date}T12:00:00`);
    const today = dateKey(new Date()) === date;
    const now = new Date();
    const slots: string[] = [];
    for (let minutes = 9 * 60; minutes + service.duration <= 20 * 60; minutes += 30) {
      if (today && minutes < now.getHours() * 60 + now.getMinutes() + 120) continue;
      slots.push(`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`);
    }
    return slots;
  }, [date, service.duration]);

  const subtotal = service.price + addons.reduce((sum, id) => sum + (ADDONS.find((a) => a.id === id)?.price ?? 0), 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const pixDiscount = payment === "pix" ? Math.ceil((subtotal - discount) * 0.05) : 0;
  const total = Math.max(0, subtotal - discount - pixDiscount + (location === "home" && ["18:00", "18:30", "19:00", "19:30"].includes(time) ? 35 : 0));
  const deposit = Math.min(50, total);
  const remainder = Math.max(0, total - deposit);

  const resetBooking = () => {
    setStep("home");
    setFullName("");
    setCep("");
    setStreet("");
    setNumber("");
    setNeighborhood("");
    setComplement("");
    setDate("");
    setTime("");
    setNote("");
    setCoupon("");
    setCouponApplied(false);
    setAddons([]);
    setError("");
  };

  const fetchCep = async (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
    if (digits.length !== 8) return;
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setStreet(data.logradouro || "");
        setNeighborhood(data.bairro || "");
      } else setToast("CEP não encontrado. Preencha o endereço manualmente.");
    } catch {
      setToast("Não foi possível consultar o CEP. Preencha o endereço manualmente.");
    }
  };

  const continueToReview = () => {
    if (fullName.trim().split(/\s+/).filter(Boolean).length < 2) {
      setError("Informe nome e sobrenome para continuar.");
      return;
    }
    if (!date || !time) {
      setError("Escolha uma data e um horário.");
      return;
    }
    if (location === "home" && (!street.trim() || !number.trim() || !neighborhood.trim())) {
      setError("Para atendimento em casa, informe rua, número e bairro.");
      return;
    }
    setError("");
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openWhatsApp = () => {
    if (!/^55\d{10,11}$/.test(profile.phone)) {
      setToast("Configure um telefone válido em PROFILES antes de usar o WhatsApp.");
      return;
    }
    const formattedDate = new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    const where = location === "studio"
      ? profile.address
      : `${street}, ${number}${complement ? `, ${complement}` : ""} — ${neighborhood}${cep ? ` — CEP ${cep}` : ""}`;
    const message = [
      `Olá, ${profile.name.split(" ")[0]}! Gostaria de solicitar este agendamento demonstrativo.`,
      "",
      `Nome: ${fullName}`,
      `Sessão: ${service.name} (${service.duration} min)`,
      `Data: ${formattedDate}, às ${time}`,
      `Local: ${where}`,
      ...addons.map((id) => `Adicional: ${ADDONS.find((a) => a.id === id)?.name}`),
      note ? `Observação: ${note}` : "",
      `Total estimado: ${money(total)}`,
      `Sinal sugerido: ${money(deposit)}`,
      `Restante estimado: ${money(remainder)}`,
      `Forma de pagamento do restante: ${payment === "pix" ? "Pix" : payment === "card" ? "Cartão" : "Dinheiro"}`,
      "",
      "Por favor, confirme disponibilidade e dados para pagamento.",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${profile.phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setStep("done");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const themeStyle = {
    "--ink": profile.theme.ink,
    "--deep": profile.theme.deep,
    "--accent": profile.theme.accent,
    "--paper": profile.theme.paper,
    "--muted": profile.theme.muted,
    "--line": profile.theme.line,
    "--hero-wash": profile.theme.heroWash,
  } as React.CSSProperties;

  return (
    <div className={`site theme-${profileId}`} style={themeStyle}>
      <style>{styles}</style>
      {toast && <div className="toast" role="status">{toast}</div>}

      <div className="demo-switch">
        <span className="demo-label"><span className="live-dot" /> DEMONSTRAÇÃO DE EXPERIÊNCIA</span>
        <div className="switch-actions" aria-label="Alternar demonstração">
          <button className={profileId === "feminino" ? "switch-btn active" : "switch-btn"} onClick={() => setProfileId("feminino")}>Versão feminina</button>
          <button className={profileId === "masculino" ? "switch-btn active" : "switch-btn"} onClick={() => setProfileId("masculino")}>Versão masculina <Icon name="arrow" size={14} /></button>
        </div>
      </div>

      <header className="nav">
        <button className="brand-lockup" onClick={() => setStep("home")} aria-label="Voltar ao início">
          <span className="brand-mark"><Icon name="sparkle" size={21} /></span>
          <span><strong>{profile.name}</strong><small>{profile.role}</small></span>
        </button>
        <nav className="nav-links">
          <a href="#experiencia">Experiência</a>
          <a href="#sessoes">Sessões</a>
          <button className="nav-cta" onClick={() => setStep("service")}>Agendar <Icon name="arrow" size={16} /></button>
        </nav>
        <button className="mobile-menu" onClick={() => setProfileOpen(true)} aria-label="Abrir perfil"><span /><span /></button>
      </header>

      {step === "home" && (
        <>
          <main>
            <section className="hero">
              <img className="hero-image" src={profile.cover} alt={`Ambiente de bem-estar para ${profile.role}`} />
              <div className="hero-overlay" />
              <div className="hero-content">
                <div className="eyebrow light"><span /> UM TEMPO SÓ SEU</div>
                <h1>{profile.headline.split("\\n").map((line, i) => <React.Fragment key={line}>{i > 0 && <br />}<span className={i === 1 ? "serif-italic" : ""}>{line}</span></React.Fragment>)}</h1>
                <p>{profile.bio}</p>
                <div className="hero-actions">
                  <button className="button button-light" onClick={() => setStep("service")}>Encontrar minha sessão <Icon name="arrow" size={17} /></button>
                  <span className="hero-note"><Icon name="clock" size={15} /> Agendamento em cerca de 2 min</span>
                </div>
              </div>
              <div className="hero-side-note"><span>01 / 03</span><i /> CUIDADO COM INTENÇÃO</div>
              <div className="hero-bottom">
                <span><Icon name="pin" size={15} /> Studio ou atendimento em casa</span>
                <span>Presença. Técnica. Equilíbrio.</span>
              </div>
            </section>

            <section className="intro section-wrap" id="experiencia">
              <div className="intro-kicker"><span className="section-number">01</span><span>O CUIDADO COMEÇA AQUI</span></div>
              <div className="intro-grid">
                <h2>Mais do que uma pausa.<br /><em>Um jeito de se cuidar.</em></h2>
                <div className="intro-copy">
                  <p>Um atendimento pensado em você: da escolha da técnica ao ritmo da sessão, cada detalhe convida o corpo a desacelerar e a mente a respirar.</p>
                  <button className="text-link" onClick={() => setProfileOpen(true)}>Conheça a profissional <Icon name="arrow" size={16} /></button>
                </div>
              </div>
              <div className="benefits">
                <div><span className="benefit-icon"><Icon name="sparkle" size={21} /></span><strong>Atendimento individual</strong><p>Tempo e atenção dedicados a você.</p></div>
                <div><span className="benefit-icon"><Icon name="clock" size={21} /></span><strong>Ritmo sem pressa</strong><p>Sessões de 40 a 90 minutos.</p></div>
                <div><span className="benefit-icon"><Icon name="pin" size={21} /></span><strong>Onde for melhor</strong><p>No studio ou no conforto da sua casa.</p></div>
              </div>
            </section>

            <section className="services-section" id="sessoes">
              <div className="section-wrap">
                <div className="section-heading">
                  <div><div className="eyebrow"><span /> RITUAIS E TÉCNICAS</div><h2>Escolha o seu <em>momento.</em></h2></div>
                  <p>Encontre a sessão que combina com o que seu corpo precisa hoje.</p>
                </div>
                <div className="service-grid home-service-grid">
                  {profile.services.slice(0, 3).map((item, index) => (
                    <article className="service-card" key={item.id}>
                      <div className="service-image-wrap"><img src={item.image} alt={item.name} loading="lazy" /><span className="service-index">0{index + 1}</span>{item.tag && <span className="service-tag">{item.tag}</span>}</div>
                      <div className="service-card-body">
                        <div className="service-meta"><span><Icon name="clock" size={14} /> {item.duration} min</span><span>{money(item.price)}</span></div>
                        <h3>{item.name}</h3><p>{item.description}</p>
                        <button className="card-link" onClick={() => { setServiceId(item.id); setStep("service"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Escolher sessão <Icon name="arrow" size={16} /></button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="center-action"><button className="button button-dark" onClick={() => setStep("service")}>Ver todas as sessões <Icon name="arrow" size={17} /></button></div>
              </div>
            </section>

            <section className="quote-band">
              <div className="quote-mark">“</div><blockquote>Seu corpo acompanha você em tudo.<br /><em>Cuide dele com a mesma intenção.</em></blockquote>
              <span>UM CONVITE PARA DESACELERAR</span>
            </section>

            <section className="booking-banner section-wrap">
              <div><div className="eyebrow"><span /> SEU PRÓXIMO PASSO</div><h2>Reserve um espaço<br /><em>para você.</em></h2></div>
              <div className="booking-banner-right"><p>Escolha a sessão, encontre um horário e envie sua solicitação diretamente pelo WhatsApp.</p><button className="button button-dark" onClick={() => setStep("service")}>Agendar minha sessão <Icon name="arrow" size={17} /></button></div>
            </section>
          </main>
          <footer className="footer"><div className="footer-brand"><span className="brand-mark"><Icon name="sparkle" size={19} /></span><span><strong>{profile.name}</strong><small>{profile.role}</small></span></div><p>Feito para cuidar de você, com intenção.</p><a href={profile.instagram} target="_blank" rel="noreferrer"><Icon name="instagram" size={17} /> Instagram</a><span className="footer-copy">© {new Date().getFullYear()} · Página demonstrativa</span></footer>
        </>
      )}

      {step !== "home" && step !== "done" && (
        <main className="booking-page">
          <div className="booking-topline"><button className="back-link" onClick={() => setStep(step === "service" ? "home" : step === "details" ? "service" : "details")}><span>←</span> Voltar</button><span>AGENDAMENTO <b>·</b> PASSO {step === "service" ? "01" : step === "details" ? "02" : "03"} / 03</span></div>
          <div className="booking-layout">
            <div className="booking-main">
              <div className="eyebrow"><span /> {step === "service" ? "ENCONTRE SUA SESSÃO" : step === "details" ? "UM POUCO SOBRE VOCÊ" : "QUASE LÁ"}</div>
              <h1>{step === "service" ? <>Qual é o seu<br /><em>momento de cuidado?</em></> : step === "details" ? <>Quando e onde<br /><em>nos encontramos?</em></> : <>Confira os detalhes<br /><em>da sua sessão.</em></>}</h1>
              <div className="step-progress"><span className={step === "service" ? "current" : "complete"} /><span className={step === "details" ? "current" : step === "review" ? "complete" : ""} /><span className={step === "review" ? "current" : ""} /></div>

              {step === "service" && (
                <>
                  <p className="booking-lead">Escolha a técnica que faz sentido para você. Você pode revisar tudo antes de enviar a solicitação.</p>
                  <div className="booking-services">
                    {profile.services.map((item) => (
                      <button key={item.id} className={`booking-service ${serviceId === item.id ? "selected" : ""}`} onClick={() => setServiceId(item.id)}>
                        <img src={item.image} alt="" />
                        <span className="booking-service-copy"><strong>{item.name}</strong><small>{item.description}</small><span className="duration"><Icon name="clock" size={14} /> {item.duration} minutos</span></span>
                        <span className="booking-price"><strong>{money(item.price)}</strong>{item.oldPrice && <del>{money(item.oldPrice)}</del>}<span className="radio-dot">{serviceId === item.id && <i />}</span></span>
                      </button>
                    ))}
                  </div>
                  <div className="addons-box"><div><strong>Quer completar sua experiência?</strong><small>Adicionais opcionais à sua sessão.</small></div>{ADDONS.map((item) => <label className="addon-row" key={item.id}><input type="checkbox" checked={addons.includes(item.id)} onChange={(e) => setAddons(e.target.checked ? [...addons, item.id] : addons.filter((id) => id !== item.id))} /><span>{item.name}</span><b>+ {money(item.price)}</b></label>)}</div>
                  <div className="booking-next"><div><small>VALOR PARCIAL</small><strong>{money(subtotal)}</strong></div><button className="button button-dark" onClick={() => { setStep("details"); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Escolher horário <Icon name="arrow" size={17} /></button></div>
                </>
              )}

              {step === "details" && (
                <>
                  <p className="booking-lead">Só precisamos dos dados essenciais para solicitar seu horário.</p>
                  <div className="form-section"><label htmlFor="fullName">Nome completo</label><input id="fullName" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex.: Ana Souza" /></div>
                  <div className="form-section"><span className="form-label">Onde prefere ser atendido(a)?</span><div className="segmented"><button className={location === "studio" ? "chosen" : ""} onClick={() => setLocation("studio")}><Icon name="pin" size={17} /> No studio</button><button className={location === "home" ? "chosen" : ""} onClick={() => setLocation("home")}><Icon name="check" size={17} /> Em casa</button></div>{location === "studio" && <p className="field-hint">O endereço será informado na confirmação do agendamento.</p>}</div>
                  {location === "home" && <div className="address-fields"><p className="field-hint">Atendimento em domicílio pode ter taxa de deslocamento em horários de pico.</p><div className="form-section"><label htmlFor="cep">CEP (opcional)</label><input id="cep" inputMode="numeric" autoComplete="postal-code" value={cep} onChange={(e) => void fetchCep(e.target.value)} placeholder="00000-000" /></div><div className="form-section"><label htmlFor="street">Rua ou avenida</label><input id="street" autoComplete="address-line1" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Nome da rua" /></div><div className="two-fields"><div className="form-section"><label htmlFor="number">Número</label><input id="number" value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Nº" /></div><div className="form-section"><label htmlFor="complement">Complemento</label><input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} placeholder="Apto, casa..." /></div></div><div className="form-section"><label htmlFor="neighborhood">Bairro</label><input id="neighborhood" autoComplete="address-level3" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Seu bairro" /></div></div>}
                  <div className="form-section"><span className="form-label">Escolha o dia</span><div className="date-scroller">{dates.map((day) => { const key = dateKey(day); const selected = date === key; return <button key={key} className={`date-tile ${selected ? "chosen" : ""}`} onClick={() => { setDate(key); setTime(""); }}><small>{day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "")}</small><strong>{day.getDate()}</strong><small>{day.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}</small></button>; })}</div></div>
                  {date && <div className="form-section"><span className="form-label">Horários disponíveis</span><div className="time-grid">{times.length ? times.map((slot) => <button key={slot} className={time === slot ? "chosen" : ""} onClick={() => setTime(slot)}>{slot}</button>) : <p className="field-hint">Não há horários restantes para hoje. Escolha outro dia.</p>}</div></div>}
                  {error && <p className="form-error">{error}</p>}
                  <div className="booking-next"><div><small>DURAÇÃO · VALOR PARCIAL</small><strong>{service.duration} min · {money(subtotal)}</strong></div><button className="button button-dark" onClick={continueToReview}>Revisar pedido <Icon name="arrow" size={17} /></button></div>
                </>
              )}

              {step === "review" && (
                <>
                  <p className="booking-lead">Confira as informações. O pedido só será confirmado pela profissional após verificar a disponibilidade.</p>
                  <div className="review-card">
                    <div className="review-service"><img src={service.image} alt="" /><div><small>SUA SESSÃO</small><h3>{service.name}</h3><p><Icon name="clock" size={14} /> {service.duration} minutos</p></div></div>
                    <div className="review-line"><span>Nome</span><strong>{fullName}</strong></div>
                    <div className="review-line"><span>Data</span><strong>{new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })}</strong></div>
                    <div className="review-line"><span>Horário</span><strong>{time} – {`${String(Math.floor((Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) + service.duration) / 60).padStart(2, "0")}:${String((Number(time.slice(0, 2)) * 60 + Number(time.slice(3)) + service.duration) % 60).padStart(2, "0")}`}</strong></div>
                    <div className="review-line"><span>Local</span><strong>{location === "studio" ? "Studio" : `${street}, ${number} · ${neighborhood}`}</strong></div>
                    {addons.map((id) => <div className="review-line" key={id}><span>{ADDONS.find((a) => a.id === id)?.name}</span><strong>{money(ADDONS.find((a) => a.id === id)?.price ?? 0)}</strong></div>)}
                    <div className="coupon-row"><input aria-label="Cupom demonstrativo" value={coupon} onChange={(e) => { setCoupon(e.target.value); setCouponApplied(false); }} placeholder="Cupom de demonstração (opcional)" /><button onClick={() => { if (coupon.trim().toUpperCase() === "BEMVINDO10") { setCouponApplied(true); setToast("Cupom de demonstração aplicado."); } else { setCouponApplied(false); setToast("Use BEMVINDO10 para testar o desconto."); } }}>Aplicar</button></div>
                    {couponApplied && <div className="review-line discount-line"><span>Desconto de demonstração</span><strong>− {money(discount)}</strong></div>}
                    {location === "home" && ["18:00", "18:30", "19:00", "19:30"].includes(time) && <div className="review-line"><span>Taxa de deslocamento</span><strong>+ R$ 35,00</strong></div>}
                    <div className="payment-options"><span className="form-label">Forma de pagamento do restante</span><div className="segmented"><button className={payment === "pix" ? "chosen" : ""} onClick={() => setPayment("pix")}>Pix · −5%</button><button className={payment === "card" ? "chosen" : ""} onClick={() => setPayment("card")}>Cartão</button><button className={payment === "cash" ? "chosen" : ""} onClick={() => setPayment("cash")}>Dinheiro</button></div></div>
                    <div className="form-section note-field"><label htmlFor="note">Observações (opcional)</label><textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Preferências ou informações importantes..." rows={3} /></div>
                    <div className="total-block"><span>Total estimado</span><strong>{money(total)}</strong><div><span>Sinal sugerido via Pix</span><b>{money(deposit)}</b></div><div><span>Restante no dia</span><b>{money(remainder)}</b></div></div>
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <p className="privacy-note"><Icon name="check" size={16} /> Os dados serão incluídos apenas na mensagem que você decidir enviar pelo WhatsApp.</p>
                  <div className="booking-next"><div><small>TOTAL ESTIMADO</small><strong>{money(total)}</strong></div><button className="button button-dark" onClick={openWhatsApp}>Solicitar pelo WhatsApp <Icon name="arrow" size={17} /></button></div>
                </>
              )}
            </div>
            <aside className="booking-aside">
              <div className="aside-image"><img src={profile.cover} alt="" /><div><span className="aside-avatar">{profile.avatar}</span><strong>{profile.name}</strong><small>{profile.role}</small></div></div>
              <div className="aside-content"><span className="aside-label">SEU RESUMO</span><h3>{service.name}</h3><p>{service.description}</p><div className="aside-detail"><Icon name="clock" size={16} /><span>{service.duration} minutos</span></div><div className="aside-detail"><Icon name="pin" size={16} /><span>{location === "studio" ? "Atendimento no studio" : "Atendimento em domicílio"}</span></div><div className="aside-divider" /><div className="aside-price"><span>Valor parcial</span><strong>{money(subtotal)}</strong></div><small className="aside-footnote">Valores e horários desta página são demonstrativos.</small></div>
              <div className="aside-reassurance"><Icon name="check" size={17} /><span><strong>Você decide com tranquilidade.</strong><small>Confira tudo antes de enviar sua solicitação.</small></span></div>
            </aside>
          </div>
        </main>
      )}

      {step === "done" && (
        <main className="done-page"><div className="done-icon"><Icon name="check" size={34} /></div><div className="eyebrow"><span /> SOLICITAÇÃO PREPARADA</div><h1>Seu próximo momento<br /><em>começa com cuidado.</em></h1><p>O WhatsApp foi aberto com os detalhes do pedido, se o navegador permitiu. Aguarde a confirmação de disponibilidade da profissional antes de considerar o horário reservado.</p><div className="done-summary"><span>{service.name}</span><strong>{money(total)}</strong><small>{date ? new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" }) : ""} · {time}</small></div><button className="button button-dark" onClick={resetBooking}>Voltar ao início <Icon name="arrow" size={17} /></button><button className="text-link done-secondary" onClick={() => setStep("review")}>Ver resumo novamente</button></main>
      )}

      {profileOpen && <div className="modal-backdrop" onClick={() => setProfileOpen(false)}><section className="profile-modal" role="dialog" aria-modal="true" aria-label="Perfil profissional" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setProfileOpen(false)} aria-label="Fechar"><Icon name="close" /></button><div className="modal-avatar">{profile.avatar}</div><div className="eyebrow"><span /> SOBRE A PROFISSIONAL</div><h2>{profile.name}</h2><p className="modal-role">{profile.role}</p><p>{profile.bio}</p><a className="button button-dark modal-instagram" href={profile.instagram} target="_blank" rel="noreferrer"><Icon name="instagram" size={17} /> Ver Instagram <Icon name="arrow" size={16} /></a><small className="modal-warning">Perfil ilustrativo. Personalize os dados antes de publicar.</small></section></div>}

      <div className="mobile-bottom-cta">{step === "home" ? <button className="button button-dark" onClick={() => setStep("service")}>Agendar sessão <Icon name="arrow" size={17} /></button> : step === "service" ? <button className="button button-dark" onClick={() => setStep("details")}>Escolher horário <Icon name="arrow" size={17} /></button> : null}</div>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');
:root{font-family:'DM Sans',sans-serif;font-synthesis:none;text-rendering:optimizeLegibility;-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink)}button,input,textarea{font:inherit}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid var(--accent);outline-offset:3px}a{color:inherit;text-decoration:none}.site{--content:1180px;background:var(--paper);color:var(--ink);min-height:100vh;overflow:hidden;transition:background .35s,color .35s}.theme-masculino .nav,.theme-masculino .demo-switch{background:#152522}.demo-switch{height:43px;background:#F1E5E7;color:#5C3948;display:flex;align-items:center;justify-content:space-between;padding:0 max(5.2vw,22px);gap:16px;font-size:10px;letter-spacing:.13em;font-weight:700}.demo-label{display:flex;align-items:center;gap:9px}.live-dot,.eyebrow span{width:6px;height:6px;border-radius:50%;background:var(--accent);display:inline-block}.switch-actions{display:flex;gap:5px}.switch-btn{border:1px solid transparent;background:transparent;border-radius:30px;padding:7px 12px;color:inherit;font-size:10px;letter-spacing:.04em;display:flex;align-items:center;gap:6px}.switch-btn.active{background:#fff;color:#4B2B3B;border-color:#ead7dc}.theme-masculino .switch-btn.active{background:#2C403A;color:#E5EEE9;border-color:#53655F}.nav{height:84px;padding:0 max(5.2vw,22px);display:flex;align-items:center;justify-content:space-between;background:var(--paper);position:relative;z-index:5;border-bottom:1px solid var(--line)}.brand-lockup,.footer-brand{display:flex;align-items:center;gap:12px;border:0;background:none;color:var(--ink);text-align:left;padding:0}.brand-mark{width:42px;height:42px;border:1px solid var(--accent);border-radius:50%;display:grid;place-items:center;color:var(--accent)}.brand-lockup strong,.footer-brand strong{display:block;font:500 16px 'Playfair Display',serif;letter-spacing:-.02em}.brand-lockup small,.footer-brand small{display:block;color:var(--muted);font-size:10px;letter-spacing:.1em;text-transform:uppercase;margin-top:4px}.nav-links{display:flex;align-items:center;gap:34px;font-size:12px;color:var(--muted)}.nav-links a:hover{color:var(--ink)}.nav-cta{display:flex;align-items:center;gap:14px;background:var(--ink);color:var(--paper);border:0;padding:14px 19px;font-size:12px}.mobile-menu{display:none}.hero{position:relative;min-height:620px;height:min(72vw,730px);max-height:790px;background:#45303b;color:#fff;overflow:hidden}.hero-image,.hero-overlay{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.hero-image{animation:heroReveal 1.1s cubic-bezier(.2,.7,.2,1) both}.hero-overlay{background:linear-gradient(90deg,var(--hero-wash) 0%,rgba(20,17,19,.28) 53%,rgba(20,17,19,.08) 100%),linear-gradient(0deg,rgba(10,10,10,.35),transparent 28%)}.hero-content{position:absolute;top:50%;left:max(10.2vw,28px);transform:translateY(-49%);max-width:680px;animation:rise .7s .12s both}.eyebrow{display:flex;align-items:center;gap:10px;font-size:10px;font-weight:700;letter-spacing:.19em;color:var(--muted)}.eyebrow.light{color:rgba(255,255,255,.85)}.hero h1,.booking-main h1,.done-page h1{font:400 clamp(46px,6vw,82px)/1.06 'Playfair Display',serif;letter-spacing:-.045em;margin:25px 0 20px}.hero h1 .serif-italic,.intro h2 em,.section-heading h2 em,.booking-banner h2 em,.booking-main h1 em,.done-page h1 em{font-style:italic;color:var(--accent)}.hero-content>p{font-size:14px;line-height:1.9;color:rgba(255,255,255,.84);max-width:430px}.hero-actions{display:flex;align-items:center;gap:22px;margin-top:30px;flex-wrap:wrap}.button{display:inline-flex;align-items:center;justify-content:center;gap:18px;min-height:51px;padding:0 21px;border:1px solid transparent;font-size:12px;font-weight:700;transition:transform .2s,background .2s,color .2s,border-color .2s}.button:hover{transform:translateY(-2px)}.button-light{background:#FBF6F5;color:#482C3D}.button-dark{background:var(--ink);color:var(--paper)}.button-dark:hover{background:var(--deep)}.hero-note{display:flex;align-items:center;gap:8px;font-size:11px;color:rgba(255,255,255,.8)}.hero-side-note{position:absolute;right:5.2vw;top:45%;writing-mode:vertical-rl;display:flex;align-items:center;gap:13px;font-size:9px;letter-spacing:.18em;color:rgba(255,255,255,.8)}.hero-side-note i{height:48px;width:1px;background:rgba(255,255,255,.6)}.hero-bottom{position:absolute;bottom:24px;left:5.2vw;right:5.2vw;display:flex;justify-content:space-between;font-size:10px;letter-spacing:.07em;color:rgba(255,255,255,.85)}.hero-bottom span{display:flex;align-items:center;gap:8px}.section-wrap{max-width:var(--content);margin:auto;padding-left:34px;padding-right:34px}.intro{padding-top:108px;padding-bottom:104px}.intro-kicker{display:flex;align-items:center;gap:14px;font-size:10px;letter-spacing:.17em;color:var(--muted);font-weight:700}.section-number{font:italic 19px 'Playfair Display',serif;color:var(--accent)}.intro-grid{display:grid;grid-template-columns:1.2fr .8fr;gap:70px;align-items:end;margin-top:27px}.intro h2,.section-heading h2,.booking-banner h2{font:400 clamp(36px,4.2vw,54px)/1.14 'Playfair Display',serif;letter-spacing:-.04em;margin:0}.intro-copy{max-width:430px;padding-bottom:5px}.intro-copy p,.booking-banner-right p{font-size:13px;line-height:1.95;color:var(--muted);margin:0 0 20px}.text-link,.card-link{border:0;background:none;color:var(--ink);font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:12px;padding:5px 0;border-bottom:1px solid var(--accent)}.benefits{display:grid;grid-template-columns:repeat(3,1fr);gap:30px;border-top:1px solid var(--line);margin-top:78px;padding-top:27px}.benefits>div{display:grid;grid-template-columns:43px 1fr;column-gap:14px;align-items:center}.benefit-icon{width:40px;height:40px;border:1px solid var(--line);color:var(--accent);display:grid;place-items:center;grid-row:span 2}.benefits strong{font:500 16px 'Playfair Display',serif}.benefits p{font-size:11px;color:var(--muted);margin:6px 0 0}.services-section{background:color-mix(in srgb,var(--paper),var(--accent) 5%);padding:94px 0 91px}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:35px}.section-heading .eyebrow{margin-bottom:19px}.section-heading h2{font-size:48px}.section-heading>p{max-width:280px;font-size:12px;line-height:1.8;color:var(--muted);margin:0 0 4px}.service-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:23px}.service-card{background:var(--paper);border:1px solid var(--line);min-width:0;transition:transform .3s,box-shadow .3s}.service-card:hover{transform:translateY(-5px);box-shadow:0 18px 40px rgba(20,20,20,.07)}.service-image-wrap{height:245px;position:relative;overflow:hidden;background:var(--line)}.service-image-wrap img{width:100%;height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.2,.7,.2,1)}.service-card:hover img{transform:scale(1.045)}.service-index{position:absolute;top:14px;left:14px;color:#fff;font:italic 20px 'Playfair Display',serif;text-shadow:0 1px 6px #000}.service-tag{position:absolute;right:12px;top:12px;background:var(--paper);color:var(--ink);padding:7px 9px;font-size:9px}.service-card-body{padding:21px 21px 23px}.service-meta{display:flex;justify-content:space-between;gap:10px;color:var(--muted);font-size:10px}.service-meta span:first-child{display:flex;align-items:center;gap:6px}.service-meta span:last-child{font-weight:700;color:var(--ink)}.service-card h3{font:500 22px 'Playfair Display',serif;margin:17px 0 9px}.service-card p{font-size:11px;line-height:1.8;color:var(--muted);min-height:60px;margin:0 0 18px}.card-link{width:100%;justify-content:space-between;padding:13px 0 0;border-bottom:0;border-top:1px solid var(--line)}.center-action{display:flex;justify-content:center;margin-top:38px}.quote-band{background:var(--deep);color:var(--paper);text-align:center;padding:75px 20px 70px}.quote-mark{font:80px/.7 'Playfair Display',serif;color:var(--accent)}.quote-band blockquote{font:400 clamp(27px,3.7vw,42px)/1.35 'Playfair Display',serif;margin:24px 0 22px}.quote-band blockquote em{color:var(--accent)}.quote-band>span{font-size:9px;letter-spacing:.2em;color:var(--muted)}.booking-banner{display:flex;justify-content:space-between;align-items:center;gap:50px;padding-top:88px;padding-bottom:90px}.booking-banner .eyebrow{margin-bottom:20px}.booking-banner-right{max-width:380px}.booking-banner-right p{margin-bottom:20px}.footer{padding:28px max(5.2vw,22px);border-top:1px solid var(--line);display:flex;align-items:center;gap:25px}.footer p{font-size:10px;color:var(--muted);margin-right:auto}.footer>a{display:flex;align-items:center;gap:7px;font-size:11px}.footer-copy{font-size:9px;color:var(--muted)}.booking-page{max-width:1180px;margin:auto;padding:35px 34px 100px;animation:rise .4s both}.booking-topline{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:24px;color:var(--muted);font-size:9px;letter-spacing:.15em}.booking-topline b{color:var(--accent)}.back-link{border:0;background:none;color:var(--ink);font-size:12px;letter-spacing:0;display:flex;gap:9px;align-items:center}.back-link span{font-size:19px}.booking-layout{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(280px,.75fr);gap:70px;padding-top:48px;align-items:start}.booking-main h1{font-size:clamp(42px,4.8vw,61px);margin:18px 0}.step-progress{display:flex;gap:7px;margin:27px 0 25px}.step-progress span{height:3px;width:43px;background:var(--line)}.step-progress .current,.step-progress .complete{background:var(--accent)}.booking-lead{font-size:12px;line-height:1.8;color:var(--muted);max-width:530px;margin:0 0 25px}.booking-services{display:grid;gap:12px}.booking-service{width:100%;display:flex;align-items:center;gap:15px;text-align:left;padding:13px;background:transparent;border:1px solid var(--line);color:var(--ink);transition:border .2s,background .2s}.booking-service.selected{border-color:var(--accent);background:color-mix(in srgb,var(--accent),transparent 93%)}.booking-service>img{width:88px;height:91px;object-fit:cover;flex-shrink:0}.booking-service-copy{display:flex;flex-direction:column;gap:6px;min-width:0}.booking-service-copy>strong{font:500 17px 'Playfair Display',serif}.booking-service-copy>small{font-size:10px;line-height:1.6;color:var(--muted)}.duration{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted)}.booking-price{margin-left:auto;align-self:stretch;display:flex;flex-direction:column;align-items:flex-end;justify-content:center;gap:5px;min-width:84px}.booking-price strong{font-size:12px}.booking-price del{font-size:10px;color:var(--muted)}.radio-dot{width:16px;height:16px;border:1px solid var(--muted);border-radius:50%;display:grid;place-items:center;margin-top:4px}.selected .radio-dot{border-color:var(--accent)}.radio-dot i{width:8px;height:8px;background:var(--accent);border-radius:50%}.addons-box{border:1px solid var(--line);padding:18px;margin-top:18px}.addons-box>div:first-child{display:flex;flex-direction:column;gap:5px;margin-bottom:13px}.addons-box>div:first-child strong{font:500 16px 'Playfair Display',serif}.addons-box small{font-size:10px;color:var(--muted)}.addon-row{display:flex;align-items:center;gap:10px;border-top:1px solid var(--line);padding:13px 0;font-size:11px}.addon-row input{accent-color:var(--ink);width:15px;height:15px}.addon-row b{margin-left:auto;font-size:10px}.booking-next{display:flex;justify-content:space-between;align-items:center;gap:15px;border-top:1px solid var(--line);margin-top:25px;padding-top:20px}.booking-next>div{display:flex;flex-direction:column;gap:6px}.booking-next small{font-size:9px;color:var(--muted);letter-spacing:.12em}.booking-next strong{font:500 22px 'Playfair Display',serif}.booking-aside{position:sticky;top:25px;border:1px solid var(--line);background:color-mix(in srgb,var(--paper),var(--accent) 4%)}.aside-image{height:190px;position:relative;overflow:hidden}.aside-image:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.72),transparent 80%)}.aside-image>img{width:100%;height:100%;object-fit:cover}.aside-image>div{position:absolute;bottom:17px;left:18px;right:18px;z-index:1;display:grid;grid-template-columns:40px 1fr;column-gap:10px;align-items:center;color:#fff}.aside-avatar{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;border:1px solid var(--accent);font:italic 13px 'Playfair Display',serif;grid-row:span 2;background:rgba(20,20,20,.25)}.aside-image strong{font:500 15px 'Playfair Display',serif}.aside-image small{font-size:9px;color:rgba(255,255,255,.75);margin-top:3px}.aside-content{padding:23px}.aside-label{font-size:9px;letter-spacing:.16em;color:var(--muted)}.aside-content h3{font:500 22px 'Playfair Display',serif;margin:12px 0 8px}.aside-content>p{font-size:10px;line-height:1.8;color:var(--muted);margin:0 0 19px}.aside-detail{display:flex;align-items:center;gap:9px;font-size:10px;margin:12px 0;color:var(--muted)}.aside-detail svg{color:var(--accent)}.aside-divider{height:1px;background:var(--line);margin:20px 0 15px}.aside-price{display:flex;justify-content:space-between;align-items:center;font-size:11px}.aside-price strong{font:500 23px 'Playfair Display',serif}.aside-footnote{display:block;margin-top:17px;color:var(--muted);font-size:9px;line-height:1.6}.aside-reassurance{display:flex;gap:10px;padding:15px 19px;border-top:1px solid var(--line);color:var(--accent)}.aside-reassurance span{display:flex;flex-direction:column;gap:4px}.aside-reassurance strong{font-size:10px;color:var(--ink)}.aside-reassurance small{font-size:9px;line-height:1.5;color:var(--muted)}.form-section{margin:22px 0}.form-section>label,.form-label{display:block;font-size:11px;font-weight:700;margin-bottom:9px;color:var(--ink)}.form-section input,.form-section textarea,.coupon-row input{width:100%;border:1px solid var(--line);border-radius:0;background:transparent;color:var(--ink);padding:14px 15px;font-size:12px;min-height:48px}.form-section input::placeholder,.form-section textarea::placeholder,.coupon-row input::placeholder{color:var(--muted);opacity:.8}.segmented{display:flex;gap:7px}.segmented button{flex:1;min-height:45px;padding:9px 12px;border:1px solid var(--line);background:transparent;color:var(--muted);font-size:11px;display:flex;align-items:center;justify-content:center;gap:7px}.segmented button.chosen{border-color:var(--accent);background:color-mix(in srgb,var(--accent),transparent 90%);color:var(--ink)}.field-hint{font-size:10px;line-height:1.6;color:var(--muted);margin:9px 0 0}.address-fields{border:1px solid var(--line);padding:16px;margin-top:12px}.address-fields .form-section{margin:12px 0}.two-fields{display:grid;grid-template-columns:.6fr 1.4fr;gap:10px}.date-scroller{display:flex;gap:8px;overflow-x:auto;padding:2px 2px 9px;scrollbar-width:thin}.date-tile{min-width:63px;padding:12px 7px;border:1px solid var(--line);background:transparent;color:var(--ink);display:flex;flex-direction:column;align-items:center;gap:7px}.date-tile small{font-size:9px;color:var(--muted);text-transform:capitalize}.date-tile strong{font:500 21px 'Playfair Display',serif}.date-tile.chosen{border-color:var(--accent);background:var(--ink);color:var(--paper)}.date-tile.chosen small{color:var(--paper)}.time-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.time-grid button{min-height:43px;border:1px solid var(--line);background:transparent;color:var(--ink);font-size:11px}.time-grid button.chosen{background:var(--ink);border-color:var(--ink);color:var(--paper)}.form-error{font-size:11px;color:#c84a4a;background:rgba(200,74,74,.08);padding:12px}.review-card{border:1px solid var(--line);padding:20px}.review-service{display:flex;align-items:center;gap:14px;padding-bottom:17px;border-bottom:1px solid var(--line);margin-bottom:6px}.review-service img{width:78px;height:78px;object-fit:cover}.review-service small{font-size:9px;letter-spacing:.13em;color:var(--muted)}.review-service h3{font:500 19px 'Playfair Display',serif;margin:6px 0}.review-service p{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);margin:0}.review-line{display:flex;justify-content:space-between;gap:15px;padding:12px 0;border-bottom:1px solid var(--line);font-size:11px}.review-line>span{color:var(--muted)}.review-line>strong{text-align:right;font-weight:600}.discount-line strong{color:#4d9a75}.coupon-row{display:flex;gap:8px;margin:18px 0}.coupon-row input{min-width:0;font-size:10px}.coupon-row button{padding:0 12px;border:1px solid var(--accent);background:transparent;color:var(--ink);font-size:10px}.payment-options{margin-top:22px}.payment-options .form-label{margin-bottom:10px}.note-field{margin:18px 0 0}.total-block{background:color-mix(in srgb,var(--accent),transparent 91%);padding:17px;margin-top:18px;display:grid;grid-template-columns:1fr auto;gap:11px;font-size:11px}.total-block>span{align-self:center}.total-block>strong{font:500 25px 'Playfair Display',serif}.total-block div{grid-column:span 2;display:flex;justify-content:space-between;color:var(--muted);font-size:10px}.total-block div b{color:var(--ink)}.privacy-note{display:flex;align-items:flex-start;gap:8px;font-size:10px;line-height:1.7;color:var(--muted);margin:18px 0}.privacy-note svg{flex-shrink:0;color:var(--accent)}.done-page{max-width:660px;margin:0 auto;text-align:center;padding:100px 25px 130px;animation:rise .45s both}.done-icon{margin:0 auto 28px;width:65px;height:65px;border-radius:50%;display:grid;place-items:center;background:var(--ink);color:var(--paper)}.done-page .eyebrow{justify-content:center}.done-page h1{font-size:clamp(43px,6vw,66px)}.done-page>p{font-size:12px;line-height:1.9;color:var(--muted);max-width:490px;margin:0 auto 25px}.done-summary{border:1px solid var(--line);padding:20px;margin:25px auto;display:grid;grid-template-columns:1fr auto;text-align:left;gap:8px;max-width:430px}.done-summary span{font:500 16px 'Playfair Display',serif}.done-summary strong{font-size:14px}.done-summary small{grid-column:span 2;color:var(--muted);font-size:10px}.done-secondary{margin:20px auto 0}.modal-backdrop{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;padding:20px;animation:fade .2s}.profile-modal{position:relative;background:var(--paper);color:var(--ink);width:min(100%,440px);padding:38px;animation:rise .3s}.modal-close{position:absolute;top:16px;right:16px;border:0;background:transparent;color:var(--ink)}.modal-avatar{width:64px;height:64px;border:1px solid var(--accent);border-radius:50%;display:grid;place-items:center;font:italic 22px 'Playfair Display',serif;margin-bottom:25px}.profile-modal h2{font:500 30px 'Playfair Display',serif;margin:15px 0 4px}.modal-role{font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted)}.profile-modal>p:not(.modal-role){font-size:12px;line-height:1.9;color:var(--muted);margin:20px 0}.modal-instagram{width:100%;margin-top:5px}.modal-warning{display:block;font-size:9px;line-height:1.7;color:var(--muted);margin-top:14px}.toast{position:fixed;z-index:90;top:18px;left:50%;transform:translateX(-50%);background:var(--ink);color:var(--paper);padding:13px 19px;font-size:11px;box-shadow:0 12px 30px #0002;max-width:90vw}.mobile-bottom-cta{display:none}
@keyframes rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}@keyframes fade{from{opacity:0}to{opacity:1}}@keyframes heroReveal{from{transform:scale(1.035);opacity:.7}to{transform:scale(1);opacity:1}}
@media(max-width:900px){.hero{height:680px;min-height:560px}.hero-content{left:7vw;max-width:600px}.hero h1{font-size:clamp(48px,8vw,72px)}.hero-side-note{right:4vw}.section-wrap{padding-left:25px;padding-right:25px}.intro-grid{gap:35px}.service-image-wrap{height:200px}.service-card-body{padding:16px}.service-card h3{font-size:20px}.booking-layout{gap:30px;grid-template-columns:minmax(0,1.3fr) minmax(260px,.8fr)}.booking-page{padding-left:24px;padding-right:24px}.booking-service>img{width:72px;height:80px}.booking-service{gap:10px;padding:10px}.booking-service-copy>strong{font-size:15px}.booking-price{min-width:65px}.booking-price strong{font-size:11px}}
@media(max-width:680px){.demo-switch{height:auto;min-height:48px;padding:8px 14px;gap:8px;letter-spacing:.07em}.demo-label{font-size:8px;max-width:125px;line-height:1.5}.switch-actions{gap:2px}.switch-btn{font-size:9px;padding:7px 8px}.nav{height:70px;padding:0 18px}.brand-mark{width:36px;height:36px}.brand-lockup strong{font-size:14px}.brand-lockup small{font-size:8px}.nav-links{display:none}.mobile-menu{display:flex;flex-direction:column;gap:5px;border:0;background:transparent;padding:8px}.mobile-menu span{width:23px;height:1px;background:var(--ink)}.hero{height:calc(82svh - 110px);min-height:550px;max-height:730px}.hero-image{object-position:58% center}.hero-overlay{background:linear-gradient(90deg,rgba(20,15,18,.65),rgba(20,15,18,.22)),linear-gradient(0deg,rgba(10,10,10,.35),transparent 45%)}.hero-content{left:25px;right:25px;top:47%;transform:translateY(-45%)}.hero h1{font-size:clamp(46px,12vw,66px);margin:22px 0 16px}.hero-content>p{font-size:12px;max-width:340px}.hero-actions{align-items:flex-start;flex-direction:column;gap:14px;margin-top:25px}.button{min-height:49px;padding:0 17px}.hero-side-note{display:none}.hero-bottom{left:22px;right:22px;bottom:18px;font-size:8px;letter-spacing:.02em}.hero-bottom span:last-child{display:none}.section-wrap{padding-left:22px;padding-right:22px}.intro{padding-top:70px;padding-bottom:70px}.intro-grid{grid-template-columns:1fr;gap:18px;margin-top:23px}.intro h2{font-size:39px}.intro-copy p{font-size:12px}.benefits{grid-template-columns:1fr;gap:17px;margin-top:38px;padding-top:23px}.benefits>div{grid-template-columns:40px 1fr}.benefits strong{font-size:15px}.benefits p{margin-top:3px}.services-section{padding:65px 0}.section-heading{display:block;margin-bottom:25px}.section-heading h2{font-size:39px}.section-heading>p{margin-top:13px}.home-service-grid{grid-template-columns:1fr;gap:15px}.service-card{display:grid;grid-template-columns:40% 60%}.service-image-wrap{height:100%;min-height:220px}.service-card-body{padding:17px 14px}.service-card h3{font-size:19px;margin:13px 0 8px}.service-card p{font-size:10px;min-height:0;margin-bottom:12px}.service-meta{font-size:9px;flex-wrap:wrap}.service-tag{font-size:8px;right:7px;top:7px}.service-index{left:8px;top:8px}.card-link{font-size:10px;gap:5px}.center-action{margin-top:25px}.quote-band{padding:59px 18px}.quote-band blockquote{font-size:29px}.booking-banner{display:block;padding-top:65px;padding-bottom:68px}.booking-banner h2{font-size:43px}.booking-banner-right{margin-top:20px}.footer{padding:25px 20px 75px;display:grid;grid-template-columns:1fr auto;gap:15px}.footer p{grid-column:span 2;grid-row:2;margin:0}.footer-copy{grid-column:span 2}.booking-page{padding:22px 18px 90px}.booking-topline{padding-bottom:18px;font-size:8px}.booking-layout{display:flex;flex-direction:column;padding-top:30px;gap:30px}.booking-main{width:100%}.booking-main h1{font-size:43px;margin:16px 0}.booking-lead{font-size:11px}.booking-aside{position:static;width:100%;order:-1;display:grid;grid-template-columns:110px 1fr}.aside-image{height:100%;min-height:170px}.aside-image>div{left:9px;right:8px;bottom:10px;grid-template-columns:29px 1fr;gap:6px}.aside-avatar{width:29px;height:29px;font-size:10px}.aside-image strong{font-size:11px}.aside-image small{font-size:7px}.aside-content{padding:14px}.aside-content h3{font-size:18px}.aside-content>p{font-size:9px;margin-bottom:12px}.aside-detail{font-size:9px;margin:9px 0}.aside-price strong{font-size:19px}.aside-reassurance{grid-column:span 2;padding:11px 14px}.aside-footnote{font-size:8px}.booking-aside .aside-label{font-size:8px}.booking-service>img{width:64px;height:75px}.booking-service-copy>strong{font-size:14px}.booking-service-copy>small{font-size:9px}.booking-price{min-width:54px}.booking-price strong{font-size:10px}.booking-price del{font-size:9px}.booking-next{position:sticky;bottom:0;background:var(--paper);z-index:4;padding:12px 0 max(12px,env(safe-area-inset-bottom));margin-top:22px}.booking-next strong{font-size:19px}.booking-next .button{font-size:10px;gap:8px;padding:0 12px}.date-scroller{margin-right:-18px;padding-right:18px}.time-grid{grid-template-columns:repeat(4,1fr);gap:6px}.time-grid button{font-size:10px}.review-card{padding:14px}.review-line{font-size:10px}.coupon-row input{padding:10px}.coupon-row button{font-size:9px;padding:0 8px}.total-block>strong{font-size:22px}.done-page{padding:70px 22px 110px}.done-page h1{font-size:43px}.profile-modal{padding:28px 24px}.mobile-bottom-cta{display:block;position:fixed;bottom:0;left:0;right:0;z-index:20;padding:11px 18px max(11px,env(safe-area-inset-bottom));background:color-mix(in srgb,var(--paper),transparent 5%);border-top:1px solid var(--line);backdrop-filter:blur(12px)}.mobile-bottom-cta .button{width:100%}.booking-page~.mobile-bottom-cta{display:none}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}
`;

export default App;
