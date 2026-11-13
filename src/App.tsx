"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCodeStyling, { DotType, CornerSquareType } from "qr-code-styling";
import { 
  Download, 
  Sparkles, 
  Lock, 
  RefreshCw, 
  BarChart3, 
  Check, 
  Upload, 
  Link as LinkIcon, 
  MessageCircle, 
  Wifi,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function LandingPageQRVivo() {
  // Estados do Gerador
  const [qrType, setQrType] = useState<"url" | "whatsapp" | "wifi">("url");
  const [url, setUrl] = useState("https://seusite.com.br");
  const [whatsPhone, setWhatsPhone] = useState("11999999999");
  const [whatsMsg, setWhatsMsg] = useState("Olá! Vi o QR Code e gostaria de mais informações.");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");

  // Estados de Estilização
  const [fgColor, setFgColor] = useState("#0f172a");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [dotStyle, setDotStyle] = useState<DotType>("rounded");
  const [cornerStyle, setCornerStyle] = useState<CornerSquareType>("extra-rounded");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [isDynamic, setIsDynamic] = useState<boolean>(false);

  // Estados de Checkout / Paywall
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutReason, setCheckoutReason] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);

  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  // Monta a string final baseada na aba escolhida
  const getQrData = () => {
    if (qrType === "whatsapp") {
      const cleanPhone = whatsPhone.replace(/\D/g, "");
      return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(whatsMsg)}`;
    }
    if (qrType === "wifi") {
      return `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
    }
    return url || "https://qrvivo.com.br";
  };

  // Inicializa a instância do QR Code apenas no cliente
  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 260,
      height: 260,
      type: "svg",
      data: getQrData(),
      image: logoUrl,
      dotsOptions: {
        color: fgColor,
        type: dotStyle,
      },
      cornersSquareOptions: {
        color: fgColor,
        type: cornerStyle,
      },
      backgroundOptions: {
        color: bgColor,
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 6,
        imageSize: 0.35,
      },
    });

    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      qrCode.current.append(qrRef.current);
    }
  }, []);

  // Atualiza o QR Code em tempo real
  useEffect(() => {
    if (!qrCode.current) return;
    qrCode.current.update({
      data: getQrData(),
      image: logoUrl,
      dotsOptions: { color: fgColor, type: dotStyle },
      cornersSquareOptions: { color: fgColor, type: cornerStyle },
      backgroundOptions: { color: bgColor },
    });
  }, [qrType, url, whatsPhone, whatsMsg, wifiSsid, wifiPass, fgColor, bgColor, dotStyle, cornerStyle, logoUrl]);

  // Upload de logo local (preview instantâneo)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Download Gratuito (PNG)
  const handleFreeDownload = () => {
    if (isDynamic || logoUrl) {
      openPaywall("Para baixar QR Codes com Logo personalizada ou Link Editável (Dinâmico), ative o plano Pro.");
      return;
    }
    qrCode.current?.download({ name: "qrvivo-codigo", extension: "png" });
  };

  // Abre o modal de pagamento
  const openPaywall = (reason: string) => {
    setCheckoutReason(reason);
    setCheckoutOpen(true);
  };

  // Chamada para API do Mercado Pago (Vamos criar no Passo 3)
  const handleMercadoPagoCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail) return;
    setIsLoadingCheckout(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: customerEmail,
          qrData: getQrData(),
          qrType,
        }),
      });
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point; // Redireciona para o Mercado Pago
      } else {
        alert("Erro ao iniciar pagamento. Verifique a configuração da API.");
      }
    } catch (err) {
      console.error(err);
      alert("Falha de conexão com o checkout.");
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              QR
            </div>
            <span>QRVivo</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#como-funciona" className="hover:text-slate-900">Por que Dinâmico?</a>
            <a href="#precos" className="hover:text-slate-900">Preços</a>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => openPaywall("Acesse seu painel para gerenciar seus QR Codes.")}>
              Entrar
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => openPaywall("Comece a criar QR Codes editáveis e rastreáveis agora.")}>
              Criar Conta Pro
            </Button>
          </div>
        </div>
      </header>

      {/* HERO + GERADOR INTERATIVO */}
      <section className="pt-12 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="outline" className="mb-4 border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-1">
              Pare de jogar material impresso no lixo
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
              Crie QR Codes que você pode <span className="text-emerald-600">mudar o link</span> mesmo depois de imprimir.
            </h1>
            <p className="text-lg text-slate-600">
              Personalize com sua logo, acompanhe quantos clientes escanearam em tempo real e atualize cardápios, panfletos ou embalagens sem gastar 1 centavo com gráfica novamente.
            </p>
          </div>

          {/* CONTAINER DO GERADOR */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            
            {/* COLUNA ESQUERDA: CONTROLES */}
            <div className="lg:col-span-7 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 space-y-6">
              <div>
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 block">
                  1. Escolha o destino do seu QR Code
                </Label>
                <Tabs value={qrType} onValueChange={(v) => setQrType(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-100">
                    <TabsTrigger value="url" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" /> Site / Link
                    </TabsTrigger>
                    <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" /> WhatsApp
                    </TabsTrigger>
                    <TabsTrigger value="wifi" className="flex items-center gap-2">
                      <Wifi className="w-4 h-4" /> Wi-Fi Local
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="mt-4 space-y-3">
                    <Label htmlFor="url-input">Cole o link de destino (Instagram, Cardápio, Site)</Label>
                    <Input
                      id="url-input"
                      placeholder="https://..."
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="h-12 text-base"
                    />
                  </TabsContent>

                  <TabsContent value="whatsapp" className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Número com DDD</Label>
                        <Input
                          placeholder="11999999999"
                          value={whatsPhone}
                          onChange={(e) => setWhatsPhone(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Mensagem automática</Label>
                        <Input
                          placeholder="Olá, vim pelo QR Code..."
                          value={whatsMsg}
                          onChange={(e) => setWhatsMsg(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="wifi" className="mt-4 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label>Nome da Rede (SSID)</Label>
                        <Input
                          placeholder="WiFi_Clientes"
                          value={wifiSsid}
                          onChange={(e) => setWifiSsid(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Senha do Wi-Fi</Label>
                        <Input
                          placeholder="senha123"
                          value={wifiPass}
                          onChange={(e) => setWifiPass(e.target.value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* OPÇÃO DE QR DINÂMICO (GATILHO DE VENDA) */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">Ativar Link Dinâmico (Editável + Métricas)</span>
                    <Badge className="bg-emerald-600 text-[10px]">PRO</Badge>
                  </div>
                  <p className="text-xs text-slate-600">
                    Permite alterar o link de destino no futuro sem precisar reimprimir o QR Code e conta quantas pessoas escanearam.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isDynamic}
                  onChange={(e) => setIsDynamic(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 mt-1 cursor-pointer"
                />
              </div>

              {/* PERSONALIZAÇÃO VISUAL */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <Label className="text-xs uppercase tracking-wider text-slate-500 font-bold block">
                  2. Personalize com a cara da sua marca
                </Label>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-slate-600 mb-1.5 block">Cor dos Pontos</Label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0"
                      />
                      <span className="text-xs font-mono text-slate-600">{fgColor}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 mb-1.5 block">Cor de Fundo</Label>
                    <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1.5">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-7 h-7 rounded cursor-pointer border-0"
                      />
                      <span className="text-xs font-mono text-slate-600">{bgColor}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 mb-1.5 block">Estilo</Label>
                    <select
                      value={dotStyle}
                      onChange={(e) => setDotStyle(e.target.value as DotType)}
                      className="w-full h-10 rounded-lg border border-slate-200 text-xs px-2 bg-white"
                    >
                      <option value="rounded">Arredondado</option>
                      <option value="dots">Bolinhas</option>
                      <option value="square">Quadrado Clássico</option>
                      <option value="classy-rounded">Moderno</option>
                    </select>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-600 mb-1.5 block">Logo no Centro</Label>
                    <label className="flex items-center justify-center gap-1.5 h-10 px-3 border border-dashed border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      {logoUrl ? "Trocar" : "Enviar"}
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA: PREVIEW AO VIVO E DOWNLOAD */}
            <div className="lg:col-span-5 bg-slate-50/80 p-6 md:p-8 flex flex-col items-center justify-between">
              <div className="w-full flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1.5 font-medium text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Preview em tempo real
                </span>
                {logoUrl && (
                  <button onClick={() => setLogoUrl("")} className="text-red-500 hover:underline">
                    Remover logo
                  </button>
                )}
              </div>

              {/* MOLDURA DO QR CODE */}
              <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80 flex flex-col items-center">
                <div ref={qrRef} className="overflow-hidden rounded-lg" />
                <span className="mt-3 text-[11px] font-mono text-slate-400">
                  {isDynamic ? "qrvivo.com.br/r/seu-codigo" : "Link Direto Estático"}
                </span>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="w-full space-y-3 mt-6">
                <Button 
                  onClick={() => openPaywall("Ative o QR Code Dinâmico com rastreamento de cliques e download em alta resolução para gráfica.")}
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base shadow-lg shadow-emerald-600/20"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Salvar Dinâmico + Baixar Alta Resolução
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleFreeDownload} className="w-full text-xs">
                    <Download className="w-3.5 h-3.5 mr-1.5" />
                    Baixar PNG Simples
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => openPaywall("Arquivos vetoriais SVG e PDF evitam que o QR Code fique borrado na impressão.")}
                    className="w-full text-xs text-slate-600"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    Vetor Gráfica (SVG)
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROVA DE DOR (ANCORAGEM FINANCEIRA) */}
      <section id="como-funciona" className="py-20 bg-white border-t border-slate-200 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              O barato que sai caro na gráfica
            </h2>
            <p className="text-slate-600">
              Geradores gratuitos criam códigos fixos. Se o seu número de WhatsApp mudar ou o link do cardápio sair do ar, todo o seu material impresso vira lixo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">O Prejuízo do QR Grátis</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Imprimir 1.000 panfletos ou adesivos de mesa custa entre R$ 350 e R$ 800. Um link quebrado obriga você a pagar tudo de novo.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Edição em 5 Segundos</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Com o QRVivo, você entra no painel, troca o destino do link e o mesmo código impresso na mesa do cliente passa a abrir a página nova na hora.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg mb-2">Saiba o que Funciona</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Descubra quantas pessoas escanearam cada panfleto, qual horário tem mais movimento e qual campanha realmente traz clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREÇO ÚNICO E DIRETO */}
      <section id="precos" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center shadow-2xl">
            <div className="space-y-4">
              <Badge className="bg-emerald-500 text-slate-950 font-bold">Plano Único Profissional</Badge>
              <h2 className="text-3xl font-bold">Menos que o custo de uma única reimpressão.</h2>
              <p className="text-slate-300 text-sm">
                Sem planos confusos ou taxas escondidas. Crie QR Codes ilimitados para o seu negócio e cancele quando quiser com 1 clique.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-200 pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> QR Codes Dinâmicos Ilimitados
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Logo personalizada no centro do código
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Download vetorial (SVG/PDF) para gráfica
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Contador de scans e métricas de acesso
                </li>
              </ul>
            </div>

            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center space-y-6">
              <div>
                <span className="text-slate-400 text-sm">Assinatura Mensal</span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-lg text-slate-400">R$</span>
                  <span className="text-5xl font-extrabold text-white">29,90</span>
                  <span className="text-slate-400 text-sm">/mês</span>
                </div>
                <span className="text-xs text-emerald-400 mt-2 block">Liberação imediata via Pix ou Cartão</span>
              </div>

              <Button 
                onClick={() => openPaywall("Assine o Plano Profissional e libere todos os recursos agora.")}
                className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base"
              >
                Liberar Acesso Agora <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-slate-400">
                Pagamento processado com segurança pelo Mercado Pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL DE CHECKOUT MERCADO PAGO */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Ativar QRVivo Pro</DialogTitle>
            <DialogDescription className="text-slate-600 pt-1">
              {checkoutReason}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleMercadoPagoCheckout} className="space-y-4 pt-2">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
              <span className="text-sm font-medium">Assinatura Mensal QRVivo</span>
              <span className="font-bold text-emerald-700">R$ 29,90/mês</span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkout-email">Seu melhor e-mail (para acessar o painel)</Label>
              <Input
                id="checkout-email"
                type="email"
                required
                placeholder="voce@suaempresa.com.br"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isLoadingCheckout}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              {isLoadingCheckout ? "Gerando pagamento..." : "Continuar para Mercado Pago (Pix / Cartão)"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
