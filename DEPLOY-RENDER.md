# Deploy grátis — Render Free + Neon Free

## 1. Neon (base de dados) — $0

1. Cria conta em https://neon.tech
2. Cria um project (região próxima de si)
3. Copia a connection string `DATABASE_URL` (Postgres)

## 2. Render (app) — $0

1. Conta em https://render.com (login com GitHub)
2. **New → Blueprint** *ou* **New → Web Service**
3. Liga o repositório `tomaslucas823-del/TLE-Group`
4. Se não usares Blueprint, configura:

| Campo | Valor |
|--------|--------|
| Runtime | Node |
| Build Command | `npm ci --include=dev && npm run build` |
| Start Command | `npm start` |
| Instance type | **Free** |

5. Environment variables (Environment):

| Variável | Valor |
|----------|--------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | (string do Neon) |
| `BETTER_AUTH_SECRET` | gera com `openssl rand -hex 32` |
| `BETTER_AUTH_URL` | URL do serviço Render (ex. `https://tle-group.onrender.com`) |
| `VITE_AUTH_ENABLED` | `true` |
| `CAPTCHA_SECRET` | (pode ser o mesmo secret se quiseres) |

6. **Create Web Service** e espera o primeiro deploy.

## 3. Domínio

- No Render: Settings → Custom Domains → `www.tlegroup.co.mz`
- No DNS do `.co.mz`: CNAME para o host que o Render indicar
- Actualiza `BETTER_AUTH_URL` e `site.domain` para o domínio final

## 4. Limites do Free

- Dorme após ~15 min sem visitas (1.ª visita pode demorar ~1 min)
- ~750 horas de instância / mês
- ~5 GB tráfego / mês

## 5. Remover a Vercel

1. Abre: https://vercel.com/maguida/tle-arquitetura/settings
2. Secção **Delete Project** → confirma
3. Remove domínios da Vercel se ainda estiverem apontados

## Notas técnicas

- Nitro usa preset `node-server` (saída em `.output/server/index.mjs`)
- `npm run build` aplica migrações se `DATABASE_URL` existir
- Sem `DATABASE_URL` no build local, usa PGLite (só dev)
