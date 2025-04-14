
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface AdminDashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick?: () => void;
  badge?: number;
}

const AdminDashboardCard = ({ 
  title, 
  description, 
  icon: Icon,
  onClick,
  badge
}: AdminDashboardCardProps) => {
  return (
    <Card 
      className={onClick ? "hover:shadow-lg transition-all cursor-pointer" : "hover:shadow-lg transition-all"} 
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-medium">
          {title}
          {badge !== undefined && badge > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
              {badge}
            </span>
          )}
        </CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription>
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default AdminDashboardCard;
