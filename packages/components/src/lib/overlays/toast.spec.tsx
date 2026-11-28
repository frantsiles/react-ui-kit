import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastRegion, toast } from './toast';

afterEach(() => {
  act(() => toast.dismissAll());
});

function show(options: Parameters<typeof toast>[0]) {
  let id = '';
  act(() => {
    id = toast(options);
  });
  return id;
}

describe('Toast', () => {
  it('la región aparece solo con toasts y tiene nombre', () => {
    render(<ToastRegion />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    show({ title: 'Factura enviada' });
    expect(screen.getByRole('region', { name: 'Notificaciones' })).toBeInTheDocument();
  });

  it('cada toast se nombra con su título y se describe con el detalle', () => {
    render(<ToastRegion />);
    show({ title: 'Factura enviada', description: 'Ferretería El Clavo la recibirá por correo.' });
    const item = screen.getByRole('alertdialog', { name: 'Factura enviada' });
    expect(item).toHaveAccessibleDescription('Ferretería El Clavo la recibirá por correo.');
  });

  it('el tono suma un prefijo oculto', () => {
    render(<ToastRegion />);
    show({ title: 'No se pudo guardar', tone: 'danger' });
    expect(screen.getByRole('alertdialog', { name: 'Error: No se pudo guardar' })).toBeInTheDocument();
  });

  it('el botón Cerrar lo cierra y llama a onClose', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ToastRegion />);
    show({ title: 'Factura enviada', onClose });
    await user.click(screen.getByRole('button', { name: 'Cerrar notificación' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('la acción se ejecuta y cierra el toast', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<ToastRegion />);
    show({ title: 'Factura eliminada', action: { label: 'Deshacer', onAction } });
    await user.click(screen.getByRole('button', { name: 'Deshacer' }));
    expect(onAction).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('toast.dismiss cierra uno por id', () => {
    render(<ToastRegion />);
    const id = show({ title: 'Primero' });
    show({ title: 'Segundo' });
    act(() => toast.dismiss(id));
    const region = screen.getByRole('region');
    expect(within(region).queryByRole('alertdialog', { name: 'Primero' })).not.toBeInTheDocument();
    expect(within(region).getByRole('alertdialog', { name: 'Segundo' })).toBeInTheDocument();
  });

  describe('tiempo', () => {
    beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
    afterEach(() => vi.useRealTimers());

    it('se cierra solo a los 5 segundos, nunca antes', () => {
      render(<ToastRegion />);
      show({ title: 'Factura enviada', timeout: 1000 });
      act(() => vi.advanceTimersByTime(4000));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      act(() => vi.advanceTimersByTime(1500));
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('con acción o tono danger no se cierra solo', () => {
      render(<ToastRegion />);
      show({ title: 'Factura eliminada', action: { label: 'Deshacer', onAction: vi.fn() } });
      show({ title: 'No se pudo guardar', tone: 'danger' });
      act(() => vi.advanceTimersByTime(60_000));
      expect(screen.getAllByRole('alertdialog')).toHaveLength(2);
    });
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(<ToastRegion />);
    show({ title: 'Factura enviada', description: 'Se envió por correo.', tone: 'success' });
    await expect(screen.getByRole('region')).toHaveNoAxeViolations();
    expect(container).toBeEmptyDOMElement();
  });
});
