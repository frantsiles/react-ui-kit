import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../acciones/button';
import { Menu, MenuItem, MenuSection, MenuSeparator, MenuTrigger, type MenuProps } from './menu';

function Example(props: Partial<MenuProps> & { onDuplicate?: () => void }) {
  const { onDuplicate, ...menuProps } = props;
  return (
    <MenuTrigger>
      <Button variant="outline">Acciones</Button>
      <Menu {...menuProps}>
        <MenuItem value="editar" shortcut="Ctrl+E">
          Editar
        </MenuItem>
        <MenuItem value="duplicar" description="Crea una copia en borrador" onAction={onDuplicate}>
          Duplicar
        </MenuItem>
        <MenuItem value="archivar" disabled>
          Archivar
        </MenuItem>
        <MenuSeparator />
        <MenuSection title="Peligro">
          <MenuItem value="eliminar" tone="danger">
            Eliminar
          </MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  );
}

// hidden: con el menú abierto, React Aria oculta el resto de la página (aria-hidden)
const trigger = () => screen.getByRole('button', { name: 'Acciones', hidden: true });

describe('Menu', () => {
  it('el botón anuncia que abre un menú y está cerrado al inicio', () => {
    render(<Example />);
    expect(trigger()).toHaveAttribute('aria-haspopup', 'true');
    expect(trigger()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('se abre con clic, lo nombra el botón y el foco entra al menú', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    const menu = screen.getByRole('menu', { name: 'Acciones' });
    expect(menu).toBeInTheDocument();
    expect(trigger()).toHaveAttribute('aria-expanded', 'true');
    // Con el mouse el foco va al menú; con el teclado, al primer ítem (otro test)
    await waitFor(() => expect(menu).toHaveFocus());
  });

  it('nombre del ítem: todo su texto visible, con descripción y atajo', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(trigger());
    expect(screen.getByRole('menuitem', { name: 'Duplicar Crea una copia en borrador' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Editar Ctrl+E' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Archivar' })).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('group', { name: 'Peligro' })).toBeInTheDocument();
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('teclado: flecha abajo abre, flechas saltan los deshabilitados, Enter elige y el foco vuelve', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const onDuplicate = vi.fn();
    render(<Example onAction={onAction} onDuplicate={onDuplicate} />);
    trigger().focus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /^Editar/ })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: /^Duplicar/ })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Eliminar' })).toHaveFocus();
    await user.keyboard('{ArrowUp}{Enter}');
    expect(onAction).toHaveBeenCalledWith('duplicar');
    expect(onDuplicate).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('Escape cierra sin elegir y devuelve el foco', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(<Example onAction={onAction} />);
    await user.click(trigger());
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger()).toHaveFocus());
    expect(onAction).not.toHaveBeenCalled();
  });

  it('aria-label reemplaza el nombre que da el botón', async () => {
    const user = userEvent.setup();
    render(<Example aria-label="Acciones de la factura" />);
    await user.click(trigger());
    const menu = screen.getByRole('menu', { name: 'Acciones de la factura' });
    expect(menu.getAttribute('aria-labelledby') ?? '').toBe('');
  });

  it('sin violaciones de axe, cerrado y abierto', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await expect(container).toHaveNoAxeViolations();
    await user.click(trigger());
    await expect(screen.getByRole('menu')).toHaveNoAxeViolations();
  });
});
