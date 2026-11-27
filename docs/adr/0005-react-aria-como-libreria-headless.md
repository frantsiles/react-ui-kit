# 0005 · React Aria Components como librería headless

- **Estado:** Aceptado
- **Fecha:** 2026-11-27
- **Relacionado:** completa la decisión pendiente del [ADR 0003](0003-html-nativo-primero.md)

## Contexto

El ADR 0003 dejó los controles básicos sobre HTML nativo y postergó la elección de una librería headless hasta el primer control complejo. La [hoja de ruta](../ROADMAP.md) muestra que, desde la Fase 3, casi todo lo que viene la necesita: overlays (Popover, Dialog, Tooltip), colecciones (Select, Combobox, Menu), navegación (Tabs, Accordion) y datos (Table, DataGrid, Tree, DatePicker).

Reimplementar esos patrones a mano es la principal fuente de bugs de accesibilidad en los design systems: teclado, foco, anuncios de lectores de pantalla, posicionamiento, táctil, RTL e integración con formularios.

## Criterios

1. **Profundidad de accesibilidad:** probada con lectores de pantalla reales, en escritorio y móvil.
2. **Cobertura de la hoja de ruta**, sobre todo de las Fases 4, 5 y 7, las más difíciles.
3. **Internacionalización:** RTL, idiomas, formatos de fecha y número (los necesita DatePicker).
4. **Integración con formularios nativos** (`name`, `FormData`, validación).
5. **Estilos con Tailwind** sin pelear con la librería.
6. **Mantenimiento y licencia.**
7. **Peso en el bundle.**

## Opciones evaluadas

Versiones al 2026-11-27.

### Cobertura de la hoja de ruta

| Necesidad | React Aria Components 1.22 | Base UI 1.9 |
| --- | --- | --- |
| Popover, Tooltip, Dialog, Modal | ✓ | ✓ |
| Drawer | Con Modal | ✓ |
| Toast | En beta (`UNSTABLE_Toast`) | ✓ |
| Select, Combobox, Autocomplete | ✓ | ✓ |
| Menu | ✓ | ✓ |
| Menú contextual | Hay que componerlo (Menu + posición del puntero) | ✓ |
| Tabs, Disclosure / Accordion, Breadcrumbs | ✓ | Tabs y Accordion ✓, Breadcrumbs no |
| Checkbox, Radio, Switch, Form, FieldError | ✓ | ✓ |
| **Table, GridList, Tree** | ✓ | ✗ |
| **Calendar, DatePicker** | ✓ | ✗ |
| DropZone, FileTrigger | ✓ | ✗ |
| Proveedor de idioma (`I18nProvider`) | ✓ (idioma, RTL, formatos) | Solo dirección (`DirectionProvider`) |

### Peso medido

Un Select mínimo, compilado con Vite en las mismas condiciones, comparado con una página que solo usa React:

| | Peso adicional (gzip, aproximado) |
| --- | --- |
| React Aria Components | ~65 KB |
| Base UI | ~51 KB |

Gran parte de ese peso es infraestructura compartida (foco, posicionamiento, colecciones, i18n), que se paga una sola vez y se reparte entre todos los componentes que la usan.

### Otras opciones

- **Radix:** muy usada, pero su mantenimiento se ralentizó desde que su equipo pasó a Base UI.
- **Ariakit:** pequeña y con muy buena accesibilidad, pero sigue en 0.x, con cambios de API posibles.
- **Hacerlo a mano:** descartado por el riesgo de accesibilidad explicado en el contexto.

## Decisión

Usamos **React Aria Components** (Adobe, licencia Apache-2.0) como base de los controles complejos.

### Por qué

- **Cubre las fases más difíciles de la hoja de ruta:** Table, Tree, DatePicker y GridList no existen en Base UI. Son justamente los componentes que más cuesta hacer accesibles.
- **La accesibilidad más probada:** Adobe la prueba con lectores de pantalla reales en móvil y escritorio, y la usa en sus propios productos.
- **Internacionalización completa:** idioma, RTL y formatos de fecha y número, imprescindibles para DatePicker.
- **Formularios nativos:** `name`, `FormData` y validación integrados, coherentes con el ADR 0003.
- **Tailwind:** expone el estado como atributos (`data-focused`, `data-selected`, `data-open`…), que se estilan con variantes de Tailwind. Ese mismo atributo sirve para la automatización de pruebas.

### Cómo la usamos (reglas)

1. **Nunca se reexporta React Aria directamente.** Cada componente del kit la envuelve con nuestra API (`size`, `tone`, nombres de props del kit). Si algún día hay que cambiar de librería, el cambio queda dentro del kit y no rompe a quien lo usa.
2. **`Field` sigue siendo la forma de conectar etiqueta, ayuda y error.** Los controles de React Aria reciben `isInvalid`, `isRequired`, `isDisabled` y `aria-describedby` traducidos desde `Field` / `useFieldControl`.
3. **Los controles básicos que ya existen siguen siendo nativos** (`Input`, `Textarea`, `PasswordInput`, `SearchInput`). No se migran, salvo que haya un motivo concreto.
4. **Lo que React Aria no trae o tiene en beta se aísla:** el menú contextual se compone sobre `Menu`. Toast se envuelve con nuestra API, para poder cambiar la implementación cuando salga de beta (o tomarla de otra fuente) sin cambiar la API.
5. **Se importa solo lo que se usa**, y cada componente tiene un presupuesto de peso (definición de terminado).

## Consecuencias

- **Nueva dependencia** de `@my-ui/components`: `react-aria-components`. Se instala con el primer componente que la use, no antes.
- **El peso inicial es mayor** que con Base UI (~14 KB gzip más en el Select medido). Se compensa con la cobertura y se controla con presupuestos de peso.
- **Los textos internos de React Aria** ("Seleccionar", anuncios de lector de pantalla) se traducen con su `I18nProvider`. El proveedor de idioma del kit (Fase 0) debe envolverlo, para que haya un solo lugar donde elegir idioma y dirección.
- **Hay que revisar este ADR** si Base UI incorpora tablas, árboles y fechas, o si el peso se vuelve un problema real medido en una app.
