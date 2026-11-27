import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from '@my-ui/components';

const meta = {
  title: 'Etiquetas/Label',
  component: Label,
  args: { children: 'Correo electrónico', htmlFor: 'demo', size: 'md' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <div className="flex flex-col gap-1.5">
      <Label {...args} />
      <input id="demo" className="max-w-xs rounded-md border border-ui-border bg-ui-surface px-3 py-2 text-ui-fg" />
    </div>
  ),
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** El asterisco es solo visual; "requerido" lo anuncia el atributo `required` del control. */
export const Requerido: Story = { args: { required: true } };

/** Cuando la mayoría de los campos son obligatorios, es más claro marcar los opcionales. */
export const Opcional: Story = { args: { optional: true } };

export const Deshabilitado: Story = { args: { disabled: true } };
