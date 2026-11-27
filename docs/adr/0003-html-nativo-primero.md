# 0003 · HTML nativo primero; librería headless solo para controles complejos

- **Estado:** Aceptado (la elección de librería se resolvió en el [ADR 0005](0005-react-aria-como-libreria-headless.md))
- **Fecha:** 2026-11-27

## Contexto

Librerías headless como React Aria, Base UI o Radix resuelven la accesibilidad de componentes complejos (comboboxes, menús, diálogos). Hay que decidir si usarlas desde el primer componente.

## Decisión

- Los controles básicos (`Input`, `Textarea`, `Label`, `Tag`…) se construyen sobre **elementos nativos** (`<input>`, `<label>`, `<button>`).
- La elección de una librería headless se posterga hasta el primer control que la necesite de verdad: Select con búsqueda, Combobox, Menu o Dialog.

## Por qué

- Un `<input>` nativo ya trae teclado, foco, autocompletado, gestores de contraseñas, validación nativa, `FormData` y Actions de React 19. Reimplementarlo solo agrega riesgo.
- Sumar una dependencia grande para controles que no la necesitan agrega peso y acopla el kit antes de tiempo.

## Consecuencias

- Cuando llegue el primer control complejo hará falta un ADR nuevo para elegir la librería. Hoy, la candidata principal es React Aria, por la profundidad de su soporte de accesibilidad e internacionalización.
- `Field` y `useFieldControl` deberán integrarse con los controles de esa librería.
