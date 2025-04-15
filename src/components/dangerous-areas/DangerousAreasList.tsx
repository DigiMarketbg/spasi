
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Calendar, User, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DangerousArea } from '@/types/dangerous-area';

interface DangerousAreasListProps {
  areas: DangerousArea[];
  isLoading: boolean;
  searchQuery: string;
}

const DangerousAreasList = ({ areas, isLoading, searchQuery }: DangerousAreasListProps) => {
  const [filteredAreas, setFilteredAreas] = useState<DangerousArea[]>([]);
  
  useEffect(() => {
    if (areas.length > 0) {
      const filtered = areas.filter(area => {
        const locationMatch = area.location.toLowerCase().includes(searchQuery.toLowerCase());
        const descriptionMatch = area.description.toLowerCase().includes(searchQuery.toLowerCase());
        const regionMatch = area.region?.toLowerCase().includes(searchQuery.toLowerCase());
        return locationMatch || descriptionMatch || (regionMatch || false);
      });
      setFilteredAreas(filtered);
    } else {
      setFilteredAreas([]);
    }
  }, [searchQuery, areas]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG');
  };

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-500 hover:bg-red-600';
      case 'medium':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'low':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  // Get severity text
  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Висока опасност';
      case 'medium':
        return 'Средна опасност';
      case 'low':
        return 'Ниска опасност';
      default:
        return 'Неизвестна опасност';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p>Зареждане...</p>
      </div>
    );
  }

  if (filteredAreas.length === 0) {
    return (
      <div className="text-center py-16">
        <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">
          {areas.length === 0 
            ? 'Все още няма добавени опасни участъци' 
            : 'Няма намерени опасни участъци по зададените критерии'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {filteredAreas.map((area) => (
        <Card key={area.id} className="overflow-hidden border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className={`h-2 w-full ${getSeverityColor(area.severity)}`} />
          <CardContent className="p-6">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{area.location}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{area.region || 'Неизвестен регион'}</span>
                  </div>
                </div>
                
                <Badge variant="outline" className={`px-3 py-1 ${getSeverityColor(area.severity)} text-white`}>
                  {getSeverityText(area.severity)}
                </Badge>
              </div>
              
              <div className="bg-background/80 rounded-lg p-4 shadow-inner">
                <p className="whitespace-pre-line text-foreground">{area.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(area.created_at)}</span>
                  </div>
                  
                  {area.reported_by_name && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{area.reported_by_name}</span>
                    </div>
                  )}
                </div>
                
                {area.map_link && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => window.open(area.map_link, '_blank')}
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    Виж на картата
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DangerousAreasList;
