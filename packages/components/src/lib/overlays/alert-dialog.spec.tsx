import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../acciones/button';
import { AlertDialog } from './alert-dialog';
import { DialogTrigger } from './dialog';

function Example({ onConfirm }: { onConfirm: () => void | Promise<void> }) {
  return (
    <DialogTrigger>
      <Button>Eliminar factura</Button>
      <AlertDialog title="¿Eliminar la factura 2041?" confirmLabel="Eliminar" onConfirm={onConfirm}>
        Se elimina para todo el equipo.
      </AlertDialog>
    </DialogTrigger>
  );
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Eliminar factura' }));
  return screen.getByRole('alertdialog', { name: '¿Eliminar la factura 2041?' });
}

describe('AlertDialog', () => {
  it('alertdialog con nombre, mensaje y el foco en Cancelar', async () => {
    const user = userEvent.setup();
    render(<Example onConfirm={vi.fn()} />);
    const dialog = await open(user);
    expect(dialog).toHaveAccessibleDescription('Se elimina para todo el equipo.');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus());
    // Sin botón de cerrar: las salidas son Cancelar, Escape o confirmar
    expect(screen.queryByRole('button', { name: 'Cerrar' })).not.toBeInTheDocument();
  });

  it('confirmar llama a onConfirm y cierra', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    expect(onConfirm).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('Cancelar y Escape cierran sin confirmar', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await open(user);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('un clic afuera no lo cierra', async () => {
    const user = userEvent.setup();
    render(<Example onConfirm={vi.fn()} />);
    await open(user);
    await user.click(document.body);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('con una promesa muestra que carga y cierra al resolverse', async () => {
    const user = userEvent.setup();
    let resolve: () => void = vi.fn();
    const onConfirm = () =>
      new Promise<void>((done) => {
        resolve = done;
      });
    render(<Example onConfirm={onConfirm} />);
    const dialog = await open(user);
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    // Mientras carga, el nombre suma "Cargando"
    expect(within(dialog).getByRole('button', { name: /^Eliminar/ })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    resolve();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  });

  it('si la promesa se rechaza, queda abierto', async () => {
    const user = userEvent.setup();
    render(<Example onConfirm={() => Promise.reject(new Error('sin conexión'))} />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Eliminar' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Eliminar' })).not.toHaveAttribute('aria-disabled'),
    );
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('sin violaciones de axe', async () => {
    const user = userEvent.setup();
    render(<Example onConfirm={vi.fn()} />);
    await expect(await open(user)).toHaveNoAxeViolations();
  });
});
