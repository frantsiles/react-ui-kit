import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Alert, Button, Field, Input, Link } from '@my-ui/components';

const tones = ['neutral', 'primary', 'success', 'warning', 'danger'] as const;

const meta = {
  title: 'Avisos/Alert',
  component: Alert,
  args: {
    tone: 'primary',
    variant: 'inline',
    title: 'Hay una versión nueva de los términos',
    children: 'Entran en vigencia el 1 de enero. Revísalos antes de tu próxima factura.',
  },
  argTypes: {
    tone: { control: 'select', options: tones },
    variant: { control: 'inline-radio', options: ['inline', 'banner'] },
    actions: { control: false },
    icon: { control: false },
  },
  decorators: [(Story) => <div className="max-w-xl">{Story()}</div>],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** Cada tono lleva su ícono y un prefijo oculto ("Error:", "Advertencia:"…). */
export const Tonos: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Alert tone="neutral" title="Los cambios se guardan solos" />
      <Alert tone="primary" title="Hay una versión nueva de los términos" />
      <Alert tone="success" title="Tu pago fue recibido" />
      <Alert tone="warning" title="Tu tarjeta vence este mes" />
      <Alert tone="danger" title="No pudimos procesar el pago" />
    </div>
  ),
};

export const ConAcciones: Story = {
  args: {
    tone: 'warning',
    title: 'Tu tarjeta vence este mes',
    children: 'Actualízala para que tus facturas se sigan pagando solas.',
    actions: (
      <>
        <Button size="sm" tone="neutral">
          Actualizar tarjeta
        </Button>
        <Button size="sm" variant="ghost" tone="neutral">
          Recordármelo luego
        </Button>
      </>
    ),
  },
};

/** Con `onDismiss` aparece el botón de cerrar. Al cerrarlo, el foco no se pierde: va a un lugar lógico. */
export const Cerrable: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex flex-col gap-3">
        {open ? (
          <Alert {...args} tone="success" title="Factura enviada" onDismiss={() => setOpen(false)}>
            La recibirá en unos minutos.
          </Alert>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="self-start"
            onClick={() => setOpen(true)}
            autoFocus
          >
            Mostrar el aviso otra vez
          </Button>
        )}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Cerrar aviso' }));
    const again = canvas.getByRole('button', { name: 'Mostrar el aviso otra vez' });
    await expect(again).toHaveFocus();
    await userEvent.click(again);
  },
};

/** A lo ancho de una página o sección, sin esquinas redondeadas. */
export const Banner: Story = {
  args: {
    variant: 'banner',
    tone: 'warning',
    title: 'Mantenimiento programado',
    children: (
      <>
        El sábado de 2:00 a 4:00 no se podrán emitir facturas.{' '}
        <Link href="#estado">Ver el estado del servicio</Link>
      </>
    ),
  },
  decorators: [(Story) => <div className="-mx-4">{Story()}</div>],
};

/**
 * Un error que aparece tras una acción: `role="alert"` lo anuncia en cuanto se
 * muestra. Se agrega al enviar, no está desde el inicio.
 */
export const ErrorAlEnviar: Story = {
  render: function Render() {
    const [failed, setFailed] = useState(false);
    return (
      <form
        aria-label="Inicio de sesión"
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setFailed(true);
        }}
      >
        {failed && (
          <Alert role="alert" tone="danger" title="No pudimos iniciar sesión">
            Revisa el correo y la contraseña e inténtalo de nuevo.
          </Alert>
        )}
        <Field label="Correo electrónico">
          <Input type="email" autoComplete="email" defaultValue="ana@ejemplo.com" />
        </Field>
        <Button type="submit" className="self-start">
          Entrar
        </Button>
      </form>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Entrar' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Error: No pudimos iniciar sesión',
    );
  },
};
