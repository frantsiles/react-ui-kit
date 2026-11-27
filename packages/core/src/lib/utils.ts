import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import {
  containerSizes,
  easings,
  elevations,
  fontFamilies,
  fontWeights,
  textStyles,
} from './tokens.js';

const ui = (names: readonly string[]) => names.map((name) => `ui-${name}`);

/**
 * tailwind-merge no conoce los tokens del kit: sin esto trata `text-ui-body`
 * (tamaño) y `text-ui-fg` (color) como la misma propiedad y descarta una.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ui(textStyles),
      font: ui(fontFamilies),
      'font-weight': ui(fontWeights),
      shadow: ui(elevations),
      ease: ui(easings),
      container: ui(Object.keys(containerSizes)),
    },
  },
});

/**
 * Une clases y resuelve conflictos de Tailwind: la última gana. Pon el
 * `className` del usuario al final.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Utility function to create a debounced version of a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Utility function to create a throttled version of a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Utility function to generate unique IDs
 *
 * @deprecated No usar para asociar elementos (label ↔ input, aria-describedby):
 * genera valores distintos en servidor y cliente y rompe la hidratación con SSR.
 * En componentes React usa `useId()`.
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Utility function to check if code is running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Utility function to safely access localStorage
 */
export function getStorageItem(key: string, defaultValue?: string): string | null {
  if (!isBrowser()) return defaultValue || null;

  try {
    return localStorage.getItem(key) || defaultValue || null;
  } catch {
    return defaultValue || null;
  }
}

/**
 * Utility function to safely set localStorage
 */
export function setStorageItem(key: string, value: string): boolean {
  if (!isBrowser()) return false;

  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Utility function to format file sizes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Utility function to capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Utility function to truncate text
 */
export function truncate(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}
