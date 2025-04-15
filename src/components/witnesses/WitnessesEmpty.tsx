
import React from 'react';
import { Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';

interface WitnessesEmptyProps {
  searchQuery?: string;
}

const WitnessesEmpty: React.FC<WitnessesEmptyProps> = ({ searchQuery = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  return (
    <div className="text-center py-16 bg-muted/30 rounded-lg border border-muted">
      <div className="mx-auto flex flex-col items-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        
        {searchQuery ? (
          <>
            <h3 className="text-lg font-medium mb-2">Няма намерени резултати</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Не намерихме обяви за свидетели, отговарящи на "{searchQuery}".
              Опитайте с друго търсене или публикувайте нова обява.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium mb-2">Няма публикувани обяви за свидетели</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              В момента няма активни обяви за търсене на свидетели.
              Бъдете първият, който ще публикува обява!
            </p>
          </>
        )}
        
        {user && (
          <Button 
            className="bg-spasi-red hover:bg-spasi-red/90"
            onClick={() => navigate('/submit-witness')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Публикувай обява
          </Button>
        )}
      </div>
    </div>
  );
};

export default WitnessesEmpty;
