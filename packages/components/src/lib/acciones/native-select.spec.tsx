import { createRef, useState, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from '../fundamentos/field';
import { NativeSelect } from './native-select';

const countries = (
  <>
    <option value="cr">Costa Rica</option>
    <option value="mx">México</option>
    <option value="es">España</option>
  </>
);

describe('NativeSelect', () => {
  it('es un <select> nativo con la etiqueta del Field', () => {
    render(
      <Field label="País" description="Donde emites tus facturas.">
        <NativeSelect>{countries}</NativeSelect>
      </Field>,
    );
    const select = screen.getByRole('combobox', { name: 'País' });
    expect(select.tagName).toBe('SELECT');
    expect(select).toHaveAccessibleDescription('Donde emites tus facturas.');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('elige con el teclado y con selectOptions', async () => {
    const onChange = vi.fn();
    render(
      <Field label="País">
        <NativeSelect onChange={onChange}>{countries}</NativeSelect>
      </Field>,
    );
    const select = screen.getByRole('combobox');
    await userEvent.selectOptions(select, 'mx');
    expect(select).toHaveValue('mx');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('placeholder: opción vacía elegida al inicio', () => {
    render(
      <Field label="País">
        <NativeSelect placeholder="Elige un país">{countries}</NativeSelect>
      </Field>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('');
    expect(screen.getByRole('option', { name: 'Elige un país' })).toHaveProperty('selected', true);
  });

  it('con required y placeholder, el formulario no se envía sin elegir', async () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <Field label="País" required>
          <NativeSelect name="pais" placeholder="Elige un país">
            {countries}
          </NativeSelect>
        </Field>
        <button type="submit">Enviar</button>
      </form>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeRequired();
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.selectOptions(select, 'es');
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('controlado', async () => {
    function Controlled() {
      const [value, setValue] = useState('es');
      return (
        <Field label="País">
          <NativeSelect value={value} onChange={(event) => setValue(event.target.value)}>
            {countries}
          </NativeSelect>
        </Field>
      );
    }
    render(<Controlled />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('es');
    await userEvent.selectOptions(select, 'cr');
    expect(select).toHaveValue('cr');
  });

  it('el Field pasa error, disabled y tamaño', () => {
    render(
      <Field label="País" error="Elige un país." disabled size="lg">
        <NativeSelect>{countries}</NativeSelect>
      </Field>,
    );
    const select = screen.getByRole('combobox');
    expect(select).toBeInvalid();
    expect(select).toBeDisabled();
    expect(select).toHaveAccessibleDescription('Elige un país.');
    expect(select).toHaveClass('min-h-ui-control-lg');
  });

  it('el ícono es decorativo', () => {
    const { container } = render(
      <Field label="País">
        <NativeSelect>{countries}</NativeSelect>
      </Field>,
    );
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('pasa ref y props al <select>', () => {
    const ref = createRef<HTMLSelectElement>();
    render(
      <Field label="País">
        <NativeSelect ref={ref} data-testid="s" autoComplete="country">
          {countries}
        </NativeSelect>
      </Field>,
    );
    expect(ref.current).toBe(screen.getByRole('combobox'));
    expect(ref.current).toHaveAttribute('autocomplete', 'country');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <Field label="País" description="Ayuda" error="Error">
        <NativeSelect placeholder="Elige">{countries}</NativeSelect>
      </Field>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
