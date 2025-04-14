
import React from 'react';
import { ExternalLink, Phone, Calendar, MapPin, Leaf, Building, AlertTriangle, HelpingHand, HelpCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categoryTranslations, detailCardStyles } from '@/lib/card-styles';
import { useTheme } from '@/components/ThemeProvider';

interface SignalContentProps {
  signal: {
    title: string;
    category: string;
    created_at: string;
    city: string;
    description: string;
    phone?: string;
    link?: string;
    image_url?: string;
    is_resolved?: boolean;
  };
  formatDate: (dateString: string) => string;
}

// Helper function to get the appropriate icon based on category
const getCategoryIcon = (category: string) => {
  switch(category.toLowerCase()) {
    case 'екология':
    case 'ecology':
      return <Leaf className="h-5 w-5 mr-2" />;
    case 'инфраструктура':
    case 'infrastructure':
      return <Building className="h-5 w-5 mr-2" />;
    case 'бедствие':
    case 'disaster':
    case 'danger':
      return <AlertTriangle className="h-5 w-5 mr-2" />;
    case 'хора в беда':
    case 'help':
    case 'people in need':
      return <HelpingHand className="h-5 w-5 mr-2" />;
    default:
      return <HelpCircle className="h-5 w-5 mr-2" />;
  }
};

const SignalContent: React.FC<SignalContentProps> = ({
  signal,
  formatDate
}) => {
  // Translate category
  const translatedCategory = categoryTranslations[signal.category] || signal.category;
  const { theme } = useTheme();
  
  // Add theme-specific styling
  const themeStyles = theme === 'dark'
    ? "dark:bg-slate-800/30 dark:shadow-md dark:border-white/5" // Dark mode: subtle gray background with shadow
    : "shadow-md border border-border/20"; // Light mode: shadow and subtle border
  
  // Combined styling for resolved status
  const resolvedStyles = signal.is_resolved 
    ? "bg-green-50/30 dark:bg-green-900/10" 
    : "";
  
  return (
    <div 
      style={{
        animationDelay: '0.2s'
      }} 
      className={`grid md:grid-cols-2 gap-6 animate-fade-in pt-4 sm:pt-6 py-0 ${resolvedStyles} ${themeStyles} rounded-lg p-4 md:p-6 transition-all duration-300`}
    >
      <div className={detailCardStyles.section}>
        {/* Status and Category badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={detailCardStyles.badge}>
            <div className="flex items-center">
              {getCategoryIcon(signal.category)}
              <span>{translatedCategory}</span>
            </div>
          </Badge>
          
          {signal.is_resolved && (
            <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-800/60 flex items-center">
              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
              <span>Решен сигнал</span>
            </Badge>
          )}
        </div>
        
        <div className="space-y-3">
          <div className={detailCardStyles.metadata}>
            <MapPin className="h-4 w-4" />
            <span className="ml-1"><strong>Град:</strong> {signal.city}</span>
          </div>
          
          {signal.phone && <div className={detailCardStyles.metadata}>
              <Phone className="h-4 w-4" />
              <span className="ml-1">
                <strong>Телефон:</strong>{' '}
                <a href={`tel:${signal.phone}`} className="text-primary hover:underline transition-colors" aria-label="Обади се">
                  {signal.phone}
                </a>
              </span>
            </div>}
        </div>
        
        <div className="my-5 border-t border-border/30 pt-5">
          <p className={detailCardStyles.description}>{signal.description}</p>
        </div>
        
        {signal.link && <div className="mt-6">
            <Button variant="outline" onClick={() => window.open(signal.link, '_blank')} className={detailCardStyles.button}>
              <ExternalLink className="h-4 w-4" />
              <span>Виж поста във Facebook</span>
            </Button>
          </div>}
      </div>
      
      {signal.image_url ? <div className="order-first md:order-last mb-6 md:mb-0">
          <img src={signal.image_url} alt={signal.title} className={detailCardStyles.image} loading="eager" />
        </div> : null}
    </div>
  );
};

export default SignalContent;
