
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Clock, 
  ChevronLeft, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { getWitnessById } from '@/lib/api/witnesses';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { toast } from 'sonner';

const WitnessDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: witness, isLoading, error } = useQuery({
    queryKey: ['witness', id],
    queryFn: () => id ? getWitnessById(id) : Promise.reject('No ID provided'),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Зареждане...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (error || !witness) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow mt-16 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-center">Обявата не е намерена</h1>
            <p className="text-center mb-6">
              Обявата, която търсите, не съществува или е изтекъл срокът й на валидност.
            </p>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/witnesses')}>
                Всички обяви за свидетели
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleCallPhone = () => {
    if (witness.phone) {
      window.location.href = `tel:${witness.phone}`;
    } else {
      toast.error("Няма наличен телефонен номер");
    }
  };
  
  // Calculate expires time
  const expiryDate = new Date(witness.expires_at);
  const expiresIn = formatDistanceToNow(expiryDate, { addSuffix: true, locale: bg });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <Button 
            variant="outline" 
            className="mb-6"
            onClick={() => navigate('/witnesses')}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Назад към обявите
          </Button>
          
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{witness.title}</h1>
              
              <div className="flex items-center text-sm text-muted-foreground mb-6">
                <Clock className="h-4 w-4 mr-1" />
                <span>Обявата изтича {expiresIn}</span>
              </div>
              
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Описание</h2>
                <p className="whitespace-pre-line">{witness.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-8">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Местоположение</h3>
                    <p>{witness.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Дата на инцидента</h3>
                    <p>{new Date(witness.date).toLocaleDateString('bg-BG')}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="font-medium">Лице за контакт</h3>
                    <p>{witness.contact_name}</p>
                  </div>
                </div>
                
                {witness.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Телефон</h3>
                      <p>{witness.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                <Button 
                  className="w-full sm:w-auto bg-spasi-red hover:bg-spasi-red/90"
                  onClick={handleCallPhone}
                  disabled={!witness.phone}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Обади се
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => navigate('/witnesses')}
                >
                  Виж други обяви
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default WitnessDetail;
