import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Accordion, AccordionItem } from '@my-ui/components';

const meta = {
  title: 'Navegación/Accordion',
  component: Accordion,
  args: {
    onChange: fn(),
    children: null,
  },
  argTypes: {
    multiple: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
  render: (args) => (
    <Accordion {...args} className="max-w-(--container-ui-md)">
      <AccordionItem value="plazo" title="¿Cuándo vence una factura?">
        A los treinta días de la fecha de emisión, salvo que el cliente tenga otro plazo acordado.
      </AccordionItem>
      <AccordionItem value="moneda" title="¿En qué moneda facturo?">
        En la moneda del cliente. Puedes cambiarla en los datos de cada cliente.
      </AccordionItem>
      <AccordionItem value="anular" title="¿Puedo anular una factura?" disabled>
        Solo con una nota de crédito.
      </AccordionItem>
      <AccordionItem value="copia" title="¿Cómo envío una copia?">
        Desde la factura, con «Enviar por correo».
      </AccordionItem>
    </Accordion>
  ),
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Abrir una sección cierra la anterior. */
export const Basico: Story = {
  args: { defaultValue: ['plazo'] },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: '¿En qué moneda facturo?' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(['moneda']);
    await expect(canvas.getByRole('button', { name: '¿Cuándo vence una factura?' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

/** Con `multiple`, varias abiertas a la vez. */
export const Multiple: Story = {
  args: { multiple: true, defaultValue: ['plazo', 'copia'] },
};
