import React, { useState } from 'react';
import { MessageCircle, MapPin, Calendar, Clock, Check, Star } from 'lucide-react';

const App = () => {
  const [selectedService, setSelectedService] = useState(null);

  // --- CONFIGURAÇÃO DOS SERVIÇOS E PREÇOS ---
  const services = [
    {
      id: 'relaxante',
      title: 'Massagem Relaxante',
      price: 155, // Alterado de 145 para 155
      duration: '60 min',
      description: 'Toque suave para alívio de tensão e relaxamento muscular.',
      features: ['Aromaterapia', 'Música relaxante', 'Óleos essenciais']
    },
    {
      id: 'sensitiva',
      title: 'Massagem Sensitiva',
      price: 205, // Alterado de 175 para 205
      duration: '60 min',
      description: 'Experiência sensorial com toques leves que despertam o corpo.',
      features: ['Toque sutil', 'Estímulo sensorial', 'Conexão corporal']
    },
    {
      id: 'completa',
      title: 'Massagem Completa',
      price: 235, // Alterado de 205 para 235
      duration: '60 min',
      description: 'A experiência definitiva. Fusão de técnicas para relaxamento total.',
      features: ['Corpo a corpo', 'Finalização', 'Intensidade ajustável'],
      highlight: true
    },
    {
      id: 'nuru',
      title: 'Massagem Nuru', // NOVO SERVIÇO
      price: 305,
      duration: '60 min',
      description: 'Técnica japonesa utilizando gel especial escorregadio. Contato corpo a corpo intenso.',
      features: ['Gel Nuru aquecido', 'Deslizamento total', 'Experiência única']
    },
    {
      id: 'depilacao',
      title: 'Depilação Masculina', // MANTIDO
      price: 80, // Valor estimado, ajuste conforme seu preço real
      duration: '30-60 min',
      description: 'Remoção de pelos com máquina ou cera, conforme preferência.',
      features: ['Higiene completa', 'Acabamento liso', 'Hidratação pós']
    }
  ];

  // --- PACOTES PROMOCIONAIS (Atualizados proporcionalmente) ---
  const packages = [
    {
      title: 'Pack Relax (3 Sessões)',
      price: 435, // 3x 155 = 465 (Desconto de 30)
      description: 'Garanta seu relaxamento semanal com desconto.'
    },
    {
      title: 'Pack Vip (3 Completas)',
      price: 650, // 3x 235 = 705 (Desconto de 55)
      description: 'Para quem não abre mão da experiência completa.'
    }
  ];

  const whatsappLink = (serviceName, price) => {
    const text = `Olá Thalyson! Gostaria de agendar a *${serviceName}* no valor de R$ ${price}.`;
    return `https://wa.me/5511999999999?text=${encodeURIComponent(text)}`; // Substitua pelo seu número
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans pb-10">
      {/* Header */}
      <header className="bg-gray-800 py-6 px-4 shadow-lg border-b border-gray-700">
        <div className="container mx-auto flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-amber-500 mb-2">Thalyson Massagens</h1>
          <p className="text-gray-400 text-sm flex items-center gap-2">
            <MapPin size={16} /> Atendimento em São Paulo & Londrina
          </p>
        </div>
      </header>

      {/* Hero / Intro */}
      <section className="py-8 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4 text-white">Escolha sua Experiência</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          Permita-se um momento de desconexão e prazer. Atendimento profissional com discrição e conforto.
        </p>
      </section>

      {/* Lista de Serviços */}
      <section className="container mx-auto px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`bg-gray-800 rounded-xl p-6 shadow-md border ${service.highlight ? 'border-amber-500 ring-1 ring-amber-500' : 'border-gray-700'} hover:border-amber-400 transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <span className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                  <Clock size={14} /> {service.duration}
                </span>
              </div>
              <div className="text-right">
                <span className="block text-2xl font-bold text-amber-500">R$ {service.price}</span>
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 text-sm">{service.description}</p>
            
            <ul className="mb-6 space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-center text-sm text-gray-400">
                  <Check size={14} className="text-amber-500 mr-2" /> {feature}
                </li>
              ))}
            </ul>

            <a 
              href={whatsappLink(service.title, service.price)}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-3 rounded-lg font-semibold transition-colors ${service.highlight ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'}`}
            >
              Agendar Agora
            </a>
          </div>
        ))}
      </section>

      {/* Pacotes */}
      <section className="container mx-auto px-4 mt-12">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Star className="text-amber-500" /> Pacotes Especiais
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {packages.map((pkg, idx) => (
            <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-white">{pkg.title}</h4>
                <p className="text-sm text-gray-400">{pkg.description}</p>
              </div>
              <div className="text-right">
                <span className="block text-xl font-bold text-amber-500">R$ {pkg.price}</span>
                <a 
                  href={whatsappLink(pkg.title, pkg.price)}
                  className="text-xs text-amber-500 underline hover:text-amber-400"
                >
                  Solicitar
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 py-8 text-center text-gray-500 text-sm border-t border-gray-800">
        <p className="mb-2">Pagamento: Pix, Dinheiro ou Cartão</p>
        <p>© 2026 Thalyson Massagens. Todos os direitos reservados.</p>
      </footer>

      {/* Botão Flutuante WhatsApp */}
      <a 
        href="https://wa.me/5511999999999" // Substitua pelo seu número
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform hover:scale-110 z-50"
        aria-label="Falar no WhatsApp"
      >
        <MessageCircle size={28} />
      </a>
    </div>
  );
};

export default App;
