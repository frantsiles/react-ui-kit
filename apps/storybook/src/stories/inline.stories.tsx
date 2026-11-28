import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, Badge, Button, Heading, Inline, Link, Tag, Text } from '@my-ui/components';

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  args: { gap: 'sm', align: 'center', wrap: true },
  argTypes: {
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between'] },
    as: { control: 'select', options: ['div', 'ul', 'nav', 'footer'] },
  },
  render: (args) => (
    <Inline {...args}>
      <Tag>Diseño</Tag>
      <Tag>Accesibilidad</Tag>
      <Tag>React</Tag>
      <Tag>Formularios</Tag>
      <Tag>Temas</Tag>
    </Inline>
  ),
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** `between` separa a los extremos: título a un lado, acciones al otro. Si no entra, pasa a la línea siguiente. */
export const Encabezado: Story = {
  render: () => (
    <Inline justify="between" gap="md" className="max-w-xl">
      <Inline gap="sm">
        <Heading level={3}>Facturas</Heading>
        <Badge tone="primary" srText="facturas pendientes">
          3
        </Badge>
      </Inline>
      <Inline gap="sm">
        <Button variant="outline" size="sm">
          Exportar
        </Button>
        <Button size="sm">Nueva factura</Button>
      </Inline>
    </Inline>
  ),
};

/** `baseline` alinea textos de distinto tamaño por su línea base. */
export const LineaBase: Story = {
  render: () => (
    <Inline align="baseline" gap="sm">
      <Avatar name="Ana Pérez" size="sm" decorative />
      <Text as="span" weight="semibold">
        Ana Pérez
      </Text>
      <Text as="span" variant="caption" tone="muted">
        hace 5 minutos
      </Text>
    </Inline>
  ),
};

/** Como `nav` con lista de enlaces: un pie de página simple. */
export const Enlaces: Story = {
  render: () => (
    <nav aria-label="Legal">
      <Inline as="ul" gap="lg">
        <li>
          <Link href="#terminos" tone="neutral">
            Términos
          </Link>
        </li>
        <li>
          <Link href="#privacidad" tone="neutral">
            Privacidad
          </Link>
        </li>
        <li>
          <Link href="#accesibilidad" tone="neutral">
            Accesibilidad
          </Link>
        </li>
      </Inline>
    </nav>
  ),
  play: async ({ canvasElement }) => {
    const nav = within(canvasElement).getByRole('navigation', { name: 'Legal' });
    await expect(within(nav).getAllByRole('listitem')).toHaveLength(3);
  },
};
