import { createRef, useState, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox } from './checkbox';
import { CheckboxGroup } from './checkbox-group';

describe('Checkbox', () => {
  it('es un checkbox nativo con su texto como nombre', () => {
    render(<Checkbox>Recordarme</Checkbox>);
    const checkbox = screen.getByRole('checkbox', { name: 'Recordarme' });
    expect(checkbox.tagName).toBe('INPUT');
    expect(checkbox).not.toBeChecked();
  });

  it('se marca con clic en la etiqueta y con Espacio', async () => {
    render(<Checkbox>Recordarme</Checkbox>);
    const checkbox = screen.getByRole('checkbox');
    await userEvent.click(screen.getByText('Recordarme'));
    expect(checkbox).toBeChecked();
    await userEvent.keyboard(' ');
    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveFocus();
  });

  it('controlado', async () => {
    function Controlled() {
      const [checked, setChecked] = useState(true);
      return (
        <Checkbox checked={checked} onChange={(event) => setChecked(event.target.checked)}>
          Avisos
        </Checkbox>
      );
    }
    render(<Controlled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('indeterminate se expone como mixto', () => {
    render(
      <Checkbox indeterminate readOnly>
        Todos
      </Checkbox>,
    );
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
  });

  it('conecta ayuda y error, y marca inválido', () => {
    render(
      <Checkbox description="Puedes cambiarlo luego." error="Debes aceptar para continuar." required>
        Acepto los términos
      </Checkbox>,
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Acepto los términos' });
    expect(checkbox).toHaveAccessibleDescription(
      'Puedes cambiarlo luego. Debes aceptar para continuar.',
    );
    expect(checkbox).toBeInvalid();
    expect(checkbox).toBeRequired();
  });

  it('deshabilitado no cambia', async () => {
    render(<Checkbox disabled>Recordarme</Checkbox>);
    await userEvent.click(screen.getByText('Recordarme'));
    expect(screen.getByRole('checkbox')).toBeDisabled();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('envía su valor en el formulario', async () => {
    let data: FormData | undefined;
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      data = new FormData(event.currentTarget);
    };
    render(
      <form onSubmit={onSubmit}>
        <Checkbox name="avisos" value="si" defaultChecked>
          Avisos
        </Checkbox>
        <button type="submit">Enviar</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(data?.get('avisos')).toBe('si');
  });

  it('pasa ref y props al <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Checkbox ref={ref} data-testid="c" className="mt-4">
        Avisos
      </Checkbox>,
    );
    expect(ref.current).toBe(screen.getByRole('checkbox'));
    expect(ref.current).toHaveAttribute('data-testid', 'c');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <div>
        <Checkbox description="Ayuda">Uno</Checkbox>
        <Checkbox indeterminate readOnly>
          Dos
        </Checkbox>
        <Checkbox error="Error" disabled>
          Tres
        </Checkbox>
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});

describe('CheckboxGroup', () => {
  const options = (
    <>
      <Checkbox value="correo">Correo</Checkbox>
      <Checkbox value="sms">SMS</Checkbox>
      <Checkbox value="push">Notificaciones</Checkbox>
    </>
  );

  it('es un grupo con la etiqueta como nombre', () => {
    render(
      <CheckboxGroup label="Canales" description="Elige al menos uno.">
        {options}
      </CheckboxGroup>,
    );
    const group = screen.getByRole('group', { name: 'Canales' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).toHaveAccessibleDescription('Elige al menos uno.');
  });

  it('no controlado: defaultValue y onChange con los valores marcados', async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup label="Canales" defaultValue={['correo']} onChange={onChange}>
        {options}
      </CheckboxGroup>,
    );
    expect(screen.getByRole('checkbox', { name: 'Correo' })).toBeChecked();
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onChange).toHaveBeenLastCalledWith(['correo', 'sms']);
    await userEvent.click(screen.getByRole('checkbox', { name: 'Correo' }));
    expect(onChange).toHaveBeenLastCalledWith(['sms']);
    expect(screen.getByRole('checkbox', { name: 'Correo' })).not.toBeChecked();
  });

  it('controlado: value manda', async () => {
    const onChange = vi.fn();
    render(
      <CheckboxGroup label="Canales" value={['push']} onChange={onChange}>
        {options}
      </CheckboxGroup>,
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'SMS' }));
    expect(onChange).toHaveBeenCalledWith(['push', 'sms']);
    // Sin actualizar value, sigue como estaba
    expect(screen.getByRole('checkbox', { name: 'SMS' })).not.toBeChecked();
  });

  it('pasa name, error y disabled a las casillas', () => {
    render(
      <CheckboxGroup label="Canales" name="canales" error="Elige al menos uno." disabled>
        {options}
      </CheckboxGroup>,
    );
    for (const checkbox of screen.getAllByRole('checkbox')) {
      expect(checkbox).toHaveAttribute('name', 'canales');
      expect(checkbox).toBeInvalid();
      expect(checkbox).toBeDisabled();
    }
    expect(screen.getByRole('group')).toHaveAccessibleDescription('Elige al menos uno.');
  });

  it('cada casilla es una parada de Tab', async () => {
    render(<CheckboxGroup label="Canales">{options}</CheckboxGroup>);
    await userEvent.tab();
    expect(screen.getByRole('checkbox', { name: 'Correo' })).toHaveFocus();
    await userEvent.tab();
    expect(screen.getByRole('checkbox', { name: 'SMS' })).toHaveFocus();
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <CheckboxGroup label="Canales" description="Ayuda" error="Error">
        {options}
      </CheckboxGroup>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
