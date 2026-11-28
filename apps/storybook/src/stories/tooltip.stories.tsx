import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button, IconButton, Inline, Tooltip, type TooltipPlacement } from '@my-ui/components';
import { IconCopy, IconDownload, IconPencil, IconTrash } from '@my-ui/icons';

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip,
  // Espacio para que el tooltip abierto entre en la captura
  decorators: [
    (Story) => (
      <div className="grid min-h-40 place-items-center">
        <Story />
      </div>
    ),
  ],
  args: {
    content: 'Copia el enlace al portapapeles',
    placement: 'top',
    delay: 700,
    children: <span />,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['top', 'bottom', 'start', 'end'] },
    children: { control: false },
  },
  render: ({ children: _children, ...args }) => (
    <Tooltip {...args}>
      <IconButton label="Copiar enlace" variant="outline">
        <IconCopy />
      </IconButton>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Al pasar el mouse aparece tras una espera corta; al salir se va.
 * (Sin prueba automática: React Aria no reconoce el hover simulado; se revisa a mano.)
 */
export const Basico: Story = {};

/** Abierto al montar (`defaultOpen`), para ver su aspecto. */
export const Abierto: Story = {
  args: { defaultOpen: true },
};

/** Con teclado se muestra al instante al enfocar, y `Escape` lo oculta sin mover el foco. */
export const ConTeclado: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Copiar enlace' });
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await expect(trigger).toHaveAccessibleDescription('Copia el enlace al portapapeles');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('tooltip')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

/** Una barra de íconos: el tooltip muestra a la vista el nombre que el botón ya tiene. */
export const BarraDeHerramientas: Story = {
  render: () => (
    <Inline gap="xs">
      {[
        { label: 'Editar', icon: <IconPencil /> },
        { label: 'Duplicar', icon: <IconCopy /> },
        { label: 'Descargar PDF', icon: <IconDownload /> },
        { label: 'Eliminar', icon: <IconTrash /> },
      ].map(({ label, icon }) => (
        <Tooltip key={label} content={label}>
          <IconButton label={label} variant="ghost">
            {icon}
          </IconButton>
        </Tooltip>
      ))}
    </Inline>
  ),
};

/** `start` y `end` son lógicos: en RTL se espejan. */
export const Posiciones: Story = {
  render: () => (
    <Inline gap="sm">
      {(['top', 'bottom', 'start', 'end'] as TooltipPlacement[]).map((placement) => (
        <Tooltip key={placement} content={`Tooltip ${placement}`} placement={placement}>
          <Button variant="outline" size="sm">
            {placement}
          </Button>
        </Tooltip>
      ))}
    </Inline>
  ),
};
