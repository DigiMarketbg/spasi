
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DangerousAreaSubmitConfirmationProps {
  onAddAnother: () => void;
}

const DangerousAreaSubmitConfirmation: React.FC<DangerousAreaSubmitConfirmationProps> = ({ 
  onAddAnother 
}) => {
  return (
    <Card className="w-full shadow-lg border-none bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl flex items-center gap-2 text-primary">
          <CheckCircle className="h-6 w-6 text-green-500" />
          Успешно изпращане
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <p className="text-muted-foreground">
            Благодарим ви, че докладвахте опасен участък. Вашият сигнал е успешно изпратен и ще бъде прегледан от нашите администратори.
          </p>
          
          <div className="mt-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-md flex items-start gap-3">
            <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Статус: В изчакване на одобрение</h4>
              <p className="text-xs text-muted-foreground mt-1">
                След проверка от администратор, сигналът ще бъде публикуван в секцията "Опасни участъци".
                Това може да отнеме до 24 часа.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button variant="outline" onClick={onAddAnother}>
            Докладвай друг участък
          </Button>
          
          <Link to="/dangerous-areas">
            <Button>
              Към всички участъци
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default DangerousAreaSubmitConfirmation;
