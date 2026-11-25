# Relaxar hoje com Thalyson

Site Next.js de massagem individual na Bela Vista, São Paulo (https://relaxarhoje.com.br). Objetivo: o cliente entender a sessão e mandar o pedido pelo WhatsApp.

## Antes de qualquer alteração (obrigatório)

**Leia na íntegra, nesta ordem, os arquivos abaixo antes de editar qualquer coisa.** Não confie em memória: releia, porque eles mudam.

1. `.claude/skills/relaxar-visual/SKILL.md`, `.claude/skills/relaxar-copy/SKILL.md` e `.claude/skills/relaxar-revisao/SKILL.md` (as regras do projeto).
2. `.claude/skills/seo-local/SKILL.md` (títulos, meta, páginas locais).
3. `.claude/skills/ui-ux-pro-max/SKILL.md` e `.claude/skills/impeccable/SKILL.md` (interface e design).
4. `.claude/skills/stop-slop/SKILL.md` e `.claude/skills/humanizer/SKILL.md` (texto direto, sem clichê de IA).
5. `marketing/INSTRUCOES-DO-PROJETO.md` (arquivo local) e `marketing/CONHECIMENTO-NEGOCIO.md` (tabela oficial de sessões e preços).

`.claude/skills/design-taste-frontend` também está na pasta, mas é um fluxo de site estático com regras que conflitam com este projeto (fundo escuro, legenda sobre foto). Use só como referência de princípios, não rode o fluxo dele.

**Qualquer alteração de interface ou de texto** aplica 1 a 4. **Antes de finalizar**, rode `npm run build`, informe erro ou aviso, e rode a checagem da skill `relaxar-revisao` (termos proibidos, 360 px, toque de 44 px, contraste).

## Não negociável

- **Zero termo adulto no que o Google, o Instagram ou anúncios leem**: H1, `<title>`, meta description, dados estruturados, HTML da home e das páginas `/massagem/*` e `/sessoes/*`, e também nos endereços (slugs). Esse vocabulário só aparece atrás da tela de maioridade. `/avaliacoes` fica `noindex` e fora do sitemap. Nomes públicos em `lib/site.ts`.
- **Uma fonte para o texto das sessões**: `lib/content.ts` (resumo, passos, observação, preço, duração). A Home, a página da sessão, o quiz e o assistente leem dali. Inglês e espanhol ficam em `PACKAGES`, no componente da Home. **Nunca copie o mesmo texto em dois lugares**; cada fato mora em um só lugar (sinal e Pix em "Como funciona", remarcação no FAQ).
- **Não invente fatos** sobre clientes, distâncias ou resultado de saúde. Não falar de toalha.
- **Três idiomas** (pt, en, es): alterou um texto, altere os três.
- **Identidade**: Fraunces nos títulos, Poppins na interface, paleta off-white e chumbo, vidro fosco só em cartões de destaque. Toque de no mínimo 44 px, texto de no mínimo 12 px, sem rolagem lateral a partir de 360 px, e movimento que respeita "reduzir animação" (só fades).
- **Nunca commitar**: `.env*` (menos `.env.example`), `credenciais.json`, `marketing/`, `.claude/`.

## Mapa rápido

| O que | Onde |
|---|---|
| Home (reserva em passos, quiz, textos) | `components/legacy-experience.tsx` |
| Sessões (fonte única em pt) | `lib/content.ts` |
| Textos públicos e SEO | `lib/site.ts`, `lib/locais.ts`, `components/seo-intro.tsx`, `app/massagem/[local]/` |
| Páginas de sessão e avaliações | `components/site.tsx`, `app/sessoes/`, `app/avaliacoes/` |
| Voz das sessões | `useNarrator` na Home. Usa `public/voz/<id>.mp3` ou `public/voz-thalyson.mp3` se existirem; senão a voz do navegador (prioriza voz masculina pt-BR) |
| Assistente de dúvidas (sem IA) | `lib/faq-engine.ts`, `components/assistant-chat.tsx`, `app/api/chat/route.ts` |
| Avisos do dia no assistente | `lib/atendimento.ts` |
| Agenda (Google Calendar) | `lib/calendar.ts`, `lib/slots.ts`, `app/api/disponibilidade/` |
| Área privada | `app/gestao/` |

Publicação, domínio e agenda: `DEPLOY-VERCEL.md`.
