import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '@my-ui/components';
import { IconArrowRight, IconDownload, IconPlus, IconTrash } from '@my-ui/icons';

const tones = ['neutral', 'primary', 'success', 'warning', 'danger'] as const;
const variants = ['solid', 'outline', 'ghost'] as const;

const meta = {
  title: 'Acciones/Button',
  component: Button,
  args: {
    children: 'Guardar cambios',
    variant: 'solid',
    tone: 'primary',
    size: 'md',
    disabled: false,
    onClick: fn(),
  },
  argTypes: {
    variant: { control: 'inline-radio', options: variants },
    tone: { control: 'select', options: tones },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    startIcon: { control: false },
    endIcon: { control: false },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button', { name: 'Guardar cambios' });
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalledTimes(1);
    // También con teclado
    button.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(args.onClick).toHaveBeenCalledTimes(3);
  },
};

/** Una acción principal (`solid`), secundarias (`outline`) y terciarias (`ghost`). */
export const Variantes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Publicar</Button>
      <Button variant="outline">Vista previa</Button>
      <Button variant="ghost">Cancelar</Button>
    </div>
  ),
};

/** Cada variante en cada tono. `danger` para acciones destructivas. */
export const Tonos: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      {variants.map((variant) => (
        <div key={variant} className="flex flex-wrap gap-2">
          {tones.map((tone) => (
            <Button key={tone} variant={variant} tone={tone}>
              {tone}
            </Button>
          ))}
        </div>
      ))}
    </div>
  ),
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Pequeño</Button>
      <Button size="md">Mediano</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

/** Los íconos son decorativos: el nombre del botón es su texto. */
export const ConIconos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button startIcon={<IconPlus />}>Nueva factura</Button>
      <Button variant="outline" startIcon={<IconDownload />}>
        Descargar PDF
      </Button>
      <Button variant="ghost" endIcon={<IconArrowRight />}>
        Siguiente
      </Button>
      <Button tone="danger" startIcon={<IconTrash />}>
        Eliminar
      </Button>
    </div>
  ),
};

/** Deshabilitado sale del orden de Tab. Explica cerca por qué no se puede usar. */
export const Deshabilitado: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Publicar</Button>
      <Button variant="outline" disabled>
        Vista previa
      </Button>
      <Button variant="ghost" disabled>
        Cancelar
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const button of within(canvasElement).getAllByRole('button')) {
      await expect(button).toBeDisabled();
    }
  },
};

/** En un formulario, solo el botón que envía lleva `type="submit"`. */
export const EnFormulario: Story = {
  render: () => (
    <form
      className="flex gap-3"
      onSubmit={(event) => event.preventDefault()}
      aria-label="Formulario de ejemplo"
    >
      <Button variant="ghost">Cancelar</Button>
      <Button type="submit">Enviar</Button>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Cancelar' })).toHaveAttribute('type', 'button');
    await expect(canvas.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit');
  },
};
