import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Alert, AlertDialog, Button, DialogTrigger, Stack, Text } from '@my-ui/components';

const meta = {
  title: 'Overlays/AlertDialog',
  component: AlertDialog,
  args: {
    title: '¿Eliminar la factura 2041?',
    confirmLabel: 'Eliminar',
    tone: 'danger',
    children: 'Se elimina para todo el equipo. Esta acción no se puede deshacer.',
    onConfirm: () => undefined,
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['danger', 'primary'] },
    onConfirm: { action: 'onConfirm' },
  },
  render: (args) => (
    <DialogTrigger>
      <Button tone="danger" variant="outline">
        Eliminar factura
      </Button>
      <AlertDialog {...args} />
    </DialogTrigger>
  ),
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El foco empieza en "Cancelar"; `Escape` cancela y devuelve el foco al botón. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Eliminar factura' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('alertdialog', { name: '¿Eliminar la factura 2041?' });
    await expect(dialog).toHaveAccessibleDescription(
      'Se elimina para todo el equipo. Esta acción no se puede deshacer.',
    );
    await waitFor(() => expect(screen.getByRole('button', { name: 'Cancelar' })).toHaveFocus());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Abierto al montar (`defaultOpen`), para ver su aspecto. */
export const Abierto: Story = {
  decorators: [
    (Story) => (
      // El diálogo está fijo y centrado en la ventana: la captura cubre todo el alto
      <div className="min-h-[calc(100dvh-2rem)]">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <DialogTrigger defaultOpen>
      <Button tone="danger" variant="outline">
        Eliminar factura
      </Button>
      <AlertDialog {...args} />
    </DialogTrigger>
  ),
};

/** `tone="primary"` para decisiones importantes que no destruyen nada. */
export const NoDestructivo: Story = {
  args: {
    title: '¿Enviar la factura al cliente?',
    confirmLabel: 'Enviar',
    tone: 'primary',
    children: 'Ferretería El Clavo la recibirá por correo y ya no podrás editarla.',
  },
  render: (args) => (
    <DialogTrigger>
      <Button>Enviar factura</Button>
      <AlertDialog {...args} />
    </DialogTrigger>
  ),
};

/**
 * `onConfirm` asíncrono: el botón muestra que carga y el diálogo se cierra al
 * terminar. Si falla, queda abierto y el error se muestra en el contenido.
 */
export const ConError: Story = {
  render: function Render(args) {
    const [error, setError] = useState(false);
    return (
      <DialogTrigger onOpenChange={() => setError(false)}>
        <Button tone="danger" variant="outline">
          Eliminar factura
        </Button>
        <AlertDialog
          {...args}
          onConfirm={async () => {
            await new Promise((done) => setTimeout(done, 600));
            setError(true);
            throw new Error('Sin conexión');
          }}
        >
          <Stack gap="sm">
            <Text>Se elimina para todo el equipo. Esta acción no se puede deshacer.</Text>
            {error && (
              <Alert tone="danger" title="No se pudo eliminar">
                Revisa tu conexión y vuelve a intentarlo.
              </Alert>
            )}
          </Stack>
        </AlertDialog>
      </DialogTrigger>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Eliminar factura' }));
    await screen.findByRole('alertdialog');
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }));
    await expect(await screen.findByText('No se pudo eliminar')).toBeInTheDocument();
    await expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};
