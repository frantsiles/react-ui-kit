/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import * as path from 'path';

/** Temas en los que corren las historias como tests (ver preview.tsx). */
const themes = ['light', 'dark', 'high-contrast'];

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/storybook',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@my-ui/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@my-ui/components': path.resolve(__dirname, '../../packages/components/src/index.ts'),
      '@my-ui/icons': path.resolve(__dirname, '../../packages/icons/src/index.ts'),
    },
  },
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  /*
   * Cada historia es un test: se renderiza en Chromium real, corre su `play`
   * (si tiene) y pasa axe (parameters.a11y.test = 'error' en preview.tsx), que
   * en el navegador sí mide el contraste. Un proyecto por tema: así el
   * contraste se verifica en claro, oscuro y alto contraste.
   * Va dentro de `projects` para que el plugin no afecte el build de Storybook.
   */
  test: {
    projects: themes.map((theme) => ({
      extends: true,
      plugins: [storybookTest({ configDir: path.join(__dirname, '.storybook') })],
      test: {
        name: `storybook:${theme}`,
        // El tema llega en tiempo de ejecución (inject en .storybook/vitest.setup.ts)
        provide: { theme },
        setupFiles: [path.join(__dirname, '.storybook/vitest.setup.ts')],
        browser: {
          enabled: true,
          headless: true,
          provider: playwright(),
          instances: [{ browser: 'chromium' as const }],
        },
      },
    })),
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
}));
