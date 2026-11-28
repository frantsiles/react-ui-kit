import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { IconInfo, IconMail, IconUser } from '@my-ui/icons';
import { Button, Stack, Tab, TabList, TabPanel, Tabs, Text } from '@my-ui/components';

const meta = {
  title: 'Navegación/Tabs',
  component: Tabs,
  args: {
    onChange: fn(),
    children: null,
  },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    activation: { control: 'inline-radio', options: ['automatic', 'manual'] },
    disabled: { control: 'boolean' },
    children: { control: false },
  },
  render: (args) => (
    <Tabs {...args} className="max-w-(--container-ui-md)">
      <TabList aria-label="Factura 2041">
        <Tab value="detalle">Detalle</Tab>
        <Tab value="pagos">Pagos</Tab>
        <Tab value="historial" disabled>
          Historial
        </Tab>
        <Tab value="notas">Notas</Tab>
      </TabList>
      <TabPanel value="detalle">
        <Text>Ferretería El Clavo · $ 120.000 · vence el 15 de diciembre.</Text>
      </TabPanel>
      <TabPanel value="pagos">
        <Stack gap="sm">
          <Text>Sin pagos registrados.</Text>
          <div>
            <Button size="sm">Registrar pago</Button>
          </div>
        </Stack>
      </TabPanel>
      <TabPanel value="historial">
        <Text>Sin cambios.</Text>
      </TabPanel>
      <TabPanel value="notas">
        <Text>Entregar el lunes por la mañana.</Text>
      </TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Flechas cambian de pestaña; `Tab` entra al panel. */
export const Basico: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('tab', { name: 'Detalle' }));
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: 'Pagos' })).toHaveAttribute('aria-selected', 'true');
    await expect(args.onChange).toHaveBeenLastCalledWith('pagos');
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Registrar pago' })).toHaveFocus();
  },
};

/** En columna, a un costado del contenido: para muchas pestañas o nombres largos. */
export const Vertical: Story = {
  args: { orientation: 'vertical', defaultValue: 'notas' },
};

/** Con íconos (decorativos: el texto nombra la pestaña). */
export const ConIconos: Story = {
  render: (args) => (
    <Tabs {...args} className="max-w-(--container-ui-md)">
      <TabList aria-label="Cuenta">
        <Tab value="perfil" icon={<IconUser />}>
          Perfil
        </Tab>
        <Tab value="avisos" icon={<IconMail />}>
          Avisos
        </Tab>
        <Tab value="ayuda" icon={<IconInfo />}>
          Ayuda
        </Tab>
      </TabList>
      <TabPanel value="perfil">
        <Text>Nombre, correo y foto.</Text>
      </TabPanel>
      <TabPanel value="avisos">
        <Text>Qué avisos recibes y por dónde.</Text>
      </TabPanel>
      <TabPanel value="ayuda">
        <Text>Preguntas frecuentes y contacto.</Text>
      </TabPanel>
    </Tabs>
  ),
};

/** Muchas pestañas en poco ancho: la fila se desplaza en vez de pasar a otra línea. */
export const Desbordadas: Story = {
  render: (args) => (
    <Tabs {...args} className="max-w-(--container-ui-xs)">
      <TabList aria-label="Meses">
        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((mes) => (
          <Tab key={mes} value={mes}>
            {mes}
          </Tab>
        ))}
      </TabList>
      {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'].map((mes) => (
        <TabPanel key={mes} value={mes}>
          <Text>Facturas de {mes.toLowerCase()}.</Text>
        </TabPanel>
      ))}
    </Tabs>
  ),
};
