import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../acciones/button';
import { DialogBody, DialogFooter, DialogTrigger } from './dialog';
import { Drawer, type DrawerPlacement } from './drawer';

function Example({ placement }: { placement?: DrawerPlacement }) {
  return (
    <DialogTrigger>
      <Button>Filtros</Button>
      <Drawer title="Filtros" description="Se aplican al listado de facturas." placement={placement}>
        {({ close }) => (
          <>
            <DialogBody>
              <label>
                Cliente <input />
              </label>
            </DialogBody>
            <DialogFooter>
              <Button onClick={close}>Aplicar</Button>
            </DialogFooter>
          </>
        )}
      </Drawer>
    </DialogTrigger>
  );
}

async function open(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  return screen.getByRole('dialog', { name: 'Filtros' });
}

describe('Drawer', () => {
  it('dialog con nombre, descripción y el foco adentro', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const dialog = await open(user);
    expect(dialog).toHaveAccessibleDescription('Se aplican al listado de facturas.');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
  });

  it('Escape cierra y devuelve el foco al disparador', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: 'Filtros' })).toHaveFocus());
  });

  it('el botón Cerrar y close cierran', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Cerrar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await open(user);
    await user.click(screen.getByRole('button', { name: 'Aplicar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it.each<DrawerPlacement>(['start', 'end', 'bottom'])('placement %s sin violaciones de axe', async (placement) => {
    const user = userEvent.setup();
    render(<Example placement={placement} />);
    await expect(await open(user)).toHaveNoAxeViolations();
  });
});
