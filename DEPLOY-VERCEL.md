# Publicar na Vercel e ligar tudo

## 1. Publicar (5 min)
No PowerShell, dentro desta pasta:

```powershell
npx vercel login
npx vercel link
npx vercel --prod
```

No `vercel link`, escolha o projeto que **já existe** (o do site atual). Assim as variáveis do Supabase e a conexão do Google Calendar continuam valendo.

Se o site estiver ligado a um repositório no GitHub, dá para publicar só subindo as alterações para a branch principal.

## 2. Ligar os horários reais da agenda (2 min)
1. Abra `https://SEU-SITE/gestao` e entre.
2. Se o Google Calendar estiver "Pendente", clique em **Autorizar Google Calendar**.
3. No quadro **Horários reais no site**, copie o código que aparece.
4. Na Vercel: **Settings → Environment Variables** → crie `AGENDA_OWNER_USER_ID` com esse código (Production).
5. Publique de novo (`npx vercel --prod` ou **Redeploy** no painel).

Pronto: o que estiver ocupado na sua agenda Google some do site. Só início e fim do compromisso são lidos; nada de nome, título ou local vai para o navegador do cliente. Atendimento em domicílio ganha 30 min de folga antes e depois para o deslocamento.

## 3. Domínio próprio (opcional)
1. Vercel → **Settings → Domains** → adicione o domínio e siga as instruções de DNS.
2. Crie a variável `NEXT_PUBLIC_SITE_URL` com o endereço completo (ex.: `https://relaxarhoje.com.br`) e publique de novo. Sitemap, robots e Google passam a usar esse endereço.

## 4. Ver o funil de clientes
Vercel → seu projeto → **Analytics → Events**. Eventos (anônimos, sem cookies):

| Evento | O que significa |
|---|---|
| `quiz_iniciado` / `quiz_concluido` | Pessoa usou o "Descobrir minha sessão" |
| `sessao_escolhida` | Escolheu uma sessão |
| `revisar_valores` | Preencheu dia, horário e nome |
| `pedido_whatsapp` | Mandou o pedido no WhatsApp (com sessão, plano e valor) |
| `duvida_whatsapp` | Clicou para tirar dúvida |
| `ajuda_exibida` / `ajuda_clicada` | Convite de ajuda para quem parou no meio |
| `rascunho_retomado` | Voltou e continuou uma reserva |
| `link_direto` | Chegou por um link com `?sessao=` ou `?cupom=` |
| propriedade `origem` | Todos os eventos acima levam de onde a pessoa veio: `utm_source`, `ref` ou o site de origem (`direto` se não houver) |

Em planos gratuitos da Vercel, eventos personalizados podem exigir o plano Pro; as visitas normais continuam aparecendo.

## 5. Links prontos para Instagram, Google e anúncios
- Reserva direta: `https://SEU-SITE/?agendar`
- Sessão já escolhida: `https://SEU-SITE/?sessao=classica` (também `sensitiva`, `fusion`, `completa`, `aparo`)
- Com cupom aplicado: `https://SEU-SITE/?cupom=RELAXAR13`
- Juntos: `https://SEU-SITE/?sessao=classica&cupom=RELAXAR13`

Para saber qual canal traz reservas, acrescente a origem ao link: `?sessao=classica&utm_source=instagram` (ou `google`, `indicacao`, `cartao`). Ela aparece no filtro `origem` dos eventos.

Dica: na bio do Instagram use o link com `?sessao=classica`, porque é a sessão que pode ser divulgada em público.

## 6. Falta você mandar
- Sua foto em `public/thalyson.jpg` (quadrada, de 600×600 px). Sem ela, o site mostra a letra "T".
