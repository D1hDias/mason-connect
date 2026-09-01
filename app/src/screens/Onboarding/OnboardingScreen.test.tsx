import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { ProfileCategoria } from '../../data/profile';
import { navItems, moduleItems } from '../../shell/screens-meta';
import { OnboardingScreen } from './OnboardingScreen';

// Mutable override read by the `vi.mock` factory below, same pattern as
// `MembrosScreen.test.tsx` — `profile.categoria` is always `'gestor'` in the
// real mock, so the `'empresario'` branch is only reachable this way.
const profileState = vi.hoisted(() => ({ override: null as ProfileCategoria | null }));

vi.mock('../../data/profile', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../data/profile')>();
  return {
    ...actual,
    get profile() {
      return profileState.override ? { ...actual.profile, categoria: profileState.override } : actual.profile;
    },
  };
});

afterEach(() => {
  cleanup();
  profileState.override = null;
});

function renderScreen() {
  return render(
    <MemoryRouter initialEntries={['/onboarding']}>
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/login" element={<p>Login screen</p>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('OnboardingScreen — header', () => {
  it('"Sair" navigates to /login', async () => {
    const user = userEvent.setup();
    renderScreen();

    await user.click(screen.getByRole('button', { name: 'Sair' }));

    expect(screen.getByText('Login screen')).toBeInTheDocument();
  });
});

describe('OnboardingScreen — branch profile.categoria === "empresario"', () => {
  afterEach(() => {
    profileState.override = null;
  });

  function renderEmpresario() {
    profileState.override = 'empresario';
    return renderScreen();
  }

  it('renders "Boas-vindas, Irmão" with the initial subtitle (1 of 3 steps done, the welcome step)', () => {
    renderEmpresario();

    expect(screen.getByText('Boas-vindas, Irmão')).toBeInTheDocument();
    expect(screen.getByText('1 de 3 etapas concluídas · aprovado em 12 de agosto')).toBeInTheDocument();

    const boasVindas = screen.getByRole('button', { name: /Boas-vindas do núcleo/ });
    expect(within(boasVindas).getByText('Concluída')).toBeInTheDocument();

    const pilares = screen.getByRole('button', { name: /Apresentação dos 12 Pilares/ });
    expect(within(pilares).getByText('Pendente')).toBeInTheDocument();
    const umAUm = screen.getByRole('button', { name: /1ª reunião 1-a-1 com o padrinho/ });
    expect(within(umAUm).getByText('Pendente')).toBeInTheDocument();
  });

  it('clicking a pending step marks it done, shows the right badge, updates the subtitle, and fires the toast', async () => {
    const user = userEvent.setup();
    renderEmpresario();

    const pilares = screen.getByRole('button', { name: /Apresentação dos 12 Pilares/ });
    await user.click(pilares);

    expect(within(pilares).getByText('Concluída')).toBeInTheDocument();
    expect(screen.getByText('2 de 3 etapas concluídas · aprovado em 12 de agosto')).toBeInTheDocument();
    expect(screen.getByText('Etapa registrada. Seu padrinho foi notificado.')).toBeInTheDocument();
  });

  it('shows the "concluded" subtitle once all 3 steps are done', async () => {
    const user = userEvent.setup();
    renderEmpresario();

    await user.click(screen.getByRole('button', { name: /Apresentação dos 12 Pilares/ }));
    await user.click(screen.getByRole('button', { name: /1ª reunião 1-a-1 com o padrinho/ }));

    expect(screen.getByText('Percurso concluído · bem-vindo ao núcleo')).toBeInTheDocument();
  });

  it('clicking an already-completed step is a no-op — no duplicate toast', async () => {
    const user = userEvent.setup();
    renderEmpresario();

    const boasVindas = screen.getByRole('button', { name: /Boas-vindas do núcleo/ });
    await user.click(boasVindas);

    expect(screen.queryByText('Etapa registrada. Seu padrinho foi notificado.')).not.toBeInTheDocument();
    expect(screen.getByText('1 de 3 etapas concluídas · aprovado em 12 de agosto')).toBeInTheDocument();
  });

  it('renders "Seu padrinho" (Leonardo Almeida) and "Agendar reunião 1-a-1" as a no-op — clicking it throws nothing and changes nothing', async () => {
    const user = userEvent.setup();
    renderEmpresario();

    expect(screen.getAllByText('Leonardo Almeida').length).toBeGreaterThan(0);
    expect(screen.getByText('Consultoria Empresarial · desde março de 2023')).toBeInTheDocument();

    const botao = screen.getByRole('button', { name: 'Agendar reunião 1-a-1' });
    await expect(user.click(botao)).resolves.not.toThrow();
  });

  it('renders "Prazo de conclusão" with the "Dia 19 de 30" badge', () => {
    renderEmpresario();

    expect(screen.getByText('Prazo de conclusão')).toBeInTheDocument();
    expect(screen.getByText('Dia 19 de 30')).toBeInTheDocument();
  });
});

describe('OnboardingScreen — branch profile.categoria === "gestor" (real mock value)', () => {
  it('renders "Onboarding do núcleo" with the 2 Stats', () => {
    renderScreen();

    expect(screen.getByText('Onboarding do núcleo')).toBeInTheDocument();
    expect(screen.getByText('4 membros em percurso de entrada')).toBeInTheDocument();
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
    expect(screen.getByText('dos 24 membros')).toBeInTheDocument();
    expect(screen.getByText('Acima de 30 dias')).toBeInTheDocument();
    expect(screen.getByText('requer conversa')).toBeInTheDocument();
  });

  it('renders the 4 emOnboarding rows with the right detail and badge — Marcos Vinícius (34 dias) is "critical", the other 3 (<= 30 dias) are "neutral"', () => {
    renderScreen();

    expect(screen.getByText('Rafael Teixeira')).toBeInTheDocument();
    expect(screen.getByText('Pilares pendentes · 8 dias desde a aprovação')).toBeInTheDocument();
    expect(screen.getByText('Camila Rocha')).toBeInTheDocument();
    expect(screen.getByText('1-a-1 pendente · 12 dias desde a aprovação')).toBeInTheDocument();
    expect(screen.getByText('Davi Lopes')).toBeInTheDocument();
    expect(screen.getByText('1-a-1 pendente · 21 dias desde a aprovação')).toBeInTheDocument();
    expect(screen.getByText('Marcos Vinícius')).toBeInTheDocument();
    expect(screen.getByText('1-a-1 pendente · 34 dias desde a aprovação')).toBeInTheDocument();

    const marcosRow = screen.getByText('Marcos Vinícius').closest('div.flex.items-center.justify-between');
    expect(marcosRow).not.toBeNull();
    expect(within(marcosRow as HTMLElement).getByText('34 dias')).toBeInTheDocument();

    const rafaelRow = screen.getByText('Rafael Teixeira').closest('div.flex.items-center.justify-between');
    expect(within(rafaelRow as HTMLElement).getByText('8 dias')).toBeInTheDocument();
  });

  it('renders the "Conclusão por etapa" card with the 3 literal ProgressBars', () => {
    renderScreen();

    expect(screen.getByText('Conclusão por etapa')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Boas-vindas' })).toHaveAttribute('aria-valuenow', '100');
    expect(screen.getByRole('progressbar', { name: 'Apresentação dos 12 Pilares' })).toHaveAttribute(
      'aria-valuenow',
      '75',
    );
    expect(screen.getByRole('progressbar', { name: '1ª reunião com o padrinho' })).toHaveAttribute(
      'aria-valuenow',
      '25',
    );
  });
});

describe('OnboardingScreen — routing surface', () => {
  it('is not reachable from navItems or moduleItems (achado #5 — only a direct route)', () => {
    expect(navItems.some((item) => item.path === '/onboarding')).toBe(false);
    expect(moduleItems.some((item) => item.path === '/onboarding')).toBe(false);
  });
});
