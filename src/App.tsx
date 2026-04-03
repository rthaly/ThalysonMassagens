import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';

// ==================================================================================
// 1. CONFIGURAÇÕES DA LOJA
// ==================================================================================

const CONFIG = {
  PHONE: "5517991360413",
  INSTAGRAM_URL: "https://instagram.com/sua.loja",
  STORAGE_KEY: '@axe_vestuario_cart', 
  PIX_KEY: "Sua Chave Pix Aqui", 
  LOCALE_PT: 'pt-BR',
} as const;

// Ícones básicos em SVG
const ICON_PATHS: Record<string, string> = {
  'menu': 'M4 12h16 M4 6h16 M4 18h16', 'x': 'M18 6L6 18M6 6l12 12', 'check': 'M20 6L9 17l-5-5',
  'shopping-bag': 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z M3 6h18 M16 10a4 4 0 0 1-8 0',
  'instagram': 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M2 8a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8z',
  'chevron-down': 'M6 9l6 6 6-6', 'map-pin': 'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'user': 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  'sun': 'M12 3v1 M12 20v1 M3 12h1 M20 12h1 M18.364 5.636l-.707.707 M6.343 17.657l-.707.707 M5.636 5.636l.707.707 M17.657 17.657l.707.707 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z',
  'moon': 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z', 'plus': 'M12 5v14 M5 12h14', 'minus': 'M5 12h14',
  'truck': 'M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM17 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-10 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0z'
};

// ==================================================================================
// 2. DADOS DO CATÁLOGO DE PRODUTOS
// ==================================================================================

// Tipagem dos Produtos
interface Product { id: string; name: string; category: string; price: number; description: string; details: string; image: string; sizes: string[]; }
interface CartItem extends Product { cartId: string; selectedSize: string; quantity: number; }
interface OrderData { name: string; phone: string; address: { street: string; number: string; district: string; city: string; comp: string; cep: string; }; }

const CATALOG: Product[] = [
  {
    id: 'saia-racao-branca',
    name: "Saia de Ração Tradicional",
    category: "Saias",
    price: 120.00,
    description: "Saia branca com excelente roda, confeccionada em tecido leve e fresco, ideal para o dia a dia no terreiro.",
    details: "Tecido: Percal 100% Algodão\nRoda: 4 metros\nAcabamento em bordado inglês na barra.",
    image: "https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&q=80&w=600", // TROQUE PELA SUA FOTO
    sizes: ['P', 'M', 'G', 'GG', 'Sob Medida']
  },
  {
    id: 'camisu-masculino',
    name: "Camisú de Algodão",
    category: "Camisas",
    price: 85.00,
    description: "Camisú clássico de gola canoa, modelagem confortável que permite total liberdade de movimentos.",
    details: "Tecido: Tricoline\nCorte tradicional\nCostura reforçada.",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=600", // TROQUE PELA SUA FOTO
    sizes: ['P', 'M', 'G', 'GG']
  },
  {
    id: 'conjunto-baiana',
    name: "Conjunto de Baiana Luxo",
    category: "Conjuntos",
    price: 450.00,
    description: "Conjunto completo rendado contendo Saia, Camisú, Pano da Costa e Pano de Cabeça. Feito para dias de festa.",
    details: "Tecido: Renda de Bilro e Oxford\nRoda da Saia: 5 metros\nDetalhes com fios dourados.",
    image: "https://images.unsplash.com/photo-1583391733958-6d2745bfca44?auto=format&fit=crop&q=80&w=600", // TROQUE PELA SUA FOTO
    sizes: ['Tamanho Único Ajustável']
  },
  {
    id: 'calca-bumbacha',
    name: "Calça Bumbacha Branca",
    category: "Calças",
    price: 95.00,
    description: "Calça folgada com elástico no tornozelo, garantindo conforto extremo para obrigações e trabalhos.",
    details: "Tecido: Algodão Cru\nCós com elástico e cordão\nBolso lateral interno.",
    image: "https://images.unsplash.com/photo-1542272201-b1ca555f8505?auto=format&fit=crop&q=80&w=600", // TROQUE PELA SUA FOTO
    sizes: ['P', 'M', 'G', 'GG']
  }
];

const FAQ = [
  { q: "Vocês fazem roupas sob medida?", a: "Sim! Para tamanhos especiais ou roupas específicas, selecione a opção 'Sob Medida' se disponível, e acertaremos os detalhes das suas medidas pelo WhatsApp." },
  { q: "Qual o prazo de confecção e entrega?", a: "Temos peças à pronta entrega, mas caso precise ser confeccionada, nosso prazo médio é de 7 a 15 dias úteis, dependendo dos detalhes da peça." },
  { q: "Como funciona o envio?", a: "Enviamos para todo o Brasil via Correios (PAC/Sedex). O frete será calculado quando finalizarmos o pedido no WhatsApp." }
];

const formatMoney = (val: number) => `R$ ${val.toFixed(2).replace('.', ',')}`;

// ==================================================================================
// 3. COMPONENTES DE UI
// ==================================================================================

const GlobalStyles = memo(({ isDark }: { isDark: boolean }) => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
    * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
    html, body {
      background-color: ${isDark ? '#0f0f11' : '#f8f9fa'};
      color: ${isDark ? '#FFFFFF' : '#18181b'};
      font-family: 'Plus Jakarta Sans', sans-serif;
      transition: background-color 0.3s;
    }
    .font-playfair { font-family: 'Playfair Display', serif; }
  `}} />
));

const Icon = memo(({ name, size = 20, className = "" }: { name: string, size?: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
    <path d={ICON_PATHS[name] || ''} />
  </svg>
));

const Button = ({ children, onClick, variant = 'primary', full = false, className = '' }: any) => {
  const base = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all rounded-xl h-12 md:h-14 px-6 text-xs";
  const variants = {
    primary: "bg-amber-600 text-white hover:bg-amber-500",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#20BD5A]"
  };
  return (
    <button onClick={onClick} className={`${base} ${variants[variant as keyof typeof variants]} ${full ? 'w-full' : ''} ${className}`}>
      {children}
    </button>
  );
};

const InputField = ({ label, value, onChange, placeholder, icon, type = "text", isDark }: any) => (
  <div className="space-y-1 w-full">
    {label && <label className={`text-[10px] font-bold uppercase tracking-widest pl-1 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{label}</label>}
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"><Icon name={icon} size={20} /></div>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`w-full h-12 rounded-xl outline-none text-sm transition-all bg-transparent ${icon ? 'pl-11 pr-4' : 'px-4'} ${isDark ? 'border border-zinc-700 text-white focus:border-amber-500 focus:bg-zinc-900' : 'border border-slate-300 text-slate-900 focus:border-amber-600 focus:bg-white'}`} />
    </div>
  </div>
);

// ==================================================================================
// 4. MAIN APP (CATÁLOGO & CARRINHO)
// ==================================================================================

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'address'>('cart');
  
  const [orderData, setOrderData] = useState<OrderData>({
    name: '', phone: '', address: { street: '', number: '', district: '', city: '', comp: '', cep: '' }
  });

  // Salvar e carregar carrinho do LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) { try { setCart(JSON.parse(saved)); } catch (e) {} }
  }, []);

  useEffect(() => {
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, size: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => item.cartId === existing.cartId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartId: `${product.id}-${size}-${Date.now()}`, selectedSize: size, quantity: 1 }];
    });
    alert(`${product.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const sendToWhatsApp = () => {
    if (!orderData.name || !orderData.address.street) {
      alert("Por favor, preencha seu nome e endereço de entrega.");
      return;
    }

    const itemsText = cart.map(item => `▫️ ${item.quantity}x ${item.name} (Tamanho: ${item.selectedSize}) - ${formatMoney(item.price * item.quantity)}`).join('\n');
    
    const msg = `
*NOVO PEDIDO - VESTUÁRIO*
──────────────────
👤 *Cliente:* ${orderData.name}
📱 *Telefone:* ${orderData.phone}

🛍️ *ITENS DO PEDIDO:*
${itemsText}

💰 *Subtotal:* ${formatMoney(cartTotal)}
*(Frete será calculado no chat)*

📍 *ENDEREÇO DE ENTREGA:*
CEP: ${orderData.address.cep}
${orderData.address.street}, ${orderData.address.number} - ${orderData.address.comp}
Bairro: ${orderData.address.district} | Cidade: ${orderData.address.city}
──────────────────
Aguardo a confirmação e o cálculo do frete!
    `.trim();

    window.open(`https://wa.me/${CONFIG.PHONE}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      <GlobalStyles isDark={isDark} />
      
      {/* Header Fixo */}
      <header className={`fixed top-0 left-0 w-full z-40 backdrop-blur-md border-b transition-colors ${isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-playfair font-bold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>Odara Vestuário</h1>
            <p className={`text-[10px] uppercase tracking-widest font-semibold ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>Religião & Tradição</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-full ${isDark ? 'text-zinc-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <Icon name={isDark ? 'sun' : 'moon'} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2 flex items-center justify-center">
              <Icon name="shopping-bag" size={24} className={isDark ? 'text-white' : 'text-slate-900'} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-transparent">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-20 px-4 md:px-8 max-w-6xl mx-auto min-h-screen">
        
        {/* Banner Hero */}
        <section className="mb-16 text-center max-w-2xl mx-auto">
          <h2 className={`text-3xl md:text-5xl font-playfair mb-4 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Vista sua fé com <span className="text-amber-500 italic">respeito e elegância.</span>
          </h2>
          <p className={`text-sm md:text-base font-light ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
            Peças a pronta entrega e sob medida. Confeccionadas com amor para o seu sagrado.
          </p>
        </section>

        {/* Grade de Produtos */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATALOG.map(product => {
            const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

            return (
              <article key={product.id} className={`flex flex-col rounded-3xl overflow-hidden border transition-all hover:-translate-y-1 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                {/* Imagem do Produto */}
                <div className="aspect-[4/5] w-full relative overflow-hidden bg-zinc-800">
                  <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform hover:scale-105 duration-500" loading="lazy" />
                  <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {product.category}
                  </span>
                </div>
                
                {/* Informações */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-xl font-playfair font-semibold pr-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{product.name}</h3>
                    <span className={`text-lg font-bold shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{formatMoney(product.price)}</span>
                  </div>
                  <p className={`text-xs font-light leading-relaxed mb-6 flex-1 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>{product.description}</p>
                  
                  {/* Tamanhos */}
                  <div className="mb-6">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Selecione o Tamanho:</p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(size => (
                        <button key={size} onClick={() => setSelectedSize(size)} className={`px-3 py-2 text-[10px] font-bold rounded-lg transition-colors border ${selectedSize === size ? 'bg-amber-600 border-amber-600 text-white' : isDark ? 'border-zinc-700 text-zinc-300 hover:border-zinc-500' : 'border-slate-300 text-slate-700 hover:border-slate-400'}`}>
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button full onClick={() => addToCart(product, selectedSize)}>Adicionar à Sacola</Button>
                </div>
              </article>
            );
          })}
        </section>

        {/* FAQ */}
        <section className="mt-24 max-w-3xl mx-auto">
          <h3 className={`text-2xl font-playfair font-medium text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dúvidas Frequentes</h3>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                <h4 className={`text-sm font-bold mb-2 ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>{item.q}</h4>
                <p className={`text-sm font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-600'}`}>{item.a}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* Modal do Carrinho / Checkout */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsCartOpen(false)}>
          <aside className={`w-full max-w-md h-full flex flex-col shadow-2xl transition-transform transform translate-x-0 ${isDark ? 'bg-zinc-950 text-white' : 'bg-white text-slate-900'}`} onClick={e => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-6 border-b border-zinc-800/50">
              <h2 className="text-xl font-playfair font-bold flex items-center gap-2">
                <Icon name={checkoutStep === 'cart' ? 'shopping-bag' : 'map-pin'} /> 
                {checkoutStep === 'cart' ? 'Sua Sacola' : 'Dados de Entrega'}
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-zinc-800 rounded-full"><Icon name="x" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <Icon name="shopping-bag" size={48} className="mb-4" />
                  <p>Sua sacola está vazia.</p>
                </div>
              ) : checkoutStep === 'cart' ? (
                <div className="space-y-6">
                  {cart.map(item => (
                    <div key={item.cartId} className="flex gap-4 border-b border-zinc-800/50 pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-xl" />
                      <div className="flex-1 flex flex-col">
                        <h4 className="font-semibold text-sm leading-tight mb-1">{item.name}</h4>
                        <span className="text-[10px] text-amber-500 font-bold mb-auto">Tam: {item.selectedSize}</span>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-bold">{formatMoney(item.price)}</span>
                          <div className={`flex items-center gap-3 rounded-lg px-2 py-1 border ${isDark ? 'border-zinc-700 bg-zinc-900' : 'border-slate-200 bg-slate-50'}`}>
                            <button onClick={() => updateQuantity(item.cartId, -1)}><Icon name="minus" size={14} /></button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.cartId, 1)}><Icon name="plus" size={14} /></button>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="self-start p-1 text-red-500 hover:bg-red-500/10 rounded"><Icon name="x" size={16} /></button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  <InputField isDark={isDark} label="Seu Nome Completo" value={orderData.name} onChange={(e: any) => setOrderData(prev => ({...prev, name: e.target.value}))} icon="user" />
                  <InputField isDark={isDark} label="WhatsApp" type="tel" value={orderData.phone} onChange={(e: any) => setOrderData(prev => ({...prev, phone: e.target.value}))} placeholder="(11) 99999-9999" />
                  
                  <div className="pt-4 border-t border-zinc-800/50">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${isDark ? 'text-amber-500' : 'text-amber-600'}`}><Icon name="truck" size={16} /> Endereço para Envio</p>
                    <div className="space-y-4">
                      <InputField isDark={isDark} label="CEP" value={orderData.address.cep} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, cep: e.target.value}}))} />
                      <div className="grid grid-cols-[1fr_80px] gap-3">
                        <InputField isDark={isDark} label="Rua / Av" value={orderData.address.street} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, street: e.target.value}}))} />
                        <InputField isDark={isDark} label="Número" value={orderData.address.number} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, number: e.target.value}}))} />
                      </div>
                      <InputField isDark={isDark} label="Complemento" placeholder="Apto, Casa 2..." value={orderData.address.comp} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, comp: e.target.value}}))} />
                      <div className="grid grid-cols-2 gap-3">
                        <InputField isDark={isDark} label="Bairro" value={orderData.address.district} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, district: e.target.value}}))} />
                        <InputField isDark={isDark} label="Cidade" value={orderData.address.city} onChange={(e: any) => setOrderData(prev => ({...prev, address: {...prev.address, city: e.target.value}}))} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className={`p-6 border-t ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm uppercase tracking-widest font-bold">Total dos Produtos</span>
                  <span className="text-2xl font-playfair font-bold text-amber-500">{formatMoney(cartTotal)}</span>
                </div>
                
                {checkoutStep === 'cart' ? (
                  <Button full onClick={() => setCheckoutStep('address')}>Avançar para Entrega</Button>
                ) : (
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setCheckoutStep('cart')}><Icon name="x" size={16} /></Button>
                    <Button variant="whatsapp" full onClick={sendToWhatsApp}>Enviar Pedido <Icon name="check" className="ml-2" /></Button>
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      )}
    </>
  );
}
