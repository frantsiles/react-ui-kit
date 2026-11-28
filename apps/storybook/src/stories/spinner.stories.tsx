import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner } from '@my-ui/components';

const meta = {
  title: 'Carga/Spinner',
  component: Spinner,
  args: { size: 'md', decorative: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('progressbar', { name: 'Cargando' }),
    ).toBeInTheDocument();
  },
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

/** Toma el color del texto: cámbialo con `text-ui-*`. */
export const Color: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner />
      <Spinner className="text-ui-primary" />
      <Spinner className="text-ui-fg-muted" />
    </div>
  ),
};

/** Con texto visible, el spinner es decorativo: el texto ya lo dice. */
export const ConTexto: Story = {
  render: () => (
    <p role="status" className="flex items-center gap-2 text-ui-body-sm text-ui-fg-muted">
      <Spinner size="sm" decorative />
      Cargando facturas…
    </p>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('progressbar')).toBeNull();
    await expect(canvas.getByRole('status')).toHaveTextContent('Cargando facturas…');
  },
};
