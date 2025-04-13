
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Clock, 
  MessageCircle,
  Phone,
  MapPin,
  User,
  CalendarClock,
  FileText,
  Tag
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import SignalStatusActions from '@/components/admin/SignalStatusActions';
import SignalActions from '@/components/admin/SignalActions';
import SignalDetails from '@/components/admin/SignalDetails';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { detailCardStyles } from '@/lib/card-styles';

const SignalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchSignalDetails = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('signals')
          .select('*, profiles(*)')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Signal not found');
        
        setData(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load signal",
          variant: "destructive",
        });
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchSignalDetails();
  }, [id, navigate, toast]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy, HH:mm', { locale: bg });
    } catch {
      return new Date(dateString).toLocaleString('bg-BG');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">Изчакващ</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">В процес</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Завършен</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Отхвърлен</Badge>;
      default:
        return <Badge variant="outline">Неизвестен</Badge>;
    }
  };

  const renderContactInfo = () => {
    return (
      <div className="space-y-4 mt-2">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Име:</span> 
          <span>{data.profiles?.full_name || 'No name'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Телефон:</span> 
          <span>{data.profiles?.phone_number || 'No phone'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Град:</span> 
          <span>{data.profiles?.city || 'No city'}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-slate-500" />
          <span className="font-medium">Адрес:</span> 
          <span>{data.profiles?.address || 'No address'}</span>
        </div>
      </div>
    );
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Delete functionality would go here
    console.log('Delete signal:', data.id);
  };

  const handleToggleApproval = async (currentValue: boolean) => {
    // Toggle approval functionality would go here
    console.log('Toggle approval from', currentValue, 'to', !currentValue);
  };

  const handleToggleResolution = async (currentValue: boolean) => {
    // Toggle resolution functionality would go here
    console.log('Toggle resolution from', currentValue, 'to', !currentValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-24">
          <div className="space-y-6 animate-pulse">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="md:col-span-2 space-y-4">
                <Skeleton className="h-64 rounded-lg" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-32 rounded-lg" />
                <Skeleton className="h-32 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-24">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Signal not found</h1>
            <Button onClick={() => navigate('/admin')}>Back to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16 mt-16 md:mt-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{data.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <CalendarClock className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {formatDate(data.created_at)}
              </span>
              {getStatusBadge(data.status)}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
            >
              Back
            </Button>
            
            <SignalActions 
              isEditing={isEditing}
              onEdit={handleEdit}
              onCancel={handleCancel}
              onDelete={handleDelete}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Signal Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SignalDetails signal={data} formatDate={formatDate} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Status Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SignalStatusActions 
                  isApproved={data.is_approved}
                  isResolved={data.is_resolved}
                  onToggleApproval={handleToggleApproval}
                  onToggleResolution={handleToggleResolution}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderContactInfo()}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignalDetail;
