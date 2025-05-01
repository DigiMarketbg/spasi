
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import AccessDenied from '@/components/admin/AccessDenied';
import AdminLayout from '@/components/admin/AdminLayout';
import WitnessesManagement from '@/components/admin/witnesses/WitnessesManagement';
import { useWitnessesData } from '@/components/admin/hooks/useWitnessesData';

const WitnessesPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { fetchWitnessesCount } = useWitnessesData(isAdmin || false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    }
  }, [user, isAdmin, navigate]);

  if (!user || !isAdmin) {
    return <AccessDenied />;
  }

  return (
    <AdminLayout title="Управление на обяви за свидетели" backLink="/admin">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold tracking-tight">
          Управление на обяви за свидетели
        </h2>
        <p className="text-muted-foreground">
          Преглеждайте, одобрявайте и отхвърляйте обяви за свидетели.
        </p>

        <WitnessesManagement onRefresh={fetchWitnessesCount} />
      </div>
    </AdminLayout>
  );
};

export default WitnessesPage;
