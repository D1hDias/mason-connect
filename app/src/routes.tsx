import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { PainelScreen } from './screens/Painel';

/**
 * 4 rotas irmãs sob `AppShell`. `/painel` já usa a tela real (Task 6); as
 * demais (Tasks 7-9) seguem como placeholders simples até suas telas
 * chegarem, sem precisar mexer nesta árvore de rotas.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/painel" replace />} />
      <Route element={<AppShell />}>
        <Route path="/painel" element={<PainelScreen />} />
        <Route path="/membros" element={<div>Membros</div>} />
        <Route path="/financeiro" element={<div>Financeiro</div>} />
        <Route path="/perfil" element={<div>Perfil</div>} />
      </Route>
    </Routes>
  );
}
