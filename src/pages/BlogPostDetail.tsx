
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { bg } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  created_at: string;
}

const BlogPostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        if (!id) {
          setError('Не е предоставен ID на статията');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, content, image_url, created_at')
          .eq('id', id)
          .eq('is_published', true)
          .single();

        if (error) throw error;
        setBlogPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Статията не е намерена или не е публикувана');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: bg });
    } catch (error) {
      return dateString;
    }
  };

  // Split content into paragraphs for proper display
  const renderContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : <br key={index} />
    ));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow mt-16 px-4 py-12">
        <div className="container mx-auto max-w-4xl">
          <Link to="/blog">
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Обратно към блога
            </Button>
          </Link>
          
          {loading ? (
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-5 w-1/3 mb-8" />
              <Skeleton className="h-80 w-full mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive text-lg mb-6">{error}</p>
              <Link to="/blog">
                <Button>
                  Виж всички статии
                </Button>
              </Link>
            </div>
          ) : blogPost && (
            <article>
              <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
              <p className="text-muted-foreground mb-8">{formatDate(blogPost.created_at)}</p>
              
              {blogPost.image_url && (
                <div className="mb-8">
                  <img 
                    src={blogPost.image_url} 
                    alt={blogPost.title}
                    className="w-full h-auto max-h-[500px] object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="prose prose-lg max-w-none">
                {renderContent(blogPost.content)}
              </div>
            </article>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostDetail;
