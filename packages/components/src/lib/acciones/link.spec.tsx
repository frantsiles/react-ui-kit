import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocaleProvider } from '../fundamentos/locale-provider';
import { Link } from './link';

describe('Link', () => {
  it('es un <a> nativo con su texto como nombre', () => {
    render(<Link href="/facturas">Ver facturas</Link>);
    const link = screen.getByRole('link', { name: 'Ver facturas' });
    expect(link).toHaveAttribute('href', '/facturas');
    expect(link).not.toHaveAttribute('target');
  });

  it('recibe foco con Tab y se activa con Enter', async () => {
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <Link href="/a" onClick={onClick}>
        Ir
      </Link>,
    );
    await userEvent.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('external abre en otra pestaña de forma segura y lo anuncia', () => {
    render(
      <Link href="https://example.com" external rel="author">
        Documentación
      </Link>,
    );
    const link = screen.getByRole('link', {
      name: 'Documentación (se abre en una pestaña nueva)',
    });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer author');
    // El ícono es decorativo
    expect(link.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('el aviso se traduce y se puede sobrescribir', () => {
    render(
      <LocaleProvider locale="en">
        <Link href="https://example.com" external>
          Docs
        </Link>
        <Link href="https://example.com" external newTabLabel="(nueva ventana)">
          Guía
        </Link>
      </LocaleProvider>,
    );
    expect(screen.getByRole('link', { name: 'Docs (opens in a new tab)' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Guía (nueva ventana)' })).toBeInTheDocument();
  });

  it('pasa ref y props al <a>', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link href="/a" ref={ref} aria-current="page" tone="neutral">
        Inicio
      </Link>,
    );
    expect(ref.current).toBe(screen.getByRole('link'));
    expect(ref.current).toHaveAttribute('aria-current', 'page');
    expect(ref.current).toHaveClass('text-ui-fg');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <p>
        Lee la <Link href="/guia">guía</Link> o la{' '}
        <Link href="https://example.com" external>
          documentación
        </Link>
        .
      </p>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
