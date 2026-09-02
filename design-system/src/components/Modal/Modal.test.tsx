import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './Modal';

describe('Modal', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders children when open', () => {
    render(
      <Modal open onClose={vi.fn()}>
        conteúdo
      </Modal>
    );
    expect(screen.getByText('conteúdo')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        conteúdo
      </Modal>
    );
    expect(screen.queryByText('conteúdo')).not.toBeInTheDocument();
  });

  it('renders nothing at all into the DOM when closed', () => {
    const { container } = render(
      <Modal open={false} onClose={vi.fn()}>
        conteúdo
      </Modal>
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('does not call onClose when the scrim is clicked', async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose}>
        conteúdo
      </Modal>
    );
    // The scrim is the outermost element Modal renders.
    await userEvent.click(container.firstElementChild as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape is pressed while open', async () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose}>
        conteúdo
      </Modal>
    );

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not register an Escape listener when closed (no leak)', async () => {
    const onClose = vi.fn();
    render(
      <Modal open={false} onClose={onClose}>
        conteúdo
      </Modal>
    );

    await userEvent.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });
});
