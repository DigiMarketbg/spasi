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
  'Екология': 'Екология',
  'Инфраструктура': 'Инфраструктура',
  'Бедствие': 'Бедствие',
  'Друго': 'Друго',
  'other': 'Друго'
};

// Styling configurations for card elements
export const cardStyles = {
  container: (className?: string) => cn(
    "bg-gradient-to-br from-primary/90 to-primary/80 text-white p-4 sm:p-5 rounded-xl h-full flex flex-col justify-between",
    "border border-white/10 shadow-lg backdrop-blur-sm",
    "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98]",
    className
  ),
  badge: "mb-3 text-white border-white/50 bg-white/20 backdrop-blur-sm",
  title: "text-lg sm:text-xl font-semibold mb-2 line-clamp-2",
  metadata: "flex items-center text-sm text-white/90",
  description: "text-white/90 mb-4 line-clamp-3",
  button: "w-full mt-auto flex items-center justify-center gap-2 group bg-white text-primary border border-white hover:bg-primary-foreground hover:text-primary dark:hover:bg-primary/90 dark:hover:text-white transition-colors"
};

// Detail page card styling
export const detailCardStyles = {
  container: "relative overflow-hidden bg-gradient-to-br from-background to-background/80 shadow-xl border border-border/50 backdrop-blur-md rounded-xl animate-scale-in",
  header: "px-4 sm:px-6 pt-6 pb-4 border-b border-border/10 mb-4", // Added mb-4 for bottom margin
  title: "text-xl sm:text-2xl md:text-3xl font-bold text-foreground",
  subtitle: "text-sm text-muted-foreground flex items-center flex-wrap gap-2",
  content: "p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8",
  metadata: "flex items-center gap-1 text-sm text-muted-foreground",
  badge: "bg-primary/10 text-primary hover:bg-primary/20 transition-colors",
  description: "whitespace-pre-line text-foreground/90 leading-relaxed",
  image: "rounded-lg border border-border/50 shadow-md w-full object-cover max-h-[350px] hover:shadow-lg transition-shadow animate-fade-in",
  section: "space-y-4",
  button: "transition-all flex items-center gap-2 hover:gap-3",
  shareButton: "fixed bottom-6 right-6 z-10 bg-primary text-white shadow-lg rounded-full p-3 md:hidden animate-pulse hover:animate-none hover:scale-110 transition-transform"
};
