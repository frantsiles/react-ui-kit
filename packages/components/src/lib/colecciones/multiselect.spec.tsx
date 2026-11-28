import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../fundamentos/field';
import { ListBoxItem } from './list-box';
import { Multiselect, type MultiselectProps } from './multiselect';

function Example(props: Partial<MultiselectProps> & { error?: string }) {
  const { error, ...multiProps } = props;
  return (
    <Field label="Etiquetas" description="Escribe para buscar." error={error}>
      <Multiselect {...multiProps}>
        <ListBoxItem value="urgente">Urgente</ListBoxItem>
        <ListBoxItem value="factura">Factura</ListBoxItem>
        <ListBoxItem value="cliente">Cliente nuevo</ListBoxItem>
        <ListBoxItem value="revisar">Revisar</ListBoxItem>
      </Multiselect>
    </Field>
  );
}

const input = () => screen.getByRole('combobox', { name: 'Etiquetas' });

describe('Multiselect', () => {
  it('combobox con nombre del Field y descripción', () => {
    render(<Example />);
    // Sin elegidas, solo la ayuda del Field
    expect(input().getAttribute('aria-describedby')).toBeTruthy();
    expect(input()).toHaveAccessibleDescription(/^\s*Escribe para buscar\.\s*$/);
    expect(input()).toHaveAttribute('aria-expanded', 'false');
  });

  it('elige varias con el teclado; la lista sigue abierta y el texto se borra', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await user.type(input(), 'fac');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['factura']);
    expect(input()).toHaveValue('');
    expect(screen.getByRole('listbox', { name: 'Etiquetas' })).toBeInTheDocument();
    await user.type(input(), 'urg');
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onChange).toHaveBeenLastCalledWith(['factura', 'urgente']);
    expect(input()).toHaveFocus();
  });

  it('las elegidas se ven como tags y forman parte de la descripción', () => {
    render(<Example defaultValue={['urgente', 'revisar']} />);
    expect(screen.getByText('Urgente')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Quitar Revisar' })).toBeInTheDocument();
    expect(input()).toHaveAccessibleDescription(/Urgente (y|and) Revisar/);
    expect(input()).toHaveAccessibleDescription(/Escribe para buscar\./);
  });

  it('el botón del tag la quita y devuelve el foco al input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example defaultValue={['urgente', 'revisar']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Quitar Urgente' }));
    expect(onChange).toHaveBeenLastCalledWith(['revisar']);
    expect(screen.queryByText('Urgente')).not.toBeInTheDocument();
    expect(input()).toHaveFocus();
  });

  it('en la lista, las elegidas están marcadas y se desmarcan al volver a elegirlas', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example defaultValue={['factura']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: /Mostrar opciones/, hidden: true }));
    const option = await screen.findByRole('option', { name: 'Factura' });
    expect(option).toHaveAttribute('aria-selected', 'true');
    await user.click(option);
    expect(onChange).toHaveBeenLastCalledWith([]);
  });

  it('deshabilitado: los tags no se pueden quitar', () => {
    render(<Example disabled defaultValue={['urgente']} />);
    expect(input()).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Quitar Urgente' })).toBeDisabled();
  });

  it('toma el error del Field', () => {
    render(<Example error="Elige al menos una etiqueta." />);
    expect(input()).toHaveAttribute('aria-invalid', 'true');
    expect(input()).toHaveAccessibleDescription(/Elige al menos una etiqueta\./);
  });

  it('sin violaciones de axe, con tags y abierto', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example defaultValue={['urgente']} />);
    await expect(container).toHaveNoAxeViolations();
    await user.type(input(), 'e');
    await expect(await screen.findByRole('listbox')).toHaveNoAxeViolations();
    await waitFor(() => expect(screen.getAllByRole('option').length).toBeGreaterThan(0));
  });
});
