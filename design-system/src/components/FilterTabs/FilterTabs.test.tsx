import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FilterTabs } from './FilterTabs';

const OPTIONS = [
  { label: 'Todos', value: 'todos' },
  { label: 'Pendentes', value: 'pendentes' },
];

describe('FilterTabs', () => {
  afterEach(() => {
    cleanup();
  });
  it('marks the active option as selected', () => {
    render(<FilterTabs options={OPTIONS} value="todos" onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Todos', pressed: true })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pendentes', pressed: false })).toBeInTheDocument();
  });

  it('calls onChange with the clicked option value', async () => {
    const onChange = vi.fn();
    render(<FilterTabs options={OPTIONS} value="todos" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Pendentes' }));
    expect(onChange).toHaveBeenCalledWith('pendentes');
  });
});
