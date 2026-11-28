# Cómo contribuir

Guía para construir componentes del kit de forma consistente. Si algo de esta guía no encaja con lo que necesitas, propón el cambio en un PR que edite este archivo: la guía también evoluciona, pero de forma explícita.

Lecturas relacionadas:

- [Hoja de ruta](docs/ROADMAP.md): qué construir y en qué orden.
- [Decisiones de arquitectura](docs/adr/README.md): por qué el kit es como es.
- [AGENTS.md](AGENTS.md): versión resumida de esta guía para asistentes de IA.

## Puesta en marcha

Requisitos: Node 24 y pnpm 9.8.0 (con Corepack: `corepack pnpm@9.8.0 …`).

```bash
pnpm install
pnpm storybook              # Storybook en http://localhost:6006
pnpm test                   # tests de todos los proyectos
pnpm lint
pnpm typecheck
```

Los tests en modo navegador usan el Chromium de Playwright: `pnpm exec playwright install chromium`.

## Flujo de trabajo

1. **Elige la tarea de la [hoja de ruta](docs/ROADMAP.md).** Respeta el orden de las fases: un componente solo puede usar lo que ya existe en fases anteriores. Si necesitas algo de una fase posterior, eso es una señal para conversarlo antes de escribir código.
2. **Crea una rama** desde `main`: `feat/…`, `fix/…`, `docs/…` o `chore/…`.
3. **Marca la tarea como 🚧** en `docs/ROADMAP.md` dentro del mismo PR.
4. **Abre un PR contra `main`.** `main` está protegida: solo entra por PR, con el CI en verde y la rama al día.
5. **Al cumplir la [definición de terminado](#definición-de-terminado)**, la tarea pasa a ✅ en la hoja de ruta.
6. **Decisiones de arquitectura** (una dependencia nueva, un patrón nuevo, cambiar una regla de esta guía) llevan un ADR en `docs/adr`.

### Commits

[Conventional Commits](https://www.conventionalcommits.org/es/) en español, en modo imperativo:

```
feat(components): agrega Checkbox con estado indeterminado
fix(icons): corrige el espejo en RTL de IconChevronLeft
docs(adr): 0006 tokens de tipografía
chore: actualiza dependencias menores
```

### Dependencias

- Cada dependencia nueva se justifica en el PR (y con un ADR si es estructural, como React Aria).
- No agregues versiones publicadas hace menos de 14 días: es la protección más simple contra paquetes comprometidos en la cadena de suministro.
- Las dependencias de runtime van en el `package.json` del paquete que las usa; las de desarrollo, en la raíz.

## Estructura

```
packages/
  core/        tokens (styles/), temas, cn, clases de foco, tipos comunes
  icons/       createIcon + íconos generados (scripts/generate-icons.mjs)
  components/  componentes (src/lib/<capa>/<nombre>.tsx + <nombre>.spec.tsx)
apps/
  storybook/   historias y documentación (src/stories, src/docs)
docs/
  ROADMAP.md   hoja de ruta
  adr/         decisiones de arquitectura
```

Por cada componente `Ejemplo`:

| Archivo | Contenido |
| --- | --- |
| `packages/components/src/lib/<capa>/ejemplo.tsx` | Implementación |
| `packages/components/src/lib/<capa>/ejemplo.spec.tsx` | Tests |
| `packages/components/src/index.ts` | `export { Ejemplo, type EjemploProps } from './lib/<capa>/ejemplo';` (orden alfabético) |
| `apps/storybook/src/stories/ejemplo.stories.tsx` | Historias |
| `apps/storybook/src/stories/ejemplo.mdx` | Página de documentación |

Lo que no es público vive en `src/lib/internal/` y no se exporta desde `index.ts`.

### Capas

Las dependencias van en una sola dirección, y el lint lo verifica ([ADR 0007](docs/adr/0007-capas.md)):

- **Entre paquetes:** `core` ← `icons` ← `components` ← apps, con etiquetas `layer:*` de Nx en cada `package.json`. Un proyecto nuevo necesita su etiqueta.
- **Dentro de `components`:** una carpeta por fase de la hoja de ruta (`fundamentos`, `acciones`, `layout`, `overlays`, `colecciones`, `navegacion`, `shell`, `datos`). Un componente va en la carpeta de su fase y solo importa de su capa, de capas inferiores y de `internal/`. `internal/` no importa de ninguna capa.
- Dentro del paquete, los imports son relativos; nunca `@my-ui/components`.

Si un componente necesita algo de una capa superior, no lo resuelvas con un import: suele significar que la pieza compartida tiene que bajar de capa. Conversémoslo en el PR.

## Convenciones de API

El objetivo: quien aprende un componente ya sabe usar los demás.

### Nombres

- **Componentes** en PascalCase; **archivos** en kebab-case (`password-input.tsx`).
- **Props** exportadas como `<Componente>Props`.
- **Partes de un componente compuesto** como exports con prefijo, no como propiedades: `SelectItem`, `SelectSection`, no `Select.Item`. Así el bundler descarta las partes que no se usan.

### Props comunes (mismo nombre y mismos valores en todo el kit)

| Prop | Valores | Uso |
| --- | --- | --- |
| `size` | `'sm' \| 'md' \| 'lg'` (`ControlSize`) | Tamaño. `md` por defecto |
| `tone` | `'neutral' \| 'primary' \| 'success' \| 'warning' \| 'danger'` (`Tone`) | Significado semántico del color |
| `variant` | Depende del componente (p. ej. `'solid' \| 'outline' \| 'ghost'`) | Estilo visual, **sin** significado |
| `disabled`, `required`, `readOnly` | `boolean` | Mismos nombres que en HTML |
| `invalid` | `boolean` | Estado de error. Dentro de un `Field` lo pone `error` |
| `className` | `string` | Clases para el **elemento raíz visible** |
| `<parte>ClassName` | `string` | Clases para una parte interna (p. ej. `inputClassName`) |

No uses `isDisabled`, `color`, `kind`, `type` (para variantes) ni sinónimos de los anteriores. Los componentes que envuelven React Aria **traducen** internamente (`disabled` → `isDisabled`): la API pública siempre usa los nombres de esta tabla.

### Valores y eventos

- **Controles nativos** (`Input`, `Textarea`…): mismas props que el elemento HTML. `onChange` recibe el evento, como en React.
- **Controles de valor** (`Select`, `Combobox`, `Checkbox`…): `value`, `defaultValue` y `onChange(value)`, que recibe **el valor**, no un evento.
- Todo control funciona **controlado** (`value`) y **no controlado** (`defaultValue`).
- Los controles de formulario aceptan `name` y se envían con `FormData`, también con las Actions de React 19.

### Tipos de las props

- Las props opcionales declaran `| undefined` (`size?: ControlSize | undefined`). Así una app con `exactOptionalPropertyTypes` (como este repo) puede pasar un valor que quizás no exista: `<Field size={props.size}>`.

### `ref` y props restantes

- `ref` es una prop normal (React 19, sin `forwardRef`) y apunta al **elemento interactivo principal**: el `<input>`, no su contenedor. Documéntalo si no es obvio.
- Las props que el componente no consume se pasan a ese mismo elemento (`...props`), para que `aria-*`, `data-*` y los eventos funcionen.

### Composición antes que configuración

- Prefiere piezas que se combinan (`<Field><Input /></Field>`) a un componente con muchas props (`<Input label error description …/>`).
- Si un componente pasa de ~10 props propias, es una señal para partirlo.
- Los slots de contenido aceptan `ReactNode` (`startIcon`, `endAdornment`), no strings con nombres de íconos.

### Textos internos

- Los textos que el componente muestra o anuncia por sí mismo ("Mostrar contraseña", "Quitar…") **siempre** se pueden cambiar por prop (`toggleLabel`, `clearLabel`, `removeLabel`).
- El valor por defecto sale de `useMessages()` (`LocaleProvider`), nunca de un string fijo en el componente: `toggleLabel ?? messages['passwordInput.show']`.
- Un texto nuevo se agrega a la interfaz `Messages` y a **todos** los diccionarios de `messages.ts` (`es`, `en`); el tipo no compila si falta uno. Clave: `<componente>.<texto>`; si recibe datos, es una función (`'tag.remove': (text) => …`).
- Usa propiedades lógicas (`ps-`, `me-`, `start-`, `text-start`), nunca `left`/`right`, para que el componente se espeje en RTL.

### Estado para estilos y automatización

- Si un estado no tiene un atributo HTML o ARIA que lo exprese, exponlo como `data-*` en el elemento raíz: `data-state="open"`, `data-invalid`, `data-disabled`. Sirve para estilar (`data-[state=open]:…`) y para que Playwright o Cypress lo consulten.
- Los tests y la automatización buscan **por rol y nombre accesible**, como un lector de pantalla. `data-testid` solo como último recurso.

## Estilos

- **Tailwind v4 con tokens semánticos** (prefijo `ui-`): `bg-ui-surface`, `text-ui-fg`, `border-ui-danger`. Nunca colores de la paleta (`bg-blue-600`) ni hexadecimales.
- **Combina clases con `cn()`** de `@my-ui/core`, siempre con el `className` del usuario al final para que pueda sobrescribir.
- **Foco:** usa `focusRing` (o `fieldFocusRing` en contenedores de inputs) de `@my-ui/core`. Nunca `outline-none` sin reemplazo, ni foco hecho con `box-shadow`.
- **Tipografía** con estilos por rol (`text-ui-body`, `text-ui-label`, `text-ui-heading-md`…), no con `text-sm` o `font-medium` sueltos. Pesos con `font-ui-*`.
- **Tamaños de control** con `min-h-ui-control-{sm,md,lg}` (responden a la densidad); texto de 16 px en móvil (`text-ui-body ui-sm:text-ui-body-sm`) para que iOS no haga zoom.
- **Elevación** con `shadow-ui-{raised,overlay,modal}` + `bg-ui-surface-raised` + borde (en alto contraste no hay sombras). **Capas** con `z-(--ui-z-…)`, nunca números sueltos.
- **Responsivo:** los controles ocupan el ancho de su contenedor (`w-full`); el layout lo decide quien los usa. Breakpoints con prefijo `ui-` (`ui-sm:`), nunca `sm:`; para bloques de contenido, container queries (`@ui-md:`).
- **Movimiento:** `duration-(--ui-duration-{fast,normal,slow})` y `ease-ui-*`, que ya respetan `prefers-reduced-motion`. Nunca milisegundos fijos.
- **El color nunca va solo:** estado = color + ícono o texto.

## Accesibilidad

- **Elementos nativos primero** (`<button>`, `<input>`, `<label>`). Para patrones complejos, React Aria ([ADR 0005](docs/adr/0005-react-aria-como-libreria-headless.md)): **nunca se reexporta**, siempre se envuelve con la API del kit.
- **Sigue el patrón de la [ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/)** que corresponda y cítalo en la documentación del componente.
- **Íconos:** decorativos por defecto; `label` solo si el ícono transmite información por sí solo. Un botón de solo ícono lleva `aria-label` en el botón.
- **Áreas táctiles** de al menos 24 × 24 px (WCAG 2.5.8).
- **Nombres accesibles:** si un componente no puede tener nombre sin una prop (p. ej. `removeLabel` con contenido no textual), avisa en desarrollo con `devWarning`.
- **Navegación del sitio ≠ menú de acciones:** `role="menu"` es solo para menús de acciones.

## Tests

Con Vitest y Testing Library. Corren en jsdom y en Chromium real (modo navegador).

Cada componente cubre como mínimo:

1. **Render y semántica:** rol y nombre accesible correctos (`getByRole('button', { name: … })`).
2. **Teclado:** todas las interacciones del patrón APG (`userEvent.keyboard`, `userEvent.tab`).
3. **Estados:** disabled, invalid, controlado y no controlado.
4. **Integración con `Field`** si es un control de formulario.
5. **Accesibilidad automática:** `await expect(container).toHaveNoAxeViolations()`.

Usa `userEvent` (no `fireEvent`), salvo para eventos que el usuario no puede producir.

### Historias como tests

Cada historia de Storybook también es un test (`@storybook/addon-vitest`): se renderiza en Chromium en **los tres temas** (claro, oscuro y alto contraste), ejecuta su función `play` si la tiene y pasa **axe** con `a11y.test: 'error'`. En el navegador real axe sí mide el contraste, cosa que jsdom no puede.

- Una historia con violaciones de accesibilidad hace fallar el CI. Si una regla no aplica de verdad, desactívala solo en esa historia (`parameters.a11y.config.rules`) y explica por qué en un comentario.
- Las historias de algo interactivo llevan `play` con la interacción principal (`storybook/test`: `userEvent`, `expect`, `within`).

```bash
pnpm exec nx run @my-ui-library/storybook:test   # solo las historias
```

### Regresión visual

En el CI, cada historia también se **captura en los tres temas** y se compara con su referencia en `apps/storybook/src/stories/__screenshots__` ([ADR 0006](docs/adr/0006-regresion-visual.md)). En local no se compara, porque las fuentes se renderizan distinto en cada sistema.

- **Si cambiaste algo visual a propósito** (o agregaste una historia): pon la etiqueta `actualizar-capturas` en el PR. El workflow regenera las capturas en el entorno del CI y las commitea en tu rama. GitHub deja el CI de ese commit esperando aprobación: apruébalo en el PR (*Approve workflows to run*) o sube cualquier commit tuyo. Revisa las imágenes en *Files changed* antes de mergear.
- **Si falla sin que lo esperaras:** descarga el artefacto `regresion-visual` del CI, que trae la captura actual y la diferencia.
- **No generes las referencias en tu máquina**, salvo para probar (`VISUAL=1`): no coincidirían con el CI.

## Documentación

Cada componente tiene una página MDX adjunta a sus historias (`<Meta of={…Stories} />`) con estas secciones:

1. Qué es y cuándo usarlo (y cuándo usar otro componente).
2. Ejemplo principal (`<Primary />`) y props (`<Controls />`).
3. Reglas de uso con al menos un bloque **hacer / evitar** (`DoDont`).
4. Accesibilidad: patrón APG, teclado y qué le toca a la app.
5. Todas las historias (`<Stories />`).

Las historias usan la API pública (`@my-ui/components`), no rutas internas.

## Definición de terminado

Un PR que agrega o cambia un componente debe cumplir la [definición de terminado de la hoja de ruta](docs/ROADMAP.md#definición-de-terminado). La plantilla de PR la trae como checklist.
