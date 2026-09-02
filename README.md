# mason-connect

## Como rodar localmente

1. **Suba o Postgres local** (a partir da raiz do repo):

   ```bash
   docker compose up -d
   ```

2. **Configure as variáveis de ambiente** dos dois workspaces que precisam delas:

   ```bash
   cp app/.env.example app/.env
   cp server/.env.example server/.env
   ```

   Preencha os valores gerados (ex. `BETTER_AUTH_SECRET`) e ajuste o que for necessário no seu
   ambiente — detalhes de cada variável em `server/README.md`.

3. **Instale as dependências** (na raiz — é um monorepo com workspaces):

   ```bash
   npm install
   ```

4. **Gere/aplique as migrations e crie o usuário de teste**:

   ```bash
   npm run db:generate -w server
   npm run db:migrate -w server
   npm run db:seed -w server
   ```

5. **Suba app + server juntos**:

   ```bash
   npm run dev
   ```

Para detalhes do servidor de autenticação (scripts, credenciais de teste, envio de e-mail via
Resend, escopo), veja [`server/README.md`](server/README.md).
