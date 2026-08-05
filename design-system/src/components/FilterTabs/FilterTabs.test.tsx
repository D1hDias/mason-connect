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
    expect(screen.getByRole('tab', { name: 'Todos' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Pendentes' })).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onChange with the clicked option value', async () => {
    const onChange = vi.fn();
    render(<FilterTabs options={OPTIONS} value="todos" onChange={onChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Pendentes' }));
    expect(onChange).toHaveBeenCalledWith('pendentes');
  });
});
