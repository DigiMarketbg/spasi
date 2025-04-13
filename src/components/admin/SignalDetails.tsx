
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ExternalLink } from 'lucide-react';
import { Signal } from '@/types/signal';

interface SignalDetailsProps {
  signal: Signal;
  formatDate: (dateString: string) => string;
}

const SignalDetails: React.FC<SignalDetailsProps> = ({ signal, formatDate }) => {
  // Function to safely get the submitter name/email
  const getSubmitterInfo = () => {
    if (!signal.profiles) return 'Неизвестен';
    
    // Since we've already validated the profiles object in SignalDetail.tsx,
    // we can safely access its properties here
    return signal.profiles.full_name || signal.profiles.email || 'Неизвестен';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge>{signal.category}</Badge>
        <Badge variant={signal.is_approved ? "default" : "outline"}>
          {signal.is_approved ? 'Одобрен' : 'Неодобрен'}
        </Badge>
        <Badge variant={signal.is_resolved ? "success" : "destructive"}>
          {signal.is_resolved ? 'Разрешен' : 'Неразрешен'}
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label className="text-muted-foreground">Град</Label>
          <p className="font-medium">{signal.city}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Дата на създаване</Label>
          <p className="font-medium">{formatDate(signal.created_at)}</p>
        </div>
      </div>
      
      <div>
        <Label className="text-muted-foreground">Описание</Label>
        <p className="mt-1 whitespace-pre-line">{signal.description}</p>
      </div>
      
      {(signal.phone || signal.link) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {signal.phone && (
            <div>
              <Label className="text-muted-foreground">Телефон</Label>
              <p className="font-medium">
                <a 
                  href={`tel:${signal.phone}`} 
                  className="text-primary hover:underline"
                  aria-label="Обади се"
                >
                  {signal.phone}
                </a>
              </p>
            </div>
          )}
          
          {signal.link && (
            <div>
              <Label className="text-muted-foreground">Линк</Label>
              <p className="font-medium">
                <a 
                  href={signal.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary flex items-center gap-1 hover:underline"
                >
                  {signal.link.substring(0, 30)}...
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>
          )}
        </div>
      )}
      
      <div>
        <Label className="text-muted-foreground">Подал</Label>
        <p className="font-medium">
          {getSubmitterInfo()}
        </p>
      </div>
      
      {signal.image_url && (
        <div>
          <Label className="text-muted-foreground">Изображение</Label>
          <div className="mt-2">
            <img 
              src={signal.image_url} 
              alt={signal.title} 
              className="max-w-full h-auto max-h-[300px] rounded-md border"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalDetails;
