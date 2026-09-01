import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PainelScreen } from './screens/Painel';
import { MembrosScreen } from './screens/Membros';
import { FinanceiroScreen } from './screens/Financeiro';
import { PerfilScreen } from './screens/Perfil';
import { LoginScreen, RecuperarSenhaScreen, RedefinirSenhaScreen } from './screens/Acesso';
import { OnboardingScreen } from './screens/Onboarding';

/**
 * 4 rotas irmãs sob `AppShell`, todas com suas telas reais (Tasks 6-9;
 * `/perfil` foi a última a sair do placeholder), mais 3 rotas de autenticação
 * REAIS (Task 10, `screens/Acesso/`) — `/login`, `/recuperar-senha`,
 * `/redefinir-senha` — e `/onboarding` (Task 11, `screens/Onboarding/`) —
 * todas FORA do `AppShell`: essas telas não têm `BottomNav`/sidebar/topbar
 * compartilhados, só o próprio `AcessoLayout`/`OnboardingHeader`.
 * `/onboarding` também não entra em `navItems`/`moduleItems` (achado #5 do
 * plano) — só alcançável por navegação direta. `/` e o catch-all `*`
 * continuam apontando pra `/painel`: ainda não há gate de sessão (achado #20
 * do plano, fora de escopo aqui).
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/painel" replace />} />
      <Route element={<AppShell />}>
        <Route path="/painel" element={<PainelScreen />} />
        <Route path="/membros" element={<MembrosScreen />} />
        <Route path="/financeiro" element={<FinanceiroScreen />} />
        <Route path="/perfil" element={<PerfilScreen />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
