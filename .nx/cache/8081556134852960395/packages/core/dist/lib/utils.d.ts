import { ClassValue } from 'clsx';
/**
 * Utility function to merge class names with Tailwind CSS conflict resolution
 */
export declare function cn(...inputs: ClassValue[]): string;
/**
 * Utility function to create a debounced version of a function
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Utility function to create a throttled version of a function
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Utility function to generate unique IDs
 */
export declare function generateId(prefix?: string): string;
/**
 * Utility function to check if code is running in browser
 */
export declare function isBrowser(): boolean;
/**
 * Utility function to safely access localStorage
 */
export declare function getStorageItem(key: string, defaultValue?: string): string | null;
/**
 * Utility function to safely set localStorage
 */
export declare function setStorageItem(key: string, value: string): boolean;
/**
 * Utility function to format file sizes
 */
export declare function formatFileSize(bytes: number): string;
/**
 * Utility function to capitalize first letter
 */
export declare function capitalize(str: string): string;
/**
 * Utility function to truncate text
 */
export declare function truncate(str: string, length: number): string;
//# sourceMappingURL=utils.d.ts.map