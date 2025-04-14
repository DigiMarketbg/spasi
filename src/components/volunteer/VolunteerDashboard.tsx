
import React, { useState, useEffect } from 'react';
import { Volunteer } from '@/types/volunteer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getVolunteerRegistrations } from '@/lib/api';
import { registerForMission } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface VolunteerDashboardProps {
  volunteer: Volunteer;
}

const VolunteerDashboard = ({ volunteer }: VolunteerDashboardProps) => {
  const { toast } = useToast();
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const registrations = await getVolunteerRegistrations(volunteer.id);
        setMissions(registrations);
      } catch (error) {
        console.error('Error fetching missions:', error);
        toast({
          variant: "destructive",
          title: "Грешка",
          description: "Възникна проблем при зареждането на мисиите"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, [volunteer.id, toast]);

  const handleRegister = async (missionId: string) => {
    try {
      await registerForMission(missionId, volunteer.id);
      toast({
        title: "Успешно записване",
        description: "Успешно се записахте за мисията",
      });
      
      // Refresh missions
      const registrations = await getVolunteerRegistrations(volunteer.id);
      setMissions(registrations);
    } catch (error) {
      console.error('Error registering for mission:', error);
      toast({
        variant: "destructive",
        title: "Грешка",
        description: "Възникна проблем при записването за мисията"
      });
    }
  };

  // For demonstration, use placeholder missions if no registered missions are found
  const placeholderMissions = [
    {
      mission: {
        id: 1,
        title: "Транспорт на хранителни продукти",
        location: "София - Младост 4",
        date: "21.04.2025",
        status: "active",
        category: "transport"
      },
      status: "pending"
    },
    {
      mission: {
        id: 2,
        title: "Помощ в пакетиране на дарения",
        location: "София - Люлин 5",
        date: "25.04.2025",
        status: "upcoming",
        category: "logistics"
      },
      status: null
    },
    {
      mission: {
        id: 3,
        title: "Доставка на храна до центрове",
        location: "София - Център",
        date: "18.04.2025",
        status: "completed",
        category: "food"
      },
      status: "completed"
    }
  ];

  const displayMissions = missions.length > 0 ? missions : placeholderMissions;

  // Filter missions that match volunteer skills
  const relevantMissions = displayMissions.filter(item => 
    volunteer.can_help_with.some(skill => 
      item.mission.category.includes(skill) || skill === 'other'
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
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse">Зареждане на мисии...</div>
          </div>
        ) : relevantMissions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {relevantMissions.map((item, index) => (
              <Card key={index} className="overflow-hidden transition-all hover:shadow-lg">
                <div 
                  className={`h-2 w-full ${
                    item.mission.status === 'active' 
                      ? 'bg-green-500' 
                      : item.mission.status === 'upcoming' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-500'
                  }`}
                />
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{item.mission.title}</CardTitle>
                    <Badge variant="outline" className={
                      item.mission.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                        : item.mission.status === 'upcoming' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                    }>
                      {item.mission.status === 'active' && 'Активна'}
                      {item.mission.status === 'upcoming' && 'Предстояща'}
                      {item.mission.status === 'completed' && 'Приключена'}
                    </Badge>
                  </div>
                  <CardDescription>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.mission.location}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      <span>{item.mission.date}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    {item.status ? (
                      <Badge variant={
                        item.status === 'approved' ? 'default' : 
                        item.status === 'pending' ? 'secondary' : 
                        item.status === 'completed' ? 'outline' : 'destructive'
                      }>
                        {item.status === 'approved' && 'Одобрен'}
                        {item.status === 'pending' && 'В изчакване'}
                        {item.status === 'rejected' && 'Отхвърлен'}
                        {item.status === 'completed' && 'Завършена'}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">Незаписан</span>
                    )}
                    {(item.mission.status !== 'completed' && !item.status) && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRegister(item.mission.id)}
                      >
                        Запиши се
                      </Button>
                    )}
                    {(item.mission.status !== 'completed' && item.status) && (
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
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-lg">
            <p className="text-muted-foreground">Няма налични мисии, съответстващи на вашите умения в момента.</p>
            <p className="text-sm mt-2">Моля, проверете отново по-късно за нови възможности.</p>
          </div>
        )}
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
              За да се запишете за мисия, използвайте бутона "Запиши се" и изчакайте одобрение.
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
