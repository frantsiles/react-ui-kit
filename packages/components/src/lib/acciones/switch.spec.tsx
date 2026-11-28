import { createRef, useState, type FormEvent } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from './switch';

describe('Switch', () => {
  it('es un checkbox nativo con rol switch y su texto como nombre', () => {
    render(<Switch>Notificaciones</Switch>);
    const toggle = screen.getByRole('switch', { name: 'Notificaciones' });
    expect(toggle).toHaveAttribute('type', 'checkbox');
    expect(toggle).not.toBeChecked();
  });

  it('cambia con clic en la etiqueta y con Espacio', async () => {
    const onChange = vi.fn();
    render(<Switch onChange={onChange}>Notificaciones</Switch>);
    const toggle = screen.getByRole('switch');
    await userEvent.click(screen.getByText('Notificaciones'));
    expect(toggle).toBeChecked();
    await userEvent.keyboard(' ');
    expect(toggle).not.toBeChecked();
    expect(toggle).toHaveFocus();
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it('controlado', async () => {
    function Controlled() {
      const [on, setOn] = useState(true);
      return (
        <Switch checked={on} onChange={(event) => setOn(event.target.checked)}>
          Modo oscuro
        </Switch>
      );
    }
    render(<Controlled />);
    const toggle = screen.getByRole('switch');
    expect(toggle).toBeChecked();
    await userEvent.click(toggle);
    expect(toggle).not.toBeChecked();
  });

  it('conecta la ayuda', () => {
    render(<Switch description="Te avisamos cuando llegue una factura.">Avisos</Switch>);
    expect(screen.getByRole('switch')).toHaveAccessibleDescription(
      'Te avisamos cuando llegue una factura.',
    );
  });

  it('deshabilitado no cambia', async () => {
    render(<Switch disabled>Avisos</Switch>);
    await userEvent.click(screen.getByText('Avisos'));
    expect(screen.getByRole('switch')).toBeDisabled();
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('envía su valor en el formulario', async () => {
    let data: FormData | undefined;
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      data = new FormData(event.currentTarget);
    };
    render(
      <form onSubmit={onSubmit}>
        <Switch name="avisos" defaultChecked>
          Avisos
        </Switch>
        <button type="submit">Guardar</button>
      </form>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(data?.get('avisos')).toBe('on');
  });

  it('pasa ref y props al <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(
      <Switch ref={ref} data-testid="s">
        Avisos
      </Switch>,
    );
    expect(ref.current).toBe(screen.getByRole('switch'));
    expect(ref.current).toHaveAttribute('data-testid', 's');
  });

  it('sin violaciones de axe', async () => {
    const { container } = render(
      <div>
        <Switch description="Ayuda">Uno</Switch>
        <Switch defaultChecked>Dos</Switch>
        <Switch disabled>Tres</Switch>
      </div>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
