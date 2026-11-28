import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Grid,
  Text,
} from '@my-ui/components';

const meta = {
  title: 'Layout/Card',
  component: Card,
  args: { variant: 'outline' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outline', 'raised', 'subtle'] },
    as: { control: 'select', options: ['div', 'section', 'article', 'aside', 'li'] },
  },
  render: (args) => (
    <Card {...args} className="max-w-(--container-ui-md)">
      <CardHeader
        title="Plan Equipo"
        description="Hasta 10 personas · facturación mensual"
        actions={<Badge tone="primary">Actual</Badge>}
      />
      <CardBody>
        <Text>Incluye espacios compartidos, permisos por rol y soporte por correo.</Text>
      </CardBody>
      <CardFooter>
        <Button variant="ghost">Ver detalles</Button>
        <Button>Cambiar plan</Button>
      </CardFooter>
    </Card>
  ),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** `outline` por defecto, `raised` para destacar y `subtle` como panel de fondo. */
export const Variantes: Story = {
  render: () => (
    <Grid minItemWidth="14rem">
      {(['outline', 'raised', 'subtle'] as const).map((variant) => (
        <Card key={variant} variant={variant}>
          <CardHeader title={variant} description="Variante de tarjeta" />
          <CardBody>
            <Text variant="body-sm">Contenido de ejemplo.</Text>
          </CardBody>
        </Card>
      ))}
    </Grid>
  ),
};

/**
 * La misma tarjeta, angosta y ancha: en poco espacio las acciones del
 * encabezado bajan debajo del título. Depende del ancho de la tarjeta, no de la pantalla.
 */
export const SegunSuAncho: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-ui-lg">
      {['w-64', 'w-full max-w-(--container-ui-lg)'].map((width) => (
        <Card key={width} className={width}>
          <CardHeader
            title="Pagos pendientes"
            description="3 facturas por vencer"
            actions={
              <Button size="sm" variant="outline">
                Pagar todo
              </Button>
            }
          />
        </Card>
      ))}
    </div>
  ),
};

/** Como `section`, la tarjeta es una región con el nombre de su título. */
export const ComoSeccion: Story = {
  render: () => (
    <Card as="section" className="max-w-(--container-ui-md)">
      <CardHeader title="Facturación" headingLevel={2} description="Último pago: 3 de noviembre" />
      <CardBody>
        <Text>Visa terminada en 4242.</Text>
      </CardBody>
      <CardFooter align="start">
        <Button variant="outline">Cambiar tarjeta</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvasElement }) => {
    const region = within(canvasElement).getByRole('region', { name: 'Facturación' });
    await expect(within(region).getByRole('heading', { level: 2 })).toBeInTheDocument();
  },
};

/** Tarjetas en una lista: `Grid as="ul"` y `Card as="li"`. */
export const EnUnaLista: Story = {
  render: () => (
    <Grid as="ul" aria-label="Proyectos" minItemWidth="14rem">
      {['Portal de clientes', 'App móvil', 'Facturación'].map((project) => (
        <Card as="li" key={project}>
          <CardHeader title={project} description="Actualizado hace 2 días" />
        </Card>
      ))}
    </Grid>
  ),
  play: async ({ canvasElement }) => {
    const list = within(canvasElement).getByRole('list', { name: 'Proyectos' });
    await expect(within(list).getAllByRole('listitem')).toHaveLength(3);
  },
};
