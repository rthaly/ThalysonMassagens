# Relaxar hoje com Thalyson

Site Next.js de massagem individual na Bela Vista, São Paulo (https://relaxarhoje.com.br). Objetivo: o cliente entender a sessão e mandar o pedido pelo WhatsApp.

## Regras obrigatórias

**Qualquer alteração de interface ou de texto** deve aplicar estas skills, nesta ordem:

1. `ui-ux-pro-max` e `impeccable` (auditoria, critique e polish visual).
2. `stop-slop` (tirar texto genérico ou de robô).
3. `seo-local` (títulos, meta, páginas e palavras-chave locais).
4. `relaxar-visual`, `relaxar-copy` e `relaxar-revisao` (regras do projeto: paleta, fontes, voz, termos proibidos e checklist final).

`ui-ux-pro-max`, `impeccable` e `stop-slop` ficam na conta do usuário (`~/.claude/skills`), completas. Não crie cópias com o mesmo nome neste projeto: uma versão curta aqui passaria na frente da completa.

**Antes de finalizar**, rode `npm run build` e informe se deu erro ou aviso. Se alterou interface ou texto indexável, rode também a checagem da skill `relaxar-revisao`.

## Não negociável

- **Zero termo adulto no que o Google, o Instagram ou anúncios leem**: H1, `<title>`, meta description, dados estruturados, HTML da home e das páginas `/massagem/*` e `/sessoes/*`. Esse vocabulário só aparece atrás da tela de maioridade. Nomes públicos em `lib/site.ts`.
- **Não invente fatos**: preço, duração e descrição das sessões vêm de `lib/content.ts` e de `PACKAGES` em `components/legacy-experience.tsx`. Nada sobre clientes, distâncias ou resultado de saúde.
- **Três idiomas** (pt, en, es): alterou um texto, altere os três.
- **Nunca commitar**: `.env*` (menos `.env.example`), `credenciais.json`, `marketing/`, `.claude/`.

## Mapa rápido

| O que | Onde |
|---|---|
| Reserva em passos, textos, quiz | `components/legacy-experience.tsx` |
| Sessões (dados) | `lib/content.ts` |
| Textos públicos e SEO | `lib/site.ts`, `lib/locais.ts`, `app/massagem/[local]/` |
| Assistente de dúvidas (sem IA) | `lib/faq-engine.ts`, `components/assistant-chat.tsx`, `app/api/chat/route.ts` |
| Avisos do dia no assistente | `lib/atendimento.ts` |
| Agenda (Google Calendar) | `lib/calendar.ts`, `lib/slots.ts`, `app/api/disponibilidade/` |
| Área privada | `app/gestao/` |

Publicação, domínio e agenda: `DEPLOY-VERCEL.md`.
