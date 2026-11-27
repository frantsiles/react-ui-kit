# 0002 · Íconos propios generados desde Lucide

- **Estado:** Aceptado
- **Fecha:** 2026-11-27

## Contexto

El kit necesita íconos con un comportamiento accesible uniforme (decorativos por defecto, `label` cuando significan algo), que escalen con el texto y se espejen en RTL. Dibujar un set desde cero no es realista para un equipo chico.

## Decisión

- Componente propio `createIcon` en `@my-ui/icons`, con la API y las reglas de accesibilidad del kit.
- Los trazos salen de **`lucide-static`** (licencia ISC) mediante `scripts/generate-icons.mjs`, que genera `src/generated/icons.ts`. El archivo generado se versiona.
- Solo se incluyen los íconos listados en el script: el set crece de forma deliberada.
- Los SVG se guardan como **datos** y se dibujan con React. Nunca con `dangerouslySetInnerHTML`.
- Si Lucide renombra un ícono, el script permite mantener nuestro nombre (`['circle-alert', 'circle-exclamation-point']`).

## Alternativas descartadas

- **Depender de `lucide-react`:** la API y la accesibilidad quedarían en manos de otra librería, y un renombre suyo rompería a nuestros consumidores.
- **Sprite SVG o fuente de íconos:** peor accesibilidad y no se puede hacer tree-shaking.

## Consecuencias

- `lucide-static` es solo dependencia de desarrollo. El paquete publicado no depende de Lucide.
- Agregar un ícono requiere correr el script y hacer commit del archivo generado.
- Hay que conservar la licencia ISC (`packages/icons/LICENSE-lucide`).
