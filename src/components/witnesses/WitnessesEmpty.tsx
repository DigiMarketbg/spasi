
import React from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface WitnessesEmptyProps {
  searchQuery?: string;
}

const WitnessesEmpty: React.FC<WitnessesEmptyProps> = ({ searchQuery }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
      
      {searchQuery ? (
        <>
          <h3 className="text-lg font-medium mb-2">Няма намерени резултати</h3>
          <p className="text-muted-foreground mb-4">
            Не намерихме сигнали за свидетели, съответстващи на "{searchQuery}".
          </p>
        </>
      ) : (
        <>
          <h3 className="text-lg font-medium mb-2">Няма активни сигнали за свидетели</h3>
          <p className="text-muted-foreground mb-4">
            В момента няма публикувани сигнали за търсене на свидетели.
          </p>
        </>
      )}
      
      <Button onClick={() => navigate('/submit-witness')}>
        Публикувай сигнал за свидетел
      </Button>
    </div>
  );
};

export default WitnessesEmpty;
