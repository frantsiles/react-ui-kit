import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Inline } from './inline';
import { Stack } from './stack';

describe('Stack', () => {
  it('apila en columna con el espacio md por defecto', () => {
    render(
      <Stack data-testid="s">
        <p>Uno</p>
        <p>Dos</p>
      </Stack>,
    );
    const stack = screen.getByTestId('s');
    expect(stack.tagName).toBe('DIV');
    expect(stack).toHaveClass('flex', 'flex-col', 'gap-ui-md', 'items-stretch');
  });

  it('gap, align y justify', () => {
    render(<Stack data-testid="s" gap="xl" align="center" justify="between" />);
    expect(screen.getByTestId('s')).toHaveClass('gap-ui-xl', 'items-center', 'justify-between');
  });

  it('como lista mantiene el rol list', () => {
    render(
      <Stack as="ul" aria-label="Facturas">
        <li>Enero</li>
        <li>Febrero</li>
      </Stack>,
    );
    const list = screen.getByRole('list', { name: 'Facturas' });
    expect(list.tagName).toBe('UL');
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('el className del usuario gana', () => {
    render(<Stack data-testid="s" gap="sm" className="gap-ui-2xl" />);
    const stack = screen.getByTestId('s');
    expect(stack).toHaveClass('gap-ui-2xl');
    expect(stack).not.toHaveClass('gap-ui-sm');
  });

  it('pasa ref y props', () => {
    const ref = createRef<HTMLElement>();
    render(<Stack as="section" ref={ref} aria-labelledby="t" />);
    expect(ref.current?.tagName).toBe('SECTION');
    expect(ref.current).toHaveAttribute('aria-labelledby', 't');
  });
});

describe('Inline', () => {
  it('pone en fila, centra y pasa de línea por defecto', () => {
    render(<Inline data-testid="i" />);
    expect(screen.getByTestId('i')).toHaveClass(
      'flex',
      'flex-row',
      'flex-wrap',
      'gap-ui-sm',
      'items-center',
    );
  });

  it('wrap={false}, justify y align', () => {
    render(<Inline data-testid="i" wrap={false} justify="between" align="baseline" gap="none" />);
    expect(screen.getByTestId('i')).toHaveClass(
      'flex-nowrap',
      'justify-between',
      'items-baseline',
      'gap-0',
    );
  });

  it('como lista mantiene el rol list y respeta un role propio', () => {
    const { rerender } = render(
      <Inline as="ul">
        <li>A</li>
      </Inline>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    rerender(
      <Inline as="ul" role="group" aria-label="Filtros">
        <li>A</li>
      </Inline>,
    );
    expect(screen.getByRole('group', { name: 'Filtros' })).toBeInTheDocument();
  });

  it('pasa ref y props', () => {
    const ref = createRef<HTMLElement>();
    render(<Inline as="nav" ref={ref} aria-label="Pie" />);
    expect(ref.current).toBe(screen.getByRole('navigation', { name: 'Pie' }));
  });
});
