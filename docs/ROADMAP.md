# Hoja de ruta

El norte del kit: qué componentes vamos a construir, en qué orden y por qué. El orden sale de las dependencias: **cada fase solo usa lo que construyeron las fases anteriores**.

Este archivo es la fuente única. Storybook lo muestra en la página *Hoja de ruta*. Cada PR que agrega o termina un componente actualiza aquí su estado.

**Estados:** ✅ Hecho · 🚧 En curso · ⏳ Pendiente

## Principios (lecciones aprendidas)

Estas reglas existen porque en kits anteriores el crecimiento sin orden terminó en componentes difíciles de simplificar y optimizar.

| Problema que evitamos | Regla | Cómo se hace cumplir |
| --- | --- | --- |
| Componentes que se importan entre sí en cualquier dirección | **Capas con dirección única**: un componente solo usa capas inferiores | Lint: etiquetas de Nx entre paquetes y una carpeta por fase dentro de components ([ADR 0007](https://github.com/frantsiles/react-ui-kit/blob/main/docs/adr/0007-capas.md)) |
| Componentes "dios" con decenas de props | **Composición sobre configuración**: piezas pequeñas que se combinan (`<Menu><MenuItem /></Menu>`) | Guía de convenciones de API y revisión de PRs |
| Cada overlay con su propio posicionamiento y foco | **Primitivas compartidas primero** (Popover, ListBox, capa que se cierra) | El orden de las fases: no hay Menu sin Popover |
| Props con nombres distintos para lo mismo | **API consistente**: `size`, `tone`, `variant`… iguales en todo el kit | Guía de convenciones y tipos compartidos en `@my-ui/core` |
| Colores sueltos | **Solo tokens semánticos** | Tokens `--ui-*` (ver ADR 0001) |
| "Lo documento después" | **Definición de terminado**: sin docs, tests y accesibilidad no se mergea | Checklist de PR (abajo) |

## Definición de terminado

Un componente está ✅ cuando cumple todo esto:

1. **API** según la guía de convenciones; controlado y no controlado cuando aplica; acepta `ref`.
2. **Accesibilidad:** sigue el patrón de la [ARIA APG](https://www.w3.org/WAI/ARIA/apg/patterns/) citado en su documentación; tests de teclado; axe sin violaciones; revisión manual con lector de pantalla; funciona con colores forzados y movimiento reducido.
3. **Temas:** solo tokens semánticos; revisado en claro, oscuro y alto contraste.
4. **Responsivo:** funciona a 320 px de ancho y con zoom al 200 %; áreas táctiles de al menos 24 × 24 px.
5. **Automatizable:** se puede probar por rol y nombre accesible, y expone su estado en atributos `data-*` (p. ej. `data-state="open"`) para Playwright o Cypress.
6. **Tests:** unitarios, historias con interacción y captura visual.
7. **Documentación:** página MDX con ejemplos, props, cuándo usarlo y "hacer / evitar".
8. **Tamaño:** dentro de su presupuesto de peso en el bundle.

## Fases

Entre paréntesis, el patrón de la ARIA APG que sigue cada componente.

### Fundamentos (hecho)

| Elemento | Estado |
| --- | --- |
| Tokens de color semánticos (claro, oscuro, alto contraste) con contraste verificado | ✅ |
| Temas con `data-theme`, también por sección | ✅ |
| Anillo de foco (`outline`, compatible con colores forzados) | ✅ |
| Iconografía: `createIcon` + set generado desde Lucide | ✅ |
| Etiquetas: `Label`, `HelpText`, `ErrorMessage`, `Tag`, `Badge`, `VisuallyHidden` | ✅ |
| Inputs de texto: `Field`, `Input`, `Textarea`, `PasswordInput`, `SearchInput` | ✅ |
| Documentación en Storybook y publicación en GitHub Pages | ✅ |

### Fase 0 · Cimientos que faltan

Sin componentes visibles: prepara todo lo que las fases siguientes necesitan.

| Tarea | Por qué | Estado |
| --- | --- | --- |
| ADR 0005: librería headless → [React Aria Components](https://github.com/frantsiles/react-ui-kit/blob/main/docs/adr/0005-react-aria-como-libreria-headless.md) | Base de overlays, colecciones y navegación | ✅ |
| Guía de convenciones de API y definición de terminado ([`CONTRIBUTING.md`](https://github.com/frantsiles/react-ui-kit/blob/main/CONTRIBUTING.md), [`AGENTS.md`](https://github.com/frantsiles/react-ui-kit/blob/main/AGENTS.md), plantilla de PR) | Que todo el kit se use igual, también al trabajar con IA | ✅ |
| Tokens de tipografía semántica, elevación, z-index, movimiento, breakpoints y densidad | Los necesitan Text, Card, overlays y layout | ✅ |
| Historias de Storybook como tests en el CI (incluido el chequeo de accesibilidad) | Cada historia corre en Chromium en los tres temas, con su `play` y axe (contraste incluido) | ✅ |
| Regresión visual por historia y tema ([ADR 0006](https://github.com/frantsiles/react-ui-kit/blob/main/docs/adr/0006-regresion-visual.md)) | Detectar cambios visuales no buscados | ✅ |
| Proveedor de idioma (textos internos y RTL): `LocaleProvider` | Traducir "Mostrar contraseña", "Quitar…", etc. sin prop por prop | ✅ |
| Reglas de capas con etiquetas de Nx ([ADR 0007](https://github.com/frantsiles/react-ui-kit/blob/main/docs/adr/0007-capas.md)) | Hacer cumplir la dirección única de dependencias | ✅ |

### Fase 1 · Acciones y selección simple

| Componente | Depende de | Estado |
| --- | --- | --- |
| Button, IconButton, ButtonGroup | Fundamentos, Icon | 🚧 |
| Link | Fundamentos | 🚧 |
| Text, Heading | Tokens de tipografía | 🚧 |
| Spinner, Skeleton, Divider, Avatar (y `loading` en Button) | Fundamentos | 🚧 |
| Checkbox, CheckboxGroup (Checkbox) | Field, Label | 🚧 |
| Radio, RadioGroup (Radio Group) | Field, Label | 🚧 |
| Switch (Switch) | Field, Label | 🚧 |
| NativeSelect | Field | 🚧 |
| Alert / Banner en línea | Icon, Button | 🚧 |

### Fase 2 · Layout: bloques de contenido que se adaptan

Los bloques se adaptan al ancho de **su contenedor** (container queries), no al de la pantalla: el mismo Card funciona en una columna angosta y en una ancha.

| Componente | Para qué | Estado |
| --- | --- | --- |
| Stack, Inline | Espaciado vertical y horizontal consistente, sin márgenes sueltos | 🚧 |
| Grid de layout | Columnas que se reacomodan | 🚧 |
| Container | Ancho máximo y márgenes de página | 🚧 |
| Card / Panel (encabezado, cuerpo, pie) | Bloques de contenido | 🚧 |
| ScrollArea | Zonas con scroll accesibles | 🚧 |

### Fase 3 · Overlays

| Componente | Patrón APG | Depende de | Estado |
| --- | --- | --- | --- |
| Popover (primitiva) | — | Posicionamiento, cierre con Escape o clic afuera | 🚧 |
| Tooltip | Tooltip | Popover | 🚧 |
| Dialog / Modal | Dialog (Modal) | Captura de foco, bloqueo de scroll | 🚧 |
| AlertDialog | Alert Dialog | Dialog, Button | 🚧 |
| Drawer / Sheet | Dialog | Dialog | 🚧 |
| Toast / notificaciones | Live region | Anunciador, Button | 🚧 |

### Fase 4 · Colecciones

| Componente | Patrón APG | Depende de | Estado |
| --- | --- | --- | --- |
| ListBox (primitiva) | Listbox | Modelo de colecciones | 🚧 |
| Select | Select-only combobox | Popover, ListBox, Field | 🚧 |
| Combobox | Combobox | Select | 🚧 |
| Multiselect | Combobox | Combobox, Tag | 🚧 |
| Menu (menú de acciones) | Menu Button | Popover | 🚧 |
| Menú contextual | Menu | Menu + clic derecho o pulsación larga | 🚧 |

### Fase 5 · Navegación

> Los menús de **navegación del sitio** (NavBar, SideNav) no usan `role="menu"`: ese rol es para menús de **acciones** (Menu, menú contextual). Los lectores de pantalla tratan ambos de forma muy distinta, por eso siguen patrones distintos.

| Componente | Patrón APG | Estado |
| --- | --- | --- |
| Tabs | Tabs | ⏳ |
| Accordion / Disclosure | Accordion, Disclosure | ⏳ |
| Breadcrumbs | Breadcrumb | ⏳ |
| Pagination | Landmark `nav` | ⏳ |
| NavBar (menú horizontal) | Disclosure Navigation | ⏳ |
| SideNav (menú lateral con niveles) | Disclosure Navigation | ⏳ |
| Stepper | — | ⏳ |

### Fase 6 · Esqueleto de la app (app shell)

| Componente | Depende de | Estado |
| --- | --- | --- |
| Header | NavBar, Menu, IconButton, Avatar, Drawer (menú en móvil) | ⏳ |
| Footer | Link, Stack, Grid | ⏳ |
| AppShell: Header + SideNav + Main + Footer | Todo lo anterior + enlace "Saltar al contenido" + regiones semánticas (`header`, `nav`, `main`, `footer`) | ⏳ |
| PageHeader (título, breadcrumbs, acciones) | Heading, Breadcrumbs, Button | ⏳ |

En móvil, el SideNav pasa a Drawer y el NavBar se colapsa en un botón de menú.

### Fase 7 · Datos

| Componente | Patrón APG | Estado |
| --- | --- | --- |
| Table (semántica, ordenable) | Table, Sortable Table | ⏳ |
| DataGrid (selección, edición, teclado por celdas, virtualización) | Grid | ⏳ |
| Tree | Tree View | ⏳ |
| Calendar / DatePicker | Date Picker Dialog | ⏳ |
| FileUpload | — | ⏳ |

## Cómo se actualiza

- Al empezar un componente, su estado pasa a 🚧 en el mismo PR que abre el trabajo.
- Al cumplir la definición de terminado, pasa a ✅ en el PR que lo completa.
- Si cambia el orden o aparece un componente nuevo, se edita aquí con una línea en el PR que explique por qué. Si el cambio es una decisión de arquitectura, va además un ADR en `docs/adr`.
