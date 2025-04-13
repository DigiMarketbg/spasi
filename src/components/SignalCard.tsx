
import React from 'react';
import { cn } from '@/lib/utils';
import { Eye, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div 
      className={cn(
        "glass p-5 rounded-xl h-full transition-all duration-300",
        "hover:translate-y-[-5px] hover:shadow-lg",
        className
      )}
    >
      <Badge 
        style={{ backgroundColor: signal.categoryColor }}
        className="mb-4"
      >
        {signal.category}
      </Badge>
      
      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{signal.title}</h3>
      
      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <MapPin className="h-3.5 w-3.5 mr-1" />
        <span>{signal.city}</span>
        <span className="mx-2">•</span>
        <span>{signal.createdAt}</span>
      </div>
      
      <p className="text-muted-foreground mb-4 line-clamp-2">{signal.description}</p>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-auto flex items-center gap-2 group"
        onClick={() => navigate(`/signal/${signal.id}`)}
      >
        <Eye className="h-4 w-4 group-hover:text-primary transition-colors" />
        <span>Виж повече</span>
      </Button>
    </div>
  );
};

export default SignalCard;
