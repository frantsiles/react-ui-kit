import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Field } from './field';
import { PasswordInput } from './password-input';

const getInput = (container: HTMLElement) =>
  container.querySelector('input') as HTMLInputElement;

describe('PasswordInput', () => {
  it('oculta el texto por defecto con autocompletado de contraseña actual', () => {
    const { container } = render(<PasswordInput aria-label="Contraseña" />);
    const input = getInput(container);
    expect(input).toHaveAttribute('type', 'password');
    expect(input).toHaveAttribute('autocomplete', 'current-password');
    expect(input).toHaveAttribute('spellcheck', 'false');
    expect(input).toHaveAttribute('autocapitalize', 'none');
  });

  it('permite autoComplete="new-password"', () => {
    const { container } = render(
      <PasswordInput aria-label="Contraseña" autoComplete="new-password" />,
    );
    expect(getInput(container)).toHaveAttribute('autocomplete', 'new-password');
  });

  it('el botón alterna la visibilidad y su estado con aria-pressed', async () => {
    const { container } = render(<PasswordInput aria-label="Contraseña" />);
    const toggle = screen.getByRole('button', { name: 'Mostrar contraseña' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('aria-controls', getInput(container).id);

    await userEvent.click(toggle);
    expect(getInput(container)).toHaveAttribute('type', 'text');
    expect(toggle).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(toggle);
    expect(getInput(container)).toHaveAttribute('type', 'password');
  });

  it('el botón no envía el formulario', async () => {
    const onSubmit = vi.fn((e: SubmitEvent) => e.preventDefault());
    render(
      <form onSubmit={(e) => onSubmit(e.nativeEvent as SubmitEvent)}>
        <PasswordInput aria-label="Contraseña" />
      </form>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Mostrar contraseña' }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('permite pegar', async () => {
    const { container } = render(<PasswordInput aria-label="Contraseña" />);
    const input = getInput(container);
    await userEvent.click(input);
    await userEvent.paste('S3gura!');
    expect(input).toHaveValue('S3gura!');
  });

  it('dentro de un Field usa su id y se deshabilita con él', () => {
    const { container } = render(
      <Field label="Contraseña" id="pwd" disabled>
        <PasswordInput />
      </Field>,
    );
    expect(getInput(container)).toHaveAttribute('id', 'pwd');
    expect(screen.getByRole('button', { name: 'Mostrar contraseña' })).toBeDisabled();
    expect(screen.getByLabelText('Contraseña')).toBe(getInput(container));
  });

  it('no tiene violaciones de accesibilidad', async () => {
    const { container } = render(
      <Field label="Contraseña" description="Mínimo 12 caracteres">
        <PasswordInput autoComplete="new-password" />
      </Field>,
    );
    await expect(container).toHaveNoAxeViolations();
  });
});
