import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTrigger,
  Field,
  Input,
  Stack,
  Text,
  type DialogSize,
} from '@my-ui/components';

/** Args de las historias (las props de Dialog son una unión: título o aria-label). */
interface StoryArgs {
  title: string;
  description: string;
  size: DialogSize;
  dismissable: boolean;
}

const meta = {
  title: 'Overlays/Dialog',
  args: {
    title: 'Editar factura',
    description: 'Los cambios se aplican al guardar.',
    size: 'md',
    dismissable: true,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <DialogTrigger>
      <Button>Editar factura</Button>
      <Dialog {...args}>
        {({ close }) => (
          <>
            <DialogBody>
              <Stack gap="md">
                <Field label="Cliente">
                  <Input defaultValue="Ferretería El Clavo" />
                </Field>
                <Field label="Monto">
                  <Input defaultValue="125 000" inputMode="decimal" />
                </Field>
              </Stack>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button onClick={close}>Guardar</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/**
 * El diálogo está fijo y centrado en la ventana: la historia ocupa todo el
 * alto (menos el padding) para que la captura lo incluya entero.
 */
const fullHeight: Story['decorators'] = [
  (Story) => (
    <div className="min-h-[calc(100dvh-2rem)]">
      <Story />
    </div>
  ),
];

/** El foco entra al diálogo, `Tab` no sale de él y `Escape` lo cierra devolviendo el foco al botón. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Editar factura' });
    await userEvent.click(trigger);
    // El diálogo se monta en un portal, fuera del canvas
    const dialog = await screen.findByRole('dialog', { name: 'Editar factura' });
    await expect(dialog).toHaveAccessibleDescription('Los cambios se aplican al guardar.');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Abierto al montar (`defaultOpen`), para ver su aspecto. */
export const Abierto: Story = {
  decorators: fullHeight,
  render: (args) => (
    <DialogTrigger defaultOpen>
      <Button>Eliminar factura</Button>
      <Dialog {...args} title="¿Eliminar la factura 2041?" description={undefined} size="sm">
        {({ close }) => (
          <>
            <DialogBody>
              <Text>Se elimina para todo el equipo. Esta acción no se puede deshacer.</Text>
            </DialogBody>
            <DialogFooter>
              <Button variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button tone="danger" onClick={close}>
                Eliminar
              </Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/** Con mucho contenido solo el cuerpo se desplaza; el título y el pie quedan a la vista. */
export const ContenidoLargo: Story = {
  decorators: fullHeight,
  render: (args) => (
    <DialogTrigger defaultOpen>
      <Button>Ver términos</Button>
      <Dialog {...args} title="Términos del servicio" description={undefined} size="md">
        {({ close }) => (
          <>
            <DialogBody>
              <Stack gap="sm">
                {Array.from({ length: 24 }, (_, index) => (
                  <Text key={index}>
                    {`${index + 1}. El servicio se presta según las condiciones vigentes al momento del uso.`}
                  </Text>
                ))}
              </Stack>
            </DialogBody>
            <DialogFooter>
              <Button onClick={close}>Entendido</Button>
            </DialogFooter>
          </>
        )}
      </Dialog>
    </DialogTrigger>
  ),
};

/**
 * Controlado (`open` y `onOpenChange`), sin `DialogTrigger`: para abrirlo
 * después de otra acción. `dismissable={false}`: un clic afuera no lo cierra,
 * para no perder lo que se escribió.
 */
export const Controlado: Story = {
  render: function Render() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Nueva nota
        </Button>
        <Dialog title="Nueva nota" open={open} onOpenChange={setOpen} dismissable={false}>
          {({ close }) => (
            <>
              <DialogBody>
                <Field label="Nota">
                  <Input />
                </Field>
              </DialogBody>
              <DialogFooter>
                <Button variant="ghost" onClick={close}>
                  Descartar
                </Button>
                <Button onClick={close}>Guardar</Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Nueva nota' }));
    await expect(await screen.findByRole('dialog', { name: 'Nueva nota' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Descartar' }));
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  },
};
