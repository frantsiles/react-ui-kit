import { afterEach, expect, inject } from 'vitest';
import { page } from 'vitest/browser';

/*
 * Solo para los tests de historias (ver vite.config.ts): un proyecto de Vitest
 * por tema.
 */
const theme = inject('theme');

// El decorador de preview.tsx aplica este tema y envuelve la historia en
// [data-story-root] para poder capturarla.
globalThis.__UI_TEST_THEME__ = theme;

/*
 * Animaciones (Spinner, Skeleton) en pausa en su primer cuadro: así la captura
 * es estable y siempre igual.
 */
const pauseAnimations = document.createElement('style');
pauseAnimations.textContent =
  '*, *::before, *::after { animation-play-state: paused !important; animation-delay: 0s !important; }';
document.head.append(pauseAnimations);

interface StoryContext {
  story?: { parameters?: { visual?: { disable?: boolean } } };
}

/*
 * Regresión visual: después de render, play y axe, compara una captura de la
 * historia con la de referencia en __screenshots__. Las capturas dependen de
 * las fuentes y del renderizado del sistema, por eso solo se comparan en el CI
 * (las de referencia se generan ahí, ver docs/adr/0006).
 */
afterEach(async (context) => {
  if (!inject('visual') || context.task.result?.state === 'fail') return;
  const { story } = context as typeof context & StoryContext;
  if (!story || story.parameters?.visual?.disable) return;
  const root = document.querySelector('[data-story-root]');
  if (!root) return;
  await expect
    .element(page.elementLocator(root))
    .toMatchScreenshot(`${context.task.name}-${theme}`);
});
