import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from './Select';

const OPTIONS = [
  { label: 'Gestor', value: 'gestor' },
  { label: 'Administrativo', value: 'administrativo' },
];

describe('Select', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders every option', () => {
    render(<Select label="Entrar como" value="gestor" onChange={() => {}} options={OPTIONS} />);
    expect(screen.getByRole('option', { name: 'Gestor' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Administrativo' })).toBeInTheDocument();
  });

  it('calls onChange when a new option is picked', async () => {
    const onChange = vi.fn();
    render(<Select label="Entrar como" value="gestor" onChange={onChange} options={OPTIONS} />);
    await userEvent.selectOptions(screen.getByLabelText('Entrar como'), 'administrativo');
    expect(onChange).toHaveBeenCalled();
  });
});
