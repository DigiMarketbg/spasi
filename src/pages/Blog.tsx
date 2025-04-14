
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface BlogPost {
  id: string;
  title: string;
  short_description: string;
  image_url: string | null;
  created_at: string;
}

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);

  // Използвам useQuery за зареждане на постовете
  const { data: blogPosts, isLoading, error } = useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, short_description, image_url, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Обновяване на филтрираните постове при промяна на търсенето
  useEffect(() => {
    if (!blogPosts) return;
    
    if (searchQuery.trim()) {
      const filtered = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        post.short_description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts(blogPosts);
    }
  }, [searchQuery, blogPosts]);

  // Реализирам функция за моментално търсене
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Блог</h1>
          
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <Input
                type="text"
                placeholder="Търси в блога..."
                className="pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(6).fill(0).map((_, idx) => (
                <Card key={idx} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <CardContent className="p-5">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-6 w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <Skeleton className="h-8 w-24" />
                  </CardContent>
                </Card>
              ))
            ) : error ? (
              <div className="col-span-full text-center py-12">
                <p className="text-destructive text-lg">Грешка при зареждане на блог статиите</p>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              filteredPosts.map(post => (
                <Card key={post.id} className="overflow-hidden h-full flex flex-col">
                  <div className="h-48 bg-muted relative">
                    <div 
                      className="absolute inset-0 bg-center bg-cover" 
                      style={{ backgroundImage: post.image_url ? `url(${post.image_url})` : 'url(/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png)' }}
                    />
                  </div>
                  <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="text-sm text-muted-foreground mb-2">{formatDate(post.created_at)}</div>
                    <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                    <p className="text-muted-foreground mb-4 flex-grow">{post.short_description}</p>
                    <Link to={`/blog/${post.id}`}>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-primary font-medium group"
                      >
                        <span>Прочети</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery.trim() ? 'Няма намерени резултати' : 'Все още няма публикувани блог статии.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
