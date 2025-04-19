
import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import AddGoodDeedDialog from './AddGoodDeedDialog';

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
  onAdd: () => void;
}

const StatsCard = ({ totalCount, todayCount, onAdd }: StatsCardProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 w-full">
      <Card className="flex items-center justify-between p-2 sm:flex-col sm:items-center sm:justify-center sm:p-4 text-center">
        <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1">Общо</CardTitle>
        <div className="text-base sm:text-xl font-bold ml-2 sm:ml-0">{totalCount}</div>
      </Card>
      
      <Card className="flex items-center justify-between p-2 sm:flex-col sm:items-center sm:justify-center sm:p-4 text-center">
        <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1">Днес</CardTitle>
        <div className="text-base sm:text-xl font-bold ml-2 sm:ml-0">{todayCount}</div>
      </Card>
      
      <Card 
        className="flex items-center justify-center p-2 sm:p-4"
        role="button"
      >
        <AddGoodDeedDialog onAdd={onAdd} />
      </Card>
    </div>
  );
};

export default StatsCard;
