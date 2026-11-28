import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './field';
import { Input } from './input';
import { Textarea } from './textarea';

describe('Field', () => {
  it('asocia la etiqueta con el control (clic en la etiqueta enfoca)', async () => {
    render(
      <Field label="Correo">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText('Correo');
    await userEvent.click(screen.getByText('Correo'));
    expect(input).toHaveFocus();
  });

  it('conecta ayuda y error con aria-describedby y marca aria-invalid', () => {
    render(
      <Field label="Correo" description="Usaremos este correo para avisarte" error="Ingresa un correo válido">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Correo' });
    expect(input).toHaveAccessibleDescription(
      'Usaremos este correo para avisarte Ingresa un correo válido',
    );
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('sin error no marca aria-invalid ni describe un error', () => {
    render(
      <Field label="Nombre" description="Como aparece en tu documento">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).toHaveAccessibleDescription('Como aparece en tu documento');
  });

  it('required: asterisco solo visual y atributo required en el control', () => {
    render(
      <Field label="Nombre" required>
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Nombre' });
    expect(input).toBeRequired();
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('optional muestra "(opcional)" dentro de la etiqueta', () => {
    render(
      <Field label="Teléfono" optional>
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Teléfono (opcional)' })).toBeInTheDocument();
  });

  it('disabled se propaga al control', () => {
    render(
      <Field label="Nombre" disabled>
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('hideLabel mantiene el nombre accesible', () => {
    render(
      <Field label="Buscar" hideLabel>
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox', { name: 'Buscar' })).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toHaveClass('sr-only');
  });

  it('las props del control ganan sobre las del Field', () => {
    render(
      <Field label="Nombre" id="desde-field">
        <Input id="propio" aria-describedby="externo" />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'propio');
    expect(input).toHaveAttribute('aria-describedby', 'externo');
  });

  it('funciona con Textarea', () => {
    render(
      <Field label="Comentario" error="Escribe al menos 10 caracteres">
        <Textarea />
      </Field>,
    );
    const textarea = screen.getByRole('textbox', { name: 'Comentario' });
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
    expect(textarea).toHaveAccessibleDescription('Escribe al menos 10 caracteres');
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <form>
        <Field label="Correo" description="Ayuda" error="Error" required>
          <Input type="email" />
        </Field>
        <Field label="Comentario" optional>
          <Textarea />
        </Field>
      </form>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
