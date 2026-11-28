import { inject } from 'vitest';

/*
 * Solo para los tests de historias: cada proyecto de Vitest (uno por tema, ver
 * vite.config.ts) provee su tema y el decorador de preview.tsx lo aplica.
 */
globalThis.__UI_TEST_THEME__ = inject('theme');
