import { useRef, useState, type FormEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Field, Input, PasswordInput } from '@my-ui/components';
import { IconMail } from '@my-ui/icons';

type Errors = Partial<Record<'email' | 'password', string>>;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const email = String(data.get('email') ?? '');
  const password = String(data.get('password') ?? '');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Ingresa un correo como nombre@dominio.com';
  }
  if (password.length < 12) {
    errors.password = 'Usa al menos 12 caracteres';
  }
  return errors;
}

/**
 * Patrón recomendado de validación:
 * - se valida al enviar y, después, al salir de cada campo (no en cada tecla);
 * - al enviar con errores, el foco va al primer campo inválido;
 * - el error dice cómo corregir.
 * La validación en el cliente es usabilidad, no seguridad: el servidor valida siempre.
 */
function SignUpForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const revalidate = () => {
    if (!submitted || !formRef.current) return;
    setErrors(validate(new FormData(formRef.current)));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(new FormData(event.currentTarget));
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      event.currentTarget.querySelector<HTMLInputElement>(`[name="${firstInvalid}"]`)?.focus();
      setSent(false);
    } else {
      setSent(true);
    }
  };

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="flex max-w-sm flex-col gap-4">
      <Field label="Correo electrónico" required error={errors.email}>
        <Input name="email" type="email" autoComplete="email" startIcon={<IconMail />} onBlur={revalidate} />
      </Field>
      <Field label="Contraseña" required description="Mínimo 12 caracteres" error={errors.password}>
        <PasswordInput name="password" autoComplete="new-password" onBlur={revalidate} />
      </Field>
      <button
        type="submit"
        className="min-h-ui-control-md rounded-md bg-ui-primary px-4 font-medium text-ui-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ui-focus"
      >
        Crear cuenta
      </button>
      <p role="status" className="text-sm text-ui-success">
        {sent ? 'Cuenta creada' : ''}
      </p>
    </form>
  );
}

const meta = {
  title: 'Guías/Formularios',
  component: SignUpForm,
} satisfies Meta<typeof SignUpForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Validacion: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Crear cuenta' }));
    const email = canvas.getByRole('textbox', { name: /Correo electrónico/ });
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
  },
};
