import type { Meta, StoryObj } from '@storybook/react-vite';
import * as Icons from '@my-ui/icons';
import { IconCheck, IconSearch, type IconComponent } from '@my-ui/icons';

const allIcons = Object.entries(Icons).filter(
  (entry): entry is [string, IconComponent] =>
    entry[0].startsWith('Icon') && typeof entry[1] === 'function',
);

const meta = {
  title: 'Fundamentos/Iconografía',
  component: IconSearch,
  args: { size: 'lg' },
  argTypes: {
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    label: { control: 'text' },
  },
} satisfies Meta<typeof IconSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Decorativo por defecto: aria-hidden, el texto de al lado da el significado. */
export const Decorativo: Story = {};

/** Con `label` es significativo: role="img" + aria-label. */
export const ConLabel: Story = {
  render: (args) => <IconCheck {...args} label="Verificado" className="text-ui-success" />,
};

/** Sin `size` mide 1em: escala con el texto. */
export const EscalaConElTexto: Story = {
  render: () => (
    <div className="space-y-2 text-ui-fg">
      <p className="flex items-center gap-1 text-sm"><IconSearch /> text-sm</p>
      <p className="flex items-center gap-1 text-base"><IconSearch /> text-base</p>
      <p className="flex items-center gap-1 text-2xl"><IconSearch /> text-2xl</p>
    </div>
  ),
};

/** Set completo. Las flechas y chevrons se espejan con la dirección RTL (barra de herramientas). */
export const Galeria: Story = {
  render: (args) => (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3 text-ui-fg">
      {allIcons.map(([name, Icon]) => (
        <li
          key={name}
          className="flex flex-col items-center gap-2 rounded-md border border-ui-border-subtle p-3 text-xs"
        >
          <Icon size={args.size} />
          <code>{name}</code>
        </li>
      ))}
    </ul>
  ),
};
