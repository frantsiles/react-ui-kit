import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Avatar, Button, Skeleton } from '@my-ui/components';

const meta = {
  title: 'Carga/Skeleton',
  component: Skeleton,
  args: { shape: 'text', lines: 3 },
  argTypes: {
    shape: { control: 'inline-radio', options: ['text', 'rect', 'circle'] },
    lines: { control: { type: 'number', min: 1, max: 8 } },
  },
  decorators: [(Story) => <div className="max-w-sm">{Story()}</div>],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

export const Formas: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Skeleton shape="rect" className="h-32" />
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" />
        <Skeleton lines={2} />
      </div>
    </div>
  ),
};

function Perfil({ loading }: { loading: boolean }) {
  return (
    <section
      aria-labelledby="perfil-titulo"
      aria-busy={loading}
      className="flex items-center gap-3 rounded-lg border border-ui-border-subtle p-4"
    >
      <h3 id="perfil-titulo" className="sr-only">
        Perfil
      </h3>
      {loading ? (
        <>
          <Skeleton shape="circle" />
          <Skeleton lines={2} />
        </>
      ) : (
        <>
          <Avatar name="Ana Pérez" size="lg" decorative />
          <div>
            <p className="text-ui-body font-ui-semibold">Ana Pérez</p>
            <p className="text-ui-body-sm text-ui-fg-muted">Diseño de producto</p>
          </div>
        </>
      )}
    </section>
  );
}

/**
 * La región lleva `aria-busy` mientras carga y un texto de estado anuncia el
 * cambio: el skeleton solo es visual.
 */
export const Cargando: Story = {
  render: function Render() {
    const [loading, setLoading] = useState(true);
    return (
      <div className="flex flex-col gap-3">
        <Perfil loading={loading} />
        <p role="status" className="sr-only">
          {loading ? 'Cargando perfil' : 'Perfil cargado'}
        </p>
        <Button variant="outline" size="sm" onClick={() => setLoading((value) => !value)}>
          {loading ? 'Terminar carga' : 'Volver a cargar'}
        </Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('region', { name: 'Perfil' })).toHaveAttribute('aria-busy', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Terminar carga' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('Perfil cargado');
    await expect(canvas.getByText('Diseño de producto')).toBeInTheDocument();
    // Vuelve al estado inicial para la captura
    await userEvent.click(canvas.getByRole('button', { name: 'Volver a cargar' }));
  },
};
