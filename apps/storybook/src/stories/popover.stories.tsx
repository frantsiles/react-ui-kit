import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, screen, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  IconButton,
  Inline,
  Popover,
  PopoverTrigger,
  Stack,
  Text,
  type PopoverPlacement,
} from '@my-ui/components';
import { IconChevronDown, IconInfo } from '@my-ui/icons';

/** Args de las historias (las props de Popover son una unión: título o aria-label). */
interface StoryArgs {
  title: string;
  placement: PopoverPlacement;
}

const meta = {
  title: 'Overlays/Popover',
  // Espacio para que el popover abierto entre en la captura
  decorators: [
    (Story) => (
      <div className="min-h-64">
        <Story />
      </div>
    ),
  ],
  args: { title: 'Filtrar facturas', placement: 'bottom start' },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'top start', 'top end', 'bottom', 'bottom start', 'bottom end', 'start', 'end'],
    },
  },
  render: (args) => (
    <PopoverTrigger>
      <Button variant="outline" endIcon={<IconChevronDown />}>
        Filtros
      </Button>
      <Popover title={args.title} placement={args.placement}>
        {({ close }) => (
          <Stack gap="sm">
            <Checkbox>Solo vencidas</Checkbox>
            <Checkbox>Con saldo pendiente</Checkbox>
            <Inline justify="end" gap="sm">
              <Button size="sm" variant="ghost" onClick={close}>
                Cancelar
              </Button>
              <Button size="sm" onClick={close}>
                Aplicar
              </Button>
            </Inline>
          </Stack>
        )}
      </Popover>
    </PopoverTrigger>
  ),
} satisfies Meta<StoryArgs>;

export default meta;
type Story = StoryObj<StoryArgs>;

/** Se abre con clic, `Enter` o `Espacio`; se cierra con `Escape` o con un clic afuera. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Filtros' });
    await userEvent.click(trigger);
    // El popover se monta en un portal, fuera del canvas
    const dialog = await screen.findByRole('dialog', { name: 'Filtrar facturas' });
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

/** Abierto al montar (`defaultOpen`), para ver su aspecto. */
export const Abierto: Story = {
  render: (args) => (
    <PopoverTrigger defaultOpen>
      <Button variant="outline">Filtros</Button>
      <Popover title={args.title} placement={args.placement}>
        <Stack gap="sm">
          <Checkbox>Solo vencidas</Checkbox>
          <Checkbox>Con saldo pendiente</Checkbox>
        </Stack>
      </Popover>
    </PopoverTrigger>
  ),
};

/** Con un `IconButton`: el disparador se nombra con `label` y el popover con `aria-label` o un título. */
export const ConIconButton: Story = {
  render: () => (
    <Inline gap="xs" align="center">
      <Text>Saldo disponible</Text>
      <PopoverTrigger>
        <IconButton label="Qué es el saldo disponible" variant="ghost" size="sm">
          <IconInfo />
        </IconButton>
        <Popover aria-label="Saldo disponible" placement="bottom">
          <Text variant="body-sm">Lo que puedes usar hoy: tu saldo menos los pagos en proceso.</Text>
        </Popover>
      </PopoverTrigger>
    </Inline>
  ),
};

/** `start` y `end` son lógicos: en RTL se espejan. Si no entra, se da vuelta solo. */
export const Posiciones: Story = {
  render: () => (
    <div className="grid place-items-center py-ui-2xl">
      <Inline gap="sm">
        {(['top', 'bottom', 'start', 'end'] as PopoverPlacement[]).map((placement) => (
          <PopoverTrigger key={placement}>
            <Button variant="outline" size="sm">
              {placement}
            </Button>
            <Popover aria-label={`Popover ${placement}`} placement={placement}>
              <Text variant="body-sm">{placement}</Text>
            </Popover>
          </PopoverTrigger>
        ))}
      </Inline>
    </div>
  ),
};
