
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  totalCount: number;
  todayCount: number;
}

const StatsCard = ({ totalCount, todayCount }: StatsCardProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Общо добрини</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Добрини днес</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCard;
