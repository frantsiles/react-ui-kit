import type { Decorator, Preview } from '@storybook/react-vite';
import { LocaleProvider } from '@my-ui/components';
import '../src/storybook.css';

/** Aplica el tema, la dirección y el idioma elegidos en la barra de herramientas. */
const withTheme: Decorator = (Story, context) => {
  // En los tests de historias, cada proyecto de Vitest fija su tema (vitest.setup.ts)
  const theme = globalThis.__UI_TEST_THEME__ ?? (context.globals['theme'] as string);
  const root = document.documentElement;
  if (theme === 'light') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  root.dir = context.globals['direction'] as string;
  const locale = (context.globals['locale'] as string | undefined) ?? 'es';
  root.lang = locale;
  const story = (
    <LocaleProvider locale={locale}>
      <Story />
    </LocaleProvider>
  );
  // En los tests, un contenedor para la captura de regresión visual
  if (globalThis.__UI_TEST_THEME__) {
    return (
      <div data-story-root className="p-4">
        {story}
      </div>
    );
  }
  return story;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        title: 'Tema',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Oscuro' },
          { value: 'high-contrast', title: 'Alto contraste' },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      description: 'Idioma de los textos internos',
      toolbar: {
        title: 'Idioma',
        icon: 'globe',
        items: [
          { value: 'es', title: 'Español' },
          { value: 'en', title: 'English' },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: 'Dirección del texto',
      toolbar: {
        title: 'Dirección',
        icon: 'transfer',
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light', direction: 'ltr', locale: 'es' },
  parameters: {
    layout: 'padded',
    // 'error' hace fallar el test de la historia si axe encuentra violaciones
    a11y: { test: 'error' },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Introducción',
          'Hoja de ruta',
          'Fundamentos',
          [
            'Colores y tokens',
            'Tipografía',
            'Elevación y capas',
            'Movimiento',
            'Breakpoints y densidad',
            'Temas',
            'Foco y teclado',
            'Iconografía',
          ],
          'Guías',
          ['Accesibilidad', 'Formularios', 'Idioma y RTL', 'Seguridad'],
          'Texto',
          ['Text', 'Heading'],
          'Etiquetas',
          'Inputs',
          ['Field', 'Input', 'PasswordInput', 'SearchInput', 'Textarea'],
          'Acciones',
          ['Button', 'IconButton', 'ButtonGroup', 'Link'],
          'Selección',
          ['Checkbox', 'CheckboxGroup', 'RadioGroup'],
          'Carga',
          ['Spinner', 'Skeleton'],
          'Contenido',
          'Decisiones de arquitectura',
        ],
      },
    },
  },
};

export default preview;
