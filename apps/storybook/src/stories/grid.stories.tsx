import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Grid, Heading, Stack, Text } from '@my-ui/components';

function Item({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-ui-border-subtle bg-ui-surface-muted p-ui-sm text-ui-body-sm text-ui-fg">
      {children}
    </div>
  );
}

const items = ['Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis'];

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  args: { gap: 'md', minItemWidth: 'xs' },
  argTypes: {
    gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    minItemWidth: { control: 'text' },
    columns: { control: 'object' },
    as: { control: 'select', options: ['div', 'ul', 'section'] },
  },
  render: (args) => (
    <Grid {...args}>
      {items.map((item) => (
        <Item key={item}>{item}</Item>
      ))}
    </Grid>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** `minItemWidth`: entran tantas columnas de al menos 20rem como quepan. Cambia el ancho del panel para verlo. */
export const Basico: Story = {};

/**
 * El mismo Grid en un contenedor angosto y en uno ancho: se adapta a **su**
 * espacio, no al de la pantalla.
 */
export const SegunElContenedor: Story = {
  args: { minItemWidth: undefined, columns: { base: 1, sm: 2, md: 3 } },
  render: (args) => (
    <div className="flex flex-col gap-ui-lg ui-lg:flex-row">
      <Stack gap="sm" className="w-full ui-lg:w-64 ui-lg:shrink-0">
        <Text variant="caption" tone="muted">
          Barra lateral (angosta)
        </Text>
        <Grid {...args}>
          {items.slice(0, 3).map((item) => (
            <Item key={item}>{item}</Item>
          ))}
        </Grid>
      </Stack>
      <Stack gap="sm" className="min-w-0 flex-1">
        <Text variant="caption" tone="muted">
          Contenido (ancho)
        </Text>
        <Grid {...args}>
          {items.map((item) => (
            <Item key={item}>{item}</Item>
          ))}
        </Grid>
      </Stack>
    </div>
  ),
};

export const ColumnasFijas: Story = {
  args: { minItemWidth: undefined, columns: 3 },
};

/** Como `ul`: una lista de planes que sigue siendo lista para el lector de pantalla. */
export const ComoLista: Story = {
  render: () => (
    <Stack gap="md">
      <Heading level={3} id="planes">
        Planes
      </Heading>
      <Grid as="ul" aria-labelledby="planes" minItemWidth="14rem" gap="md">
        {['Básico', 'Equipo', 'Empresa'].map((plan) => (
          <li key={plan}>
            <Item>{plan}</Item>
          </li>
        ))}
      </Grid>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Planes' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
};
