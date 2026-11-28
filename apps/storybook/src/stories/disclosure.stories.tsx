import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Disclosure } from '@my-ui/components';

const meta = {
  title: 'Navegación/Disclosure',
  component: Disclosure,
  args: {
    title: 'Condiciones de pago',
    children: 'Treinta días desde la fecha de la factura. Pasado el plazo, se cobra un recargo del 2 % mensual.',
    onOpenChange: fn(),
  },
  argTypes: {
    disabled: { control: 'boolean' },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
  },
  render: (args) => <Disclosure {...args} className="max-w-(--container-ui-md)" />,
} satisfies Meta<typeof Disclosure>;

export default meta;
type Story = StoryObj<typeof meta>;

/** El botón abre y cierra la sección; la flecha gira. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const trigger = within(canvasElement).getByRole('button', { name: 'Condiciones de pago' });
    await userEvent.click(trigger);
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(args.onOpenChange).toHaveBeenLastCalledWith(true);
  },
};

export const Cerrado: Story = {};
