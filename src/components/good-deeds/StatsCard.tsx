
import React from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
  onAdd: () => void;
}

const StatsCard = ({
  totalCount,
  todayCount,
  onAdd
}: StatsCardProps) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto space-x-4">
      <div className="flex space-x-3 flex-grow">
        <Card className="flex flex-col items-center justify-center p-2 text-center flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1 text-black">Общо</CardTitle>
          <div className="text-base sm:text-xl font-bold px-[2px]">{totalCount}</div>
        </Card>

        <Card className="flex flex-col items-center justify-center p-2 text-center flex-1">
          <CardTitle className="text-xs sm:text-sm font-medium sm:mb-1 text-black">Днес</CardTitle>
          <div className="text-base sm:text-xl font-bold px-[2px]">{todayCount}</div>
        </Card>
      </div>

      <Button
        onClick={onAdd}
        aria-label="Добави добро дело"
        className="w-10 h-10 rounded-lg bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center flex-shrink-0"
      >
        <Plus size={18} strokeWidth={3} />
      </Button>
    </div>
  );
};

export default StatsCard;
