import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import { Button, Inline, ToastRegion, toast, type ToastOptions, type ToastTone } from '@my-ui/components';

/** Args de las historias: las opciones de `toast()`. */
interface StoryArgs {
  title: string;
  description: string;
  tone: ToastTone;
}

const meta = {
  title: 'Overlays/Toast',
  args: {
    title: 'Factura enviada',
    description: 'Ferretería El Clavo la recibirá por correo.',
    tone: 'success',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: ['neutral', 'primary', 'success', 'warning', 'danger'] },
  },
  decorators: [
    (Story) => {
      // La cola es global: cada historia empieza y termina sin toasts
      useEffect(() => () => toast.dismissAll(), []);
      return (
        <>
          <Story />
          <ToastRegion />
        </>
      );
    },
  ],
  render: (args) => <Button onClick={() => toast(args)}>Enviar factura</Button>,
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/** La región está fija abajo: la historia ocupa todo el alto para que la captura la incluya. */
const fullHeight: Story['decorators'] = [
  (Story) => (
    <div className="min-h-[calc(100dvh-2rem)]">
      <Story />
    </div>
  ),
];

/** Muestra toasts al montar, sin tiempo, para ver su aspecto. */
function ShowOnMount({ toasts }: { toasts: ToastOptions[] }) {
  useEffect(() => {
    const ids = toasts.map((options) => toast({ timeout: false, ...options }));
    return () => ids.forEach((id) => toast.dismiss(id));
  }, [toasts]);
  return null;
}

/** El botón muestra un toast; el lector de pantalla lo anuncia sin mover el foco. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Enviar factura' });
    await userEvent.click(trigger);
    const item = await screen.findByRole('alertdialog', { name: 'Listo: Factura enviada' });
    await expect(item).toHaveAccessibleDescription('Ferretería El Clavo la recibirá por correo.');
    await expect(trigger).toHaveFocus();
    await userEvent.click(within(item).getByRole('button', { name: 'Cerrar notificación' }));
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument());
  },
};

const tones: ToastOptions[] = [
  { title: 'Hay una versión nueva', tone: 'neutral' },
  { title: 'Sincronizando', description: 'Puede tardar unos minutos.', tone: 'primary' },
  { title: 'Factura enviada', tone: 'success' },
  { title: 'Quedan 2 facturas sin fecha', tone: 'warning' },
  { title: 'No se pudo guardar', description: 'Revisa tu conexión.', tone: 'danger' },
];

/** Los cinco tonos. El más nuevo queda abajo, junto al borde. */
export const Tonos: Story = {
  decorators: fullHeight,
  render: () => <ShowOnMount toasts={tones} />,
};

const undoToast: ToastOptions[] = [
  { title: 'Factura eliminada', action: { label: 'Deshacer', onAction: () => undefined } },
];

/** Con una acción corta. No se cierra solo: da tiempo a usarla. */
export const ConAccion: Story = {
  decorators: fullHeight,
  render: () => <ShowOnMount toasts={undoToast} />,
};

/**
 * Deshacer en vez de confirmar: la acción se hace al instante y el toast
 * ofrece volver atrás.
 */
export const Deshacer: Story = {
  render: () => (
    <Inline gap="sm">
      <Button
        tone="danger"
        variant="outline"
        onClick={() =>
          toast({
            title: 'Factura 2041 eliminada',
            action: { label: 'Deshacer', onAction: () => toast({ title: 'Factura 2041 restaurada' }) },
          })
        }
      >
        Eliminar factura
      </Button>
    </Inline>
  ),
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Eliminar factura' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Deshacer' }));
    await expect(await screen.findByRole('alertdialog', { name: 'Factura 2041 restaurada' })).toBeInTheDocument();
  },
};
