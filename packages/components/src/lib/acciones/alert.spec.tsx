import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconLock } from '@my-ui/icons';
import { LocaleProvider } from '../fundamentos/locale-provider';
import { Alert } from './alert';
import { Button } from './button';

describe('Alert', () => {
  it('muestra título y detalle, sin rol por defecto', () => {
    const { container } = render(
      <Alert title="Tu sesión vence en 5 minutos">Guarda tus cambios.</Alert>,
    );
    expect(screen.getByText('Tu sesión vence en 5 minutos')).toBeInTheDocument();
    expect(screen.getByText('Guarda tus cambios.')).toBeInTheDocument();
    expect(container.firstChild).not.toHaveAttribute('role');
    expect(container.firstChild).toHaveAttribute('data-tone', 'primary');
  });

  it('el tipo se lee como prefijo, no solo con color o ícono', () => {
    const { container } = render(<Alert tone="danger" title="No se pudo guardar" />);
    expect(container.querySelector('p')).toHaveTextContent('Error: No se pudo guardar');
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('el prefijo se traduce y se puede sobrescribir', () => {
    const { container } = render(
      <LocaleProvider locale="en">
        <Alert tone="warning" title="Card expires soon" />
        <Alert tone="warning" toneLabel="Ojo" title="Vence pronto" />
      </LocaleProvider>,
    );
    const titles = container.querySelectorAll('p');
    expect(titles[0]).toHaveTextContent('Warning: Card expires soon');
    expect(titles[1]).toHaveTextContent('Ojo: Vence pronto');
  });

  it('role="alert" para avisos urgentes que aparecen después', () => {
    render(<Alert role="alert" tone="danger" title="No se pudo enviar" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Error: No se pudo enviar');
  });

  it('onDismiss muestra un botón de cerrar con nombre', async () => {
    const onDismiss = vi.fn();
    render(<Alert title="Guardado" tone="success" onDismiss={onDismiss} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar aviso' }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('acciones e ícono propio', async () => {
    const onRetry = vi.fn();
    const { container } = render(
      <Alert
        tone="danger"
        title="Sin conexión"
        icon={<IconLock data-testid="icono" />}
        actions={
          <Button size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        }
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
    expect(onRetry).toHaveBeenCalled();
    expect(container.querySelector('[data-testid="icono"]')).not.toBeNull();
  });

  it('pasa ref y props al contenedor', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref} id="aviso" title="Hola" variant="banner" />);
    expect(ref.current).toHaveAttribute('id', 'aviso');
    expect(ref.current).toHaveClass('border-y');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <div>
        {(['neutral', 'primary', 'success', 'warning', 'danger'] as const).map((tone) => (
          <Alert key={tone} tone={tone} title={tone} onDismiss={vi.fn()}>
            Detalle
          </Alert>
        ))}
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
