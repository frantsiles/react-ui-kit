import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconMail } from '@my-ui/icons';
import { Input } from './input';

describe('Input', () => {
  it('es un <input> nativo que participa en formularios', () => {
    render(
      <form data-testid="form">
        <Input aria-label="Nombre" name="nombre" defaultValue="Ana" />
      </form>,
    );
    const data = new FormData(screen.getByTestId('form') as HTMLFormElement);
    expect(data.get('nombre')).toBe('Ana');
  });

  it('no controlado: el usuario escribe y onChange recibe el valor', async () => {
    const onChange = vi.fn();
    render(<Input aria-label="Nombre" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox'), 'Hola');
    expect(screen.getByRole('textbox')).toHaveValue('Hola');
    expect(onChange).toHaveBeenCalledTimes(4);
  });

  it('controlado: respeta value', () => {
    render(<Input aria-label="Nombre" value="fijo" onChange={() => undefined} />);
    expect(screen.getByRole('textbox')).toHaveValue('fijo');
  });

  it('reenvía ref al <input>', () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input aria-label="Nombre" ref={ref} />);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('clic en el contenedor enfoca el input', () => {
    const { container } = render(<Input aria-label="Nombre" startIcon={<IconMail />} />);
    fireEvent.mouseDown(container.firstElementChild as Element);
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('los íconos son decorativos', () => {
    const { container } = render(<Input aria-label="Correo" startIcon={<IconMail />} />);
    expect(container.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it('invalid marca aria-invalid', () => {
    render(<Input aria-label="Nombre" invalid />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('disabled no recibe foco ni texto', async () => {
    render(<Input aria-label="Nombre" disabled />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'x');
    expect(input).toHaveValue('');
    expect(input).not.toHaveFocus();
  });

  it('readOnly se puede enfocar pero no editar', async () => {
    render(<Input aria-label="Nombre" readOnly defaultValue="fijo" />);
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'x');
    expect(input).toHaveFocus();
    expect(input).toHaveValue('fijo');
  });

  it('className va al contenedor e inputClassName al input', () => {
    const { container } = render(
      <Input aria-label="Nombre" className="contenedor" inputClassName="interno" />,
    );
    expect(container.firstElementChild).toHaveClass('contenedor');
    expect(screen.getByRole('textbox')).toHaveClass('interno');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(<Input aria-label="Correo" startIcon={<IconMail />} />);
    await expect(container).toHaveNoAxeViolations();
  });
});
