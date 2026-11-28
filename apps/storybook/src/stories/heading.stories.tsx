import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Heading, Text } from '@my-ui/components';

const meta = {
  title: 'Texto/Heading',
  component: Heading,
  args: { level: 2, children: 'Datos de facturación' },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'display'] },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('heading', { level: 2, name: 'Datos de facturación' }),
    ).toBeInTheDocument();
  },
};

/** Tamaño por defecto de cada nivel. */
export const Niveles: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Heading level={1}>h1 · xl</Heading>
      <Heading level={2}>h2 · lg</Heading>
      <Heading level={3}>h3 · md</Heading>
      <Heading level={4}>h4 · sm</Heading>
    </div>
  ),
};

/**
 * El nivel sigue la estructura; el tamaño, el diseño. Dentro de una tarjeta, un
 * `h3` puede verse chico sin saltarse niveles.
 */
export const NivelYTamano: Story = {
  render: () => (
    <section aria-labelledby="planes" className="flex flex-col gap-4">
      <Heading level={2} id="planes">
        Planes
      </Heading>
      <div className="flex flex-wrap gap-4">
        {['Básico', 'Equipo'].map((plan) => (
          <article key={plan} className="rounded-lg border border-ui-border-subtle p-4">
            <Heading level={3} size="sm">
              {plan}
            </Heading>
            <Text variant="body-sm" tone="muted">
              Facturación mensual
            </Text>
          </article>
        ))}
      </div>
    </section>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  },
};

export const Display: Story = {
  args: { level: 1, size: 'display', children: 'Bienvenida' },
};
