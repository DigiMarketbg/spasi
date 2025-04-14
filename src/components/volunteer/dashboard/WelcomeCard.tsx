
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Volunteer } from '@/types/volunteer';

interface WelcomeCardProps {
  volunteer: Volunteer;
}

const WelcomeCard = ({ volunteer }: WelcomeCardProps) => {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl">Добре дошъл, {volunteer.full_name}</CardTitle>
        <CardDescription className="text-base">
          Одобрен доброволец в {volunteer.city}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {volunteer.can_help_with.map(skill => (
            <Badge key={skill} variant="outline" className="bg-blue-100/50 dark:bg-blue-900/30">
              {skill === 'transport' && 'Транспорт'}
              {skill === 'food' && 'Храна'}
              {skill === 'blood' && 'Кръв'}
              {skill === 'logistics' && 'Логистика'}
              {skill === 'other' && 'Друго'}
            </Badge>
          ))}
        </div>
        <p className="text-muted-foreground">
          Благодарим, че си част от нашия екип. Тук ще намериш информация за предстоящи мисии и
          ще можеш да се включиш активно в различни инициативи.
        </p>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
