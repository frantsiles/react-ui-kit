import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DialogBody,
  DialogFooter,
  DialogTrigger,
  Drawer,
  Field,
  NativeSelect,
  Stack,
  Text,
  type DrawerPlacement,
  type DrawerSize,
} from '@my-ui/components';

/** Args de las historias (las props de Drawer son una unión: título o aria-label). */
interface StoryArgs {
  title: string;
  description: string;
  placement: DrawerPlacement;
  size: DrawerSize;
  dismissable: boolean;
}

function Filters({ close }: { close: () => void }) {
  return (
    <>
      <DialogBody>
        <Stack gap="lg">
          <Field label="Cliente">
            <NativeSelect defaultValue="todos">
              <option value="todos">Todos</option>
              <option value="clavo">Ferretería El Clavo</option>
              <option value="aurora">Panadería La Aurora</option>
            </NativeSelect>
          </Field>
          <CheckboxGroup label="Estado" defaultValue={['pendiente']}>
            <Checkbox value="pendiente">Pendiente</Checkbox>
            <Checkbox value="pagada">Pagada</Checkbox>
            <Checkbox value="vencida">Vencida</Checkbox>
          </CheckboxGroup>
        </Stack>
      </DialogBody>
      <DialogFooter align="between">
        <Button variant="ghost" onClick={close}>
          Limpiar
        </Button>
        <Button onClick={close}>Aplicar filtros</Button>
      </DialogFooter>
    </>
  );
}

const meta = {
  title: 'Overlays/Drawer',
  args: {
    title: 'Filtros',
    description: 'Se aplican al listado de facturas.',
    placement: 'end',
    size: 'md',
    dismissable: true,
  },
  argTypes: {
    placement: { control: 'inline-radio', options: ['start', 'end', 'bottom'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
  render: (args) => (
    <DialogTrigger>
      <Button variant="outline">Filtros</Button>
      <Drawer {...args}>{({ close }) => <Filters close={close} />}</Drawer>
    </DialogTrigger>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/** El panel está fijo en la ventana: la historia ocupa todo el alto para que la captura lo incluya. */
const fullHeight: Story['decorators'] = [
  (Story) => (
    <div className="min-h-[calc(100dvh-2rem)]">
      <Story />
    </div>
  ),
];

/** El foco entra al panel y `Escape` lo cierra devolviendo el foco al botón. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await userEvent.click(trigger);
    const dialog = await screen.findByRole('dialog', { name: 'Filtros' });
    await expect(dialog).toHaveAccessibleDescription('Se aplican al listado de facturas.');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Abierto al montar, al final de la línea (a la derecha en LTR, a la izquierda en RTL). */
export const Abierto: Story = {
  decorators: fullHeight,
  render: (args) => (
    <DialogTrigger defaultOpen>
      <Button variant="outline">Filtros</Button>
      <Drawer {...args}>{({ close }) => <Filters close={close} />}</Drawer>
    </DialogTrigger>
  ),
};

/** `placement="start"`: al inicio de la línea, como un menú de navegación. */
export const AlInicio: Story = {
  ...Abierto,
  args: { placement: 'start', size: 'sm' },
};

/** `placement="bottom"`: hoja inferior, cómoda en móviles. Deja ver una franja de la página. */
export const Abajo: Story = {
  decorators: fullHeight,
  args: { title: 'Compartir factura', description: 'Elige cómo enviarla.', placement: 'bottom' },
  render: (args) => (
    <DialogTrigger defaultOpen>
      <Button variant="outline">Compartir</Button>
      <Drawer {...args}>
        {({ close }) => (
          <DialogBody>
            <Stack gap="sm">
              <Button variant="outline" onClick={close}>
                Enviar por correo
              </Button>
              <Button variant="outline" onClick={close}>
                Descargar PDF
              </Button>
              <Text tone="muted">El cliente recibe la versión final, sin borradores.</Text>
            </Stack>
          </DialogBody>
        )}
      </Drawer>
    </DialogTrigger>
  ),
};
