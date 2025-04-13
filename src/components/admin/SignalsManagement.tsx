
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Check, X, AlertTriangle, Eye, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface SignalData {
  id: string;
  title: string;
  category: string;
  city: string;
  created_at: string;
  is_approved: boolean;
  is_resolved: boolean;
  user_id: string;
  user_full_name?: string;
  user_email?: string;
}

interface SignalsManagementProps {
  signals: SignalData[];
  loadingSignals: boolean;
  onRefresh: () => void;
}

// Categories array for filtering
const CATEGORIES = [
  "Всички категории",
  "Бедствие",
  "Кръводаряване",
  "Опасност",
  "Кражба",
  "Изгубени",
  "Доброволци",
  "Друго"
];

// Cities array for filtering
const CITIES = [
  "Всички градове",
  "София",
  "Пловдив",
  "Варна",
  "Бургас",
  "Русе",
  "Стара Загора",
  "Плевен",
  "Друг"
];

const SignalsManagement = ({ signals, loadingSignals, onRefresh }: SignalsManagementProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Всички категории");
  const [cityFilter, setCityFilter] = useState("Всички градове");
  const [statusFilter, setStatusFilter] = useState("all");

  // Toggle signal approval
  const toggleSignalApproval = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_approved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е одобрен." : "Одобрението на сигнала е премахнато.",
      });

      // Trigger refresh of signals data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Toggle signal resolution
  const toggleSignalResolution = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('signals')
        .update({ is_resolved: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus ? "Сигналът е маркиран като разрешен." : "Сигналът е маркиран като неразрешен.",
      });

      // Trigger refresh of signals data
      onRefresh();
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // View signal details
  const viewSignalDetails = (id: string) => {
    navigate(`/admin/signals/${id}`);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  // Filter signals based on search, category, city, and status filters
  const filteredSignals = signals.filter(signal => {
    // Search term filter (title, category, city)
    const matchesSearch = !searchTerm 
      || signal.title.toLowerCase().includes(searchTerm.toLowerCase())
      || signal.category.toLowerCase().includes(searchTerm.toLowerCase())
      || signal.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Category filter
    const matchesCategory = categoryFilter === "Всички категории" || signal.category === categoryFilter;
    
    // City filter
    const matchesCity = cityFilter === "Всички градове" || signal.city === cityFilter;
    
    // Status filter
    let matchesStatus = true;
    if (statusFilter === "approved") {
      matchesStatus = signal.is_approved;
    } else if (statusFilter === "unapproved") {
      matchesStatus = !signal.is_approved;
    } else if (statusFilter === "resolved") {
      matchesStatus = signal.is_resolved;
    } else if (statusFilter === "unresolved") {
      matchesStatus = !signal.is_resolved;
    }
    
    return matchesSearch && matchesCategory && matchesCity && matchesStatus;
  });

  // Get current signals for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSignals = filteredSignals.slice(indexOfFirstItem, indexOfLastItem);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredSignals.length / itemsPerPage);

  // Handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // Generate page numbers array
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, cityFilter, statusFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление на сигнали</CardTitle>
        <CardDescription>
          Преглеждайте и управлявайте всички сигнали в системата
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Търси по заглавие, категория или град..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Категория" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={cityFilter} 
                onValueChange={setCityFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Град" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Всички</SelectItem>
                  <SelectItem value="approved">Одобрени</SelectItem>
                  <SelectItem value="unapproved">Неодобрени</SelectItem>
                  <SelectItem value="resolved">Разрешени</SelectItem>
                  <SelectItem value="unresolved">Неразрешени</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Показване на {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredSignals.length)} от {filteredSignals.length} сигнала
            </p>
            
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => setItemsPerPage(parseInt(value))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Брой на страница" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 на страница</SelectItem>
                <SelectItem value="10">10 на страница</SelectItem>
                <SelectItem value="25">25 на страница</SelectItem>
                <SelectItem value="50">50 на страница</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loadingSignals ? (
          <div className="text-center py-8">Зареждане на сигналите...</div>
        ) : filteredSignals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
            <p>Няма намерени сигнали</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Заглавие</TableHead>
                  <TableHead>Категория</TableHead>
                  <TableHead>Град</TableHead>
                  <TableHead>Подал</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSignals.map((signal) => (
                  <TableRow key={signal.id}>
                    <TableCell className="font-medium">{signal.title}</TableCell>
                    <TableCell>{signal.category}</TableCell>
                    <TableCell>{signal.city}</TableCell>
                    <TableCell>{signal.user_full_name || signal.user_email || 'Неизвестен'}</TableCell>
                    <TableCell>{formatDate(signal.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={signal.is_approved ? "default" : "outline"}>
                          {signal.is_approved ? 'Одобрен' : 'Неодобрен'}
                        </Badge>
                        <Badge variant={signal.is_resolved ? "success" : "destructive"}>
                          {signal.is_resolved ? 'Разрешен' : 'Неразрешен'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 flex-wrap">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => viewSignalDetails(signal.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Детайли
                        </Button>
                        <Button 
                          size="sm" 
                          variant={signal.is_approved ? "destructive" : "default"}
                          onClick={() => toggleSignalApproval(signal.id, signal.is_approved)}
                        >
                          {signal.is_approved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {signal.is_approved ? 'Премахни одобрение' : 'Одобри'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant={signal.is_resolved ? "destructive" : "default"}
                          onClick={() => toggleSignalResolution(signal.id, signal.is_resolved)}
                        >
                          {signal.is_resolved ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          {signal.is_resolved ? 'Маркирай като неразрешен' : 'Маркирай като разрешен'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-6">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {pageNumbers.map(number => (
                    <PaginationItem key={number}>
                      <PaginationLink 
                        isActive={currentPage === number}
                        onClick={() => paginate(number)}
                      >
                        {number}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SignalsManagement;
