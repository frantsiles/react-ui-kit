import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button, Divider } from '@my-ui/components';

const meta = {
  title: 'Contenido/Divider',
  component: Divider,
  args: { orientation: 'horizontal', decorative: false },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  render: (args) => (
    <div className="flex max-w-sm flex-col gap-3 text-ui-body">
      <p>Datos personales</p>
      <Divider {...args} />
      <p>Dirección de facturación</p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('separator')).toBeInTheDocument();
  },
};

/** En vertical se estira al alto de la fila. Entre botones es decorativo. */
export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm">
        Copiar
      </Button>
      <Button variant="ghost" size="sm">
        Pegar
      </Button>
      <Divider orientation="vertical" decorative className="h-6 self-center" />
      <Button variant="ghost" size="sm" tone="danger">
        Eliminar
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('separator')).toBeNull();
  },
};
