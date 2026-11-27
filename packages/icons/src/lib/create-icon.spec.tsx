import { render, screen } from '@testing-library/react';
import { IconArrowRight, IconCheck, IconSearch } from '../index';

describe('Icon', () => {
  it('es decorativo por defecto: oculto a lectores de pantalla y no enfocable', () => {
    const { container } = render(<IconSearch />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).not.toHaveAttribute('role');
  });

  it('con label expone role="img" y nombre accesible', () => {
    render(<IconCheck label="Completado" />);
    const icon = screen.getByRole('img', { name: 'Completado' });
    expect(icon).not.toHaveAttribute('aria-hidden');
  });

  it('con aria-labelledby también se considera significativo', () => {
    render(
      <>
        <span id="lbl">Buscar</span>
        <IconSearch aria-labelledby="lbl" />
      </>,
    );
    expect(screen.getByRole('img', { name: 'Buscar' })).toBeInTheDocument();
  });

  it('usa 1em por defecto para escalar con el texto', () => {
    const { container } = render(<IconSearch />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '1em');
  });

  it.each([
    ['xs', '12'],
    ['sm', '16'],
    ['md', '20'],
    ['lg', '24'],
    ['xl', '32'],
  ] as const)('size="%s" se traduce a %spx', (size, px) => {
    const { container } = render(<IconSearch size={size} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', px);
    expect(svg).toHaveAttribute('height', px);
  });

  it('acepta un tamaño numérico', () => {
    const { container } = render(<IconSearch size={18} />);
    expect(container.querySelector('svg')).toHaveAttribute('width', '18');
  });

  it('hereda el color del texto con currentColor', () => {
    const { container } = render(<IconSearch />);
    expect(container.querySelector('svg')).toHaveAttribute('stroke', 'currentColor');
  });

  it('los íconos direccionales se espejan en RTL; los demás no', () => {
    const { container } = render(
      <>
        <IconArrowRight />
        <IconCheck />
      </>,
    );
    const [arrow, check] = Array.from(container.querySelectorAll('svg'));
    expect(arrow).toHaveClass('rtl:-scale-x-100');
    expect(check).not.toHaveClass('rtl:-scale-x-100');
  });

  it('pasa className, ref y otros atributos al <svg>', () => {
    let node: SVGSVGElement | null = null;
    render(
      <IconSearch
        className="text-red-500"
        data-testid="icon"
        ref={(el) => {
          node = el;
        }}
      />,
    );
    const svg = screen.getByTestId('icon');
    expect(svg).toHaveClass('text-red-500', 'shrink-0');
    expect(node).toBe(svg);
  });

  it('tiene displayName para depurar', () => {
    expect(IconSearch.displayName).toBe('IconSearch');
  });

  it('no tiene violaciones de accesibilidad (decorativo y con label)', async () => {
    const { container } = render(
      <p>
        <IconSearch /> Buscar <IconCheck label="Verificado" />
      </p>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
