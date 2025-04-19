
import React, { useState } from 'react';
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Plus } from 'lucide-react';
import { addGoodDeed } from "@/lib/api/good-deeds";

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
  onAdd: () => void;
}

const StatsCard = ({ totalCount, todayCount, onAdd }: StatsCardProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddDeed = async () => {
    try {
      setIsLoading(true);
      await addGoodDeed();
      toast({
        title: "Благодарим ви!",
        description: "Вашето добро дело беше регистрирано успешно.",
      });
      onAdd();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Грешка",
        description: error instanceof Error ? error.message : "Възникна грешка при регистриране на доброто дело.",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <Button 
          className="w-8 h-8 sm:w-full sm:h-full bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center rounded-lg"
          onClick={handleAddDeed}
          disabled={isLoading}
        >
          <Plus size={14} strokeWidth={3} className="m-auto" />
        </Button>
      </Card>
    </div>
  );
};

export default StatsCard;
