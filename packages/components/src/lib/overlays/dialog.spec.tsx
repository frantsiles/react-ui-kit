import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../acciones/button';
import { LocaleProvider } from '../fundamentos/locale-provider';
import { Dialog, DialogBody, DialogFooter, DialogTrigger } from './dialog';

function Example(props: { dismissable?: boolean }) {
  return (
    <DialogTrigger>
      <Button>Editar factura</Button>
      <Dialog title="Editar factura" description="Los cambios se guardan al confirmar." {...props}>
        {({ close }) => (
          <>
            <DialogBody>
              <label>
                Monto <input />
              </label>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button onClick={close}>Guardar</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  );
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Editar factura' }));
  return screen.getByRole('dialog', { name: 'Editar factura' });
}

describe('Dialog', () => {
  it('se abre con nombre, descripción y el foco adentro', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const dialog = await open(user);
    expect(dialog).toHaveAccessibleDescription('Los cambios se guardan al confirmar.');
    expect(screen.getByRole('heading', { level: 2, name: 'Editar factura' })).toBeInTheDocument();
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
  });

  it('Escape cierra y devuelve el foco al disparador', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Editar factura' })).toHaveFocus());
  });

  it('el botón Cerrar y close cierran', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());

    await open(user);
    await user.click(screen.getByRole('button', { name: 'Guardar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('Tab no sale del diálogo', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const dialog = await open(user);
    for (let index = 0; index < 6; index++) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('dismissable={false}: un clic afuera no cierra', async () => {
    const user = userEvent.setup();
    render(<Example dismissable={false} />);
    await open(user);
    await user.click(document.body);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('controlado, con aria-label y el texto de cerrar en inglés', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <LocaleProvider locale="en">
          <p>{open ? 'abierto' : 'cerrado'}</p>
          <Dialog aria-label="Vista previa" open={open} onOpenChange={setOpen}>
            <DialogBody>Contenido</DialogBody>
          </Dialog>
        </LocaleProvider>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('dialog', { name: 'Vista previa' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(screen.getByText('cerrado')).toBeInTheDocument());
  });

  it('sin violaciones de axe', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const dialog = await open(user);
    await expect(dialog).toHaveNoAxeViolations();
  });
});
