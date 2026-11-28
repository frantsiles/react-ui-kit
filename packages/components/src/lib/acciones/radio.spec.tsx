import { createRef, useState, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Radio } from './radio';
import { RadioGroup } from './radio-group';

const options = (
  <>
    <Radio value="mensual">Mensual</Radio>
    <Radio value="anual" description="Dos meses gratis.">
      Anual
    </Radio>
    <Radio value="unico">Pago único</Radio>
  </>
);

describe('RadioGroup', () => {
  it('es un radiogroup con la etiqueta como nombre', () => {
    render(
      <RadioGroup label="Plan" description="Puedes cambiarlo cuando quieras.">
        {options}
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup', { name: 'Plan' });
    expect(group.tagName).toBe('FIELDSET');
    expect(group).toHaveAccessibleDescription('Puedes cambiarlo cuando quieras.');
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('todas las opciones comparten name (generado si no se pasa)', () => {
    render(<RadioGroup label="Plan">{options}</RadioGroup>);
    const names = screen.getAllByRole('radio').map((radio) => radio.getAttribute('name'));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  it('no controlado: defaultValue y onChange', async () => {
    const onChange = vi.fn();
    render(
      <RadioGroup label="Plan" defaultValue="anual" onChange={onChange}>
        {options}
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Anual' })).toBeChecked();
    await userEvent.click(screen.getByText('Pago único'));
    expect(onChange).toHaveBeenLastCalledWith('unico');
    expect(screen.getByRole('radio', { name: 'Pago único' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Anual' })).not.toBeChecked();
  });

  it('controlado: value manda', async () => {
    function Controlled() {
      const [value, setValue] = useState<string | null>(null);
      return (
        <RadioGroup label="Plan" value={value} onChange={setValue}>
          {options}
        </RadioGroup>
      );
    }
    render(<Controlled />);
    for (const radio of screen.getAllByRole('radio')) expect(radio).not.toBeChecked();
    await userEvent.click(screen.getByRole('radio', { name: 'Mensual' }));
    expect(screen.getByRole('radio', { name: 'Mensual' })).toBeChecked();
  });

  it('Tab entra en la opción elegida y las flechas eligen', async () => {
    const onChange = vi.fn();
    render(
      <>
        <button type="button">Antes</button>
        <RadioGroup label="Plan" defaultValue="anual" onChange={onChange}>
          {options}
        </RadioGroup>
      </>,
    );
    await userEvent.click(screen.getByRole('button'));
    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'Anual' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'Pago único' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Pago único' })).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('unico');
  });

  it('required se valida de forma nativa', async () => {
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <RadioGroup label="Plan" name="plan" required>
          {options}
        </RadioGroup>
        <button type="submit">Enviar</button>
      </form>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeRequired();
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('radio', { name: 'Anual' }));
    await userEvent.click(screen.getByRole('button'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    const form = screen.getByRole('button').closest('form') as HTMLFormElement;
    expect(new FormData(form).get('plan')).toBe('anual');
  });

  it('error y disabled llegan a las opciones', () => {
    render(
      <RadioGroup label="Plan" error="Elige un plan." disabled>
        {options}
      </RadioGroup>,
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAccessibleDescription('Elige un plan.');
    expect(group).toHaveAttribute('aria-invalid', 'true');
    for (const radio of screen.getAllByRole('radio')) {
      expect(radio).toBeInvalid();
      expect(radio).toBeDisabled();
    }
  });

  it('cada opción conecta su ayuda', () => {
    render(<RadioGroup label="Plan">{options}</RadioGroup>);
    expect(screen.getByRole('radio', { name: 'Anual' })).toHaveAccessibleDescription(
      'Dos meses gratis.',
    );
  });

  it('pasa ref y props al <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <RadioGroup label="Plan">
        <Radio value="a" ref={ref} data-testid="r">
          A
        </Radio>
      </RadioGroup>,
    );
    expect(ref.current).toBe(screen.getByRole('radio'));
    expect(ref.current).toHaveAttribute('data-testid', 'r');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <RadioGroup label="Plan" description="Ayuda" error="Error" defaultValue="anual" required>
        {options}
      </RadioGroup>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
