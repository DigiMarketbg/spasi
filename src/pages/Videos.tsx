
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

interface Video {
  id: string;
  title: string;
  youtube_url: string;
  created_at: string;
  description?: string;
}

const Videos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setVideos(data || []);
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow mt-20 container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Доброто</h1>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Вдъхновяващи видеа, които показват силата на доброто и как можем да направим светът по-добро място
        </p>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array(6).fill(0).map((_, idx) => (
              <div key={idx} className="glass rounded-lg overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.map((video) => {
              const videoId = getYouTubeVideoId(video.youtube_url);
              return (
                <div key={video.id} className="glass rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full">
                    {videoId && (
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-muted-foreground line-clamp-3">{video.description}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Все още няма публикувани видеа.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Videos;
