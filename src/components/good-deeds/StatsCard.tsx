
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
      <Card className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
        <CardTitle className="text-xs sm:text-sm font-medium mb-1">Общо</CardTitle>
        <div className="text-lg sm:text-xl font-bold">{totalCount}</div>
      </Card>
      
      <Card className="flex flex-col items-center justify-center p-3 sm:p-4 text-center">
        <CardTitle className="text-xs sm:text-sm font-medium mb-1">Днес</CardTitle>
        <div className="text-lg sm:text-xl font-bold">{todayCount}</div>
      </Card>
      
      <Card 
        className="flex flex-col"
        role="button"
      >
        <Button 
          className="w-full h-full bg-[#ea384c] hover:bg-[#c52c3f] text-white flex items-center justify-center rounded-lg p-2"
          onClick={handleAddDeed}
          disabled={isLoading}
        >
          <Plus size={20} strokeWidth={3} />
        </Button>
      </Card>
    </div>
  );
};

export default StatsCard;
