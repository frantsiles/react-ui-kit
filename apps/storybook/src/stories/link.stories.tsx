import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Link, Text } from '@my-ui/components';

const meta = {
  title: 'Acciones/Link',
  component: Link,
  args: { href: '#facturas', children: 'Ver todas las facturas', tone: 'primary', external: false },
  argTypes: {
    tone: { control: 'inline-radio', options: ['primary', 'neutral'] },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', { name: 'Ver todas las facturas' });
    await userEvent.tab();
    await expect(link).toHaveFocus();
  },
};

/** Dentro de un párrafo toma el tamaño del texto. El subrayado lo distingue sin depender del color. */
export const EnTexto: Story = {
  render: () => (
    <Text className="max-w-(--ui-measure)">
      Antes de pagar, revisa los <Link href="#terminos">términos del servicio</Link> y la{' '}
      <Link href="#privacidad" tone="neutral">
        política de privacidad
      </Link>
      .
    </Text>
  ),
};

/** Con `external`, abre en otra pestaña: lo avisa con un ícono y un texto para lectores de pantalla. */
export const Externo: Story = {
  args: { href: 'https://www.w3.org/WAI/ARIA/apg/', external: true, children: 'Guía ARIA APG' },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Guía ARIA APG (se abre en una pestaña nueva)',
    });
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};
