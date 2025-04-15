
import React from 'react';
import { Eye, MapPin, Calendar, Phone, Leaf, Building, AlertTriangle, HelpingHand, HelpCircle, CheckCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cardStyles, categoryTranslations } from '@/lib/card-styles';
import { useTheme } from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

export interface SignalProps {
  id: string;
  title: string;
  city: string;
  category: string;
  description: string;
  createdAt: string;
  categoryColor?: string;
  phone?: string;
  isResolved?: boolean;
}

interface SignalCardProps {
  signal: SignalProps;
  className?: string;
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

const SignalCard: React.FC<SignalCardProps> = ({ signal, className }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleViewSignal = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/signal/${signal.id}`);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    const shareUrl = `${window.location.origin}/signal/${signal.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: signal.title,
        text: signal.description.substring(0, 100) + '...',
        url: shareUrl
      }).catch(error => console.error('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Линкът е копиран",
        description: "Линкът към сигнала е копиран в клипборда"
      });
    }
  };

  // Translate category or use original if not found
  const translatedCategory = categoryTranslations[signal.category] || signal.category;

  // Determine additional styling for resolved signals
  const resolvedStyles = signal.isResolved 
    ? "from-green-50/90 to-green-50/80 border-green-200 dark:from-green-900/20 dark:to-green-900/10 dark:border-green-900/30" 
    : "";

  // Add theme-specific styling
  const themeStyles = theme === 'dark'
    ? "bg-slate-800/40 shadow-lg dark:border-white/5" // Dark mode: subtle gray background
    : "shadow-md hover:shadow-lg border border-border/30"; // Light mode: shadow and subtle border

  return (
    <div 
      className={`${cardStyles.container(className)} ${resolvedStyles} ${themeStyles} transition-all duration-300`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="outline"
            className={cardStyles.badge}
          >
            <div className="flex items-center">
              {getCategoryIcon(signal.category)}
              <span>{translatedCategory}</span>
            </div>
          </Badge>
          
          {signal.isResolved && (
            <Badge 
              variant="outline" 
              className="bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border-green-300 dark:border-green-800/60 flex items-center"
            >
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span>Решен</span>
            </Badge>
          )}
        </div>
        
        <h3 className={cardStyles.title}>{signal.title}</h3>
        
        <div className="space-y-2 mb-3">
          <div className={cardStyles.metadata}>
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{signal.createdAt}</span>
          </div>
          
          <div className={cardStyles.metadata}>
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{signal.city}</span>
          </div>
          
          {signal.phone && (
            <div className={cardStyles.metadata}>
              <Phone className="h-3.5 w-3.5 mr-1" />
              <a 
                href={`tel:${signal.phone}`} 
                className="hover:underline" 
                onClick={(e) => e.stopPropagation()}
              >
                {signal.phone}
              </a>
            </div>
          )}
        </div>
        
        <p className={cardStyles.description}>{signal.description}</p>
        
        <div className="flex items-center gap-2 mt-auto">
          <Button 
            variant="outline" 
            size="sm" 
            className={cardStyles.button}
            onClick={handleViewSignal}
          >
            <Eye className="h-4 w-4 group-hover:text-primary transition-colors" />
            <span>Виж повече</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground hover:text-foreground ml-auto"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Сподели</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignalCard;
