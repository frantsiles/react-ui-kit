/** Aviso solo en desarrollo; el bundler del consumidor lo elimina en producción. */
export function devWarning(condition: boolean, message: string): void {
  if (
    condition &&
    typeof process !== 'undefined' &&
    process.env?.['NODE_ENV'] !== 'production'
  ) {
    console.warn(`[@my-ui/components] ${message}`);
  }
}
