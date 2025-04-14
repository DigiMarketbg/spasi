
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin } from 'lucide-react';

interface MissionCardProps {
  mission: {
    id: string;
    title: string;
    location: string;
    date: string;
    status: string;
    category: string;
  };
  status: string | null;
  onRegister: (missionId: string) => void;
}

const MissionCard = ({ mission, status, onRegister }: MissionCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div 
        className={`h-2 w-full ${
          mission.status === 'active' 
            ? 'bg-green-500' 
            : mission.status === 'upcoming' 
            ? 'bg-blue-500' 
            : 'bg-gray-500'
        }`}
      />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{mission.title}</CardTitle>
          <Badge variant="outline" className={
            mission.status === 'active' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
              : mission.status === 'upcoming' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
          }>
            {mission.status === 'active' && 'Активна'}
            {mission.status === 'upcoming' && 'Предстояща'}
            {mission.status === 'completed' && 'Приключена'}
          </Badge>
        </div>
        <CardDescription>
          <div className="flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" />
            <span>{mission.location}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="h-3 w-3" />
            <span>{mission.date}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          {status ? (
            <Badge variant={
              status === 'approved' ? 'default' : 
              status === 'pending' ? 'secondary' : 
              status === 'completed' ? 'outline' : 'destructive'
            }>
              {status === 'approved' && 'Одобрен'}
              {status === 'pending' && 'В изчакване'}
              {status === 'rejected' && 'Отхвърлен'}
              {status === 'completed' && 'Завършена'}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">Незаписан</span>
          )}
          {(mission.status !== 'completed' && !status) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRegister(mission.id)}
            >
              Запиши се
            </Button>
          )}
          {(mission.status !== 'completed' && status) && (
            <Button 
              variant="ghost" 
              size="sm"
            >
              Детайли
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionCard;
