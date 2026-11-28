import { useId, useState } from 'react';
import { IconEye, IconEyeOff } from '@my-ui/icons';
import { useFieldControl } from './field';
import { Input, type InputProps } from './input';
import { InlineIconButton } from '../internal/icon-button';
import { useMessages } from './locale-provider';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'endAdornment'> {
  /** Nombre accesible del botón para mostrar/ocultar. Por defecto el del `LocaleProvider` ("Mostrar contraseña"). */
  toggleLabel?: string | undefined;
}

/**
 * Campo de contraseña con botón para mostrarla.
 *
 * Seguridad y usabilidad:
 * - Permite pegar: bloquearlo rompe los gestores de contraseñas.
 * - autoComplete "current-password" por defecto; usa "new-password" en registro
 *   o cambio de contraseña para que el gestor proponga una segura.
 * - Sin corrector ni mayúsculas automáticas (evita que el teclado guarde la contraseña).
 * - El botón usa aria-pressed: el lector anuncia "Mostrar contraseña, botón, presionado".
 */
export function PasswordInput({
  toggleLabel,
  autoComplete = 'current-password',
  ...props
}: PasswordInputProps) {
  const messages = useMessages();
  const [visible, setVisible] = useState(false);
  const fallbackId = useId();
  const { id: fieldId, disabled } = useFieldControl(props);
  const id = fieldId ?? `password-${fallbackId}`;

  return (
    <Input
      {...props}
      id={id}
      type={visible ? 'text' : 'password'}
      autoComplete={autoComplete}
      spellCheck={false}
      autoCapitalize="none"
      autoCorrect="off"
      endAdornment={
        <InlineIconButton
          aria-label={toggleLabel ?? messages['passwordInput.show']}
          aria-pressed={visible}
          aria-controls={id}
          disabled={disabled}
          onClick={() => setVisible((v) => !v)}
          className="-me-1"
        >
          {visible ? <IconEyeOff size="sm" /> : <IconEye size="sm" />}
        </InlineIconButton>
      }
    />
  );
}
