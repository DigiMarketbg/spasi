
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboardCard from './AdminDashboardCard';
import { UsersRound, MessageSquare, Building, VideoIcon, FileText, Medal } from 'lucide-react';

interface AdminDashboardGridProps {
  unreadMessagesCount: number;
  pendingRequestsCount: number;
}

const AdminDashboardGrid: React.FC<AdminDashboardGridProps> = ({
  unreadMessagesCount,
  pendingRequestsCount
}) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      <AdminDashboardCard
        title="Потребители"
        description="Управление на потребителски профили"
        icon={UsersRound}
        onClick={() => navigate('/admin/volunteers')}
      />
      
      <AdminDashboardCard
        title="Видео съдържание"
        description="Управление на видеа"
        icon={VideoIcon}
        onClick={() => navigate('/admin/videos')}
      />
      
      <AdminDashboardCard
        title="Партньори"
        description="Управление на партньори"
        icon={Building}
        badgeCount={pendingRequestsCount}
        onClick={() => navigate('/admin/partners')}
      />
      
      <AdminDashboardCard
        title="Съобщения"
        description="Съобщения от контактната форма"
        icon={MessageSquare}
        badgeCount={unreadMessagesCount}
        onClick={() => navigate('/admin')}
      />
      
      <AdminDashboardCard
        title="Блог"
        description="Управление на блог публикации"
        icon={FileText}
        onClick={() => navigate('/admin/blog')}
      />
      
      <AdminDashboardCard
        title="Спасители"
        description="Управление на списъка със спасители"
        icon={Medal}
        onClick={() => navigate('/admin/rescuers')}
      />
    </div>
  );
};

export default AdminDashboardGrid;
