
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, UserCheck, MessageSquare, FileText, ChevronRight, Youtube, Users } from 'lucide-react';
import AdminDashboardCard from './AdminDashboardCard';

interface Props {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
}

const AdminDashboardGrid = ({ unreadMessagesCount, pendingRequestsCount }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Signals Card */}
      <AdminDashboardCard 
        title="Сигнали" 
        icon={AlertTriangle} 
        actionText="Управление на сигнали"
        actionLink="/admin"
        gradient="from-[#FF416C] to-[#FF4B2B]"
      />
      
      {/* Volunteers Card */}
      <AdminDashboardCard 
        title="Доброволци" 
        icon={UserCheck} 
        notificationCount={pendingRequestsCount}
        actionText="Управление на доброволци"
        actionLink="/admin/volunteers"
        gradient="from-[#11998e] to-[#38ef7d]"
      />
      
      {/* Messages Card */}
      <AdminDashboardCard 
        title="Съобщения" 
        icon={MessageSquare} 
        notificationCount={unreadMessagesCount}
        actionText="Виж съобщенията"
        actionLink="/admin#messages"
        gradient="from-[#396afc] to-[#2948ff]"
      />
      
      {/* Content Card */}
      <div className="glass rounded-xl p-6 transition-all duration-200 hover:shadow-md">
        <h3 className="text-lg font-medium mb-4">Съдържание</h3>
        <div className="space-y-2">
          <Link to="/admin/blog" className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>Блог статии</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          
          <Link to="/admin/videos" className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Youtube className="h-4 w-4 text-muted-foreground" />
              <span>Видеа</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
          
          <div className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted transition-colors">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>Партньори</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardGrid;
