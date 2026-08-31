import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './shell/AppShell';

/**
 * 4 rotas irmãs sob `AppShell`, com placeholders simples — as telas reais
 * (Tasks 6-9) chegam no Task 10, que troca estes `<div>` pelos componentes
 * de tela de verdade sem precisar mexer nesta árvore de rotas.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/painel" replace />} />
      <Route element={<AppShell />}>
        <Route path="/painel" element={<div>Painel</div>} />
        <Route path="/membros" element={<div>Membros</div>} />
        <Route path="/financeiro" element={<div>Financeiro</div>} />
        <Route path="/perfil" element={<div>Perfil</div>} />
      </Route>
    </Routes>
  );
}
