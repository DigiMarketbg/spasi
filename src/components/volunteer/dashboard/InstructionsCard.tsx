
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InstructionsCard = () => {
  return (
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
  );
};

export default InstructionsCard;
