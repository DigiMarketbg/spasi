
import React from 'react';
import { ExternalLink, Phone, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { categoryTranslations } from '@/lib/card-styles';

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
    <div className="grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-white/20 text-white border-white/50">
            {translatedCategory}
          </Badge>
          <div className="flex items-center text-muted-foreground text-sm">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {formatDate(signal.created_at)}
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span><strong>Град:</strong> {signal.city}</span>
        </div>
        
        {signal.phone && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span><strong>Телефон:</strong> {signal.phone}</span>
          </div>
        )}
        
        <p className="whitespace-pre-line">{signal.description}</p>
        
        {signal.link && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              onClick={() => window.open(signal.link, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Виж поста във Facebook
            </Button>
          </div>
        )}
      </div>
      
      {signal.image_url && (
        <div>
          <img 
            src={signal.image_url} 
            alt={signal.title} 
            className="rounded-lg max-h-[400px] w-full object-cover"
          />
        </div>
      )}
    </div>
  );
};

export default SignalContent;
