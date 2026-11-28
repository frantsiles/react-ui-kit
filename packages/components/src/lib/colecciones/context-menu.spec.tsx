import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContextMenuTrigger, Menu, MenuItem } from './menu';

function Example(props: { onAction?: (value: string) => void; disabled?: boolean }) {
  return (
    <ContextMenuTrigger label="Acciones de la factura 2041" disabled={props.disabled}>
      <div tabIndex={0}>Factura 2041</div>
      <Menu onAction={props.onAction}>
        <MenuItem value="duplicar">Duplicar</MenuItem>
        <MenuItem value="eliminar" tone="danger">
          Eliminar
        </MenuItem>
      </Menu>
    </ContextMenuTrigger>
  );
}

const area = () => screen.getByText('Factura 2041');

describe('ContextMenuTrigger', () => {
  it('el clic derecho abre el menú con su nombre y el foco en el primer ítem', async () => {
    render(<Example />);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    fireEvent.contextMenu(area(), { clientX: 120, clientY: 80 });
    expect(await screen.findByRole('menu', { name: 'Acciones de la factura 2041' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Duplicar' })).toHaveFocus());
  });

  it('evita el menú del navegador', () => {
    render(<Example />);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    area().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });

  it('elegir ejecuta la acción, cierra y devuelve el foco al área', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    area().focus();
    fireEvent.contextMenu(area());
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onAction).toHaveBeenCalledWith('eliminar');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(area()).toHaveFocus());
  });

  it('Shift+F10 y la tecla Menú lo abren con el foco en el área', async () => {
    const user = userEvent.setup();
    render(<Example />);
    area().focus();
    await user.keyboard('{Shift>}{F10}{/Shift}');
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(area()).toHaveFocus());
    await user.keyboard('{ContextMenu}');
    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('Escape cierra sin elegir', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 });
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(onAction).not.toHaveBeenCalled();
  });

  it('pulsación larga en táctil abre; moverse la cancela', async () => {
    vi.useFakeTimers();
    try {
      render(<Example />);
      fireEvent.pointerDown(area(), { pointerType: 'touch', clientX: 50, clientY: 50 });
      fireEvent.pointerMove(area(), { pointerType: 'touch', clientX: 50, clientY: 90 });
      vi.advanceTimersByTime(600);
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      fireEvent.pointerDown(area(), { pointerType: 'touch', clientX: 50, clientY: 50 });
      vi.advanceTimersByTime(600);
    } finally {
      vi.useRealTimers();
    }
    expect(await screen.findByRole('menu')).toBeInTheDocument();
  });

  it('disabled deja el menú del navegador', () => {
    render(<Example disabled />);
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    area().dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('sin violaciones de axe con el menú abierto', async () => {
    render(<Example />);
    fireEvent.contextMenu(area(), { clientX: 10, clientY: 10 });
    const menu = await screen.findByRole('menu');
    // El popover que lo contiene es un diálogo: con nombre
    expect(screen.getByRole('dialog', { name: 'Acciones de la factura 2041' })).toBeInTheDocument();
    await expect(menu.closest('[role="dialog"]')).toHaveNoAxeViolations();
  });
});
