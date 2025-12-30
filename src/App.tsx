
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  background-color: white; /* Ensure the iframe has a white background */
                }

                
              </style>
                        </head>
                        <body>
                            

              <script>
                              // @ts-nocheck
import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import {
  Heart,
  Bell,
  Menu,
  X,
  ChevronRight,
  Check,
  Plus,
  Minus,
  ArrowLeft,
  Star,
  Sparkles,
  Award,
  MapPin,
  Clock,
  Music,
  Calendar,
  User,
  Phone,
  Home,
  Truck,
  CreditCard,
  Gift,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const CONFIG = {
  PRICES: {
    MACA: 20,
    AROMA_FULL: 10,
    AROMA_DISCOUNT: 5,
    UPGRADE_PCT: 0.5,
  },
};

const services = [
  {
    id: "masculina",
    name: "Massagem Masculina",
    type: "sensual",
    description:
      "Massagem Relaxante + Toques corpo a corpo (de cueca) com finalização Lingam manual completa.",
    labelDuration: "60 min",
    minutes: 60,
    basePrice: 140,
    highlight: "MAIS PEDIDA 🔥",
    ratings: 5.0,
    reviews: 310,
    details: [
      "Relaxante + Body-to-Body",
      "Massagista de Cueca",
      "Lingam / Finalização Manual",
      "Alívio Completo",
    ],
  },
  {
    id: "relaxante",
    name: "Massagem Relaxante",
    type: "relax",
    description:
      "Corpo inteiro: Costas, braços, mãos, pernas, coxas, pés, peito e frente. (Sem toques íntimos).",
    labelDuration: "60 min",
    minutes: 60,
    basePrice: 90,
    ratings: 4.9,
    reviews: 142,
    details: ["Corpo Inteiro", "Sem Glúteos/Íntimo", "Toque Terapêutico", "Relaxamento Puro"],
  },
];

const locations = [
  {
    id: "motel",
    label: "Suíte Privada (Motel)",
    sublabel: "Vou com você",
    fee: 75,
    allowsTableChoice: false,
    estimatedTravelTime: "10-15 min",
    isMotel: true,
  },
  {
    id: "santa-fe",
    label: "Santa Fé do Sul",
    sublabel: "No conforto do seu lar",
    fee: 40,
    allowsTableChoice: true,
    estimatedTravelTime: "15-20 min",
    isUber: true,
  },
  {
    id: "outras-cidades",
    label: "Cidades Vizinhas",
    sublabel: "Atendimento na região",
    fee: 0,
    allowsTableChoice: false,
    estimatedTravelTime: "A combinar",
    isPending: true,
  },
];

const CARD_RATES = [
  0, 0, 0.0499, 0.06, 0.07, 0.08, 0.09, 0.1, 0.105, 0.11, 0.115, 0.119, 0.1238,
];

const SYSTEM_COUPONS = {
  BEMVINDO: { code: "BEMVINDO", type: "percent", value: 10, desc: "10% OFF (1ª Vez)" },
  MASCULINA: { code: "MASCULINA", type: "percent", value: 10, desc: "10% OFF Especial" },
};

const formatCurrency = (val) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

const triggerHaptic = () => {
  if (navigator.vibrate) navigator.vibrate(5);
};

const sanitizeInput = (input) => {
  const tempDiv = document.createElement("div");
  tempDiv.textContent = input;
  return tempDiv.innerHTML;
};

const validateFields = (selection, user) => {
  const errors = [];
  if (!user.name || user.name.trim() === "") errors.push("Nome é obrigatório.");
  if (!selection.date) errors.push("Selecione uma data válida.");
  if (!selection.time) errors.push("Selecione um horário válido.");
  if (!selection.location) errors.push("Escolha um local de atendimento.");
  if (!selection.paymentMethod) errors.push("Selecione um método de pagamento.");
  return errors;
};

const generateBookingId = () => `#${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

const App = () => {
  const [user, setUser] = useState({ name: "", isAdult: false });
  const [step, setStep] = useState("home");
  const [selection, setSelection] = useState({
    service: null,
    location: null,
    date: null,
    time: "",
    useTable: null,
    city: "",
    coupon: null,
    upgrade: false,
    music: null,
    aroma: false,
    paymentMethod: null,
    installments: 1,
  });
  const [loyalty, setLoyalty] = useState({
    level: "Bronze",
    totalSpent: 0,
    inventory: [],
    notifications: [],
  });

  const handleWhatsApp = () => {
    triggerHaptic();
    const errors = validateFields(selection, user);
    if (errors.length > 0) {
      alert(`Por favor, corrija os seguintes erros:\n\n${errors.join("\n")}`);
      return;
    }

    if (selection.coupon && !loyalty.inventory.includes(selection.coupon.code)) {
      alert("Cupom inválido ou expirado.");
      setSelection((prev) => ({ ...prev, coupon: null }));
      return;
    }

    const bookingId = generateBookingId();
    const msg = `
*NOVO PEDIDO: ${bookingId}*
👤 ${sanitizeInput(user.name)} (Liberado p/ Massagem)
📅 ${selection.date.toLocaleDateString("pt-BR")} às ${selection.time}
💆 ${sanitizeInput(selection.service.name)} ${
      selection.upgrade ? "*(+30 MIN UPGRADE)*" : ""
    }
📍 ${sanitizeInput(selection.location.label)}
*DETALHES:*
• Serviço Base: ${formatCurrency(selection.service.basePrice)}
${
  selection.upgrade
    ? `\n➕ +30 Minutos (+${formatCurrency(
        selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT
      )})`
    : ""
}
${
  selection.useTable
    ? `\n➕ Maca Portátil (+${formatCurrency(CONFIG.PRICES.MACA)})`
    : ""
}
${
  selection.aroma
    ? `\n➕ Aromaterapia (${
        getAromaPrice() === 0 ? "GRÁTIS VIP" : `+${formatCurrency(getAromaPrice())}`
      })`
    : ""
}
${
  selection.location.fee > 0
    ? `\n➕ Taxa ${
        selection.location.isMotel
          ? "Hotéis"
          : selection.location.isUber
          ? "Uber"
          : "Deslocamento"
      }: ${formatCurrency(selection.location.fee)}`
    : ""
}
${
  selection.coupon
    ? `\n➖ Desconto (${selection.coupon.code}): -${formatCurrency(
        selection.coupon.type === "percent"
          ? calcBaseTotal() * (selection.coupon.value / 100)
          : selection.coupon.value
      )}`
    : ""
}
------------------------------
💰 *TOTAL FINAL: ${formatCurrency(calcFinalPrice())}*
(Pagamento: ${
      selection.paymentMethod === "credit_card"
        ? `${selection.installments}x Cartão`
        : selection.paymentMethod === "pix"
        ? "Pix"
        : "Dinheiro"
    })
------------------------------
🎵 Vibe: ${selection.music}`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=5517991360413&text=${encodeURIComponent(
      msg
    )}`;
    window.open(whatsappUrl, "_blank");
    setStep("success");
  };

  const calcBaseTotal = () => {
    if (!selection.service) return 0;
    let total = selection.service.basePrice;

    // Upgrade Percentage
    if (selection.upgrade) total += selection.service.basePrice * CONFIG.PRICES.UPGRADE_PCT;

    // Table Fee
    if (selection.useTable) total += CONFIG.PRICES.MACA;

    // Aroma
    if (selection.aroma) total += getAromaPrice();

    // Location Fee
    if (selection.location?.fee) total += selection.location.fee;

    return total;
  };

  const calcFinalPrice = () => {
    let baseTotal = calcBaseTotal();

    // Coupon Discount
    if (selection.coupon) {
      if (selection.coupon.type === "percent") {
        baseTotal -= baseTotal * (selection.coupon.value / 100);
      } else {
        baseTotal -= selection.coupon.value;
      }
    }

    // Card Rate
    if (selection.paymentMethod === "credit_card") {
      const rate = CARD_RATES[selection.installments] || 0;
      baseTotal /= 1 - rate;
    }

    return baseTotal;
  };

  const getAromaPrice = () => {
    if (loyalty.level === "Ouro") return 0;
    if (loyalty.level === "Prata") return CONFIG.PRICES.AROMA_DISCOUNT;
    return CONFIG.PRICES.AROMA_FULL;
  };

  return (
    <div>
      {/* Renderizar etapas do formulário */}
      {step === "home" && <HomeScreen setStep={setStep} />}
      {step === "services" && (
        <ServiceSelection services={services} setSelection={setSelection} setStep={setStep} />
      )}
      {step === "configure" && (
        <ConfigurationScreen
          selection={selection}
          setSelection={setSelection}
          setStep={setStep}
        />
      )}
      {step === "success" && (
        <SuccessScreen handleWhatsApp={handleWhatsApp} loyalty={loyalty} />
      )}
    </div>
  );
};

const HomeScreen = ({ setStep }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold text-white mb-8">Agendamento Online</h1>
    <button
      onClick={() => setStep("services")}
      className="p-4 bg-[#0A84FF] text-white rounded-full font-bold hover:bg-[#0972E6]"
    >
      Iniciar Agendamento
    </button>
  </div>
);

const ServiceSelection = ({ services, setSelection, setStep }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold text-white mb-6">Escolha um Serviço</h2>
    <div className="space-y-4">
      {services.map((service) => (
        <button
          key={service.id}
          onClick={() => {
            setSelection((prev) => ({ ...prev, service }));
            setStep("configure");
          }}
          className="p-4 w-full bg-[#1C1C1E] text-white rounded-lg hover:bg-[#2C2C2E]"
        >
          <h3 className="text-lg font-bold">{service.name}</h3>
          <p className="text-sm text-gray-400">{service.description}</p>
          <p className="text-base font-bold">{formatCurrency(service.basePrice)}</p>
        </button>
      ))}
    </div>
  </div>
);

const ConfigurationScreen = ({ selection, setSelection, setStep }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold text-white mb-6">Configure o Agendamento</h2>
    <div className="space-y-4">
      {/* Data e Hora */}
      <InlineDateSelector
        selectedDate={selection.date}
        selectedTime={selection.time}
        onSelect={(date, time) => setSelection((prev) => ({ ...prev, date, time }))}
      />

      {/* Local de Atendimento */}
      <LocationSelector
        locations={locations}
        selectedLocation={selection.location}
        onSelect={(location) => setSelection((prev) => ({ ...prev, location }))}
      />

      {/* Extras */}
      <ExtrasSelector
        selection={selection}
        setSelection={setSelection}
      />

      {/* Cupons */}
      <CouponInventory
        inventory={loyalty.inventory}
        appliedCoupon={selection.coupon}
        onApply={(coupon) => setSelection((prev) => ({ ...prev, coupon }))}
        onRemove={() => setSelection((prev) => ({ ...prev, coupon: null }))}
        onAddManual={(code) => setLoyalty((prev) => ({ ...prev, inventory: [...prev.inventory, code] }))}
      />

      {/* Pagamento */}
      <PaymentSelector
        selection={selection}
        setSelection={setSelection}
      />

      {/* Botão Finalizar */}
      <button
        onClick={() => setStep("success")}
        className="p-4 bg-[#0A84FF] text-white rounded-full font-bold hover:bg-[#0972E6]"
      >
        Finalizar Agendamento
      </button>
    </div>
  </div>
);

const SuccessScreen = ({ handleWhatsApp, loyalty }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold text-white mb-6">Pedido Enviado!</h2>
    <p className="text-gray-400 mb-8">Verifique seu WhatsApp.</p>
    <LevelProgressBar data={loyalty} />
  </div>
);

const InlineDateSelector = ({ selectedDate, selectedTime, onSelect }) => {
  const DAYS_TO_SHOW = 16;
  const days = [];
  const now = new Date();

  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const day = new Date(now);
    day.setDate(now.getDate() + i);
    days.push(day);
  }

  return (
    <div className="w-full select-none">
      <div className="flex justify-between items-end mb-4 px-1">
        {days.map((d) => (
          <div key={d.toISOString()} className="text-center">
            <span className="text-xs text-gray-400">
              {d.toLocaleDateString("pt-BR", { weekday: "short" })}
            </span>
            <span className="block text-lg font-bold">{d.getDate()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const LocationSelector = ({ locations, selectedLocation, onSelect }) => (
  <div className="space-y-3">
    {locations.map((location) => (
      <button
        key={location.id}
        onClick={() => onSelect(location)}
        className={`p-4 w-full rounded-lg ${
          selectedLocation?.id === location.id ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
        } text-white hover:bg-[#2C2C2E]`}
      >
        <h3 className="text-lg font-bold">{location.label}</h3>
        <p className="text-sm text-gray-400">{location.sublabel}</p>
        <p className="text-base font-bold">{formatCurrency(location.fee)}</p>
      </button>
    ))}
  </div>
);

const ExtrasSelector = ({ selection, setSelection }) => (
  <div className="space-y-3">
    <button
      onClick={() => setSelection((prev) => ({ ...prev, upgrade: !prev.upgrade }))}
      className={`p-4 w-full rounded-lg ${
        selection.upgrade ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      +30 Minutos Upgrade
    </button>
    <button
      onClick={() => setSelection((prev) => ({ ...prev, useTable: !prev.useTable }))}
      className={`p-4 w-full rounded-lg ${
        selection.useTable ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      Maca Portátil
    </button>
    <button
      onClick={() => setSelection((prev) => ({ ...prev, aroma: !prev.aroma }))}
      className={`p-4 w-full rounded-lg ${
        selection.aroma ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      Aromaterapia
    </button>
  </div>
);

const CouponInventory = ({ inventory, appliedCoupon, onApply, onRemove, onAddManual }) => {
  const [manualCode, setManualCode] = useState("");

  const handleManualAdd = () => {
    const codeUpper = manualCode.toUpperCase().trim();
    if (codeUpper && SYSTEM_COUPONS[codeUpper]) {
      if (inventory.includes(codeUpper)) {
        alert("Você já tem este cupom!");
      } else {
        onAddManual(codeUpper);
        setManualCode("");
        triggerHaptic();
      }
    } else {
      alert("Cupom inválido ou expirado.");
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <div className="flex gap-2 mb-3">
        <input
          value={manualCode}
          onChange={(e) => setManualCode(e.target.value)}
          placeholder="Possui um código?"
          className="w-full custom-input text-white text-[15px] rounded-[14px] p-3.5 placeholder:text-gray-600 bg-[#1C1C1E]"
        />
        <button
          onClick={handleManualAdd}
          className="bg-[#2C2C2E] border border-white/10 text-white px-5 rounded-[14px] font-bold text-[13px] hover:bg-[#3A3A3C] transition-colors"
        >
          Adicionar
        </button>
      </div>
      {inventory.map((code) => {
        const coupon = SYSTEM_COUPONS[code];
        const isApplied = appliedCoupon?.code === coupon.code;
        return (
          <button
            key={coupon.code}
            onClick={() => {
              triggerHaptic();
              isApplied ? onRemove() : onApply(coupon);
            }}
            className={`p-4 w-full rounded-lg ${
              isApplied ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
            } text-white hover:bg-[#2C2C2E]`}
          >
            {coupon.desc}
          </button>
        );
      })}
    </div>
  );
};

const PaymentSelector = ({ selection, setSelection }) => (
  <div className="space-y-3">
    <button
      onClick={() => setSelection((prev) => ({ ...prev, paymentMethod: "credit_card" }))}
      className={`p-4 w-full rounded-lg ${
        selection.paymentMethod === "credit_card" ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      Cartão de Crédito
    </button>
    <button
      onClick={() => setSelection((prev) => ({ ...prev, paymentMethod: "pix" }))}
      className={`p-4 w-full rounded-lg ${
        selection.paymentMethod === "pix" ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      Pix
    </button>
    <button
      onClick={() => setSelection((prev) => ({ ...prev, paymentMethod: "cash" }))}
      className={`p-4 w-full rounded-lg ${
        selection.paymentMethod === "cash" ? "bg-[#0A84FF]" : "bg-[#1C1C1E]"
      } text-white hover:bg-[#2C2C2E]`}
    >
      Dinheiro
    </button>
  </div>
);

const LevelProgressBar = ({ data }) => (
  <div className="w-full bg-[#1C1C1E] rounded-full overflow-hidden">
    <div
      className="h-4 bg-[#0A84FF]"
      style={{ width: `${Math.min((data.totalSpent / 1000) * 100, 100)}%` }}
    ></div>
  </div>
);

ReactDOM.render(<App />, document.getElementById("root"));


              </script>
                        </body>
                        </html>
                    
