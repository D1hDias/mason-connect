import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppOverlaysProvider, useConfirmModal, useDrawer, useToast } from './AppOverlaysProvider';

// Uses `fireEvent` (synchronous) rather than `userEvent` here — combining
// `userEvent`'s internal async delays with `vi.useFakeTimers()` hangs
// (observed as a 5s test timeout on every test in this file).

function Harness({ onConfirmSpy }: { onConfirmSpy: () => void }) {
  const { open, openDrawer, closeDrawer } = useDrawer();
  const { confirm } = useConfirmModal();
  const { showToast } = useToast();

  return (
    <div>
      <span data-testid="drawer-open">{String(open)}</span>
      <button onClick={openDrawer}>open-drawer</button>
      <button onClick={closeDrawer}>close-drawer</button>
      <button
        onClick={() =>
          confirm({
            titulo: 'Remover membro',
            corpo: 'Tem certeza?',
            nota: 'Esta ação fica registrada.',
            acao: 'Remover',
            onConfirm: onConfirmSpy,
          })
        }
      >
        open-confirm
      </button>
      <button
        onClick={() =>
          confirm({
            titulo: 'Com motivo',
            corpo: 'Corpo',
            nota: 'Nota',
            acao: 'Confirmar',
            pedeMotivo: true,
            onConfirm: onConfirmSpy,
          })
        }
      >
        open-confirm-motivo
      </button>
      <button onClick={() => showToast('Ação concluída com sucesso')}>show-toast</button>
    </div>
  );
}

function renderHarness(onConfirmSpy: () => void) {
  return render(
    <MemoryRouter>
      <AppOverlaysProvider>
        <Harness onConfirmSpy={onConfirmSpy} />
      </AppOverlaysProvider>
    </MemoryRouter>,
  );
}

function click(name: string) {
  fireEvent.click(screen.getByRole('button', { name }));
}

// Wraps the fake-timer advance in `act()` — the toast's `setTimeout`
// callback updates state outside of any event handler, so React won't
// flush it into the DOM before the next assertion without this.
function advance(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('AppOverlaysProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe('useDrawer', () => {
    it('opens and closes via openDrawer/closeDrawer', () => {
      renderHarness(vi.fn());

      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');

      click('open-drawer');
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');

      click('close-drawer');
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
    });
  });

  describe('useConfirmModal', () => {
    it('opens the modal with the given content', () => {
      renderHarness(vi.fn());

      click('open-confirm');

      expect(screen.getByText('Remover membro')).toBeInTheDocument();
      expect(screen.getByText('Tem certeza?')).toBeInTheDocument();
      expect(screen.getByText('Esta ação fica registrada.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Remover' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
    });

    it('renders the "Motivo" input only when pedeMotivo is true', () => {
      renderHarness(vi.fn());

      click('open-confirm');
      expect(screen.queryByLabelText('Motivo (opcional)')).toBeNull();

      click('Cancelar');
      click('open-confirm-motivo');
      expect(screen.getByLabelText('Motivo (opcional)')).toBeInTheDocument();
    });

    it('closes without calling onConfirm when Cancelar is clicked', () => {
      const onConfirmSpy = vi.fn();
      renderHarness(onConfirmSpy);

      click('open-confirm');
      click('Cancelar');

      expect(onConfirmSpy).not.toHaveBeenCalled();
      expect(screen.queryByText('Remover membro')).toBeNull();
    });

    it('calls onConfirm and closes when the action button is clicked', () => {
      const onConfirmSpy = vi.fn();
      renderHarness(onConfirmSpy);

      click('open-confirm');
      click('Remover');

      expect(onConfirmSpy).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Remover membro')).toBeNull();
    });

    it('closes an open drawer when confirm() is called', () => {
      renderHarness(vi.fn());

      click('open-drawer');
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('true');

      click('open-confirm');
      expect(screen.getByTestId('drawer-open')).toHaveTextContent('false');
    });
  });

  describe('useToast', () => {
    it('shows the message and hides it after 4000ms', () => {
      renderHarness(vi.fn());

      click('show-toast');
      expect(screen.getByText('Ação concluída com sucesso')).toBeInTheDocument();

      advance(3999);
      expect(screen.getByText('Ação concluída com sucesso')).toBeInTheDocument();

      advance(1);
      expect(screen.queryByText('Ação concluída com sucesso')).toBeNull();
    });

    it('clears a pending timeout instead of letting an earlier toast hide a newer one early', () => {
      renderHarness(vi.fn());

      click('show-toast');
      advance(3000);
      click('show-toast');
      advance(1500);

      // 4500ms since the first click, but only 1500ms since the second —
      // the second call's timer should still be pending.
      expect(screen.getByText('Ação concluída com sucesso')).toBeInTheDocument();

      advance(2500);
      expect(screen.queryByText('Ação concluída com sucesso')).toBeNull();
    });

    it('closes an open modal when showToast() is called', () => {
      renderHarness(vi.fn());

      click('open-confirm');
      expect(screen.getByText('Remover membro')).toBeInTheDocument();

      click('show-toast');
      expect(screen.queryByText('Remover membro')).toBeNull();
      expect(screen.getByText('Ação concluída com sucesso')).toBeInTheDocument();
    });
  });

  describe('hook usage outside AppOverlaysProvider', () => {
    it('throws a clear error', () => {
      function BadDrawer() {
        useDrawer();
        return null;
      }
      // Suppress React's expected error-boundary console noise for this assertion.
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => render(<BadDrawer />)).toThrow('useDrawer must be used within an AppOverlaysProvider');
      spy.mockRestore();
    });
  });
});
