/**
 * Textos que los componentes muestran o anuncian por sí mismos. Cada clave es
 * `<componente>.<texto>`; las que reciben datos son funciones.
 *
 * Para agregar un texto: súmalo a `Messages` y a cada diccionario (el tipo
 * obliga a completarlos todos).
 */
export interface Messages {
  /** Botón para cerrar un `Alert`. */
  'alert.dismiss': string;
  /** Prefijo oculto de `Alert` según su tono, para no depender del color ni del ícono. */
  'alert.tone': (tone: 'neutral' | 'primary' | 'success' | 'warning' | 'danger') => string;
  /** Etiqueta del campo opcional en `Label` / `Field`. */
  'label.optional': string;
  /** Aviso de `Link` con `external`, después del texto del enlace. */
  'link.newTab': string;
  /** Botón para mostrar la contraseña en `PasswordInput`. */
  'passwordInput.show': string;
  /** Botón para limpiar en `SearchInput`. */
  'searchInput.clear': string;
  /** Nombre de `Spinner` y texto de `Button` mientras carga. */
  'spinner.label': string;
  /** Botón para quitar un `Tag`, con su texto. */
  'tag.remove': (text: string) => string;
  /** Botón para quitar un `Tag` cuyo contenido no es texto (sin `removeLabel`). */
  'tag.removeUnnamed': string;
}

const es: Messages = {
  'alert.dismiss': 'Cerrar aviso',
  'alert.tone': (tone) =>
    ({ neutral: 'Nota', primary: 'Información', success: 'Listo', warning: 'Advertencia', danger: 'Error' })[tone],
  'label.optional': '(opcional)',
  'link.newTab': '(se abre en una pestaña nueva)',
  'passwordInput.show': 'Mostrar contraseña',
  'searchInput.clear': 'Limpiar búsqueda',
  'spinner.label': 'Cargando',
  'tag.remove': (text) => `Quitar ${text}`,
  'tag.removeUnnamed': 'Quitar',
};

const en: Messages = {
  'alert.dismiss': 'Dismiss',
  'alert.tone': (tone) =>
    ({ neutral: 'Note', primary: 'Info', success: 'Success', warning: 'Warning', danger: 'Error' })[tone],
  'label.optional': '(optional)',
  'link.newTab': '(opens in a new tab)',
  'passwordInput.show': 'Show password',
  'searchInput.clear': 'Clear search',
  'spinner.label': 'Loading',
  'tag.remove': (text) => `Remove ${text}`,
  'tag.removeUnnamed': 'Remove',
};

/** Idiomas con textos incluidos en el kit. Para otros, pasa `messages`. */
export const builtInMessages: Readonly<Record<string, Messages>> = { es, en };

/** Idioma por defecto: el del kit. */
export const defaultLocale = 'es';

/**
 * Textos incluidos para un idioma: primero la etiqueta exacta (`es-CR`), luego
 * el idioma (`es`) y si no hay, español.
 */
export function messagesFor(locale: string): Messages {
  const language = locale.toLowerCase().split('-')[0] ?? '';
  return builtInMessages[locale] ?? builtInMessages[language] ?? es;
}

/** Idiomas que se escriben de derecha a izquierda. */
const rtlLanguages = new Set(['ar', 'arc', 'ckb', 'dv', 'fa', 'he', 'ps', 'sd', 'ug', 'ur', 'yi']);

/** Dirección del texto de un idioma (`ar-EG` → `rtl`). */
export function directionFor(locale: string): 'ltr' | 'rtl' {
  const language = locale.toLowerCase().split('-')[0] ?? '';
  return rtlLanguages.has(language) ? 'rtl' : 'ltr';
}
