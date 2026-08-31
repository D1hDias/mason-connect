import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PainelScreen } from './screens/Painel';
import { MembrosScreen } from './screens/Membros';
import { FinanceiroScreen } from './screens/Financeiro';

/**
 * 4 rotas irmãs sob `AppShell`. `/painel`, `/membros` e `/financeiro` já
 * usam suas telas reais (Tasks 6-8); `/perfil` (Task 9) segue como
 * placeholder simples até sua tela chegar, sem precisar mexer nesta árvore
 * de rotas.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/painel" replace />} />
      <Route element={<AppShell />}>
        <Route path="/painel" element={<PainelScreen />} />
        <Route path="/membros" element={<MembrosScreen />} />
        <Route path="/financeiro" element={<FinanceiroScreen />} />
        <Route path="/perfil" element={<div>Perfil</div>} />
      </Route>
    </Routes>
  );
}
