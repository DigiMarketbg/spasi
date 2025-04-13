
import React from 'react';
import { ExternalLink, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categoryTranslations, detailCardStyles } from '@/lib/card-styles';

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
  };
  formatDate: (dateString: string) => string;
}

const SignalContent: React.FC<SignalContentProps> = ({ signal, formatDate }) => {
  // Translate category
  const translatedCategory = categoryTranslations[signal.category] || signal.category;
  
  return (
    <div className="grid md:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className={detailCardStyles.section}>
        <div className="flex items-center flex-wrap gap-2">
          <Badge variant="outline" className={detailCardStyles.badge}>
            {translatedCategory}
          </Badge>
          <div className={detailCardStyles.metadata}>
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatDate(signal.created_at)}
          </div>
        </div>
        
        <div className={detailCardStyles.metadata}>
          <MapPin className="h-4 w-4" />
          <span className="ml-1"><strong>Град:</strong> {signal.city}</span>
        </div>
        
        {signal.phone && (
          <div className={detailCardStyles.metadata}>
            <Phone className="h-4 w-4" />
            <span className="ml-1">
              <strong>Телефон:</strong>{' '}
              <a 
                href={`tel:${signal.phone}`} 
                className="text-primary hover:underline transition-colors"
                aria-label="Обади се"
              >
                {signal.phone}
              </a>
            </span>
          </div>
        )}
        
        <p className={detailCardStyles.description}>{signal.description}</p>
        
        {signal.link && (
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => window.open(signal.link, '_blank')}
              className={detailCardStyles.button}
            >
              <ExternalLink className="h-4 w-4" />
              <span>Виж поста във Facebook</span>
            </Button>
          </div>
        )}
      </div>
      
      {signal.image_url ? (
        <div className="order-first md:order-last mb-6 md:mb-0">
          <img 
            src={signal.image_url} 
            alt={signal.title} 
            className={detailCardStyles.image}
            loading="eager"
          />
        </div>
      ) : null}
    </div>
  );
};

export default SignalContent;
