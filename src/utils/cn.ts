import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS class names without inline style usage.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
