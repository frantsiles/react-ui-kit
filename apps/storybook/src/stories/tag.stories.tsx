import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge, Tag } from '@my-ui/components';
import { IconCheck, IconCircleAlert, IconInfo, IconTriangleAlert } from '@my-ui/icons';

const meta = {
  title: 'Etiquetas/Tag',
  component: Tag,
  args: { children: 'Diseño', tone: 'neutral', size: 'md' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {};

/** El tono nunca va solo: cada uno lleva ícono y texto (WCAG 1.4.1). */
export const Tonos: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Tag tone="neutral">Borrador</Tag>
      <Tag tone="primary" icon={<IconInfo />}>En revisión</Tag>
      <Tag tone="success" icon={<IconCheck />}>Aprobado</Tag>
      <Tag tone="warning" icon={<IconTriangleAlert />}>Vence pronto</Tag>
      <Tag tone="danger" icon={<IconCircleAlert />}>Rechazado</Tag>
    </div>
  ),
};

/** Filtros aplicados: cada tag se quita con su botón (Tab + Enter con teclado). */
export const Removibles: Story = {
  render: () => {
    const [tags, setTags] = useState(['React', 'Accesibilidad', 'Tailwind', 'Diseño de sistemas']);
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag} tone="primary" onRemove={() => setTags((t) => t.filter((x) => x !== tag))}>
            {tag}
          </Tag>
        ))}
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Quitar Tailwind' }));
    await expect(canvas.queryByText('Tailwind')).toBeNull();
  },
};

/** Texto largo: se trunca y el texto completo queda en el tooltip nativo. */
export const Truncado: Story = {
  render: () => (
    <div className="w-48">
      <Tag>Un nombre de categoría muy largo que no cabe</Tag>
    </div>
  ),
};

export const BadgeConteo: StoryObj<typeof Badge> = {
  name: 'Badge',
  render: () => (
    <div className="flex items-center gap-4 text-ui-fg">
      <button type="button" className="inline-flex items-center gap-2 rounded-md border border-ui-border px-3 py-1.5">
        Mensajes <Badge tone="danger" srText="sin leer">3</Badge>
      </button>
      <Badge tone="success">Nuevo</Badge>
      <Badge tone="warning">Beta</Badge>
    </div>
  ),
};
