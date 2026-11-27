import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field, SearchInput } from '@my-ui/components';

const meta = {
  title: 'Inputs/SearchInput',
  component: SearchInput,
  args: { placeholder: 'Buscar productos', defaultValue: 'zapatillas', size: 'md' },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  render: (args) => (
    <Field label="Buscar productos" hideLabel>
      <SearchInput {...args} />
    </Field>
  ),
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basico: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Limpiar búsqueda' }));
    await expect(canvas.getByRole('searchbox')).toHaveValue('');
    await expect(canvas.getByRole('searchbox')).toHaveFocus();
  },
};

/** Dentro de un formulario con role="search" aparece como región de búsqueda para lectores de pantalla. */
export const EnFormularioDeBusqueda: Story = {
  render: () => (
    <form role="search" onSubmit={(e) => e.preventDefault()} className="max-w-md">
      <Field label="Buscar en la documentación" hideLabel>
        <SearchInput name="q" placeholder="Buscar en la documentación" />
      </Field>
    </form>
  ),
};
