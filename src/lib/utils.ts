
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import { bg } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    return format(new Date(dateString), 'dd MMMM yyyy', { locale: bg });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}
