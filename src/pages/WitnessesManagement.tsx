
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import AccessDenied from '@/components/admin/AccessDenied';
import AdminLayout from '@/components/admin/AdminLayout';
import WitnessesManagement from '@/components/admin/witnesses/WitnessesManagement';
import { useWitnessesData } from '@/components/admin/hooks/useWitnessesData';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a dedicated query client for this page
const queryClient = new QueryClient();

const WitnessesPage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { fetchWitnessesCount } = useWitnessesData(isAdmin || false);

  useEffect(() => {
    if (!user || !isAdmin) {
      navigate('/');
    } else {
      // Fetch the witnesses count when the component mounts
      fetchWitnessesCount();
    }
  }, [user, isAdmin, navigate, fetchWitnessesCount]);

  if (!user || !isAdmin) {
    return <AccessDenied />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AdminLayout 
        title="Управление на обяви за свидетели" 
        backLink="/admin"
      >
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
    </QueryClientProvider>
  );
};

export default WitnessesPage;
