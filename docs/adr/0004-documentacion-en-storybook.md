# 0004 · Documentación en Storybook; decisiones en el repositorio

- **Estado:** Aceptado
- **Fecha:** 2026-11-27

## Contexto

El kit necesita documentación de uso (cómo y cuándo usar cada componente, accesibilidad, temas) y registro de decisiones técnicas.

## Decisión

- **Storybook** (con páginas MDX) es la documentación de uso: fundamentos, guías y una página por componente, con ejemplos vivos, props generadas desde los tipos y la sección "hacer / evitar".
- Las **decisiones de arquitectura** viven en `docs/adr/` dentro del repositorio, porque se revisan en PRs junto al código. Storybook las enlaza desde *Decisiones de arquitectura*.
- El **README** cubre instalación y estructura del repositorio.
- Storybook se publica en **GitHub Pages** desde el CI en cada merge a `main`.

## Alternativas descartadas

- **Docusaurus o Starlight:** pensados para sitios grandes con blog y versiones. Hoy duplicarían el trabajo y las historias ya existentes.
- **Zeroheight o Supernova:** apuntan a equipos con diseñadores en Figma y son de pago.

## Consecuencias

- Cada componente nuevo lleva `*.stories.tsx` y `*.mdx` en `apps/storybook/src/stories`.
- Si el kit crece mucho, se puede migrar a un sitio dedicado reutilizando las historias.
