
import { Card, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
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
    <div className="flex justify-between w-full gap-4">
      <Card className="flex-1 flex items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-medium sm:text-base">Общо добрини</CardTitle>
        <div className="text-2xl font-bold">{totalCount}</div>
      </Card>
      
      <Card className="flex-1 flex items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-medium sm:text-base">Добрини днес</CardTitle>
        <div className="text-2xl font-bold">{todayCount}</div>
      </Card>
      
      <Card 
        className="flex-1 p-0"
        role="button"
      >
        <Button 
          variant="destructive" 
          className="w-full h-full flex items-center justify-between px-4 py-3"
          onClick={handleAddDeed}
          disabled={isLoading}
        >
          <CardTitle className="text-sm font-medium sm:text-base text-white">Добави</CardTitle>
          <Plus className="h-5 w-5 text-white" />
        </Button>
      </Card>
    </div>
  );
};

export default StatsCard;
