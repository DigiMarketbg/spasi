
import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
  onAdd: () => void;
}

const StatsCard = ({ totalCount, todayCount, onAdd }: StatsCardProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center sm:space-x-4 w-full">
      <div className="flex flex-row space-x-3 sm:space-x-4 flex-grow max-w-md mx-auto sm:mx-0">
        <Card className="flex items-center justify-center p-2 text-center flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1">Общо</CardTitle>
          <div className="text-base sm:text-xl font-bold ml-2 sm:ml-0">{totalCount}</div>
        </Card>

        <Card className="flex items-center justify-center p-2 text-center flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1">Днес</CardTitle>
          <div className="text-base sm:text-xl font-bold ml-2 sm:ml-0">{todayCount}</div>
        </Card>
      </div>
      <div className="flex justify-center sm:justify-start pt-4 sm:pt-0">
        <Button
          onClick={onAdd}
          aria-label="Добави добро дело"
          className="w-10 h-10 rounded-lg bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center"
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
};

export default StatsCard;

