import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PainelScreen } from './screens/Painel';
import { MembrosScreen } from './screens/Membros';
import { FinanceiroScreen } from './screens/Financeiro';
import { PerfilScreen } from './screens/Perfil';

/**
 * 4 rotas irmãs sob `AppShell`, todas com suas telas reais (Tasks 6-9;
 * `/perfil` foi a última a sair do placeholder).
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
      <Route path="*" element={<Navigate to="/painel" replace />} />
    </Routes>
  );
}
