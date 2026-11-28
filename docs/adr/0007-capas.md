# 0007 · Capas con dirección única, verificadas por el lint

- **Estado:** Aceptado
- **Fecha:** 2026-11-27
- **Relacionado:** principio "Capas con dirección única" de la [hoja de ruta](../ROADMAP.md)

## Contexto

En el kit anterior, los componentes se importaban entre sí en cualquier dirección. Con el tiempo eso produjo ciclos, componentes que no se podían simplificar sin romper otros y un bundle que arrastraba más de lo necesario. Una regla escrita en una guía no alcanza: hace falta que el lint la haga cumplir en cada PR.

Hay dos niveles de dependencias:

1. **Entre paquetes:** `core`, `icons`, `components` y las apps.
2. **Entre componentes**, dentro de `@my-ui/components`. Ahí está el riesgo real: un `Select` que importa un `Dialog`, o un `Input` que importa un `Menu`.

## Decisión

### Entre paquetes: etiquetas de Nx

Cada proyecto lleva una etiqueta `layer:*` en su `package.json` (`nx.tags`). `@nx/enforce-module-boundaries` (en `eslint.config.mjs`) solo permite depender hacia abajo:

| Etiqueta | Proyectos | Puede depender de |
| --- | --- | --- |
| `layer:core` | `@my-ui/core` (y `@my-ui/tokens`, sin uso) | `layer:core` |
| `layer:icons` | `@my-ui/icons` | `layer:core` |
| `layer:components` | `@my-ui/components` | `layer:core`, `layer:icons` |
| `layer:app` | Storybook, playground, e2e, raíz | Todas las anteriores |

Un proyecto nuevo sin etiqueta no puede depender de nada hasta que se la pongan. La misma regla detecta ciclos entre paquetes e imports profundos (`@my-ui/components/src/...`).

### Dentro de components: una carpeta por fase

Nx no ve dentro de un proyecto, y partir el kit en un paquete por fase obligaría a publicar ocho paquetes. En su lugar, cada componente vive en la carpeta de su fase de la hoja de ruta:

```
packages/components/src/lib/
  internal/      utilidades sin dependencias de componentes (no se exportan)
  fundamentos/   Fase 0 y lo hecho: Field, Input, Label, Tag, LocaleProvider…
  acciones/      Fase 1: Button, Checkbox, Switch…
  layout/        Fase 2
  overlays/      Fase 3
  colecciones/   Fase 4
  navegacion/    Fase 5
  shell/         Fase 6
  datos/         Fase 7
```

`no-restricted-imports` y `no-restricted-syntax` (en `packages/components/eslint.config.mjs`) aplican estas reglas:

- **Solo hacia abajo:** un archivo importa de su capa, de capas inferiores y de `internal/`. `overlays/` puede usar `fundamentos/`; `fundamentos/` no puede usar `overlays/`.
- **`internal/` no importa de ninguna capa.**
- **Nada suelto en `src/lib`:** todo archivo va en una capa o en `internal/`.
- **Sin autoimport:** dentro del paquete no se importa `@my-ui/components`; eso crearía ciclos a través del índice.

Las carpetas de fases futuras se crean cuando llega su primer componente.

## Alternativas descartadas

- **Un paquete por fase** (`@my-ui/overlays`…): Nx lo haría cumplir solo, pero multiplica `package.json`, builds y versiones para un kit que se consume como uno.
- **`eslint-plugin-boundaries` o `import/no-restricted-paths`:** hacen lo mismo con más configuración y, en el segundo caso, un resolver de TypeScript. `no-restricted-imports` viene con ESLint y alcanza, porque las capas son carpetas.
- **Solo la guía:** es lo que falló antes.

## Consecuencias

- Un PR que rompa la dirección no pasa el lint; el mensaje dice qué capa y qué hacer.
- **Elegir la capa es parte del diseño del componente.** Si un componente necesita algo de una capa superior, eso se conversa (¿la pieza compartida debería bajar a una capa inferior?) en lugar de resolverse con un import.
- Las rutas de los archivos cambian (`src/lib/fundamentos/input.tsx`); la API pública (`@my-ui/components`) no.
