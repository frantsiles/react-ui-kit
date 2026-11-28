import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { Avatar } from '@my-ui/components';

/* Imagen en línea para no depender de la red en los tests. */
const photo =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#4f6d8f"/><circle cx="20" cy="16" r="7" fill="#dbe4ee"/><path d="M6 40a14 14 0 0 1 28 0z" fill="#dbe4ee"/></svg>',
  );

const meta = {
  title: 'Contenido/Avatar',
  component: Avatar,
  args: { name: 'Ana Pérez', size: 'md', decorative: false },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    src: { control: 'text' },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('img', { name: 'Ana Pérez' })).toHaveTextContent(
      'AP',
    );
  },
};

export const ConImagen: Story = { args: { src: photo } };

/** Si la imagen no carga, quedan las iniciales. */
export const ImagenRota: Story = {
  args: { src: 'data:image/png;base64,AAAA' },
  play: async ({ canvasElement }) => {
    const avatar = within(canvasElement).getByRole('img', { name: 'Ana Pérez' });
    await waitFor(() => expect(avatar.querySelector('img')).toBeNull());
  },
};

export const Tamanos: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar name="Ana Pérez" size="sm" />
      <Avatar name="Luis Mora" size="md" />
      <Avatar name="Carmen Rojas" size="lg" src={photo} />
    </div>
  ),
};

/** Con el nombre escrito al lado, el avatar es decorativo: así no se lee dos veces. */
export const ConNombre: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-ui-body">
      <Avatar name="Luis Mora" decorative />
      Luis Mora
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('img')).toBeNull();
  },
};
