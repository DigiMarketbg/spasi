
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DisclaimerNote = () => {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
      <p>
        <strong>Забележка:</strong> Всички доклади за опасни участъци се преглеждат от нашите администратори преди публикуване. Одобрените доклади ще бъдат видими за всички потребители.
      </p>
    </div>
  );
};

export default DisclaimerNote;
