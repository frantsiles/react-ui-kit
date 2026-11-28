import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../fundamentos/field';
import { Combobox, type ComboboxProps } from './combobox';
import { ListBoxItem } from './list-box';

function Example(props: Partial<ComboboxProps> & { error?: string }) {
  const { error, ...comboProps } = props;
  return (
    <Field label="Cliente" description="Escribe para buscar." error={error}>
      <Combobox {...comboProps}>
        <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
        <ListBoxItem value="aurora">Panadería La Aurora</ListBoxItem>
        <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
        <ListBoxItem value="mar">Pescadería Mar Azul</ListBoxItem>
      </Combobox>
    </Field>
  );
}

const input = () => screen.getByRole('combobox', { name: 'Cliente' });

describe('Combobox', () => {
  it('combobox con nombre del Field, descripción y sin lista al inicio', () => {
    render(<Example />);
    expect(input()).toHaveAccessibleDescription('Escribe para buscar.');
    expect(input()).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    // El botón de la flecha queda fuera del orden de Tab
    expect(screen.getByRole('button', { name: 'Mostrar opciones Cliente', hidden: true })).toHaveAttribute('tabindex', '-1');
  });

  it('filtra al escribir y elige con el teclado', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await user.type(input(), 'ería');
    const listbox = await screen.findByRole('listbox', { name: 'Cliente' });
    expect(listbox).toBeInTheDocument();
    // "ería" está en Ferretería, Panadería y Pescadería, no en Farmacia
    expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Ferretería El Clavo',
      'Panadería La Aurora',
      'Pescadería Mar Azul',
    ]);
    await user.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('aurora');
    expect(input()).toHaveValue('Panadería La Aurora');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    // El foco nunca sale del input (aria-activedescendant)
    expect(input()).toHaveFocus();
  });

  it('sin coincidencias muestra "Sin resultados"', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.type(input(), 'xyz');
    expect(await screen.findByText('Sin resultados')).toBeInTheDocument();
  });

  it('Escape cierra; al salir vuelve al texto de la opción elegida', async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="sol" />);
    expect(input()).toHaveValue('Farmacia del Sol');
    await user.type(input(), ' 24');
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await user.tab();
    expect(input()).toHaveValue('Farmacia del Sol');
  });

  it('allowCustomValue conserva lo escrito', async () => {
    const user = userEvent.setup();
    const onInputChange = vi.fn();
    render(<Example allowCustomValue onInputChange={onInputChange} />);
    await user.type(input(), 'Cliente nuevo');
    await user.tab();
    expect(input()).toHaveValue('Cliente nuevo');
    expect(onInputChange).toHaveBeenLastCalledWith('Cliente nuevo');
  });

  it('el botón muestra todas las opciones', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Mostrar opciones Cliente', hidden: true }));
    expect(await screen.findAllByRole('option')).toHaveLength(4);
  });

  it('toma el error del Field', () => {
    render(<Example error="Elige un cliente de la lista." />);
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(input()).toHaveAccessibleDescription('Escribe para buscar. Elige un cliente de la lista.');
  });

  it('sin violaciones de axe, cerrado y abierto', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await expect(container).toHaveNoAxeViolations();
    await user.type(input(), 'a');
    await expect(await screen.findByRole('listbox')).toHaveNoAxeViolations();
  });
});
