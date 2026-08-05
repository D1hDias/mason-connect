import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from './Input';

describe('Input', () => {
  afterEach(() => {
    cleanup();
  });

  it('associates the label with the field', () => {
    render(<Input label="Destinatário" value="" onChange={() => {}} />);
    expect(screen.getByLabelText('Destinatário')).toBeInTheDocument();
  });

  it('calls onChange when typed into', async () => {
    const onChange = vi.fn();
    render(<Input label="Destinatário" value="" onChange={onChange} />);
    await userEvent.type(screen.getByLabelText('Destinatário'), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});
