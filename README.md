# Maker Info

Frontend React + backend Express para o site, painel administrativo, painel empresarial, acompanhamento de pedidos e waitlist do Maker Gym.

## O que mudou

- autenticação do admin e do painel empresarial saiu do frontend
- operações sensíveis agora passam pela API `/api`
- o frontend não acessa mais o Supabase direto no navegador
- uploads de pedidos agora passam pelo backend com sessão protegida
- waitlist do Maker Gym também foi movida para o backend

## Ambiente

Copie `.env.example` para `.env` e preencha:

```sh
cp .env.example .env
```

Variáveis obrigatórias:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SESSION_SECRET`
- `ADMIN_PASSWORD` e/ou `DASHBOARD_PASSWORD`
- `APP_ORIGIN`

## Desenvolvimento

```sh
npm install
npm run dev
```

O `npm run dev` sobe:

- frontend Vite em `http://localhost:8080`
- backend Express em `http://localhost:3001`

No desenvolvimento, o Vite faz proxy de `/api` para o backend.

## Produção

```sh
npm run build
npm run start
```

Em produção, o Express serve a API e também os arquivos do `dist/`.

Importante:

- agora o projeto precisa de runtime Node no deploy; hospedar só o build estático do Vite não basta
- o frontend e a API saem do mesmo processo em produção
- use `NODE_ENV=production`

### Render

O repositório já inclui `render.yaml` com:

- `buildCommand`: `npm ci && npm run build`
- `startCommand`: `npm run start`
- `healthCheckPath`: `/api/health`

### Docker

O repositório também inclui `Dockerfile` e `.dockerignore`.

Build local:

```sh
docker build -t maker-info-express .
docker run --env-file .env -p 3001:3001 maker-info-express
```

### Railway / Fly / Heroku-like

Também deixei um `Procfile` com:

```txt
web: npm run start
```

## Operação

Validar ambiente:

```sh
npm run check:env
```

Auditar senhas legadas das empresas sem alterar nada:

```sh
npm run migrate:empresa-passwords
```

Aplicar a migração de hash nas senhas legadas:

```sh
npm run migrate:empresa-passwords -- --apply
```

## Verificação

Comandos usados nesta alteração:

```sh
npm run check:env
npm run migrate:empresa-passwords
npm run lint
npm run build
npm test
```

O `npm run lint` passa; no momento ele só emite warnings antigos de Fast Refresh nos componentes do kit `ui`.
