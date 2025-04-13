
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClockIcon } from 'lucide-react';

const PendingStatus = () => {
  return (
    <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full">
            <ClockIcon className="h-10 w-10 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <CardTitle className="text-xl md:text-2xl text-center sm:text-left">Заявката ви е получена</CardTitle>
            <CardDescription className="text-base text-center sm:text-left">
              Очаква одобрение от администратор
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Благодарим ти! Заявката ти беше получена. След одобрение ще получиш достъп до доброволческата зона.
        </p>
        <p className="text-sm text-muted-foreground">
          Процесът по одобрение обикновено отнема 1-2 работни дни. 
          Ще получиш имейл с известие, когато заявката ти бъде прегледана.
        </p>
        <div className="bg-amber-100/50 dark:bg-amber-900/20 p-4 rounded-md">
          <p className="text-sm font-medium">
            Докато чакаш одобрение, можеш да разгледаш нашите актуални сигнали и да се 
            запознаеш с дейността ни.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PendingStatus;
