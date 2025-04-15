
import React from 'react';
import AdminDashboardCard from '@/components/admin/dashboard/AdminDashboardCard';
import { Mail, Handshake, AlertTriangle } from 'lucide-react';

interface AdminDashboardGridProps {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
  pendingDangerousAreasCount?: number;
}

const AdminDashboardGrid = ({ 
  unreadMessagesCount, 
  pendingRequestsCount,
  pendingDangerousAreasCount = 0
}: AdminDashboardGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      <AdminDashboardCard
        title="Непрочетени съобщения"
        badgeCount={unreadMessagesCount}
        description="от контактната форма"
        icon={Mail}
      />
      
      <AdminDashboardCard
        title="Чакащи заявки"
        badgeCount={pendingRequestsCount}
        description="за партньорство"
        icon={Handshake}
      />
      
      <AdminDashboardCard
        title="Опасни участъци"
        badgeCount={pendingDangerousAreasCount}
        description="чакащи одобрение"
        icon={AlertTriangle}
      />
    </div>
  );
};

export default AdminDashboardGrid;
