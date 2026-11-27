import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@my-ui/components';

const meta = {
  title: 'Etiquetas/Badge',
  component: Badge,
  args: { children: 'Nuevo', tone: 'neutral' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'danger'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** Un "3" solo no dice nada al lector de pantalla: `srText` agrega el contexto. */
export const Conteo: Story = {
  render: () => (
    <button
      type="button"
      className="inline-flex items-center gap-2 rounded-md border border-ui-border px-3 py-1.5 text-ui-fg"
    >
      Mensajes <Badge tone="danger" srText="sin leer">3</Badge>
    </button>
  ),
};

export const Tonos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Borrador</Badge>
      <Badge tone="primary">Beta</Badge>
      <Badge tone="success">Activo</Badge>
      <Badge tone="warning">Pendiente</Badge>
      <Badge tone="danger">Vencido</Badge>
    </div>
  ),
};
