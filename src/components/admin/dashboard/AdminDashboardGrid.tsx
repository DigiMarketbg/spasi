
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardCard from './AdminDashboardCard';
import { BookOpen, Users, Bell, MessageCircle, Building } from 'lucide-react';

interface AdminDashboardGridProps {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
}

const AdminDashboardGrid = ({ unreadMessagesCount, pendingRequestsCount }: AdminDashboardGridProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <AdminDashboardCard
        title="Блог статии"
        description="Управление на блог статии, публикуване и редактиране на съдържание."
        icon={BookOpen}
        onClick={() => navigate('/admin/blog')}
      />
      
      <AdminDashboardCard
        title="Доброволци"
        description="Преглед и одобрение на заявки от доброволци."
        icon={Users}
        onClick={() => navigate('/admin/volunteers')}
      />
      
      <AdminDashboardCard
        title="Сигнали"
        description="Преглед и управление на всички подадени сигнали."
        icon={Bell}
      />
      
      <AdminDashboardCard
        title="Съобщения"
        description="Преглед на съобщения от контактната форма."
        icon={MessageCircle}
        badge={unreadMessagesCount}
      />
    </div>
  );
};

export default AdminDashboardGrid;
