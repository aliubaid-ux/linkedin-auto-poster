import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function format(date: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!date) {
    return '';
  }
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return ''; // Return an empty string for invalid dates
  }
  return new Intl.DateTimeFormat("en-US", options).format(dateObj);
}
