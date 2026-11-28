import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Alert, Button, Field, Heading, Inline, Input, Stack, Text } from '@my-ui/components';

const gaps = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function Box({ children }: { children: string }) {
  return (
    <div className="rounded-md border border-ui-border-subtle bg-ui-surface-muted px-3 py-2 text-ui-body-sm text-ui-fg">
      {children}
    </div>
  );
}

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { gap: 'md', align: 'stretch' },
  argTypes: {
    gap: { control: 'select', options: gaps },
    align: { control: 'inline-radio', options: ['start', 'center', 'end', 'stretch'] },
    justify: { control: 'inline-radio', options: ['start', 'center', 'end', 'between'] },
    as: { control: 'select', options: ['div', 'section', 'ul', 'ol', 'form'] },
  },
  render: (args) => (
    <Stack {...args} className="max-w-sm">
      <Box>Uno</Box>
      <Box>Dos</Box>
      <Box>Tres</Box>
    </Stack>
  ),
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** La escala `--ui-space-*`. En densidad compacta los pasos desde `sm` se achican. */
export const Espacios: Story = {
  render: () => (
    <Inline gap="xl" align="start">
      {gaps.map((gap) => (
        <Stack key={gap} gap={gap}>
          <Text variant="caption" tone="muted" className="font-ui-mono">
            {gap}
          </Text>
          <Box>A</Box>
          <Box>B</Box>
        </Stack>
      ))}
    </Inline>
  ),
};

/** Un formulario sin márgenes sueltos: el Stack reparte el espacio. */
export const Formulario: Story = {
  render: () => (
    <Stack as="form" gap="lg" className="max-w-sm" aria-label="Perfil" onSubmit={(e) => e.preventDefault()}>
      <Stack gap="xs">
        <Heading level={3}>Perfil</Heading>
        <Text variant="body-sm" tone="muted">
          Estos datos aparecen en tus facturas.
        </Text>
      </Stack>
      <Field label="Nombre">
        <Input autoComplete="name" />
      </Field>
      <Field label="Correo electrónico">
        <Input type="email" autoComplete="email" />
      </Field>
      <Alert tone="neutral" title="Puedes cambiarlos cuando quieras" />
      <Inline justify="end">
        <Button variant="ghost">Cancelar</Button>
        <Button type="submit">Guardar</Button>
      </Inline>
    </Stack>
  ),
};

/** Como `ul`, sigue siendo una lista para los lectores de pantalla (también en Safari). */
export const ComoLista: Story = {
  render: () => (
    <Stack as="ul" gap="sm" aria-label="Últimas facturas" className="max-w-sm">
      <li>
        <Box>Enero · pagada</Box>
      </li>
      <li>
        <Box>Febrero · pendiente</Box>
      </li>
    </Stack>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Últimas facturas' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  },
};
