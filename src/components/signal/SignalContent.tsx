
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface SignalContentProps {
  signal: {
    title: string;
    category: string;
    created_at: string;
    city: string;
    description: string;
    link?: string;
    image_url?: string;
  };
  formatDate: (dateString: string) => string;
}

const SignalContent: React.FC<SignalContentProps> = ({ signal, formatDate }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <p className="text-muted-foreground mb-4">
          <strong>Град:</strong> {signal.city}
        </p>
        
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
