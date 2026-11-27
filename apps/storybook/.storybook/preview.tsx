import type { Decorator, Preview } from '@storybook/react-vite';
import '../src/storybook.css';

/** Aplica el tema elegido en la barra de herramientas (data-theme en <html>). */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals['theme'] as string;
  const root = document.documentElement;
  if (theme === 'light') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  root.dir = context.globals['direction'] as string;
  return <Story />;
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
  initialGlobals: { theme: 'light', direction: 'ltr' },
  parameters: {
    layout: 'padded',
    // 'error' hace fallar el test de la historia si axe encuentra violaciones
    a11y: { test: 'error' },
    controls: { expanded: true },
  },
};

export default preview;
