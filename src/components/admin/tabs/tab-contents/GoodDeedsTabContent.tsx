import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface GoodDeedsTabContentProps {
  pendingCount?: number;
}

const GoodDeedsTabContent = ({ pendingCount = 0 }: GoodDeedsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Добри дела</CardTitle>
        <CardDescription>
          Управление на добрите дела в платформата
          {pendingCount > 0 && (
            <span className="ml-2 text-green-600 font-medium">
              ({pendingCount} чакащи одобрение)
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Good deeds management content will go here */}
        <p>Тук ще бъде интегрирано управлението на добри дела.</p>
      </CardContent>
    </Card>
  );
};

export default GoodDeedsTabContent;
