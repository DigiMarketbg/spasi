
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
}

const StatsCard = ({ totalCount, todayCount }: StatsCardProps) => {
  return (
    <div className="flex justify-between w-full gap-4">
      <Card className="flex-1 flex items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-medium">Общо добрини</CardTitle>
        <div className="text-2xl font-bold">{totalCount}</div>
      </Card>
      
      <Card className="flex-1 flex items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-medium">Добрини днес</CardTitle>
        <div className="text-2xl font-bold">{todayCount}</div>
      </Card>
      
      <Card className="flex-1 flex items-center justify-between px-4 py-3">
        <CardTitle className="text-sm font-medium">Добави</CardTitle>
        <div className="text-2xl font-bold">+</div>
      </Card>
    </div>
  );
};

export default StatsCard;
