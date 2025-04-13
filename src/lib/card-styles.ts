
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
    "bg-green-600 text-white p-5 rounded-xl h-full flex flex-col justify-between transition-all duration-300",
    "hover:translate-y-[-5px] hover:shadow-lg",
    className
  ),
  badge: "mb-4 text-white border-white/50 bg-white/20",
  title: "text-xl font-semibold mb-2 line-clamp-1",
  metadata: "flex items-center text-sm text-white/80 mb-3",
  description: "text-white/90 mb-4 line-clamp-2",
  button: "w-full mt-auto flex items-center gap-2 group bg-white text-green-600 border-white hover:bg-green-50 transition-colors"
};
