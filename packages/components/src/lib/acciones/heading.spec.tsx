import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Heading } from './heading';

describe('Heading', () => {
  it('usa el nivel como elemento y rol', () => {
    render(<Heading level={3}>Facturas</Heading>);
    const heading = screen.getByRole('heading', { level: 3, name: 'Facturas' });
    expect(heading.tagName).toBe('H3');
    expect(heading).toHaveClass('text-ui-heading-md');
  });

  it('el tamaño se separa del nivel', () => {
    render(
      <Heading level={2} size="sm">
        Resumen
      </Heading>,
    );
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveClass('text-ui-heading-sm');
    expect(heading).not.toHaveClass('text-ui-heading-lg');
  });

  it('pasa ref y props', () => {
    const ref = createRef<HTMLHeadingElement>();
    render(
      <Heading level={1} ref={ref} id="titulo">
        Inicio
      </Heading>,
    );
    expect(ref.current).toBe(screen.getByRole('heading', { level: 1 }));
    expect(ref.current).toHaveAttribute('id', 'titulo');
  });
});
