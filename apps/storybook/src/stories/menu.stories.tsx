import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { IconCopy, IconDownload, IconEllipsis, IconPencil, IconTrash } from '@my-ui/icons';
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from '@my-ui/components';

const meta = {
  title: 'Colecciones/Menu',
  component: Menu,
  args: {
    onAction: fn(),
    children: null,
  },
  argTypes: {
    children: { control: false },
    placement: { control: 'select', options: ['bottom start', 'bottom end', 'top start', 'top end'] },
  },
  decorators: [
    (Story) => (
      // El menú flota fuera del botón: la captura necesita el alto
      <div className="min-h-80">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <MenuTrigger>
      <Button variant="outline">Acciones</Button>
      <Menu {...args}>
        <MenuItem value="editar">Editar</MenuItem>
        <MenuItem value="duplicar">Duplicar</MenuItem>
        <MenuItem value="descargar">Descargar PDF</MenuItem>
        <MenuSeparator />
        <MenuItem value="eliminar" tone="danger">
          Eliminar
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El botón abre el menú; flechas recorren, `Enter` elige y el foco vuelve al botón. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Acciones' });
    trigger.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: /^Editar/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onAction).toHaveBeenCalledWith('duplicar');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Abierto, con íconos, atajos, una opción deshabilitada y una destructiva al final. */
export const Abierto: Story = {
  render: (args) => (
    <MenuTrigger defaultOpen>
      <Button variant="outline">Factura 2041</Button>
      <Menu {...args}>
        <MenuItem value="editar" icon={<IconPencil />} shortcut="Ctrl+E">
          Editar
        </MenuItem>
        <MenuItem value="duplicar" icon={<IconCopy />} shortcut="Ctrl+D">
          Duplicar
        </MenuItem>
        <MenuItem value="descargar" icon={<IconDownload />} disabled>
          Descargar PDF
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="eliminar" icon={<IconTrash />} tone="danger">
          Eliminar
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
};

/** Secciones con título y ítems con descripción. */
export const SeccionesYDescripcion: Story = {
  render: (args) => (
    <MenuTrigger defaultOpen>
      <Button variant="outline">Exportar</Button>
      <Menu {...args}>
        <MenuSection title="Documento">
          <MenuItem value="pdf" description="Para imprimir o enviar">
            PDF
          </MenuItem>
          <MenuItem value="xlsx" description="Con fórmulas, para Excel">
            Hoja de cálculo
          </MenuItem>
        </MenuSection>
        <MenuSection title="Datos">
          <MenuItem value="csv" description="Texto separado por comas">
            CSV
          </MenuItem>
        </MenuSection>
      </Menu>
    </MenuTrigger>
  ),
};

/**
 * Con un `IconButton` "Más opciones": el botón tiene nombre propio y el menú
 * se nombra con `aria-label` para decir de qué son las acciones.
 */
export const ConIconButton: Story = {
  render: (args) => (
    <MenuTrigger>
      <IconButton label="Más opciones" variant="ghost">
        <IconEllipsis />
      </IconButton>
      <Menu {...args} aria-label="Acciones de la factura 2041">
        <MenuItem value="editar">Editar</MenuItem>
        <MenuItem value="duplicar">Duplicar</MenuItem>
        <MenuItem value="eliminar" tone="danger">
          Eliminar
        </MenuItem>
      </Menu>
    </MenuTrigger>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Más opciones' }));
    await expect(await screen.findByRole('menu', { name: 'Acciones de la factura 2041' })).toBeInTheDocument();
  },
};
