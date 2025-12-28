/// <reference types="vitest" />
/// <reference types="@vitest/browser/providers/playwright" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@my-ui/core': path.resolve(__dirname, 'packages/core/src'),
      '@my-ui/components': path.resolve(__dirname, 'packages/components/src'),
      '@my-ui/icons': path.resolve(__dirname, 'packages/icons/src'),
      '@my-ui/tokens': path.resolve(__dirname, 'packages/tokens/src'),
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.stories.*',
        '**/index.ts',
        '**/index.tsx',
        'coverage/',
        '.storybook/',
        'e2e/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: [
      'packages/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'apps/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    exclude: [
      'node_modules/',
      'dist/',
      '.nx/',
      'coverage/',
      '**/*.stories.*',
      'e2e/',
    ],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [
        {
          browser: 'chromium',
        },
      ],
    },
  },
});
