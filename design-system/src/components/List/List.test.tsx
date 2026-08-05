import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { List } from './List';
import { ListRow } from './ListRow';

describe('List', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders the header banner when provided', () => {
    render(
      <List header="Extrato do caixa">
        <ListRow title="Mensalidade" />
      </List>
    );
    expect(screen.getByText('Extrato do caixa')).toBeInTheDocument();
  });

  it('renders every row', () => {
    render(
      <List>
        <ListRow title="Leonardo A." />
        <ListRow title="Luetil S." />
      </List>
    );
    expect(screen.getByText('Leonardo A.')).toBeInTheDocument();
    expect(screen.getByText('Luetil S.')).toBeInTheDocument();
  });

  it('applies the zebra background class to odd rows only', () => {
    render(
      <List>
        <ListRow title="Row 0" />
        <ListRow title="Row 1" />
      </List>
    );
    expect(screen.getByText('Row 0').closest('div.flex')).not.toHaveClass('bg-brand-cream');
    expect(screen.getByText('Row 1').closest('div.flex')).toHaveClass('bg-brand-cream');
  });
});
