
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Volunteer } from '@/types/volunteer';
import VolunteerFilters from '@/components/admin/volunteers/VolunteerFilters';
import VolunteersTable from '@/components/admin/volunteers/VolunteersTable';
import VolunteersPagination from '@/components/admin/volunteers/VolunteersPagination';

const AdminVolunteers = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Check if user is admin
  useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Достъп забранен",
        description: "Нямате право да достъпвате тази страница.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate, toast]);

  // Fetch volunteers
  const fetchVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      let query = supabase
        .from('volunteers')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });
      
      // Apply filters
      if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
      }
      
      if (cityFilter) {
        query = query.eq('city', cityFilter);
      }
      
      if (statusFilter === 'approved') {
        query = query.eq('is_approved', true);
      } else if (statusFilter === 'pending') {
        query = query.eq('is_approved', false);
      }
      
      // Apply pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
      
      const { data, error, count } = await query;

      if (error) throw error;
      
      setVolunteers(data || []);
      setTotalPages(count ? Math.ceil(count / pageSize) : 1);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на доброволците.",
        variant: "destructive",
      });
    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchVolunteers();
    }
  }, [isAdmin, currentPage, search, cityFilter, statusFilter]);

  const handleApprove = async (id: string, approved: boolean) => {
    try {
      const { error } = await supabase
        .from('volunteers')
        .update({ is_approved: approved })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: approved ? "Доброволецът е одобрен" : "Одобрението е отменено",
        description: approved 
          ? "Доброволецът вече има достъп до доброволческата зона." 
          : "Достъпът на доброволеца до доброволческата зона е отменен.",
        variant: "default",
      });

      // Update the local state
      setVolunteers(volunteers.map(vol => 
        vol.id === id ? { ...vol, is_approved: approved } : vol
      ));
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на статуса.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Зареждане...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Управление на доброволци</h1>
        
        <div className="space-y-6">
          {/* Filters */}
          <VolunteerFilters 
            search={search}
            setSearch={setSearch}
            cityFilter={cityFilter}
            setCityFilter={setCityFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            setCurrentPage={setCurrentPage}
          />
          
          {/* Volunteers Table */}
          <VolunteersTable 
            volunteers={volunteers}
            loadingVolunteers={loadingVolunteers}
            handleApprove={handleApprove}
          />
          
          {/* Pagination */}
          <VolunteersPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminVolunteers;
