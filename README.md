# TLE Arquitetura

Estúdio de visualização residencial em Maputo. O site mostra a casa antes da obra, estima o estudo em meticais e guarda pedidos, propostas e aprovações por conta.

Contactos, NUIT e redes ainda são provisórios. Troque-os num só sítio: `src/lib/site.ts`.

## Wireframe

1. **Cabeçalho fixo** (vidro escuro, blur 12px) — marca, Portfólio, Método, Simulador, Portal, entrar e “Pedir cotação”.
2. **Hero** — vídeo 3D em loop (`public/hero.mp4`), com poster (`public/hero-poster.webp`) a carregar primeiro. `autoplay`, `muted`, `loop`, `playsinline`. O fundo escurece e funde-se na secção seguinte.
3. **Manifesto** — encostado ao hero, sem faixa branca no meio.
4. **Portfólio** — grelha. No hover a imagem aproxima e o vidro revela o texto.
5. **Entregas** — estudo visual, executivo, imagens finais.
6. **Método** — programa, partido, imagem, entrega.
7. **Simulador** — m², partido, entrega. Total em MZN e calendário 40% / 40% / 20%.
8. **Cotação** — formulário curto sobre imagem, com vidro. A mensagem tem duas linhas. Ao lado, telefone, e-mail, morada e redes (a indicar).
9. **Rodapé** — razão social, NUIT, morada, contactos provisórios, privacidade.
10. **Portal** (`/portal`) — estado do projeto, aprovar imagem, abrir proposta.
11. **Estúdio** (`/estudio`) — leads, clientes, agenda, proposta em PDF e parcelas.
12. **404** — “Esta página não foi desenhada.”

O banner de cookies pede consentimento antes de qualquer medição. O botão de WhatsApp só aparece quando `phoneWa` tiver dígitos.

## Moeda e pagamentos

Tudo o que o visitante vê está em meticais (MZN): simulador, proposta e parcelas.

No estúdio, cada parcela regista uma destas formas:

- M-Pesa
- e-Mola
- Cartão, sempre convertido para MZN
- Transferência

As referências M-Pesa e e-Mola desta versão são demonstrativas. Não há débito. Para cobrar de verdade, ligue a conta do operador (M-Pesa ou e-Mola) ou um gateway que liquide em meticais e grave o estado na parcela (`aberto`, `aguardando`, `recebido`).

## Contactos a preencher

Em `src/lib/site.ts`:

| Campo | Uso |
| --- | --- |
| `nuit` | Rodapé, proposta, privacidade |
| `address` | Rodapé e secção de cotação |
| `email` | Mailto e privacidade |
| `phoneDisplay` | Texto do telefone |
| `phoneWa` | Só dígitos, com 258. Vazio esconde o WhatsApp |
| `instagram`, `facebook`, `linkedin` | URL completa, ou vazio (“A indicar”) |
| `domain` | Também em `public/sitemap.xml` e `public/robots.txt` |
| `gaId` | `G-XXXXXXXX`. Vazio = sem script |

## Vídeo do hero

Substitua `public/hero.mp4` por um loop sem áudio e `public/hero-poster.webp` por um frame do mesmo plano. O poster aparece primeiro; o vídeo só corre se a pessoa não pediu movimento reduzido.

## Domínio, publicação e HTTPS

1. Publique pela Grok (o deploy entrega HTTPS).
2. No registador do domínio `.co.mz`, aponte o nome para o endereço que a publicação indicar.
3. Confirme que `site.domain`, o sitemap e o `robots.txt` usam o mesmo endereço, com `https://`.

## Google Analytics

1. Crie uma propriedade GA4 para o domínio.
2. Cole o ID em `site.gaId`.
3. O script só carrega depois de “Aceitar” no banner.

## Google Calendar

Na agenda do estúdio, “Abrir no Google Calendar” cria o evento num separador (modelo do Google, sem API). “Descarregar .ics” serve para qualquer calendário. Uma sincronização de dois sentidos exige um projeto Google Cloud, o Calendar API e uma conta de serviço — não está ligada nesta versão.

## Segurança

- Consultas com parâmetros, não SQL montado à mão.
- Cada conta só lê e escreve as suas linhas (isolamento por `user_id` no servidor).
- A palavra-passe do login social não fica no estúdio.
- O formulário público valida nome, e-mail e telefone, tem honeypot, captcha e rate limit; ignora o campo escondido `empresa`.
- Status de leads e parcelas têm CHECK constraints na base (migração `0005_status_checks.sql`).
- Erros em produção não expõem stack traces nem mensagens internas.
- IDs internos são sequenciais, mas todas as queries filtram por `user_id` — o risco de enumeração é baixo.
- NUIT provisório (`000 000 000`) é mostrado como “NUIT a indicar” até ser preenchido em `src/lib/site.ts`.
