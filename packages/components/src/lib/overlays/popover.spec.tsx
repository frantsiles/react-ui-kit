import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../acciones/button';
import { Popover, PopoverTrigger } from './popover';

function Example(props: { onOpenChange?: (open: boolean) => void }) {
  return (
    <PopoverTrigger {...props}>
      <Button>Filtros</Button>
      <Popover title="Filtrar facturas">
        {({ close }) => (
          <>
            <label>
              <input type="checkbox" /> Solo vencidas
            </label>
            <Button onClick={close}>Aplicar</Button>
          </>
        )}
      </Popover>
    </PopoverTrigger>
  );
}

describe('Popover', () => {
  it('se abre con el disparador y se nombra con el título', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Example onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Filtros' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Filtrar facturas' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('heading', { level: 2, name: 'Filtrar facturas' })).toBeInTheDocument();
    expect(dialog).toContainElement(screen.getByRole('checkbox', { name: 'Solo vencidas' }));
    // El foco entra al popover
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('Escape cierra y devuelve el foco al disparador', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Filtros' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    // React Aria devuelve el foco en el siguiente cuadro
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('close cierra desde adentro', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Filtros' }));
    await user.click(screen.getByRole('button', { name: 'Aplicar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('controlado y con aria-label', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <p>{open ? 'abierto' : 'cerrado'}</p>
          <PopoverTrigger open={open} onOpenChange={setOpen}>
            <Button>Opciones</Button>
            <Popover aria-label="Opciones de vista">Contenido</Popover>
          </PopoverTrigger>
        </>
      );
    }
    render(<Controlled />);
    expect(screen.getByRole('dialog', { name: 'Opciones de vista' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.getByText('cerrado')).toBeInTheDocument());
  });

  it('sin violaciones de axe', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Filtros' }));
    // El popover está en un portal: se revisan el disparador y el diálogo por separado
    await expect(container).toHaveNoAxeViolations();
    await expect(screen.getByRole('dialog')).toHaveNoAxeViolations();
  });
});
