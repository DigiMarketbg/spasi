
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignalsManagement from '@/components/admin/SignalsManagement';
import UsersManagement from '@/components/admin/UsersManagement';
import { BookOpen, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Admin = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();

  // If not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Достъпът отказан</h1>
            <p className="mb-6">Трябва да сте администратор, за да видите тази страница.</p>
            <Button onClick={() => navigate('/')}>Към началната страница</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">Административен панел</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/blog')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Блог статии</CardTitle>
                <BookOpen className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Управление на блог статии, публикуване и редактиране на съдържание.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/admin/volunteers')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Доброволци</CardTitle>
                <Users className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Преглед и одобрение на заявки от доброволци.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">Сигнали</CardTitle>
                <Bell className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Преглед и управление на всички подадени сигнали.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="signals">
            <TabsList>
              <TabsTrigger value="signals">Сигнали</TabsTrigger>
              <TabsTrigger value="users">Потребители</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signals" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на сигнали</CardTitle>
                  <CardDescription>
                    Преглед на всички сигнали в системата, одобрение и отбелязване като решени.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SignalsManagement />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Управление на потребители</CardTitle>
                  <CardDescription>
                    Преглед и управление на всички регистрирани потребители.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UsersManagement />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;
