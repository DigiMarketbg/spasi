
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Volunteer, BULGARIAN_CITIES } from '@/types/volunteer';
import { CheckIcon, EyeIcon, XIcon } from 'lucide-react';

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/3">
              <Input
                placeholder="Търсене по име или имейл..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full"
              />
            </div>
            
            <div className="md:w-1/4">
              <Select
                value={cityFilter}
                onValueChange={(value) => {
                  setCityFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Филтър по град" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Всички градове</SelectItem>
                  {BULGARIAN_CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:w-1/4">
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Филтър по статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Всички</SelectItem>
                  <SelectItem value="approved">Одобрени</SelectItem>
                  <SelectItem value="pending">Чакащи</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearch('');
                setCityFilter('');
                setStatusFilter('');
                setCurrentPage(1);
              }}
              className="md:w-auto"
            >
              Изчисти филтрите
            </Button>
          </div>
          
          {/* Volunteers Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Име</TableHead>
                  <TableHead>Имейл</TableHead>
                  <TableHead className="hidden md:table-cell">Град</TableHead>
                  <TableHead className="hidden md:table-cell">Помощ в</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingVolunteers ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="animate-pulse">Зареждане...</div>
                    </TableCell>
                  </TableRow>
                ) : volunteers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Няма намерени доброволци съответстващи на филтрите.
                    </TableCell>
                  </TableRow>
                ) : (
                  volunteers.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell>{volunteer.full_name}</TableCell>
                      <TableCell>{volunteer.email}</TableCell>
                      <TableCell className="hidden md:table-cell">{volunteer.city}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {volunteer.can_help_with.map(skill => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill === 'transport' && 'Транспорт'}
                              {skill === 'food' && 'Храна'}
                              {skill === 'blood' && 'Кръв'}
                              {skill === 'logistics' && 'Логистика'}
                              {skill === 'other' && 'Друго'}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={volunteer.is_approved ? "default" : "outline"}>
                          {volunteer.is_approved ? 'Одобрен' : 'Чакащ'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              // View details functionality to be implemented
                              toast({
                                title: "Информация",
                                description: "Функционалността за преглед на детайли ще бъде добавена скоро.",
                              });
                            }}
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Button>
                          {volunteer.is_approved ? (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApprove(volunteer.id, false)}
                            >
                              <XIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          ) : (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleApprove(volunteer.id, true)}
                            >
                              <CheckIcon className="h-4 w-4 text-green-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  Предишна
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show current page and 1 page before and after
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1 ||
                             (page === 2 && currentPage === 1) ||
                             (page === totalPages - 1 && currentPage === totalPages);
                    })
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </React.Fragment>
                    ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                >
                  Следваща
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminVolunteers;
