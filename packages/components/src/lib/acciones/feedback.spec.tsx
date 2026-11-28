import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { LocaleProvider } from '../fundamentos/locale-provider';
import { Avatar, initialsOf } from './avatar';
import { Divider } from './divider';
import { Skeleton } from './skeleton';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('es una barra de progreso indeterminada con nombre "Cargando"', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('progressbar', { name: 'Cargando' });
    expect(spinner).not.toHaveAttribute('aria-valuenow');
  });

  it('toma el texto del idioma y se puede sobrescribir', () => {
    render(
      <LocaleProvider locale="en">
        <Spinner />
        <Spinner label="Subiendo archivo" />
      </LocaleProvider>,
    );
    expect(screen.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: 'Subiendo archivo' })).toBeInTheDocument();
  });

  it('decorativo queda oculto', () => {
    const { container } = render(<Spinner decorative />);
    expect(screen.queryByRole('progressbar')).toBeNull();
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('pasa ref y props', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Spinner ref={ref} className="text-ui-primary" data-testid="s" />);
    expect(ref.current).toBe(screen.getByTestId('s'));
    expect(ref.current).toHaveClass('text-ui-primary');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(<Spinner />);
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('Skeleton', () => {
  it('es decorativo', () => {
    const { container } = render(<Skeleton lines={3} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('renderiza la cantidad de líneas pedida (mínimo una)', () => {
    const { container, rerender } = render(<Skeleton lines={3} />);
    expect(container.firstElementChild?.children).toHaveLength(3);
    rerender(<Skeleton lines={0} />);
    expect(container.firstElementChild?.children).toHaveLength(1);
  });

  it('acepta formas y tamaño por className', () => {
    const { container } = render(<Skeleton shape="circle" className="size-12" />);
    expect(container.firstChild).toHaveClass('rounded-full', 'size-12');
    expect(container.firstChild).not.toHaveClass('size-10');
  });
});

describe('Divider', () => {
  it('es un <hr> con rol separator', () => {
    render(<Divider />);
    const separator = screen.getByRole('separator');
    expect(separator.tagName).toBe('HR');
    expect(separator).not.toHaveAttribute('aria-orientation');
  });

  it('vertical declara su orientación', () => {
    render(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('decorativo no se anuncia', () => {
    render(<Divider decorative orientation="vertical" />);
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <div>
        <Divider />
        <Divider orientation="vertical" />
        <Divider decorative />
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('Avatar', () => {
  it('calcula iniciales con la primera y la última palabra', () => {
    expect(initialsOf('Ana María Pérez')).toBe('AP');
    expect(initialsOf('  ángela ')).toBe('Á');
    expect(initialsOf('ışık yılmaz', 'tr')).toBe('IY');
    expect(initialsOf('')).toBe('');
  });

  it('tiene el nombre como nombre accesible', () => {
    render(<Avatar name="Ana Pérez" />);
    expect(screen.getByRole('img', { name: 'Ana Pérez' })).toHaveTextContent('AP');
  });

  it('muestra la imagen (decorativa) y vuelve a las iniciales si falla', () => {
    const { container, rerender } = render(<Avatar name="Ana Pérez" src="/ana.png" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('alt', '');
    fireEvent.error(img as HTMLImageElement);
    expect(container.querySelector('img')).toBeNull();
    // Una URL nueva se vuelve a intentar
    rerender(<Avatar name="Ana Pérez" src="/ana-2.png" />);
    expect(container.querySelector('img')).toHaveAttribute('src', '/ana-2.png');
  });

  it('decorativo queda oculto', () => {
    render(<Avatar name="Ana Pérez" decorative />);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <div>
        <Avatar name="Ana Pérez" src="/ana.png" />
        <Avatar name="Luis Mora" />
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
