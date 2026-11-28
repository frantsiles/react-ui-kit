import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { Container } from './container';
import { Grid } from './grid';

describe('Grid', () => {
  it('una columna por defecto, con gap md', () => {
    render(<Grid data-testid="g" />);
    expect(screen.getByTestId('g')).toHaveClass('grid', 'grid-cols-1', 'gap-ui-md');
  });

  it('columnas fijas', () => {
    render(<Grid data-testid="g" columns={3} gap="lg" />);
    expect(screen.getByTestId('g')).toHaveClass('grid-cols-3', 'gap-ui-lg');
  });

  it('columnas por contenedor: clases @ui-* y un @container alrededor', () => {
    render(<Grid data-testid="g" columns={{ base: 1, sm: 2, lg: 4 }} />);
    const grid = screen.getByTestId('g');
    expect(grid).toHaveClass('grid-cols-1', '@ui-sm:grid-cols-2', '@ui-lg:grid-cols-4');
    expect(grid.parentElement).toHaveClass('@container');
  });

  it('minItemWidth con tamaño de contenedor o longitud', () => {
    const { rerender } = render(<Grid data-testid="g" minItemWidth="xs" />);
    const grid = screen.getByTestId('g');
    expect(grid.className).toContain('auto-fill');
    expect(grid.style.getPropertyValue('--ui-grid-min')).toBe('var(--container-ui-xs)');
    rerender(<Grid data-testid="g" minItemWidth="14rem" style={{ color: 'inherit' }} />);
    expect(grid.style.getPropertyValue('--ui-grid-min')).toBe('14rem');
    expect(grid.style.color).toBe('inherit');
    expect(grid.parentElement).not.toHaveClass('@container');
  });

  it('como lista mantiene el rol list', () => {
    render(
      <Grid as="ul" aria-label="Planes" columns={2}>
        <li>A</li>
        <li>B</li>
      </Grid>,
    );
    expect(screen.getByRole('list', { name: 'Planes' })).toBeInTheDocument();
  });

  it('pasa ref y props al grid', () => {
    const ref = createRef<HTMLElement>();
    render(<Grid ref={ref} columns={{ md: 2 }} id="g" />);
    expect(ref.current).toHaveAttribute('id', 'g');
    expect(ref.current).toHaveClass('grid');
  });
});

describe('Container', () => {
  it('centra, limita el ancho y agrega márgenes', () => {
    render(<Container data-testid="c" />);
    expect(screen.getByTestId('c')).toHaveClass(
      '@container',
      'mx-auto',
      'w-full',
      'max-w-(--container-ui-xl)',
      'px-ui-md',
    );
  });

  it('width y gutter', () => {
    render(<Container data-testid="c" width="prose" gutter={false} />);
    const container = screen.getByTestId('c');
    expect(container).toHaveClass('max-w-(--ui-measure)');
    expect(container).not.toHaveClass('px-ui-md');
  });

  it('as main da el landmark principal', () => {
    const ref = createRef<HTMLElement>();
    render(<Container as="main" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('main'));
  });
});
