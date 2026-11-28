import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Text } from './text';

describe('Text', () => {
  it('es un <p> con el estilo body por defecto', () => {
    render(<Text>Hola</Text>);
    const text = screen.getByText('Hola');
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('text-ui-body', 'text-ui-fg');
  });

  it('cambia elemento, estilo, tono y peso sin mezclar clases', () => {
    render(
      <Text as="span" variant="caption" tone="muted" weight="semibold">
        Nota
      </Text>,
    );
    const text = screen.getByText('Nota');
    expect(text.tagName).toBe('SPAN');
    expect(text).toHaveClass('text-ui-caption', 'text-ui-fg-muted', 'font-ui-semibold');
  });

  it('pasa ref y props al elemento', () => {
    const ref = createRef<HTMLElement>();
    render(
      <Text as="div" ref={ref} id="t" className="max-w-(--ui-measure)">
        Bloque
      </Text>,
    );
    expect(ref.current).toBe(screen.getByText('Bloque'));
    expect(ref.current).toHaveAttribute('id', 't');
    expect(ref.current).toHaveClass('max-w-(--ui-measure)');
  });
});
