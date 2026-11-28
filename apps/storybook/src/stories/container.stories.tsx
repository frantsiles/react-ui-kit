import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Container, Grid, Heading, Stack, Text } from '@my-ui/components';

const meta = {
  title: 'Layout/Container',
  component: Container,
  args: { width: 'lg', gutter: true },
  argTypes: {
    width: { control: 'select', options: ['sm', 'md', 'lg', 'xl', 'prose', 'full'] },
    as: { control: 'select', options: ['div', 'main', 'section', 'header', 'footer'] },
  },
  parameters: { layout: 'fullscreen' },
  render: (args) => (
    <div className="bg-ui-surface-muted py-ui-lg">
      <Container {...args} className="bg-ui-surface py-ui-md">
        <Stack gap="xs">
          <Heading level={2}>Facturas</Heading>
          <Text tone="muted">El contenido se centra con un ancho máximo y márgenes laterales.</Text>
        </Stack>
      </Container>
    </div>
  ),
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** Cada ancho máximo, de `sm` (36rem) a `xl` (80rem), y `prose` para textos largos. */
export const Anchos: Story = {
  render: () => (
    <Stack gap="sm" className="bg-ui-surface-muted py-ui-md">
      {(['sm', 'md', 'lg', 'xl', 'prose'] as const).map((width) => (
        <Container key={width} width={width}>
          <div className="rounded-md border border-ui-border-subtle bg-ui-surface p-ui-sm font-ui-mono text-ui-caption text-ui-fg">
            {width}
          </div>
        </Container>
      ))}
    </Stack>
  ),
};

/** `as="main"` da la región principal; los bloques de adentro se adaptan al ancho del Container. */
export const PaginaPrincipal: Story = {
  render: () => (
    <Container as="main" className="py-ui-lg">
      <Stack gap="lg">
        <Heading level={1}>Resumen</Heading>
        <Grid columns={{ base: 1, md: 3 }}>
          {['Facturado', 'Pendiente', 'Vencido'].map((label) => (
            <div key={label} className="rounded-md border border-ui-border-subtle p-ui-md">
              <Text variant="body-sm" tone="muted">
                {label}
              </Text>
            </div>
          ))}
        </Grid>
      </Stack>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('main')).toBeInTheDocument();
  },
};
