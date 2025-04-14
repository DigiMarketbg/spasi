
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2, Youtube, Plus, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  title: string;
  description?: string;
  youtube_url: string;
  is_published: boolean;
  created_at: string;
}

const AdminVideos = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtube_url: '',
    is_published: false
  });

  // Check admin access
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

  // Fetch videos data
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
        toast.error('Грешка при зареждане на видеата');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedVideo) {
        // Update existing video
        const { error } = await supabase
          .from('videos')
          .update({
            title: formData.title,
            description: formData.description,
            youtube_url: formData.youtube_url,
            is_published: formData.is_published
          })
          .eq('id', selectedVideo.id);
          
        if (error) throw error;
        toast.success('Видеото е успешно обновено');
      } else {
        // Create new video
        const { error } = await supabase
          .from('videos')
          .insert([{
            title: formData.title,
            description: formData.description,
            youtube_url: formData.youtube_url,
            is_published: formData.is_published
          }]);
          
        if (error) throw error;
        toast.success('Видеото е успешно добавено');
      }
      
      // Refresh videos list
      const { data } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
        
      setVideos(data || []);
      setIsDialogOpen(false);
      resetForm();
      
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Грешка при запазване на видеото');
    }
  };

  // Handle delete video
  const handleDelete = async (id: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете това видео?')) {
      try {
        const { error } = await supabase
          .from('videos')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Update videos list
        setVideos(videos.filter(video => video.id !== id));
        toast.success('Видеото е успешно изтрито');
        
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Грешка при изтриване на видеото');
      }
    }
  };

  // Handle edit video
  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description || '',
      youtube_url: video.youtube_url,
      is_published: video.is_published
    });
    setIsDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setSelectedVideo(null);
    setFormData({
      title: '',
      description: '',
      youtube_url: '',
      is_published: false
    });
  };

  // Handle new video
  const handleNewVideo = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Управление на видеа</h1>
            <Button onClick={handleNewVideo} className="flex items-center gap-2">
              <Plus size={18} />
              <span>Добави ново видео</span>
            </Button>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">Всички</TabsTrigger>
              <TabsTrigger value="published">Публикувани</TabsTrigger>
              <TabsTrigger value="unpublished">Непубликувани</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <VideosList 
                videos={videos} 
                loading={loading} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                getYouTubeVideoId={getYouTubeVideoId}
              />
            </TabsContent>
            
            <TabsContent value="published">
              <VideosList 
                videos={videos.filter(v => v.is_published)} 
                loading={loading} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                getYouTubeVideoId={getYouTubeVideoId}
              />
            </TabsContent>
            
            <TabsContent value="unpublished">
              <VideosList 
                videos={videos.filter(v => !v.is_published)} 
                loading={loading} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                getYouTubeVideoId={getYouTubeVideoId}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
      
      {/* Add/Edit Video Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo ? 'Редактиране на видео' : 'Добавяне на ново видео'}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Заглавие</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Въведете заглавие"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="youtube_url">YouTube URL</Label>
                <div className="relative">
                  <Input
                    id="youtube_url"
                    value={formData.youtube_url}
                    onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
                    placeholder="https://www.youtube.com/watch?v=..."
                    required
                    className="pl-10"
                  />
                  <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </div>
                
                {formData.youtube_url && getYouTubeVideoId(formData.youtube_url) && (
                  <div className="aspect-video w-full mt-2 rounded-md overflow-hidden border">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.youtube_url)}`}
                      title="YouTube Preview"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Описание (незадължително)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Въведете описание"
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                />
                <Label htmlFor="is_published">Публикувано</Label>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                Отказ
              </Button>
              <Button type="submit">
                {selectedVideo ? 'Запази промените' : 'Добави видео'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Videos list component
interface VideosListProps {
  videos: Video[];
  loading: boolean;
  onEdit: (video: Video) => void;
  onDelete: (id: string) => void;
  getYouTubeVideoId: (url: string) => string | null;
}

const VideosList = ({ videos, loading, onEdit, onDelete, getYouTubeVideoId }: VideosListProps) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        {Array(3).fill(0).map((_, idx) => (
          <div key={idx} className="border rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-20 w-36 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (videos.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <Youtube className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">Няма видеа</h3>
        <p className="text-muted-foreground">Натиснете "Добави ново видео", за да добавите видео.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-4">
      {videos.map((video) => (
        <div key={video.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center">
          <div className="sm:w-36 aspect-video rounded-md overflow-hidden">
            {getYouTubeVideoId(video.youtube_url) ? (
              <img 
                src={`https://img.youtube.com/vi/${getYouTubeVideoId(video.youtube_url)}/mqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <Youtube className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{video.title}</h3>
              {video.is_published ? (
                <Badge variant="outline" className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  Публикувано
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800">
                  Чернова
                </Badge>
              )}
            </div>
            
            {video.description && (
              <p className="text-muted-foreground text-sm line-clamp-1 mb-1">{video.description}</p>
            )}
            
            <a 
              href={video.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-primary hover:underline line-clamp-1"
            >
              {video.youtube_url}
            </a>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="h-9 px-3"
              onClick={() => onEdit(video)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Редактирай</span>
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="h-9 px-3 text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => onDelete(video.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Изтрий</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminVideos;
