import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Card, CardBody, CardFooter, CardHeader } from './card';
import { ScrollArea } from './scroll-area';

describe('Card', () => {
  it('div con borde por defecto y partes', () => {
    render(
      <Card data-testid="c">
        <CardHeader title="Plan Equipo" description="Hasta 10 personas" actions={<button>Editar</button>} />
        <CardBody>Contenido</CardBody>
        <CardFooter>
          <button>Elegir</button>
        </CardFooter>
      </Card>,
    );
    const card = screen.getByTestId('c');
    expect(card.tagName).toBe('DIV');
    expect(card).toHaveClass('@container', 'border', 'border-ui-border-subtle', 'bg-ui-surface');
    expect(card).not.toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('heading', { level: 3, name: 'Plan Equipo' })).toBeInTheDocument();
    expect(screen.getByText('Hasta 10 personas')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
  });

  it('como section se nombra con el título', () => {
    render(
      <Card as="section">
        <CardHeader title="Facturación" headingLevel={2} />
      </Card>,
    );
    const region = screen.getByRole('region', { name: 'Facturación' });
    expect(region.tagName).toBe('SECTION');
    expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute(
      'id',
      region.getAttribute('aria-labelledby'),
    );
  });

  it('un aria-label del usuario gana sobre el título', () => {
    render(
      <Card as="article" aria-label="Resumen del mes">
        <CardHeader title="Resumen" />
      </Card>,
    );
    const article = screen.getByRole('article', { name: 'Resumen del mes' });
    expect(article).not.toHaveAttribute('aria-labelledby');
  });

  it('variantes', () => {
    const { rerender } = render(<Card data-testid="c" variant="raised" />);
    expect(screen.getByTestId('c')).toHaveClass('shadow-ui-raised', 'bg-ui-surface-raised');
    rerender(<Card data-testid="c" variant="subtle" />);
    expect(screen.getByTestId('c')).toHaveClass('bg-ui-surface-muted', 'border-transparent');
  });

  it('ref y className del usuario', () => {
    const ref = createRef<HTMLElement>();
    render(<Card ref={ref} data-testid="c" className="p-ui-sm" />);
    expect(ref.current).toBe(screen.getByTestId('c'));
    expect(ref.current).toHaveClass('p-ui-sm');
    expect(ref.current).not.toHaveClass('p-ui-lg');
  });

  it('CardFooter alinea al final por defecto', () => {
    render(<CardFooter data-testid="f" />);
    expect(screen.getByTestId('f')).toHaveClass('justify-end');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <Card as="section">
        <CardHeader title="Facturación" headingLevel={2} description="Último pago: 3 de noviembre" />
        <CardBody>Plan Equipo, 10 personas.</CardBody>
        <CardFooter>
          <button>Cambiar plan</button>
        </CardFooter>
      </Card>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('ScrollArea', () => {
  /** jsdom no calcula layout: simula un contenido de 500 px en una zona de 100 px. */
  function mockOverflow(overflowing: boolean) {
    vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(overflowing ? 500 : 100);
    vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100);
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('región con nombre, enfocable si desborda y con alto máximo', () => {
    mockOverflow(true);
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} aria-label="Historial" maxHeight="10rem">
        <p>Uno</p>
      </ScrollArea>,
    );
    const region = screen.getByRole('region', { name: 'Historial' });
    expect(ref.current).toBe(region);
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region.style.maxHeight).toBe('10rem');
    expect(region).toHaveClass('overflow-y-auto');
  });

  it('sin desborde no agrega una parada de Tab', () => {
    mockOverflow(false);
    render(<ScrollArea aria-label="Historial" />);
    expect(screen.getByRole('region', { name: 'Historial' })).not.toHaveAttribute('tabindex');
  });

  it('orientación horizontal', () => {
    render(<ScrollArea aria-label="Tabla" orientation="horizontal" />);
    expect(screen.getByRole('region', { name: 'Tabla' })).toHaveClass('overflow-x-auto');
  });

  it('sin violaciones de axe', async () => {
    mockOverflow(true);
    const { container } = render(
      <ScrollArea aria-label="Historial" maxHeight="5rem">
        <p>Uno</p>
      </ScrollArea>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
