
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Partner } from '@/types/partner';
import { getPartners, addPartner, updatePartner, deletePartner } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PartnerForm from '@/components/admin/partners/PartnerForm';
import PartnersTable from '@/components/admin/partners/PartnersTable';

const AdminPartners = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState<Partner | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchPartners();
    }
  }, [isAdmin]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await getPartners();
      setPartners(data);
    } catch (error) {
      console.error('Error fetching partners:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно зареждане на партньори',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPartner = async (partnerData: { company_name: string, logo_url: string, website_url?: string }) => {
    try {
      await addPartner(partnerData);
      setIsAddDialogOpen(false);
      fetchPartners();
      toast({
        title: 'Успех',
        description: 'Партньорът е добавен успешно',
      });
    } catch (error) {
      console.error('Error adding partner:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно добавяне на партньор',
        variant: 'destructive',
      });
    }
  };

  const handleUpdatePartner = async (partnerData: { company_name: string, logo_url: string, website_url?: string }) => {
    if (!currentPartner) return;
    
    try {
      await updatePartner(currentPartner.id, partnerData);
      setIsEditDialogOpen(false);
      fetchPartners();
      toast({
        title: 'Успех',
        description: 'Партньорът е обновен успешно',
      });
    } catch (error) {
      console.error('Error updating partner:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно обновяване на партньор',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePartner = async (id: string) => {
    try {
      await deletePartner(id);
      fetchPartners();
      toast({
        title: 'Успех',
        description: 'Партньорът е изтрит успешно',
      });
    } catch (error) {
      console.error('Error deleting partner:', error);
      toast({
        title: 'Грешка',
        description: 'Неуспешно изтриване на партньор',
        variant: 'destructive',
      });
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsEditDialogOpen(true);
  };

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
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Управление на партньори</h1>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Добави партньор
            </Button>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Партньори</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Зареждане...</p>
                </div>
              ) : (
                <PartnersTable 
                  partners={partners} 
                  onDelete={handleDeletePartner} 
                  onEdit={handleEditPartner} 
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Add Partner Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Добави нов партньор</DialogTitle>
          </DialogHeader>
          <PartnerForm onSubmit={handleAddPartner} submitLabel="Добави" />
        </DialogContent>
      </Dialog>
      
      {/* Edit Partner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактирай партньор</DialogTitle>
          </DialogHeader>
          {currentPartner && (
            <PartnerForm 
              onSubmit={handleUpdatePartner} 
              initialData={currentPartner} 
              submitLabel="Запази промените" 
            />
          )}
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminPartners;
