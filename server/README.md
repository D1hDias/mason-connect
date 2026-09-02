# Mason Connect — Auth Server

Servidor de autenticação real do Mason Connect: [Better Auth](https://www.better-auth.com/) +
[Drizzle ORM](https://orm.drizzle.team/) sobre Postgres + [Resend](https://resend.com/) para
e-mails de redefinição de senha, servido via Express.

Não há cadastro público: contas são provisionadas manualmente (hoje, só via o script de seed
abaixo, pensado para desenvolvimento/teste local).

## Subir localmente

1. **Suba o Postgres local** (a partir da raiz do repo):

   ```bash
   docker compose up -d
   ```

   Isso sobe um container `mason-connect-postgres` (Postgres 16) expondo a porta **5435** do
   host (as portas 5432/5433/5434 já estavam ocupadas por outros projetos nesta máquina).

2. **Configure as variáveis de ambiente**:

   ```bash
   cp server/.env.example server/.env
   ```

   Preencha `server/.env`:
   - `DATABASE_URL` — já vem pré-preenchido apontando pra porta 5435 acima; ajuste se a sua
     configuração local for diferente.
   - `BETTER_AUTH_SECRET` — gere um valor com `openssl rand -base64 32` ou
     `npx @better-auth/cli@latest secret`.
   - `RESEND_API_KEY` — opcional em dev local; só é necessário pra exercitar o envio real de
     e-mail de redefinição de senha.
   - `CORS_ORIGIN` / `BETTER_AUTH_URL` / `PORT` — os valores padrão do `.env.example` funcionam
     para desenvolvimento local com o app em `http://localhost:5173`.

3. **Gere e aplique as migrations, depois rode o seed** (a partir da raiz do repo):

   ```bash
   npm run db:generate -w server
   npm run db:migrate -w server
   npm run db:seed -w server
   ```

   O seed cria **um único usuário de teste**, via a API real do Better Auth (não um `INSERT`
   SQL cru — a senha passa pelo hashing de verdade da lib):

   - E-mail: `teste@masonconnect.local`
   - Senha: `TesteSenh@123`

   Essas credenciais existem só para desenvolvimento/teste local e nunca devem ser usadas em
   produção.

4. **Suba o servidor**:

   ```bash
   npm run dev -w server
   ```

   O servidor sobe em `http://localhost:8787` (ou o `PORT` configurado). Rota de saúde:
   `GET /health`. Rotas de autenticação do Better Auth ficam sob `/api/auth/*`.

## Scripts

| Script | O que faz |
| --- | --- |
| `npm run dev -w server` | Sobe o servidor com hot-reload (`tsx watch`) |
| `npm run build -w server` | Compila para `dist/` |
| `npm run typecheck -w server` | `tsc --noEmit` |
| `npm test -w server` | Roda o smoke test (Vitest) contra o Postgres local |
| `npm run db:generate -w server` | Gera uma migration Drizzle a partir do schema |
| `npm run db:migrate -w server` | Aplica as migrations pendentes no banco |
| `npm run db:seed -w server` | Cria o usuário de teste (ver acima) |

## Envio de e-mail (Resend)

`RESEND_API_KEY` não está preenchida com uma chave real nesta tarefa — o remetente configurado
(`onboarding@resend.dev`) é o domínio de teste padrão do Resend, que funciona sem verificação de
domínio próprio. Antes de ir para produção, troque `FROM_ADDRESS` em `src/email.ts` por um
endereço em um domínio verificado do Mason Connect.

Sem `RESEND_API_KEY`, o servidor sobe normalmente (o cliente Resend é instanciado sob demanda,
só quando um e-mail é de fato enviado) — o envio falha apenas quando `requestPasswordReset` é
chamado, e essa falha é registrada no log do servidor (`[auth] falha ao enviar e-mail de
redefinição de senha: ...`). A resposta HTTP ao cliente não é afetada: `sendResetPassword` é
fire-and-forget por design (mitigação de timing attack).

O smoke test **não** exercita o envio real de e-mail (não há chave de API real disponível nesta
tarefa) — ele testa o fluxo central de autenticação (signup/signin/sessão/signout) e, para o
teste de `requestPasswordReset`, faz stub de `sendEmail`. A entrega real de e-mail via Resend
fica como verificação manual, fora do escopo desta tarefa.

## Escopo

Fora do escopo desta tarefa: provisionar a VPS Hostinger de verdade (deploy, DNS, TLS, processo
em produção). Aqui só o código e o banco local funcionando, prontos para deploy futuro.
