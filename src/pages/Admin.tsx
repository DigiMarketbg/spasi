
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
import { Check, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signals, setSignals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

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

  // Fetch signals
  const fetchSignals = async () => {
    setLoadingSignals(true);
    try {
      const { data, error } = await supabase
        .from('signals')
        .select('*, profiles:user_id(full_name, email)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSignals(data || []);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на сигналите.",
        variant: "destructive",
      });
    } finally {
      setLoadingSignals(false);
    }
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при зареждането на потребителите.",
        variant: "destructive",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchSignals();
      fetchUsers();
    }
  }, [isAdmin]);

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

      // Update local state
      setSignals(signals.map(signal => 
        signal.id === id ? { ...signal, is_approved: !currentStatus } : signal
      ));
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

      // Update local state
      setSignals(signals.map(signal => 
        signal.id === id ? { ...signal, is_resolved: !currentStatus } : signal
      ));
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на сигнала.",
        variant: "destructive",
      });
    }
  };

  // Toggle user admin status
  const toggleUserAdminStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_admin: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Успешно",
        description: !currentStatus 
          ? "Потребителят е направен администратор." 
          : "Администраторските права на потребителя са премахнати.",
      });

      // Update local state
      setUsers(users.map(user => 
        user.id === id ? { ...user, is_admin: !currentStatus } : user
      ));
    } catch (error: any) {
      toast({
        title: "Грешка",
        description: error.message || "Възникна проблем при обновяването на потребителя.",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
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
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Администраторски панел</h1>
        
        <Tabs defaultValue="signals">
          <TabsList className="mb-6">
            <TabsTrigger value="signals">Сигнали</TabsTrigger>
            <TabsTrigger value="users">Потребители</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signals">
            <Card>
              <CardHeader>
                <CardTitle>Управление на сигнали</CardTitle>
                <CardDescription>
                  Преглеждайте и управлявайте всички сигнали в системата
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSignals ? (
                  <div className="text-center py-8">Зареждане на сигналите...</div>
                ) : signals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
                    <p>Няма сигнали в системата</p>
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
                        {signals.map((signal) => (
                          <TableRow key={signal.id}>
                            <TableCell className="font-medium">{signal.title}</TableCell>
                            <TableCell>{signal.category}</TableCell>
                            <TableCell>{signal.city}</TableCell>
                            <TableCell>{signal.profiles?.full_name || signal.profiles?.email || 'Неизвестен'}</TableCell>
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
                              <div className="flex gap-2">
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
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Управление на потребители</CardTitle>
                <CardDescription>
                  Преглеждайте и управлявайте всички потребители в системата
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingUsers ? (
                  <div className="text-center py-8">Зареждане на потребителите...</div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
                    <p>Няма потребители в системата</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Име</TableHead>
                          <TableHead>Имейл</TableHead>
                          <TableHead>Регистриран на</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.full_name || 'Няма име'}</TableCell>
                            <TableCell>{user.email || 'Няма имейл'}</TableCell>
                            <TableCell>{user.created_at ? formatDate(user.created_at) : 'Неизвестно'}</TableCell>
                            <TableCell>
                              <Badge variant={user.is_admin ? "default" : "outline"}>
                                {user.is_admin ? 'Администратор' : 'Потребител'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button 
                                size="sm" 
                                variant={user.is_admin ? "destructive" : "default"}
                                onClick={() => toggleUserAdminStatus(user.id, user.is_admin)}
                              >
                                {user.is_admin ? 'Премахни админ права' : 'Направи администратор'}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
