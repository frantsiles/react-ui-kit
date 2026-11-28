import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Text } from '@my-ui/components';

const meta = {
  title: 'Texto/Text',
  component: Text,
  args: {
    children: 'Las facturas se envían el primer día hábil de cada mes.',
    variant: 'body',
    tone: 'neutral',
  },
  argTypes: {
    as: { control: 'inline-radio', options: ['p', 'span', 'div'] },
    variant: { control: 'select', options: ['caption', 'body-sm', 'body', 'body-lg', 'label'] },
    tone: {
      control: 'select',
      options: ['neutral', 'muted', 'primary', 'success', 'warning', 'danger'],
    },
    weight: { control: 'select', options: ['regular', 'medium', 'semibold', 'bold'] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const text = within(canvasElement).getByText(/Las facturas/);
    await expect(text.tagName).toBe('P');
  },
};

export const Variantes: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text variant="body-lg">body-lg · Introducciones y textos destacados</Text>
      <Text variant="body">body · Texto principal</Text>
      <Text variant="body-sm">body-sm · Texto de ayuda y tablas</Text>
      <Text variant="label">label · Etiquetas y botones</Text>
      <Text variant="caption">caption · Notas y metadatos</Text>
    </div>
  ),
};

/** Los tonos semánticos acompañan a un texto que ya dice lo que pasa. */
export const Tonos: Story = {
  render: () => (
    <div className="flex flex-col gap-2">
      <Text>Texto principal</Text>
      <Text tone="muted">Texto secundario: actualizado hace 5 minutos</Text>
      <Text tone="success">Pago recibido</Text>
      <Text tone="warning">La tarjeta vence este mes</Text>
      <Text tone="danger">No se pudo enviar la factura</Text>
    </div>
  ),
};

/** Para párrafos largos, limita el ancho de línea a unos 65 caracteres. */
export const Parrafo: Story = {
  render: () => (
    <Text className="max-w-(--ui-measure)">
      Cada factura incluye el detalle de los servicios del período, los impuestos aplicados y el
      total a pagar. Puedes descargarla en PDF o reenviarla a otra dirección de correo desde la
      lista de facturas. Si encuentras un error, escríbenos antes de la fecha de vencimiento.
    </Text>
  ),
};
