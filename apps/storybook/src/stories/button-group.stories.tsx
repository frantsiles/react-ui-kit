import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button, ButtonGroup, IconButton } from '@my-ui/components';
import { IconCopy, IconMinus, IconPencil, IconPlus, IconTrash } from '@my-ui/icons';

const meta = {
  title: 'Acciones/ButtonGroup',
  component: ButtonGroup,
  args: { attached: false, orientation: 'horizontal', 'aria-label': 'Acciones del documento' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    variant: { control: 'inline-radio', options: ['solid', 'outline', 'ghost'] },
    children: { control: false },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Descartar</Button>
      <Button variant="outline">Guardar borrador</Button>
      <Button>Publicar</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Acciones del documento' })).toBeInTheDocument();
    // Cada botón es una parada de Tab
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Descartar' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Guardar borrador' })).toHaveFocus();
  },
};

/** Pegados, como un control segmentado. El grupo pasa `variant` y `size` a sus botones. */
export const Pegados: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup attached variant="outline" tone="neutral" aria-label="Zoom">
        <IconButton label="Alejar">
          <IconMinus />
        </IconButton>
        <Button>Restablecer (100 %)</Button>
        <IconButton label="Acercar">
          <IconPlus />
        </IconButton>
      </ButtonGroup>
      <ButtonGroup attached variant="outline" tone="neutral" size="sm" aria-label="Acciones de la fila">
        <IconButton label="Editar">
          <IconPencil />
        </IconButton>
        <IconButton label="Duplicar">
          <IconCopy />
        </IconButton>
        <IconButton label="Eliminar" tone="danger">
          <IconTrash />
        </IconButton>
      </ButtonGroup>
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical', attached: true },
};

/** `disabled` en el grupo deshabilita todos sus botones. */
export const Deshabilitado: Story = {
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button')) {
      await expect(button).toBeDisabled();
    }
  },
};
