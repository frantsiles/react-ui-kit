export type Theme = 'light' | 'dark' | 'high-contrast';

export interface ThemeConfig {
  theme: Theme;
  cssVariables: Record<string, string>;
}

export const themes: Record<Theme, ThemeConfig> = {
  light: {
    theme: 'light',
    cssVariables: {
      '--color-primary-50': '239 246 255',
      '--color-primary-100': '219 234 254',
      '--color-primary-200': '191 219 254',
      '--color-primary-300': '147 197 253',
      '--color-primary-400': '96 165 250',
      '--color-primary-500': '59 130 246',
      '--color-primary-600': '37 99 235',
      '--color-primary-700': '29 78 216',
      '--color-primary-800': '30 64 175',
      '--color-primary-900': '30 58 138',
    },
  },
  dark: {
    theme: 'dark',
    cssVariables: {
      '--color-primary-50': '30 58 138',
      '--color-primary-100': '30 64 175',
      '--color-primary-200': '29 78 216',
      '--color-primary-300': '37 99 235',
      '--color-primary-400': '59 130 246',
      '--color-primary-500': '96 165 250',
      '--color-primary-600': '147 197 253',
      '--color-primary-700': '191 219 254',
      '--color-primary-800': '219 234 254',
      '--color-primary-900': '239 246 255',
    },
  },
  'high-contrast': {
    theme: 'high-contrast',
    cssVariables: {
      '--color-primary-500': '0 0 0',
      '--color-primary-600': '0 0 0',
      '--color-neutral-50': '255 255 255',
      '--color-neutral-900': '0 0 0',
    },
  },
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  const themeConfig = themes[theme];

  // Remove existing theme attributes
  root.removeAttribute('data-theme');

  // Set new theme attribute
  if (theme !== 'light') {
    root.setAttribute('data-theme', theme);
  }

  // Apply CSS variables
  Object.entries(themeConfig.cssVariables).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

export const getTheme = (): Theme => {
  const root = document.documentElement;
  const themeAttr = root.getAttribute('data-theme');
  return (themeAttr as Theme) || 'light';
};

export const toggleTheme = (): Theme => {
  const currentTheme = getTheme();
  const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(nextTheme);
  return nextTheme;
};
