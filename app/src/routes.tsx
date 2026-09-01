import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PainelScreen } from './screens/Painel';
import { MembrosScreen } from './screens/Membros';
import { FinanceiroScreen } from './screens/Financeiro';
import { PerfilScreen } from './screens/Perfil';
import { PresencaScreen } from './screens/Presenca';
import { IndicacoesScreen } from './screens/Indicacoes';
import { ConfigScreen } from './screens/Config';
import { LoginScreen, RecuperarSenhaScreen, RedefinirSenhaScreen } from './screens/Acesso';
import { OnboardingScreen } from './screens/Onboarding';

/**
 * Rotas irmãs sob `AppShell`, todas com suas telas reais (Tasks 6-9 e 12;
 * `/perfil` foi a última das 4 originais a sair do placeholder, `/presenca`
 * é a primeira das telas de gestão da Fase 2), mais 3 rotas de autenticação
 * REAIS (Task 10, `screens/Acesso/`) — `/login`, `/recuperar-senha`,
 * `/redefinir-senha` — e `/onboarding` (Task 11, `screens/Onboarding/`) —
 * todas FORA do `AppShell`: essas telas não têm `BottomNav`/sidebar/topbar
 * compartilhados, só o próprio `AcessoLayout`/`OnboardingHeader`. `/presenca`,
 * ao contrário, fica DENTRO do `AppShell` — já está em `moduleItems`
 * (Task 5) e usa o `BottomNav`/sidebar normais, sem gate de perfil (achado
 * #14 do plano). `/onboarding` também não entra em `navItems`/`moduleItems`
 * (achado #5 do plano) — só alcançável por navegação direta. `/` e o
 * catch-all `*` continuam apontando pra `/painel`: ainda não há gate de
 * sessão (achado #20 do plano, fora de escopo aqui). `/indicacoes` (Task
 * 13) segue o mesmo padrão de `/presenca`: dentro do `AppShell`, sem gate
 * de perfil. `/config` (Task 14) também fica dentro do `AppShell`, mas com
 * gate de perfil próprio (`canEditConfig`, dentro da própria tela): só o
 * perfil `'gestor'` edita os parâmetros do grupo, os demais veem o
 * `EmptyState`.
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
        <Route path="/presenca" element={<PresencaScreen />} />
        <Route path="/indicacoes" element={<IndicacoesScreen />} />
        <Route path="/config" element={<ConfigScreen />} />
      </Route>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/recuperar-senha" element={<RecuperarSenhaScreen />} />
      <Route path="/redefinir-senha" element={<RedefinirSenhaScreen />} />
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
