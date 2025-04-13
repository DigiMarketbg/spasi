
import React from 'react';
import { Volunteer } from '@/types/volunteer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VolunteerDashboardProps {
  volunteer: Volunteer;
}

const VolunteerDashboard = ({ volunteer }: VolunteerDashboardProps) => {
  // For now, these are placeholder missions
  const missions = [
    {
      id: 1,
      title: "Транспорт на хранителни продукти",
      location: "София - Младост 4",
      date: "21.04.2025",
      status: "активна",
      category: "транспорт"
    },
    {
      id: 2,
      title: "Помощ в пакетиране на дарения",
      location: "София - Люлин 5",
      date: "25.04.2025",
      status: "предстояща",
      category: "логистика"
    },
    {
      id: 3,
      title: "Доставка на храна до центрове",
      location: "София - Център",
      date: "18.04.2025",
      status: "приключена",
      category: "храна"
    }
  ];

  // Filter missions that match volunteer skills
  const relevantMissions = missions.filter(mission => 
    volunteer.can_help_with.some(skill => 
      mission.category.includes(skill) || skill === 'other'
    )
  );

  return (
    <div className="space-y-8">
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

      <div>
        <h3 className="text-xl font-semibold mb-4">Текущи мисии</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {relevantMissions.map(mission => (
            <Card key={mission.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div 
                className={`h-2 w-full ${
                  mission.status === 'активна' 
                    ? 'bg-green-500' 
                    : mission.status === 'предстояща' 
                    ? 'bg-blue-500' 
                    : 'bg-gray-500'
                }`}
              />
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">{mission.title}</CardTitle>
                  <Badge variant="outline" className={
                    mission.status === 'активна' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : mission.status === 'предстояща' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                  }>
                    {mission.status}
                  </Badge>
                </div>
                <CardDescription>{mission.location}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{mission.date}</span>
                  {mission.status !== 'приключена' && (
                    <button className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      Детайли
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Инструкции за доброволци</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">1. Комуникация</h4>
            <p className="text-sm text-muted-foreground">
              Всички съобщения ще получавате на посочения имейл. Моля, проверявайте го редовно.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">2. Записване за мисия</h4>
            <p className="text-sm text-muted-foreground">
              За да се запишете за мисия, използвайте бутона "Детайли" и следвайте инструкциите.
            </p>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">3. Отговорности</h4>
            <p className="text-sm text-muted-foreground">
              Като доброволец, вие се ангажирате да спазвате уговорените срокове и да изпълнявате
              задачите според инструкциите.
            </p>
          </div>

          <div className="pt-4">
            <a 
              href="#" 
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              Изтегли пълно ръководство за доброволци
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolunteerDashboard;
