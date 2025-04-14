
import React from 'react';
import { Eye, MapPin, Calendar, Phone, Leaf, Building, AlertTriangle, HandHelp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cardStyles, categoryTranslations } from '@/lib/card-styles';
import { useTheme } from '@/components/ThemeProvider';
import { useIsMobile } from '@/hooks/use-mobile';

export interface SignalProps {
  id: string;
  title: string;
  city: string;
  category: string;
  description: string;
  createdAt: string;
  categoryColor?: string;
  phone?: string;
}

interface SignalCardProps {
  signal: SignalProps;
  className?: string;
}

// Helper function to get the appropriate icon based on category
const getCategoryIcon = (category: string) => {
  switch(category) {
    case 'Екология':
      return <Leaf className="h-5 w-5 mr-2" />;
    case 'Инфраструктура':
      return <Building className="h-5 w-5 mr-2" />;
    case 'Бедствие':
      return <AlertTriangle className="h-5 w-5 mr-2" />;
    case 'Хора в беда':
    case 'help':
      return <HandHelp className="h-5 w-5 mr-2" />;
    default:
      return <HelpCircle className="h-5 w-5 mr-2" />;
  }
};

const SignalCard: React.FC<SignalCardProps> = ({ signal, className }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  const handleViewSignal = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/signal/${signal.id}`);
  };

  // Translate category or use original if not found
  const translatedCategory = categoryTranslations[signal.category] || signal.category;

  return (
    <div 
      className={cardStyles.container(className)}
    >
      <div className="flex flex-col h-full">
        <Badge 
          variant="outline"
          className={cardStyles.badge}
        >
          <div className="flex items-center">
            {getCategoryIcon(signal.category)}
            <span>{translatedCategory}</span>
          </div>
        </Badge>
        
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
        
        <Button 
          variant="outline" 
          size="sm" 
          className={cardStyles.button}
          onClick={handleViewSignal}
        >
          <Eye className="h-4 w-4 group-hover:text-primary transition-colors" />
          <span>Виж повече</span>
        </Button>
      </div>
    </div>
  );
};

export default SignalCard;
