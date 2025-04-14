
import React from 'react';
import { MapPin, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface VolunteersByCityProps {
  volunteersByCity: {[city: string]: {name: string, phone: string}[]};
  loading: boolean;
}

const VolunteersByCity = ({ volunteersByCity, loading }: VolunteersByCityProps) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse">Зареждане на доброволци...</div>
      </div>
    );
  }

  if (Object.keys(volunteersByCity).length === 0) {
    return (
      <div className="text-center py-8 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">Все още няма одобрени доброволци.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Object.entries(volunteersByCity).map(([city, volunteers]) => (
        <Card key={city} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/40 dark:to-blue-950/40">
            <div className="flex items-center">
              <MapPin className="text-purple-600 dark:text-purple-400 mr-2" />
              <CardTitle className="text-lg">{city}</CardTitle>
            </div>
            <CardDescription>{volunteers.length} доброволеца</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {volunteers.map((volunteer, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-muted/30 rounded-md">
                  <span>{volunteer.name}</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-3 w-3 mr-1" />
                    <span>{volunteer.phone}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VolunteersByCity;
