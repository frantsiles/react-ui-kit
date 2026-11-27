import type { Tone } from './types';

/**
 * Fondo suave + texto del color del tono: el texto siempre cumple 4.5:1 sobre
 * su fondo en los tres temas. El borde (currentColor al 30%) da forma al
 * componente también en modo de colores forzados.
 */
export const toneClasses: Record<Tone, string> = {
  neutral: 'bg-ui-surface-muted text-ui-fg border-ui-border-subtle',
  primary: 'bg-ui-primary-soft text-ui-primary border-current/30',
  success: 'bg-ui-success-soft text-ui-success border-current/30',
  warning: 'bg-ui-warning-soft text-ui-warning border-current/30',
  danger: 'bg-ui-danger-soft text-ui-danger border-current/30',
};
