import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { IconCopy, IconDownload, IconEllipsis, IconPencil, IconTrash } from '@my-ui/icons';
import {
  ContextMenuTrigger,
  IconButton,
  Menu,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from '@my-ui/components';
import { focusRing } from '@my-ui/core';

/** Args de las historias: los props de `ContextMenuTrigger` y la acción del menú. */
interface StoryArgs {
  label: string;
  disabled: boolean;
  onAction: (value: string) => void;
}

function Items() {
  return (
    <>
      <MenuItem value="editar" icon={<IconPencil />}>
        Editar
      </MenuItem>
      <MenuItem value="duplicar" icon={<IconCopy />}>
        Duplicar
      </MenuItem>
      <MenuItem value="descargar" icon={<IconDownload />}>
        Descargar PDF
      </MenuItem>
      <MenuSeparator />
      <MenuItem value="eliminar" icon={<IconTrash />} tone="danger">
        Eliminar
      </MenuItem>
    </>
  );
}

const meta = {
  title: 'Colecciones/Menú contextual',
  args: {
    label: 'Acciones de la factura 2041',
    disabled: false,
    onAction: fn(),
  },
  decorators: [
    (Story) => (
      // El menú flota fuera del área: la captura necesita el alto
      <div className="min-h-80">
        <Story />
      </div>
    ),
  ],
  render: ({ onAction, ...args }) => (
    <ContextMenuTrigger {...args}>
      {/* Enfocable, para abrir el menú con Shift+F10 o la tecla Menú */}
      <div
        tabIndex={0}
        className={`flex max-w-(--container-ui-xs) items-center justify-between gap-ui-sm rounded-lg border border-ui-border bg-ui-surface p-ui-md text-ui-body-sm text-ui-fg ${focusRing}`}
      >
        <div>
          <div className="font-ui-semibold">Factura 2041</div>
          <div className="text-ui-fg-muted">Ferretería El Clavo · $ 120.000</div>
        </div>
        {/* Las mismas acciones, a la vista: el menú contextual es solo un atajo */}
        <MenuTrigger>
          <IconButton label="Más opciones" variant="ghost" size="sm">
            <IconEllipsis />
          </IconButton>
          <Menu aria-label="Acciones de la factura 2041" onAction={onAction}>
            <Items />
          </Menu>
        </MenuTrigger>
      </div>
      <Menu onAction={onAction}>
        <Items />
      </Menu>
    </ContextMenuTrigger>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/** Clic derecho sobre la factura (o pulsación larga en el teléfono). */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const area = within(canvasElement).getByText('Factura 2041');
    fireEvent.contextMenu(area, { clientX: 60, clientY: 40 });
    const menu = await screen.findByRole('menu', { name: 'Acciones de la factura 2041' });
    await waitFor(() => expect(within(menu).getByRole('menuitem', { name: 'Editar' })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onAction).toHaveBeenCalledWith('duplicar');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  },
};

/** Abierto donde se hizo clic. */
export const Abierto: Story = {
  play: async ({ canvasElement }) => {
    fireEvent.contextMenu(within(canvasElement).getByText('Factura 2041'), { clientX: 120, clientY: 50 });
    await expect(await screen.findByRole('menu')).toBeInTheDocument();
  },
};
