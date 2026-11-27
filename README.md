# MyUiLibrary

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Tu nuevo y reluciente [workspace de Nx](https://nx.dev) está casi listo ✨.

[Conoce más sobre esta configuración de workspace y sus capacidades](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) o ejecuta `npx nx graph` para explorar visualmente lo que se creó. ¡Ahora vamos a ponerte al día!

## Visión y objetivo del UI Kit

Este proyecto tiene como objetivo construir una **librería de controles reutilizables para aplicaciones web en React**, que sirva como base sólida para:

- Acelerar el desarrollo de proyectos web internos y externos, ofreciendo componentes consistentes, accesibles y fáciles de integrar.
- Funcionar como "núcleo" a partir del cual se puedan crear otras librerías y variantes derivadas (por ejemplo, kits específicos por marca, producto o cliente) sin perder coherencia en diseño y comportamiento.
- Explorar hasta dónde se puede llegar combinando **experiencia previa**, **agentes de IA** y **buenas prácticas de ingeniería** para construir un diseño de sistema profesional, mantenible y orientado a producto.

A medida que el proyecto evolucione, este README se actualizará para reflejar el estado actual del UI Kit (componentes disponibles, roadmap y guías de contribución).

## Roadmap inicial

1. **Fase 1 – Fundamentos del sistema de diseño**  
   Definir la estructura del monorepo, los design tokens, el modelo de theming y las pautas de estilos, accesibilidad y seguridad que regirán todos los componentes.

2. **Fase 2 – MVP de componentes**  
   Construir un set mínimo de componentes esenciales (botones, inputs, selects, checkboxes, radios, switches, alerts, modals, tooltips, tabs, accordions), cada uno con estilos, historias de Storybook, tests y documentación básica.

3. **Fase 3 – Calidad y automatización**  
   Consolidar pruebas unitarias y de integración, cobertura mínima, pruebas visuales con Storybook/E2E, linting estricto y CI para validar cada cambio.

4. **Fase 4 – Empaquetado y publicación**  
   Ajustar el build para distribución como paquete npm (ESM/CJS + tipos), definir la estrategia de versionado (semver, releases 0.x) y establecer un flujo claro de publicación.

5. **Fase 5 – Expansión y proyectos derivados**  
   Ampliar el catálogo de componentes según necesidades reales, crear temas de marca y proyectos de ejemplo, y usar la librería como base para iniciativas de emprendimiento y productos derivados.

## Termina la configuración de CI

[Haz clic aquí para terminar de configurar tu workspace](https://cloud.nx.app/connect/GuoWvlfaWZ)

## Ejecutar tareas

Para ejecutar el servidor de desarrollo de tu aplicación, usa:

```sh
npx nx serve react-ui-kit
```

Para crear un bundle de producción:

```sh
npx nx build react-ui-kit
```

Para ver todos los targets disponibles de un proyecto, ejecuta:

```sh
npx nx show project react-ui-kit
```

Estos targets se [infieren automáticamente](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) o se definen en los archivos `project.json` o `package.json`.

[Más información sobre la ejecución de tareas en la documentación »](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Agregar nuevos proyectos

Aunque puedes agregar proyectos nuevos a tu workspace manualmente, probablemente quieras aprovechar los [plugins de Nx](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) y su funcionalidad de [generación de código](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects).

Usa el generador del plugin para crear nuevos proyectos.

Para generar una nueva aplicación, usa:

```sh
npx nx g @nx/react:app demo
```

Para generar una nueva librería, usa:

```sh
npx nx g @nx/react:lib mylib
```

Puedes usar `npx nx list` para obtener una lista de plugins instalados. Luego, ejecuta `npx nx list <plugin-name>` para conocer capacidades más específicas de cada plugin. Como alternativa, [instala Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) para explorar plugins y generadores desde tu IDE.

[Más información sobre los plugins de Nx »](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Explora el registro de plugins »](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Más información sobre Nx en CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Instalar Nx Console

Nx Console es una extensión de editor que mejora tu experiencia de desarrollo. Te permite ejecutar tareas, generar código y mejora el autocompletado en tu IDE. Está disponible para VSCode e IntelliJ.

[Instalar Nx Console »](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Enlaces útiles

Más información:

- [Más información sobre esta configuración de workspace](https://nx.dev/getting-started/tutorials/react-monorepo-tutorial?utm_source=nx_project&amp;utm_medium=readme&amp;utm_campaign=nx_projects)
- [Más información sobre Nx en CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Publicar paquetes con Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [¿Qué son los plugins de Nx?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

Y únete a la comunidad de Nx:
- [Discord](https://go.nx.dev/community)
- [Síguenos en X](https://twitter.com/nxdevtools) o [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Nuestro canal de Youtube](https://www.youtube.com/@nxdevtools)
- [Nuestro blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Estilos y theming

Este UI Kit usa **Tailwind CSS v4** sobre **design tokens en variables CSS**.

### Cómo están implementados los estilos

- Los componentes usan solo **tokens semánticos** (`--ui-color-surface`, `--ui-color-fg`, `--ui-color-border`, `--ui-color-focus`, `--ui-color-danger`, …), nunca la escala numérica directa. Cada tema decide qué color cumple cada rol.
- `@my-ui/core/styles/theme.css` expone esos tokens a Tailwind con el prefijo `ui-` (`bg-ui-surface`, `text-ui-fg`, `border-ui-danger`…), así no chocan con el tema de tu app.
- Los contrastes de los tokens cumplen WCAG AA en los tres temas: texto ≥ 4.5:1, bordes de control y foco ≥ 3:1.

### Configuración en la app que consume el kit

```css
/* tu hoja principal de Tailwind */
@import "tailwindcss";
@import "@my-ui/core/styles/tokens.css";
@import "@my-ui/core/styles/theme.css";

/* para que Tailwind genere las clases que usan los componentes */
@source "../node_modules/@my-ui";
```

### Temas (light, dark, etc.)

El UI Kit soporta múltiples temas mediante **variables CSS** controladas por el atributo `data-theme`.

- Por defecto, el tema se selecciona aplicando `data-theme` en un nodo alto del árbol:
  - Por ejemplo, en `<html>` o `<body>`.
- Los temas disponibles (por ejemplo `light`, `dark`) ajustan los valores de las variables CSS que usan los componentes.

Ejemplo básico de marcado:

```tsx
// index.html o layout principal
<html data-theme="light">
  <body>
    <div id="root"></div>
  </body>
</html>
```

Puedes gestionar el tema manualmente modificando `data-theme`, o usar los helpers expuestos por `@my-ui/core`:

```tsx
// En tu aplicación React
import { applyTheme, toggleTheme } from '@my-ui/core';

// Por ejemplo, al iniciar la app ('light' | 'dark' | 'high-contrast')
applyTheme('light');

function ThemeToggleButton() {
  const handleClick = () => {
    toggleTheme(); // alterna entre light y dark
  };

  return <button onClick={handleClick}>Cambiar tema</button>;
}
```

Los componentes del UI Kit automáticamente reflejarán el tema activo, ya que todos sus estilos dependen de las variables CSS definidas para cada tema.

Si necesitas personalizar la apariencia (por ejemplo, cambiar el color primario o los radios), puedes sobrescribir las variables CSS en tu propia hoja de estilos, manteniendo la compatibilidad con los componentes del kit.

## Accesibilidad

Este UI Kit está diseñado con **accesibilidad integrada**. Los componentes siguen una serie de buenas prácticas para facilitar su uso con lectores de pantalla, teclado y distintas condiciones visuales.

### Qué garantizan los componentes

- **Navegación por teclado**:
  - Los elementos interactivos (botones, toggles, enlaces, etc.) son accesibles con `Tab` / `Shift+Tab`.
  - Los componentes se pueden activar con las teclas esperadas (`Enter`, `Space`, flechas, `Esc`, según el tipo de componente).
- **Foco visible**:
  - Todos los componentes interactivos muestran un indicador de foco claro cuando se navega con teclado.
- **HTML semántico**:
  - Se usan elementos nativos apropiados (`button`, `a`, `label`, `input`, etc.) siempre que es posible.
- **Uso de ARIA cuando es necesario**:
  - Estados como expandido, seleccionado, presionado o inválido se comunican mediante atributos ARIA (`aria-expanded`, `aria-selected`, `aria-pressed`, `aria-invalid`, etc.) además de la representación visual.
- **Gestión de foco en componentes complejos**:
  - Diálogos, menús, accordions y otros componentes avanzados manejan el foco y el cierre con teclado según patrones recomendados (por ejemplo, cerrar con `Esc` y devolver el foco al disparador).

### Responsabilidades de la aplicación que consume el kit

Aunque el kit implementa patrones de accesibilidad por defecto, hay aspectos que dependen de la aplicación:

- **Etiquetas y textos**:
  - Debes proporcionar textos claros y descriptivos en `label`, `aria-label` o el contenido de los componentes.
- **Mensajes de error y ayuda**:
  - Si tu lógica de negocio muestra errores o mensajes de ayuda, asegúrate de pasarlos a las props correspondientes para que se enlacen mediante `aria-describedby` cuando aplique.
- **Theming y contraste**:
  - El kit expone tokens de color y estilos pensados para cumplir contraste mínimo, pero si personalizas temas o tokens, verifica que el contraste siga siendo suficiente para texto y controles interactivos.
- **Flujos de navegación complejos**:
  - En flujos avanzados de la aplicación (por ejemplo, wizards, múltiples diálogos encadenados, etc.), revisa que la gestión del foco y la estructura de la página sigan siendo claras para lectores de pantalla.

En resumen, los componentes vienen con **patrones de accesibilidad aplicados por defecto**, pero la app consumidora sigue siendo responsable de:
- Proporcionar textos significativos y mensajes de error/ayuda.
- Mantener temas y configuraciones visuales con buen contraste.
- Diseñar flujos de navegación accesibles a nivel de página.

## Componentes y estructura del paquete

| Paquete | Contenido |
| --- | --- |
| `@my-ui/core` | Tokens (`styles/tokens.css`, `styles/theme.css`), temas, `cn`, clases de foco, tipos comunes |
| `@my-ui/icons` | `createIcon` y el set de íconos (`IconSearch`, `IconCheck`, …) generado desde [Lucide](https://lucide.dev) (ISC) |
| `@my-ui/components` | Controles: `Label`, `HelpText`, `ErrorMessage`, `Field`, `Input`, `Textarea`, `PasswordInput`, `SearchInput`, `Tag`, `Badge`, `VisuallyHidden` |

Cada componente tiene implementación (`*.tsx`), pruebas con chequeo de accesibilidad axe (`*.spec.tsx`), historias y una página de documentación (`*.stories.tsx` y `*.mdx` en `apps/storybook/src/stories`).

## Documentación

- **Storybook** es la documentación de uso: fundamentos (tokens, temas, foco, íconos), guías (accesibilidad, formularios, seguridad) y una página por componente con ejemplos, props y "hacer / evitar". Se publica en GitHub Pages en cada merge a `main`: https://frantsiles.github.io/react-ui-kit/
  - En local: `pnpm storybook`
- **Decisiones de arquitectura** en [`docs/adr`](docs/adr/README.md).
- **Hoja de ruta** en [`docs/ROADMAP.md`](docs/ROADMAP.md): fases, dependencias, estado de cada componente y definición de terminado.
- **Cómo contribuir** en [`CONTRIBUTING.md`](CONTRIBUTING.md): flujo de trabajo, convenciones de API, estilos, accesibilidad, tests y documentación. Para asistentes de IA, el resumen está en [`AGENTS.md`](AGENTS.md).

```tsx
import { Field, Input, PasswordInput, Tag } from '@my-ui/components';
import { IconMail } from '@my-ui/icons';

<Field label="Correo electrónico" required error={errors.email}>
  <Input type="email" autoComplete="email" startIcon={<IconMail />} />
</Field>
```

`Field` conecta solo la etiqueta, el texto de ayuda y el error con el control (`htmlFor`, `aria-describedby`, `aria-invalid`, `required`).

### Íconos

Los íconos son decorativos por defecto (`aria-hidden`). Si un ícono transmite información por sí solo, pásale `label`. Para sumar íconos al set, agrégalos a `packages/icons/scripts/generate-icons.mjs` y corre `pnpm --filter @my-ui/icons generate`.
