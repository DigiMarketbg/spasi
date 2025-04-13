
import { cn } from '@/lib/utils';

// Color definitions for signals by category
export const getCategoryColor = (category: string): string => {
  switch(category) {
    case 'blood':
      return '#e53935'; // Red for blood donation
    case 'missing':
      return '#5c6bc0'; // Indigo/blue for missing person
    case 'stolen':
      return '#f57c00'; // Orange for stolen vehicle
    case 'danger':
      return '#d81b60'; // Pink/magenta for dangerous area
    case 'help':
      return '#43a047'; // Green for people in need
    case 'Екология':
      return '#43a047'; // Green for ecology
    case 'Инфраструктура':
      return '#1e88e5'; // Blue for infrastructure
    case 'Бедствие':
      return '#e53935'; // Red for disaster
    default:
      return '#8d6e63'; // Brown for other
  }
};

// Bulgarian translations for categories
export const categoryTranslations: { [key: string]: string } = {
  'blood': 'Кръводаряване',
  'missing': 'Изчезнал човек',
  'stolen': 'Откраднат автомобил',
  'danger': 'Опасен участък',
  'help': 'Хора в беда',
  'other': 'Друго'
};

// Styling configurations for card elements
export const cardStyles = {
  container: (className?: string) => cn(
    "bg-green-600 text-white p-4 sm:p-5 rounded-xl h-full flex flex-col justify-between transition-all duration-300",
    "border border-white/10 shadow-lg backdrop-blur-sm",
    "hover:translate-y-[-5px] hover:shadow-xl active:scale-[0.98]",
    className
  ),
  badge: "mb-3 text-white border-white/50 bg-white/20 backdrop-blur-sm",
  title: "text-lg sm:text-xl font-semibold mb-2 line-clamp-2",
  metadata: "flex items-center text-sm text-white/90",
  description: "text-white/90 mb-4 line-clamp-3",
  button: "w-full mt-auto flex items-center justify-center gap-2 group bg-white text-green-600 border border-white hover:bg-green-700 hover:text-white dark:hover:bg-green-700 dark:hover:text-white transition-colors"
};
