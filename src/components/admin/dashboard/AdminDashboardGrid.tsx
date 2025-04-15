
import React from 'react';
import AdminDashboardCard from '@/components/admin/dashboard/AdminDashboardCard';
import { Mail, Handshake as HandshakeIcon, AlertTriangle } from 'lucide-react';

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
        value={unreadMessagesCount}
        description="от контактната форма"
        icon={<Mail className="h-6 w-6 text-blue-500" />}
      />
      
      <AdminDashboardCard
        title="Чакащи заявки"
        value={pendingRequestsCount}
        description="за партньорство"
        icon={<HandshakeIcon className="h-6 w-6 text-green-500" />}
      />
      
      <AdminDashboardCard
        title="Опасни участъци"
        value={pendingDangerousAreasCount}
        description="чакащи одобрение"
        icon={<AlertTriangle className="h-6 w-6 text-orange-500" />}
      />
    </div>
  );
};

export default AdminDashboardGrid;
