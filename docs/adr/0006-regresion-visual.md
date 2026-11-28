# 0006 · Regresión visual con Vitest, capturas en el repositorio

- **Estado:** Aceptado
- **Fecha:** 2026-11-27
- **Relacionado:** se apoya en las historias como tests (Fase 0); [ADR 0004](0004-documentacion-en-storybook.md)

## Contexto

Los tests unitarios y axe detectan errores de comportamiento y de accesibilidad, pero no un cambio visual no buscado. Por ejemplo: un padding que cambia, un token que se pisa o un tema que se rompe en una sola historia. Con tokens compartidos, un cambio en `@my-ui/core` puede tocar todos los componentes a la vez.

Las historias ya corren como tests en Chromium en los tres temas (`apps/storybook/vite.config.ts`). Falta comparar cómo se ven.

## Opciones

| | Chromatic | Playwright aparte | **Vitest `toMatchScreenshot`** |
| --- | --- | --- | --- |
| Dónde corre | Servicio externo | CI propio, contra el Storybook compilado | CI propio, en los tests de historias que ya existen |
| Costo | Gratis hasta 5 000 capturas al mes, luego pago | Gratis | Gratis |
| Cuenta y token | Sí | No | No |
| Revisión de cambios | Interfaz web muy buena | Imágenes en el PR | Imágenes en el PR |
| Infraestructura nueva | Servicio + token | Un runner más, servidor estático | Ninguna |

## Decisión

**Vitest `toMatchScreenshot`** dentro de los tests de historias.

- Después de render, `play` y axe, cada historia se captura en cada tema (`.storybook/vitest.setup.ts`). La captura toma el contenedor `[data-story-root]`, que el decorador agrega solo en los tests.
- Las referencias son PNG en `apps/storybook/src/stories/__screenshots__`, versionadas en el repositorio y revisadas en el PR como cualquier cambio.
- **Las capturas solo se comparan en el CI.** El renderizado de fuentes cambia entre sistemas operativos y versiones de Chromium, así que una referencia generada en otra máquina fallaría. En local se omiten, salvo con `VISUAL=1`.
- **Las referencias se generan en el CI**, con el workflow *Actualizar capturas*: se activa con la etiqueta `actualizar-capturas` en un PR, corre `vitest --update` en el mismo entorno que el CI y commitea el resultado en la rama. GitHub no corre automáticamente el CI sobre un commit del bot: queda esperando que alguien con permisos lo apruebe en el PR.
- Si la comparación falla, el CI sube las capturas actuales y las diferencias como artefacto (`regresion-visual`).
- Una historia que no tiene sentido capturar (p. ej. con contenido aleatorio) se excluye con `parameters: { visual: { disable: true } }`.

## Consecuencias

- **Positivas:**
  - Cada PR muestra si algo cambió visualmente, en los tres temas.
  - No hay servicio externo ni token.
  - Las capturas viven junto al código.
- **Negativas:**
  - **Un cambio visual intencional requiere pasos extra:** poner la etiqueta, aprobar el CI del commit del bot y revisar las imágenes.
  - **Cambios en GitHub Actions:** si cambia la imagen del runner (Ubuntu, fuentes) o la versión de Playwright, puede haber diferencias mínimas que obliguen a regenerar todas las capturas.
  - **Lo que queda fuera de la captura:** solo se captura el contenedor de la historia. Los overlays que se rendericen en un portal (Fase 3) quedarán fuera, y habrá que revisarlo al llegar.
  - **El repositorio crece:** son unas 100 imágenes pequeñas hoy, y crecen con las historias.
- **Cuándo reconsiderar:** si revisar diferencias en el PR se vuelve difícil (muchas historias, varios colaboradores), Chromatic vale lo que cuesta por su interfaz de revisión.
