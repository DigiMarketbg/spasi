
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { bg } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface BlogPost {
  id: string;
  title: string;
  short_description: string;
  image_url: string | null;
  created_at: string;
}

const BlogSection = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, short_description, image_url, created_at')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setBlogPosts(data || []);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

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

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const { scroll­Left, clientWidth } = carouselRef.current;
    const scrollTo = direction === 'left' 
      ? scroll­Left - clientWidth 
      : scroll­Left + clientWidth;
    
    carouselRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Блог статии</h2>
            <p className="text-muted-foreground">Полезна информация от нашия блог</p>
          </div>
          
          <div className="hidden sm:flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full" 
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div 
          ref={carouselRef} 
          className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-none"
        >
          {loading ? (
            Array(4).fill(0).map((_, idx) => (
              <div 
                key={idx} 
                className="min-w-[300px] md:min-w-[400px] glass rounded-xl overflow-hidden flex-shrink-0 snap-start"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-full mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            ))
          ) : blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <div 
                key={post.id} 
                className="min-w-[300px] md:min-w-[400px] glass rounded-xl overflow-hidden flex-shrink-0 snap-start"
              >
                <div className="h-48 bg-muted relative">
                  <div 
                    className="absolute inset-0 bg-center bg-cover" 
                    style={{ backgroundImage: post.image_url ? `url(${post.image_url})` : 'url(/lovable-uploads/51ca99de-ee36-4025-b765-57c98ece14ec.png)' }}
                  />
                </div>
                
                <div className="p-5">
                  <div className="text-sm text-muted-foreground mb-2">{formatDate(post.created_at)}</div>
                  <h3 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.short_description}</p>
                  
                  <Link to={`/blog/${post.id}`}>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-primary font-medium group"
                    >
                      <span>Прочети</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-10">
              <p className="text-muted-foreground">Все още няма публикувани блог статии.</p>
            </div>
          )}
        </div>
        
        {blogPosts.length > 0 && (
          <div className="flex justify-center mt-8">
            <Link to="/blog">
              <Button variant="outline">
                Всички блог статии
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
