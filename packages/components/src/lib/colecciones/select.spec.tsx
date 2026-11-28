import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../fundamentos/field';
import { ListBoxItem } from './list-box';
import { Select, type SelectProps } from './select';

function Example(props: Partial<SelectProps> & { error?: string; description?: string }) {
  const { error, description, ...selectProps } = props;
  return (
    <Field label="Cliente" error={error} description={description}>
      <Select {...selectProps}>
        <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
        <ListBoxItem value="aurora">Panadería La Aurora</ListBoxItem>
        <ListBoxItem value="cerrada" disabled>
          Librería Cerrada
        </ListBoxItem>
        <ListBoxItem value="sol">Farmacia del Sol</ListBoxItem>
      </Select>
    </Field>
  );
}

const trigger = () => screen.getByRole('button', { name: /Cliente/ });

describe('Select', () => {
  it('el botón se nombra con la etiqueta del Field y el valor', () => {
    render(<Example defaultValue="aurora" description="A quién se factura." />);
    const button = trigger();
    // Primero qué campo es, después el valor
    expect(button).toHaveAccessibleName('Cliente Panadería La Aurora');
    expect(button).toHaveAccessibleDescription('A quién se factura.');
    expect(button).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('sin valor muestra el placeholder de useMessages', () => {
    render(<Example />);
    expect(trigger()).toHaveTextContent('Elige una opción');
  });

  it('se abre con el mouse, elige y cierra', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example onChange={onChange} />);
    await user.click(trigger());
    const listbox = screen.getByRole('listbox', { name: 'Cliente' });
    expect(listbox).toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(onChange).toHaveBeenLastCalledWith('sol');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent('Farmacia del Sol');
    await waitFor(() => expect(trigger()).toHaveFocus());
  });

  it('teclado: flecha abajo abre, Enter elige, Escape cierra sin cambiar', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Example defaultValue="clavo" onChange={onChange} />);
    await user.tab();
    expect(trigger()).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Ferretería El Clavo' })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenLastCalledWith('aurora');
    // Al elegir, el foco vuelve al botón
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger()).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    await screen.findByRole('listbox');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('controlado', async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState<string | null>('clavo');
      return (
        <>
          <Example value={value} onChange={setValue} />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);
    await user.click(trigger());
    await user.click(screen.getByRole('option', { name: 'Farmacia del Sol' }));
    expect(screen.getByRole('status')).toHaveTextContent('sol');
  });

  it('toma invalid, required y disabled del Field', () => {
    const { rerender } = render(<Example error="Elige un cliente." required />);
    expect(trigger()).toHaveAccessibleDescription('Elige un cliente.');
    rerender(
      <Field label="Cliente" disabled>
        <Select>
          <ListBoxItem value="clavo">Ferretería El Clavo</ListBoxItem>
        </Select>
      </Field>,
    );
    expect(trigger()).toBeDisabled();
  });

  it('envía el valor con el formulario', () => {
    render(
      <form aria-label="Factura">
        <Example name="cliente" defaultValue="sol" />
      </form>,
    );
    const form = screen.getByRole('form');
    expect(new FormData(form as HTMLFormElement).get('cliente')).toBe('sol');
  });

  it('sin violaciones de axe, cerrado y abierto', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example defaultValue="clavo" />);
    await expect(container).toHaveNoAxeViolations();
    await user.click(trigger());
    await expect(screen.getByRole('listbox')).toHaveNoAxeViolations();
  });
});
