
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, Eye, Calendar, MapPin } from 'lucide-react';
import { fetchApprovedWitnesses } from '@/lib/api/witnesses';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';

const WitnessesSection = () => {
  const navigate = useNavigate();
  const {
    data: witnesses = [],
    isLoading
  } = useQuery({
    queryKey: ['homepage-witnesses'],
    queryFn: fetchApprovedWitnesses,
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  // Get only the latest 3 witnesses
  const recentWitnesses = witnesses.slice(0, 3);
  
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 lg:px-8 bg-muted/40">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Търсене на свидетели</h2>
        <p className="text-center text-muted-foreground mb-8 md:mb-12">
          Помогнете на хората да намерят свидетели на произшествия
        </p>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="w-full">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : recentWitnesses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl mb-4">Няма активни обяви за свидетели</p>
            <Button 
              onClick={() => navigate('/witnesses')}
              variant="outline"
              className="mx-auto"
            >
              Вижте всички обяви
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentWitnesses.map((witness, index) => (
                <Card 
                  key={witness.id} 
                  className="opacity-0 animate-fade-in h-full flex flex-col"
                  style={{ animationDelay: `${0.1 * index}s` }}
                >
                  <CardHeader>
                    <CardTitle className="text-xl truncate">{witness.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      <span>
                        {formatDistanceToNow(new Date(witness.created_at), { 
                          addSuffix: true, 
                          locale: bg 
                        })}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-start mb-2">
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground mt-1" />
                      <span>{witness.location}</span>
                    </div>
                    <p className="text-muted-foreground line-clamp-3">{witness.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => navigate(`/witness/${witness.id}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Преглед
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-10">
              <Button 
                variant="outline" 
                className="border-2 px-6 py-5 md:px-8 md:py-6 rounded-lg text-base md:text-lg font-medium group"
                onClick={() => navigate('/witnesses')}
              >
                <span>Всички сигнали за свидетели</span>
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default WitnessesSection;
