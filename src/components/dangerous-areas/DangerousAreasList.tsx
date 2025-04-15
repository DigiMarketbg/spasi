
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MapPin, Calendar, User, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DangerousArea } from '@/types/dangerous-area';
import { useIsMobile } from '@/hooks/use-mobile';

interface DangerousAreasListProps {
  areas: DangerousArea[];
  isLoading: boolean;
  searchQuery: string;
  isAdmin?: boolean;
  onApprove?: (id: string) => Promise<void>;
  onDelete?: (id: string) => void;
  processingApproval?: string | null;
}

const DangerousAreasList = ({ 
  areas, 
  isLoading, 
  searchQuery, 
  isAdmin = false,
  onApprove, 
  onDelete,
  processingApproval
}: DangerousAreasListProps) => {
  const [filteredAreas, setFilteredAreas] = useState<DangerousArea[]>([]);
  const isMobile = useIsMobile();
  
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

  const getSeverityColor = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case 'high':
        return 'bg-red-600'; 
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSeverityText = (severity: "low" | "medium" | "high") => {
    switch (severity) {
      case 'high':
        return 'Висока';
      case 'medium':
        return 'Средна';
      case 'low':
        return 'Ниска';
      default:
        return 'Неизв.';
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
                <Badge 
                  variant="outline" 
                  className={`${getSeverityColor(area.severity)} ${area.severity === 'low' ? 'text-black' : 'text-white'} text-xs font-bold rounded-full shadow-sm px-3 py-1 mb-1`}
                >
                  {getSeverityText(area.severity)} опасност
                </Badge>
                
                {isAdmin && area.is_approved === false && (
                  <Badge variant="outline" className="bg-amber-500 text-white">
                    Чака одобрение
                  </Badge>
                )}
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{area.location}</h3>
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{area.region || 'Неизвестен регион'}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/80 rounded-lg p-4 shadow-inner">
                <p className="whitespace-pre-line text-foreground">{area.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-xs">{formatDate(area.created_at)} г.</span>
                  </div>
                  
                  {area.reported_by_name && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      <span>{area.reported_by_name}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {isAdmin && area.is_approved === false && onApprove && (
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => onApprove(area.id)}
                      className="text-white bg-green-600 hover:bg-green-700"
                      disabled={processingApproval === area.id}
                    >
                      {processingApproval === area.id ? 'Одобряване...' : 'Одобри'}
                    </Button>
                  )}
                  
                  {isAdmin && onDelete && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDelete(area.id)} 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      disabled={processingApproval === area.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DangerousAreasList;
