import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconButton } from '@my-ui/components';
import { IconCopy, IconEllipsis, IconPencil, IconTrash, IconX } from '@my-ui/icons';

const meta = {
  title: 'Acciones/IconButton',
  component: IconButton,
  args: {
    label: 'Cerrar',
    children: <IconX />,
    variant: 'ghost',
    tone: 'neutral',
    size: 'md',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Cerrar' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton label="Editar" size="sm">
        <IconPencil />
      </IconButton>
      <IconButton label="Editar" size="md">
        <IconPencil />
      </IconButton>
      <IconButton label="Editar" size="lg">
        <IconPencil />
      </IconButton>
    </div>
  ),
};

/** El nombre describe la acción y su objeto, no el dibujo. */
export const AccionesDeUnaFila: Story = {
  render: () => (
    <div className="flex items-center gap-1">
      <IconButton label="Editar factura 1024">
        <IconPencil />
      </IconButton>
      <IconButton label="Duplicar factura 1024">
        <IconCopy />
      </IconButton>
      <IconButton label="Eliminar factura 1024" tone="danger">
        <IconTrash />
      </IconButton>
      <IconButton label="Más acciones para la factura 1024">
        <IconEllipsis />
      </IconButton>
    </div>
  ),
};

export const Variantes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton label="Editar" variant="solid" tone="primary">
        <IconPencil />
      </IconButton>
      <IconButton label="Editar" variant="outline">
        <IconPencil />
      </IconButton>
      <IconButton label="Editar">
        <IconPencil />
      </IconButton>
      <IconButton label="Editar" disabled>
        <IconPencil />
      </IconButton>
    </div>
  ),
};
