import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tag } from '@my-ui/components';
import { IconCheck, IconCircleAlert, IconInfo, IconTriangleAlert } from '@my-ui/icons';

const meta = {
  title: 'Etiquetas/Tag',
  component: Tag,
  args: { children: 'Diseño', tone: 'neutral', size: 'md' },
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'warning', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    icon: { control: false },
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

export const Tamanos: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Tag size="sm">Pequeño</Tag>
      <Tag size="md">Mediano</Tag>
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
