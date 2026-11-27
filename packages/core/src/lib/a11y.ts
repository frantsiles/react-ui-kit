/**
 * Clases compartidas de accesibilidad (Tailwind v4).
 *
 * Usamos `outline` y no `box-shadow` para el foco: en modo de colores forzados
 * (alto contraste de Windows) el navegador elimina las sombras pero respeta el
 * outline, así el foco nunca desaparece.
 */

/** Anillo de foco para elementos que reciben el foco directamente (botones, tags). */
export const focusRing =
  'outline-hidden focus-visible:outline-solid focus-visible:outline-[length:var(--ui-focus-ring-width)] focus-visible:outline-offset-[var(--ui-focus-ring-offset)] focus-visible:outline-ui-focus';

/**
 * Anillo de foco para el contenedor que envuelve un <input> (el "borde" visible
 * del Input). Solo reacciona al foco del <input>, no al de botones internos
 * (mostrar contraseña, limpiar), que tienen su propio anillo.
 */
export const fieldFocusRing =
  'has-[input:focus-visible]:outline-solid has-[input:focus-visible]:outline-[length:var(--ui-focus-ring-width)] has-[input:focus-visible]:outline-offset-[var(--ui-focus-ring-offset)] has-[input:focus-visible]:outline-ui-focus';

/** Oculta visualmente sin ocultar a lectores de pantalla. */
export const visuallyHidden = 'sr-only';
