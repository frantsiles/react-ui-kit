import { createContext, use, useMemo, type ReactNode } from 'react';
import { defaultLocale, directionFor, messagesFor, type Messages } from './messages';

export interface LocaleProviderProps {
  /**
   * Idioma en formato BCP 47 (`es`, `es-CR`, `en-US`, `ar`). Si se omite, usa
   * el del proveedor superior (o español).
   */
  locale?: string | undefined;
  /**
   * Textos propios. Reemplazan a los incluidos, uno por uno: sirve para
   * traducir a un idioma que el kit no trae o para cambiar un texto puntual.
   */
  messages?: Partial<Messages> | undefined;
  children?: ReactNode | undefined;
}

interface LocaleContextValue {
  locale: string;
  direction: 'ltr' | 'rtl';
  messages: Messages;
  /** Textos propios acumulados de los proveedores con el mismo idioma. */
  overrides: Partial<Messages>;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: defaultLocale,
  direction: directionFor(defaultLocale),
  messages: messagesFor(defaultLocale),
  overrides: {},
});

/**
 * Define el idioma de los textos internos de los componentes ("Mostrar
 * contraseña", "Quitar…") y la dirección del texto. Va una vez, cerca de la
 * raíz de la app; se puede anidar para una sección en otro idioma.
 *
 * No toca el DOM: pon `lang` y `dir` en `<html>` (o en la sección) con los
 * valores de `useLocale()`, así el lector de pantalla pronuncia bien y el
 * layout se espeja.
 *
 * Una prop del componente (`toggleLabel`, `clearLabel`…) siempre gana sobre
 * el proveedor.
 */
export function LocaleProvider({ locale, messages, children }: LocaleProviderProps) {
  const parent = use(LocaleContext);
  const resolvedLocale = locale ?? parent.locale;

  const value = useMemo<LocaleContextValue>(() => {
    // Los textos propios del proveedor superior solo aplican si el idioma es el mismo
    const inherited = resolvedLocale === parent.locale ? parent.overrides : {};
    const overrides = { ...inherited, ...messages };
    return {
      locale: resolvedLocale,
      direction: directionFor(resolvedLocale),
      messages: { ...messagesFor(resolvedLocale), ...overrides },
      overrides,
    };
  }, [resolvedLocale, messages, parent.locale, parent.overrides]);

  return <LocaleContext value={value}>{children}</LocaleContext>;
}

/** Idioma y dirección actuales (`{ locale: 'es', direction: 'ltr' }`). */
export function useLocale(): { locale: string; direction: 'ltr' | 'rtl' } {
  const { locale, direction } = use(LocaleContext);
  return { locale, direction };
}

/** Textos internos del idioma actual. Para los componentes del kit. */
export function useMessages(): Messages {
  return use(LocaleContext).messages;
}
