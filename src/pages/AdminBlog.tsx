
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  short_description: string;
  content: string;
  image_url: string | null;
  created_at: string;
  is_published: boolean;
}

const AdminBlog = () => {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState(false);
  
  // Form fields
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    // Redirect non-admin users
    if (user && profile && !isAdmin) {
      navigate('/');
      return;
    }

    const fetchBlogPosts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast({
          variant: 'destructive',
          title: 'Грешка при зареждане на статиите',
          description: 'Моля, опитайте отново по-късно.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, [user, profile, isAdmin, navigate, toast]);

  // Format dates
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: bg
      });
    } catch (error) {
      return dateString;
    }
  };

  // Edit post
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost(false);
    setTitle(post.title);
    setShortDescription(post.short_description);
    setContent(post.content);
    setImageUrl(post.image_url || '');
    setIsPublished(post.is_published);
  };

  // Create new post
  const handleNewPost = () => {
    setEditingPost(null);
    setNewPost(true);
    setTitle('');
    setShortDescription('');
    setContent('');
    setImageUrl('');
    setIsPublished(false);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingPost(null);
    setNewPost(false);
  };

  // Save changes or create new post
  const handleSave = async () => {
    if (!user) return;

    try {
      if (newPost) {
        // Create new post
        const { data, error } = await supabase
          .from('blog_posts')
          .insert({
            title,
            short_description: shortDescription,
            content,
            image_url: imageUrl || null,
            is_published: isPublished,
            author_id: user.id
          })
          .select();

        if (error) throw error;
        
        toast({
          title: 'Статията е създадена',
          description: 'Новата статия беше добавена успешно.'
        });
        
        // Update the local state with the new post
        if (data) {
          setBlogPosts([data[0], ...blogPosts]);
        }
      } else if (editingPost) {
        // Update existing post
        const { error } = await supabase
          .from('blog_posts')
          .update({
            title,
            short_description: shortDescription,
            content,
            image_url: imageUrl || null,
            is_published: isPublished
          })
          .eq('id', editingPost.id);

        if (error) throw error;
        
        toast({
          title: 'Статията е обновена',
          description: 'Промените бяха запазени успешно.'
        });
        
        // Update the local state
        setBlogPosts(blogPosts.map(post => 
          post.id === editingPost.id 
            ? { 
                ...post, 
                title, 
                short_description: shortDescription, 
                content, 
                image_url: imageUrl || null, 
                is_published: isPublished 
              } 
            : post
        ));
      }

      // Reset form
      handleCancel();
    } catch (error) {
      console.error('Error saving blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Грешка при запазване',
        description: 'Моля, опитайте отново по-късно.'
      });
    }
  };

  // Delete post
  const handleDelete = async (id: string) => {
    if (!confirm('Сигурни ли сте, че искате да изтриете тази статия?')) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: 'Статията е изтрита',
        description: 'Статията беше изтрита успешно.'
      });
      
      // Update the local state
      setBlogPosts(blogPosts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      toast({
        variant: 'destructive',
        title: 'Грешка при изтриване',
        description: 'Моля, опитайте отново по-късно.'
      });
    }
  };

  // Toggle publish status
  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const newStatus = !post.is_published;
      
      const { error } = await supabase
        .from('blog_posts')
        .update({ is_published: newStatus })
        .eq('id', post.id);

      if (error) throw error;
      
      toast({
        title: newStatus ? 'Статията е публикувана' : 'Статията е скрита',
        description: newStatus 
          ? 'Статията вече е видима за всички потребители.' 
          : 'Статията вече не е видима за потребителите.'
      });
      
      // Update the local state
      setBlogPosts(blogPosts.map(p => 
        p.id === post.id ? { ...p, is_published: newStatus } : p
      ));
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        variant: 'destructive',
        title: 'Грешка при промяна на статуса',
        description: 'Моля, опитайте отново по-късно.'
      });
    }
  };

  // If not logged in or not admin
  if (!loading && (!user || !isAdmin)) {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Управление на блог</h1>
            {!newPost && !editingPost && (
              <Button onClick={handleNewPost}>
                <Plus className="mr-2 h-4 w-4" />
                Нова статия
              </Button>
            )}
          </div>
          
          {(newPost || editingPost) ? (
            <Card>
              <CardHeader>
                <CardTitle>{newPost ? 'Нова статия' : 'Редактиране на статия'}</CardTitle>
                <CardDescription>
                  {newPost 
                    ? 'Попълнете формата, за да създадете нова статия' 
                    : 'Редактирайте информацията за статията'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Заглавие</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Заглавие на статията" 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="shortDescription">Кратко описание</Label>
                    <Textarea 
                      id="shortDescription" 
                      value={shortDescription} 
                      onChange={(e) => setShortDescription(e.target.value)} 
                      placeholder="Кратко описание (100-200 символа)" 
                      rows={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {shortDescription.length}/200 символа
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Съдържание</Label>
                    <Textarea 
                      id="content" 
                      value={content} 
                      onChange={(e) => setContent(e.target.value)} 
                      placeholder="Съдържание на статията..." 
                      rows={10}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="imageUrl">URL към снимка (по избор)</Label>
                    <Input 
                      id="imageUrl" 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)} 
                      placeholder="https://example.com/image.jpg" 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="isPublished" 
                      checked={isPublished} 
                      onCheckedChange={setIsPublished} 
                    />
                    <Label htmlFor="isPublished">Публикувана</Label>
                  </div>
                  
                  <div className="flex gap-4 pt-4">
                    <Button onClick={handleSave}>Запази</Button>
                    <Button variant="outline" onClick={handleCancel}>Отказ</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : loading ? (
            <div className="text-center py-12">
              <p>Зареждане...</p>
            </div>
          ) : blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Все още няма създадени статии</p>
              <Button onClick={handleNewPost}>
                <Plus className="mr-2 h-4 w-4" />
                Създайте първата статия
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Заглавие</TableHead>
                    <TableHead>Дата</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead className="text-right">Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map(post => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{formatDate(post.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Switch 
                            checked={post.is_published} 
                            onCheckedChange={() => handleTogglePublish(post)}
                            className="mr-2"
                          />
                          <span>
                            {post.is_published ? 'Публикувана' : 'Чернова'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(post)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminBlog;
