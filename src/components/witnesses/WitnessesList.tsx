
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Phone, User, Eye } from 'lucide-react';
import { Witness } from '@/types/witness';
import WitnessesEmpty from './WitnessesEmpty';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';

interface WitnessesListProps {
  witnesses: Witness[];
  isLoading: boolean;
  searchQuery: string;
}

const WitnessesList: React.FC<WitnessesListProps> = ({ 
  witnesses, 
  isLoading,
  searchQuery
}) => {
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-80">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (witnesses.length === 0) {
    return <WitnessesEmpty searchQuery={searchQuery} />;
  }
  
  const calculateExpiresIn = (expiresAt: string) => {
    const expiryDate = new Date(expiresAt);
    return formatDistanceToNow(expiryDate, { addSuffix: true, locale: bg });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {witnesses.map(witness => (
        <Card key={witness.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{witness.title}</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Изтича {calculateExpiresIn(witness.expires_at)}
            </p>
          </CardHeader>
          
          <CardContent className="pb-3">
            <p className="line-clamp-3 mb-4 text-sm">{witness.description}</p>
            
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{witness.location}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(witness.date).toLocaleDateString('bg-BG')}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{witness.contact_name}</span>
              </div>
              
              {witness.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{witness.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate(`/witness/${witness.id}`)}
            >
              <Eye className="w-4 h-4 mr-2" />
              Виж детайли
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default WitnessesList;
