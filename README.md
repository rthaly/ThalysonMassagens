# Relaxar hoje com Thalyson

Site de massagem individual na Bela Vista, São Paulo: https://relaxarhoje.com.br

Feito com Next.js, publicado na Vercel. O que o site faz:

- Reserva em passos (sessão, plano, dia, horário) que termina num pedido pronto no WhatsApp
- Horários livres lidos do Google Calendar, só início e fim, sem detalhes
- Assistente de dúvidas gratuito, sem IA e sem API (`lib/faq-engine.ts`)
- Avisos recentes do dia no assistente (`lib/atendimento.ts`)
- Páginas de SEO local em `/massagem/*` e uma página para cada sessão em `/sessoes/*`
- Área privada em `/gestao` (agenda e registro de pedidos confirmados)

## Onde mudar o conteúdo

| O que | Arquivo |
|---|---|
| Preços, durações e descrições das sessões | `lib/content.ts` e `components/legacy-experience.tsx` |
| Avisos do dia (folga, horário especial) | `lib/atendimento.ts` |
| Textos públicos que o Google lê | `lib/site.ts` e `lib/locais.ts` |

Regra de ouro: textos que o Google ou o Instagram leem usam só vocabulário de bem-estar. Termos adultos ficam atrás da tela de maioridade.

## Publicar e configurar

Passo a passo de publicação, domínio e agenda: [DEPLOY-VERCEL.md](DEPLOY-VERCEL.md).
Variáveis de ambiente: [.env.example](.env.example).
