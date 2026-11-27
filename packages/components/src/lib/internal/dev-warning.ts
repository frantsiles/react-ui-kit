function isProduction(): boolean {
  try {
    // Forma con punto a propósito: los bundlers (Vite, webpack, esbuild) la
    // reemplazan de forma estática y eliminan el aviso del build de producción.
    return process.env.NODE_ENV === 'production';
  } catch {
    // Sin `process` (navegador sin bundler, p. ej. Vitest en modo navegador): desarrollo.
    return false;
  }
}

/** Aviso solo en desarrollo; el bundler del consumidor lo elimina en producción. */
export function devWarning(condition: boolean, message: string): void {
  if (condition && !isProduction()) {
    console.warn(`[@my-ui/components] ${message}`);
  }
}
