import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Card, CardBody, CardHeader, ScrollArea, Text } from '@my-ui/components';

const events = Array.from({ length: 20 }, (_, index) => `Evento ${index + 1}: factura actualizada`);
const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const frame = 'max-w-(--container-ui-sm) rounded-md border border-ui-border-subtle';

const meta = {
  title: 'Layout/ScrollArea',
  component: ScrollArea,
  args: { 'aria-label': 'Historial de cambios', maxHeight: '12rem', orientation: 'vertical' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal', 'both'] },
    maxHeight: { control: 'text' },
  },
  render: (args) => (
    <ScrollArea {...args} className={frame}>
      <ul className="m-0 flex list-none flex-col gap-ui-xs p-ui-sm">
        {events.map((event) => (
          <li key={event} className="text-ui-body-sm text-ui-fg">
            {event}
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Con `Tab` la zona recibe el foco y las flechas la desplazan. */
export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Historial de cambios' });
    await waitFor(() => expect(region).toHaveAttribute('tabindex', '0'));
    await userEvent.tab();
    await expect(region).toHaveFocus();
  },
};

/** Una tabla ancha que se desplaza en horizontal sin romper la página. */
export const Horizontal: Story = {
  args: { 'aria-label': 'Ventas por mes', orientation: 'horizontal', maxHeight: undefined },
  render: (args) => (
    <ScrollArea {...args} className={frame}>
      <table className="w-max border-collapse text-ui-body-sm text-ui-fg">
        <thead>
          <tr>
            {months.map((month) => (
              <th key={month} scope="col" className="px-ui-md py-ui-sm text-start">
                {month}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {months.map((month, index) => (
              <td key={month} className="px-ui-md py-ui-sm">
                {(index + 1) * 1200}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </ScrollArea>
  ),
};

/** Sin desborde no agrega una parada de `Tab` inútil. */
export const SinDesborde: Story = {
  render: (args) => (
    <ScrollArea {...args} className={`${frame} p-ui-sm`}>
      <Text variant="body-sm">Un solo evento.</Text>
    </ScrollArea>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Historial de cambios' });
    await waitFor(() => expect(region).not.toHaveAttribute('tabindex'));
  },
};

/** Dentro de una tarjeta: el encabezado queda fijo y solo la lista se desplaza. */
export const EnUnaTarjeta: Story = {
  render: () => (
    <Card className="max-w-(--container-ui-sm)">
      <CardHeader title="Actividad" headingLevel={2} />
      <CardBody>
        <ScrollArea aria-label="Actividad reciente" maxHeight="10rem">
          <ul className="m-0 flex list-none flex-col gap-ui-xs p-0">
            {events.map((event) => (
              <li key={event} className="text-ui-body-sm">
                {event}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardBody>
    </Card>
  ),
};
