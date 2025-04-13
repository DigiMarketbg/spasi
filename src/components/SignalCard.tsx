
import React from 'react';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { cardStyles, categoryTranslations } from '@/lib/card-styles';

export interface SignalProps {
  id: string;
  title: string;
  city: string;
  category: string;
  description: string;
  createdAt: string;
  categoryColor?: string;
}

interface SignalCardProps {
  signal: SignalProps;
  className?: string;
}

const SignalCard: React.FC<SignalCardProps> = ({ signal, className }) => {
  const navigate = useNavigate();

  const handleViewSignal = () => {
    navigate(`/signal/${signal.id}`);
  };

  // Translate category or use original if not found
  const translatedCategory = categoryTranslations[signal.category] || signal.category;

  return (
    <div className={cardStyles.container(className)}>
      <div>
        <Badge 
          variant="outline"
          className={cardStyles.badge}
        >
          {translatedCategory}
        </Badge>
        
        <h3 className={cardStyles.title}>{signal.title}</h3>
        
        <div className={cardStyles.metadata}>
          <MapPin className="h-3.5 w-3.5 mr-1" />
          <span>{signal.city}</span>
          <span className="mx-2">•</span>
          <span>{signal.createdAt}</span>
        </div>
        
        <p className={cardStyles.description}>{signal.description}</p>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className={cardStyles.button}
        onClick={handleViewSignal}
      >
        <Eye className="h-4 w-4 group-hover:text-white transition-colors" />
        <span>Виж повече</span>
      </Button>
    </div>
  );
};

export default SignalCard;
